<template>
	<div>
		<div class="category_goodsDetail" v-for="(goodDetail, i) in goodsDetail">
			<div class="slider-box">
				<swiper :options="swiperOption" ref="mySwiper">
					<swiper-slide :key="i" v-for="(goodsDetailImg, i) in goodsDetailImgs">
						<img class="swiper-img" :src="goodsDetailImg.img_orogin" />
					</swiper-slide>
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper>
				<template v-if="goodDetail.is_promote === '1' && !goodDetail.is_promote_end">
					<div class="money-time-box">
						<div class="fl white money-detail-box">
							Sale <span >{{ Number(goodDetail.promote_price).toFixed(2) }}</span>
						</div>
						<div class="fr time-box white">
							<div>距结束还有</div>
							<div v-show="timeEndMessage">{{ day }}天{{ hour }}时{{ minute }}分{{ second }}秒</div>
							<div v-show="!timeEndMessage">
								活动已经结束
							</div>
						</div>
					</div>
				</template>
			</div>
			<!-- 第一套 是促销 -->
			<template v-if="goodDetail.is_promote === '1' && !goodDetail.is_promote_end">
				<div class="goods-detail-describe">
					<div class="tl goods-detail-left">
						<div class="ellip goods-detail-name">
							{{ goodDetail.goods_name }}
						</div>
						<div class="ellip gray-666 goods-detail-money">
							{{ goodDetail.sub_title }}
						</div>
						<div class="over-hidden">
							<div v-show="!goodDetail.share_detail.share_grade_id" class="fl goods-detail-discount ellip">
								消费积分:{{ goodDetail.give_points }}
							</div>
							<div v-if="goodDetail.share_detail.share_grade_id" class="fl goods-detail-discount" :class="{ 'mar-lef-5': !goodDetail.share_detail.share_grade_id }">
								加盟折扣:{{ goodDetail.share_detail.share_discount }}%
							</div>
						</div>
						<div class="goods-detail-other">
							运费{{ goodDetail.kuaidi_set.kuaidi_fee }}元 , 满{{ goodDetail.kuaidi_set.full_free }}包邮
						</div>
					</div>
					<div class="goods-detail-right">
						<div class="goods-detail-share-collect">
							<div class="fr mar-lef-24" @click='collectGoods()'>
								<img class="collect-image" :src="collectImage">
								<p class="mar-top-5">收藏</p>
							</div>
							<div class="fr" @click='shareGoods()'>
								<img class="collect-image" src="static/img/share.png">
								<p class="mar-top-5">分享</p>
							</div>
						</div>
						<div class="black goods-detail-sale-count">
							已售<span class="red">{{ goodDetail.sell_number }}</span>件
						</div>
					</div>
				</div>
			</template>
			<!-- 第二套 不是促销 -->
			<template v-else>
				<div class="goods-detail-describe">
					<div class="tl goods-detail-left">
						<div class="ellip black goods-detail-name">
							{{ goodDetail.goods_name }}
						</div>
						<div class="ellip gray-999 font-size-13 goods-detail-money">
							{{ goodDetail.sub_title }}
						</div>
						<div class="red font-size-24">
							<span class="font-size-18">Sale </span>{{ Number(goodDetail.cur_price).toFixed(2) }}
						</div>
						
						<div class="over-hidden">
							<div v-show="!goodDetail.share_detail.share_grade_id" class="fl goods-detail-discount ellip">
								消费积分:{{ goodDetail.give_points }}
							</div>
							<div v-if="goodDetail.share_detail.share_grade_id" class="fl goods-detail-discount" :class="{ 'mar-lef-5': !goodDetail.share_detail.share_grade_id }">
								加盟折扣:{{ goodDetail.share_detail.share_discount }}%
							</div>
						</div>

						<div class="goods-detail-other">
							运费{{ goodDetail.kuaidi_set.kuaidi_fee }}元 , 满{{ goodDetail.kuaidi_set.full_free }}包邮
						</div>
					</div>
					<div class="goods-detail-right er">
						<div class="goods-detail-share-collect">
							<div class="fr mar-lef-24" @click='collectGoods()'>
								<img class="collect-image" :src="collectImage">
								<p class="mar-top-5">收藏</p>
							</div>
							<div class="fr" @click='shareGoods()'>
								<img class="collect-image" src="static/img/share.png">
								<p class="mar-top-5">分享</p>
							</div>

						</div>
						<div class="black goods-detail-sale-count">
							已售<span class="red">{{ goodDetail.sell_number }}</span>件
						</div>
					</div>
				</div>
			</template>
			<div class="tc spxq"> 商品详情 </div>
			<div ref="goodsDes" v-html="goodDetail.goods_des" class="goods-des"></div>
			<section class="imgzoom_pack">
				<div class="imgzoom_x">X</div>
				<div class="imgzoom_img"><img src="" /></div>
			</section>
		</div>
		<!-- 分享盒子 -->
		<div class="share-box" :class="{'block': showShareBox}">
			<div class="share-box-content white">
				点击右上角即可分享朋友圈
				<img class="share-up-style" src="static/img/arrow_up.png">
			</div>
		</div>
		<!-- 固定底部 -->
		<div class="footer-box">
			<div class="fl tc gwc" @click="goCartIndex()">
				<img class="cart-icon" src="static/img/cart.png">
				<p class="mar-top--5">购物车</p>
			</div>
			<div class="fl tc jrcg" @click="addToCart(goods_id)">
				加入采购
			</div>
			<div class="white fl tc ljdg" @click="buy()">
				立即采购
			</div>
		</div>
	</div>
</template>
<script>

export default {
	name: 'category_goodsDetail',
	data () {
		return {
			timeEndMessage: true,
			goods_id: '',
			cart_id_str: '',
			goodsDetail: [],
			is_collect: -1,
			swiperOption: {
				direction: 'horizontal',
				pagination: {
					el: '.swiper-pagination',
				}
			},
			collectImage: 'static/img/collect.png',
			showShareBox: false,
			goodsDetailImgs: [],
			imgSrc: '',
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
		}
	},
	updated () {
		ImagesZoom.init({
			"elem": ".goods-des"
		})
	},
	mounted () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '商品详情', })
		this.goods_id = this.$route.query.goods_id

		that.c_ajax({id: that.goods_id}, 'api.php?c=ShopGoods&a=detail', function (value) {
			if (value.data.status === 10001) {
				that.goodsDetail.push(value.data.detail)
				that.goodsDetail[0].img_orogin = that.urlPrefix + value.data.detail.img_orogin
				// that.goodsDetail[0].promote_end_date = that.timestampToTime(value.data.detail.promote_end_date)
				that.goodsDetail[0].promote_end_date = value.data.detail.promote_end_date
				that.countdown()
				that.goodsDetailImgs.push({
					img_orogin: that.urlPrefix + that.goodsDetail[0].img_thumb
				})
				let galleryLists = value.data.detail.gallery_lists
				if (galleryLists !== null) {
					for (let v of galleryLists) {
						that.goodsDetailImgs.push({
							img_orogin: that.urlPrefix + v.img_thumb
						})
					}
				}
			}
		})
		that.c_ajax({goods_id: that.goods_id}, 'api.php?c=UserCollect&a=is_collect', function (value) {
			if (value.data.status === 10001) {
				that.is_collect = value.data.is_collect
				if (that.is_collect === 0) {
					that.collectImage = 'static/img/collect.png'
				} else {
					that.collectImage = 'static/img/collect_on.png'
				}
			}
		})
	},
	methods: {
		countdown: function () {
			const that = this
			const end = that.goodsDetail[0].promote_end_date * 1000
			const now = Date.parse(new Date())
			const msec = end - now
			let day = parseInt(msec / 1000 / 60 / 60 / 24)
			let hour = parseInt(msec / 1000 / 60 / 60 % 24)
			let minute = parseInt(msec / 1000 / 60 % 60)
			let second = parseInt(msec / 1000 % 60)
			this.day = day
			this.hour = hour > 9 ? hour : '0' + hour
			this.minute = minute > 9 ? minute : '0' + minute
			this.second = second > 9 ? second : '0' + second
			if (msec > 0) {
				setTimeout(function () {
					that.countdown()
				}, 1000)
			} else {
				that.timeEndMessage = false
			}
		},
		addToCart (goods_id) {
			let that = this
			that.c_ajax({goods_id: goods_id}, 'api.php?&c=ShopCart&a=add', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('已加入购物车!')
				} else if (value.data.status === 10003) {
					that.showDialog('库存不足!')
				} else {
					that.showDialog(value.data.msg)
				}
			})
		},
		collectGoods () {
			let that = this
			that.c_ajax({goods_id: that.goods_id, status: 1}, 'api.php?c=UserCollect&a=add', function (value) {
				if (value.data.status === 10001) {
					that.collectImage = 'static/img/collect_on.png'
					that.showDialog('收藏成功!')
				}
				if (value.data.status === 10002) {
					that.collectImage = 'static/img/collect.png'
					that.showDialog('已取消收藏!')
				}
			})
		},
		shareGoods () {
			let that = this
			this.showShareBox = true
			this.timer = setTimeout(function () {
				that.showShareBox = false
				clearTimeout(that.timer)
			}, 1200)
		},
		buy () {
			let that = this
			that.c_ajax({goods_id: that.goods_id}, 'api.php?&c=ShopCart&a=add', function (value) {
				if (value.data.status === 10001) {
					that.cart_id_str = value.data.cart_id
					that.goCartConfirmOrder(that.cart_id_str)
				} else if (value.data.status === 10003) {
					that.showDialog('库存不足!')
				} else {
					that.showDialog(value.data.msg)
				}
			})
		}
	},
}
</script>

<style>
.slider-box {
	position: relative;
	background-color: #fff;
}
.category_goodsDetail {
	bottom: 44px;
	padding-bottom: 5px;
	position: absolute;
	top: 43px;
	left: 0;
	width: 100%;
	background-color: #F3F5F7;
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
}
.goods-detail-img {
	width: 100%;
}
.money-time-box {
	width: 100%;
	position: absolute;
	bottom: 0;
	left: 0;
	height: 60px;
	z-index: 1;
	background-color: #df2a2b;
}
.money-detail-box {
	font-size: 30px;
	margin-top: 7.5px;
	margin-left: 10px;
}
.time-box {
	font-size: 16px;
	width: 160px;
	margin-right: 10px;
	margin-top: 6px;
}
.goods-detail-describe {
	width: 100%;
	padding: 15px 12px 10px;
	position: relative;
	background-color: #fff;
	border-bottom: 1px solid #eee;
}
.goods-detail-left {
	width: 70%;
}
.goods-detail-name {
	font-size: 20px;
}
.goods-detail-money {
	height: 24px;
}
.goods-detail-discount {
	color: #b64843;
	font-size: 16px;
}
.goods-detail-other {
	color: #ccc;
	font-size: 16px;
}
.goods-detail-right {
	position: absolute;
	right: 12px;
	top: 15px;
	height: 100px;
	width: 30%;
}
.goods-detail-sale-count {
	font-size: 16px;
	position: absolute;
	right: 0;
	bottom: 0;
}
.goods-detail-share-collect {
	position: absolute;
	right: 0;
	top: 0;
	font-size: 12px;
	width: 100%;
}
.mar-lef-24 {
	margin-left: 24px;
}

.collect-image {
	width: 15px;
	height: 15px;
}

.cart-icon {
	width: 16px;
	height: 16px;
	margin-top: 5px;
}

.spxq {
	margin-bottom:0;
	margin-top: 10px;
	background-color: #fff;
	line-height: 30px;
	padding: 10px 0;
	font-size: 16px;
}
.footer-box {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 44px;
}
.gwc {
	background-color: #fff;
	width: 25%;
	height: 44px;
}
.jrcg {
	background-color: #D7D7D7;
	color: #201078;
	width: 37.5%;
	line-height: 44px;
	font-size: 16px;
}
.ljdg {
	width: 37.5%;
	line-height: 44px;
	font-size: 16px;
	background-color: #df2a2b;
}
.goods-des {
	width: 100%;
	-webkit-overflow-scrolling : touch;
}
.share-box {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: rgba(0,0,0,.5);
	z-index: 12;
	display: none;
}

.share-box-content {
	font-size: 16px;
	font-weight: bold;
	position: absolute;
	right: 30px;
	top: 48px;
}

.block {
	display: block;
}

.share-up-style {
	width: 24px;
	height: 24px;
	position: absolute;
	right: -25px;
	top: 0;
}

.er {
	height: 138px;
}

.height-114 {
	height: 114px;
}

.swiper-img {
	width: 100%;
}

img {
	border:0;
}

.list {
	width:100%;
	padding:10px 0;
}
.list li {
	display: block;
	margin-bottom: 10px;
	box-shadow: 0 1px 2px rgba(0,0,0,.1), 0 -1px 2px rgba(0,0,0,.1);
}
.list li img {
	width: 100%;
	height: auto;
}
.imgzoom_pack {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	background: rgba(0,0,0,.7);
	display: none;
	z-index: 999;
}
.imgzoom_pack .imgzoom_x {
	color: #fff;
	height: 30px;
	width: 30px;
	line-height: 30px;
	background: #000;
	text-align: center;
	position: absolute;
	right: 5px;
	top: 5px;
	z-index: 10;
	cursor: pointer;
}
.imgzoom_pack .imgzoom_img {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	overflow: hidden;
}
.imgzoom_pack .imgzoom_img img {
	width: 100%;
	position: absolute;
	top: 50%;
	left: 0;
}
</style>