import { GoogleGenerativeAI } from "@google/generative-ai"


export const getTitle = async(existingTitles,text)=>{
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    try {
        const model = ai.getGenerativeModel({model:'gemini-2.5-flash'})
        const prompt = `You are a title matching assistant. Return the best matching title in JSON array format.

TEXT TO MATCH: "${text}"

AVAILABLE TITLES: ${JSON.stringify(existingTitles)}

INSTRUCTIONS:
1. Find the single best matching title from the available titles
2. Return as: ["matched_title"] or [] if no match
3. Only match if content clearly relates
4. Your response must be parseable JSON

RESPONSE:`;

const result = await model.generateContent(prompt)
const response = await result.response;
const textResponse = response.text().trim();

try {
    const matches = JSON.parse(textResponse);
    if (Array.isArray(matches)) {
        return matches;
    }
    return [];
} catch (parseError) {
    console.error('Failed to parse AI response:', textResponse);
    return [];
}

    } catch (error) {
        console.error('AI matching error:', error);
        return [];
    }

}