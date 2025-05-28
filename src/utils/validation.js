// регулярные выражения для валидации
export const VALIDATION_PATTERNS = {
	// email – только латинские символы, цифры и стандартные символы
	EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

	// пароль – минимум 8 символов, хотя бы 1 буква, 1 цифра, 1 спецсимвол
	PASSWORD:
		/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,

	// имя и фамилия – только буквы, латинские и кириллические
	NAME: /^[a-zA-Zа-яА-ЯёЁ\s-']+$/,

	// проверка на пробелы в начале и конце
	NO_LEADING_TRAILING_SPACES: /^\S.*\S$|^\S$/,
};

// функции валидации
export const validators = {
	email: value => {
		if (!value) return 'Email обязателен';
		const trimmed = value.trim();
		if (trimmed !== value)
			return 'Email не должен содержать пробелы в начале или конце';
		if (!VALIDATION_PATTERNS.EMAIL.test(trimmed)) {
			return 'Email должен содержать только латинские символы и быть корректно сформирован';
		}
		return null;
	},

	password: value => {
		if (!value) return 'Пароль обязателен';
		if (!VALIDATION_PATTERNS.PASSWORD.test(value)) {
			return 'Пароль должен содержать минимум 8 символов, включая букву, цифру и специальный символ';
		}
		return null;
	},

	firstName: value => {
		if (!value) return 'Имя обязательно';
		const trimmed = value.trim();
		if (!VALIDATION_PATTERNS.NAME.test(trimmed)) {
			return 'Имя должно содержать только буквы';
		}
		return null;
	},

	lastName: value => {
		if (!value) return 'Фамилия обязательна';
		const trimmed = value.trim();
		if (!VALIDATION_PATTERNS.NAME.test(trimmed)) {
			return 'Фамилия должна содержать только буквы';
		}
		return null;
	},

	birthday: value => {
		if (!value) return 'Дата рождения обязательна';
		const timestamp = parseInt(value);
		if (isNaN(timestamp) || timestamp < 0) {
			return 'Некорректная дата рождения';
		}
		return null;
	},
};

// утилита для валидации всей формы
export const validateForm = (data, rules) => {
	const errors = {};
	let isValid = true;

	for (const field in rules) {
		const error = rules[field](data[field]);
		if (error) {
			errors[field] = error;
			isValid = false;
		}
	}

	return { isValid, errors };
};
