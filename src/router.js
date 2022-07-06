import Vue from "vue";
import VueRouter from "vue-router";

import Main from "./components/Main.vue";
import MainConvertCsv from "./components/MainConvertCsv.vue";
import MainExtractTD from "./components/MainExtractTD.vue";
import MainConvertInsertCountry from "./components/MainConvertInsertCountry.vue";

Vue.use(VueRouter);

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home
//   },
//   {
//     path: "/about",
//     name: "About",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "about" */ "../views/About.vue")
//   }
// ];
const routes = [
  {
    path: '',
    name: 'Records',
    component: Main,
    title: 'Records',
  },
  {
    path: '/convert',
    name: 'Convert',
    title: 'Convert',
    component: MainConvertCsv,
  },
  {
    path: '/extract',
    name: 'Extract',
    title: 'Extract',
    component: MainExtractTD,
  },
  {
    path: '/merge',
    name: 'Merge',
    title: 'Merge',
    component: MainConvertInsertCountry,
  },
  {
    path: '*',
    redirect: { name: 'Records' } 
  },
];

const router = new VueRouter({
    routes,
    mode: 'history',
});

export default router;
