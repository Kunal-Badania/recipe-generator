"use client"

import { Button } from "@/components/ui/button"
import type { Recipe } from "@/types/recipe"
import { ChevronLeft } from "lucide-react"

interface RecipeDisplayProps {
  recipe: Recipe
  onBack: () => void
  isLoading: boolean
}

export function RecipeDisplay({ recipe, onBack, isLoading }: RecipeDisplayProps) {
  return (
    <div className="space-y-4 flex-1 overflow-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-1 p-0 h-8">
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <h2 className="text-2xl font-bold text-orange-800">{recipe.title}</h2>

      <div className="border-t border-b py-4 my-4">
        <h3 className="font-semibold text-lg mb-2 text-orange-700">Ingredients</h3>
        <ul className="list-disc pl-5 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2 text-orange-700">Instructions</h3>
        <ol className="list-decimal pl-5 space-y-2">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="pl-1">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {recipe.notes && (
        <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
          <h3 className="font-semibold text-orange-700 mb-1">Chef's Notes</h3>
          <p className="text-sm">{recipe.notes}</p>
        </div>
      )}
    </div>
  )
}
