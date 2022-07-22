<template>
  <div class="MainVerifyEmail_Layout">Your token is {{ token }}</div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'MainVerifyEmail',
  components: {
    // BaseDetalheHeader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    token() {
      return this.$route.params.token;
    },
  },
  methods: {},
}
</script>

<style>
</style>