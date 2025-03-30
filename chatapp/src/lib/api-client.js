import axios from "axios"
import { HOST } from "@/utiles/constants"


 export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true,
}); 
