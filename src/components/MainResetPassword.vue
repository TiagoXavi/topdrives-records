<template>
  <div class="TTT_Layout">
    <div v-if="!finished" class="TTT_Box">
      <div class="TTT_Top">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
      </div>
      <div v-if="!token" class="TTT_Mid">Something went wrong</div>
      <div v-else class="TTT_Mid">
        <BaseText
          v-model="password"
          intype="password"
          type="normal"
          label="New password"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="password2"
          intype="password"
          type="normal"
          label="Repeat"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="TTT_Bottom">
        <button
           v-if="token"
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading || input_error"
          class="D_Button D_ButtonDark TTT_Button"
          @click="validate()">Send</button>
        <router-link
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">Cancel</router-link>
      </div>
    </div>
    <div v-else class="TTT_Finished">
      <div class="TTT_FinishedText">Done!</div>
      <router-link
        :to="{ name: 'Records' }"
        style="font-size: 14px;"
        class="D_Link D_LinkPlus Space_Top">Back to home</router-link>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue';
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
    token() {
      return this.$route.params.token;
    },
  },
  methods: {
    validate() {
      if (!this.password || this.password.length < 8) {
        this.putError("At least 8 characters please");
        return;
      }

      if (this.password !== this.password2) {
        this.putError("They are different");
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
      this.loading = true;
      axios.post(Vue.preUrl + "/confirmNewPassword", {
        "token": this.token,
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