import { VoyageAIClient } from "voyageai";
import { Data } from "../model/data.model.js";
import { searchSimilarData } from "../Functions/searchSimilarData.js";
import { askGemini } from "../Functions/askForLastResponse.js";
import { ChunkFile } from "../Functions/askForChunking.js";
import { getTitle } from "../Functions/askForTitle.js";
import { getCohereEmbedding } from "../Functions/cohere/askForEmbedding.js";

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

export const embedData = async (req, res) => {
    const { My_Data } = req.body;

    if (!My_Data) {
        return res.status(400).json({
            message: "Data is required!",
            success: false
        });
    }

    try {
        // 1. First, get existing titles from database
        const existingTitles = await Data.distinct("metadata.title");

        // 2. Chunk the data
        const chunks = await ChunkFile(existingTitles, My_Data);

        if (chunks.error) {
            return res.status(400).json({
                message: `Chunking failed: ${chunks.error}`,
                status: false
            });
        }

        if (!chunks || chunks.length === 0) {
            return res.status(400).json({
                message: "No chunked data returned!",
                status: false
            });
        }

        // 3. Generate embeddings for chunks
        const embededChunks = await Promise.all(
            chunks.map(async (chunk,index) => {
                try {
                    
                    const embeddingRes = await getCohereEmbedding(chunk.chunk)

                    // if (!embeddingRes.data || !embeddingRes.data[0] || !embeddingRes.data[0].embedding) {
                    //     console.error("Invalid embedding response for chunk:", chunk.metadata.title);
                    //     return null;
                    // }

                    if (!embeddingRes || !embeddingRes[0] ) {
                        console.error("Invalid embedding response for chunk:", chunk.metadata.title);
                        return null;
                    }

                    return {
                        content: chunk.chunk,
                        metadata: chunk.metadata,
                        embedding: embeddingRes[0]
                    };
                } catch (embedError) {
                    console.error(`Embedding failed for chunk "${chunk.metadata.title}":`, embedError);
                    return null;
                }
            })
        );

        const successfulEmbeddings = embededChunks.filter(chunk => chunk !== null);

        if (successfulEmbeddings.length === 0) {
            return res.status(500).json({
                message: "All embedding operations failed",
                status: false
            });
        }

        // 4. Prepare documents for database insertion
        const documents = successfulEmbeddings.map((chunk) => {
            return {
                content: chunk.content,
                metadata: chunk.metadata,
                embedding: chunk.embedding,
            };
        });

        // 5. Insert into database
        const bulkResult = await Data.insertMany(documents);

        // 6. Get updated titles list from database
        const updatedTitles = await Data.distinct("metadata.title");

        return res.status(201).json({
            message: "Data successfully embedded and stored",
            summary: {
                totalReceived: chunks.length,
                successfullyEmbedded: successfulEmbeddings.length,
                successfullyStored: bulkResult.insertedCount,
                failures: chunks.length - successfulEmbeddings.length,
                totalTitlesInDB: updatedTitles.length
            },
            titles: updatedTitles
        });

    } catch (error) {
        console.error("Server error in embedData:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};

export const getReleventData = async(req,res) => {

    const {text} = req.query;
    if(!text){
        return res.status(400).json({
            message:"what text is you are searching for ?, there is no text!",
            success:false
        })
    }

    

    try {

        const existingTitles = await Data.distinct("metadata.title");


        const title = await getTitle(existingTitles,text)

        const co = await getCohereEmbedding(text)


        // const embedResponse = await client.embed({
        //     input:[text],
        //     model:'voyage-3-lite'
        // })

        // const embededText = embedResponse.data[0].embedding;
        const embededText = co[0];


        const relevantData = await searchSimilarData(title,embededText);

        const textForm = relevantData.map(data => data.content).join("\n");

        const AiResponse = await askGemini(text,textForm)

        return res.status(200).json({
            message:"response is successfully generated by gemini",
            userInput:text,
            aiResponse:AiResponse
        })

    } catch (error) {
        return res.status(500).json({
            message:"Server Error Occored",
            error:error.message
        })
    }

}