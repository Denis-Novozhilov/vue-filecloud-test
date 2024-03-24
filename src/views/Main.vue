<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { formatTimestamp } from '../helpers/timeFormatter';
import { formatBytes } from '../helpers/sizeFormatter';
import ButtonUI from '../components/ButtonUI.vue';
import { useStore } from '../store';

const { authStore, filesStore } = useStore();

let isAnyFileSelected = ref<boolean>(false);
let isEveryFileSelected = ref<boolean>(false);

const progressEntity = reactive({
    fileName: '',
    message: '',
    uploading: false,
    uploadProgress: 0,
    reset() {
        this.fileName = '';
        this.message = '';
        this.uploading = false;
        this.uploadProgress = 0;
    }
})



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
    if (filesStore && filesStore.filesEntities.length) {
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


onMounted(() => {
    // #task [] add to constants
    // #task [] add header to constants
    axios.get('http://localhost:3000/list', {
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

// [] task remove to helpers and improve with object
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

    console.log(`toggleItemSelection`)
    console.log(`item`)
    console.log(item)

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

const handleMainCheckbox = (event) => {

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


const uploadFile = (fileName, formData) => {
    // #task [] refactor PARENT func and CHILD recursive functions
    // #task [] refactor ↑ ↓ wit parent function
    progressEntity.reset();
    progressEntity.message = 'Загрузка файла';
    progressEntity.fileName = fileName;
    progressEntity.uploading = true;

    // #task [] refactor url to constants
    // #task [] refactor headers to constants
    // #task [] refactor eject onUploadProgress to helpers
    return axios.post(`http://localhost:3000/file?filename=${fileName}`, formData, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
            progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        }
    });
};

const handleFileSend = (event, _this) => {

    let selectedFiles = event.target.files;
    let fileIndex = 0;

    // #task [] refactor PARENT func and CHILD recursive functions
    const recursiveUpload = () => {
        if (fileIndex < selectedFiles.length) {
            const file = selectedFiles[fileIndex];
            let formData = new FormData();
            formData.append('file', file);

            progressEntity.message = 'Загрузка файла';
            progressEntity.uploading = true;

            const fileName = file.name;

            uploadFile(fileName, formData)
                .then(response => {
                    filesStore.pushFileEntity(response.data);
                    fileIndex++;
                    recursiveUpload();
                    // #task [] refactor PARENT func and CHILD recursive functions
                })
                .catch(error => {
                    console.error('Error uploading files:', error);
                })
        } else {
            progressEntity.reset();
            _this.$refs.fileInput.value = null;
        }
    };

    recursiveUpload();
};

const fileDelete = (file) => {

    // #task [] refactor ↑ ↓ wit parent function
    progressEntity.reset();
    progressEntity.message = 'Удаление файла';
    progressEntity.fileName = file.name;
    progressEntity.uploading = true;

    // #task [] refactor url to constants
    // #task [] refactor headers to constants
    // #task [] refactor eject onUploadProgress to helpers
    return axios.delete(`http://localhost:3000/file?id=${file.id}`, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`,
        },
        // onDownloadProgress: progressEvent => {
        //     progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        // },
        onUploadProgress: progressEvent => {
            progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        }
    });
};
const handleButchDelete = (event) => {

    // #task [] refactor PARENT func and CHILD recursive functions

    let selectedFiles = Array.from(filesStore.getSelectedFiles);
    let fileIndex = 0;


    const recursiveDelete = () => {
        if (fileIndex < selectedFiles.length) {
            const file = selectedFiles[fileIndex];

            // progressEntity.message = 'Удаление файла';
            // progressEntity.uploading = true;

            const fileName = file.name;

            fileDelete(file)
                .then(response => {
                    // filesStore.pushFileEntity(response.data);
                    filesStore.setFileEntities(response.data)
                    filesStore.removeSelected(file)
                    // #task [] ↑↑↑ refactor to deleteElement - filter FileEntity
                    // #task [] filter FileEntity
                    // #task [] filter SelectedFiles
                    fileIndex++;
                    recursiveDelete();
                    // #task [] refactor PARENT func and CHILD recursive functions
                })
                .catch(error => {
                    console.error('Error uploading files:', error);
                })
        } else {
            progressEntity.reset();
            isEveryFileSelected.value = false;
            isAnyFileSelected.value = false;
        }
    };

    recursiveDelete();
};



const handleFileDelete = (item) => {

    progressEntity.message = 'Удаление файла';
    progressEntity.fileName = item.name;
    progressEntity.uploading = true;

    // #task [] refactor url to constants
    // #task [] refactor headers to constants
    // #task [] refactor eject onUploadProgress to helpers
    axios.delete(`http://localhost:3000/file?id=${item.id}`, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`,
        },
        onDownloadProgress: progressEvent => {
            progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        }
    })
        .then(response => {
            filesStore.setFileEntities(response.data)
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            // [] #task Обработка ошибки
        })
        .finally(() => {
            progressEntity.reset();
        })
}

const updateWidth = (event, { id }, _this) => {

    const value = event.target.value;
    const inputRef = _this.$refs[`fileName${id}`];

    // #task [] eject 17.5 and 8 to constants
    inputRef[0].style.width = `${value.length * 17.5 + 8}px`;
}

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
    axios.put(`http://localhost:3000/file?filename=${item.name}`, {
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


const handleFileDownload = (item) => {

    progressEntity.message = 'Скачивание файла';
    progressEntity.fileName = item.name;
    progressEntity.uploading = true;

    // #task [] refactor url to constants
    // #task [] refactor headers to constants
    // #task [] refactor eject onUploadProgress to helpers
    // axios.get(`http://localhost:3000/file?filename=${encodeURIComponent(item.name)}`, {
    axios.get(`http://localhost:3000/file?filename=${item.name}`, {
        responseType: 'blob',
        headers: {
            'auth-token': `Bearer ${authStore.token}`,
        },
        onDownloadProgress: progressEvent => {
            progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        },
        // #task [] ↑↓ on this example work out how to cancel axios responce by user disturbing
    })
        .then(response => {

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = URL.createObjectURL(blob);


            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.download = item.name;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            progressEntity.reset();

            // window.open(url);
        })
        .catch(error => {
            // Обработка ошибки
            console.error('Error downloading file:', error);
            // #task [] handle errors and clear error html element
        })
        .finally(() => {
            URL.revokeObjectURL(url);
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
                <input class="hidden" type="file" ref="fileInput"
                    @change="handleFileSend($event, this)" multiple>
                <ButtonUI bgType="common" textType="normal" msg="Добавить"
                    @click="this.$refs.fileInput.click()" />
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
                                @change="handleMainCheckbox($event)">
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


                    <button class="
                fl-col1 
                text-left
                filterBtn cursor-pointer" @click="sortBy('name')">
                        <div class="flex">
                            <p>Название</p>
                            <img :class="['block', 'mx-5', (filersOrders['name'] === 'Desc') && 'rotate-180']"
                                src="../assets/arrow.svg" alt="arrow">
                        </div>
                    </button>

                    <button class="
                fl-col2 
                filterBtn cursor-pointer" @click="sortBy('createdAt')">
                        <div class="flex justify-center">
                            <p>Дата изменения</p>
                            <img src="../assets/arrow.svg"
                                :class="['block', 'mx-5', (filersOrders['createdAt'] === 'Desc') && 'rotate-180']"
                                alt="arrow">
                        </div>
                    </button>

                    <button class="
                fl-col3 
                filterBtn cursor-pointer" @click="sortBy('size')">
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

                <!-- main controlls ↓ -->
                <!-- #task [] Refactor ↓ Оставить только 2 кнопки со сменой контента msg -->
                <div class="mb-[42px]" v-if="!isEveryFileSelected && isAnyFileSelected">
                    <ButtonUI class="h-[45px]" bgType="inverted" textType="bold"
                        msg="Скачать выбранные" />
                    <ButtonUI class="h-[45px]" bgType="inverted" textType="bold"
                        @click="handleButchDelete($event)" msg="Удалить выбранные" />
                </div>
                <div class="mb-[42px]" v-if="isEveryFileSelected">
                    <ButtonUI class="h-[45px]" bgType="inverted" textType="bold"
                        msg="Скачать все" />
                    <ButtonUI class="h-[45px]" bgType="inverted" textType="bold"
                        @click="handleButchDelete($event)" msg="Удалить все" />
                </div>
                <!-- main controlls ↑ -->

                <!-- files list row ↓ -->
                <!-- <li :class="['filesListRow', 'hover:bg-slate-100', item?.isChecked && 'selected']"
                    v-for="item in filesStore.filesEntities" :key="item?.id"> -->
                <li :class="['filesListRow', 'hover:bg-slate-100', item?.isChecked && 'selected']"
                    v-for="item in sortedFiles" :key="item?.id">
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
                ">{{ `.${ejectExtension(item?.name).toLowerCase()}` }}</p>

                    </div>
                    <div class="fl-col2">
                        <p class="info">{{ formatTimestamp(item?.createdAt) }}</p>
                    </div>
                    <div class="fl-col3">
                        <p class="info">{{ formatBytes(item?.size) }}</p>
                    </div>
                    <div class="
                fl-col4
                flex
    
                gap-[30px]
            ">
                        <button class="
                    rounded-[2px]    
                    focus:outline
                    focus:outline-[3px]
                    focus:outline-stone-300
                    focus:outline-offset-[3px]
                    focus:border-none
                    " @click="this.$refs[`fileName${item.id}`][0].focus()">
                            <!-- #task [] refactor ↑ -->
                            <img src="../assets/edit.svg" alt="edit">
                        </button>
                        <button class="
                    rounded-[2px]    
                    focus:outline
                    focus:outline-[3px]
                    focus:outline-stone-300
                    focus:outline-offset-[3px]
                    focus:border-none
                    " @click="handleFileDownload(item)">
                            <img src="../assets/download.svg" alt="download">
                        </button>
                        <button class="
                    rounded-[2px]    
                    focus:outline
                    focus:outline-[3px]
                    focus:outline-stone-300
                    focus:outline-offset-[3px]
                    focus:border-none" @click="handleFileDelete(item)">
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