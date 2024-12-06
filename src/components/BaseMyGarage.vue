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
              :tuneText="item.selectedTune"
              class="BaseMyGarage_GalleryCard" />
          </div>
        </template>
      </RecycleScroller>
    </div>


    <div class="BaseMyGarage_HLBox">
      <div v-for="hl in userHighlights" class="BaseMyGarage_HLItem">
        <div class="BaseMyGarage_Title">
          <BaseFilterDescription
            :filter="hl.filter"
            :asFilterLabel="true"
            :hideIfEmpty="false"
            :emitDescResolved="false"
            class="" />
        </div>
        
        <div v-if="hl.r" class="BaseMyGarage_RarityStatsBox">
          <template v-for="(value, key, index) in hl.r">
            <div class="BaseMyGarage_">{{ key }}: {{ value }}</div>
          </template>
        </div>
        
        <div v-if="hl.t" class="BaseMyGarage_RarityStatsBox">
          <template v-for="(value, key, index) in hl.t">
            <div class="BaseMyGarage_">
              {{ key }}:
              <template v-if="value.car.cardId">
                <span>{{ resolvedGuids[value.car.cardId].name }} </span>
                <span v-if="key.includes('Rate')">({{ Math.round(value.v) }}%)</span>
                <span v-else>({{ value.v }})</span>
              </template>
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
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';
import myGarage from '@/database/hutch_myGarage.json';
import all_cars from '../database/cars_final.json';
import BaseCardGallery from './BaseCardGallery.vue';
import BaseDialog from './BaseDialog.vue';
import BaseFilterDialog from './BaseFilterDialog.vue';
import BaseFilterDescription from './BaseFilterDescription.vue';

class hlCar {
  constructor(initialValue = 0) {
    this.car = {};
    this.v = initialValue;
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
    this.mostWins = new hlCar();
    this.mostLoses = new hlCar();
    this.mostUsed = new hlCar();
    this.bestWinRate = new hlCar();
    this.worstWinRate = new hlCar(100);
  }
}

export default {
  name: 'BaseMyGarage',
  components: {
    BaseCardGallery,
    BaseDialog,
    BaseFilterDialog,
    BaseFilterDescription
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
      carsReady: false,
      userGarage: {},
      myGarageFilterDialog: false,
      userHighlights: [
        {
          fixed: true,
          filter: {},
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { classesModel: ["S"] },
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { classesModel: ["A"] },
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { classesModel: ["B"] },
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { classesModel: ["C"] },
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { classesModel: ["D"] },
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { classesModel: ["E"] },
          t: new groupStats(),
          r: new rarityStats()
        },
        {
          fixed: true,
          filter: { classesModel: ["F"] },
          t: new groupStats(),
          r: new rarityStats()
        },
        { filter: { tyresModel: ["Performance"] }, t: new groupStats() },
        { filter: { tyresModel: ["Standard"] }, t: new groupStats() },
        { filter: { tyresModel: ["All-surface"] }, t: new groupStats() },
        { filter: { tyresModel: ["Off-road"] }, t: new groupStats() },
        { filter: { tyresModel: ["Slick"] }, t: new groupStats() },
        { filter: { drivesModel: ["FWD"] }, t: new groupStats() },
        { filter: { drivesModel: ["RWD"] }, t: new groupStats() },
        { filter: { drivesModel: ["4WD"] }, t: new groupStats() },
        { filter: { clearancesModel: ["Low"] }, t: new groupStats() },
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
    }
  },
  watch: {},
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

    { // TEMP
      this.processSyncObj(myGarage);
    }
    
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    userId() {
      return this.$route.name === "BaseMyGarage" ? (this.user || {}).username : this.$route.params.username;
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
        let item = {
          id: icar,
          cardId: hCar.cardId,
          selectedTune: this.resolveTune(hCar),
          locked: hCar.locked,
          dateStateChanged: hCar.dateStateChanged,
          fuseCompletesAt: hCar.fuseCompletesAt,
          cardWins: hCar.cardWins,
          cardLosses: hCar.cardLosses,
          cardDraws: hCar.cardDraws,
          legacyTier: hCar.legacyTier
        }
        result.push(item);



        // temp?
        this.addToResolvedGuids(hCar.cardId);
        if (icar < 5) {
          this.updateHighLights(hCar);
        }
      })

      return result;
    },
    updateHighLights(hCar) {
      this.userHighlights.map(hlItem => {
        this.updateHLItem(hlItem, hCar);
      })
    },
    updateHLItem(hlItem, hCar) {
      this.updateDialogFilter(hlItem.filter);
      console.log("passei");
      let match = this.matchFilter(this.resolvedGuids[hCar.cardId]);
      if (match) {
        if (hlItem.r) { // rarity things
          hlItem.r["carCount"]++;
          if (this.resolvedGuids[hCar.cardId].prize) {
            hlItem.r["prizes"]++;
          } else {
            hlItem.r["nonPrizes"]++;
          }
          let tune = `${(hCar.engineMajor * hCar.engineMinor)}`+
            `${(hCar.weightMajor * hCar.weightMinor)}`+
            `${(hCar.chassisMajor * hCar.chassisMinor)}`;
          if (tune === "996") hlItem.r["count332"]++;
          if (tune === "969") hlItem.r["count323"]++;
          if (tune === "699") hlItem.r["count233"]++;
          if (tune.split("").reduce((a,b) => Number(a)+Number(b), 0) >= 24) {
            hlItem.r["fullyUpgraded"]++;
          }
        }
        
        // return;
        let usedTimes = hCar.cardWins+hCar.cardLosses+hCar.cardDraws;
        

        Object.keys(hlItem.t).map(key => {
          if (key === "mostWins") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardWins, true);
          };
          if (key === "mostLoses") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardLosses, true);
          };
          if (key === "mostUsed") {
            this.compareHlItemBest(hlItem.t, key, hCar, usedTimes, true);
          };
          if (key === "bestWinRate") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardWins/usedTimes*100, true);
          };
          if (key === "worstWinRate") {
            this.compareHlItemBest(hlItem.t, key, hCar, hCar.cardWins/usedTimes*100, false);
          };
          
        })
      }
    },
    compareHlItemBest(statItem, hlKey, hCar, carValue, bigger = true) {
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
      if (shouldReplace) {
        statItem[hlKey].car = hCar;
        statItem[hlKey].v = carValue;
      }
    },
    transformAllCarsToObj() {
      let key = "guid";
      all_cars.map(car => {
        this.all_cars_obj[car[key]] = car;
      });
      this.carsReady = true;
    },
    resolveTune(hCar) {
      let tune;
      if (hCar.engineMinor % 3 === 0 && hCar.engineMinor % 3 === 0 && hCar.engineMinor % 3 === 0) {
        // 323 style
        tune = `${(hCar.engineMajor * hCar.engineMinor) / 3}`+
          `${(hCar.weightMajor * hCar.weightMinor) / 3}`+
          `${(hCar.chassisMajor * hCar.chassisMinor) / 3}`;
      } else {
        // 969 style
        tune = `${(hCar.engineMajor * hCar.engineMinor)}`+
          `${(hCar.weightMajor * hCar.weightMinor)}`+
          `${(hCar.chassisMajor * hCar.chassisMinor)}`;
      }
      return tune;
    },
    matchFilter(TDRcar) {
      if (!this.$refs.myGarageFilter.checkMatchFilter(TDRcar)) return false;
      return true;
    },
    updateDialogFilter(filter) {
      this.$store.commit("MYGARAGE_INTERNALFILTER_IMPORT", { filter: filter });
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
</style>