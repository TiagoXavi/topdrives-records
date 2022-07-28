<template>
  <div :class="{ Main_2: inverted }" class="Main_Layout">
    <div class="Main_Body" @click.stop>
      <div class="Main_Backtop"></div>
      <div class="Main_Corner">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
        <div class="Main_CornerMid">
          <BaseAvatar v-if="user && !inverted" :user="user" size="40px" style="margin-right: 10px;" />
          <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMiniPad" @click="optionsDialogActive = true;">
            <i class="ticon-3menu Main_MenuIcon" aria-hidden="true"/>
          </button>
        </div>
      </div>
      <div class="Main_Left">
        <div class="Main_TrackList">
          <Row 
            v-for="n in temp"
            :temp="temp"
            :list="currentTracks"
            :hoverIndex="hoverIndex"
            :loggedin="!!user"
            :needSave="needSave"
            :saveLoading="saveLoading"
            type="tracks"
            @save="saveAll()" />
        </div>
      </div>
      <div class="Main_Mid">
        <div class="Main_CarList" @click.stop @mouseleave="hoverIndex = -1">
          <template v-for="(car, carIx) in carDetailsList">
            <Car
              :temp="temp"
              :car="car"
              :index="carIx"
              :trackList="currentTracks"
              :highlights="highlights[carIx]"
              :hoverIndex="hoverIndex"
              :maxCarNumber="maxCarNumber"
              :loggedin="!!user"
              :downloadLoading="downloadLoading"
              @delete="deleteCar(carIx)"
              @newindex="newIndex($event)" />
          </template>
          <Car
            v-if="carDetailsList.length < maxCarNumber"
            index="addCar"
            :car="null"
            :maxCarNumber="maxCarNumber"
            @add="openDialog()" />
        </div>
      </div>
    </div>
    <BaseDialog
      :active="searchActive"
      :transparent="true"
      @close="closeDialog()">
      <div class="Main_SearchBody">
        <div class="Main_SearchHeader">
          <input
            v-model="searchInput"
            id="SearchInput"
            placeholder="Search"
            class="Main_SearchInput"
            type="text"
            @focus="searchFocus = true;"
            @blur="searchBlur()"
            @input="searchInputFunc($event)">
        </div>
        <div class="Main_SearchMid">
          <Loading v-if="searchLoading" class="Main_SearchLoading" />
          <template v-for="(item, index) in searchResult">
            <button
              v-if="index < searchMax"
              :style="{ '--color': item.classColor }"
              class="Main_SearchItem"
              @click="addCar(index)">
              <div class="Main_SearchItemImg">
                <img :src="item.ridPhoto" class="MainGallery_Img" alt="">
              </div>
              <div class="Main_SearchItemLeft">{{ item.class }}{{ item.rq }}</div>
              <div class="Main_SearchItemRight">
                <span v-html="item.locatedName" />&nbsp;<span class="Main_SearchItemYear">{{ item.year }}</span>
              </div>
            </button>
          </template>
          <button
            v-if="searchMax === 20 && searchResult.length > 20"
            class="D_Button D_ButtonDark D_ButtonDark2 Main_SearchMore"
            @click="searchMax = 100">Show more</button>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="tuneDialogActive"
      :transparent="false"
      max-width="400px"
      @close="closeTune()">
      <div class="Main_TuneDialog">
        <portal-target
          slim
          name="tunedialog"/>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="optionsDialogActive"
      :transparent="false"
      max-width="400px"
      @close="updateOptions()">
      <div class="Main_OptionsDialog">
        <div v-if="user" class="Main_OptionsItem">
          <div class="Main_UserCard">
            <BaseAvatar :user="user" size="46px" />
            <div style="color: var(--d-text-b);" class="Main_UserName">{{ user.username }}</div>
          </div>
        </div>
        <div v-else class="Main_OptionsItem Main_OptionsLogout">
          <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2" @click="$router.push({ name: 'Login' })">Login</button>
          <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2" @click="$router.push({ name: 'Register' })">Register</button>
        </div>
        <div class="Main_OptionsItem">
          <div class="Main_OptionsLabel">Trackset</div>
          <div class="Main_OptionsButtons">
            <button
              v-for="item in tracksButtons"
              :class="{ D_ButtonActive: item.active }"
              class="D_Button Main_OptionsButton"
              @click="stringToggleTrackSet(item.set)">{{ item.name }}</button>
          </div>
        </div>
        <div class="Main_OptionsItem">
          <div class="Main_OptionsLabel">Display</div>
          <div class="Main_OptionsButtons">
            <button :class="{ D_ButtonActive: !inverted }" class="D_Button Main_OptionsButton" @click="display('horizontal')">
              <i class="ticon-list Main_OptionsIcon" aria-hidden="true"/>
            </button>
            <button :class="{ D_ButtonActive: inverted }" class="D_Button Main_OptionsButton" @click="display('vertical')">
              <i class="ticon-list Main_OptionsIcon" style="transform: rotate(90deg)" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div v-if="user" class="Main_OptionsItem Main_OptionsLogout">
          <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2" @click="logout()">Logout</button>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import Car from './Car.vue'
import Row from './Row.vue'
import Loading from './Loading.vue'
import BaseDialog from './BaseDialog.vue'
import Logo from './Logo.vue'
import BaseAvatar from './BaseAvatar.vue'
import data_cars from '../database/cars_final.json'
import default_cars from '../database/default_cars.json'

export default {
  name: 'Main',
  components: {
    Car,
    Row,
    BaseDialog,
    Loading,
    Logo,
    BaseAvatar
  },
  data() {
    return {
      unsubscribe: null,
      inverted: false,
      temp: 1,
      searchInput: '',
      searchActive: false,
      nextId: 0,
      searchFocus: false,
      debounceFilter: null,
      searchLoading: false,
      searchMax: 20,
      searchResult: [],
      maxCarNumber: 12,
      tuneDialogActive: false,
      optionsDialogActive: false,
      hoverIndex: -1,
      user: null,
      needSave: false,
      saveLoading: false,
      downloadLoading: false,
      // carDetailsList: default_cars,
      carDetailsList: [],
      all_cars: data_cars,
      toLoadTrackSet: null,
      currentTracks: [],
      currentTracksSetsNames: [],
      tracksButtons: [
        { name: "Dry Twisty", set: "trackSet_DryTwisty", active: false },
        { name: "Dry City", set: "trackSet_DryCity", active: false },
        { name: "Dry Drag", set: "trackSet_DryDrag", active: false },
        { name: "Wet Twisty", set: "trackSet_WetTwisty", active: false },
        { name: "Wet City", set: "trackSet_WetCity", active: false },
        { name: "Dirt", set: "trackSet_Dirt", active: false },
        { name: "Wet Dirt", set: "trackSet_WetDirt", active: false },
        { name: "Gravel", set: "trackSet_Gravel", active: false },
        { name: "Sand", set: "trackSet_Sand", active: false },
        { name: "Snow", set: "trackSet_Snow", active: false },
        { name: "Ice", set: "trackSet_Ice", active: false },
      ],
      trackSet_DryTwisty: [
        { name: "Car Park", id: "carPark", surface: 0, cond: 0 },
        { name: "G-Force Test", id: "gForce", surface: 0, cond: 0 },
        { name: "Hairpin Road", id: "hairpin", surface: 0, cond: 0 },
        { name: "Indoor Karting", id: "indoorKart", surface: 0, cond: 0 },
        { name: "Karting Circuit", id: "kart", surface: 0, cond: 0 },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 0 },
        { name: "Twisty Circuit", id: "tCircuit", surface: 0, cond: 0 },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 0 },
        { name: "Fast Circuit", id: "fast", surface: 0, cond: 0 },
      ],
      trackSet_DryCity: [
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 0 },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 0 },
      ],
      trackSet_DryDrag: [
        { name: "1/4 Mile", id: "mile4", surface: 0, cond: 0 },
        { name: "1/2 Mile", id: "mile2", surface: 0, cond: 0 },
        { name: "1 Mile", id: "mile1", surface: 0, cond: 0 },
        { name: "0-60mph", id: "drag60", surface: 0, cond: 0 },
        { name: "0-100mph", id: "drag100", surface: 0, cond: 0 },
        { name: "0-150mph", id: "drag150", surface: 0, cond: 0 },
        { name: "Hill Climb", id: "hClimb", surface: 0, cond: 0 },
        { name: "Test Bowl", id: "testBowl", surface: 0, cond: 0 },
      ],
      trackSet_WetTwisty: [
        { name: "Car Park", id: "carPark", surface: 0, cond: 1 },
        { name: "G-Force Test", id: "gForce", surface: 0, cond: 1 },
        { name: "Hairpin Road", id: "hairpin", surface: 0, cond: 1 },
        { name: "Karting Circuit", id: "kart", surface: 0, cond: 1 },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 1 },
        { name: "Twisty Circuit", id: "tCircuit", surface: 0, cond: 1 },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 1 },
        { name: "Fast Circuit", id: "fast", surface: 0, cond: 1 },
      ],
      trackSet_WetCity: [
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 1 },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 1 },
      ],
      trackSet_Dirt: [
        { name: "1 Mile", id: "mile1", surface: 1, cond: 0 },//
        { name: "Hill Climb", id: "hClimb", surface: 1, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 1, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 0 },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 1, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 0 },//
        { name: "Motocross Track", id: "moto", surface: 1, cond: 0 },//
      ],
      trackSet_WetDirt: [
        { name: "1/4 Mile", id: "mile4", surface: 1, cond: 1 }, //
        { name: "1/2 Mile", id: "mile2", surface: 1, cond: 1 }, //
        { name: "Hill Climb", id: "hClimb", surface: 1, cond: 1 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 1 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 1 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 1 },//
        { name: "Motocross Track", id: "moto", surface: 1, cond: 1 },//
      ],
      trackSet_Gravel: [
        { name: "1/4 Mile", id: "mile4", surface: 2, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 2, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 2, cond: 0 },//
        { name: "Hill Climb", id: "hClimb", surface: 2, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 2, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 2, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 2, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 2, cond: 0 },//
      ],
      trackSet_Sand: [
        { name: "1/4 Mile", id: "mile4", surface: 5, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 5, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 5, cond: 0 },//
        { name: "Hill Climb", id: "hClimb", surface: 5, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 5, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 5, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 5, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 5, cond: 0 },//
      ],
      trackSet_Snow: [
        { name: "1/4 Mile", id: "mile4", surface: 6, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 6, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 6, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 6, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 6, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 6, cond: 0 },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 6, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 6, cond: 0 },//
      ],
      trackSet_Ice: [
        { name: "1/4 Mile", id: "mile4", surface: 3, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 3, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 3, cond: 0 },//
      ],
      allTracksIds: [
          "carPark",
          "gForce",
          "hairpin",
          "indoorKart",
          "kart",
          "slalom",
          "tCircuit",
          "tRoad",
          "fast",
          "csSmall",
          "csMed",
          "mile4",
          "mile2",
          "mile1",
          "drag60",
          "drag100",
          "drag150",
          "hClimb",
          "testBowl",
          "moto"
      ],

      carList: [],
      //          0         1         2         3       4       5       6
      surfaces: ["Asphalt", "Dirt", "Gravel", "Ice", "Mixed", "Sand", "Snow"],
      conds: ["Dry", "Wet"],
      //      0       1      2      3
      tunes: ["332", "233", "323", "111"]
    }
  },
  watch: {},
  beforeMount() {
    // let dupCouts = {};
    // this.all_cars.map((x, ix) => {
    //   dupCouts[`${x.name} ${x.year}`] = ++dupCouts[`${x.name} ${x.year}`] || 0;
    // })
    // console.log(this.all_cars.filter(x => dupCouts[`${x.name} ${x.year}`]));
    // debugger;
    // nome ideal: `${x.rq} ${x.name} ${x.year}`.replaceAll(" ","")

    // this.all_cars.map(x => {
    //   x.rid = `${x.rq} ${x.name} ${x.year}`.replaceAll(" ","_")
    // })
    // console.log(this.all_cars);
    // debugger;



    let display = window.localStorage.getItem("display");
    if (display) {
      this.display(display);
    }

    let tracks = window.localStorage.getItem("tracks");
    let tracksClear = [];
    if (tracks) {
      tracks = JSON.parse(tracks);
      // console.log(tracks.map(x => x.id));
      tracks.map(x => {
        this.allTracksIds.find(y => {
          if (x.id === y) {
            tracksClear.push(x);
            return true;
          }
        })
      })
      // console.log(tracksClear);
      this.pushTrackSet(tracksClear);
    }
    if (this.currentTracks.length === 0) {
      this.pushTrackSet(this.trackSet_DryTwisty);
    }

    let cars = window.localStorage.getItem("cars");
    if (cars) {
      this.prepareCars(JSON.parse(cars));
    }
    // this.calcCurrentTracks();
  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500); 

    this.getUser();

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_TIME") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        let NEW = mutation.payload.item;

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].times) Vue.set(car.data[car.selectedTune], "times", {});
        /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
        /**/ if (!car.dataToSave[car.selectedTune]) Vue.set(car.dataToSave, car.selectedTune, {});
        /**/ if (!car.dataToSave[car.selectedTune].times) Vue.set(car.dataToSave[car.selectedTune], "times", {});

        Vue.set(car.data[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        /**/ Vue.set(car.dataToSave[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        vm.needSave = true;
      }

      if (mutation.type == "CHANGE_TUNE") {
        // console.log(vm.carDetailsList.map(x => x.softId));
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        Vue.set(car, "selectedTune", mutation.payload.tune);
        this.updateCarLocalStorage();
      }

      if (mutation.type == "CHANGE_STAT") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].info) Vue.set(car.data[car.selectedTune], "info", {});
        /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
        /**/ if (!car.dataToSave[car.selectedTune]) Vue.set(car.dataToSave, car.selectedTune, {});
        /**/ if (!car.dataToSave[car.selectedTune].info) Vue.set(car.dataToSave[car.selectedTune], "info", {});

        Vue.set(car.data[car.selectedTune].info, mutation.payload.type, mutation.payload.value);
        /**/ Vue.set(car.dataToSave[car.selectedTune].info, mutation.payload.type, mutation.payload.value);
        vm.needSave = true;
      }

      if (mutation.type == "SHOW_TUNE") {
        if (mutation.payload) {
          vm.tuneDialogActive = true;
        }
      }

      if (mutation.type == "HOVER_INDEX") {
        if (mutation.payload) {
          vm.hoverIndex = mutation.payload;
        }
      }

    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    highlights() {
      let vm = this;
      let result = [];
      let sortedByTracks = {};

      // result length = number of cars
      this.carDetailsList.map(x => {
        result.push({});
      });

      // insert every type of track in both result && sortedByTracks
      this.currentTracks.map((x, ix) => {
        sortedByTracks[`${x.id}_a${x.surface}${x.cond}`] = [];
        result.map(y => {
          y[`${x.id}_a${x.surface}${x.cond}`] = null;
        })
      });
      
      // insere os times de cada carro em suas respectivas trackId
      this.carDetailsList.map(x => {
        if ( x.selectedTune && x.data && x.data[x.selectedTune] && x.data[x.selectedTune].times ) {
          Object.keys( x.data[x.selectedTune].times ).forEach(function (trackId) {
            if (sortedByTracks[trackId]) {
              sortedByTracks[trackId].push(x.data[x.selectedTune].times[trackId]);
            }
          });
        }
      });

      // dá sort nos times e remove duplicates
      Object.keys( sortedByTracks ).forEach(function (trackId) {
        sortedByTracks[trackId].sort(function(a, b) {
          if (trackId.includes('testBowl')) return b - a;
          return a - b;
        });
        sortedByTracks[trackId] = [...new Set(sortedByTracks[trackId])];
      });

      // preenche result com seus respectivos ranking
      let tempValue;
      result.map((x, ix) => {
        Object.keys( x ).forEach(function (trackId) {
          if (
            vm.carDetailsList[ix].data &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune] &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times
            ) {
            tempValue = vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId];
            x[trackId] = sortedByTracks[trackId].indexOf(tempValue);
          }
        });
      })

      // console.log(result);
      // console.log(sortedByTracks);
      // debugger;

      return result;
    },
  },
  methods: {
    // calcCurrentTracks() {
    //   let result = [];

    //   if (this.toLoadTrackSet !== null) {
    //     result = JSON.parse(JSON.stringify(this.toLoadTrackSet));
    //     this.toLoadTrackSet = null;
    //     this.currentTrackSet = result;
    //   }

    //   this.activeTrackSet.map(x => {
    //     if (this[x]) {
    //       this[x].map(y => {
    //         result.push(y)
    //       })
    //     }
    //   })

    //   window.localStorage.setItem('trackset', JSON.stringify(result));
    //   this.currentTrackSet = result;
    // },
    pushTrackSet(trackset) {
      let index;
      trackset.map(x => {
        index = this.indexOfTrack(x);
        if (index === -1) {
          this.currentTracks.push(x)
        }
      })
      this.verifyActiveButtons();
    },
    removeTrackSet(trackset) {
      let index;
      trackset.map(x => {
        index = this.indexOfTrack(x);
        if (index > -1) {
          this.currentTracks.splice(index, 1);
        }
      })
      this.verifyActiveButtons();
    },
    toggleTrackSet(trackset) {
      let incluedesAll = this.includeAllTracks(trackset);
      
      if (incluedesAll && this.currentTracks.length >= trackset.length) {
        this.removeTrackSet(trackset);
      } else {
        this.removeTrackSet(trackset);
        this.pushTrackSet(trackset);
      }
    },
    stringToggleTrackSet(str) {
      this.toggleTrackSet(this[str])
    },
    indexOfTrack(x) {
      return this.currentTracks.findIndex(y => {
        if (`${x.id}_a${x.surface}${x.cond}` === `${y.id}_a${y.surface}${y.cond}`) {
          return true
        }
      });
    },
    includeAllTracks(trackset) {
      let incluedesAll = true;
      let index;
      trackset.map(x => {
        index = this.currentTracks.findIndex(y => {
          if (`${x.id}_a${x.surface}${x.cond}` === `${y.id}_a${y.surface}${y.cond}`) {
            return true
          }
        });
        if (index === -1) incluedesAll = false;
      })
      return incluedesAll;
    },
    verifyActiveButtons() {
      this.tracksButtons.map(x => {
        if (this.includeAllTracks(this[x.set])) {
          x.active = true;
        } else {
          x.active = false;
        }
      })
    },
    updateOptions() {
      this.optionsDialogActive = false;
      window.localStorage.setItem('tracks', JSON.stringify(this.currentTracks));
    },
    toggleSize() {
      this.inverted = !this.inverted;
      return
      if (this.carDetailsList.length > 2) {
        this.carDetailsList = this.carDetailsList.filter((x, ix) => ix < 2)
      } else {
        Array.from(Array(10)).map((_, i) => {
          this.carDetailsList.push(this.carDetailsList[1]);
        });
      }
      // if (this.temp === 1) {
      //   this.temp = 4;
      // } else {
      //   this.temp = 1;
      // }
    },
    deleteCar(index) {
      this.carDetailsList = this.carDetailsList.filter((x, ix) => ix !== index);
      this.updateCarLocalStorage();
    },
    openDialog() {
      this.searchActive = true;
      setTimeout(() => {
        document.querySelector("#SearchInput").focus();
      }, 10);
      if (this.searchInput && this.searchInput.length > 0) {
        this.changeFilter();
      }
    },
    closeDialog() {
      this.searchActive = false;
      // if (!this.searchFocus) {
        //   this.searchActive = false;
      // }
    },
    closeTune() {
      this.tuneDialogActive = false;
      this.$store.commit("SHOW_TUNE", false);
      
    },
    searchBlur() {
      setTimeout(() => {
        this.searchFocus = false;
      }, 200);
    },
    searchInputFunc(e) {
      // debugger;
      // console.log(e);
      // console.log(this.searchInput);
      // this.searchInput
      this.debounceFilter();
      // this.searchLoading = true;
    },
    changeFilter() {
      // console.log("changeFilter");
      // this.searchLoading = false;
      let result = [];
      // let searchStr = this.searchInput.toLowerCase().replace(/  +/g, ' ').split(" ");
      let searchStr = this.searchInput.toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let strIndex = null;
      let prePush;
      let tryFind;
      if (searchStr === "") {
        this.searchLoading = false;
        return [];
      }

      this.all_cars.map((x, ix) => {
        if (result.length < 100) {
          strIndex = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(searchStr);
          if (strIndex > -1) {
            prePush = JSON.parse(JSON.stringify(x));
            prePush.locatedName = x.name.substr(0, strIndex)+'<b>'+x.name.substr(strIndex, searchStr.length)+'</b>'+x.name.substr(strIndex + searchStr.length);
            prePush.locatedIndex = strIndex;
            if (x.name[strIndex - 1] === ' ') {
              prePush.locatedPlus = true;
            }

            result.push(prePush);
          }
        }
      })
      result.map(x => {
        Vue.set(x, "class", Vue.resolveClass(x.rq, x.class, "letter"));
        Vue.set(x, "classColor", Vue.resolveClass(x.rq, x.class, "color"));    
        try {
          Vue.set(x, "ridPhoto", '');
          setTimeout(() => {
            Vue.set(x, "ridPhoto", require('@/imgs_final/' + x.rid + '.jpg'));
          }, 1);
        } catch (error) {
          Vue.set(x, "ridPhoto", '');
        }    
      })
      result.sort(function(a, b) {
        if (a.locatedPlus && !b.locatedPlus) return -1;
        if (b.locatedPlus && !a.locatedPlus) return 1;
        return a.locatedIndex - b.locatedIndex;
      });

      this.searchMax = 20;

      this.searchResult = result;
      this.searchLoading = false;

    },
    addCar(index) {
      if (this.carDetailsList.length < this.maxCarNumber) {
        this.carDetailsList.push(JSON.parse(JSON.stringify(this.searchResult[index])));
        this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
        this.nextId++;
        // console.log(this.carDetailsList.map(x => x.softId));

        this.searchResult = this.searchResult.filter((x, ix) => ix !== index);

        if (this.carDetailsList.length >= this.maxCarNumber) {
          this.searchActive = false;
        }

        this.updateCarLocalStorage();
        this.downloadCar(this.carDetailsList[this.carDetailsList.length - 1].rid)
      }
    },
    // toggleTrack(set) {
    //   let index = this.activeTrackSet.indexOf(set);

    //   if (index > -1) {
    //     this.activeTrackSet.splice(index, 1);
    //   } else {
    //     this.activeTrackSet.push(set);
    //   }
    // },
    display(type, save = true) {
      this.inverted = type === "vertical";
      if (save) {
        window.localStorage.setItem('display', type);
      }
    },
    newIndex(obj) {
      obj.current;
      obj.new;
      this.closeTune();

      // If actual index of moved element is
      // less than 0 when 'moveEle += array size'
      while (obj.current < 0)
      {
          obj.current += this.carDetailsList.length;
      }

      // Where the element to be moved f that
      // index is less than 0 when
      // 'obj.new += array size'
      while (obj.new < 0)
      {
          obj.new = 0;
      }

      // If 'obj.new' is greater than the
      // size of the array then with need to
      // push 'undefined' in the array.
      if (obj.new > this.carDetailsList.length)
      {
          obj.new = this.carDetailsList.length;
          // var un = obj.new - this.carDetailsList.length + 1;
          // while (un--)
          // {
          //     this.carDetailsList.push(undefined);

          // }
      }

      // Here element of 'obj.current' is removed and
      // pushed at 'obj.new' index
      this.carDetailsList.splice(obj.new, 0, this.carDetailsList.splice(obj.current, 1)[0]);
      
      this.updateCarLocalStorage();
    },
    getUser() {
      axios.get(Vue.preUrl + "/getUser")
      .then(res => {
        if (res.data.username) {
          this.user = res.data;
          console.log(res.data);
        }
      })
      .catch(error => {
        console.log(error);
        // this.$store.commit("DEFINE_SNACK", {
        //   active: true,
        //   error: true,
        //   text: error,
        //   type: "error"
        // });
      });
    },
    logout() {
      axios.delete(Vue.preUrl + "/logout")
      .then(res => {
        if (res.data === "OK") {
          this.user = null;
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: "Logout successful"
          });
        } else {
          throw new Error("Unable to log out");
        }
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      });
    },
    updateCarLocalStorage() {
      let toSave = this.carDetailsList.map(x => { 
        return {
          rid: x.rid,
          selectedTune: x.selectedTune
        }
      })

      window.localStorage.setItem('cars', JSON.stringify(toSave));
    },
    prepareCars(cars) {
      let result = [];
      if (cars && cars.length > 0) {
        
        cars.map(y => {
          this.all_cars.map(x => {
            if (x.rid === y.rid) {
              result.push(JSON.parse(JSON.stringify(x)));
              if (y.selectedTune) result[result.length-1].selectedTune = y.selectedTune;
              result[result.length-1].softId = this.nextId;
              this.nextId++;
            }
          })
        })
        
      }
      Vue.set(this, "carDetailsList", result);
      this.downloadDataCars();
    },
    saveAll() {
      this.saveLoading = true;
      let simplifiedCars = [];
      this.carDetailsList.map(x => {
        if (x.dataToSave) {
          simplifiedCars.push({
            rid: x.rid,
            data: x.dataToSave
          });
        }
      });

      axios.post(Vue.preUrl + "/update", simplifiedCars)
      .then(res => {
        this.needSave = false;        
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: "Successful save"
        });
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.saveLoading = false;
      });

    },
    downloadDataCars() {
      this.downloadLoading = true;
      let simplifiedCars = this.carDetailsList.map(x => {
        return {
          rid: x.rid
        }
      });

      axios.post(Vue.preUrl + "/cars", simplifiedCars)
      .then(res => {        
        this.applyNewData(res.data);
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.downloadLoading = false;
      });
    },
    downloadCar(rid) {
      axios.get(Vue.preUrl + "/car/" + rid)
      .then(res => {        
        this.applyNewData([res.data]);
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
          this.loading = false;
      });
    },
    applyNewData(newData) {
      this.carDetailsList.map(x => {
        newData.map(y => {
          if (x.rid === y.rid) {
            if (y.data) Vue.set(x, "data", y.data);
            if (y.users) Vue.set(x, "users", y.users);
          }
        })
      });
    }
  },
}
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@300;400;700&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@400;700&family=VT323&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto&family=Roboto+Condensed:wght@400;700&display=swap');

* {
  background-repeat: no-repeat;
  padding: 0;
  margin: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
body {
  font-family: 'Roboto', sans-serif;

  /* main */
  --top-height: 150px;
  --left-width: 200px;
  --cell-width: 230px;
  --cell-height: 35px;
  --dark-back: 40, 40, 40;
  --back-h: 360;
  --back-s: 0%;
  --back-l: 15%;
  --d-back: #333;
  --d-text: #999;
  --d-text-b: #ccc;
  --d-text-green: 95, 181, 0;
  --d-text-green-b: 193, 217, 185;
  --d-text-red: 215, 0, 0;
  --d-text-red-b: 251, 131, 131;
  --d-text-yellow: 255, 199, 23;

  /* tracks */
  --color-wet: 90, 163, 255;
  --color-dirt: 239, 97, 75;
  --color-gravel: 197, 177, 120;
  --color-ice: 112, 215, 255;
  --color-mixed: 217, 171, 225;
  --color-sand: 233, 197, 69;
  --color-snow: 186, 212, 235;

  /* car */
  --card-stat-back-l: 10%;
  --card-stat-back-a: 0.2;
  --card-right-width: 20%;
  --card-left-width: 10%;
  --card-top-height: 15%;
  --card-left-height: 28%;
  --card-stat-div: 0%;
  --card-font-size: 12px;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );


  font-size: 18px;
  background-color: var(--d-back);
  color: var(--d-text);
  overflow-x: scroll;
  overflow-y: scroll;
}
.Main_Layout {
  min-height: 100%;
  max-width: 100%;
  display: flex;
  -webkit-user-select: none;
}
.Main_Body {
  position: relative;
  /* min-width: 100vw; */
  min-height: 100%;
  display: flex;
}
.Main_Left {
  width: var(--left-width);
  position: sticky;
  left: 0;
  margin-top: var(--top-height);
  overflow: hidden;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  z-index: 10;
  min-height: calc(100% - var(--top-height));

  /* pra preencher mobile */
  box-shadow: 0px 50vh 0px 0px hsl(var(--back-h), var(--back-s), var(--back-l));
  user-select: text;
}
.Main_Corner {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  height: var(--top-height);
  width: var(--left-width);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
}
.Main_CornerMid {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin: 0px 5px 5px 5px;
  align-items: center;
}
.Main_Logo {
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
}
.Main_2 .Main_Corner {
  display: grid;
  grid-template-columns: 1fr max-content;
  /* grid-template-columns: 65px 1fr; */
}
.Main_2 .Main_CornerMid {
  flex-grow: unset;
  margin: 5px 5px 5px 0;
}
.Main_2 .Main_LogoPre {
  display: none;
}
.Main_2 .Main_Logo {
  justify-content: center;
  /* height: calc(var(--top-height) - 20px); */
}
.Main_Backtop {
  position: fixed;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  height: var(--top-height);
  width: 100%;
  z-index: 0;
  top: 0;
  left: 0;
}
.Main_Mid {
  /* position: absolute; */
  top: 0;
  /* margin-left: var(--left-width); */
  height: 100%;
}
.Main_CarList {
  display: flex;
  user-select: text;
}
.D_Button {
  background-color: transparent;
  border: none;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  transition-duration: 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --height: 36px;
  min-height: var(--height);
  min-width: 36px;
  line-height: 1;
  border-radius: 6px;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  color: var(--d-text-b);
}
.D_ButtonDark {
  background-color: rgba(0,0,0,0.2);
  font-size: 1em;
  border-radius: 6px;
  padding: 0 7px;
  color: var(--d-text-b);
}
.D_ButtonDark2 {
  background-color: rgba(255,255,255,0.06);
}
.D_Button.focus-visible:not(.D_ButtonNoActive) {
  outline: none;
  background-color: rgba(var(--back-color), 0.3);
}
.D_ButtonNoActive {
  outline: none;
}
.D_Button.D_ButtonNoActive.focus-visible {
  background-color: rgba(var(--back-color), 0.3);
}
.D_Button:hover:not(.D_ButtonActive):not([disabled]) {
  color: #fffc;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.D_Button:active:not(.D_ButtonNoActive) {
  transition-duration: 0.0s;
  background-color: rgba(var(--back-color), calc(var(--back-opac) * 2));
  transform: translateY(3px);
}
.D_ButtonLabel {
  margin-right: 5px;
  font-size: 16px;
}
.D_ButtonActive {
  box-shadow: inset 0px -33px 15px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
  border-radius: 0;
}
.D_ButtonActive:hover {
  background-color: rgba(var(--d-text-green-b), 0.2);
}
.D_Button[disabled] {
  cursor: initial;
  opacity: 0.2;
  pointer-events: none;
}
.D_Button.D_Button_Loading {
  position: relative;
  color: rgba(255, 255, 255, 0.2);
  opacity: 0.6;
  overflow: hidden;
}
.D_Button_Loading::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 100%;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 7px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 14px
  );
  animation: Processamento_Loop 0.6s linear infinite;
  top: 85%;
}
@keyframes Processamento_Loop {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0px);
  }
}
.D_Button.D_Button_Correct {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-green), 0.2);
  opacity: 0.6;
}
.D_Button_Correct::after {
  content: "Done!";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-green));
}
.D_Button.D_Button_Error {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-red), 0.2);
  opacity: 0.6;
}
.D_Button_Error::after {
  content: "Error";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-red));
}

.D_Link {
  text-decoration: none;
  color: var(--d-text);
  padding: 5px 6px;
  border-radius: 5px;
  transition-duration: 0.1s;
}
.D_Link:hover,
.D_Link.focus-visible {
  outline: none;
  background-color: rgba(255,255,255,0.06);
}
.add {
  color: #fff2;
  font-size: 30px;
  width: 100%;
  height: 100%;
}
.Main_SearchHeader {
  width: 100%;
}
.Main_SearchBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Main_SearchInput {
  width: 100%;
  background-color: #222;
  border: none;
  padding: 25px;
  box-sizing: border-box;
  color: #ccc;
  --input-color: 100, 100, 100;
  box-shadow: 0px 3px 0px 0px rgba(var(--input-color), 1);
  transition-duration: 0.2s;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  margin-bottom: 3px;
}
.Main_SearchInput:focus {
  outline: none;
  --input-color: 69, 155, 209;
  background-color: #102e40;
  color: #fff;
}
.Main_SearchInput::placeholder {
  color: #fff3;
}
.Main_SearchMid {
  height: 50vh;
  background-color: var(--d-back);
  width: 100%;
  padding: 25px 0;
  box-sizing: border-box;
  overflow-y: scroll;
  overscroll-behavior-block: contain;
  position: relative;
}
.Main_SearchMid::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 18px;
}
.Main_SearchMid::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  background-color: #0002;
}
.Main_SearchMid::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
  background-color: #555;
}
.Main_SearchMid::-webkit-scrollbar-corner,
body::-webkit-scrollbar-corner {
  background-color: #222;
}
.Main_SearchItem {
  padding: 7px 25px 7px 0px;
  display: flex;
  width: 100%;
  background: transparent;
  outline: 0;
  border: none;
  text-decoration: none;
  user-select: none;
  transition-duration: 0.1s;
  cursor: pointer;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  color: var(--d-text);
}
.Main_SearchItem:hover {
  color: #fff6;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.Main_SearchLoading {
  position: fixed;
  width: 100%;
  height: 5px;
  top: 0;
  left: 0;
}
.Main_SearchItemImg {
  display: flex;
  height: 36px;
  margin: -6px 0;
  width: 53px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 10px;
  background-color: #00000038;
}
.MainGallery_Img {
  transform: scale(1.4);
}
.Main_SearchItemLeft {
  color: var(--color);
  margin-right: 10px;
  width: 2em;
}
.Main_SearchItemRight {
  display: flex;
  align-items: center;
}
.Main_SearchItemYear {
  font-size: 0.6em;
  margin-top: 0.2em;
  box-shadow: 0px 0px 0px 2px #0003;
  background-color: #0003;
  padding: 1px 2px;
  margin-left: 0.2em;
}
.Main_SearchItemRight b {
  color: #fffa;
  font-weight: normal;
  background-color: #fff1;
  box-shadow: 0px 0px 0px 1px #fff1;
}
.Main_SearchMore {
  font-size: 18px;
  margin-top: 11px;
  margin-left: 62px;
  padding: 12px 15px;
}
.Space_Bottom { 
  margin-bottom: 10px;
}
.Space_Top { 
  margin-top: 10px;
}
.Space_Both { 
  margin-bottom: 10px;
  margin-top: 10px;
}
.Space_BottomPlus { 
  margin-bottom: 20px;
}
.Space_TopPlus { 
  margin-top: 20px;
}
.Space_BothPlus { 
  margin-bottom: 20px;
  margin-top: 20px;
}
.Main_OptionsDialog {
  font-size: 18px;
}
.Main_OptionsButton {
  font-size: 16px;
  padding: 10px;
  background-color: rgba(var(--back-color), 0.04);
}
.Main_OptionsButton > i {
  font-size: 28px;
}
.Main_OptionsButtons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.Main_OptionsLabel {
  font-size: 14px;
}
.Main_OptionsItem + .Main_OptionsItem {
  margin-top: 20px;
}
.Main_OptionsLogout {
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 10px;
}
.Main_UserCard {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.Main_MenuIcon {
  font-size: 20px;
}





.Main_2 {
  --cell-width: 80px;
  --top-height: 70px;
  --left-width: 250px;
  font-size: 14px;
}
.Main_2 .Main_Mid {
  /* display: none; */
  height: auto;
}
.Main_2 .Main_Left {
  width: unset;
  position: static;
  margin-top: 0;
  height: var(--top-height);
  box-shadow: none;
  min-height: unset;
  margin-left: var(--left-width);
  /* margin-top: calc(var(--top-height) - var(--cell-height) - 1px); */
  z-index: unset;
}
.Main_2 .Main_TrackList {
  display: flex;
  height: 100%;
}
.Main_2 .Row_Layout {
  display: flex;
}
.Main_2 .Main_Body {
  flex-direction: column;
}
.Main_2 .Row_Cell {
  width: var(--cell-width);
  height: 100%;
}
.Main_2 .Row_Times .Row_Cell {
  height: var(--cell-height);
}
.Main_2 .Row_Content {
  /* line-height: calc(var(--cell-height) - 12px); */
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.Main_2 .Row_ContentEmpty:not(:focus) ~ .Row_Placeholder {
  display: flex;
}
.Main_2 .Row_Placeholder {
  width: 100%;
  justify-content: center;
  align-items: center;
}
.Main_2 .Row_Tracks .Row_Content {
  text-align: center;
  white-space: normal;
}
.Main_2 .Row_Tracks .Row_Cell {
  border-right-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 0;
}
.Main_2 .Row_Layout {
  display: flex;
  align-items: stretch;
}
.Main_2 .Row_ConfigLabel {
  display: none;
}
.Main_2 .Row_ConfigButton {
  --height: 30px;
  padding: 0px 4px;
}
.Main_2 .Row_ConfigIcon {
  font-size: 18px;
}
.Main_2 .Row_Tracks .Row_ConfigCell {
  /* box-shadow: inset 0px -18px 16px -17px #5fb500, inset 0px -3px 0px 0px #5fb500; */
}
.Main_2 .Row_ConfigCell {
  width: calc(var(--cell-width) * 2);
}
.Row_OrderBox {
  display: none;
  justify-content: center;
  gap: 10px;
}
.Main_2 .Row_OrderBox {
  display: flex;
}



@media only screen and (max-width: 767px) {
  body {
    /* --d-back: #504242; */
    --left-width: 120px;
  }
}
</style>