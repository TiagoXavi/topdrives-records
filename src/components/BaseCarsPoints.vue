<template>
  <div
    :style="
      `--cell-width: ${width}px;`
    "
    class="BaseCarsPoints_Layout">
    <div class="BaseCarsPoints_Box">
      <div
        v-for="(point, i) in pointsF"
        :key="i"
        :class="{
          Cg_PointsRed: point < 0 && typeof point === 'number',
          Cg_PointsGreen: point > 0 && typeof point === 'number',
          Cg_PointsGrey: point === 0 && typeof point === 'number',
        }"
        class="Cg_Divider BaseCarsPoints_Item">
        <div v-if="typeof point === 'number'" class="Cg_DividerBackLight"></div>
        <div v-if="typeof point === 'number' || typeof point === 'string'" class="Cg_Points">{{ point }}</div>
        <div v-else class="Cg_Points"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseCarsPoints',
  components: {
    // BaseDetalheHeader
  },
  props: {
    cars: {},
    oppos: {},
    tracks: {},
    width: {},
    match: {},
    points: {},
    pointsAuto: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    pointsF() {
      if (!this.pointsAuto) return this.points;
      if (!Array.isArray(this.cars)) return [];
      this.cars[0]?.customData;

      
      return this.cars.map((_,i) => {
        if (!this.cars[i]) return null;
        if (!this.cars[i].selectedTune) return null;
        if (!this.oppos[i]) return null;
        if (!this.oppos[i].selectedTune) return null;
        if (!this.tracks[i]) return null;
        if (!this.tracks[i].track) return null;

        let pointsYou = (Vue.userPoints(
          (Vue.timeCell(this.cars[i].rid, this.cars[i].selectedTune, this.tracks[i].track) || {}).t,
          (Vue.timeCell(this.oppos[i].rid, this.oppos[i].selectedTune, this.tracks[i].track) || {}).t,
          this.tracks[i].track
        ) || {}).v

        return pointsYou;

      })
    }
  },
  methods: {},
}
</script>

<style>
.BaseCarsPoints_Box {
  display: flex;
  gap: var(--gap);
  justify-content: center;
}
.BaseCarsPoints_Item {
  width: var(--cell-width);
}
</style>