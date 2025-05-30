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


Vue.config.productionTip = false;

import _merge from 'lodash/merge';
import axios from 'axios';

window._merge = _merge;
window.axios = axios;
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


if (import.meta.env.PROD) {
  Vue.preUrl = "https://api.topdrivesrecords.com";
  Vue.preUrlCharlie = "https://charlie.topdrivesrecords.com";
} else {
  Vue.preUrl = window.location.origin.replace(window.location.port, "3000");
  Vue.preUrlCharlie = window.location.origin.replace(window.location.port, "3001");
}

new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')


