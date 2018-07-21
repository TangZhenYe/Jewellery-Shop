<template>
	<div class="my_team box">
		<div class="content-out-box">
			<div class="content-box">
				<div class="tc personal-interview">
					<div class="personal-image">
						<img :src="headimgurl">
					</div>
					<p class="white personal-name">{{ username }}</p>
					<p class="white personal-type">用户身份:{{ grade_title }}</p>
				</div>
				<div class="tc personal-info">
					<div class="fl white per-personal-info">
						<h4>{{ all_count }}</h4>
						新增客户
					</div>
					<div class="fl white per-personal-info">
						<h4>是</h4>
						发展权限
					</div>
				</div>
			</div>
		</div>
		<div class="list">
			<div @click="goMyMember(otherList.share_grade)" class="tl per-list" v-for='(otherList, i) in otherLists'>
				{{ otherList.title }}
				<span class="fr">{{ otherList.share_count }}人</span>
				<img class="arrow-style" src="static/img/arrow_right.png">
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_team',
	data () {
		return {
			otherLists: [],
			username: '',
			grade_title: '',
			headimgurl: '',
			all_count: '',
			is_share: '',
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '我的客户', })
		
		that.c_ajax({}, 'api.php?c=ShareUser&a=team_lists', function (value) {
			if (value.data.status === 10001) {
				that.all_count = value.data.all_count
				that.username = value.data.share_detail.username
				that.grade_title = value.data.share_detail.grade_title

				if ((value.data.share_detail.headimgurl).substr(0, 1) === 'h') {
					that.headimgurl = value.data.share_detail.headimgurl
				} else {
					that.headimgurl = that.urlPrefix + value.data.share_detail.headimgurl
				}
				that.is_share = value.data.is_share
				if (that.is_share === '0') {
					that.otherLists.push({
						share_count: value.data.lists[1].share_count,
						share_grade: value.data.lists[1].share_grade,
						title: value.data.lists[1].title,
					})
				} else {
					for (let v of value.data.lists) {
						that.otherLists.push(v)
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
.my_team {
}
.content-out-box {
	background-image: url(../../static/img/team_bg.png);
	background-size: 100% 100%;
	overflow: hidden;
	height: 246px;
	width: 100%;
	margin-top: -2px;
}

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
.personal-name {
	margin: 10px 0 5px 0;
	width: 100%;
}
.personal-type {
	width: 100%;
	font-size: 12px;
	margin-top: 0;
}
.personal-info {
	padding: 8px 5px 5px;
	height:52px;
}

.per-personal-info {
	width: 50%;
	height: 100%;
}
.per-personal-info h4 {
	margin: 0;
}


.list {
	padding-left: 15px;
	height: 380px;
	width: 100%;
	background-color: #fff;
}

.per-list {
	padding: 16px 54px 16px 0;
	color: rgb(102, 102, 102);
	font-size: 15px;
	border-bottom: 1px solid #ccc;
	position: relative;
}

.arrow-style {
	position: absolute;
	right: 10px;
	top: 15px;
}

</style>