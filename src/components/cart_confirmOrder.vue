<template>
	<div class="box cart_confirmOrder">
		<div v-if="!showSelectAddress">
			<div @click="goCartAddressLists(1)">
				<div class="reci-info">
					收件人: {{ name }}
					<span class="fr">{{ phone }}</span>
				</div>
				<div class="tl reci-info-2">
					<img class="locat" src="static/img/location.png">
					{{ address }}
					<img class="arrow" src="static/img/arrow_right.png" />
				</div>
			</div>
			<img class="border-box" src="static/img/border.png">
		</div>
		<div v-if="showSelectAddress">
			<div class="select-address" @click="goCartAddressLists(1)">
				请选择收货地址
				<img class="icon-style2" src="static/img/arrow_right.png" />
			</div>
		</div>
		<div class="content-box">
			<div class="get-goods">
				您所选购的商品
			</div>
			<div class="goods-detail-box">
				<div v-for="goodsList in goodsLists" class="goods-detail">
					<img :src="urlPrefix + goodsList.img_thumb">
					<div class="ellip tl goods-name">
						{{ goodsList.goods_name }}
					</div>
					<div class="goods-money">

						￥{{ (Number(goodsList.promote_price) === 0) ? Number(goodsList.shop_price).toFixed(2) : Number(goodsList.promote_price).toFixed(2) }}
					</div>
					<div class="goods-number">
						x{{ goodsList.amount }}
					</div>
					<div v-show="share_grade_id && share_grade_id !== 0" class="black give-points">
						代理折扣: {{ Number(goodsList.share_discount * 100).toFixed(0) }}%
						折后价格: ￥{{ Number(goodsList.price).toFixed(2) }}
					</div>
					<div v-show="!share_grade_id" class="black give-points">
						积分: {{ parseInt(goodsList.give_points) }}
					</div>

				</div>
				<div class="bor-top list gray-666">
					<div class="per-list gray-666" @click="openDialog()">
						<input placeholder="选填:给商家留言(45字以内)" v-model="leaveMessage" class="tl ellip leave-message-input fl">
						<img class="fr img-style" src="static/img/arrow_right.png" />
					</div>
					<div class="gray-444 per-list">
						<span class="fl">商品金额</span>
						<span class="fr">￥{{ Number(total_goods_price).toFixed(2) }}</span>
					</div>
					<div class="gray-444 per-list">
						<span class="fl">运费</span>
						<span class="fr">{{ shipping_fee }}元</span>
					</div>
				</div>
			</div>
			<div class="list gray-666">
				<template v-if="!share_grade_id">
					<div class="per-list" @click='changePayImage($event)'>
						<span class="fl">可用积分抵扣 <span class="red">{{ Number(exchange_price2).toFixed(2) }}</span> 元</span>
						<img class="fr" :src="payPicture3" />
					</div>
				</template>
				<div class="per-list">
					<span class="fl">微信支付</span>
					<img class="fr" :src="payPicture" />
				</div>
			</div>
		</div>
		<div class="bottom-box">
			<div class="fl tl spzje">
				实付: <span class="red">￥{{ Number(real_fee).toFixed(2) }}</span>
			</div>
			<div class="white fl linear tc ljgm" @click="buyGoods($event)">提交</div>
		</div>
		<mu-dialog :open="dialog2" title="留言" @close="closeDialog">
			<textarea class="leave-textarea" v-model="leaveMessage" maxlength="45" rows="4" type="text" placeholder="选填:给商家留言(45字以内)" name=""></textarea>
			<mu-flat-button slot="actions" @click="closeDialog" primary label="删除留言"/>
			<mu-flat-button slot="actions" primary @click="getLeaveMessage" label="确定"/>
		</mu-dialog>
	</div>
</template>
<script>

export default {
	name: 'cart_confirmOrder',
	data () {
		return {
			leaveMessage: '',
			dialog2: false,
			total_goods_price: '',
			share_discount: '',
			shipping_fee: '',
			real_fee: '',
			goodsLists: [],
			cart_id: '',
			addressLists: [],
			dealPrices: [],
			name: '',
			phone: '',
			address: '',
			payPicture: 'static/img/open.png',
			payPicture2: 'static/img/close.png',
			payPicture3: 'static/img/close.png',
			flag: true,
			flag2: true,
			showSelectAddress: false,
			cart_id_str: '',
			address_id: '',
			pay_style: 1,
			is_use_points: 0,
			share_grade_id: 0,
			exchange_price: '',
			exchange_price2: '',
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '确认下单', })
		this.cart_id_str = this.$route.query.cart_id_str
		that.getShopCartLists()
		that.getAddressDefault()
	},
	methods: {
		openDialog () {
			this.dialog2 = true
		},
		closeDialog () {
			this.dialog2 = false
			this.leaveMessage = ''
		},
		getLeaveMessage () {
			this.dialog2 = false
		},
		getShopCartLists () {
			let that = this
			that.c_ajax({cart_id_str: that.cart_id_str}, 'api.php?&c=ShopCart&a=lists', function (value) {
				if (value.data.status === 10001) {
					for (let v of value.data.lists) {
						that.goodsLists.push(v)
					}
				}
			})
		},
		getAddressDefault () {
			let that = this
			that.c_ajax({is_receive: 1,}, 'api.php?c=UserAddress&a=address_default', function (value) {
				if (value.data.status === 10001) {
					if (value.data.details.name === null) {
						that.showSelectAddress = true
					} else {
						that.name = value.data.details.name
						that.phone = value.data.details.phone
						that.address = value.data.details.address
						that.address_id = value.data.details.id
					}
					that.getDealPrice()
					that.getAlonePrice()
				}
			})
		},
		getDealPrice () {
			let that = this
			that.c_ajax({is_use_points: that.is_use_points, cart_id_str: that.cart_id_str, }, 'api.php?c=ShopCart&a=deal_price', function (value) {
				if (value.data.status === 10001) {
					that.total_goods_price = value.data.detail.total_goods_price
					that.share_discount = value.data.detail.share_discount
					that.shipping_fee = value.data.detail.shipping_fee
					that.real_fee = value.data.detail.real_fee
					that.share_grade_id = Number(value.data.detail.share_grade_id)
					that.exchange_price = value.data.detail.exchange_price
				}
			})
		},
		getAlonePrice () {
			let that = this
			that.c_ajax({is_use_points: 1, cart_id_str: that.cart_id_str,}, 'api.php?c=ShopCart&a=deal_price', function (value) {
				if (value.data.status === 10001) {
					that.exchange_price2 = value.data.detail.points_fee
				}
			})
		},
		changePay (e, type) {
			this.flag = !this.flag
			let str = 'static/img/', a = (this.flag) ? 'open' : 'close', b = (!this.flag) ? 'open': 'close'
			this.payPicture = str + a + '.png'
			this.payPicture2 = str + b + '.png'

			if (a === 'open') {
				this.pay_style = 1
			}
			if (a === 'close') {
				this.pay_style = 2
			}
		},
		changePayImage (e) {
			let that = this
			this.flag2 = !this.flag2
			let str = 'static/img/', a = (this.flag2) ? 'close' : 'open'


			this.payPicture3 = str + a + '.png'
			if (a === 'open') {
				this.is_use_points = 1
			}
			if (a === 'close') {
				this.is_use_points = 0
			}
			this.getDealPrice()
		},
		buyGoods () {
			let that = this
			let post = {}
			if (that.showSelectAddress) {
				that.showDialog('请选择收货地址!')
				return
			}
			post.pay_style = that.pay_style
			post.address_id = that.address_id
			post.is_use_points = that.is_use_points
			post.msg = that.leaveMessage
			that.c_ajax({post: post, cart_id_lists: that.cart_id_str, }, 'api.php?c=ShopOrder&a=add', function (value) {
				if (value.data.status === 10001) {
					let log_id = value.data.log_id
					let order_id = value.data.order_id
					that.c_ajax({order_id: order_id, log_id: log_id, }, 'api.php?c=ShopOrder&a=pay', function (value) {
						if (value.data.status === 10001) {
							window.location.href = value.data.url
						} else {
							that.showDialog(value.data.status)
						}
					})
				}
			})
		},
	},
}
</script>

<style scoped>
.cart_confirmOrder {
	bottom: 44px;
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}

.leave-textarea {
	width: 100%;
}

.reci-info {
	font-size: 15px;
	text-align: left;
	padding: 15px 20px 0;
}

.reci-info-2 {
	padding: 2px 40px 2px 40px;
	text-overflow: clip;
	white-space: normal;
	color: #666;
	position: relative;
	font-size: 15px;
	position: relative;
}

.reci-info-2 .locat {
	width: 14px;
	position: absolute;
	left: 17px;
	top: 22%;
}

.reci-info-2 .arrow {
	position: absolute;
	right: 5px;
}

.select-address {
	width: 100%;
	height: 48px;
	padding: 13px 35px 13px 16px;
	text-align: left;
	color: #666;
	font-size: 15px;
	background-color: #fff;
	margin-bottom: 15px;
	position: relative;
}

.border-box {
	vertical-align: bottom;
	margin-top: 15px;
	height: 10px;
	width: 100%;
	margin-bottom: 15px;
}

.icon-style {
	position: absolute;
	right: 5px;
	top: 0px;
}

.icon-style2 {
	position: absolute;
	right: 5px;
	bottom: 12px;
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

.bor-top {
	border-top: 1px solid #ccc;
}

.goods-detail-box {
	background-color: #fff;
	width: 100%;
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
	width: 50%;
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

.give-points {
	position: absolute;
	right: 10px;
	bottom: 10px;
}

.list {
	position: relative;
	padding-top: 1px;
	padding-bottom: 1px;
	padding-left: 0;
	margin-bottom: 20px;
	background-color: #fff;
	font-size: 15px;
}

.per-list {
	height: 40px;
	padding: 10px 16px;
	font-size: 16px;
}

.per-list img {
	height: 24px;
	width: 48px;
}

.per-list .img-style {
	width: 24px;
	height: 24px;
	margin-right: -7px;
}

.leave-message-input {
	font-size: 13px;
	width: 80%;
	border: 0;
	outline: none;
}

.bottom-box {
	border-top:1px solid #ddd;
	background-color: #FEFEFF;
	padding:0;
	height: 42px;
	position: fixed;
	width: 100%;
	bottom: 0;
}
.spzje {
	width: 66.6%;
	position: relative;
	height: 42px;
	padding: 5px 10px 5px 20px;
	font-size: 15px;
	line-height: 32px;
}
.spzje-img {
	width: 15px;
	background-color: #000;
	border-radius: 50%;
	height: 15px;
	margin-top: 5px;
	background-size: 10px 7px;
	background-repeat: no-repeat;
}
.spzje-money {
	font-size: 16px;
}
.ljgm {
	width: 33.3%;
	height: 42px;
	line-height: 42px;
	font-size: 16px;
}

.content-box {
	background-color: #F3F5F7;
}

</style>