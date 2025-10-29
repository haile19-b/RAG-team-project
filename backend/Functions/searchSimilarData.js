import { Data } from "../model/data.model.js"

export const searchSimilarData = async (titleMatches,userInputVector) => {
    try {
        
        // Build the base pipeline
        const pipeline = [];
        
        // Vector search stage with optional title filtering
        const vectorSearchStage = {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding", 
                queryVector: userInputVector,
                numCandidates: 100,
                limit: 20
            }
        };

        // Add title filter to vector search if title matches provided
        if (titleMatches && titleMatches.length > 0) {
            vectorSearchStage.$vectorSearch.filter = {
                "metadata.title": { 
                    $in: titleMatches
                }
            };
        }

        pipeline.push(vectorSearchStage);

        // Continue with existing pipeline stages
        pipeline.push(
            {
                $project: {
                    content: 1,
                    "metadata.title": 1,
                    _id: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            },
            {
                $match: {
                    score: { $gte: 0.7 }
                }
            },
            {
                $limit: 5
            }
        );
        
        const result = await Data.aggregate(pipeline);
        console.log("=== END DEBUG ===");
        
        return result;

    } catch (error) {
        console.log(`Search failed: ${error.message}`);
        console.log("Full error:", error);
        return [];
    }
}