<template>
	<div class="box my_order_detail">
		<div v-for="orderList in orderLists">
			<div class="reci-info">
				收件人: {{ orderList.address_name }}
				<span class="fr">{{ orderList.address_phone }}</span>
			</div>
			<div class="tl reci-info-2">
				<img src="static/img/location.png">
				{{ orderList.address }}
			</div>
			<img class="border-box" src="static/img/border.png">
			<div class="get-goods">
				您所选购的商品
			</div>
			<div class="goods-detail-box">
				<div v-for="goodsList in goodsLists" class="goods-detail">
					<img :src="urlPrefix + goodsList.img_thumb">
					<div class="goods-name">
						{{ goodsList.goods_name }}
					</div>
					<div class="goods-money">
						￥{{ Number(goodsList.order_price).toFixed(2) }}
					</div>
					<div class="goods-number">
						x{{ goodsList.amount }}
					</div>
				</div>
			</div>
			<div class="order-describe">
				<div><span class="gray-999">下单时间: </span><span class="black">&nbsp;&nbsp;{{ orderList.addtime }}</span></div>
				<div><span class="gray-999">订单编号: </span><span class="black">&nbsp;&nbsp;{{ orderList.order_sn }}</span></div>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_order_detail',
	data () {
		return {
			order_id: '',
			goodsLists: [],
			orderLists: [],
		}
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '订单详情', })
		this.order_id = this.$route.query.order_id
		that.c_ajax({order_id: that.order_id}, 'api.php?c=UserOrder&a=detail', function (value) {
			if (value.data.status === 10001) {
				that.orderLists.push(value.data.detail)
				that.orderLists[0].addtime = that.timestampToTime(value.data.detail.addtime)
				for (let v of value.data.detail.goods_lists) {
					that.goodsLists.push(v)
				}
			}
		})
	},
}
</script>

<style scoped>
.my_order_detail {
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}

.reci-info {
	font-size: 15px;
	text-align: left;
	padding: 15px 20px 0;
}

.reci-info-2 {
	padding: 2px 20px 2px 40px;
	text-overflow: clip;
	white-space: normal;
	color: #666;
	position: relative;
	font-size: 15px;
}

.reci-info-2 img {
	width: 14px;
	position: absolute;
	left: 17px;
	top: 22%;
}

.border-box {
	vertical-align: bottom;
	margin-top: 15px;
	height: 10px;
	width: 100%;
	margin-bottom: 15px;
}

.get-goods {
	padding-left: 16px;
	background-color: #fff;
	text-align: left;
	font-size: 16px;
	height: 42px;
	line-height: 42px;
	color: #666;
}

.goods-detail-box {
	background-color: #fff;
	width: 100%;
	border-bottom: 1px solid #ccc;

}

.goods-detail {
	border-top: none; 
	padding: 8px 16px 10px 90px;
	margin-left: 16px;
	border-top: 1px solid #ccc;
	position: relative;
	background-color: #fff;
	height: 100px;
}

.goods-detail img {
	position: absolute;
	top: 10px;
	left: 0;
	width: 80px;
	height: 80px;
}

.goods-name {
	text-align: left;
	width: 100px;
}

.goods-money {
	color: #df2a2b;
	text-align: left;
}

.goods-number {
	position: absolute;
	right: 10px;
	top: 10px;
	color: #df2a2b;
}

.order-describe {
	padding: 10px 16px;
	margin-top: 10px;
	background-color: #fff;
	text-align: left;
}

</style>