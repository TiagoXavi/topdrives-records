<template>
  <div class="BaseDualSlider_Layout">
    <div :style="`
        --posL: ${(input0 - min) * 100 / ((max - min) * 1.0 ) + 0 }%;
        --posR: ${(input1 - max) * -100 / ((max - min) * 1.0 ) + 0 }%;
        --cWidth: ${(input1 - input0) * 100 / ((max - min))};
        --cWidthR: ${(input1 - min) * 100 / ((max - min))};
        --cWidthL: ${(input0 - max) * -100 / ((max - min))};
        --percL: ${(input1 - input0) * -100 / (input1 - min) + 50};
        --percR: ${(input0 - input1) * 100 / (input0 - max) - 50};
        --fillL: ${(input1 - min) * 100 / ((max - min))}%;
        --fillR: ${(input0 - max) * -100 / ((max - min))}%;
      `"
      :class="{
        BaseDualSlider_VeryTight: (input1 - input0) * 100 / ((max - min)) < 10,
        BaseDualSlider_Tight: (input1 - input0) * 100 / ((max - min)) < 50,
        BaseDualSlider_MoreLeft: (input0 - min) * 100 / ((max - min)) > (input1 - max) * -100 / ((max - min))
      }"
      class="BaseDualSlider_InputBox">
      <input
        v-model="input0"
        class="BaseDualSlider_Input BaseDualSlider_Min"
        type="range"
        :class="{ BaseDualSlider_InputAbove: elementAbove === 0 }"
        :style="`width: calc( var(--fillL) + 30px;`"
        :min="min"
        :max="input1"
        :step="step"
        @mousedown="checkMouseDown($event)" />
      <input
        v-model="input1"
        class="BaseDualSlider_Input BaseDualSlider_Max"
        type="range"
        :class="{ BaseDualSlider_InputAbove: elementAbove === 1 }"
        :style="`width: calc( var(--fillR) + 30px;`"
        :min="input0"
        :max="max"
        :step="step" />
      <div class="BaseDualSlider_Track"></div>
      <div style="left: var(--posL); right: var(--posR);" class="BaseDualSlider_Fill">
        <div
          v-if="label"
          class="BaseDualSlider_FillLabel">{{ label }}</div>
      </div>
      <div class="BaseDualSlider_LabelL">{{ value[0] }}</div>
      <div class="BaseDualSlider_LabelR">{{ value[1] }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseDualSlider',
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
    }
  },
  data() {
    return {
      elementAbove: 1
    }
  },
  watch: {
    // input0(newValue) {
    //   this.$emit("change", [this.input0, this.input1])
    // },
    // input1(newValue) {
    //   this.$emit("change", [this.input0, this.input1])
    // },
  },
  beforeMount() {}, 
  mounted() {},
  computed: {
    input0: {
      get: function() {
        return this.value[0];
      },
      set: function(novoValor) {
        // console.log(novoValor);
        this.elementAbove = 0;
        this.$emit("change", [Number(novoValor), this.input1])
      }
    },
    input1: {
      get: function() {
        return this.value[1];
      },
      set: function(novoValor) {
        this.elementAbove = 1;
        this.$emit("change", [this.input0, Number(novoValor)])
      }
    },
  },
  methods: {
    update(index, e) {
      console.log(index, e.target.value);
    },
    checkMouseDown(e) {
      if (e.ctrlKey || e.metaKey) {
        this.$emit("ctrlClick");
      }
    }
  },
}
</script>

<style>
.BaseDualSlider_InputBox {
  position: relative;
  height: 12px;
  width: calc(100% - 30px);
  margin-left: 15px;
  margin-top: 32px;
  margin-bottom: 12px;
}
.BaseDualSlider_Fill {
  position: absolute;
  height: 100%;
  --fill: rgba(205, 155, 0, 1);
  background-color: var(--fill);
  pointer-events: none;
  transition-duration: 0.2s;
  transition-property: box-shadow;
}
.BaseDualSlider_Track {
  position: absolute;
  height: 100%;
  width: calc(100% + 16px);
  margin-left: -10px;
  left: 2px;
  --fill: #fff1;
  background-color: var(--fill);
  border-radius: 15px;
  pointer-events: none;
  transition-duration: 0.2s;
  transition-property: box-shadow;
  background-size: 200% 100%;
}
.BaseDualSlider_Input {
  -webkit-appearance: none;
  width: 100%;
  position: absolute;
  /* background-color: var(--d-back); */
  top: 0px;
  height: 100%;
  background-color: transparent;
  /* opacity: 0; */
  box-sizing: border-box;
  --shaB: #e7a62f;
}
.BaseDualSlider_Min {
  left: -15px;
  --shaD: 10px;
}
.BaseDualSlider_Max {
  right: -15px;
  --shaD: -10px;
}
.BaseDualSlider_InputAbove {
  z-index: 2;
}
.BaseDualSlider_Input:focus {
  outline: none;
}
.BaseDualSlider_Input:focus::-webkit-slider-runnable-track {
  /* background: #2497e3; */
}
.BaseDualSlider_Input::-webkit-slider-runnable-track {
  cursor: pointer;
}
.BaseDualSlider_Input::-webkit-slider-thumb {
  z-index: 4;
  position: relative;
  box-shadow: 0px 0px 0px 0px var(--shaB), var(--shaD) 0px 4px -8px #a96000, inset 0px 0px 0px 2px #ffc633;
  height: 30px;
  width: 30px;
  border-radius: 25px;
  background: var(--shaB);
  cursor: pointer;
  -webkit-appearance: none;
  transition-duration: 0.2s;
}
.BaseDualSlider_InputAbove::-webkit-slider-thumb {
  z-index: 5;
}
.BaseDualSlider_Input:hover::-webkit-slider-thumb,
.BaseDualSlider_Input.focus-visible::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px 2px #ffc633, var(--shaD) 0px 4px -8px #a96000, inset 0px 0px 0px 0px #ffc633;
}
.BaseDualSlider_Input:active::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px 4px #ffc633, var(--shaD) 0px 4px -8px #a96000, inset 0px 0px 0px 0px #ffc633;
}
.BaseDualSlider_Input:hover ~ .BaseDualSlider_Fill,
.BaseDualSlider_Input:hover ~ .BaseDualSlider_Track,
.BaseDualSlider_Input.focus-visible ~ .BaseDualSlider_Fill,
.BaseDualSlider_Input.focus-visible ~ .BaseDualSlider_Track {
  box-shadow: 0px 0px 0px 2px var(--fill);
}
.BaseDualSlider_Input:active ~ .BaseDualSlider_Track {
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 20px,
    rgba(255, 255, 255, 0.05) 0,
    rgba(255, 255, 255, 0.05) 40px
  );
  animation: shaA 2s linear infinite;
}
@keyframes shaA {
  0% {
    background-position-x: 0px;
  }
  100% {
    background-position-x: -57px;
  }
}
.BaseDualSlider_LabelL,
.BaseDualSlider_LabelR {
  position: absolute;
  top: -35px;
  transition-duration: 0.2s;
  transition-property: transform;
}
.BaseDualSlider_LabelL {
  transform: translateX(-50%);
  /* left: calc( var(--posL) + (var(--percL) / 25) * -1% - 2% ); */
  left: calc( var(--posL) );
}
.BaseDualSlider_LabelR {
  transform: translateX(50%);
  /* right: calc( var(--posR) + (var(--percR) / 25) * 1% - 2% ); */
  right: calc( var(--posR) );
}
.BaseDualSlider_FillLabel {
  text-align: center;
  position: absolute;
  top: -7px;
  background-color: rgba(44, 37, 16, 1);
  color: rgb(var(--d-text-yellow));
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 10px;
  border-radius: 10px;
  white-space: nowrap;
  transition-duration: 0.2s;
}
.BaseDualSlider_Tight .BaseDualSlider_FillLabel {
  transform: none;
  left: calc(100% + 20px);
}
.BaseDualSlider_MoreLeft.BaseDualSlider_Tight .BaseDualSlider_FillLabel {
  left: -20px;
  max-width: max-content;
  transform: translateX(-100%);
}
.BaseDualSlider_VeryTight.BaseDualSlider_MoreLeft .BaseDualSlider_LabelL {
  left: unset;
  right: calc( var(--fillR) + 28px);
  transform: unset;
}
.BaseDualSlider_VeryTight:not(.BaseDualSlider_MoreLeft) .BaseDualSlider_LabelR {
  right: unset;
  left: calc( var(--fillL) + 28px);
  transform: unset;
}
</style>