<template>
  <div
    :class="{
      Main_Compact: Vue.utils.windowWidth < 1200
    }"
    class="MainMatchSimulator_Layout">
    <div class="MainMatchSimulator_Mid">
      <div class="MainMatchSimulator_Oppos">
        <BaseCarsTeam
          :cars="_match.cars"
          :filterToImport="_match.filter"
          :big="150"
          :mini="Vue.utils.windowWidth < 1200"
        />
        <div>{{ Vue.utils }}</div>
        <div>{{ _match.cars }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCarsTeam from "./BaseCarsTeam.vue";
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'MainMatchSimulator',
  components: {
    BaseCarsTeam
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
      T_S: tdrStore()
    }
  },
  watch: {},
  created() {
    if (!this.T_S._match) {
      this.T_S.$patch((state) => {
        state._match = {
          cars: [{}, {}, {}, {}, {}],
          filter: {}
        }
      })
    }
  },
  beforeMount() {},
  mounted() {
  },
  computed: {
    ...mapState(tdrStore, ['_match'])
  },
  methods: {},
}
</script>

<style>
</style>