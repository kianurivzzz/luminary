import { userAPI } from '@/services/api';

const state = {
	userData: null,
	loading: false,
	error: null,
};

const mutations = {
	SET_USER(state, userData) {
		state.userData = userData;
	},

	SET_LOADING(state, loading) {
		state.loading = loading;
	},

	SET_ERROR(state, error) {
		state.error = error;
	},

	CLEAR_USER(state) {
		state.userData = null;
		state.error = null;
	},
};

const actions = {
	async fetchUser({ commit }) {
		try {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			const userData = await userAPI.getUser();
			commit('SET_USER', userData);
			return { success: true, data: userData };
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Ошибка загрузки данных пользователя';
			commit('SET_ERROR', errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			commit('SET_LOADING', false);
		}
	},

	async updateUser({ commit }, userData) {
		try {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			const updatedUser = await userAPI.updateUser(userData);
			commit('SET_USER', updatedUser);
			return { success: true, data: updatedUser };
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Ошибка обновления данных пользователя';
			commit('SET_ERROR', errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			commit('SET_LOADING', false);
		}
	},

	clearUser({ commit }) {
		commit('CLEAR_USER');
	},
};

const getters = {
	fullName: state => {
		if (!state.userData) return '';
		return `${state.userData.firstName || ''} ${
			state.userData.lastName || ''
		}`.trim();
	},

	formattedBirthday: state => {
		if (!state.userData?.birthday) return '';
		const date = new Date(state.userData.birthday);
		return date.toLocaleDateString('ru-RU');
	},

	userLoading: state => state.loading,
	userError: state => state.error,
	user: state => state.userData,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
