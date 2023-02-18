import Vue from "vue";
import VueRouter from "vue-router";

import Main from "./components/Main.vue";
// import MainConvertCsv from "./components/MainConvertCsv.vue";
import MainExtractTD from "./components/MainExtractTD.vue";
// import MainConvertInsertCountry from "./components/MainConvertInsertCountry.vue";
import MainGallery from "./components/MainGallery.vue";
import MainCarsEdit from "./components/MainCarsEdit.vue";
import MainUpdateRqData from "./components/MainUpdateRqData.vue";
import MainValidateFinalJson from "./components/MainValidateFinalJson.vue";
import MainImportRude from "./components/MainImportRude.vue";
import MainAnalyseDb from "./components/MainAnalyseDb.vue";
import MainSwagger from "./components/MainSwagger.vue";
import MainCharts from "./components/MainCharts.vue";
import MainFindCar from "./components/MainFindCar.vue";
import MainTranslate from "./components/MainTranslate.vue";

import MainTemplateGuidelines from "./components/MainTemplateGuidelines.vue";
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
  {
    path: '/extract', // internal
    name: 'Extract',
    title: 'Extract',
    component: MainExtractTD,
  },
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
    path: '/MainCarsEdit', // internal
    name: 'MainCarsEdit',
    title: 'MainCarsEdit',
    component: MainCarsEdit,
  },
  {
    path: '/validatejson', // internal
    name: 'Validate',
    title: 'Validate',
    component: MainValidateFinalJson,
  },
  {
    path: '/importrude', // internal
    name: 'ImportRude',
    title: 'ImportRude',
    component: MainImportRude,
  },
  {
    path: '/swagger', // internal
    name: 'MainSwagger',
    title: 'MainSwagger',
    component: MainSwagger,
  },
  {
    path: '/charts',
    name: 'MainCharts',
    title: 'MainCharts',
    component: MainCharts,
  },
  {
    path: '/findCar',
    name: 'MainFindCar',
    title: 'MainFindCar',
    component: MainFindCar,
  },
  {
    path: '/translate',
    name: 'MainTranslate',
    title: 'MainTranslate',
    component: MainTranslate,
  },
  {
    path: '/analysedb', // internal
    name: 'AnalyseDb',
    title: 'AnalyseDb',
    component: MainAnalyseDb,
  },
  {
    path: '/newrq', // internal
    name: 'Update RQ',
    title: 'Update RQ',
    component: MainUpdateRqData,
  },
  {
    path: '/templateguide',
    name: 'TemplateGuidelines',
    title: 'TemplateGuidelines',
    component: MainTemplateGuidelines,
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
    mode: 'history'
});

export default router;
