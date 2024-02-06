<template>
  <div class="BaseTopMenu_Layout">
    <a class="BaseTopMenu_Left" @click="logoClick()">
      <Logo class="BaseTopMenu_Logo" />
    </a>
    <div class="BaseTopMenu_Middle">

    </div>
    <div class="BaseTopMenu_Right"></div>
  </div>
</template>

<script>
import Logo from './Logo.vue'

export default {
  name: 'BaseTopMenu',
  components: {
    Logo
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menus: [
        {}
      ]
    }
  },
  watch: {},
  beforeMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  mounted() {},
  computed: {},
  methods: {
    handleResize() {
      let wBody = document.documentElement.offsetWidth;
      document.documentElement.style.setProperty('--wBody', `${wBody}px`);
      let hBody = document.documentElement.offsetHeight;
      document.documentElement.style.setProperty('--hBody', `${hBody}px`);
    },
    logoClick() {
      if (this.$route.name !== 'Records') {
        this.$router.push({ name: 'Records' })
      }
    }
  },
}
</script>

<style>
.BaseTopMenu_Layout {
  height: var(--top-menu);
  width: var(--wBody);
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  /* background: linear-gradient(90deg, rgba(54,171,0,1) 0%, rgba(91,29,0,1) 100%); */
  position: sticky;
  left: 0;
  /* top: 0; */
  z-index: 1;
  display: flex;
}
.BaseTopMenu_Left {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.BaseTopMenu_Logo {
  height: 21px;
  margin-left: 8px;
}
</style>