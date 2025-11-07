import Vue from "vue";
import VueRouter from "vue-router";

const Main = () => import("./components/Main.vue");
const MainGallery = () => import("./components/MainGallery.vue");
const MainSwagger = () => import("./components/MainSwagger.vue");
const MainCharts = () => import("./components/MainCharts.vue");
const MainFindCar = () => import("./components/MainFindCar.vue");
const MainDownTimes = () => import("./components/MainDownTimes.vue");
const MainTranslate = () => import("./components/MainTranslate.vue");
const MainNewPhotos = () => import("./components/MainNewPhotos.vue");
const MainTestPoints = () => import("./components/MainTestPoints.vue");
// const MainAddNewCars = () => import("./components/MainAddNewCars.vue");
const MainCheatSheet = () => import("./components/MainCheatSheet.vue");
const MainCodeUtility = () => import("./components/MainCodeUtility.vue");
const MainPacks = () => import("./components/MainPacks.vue");
const MainTimeline = () => import("./components/MainTimeline.vue");
const MainCommunity = () => import("./components/MainCommunity.vue");
const MainStuff = () => import("./components/MainStuff.vue");
const MainAccelCurveMaker = () => import("./components/MainAccelCurveMaker.vue");
const MainShowcase = () => import("./components/MainShowcase.vue");
const BaseMyGarage = () => import("./components/BaseMyGarage.vue");
const MainCsvChart = () => import("./components/MainCsvChart.vue");
const MainMatchSimulator = () => import("./components/MainMatchSimulator.vue");

const MainTemplateGuidelines = () => import("./components/MainTemplateGuidelines.vue");
const MainLogin = () => import("./components/MainLogin.vue");
const MainRegister = () => import("./components/MainRegister.vue");
const MainVerifyEmail = () => import("./components/MainVerifyEmail.vue");
const MainResetPassword = () => import("./components/MainResetPassword.vue");
const MainAskNewPassword = () => import("./components/MainAskNewPassword.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Records',
    component: Main,
    alias: ['/compare', '/challenges', '/events', '/clubs']
  },
  // {
  //   path: '/compare',
  //   name: 'Compare',
  //   component: Main,
  // },
  // {
  //   path: '/challenges',
  //   name: 'Challenges',
  //   component: Main,
  // },
  // {
  //   path: '/events',
  //   name: 'Events',
  //   component: Main,
  // },
  // {
  //   path: '/clubs',
  //   name: 'Clubs',
  //   component: Main,
  // },
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
  {
    path: '/gallery',
    name: 'Gallery',
    component: MainGallery,
  },
  {
    path: '/swagger', // internal
    name: 'MainSwagger',
    component: MainSwagger,
  },
  {
    path: '/animated',
    name: 'MainShowcase',
    component: MainShowcase,
  },
  {
    path: '/animated/:username',
    name: 'MainShowcaseUser',
    component: MainShowcase,
  },
  {
    path: '/charts',
    name: 'MainCharts',
    component: MainCharts,
  },
  {
    path: '/MainCsvChart',
    name: 'MainCsvChart',
    component: MainCsvChart,
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
  // {
  //   path: '/addNewCars',
  //   name: 'MainAddNewCars',
  //   component: MainAddNewCars,
  // },
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
    path: '/me',
    name: 'BaseMyGarage',
    component: BaseMyGarage,
  },
  {
    path: '/match',
    name: 'MainMatchSimulator',
    component: MainMatchSimulator,
  },
  {
    path: '/garage/:username',
    name: 'BaseMyGarageUser',
    component: BaseMyGarage,
  },
  {
    path: '/testPoints', // funciona
    name: 'MainTestPoints',
    component: MainTestPoints,
  },
  {
    path: '/testPoints/temp', // não funciona
    name: 'MainTestPoints2',
    component: MainTestPoints,
  },
  {
    path: '/downTimes',
    name: 'MainDownTimes',
    component: MainDownTimes,
  },
  {
    path: '/userTimes/:username',
    name: 'UserTimes',
    component: MainDownTimes,
  },
  {
    path: '/translate',
    name: 'MainTranslate',
    component: MainTranslate,
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



if (import.meta.env.DEV) {

  const MainRT = () => import("./components/MainRT.vue");
  const MainUpdateRqData = () => import("./components/MainUpdateRqData.vue");
  const MainValidateFinalJson = () => import("./components/MainValidateFinalJson.vue");
  const MainCarsEdit = () => import("./components/MainCarsEdit.vue");
  const MainParser = () => import("./components/MainParser.vue");
  const MainCRCContest = () => import("./components/MainCRCContest.vue");

  routes.push(
    {
      path: '/MainRT', // internal
      name: 'MainRT',
      component: MainRT,
    },
    {
      path: '/newrq', // internal
      name: 'Update RQ',
      component: MainUpdateRqData,
    },
    {
      path: '/validatejson', // internal
      name: 'Validate',
      component: MainValidateFinalJson,
    },
    {
      path: '/MainCarsEdit', // internal
      name: 'MainCarsEdit',
      component: MainCarsEdit,
    },
    {
      path: '/MainCRCContest', // internal
      name: 'MainCRCContest',
      component: MainCRCContest,
    },
    {
      path: '/MainParser', // internal
      name: 'MainParser',
      component: MainParser,
    },
  );
}



const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;
