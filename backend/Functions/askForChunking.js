import { GoogleGenerativeAI } from "@google/generative-ai";

export const ChunkFile = async (existingTitles, newFileText) => {
  // Validate inputs
  if (!newFileText || newFileText.trim().length < 10) {
      return [{
          chunk: newFileText,
          metadata: { title: "Single Chunk" }
      }];
  }

  try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
TASK: Split the text into logical chunks and assign appropriate titles.

TEXT TO PROCESS:
"""
${newFileText}
"""

EXISTING TITLES (REUSE THESE WHEN RELEVANT):
${existingTitles.join(', ')}

INSTRUCTIONS:
1. FIRST, check if any existing titles match the chunk content - REUSE them when relevant
2. If no existing title fits, create NEW titles that are GENERAL and CATEGORICAL
3. Group similar information under the same general titles
4. Create hierarchical titles when appropriate (e.g., "CSEC-ASTU Leadership" for multiple leaders)

TITLE CREATION RULES:
- PREFER REUSING existing titles when content matches
- Create GENERAL categories, not specific instances
- Use format: "Category - Subcategory" when helpful
- Avoid overly specific titles naming individuals unless necessary

EXAMPLES:
- Instead of "Role of Besu" → use "CSEC-ASTU Leadership Roles"
- Instead of "Mister X Vice President" → use "CSEC-ASTU Leadership Roles" 
- Instead of "Weekly Meeting Schedule" → use "Club Meetings & Events"
- Instead of "Project Deadline" → use "Academic Deadlines"

OUTPUT FORMAT: JSON array only
[
  {
    "chunk": "text content here",
    "metadata": {
      "title": "Reused or General Title"
    }
  }
]

Return ONLY the JSON array, no other text.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const rawText = response.text();
      
      console.log("📝 Raw response:", rawText);

      // Try multiple parsing strategies
      const parsingStrategies = [
          (text) => JSON.parse(text), // Direct parse
          (text) => JSON.parse(text.replace(/```json|```/g, '').trim()), // Remove markdown
          (text) => { // Extract JSON with regex
              const match = text.match(/\[\s*{[\s\S]*}\s*\]/);
              return match ? JSON.parse(match[0]) : null;
          }
      ];

      let parsedResult = null;
      for (const strategy of parsingStrategies) {
          try {
              parsedResult = strategy(rawText);
              if (parsedResult) break;
          } catch (e) {
              // Try next strategy
          }
      }

      if (!parsedResult || !Array.isArray(parsedResult)) {
          throw new Error("All parsing strategies failed");
      }

      return parsedResult;

  } catch (error) {
      console.error("ChunkFile error:", error);
      
      // Final fallback - simple split
      return newFileText.split('\n\n')
          .filter(chunk => chunk.trim().length > 20)
          .map((chunk, index) => ({
              chunk: chunk.trim(),
              metadata: { title: `Chunk ${index + 1}` }
          }));
  }
};