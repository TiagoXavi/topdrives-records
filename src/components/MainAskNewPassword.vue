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
        <div class="TTT_SubTitle">{{ $t("p_resetPassHelper") }}</div>
        <BaseText
          v-model="email"
          type="normal"
          :label="$t("m_email")"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="TTT_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading || input_error"
          class="D_Button D_ButtonDark TTT_Button"
          @click="validate()">{{ $t("m_send") }}</button>
        <router-link
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">{{ $t("m_cancel") }}</router-link>
      </div>
    </div>
    <div v-else class="TTT_Finished">
      <div class="TTT_FinishedText">{{ $t("m_done") }}!</div>
      <div class="TTT_SubTitle Space_BothPlus">{{ $t("p_resetPassIfExist") }}</div>
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
        "email": this.email.toLowerCase()
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