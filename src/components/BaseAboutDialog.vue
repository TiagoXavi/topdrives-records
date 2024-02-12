<template>
  <BaseDialog
    :active="active"
    :transparent="false"
    max-width="460px"
    min-width="240px"
    @close="$emit('close')">
    <div style="position: relative;">
      <div class="Main_DialogTitle">{{ $t("m_about") }}</div>

      <div class="Main_Disclaimer">
        <div>{{ $t("p_about1") }}</div>
        <div>{{ $t("p_about2") }}</div>
        <div>{{ $t("p_about3") }}</div>
      </div>
      <div class="D_TextCenter Space_TopPlus"></div>

      <div style="gap: 10px;" class="D_Center Space_TopPlus">
        <BaseDiscordButton />
        <BaseDonateButton />
      </div>

      <div class="Main_AboutFlag">
        <div class="Main_AboutFlagBox">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 668.6 444.1" style="enable-background:new 0 0 668.6 444.1" xml:space="preserve">
            <!-- <path style="fill:#149e3e" d="M0 0h668.5c.1 148 .1 296 0 444.1H0V0z"/> -->
            <path style="fill:#ffde1d" d="M329.9 55c3.4.6 6.2 3.3 9.3 4.9 25.1 15.9 50.3 31.7 75.4 47.6 12.1 7.3 24 15 35.8 22.9 5.2 2.8 10.3 5.9 15.2 9.3 17.4 10.8 34.5 21.9 51.8 32.8 9.6 5.8 19 11.8 28.3 17.9 8.1 4.8 16.1 9.7 23.8 15.1 8.6 5.1 17.2 10.4 25.5 15.9.1.2.2.6.3.8-17.3 11.1-34.7 22.2-52.1 33-12.8 8.9-26.8 16.2-39.5 25.3-8.4 5.3-17.2 10.1-25.3 15.8-4.3 3.1-9.2 5.1-13.4 8.4-20.6 13-41.3 26-61.8 39.2-6.8 3.9-13.3 8-19.8 12.4-17.3 10.6-34.3 21.8-51.5 32.4-.9.7-1.8.7-2.6 0-7.4-4.1-14-9.3-21.5-13.4-4.8-3.8-10.2-6.4-15.2-9.8-36.4-22.6-72.4-45.9-108.8-68.5-6.3-3.6-12-8-18.3-11.5-9.5-6.3-19.1-12.4-28.9-18.3-8-5.3-16.1-10.4-24.4-15.3-10.7-7.5-22-13.9-33-21-3.9-3.2-8.9-4.9-12.4-8.6-.2-1.8 1.7-2.6 2.9-3.6 25.4-15.6 50.3-31.9 75.7-47.6 35.5-22.5 71.2-44.9 106.8-67.3 20.5-12.8 40.7-26.1 61.3-38.7 5.4-3.1 10.5-7.3 16.4-10.1z"/>
            <defs>
              <circle id="bra" cx="330.1" cy="222.3" r="125.3"/>
            </defs>
            <use xlink:href="#bra" style="overflow:visible;fill:#0b2675"/>
            <clipPath id="brb">
              <use xlink:href="#bra" style="overflow:visible"/>
            </clipPath>
            <g style="clip-path:url(#brb)">
              <path style="fill:#fffffe" d="m224.4 150.5.8-.1c20.7-1.5 41.6-.8 62.3 1.4 47.5 4.9 94.9 19.3 134 47.3 12.8 9 24.2 19.7 34.9 31.1l1.5 1.5c-1.4 16.4-5.9 32.5-13 47.3l.2-1c-.8 0-2.4.1-3.2.2-1.7-3.6-4.5-6.5-7.1-9.5-13.4-15.7-29.6-28.9-47.2-39.7-45.7-27.9-99.4-39.8-152.3-43.5-9.1-.1-18.1-1-27.1-.8 3.7-12.1 9.4-23.5 16.2-34.2z"/>
            </g>
          </svg>
        </div>
      </div>

    </div>
  </BaseDialog>
</template>

<script>
import BaseDonateButton from './BaseDonateButton.vue'
import BaseDiscordButton from './BaseDiscordButton.vue'
import BaseDialog from './BaseDialog.vue';

export default {
  name: 'BaseAboutDialog',
  components: {
    BaseDialog,
    BaseDonateButton,
    BaseDiscordButton
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default() {
        return null
      }
    },
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