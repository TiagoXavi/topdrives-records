<template>
  <div class="TTT_Layout" :class="{ MainLoginWrap: wrap }">
    <div class="TTT_Box">
      <div class="TTT_Mid">
        <BaseText
          v-model="email"
          type="normal"
          custom_inputMode="email"
          :label="$t('m_email')"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="password"
          intype="password"
          type="normal"
          :label="$t('m_password')"
          class="Space_Bottom"
          placeholder="" />
        <div class="TTT_Forgot TTT_ForgotBetween">
          <button
            style="font-size: 13px; --height: 25px;"
            class="D_Button D_Link"
            @click="$emit('close'); $router.push({ name: 'Register' })">{{ $t("m_register") }}?</button>
          <button
            style="font-size: 13px; --height: 25px;"
            class="D_Button D_Link"
            @click="$emit('close'); $router.push({ name: 'AskNewPassword' })">{{ $t("m_forgot") }}?</button>
        </div>
      </div>
      <div class="TTT_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading || input_error"
          class="D_Button D_ButtonDark TTT_Button"
          @click="validate()">{{ $t("m_login") }}</button>
        <router-link
          v-if="!wrap"
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">{{ $t("m_cancel") }}</router-link>
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
    wrap: {
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
      this.email = this.email.trim();
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

      let url = Vue.preUrl + "/auth";
      let auth = window.localStorage.getItem("auth");
      if (auth) {
        url = url + `?auth=${auth}`
      }

      axios.post(url, {
        "email": this.email.toLowerCase(),
        "password": this.password
      })
      .then(res => {
        if (res.data === "OK") {

          this.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: this.$t('m_loginSuccess')
          });

          this.$store.commit("AUTH", {});

          if (vm.wrap) {
            vm.$emit('success');
          } else {
            setTimeout(() => {
              vm.$router.push({ name: 'Records' });     
            }, 200);
          }


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
.MainLoginWrap .TTT_Box {
  margin-bottom: 20px;
}
</style>