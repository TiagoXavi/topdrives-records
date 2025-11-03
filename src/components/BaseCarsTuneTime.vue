<template>
  <div
    :style="
      `--cell-width: ${width}px;`
    "
    class="BaseCarsTuneTime_Layout">
    <div class="BaseCarsTuneTime_Box">
      <div
        v-for="(car, icar) in cars"
        :key="icar"
        class="BaseCarsTuneTime_Item">

        <BaseCarsTuneSelector
          :car="car"
          :mini="Vue.utils.windowWidth < 1200"
          @changed="$emit('changed')"
          @cog="$emit('cog', { car, icar })"
        />

        <BaseTimeCell
          :rid="car.rid"
          :selectedTune="car.selectedTune"
          :track="tracks[icar]"
          :count="count"
        />

        <!-- <div class="BaseCarsTuneTime_">{{ car.rid }}</div>
        <div class="BaseCarsTuneTime_">{{ car.selectedTune }}</div> -->

      </div>
    </div>
  </div>
</template>

<script>
import BaseTimeCell from './BaseTimeCell.vue';
import BaseCarsTuneSelector from './BaseCarsTuneSelector.vue';
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'BaseCarsTuneTime',
  components: {
    BaseTimeCell,
    BaseCarsTuneSelector
  },
  props: {
    cars: {
      type: Array,
      default() {
        return []
      }
    },
    tracks: {
      type: Array,
      default() {
        return []
      }
    },
    width: {
      type: Number,
      default: 230
    }
  },
  data() {
    return {
      Vue: Vue,
      T_S: tdrStore(),
      count: 0
    }
  },
  watch: {
    "Vue.utils.downloadCount": function () {
      console.log("new times");
      this.count++;
      this.$emit("times");
    }
  },
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
.BaseCarsTuneTime_Box {
  display: flex;
  gap: var(--gap);
  justify-content: center;
}
</style>