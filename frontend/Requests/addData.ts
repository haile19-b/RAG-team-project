import { DataValues } from "@/util/FormValidation";
import axios from "axios";

export const AddData = (data:string)=>{
    try {
        const response = axios.post("http://localhost:5000/embedding/add-data",{
             My_Data:data
        })
        return response
    } catch (error:any) {
        throw new Error(error.response?.data?.message || error.message);
    }
}