import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";
import PortalVue from 'portal-vue';


Vue.config.productionTip = false

window.axios = require('axios');
window.Vue = Vue;
Vue.use(filters);
Vue.use(PortalVue);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')


