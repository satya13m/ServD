import Link from 'next/link';
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
  CardAction
} from "./ui/card";
import Image from 'next/image';
import { Badge } from './ui/badge';
import { ChefHat, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';


const RecipeCard=({recipe,variant="default"})=> {
  
  const getRecipeData = () => {
    if (recipe.strMeal) {
      return {
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
        showImage: true,
      };
    }

    //more condition

    //For AI-generated pantry recipes
    if (recipe.matchPercentage) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage,
        missingIngredients: recipe.missingIngredients || [],
        image: recipe.imageUrl, // Add image support
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl, // Show if image exists
      };
    }

    if(recipe){
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }

    return {};
  };
  const data = getRecipeData();

  if(variant === "grid"){
    return <Link href={data.href}>
      <Card className="rounded-none overflow-hidden border-stone-200 hover:shadow-xl 
      hover:translate-y-1 transition-all duration-300 cursor-pointer group pt-0">
        {data.showImage ?
         <div className='relative aspect-square'>
           <Image 
           src={data.image}
           alt={data.title}
           fill
           className='object-cover'
           sizes='(max-width: 768px) 100vw, (max-width:1200 px) 50vw , 33vw'/>

             {/* Hover Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium">
                    Click to view recipe
                  </p>
                </div>
              </div>
           
        </div>
        
        :
        <div>
          </div>}
          <CardHeader>
            <CardTitle className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2">
              {data.title}
            </CardTitle>
          </CardHeader>
      </Card>
    </Link>
  }

  if(variant === "pantry"){
    return (
      <div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {/**render cuisne type and category */}
                  {data.cuisine && (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200 capitalize"
                    >
                      {data.cuisine}
                    </Badge>
                  )}
                  {data.category && (
                    <Badge
                      variant="outline"
                      className="text-stone-600 border-stone-200 capitalize"
                    >
                      {data.category}
                    </Badge>
                  )}
                </div>
              </div>
              {/**Match percentage badge */}
              {data.matchPercentage && (
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    className={`${data.matchPercentage >= 90 ? "bg-green-600" : data.matchPercentage >= 75 ? "bg-ornage-600" : "bg-stone-600"} text-white text-lg px-3 py-1`}
                  >
                    {data.matchPercentage}%
                  </Badge>
                  <span className="text-xs text-stone-500">Match</span>
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold font-serif text-stone-900">
              {data.title}
            </CardTitle>
            {data.description && (
              <CardDescription className="text-stone-600 leading-relaxed mt-2">
                {data.description}
              </CardDescription>
            )}{" "}
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {/**cooktime ,prepTime rendering */}
            {(data.cookTime || data.prepTime || data.servings) && (
              <div className="flex gap-4 text-sm text-stone-500">
                {(data.prepTime || data.cookTime) && (
                  <div className='flex items-center gap-1'>
                    <Clock className="w-4 h-4" />
                    <span>{parseInt(data.prepTime || 0)+parseInt(data.cookTime || 0)}{" "}mins</span>
                  </div>
                )}
                {/**servings */}
                {data.servings && (
                  <div className='flex items-center gap-1'>
                    <Users className='w-4 h-4'/>
                    <span>{data.servings} servings</span>
                  </div>
                )}
              </div>
            )}

            {/**missing ingredients rendering */}
            {data.missingIngredients && data.missingIngredients.length > 0 && (
              <div className='p-4 bg-orange-50 border border-orange-100'>
                  <h4 className='text-sm font-semibold text-orange-900 mb-2'>
                    You&apos;ll need :
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {data.missingIngredients.map((ingredient,i)=>(
                      <Badge key={i} variant='outline' className="text-orange-700 border-orange-200 bg-white">{ingredient}</Badge>
                    ))}
                  </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
         {/**Link tag to back to recipe page */}
         <Link href={data.href} className='w-full'>
         <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
          <ChefHat className='w-4 h-4'/>
           View All Recipe
         </Button>
         </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if(variant === "list"){
    return (
      <Link href={data.href}>
        <Card className="rounded-none border-stone-200 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer group overflow-hidden py-0">
          <div className="flex flex-col md:flex-row">
            {/**Render the image if available */}
            {data.showImage ? (
              <div className="relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
            ) : (
              //Fallback gradient when no image is there
              <div className="relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0 bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
                <ChefHat className="w-12 h-12 text-white/30" />
              </div>
            )}

            {/**Content */}
            <div className="flex-1 py-5">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {data.cuisine && (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200 capitalize"
                    >
                      {data.cuisine}
                    </Badge>
                  )}
                  {data.category && (
                    <Badge
                      variant="outline"
                      className="text-stone-600 border-stone-200 capitalize"
                    >
                      {data.category}
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                  {data.title}
                </CardTitle>

                {data.description && (
                  <CardDescription className="line-clamp-2">
                    {data.description}
                  </CardDescription>
                )}
              </CardHeader>

              {(data.prepTime || data.cookTime || data.servings) && (
                <CardContent>
                  <div className="flex gap-4 text-sm text-stone-500 pt-4">
                    {(data.prepTime || data.cookTime) && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {parseInt(data.prepTime || 0) +
                            parseInt(data.cookTime || 0)}{" "}
                          mins
                        </span>
                      </div>
                    )}
                    {data.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{data.servings} servings</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={data.href}>
      <Card className="rounded-none border-stone-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden py-0">
        {data.showImage && (
          <div className="relative aspect-video">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg">{data.title}</CardTitle>
          {data.description && (
            <CardDescription className="line-clamp-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}

export default RecipeCard
