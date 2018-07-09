<template>
	<mu-circular-progress v-show="canShowLoad" class="user-mu-circular-progress circularProgress" :size="40" :strokeWidth="5" color="gray" />
</template>
<script>

export default {
	name: 'circularProgress',
	data () {
		return {

		}
	},
	props: ['canShowLoad'],
}
</script>

<style scoped>

.user-mu-circular-progress {
	position: fixed;
	top: 50%;
	left: 50%;
	margin-left: -20px;
	margin-top: -20px;
	z-index: 9999;
}	

</style>