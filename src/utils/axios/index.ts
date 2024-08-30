import axios from "axios";
import { json } from "stream/consumers";

export const instance = axios.create({
    baseURL: 'http://localhost:8090',
    timeout: 1000,
    headers: { 'Content-Type': `application/json` }
});