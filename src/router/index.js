import Vue from 'vue'
import Router from 'vue-router'
import shop_index from '@/components/shop_index'
import user_register from '@/components/user_register'
import category_index from '@/components/category_index'
import category_recommended from '@/components/category_recommended'
import category_goodsDetail from '@/components/category_goodsDetail'
import cart_index from '@/components/cart_index'
import cart_confirmOrder from '@/components/cart_confirmOrder'
import cart_addressLists from '@/components/cart_addressLists'
import cart_editAddress from '@/components/cart_editAddress'
import cart_newAddress from '@/components/cart_newAddress'
import my_index from '@/components/my_index'
import my_order from '@/components/my_order'
import my_collect from '@/components/my_collect'
import my_suggest from '@/components/my_suggest'
import my_help from '@/components/my_help'
import my_order_detail from '@/components/my_order_detail'
import my_erweima from '@/components/my_erweima'
import my_businessLists from '@/components/my_businessLists'
import my_team from '@/components/my_team'
import my_member from '@/components/my_member'
import my_message from '@/components/my_message'
import my_jifen from '@/components/my_jifen'
import my_tixian from '@/components/my_tixian'
import my_applySale from '@/components/my_applySale'
import my_shipping from '@/components/my_shipping'
import my_comment from '@/components/my_comment'
import my_completeMessage from '@/components/my_completeMessage'
import my_backGoods from '@/components/my_backGoods'
Vue.use(Router)

export default new Router({
  routes: [
  {
    path: '/my_completeMessage',
    name: 'my_completeMessage',
    component: my_completeMessage,
  },
  {
    path: '/shop_index',
    name: 'shop_index',
    component: shop_index,
    meta: { keepAlive: true },
  },
  {
    path: '/user_register',
    name: 'user_register',
    component: user_register,
  },
  {
    path: '/my_message',
    name: 'my_message',
    component: my_message,
  },
  {
    path: '/my_tixian',
    name: 'my_tixian',
    component: my_tixian,
  },
  {
    path: '/my_backGoods',
    name: 'my_backGoods',
    component: my_backGoods,
  },
  {
    path: '/my_comment',
    name: 'my_comment',
    component: my_comment,
  },
  {
    path: '/my_shipping',
    name: 'my_shipping',
    component: my_shipping,
  },
  {
    path: '/my_applySale',
    name: 'my_applySale',
    component: my_applySale,
  },
  {
    path: '/my_jifen',
    name: 'my_jifen',
    component: my_jifen,
  },
  {
    path: '/cart_newAddress',
    name: 'cart_newAddress',
    component: cart_newAddress,
  },
  {
    path: '/cart_addressLists',
    name: 'cart_addressLists',
    component: cart_addressLists,
  },
  {
    path: '/cart_editAddress',
    name: 'cart_editAddress',
    component: cart_editAddress,
  },
  {
    path: '/cart_confirmOrder',
    name: 'cart_confirmOrder',
    component: cart_confirmOrder,
  },
  {
    path: '/my_member',
    name: 'my_member',
    component: my_member,
  },
  {
    path: '/my_team',
    name: 'my_team',
    component: my_team,
  },
  {
    path: '/my_businessLists',
    name: 'my_businessLists',
    component: my_businessLists,
  },
  {
    path: '/my_erweima',
    name: 'my_erweima',
    component: my_erweima,
  },
  {
    path: '/my_order_detail',
    name: 'my_order_detail',
    component: my_order_detail,
  },
  {
    path: '/my_help',
    name: 'my_help',
    component: my_help,
  },
  {
    path: '/my_suggest',
    name: 'my_suggest',
    component: my_suggest,
  },
  {
    path: '/category_index',
    name: 'category_index',
    component: category_index,
  },
  {
    path: '/my_order',
    name: 'my_order',
    component: my_order,
  },
  {
    path: '/my_collect',
    name: 'my_collect',
    component: my_collect,
  },
  {
    path: '/cart_index',
    name: 'cart_index',
    component: cart_index,
  },
  {
    path: '/category_recommended',
    name: 'category_recommended',
    component: category_recommended,
  },
  {
    path: '/category_goodsDetail',
    name: 'category_goodsDetail',
    component: category_goodsDetail,
  },
  {
    path: '/my_index',
    name: 'my_index',
    component: my_index,
  },
  {
    path: '/',
    redirect: '/shop_index',
  },
  ],
})
