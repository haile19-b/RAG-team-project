export const getCohereEmbedding = async (text) => {
    try {
        const response = await fetch('https://api.cohere.ai/v1/embed', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texts: [text],
                model: 'embed-english-v3.0',
                input_type: 'search_document'
            })
        });

        const data = await response.json();
        return data.embeddings; // 1024-dimensional embedding
    } catch (error) {
        console.error("Cohere embedding error:", error);
        throw error;
    }
};