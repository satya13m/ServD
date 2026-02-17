"use server"
import { freeMealRecommendations, proLimit } from "@/lib/arject";
import { checkUser } from "@/lib/checkUser";
import { DUMMY_RECIPE_RESPONSE } from "@/lib/dummy";
import { request } from "@arcjet/next";
import { GoogleGenAI } from "@google/genai";



const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const genAI = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});



export async function getRecipesByPantryIngredients(){
    try {
      //if user is logged in or not
      const user = await checkUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const isPro = user.subscriptionTier === "pro";
      const arcjetClient = isPro ? proLimit : freeMealRecommendations;
      //create a request object for Arcjet
      const req = await request();

      const decision = await arcjetClient.protect(req, {
        userId: user.clerkId,
        requested: 1,
      });

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          throw new Error(
            isPro
              ? "Monthly scan limit reached. Please contact support."
              : "Monthly scan limit reached. Upgrade to Pro for unlimited scans.",
          );
        }
        throw new Error("Request denied by security system");
      }

      const pantryResponse = await fetch(
        `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          cache: "no-store",
        },
      );

      if (!pantryResponse.ok) {
        throw new Error("Failed to fetch pantry items");
      }

      const pantryData = await pantryResponse.json();

      if (!pantryData.data || pantryData.data.length === 0) {
        return {
          success: false,
          message: "Your Pantry is empty. Add ingredients first!",
        };
      }

      // ✅ FIXED MAPPING
      const ingredients = pantryData.data.map((item) => item.name).join(", ");

      //API-CALL

const prompt = `
You are a professional chef. Given these available ingredients: ${ingredients}

Suggest 5 recipes that can be made primarily with these ingredients. It's okay if the recipes need 1-2 common pantry staples (salt, pepper, oil, etc.) that aren't listed.

Return ONLY a valid JSON array (no markdown, no explanations):
[
  {
    "title": "Recipe name",
    "description": "Brief 1-2 sentence description",
    "matchPercentage": 85,
    "missingIngredients": ["ingredient1", "ingredient2"],
    "category": "breakfast|lunch|dinner|snack|dessert",
    "cuisine": "italian|chinese|mexican|etc",
    "prepTime": 20,
    "cookTime": 30,
    "servings": 4
  }
]

Rules:
- matchPercentage should be 70-100% (how many listed ingredients are used)
- missingIngredients should be common items or optional additions
- Sort by matchPercentage descending
- Make recipes realistic and delicious
`;

     
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const text = result.text;

      let recipeSuggestions;

      try {
        const cleanText = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        recipeSuggestions = JSON.parse(cleanText);
      } catch (error) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Failed to generate recipe. Please try again.");
      }

      return{
        success:true,
        recipes:recipeSuggestions,
        ingredientsUsed : ingredients,
        recommendationsLimit : isPro?"unlimited":5,
        message:`Found ${recipeSuggestions.length} recipes you can make!`
      }
    } catch (error) {
        console.error("❌ Error in getRecipesByPantryIngredients:", error);
        throw new Error(error.message || "Failed to get recipe suggestions");
    }
}

function normalizeTitle(title) {
  return title
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

//Helper function to fetch image from Unsplash
export async function fetchRecipeImage(recipeName){
  try {
    if(!UNSPLASH_ACCESS_KEY){
      console.warn("UNSPLASH_ACCESS_KEY not set, skipping image fetch");
    }

    const searchQuery = `${recipeName}`;

    //trigger the api
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,{
      headers:{
        Authorization:`Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if(!response.ok){
      console.error("Unsplash API error",response.statusText)
      return "";
    }

    const data = await response.json();

    if(data.results && data.results.length > 0){
      const photo = data.results[0];
      console.log("Found Unsplash image:",photo.urls.regular);
      return photo.urls.regular;
    }

    console.log("No Unsplash image found for:",recipeName)
    return "";
  } catch (error) {
    console.error("Error fteching Unsplash image".error)
    return "";
  }
}

//Get or generate recipe details
export async function getOrGenerateRecipe(formData){
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const isPro = user.subscriptionTier === "pro";

    const recipeName = formData.get("recipeName");
    if (!recipeName) {
      throw new Error("Recipe name is required");
    }

    //Normalize the title (apple cake - Apple Cake)
    const normalizedTitle = normalizeTitle(recipeName);

    //Step-1 : Check if recipe already exists in DB (case -insensitive search)
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/recipes?filters[title][$eqi]=${encodeURIComponent(
        normalizedTitle,
      )}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (searchResponse.ok) {
      //check for DB Storage
      const searchData = await searchResponse.json();

      if (searchData.data && searchData.data.length > 0) {
        //Check if user has saved this recipe
        const savedRecipeResponse = await fetch(
          `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${searchData.data[0].id}`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
          },
        );

        let isSaved = false;
        if (savedRecipeResponse.ok) {
          const savedRecipeData = await savedRecipeResponse.json();
          isSaved = savedRecipeData.data && savedRecipeData.data.length > 0;
        }

        return {
          success: true,
          recipe: searchData.data[0],
          recipeId: searchData.data[0].id,
          isSaved: isSaved,
          fromDatabase: true,
          isPro,
          message: "Recipe loaded from database",
        };
      }
    }

    //Step-2 : Recipe doesn't exist, generate with Gmeini

    const prompt = `
You are a professional chef and recipe expert. Generate a detailed recipe for: "${normalizedTitle}"

CRITICAL: The "title" field MUST be EXACTLY: "${normalizedTitle}" (no changes, no additions like "Classic" or "Easy")

Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
{
  "title": "${normalizedTitle}",
  "description": "Brief 2-3 sentence description of the dish",
  "category": "Must be ONE of these EXACT values: breakfast, lunch, dinner, snack, dessert",
  "cuisine": "Must be ONE of these EXACT values: italian, chinese, mexican, indian, american, thai, japanese, mediterranean, french, korean, vietnamese, spanish, greek, turkish, moroccan, brazilian, caribbean, middle-eastern, british, german, portuguese, other",
  "prepTime": "Time in minutes (number only)",
  "cookTime": "Time in minutes (number only)",
  "servings": "Number of servings (number only)",
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity with unit",
      "category": "Protein|Vegetable|Spice|Dairy|Grain|Other"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Brief step title",
      "instruction": "Detailed step instruction",
      "tip": "Optional cooking tip for this step"
    }
  ],
  "nutrition": {
    "calories": "calories per serving",
    "protein": "grams",
    "carbs": "grams",
    "fat": "grams"
  },
  "tips": [
    "General cooking tip 1",
    "General cooking tip 2",
    "General cooking tip 3"
  ],
  "substitutions": [
    {
      "original": "ingredient name",
      "alternatives": ["substitute 1", "substitute 2"]
    }
  ]
}

IMPORTANT RULES FOR CATEGORY:
- Breakfast items (pancakes, eggs, cereal, etc.) → "breakfast"
- Main meals for midday (sandwiches, salads, pasta, etc.) → "lunch"
- Main meals for evening (heavier dishes, roasts, etc.) → "dinner"
- Light items between meals (chips, crackers, fruit, etc.) → "snack"
- Sweet treats (cakes, cookies, ice cream, etc.) → "dessert"

IMPORTANT RULES FOR CUISINE:
- Use lowercase only
- Pick the closest match from the allowed values
- If uncertain, use "other"

Guidelines:
- Make ingredients realistic and commonly available
- Instructions should be clear and beginner-friendly
- Include 6-10 detailed steps
- Provide practical cooking tips
- Estimate realistic cooking times
- Keep total instructions under 12 steps
`;

 const result = await genAI.models.generateContent({
   model: "gemini-2.5-flash",
   contents: [{ role: "user", parts: [{ text: prompt }] }],
   generationConfig: {
     responseMimeType: "application/json",
   },
 });
    const text = result.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // Parse JSON response
    let recipeData;
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      recipeData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to generate recipe. Please try again.");
    }

    recipeData.title = normalizedTitle;

    // Validate and sanitize category
    const validCategories = [
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "dessert",
    ];
    const category = validCategories.includes(
      recipeData.category?.toLowerCase(),
    )
      ? recipeData.category.toLowerCase()
      : "dinner";

    // Validate and sanitize cuisine
    const validCuisines = [
      "italian",
      "chinese",
      "mexican",
      "indian",
      "american",
      "thai",
      "japanese",
      "mediterranean",
      "french",
      "korean",
      "vietnamese",
      "spanish",
      "greek",
      "turkish",
      "moroccan",
      "brazilian",
      "caribbean",
      "middle-eastern",
      "british",
      "german",
      "portuguese",
      "other",
    ];
    const cuisine = validCuisines.includes(recipeData.cuisine?.toLowerCase())
      ? recipeData.cuisine.toLowerCase()
      : "other";

    //Step-3 : Fetch image from Unsplash
    const imageUrl = await fetchRecipeImage(normalizedTitle);

    //Step-4 : Save generated recipe to database
    const strapiRecipeData = {
      data: {
        title: normalizedTitle,
        description: recipeData.description || "",
        cuisine,
        category,

        ingredients: recipeData.ingredients || [],
        instructions: recipeData.instructions || [],

        prepTime: Number(recipeData.prepTime) || 10,
        cookTime: Number(recipeData.cookTime) || 20,
        servings: Number(recipeData.servings) || 2,

        nutrition: recipeData.nutrition || {},
        tips: recipeData.tips || [],
        substitutions: recipeData.substitutions || [],

        imageUrl: imageUrl || "",
        isPublic: true,

        author: user.id,
      },
    };


    console.log("📤 Saving new recipe to database with title:",normalizedTitle);

    const createRecipeResponse = await fetch(`${STRAPI_URL}/api/recipes`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${STRAPI_API_TOKEN}`
      },
      body:JSON.stringify(strapiRecipeData)
    })

    if(!createRecipeResponse.ok){
      const errorText = await createRecipeResponse.text();
      console.error("❌ Failed to save recipe:", errorText);
      throw new Error("Failed to save recipe to database");
    }

    const createdRecipe = await createRecipeResponse.json();
    console.log("✅ Recipe saved to database:", createdRecipe.data.id);

    return {
      success: true,
      userIsPro : isPro,
      recipe: {
        ...recipeData,
        title: normalizedTitle,
        category,
        cuisine,
        imageUrl: imageUrl || "",
      },
      recipeId: createdRecipe.data.id,
      isSaved: false,
      fromDatabase: false,
      recommendationsLimit: isPro ? "unlimited" : 5,
      isPro,
      message: "Recipe generated and saved successfully!",
    };
  } catch (error) {
    console.error("Error in getting or generating Recipe :",error);
    throw new Error(error.message || "Failed to load recipe");
  }
}

//Save recipe to user's collection (bookmark)
// export async function saveRecipeToCollection(formData){
//   try {
//     const user = await checkUser();
//     if (!user) {
//       throw new Error("User not authenticated");
//     }

//     const recipeId = formData.get("recipeId");
//     if (!recipeId) {
//       throw new Error("Recipe ID is required");
//     }

//     //check if user have already saved recipe or not
//     const existingResponse = await fetch(`${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,{
//       headers:{
//         Authorization:`Bearer ${STRAPI_API_TOKEN}`
//       },
//       cache:"no-store"
//     })

//     //if it is already saved
//     if(existingResponse.ok){
//       const existingData = await existingResponse.json();
//       if(existingData.data && existingData.data.length>0){
//         return{
//           success:true,
//           alreadySaved:true,
//           message:"Recipe is already in your collection"
//         }
//       }
//     }

//     //Create a saved recipe collection

//     const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${STRAPI_API_TOKEN}`,
//       },
//       body: JSON.stringify({
//         data: {
//           user: user.id,
//           recipe: recipeId,
//           savedAt: new Date().toISOString(),
//         },
//       }),
//     });

//     if(!saveResponse.ok){
//       const errorText = await saveResponse.text();
//       console.error("failed to save recipe:",errorText);
//       throw new Error("Failed to save recipe in collection")
//     }

//     const savedRecipe = await saveResponse.json();
//     return{
//       success:true,
//       alreadySaved:false,
//       savedRecipe:savedRecipe.data,
//       message:"Recipe saved to your collection!"
//     }
//   } catch (error) {
//      console.error("❌ Error saving recipe to collection:", error);
//      throw new Error(error.message || "Failed to save recipe");
//   }
// }

//Save recipe to user's collection (bookmark) - 2
export async function saveRecipeToCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) throw new Error("User not authenticated");

    const recipeId = formData.get("recipeId");
    if (!recipeId) throw new Error("Recipe ID is required");

    // Check if already saved
    const existingResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        cache: "no-store",
      },
    );

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      if (existingData.data && existingData.data.length > 0) {
        return {
          success: true,
          alreadySaved: true,
          message: "Recipe is already in your collection",
        };
      }
    }

    // BUG 1 FIX: Get recipe's documentId via filter query
    // In Strapi v5, relation body fields require documentId (UUID), not numeric id.
    // We can't use /api/recipes/${recipeId} because Strapi v5 path params also need documentId.
    // So we filter by numeric id to retrieve the documentId safely.
    const recipeResponse = await fetch(
      `${STRAPI_URL}/api/recipes?filters[id][$eq]=${recipeId}`,
      {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        cache: "no-store",
      },
    );

    if (!recipeResponse.ok) throw new Error("Failed to fetch recipe details");

    const recipeJson = await recipeResponse.json();
    const recipeDocumentId = recipeJson.data?.[0]?.documentId;

    if (!recipeDocumentId)
      throw new Error("Could not resolve recipe documentId");

    const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          user: user.documentId, // BUG 2 FIX: was `user.documetId` (typo, always undefined)
          recipe: recipeDocumentId, // BUG 1 FIX: was raw recipeId (numeric), needs documentId UUID
          savedAt: new Date().toISOString(),
        },
      }),
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error("failed to save recipe:", errorText);
      throw new Error("Failed to save recipe in collection");
    }

    const savedRecipe = await saveResponse.json(); // BUG 3 FIX: was missing `await`

    return {
      success: true,
      alreadySaved: false,
      savedRecipe: savedRecipe.data,
      message: "Recipe saved to your collection!",
    };
  } catch (error) {
    console.error("❌ Error saving recipe to collection:", error);
    throw new Error(error.message || "Failed to save recipe");
  }
}

//Remove recipe from user's collection (unbookmark)
export async function removeRecipeFromCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is required");
    }

    //to remove you need to find the saved recipe
    
    //Find the saved recipe if it is there or not
    const searchedResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache:"no-store"
      },
    );

    //if not there
    if(!searchedResponse.ok){
        throw new Error("Failed to find saved recipe");
    }

    const searchedData = await searchedResponse.json();

    if(!searchedData.data || searchedData.data.length == 0){
      return {
        success: true,
        message: "Recipe was not in your collection",
      };
    }

    //if there delete the saved Recipe 
    //Deleted the saved Recipe relation

    const savedRecipeId = searchedData.data[0].id

    const deletedResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes/${savedRecipeId}`,{
        method:"DELETE",
        headers:{
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );

    if(!deletedResponse.ok){
      throw new Error("Failed to remove recipe from collection");
    }

    console.log("✅ Recipe removed from user collection");

    return {
      success: true,
      message: "Recipe removed from your collection",
    };
  } catch (error) {
     console.error("❌ Error removing recipe from collection:", error);
     throw new Error(error.message || "Failed to remove recipe");
  }
}

// Get user's saved recipes
export async function getSavedRecipes(){
  try {
    const user = await checkUser();
    
    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Fetch saved recipes with populated recipe data
    const response = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&populate[recipe][populate]=*&sort=savedAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch saved recipes");
    }
    const data = await response.json();
    // console.log("FULL STRAPI DATA:", JSON.stringify(data(null,2)));

    // Extract recipes from saved-recipes relations
    const recipes = data.data
      .map((savedRecipe) => savedRecipe.recipe)
      .filter(Boolean); // Remove any null recipes

    return {
      success: true,
      recipes,
      count: recipes.length,
    };
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    throw new Error(error.message || "Failed to load saved recipes");
  }
 
}


