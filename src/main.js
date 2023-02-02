import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";
import PortalVue from 'portal-vue';
import 'focus-visible';
import Hotjar from 'vue-hotjar';
import VueI18n from 'vue-i18n';
import i18nMessages from './i18n';


Vue.config.productionTip = false

window._merge = require('lodash/merge');
window.axios = require('axios');
window.Vue = Vue;
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


if (process.env.NODE_ENV === 'production') {
  Vue.preUrl = "https://api.topdrivesrecords.com";
  Vue.use (Hotjar, {
    id: '3138550'
  })
} else {
  Vue.preUrl = "http:///192.168.3.120:3000";
}

new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')


