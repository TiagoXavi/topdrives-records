<template>
  <div class="MainSwagger_Layout">
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Get user by name</div>
      <div class="MainSwagger_Fields">
        <BaseText
          v-model="username"
          type="normal"
          label="Username"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="getUserByName()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ usernameRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Get user by mail</div>
      <div class="MainSwagger_Fields">
        <BaseText
          v-model="email"
          type="normal"
          label="E-mail"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="getUserByMail()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ emailRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Set tier</div>
      <div class="MainSwagger_Fields">
        <BaseText
          v-model="email"
          type="normal"
          label="E-mail"
          class="Space_Bottom"
          placeholder="" />
        <BaseText
          v-model="tier"
          type="normal"
          label="Tier"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="setTier()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ setTierRes }}
      </div>
    </div>
  </div>
</template>

<script>
import BaseText from '@/components/BaseText.vue';

export default {
  name: 'MainSwagger',
  components: {
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
      loading: false,
      user: null,
      username: null,
      usernameRes: null,
      email: null,
      emailRes: null,
      tier: null,
      setTierRes: null,
    }
  },
  watch: {},
  beforeMount() {

  },
  mounted() {
    this.getUser();
  },
  computed: {},
  methods: {
    getUser() {
      let vm = this;
      vm.loading = true;
      // user
      axios.get(Vue.preUrl + "/getUser")
      .then(res => {
        if (res.data.username !== "TiagoXavi") {
          this.$router.push({ name: 'Records' })
        }
        if (res.data.username) {
          this.user = res.data;
        }
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });

    },
    getUserByName() {
      let vm = this;
      vm.loading = true;

      axios.post(Vue.preUrl + "/getUserByUsernamelow", {
        username: this.username
      })
      .then(res => {
        this.usernameRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    getUserByMail() {
      let vm = this;
      vm.loading = true;

      axios.post(Vue.preUrl + "/getUserByEmail", {
        email: this.email
      })
      .then(res => {
        this.emailRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    setTier() {
      let vm = this;
      vm.loading = true;

      axios.post(Vue.preUrl + "/setTier", {
        email: this.email,
        tier: Number(this.tier)
      })
      .then(res => {
        this.setTierRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
  },
}
</script>

<style>
.MainSwagger_Layout {
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin: 40px auto;
  max-width: 700px;
}
.MainSwagger_Title {
  color: rgb(var(--d-text-yellow));
  margin-bottom: 7px;
}
.MainSwagger_Response {
  word-break: break-word;
  font-family: monospace;
  white-space: pre;
  overflow: hidden;
  font-size: 14px;
}
</style>