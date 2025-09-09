<template>
  <div class="Main_SaveGalleryBoxCheck">
    <div class="Main_SaveGalleryCheckLeft">
      <BaseCheckBox :value="value" @change="$emit('change', $event); updateAdvancedConfig();" />
    </div>
    <div class="Main_SaveGalleryCheckRight">
      <div class="Main_OptionsLabel">{{ label }}</div>
    </div>
  </div>
</template>

<script>
import BaseCheckBox from './BaseCheckBox.vue'

export default {
  name: 'BaseConfigCheckBox',
  components: {
    BaseCheckBox
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, Date, Function, Symbol],
      default: null
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ""
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {
    let value = window.localStorage.getItem(this.name);
    if (value) {
      value = JSON.parse(value);
      this.$emit('change', value);
    }
  },
  mounted() {},
  computed: {},
  methods: {
    updateAdvancedConfig() {
      let vm = this;
      setTimeout(() => {
        window.localStorage.setItem(vm.name, vm.value);
      }, 10);
    }
  },
}
</script>

<style>
</style>