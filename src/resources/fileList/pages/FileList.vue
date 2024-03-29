<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {filesStore, notificationStore} from '@src/store';
import TableHeaderControls from "@src/resources/fileList/pages/components/FileListHeaderControls.vue";
import ButtonUI from "@src/resources/common/ui/ButtonUI.vue";
import IconUI from "@src/resources/common/ui/IconUI.vue";
import {defineWidth, updateWidth} from "@src/helpers/defineWidth.ts";
import {getExtensionIconURL} from "@src/helpers/getExtension.ts";
import {focusNameField} from "@src/helpers/focusNameField.ts";
import {ejectName} from "@src/helpers/ejectName.ts";
import {FileEntity} from "@src/types/fileEntity.ts";
import {fileDelete, fileDownload, fileListInit, fileRename, fileSend} from '@src/api/index.ts'
import {formatExtension} from "@src/helpers/formatExtension.ts";
import {formatTimestamp} from "@src/helpers/formatTimestamp.ts";
import {formatBytes} from "@src/helpers/formatBytes.ts";


let isAnyFileSelected = ref<boolean>(false);
let isEveryFileSelected = ref<boolean>(false);

const mainChecker = ref<HTMLInputElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const {progressEntity} = notificationStore;

// FILTERS ↓
type FiltersVariants = 'name' | 'createdAt' | 'size';
type OrdersVariants = 'Asc' | 'Desc';
const filersOrders: { [key: string]: OrdersVariants } = {
    name: 'Asc',
    createdAt: 'Asc',
    size: 'Asc',
}

let sortKey = ref<FiltersVariants>('name');
let sortOrder = ref<number>(1);

const sortedFiles = computed(() => {
    if (filesStore?.filesEntities?.length) {
        return filesStore.filesEntities.slice().sort((a, b) => {
            return a[sortKey.value] > b[sortKey.value] ? sortOrder.value : -sortOrder.value;
        });
    } else {
        return []
    }
});

const sortBy = (key: FiltersVariants) => {
    if (sortKey.value === key) {
        sortOrder.value *= -1;
        if (sortOrder.value < 0) {
            filersOrders[key] = 'Desc'
        } else {
            filersOrders[key] = 'Asc'
        }
    } else {
        sortKey.value = key;
        sortOrder.value = 1;
        filersOrders[key] = 'Asc'
    }
};
// FILTERS ↑


const toggleItemSelection = (item) => {

  if (item.isChecked) {
    filesStore.removeSelected(item)
    item.isChecked = false;

  } else {
    item.isChecked = true;
    filesStore.addSelected(item)
  }

  if (filesStore.getQuantitySelected === 0) {
    isAnyFileSelected.value = false;
  } else {
    isAnyFileSelected.value = true;
  }

  if (filesStore.getQuantitySelected
      && filesStore.getQuantitySelected === filesStore.getQuantityEntities) {
    isEveryFileSelected.value = true;
  } else {
    isEveryFileSelected.value = false;
  }
}
const handleSelectAll = (event: Event) => {

  if (event?.target?.checked) {

    filesStore.filesEntities.forEach(item => {
      item.isChecked = true;
      filesStore.addSelected(item);
    })

    isEveryFileSelected.value = true;

  } else {
    filesStore.filesEntities.forEach(item => {
      item.isChecked = false
    })

    filesStore.clearAllSelected();

    isEveryFileSelected.value = false;
    isAnyFileSelected.value = false;
  }
}
const skipMainSelections = () => {
  if (mainChecker.value?.checked) {
    mainChecker.value?.click()
  }
  if (isEveryFileSelected.value) {
    isEveryFileSelected.value = false;
  }
}
const sendFileHandler = async (files: FileList) => {
  await fileSend(files);
  skipMainSelections();
}
const deleteFileHandler = async (files: FileEntity[]) => {
  await fileDelete(files);
  skipMainSelections();
}

const checkSelections = computed(() => isEveryFileSelected.value || isAnyFileSelected.value);
const isEmpty = computed(() => Boolean(filesStore.getQuantityEntities) ? false : true)


onMounted(() => {
  fileListInit()
})
</script>

<template>
    <div class="relative">
        <div>
            <h1 class="
                text-[34.5px]
                font-bold
                mt-[56px]
            ">Ваши файлы</h1>
            <div class="
                h-[42px] 
                mt-[24px]
            ">
                <input
                    class="hidden"
                    type="file"
                    ref="fileInput"
                    @change="sendFileHandler(fileInput.files)"
                    multiple
                >

                <button-u-i
                    bgType="common"
                    textType="normal"
                    msg="Добавить"
                    @click="fileInput?.click()"
                />

            </div>

            <!-- FilesList table v1 ↓ -->
            <ul
                class="
                mt-[50px]
                filesList
                ">

                <!-- filters ↓ -->
                <li class="relative">

                    <!-- mail checker ↓ -->
                    <div class="checker mainChecker">
                        <label :for="'checkAll'">

                            <input
                                class="
                                peer/inputx
                                appearance-none
                                "
                                type="checkbox"
                                :name="'checkAll'"
                                :id="'checkAll'"
                                :checked="isEveryFileSelected"
                                :disabled="isEmpty"

                                @change="handleSelectAll($event)"
                                ref="mainChecker"
                            >

                            <div
                                :hidden="isEmpty"
                                class="
                                w-[33px]
                                h-[33px]
                                bg-center
                                bg-no-repeat
                                rounded-[6px]
                                cursor-pointer
                                bg-[url('./assets/icons/checkbox-ui-unchecked.svg')]
                                peer-checked/inputx:bg-[url('./assets/icons/checkbox-ui-checked.svg')]
                                peer-focus/inputx:outline
                                peer-focus/inputx:outline-[5px]
                                peer-focus/inputx:outline-offset-[-5px]
                                peer-focus/inputx:outline-blue-500
                                peer-disabled/inputx:opacity-30
                                "
                            ></div>
                        </label>
                    </div>
                    <!-- mail checker ↑ -->


                    <!--   #task [] eject to separate Components FilterButton   -->
                    <button
                        class="
                          fl-col1
                          text-left
                          filterBtn
                          cursor-pointer
                          disabled:opacity-30
                        "
                        :disabled="isEmpty"
                        @click="sortBy('name')"
                    >
                        <div class="flex">
                            <p>Название</p>
                            <icon-u-i
                                icon="arrow-ui"
                                :class="[
                                'ml-1',
                                'fill-current',
                                (filersOrders['name'] === 'Desc') && 'rotate-180']"
                            ></icon-u-i>
                        </div>
                    </button>

                    <!--   #task [] eject to separate Components FilterButton   -->
                    <button
                        class="
                          fl-col2
                          filterBtn
                          cursor-pointer
                          disabled:opacity-30
                        "
                        :disabled="isEmpty"
                        @click="sortBy('createdAt')"
                    >

                      <div class="flex justify-center">
                          <p>Дата изменения</p>
                          <icon-u-i
                              icon="arrow-ui"
                              :class="[
                                  'ml-1',
                                  'fill-current',
                                  (filersOrders['createdAt'] === 'Desc') && 'rotate-180']"
                          ></icon-u-i>
                      </div>

                    </button>

                    <!--   #task [] eject to separate Components FilterButton   -->
                    <button
                        class="
                          fl-col3
                          filterBtn
                          cursor-pointer
                          disabled:opacity-30
                        "
                        :disabled="isEmpty"
                        @click="sortBy('size')"
                    >
                        <div class="flex justify-center">
                            <p>Размер</p>
                            <icon-u-i
                                icon="arrow-ui"
                                :class="[
                                    'ml-1',
                                    'fill-current',
                                    (filersOrders['size'] === 'Desc') && 'rotate-180']"
                            ></icon-u-i>
                        </div>
                    </button>

                </li>
                <!-- filters ↑ -->
                <hr
                  class="
                  mt-[7px]
                  mb-[25px]
                  border
                  border-b-[2px]
                ">

                <p
                  v-if="isEmpty"
                  class="
                  block
                  mt-10
                  ml-4
                  text-3xl
                  font-bold
                  text-gray-300
                ">Нет файлов</p>

                <table-header-controls
                  :isSelections="checkSelections"
                  :isAny="isAnyFileSelected"
                  :isEvery="isEveryFileSelected"
                ></table-header-controls>


                <!-- files list row ↓ -->
                <li :class="['filesListRow', 'hover:bg-slate-100', item?.isChecked && 'selected']"
                    v-for=" item  in  sortedFiles " :key="item?.id">
                    <div class="checker">
                        <label :for="`${item?.id}`">
                            <input
                                class="
                                  peer/inputx
                                  appearance-none
                                "
                                type="checkbox"
                                :name="`${item?.id}`"
                                :id="`${item?.id}`"
                                :checked="item?.isChecked"
                                @change="toggleItemSelection(item)"
                            >
                            <div class="
                                  w-[33px]
                                  h-[33px]
                                  bg-center
                                  bg-no-repeat
                                  rounded-[6px]
                                  cursor-pointer
                                  bg-[url('./assets/icons/checkbox-ui-unchecked.svg')]
                                  peer-checked/inputx:bg-[url('./assets/icons/checkbox-ui-checked.svg')]
                                  peer-focus/inputx:outline
                                  peer-focus/inputx:outline-[5px]
                                  peer-focus/inputx:outline-offset-[-5px]
                                  peer-focus/inputx:outline-blue-500
                                  peer-disabled/inputx:opacity-30"
                            ></div>
                        </label>
                    </div>
                    <div class="fl-col1 fileName">
                        <img :src="getExtensionIconURL(item?.name)" />

                        <!-- #task [] refactor - delete placeholder attribute? -->
                        <input
                            type="text"
                            :ref="`fileName${item.id}`"
                            :placeholder="ejectName(item?.name)"
                            :value="ejectName(item?.name)"
                            :style="defineWidth(item?.name)"
                            class="
                              text-3xl
                              font-mono
                              ml-6
                              mt-1.5
                              rounded-md
                              px-[5px]
                              text-ellipsis
                              cursor-text"
                            @input="updateWidth($event, item, this)"
                            @change="fileRename($event, item)" />
                        <p class="
                            info
                            mt-1.5
                        ">{{ formatExtension(item?.name) }}</p>

                    </div>
                    <div class="fl-col2">
                        <p class="info">{{ formatTimestamp(item?.createdAt) }}</p>
                    </div>
                    <div class="fl-col3">
                        <p class="info">{{ formatBytes(item?.size) }}</p>
                    </div>
                    <div
                        class="
                        fl-col4
                        flex
                        gap-[30px]"
                    >
                        <button
                            class="
                            flex
                            justify-center
                            rounded-[2px]
                            focus:outline
                            focus:outline-[3px]
                            focus:outline-stone-300
                            focus:outline-offset-[3px]
                            focus:border-none"
                            @click="focusNameField(this,item)"
                        >
                            <!-- #task [] refactor ↑ -->

                          <icon-u-i
                              class="self-center"
                              icon="edit-ui"
                          ></icon-u-i>
                        </button>

                        <button
                            class="
                            flex
                            justify-center
                            rounded-[2px]
                            focus:outline
                            focus:outline-[3px]
                            focus:outline-stone-300
                            focus:outline-offset-[3px]
                            focus:border-none"
                            @click="fileDownload([item])"
                        >
                          <icon-u-i
                              class="self-center"
                              icon="download-ui"
                          ></icon-u-i>
                        </button>

                        <button
                            class="
                            flex
                            justify-center
                            rounded-[2px]
                            focus:outline
                            focus:outline-[3px]
                            focus:outline-stone-300
                            focus:outline-offset-[3px]
                            focus:border-none"
                            @click="deleteFileHandler([item])"
                        >
                          <icon-u-i
                              class="self-center"
                              icon="delete-ui"
                          ></icon-u-i>
                        </button>
                    </div>
                </li>
            </ul>
            <!-- fail list table v1 ↑ -->

            <!-- fail list table v2 ↓ -->
            <!-- fail list table v2 ↑ -->
        </div>

        <!-- progress bar -->
        <div v-if="progressEntity.uploading" class="
            sticky
            flex
            flex-col
            justify-between
            items-start
            bg-black
            pt-2.5
            px-0
            w-10/12
            h-16
            ml-2.5
            rounded-b
            bottom-20
            text-ellipsis
        ">
            <p class="
                block
                px-14
                text-2xl
                w-full
                text-white
                text-ellipsis
                whitespace-nowrap
                overflow-hidden
            ">{{ progressEntity.message }} {{ progressEntity.fileName }}</p>
            <!-- progress bar container -->
            <div class="
                w-full
                h-1.5
                bg-cyan-300
            ">
                <!-- progress bar value -->
                <div
                   :style="`width: ${progressEntity.uploadProgress}%`"
                   class="
                    h-1.5
                    bg-blue-600
                ">
                </div>

            </div>
        </div>
    </div>
</template>

<style scope>
.filesList {
    @apply min-w-[1240px] mb-[100px]
}

.filterBtn {
    @apply w-[220px] h-[56px] text-[18px] font-bold px-5 rounded-md cursor-pointer hover:bg-gray-200 transition duration-300
}

.filesListRow {
    @apply flex items-center h-[78px] relative [&>div]:h-[100%] [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div.fileName]:justify-start [&>div.fileName]:pl-[24px] [&>div.controls]:justify-center [&_label]:w-[40px] [&_label]:h-[40px] [&_p.info]:text-[24px] [&_p.info]:font-[600]
}

.checker {
    @apply absolute -left-[50px] -top-[18px] w-[40px] h-[40px]
}

.mainChecker {
    @apply -top-[12px]
}

.fl-col1 {
    @apply w-[500px]
}

.fl-col2 {
    @apply w-[270px]
}

.fl-col3 {
    @apply w-[180px] mr-[20px]
}

.fl-col4 {
    @apply w-[220px]
}

.selected {
    @apply bg-slate-200 transition duration-300
}
</style>