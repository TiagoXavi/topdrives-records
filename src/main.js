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
import VueDisqus from 'vue-disqus'


Vue.config.productionTip = false

window.axios = require('axios');
window.Vue = Vue;
Vue.use(filters);
Vue.use(PortalVue);
Vue.use(VueDisqus, {
  shortname: 'topdrivesrecords'
})


if (process.env.NODE_ENV === 'production') {
  // Vue.preUrl = "https://topdrives-records-backend.herokuapp.com";
  Vue.preUrl = "https://api.topdrivesrecords.com";
  LogRocket.init('detmgd/topdrives-records');
  Vue.use (Hotjar, {
    id: '3138550'
  })
} else {
  Vue.preUrl = "http://192.168.15.110:3000";
}

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')


