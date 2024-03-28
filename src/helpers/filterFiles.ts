import {computed, ref} from "vue";
import {filesStore} from "@src/store";

type FiltersVariants = 'name' | 'createdAt' | 'size';
type OrdersVariants = 'Asc' | 'Desc';

// export const filersOrders: { [key: string]: OrdersVariants } = {
const filersOrders: { [key: string]: OrdersVariants } = {
    name: 'Asc',
    createdAt: 'Asc',
    size: 'Asc',
}

let sortKey = ref<FiltersVariants>('name');
let sortOrder = ref<number>(1);

// export const sortedFiles = computed(() => {
const sortedFiles = computed(() => {
    if (filesStore?.filesEntities?.length) {
        return filesStore.filesEntities.slice().sort((a, b) => {
            return a[sortKey.value] > b[sortKey.value] ? sortOrder.value : -sortOrder.value;
        });
    } else {
        return []
    }
});

// export const sortBy = (key: FiltersVariants) => {
const sortBy = (key: FiltersVariants) => {
    // if the same key → inverse current filter ↓
    if (sortKey.value === key) {
        sortOrder.value *= -1;
        if (sortOrder.value < 0) {
            filersOrders[key] = 'Desc'
        } else {
            filersOrders[key] = 'Asc'
        }
        // if another key → apply new filter ↓
    } else {
        sortKey.value = key;
        sortOrder.value = 1;
        filersOrders[key] = 'Asc'
    }
};
