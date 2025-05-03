"use server"

import type { Recipe } from "@/types/recipe"
import { GroqChat } from "@/lib/groq-client"

export async function generateRecipes(ingredients: string, cuisine = "", dietaryRestrictions = ""): Promise<Recipe[]> {
  try {
    const groq = new GroqChat()

    // Build the prompt
    let prompt = `Generate 4 unique recipe ideas using these ingredients: ${ingredients}.`

    if (cuisine) {
      prompt += ` The recipes should be ${cuisine} cuisine.`
    }

    if (dietaryRestrictions) {
      prompt += ` The recipes must follow these dietary restrictions: ${dietaryRestrictions}.`
    }

    prompt += ` Format the response as a JSON array with 4 recipe objects, each with the following structure:
    {
      "title": "Recipe Title",
      "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity", ...],
      "instructions": ["step 1", "step 2", ...],
      "notes": "Optional chef's notes or tips"
    }
    
    Make sure each recipe is creative, different from the others, and uses the provided ingredients efficiently. The instructions should be clear and easy to follow. Only include the JSON array in your response, no additional text.`

    // Call Groq API
    const response = await groq.generateRecipe(prompt)

    // Parse the JSON response
    try {
      // Extract JSON from the response if needed
      const jsonMatch =
        response.match(/```json\n([\s\S]*?)\n```/) ||
        response.match(/```\n([\s\S]*?)\n```/) ||
        response.match(/\[\s*\{[\s\S]*?\}\s*\]/)

      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response

      const parsedRecipes = JSON.parse(jsonString.replace(/^```json|```$/g, "").trim())

      // Ensure the response has the expected structure
      if (Array.isArray(parsedRecipes)) {
        return parsedRecipes.map((recipe) => ({
          title: recipe.title || "Delicious Recipe",
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
          notes: recipe.notes || "",
        }))
      } else if (typeof parsedRecipes === "object") {
        // If we got a single recipe instead of an array
        return [
          {
            title: parsedRecipes.title || "Delicious Recipe",
            ingredients: Array.isArray(parsedRecipes.ingredients) ? parsedRecipes.ingredients : [],
            instructions: Array.isArray(parsedRecipes.instructions) ? parsedRecipes.instructions : [],
            notes: parsedRecipes.notes || "",
          },
        ]
      }

      throw new Error("Invalid response format")
    } catch (parseError) {
      console.error("Error parsing recipe JSON:", parseError)

      // Fallback to a simple parsing approach - try to extract multiple recipes
      const recipeBlocks = response.split(/Recipe \d+:|###/).filter((block) => block.trim().length > 0)

      if (recipeBlocks.length > 0) {
        return recipeBlocks.slice(0, 4).map((block, index) => {
          const title = block.match(/title["\s:]+([^"]+)/i)?.[1] || `Delicious Recipe ${index + 1}`
          const ingredients = block.includes("ingredients")
            ? block
                .split("ingredients")[1]
                .split(/instructions|steps|directions/i)[0]
                .match(/["-]\s*([^"]+)/g)
                ?.map((i) => i.replace(/^["-]\s*/, "").trim()) || []
            : []
          const instructions =
            block.includes("instructions") || block.includes("steps") || block.includes("directions")
              ? block
                  .split(/instructions|steps|directions/i)[1]
                  .split(/notes|tips/i)[0]
                  .match(/["-]\s*([^"]+)/g)
                  ?.map((i) => i.replace(/^["-]\s*/, "").trim()) || []
              : []

          return {
            title,
            ingredients,
            instructions,
            notes: "",
          }
        })
      }

      // If all else fails, return a single generic recipe
      return [
        {
          title: "Recipe Based on Your Ingredients",
          ingredients: [
            ingredients
              .split(",")
              .map((i) => i.trim())
              .join(", "),
          ],
          instructions: ["Combine all ingredients and cook until done."],
          notes: "We had trouble generating a detailed recipe. Please try again with more specific ingredients.",
        },
      ]
    }
  } catch (error) {
    console.error("Error generating recipes:", error)
    throw new Error("Failed to generate recipes")
  }
}
