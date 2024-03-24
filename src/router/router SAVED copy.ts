import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore.ts';

// import { authStore } from '../store';

import { setup } from '../store/index.ts';

const routes = [
	{
		name: 'Main',
		path: '/',
		component: () => import('../views/Main.vue')
	},
	{
		name: 'Login',
		path: '/login',
		component: () => import('../views/Login.vue')
	},
	{
		name: 'About',
		path: '/about',
		component: () => import('../views/About.vue')
	},
	{
		name: 'Settings',
		path: '/settings',
		component: () => import('../views/Settings.vue')
	}
];

const history = createWebHistory();

const router = createRouter({
	history,
	routes
});

// #task все [] сторы в инндексный файлик - см скрины new Vue etc...
// const authStore = useAuthStore();

router.beforeEach((to, from, next) => {
	// #task [] refactor - EJECT store initialization from here
	// const authStore = useAuthStore();
	// authStore;
	// #task [] watch later
	// console.log(`to`)
	// console.log(to)
	if (!authStore.isLogged && to.name !== 'Login') {
		next({ name: 'Login' });
	} else if (authStore.isLogged && to.name === 'Login') {
		next({ name: 'Main' });
	} else {
		next();
	}
});

export default router;