<template>
  <div class="MainCharts_Layout">
    <div class="MainCharts_Header">
      <div :class="{ Main_ChartTrackBoxSelected: chartTrack }" class="Main_ChartTrackBox">
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
      </div>
      <div class="Main_ChartFilter Main_DarkScroll">
        <template v-if="chartFilter">
          <div class="Cg_Reqs">
            <BaseFilterDescription :filter="chartFilter" :asFilterLabel="true" />
          </div>
        </template>
        <div class="Cg_FilterButtons">
          <button
            :disabled="chartLoading"
            class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
            @click="openChartOfDialog()">{{ chartFilter ? $t("m_change") : $t("m_requirements") }}</button>
        </div>
      </div>
      <div v-if="!user || !user.tier || user.tier > 2" style="margin-top: 20px;" class="Main_SaveGalleryGuide">
        <span>{{ $t("p_patronsOnly", { tier: 2 }) }}<br>{{ $t("p_chartsDescription") }} <a class='D_Link D_LinkUnder' target='_blank' href='https://youtu.be/xwMB8BGM2JM'>Youtube</a></span>
      </div>
      <div
        class="Main_ChartTrackBox Main_ChartFilterChipsInside"
        style="margin-top: 4px;">
        <template v-for="(item, ix) in ['332', '323', '233', '111']">
          <BaseChip
            v-model="chartTunes"
            class="BaseChip_MinWidth BaseChip_TuneStyle"
            :value="item" />
        </template>
      </div>
      <BaseConfigCheckBox
        v-model="chartShowDownvoted"
        style="margin-top: 3px;"
        class="Main_ChartTrackBox"
        name="chartShowDownvoted"
        :label="$t('m_includeDownvote')" />
      <BaseConfigCheckBox
        v-model="chartHideOutOfFilter"
        style="margin-top: 3px;"
        class="Main_ChartTrackBox"
        name="chartHideOutOfFilter"
        :label="$t('m_chartHideOutOfFilter')" />
      <button
        v-if="user && user.tier <= 2"
        :class="{ D_Button_Loading: chartLoading }"
        :disabled="chartLoading || !chartTrack"
        class="D_Button Main_SaveAllButton Main_ChartAnalyzeButton"
        @click="chartAnalyse()">
        <span>{{ $t("m_loadChart") }}</span>
        <i class="ticon-arrow_down_3" style="margin-left: 5px;" aria-hidden="true"/>
      </button>
    </div>
    <div v-if="highchartsConfig.chart" class="MainCharts_Body">
      <Highcharts
        :config="highchartsConfig"
        :counter="counter"
        :trackCode="chartTrack.code || ''"
        @detail="detailClick($event)" />
    </div>

    <BaseSearchTrackDialog
      :active="customTrackDialog"
      @close="closeDialogTrackSearch()"
      @toggleTrack="toggleTrack($event.track, $event.e)"
      @resolved="getResolvedTrack($event)"
    />

    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      @filterUpdate="updateChartFilter($event)"
      @listRids="chartAnalyseFinish($event);"
    />

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

import tracksRepo from '../database/tracks_repo.json'
import all_cars from '../database/cars_final.json'

export default {
  name: 'MainCharts',
  components: {
    BaseSearchTrackDialog,
    BaseConfigCheckBox,
    BaseFilterDescription,
    BaseFilterDialog,
    Row,
    Highcharts,
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
      tracksRepo,
      all_cars,
      all_cars_obj: {},
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
      counter: 0
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
    this.all_cars.map(x => {
      this.all_cars_obj[x.rid] = x;
    })
  },
  mounted() {
    let vm = this;
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
  computed: {},
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
    prepareChart(listOfRids) {
      let vm = this;
      let arrDados = this.chartResult;
      let series = [];
      let objListRid = {}
      listOfRids.map(x => {
        objListRid[x.rid] = true;
      });

      let byProximity = { S:[], A:[], B:[], C:[], D:[], E:[], F:[] };
      let bannedTimes = { S:[], A:[], B:[], C:[], D:[], E:[], F:[] };
      let timesPerClass = { S:[], A:[], B:[], C:[], D:[], E:[], F:[] };


      arrDados.map(x => {
        timesPerClass[x.class].push(x.time)
      })
      Object.keys(timesPerClass).map(key => {
        timesPerClass[key].sort((a, b) => a - b);
      })
      Object.keys(timesPerClass).map(key => {
        byProximity[key] = this.groupProximity(timesPerClass[key])
        if (timesPerClass[key].length > 10) {
          byProximity[key].map((x, ix) => {
            if (ix === 0 || ix === byProximity[key].length - 1) {
              if (typeof x === 'number') bannedTimes[key].push(x);
              if (typeof x === 'object' && x.length < 3 && x.length > 0) {
                x.map(time => {
                  bannedTimes[key].push(time)
                })
              }
            }
          })
        }
      })

      arrDados = arrDados.filter(x => {
        x.car = vm.all_cars_obj[x.rid];
        if (
          bannedTimes[x.class].includes(x.time) &&
          x.rq !== 10 &&
          !this.chartTrack.code.includes('drag') &&
          (x.car.tyres !== "Slick" || this.chartTrack.code.includes('_a00')) &&
          (x.car.tyres !== "Off-road" || !this.chartTrack.code.includes('_a01')) &&
          x.rid !== 'Land_Rover_Series_1_1948'
          ) {
          if (!this.user.canDelete) {
            return false;
          } else {
            x.suspect = true;
          }
        }
        return true;
      });

      arrDados.map((x, ix) => {
        if (this.chartHideOutOfFilter && !objListRid[x.rid]) {
          return;
        }

        let inSeries = series.find(y => y.name === x.class)
        if (!inSeries) {
          series.push({ name: x.class, color: Vue.resolveClass(x.rq, x.class, "color") });
          inSeries = series[series.length-1]
        }
        if (!inSeries.data) {
          inSeries.data = [];
        }

        let photo = Vue.carPhoto(x);
      
        inSeries.data.push({
            y: x.rq,
            x: x.time,
            name: `${x.name} (${x.tune})`,
            className: `${objListRid[x.rid] ? '' : "Highcharts_HidePoint "}${x.suspect ? "Highcharts_Suspect " : '' }`,
            custom: {
              ...x,
              photo: photo,
              color: Vue.resolveClass(x.rq, x.car.class, "color"),
              user: x.user
            }
        })
      })

      var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

      this.highchartsConfig = {
        boost: {
          seriesThreshold: series.length,
          useGPUTranslations: true,
          usePreAllocated: true
        },
        chart: {
          type: "scatter",
        },
        legend: {
          enabled: false,
        },
        series,
        yAxis: {
          min: 0,
          max: 110,
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
    median(arr) {
      if (arr.length == 0) {
        return; // 0.
      }
      arr.sort((a, b) => a - b); // 1.
      const midpoint = Math.floor(arr.length / 2); // 2.
      const median = arr.length % 2 === 1 ?
        arr[midpoint] : // 3.1. If odd length, just take midpoint
        (arr[midpoint - 1] + arr[midpoint]) / 2; // 3.2. If even length, take median of midpoints
      return median;
    },
    groupProximity(arr) {
      return arr.reduce(function(r, e, i) {
        if (i != 0) {
          (e - arr[i - 1] < ((e+arr[i-1])/2)*0.1 ) ? r[r.length - 1].push(e) : r.push([e])
        } else {
          r.push([e])
        }
        if (i == arr.length - 1) {
          r = r.map(e => e.length == 1 ? e[0] : e)
        }
        return r;
      }, [])
    }
  },
}
</script>

<style>
.Main_ChartTrackBoxSelected {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.MainCharts_Body {
  height: 600px;
  margin-top: 30px;
}
.MainCharts_Header {
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
.Main_ChartFilterChipsInside {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>