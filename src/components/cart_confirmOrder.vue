<template>
	<div>
		<div class="cart_confirmOrder">
			<div v-if="!showSelectAddress">
				<div @click="goCartAddressLists(1)">
					<div class="font-size-15 tl pad-top-15 pad-lef-20 pad-rig-20">
						收件人: {{ name }}
						<span class="fr">{{ phone }}</span>
					</div>
					<div class="tl gray-666 pos-relative font-size-15" style="padding: 2px 40px;">
						<img class="pos-absolute" style="width: 14px; left: 17px; top: 22%;" src="static/img/location.png">
						{{ address }}
						<img class="pos-absolute" style="right: 5px;" src="static/img/arrow_right.png" />
					</div>
				</div>
				<img class="mar-bot-15 width-100per mar-top-15 vertical-align" style="height: 10px;" src="static/img/border.png">
			</div>
			<div v-if="showSelectAddress">
				<div class="width-100per tl gray-666 font-size-15 white-b mar-bot-15 pos-relative" style="height: 48px; padding: 13px 35px 13px 16px;" @click="goCartAddressLists(1)">
					请选择收货地址
					<img class="pos-absolute" style="right: 5px; bottom: 12px; " src="static/img/arrow_right.png" />
				</div>
			</div>
			<div class="content-box">
				<div class="pad-lef-16 white-b tl font-size-16 per-line-42 gray-666">
					您所选购的商品
				</div>
				<div class="white-b width-100per">
					<div v-for="goodsList in goodsLists" class="mar-lef-16 white-b border-top-1 pos-relative height-100" style="padding: 8px 16px 10px 90px;">
						<img :src="urlPrefix + goodsList.img_thumb" class="pos-absolute" style="top: 10px; left: 0; width: 80px;">
						<div class="ellip tl width-50per">
							{{ goodsList.goods_name }}
						</div>
						<div class="tl red">
							￥{{ (Number(goodsList.promote_price) === 0) ? Number(goodsList.shop_price).toFixed(2) : Number(goodsList.promote_price).toFixed(2) }}
						</div>
						<div class="pos-absolute red" style="right: 10px; top: 10px;">
							x{{ goodsList.amount }}
						</div>
						<div v-show="share_grade_id && share_grade_id !== 0" class="black pos-absolute" style="right: 10px; bottom: 10px; ">
							代理折扣: {{ Number(goodsList.share_discount * 100).toFixed(0) }}%
							折后价格: ￥{{ Number(goodsList.price).toFixed(2) }}
						</div>
						<div v-show="!share_grade_id" class="black pos-absolute" style="right: 10px; bottom: 10px; ">
							积分: {{ parseInt(goodsList.give_points) }}
						</div>

					</div>
					<div class="gray-666 border-top-1 white-b font-size-15 mar-bot-20 pos-relative" style="padding-top: 1px; padding-bottom: 1px;">
						<div class="height-40 pad-top-10 pad-bot-10 pad-lef-16 pad-rig-16 font-size-16 gray-666" @click="openDialog()">
							<input placeholder="选填:给商家留言(45字以内)" v-model="leaveMessage" class="tl ellip fl font-size-13 width-80per input-cus">
							<img class="fr" style="width: 24px; margin-right: -7px;" src="static/img/arrow_right.png" />
						</div>
						<div class="gray-444 height-40 pad-top-10 pad-bot-10 pad-lef-16 pad-rig-16 font-size-16">
							<span class="fl">商品金额</span>
							<span class="fr">￥{{ Number(total_goods_price).toFixed(2) }}</span>
						</div>
						<div class="gray-444 height-40 pad-top-10 pad-bot-10 pad-lef-16 pad-rig-16 font-size-16">
							<span class="fl">运费</span>
							<span class="fr">{{ shipping_fee }}元</span>
						</div>
					</div>
				</div>
				<div class="gray-666 white-b font-size-15 mar-bot-20 pos-relative" style="padding-top: 1px; padding-bottom: 1px;">
					<template v-if="!share_grade_id">
						<div class="height-40 pad-top-10 pad-bot-10 pad-lef-16 pad-rig-16 font-size-16" @click='changePayImage($event)'>
							<span class="fl">可用积分抵扣 <span class="red">{{ Number(exchange_price2).toFixed(2) }}</span> 元</span>
							<img class="fr" style="width: 48px;	height: 24px;" :src="payPicture3" />
						</div>
					</template>
					<div class="height-40 pad-top-10 pad-bot-10 pad-lef-16 pad-rig-16 font-size-16">
						<span class="fl">微信支付</span>
						<img class="fr" style="width: 48px;	height: 24px;" :src="payPicture" />
					</div>
				</div>
			</div>
		</div>
		<div class="white-b	width-100per pos-fixed border-top-1 height-42" style="bottom: 0;">
			<div class="fl tl pos-relative font-size-15 pad-top-5 pad-rig-10 pad-bot-5 pad-lef-20 height-42" style="width: 66.6%; line-height: 32px;">
				实付: <span class="red">￥{{ Number(real_fee).toFixed(2) }}</span>
			</div>
			<div class="white fl red-b tc font-size-16 per-line-42" style="width: 33.3%;" @click="buyGoods($event)">提交</div>
		</div>
		<mu-dialog :open="dialog2" title="留言" @close="closeDialog">
			<textarea class="width-100per" v-model="leaveMessage" maxlength="45" rows="4" type="text" placeholder="选填:给商家留言(45字以内)" name=""></textarea>
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
	mounted () {
		this.getShare()
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
	position: absolute;
	top: 43px;
	left: 0;
	width: 100%;
	background-color: #F3F5F7;
	overflow-y: scroll;
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}
</style>