<script setup lang="ts">

import {computed, ComputedRef, withDefaults} from "vue";
import {filesStore} from "../../../../store";
import {fileDelete} from "../../../../api/fileDelete.ts";
import {fileDownload} from "../../../../api/fileDownload.ts";
import ButtonUI from "../../../common/ui/ButtonUI.vue";

const props = withDefaults(defineProps<{
  isSelections:  ComputedRef<boolean>  | boolean,
  isEvery:  ComputedRef<boolean> | boolean,
  isAny:  ComputedRef<boolean> | boolean
}>(), {
  isSelections: false,
  isEvery: false,
  isAny: false
})

const determineMessage = (forEvery: string, forSome: string): string => {
  if (props.isEvery) {
    return forEvery;
  } else if (props.isAny) {
    return forSome;
  } else {
    return '';
  }
}

const messageDownload = computed(() => determineMessage('Скачать все', 'Скачать выбранные'));
const messageDelete = computed(() => determineMessage('Удалить все', 'Удалить выбранные'));
const isAnyFilesAndSelections = computed(()=> props.isSelections && filesStore.filesEntities.length )

</script>

<template>
  <div
      class="mb-[42px]"
      v-if="isAnyFilesAndSelections"
  >
    <button-u-i
        class="h-[45px]"
        bgType="inverted"
        textType="bold"
        :msg="messageDownload"
        @click="fileDownload(filesStore.getSelectedFiles)"
    />
    <button-u-i
        class="h-[45px]"
        bgType="inverted"
        textType="bold"
        :msg="messageDelete"
        @click="fileDelete(filesStore.getSelectedFiles)"
    />
  </div>
</template>