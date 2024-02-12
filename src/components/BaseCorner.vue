<template>
  <div class="Cg_Corner">
    <div class="Main_Logo">
      <div class="Main_LogoPre">Top Drives</div>
      <Logo />
    </div>
    <div class="Main_CornerMid">
      <div class="Main_CornerMidBox">
        <BaseButtonTouch
          class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu Main_CornerMenu"
          @click="$emit('menu')"
          @longTouch="$emit('longMenu')">
          <i class="ticon-3menu Main_MenuIcon" aria-hidden="true"/>
        </BaseButtonTouch>
        <BaseButtonTouch
          class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu"
          @click="$emit('camera')"
          @longTouch="$emit('longCamera')">
          <i class="ticon-camera1 Main_MenuIcon" aria-hidden="true"/>
        </BaseButtonTouch>
      </div>
      <div class="Main_CornerMidBox">
        <slot name="more" />
      </div>
    </div>
    <div class="Main_GamePrintInfo">
      <div class="Main_GameVersionText">{{ gameVersion }}</div>
      <div class="Main_GameVersionText">{{ new Date().toISOString().slice(0,10) }}</div>
    </div>
    <slot name="by" />
  </div>
</template>

<script>
import Logo from './Logo.vue'
import BaseButtonTouch from './BaseButtonTouch.vue'

export default {
  name: 'BaseCorner',
  components: {
    Logo,
    BaseButtonTouch
  },
  props: {
    test: {
      type: Boolean,
      default: false
    },
    gameVersion: {
      type: String,
      default: "Game v?"
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