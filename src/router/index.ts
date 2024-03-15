import About from '../views/About.vue';
import Settings from '../views/Settings.vue';
import Main from '../pages/Main.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		component: Main
	},
	{
		path: '/about',
		component: About
	},
	{
		path: '/settings',
		component: Settings
	}
];

const history = createWebHistory();

export const router = createRouter({
	history,
	routes
});
