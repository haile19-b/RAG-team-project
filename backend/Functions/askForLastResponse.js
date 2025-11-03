import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGemini = async(userQuestion,filteredData )=>{

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    try {
        const model = genAI.getGenerativeModel({model:'gemini-2.5-flash'})
        const prompt = `
                You are an AI assistant that answers questions based ONLY on the provided context.
                    
                CONTEXT:
                ${filteredData}
                    
                USER QUESTION:
                ${userQuestion}
                    
                INSTRUCTIONS:
                1. Answer the question using ONLY information from the context above
                2. Keep your response clear, concise, and directly relevant
                3. If the context doesn't contain information to answer the question, say "I don't have enough information to answer this question based on the available context."
                4. Do not add any external knowledge or make assumptions beyond what's in the context
                `
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const AiResponse = response.candidates[0].content.parts[0].text;

        return AiResponse
        
    } catch (error) {
        return error.message
    }
}