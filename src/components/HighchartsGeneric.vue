<template>
  <div class="HighchartsGeneric_Layout">
    <div v-if="noData" class="HighchartsGeneric_Empty">
      <div v-if="config.title" class="HighchartsGeneric_TitleEmpty">{{ config.title.text }}</div>
      {{ $t("m_noData") }}
    </div>
    <div :id="id" class="HighchartsGeneric_Div" />
  </div>
</template>

<script>
import Highcharts from "highcharts";
import Dark from "highcharts/themes/dark-unica";
import Accessibility from "highcharts/modules/accessibility";
import Stock from "highcharts/modules/stock";
let uid = 0;

export default {
  name: 'HighchartsGeneric',
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
      id: `hcgid-${uid}`,
      chart: null,
      returnedFunction: null,
      noData: false
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
    Dark(Highcharts);
    Accessibility(Highcharts);
    Stock(Highcharts);

    this.returnedFunction = Vue.debounce(this.handleResize, 200);
    window.addEventListener('resize', this.returnedFunction);
  },
  mounted() {
    this.checkEmpty();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.returnedFunction);
  },
  computed: {},
  methods: {
    renderChart() {
      var _this = this;

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
          formatter: _this.config.disableTooltipFormater ? undefined : function () {
            if (this.point.className === 'HighchartsGeneric_HidePoint') return false;
            if (!this.point.custom || !this.point.custom.photo) return false;

            var body = `<img src="${this.point.custom.photo}" class="HighchartsGeneric_CarPhoto">`+
            `<div><span style="color: ${this.point.custom.color}">RQ${this.point.y}</span>&nbsp;<span>${this.point.name}</span></div>`+
            `<span><b>${ _this.$t('m_time') }: </b>${Vue.options.filters.toTimeString(this.point.x, _this.trackCode)}</span><br/>`+
            `<span><b>${ _this.$tc('c_tyre', 2) }: </b>${this.point.custom.car.tyres}</span><br/>`+
            `<span><b>${ _this.$tc('c_drive', 2) }: </b>${this.point.custom.car.drive}</span><br/>`+
            `<span><b>${ _this.$tc('c_clearance', 2) }: </b>${this.point.custom.car.clearance}</span><br/>`+
            `<span><b>MRA: </b>${this.point.custom.car.mra}</span><br/>`+
            `<span><b>${ _this.$t('m_by') }: </b>${this.point.custom.user}</span><br/>`;

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
            events: {
              click: function (event) {
                _this.$emit('detail', event);
              },
            },
          },
        },
        series: []
      };
      // end options

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
          this.renderChart();
        })        
      } else {
        this.noData = true;
      }
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
.HighchartsGeneric_Layout {
  display: contents;
}
.HighchartsGeneric_Div {
  height: 100%;
  width: 100%;
}
.HighchartsGeneric_Empty {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 30px;
  flex-grow: 1;
}
.HighchartsGeneric_TitleEmpty {
  font-size: 20px;
  margin-bottom: 50px;
}
.HighchartsGeneric_Empty ~ .HighchartsGeneric_Div {
  display: none;
}
.HighchartsGeneric_CarPhoto {
  height: 60px;
  border-radius: 6px;
}
.HighchartsGeneric_HidePoint {
  opacity: 0.06;
  pointer-events: none;
}
.HighchartsGeneric_Suspect {
  stroke-width: 4px !important;
  stroke: fuchsia;
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
  /* stroke-width: 0px !important; */
}
.highcharts-tooltip > * {
  font-family: "Roboto", sans-serif !important;
}
</style>