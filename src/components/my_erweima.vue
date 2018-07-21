<template>
	<div class="box my_erweima">
		<div v-for="list in lists">
			<div class="big-box">
				<div class="info-box">
					<div class="tl info-message">
						<img :src="list.share_detail.headimgurl">
						{{ list.share_detail.username }}
					</div>
				</div>
				<div class="erweima-box">
					<img v-if="type === 1" src="static/img/sao_quan.jpg" width="300">
					<img v-if="type === 2" src="static/img/sao_quan_2.jpg" width="300">
					<div class="erweima">
						<qrcode :value="erweimaSrc" :options="{ size: 120 }"></qrcode>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

import VueQrcode from '@xkeshi/vue-qrcode'

export default {
	name: 'my_erweima',
	data () {
		return {
			lists: [],
			type: '',
			erweimaSrc: '',
			user_id: '',
		}
	},
	components: {
		qrcode: VueQrcode,
	},
	created () {
		let that = this
		this.type = this.$route.query.type
		if (that.type === 1) {
			that.$store.commit('updateTitleMsg', { title_msg: '会员二维码', })
		}
		if (that.type === 2) {
			that.$store.commit('updateTitleMsg', { title_msg: '招代理二维码', })
		}
		that.c_ajax({}, 'api.php?c=ShareUser&a=team_lists', function (value) {
			if (value.data.status === 10001) {
				that.lists.push(value.data)
				if ((value.data.share_detail.headimgurl).substr(0, 1) === 'h') {
					that.lists[0].share_detail.headimgurl = value.data.share_detail.headimgurl
				} else {
					that.lists[0].share_detail.headimgurl = that.urlPrefix + value.data.share_detail.headimgurl
				}
				that.user_id = value.data.share_detail.user_id
				
				let str_dai = that.urlPrefix + 'api.php?c=WeixinLogin&a=authorize&url=' + encodeURIComponent(that.urlPrefixApp + "#/user_register?parent_id=" + that.user_id) + ''

				let str_hui = that.urlPrefix + 'api.php?c=WeixinLogin&a=authorize&url=' + encodeURIComponent(that.urlPrefixApp + "#/shop_index?parent_id=" + that.user_id) + '&parent_id=' + that.user_id + ''

				if (that.type === 1) {
					that.erweimaSrc = str_hui
				}
				if (that.type === 2) {
					that.erweimaSrc = str_dai
				}
			}
		})
	},
	mounted () {
		this.getShare()
	},
}
</script>

<style scoped>
.my_erweima {
}
.big-box {
	margin: 10px;
	background-color: #fff;
	border-radius: 10px;
}
.info-box {
	padding: 10px;
}
.info-message {
	padding: 16px 16px 40px 86px;
	height: 80px;
	position: relative;
	font-size: 16px;
}

.erweima-box{
	position: relative;
	padding-bottom: 10px;
}

.info-message img {
	height: 60px;
	width: 60px;
	border-radius: 50%;
	position: absolute;
	left: 10px;
	top: 10px;
}

.sao-dai-or-hui {
	width: 232px;
	margin: 0 auto;
	height: 75px;
}
.sao-dai-or-hui img {
	width: 100%;
	height: 100%;
}

.sao {
	width: 300px;
	height: 300px;
	margin: 0 auto;
}

.sao img {
	width: 100%;
	height: 100%;
}

.erweima {
	position: absolute;
	left: 50%;
	margin-left: -70px;
	top: 212px;
	width: 140px;
	height: 140px;
}

</style>