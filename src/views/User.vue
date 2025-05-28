<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="8" lg="6">
				<v-card class="elevation-8">
					<v-card-title class="justify-center">
						<h2>Профиль</h2>
					</v-card-title>

					<v-card-text>
						<ErrorAlert
							:error="userError"
							@dismiss="clearUserError"
						/>

						<v-progress-linear
							v-if="userLoading"
							indeterminate
							color="primary"
							class="mb-4"
						/>

						<div v-if="user && !editMode">
							<!-- режим просмотра -->
							<v-list>
								<v-list-item>
									<v-list-item-icon>
										<v-icon>mdi-email</v-icon>
									</v-list-item-icon>
									<v-list-item-content>
										<v-list-item-title
											>Email</v-list-item-title
										>
										<v-list-item-subtitle>{{
											user.email
										}}</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>

								<v-list-item>
									<v-list-item-icon>
										<v-icon>mdi-account</v-icon>
									</v-list-item-icon>
									<v-list-item-content>
										<v-list-item-title
											>Имя</v-list-item-title
										>
										<v-list-item-subtitle>{{
											user.firstName
										}}</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>

								<v-list-item>
									<v-list-item-icon>
										<v-icon>mdi-account-outline</v-icon>
									</v-list-item-icon>
									<v-list-item-content>
										<v-list-item-title
											>Фамилия</v-list-item-title
										>
										<v-list-item-subtitle>{{
											user.lastName
										}}</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>

								<v-list-item>
									<v-list-item-icon>
										<v-icon>mdi-calendar</v-icon>
									</v-list-item-icon>
									<v-list-item-content>
										<v-list-item-title
											>Дата рождения</v-list-item-title
										>
										<v-list-item-subtitle>{{
											formattedBirthday
										}}</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-list>

							<v-btn
								color="primary"
								block
								large
								class="mt-4"
								@click="startEdit"
							>
								Редактировать
							</v-btn>
						</div>

						<div v-if="editMode">
							<!-- режим редактирования -->
							<v-form
								ref="form"
								v-model="valid"
								@submit.prevent="handleUpdate"
							>
								<v-text-field
									:value="user.email"
									label="Email"
									outlined
									disabled
									hint="Email нельзя изменить"
									persistent-hint
								/>

								<PasswordField
									v-model="form.password"
									label="Новый пароль. Оставьте пустым, если не хотите менять"
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
											v-model="formattedEditDate"
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

								<v-row class="mt-4">
									<v-col cols="6">
										<v-btn
											color="secondary"
											block
											large
											@click="cancelEdit"
										>
											Отмена
										</v-btn>
									</v-col>
									<v-col cols="6">
										<v-btn
											type="submit"
											color="primary"
											block
											large
											:loading="userLoading"
											:disabled="!valid || userLoading"
										>
											Сохранить
										</v-btn>
									</v-col>
								</v-row>
							</v-form>
						</div>
					</v-card-text>
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
	name: 'UserPage',
	components: {
		PasswordField,
		ErrorAlert,
	},
	data() {
		return {
			editMode: false,
			valid: false,
			dateMenu: false,
			selectedDate: null,
			form: {
				password: '',
				firstName: '',
				lastName: '',
				birthday: null,
			},
			errors: {
				password: null,
				firstName: null,
				lastName: null,
				birthday: null,
			},
		};
	},
	computed: {
		...mapGetters('user', [
			'user',
			'userLoading',
			'userError',
			'formattedBirthday',
		]),

		formattedEditDate() {
			if (!this.selectedDate) return '';
			const date = new Date(this.selectedDate);
			return date.toLocaleDateString('ru-RU');
		},

		maxDate() {
			return new Date().toISOString().substr(0, 10);
		},
	},
	watch: {
		selectedDate(newDate) {
			if (newDate) {
				this.form.birthday = new Date(newDate).getTime();
				this.validateField('birthday');
			}
		},
	},
	async created() {
		// загружает данные пользователя при создании компонента
		await this.fetchUser();
	},
	methods: {
		...mapActions('user', ['fetchUser', 'updateUser']),

		startEdit() {
			this.editMode = true;
			// заполняет форму текущими данными
			this.form.firstName = this.user.firstName;
			this.form.lastName = this.user.lastName;
			this.form.birthday = this.user.birthday;
			this.form.password = '';

			// устанавливает дату
			if (this.user.birthday) {
				this.selectedDate = new Date(this.user.birthday)
					.toISOString()
					.substr(0, 10);
			}

			// очищает ошибки
			this.errors = {
				password: null,
				firstName: null,
				lastName: null,
				birthday: null,
			};
		},

		cancelEdit() {
			this.editMode = false;
			this.selectedDate = null;
			this.form = {
				password: '',
				firstName: '',
				lastName: '',
				birthday: null,
			};
			this.errors = {
				password: null,
				firstName: null,
				lastName: null,
				birthday: null,
			};
		},

		validateField(field) {
			const validator = validators[field];
			if (validator) {
				// исключение для пароля
				if (field === 'password' && !this.form[field]) {
					this.errors[field] = null;
					return;
				}
				this.errors[field] = validator(this.form[field]);
			}
		},

		validateForm() {
			const rules = {
				firstName: validators.firstName,
				lastName: validators.lastName,
				birthday: validators.birthday,
			};

			// добавляет валидацию пароля только если он заполнен
			if (this.form.password) {
				rules.password = validators.password;
			}

			const { isValid, errors } = validateForm(this.form, rules);
			this.errors = { ...this.errors, ...errors };
			this.valid = isValid;

			return isValid;
		},

		async handleUpdate() {
			if (!this.validateForm()) {
				return;
			}

			const updateData = {
				firstName: this.form.firstName.trim(),
				lastName: this.form.lastName.trim(),
				birthday: this.form.birthday,
			};

			// добавляет пароль только если он заполнен
			if (this.form.password) {
				updateData.password = this.form.password;
			}

			const result = await this.updateUser(updateData);

			if (result.success) {
				this.editMode = false;
			}
		},

		clearUserError() {
			this.$store.commit('user/SET_ERROR', null);
		},
	},
};
</script>
