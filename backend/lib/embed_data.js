import VoyageAI from "voyageai";

const voyage = new VoyageAI(process.env.VOYAGE_API_KEY);

export const embedData = async (data) => {
    const embeddingResponse = await voyage.embed({
        input: [data],
        model: 'voyage-3'
    });

    return embeddingResponse;
};
