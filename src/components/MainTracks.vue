<template>
  <div class="MainTracks_Layout">

    <div class="MainTracks_Header">
      <div class="MainTracks_MainButton">
        <button
          :disabled="sortedTrackIds.length < 2"
          class="D_Button Row_DialogButtonTune Row_DialogButtonTuneBorderRadius"
          @click="stepTrack(-1)">
          <i class="ticon-arrow_left_3" aria-hidden="true"/>
        </button>
        <button
          class="D_Button MainTracks_TrackButton"
          @click="openDialogTrackSearch()">
          <span>{{ selectedTrack ? ($t(`t_${(selectedTrack.id || '').replace("Z50","")}`).replace(" (R)","")) : $t("m_selectTrack") }}</span>
          <i v-if="selectedTrack?.id && $t(`t_${(selectedTrack.id || '').replace('Z50','')}`).includes(' (R)')" aria-hidden="true" class="tdicon-roll" style="font-size: 1.2em; margin-left: 0.2em; line-height: 0.7;" >
            <span class="path1"/>
            <span class="path2"/>
            <span class="path3"/>
            <span class="path4"/>
          </i>
          <!-- <i class="ticon-keyboard_arrow_down" style="vertical-align: middle;" aria-hidden="true"/> -->
        </button>
        <button
          :disabled="sortedTrackIds.length < 2"
          class="D_Button Row_DialogButtonTune Row_DialogButtonTuneBorderRadius"
          @click="stepTrack(1)">
          <i class="ticon-arrow_right_3" aria-hidden="true"/>
        </button>

      </div>

      <div class="MainTracks_Types Main_FilterChipsFlex BaseTrackType_SelfActive" @click="clickhandle">
        <template v-for="type in trackTypes">
          <BaseTrackType
            :trackType="type"
            :dataid="selectedTrack.id"
            :circuit="{ [selectedType]: true }"
            class="" />
          <!-- <BaseChip
            v-model="selectedType"
            :key="type"
            :value="type"
            required="true"
            class="BaseChip_Small BaseChip_MinWidth BaseChip_DontCrop MainTracks_TypeChip">
          </BaseChip> -->
        </template>
      </div>
    </div>

    <div v-if="selectedTrack" class="MainTracks_Body">

      <TrackViewer
        :trackCode="currentCode"
        :surfaceColors="surfaceColors"
        :height="`${Math.min(600, Vue.utils.wBody)}px`"
        class="MainTracks_Viewer"
        @startingMph="startingSpeedMPH = $event"
        @trackLength="trackLength = $event"
      />

      <div class="MainTracks_Columns">
        <div class="MainTracks_Column">
          <div class="MainTracks_ColumnTitle Main_DialogTitle">{{ $t("m_fastestTimes") }}</div>
          <BaseContentLoader
            v-if="topTimesLoading"
            :contents="true"
            :itemWidth="'150px'"
            :itemHeight="32"
            style="padding-bottom: 10px;"
            type="block"
            count="5"
          />
          <div v-else-if="topTimes.length > 0" class="Cg_YouBank MainTracks_Bank">
            <div class="Cg_YouBankBox">
              <button
                v-for="(car, icar) in topTimes"
                :key="`t${car.rid}${car.tune}${icar}`"
                :style="`--cor: ${Vue.all_carsObj[car.rid].color}`"
                class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton Cg_BankButtonTuneFloatAlways"
                @click="openCarFullDetail(car)">
                <BaseCardMini :car="Vue.all_carsObj[car.rid]" :tuneText="car.tune" style="pointer-events: none;" />
                <!-- <div class="Cg_BankTuneNew">{{ car.tune }}</div> -->
                <div class="Cg_BankResult Event_BankTime">
                  <span>{{ car.time | toTimeString }}</span>
                </div>
              </button>
            </div>
          </div>
          <div v-else class="MainTracks_Empty">{{ $t("m_noData") }}</div>
        </div>

        
        <div class="MainTracks_Column">
          <div class="MainTracks_ColumnTitle Main_DialogTitle">{{ $t("m_rqSavers") }}</div>
          <BaseContentLoader
            v-if="topTimesLoading"
            :contents="true"
            :itemWidth="'150px'"
            :itemHeight="32"
            style="padding-bottom: 10px;"
            type="block"
            count="5"
          />
          <div v-else-if="topSavers.length > 0" class="Cg_YouBank MainTracks_Bank Main_IsRqSavers">
            <div class="Cg_YouBankBox">
              <button
                v-for="(car, icar) in topSavers"
                :key="`s${car.rid}${car.tune}${icar}`"
                :style="`--cor: ${Vue.all_carsObj[car.rid].color}`"
                class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton Cg_BankButtonTuneFloatAlways"
                @click="openCarFullDetail(car)">
                <BaseCardMini :car="Vue.all_carsObj[car.rid]" :tuneText="car.tune" style="pointer-events: none;" />
                <!-- <div class="Cg_BankTuneNew">{{ car.tune }}</div> -->
                <div class="Cg_BankResult Event_BankTime">
                  <span>{{ car.time | toTimeString }}</span>
                </div>
              </button>
            </div>
          </div>
          <div v-else class="MainTracks_Empty">{{ $t("m_noData") }}</div>
        </div>
      </div>

      <div class="MainTracks_Infos">
        <div v-if="trackLength" class="MainTracks_Info">
          <div class="MainTracks_InfoLabel">{{ $t("m_length") }}</div>
          <div class="MainTracks_InfoValue">{{ +(trackLength / 1609.34).toFixed(2) }} mi / {{ trackLength || 0 }} m</div>
        </div>
        <div v-if="trackFactor" class="MainTracks_Info">
          <div class="MainTracks_InfoLabel">{{ $t("m_pointsMultiplier") }}</div>
          <div class="MainTracks_InfoValue">{{ trackFactor }}</div>
        </div>
        <div v-if="bumpPenalty" class="MainTracks_Info">
          <div class="MainTracks_InfoLabel">{{ $t("m_bumpPenalty") }}</div>
          <div class="MainTracks_InfoValue MainTracks_InfoBump">{{ bumpPenalty }}</div>
        </div>
        <div class="MainTracks_Info">
          <div class="MainTracks_InfoLabel">{{ $t("m_startingSpeed") }}</div>
          <div class="MainTracks_InfoValue MainTracks_InfoValueRoll">
            <i v-if="startingSpeedMPH" aria-hidden="true" class="tdicon-roll MainTracks_RollIcon" >
              <span class="path1"/>
              <span class="path2"/>
              <span class="path3"/>
              <span class="path4"/>
            </i>
            <span>{{ startingSpeedMPH }} mph</span>
          </div>
        </div>
      </div>

      <div v-if="campaignList.length > 0" class="MainTracks_Campaign">
        <div class="MainTracks_ColumnTitle Main_DialogTitle">{{ $t("m_campaign") }}</div>
        <div class="MainTracks_CampaignBox">
          <div v-for="(item, iitem) in campaignList" :key="iitem" class="MainTracks_CampaignItem">
            <span>{{ item.label }}</span>
            <div v-if="item.i" class="Row_Campaign_Balls" :class="`Row_Campaign_Balls${item.i}`">
              <div v-for="n in 5"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import BaseChip from './BaseChip.vue'
import BaseCardMini from './BaseCardMini.vue'
import BaseTrackType from './BaseTrackType.vue'
import TrackViewer from './TrackViewer.vue'
import BaseContentLoader from './BaseContentLoader.vue'

import tracksRepo from '../database/tracks_repo.json'
import tracks_detail from '../database/tracks_detail.json'
import tracks_factor from '../database/tracks_factor.json'
import campaign from '../database/campaign.json'
import { tdrStore } from '@/tdrStore.js';

/*
 * Surface code -> the --color-* token App.vue already uses for it, so the 3D road is
 * painted in the same language as the Type_ classes everywhere else. The codes and their
 * order come from tracks_detail.json, which lists one per section of the track's spline.
 * 80 is a river crossing; the palette has no water token, so it borrows the wet blue.
 */
const SURFACE_COLORS = {
  "00": "dry",
  "01": "wet",
  "10": "dirt",
  "11": "dirt",
  "20": "gravel",
  "30": "ice",
  "50": "sand",
  "60": "snow",
  "70": "grass",
  "80": "wet"
};

export default {
  name: 'MainTracks',
  components: {
    BaseChip,
    BaseCardMini,
    BaseTrackType,
    TrackViewer,
    BaseContentLoader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      T_S: tdrStore(),
      tracksRepo,
      tracks_factor,
      campaign,
      selectedTrack: null,
      selectedType: null,
      readStorage: false,
      startingSpeedMPH: 0,
      trackLength: 0,
      topTimes: [],
      topSavers: [],
      topTimesLoading: false,
    }
  },
  watch: {
    "selectedTrack": function() {
      this.loadTops();
      this.saveLocalStorage();
    }
  },
  beforeMount() {},
  mounted() {
    this.loadLocalStorage();
    window.localStorage.setItem("tracksTab", "t");
  },
  computed: {
    /*
     * Prev / Next walk the tracks in the same order the search dialog lists them: by
     * translated name, so it follows whatever language the user is reading. A computed
     * rather than a one-off list on init, so switching language reorders it too.
     */
    sortedTrackIds() {
      return this.tracksRepo
        .map(track => ({ id: track.id, nameCalc: this.$t(`t_${track.id.replace("Z50", "")}`) }))
        .sort((a, b) => a.nameCalc.localeCompare(b.nameCalc))
        .map(track => track.id);
    },
    currentTrackIndex() {
      if (!this.selectedTrack) return -1;
      return this.sortedTrackIds.indexOf(this.selectedTrack.id);
    },
    // the surface chip is part of the selection, so the code has to follow it rather
    // than stay on whatever variation the search dialog handed over
    currentCode() {
      if (!this.selectedTrack || !this.selectedType) return '';
      return `${this.selectedTrack.id}_a${this.selectedType}`;
    },
    repoTrack() {
      if (!this.selectedTrack) return null;
      return this.tracksRepo.find(x => x.id === this.selectedTrack.id) || null;
    },
    trackTypes() {
      return this.repoTrack ? this.repoTrack.types : [];
    },
    trackFactor() {
      if (!this.selectedTrack) return null;
      return this.tracks_factor[this.selectedTrack.id];
    },
    bumpPenalty() {
      if (!this.selectedTrack) return null;
      let id = this.selectedTrack.id;
      if (Vue.bumpTracksHigh[id]) return `${this.$t('c_low')}, ${this.$t('c_mid')}`;
      if (Vue.bumpTracks[id]) return this.$t('c_low');
      return null;
    },
    /*
     * One colour per section of the spline, in the order the track runs them. A plain
     * asphalt road passes nothing and keeps the renderer's own white.
     */
    surfaceColors() {
      let detail = tracks_detail[this.currentCode];
      let surfaces = detail && detail[1];
      if (!surfaces || surfaces.length === 0) return null;
      if (surfaces.length === 1 && surfaces[0] === "00") return null;
      return surfaces.map(code => this.surfaceColor(SURFACE_COLORS[code] || "dry"));
    },
    campaignList() {
      if (!this.selectedTrack) return [];
      let options = [];
      this.campaign.map(city => {
        city.matches.map((match, imatch) => {
          match.trackset.map((track, itrack) => {
            if (track !== this.currentCode) return;
            options.push({ label: `${city.name} ${imatch + 1}`, i: itrack });
          })
        })
      })
      return options;
    }
  },
  methods: {
    openDialogTrackSearch() {
      this.T_S._g_track.dialog = true;
      this.T_S._g_track.mode = "other";
      this.T_S._g_track.close = this.closeDialogTrackSearch;
      this.T_S._g_track.toggleTrack = this.loadTrack;
    },
    closeDialogTrackSearch() {
      this.T_S._g_track.dialog = false;
    },
    loadTrack({ track }) {
      this.closeDialogTrackSearch();
      this.selectTrackByCode(track);
      this.saveLocalStorage();
    },
    stepTrack(offset) {
      let ids = this.sortedTrackIds;
      if (ids.length === 0) return;
      let index = this.currentTrackIndex;
      // nothing picked yet: Next opens the first track, Prev the last
      if (index === -1) index = offset > 0 ? -1 : 0;
      this.selectTrackById(ids[(index + offset + ids.length) % ids.length]);
      this.saveLocalStorage();
    },
    selectTrackById(id) {
      let track = this.tracksRepo.find(x => x.id === id);
      if (!track || !track.types || track.types.length === 0) return;
      // stay on the same surface while browsing when the next track also has it
      let type = track.types.includes(this.selectedType) ? this.selectedType : track.types[0];
      this.selectTrackByCode(`${id}_a${type}`);
    },
    selectTrackByCode(code) {
      let resolved = Vue.resolveTrack({ track: code }, false, false);
      if (!resolved || resolved.length === 0) return;
      this.selectedTrack = resolved[0];
      this.selectedType = `${resolved[0].surface}${resolved[0].cond}`;
    },
    saveLocalStorage() {
      if (!this.readStorage) return;
      window.localStorage.setItem('_tracksSelected', JSON.stringify({
        code: this.currentCode
      }));
    },
    loadLocalStorage() {
      if (this.readStorage) return;
      let stored = window.localStorage.getItem("_tracksSelected");
      if (stored) {
        try {
          stored = JSON.parse(stored);
          if (stored && stored.code) {
            this.selectTrackByCode(stored.code);
          }
        } catch (error) {
          console.log("Error parsing _tracksSelected from localStorage:", error);
        }
      }
      this.readStorage = true;
    },
    surfaceColor(surface) {
      let triplet = getComputedStyle(document.body).getPropertyValue(`--color-${surface}`).trim();
      if (!triplet) return null;
      return `rgb(${triplet})`;
    },
    loadTops() {
      this.topTimesLoading = true;

      axios.post(Vue.preUrl + "/trackKings", {
        track: this.selectedTrack.code
      })
      .then(res => {

        res.data.kings.map(car => {
          Vue.loadTimesFromKing(car, this.selectedTrack.code);
        })
        res.data.savers.map(car => {
          Vue.loadTimesFromKing(car, this.selectedTrack.code);
        })

        this.topTimes = res.data.kings;
        this.topSavers = res.data.savers;

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
        this.topTimesLoading = false;
      });

    },
    openCarFullDetail(car) {
      this.T_S._g_cFull.car = Vue.all_carsObj[car.rid];
      this.T_S._g_cFull.dialog = true;
      this.T_S._g_cFull.close = () => {
        this.T_S._g_cFull.dialog = false;
      };
    },
    clickhandle(e) {
      if (
        e.target &&
        typeof e.target.className === "string" &&
        e.target.className.startsWith("BaseTrackType_Button") &&
        e.target.attributes.dataid
      ) {
        let type = e.target.attributes.getNamedItem("datatype").value;
        let track = e.target.attributes.getNamedItem("dataid").value;

        this.selectTrackByCode(`${track}_a${type}`);
      }
    },
  },
}
</script>

<style>
.MainTracks_Layout {
  max-width: 900px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 20px 15px 120px 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.MainTracks_Header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.D_Button.MainTracks_TrackButton {
  font-size: 1.2em;
  padding: 14px 18px 14px 20px;
  max-width: 100%;
  min-width: 250px;
}
.MainTracks_Types {
  max-width: 520px;
  width: 100%;
}
.MainTracks_TypeChip.BaseChip {
  background-color: rgba(var(--back-color), 0.12);
}
.MainTracks_Body {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.MainTracks_Columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.MainTracks_Column {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0,0,0,.1);
  border-radius: 10px;
  padding: 15px 10px;
}
.MainTracks_ColumnTitle {
  margin-bottom: 10px;
}
.MainTracks_Empty {
  opacity: 0.5;
  font-size: 0.9em;
  padding: 20px 0;
}
.MainTracks_Infos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 30px;
}
.MainTracks_InfoLabel {
  font-size: 0.8em;
  color: var(--d-text);
  opacity: 0.6;
  text-align: center;
}
.MainTracks_InfoValue {
  text-align: center;
  color: var(--d-text-b);
}
.MainTracks_InfoBump {
  color: rgb(var(--d-text-red2));
}
.MainTracks_Campaign {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.MainTracks_CampaignBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  flex-direction: column;
  align-items: center;
}
.MainTracks_CampaignItem {
  /* font-size: 0.85em; */
  /* background-color: rgba(0,0,0,.2); */
  border-radius: 5px;
  padding: 3px 8px;
  position: relative;
}
.MainTracks_InfoValueRoll {
  display: flex;
  align-items: center;
  gap: 0.25em;
  justify-content: center;
}
.MainTracks_RollIcon {
  font-size: 1.5em;
  height: 0;
  line-height: 0;
}
.MainTracks_Types .BaseTrackType_Item {
  padding: 5px 10px;
  --typeW: -28px;
}
.MainTracks_Types .BaseTrackType_Item.Type_B1 {
  --typeW: 28px;
}
.MainTracks_Column .Event_BankTime {
  margin-right: 0;
  margin-left: 10px;
}

/* @media only screen and (max-width: 767px) {
  .MainTracks_Columns {
    grid-template-columns: 1fr;
  }
  .D_Button.MainTracks_TrackButton {
    font-size: 17px;
  }
} */
</style>
