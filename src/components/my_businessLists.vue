<template>
	<div class="box my_businessLists">
		<div class="tc title-box">
			日期查询
		</div>
		<div class="tc select-time-box">
			<div class="fl time-boxa">
				<mu-date-picker :inputClass="{'tc': true, 'gray-666': true, }" :fullWidth="true" :underlineShow="false" @change="getHisDate($event)" :maxDate="nowDate" hintText="开始日期"/>
			</div>
			<div class="line fl tc">——</div>
			<div class="fr time-boxa">
				<mu-date-picker :inputClass="{'tc': true, 'gray-666': true, }" :fullWidth="true" :underlineShow="false" @change="getNowDate($event)" :minDate="hisDate" :maxDate="nowDate" hintText="结算日期"/>
			</div>
		</div>
		<div @click='searchBus()' class="white linear search-btn">查询</div>
		<mu-table class="tc" :fixedHeader="true" :showCheckbox="false" ref="table">
			<mu-thead>
				<mu-tr>
					<mu-th class="cus tc">时间</mu-th>
					<mu-th class="cus tc">产品</mu-th>
					<mu-th class="cus tc">代理</mu-th>
					<mu-th class="cus tc">金额</mu-th>
				</mu-tr>
			</mu-thead>
			<mu-tbody>
				<template v-for="list in lists">
					<mu-tr>
						<mu-td class="ellip cus tc gray-666">{{ (timestampToTime(list.addtime)).split(' ')[0] }}</mu-td>
						<mu-td class="ellip cus tc gray-666">{{ list.goods_name }}</mu-td>
						<mu-td class="ellip cus tc gray-666">{{ list.child_username }}</mu-td>
						<mu-td class="ellip cus tc gray-666">{{ list.fee }}</mu-td>
					</mu-tr>
				</template>
			</mu-tbody>
		</mu-table>
	</div>
</template>
<script>
export default {
	name: 'my_businessLists',
	data () {
		return {
			lists: [],
			nowDate: new Date(),
			hisDate: new Date(),
			startTime: '',
			endTime: '',
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '业务统计', })
		that.c_ajax({}, 'api.php?c=ShareAccount&a=share_goods_lists', function (value) {
			if (value.status === 10001) { 
				for (let v of value.data.lists) {
					that.lists.push(v)
				}
			}
		})
	},
	methods: {
		getHisDate (e) {
			this.hisDate = new Date(e)
			this.startTime = new Date(e)
		},
		getNowDate (e) {
			this.endTime = new Date(e)
		},
		searchBus () {
			let that = this, date_1, date_2
			if (!this.startTime && !this.endTime) {
				that.c_ajax({}, 'api.php?c=ShareAccount&a=share_goods_lists', function (value) {
					that.lists = []
					if (value.data.lists) {
						for (let v of value.data.lists) {
							that.lists.push(v)
						}
					}
				})
				return
			}
			if (!this.startTime) {
				this.showDialog('请输入开始日期!')
				return
			}
			if (!this.endTime) {
				this.showDialog('请输入结算日期!')
				return
			}
			date_1 = this.timestampToTime((this.startTime).getTime() / 1000).split(' ')[0]
			date_2 = this.timestampToTime((this.endTime).getTime() / 1000).split(' ')[0]
			that.c_ajax({date_1: date_1, date_2: date_2}, 'api.php?c=ShareAccount&a=share_goods_lists', function (value) {
				that.lists = []
				if (value.data.status === 10001) {
					if (value.data.lists) {
						for (let v of value.data.lists) {
							that.lists.push(v)
						}
					}
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

.my_businessLists {
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}
.title-box {
	width: 100%;
	margin-top: 10px;
}
.search-btn {
	height: 38px;
	width: 80%;
	margin: 0 auto 10px;
	line-height: 38px;
	font-size: 16px;
}

.cus {
	padding-right: 0;
	padding-left: 0;
	font-size: 15px;
	color: rgb(153, 153, 153);
}
.select-time-box {
	overflow: hidden;
	width: 300px;
	margin: 10px auto;
}
.time-boxa {
	width: 100px;
	height: 40px;
	background-color: #fff;
}
.line {
	width: 100px;
	height: 40px;
	line-height: 40px;
}
</style>