<template>
  <div class="BaseSelect_Layout">
    <select v-bind="$attrs" @change="$emit('change', $event.target.value)">
      <option v-for="item in list" :value="item">{{ item }}</option>
    </select>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseSelect',
  components: {
    // BaseDetalheHeader
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
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
.BaseSelect_Layout {
  display: contents;
}
</style>