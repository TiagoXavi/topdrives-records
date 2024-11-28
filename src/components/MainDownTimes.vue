<template>
  <div class="MainDownTimes_Layout">
    <div class="MainDownTimes_BlockBack" @click.stop="outsideClick()"></div>
    <div class="MainDownTimes_Header">
      <!-- <BaseConfigCheckBox
        v-model="showBigCards"
        style="margin-top: 3px;"
        class="Main_ChartTrackBox"
        name="showBigCards"
        :label="$t('m_showBigCards')" /> -->
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
              :class="`${ confirmDelete.loading ? 'D_Button_Loading ' : '' }`+
                      `${ confirmDelete.classe }`"
              :disabled="confirmDelete.loading"
              class="D_Button Main_OptionsButton"
              @click="confirmDelete.action">
              <span>{{ confirmDelete.actionLabel }}</span>
            </button>
          </div>
        </div>
      </BaseDialog>
    </div>
    <div v-if="showCarsFix" class="MainDownTimes_Body">
      <div class="MainDownTimes_ D_Center2" style="position: relative; margin-bottom: 20px;">
        <button
          v-if="user && user.username === 'TiagoXavi'"
          class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
          @click="askDeleteAllTimes()">
          Delete all
        </button>
      </div>
      <div v-for="(car, rid) in downTimes" class="MainDownTimes_Car">
        <div class="MainDownTimes_CarTop">
          <div :class="{ MainDownTimes_BodyBig: showBigCards }" class="MainDownTimes_CarBody">
            <div
              :style="`--color: ${all_cars_obj[rid].color}`"
              class="MainDownTimes_CarItem">
              <!-- <BaseCardGallery
                v-if="showBigCards"
                :car="car[0].car"
                :options="false"
                class="MainDownTimes_GalleryCard" /> -->
              <BaseCard
                v-if="showBigCards"
                :car="all_cars_obj[rid].car"
                :fix-back="true"
                :downloadLoading="false"
                :needSave="false"
                :cg="true"
                :cgOppo="false"
                :hideClose="true"
                :showResetTune="true"
                @refreshTune="exportCar(car)"
                @delete="race.car = undefined; race.rid = null; calcRaceResult(race);" />
              <div v-else class="MainDownTimes_CarCard">
                <div class="MainDownTimes_BankPhoto">
                  <img :src="all_cars_obj[rid].photo" class="MainDownTimes_BankPhotoImg" loading="lazy" alt="">
                </div>
                <div class="MainDownTimes_RQ">{{ all_cars_obj[rid].rq }}</div>
              </div>
              <!-- <div class="MainDownTimes_Right">
                <div class="MainDownTimes_Desc">{{ car.location }}</div>
                <div :class="`MainDownTimes_Chance_${car.chance}`" class="MainDownTimes_Chance">{{ car.chance }}</div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="MainDownTimes_CarBottom">
          <div v-for="item in car" class="MainDownTimes_CarTime">
            <div class="MainDownTimes_CarLeft">{{ item.selectedTune }}</div>
            <div class="MainDownTimes_CarRight">
              <Row
                :list="item.resolvedTracks"
                :loggedin="!!user"
                :user="user"
                :options="user && user.mod"
                :cg="true"
                class="Cg_TrackBox"
                type="tracks" />
              <Row
                :car="item"
                :list="item.resolvedTracks"
                :loggedin="!!user"
                :user="user"
                :voteLoading="voteLoading"
                :cg="true"
                :cgOppo="false"
                :cgTime="item.time"
                :customData="all_cars_obj[rid].car.data"
                :forceDisabled="!user || !user.mod"
                type="times"
                @deleteTime="deleteTime(item, $event)"
                @changeTime="changeTime(all_cars_obj[rid].car, $event)" />
              <div v-if="all_cars_obj[rid].car.dataToSave" class="MainDownTimes_SaveBox">
                <button
                  :class="{ D_Button_Loading: ridLoading === rid }"
                  class="D_Button Main_SaveAllButton"
                  @click="saveRid(rid)">{{ $t("m_save") }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCardGallery from './BaseCardGallery.vue'
import BaseCard from './BaseCard.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'
import Row from './Row.vue'
import BaseDialog from './BaseDialog.vue'
import all_cars from '../database/cars_final.json'
import tracksRepo from '../database/tracks_repo.json'
import campaign from '../database/campaign.json'

export default {
  name: 'MainDownTimes',
  components: {
    BaseCardGallery,
    BaseConfigCheckBox,
    Row,
    BaseCard,
    BaseDialog
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
      ridLoading: null,
      downTimes: {},
      downTimesClear: {},
      all_cars,
      all_cars_obj: {},
      showBigCards: true,
      tracksRepo,
      campaign,
      user: null,
      unsubscribe: null,
      voteLoading: false,
      confirmDelete: {
        dialog: false,
        msg: "Confirm delete?",
        actionLabel: "Delete",
        action: null,
        loading: false,
        classe: ""
      },
      showCarsFix: true,
    }
  },
  watch: {},
  beforeMount() {
    // let showBigCards = window.localStorage.getItem("showBigCards");
    // if (showBigCards) {
    //   showBigCards = JSON.parse(showBigCards);
    //   this.showBigCards = showBigCards;
    // }
    this.all_cars.map(x => {
      this.all_cars_obj[x.rid] = x;
    })
  },
  mounted() {
    let vm = this;
    this.getDownTimes();
    this.user = this.$store.state.user;

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    userTimes() {
      return this.$route.params.username;
    }
  },
  methods: {
    getDownTimes() {
      this.loading = false;
      let vm = this;

      let url = "/downTimes";
      if (this.userTimes) url = `/timesUser/${this.userTimes}`;

      axios.get(Vue.preUrl + url)
      .then(res => {
        this.downTimes = res.data;
        this.downTimesClear = {};
        Object.keys(this.downTimes).map(rid => {
          this.downTimesClear[rid] = this.downTimes[rid].map(x => {
            return {
              rid: x.rid,
              selectedTune: x.selectedTune,
              track: x.track
            }
          })
          this.frontCompleteCar(this.all_cars_obj[rid]);
          this.buildDataStructure(this.all_cars_obj[rid], this.downTimes[rid]);
          this.downTimes[rid].map(downtime => {
            // downtime.car.selectedTune = downtime.selectedTune;
            Vue.set(downtime, "resolvedTracks", this.validateTracks([downtime.track]));

            if (true) { //campaign
              let currentTracksOptions = [];
              let options = [];
              this.campaign.map((city, icity) => {
                city.matches.map((match, imatch) => {
                  match.races.map((rac, irace) => {
                    if (rac.name === downtime.track) {
                      options.push({
                        city: city.name,
                        icity,
                        imatch,
                        irace,
                        code: `${icity}${imatch}`
                      })
                    }
                  })
                })
              })
              currentTracksOptions.push(options);
  
              // delivery best option
              downtime.resolvedTracks.map((x, ix) => {
                let bestOption;
                currentTracksOptions[ix].map(y => {
                  if (
                    !bestOption ||
                    this.isChamp(bestOption.city) && !this.isChamp(y.city) ||
                    y.irace < bestOption.irace && !this.isChamp(y.city) ||
                    (y.irace <= bestOption.irace && y.icity > bestOption.icity) ||
                    (y.irace <= bestOption.irace && y.imatch > bestOption.imatch)
                  ) {
                    bestOption = y;
                  }
                })
                if (bestOption) {
                  x.campaign = `${bestOption.city} ${bestOption.imatch+1}`
                } else {
                  x.campaign = `Not in campaign`;
                }
              })
            }

          })
        })
        this.showCarsFix = false;
        this.$nextTick().then(() => {
          this.showCarsFix = true;
        })
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
      })
    },
    cgResolvePhotoUrl(car) {
      try {
        if (car.photoId) return require('@/incoming_pics/' + decodeURI(car.photoId) + '.jpg')
        else return require('@/imgs_final/' + decodeURI(car.rid) + '.jpg')
      } catch (error) {
        return ''
      }
    },
    validateTracks(tracks, group = false) {
      let tracksClear = [];
      let groupName;
      let groupType;
      let tracksetGroup = [];

      tracks.map(x => {
        this.tracksRepo.find(circuit => {
          circuit.types.find(type => {
            if (x === `${circuit.id}_a${type}`) {
              if (group && circuit.group) {
                groupName = circuit.group;
                groupType = type;
              } else {
                tracksClear.push( { name: circuit.name, id: circuit.id, surface: type[0], cond: type[1], code: `${circuit.id}_a${type}` } );
              }
              return true;
            }
          })
        })
      })
      if (!group) {
        return tracksClear;
      } else {
        // repeat
        this.tracksRepo.map(circuit => {
          if (groupName === circuit.group && circuit.types.includes(groupType)) {
            tracksetGroup.push(`${circuit.id}_a${groupType}`)
          }
        })
        this.toggleTrackSet(tracksetGroup);
      }
    },
    isChamp(str) {
      return str.startsWith("SN") || str.startsWith("YB");
    },
    changeTime(carObj, e) {
      let vm = this;
      let car = carObj.car;
      let tune = carObj.selectedTune;
      let track = carObj.track;
      let number = e.number;

      /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
      /**/ if (!car.dataToSave[tune]) Vue.set(car.dataToSave, tune, {});
      /**/ if (!car.dataToSave[tune].times) Vue.set(car.dataToSave[tune], "times", {});
      /**/ if (!car.dataToSave[tune].times[track]) Vue.set(car.dataToSave[tune].times, track, {});

      Vue.set(car.data[tune].times[track], "t", number);
      Vue.set(car.data[tune].times[track], "u", vm.user.username);
      Vue.set(car.data[tune].times[track], "down", []);
      Vue.set(car.data[tune].times[track], "up", []);
      /**/ Vue.set(car.dataToSave[tune].times[track], "t", number);
      
    },
    deleteTime(item, event) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.ridLoading = item.rid;

        axios.post(Vue.preUrl + "/deleteTime", {
          rid: item.rid,
          tune: item.selectedTune,
          track: item.track,
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.getDownTimes();

          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: vm.$t('m_deleteSuccess')
          });
        })
        .catch(error => {
          console.log(error);
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          vm.ridLoading = null;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete '${item.track}' time of ${item.rid}?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    saveRid(rid) {
      this.ridLoading = rid;

      let resolved = [];
      this.downTimes[rid].map(down => {
        if (down.car.dataToSave) {
          resolved.push({
            rid: rid,
            data: down.car.dataToSave
          })
        }
      })

      axios.post(Vue.preUrl + "/update", resolved)
      .then(res => {
        this.getDownTimes();
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.ridLoading = null;
      });

    },
    outsideClick() {
      this.$store.commit("HIDE_DETAIL");
    },
    askDeleteAllTimes() {
      let vm = this;

      let action = function() {
        vm.deleteAllTimes();
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete all times?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    deleteAllTimes() {
      this.loading = true;
      this.confirmDelete.loading = true;

      let params = {
        items: this.downTimesClear
      }

      axios.post(Vue.preUrl + "/deleteCollectionOfTimes", params)
      .then(res => {
        this.loading = false;
        this.confirmDelete.dialog = false;
        this.confirmDelete.loading = false;

      })
      .catch(error => {
        this.loading = false;
        this.confirmDelete.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    exportCar(car) {

      let tunesList = [];
      car.map(x => {
        tunesList.push(x.selectedTune);
      })
      tunesList = [...new Set(tunesList)];

      tunesList.map(tune => {
        let url = `${window.location.origin}?share=`;

        car.map(x => {
          if (x.selectedTune !== tune) return;
          url += `~K${x.track}`;
        })

        url += `~C${car[0].rid}~T${tune}`;
        console.log(url);
      })
    },
    frontCompleteCar(car) {
      Vue.set(car, "photo", this.cgResolvePhotoUrl(car));
      Vue.set(car, "car", JSON.parse(JSON.stringify(this.all_cars.find(x => x.rid === car.rid))));
      Vue.set(car, "color", Vue.resolveClass(car.car.rq, car.car.class, "color"));
    },
    buildDataStructure(car, downtime) {
      let track = downtime.track;
      let tune = downtime.selectedTune;

      if (!car.data) Vue.set(car, "data", {});
      if (!car.data[tune]) Vue.set(car.data, tune, {});
      if (!car.data[tune].times) Vue.set(car.data[tune], "times", {});
      if (!car.data[tune].times[track]) Vue.set(car.data[tune].times, track, {});

      Vue.set(car.data[tune].times[track], "t", downtime.time);
      Vue.set(car.data[tune].times[track], "u", downtime.user);
      Vue.set(car.data[tune].times[track], "down", downtime.down || []);
      Vue.set(car.data[tune].times[track], "up", downtime.up || []);
    }
  },
}
</script>

<style>
.MainDownTimes_Layout {
  position: relative;
}
.MainDownTimes_BlockBack {
  position: absolute;
  height: 100%;
  width: 100;
  left: 0;
  right: 0;
  background-color: transparent;
}
.MainDownTimes_Body {
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  max-width: 550px;
}
.MainDownTimes_BodyBig {
  max-width: 470px;
}
.MainDownTimes_Right {
  display: contents;
}
.MainDownTimes_BodyBig .MainDownTimes_Right {
  display: block;
}
.MainDownTimes_Header {
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 20px;
}
.Main_ChartFilter {
  height: 120px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 17px;
  background-color: rgba(0,0,0,.1);
  padding: 10px;
  overflow-y: auto;
}
.Main_ChartAnalyzeButton {
  margin: 0 auto;
  margin-top: 17px;
}
.MainDownTimes_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.MainDownTimes_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.MainDownTimes_CarCard {
  position: relative;
}
.MainDownTimes_Car {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}
.MainDownTimes_RQ {
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
.MainDownTimes_Desc {
  flex-grow: 1;
}
.MainDownTimes_Empty {
  text-align: center;
}
.MainDownTimes_CarTime {
  display: flex;
  align-items: center;
  gap: 5px;
}
.MainDownTimes_CarRight {
  width: var(--cell-width);
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
  position: relative;
}
.MainDownTimes_CarItem {
  width: var(--cell-width);
}
.MainDownTimes_SaveBox {
  display: flex;
  justify-content: center;
  position: absolute;
  left: calc(100% + 10px);
  height: 100%;
  align-items: center;
  top: 0;
}

@media only screen and (max-width: 767px) {
  .MainDownTimes_Car {
    flex-direction: column;
    margin-bottom: 50px;
    gap: 0px;
  }
  .MainDownTimes_CarLeft {
      margin-left: -36px;
  }
}
</style>