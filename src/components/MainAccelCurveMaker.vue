<template>
  <div class="MainAccelCurveMaker_Layout">
    <div class="MainAccelCurveMaker_InputsLayout">
      <div
        v-for="(speed, iSpeed) in speedTicks"
        class="MainAccelCurveMaker_InputSpeedItem">
        <BaseText
          v-model="speed.v"
          class="BaseText_Big MainAccelCurveMaker_Input"
          type="topSpeed"
          :placeholder="`${$t('m_speed')} #${iSpeed+1}`"
          suffix="mph" />
        <div class="MainAccelCurveMaker_InputDivider">
          <i class="ticon-arrow_right_3" aria-hidden="true"/>
        </div>
        <BaseText
          v-model="speed.time"
          class="BaseText_Big MainAccelCurveMaker_Input"
          type="acelSoft"
          suffix="s"
          :placeholder="`${$t('m_time')} #${iSpeed+1}`" />

      </div>
    </div>
    {{ speedTicks }}
    <div class="MainAccelCurveMaker_Center" style="margin-top: 30px;">
      <button
        :disabled="!ready"
        class="D_Button Main_SaveAllButton"
        @click="prepareChart()">
        <span>{{ $t("m_load") }}</span>
        <i class="ticon-arrow_down_3" style="margin-left: 5px;" aria-hidden="true"/>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(1)">
        <span>Divo 103</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(2)">
        <span>Pininfarina 109</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(3)">
        <span>Corvette tuned 97</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(4)">
        <span>Macan 70</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(5)">
        <span>no mra</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(6)">
        <span>OLA</span>
      </button>
    </div>
    <div v-if="v100" class="MainAccelCurveMaker_TextResultBox">
      <div class="MainAccelCurveMaker_TextResult">
        <div class="MainAccelCurveMaker_TextResultLabel">0-60mph:</div>
        <div class="MainAccelCurveMaker_TextResultValue"><b>~</b>{{ v60 | toTimeString }}</div>
        <div class="MainAccelCurveMaker_TextResultLabel">0-100mph:</div>
        <div class="MainAccelCurveMaker_TextResultValue"><b>~</b>{{ v100 | toTimeString }}</div>
        <div class="MainAccelCurveMaker_TextResultLabel">MRA:</div>
        <div class="MainAccelCurveMaker_TextResultValue" style="color: rgb(var(--d-text-yellow));"><b>~</b>{{ v100 | mra(v60) }}</div>
      </div>
    </div>
    <div v-if="highchartsConfig.chart" class="MainAccelCurveMaker_Body">
      <Highcharts
        :config="highchartsConfig"
        :counter="counter"
        @detail="detailClick($event)" />
    </div>

  </div>
</template>

<script>
import BaseSearchTrackDialog from './BaseSearchTrackDialog.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'
import BaseFilterDescription from './BaseFilterDescription.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'
import BaseChip from './BaseChip.vue'
import Highcharts from './Highcharts.vue'
import Row from './Row.vue'
import BaseText from './BaseText.vue'
// import numeric from 'numeric';
// import { PolynomialRegression } from 'ml-regression-polynomial';
// import regression from 'regression';
// import Alglib from '../utils/Alglib-v1.1.0.js';

export default {
  name: 'MainAccelCurveMaker',
  components: {
    BaseSearchTrackDialog,
    BaseConfigCheckBox,
    BaseFilterDescription,
    BaseFilterDialog,
    Row,
    Highcharts,
    BaseChip,
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
      speedTicks: [
        {
          type: "mph",
          v: 62,
          time: 2.5
        },
        {
          type: "mph",
          v: 186,
          time: 14
        },
        {
          type: "mph",
          v: 236,
          time: 24
        },
      ],
      speedTicks1: [ // Divo 103
        { v: 62, time: 2.5 },
        { v: 186, time: 14 },
        { v: 236, time: 24 },
      ],
      speedTicks2: [ // Pininfarina 109
        { v: 62, time: 1.86 },
        { v: 124, time: 4.75 },
        { v: 217, time: 17 }, // 17 good
      ],
      speedTicks3: [ // Corvette tuned 97
        { v: 60, time: 3.6 },
        { v: 129, time: 11.4 },
        { v: 200, time: 50 }, // 23 good
      ],
      speedTicks4: [ // Macan 70
        { v: 60, time: 4.1 },
        { v: 124, time: 16.9 },
        { v: 169, time: 85 }, // 25 good
      ],
      speedTicks5: [ // no mra
        { v: 60, time: 18 },
        { v: 80, time: 25 },
        { v: 84, time: 55 },
      ],
      speedTicks6: [ // super OLA
        { v: 60, time: 2.5 },
        { v: 80, time: 14 },
        { v: 120, time: 24 },
      ],

      topSpeed: 280,
      customTrackDialog: false,
      filterDialog: false,
      searchTracks: '',
      chartTrack: false,
      chartFilter: {},
      chartIsFiltering: false,
      chartFilterCount: 0,
      chartLoading: false,
      chartShowDownvoted: false,
      chartHideOutOfFilter: false,
      chartResult: [],
      chartTunes: [],
      highchartsConfig: {},
      user: null,
      unsubscribe: null,
      counter: 0,
      v60: 2.2,
      v100: 3.8,
      highestSpeed: 0
    }
  },
  watch: {},
  beforeMount() {

    let chartShowDownvoted = window.localStorage.getItem("chartShowDownvoted");
    if (chartShowDownvoted) {
      chartShowDownvoted = JSON.parse(chartShowDownvoted);
      this.chartShowDownvoted = chartShowDownvoted;
    }
    let chartHideOutOfFilter = window.localStorage.getItem("chartHideOutOfFilter");
    if (chartHideOutOfFilter) {
      chartHideOutOfFilter = JSON.parse(chartHideOutOfFilter);
      this.chartHideOutOfFilter = chartHideOutOfFilter;
    }

    
  },
  mounted() {
    // let algb = document.createElement('script')
    // algb.setAttribute('type', 'module')
    // algb.innerText = "import {Alglib} from 'https://cdn.jsdelivr.net/gh/Pterodactylus/Alglib.js@master/Alglib-v1.1.0.js';\nwindow.Alglib = Alglib;"
    // document.head.appendChild(algb);
    // console.log(window.importAlglib);
    if (!window.Alglib) {
      window.importAlglib();
    }
    // debugger;

    let vm = this;
    this.user = this.$store.state.user;

    setTimeout(() => {
      this.prepareChart();
    }, 100);

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
    ready() {
      let allNumbers = true;
      let speeds = this.speedTicks.map(x => {
        if (!x.v) allNumbers = false;
        return Number(x.v);
      })
      this.highestSpeed = Math.max(...speeds);

      if (!allNumbers) return false;
      // if (this.highestSpeed < 105) return false;
      return true;
    },
  },
  methods: {
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
    openChartOfDialog() {
      this.filterDialog = true;
    },
    closeChartOfDialog() {
      this.filterDialog = false;
    },
    updateChartFilter(filter) {
      this.chartFilter = filter;
      this.filterDialog = false;
    },
    chartAnalyse() {
      if (!this.chartTrack.code) return;
      this.$store.commit("FILTER_EMIT_RIDS", { total: 5000 });
    },
    chartAnalyseFinish(listOfRids) {
      this.chartLoading = true;
      // this.$store.commit("START_LOGROCKET", {});

      axios.post(Vue.preUrl + "/chart", {
        track: this.chartTrack.code,
        includeDownvotes: this.chartShowDownvoted,
        tunes: this.chartTunes
      })
      .then(res => {
        this.chartResult = res.data;
        this.prepareChart(listOfRids);

        if (res.data.length === 0) {
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: this.$t('m_noTimesFound'),
            type: "error"
          });
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
      })
      .then(() => {
        this.chartLoading = false;
      });
    },
    prepareChart(key = '') {
      let vm = this;
      let xAxisArray = [];
      let objListRid = {};
      let xForSpline = [0];
      let yForSpline = [0];

      let series = [
        {
          data: [
            {
              x: 0,
              y: 0
            }
          ]
        }
      ];
      let speeds = [];
      this[`speedTicks${key}`].map((x, ix) => {
        if (x.v && x.time) {
          series[0].data.push({
            x: Number(x.time),
            y: Number(x.v)
          })
          xForSpline.push(Number(x.time));
          yForSpline.push(Number(x.v));
          speeds.push(Number(x.v));
        }
      })
      this.highestSpeed = Math.max(...speeds);

      // console.log(yForSpline, xForSpline);

      



      

      let data = [];
      yForSpline.map((x, ix) => {
        data.push([xForSpline[ix], x]);
      })

      if (this.highestSpeed < 105) {
        // no mra
        let result = data.map(point => {
          return { x: point[0], y: point[1]  }
        })
        this.v100 = 0;
        this.v60 = 0;
        vm.buildChart(result);
        return;
      };
      

      let degree = 4;

      let x_guess = [1];
      for (let i = 1; i < degree; ++i) {
        x_guess.push(1);
      }

      var f = function(coefs, x) {
        let result = coefs[0];
        for (let i = 1; i < degree; ++i) {
          result += coefs[i]*Math.pow(x, i);
        }
        return result;
        // return coefs[4]*Math.pow(x, 4)+coefs[3]*Math.pow(x, 3)+coefs[2]*Math.pow(x, 2)+coefs[1]*Math.pow(x, 1)+coefs[0];
      }

      var fn1 = function(a){
        let sum = 0
        for (let i = 0; i < data.length; ++i) {
          sum = sum + Math.pow(data[i][1] - f(a, data[i][0]), 2)
        }
        let sse = Math.sqrt(sum)
        return sse
      }

      let solver = new window.Alglib();
      solver.add_function(fn1); //Add the first equation to the solver.

      solver.promise.then(result => {
        // var x_guess = [1,1,1,1,1] //Guess the initial values of the solution.
        var s = solver.solve("min", x_guess) //Solve the equation

        //Update the chart
        let actual_data = [];
        let spline_data = [];
        let coefs = solver.get_results();

        for (let i = 0; i < data.length; ++i) {
          actual_data.push({x:data[i][0], y:data[i][1]})
        }
        spline_data = JSON.parse(JSON.stringify(actual_data));

        // let x_values = data.map(function(elt) { return elt[0]; });
        // let x_min = Math.min.apply(null,x_values)
        // let x_max = Math.max.apply(null,x_values)
        // let n = 100
        // let r = (x_max-x_min)/n
        // for (let i = 0; i <= n; ++i) {
        //   let x = x_min + i * r
        //   spline_data.push({x:x, y:f(coefs,x)})
        // }

        this.v100 = this.aproxY(f, coefs, 101);
        let found60 = spline_data.find(x => x.x === 60);
        if (!found60) {
          this.v60 = this.aproxY(f, coefs, 60);
        }

        spline_data.push({ x: this.v100, y: 102 })
        spline_data.push({ x: this.v60, y: 60 })

        spline_data.sort((a,b) => {
          return a.x - b.x;
        }) 
        // console.log(spline_data);

        vm.buildChart(spline_data);

        solver.remove() //required to free the memory in C++
      })
      





      // const degree = 17; // setup the maximum degree of the polynomial
      // const regression = new PolynomialRegression(yForSpline, xForSpline, 17, {
      //   interceptAtZero: false
      // });

      // console.log(regression.predict(100)); // Apply the model to some x value. Prints 2.6.
      // // debugger;
      // console.log(regression.coefficients); // Prints the coefficients in increasing order of power (from 0 to degree).
      // console.log(regression.toString(3)); // Prints a human-readable version of the function.
      // console.log(regression.toLaTeX());
      // console.log(regression.score(yForSpline, xForSpline));






      // const spline = numeric.spline(yForSpline, xForSpline);
      // const at100 = spline.at(100);
      // const at60 = spline.at(60);
      // console.log(at100); // Output: 6



      // series[0].data.push({
      //   x: Number(regression.predict(60).toFixed(2)),
      //   y: 60
      // })
      // series[0].data.push({
      //   x: Number(regression.predict(100).toFixed(2)),
      //   y: 100
      // })
      // series[0].data.sort((a,b) => {
      //   return a.x - b.x;
      // }) 

      // console.log(JSON.stringify(series[0].data, undefined, 2));



      // series[0].data.push({
      //   x: series[0].data[series[0].data.length-1].x * 3,
      //   y: this.topSpeed
      // })

      

    },
    buildChart(algbData) {
      let series = [
        { data: [] }
      ]
      series[0].data = algbData;

      var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

      this.highchartsConfig = {
        boost: {
          seriesThreshold: series.length,
          useGPUTranslations: true,
          usePreAllocated: true
        },
        chart: {
          type: "spline",
          zoomType: false,
          pinchType : false,
        },
        legend: {
          enabled: false,
        },
        series,
        yAxis: {
          min: 0,
          allowDecimals: false,
          crosshair: {
            snap: true,
            label: {
              enabled: true,
              format: '{value:.0f}mph'
            }
          },
          labels: {
            format: '{text}mph'
          },
        },
        xAxis: {
          min: 0,
          allowDecimals: true,
          crosshair: {
            snap: true,
            label: {
              enabled: true,
              format: '{value:.1f}s'
            }
          },
          labels: {
            format: '{text}s'
          },
        },
        tooltip: {
          snap: supportsTouch ? 50 : 10
        },
        plotOptions: {
          series: {
            stickyTracking: supportsTouch ? true : false,
            turboThreshold: 2000,
            marker: {
              enabled: true
            }
          },
          scatter: {
            boostThreshold: 2000
          }
        },
      }
    },
    detailClick(e) {
      var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
      if (e.shiftKey) {
        this.deleteTime(e.point.custom.rid, e.point.custom.tune);
      } else if (!supportsTouch) {
        let url = `https://www.topdrivesrecords.com?share=~K${this.chartTrack.code}~C${e.point.custom.rid}~T${e.point.custom.tune}`
        window.open(url, '_blank').focus();
      }
    },
    deleteTime(rid, tune) {
      axios.post(Vue.preUrl + "/deleteTime", {
        rid: rid,
        tune: tune,
        track: this.chartTrack.code,
      })
      .then(res => {
        this.chartAnalyse();
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_deleteSuccess')
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
      });
    },
    aproxY(f, coefs, yExpected, factor = 1, xCurrent = 0) {
      // console.log("aproxY");
      let count = 0;
      let matched = false;
      let found = false;
      while (!matched && count < 1000) {
        let y = f(coefs,xCurrent);
        y = Number((y).toFixed(1));

        if (y === yExpected) {
          // acabou
          matched = true;
          found = true;
          break;
        }

        if (factor > 0 && y > yExpected) {
          matched = true;
          break;
        }
        if (factor < 0 && y < yExpected) {
          matched = true;
          break;
        }

        xCurrent += factor;
        // console.log(xCurrent);
        count++;
        continue;
      }

      if (found) {
        return Number(xCurrent.toFixed(2));
      }

      if (matched) {
        // need to continue the work
        factor = factor * -0.1;
        return this.aproxY(f, coefs, yExpected, factor, xCurrent);
      }

      debugger;

    }
  },
}
</script>

<style>
.MainAccelCurveMaker_Body {
  height: 300px;
  margin-top: 30px;
}
.MainAccelCurveMaker_InputsLayout {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 320px;
  margin: 30px auto 0 auto;
}
.MainAccelCurveMaker_InputSpeedItem {
  display: flex;
  align-items: center;
  gap: 5px;
}
.MainAccelCurveMaker_InputSpeedItem {
  display: flex;
  align-items: center;
  gap: 5px;
}
.MainAccelCurveMaker_Input {
  width: 100px;
  flex-grow: 1;
}
.MainAccelCurveMaker_InputDivider {
  opacity: 0.6;
}
.MainAccelCurveMaker_Center {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.MainAccelCurveMaker_TextResultBox {
  margin: 25px auto 0 auto;
  display: flex;
  justify-content: center;
}
.MainAccelCurveMaker_TextResult {
  /* display: flex;
  justify-content: center; */
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 15px;
}
.MainAccelCurveMaker_TextResultValue b {
  font-weight: normal;
  opacity: 0.4;
}
.MainAccelCurveMaker_TextResultLabel {
  text-align: right;
}

</style>