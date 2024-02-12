<template>
  <div
    :style="`--size: ${size}; ${ user.tier ? 'background-color: var(--t'+user.tier+');' : ''}`"
    :class="{ BaseAvatar_Mod: user && user.mod, BaseAvatar_Dark: user.tier === 1 }"
    class="BaseAvatar_Layout">
    <div class="BaseAvatar_Box">{{ letter }}</div>
  </div>
</template>

<script>

export default {
  name: 'BaseAvatar',
  components: {},
  props: {
    user: {
      type: Object,
      default() {
        return null
      }
    },
    size: {
      type: String,
      default: "36px"
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    username() {
      if (this.user && this.user.username) {
        return this.user.username;
      } else {
        return ""
      }
    },
    letter() {
      if (this.username) {
        return this.username[0].toLocaleUpperCase()
      }
      return ""
    }
  },
  methods: {},
}
</script>

<style>
.BaseAvatar_Layout {
  width: var(--size);
  height: var(--size);
  min-width: var(--size);
  min-height: var(--size);
  background-color: #1475c1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  color: white;
}
.BaseAvatar_Box {
  font-size: calc(var(--size) * 0.5);
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 700;
}
.BaseAvatar_Mod {
  background-color: #a10505;
}
.BaseAvatar_Dark {
  color: black;
}
</style>