<template>
  <div
    :class="{
      Main_Compact: Vue.utils.windowWidth < 1200,
      MainCars_Big: _Mcars.width === 415
    }"
    :style="
      `--width: ${_Mcars.width}px;` +
      `--widthraw: ${_Mcars.width};` +
      `--aspect: ${_Mcars.aspect};` +
      `--fsize: ${_Mcars.fsize}px;` +
      `--blockWidth: ${blockWidth}px;`
    "
    class="MainCars_Root">





    <div class="MainCars_SearchBox">

      <div class="MainCars_SearchBoxInner">
        <input
          v-model="_Mcars.input"
          id="MainCars_SearchInput"
          :placeholder="$t('m_search')"
          class="D_SearchInput data-hj-allow"
          type="search"
          @focus="searchFocus = true;"
          @blur="searchBlur()"
          @input="searchInputFunc($event)">
        <button
          v-if="_Mcars.input && _Mcars.input.length > 0"
          class="D_Button D_SearchInputClose"
          @click="closeFilterText()">
          <i class="ticon-close_2" aria-hidden="true"/>
        </button>
      </div>
      <button
        class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
        @click="openFilter();">
        <span>Filters</span>
        <span v-if="filterCount > 0" class="Main_FiltersButtonCount">{{ filterCount }}</span>
      </button>


      <!-- <input
        v-model="_Mcars.input"
        :placeholder="$t('m_search')"
        class="D_SearchInput data-hj-allow"
        type="search"
        autocomplete="off"
        @keyup.enter="searchByText()">
      <div class="MainTimeline_HeaderMagnifierButtonBox">
        <button
          class="D_Button MainTimeline_HeaderMagnifierButton"
          @click="searchByText()">
          <i class="ticon-search_big" aria-hidden="true"/>
        </button>
      </div> -->

    </div>
    
    
    
    
    
    

    <div class="MainCars_HeaderControls">
      <button
        v-if="!Vue.garageObj.loaded"
        :class="{ D_Button_Loading: Vue.garageObj.loading }"
        class="D_Button D_ButtonDark D_ButtonTier4"
        @click="toggleMyGarage()"><i class="ticon-car D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_myGarage") }}</button>
      <BaseSwitch v-if="Vue.garageObj.loaded" :value="_Mcars.isGarage" :label="`${$t('m_myGarage')}`" :horizontal="false" @change="toggleMyGarage($event)" />
      <BaseSwitch v-model="_Mcars.showStatus" name="MainCars_ShowStats" :label="$t('m_statsView')" :horizontal="false" />
      <div class="Main_FilterChipsFlex" style="justify-content: flex-start; gap: 0px;">
        <template v-for="(item, ix) in sizes">
          <BaseChip
            :inputValue="_Mcars.width === item.width"
            class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small MainCars_SizeChip"
            :class="{ D_ButtonActive: _Mcars.width === item.width }"
            required="true"
            :value="item"
            @click="changeSize(item)">
            <span class="MainCars_SizeIcon" :style="`--size: ${item.width}px;`"></span>
          </BaseChip>
        </template>
      </div>
    </div>





    <div
      class="MainCars_Body"
      :class="`MainCars_View${_Mcars.view}`">
      <RecycleScroller
        :items="cars"
        :item-size="carHeight"
        :item-secondary-size="_Mcars.showStatus ? null : (_Mcars.width + 5)"
        :buffer="Math.max(400, carHeight)"
        :key-field="garageWorking ? 'cardRecordId' : 'rid'"
        :gridItems="_Mcars.showStatus ? 1 : Math.floor(Math.min(915, Vue.utils.windowWidth) / (_Mcars.width + 5))"
        listClass="Cg_DashWrapper"
        itemClass="Cg_DashScrollerItem"
        class="MainCars_BodyBox Main_DarkScroll"
        page-mode>
        <template v-slot="{ item, index, active }">
          <div
            :class="{ MainCars_CarSelected: false }"
            class="MainCars_CarItem">
            <div class="MainCars_CarLeft">
              <BaseCard
                :car="Vue.all_carsObj[item.rid]"
                :fix-back="false"
                :options="false"
                :hideClose="true"
                :showResetTune="false"
                :asGallery="true"
                :draggable="false"
                :selectedTune="_Mcars.isGarage ? (item.tun || item.tunZ) : null"
                :cgOppo="_Mcars.isGarage ? true : false"
              />
            </div>
            <div class="MainCars_CarRight"></div>
          </div>
        </template>
      </RecycleScroller>
    </div>




    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      :config="{
        tunes: true,
        garage: garageWorking
      }"
      :raceFilter="_Mcars.filter"
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
import BaseCard from "./BaseCard.vue";
import BaseChip from "./BaseChip.vue";
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'MainCars',
  components: {
    MainCarsDetail,
    BaseSwitch,
    BaseFilterDialog,
    BaseCard,
    BaseChip
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
      filterDialog: false,
      sizes: [
        { width: 200, aspect: '415 / 256', fsize: 10 },
        { width: 300, aspect: '415 / 256', fsize: 15 },
        { width: 415, aspect: '415 / 256', fsize: 20 },
      ],
      cars: [],
      debounceFilter: null,
      searchFocus: false,
      filterCount: 0
    }
  },
  watch: {
    'T_S._user'(newVal, oldVal) {
      Vue.tryLoadGarageFromStorage();
      if (this._Mcars.isGarage && this.T_S._user && this.T_S._user.hasGarage) {
        this.loadCars();
      }
    }
  },
  created() {
    if (!this.T_S._Mcars) {
      this.T_S.$patch((state) => {
        state._Mcars = {
          input: "",
          filter: {},
          view: "list",
          showStatus: true,
          isGarage: false,
          width: 300,
          aspect: '415 / 256',
          fsize: 15,
          sortMethod: 'rqDesc'
        }
      })
    }
  },
  beforeMount() {
    let MainCarsIsGarage = window.localStorage.getItem("MainCarsIsGarage");
    if (MainCarsIsGarage) {
      MainCarsIsGarage = JSON.parse(MainCarsIsGarage);
      this._Mcars.isGarage = MainCarsIsGarage;
    }
  },
  mounted() {
    this.debounceFilter = Vue.debounce(this.loadCars, 1500); 
    this.loadCars();
  },
  computed: {
    ...mapState(tdrStore, ["_Mcars", "_user"]),
    carHeight() {
      return this._Mcars.width / (415 / 256) + 5;
    },
    blockWidth() {
      if (this._Mcars.showStatus) {
        return Math.min(915, Vue.utils.windowWidth) - 20;
      } else {
        return (this._Mcars.width + 5) * Math.floor(Math.min(915, Vue.utils.windowWidth) / (this._Mcars.width + 5)) - 5;
      }
    },
    garageWorking() {
      return this._Mcars.isGarage && this.T_S._user && this.T_S._user.hasGarage && Vue.garageObj.loaded;
    }
  },
  methods: {
    loadCars() {
      Vue.tryLoadGarageFromStorage();
      if (this._Mcars.isGarage) {
        if (!this.T_S._user || !this.T_S._user.hasGarage) {
          return;
        }
        if (Vue.garageObj.loaded) {
          return this.loadByGarage();
        }
      }

      let result = [];
      let hasFilter = Object.keys(this._Mcars.filter).length > 0;

      if (!hasFilter) return this.cars = Vue.all_carsArr;

      Vue.all_carsArr.map(car => {
        if (!this.matchFilter(car)) return;
        result.push(car);
      });
      
      this.cars = result;
      // no sort needed
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
      let hasFilter = Object.keys(this._Mcars.filter).length > 0;

      keys.map(rid => {
        Vue.garageByRid[rid].map(gCar => {
          if (hasFilter) {
            if (!this.matchFilter(Vue.all_carsObj[gCar.rid], gCar)) return;
          }
          result.push(gCar);
        });
      });
      
      this.cars = result;
      this.sortCars();
    },
    matchFilter(car, hCar) {
      if (!this.$refs.mainCarsFiltRef.checkMatchFilter(car, hCar)) return false;
      return true;
    },
    sortCars() {
      if (this._Mcars.sortMethod === 'rqDesc') { // default
        this.cars.sort(this.resolveDraw);
        return;
      }
      if (this._Mcars.sortMethod === 'rqAsc') {
        this.cars.sort((a,b) => {
          if (Vue.all_carsObj[a.rid]?.rq !== Vue.all_carsObj[b.rid]?.rq) {
            return Vue.all_carsObj[a.rid]?.rq - Vue.all_carsObj[b.rid]?.rq;
          }
          return this.resolveDraw(a,b);
        });
        return;
      }
    },
    resolveDraw(a,b) {
      if (Vue.all_carsObj[a.rid]?.rq === Vue.all_carsObj[b.rid]?.rq) {
        return (Vue.all_carsObj[b.rid]?.name || "").localeCompare(Vue.all_carsObj[a.rid]?.name);
      } else {
        return Vue.all_carsObj[b.rid]?.rq - Vue.all_carsObj[a.rid]?.rq;
      }
    },
    clearFilterRes(filter) {
      this._Mcars.filter = filter;
      this.loadCars();
      this.filterDialog = false;
    },
    getListOfRids(e) {

    },
    toggleMyGarage(value) {
      if (value !== undefined) window.localStorage.setItem("MainCarsIsGarage", JSON.stringify(value));
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
        this._Mcars.isGarage = value;
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
    changeSize(item) {
      this._Mcars.width = item.width;
      this._Mcars.aspect = item.aspect;
      this._Mcars.fsize = item.fsize;
    },
    searchByText() {
      this._Mcars.input = this._Mcars.input.trim();
      this.loadCars();
    },
    searchInputFunc(e) {
      this.debounceFilter();
    },
    searchBlur() {
      setTimeout(() => {
        this.searchFocus = false;
      }, 200);
    },
    openFilter() {
      this.filterDialog = true;
    }
  },
}
</script>

<style>
.MainCars_Root {
  padding: 40px 0;
}
.MainCars_SearchBox {
  display: flex;
  position: relative;
  /* width: var(--blockWidth); */
  width: 910px;
  margin-left: auto;
  margin-right: auto;
}
.MainCars_SearchBox .Main_FiltersButton {
  border-bottom-right-radius: 10px;
}
.MainCars_SearchBoxInner {
  position: relative;
  flex-grow: 10;
}
.MainCars_Body {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}
.MainCars_BodyBox {
  width: var(--blockWidth);
}
.MainCars_CarLeft {
  --card-g-width: var(--width);
  --card-g-height: 142px;
  --card-g-heightraw: 111;
  --card-g-height: round(calc(var(--width) * ((415 / 256) - 1)), 1px);
  --card-g-heightraw: round(calc(var(--widthraw) * ((415 / 256) - 1)), 1);
  --card-g-font: var(--fsize);
}
.MainCars_Big .MainCars_CarLeft {
  --card-g-width: var(--width);
  --card-g-height: 256px;
  --card-g-heightraw: 256;
}
.MainCars_Big .Car_Header {
  border-radius: 11px;
}
.MainCars_SizeIcon {
  display: flex;
  width: calc(var(--size) * 0.05 + 5px);
  height: calc(var(--size) * 0.03 + 5px);
  background-color: rgba(255, 255, 255, 0.1);
}
.MainCars_SizeChip {
  --back-opac: 0.0;
  background-color: #0000;
}
.MainCars_HeaderControls {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  max-width: calc(var(--cell-width) * 5);
  margin: 0 auto;
  margin-top: 25px;
}
.MainCars_HeaderControls > * {
  min-width: 60px;
}
.MainTimeline_HeaderMagnifierButtonBox {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  width: 44px;
}
.MainTimeline_HeaderMagnifierButton {
  font-size: 22px;
  width: 100%;
}
</style>