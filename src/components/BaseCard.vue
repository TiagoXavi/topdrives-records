<template>
  <div class="BaseCard_Layout">
    <div v-if="fixBack" class="BaseCard_FixBack" />
    <div
      class="Car_Header"
      :class="{ Row_DialogCardCard: !options }"
      :style="`--class-color: ${carClassColor}; ${carPhoto}`">
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
          <div class="Car_DragIcon">
            <div v-for="n in 9" class="Car_DragDot" />
          </div>
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
    <div
      :style="`--class-color: ${carClassColor}; ${carPhoto}`"
      class="Car_Header2">
      <span><b>[{{ car.rq }}]</b> {{ car.name }}</span>
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
      if (this.car.photo) {
        if (this.car.photo.includes("https://")) parsed = this.car.photo;
        else {
          parsed = require('@/imgs/' + this.car.photo);
        }
      }
      return parsed ? 'background-image: url('+parsed+');' : ''
    }
  },
  methods: {},
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
</style>