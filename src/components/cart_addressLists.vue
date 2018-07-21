<template>
	<div>
		<div class="cart_addressLists">
			<div class="list">
				<div :id="addressList.id" class="per-list" v-for="(addressList, i) in addressLists" @click='changeDefault(addressList.id)'>
					<div class="per-list-box">
						<p class="per-list-info">
							<span class="fr">{{ addressList.phone }}</span>
							<span class="fl">收货人：{{ addressList.name }}</span>
						</p>
						<p class="fl per-list-address">
							{{ addressList.address }}
						</p>
					</div>
					<div class="operation">
						<div class="tl fl width-50per">
							<label :class="{'check-picture': Number(addressList.type) === 1 }" class="default-address">设为默认地址</label>
						</div>
						<div class="fl width-50per">
							<span class="edit-delete-btn" @click.stop="deleteAddress(addressList.id)">删除</span>
							<span class="edit-delete-btn" @click.stop='goCartEditAddress(addressList.is_receive, addressList.id)'>编辑</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div @click="goCartNewAddress(1)" class="white tc bottom-box">
			新增收货地址
		</div>
	</div>
</template>
<script>

export default {
	name: 'cart_addressLists',
	data () {
		return {
			addressLists: [],
			is_receive: '',
		}
	},
	components: {
	},
	mounted () {
		this.getShare()
	},
	created () {
		this.$store.commit('updateTitleMsg', { title_msg: '地址管理', })
		this.is_receive = this.$route.query.is_receive
		this.getAddressList(this.is_receive)
	},
	methods: {
		changeDefault (addressList_id) {
			let that = this, post
			for (let v of that.addressLists) {
				if (v.id === addressList_id) {
					post = {
						name: v.name,
						phone: v.phone,
						province: v.province,
						city: v.city,
						area: v.area,
						details_site: v.details_site,
						type: '1',
						address_id: addressList_id,
						is_receive: that.is_receive,
					}
				}
			}
			that.c_ajax({post: post, }, 'api.php?c=UserAddress&a=add', function (value) {
				if (value.data.status === 10001) {
					that.setLocalObj('addressList_' + that.address_id, { provinceLists: that.provinceLists, cityLists: that.cityLists, areaLists: that.areaLists, })
					that.goBack()
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		getAddressList (is_receive) {
			let that = this
			that.c_ajax({is_receive: is_receive}, 'api.php?c=UserAddress&a=lists', function (value) {
				if (value.data.status === 10001) {
					that.addressLists = []
					for (let v of value.data.lists) {
						that.addressLists.push(v)
					}
				} else if (value.data.status === 10003) {
					that.addressLists = []
				}
			})
		},
		deleteAddress (id) {
			let that = this
			that.c_ajax({address_id: id, }, 'api.php?c=UserAddress&a=delete', function (value) {
				if (value.data.status === 10001) {
					localStorage.removeItem('addressList_' + id)
					that.showDialog('删除成功!')
					setTimeout(function () {
						that.getAddressList(that.is_receive)
					}, 1500)
				}
			})
		},
	},
}
</script>

<style scoped>

.cart_addressLists {
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

.per-list {
	border: none;
	margin-top: 10px;
	white-space: normal;
	overflow: auto;
	text-overflow: clip; 
	padding: 16px 0px 0px;
	background-color: #fff;
}

.per-list-info {
	font-size: 15px;
	color: #000;
	margin-bottom: 5px;
	padding: 0 16px;
	overflow: hidden;
}

.per-list-address {
	white-space: normal;
	overflow: auto;
	text-overflow: clip;
	padding: 0 16px;
	margin-bottom: 6px;
}

.bottom-box {
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: rgb(223, 44, 45);
	height: 42px;
	width: 100%;
	font-size: 17px;
	line-height: 42px;
}

.operation {
	padding: 5px 16px;
	border-top: 1px dashed #ddd;
	overflow: hidden;
}

.per-list-box {
	overflow: hidden;
}

.default-address {
	padding: 10px 25px;
	cursor: pointer;
	background: url(../../static/img/no_check.png) no-repeat;
	background-position: 0px 13px;
	background-size: 15px;
	line-height: 37px;
	font-size: 15px;
}

.check-picture {
	background: url(../../static/img/check.png) no-repeat;
	background-position: 0px 13px;
	background-size: 15px;
}

.edit-delete-btn {
	display: inline-block;
	font-size: 15px;
	text-align: center;
	border: 1px solid #ddd;
	border-radius: 5px;
	width: 40%;
	line-height: 35px;
	height: 35px;
	color: #999;
	float: right;
	margin-left: 10px;
}


</style>