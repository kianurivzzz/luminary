<template>
	<v-alert
		v-if="error"
		type="error"
		dismissible
		outlined
		class="mb-4"
		@input="$emit('dismiss')"
	>
		{{ error }}
	</v-alert>
</template>

<script>
export default {
	name: 'ErrorAlert',
	props: {
		error: {
			type: String,
			default: null,
		},
	},
};
</script>
