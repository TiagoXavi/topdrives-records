<template>
  <div class="TTT_Layout">
    <div class="TTT_Box">
      <div class="TTT_Top">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
      </div>
      <div class="TTT_Mid">
        <BaseText
          v-model="email"
          type="normal"
          label="Email"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="password"
          intype="password"
          type="normal"
          label="Password"
          class="Space_Bottom"
          placeholder="" />
        <div class="TTT_Forgot TTT_ForgotBetween">
          <router-link
            :to="{ name: 'Register' }"
            style="font-size: 13px;"
            class="D_Link">Register?</router-link>
          <router-link
            :to="{ name: 'AskNewPassword' }"
            style="font-size: 13px;"
            class="D_Link">Forgot?</router-link>
        </div>
      </div>
      <div class="TTT_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading || input_error"
          class="D_Button D_ButtonDark TTT_Button"
          @click="validate()">Login</button>
        <router-link
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">Cancel</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue'
import BaseText from '@/components/BaseText.vue';

export default {
  name: 'MainResetPassword',
  components: {
    Logo,
    BaseText
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: null,
      password: null,
      input_error: false,
      finished: false,
      loading: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {

  },
  methods: {
    validate() {
      var checkEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
      if (!checkEmail.test(this.email)) {
        this.putError("Invalid email");
        return;
      }
      
      if (!this.password || this.password.length === 0) {
        this.putError("Type password");
        return;
      }

      this.send();
    },
    putError(msg) {
      this.$store.commit("DEFINE_SNACK", {
        error: true,
        text: msg
      });
      this.input_error = true;
      setTimeout(() => { this.input_error = false}, 1500);
    },
    send() {
      let vm = this;
      this.loading = true;
      axios.post(Vue.preUrl + "/auth", {
        "email": this.email,
        "password": this.password
      })
      .then(res => {
        if (res.data === "OK") {

          this.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: "You logged in"
          });

          setTimeout(() => {
            vm.$router.push({ name: 'Records' });     
          }, 200);

        } else {
          throw new Error();
        }
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
          this.loading = false;
      });
    }
  },
}
</script>

<style>

</style>