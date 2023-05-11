<template>
  <div
    :class="{ BaseCard_LayoutDialog: isDialogBox }"
    :style="`--class-color: ${carClassColor}; --class-color-rgb: ${carClassColorRgb};`"
    class="BaseCard_Layout">
    <div v-if="fixBack" class="BaseCard_FixBack" />
    <div v-if="isDialogBox" class="BaseCard_EffectBackGround"></div>
    <div
      class="Car_Header"
      :class="{ Row_DialogCardCard: isDialogBox, Car_Loading: downloadLoading }"
      :style="`${carPhoto};`">
      <div class="Car_HeaderBlockTop" />
      <!-- <div class="Car_HeaderBlockBrand" /> -->
      <div class="Car_HeaderBlockYear">{{ car.year || "-"  }}</div>
      <div class="Car_HeaderBlockCountry">{{ car.country || "-"  }}</div>
      <div class="Car_HeaderBlockTires">
        <span class="Car_HeaderBlockTiresValue">{{ $t(`c_${car.tyres.toLowerCase()}`) || "-" }}</span>
        <span class="Car_HeaderBlockTiresLabel"> {{ $tc("c_tyre", 2) }}</span>
      </div>
      <div :class="`Car_NumberStars${car.selectedTune}`" class="Car_HeaderBlockStars">
        <i v-for="n in 3" class="ticon-star Car_Star" aria-hidden="true"/>
      </div>
      <div v-if="cgOppo" class="Car_TuneTip">{{ car.selectedTune }}</div>
      <div v-if="options" class="Car_HeaderToolsHoverContainer" />
      <div v-if="options" class="Car_HeaderTools">
        <button v-if="showResetTune" class="D_Button Car_HeaderButton" @click="$emit('refreshTune')">
          <i class="ticon-refresh_3 Car_HeaderIcon" aria-hidden="true"/>
        </button>
        <button v-if="!cg" class="D_Button Car_HeaderButton Car_HeaderDrag" @mousedown="$emit('dragdown', $event)">
          <i class="ticon-expand Car_HeaderIcon Car_DragIcon" aria-hidden="true"/>
        </button>
        <button v-if="cgOppo" class="D_Button Car_HeaderButton" @click="$emit('cog')">
          <i class="ticon-gear Car_HeaderIcon" aria-hidden="true"/>
        </button>
        <button v-if="(!needSave || cgOppo) && !hideClose" class="D_Button Car_HeaderButton" @click="$emit('delete')">
          <i class="ticon-close_3 Car_HeaderIcon" aria-hidden="true"/>
        </button>
      </div>
      <div class="Car_HeaderToolsBack" />
      <div class="Car_HeaderBlockRQ">
        <div class="Car_HeaderRQValue">{{ resolvedRq }}</div>
        <div class="Car_HeaderRQLabel">RQ</div>
      </div>
      <div class="Car_HeaderBlockClass">
        <div class="Car_HeaderClassBack" />
        <div class="Car_HeaderClassValue">{{ this.car.rq | resolveClass(this.car.class, "letter") }}</div>
      </div>
      <div v-if="car.prize" class="Car_HeaderBlockPrize" title="Prize car">
        <i class="ticon-trophy Car_HeaderTrophy" aria-hidden="true"/>
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
      <div
        class="Car_CompactOverlay"
        @touchstart="touchstart($event)"
        @touchend="touchend()"
        @mousedown="$emit('dragdown', $event)"
        @click="invertedClick($event)" />
    </div>
    <div
      :class="{ Car_Loading: downloadLoading }"
      :style="`--class-color: ${carClassColor}`"
      class="Car_Header2"
      @mousedown="$emit('dragdown', $event)"
      @touchstart="touchstart($event)"
      @click="invertedClick($event)">
      <div class="BaseCard_Header2Left">
        <img :src="carPhotoSrc" class="BaseCard_Header2Img" alt="">
      </div>
      <div class="BaseCard_Header2Right">
        <div class="BaseCard_Header2Top"><b>[{{ car.rq }}]</b> {{ car.brand }}</div>
        <div class="BaseCard_Header2Bottom">{{ car.onlyName }}</div>
      </div>
      <div class="BaseCard_Header2Right2">{{ car.rq }}</div>
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
    isDialogBox: {
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
    hideClose: {
      type: Boolean,
      default: false
    },
    showResetTune: {
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
    return {
      timer: null,
      timerStart: 0,
      touchCount: 0,
      touchedLong: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    carClassColor() {
      return Vue.resolveClass(this.car.rq, this.car.class, "color");
    },
    carClassColorRgb() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.carClassColor);
      return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
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
    resolvedRq() {
      if (this.car && this.car.selectedTune && this.car.selectedTune.startsWith('v')) {
        return Vue.getOldCar(this.car.rid, this.car.selectedTune.substr(1,2)).rq;
      } else {
        return this.car.rq
      }
    }
  },
  methods: {
    invertedClick(e) {
      if (!this.needSave && e.shiftKey) {
        this.$emit('delete');
      }
    },
    touchstart(e) {
      e.preventDefault();
      clearTimeout(this.timer);
      this.timer = setTimeout(this.onlongtouch, 600);
      

      if (this.touchCount === 0) {
        // first touch or quickTouch
        this.timerStart = performance.now();
        this.touchCount = this.touchCount+1;
        return;
      }
      if (performance.now() - this.timerStart < 400) {
        // secound quickTouch
        this.touchCount = this.touchCount+1;
      } else {
        // secound touch
        this.timerStart = performance.now();
        this.touchCount = 1;
      }
      if (this.touchCount > 2) {
        if ((!this.needSave || this.cgOppo) && !this.hideClose) {
          this.$emit('delete');
        }
        this.touchCount = 0;
        clearTimeout(this.timer);
      }
    },
    touchend() {
      //stops short touches from firing the event
      clearTimeout(this.timer);
      if (this.touchedLong) {
        this.touchedLong = false;
        this.$emit('longTouch');
      }
    },
    onlongtouch() {
      navigator.vibrate(30);
      this.touchedLong = true;
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
  height: 100%;
}
.BaseCard_Header2Right {
  font-size: 14px;
  flex-grow: 1;
  max-width: calc(100% - 56px);
}
.BaseCard_Header2Top {
  color: grey;
}
.BaseCard_Header2Bottom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.BaseCard_Header2Right2 {
  display: none;
  color: black;
  background-color: var(--class-color);
  height: 20px;
  justify-content: center;
  width: 19px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 21px;
  border-top-right-radius: 4px;
  padding-right: 1px;
}
.BaseCard_EffectBackGround {
  bottom: -60px;
  left: -90px;
  background: radial-gradient(rgba(var(--class-color-rgb),0.5) 0%, rgba(var(--class-color-rgb),0) 60%);
  position: absolute;
  pointer-events: none;
  width: 330px;
  height: 260px;
}
.Row_DialogCardLeft {
  position: relative;
}
</style>