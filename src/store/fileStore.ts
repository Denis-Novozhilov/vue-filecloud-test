import { defineStore } from 'pinia';
import { FileEntity } from '../types/fileEntity';

export const useFilesStore = defineStore('useFilesStore', {
	state: () => ({
		filesEntities: [] as FileEntity[],
		selectedFiles: new Map<string, FileEntity>()
	}),
	getters: {
		getQuantityEntities(): number {
			return this.filesEntities.length;
		},
		getQuantitySelected(): number {
			return this.selectedFiles.size;
		},
		getFileFromMap:
			(state) =>
			(key: string | number): FileEntity | undefined => {
				if (typeof key === 'number') {
					key = String(key);
				}
				return state.selectedFiles.get(key);
			}
	},
	actions: {
		// actions for files entities
		setFileEntities(value: FileEntity[]) {
			this.filesEntities = value;
		},
		pushFileEntity(value: FileEntity) {
			this.filesEntities.push(value);
		},
		updateEntity(value: FileEntity) {
			// // delete
			// this.filesEntities = this.filesEntities.filter((el) => el.id !== value.id);
			// // add new
			// this.filesEntities.push(value);
			// this.filesEntities = this.filesEntities.map((el) => {
			// 	if (el.id === value.id) {
			// 		el = value;
			// 	}
			// });
			this.filesEntities = this.filesEntities.map((el) => (el.id === value.id ? value : el));
			// const etityToUpdate = this.filesEntities.find((el) => el.id === value.id);
		},
		deleteFileEntity(value: FileEntity) {
			this.filesEntities = this.filesEntities.filter((el) => el.id !== value.id);
		},
		clearAllEntities() {
			this.filesEntities = [];
		},

		// actions for selected
		addSelected(key: string | number, value: FileEntity) {
			if (typeof key === 'number') {
				key = String(key);
			}
			this.selectedFiles.set(key, value);
		},
		removeSelected(key: string | number) {
			if (typeof key === 'number') {
				key = String(key);
			}
			this.selectedFiles.delete(key);
		},
		clearAllSelected() {
			this.selectedFiles = new Map<string, FileEntity>();
		}
	}
});
