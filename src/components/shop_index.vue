<template>
  <div class="jewel-index white-b">
    <div class="white tc header-box">
      <div class="arrow-left-icon">
        <mu-icon @click='goBack()' class="icon-arrow-back" value="arrow_back"/>
      </div>
      <span>首页</span>
    </div>
    <div class="header-box-2 tc white-b">
      <mu-icon @click="goCategoryRecommended()" class="icon-search" value="search"/>
      <img @click='goLocation()' class="logo" src="static/img/logo.png"/>
      <img class="sort-style" @click="changeSortType($event)" src="static/img/sort2.png"/>
    </div>
    <div class="ad-box1">
      <div class="content-box-logo">
        <img class="content-box-logo-img another-img" :src="newGoodsSaleUrl"/>
      </div>
    </div>
    <swiper class="swiper white-b" ref="mySwiper">
      <swiper-slide v-for="n in Number(goodsAdSortsLength)" :key="n">
        <div class="goods-ad-sort-box white-b">
          <div @click="goCategoryRecommended(goodsAdSort.cate_id)" v-if="index >= (n-1) * 4 && index < n * 4" class="tc pos-relative width-25per" v-for="(goodsAdSort, index) in goodsAdSorts">
            <div class="goods-ad-sort-logo">
              <img :src="goodsAdSort.img_thumb">
            </div>
            <div class="mar-top-5">
              {{ goodsAdSort.cat_name }}
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="ad-box2">
      <img class="content-box-logo-img another-img" :src="adTwoUrl"/>
    </div>
    <div :class="{'fixed-little-sort': fixedLittleSort }" class="little-sort-box border-bottom-1 white-b">
      <div :class="{'mar-top-5': i > 3 }" @click='getSelectSort(littleSort.id)' :id="littleSort.id" v-for="(littleSort, i) in littleSorts" class="ellip tc black per-little-sort per-line-30 font-size-12 pos-relative">
        {{ littleSort.name }}
      </div>
    </div>
    <div class="white-b">
      <littleSortBox :flag="!flag" :little-sort-contents="littleSortContents"></littleSortBox>
    </div>
    <div class="ad-box2 mar-top-10">
      <img class="content-box-logo-img another-img" :src="adThreeUrl"/>
    </div>
    <div v-if="hideBetweenAd">
      <div class="white-b">
        <littleSortBox :flag="!flag" :little-sort-contents="lastLittleSortContents"></littleSortBox>
      </div>
    </div>
    <div @click='loadMore' class="per-line-30 white-b mar-top-10">{{ loadMsg }}</div>
    <div class="ad-box2 mar-top-10">
      <img class="content-box-logo-img another-img" :src="adFourUrl"/>
    </div>
    <div class="hide-box none-style" v-show="followPublic">
      <div class="white-b erweima" id="erweima">
        <img style="margin: 0; padding: 0; height: 100%; width: 100%;" src="static/img/erweima.jpg">
      </div>
    </div>
    <footerBox :count='1'></footerBox>
  </div>
</template>
<script>
export default {
  name: "shop_index",
  components: {
    littleSortBox: require('./littleSortBox').default,
    footerBox: require('./footerBox').default,
    headerBox: require('./headerBox').default,
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
    }
  },
  created () {
    console.log('首页 created')
    let that = this
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
      let str = 'static/img/sort', a = (this.flag) ? 2 : ""
      e.currentTarget.src = str + a + '.png'
    },
    goLocation () {
      window.location.reload()
    },
    handleScroll () {
      this.scrollTop = $(window).scrollTop()
      this.fixedLittleSort = (this.scrollTop >= 650) ? true : false
      console.log(this.scrollTop)
      // if (this.scrollTop === 3400) {
      //   this.loadMore()
      // }
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
.jewel-index {
  margin-top: 128px;
  margin-bottom: 50px;
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
.header-box-2 {
  position: fixed;
  top: 43px;
  box-shadow: 0 8px 8px #ddd;
  width: 100%;
  height: 42px;
  z-index: 999;
}
.logo {
  margin-top: 14px;
  height: 15px;
  width: 130px;
}
.icon-search {
  position: absolute;
  left: 13px;
  top: 8.5px;
  width: 24px;
  height: 24px;
}
.sort-style {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 12px;
  right: 10px;
}
.ad-box1 {
  width: 100%;
  line-height: 0;
}
.content-box-logo {
  background: rgb(255, 255, 255);
  margin-top: -45px;
}
.ad-box2 {
  line-height: 0;
  background: rgb(255, 255, 255);
}
.content-box-logo-img {
  height: 100%;
}
.goods-ad-sort-box {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}
.goods-ad-sort-logo {
  width: 90%;
  margin: 0 auto;
}
.goods-ad-sort-logo img {
  width: 100%;
  border-radius: 50%;
}
.little-sort-box {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 10px;
  padding-bottom: 5px;
  padding-top: 5px;
}
.per-little-sort {
  width: 24%;
  background-color: #F0F2F5;
  border-radius: 5px;
}
.fixed-little-sort {
  position: fixed;
  top: 85px;
  left: 0;
  width: 100%;
  z-index: 99999;
}
.search-goods {
  padding: 11px 0;
  color: #b8b8b8;
}

.another-img {
  height: auto;
  width: 100%;
  line-height: 0;
}

.swiper {
  padding-top: 20px;
  padding-bottom: 20px;
}

.erweima {
  width: 90%;
  left: 5%;
  top: 50%;
  position: absolute;
}

</style>
