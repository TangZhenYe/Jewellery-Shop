<template>
	<div class="box my_jifen">
		<div class="top-box">
			<div class="top-title-box">
				<div class="jifen-t white tc">我的积分</div>
				<div class="jifen-c white tc">{{ totalJifen }}</div>
			</div>
		</div>
		<div class="tl money-title white-b">
			积分收支明细
		</div>
		<div>
			<div class="per-payment pad-lef-15 pad-rig-15 pad-top-5 pad-bot-5" v-for="(jifenList, i) in jifenLists">
				<div class="fl width-70per">
					<div class="tl black ellip">{{ jifenList.content }}</div>
					<div class="font-size-12 gray-666 tl">{{ timestampToTime(jifenList.addtime) }}</div>
				</div>
				<div class="font-size-15 per-line-40 fr tr width-30per black">
					<template v-if="jifenList.type === '1'">
						<span class="font-size-16 green">+</span>
						<span class="font-size-16 green">{{ jifenList.points }}</span>
					</template>
					<template v-else>
						<span class="font-size-16 red">-</span>
						<span class="font-size-16 red">{{ jifenList.points }}</span>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_jifen',
	data () {
		return {
			jifenLists: [],
			totalJifen: 0,
		}
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '我的积分', })
		that.c_ajax({}, 'api.php?c=User&a=detail', function (value) {
			if (value.data.status === 10001) {
				that.totalJifen = value.data.detail.all_points
			}
		})
		that.c_ajax({}, 'api.php?c=UserPoints&a=lists', function (value) {
			if (value.data.status === 10001) {
				for (let v of value.data.lists) {
					that.jifenLists.push(v)
				}
			}
		})
	},
	methods: {
	},
}
</script>

<style scoped>

.my_jifen {
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}

.top-title-box {
	margin: 0 atuo;
}

.top-box {
	text-align: center;
	background: url('../../static/img/my_bg_per.png') center/cover;
	width: 100%;
	height: 160px;
	padding-top: 50px;
}

.jifen-t {
	font-size: 20px;
}

.jifen-c {
	font-size: 40px;
}

.money-title {
	font-size: 15px;
	padding: 10px 15px;
	border-bottom: 1px solid #ccc;
}

.per-payment {
	background-color: #fff;
	overflow: hidden;
	border-bottom: 1px solid #ccc;
	height: 50px;
}

.font-size-12 {
	font-size: 12px;
}

.padding-5 {
	padding: 5px;
}

.font-size-15 {
	font-size: 15px;
}

</style>