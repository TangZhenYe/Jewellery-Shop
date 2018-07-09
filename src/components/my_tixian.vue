<template>
	<div class="box my_tixian">
		<div class="white-b top-box gray-999 font-size-14">
			<div @click="selectTab(i)" :class="{'black': selectI === i}" class="tc fl width-33per" v-for="(tab, i) in tabs">
				{{ tab }}
			</div>
		</div>
		<!--提现-->
		<div v-if="selectI === 0">
			<div class="show-tixian-box white tc">
				<p class="font-size-16 tc">可提现金(元)</p>
				<div class="white tc font-size-42">{{ cash }}</div>
			</div>
			<div style="background-color: #fff;">
				<div @click="tixianAdd()" class="tl weixin-tixian-box font-size-15 gray-666">
					<img class="fl tixian-type-icon" src="static/img/weixin.png"/>
					<span class="mar-lef-30">微信提现</span>
					<img class="arrow-right-icon" src="static/img/arrow_right.png">
				</div>
				<div v-if="!is_share_info" @click="goMyCompleteMessage()" class="tl weixin-tixian-box font-size-15 gray-666">
					<img class="fl tixian-type-icon" src="static/img/ziliao.png"/>
					<span class="mar-lef-30">完善账号资料</span>
					<img class="arrow-right-icon" src="static/img/arrow_right.png">
				</div>
			</div>
		</div>
		<!--现金明细-->
		<div v-if="selectI === 1">
			<div style="overflow: hidden;">
				<div class="fl width-33per font-size-14 black table-header">时间</div>
				<div class="fl width-33per font-size-14 black table-header">订单号</div>
				<div class="fl width-33per font-size-14 black table-header">金额</div>
			</div>
			<div class="white-b" style="overflow: hidden;">
				<template v-for="(xianJinDetailt, i) in xianJinDetail">
					<div class="fl table-header font-size-14 ellip width-33per">
						{{ xianJinDetailt.addtime }}
					</div>
					<div class="fl table-header font-size-14 ellip width-33per">
						{{ xianJinDetailt.order_sn }}
					</div>
					<div class="fl table-header font-size-14 ellip width-33per">
						{{ xianJinDetailt.amount }}
					</div>
				</template>
			</div>
		</div>
		<!--提现明细-->
		<div v-if="selectI === 2">
			<div style="overflow: hidden;">
				<div class="fl width-25per font-size-14 black table-header">时间</div>
				<div class="fl width-25per font-size-14 black table-header">到账金额</div>
				<div class="fl width-25per font-size-14 black table-header">税金</div>
				<div class="fl width-25per font-size-14 black table-header">状态</div>
			</div>
			<div class="white-b" style="overflow: hidden;">
				<template v-for="(tiXianDetailt, i) in tiXianDetail">
					<div class="fl table-header font-size-14 ellip width-25per">
						{{ tiXianDetailt.addtime }}
					</div>
					<div class="fl table-header font-size-14 ellip width-25per">
						{{ tiXianDetailt.tixian_cash }}
					</div>
					<div class="fl table-header font-size-14 ellip width-25per">
						{{ tiXianDetailt.tixian_sui }}
					</div>
					<div class="fl table-header font-size-14 ellip width-25per">
						<span v-if="tiXianDetailt.status === 0">申请中</span>
						<span v-if="tiXianDetailt.status === 1">通过</span>
						<span v-if="tiXianDetailt.status !== 0 && tiXianDetailt.status !== 1">失败</span>
					</div>
				</template>
			</div>
		</div>
		<!--提现窗口-->
		<div class="tixian-window" v-if="tixianWindow && selectI === 0">
			<span @click="tixianCancel()" class="cancel-tixian">取消</span>
			<div class="list">
				<div class="per-list black">
					<span class="tl fl text-style">申请金额（元）</span>
					<input @change="getTax()" type="text" v-model="money.amount" class="width-150 fr tr input-style" :placeholder="'可以提现 ' + cash + '元'"/>
				</div>
				<div class="per-list black">
					<span class="tl fl text-style">到账金额（元）</span>
					<span class="width-150 fr tr input-style">{{ my_cash }}</span>
				</div>
				<div class="per-list black">
					<span class="tl fl text-style text-style-t">您需要缴纳个人所得税金为&nbsp;{{ tax }}&nbsp;元,我们依法代扣代缴</span>
				</div>
			</div>
			<div @click="tixian()" class="linear white tc sub">提交</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_tixian',
	data () {
		return {
			selectI: 0,
			tabs: ['提现', '现金明细', '提现明细'],
			tiXianDetail: [],
			xianJinDetail: [],
			is_share_info: '',
			cash: '',
			tixianWindow: false,
			money: {
				amount:'',
			},
			tax: 0,
			my_cash: '',
		}
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '提现', })
		// 提现
		that.c_ajax({}, 'api.php?c=ShareIndex&a=index', function (value) {
			if (value.data.status === 10001) {
				that.cash = value.data.detail.cash
			}
		})
		// 判断是否需要完善资料
		that.c_ajax({}, 'api.php?c=ShareAccount&a=is_share_info', function (value) {
			if (value.data.status === 10001) {
				that.is_share_info = true
			} else if (value.data.status === 20001) {
				that.is_share_info = false
			}
		})
    // 现金明细
    that.c_ajax({}, 'api.php?&c=ShareAccount&a=share_lists', function (value) {
    	if (value.data.status === 10001) {
    		if (value.data.lists) {
    			for (let v of value.data.lists) {
    				that.xianJinDetail.push({
    					addtime: that.timestampToTime(v.addtime),
    					order_sn: v.order_sn,
    					amount: v.amount,
    				})
    			}
    		}
    	}
    })
		// 提现明细
		that.c_ajax({}, 'api.php?&c=ShareAccount&a=tixian_lists', function (value) {
			if (value.data.status === 10001) {
				if (value.data.lists) {
					for (let v of value.data.lists) {
						that.tiXianDetail.push({
							addtime: that.timestampToTime(v.addtime),
							tixian_cash: v.tixian_cash,
							tixian_sui: v.tixian_sui,
							status: v.status,
						})
					}
				}
			}
		})
	},
	methods: {
		selectTab (i) {
			this.selectI = i
		},
		tixianAdd () {
			let that = this
			if (!that.is_share_info) {
				that.showDialog('请先完善账户资料!')
				return
			}
			that.tixianWindow = true
		},
		tixianCancel () {
			this.tixianWindow = false
		},
		getTax () {
			let that = this
			that.tax = parseFloat(that.money.amount * 0.2).toFixed(2)
			that.my_cash = parseFloat(that.money.amount - that.tax).toFixed(2)
		},
		tixian () {
			let that = this
			if (!that.money.amount) {
				that.showDialog('请输入提现金额!')
				return
			}
			if (that.money.amount < 10) {
				that.showDialog('提现金额不能低于10元!')
				return
			}
			if (that.money.amount > 2000) {
				that.showDialog('提现金额不能高于2000元!')
				return
			}
			let post = {
				account: '微信钱包',
				amount: that.money.amount,
			}
			that.c_ajax({post: post}, 'api.php?c=ShareAccount&a=add', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('提现成功!')
					that.tixianCancel()
				} else {
					that.showDialog('提现失败!')
				}
			})
		},
	},
}
</script>

<style scoped>
.my_tixian {
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}
.top-box {
	overflow: hidden;
	height: 38px;
	line-height: 38px;
	border-bottom: 1px solid #ddd;
}
.show-tixian-box {
	height: 160px;
	background-color: rgb(222,42,43);
	padding-top: 50px;
}
.weixin-tixian-box {
	height: 50px;
	line-height: 20px;
	border-bottom: 1px solid #f6f7fe;
	padding: 15px 0;
	margin: 0 15px;
	position: relative;
}
.tixian-type-icon {
	width: 20px;
	position: absolute;
	left: 0;
	top: 15px;
	height: 20px;
}
.arrow-right-icon {
	width: 20px;
	height: 20px;
	position: absolute;
	right: 0;
	top: 15px;
}
.table-header {
	padding: 8px 5px;
	overflow: hidden;
}
.tixian-window {
	position: fixed;
	width: 100%;
	top: 241px;
	height: 230px;
	border: 1px solid #ddd;
	background-color: #fff;
}
.cancel-tixian {
	position: absolute;
	right: 5px;
	height: 30px;
	line-height: 30px;
	display: inline-block;
	border-bottom: 1px solid #ccc;
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
}
.text-style-t {
	font-size: 13px;
}
.input-style {
	font-size: 15px;
	height: 35px;
	outline: 0;
	border: none;
}
.list {
	width: 100%;
	height: auto;
	background-color: #fff;
	margin-top: 30px;
}

.sub {
	line-height: 40px;
	height: 40px;
	font-size: 16px;
	width: 80%;
	margin: 10px auto 0;
}

</style> 