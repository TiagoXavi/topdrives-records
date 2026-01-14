<template>
  <div
    :class="{
      Main_Compact: Vue.utils.windowWidth < 1200
    }"
    class="MainCars_Root">
    
    
    
    
    
    
    <div class="MainCars_Header">

      <div class="MainCars_HeaderControls">
        <button
          v-if="!Vue.garageObj.loaded"
          :class="{ D_Button_Loading: Vue.garageObj.loading }"
          class="D_Button D_ButtonDark D_ButtonTier4"
          @click="toggleMyGarage()"><i class="ticon-car D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_myGarage") }}</button>
        <BaseSwitch v-if="Vue.garageObj.loaded" :value="isGarage" :label="`${$t('m_myGarage')}`" :horizontal="false" @change="toggleMyGarage($event)" />
      </div>
      
    </div>





    <div class="MainCars_Body" :class="`MainCars_View${_Mcars.view}`">
      <RecycleScroller
        :items="_Mcars.cars"
        :item-size="carHeight"
        :buffer="Math.max(400, carHeight)"
        :key-field="isGarage ? 'cardRecordId' : 'rid'"
        listClass="Cg_DashWrapper"
        itemClass="Cg_DashScrollerItem"
        class="Main_DarkScroll"
        page-mode>
        <template v-slot="{ item, index, active }">
          <div
            :class="{ MainCars_CarSelected: false }"
            class="MainCars_CarItem">
            {{ item.rid }}
          </div>
        </template>
      </RecycleScroller>
    </div>




    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      :config="{
        tunes: true,
        garage: true
      }"
      style="z-index: 200;"
      importFilterName="MAINCARS_IMPORT"
      ref="mainCarsFiltRef"
      ridsMutationName="MAINCARS_RIDSMUT"
      @clearFilterUpdate="clearFilterRes($event)"
      @listRids="getListOfRids($event);"
    />




    
  </div>
</template>

<script>
import MainCarsDetail from "./MainCarsDetail.vue";
import BaseSwitch from "./BaseSwitch.vue";
import BaseFilterDialog from "./BaseFilterDialog.vue";
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'MainCars',
  components: {
    MainCarsDetail,
    BaseSwitch,
    BaseFilterDialog
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      T_S: tdrStore(),
      isGarage: false,
      filterDialog: false,
      filter: {}
    }
  },
  watch: {},
  created() {
    if (!this.T_S._Mcars) {
      this.T_S.$patch((state) => {
        state._Mcars = {
          cars: [],
          view: "list"
        }
      })
      this.loadCars();
    }
  },
  beforeMount() {},
  mounted() {},
  computed: {
    ...mapState(tdrStore, ["_Mcars"]),
    carHeight() {
      return 150;
    }
  },
  methods: {
    loadCars() {
      if (this.isGarage) return this.loadByGarage();

      let result = [];
      let hasFilter = Object.keys(this.filter).length > 0;

      if (!hasFilter) return this.T_S._Mcars.cars = Vue.all_carsArr;

      Vue.all_carsArr.map(car => {
        if (!this.matchFilter(car)) return;
        result.push(car);
      });
      
      this.T_S._Mcars.cars = result;
    },
    loadByGarage() {
      let keys = [];
      let isInvalid = Vue.garageObj.loaded === false;
      if (!isInvalid) {
        keys = Object.keys(Vue.garageByRid);
        isInvalid = keys.length === 0;
      }
      if (isInvalid) {
        this.$store.commit("DEFINE_SNACK", { active: true, error: true, text: "No garage", type: "error" });
        return;
      }
      let result = [];
      let hasFilter = Object.keys(this.filter).length > 0;

      keys.map(rid => {
        Vue.garageByRid[rid].map(gCar => {
          if (hasFilter) {
            if (!this.matchFilter(Vue.all_carsObj[gCar.rid], gCar)) return;
          }
          result.push(gCar);
        });
      });
      
      this.T_S._Mcars.cars = result;
    },
    matchFilter(car, hCar) {
      if (!this.$refs.mainCarsFiltRef.checkMatchFilter(car, hCar)) return false;
      return true;
    },
    clearFilterRes(filter) {

      this.filter = filter;
      this.loadCars();
      this.filterDialog = false;
    },
    getListOfRids(e) {

    },
    toggleMyGarage(value) {
      if (value !== undefined) window.localStorage.setItem("isGarage", JSON.stringify(value));
      if (!this.T_S._user || !this.T_S._user.hasGarage) {
        this.noGarageUploaded();
        return;
      }
      if (!Vue.garageObj.loaded) {
        Vue.loadGarage(this.T_S._user.username);
        let vm = this;
        let unwatch = vm.$watch('Vue.garageObj.loaded', (newValue, oldValue) => {
          console.log(`dynamicProperty changed from ${oldValue} to ${newValue}`);
          if (newValue === true) {
            vm.toggleMyGarage(true);
            unwatch();
          }
        });
        return;
      }
      if (Vue.garageObj.loaded) {
        // console.log("toggleMyGarage", value);
        this.isGarage = value;
        this.loadCars();
      }
    },
    noGarageUploaded() {
      let vm = this;

      let action = function() {
        vm.$router.push({ name: "BaseMyGarage" });
        vm.$store.commit("DEFINE_DIALOG", {
          active: false
        });
      }

      vm.$store.commit("DEFINE_DIALOG", {
        active: true,
        title: vm.$t('p_youNeedGarage'),
        actionLabel: vm.$t('m_uploadMyGarage'),
        cancelLabel: vm.$t('m_cancel'),
        actionColor: "green",
        maxWidth: "250px",
        minWidth: "240px",
        error: false,
        disabled: false,
        action: action,
        loading: false,
        maxWidth: "420px"
      });
    },
  },
}
</script>

<style>
</style>