<template>
	<div class="box my_applySale">
		<div class="list-box">
			<p class="tl order-number">
				订单编号: {{ order_sn }}
			</p>
			<div v-for="(goodsList, i) in goodsLists" class="ellip goods-detail">
				<img class="goods-images" :src="urlPrefix + goodsList.img_thumb">
				<div class="fr tr">
					<div class="goods-money">￥{{ Number(goodsList.shop_price).toFixed(2) }}</div>
					<div class="gray-666 goods-his-money">￥{{ Number(goodsList.market_price).toFixed(2) }}</div>
					<div class="gray-666 goods-count">x{{ goodsList.amount }}</div>
				</div>
				<div class="tl ellip goods-name">{{ goodsList.goods_name }}</div>
			</div>
			<div class="all-money tr">
				<span>共{{ goods_num }}件商品 合计 </span><span class="m">￥{{ total_fee }}</span>
			</div>
		</div>
		<div class="tl order-number-change">
			<div class="fl">选择售后服务</div>
			<select ref='select' class="fr select-style">
				<option value="">选择售后</option>
				<option value="1">仅退款</option>
				<option value="2" v-if="!type">退货退款</option>
			</select>
		</div>
		<div class="textarea-style">
			<textarea v-model="textValue" placeholder="填写售后理由..."></textarea>
		</div>
		<div class="tl image-style">
			<img class="per-image-cell" v-for="(img, i) in imgs" :src="img.img_thumb">
			<form class="tl image-style-box" id="imageUploadForm" ref='uploadPictureForm'>
				<img class="img-icon" src="static/img/photo.png"/>
				<input class="image-input" type="file" name="myfile" accept="image/*" @change="uploadPicture" />
			</form>
		</div>
		<div @click='submitApplySale()' class="white tc font-size-15 bottom-box">
			提交售后申请
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_applySale',
	data () {
		return {
			order_id: '',
			order_sn: '',
			goodsLists: [],
			goods_num: '',
			total_fee: '',
			imgs: [],
			textValue: '',
			imgs2: [],
			type: '',
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '申请售后', })
		that.order_id = that.$route.query.order_id
		that.type = that.$route.query.type
		that.c_ajax({order_id: that.order_id}, 'api.php?c=UserOrder&a=detail', function (value) {
			if (value.data.status === 10001) {
				that.order_sn = value.data.detail.order_sn
				that.goods_num = value.data.detail.goods_num
				that.total_fee = value.data.detail.total_fee
				for (let v of value.data.detail.goods_lists) {
					that.goodsLists.push(v)
				}
			}
		})
	},
	methods: {
		uploadPicture (e) {
			let fd = new FormData(), file = e.target.files[0], that = this
			if (file.size >= 2000*1024) {
				that.showDialog('图片不能大于2M, 请重新上传!')
				that.$refs.uploadPictureForm[0].reset()
				return
			}
			fd.append('myfile', file)
			that.$ajax.post(this.urlPrefix + 'api.php?c=Plus&a=upload_img&token=' + that.$store.state.token, fd)
			.then(function (value) {
				that.imgs.push({ img_thumb: that.urlPrefix + value.data.img_thumb })
				that.imgs2.push(value.data.img_thumb)
			})
		},
		submitApplySale () {
			let that = this
			if (!that.$refs.select.value) {
				that.showDialog('请选择售后类型!')
				return
			}
			if (!that.textValue) {
				that.showDialog('请填写售后理由!')
				return
			}
			that.c_ajax({order_id: that.order_id, back_type: that.$refs.select.value, back_img: that.imgs2.join(','), back_content: that.textValue}, 'api.php?c=UserOrder&a=add_back', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('申请售后成功!')
					setTimeout(function () {
						that.toBack()
					}, 1500)
				}
			})
		},
	},
}
</script>

<style scoped>
.my_applySale {
	bottom: 44px;
}

.order-sn {
	height: 35px;
	line-height: 35px;
	padding: 0 15px;
	margin-bottom: 0;
	background-color: #fff;
}

.order-number {
	height: 35px;
	line-height: 35px;
	padding:0 15px;
	margin: 0;
	background-color: #fff;
}
.order-number-change {
	height: 40px;
	line-height: 40px;
	padding:0 15px;
	margin: 0;
	border-bottom: 1px solid #ccc;
	background-color: #fff;
}

.goods-detail {
	padding: 8px 16px 16px 106px;
	background-color: #F3F5F7;
	font-size: 16px;
	position: relative;
	height: 100px;
}

.goods-detail img {
	position: absolute;
	top: 10px;
	left: 10px;
	width: 80px;
	height: 80px;
}

.goods-money {
	color: #b64843;
	font-size: 15px;
}
.goods-his-money {
	text-decoration: line-through;
	font-size: 15px;
}

.goods-name {
	width: 120px;
}

.all-money {
	width: 100%;
	height: 42px;
	line-height: 31px;
	padding: 5px 15px 5px 15px;
	border-bottom: 1px solid #ccc;
	background-color: #fff;
}

.all-money .m {
	color: #b64843;
	font-size: 16px;
}

.bottom-box {
	position: fixed;
	left: 0;
	width: 100%;
	bottom: 0;
	height: 44px;
	line-height: 44px;
	background-color: #df2a2b;
}

.textarea-style {
	width: 100%;
	height: 150px;
	padding: 10px 15px;
	background-color: #fff;
	border-bottom: 1px solid #ccc;
}
.textarea-style textarea {
	width: 100%;
	height: 100%;
	border: 0;
	outline: 0;
}

.select-style {
	height: 34px;
	margin-top: 3px;
	width: 100px;
}

.image-style {
	position: relative;
	height: 150px;
	background-color: #fff;
	padding: 15px;
	overflow-x: scroll;
	white-space: nowrap;
	overflow-y: hidden;
}

.image-style-box {
	height: 120px;
	width: 120px;
	display: inline-block;
	position: relative;
}

.image-input {
	position: absolute;
	top: 0;
	left: 0;
	display: inline-block;
	height: 100%;
	width: 100%;
	opacity: 0;
}

.img-icon {
	width: 100%;
	height: 100%;
}

.per-image-cell {
	margin-right: 15px;
	width: 100px;
}

</style>