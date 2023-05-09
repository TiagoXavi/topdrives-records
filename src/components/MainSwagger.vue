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
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Set mod</div>
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
          @click="setMod()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ setModRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Backup cars</div>
      <div class="MainSwagger_Fields">
        <textarea
          v-model="rids"
          rows="6"
          class="MainSwagger_TextArea data-hj-allow"
          placeholder="array of rids" />
        <BaseText
          v-model="pastVersion"
          type="integer"
          label="Version"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="backupCars()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ backupCarsRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Scan sessions</div>
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
          @click="scanSession()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ scanSessionRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Contest</div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="contest()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ contestRes }}
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
      setModRes: null,
      rids: null,
      pastVersion: "18",
      backupCarsRes: null,
      scanSessionRes: null,
      contestRes: null
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
        this.email = (res.data[0] || {}).email
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
    setMod() {
      let vm = this;
      vm.loading = true;

      axios.post(Vue.preUrl + "/setmod", {
        email: this.email
      })
      .then(res => {
        this.setModRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    backupCars() {
      let vm = this;
      vm.loading = true;

      let rids = JSON.parse(`[${this.rids}]`)
      debugger;

      axios.post(Vue.preUrl + "/backupCars", {
        rids: rids,
        pastVersion: this.pastVersion,
      })
      .then(res => {
        this.backupCarsRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    scanSession() {
      let vm = this;
      vm.loading = true;

      axios.post(Vue.preUrl + "/scanSession", {
        email: this.email
      })
      .then(res => {
        this.scanSessionRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    contest() {
      let vm = this;
      vm.loading = true;

      axios.get(Vue.preUrl + "/contest")
      .then(res => {
        this.contestRes = res.data;
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
.MainSwagger_TextArea {
  background-color: rgba(0,0,0,.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: none;
  margin-top: 2px;
  width: 100%;
}
</style>