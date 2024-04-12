<template>
  <div
    v-if="preActive"
    :class="{
      BaseExpandDiv_Active: active,
      BaseExpandDiv_RealActive: realActive,
      BaseExpandDiv_AnimIn: animIntro,
      BaseExpandDiv_AnimOut: animOut,
      BaseExpandDiv_Absolute: absolute
    }"
    :id="id"
    :style="`--toHeight: ${toHeight}`"
    class="BaseExpandDiv_Layout">
      <slot/>
    </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';
let uid = 0;

export default {
  name: 'BaseExpandDiv',
  components: {
    // BaseDetalheHeader
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
  },
  data() {
    uid += 1;
    return {
      id: `p-${uid}`,
      realActive: false,
      preActive: false,
      animIntro: false,
      animOut: false,
      absolute: false,
      toHeight: 'unset',
      revertHeight: null,
      memoryHeight: '',
      introTimeout: null,
      finishTimeout: null
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
        clearTimeout(this.introTimeout);
        clearTimeout(this.finishTimeout);
        this.preActive = true;
        this.animIntro = true;
        this.absolute = true;
        this.$nextTick().then(() => {
          this.realActive = true;
          this.memoryHeight = `${document.querySelector(`#${this.id}`).offsetHeight}px`;
          if (!this.revertHeight) this.revertHeight = this.memoryHeight;
          // console.log(document.querySelector(`#${this.id}`));
          console.log(this.memoryHeight);
          // debugger;
          this.toHeight = "0px";
        })
        setTimeout(() => {
          if (this.revertHeight) {
            this.toHeight = this.revertHeight;
          } else {
            this.toHeight = this.memoryHeight;
          }
          this.absolute = false;
        }, 5);
        this.introTimeout = setTimeout(() => {
          this.animIntro = false;
          this.revertHeight = null;
        }, 299);
      } else {
        this.animOut = true;
        if (this.revertHeight) {
          this.toHeight = this.revertHeight;
        } else {
          this.toHeight = `${document.querySelector(`#${this.id}`).offsetHeight}px`;
          this.revertHeight = this.toHeight;
        }
        setTimeout(() => {
          this.toHeight = "0px";
        }, 5);
        this.finishTimeout = setTimeout(() => {
          this.animOut = false;
          this.preActive = false;
          this.realActive = false;
          setTimeout(() => {
            this.revertHeight = null;
            this.toHeight = 'unset';
          }, 5);
        }, 299);

      }
    }
  },
}
</script>

<style>
.BaseExpandDiv_Layout {
  transition-duration: 0.3s;
  /* opacity: 0; */
  /* transform: scaleY(0); */
  top: 0;
  left: 0;
}
.BaseExpandDiv_PreActive {
  
}
.BaseExpandDiv_RealActive {
  display: block;
  z-index: var(--dialog-index);
  /* opacity: 1; */
  /* transform: scaleY(1); */
}
.BaseExpandDiv_AnimOut {
  /* opacity: 0; */
  /* transform: scaleY(0); */
}
.BaseExpandDiv_Layout.BaseExpandDiv_AnimIn,
.BaseExpandDiv_Layout.BaseExpandDiv_AnimOut {
  overflow: hidden;
  height: var(--toHeight);
}
.BaseExpandDiv_Active {
  z-index: var(--dialog-index);
  pointer-events: initial;
}
.BaseExpandDiv_Absolute {
  position: absolute;
  visibility: hidden;
}
</style>