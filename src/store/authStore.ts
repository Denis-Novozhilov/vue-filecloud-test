import {defineStore} from 'pinia';

export const useAuthStore = defineStore('authStore', {
	// [] !!! return when dev will be stopped
	// [] refactor add token to local storage
	// state: () => ({
	// 	isLogged: false as boolean,
	// 	token: null as null | string
	// }),
	state: () => ({
		isLogged: true as boolean,
		token: 'n67btof3q725tr' as null | string
	}),
	actions: {
		toggleLoggedStatus(value: boolean) {
			this.isLogged = value;
		},
		setToken(value: string) {
			localStorage.setItem('token', value);
			this.token = value;
		},
		clearToken() {
			this.token = null;
		},
		logOut() {

			localStorage.removeItem('token');
			this.token = null;
			this.isLogged = false;
		}
	}
});
