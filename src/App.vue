<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { storeToRefs } from 'pinia';
import { useStore } from './store';


    const store = useStore();

    const { name, number } = storeToRefs(store);
</script>

<template>
  <router-link style="margin: 0 5px" to="/">Home</router-link>
  <router-link style="margin: 0 5px" to="/about">About</router-link>
  <router-link style="margin: 0 5px" to="/settings">Settings</router-link>
  <router-view></router-view>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <h1>Sore values:</h1>
  <h2>{{ name }}</h2>  
  <h2>{{ number }}</h2>  
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
