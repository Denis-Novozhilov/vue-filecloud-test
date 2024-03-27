import axios from "axios";

export const BASE_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: BASE_URL,
})

// #task [] refactor ↓ apply interceptor
// #task [] refactor ↓ add localStorage save auth token
// api.interceptors.request.use((config)=>{
//     config.headers['auth-token'] = `Bearer ${localStorage.getItem('authToken')}`
//     return config
// })