import {defineStore} from 'pinia';

export const useAuthStore = defineStore('authStore', {
	// [] !!! return when dev will be stopped
	state: () => ({
		isLogged: false as boolean,
		token: null as null | string
	}),
	// state: () => ({
	// 	isLogged: true as boolean,
	// 	token: 'n67btof3q725tr' as null | string
	// }),
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
