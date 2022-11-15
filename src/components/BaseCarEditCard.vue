<template>
  <div class="BaseCarEditCard_Layout" ref="container">
    <div v-if="fixBack" class="BaseCarEditCard_FixBack" />
    <div
      class="Car_Header BaseCarEditCard_Header Row_DialogCardCard2"
      :class="{ BaseCarEditCard_Marked: marked }"
      :style="`--class-color: ${carClassColor}; ${carPhoto}`"
      @click="$emit('action')">
      <div class="Car_HeaderBlockTop" style="backdrop-filter: none; background-color: rgba(81,78,72,1);"/>
      <div class="Car_HeaderBlockRQ">
        <div class="Car_HeaderRQValue">{{ car.rq }}</div>
        <div class="Car_HeaderRQLabel">RQ</div>
      </div>
      <div :class="{
        Car_HeaderNameBig: car.name.length > 31,
        Car_HeaderNameBigBig: car.name.length > 37
        }" class="Car_HeaderName">{{ car.name }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseCarEditCard',
  components: {},
  props: {
    car: {
      type: Object,
      default() {
        return {}
      }
    },
    options: {
      type: Boolean,
      default: true
    },
    fixBack: {
      type: Boolean,
      default: false
    },
    temp: {
      type: Number,
      default: 1
    },
    downloadLoading: {
      type: Boolean,
      default: false
    },
    marked: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    carClassColor() {
      return Vue.resolveClass(this.car.rq, this.car.class, "color");
    },
    carPhoto() {
      let parsed;
      try {
        parsed = require('@/imgs_final/' + this.car.rid + '.jpg');
      } catch (error) {
        return ''
      }
      parsed = parsed.replaceAll("(","\\(").replaceAll(")","\\)");
      parsed = parsed.replaceAll("'","\\'");
      return parsed ? 'background-image: url('+parsed+');' : ''
    },
  },
  methods: {},
}
</script>

<style>
.BaseCarEditCard_Layout {
  display: contents;
}
.BaseCarEditCard_FixBack {
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  top: 0;
  left: 0;
  /* position: sticky; */
  width: 100%;
  height: var(--top-height);
  z-index: 20;
}
.BaseCarEditCard_FixBack + .Car_Header {
  margin-top: calc((var(--top-height) - 3px) * -1);
}
.Main_2 .BaseCarEditCard_FixBack {
  display: none;
}
.MainGallery_Layout .Car_Header {
  
}
.MainGallery_Layout .Car_Header[lazy=error] {
  background-image: var(--image-src) !important;
}
.MainGallery_Layout .Car_Header.BaseCarEditCard_Header {
  position: relative;
  margin-left: 55px;
}
.Row_DialogCardCard2 {
  width: 300px !important;
  height: 184px !important;
  --card-font-size: 15px;
}
.Row_DialogCardCard2 .Car_HeaderStatValue {
  line-height: 1;
}
.BaseCarEditCard_Marked {
  box-shadow: 0px 0px 0px 15px #007cff73;
}
</style>