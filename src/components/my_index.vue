<template>
	<div class="my_index box">
		<div class="content-out-box">
			<div class="content-box">
				<div v-for="(myIndexList, i) in myIndexLists">
					<div class="tc personal-interview">
						<div class="personal-image">
							<img :src="myIndexList.headimgurl">
						</div>
						<img class="setting" @click="goMyMessage()">
						<p class="white personal-name">{{ myIndexList.username }}</p>
						<p class="white personal-type font-size-12">用户身份:{{ myIndexList.share_grade_title }}</p>
					</div>
					<template v-if="!share_grade_id">
						<div class="tc personal-info">
							<div class="fl white per-personal-info font-size-12 width-50per">
								<h4>{{ myIndexList.user_count.today_order }}</h4>
								今日订单
							</div>
							<div class="fl white per-personal-info font-size-12 width-50per">
								<h4>{{ myIndexList.all_points }}</h4>
								我的积分
							</div>
						</div>
					</template>
					<template v-else>
						<div class="tc personal-info">
							<div class="fl white per-personal-info font-size-12 width-25per">
								<h4>￥{{ myIndexList.user_count.today_shouyi }}</h4>
								今日盈利
							</div>
							<div @click="goMyTixian()" class="fl white font-size-12 per-personal-info width-25per">
								<h4>￥{{ myIndexList.user_count.cash }}</h4>
								可提金额
							</div>
							<div class="fl white per-personal-info font-size-12 width-25per">
								<h4>{{ myIndexList.user_count.share_user }}</h4>
								新增客户
							</div>
							<div class="fl white per-personal-info font-size-12 width-25per">
								<h4>{{ myIndexList.user_count.today_order }}</h4>
								今日订单
							</div>
						</div>
					</template>
				</div>
				<div class="tc some-func">
					<div class="fl per-func r" @click="goMyOrder()">
						<div class="box-of-content">
							<img src="static/img/order.png" />
							<div class="box-of-content-content">
								<p class="mar-top-8">my order</p>
								<p class="font-size-12">我的订单</p>
							</div>
						</div>
					</div>
					<div class="fl per-func" @click="goMyCollect()">
						<div class="box-of-content">
							<img src="static/img/my_collect.png" />
							<div class="box-of-content-content">
								<p class="mar-top-8">collection</p>
								<p class="font-size-12">我的收藏</p>
							</div>
						</div>
					</div>
					<div class="fl per-func r" @click="contactCustomer()">
						<div class="box-of-content">
							<img src="static/img/icon03.png" />
							<div class="box-of-content-content">
								<p class="mar-top-8 ellip">service</p>
								<p class="font-size-12">联系客服</p>
							</div>
						</div>
					</div>
					<div class="fl per-func" @click="goMySuggest()">
						<div class="box-of-content">
							<img src="static/img/icon04.png" />
							<div class="box-of-content-content">
								<p class="mar-top-8">feedback</p>
								<p class="font-size-12">问题反馈</p>
							</div>
						</div>
					</div>
					<div class="fl per-func r" @click="goMyHelp()">
						<div class="box-of-content">
							<img src="static/img/icon05.png" />
							<div class="box-of-content-content">
								<p class="mar-top-8">use help</p>
								<p class="font-size-12">使用帮助</p>
							</div>
						</div>
					</div>
					<template v-if="!share_grade_id">
						<div class="fl per-func" @click="goMyJifen()">
							<div class="box-of-content">
								<img src="static/img/icon09.png" />
								<div class="box-of-content-content">
									<p class="mar-top-8">integral</p>
									<p class="font-size-12">我的积分</p>
								</div>
							</div>
						</div>
					</template>
					<template v-else>
						<!-- 是商务代表 -->
						<!-- 是否可以发展会员 -->
						<template v-if="is_share_user === '1'">
							<div class="fl per-func" @click='goMyErWeiMa(1)'>
								<div class="box-of-content">
									<img src="static/img/icon06.png" />
									<div class="box-of-content-content">
										<p class="mar-top-8">member</p>
										<p class="font-size-12">发展会员</p>
									</div>
								</div>
							</div>
						</template>
						<!-- 是否可以发展代理 -->
						<template v-if="is_share === '1'">
							<div :class="{'r': is_share_user === '1'}" class="fl per-func" @click='goMyErWeiMa(2)'>
								<div class="box-of-content">
									<img src="static/img/icon11.png" />
									<div class="box-of-content-content">
										<p class="mar-top-8">agent</p>
										<p class="font-size-12">发展代理</p>
									</div>
								</div>
							</div>
						</template>
						<div :class="{'r': ((is_share_user !== '1' && is_share === '1') || (is_share_user === '1' && is_share !== '1')) }" class="fl per-func" @click="goMyTeam()">
							<div class="box-of-content">
								<img src="static/img/icon10.png" />
								<div class="box-of-content-content">
									<p class="mar-top-8">team</p>
									<p class="font-size-12">我的客户</p>
								</div>
							</div>
						</div>
						<div :class="{'r': ((is_share_user === '1' && is_share === '1') || (is_share_user === '0' && is_share === '0')) }" class="fl per-func" @click="goMyBusinessLists()">
							<div class="box-of-content">
								<img src="static/img/icon12.png" />
								<div class="box-of-content-content">
									<p class="mar-top-8">statistics</p>
									<p class="font-size-12">业务统计</p>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
		<!-- 联系客服弹出框 -->
		<div class="dialog-box" :class="{'show-dialog-box': dialog}">
			<p class="call-number red font-size-20">{{ callPhone }}</p>
			<div @click="getTelNumber()" class="white tc btn-call">点击拨打</div>
			<div class="cancel-call" @click="close">取消</div>
		</div>
		<footerBox :count='4'></footerBox>
	</div>
</template>
<script>

export default {
	name: 'my_index',
	data () {
		return {
			dialog: false,
			callPhone: '',
			myIndexLists: [],
			share_grade_id: '',
			is_share: '',
			is_share_user: '',
		}
	},
	components: {
		footerBox: require('./footerBox').default,
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '我的', })
		that.c_ajax({}, 'api.php?c=User&a=detail', function (value) {
			that.myIndexLists.push(value.data.detail)
			if (value.data.detail.user_info) {
				that.myIndexLists[0].headimgurl = value.data.detail.user_info.defined_headimg
			} else if (value.data.detail.headimgurl) {
				that.myIndexLists[0].headimgurl = value.data.detail.headimgurl
			}
			that.share_grade_id = that.myIndexLists[0].share_grade_id
			that.is_share = that.myIndexLists[0].is_share
			that.is_share_user = that.myIndexLists[0].is_share_user
		})
		that.c_ajax({}, 'api.php?c=ShopConfig&a=detail', function (value) {
			if (value.data.status === 10001) {
				that.callPhone = value.data.details.phone
			}
		})
	},
	methods: {
		open () {
			this.dialog = true
		},
		close () {
			this.dialog = false
		},
		contactCustomer () {
			this.dialog = true
		},
		getTelNumber () {
			window.location.href = 'tel://' + this.callPhone
		},
	},
	mounted () {
		this.getShare()
	},
}
</script>

<style scoped>

.box-of-content-content {
	position: absolute;
	right: 0;
	top: 0;
}

.box-of-content {
	width: 90px;
	margin: 0 auto;
	position: relative;
	height: 59px;
}

.b {
	border-bottom: 1px solid #666;
}
.r {
	border-right: 1px solid #666;
}

.my_index {
	width: 100%;
	position: absolute;
	top: 43px;
	bottom: 50px;
}

.content-out-box {
	background-image: url(../../static/img/my_bg_new2.png);
	background-position: center;
	background-size: cover;
	background-attachment: fixed;
	position: absolute;
	width: 100%;
	top: 0;
	bottom: -50px;
	overflow-y: scroll;
}

.content-box {
	margin-bottom: 100px;
}

/*个人介绍*/
.personal-interview {
	width: 100%;
	position: relative;
	margin-bottom: 10px;
}

.personal-image {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border: 1px solid #fff;
	margin: 50px auto 0;
	overflow: hidden;
	background: #fff;
}

.personal-image img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.setting {
	position: absolute;
	width: 20px;
	height: 20px;
	background-color: #fff;
	background-size: 100%;
	border-radius: 50%;
	border: 2px solid #fff;
	top: 60px;
	right: 155px;
	background-image: url(../../static/img/setting.png);
}
.personal-name {
	margin: 10px 0 5px 0;
	width: 100%;
}
.personal-type {
	width: 100%;
	margin-top: 0;
}
.personal-info {
	padding: 8px 5px 5px;
	height:52px;
}

.per-personal-info {
	height: 100%;
}

.per-personal-info h4 {
	margin: 0;
}

/*下面功能*/
.some-func {
	width: 100%;
	border-top: 1px solid #666;
	padding: 0 30px;
	overflow: hidden;
}

.per-func {
	width: 49%;
	padding: 5px;
	height: 70px;
	color: #797979;
	position: relative;
	border-bottom: 1px solid #666;
}

.per-func img {
	position: absolute;
	left: 0px;
	top: 18px;
	height: 24px;
	width: 24px;
}

.mar-top-8 {
	margin-top: 8px;
}

.btn-call {
	width: 80%;
	margin: 0 auto;
	height: 40px;
	background-color: #ff0000;
	line-height: 40px;
	border-radius: 5px;
}

.call-number {
	margin-top: 10px;
	margin-bottom: 10px;
}

.dialog-box {
	position: fixed;
	margin-top: -50px;
	top: 50%;
	left: 10%;
	width: 80%;
	height: 100px;
	display: none;
	background-color: rgba(255,255,255,0.8);
}

.show-dialog-box {
	display: block;
}

.cancel-call {
	position: absolute;
	right: 5px;
	top: 5px;
}

</style>