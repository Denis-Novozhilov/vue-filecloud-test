import axios from "axios";
import {BASE_URL} from "@src/api/index.ts";
import {authStore} from "@src/store";
import router from "@src/router/router.ts";

export const userLogOut = () => {
    axios.post(`${BASE_URL}/logout`, {},{
        headers: {
            'auth-token': `Bearer ${authStore.token}`
        }
    })
        .then(() => {
            authStore.logOut()
            router.push({
                name: 'Login'
            });
        })
        .catch(error => {
            console.log(JSON.stringify(error.response.data))
        });
}