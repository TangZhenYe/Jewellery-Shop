<template>
	<div class="box cart_newAddress">
		<div class="list">
			<div class="per-list">
				<span class="tl fl text-style">姓名</span>
				<input placeholder="请输入姓名" v-model="name" type="text" class="width-150 fr tr input-style" name="">
			</div>
			<div class="per-list">
				<span class="tl fl text-style">手机号码</span>
				<input placeholder="请输入手机号" v-model='phone' type="text" class="width-150 fr tr input-style">
			</div>
			<div class="per-list">
				<span class="tl fl text-style">省份</span>
				<select v-model="province_id" @change="getCityLists($event)" class="fr tr input-style pad">
					<option value="">-请选择-</option>
					<option :value="provinceList.id" v-for="(provinceList, i) in provinceLists" class="select-province gray-666">
						{{ provinceList.region_name }}
					</option>
				</select>
			</div>
			<div class="per-list">
				<span class="tl fl text-style">城市</span>
				<select v-model="city_id" class="fr tr input-style pad" @change="getAreaLists($event)">
					<option value="">-请选择-</option>
					<option :value="cityList.id" v-for="(cityList, i) in cityLists" class="select-city gray-666">
						{{ cityList.region_name }}
					</option>
				</select>
			</div>
			<div class="per-list">
				<span class="tl fl text-style">区</span>
				<select v-model="area_id" class="fr tr input-style pad">
					<option value="">-请选择-</option>
					<option :value="areaList.id" v-for="(areaList, i) in areaLists" class="select-area gray-666">
						{{ areaList.region_name }}
					</option>
				</select>
			</div>
			<div class="per-list">
				<span class="tl fl text-style">详细地址</span>
				<input placeholder="请输入详细地址" v-model='address' type="text" class="fr ellip tr input-style">
			</div>
			<label :class="{'check-picture': checkPicture}" @click='defaultAddress()' class="default-address">设为默认地址</label>
		</div>

		<div @click="saveAddress()" class="white tc bottom-box">
			保存
		</div>
	</div>
</template>
<script>

export default {
	name: 'cart_newAddress',
	data () {
		return {
			phone: '',
			name: '',
			provinceLists: [],
			cityLists: [],
			areaLists: [],
			province_id: '',
			city_id: '',
			area_id: '',
			address: '',
			checkPicture: false,
			address_id: '',
			is_receive: '',
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '新建地址', })
		that.is_receive = this.$route.query.is_receive
		that.getProvinceLists()
	},
	methods: {
		getProvinceLists () {
			let that = this
			that.c_ajax({parent_id: 1}, 'api.php?c=Region&a=lists', function (value) {
				that.provinceLists = []
				for (let v of value.data.lists) {
					that.provinceLists.push(v)
				}
				that.cityLists = ''
				that.areaLists = ''
				that.city_id = ''
				that.area_id = ''
			})
		},
		getCityLists () {
			let that = this
			that.c_ajax({parent_id: that.province_id}, 'api.php?c=Region&a=lists', function (value) {
				that.cityLists = []
				for (let v of value.data.lists) {
					that.cityLists.push(v)
				}
				that.areaLists = ''
				that.area_id = ''
				that.city_id = ''
			})
		},
		getAreaLists () {
			let that = this
			that.c_ajax({parent_id: that.city_id}, 'api.php?c=Region&a=lists', function (value) {
				that.areaLists = []
				for (let v of value.data.lists) {
					that.areaLists.push(v)
				}
			})
		},
		defaultAddress () {
			this.checkPicture = !this.checkPicture
		},
		saveAddress () {
			let that = this
			if (that.name === '') {
				that.showDialog('请填写姓名!')
				return
			}
			if (that.phone === '') {
				that.showDialog('请填写手机号码!')
				return
			}
			let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/
			if (!(reg.test(that.phone)) || that.phone.length !== 11) {
				that.showDialog('请输入正确的手机号!')
				return
			}
			if (!that.province_id) {
				that.showDialog('请选择省份!')
				return
			}
			if (!that.city_id) {
				that.showDialog('请选择城市!')
				return
			}
			if (that.address === '') {
				that.showDialog('请填写详细地址!')
				return
			}
			let post = {
				name: that.name,
				phone: that.phone,
				province: that.province_id,
				city: that.city_id,
				area: that.area_id,
				details_site: that.address,
				type: (that.checkPicture) ? '1' : '0',
				is_receive: that.is_receive,
			}
			that.c_ajax({post: post}, 'api.php?c=UserAddress&a=add', function (value) {
				if (value.data.status === 10001) {
					that.setLocalObj('addressList_' + value.data.id, { provinceLists: that.provinceLists, cityLists: that.cityLists, areaLists: that.areaLists, })
					that.showDialog('添加成功!')
					setTimeout(function () {
						that.goBack()
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

.cart_newAddress {
	bottom: 44px;
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

.list {
	width: 100%;
	height: 328px;
	padding: 5px 10px 0 10px;
	background-color: #fff;
}

.per-list {
	width: 100%;
	padding: 6px 0 5px 5px;
	height: 47px;
	border-bottom: 1px solid #ccc;
}

.text-style {
	font-size: 15px;
	line-height: 35px;
	color: #666;
}

.input-style {
	font-size: 15px; 
	padding-right: 10px;
	height: 35px;
	outline: 0;
	border: none;
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
.width-150 {
	width: 150px;
}

.pad {
	padding: 0;
}
</style>