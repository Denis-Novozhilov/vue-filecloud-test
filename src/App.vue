<script setup lang="ts">
  import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class=" container mx-auto px-[185px]" >
    <Navbar/>
    <div class="border-b-2 border-t-gray-300" ></div>
    <router-view/>
  </div>
</template>
