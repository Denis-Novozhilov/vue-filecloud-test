<script lang="ts" setup>
    // import { storeToRefs } from 'pinia';
import { useStore } from '../store';

    const store = useStore();

    // const { name, number } = storeToRefs(store);
</script>

<template>
    <div>
        <h1>main page</h1>
    </div>


</template>
<!-- <div>
        <h2>Home view</h2>
        <p>Name: {{ store.name }}</p>
        <button @click="store.changeName('Apple')">ChangeNameToApple</button>
        <button @click="store.$reset">ResetStore</button>
    </div> -->