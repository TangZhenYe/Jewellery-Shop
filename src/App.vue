<template>
  <div id="app">
    <headerBox :title-msg="titleMsg"></headerBox>

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <circularProgress :can-show-load="canShowLoad"></circularProgress>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default {
  name: 'App',
  data () {
    return {
      canShowLoad: true, titleMsg: '', flag: false,
      nx: 0, ny: 0, dx: 0, dy: 0, x: 0, y: 0,
      cur: { x: 0, y: 0 }, mobile_icon_div: '',
      isWeiXin: '', appId: '', timestamp: '',
      nonceStr: '', signature: '',  parent_id: '',
    }
  },
  components: {
    circularProgress: require('./components/circularProgress').default,
    headerBox: require('./components/headerBox').default,
  },
  created () {
    let that = this, nowDate = new Date().getTime(), locationHref = window.location.href
    that.isWeiXin = that.is_weixin()
    if (that.getQueryString('debug')) {
      that.$store.commit('updateDebug', {debug: that.getQueryString('debug')})
    } else {
      that.$store.commit('updateDebug', {debug: 'false'})
    }
    if (that.getQueryString('check_time')) {
      that.$store.commit('updateCheckTime', {check_time: that.getQueryString('check_time')})
    } else {
      that.$store.commit('updateCheckTime', {check_time: 7200})
    }
    if (that.isWeiXin) {
      if (that.getQueryString('token') || that.getLocalObj('user').token) {
        if (that.getQueryString('token')) {
          that.setLocalObj('user', { token: that.getQueryString('token'), token_time: new Date().getTime() })
        } else {
          if (nowDate - that.getLocalObj('user').token_time >= that.$store.state.check_time * 1000) {
            // that.goLogin(window.location.href)
          }
        }
        that.$store.commit('updateToken', { token: that.getLocalObj('user').token, token_time: that.getLocalObj('user').token_time })
      } else {
        that.goLogin(window.location.href)
      }
    } else {
        // 封锁PC并开放tempToken参数
        // that.$store.commit('updateToken', { token: that.getQueryString('tempToken'), token_time: new Date().getTime() })
        // that.setLocalObj('user', { token: that.getQueryString('tempToken'), token_time: new Date().getTime() })

        //PC调试微信端
        that.$store.commit('updateToken', { token: 'e4191d610537305de1d294adb121b513', token_time: nowDate })
        that.setLocalObj('user', { token: 'e4191d610537305de1d294adb121b513', token_time: nowDate })
      }
      // 全局拦截器 请求
      that.$ajax.interceptors.request.use(config => {
        that.canShowLoad = true
        setTimeout(() => { that.canShowLoad = false }, 10000)
        return config
      }, error => { return Promise.reject(error) })

      // 全局拦截器 回传
      that.$ajax.interceptors.response.use(response => {
        that.canShowLoad = false
        that.countNum = that.$store.state.countNum
        that.titleMsg = that.$store.state.title_msg
        return response
      }, error => { return Promise.reject(error) })
    },
    methods: {
      down () {
        let that = this, touch = (event.touches) ? event.touches[0] : event
        that.flag = true
        that.cur.x = touch.clientX
        that.cur.y = touch.clientY
        that.dx = that.mobile_icon_div.offsetLeft
        that.dy = that.mobile_icon_div.offsetTop
      },
      move () {
        let that = this, touch, w, h, w1, h1
        if (that.flag) {
          touch = (event.touches) ? event.touches[0] : event
          that.nx = touch.clientX - that.cur.x
          that.ny = touch.clientY - that.cur.y
          that.x = that.dx + that.nx
          that.y = that.dy + that.ny
          w = that.getDOM("mobile_icon_div").offsetWidth
          h = that.getDOM("mobile_icon_div").offsetHeight
          w1 = document.body.offsetWidth
          h1 = window.screen.height
          if (that.x >= 0 && that.x <= (w1 - w) && that.y >= 0 && that.y <= (h1 - h)) {
            that.mobile_icon_div.style.left = that.x + "px"
            that.mobile_icon_div.style.top = that.y + "px"
          }
          if (that.x < 0 && that.y >= 0 && that.y <= (h1 - h)) {
            that.mobile_icon_div.style.left = 0 + "px"
            that.mobile_icon_div.style.top = that.y + "px"
          }
          if (that.y < 0 && that.x >= 0 && that.x <= (w1 - w)) {
            that.mobile_icon_div.style.left = that.x + "px"
            that.mobile_icon_div.style.top = 0 + "px"
          }
          window.addEventListener('touchmove', function () {
            event.preventDefault()
          }, { passive: false })
        }
      },
      end () {
        this.flag = false
      },
    },
    mounted () {
    // 客服 第三方插件
    (function () {
      let _53code = document.createElement("script"), s = document.getElementsByTagName("script")[0]
      _53code.src = "https://tb.53kf.com/code/code/10161045/2"
      s.parentNode.insertBefore(_53code, s)
    })()
    let that = this
    setTimeout(() => {
      that.mobile_icon_div = that.getDOM("mobile_icon_div")
      that.mobile_icon_div.addEventListener("touchstart", () => { that.down() }, false)
      that.mobile_icon_div.addEventListener("touchmove", () => { that.move() }, false)
      that.mobile_icon_div.addEventListener("touchend", () => { that.end(); window.addEventListener("touchmove", e => { e.returnValue = true }, false) }, false)
      that.mobile_icon_div.addEventListener("mousedown", () => { that.down() }, false)
      that.mobile_icon_div.addEventListener("mousemove", () => { that.move() }, false)
      document.body.addEventListener("mouseup", () => { that.end() }, false)
      let tempSpan = (that.getDOM('mobile_icon_div')).getElementsByTagName('span')[0]
      let time = setInterval(() => { if (tempSpan.innerText) { tempSpan.innerText = '客服'; clearInterval(time) } }, 500) }, 2000)

    // 分享
    if (that.isWeiXin) {
      that.c_ajax({}, 'api.php?c=ShareUser&a=team_lists', function (value) {
        that.parent_id = value.data.share_detail.user_id
        that.$store.commit('updateParentId', { parent_id: that.parent_id, })
        that.c_ajax({url: window.location.href}, 'api.php?c=Weixin&a=set_jssdk', function (value) {
          that.appId = value.data.wxconfig.appid
          that.timestamp = value.data.wxconfig.timestamp
          that.nonceStr = value.data.wxconfig.noncestr
          that.signature = value.data.wxconfig.signature
          that.share_base(that.appId, that.timestamp, that.nonceStr, that.signature, that.$store.state.debug)
          let a = window.location.href, finalUrl = '', tempUrl = ''
          if (that.getQueryString('token')) {
            let tempArr = a.split('?')
            let tempArr2 = tempArr[1].split('&')
            let needPing = tempArr2.length - 2
            for (let i = 0; i < needPing; i++) {
              tempUrl += tempArr2[i] + '&'
            }
            finalUrl = tempArr[0] + '?' + tempUrl
          }
          that.getShare(finalUrl)
        })
      })
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f6f7fe;
}
circle {
  fill: rgb(7, 154, 63);
}
</style>
