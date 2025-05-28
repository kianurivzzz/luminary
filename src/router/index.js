import store from '@/store';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		redirect: '/login',
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/Login.vue'),
		meta: { requiresGuest: true },
	},
	{
		path: '/signup',
		name: 'SignUp',
		component: () => import('@/views/SignUp.vue'),
		meta: { requiresGuest: true },
	},
	{
		path: '/user',
		name: 'User',
		component: () => import('@/views/User.vue'),
		meta: { requiresAuth: true },
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

// защита маршрутов
router.beforeEach((to, from, next) => {
	const isAuthenticated = store.getters['auth/isLoggedIn'];

	if (to.meta.requiresAuth && !isAuthenticated) {
		// пользователь не авторизован
		next('/login');
	} else if (to.meta.requiresGuest && isAuthenticated) {
		// страница для авторизованных пользователей
		next('/user');
	} else {
		next();
	}
});

export default router;
