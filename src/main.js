// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ko'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import Const from './components/source/const.js'
import VueI18n from 'vue-i18n'
import messages from '@/lang/i18n'

Vue.use(VueI18n)
Vue.use(VueAxios, axios)
Vue.use(ElementUI, {locale})
Vue.use(Const)
Vue.config.productionTip = false

// user login token
axios.defaults.headers.common['Authorization'] = localStorage.getItem('user-token')

const i18n = new VueI18n({
  locale: localStorage.getItem('user-locale') ? localStorage.getItem('user-locale') : 'ko',
  messages
})

const userInfo = ({
  name: '',
  isLogin: false
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n: i18n,
  userInfo: userInfo,
  router,
  components: { App },
  template: '<App/>'
})

axios.interceptors.request.use(function (config) {
  console.log('request => config ====================================')
  console.log(config)
  console.log('request => config ====================================')

  // if u add new Chainable promise or other interceptor
  // You have to return `config` inside of a rquest
  // otherwise u will get a very confusing error
  // and spend sometime to debug it.
  return config
}, function (error) {
  return Promise.reject(error)
})
