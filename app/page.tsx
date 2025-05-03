"use client"

import { useState, useEffect } from "react"
import { RecipeForm } from "@/components/recipe-form"
import { RecipeDisplay } from "@/components/recipe-display"
import { RecipeSuggestions } from "@/components/recipe-suggestions"
import { LoadingSpinner } from "@/components/loading-spinner"
import { generateRecipes } from "@/lib/recipe-generator"
import type { Recipe } from "@/types/recipe"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/storage"

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastInputs, setLastInputs] = useState({
    ingredients: "",
    cuisine: "",
    dietaryRestrictions: "",
  })
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    // Load last recipes from localStorage on initial load
    const savedRecipes = getFromLocalStorage("lastRecipes")
    if (savedRecipes && Array.isArray(savedRecipes) && savedRecipes.length > 0) {
      setRecipes(savedRecipes)
      setSelectedRecipe(null)
      setShowSuggestions(true)
    }

    // Load last inputs from localStorage
    const savedInputs = getFromLocalStorage("lastInputs")
    if (savedInputs) {
      setLastInputs(savedInputs)
    }
  }, [])

  const handleGenerateRecipes = async (ingredients: string, cuisine: string, dietaryRestrictions: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setSelectedRecipe(null)

      // Save inputs to state and localStorage
      const inputs = { ingredients, cuisine, dietaryRestrictions }
      setLastInputs(inputs)
      saveToLocalStorage("lastInputs", inputs)

      // Generate recipes
      const newRecipes = await generateRecipes(ingredients, cuisine, dietaryRestrictions)

      // Save recipes to state and localStorage
      setRecipes(newRecipes)
      saveToLocalStorage("lastRecipes", newRecipes)
      setShowSuggestions(true)
    } catch (err) {
      console.error("Error generating recipes:", err)
      setError("Failed to generate recipes. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowSuggestions(false)
  }

  const handleBackToSuggestions = () => {
    setSelectedRecipe(null)
    setShowSuggestions(true)
  }

  const handleRegenerateRecipes = () => {
    handleGenerateRecipes(lastInputs.ingredients, lastInputs.cuisine, lastInputs.dietaryRestrictions)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-orange-800">Recipe Generator</h1>
        <p className="text-center mb-6 md:mb-8 text-orange-700">
          Enter your ingredients and preferences to generate delicious recipes
        </p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr]">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <RecipeForm onSubmit={handleGenerateRecipes} initialValues={lastInputs} isLoading={isLoading} />
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md min-h-[400px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-red-500 text-center">
                  <p className="mb-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : showSuggestions && recipes.length > 0 ? (
              <RecipeSuggestions
                recipes={recipes}
                onSelectRecipe={handleSelectRecipe}
                onRegenerate={handleRegenerateRecipes}
                isLoading={isLoading}
              />
            ) : selectedRecipe ? (
              <RecipeDisplay recipe={selectedRecipe} onBack={handleBackToSuggestions} isLoading={isLoading} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-4">
                <div>
                  <p className="mb-4">Your recipe suggestions will appear here</p>
                  <p className="text-sm">Enter ingredients and preferences to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
