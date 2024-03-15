import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Settings from '../views/Settings.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		component: Home
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
