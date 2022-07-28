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
        <div class="TTT_SubTitle">Email verification</div>
        <button
          v-if="token"
          :class="{ D_Button_Loading: loading, D_Button_Error: error }"
          :disabled="loading || error"
          class="D_Button D_ButtonDark TTT_Button">Send</button>
      </div>
      <div class="TTT_Bottom">
        <router-link
          :to="{ name: 'Records' }"
          style="font-size: 14px;"
          class="D_Link Space_Top">Cancel</router-link>
      </div>
    </div>
    <div v-else class="TTT_Finished">
      <div class="TTT_FinishedText">Done!</div>
      <router-link
        :to="{ name: 'Login' }"
        style="font-size: 14px;"
        class="D_Link Space_Top">Go to Login</router-link>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue';

export default {
  name: 'MainVerifyEmail',
  components: {
    Logo
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      finished: false,
      loading: false,
      error: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    this.validate()
  },
  computed: {
    token() {
      return this.$route.params.token;
    },
  },
  methods: {
    validate() {
      this.loading = true;
      axios.get(Vue.preUrl + "/validateEmailToken/" + this.token)
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