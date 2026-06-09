<template>
  <div class="BaseRewards_Layout Main_DarkScrollMiniHorizontalScope" :style="`--rs: ${rs}px; --rsraw: ${rs};`">
    <div class="Main_DarkScrollMiniHorizontal_Sticky">
      <button class="Main_DarkScrollMiniHorizontal_Left D_Button" @click="$refs.scrollBox.scrollBy({ left: -Vue.utils.windowWidth * 0.7, behavior: 'smooth' })">
        <i aria-hidden="true" class="ticon-arrow_left_3" />
      </button>
      <button class="Main_DarkScrollMiniHorizontal_Right D_Button" @click="$refs.scrollBox.scrollBy({ left: Vue.utils.windowWidth * 0.7, behavior: 'smooth' })">
        <i aria-hidden="true" class="ticon-arrow_right_3" />
      </button>
    </div>
    <div ref="scrollBox" id="BaseRewards_ScrollBox" class="BaseRewards_Box Main_DarkScroll Main_DarkScrollMiniHorizontal">
      <div
        v-for="item in prizes"
        :key="item.people"
        :class="`BaseRewards_ItemTier${item.tier}`"
        class="BaseRewards_Item">
        <div class="BaseRewards_Title">
          <div class="BaseRewards_TitleText">Rank {{ item.people }}</div>
        </div>
        <div v-if="(item.pack || item.car) || ((!item.pack && !item.car) && (!item.items || item.items.length === 0))" class="BaseRewards_PackBox">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" class="BaseTrianglesBack_Layout">
            <rect width="100%" height="100%" mask="url(#triangleMask)" class="BaseRewards_PackTriangles" />
          </svg>
          <BasePackBmp v-if="item.pack" :pack="item.pack" class="BaseRewards_PackItem" style="position: relative; z-index: 1;" />
          <div v-if="item.car" class="BaseRewards_CarItem">
            <BaseCard
              :car="Vue.all_carsObj[item.car.rid]"
              :fix-back="false"
              :options="false"
              :hideClose="true"
              :showResetTune="false"
              :asGallery="true"
              :noCompact="true"
              :draggable="false"
            />
          </div>
        </div>
        <div v-if="item.items && item.items.length" class="BaseRewards_ItemsBox">
          <!-- <div class="BaseRewards_ItemsHeader"></div> -->
          <div class="BaseRewards_ItemsBody">
            <div v-for="it in item.items" class="BaseRewards_ItemItem">
              <BaseItem :item="it" :size="36" />
              <div class="BaseRewards_ItemQty">x{{it[1]}}</div>
            </div>
          </div>
        </div>
        <div class="BaseRewards_CurrencyBox">
          <div v-if="item.gold" class="BaseRewards_CurrencyItem BaseRewards_CurrencyGold">
            <BaseIconSvg type="gold" :useMargin="false" class="BaseRewards_CurrencyIcon" />
            <span>{{ item.gold }}</span>
          </div>
          <div v-if="item.cash" class="BaseRewards_CurrencyItem BaseRewards_CurrencyCash">
            <BaseIconSvg type="cash" :useMargin="false" class="BaseRewards_CurrencyIcon" />
            <span>{{ item.cash }}</span>
          </div>
          <div v-if="item.renown" class="BaseRewards_CurrencyItem BaseRewards_CurrencyRenown">
            <BaseIconSvg type="renown" :useMargin="false" class="BaseRewards_CurrencyIcon" />
            <span>{{ item.renown }}</span>
          </div>
        </div>
        <div class="BaseRewards_TicketsBox">
          <i class="ticon-ticket" aria-hidden="true" />
          <span>{{ item.tickets }} Tickets</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasePackBmp from './BasePackBmp.vue';
import BaseItem from './BaseItem.vue';
import BaseIconSvg from './BaseIconSvg.vue';
import BaseCard from './BaseCard.vue';

export default {
  name: 'BaseRewards',
  components: {
    BasePackBmp,
    BaseItem,
    BaseIconSvg,
    BaseCard
  },
  props: {
    prizes: {
      type: Array,
      default: () => []
    },
    tag: {
      type: String,
      default: "Daily Event"
    },
    rs: {
      type: Number,
      default: 260
    }
  },
  data() {
    return {
      Vue: Vue,
      rewardTiers: Object.freeze([
        { color: "#37EBAC" },
      ]),
      currencyTypes: Object.freeze({
        softCurrency1: { icon: "cash", color: "hsla(160, 100%, 50%, 1)" },
        hardCurrency1: { icon: "gold", color: "hsla(45, 100%, 50%, 1)" },
        hardCurrency2: { icon: "renown", color: "hsla(270, 100%, 50%, 1)" },
      })
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    prizesCalc() {
      return this.prizes;
    }
  },
  methods: {},
}
</script>

<style>
.BaseRewards_Box {
  display: flex;
  display: flex;
  flex-wrap: nowrap;
  gap: calc(0.04 * var(--rs));
  overflow-x: scroll;
  max-width: var(--wBody);
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  width: max-content;
}
.BaseRewards_Item {
  background-color: hsl(var(--h), var(--s), var(--l));
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(0.67 * var(--rs));
  min-width: calc(0.67 * var(--rs));
  padding: calc(0.01 * var(--rs));
  font-weight: bold;
  border-radius: calc(0.015 * var(--rs));
  min-height: calc(0.98 * var(--rs));
}
.BaseRewards_Item:has(.BaseRewards_PackItem + .BaseRewards_CarItem) {
  width: calc(0.73 * var(--rs));
  min-width: calc(0.73 * var(--rs));
}
.BaseRewards_Title {
  width: 100%;
  font-weight: bold;
  padding: calc(0.01 * var(--rs));
  box-sizing: border-box;
  font-size: calc(0.06 * var(--rs));
}
.BaseRewards_PackBox {
  width: 100%;
  display: flex;
  justify-content: center;
  background: radial-gradient(ellipse 110% 160% at left 25%, hsl(var(--h), 20%, 40%) 0%, hsl(var(--h), 40%, 10%) 100%);
  position: relative;
  box-shadow: inset 0px -25px 35px -30px, inset 0px 31px 25px -30px;
  align-items: center;
  height: calc(0.37 * var(--rs));
  gap: calc(0.01 * var(--rs));
}
.BaseRewards_ItemsBox {
  width: 100%;
  display: flex;
  justify-content: center;
  background: radial-gradient(ellipse 110% 220% at left, #2d2d2d 0%, #141414 140%);
  padding: calc(0.04 * var(--rs)) 0px;
  flex-grow: 1;
}
.BaseRewards_ItemsBody {
  display: flex;
  gap: calc(0.008 * var(--rs));
  align-items: center;
}
.BaseRewards_ItemItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(ellipse 110% 80% at center, #373737 0%, black 60%);
  color: #d9d9d9;
  padding: calc(0.02 * var(--rs)) calc(0.01 * var(--rs));
  border-radius: calc(0.02 * var(--rs));
  font-size: calc(0.045 * var(--rs));
  justify-content: center;
}

.BaseRewards_CurrencyBox {
  display: flex;
  width: 100%;
  height: calc(0.16 * var(--rs));
  font-size: calc(0.05 * var(--rs));
  flex-grow: 1;
}
.BaseRewards_CurrencyBox:empty {
  display: none;
}
.BaseRewards_CurrencyItem {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  color: hsl(var(--h), var(--s), var(--l));
  align-items: center;
  /* flex-basis: 0; */
  background: radial-gradient(ellipse 160% 190% at bottom right, hsl(var(--h), 10%, 37%) 0%, hsl(var(--h), 10%, 21%) 60%);
  font-weight: normal;
}
.BaseRewards_CurrencyIcon {
  width: calc(0.07 * var(--rs));
  height: calc(0.07 * var(--rs));
}
.BaseRewards_TicketsBox {
  font-size: calc(0.045 * var(--rs));
  padding: calc(0.01 * var(--rs));
  padding-bottom: calc(0.004 * var(--rs));
}
.BaseRewards_TicketsBox > i {
  margin-right: calc(0.01 * var(--rs));
}
.BaseRewards_PackTriangles {
  fill: hsl(var(--h), var(--s), var(--l));
  fill-opacity: 0.6;
}
.BaseRewards_Box::-webkit-scrollbar {
  height: 0px;
}
.BaseRewards_CarItem {
  --width: calc(0.5 * var(--rs));
  --widthraw: calc(0.5 * var(--rsraw));
  --fsize: calc(0.025 * var(--rs));
  --card-g-width: var(--width);
  --card-g-height: 142px;
  --card-g-heightraw: 111;
  --card-g-height: round(calc(var(--width) * ((415 / 256) - 1)), 1px);
  --card-g-heightraw: round(calc(var(--widthraw) * ((415 / 256) - 1)), 1);
  --card-g-font: var(--fsize);
}
.BaseRewards_PackItem {
  --size: calc(0.33 * var(--rs)) !important;
}
.BaseRewards_PackItem + .BaseRewards_CarItem {
  --width: calc(0.33 * var(--rs));
  --widthraw: calc(0.33 * var(--rsraw));
  --fsize: calc(0.017 * var(--rs));
}
.BaseRewards_PackItem:not(:last-child) {
  --size: calc(0.23 * var(--rs)) !important;
  margin-left: calc(-0.015 * var(--rs));
}


.BaseRewards_CurrencyGold {
  --h: 40;
  --s: 97%;
  --l: 53%;
}
.BaseRewards_CurrencyCash {
  --h: 159;
  --s: 82%;
  --l: 57%;
}
.BaseRewards_CurrencyRenown {
  --h: 251;
  --s: 90%;
  --l: 75%;
}
.BaseRewards_ItemTier0 {
  --h: 45;
  --s: 80%;
  --l: 68%;
  --s: 44%;
  --l: 55%;
}
.BaseRewards_ItemTier1 {
  --h: 199;
  --s: 35%;
  --l: 79%;
  --s: 21%;
  --l: 67%;
}
.BaseRewards_ItemTier2 {
  --h: 30;
  --s: 90%;
  --l: 70%;
  --s: 57%;
  --l: 60%;
}
.BaseRewards_ItemTier3,
.BaseRewards_ItemTier4 {
  --h: 182;
  --s: 60%;
  --l: 71%;
  --s: 28%;
  --l: 58%;
}
.BaseRewards_ItemTier5,
.BaseRewards_ItemTier6,
.BaseRewards_ItemTier7,
.BaseRewards_ItemTier8,
.BaseRewards_ItemTier9,
.BaseRewards_ItemTier10 {
  --h: 182;
  --s: 27%;
  --l: 58%;
  --s: 17%;
  --l: 48%;
}

@media only screen and (min-width: 1201px) {
  .BaseRewards_Box {
    max-width: calc(var(--wBody) - 40px);
    /* background-color: #0000003b; */
    border-radius: 12px;
  }
}
</style>