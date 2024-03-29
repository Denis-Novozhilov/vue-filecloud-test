<script setup lang="ts">
import {authStore} from '../../../store';
import {storeToRefs} from 'pinia';
import IconUI from "@src/resources/common/ui/IconUI.vue";
import {userLogOut} from "@src/api";
import router from "@src/router/router.ts";

const { isLogged } = storeToRefs(authStore);
</script>

<template>
    <div
        :class="[
          'flex',
          'h-[70px]',
          isLogged ? 'loggedIn' : 'loggedOut'
        ]"

    >
        <button
            class="
            cursor-pointer
            pt-2
            mb-1
            "
            @click="router.push({name:'Main'})"
        >
          <icon-u-i
              class="
              opacity-50
              mt-1.5
              "
              icon="skillspace-logo"
          ></icon-u-i>
        </button>

        <button 
            v-if="isLogged"
            @click.prevent="userLogOut"
            class="
            flex
            flex-row
            justify-around
            pt-2
            mt-[6px]
            rounded-md
            w-[135px]
            px-[10px]
            cursor-pointer
            hover:bg-gray-200
            transition
            duration-300
        ">
            <icon-u-i
                class="self-center"
                icon="exit-ui"
            ></icon-u-i>
            <p
                class="
                font-bold
                text-[21px]
                self-center
                leading-[30px]
                pb-2
            ">выйти</p>
        </button>
    </div>
</template>

<style scoped>
    .loggedOut { @apply justify-center }
    .loggedIn { @apply justify-between }
</style>