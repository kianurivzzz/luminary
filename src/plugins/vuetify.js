import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		dark:
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches,
		themes: {
			light: {
				primary: '#000000',
				secondary: '#757575',
				accent: '#424242',
				error: '#FF5252',
				info: '#424242',
				success: '#4CAF50',
				warning: '#FFC107',
			},
			dark: {
				primary: '#FFFFFF',
				secondary: '#BDBDBD',
				accent: '#E0E0E0',
				error: '#FF5252',
				info: '#E0E0E0',
				success: '#4CAF50',
				warning: '#FB8C00',
			},
		},
	},
	icons: {
		iconfont: 'mdi',
	},
});
