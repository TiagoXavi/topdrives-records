<template>
  <BaseDialog
    :active="active"
    :transparent="false"
    :isStatic="true"
    :forceScroll="true"
    max-width="500px"
    min-width="240px"
    @close="$emit('close')">
    <div class="Main_TracksDialog">
      <div class="Main_AllTracksBox">
        <div class="Track_SearchBox">
          <input
            v-model="searchTracks"
            id="SearchTrackInput"
            :placeholder="$t('m_searchTracks')"
            class="D_SearchInput Track_SearchInput data-hj-allow"
            type="search"
            autocomplete="off" />
          <button
            v-if="searchTracks && searchTracks.length > 0"
            class="D_Button Main_TrackSearchInputClose"
            @click="searchTracks = ''">
            <i class="ticon-close_2" aria-hidden="true"/>
          </button>
        </div>
        <div
          v-for="(circuit, index) in filteredTracks"
          class="Main_CustomTrackItem" :key="index">
          <div class="Main_CustomTrackLeft">
            <div class="Main_CustomTrackName">
              <template>{{ circuit.nameCalc | toTimeString }}</template>
              <span v-if="circuit.nameEng.includes('(R)')"><BaseIconSvg/></span>
              <span v-if="
                circuit.id === 'csSmall' ||
                circuit.id === 'dockCity' ||
                circuit.id === 'csMed' ||
                circuit.id === 'oceanCity' ||
                circuit.id === 'speedbump12km' ||
                circuit.id === 'speedbump1km' ||
                circuit.id === 'desertHill' ||
                circuit.id === 'moto' ||
                circuit.id === 'desertRallyDirt' ||
                circuit.id === 'miStreets2'
              "><BaseIconSvg type="clearance"/></span>
            </div>
          </div>
          <div class="Main_CustomTrackRight">
            <template>
              <BaseTrackType
                :circuit="circuit"
                :mode="mode"
                @toggleTrack="$emit('toggleTrack', $event); resolveTrack($event.track)" />
            </template>
          </div>
        </div>
        <div v-if="cpTrackSuggestion" class="BaseSearchTrackDialog_CpSuggest">
          <button
            class="BaseSearchTrackDialog_CpSuggestButton D_Button D_ButtonDark D_ButtonDark2 Main_SaveAllButton"
            @click="$emit(`pushCpSuggest`, { list: cpTrackSuggestion.list, e: $event})">{{ $t("m_load") }} {{ cpTrackSuggestion.name }}</button>
          <div class="BaseSearchTrackDialog_RowList">
            <Row
              style="pointer-events: none;"
              :list="cpTrackSuggestion.list"
              :showCampaignTip="false" />
          </div>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from './BaseDialog.vue'
import BaseTrackType from './BaseTrackType.vue'
import BaseIconSvg from './BaseIconSvg.vue'
import Row from './Row.vue'
import campaign from '../database/campaign.json'
import tracksRepo from '../database/tracks_repo.json'

export default {
  name: 'BaseSearchTrackDialog',
  components: {
    BaseDialog,
    BaseTrackType,
    BaseIconSvg,
    Row
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "other"
    }
  },
  data() {
    return {
      searchTracks: '',
      campaign,
      tracksRepo,
      cpTrackSuggestion: null
    }
  },
  watch: {
    active: function() {
      if (this.active) {
        this.searchTracks = '';
      }
    },
  },
  beforeMount() {},
  mounted() {},
  computed: {
    filteredTracks() {
      let vm = this;
      let filteredTracks = this.tracksRepo;
      let conds = ["dry", "wet", "dirt", "gravel", "ice", "sand", "snow", "grass"];
      let input = this.searchTracks.toLowerCase();
      let inputArray = input.split(" ");
      let typesInput = inputArray.filter(x => conds.includes(x));
      let tracksInput = inputArray.filter(x => !conds.includes(x));
      let lastWord = inputArray[inputArray.length - 1];

      this.cpTrackSuggestion = null;
      if (inputArray.length > 1 && Number(lastWord) > 0 && Number(lastWord) < 11) {
        let subWord = inputArray[inputArray.length - 2];
        let found = this.campaign.find((x, ix) => {
          if (ix > 13) {
            if (x.name.toLowerCase().includes(subWord)) {
              return true;
            }
          }
        })
        if (found) {
          let arr = [];
          found.matches[Number(lastWord) - 1].races.map(code => {
            // {"id":"gForce","surface":"0","cond":"0","code":"gForce_a00","campaign":"GER Stuttgart 4"}
            arr.push({
              surface: code.name.slice(-2,-1),
              cond: code.name.slice(-1),
              code: code.name,
              id: code.name.slice(0, -4)
            })
          })
          this.cpTrackSuggestion = {
            name: `${found.name} ${lastWord}`,
            list: arr
          }
        }
      }


      if (typesInput.length > 0) {
        let Surfaces = [];
        let Conds = [];

        if ( typesInput.includes("dry") ) {
          Surfaces.push("0");
          Conds.push("0");
        }
        if ( typesInput.includes("wet") ) {
          Conds.push("1");
        }
        if ( typesInput.includes("dirt") ) {
          Surfaces.push("1");
          Surfaces.push("4");
          Surfaces.push("h");
        }
        if ( typesInput.includes("gravel") ) {
          Surfaces.push("2");
          Surfaces.push("b");
        }
        if ( typesInput.includes("ice") ) {
          Surfaces.push("3");
          Surfaces.push("g");
        }
        if ( typesInput.includes("sand") ) {
          Surfaces.push("5");
          Surfaces.push("c");
        }
        if ( typesInput.includes("snow") ) {
          Surfaces.push("6");
          Surfaces.push("d");
          Surfaces.push("g");
          Surfaces.push("h");
        }
        if ( typesInput.includes("grass") ) {
          Surfaces.push("7");
          Surfaces.push("f");
        }

        filteredTracks = filteredTracks.filter(x => {
          return x.types.find(y => {
            if (Surfaces.length > 0 && Conds.length > 0) {
              return Surfaces.includes(y[0]) && Conds.includes(y[1]);
            } else if (Surfaces.length > 0) {
              return Surfaces.includes(y[0]);
            } else if (Conds.length > 0) {
              return Conds.includes(y[1]);
            }
          })
        });
      }
      if (tracksInput.length > 0) {
        filteredTracks = filteredTracks.filter(x => {
          return vm.$t('t_'+x.id).toLowerCase().includes(tracksInput.join(" "));
        });
      }

      filteredTracks.map(x => {
        x.nameCalc = this.$t('t_'+x.id);
        x.nameEng = this.$t('t_'+x.id, "en");
      })

      filteredTracks.sort((a,b) => {
        return a.nameCalc.localeCompare(b.nameCalc);
      })
      
      return filteredTracks;
    }
  },
  methods: {
    resolveTrack(track) {
      let tracksClear = [];

      this.tracksRepo.find(circuit => {
        if (track.slice(0,-4) !== circuit.id) return false;
        circuit.types.find(type => {
          if (track === `${circuit.id}_a${type}`) {
            tracksClear.push( { name: circuit.name, id: circuit.id, surface: type[0], cond: type[1], code: `${circuit.id}_a${type}` } );
            return true;
          }
        })
      })

      // list all options
      let currentTracksOptions = [];
      let options = [];
      this.campaign.map((city, icity) => {
        city.matches.map((match, imatch) => {
          match.races.map((rac, irace) => {
            if (rac.name === track) {
              options.push({
                city: city.name,
                icity,
                imatch,
                irace,
                code: `${icity}${imatch}`
              })
            }
          })
        })
      })
      currentTracksOptions.push(options);

      
      // delivery best option
      tracksClear.map((x, ix) => {
        let bestOption;
        currentTracksOptions[ix].map(y => {
          if (
            !bestOption ||
            this.isChamp(bestOption.city) && !this.isChamp(y.city) ||
            y.irace < bestOption.irace && !this.isChamp(y.city) ||
            this.isChamp(bestOption.city) && this.isChamp(y.city) && y.icity > bestOption.icity ||
            (y.irace <= bestOption.irace && y.icity > bestOption.icity) ||
            (y.irace <= bestOption.irace && y.imatch > bestOption.imatch)
          ) {
            bestOption = y;
          }
        })
        if (bestOption) {
          x.campaign = `${bestOption.city} ${bestOption.imatch+1}`;
          if (!this.isChamp(bestOption.city)) {
            x.campaignNum = bestOption.irace+1;
          }
        } else {
          x.campaign = `Not in campaign`;
        }
      })

      this.$emit('resolved', tracksClear[0]);

    },
    isChamp(str) {
      return str.startsWith("SN") || str.startsWith("YB");
    }
  },
}
</script>

<style>
.Track_SearchBox {
  position: relative;
  flex-grow: 10;
  padding: 0 20px;
  margin-bottom: 10px;
}
.Track_SearchInput {
  height: 55px;
  padding-left: 15px;
}
.Main_TrackSearchInputClose {
  position: absolute;
  right: 26px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1em;
}
.Main_TrackSearchInputClose.D_Button:active:not(.D_ButtonNoActive) {
  transform: translateY(-42%);
}
.BaseSearchTrackDialog_CpSuggest {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.BaseSearchTrackDialog_CpSuggestButton {
  margin-top: 10px;
  margin-bottom: 20px;
}
.BaseSearchTrackDialog_RowList {
  width: var(--left-width);
  box-shadow: -2px -2px 0px 0px #ffffff07;
}
.BaseSearchTrackDialog_RowList .Row_ConfigCell {
  display: none;
}
</style>