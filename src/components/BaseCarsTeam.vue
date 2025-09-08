<template>
  <div class="BaseCarsTeam_Layout">
    <div class="BaseCarsTeam_Box">
      <div
        v-for="(car, icar) in cars"
        class="BaseCarsTeam_TeamsCanEnterEventCar">
        <div v-if="car && car.rid" class="BaseCarsTeam_TeamsCarEnterCarSelected BaseCard_AsGalleryBox">
          <BaseCard
            :car="Vue.all_carsObj[car.rid]"
            :fix-back="false"
            :options="true"
            :hideClose="false"
            :showResetTune="false"
            :asGallery="true"
            :draggable="false"
            @delete="carPickerClearIndex(icar)"
          />
          <!-- <BaseCardGallery
            :car="Vue.all_carsObj[car.rid]"
            :options="true"
            :class="mini ? 'BaseCardGallery115' : 'BaseCardGallery150'"
            class="BaseCarsTeam_TeamsCarPickGalleryCard" />
          <button
            class="D_Button BaseCarsTeam_TeamsCarEnterCarDelete"
            @click="carPickerClearIndex(icar)">
            <i aria-hidden="true" class="ticon-close_3" />
          </button> -->
        </div>
        <div v-else class="BaseCarsTeam_TeamsCarEnterCarEmpty">
          <button
            :class="mini ? 'BaseCarsTeam_TeamsAddCarButton115' : 'BaseCarsTeam_TeamsAddCarButton150'"
            class="D_Button D_ButtonDark"
            @click="carPickerForNewEvent(icar)">
            <i aria-hidden="true" class="ticon-plus_2" />
          </button>
        </div>
      </div>
    </div>
    

    <BaseFilterDialog
      v-if="genericCarPickerDialogLoad"
      v-model="genericCarPickerDialog"
      :raceFilter="genericCarPickerFilter"
      :sortEnabled="true"
      :enableCounters="true"
      type="carPicker"
      @addCar="canEnterAfterPick($event)"
    />
  </div>
</template>

<script>
import BaseCard from './BaseCard.vue';
import BaseCardGallery from './BaseCardGallery.vue';
import BaseFilterDialog from './BaseFilterDialog.vue';

export default {
  name: 'BaseCarsTeam',
  components: {
    BaseCard,
    BaseFilterDialog,
    BaseCardGallery
  },
  props: {
    cars: {
      type: Array,
      default() {
        return []
      }
    },
    filterToImport: {
      type: Object,
      default() {
        return {}
      }
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      genericCarPickerDialog: false,
      genericCarPickerDialogLoad: false,
      genericCarPickerFilter: {},
      genericCarPickerFilterString: null,
      genericCarPickerIndex: null
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    carPickerClearIndex(icar) {
      Vue.set(this.cars, icar, {});
    },
    carPickerForNewEvent(index) {
      // this.cgRaceSelected = irace;
      // this.cgAddingOppoCar = true;
      // this.cgAddingYouCar = false;

      // this.cgFilterDialogLoad = true;
      // this.$nextTick().then(() => {
      //   this.cgFilterDialog = true;
      // })

      

      this.genericCarPickerDialogLoad = true;
      this.genericCarPickerIndex = index;
      this.genericCarPickerFilter = JSON.parse(JSON.stringify(this.filterToImport));
      this.$nextTick().then(() => {
        this.genericCarPickerDialog = true;
      })
    },
    canEnterAfterPick(car) {
      let newCar = JSON.parse(JSON.stringify(car));
      console.log(newCar);

      Vue.set(this.cars, this.genericCarPickerIndex, newCar);
      // this.cars[this.genericCarPickerIndex] = newCar;
      this.genericCarPickerDialog = false;
    },
  },
}
</script>

<style>

.BaseCarsTeam_Box {
  display: flex;
  gap: 5px;
  justify-content: center;
}
.BaseCarsTeam_TeamsCarEnterCarSelected {
  position: relative;
}
.BaseCarsTeam_TeamsCarEnterCarDelete {
  position: absolute;
  bottom: 0;
  opacity: 0;
  left: 50%;
  transform: translateX(-50%) !important;
  z-index: 20;
  --back-color: 195, 0, 0;
  --back-opac: 0.5;
  --back-opac-foc: 0.3;
  background-color: rgba(var(--back-color), 0.3);
}
.BaseCarsTeam_TeamsCarEnterCarSelected:hover .BaseCarsTeam_TeamsCarEnterCarDelete,
.BaseCarsTeam_TeamsCarEnterCarSelected:focus-within .BaseCarsTeam_TeamsCarEnterCarDelete {
  opacity: 1;
}
.BaseCarsTeam_TeamsCarEnterCarEmpty {
  position: relative;
}
.BaseCarsTeam_TeamsAddCarButton150 {
  width: 150px;
  height: 93px;
}
.BaseCarsTeam_TeamsAddCarButton115 {
  width: 115px;
  height: 144px;
}
</style>