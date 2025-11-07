import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGeminiStream = async (userQuestion, filteredData,res) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // More reliable model
        
        const prompt = `
You are CSEC-ASTU AI Assistant, a helpful assistant for CSEC ASTU students and community. Your role is to provide accurate information based strictly on the given context.

CONTEXT INFORMATION:
"""
${filteredData}
"""

USER'S QUESTION: 
${userQuestion}

RESPONSE GUIDELINES:
1. **Context-Only**: Use ONLY information from the provided context above
2. **Clarity**: Explain concepts clearly and in a user-friendly manner
3. **Structure**: Break down complex answers into easy-to-understand points when helpful
4. **Honesty**: If the context doesn't contain relevant information, politely state this
5. **Focus**: Stay strictly on topic - do not add external knowledge or assumptions

SPECIFIC RULES:
- If asked "Who are you?" or "What's your name?" respond: "I'm CSEC-ASTU AI Assistant"
- If the question is outside the context, say: "I don't have enough information about that in my current knowledge base"
- Make technical concepts accessible to students
- Use a helpful, professional tone
- Keep responses concise but thorough

Now, please provide a helpful response to the user's question:`;

        const result = await model.generateContentStream(prompt);

        let fullResponse = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            
            // Send each chunk to the client in SSE format
            res.write(`data: ${JSON.stringify({ chunk: chunkText, done: false })}\n\n`);
        }

        // Send completion signal
        res.write(`data: ${JSON.stringify({ chunk: '', done: true, fullResponse })}\n\n`);
        // Important: Flush the response
        if (typeof res.flush === 'function') {
            res.flush();
        }
        res.end();

        return fullResponse;

    } catch (error) {
        console.error("Gemini API error:", error);
        res.write(`data: ${JSON.stringify({ error: "I apologize, but I'm experiencing technical difficulties. Please try again shortly.", done: true })}\n\n`);
        res.end();
    }
};