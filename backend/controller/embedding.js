import { Data } from "../model/data.model.js";
import { searchSimilarData } from "../Functions/searchSimilarData.js";
import { askGeminiStream } from "../Functions/askForLastResponse.js";
import { getCohereEmbedding } from "../Functions/cohere/askForEmbedding.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


export const embedData = async (req, res) => {
    const { My_Data } = req.body;

    if (!My_Data) {
        return res.status(400).json({
            message: "Data is required!",
            success: false
        });
    }

    try {

        // 2. Chunk the data

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 80,
            separators: ["\\n\\n", "\\n", " ", ".", "?", "!", ",", ";"],
        });

        const chunks = await textSplitter.splitText(My_Data);



        // 3. Generate embeddings for chunks
        const embededChunks = await Promise.all(
            chunks.map(async (chunk,index) => {
                try {
                    
                    const embeddingRes = await getCohereEmbedding(chunk)

                    if (!embeddingRes || !embeddingRes[0] ) {
                        console.error("Invalid embedding response for chunk:", chunk);
                        return null;
                    }

                    return {
                        content: chunk,
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
                embedding: chunk.embedding,
            };
        });

        // 5. Insert into database
        const bulkResult = await Data.insertMany(documents);

        // 6. Get updated titles list from database

        return res.status(201).json({
            message: "Data successfully embedded and stored",
            summary: {
                totalReceived: chunks.length,
                successfullyEmbedded: successfulEmbeddings.length,
                successfullyStored: bulkResult.insertedCount,
                failures: chunks.length - successfulEmbeddings.length,
            },
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
    const UserEmbededText = text

    

    try {

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Content-Encoding': 'none'
        });

        const co = await getCohereEmbedding(text)

        const embededText = co[0];


        const relevantData = await searchSimilarData(embededText);

        const RelevantData = relevantData.map(data => data.content).join("\n");

        const AiResponse = await askGeminiStream(UserEmbededText,RelevantData,res)

    } catch (error) {
        return res.status(500).json({
            message:"Server Error Occored",
            error:error.message
        })
    }

}