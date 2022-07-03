import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";

Vue.config.productionTip = false

window.Vue = Vue;
Vue.use(filters);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')


