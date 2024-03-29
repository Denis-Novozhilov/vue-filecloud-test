<script setup lang="ts">

defineProps<{ 
  msg?: string,
  bgType?: 'common' | 'inverted',
  textType?: 'bold' | 'normal',
}>()

</script>

<template>
    <button
        type="button"
        :class="[
            'btn',
            bgType,
            textType
        ]"
    >
      {{ msg }}
      <slot></slot>
    </button>
</template>

<style scoped>
.btn{@apply
  min-h-11
  rounded-md
  mr-5
  px-5
  text-xl
}
.bold {@apply
  font-bold
}
.normal {@apply
  font-normal
}
.common{@apply
  text-white
  bg-blue-600
  hover:bg-blue-500
}
.inverted{@apply
  text-blue-500
  bg-slate-100
  hover:bg-slate-200
}
</style>