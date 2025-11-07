import { DataValues } from "@/util/FormValidation";
import axios from "axios";

export const AddData = (data:string)=>{

    const base_url = process.env.NEXT_PUBLIC_API_URL;


    try {
        const response = axios.post(`${base_url}/embedding/add-data`,{
             My_Data:data
        })
        return response
    } catch (error:any) {
        throw new Error(error.response?.data?.message || error.message);
    }
}