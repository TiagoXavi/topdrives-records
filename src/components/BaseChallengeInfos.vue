<template>
  <div class="BaseChallengeInfos_Layout Main_DarkScrollMiniHorizontalScope" :style="`--rs: ${rs}px; --rsraw: ${rs};`">
    <div class="Main_DarkScrollMiniHorizontal_Sticky">
      <button class="Main_DarkScrollMiniHorizontal_Left D_Button" @click="$refs.scrollBoxCg.scrollBy({ left: -Vue.utils.windowWidth * 0.7, behavior: 'smooth' })">
        <i aria-hidden="true" class="ticon-arrow_left_3" />
      </button>
      <button class="Main_DarkScrollMiniHorizontal_Right D_Button" @click="$refs.scrollBoxCg.scrollBy({ left: Vue.utils.windowWidth * 0.7, behavior: 'smooth' })">
        <i aria-hidden="true" class="ticon-arrow_right_3" />
      </button>
    </div>
    <div ref="scrollBoxCg" id="BaseChallengeInfos_ScrollBox" class="BaseChallengeInfos_Box Main_DarkScroll Main_DarkScrollMiniHorizontal">
      <div
        v-for="(item, iT) in cg.info.rungPrizes"
        :class="``"
        class="BaseChallengeInfos_Item">
        <div class="BaseChallengeInfos_ItemInner">

          <div class="BaseChallengeInfos_Header">
            <div class="BaseChallengeInfos_HeaderLeft">{{ $tc("m_round", 1) }} {{ iT + 1 }}</div>
            <div class="BaseChallengeInfos_HeaderRight">
              <span class="Cg_RqRq"><i class="tdicon-rq" style="color: #05b2ec;" aria-hidden="true"/></span>
              <span>{{ cg.rounds[iT].rqLimit }}</span>
            </div>
          </div>

          <!-- Filter/criteria -->
          <div class="BaseChallengeInfos_FilterBox">
            <BaseFilterDescription
              :filter="cg.rounds[iT].filter"
              :user="{ mod: false }"
              :ready="false"
              :showTitle="false"
              class="BaseChallengeInfos_Filter"
            />
          </div>

          <!-- Spend to Play -->
          <div v-if="(cg.info.rungEligibility[iT] && cg.info.rungEligibility[iT][2]) || (cg.inventoryItemAmount && cg.inventoryItemConsumed)" class="BaseChallengeInfos_ItemsBox BaseChallengeInfos_ItemsRequired">
            <div class="BaseChallengeInfos_ItemsHeader BaseChallengeInfos_MiniTitle">Spend to Play</div>
            <div class="BaseChallengeInfos_ItemsBody">
              <div v-if="(cg.info.rungEligibility[iT] && cg.info.rungEligibility[iT][2])" class="BaseChallengeInfos_ItemSimple">
                <BaseItem :item="cg.info.rungEligibility[iT][0]" :size="36" />
                <div class="BaseChallengeInfos_ItemQty">x{{cg.info.rungEligibility[iT][1]}}</div>
              </div>
              <div v-if="(cg.inventoryItemAmount && cg.inventoryItemConsumed)" class="BaseChallengeInfos_ItemSimple">
                <BaseItem :item="cg.inventoryItemRequirement" :size="36" />
                <div class="BaseChallengeInfos_ItemQty">x{{cg.inventoryItemAmount}}</div>
              </div>
            </div>
          </div>

          <!-- Own to Play -->
          <div v-if="(cg.info.rungEligibility[iT] && !cg.info.rungEligibility[iT][2]) || (cg.info.inventoryItemAmount && !cg.info.inventoryItemConsumed && iT === 0)" class="BaseChallengeInfos_ItemsBox BaseChallengeInfos_ItemsRequired">
            <div class="BaseChallengeInfos_ItemsHeader BaseChallengeInfos_MiniTitle">Own to Play</div>
            <div class="BaseChallengeInfos_ItemsBody">
              <div v-if="(cg.info.rungEligibility[iT] && !cg.info.rungEligibility[iT][2])" class="BaseChallengeInfos_ItemSimple">
                <BaseItem :item="cg.info.rungEligibility[iT][0]" :size="36" />
                <div class="BaseChallengeInfos_ItemQty">x{{cg.info.rungEligibility[iT][1]}}</div>
              </div>
              <div v-if="(cg.info.inventoryItemAmount && !cg.info.inventoryItemConsumed && iT === 0)" class="BaseChallengeInfos_ItemSimple">
                <BaseItem :item="cg.info.inventoryItemRequirement.slice(0,8)" :size="36" />
                <div class="BaseChallengeInfos_ItemQty">x{{cg.info.inventoryItemAmount}}</div>
              </div>
            </div>
          </div>

          <!-- Stars division -->
          <div class="BaseChallengeInfos_DivisorLayout">
            <div class="BaseChallengeInfos_DivosorBox">
              <div class="BaseChallengeInfos_DivisorNumber BaseChallengeInfos_DivisorStar">{{ iT + 1 }}</div>
              <div class="BaseChallengeInfos_DivisorStar"><i aria-hidden="true" class="ticon-star" /></div>
              <div class="BaseChallengeInfos_DivisorStar"><i aria-hidden="true" class="ticon-star" /></div>
              <div class="BaseChallengeInfos_DivisorStar"><i aria-hidden="true" class="ticon-star" /></div>
            </div>
          </div>

          <!-- First Time Prize! -->
          <div class="BaseChallengeInfos_RewardBox">
            <div class="BaseChallengeInfos_RewardHeader">First Time Prize!</div>
            <div class="BaseChallengeInfos_RewardBody">
              <template v-for="reward in item">
                <div v-if="reward[0] === 2" class="BaseChallengeInfos_CurrencyItem BaseChallengeInfos_CurrencyGold">
                  <BaseIconSvg type="gold" :useMargin="false" class="BaseChallengeInfos_CurrencyIcon" />
                  <span>{{ reward[1] }}</span>
                </div>
                <div v-if="reward[0] === 1" class="BaseChallengeInfos_CurrencyItem BaseChallengeInfos_CurrencyCash">
                  <BaseIconSvg type="cash" :useMargin="false" class="BaseChallengeInfos_CurrencyIcon" />
                  <span>{{ reward[1] }}</span>
                </div>
                <div v-if="reward[0] === 6" class="BaseChallengeInfos_CurrencyItem BaseChallengeInfos_CurrencySlot">
                  <BaseIconSvg type="slot" :useMargin="false" class="BaseChallengeInfos_CurrencyIcon" />
                  <span>{{ reward[1] }}</span>
                </div>
                <div v-if="reward[0] === 3" class="BaseChallengeInfos_RewardItem BaseChallengeInfos_Car">
                  <BaseCard
                    :car="Vue.all_carsObj[Vue.ridByGuid[reward[1]]]"
                    :fix-back="false"
                    :options="false"
                    :hideClose="true"
                    :showResetTune="false"
                    :asGallery="true"
                    :noCompact="true"
                    :draggable="false"
                  />
                </div>
                <div v-if="reward[0] === 11" class="BaseChallengeInfos_RewardItem BaseChallengeInfos_Pack">
                  <BasePackBmp :pack="reward" class="BaseChallengeInfos_PackItem" style="position: relative; z-index: 1;" />
                </div>
              </template>
              <div v-if="item.filter(r => r[0] === 10).length" class="BaseChallengeInfos_RewardIconsBox BaseChallengeInfos_ItemsBox">
                <div class="BaseChallengeInfos_ItemsHeader BaseChallengeInfos_MiniTitle">Items</div>
                <div class="BaseChallengeInfos_ItemsBody">
                  <template v-for="reward in item.filter(r => r[0] === 10)">
                    <div class="BaseChallengeInfos_RewardItem">
                      <BaseItem :item="reward[1].slice(0,8)" :size="36" />
                      <div class="BaseChallengeInfos_ItemQty">x{{reward[3] || 1}}</div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Repeatable! -->
          <div v-if="item.filter(r => r[2] > 1).length" class="BaseChallengeInfos_RewardBox">
            <div class="BaseChallengeInfos_RewardHeader">Repeatable! (x{{item.filter(r => r[2] > 1)[0][2] - 1}})</div>
            <div class="BaseChallengeInfos_RewardBody">
              <template v-for="reward in item.filter(r => r[2] > 1)">
                <div v-if="reward[0] === 2" class="BaseChallengeInfos_CurrencyItem BaseChallengeInfos_CurrencyGold">
                  <BaseIconSvg type="gold" :useMargin="false" class="BaseChallengeInfos_CurrencyIcon" />
                  <span>{{ reward[1] }}</span>
                </div>
                <div v-if="reward[0] === 1" class="BaseChallengeInfos_CurrencyItem BaseChallengeInfos_CurrencyCash">
                  <BaseIconSvg type="cash" :useMargin="false" class="BaseChallengeInfos_CurrencyIcon" />
                  <span>{{ reward[1] }}</span>
                </div>
                <div v-if="reward[0] === 6" class="BaseChallengeInfos_CurrencyItem BaseChallengeInfos_CurrencySlot">
                  <BaseIconSvg type="slot" :useMargin="false" class="BaseChallengeInfos_CurrencyIcon" />
                  <span>{{ reward[1] }}</span>
                </div>
                <div v-if="reward[0] === 3" class="BaseChallengeInfos_RewardItem BaseChallengeInfos_Car">
                  <BaseCard
                    :car="Vue.all_carsObj[Vue.ridByGuid[reward[1]]]"
                    :fix-back="false"
                    :options="false"
                    :hideClose="true"
                    :showResetTune="false"
                    :asGallery="true"
                    :noCompact="true"
                    :draggable="false"
                  />
                </div>
                <div v-if="reward[0] === 11" class="BaseChallengeInfos_RewardItem BaseChallengeInfos_Pack">
                  <BasePackBmp :pack="reward" class="BaseChallengeInfos_PackItem" style="position: relative; z-index: 1;" />
                </div>
              </template>
              <div v-if="item.filter(r => r[0] === 10).filter(r => r[2] > 1).length" class="BaseChallengeInfos_RewardIconsBox BaseChallengeInfos_ItemsBox">
                <div class="BaseChallengeInfos_ItemsHeader BaseChallengeInfos_MiniTitle">Items</div>
                <div class="BaseChallengeInfos_ItemsBody">
                  <template v-for="reward in item.filter(r => r[0] === 10).filter(r => r[2] > 1)">
                    <div class="BaseChallengeInfos_RewardItem">
                      <BaseItem :item="reward[1].slice(0,8)" :size="36" />
                      <div class="BaseChallengeInfos_ItemQty">x{{reward[3] || 1}}</div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

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
import BaseFilterDescription from './BaseFilterDescription.vue';


export default {
  name: 'BaseChallengeInfos',
  components: {
    BasePackBmp,
    BaseItem,
    BaseIconSvg,
    BaseCard,
    BaseFilterDescription
  },
  props: {
    cg: {
      type: Object,
      default: () => ({})
    },
    rs: {
      type: Number,
      default: 260
    }
  },
  data() {
    return {
      Vue: Vue
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
  methods: {
    cardClick(rid) {
      Vue.globalRidFullDetail(rid);
    }
  },
}
</script>

<style>
.BaseChallengeInfos_Box {
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
.BaseChallengeInfos_Item {
  background: linear-gradient(0deg, #1ebbbd, #486c73);
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
.BaseChallengeInfos_Item:has(.BaseChallengeInfos_PackItem + .BaseChallengeInfos_CarsBox) {
  width: calc(0.73 * var(--rs));
  min-width: calc(0.73 * var(--rs));
}
.BaseChallengeInfos_Title {
  width: 100%;
  font-weight: bold;
  padding: calc(0.01 * var(--rs));
  box-sizing: border-box;
  font-size: calc(0.06 * var(--rs));
}
.BaseChallengeInfos_PackBox {
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
.BaseChallengeInfos_ItemsBox {
  width: 100%;
  display: flex;
  justify-content: center;
  background: linear-gradient(0deg, #001f2300, #001f23a6);
  padding: calc(0.01 * var(--rs)) 0px;
  flex-direction: column;
  padding: calc(0.015 * var(--rs)) calc(0.02 * var(--rs));
  box-sizing: border-box;
}
.BaseChallengeInfos_ItemsBody {
  display: flex;
  gap: calc(0.008 * var(--rs));
  align-items: center;
  justify-content: center;
}
.BaseChallengeInfos_ItemItem {
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
.BaseChallengeInfos_ItemInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(0deg, #24757d, #314254);
  width: 100%;
  flex-grow: 1;
  border-radius: calc(0.011 * var(--rs));
  color: white;
  font-weight: normal;
}

.BaseChallengeInfos_CurrencyBox {
  display: flex;
  width: 100%;
  height: calc(0.16 * var(--rs));
  font-size: calc(0.05 * var(--rs));
  flex-grow: 1;
}
.BaseChallengeInfos_CurrencyBox:empty {
  display: none;
}
.BaseChallengeInfos_CurrencyItem {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  color: hsl(var(--h), var(--s), var(--l));
  align-items: center;
  /* flex-basis: 0; */
  background: radial-gradient(ellipse 160% 190% at bottom right, hsl(var(--h), 23%, 27%) 0%, hsl(var(--h), 10%, 21%) 60%);
  font-weight: normal;
  padding: calc(0.03 * var(--rs)) 0;
  width: 80%;
  justify-self: center;
  border-radius: calc(0.015 * var(--rs));
  margin: calc(0.02 * var(--rs)) 0;
}
.BaseChallengeInfos_CurrencyIcon {
  width: calc(0.07 * var(--rs));
  height: calc(0.07 * var(--rs));
}
.BaseChallengeInfos_TicketsBox {
  font-size: calc(0.045 * var(--rs));
  padding: calc(0.01 * var(--rs));
  padding-bottom: calc(0.004 * var(--rs));
}
.BaseChallengeInfos_TicketsBox > i {
  margin-right: calc(0.01 * var(--rs));
}
.BaseChallengeInfos_PackTriangles {
  fill: hsl(var(--h), var(--s), var(--l));
  fill-opacity: 0.6;
}
.BaseChallengeInfos_Box::-webkit-scrollbar {
  height: 0px;
}
.BaseChallengeInfos_CarsBox {
  display: flex;
  gap: calc(0.01 * var(--rs));
  justify-content: center;
  align-items: center;
}
.BaseChallengeInfos_CarItem {
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
.BaseChallengeInfos_PackItem {
  --size: calc(0.33 * var(--rs)) !important;
}
.BaseChallengeInfos_PackItem + .BaseChallengeInfos_CarsBox .BaseChallengeInfos_CarItem {
  --width: calc(0.33 * var(--rs));
  --widthraw: calc(0.33 * var(--rsraw));
  --fsize: calc(0.017 * var(--rs));
}
.BaseChallengeInfos_PackItem:not(:last-child) {
  --size: calc(0.23 * var(--rs)) !important;
  margin-left: calc(-0.015 * var(--rs));
}
.BaseChallengeInfos_PackBoxTriple {
  flex-direction: column;
  gap: calc(0.01 * var(--rs));
  height: calc(0.47 * var(--rs));
}


.BaseChallengeInfos_CurrencyGold {
  --h: 40;
  --s: 97%;
  --l: 53%;
}
.BaseChallengeInfos_CurrencyCash {
  --h: 159;
  --s: 82%;
  --l: 57%;
}
.BaseChallengeInfos_CurrencyRenown {
  --h: 251;
  --s: 90%;
  --l: 75%;
}
.BaseChallengeInfos_CurrencySlot {
  --h: 19;
  --s: 52%;
  --l: 57%;
}


.BaseChallengeInfos_Header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0px calc(0.02 * var(--rs));
  box-sizing: border-box;
  align-items: center;
}
.BaseChallengeInfos_HeaderLeft {
  font-size: calc(0.045 * var(--rs));
  opacity: 0.5;
  color: #c4faff;
}
.BaseChallengeInfos_HeaderRight {
  display: flex;
  align-items: center;
  font-size: calc(0.045 * var(--rs));
}
.BaseChallengeInfos_ItemsRequired .BaseChallengeInfos_ItemSimple {
  display: flex;
  align-items: center;
}
.BaseChallengeInfos_FilterBox {
  margin-top: calc(0.01 * var(--rs));
  margin-bottom: calc(0.025 * var(--rs));
  width: 100%;
  padding: 0px calc(0.02 * var(--rs));
  box-sizing: border-box;
}
.BaseChallengeInfos_ItemInner:has(.BaseChallengeInfos_FilterBox + .BaseChallengeInfos_DivisorLayout) .BaseChallengeInfos_FilterBox {
  min-height: calc(0.14 * var(--rs));
  margin-top: calc(0.025 * var(--rs));
}
.BaseChallengeInfos_MiniTitle {
  font-size: calc(0.035 * var(--rs));
  /* margin-bottom: calc(0.015 * var(--rs)); */
  opacity: 0.5;
  color: #c4faff;
}
.BaseChallengeInfos_ItemQty {
  font-size: calc(0.045 * var(--rs));
}
.BaseChallengeInfos_RewardBox {
  width: 100%;
}
.BaseChallengeInfos_RewardItem {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.BaseChallengeInfos_RewardBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.BaseChallengeInfos_Pack {
  order: 2;
}
.BaseChallengeInfos_DivisorLayout + .BaseChallengeInfos_RewardBox .BaseChallengeInfos_RewardHeader {
  padding-top: calc(0.03 * var(--rs));
  margin-top: calc(0.05 * -1 * var(--rs));
}
.BaseChallengeInfos_RewardHeader {
  font-size: calc(0.04 * var(--rs));
  text-align: center;
  background-color: #1cced0;
  color: black;
  font-weight: 700;
  padding: calc(0.004 * var(--rs)) 0;
}
.BaseChallengeInfos_DivisorLayout {
  margin: calc(0.015 * var(--rs)) 0;
  z-index: 1;
}
.BaseChallengeInfos_DivosorBox {
  display: flex;
  align-items: center;
  gap: calc(0.01 * var(--rs));
  padding: calc(0.01 * var(--rs));
}
.BaseChallengeInfos_DivisorStar {
  width: calc(0.115 * var(--rs));
  height: calc(0.095 * var(--rs));
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #5d7f86;
  font-size: calc(0.045 * var(--rs));
  color: #a3b7bb;
}
.BaseChallengeInfos_DivisorNumber {
  background-color: #1e1e1e;
  font-size: calc(0.065 * var(--rs));
  color: white;
}




@media only screen and (min-width: 1201px) {
  .BaseChallengeInfos_Box {
    max-width: calc(var(--wBody) - 40px);
    /* background-color: #0000003b; */
    border-radius: 12px;
  }
}
</style>