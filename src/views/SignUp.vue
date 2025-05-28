<template>
	<v-container fluid fill-height>
		<v-row justify="center" align="center">
			<v-col cols="12" sm="8" md="6" lg="5">
				<v-card class="elevation-12">
					<v-card-title class="justify-center">
						<h2>Регистрация</h2>
					</v-card-title>

					<v-card-text>
						<ErrorAlert :error="authError" @dismiss="clearError" />

						<v-form
							ref="form"
							v-model="valid"
							@submit.prevent="handleSignUp"
						>
							<v-text-field
								v-model="form.email"
								label="Email"
								type="email"
								outlined
								required
								:error-messages="errors.email"
								@blur="validateField('email')"
							/>

							<PasswordField
								v-model="form.password"
								label="Пароль"
								:error-messages="errors.password"
								@blur="validateField('password')"
							/>

							<v-text-field
								v-model="form.firstName"
								label="Имя"
								outlined
								required
								:error-messages="errors.firstName"
								@blur="validateField('firstName')"
							/>

							<v-text-field
								v-model="form.lastName"
								label="Фамилия"
								outlined
								required
								:error-messages="errors.lastName"
								@blur="validateField('lastName')"
							/>

							<v-menu
								v-model="dateMenu"
								:close-on-content-click="false"
								:nudge-right="40"
								transition="scale-transition"
								offset-y
								min-width="auto"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="formattedDate"
										label="Дата рождения"
										prepend-icon="mdi-calendar"
										readonly
										outlined
										required
										:error-messages="errors.birthday"
										v-bind="attrs"
										v-on="on"
									/>
								</template>
								<v-date-picker
									v-model="selectedDate"
									@input="dateMenu = false"
									locale="ru"
									:max="maxDate"
								/>
							</v-menu>

							<v-btn
								type="submit"
								color="primary"
								block
								large
								:loading="authLoading"
								:disabled="!valid || authLoading"
								class="mt-4"
							>
								Зарегистрироваться
							</v-btn>
						</v-form>
					</v-card-text>

					<v-card-actions class="justify-center">
						<v-btn text color="primary" @click="goToLogin">
							Уже есть аккаунт? Войти
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import ErrorAlert from '@/components/ui/ErrorAlert.vue';
import PasswordField from '@/components/ui/PasswordField.vue';
import { validateForm, validators } from '@/utils/validation';
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'SignUpPage',
	components: {
		PasswordField,
		ErrorAlert,
	},
	data() {
		return {
			valid: false,
			dateMenu: false,
			selectedDate: null,
			form: {
				email: '',
				password: '',
				firstName: '',
				lastName: '',
				birthday: null,
			},
			errors: {
				email: null,
				password: null,
				firstName: null,
				lastName: null,
				birthday: null,
			},
		};
	},
	computed: {
		...mapGetters('auth', ['authLoading', 'authError']),

		formattedDate() {
			if (!this.selectedDate) return '';
			const date = new Date(this.selectedDate);
			return date.toLocaleDateString('ru-RU');
		},

		maxDate() {
			// Максимальная дата - сегодня
			return new Date().toISOString().substr(0, 10);
		},
	},
	watch: {
		selectedDate(newDate) {
			if (newDate) {
				// конвертирует дату в мс
				this.form.birthday = new Date(newDate).getTime();
				this.validateField('birthday');
			}
		},
	},
	methods: {
		...mapActions('auth', ['signUp']),

		validateField(field) {
			const validator = validators[field];
			if (validator) {
				this.errors[field] = validator(this.form[field]);
			}
		},

		validateForm() {
			const rules = {
				email: validators.email,
				password: validators.password,
				firstName: validators.firstName,
				lastName: validators.lastName,
				birthday: validators.birthday,
			};

			const { isValid, errors } = validateForm(this.form, rules);
			this.errors = { ...this.errors, ...errors };
			this.valid = isValid;

			return isValid;
		},

		async handleSignUp() {
			if (!this.validateForm()) {
				return;
			}

			const result = await this.signUp({
				email: this.form.email.trim(),
				password: this.form.password,
				firstName: this.form.firstName.trim(),
				lastName: this.form.lastName.trim(),
				birthday: this.form.birthday,
			});

			if (result.success) {
				// после успешной регистрации перенаправляет на страницу входа
				this.$router.push('/login');
				// показывает уведомление об успешной регистрации
				this.$store.commit('auth/SET_ERROR', null);
			}
		},

		goToLogin() {
			this.$router.push('/login');
		},

		clearError() {
			this.$store.commit('auth/SET_ERROR', null);
		},
	},
};
</script>
