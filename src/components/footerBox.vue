<template>
	<div class="footer-box">
		<div :class="{'red': count === 1}" class="per-footer-cell" @click="goShopIndex()">
			<img ref="homet" class="ticon" :src="'static/img/home'+ ((count === 1) ? '_on' : '') +'.png'">
			<div class="title mar-top--1">首页</div>
		</div>
		<div :class="{'red': count === 2}" class="per-footer-cell" @click="goCategoryIndex()">
			<img ref="classt" class="ticon" :src="'static/img/class'+ ((count === 2) ? '_on' : '') +'.png'">
			<div class="title mar-top--1">分类</div>
		</div>
		<div :class="{'red': count === 3}" class="per-footer-cell" @click="goCartIndex()">
			<img ref="cartt" class="ticon" :src="'static/img/cart'+ ((count === 3) ? '_on' : '') +'.png'">
			<div class="title mar-top--1">购物车</div>
		</div>
		<div :class="{'red': count === 4}" class="per-footer-cell" @click="goMyIndex()">
			<img ref="met" class="ticon" :src="'static/img/me'+ ((count === 4) ? '_on' : '') +'.png'">
			<div class="title mar-top--1">我的</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'footerBox',
	data () {
		return {
		}
	},	
	props: ['count'],
	methods: {
	},
}
</script>

<style scoped>
.footer-box {
	position: fixed;
	height: 50px;
	width: 100%;
	display: flex;
	left: 0;
	bottom: 0;
	background-color: #ffffff;
	border-top: 1px solid #cccccc;
	z-index: 9999;
	font-size: 11px;
}
.per-footer-cell {
	width: 25%;
	cursor: pointer;
}

.ticon {
	width: 16px;
	height: 16px;
	margin-top: 8px;
}

</style>
