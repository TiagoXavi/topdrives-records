<template>
  <div
    :class="{
      Main_isMobile: isMobile,
      Main_isDesktop: !isMobile
    }"
    class="App_Layout">
    <BaseTopMenu :user="user" />
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
    <BaseDialog
      :active="loginDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      zindex="102"
      @close="loginDialog = false;">
      <div style="Main_DialogLoginWrap">
        <MainLogin :wrap="true" @success="loginDialog = false;" @close="loginDialog = false;" />
      </div>
    </BaseDialog>
    <BaseDialog
      :active="brakeDialog"
      :transparent="false"
      :lazy="true"
      max-width="250px"
      min-width="240px"
      zindex="102"
      @close="brakeDialog = false;">
      <div style="App_DialogCustom">
        <div class="App_BrakeItem">
          <div class="App_BrakeLeft"><span class="Row_DialogCardStatCorrect">A</span> class: </div>
          <div class="App_BrakeRight">
            <div>★★★</div>
            <div>100-0 in ~4.0s</div>
          </div>
        </div>
        <div class="App_BrakeItem">
          <div class="App_BrakeLeft">B class: </div>
          <div class="App_BrakeRight">
            <div>★★☆</div>
            <div>100-0 in ~4.9s</div>
          </div>
        </div>
        <div class="App_BrakeItem">
          <div class="App_BrakeLeft"><span class="Row_DialogCardStatRed">C</span> class: </div>
          <div class="App_BrakeRight">
            <div>★☆☆</div>
            <div>100-0 in ~5.7s</div>
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="$store.state.confirmDialog.active"
      :transparent="false"
      :lazy="true"
      :maxWidth="$store.state.confirmDialog.maxWidth"
      :minWidth="$store.state.confirmDialog.minWidth"
      zindex="102"
      @close="$store.state.confirmDialog.active = false;">
      <div style="App_DialogConfirm">
        <div class="App_DialogConfirmTitle">{{ $store.state.confirmDialog.title }}</div>
        <template v-if="$store.state.confirmDialog.advanced">
          <div v-if="$store.state.confirmDialog.advanced.type === 'text'" class="App_DialogConfirm_Body">
            <BaseText
              v-model="$store.state.confirmDialog.advanced.text"
              :type="$store.state.confirmDialog.advanced.typeText"
              :placeholder="$store.state.confirmDialog.advanced.placeholder"
              :class="$store.state.confirmDialog.advanced.class"
              class="App_DialogConfirmText"
            />
          </div>
        </template>
        <button
          :class="{
            D_Button_Loading: $store.state.confirmDialog.loading,
            Main_SaveAllButton: $store.state.confirmDialog.actionColor === 'green',
            D_Button_Error: $store.state.confirmDialog.actionColor === 'red'
          }"
          :disabled="$store.state.confirmDialog.disabled"
          style="margin-top: 20px;"
          class="D_Button Main_SaveAllButton"
          @click="$store.state.confirmDialog.action">{{ $store.state.confirmDialog.actionLabel }}</button>
      </div>
    </BaseDialog>
    <BaseTooltip
      :active="$store.state.tooltip.active"
      :tooltip="$store.state.tooltip"
    />

    <portal-target name="app_dialogs" multiple>
    </portal-target>
    
    <!-- <div class="Main_SideBox">
      <div class="Main_Credits">by TiagoXavi</div>
    </div> -->

  </div>
</template>

<script>
import BaseTopMenu from "@/components/BaseTopMenu.vue"
import BaseDialog from "@/components/BaseDialog.vue"
import MainLogin from "@/components/MainLogin.vue"
import BaseTooltip from "@/components/BaseTooltip.vue"
import BaseText from "@/components/BaseText.vue"
import LogRocket from 'logrocket';

export default {
  name: 'App',
  components: {
    BaseTopMenu,
    BaseDialog,
    MainLogin,
    BaseTooltip,
    BaseText
  },
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
      isMobile: false,
      loginDialog: false,
      brakeDialog: false,
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
    
    String.prototype._ = function() {
      return this.replace(/_\$\w/g, "");
    }

    let vm = this;
    this.isMobile = Vue.options.filters.isMobile();

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
        } else if (503 === error?.response?.status) {
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: "TDR in under maintenance",
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

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }
      if (mutation.type == "OPEN_LOGIN") {
        vm.loginDialog = true;
      }
      if (mutation.type == "OPEN_BRAKES") {
        vm.brakeDialog = true;
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
      }, obj.time || 4000);
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

          document.body.classList.add(`App_UserTier${this.user.tier || 0}`);

          this.$store.commit("CHANGE_USER", {
            user: this.user
          });

        } else {
          this.user = null;
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
  --cell-width: 238px;
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
  --card-right-width: 20.5%;
  --card-left-width: 10.5%;
  --card-top-height: 12%;
  --card-left-height: 28%;
  --card-stat-div: 0%;
  --card-font-size: 12px;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );

  --t0: #d7d7d7;
  --tmod: #bfcd36;
  --t1: #FFAF17;
  --t2: #8a62eb;
  --t3: #d93c3e;
  --t4: #41c3e9;
  --t5: #45df40;
  --w1: #d1aa3c;
  --w2: #a2bec9;
  --w3: #cf7d29;

  --t0-hs: 0, 0%;
  --t0-l0: 54%;
  --t0-l: 64%;
  --t1-hs: 46, 100%;
  --t1-l0: 35%;
  --t1-l: 55%;
  --t2-hs: 258, 77%;
  --t2-l0: 55%;
  --t2-l: 65%;
  --t3-hs: 359, 67%;
  --t3-l0: 45%;
  --t3-l: 60%;
  --t4-hs: 194, 79%;
  --t4-l0: 45%;
  --t4-l: 60%;
  --t5-hs: 118, 71%;
  --t5-l0: 45%;
  --t5-l: 60%;

  /* top menu */
  --top-menu: 40px;


  font-size: 18px;
  background-color: var(--d-back);
  color: var(--d-text);
  overflow-x: scroll;
  overflow-y: scroll;
}
button {
  font-family: 'Roboto', sans-serif;
}

.App_Layout {
  width: 100%;
  width: min-content;
  height: 100%;
  /* width: 100%; */
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
  white-space: pre;
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
  min-height: calc(100% - var(--top-menu));
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
/* clears the ‘X’ from Chrome */
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration { display: none; }

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
/* .D_Button:active:not(.D_ButtonNoActive) {
  transition-duration: 0.0s;
  background-color: rgba(var(--back-color), calc(var(--back-opac) * 2));
  transform: translateY(2px);
} */
.D_Button:active {
  /* transition-duration: 0.0s; */
  background-color: rgba(var(--back-color), calc(var(--back-opac) * 2));
  transform: translateY(2px);
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
  --back-color: 65, 53, 22;
  
  --back-opac: 1;
  background-color: rgba(var(--back-color), 1);
  color: rgb(var(--d-text-yellow));
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_Button.Main_LoginToEdit:hover,
.D_Button.Main_LoginToEdit.focus-visible:not(.D_ButtonNoActive) {
  background-color: rgba(var(--back-color), 1);
  color: rgb(var(--d-text-yellow)) !important;
  --back-color: 78, 63, 26;
}
.D_ButtonDarkYellow {
  --back-color: 65, 53, 22;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 1);
  color: rgb(var(--d-text-yellow));
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
.D_ButtonIcon23 {
  font-size: 23px;
}
.D_ButtonIcon24 {
  font-size: 24px;
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
.D_Button.D_ButtonRed,
.BaseChip.D_ButtonRed {
  --back-color: 200,0,0;
  --back-opac: 1;
  --back-opac-foc: 1;
  background-color: rgba(150,0,0,1);
  color: #fdc9c9;
}
.D_Button.D_ButtonGreen,
.BaseChip.D_ButtonGreen {
  --back-color: 0,200,0;
  --back-opac: 1;
  --back-opac-foc: 1;
  background-color: rgba(0,150,0,1);
  color: #eaffc9;
}
.D_Button.Main_ArrowDownSelect {
  color: var(--d-text-b);
  font-size: 1.2em;
  padding: 0 2px 0 9px;
  border-radius: 0;
}
.D_Button.D_ButtonRedLight,
.BaseChip.D_ButtonRedLight {
  --back-color: 253,150,150;
  --back-opac: 0.1;
  --back-opac-foc: 1;
  background-color: transparent;
  color: #e07878;
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
.Main_TextAreaResizable {
  resize: auto
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

textarea::-webkit-resizer {
  width: 18px;
  height: 18px;
  background-position: center;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' stroke='rgb(96, 96, 96)' stroke-width='10'><line x1='30' y1='90' x2='90' y2='30' /></svg>");
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





.Main_Layout {
  min-height: calc(100% - var(--top-menu));
  /* max-width: 100%; */
  /* width: min-content; */
  width: 100%;
  display: flex;
  -webkit-user-select: none;
}
.Main_Body {
  position: relative;
  min-height: 100%;
  display: flex;
}
.Main_BodyEmpty {
  min-width: 100%;
}
.Main_Left {
  width: var(--left-width);
  position: sticky;
  left: 0;
  margin-top: 0;
  overflow: hidden;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  z-index: 10;
  min-height: calc(100% - var(--top-height));

  /* pra preencher mobile */
  box-shadow: 0px 50vh 0px 0px hsl(var(--back-h), var(--back-s), var(--back-l)), 0px 110vh 0px 0px hsl(var(--back-h), var(--back-s), var(--back-l));
  user-select: text;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.Main_LeftPlusTop {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
}
.Main_Corner {
  background-color: hsl(var(--back-h), var(--back-s), 18%);
  height: var(--top-height);
  width: var(--left-width);
  position: sticky;
  /* position: fixed; */
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
}
.Main_CornerMid {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  margin: 0px 5px 5px 5px;
  align-items: center;
  gap: 5px;
}
.Main_Body .Main_CornerMid {
  margin: 0px;
  /* background-image: repeating-linear-gradient( 135deg, transparent, transparent 9px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 24px ); */
  background-color: #292929;
}
.Main_CornerMidBox {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.Main_Logo {
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  display: none;
}
.Main_LogoSidePages {
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
  display: none;
}
.Main_LogoPre {
  white-space: nowrap;
}
.Main_2 .Main_Corner {
  display: grid;
  grid-template-columns: 1fr max-content;
  /* grid-template-columns: 65px 1fr; */
}
.Main_2 .Main_CornerMid {
  flex-grow: unset;
  flex-direction: row;
  /* margin: 5px 5px 5px 0; */
}
.Main_2 .Main_LogoPre {
  /* display: none; */
}
.Main_2 .Main_Logo {
  justify-content: center;
  /* height: calc(var(--top-height) - 20px); */
}
.Main_BacktopBox {
  position: sticky;
  height: 0;
  top: 0;
  pointer-events: none;
}
.Main_Backtop {
  /* position: fixed; */
  /* background-color: hsl(var(--back-h), var(--back-s), 18%); */
  background-color: hsl(var(--back-h), var(--back-s), 16%);
  height: var(--top-height);
  width: 100%;
  min-width: calc(var(--wBody) - var(--left-width));
  /* z-index: 0;
  top: var(--top-menu);
  left: 0; */
}
.Main_Mid {
  /* position: absolute; */
  position: relative;
  /* top: 0; */
  /* margin-left: var(--left-width); */
  height: 100%;
}
.Main_MidEmpty {
  padding-top: var(--top-height);
  flex-grow: 1;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
  gap: 20px;
  margin-bottom: 80px;
  margin-top: 80px;
}
.Main_MidEmptyInner {
  display: flex;
  align-items: stretch;
  --gap: 20px;
  gap: var(--gap);
}
.Main_MidEmptyItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap);
}
.D_Button.Main_MidEmptyButton {
  font-size: 18px;
  padding: 12px 15px;
}
.D_Button.Main_MidEmptyButtonSearch {
  flex-direction: column;
  height: 100%;
  max-height: unset;
  padding: 14px 15px;
  gap: 10px;
}
.Main_CarList {
  display: flex;
  user-select: text;
  pointer-events: none;
}
.Main_BodyEmpty .Main_CarList {
  min-height: 100%;
}
.Main_SearchHeader {
  width: 100%;
  display: flex;
  align-items: stretch;
}
.Main_SearchFieldBox {
  position: relative;
  flex-grow: 10;
}
.Main_FiltersButton {
  border-radius: 0;
  padding: 0 12px;
  font-size: 1em;
  color: var(--d-text-b);
  --back-opac: 1;
  --back-h: 203;
  --back-s: 60%;
  --back-l: 55%;
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) - 10%));
  border-top-right-radius: 10px;
  flex-grow: 1;
  min-height: 74px;
  position: relative;
  flex-direction: column;
}
.Main_FiltersButton:first-child {
  border-top-left-radius: 10px;
  font-size: 1.4em;
}
button.Main_FiltersButton:hover:not(.D_ButtonActive):not([disabled]) {
  color: #fff;
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) + 3%)) !important;
}
.Main_FiltersButton.D_ButtonNoActive.focus-visible {
  color: #fff;
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) + 7%));
}
.Main_FiltersButton:active {
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) - 20%)) !important;
}
.Main_FiltersButtonCount {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  background-color: #bd0000;
  color: white;
  border-radius: 23px;
  padding: 4px 6px;
}
.Main_SearchBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Main_SearchMid {
  height: 60vh;
  background-color: var(--d-back);
  width: 100%;
  padding: 25px 0;
  box-sizing: border-box;
  overflow-y: scroll;
  /* overflow-x: hidden; */
  overscroll-behavior-block: contain;
  overscroll-behavior-x: contain;
  position: relative;
}
.Main_SearchMidT {
  /* padding: 25px; */
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  /* align-items: flex-start; */
  align-content: flex-start;
}
.Main_SearchEmpty {
  height: 60vh;
  background-color: var(--d-back);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
}
.Main_SearchEmptyAddIcon {
  font-size: 70px;
  opacity: 0.1;
}
.Main_SearchItem {
  padding: 7px 25px 7px 0px;
  display: flex;
  width: 100%;
  min-width: fit-content;
  background: transparent;
  outline: 0;
  border: none;
  text-decoration: none;
  user-select: none;
  transition-duration: 0.1s;
  cursor: pointer;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  color: var(--d-text);
  align-items: center;
}
.Main_SearchItem:hover,
.Main_SearchItem.focus-visible {
  color: #fff6;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.Main_SearchItemAdded {
  opacity: 0.5;
}
.Main_SearchItemMarked .Main_SearchItemRight span:first-child {
  color: rgb(var(--d-text-green));
}
.Main_SearchLoading {
  position: fixed;
  width: 100%;
  height: 5px;
  top: 0;
  left: 0;
}
.Main_SearchItemImg {
  display: flex;
  height: 38px;
  margin: -7px 0;
  width: 53px;
  min-width: 53px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 10px;
  background-color: #00000038;
}
.MainGallery_Img {
  transform: scale(1.3);
  height: 100%;
}
.Main_SearchItemLeft {
  color: var(--color);
  margin-right: 10px;
  width: 2em;
  min-width: 2em;
}
.Main_SearchItemValue {
  background-color: rgba(255,255,255,0.05);
  box-shadow: 0px 7px 0px 0px rgba(255,255,255,0.05), 0px -7px 0px 0px rgba(255,255,255,0.05);
  margin-right: 10px;
  padding: 0 2px 0 3px;
  --w: 2em;
  width: var(--w);
  min-width: var(--w);
  text-align: center;
}
.Main_SearchItemColumn {
  margin-right: 10px;
  padding: 0 2px 0 3px;
  --w: 2em;
  width: var(--w);
  min-width: var(--w);
  text-align: center;
}
.Main_SearchItemColumn:last-child {
  margin-right: 0px;
}
.Main_SearchItemColumnActive {
  background-color: rgba(255,255,255,0.05);
  box-shadow: 0px 7px 0px 0px rgba(255,255,255,0.05), 0px -7px 0px 0px rgba(255,255,255,0.05);
}
.BaseFilterDialog_ColumnHeader.Main_SearchItemColumnActive {
  box-shadow: 0px 2px 0px 0px rgba(255,255,255,0.05);
}
.Main_SearchItemValue_topSpeed {
  --w: 2em;
}
.Main_SearchItemValue_acel {
  --w: 2em;
}
.Main_SearchItemValue_hand {
  --w: 2em;
}
.Main_SearchItemValue_mra {
  --w: 3.2em;
}
.Main_SearchItemValue_weight {
  --w: 3em;
}
.Main_SearchItemValue_year {
  --w: 3em;
}
.Main_SearchItemValue_Special {
  --w: 3em;
}
.Main_SearchItemMedal_0 {
  color: var(--w1);
}
.Main_SearchItemMedal_1 {
  color: var(--w2);
}
.Main_SearchItemMedal_2 {
  color: var(--w3);
}
.Main_SearchItemValue_Special .BaseFilterDialog_ColumnHeaderTxt {
  color: rgb(var(--d-text-yellow));
  opacity: 0.8;
}
.Main_SearchItemValue_Special.BaseFilterDialog_ColumnHeader {
  background-color: rgba(255,255,255,0.05);
  box-shadow: 0px 2px 0px 0px rgba(255,255,255,0.05);
}

.Main_SearchItemRight {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
}
.Main_SearchItemRightEvents {
  margin-right: 5px;
  flex-grow: 1;
}
.Main_SearchTrophy {
  font-size: 14px;
  margin-left: 2px;
}
.Main_SearchItemYear {
  font-size: 0.6em;
  box-shadow: 0px 0px 0px 2px #0003;
  background-color: #0003;
  padding: 1px 3px;
  margin-left: 0.2em;
  margin-right: 2px;
}
.Main_SearchItemRight b {
  color: #fffd;
  font-weight: normal;
  background-color: #fff1;
  box-shadow: 0px 0px 0px 1px #fff1;
}
.Main_SearchResultUser {
  font-size: 0.8em;
  margin-right: 2px;
  color: var(--t0);
}
.Main_SearchResultUserBy {
  font-size: 0.8em;
  margin-left: 0.1em;
  color: var(--t0);
  opacity: 0.5;
}
body .Main_UserTmod {
  color: var(--tmod);
}
body .Main_UserT1 {
  color: var(--t1);
}
body .Main_UserT2 {
  color: var(--t2);
}
body .Main_UserT3 {
  color: var(--t3);
}
body .Main_UserT4 {
  color: var(--t4);
}
body .Main_UserT5 {
  color: var(--t5);
}
body .Main_UserTw1 {
  color: var(--w1);
  white-space: nowrap;
}
body .Main_UserTw2 {
  color: var(--w2);
  white-space: nowrap;
}
body .Main_UserTw3 {
  color: var(--w3);
  white-space: nowrap;
}
body .Main_UserTw1:before {
  content: "🥇";
}
body .Main_UserTw2:before {
  content: "🥈";
}
body .Main_UserTw3:before {
  content: "🥉";
}
body .Main_UserTw1:before,
body .Main_UserTw2:before,
body .Main_UserTw3:before {
  margin: 0 -2px;
  line-height: 0.6;
}
.Main_SearchLastestTitle {
  font-size: 1.7em;
  opacity: 0.3;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
  white-space: nowrap;
}
.Main_SearchMore {
  font-size: 18px;
  margin-top: 11px;
  margin-left: 62px;
  padding: 12px 15px;
}
.Main_FilterMaxReached {
  margin-top: 11px;
  margin-left: 62px;
  padding: 12px 0px;
  color: rgb(var(--d-text-yellow));
}
.Main_ImgPlaceholder {
  width: 52px;
  height: 36px;
  background-color: #222222;
  margin-right: 10px;
  margin-top: -6px;
  margin-bottom: -6px;
}
.Space_Bottom { 
  margin-bottom: 10px;
}
.Space_Top { 
  margin-top: 10px;
}
.Space_Both { 
  margin-bottom: 10px;
  margin-top: 10px;
}
.Space_BottomPlus { 
  margin-bottom: 20px;
}
.Space_TopPlus { 
  margin-top: 20px;
}
.Space_BothPlus { 
  margin-bottom: 20px;
  margin-top: 20px;
}
.Space_BottomGiga { 
  margin-bottom: 30px;
}
.Space_TopGiga { 
  margin-top: 30px;
}
.Space_BothGiga { 
  margin-bottom: 30px;
  margin-top: 30px;
}
.Main_OptionsDialog {
  font-size: 18px;
}
.Main_OptionsButton {
  font-size: 16px;
  padding: 10px;
  background-color: rgba(var(--back-color), 0.04);
  box-sizing: border-box;
}
.Main_OptionsButton42 {
  height: 42px;
}
.Main_OptionsButton > i {
  font-size: 28px;
}
.Main_OptionsButtonClear {
  --back-color: 255, 0, 0;
  color: rgb(217 115 115);
  --back-opac: 0.5;
  background-color: rgba(var(--back-color), 0.1);
  --height: 16px;
  padding: 5px 7px;
  font-size: 1em;
  margin: -5px 0;
  margin-left: 5px;
}
.Main_OptionsButtons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.Main_OptionsTrackset {
  display: flex;
  flex-direction: column;
  margin: 10px -20px 0px -20px;
}
.Main_OptionsTracksetMore {
  align-self: center;
  margin-top: 10px;
  min-width: 150px;
}
.Main_OptionsLabel {
  opacity: 0.8;
  font-size: 14px;
}
.Main_OptionsItem + .Main_OptionsItem {
  margin-top: 20px;
}
.Main_OptionsUserBox {
  margin-top: 20px;
}
.Main_OptionsLogout {
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 10px;
}

.Main_UserLogout {
  margin-bottom: -2px;
  align-self: flex-start;
  padding: 2px;
  font-size: 14px;
}
.Main_MenuIcon {
  font-size: 22px;
}
.Main_SideBox {
  position: absolute;
  right: 0;
  bottom: 0;
}
.Main_Credits {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  padding: 3px;
}
.Main_PrintBy {
  display: none;
  text-align: center;
}
.Main_PrintByLabel {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  margin-bottom: 3px;
}
.Main_PrintByUser {
  color: var(--t0);
  max-width: var(--left-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 7px;
  box-sizing: border-box;
}
.Main_BodyPrint .Main_Corner .Main_PrintBy {
  display: flex;
  justify-content: center;
  align-items: center;
}
.Main_Normal .Main_BodyPrint .Main_Corner .Main_PrintBy {
  display: flex;
  flex-direction: column;
}
.Main_Corner .Main_PrintByLabel {
  margin-bottom: 0px;
}
.Main_GamePrintInfo {
  display: none;
}
.Main_PrintCreditsBottom {
  display: none;
  padding: 10px;
  box-sizing: border-box;
}
.Main_Corner .Main_PrintByUser {
  max-width: 20ch;
}
.Main_UserBottom {
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 6px;
}
.Main_UserBottom .Main_UserBlock {
  max-width: calc(100% - 35px);
}
.Main_UserName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}
.Main_UserCard {
  display: flex;
  align-items: center;
  gap: 8px;
}
.Main_UserBlock {
  display: flex;
  flex-direction: column;
}

.Main_UserNameLabel {
  font-size: 18px;
}
.Main_UserDiscordLabel {
  font-size: 13px;
}
.Main_UserMod {
  font-size: 11px;
  background-color: black;
  margin-left: 5px;
  padding: 2px 4px;
  border-radius: 4px;
}
.D_Button.D_ButtonMenu {
  padding: 11px 11px;
}
.Main_SaveAllBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Main_DialogTitle {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
}
.Main_DialogTitle:not(:first-child) {
  margin-top: 25px;
}
.Main_ShareDownloadBox {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.Main_ShareLinkBox {
  display: flex;
  gap: 15px;
  align-items: center;
}
.Main_ShareLinkInput {
  background-color: rgba(0,0,0,0.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: none;
  margin-top: 2px;
  flex-grow: 1;
}
.Main_ShareLinkInputCorrect {

}
.Main_FilterSlider {
}
.Main_FilterItems {
  color: var(--d-text-b);
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 0 20px;
}
.Main_FilterSliderLabel {
  text-align: center;
  margin-top: 6px;
}
.Main_FilterDual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.Main_FilterDualCenter {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.Main_FilterDualCenter:empty {
  display: none;
}
.Main_FilterThree {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 15px;
}
.Main_FilterChips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  gap: 15px;
}
.Main_FilterChips2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 61px));
  gap: 15px;
  justify-content: center;
}
.Main_FilterChipsFlex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
}
.Main_FilterChipsLabel {
  position: absolute;
  top: -16px;
  font-size: 12px;
  opacity: 0.5;
}
.Main_FilterClassChips {
  max-width: 430px;
  width: 100%;
  align-self: center;
}
.Main_FilterChipsInside {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.Main_ClassChip {
  font-size: 1.2em;
  transform: skewY(9deg);
  font-weight: bold;
  box-shadow: 0px 4px 0px -0.1px var(--classC);
}
.BaseChip.Main_ClassChip:hover,
.BaseChip.Main_ClassChip.focus-visible {
  box-shadow: 0px 0px 0px 4px var(--classC);
}
.Main_ClassChipActive {
  background-color: var(--classC);
  color: black;
}
.Main_SectionSelectorLayout {
  margin-bottom: 25px;
}
.Main_SectionSelectorBox {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.D_Button.D_ButtonChangeMode {
  padding: 14px 15px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.07);
  min-width: 120px;
}
.D_Button.D_ButtonChangeModeDisabled {
  opacity: 1;
  box-shadow: inset 0px -33px 15px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
  border-radius: 0;
}
.Main_OptionsMain {
  margin-top: 30px;
}
.Main_OptionsCredits {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}
.Main_OptionsUserTop {

}
.Main_OptionsFooterButtons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.Main_FavLogo {
  width: 18px;
  margin: -5px 0px -5px 6px;
}
.Main_DiscordLogo {
  width: 25px;
  margin: -5px 6px -5px 0px;
}
.Main_Disclaimer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.D_Center {
  display: flex;
  justify-content: center;
}
.D_Center2 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.D_TextCenter {
  text-align: center;
}
.Main_AboutFlag {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 50px;
  height: 50px;
  overflow: hidden;
}
.Main_AboutFlagBox {
  background-color: rgb(20, 158, 62);
  display: flex;
  width: 100px;
  justify-content: center;
  transform: rotate(45deg);
  margin-top: 5px;
  margin-left: -15px;
}
.Main_AboutFlagBox svg {
  width: 30px;
}
.Main_CustomTrackItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 20px;
  transition: all 0.1s, box-shadow 0.1s;
}
.Main_CustomTrackItem:hover {
  box-shadow: inset 0px 90px 0px 0px rgba(255,255,255,0.03);
}
.Main_CustomTrackFalse,
.Main_CustomTrackCorrect {
  font-size: 35px;
}
.Main_CustomTrackCorrect {
  display: none;
  margin: -10px;
  color: rgb(var(--d-text-green));
}
.Main_CustomTrackActive .Main_CustomTrackCorrect {
  display: block;
}
.Main_CustomTrackCond {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
}
.Main_AllTracksBox {
  margin: 0 -20px;
}
.Main_OptionsSaveData {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}
.MainClearLabelBox {
  display: flex;
}
.Main_ClearButtonsBox {
  display: inline-flex;
  justify-content: space-between;
  flex-grow: 1;
}
.Main_CustomTrackRight {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.Main_CustomTrackName {
  padding-right: 5px;
  display: flex;
  align-items: center;
}
.Main_CustomTrackItem .Type_00 {
  --type-back-opac: 0.07;
  background-color: rgba(255,255,255, var(--type-back-opac));
}
.Type_01,
.Type_c1,
.Type_01 ~ .BaseCompItem_Drives {
  color: rgb(var(--color-wet));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-wet), var(--type-back-opac));
}
.Type_10,
.Type_11,
.Type_40:not([data="lumberTwisty_a40"]),
.Type_41:not([data="lumberTwisty_a41"]),
.Type_10 ~ .BaseCompItem_Drives {
  color: rgb(var(--color-dirt));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-dirt), var(--type-back-opac));
}
/* [data="lumberTwisty_a40"] {
  --type-back-opac: 0.07;
  background-color: rgba(255,255,255, var(--type-back-opac));
} */
.EventTrack [data="lumberTwisty_a40"] {
  --type-back-opac: 0.1;
  background-color: rgba(255,255,255, 0.03);
}
.Row_Tracks [data="lumberTwisty_a41"] {
  color: rgb(var(--color-wet));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-wet), var(--type-back-opac));
}
.Type_20,
.Type_b0 {
  color: rgb(var(--color-gravel));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-gravel), var(--type-back-opac));
}
.Type_30,
.Type_g0 {
  color: rgb(var(--color-ice));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-ice), var(--type-back-opac));
}
.Type_50,
.Type_e0,
.Type_c0 {
  color: rgb(var(--color-sand));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-sand), var(--type-back-opac));
}
.Type_60,
.Type_d0,
.Type_h0,
.Type_h1 {
  color: rgb(var(--color-snow));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-snow), var(--type-back-opac));
}
.Type_70,
.Type_f0,
.Type_71 {
  color: rgb(var(--color-grass));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-grass), var(--type-back-opac));
}
.TypeText_Dry {
  color: rgb(var(--color-dry))
}
.TypeText_Wet {
  color: rgb(var(--color-wet))
}
.TypeText_Dirt {
  color: rgb(var(--color-dirt))
}
.TypeText_Gravel {
  color: rgb(var(--color-gravel))
}
.TypeText_Ice {
  color: rgb(var(--color-ice))
}
.TypeText_Sand {
  color: rgb(var(--color-sand))
}
.TypeText_Snow {
  color: rgb(var(--color-snow))
}
.TypeText_Grass {
  color: rgb(var(--color-grass))
}

.Main_RowCornerBox {
  position: absolute;
  /* position: fixed; */
  top: var(--top-height);
  /* background-color: #2e2e2e; */
  background-color: hsl(var(--back-h), var(--back-s), 19%);
  z-index: 1;
  width: var(--left-width);

  white-space: nowrap;
  box-sizing: border-box;
  border-top-width: 0;
  border-left-width: 0;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  transition-property: set;
  box-shadow: inset 0px -2px 0px 0px #ffffff07, inset -2px 0px 0px 0px #ffffff07;
  border-bottom-color: #5a5a5a;

  justify-content: center;
  height: calc(var(--cell-height) * 1.3);

  border-right-width: 0;
}
.Main_2 .Main_RowCornerBox {
  top: 0;
  left: var(--left-width);
  width: calc(var(--cell-width) * 1);
  height: var(--top-height);
}
.Main_2 .Main_BodyPrint .Main_RowCornerBox {
  display: none;
}
.Main_FilterClearTop {
  display: flex;
  justify-content: flex-end;
  margin-top: -15px;
  margin-bottom: -15px;
}
.Main_OptionsDual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}
.Main_OptionsDual > .Main_OptionsItem {
  margin-top: 0px;
}
.Main_cIconBox {
  position: relative;
  width: 28px;
  height: 28px;
}
.Main_cBall {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
.Main_cBall:nth-child(1) {
  background-color: #ffc300ad;
  left: 50%;
  top: 1px;
  transform: translateX(-50%);
}
.Main_cBall:nth-child(2) {
  background-color: #dbf5fb87;
  left: 0;
  bottom: 1px;
}
.Main_cBall:nth-child(3) {
  background-color: #a55412b3;
  right: 0;
  bottom: 1px;
}
.Main_cIconGradient {
  background: rgb(54,171,0);
  background: linear-gradient(90deg, rgba(54,171,0,1) 0%, rgba(54,171,0,1) 19%, rgba(64,132,0,1) 20%, rgba(64,132,0,1) 39%, rgba(74,94,0,1) 40%, rgba(74,94,0,1) 59%, rgba(83,58,0,1) 60%, rgba(83,58,0,1) 79%, rgba(91,29,0,1) 80%, rgba(91,29,0,1) 100%);
  border-radius: 34px;
}
.Main_CampaignMatch {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 15px;
}
.Main_CampaignName {
  color: rgb(var(--d-text-yellow));
  margin-bottom: 5px;
}
.Main_CampaignTrackName {
  flex-grow: 1;
  background-color: #0003;
  font-size: 0.9em;
  line-height: 1.1;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  min-height: 45px;
}
.Main_CampaignRace {
  display: flex;
  flex-direction: column;
}
.Main_CampaignRaceOff {
  opacity: 0.5;
}
.Main_CampaignRaceOff .Main_CampaignTrackName {
  background-color: transparent;
}
.Main_CampaignTrackCond {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 1px 5px;
  flex-wrap: wrap;
  padding-left: 5px;
  min-height: 8px;
}
.Main_CampaignItem + .Main_CampaignItem {
  margin-top: 25px;
}
.Main_OptionsDivider {
  width: 100%;
}
.Main_SaveGalleryBoxCheck {
  display: flex;
  align-items: center;
  gap: 10px;
}
.Main_SaveGalleryDialog {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.Main_SaveGalleryCheckRightValue {
  color: var(--d-text-b);
}
.Main_DialogMessage {
  padding-bottom: 20px;
}
.Main_DialogBottom {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.Main_OptionsMemory {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.Main_MemoryLine {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}
.Main_MemoryLine + .Main_MemoryLine {
  margin-top: 4px;
}
.Main_MemoryLabel {
  opacity: 0.8;
  font-size: 14px;
  width: 2.2em;
  display: flex;
  justify-content: flex-end;
  margin-right: 3px;
}
.Main_MemorySave.D_Button_Correct::after {
  content: "\e943";
  font-family: 'JurisT' !important;

}
.Main_GameVersionText {
  width: 100%;
  text-align: center;
}
.Main_SaveGalleryGuide {
  font-size: 13px;
  background-color: #a9904129;
  box-shadow: inset 0px 0px 0px 2px #ffe39417;
  padding: 8px 10px;
  border-radius: 10px;
  margin: 0 30px;
  color: #cdc2a3;
  text-align: center;
}
.Main_AddTrackBox {
  /* gap: 15px; */
}
.Main_AddTrackDirect {
  color: #fff3;
  --height: 28px;
}
[contenteditable] {
  -webkit-user-select: text;
  user-select: text;
}
.Main_AdvancedDialogBox {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.Main_KingDialogBox {
  --width: 240px;
}
.Main_KingFixed {
  --width: 180px;
}
.Main_KingFilter {
  height: 140px;
  width: var(--width);
  margin: 0 auto;
  margin-top: 17px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
  overflow-y: auto;
}
.Main_KingFixed .Main_KingFilter {
  height: 70px;
  margin-top: 5px;
}
.Main_KingTrackBox {
  width: var(--width);
  margin: 0 auto;
}
.Main_KingTrackBoxSelected {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.Main_KingAnalyzeButton {
  width: var(--width);
  margin: 0 auto;
  margin-top: 17px;
}
.Main_DialogTitleDual {
  display: flex;
  justify-content: space-between;
}
.Main_KingPinButton {
  padding: 0px 6px;
  --height: 34px;
  margin: -10px -10px 0 0;
  height: 34px;
}
.Main_KingPinButton:not(:last-child) {
  margin-right: 5px;
}
.Main_KingPinIcon {
  font-size: 18px;
  color: var(--d-text);
  transform: rotate(90deg);
}
.Main_KingFixed .Main_KingPinIcon {
  transform: rotate(-90deg);
}
.Main_KingFixed .Main_DialogTitle {
  margin-bottom: 5px;
}
.Main_KingTuneSelector {
  
}
.Main_EditMraButton {
  font-size: 16px;
  padding: 0 3px;
  --height: 28px;
  min-width: 41px;
  margin-top: -4px;
}
.Main_EditMraField > input {
  margin-top: -1px;
  padding: 5px 6px;
}
.Main_EventListDividir {
  text-align: center;
  font-size: 40px;
  line-height: 3;
  opacity: 0.2;
}





.Cg_Layout {
  width: 100%;
}
.Cg_Corner {
  background-color: hsl(var(--back-h), var(--back-s), 15%);
  height: var(--top-height);
  width: var(--left-width);
  /* position: fixed; */
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
}
.Cg_Layout .Main_CornerMenu {
  display: none;
}
.Cg_HeaderLeft {
  display: flex;
  position: relative;
}
.Cg_RowCornerBox {
  background-color: hsl(var(--back-h), var(--back-s), 15%);
  z-index: 1;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition-duration: 0.15s;
  transition-property: set;
  justify-content: center;
  flex-grow: 1;
  flex-direction: column;
}
.Cg_SelectorLayout {
  display: flex;
  width: 100%;
  max-width: 500px;
  align-items: center;
  /* margin-bottom: 15px; */
  flex-grow: 1;
}
.Cg_SelectorCenter {
  flex-grow: 1;
  text-align: center;
}
.Cg_SaveButtonBox {

}
.Cg_Box {
  display: grid;
  --cg-width: 230px;
  --cg-height: 150px;
  grid-template-columns: repeat(5, var(--cg-width));
  justify-content: center;
}
.Cg_RoundSubmitsControl {
  display: flex;
  align-items: center;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}
.Cg_RoundSubmitsControlCenter {
  flex-grow: 1;
}
.Cg_CarPlaceHolder {
  height: var(--cg-height);
}
.Cg_Mid .BaseCard_FixBack {
  --back-l: 0%;
  border-radius: 9px;
  background-color: hsla(var(--back-h), var(--back-s), var(--back-l), 0.1);
}
.Cg_Mid {
  padding: 20px 0;
  /* margin-top: var(--top-height); */
}
.Cg_ThemTime {
  height: var(--cell-height);
}
.Cg_Opponent {
  position: relative;
}
.Cg_OppoTuneBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0002;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 4px;
  z-index: 21;
  background-color: #000a;
}
.Cg_OppoTuneButton {
  background-color: rgba(90,90,90,1);
  --back-opac: 0.8;
  --back-color: 90, 90, 90;
  --back-opac-foc: 0.8;
  font-size: 16px;
  border-radius: 6px;
  padding: 0 7px;
  color: #e5e5e5;
}
.Cg_SelectTrackButton {
  color: #fff4;
  width: 100%;
  font-size: 18px;
  --height: var(--cell-height);
}
.Cg_Track {
  position: relative;
  /* padding-top: 3px; */
}
.Cg_SelectTrackButtonEdit {
  position: absolute;
  top: 0;
  left: -1px;
  z-index: 1;
  width: auto;
  background-color: hsl(var(--back-h), var(--back-s), 15%);
  color: var(--d-text-b);
  animation: campaignTip 0.1s linear forwards;
  display: none;
  /* box-shadow: 0px 0px 21px -7px #000; */
  --back-opac: 1;
  --back-color: 20, 20, 20;
}
.Cg_Track:hover:not(.RowTrack_Dragging) .Cg_SelectTrackButtonEdit {
  display: flex;
}
.Cg_SelectTrackButtonMoveRight,
.Cg_DragButtonIcon {
  left: 35px;
}
.Cg_Divider {
  text-align: center;
  padding-bottom: 5px;
  margin-top: 15px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  --cor: #464646;
  --cor2: #464646;
  --light: 114, 114, 114;
  --opacity: 0.18;
  --size: 50px;
  --translate: 14px;
  position: relative;
}
.Cg_PointsRed {
  --cor: rgb(var(--d-text-red2));
  --cor2: #000;
  --light: var(--d-text-red2);
  --size: 70px;
}
.Cg_PointsGreen {
  --cor: rgb(var(--d-text-green));
  --cor2: #000;
  --light: var(--d-text-green);
  --size: 70px;
}
.Cg_PointsGrey {
  --cor: #727272;
  --cor2: #000;
  --size: 70px;
}
.Cg_Points {
  font-size: var(--size);
  font-weight: bold;
  transform: translateY(var(--translate));
  background: linear-gradient(var(--cor) 47%, var(--cor2) 80%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  white-space: nowrap;
}
.Cg_DividerBackLight {
  background: radial-gradient(rgba(var(--light), var(--opacity)) 0%, rgba(var(--light), 0) 60%);
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 90px;
  top: 0;
  right: 0;
  background-repeat: no-repeat;
}
.Cg_Race:first-child .Cg_TrackBox {
  box-shadow: inset 2px 0px 0px 0px #ffffff07;
}
.Cg_Race:first-child .Cg_Track {

}
.Cg_Race:first-child .Cg_ThemTime {
  box-shadow: inset 2px 0px 0px 0px #ffffff07;
}
.Cg_YouTime {
  box-shadow: inset 0px 2px 0px 0px #ffffff07;
}
.Cg_Race:first-child .Cg_YouTime {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.CgYouCar {
  margin-top: -3px;
}
.Cg_YouTime > .Row_DisabledCell {
  height: calc(var(--cell-height) * 2.3);
}
.Cg_BankPhoto {
  display: flex;
  height: 38px;
  width: 57px;
  min-width: 57px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 10px;
  background-color: #00000038;
}
.Cg_BankPhotoImg {
  height: 100%;
  transform: scale(1.4) translateX(1px);
}
.Cg_YouBankBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2px;
}
.Cg_YouBankBoxPreview {
  margin-top: 20px;
}
.Cg_YouBankManualAdd {
  margin-bottom: 2px;
}
.D_Button.Cg_BankButton {
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
  background-color: rgba(0,0,0,0.0);
  --back-opac: 0.06;
}
.Cg_BankResult {
  min-width: 55px;
  text-align: right;
}
.Cg_BankPoints {
  color: var(--cor);
}
.Cg_BankClass {
  margin-right: 9px;
}
.Cg_BankTune {
  /* margin-right: 9px; */
}
.Cg_BankCarName {
  color: var(--d-text);
  font-size: 12px;
}
.Cg_RqCount {
  width: 100%;
  height: 5px;
  position: absolute;
  bottom: 0;
  z-index: 31;
}
.Cg_RqFill {
  background-color: #354958;
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  width: 0;
  transition-duration: 0.5s;
  max-width: 100%;
}
.Cg_RqText{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
}
.Cg_RqRq {
  transform: scaleX(1.7) skewX(-14deg);
  margin-right: 12px;
  font-weight: bold;
  font-size: 0.7em;
}
.Cg_CenterBottom {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
  min-height: 34px;
  margin-top: 5px;
}
.Cg_PointsSum {
  margin-left: 10px;
  display: flex;
  align-items: center;
}
.Cg_PointsSum_Red {
  --color: rgb(var(--d-text-red2));
}
.Cg_PointsSum_Green {
  --color: rgb(var(--d-text-green));
}
.Cg_PointsSumText {
  font-weight: bold;
  color: var(--color);
  opacity: 0.8;
}
.Cg_BankButtonLose {
  opacity: 0.4;
}
.Cg_Right {
  background-color: hsl(var(--back-h), var(--back-s), 15%);
  height: var(--top-height);
  width: var(--left-width);
  padding: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  overflow-y: auto;
}
.Cg_ReqsTitle {
  opacity: 0.6;
  font-size: 13px;
  /* margin-top: -10px; */
}
.D_Button.Cg_TopButton {
  font-size: 14px;
  --height: 27px;
}
.Cg_SelectorDialogHeader {
  background-color: var(--d-back);
  display: flex;
  align-items: center;
  padding: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.Cg_SelectorDialogTitle {
  flex-grow: 1;
  margin-bottom: 0;
}
/* .Cg_SelectorDialog .BaseDialog_Box {
  border-radius: 10px;
} */
.Cg_SelectorDialogMid {
  border-bottom-left-radius: 10px;
  padding-top: 0;
}
.Cg_FilterButtons {
  margin-top: 10px;
}
.Cg_MidLoading {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.Cg_Offline {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.Cg_ListSelectBox {
  max-width: 450px;
  margin: 0 auto;
}
.Cg_YB {
  color: #e5bf37;
}
.Cg_SN {
  color: #ff6262;
}
.Cg_EX {
  color: #5899fb;
}
.Cg_PG {
  color: #9ac712;
}
.Cg_IsApprovingBox {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  gap: 15px;
}
.Main_RoundDone {
  display: flex;
  align-items: center;
}
.Main_RoundDoneIcon {
  font-size: 11px;
  color: rgb(var(--d-text-yellow));
  margin-left: 6px;
}
.Main_RoundDoneCreator {
  margin-left: 18px;
  box-shadow: 0px 0px 0px 6px rgba(0,0,0,0.15);
  background-color: rgba(0,0,0,0.15);
  display: flex;
  border-radius: 3px;
}
.Main_RoundIcons {
  display: flex;
  justify-content: right;
  flex-wrap: wrap;
  flex-grow: 1;
  opacity: 0.9;
}
.Cg_Header {
  position: static;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 30;
}
.Cg_RoundEmptyBox {
  text-align: center;
}
.Cg_RoundEmptyTitle {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
}
.Cg_RoundEmptyBody {

}
.Cg_RoundEmptyThanks {
  color: rgb(var(--d-text-green));
}
.Cg_BottomModTools {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
  flex-wrap: wrap;
}
.Cg_RoundEmptyBox + .Cg_BottomModTools {
  margin-top: 15px;
}
.Cg_SelectorEventSpan {
  /* max-width: 300px; */
  max-width: calc(var(--wBody) - 195px - var(--left-width));
  min-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.Cg_Creator {
  color: var(--d-text);
  opacity: 0.7;
}
.Cg_RoundEmptyBoxMods ~ .Cg_Box .Cg_Track,
.Cg_RoundEmptyBoxMods ~ .Cg_Box .Cg_ThemTime {
  /* display: none; */
}
.Cg_RoundEmptyBoxMods ~ .Cg_Box .Cg_Divider,
.Cg_RoundEmptyBoxMods ~ .Cg_Box .CgYouCar,
.Cg_RoundEmptyBoxMods ~ .Cg_Box .Cg_YouTime,
.Cg_RoundEmptyBoxMods ~ .Cg_Box .Cg_YouBankManualAdd {
  display: none;
}
.Cg_NotThisTime_Icon {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.Cg_NotThisTime_IconSvg {
  width: 100px;
  height: 72px;
}
.Cg_NotThisTime_IconSvg > path {
  fill: #ffffff2b;
}
.Cg_NotThisTime_Header {
  text-align: center;
  color: rgba(var(--d-text-yellow), 0.9);
  font-size: 1.4em;
  margin: 20px 0 32px 0;
}
.Cg_NotThisTime_P {
  max-width: 500px;
  margin: 32px auto;
  text-align: center;
  line-height: 1.3;
  -webkit-user-select: text;
}
.Cg_NotThisTime_Button {
  --height: 7px;
  padding: 3px 6px;
  margin: -5px 0px;
  vertical-align: baseline;
}

.Main_CgListDividerLayout {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
  flex-wrap: wrap;
}
.D_Button.Main_CgListDividerButton {
  padding: 0px 7px 0px 12px;
}
.Main_AnnouncementLayout {

}
.Main_AnnouncementLogo {
  display: flex;
  justify-content: center;
  margin-top: -50px;
  margin-bottom: 15px;
}
.Main_AnnouncementBox {
  text-align: center;
}
.Main_AnnouncementMaybe {
  opacity: 0.6;
  font-size: 0.7em;
  margin-top: 2px;
}
.Main_AnnouncementTitle {
  margin: 20px 0;
  font-size: 2.4em;
  line-height: 1.1;
  color: #cdcdcd;
}
.Main_AnnouncementSubTitle {
  margin: -10px 0 20px 0;
  font-size: 1.3em;
  line-height: 1.1;
  color: #cdcdcd;
}
.Main_AnnouncementButton {
  margin: 20px 0 2px 0;
}
.Event_CompItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 13px;
  margin-top: 7px;
}
.Event_CompItemPlaceholder {
  position: relative;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.05);
  background-image: repeating-linear-gradient(135deg, transparent, transparent 9px, rgba(0, 0, 0, 0.15) 0, rgba(0, 0, 0, 0.15) 24px);
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 0px -2px 0px 0px #ffffff00, -2px 0px 0px 0px #ffffff00;
  height: var(--cell-height);
  margin-top: 3px;
}
.Event_CompPlaceholderQuestion {
  position: absolute;
  font-size: 70px;
  top: 29px;
  z-index: 2;
  color: var(--d-text);
}
.Event_SubTitle {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
  text-align: center;
}
.Event_Track {
  margin-top: 8px;
  box-shadow: inset 0px 2px 0px 0px #ffffff07;
}
.Event_Track:first-child {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.Event_BankButton {
  width: 100%;
  justify-content: flex-start;
}
.D_Button.Event_BankPick {
  /* --back-color: 255, 255, 255;
  --back-opac: 0.1; */
  /* background-color: rgba(var(--back-color), var(--back-opac)); */
  /* box-shadow: inset 0px -2px 0px 0px var(--cor); */
  /* box-shadow: inset 0px -36px 0px 0px rgba(var(--back-color), var(--back-opac)); */
}
.D_Button.Event_BankReference,
.D_Button.Event_BankSemiReference {
  --back-color: 255, 255, 255;
  --back-opac: 0.07;
  background-color: rgba(var(--back-color), var(--back-opac));
  /* box-shadow: inset 0px -36px 0px 0px rgba(var(--back-color), var(--back-opac)); */
}
.Event_PicksManage {
  background-color: #444;
  max-width: 800px;
  margin: 0px auto;
  padding: 20px;
  display: grid;
}
.Main_FilterHeaderLeft {
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin-right: 10px;
  gap: 15px;
  justify-content: space-between;
}
.Main_FilterHeaderLeftBox {
  display: flex;
  align-items: center;
  margin-right: 10px;
  gap: 15px;
}
.Event_HasPickList > .Event_BankButton:not(.Event_BankReference):not(.Event_BankPick) {
  opacity: 0.4;
}
.Event_HasPickList > .Event_BankSemiReference:not(.Event_BankPick) {
  opacity: 0.4;
}
.Event_BankPhoto {
  margin-right: 7px;
}
.Event_BankClass {
  margin-right: 5px;
}
.Event_NewTracksetBox {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.Event_BankTime {
  flex-grow: 1;
  margin-right: 10px;
}
.Event_Daily {
  color: #5899fb;
}
.Event_Hidden {
  color: #9ac712;
}
.Event_Ended {
  color: #dd3636;
}
.Main_StyledItemMargin {
  margin-top: 10px;
}
.Clubs_SelectorBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
  gap: 5px;
}
.Clubs_RowCornerBox {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  z-index: 1;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  transition-duration: 0.3s;
  transition-property: set;
  justify-content: center;
  flex-grow: 1;
  flex-direction: column;
}
.Clubs_SelectorLayout {
  display: flex;
  padding: 0 10px;
  align-items: center;
  /* margin-bottom: 15px; */
  flex-grow: 1;
}
.Clubs_Mid {
  padding-bottom: 20px;
}
.Clubs_SemiBox {
  background-color: hsl(var(--back-h), var(--back-s), 23%);
  margin-bottom: 20px;
  padding: 20px 10px;
}
.Clubs_Box {
  --cg-width: 230px;
  display: flex;
  max-width: calc(var(--cg-width) * 5);
  margin: 0 auto;
  justify-content: center;
  gap: 30px;
}
.Clubs_DayBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3px;
}
.Clubs_DayNotCurrent {
  display: flex;
  justify-content: center;
  font-size: 0.8em;
  margin-top: -5px;
  margin-bottom: 5px;
  opacity: 0.6;
}
.Clubs_DaySelectorActive {
  color: var(--d-text-b);
  box-shadow: inset 4px 0px 0px 0px #ffffff1f;
}
.Main_AdminText {
  color: rgb(var(--d-text-yellow));
  margin-bottom: 7px;
}
.Main_AdminTextArea {
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
.Main_AdminLayoutBox {
  flex-direction: column;
  align-items: center;
}
.Main_AdminLayout {
  max-width: 500px;
  flex-grow: 1;
  width: 100%;
}
.Main_AdminTracksetUuidLayout {
  --cor: #ffc80040;
  box-shadow: 0px 0px 0px 1px var(--cor);
  padding: 10px;
}
.Main_SearchItemList {
  display: flex;
  flex-grow: 1;
  align-items: center;
  text-align: left;
}
.Row_DialogMidBox {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  justify-content: space-between;
}
.Main_ViewsBox {
}
.Main_ViewsCountDialog {
  font-size: 0.8em;
  white-space: nowrap;
  line-height: 1;
  margin-left: 2px;
  margin-top: 3px;
}
.Cg_ViewsCount {
  font-size: 0.8em;
  white-space: nowrap;
  margin-left: 15px;
  opacity: 0.7;
}
.Cg_ViewsCount:first-child {
  margin-left: 0px;
}
.MainFindCar_CarCard {
  position: relative;
}
.MainFindCar_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.MainFindCar_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.MainFindCar_RQ {
  display: flex;
  color: #000;
  background-color: var(--color);
  height: 20px;
  justify-content: center;
  width: 19px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 21px;
  border-top-right-radius: 4px;
  padding-right: 1px;
  font-size: 15px;
}
a:not(.D_Button),
a:visited:not(.D_Button) {
  color: rgb(var(--d-text-yellow));
}
.App_BrakeItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
}
.App_BrakeItem + .App_BrakeItem {
  margin-top: 15px;
}
.App_BrakeLeft {
  
}
.App_BrakeRight > :first-child {
  font-size: 2em;
  color: rgb(var(--d-text-yellow));
}







.Main_2 {
  --cell-width: 85px;
  --cell-height: 42px;
  --top-height: 70px;
  --left-width: 250px;
  font-size: 15px;
}
.Main_2 .Main_Mid {
  /* display: none; */
  height: auto;
}
.Main_2 .Main_Left {
  width: unset;
  position: sticky;
  top: 0;
  margin-top: 0;
  height: var(--top-height);
  box-shadow: none;
  min-height: unset;
  margin-left: var(--left-width);
  margin-left: 0;
  z-index: 5;
  display: block;
  left: unset;
  flex-grow: 1;
}
.Main_2 .Main_LeftPlusTop {
  display: flex;
}
.Main_2 .Main_Backtop {
  background-color: transparent;
}
.Main_2 .Main_RowCornerBox {
  background-color: hsl(var(--back-h), var(--back-s), 21%);
}
.Main_2 .Main_Credits {
  /* display: none; */
}
.Main_2 .Main_TrackList {
  display: flex;
  height: 100%;
}
.Main_2 .Row_Layout:not(.Row_ForceNormalSize) {
  display: flex;
}
.Main_2 .Main_Body {
  flex-direction: column;
  min-width: 100%;
}
.Main_2 .Row_Cell:not(.Row_ForceNormalSizeCell) {
  width: var(--cell-width);
  height: 100%;
}
.Main_2 .Row_Times .Row_Cell {
  height: var(--cell-height);
}
.Main_2 .Row_Content {
  /* line-height: calc(var(--cell-height) - 12px); */
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1em;
}
.Main_2 .Row_ContentEmpty:not(:focus) ~ .Row_Placeholder {
  display: flex;
}
.Main_2 .Row_Placeholder {
  width: 100%;
  justify-content: center;
  align-items: center;
}
.Main_2 .Row_Tracks:not(.Row_ForceNormalSize) .Row_Content {
  text-align: center;
  white-space: normal;
  flex-direction: column;
  word-break: break-word;
  padding: 0 6px;
}
.Main_2 .Row_Tracks:not(.Row_ForceNormalSize) .Row_Cell {
  border-right-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 0;
}
.Main_2 .Row_Layout:not(.Row_ForceNormalSize) {
  display: flex;
  align-items: stretch;
}
.Main_2 .Row_ConfigLabel {
  display: none;
}
.Main_2 .Row_ConfigButton {
  --height: 30px;
  padding: 0px 4px;
}
.Main_2 .Row_ConfigIcon {
  font-size: 18px;
}
.Main_2 .Row_Tracks:not(.Row_ForceNormalSize) .Row_ConfigCell {
  /* box-shadow: inset 0px -18px 16px -17px #5fb500, inset 0px -3px 0px 0px #5fb500; */
}
.Main_2 .Row_ConfigCell.Row_Cell {
  width: calc(var(--cell-width) * 1);
}
.Main_2 .Row_Tune {
  padding-left: 16px;
}
.Main_2 .Row_TuneChooseBox {
  position: absolute;
  flex-direction: row;
  left: 0;
  background-color: #4c4c4c;
  padding: 3px;
  border-radius: 10px;
}
.Row_OrderBox {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}
.Main_2 .Row_OrderBox {
  display: flex;
}
.Main_2 .Row_ConfigIcon {
  transform: rotate(90deg);
}
.Main_2 .Row_TuneChooseBox .Row_ConfigButton:nth-child(5) {
  display: none;
}
.Main_2 .Main_AddTrackBox {
  flex-direction: column;
  gap: 0px;
} 
.Main_2 .Row_Content {
  padding: 12px 0;
}
.Main_2 .Car_AddButton {
  flex-direction: row;
  gap: 7px;
}
.Main_2 .Car_LayoutAddCarLabel {
  margin-top: 0px;
}
.Main_2 .Main_AddTrackDirect {
  --height: 36px;
  font-size: 20px;
}
.Main_2 .Row_ShowMoreTracks {
  margin-top: 0;
}




.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) {
  --card-left-width: 19%;
  --card-right-width: 31%;
  --card-top-height: 11.5%;
  --card-stat-height: 31.9px;
}
.Main_Compact .Car_Header:not(.Car_AddHeader):not(.Row_DialogCardCard) > *:not(.Car_HeaderName):not(.Car_HeaderBlockRQ):not(.Car_HeaderBlockClass):not(.Car_HeaderBlockTopSpeed):not(.Car_HeaderBlock060):not(.Car_HeaderBlockHandling):not(.Car_HeaderBlockDrive):not(.Car_CompactOverlay):not(.Car_HeaderBlockPrize):not(.Car_HeaderBlockTires):not(.Car_TuneTip) {
  display: none;
}
.Main_Compact .Car_Header:not(.Car_AddHeader):not(.Row_DialogCardCard) .Car_HeaderBlockTiresLabel {
  display: none;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) {
  width: 120px;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderName {
  font-size: 0.8em;
  width: calc(100% - 8px);
  margin-top: 0px;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderNameBig {
  font-size: 0.7em;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderNameBigBig {
  font-size: 0.6em;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockTopSpeed,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlock060,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockHandling,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockDrive {
  box-shadow: 0px -2px 0px hsla(0, 100%, 100%, 0.09);
  backdrop-filter: blur(4px);
  background-color: #0000004a;
}
@media (pointer:coarse) {
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockTopSpeed,
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlock060,
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockHandling,
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockDrive {
    backdrop-filter: unset;
    background-color: hsla(40, 6%, 30%, 0.8);
  }
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderStatValue,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderStatLabel {
  padding-right: 1px;
}
.Main_Compact {
  --cell-width: 120px;
}
.Main_Compact .Main_LogoPre {
  font-size: 14px;
}
.Main_Compact .Cg_DividerBackLight {
  height: 80px;
}




.App_isPrinting .Main_Layout {
  /* min-height: calc(100% - var(--top-menu)); */
  max-width: 100%;
  width: min-content;
  /* width: 100%; */
  /* display: flex; */
  /* -webkit-user-select: none; */
}
.Main_BodyPrint .Main_Corner {
  justify-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: 50px max-content;
}
.Main_BodyPrint .Row_Tune {
  padding-left: 0px;
}
.Main_BodyPrint .Main_Credits {
  display: none;
}
.Main_BodyPrint .Row_DisabledCell {
  background-color: #00000024;
}
.Main_BodyPrint .Row_Cell {
  border: solid 2px #ffffff07;
  border-right-width: 0;
  border-bottom-width: 0;
}
.Main_Layout:not(.Main_2) .Main_BodyPrint .Row_Cell:nth-child(3n-1) {
  border-top-width: 2px;
  border-top-color: #ffffff1c;
}
.Main_2 .Main_BodyPrint .Row_ConfigCell {
  width: 70px; /* this value is hard coded in sharePrint() */
}
.Main_2:not(.Main_ColorsFull) .Main_BodyPrint .Car_Layout:nth-child(3n-1) .Row_Cell {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #ffffff1c;
}
.Main_2 .Main_BodyPrint .Main_LogoPre {
  display: none;
}
.Main_2 .Main_BodyPrint .Row_Tune233:before,
.Main_2 .Main_BodyPrint .Row_Tune332:before {
  content: "";
  position: absolute;
  height: 100%;
  opacity: 0.07;
  pointer-events: none;
  width: 20%;
  background: white;
  bottom: 0px;
}
.Main_2 .Main_BodyPrint .Row_Tune332:before {
  left: 0;
}
.Main_2 .Main_BodyPrint .Row_Tune233:before {
  right: 0;
}
.Main_BodyPrint .Main_UserBottom {
  display: none;
}
.Main_BodyPrint.Main_Body button {
  display: none;
}
.Main_BodyPrint .Main_CornerMid {
  display: none;
}
.Main_BodyPrint .Car_LayoutAddCar {
  display: none !important;
}
.Main_BodyPrint .Main_SaveAllBox {
  display: none;
}
.Main_BodyPrint .Main_PrintBy {
  display: block;
}
.Main_BodyPrint {
  --card-top-height: 12%;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );
}
.Main_BodyPrint .Car_HeaderName {
  /* margin-top: -1px; */
}
.Main_BodyPrint .Row_EmptyInvite {
  display: none;
}
.Main_Compact .Main_BodyPrint .Car_HeaderBlockTopSpeed,
.Main_Compact .Main_BodyPrint .Car_HeaderBlock060,
.Main_Compact .Main_BodyPrint .Car_HeaderBlockHandling,
.Main_Compact .Main_BodyPrint .Car_HeaderBlockDrive,
.Main_BodyPrint .Car_HeaderBlockTop {
  background-color: hsla(40, 6%, 30%, 0.8);
}
.Main_BodyPrint .Car_HeaderBlockTop {
  height: calc(var(--card-top-height) + 1px);
}
.Main_Compact .Main_BodyPrint .Car_HeaderBlockTopSpeed {
  box-shadow: unset;
}
.Main_Compact .Row_TuneChooseButton {
  /* display: none; */
}
.Main_Compact .Row_TuneChooseBox {
  position: absolute;
  flex-direction: column;
  top: 4px;
  background-color: #4c4c4c;
  padding: 10px;
  border-radius: 10px;
}
.Main_Compact .Car_Loading::after {
  left: 50%;
}
.Main_BodyPrint .Main_GamePrintInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-top: 15px;
}
.Main_2 .Main_BodyPrint .Main_GamePrintInfo {
  margin-top: 0px;
  flex-direction: row;
}
.Main_2 .Main_BodyPrint {
  --top-height: 93px;
}
.Main_BodyPrint .Main_Left {
  justify-content: flex-start;
}
.Main_BodyPrint .Main_PrintCreditsBottom {
  display: block;
  max-width: calc( var(--cell-width) * var(--number-cars) )
}
.Main_2 .Main_BodyPrint .Main_PrintCreditsBottom {
  display: block;
  max-width: calc( var(--cell-width) * var(--number-tracks) + var(--left-width))
}
.Main_BodyPrint .Row_ShowMoreTracks {
  display: none;
}
.Main_BodyPrint .Row_Campaign {
  display: none !important;
}
.Main_Compact .Main_BodyPrint .Row_TuneChooseBox,
.Main_2 .Main_BodyPrint .Row_TuneChooseBox {
  display: none;
}
.Main_BodyPrint .Cg_Points {
  background: none;
  color: var(--cor);
}
.Main_BodyPrint.Cg_Layout {
  width: 1200px;
  min-width: 1200px;
}
.Main_BodyPrint.Cg_Layout .Main_AddTrackDirect,
.Main_BodyPrint.Cg_Layout .Cg_SelectorRight,
.Main_BodyPrint.Cg_Layout .Cg_SelectorLeft,
.Main_BodyPrint.Cg_Layout .Cg_FilterButtons,
.Main_BodyPrint.Cg_Layout .Row_ConfigButton,
.Main_BodyPrint.Cg_Layout .ticon-keyboard_arrow_down {
  display: none;
}
.Main_BodyPrint.Cg_Layout .Row_TuneChooseButton {
  border-radius: unset;
  transition-duration: unset;
}
.Main_BodyPrint.Cg_Layout .Row_DialogButtonTuneActive,
.Main_BodyPrint.Cg_Layout .BaseChip.D_ButtonActive {
  box-shadow: unset;
  background-color: rgba(var(--d-text-green), 0.4) !important;
  color: white;
}
.Main_BodyPrint.Cg_Layout .Cg_ThemTime .Row_Cell,
.Main_BodyPrint.Cg_Layout .Cg_YouTime .Row_Cell:not(.Row_ConfigCell) {
  border-bottom-width: 2px;
}
.Main_BodyPrint.Cg_Layout .Cg_Race:last-child .Row_Cell {
  border-right-width: 2px;	
}
.Main_BodyPrint .Cg_Header {
  position: static;
}
.Main_BodyPrint .Cg_Mid {
  margin-top: 0;
}
.Main_BodyPrint .Cg_BottomModTools {
  display: none;
}
.Main_BodyPrint .BaseEventTrackbox_ClassCheck {
  display: none;
}
.Main_BodyPrint .Event_CompilationIncomplete {
  display: none;
}
.Main_BodyPrint .BaseSwitch_Layout {
  display: none;
}
.Main_BodyPrint .Main_AdminLayoutBox {
  display: none;
}
.Main_BodyPrint .Clubs_TrackReqSelectBox {
  display: none;
}
.Main_BodyPrint .Main_ViewsBox {
  display: none;
}
.Main_BodyPrint .Main_ViewsBox {
  display: none;
}
.Main_BodyPrint .Main_Backtop {
  min-width: unset;
}
.Main_BodyPrint .Main_Logo {
  display: block;
}





@media only screen and (max-width: 767px) {
  .Main_Normal .Main_Body:not(.Main_BodyPrint) {
    /* --d-back: #504242; */
    --left-width: 120px;
  }
  .Main_BodyPrint {
    /* --left-width: 200px; */
  }
  .Main_CornerMid .BaseAvatar_Layout {
    display: none;
  }
  .Main_UserBottom .BaseAvatar_Layout {
    --size: 21px !important;
  }
  .Main_UserName {
    font-size: 0.7em;
  }
  .Main_FilterClassChips {
    gap: 5px;
  }
  .Main_FilterDual {
    grid-template-columns: 1fr;
  }
  .Main_FilterThree {
    grid-template-columns: 1fr;
  }
  .Main_OptionsDual {
    /* grid-template-columns: 1fr;
    gap: 20px; */
  }
  .Main_FilterClearTop {
    justify-content: center;
    margin-top: -10px;
    margin-bottom: -5px;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .Main_CampaignMatch {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    grid-auto-flow: row;
  }
  .Main_AddTrackBox {
    gap: 5px;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) {
    --left-width: 85px;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Right {
    display: none;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .Car_Header2 {
    padding-right: 0;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Left {
    margin-right: 0px;
    width: 100%;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Img {
    transform: scale(1.2) translateX(7px) translateY(-6px);
    height: 140%;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Right2 {
    display: flex;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .Main_Logo {
    display: none;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .D_ButtonMenu {
    padding: 11px 8px;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .Main_BestOfOutside {
    display: none;
  }
  .Cg_Layout .Cg_Corner {
    width: auto;
    padding: 0 15px;
  }
  .Cg_Layout .Cg_SelectorLeft {
    margin-right: 10px;
  }
  .Cg_Layout .Main_CornerMid {
    margin: 0px;
  }
  .Cg_Layout .Cg_SelectorCenter {
    text-align: left;
  }
  .Cg_Layout .Cg_CenterBottom,
  .Cg_Layout .Clubs_DayBox,
  .Cg_Layout .Clubs_DayNotCurrent {
    justify-content: flex-start;
  }
  .Cg_Layout .Cg_RqText {
    margin-left: 9px;
  }
  .Cg_Layout .D_Button.Main_ArrowDownSelect {
    padding: 0 2px 0 2px;
  }
}
@media only screen and (min-width: 768px) {
  .Main_MidEmptyItemAdd .Main_MidEmptyButtonSearch {
    height: 150px;
    width: 200px;
  }
  .Main_Normal .Main_AddTrackDirectLarger {
    width: 80px;
  }
}
@media only screen and (max-width: 1200px) {
  /* .Cg_Box {
    justify-content: flex-start;
  } */
  .Main_Layout > *:not(.Main_BodyPrint) .Event_BankCarName {
    display: none;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_Box {
    --cg-width: 115px;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankResult,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankClass,
  .Main_Layout > *:not(.Main_BodyPrint) .Event_BankClass {
    display: none;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankTune {
    color: var(--cor);
  }
  .Main_Layout.Main_ShowPoints > *:not(.Main_BodyPrint) .Cg_BankTune {
    display: none;
  }
  .Main_Layout.Main_ShowPoints > *:not(.Main_BodyPrint) .Cg_BankResult {
    display: block;
    margin-right: 0;
    transform: translateX(-7px);
  }
  .Main_Layout.Main_ShowPoints > *:not(.Main_BodyPrint) .Cg_BankResult:not(.Cg_PointsRed):not(.Cg_PointsGreen):not(.Cg_PointsGrey) {
    font-size: 0.7em;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_Divider {
    --size: 30px;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsRed,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsGreen,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsGrey {
    --size: 40px;
  }
  .Event_CompilationBox .Event_BankTime {
    text-align: left;
    padding-left: 7px;
    --size: 40px;
  }
  .Event_BankClass {
    margin-left: 5px;
  }
}
@media only screen and (max-width: 600px) {
  .Cg_Box {
    justify-content: flex-start;
  }
}









/*  */
/*  */
/*  */
/* Car.vue */
/*  */
/*  */
/*  */
.Car_Layout {
  width: var(--cell-width);
  
  /* margin-right: 3px; */
  transform: translate( calc(var(--drag-left) * 1px / var(--drag-left-slo)), calc(var(--drag-top) * 1px / var(--drag-top-slo)) );
  position: relative;
  height: min-content;
  pointer-events: auto;
}
.Car_Dragging {
  background-color: #242424;
  box-shadow: 0px 0px 0px 5px #505050;
  border-radius: 10px;
  transition-duration: 0.3s;
  transition-property: background-color, box-shadow, border-radius;
  z-index: 200;
  cursor: grabbing;
}
.Car_Dragging .Car_Header {
  pointer-events: none;
}
.Car_DraggingParent > :not(.Car_Dragging) {
  transition-duration: 0.3s;
}
.Car_Layout:not(.Car_Dragging) {
  transition-duration: 0.3s;
}
.Car_PushLeft {
  transform: translateX(calc(var(--cell-width) * -1));
}
.Car_PushRight {
  transform: translateX(var(--cell-width));
}
.Main_2 .Car_PushLeft {
  transform: translateY(calc(var(--cell-height) * -1));
}
.Main_2 .Car_PushRight {
  transform: translateY(var(--cell-height));
}
.Car_Header {
  height: calc(var(--top-height) - 6px);
  margin: 3px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 3px;
  z-index: 20;
  font-family: 'Roboto Condensed', sans-serif;
  /* background-color: #956363; */
  color: #eee;
  background-color: #919191;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.06) 0, rgba(0, 0, 0, 0.06) 30px );
  background-size: cover;
  background-position: center;
  border-radius: 7px;
  overflow: hidden;
  /* box-shadow: inset 0px -24px 28px -20px #000f; */
  font-size: var(--card-font-size);
}
.Car_Header > * {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.Car_HeaderBlockTop {
  top: 0;
  left: 0;
  width: 100%;
  height: var(--card-top-height);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.Car_HeaderBlockBrand {
  top: 0;
  left: 0;
  width: var(--card-left-width);
  height: var(--card-top-height);
}
.Car_HeaderBlockYear {
  top: 0;
  right: 10%;
  width: calc(var(--card-right-width) - 10%);
  height: var(--card-top-height);
  font-size: 0.8em;
  text-align: center;
}
.Car_HeaderBlockCountry {
  top: 0;
  right: 0;
  width: 10%;
  height: var(--card-top-height);
  font-size: 1.09em;
  font-weight: bold;
  text-align: center;
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), 0.4);
}
.Car_HeaderBlockRQ {
  width: var(--card-left-width);
  height: var(--card-left-height);
  bottom: 0;
  left: 0;
  text-align: center;
  box-sizing: border-box;
  padding-top: 3%;
}
.Car_HeaderBlockClass {
  width: var(--card-left-width);
  height: 20%;
  left: 0;
  bottom: calc(var(--card-left-height) - 3%);
  text-align: center;
  font-weight: bold;
}
.Car_HeaderBlockPrize {
  display: flex;
  color: rgb(var(--d-text-yellow));
  font-size: 16px;
  background-color: #412900;
  left: 1%;
  top: calc(var(--card-top-height) + 2%);
  padding: 3px;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  box-sizing: border-box;
}
.Car_HeaderBlockTopSpeed {
  top: calc(var(--card-top-height));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlock060 {
  top: calc(var(--card-top-height) + (var(--card-stat-height) * 1));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlockHandling {
  top: calc(var(--card-top-height) + (var(--card-stat-height) * 2));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlockDrive {
  top: calc(var(--card-top-height) + (var(--card-stat-height) * 3));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderName {
  top: 0;
  /* left: var(--card-left-width); */
  left: 4px;
  /* width: calc( 100% - var(--card-left-width) - var(--card-right-width)); */
  width: calc( 100% - var(--card-right-width) - 3px);
  height: var(--card-top-height);
  font-size: 1.1em;
  line-height: 0.9;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.23em;
}
.Car_HeaderNameBig {
  font-size: 0.92em;
}
.Car_HeaderNameBigBig {
  font-size: 0.7em;
}
.Car_HeaderBlockTires {
  flex-direction: row;
  gap: 3px;
  bottom: 2%;
  font-size: 0.7em;
  right: calc(var(--card-right-width) + 1%);
  font-weight: 300;
  width: 50%;
  justify-content: flex-end;
  display: block;
  text-align: right;
}
.Car_HeaderBlockTires > :first-child {
  text-transform: uppercase;
}
.Car_HeaderBlockStars {
  flex-direction: row;
  gap: 6px;
  font-size: 0.6em;
  bottom: 5%;
  left: calc(var(--card-left-width) + 3.5%);
  color: var(--class-color);
  filter: drop-shadow(0px 1px 1px #000c);
  width: 20%;
  justify-content: flex-start;
}
.Row_DialogCardCard .Car_HeaderBlockStars {
  font-size: 0.8em;
}
.Car_HeaderStatValue {
  text-align: right;
  font-size: 1.3em;
  font-weight: bold;
  line-height: 1.1;
  /* padding-right: 4px; */
  padding-right: 6.5%;
  color: #fff;
  opacity: 0.95;
  letter-spacing: 0.3px;
}
.Car_HeaderStatLabel {
  text-align: right;
  font-size: 0.55em;
  line-height: 1;
  /* padding-right: 4px; */
  padding-right: 6.5%;
  font-weight: 300;
  color: #fff;
  opacity: 0.6;
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.Car_HeaderRQValue {
  font-size: 1.5em;
  line-height: 1.1;
  font-weight: bold;
}
.Car_HeaderRQValue3 {
  font-size: 1.3em;
}
.Car_HeaderRQLabel {
  line-height: 1;
  font-size: 0.6em;
  color: var(--class-color);
  line-height: 1.2;
  transform: scaleX(1.7) skewX(-14deg);
}
.Car_HeaderClassBack {
  background-color: var(--class-color);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: skewY(9deg);
}
.Car_HeaderClassValue {
  position: relative;
  color: black;
  font-size: 1.7em;
}
/* .Car_HeaderBlockTopSpeed,
.Car_HeaderBlock060,
.Car_HeaderBlockHandling,
.Car_HeaderBlockDrive {
  box-shadow: 0px -2px 0px hsla(0, 100%, 100%, 0.09);
} */

/* .Car_HeaderBlockTopSpeed,
.Car_HeaderBlock060,
.Car_HeaderBlockHandling,
.Car_HeaderBlockDrive, */
.Car_CardRightForVideo,
.Car_HeaderBlockTop,
.Car_HeaderBlockBrand,
.Car_HeaderBlockYear {
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), var(--card-stat-back-a));
  backdrop-filter: blur(15px);
}
.Car_CardRightForVideo {
  /* top: var(--card-top-height);
  right: 0;
  width: var(--card-right-width);
  height: calc(100% - var(--card-top-height)); */
}
.Car_WithVideo {
  --card-stat-div: 1px;
}
.Car_WithVideo video {
  /* height: 100%; */
  width: 100%;
  object-fit: cover;
}
.Car_WithVideoHeight video {
  height: 100%;
  width: unset;
}
.BaseCard_Layout:not(.Car_WithVideoNoBox) .Car_WithVideo .Car_HeaderBlockTopSpeed,
.BaseCard_Layout:not(.Car_WithVideoNoBox) .Car_WithVideo .Car_HeaderBlock060,
.BaseCard_Layout:not(.Car_WithVideoNoBox) .Car_WithVideo .Car_HeaderBlockHandling,
.BaseCard_Layout:not(.Car_WithVideoNoBox) .Car_WithVideo .Car_HeaderBlockDrive {
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), var(--card-stat-back-a));
  backdrop-filter: blur(4px);
  height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );
}
.BaseCard_Layout:not(.Car_WithVideoNoBox) .Car_WithVideo .Car_HeaderBlockTop,
.BaseCard_Layout:not(.Car_WithVideoNoBox) .Car_WithVideo .Car_HeaderBlockBrand,
.BaseCard_Layout:not(.Car_WithVideoNoBox) .Car_WithVideo .Car_HeaderBlockYear {
  backdrop-filter: blur(4px);
}
@media (pointer:coarse) {
  .Car_HeaderBlockTop,
  .Car_HeaderBlockBrand,
  .Car_HeaderBlockYear {
    backdrop-filter: unset;
    background-color: hsla(40, 6%, 30%, 1);
  }
}
.Car_TuneTip {
  background-color: rgb(55, 54, 49, 0.6);
  right: calc(var(--card-right-width) + 0px);
  bottom: 16px;
  font-size: 14px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 3px;
}
.Car_TuneTipGallery {
  bottom: 2%;
  font-size: 0.8em;
  left: calc(var(--card-left-width) + 1%);
  font-weight: 300;
  display: block;
}
.Car_HeaderBlockRQ {
  background-color: hsla(30, 10%, 15%, 1);
}
.Car_NumberStars :nth-child(3) {
  opacity: 0.2;
}
.Car_NumberStarsundefined .Car_Star,
.Car_NumberStarsOther .Car_Star,
.Car_NumberStars000 .Car_Star {
  opacity: 0.2;
}
.Car_HeaderBlockStars[class*='111'] .Car_Star:not(:nth-child(1)) {
  opacity: 0.2;
}
.Car_AddHeader {
  background-image: none;
  background-color: transparent;
  box-shadow: none;
}
.Car_HeaderTools {
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 50%;
  height: 35%;
  bottom: -35%;
  transition-duration: 0.2s;
  opacity: 0;
  z-index: 1;
}
.Car_HeaderToolsHoverContainer {
  width: 80%;
  height: 40%;
  bottom: 0;
}
.Car_HeaderToolsHoverContainer:hover ~ .Car_HeaderTools,
.Car_HeaderTools:hover {
  bottom: 0;
  opacity: 1;
}
.Car_HeaderTools:focus-within {
  transition-duration: 0.0s;
  bottom: 0;
  opacity: 1;
}
.Car_HeaderToolsBack {
  /* background-image: linear-gradient(0deg, var(--class-color), transparent); */
  box-shadow: inset 0px 0px 0px -20px var(--class-color);
  position: absolute;
  width: 100%;
  height: 40%;
  pointer-events: none;
  bottom: 0;
  transition-duration: 0.4s;
}
.Car_HeaderToolsHoverContainer:hover ~ .Car_HeaderToolsBack,
.Car_HeaderTools:hover ~ .Car_HeaderToolsBack,
.Car_Header:focus-within .Car_HeaderToolsBack {
  box-shadow: inset 0px -37px 28px -10px var(--class-color);
}
.Car_DragIcon {
  transform: rotate(45deg);
}
.Car_DragDot {
  background-color: white;
  width: 100%;
  height: 100%;
}
.D_Button.Car_HeaderButton {
  position: relative;
  --back-color: 0, 0, 0;
  --back-opac: 0.3;
  padding: 8px;
}
.D_Button.Car_HeaderDrag {
  cursor: grab;
}
.Car_HeaderIcon {
  font-size: 25px;
  color: white;
}
.Car_Loading {
  overflow: hidden;
}
.Car_Loading::after {
  content: "";
  position: absolute;
  width: 150%;
  height: 4px;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 7px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 14px
  );
  animation: Car_Loop 0.6s linear infinite;
  bottom: 0;
  left: 0;
}
@keyframes Car_Loop {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(-80px);
  }
}
.Car_Body {
  color: #bbb;
}
.Car_CompactOverlay {
  display: none;
}
.Car_LayoutAddCar {
  position: sticky;
  top: 0;
  left: 0;
}
.Car_LayoutAddCarLabel {
  display: none;
  margin-top: 5px;
  font-size: 21px;
}
.Car_WithMidEmpty .Car_LayoutAddCarLabel {
  display: block;
}
/* .Main_Normal .Car_LayoutAddCar.Car_WithMidEmpty {
  position: absolute;
  margin-left: var(--left-width);
} */
.Main_2 .Main_Body .Main_CarList {
  flex-direction: column;
}
.Main_2 .Main_Body .Car_Layout {
  width: min-content;
  display: flex;
}
.Main_2 .Main_Body .Car_Header:not(.Car_AddHeader) {
  /* width: var(--left-width);
  font-size: 7px;
  margin: 3px 0px; */
  display: none;
}
.Car_Header2 {
  display: none;
  user-select: none;
  cursor: grab;
}
.Main_2 .Main_Body .Car_Header2 {
  width: var(--left-width);
  box-shadow: inset 0px -2px 0px 0px #ffffff0d;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  line-height: 1.1;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  padding: 0 6px;
  position: sticky;
  left: 0;
  z-index: 20;
  background-size: contain;
  background-position: left;
  /* padding-left: calc(var(--cell-height) * 1.7); */
  padding-left: 0;
  height: var(--cell-height);
}
.Main_2 .Main_Body .Car_Body {
  display: flex;
  align-items: stretch;
}
.Main_2 .Main_Body .Car_AddHeader {
  display: flex;
  align-items: stretch;
  width: var(--left-width);
}
.Car_Header2 b {
  color: var(--class-color);
  font-weight: normal;
}
.Main_Compact .Car_CompactOverlay,
.Main_isMobile .Car_CompactOverlay {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
}
.Car_ImgTag {
  position: static !important;
  display: inline !important;
  width: 100%;
  /* object-fit: cover; */
}

@media (pointer:coarse) {
  .Car_HeaderToolsHoverContainer {
    display: none;
  }
}




/*  */
/*  */
/*  */
/*  */
/* BaseCard.vue */
/*  */
/*  */
/*  */
.BaseCard_Layout {
  display: contents;
  --opacity: 0.4;
}
.BaseCard_FixBack {
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  top: 0;
  left: 0;
  position: sticky;
  width: 100%;
  height: var(--top-height);
  z-index: 20;
}
.BaseCard_FixBack + .Car_Header {
  margin-top: calc((var(--top-height) - 3px) * -1);
}
.Main_2 .BaseCard_FixBack {
  display: none;
}
.BaseCard_Header2Left {
  /* width: calc(var(--cell-height) * 1.7);
  min-width: calc(var(--cell-height) * 1.7);
  height: 100%;
  background-size: 90px;
  background-position: 33%;
  transform: scale(1.0001);
  margin-right: 5px; */

  display: flex;
  height: var(--cell-height);
  /* margin: -7px 0; */
  width: 53px;
  min-width: 53px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 5px;
  background-color: #00000038;
}
.BaseCard_Header2Img {
  transform: scale(1.4) translateX(1px);
  height: 100%;
}
.BaseCard_Header2Right {
  font-size: 14px;
  flex-grow: 1;
  max-width: calc(100% - 56px);
}
.BaseCard_Header2Top {
  color: grey;
}
.BaseCard_Header2Bottom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.BaseCard_Header2Right2 {
  display: none;
  color: black;
  background-color: var(--class-color);
  height: 20px;
  justify-content: center;
  width: 19px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 21px;
  border-top-right-radius: 4px;
  padding-right: 1px;
}
.BaseCard_EffectBackGround {
  bottom: -60px;
  left: -90px;
  background: radial-gradient(rgba(var(--class-color-rgb), var(--opacity)) 0%, rgba(var(--class-color-rgb),0) 60%);
  position: absolute;
  pointer-events: none;
  width: 330px;
  height: 260px;
}
.BaseCard_ClassA,
.BaseCard_ClassB {
  --opacity: 0.5;
}
.Row_DialogCardLeft {
  position: relative;
}



@keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.3);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}

@keyframes pulseOpaque {
  0% {
    background-color: rgb(246, 246, 246);
  }
  50% {
    background-color: rgb(228, 228, 228);
  }
  100% {
    background-color: rgb(246, 246, 246);
  }
}

@keyframes pulseOpacity {
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.1;
  }
}

.MainShowcase_TitleBox {
  position: relative;
}
.MainShowcase_Title {
  font-size: 30px;
  text-align: center;
}
.MainShowcase_TitleBox path {
  fill: currentColor;
  opacity: 0.3;
}
.MainShowcase_TitleBox .BaseIconSvg_Layout {
  position: absolute;
  top: 50%;
  right: -45px;
  transform: translateY(-50%) scaleX(1);
  width: 60px;
  height: 90px;
}
.MainShowcase_TitleBox .BaseIconSvg_Layout:last-child {
  right: unset;
  transform: translateY(-50%) scaleX(-1);
  left: -45px;
}
.MainShowcase_TitleBox:before {
  content: unset !important;
}
.MainShowcase_SaveBar {
  min-height: 160px;
  margin-bottom: 20px;
}
.MainTimeline_InitAnimation {
  animation: screen_anim 0.2s linear forwards;
  animation-timing-function: cubic-bezier(0, 0.46, 0.49, 0.99);
}
@keyframes screen_anim {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

</style>