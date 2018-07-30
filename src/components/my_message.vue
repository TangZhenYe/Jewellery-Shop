<template>
	<div class="box my_message">
		<div class="list">
			<div class="per-list-first">
				<span class="fl touxiang">头像</span>
				<form id="imageUploadForm" ref='uploadPictureForm'>
					<img class="user-img-style" :src="headimgurl">
					<input class="user-img-input" name="myfile" type="file" accept="image/*" @change="uploadPicture">
				</form>
			</div>
			<div class="per-list">
				<span class="tl fl text-style">用户名</span>
				<input  placeholder="请输入姓名" v-model="username" type="text" class="width-150 fr tr input-style" name="">
			</div>
			<div class="per-list">
				<span class="tl fl text-style">手机号</span>
				<input  placeholder="请输入手机号" v-model='phone' type="text" class="width-150 fr tr input-style">
			</div>
			<div class="per-list">
				<span class="tl fl text-style">邮箱地址</span>
				<input  placeholder="请输入邮箱地址" v-model='emailAddress' type="text" class="width-150 fr tr input-style">
			</div>
			<div class="per-list">
				<span class="tl fl text-style">性别</span>
				<select v-model='sex' ref='sex' class="fr tr input-style pad">
					<option value="">-请选择-</option>
					<option value="1" class="select-sex gray-666">男</option>
					<option value="2" class="select-sex gray-666">女</option>
				</select>
			</div>
			<!-- 省份 -->
			<div class="per-list">
				<span class="tl fl text-style">省份</span>
				<select v-model="province_id" @change="getCityLists($event)" class="fr tr input-style pad">
					<option value="">-请选择-</option>
					<option :value="provinceList.id" v-for="(provinceList, i) in provinceLists" class="select-province gray-666">
						{{ provinceList.region_name }}
					</option>
				</select>
			</div>
			<!-- 城市 -->
			<div class="per-list">
				<span class="tl fl text-style">城市</span>
				<select v-model="city_id" class="fr tr input-style pad" @change="getAreaLists($event)">
					<option value="">-请选择-</option>
					<option :value="cityList.id" v-for="(cityList, i) in cityLists" class="select-city gray-666">
						{{ cityList.region_name }}
					</option>
				</select>
			</div>
			<!-- 区 -->
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
				<input placeholder="请输入详细地址" v-model='address' type="text" class="fr tr input-style ellip">
			</div>
		</div>
		<div @click="saveUserInfo()" class="bottom-box tc white red-b">修改完成</div>
	</div>
</template>
<script>

export default {
	name: 'my_message',
	data () {
		return {
			username: '',
			phone:'',
			emailAddress: '',
			address: '',
			province_id: '',
			city_id: '',
			area_id: '',
			provinceLists: [],
			cityLists: [],
			areaLists: [],
			headimgurl: '',
			sex: '',
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '个人资料', })
		if (!that.getLocalObj('provinceLists')) {
			that.getProvinceLists()
		} else {
			that.provinceLists = that.getLocalObj('provinceLists')
		}
	},
	mounted () {
		this.getShare()
		let that = this
		that.c_ajax({}, 'api.php?c=User&a=detail', function (value) {
			if (value.data.status === 10001) {
				if (value.data.detail.user_info) {
					that.headimgurl = value.data.detail.user_info.defined_headimg
				} else {
					that.headimgurl = value.data.detail.headimgurl
				}
				that.username = value.data.detail.username
				that.phone = value.data.detail.phone
				that.emailAddress = value.data.detail.email
				that.province_id = value.data.detail.province
				that.sex = value.data.detail.sex
				if (!that.getLocalObj('cityLists')) {
					that.getCityLists(that.province_id)
				} else {
					that.cityLists = that.getLocalObj('cityLists')
				}
				that.city_id = value.data.detail.city
				setTimeout(function() {
					if (!that.getLocalObj('areaLists')) {
						that.getAreaLists(that.city_id)
					} else {
						that.areaLists = that.getLocalObj('areaLists')
					}
					that.area_id = value.data.detail.area
				}, 200)
				that.address = value.data.detail.user_info.address
			}
		})
	},
	methods: {
		uploadPicture (e) {
			let fd = new FormData(), file = e.target.files[0], that = this
			if (file.size >= 2000*1024) {
				that.showDialog('图片不能大于2M，请重新上传')
				that.$refs.uploadPictureForm[0].reset()
				return
			}
			fd.append('myfile', file)
			this.$ajax.post(this.urlPrefix + 'api.php?c=Plus&a=upload_img&token=' + this.$store.state.token, fd)
			.then(function (value) {
				that.headimgurl = that.urlPrefix + value.data.img_thumb
				that.$refs.uploadPictureForm.reset()
			})
		},
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
		saveUserInfo () {
			let that = this
			if (that.name === '') {
				that.showDialog('请填写用户名!')
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
			reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
			if (!(reg.test(that.emailAddress))) {
				that.showDialog('请输入正确的邮箱地址!')
				return
			}
			if (!that.sex) {
				that.showDialog('请选择性别!')
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
				username: that.username,
				phone: that.phone,
				province: that.province_id,
				city: that.city_id,
				area: that.area_id,
				email: that.emailAddress,
				address: that.address,
				sex: that.sex,
				headimgurl: that.headimgurl,
			}
			that.c_ajax({post: post}, 'api.php?c=User&a=update', function (value) {
				if (value.data.status === 10001) {
					that.setLocalObj('provinceLists', that.provinceLists)
					that.setLocalObj('cityLists', that.cityLists)
					that.setLocalObj('areaLists', that.areaLists)
					that.showDialog('修改成功!')
					setTimeout(function () {
						that.goBack()
					}, 1500)
				}
			})
		},
	},
}
</script>

<style scoped>
.my_message {
	bottom: 44px;
}

.list {
	width: 100%;
	height: auto;
	background-color: #fff;
}

.touxiang {
	display: block;
	height: 84px;
	line-height: 84px;
}

.user-img-style {
	position: absolute;
	width: 60px;
	height: 60px; 
	right: 16px;
	top: 12px;
	z-index: 9;
	border-radius: 50%;
}

.user-img-input {
	width: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	position: absolute;
	z-index: 90;
	opacity:0;
}

.per-list-first {
	width: 100%;
	height: 85px;
	font-size: 16px;
	border-bottom: 1px solid #ccc;
	position: relative;
	padding: 0 16px;
}

.per-list {
	width: 100%;
	padding: 6px 16px;
	height: 47px;
	border-bottom: 1px solid #ccc;
}

.text-style {
	font-size: 16px;
	line-height: 35px;
	color: #666;
}

.input-style {
	font-size: 15px;
	height: 35px;
	outline: 0;
	border: none;
}

.bottom-box {
	font-size: 16px;
	height: 42px;
	line-height: 42px;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}

</style>