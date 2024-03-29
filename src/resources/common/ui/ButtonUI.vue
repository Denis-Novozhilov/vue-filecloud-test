<script setup lang="ts">

defineProps<{ 
  msg: string,
  bgType?: 'common' | 'inverted',
  textType?: 'bold' | 'normal',
}>()

</script>

<template>
    <!-- <button type="button" @click="count++">count is {{ count }}</button> -->
    <!-- :class="['filesListRow','hover:bg-slate-100', item?.isChecked && 'selected']" -->
    <button 
      :class="['btn',bgType,textType]"
      type="button"
    >{{ msg }}</button>
</template>

<style scoped>
.btn{@apply
  min-h-[42px]
  rounded-md
  mr-5
  px-5
  text-[19px]
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