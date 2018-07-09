<template>
	<div class="box my_collect" :class="{'get-scroll': showEdit}">
		<div class="gray-666 tl top-box">
			<div ref='allSelect' class="check-box" @click='checkAll($event)'></div>
			全选
			<div class="fr" @click='operation'>{{ operationName }}</div>
		</div>	
		<div class="list">
			<div :class="{'per-list-on': showEdit }" @click="goCategoryGoodsDetail(list.goods_id)" class="per-list" v-for="(list, i) in lists">
				<img class="per-list-img" :class="{'per-list-img-on': showEdit }" :src="urlPrefix + list.goods.img_thumb">
				<h2 class="tl ellip per-list-name">
					{{ list.goods.goods_name }}
				</h2>
				<template v-if="showEdit">
					<div ref="perListCheck" class="tc check-box-one" @click.stop="check($event, list.goods_id)">
					</div>
				</template>
				<p class="tl red per-list-money">￥{{ list.goods.market_price }}</p>
			</div>
		</div>
		<template v-if="showEdit">
			<div class="bottom-box">
				<div class="fl gray-666 width-67per tl">
					已选（{{ count }}）
				</div>
				<div @click="deleteCollectGoods()" class="white fr width-33per linear tc">删除</div>
			</div>
		</template>	
	</div>
</template>
<script>

export default {
	name: 'my_collect',
	data () {
		return {
			lists: [],
			operationName: '编辑',
			showEdit: false,
			count: 0,
			deleteLists: [],
		}
	},
	components: {
	},
	created () {
		this.$store.commit('updateTitleMsg', { title_msg: '我的收藏', })
		this.getLists()
	},
	methods: {
		getLists () {
			let that = this
			that.c_ajax({shop_id: ''}, 'api.php?c=UserCollect&a=lists', function (value) {
				if (value.data.status === 10001) {
					that.lists = []
					for (let v of value.data.lists) {
						that.lists.push(v)
					}
				} else if (value.data.status === 10003) {
					that.lists = []
				}
			})
		},
		check (e, goods_id) {
			let color
			if (e.target.style.backgroundColor === 'rgb(0, 0, 0)') {
				color = '#fff'
				this.count--
				this.$refs.allSelect.style.backgroundColor = color
				for (let i = 0; i < this.deleteLists.length; i++) {
					if (this.deleteLists[i] === goods_id) {
						this.deleteLists.splice(i, 1)
					}
				}
			} else {
				color = '#000'
				this.count++
				this.deleteLists.push(goods_id)
			}
			if (this.lists.length === this.count) {
				this.$refs.allSelect.style.backgroundColor = color
			}
			e.target.style.backgroundColor = color
		},
		checkAll (e) {
			if (!this.showEdit) {
				return
			}
			let perListCheck = this.$refs.perListCheck, color
			this.deleteLists = []
			if (e.target.style.backgroundColor === 'rgb(0, 0, 0)') {
				color = '#fff'
				this.count = 0
			} else {
				color = '#000'
				this.count = this.lists.length
				for (let i = 0; i < this.count; i++) {
					this.deleteLists.push(this.lists[i].goods_id)
				}
			}
			e.target.style.backgroundColor = color
			for (let v of perListCheck) {
				v.style.backgroundColor = color
			}
		},
		operation () {
			let that = this
			if (this.operationName === '完成') {
				this.operationName = '编辑'
				this.showEdit = false
				that.c_ajax({shop_id: ''}, 'api.php?c=UserCollect&a=lists', function (value) {
					that.lists = []
					for (let v of value.data.lists) {
						that.lists.push(v)
					}
					that.$refs.allSelect.style.backgroundColor = '#fff'
				})
			} else {
				this.count = 0
				this.operationName = '完成'
				this.showEdit = true
			}
		},
		deleteCollectGoods () {
			let that = this, obj = {}, goods_id = []
			let perListCheck = this.$refs.perListCheck
			for (let i = 0; i < this.deleteLists.length; i++) {
				goods_id[i] = this.deleteLists[i]
			}
			obj.goods_id = goods_id
			if (obj.goods_id.length === 0) {
				this.showDialog('请选择要删除的商品!')
				return
			}
			that.c_ajax({obj}, 'api.php?c=UserCollect&a=delete', function (value) {
				that.showDialog('已取消收藏!')
				setTimeout(function () {
					that.getLists()
					that.operationName = '编辑'
					that.showEdit = false
					for (let v of perListCheck) {
						v.style.backgroundColor = '#fff'
					}
					that.$refs.allSelect.style.backgroundColor = '#fff'
					that.count = 0
				}, 1500)
			})
		},
	},
}
</script>

<style scoped>
.my_collect {
	bottom: 42px;
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}

.top-box {
	position: relative;
	padding: 0 15px 0 50px;
	background-color: #fff;
	height: 38px;
	line-height: 38px;
	border-bottom: 1px solid #ccc;
}

.check-box {
	position: absolute;
	left: 15px;
	top: 10px;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	border: 1px solid #747474;
	background-image: url(../../static/img/gou.png);
	background-size: 10px 7px;
	background-repeat: no-repeat;
	background-position: 3px 4px;
}
.list {
	position: relative;
	padding-top: 1px;
	padding-bottom: 1px;
	padding-left: 0;
	background-color: #fff;
}
.per-list {
	height: 100px;
	position: relative;
	border-bottom: 1px solid #ccc;
	padding-top: 8px;
	padding-right: 16px;
	padding-bottom: 10px;
	padding-left: 100px;
}
.per-list-img {
	position: absolute;
	top: 10px;
	max-width: 80px;
	max-height: 80px;
	width: 100%;
	height: 100%;
	left: 15px;
	border-radius: 5px;
}

.per-list-on {
	padding-left: 135px;
}

.per-list-img-on {
	left: 45px;
}


.per-list-name {
	font-size: 15px;
	padding-right: 35px;
	margin: 0;
	font-weight: 400;
}
.per-list-money {
	font-size: 14px;
	margin: 0;
}

.check-box-one {
	position: absolute;
	top: 42px;
	left: 15px;
	width: 18px;
	height: 18px;
	line-height: 10px;
	border-radius: 50%;
	border: 1px solid #747474;
	background-image: url(../../static/img/gou.png);
	background-size: 10px 7px;
	background-repeat: no-repeat;
	background-position: 3px 4px;
}

.bottom-box {
	height: 43px;
	line-height: 43px;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
}

.width-67per {
	width: 67%;
	padding-left: 30px;
}

.width-33per {
	width: 33%;
	font-size: 16px;
}

.get-scroll {
	overflow-y: scroll;
}

</style>