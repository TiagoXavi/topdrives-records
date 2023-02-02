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
            type="text" />
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
            <div class="Main_CustomTrackName">{{ $t('t_'+circuit.id) }}</div>
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
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from './BaseDialog.vue'
import BaseTrackType from './BaseTrackType.vue'
import campaign from '../database/campaign.json'
import tracksRepo from '../database/tracks_repo.json'

export default {
  name: 'BaseSearchTrackDialog',
  components: {
    BaseDialog,
    BaseTrackType
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
        }
        if ( typesInput.includes("gravel") ) {
          Surfaces.push("2");
          Surfaces.push("b");
        }
        if ( typesInput.includes("ice") ) {
          Surfaces.push("3");
        }
        if ( typesInput.includes("sand") ) {
          Surfaces.push("5");
          Surfaces.push("c");
        }
        if ( typesInput.includes("snow") ) {
          Surfaces.push("6");
          Surfaces.push("d");
        }
        if ( typesInput.includes("grass") ) {
          Surfaces.push("7");
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
      
      return filteredTracks;
    }
  },
  methods: {
    resolveTrack(track) {
      let tracksClear = [];

      this.tracksRepo.find(circuit => {
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
          if (!bestOption || y.irace < bestOption.irace || (y.irace <= bestOption.irace && y.icity > bestOption.icity) ) {
            bestOption = y;
          }
        })
        if (bestOption) {
          x.campaign = `${bestOption.city} ${bestOption.imatch+1}`
        } else {
          x.campaign = `Not in campaign`;
        }
      })

      this.$emit('resolved', tracksClear[0]);

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
</style>