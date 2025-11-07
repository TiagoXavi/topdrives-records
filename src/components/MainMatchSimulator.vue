<template>
  <div
    :class="{
      Main_Compact: Vue.utils.windowWidth < 1200
    }"
    class="MainMatchSimulator_Layout">








    <div class="Cg_Header">
      <div class="Cg_HeaderLeft">
        <div class="Cg_Corner">
          <div class="Main_CornerMid">
          </div>
        </div>
        <div class="Cg_RowCornerBox">
          <!-- top CHALLENGE -->
          
          <div v-if="T_S._match.pages" class="MainMatchSimulator_PagesBox">
            <BaseButtonTouch
              v-for="(m, index) in T_S._match.pages"
              v-if="index >= Math.min(T_S._match.pages.length-9, T_S._match.page-4) && index <= Math.max(8, T_S._match.page+4)"
              :class="{ Row_DialogButtonTuneActive: T_S._match.page === index }"
              class="D_Button Main_OptionsButton MainMatchSimulator_PageSave"
              @longTouch="loadPage(index, { shiftKey: true }, $event)"
              @click="loadPage(index, $event)">
              <span style="pointer-events: none; user-select: none;">{{ index+1 }}</span>
              <div v-if="T_S._match.pages[index] && T_S._match.pages[index].name" class="MainMatchSimulator_PageSub">{{ T_S._match.pages[index].name }}</div>
            </BaseButtonTouch>
            <button
              class="D_Button Main_MemorySave"
              @click="newPage()">
              <i class="ticon-plus_2" aria-hidden="true"/>
            </button>
          </div>
          <div class="Cg_SelectorLayout">
            <div class="Cg_SelectorLeft">
              <button
                :disabled="T_S._match.page === 0 || Vue.utils.cacheLoading"
                class="D_Button Row_DialogButtonTune"
                @click="loadPrevPage()">
                <i class="ticon-arrow_left_3" aria-hidden="true"/>
              </button>
            </div>
            <div class="Cg_SelectorCenter">
              <div class="Cg_CenterBottom">
                <div
                  :style="`color: ${ T_S._match.rqFill > T_S._match.rqLimit ? '#a90000' : '' }; margin-left: 10px;`"
                  class="Cg_RqText">
                  <span class="Cg_RqRq"><i class="tdicon-rq" aria-hidden="true"/></span>
                  <span>{{ T_S._match.rqFill }}</span>
                  <span>/</span>
                  <span>{{ T_S._match.rqLimit }}</span>
                  <BaseButtonTouch
                    :disabled="Vue.utils.cacheLoading"
                    class="D_Button Main_AddTrackDirect"
                    @click="openRqEditDialog($event)">
                    <i class="ticon-pencil" aria-hidden="true"/>
                  </BaseButtonTouch>
                </div>
                <button
                  class="D_Button Main_OptionsButton"
                  @click="newPage(true)">
                  <i class="ticon-plus_2" style="font-size: 14px; margin-right: 5px;" aria-hidden="true"/>
                  <span>{{ $t("m_copy") }}</span>
                </button>
              </div>
            </div>
            <div class="Cg_SelectorRight">
              <button
                :disabled="T_S._match.page >= T_S._match.pages.length - 1 || Vue.utils.cacheLoading"
                class="D_Button Row_DialogButtonTune"
                @click="loadNextPage()">
                <i class="ticon-arrow_right_3" aria-hidden="true"/>
              </button>
            </div>
          </div>


        </div>

        <BaseFilterDescription
          :filter="T_S._match.filter"
          :filter2="T_S._match.filter2"
          :filter3="T_S._match.filter3"
          :loading="false"
          :ready="true"
          :user="{ mod: true }"
          :useWhatFilter="useWhatFilter"
          @useFilter="useWhatFilter = $event;"
          class="Cg_Right"
          @changeClick="openDialogFilter()" />

        <div class="Cg_RqCount">
          <div
            :style="`width: ${ (T_S._match.rqFill * 100) / T_S._match.rqLimit }%; background-color: ${ T_S._match.rqFill > T_S._match.rqLimit ? '#a90000' : '' }`"
            class="Cg_RqFill"
          />
        </div>
      </div>
    </div>









    <div class="MainMatchSimulator_Mid">
      <div class="MainMatchSimulator_Oppos">
        <BaseCarsTeam
          :cars="_match.oppos"
          :filterToImport="_match[`filter${useWhatFilter ? useWhatFilter+1 : ''}`]"
          :width="228"
          :aspect="'415 / 256'"
          :fsize="12"
          :miniWidth="113"
          :miniAspect="'111 / 144'"
          :miniFsize="12"
          :mini="Vue.utils.windowWidth < 1200"
          :loading="Vue.utils.cacheLoading"
          prefix="Oppo"
          style="--gap: 2px;"
          @changed="changedAny($event)"
        />
      </div>
      <BaseCarsTuneTime
        :cars="T_S._match.oppos"
        :tracks="T_S._match.event.check !== null ? T_S._match.event.trackset[T_S._match.event.check] : [null,null,null,null,null]"
        :width="Vue.utils.windowWidth < 1200 ? 115 : 230"
        @changed="changedAny($event)"
        @times="changedAny($event)"
        @cog="cogClick($event, 'oppos')"
      />

      <!-- <div style="margin-top: 20px;"></div> -->
      <BaseEventTrackbox
        :event="_match.event"
        :eventLoadingAny="false"
        :user="{ mod: true }"
        :check="_match.event.check"
        :eventForceAnalyze="false"
        :eventBestPerTrack="{}"
        :showBestPerTrack="false"
        :hideCheckBox="false"
        :disableCampaignTip="true"
        :mini="false"
        :miniHeight="false"
        :size="Vue.utils.windowWidth < 1200 ? 115 : 230"
        :readonly="false"
        :autoResolve="true"
        :animationProp="false"
        :showMatchPoints="true"
        :matchPoints="_match.points"
        @changed="changedAny($event)"
      />



      <!-- Points You -->
      <BaseCarsPoints
        :cars="_match.cars"
        :oppos="_match.oppos"
        :match="_match"
        :tracks="_match.event.check !== null ? _match.event.trackset[_match.event.check] : [null,null,null,null,null]"
        :points="_match.event.check !== null ? (_match.points?.[_match.event.check]?.arr || []) : [null,null,null,null,null]"
        :width="Vue.utils.windowWidth < 1200 ? 115 : 230"
      />



      <div class="MainMatchSimulator_Yours">
        <BaseCarsTeam
          :cars="_match.cars"
          :filterToImport="_match[`filter${useWhatFilter ? useWhatFilter+1 : ''}`]"
          :width="228"
          :aspect="'415 / 256'"
          :fsize="12"
          :miniWidth="113"
          :miniAspect="'111 / 144'"
          :miniFsize="12"
          :mini="Vue.utils.windowWidth < 1200"
          :loading="Vue.utils.cacheLoading"
          prefix="Your"
          style="--gap: 2px;"
          @changed="changedAny($event)"
        />
      </div>

      <BaseCarsTuneTime
        :cars="_match.cars"
        :tracks="_match.event.check !== null ? _match.event.trackset[_match.event.check] : [null,null,null,null,null]"
        :width="Vue.utils.windowWidth < 1200 ? 115 : 230"
        @times="timesUpdated();"
        @changed="changedAny($event)"
        @cog="cogClick($event, 'cars')"
      />

      <div
        v-if="T_S._match.points && (_match.event.check || _match.event.check===0) && T_S._match.points[_match.event.check]"
        :class="{
          MainMatchSimulator_TotalGreen: T_S._match.points[_match.event.check].total > 0,
          MainMatchSimulator_TotalRed: T_S._match.points[_match.event.check].total < 0
        }"
        class="MainMatchSimulator_TotalLayout">
        <div class="MainMatchSimulator_TotalBox">
          <div class="MainMatchSimulator_TotalRight">
            <div class="MainMatchSimulator_TotalLabel">{{ $t('m_you') }}</div>
            <div class="MainMatchSimulator_TotalValue">{{ T_S._match.points[_match.event.check].you }}</div>
          </div>
          <div class="MainMatchSimulator_TotalLeft">
            <div class="MainMatchSimulator_TotalStars">
              <div
                v-for="n in 3"
                class="MainMatchSimulator_Star">
                <span v-if="(
                  T_S._match.points[_match.event.check].total > 0 &&
                  (
                    n === 1 ||
                    (n === 2 && T_S._match.points[_match.event.check].total >= 150) ||
                    (n === 3 && T_S._match.points[_match.event.check].total >= 250)
                  )
                )">★</span>
                <span v-else class="MainMatchSimulator_StarUnfilled">☆</span>
              </div>
            </div>
            <div class="MainMatchSimulator_TotalValueStars">{{ T_S._match.points[_match.event.check].total }}</div>
          </div>
          <div class="MainMatchSimulator_TotalRight MainMatchSimulator_TotalRightThem">
            <div class="MainMatchSimulator_TotalLabel">{{ $t('m_them') }}</div>
            <div class="MainMatchSimulator_TotalValue">{{ T_S._match.points[_match.event.check].them }}</div>
          </div>
        </div>
      </div>


      <div class="MainMatchSimulator_ModTools Cg_BottomModTools Space_TopGiga">
        <!-- <button
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="newPage(true)">
          <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
          <span>{{ $t("m_copy") }}</span>
        </button> -->
        <button
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="exportToWorkspace()">{{ $t("m_useTrackList") }}</button>
        <button
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="loadPage(T_S._match.page, { shiftKey: true })">
          <i class="ticon-trash D_ButtonIcon" aria-hidden="true"/>
          <span>{{ $t("m_delete") }}</span>
        </button>
      </div>




      <!-- <div class="MainMatchSimulator_">
        <div v-for="n in 10000" class="MainMatchSimulator_">
          <test />
        </div>
      </div> -->



      <!-- Filtro, como base para adicionar carros, mas não limitar -->

    </div>


    <!-- <BaseFilterDialog
      v-model="dialogFilter"
      :filterOnly="true"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      @clearFilterUpdate="updateFilterMain($event)"
    /> -->


    <BaseDialog
      :active="rqEditDialog"
      :transparent="false"
      max-width="720px"
      min-width="240px"
      @close="rqEditDialog = false">
      <div class="">
        <BaseMonoSlider
          v-model="T_S._match.rqLimit"
          :min="60"
          :max="500"
          :step="5"
          :label="$t('m_rqLimit')"
          class="Main_TeamsRQSlider"
          @change="changedAny()"
        />
      </div>
    </BaseDialog>




    <BaseMatchMemoryDialog
      v-model="pageSelectorDialog"
      :match="T_S._match"
      @templateClick="decodeTemplateString($event, true)"
    />

    <BaseCarDetailDialog
      :active="tuneDialogActive"
      :car="tuneDialogCar"
      :tuneDialogCarIndex="tuneDialogCarIndex"
      :carDetailsList="tuneDialogList"
      :showMove="true"
      :showTunes="true"
      @newIndex="tuneDialogCarIndex = $event; tuneDialogCar = tuneDialogList[$event];"
      @move="cogMove($event)"
      @delete="cogDelete()"
      @changed="changedAny()"
      @close="tuneDialogActive = false;"
    />


  </div>
</template>

<script>
import BaseCarsTeam from "./BaseCarsTeam.vue";
import BaseEventTrackbox from "./BaseEventTrackbox.vue";
import BaseCarsTuneTime from "./BaseCarsTuneTime.vue";
import BaseCarsPoints from "./BaseCarsPoints.vue";
import BaseFilterDescription from "./BaseFilterDescription.vue";
import BaseButtonTouch from "./BaseButtonTouch.vue";
import BaseDialog from "./BaseDialog.vue";
import BaseMonoSlider from "./BaseMonoSlider.vue";
import BaseMatchMemoryDialog from "./BaseMatchMemoryDialog.vue";
import BaseCarDetailDialog from "./BaseCarDetailDialog.vue";
import BaseFilterDialog from "./BaseFilterDialog.vue";
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';
// BaseCard
// BaseCarsTuneSelector
// BaseTimeCell

import BaseCard from "./BaseCard.vue";

export default {
  name: 'MainMatchSimulator',
  components: {
    BaseCarsTeam,
    BaseEventTrackbox,
    BaseCarsTuneTime,
    BaseCarsPoints,
    BaseCard,
    BaseFilterDescription,
    BaseButtonTouch,
    BaseDialog,
    BaseMonoSlider,
    BaseMatchMemoryDialog,
    BaseCarDetailDialog,
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
      pageSelectorDialog: false,
      dialogFilter: false,
      rqEditDialog: false,
      debounceChangedLong: null,
      debounceChangedFast: null,
      tuneDialogActive: false,
      tuneDialogCarIndex: 0,
      tuneDialogCar: {},
      tuneDialogList: [],
      useWhatFilter: 0
    }
  },
  watch: {},
  created() {
    if (!this.T_S._match) {
      this.T_S.$patch((state) => {
        state._match = {
          name: null,
          page: 0,
          pages: [],
          rqFill: 0,
          rqLimit: 500,
          oppos: [{}, {}, {}, {}, {}],
          cars: [{}, {}, {}, {}, {}],
          points: [],
          filter: {},
          filter2: false,
          filter3: false,
          event: {
            check: null,
            trackset: [
              [{ track: null }, { track: null }, { track: null }, { track: null }, { track: null }]
            ],
            resolvedTrackset: [
              [null, null, null, null, null]
            ]
          },
          readStorage: false
        }
      })
    }
  },
  beforeMount() {},
  beforeCreate() {
    window.localStorage.setItem("matchSimulator", "t");
  },
  mounted() {
    this.debounceChangedLong = Vue.debounce(this.changedLong, 1000);
    this.debounceChangedFast = Vue.debounce(this.changedFast, 1);
    this.loadLocalStorage();
    
    if (this.$route.params && this.$route.params.event) {
      this.importFromParams();
    }

    if (this._match.pages.length === 0) {
      this.newPage();
    }
  },
  computed: {
    ...mapState(tdrStore, ["_match"])
  },
  methods: {
    timesUpdated() {
      this._match.cars.map(car => {
        if (car && car.selectedTune) {
          Vue.set(car, "customData", {});
        }
      })
      this._match.oppos.map(car => {
        if (car && car.selectedTune) {
          Vue.set(car, "customData", {});
        }
      })
    },
    changedAny(type) {
      if (type) {
        // console.log("____", type);
        if (type === "trackCheckbox") {
          return;
        }
      }
      this.debounceChangedFast();
      this.debounceChangedLong();
      // console.log("____");
    },
    changedFast() {
      this.updatePoints();
      this.updateCurrentPage();
      this.updateRqFill();
    },
    changedLong() {
      this.saveLocalStorage();
    },
    saveLocalStorage() {
      if (!this._match.readStorage) return;
      // console.log("____saveLocalStorage");
      window.localStorage.setItem('_matchPages', JSON.stringify({
        pages: this._match.pages,
        page: this._match.page
      }));
    },
    loadLocalStorage() {
      if (this._match.readStorage) return;
      let Match = window.localStorage.getItem("_matchPages");
      if (Match) {
        Match = JSON.parse(Match);
        if (Match && Match.pages) {
          this._match.page = Match.page;
          this._match.pages = Match.pages;
          this.loadPage();
        }
      }
      this._match.readStorage = true;
    },
    loadPage(page, e, fake_e) {
      if (e && e.shiftKey && this._match.pages.length > 1) {
        if (e.preventDefault) e.preventDefault();
        if (fake_e && fake_e.preventDefault) fake_e.preventDefault();

        let needToReload = false;
        if (page === this._match.page) {
          needToReload = true;
          if (page === this._match.pages.length-1) {
            this._match.page--;
          }
        }
        this._match.pages.splice(page, 1);
        if (page < this._match.page) this._match.page--;

        this.saveLocalStorage();
        // if (page > this._match.page) return; // nothing to do
        if (needToReload === false) return;
        page = this._match.page;
      }
      if (page === null || page === undefined) page = this._match.page;
      let obj = this._match.pages[page];
      if (!obj) {
        page = 0;
        obj = this._match.pages[page];
      }

      if (page !== 0) {
        this.$store.commit("START_LOGROCKET", {});
      }

      this.useWhatFilter = 0;
      this._match.page = page;
      this._match.rqLimit = obj.rqLimit;
      this._match.rqFill = 0;
      this._match.name = obj.name;
      this._match.filter = JSON.parse(JSON.stringify(obj.filter));
      this._match.filter2 = JSON.parse(JSON.stringify(obj.filter2 || false));
      this._match.filter3 = JSON.parse(JSON.stringify(obj.filter3 || false));
      this._match.event.trackset = JSON.parse(JSON.stringify(obj.event.trackset));
      this._match.event.resolvedTrackset = [];
      this._match.event.check = null;
      this._match.points = [];

      ["cars", "oppos"].map(key => {
        obj[key] && obj[key].map((car, icar) => {
          Vue.set(this._match[key], icar, {});
          if (!car.rid) return;
          // Vue.set(this._match[key], icar, {"class":"S","rq":108,"onlyName":"R18","brand":"Audi","year":2016,"abs":false,"tcs":false,"clearance":"Low","country":"DE","topSpeed":225,"acel":2.4,"hand":102,"drive":"4WD","tyres":"Slick","mra":124.35,"weight":875,"name":"Audi R18","rid":"Audi_R18_2016","prize":true,"bodyTypes":["Coupe"],"fuel":"Hybrid","seats":"1","engine":"Mid","tags":["Enter the Black Forest","Silver/Grey","Motorsport"],"photoOrig":"Audi_R18_CARD","guid":"dc679e68-c215-4bf7-87e0-04a4931231e5","brake":"A","color":"#FFAF17","colorRgb":"255, 175, 23","photo":"/imgs_final/Audi_R18_2016.jpg","locatedName":"Audi R18","topSpeed_":-1,"hand_":-1,"weight_":-1,"acel_":-1,"mra_":-1,"classColor":"#FFAF17","ridPhoto":"/imgs_final/Audi_R18_2016.jpg","selectedTune":"233"});
          Vue.set(this._match[key], icar, {
            ...(JSON.parse(JSON.stringify( Vue.all_carsObj[car.rid] ))),
            selectedTune: car.selectedTune
          });
        })
      })
      if (obj.event && obj.event.trackset) {
        obj.event.trackset.map((trackst, it) => {
          Vue.set(this._match.event.trackset, it, trackst);
          Vue.set(this._match.event.resolvedTrackset, it, [null, null, null, null, null]);
          this._match.event.trackset[it].map((trackobj, itrjobj) => {
            if (trackobj.track) {
              Vue.set(this._match.event.resolvedTrackset[it], itrjobj, Vue.resolveTrack({ track: trackobj.track }, false, false));
            }
          })
        })
      }

      this.changedFast();
      this.debounceChangedLong();
    },
    importFromParams() {
      this.newPage();
      let event = this.$route.params.event;
      let obj = this._match.pages[this._match.page];

      obj.rqLimit = event.rqLimit;
      obj.name = (event.name||"").slice(0,4).split(" ")[0];
      obj.filter = JSON.parse(JSON.stringify(event.filter));
      obj.filter2 = JSON.parse(JSON.stringify(event.filter2 || false));
      obj.filter3 = JSON.parse(JSON.stringify(event.filter3 || false));
      obj.event.trackset = event.trackset.map(trckst => trckst.map(track => {
        return { track }
      }));

      if (this.$route.params.picks) {
        this.$route.params.picks.find((car, ix) => {
          if (ix > 9) return true;
          let key = (ix > 4) ? "oppos" : "cars";
          let icar = ix % 5;
          obj[key][icar] = {
            rid: car.rid,
            selectedTune: car.tune
          };
        })
      }

      if (this.$route.params.cars) {
        ["cars", "oppos"].map(key => {
          this.$route.params[key].map((car, icar) => {
            obj[key][icar] = {
              rid: car.rid,
              selectedTune: car.selectedTune
            };
          })
        })
      }

      this.loadPage();
    },
    blankPage() {
      return {
        oppos: [{}, {}, {}, {}, {}],
        cars: [{}, {}, {}, {}, {}],
        rqLimit: 500,
        name: null,
        filter: {},
        filter2: false,
        filter3: false,
        event: {
          check: null,
          trackset: [
            [{ track: null }, { track: null }, { track: null }, { track: null }, { track: null }]
          ]
        },
      }
    },
    newPage(byCopy=false) {
      let newIndex = this._match.pages.length;

      if (byCopy) {
        // Vue.set(this._match.pages, newIndex, this.updateCurrentPage(true));
        this._match.pages.splice(this._match.page, 0, this.updateCurrentPage(true));
        newIndex = this._match.page + 1;
        this._match.pages[newIndex].name = this._match.pages[newIndex-1].name || `${newIndex}`;
      } else {
        let found = this._match.pages.findIndex(x => !x);
        if (found > -1) newIndex = found;
        Vue.set(this._match.pages, newIndex, this.blankPage());
      }

      this.loadPage(newIndex);
    },
    updateCurrentPage(returnObj=false) { // save page to pages[]
      if (!this._match?.pages) return;
      if (!this._match.page && this._match.page !== 0) return;
      if (isNaN(Number(this._match.page))) return;

      this._match.page;
      let obj = this.blankPage();
      
      ["cars", "oppos"].map(key => {
        this._match[key] && this._match[key].map((car, icar) => {
          if (!car || !car.rid) return;
          obj[key][icar] = {
            rid: car.rid,
            selectedTune: car.selectedTune
          };
        })
      })

      obj.rqLimit = this._match.rqLimit;
      obj.name = this._match.name;
      obj.filter = JSON.parse(JSON.stringify(this._match.filter));
      obj.filter2 = JSON.parse(JSON.stringify(this._match.filter2));
      obj.filter3 = JSON.parse(JSON.stringify(this._match.filter3));
      obj.event.trackset = JSON.parse(JSON.stringify(this._match.event.trackset));

      if (returnObj) {
        return obj;
      }

      Vue.set(this._match.pages, this._match.page, obj);
    },
    loadPrevPage() {
      this.loadPage(this._match.page - 1);
    },
    loadNextPage() {
      this.loadPage(this._match.page + 1);
    },
    openPageSelectorDialog() {
      this.pageSelectorDialog = true;
    },
    updatePoints() {
      // console.log("+++++");
      if (!this._match?.event) return;

      let result = [];
      this._match.event.trackset.map((trackst, i) => {

        let obj = {
          total: 0,
          you: 0,
          them: 0,
          arr: []
        }

        obj.arr = trackst.map((trackObj, ii) => {
          if (!trackObj) return null;
          if (!trackObj.track) return null;
          if (!this._match.cars[ii]) return null;
          if (!this._match.cars[ii].selectedTune) return null;
          if (!this._match.oppos[ii]) return null;
          if (!this._match.oppos[ii].selectedTune) return null;

          let calc = (Vue.userPoints(
            (Vue.timeCell(this._match.cars[ii].rid, this._match.cars[ii].selectedTune, trackObj.track) || {}).t,
            (Vue.timeCell(this._match.oppos[ii].rid, this._match.oppos[ii].selectedTune, trackObj.track) || {}).t,
            trackObj.track
          ) || {}).v

          if (calc === undefined) return window.i18n.t(`m_notime`);

          obj.total += calc || 0;
          if (calc > 0) obj.you += calc;
          if (calc < 0) obj.them += calc;

          return calc;
        })

        result.push(obj);
      })

      this._match.points = result;
    },
    // openDialogFilter() {
    //   this.dialogFilter = true;
    // },


    openDialogFilter() {
      this.T_S.$patch((state) => {
        state._g_carPicker.dialogLoad = true;
        state._g_carPicker.keepMemory = false;
        state._g_carPicker.filterOnly = true;
        state._g_carPicker.requirementFilter = true;
        state._g_carPicker.filter = JSON.parse(JSON.stringify(this._match.filter));
        state._g_carPicker.filter2 = JSON.parse(JSON.stringify(this._match.filter2));
        state._g_carPicker.filter3 = JSON.parse(JSON.stringify(this._match.filter3));
        state._g_carPicker.useWhatFilter = this.useWhatFilter;
        state._g_carPicker.sortEnabled = false;
        state._g_carPicker.enableCounters = false;
        state._g_carPicker.type = "event";
        state._g_carPicker.index = 0;
        state._g_carPicker.addCar = () => {};
        state._g_carPicker.dual = this.dual;
        state._g_carPicker.clearFilterUpdate = this.updateFilterMain;
        state._g_carPicker.useFilter = this.changeUseWhatFilter;
        state._g_carPicker.config = {
          topSpeed: false,
          acel: false,
          hand: false,
          weight: false,
          brake: false,
          tcs: false,
          abs: false
        };
      })
      this.$nextTick().then(() => {
        this.T_S._g_carPicker.dialog = true;
      })
    },
    dual() {
      if (!this.T_S._g_carPicker.filter2) {
        Vue.set(this.T_S._match, "filter2", {});
        Vue.set(this.T_S._g_carPicker, "filter2", {});
        return;
      }
      if (!this.T_S._g_carPicker.filter3) {
        Vue.set(this.T_S._match, "filter3", {});
        Vue.set(this.T_S._g_carPicker, "filter3", {});
        return;
      }
    },
    changeUseWhatFilter(index) {
      this.useWhatFilter = index;
      this.T_S._g_carPicker.useWhatFilter = index;
    },
    updateFilterMain(filter) {
      let obj = this._match.pages[this._match.page];
      let filterAtr = 'filter';
      if (this.useWhatFilter) filterAtr = filterAtr + (this.useWhatFilter+1);
      obj[filterAtr] = filter;

      this.T_S._g_carPicker.dialog = false;
      let memUseWhatFilter = this.useWhatFilter;
      this.loadPage();
      this.useWhatFilter = memUseWhatFilter;
    },
    // canEnterAfterPick(car) {
    //   let newCar = JSON.parse(JSON.stringify(car));
    //   // console.log(newCar);

    //   Vue.set(this.cars, this.T_S._g_carPicker.index, newCar);
    //   // this.cars[this.g_carPickerIndex] = newCar;
    //   this.T_S._g_carPicker.dialog = false;
    //   // this.g_carPickerDialog = false;
    //   this.$emit("changed");
    // },



    openRqEditDialog() {
      this.rqEditDialog = true;
    },
    cogClick(obj, key) {
      this.tuneDialogCarIndex = obj.icar;
      this.tuneDialogCar = obj.car;
      this.tuneDialogList = this._match[key];
      this.tuneDialogActive = true;
    },
    updateRqFill() {
      this._match.rqFill = 0;
      this._match.cars.map(car => {
        if (car && car.rq) {
          this._match.rqFill += car.rq;
        }
      })
    },
    exportToWorkspace() {
      let cars = [];
      let tracks = [];
      let uniqueCarsString = [];

      for (let X = 0; X < 5; X++) {
        this._match.event.trackset.map(trckst => {
          if (trckst[X].track) tracks.push(trckst[X].track);
        })
      }
      tracks = [...new Set(tracks)];

      for (let X = 0; X < 5; X++) {
        ["oppos", "cars"].map(key => {
          let car = this._match[key][X];
          let toInput = "";
          if (!car.rid) return;
          toInput += `~C${car.rid}`;
          if (car.selectedTune) toInput += `~T${car.selectedTune}`;
          if (uniqueCarsString.includes(toInput)) return;
          uniqueCarsString.push(toInput);

          cars.push({
            rid: car.rid,
            selectedTune: car.selectedTune
          });
        })
      }

      let filterAtr = 'filter';
      if (this.useWhatFilter) filterAtr = filterAtr + (this.useWhatFilter+1);
      let filter = JSON.parse(JSON.stringify(this._match[filterAtr]));

      this.T_S.mainParams = { cars, tracks, filter };
      this.$router.push({ path: "/compare" });
    }
  },
}
</script>

<style>
.MainMatchSimulator_Mid {
  margin-top: 30px;
  padding-bottom: 30px;
}
.MainMatchSimulator_Mid .BaseEventTrackbox_BoxRelative:first-child:last-child .BaseEventTrackbox_ClassCheck {
  opacity: 0.2;
  display: none;
}
.MainMatchSimulator_Mid .BaseEventTrackbox_LineInactive {
  /* opacity: 1; */
}
.MainMatchSimulator_Layout .Cg_SelectorLayout {
  margin-bottom: 15px;
  flex-grow: unset;
}
.MainMatchSimulator_TotalLayout {
  margin: 20px 0;
}
.MainMatchSimulator_TotalBox {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
}
.MainMatchSimulator_TotalLeft {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 280px;
}
.MainMatchSimulator_TotalStars {
  display: flex;
  justify-content: center;
  font-size: 70px;
  line-height: 0.8;
}
.MainMatchSimulator_Star {
  color: rgb(var(--d-text-yellow));
}
.MainMatchSimulator_StarUnfilled {
  opacity: 0.4;
}
.MainMatchSimulator_TotalLabel {
  color: rgb(var(--d-text-cyan));
  text-transform: uppercase;
}
.MainMatchSimulator_TotalRightThem .MainMatchSimulator_TotalLabel {
  color: rgb(var(--d-text-red2));
}
.MainMatchSimulator_TotalGreen {
  /* --cor: rgb(var(--d-text-cyan)); */
}
.MainMatchSimulator_TotalRed {
  --cor: rgb(var(--d-text-red2));
}
.MainMatchSimulator_TotalValueStars {
  color: var(--cor);
}
.MainMatchSimulator_PagesBox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  /* flex-wrap: nowrap; */
  gap: 4px;
}
.MainMatchSimulator_Mid .Row_ShowingBestPerTrack .Row_Content {
  transform: translateX(30px);
}
.MainMatchSimulator_Mid .BaseEventTrackbox_BestBox {
  height: 100%;
  flex-direction: column;
  justify-content: center;
  width: 35px;
  text-align: right;
  align-items: center;
}
.MainMatchSimulator_Mid .BaseEventTrackbox_PointBig {
  font-size: 0.8em;
}
.MainMatchSimulator_PageSave {
  position: relative;
}
.MainMatchSimulator_PageSub {
  pointer-events: none;
  user-select: none;
  position: absolute;
  top: -3px;
  left: 0%;
  width: 100%;
  overflow: hidden;
  font-size: 11px;
  opacity: 0.3;
  text-align: center;
  /* color: rgb(var(--d-text-green)); */
}
.MainMatchSimulator_Layout .Cg_Divider {
  /* margin-top: 0px; */
}
.MainMatchSimulator_Layout .Cg_CenterBottom {
  margin-top: 10px;
}


@media only screen and (max-width: 1200px) {
  .BaseEventTrackbox_ClassCheck {
    position: absolute;
    left: -32px;
    top: 3px;
  }
  .MainMatchSimulator_Mid .BaseEventTrackbox_BestBox {
    font-size: 14px;
    width: 25px;
  }
  .MainMatchSimulator_Mid .Row_ShowingBestPerTrack .Row_Content {
    transform: translateX(20px);
  }
}
@media only screen and (max-width: 850px) {
  .MainMatchSimulator_Layout .Cg_Corner,
  .MainMatchSimulator_Layout .Cg_Right {
    width: auto;
    padding: 0 15px;
  }
  .MainMatchSimulator_Layout .Main_OptionsButton {
    min-width: 36px;
    padding: 7px;
  }
  .MainMatchSimulator_Layout .Cg_SelectorLeft,
  .MainMatchSimulator_Layout .Cg_SelectorRight {
    display: none;
  }
  .MainMatchSimulator_Layout .Cg_RowCornerBox {
    align-items: flex-start;
  }
  .MainMatchSimulator_Layout .Cg_CenterBottom {
    justify-content: flex-start;
  }
}

</style>