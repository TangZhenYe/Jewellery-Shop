<template>
	<div class="category_index box">
		<div class="search-goods-box">
			<div class="search-goods">
				<input @focus="goCategoryRecommended()" type="text" placeholder="搜索商品" class="black search-goods-input">
				<mu-icon class='black icon-search' value='search'></mu-icon>
			</div>
		</div>
		<div class="content-box">
			<div class="left-slide fl">
				<div :class="{'click-per-goods-sort': index === clickPerGoodsSortIndex }" class="gray-666 per-goods-sort" v-for="(goodsSort, index) in goodsSorts" @click="clickPerGoodsSort(index)">
					{{ goodsSort.cat_name }}
				</div>
			</div>
			<div class="fl right-content">
				<div @click='goCategoryRecommended(goodsSortsContetList.cate_id)' v-for="goodsSortsContetList in goodsSortsContetLists" class="per-goods-sort-content fl">
					<img :src="goodsSortsContetList.img_thumb">
					<div class="per-goods-sort-content-name">
						{{ goodsSortsContetList.cat_name }}
					</div>
				</div>
			</div>
		</div>
		<footerBox :count='2'></footerBox>

	</div>
</template>

<script>
export default {
	name: 'category_index',
	data () {
		return {
			goodsSorts: [],
			clickPerGoodsSortIndex: 0,
			goodsSortsContetLists: [],
			test: 'static/img/share_logo.jpg',
		}
	},
	components: {
		footerBox: require('./footerBox').default,
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '分类', })
    that.$store.commit('updateCountNum', {countNum: 2})

		that.c_ajax({}, 'api.php?c=ShopCategory&a=lists', function (value) {
			if (value.data.status === 10001) {
				for (let v of value.data.lists) {
					that.goodsSorts.push(v)
				}
				if (value.data.lists[0].child) {
					for (let v of value.data.lists[0].child) {
						that.goodsSortsContetLists.push({
							cate_id: v['cate_id'],
							cat_name: v['cat_name'],
							img_thumb: (v['img_thumb']) ? that.urlPrefix + v['img_thumb'] : that.test,	
						})
					}
				}
			} else {
				that.showDialog(value.data.msg)
			}
		})
	},
	methods: {
		clickPerGoodsSort (index) {
			let that = this
			this.clickPerGoodsSortIndex = index
			this.goodsSortsContetLists = []	
			if (this.goodsSorts[index].child) {
				for (let v of this.goodsSorts[index].child) {
					this.goodsSortsContetLists.push({
						cate_id: v['cate_id'],
						cat_name: v['cat_name'],
						img_thumb: (v['img_thumb']) ? that.urlPrefix + v['img_thumb'] : that.test,	
					})
				}
			}
		},
	},
	mounted () {
		this.getShare()
	},
}
</script>

<style scoped>


.category_index {
	bottom: 50px;
}
.search-goods-box {
	height: 50px;
	border-bottom: 1px solid #ccc;
	width: 100%;
	padding: 5px 10px;
}
.search-goods {
	height: 40px;
	border: 1px solid #fff;
	border-radius: 30px;
	position: relative;
	background-color: rgb(241,242,244);
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
/*内容*/
.content-box {
	width: 100%;
	top: 50px;
	position: absolute;
	bottom: 0;
	overflow-y: scroll;
	background-color: #f6f7fe;
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}

.left-slide {
	width: 30%;
	background-color: #fff;
}

.per-goods-sort {
	padding:16px 0;
	border:none;
	margin:0;
	font-size: 13px;
	border-bottom: 1px solid #ccc;
}

.click-per-goods-sort {
	background-color: #f6f7fe;
	border-bottom: 1px solid #f6f7fe;
}

.right-content {
	width: 70%;
	background-color: #f6f7fe;
}

.per-goods-sort-content {
	width: 30%;
	height: 106px;
	padding: 5px;
}

.per-goods-sort-content img {
	width: 60px;
	height: 60px;
	border-radius: 50%;
}
</style>