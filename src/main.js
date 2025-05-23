import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";
import PortalVue from 'portal-vue';
import 'focus-visible';
import VueI18n from 'vue-i18n';
import i18nMessages from './i18n';
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import tip from './filters/tip.js';


Vue.config.productionTip = false

window._merge = require('lodash/merge');
window.axios = require('axios');
window.Vue = Vue;
Vue.directive('tip', tip);
Vue.use(filters);
Vue.use(PortalVue);
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: i18nMessages,
  silentFallbackWarn: true
});
Vue.use({i18n});
Vue.use(VueVirtualScroller)


if (process.env.NODE_ENV === 'production') {
  Vue.preUrl = "https://api.topdrivesrecords.com";
  Vue.preUrlCharlie = "https://charlie.topdrivesrecords.com";
} else {
  Vue.preUrl = "http:///192.168.3.120:3000";
  Vue.preUrlCharlie = "http:///192.168.3.120:3001";
}

new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')


