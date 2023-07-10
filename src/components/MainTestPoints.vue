<template>
  <div class="MainTestPoints_Layout">
    <div class="MainTestPoints_BlockBack" @click.stop="outsideClick()"></div>
    <div v-if="showCarsFix" class="MainTestPoints_Header">
      <div class="Cg_Track">
        <Row
          v-if="chartTrack"
          :list="[chartTrack]"
          :loggedin="!!user"
          :user="user"
          :options="true"
          :cg="true"
          :normalSize="true"
          class="Cg_TrackBox"
          type="tracks" />
        <button
          :class="{ Cg_SelectTrackButtonEdit: chartTrack }"
          class="D_Button Car_AddButton Cg_SelectTrackButton"
          @click="openDialogTrackSearch();">
          <i v-if="chartTrack" class="ticon-pencil Cg_SelectTrackButtonIcon" aria-hidden="true"/>
          <span v-else>{{ $t("m_selectTrack") }}</span>
        </button>
      </div>
      <!-- <BaseConfigCheckBox
        v-model="showBigCards"
        style="margin-top: 3px;"
        class="Main_ChartTrackBox"
        name="showBigCards"
        :label="$t('m_showBigCards')" /> -->
      <!-- <BaseDialog
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
      </BaseDialog> -->
      <div class="MainTestPoints_Time">
        <div class="MainTestPoints_TimeLeft">Your time: </div>
        <Row
          :car="fakeCar1"
          :list="[chartTrack]"
          :loggedin="!!user"
          :user="user"
          :voteLoading="voteLoading"
          :cg="true"
          :cgOppo="true"
          :cgTime="fakeTime1"
          :forceDisabled="!user || !user.mod || !chartTrack"
          :forceCustomAuthor="true"
          :customData="fakeCustomData1"
          placeholder="Time 1"
          type="times"
          @deleteTime="deleteTime(fakeCar1, $event)"
          @changeTime="changeTime(fakeCar1, $event)" />
      </div>
      <div class="MainTestPoints_Time">
        <div class="MainTestPoints_TimeLeft">Oppo time: </div>
        <Row
          :car="fakeCar2"
          :list="[chartTrack]"
          :loggedin="!!user"
          :user="user"
          :voteLoading="voteLoading"
          :cg="true"
          :cgOppo="true"
          :cgTime="fakeTime2"
          :forceDisabled="!user || !user.mod || !chartTrack"
          :forceCustomAuthor="true"
          :customData="fakeCustomData2"
          placeholder="Time 2"
          type="times"
          @deleteTime="deleteTime(fakeCar2, $event)"
          @changeTime="changeTime(fakeCar2, $event)" />
      </div>
      <div v-if="pointsResult" class="MainTestPoints_Result">
        <div class="MainTestPoints_ResultTdr">
          <div class="BaseText_Label">Points:</div>
          <div :class="{ MainTestPoints_ResultTdrPointsLose: pointsResult.v < 0 }" class="MainTestPoints_ResultTdrPoints">{{ pointsResult.i ? "~" : "" }}{{ pointsResult.v }}</div>
        </div>
        <div class="MainTestPoints_ResultByUser">
          <BaseText
            v-model="informCorrectPoints"
            class="BaseText_Big"
            iid="correctPoints"
            label="Incorrect points?"
            type="integer"
            placeholder="" />
        </div>
      </div>
      <div v-if="pointsResult" class="MainTestPoints_FactorsBox" style="margin-top: 30px;">
        <div class="MainTestPoints_Factor">'{{ $t(`t_${chartTrack.id}`) }}' factor: <b>{{ currentTrackFactor }}</b></div>
      </div>
      <div v-if="pointsResult && informCorrectPoints && !isNaN(informCorrectPoints)" class="MainTestPoints_FactorsBox">
        <div class="MainTestPoints_Factor">New track factor: <b>~{{ fixedTrackFactor }}</b></div>
      </div>
      <div v-if="campaignList.length > 0" class="MainTestPoints_FactorsBox">
        <div v-for="item in campaignList" class="MainTestPoints_Factor">{{ item }}</div>
      </div>
    </div>



    <BaseSearchTrackDialog
      :active="customTrackDialog"
      @close="closeDialogTrackSearch()"
      @toggleTrack="toggleTrack($event.track, $event.e)"
      @resolved="getResolvedTrack($event)"
    />

  </div>
</template>

<script>
import BaseSearchTrackDialog from './BaseSearchTrackDialog.vue'
import BaseCardGallery from './BaseCardGallery.vue'
import BaseCard from './BaseCard.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'
import Row from './Row.vue'
import BaseDialog from './BaseDialog.vue'
import BaseText from './BaseText.vue'
import all_cars from '../database/cars_final.json'
import tracksRepo from '../database/tracks_repo.json'
import campaign from '../database/campaign.json'
import tracks_factor from '../database/tracks_factor.json'

export default {
  name: 'MainTestPoints',
  components: {
    BaseCardGallery,
    BaseConfigCheckBox,
    Row,
    BaseCard,
    BaseDialog,
    BaseSearchTrackDialog,
    BaseText
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
      all_cars,
      all_cars_obj: {},
      showBigCards: true,
      chartTrack: false,
      customTrackDialog: false,
      tracksRepo,
      campaign,
      tracks_factor,
      user: null,
      unsubscribe: null,
      asMod: false,
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
      fakeCar1: {
        rid: "fake1",
        selectedTune: "Other"
      },
      fakeCustomData1: {},
      fakeTime1: undefined,
      fakeCar2: {
        rid: "fake2",
        selectedTune: "Other"
      },
      fakeCustomData2: {},
      fakeTime2: undefined,
      informCorrectPoints: null,
      showCarsFix: true,
      campaignList: []
    }
  },
  watch: {
    chartTrack() {
      this.changedTrack();
    }
  },
  beforeMount() {
    // let showBigCards = window.localStorage.getItem("showBigCards");
    // if (showBigCards) {
    //   showBigCards = JSON.parse(showBigCards);
    //   this.showBigCards = showBigCards;
    // }
    // this.all_cars.map(x => {
    //   this.all_cars_obj[x.rid] = x;
    // })
  },
  mounted() {
    let vm = this;
    // this.getDownTimes();
    this.user = { "username": "fake", "mod": true };
    this.asMod = true;

    // this.chartTrack = {"id":"drag100","surface":"0","cond":"0","code":"drag100_a00","campaign":"IT Milan 10"}
    // this.fakeTime1 = 10.1;
    // this.fakeTime2 = 12;
    // this.informCorrectPoints = "90";

    // vm.unsubscribe = vm.$store.subscribe(mutation => {

    //   if (mutation.type == "CHANGE_USER") {
    //     vm.user = mutation.payload.user;
    //     vm.asMod = mutation.payload.asMod;
    //   }

    //   if (mutation.type == "LOGOUT") {
    //     vm.user = null;
    //     vm.asMod = false;
    //   }

    // })
  },
  beforeDestroy() {
    // this.unsubscribe();
  },
  computed: {
    currentTrackFactor() {
      if (!this.chartTrack) return;
      return this.tracks_factor[this.chartTrack.id];
    },
    fixedTrackFactor() {
      if (!this.chartTrack) return;
      if (!this.informCorrectPoints) return;
      if (!this.fakeTime1) return;
      if (!this.fakeTime2) return;

      let wt = Math.min(this.fakeTime1, this.fakeTime2);
      let lt = Math.max(this.fakeTime1, this.fakeTime2);
      let points = this.informCorrectPoints;
      let newFactor = points / (-wt/lt + 1);

      return Math.round(newFactor);
    },
    pointsResult() {
      if (!this.chartTrack) return;
      if (!this.fakeTime1) return;
      if (!this.fakeTime2) return;

      return Vue.options.filters.userPoints(this.fakeTime1, this.fakeTime2, this.chartTrack.code)
    }
  },
  methods: {
    changedTrack() {
      // if (this.fakeTime1 !== undefined) {
      //   this.fakeCar1.data.Other.times = {};
      //   Vue.set(this.fakeCar1.data.Other.times, this.chartTrack.code, this.fakeTime1);
      //   Vue.set(this.fakeCar1.data.Other.times, `${this.chartTrack.code}_user`, this.user.username);
      // }
      // if (this.fakeTime2 !== undefined) {
      //   this.fakeCar2.data.Other.times = {};
      //   Vue.set(this.fakeCar2.data.Other.times, this.chartTrack.code, this.fakeTime2);
      //   Vue.set(this.fakeCar2.data.Other.times, `${this.chartTrack.code}_user`, this.user.username);
      // }
      delete this.fakeCar1.data;
      delete this.fakeCar2.data;
      this.fakeTime1 = undefined;
      this.fakeTime2 = undefined;
      this.informCorrectPoints = null;


      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
        this.$nextTick().then(() => {
          document.querySelector("div.MainTestPoints_Header > div:nth-child(2) div.Row_Content").focus();
        })
      })
      this.listOptions();
    },
    openDialogTrackSearch() {
      this.customTrackDialog = true;
      setTimeout(() => {
        try {
          document.querySelector("#SearchTrackInput").focus();  
        } catch (error) {}
      }, 10);
    },
    closeDialogTrackSearch() {
      this.customTrackDialog = false;
      this.searchTracks = '';
    },
    toggleTrack(track, e = {}) {
      this.closeDialogTrackSearch();
    },
    getResolvedTrack(track) {
      this.chartTrack = track;
    },
    listOptions() {
      // list all options
      let currentTracksOptions = [];
      let options = [];
      this.campaign.map((city, icity) => {
        city.matches.map((match, imatch) => {
          match.races.map((rac, irace) => {
            if (rac.name === this.chartTrack.code) {
              options.push(`${city.name} ${imatch+1} r${irace+1}`)
            }
          })
        })
      })

      this.campaignList = options;

      // this.loading = false;
      // let vm = this;

      // axios.get(Vue.preUrl + "/downTimes")
      // .then(res => {
      //   this.downTimes = res.data;
      //   Object.keys(this.downTimes).map(rid => {
      //     this.all_cars_obj[rid].color = Vue.resolveClass(this.all_cars_obj[rid].rq, this.all_cars_obj[rid].class, "color");
      //     this.all_cars_obj[rid].photo = this.cgResolvePhotoUrl(rid);
      //     this.downTimes[rid].map(downtime => {
      //       downtime.car.selectedTune = downtime.selectedTune;

      //       Vue.set(downtime, "resolvedTracks", this.validateTracks([downtime.track]));

            
      //       currentTracksOptions.push(options);

      //       // delivery best option
      //       downtime.resolvedTracks.map((x, ix) => {
      //         let bestOption;
      //         currentTracksOptions[ix].map(y => {
      //           if (
      //             !bestOption ||
      //             this.isChamp(bestOption.city) && !this.isChamp(y.city) ||
      //             y.irace < bestOption.irace && !this.isChamp(y.city) ||
      //             this.isChamp(bestOption.city) && this.isChamp(y.city) && y.icity > bestOption.icity ||
      //             (y.irace <= bestOption.irace && y.icity > bestOption.icity) ||
      //             (y.irace <= bestOption.irace && y.imatch > bestOption.imatch)
      //           ) {
      //             bestOption = y;
      //           }
      //         })
      //         if (bestOption) {
      //           x.campaign = `${bestOption.city} ${bestOption.imatch+1}`
      //         } else {
      //           x.campaign = `Not in campaign`;
      //         }
      //       })

      //     })
      //   })
      //   this.showCarsFix = false;
      //   this.$nextTick().then(() => {
      //     this.showCarsFix = true;
      //   })
      // })
      // .catch(error => {
      //   this.loading = false;
      //   console.log(error);
      // })
    },
    cgResolvePhotoUrl(rid) {
      try {
        return require('@/imgs_final/' + decodeURI(rid) + '.jpg')
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
    changeTime(car, e) {
      let vm = this;
      let tune = car.selectedTune;
      let track = this.chartTrack.code;
      let number = e.number;

      if (!car.data) Vue.set(car, "data", {});
      if (!car.data[tune]) Vue.set(car.data, tune, {});
      if (!car.data[tune].times) Vue.set(car.data[tune], "times", {});
      /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
      /**/ if (!car.dataToSave[tune]) Vue.set(car.dataToSave, tune, {});
      /**/ if (!car.dataToSave[tune].times) Vue.set(car.dataToSave[tune], "times", {});

      Vue.set(car.data[tune].times, [`${track}`], number);
      Vue.set(car.data[tune].times, [`${track}_user`], vm.user.username);
      Vue.set(car.data[tune].times, [`${track}_downList`], []);
      Vue.set(car.data[tune].times, [`${track}_upList`], []);
      /**/ Vue.set(car.dataToSave[tune].times, [`${track}`], number);

      if (car.rid === "fake1") this.fakeTime1 = number;
      if (car.rid === "fake2") this.fakeTime2 = number;
      
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
  },
}
</script>

<style>
.MainTestPoints_Layout {
  position: relative;
  min-height: 500px;
}
.MainTestPoints_Time {
  display: flex;
  width: 100%;
  gap: 15px;
  justify-content: space-between;
  align-items: center;
}
.MainTestPoints_Time > .Row_Layout {
  flex-grow: 1;
  max-width: 200px;
}
.MainTestPoints_Header .Row_Layout {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.MainTestPoints_BlockBack {
  position: absolute;
  height: 100%;
  width: 100;
  left: 0;
  right: 0;
  background-color: transparent;
}
.MainTestPoints_Header {
  position: relative;
}
.MainTestPoints_Result {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.MainTestPoints_FactorsBox {
  text-align: center;
  color: #777;
}
.MainTestPoints_FactorsBox + .MainTestPoints_FactorsBox {
  margin-top: -10px;
}
.MainTestPoints_FactorsBox b {
  color: var(--d-text-b);
  font-weight: normal;
}
.MainTestPoints_Body {
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  max-width: 550px;
}
.MainTestPoints_BodyBig {
  max-width: 470px;
}
.MainTestPoints_Right {
  display: contents;
}
.MainTestPoints_BodyBig .MainTestPoints_Right {
  display: block;
}
.MainTestPoints_Header {
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
.MainTestPoints_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.MainTestPoints_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.MainTestPoints_CarCard {
  position: relative;
}
.MainTestPoints_Car {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}
.MainTestPoints_RQ {
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
.MainTestPoints_Desc {
  flex-grow: 1;
}
.MainTestPoints_Empty {
  text-align: center;
}
.MainTestPoints_CarTime {
  display: flex;
  align-items: center;
  gap: 5px;
}
.MainTestPoints_CarRight {
  width: var(--cell-width);
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
  position: relative;
}
.MainTestPoints_CarItem {
  width: var(--cell-width);
}
.MainTestPoints_SaveBox {
  display: flex;
  justify-content: center;
  position: absolute;
  left: calc(100% + 10px);
  height: 100%;
  align-items: center;
  top: 0;
}
.MainTestPoints_ResultTdrPoints {
  color: rgb(var(--d-text-green));
  font-size: 30px;
  font-weight: bold;
}
.MainTestPoints_ResultTdrPointsLose {
  color: rgb(var(--d-text-red));
}

@media only screen and (max-width: 767px) {
  .MainTestPoints_Car {
    flex-direction: column;
    margin-bottom: 50px;
    gap: 0px;
  }
  .MainTestPoints_CarLeft {
      margin-left: -36px;
  }
}
</style>