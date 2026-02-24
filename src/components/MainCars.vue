<template>
  <div
    :class="{
      Main_Compact: false && Vue.utils.windowWidth < 1200,
      MainCars_Big: _Mcars.width === 415,
      MainCars_Viewlist: _Mcars.showStats,
      MainCars_SortDesc: _Mcars.sortDesc,
      [`MainCars_Hover_${columns[indexHover]?.type}`]: indexHover !== -1
    }"
    :style="
      `--width: ${_Mcars.width}px;` +
      `--widthraw: ${_Mcars.width};` +
      `--aspect: ${_Mcars.aspect};` +
      `--fsize: ${_Mcars.fsize}px;` +
      `--blockWidth: ${blockWidth}px;` +
      `--statsWidth: ${statsWidth}`
    "
    class="MainCars_Root">





    <div class="MainCars_SearchBox MainCars_StickyListView">

      <div class="MainCars_StickyListBox">
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
          <span v-if="Object.keys(this._Mcars.filter).length > 0" class="Main_FiltersButtonCount">{{ Object.keys(this._Mcars.filter).length }}</span>
        </button>
      </div>

    </div>
    
    
    
    
    
    

    <div class="MainCars_HeaderControls MainCars_StickyListView">
      <div class="MainCars_StickyListBox">
        <button
          v-if="!Vue.garageObj.loaded"
          :class="{ D_Button_Loading: Vue.garageObj.loading }"
          class="D_Button D_ButtonDark D_ButtonTier4"
          @click="toggleMyGarage()"><i class="ticon-car D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_myGarage") }}</button>
        <BaseSwitch v-if="Vue.garageObj.loaded" :value="_Mcars.isGarage" :label="`${$t('m_myGarage')}`" :horizontal="false" @change="toggleMyGarage($event)" />
        <BaseSwitch :value="_Mcars.showStats" name="MainCars_ShowStats" :label="$t('m_statsView')" :horizontal="false" @change="toggleListView($event)" />

        <!-- <BaseSwitch v-if="Vue.utils.windowWidth > 1075" v-model="_Mcars.expanded" :disabled="_Mcars.showStats" name="MainCars_ShowExpanded" :label="$t('m_expanded')" :horizontal="false" /> -->
        <!-- <BaseSwitch  v-model="_Mcars.expanded" :disabled="_Mcars.showStats" name="MainCars_ShowExpanded" :label="$t('m_expanded')" :horizontal="false" /> -->

        <div class="Main_FilterChipsFlex" style="justify-content: flex-start; gap: 0px;">
          <BaseChip
            v-if="Vue.utils.windowWidth > 1075"
            :inputValue="_Mcars.expanded"
            :disabled="_Mcars.showStats"
            class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small MainCars_SizeChip MainCars_WidthChip"
            :class="{ D_ButtonActive: _Mcars.expanded && !_Mcars.showStats }"
            activeClass=""
            key="MainCars_WidthChip"
            required="true"
            :value="true"
            @click="_Mcars.expanded = !_Mcars.expanded; debounceChangedLong();">
            <i class="ticon-left_right_1" style="font-size: 24px; color: rgba(255, 255, 255, 0.2);" aria-hidden="true"/>
          </BaseChip>
          <template v-for="(item, ix) in sizes">
            <BaseChip
              :disabled="item.width === 68 && !_Mcars.showStats"
              :inputValue="_Mcars.width === item.width"
              class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small MainCars_SizeChip"
              :class="{ D_ButtonActive: _Mcars.width === item.width }"
              required="true"
              :value="item"
              :key="`MainCars_Size_${item.width}`"
              @click="changeSize(item)">
              <span class="MainCars_SizeIcon" :style="`--size: ${item.width}px;`"></span>
            </BaseChip>
          </template>
        </div>
        <div class="MainCars_SortBox">
          <BaseSelectNew
            :value="_Mcars.sortMethod"
            :list="sortListResolved"
            :label="$t('m_sort')"
            :itemLabel="(item) => $tc(`c_${item}`, 1)"
            :dialogConfig="{ maxWidth: '250px' }"
            name="MainCars_SortSelect"
            class="D_ButtonDark4 MainCars_SortSelect"
            @change="_Mcars.sortMethod = $event; sortCars(); debounceChangedLong();">
            <span>{{ $tc(`c_${_Mcars.sortMethod}`, 1) }}</span>
          </BaseSelectNew>
          <button
            class="D_Button D_ButtonDark4 MainCars_SortDescButton"
            @click="_Mcars.sortDesc = !_Mcars.sortDesc; sortCars(); debounceChangedLong();">
            <i :class="{ 'ticon-sort_crescent': !_Mcars.sortDesc, 'ticon-sort_decrescent': _Mcars.sortDesc }" aria-hidden="true"/>
          </button>
        </div>
        <div class="MainCars_SortBox">
          <BaseSelectNew
            :disabled="!_Mcars.showStats"
            :value="{}"
            :list="_Mcars.cols"
            :label="$tc('m_column', 2)"
            :itemLabel="(item) => $tc(`c_${item}`, 1)"
            :checks="true"
            :dialogConfig="{ maxWidth: '250px' }"
            class="D_ButtonDark4">
            {{ Object.values(_Mcars.cols).filter(x => x).length }}
          </BaseSelectNew>
        </div>
      </div>
    </div>


    <div v-if="_Mcars.showStats" class="MainCars_ColumnHeaders MainCars_Body">
      <div class="MainCars_ColumnHeadersBox MainCars_BodyBoxStats">
        <div class="MainCars_ColumnLeftSpace" style="background-color: transparent; height: 1px;"></div>
        <template v-for="column in columns">
          <!-- remove _c_ -->
          <div
            v-if="_Mcars.cols[column.type] && (garageWorking || !column.isGarage)"
            :key="column.type"
            :style="`--w: ${column.w}em`"
            :class="`MainCars_c_${column.type} ${_Mcars.sortMethod === column.type ? 'MainCars_ColumnActive' : ''}`"
            class="MainCars_Column MainCars_St"
            role="button"
            @click="sortClick(column.type)">
            <div v-if="column.type === 'R_Medals_score'" class="MainCars_FireIcon">
              <img
                :src="_Mcars.sortMethod === column.type ? `/assets/fire100.png` : `/assets/fire100stop.png`"
                class="MainCars_FireIconImg"
              />
            </div>
            <span v-else class="MainCars_ColumnHeaderTxt">{{ column.nick }}</span>
          </div>
        </template>
      </div>
    </div>


    <!-- get mouseout event only from MainCars_HoverBox div, not childs -->
    <div
      v-if="viewFix"
      class="MainCars_Body">
      <div
        class="MainCars_HoverBox"
        @mouseover="hoverHandle($event)"
        @mouseleave.self="hoverHandle($event, true)">
        <RecycleScroller
          :items="cars"
          :item-size="Math.ceil(carHeight)"
          :item-secondary-size="_Mcars.showStats ? null : (Math.ceil(_Mcars.width) + 6)"
          :buffer="Math.max(400, carHeight)"
          :key-field="garageWorking ? 'cardRecordId' : 'rid'"
          :gridItems="_Mcars.showStats ? undefined : this.wCalc"
          listClass="MainCars_Wrapper"
          itemClass="MainCars_ScrollerItem"
          :class="_Mcars.showStats ? 'MainCars_BodyBoxStats' : 'MainCars_BodyBox'"
          class="Main_DarkScroll"
          page-mode>
          <template v-slot="{ item, index, active }">
            <div
              :class="{ MainCars_CarSelected: false }"
              class="MainCars_CarItem">
              <button
                class="D_Button MainCars_CarLeft D_Button_NoHover"
                @click="cardClick(item)">
                <BaseCardMini
                  v-if="_Mcars.width === 68"
                  :car="Vue.all_carsObj[item.rid]"
                  :tuneText="_Mcars.isGarage ? (item.tun || item.tunZ) : null"
                  style="min-width: 68px;"
                />
                <BaseCard
                  v-else
                  :car="Vue.all_carsObj[item.rid]"
                  :fix-back="false"
                  :options="false"
                  :hideClose="true"
                  :showResetTune="false"
                  :asGallery="true"
                  :draggable="false"
                  :selectedTune="_Mcars.isGarage ? (item.tun || item.tunZ) : null"
                  :cgOppo="_Mcars.isGarage ? true : false"
                  :forceStats="_Mcars.isGarage && (item.tun || item.tunZ) && !Vue.all_cacheObj[item.rid]?.data"
                />
              </button>
              <div v-if="_Mcars.showStats" class="MainCars_CarRight">
                <div v-if="_Mcars.cols.R_Medals_score" :style="`--w: ${columnObj.R_Medals_score.w}em`" class="MainCars_St MainCars_c_R_Medals_score">{{ Vue.all_carsObj[item.rid].R_Medals_score }}</div>

                <div v-if="_Mcars.cols.races && garageWorking" :style="`--w: ${columnObj.races.w}em`" class="MainCars_St MainCars_c_races">{{ item.races }}</div>
                <div v-if="_Mcars.cols.winRate && garageWorking" :style="`--w: ${columnObj.winRate.w}em`" class="MainCars_St MainCars_c_winRate">{{ item.winRate ? Math.round(item.winRate * 100) + "%" : 'N/A' }}</div>
                <div v-if="_Mcars.cols.days && garageWorking" :style="`--w: ${columnObj.days.w}em`" class="MainCars_St MainCars_c_days">{{ Math.round(item.days) }}</div>

                <div v-if="_Mcars.cols.topSpeed" :style="`--w: ${columnObj.topSpeed.w}em`" class="MainCars_St MainCars_c_topSpeed">{{ Vue.all_carsObj[item.rid].topSpeed }}</div>
                <div v-if="_Mcars.cols.acel" :style="`--w: ${columnObj.acel.w}em`" class="MainCars_St MainCars_c_acel">{{ Vue.all_carsObj[item.rid].acel ? Vue.all_carsObj[item.rid].acel.toFixed(1) : 'N/A' }}</div>
                <div v-if="_Mcars.cols.hand" :style="`--w: ${columnObj.hand.w}em`" class="MainCars_St MainCars_c_hand">{{ Vue.all_carsObj[item.rid].hand }}</div>
                <div v-if="_Mcars.cols.mra" :style="`--w: ${columnObj.mra.w}em`" class="MainCars_St MainCars_c_mra">{{ Vue.all_carsObj[item.rid].mra ? Vue.all_carsObj[item.rid].mra.toFixed(2) : "-" }}</div>
                <div v-if="_Mcars.cols.weight" :style="`--w: ${columnObj.weight.w}em`" class="MainCars_St MainCars_c_weight">{{ Vue.all_carsObj[item.rid].weight }}</div>
                <div v-if="_Mcars.cols.year" :style="`--w: ${columnObj.year.w}em`" class="MainCars_St MainCars_c_year">{{ Vue.all_carsObj[item.rid].year }}</div>

                <div v-if="_Mcars.cols.abs" :style="`--w: ${columnObj.abs.w}em`" :class="{ Row_DialogCardStatCorrect: Vue.all_carsObj[item.rid].abs }" class="MainCars_St MainCars_c_abs Row_DialogCardStatRed">{{ Vue.all_carsObj[item.rid].abs ? 'Yes' : 'No' }}</div>
                <div v-if="_Mcars.cols.tcs" :style="`--w: ${columnObj.tcs.w}em`" :class="{ Row_DialogCardStatCorrect: Vue.all_carsObj[item.rid].tcs }" class="MainCars_St MainCars_c_tcs Row_DialogCardStatRed">{{ Vue.all_carsObj[item.rid].tcs ? 'Yes' : 'No' }}</div>
                <div v-if="_Mcars.cols.clearance" :style="`--w: ${columnObj.clearance.w}em`" class="MainCars_St MainCars_c_clearance">{{ $t(`c_${Vue.all_carsObj[item.rid].clearance.toLowerCase()}`) }}</div>
                <div v-if="_Mcars.cols.fuel" :style="`--w: ${columnObj.fuel.w}em`" class="MainCars_St MainCars_c_fuel">{{ $t(`c_${Vue.all_carsObj[item.rid].fuel.toLowerCase()}`) }}</div>
                <div v-if="_Mcars.cols.seats" :style="`--w: ${columnObj.seats.w}em`" class="MainCars_St MainCars_c_seats">{{ Vue.all_carsObj[item.rid].seats }}</div>
                <div v-if="_Mcars.cols.engine" :style="`--w: ${columnObj.engine.w}em`" class="MainCars_St MainCars_c_engine">{{ $t(`c_${Vue.all_carsObj[item.rid].engine.toLowerCase()}Engine`) }}</div>
                <div v-if="_Mcars.cols.bodyType" :style="`--w: ${columnObj.bodyType.w}em`" class="MainCars_St MainCars_c_bodyType">
                  <template v-for="(body, index) in Vue.all_carsObj[item.rid].bodyTypes">
                    <template v-if="index !== 0">, </template>
                    <template>{{ $t(`c_${body.toLowerCase()}`) }}</template>
                  </template>
                </div>
                <div
                  v-if="_Mcars.cols.brake"
                  :style="`--w: ${columnObj.brake.w}em`"
                  :class="{ Row_DialogCardStatRed: Vue.all_carsObj[item.rid].brake === 'C', Row_DialogCardStatCorrect: Vue.all_carsObj[item.rid].brake === 'A' }"
                  class="MainCars_St MainCars_c_brake">{{ Vue.all_carsObj[item.rid].brake || "?" }}</div>
              </div>
              <!-- 
              Uses, wins, draws, losses, winrate
              date
              -->
              <!--
              R Score?
              Tags
              Awarded date (prizes)
              ABS
              TCS
              Clearance
              MRA (stock)
              Weight (stock)
              Fuel
              Seats
              Engine pos
              Body style
              Brake -->
            </div>
          </template>
        </RecycleScroller>
      </div>
    </div>




    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      :config="{
        tunes: true,
        garage: garageWorking
      }"
      :raceFilter="_Mcars.filter"
      :enableCounters="true"
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
import BaseSelectNew from "./BaseSelectNew.vue";
import BaseCardMini from "./BaseCardMini.vue";
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'MainCars',
  components: {
    MainCarsDetail,
    BaseSwitch,
    BaseFilterDialog,
    BaseCard,
    BaseChip,
    BaseSelectNew,
    BaseCardMini
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
      ready: false,
      sizes: [
        { width: 68, aspect: '415 / 256', fsize: 5 },
        { width: 200, aspect: '415 / 256', fsize: 10 },
        { width: 300, aspect: '415 / 256', fsize: 15 },
        { width: 415, aspect: '415 / 256', fsize: 20 },
      ],
      cars: [],
      sortMethods: [
        { value: 'R_Medals_score', isGarage: false }, //
        { value: 'races', isGarage: true },
        { value: 'winRate', isGarage: true },
        { value: 'days', isGarage: true },
        { value: 'units', isGarage: true },
        { value: 'rq', isGarage: false }, //
        { value: 'topSpeed', isGarage: false },
        { value: 'acel', isGarage: false },
        { value: 'hand', isGarage: false },
        { value: 'mra', isGarage: false },
        { value: 'weight', isGarage: false },
        { value: 'year', isGarage: false },
        { value: 'name', isGarage: false },
        { value: 'seats', isGarage: false },
        { value: 'brand', isGarage: false },
        { value: 'country', isGarage: false },
      ],
      debounceFilter: null,
      debounceChangedLong: () => {},
      searchFocus: false,
      columns: [
        { type: "R_Medals_score", fixed: 0, nick: "Rscr", w: 2.5 },
        { type: "races", fixed: 0, nick: "Races", w: 3 },
        { type: "winRate", fixed: 0, nick: "Win", w: 2 },
        { type: "days", fixed: 0, nick: "Days", w: 3 },
        { type: "topSpeed", fixed: 0, nick: "Speed", w: 2 },
        { type: "acel", fixed: 1, nick: "0-60", w: 2 },
        { type: "hand", fixed: 0, nick: "Hand", w: 2 },
        { type: "mra", fixed: 2, nick: "MRA", w: 3.2 },
        { type: "weight", fixed: 0, nick: "Weight", w: 3 },
        { type: "year", fixed: 0, nick: "Year", w: 3 },
        { type: "abs", fixed: 0, nick: "ABS", w: 2 },
        { type: "tcs", fixed: 0, nick: "TCS", w: 2 },
        { type: "clearance", fixed: 0, nick: "Clea.", w: 3 },
        { type: "fuel", fixed: 0, nick: "Fuel", w: 4 },
        { type: "seats", fixed: 0, nick: "Sts", w: 1 },
        { type: "engine", fixed: 0, nick: "Engine", w: 3 },
        { type: "bodyType", fixed: 0, nick: "Body", w: 4 },
        { type: "brake", fixed: 0, nick: "Brk", w: 1 }
      ],
      columnObj: {},
      viewFix: true,
      indexHover: -1
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
    this.columnObj = this.columns.reduce((acc, col) => {
      col.index = this.columns.indexOf(col);
      col.isGarage = this.sortMethods.find(x => x.value === col.type)?.isGarage || false;
      acc[col.type] = col;
      return acc;
    }, {});

    if (!this.T_S._Mcars) {
      this.T_S.$patch((state) => {
        state._Mcars = {
          input: "",
          filter: {},
          view: "list",
          showStats: true,
          isGarage: false,
          width: 68,
          aspect: '415 / 256',
          fsize: 5,
          sortMethod: 'R_Medals_score',
          sortDesc: true,
          expanded: false,
          cols: {
            R_Medals_score: true,
            races: true,
            winRate: true,
            days: true,
            topSpeed: true,
            acel: true,
            hand: true,
            mra: true,
            weight: true,
            year: true,
            abs: true,
            tcs: true,
            clearance: true,
            fuel: true,
            seats: true,
            engine: true,
            bodyType: true,
            brake: true
          }
        }
      })
      this.loadLocal();
    }
  },
  beforeMount() {
    // Vue.readLocalStorage("MainCarsIsGarage", this._Mcars, "isGarage", true);
    // let width = window.localStorage.getItem("MainCarsWidth");
    // if (width) {
    //   width = parseInt(width);
    //   let sizeItem = this.sizes.find(s => s.width === width);
    //   if (sizeItem) {
    //     this.changeSize(sizeItem);
    //   }
    // }
  },
  mounted() {
    this.debounceFilter = Vue.debounce(this.loadCars, 500);
    this.debounceChangedLong = Vue.debounce(this.changedLong, 1000);

    if (this.$refs.mainCarsFiltRef) {
      this.$refs.mainCarsFiltRef.searchFilters.tunes = this.$refs.mainCarsFiltRef.searchFilters.tunes.filter(x => x !== "Best");
    }

    this.prepareCars();
  },
  computed: {
    ...mapState(tdrStore, ["_Mcars", "_user"]),
    carHeight() {
      return this._Mcars.width / (415 / 256) + 6;
    },
    blockWidth() {
      return (this._Mcars.width + 6) * this.wCalc - 6;
      if (this._Mcars.showStats) {
        return Math.min(915, Vue.utils.windowWidth) - 20;
      } else {
      }
    },
    statsWidth() {
      // let result = `calc(var(--width) + 15px + `;
      let emC = 0;
      let margin = 0;
      this.columns.map(column => {
        if (this._Mcars.cols[column.type] && (this.garageWorking || !column.isGarage)) {
          emC += column.w;
          margin += 10;
        }
      });
      return `calc(var(--width) + 15px + ${emC}em + ${margin}px)`;

      result += `${emC}em + ${marginL}px + ${marginR}px)`;
      return result;
    },
    garageWorking() {
      return this._Mcars.isGarage && this.T_S._user && this.T_S._user.hasGarage && Vue.garageObj.loaded;
    },
    wCalc() {
      return Math.floor(Math.min(this._Mcars.expanded ? 4000 : 915, Vue.utils.windowWidth-50) / (this._Mcars.width + 5));
    },
    sortListResolved() {
      if (this.garageWorking) {
        return this.sortMethods.map(x=>x.value);
      } else {
        return this.sortMethods.filter(x => !x.isGarage).map(x=>x.value);
      }
    },
    showMiniCard() {
      return Vue.utils.windowWidth < 500 || this._Mcars.width < 250;
    }
  },
  methods: {
    async prepareCars() {
      await Vue.carsCompile("R_Medals");
      this.ready = true;
      this.loadCars();
    },
    loadCars() {
      if (!this.ready) return;
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
      let hasFilter =  Object.keys(this._Mcars.filter).length > 0;

      // if (!hasFilter) return this.cars = Vue.all_carsArr;

      let input = this._Mcars.input ? this._Mcars.input.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "") : null;
      Vue.all_carsArr.map(car => {
        if (hasFilter) {
          if (!this.matchFilter(car)) return;
        }
        if (input) {
          if (!Vue.matchSearch(car, input)) return;
        }
        result.push(car);
      });
      
      this.cars = result;
      this.sortCars();
      this.saveLocal();
    },
    loadByGarage() {
      if (!this.ready) return;
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
      let input = this._Mcars.input ? this._Mcars.input.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "") : null;

      keys.map(rid => {
        Vue.garageByRid[rid].map(gCar => {
          if (hasFilter) {
            if (!this.matchFilter(Vue.all_carsObj[gCar.rid], gCar)) return;
          }
          if (input) {
            if (!Vue.matchSearch(Vue.all_carsObj[gCar.rid], input)) return;
          }
          result.push(gCar);
        });
      });

      if (result[0]?.["races"] === undefined) Vue.garageCompile("races");
      if (result[0]?.["winRate"] === undefined) Vue.garageCompile("winRate");
      if (result[0]?.["days"] === undefined) Vue.garageCompile("days");
      if (result[0]?.["units"] === undefined) Vue.garageCompile("units");
      
      this.cars = result;
      this.sortCars();
      this.saveLocal();
    },
    matchFilter(car, hCar) {
      if (!this.$refs.mainCarsFiltRef.checkMatchFilter(car, hCar)) return false;
      return true;
    },
    sortCars() {
      if (!this.ready) return;
      if (this.cars.length === 0) return;

      let propKey = this._Mcars.sortMethod;
      if (propKey === "name" || propKey === "brand" || propKey === "country" || propKey === "brake" || propKey === "engine" || propKey === "fuel" || propKey === "clearance") {
        // Duplicated code for performance
        if (propKey === "name") propKey = "onlyName";
        this.cars.sort((a,b) => {
          let aVal = Vue.all_carsObj[a.rid]?.[propKey] || "";
          let bVal = Vue.all_carsObj[b.rid]?.[propKey] || "";
          if (aVal === bVal) {
            return this.resolveDraw(a,b);
          }
          if (this._Mcars.sortDesc) {
            return bVal.localeCompare(aVal);
          } else {
            return aVal.localeCompare(bVal);
          }
        });
        return;
      }

      if (propKey === "abs" || propKey === "tcs") {
        // Duplicated code for performance
        this.cars.sort((a,b) => {
          let aVal = Vue.all_carsObj[a.rid]?.[propKey] ? 1 : 0;
          let bVal = Vue.all_carsObj[b.rid]?.[propKey] ? 1 : 0;
          if (aVal === bVal) {
            return this.resolveDraw(a,b);
          }
          if (this._Mcars.sortDesc) {
            return bVal - aVal;
          } else {
            return aVal - bVal;
          }
        });
        return;
      }

      if (propKey === "bodyType") {
        // Duplicated code for performance
        this.cars.sort((a,b) => {
          let aVal = (Vue.all_carsObj[a.rid]?.["bodyTypes"] || [])[0];
          let bVal = (Vue.all_carsObj[b.rid]?.["bodyTypes"] || [])[0];
          if (aVal === bVal) {
            return this.resolveDraw(a,b);
          }
          if (this._Mcars.sortDesc) {
            return bVal.localeCompare(aVal);
          } else {
            return aVal.localeCompare(bVal);
          }
        });
        return;
      }

      let GG = false;
      let found = this.sortMethods.find(x => x.value === propKey);
      if (found && found.isGarage) {
        if (!this.garageWorking) return;
        GG = true;
        if (propKey === "races" && this.cars[0]["races"] === undefined) Vue.garageCompile("races");
        if (propKey === "winRate" && this.cars[0]["winRate"] === undefined) Vue.garageCompile("winRate");
        if (propKey === "days" && this.cars[0]["days"] === undefined) Vue.garageCompile("days");
        if (propKey === "units" && this.cars[0]["units"] === undefined) Vue.garageCompile("units");
      }

      this.cars.sort((a,b) => {
        let aVal = GG ? a[propKey] : Vue.all_carsObj[a.rid]?.[propKey];
        let bVal = GG ? b[propKey] : Vue.all_carsObj[b.rid]?.[propKey];
        if (!aVal && aVal !== 0 && bVal) return 1;
        if (aVal && !bVal && bVal !== 0) return -1;
        
        if (aVal === bVal) {
          return this.resolveDraw(a,b, propKey);
        }
        if (this._Mcars.sortDesc) {
          return bVal - aVal;
        } else {
          return aVal - bVal;
        }
      });
    },
    resolveDraw(a,b, propKey) {
      if (propKey === "winRate") {
        return b.races - a.races;
      }
      if (propKey === "races") {
        return b.days - a.days;
      }
      if (Vue.all_carsObj[a.rid]?.rq === Vue.all_carsObj[b.rid]?.rq) {
        if (Vue.all_carsObj[b.rid]?.name === Vue.all_carsObj[a.rid]?.name) {
          if (a.tunZ) return b.tunZ.localeCompare(a.tunZ);
          return 0;
        }
        return (Vue.all_carsObj[b.rid]?.name || "").localeCompare(Vue.all_carsObj[a.rid]?.name);
      } else {
        return Vue.all_carsObj[b.rid]?.rq - Vue.all_carsObj[a.rid]?.rq;
      }
    },
    changedLong() {
      this.saveLocal();
    },
    saveLocal() {
      window.localStorage.setItem("MainCars", JSON.stringify(this._Mcars));
    },
    loadLocal() {
      let local = window.localStorage.getItem("MainCars");
      if (local) {
        try {
          let parsed = JSON.parse(local);
          this._Mcars.input = parsed.input || this._Mcars.input;
          this._Mcars.filter = parsed.filter || this._Mcars.filter;
          this._Mcars.view = parsed.view || this._Mcars.view;
          this._Mcars.showStats = parsed.showStats || this._Mcars.showStats;
          this._Mcars.isGarage = parsed.isGarage || this._Mcars.isGarage;
          this._Mcars.width = parsed.width || this._Mcars.width;
          this._Mcars.aspect = parsed.aspect || this._Mcars.aspect;
          this._Mcars.fsize = parsed.fsize || this._Mcars.fsize;
          this._Mcars.sortMethod = parsed.sortMethod || this._Mcars.sortMethod;
          this._Mcars.sortDesc = parsed.sortDesc !== undefined ? parsed.sortDesc : this._Mcars.sortDesc;
          this._Mcars.expanded = parsed.expanded || this._Mcars.expanded;
          if (Object.keys(parsed.cols || {}).length === Object.keys(this._Mcars.cols).length) {
            this._Mcars.cols = parsed.cols;
          }
        } catch (e) {
          console.error("Failed to parse local storage MainCars:", e);
        }
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
        Vue.loadGarage({ username: this.T_S._user.username });
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
    toggleListView(value) {
      this._Mcars.showStats = value;
      this.viewFix = false;
      if (value === false && this._Mcars.width === 68) {
        this.changeSize(this.sizes[1]);
      }
      if (value === true && this._Mcars.width === 200) {
        this.changeSize(this.sizes[0]);
      }
      this.$nextTick(() => {
        this.viewFix = true;
      });
    },
    changeSize(item) {
      this._Mcars.width = item.width;
      this._Mcars.aspect = item.aspect;
      this._Mcars.fsize = item.fsize;
      this.debounceChangedLong();
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
    closeFilterText() {
      this._Mcars.input = "";
      this.loadCars();
    },
    openFilter() {
      this.filterDialog = true;
    },
    cardClick(item) {
      // console.log(JSON.parse(JSON.stringify( item?.R_Medals_tracks || Vue.all_carsObj[item.rid]?.R_Medals_tracks || [] )));
      if (import.meta.env.DEV) this.getMedals(item);
      if (this.garageWorking) {
        console.log(item, Vue.all_carsObj[item.rid]);
      }

      this.T_S._g_cFull.car = Vue.all_carsObj[item.rid];
      this.T_S._g_cFull.dialog = true;
      this.T_S._g_cFull.close = () => {
        this.T_S._g_cFull.dialog = false;
      };


    },
    getMedals(item) {
      Vue.getRMedals([item.rid], [], () => {
        
        let res = Vue.R_Medals[Vue.rn_to_rid.indexOf(item.rid)];
        console.log(res?.result?.stars, res);
        console.log(res?.result?.mainNiches);
        console.log(res?.result?.tracks);
  
        },
        (error) => {
          console.error("Failed to get medals:", error);
        }
      );

    },
    sortClick(column) {
      if (this._Mcars.sortMethod === column) {
        this._Mcars.sortDesc = !this._Mcars.sortDesc;
      } else {
        this._Mcars.sortMethod = column;
      }
      this.sortCars();
    },
    hoverHandle(e, isOut) {
      if (
        !isOut &&
        e.target &&
        typeof e.target.className === "string"
      ) {
        if (e.target.className.startsWith("MainCars_St")) {
          // console.log("hoverHandle", e.target.className);
          let type = e.target.className.split("MainCars_c_")[1].split(" ")[0];
          this.indexHover = this.columns.findIndex(col => col.type === type);
          return;
        }
        if (e.target.className.includes("Car_")) {
          this.indexHover = -1;
        }
        // console.log("hoverHandle", e.target.className);
      }

      if (
        isOut
      ) {
        // console.log("hoverHandle", e);
        this.indexHover = -1;
      }
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
.MainCars_BodyBoxStats {
  width: var(--statsWidth);
  font-size: 16px;
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
.MainCars_Viewlist .MainCars_CarLeft {
  position: sticky;
  left: 0px;
}
.MainCars_Viewlist .vue-recycle-scroller__item-wrapper {
  overflow: unset;
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
  padding: 5px 7px;
  min-width: 39px;
}
.MainCars_StickyListView {
  position: sticky;
  left: 0;
  width: var(--vw);
  justify-content: center;
}
.MainCars_StickyListBox {
  display: flex;
  width: 100%;
  justify-content: center;
  max-width: 910px;
}
.MainCars_HeaderControls {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  /* max-width: calc(var(--cell-width) * 5); */
  /* margin: 0 auto; */
  margin-top: 25px;
}
.MainCars_HeaderControls > * {
  min-width: 60px;
}
.MainCars_HeaderControls .MainCars_StickyListBox {
  flex-wrap: wrap;
  gap: 15px;
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
.MainCars_SortBox {
  display: flex;
  align-items: stretch;
}
.MainCars_SortSelect {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 92px;
  box-shadow: inset -1px 0px 0px 0px #ffffff0a;
}
.MainCars_SortSelect .BaseSelectNew_Right {
  display: none;
}
.MainCars_SortDescButton {
  font-size: 21px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background-clip: padding-box;
  box-shadow: inset 1px 0px 0px 0px #ffffff0a;
}
.MainCars_CarItem {
  display: flex;
  gap: 15px;
}
.MainCars_CarRight {
  flex-grow: 1;
  display: flex;
}
.MainCars_ColumnLeftSpace {
  width: calc(var(--width) + 15px);
}
.MainCars_ColumnHeaders {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  /* line-height: 1; */
  position: sticky;
  top: 0;
  background-color: var(--d-back);
  z-index: 1;
  /* width: fit-content; */
}
.MainCars_ColumnHeaders + .MainCars_Body {
  margin-top: 6px;
}
.MainCars_ColumnHeadersBox {
  display: flex;
  align-items: center;
}
.MainCars_ColumnHeader {
  
}
.MainCars_Column {
  user-select: none;
  cursor: pointer;
  opacity: 0.6;
  display: flex;
  justify-content: center;
  white-space: nowrap;
}
.MainCars_Column:hover,
.MainCars_Column:focus-visible {
  opacity: 1;
}
.MainCars_ColumnHeaderTxt {
  font-size: 0.8em;
}
.MainCars_St {
  font-size: 16px;
  margin-right: 10px;
  /* padding: 0 2px 0 3px; */
  --w: 2em;
  width: var(--w);
  min-width: var(--w);
  text-align: center;
  align-content: center;
}
.MainCars_Hover_races .MainCars_c_races,
.MainCars_Hover_winRate .MainCars_c_winRate,
.MainCars_Hover_days .MainCars_c_days,
.MainCars_Hover_R_Medals_score .MainCars_c_R_Medals_score,
.MainCars_Hover_topSpeed .MainCars_c_topSpeed,
.MainCars_Hover_acel .MainCars_c_acel,
.MainCars_Hover_hand .MainCars_c_hand,
.MainCars_Hover_mra .MainCars_c_mra,
.MainCars_Hover_weight .MainCars_c_weight,
.MainCars_Hover_year .MainCars_c_year,
.MainCars_Hover_abs .MainCars_c_abs,
.MainCars_Hover_tcs .MainCars_c_tcs,
.MainCars_Hover_clearance .MainCars_c_clearance,
.MainCars_Hover_fuel .MainCars_c_fuel,
.MainCars_Hover_seats .MainCars_c_seats,
.MainCars_Hover_engine .MainCars_c_engine,
.MainCars_Hover_bodyType .MainCars_c_bodyType,
.MainCars_Hover_brake .MainCars_c_brake,
.MainCars_Hover_bodyType .MainCars_c_bodyType {
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 0px 3px rgba(255, 255, 255, 0.05);
}
.MainCars_c_fuel,
.MainCars_c_bodyType {
  overflow: hidden;
  text-overflow: ellipsis;
}
.MainCars_CarItem .Car_Header {
  min-width: var(--card-g-width);
}
.MainCars_ScrollerItem {

}
.MainCars_WidthChip .BaseChip_Text {
  display: flex;
}
.MainCars_ColumnActive {
  color: rgb(var(--d-text-yellow));
}
.MainCars_ColumnActive:after {
  content: "\e921";
  font-family: 'JurisT' !important;
  font-size: 0.5em;
  align-content: center;
}
.MainCars_SortDesc .MainCars_ColumnActive:after {
  content: "\e924";
}
.MainCars_ColumnActive.MainCars_c_R_Medals_score:after {
  content: unset;
}
.MainCars_FireIcon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 15px;
}
.MainCars_FireIconImg {
  position: absolute;
  top: -21px;
  height: 35px;
  filter: grayscale(1);
}
.MainCars_ColumnActive .MainCars_FireIconImg {
  filter: hue-rotate(165deg);
}
.MainCars_SortDesc .MainCars_ColumnActive .MainCars_FireIconImg {
  filter: unset;
}

</style>