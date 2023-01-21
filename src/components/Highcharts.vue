<template>
  <div class="Highcharts_Layout">
    <div v-if="noData" class="Highcharts_Empty">
      <div v-if="config.title" class="Highcharts_TitleEmpty">{{ config.title.text }}</div>
      Sem dados para exibir
    </div>
    <div :id="id" class="Highcharts_Div" />
  </div>
</template>

<script>
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import Export from "highcharts/modules/export-data";
import Dark from "highcharts/themes/dark-unica";
import Accessibility from "highcharts/modules/accessibility";
import drilldown from "highcharts/modules/drilldown";
import wordcloud from "highcharts/modules/wordcloud";
import Histogram from "highcharts/modules/histogram-bellcurve";
let uid = 0;

export default {
  name: 'Highcharts',
  components: {
    // BaseDetalheHeader
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    counter: {
      type: Number,
      default: 0
    },
    trackCode: {
      type: String,
      default: ""
    }
  },
  data() {
    uid += 1;
    return {
      id: `hcid-${uid}`,
      chart: null,
      chartSlidersDebounceFunction: null,
      returnedFunction: null,
      noData: false,
      renderCount: 0
    }
  },
  watch: {
    counter() {
      let vm = this;
      console.log(this.counter);
      setTimeout(() => {
        vm.handleResize();
      }, 0);
    },
    config() {
      this.checkEmpty();
    }
  },
  beforeMount() {
    // Exporting(Highcharts);
    // Export(Highcharts);
    Dark(Highcharts);
    Accessibility(Highcharts);
    // wordcloud(Highcharts);

    this.chartSlidersDebounceFunction = Vue.debounce(this.renderChart, 500);

    this.returnedFunction = Vue.debounce(this.handleResize, 200);
    window.addEventListener('resize', this.returnedFunction);
  },
  mounted() {
    this.checkEmpty();
  },
  computed: {},
  methods: {
    renderChart() {
      var _this = this;
      // Highcharts.seriesTypes.wordcloud.prototype.placementStrategy.randomHorizontal = this.randomPlacement;

      let options = {
        chart: {
          type: 'spline',
          zoomType: 'x',
          pinchType : 'xy',
          reflow: false,
          events: {
            load: function (event) {
              event.target.reflow();
            }
          },
          animation: {
            duration: 200
          },
          resetZoomButton: {
            position: {
              y: 30
            }
          }
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        credits: {
          enabled: false
        },
        tooltip: {
          style: {
            fontSize: "14px"
          },
          useHTML: true,
          // headerFormat: '<b>{point.name}</b><br>',
          // pointFormat: `RQ: {point.x}<br>Time: {point.y}`
          formatter: function () {
            if (this.point.className === 'Highcharts_HidePoint') return false;

            var body = `<img src="${this.point.custom.photo}" class="Highcharts_CarPhoto" alt="">`+
            `<div><span style="color: ${this.point.custom.color}">RQ${this.point.y}</span>&nbsp;<span>${this.point.name}</span></div>`+
            `<span><b>Time: </b>${Vue.options.filters.toTimeString(this.point.x, _this.trackCode)}</span><br/>`+
            `<span><b>Tyres: </b>${this.point.custom.tyres}</span><br/>`+
            `<span><b>Drive: </b>${this.point.custom.drive}</span><br/>`+
            `<span><b>Clearance: </b>${this.point.custom.clearance}</span><br/>`+
            `<span><b>MRA: </b>${this.point.custom.mra}</span><br/>`;

            // var body = newPoints.reduce(function (s, point) {
            //   return s + '<br/><br/>' + `<span style="color:${point.color};">\u25CF</span> `
            //   + `<span>${point.series.name}</span>: `
            //   + '<span><b>'
            //   + point.point.custom.percentageLine
            //   + '%</b> ('
            //   + point.y
            //   + ` processo${point.y < 2 ? '' : 's'})</span>`
            //   + '<br/>' + `<span style="color:${point.color};">\u25CF</span> `
            //   + `<span>Total da linha</span>: `
            //   + '<span><b>'
            //   + point.point.custom.countSum
            //   + '</b> processos ('
            //   + point.point.custom.lineSumPercentage
            //   + '% do grupo)';
            // }, '');

            return body;
          },
        },
        xAxis: {
          title: {
            enabled: false
          },
          tickLength: 0,
          gridLineColor: "#fff1",
          gridLineWidth: "1",
          labels: {
            style: {
              fontSize: "14px"
            }
          }
        },
        yAxis: {
          allowDecimals: false,
          title: {
            enabled: false
          },
          gridLineColor: "#fff1",
          tickLength: 0,
          labels: {
            style: {
              fontSize: "14px"
            }
          }
        },
        legend: {
          enabled: true,
          itemStyle: {
            fontSize: "14px"
          }
        },
        plotOptions: {
          scatter: {
            centerInCategory: true,
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            // stickyTracking: false,
            events: {
              click: function (event) {
                _this.$emit('detail', event.point);
              },
            },
          },
          // series: {
          //   animation: this.renderCount === 0 ? true : false
          // }
        },
        series: []
      };
      // end options
      this.renderCount++;

      options = window._merge(options, this.config);

      Highcharts.setOptions({
        lang: {
          thousandsSep: ".",
          decimalPoint: ",",
          numericSymbols: [null, "mi", "bi", "tri", "qua", "quin"]
        }
      });

      // create or update if exist
      if (!this.chart) {
        this.chart = Highcharts.chart(this.id, options);
      } else {
        this.chart.update({
          series: options.series,
          xAxis: options.xAxis
        }, true, true, true);
      }

      // end of renderChart()
    },
    checkEmpty() {
      let isEmpty = true;
      if (this.config.series) {
        this.config.series.map(x => {
          if (x.data && x.data.length > 0) isEmpty = false;
        })
      }
      if (!isEmpty) {
        this.noData = false;
        this.$nextTick().then(() => {
          // if (this.chart) this.handleResize();
          // else this.renderChart();
          this.renderChart();
        })        
      } else {
        this.noData = true;
      }
    },
    randomPlacement(point, options) {
      var field = options.field;
      var r = options.rotation;
      return {
        x: this.getRandomPosition(field.width) - (field.width / 2),
        y: this.getRandomPosition(field.height) - (field.height / 2),
        rotation: 0
      };
    },
    getRandomPosition(size) {
      return Math.round((size * (Math.random() + 0.5)) / 2);
    },
    handleResize() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
        this.renderChart();
      }
    },
  },
}
</script>

<style>
.Highcharts_Layout {
  display: contents;
}
.Highcharts_Div {
  height: 100%;
  width: 100%;
}
.Highcharts_Empty {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 30px;
  flex-grow: 1;
}
.Highcharts_TitleEmpty {
  font-size: 20px;
  margin-bottom: 50px;
}
.Highcharts_Empty ~ .Highcharts_Div {
  display: none;
}
.Highcharts_CarPhoto {
  height: 60px;
  border-radius: 6px;
}
.Highcharts_HidePoint {
  opacity: 0.06;
  pointer-events: none;
}





svg.highcharts-root,
.highcharts-container {
  font-family: "Roboto", sans-serif !important;
}
svg.highcharts-root
  .highcharts-tooltip
  tspan:not([style*="bold;"]):not([style*="fill"]):not([style*="color:"]) {
  fill: rgba(255, 255, 255, 0.7) !important;
}
svg.highcharts-root .highcharts-tooltip tspan[style*="bold"] {
  font-weight: normal !important;
  fill: rgba(255, 255, 255, 1) !important;
}
svg.highcharts-root .highcharts-tooltip tspan[style*="color:"] {
  fill: currentColor;
}
.highcharts-tooltip text {
  fill: hsla(0,0%,100%,.7)!important;
}
.highcharts-map-series .highcharts-data-label text {
  /* color: #356b93 !important;
  fill: #356b93 !important; */
}
.highcharts-button-box {
  stroke: rgb(238, 238, 238);
  stroke-width: 1;
}
.highcharts-button {
  cursor: pointer;
}
.highcharts-drilldown-point {
  stroke-width: 4px;
  stroke: rgba(255,255,255,0.4);
  stroke-dasharray: 8;
}
.highcharts-scrolling[style*="overflow: auto hidden;"] {
  overflow-x: overlay !important;
}
.highcharts-scrolling {
  overflow: overlay !important;
}
.highcharts-tooltip-container {
  z-index: 20 !important;
}
.highcharts-menu {
  box-shadow: none !important;
}
.highcharts-menu-item {
  transition-duration: 0.05s;
}
.highcharts-background {
  fill: transparent !important;
}
.highcharts-title {
  text-transform: none !important;
}
.highcharts-legend-box {
  fill: transparent !important;
}
.highcharts-bar-series > rect {
  stroke: none !important;
}
.highcharts-point {
  stroke-width: 0px !important;
}
.highcharts-tooltip > * {
  font-family: "Roboto", sans-serif !important;
}
</style>