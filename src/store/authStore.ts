import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
	state: () => ({
		isLogged: false as boolean,
		token: null as null | string
	}),
	actions: {
		toggleLoggedStatus(value: boolean) {
			this.isLogged = value;
		},
		setToken(value: string) {
			this.token = value;
		},
		clearToken() {
			this.token = null;
		},
		logOut() {
			this.token = null;
			this.isLogged = false;
		}
	}
});
