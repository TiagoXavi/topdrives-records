<template>
  <BaseDialog
    :active="active"
    :transparent="false"
    :style="`--class-color: ${carClassColor};`"
    :useColor="true"
    max-width="415px"
    min-width="240px"
    @close="$emit('close')">
    <div class="Main_TuneDialog BaseCarDetailDialog_Layout">

      <div v-if="car && car.rid" class="Row_DialogLayout">

        <div
          v-if="showMove"
          class="Row_OrderBox">
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

        <div v-if="showTunes" class="Row_DialogHeader" style="margin-bottom: 15px;">
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


        <div class="Row_DialogBody">
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
        <div v-if="car.tags && car.tags.length > 0" class="Row_DialogCardTags" style="margin-top: 18px;">
          <BaseGameTag
            v-for="tag in car.tags"
            :key="tag"
            :tag="tag" />
        </div>
        <div class="Row_DialogCardDual Space_TopPlus">
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
import Row from './Row.vue'; // CSS
import Car from './Car.vue'; // CSS

export default {
  name: 'BaseCarDetailDialog',
  components: {
    BaseDialog,
    BaseCard,
    BaseGameTag,
    BaseBrakeDialog
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
      carClassColor: null
    }
  },
  watch: {},
  beforeMount() {},
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
    getColor(color) {
      this.carClassColor = color;
      console.log(color);
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
    }
  },
}
</script>

<style>
.BaseCarDetailDialog_Layout .Car_Header.Row_DialogCardCard {
  --width: 415px;
  --height: 256px;
  --card-font-size: 19px;
  border-radius: 11px;
  box-shadow: 0px 34px 28px -24px #00000050, 0px -24px 28px -24px #00000066;
}
</style>