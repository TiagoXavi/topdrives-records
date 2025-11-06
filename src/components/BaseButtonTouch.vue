<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    @touchstart="touchstart($event)"
    @touchend="touchend($event)"
    @touchmove="touchmove($event)">
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
      element: null,
      tm: null
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    touchstart(e) {
      this.timerStart = performance.now();
      this.tm = setTimeout(() => {
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        this.$emit('longTouch', e);
      }, 600);
    },
    touchend(e) {
      clearTimeout(this.tm);


      this.timerEnd = performance.now();
      if (this.timerEnd - this.timerStart < 400 && e.cancelable) {
        this.$emit('shortTouch', e);
      }
    },
    touchmove(e) {
      clearTimeout(this.tm);
    }
  },
}
</script>

<style>
</style>