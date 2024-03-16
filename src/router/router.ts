import { createRouter, createWebHistory } from 'vue-router';

// const isAuthenticated = false;
const isAuthenticated = true;

const routes = [
	{
		name: 'Main',
		path: '/',
		component: () => import('../pages/Main.vue')
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

router.beforeEach((to, from) => {
	if (
		// make sure the user is authenticated
		!isAuthenticated &&
		// ❗️ Avoid an infinite redirect
		to.name !== 'Login'
	) {
		// redirect the user to the login page
		return { name: 'Login' };
	}
	if (
		// make sure the user is authenticated
		isAuthenticated &&
		// ❗️ Avoid an infinite redirect
		to.name === 'Login'
	) {
		// redirect the user to the login page
		return { name: 'Main' };
	}
});

export default router;
