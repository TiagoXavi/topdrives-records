<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    @touchstart="touchstart($event)"
    @touchend="touchend()">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButtonTouch',
  components: {},
  props: {},
  data() {
    return {
      timer: null,
      touchduration: 800,
      timerStart: 0,
      timerEnd: 0
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    touchstart(e) {
      this.timerStart = performance.now();
    },
    touchend() {
      this.timerEnd = performance.now();
      if (this.timerEnd - this.timerStart > 800) {
        this.$emit('longTouch');
      }
    }
  },
}
</script>

<style>
</style>