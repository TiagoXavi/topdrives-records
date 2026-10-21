<template>
  <div class="BaseDualSlider_Layout">
    <div :style="`
        --posL: ${pctL}%;
        --posR: ${100 - pctR}%;
        --fillL: ${pctR}%;
        --fillR: ${100 - pctL}%;
      `"
      :class="{
        BaseDualSlider_Tight: pctR - pctL < 50,
        BaseDualSlider_MoreLeft: pctL > 100 - pctR
      }"
      class="BaseDualSlider_InputBox">
      <!-- <div class="BaseDualSlider_Track BaseDualSlider_TrackUnder"></div> -->
      <div style="left: var(--posL); right: var(--posR);" class="BaseDualSlider_Fill BaseDualSlider_TrackUnder">
        <div
          v-if="label"
          class="BaseDualSlider_FillLabel">{{ label }}</div>
      </div>
      <!-- <input
        v-model="internal0"
        class="BaseDualSlider_Input BaseDualSlider_Min"
        type="range"
        :class="{ BaseDualSlider_InputAbove: elementAbove === 0 }"
        :style="`width: calc( var(--fillL) + 30px;`"
        :min="min"
        :max="internal1"
        :step="step"
        @mousedown="checkMouseDown($event)"
        @change="changed" /> -->
      <input
        v-model="pos1"
        class="BaseDualSlider_Input BaseDualSlider_Max"
        type="range"
        :class="{ BaseDualSlider_InputAbove: elementAbove === 1 }"
        :style="`width: calc( var(--fillR) + 30px;`"
        :min="posMin"
        :max="posMax"
        :step="posStep"
        @change="changed" />
      <div class="BaseDualSlider_Track BaseDualSlider_TrackUpper BaseMonoSlider_Track"></div>
      <div style="left: var(--posL); right: var(--posR);" class="BaseDualSlider_Fill BaseDualSlider_TrackUpper">
        <div
          v-if="label"
          class="BaseDualSlider_FillLabel">{{ label }}</div>
      </div>
      <!-- <div class="BaseDualSlider_LabelL">{{ internal0 }}</div> -->
      <div class="BaseDualSlider_LabelR">{{ internal1 }}</div>
    </div>
  </div>
</template>

<script>
import BaseDualSlider from "./BaseDualSlider.vue"; // CSS
import { SLIDER_POSITIONS, sliderValue, sliderPosition } from "@/utils/sliderScale.js";

export default {
  name: 'BaseMonoSlider',
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: null
    },
    logarithm: {
      type: Boolean,
      default: false
    },
    // logarithm: "start" gives more room to the low values, "end" to the high ones
    logSmooth: {
      type: String,
      default: "start"
    },
    // logarithm: how strong, 0 is linear
    logPower: {
      type: Number,
      default: 3
    },
    name: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      elementAbove: 1,
      internal1: 0
    }
  },
  watch: {
    // input0(newValue) {
      // if (this.value[0] !== this.internal0) this.internal0 = this.value[0];
    value(novoValor) {
      if (this.value !== this.internal1) this.internal1 = this.value;
    }
  },
  beforeMount() {
    this.internal1 = this.value;
    if (this.name) {
      let value = window.localStorage.getItem(this.name);
      if (value) {
        value = JSON.parse(value);
        this.$emit('change', Number(value));
      }
    }
  }, 
  mounted() {},
  computed: {
    internal0() {
      return this.min;
    },
    scale() {
      return { min: this.min, max: this.max, step: this.step, smooth: this.logSmooth, power: this.logPower };
    },
    // the range input moves in values, or in positions of the logarithmic scale
    posMin() {
      return this.logarithm ? 0 : this.min;
    },
    posMax() {
      return this.logarithm ? SLIDER_POSITIONS : this.max;
    },
    posStep() {
      return this.logarithm ? 1 : this.step;
    },
    pos1: {
      get() {
        return this.logarithm ? Math.round(sliderPosition(this.internal1, this.scale)) : this.internal1;
      },
      set(pos) {
        this.internal1 = this.logarithm ? sliderValue(Number(pos), this.scale) : pos;
      }
    },
    // where each end is, 0 to 100
    pctL() {
      return this.fraction(this.internal0) * 100;
    },
    pctR() {
      return this.fraction(this.internal1) * 100;
    },
    // input0: {
    //   get: function() {
    //     return this.value[0];
    //   },
    //   set: function(novoValor) {
    //     // console.log(novoValor);
    //     this.elementAbove = 0;
    //     this.$emit("change", [Number(novoValor), this.input1])
    //   }
    // },
    // input1: {
    //   get: function() {
    //     return this.value;
    //   },
    //   set: function(novoValor) {
    //     this.elementAbove = 1;
    //     this.$emit("change", Number(novoValor))
    //   }
    // },
  },
  methods: {
    // 0 to 1 along the slider
    fraction(value) {
      if (this.logarithm) return sliderPosition(Number(value), this.scale) / SLIDER_POSITIONS;
      return (value - this.min) / (this.max - this.min);
    },
    update(index, e) {
      console.log(index, e.target.value);
    },
    checkMouseDown(e) {
      if (e.ctrlKey || e.metaKey) {
        this.$emit("ctrlClick");
      }
    },
    changed(e, b) {
      this.$emit("change", Number(this.internal1));
      if (this.name) {
        let vm = this;
        setTimeout(() => {
          window.localStorage.setItem(vm.name, vm.internal1);
        }, 10);
      }
    }
  },
}
</script>

<style>
.BaseMonoSlider_Track {
  width: 100%;
  margin-left: 0;
}
</style>