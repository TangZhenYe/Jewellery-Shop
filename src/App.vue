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
      canShowLoad: true,
      titleMsg: '',
      flag: false,
      nx: 0,
      ny: 0,
      dx: 0,
      dy: 0,
      x: 0,
      y: 0,
      cur: { x: 0, y: 0 },
      mobile_icon_div: '',
      isWeiXin: '',
      appId: '',
      timestamp: '',
      nonceStr: '',
      signature: '',
      parent_id: '',
    }
  },
  components: {
    circularProgress: require('./components/circularProgress').default,
    headerBox: require('./components/headerBox').default,
  },
  created () {
    let that = this, nowDate = new Date().getTime(), locationHref = window.location.href
    that.isWeiXin = that.is_weixin()
    // alert(that.isWeiXin)
    if (that.isWeiXin) {

      if (that.getQueryString('token') || that.getLocalObj('user').token) {
        if (!that.getQueryString('token')) {
          console.log('本地有token ' + that.getLocalObj('user').token)
          // 本地有token
          // 用现在时间减去本地存储的时间判断是否过期
          if (new Date().getTime() - that.getLocalObj('user').token_time >= 3600 * 2 * 1000) {
            // 清空本地存储
            console.log('时间过期')
            that.setLocalObj('user', { token: '', token_time: '', })
            that.showDialog('时间过期, 重新授权登录')
            that.goLogin(locationHref)
          }
        } else {
          console.log('链接后面的token ' + that.getQueryString('token'))
          // 链接有token 表示授权后的
          // 保存授权后的token 并创建最新时间 放进本地存储
          that.setLocalObj('user', { token: that.getQueryString('token'), token_time: new Date().getTime() })
        }
        that.$store.commit('updateToken', { token: that.getLocalObj('user').token, token_time: that.getLocalObj('user').token_time })
      } else {
        that.showDialog('重新授权登录')
        that.goLogin(locationHref)
      }


    } else {
      //电脑登录调试
      that.$store.commit('updateToken', { token: that.getQueryString('tempToken'), token_time: new Date().getTime() })
      that.setLocalObj('user', { token: that.getQueryString('tempToken'), token_time: new Date().getTime() })

      // that.$store.commit('updateToken', { token: 'e4191d610537305de1d294adb121b513', token_time: nowDate })
      // that.setLocalObj('user', { token: 'e4191d610537305de1d294adb121b513', token_time: nowDate })

      // that.$store.commit('updateToken', { token: 'b7a782741f667201b54880c925faec4b', token_time: nowDate })
      // that.setLocalObj('user', { token: 'b7a782741f667201b54880c925faec4b', token_time: nowDate })
    }
    // 统一拦截器 请求
    that.$ajax.interceptors.request.use(function (config) {
      that.canShowLoad = true
      setTimeout(function () {
        that.canShowLoad = false
      }, 10000)
      return config
    }, function (error) {
      return Promise.reject(error)
    })
    // 统一拦截器 回传
    that.$ajax.interceptors.response.use(function (response) {
      // token不匹配
      if (response.data) {
        if (response.data.status === 20000 && response.data.msg === 'token不匹配') {
          let fullAdrr = that.urlPrefixApp + '#/shop_index'
          that.goLogin(fullAdrr)
        }
      }
      // token过期
      // if (new Date().getTime() - that.getLocalObj('user').token_time >= 3600 * 2 * 1000) {
      //   that.showDialog('时间过期, 重新授权登录')
      //   that.goLogin(locationHref)
      // }
      // token不存在
      if (!that.getLocalObj('user').token) {
        that.showDialog('重新授权登录')
        that.goLogin(locationHref)
      }
      that.canShowLoad = false
      that.titleMsg = that.$store.state.title_msg
      return response
    }, function (error) {
      return Promise.reject(error)
    })
  },
  methods: {
    down () {
      let that = this, touch
      that.flag = true
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      that.cur.x = touch.clientX
      that.cur.y = touch.clientY
      that.dx = that.mobile_icon_div.offsetLeft
      that.dy = that.mobile_icon_div.offsetTop
    },
    move () {
      let that = this
      if (that.flag) {
        let touch, w, h, w1, h1
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        that.nx = touch.clientX - that.cur.x
        that.ny = touch.clientY - that.cur.y
        that.x = that.dx + that.nx
        that.y = that.dy + that.ny
        w = document.getElementById("mobile_icon_div").offsetWidth
        h = document.getElementById("mobile_icon_div").offsetHeight
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
    (function() {
      let _53code = document.createElement("script")
      _53code.src = "https://tb.53kf.com/code/code/10161045/2"
      let s = document.getElementsByTagName("script")[0]
      s.parentNode.insertBefore(_53code, s)
    })()
    let that = this
    setTimeout(function () {
      that.mobile_icon_div = document.getElementById("mobile_icon_div")
      that.mobile_icon_div.addEventListener("touchstart", function () {
        that.down()
      }, false)
      that.mobile_icon_div.addEventListener("touchmove", function () {
        that.move()
      }, false)
      that.mobile_icon_div.addEventListener("touchend", function () {
        that.end()
        window.addEventListener("touchmove", function (e) {
          e.returnValue = true
        }, false)
      }, false)
      that.mobile_icon_div.addEventListener("mousedown", function () {
        that.down()
      }, false)
      that.mobile_icon_div.addEventListener("mousemove", function () {
        that.move()
      }, false)
      document.body.addEventListener("mouseup", function () {
        that.end()
      }, false)
      let tempSpan = (document.getElementById('mobile_icon_div')).getElementsByTagName('span')[0]
      let time = setInterval(function () {
        if (tempSpan.innerText) {
          tempSpan.innerText = '客服'
          clearInterval(time)
        }
      }, 500)
    }, 2000)

    // 一次性分享获得积分
    // let tempShareUser = that.getQueryString('share_user')
    // if (tempShareUser) {
    //   that.c_ajax({share_user: tempShareUser}, 'api.php?c=UserPoints&a=share_points', function (value) {
    //     if (value.data.status === 10001) {
    //     } else {
    //       that.showDialog(value.data.msg)
    //     }
    //   })
    // }

    // 分享
    let locationHref = window.location.href
    if (that.isWeiXin) {
      that.c_ajax({}, 'api.php?c=ShareUser&a=team_lists', function (value) {
        that.parent_id = value.data.share_detail.user_id
        that.$store.commit('updateParentId', { parent_id: that.parent_id, })
        that.c_ajax({url: locationHref}, 'api.php?c=Weixin&a=set_jssdk', function (value) {
          that.appId = value.data.wxconfig.appid
          that.timestamp = value.data.wxconfig.timestamp
          that.nonceStr = value.data.wxconfig.noncestr
          that.signature = value.data.wxconfig.signature
          that.share_base(that.appId, that.timestamp, that.nonceStr, that.signature, 'false')
          that.share('泰華詩奇國際珠寳邀請您', '点击进入商城', that.urlPrefix + 'api.php?c=WeixinLogin&a=authorize&url=' + encodeURIComponent(that.urlPrefixApp + "#/shop_index?parent_id=" + that.$store.state.parent_id + "&share_user=" + that.$store.state.parent_id) + '&parent_id=' + that.$store.state.parent_id + '&share_user=' + that.$store.state.parent_id + '', that.urlPrefixApp + 'static/img/share_logo.jpg')
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
