<template>
  <BaseDialog
    :active="active"
    :transparent="false"
    max-width="420px"
    min-width="240px"
    @close="$emit('close')">
    <div class="Main_TuneDialog">

      <div v-if="active" class="Row_DialogLayout">
        <div class="Row_DialogBody">
          <div class="Row_DialogCard">
            <div class="Row_DialogCardLeft">
              <BaseCard
                :car="car"
                :isDialogBox="true"
                :options="false" />
            </div>
          </div>
        </div>
        <div v-if="car.tags && car.tags.length > 0" class="Row_DialogCardTags" style="margin-top: 12px;">
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
              <div class="Row_DialogCardStatLabel">{{ $t("c_break") }}</div>
              <div class="Row_DialogCardStatValue">{{ car.brak || "?" }}</div>
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
import Row from './Row.vue'; // CSS
import Car from './Car.vue'; // CSS

export default {
  name: 'BaseCarDetailDialog',
  components: {
    BaseDialog,
    BaseCard,
    BaseGameTag
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
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
</style>