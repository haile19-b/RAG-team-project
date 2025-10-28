import axios from "axios";

export const askAI = async (text: string) => {
    try {
        const response = await axios.get("http://localhost:5000/embedding/get-data", {
            params: {
                text: text
            }
        });
        
        return { type: "ai", text: response.data.aiResponse };
        
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message);
    }
}