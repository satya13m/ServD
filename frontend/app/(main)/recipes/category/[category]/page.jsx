"use client"

import { getMealsByCategory } from "@/actions/mealdb.actions";
import { useParams } from "next/navigation";
import RecipeGrid from "@/components/RecipeGrid";

export default function CategoryRecipesPage(){
    const params = useParams();
    const category = params.category;
    return (
        <div>
            <RecipeGrid
            type="category"
            value={category}
            fetchActions={getMealsByCategory}
            backLink="/dashbaord"/>
        </div>
    )

}