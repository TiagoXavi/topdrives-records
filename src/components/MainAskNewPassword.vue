<template>
  <div class="TTT_Layout">
    <div v-if="!finished" class="TTT_Box">
      <div class="TTT_Top">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
      </div>
      <div class="TTT_Mid">
        <div class="TTT_SubTitle">Type your email to receive a link to reset your password</div>
        <BaseText
          v-model="email"
          type="normal"
          label="Email"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="TTT_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading"
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
      <div class="TTT_SubTitle Space_BothPlus">If exist a user with this email, a link to reset password was sent.</div>
      <router-link
        :to="{ name: 'Records' }"
        style="font-size: 14px;"
        class="D_Link D_LinkPlus Space_Top">Back to home</router-link>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue'
import BaseText from '@/components/BaseText.vue';

export default {
  name: 'MainAskNewPassword',
  components: {
    Logo,
    BaseText
  },
  props: {},
  data() {
    return {
      email: null,
      input_error: false,
      finished: false,
      loading: false,
      error: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    validate() {
      var checkEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
      if (!checkEmail.test(this.email)) {
        this.putError("Invalid email");
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
      axios.post(Vue.preUrl + "/sendEmailReset", {
        "email": this.email
      })
      .then(res => {
        if (res.data === "OK") {
          this.finished = true;
          this.error = false;
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        this.error = true;
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