<template>
  <a
    :href="link"
    class="D_Button Main_OptionsButton"
    target="_blank"
    rel="noopener noreferrer">
    <BaseIconSvg type="discord" :useMargin="false" style="width: 25px; margin: -5px 6px -5px 0;" />
    <span>Discord</span>
  </a>
</template>

<script>
import BaseIconSvg from "@/components/BaseIconSvg.vue"

export default {
  name: 'BaseDiscordButton',
  components: {
    BaseIconSvg
  },
  props: {
    link: {
      type: String,
      default: "https://discord.gg/gWZ8v9Xf43"
    }
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
</style>