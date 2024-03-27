import {defineStore} from 'pinia';
import {reactive} from "vue";

export const useNotificationStore = defineStore('notificationStore',  ()=>{
    const progressEntity = reactive({
        fileName: '',
        message: '',
        uploading: false,
        uploadProgress: 0,
        set(message: string, fileName: string, status: boolean) {
            this.message = message;
            this.fileName = fileName;
            this.uploading = status;
        },
        reset() {
            this.fileName = '';
            this.message = '';
            this.uploading = false;
            this.uploadProgress = 0;
        }
    });
    return {progressEntity}
});
