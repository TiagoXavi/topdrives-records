<template>
  <div class="TTT_Layout">
    <div v-if="!finished" class="TTT_Box">
      <div class="TTT_Mid">
        <BaseText
          v-model="username"
          type="normal"
          :label="$t('m_username')"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="email"
          autocomplete="new-email"
          type="normal"
          :label="$t('m_email')"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="password"
          autocomplete="new-password"
          intype="password"
          type="normal"
          :label="$t('m_password')"
          :placeholder="$t('m_charLeast', { n: 8 })"
          class="Space_Bottom" />
        <BaseText
          v-model="password2"
          intype="password"
          type="normal"
          :label="$t('m_repeatPassword')"
          :placeholder="$t('m_charLeast', { n: 8 })"
          class="Space_Bottom" />
      </div>
      <div class="TTT_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading || input_error"
          class="D_Button D_ButtonDark TTT_Button"
          @click="validate()">{{ $t("m_register") }}</button>
        <div class="TTT_Tip">{{ $t("p_confirmationWillSent") }}</div>
        <router-link
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">{{ $t("m_cancel") }}</router-link>
      </div>
    </div>
    <div v-else class="TTT_Finished">
      <div class="TTT_FinishedText">{{ $t("m_allmostDone") }}!</div>
      <div class="TTT_FinishedSub">{{ $t("p_checkYourEmailBox") }}</div>
      <div class="TTT_Tip2">{{ $t("p_spamToo") }}</div>
      <router-link
        :to="{ name: 'Records' }"
        style="font-size: 14px;"
        class="D_Link D_LinkPlus Space_Top">{{ $t("m_backHome") }}</router-link>
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
      this.email = this.email.trim();
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
      
      if (this.username.length > 18) {
        this.putError("Username must have max 18 characters");
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
        "email": this.email.toLowerCase(),
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