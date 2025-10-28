import { Data } from "../model/data.model.js"

export const searchSimilarData = async(userInputVector)=>{
    try {
        const result = await Data.aggregate([
            {
                $vectorSearch:{
                    index:"vector_index",
                    path:"embedding",
                    queryVector:userInputVector,
                    numCandidates:100,
                    limit:20
                }
            },
            {
                $project:{
                    text:1,
                    _id:1,
                    score: { $meta: "vectorSearchScore" }
                }
            },
            {
                $match:{
                    score:{ $gte:0.7 }
                }
            },
            {
                $limit:5
            }
        ])

        return result
    } catch (error) {
        throw new Error(`Search failed: ${error.message}`);
    }
}