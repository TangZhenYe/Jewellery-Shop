<template>
	<div class="box my_suggest">
		<headerBox :title-msg="titleMsg"></headerBox>
		<div class="text-area-box">
			<textarea v-model="textAreaValue" placeholder="请填写反馈意见....."></textarea>
		</div>
		<div @click="submitSuggest" class="tb red-b white footer-box">提交反馈</div>
	</div>
</template>
<script>
export default {
	name: 'my_suggest',
	data () {
		return {
			textAreaValue: '',
			titleMsg: '问题反馈',
		}
	},
	created () {
		let that = this
	},
	components: {
		headerBox: require('./headerBox').default,
	},
	methods: {
		submitSuggest () {
			let that = this
			if (this.textAreaValue === '') {
				that.showDialog('请填写反馈意见!')
				return
			}
			that.c_ajax({content: that.textAreaValue}, 'api.php?c=User&a=add_suggest', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('已提交!')
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
.my_suggest {
	bottom: 44px;
}
.text-area-box {
	width: 100%;
	height: 165px;
	padding: 10px 15px 15px 15px;
	background-color: #fff;
}
.text-area-box textarea {
	height: 150px;
	width: 100%;
	resize: none;
	font-size: 15px;
	border: 0;
	outline: none;
}
.footer-box {
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	height: 44px;
	line-height: 44px;
	font-weight: bold;
	font-size: 16px;
}
</style>