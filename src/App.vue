<template>
  <div class="App_Layout" @click="$store.commit('CLEAR_EDITABLE')">
    <div class="App_Body" @click.stop>
      <div class="App_Backtop"></div>
      <div class="App_Left">
        <div class="App_TrackList">
          <Row 
            v-for="n in temp"
            :temp="temp"
            :list="trackSet_DryTwisty"
            type="tracks" />
        </div>
      </div>
      <div class="App_Corner" @click="toggleSize()"></div>
      <div class="App_Mid" @click="$store.commit('CLEAR_EDITABLE')">
        <div class="App_CarList" @click.stop>
          <template v-for="car in carDetailsList">
            <Car
              :temp="temp"
              :car="car"
              :trackList="trackSet_DryTwisty" />
          </template>
          <Car
            v-if="carDetailsList.length < 6"
            :car="null"
            @add="addCar()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Car from './components/Car.vue'
import Row from './components/Row.vue'

export default {
  name: 'App',
  components: {
    Car,
    Row
  },
  data() {
    return {
      temp: 1,
      carDetailsList: [
        {
          name: "ASTON MARTIN RAPIDE BERTONE JET 2+2",
          photo: "https://i.pinimg.com/564x/1b/70/f2/1b70f2da2803b5bae88e7e0d4edbfd28.jpg",
          rq: "61",
          tune: 1,
          year: 2013,
          country: "GB",
          topSpeed: 188,
          acel: 4.7,
          hand: 83,
          drive: "RWD",
          stars: 1,
          tyres: "PERFORMANCE",
          times: {
            carPark: {
              a00: 723.01,
              a01: 312,
            },
            gForce: {
              a00: 723,
              a01: 312,
            },
            hairpin: {
              a00: 723,
              a01: 312,
            },
            indoorKart: {
              a00: 723,
            },
            kart: {
              a00: 723,
              a01: 312,
            },
            slalom: {
              a00: 723,
              a01: 312,
            },
            tCircuit: {
              a00: 65.234,
              a01: 312,
            },
            tRoad: {
              a00: 0,
              a01: 312,
            },
            fast: {
              a01: 312,
            },
            csSmall: {
              a00: 723,
              a01: 312,
            },
            csMed: {
              a00: 723,
              a01: 312,
            },
            testBowl: {
              a00: 123,
              a01: 312,
            },
          }
        },
        {
          name: "Lotus Elise Sprint",
          photo: "https://i2.wp.com/www.111racers.com/wp-content/uploads/2020/05/lts_elise_s3_sprint-220_01.jpg",
          rq: "49",
          tune: 1,
          year: 2017,
          country: "GB",
          topSpeed: 127,
          acel: 5.9,
          hand: 87,
          drive: "RWD",
          stars: 2,
          tyres: "PERFORMANCE",
        }
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
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 0 },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 0 },
        { name: "Test Bowl", id: "testBowl", surface: 0, cond: 0 },
      ],
      trackSet_DryDrag: [
        { name: "1/4 Mile", id: "4mile", surface: 0, cond: 0 },
        { name: "1/2 Mile", id: "2mile", surface: 0, cond: 0 },
        { name: "1 Mile", id: "1mile", surface: 0, cond: 0 },
        { name: "0-60mph", id: "drag60", surface: 0, cond: 0 },
        { name: "0-100mph", id: "drag100", surface: 0, cond: 0 },
        { name: "0-150mph", id: "drag150", surface: 0, cond: 0 },
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
        { name: "1 Mile", id: "1mile", surface: 1, cond: 0 },//
        { name: "Hill Climb", surface: 1, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 1, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 0 },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 1, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 0 },//
        { name: "Motocross Track", surface: 1, cond: 0 },//
      ],
      trackSet_WetDirt: [
        { name: "1/4 Mile", id: "4mile", surface: 1, cond: 1 }, //
        { name: "1/2 Mile", id: "2mile", surface: 1, cond: 1 }, //
        { name: "Hill Climb", surface: 1, cond: 1 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 1 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 1 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 1 },//
        { name: "Motocross Track", surface: 1, cond: 1 },//
      ],
      trackSet_Gravel: [
        { name: "1/4 Mile", id: "4mile", surface: 2, cond: 0 },//
        { name: "1/2 Mile", id: "2mile", surface: 2, cond: 0 },//
        { name: "1 Mile", id: "1mile", surface: 2, cond: 0 },//
        { name: "Hill Climb", surface: 2, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 2, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 2, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 2, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 2, cond: 0 },//
      ],
      trackSet_Sand: [
        { name: "1/4 Mile", id: "4mile", surface: 5, cond: 0 },//
        { name: "1/2 Mile", id: "2mile", surface: 5, cond: 0 },//
        { name: "1 Mile", id: "1mile", surface: 5, cond: 0 },//
        { name: "Hill Climb", surface: 5, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 5, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 5, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 5, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 5, cond: 0 },//
      ],
      trackSet_Snow: [
        { name: "1/4 Mile", id: "4mile", surface: 6, cond: 0 },//
        { name: "1/2 Mile", id: "2mile", surface: 6, cond: 0 },//
        { name: "1 Mile", id: "1mile", surface: 6, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 6, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 6, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 6, cond: 0 },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 6, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 6, cond: 0 },//
      ],
      trackSet_Ice: [
        { name: "1/4 Mile", id: "4mile", surface: 3, cond: 0 },//
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

    vm.$store.subscribe(mutation => {
      if (mutation.type == "CHANGE_TIME") {
        let car = vm.carDetailsList.find(x => x.name === mutation.payload.car.name);
        let NEW = mutation.payload.item;

        // set new value
        if (!car.times) {
          Vue.set(car, "times", {});
        }
        if (!car.times[NEW.id]) {
          Vue.set(car.times, NEW.id, {});
        }
        Vue.set(car.times[NEW.id], [`a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        // console.log(car.times[NEW.id]);
        // console.log(vm.carDetailsList.find(x => x.name === mutation.payload.car.name).times[NEW.id]);
      }
    });    
  },
  computed: {},
  methods: {
    toggleSize() {
      // return
      if (this.carDetailsList.length > 2) {
        this.carDetailsList = this.carDetailsList.filter((x, ix) => ix < 2)
      } else {
        Array.from(Array(10)).map((_, i) => {
          this.carDetailsList.push(this.carDetailsList[1]);
        });
      }
      if (this.temp === 1) {
        this.temp = 4;
      } else {
        this.temp = 1;
      }
    },
    addCar() {
      this.carDetailsList.push(this.carDetailsList[0]);
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
body {
  background-color: #333;
  font-family: 'Roboto', sans-serif;
  --top-height: 150px;
  --left-width: 200px;
  --cell-width: 230px;
  --cell-height: 35px;
  --dark-back: 40, 40, 40;
  --back-h: 360;
  --back-s: 0%;
  --back-l: 15%;
  font-size: 18px;
  color: grey;
}
.App_Layout {
  min-height: 100vh;
  max-width: 100%;
  display: flex;
}
.App_Body {
  position: relative;
  /* min-width: 100vw; */
  min-height: 100vh;
  display: flex;
}
.App_Left {
  width: var(--left-width);
  position: sticky;
  left: 0;
  margin-top: var(--top-height);
  overflow: hidden;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  z-index: 10;
  min-height: calc(100vh - var(--top-height));
}
.App_Corner {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  height: var(--top-height);
  width: var(--left-width);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
}
.App_Backtop {
  position: fixed;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  height: var(--top-height);
  width: 100%;
  z-index: 1;
  top: 0;
  left: 0;
}
.App_Mid {
  /* position: absolute; */
  top: 0;
  /* margin-left: var(--left-width); */
  height: 100%;
}
.App_CarList {
  display: flex;
}
button {
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
  height: var(--height);
  min-width: 36px;
  line-height: 1;
  border-radius: 6px;
}
button:focus {
  outline: none;
}
button:hover {
  color: #fff6;
  background-color: rgba(255, 255, 255, 0.1);
}
button:active {
  transition-duration: 0.0s;
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(3px);
}
.add {
  color: #fff2;
  font-size: 30px;
  width: 100%;
  height: 100%;
}

</style>