<template>
  <button :style="`--size: ${size}px`" class="D_Button BaseItem_Layout" @click="itemClick()">
    <img
      :src="imgUrl"
      :key="item[2]"
      class="BaseItem_Img"
      alt=""
      loading="lazy"
      onerror="this.classList.add('BaseItem_Error');" 
    >
  </button>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseItem',
  components: {
    // BaseDetalheHeader
  },
  props: {
    item: {
      type: [Array, Object],
      default: () => ([null, 1])
    },
    size: {
      type: Number,
      default: 50
    },
    clicable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    imgUrl() {
      if (!this.item) return '';
      let fileName;
      if (this.item[0]) fileName = Vue.inventory[this.item[0]]?.image;
      if (this.item.image) fileName = this.item.image;

      if (!fileName) fileName = "InventoryItemKeyGrey";
      
      if (fileName.startsWith('InventoryItem')) {
        fileName = fileName.replace('InventoryItem', '');
      }

      return '/h_icons/' + fileName + '.png';
    },
  },
  methods: {
    itemClick() {
      if (!this.clicable) return;
      this.$store.commit('OPEN_ITEM_DETAIL', this.item);
    }
  },
}
</script>

<style>
.BaseItem_Layout {
  
}
.BaseItem_Img {
  height: var(--size);
  width: var(--size);
}
.BaseItem_Error {

}
</style>