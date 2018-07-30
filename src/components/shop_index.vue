<template>
  <div class="white-b mar-bot-50" style="margin-top: 128px;">
    <div class="white tc header-box">
      <div class="arrow-left-icon">
        <mu-icon @click='goBack()' class="icon-arrow-back" value="arrow_back"/>
      </div>
      <span>首页</span>
    </div>
    <div class="tc white-b pos-fixed width-100per border-bottom-1 z-index-999 height-42" style="top: 43px;">
      <mu-icon @click="goCategoryRecommended()" class="pos-absolute" style="left: 13px; top: 8.5px; width: 24px;" value="search"/>
      <img @click='goLocation()' class="mar-top-14 height-15" style="width: 130px;" src="static/img/logo.png"/>
      <img class="pos-absolute" style="width: 20px; top: 12px; right: 10px;" @click="changeSortType($event)" src="static/img/sort2.png"/>
    </div>
    <div class="white-b width-100per" style="margin-top: -45px;">
      <img class="width-100per vertical-align" :src="newGoodsSaleUrl"/>
    </div>
    <swiper class="pad-top-20 pad-bot-20 white-b">
      <swiper-slide v-for="n in Number(goodsAdSortsLength)" :key="n">
        <div class="white-b" :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex', '-moz-box', '-webkit-flex'] }" style="flex-wrap: wrap;">
          <div @click="goCategoryRecommended(goodsAdSort.cate_id)" v-if="index >= (n-1) * 4 && index < n * 4" class="tc pos-relative width-25per" v-for="(goodsAdSort, index) in goodsAdSorts">
            <div class="width-90per" style="margin: 0 auto;">
              <img class="width-100per border-rad-50per" :src="goodsAdSort.img_thumb">
            </div>
            <div class="mar-top-5">
              {{ goodsAdSort.cat_name }}
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="white-b">
      <img class="width-100per vertical-align" :src="adTwoUrl"/>
    </div>
    <div :class="{'fixed-little-sort z-index-99999 pos-fixed width-100per': fixedLittleSort }" class="border-bottom-1 white-b pad-lef-10 pad-rig-10 pad-top-5 pad-bot-5" :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex', '-moz-box', '-webkit-flex'] }" style="flex-flow: row wrap; justify-content: space-between;">
      <div :class="{'mar-top-5': i > 3 }" @click='getSelectSort(littleSort.id)' :id="littleSort.id" v-for="(littleSort, i) in littleSorts" class="ellip tc black width-24per per-line-30 font-size-12 pos-relative border-rad-5" style="background-color: #F0F2F5;">
        {{ littleSort.name }}
      </div>
    </div>
    <div class="white-b">
      <littleSortBox :flag="!flag" :little-sort-contents="littleSortContents"></littleSortBox>
    </div>
    <div class="white-b mar-top-10">
      <img class="width-100per vertical-align" :src="adThreeUrl"/>
    </div>
    <div v-if="hideBetweenAd">
      <div class="white-b">
        <littleSortBox :flag="!flag" :little-sort-contents="lastLittleSortContents"></littleSortBox>
      </div>
    </div>
    <div class="per-line-30 white-b mar-top-10">{{ loadMsg }}</div>
    <div class="white-b mar-top-10">
      <img class="width-100per vertical-align" :src="adFourUrl"/>
    </div>
    <div class="hide-box none-style" v-show="followPublic">
      <div class="white-b pos-absolute width-90per" style="left: 5%; top: 50%;" id="erweima">
        <img style="margin: 0; padding: 0; height: 100%; width: 100%;" src="static/img/erweima.jpg">
      </div>
    </div>

    <footerBox :count="1"></footerBox>

  </div>
</template>
<script>
export default {
  name: "shop_index",
  components: {
    littleSortBox: require('./littleSortBox').default,
    footerBox: require('./footerBox').default,
  },
  data () {
    return {
      flag: true,
      loadMsg: '加载更多',
      newGoodsSaleUrl: '',
      adTwoUrl: '',
      adThreeUrl: '',
      adFourUrl: '',
      newGoodsSaleTitle: '',
      goodsAdSorts: [],
      goodsAdSortsLength: 0,
      littleSorts: [],
      littleSortContents: [],
      lastLittleSortContents: [],
      goodsAdSortLength: '',
      fixedLittleSort: false,
      hideBetweenAd: true,
      num: 12,
      p: 1,
      count: 3,
      scrollTop: 0,
      followPublic: '',
      test: 'static/img/share_logo.jpg',
      isLoading: true,
    }
  },
  created () {
    console.log('首页 created')
    let that = this
    that.$store.commit('updateCountNum', {countNum: 1})
    that.c_ajax({}, 'api.php?c=User&a=is_subscribe', function (value) {
      that.followPublic = (value.data.is_subscribe === 0) ? true : false
    })

    that.c_ajax({cate_id: 1}, 'api.php?c=ad&a=lists', function (value) {
      if (value.data.status === 10001) {
        that.newGoodsSaleUrl = that.urlPrefix + value.data.lists[0]['img']

        that.$store.commit('updateScopeImgUrl', {scopeImgUrl: that.newGoodsSaleUrl})

        that.newGoodsSaleTitle = value.data.lists[0]['title']
      }
    })
    that.c_ajax({cate_id: 2}, 'api.php?c=ad&a=lists', function (value) {
      if (value.data.status === 10001) {
        that.adTwoUrl = that.urlPrefix + value.data.lists[0]['img']
      }
    })
    that.c_ajax({cate_id: 3}, 'api.php?c=ad&a=lists', function (value) {
      if (value.data.status === 10001) {
        that.adThreeUrl = that.urlPrefix + value.data.lists[0]['img']
      }
    })
    that.c_ajax({cate_id: 4}, 'api.php?c=ad&a=lists', function (value) {
      if (value.data.status === 10001) {
        that.adFourUrl = that.urlPrefix + value.data.lists[0]['img']
      }
    })
    that.c_ajax({}, 'api.php?c=ShopCategory&a=index_cate', function (value) {
      if (value.data.status === 10001) {
        if (value.data.lists.length % 4 === 0) {
          that.goodsAdSortLength = value.data.lists.length / 4
        } else {
          that.goodsAdSortLength = Math.floor((value.data.lists.length / 4)) + 1
        }
        for (let v of value.data.lists) {
          that.goodsAdSorts.push({
            cate_id: v['cate_id'],
            cat_name: v['cat_name'],
            img_thumb: (v['img_thumb']) ? that.urlPrefix + v['img_thumb'] : that.test,
          })
        }
        that.goodsAdSortsLength = that.goodsAdSortLength
      }
    })
    that.c_ajax({}, 'api.php?c=ShopCategory&a=home_cate', function (value) {
      if (value.data.status === 10001) {
        for (let v of value.data.lists) {
          that.littleSorts.push(v)
        }
      }
    })
    that.c_ajax({num: that.num, p: that.p}, 'api.php?c=ShopGoods&a=lists', function (value) {
      if (value.data.status === 10001) {
        for (let v of value.data.lists) {
          that.littleSortContents.push(v)
        }
      } else {
        that.littleSortContents = []
      }
    })
    that.c_ajax({num: that.num, p: that.p + 1}, 'api.php?c=ShopGoods&a=lists', function (value) {
      if (value.data.status === 10001) {
        for (let v of value.data.lists) {
          that.lastLittleSortContents.push(v)
        }
      } else {
        that.lastLittleSortContents = []
        that.loadMsg = '没有更多商品了'
      }
    })
  },
  mounted () {
    this.getShare()
    window.addEventListener('scroll', this.handleScroll)
  },
  activated () {
    let backScroll = window.localStorage.getItem('scroll')
    $(window).scrollTop(Number(backScroll))
  },
  updated () {
    // 二维码的 自适应高度
    let erweimaDom = document.getElementById('erweima'), tempWidth = erweimaDom.offsetWidth, tempHeight = 4 / 3 * tempWidth
    erweimaDom.style.height = tempHeight + 'px'
    erweimaDom.style.marginTop = -tempHeight / 2 + 'px'
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'shop_index' && to.name !== 'shop_index') {
        localStorage.setItem('scroll', JSON.stringify(this.scrollTop))
      }
    }
  },
  methods: {
    loadMore () {
      if (this.loadMsg === '没有更多商品了') {
        return
      }
      let that = this
      that.c_ajax({num: that.num, p: that.count++}, 'api.php?c=ShopGoods&a=lists', function (value) {
        if (value.data.status === 10001) {
          that.isLoading = true
          for (let v of value.data.lists) {
            that.lastLittleSortContents.push(v)
          }
        } else {
          that.loadMsg = '没有更多商品了'
        }
      })
    },
    changeSortType (e) {
      this.flag = !this.flag
      let [str, a] = ['static/img/sort', (this.flag) ? 2 : ""]
      e.currentTarget.src = str + a + '.png'
    },
    goLocation () {
      window.location.reload()
    },
    handleScroll () {
      this.scrollTop = $(window).scrollTop()
      this.fixedLittleSort = (this.scrollTop >= 650) ? true : false

      let bottomOfWindow = document.documentElement.offsetHeight - this.scrollTop - window.innerHeight
      if (bottomOfWindow <= 200 && this.isLoading) {
        this.isLoading = false
        this.loadMore()
      }

    },
    getSelectSort (parentId) {
      if (this.scrollTop >= 700) {
        $(window).scrollTop(700)
      }
      let that = this
      that.hideBetweenAd = false
      that.loadMsg = '没有更多商品了'
      that.c_ajax({home_cate: parentId}, 'api.php?c=ShopGoods&a=lists', function (value) {
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
  }
}
</script>


<style scoped>

.fixed-little-sort {
  top: 85px;
  left: 0;
}

.header-box {
  height: 43px;
  border-bottom: 1px solid #000;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #444;
  font-size: 16px;
  line-height: 43px;
  z-index: 999;
}
.arrow-left-icon {
  position: absolute;
  left: 13px;
  top: 8.5px;
  width: 24px;
  height: 24px;
}
.icon-arrow-back {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>