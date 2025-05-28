import axios from 'axios';

const API_BASE_URL = 'https://luminary-test-assignment.onrender.com';

// базовая конфигурация axios
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// interceptor для добавления токена авторизации
apiClient.interceptors.request.use(
	config => {
		const token = localStorage.getItem('authToken');
		if (token) {
			config.headers.Authorization = token;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// interceptor для обработки ответов и ошибок
apiClient.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response?.status === 401) {
			// если токен истёк или недействителен
			localStorage.removeItem('authToken');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

// api методы
export const authAPI = {
	// вход в систему
	login: async credentials => {
		const response = await apiClient.post('/auth/token', credentials);
		// api возвращает токен напрямую как строку
		return { token: response.data };
	},

	// регистрация пользователя
	signUp: async userData => {
		const response = await apiClient.post('/users', userData);
		return response.data;
	},
};

export const userAPI = {
	// получение данных пользователя
	getUser: async () => {
		const response = await apiClient.get('/users');
		return response.data;
	},

	// обновление данных пользователя
	updateUser: async userData => {
		const response = await apiClient.put('/users', userData);
		return response.data;
	},
};

export default apiClient;
