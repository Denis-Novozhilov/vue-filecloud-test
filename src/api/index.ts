import {fileSend} from "@src/api/fileSend.ts";
import {fileDownload} from "@src/api/fileDownload.ts";
import {fileDelete} from "@src/api/fileDelete.ts";
import {fileRename} from "@src/api/fileRename.ts";
import {fileListInit} from "@src/api/fileListInit.ts";
import {userLogOut} from "@src/api/userLogOut.ts";

export const BASE_URL = 'http://localhost:3000';



export {
    fileSend,
    fileDownload,
    fileRename,
    fileDelete,
    fileListInit,
    userLogOut
}

// #task [] refactor ↓ api calls
// #task [] refactor ↓ apply interceptor
// #task [] refactor ↓ add localStorage save auth token
// export const api = axios.create({
//     baseURL: BASE_URL,
// })
//  api.interceptors.request.use((config)=>{
//      config.headers['auth-token'] = `Bearer ${localStorage.getItem('token')}`
//      return config
//  })