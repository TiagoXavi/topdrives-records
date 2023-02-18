<template>
  <div class="BaseCardGallery_Layout" ref="container">
    <div v-if="fixBack" class="BaseCardGallery_FixBack" />
    <div
      class="Car_Header BaseCardGallery_Header"
      :class="{ Row_DialogCardCard2: !options, Car_Loading: downloadLoading }"
      :style="`--class-color: ${carClassColor}; ${carPhoto}`">
      <!-- <div class="Car_HeaderBlockBrand" /> -->
      <div class="Car_HeaderBlockYear" style="backdrop-filter: none;">{{ car.year || "-"  }}</div>
      <div class="Car_HeaderBlockCountry">{{ car.country || "-"  }}</div>
      <div class="Car_HeaderBlockTires">
        <span>{{ $t(`c_${car.tyres.toLowerCase()}`) || "-"  }}</span>
        <span> {{ $tc("c_tyre", 2) }}</span>
      </div>
      <!-- <div :class="`Car_NumberStars${car.selectedTune}`" class="Car_HeaderBlockStars">
        <i v-for="n in 3" class="ticon-star Car_Star" aria-hidden="true"/>
      </div> -->
      <!-- <div v-if="options" class="Car_HeaderToolsHoverContainer" />
      <div v-if="options" class="Car_HeaderTools">
        <button class="D_Button Car_HeaderButton Car_HeaderDrag" @mousedown="$emit('dragdown', $event)">
          <i class="ticon-expand Car_HeaderIcon Car_DragIcon" aria-hidden="true"/>
        </button>
        <button class="D_Button Car_HeaderButton" @click="$emit('delete')">
          <i class="ticon-close_3 Car_HeaderIcon" aria-hidden="true"/>
        </button>
      </div> -->
      <!-- <div class="Car_HeaderToolsBack" /> -->
      <div class="Car_HeaderBlockRQ">
        <div class="Car_HeaderRQValue">{{ car.rq }}</div>
        <div class="Car_HeaderRQLabel">RQ</div>
      </div>
      <div class="Car_HeaderBlockClass">
        <div class="Car_HeaderClassBack" />
        <div class="Car_HeaderClassValue">{{ this.car.rq | resolveClass(this.car.class, "letter") }}</div>
      </div>
      <div class="Car_HeaderBlockTopSpeed">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('topSpeed', customData) }}</div>
        <div class="Car_HeaderStatLabel">{{ $t("c_topSpeed").toUpperCase() }}</div>
      </div>
      <div class="Car_HeaderBlock060">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('acel', customData) }}</div>
        <div class="Car_HeaderStatLabel">0-60MPH</div>
      </div>
      <div class="Car_HeaderBlockHandling">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('hand', customData) }}</div>
        <div class="Car_HeaderStatLabel">{{ $t("c_handling").toUpperCase() }}</div>
      </div>
      <div class="Car_HeaderBlockDrive">
        <div class="Car_HeaderStatValue">{{ car.drive || "-" }}</div>
        <div class="Car_HeaderStatLabel">{{ $tc("c_drive", 1).toUpperCase() }}</div>
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
    customData: {
      type: Object,
      default() {
        return null
      }
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
.BaseCardGallery_Layout {
  display: contents;
  text-align: left;
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
.BaseCardGallery_Layout .Car_Header {
  display: block;
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
.BaseCardGallery_Header > * {
  display: block;
}
.BaseCardGallery_Header .Car_HeaderName {
  top: 3px;
  font-size: 1em;
}
.BaseCardGallery_Header .Car_HeaderBlockYear {
  top: 4px;
  background-color: transparent;
  right: 10.5%;
}
.BaseCardGallery_Header .Car_HeaderBlockCountry {
  top: 0px;
  background-color: transparent;
}
.BaseCardGallery_Header .Car_HeaderBlockTopSpeed, 
.BaseCardGallery_Header .Car_HeaderBlock060,
.BaseCardGallery_Header .Car_HeaderBlockHandling,
.BaseCardGallery_Header .Car_HeaderBlockDrive {
  --card-top-height: 15%;
}
.BaseCardGallery_Header {
  --card-stat-height: calc( (104% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );
}
.BaseCardGallery_Header .Car_HeaderClassValue {
  margin-top: 5px;
}
.BaseCardGallery_Header .Car_HeaderBlockRQ {
  bottom: -3px;
  background-color: transparent;
}
</style>