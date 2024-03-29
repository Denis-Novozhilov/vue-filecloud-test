import {FileEntity} from "../types/fileEntity.ts";
import {BASE_URL} from "./index.ts";
import {authStore, filesStore, notificationStore} from "../store";
import axios from "axios";

const {progressEntity} = notificationStore;
export const fileDelete = async (files: FileEntity[]) => {

    for (const fileToDelete of files) {

        // #task [] refactor - use progressEntity as progressBar custom hook
        progressEntity.reset();
        progressEntity.set('Удаление файла', fileToDelete.name, true);

        // #task [] refactor - axios to external function
        // #task [] refactor - url to constant
        // #task [] refactor - headers to constant
        // #task [] refactor - onUploadProgress to constant
        await axios.delete(`${BASE_URL}/file?id=${fileToDelete.id}`, {
            headers: {
                'auth-token': `Bearer ${authStore.token}`,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
            }
        })
            .then((responce) => {
                if (responce.statusText === "OK") {
                    // $task [] ?? refactor - add Remove Selected in filesStore.deleteFileEntity()
                    filesStore.deleteFileEntity(fileToDelete);
                    filesStore.removeSelected(fileToDelete);
                }
            })
            .catch(error => {
                // #task [] refactor - handle error in progressBar
                console.error('Error uploading files:', error);
            })
            .finally(() => {
                progressEntity.reset();
            })
    }
}
