<template>
  <div class="BaseSwitch_Layout" :class="{ BaseSwitch_Horizontal: horizontal }">
    <label class="BaseSwitch_Box">
      <input
        v-if="showFix"
        :checked="value"
        :disabled="disabled"
        type="checkbox"
        class="BaseSwitch_Input"
        @input="$emit('change', $event.target.checked); runFix();"
        @click="$emit('click', $event)">
      <span class="BaseSwitch_Slider round"></span>
    </label>
    <span v-if="label" class="BaseSwitch_Label">{{ label }}</span>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseSwitch',
  components: {
    // BaseDetalheHeader
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    horizontal: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      showFix: true
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    runFix() {
      this.showFix = false;
      this.$nextTick().then(() => {
        this.showFix = true;
      });
    }
  },
}
</script>

<style>
.BaseSwitch_Layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.BaseSwitch_Horizontal {
  flex-direction: row;
  gap: 5px;
}
.BaseSwitch_Box {
  position: relative;
  display: inline-block;
  --width: 42px;
  width: var(--width);
  --height: 24px;
  height: var(--height);
}
.BaseSwitch_Input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.BaseSwitch_Slider {
  position: relative;
  cursor: pointer;
  background-color: #666;
  transition: 0.2s;
  border-radius: 34px;
  display: flex;
  width: 100%;
  height: 100%;
}

.BaseSwitch_Slider:before {
  position: absolute;
  content: "";
  height: calc(var(--height) - 4px);
  width: calc(var(--height) - 4px);
  left: 2px;
  bottom: 2px;
  background-color: hsl(var(--back-h), var(--back-s), 20%);
  transition: 0.2s;
  border-radius: 50%;
}
.BaseSwitch_Label {
  font-size: 14px;
}

.BaseSwitch_Input:checked + .BaseSwitch_Slider {
  background-color: #5fb500;
}

.BaseSwitch_Input:focus + .BaseSwitch_Slider {
  box-shadow: 0 0 0 2px #5fb500;
}

.BaseSwitch_Input:checked + .BaseSwitch_Slider:before {
  transform: translateX(calc(var(--width) - var(--height)));
  background-color: #396d00;
}
</style>