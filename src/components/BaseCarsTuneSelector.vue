<template>
  <div :class="{ BaseCarsTuneSelector_LayoutDisabled: !car.rid, BaseCarsTuneSelector_Compact: mini, BaseCarsTuneSelector_Compare: compare }" class="BaseCarsTuneSelector_Layout" @mouseleave="mouseLeaveTune($event)">
    <div v-if="!car.rid" class="BaseCarsTuneSelector_Disabled Row_DisabledCell"></div>
    <div v-else-if="!miniCalc" class="BaseCarsTuneSelector_ChooseBox Row_TuneChooseBox">
      <button
        v-for="item in tunes"
        :class="{
          Row_DialogButtonTuneActive: carConfig.selectedTune === item,
          Row_DialogButtonTuneWin: false,
          Row_DialogButtonTuneLose: false
        }"
        class="D_Button Row_DialogButtonTune Row_TuneChooseButton"
        @click="setTune(item)">
        {{ item }}
        <div v-if="showPerc && car.R_Medals_scorePerc?.[item] !== undefined" class="D_ButtonNoteTune">{{ car.R_Medals_scorePerc?.[item] }}</div>
      </button>
      <button class="D_Button Row_ConfigButton" @click="cogClick($event)">
        <i class="ticon-gear Row_ConfigIcon" aria-hidden="true"/>
      </button>
    </div>
    <template v-else> 
      <div v-if="carConfig.selectedTune" class="Row_Tune">{{ carConfig.selectedTune }}</div>
      <div class="Row_ConfigBox">
        <button class="D_Button Row_ConfigButton" @click="cogClick($event)">
          <span v-if="!carConfig.selectedTune" class="Row_ConfigSelect">{{ $t('m_select') }}</span>
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
    carConfig: {},
    mini: {},
    compare: {},
    externalSetTune: {},
    showPerc: {}
  },
  data() {
    return {
      internalMini: true
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    tunes() {
      const result = ["332", "323", "233"];

      if (!Object.hasOwn(this.carConfig, 'selectedTune') && this.carConfig.tune) {
        Vue.set(this.carConfig, "selectedTune", this.carConfig.tune);
      }
      
      if (!this.carConfig.selectedTune || result.includes(this.carConfig.selectedTune)) result.push("111");
      else result.push(this.carConfig.selectedTune);
      return result;
    },
    miniCalc() {
      return (this.mini && (!this.compare)) || (this.internalMini && this.compare && this.carConfig.selectedTune);
    }
  },
  methods: {
    setTune(selectedTune) {
      if (this.externalSetTune) {
        this.$emit("changeToTune", selectedTune);
        return;
      }
      Vue.set(this.carConfig, "selectedTune", selectedTune);
      Vue.set(this.carConfig, "TCode", Vue.getTCod(this.carConfig.rid, selectedTune));
      this.internalMini = false;
      this.$emit("changed", this.carConfig);
    },
    cogClick(e) {
      if (e.ctrlKey || e.metaKey) {
        this.setTune(undefined);
      } else {
        this.$emit("cog");
      }
    },
    mouseLeaveTune(e) {
      this.internalMini = true;
    },
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
  position: relative;
  z-index: 1;
}
.BaseCarsTuneSelector_Compare {
  position: sticky;
  top: var(--top-height);
  background-color: #404040;
}
.BaseCarsTuneSelector_LayoutDisabled {
  background-color: transparent;
}
.BaseCarsTuneSelector_Disabled {
  height: 100%;
  width: 100%;
  background-position-x: -23px;
  background-size: 120% 100%;
}
.BaseCarsTuneSelector_ChooseBox {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #404040;
  height: 100%;
  width: 100%;
}
.BaseCarsTuneSelector_Compact .BaseCarsTuneSelector_ChooseBox {
  justify-content: unset;
  height: unset;
  width: unset;
}
.Main_2 .BaseCarsTuneSelector_Compare {
  position: sticky;
  left: var(--left-width);
  background-color: #404040;
  z-index: 20;
  height: var(--cell-height);
  width: calc(var(--cell-width) * 1);
}
</style>