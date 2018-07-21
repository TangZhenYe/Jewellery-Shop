<template>
	<div class="cart_index box">
		<div class="top-box-box border-bottom-1">
			<div class="gray-666 tl top-box">
				<div ref='allSelect' class="check-box" @click='check($event, 1, "")'></div>
				全选
				<div class="fr" @click='operation'>{{ operationName }}</div>
			</div>	
		</div>
		<div class="list">
			<div class="per-list" :id="cartList.cart_id" v-for="(cartList, i) in cartLists">
				<img class="per-list-img" :src="urlPrefix + cartList.img_thumb">
				<h2 class="tl ellip per-list-name">
					{{ cartList.goods_name }}
				</h2>
				<div class="tc check-box-one" @click="check($event, 0, cartList.cart_id)">
				</div>
				<!-- 下面隐藏 -->
				<template v-if="showEdit">
					<span class="tl red per-list-number">x{{ cartList.amount }}</span>
					<p class="tl red per-list-money">￥{{ cartList.shop_price }}</p>
				</template>
				<template v-else>
					<div class="edit-box">
						<div @click='subNum($event, cartList.cart_id)' class="fl operation-goods">-</div>
						<div class="fl show-num">{{ cartList.amount }}</div>
						<div @click='addNum($event, cartList.cart_id)' class="fl operation-goods">+</div>
					</div>
				</template>
			</div>
		</div>	
		<div class="bottom-box">
			<div class="fl tl spzje">
				<img class="spzje-img" src="static/img/gou2.png">
				<span class="spzje-money" v-if="showEdit">
					商品总金额<span class="red">￥{{ Number(totalCount).toFixed(2) }}</span>
				</span>
			</div>
			<div class="white fl tc ljgm" @click="deleteOrBuyGoods($event)">{{ nowBuy }}</div>
		</div>
		<footerBox :count='3'></footerBox>
	</div>
</template>
<script>

export default {
	name: 'cart_index',
	data () {
		return {
			cartLists: [],
			operationName: '编辑',
			totalCount: '',
			showEdit: true,
			nowBuy: '立即购买',
			cart_id_str: '',
			cartIdLists: [],
			total_goods_price: '',
		}
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '购物车', })
		that.getCartList()
	},
	components: {
		footerBox: require('./footerBox').default,
	},
	methods: {
		//获取购物车列表
		getCartList () {
			let that = this
			that.c_ajax({}, 'api.php?&c=ShopCart&a=lists', function (value) {
				if (value.data.status === 10001) {
					that.cartLists = []
					for (let v of value.data.lists) {
						that.cartLists.push(v)
					}
					that.total_goods_price = value.data.total_goods_price
					that.resetList()
				} else if (value.data.status === 10003) {
					that.cartLists = []
					that.resetList()
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		//重置
		resetList () {
			let that = this, listCheckBoxs = document.getElementsByClassName('check-box-one')
			for (let i = 0; i < listCheckBoxs.length; i++) {
				listCheckBoxs[i].style.backgroundColor = '#fff'
			}
			that.$refs.allSelect.style.backgroundColor = '#fff'
			that.cartIdLists = []
			that.cart_id_str = ''
			that.totalCount = '0.00'
		},
		//点击勾选按钮 包含顶部和下面
		check (e, type, cart_id) {
			let that = this, color, listCheckBoxs = document.getElementsByClassName('check-box-one')
			color = (e.target.style.backgroundColor === 'rgb(0, 0, 0)') ? '#fff' : '#000'
			e.target.style.backgroundColor = color
			if (type === 1) {
				if (color === '#fff') {
					that.resetList()
				} else {
					for (let i = 0; i < listCheckBoxs.length; i++) {
						listCheckBoxs[i].style.backgroundColor = '#000'
					}
					that.cartIdLists = []
					for (let i = 0; i < that.cartLists.length; i++) {
						that.cartIdLists.push(that.cartLists[i].cart_id)
					}
					that.totalCount = that.total_goods_price
					that.cart_id_str = that.cartIdLists.join(',')
				}
			} else {
				this.goDealPrice(cart_id, color)
			}
		},
		//点击编辑或者完成
		operation () {
			if (this.operationName === '完成') {
				this.operationName = '编辑'
				this.showEdit = true
				this.nowBuy = '立即购买'
				this.getCartList()
			} else {
				this.operationName = '完成'
				this.showEdit = false
				this.nowBuy = '删除所选'
				this.resetList()
			}
		},
		//计算价格 请求
		goDealPrice (cart_id, type) {
			let that = this, tempArr = []
			if (type === '#000') {
				that.cartIdLists.push(cart_id)
				that.cart_id_str = that.cartIdLists.join(',')
				if (that.cartIdLists.length === that.cartLists.length) {
					that.$refs.allSelect.style.backgroundColor = '#000'
				}
			} else {
				that.$refs.allSelect.style.backgroundColor = '#fff'
				for (let i = 0; i < that.cartIdLists.length; i++) {
					if (that.cartIdLists[i] === cart_id) {
						that.cartIdLists.splice(i, 1)
					}
				}
				this.cart_id_str = that.cartIdLists.join(',')
			}
			if (that.cartIdLists.length === 0) {
				that.totalCount = '0.00'
				return
			}
			that.c_ajax({cart_id_str: that.cart_id_str}, 'api.php?c=ShopCart&a=deal_price', function (value) {
				if (value.data.status === 10001) {
					that.totalCount = value.data.detail.total_goods_price
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		subNum (e, id) {
			let dom = e.target.nextElementSibling, curCount = Number(dom.innerText)
			if (curCount === 1) {
				return
			}
			dom.innerText = curCount - 1
			this.editGoodsNumber(dom.innerText, id)
		},
		addNum (e, id) {
			let dom = e.target.previousElementSibling, curCount = Number(dom.innerText)
			dom.innerText = curCount + 1
			this.editGoodsNumber(dom.innerText, id)
		},
		//编辑数量 请求
		editGoodsNumber (num, id) {
			let that = this
			that.c_ajax({cart_id: id, num: num, }, 'api.php?&c=ShopCart&a=add', function (value) {
				if (value.data.status === 10001) {
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		//删除或者购买 请求
		deleteOrBuyGoods (e) {
			if (e.target.innerText === '立即购买') {
				if (this.cartIdLists.length === 0) {
					this.showDialog('请选择要下单的商品!')
					return
				}
				this.cart_id_str = this.cartIdLists.join(',')
				this.goCartConfirmOrder(this.cart_id_str)
			} else {
				if (this.cartIdLists.length === 0) {
					this.showDialog('请选择要删除的商品!')
					return
				}
				this.goDeleteGoods()
			}
		},
		//执行删除
		goDeleteGoods () {
			let that = this
			that.c_ajax({cart_id_str: that.cart_id_str,}, 'api.php?&c=ShopCart&a=delete', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('删除成功!')
					setTimeout(function () {
						that.getCartList()
					}, 1500)
				} else {
					that.showDialog(value.data.msg)
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
.cart_index {
	bottom: 90px;
}
.top-box {
	position: relative;
	margin-left: 15px;
	padding-left: 35px;
	margin-right: 15px;
	height: 38px;
	line-height: 38px;
}

.top-box-box {
	background-color: #fff;
}

.check-box {
	position: absolute;
	left: 0;
	top: 10px;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	border: 1px solid #747474;
	background-image: url(../../static/img/gou.png);
	background-size: 10px 7px;
	background-repeat: no-repeat;
	background-position: 3px 4px;
}
.list {
	position: relative;
	padding-top: 1px;
	padding-bottom: 1px;
	padding-left: 0;
	background-color: #fff;
}
.per-list {
	padding: 8px 16px 10px 135px;
	height: 100px;
	position: relative;
	border-bottom: 1px solid #ccc;
}
.per-list-img {
	position: absolute;
	top: 10px;
	max-width: 80px;
	max-height: 80px;
	width: 100%;
	height: 100%;
	left: 45px;
	border-radius: 5px;
	border: 1px solid #ccc;
}
.per-list-number {
	font-size: 12px;
	top: 10px;
	position: absolute;
	right:16px;
	font-size: 14px;
}
.per-list-name {
	font-size: 15px;
	padding-right: 35px;
	margin: 0;
	font-weight: 400;
}
.per-list-money {
	font-size: 14px;
	margin: 0;
}
.edit-box {
	position: absolute;
	right: 5%;
	bottom: 5%;
}
.operation-goods {
	width: 24px;
	height: 24px;
	border: 1px solid #ccc;

}
.show-num {
	width: 44px;
	height: 24px;
	border: 1px solid #ccc;
}

.check-box-one {
	position: absolute;
	top: 42px;
	left: 15px;
	width: 18px;
	height: 18px;
	line-height: 10px;
	border-radius: 50%;
	border: 1px solid #747474;
	background-image: url(../../static/img/gou.png);
	background-size: 10px 7px;
	background-repeat: no-repeat;
	background-position: 3px 4px;
}
.bottom-box {
	border-top:1px solid #ddd;
	background-color: #FEFEFF;
	padding:0;
	height: 42px;
	position: fixed;
	width: 100%;
	bottom: 50px;
}
.spzje {
	width: 66.6%;
	position: relative;
	height: 42px;
	padding: 5px 10px 5px 20px;
}
.spzje-img {
	width: 15px;
	background-color: #000;
	border-radius: 50%;
	height: 15px;
	background-size: 10px 7px;
	background-repeat: no-repeat;
	position: absolute;
	top: 13.5px;
}
.spzje-money {
	display: inline-block;
	font-size: 16px;
	margin-left: 20px;
	margin-top: 4px;
}
.ljgm {
	width: 33.3%;
	height: 42px;
	line-height: 42px;
	font-size: 16px;
	background-color: #df2a2b;
}

</style>