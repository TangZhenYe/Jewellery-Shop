import Vue from 'vue'

// 回调ajax
Vue.prototype.c_ajax = function (p, u, c) {
	p.token = this.$store.state.token
	this.$ajax.post(this.urlPrefix + u, this.$qs.stringify(p)).then(value => { c(value) })
}
// 获取本地存储
Vue.prototype.getLocalObj = function (n) {
	return (window.localStorage[n] && typeof window.localStorage[n] !== 'undefined' && window.localStorage[n] !== 'undefined') ? JSON.parse(window.localStorage[n]) : ''
}
// 设置本地存储
Vue.prototype.setLocalObj = function (n, o) {
	window.localStorage[n] = (typeof o === 'object') ? JSON.stringify(o) : o
}
// 微信授权 返回带有token的链接
Vue.prototype.goLogin = function (u) {
	window.location.href = this.urlPrefix + 'api.php?c=WeixinLogin&a=authorize&url=' + encodeURIComponent(u) + ''
}
// 是否微信 这里比较不能用全等
Vue.prototype.is_weixin = function () {
	let ua = window.navigator.userAgent.toLowerCase()
	return (ua.match(/MicroMessenger/i) == "micromessenger") ? true : false
}
// 提取链接里的n
Vue.prototype.getQueryString = function (n) {
	let a = window.location.hash.split("?")[1], r = new RegExp("(^|&)" + n + "=([^&]*)(&|$)")
	if (a) { let r = a.match(r); return (r !== null) ? decodeURIComponent(r[2]) : null }
	return null
}
// 时间戳转时间 3个组合
Vue.prototype.timestampToTime = function (t) {
	let d = new Date(t * 1000), gm = d.getMonth() + 1, gd = d.getDate(), gh = d.getHours(), gmi = d.getMinutes(), gs = d.getSeconds()
	return d.getFullYear() + '-' + this.add0(gm) + '-' + this.add0(gd) + " " + this.add00(this.add0(gh)) + ':' + this.add00(this.add0(gmi)) + ':' + this.add00(this.add0(gs))
}
Vue.prototype.add0 = function (t) {
	return (t >= 1 && t <= 9) ? '0' + t : t
}
Vue.prototype.add00 = function (t) {
	return (t === 0) ? '00' : t
}
// 微信配置
Vue.prototype.share_base = function (appid, timestamp, noncestr, signature, is_debug) {
	let tempDebug = (is_debug !== 'true') ? false : true
	wx.config({ debug: tempDebug, appId: appid, timestamp: timestamp, nonceStr: noncestr, signature: signature, jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', ], })
}
// 微信分享
Vue.prototype.share = function (title, desc, url, imgUrl, scopeUrl, scopeImgUrl) {
	wx.ready(function () {
		wx.onMenuShareTimeline({ title: title, link: scopeUrl, imgUrl: scopeImgUrl, })
		wx.onMenuShareAppMessage({ title: title, desc: desc, link: url, imgUrl: imgUrl, })
	})
}
// 分享不同页面到朋友圈
Vue.prototype.getShare = function (f) {
	let that = this, t = f ? f : window.location.href
	that.share('泰華詩奇國際珠寳邀請您', '点击进入商城', that.urlPrefix + 'api.php?c=WeixinLogin&a=authorize&url=' + encodeURIComponent(that.urlPrefixApp + "#/shop_index?parent_id=" + that.$store.state.parent_id + "&share_user=" + that.$store.state.parent_id) + '&parent_id=' + that.$store.state.parent_id + '&share_user=' + that.$store.state.parent_id + '', that.urlPrefixApp + 'static/img/share_logo.jpg', t, that.$store.state.scopeImgUrl)
}
// 获取DOM
Vue.prototype.getDOM = function (s) {
	return document.getElementById(s)
}