<template>
  <div class="BaseGalleryItem_Layout">
    <div class="BaseGalleryItem_Photos">Teste</div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseGalleryItem',
  components: {
    // BaseDetalheHeader
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
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