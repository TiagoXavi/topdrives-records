<template>
  <div :style="`--h: ${height}px`" class="BaseCover_Layout">
    <div class="BaseCover_Top">
      <BaseRemainingTime
        v-if="endDateTime && !endDateTime.startsWith('2060')"
        :endDateTime="started ? endDateTime : startDateTime"
        :hideNegative="false"
        :mini="false"
        :HMS="true"
        class="BaseCover_Timer"
      />
    </div>
    <img
      :src="coverUrl"
      :key="cover"
      class="BaseCover_Img"
      alt=""
      loading="lazy"
      onerror="this.classList.add('BaseCover_Error');" 
    >
    <div v-if="brand" :class="`Car_Logo_${brand.replaceAll(' ', '_')}`" class="BaseCover_Brand Main_Brand"></div>
    <div class="BaseCover_Title" :class="{ BaseCover_TitleBig: nameCalc.length > 28 }">{{ nameCalc }}</div>
    <div class="BaseCover_RqBox">
      <span class="Cg_RqRq"><i class="tdicon-rq" aria-hidden="true"/></span>
      <span>{{ minRqCalc }}</span>
    </div>
  </div>
</template>

<script>
import BaseRemainingTime from './BaseRemainingTime.vue';

export default {
  name: 'BaseCover',
  components: {
    BaseRemainingTime
  },
  props: {
    cover: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'event'
    },
    name: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 150
    },
    minRq: {
      type: Number,
      default: 0
    },
    minElo: {
      type: Number,
      default: 0
    },
    startDateTime: {
      type: String,
      default: ''
    },
    endDateTime: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      brand: null
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    coverUrl() {
      this.brand = null;
      if (!this.cover) return '';
      let fileName = this.cover;
      if (fileName.startsWith('Event')) {
        fileName = fileName.replace('Event', '');
      }
      if (fileName.startsWith('ChallengeCategory')) {
        fileName = fileName.replace('ChallengeCategory', '');
      }
      if (Vue.brands[fileName]) {
        this.brand = Vue.brands[fileName];
        fileName = "zzBrand";
      }
      if (fileName === "_60s") fileName = "60s";
      if (fileName === "_StyleIcon") fileName = "StyleIcon";

      return '/h_cgs/' + fileName + '.jpg';
    },
    nameCalc() {
      if (this.cover === "EventTodaysChallenge") return "Daily Event";
      return this.name;
    },
    minRqCalc() {
      if (this.cover === "EventTodaysChallenge") return 495;
      return this.minRq;
    },
    started() {
      if (!this.startDateTime) return true;
      let now = new Date().toISOString();
      return this.startDateTime.localeCompare(now) <= 0;
    }
  },
  methods: {},
}
</script>

<style>
.BaseCover_Layout {
  display: flex;
  position: relative;
  height: var(--h);
  padding-top: calc(0.1 * var(--h));
  z-index: 2;
}
.BaseCover_Top {
  position: absolute;
  color: white;
  right: 0;
  font-size: calc(0.06 * var(--h));
  top: 0;
  background-color: black;
  width: 70%;
  text-align: right;
  height: calc(0.1 * var(--h));
  padding-right: calc(0.03 * var(--h));
  box-sizing: border-box;
  display: flex;
  justify-content: end;
  align-items: center;
  border-top-right-radius: 5px;
}
.BaseCover_Top::after {
  content: "";
  position: absolute;
  top: 0;
  left: -24%;
  width: 25%;
  height: 100%;
  background-color: black;
  clip-path: polygon(90% 0%, 0% 100%, 100% 100%, 100% 0%);
}
.BaseCover_Timer {

}
.BaseCover_Img {
  border-radius: 5px;
  border-top-right-radius: 0px;
  width: calc(var(--h) * (216 / 256));
  background-image: radial-gradient(#656565, transparent);
}
.BaseCover_Error {

}
.BaseCover_Title {
  position: absolute;
  bottom: calc(0.15 * var(--h));
  left: calc(0.03 * var(--h));
  color: white;
  text-transform: uppercase;
  font-size: calc(0.097 * var(--h));
  font-weight: bold;
  width: 93%;
  line-height: 1;
}
.BaseCover_TitleBig {
  font-size: calc(0.089 * var(--h));
}
.BaseCover_RqBox {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: absolute;
  bottom: calc(0.03 * var(--h));
  font-size: calc(0.05 * var(--h));
  left: calc(0.03 * var(--h));
}
.BaseCover_RqBox .Cg_RqRq {
  color: #05b2ec;
  font-size: calc(0.1 * var(--h));
  margin-right: 0;
}
.BaseCover_Alone {
  box-shadow: 0px 20px 16px -13px #00000050;
}
.BaseCover_Brand {
  position: absolute;
  top: calc(0.34 * var(--h));
  left: calc(50% - 19px);
  /* --s-height: 3192px;
  --s-unit: 28px;
  background-size: auto calc(var(--s-height) * (var(--card-g-heightraw) / 256));
  background-position: 0 calc((var(--s-unit) * var(--i)) * (var(--card-g-heightraw) / 256) * -1);
  --card-g-heightraw: 512;
  width: 76px;
  height: 54px; */
}

.BaseCover_Club.BaseCover_Layout {
  overflow: hidden;
  padding-top: 0;
  width: calc(var(--h) * (196.37 / 256));
  border-radius: 5px;
}
.BaseCover_Club .BaseCover_Top {
  display: none;
}
.BaseCover_Club .BaseCover_Img {
  border-radius: 0px;
}
.BaseCover_Club .BaseCover_Title {
  font-size: calc(0.089 * var(--h));
  bottom: calc(0.09 * var(--h));
}
.BaseCover_Club .BaseCover_RqBox {
  bottom: 0;
}
.BaseCover_Cg .BaseCover_RqBox {
  display: none;
}
.BaseCover_Cg .BaseCover_Title {
  bottom: calc(0.05 * var(--h));
  font-size: calc(0.077 * var(--h));
}
</style>