import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { storeToRefs } from 'pinia';
// console.log(`ROUTES`);
// console.log(`useAuthStore`);
// console.log(useAuthStore);

// const isAuthenticated = false;
// const isAuthenticated = true;

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

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();
	if (!authStore.isLogged && to.name !== 'Login') {
		next({ name: 'Login' });
	} else if (authStore.isLogged && to.name === 'Login') {
		next({ name: 'Main' });
	} else {
		next();
	}
});

export default router;