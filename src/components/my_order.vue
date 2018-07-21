<template>
	<div class="box my_order">
		<div class="tc top-box">
			<div @click='selectOrderType(i)' :class="{'black': i === selectI}" v-for="(topBoxList, i) in topBoxLists" class="fl tc per-top-box-cell">{{ topBoxList }}</div>
		</div>
		<div class="list">
			<div v-for="(list, i) in lists" :id="list.order_id" class="per-list">
				<div class="list-box" @click="goMyOrderDetail(list.order_id)">
					<p class="tl order-number">
						订单编号: {{ list.order_sn }}
					</p>
					<div v-for="(goodsList, i) in list.goods_lists" class="ellip goods-detail">
						<img :src="urlPrefix + goodsList.img_thumb">
						<div class="fr tr">
							<div class="goods-money">￥{{ Number(goodsList.order_price).toFixed(2) }}</div>
							<div class="goods-his-money">￥{{ Number(goodsList.market_price).toFixed(2) }}</div>
							<div class="gray-666 goods-count">x{{ goodsList.amount }}</div>
						</div>
						<div class="tl ellip goods-name">{{ goodsList.goods_name }}</div>
					</div>
					<div class="all-money tr">
						<span>共{{ list.goods_num }}件商品 合计 </span><span class="m">￥{{ list.real_fee }}</span>
					</div>
				</div>
				<div class="have-status">
					<div @click="cancelOrder(list.order_id)" v-if="list.pay_status === '0'" class="white red-b btn-style fr">取消订单</div>
					<div @click='buyGoods(list.order_id)' v-if="list.pay_status === '0'" class="white red-b btn-style fr">去付款</div>
					<div v-if="list.pay_status === '1' && list.shipping_status === '0'" class="white red-b btn-style red-b-ok fr">待发货</div>
					<div v-if="list.pay_status === '1' && list.shipping_status === '0' && list.back_status === '0'" class="white red-b btn-style fr" @click="goMyApplySale(list.order_id, 1)">去退款</div>
					<div class="white red-b btn-style red-b-ok fr" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '1'">
						售后申请中，请等候
					</div>
					<div @click="goMyBackGoods(list.order_id)" class="white red-b btn-style red-b fr" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '2'">
						卖家允许退款退货，去退货
					</div>
					<div class="white btn-style red-b red-b-ok fr" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '3'">
						卖家拒绝退款退货
					</div>
					<div class="white red-b btn-style red-b-ok fr" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '4'">
						买家已发货
					</div>
					<div class="white red-b btn-style red-b-ok fr" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '5'">
						退货完成
					</div>
					<div @click="goMyApplySale(list.order_id)" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '0'" class="white red-b btn-style fr">申请售后</div>
					<div @click="goMyShipping(list.order_id)" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '0'" class="white red-b btn-style fr">查看物流</div>
					<div v-if="list.pay_status === '1' && list.shipping_status === '2' && list.comment_status === '1'" class="white btn-style red-b red-b-ok fr">已完成</div>
					<div @click="getGoods(list.order_id)" v-if="list.pay_status === '1' && list.shipping_status === '1' && list.back_status === '0'" class="white red-b btn-style fr">确认收货</div>
					<div @click="goMyComment(list.order_id)" v-if="list.pay_status === '1' && list.shipping_status === '2' && list.comment_status === '0'" class="white red-b btn-style fr">去评价</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_order',
	data () {
		return {
			topBoxLists: ['全部', '待付款', '待发货', '待收货', '待售后',],
			selectI: 0,
			lists: [],
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '我的订单', })
		that.getLists({'token': that.$store.state.token, })
	},
	methods: {
		// 去付款
		buyGoods (order_id) {
			let that = this
			that.c_ajax({order_id: order_id}, 'api.php?c=ShopOrder&a=pay', function (value) {
				if (value.data.status === 10001) {
					window.location.href = value.data.url
				}
			})
		},
		selectOrderType (i) {
			let that = this, obj = {}
			this.selectI = i
			if (i === 0) {
				obj =  {}			
			}
			if (i === 1) {
				obj =  {'pay_status': 0, }
			}
			if (i === 2) {
				obj =  {'pay_status': 1, 'shipping_status': 0, }			
			}
			if (i === 3) {
				obj = {'pay_status': 1, 'shipping_status': 1, }
			}
			if (i === 4) {
				obj = {'pay_status': 1, 'shipping_status': 1, 'back_status': 1, }
			}
			this.getLists(obj)
		},
		getLists (obj) {
			let that = this
			that.c_ajax(obj, 'api.php?c=UserOrder&a=lists', function (value) {
				if (value.data.status === 10001) {
					that.lists = []
					if (value.data.lists) {
						for (let v of value.data.lists) {
							that.lists.push(v)
						}
					}
				}
				if (value.data.status === 10003) {
					that.lists = []
				}
			})
		},
		//收货成功
		getGoods (order_id) {
			let that = this
			that.c_ajax({order_id: order_id}, 'api.php?c=UserOrder&a=shouhuo', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('收货成功!')
					let obj = {'token': that.$store.state.token, 'pay_status': 1, 'shipping_status': 1, }
					that.getLists(obj)
					that.selectI = 0
				}
			})
		},
		// 取消订单
		cancelOrder (order_id) {
			let that = this, obj = { }
			that.c_ajax({order_id: order_id}, 'api.php?c=UserOrder&a=delete', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('订单已取消!')
					setTimeout(function () {
						that.getLists(obj)
						that.selectI = 0
					}, 1500)
				}
			})
		},
	},
	mounted () {
		this.getShare()
	},
}
</script>

<style scoped>
.my_order {
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}

.top-box {
	font-size: 1.5rem;
	color: #7f7f7f;
	border-bottom: 1px solid #ddd;
	height: 50px;
	width: 100%;
	background-color: #fff;
}

.per-top-box-cell {
	width: 20%;
	height: 50px;
	line-height: 50px;
	font-size: 14px;
}

.per-list {
	padding: 0px; 
	margin-bottom: 10px;
	background-color: #fff;
}

.order-number {
	height: 35px;
	line-height: 35px;
	padding:0 15px;
	margin: 0;
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
	color: #666;
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
}

.all-money .m {
	color: #b64843;
	font-size: 16px;
}

.have-status {
	width: 100%;
	height: 42px;
	line-height: 31px;
	padding: 5px 15px 5px 15px;
	overflow: hidden;
	background-color: #fff;
}

.btn-style {
	border-radius: 5px;
	margin-right: 5px;
	padding: 0 20px;
}

</style>