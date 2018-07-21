<template>
	<div class="box my_comment">
		<headerBox :title-msg='titleMsg'></headerBox>
		<div class="tl top-box">
			<img class="fl goods-logo" src="static/img/share_logo.jpg"/>
			<div class="fl top-right-box">
				<span class="star-title">为商品评分</span>
				<img @click="countStar(1)" class="per-star-cell" src="static/img/star_off.png" />&nbsp;
				<img @click="countStar(2)" class="per-star-cell" src="static/img/star_off.png" />&nbsp;
				<img @click="countStar(3)" class="per-star-cell" src="static/img/star_off.png" />&nbsp;
				<img @click="countStar(4)" class="per-star-cell" src="static/img/star_off.png" />&nbsp;
				<img @click="countStar(5)" class="per-star-cell" src="static/img/star_off.png" />
			</div>
		</div>
		<div class="textarea-style">
			<textarea v-model="textValue" placeholder="填写评价..."></textarea>
		</div>
		<div class="tl image-style">
			<img class="per-image-cell" v-for="(img, i) in imgs" :src="img.img_thumb">
			<form class="tl image-style-box" id="imageUploadForm" ref='uploadPictureForm'>
				<img class="img-icon" src="static/img/photo.png"/>
				<input class="image-input" type="file" name="myfile" accept="image/*" @change="uploadPicture" />
			</form>
		</div>
		<div @click='submitMyComment()' class="white tc font-size-15 bottom-box">
			发布商品评价
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_comment',
	data () {
		return {
			textValue: '',
			imgs: [],
			imgs2: [],
			order_id: '',
			startCount: '',
			titleMsg: '商品评价',
		}
	},
	components: {
		headerBox: require('./headerBox').default,
	},
	created () {
		this.order_id = this.$route.query.order_id
	},
	methods: {
		uploadPicture (e) {
			let fd = new FormData(), file = e.target.files[0], that = this
			if (file.size >= 2000*1024) {
				that.showDialog('图片不能大于2M，请重新上传!')
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
		countStar (count) {
			let stars = document.getElementsByClassName('per-star-cell')
			for (let i = 0; i < stars.length; i++) {
				if (count > i) {
					stars[i].setAttribute('src', 'static/img/star_on.png')
				} else {
					stars[i].setAttribute('src', 'static/img/star_off.png')
				}
			}
			this.startCount = count
		},
		submitMyComment () {
			let that = this
			if (!this.startCount) {
				this.showDialog('请选择星级评论!')
				return
			}
			if (!this.textValue) {
				this.showDialog('内容不能为空!')
				return
			}
			that.c_ajax({order_id: that.order_id, star: that.startCount, content: that.textValue, img: that.imgs2.join(',')}, 'api.php?c=UserOrder&a=add_comment', function (value) {
				if (value.data.status === 10001) {
					that.showDialog('发布成功!')
					setTimeout(function () {
						that.goBack()
					}, 1500)
				} else if (value.data.status === 10002) {
					that.showDialog('发布失败!')
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

.my_comment {
}

.per-star-cell {
	width: 20px;
}

.top-box {
	height: 80px;
	padding: 10px;
	background-color: #fff;
	width: 100%;
	border-bottom: 1px solid #ccc;
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

.goods-logo {
	width: 60px;
	height: 60px;
}

.top-right-box {
	height: 60px;
	line-height: 60px;
	margin-left: 10px;
}

.textarea-style {
	width: 100%;
	height: 150px;
	padding: 10px;
	background-color: #fff;
	border-bottom: 1px solid #ccc;
}
.textarea-style textarea {
	width: 100%;
	height: 100%;
	border: 0;
	outline: 0;
}

.image-style {
	position: relative;
	height: 150px;
	background-color: #fff;
	padding: 10px;
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
	margin-right: 10px;
	width: 100px;
}
</style>