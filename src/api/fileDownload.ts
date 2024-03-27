import {FileEntity} from "../types/fileEntity.ts";
import axios from "axios";
import {BASE_URL} from "./index.ts";
import {authStore, notificationStore} from "../store";

const {progressEntity} = notificationStore;

export const fileDownload = async (files: FileEntity[]) => {

    for (const fileToDownload of files) {

        // #task [] refactor - use progressEntity as progressBar custom hook
        progressEntity.reset();
        progressEntity.message = 'Скачивание файла';
        progressEntity.fileName = fileToDownload.name;
        progressEntity.uploading = true;

        // #task [] refactor - axios to external function
        // #task [] refactor - url to constant
        // #task [] refactor - headers to constant
        // #task [] refactor - onUploadProgress to constant
        // #task [] refactor eject onUploadProgress to helpers

        let blobURL = '';
        await axios.get(`${BASE_URL}/file?filename=${fileToDownload.name}`, {
            responseType: 'blob',
            headers: {
                'auth-token': `Bearer ${authStore.token}`,
            },
            onDownloadProgress: progressEvent => {
                progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
            },
            // #task [] ↑↓ on this example work out how to cancel axios responce by user disturbing
        })
            .then(response => {

                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                blobURL = URL.createObjectURL(blob);


                const tempLink = document.createElement('a');
                tempLink.href = blobURL;
                tempLink.download = fileToDownload.name;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                progressEntity.reset();

                // window.open(url);
            })
            .catch(error => {
                // Обработка ошибки
                console.error('Error downloading file:', error);
                // #task [] handle errors and clear error html element
            })
            .finally(() => {
                URL.revokeObjectURL(blobURL);
                progressEntity.reset();
            })
    }
}
