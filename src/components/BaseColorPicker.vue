<template>
  <div class="BaseColorPicker_Layout">
    <label>
      <input
        type="color"
        :value="value"
        @input="onInput"
        aria-label="color picker"
      />
      <!-- <span>{{ value }}</span> -->
    </label>
  </div>
</template>

<script>

export default {
  name: 'BaseColorPicker',
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: '#000000'
    },
  },
  data() {
    return {
      internalValue: null,
      debounceAction: null
    }
  },
  watch: {},
  beforeMount() {
    this.debounceAction = Vue.debounce(this.emitChange, 300);
  },
  mounted() {},
  computed: {},
  methods: {
    onInput(e) {
      this.internalValue = e.target.value;
      this.debounceAction();
    },
    emitChange() {
      this.$emit('change', this.internalValue);
    }
  }
}
</script>

<style>
.BaseColorPicker_Layout {
  display: inline-flex;
  align-items: center;
}
</style>