<template>
  <div
    v-if="!lazy || active"
    :class="{
      BaseDialog_Active: active,
      BaseDialog_RealActive: realActive,
      BaseDialog_PreActive: preActive,
      BaseDialog_AnimIn: animIntro,
      BaseDialog_AnimOut: animOut,
      BaseDialog_Fixed: fixed,
      BaseDialog_UseColor: useColor
    }"
    :style="`--dialog-index: ${zindex}; --dialog-width: ${maxWidth};`"
    class="BaseDialog_Layout">
    <div v-if="!fixed" class="BaseDialog_Back" @click="$emit('close')"></div>
    <div class="BaseDialog_Body" :class="{ BaseDialog_Body_Static: isStatic, BaseDialog_Body_Fixed: fixed }">
      <div
        :style="{
          maxWidth: maxWidth,
          minWidth: minWidth,
        }"
        :class="{
          BaseDialog_Opaque: !transparent,
          BaseDialog_Transparent: transparent,
          BaseDialog_ForceScroll: forceScroll,
          BaseDialog_ForceNoScroll: disableScroll,
          BaseDialog_Grow: grow,
          BaseDialog_Contents: displayContents
        }"
        class="BaseDialog_Box Main_DarkScroll">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseDialog',
  components: {},
  props: {
    active: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: '80vw'
    },
    minWidth: {
      type: String,
      default: '240px'
    },
    zindex: {
      type: String,
      default: '100'
    },
    transparent: {
      type: Boolean,
      default: false
    },
    isStatic: {
      type: Boolean,
      default: false
    },
    forceScroll: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    disableScroll: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    grow: {
      type: Boolean,
      default: false
    },
    displayContents: {
      type: Boolean,
      default: false
    },
    useColor: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      realActive: false,
      preActive: false,
      animIntro: false,
      animOut: false,
    }
  },
  watch: {
    active(newValue) {
      this.set(newValue);
    }
  },
  beforeMount() {
    if (this.active) {
      this.set(true);
    }
  },
  mounted() {},
  computed: {},
  methods: {
    set(newValue) {
      if (newValue === true) {
        this.preActive = true;
        this.animIntro = true;
        setTimeout(() => {
          this.realActive = true;
        }, 0);
        setTimeout(() => {
          this.animIntro = false;
        }, 99);
      } else {
        this.animOut = true;
        setTimeout(() => {
          this.animOut = false;
          this.preActive = false;
          this.realActive = false;
          this.$emit('out');
        }, 99);
      }
    }
  },
}
</script>

<style>
.BaseDialog_Layout {
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  display: none;
  /* transition-duration: 0.1s; */
  /* opacity: 0; */
  top: 0;
  left: 0;
}
.BaseDialog_PreActive {
  display: block;
}
.BaseDialog_RealActive {
  display: block;
  z-index: var(--dialog-index);
  opacity: 1;
}
.BaseDialog_AnimOut {
  /* opacity: 0; */
}
.BaseDialog_Active {
  z-index: var(--dialog-index);
  pointer-events: initial;
}
.BaseDialog_Fixed {
  pointer-events: none;
}
.BaseDialog_Back {
  background-color: #0007;
  position: absolute;
  width: 100%;
  height: 100%;
  transition-duration: 0.1s;
  backdrop-filter: blur(1.7px);
  opacity: 0;
}
/* .BaseDialog_RealActive .BaseDialog_Back {
  background-color: #000f;
}
.BaseDialog_AnimOut .BaseDialog_Back {
  background-color: transparent;
} */
.BaseDialog_Body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  pointer-events: none;
  transition-duration: 0.1s;
  opacity: 0;
}
.BaseDialog_RealActive .BaseDialog_Body,
.BaseDialog_RealActive .BaseDialog_Back {
  opacity: 1;
}
.BaseDialog_AnimOut .BaseDialog_Body,
.BaseDialog_AnimOut .BaseDialog_Back {
  opacity: 0;
}
.BaseDialog_Body_Fixed {
  align-items: flex-end;
  justify-content: flex-end;
}
.BaseDialog_Body_Static {
  align-items: start;
  margin-top: 38px;
}
.BaseDialog_Box {
  padding: 20px;
  pointer-events: auto;
  border-radius: 10px;
  width: 100%;
  user-select: text;
  margin: 10px 10px 40px 10px;
  /* max-height: 80vh; */
  max-height: calc(80vh - 40px);
  overflow-y: auto;
  overscroll-behavior: contain;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0, 0.7, 0.35, 1);
}
.BaseDialog_ForceScroll {
  overflow-y: scroll;
}
.BaseDialog_ForceNoScroll {
  overflow-y: initial;
}
.BaseDialog_Opaque {
  /* background-color: #333; */
  background-color: var(--d-back-dialog);
  backdrop-filter: blur(25px);
}
.BaseDialog_Opaque:has(.BaseDialog_Opaque) {
  backdrop-filter: unset;
}
.BaseDialog_Fixed .BaseDialog_Box {
  background-color: #2a2a2a;
  margin-bottom: 10px;
}
.BaseDialog_Transparent {
  padding: 0 20px;
}
.Main_isDesktop .BaseDialog_Transparent {
  max-height: calc(90vh - 40px);
}
.Main_isDesktop .BaseDialog_Opaque {
  max-height: calc(90vh - 80px);
}
.BaseDialog_AnimOut .BaseDialog_Back {
  pointer-events: auto;
}
.Row_DisabledCell {
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 9px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 24px );
}
.BaseDialog_Grow {
  height: 100%;
}
.BaseDialog_Contents {
  display: contents;
}
.BaseDialog_UseColor .BaseDialog_Opaque {
  background-image: radial-gradient(at center left, var(--class-color) -285%, transparent 65%), radial-gradient(at center right, #4f2d2399 -145%, transparent 75%);
}
.BaseDialog_UseColor .BaseCard_EffectBackGround {
  display: none;
}
/* .BaseDialog_RacePos0 .BaseDialog_Body {
  justify-content: flex-start;
}
.BaseDialog_RacePos1 .BaseDialog_Body,
.BaseDialog_RacePos3 .BaseDialog_Body {
  justify-content: space-evenly;
} */

/* .BaseDialog_RacePos0 .BaseDialog_Body:after {
  content: "";
  display: block;
  width: 10vw;
}
.BaseDialog_RacePos1 .BaseDialog_Body:after {
  content: "";
  display: block;
  width: 10vw;
}
.BaseDialog_RacePos3 .BaseDialog_Body:before {
  content: "";
  display: block;
  width: 10vw;
}
.BaseDialog_RacePos4 .BaseDialog_Body:before {
  content: "";
  display: block;
  width: 10vw;
} */
.BaseDialog_RacePos0 .BaseDialog_Box {
  margin-right: clamp(0px, calc(var(--dialog-width)*0.5 + var(--cell-width)*3 + 50px), calc( 100vw - var(--dialog-width) - 100px ));
}
.BaseDialog_RacePos1 .BaseDialog_Box {
  margin-right: clamp(0px, calc(var(--dialog-width)*0.5 + var(--cell-width)*1 + 50px), calc( 100vw - var(--dialog-width) - 100px ));
}
.BaseDialog_RacePos3 .BaseDialog_Box {
  margin-left: clamp(0px, calc(var(--dialog-width)*0.5 + var(--cell-width)*1 + 50px), calc( 100vw - var(--dialog-width) - 100px ));
}
.BaseDialog_RacePos4 .BaseDialog_Box {
  margin-left: clamp(0px, calc(var(--dialog-width)*0.5 + var(--cell-width)*3 + 50px), calc( 100vw - var(--dialog-width) - 100px ));
}

/* .BaseDialog_RacePos4 .BaseDialog_Body {
  justify-content: flex-end;
} */


@supports not (backdrop-filter: blur(4px)) {
  .BaseDialog_Opaque {
    background-color: var(--d-back);
    backdrop-filter: unset;
  }
  .BaseDialog_Back {
    backdrop-filter: unset;
  }
}
</style>