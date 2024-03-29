import axios from "axios";
import {BASE_URL} from "@src/api/index.ts";
import {ejectExtension} from "@src/helpers/getExtension.ts";
import {authStore, filesStore, notificationStore} from "@src/store";
import {ejectName} from "@src/helpers/ejectName.ts";
import {FileEntity} from "@src/types/fileEntity.ts";

const {progressEntity} = notificationStore;
export const fileRename = (event: Event, item: FileEntity) => {

    const oldName = ejectName(item?.name);
    let value = event?.target?.value?.trim();

    if (value === oldName) {
        return
    };

    if (value === "") {
        value = '_'
    };

    progressEntity.set('Переименование файла', '', true);

    // #task [] refactor url to constants
    // #task [] refactor headers to constants
    // #task [] refactor eject onUploadProgress to helpers
    axios.put(`${BASE_URL}/file?filename=${item.name}`, {
        name: `${value}.${ejectExtension(item?.name).toLowerCase()}`
    }, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`,
            "content-type": "application/json; charset=utf-8"
        },
        onUploadProgress: progressEvent => {
            progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        }
    })
        .then(response => {

            // #task [] turn back backend behavior and filter fileStore wit new single file
            filesStore.updateEntity(response.data);
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            // [] #task Обработка ошибки
        })
        .finally(() => {
            progressEntity.reset();
        })
}
