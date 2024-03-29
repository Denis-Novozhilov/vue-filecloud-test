import {createRouter, createWebHistory} from 'vue-router';
import {authStore} from '../store/index';

const routes = [
	{
		name: 'Main',
		path: '/',
		component: () => import('../resources/fileList/pages/FileList.vue')
	},
	{
		name: 'Login',
		path: '/login',
		component: () => import('../resources/auth/pages/Login.vue')
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
	if (!authStore.isLogged && to.name !== 'Login') {
		next({ name: 'Login' });
	} else if (authStore.isLogged && to.name === 'Login') {
		next({ name: 'Main' });
	} else {
		next();
	}
});

export default router;
