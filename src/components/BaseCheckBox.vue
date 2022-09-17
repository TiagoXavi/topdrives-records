<template>
  <div class="BaseCheckBox_Layout">
    <label class="BaseCheckBox_Box">
      <input
        :checked="value"
        :disabled="disabled"
        type="checkbox"
        class="BaseCheckBox_Input"
        @input="$emit('change', $event.target.checked)">
      <span v-if="label" class="BaseCheckBox_Label">{{ label }}</span>
    </label>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseCheckBox',
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

:root {
  --form-control-color: white;
  --form-control-disabled: #959495;
}

.BaseCheckBox_Box {
  
}

.BaseCheckBox_Input {
  appearance: none;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 27px;
  height: 27px;
  border: 2px solid #fff3;
  border-radius: 5px;
  display: grid;
  place-content: center;
  transition-duration: 0.05s;
  outline: none;
  cursor: pointer;
}

.BaseCheckBox_Input::before {
  content: "";
  width: 20px;
  height: 20px;
  -webkit-clip-path: polygon(8% 44%, 0 51%, 46% 100%, 100% 13%, 95% 6%, 43% 72%);
  clip-path: polygon(8% 44%, 0 51%, 46% 100%, 100% 13%, 95% 6%, 43% 72%);
  transform: scale(0);
  transform-origin: center;
  transition: 0.05s transform ease-in-out;
  box-shadow: inset 1em 1em var(--form-control-color);
}

.BaseCheckBox_Input:checked {
  background-color: rgba(var(--d-text-green), 0.2);
  border: 2px solid rgb(var(--d-text-green));
}
.BaseCheckBox_Input:checked::before {
  transform: scale(1);
}

.BaseCheckBox_Input.focus-visible {
  box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow));
}

.BaseCheckBox_Input:disabled {
  --form-control-color: var(--form-control-disabled);
  color: var(--form-control-disabled);
  cursor: default;
}
.BaseCheckBox_Input:checked:disabled {
  background-color: rgba(200, 200, 200, 0.2);
  border: 2px solid rgb(100, 100, 100);
}
</style>