<template>
  <div class="Main_UserCard">
    <BaseAvatar :user="user" size="46px" />
    <div class="Main_UserBlock">
      <div style="color: var(--d-text-b);" class="Main_UserName">
        <span class="Main_UserNameLabel">{{ user.username }}</span>
        <span v-if="user.mod && showMod" class="Main_UserMod">mod</span>
      </div>
      <div v-if="user.tier" :style="`color: var(--t${user.tier});`" style="" class="Main_UserName">
        <i class="ticon-crown" style="font-size: 19px; margin: 0px 2px 0px 1px;" aria-hidden="true"/>
        <span class="Main_UserDiscordLabel">Access tier {{ user.tier }}</span>
      </div>
      <div v-if="user.discordName" style="color: #99a2ff;" class="Main_UserName">
        <BaseIconSvg type="discord" :useMargin="false" style="width: 18px; margin: 0px 4px 0px 1px;" />
        <span class="Main_UserDiscordLabel">{{ user.discordName }}</span>
      </div>
      <div v-if="user.hasGarage" style="color: var(--t4);" class="Main_UserName">
        <i class="ticon-car" style="font-size: 19px; margin: 0px 2px 0px 1px;" aria-hidden="true"/>
        <span class="Main_UserDiscordLabel">{{ $t('m_garage') }}</span>
      </div>
      <!-- <button style="font-size: 16px;" class="D_Button D_ButtonLink Main_UserLogout" @click="logout()">{{ $t('m_logout') }}</button> -->
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
  methods: {},
}
</script>

<style>
</style>