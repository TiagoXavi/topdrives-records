<template>
  <div class="BaseMyGarage_Layout">
    <!-- <div class="BaseMyGarage_" style="white-space: pre;">{{ userGarage }}</div> -->

    <!-- <div class="BaseMyGarage_CarList">
      <div v-for="card in userGarage.playerDeck" class="BaseMyGarage_CardBox">
        <BaseCardGallery
          :car="resolvedGuids[card.cardId]"
          :options="false"
          :tuneText="card.selectedTune"
          class="BaseMyGarage_GalleryCard" />
      </div>
    </div> -->

    <div class="MainShowcase_SaveBar D_Center2">
      <button
        v-if="!userId"
        class="D_Button Main_LoginToEdit"
        @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
      <button
        v-else-if="readyToSave"
        :class="{ D_Button_Loading: loading }"
        :disabled="loading"
        class="D_Button Main_SaveAllButton"
        @click="save()">
        <span>{{ $t("m_save") }}</span>
      </button>
      <div v-else-if="userGarage" :class="`Main_UserT${highlightsUsers[userId]}`" class="MainShowcase_TitleBox">
        <BaseIconSvg type="laurel" />
        <div class="MainShowcase_Title">{{ userGarage.socialName || userId }}</div>
        <BaseIconSvg type="laurel" />
      </div>
    </div>


    <div v-if="false" class="BaseMyGarage_H">
      <RecycleScroller
        :items="userGarage.playerDeck"
        :item-size="300"
        :item-secondary-size="186"
        :emitUpdate="true"
        :gridItems="2"
        direction="horizontal"
        listClass="BaseMyGarage_CardsWrapper"
        itemClass="BaseMyGarage_ScrollerItem"
        class="BaseMyGarage_CardsBox Main_DarkScroll"
        @scrollEnd="">
        <template v-slot="{ item, index, active }">
          <div class="BaseMyGarage_CardBox">
            <BaseCardGallery
              :car="resolvedGuids[item.cardId]"
              :options="false"
              :tuneText="item.selectedTune || item.selectedTuneZ"
              class="BaseMyGarage_GalleryCard" />
          </div>
        </template>
      </RecycleScroller>
    </div>


    <div class="BaseMyGarage_HLBox">
      <div v-for="hl in userHighlights" class="BaseMyGarage_HLItem">

        <div class="BaseMyGarage_FilterBox">
          <div
            v-if="Object.keys(hl.filter).length === 0"
            class="BaseMyGarage_EmptyFilter">
          </div>
          <div v-else-if="hl.filter.newerThan" class="BaseFilterDescription_Layout">
            <div class="BaseFilterDescription_Item">
              <div class="BaseFilterDescription_Value">Cars earned in 2024</div>
            </div>
          </div>
          <BaseFilterDescription
            v-else
            :filter="hl.filter"
            :asFilterLabel="true"
            :hideIfEmpty="false"
            :showTitle="false"
            :emitDescResolved="false"
            class="" />
        </div>
        
        <div v-if="hl.r" class="BaseMyGarage_RarityStatsBox">
          <template v-for="(value, key, index) in hl.r">
            <div class="BaseMyGarage_RarityStatsItem">
              <div class="BaseMyGarage_RarityStatsValue">
                <div class="BaseMyGarage_RarityStatsValueT">{{ value }}</div>
              </div>
              <div class="BaseMyGarage_RarityStatsName">{{ $tc(`m_${key}`,1) }}</div>
            </div>
          </template>
        </div>
        
        <div v-if="hl.t" class="BaseMyGarage_RarityStatsBox">
          <template v-for="(value, key, index) in hl.t">
            <div class="BaseMyGarage_RarityStatsItem">
              <div class="BaseMyGarage_RarityStatsCard">
                <BaseCardGallery
                  v-if="value.car.cardId"
                  :car="resolvedGuids[value.car.cardId]"
                  :options="false"
                  :tuneText="value.car.selectedTune || value.car.selectedTuneZ"
                  class="BaseMyGarage_GalleryCard" />
                <div v-else class="BaseMyGarage_CarPlaceHolder Row_DialogCardCard2">
                  <i class="ticon-line" aria-hidden="true"/>
                </div>
              </div>
              <div class="BaseMyGarage_RarityStatsValue">
                <div class="BaseMyGarage_RarityStatsValueT">{{ value.v % 1 != 0 ? value.v >= 100 ? Math.round(value.v) : Math.round(value.v * 10)/10 : value.v }}{{ value.sf }}</div>
                <div v-if="value.sub" class="BaseMyGarage_RarityStatsSub">{{ value.sub }}</div>
              </div>
              <div class="BaseMyGarage_RarityStatsName">{{ $tc(`m_${key}`,1) }}</div>
              
              <!-- <template v-if="value.car.cardId">
                <span>{{ resolvedGuids[value.car.cardId].name }} </span>
                <span v-if="key.includes('Rate')">({{ Math.round(value.v) }}%)</span>
                <span v-else>({{ value.v }})</span>
              </template> -->

            </div>
          </template>
        </div>

      </div>
    </div>



    <BaseDialog
      :active="confirmDelete.dialog"
      :transparent="false"
      :lazy="true"
      zindex="101"
      max-width="420px"
      min-width="240px"
      @close="confirmDelete.dialog = false;">
      <div style="Main_DialogConfirm">
        <div class="Main_DialogMessage">{{ confirmDelete.msg }}</div>
        <div class="Main_DialogBottom">
          <button
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.dialog = false;">
            <span>{{ $t("m_cancel") }}</span>
          </button>
          <button
            :class="`${ loading ? 'D_Button_Loading ' : '' }`+
                    `${ confirmDelete.classe }`"
            :disabled="loading"
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.action">
            <span>{{ confirmDelete.actionLabel }}</span>
          </button>
        </div>
      </div>
    </BaseDialog>


    <BaseFilterDialog
      v-model="myGarageFilterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      :config="{
        classes: false,
        rq: false,
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        prizes: false,
        customTags: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      importFilterName="MYGARAGE_INTERNALFILTER_IMPORT"
      ref="myGarageFilter"
      ridsMutationName="FILTER_PACKS_LIMITS"
    />
  </div>
</template>

<script>
try {
  var myGarage = require('@/database/hutch_myGarage.json')
} catch (error) {}

import all_cars from '../database/cars_final.json';
import BaseCardGallery from './BaseCardGallery.vue';
import BaseDialog from './BaseDialog.vue';
import BaseFilterDialog from './BaseFilterDialog.vue';
import BaseFilterDescription from './BaseFilterDescription.vue';
import BaseIconSvg from './BaseIconSvg.vue';

class hlCar {
  constructor(initialValue = 0, suffix = "") {
    this.car = {};
    this.v = initialValue;
    this.used = 0;
    this.sf = suffix;
  }
}
class rarityStats {
  constructor() {
    this.carCount = 0;
    this.fullyUpgraded = 0;
    this.prizes = 0;
    this.nonPrizes = 0;
    this.nonPrizesMissing = 0; //late
    this.count332 = 0;
    this.count323 = 0;
    this.count233 = 0;
  }
}
class groupStats {
  constructor() {
    this.mostUsed = new hlCar();
    this.mostWins = new hlCar();
    this.mostLoses = new hlCar();
    this.highWinRate = new hlCar(0, "%");
    this.highLoseRate = new hlCar(0, "%");
    this.oldest = new hlCar(0, " days");
    this.oldestNoUse = new hlCar(0, " days");
    this.mostUseDay = new hlCar(0, "/day");
    this.mostWinDay = new hlCar(0, "/day");
    this.mostLoseDay = new hlCar(0, "/day");
  }
}

export default {
  name: 'BaseMyGarage',
  components: {
    BaseCardGallery,
    BaseDialog,
    BaseFilterDialog,
    BaseFilterDescription,
    BaseIconSvg
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      lastestLoading: false,
      user: null,
      all_cars,
      all_cars_obj: {},
      highlightsUsers: {},
      carsReady: false,
      userGarage: {},
      myGarageFilterDialog: false,
      resolvedGuids: {},
      unsubscribe: null,
      saved: false,
      confirmDelete: {
        dialog: false,
        msg: "Confirm delete?",
        actionLabel: "Delete",
        action: null,
        loading: false,
        classe: ""
      },
      saved: false,
      blankFilterStr: "",
      userHighlights: [
        {
          fixed: true,
          filter: {},
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { newerThan: "2024-01-01T00:00:00.000Z" },
          t: new groupStats()
        },
        {
          filter: { classesModel: ["S"] },
          t: new groupStats()
        },
        {
          filter: { classesModel: ["A"] },
          t: new groupStats()
        },
        {
          filter: { classesModel: ["B"] },
          t: new groupStats()
        },
        // {
        //   fixed: true,
        //   filter: { classesModel: ["C"] },
        //   t: new groupStats(),
        //   r: new rarityStats()
        // },
        // {
        //   fixed: true,
        //   filter: { classesModel: ["D"] },
        //   t: new groupStats(),
        //   r: new rarityStats()
        // },
        // {
        //   fixed: true,
        //   filter: { classesModel: ["E"] },
        //   t: new groupStats(),
        //   r: new rarityStats()
        // },
        // {
        //   fixed: true,
        //   filter: { classesModel: ["F"] },
        //   t: new groupStats(),
        //   r: new rarityStats()
        // },
        // { filter: { tyresModel: ["Performance"] }, t: new groupStats() },
        { filter: { tyresModel: ["Standard"] }, t: new groupStats() },
        { filter: { tyresModel: ["All-surface"] }, t: new groupStats() },
        { filter: { tyresModel: ["Off-road"] }, t: new groupStats() },
        // { filter: { tyresModel: ["Slick"] }, t: new groupStats() },
        // { filter: { drivesModel: ["FWD"] }, t: new groupStats() },
        // { filter: { drivesModel: ["RWD"] }, t: new groupStats() },
        { filter: { drivesModel: ["4WD"] }, t: new groupStats() },
        // { filter: { clearancesModel: ["Low"] }, t: new groupStats() },
        { filter: { clearancesModel: ["Mid"] }, t: new groupStats() },
        { filter: { clearancesModel: ["High"] }, t: new groupStats() },
        { filter: { countrysModel: ["US"] }, t: new groupStats() },
        { filter: { countrysModel: ["DE"] }, t: new groupStats() },
        { filter: { countrysModel: ["JP"] }, t: new groupStats() },
        { filter: { countrysModel: ["GB"] }, t: new groupStats() },
        { filter: { countrysModel: ["IT"] }, t: new groupStats() },
        { filter: { countrysModel: ["FR"] }, t: new groupStats() },
        { filter: { countrysModel: ["AU"] }, t: new groupStats() },
        { filter: { countrysModel: ["SE"] }, t: new groupStats() },
        { filter: { countrysModel: ["KR"] }, t: new groupStats() },
        { filter: { countrysModel: ["CZ"] }, t: new groupStats() },
        { filter: { tagsModel: ["European Grand Tour"] }, t: new groupStats() },
        { filter: { tagsModel: ["American Overdrive"] }, t: new groupStats() },
        { filter: { tagsModel: ["European New Wave"] }, t: new groupStats() },
        { filter: { tagsModel: ["Asia-Pacific Grand Prix"] }, t: new groupStats() },
        { filter: { tagsModel: ["Pacific Coast Highway"] }, t: new groupStats() },
        { filter: { tagsModel: ["Learn the Savannah Way"] }, t: new groupStats() },
        { filter: { tagsModel: ["Loch to Loch"] }, t: new groupStats() },
        { filter: { tagsModel: ["Amalfi Coast Cruising"] }, t: new groupStats() },
        { filter: { tagsModel: ["Enter the Black Forest"] }, t: new groupStats() },
        { filter: { tagsModel: ["World Expo"] }, t: new groupStats() },
      ],
    }
  },
  watch: {},
  beforeCreate() {
    console.log(`${Math.round(window.performance.memory.usedJSHeapSize/1000000)} MB`);
  },
  beforeMount() {
    this.user = this.$store.state.user;
    this.getLastest();

    
  },
  mounted() {
    let vm = this;
    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
        if (vm.$route.name === "BaseMyGarage") {
          vm.load();
        }
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })

    this.generateBlankFilter();

    { // TEMP
    var t0 = performance.now();
    this.processSyncObj(myGarage);
    var t1 = performance.now();
    console.log(`${Math.round(t1 - t0)} ms • ${Math.round(window.performance.memory.usedJSHeapSize/1000000)} MB`);
    }
    
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    userId() {
      return this.$route.name === "BaseMyGarage" ? (this.user || {}).username : this.$route.params.username;
    },
    readyToSave() {
      if (!this.editEnabled) return false;
      console.log(0)
      if (this.saved) return false;
      console.log(1)
      return false

      return true;
    },
    editEnabled() {
      return this.user && this.user.username && (this.$route.name === "BaseMyGarage" || this.$route.params.username === this.user.username || this.user.username === "TiagoXavi");
    },
  },
  methods: {
    getLastest() {
      let vm = this;
      this.lastestLoading = true;


      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;

        this.highlightsUsers = Vue.resolveHighlightsUsers(res.data);

        let incomingCars = res.data.find(x => x.id === 'newCars').value;
        if (incomingCars && incomingCars.length > 0) {
          let rids = this.all_cars.map(x => x.rid);

          incomingCars.map(car => {
            if (!!(car.photoId && car.rq && car.onlyName && car.brand && car.country && car.year && car.clearance && car.topSpeed && car.hand && car.drive && car.tyres && car.weight && car.tags && car.bodyTypes && car.fuel && car.seats && car.engine)) {
              if (!rids.includes(car.rid)) {
                this.all_cars.push(car);
              }
            }
          })

          this.all_cars.sort((a,b) => {
            return b.rq - a.rq;
          })
        }


        this.load();


      })
      .catch(error => {
        this.lastestLoading = false;
        console.log(error);
      });

    },
    reload() {
      setTimeout(() => {
        this.load();
      }, 10);
    },
    load() {
      return;
      if (!this.userId) return;
      this.loading = true;

      axios.get(Vue.preUrlCharlie + `/garage/${this.userId}`)
      .then(res => {
        this.loading = false;
        this.saved = false;
        if (res.data && res.data.cars) {

          // this.cars = res.data.cars;
          // this.cars.map(car => {
          //   if (car.rid) {
          //   }
          //   if (car.videoUrl) {
          //     car.videoUrl = car.videoUrl.replace("http://", "https://");
          //   }
          // })

        } else {
          // 404
        }
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    save() {
      this.loading = true;

      axios.post(Vue.preUrl + "/updateGarage", params)
      .then(res => {
        this.loading = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
        });
        this.saved = true;

        // 

      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    addToResolvedGuids(guid) {
      if (!this.resolvedGuids[guid]) {
        let preCar = this.all_cars_obj[guid];
        if (preCar) {
          preCar.color = Vue.resolveClass(preCar.rq, preCar.class, "color");
          preCar.colorRgb = Vue.resolveClass(preCar.rq, preCar.class, "color", true);
          preCar.photo = this.cgResolvePhotoUrl(preCar);
          this.resolvedGuids[guid] = preCar;
        }
      }
    },
    cgResolvePhotoUrl(car) {
      try {
        if (car.photoId) return require('@/incoming_pics/' + decodeURI(car.photoId) + '.jpg')
        else return require('@/imgs_final/' + decodeURI(car.rid) + '.jpg')
      } catch (error) {
        return ''
      }
    },
    askDelete() {
      let vm = this;

      let action = function() {
        //
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete item '${item.name}'?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    processSyncObj(obj) {
      let isError;
      { // validation
        if (typeof obj !== "object") isError = "Not object";
        if (!obj.serverTime) isError = "No basic property";
        if (!obj.user) isError = "No user property";
        if (!obj.playerDeck || obj.playerDeck.length < 1) isError = "No playerDeck";
        if (!obj.wishlists || obj.wishlists.length !== 1) isError = "No wishlists";
        if (!obj.dailyGift) isError = "No dailyGift";
        if (isError) {
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: `Not a valid input: ${isError}`,
            type: "error"
          });
          return;
        }
      }

      this.userGarage = {
        date: obj.serverTime,
        socialName: obj.user.socialName,
        region: obj.user.region,
        registrationDate: obj.user.registrationDate,
        raceQuota: obj.user.raceQuota,
        eloScore: obj.user.eloScore,
        garageSlots: obj.user.garageSlots,
        garageSlotsUsed: obj.user.garageSlotsUsed,
        activeDaysCounter: obj.user.activeDaysCounter,
        platform: obj.user.platform,
        totalGiftsClaimed: obj.dailyGift.totalGiftsClaimed,
        wishlists: obj.wishlists[0]
      };

      this.userGarage.playerDeck = this.processPlayerDeck(obj.playerDeck);
    },
    processPlayerDeck(deck) {
      let result = [];
      if (!this.carsReady) this.transformAllCarsToObj();

      deck.map((hCar, icar) => {
        let tuneZ = this.resolveTuneZ(hCar)
        let item = {
          id: icar,
          cardId: hCar.cardId,
          selectedTuneZ: tuneZ,
          selectedTune: this.resolveTune(hCar, tuneZ),
          locked: hCar.locked,
          date: hCar.holdExpiresAt,
          fuseCompletesAt: hCar.fuseCompletesAt,
          cardWins: hCar.cardWins,
          cardLosses: hCar.cardLosses,
          cardDraws: hCar.cardDraws,
          legacyTier: hCar.legacyTier
        }
        result.push(item);



        // temp?
        this.addToResolvedGuids(hCar.cardId);
        if (icar < 500 || true) {
          this.updateHighLights(item);
        }
      })

      this.finishProcessPlayerDeck();

      return result;
    },
    updateHighLights(hCar) {
      this.userHighlights.map(hlItem => {
        this.updateHLItem(hlItem, hCar);
      })
    },
    updateHLItem(hlItem, hCar) {
      // 39 diferentes filtros
      // 4000 carros
      // 160.000 vezes vai passar nessa funcao, 195 se 5 carros


      // this.updateDialogFilter(hlItem.filter);
      // console.log("passei");

      let matchSpecial = true;
      if (hlItem.filter && hlItem.filter.newerThan) {
        if (new Date(hlItem.filter.newerThan) > new Date(hCar.date)) {
          matchSpecial = false;
        }
      }
      if (!matchSpecial) return;


      let match = this.matchFilter(this.resolvedGuids[hCar.cardId], hlItem.filter);
      if (match) {
        if (hlItem.r) { // rarity things
          hlItem.r["carCount"]++;
          if (this.resolvedGuids[hCar.cardId].prize) {
            hlItem.r["prizes"]++;
          } else {
            hlItem.r["nonPrizes"]++;
          }
          if (hCar.selectedTuneZ === "996") hlItem.r["count332"]++;
          if (hCar.selectedTuneZ === "969") hlItem.r["count323"]++;
          if (hCar.selectedTuneZ === "699") hlItem.r["count233"]++;
          if (hCar.selectedTuneZ.split("").reduce((a,b) => Number(a)+Number(b), 0) >= 24) {
            hlItem.r["fullyUpgraded"]++;
          }
        }
        
        // return;
        let usedTimes = hCar.cardWins+hCar.cardLosses+hCar.cardDraws;
        let ageInMinutes = (new Date() - new Date(hCar.date)) / 1000 / 60;
        

        Object.keys(hlItem.t).map(key => {
          if (key === "mostWins") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardWins, true, usedTimes);
          };
          if (key === "mostLoses") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardLosses, true, usedTimes);
          };
          if (key === "mostUsed") {
            this.compareHlItemBest(hlItem.t, key, hCar, usedTimes, true, usedTimes);
          };
          if (key === "highWinRate" && hCar.cardWins > 20) {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardWins/usedTimes*100, true, usedTimes);
          };
          if (key === "highLoseRate" && hCar.cardLosses > 20) {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardLosses/usedTimes*100, true, usedTimes);
          };

          if (key === "oldest") {
            this.compareHlItemBest(hlItem.t, key, hCar, ageInMinutes, true, usedTimes);
          };
          if (key === "oldestNoUse" && usedTimes === 0) {
            this.compareHlItemBest(hlItem.t, key, hCar, ageInMinutes, true, usedTimes);
          };
          if (key === "mostUseDay") {
            this.compareHlItemBest(hlItem.t, key, hCar, usedTimes/(ageInMinutes / 60 / 24), true, usedTimes);
          };
          if (key === "mostWinDay") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardWins/(ageInMinutes / 60 / 24), true, usedTimes);
          };
          if (key === "mostLoseDay") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardLosses/(ageInMinutes / 60 / 24), true, usedTimes);
          };
          
        })

      }
    },
    compareHlItemBest(statItem, hlKey, hCar, carValue, bigger = true, usedTimes) {
      let shouldReplace = false;
      if (bigger) {
        if (carValue > statItem[hlKey].v) {
          shouldReplace = true;
        }
      } else {
        if (carValue < statItem[hlKey].v) {
          shouldReplace = true;
        }
      }
      if (carValue === statItem[hlKey].v) { // draw
        if (usedTimes > statItem[hlKey].used) {
          shouldReplace = true;
        }
      }
      if (!bigger && statItem[hlKey].v === null) {
        shouldReplace = true;
      }
      if (shouldReplace) {
        statItem[hlKey].car = hCar;
        statItem[hlKey].v = carValue;
        statItem[hlKey].used = usedTimes;
      }
    },
    transformAllCarsToObj() {
      let key = "guid";
      all_cars.map(car => {
        this.all_cars_obj[car[key]] = car;
      });
      this.carsReady = true;
    },
    resolveTuneZ(hCar) {
      // 969 style
      646
      return `${((hCar.engineMajor-1)*3 + hCar.engineMinor)}`+
      `${((hCar.weightMajor-1)*3 + hCar.weightMinor)}`+
      `${((hCar.chassisMajor-1)*3 + hCar.chassisMinor)}`;
    },
    resolveTune(hCar, tuneZ) {
      // 323 style
      let res = null;

      if (
        tuneZ === "000" ||
        tuneZ === "333" ||
        tuneZ === "996" ||
        tuneZ === "969" ||
        tuneZ === "699"
      ) {
        res = Number(tuneZ / 3)
      }

      // let arr = tuneZ.split("");
      // if (
      //   Number(arr[0]) % 3 === 0 &&
      //   Number(arr[1]) % 3 === 0 &&
      //   Number(arr[2]) % 3 === 0
      // ) {
      //   res = Number(tuneZ / 3)
      // }
      
      // if (hCar.engineMinor % 3 === 0 && hCar.engineMinor % 3 === 0 && hCar.engineMinor % 3 === 0) {
      //   res = `${(hCar.engineMajor * hCar.engineMinor) / 3}`+
      //     `${(hCar.weightMajor * hCar.weightMinor) / 3}`+
      //     `${(hCar.chassisMajor * hCar.chassisMinor) / 3}`;
      // }

      return res;
    },
    finishProcessPlayerDeck() {
      this.userHighlights.map(hlItem => {
        if (hlItem.t) {
          hlItem.t["oldest"].v = hlItem.t["oldest"].v / 60 / 24; // convert minutes to days
          hlItem.t["oldestNoUse"].v = hlItem.t["oldestNoUse"].v / 60 / 24; // convert minutes to days

          {
            let C = hlItem.t["highWinRate"].car;
            hlItem.t["highWinRate"].sub = `${C.cardWins} wins, ${C.cardWins + C.cardLosses + C.cardDraws} uses`;
          }
          {
            let C = hlItem.t["highLoseRate"].car;
            hlItem.t["highLoseRate"].sub = `${C.cardLosses} loses, ${C.cardWins + C.cardLosses + C.cardDraws} uses`;
          }
        }
      })
    },
    matchFilter(car, context) {

      // between
      if ( context.yearModel && !this.filterCheckBetween(car.year, context.yearModel) ) return false;
      if (context.seatsModel && JSON.stringify(this.defaultFilters("seatsModel")) !== JSON.stringify(context.seatsModel)) {
        if ( !this.filterCheckBetween(car.seats, context.seatsModel) ) return false;
      }

      // includes
      if ( context.classesModel && !this.filterCheckIncludes(car.class, context.classesModel) ) return false;
      if ( context.tyresModel && !this.filterCheckIncludes(car.tyres, context.tyresModel) ) return false;
      if ( context.drivesModel && !this.filterCheckIncludes(car.drive, context.drivesModel) ) return false;
      if ( context.clearancesModel && !this.filterCheckIncludes(car.clearance, context.clearancesModel) ) return false;
      if ( context.countrysModel && !this.filterCheckIncludes(car.country, context.countrysModel) ) return false;

      if ( context.fuelModel && !this.filterCheckIncludes(car.fuel, context.fuelModel) ) return false;
      if ( context.engineModel && !this.filterCheckIncludes(car.engine, context.engineModel) ) return false;

      if ( context.bodyTypesModel && !this.filterCheckIncludesArray(car.bodyTypes, context.bodyTypesModel) ) return false;
      if ( context.tagsModel && !this.filterCheckIncludesArray(car.tags, context.tagsModel, car.rid) ) return false;
      if ( context.brandsModel && !this.filterCheckIncludes(car.brand, context.brandsModel) ) return false;

      if ( context.prizesModel && context.prizesModel.length > 0 ) {
        if ( car.prize && !context.prizesModel.includes("Prize Cars") ) return false;
        if ( !car.prize && !context.prizesModel.includes("Non-Prize Cars") ) return false;
      }



      return true;
    },
    filterCheckBetween(value, array) {
      return this.$refs.myGarageFilter.filterCheckBetween(value, array);
    },
    filterCheckIncludes(value, array) {
      return this.$refs.myGarageFilter.filterCheckIncludes(value, array);
    },
    filterCheckIncludesArray(valuesArray, array, rid) {
      return this.$refs.myGarageFilter.filterCheckIncludesArray(valuesArray, array, rid);
    },
    defaultFilters(type) {
      return this.$refs.myGarageFilter.defaultFilters(type);
    },
    updateDialogFilter(filter) {
      // this.$store.commit("MYGARAGE_INTERNALFILTER_IMPORT", { filter: filter });
      // vm.clearFilter();
      // vm.searchFilters = {
      //   ...vm.searchFilters,
      //   ...mutation.payload.filter
      // };
      this.$refs.myGarageFilter.searchFilters = {
        ...JSON.parse(this.blankFilterStr),
        ...filter
      }
      // vm.searchStr = "";
      // if (mutation.payload.filter.year2Model || mutation.payload.filter.seats2Model) {
      //   this.initSecretYear(true);
      // }
      // setTimeout(() => {
      //   vm.applyFilter();
      // }, 101);
    },
    generateBlankFilter() {
      this.$refs.myGarageFilter.clearFilter();
      this.blankFilterStr = JSON.stringify(this.$refs.myGarageFilter.searchFilters);
    }
    // matchFilterAttr(car) {
    //   if (!this.$refs.attrFilter.checkMatchFilter(car)) return false;
    //   if (!car.prize) return true;
    // },
  },
}
</script>

<style>
.BaseMyGarage_CardBox {
  width: 300px;
  height: 186px;
}
.BaseMyGarage_CardBox .BaseCardGallery_Header {
  /* transform: scale(0.5);
  transform-origin: top left; */
  margin: 0;
}
.BaseMyGarage_CardBox .Car_Header {
  position: static;
}
.BaseMyGarage_CardBox .Car_TuneTip {
  font-size: 13px;
}
.BaseMyGarage_CardsBox {
  height: calc((186px * 2) + 20px);
}
.BaseMyGarage_GalleryCard {
  
}
.BaseMyGarage_H {
  width: var(--wBody);
  max-width: var(--wBody);
  overflow-x: auto;
}
/* .Car_TuneTip {
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), 0.6);
  right: calc(var(--card-right-width) + 0px);
  bottom: 16px;
  font-size: 14px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 3px;
} */
.BaseMyGarage_HLBox {
  max-width: 800px;
  margin: 0 auto;
}
.BaseMyGarage_HLItem {

}
.BaseMyGarage_HLItem:not(:first-child) {
  margin-top: 30px;
}
.BaseMyGarage_FilterBox {
  margin-bottom: 7px;
}
.BaseMyGarage_RarityStatsBox {
  /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  width: 100%;
  gap: 7px;
  justify-content: center; */
  display: flex;
  flex-wrap: wrap;
  margin: 7px 0;
  justify-content: center;
  gap: 7px;
}
.BaseMyGarage_RarityStatsItem {
  min-width: 180px;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  /* width: 120px; */
  gap: 1px;
  justify-content: flex-start;
  padding: 2px 2px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
}
.BaseMyGarage_RarityStatsValue {
  /* padding: 8px 0px; */
  min-height: 53px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.BaseMyGarage_RarityStatsValueT {
  font-size: 31px;
  line-height: 0.8;
}
.BaseMyGarage_RarityStatsSub {
  font-size: 0.7em;
  opacity: 0.6;
}
.BaseMyGarage_RarityStatsName {
  font-size: 15px;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Layout {
  display: flex;
  justify-content: center;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Item {
  display: flex;
  gap: 0.23em;
  padding: 8px;
  background-color: #ffc5171c;
  border-radius: 10px;
  font-size: 20px;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Label {
  color: #a28117;
  font-size: inherit;
  padding-top: 0px;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Value {
  font-size: inherit;
}
.BaseMyGarage_RarityStatsItem .Row_DialogCardCard2 {
  --width: 180px !important;
  --height: 111px !important;
  --card-font-size: 9px;
  border-radius: 5px;
  margin: 0;
}
.BaseMyGarage_CarPlaceHolder {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: #454545;
}
.BaseMyGarage_RarityStatsCard {
  padding: 8px 0px;
}
</style>