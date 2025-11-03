<template>
  <div :class="{ BaseCarsTuneSelector_LayoutDisabled: !car.rid }" class="BaseCarsTuneSelector_Layout">
    <div v-if="!car.rid" class="BaseCarsTuneSelector_Disabled Row_DisabledCell"></div>
    <div v-else-if="!mini" class="BaseCarsTuneSelector_ChooseBox Row_TuneChooseBox">
      <button
        v-for="item in tunes"
        :class="{
          Row_DialogButtonTuneActive: car.selectedTune === item,
          Row_DialogButtonTuneWin: false,
          Row_DialogButtonTuneLose: false
        }"
        class="D_Button Row_DialogButtonTune Row_TuneChooseButton"
        @click="setTune(item)">
        {{ item }}
      </button>
      <button class="D_Button Row_ConfigButton" @click="$emit('cog')">
        <i class="ticon-gear Row_ConfigIcon" aria-hidden="true"/>
      </button>
    </div>
    <template v-else> 
      <div class="Row_Tune">{{ car.selectedTune }}</div>
      <div class="Row_ConfigBox">
        <button class="D_Button Row_ConfigButton" @click="$emit('cog')">
          <i class="ticon-gear Row_ConfigIcon" aria-hidden="true"/>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
// Row is imported by BaseEventTrackbox.vue

export default {
  name: 'BaseCarsTuneSelector',
  components: {
    // BaseDetalheHeader
  },
  props: {
    car: {},
    mini: {}
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    tunes() {
      const result = ["332", "323", "233"];
      if (this.car.class === "S" || this.car.class === "A") result.push("111");
      return result;
    },
  },
  methods: {
    setTune(selectedTune) {
      Vue.set(this.car, "selectedTune", selectedTune);
      this.$emit("changed");
    }
  },
}
</script>

<style>
.BaseCarsTuneSelector_Layout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--cell-height) * 1.3);
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 0px -2px 0px 0px #ffffff00, -2px 0px 0px 0px #ffffff00;
  background-color: #404040;
}
.BaseCarsTuneSelector_LayoutDisabled {
  background-color: transparent;
}
.BaseCarsTuneSelector_Disabled {
  height: 100%;
  width: 100%;
}
.BaseCarsTuneSelector_ChooseBox {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #404040;
  height: 100%;
  width: 100%;
}
</style>