<script lang="ts" setup>
    const isLogged = false;
</script>

<template>
    <div :class="['h-[70px]', 'flex', isLogged ? 'loggedIn' : 'loggedOut']" @click="$router.push('/')">
        <button class="cursor-pointer pt-2 mb-1">
            <img  class="w-[130px]" src="../assets/skillplace-logo.svg" alt="logo-skillplace">
        </button>
        <button v-if="isLogged" class=" flex flex-row justify-around pt-2 w-[135px] px-[10px] cursor-pointer hover:bg-gray-200 transition duration-300">
            <img class=" w-[21px] self-center "src="../assets/exit.svg" alt="icon-exit">
                <p class=" font-bold text-[21px] self-center leading-[30px] pb-2 ">выйти</p>
        </button>
    </div>
</template>

<style scoped>
    .loggedOut { @apply justify-center }
    .loggedIn { @apply justify-between }
</style>