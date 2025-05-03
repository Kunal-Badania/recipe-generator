"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Recipe } from "@/types/recipe"
import { RefreshCw, ChevronRight } from "lucide-react"

interface RecipeSuggestionsProps {
  recipes: Recipe[]
  onSelectRecipe: (recipe: Recipe) => void
  onRegenerate: () => void
  isLoading: boolean
}

export function RecipeSuggestions({ recipes, onSelectRecipe, onRegenerate, isLoading }: RecipeSuggestionsProps) {
  return (
    <div className="space-y-4 flex-1 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-orange-800">Recipe Suggestions</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Regenerate</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {recipes.map((recipe, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border-orange-100 hover:border-orange-300"
            onClick={() => onSelectRecipe(recipe)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-orange-800 line-clamp-2">{recipe.title}</h3>
                <ChevronRight className="h-4 w-4 text-orange-500 flex-shrink-0 mt-1" />
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {recipe.ingredients.slice(0, 3).join(", ")}
                {recipe.ingredients.length > 3 ? `, +${recipe.ingredients.length - 3} more` : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
