<template>
  <div class="Main_UserCard">
    <BaseAvatar :user="user" size="46px" />
    <div class="Main_UserBlock">
      <div style="color: var(--d-text-b);" class="Main_UserName">
        <span class="Main_UserNameLabel">{{ user.username }}</span>
        <span v-if="user.mod && showMod" class="Main_UserMod">mod</span>
      </div>
      <button style="font-size: 16px;" class="D_Button D_ButtonLink Main_UserLogout" @click="logout()">Logout</button>
    </div>
  </div>
</template>

<script>
import BaseAvatar from './BaseAvatar.vue'

export default {
  name: 'BaseUserCard',
  components: {
    BaseAvatar
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
            text: "Logout successful"
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