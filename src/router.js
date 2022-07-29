import Vue from "vue";
import VueRouter from "vue-router";

import Main from "./components/Main.vue";
import MainConvertCsv from "./components/MainConvertCsv.vue";
import MainExtractTD from "./components/MainExtractTD.vue";
import MainConvertInsertCountry from "./components/MainConvertInsertCountry.vue";
import MainGallery from "./components/MainGallery.vue";
import MainLogin from "./components/MainLogin.vue";
import MainRegister from "./components/MainRegister.vue";
import MainVerifyEmail from "./components/MainVerifyEmail.vue";
import MainResetPassword from "./components/MainResetPassword.vue";
import MainAskNewPassword from "./components/MainAskNewPassword.vue";

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
  // {
  //   path: '/convert',
  //   name: 'Convert',
  //   title: 'Convert',
  //   component: MainConvertCsv,
  // },
  // {
  //   path: '/extract',
  //   name: 'Extract',
  //   title: 'Extract',
  //   component: MainExtractTD,
  // },
  // {
  //   path: '/merge',
  //   name: 'Merge',
  //   title: 'Merge',
  //   component: MainConvertInsertCountry,
  // },
  {
    path: '/gallery',
    name: 'Gallery',
    title: 'Gallery',
    component: MainGallery,
  },
  {
    path: '/login',
    name: 'Login',
    title: 'Login',
    component: MainLogin,
  },
  {
    path: '/register',
    name: 'Register',
    title: 'Register',
    component: MainRegister,
  },
  {
    path: '/verifyemail/:token',
    name: 'VerifyEmail',
    title: 'VerifyEmail',
    component: MainVerifyEmail,
  },
  {
    path: '/newpassword/:token',
    name: 'ResetPassword',
    title: 'ResetPassword',
    component: MainResetPassword,
  },
  {
    path: '/asknewpassword',
    name: 'AskNewPassword',
    title: 'AskNewPassword',
    component: MainAskNewPassword,
  },
  {
    path: '*',
    redirect: { name: 'Records' } 
  },
];

window.envType = process.env.NODE_ENV;

const router = new VueRouter({
    routes,
    mode: 'history',
    base: process.env.NODE_ENV === "production" ? "/vue-cli-deploy/" : "/"
});

export default router;
