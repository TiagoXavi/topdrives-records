<template>
  <Row
    :list="resolvedTracks"
    :loggedin="false"
    :user="{}"
    :options="false"
    :cg="true"
    :class="{ BaseTrack_First: isFirst }"
    :showCampaignTip="false"
    class="BaseTrack_Row"
    type="tracks"
  />
</template>

<script>
import Row from './Row.vue';

export default {
  name: 'BaseTrack',
  components: {
    Row
  },
  props: {
    tracks: {
      type: Array,
      default: () => []
    },
    isFirst: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    resolvedTracks() {
      let result = [];
      this.tracks.forEach(track => {
        if (track) {
          result.push(...Vue.resolveTrack({ track }, false, false));
        }
      });
      return result;
    }
  },
  methods: {},
}
</script>

<style>
.BaseTrack_Row .Type_00 {
  --type-back-opac: 0.1;
  background-color: rgba(255, 255, 255, 0.03);
}
.BaseTrack_Row {
  box-shadow: inset 2px 0px 0px 0px #ffffff07;
}
.BaseTrack_First {
  box-shadow: inset 2px 2px 0px 0px #ffffff0f;
}
</style>