<template>
    <div
        class="e-icon"
        v-html="svg"
    />
</template>

<script lang="ts" setup>
import {defineProps, ref, watch} from 'vue';
// import type {Icons} from '@src/types/icons';

const props = defineProps<{
    icon: string
}>();

const svg = ref('');
watch(() => props.icon, (icon: string) => {
  import(`@icons/${icon}.svg?raw`).then((module) => {
    if (icon === props.icon) {
      svg.value = module.default;
    }

  });
}, {
  immediate: true,
})

// work2
// watch(() => props.icon, (icon: string) => {
//   import(`@src/assets/icons/${icon}.svg?raw`).then((module) => {
//
//     console.log(`module`)
//     console.log(module)
//
//     if (icon === props.icon) {
//       svg.value = module.default;
//     }
//
//   });
// }, {
//   immediate: true,
// })

// work1
// watch(() => props.icon, (icon: string) => {
//     import(`../../src/assets/icons/${icon}.svg?raw`).then((module) => {
//
//       console.log(`module`)
//       console.log(module)
//
//       if (icon === props.icon) {
//           svg.value = module.default;
//       }
//
//     });
// }, {
//     immediate: true,
// })

//// ['fill', 'stroke', 'opacity', 'fill-opacity']
</script>

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
