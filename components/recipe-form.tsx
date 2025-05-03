"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface RecipeFormProps {
  onSubmit: (ingredients: string, cuisine: string, dietaryRestrictions: string) => void
  initialValues?: {
    ingredients: string
    cuisine: string
    dietaryRestrictions: string
  }
  isLoading: boolean
}

export function RecipeForm({ onSubmit, initialValues, isLoading }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState(initialValues?.ingredients || "")
  const [cuisine, setCuisine] = useState(initialValues?.cuisine || "")
  const [dietaryRestrictions, setDietaryRestrictions] = useState(initialValues?.dietaryRestrictions || "")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!ingredients.trim()) return
    onSubmit(ingredients, cuisine, dietaryRestrictions)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ingredients" className="text-orange-800 font-medium">
          Ingredients <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="ingredients"
          placeholder="Enter ingredients separated by commas (e.g., chicken, rice, onions, garlic)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="min-h-[100px] md:min-h-[120px] resize-none"
          required
        />
        <p className="text-xs text-gray-500">List all ingredients you have available</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cuisine" className="text-orange-800 font-medium">
          Cuisine (Optional)
        </Label>
        <Input
          id="cuisine"
          placeholder="e.g., Italian, Mexican, Japanese"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietary" className="text-orange-800 font-medium">
          Dietary Restrictions (Optional)
        </Label>
        <Input
          id="dietary"
          placeholder="e.g., vegetarian, gluten-free, dairy-free"
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        disabled={isLoading || !ingredients.trim()}
      >
        {isLoading ? "Generating..." : "Generate Recipes"}
      </Button>
    </form>
  )
}
