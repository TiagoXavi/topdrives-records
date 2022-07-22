<template>
  <div class="MainLogin_Layout">
    <div class="MainLogin_Box">
      <div class="MainLogin_Top">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
      </div>
      <div class="MainLogin_Mid">
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
      </div>
      <div class="MainLogin_Bottom">
        <button
          :class="{ D_Button_Loading: loading, D_Button_Error: input_error }"
          :disabled="loading"
          class="D_Button D_ButtonDark MainLogin_Button"
          @click="validate()">Send</button>
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
.MainLogin_Layout {
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.MainLogin_Mid {
  margin-top: 30px;
}
.MainLogin_Top .Main_Logo {
  margin: 0;
}
.MainLogin_Bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}
.D_Button.MainLogin_Button {
  padding: 10px 15px;
}
.MainLogin_Finished {
  text-align: center;
}
.MainLogin_FinishedText {
  color: rgb(var(--d-text-green));
  font-size: 30px;
  margin-bottom: 30px;
}
</style>