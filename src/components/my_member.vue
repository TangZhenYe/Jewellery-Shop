<template>
	<div class="box my_member">
		<div class="tl per-list" v-for="(list, i) in lists">
			<img :src="list.headimgurl">
			<div class="des-box">
				<div class="fl ellip name-style font-size-16">{{ list.username }}</div>
				<div class="fl font-size-12 gray-999">&nbsp;加入时间：{{ timestampToTime(list.addtime).split(' ')[0] }}</div>
			</div>
			<div class="gray-999">
				累计佣金：{{ list.all_cash }}&nbsp;可提佣金：{{ list.all_cash }}
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_member',
	data () {
		return {
			lists: [],
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '我的成员', })
		let share_grade_id = this.$route.query.share_grade
		that.c_ajax({share_grade_id: share_grade_id}, 'api.php?c=ShareUser&a=team_detail', function (value) {
			if (value.data.status === 10001) {
				if (value.data.lists) {
					for (let v of value.data.lists) {
						that.lists.push(v)
					}
				}
			}
		})
	},
	methods: {
	},
	mounted () {
		this.getShare()
	},
}
</script>

<style scoped>
.my_member {
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}

.name-style {
	max-width: 40%;
}

.des-box {
	width: 100%;
	overflow: hidden;
	height: 24px;
	line-height: 24px;
}

.per-list {
	padding: 16px 16px 16px 86px;
	height: 80px;
	background-color: #fff;
	position: relative;
	border-bottom: 1px solid #ccc;
}

.per-list img {
	position: absolute;
	top: 10px;
	left: 10px;
	height: 60px;
	width: 60px;
}

.font-size-12 {
	font-size: 12px;
}

.font-size-16 {
	font-size: 16px;
}

</style>