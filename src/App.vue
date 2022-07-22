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
      this.snackText = obj.text.message ? obj.text.message : obj.text;
      this.snackActive = true;
      if (obj.error) this.snackError = true;
      else if (obj.correct) this.snackCorrect = true;
      else this.snackBlue = true;

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
</style>