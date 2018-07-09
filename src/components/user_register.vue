<template>
	<div class="box user_register">
		<form name="form" id="form">
			<div class="list-box">
				<div class="per-cell">
					<span class="black fl font-size-16 tl cell-label">用户名<img class="cell-img" src="static/img/need.png"></span>
					<input class="fl gray-666 font-size-16 cell-input" type="text" placeholder="请输入用户名" v-model="username">
				</div>
				<div class="per-cell">
					<span class="black fl font-size-16 tl cell-label">手机号码<img class="cell-img" src="static/img/need.png"></span>
					<input class="fl gray-666 font-size-16 cell-input" type="text" placeholder="请输入手机号码" v-model="loginname">
				</div>
<!-- 				<div class="per-cell pos-relative">
					<span class="black fl font-size-16 tl cell-label">邮箱地址</span>
					<input class="fl gray-666 font-size-16 cell-input cell-input-3" type="text" placeholder="请输入邮箱地址" v-model="email">
					<span class="fl gray-666 font-size-16 pos-span">(选填)</span>
				</div> -->
				<div class="per-cell">
					<span class="black fl font-size-16 tl cell-label">推荐人ID</span>
					<input class="fl gray-666 font-size-16 cell-input" type="text" disabled v-model="tuijian_id">
				</div>
				<div class="per-cell">
					<span class="black fl font-size-16 tl cell-label">选择地区<img class="cell-img" src="static/img/need.png"></span>
					<select v-model="province_id" @change="getCityLists($event)" class="fl gray-666 font-size-16 cell-input-4">
						<option value="">-请选择省份-</option>
						<option :value="provinceList.id" v-for="(provinceList, i) in provinceLists" class="select-province gray-666">
							{{ provinceList.region_name }}
						</option>
					</select>
					<select v-model="city_id" class="fl gray-666 font-size-16 cell-input-4">
						<option value="">-请选择城市-</option>
						<option :value="cityList.id" v-for="(cityList, i) in cityLists" class="select-city gray-666">
							{{ cityList.region_name }}
						</option>
					</select>
				</div>
<!-- 				<div class="per-cell pos-relative">
					<span class="black fl font-size-16 tl cell-label">真实姓名</span>
					<input class="fl gray-666 font-size-16 cell-input cell-input-3" type="text" placeholder="请输入真实姓名" v-model="truename">
					<span class="fl gray-666 font-size-16 pos-span">(选填)</span>
				</div> -->
				<div class="per-cell pos-relative">
					<div @click='getCode()' class="tc white code-style">获取验证码</div>
					<span class="black fl font-size-16 tl cell-label">输入验证码<img class="cell-img" src="static/img/need.png"></span>
					<input class="fl gray-666 font-size-16 cell-input cell-input-2" placeholder="请输入验证码" type="text" v-model="code">
				</div>

			</div>
			<div>
				<span class="gray-666 font-size-16">已阅读并同意以下协议，</span><span class="dlxy" @click="openPopover()">《代理协议》</span>
			</div>
			<div @click="register()" class="next-btn font-size-18">下一步</div>
			<div class="need-style tl red font-size-14">
				<img src="static/img/need.png"> 号为必填选项
			</div>
		</form>
		<userProtocol @detect="closePopover" :can-hide="canHide" :protocol='protocol'></userProtocol>
	</div>
</template>
<script>

export default {
	name: 'user_register',
	data () {
		return {
			canHide: true,
			username: '',
			loginname: '',
			tuijian_id: '',
			// email: '',
			// truename: '',
			code: '',
			code_id: '',
			protocol: '',
			provinceLists: [],
			cityLists: [],
			province_id: '',
			city_id: '',
		}
	},
	components: {
		userProtocol: require('./userProtocol').default,
	},
	created () {
		let that = this
		that.tuijian_id = that.$route.query.parent_id
		that.c_ajax({}, 'api.php?c=User&a=is_share_grade', function (value) {
			if (value.data.status === 10001) {
				if (value.data.is_share_user === 1) {
					that.showDialog('您已经是代理，授权登录中...')
					setTimeout(function () {
						window.location.href = that.urlPrefix + 'api.php?c=WeixinLogin&a=authorize&url=' + encodeURIComponent(that.urlPrefixApp + "#/shop_index") + ''
					}, 1500)
				} else {
					that.$store.commit('updateTitleMsg', { title_msg: '代理注册', })
					that.getProvinceLists()
				}
			}
		})
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
		getCode () {
			let that = this
			if (!that.loginname) {
				that.showDialog('请输入手机号!')
				return
			}
			let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/
			if (!(reg.test(that.loginname)) || that.loginname.length !== 11) {
				that.showDialog('请输入正确的手机号!')
				return
			}
			that.c_ajax({}, 'api.php?c=Code&a=get_code&type=reg&phone=' + that.loginname, function (value) {
				if (value.data.status === 10001) {
					that.showDialog('发送成功!')
					that.code_id = value.data.code_id
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		register () {
			let that = this
			if (!that.username) {
				that.showDialog('请输入用户名!')
				return
			}
			if (!that.loginname) {
				that.showDialog('请输入手机号!')
				return
			}
			let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/
			if (!(reg.test(that.loginname)) || that.loginname.length !== 11) {
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
			if (!that.code) {
				that.showDialog('请输入验证码!')
				return
			}
			that.c_ajax({}, 'api.php?c=RegAgent&a=reg&post[username]=' + that.username + "&post[loginname]=" + that.loginname + "&post[code]=" + that.code + "&post[code_id]=" + that.code_id + "&post[city]=" + that.city_id + "&post[province]=" + that.province_id + "&post[parent_id]=" + that.tuijian_id, function (value) {
				if (value.data.status === 10001) {
					that.showDialog('注册成功!')
					setTimeout(function () {
						window.location.href = that.urlPrefix + 'api.php?c=WeixinLogin&a=authorize&url=' + encodeURIComponent(that.urlPrefixApp + "#/shop_index") + ''
					}, 1500)
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		openPopover () {
			let that = this
			that.c_ajax({}, 'api.php?c=Cms&a=agent_protocol&visit=public', function (value) {
				that.canHide = false
				that.protocol = value.data.details
			})
		},
		closePopover () {
			this.canHide = true
		},
	},
}
</script>

<style scoped>

.need-style {
	width: 80%;
	margin: 10px auto 0;
}

.need-style img {
	width: 7px;
}

.next-btn {
	background: rgb(222,42,43);
	color: #fff;
	width: 80%;
	margin: 0 auto;
	height: 50px;
	line-height: 50px;
	margin-top: 10px;
}

.dlxy {
	color: #139eff;
}

.pos-relative {
	position: relative;
}

.user_register {
	padding-top: 30px;
}

.cell-label {
	line-height: 50px;
	width: 30%;
}

.cell-input {
	width: 65%;
	outline: 0;
	border: 0;
	height: 48px;
	line-height: 48px;
	margin-left: 10px;
	background-color: #fff;
}
.cell-input-2 {
	width: 30%;
	margin-left: 10px;
}

.cell-img {
	width: 7px;
	margin-left: 5px;
	margin-bottom: 5px;
}

.list-box {
	padding-left: 15px;
	padding-right: 5px;
	margin-bottom: 10px;
	background-color: #fff;
}

.code-style {
	background-color: #FFA844;
	border: none;
	position: absolute;
	right: 2px;
	top: 10px;
	height: 30px;
	line-height: 20px;
	border-radius: 5px;
	padding: 5px;
}

.per-cell {
	height: 50px;
	background-color: #fff;
	border-bottom: 1px solid #ccc;
	overflow: hidden;
}

.cell-input-3 {
	width: 50%;
	margin-left: 10px;
}
.cell-input-4 {
	width: 25%;
	margin-left: 10px;
	height: 30px;
	margin-top: 10px;
}

.pos-span {
	position: absolute;
	right: 10px;
	top: 12px;
}

</style>