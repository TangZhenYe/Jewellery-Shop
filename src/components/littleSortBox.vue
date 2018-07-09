<template>
	<div class="little-sort-content-box">
		<!-- 第一套 -->
		<div :id="littleSortContent.goods_id" v-if="flag" @click="goCategoryGoodsDetail(littleSortContent.goods_id)" v-for="littleSortContent in littleSortContents" class="per-little-sort-content">
			<div class="fl little-sort-content-logo">
				<img :src="(littleSortContent.img_thumb) ? urlPrefix + littleSortContent.img_thumb : test" />
			</div>
			<div class="tl little-sort-content-describe">
				<div style="padding-top: 28px;">
					<div class="font-size-14 ellip black">{{ littleSortContent.goods_name }}</div>
					<div class="tl red font-size-18">
						<span class="font-size-14">Sale </span>{{ Number(littleSortContent.cur_price).toFixed(2) }}
						<br/>
						<div class="font-size-12 tc white red-b per-line-20" style="width: 55px; border-radius: 5px; " v-show="littleSortContent.is_promote_running">活动商品</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 第二套 -->
		<div :id="littleSortContent.goods_id" @click="goCategoryGoodsDetail(littleSortContent.goods_id)" v-if="!flag" :class="{'fl': (i+2)%2 === 0, 'fr': (i+2)%2 !== 0}" v-for="(littleSortContent, i) in littleSortContents" class="per-little-sort-content-2">
			<div class="little-sort-content-logo-2">
				<img :src="(littleSortContent.img_thumb) ? urlPrefix + littleSortContent.img_thumb : test">
			</div>
			<div class="little-sort-content-describe-2">
				<div class="mar-top-5 tc font-size-14 name black ellip cust-name">{{ littleSortContent.goods_name }}</div>
			</div>
			<div class="money-box tl red font-size-18 pos-relative per-line-30">
				<template v-if="littleSortContent.is_promote_running">
					<div style="width: 128px; margin: 0 auto; " class="pos-relative">
						<span class="font-size-14">Sale </span><span>{{ Number(littleSortContent.cur_price).toFixed(2) }}</span><div class="font-size-12 white red-b pos-absolute per-line-20 tc" style="width: 55px; right: 0px; top: 4px; border-radius: 5px; ">活动商品</div>
					</div>
				</template>
				<template v-else>
					<div class="width-100per tc">
						<span class="font-size-14">Sale </span><span>{{ Number(littleSortContent.cur_price).toFixed(2) }}</span>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'littleSortBox',
	data () {
		return {
			test: 'static/img/share_logo.jpg',
		}
	},
	props: ['littleSortContents', 'flag'],
	created () {

	},
	methods: {
	},
}
</script>

<style scoped>
/*小分类下面的内容*/
.little-sort-content-box {
	overflow: hidden;
}
/*第一套*/
.per-little-sort-content {
	height: 130px;
	padding: 10px;
	background-color: #fff;
}
.little-sort-content-logo {
	width: 110px;
	height: 110px;
}
.little-sort-content-logo img {
	width: 100%;
	height: 100%;
}
.little-sort-content-describe {
	margin-left: 120px;
	height: 110px;
	font-size: 15px;
	border-bottom: 1px solid #ccc;
	position: relative;
}

.cus-bac-style {
	background: #f4f2f2;
	padding: 2px;
	border-radius: 5px;
	width: 48%;
	font-size: 11px;
}

.little-sort-money-box {
	position: absolute;
	bottom: 0;
	left: 0;
}

/*第二套*/
.per-little-sort-content-2 {
	width: 49%;
	background-color: #fff;
	margin-top: 10px;
	overflow: hidden;
	position: relative;
}
.little-sort-content-logo-2 {
	width: 100%;
}
.little-sort-content-logo-2 img {
	width: 100%;
	height: 100%;
	vertical-align: bottom;
}

.little-sort-content-describe-2 {
	padding-left: 5px;
	background-color: #fff;
}
.cus-bac {
	font-size: 12px;
	text-align: left;
}
.cus-name {
	width: 100%;
	height: 20px;
	line-height: 20px;
}
.cus-sub-name {
	width: 100%;
	height: 34px;
	overflow: hidden;
	line-height: normal;

}

.money-box {
	padding-left: 5px;
}

</style>