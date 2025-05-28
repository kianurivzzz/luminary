<template>
	<v-text-field
		:value="value"
		:label="label"
		:type="showPassword ? 'text' : 'password'"
		:error-messages="errorMessages"
		:disabled="disabled"
		:required="required"
		:rules="rules"
		outlined
		@input="$emit('input', $event)"
		@blur="$emit('blur')"
	>
		<template v-slot:append>
			<v-btn icon @click="showPassword = !showPassword" tabindex="-1">
				<v-icon>
					{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
				</v-icon>
			</v-btn>
		</template>
	</v-text-field>
</template>

<script>
export default {
	name: 'PasswordField',
	props: {
		value: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: 'Пароль',
		},
		errorMessages: {
			type: [String, Array],
			default: () => [],
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		required: {
			type: Boolean,
			default: false,
		},
		rules: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			showPassword: false,
		};
	},
};
</script>
