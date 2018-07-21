<template>
	<div class="box my_shipping">
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
		</div>

		<div class="white-b over-hidden pad-lef-15 pad-rig-15 pad-top-5 pad-bot-5 border-bottom-1-opacity" style="width: 100%; height: 70px;">
			<div class="fl" style="width: 60px; height: 60px; border-radius: 5px;">
				<img :src="shipLogo" style="border-radius: 5px; width: 100%; height: 100%;">
			</div>
			<div class="fl pad-lef-15">
				<div class="per-line-30 tl white-b">
					<span class="black">快递单号: </span>{{ shipCode }}
				</div>
				<div class="per-line-30 tl white-b">
					<span class="black">快递名称: </span>{{ shipName }}
				</div>
			</div>
		</div>


		
		<div v-show="hidenShipDetail" class="ship-detail-box pad-lef-15 pad-rig-15 pad-bot-15 pad-top-5 white-b">
			<div class="mar-top-15 over-hidden" v-for="(shipDetail, i) in shipDetails">
				<div class="fl tl" style="width: 28%;">
					<div class="font-size-12">{{ shipDetail.time | getMyDate }}</div>
					<div class="font-size-12 mar-top-5">{{ shipDetail.time | getMyTime }}</div>
				</div>
				<div class="fl tl mar-lef-2per" style="width: 70%;">
					{{ shipDetail.content }}
				</div>
			</div>
		</div>

		<div v-show="!hidenShipDetail" class="per-line-30">
			{{ msg }}
		</div>

	</div>
</template>
<script>

export default {
	name: 'my_shipping',
	data () {
		return {
			order_id: '',
			order_sn: '',
			goodsLists: [],
			hidenShipDetail: true,
			msg: '',
			goods_num: '',
			total_fee: '',
			shipName: '',
			shipLogo: '',
			shipCode: '',
			shipDetails: [],
		}
	},
	components: {
	},
	filters: {
		getMyDate (v) {
			return v.split(' ')[0]
		},
		getMyTime (v) {
			return v.split(' ')[1]
		},
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '查看物流', })
		
		that.order_id = that.$route.query.order_id
		that.c_ajax({order_id: that.order_id}, 'api.php?c=UserOrder&a=detail', function (value) {
			if (value.data.status === 10001) {
				that.order_sn = value.data.detail.order_sn
				that.goods_num = value.data.detail.goods_num
				that.total_fee = value.data.detail.total_fee
				that.shipName = value.data.detail.shipping_data.kuaidi_title
				that.shipCode = value.data.detail.shipping_data.shipping_id
				that.shipLogo = value.data.detail.shipping_data.logo || 'static/img/share_logo.jpg'
				for (let v of value.data.detail.goods_lists) {
					that.goodsLists.push(v)
				}
				if (value.data.detail.shipping_data.list.length === 0) {
					that.hidenShipDetail = false
					that.msg = value.data.detail.shipping_data.msg
					return
				}
				for (let v of value.data.detail.shipping_data.list) {
					that.shipDetails.push(v)
				}
			}
		})
	},
	methods: {
	},
	mounted () {
		this.getShare()
	},
}
</script>

<style scoped>

.my_shipping {
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
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

.all-money .m {
	color: #b64843;
	font-size: 16px;
}
</style>