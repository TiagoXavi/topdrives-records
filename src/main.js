import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";


Vue.config.productionTip = false

window.axios = require('axios');
window.Vue = Vue;
Vue.use(filters);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')


