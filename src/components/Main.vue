<template>
  <div :class="{ Main_2: inverted }" class="Main_Layout">
    <div class="Main_Body" @click.stop>
      <div class="Main_Backtop"></div>
      <div class="Main_Corner" @click="toggleSize()"></div>
      <div class="Main_Left">
        <div class="Main_TrackList">
          <Row 
            v-for="n in temp"
            :temp="temp"
            :list="currentTrackSet"
            type="tracks" />
        </div>
      </div>
      <div class="Main_Mid">
        <div class="Main_CarList" @click.stop>
          <template v-for="(car, carIx) in carDetailsList">
            <Car
              :temp="temp"
              :car="car"
              :index="carIx"
              :trackList="currentTrackSet"
              :highlights="highlights[carIx]"
              @delete="deleteCar(carIx)"
              @newindex="newIndex($event)" />
          </template>
          <Car
            v-if="carDetailsList.length < maxCarNumber"
            index="addCar"
            :car="null"
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
          <button
            v-for="(item, index) in searchResult"
            :style="{ '--color': item.classColor }"
            class="Main_SearchItem"
            @click="addCar(index)">
            <div class="Main_SearchItemLeft">{{ item.class }}{{ item.rq }}</div>
            <div class="Main_SearchItemRight">
              <span v-html="item.locatedName" />&nbsp;<span class="Main_SearchItemYear">{{ item.year }}</span>
            </div>
          </button>
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
  </div>
</template>

<script>
import Car from './Car.vue'
import Row from './Row.vue'
import Loading from './Loading.vue'
import BaseDialog from './BaseDialog.vue'
import data_cars from '../database/cars_td.json'

export default {
  name: 'Main',
  components: {
    Car,
    Row,
    BaseDialog,
    Loading
  },
  data() {
    return {
      inverted: false,
      temp: 1,
      searchInput: '',
      searchActive: false,
      nextId: 0,
      searchFocus: false,
      debounceFilter: null,
      searchLoading: false,
      searchResult: [],
      maxCarNumber: 6,
      tuneDialogActive: false,
      carDetailsList: [
        {
          softId: 141,
          "class": "B",
          "photo": "Aston_Martin_Rapide_Bertone_Jet_22_2013_427f.jpg",
          "rq": 61,
          "onlyName": "Rapide Bertone Jet 2+2",
          "brand": "Aston Martin",
          "country": "GB",
          "year": 2013,
          "tdid": "1753",
          "abs": true,
          "tcs": true,
          "clearance": "low",
          "keeper": 96,
          "topSpeed": 188,
          "acel": 4.7,
          "hand": 83,
          "drive": "RWD",
          "tyres": "Performance",
          "mra": 73.18,
          "weight": 1950,
          "name": "Aston Martin Rapide Bertone Jet 2+2",
          selectedTune: "323",
          data: {
            323: {
              info: {
                "topSpeed": 188,
                "acel": 4.7,
                "hand": 83,
                "mra": 73.18,
                "weight": 1950
              },
              times: {
                carPark_a00: 45.49,
                gForce_a00: 22.48,
                hairpin_a00: 43.51,
                indoorKart_a00: 46.68,
                kart_a00: 38.26,
                slalom_a00: 29.08,
                slalom_a01: 34.18,
                tCircuit_a00: 68.50,
                tRoad_a00: 71.98,
                tRoad_a01: 83.33,
                fast_a00: 66.61,
                csSmall_a00: 41.98,
                csMed_a00: 81.07,
                testBowl_a00: 175,
                mile4_a00: 12.35,
                mile2_a00: 19.45
              }
            }
          },
        },
        {
          softId: 1151,
          "class": "C",
          "photo": "Lotus_Elise_Sprint_2017_3bc3.jpg",
          "rq": 49,
          "onlyName": "Elise Sprint",
          "brand": "Lotus",
          "country": "GB",
          "tune": null,
          "year": 2017,
          "tdid": "1832",
          "abs": true,
          "tcs": true,
          "clearance": "low",
          "keeper": 99,
          "topSpeed": 127,
          "acel": 5.9,
          "hand": 87,
          "drive": "RWD",
          "tyres": "Performance",
          "mra": 70.97,
          "weight": 798,
          "name": "Lotus Elise Sprint"
        },
        {
          softId: 1111,
          "class": "E",
          "photo": "Ford_Explorer_SportTrac_Adrenalin_2008_7b16.jpg",
          "rq": 26,
          "onlyName": "Explorer Sport-Trac Adrenalin",
          "brand": "Ford",
          "country": "US",
          "tune": null,
          "year": 2008,
          "tdid": "2825",
          "abs": true,
          "tcs": true,
          "clearance": "high",
          "keeper": 93,
          "topSpeed": 98,
          "acel": 7.5,
          "hand": 72,
          "drive": "4WD",
          "tyres": "Performance",
          "mra": 21.34,
          "weight": 2100,
          "name": "Ford Explorer Sport-Trac Adrenalin",
          selectedTune: "323",
          data: {
            323: {
              info: {},
              times: {
                carPark_a00: 46.13,
                gForce_a00: 24.71,
                hairpin_a00: 48.71,
                indoorKart_a00: 51.78,
                kart_a00: 42.46,
                slalom_a00: 31.78,
                slalom_a01: 35.13,
                tCircuit_a00: 77.41,
                tRoad_a00: 79.65,
                tRoad_a01: 87.57,
                fast_a00: 76.96,
                csSmall_a00: 41.13,
                csMed_a00: 79.48,
                testBowl_a00: 101,
                mile4_a00: 14.98,
                mile2_a00: 24.45
              }
            }
          },
        },
        {
          softId: 333,
          "class": "D",
          "photo": "Dodge_Demon_Roadster_2007_9c50.jpg",
          "rq": 38,
          "onlyName": "Demon Roadster",
          "brand": "Dodge",
          "country": "US",
          "tune": null,
          "year": 2007,
          "tdid": "2874",
          "abs": true,
          "tcs": true,
          "clearance": "low",
          "keeper": 95,
          "topSpeed": 130,
          "acel": 6.9,
          "hand": 83,
          "drive": "RWD",
          "tyres": "Performance",
          "mra": 60.22,
          "weight": 1179,
          "name": "Dodge Demon Roadster",
          selectedTune: "323",
          data: {
            323: {
              times: {
                carPark_a00: 46.13,
                gForce_a00: 22.96,
                hairpin_a00: 46.03,
                indoorKart_a00: 47.88,
                kart_a00: 39.85,
                slalom_a00: 29.35,
                slalom_a01: 34.23,
                tCircuit_a00: 71.81,
                tRoad_a00: 74.95,
                tRoad_a01: 85.90,
                fast_a00: 71.76,
                csSmall_a00: 44.99,
                csMed_a00: 85.72,
                testBowl_a00: 132,
                mile4_a00: 14.30,
                mile2_a00: 22.65
              }
            }
          },
        },
      ],
      all_cars: data_cars,
      trackSet_DryTwisty: [
        { name: "Car Park", id: "carPark", surface: 0, cond: 0 },
        { name: "G-Force Test", id: "gForce", surface: 0, cond: 0 },
        { name: "Hairpin Road", id: "hairpin", surface: 0, cond: 0 },
        { name: "Indoor Karting", id: "indoorKart", surface: 0, cond: 0 },
        { name: "Karting Circuit", id: "kart", surface: 0, cond: 0 },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 0 },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 1 },
        { name: "Twisty Circuit", id: "tCircuit", surface: 0, cond: 0 },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 0 },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 1 },
        { name: "Fast Circuit", id: "fast", surface: 0, cond: 0 },
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 0 },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 0 },
        { name: "Test Bowl", id: "testBowl", surface: 0, cond: 0 },
      ],
      trackSet_DryDrag: [
        { name: "1/4 Mile", id: "mile4", surface: 0, cond: 0 },
        { name: "1/2 Mile", id: "mile2", surface: 0, cond: 0 },
        { name: "1 Mile", id: "mile1", surface: 0, cond: 0 },
        { name: "0-60mph", id: "drag60", surface: 0, cond: 0 },
        { name: "0-100mph", id: "drag100", surface: 0, cond: 0 },
        { name: "0-150mph", id: "drag150", surface: 0, cond: 0 },
        { name: "Hill Climb", surface: 0, cond: 0 },
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
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 1 },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 1 },
      ],
      trackSet_Dirt: [
        { name: "1 Mile", id: "mile1", surface: 1, cond: 0 },//
        { name: "Hill Climb", surface: 1, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 1, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 0 },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 1, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 0 },//
        { name: "Motocross Track", surface: 1, cond: 0 },//
      ],
      trackSet_WetDirt: [
        { name: "1/4 Mile", id: "mile4", surface: 1, cond: 1 }, //
        { name: "1/2 Mile", id: "mile2", surface: 1, cond: 1 }, //
        { name: "Hill Climb", surface: 1, cond: 1 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 1 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 1 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 1 },//
        { name: "Motocross Track", surface: 1, cond: 1 },//
      ],
      trackSet_Gravel: [
        { name: "1/4 Mile", id: "mile4", surface: 2, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 2, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 2, cond: 0 },//
        { name: "Hill Climb", surface: 2, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 2, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 2, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 2, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 2, cond: 0 },//
      ],
      trackSet_Sand: [
        { name: "1/4 Mile", id: "mile4", surface: 5, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 5, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 5, cond: 0 },//
        { name: "Hill Climb", surface: 5, cond: 0 },//
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

      carList: [],
      //          0         1         2         3       4       5       6
      surfaces: ["Asphalt", "Dirt", "Gravel", "Ice", "Mixed", "Sand", "Snow"],
      conds: ["Dry", "Wet"],
      //      0       1      2      3
      tunes: ["332", "233", "323", "111"]
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500); 

    vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_TIME") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        let NEW = mutation.payload.item;

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].times) Vue.set(car.data[car.selectedTune], "times", {});

        Vue.set(car.data[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        // Vue.set(car.times[NEW.id], [`a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        // console.log(car.times[NEW.id]);
        // console.log(vm.carDetailsList.find(x => x.name === mutation.payload.car.name).times[NEW.id]);
      }

      if (mutation.type == "CHANGE_TUNE") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        Vue.set(car, "selectedTune", mutation.payload.tune);
      }

      if (mutation.type == "CHANGE_STAT") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].info) Vue.set(car.data[car.selectedTune], "info", {});

        Vue.set(car.data[car.selectedTune].info, mutation.payload.type, mutation.payload.value);
      }

      if (mutation.type == "SHOW_TUNE") {
        if (mutation.payload) {
          vm.tuneDialogActive = true;
        }
      }

    });
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
      this.currentTrackSet.map((x, ix) => {
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
    currentTrackSet() {
      return this.trackSet_DryTwisty;
    }
  },
  methods: {
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
      // let searchArr = this.searchInput.toLowerCase().replace(/  +/g, ' ').split(" ");
      let searchArr = this.searchInput.toLowerCase().replace(/  +/g, ' ');
      let strIndex = null;
      let prePush;
      let tryFind;
      if (searchArr === "") {
        this.searchLoading = false;
        return [];
      }

      this.all_cars.map((x, ix) => {
        if (result.length < 20) {
          strIndex = x.name.toLowerCase().indexOf(searchArr);
          if (strIndex > -1) {
            prePush = JSON.parse(JSON.stringify(x));
            prePush.locatedName = x.name.substr(0, strIndex)+'<b>'+x.name.substr(strIndex, searchArr.length)+'</b>'+x.name.substr(strIndex + searchArr.length);
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
      })
      result.sort(function(a, b) {
        if (a.locatedPlus && !b.locatedPlus) return -1;
        if (b.locatedPlus && !a.locatedPlus) return 1;
        return a.locatedIndex - b.locatedIndex;
      });


      this.searchResult = result;
      this.searchLoading = false;


    },
    addCar(index) {
      if (this.carDetailsList.length < this.maxCarNumber) {
        this.searchResult[index].softId = this.nextId;
        this.nextId++;
        this.carDetailsList.push(JSON.parse(JSON.stringify(this.searchResult[index])));

        this.searchResult = this.searchResult.filter((x, ix) => ix !== index);

        if (this.carDetailsList.length >= this.maxCarNumber) {
          this.searchActive = false;
        }
      }
    },
    newIndex(obj) {
      obj.current;
      obj.new;

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

    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@300;400;700&display=swap');

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
  --d-text-b: #bbb;
  --d-text-green: 95, 181, 0;
  --d-text-green-b: 193, 217, 185;

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
  background: transparent;
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
}
.D_Button:focus:not(.D_ButtonNoActive) {
  outline: none;
  background-color: rgba(var(--back-color), 0.3);
}
.D_ButtonNoActive {
  outline: none;
}
.D_Button.D_ButtonNoActive:focus {
  background-color: rgba(var(--back-color), 0.3);
}
.D_Button:hover {
  color: #fff6;
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
.Main_SearchItem {
  padding: 7px 25px;
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
  box-shadow: inset 0px -18px 16px -17px #5fb500, inset 0px -3px 0px 0px #5fb500;
}
.Main_2 .Row_ConfigCell {
  width: calc(var(--cell-width) * 2);
}



@media only screen and (max-width: 767px) {
  body {
    /* --d-back: #504242; */
    --left-width: 120px;
  }
}
</style>