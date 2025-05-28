<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<v-toolbar-title>Luminary Test Task</v-toolbar-title>

			<v-spacer></v-spacer>

			<!-- переключатель темы -->
			<v-btn icon @click="toggleTheme">
				<v-icon>
					{{
						$vuetify.theme.dark
							? 'mdi-brightness-7'
							: 'mdi-brightness-4'
					}}
				</v-icon>
			</v-btn>

			<!-- меню -->
			<template v-if="isLoggedIn">
				<v-menu offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on">
							<v-icon>mdi-account-circle</v-icon>
						</v-btn>
					</template>
					<v-list>
						<v-list-item @click="goToProfile">
							<v-list-item-icon>
								<v-icon>mdi-account</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>Профиль</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item @click="handleLogout">
							<v-list-item-icon>
								<v-icon>mdi-logout</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>Выйти</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-menu>
			</template>
		</v-app-bar>

		<v-main>
			<slot></slot>
		</v-main>
	</v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'AppLayout',
	computed: {
		...mapGetters('auth', ['isLoggedIn']),
	},
	methods: {
		...mapActions('auth', ['logout']),

		toggleTheme() {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
			// сохраняет предпочтение темы в localstorage
			localStorage.setItem('darkTheme', this.$vuetify.theme.dark);
		},

		goToProfile() {
			if (this.$route.name !== 'User') {
				this.$router.push('/user');
			}
		},

		async handleLogout() {
			await this.logout();
			this.$router.push('/login');
		},
	},

	mounted() {
		// восстанавливает предпочтение темы из localstorage
		const savedTheme = localStorage.getItem('darkTheme');
		if (savedTheme !== null) {
			this.$vuetify.theme.dark = savedTheme === 'true';
		}
	},
};
</script>
