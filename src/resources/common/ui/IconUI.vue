<script lang="ts" setup>
import {defineProps, ref, watch} from 'vue';

const props = defineProps<{
    icon: string
}>();

const svg = ref('');
watch(() => props.icon, (icon: string) => {
  /*

         alias as `@icons/${icon}.svg?raw`
         works only when <icon-u-i> component placed in
         directory `.src/components/IconUI.vue`

  */

  // import(`@icons/${icon}.svg?raw`).then((module) => {
  // import(`@nested/${icon}.svg?raw`).then((module) => {
  // import(`@iconsP/${icon}.svg?raw`).then((module) => {
  // import(`@srcP/assets/icons/${icon}.svg?raw`).then((module) => {
  // import(`@nestedP/${icon}.svg?raw`).then((module) => {
  
  import(`../../../../src/assets/icons/${icon}.svg?raw`).then((module) => {
    if (icon === props.icon) {
      svg.value = module.default;
    }

  });
}, {
  immediate: true,
})
</script>

<template>
  <div
      class="e-icon"
      v-html="svg"
  />
</template>

<style scoped>
.e-icon {
    @apply inline-flex;

    :deep svg{
        @apply w-full h-full;

        * {
            @apply fill-current;
        }

        .layer-main {
            color: inherit;
        }

        .layer-second {
            opacity: .56;
        }

        .layer-white {
            color: white;
        }
    }
}

</style>
