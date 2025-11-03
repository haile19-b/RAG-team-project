import { GoogleGenerativeAI } from "@google/generative-ai";

export const ChunkFile = async(existingTitles=["excutive info","History"],newFileText) => {

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    try {
        const model = ai.getGenerativeModel({model:'gemini-2.5-flash'})
        const prompt = `
TASK: Split the following text into logical, meaningful chunks for a RAG system.

TEXT TO CHUNK:
"""
${newFileText}
"""

INSTRUCTIONS:
1. Analyze the text and identify natural break points (topic changes, new sections)
2. Create chunks that are semantically coherent (usually 2-4 sentences each)
3. For each chunk, provide a short descriptive title (3-5 words)
4. Use existing titles when they match, otherwise create new ones

EXISTING TITLES (use if relevant):
${existingTitles}

REQUIRED JSON FORMAT:
[
  {
    "chunk": "Full text content of the chunk",
    "metadata": {
      "title": "Descriptive Title Here"
    }
  }
]

CRITICAL RULES:
- Return ONLY valid JSON, no other text
 - Return the JSON directly without wrapping in Markdown
- Each chunk should be self-contained and meaningful
- Maintain the original text's meaning and flow
- Chunks should be roughly similar in length

NOW PROCESS THE TEXT AND RETURN JSON:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.candidates[0].content.parts[0].text;
        const parsedChunks = JSON.parse(jsonString);
        return parsedChunks;

    } catch (error) {
        return error.message
    }
}