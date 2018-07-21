import Vue from 'vue'

// 倒退
Vue.prototype.goBack = function () { this.$router.go(-1) }
// 购物车
Vue.prototype.goCartIndex = function () {
	this.$router.push({ name: 'cart_index', path: './cart_index', })
}
// 首页
Vue.prototype.goShopIndex = function () {
	this.$router.push({ name: 'shop_index', path: './shop_index', })
}
// 分类
Vue.prototype.goCategoryIndex = function () {
	this.$router.push({ name: 'category_index', path: './category_index', })
}
// 我的
Vue.prototype.goMyIndex = function () {
	this.$router.push({ name: 'my_index', path: './my_index', })
}
// 返回首页
Vue.prototype.goHome = function () {
	window.location.href = this.urlPrefixApp + '#/shop_index'
}
// 查看物流
Vue.prototype.goMyShipping = function (order_id) {
	this.$router.push({ name: 'my_shipping', path: './my_shipping', query: { order_id: order_id, }, })
}
// 售后申请
Vue.prototype.goMyApplySale = function (order_id, type) {
	this.$router.push({ name: 'my_applySale', path: './my_applySale', query: { order_id: order_id, type: type, }, })
}
// 商品推荐
Vue.prototype.goCategoryRecommended = function (cate_id) {
	this.$router.push({ name: 'category_recommended', path: './category_recommended', query: { cate_id: cate_id, }, })
}
// 业务统计
Vue.prototype.goMyBusinessLists = function () {
	this.$router.push({ name: 'my_businessLists', path: './my_businessLists', })
}
// 商品详情
Vue.prototype.goCategoryGoodsDetail = function (goods_id) {
	this.$router.push({ name: 'category_goodsDetail', path: './category_goodsDetail', query: { goods_id: goods_id, }, })
}
// 订单详情
Vue.prototype.goMyOrderDetail = function (order_id) {
	this.$router.push({ name: 'my_order_detail', path: './my_order_detail', query: { order_id: order_id, }, })
}
// 确认订单
Vue.prototype.goCartConfirmOrder = function (cart_id_str) {
	this.$router.push({ name: 'cart_confirmOrder', path: './cart_confirmOrder', query: { cart_id_str: cart_id_str, }, })
}
// 代理注册
Vue.prototype.goUserRegister = function () {
	this.$router.push({ name: 'user_register', path: './user_register', })
}
// 我的积分
Vue.prototype.goMyJifen = function () {
	this.$router.push({ name: 'my_jifen', path: './my_jifen', })
}
// 我的提现
Vue.prototype.goMyTixian = function () {
	this.$router.push({ name: 'my_tixian', path: './my_tixian', })
}
// 完善个人资料
Vue.prototype.goMyCompleteMessage = function () {
	this.$router.push({ name: 'my_completeMessage', path: './my_completeMessage', })
}
// 个人资料
Vue.prototype.goMyMessage = function () {
	this.$router.push({ name: 'my_message', path: './my_message', })
},
// 商品评价
Vue.prototype.goMyComment = function (order_id) {
	this.$router.push({ name: 'my_comment', path: './my_comment', query: { order_id: order_id, }, })
}
// 退货物流信息
Vue.prototype.goMyBackGoods = function (order_id) {
	this.$router.push({ name: 'my_backGoods', path: './my_backGoods', query: { order_id: order_id, }, })
}
// 我的订单
Vue.prototype.goMyOrder = function () {
	this.$router.push({ name: 'my_order', path: './my_order', })
}
// 地址管理
Vue.prototype.goCartAddressLists = function (is_receive, cart_id_str) {
	this.$router.push({ name: 'cart_addressLists', path: './cart_addressLists', query: { is_receive: 1, cart_id_str: cart_id_str, }, })
}
// 修改地址
Vue.prototype.goCartEditAddress = function (is_receive, address_id) {
	this.$router.push({ name: 'cart_editAddress', path: './cart_editAddress', query: { is_receive: is_receive, address_id: address_id, }, })
}
// 新建地址
Vue.prototype.goCartNewAddress = function (is_receive) {
	this.$router.push({ name: 'cart_newAddress', path: './cart_newAddress', query: { is_receive: is_receive, }, })
}
// 我的成员
Vue.prototype.goMyMember = function (share_grade) {
	this.$router.push({ name: 'my_member', path: './my_member', query: { share_grade: share_grade, }, })
}
// 我的收藏
Vue.prototype.goMyCollect = function () {
	this.$router.push({ name: 'my_collect', path: './my_collect', })
}
// 我的二维码
Vue.prototype.goMyErWeiMa = function (type) {
	this.$router.push({ name: 'my_erweima', path: './my_erweima', query: { type: type, } })
}
// 问题反馈
Vue.prototype.goMySuggest = function () {
	this.$router.push({ name: 'my_suggest', path: './my_suggest', })
}
// 使用帮助
Vue.prototype.goMyHelp = function () {
	this.$router.push({ name: 'my_help', path: './my_help', })
}
// 我的客户
Vue.prototype.goMyTeam = function () {
	this.$router.push({name: 'my_team', path: './my_team', })
}