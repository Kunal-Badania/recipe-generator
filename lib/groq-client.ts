"use server"

const apiUrl = "https://api.groq.com/openai/v1/chat/completions"
const model = "llama3-70b-8192"

function getApiKey() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set")
  }
  return apiKey
}

export async function generateRecipe(prompt: string): Promise<string> {
  try {
    const apiKey = getApiKey()
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are a professional chef specialized in creating delicious recipes from available ingredients. Your responses should be creative, practical, and formatted as JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error calling Groq API:", error)
    throw error
  }
}
