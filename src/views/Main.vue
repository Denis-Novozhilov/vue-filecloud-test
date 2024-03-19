<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';

import { useAuthStore } from '../store/authStore';
import { useFilesStore } from '../store/fileStore';

import { formatTimestamp } from '../helpers/timeFormatter';
import { formatBytes } from '../helpers/sizeFormatter';
import ButtonUI from '../components/ButtonUI.vue';
// import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const filesStore = useFilesStore();

let isAnyFileSelected = ref<boolean>(false);
let isEveryFileSelected = ref<boolean>(false);
// const filesEntityes = ref([]);

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


/*
const selectedFiles = reactive({
  filesMap: new Map(),
});

    // Добавляем элементы в Map
    selectedFiles.filesMap.set('key1', 'value1');
    selectedFiles.filesMap.set('key2', 'value2');

    // Получаем доступ к элементам Map
    console.log(selectedFiles.filesMap.get('key1')); // Вывод: value1

    // Обновляем значение
    selectedFiles.filesMap.set('key1', 'newValue1');
    console.log(selectedFiles.filesMap.get('key1')); // Вывод: newValue1

    // Удаление элемента
    selectedFiles.filesMap.delete('key1');
    console.log(selectedFiles.filesMap.get('key1')); // Вывод: undefined

*/

// selectedFiles.filesMap.set('key1', 'value1');
// selectedFiles.filesMap.set('key2', 'value2');

    onMounted(()=>{
        axios.get('http://localhost:3000/list',{
            headers: {
                'auth-token': `Bearer ${authStore.token}`
            }
        })
        .then(response => {

// {
//     "data": [
//         {
//             "id": 999,
//             "name": "file-for-test.xls",
//             "createdAt": 1615231817551,
//             "editedAt": 1615231817551,
//             "size": 1258291
//         },
//         {
//             "id": 1000000000000000,
//             "name": "very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-name.object",
//             "createdAt": 1615231817551,
//             "editedAt": 1615231817551,
//             "size": 123123123123123123123123
//         },
//         {
//             "id": 0,
//             "name": "Название табличного файла.xls",
//             "createdAt": 1615231817551,
//             "editedAt": 1615231817551,
//             "size": 1258291
//         },
//         {
//             "id": 1,
//             "name": "Название тестового файла с длинным названием.docx",
//             "createdAt": 1615231917551,
//             "editedAt": 1615231917551,
//             "size": 2216582
//         },
//         {
//             "id": 2,
//             "name": "Название файла с изображением.png",
//             "createdAt": 1615232017551,
//             "editedAt": 1615232017551,
//             "size": 2516582
//         },
//         {
//             "id": 3,
//             "name": "Название видео файла.mp4",
//             "createdAt": 1615232117551,
//             "editedAt": 1615232117551,
//             "size": 3216582
//         }
//     ],
//     "status": 200,
//     "statusText": "OK",
//     "headers": {
//         "content-length": "686",
//         "content-type": "application/json; charset=utf-8"
//     },
//     "config": {
//         "transitional": {
//             "silentJSONParsing": true,
//             "forcedJSONParsing": true,
//             "clarifyTimeoutError": false
//         },
//         "adapter": [
//             "xhr",
//             "http"
//         ],
//         "transformRequest": [
//             null
//         ],
//         "transformResponse": [
//             null
//         ],
//         "timeout": 0,
//         "xsrfCookieName": "XSRF-TOKEN",
//         "xsrfHeaderName": "X-XSRF-TOKEN",
//         "maxContentLength": -1,
//         "maxBodyLength": -1,
//         "env": {},
//         "headers": {
//             "Accept": "application/json, text/plain, */*",
//             "auth-token": "Bearer n67btof3q725tr"
//         },
//         "method": "get",
//         "url": "http://localhost:3000/list"
//     },
//     "request": {}
// }
            console.log(`response`)
            console.log(response)
            // authStore.logOut()
            // router.push('/login');

            // filesEntityes.value = response.data;
            filesStore.setFileEntities(response.data);
        })
        .catch(error => {
            console.log(JSON.stringify(error))
            console.log(JSON.stringify(error.response.data))
        });
    })

    // const store = useStore();

    // [] task remove to helpers and improve with object
    const getExtensionIcon = (fileName = 'default.file') => {

        const extension = fileName?.split(".").at(-1).toUpperCase();

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

        // ваша логика здесь
        // например, если нужно добавить класс при выборе, то можно сделать так:
        if (item.isChecked) {
            
            // !!! REMOVE FROM filesStore.selectedFiles
            filesStore.removeSelected(`${item.id}`)

            item.isChecked = false; // или в зависимости от логики
            // убираем стиль или класс, который применяется при выборе

        } else {
            
            item.isChecked = true; // или в зависимости от логики
            // добавляем стиль или класс, который применяется при выборе

            // !!! ADD TO filesStore.selectedFiles
            filesStore.addSelected(item.id, item)

        }

        // IN THE END CHECK selectedFiles.size
        // AND CHANGE isAnyFileSelected if necessary
        // AND CHANGE isEveryFileSelected if necessary
        if (!Boolean(filesStore.getQuantitySelected)) {
            isAnyFileSelected.value = false;
        } else {
            isAnyFileSelected.value = true;
        }

        if (Boolean(filesStore.getQuantitySelected) && filesStore.getQuantitySelected === filesStore.getQuantityEntities) {
            isEveryFileSelected.value = true;
        } else {
            isEveryFileSelected.value = false;
        }
    }

    const handleMainCheckbox = (event) => {
        // filesEntityes.value.forEach(item => {
        //     item.isChecked = event.target.checked ? true : false
        // })
        const condition = event.target.checked 

        if (condition) {

            filesStore.filesEntities.forEach(item => {
                item.isChecked = true;
                filesStore.addSelected(`${item.id}`, item);
            })

            isEveryFileSelected.value = true;
            
            
        // SET All TO SELECTED
        } else {
            filesStore.filesEntities.forEach(item => {
                item.isChecked = false
            })

            filesStore.clearAllSelected();

            isEveryFileSelected.value = false;
            isAnyFileSelected.value = false;
        }
    }

    // const { name, number } = storeToRefs(store);

    const handleFileChange = (event) => {

    /*
    
        http://localhost:3000/file?filename=new file name with spaces.png

        lastModified: 1710570305205
        lastModifiedDate: Sat Mar 16 2024 08:25:05 GMT+0200 (Восточная Европа, стандартное время) {}
        name: "frame-1-0.png"
        size: 70239
        type: "image/png"
        webkitRelativePath: ""

    */

        const selectedFile = event.target.files[0];


        const formData = new FormData();
        formData.append('file', selectedFile);

        progressEntity.message = 'Загрузка файла';
        progressEntity.fileName = selectedFile.name;
        progressEntity.uploading = true;

        axios.post(`http://localhost:3000/file?filename=${selectedFile.name}`, formData, {
        headers: {
            'auth-token': `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
            progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
        }
        })
        .then(response => {
            console.log(`response`)
            console.log(response)
            console.log('File uploaded successfully:', response.data);
            // Обработка успешного ответа
            filesStore.setFileEntities(response.data)
            // [] #task find out how to add multiple files
            // [] #task add different color scheme 3-5 and toggle controls svg colors
        })
        .catch(error => {
            console.log(`error`)
            console.log(error)
            console.error('Error uploading file:', error);
            // Обработка ошибки
        })
        .finally(()=>{
            progressEntity.reset();
        }) 
    }

    const handleFileDelete = (item) => {
    /*

        http://localhost:3000/file?filename=Название файла с изображением.png
        
        item = 
        {
            "id": 999,
            "name": "file-for-test.xls",
            "createdAt": 1615231817551,
            "editedAt": 1615231817551,
            "size": 1258291
        }
    */

        progressEntity.message = 'Удаление файла';
        progressEntity.fileName = item.name;
        progressEntity.uploading = true;

        axios.delete(`http://localhost:3000/file?filename=${item.name}`, {
            headers: {
                'auth-token': `Bearer ${authStore.token}`,
            },
            onDownloadProgress: progressEvent => {
                console.log(`progressEvent`)
                console.log(progressEvent)
                progressEntity.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
            }
        })
        .then(response => {
            filesStore.setFileEntities(response.data)
            // [] #task find out how to add multiple files
            // [] #task add different color scheme 3-5 and toggle controls svg colors
        })
        .catch(error => {
            console.log(`error`)
            console.log(error)
            console.error('Error uploading file:', error);
            // [] #task Обработка ошибки
        })
        .finally(()=>{
            progressEntity.reset();
        }) 

/**
    Код, который вы предоставили, кажется правильным с точки зрения обработки прогресса. Проблема, скорее всего, в том, что метод axios.delete не возвращает информацию о прогрессе удаления файла. Поскольку удаление файла - операция, которая происходит на сервере, нет способа получить прогресс удаления через HTTP-запрос в обычном режиме.

    Как решение, вы можете показывать пользователю индикатор загрузки на время выполнения запроса и затем скрывать его при завершении запроса. Однако для отслеживания реального прогресса удаления файла на сервере вам может потребоваться использовать другие методы, например, уведомления от сервера о прогрессе выполнения операции удаления или отслеживание прогресса удаления на клиенте через другие механизмы, предоставляемые сервером или API.

    Таким образом, проблема не в вашем коде, а в том, что HTTP DELETE запросы обычно не предоставляют информацию о прогрессе удаления файла.
 */


    }


</script>

<template>
    <div class="relative">
        <div>
        <h1
            class="
                text-[34.5px]
                font-bold
                mt-[56px]
            "
        >Ваши файлы</h1>
        <div
            class="
                h-[42px] 
                mt-[24px]
            ">
            <input class="hidden" type="file" ref="fileInput" @change="handleFileChange($event)">
            <ButtonUI bgType="common" textType="normal" msg="Добавить" @click="this.$refs.fileInput.click()"/>
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
                    <input 
                    class="
                    peer/inputx 
                    appearance-none
                    " 
                    type="checkbox" 
                    :name="'all'" 
                    :id="'all'"
                    :checked="isEveryFileSelected"
                    @change="handleMainCheckbox($event)"
                    >
                    <div 
                        class="
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
                filterBtn
            ">
                <div class="flex">
                    <p>Название</p>
                    <!-- [] #task fix arrow rotation direction up/down -->
                    <img class="block mx-5" src="../assets/arrow.svg" alt="arrow">
                </div>
            </button>
    
            <button class="
                fl-col2 
                filterBtn
            ">
            <div class="flex justify-center">
                <p>Дата изменения</p>
                <!-- [] #task fix arrow rotation direction up/down -->
                <img class="block mx-5" src="../assets/arrow.svg" alt="arrow">
            </div>
            </button>
    
            <button class="
                fl-col3 
                filterBtn
            ">
            <div class="flex justify-center">
                <p>Размер</p>
                <!-- [] #task fix arrow rotation direction up/down -->
                <img class="block mx-5" src="../assets/arrow.svg" alt="arrow">
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
          <div class="mb-[42px]" v-if="!isEveryFileSelected && isAnyFileSelected">
            <ButtonUI class="h-[45px]" bgType="inverted" textType="bold" msg="Скачать выбранные"/>
            <ButtonUI class="h-[45px]" bgType="inverted" textType="bold" msg="Удалить выбранные"/>
          </div>
          <div class="mb-[42px]" v-if="isEveryFileSelected">
            <ButtonUI class="h-[45px]" bgType="inverted" textType="bold" msg="Скачать все"/>
            <ButtonUI class="h-[45px]" bgType="inverted" textType="bold" msg="Удалить все"/>
          </div>
          <!-- main controlls ↑ -->
    
          <!-- files list row ↓ -->
          <li 
            :class="['filesListRow','hover:bg-slate-100', item?.isChecked && 'selected']"
            v-for="item in filesStore.filesEntities" 
            :key="item?.id"
          >
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
                    <div 
                        class="
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
                <img :src="getExtensionIcon(item?.name)"/>
                <p 
                class="
                info 
                ml-[30px]
                pb-[5px]
                pr-[30px]
                overflow-x-auto
                whitespace-nowrap
                ">{{item?.name}}</p>
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
                ">
                    <img src="../assets/edit.svg" alt="edit">
                </button>
                <button class="
                    rounded-[2px]    
                    focus:outline
                    focus:outline-[3px]
                    focus:outline-stone-300
                    focus:outline-offset-[3px]
                    focus:border-none
                ">
                    <img src="../assets/download.svg" alt="download">
                </button>
                <button class="
                    rounded-[2px]    
                    focus:outline
                    focus:outline-[3px]
                    focus:outline-stone-300
                    focus:outline-offset-[3px]
                    focus:border-none"
                    @click="handleFileDelete(item)"
                >
                    <img src="../assets/delete.svg" alt="delete">
                </button>
            </div>
        </li>
        </ul>
        </div>
    
      <!-- progress bar -->
      <div 
        v-if="progressEntity.uploading"
        class="
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
            ">{{progressEntity.message}} {{ progressEntity.fileName }}</p>
            <!-- progress bar container -->
            <div class="
                w-[100%]
                h-[5.5px]
                bg-cyan-300
            ">
                <!-- progress bar value -->
                <div 
                :style="`width: ${progressEntity.uploadProgress}%`"
                class="
                    h-[5.5px]
                    bg-blue-600
                ">
                </div>

            </div>
        </div>
    </div>
</template>

<style scope>
    .filesList { @apply
        min-w-[1240px]
        mb-[100px]
    }
    .filterBtn { @apply 

        w-[220px]
        h-[56px]

        text-[18px]
        font-bold

        px-5

        rounded-md

        cursor-pointer 
        hover:bg-gray-200 
        transition duration-300
    }
    
    .filesListRow { @apply

        /* outline */
        
        flex
        items-center

        h-[78px]
        relative
        
        [&>div]:h-[100%]
        [&>div]:flex
        [&>div]:justify-center
        [&>div]:items-center

        [&>div.fileName]:justify-start
        [&>div.fileName]:pl-[24px]

        [&>div.controls]:justify-center

        /* [&>div.checker]:absolute
        [&>div.checker]:-left-[50px]
        [&>div.checker]:top-[0px]
        [&>div.checker]:w-[40px]
        [&>div.checker]:h-[40px] */

        /* .parent-block > input[type="checkbox"]:checked { */
        /* [&_label]:scale-125 */
        /* [&>peer/inputx]:hidden */



        /* [&_input.hidden]:hidden */
        [&_label]:w-[40px]
        [&_label]:h-[40px]
        
        [&_p.info]:text-[24px]
        [&_p.info]:font-[600]
        
        /* [&>div]:justify-center */
    }

    .checker {@apply 
        absolute
        -left-[50px]
        -top-[18px]
        w-[40px]
        h-[40px]
    }

    .mainChecker {@apply
        -top-[12px]
    }

    .fl-col1 {@apply 
        w-[500px]
        /* w-[42%] */
        /* bg-yellow-200 */
    }
    .fl-col2 {@apply 
        w-[270px]
        /* w-[23%] */
        /* bg-blue-200 */
    }
    .fl-col3 {@apply 
        w-[180px]
        mr-[20px]
        /* w-[18%] */
        /* bg-teal-200 */
    }
    .fl-col4 {@apply 
        w-[220px]
        /* w-[17%] */
        /* bg-pink-200 */
    }

    .selected { @apply
        bg-slate-200
        transition duration-300
    }   

</style>../store/fileStore