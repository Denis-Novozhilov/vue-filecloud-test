import axios from "axios";
import {BASE_URL} from "@src/api/index.ts";
import {authStore, filesStore} from "@src/store";

export const fileListInit = () => {
    axios.get(`${BASE_URL}/list`, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`
        }
    })
        .then(response => {
            console.log(response.data)
            filesStore.setFileEntities(response.data);
        })
        .catch(error => {
            console.log(JSON.stringify(error))
            console.log(JSON.stringify(error.response.data))
        });
}
