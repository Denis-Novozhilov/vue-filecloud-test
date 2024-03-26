<script setup lang="ts">
import Navbar from './views/Navbar.vue';
</script>

<template>
  <div class=" container mx-auto px-[176px]" >
    <Navbar/>
    <hr class="
        my-[7px]
        w-[100vw]
        absolute
        -left-[18px]
        border
        border-b-[2px]
    ">
    <router-view/>
  </div>
</template>
