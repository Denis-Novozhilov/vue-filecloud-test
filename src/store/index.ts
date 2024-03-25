import { createPinia } from 'pinia';
import { useAuthStore } from './authStore';
import { useFilesStore } from './fileStore';

export const pinia = createPinia();

export const authStore = useAuthStore(pinia);
export const filesStore = useFilesStore(pinia);
