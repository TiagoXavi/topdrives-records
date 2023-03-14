<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    @touchstart="touchstart($event)"
    @touchend="touchend($event)">
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
      timerEnd: 0,
      element: null
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
    touchend(e) {
      console.log(e.cancelable);
      this.timerEnd = performance.now();
      if (this.timerEnd - this.timerStart > 800 && e.cancelable) {
        this.$emit('longTouch');
      }
    }
  },
}
</script>

<style>
</style>