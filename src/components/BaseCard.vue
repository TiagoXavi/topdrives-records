<template>
  <div class="BaseCard_Layout">
    <div v-if="fixBack" class="BaseCard_FixBack" />
    <div
      class="Car_Header"
      :class="{ Row_DialogCardCard: !options, Car_Loading: downloadLoading }"
      :style="`--class-color: ${carClassColor}; ${carPhoto}`">
      <div class="Car_HeaderBlockTop" />
      <!-- <div class="Car_HeaderBlockBrand" /> -->
      <div class="Car_HeaderBlockYear">{{ car.year || "-"  }}</div>
      <div class="Car_HeaderBlockCountry">{{ car.country || "-"  }}</div>
      <div class="Car_HeaderBlockTires">
        <span>{{ car.tyres || "-" }}</span>
        <span> Tyres</span>
      </div>
      <div :class="`Car_NumberStars${car.selectedTune}`" class="Car_HeaderBlockStars">
        <i v-for="n in 3" class="ticon-star Car_Star" aria-hidden="true"/>
      </div>
      <div v-if="cgOppo" class="Car_TuneTip">{{ car.selectedTune }}</div>
      <div v-if="options" class="Car_HeaderToolsHoverContainer" />
      <div v-if="options" class="Car_HeaderTools">
        <button v-if="!cg" class="D_Button Car_HeaderButton Car_HeaderDrag" @mousedown="$emit('dragdown', $event)">
          <i class="ticon-expand Car_HeaderIcon Car_DragIcon" aria-hidden="true"/>
        </button>
        <button v-if="!needSave" class="D_Button Car_HeaderButton" @click="$emit('delete')">
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
        <div class="Car_HeaderStatValue">{{ car | resolveStat('topSpeed', customData) }}</div>
        <div class="Car_HeaderStatLabel">TOP SPEED</div>
      </div>
      <div class="Car_HeaderBlock060">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('acel', customData) }}</div>
        <div class="Car_HeaderStatLabel">0-60MPH</div>
      </div>
      <div class="Car_HeaderBlockHandling">
        <div class="Car_HeaderStatValue">{{ car | resolveStat('hand', customData) }}</div>
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
      <div
        class="Car_CompactOverlay"
        @mousedown="$emit('dragdown', $event)"
        @click="invertedClick($event)" />
    </div>
    <div
      :class="{ Car_Loading: downloadLoading }"
      :style="`--class-color: ${carClassColor}`"
      class="Car_Header2"
      @mousedown="$emit('dragdown', $event)"
      @click="invertedClick($event)">
      <div class="BaseCard_Header2Left">
        <img :src="carPhotoSrc" class="BaseCard_Header2Img" alt="">
      </div>
      <div class="BaseCard_Header2Right">
        <span><b>[{{ car.rq }}]</b> {{ car.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseCard',
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
    needSave: {
      type: Boolean,
      default: false
    },
    cg: {
      type: Boolean,
      default: false
    },
    cgOppo: {
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
    carPhotoSrc() {
      let parsed;
      try {
        parsed = require('@/imgs_final/' + this.car.rid + '.jpg');
      } catch (error) {
        return ''
      }
      return parsed ? parsed : ''
    },
  },
  methods: {
    invertedClick(e) {
      if (!this.needSave && e.shiftKey) {
        this.$emit('delete');
      }
    }
  },
}
</script>

<style>
.BaseCard_Layout {
  display: contents;
}
.BaseCard_FixBack {
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  top: 0;
  left: 0;
  position: sticky;
  width: 100%;
  height: var(--top-height);
  z-index: 20;
}
.BaseCard_FixBack + .Car_Header {
  margin-top: calc((var(--top-height) - 3px) * -1);
}
.Main_2 .BaseCard_FixBack {
  display: none;
}
.BaseCard_Header2Left {
  /* width: calc(var(--cell-height) * 1.7);
  min-width: calc(var(--cell-height) * 1.7);
  height: 100%;
  background-size: 90px;
  background-position: 33%;
  transform: scale(1.0001);
  margin-right: 5px; */

  display: flex;
  height: var(--cell-height);
  /* margin: -7px 0; */
  width: 53px;
  min-width: 53px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 5px;
  background-color: #00000038;
}
.BaseCard_Header2Img {
  transform: scale(1.4) translateX(1px);
}
</style>