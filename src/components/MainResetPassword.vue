<template>
  <div class="MainResetPassword_Layout">
    <div v-if="!finished" class="MainResetPassword_Box">
      <div class="MainResetPassword_Top">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
      </div>
      <div class="MainResetPassword_Mid">
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
      <div class="MainResetPassword_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading"
          class="D_Button D_ButtonDark MainResetPassword_Button"
          @click="validate()">Send</button>
        <router-link
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">Cancel</router-link>
      </div>
    </div>
    <div v-else class="MainResetPassword_Finished">
      <div class="MainResetPassword_FinishedText">Done!</div>
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
        "token": this.$route.params.token,
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
.MainResetPassword_Layout {
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.MainResetPassword_Mid {
  margin-top: 30px;
}
.MainResetPassword_Top .Main_Logo {
  margin: 0;
}
.MainResetPassword_Bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}
.D_Button.MainResetPassword_Button {
  padding: 10px 15px;
}
.MainResetPassword_Finished {
  text-align: center;
}
.MainResetPassword_FinishedText {
  color: rgb(var(--d-text-green));
  font-size: 30px;
  margin-bottom: 30px;
}
</style>