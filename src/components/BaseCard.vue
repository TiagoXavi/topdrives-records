<template>
  <div
    :class="`${isDialogBox ? 'BaseCard_LayoutDialog' : ''} BaseCard_Class${resolveCar.class} ${asGallery ? 'BaseCard_LayoutAsDialog' : ''}`"
    :style="`--class-color: ${carClassColor}; --class-color-rgb: ${carClassColorRgb};`"
    class="BaseCard_Layout">
    <div v-if="fixBack" class="BaseCard_FixBack" />
    <div v-if="isDialogBox" class="BaseCard_EffectBackGround"></div>
    <div
      class="Car_Header"
      :class="{ Row_DialogCardCard: isDialogBox, Car_Loading: downloadLoading, Car_WithVideo: videoSrc }">
      <img
        :src="carPhotoSrc"
        :key="car.rid"
        class="Car_ImgTag"
        loading="lazy"
        alt=""
      />
      <video v-if="videoSrc" autoplay="" muted="" loop="" :src="videoSrc" webkit-playsinline playsinline />
      <div class="Car_HeaderBlockTop" />
      <!-- <div class="Car_HeaderBlockBrand" /> -->
      <div class="Car_HeaderBlockYear">{{ car.year || "-"  }}</div>
      <div class="Car_HeaderBlockCountry">{{ car.country || "-"  }}</div>
      <div class="Car_HeaderBlockTires">
        <span class="Car_HeaderBlockTiresValue">{{ $t(`c_${(resolveCar.tyres || "?").toLowerCase()}`) || "-" }}</span>
        <span class="Car_HeaderBlockTiresLabel"> {{ $tc("c_tyre", 2) }}</span>
      </div>
      <div :class="`Car_NumberStars${fTune}`" class="Car_HeaderBlockStars">
        <i v-for="n in 3" class="ticon-star Car_Star" aria-hidden="true"/>
      </div>
      <template v-if="cgOppo">
        <div v-if="fTune && fTune.includes('Other') && fTune !== 'Other'" class="Car_TuneTip">{{ fTune.slice(5) }}</div>
        <div v-else class="Car_TuneTip">{{ fTune }}</div>
      </template>
      <div v-if="options" class="Car_HeaderToolsHoverContainer" />
      <div v-if="options" class="Car_HeaderTools">
        <button v-if="showResetTune" class="D_Button Car_HeaderButton" @click="$emit('refreshTune')">
          <i class="ticon-refresh_3 Car_HeaderIcon" aria-hidden="true"/>
        </button>
        <button v-if="draggable" class="D_Button Car_HeaderButton Car_HeaderDrag" @mousedown="$emit('dragdown', $event)">
          <i class="ticon-expand Car_HeaderIcon Car_DragIcon" aria-hidden="true"/>
        </button>
        <button v-if="cgOppo" class="D_Button Car_HeaderButton" @click="$emit('cog')">
          <i class="ticon-gear Car_HeaderIcon" aria-hidden="true"/>
        </button>
        <button v-if="(!needSave || cgOppo) && !hideClose" class="D_Button Car_HeaderButton" @click="$emit('delete')">
          <i class="ticon-close_3 Car_HeaderIcon" aria-hidden="true"/>
        </button>
      </div>
      <div v-if="options" class="Car_HeaderToolsBack" />
      <div v-if="tuneText" class="Car_TuneTipGallery">{{ tuneText }}</div>
      <div class="Car_HeaderLogo" :class="`Car_Logo_${(car.logo || car.brand).replaceAll(' ', '_')}`" />
      <div class="Car_HeaderBlockRQ">
        <div class="Car_HeaderRQValue" :class="{ Car_HeaderRQValue3: resolveCar && resolveCar.rq > 99 }">{{ resolveCar.rq }}</div>
        <div class="Car_HeaderRQLabel"><i class="tdicon-rq" aria-hidden="true"/></div>
      </div>
      <div v-if="car.prize" class="Car_HeaderBlockPrize" title="Prize car">
        <div class="Car_HeaderPrizeBack" />
        <i class="ticon-trophy Car_HeaderTrophy" aria-hidden="true"/>
      </div>
      <div class="Car_HeaderBlockClass">
        <div class="Car_HeaderClassBack2" />
        <div class="Car_HeaderClassBack" />
        <div class="Car_HeaderClassValue">{{ this.resolveCar.rq | resolveClass(this.resolveCar.class, "letter") }}</div>
      </div>
      <div class="Car_HeaderBackDropRight" :class="{ Car_ForceStats: forceStats }">
        <div class="Car_HeaderRightBlockUnique">
          <div class="Car_HeaderStatValue">{{ car | resolveStat('topSpeed', customData, fTune, forceStats) }}</div>
          <div class="Car_HeaderStatLabel">{{ $t("c_topSpeed").toUpperCase() }}</div>
        </div>
        <div class="Car_HeaderRightBlockUnique">
          <div class="Car_HeaderStatValue">{{ car | resolveStat('acel', customData, fTune, forceStats) }}</div>
          <div class="Car_HeaderStatLabel">0-60MPH</div>
        </div>
        <div class="Car_HeaderRightBlockUnique">
          <div class="Car_HeaderStatValue">{{ car | resolveStat('hand', customData, fTune, forceStats) }}</div>
          <div class="Car_HeaderStatLabel">{{ $t("c_handling").toUpperCase() }}</div>
        </div>
        <div class="Car_HeaderRightBlockUnique">
          <div class="Car_HeaderStatValue Car_HeaderStatLabelDrive">{{ this.resolveCar.drive  || "-" }}</div>
          <div class="Car_HeaderStatLabel">{{ $tc("c_drive", 1).toUpperCase() }}</div>
        </div>
      </div>
      <div :class="{
        Car_HeaderNameBig: car.name.length > 28,
        Car_HeaderNameBigBig: car.name.length > 34
        }" class="Car_HeaderName">{{ car.name }}</div>
      <div
        v-if="showCompactOverlay"
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
      @touchend="touchend()"
      @click="invertedClick($event)">
      <div class="BaseCard_Header2Left">
        <img
          :src="carPhotoSrc"
          :key="car.rid"
          loading="lazy"
          class="BaseCard_Header2Img"
          alt=""
        >
      </div>
      <div class="BaseCard_Header2Right">
        <div class="BaseCard_Header2Top"><b>[{{ resolveCar.rq }}]</b> {{ car.brand }}</div>
        <div class="BaseCard_Header2Bottom">{{ car.onlyName }}</div>
      </div>
      <div class="BaseCard_Header2Right2">{{ resolveCar.rq }}</div>
    </div>
  </div>
</template>

<script>
// import Car from './Car.vue';

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
    draggable: {
      type: Boolean,
      default: true
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
    videoSrc: {
      type: String,
      default: null
    },
    asGallery: {
      type: Boolean,
      default: false
    },
    forceStats: {
      type: Boolean,
      default: false
    },
    tuneText: {
      requred: false
    },
    showCompactOverlay: {
      type: Boolean,
      default: true
    },
    selectedTune: {}
  },
  data() {
    return {
      timer: null,
      timerStart: 0,
      touchCount: 0,
      touchedLong: false,
      resolveCar: {},
      carClassColor: "",
      currentTune: ""
    }
  },
  watch: {
    "car.selectedTune": function() {
      // console.log(this.car.selectedTune);
      this.load();
    },
    "car.rid": function() {
      this.load();
    }
  },
  beforeMount() {
    this.load();
  },
  mounted() {},
  computed: {
    // carClassColor() {
    //   let result;
    //   result = Vue.resolveClass(this.resolveCar.rq, this.resolveCar.class, "color");
    //   debugger;
    //   return result;
    // },
    // tune() {
    //   let result = this.car.selectedTune
    //   console.log("tune", result);
    //   return result;
    // },
    carClassColorRgb() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.carClassColor);
      return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
    },
    // carPhoto() {
    //   let parsed = Vue.carPhoto(this.car);
    //   parsed = parsed.replaceAll("(","\\(").replaceAll(")","\\)");
    //   parsed = parsed.replaceAll("'","\\'");
    //   return parsed ? 'background-image: url('+parsed+');' : ''
    // },
    carPhotoSrc() {
      let parsed = Vue.carPhoto(this.car);
      return parsed ? parsed : ''
    },
    fTune() {
      return this.car.selectedTune || this.selectedTune || "";
    }
  },
  methods: {
    load() {
      if (this.car && this.fTune && this.fTune.startsWith('v')) {
        this.resolveCarMethod();
      } else {
        this.resolveCar = this.car;
        this.carClassColor = Vue.resolveClass(this.car.rq, this.car.class, "color");
        if (this.isDialogBox) this.$emit('color', this.carClassColor);
      }
    },
    async resolveCarMethod() {
      if (this.car && this.fTune && this.fTune.startsWith('v')) {
        Vue.getOldCar(this.car.rid, this.fTune.substr(1,2)).then(res => {
          this.resolveCar = res;
          this.carClassColor = Vue.resolveClass(res.rq, res.class, "color");
          if (this.isDialogBox) this.$emit('color', this.carClassColor);
        });
      } else {
        return this.car
      }
    },
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
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
      // this.touchedLong = true;
      this.$emit('longTouch');
    }
  },
}
</script>

<style>
</style>