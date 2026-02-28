<template>
  <BaseDialog
    :active="active"
    :transparent="false"
    :style="`--class-color: ${carClassColor}; --fire-size: 140px;`"
    :useColor="true"
    :lazy="true"
    :disableScroll="true"
    :class="`BaseCarDetailFull_Car${car?.class}`"
    class="Global_CarDetailFull"
    max-width="460px"
    min-width="240px"
    @close="$emit('close')"
    @out="closed();">
    <div class="Main_TuneDialog BaseCarDetailFull_Layout">

      <div v-if="car && car.rid" class="BaseCarDetailFull_CarLayout">
        <div class="Row_DialogCard">
          <div class="Row_DialogCardLeft">
            <BaseCard
              :car="Vue.all_carsObj[car.rid]"
              :isDialogBox="true"
              :options="false"
              :customData="car.customData"
              :selectedTune="car.selectedTune"
              @color="getColor($event)"
            />
          </div>
        </div>
      </div>

      <div v-if="car && car.rid" class="BaseCarDetailFull_BodyLayout Main_DarkScroll Main_DarkScrollMini">

        <div v-if="car.tags && car.tags.length > 0" class="BaseCarDetailFull_TagsRoot">
          <div class="Row_DialogCardTags BaseCarDetailFull_Tags">
            <BaseGameTag
              v-for="tag in car.tags"
              :key="tag"
              :tag="tag"
            />
          </div>
        </div>

        <div v-if="showMove" class="Row_OrderBox">
          <div class="Row_OrderBoxLayout">
            <button
              v-if="tuneDialogCarIndex > -1"
              :disabled="tuneDialogCarIndex === 0"
              class="D_Button Row_DialogButtonTune"
              @click="cogMove()">
              <i class="ticon-arrow_left_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
            </button>
            <button
              v-if="tuneDialogCarIndex > -1"
              :disabled="tuneDialogCarIndex >= carDetailsList.length - 1"
              class="D_Button Row_DialogButtonTune"
              @click="cogMove(true)">
              <i class="ticon-arrow_right_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
            </button>
            <button
              :disabled="false"
              class="D_Button Row_DialogButtonTune Row_DialogButtonClose"
              @click="cogDelete()">
              <i class="ticon-trash Row_ConfigIconTrash" aria-hidden="true"/>
            </button>
          </div>
        </div>

        <div v-if="!medals && Vue.utils.loading" class="BaseCarDetailFull_Loading BaseCarDetailFull_NichesComum">
          <BaseContentLoader
            :contents="true"
            itemWidth="111px"
            :itemHeight="20"
            style="padding: 10px 10px 10px 20px; width: 100%;"
            type="bigBars"
            count="10"
          />
        </div>
        <div v-else-if="(!medals || !medals.Global) && !Vue.utils.loading" class="BaseCarDetailFull_NotFound BaseCarDetailFull_NichesComum">
          <i class="ticon-line BaseCarDetailFull_NotFoundLine" aria-hidden="true"/>
        </div>
        <div v-else class="BaseCarDetailFull_NichesComum">
          <div class="BaseCarDetailFull_ScoreDual Space_TopGiga">
            <div class="BaseCarDetailFull_ScoreHeader">
              <div class="BaseCarDetailFull_ScoreFire">
                <img
                  :src="anim || (car.prize && medals.total === 0) ? `/assets/fire.png` : `/assets/firestop.png`"
                  :class="{ BaseCarDetailFull_ScoreFireEmpty: car.prize && medals.total === 0 }"
                  class="BaseCarDetailFull_ScoreFireIconImg"
                />
              </div>
              <div class="BaseCarDetailFull_ScoreValue">{{ car.prize && medals.total === 0 ? '?' : medals.total }}</div>
            </div>

            <div v-if="medals.result?.mainNiches" class="BaseCarDetailFull_NichesBody">
              <div v-for="item in medals.result.mainNiches" class="BaseCarDetailFull_Niche">
                <div class="BaseCarDetailFull_NicheName" :class="{ BaseCarDetailFull_NicheNameSeats: item[0].includes('seat') }">{{ item[0] }}</div>
                <div class="BaseCarDetailFull_NicheValue">{{ Math.round(item[1]) }}</div>
                <div class="BaseCarDetailFull_NicheStars"><BaseStars :value="item[2]" /></div>
              </div>
            </div>
          </div>

          <div v-if="medals.result?.tracks" class="BaseCarDetailFull_TracksBody Space_TopGiga">
            <template v-for="(item, ix) in medals.result.tracks">
              <div v-if="(ix < 10 || medals.result.tracks[ix][1] === medals.result.tracks[9][1]) || showAllTracks" class="BaseCarDetailFull_Track BaseBestTune_HoverAction">
                <div class="BaseCarDetailFull_TrackValue">{{ Math.round(item[1]) }}</div>
                <div class="BaseCarDetailFull_TrackName"><BaseTrack :tracks="[item[0]]" :isFirst="ix===0" class="BaseCarDetailFull_TrackComp" /></div>
                <div v-if="cacheObj?.data" class="BaseCarDetailFull_TrackBestTune">
                  <!-- <BaseBestTune :dataObj="cacheObj.data" :track="item[0]" /> -->
                  <BaseBestTune
                    :tune="
                      ['332', '323', '233'].reduce((best, tune) => {
                        let time = cacheObj.data?.[tune]?.times?.[item[0]]?.t;
                        if (time && (!best || ( item[0].includes('testBowl') ? (time > best.time) : (time < best.time)))) {
                          return { time, tune };
                        }
                        return best;
                      }, null)?.tune || '-'
                    "
                  />
                </div>
                <div v-else class="BaseCarDetailFull_TrackBestTune" />
              </div>
            </template>
            <button
              v-if="medals.result.tracks.length > 0"
              style="margin-top: 10px;"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="exportToWorkspace($event)">{{ $t("m_useTrackList") }}</button>
          </div>
        </div>

        <div v-if="showTunes && !Vue.utils.loading" class="Row_DialogHeader Space_TopGiga">
          <button
            v-for="item in tuneDialogTunes"
            :class="{ Row_DialogButtonTuneActive: car.selectedTune === item }"
            :title="((((car.data || {})[item] || {}).info || {}).tuneCreator || {}).t"
            class="D_Button Row_DialogButtonTune Row_DialogButtonTuneRelative"
            @click="changeTuneCar(item)">
            {{ item }}
            <div v-if="tunesCount[item]" class="D_ButtonNote">{{ tunesCount[item] }}</div>
          </button>
        </div>
        
        <div v-if="!Vue.utils.loading" class="Row_DialogCardDual Space_TopGiga">
          <div class="Row_DialogCardBottom">
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">ABS</div>
              <div :class="{ Row_DialogCardStatCorrect: car.abs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ car.abs ? 'Yes' : 'No' }}</div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">TCS</div>
              <div :class="{ Row_DialogCardStatCorrect: car.tcs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ car.tcs ? 'Yes' : 'No' }}</div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $tc("c_clearance", 1) }}</div>
              <div class="Row_DialogCardStatValue">{{ $t(`c_${car.clearance.toLowerCase()}`) }}</div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">MRA ({{ $t("c_stock").toLowerCase() }})</div>
              <div class="Row_DialogCardStatValue">
                <span v-if="car.mra" style="margin-right: 7px;">{{ car.mra }}</span>
              </div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $t("c_weight") }} ({{ $t("c_stock").toLowerCase() }})</div>
              <div class="Row_DialogCardStatValue">{{ car.weight }}</div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $t("c_fuel") }}</div>
              <div class="Row_DialogCardStatValue">{{ $t(`c_${car.fuel.toLowerCase()}`) }}</div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $t("c_seats") }}</div>
              <div class="Row_DialogCardStatValue">{{ car.seats }}</div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $t("c_enginePos") }}</div>
              <div class="Row_DialogCardStatValue">{{ $t(`c_${car.engine.toLowerCase()}Engine`) }}</div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $t("c_bodyStyle") }}</div>
              <div class="Row_DialogCardStatValue">
                <template v-for="(body, index) in car.bodyTypes">
                  <template v-if="index !== 0">,&nbsp;</template>
                  <template>{{ $t(`c_${body.toLowerCase()}`) }}</template>
                </template>
              </div>
            </div>
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $t("c_brake") }}</div>
              <div
              :class="{ Row_DialogCardStatRed: car.brake === 'C', Row_DialogCardStatCorrect: car.brake === 'A' }"
              class="Row_DialogCardStatValue">{{ car.brake || "?" }}<BaseBrakeDialog /></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from './BaseDialog.vue';
import BaseCard from './BaseCard.vue';
import BaseGameTag from './BaseGameTag.vue';
import BaseBrakeDialog from './BaseBrakeDialog.vue';
import BaseContentLoader from './BaseContentLoader.vue';
import BaseStars from './BaseStars.vue';
import BaseTrack from './BaseTrack.vue';
import BaseBestTune from './BaseBestTune.vue';
import Row from './Row.vue'; // CSS
import Car from './Car.vue'; // CSS
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'BaseCarDetailFull',
  components: {
    BaseDialog,
    BaseCard,
    BaseGameTag,
    BaseBrakeDialog,
    BaseContentLoader,
    BaseStars,
    BaseTrack,
    BaseBestTune
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    car: {
      type: Object,
      default() {
        return {}
      }
    },
    tuneDialogCarIndex: {
      type: Number,
      default: 0
    },
    carDetailsList: {
      type: Array,
      default() {
        return []
      }
    },
    showMove: {
      type: Boolean,
      default: false
    },
    showTunes: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      Vue: Vue,
      carClassColor: null,
      medals: null,
      anim: true,
      cgWatchDownloadCache: null,
      cacheObj: null,
      showAllTracks: false
    }
  },
  watch: {},
  beforeMount() {
    if (this.active) {
      this.init();
    }
  },
  mounted() {},
  computed: {
    tuneDialogTunes() {
      if (!this.showTunes) return [];
      if (!this.car.rid) return [];

      let carWithData = Vue.all_cacheObj[this.car.rid]?.data;
      if (!carWithData) return [];

      let result = ["332", "323", "233"];
      if (carWithData && this.$store.state.showCustomTunes) {
        Object.keys( carWithData ).forEach(tune => {
          if (tune[0] !== "v" && !result.includes(tune)) {
            result.push(tune);
          }
        })
      };
      // if (this.tuneDialogCar.forceTune && !result.includes(this.tuneDialogCar.forceTune)) {
      //   result.push(this.tuneDialogCar.forceTune);
      // }

      if ((this.car.class === "S" || this.car.class === "A") && !result.includes("111")) result.push("111");

      if (this.mode === 'compare' && carWithData && this.$store.state.showDataFromPast) {
        Object.keys( carWithData ).forEach(tune => {
          if (tune[0] === "v") {
            result.push(tune);
          }
        })
      };
      return result;
    },
    tunesCount() {
      if (!this.showTunes) return {};
      if (!this.car.rid) return {};

      let carWithData = Vue.all_cacheObj[this.car.rid]?.data;
      if (!carWithData) return {};

      let result = {};
      this.tuneDialogTunes.map(tune => {
        if (carWithData[tune]) {
          if (carWithData[tune].times) {
            result[tune] = Object.keys(carWithData[tune].times).filter(key => carWithData[tune].times[key] && carWithData[tune].times[key].t !== 0).length;
          }
        }
      })
      return result;
    }
  },
  methods: {
    init() {
      if (this.car && this.car.rid) {
        Vue.getRMedals([this.car.rid], [], () => {

            let res = Vue.R_Medals[Vue.rn_to_rid.indexOf(this.car.rid)];
            this.medals = res;
            if (this.medals.Global) {
              console.log(this.medals.result.stars, this.medals);
              // console.log(this.medals.result.tracks);

              this.anim = this.medals.result.mainNiches.some(item => Math.round(item[2]) >= 5);

              if (this.medals.result?.tracks) {
                // this.loadTunesTimes();
                let result = Vue.timeCell(this.car.rid, "332", "kart_a00");
                if (result === "!data") {
                  if (!this.cgWatchDownloadCache) {
                    const vm = this;
                    vm.cgWatchDownloadCache = vm.$watch('Vue.utils.cacheLoading', (newValue, oldValue) => {
                      // console.log(`cgWatchDownloadCache changed from ${oldValue} to ${newValue}`);
                      if (newValue === false) {
                        // after debouce?
                        vm.cacheObj = Vue.all_cacheObj[vm.car.rid];
                      }
                    });
                  }
                  return false;
                } else {
                  this.cacheObj = Vue.all_cacheObj[this.car.rid];
                }
              }
            }

          },
          (error) => {
            console.error("Failed to get medals:", error);
          }
        );
      }
    },
    loadTunesTimes() {

    },
    getColor(color) {
      this.carClassColor = color;
      // console.log(color);
    },
    changeTuneCar(selectedTune) {
      if (selectedTune === this.car.selectedTune) {
        selectedTune = undefined
      }
      Vue.set(this.car, "selectedTune", selectedTune);
      this.$emit("changed");
      // this.$emit("tune", selectedTune);
    },
    cogMove(isRight) {
      let current = this.tuneDialogCarIndex;
      let neww = current + (isRight ? 1 : -1);
      let one = this.carDetailsList[current];
      let two = this.carDetailsList[neww];

      Vue.set(this.carDetailsList, current, two);
      Vue.set(this.carDetailsList, neww, one);
      // this.tuneDialogCarIndex = neww;
      this.$emit("newIndex", neww);
      // this.tuneDialogCar = this.carDetailsList[neww];
      this.$emit("changed");
    },
    cogDelete() {
      Vue.set(this.carDetailsList, this.tuneDialogCarIndex, {});
      this.$emit("changed");
      this.$emit("close");
    },
    closed() {
      this.medals = null;
    },
    exportToWorkspace(e) {
      if (e && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        this.showAllTracks = true;
        return;
      }

      let cars = ["332", "323", "233"].map(tune => {
        let car = {
          rid: this.car.rid,
          selectedTune: tune
        }
        return car;
      });
      

      let tracks = this.medals.result.tracks.filter((item, ix) => ix < 10 || item[1] === this.medals.result.tracks[9][1]).map(item => item[0]);



      tdrStore().mainParams = { cars, tracks, mode: "compare" };
      this.$router.push({ path: `/compare?t=${new Date().getTime()}` });
      this.$emit('close');
    },
  },
}
</script>

<style>
.Global_CarDetailFull {
  --fireFilter: unset;
}
.BaseCarDetailFull_CarA {
  --fireFilter: hue-rotate(194deg) saturate(16) brightness(1);
}
.BaseCarDetailFull_CarB {
  --fireFilter: hue-rotate(310deg) saturate(6);
}
.BaseCarDetailFull_CarC {
  --fireFilter: hue-rotate(9deg) saturate(2) brightness(1.2);
}
.BaseCarDetailFull_CarD {
  --fireFilter: hue-rotate(187deg) saturate(7) brightness(1);
}
.BaseCarDetailFull_CarE {
  --fireFilter: hue-rotate(58deg) saturate(0.8) brightness(1.2);
}
.BaseCarDetailFull_CarF {
  --fireFilter: saturate(0) brightness(0.9);
}
.Global_CarDetailFull.BaseDialog_UseColor .BaseDialog_Opaque {
  /* background-image: radial-gradient(ellipse 630px 230px at 0px -7px, var(--class-color) -305%, transparent 65%), radial-gradient(ellipse 5px 190px at 0px 66px, var(--class-color) 0%, transparent 35%); */
  background-image: radial-gradient(ellipse 590px 310px at 0px 193px, var(--class-color) -325%, transparent 75%), radial-gradient(ellipse 5px 350px at 0px 186px, var(--class-color) 0%, transparent 35%);
}
.BaseCarDetailFull_Layout {
  position: relative;
  display: flex;
  justify-content: center;
}
.Global_CarDetailFull,
.BaseCarDetailFull_Layout .Car_Header.Row_DialogCardCard {
  --width: 415px;
  --height: 256px;
  --card-font-size: 19px;
  --card-g-height: 256px;
  --card-g-heightraw: 256;
}
.BaseCarDetailFull_TagsRoot {
  display: flex;
  justify-content: center;
}
.BaseCarDetailFull_Tags {
  width: clamp(var(--width), var(--width), 100%);
}
.BaseCarDetailFull_Layout .Car_Header.Row_DialogCardCard {
  border-radius: 11px;
  box-shadow: 0px 34px 28px -24px #00000050, 0px -24px 28px -24px #00000066;
}
.BaseCarDetailFull_CarLayout {
  margin-top: calc(var(--height) * -1 + 50px);
  position: fixed;
  z-index: 1;
}
.BaseCarDetailFull_BodyLayout {
  overflow-y: scroll;
  height: calc(100vh - 270px);
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
  overscroll-behavior: contain;
  padding: 20px;
  padding-top: 65px;
  box-sizing: border-box;
  max-height: max-content;
}
.Global_CarDetailFull .BaseDialog_ForceNoScroll {
  margin-top: 230px;
  padding: 0px 20px;
  max-height: calc(100vh - 270px);
}
.BaseCarDetailFull_NichesComum {
  min-height: 230px;
}
.BaseCarDetailFull_ScoreDual {
  display: flex;
  min-height: 230px;
  align-items: center;
  justify-content: center;
}
.BaseCarDetailFull_ScoreHeader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  margin-top: 40px;
}
.BaseCarDetailFull_ScoreFire {
  position: absolute;
  display: flex;
  top: -91px;
  filter: var(--fireFilter);
}
.BaseCarDetailFull_ScoreValue {
  position: relative;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: bold;
  color: var(--d-back);
  font-size: 29px;
}
.BaseCarDetailFull_ScoreFireIconImg {
  height: var(--fire-size);
}
.BaseCarDetailFull_Niche {
  display: flex;
}
.BaseCarDetailFull_Niche .BaseStars_StarActive {
  color: var(--class-color);
}
.BaseCarDetailFull_Niche .BaseBestTune_T {
  background-color: var(--class-color);
}
.BaseCarDetailFull_CarF .BaseStars_StarActive {
  color: #aaa;
}
.BaseCarDetailFull_NicheName {
  white-space: nowrap;
  width: 130px;
  font-size: 0.8em;
  text-overflow: ellipsis;
  margin-right: 6px;
  text-align: right;
  flex-grow: 1;
  direction: rtl;
}
.BaseCarDetailFull_NicheValue {
  min-width: 25px;
  text-align: right;
  margin-right: 8px;
  font-size: 0.8em;
  opacity: 0.7;
}
.BaseCarDetailFull_NicheNameSeats {
  direction: ltr;
}
.BaseCarDetailFull_TracksBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.BaseCarDetailFull_Track {
  display: flex;
  align-items: center;
  gap: 15px;
}
.BaseCarDetailFull_TrackValue {
  text-align: right;
  font-size: 0.8em;
  width: 37px;
}
.BaseCarDetailFull_TrackComp {
  width: var(--left-width);
}
.BaseCarDetailFull_NotFound {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  opacity: 0.4;
}
.BaseCarDetailFull_Loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  width: 70%;
  padding-top: 20px;
  margin: 0 auto;
  padding-bottom: 50px;
}
.BaseCarDetailFull_TrackBestTune {
  width: 37px;
}
</style>