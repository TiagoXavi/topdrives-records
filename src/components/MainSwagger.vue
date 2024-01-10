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
          class="Main_TextArea data-hj-allow"
          placeholder="array of rids" />
        <BaseText
          v-model="pastVersion"
          type="normal"
          label="Past Version"
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
      <div class="MainSwagger_">"Rimac_Nevera_2021"</div>
      <div class="MainSwagger_">"Rimac_Nevera_2021", "Audi_R18_2016"</div>
      <div class="MainSwagger_">Dont put comma at end</div>
      <div class="MainSwagger_">Errors will cause infinite loading</div>
      <div class="MainSwagger_Response">
        {{ backupCarsRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Backend config</div>
      <div class="MainSwagger_Fields">
        <textarea
          v-model="configObj"
          rows="20"
          class="Main_TextArea data-hj-allow"
          placeholder="Config obj" />
      </div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="setConfig()">Send</button>
      </div>
      <div class="MainSwagger_">DailyVar===20 - day 16</div>
      <div class="MainSwagger_">DailyVar===21 - day 15</div>
      <div class="MainSwagger_Response">
        {{ setConfigRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Clubs obj</div>
      <div class="MainSwagger_Fields">
        <textarea
          v-model="clubsObj"
          rows="10"
          class="Main_TextArea data-hj-allow"
          placeholder="Clubs obj" />
      </div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="setClubsObj()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ setClubsObjRes }}
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
      <div class="MainSwagger_Title">Set user confirmed</div>
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
          @click="setUserConfirmed()">Confirm user</button>
      </div>
      <div class="MainSwagger_Response">
        {{ userConfirmRes }}
      </div>
    </div>
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Hidden Event</div>
      <div class="MainSwagger_Fields">
        <BaseText
          v-model="newEventName"
          type="normal"
          label="Event name"
          class="Space_Bottom"
          placeholder="" />
      </div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="setNewEvent()">Create hidden event</button>
      </div>
      <div class="MainSwagger_Response">
        {{ newEventRes }}
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
    <div class="MainSwagger_Box">
      <div class="MainSwagger_Title">Update Git</div>
      <div class="MainSwagger_Buttons">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark TTT_Button"
          @click="updateGit()">Send</button>
      </div>
      <div class="MainSwagger_Response">
        {{ gitRes }}
      </div>
    </div>
    <button
      style="margin-top: 100px; margin-bottom: 50px;"
      class="D_Button D_ButtonDark"
      @click="$router.push({ name: 'MainCodeUtility' })">Go to code utils</button>
    <button
      style="margin-top: 20px; margin-bottom: 50px;"
      class="D_Button D_ButtonDark"
      @click="$router.push({ name: 'Records' })">Go to home</button>
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
      pastVersion: "20",
      backupCarsRes: null,
      scanSessionRes: null,
      contestRes: null,
      userConfirmRes: null,
      gitRes: null,
      configObj: null,
      setConfigRes: null,
      clubsObj: null,
      setClubsObjRes: null,
      newEventName: null,
      newEventRes: null
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
          this.getConfig();
        }
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });

    },
    getConfig() {
      let vm = this;
      vm.loading = true;

      axios.get(Vue.preUrl + "/getConfig")
      .then(res => {
        vm.configObj = JSON.stringify(res.data, null, 4);
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
    setUserConfirmed() {
      let vm = this;
      vm.loading = true;

      axios.post(Vue.preUrl + "/validateEmailToken", {
        email: this.email
      })
      .then(res => {
        this.userConfirmRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    updateGit() {
      let vm = this;
      vm.loading = true;

      axios.get(Vue.preUrl + "/updategit")
      .then(res => {
        this.gitRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    setConfig() {
      let vm = this;
      vm.loading = true;

      let obj;
      let isParsed = false;
      try {
        obj = JSON.parse(this.configObj);
        isParsed = true;
      } catch (error) {
        
      }

      if (!isParsed) {
        this.setConfigRes = "Inválido parse"
        return;
      }

      axios.post(Vue.preUrl + "/setConfig", obj)
      .then(res => {
        this.setConfigRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    setClubsObj() {
      let vm = this;
      vm.loading = true;

      let obj;
      let isParsed = false;
      try {
        obj = JSON.parse(this.clubsObj);
        isParsed = true;
      } catch (error) {
        
      }

      if (!isParsed) {
        this.setClubsObjRes = "Inválido parse"
        return;
      }

      axios.post(Vue.preUrl + "/setClubsPredict", obj)
      .then(res => {
        this.setClubsObjRes = res.data;
      })
      .catch(error => {
        vm.$store.commit("DEFINE_SNACK", { active: true, error: true, text: error, type: "error" });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    setNewEvent() {
      let vm = this;
      vm.loading = true;

      axios.post(Vue.preUrl + "/newEvent", {
        name: this.newEventName,
        hidden: true
      })
      .then(res => {
        this.newEventRes = res.data;
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