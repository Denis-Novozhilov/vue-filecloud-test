import {createPinia} from 'pinia';
import {useAuthStore} from './authStore';
import {useFilesStore} from './fileStore';
import {useNotificationStore} from "./notificationStore.ts";

export const pinia = createPinia();

export const authStore = useAuthStore(pinia);
export const filesStore = useFilesStore(pinia);
export const notificationStore = useNotificationStore(pinia);
