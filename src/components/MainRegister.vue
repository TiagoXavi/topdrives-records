<template>
  <div class="TTT_Layout">
    <div v-if="!finished" class="TTT_Box">
      <div class="TTT_Top">
        <div class="Main_Logo" @click="$router.push({ name: 'Records' })">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
      </div>
      <div class="TTT_Mid">
        <BaseText
          v-model="username"
          type="normal"
          label="Username"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="email"
          autocomplete="new-email"
          type="normal"
          label="Email"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="password"
          autocomplete="new-password"
          intype="password"
          type="normal"
          label="Password"
          class="Space_Bottom"
          placeholder="8 char at least" />
        <BaseText
          v-model="password2"
          intype="password"
          type="normal"
          label="Repeat password"
          class="Space_Bottom"
          placeholder="8 char at least" />
      </div>
      <div class="TTT_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="validate()">Register</button>
        <div class="TTT_Tip">Confirmation email will be sent</div>
        <router-link
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">Cancel</router-link>
      </div>
    </div>
    <div v-else class="TTT_Finished">
      <div class="TTT_FinishedText">Almost done!</div>
      <div class="TTT_FinishedSub">Please, check your email box</div>
      <router-link
        :to="{ name: 'Records' }"
        style="font-size: 14px;"
        class="D_Link Space_Top">Back to home</router-link>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue'
import BaseText from '@/components/BaseText.vue';

export default {
  name: 'MainRegister',
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
      username: null,
      email: null,
      password: null,
      password2: null,
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
      
      if (!this.username || this.username.length === 0) {
        this.putError("Type username");
        return;
      }
      
      if (this.username.length < 4) {
        this.putError("Username must have a least 4 characters");
        return;
      }
      
      if (!this.password || this.password.length === 0) {
        this.putError("Type password");
        return;
      }

      if (this.password.length < 8) {
        this.putError("Password must have a least 8 characters");
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
      axios.post(Vue.preUrl + "/registration", {
        "username": this.username,
        "email": this.email,
        "password": this.password
      })
      .then(res => {
        if (res.data === "OK") {
          this.finished = true;
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