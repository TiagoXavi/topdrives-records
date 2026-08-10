<template>
  <div class="BaseTimeCell_Layout" :data="code">
    <div
      :data="track"
      :class="
        `${time === '!loading' ? 'BaseTimeCell_Loading ' : '' }`+
        `${count === -3 ? 'Row_ItemError ' : '' }`+
        `${count === -4 ? 'Row_ItemCorrect ' : '' }`+
        `${count === -5 ? 'Row_DetailsActive ' : '' }`+
        `${time == 0 ? 'Row_DNF ' : '' }`+
        `${false ? 'Row_ForceNormalSizeCell ' : ''}`+
        `${time === null || time === undefined || time === '' ? 'Row_ContentEmpty ' : '' }`+
        `${false ? 'Row_isTimePredicted ' : '' }` +
        `${!rid || !selectedTune ? 'Row_DisabledCell ' : '' }`+
        `${lastIndex > 0 ? 'Row_ColorHighFirst ' : '' }`+
        `${showPoints ? 'Row_HideColorBack ' : '' }`+
        `${isReferencePoints ? 'Row_HideColorBack ' : '' }`+
        `Row_ColorByIndex${highlights?.[track]}`
      "
      :style="{
        '--color-index': highlights?.[track],
        '--last-index': countPerTrack?.[track] - 1
      }"
      class="BaseTimeCell_Cell Row_ColorByIndex">
      <div v-if="!showPoints" class="BaseTimeCell_Content">{{ time | toTimeStringTrCode(track) }}</div>
      <div
        v-else-if="points && points[track] !== undefined  && points[track] !== null"
        :class="{
          Row_PointsWin: points[track].v > 0,
          Row_PointsLose: points[track].v < 0,
          Row_PointsDraw: points[track].v === 0
        }"
        class="Row_Content">
        {{ points[track].v }}
      </div>
      <div class="Row_xRA">{{ rid | cellSubNew(selectedTune, track) }}</div>
    </div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

// dump component
// not good performance to render hundreds
export default {
  name: 'BaseTimeCell',
  components: {
    // BaseDetalheHeader
  },
  props: {
    rid: {},
    selectedTune: {},
    track: {},
    count: {},
    index: {},
    code: {},
    highlights: {},
    countPerTrack: {},
    showPoints: {},
    isReferencePoints: {},
    hoverIndex: {},
    points: {},
    lastIndex: {}
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    time() {
      this.count;
      // console.log("BaseTimeCell computed time", this.rid, this.selectedTune, this.track);
      return Vue.timeCell(this.rid, this.selectedTune, this.track);
    }
  },
  methods: {},
}
</script>

<style>
/* div:first-child > .BaseTimeCell_Layout {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
} */
.BaseCarsTuneTime_Item {
  width: var(--cell-width);
  text-align: center;
}
.BaseTimeCell_Cell {
  white-space: nowrap;
  height: var(--cell-height);
  box-sizing: border-box;
  /* border: 2px #ffffff0d solid; */
  border-top-width: 0;
  border-left-width: 0;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  position: relative;
  transition-property: set;
  /* box-shadow: inset 0px -2px 0px 0px #ffffff07, inset -2px 0px 0px 0px #ffffff07, inset 0px 0px 0px 0px #ffffff07; */
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 0px -2px 0px 0px #ffffff00, -2px 0px 0px 0px #ffffff00;
  letter-spacing: 0.5px;
}
.BaseTimeCell_Content {
  text-align: center;
  width: 100%;
  padding: 6px;
  transition-duration: 0.2s;
  transition-property: background;
  outline: none;
  height: 100%;
  box-sizing: border-box;
}
.BaseTimeCell_Content:not(:focus) {
  cursor: default;
}
.BaseTimeCell_Content[contenteditable="true"]:not(:focus) {
  cursor: pointer;
}
.BaseTimeCell_Content[contenteditable="true"]:hover {
  box-shadow: inset -2px -2px 0px 0px #fff2, 0px -2px 0px 0px #fff2, -2px 0px 0px 0px #fff2;
}
.BaseTimeCell_Content:focus {
  /* background-color: #459bd100; */
  background-color: #459bd126;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 30px ) !important;
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
}
.BaseTimeCell_Content[contenteditable="true"]:hover:focus {
  box-shadow: 0px 0px 0px 3px #459bd1;
}
.BaseTimeCell_Placeholder,
.BaseTimeCell_PlaceholderTune {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  text-align: center;
  padding: 6px;
  box-sizing: border-box;
  display: none;
  color: var(--d-text);
  align-items: center;
  justify-content: center;
  white-space: pre-line;
  font-size: 15px;
  line-height: 1;
}
.BaseTimeCell_ContentEmpty .BaseTimeCell_Content:not(:focus) ~ .BaseTimeCell_Placeholder {
  display: flex;
}
.BaseTimeCell_Content:focus:empty ~ .BaseTimeCell_PlaceholderTune {
  display: flex;
  color: #aee0ff47;
}
.BaseTimeCell_ItemError {
  transition-duration: 0.1s;
  box-shadow: inset 0px -13px 16px -17px #b50000, inset 0px -5px 0px 0px #b50000;
  color: #ff9898;
  background-color: #b5000022;
}
.BaseTimeCell_ItemCorrect {
  transition-duration: 0.1s;
  box-shadow: inset 0px -13px 16px -17px #5fb500, inset 0px -5px 0px 0px #5fb500;
  color: #90df39;
  background-color: #5fb50022;
}
.BaseTimeCell_Content:empty:before {
  content: "\e961";
  font-family: 'JurisT' !important;
  color: #3f3f3f;
  line-height: 0.9;
  font-size: 24px;
}
.Row_DisabledCell .BaseTimeCell_Content:before {
  content: "";
}
.Row_xRA {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  position: absolute;
  right: 2px;
  bottom: 0px;
  width: 96%;
  text-align: right;
}
.Main_2 .BaseTimeCell_Cell {
  width: var(--cell-width);
}
.Main_2 .BaseTimeCell_Content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.Main_2 .BaseCarsTuneSelector_ChooseBox {
  width: max-content;
  height: calc(var(--cell-height) * 0.7);
}
</style>