import { defineStore } from 'pinia';

export const useStore = defineStore('mainTestStore', {
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
