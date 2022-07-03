<template>
  <div v-if="car !== null" class="Car_Layout">
    <div class="Car_Header" :style="`--class-color: ${carClassColor}; ${car.photo? 'background-image: url('+car.photo+');' : ''}`">
      <div class="Car_HeaderBlockTop" />
      <!-- <div class="Car_HeaderBlockBrand" /> -->
      <div class="Car_HeaderBlockYear">{{ car.year || "-"  }}</div>
      <div class="Car_HeaderBlockCountry">{{ car.country || "-"  }}</div>
      <div class="Car_HeaderBlockTires">
        <span>{{ car.tyres || "-"  }}</span>
        <span> Tyres</span>
      </div>
      <div :class="`Car_NumberStars${car.stars}`" class="Car_HeaderBlockStars">
        <i v-for="n in 3" class="ticon-star Car_Star" aria-hidden="true"/>
      </div>
      <div class="Car_HeaderBlockRQ">
        <div class="Car_HeaderRQValue">{{ car.rq }}</div>
        <div class="Car_HeaderRQLabel">RQ</div>
      </div>
      <div class="Car_HeaderBlockClass">
        <div class="Car_HeaderClassBack" />
        <div class="Car_HeaderClassValue">{{ carClass }}</div>
      </div>
      <div class="Car_HeaderBlockTopSpeed">
        <div class="Car_HeaderStatValue">{{ car.topSpeed || "-" }}</div>
        <div class="Car_HeaderStatLabel">TOP SPEED</div>
      </div>
      <div class="Car_HeaderBlock060">
        <div class="Car_HeaderStatValue">{{ car.acel || "-" }}</div>
        <div class="Car_HeaderStatLabel">0-60MPH</div>
      </div>
      <div class="Car_HeaderBlockHandling">
        <div class="Car_HeaderStatValue">{{ car.hand || "-" }}</div>
        <div class="Car_HeaderStatLabel">HANDLING</div>
      </div>
      <div class="Car_HeaderBlockDrive">
        <div class="Car_HeaderStatValue">{{ car.drive || "-" }}</div>
        <div class="Car_HeaderStatLabel">DRIVE</div>
      </div>
      <div :class="{
        Car_HeaderNameBig: car.name.length > 25,
        Car_HeaderNameBigBig: car.name.length > 32
        }" class="Car_HeaderName">{{ car.name }}</div>
      <div class="Car_HeaderTools">
        <button class="Car_HeaderButton">
          <div class="Car_DragIcon">
            <div v-for="n in 9" class="Car_DragDot" />
          </div>
        </button>
      </div>
    </div>
    <div class="Car_Body">
      <Row
        v-for="n in temp"
        :car="car"
        :temp="temp"
        :list="trackList"
        type="times" />
    </div>
  </div>
  <div v-else class="Car_Layout">
    <div class="Car_Header Car_AddHeader">
      <button class="Car_AddButton add" @click="$emit('add')">
        <i class="ticon-plus_2 Car_AddIcon" aria-hidden="true"/>
      </button>
    </div>
  </div>
</template>

<script>
import Row from './Row.vue'

export default {
  name: 'Car',
  components: {
    Row
  },
  props: {
    car: {
      type: Object,
      default() {
        return {}
      }
    },
    trackList: {
      type: Array,
      default() {
        return []
      }
    },
    temp: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      classes: ["F","E","D","C","B","A","S"],
      classesColors: ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFC717"]
      
      
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    resultClass() {
      let resultClass;
      let rq = this.car.rq;

      if (this.car.class) {
        resultClass = this.car.class;
      } else {
        if (rq < 20) resultClass = 0;
        else if (rq < 30) resultClass = 1;
        else if (rq < 40) resultClass = 2;
        else if (rq < 50) resultClass = 3;
        else if (rq < 65) resultClass = 4;
        else if (rq < 80) resultClass = 5;
        else resultClass = 6;
      }
      return resultClass;
    },
    carClass() {
      return this.classes[this.resultClass];
    },
    carClassColor() {
      return this.classesColors[this.resultClass];
    }
  },
  methods: {},
}
</script>

<style>
.Car_Layout {
  width: var(--cell-width);
  /* margin-right: 3px; */
}
.Car_Header {
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  height: calc(var(--top-height) - 6px);
  margin: 3px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 3px;
  z-index: 20;
  --card-stat-back-l: 10%;
  --card-stat-back-a: 0.2;
  --card-right-width: 20%;
  --card-left-width: 10%;
  --card-top-height: 15%;
  --card-left-height: 28%;
  --card-stat-div: 0%;
  --card-font-size: 12px;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );
  font-family: 'Roboto Condensed', sans-serif;
  /* background-color: #956363; */
  color: #eee;
  /* background-image: url(https://i.pinimg.com/564x/1b/70/f2/1b70f2da2803b5bae88e7e0d4edbfd28.jpg); */
  /* background-image: url(https://i2.wp.com/www.111racers.com/wp-content/uploads/2020/05/lts_elise_s3_sprint-220_01.jpg); */
  /* background-image: url(https://topdrives.club/sites/default/files/pl13/Aston_Martin_Rapide_Bertone_Jet_22_2013_427f.png); */
  background-color: #919191;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.06) 0, rgba(0, 0, 0, 0.06) 30px );
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0px -24px 28px -20px #000f;
  font-size: var(--card-font-size);
}
.Car_Header > * {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.Car_HeaderBlockTop {
  top: 0;
  left: 0;
  width: 100%;
  height: var(--card-top-height);
}
.Car_HeaderBlockBrand {
  top: 0;
  left: 0;
  width: var(--card-left-width);
  height: var(--card-top-height);
}
.Car_HeaderBlockYear {
  top: 0;
  right: 10%;
  width: calc(var(--card-right-width) - 10%);
  height: var(--card-top-height);
  font-size: 0.8em;
  text-align: center;
}
.Car_HeaderBlockCountry {
  top: 0;
  right: 0;
  width: 10%;
  height: var(--card-top-height);
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), 0.4);
}
.Car_HeaderBlockRQ {
  width: var(--card-left-width);
  height: var(--card-left-height);
  bottom: 0;
  left: 0;
  text-align: center;
  box-sizing: border-box;
  padding-top: 3%;
}
.Car_HeaderBlockClass {
  width: var(--card-left-width);
  height: 20%;
  left: 0;
  bottom: calc(var(--card-left-height) - 3%);
  text-align: center;
  font-weight: bold;
}
.Car_HeaderBlockTopSpeed {
  top: calc(var(--card-top-height) + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlock060 {
  top: calc(var(--card-top-height) + (var(--card-stat-height) + var(--card-stat-div)) * 1 + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlockHandling {
  top: calc(var(--card-top-height) + (var(--card-stat-height) + var(--card-stat-div)) * 2 + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlockDrive {
  top: calc(var(--card-top-height) + (var(--card-stat-height) + var(--card-stat-div)) * 3 + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderName {
  top: 0;
  /* left: var(--card-left-width); */
  left: 4px;
  /* width: calc( 100% - var(--card-left-width) - var(--card-right-width)); */
  width: calc( 100% - var(--card-right-width) - 3px);
  height: var(--card-top-height);
  font-size: 1.1em;
  line-height: 1;
}
.Car_HeaderNameBig {
  font-size: 0.9em;
}
.Car_HeaderNameBigBig {
  font-size: 0.7em;
}
.Car_HeaderBlockTires {
  flex-direction: row;
  gap: 0.3em;
  bottom: 2%;
  font-size: 0.7em;
  right: calc(var(--card-right-width) + 1%);
  font-weight: 300;
}
.Car_HeaderBlockStars {
  flex-direction: row;
  gap: 0.8em;
  font-size: 0.6em;
  bottom: 3%;
  left: calc(var(--card-left-width) + 2%);
  color: var(--class-color);
  filter: drop-shadow(0px 1px 1px #000c);
}
.Car_HeaderStatValue {
  text-align: right;
  font-size: 1.3em;
  font-weight: bold;
  line-height: 1.1;
  padding-right: 4px;
  color: #fff;
  opacity: 0.95;
}
.Car_HeaderStatLabel {
  text-align: right;
  font-size: 0.65em;
  line-height: 1;
  padding-right: 4px;
  font-weight: 300;
  color: #fff;
  opacity: 0.9;
}
.Car_HeaderRQValue {
  font-size: 1.3em;
  line-height: 1.1;
  font-weight: bold;
}
.Car_HeaderRQLabel {
  line-height: 1;
  font-size: 0.6em;
  color: var(--class-color);
  line-height: 1.2;
  transform: scaleX(1.7) skewX(-14deg);
}
.Car_HeaderClassBack {
  background-color: var(--class-color);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: skewY(9deg);
}
.Car_HeaderClassValue {
  position: relative;
  color: black;
  font-size: 1.5em;
}
.Car_HeaderBlockTopSpeed,
.Car_HeaderBlock060,
.Car_HeaderBlockHandling,
.Car_HeaderBlockDrive {
  box-shadow: 0px -2px 0px hsla(0, 100%, 100%, 0.09);
}

.Car_HeaderBlockTop,
.Car_HeaderBlockBrand,
.Car_HeaderBlockYear,
.Car_HeaderBlockTopSpeed,
.Car_HeaderBlock060,
.Car_HeaderBlockHandling,
.Car_HeaderBlockDrive {
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), var(--card-stat-back-a));
  backdrop-filter: blur(15px);
}
.Car_HeaderBlockRQ {
  background-color: hsla(30, 10%, 15%, 0.7);
  backdrop-filter: blur(15px);
}
.Car_NumberStars0 .Car_Star {
  opacity: 0.2;
}
.Car_NumberStars1 .Car_Star:not(:nth-child(1)) {
  opacity: 0.2;
}
.Car_NumberStars2 :nth-child(3) {
  opacity: 0.2;
}
.Car_AddHeader {
  background-image: none;
  background-color: transparent;
  box-shadow: none;
}
.Car_DragIcon {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  /* gap: 4px; */
}
.Car_DragDot {
  background-color: red;
  width: 100%;
  height: 100%;
}
.Car_HeaderButton {
  align-items: stretch;
}
</style>