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
    }"
    :style="`--dialog-index: ${zindex}`"
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
  transition-duration: 0.1s;
  opacity: 0;
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
  opacity: 0;
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
}
.BaseDialog_ForceScroll {
  overflow-y: scroll;
}
.BaseDialog_ForceNoScroll {
  overflow-y: initial;
}
.BaseDialog_Opaque {
  background-color: #333;
  /* box-shadow: 0px 10px 10px 0px #0005; */
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
</style>