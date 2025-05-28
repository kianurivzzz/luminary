import { authAPI } from '@/services/api';

const state = {
	token: localStorage.getItem('authToken') || null,
	isAuthenticated: !!localStorage.getItem('authToken'),
	loading: false,
	error: null,
};

const mutations = {
	SET_TOKEN(state, token) {
		state.token = token;
		state.isAuthenticated = !!token;
		if (token) {
			localStorage.setItem('authToken', token);
		} else {
			localStorage.removeItem('authToken');
		}
	},

	SET_LOADING(state, loading) {
		state.loading = loading;
	},

	SET_ERROR(state, error) {
		state.error = error;
	},

	CLEAR_AUTH(state) {
		state.token = null;
		state.isAuthenticated = false;
		state.error = null;
		localStorage.removeItem('authToken');
	},
};

const actions = {
	async login({ commit, dispatch }, credentials) {
		try {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			const response = await authAPI.login(credentials);
			const token =
				response.token || response.access_token || response.accessToken;

			if (token) {
				commit('SET_TOKEN', token);
				// после успешного входа загружает данные пользователя
				await dispatch('user/fetchUser', null, { root: true });
				return { success: true };
			} else {
				throw new Error('Токен не получен от сервера');
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Ошибка входа в систему';
			commit('SET_ERROR', errorMessage);
			commit('CLEAR_AUTH');
			return { success: false, error: errorMessage };
		} finally {
			commit('SET_LOADING', false);
		}
	},

	async signUp({ commit }, userData) {
		try {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			await authAPI.signUp(userData);
			return { success: true };
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Ошибка регистрации';
			commit('SET_ERROR', errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			commit('SET_LOADING', false);
		}
	},

	logout({ commit, dispatch }) {
		commit('CLEAR_AUTH');
		// очищает данные пользователя
		dispatch('user/clearUser', null, { root: true });
	},

	checkAuth({ commit, dispatch }) {
		const token = localStorage.getItem('authToken');
		if (token) {
			commit('SET_TOKEN', token);
			// пытается загрузить данные пользователя для проверки валидности токена
			dispatch('user/fetchUser', null, { root: true }).catch(() => {
				// если токен недействителен, очищает авторизацию
				commit('CLEAR_AUTH');
			});
		}
	},
};

const getters = {
	isLoggedIn: state => state.isAuthenticated,
	authToken: state => state.token,
	authLoading: state => state.loading,
	authError: state => state.error,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
