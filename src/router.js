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
import MainDownTimes from "./components/MainDownTimes.vue";
import MainTranslate from "./components/MainTranslate.vue";
import MainNewPhotos from "./components/MainNewPhotos.vue";
import MainTestPoints from "./components/MainTestPoints.vue";
import MainAddNewCars from "./components/MainAddNewCars.vue";
import MainCheatSheet from "./components/MainCheatSheet.vue";
import MainCodeUtility from "./components/MainCodeUtility.vue";
import BaseMergeDatabase from "./components/BaseMergeDatabase.vue";

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
    path: '/',
    name: 'Records',
    component: Main,
  },
  {
    path: '/compare',
    name: 'Compare',
    component: Main,
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: Main,
  },
  {
    path: '/events',
    name: 'Events',
    component: Main,
  },
  {
    path: '/clubs',
    name: 'Clubs',
    component: Main,
  },
  // {
  //   path: '/convert',
  //   name: 'Convert',
  //   component: MainConvertCsv,
  // },
  {
    path: '/extract', // internal
    name: 'Extract',
    component: MainExtractTD,
  },
  // {
  //   path: '/merge',
  //   name: 'Merge',
  //   component: MainConvertInsertCountry,
  // },
  {
    path: '/gallery',
    name: 'Gallery',
    component: MainGallery,
  },
  {
    path: '/MainCarsEdit', // internal
    name: 'MainCarsEdit',
    component: MainCarsEdit,
  },
  {
    path: '/validatejson', // internal
    name: 'Validate',
    component: MainValidateFinalJson,
  },
  {
    path: '/importrude', // internal
    name: 'ImportRude',
    component: MainImportRude,
  },
  {
    path: '/swagger', // internal
    name: 'MainSwagger',
    component: MainSwagger,
  },
  {
    path: '/charts',
    name: 'MainCharts',
    component: MainCharts,
  },
  {
    path: '/findCar',
    name: 'MainFindCar',
    component: MainFindCar,
  },
  {
    path: '/newPhotos',
    name: 'MainNewPhotos',
    component: MainNewPhotos,
  },
  {
    path: '/addNewCars',
    name: 'MainAddNewCars',
    component: MainAddNewCars,
  },
  {
    path: '/c',
    name: 'MainCheatSheet',
    component: MainCheatSheet,
  },
  {
    path: '/codeutil',
    name: 'MainCodeUtility',
    component: MainCodeUtility,
  },
  {
    path: '/BaseMergeDatabase',
    name: 'BaseMergeDatabase',
    component: BaseMergeDatabase,
  },
  {
    path: '/testPoints',
    name: 'MainTestPoints',
    component: MainTestPoints,
  },
  {
    path: '/downTimes',
    name: 'MainDownTimes',
    component: MainDownTimes,
  },
  {
    path: '/translate',
    name: 'MainTranslate',
    component: MainTranslate,
  },
  {
    path: '/analysedb', // internal
    name: 'AnalyseDb',
    component: MainAnalyseDb,
  },
  {
    path: '/newrq', // internal
    name: 'Update RQ',
    component: MainUpdateRqData,
  },
  {
    path: '/templateguide',
    name: 'TemplateGuidelines',
    component: MainTemplateGuidelines,
  },
  {
    path: '/login',
    name: 'Login',
    component: MainLogin,
  },
  {
    path: '/register',
    name: 'Register',
    component: MainRegister,
  },
  {
    path: '/verifyemail',
    name: 'VerifyEmail',
    component: MainVerifyEmail,
  },
  {
    path: '/newpassword',
    name: 'ResetPassword',
    component: MainResetPassword,
  },
  {
    path: '/asknewpassword',
    name: 'AskNewPassword',
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
