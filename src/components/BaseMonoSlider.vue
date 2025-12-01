<template>
  <div class="BaseDualSlider_Layout">
    <div :style="`
        --posL: ${(internal0 - min) * 100 / ((max - min) * 1.0 ) + 0 }%;
        --posR: ${(internal1 - max) * -100 / ((max - min) * 1.0 ) + 0 }%;
        --fillL: ${(internal1 - min) * 100 / ((max - min))}%;
        --fillR: ${(internal0 - max) * -100 / ((max - min))}%;
      `"
      :class="{
        BaseDualSlider_Tight: (internal1 - internal0) * 100 / ((max - min)) < 50,
        BaseDualSlider_MoreLeft: (internal0 - min) * 100 / ((max - min)) > (internal1 - max) * -100 / ((max - min))
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
        v-model="internal1"
        class="BaseDualSlider_Input BaseDualSlider_Max"
        type="range"
        :class="{ BaseDualSlider_InputAbove: elementAbove === 1 }"
        :style="`width: calc( var(--fillR) + 30px;`"
        :min="min"
        :max="max"
        :step="step"
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