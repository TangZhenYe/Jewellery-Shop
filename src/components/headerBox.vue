<template>
	<div class="white tc header-box">
		<div class="arrow-left-icon">
			<mu-icon @click='goBack()' class="icon-arrow-back" value="arrow_back"/>
		</div>
		<div @click="goHome()" class="white font-size-16 pos-absolute" style="right: 13px;">
			首页
		</div>
		<span>{{ titleMsg }}</span>
	</div>
</template>
<script>

export default {
	name: 'headerBox',
	props: ['titleMsg', ],
	data () {
		return {

		}
	},
	created () {
		
	},
	methods: {
	},
}
</script>

<style scoped>
.header-box {
	height: 43px;
	border-bottom: 1px solid #000;
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	background-color: #444;
	font-size: 16px;
	line-height: 43px;
	z-index: 999;
}
.arrow-left-icon {
	position: absolute;
	left: 13px;
	top: 8.5px;
	width: 24px;
	height: 24px;
}
.icon-arrow-back {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
}
</style>