"use server";


const MEAL_DB_API = "https://www.themealdb.com/api/json/v1/1";

export async function getRecipeOfTheDay() {

    try {
        const response = await fetch(`${MEAL_DB_API}/random.php`, {
          next: { revalidate: 86400 }, //for 24 hours
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the recipe of the day");
        }

        const data = await response.json();
        return {
          success: true,
          recipe: data.meals[0],
        };
    } catch (error) {
        console.log("Error fetching recipe of the day:",error);
        throw new Error(error.message || "Failed to load recipe");
    }
    
}

export async function getCategories() {
       try {
         const response = await fetch(`${MEAL_DB_API}/list.php?c=list`, {
           next: { revalidate: 604800 }, //cahche for 1 week
         });

         if (!response.ok) {
           throw new Error("Failed to fetch the categories");
         }

         const data = await response.json();
         return {
           success: true,
           categories: data.meals || [],
         };
       } catch (error) {
         console.log("Error fetching in categories:", error);
         throw new Error(error.message || "Failed to load categories");
       }
    
}

export async function getAreas() {
    try {
      const response = await fetch(`${MEAL_DB_API}/list.php?a=list`, {
        next: { revalidate: 604800 }, //cahche for 1 week
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the areas");
      }

      const data = await response.json();
      return {
        success: true,
        areas: data.meals || [],
      };
    } catch (error) {
      console.log("Error fetching in areas:", error);
      throw new Error(error.message || "Failed to load areas");
    }
    
}

export async function getMealsByCategory(category) {
       try {
         const response = await fetch(`${MEAL_DB_API}/filter.php?c=${category}`, {
           next: { revalidate: 86400 }, //cahche for 24hrs
         });

         if (!response.ok) {
           throw new Error("Failed to fetch the meals");
         }

         const data = await response.json();
         return {
           success: true,
           meals: data.meals || [],
           category
         };
       } catch (error) {
         console.log("Error fetching in meals:", error);
         throw new Error(error.message || "Failed to load meals");
       }
}

export async function getMealsByArea(area) {
       try {
         const response = await fetch(`${MEAL_DB_API}/filter.php?a=${area}`, {
           next: { revalidate: 86400 }, //cahche for 24hrs
         });

         if (!response.ok) {
           throw new Error("Failed to fetch the meals");
         }

         const data = await response.json();
         return {
           success: true,
           meals: data.meals || [],
           area,
         };
       } catch (error) {
         console.log("Error fetching in meals:", error);
         throw new Error(error.message || "Failed to load meals");
       }
}