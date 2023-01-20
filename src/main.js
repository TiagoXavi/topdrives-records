import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";
import PortalVue from 'portal-vue';
import 'focus-visible';
import LogRocket from 'logrocket';
import Hotjar from 'vue-hotjar';


Vue.config.productionTip = false

window._merge = require('lodash/merge');
window.axios = require('axios');
window.Vue = Vue;
Vue.use(filters);
Vue.use(PortalVue);


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
  render: h => h(App),
}).$mount('#app')


