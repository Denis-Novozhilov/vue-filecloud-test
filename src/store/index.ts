import { defineStore } from 'pinia';

export const useStore = defineStore('mainStore', {
	state: () => ({
		number: 1,
		name: 'Pinia'
	}),
	actions: {
		changeName(value: string) {
			this.name = value;
		},
		increaseNumber() {
			this.number += 1;
		}
	}
});
