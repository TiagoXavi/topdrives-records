<template>
  <div class="BaseMenuFooter_Layout">
    
    <div class="Main_OptionsCredits">
      <div class="D_Center Main_OptionsFooterButtons">
        
        <button
          v-if="mode === 'classic'"
          class="D_Button Main_OptionsButton"
          @click="$emit('librarySearchDialog')">
          <i class="ticon-dash D_ButtonIcon" style="font-size: 22px;" aria-hidden="true"/>
          <span>{{ $t("m_library") }}</span>
        </button>
        <button
          v-if="mode === 'classic'"
          class="D_Button Main_OptionsButton"
          @click="$emit('openKingOfDialog')">
          <i class="ticon-star D_ButtonIcon" style="font-size: 22px;" aria-hidden="true"/>
          <span>{{ $t("m_bestOf") }}</span>
        </button>
        <button
          class="D_Button Main_OptionsButton"
          @click="$router.push({ name: 'MainCharts' })">
          <i class="ticon-chart D_ButtonIcon" style="font-size: 22px;" aria-hidden="true"/>
          <span>{{ $t("m_charts") }}</span>
        </button>
        <button
          class="D_Button Main_OptionsButton"
          @click="$emit('openAdvancedOptions')">
          <i class="ticon-gear D_ButtonIcon" style="font-size: 22px;" aria-hidden="true"/>
          <span>{{ $t("m_options") }}</span>
        </button>
      </div>
      <div class="D_Center Main_OptionsFooterButtons">
        <button
          class="D_Button Main_OptionsButton"
          @click="$router.push({ name: 'Gallery' })">
          <span>{{ $t("m_vChanges", { version: '18.0' }) }}</span>
        </button>
        <BaseDiscordButton />
        <BaseDonateButton />
        


        
      </div>
    </div>
    <div class="BaseMenuFooter_FooterBox">
      <div v-if="user" class="Main_OptionsItem Main_OptionsUserBox" style="display: flex;justify-content: center;">
        <BaseUserCard :user="user"/>
      </div>
      <div v-else class="Main_OptionsItem Main_OptionsLogout">
        <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2 Main_OptionsButton" @click="$router.push({ name: 'Login' })">{{ $t("m_login") }}</button>
        <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2 Main_OptionsButton" @click="$router.push({ name: 'Register' })">{{ $t("m_register") }}</button>
      </div>
      <div class="BaseMenuFooter_FooterRight Main_OptionsFooterButtons">
        <BaseLanguageButton />
        <button
          class="D_Button Main_OptionsButton"
          @click="$emit('openAbout')">
          <span>{{ $t("m_about") }}</span>
          <svg class="Main_FavLogo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.7 59.8" style="enable-background:new 0 0 54.7 59.8" xml:space="preserve">
            <path fill="#FFC717" d="m54.7 55.9-.5 1.3c-1 .8-2.3 1.4-4.1 1.9s-3.4.7-5 .7c-3.9 0-7-.8-9.4-2.3-2.3-1.5-4.5-4-6.6-7.6-.1-.1-.2-.2-.3-.5s-.8-1.5-2.1-3.8-2.5-4.2-3.8-5.5c-1.3-1.4-2.5-2-3.7-2h-1.4v20.6H0V0h27.8c7.6 0 13.4 1.7 17.6 5.2 4.1 3.5 6.2 8.3 6.2 14.4 0 1.7-.3 3.7-1 5.8s-1.9 4.1-3.6 5.9c-1.7 1.8-3.8 3.3-6.2 4.4.8.8 1.7 2 2.7 3.6 1.2 2 2.2 3.3 2.8 3.8.7.5 1.4.8 2.2.8.5 0 1.2-.2 2.2-.6l1.1.6 2.9 12zM27.1 26.4c1.7 0 3.2-.5 4.4-1.5 1.2-1 1.8-2.4 1.8-4.2 0-1.9-.6-3.4-1.8-4.5-1.2-1.1-2.7-1.7-4.4-1.7h-9.2v11.9h9.2z"/>
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import BaseDonateButton from './BaseDonateButton.vue'
import BaseDiscordButton from './BaseDiscordButton.vue'
import BaseUserCard from './BaseUserCard.vue'
import BaseLanguageButton from './BaseLanguageButton.vue'

export default {
  name: 'BaseMenuFooter',
  components: {
    BaseDonateButton,
    BaseDiscordButton,
    BaseUserCard,
    BaseLanguageButton
  },
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    },
    mode: {
      type: String,
      default: "none"
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
.BaseMenuFooter_Layout {
  display: contents;
}
.BaseMenuFooter_FooterBox {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 15px;
  flex-wrap: wrap;
  gap: 10px;
}
</style>