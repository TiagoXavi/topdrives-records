<template>
  <div class="Main_UserCard">
    <BaseAvatar :user="user" size="46px" />
    <div class="Main_UserBlock">
      <div style="color: var(--d-text-b);" class="Main_UserName">
        <span class="Main_UserNameLabel">{{ user.username }}</span>
        <span v-if="user.mod && showMod" class="Main_UserMod">mod</span>
      </div>
      <div v-if="user.discordName" style="color: var(--d-text-b); margin: 2px 0px; color: #99a2ff;" class="Main_UserName">
        <BaseIconSvg type="discord" :useMargin="false" style="width: 19px; margin: 0px 3px 0px 1px;" />
        <span class="Main_UserDiscordLabel">{{ user.discordName }}</span>
      </div>
      <button style="font-size: 16px;" class="D_Button D_ButtonLink Main_UserLogout" @click="logout()">{{ $t('m_logout') }}</button>
    </div>
  </div>
</template>

<script>
import BaseAvatar from './BaseAvatar.vue'
import BaseIconSvg from './BaseIconSvg.vue'

export default {
  name: 'BaseUserCard',
  components: {
    BaseAvatar,
    BaseIconSvg
  },
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    },
    showMod: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    logout() {
      axios.delete(Vue.preUrl + "/logout")
      .then(res => {
        if (res.data === "OK") {
          this.$store.commit("LOGOUT", {});
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: this.$t('m_logoutSuccess')
          });
        } else {
          throw new Error("Unable to log out");
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
      });
    },
  },
}
</script>

<style>
</style>