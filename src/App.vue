<template>
  <div class="App_Layout">
    <router-view></router-view>
    <div
      :class="{
        App_SnackActive: snackActive,
        App_SnacKError: snackError,
        App_SnacKCorrect: snackCorrect,
        App_SnacKBlue: snackBlue,
        App_RealActive: realActive,
        App_PreActive: preActive,
        App_AnimIn: animIntro,
        App_AnimOut: animOut,
        App_Shake: snackShake
      }"
      class="App_SnackLayout">
      <div
        class="App_Snack"
        @click="snackActive = false">{{ snackText }}</div>
    </div>
    <div id="App_PrintContainer">
      <canvas id="printCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>
    </div>
    
    <!-- <div class="Main_SideBox">
      <div class="Main_Credits">by TiagoXavi</div>
    </div> -->

  </div>
</template>

<script>
import LogRocket from 'logrocket';

export default {
  name: 'App',
  components: {},
  props: {},
  data() {
    return {
      snackText: "asdf",
      snackActive: false,
      snackError: false,
      snackCorrect: false,
      snackBlue: false,
      snackTimeout: null,

      realActive: false,
      preActive: false,
      animIntro: false,
      animOut: false,
      snackShake: false,
      shakeTimeout: null,
      user: null,
      logRocketInitialized: false,
    }
  },
  watch: {
    snackActive(newValue) {
      if (newValue === true) {
        this.preActive = true;
        this.animIntro = true;
        setTimeout(() => {
          this.realActive = true;
        }, 5);
        setTimeout(() => {
          this.animIntro = false;
        }, 99);
      } else {
        this.animOut = true;
        setTimeout(() => {
          this.animOut = false;
          this.preActive = false;
          this.realActive = false;
        }, 99);

      }
    }
  },
  beforeMount() {
    let vm = this;

    let language = window.localStorage.getItem("language");
    if (language) {
      this.$i18n.locale = language;
    }

    axios.interceptors.request.use(
      function(config) {
        // Do something before request is sent
        config.withCredentials = true;
        return config;
      },
      function(error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (401 === error?.response?.status) {
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: "You aren't logged in",
            type: "error"
          });
          return Promise.reject(error);
        } else {
          return Promise.reject(error);
        }
      }
    );
  },
  mounted() {
    let vm = this;
    this.getUser();

    vm.$store.subscribe(mutation => {

      if (mutation.type == "DEFINE_SNACK") {
        vm.letSnack(mutation.payload);
      }

      if (mutation.type == "AUTH") {
        vm.getUser();
      }

      if (mutation.type == "START_LOGROCKET") {
        if (vm.user && vm.user.username && vm.user.username.includes("TiagoXavi")) {
          return;
        }
        if (!vm.logRocketInitialized && Vue.preUrl.includes('topdrivesrecords')) {
          vm.logRocketInitialized = true;
          LogRocket.init('detmgd/topdrives-records');
        }
      }

    });

    // window.addEventListener('scroll', this.scroll);
  },
  computed: {},
  methods: {
    letSnack(obj) {
      let vm = this;
      clearTimeout(vm.shakeTimeout);
      clearTimeout(vm.snackTimeout);
      if (this.snackActive) this.shake();

      this.snackActive = true;
      if (obj.text.response && obj.text.response.data && obj.text.response.data.message) {
        this.snackText = obj.text.response.data.message;
      } else if (obj.text.message) {
        this.snackText = obj.text.message;
      } else {
        this.snackText = obj.text;
      }
      this.snackActive = true;
      if (obj.error) {
        this.snackError = true;
        this.snackCorrect = false;
        this.snackBlue = false;
      }
      else if (obj.correct) {
        this.snackError = false;
        this.snackCorrect = true;
        this.snackBlue = false;
      }
      else {
        this.snackError = false;
        this.snackCorrect = false;
        this.snackBlue = true;
      }

      vm.snackTimeout = setTimeout(() => {
        vm.snackActive = false;
      }, 4000);
    },
    shake() {
      let vm = this;
      vm.snackShake = true;
      vm.shakeTimeout = setTimeout(() => {
        vm.snackShake = false;
      }, 800);
    },
    scroll(e) {
      this.letSnack({
        active: true,
        error: true,
        text: "You aren't logged in",
        type: "error"
      });
      console.log(e);
    },
    getUser() {
      let vm = this;
      // user
      axios.get(Vue.preUrl + "/getUser")
      .then(res => {
        if (res.data.username) {
          this.user = res.data;
          if (this.user && this.user.mod) {
            window.localStorage.setItem('_md', "t");
          }

          LogRocket.identify(res.data.username, {
            email: res.data.email
          });

          if (this.$hj) {
            this.$hj('vpv', res.data.username)
          }

          if (res.data.auth) {
            window.localStorage.setItem('auth', res.data.auth);
          }
          if (res.data.auth === true) {
            window.localStorage.removeItem('auth');
          }

          this.$store.commit("CHANGE_USER", {
            user: this.user
          });

        } else {
          this.$store.commit("CHANGE_USER", {
            user: null
          });
        }
      })
      .catch(error => {
        console.log(error);
      });

    },
  },
}
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@300;400;700&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@400;700&family=VT323&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto&family=Roboto+Condensed:wght@400;700&display=swap');

* {
  background-repeat: no-repeat;
  padding: 0;
  margin: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
body {
  font-family: 'Roboto', sans-serif;
  touch-action: pan-x pan-y;

  /* main */
  --top-height: 150px;
  --left-width: 200px;
  --cell-width: 230px;
  --cell-height: 35px;
  --dark-back: 40, 40, 40;
  --back-h: 360;
  --back-s: 0%;
  --back-l: 15%;
  --d-back: #333;
  --d-text: #aaa;
  --d-text-b: #ccc;
  --d-text-green: 95, 181, 0;
  --d-text-green-b: 193, 217, 185;
  --d-text-red: 215, 0, 0;
  --d-text-red-b: 251, 131, 131;
  --d-text-yellow: 255, 199, 23;
  --d-text-red2: 255, 88, 88;

  /* tracks */
  --color-dry: 204, 204, 204;
  --color-wet: 90, 163, 255;
  --color-dirt: 239, 97, 75;
  --color-gravel: 197, 177, 120;
  --color-ice: 112, 215, 255;
  --color-mixed: 217, 171, 225;
  --color-sand: 233, 197, 69;
  --color-snow: 186, 212, 235;
  --color-grass: 93, 227, 93;

  /* car */
  --card-stat-back-l: 10%;
  --card-stat-back-a: 0.2;
  --card-right-width: 20%;
  --card-left-width: 11%;
  --card-top-height: 15%;
  --card-left-height: 28%;
  --card-stat-div: 0%;
  --card-font-size: 12px;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );

  --t0: #d7d7d7;
  --tmod: #bfcd36;
  --t1: #FFC717;
  --t2: #8a62eb;
  --t3: #d93c3e;
  --t4: #41c3e9;
  --t5: #45df40;
  --w1: #d1aa3c;
  --w2: #a2bec9;
  --w3: #cf7d29;


  font-size: 18px;
  background-color: var(--d-back);
  color: var(--d-text);
  overflow-x: scroll;
  overflow-y: scroll;
}

.App_Layout {
  width: 100%;
  height: 100%;
}
.App_SnackLayout {
  position: fixed;
  bottom: 20px;
  z-index: 200;
  left: 10px;
  background-color: #0c0c0c;
  width: 260px;
  border-radius: 8px;
  padding: 18px;
  transition-duration: 0.15s;

  display: none;
  z-index: -1;
  pointer-events: none;
  transform: translateX(-110%);
}
.App_Snack {
  
}
.App_PreActive {
  display: block;
}
.App_RealActive {
  display: block;
  z-index: 100;
  transform: translateX(0);
}
.App_AnimOut {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-110%);
}
.App_Active {
  z-index: 100;
  pointer-events: initial;
}
.App_SnackActive {
  z-index: 200;
  pointer-events: initial;
}
.App_SnacKError {
  box-shadow: -22px 0px 0px #eb0000;
}
.App_SnacKCorrect {
  box-shadow: -22px 0px 0px #64cd33
}
.App_SnacKBlue {
  box-shadow: -22px 0px 0px #1a85d7;
}
.App_Shake {
  animation: Shake 0.7s linear forwards;
}
@keyframes Shake {
    10%,
    90% {
      transform: translate(-2px, 0);
    }
    20%,
    80% {
      transform: translate(4px, 0);
    }
    30%,
    50%,
    70% {
      transform: translate(-8px, 0);
    }
    40%,
    60% {
      transform: translate(8px, 0);
    }
}


.TTT_Box {
  min-width: 200px;
}
.TTT_Top {
  max-width: 180px;
  margin: 0 auto;
}
.TTT_Layout {
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.TTT_Mid {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.TTT_Mid .BaseText_Layout {
  width: 100%;
}
.TTT_Top .Main_Logo {
  margin: 0;
}
.TTT_Bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}
.D_Button.TTT_Button {
  padding: 10px 15px;
}
.TTT_Finished {
  text-align: center;
}
.TTT_FinishedText {
  color: rgb(var(--d-text-green));
  font-size: 30px;
  margin-bottom: 30px;
}
.TTT_FinishedSub {
  margin-bottom: 30px;
  color: rgb(var(--d-text-green));
  background-color: rgb(var(--d-text-green), 0.1);
  padding: 10px;
  border-radius: 10px;
}
.TTT_Forgot {
  display: flex;
  justify-content: flex-end;
  margin: -6px -3px -2px -3px;
  align-self: flex-end;
}
.TTT_ForgotBetween {
  justify-content: space-between;
  width: calc(100% + 6px);
  align-self: center;
}
.TTT_SubTitle {
  margin-bottom: 20px;
  font-size: 0.8em;
  max-width: 180px;
  text-align: center;
}
.TTT_SubTitleSpacing {

}
.TTT_Top .Main_Logo {
  cursor: pointer;
}
.TTT_Tip {
  font-size: 13px;
  opacity: 0.6;
  max-width: 180px;
  text-align: center;
  margin-top: 8px;
}
.TTT_Tip2 {
  margin-top: -20px;
  margin-bottom: 30px;
  font-size: 15px;
  color: #c3b364;
}

input:-webkit-autofill, input:-webkit-autofill:active, input:-webkit-autofill:focus, input:-webkit-autofill:hover {
  -webkit-transition: background-color 9999999999s ease-in-out 0s;
  transition: background-color 9999999999s ease-in-out 0s;
  -webkit-text-fill-color: #a78724!important;
  box-shadow: inset 0px 0px 0px 20px #3a320054;
  caret-color: #a78724;
}

#App_PrintContainer {
  display: none;
  margin-top: 1000px;
}
#printCanvas {

}
#App_PrintContainer.App_PrintContainerShow {
  display: block;
}




.D_Button {
  background-color: transparent;
  border: none;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  transition-duration: 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --height: 36px;
  min-height: var(--height);
  min-width: 36px;
  line-height: 1;
  border-radius: 6px;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  --back-opac-foc: 0.3;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  color: var(--d-text-b);
}
.D_ButtonDark {
  background-color: rgba(0,0,0,0.2);
  font-size: 1em;
  border-radius: 6px;
  padding: 0 7px;
  color: var(--d-text-b);
}
.D_ButtonDark2 {
  background-color: rgba(255,255,255,0.1);
  --back-opac: 0.2;
}
.D_ButtonDarkTransparent {
  background-color: rgba(255,255,255,0.0);
  --back-opac: 0.2;
}
.D_ButtonBig {
  padding: 12px 15px;
}
.D_Button.focus-visible:not(.D_ButtonNoActive) {
  outline: none;
  background-color: rgba(var(--back-color), var(--back-opac-foc));
}
.D_ButtonNoActive {
  outline: none;
}
.D_Button.D_ButtonNoActive.focus-visible {
  background-color: rgba(var(--back-color), 0.3);
}
.D_Button:hover:not(.D_ButtonActive):not([disabled]):not(.D_Button_Correct):not(.D_Button_Error) {
  color: #fffc;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.D_Button:active:not(.D_ButtonNoActive) {
  transition-duration: 0.0s;
  background-color: rgba(var(--back-color), calc(var(--back-opac) * 2));
  transform: translateY(3px);
}
.D_ButtonLabel {
  margin-right: 5px;
  font-size: 16px;
}
.D_Button.Main_SaveAllButton {
  --back-color: 49, 141, 8;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 0.7);
  color: white;
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_Button.Main_LoginToEdit {
  --back-color: 44, 37, 16;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 1);
  color: rgb(var(--d-text-yellow));
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_Button.Main_Share {
  background-color: rgba(0,0,0,0.2);
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_ButtonActive:not(p) {
  box-shadow: inset 0px -43px 25px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
  border-radius: 0;
}
.D_ButtonActive:hover {
  background-color: rgba(var(--d-text-green-b), 0.2);
}
.D_Button[disabled] {
  cursor: initial;
  opacity: 0.2;
  pointer-events: none;
}
.D_ButtonDisabledVisible {
  cursor: initial;
  opacity: 1 !important;
  pointer-events: none;
}
.D_Button.D_Button_Loading {
  position: relative;
  color: rgba(255, 255, 255, 0.2);
  opacity: 0.6;
  overflow: hidden;
  pointer-events: none;
}
.D_Button_Loading::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 100%;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 7px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 14px
  );
  animation: Processamento_Loop 0.6s linear infinite;
  top: 85%;
}
@keyframes Processamento_Loop {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0px);
  }
}
button.D_Button.D_Button_Correct {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-green), 0.2);
  opacity: 0.6;
}
.D_Button_Correct::after {
  content: "Done!";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-green));
}
button.D_Button.D_Button_Error {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-red), 0.2);
  opacity: 0.6;
}
.D_Button_Error::after {
  content: "Error";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-red));
}
.D_ButtonLink {
  color: var(--d-text);
  padding: 0;
  height: auto;
  min-height: auto;
  width: auto;
  min-width: auto;
}
.D_ButtonIcon {
  margin-right: 5px;
}
.D_ButtonIconRight {
  margin-left: 5px;
}
.D_ButtonNote {
  position: absolute;
  top: -6px;
  right: -3px;
  font-size: 9px;
  background-color: #bd0000;
  color: white;
  border-radius: 3px;
  padding: 2px;
  padding-right: 2.5px;
}
.D_ButtonDarkPrimary {
  --btn-h: 46;
  --btn-s: 95%;
  --btn-l: 54%;
  background-color: hsl(var(--btn-h), var(--btn-s), var(--btn-l));
  color: black;
}
.D_ButtonDarkPrimary.focus-visible:not(.D_ButtonNoActive) {
  outline: none;
  background-color: hsl(var(--btn-h), var(--btn-s), 40%);
  color: black;
}
.D_ButtonDarkPrimary:hover:not(.D_ButtonActive):not([disabled]) {
  background-color: hsl(var(--btn-h), var(--btn-s), 40%);
  color: black;
}
.D_Button.D_ButtonRed {
  --back-color: 200,0,0;
  --back-opac: 1;
  --back-opac-foc: 1;
  background-color: rgba(150,0,0,1);
}
.D_Button.D_ButtonGreen {
  --back-color: 0,200,0;
  --back-opac: 1;
  --back-opac-foc: 1;
  background-color: rgba(0,150,0,1);
}
.D_Button.Main_ArrowDownSelect {
  color: var(--d-text-b);
  font-size: 1.2em;
  padding: 0 2px 0 9px;
  border-radius: 0;
}


.D_Link {
  text-decoration: none;
  color: var(--d-text);
  padding: 5px 6px;
  border-radius: 5px;
  transition-duration: 0.1s;
}
.D_Link:hover,
.D_Link.focus-visible {
  outline: none;
  background-color: rgba(255,255,255,0.06);
}
.D_LinkPlus {
  background-color: rgba(255,255,255,0.03);
}
.D_LinkUnder {
  color: inherit;
  text-decoration: revert;
  padding: 0px;
}
.add {
  color: #fff2;
  font-size: 30px;
  width: 100%;
  height: 100%;
}
.D_SearchInput {
  width: 100%;
  background-color: #222;
  border: none;
  padding: 25px;
  padding-right: 45px;
  box-sizing: border-box;
  color: #ccc;
  --back-h: 0;
  --back-s: 0%;
  --back-l: 35%;
  box-shadow: inset 0px 0px 0px 3px hsl(var(--back-h), var(--back-s), var(--back-l));
  transition-duration: 0.2s;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
}
.D_SearchInput.focus-visible {
  outline: none;
  --back-h: 203;
  --back-s: 60%;
  --back-l: 55%;
  background-color: #102e40;
  color: #fff;
}
.D_SearchInput::placeholder {
  color: #fff3;
}
.D_SearchInputClose {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1em;
}
.D_SearchInputClose.D_Button:active:not(.D_ButtonNoActive) {
  transform: translateY(-42%);
}
.Main_TextArea {
  background-color: rgba(0,0,0,.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: none;
  margin-top: 2px;
  width: 100%;
}

.Main_SearchEmpty::-webkit-scrollbar,
.Main_SearchMid::-webkit-scrollbar,
.Main_DarkScroll::-webkit-scrollbar,
textarea::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 18px;
}
.Main_SearchEmpty::-webkit-scrollbar-track,
.Main_SearchMid::-webkit-scrollbar-track,
.Main_DarkScroll::-webkit-scrollbar-track,
textarea::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  background-color: #0002;
}
.Main_SearchEmpty::-webkit-scrollbar-thumb,
.Main_SearchMid::-webkit-scrollbar-thumb,
.Main_DarkScroll::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
  background-color: #555;
}
.Main_SearchEmpty::-webkit-scrollbar-corner,
.Main_SearchMid::-webkit-scrollbar-corner,
.Main_DarkScroll::-webkit-scrollbar-corner,
textarea::-webkit-scrollbar-corner,
body::-webkit-scrollbar-corner {
  background-color: #222;
}


.LoadingRectangle {
  animation: vnt666wwqSK5qL63sBn9P 1.5s ease infinite;
  background: linear-gradient(90deg,#272729,#343536,#272729);
  background-size: 200%;
}
@keyframes vnt666wwqSK5qL63sBn9P {
  0% {
      background-position: 0 0;
  }
  100% {
      background-position: -200% 0;
  }
}



</style>