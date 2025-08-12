<template>
  <div class="BaseCarList_SpecificCar">
    <div class="BaseCarList_CarsList" :class="{ BaseCarList_CarsListEmpty: list.length === 0 }">

      <template v-for="(rid, index) in list">
        <button
          class="D_Button D_ButtonDark D_ButtonDark2 BaseCarList_CarButton"
          @click="removeCar(index)">
          <div class="BaseCarList_CarCard" :style="`--color: ${ Vue.all_carsObj[rid].color}`">
            <div class="BaseCarList_BankPhoto">
              <img :src="Vue.all_carsObj[rid].photo" class="BaseCarList_BankPhotoImg" loading="lazy" alt="">
            </div>
            <div class="BaseCarList_RQ">{{ Vue.all_carsObj[rid].rq }}</div>
          </div>
        </button>
      </template>
      <div class="BaseCarList_AddCarBox">
        <button
          class="D_Button D_ButtonDark BaseCarList_SearchCarButton"
          @click="openDialog()">
          <i class="ticon-plus_2 BaseCarList_AddIcon" aria-hidden="true"/>
          <div v-if="list.length === 0" class="BaseCarList_AddLabel" style="margin-left: 5px;">{{ $t("m_searchCar") }}</div>
        </button>
      </div>
    </div>

    
    <!-- Select car -->
    <BaseFilterDialog
      v-model="searchFilterDialog"
      :lastestList="lastestList"
      :highlightsUsers="highlightsUsers"
      :sortEnabled="true"
      :enableCounters="true"
      :forceNonPrize="forceNonPrize"
      :raceFilter="genericCarPickerFilter"
      type="carPicker"
      @addCar="addCar($event)"
    />
  </div>
</template>

<script>
import BaseFilterDialog from './BaseFilterDialog.vue'

export default {
  name: 'BaseCarList',
  components: {
    BaseFilterDialog
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    lastestList: {
      type: Array,
      default() {
        return []
      }
    },
    highlightsUsers: {
      type: Object,
      default() {
        return {}
      }
    },
    filterToImport: {
      type: Object,
      default() {
        return {}
      }
    },
    forceNonPrize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      searchFilterDialog: false,
      genericCarPickerFilter: {},
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    openDialog() {
      this.genericCarPickerFilter = JSON.parse(JSON.stringify(this.filterToImport));
      this.searchFilterDialog = true;
    },
    addCar(newCar) {
      if (this.list.includes(newCar.rid)) return;
      this.list.push(newCar.rid);
    },
    removeCar(indexToRemove) {
      this.list.splice(indexToRemove, 1);
    },
  },
}
</script>

<style>
.BaseCarList_CarsList {
  max-width: 600px;
  min-height: 120px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  background-color: rgba(0,0,0,.1);
  padding: 10px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px;
}
.BaseCarList_CarsListEmpty {
  justify-content: center;
  align-items: center;
}
.BaseCarList_CarCard {
  position: relative;
}
.BaseCarList_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.BaseCarList_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.BaseCarList_RQ {
  display: flex;
  color: #000;
  background-color: var(--color);
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
  font-size: 15px;
}
.BaseCarList_SearchCarButton {
  height: 46px;
}
.D_Button.BaseCarList_CarButton {
  padding: 2px;
}
</style>