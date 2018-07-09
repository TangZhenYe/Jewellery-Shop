<template>
	<div class="box my_backGoods">
		<div class="list-box">
			<p class="tl order-number">
				订单编号: {{ order_sn }}
			</p>
			<div v-for="(goodsList, i) in goodsLists" class="ellip goods-detail">
				<img class="goods-images" :src="urlPrefix + goodsList.img_thumb">
				<div class="fr tr">
					<div class="goods-money">￥{{ Number(goodsList.shop_price).toFixed(2) }}</div>
					<div class="gray-666 goods-his-money">￥{{ Number(goodsList.market_price).toFixed(2) }}</div>
					<div class="gray-666 goods-count">x{{ goodsList.amount }}</div>
				</div>
				<div class="tl ellip goods-name">{{ goodsList.goods_name }}</div>
			</div>
			<div class="all-money tr">
				<span>共{{ goods_num }}件商品 合计 </span><span class="m">￥{{ total_fee }}</span>
			</div>
			<div class="black back-address-title tl font-size-11">您将退货至：</div>
			<div class="black font-size-11 ellip all-moneyt tl">
				{{ back_address }}
			</div>
			<div class="black font-size-13 ellip all-moneyt tl">
				<span class="fl gray-666">请填写快递公司</span>
				<input class="fr input-style" type="text" placeholder="请填写快递公司" v-model="back_shipping_code">
			</div>
			<div class="black font-size-13 ellip all-moneyt tl">
				<span class="fl gray-666">请填写快递单号</span>
				<input class="fr input-style" type="text" placeholder="请填写快递单号" v-model="back_shipping_id">
			</div>
		</div>
		<div @click='submitBackInfo()' class="white tc font-size-15 bottom-box">
			确定
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_backGoods',
	data () {
		return {
			back_address: '',
			order_id: '',
			order_sn: '',
			goodsLists: [],
			goods_num: '',
			total_fee: '',
			imgs: [],
			textValue: '',
			imgs2: [],
			back_shipping_code: '',
			back_shipping_id: '',
		}
	},
	components: {
	},
	created () {
		this.order_id = this.$route.query.order_id
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '退货物流信息', })
		that.order_id = that.$route.query.order_id
		that.c_ajax({order_id: that.order_id}, 'api.php?c=UserOrder&a=detail', function (value) {
			if (value.data.status === 10001) {
				that.order_sn = value.data.detail.order_sn
				that.goods_num = value.data.detail.goods_num
				that.total_fee = value.data.detail.total_fee
				that.back_address = value.data.detail.back_address
				for (let v of value.data.detail.goods_lists) {
					that.goodsLists.push(v)
				}
			}
		})
	},
	methods: {
		submitBackInfo () {
			let that = this
			if (!this.back_shipping_code) {
				that.showDialog('请填写快递公司!')
				return
			}
			if (!this.back_shipping_id) {
				that.showDialog('请填写快递单号!')
				return
			}
			that.c_ajax({order_id: that.order_id, post: {back_shipping_code: that.back_shipping_code, back_shipping_id: that.back_shipping_id}}, 'api.php?c=Order&a=order_back_address', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('已提交!')
					setTimeout(function () {
						that.toBack()
					}, 1500)
				}
			})
		},

	},
}
</script>

<style scoped>
.my_backGoods {
	bottom: 44px;
}
.order-sn {
	height: 35px;
	line-height: 35px;
	padding: 0 15px;
	margin-bottom: 0;
	background-color: #fff;
}

.order-number {
	height: 35px;
	line-height: 35px;
	padding:0 15px;
	margin: 0;
	background-color: #fff;
}
.order-number-change {
	height: 40px;
	line-height: 40px;
	padding:0 15px;
	margin: 0;
	border-bottom: 1px solid #ccc;
	background-color: #fff;
}

.goods-detail {
	padding: 8px 16px 16px 106px;
	background-color: #F3F5F7;
	font-size: 16px;
	position: relative;
	height: 100px;
}

.goods-detail img {
	position: absolute;
	top: 10px;
	left: 10px;
	width: 80px;
	height: 80px;
}

.goods-money {
	color: #b64843;
	font-size: 15px;
}
.goods-his-money {
	text-decoration: line-through;
	font-size: 15px;
}

.goods-name {
	width: 120px;
}

.all-money {
	width: 100%;
	height: 42px;
	line-height: 31px;
	padding: 5px 15px 5px 15px;
	border-bottom: 1px solid #ccc;
	background-color: #fff;
}
.all-moneyt {
	width: 100%;
	height: 42px;
	line-height: 31px;
	padding: 5px 15px 5px 15px;
	background-color: #fff;
}

.input-style {
	border: 0;
	outline: 0;
}

.back-address-title {
	background-color: #fff;
	width: 100%;
	padding-left: 15px;
	padding-top: 5px;
}

.bottom-box {
	position: fixed;
	left: 0;
	width: 100%;
	bottom: 0;
	height: 44px;
	line-height: 44px;
	background-color: #df2a2b;
}
</style>