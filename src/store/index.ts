import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { useFilesStore } from './fileStore';

export const useStore = defineStore('store', () => {
	const authStore = useAuthStore();
	const filesStore = useFilesStore();
	return { authStore, filesStore };
});

/***RECURSIVE STORE ↓



    import { defineStore } from 'pinia';
    import { createPinia, defineStore } from 'pinia';
    import { useAuthStore } from './authStore';
    import { useFilesStore } from './fileStore';

    export const useStore = defineStore('mainStore', () => {});

    const indexStorePlugin = () => ({
        authStore: useAuthStore(),
        filesStore: useFilesStore()
    });

    const pinia = createPinia();
    pinia.use(indexStorePlugin);

    export { pinia };


 
***RECURSIVE STORE ↑ */
