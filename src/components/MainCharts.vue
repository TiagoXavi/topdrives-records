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
            <span v-else>Select track</span>
          </button>
        </div>
      </div>
      <div class="Main_ChartFilter Main_DarkScroll">
        <template v-if="chartFilter">
          <div class="Cg_ReqsTitle">Filter</div>
          <div class="Cg_Reqs">
            <BaseFilterDescription :filter="chartFilter" />
          </div>
        </template>
        <div class="Cg_FilterButtons">
          <button
            :disabled="chartLoading"
            class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
            @click="openChartOfDialog()">{{ chartFilter ? 'Change' : 'Requirements' }}</button>
        </div>
      </div>
      <div v-if="!user || !user.tier || user.tier > 2" style="margin-top: 20px;" class="Main_SaveGalleryGuide">
        <span>This feature is available for patrons only (Tier 2).<br>It put all database of a track into a chart. <a class="D_Link D_LinkUnder" target="_blank" href="https://youtu.be/xwMB8BGM2JM">Youtube</a> for a demonstration</span>
      </div>
      <BaseConfigCheckBox
        v-model="chartShowDownvoted"
        style="margin-top: 17px;"
        class="Main_ChartTrackBox"
        name="chartShowDownvoted"
        label="Includes times with downvote?" />
      <button
        v-if="user && user.tier <= 2"
        :class="{ D_Button_Loading: chartLoading }"
        :disabled="chartLoading || !chartTrack"
        class="D_Button Main_SaveAllButton Main_ChartAnalyzeButton"
        @click="chartAnalyse()">Load chart</button>
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
    Highcharts
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
      chartResult: [],
      highchartsConfig: {},
      user: null,
      asMod: false,
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
    this.all_cars.map(x => {
      this.all_cars_obj[x.rid] = x;
    })
  },
  mounted() {
    let vm = this;
    this.user = this.$store.state.user;
    this.asMod = this.$store.state.asMod;

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
        vm.asMod = mutation.payload.asMod;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
        vm.asMod = false;
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
      console.log(track);
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
      this.$store.commit("START_LOGROCKET", {});

      axios.post(Vue.preUrl + "/chart", {
        track: this.chartTrack.code,
        includeDownvotes: this.chartShowDownvoted
      })
      .then(res => {
        this.chartResult = res.data;
        this.prepareChart(listOfRids);

        if (res.data.length === 0) {
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: "No times found",
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
      let xAxisArray = [];
      let objListRid = {}
      listOfRids.map(x => {
        objListRid[x.rid] = true;
      });

      // arrDados.map(x => {
      //   let alreadyItem = xAxisArray.find(y => y === Date.parse(x.date+"T00:00"));
      //   if (!alreadyItem) {
      //     xAxisArray.push(Date.parse(x.date+"T00:00"));
      //   }
      // })
      // xAxisArray.sort();
      // xAxisArray = xAxisArray.map(x => (new Date(x)).toLocaleDateString("pt-br").substr(0,5));

      arrDados.map((x, ix) => {
        // series: [
        //   {
        //     name: "A",
        //     data: [{
        //         x: 1,
        //         y: 1,
        //         name: "Point2",
        //         color: "#00FF00"
        //     }, {
        //         x: 1,
        //         y: 10,
        //         name: "Point1",
        //         color: "#FF00FF"
        //     }]
        //   }
        // ]

        let inSeries = series.find(y => y.name === x.class)
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
            name: `${x.name} (${x.tune})`,
            className: objListRid[x.rid] ? undefined : "Highcharts_HidePoint",
            custom: {
              ...x,
              ...vm.all_cars_obj[x.rid],
              photo: require('@/imgs_final/' + decodeURI(x.rid) + '.jpg'),
              color: Vue.resolveClass(x.rq, x.class, "color")
            }
        })
      })

      this.highchartsConfig = {
        chart: {
          type: "scatter",
        },
        legend: {
          enabled: false,
        },
        series,
        yAxis: {
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
        }
      }

    },
    detailClick(e) {
      let url = `https://www.topdrivesrecords.com?share=~K${this.chartTrack.code}~C${e.custom.rid}~T${e.custom.tune}`
      window.open(url, '_blank').focus();
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
</style>