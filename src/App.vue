<script setup lang="ts">
import NavbarUI from "@src/resources/common/ui/NavbarUI.vue";
</script>

<template>
  <div class=" container mx-auto px-[176px]" >
    <navbar-u-i/>
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
