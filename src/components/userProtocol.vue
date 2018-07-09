<template>
	<div v-if="!canHide" @click="hideBox" class="hide-box">
		<div v-html="protocol" @click.stop="stop" class="tl userProtocol">
		</div>
	</div>
	
</template>
<script>

export default {
	name: 'userProtocol',
	data () {
		return {
		}
	},
	props: ['protocol', 'canHide'],
	created () {

	},
	methods: {
		hideBox () {
			this.$emit('detect')
		},
		stop () {

		},
	},
}
</script>

<style scoped>

.userProtocol {
	width: 80%;
	height: 400px;
	background-color: #fff;
	position: absolute;
	top: 50%;
	margin-top: -200px;
	left: 10%;
	border-radius: 10px;
	padding: 20px 5%;
	overflow-y: scroll;
	box-sizing: border-box;
}

</style>