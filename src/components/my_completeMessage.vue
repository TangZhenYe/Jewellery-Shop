<template>
	<div class="box my_completeMessage">
		<headerBox :title-msg='titleMsg'></headerBox>
		<div class="complete-list">
			<div class="per-list">
				<span class="tl fl text-style">用户名</span>
				<input  placeholder="请输入姓名" v-model="name" type="text" class="width-150 fr tr input-style" name="">
			</div>
			<div class="per-list">
				<span class="tl fl text-style">手机号</span>
				<input  placeholder="请输入手机号" v-model='phone' type="text" class="width-150 fr tr input-style">
			</div>
			<div class="per-list">
				<span class="tl fl text-style">身份证号码</span>
				<input  placeholder="请输入身份证号码" v-model='code' type="text" class="width-150 fr tr input-style">
			</div>
		</div>
		<div @click="completeMessage()" class="white tc bottom-box">
			完成
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_completeMessage',
	data () {
		return {
			name: '',
			phone: '',
			code: '',
			titleMsg: '完善账户资料',
		}
	},
	created () {
		let that = this
	},
	components: {
		headerBox: require('./headerBox').default,
	},
	methods: {
		completeMessage () {
			let that = this
			if (!that.name) {
				that.showDialog('请输入用户名!')
				return
			}
			if (!that.phone) {
				that.showDialog('请输入手机号!')
				return
			}
			let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/
			if (!(reg.test(that.phone)) || that.phone.length !== 11) {
				that.showDialog('请输入正确的手机号!')
				return
			}
			if (!that.code) {
				that.showDialog('请填写身份证号!')
				return
			}
			let reg2 = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/
			if (!(reg2.test(that.code))) {
				that.showDialog('请输入有效的身份证号!')
				return
			}
			let post = {
				truename: that.name,
				phone: that.phone,
				shenfenzheng: that.code,
			}
			that.c_ajax({post: post}, 'api.php?&c=ShareAccount&a=share_user_info', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('已完成!')
					setTimeout(function () {
						that.goBack()
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
.my_completeMessage {
	bottom: 42px;
}

.complete-list {
	width: 100%;
	height: auto;
	background-color: #fff;
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
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: rgb(223, 44, 45);
	height: 42px;
	width: 100%;
	font-size: 17px;
	line-height: 42px;
}
</style>