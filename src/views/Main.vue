<script lang="ts" setup>
import axios from 'axios';
import {computed, onMounted, ref} from 'vue';
import {authStore, filesStore, notificationStore} from '../store/index';
import {BASE_URL} from '../api/index.ts'
import TableHeaderControls from "../components/TableHeaderControls.vue";
import ButtonUI from "../components/ButtonUI.vue";
import {fileDownload} from "../api/fileDownload.ts";
import {fileDelete} from "../api/fileDelete.ts";
import {formatTimestamp} from "../helpers/formatTimestamp.ts";
import {formatBytes} from "../helpers/formatBytes.ts";

let isAnyFileSelected = ref<boolean>(false);
let isEveryFileSelected = ref<boolean>(false);

const mainChecker = ref<HTMLInputElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const {progressEntity} = notificationStore;

// FILTERS
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
    // inverse current filter ↓
    if (sortKey.value === key) {
        sortOrder.value *= -1;
        if (sortOrder.value < 0) {
            filersOrders[key] = 'Desc'
        } else {
            filersOrders[key] = 'Asc'
        }
        // apply new filter ↓
    } else {
        sortKey.value = key;
        sortOrder.value = 1;
        filersOrders[key] = 'Asc'
    }
};
/// FILTERS ↑

const checkSelections = computed(() => isEveryFileSelected.value || isAnyFileSelected.value);

onMounted(() => {
    // #task [] add to constants
    // #task [] add header to constants

    axios.get(`${BASE_URL}/list`, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`
        }
    })
        .then(response => {
            console.log(response.data)
            filesStore.setFileEntities(response.data);
        })
        .catch(error => {
            console.log(JSON.stringify(error))
            console.log(JSON.stringify(error.response.data))
        });
})

const ejectName = (fileName = 'default.file') => fileName.split(".").slice(0, -1).join('.');
const ejectExtension = (fileName = 'default.file') => fileName?.split(".").at(-1).toUpperCase();

// [] task refactor remove to helpers and improve with object
const getExtensionIcon = (fileName = 'default.file') => {

    const extension = ejectExtension(fileName);

    let res;

    switch (extension) {
        case 'DOCX':
            res = 'DOCX'
            break;
        case 'MP4':
            res = 'MP4'
            break;
        case 'PNG':
            res = 'PNG'
            break;
        case 'XLS':
            res = 'XLS'
            break;
        default:
            res = 'UNNO-EDT-2'

    }

    return `./src/assets/${res}.svg`
}

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

const handleSelectAll = (event) => {

    if (event.target.checked) {

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

const handleFileSend = async (files: FileList | null) => {

    if (!files) {
        return
    }

    for (const fileToUpload of files) {

        // #task [] refactor - use progressEntity as progressBar custom hook
        progressEntity.reset();
        progressEntity.message = 'Загрузка файла';
        progressEntity.fileName = fileToUpload.name;
        progressEntity.uploading = true;

        let formData = new FormData();
        formData.append('file', fileToUpload);

        // #task [] refactor - axios to external function
        // #task [] refactor - url to constant
        // #task [] refactor - headers to constant
        // #task [] refactor - onUploadProgress to constant
        await axios.post(`${BASE_URL}/file?filename=${fileToUpload.name}`, formData, {
            headers: {
                'auth-token': `Bearer ${authStore.token}`,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
            }
        })
            .then(responce => {
                filesStore.pushFileEntity(responce.data);
            })
            .catch(error => {
                // #task [] refactor - handle error in progressBar
                console.error('Error uploading files:', error);
            })
            .finally(() => {
                progressEntity.reset();
            })
    }
    if (isEveryFileSelected.value) {
        mainChecker.value?.click()
    }
}

const updateWidth = (event, { id }, _this) => {

    const value = event.target.value;
    const inputRef = _this.$refs[`fileName${id}`];

    // #task [] eject 17.5 and 8 to constants
    inputRef[0].style.width = `${value.length * 17.5 + 8}px`;
}

// #task [] refactor ↓ with ref instead _this.$refs etc...
const handleFileRename = (event, item, _this, oldName) => {

    let value = event.target.value.trim()

    if (value === oldName) {
        return
    }

    if (value === "") {
        value = '_'
    }

    const _inputRef = _this.$refs[`fileName${item.id}`][0];


    // update input width
    // #task [] eject 17.5 and 8 to constants
    _inputRef.style.width = `${value.length * 17.8 + 8}px`;


    progressEntity.message = 'Переименование файла';
    progressEntity.uploading = true;


    // #task [] refactor url to constants
    // #task [] refactor headers to constants
    // #task [] refactor eject onUploadProgress to helpers
    axios.put(`${BASE_URL}/file?filename=${item.name}`, {
        name: `${value}.${ejectExtension(item?.name).toLowerCase()}`
    }, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`,
            "content-type": "application/json; charset=utf-8"
        },
        onUploadProgress: progressEvent => {
            progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        }
    })
        .then(response => {

            // #task [] turn back backend behavior and filter fileStore wit new single file
            filesStore.updateEntity(response.data);
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            // [] #task Обработка ошибки
        })
        .finally(() => {
            progressEntity.reset();
        })
}

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
                    @change="handleFileSend(fileInput?.files)"
                    multiple
                >

                <button-u-i
                    bgType="common"
                    textType="normal"
                    msg="Добавить"
                    @click="fileInput?.click()"
                />

            </div>

            <!-- fail list table -->
            <ul class="
                mt-[50px]
                filesList
            ">

                <!-- filters ↓ -->
                <li class="relative">

                    <!-- mail checker ↓ -->
                    <div class="checker mainChecker">
                        <label :for="'all'">
                            <input class="
                    peer/inputx 
                    appearance-none
                    " type="checkbox" :name="'all'" :id="'all'" :checked="isEveryFileSelected"
                                @change="handleSelectAll($event)" ref="mainChecker">
                            <div class="
                            w-[33px]
                            h-[33px]
                            bg-center
                            bg-no-repeat
                            rounded-[6px]
                            cursor-pointer
                            bg-[url('./assets/checkbox-unchecked.svg')]
                            peer-checked/inputx:bg-[url('./assets/checkbox-checked.svg')]
                            peer-focus/inputx:outline
                            peer-focus/inputx:outline-[5px]
                            peer-focus/inputx:outline-offset-[-5px]
                            peer-focus/inputx:outline-blue-500
                            peer-disabled/inputx:opacity-30
                        "></div>
                        </label>
                    </div>
                    <!-- mail checker ↑ -->


<!--    #task [] eject to separate Components              -->
                    <button
                        class="
                          fl-col1
                          text-left
                          filterBtn
                          cursor-pointer"
                        @click="sortBy('name')"
                    >

                        <div class="flex">
                            <p>Название</p>
                            <img :class="['block', 'mx-5', (filersOrders['name'] === 'Desc') && 'rotate-180']"
                                src="../assets/arrow.svg" alt="arrow">
                        </div>
                    </button>

                    <button
                        class="
                          fl-col2
                          filterBtn
                          cursor-pointer"
                        @click="sortBy('createdAt')"
                    >

                      <div class="flex justify-center">
                          <p>Дата изменения</p>
                          <img src="../assets/arrow.svg"
                              :class="['block', 'mx-5', (filersOrders['createdAt'] === 'Desc') && 'rotate-180']"
                              alt="arrow">
                      </div>

                    </button>

                    <button
                        class="
                          fl-col3
                          filterBtn
                          cursor-pointer"
                        @click="sortBy('size')"
                    >

                        <div class="flex justify-center">
                            <p>Размер</p>
                            <img src="../assets/arrow.svg"
                                :class="['block', 'mx-5', (filersOrders['size'] === 'Desc') && 'rotate-180']"
                                alt="arrow">
                        </div>

                    </button>

                </li>
                <hr class="
                mt-[7px]
                mb-[25px]
                border
                border-b-[2px]
            ">

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
                            <input class="
                                peer/inputx 
                                appearance-none
                                " type="checkbox" :name="`${item?.id}`" :id="`${item?.id}`"
                                :checked="item?.isChecked" @change="toggleItemSelection(item)">
                            <div class="
                            w-[33px]
                            h-[33px]
                            bg-center
                            bg-no-repeat
                            rounded-[6px]
                            cursor-pointer
                            bg-[url('./assets/checkbox-unchecked.svg')]
                            peer-checked/inputx:bg-[url('./assets/checkbox-checked.svg')]
                            peer-focus/inputx:outline
                            peer-focus/inputx:outline-[5px]
                            peer-focus/inputx:outline-offset-[-5px]
                            peer-focus/inputx:outline-blue-500
                            peer-disabled/inputx:opacity-30
                        "></div>
                        </label>
                    </div>
                    <div class="fl-col1 fileName">
                        <img :src="getExtensionIcon(item?.name)" />

                        <!-- #task [] refactor - delete placeholder attribute? -->
                        <input type="text" :ref="`fileName${item.id}`"
                            :placeholder="ejectName(item?.name)" :value="ejectName(item?.name)"
                            :style="`width: ${ejectName(item?.name).length * 17.5 + 8}px`" class="
                        text-[30px]
                        font-mono
                        ml-[23px]
                        rounded-md
                        px-[5px]
                        text-ellipsis
                        cursor-text
                    " @input="updateWidth($event, item, this)"
                            @change="handleFileRename($event, item, this, ejectName(item?.name))" />
                        <p class="
                info 
                mt-[5px]
                ">{{ `.${ejectExtension(item?.name).toLowerCase()} ` }}</p>

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
                            rounded-[2px]
                            focus:outline
                            focus:outline-[3px]
                            focus:outline-stone-300
                            focus:outline-offset-[3px]
                            focus:border-none"
                            @click="this.$refs[`fileName${item.id}`][0].focus()"
                        >
                            <!-- #task [] refactor ↑ -->
                            <img src="../assets/edit.svg" alt="edit">
                        </button>
                        <button
                            class="
                            rounded-[2px]
                            focus:outline
                            focus:outline-[3px]
                            focus:outline-stone-300
                            focus:outline-offset-[3px]
                            focus:border-none"
                            @click="fileDownload([item])"
                        >
                            <img src="../assets/download.svg" alt="download">
                        </button>
                        <button
                            class="
                            rounded-[2px]
                            focus:outline
                            focus:outline-[3px]
                            focus:outline-stone-300
                            focus:outline-offset-[3px]
                            focus:border-none"
                            @click="fileDelete([item])"
                        >
                            <img src="../assets/delete.svg" alt="delete">
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        <!-- progress bar -->
        <div v-if="progressEntity.uploading" class="
            sticky
            flex
            flex-col
            justify-between
            items-start
            bg-black
            pt-[10px]
            px-[0px]
            w-[47vw]
            h-[60px]
            ml-[10px]
            rounded-[4px]
            bottom-[10vh]
        ">
            <p class="
                px-[56px]
                text-[25px]
                mb-2
                text-white
            ">{{ progressEntity.message }} {{ progressEntity.fileName }}</p>
            <!-- progress bar container -->
            <div class="
                w-[100%]
                h-[5.5px]
                bg-cyan-300
            ">
                <!-- progress bar value -->
                <div :style="`width: ${progressEntity.uploadProgress}%`" class="
                    h-[5.5px]
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
    @apply
    /* outline */

    flex items-center h-[78px] relative [&>div]:h-[100%] [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div.fileName]:justify-start [&>div.fileName]:pl-[24px] [&>div.controls]:justify-center [&_label]:w-[40px] [&_label]:h-[40px] [&_p.info]:text-[24px] [&_p.info]:font-[600]
}

.checker {
    @apply absolute -left-[50px] -top-[18px] w-[40px] h-[40px]
}

.mainChecker {
    @apply -top-[12px]
}

.fl-col1 {
    @apply w-[500px]
    /* w-[42%] */
    /* bg-yellow-200 */
}

.fl-col2 {
    @apply w-[270px]
    /* w-[23%] */
    /* bg-blue-200 */
}

.fl-col3 {
    @apply w-[180px] mr-[20px]
    /* w-[18%] */
    /* bg-teal-200 */
}

.fl-col4 {
    @apply w-[220px]
    /* w-[17%] */
    /* bg-pink-200 */
}

.selected {
    @apply bg-slate-200 transition duration-300
}
</style>