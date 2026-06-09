<template>
  <button :style="`--size: ${size}px`" class="D_Button BasePackBmp_Layout" @click="itemClick()">
    <img
      :src="imgUrl"
      :key="pack.type"
      class="BasePackBmp_Img"
      alt=""
      loading="lazy"
      onerror="this.onerror=null; this.src='/h_packs/default.png'; this.classList.add('BasePackBmp_Error');" 
    >
    <div v-if="pack.qty > 1" class="BasePackBmp_Qty">x{{ pack.qty }}</div>
  </button>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BasePackBmp',
  components: {
    // BaseDetalheHeader
  },
  props: {
    pack: {
      type: Object,
      default: () => ({ type: "ceramic", qty: 1 })
    },
    size: {
      type: Number,
      default: 100
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
      if (!this.pack) return '';
      let fileName = this.pack.type;

      return '/h_packs/' + fileName + '.png';
    },
  },
  methods: {
    itemClick() {
      this.$store.commit('OPEN_PACK_DETAIL', this.pack);
    }
  },
}
</script>

<style>
.BasePackBmp_Layout {
  position: relative;
}
.BasePackBmp_Img {
  height: var(--size);
  /* width: var(--size); */
}
.BasePackBmp_Error {

}
.BasePackBmp_Qty {
  position: absolute;
  top: 5%;
  right: 5%;
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
  padding: 2px 5px;
  border-radius: 3px;
}
</style>