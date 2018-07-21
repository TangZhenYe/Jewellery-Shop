import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
Vue.prototype.urlPrefix = 'http://www.taiwaskii.com/web/'
Vue.prototype.urlPrefixApp = 'http://www.taiwaskii.com/app/zhubaoshangcheng/'