import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
  {
    path: '/my_completeMessage',
    name: 'my_completeMessage',
    component: resolve => require(['@/components/my_completeMessage'], resolve),
  },
  {
    path: '/shop_index',
    name: 'shop_index',
    component: resolve => require(['@/components/shop_index'], resolve),
    meta: { keepAlive: true },
  },
  {
    path: '/user_register',
    name: 'user_register',
    component: resolve => require(['@/components/user_register'], resolve),
  },
  {
    path: '/my_message',
    name: 'my_message',
    component: resolve => require(['@/components/my_message'], resolve),
  },
  {
    path: '/my_tixian',
    name: 'my_tixian',
    component: resolve => require(['@/components/my_tixian'], resolve),
  },
  {
    path: '/my_backGoods',
    name: 'my_backGoods',
    component: resolve => require(['@/components/my_backGoods'], resolve),
  },
  {
    path: '/my_comment',
    name: 'my_comment',
    component: resolve => require(['@/components/my_comment'], resolve),
  },
  {
    path: '/my_shipping',
    name: 'my_shipping',
    component: resolve => require(['@/components/my_shipping'], resolve),
  },
  {
    path: '/my_applySale',
    name: 'my_applySale',
    component: resolve => require(['@/components/my_applySale'], resolve),
  },
  {
    path: '/my_jifen',
    name: 'my_jifen',
    component: resolve => require(['@/components/my_jifen'], resolve),
  },
  {
    path: '/cart_newAddress',
    name: 'cart_newAddress',
    component: resolve => require(['@/components/cart_newAddress'], resolve),
  },
  {
    path: '/cart_addressLists',
    name: 'cart_addressLists',
    component: resolve => require(['@/components/cart_addressLists'], resolve),
  },
  {
    path: '/cart_editAddress',
    name: 'cart_editAddress',
    component: resolve => require(['@/components/cart_editAddress'], resolve),
  },
  {
    path: '/cart_confirmOrder',
    name: 'cart_confirmOrder',
    component: resolve => require(['@/components/cart_confirmOrder'], resolve),
  },
  {
    path: '/my_member',
    name: 'my_member',
    component: resolve => require(['@/components/my_member'], resolve),
  },
  {
    path: '/my_team',
    name: 'my_team',
    component: resolve => require(['@/components/my_team'], resolve),
  },
  {
    path: '/my_businessLists',
    name: 'my_businessLists',
    component: resolve => require(['@/components/my_businessLists'], resolve),
  },
  {
    path: '/my_erweima',
    name: 'my_erweima',
    component: resolve => require(['@/components/my_erweima'], resolve),
  },
  {
    path: '/my_order_detail',
    name: 'my_order_detail',
    component: resolve => require(['@/components/my_order_detail'], resolve),
  },
  {
    path: '/my_help',
    name: 'my_help',
    component: resolve => require(['@/components/my_help'], resolve),
  },
  {
    path: '/my_suggest',
    name: 'my_suggest',
    component: resolve => require(['@/components/my_suggest'], resolve),
  },
  {
    path: '/category_index',
    name: 'category_index',
    component: resolve => require(['@/components/category_index'], resolve),
  },
  {
    path: '/my_order',
    name: 'my_order',
    component: resolve => require(['@/components/my_order'], resolve),
  },
  {
    path: '/my_collect',
    name: 'my_collect',
    component: resolve => require(['@/components/my_collect'], resolve),
  },
  {
    path: '/cart_index',
    name: 'cart_index',
    component: resolve => require(['@/components/cart_index'], resolve),
  },
  {
    path: '/category_recommended',
    name: 'category_recommended',
    component: resolve => require(['@/components/category_recommended'], resolve),
  },
  {
    path: '/category_goodsDetail',
    name: 'category_goodsDetail',
    component: resolve => require(['@/components/category_goodsDetail'], resolve),
  },
  {
    path: '/my_index',
    name: 'my_index',
    component: resolve => require(['@/components/my_index'], resolve),
  },
  {
    path: '/',
    redirect: '/shop_index',
  },
  ],
})
