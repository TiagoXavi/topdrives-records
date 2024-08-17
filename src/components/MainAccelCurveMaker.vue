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
    <!-- {{ speedTicks }} -->
    <div class="MainAccelCurveMaker_Center" style="margin-top: 30px;">
      <button
        :disabled="!ready"
        class="D_Button Main_SaveAllButton MainAccelCurveMaker_LoadButton"
        @click="prepareChart()">
        <span>{{ $t("m_load") }}</span>
        <i class="ticon-arrow_down_3" style="margin-left: 5px;" aria-hidden="true"/>
      </button>
      <!-- <button
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
        @click="prepareChart(7)">
        <span>M2 CS 86</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(8)">
        <span>Volvo 55</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(9)">
        <span>Venom 131</span>
      </button>
      <button
        class="D_Button Main_SaveAllButton"
        @click="prepareChart(10)">
        <span>Other</span>
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
      </button> -->
    </div>
    <div v-if="v100" class="MainAccelCurveMaker_TextResultBox">
      <div class="MainAccelCurveMaker_TextResult">
        <div class="MainAccelCurveMaker_TextResultLabel">0-60mph:</div>
        <div class="MainAccelCurveMaker_TextResultValue"><b>~</b>{{ v60 | toTimeString }}</div>
        <div class="MainAccelCurveMaker_TextResultLabel">0-100mph:</div>
        <div class="MainAccelCurveMaker_TextResultValue"><b>~</b>{{ v100 | toTimeString }}</div>
        <div class="MainAccelCurveMaker_TextResultLabel">MRA:</div>
        <div class="MainAccelCurveMaker_TextResultValue" style="color: rgb(var(--d-text-yellow));"><b>~</b>{{ v100 | mra(v60, 100, 0) }}</div>
      </div>
    </div>
    <div v-if="!showMra" class="MainAccelCurveMaker_TextResultBox">
      <div class="MainAccelCurveMaker_TextResult">
        <div class="MainAccelCurveMaker_TextResultLabel">MRA:</div>
        <div class="MainAccelCurveMaker_TextResultValue" style="color: rgb(var(--d-text-yellow));">No MRA</div>
      </div>
    </div>
    <div v-if="highchartsConfig.chart" class="MainAccelCurveMaker_Body">
      <Highcharts
        ref="acelChart"
        :config="highchartsConfig"
        :counter="counter" />
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
import numeric from 'numeric';
// import { PolynomialRegression } from 'ml-regression-polynomial';
// import MLR from 'ml-regression';
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
          time: 2.3
        },
        {
          type: "mph",
          v: 186,
          time: 9
        },
        {
          type: "mph",
          v: 248,
          time: 17
        },
      ],
      speedTicks1: [ // Divo 103
        { v: 62, time: 2.5 },
        { v: 186, time: 14 },
        { v: 236, time: 24 },
      ],
      // 0      0
      // 62     2.5
      // 186    14
      // 236    24
      speedTicks2: [ // Pininfarina 109
        { v: 62, time: 1.86 },
        { v: 124, time: 4.75 },
        { v: 217, time: 17 }, //  good
      ],
      speedTicks3: [ // Corvette tuned 97
        { v: 60, time: 3.6 },
        { v: 129, time: 11.4 },
        { v: 200, time: 50 }, //  good
      ],
      speedTicks4: [ // Macan 70
        { v: 60, time: 4.1 },
        { v: 124, time: 16.9 },
        { v: 169, time: 85 }, //  good
      ],
      speedTicks7: [ // M2 CS 86
        { v: 62, time: 4.0 },
        { v: 120, time: 11.7 },
        { v: 174, time: 85 }, // 25 good
      ],
      speedTicks8: [ // Volvo 55
        { v: 60, time: 5.8 },
        { v: 95, time: 14.7 },
        { v: 155, time: 99 }, // 30 good
      ],
      speedTicks9: [ // Venom F5 131
        { v: 62, time: 2.56 },
        { v: 186, time: 8.4 },
        { v: 311, time: 24.9 }, 
      ],
      speedTicks10: [ // Other
        { v: 62, time: 5.9 },
        { v: 124, time: 23.2 },
        { v: 140, time: 33.7 }, 
      ],
      // 0       0
      // 60      4.1
      // 124     16.9
      // 169     85
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
      highchartsConfig: {},
      counter: 0,
      v60: 0,
      v100: 0,
      highestSpeed: 0,
      showMra: false,
      snap: true
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {

    setTimeout(() => {
      this.prepareChart();
    }, 100);

    
  },
  beforeDestroy() {
    
  },
  computed: {
    ready() {
      let allNumbers = true;

      let currentV = 0;
      let currentT = 0;
      let foundError = this.speedTicks.find(x => {
        if (Number(x.v) <= currentV) return true;
        if (Number(x.time) <= currentT) return true;
        currentV = Number(x.v);
        currentT = Number(x.time);
      })
      if (foundError) return false;

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
    prepareChart(key = '', count = 0, lastTimeReplacer = {}) {
      count++;
      if (count > 5) {
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: "Unable to resolve MRA",
          type: "error"
        });
        return;
      }

      let vm = this;
      let xAxisArray = [];
      let objListRid = {};
      let xForSpline = [0];
      let yForSpline = [0];

      let speeds = [];
      this[`speedTicks${key}`].map((x, ix) => {
        if (x.v && x.time) {
          // if (ix === 0) {
          //   let speedPerSec = x.v / x.time;
          //   let timeTo20 = 20 / speedPerSec;
          //   xForSpline.push(Number((timeTo20 * 0.8).toFixed(2)));
          //   yForSpline.push(Number(20));
          // }
          xForSpline.push(Number(x.time));
          yForSpline.push(Number(x.v));
          speeds.push(Number(x.v));

          this.speedTicks[ix].v = Number(x.v);
          this.speedTicks[ix].time = Number(x.time);
        }
      })
      this.highestSpeed = Math.max(...speeds);

      // console.log(yForSpline, xForSpline);

      



      

      let data = [];
      yForSpline.map((x, ix) => {
        data.push([xForSpline[ix], x]);
      })

      if (lastTimeReplacer.last) {
        data[data.length - 1] = [ lastTimeReplacer.last, data[data.length - 1][1] ]
      }
      if (lastTimeReplacer.first) {
        data[1] = [ lastTimeReplacer.first, data[1][1] ]
      }

      if (this.highestSpeed < 105) {
        // no mra
        let result = data.map(point => {
          return { x: point[0], y: point[1]  }
        })
        this.v100 = 0;
        this.v60 = 0;
        this.showMra = false;
        vm.buildChart(result);
        return;
      };
      this.showMra = true;
      let xyData = [];
      let data2D = [];
      for (let i = 0; i < data.length; ++i) {
        data2D.push([data[i][0], data[i][1]])
        xyData.push({x:data[i][0], y:data[i][1]})
      }
      

      if (false) { // Alglib
        let degree = 3;

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

          let x_values = data.map(function(elt) { return elt[0]; });
          let x_min = Math.min.apply(null,x_values)
          let x_max = Math.max.apply(null,x_values)
          let n = 100
          let r = (x_max-x_min)/n
          for (let i = 0; i <= n; ++i) {
            let x = x_min + i * r
            spline_data.push({x:x, y:f(coefs,x)})
          }

          // this.v100 = this.aproxY(f, coefs, 100);
          // spline_data.push({ x: this.v100, y: 100 })

          // let found60 = spline_data.find(x => x.y === 60);
          // // debugger;
          // if (found60) {
          //   this.v60 = found60.y;
          // } else {
          //   this.v60 = this.aproxY(f, coefs, 60);
          //   spline_data.push({ x: this.v60, y: 60 })
          // }


          spline_data.sort((a,b) => {
            return a.x - b.x;
          }) 
          // console.log(spline_data);

          vm.buildChart(spline_data);

          solver.remove() //required to free the memory in C++
        })

      }


      if (false) { // simple symmetrical sigmoidal
        var f = function(x, minYAxis, maxYAxis, midX, steepness) {
          // a = minimum value of x-axis
          // b = maximum value of x-axis
          // c = value of y-axis corresponding to the midpoint of the curve
          // d = controls the steepness of the curve
          // debugger;

          return 422.4937 + (2.646018*(10**-14) - 422.4937) / (1 + ((x / 18.37961)**0.8823977))
          return maxYAxis + (minYAxis - maxYAxis) / (1 + ((x / midX)**steepness))
          return minYAxis + (maxYAxis - minYAxis) / (1 + ((x / midX)**steepness))
        }

        let actual_data = [];
        let spline_data = [];
        for (let i = 0; i < data.length; ++i) {
          actual_data.push({x:data[i][0], y:data[i][1]})
        }
        // spline_data = JSON.parse(JSON.stringify(actual_data));

        let x_values = data.map((elt) => elt[0]);
        let x_min = Math.min.apply(null,x_values);
        let x_max = Math.max.apply(null,x_values);
        let x_half = Math.floor(x_values.length / 2);
        let x_med = (x_values.length % 2 ? x_values[x_half] : (x_values[x_half - 1] + x_values[x_half]) / 2);

        let y_values = data.map((elt) => elt[1]);
        let y_min = Math.min.apply(null,y_values);
        let y_max = Math.max.apply(null,y_values);
        let y_half = Math.floor(y_values.length / 2);
        let y_med = (y_values.length % 2 ? y_values[y_half] : (y_values[y_half - 1] + y_values[y_half]) / 2);

        let n = 100;
        let r = (x_max-x_min)/n;
        for (let i = 0; i <= n; ++i) {
          let x = x_min + i * r
          spline_data.push({ x: x, y: f(x, y_min, y_max, x_med, 3.48) })
        }
        console.log(spline_data);
        vm.buildChart(spline_data);

      }

      if (false) { // ML but not sigmoidal
        const _ML = require('ml-regression');
        console.log(Object.keys(_ML));
        const _Solver = require('ml-regression').KRR;
        debugger;
  
        // Given x and y dataset
        let x_values = data.map((elt) => elt[0]);
        let y_values = data.map((elt) => elt[1]);
        // console.log(_Solver);
  
        // Fitting the symmetrical sigmoidal 4PL model to the dataset
        const regression = new _Solver(data2D);
        // const regression = new _Solver(y_values, x_values);
  
        // Predicting a y value for a given x value
        const xValueToPredict = 100;
        const predictedYValue = regression.predict(xValueToPredict);
  
        console.log(predictedYValue, "Expected: ~4.87");
        debugger;

      }


      if (true) { // sigmoidal 4PL

        function fivePLCurveFit(x, top, bottom, EC50, slope, hillSlope) {
          var response = bottom + ((top - bottom) / (1 + Math.pow((x / EC50), hillSlope))) * Math.pow((x / EC50), slope);
          return response;
        }
  
        let xData = data.map((elt) => elt[0]);
        let yData = data.map((elt) => elt[1]);

        if (true && xData.length >= 3) { // edit long time intervals
          let subLast = xData[xData.length - 2];
          let last = xData[xData.length - 1];
          if (last > subLast * 2.4) {

            // xData[xData.length - 1] = Math.round(subLast * 2.4);
            // xData[xData.length - 1] = Math.round( ((last - subLast) / 2) + subLast );

            // xData.push(Math.round(subLast * 2.9));
            // xData.push(Math.round( ((last - subLast) / 2) + subLast ));
            // yData.push(Math.round(yData[yData.length - 1] * 0.9));
            // xData.sort((a,b) => a - b);
            // yData.sort((a,b) => a - b);
            // console.log(JSON.stringify(xData), JSON.stringify(yData));
          }
        }
  
        var result = numeric.uncmin(function(params) {
          var residuals = [];
  
          for (var i = 0; i < xData.length; i++) {
            var x = xData[i];
            var y = yData[i];
            var modelY = fivePLCurveFit(x, params[0], params[1], params[2], params[3], params[4]);
            var residual = y - modelY;
            residuals.push(residual);
          }
  
          return numeric.norm2(residuals);
        }, [1, 1, 1, 1, 1]);
  
        var fittedParams = result.solution;
  
        let spline_data = [];
        let second_data = [];
        for (let i = 0; i < data.length; ++i) {
          spline_data.push({x:data[i][0], y:data[i][1]})
        }
  
        
        let x_min = Math.min.apply(null,xData);
        let x_max = Math.max.apply(null,xData);
  
  
        if (true) { // loop n predictions
          second_data = [];
          let n = 10;
          let r = (x_max-x_min)/n;
          for (let i = 0; i <= n; ++i) {
            let x = x_min + i * r;
            var y = fivePLCurveFit(x, fittedParams[0], fittedParams[1], fittedParams[2], fittedParams[3], fittedParams[4]);
            second_data.push({ x, y })
          }
        }
  
        if (true) { // predict v60 and v100
          this.v100 = this.aproxY(fivePLCurveFit, fittedParams, 101);
          spline_data.push({ x: this.v100, y: 100 })
  
          let found60 = spline_data.find(x => x.y === 60);
          // debugger;
          if (found60) {
            this.v60 = found60.x;
          } else {
            this.v60 = this.aproxY(fivePLCurveFit, fittedParams, 60);
            spline_data.push({ x: this.v60, y: 60 })
          }
  
          spline_data.sort((a,b) => {
            return a.x - b.x;
          }) 
        }

        if (true) { // check if good result
          let secondDataLastY = second_data[second_data.length - 1].y;
          let splineDataLastY = spline_data[spline_data.length - 1].y;
          if (Math.abs(secondDataLastY - splineDataLastY) > 2) {
            // bad predictions
            console.log("last predict:", secondDataLastY, "last real:", splineDataLastY);

            if (true) { // edit long time intervals
              let subLast = xData[xData.length - 2];
              let last = xData[xData.length - 1];
              if (last > subLast * 2.4) {
                this.prepareChart('', count, { last: Math.round( ((last - subLast) / 2) + subLast ) });
                return;
              } else if (last < subLast * 2) {
                this.prepareChart('', count, { last: last * 1.1 });
                return;
              }
            }

          }
        }

        if (false) { // check if good result initial time
          let secondDataFirstY = second_data[0].y;
          let splineDataFirstY = spline_data[0].y;
          if (Math.abs(secondDataFirstY - splineDataFirstY) > 2) {
            // bad predictions
            console.log("first predict:", secondDataFirstY, "last real:", splineDataFirstY);

            if (true) { // edit long time intervals
              this.prepareChart('', count, { first: Number((spline_data[1].y - 0.03).toFixed(2)) });
              return;
              let subLast = xData[xData.length - 2];
              let last = xData[xData.length - 1];
              if (last > subLast * 2.4) {
              }
            }

          }
        }

        if (true) { // check if high MRA and long last time interval
          let mra = (this.v60 / (this.v100 - this.v60)) * 100;
          if (mra > 130) {
            let subLast = xData[xData.length - 2];
            let last = xData[xData.length - 1];
            if (last > subLast * 2.4 && last > 40) {
              this.prepareChart('', count, { last: Math.round( ((last - subLast) / 2) + subLast ) });
              return;
            }

          }
        }


  
        // console.log(second_data);
        vm.buildChart(spline_data, second_data);

      }





      // debugger;


      





      
      





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
    buildChart(algbData, second_data) {
      let vm = this;
      let series = [];
      this.$store.commit("START_LOGROCKET", {});

      if (second_data && second_data.length > 0)  {
        series.push(
          {
            data: second_data,
            name: "Predicted",
            enableMouseTracking: false,
            color: '#d52c2c',
            marker: {
              enabled: false
            }
          }
        )
      }

      series.push(
        {
          data: algbData,
          name: "Inputed",
          enableMouseTracking: true,
          color: "#50ab2c",
          marker: {
            symbol: "circle",
            enabled: true
          },
        }
      )

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
          enabled: true,
        },
        series,
        yAxis: {
          min: 0,
          allowDecimals: false,
          crosshair: {
            snap: vm.snap,
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
            snap: vm.snap,
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
            },
            point: {
              events: {
                click: function (e) {
                  vm.snap = !vm.snap;
                  vm.$refs.acelChart.chart.update({
                      xAxis: {
                        crosshair: {
                          snap: vm.snap
                        }
                      },
                      yAxis: {
                        crosshair: {
                          snap: vm.snap
                        }
                      },
                  });
                }
              }
            }
          },
          scatter: {
            boostThreshold: 2000
          }
        },
      }
    },
    aproxY(f, fittedParams, yExpected, factor = 1, xCurrent = 0) {
      // console.log("aproxY");
      let count = 0;
      let matched = false;
      let found = false;
      while (!matched && count < 1000) {
        // let y = f(coefs,xCurrent);
        var y = f(xCurrent, fittedParams[0], fittedParams[1], fittedParams[2], fittedParams[3], fittedParams[4]);

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
        return this.aproxY(f, fittedParams, yExpected, factor, xCurrent);
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
  flex-wrap: wrap;
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
.MainAccelCurveMaker_LoadButton {
  min-width: 150px;
}

</style>