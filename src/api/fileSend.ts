import axios from "axios";
import {BASE_URL} from "@src/api/index.ts";
import {authStore, filesStore, notificationStore} from "@src/store";

const {progressEntity} = notificationStore;
export const fileSend = async (files: FileList | null) => {

    if (!files) {
        return
    }

    for (const fileToUpload of files) {

        // #task [] refactor - use progressEntity as progressBar custom hook
        progressEntity.reset();
        progressEntity.message = 'Загрузка файла';
        progressEntity.fileName = fileToUpload.name;
        progressEntity.uploading = true;

        let formData = new FormData();
        formData.append('file', fileToUpload);

        // #task [] refactor - axios to external function
        // #task [] refactor - url to constant
        // #task [] refactor - headers to constant
        // #task [] refactor - onUploadProgress to constant
        await axios.post(`${BASE_URL}/file?filename=${fileToUpload.name}`, formData, {
            headers: {
                'auth-token': `Bearer ${authStore.token}`,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
            }
        })
            .then(responce => {
                filesStore.pushFileEntity(responce.data);
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