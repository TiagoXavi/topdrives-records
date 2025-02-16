<template>
  <div class="BaseTooltip_Layout">
    <div
      :class="{
        BaseTooltip_Bottom: tooltip.bottom,
        BaseTooltip_Active: active,
        BaseTooltip_RealActive: realActive,
        BaseTooltip_PreActive: preActive,
        BaseTooltip_AnimIn: animIntro,
        BaseTooltip_AnimOut: animOut,
        [tooltip.contentClass]: true
      }"
      :style="`
        --positionx: ${tooltip.positionX}px;
        --positiony: ${tooltip.positionY}px;
      `"
      class="BaseTooltip_Box">
      <div v-if="tooltip.body" v-html="tooltip.body" />
      <template v-else>
        <span class="BaseTooltip_Message">{{ tooltip.mensagem }}</span>
      </template>
    </div>
  </div>
</template>


<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseTooltip',
  components: {
    // BaseDetalheHeader
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      realActive: false,
      preActive: false,
      animIntro: false,
      animOut: false,
      tm1: null,
      tm2: null
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
        clearTimeout(this.tm1);
        this.animOut = false;
        this.preActive = true;
        setTimeout(() => {
          this.realActive = true;
          this.animIntro = true;
        }, 5);
        this.tm1 = setTimeout(() => {
          // this.animIntro = false;
        }, 99);
      } else {
        clearTimeout(this.tm1);
        this.animOut = true;
        this.animIntro = false;
        this.tm1 = setTimeout(() => {
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
.BaseTooltip_Layout {
  display: contents;
}
.BaseTooltip_Box {
  position: absolute;
  top: var(--positiony);
  left: var(--positionx);
  background-color: #232323;
  border-radius: 8px;
  padding: 15px;
  pointer-events: none;
  z-index: 1000;
  display: none;
  transition-duration: 0.1s;
  opacity: 0;
  transform: translateX(-50%);
  font-size: 16px;
}
.BaseTooltip_PreActive {
  display: block;
}
.BaseTooltip_RealActive {
  display: block;
  
}
.BaseTooltip_AnimIn {
  opacity: 1;
}
.BaseTooltip_AnimOut {
  opacity: 0;
}
</style>