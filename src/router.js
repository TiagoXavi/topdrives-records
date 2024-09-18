import Vue from "vue";
import VueRouter from "vue-router";

const Main = () => import("./components/Main.vue");
const MainExtractTD = () => import("./components/MainExtractTD.vue");
const MainGallery = () => import("./components/MainGallery.vue");
const MainCarsEdit = () => import("./components/MainCarsEdit.vue");
const MainUpdateRqData = () => import("./components/MainUpdateRqData.vue");
const MainValidateFinalJson = () => import("./components/MainValidateFinalJson.vue");
const MainAmplitudeNewCars = () => import("./components/MainAmplitudeNewCars.vue");
const MainImportRude = () => import("./components/MainImportRude.vue");
const MainSwagger = () => import("./components/MainSwagger.vue");
const MainCharts = () => import("./components/MainCharts.vue");
const MainFindCar = () => import("./components/MainFindCar.vue");
const MainDownTimes = () => import("./components/MainDownTimes.vue");
const MainTranslate = () => import("./components/MainTranslate.vue");
const MainNewPhotos = () => import("./components/MainNewPhotos.vue");
const MainTestPoints = () => import("./components/MainTestPoints.vue");
const MainAddNewCars = () => import("./components/MainAddNewCars.vue");
const MainCheatSheet = () => import("./components/MainCheatSheet.vue");
const MainCodeUtility = () => import("./components/MainCodeUtility.vue");
const BaseMergeDatabase = () => import("./components/BaseMergeDatabase.vue");
const MainPacks = () => import("./components/MainPacks.vue");
const MainTimeline = () => import("./components/MainTimeline.vue");
const MainCommunity = () => import("./components/MainCommunity.vue");
const MainStuff = () => import("./components/MainStuff.vue");
const MainAccelCurveMaker = () => import("./components/MainAccelCurveMaker.vue");
const MainTestMatchMake = () => import("./components/MainTestMatchMake.vue");

const MainTemplateGuidelines = () => import("./components/MainTemplateGuidelines.vue");
const MainLogin = () => import("./components/MainLogin.vue");
const MainRegister = () => import("./components/MainRegister.vue");
const MainVerifyEmail = () => import("./components/MainVerifyEmail.vue");
const MainResetPassword = () => import("./components/MainResetPassword.vue");
const MainAskNewPassword = () => import("./components/MainAskNewPassword.vue");

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
  {
    path: '/timeline',
    name: 'Timeline',
    component: MainTimeline,
  },
  {
    path: '/packs',
    name: 'Packs',
    component: MainPacks,
  },
  {
    path: '/community',
    name: 'Community',
    component: MainCommunity,
  },
  {
    path: '/stuff',
    name: 'Stuff',
    component: MainStuff,
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
    path: '/amp', // internal
    name: 'Amp',
    component: MainAmplitudeNewCars,
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
    path: '/MainTestMatchMake', // internal
    name: 'MainTestMatchMake',
    component: MainTestMatchMake,
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
    path: '/accelMaker',
    name: 'MainAccelCurveMaker',
    component: MainAccelCurveMaker,
  },
  {
    path: '/BaseMergeDatabase', // internal
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
