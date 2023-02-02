<template>
  <img :src="flagSrc" class="BaseFlag_Flag" alt="">
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