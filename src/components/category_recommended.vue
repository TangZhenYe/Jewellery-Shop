<template>
	<div class="category_recommended white-b">
		<div class="search-goods-box">
			<div class="search-goods">
				<input v-model.trim="searchWord" @change="searchGoods()" type="text" placeholder="搜索商品" class="search-goods-input black">
				<mu-icon class='icon-search black' value='search'></mu-icon>
			</div>
			<img class="sort-style" @click="changeSortType($event)" src="static/img/sort2.png"/>
		</div>
		<div class="little-sort-box">
			<div @click="selectLittleSort(i)" :class="{ 'black': i === selectI }" v-for="(littleSort, i) in littleSorts" class="tc per-little-sort">
				{{ littleSort }}
			</div>
		</div>
		<littleSortBox :flag="!flag" :little-sort-contents="littleSortContents"></littleSortBox>
	</div>
</template>
<script>

export default {
	name: 'category_recommended',
	data () {
		return {
			flag: true,
			littleSorts: ['全部', '最新', '销量', '价格', ],
			selectI: 0,
			littleSortContents: [],
			cate_id: 0,
			searchWord: '',
			scrollTop: 0,
		}
	},
	watch: {
		searchWord () {
			let that = this
			setTimeout(function () {
				that.searchGoods()
			}, 200)
		},
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '商品推荐', })
		this.cate_id = this.$route.query.cate_id
		this.getLittleSortContents('', that.cate_id)
	},
	components: {
		littleSortBox: require('./littleSortBox').default,
	},
	methods: {
		changeSortType (e) {
			this.flag = !this.flag
			let str = 'static/img/sort', a = (this.flag) ? 2 : ""
			e.currentTarget.src = str + a + '.png'
		},
		selectLittleSort (i) {
			let orderType = -1
			this.selectI = i
			switch (i) {
				case 0: case 1:
				orderType = ''
				break;
				case 2:
				orderType = 'sell_number desc'
				break;
				case 3:
				orderType = 'shop_price desc'
				break;
			}
			this.getLittleSortContents(orderType, '')
		},
		getLittleSortContents (orderType, cate_id) {
			let that = this
			that.c_ajax({cate_id: cate_id, order: orderType}, 'api.php?c=ShopGoods&a=lists', function (value) {
				if (value.data.status === 10001) {
					that.littleSortContents = []
					for (let v of value.data.lists) {
						that.littleSortContents.push(v)
					}
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		searchGoods () {
			let that = this
			that.c_ajax({keyword: that.searchWord, order: ''}, 'api.php?c=ShopGoods&a=lists', function (value) {
				if (value.data.status === 10001) {
					that.littleSortContents = []
					for (let v of value.data.lists) {
						that.littleSortContents.push(v)
					}
				} else {
					that.littleSortContents = []
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
.category_recommended {
	position: absolute;
	top: 43px;
	left: 0;
	width: 100%;
	bottom: 0;
	overflow-y: scroll;
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}
.search-goods-box {
	height: 50px;
	width: 100%;
	padding: 5px 10px;
	position: relative;
	background-color: #fff;
}
.search-goods {
	height: 40px;
	border: 1px solid #fff;
	border-radius: 30px;
	position: relative;
	background-color: rgb(241,242,244);
	width: 90%;
}
.search-goods-input {
	position: absolute;
	width: 270px;
	height: 38px;
	line-height: 38px;
	outline: none;
	border: none;
	left: 30px;
	background-color: transparent;
}
.icon-search {
	position: absolute;
	right: 10px;
	top: 8px;
}
.sort-style {
	position: absolute;
	width: 25px;
	height: 25px;
	top: 10px;
	right: 10px;
}
/*搜索下面的分类搜索*/
.little-sort-box {
	display: -webkit-box;
	display: -moz-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
	padding: 10px;
	background-color: #fff;
}
.per-little-sort {
	width: 24%;
	cursor: pointer;
	position: relative;
	background-color: #F0F2F5;
	height: 40px;
	line-height: 40px;
	border-radius: 5px;
	margin-bottom: 5px;
	font-size: 15px;
	color: #ccc;
}

.black {
	color: #000;
}
</style>