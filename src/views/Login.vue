<template>
	<v-container fluid fill-height>
		<v-row justify="center" align="center">
			<v-col cols="12" sm="8" md="6" lg="4">
				<v-card class="elevation-12">
					<v-card-title class="justify-center">
						<h2>Вход</h2>
					</v-card-title>

					<v-card-text>
						<ErrorAlert :error="authError" @dismiss="clearError" />

						<v-form
							ref="form"
							v-model="valid"
							@submit.prevent="handleLogin"
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

							<v-btn
								type="submit"
								color="primary"
								block
								large
								:loading="authLoading"
								:disabled="!valid || authLoading"
								class="mt-4"
							>
								Войти
							</v-btn>
						</v-form>
					</v-card-text>

					<v-card-actions class="justify-center">
						<v-btn text color="primary" @click="goToSignUp">
							Нет аккаунта? Зарегистрироваться
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
	name: 'LoginPage',
	components: {
		PasswordField,
		ErrorAlert,
	},
	data() {
		return {
			valid: false,
			form: {
				email: '',
				password: '',
			},
			errors: {
				email: null,
				password: null,
			},
		};
	},
	computed: {
		...mapGetters('auth', ['authLoading', 'authError']),
	},
	methods: {
		...mapActions('auth', ['login']),

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
			};

			const { isValid, errors } = validateForm(this.form, rules);
			this.errors = { ...this.errors, ...errors };
			this.valid = isValid;

			return isValid;
		},

		async handleLogin() {
			if (!this.validateForm()) {
				return;
			}

			const result = await this.login({
				email: this.form.email.trim(),
				password: this.form.password,
			});

			if (result.success) {
				this.$router.push('/user');
			}
		},

		goToSignUp() {
			this.$router.push('/signup');
		},

		clearError() {
			this.$store.commit('auth/SET_ERROR', null);
		},
	},
};
</script>
