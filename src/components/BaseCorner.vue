<template>
  <div class="Cg_Corner">
    <div class="Main_Logo">
      <div class="Main_LogoPre">Top Drives</div>
      <Logo />
    </div>
    <div class="Main_CornerMid">
      <div class="Main_CornerMidBox">
        <BaseButtonTouch
          :class="`D_Button D_ButtonMenu Main_CornerMenu ${isTabCorner ? '' : 'D_ButtonDark D_ButtonDark2'}`"
          @click="$emit('menu')"
          @longTouch="$emit('longMenu')">
          <i class="ticon-3menu Main_MenuIcon" aria-hidden="true"/>
        </BaseButtonTouch>
        <BaseButtonTouch
          :class="`D_Button D_ButtonMenu ${isTabCorner ? '' : 'D_ButtonDark D_ButtonDark2'}`"
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
    isTabCorner: {
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
.Cg_BaseCornerAsTab {
  height: auto;
  width: auto;
  flex-direction: row;
}
.Cg_TabsCorner {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
  margin-right: -3px;
  gap: 5px;
}
.Cg_BaseCornerAsTab .Main_CornerMid {
  margin: 0px;
  flex-direction: row;
  flex-grow: unset;
  gap: 0;
}
.Cg_BaseCornerAsTab .D_Button.D_ButtonMenu {
  padding: 10px 7px;
}
</style>