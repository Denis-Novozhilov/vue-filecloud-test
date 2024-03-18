import { defineStore } from 'pinia';
import { FileEntity } from '../types/fileEntity';

export const useFilesStore = defineStore('useFilesStore', {
	state: () => ({
		filesEntities: [] as FileEntity[],
		selectedFiles: {
			filesMap: new Map<string, string>()
		}
	}),
	getters: {
		getQuantity(): number {
			return this.filesEntities.length;
		},
		getFileFromMap:
			(state) =>
			(key: string): string | undefined => {
				return state.selectedFiles.filesMap.get(key);
			}
	},
	actions: {
		pushFileEntity(value: FileEntity) {
			this.filesEntities.push(value);
		},
		deleteFileEntity(value: FileEntity) {
			this.filesEntities = this.filesEntities.filter((el) => el.id !== value.id);
		},
		clearAllEntities() {
			this.filesEntities = [];
		},
		addFileToMap(key: string, value: string) {
			this.selectedFiles.filesMap.set(key, value);
		},
		removeFileFromMap(key: string) {
			this.selectedFiles.filesMap.delete(key);
		}
	}
});
