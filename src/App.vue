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
  </div>
</template>

<script>
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
      shakeTimeout: null
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

    vm.$store.subscribe(mutation => {
      if (mutation.type == "DEFINE_SNACK") {
        vm.letSnack(mutation.payload);
      }
    });
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
    }
  },
}
</script>

<style>
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
  z-index: 100;
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
  margin-top: 4px;
}

input:-webkit-autofill, input:-webkit-autofill:active, input:-webkit-autofill:focus, input:-webkit-autofill:hover {
  -webkit-transition: background-color 9999999999s ease-in-out 0s;
  transition: background-color 9999999999s ease-in-out 0s;
  -webkit-text-fill-color: #a78724!important;
  box-shadow: inset 0px 0px 0px 20px #3a320054;
  caret-color: #a78724;
}

</style>