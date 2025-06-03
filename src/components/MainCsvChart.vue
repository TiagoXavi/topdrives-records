<template>
  <div class="MainCsvChart_Layout">
    <div v-for="(item, iitem) in items" class="MainCsvChart_W">
      <div class="MainCsvChart_Header">
        <div class="MainCsvChart_"></div>
        <div class="MainCsvChart_ItemTitle">{{ item.title }}</div>
        <div class="MainCsvChart_HeaderDelete">
          <button
            class="D_Button D_ButtonDarkTransparent"
            @click="items = items.filter( (x,i) => i !== iitem )">
            <i aria-hidden="true" class="ticon-close_3" />
          </button>
        </div>
      </div>
      <div
        :class="{
          MainCsvChart_Not_FWD: !drivesModel.includes('FWD') || hoverClass === 'FWD',
          MainCsvChart_Not_RWD: !drivesModel.includes('RWD') || hoverClass === 'RWD',
          MainCsvChart_Not_4WD: !drivesModel.includes('4WD') || hoverClass === '4WD',
          MainCsvChart_Not_Low: !clearancesModel.includes('Low') || hoverClass === 'Low',
          MainCsvChart_Not_Mid: !clearancesModel.includes('Mid') || hoverClass === 'Mid',
          MainCsvChart_Not_High: !clearancesModel.includes('High') || hoverClass === 'High',
          MainCsvChart_Not_Performance: !tyresModel.includes('Performance') || hoverClass === 'Performance',
          MainCsvChart_Not_Standard: !tyresModel.includes('Standard') || hoverClass === 'Standard',
          ['MainCsvChart_Not_All-surface']: !tyresModel.includes('All-surface') || hoverClass === 'All-surface',
          ['MainCsvChart_Not_Off-road']: !tyresModel.includes('Off-road') || hoverClass === 'Off-road',
          MainCsvChart_Not_Slick: !tyresModel.includes('Slick') || hoverClass === 'Slick'
        }"
        class="MainCsvChart_Body">
        <div class="MainCsvChart_Chips">
          <div class="Main_FilterThree" style="margin: 15px 0px;">
            <div class="Main_FilterChipsInside">
              <template v-for="(item, ix) in tyres">
                <div 
                  @mouseover="hoverClass = item"
                  @mouseout="hoverClass = ''">
                  <BaseChip
                    v-model="tyresModel"
                    class="BaseChip_MinWidth"
                    :label="$t(`c_${item.toLowerCase()}2`)"
                    :value="item" />
                </div>
              </template>
            </div>
            <div class="Main_FilterChipsInside">
              <template v-for="(item, ix) in drives">
                <div 
                  @mouseover="hoverClass = item"
                  @mouseout="hoverClass = ''">
                  <BaseChip
                    v-model="drivesModel"
                    class="BaseChip_MinWidth"
                    :value="item" />
                </div>
              </template>
            </div>
            <div class="Main_FilterChipsInside">
              <template v-for="(item, ix) in clearances">
                <div 
                  @mouseover="hoverClass = item"
                  @mouseout="hoverClass = ''">
                  <BaseChip
                    v-model="clearancesModel"
                    class="BaseChip_MinWidth"
                    :label="$t(`c_${item.toLowerCase()}`)"
                    :value="item" />
                </div>
              </template>
            </div>
          </div>
        </div>
        <div v-for="chart in item.charts" class="MainCsvChart_Chart">
          <div v-if="chart.config" class="MainCharts_Body">
            <HighchartsGeneric
              :config="chart.config"
              :counter="chart.counter"
              :trackCode="chart.trackCode || ''"
              @detail="detailClick($event)" />
          </div>
        </div>
      </div>
    </div>
    <div class="MainCsvChart_Footer D_Center2">
      <div class="MainCsvChart_UploadButton">
        <label class="D_Button D_ButtonDark D_ButtonDark2 MainCsvChart_UploadButton">
          <input
            class="MainCsvChart_UploadInput"
            type="file"
            accept="text/csv"
            @change="loadCSV($event)">
            <span class="MainCsvChart_UploadLabel">Load raw (CSV)</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import all_cars from '../database/cars_final.json';
import BaseCardGallery from './BaseCardGallery.vue';
import BaseFilterDialog from './BaseFilterDialog.vue';
import BaseFilterDescription from './BaseFilterDescription.vue';
import BaseIconSvg from './BaseIconSvg.vue';
import HighchartsGeneric from './HighchartsGeneric.vue'
import BaseChip from './BaseChip.vue'

// import temp from "./tempJson.json";

export default {
  name: 'MainCsvChart',
  components: {
    BaseCardGallery,
    BaseFilterDialog,
    BaseFilterDescription,
    BaseIconSvg,
    HighchartsGeneric,
    BaseChip
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [],
      all_cars,
      all_cars_obj: {},
      resolvedRids: {},
      guidToRid: {},
      carsReady: false,
      memoryFileName: "Rallycross medium_30Dirt&70Mud.csv",
      chartHideOutOfFilter: false,
      tyres: ["Off-road", "All-surface", "Standard", "Performance", "Slick"],
      drives: ["FWD", "RWD", "4WD"],
      clearances: ["Low", "Mid", "High"],
      tyresModel: [],
      drivesModel: [],
      clearancesModel: [],
      hoverClass: "",
      cats: [
        "2WD_Off-road",
        "2WD_All-surface",
        "2WD_Standard",
        "2WD_Performance",
        "Slick",
        "4WD_Off-road",
        "4WD_All-surface",
        "4WD_Standard",
        "4WD_Performance"
      ]
    }
  },
  watch: {},
  beforeMount() {
    this.tyresModel = this.tyres;
    this.drivesModel = this.drives;
    this.clearancesModel = this.clearances;

    Number.prototype.toHHMMSS = function () {
      var numm = Number(this.toFixed(3).slice(0,-1))
      var sec_num = parseInt(numm, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;
      var milesi = Math.round((numm - parseInt(numm)) * 100);

      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (milesi < 10) {
        milesi = '0' + milesi;
      }
      return minutes + ':' + seconds + ':' + milesi;
    };
    String.prototype.toTime = function () {
      return Vue.options.filters.toTimeNumber(this, "");
    };
    Number.prototype.toTestBowl = function () {
      return parseInt(this * 2.2369);
    };
  },
  mounted() {
    if (!this.carsReady) this.transformAllCarsToObj();

    if (typeof temp !== "undefined") this.pushNewItem(temp);
  },
  computed: {},
  methods: {
    pushNewItem(json) {
      if (json[0].Time) {
        json.map(car => {
          car.time = Number(car.Time);
          car.timeParsed = car.time.toHHMMSS();
          car.rid = this.guidToRid[car["Car GUID"]];
          car.rq = Number(car.RQ);
          car.class = Vue.resolveClass(car.rq, null, "letter");

          if (!car.rid) {
            debugger;
          }

          this.addToResolvedRids(car.rid);
          car.car = this.all_cars_obj[car.rid];

          let cat = "";
          if (car.car.tyres === "Slick") cat = "Slick";
          else {
            if (car.car.drive === "4WD") cat = "4WD"
            else cat = "2WD";
            cat += `_${car.car.tyres}`
          }
          car.cat = cat;
        })
      }


      let item = {
        json,
        title: this.memoryFileName,
        filter: {},
        charts: [
          this.chart_scatter(json),
          this.chart_line(json)
        ]
      }

      this.items.push(item);
    },
    loadCSV(e, file = null) {
      if (!file && (!e.target.files || e.target.files.length === 0)) {
        // no file
        return;
      }
      if (!file) {
        file = e.target.files[0];
      }
      this.memoryFileName = file.name;

      let reader = new FileReader();
      reader.onload = this.onload;
      reader.readAsText(file);
    },
    onload(e) {
      let str = e.target.result;
      let json = this.csvJSON(str);
      this.pushNewItem(json);
    },
    csvJSON(csv) {
      var lines = csv.split("\n");
      var result = [];
      var headers = lines[0].split(",");
      let outliers = [
        "09d252e4-0027-403a-98ac-8d9c221553ba",
        "40c22d49-b033-4e08-931b-1cdf974b8a42",
        "951ddd6a-dbec-4332-b870-abade85f2654",
        "17266626-c38c-4b1d-8bb9-630df210349c",
        "7e3cd48b-109b-4d48-a163-959a732657de",
        "4a71feed-db9e-420d-96f1-6d174a1f32cd",
        "d91a3551-0098-4b63-805a-35ede20ade3c",
        "25db2bc3-dcbe-41a6-8466-38a52d1485d6",
        "00c58c19-0efa-4158-b45b-77a16ca9647f",
      ]

      for (var i=1;i<lines.length;i++) {
        var obj = {};
        var currentline=lines[i].split(",");

        for (var j=0;j<headers.length;j++) {
          obj[(headers[j] || "").trim()] = (currentline[j] || "").trim();
        }

        if (!obj["Car GUID"]) continue;
        if (outliers.includes(obj["Car GUID"])) continue;

        result.push(obj);
      }

      // console.log(result);
      // debugger;

      return result;
    },
    addToResolvedRids(rid) {
      if (!this.resolvedRids[rid]) {
        let preCar = this.all_cars_obj[rid];
        if (preCar) {
          preCar.color = Vue.resolveClass(preCar.rq, preCar.class, "color");
          preCar.colorRgb = Vue.resolveClass(preCar.rq, preCar.class, "color", true);
          preCar.photo = Vue.carPhoto(preCar);
          this.resolvedRids[rid] = preCar;
        }
      }
    },
    transformAllCarsToObj() {
      let key = "rid";
      all_cars.map(car => {
        this.all_cars_obj[car[key]] = car;
        this.guidToRid[car.guid] = car.rid;
      });
      this.carsReady = true;
    },
    resolveTuneZ(hCar) {
      // 969 style
      return `${((hCar.engineMajor-1)*3 + hCar.engineMinor)}`+
      `${((hCar.weightMajor-1)*3 + hCar.weightMinor)}`+
      `${((hCar.chassisMajor-1)*3 + hCar.chassisMinor)}`;
    },
    resolveTune(tunZ) {
      // 323 style
      let res = null;

      if (
        tunZ[0] % 3 === 0 &&
        tunZ[1] % 3 === 0 &&
        tunZ[2] % 3 === 0
      ) {
        res = `${tunZ[0] / 3}${tunZ[1] / 3}${tunZ[2] / 3}`
      }

      return res;
    },
    detailClick(e) {
      console.log(JSON.parse(JSON.stringify(e.point.custom)));
    },
    chart_scatter(json) {
      let series = [];
      let inFilter = {}

      json.map((x, ix) => {
        if (this.chartHideOutOfFilter) {
          // TODO
          return;
        }
        if (x.Result !== "Finished") return;

        let inSeries = series.find(y => y.name === x.class);
        if (!inSeries) {
          series.push({ name: x.class, color: Vue.resolveClass(x.rq, x.class, "color") });
          inSeries = series[series.length-1]
        }
        if (!inSeries.data) {
          inSeries.data = [];
        }


        inSeries.data.push({
            y: x.rq,
            x: x.time,
            name: `${x.Name}`,
            className: 
              `MainCsvChart_C_DRIVE_${x.car.drive} `+
              `MainCsvChart_C_TYRE_${x.car.tyres} `+
              `MainCsvChart_C_CLEAR_${x.car.clearance}`,
            custom: {
              ...x,
              photo: this.resolvedRids[x.rid].photo,
              color: this.resolvedRids[x.rid].color
            }
        })
      })

      var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

      let config = {
        boost: {
          seriesThreshold: series.length,
          useGPUTranslations: true,
          usePreAllocated: true
        },
        chart: {
          type: "scatter",
          height: 600
        },
        legend: {
          enabled: false,
        },
        series,
        yAxis: {
          min: 10,
          max: 120,
          allowDecimals: false,
          labels: {
            format: 'RQ{text}'
          },
        },
        xAxis: {
          type: 'logarithmic',
          allowDecimals: false,
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
            turboThreshold: 2000
          },
          scatter: {
            boostThreshold: 2000
          }
        },
      };

      return {
        config,
        counter: 0
      };
    },
    chart_line(json) {
      let series = [];
      let inFilter = {}

      let allPerCat = {};
      let avgPerCat = {};
      this.cats.map(cat => {
        allPerCat[cat] = {};
        avgPerCat[cat] = {};
        series.push({ name: cat, data: [] });
      });

      json.map((x, ix) => {
        if (x.Result !== "Finished") return;

        if (!allPerCat[x.cat][x.rq]) allPerCat[x.cat][x.rq] = [];
        allPerCat[x.cat][x.rq].push(x.time);
      })

      Object.keys(allPerCat).map(cat => {
        Object.keys(allPerCat[cat]).map(rq => {
          let total = allPerCat[cat][rq].reduce((acc, b) => acc+b, 0);
          let avg = total / allPerCat[cat][rq].length;
          if (isNaN(avg) || avg < 0) {
            debugger;
          }
          avgPerCat[cat][rq] = avg;
        })
      })


      series.map(inSeries => {
        Object.keys(avgPerCat[inSeries.name]).map(rq => {
          inSeries.data.push({
            y: Number(rq),
            x: Number(avgPerCat[inSeries.name][rq].toFixed(2))
          })
          inSeries.data.sort((a,b) => a.y - b.y)
        })
        inSeries.dataLabels = {
          enabled: true,
          formatter: function() {
            return this.point.index === this.series.data.length - 1 ? this.series.name : ''; // Display series name
          },
          style: {
            fontWeight: 'bold',
            color: 'black'
          }
        }
      })

      var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

      let config = {
        disableTooltipFormater: false,
        title: {
          text: 'Avg time per RQ and cat'
        },
        boost: {
          seriesThreshold: series.length,
          useGPUTranslations: true,
          usePreAllocated: true
        },
        chart: {
          type: "spline",
          height: 600
        },
        legend: {
          enabled: true,
        },
        series,
        yAxis: {
          min: 10,
          max: 120,
          allowDecimals: false,
          labels: {
            format: 'RQ{text}'
          },
        },
        xAxis: {
          type: 'logarithmic',
          allowDecimals: false,
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
            turboThreshold: 2000
          }
        },
      };

      return {
        config,
        counter: 0
      };
    }
  },
}
</script>

<style>
.MainCsvChart_Layout {
  margin: 15px;
}
.MainCsvChart_Footer {
  margin-top: 100px;
  padding-bottom: 200px;
}
.D_Button.MainCsvChart_UploadButton {
  --height: 23px;
}
.MainCsvChart_UploadInput[type="file"] {
  display: none;
}
.MainCsvChart_W + .MainCsvChart_W {
  margin-top: 100px;
}
.MainCsvChart_W {
  position: relative;
}
.MainCsvChart_Header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--d-back);
}
.MainCsvChart_ItemTitle {
  font-size: 34px;
  color: rgb(var(--d-text-yellow));
  text-align: center;
}
.MainCsvChart_Chart + .MainCsvChart_Chart {
  margin-top: 50px;
}

.MainCsvChart_Not_FWD .MainCsvChart_C_DRIVE_FWD,
.MainCsvChart_Not_RWD .MainCsvChart_C_DRIVE_RWD,
.MainCsvChart_Not_4WD .MainCsvChart_C_DRIVE_4WD,
.MainCsvChart_Not_Low .MainCsvChart_C_CLEAR_Low,
.MainCsvChart_Not_Mid .MainCsvChart_C_CLEAR_Mid,
.MainCsvChart_Not_High .MainCsvChart_C_CLEAR_High,
.MainCsvChart_Not_Performance .MainCsvChart_C_TYRE_Performance,
.MainCsvChart_Not_Standard .MainCsvChart_C_TYRE_Standard,
.MainCsvChart_Not_All-surface .MainCsvChart_C_TYRE_All-surface,
.MainCsvChart_Not_Off-road .MainCsvChart_C_TYRE_Off-road,
.MainCsvChart_Not_Slick .MainCsvChart_C_TYRE_Slick {
  opacity: 0.03;
  pointer-events: none;
}

</style>