<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { authStore } from "@src/store/index.ts";

const router = useRouter();

const loginData = {
    login: '',
    password: ''
};

const login = () => {
    axios.post('http://localhost:3000/login', loginData)
        .then(response => {
            console.log(response.data);

            authStore.toggleLoggedStatus(true);
            authStore.setToken(response.data);

            router.push({name: 'Main'});
        })
        .catch(error => {
            console.log(JSON.stringify(error.response.data))
            // [] #task add error handling due to project figma design
            // {"login":["Неправильно указана почта"],"password":["Неправильно указан пароль"]}
        });
};
</script>

<template>
    <div class="
        flex
        flex-col
        justify-center
        items-center
        h-[90vh]
    ">
        <h1 class="
            text-6xl
            font-bold
            m-9
        ">Облачное хранилище</h1>
        <p class="
            text-[24px]
            leading-[30px]
            mt-8
            mb-10
            text-center
        ">Введите свою почту и пароль, чтобы начать<br>работу в облачном хранилище</p>
        <form class="
            flex
            flex-col
            justify-center
            items-center
        ">
            <input 
                class="
                    border
                    rounded-md
                    py-[20px]
                    px-[30px]
                    m-5
                    w-[530px]
                    bg-slate-200
                    text-[21px]
                " 
                placeholder="Введите вашу почту" 
                type="email"  
                name="email" 
                v-model="loginData.login"
            >
            <input 
                class="
                    border
                    rounded-md
                    py-[20px]
                    px-[30px]
                    mb-10
                    w-[530px]
                    bg-slate-200
                    text-[21px]
                " 
                placeholder="Введите ваш пароль" 
                type="password"  
                name="password" 
                v-model="loginData.password"
            >
            <button 
                class="
                    border
                    rounded-md
                    w-44 
                    h-[70px] 
                    p-3
                    m-5
                    bg-blue-700
                    text-white
                    text-2xl
                "
                @click.prevent="login"
            >Войти</button>
        </form>
    </div>
</template>