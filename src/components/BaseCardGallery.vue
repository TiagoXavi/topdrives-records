<template>
  <div class="BaseCardGallery_Layout" ref="container">
    <div v-if="fixBack" class="BaseCardGallery_FixBack" />
    <div
      class="Car_Header BaseCardGallery_Header"
      :class="{ Row_DialogCardCard2: !options, Car_Loading: downloadLoading }"
      :style="`--class-color: ${carClassColor}; --image-src: url(${carPhoto});`"
      v-lazy:background-image="carPhoto2">
      <div class="Car_HeaderBlockTop" />
      <!-- <div class="Car_HeaderBlockBrand" /> -->
      <div class="Car_HeaderBlockYear">{{ car.year || "-"  }}</div>
      <div class="Car_HeaderBlockCountry">{{ car.country || "-"  }}</div>
      <div class="Car_HeaderBlockTires">
        <span>{{ car.tyres || "-"  }}</span>
        <span> Tyres</span>
      </div>
      <div :class="`Car_NumberStars${car.selectedTune}`" class="Car_HeaderBlockStars">
        <i v-for="n in 3" class="ticon-star Car_Star" aria-hidden="true"/>
      </div>
      <div v-if="options" class="Car_HeaderToolsHoverContainer" />
      <div v-if="options" class="Car_HeaderTools">
        <button class="D_Button Car_HeaderButton Car_HeaderDrag" @mousedown="$emit('dragdown', $event)">
          <i class="ticon-expand Car_HeaderIcon Car_DragIcon" aria-hidden="true"/>
        </button>
        <button class="D_Button Car_HeaderButton" @click="$emit('delete')">
          <i class="ticon-close_3 Car_HeaderIcon" aria-hidden="true"/>
        </button>
      </div>
      <div class="Car_HeaderToolsBack" />
      <div class="Car_HeaderBlockRQ">
        <div class="Car_HeaderRQValue">{{ car.rq }}</div>
        <div class="Car_HeaderRQLabel">RQ</div>
      </div>
      <div class="Car_HeaderBlockClass">
        <div class="Car_HeaderClassBack" />
        <div class="Car_HeaderClassValue">{{ this.car.rq | resolveClass(this.car.class, "letter") }}</div>
      </div>
      <div class="Car_HeaderBlockTopSpeed">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('topSpeed') }}</div>
        <div class="Car_HeaderStatLabel">TOP SPEED</div>
      </div>
      <div class="Car_HeaderBlock060">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('acel') }}</div>
        <div class="Car_HeaderStatLabel">0-60MPH</div>
      </div>
      <div class="Car_HeaderBlockHandling">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('hand') }}</div>
        <div class="Car_HeaderStatLabel">HANDLING</div>
      </div>
      <div class="Car_HeaderBlockDrive">
        <div class="Car_HeaderStatValue">{{ car.drive || "-" }}</div>
        <div class="Car_HeaderStatLabel">DRIVE</div>
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
  name: 'BaseCardGallery',
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
      return parsed
    },
    carPhoto2() {
      let parsed;
      try {
        parsed = require('@/imgs_final/' + this.car.rid + '.jpg');
      } catch (error) {
        return ''
      }
      return parsed
    }
  },
  methods: {},
}
</script>

<style>
.BaseCardGallery_Layout {
  display: contents;
}
.BaseCardGallery_FixBack {
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  top: 0;
  left: 0;
  /* position: sticky; */
  width: 100%;
  height: var(--top-height);
  z-index: 20;
}
.BaseCardGallery_FixBack + .Car_Header {
  margin-top: calc((var(--top-height) - 3px) * -1);
}
.Main_2 .BaseCardGallery_FixBack {
  display: none;
}
.MainGallery_Layout .Car_Header {
  height: calc(var(--top-height) - 6px);
  margin: 3px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 3px;
  z-index: 20;
  font-family: 'Roboto Condensed', sans-serif;
  color: #eee;
  background-color: #919191;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.06) 0, rgba(0, 0, 0, 0.06) 30px );
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
  font-size: var(--card-font-size);
}
.MainGallery_Layout .Car_Header[lazy=error] {
  background-image: var(--image-src) !important;
}
.MainGallery_Layout .Car_Header.BaseCardGallery_Header {
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
</style>