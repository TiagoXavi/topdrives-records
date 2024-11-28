<template>
  <img :src="flagSrc" loading="lazy" class="BaseFlag_Flag" alt="">
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseFlag',
  components: {
    // BaseDetalheHeader
  },
  props: {
    flag: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    flagSrc() {
      let parsed;
      let flag = this.flag;

      if (flag === "EN") flag = "US";
      if (flag === "inactive") flag = "global";

      try {
        parsed = require('@/assets/flags/' + flag.toUpperCase() + '.svg');
      } catch (error) {
        return ''
      }
      return parsed ? parsed : ''
    }
  },
  methods: {},
}
</script>

<style>
.BaseFlag_Flag {
  width: 100%;
}
</style>