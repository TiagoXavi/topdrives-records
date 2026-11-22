<template>
  <button :style="`--size: ${size}px`" class="D_Button BasePackBmp_Layout" @click="itemClick()">
    <BasePackSvg
      v-if="packResolved.uuid && !uuidAsImage"
      class="BasePackBmp_Svg"
      :uuid="packResolved.uuid"
    />
    <img
      v-else
      :src="imgUrl"
      :key="packResolved.type"
      class="BasePackBmp_Img"
      alt=""
      loading="lazy"
      onerror="this.onerror=null; this.src='/h_packs/default.png'; this.classList.add('BasePackBmp_Error');" 
    >
    <div v-if="packResolved.qty > 1" class="BasePackBmp_Qty">x{{ packResolved.qty }}</div>
  </button>
</template>

<script>
import BasePackSvg from './BasePackSvg.vue';

export default {
  name: 'BasePackBmp',
  components: {
    BasePackSvg
  },
  props: {
    pack: {
      type: [Object, Array],
      default: () => ({ type: "ceramic", qty: 1 })
    },
    size: {
      type: Number,
      default: 100
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
      if (this.uuidAsImage) return this.uuidAsImage;
      if (!this.packResolved.type) return '';
      let fileName = this.packResolved.type;
      if (fileName === "carbon") fileName = "carbonfiber";
      if (fileName === "ceramic") fileName = "ceramic";
      if (fileName === "aluminium") fileName = "aluminium";
      if (fileName === "steel") fileName = "steel";
      if (fileName === "plastic") fileName = "plastic";

      return `https://tdrpacks.s3.us-east-1.amazonaws.com/${fileName}panel.png`;

      return '/h_packs/' + fileName + '.png';
    },
    packResolved() {
      if (!this.pack) return {};
      if (this.pack.type) return this.pack;
      if (this.pack.uuid) return this.pack;
      if (this.pack[1] && this.pack[1].length === 36) return { uuid: this.pack[1], qty: this.pack[3] };
      else return { type: this.pack[4], qty: this.pack[3] };
    },
    uuidAsImage() {
      if (!this.packResolved.uuid) return null;
      const pack = Vue.packs[this.packResolved.uuid];
      if (!pack) return null;
      if (!pack.imageName || pack.uiElements) return null;
      return `https://tdrpacks.s3.us-east-1.amazonaws.com/${pack.imageName.toLowerCase()}panel.png`;
    }
  },
  methods: {
    itemClick() {
      if (!this.clicable) return;
      this.$store.commit('OPEN_PACK_DETAIL', this.packResolved);
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
.BasePackBmp_Svg {
  height: var(--size);
  aspect-ratio: 1.61;
}
</style>