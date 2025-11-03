<template>
  <div
    :class="{
      BaseEventTrackbox_Mini: mini,
      BaseEventTrackbox_MiniHeight: miniHeight,
      BaseEventTrackbox_HasPoints: showMatchPoints
    }"
    class="BaseEventTrackbox_Contents">
    <div
      v-for="(trackset, itrackset) in event.resolvedTrackset"
      :class="{
        BaseEventTrackbox_LineInactive: (check || check===0) && check != itrackset,
        BaseEventTrackbox_LineActive: (check || check===0) && check == itrackset
      }"
      :style="size ? `--cg-width: ${size}px;` : ''"
      class="Cg_Box BaseEventTrackbox_BoxRelative">
      <div
        v-for="(trackMonoArray, itrackMonoArray) in trackset"
        :id="`EventTrack_${index}_${itrackset}_${itrackMonoArray}`"
        :style="{
          '--drag-left-slo': 1,
          '--drag-top-slo': 7
        }"
        class="Cg_Track EventTrack">
        <div v-if="itrackMonoArray === 0 && user && !eventForceAnalyze && !hideCheckBox" class="BaseEventTrackbox_ClassCheck">
          <BaseCheckBox
            :value="check === itrackset"
            @click="checkBoxClick(itrackset, $event)"/>
          <div v-if="itrackset === 0 && runAnimation && animationProp" class="BaseEventTrackbox_CheckAnimation ticon-">check_box_outline_blank</div>
          <div
            v-if="showMatchPoints"
            :class="{
              Cg_PointsGreen: matchPoints[itrackset]?.total > 0,
              Cg_PointsRed: matchPoints[itrackset]?.total < 0,
              BaseEventTrackbox_PointBig: Math.abs(matchPoints[itrackset]?.total) > 99
            }"
            class="BaseEventTrackbox_CheckPoints">{{ matchPoints[itrackset]?.total }}</div>
        </div>
        <div v-if="itrackMonoArray === 0 && user && eventForceAnalyze" class="BaseEventTrackbox_EditBox">
          <!-- <button
            class="D_Button Cg_SelectTrackButton"
            :class="{ D_ButtonRed: deleteTime && deleteTimeIndex === itrackset }"
            @click="deleteClick(itrackset)">
            <i class="ticon-close_3 BaseEventTrackbox_EditButtonIcon" aria-hidden="true"/>
          </button> -->
          <div class="BaseEventTrackbox_UpDownBox">
            <button
              class="D_Button Cg_SelectTrackButton"
              @click="vertical('up', itrackset)">
              <i class="ticon-keyboard_arrow_up BaseEventTrackbox_EditButtonIcon" aria-hidden="true"/>
            </button>
            <button
              class="D_Button Cg_SelectTrackButton"
              @click="vertical('down', itrackset)">
              <i class="ticon-keyboard_arrow_down BaseEventTrackbox_EditButtonIcon" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <Row
          v-if="trackMonoArray && trackMonoArray.length === 1"
          :list="trackMonoArray"
          :loggedin="!!user"
          :user="user"
          :options="user && user.mod"
          :cg="true"
          :showCampaignTip="!showBestPerTrack && !disableCampaignTip && !compact"
          :showingBestPerTrack="(showBestPerTrack && Object.keys(eventBestPerTrack).length > 0) || showMatchPoints"
          class="Cg_TrackBox"
          type="tracks" />
        <button
          v-if="user && user.mod && !readonly && !showBestPerTrack"
          :disabled="eventLoadingAny"
          :class="{ Cg_SelectTrackButtonEdit: trackMonoArray && trackMonoArray.length === 1 }"
          class="D_Button Cg_SelectTrackButton"
          @click="selectTrack(itrackset, itrackMonoArray)">
          <i v-if="trackMonoArray && trackMonoArray.length === 1" class="ticon-pencil Cg_SelectTrackButtonIcon" aria-hidden="true"/>
          <span v-else>{{ $t("m_selectTrack") }}</span>
        </button>
        <button
          v-if="isMobile && !readonly && trackMonoArray && trackMonoArray.length === 1 && itrackMonoArray < 4 && !showBestPerTrack"
          :disabled="eventLoadingAny"
          class="D_Button Cg_SelectTrackButton Cg_SelectTrackButtonEdit Cg_SelectTrackButtonMoveRight"
          @click="moveRight(itrackset, itrackMonoArray)">
          <i class="ticon-arrow_right_3 Cg_SelectTrackButtonIcon" aria-hidden="true"/>
        </button>
        <button
          v-if="!isMobile && !readonly && trackMonoArray && trackMonoArray.length === 1 && !showBestPerTrack"
          :disabled="eventLoadingAny"
          class="D_Button Cg_SelectTrackButton Cg_SelectTrackButtonEdit Cg_DragButtonIcon"
          @mousedown="dragMouseDown($event, itrackset, itrackMonoArray);">
          <i class="ticon-expand Cg_SelectTrackButtonIcon" style="transform: rotate(45deg);" aria-hidden="true"/>
        </button>
        <div
          v-if="showBestPerTrack && Array.isArray(trackMonoArray) && trackMonoArray[0] && eventBestPerTrack[(trackMonoArray[0].code) || '']"
          :style="`--cor: ${ eventBestPerTrack[trackMonoArray[0].code].color }`"
          class="BaseEventTrackbox_BestBox">
          <div class="BaseEventTrackbox_BestPhoto">
            <img :src="eventBestPerTrack[trackMonoArray[0].code].photo" class="BaseEventTrackbox_BestImg" alt="">
            <div class="BaseEventTrackbox_BestTune" :class="`BaseEventTrackbox_BestTune${eventBestPerTrack[trackMonoArray[0].code].tune}`">{{ eventBestPerTrack[trackMonoArray[0].code].tune }}</div>
          </div>
        </div>
        <div
          v-if="showMatchPoints && matchPoints && trackMonoArray && trackMonoArray.length === 1"
          class="BaseEventTrackbox_BestBox">
          <template v-for="point in [matchPoints[itrackset]?.arr?.[itrackMonoArray]]">
            <div
              v-if="typeof point === 'number'"
              :class="{
                Cg_PointsGreen: point > 0,
                Cg_PointsRed: point < 0,
                BaseEventTrackbox_PointBig: Math.abs(point) > 99
              }"
              class="BaseEventTrackbox_Point">
              {{ point }}
            </div>
            <div v-else class="BaseEventTrackbox_Point">?</div>
          </template>
        </div>
        <div v-if="itrackMonoArray === 4 && (autoResolve || (user && eventForceAnalyze))" class="BaseEventTrackbox_EditBoxRight">
          <button
            v-if="itrackset === 0 && autoResolve"
            :disabled="event.resolvedTrackset.length > 7"
            class="D_Button Cg_SelectTrackButton"
            @click="addTrackset();">
            <i class="ticon-plus_2 BaseEventTrackbox_EditButtonIcon" aria-hidden="true"/>
          </button>
          <button
            v-else
            class="D_Button Cg_SelectTrackButton"
            :class="{ D_ButtonRed: deleteTime && deleteTimeIndex === itrackset }"
            @click="deleteTrackset(itrackset);">
            <i class="ticon-minus_2 BaseEventTrackbox_EditButtonIcon" aria-hidden="true"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

var initX = 0;
var initY = 0;
var posX = 0;
var posY = 0;
var elmnt = null;
var dragNum = 0;
var lastDragNum = 0;
var runAnimationRoot = true;
var width = 0;
var skip = false;


import Row from './Row.vue'
import BaseCheckBox from './BaseCheckBox.vue'
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'BaseEventTrackbox',
  components: {
    Row,
    BaseCheckBox
  },
  props: {
    event: {
      type: Object,
      default() {
        return {}
      }
    },
    user: {
      required: false
    },
    check: {
      required: false
    },
    eventLoadingAny: {
      type: Boolean,
      default: false
    },
    eventForceAnalyze: {
      type: Boolean,
      default: false
    },
    showBestPerTrack: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    hideCheckBox: {
      type: Boolean,
      default: false
    },
    disableCampaignTip: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    },
    mini: {
      type: Boolean,
      default: false
    },
    miniHeight: {
      type: Boolean,
      default: false
    },
    autoResolve: {
      type: Boolean,
      default: false
    },
    animationProp: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 0
    },
    eventBestPerTrack: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {},
    showMatchPoints: {
      type: Boolean,
      default: false
    },
    matchPoints: {},
  },
  data() {
    return {
      T_S: tdrStore(),
      isMobile: false,
      itrackset: null,
      itrackMonoArray: null,
      deleteTime: false,
      deleteTimeIndex: 0,
      deleteTm: null,
      runAnimation: true,
      eventTracksetSelected: null,
      eventRaceSelected: null
    }
  },
  watch: {},
  beforeMount() {
    this.isMobile = Vue.options.filters.isMobile();
  },
  mounted() {
    if (!runAnimationRoot) {
      this.runAnimation = false;
    }
  },
  computed: {},
  methods: {
    changeRunAnimation() {
      this.runAnimation = false;
      runAnimationRoot = false;
    },
    dragMouseDown(e, itrackset, itrackMonoArray) {
      this.itrackset = itrackset;
      this.itrackMonoArray = itrackMonoArray;

      elmnt = document.querySelector(`#EventTrack_${this.index}_${itrackset}_${itrackMonoArray}`);
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      initX = e.clientX;
      initY = e.clientY;
      document.onmouseup = this.closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = this.elementDrag;
    },
    elementDrag(e) {
      posX = e.clientX - initX;
      posY = e.clientY - initY;

      skip = !skip;
      if (skip) return;

      elmnt.style.setProperty("--drag-left", posX );
      elmnt.style.setProperty("--drag-top", posY );
      elmnt.classList.add("EventTrack_Dragging");
      elmnt.parentElement.parentElement.classList.add("EventTrack_DraggingParent");
      elmnt.parentElement.parentElement.classList.add("EventTrack_HideButtons");

      width = Number(getComputedStyle(elmnt).getPropertyValue("--cg-width").trim().slice(0,-2))

      dragNum = Math.round(posX / width);
      let times = Math.abs(dragNum);
      let cla = dragNum > 0 ? "EventTrack_PushLeft" : "EventTrack_PushRight";
      let div;

      if (dragNum !== lastDragNum) {
        lastDragNum = dragNum;

        document.querySelectorAll(".EventTrack").forEach(x => {
          x.classList.remove("EventTrack_PushLeft");
          x.classList.remove("EventTrack_PushRight");
        })

        Array.from(Array(times)).map((_, i) => {
          if (dragNum > 0) div = document.querySelector(`#EventTrack_${this.index}_${this.itrackset}_${ dragNum + this.itrackMonoArray - i }`)
          else div = document.querySelector(`#EventTrack_${this.index}_${this.itrackset}_${ dragNum + this.itrackMonoArray + i }`)

          if (div) {
            div.classList.add(cla);
          }
        });
      }
      // elmnt.style[0] = (elmnt.offsetLeft - pos1);
      // elmnt.style[1] = (elmnt.offsetTop - pos2);
    },
    closeDragElement() {
      // stop moving when mouse button is released:
      
      elmnt.classList.remove("EventTrack_Dragging");
      elmnt.parentElement.parentElement.classList.remove("EventTrack_DraggingParent");
      setTimeout(() => {
        elmnt.parentElement.parentElement.classList.remove("EventTrack_HideButtons");
      }, 500);
      lastDragNum = 0;

      document.querySelectorAll(".EventTrack").forEach(x => {
        x.classList.remove("EventTrack_PushLeft");
        x.classList.remove("EventTrack_PushRight");
      })

      if (dragNum !== 0) {
        let indexDiff = (this.itrackMonoArray + dragNum) - this.itrackMonoArray;
        console.log(indexDiff)
        let pos = {
          dragLeft: Number(elmnt.style.getPropertyValue("--drag-left")),
          dragTop: Number(elmnt.style.getPropertyValue("--drag-top"))
        }
        pos.dragLeft = pos.dragLeft + (width * indexDiff * -1);

        if (!this.autoResolve) {
          this.$emit("newindex", { current: this.itrackMonoArray, new: this.itrackMonoArray + dragNum, itrackset: this.itrackset });
        } else {
          this.resolveOrder({ current: this.itrackMonoArray, new: this.itrackMonoArray + dragNum, itrackset: this.itrackset });
        }
      }
      elmnt.style.setProperty("--drag-left", 0 );
      elmnt.style.setProperty("--drag-top", 0 );
      dragNum = 0;

      document.onmouseup = null;
      document.onmousemove = null;
    },
    // deleteClick(itrackset) {
    //   return;
    //   if (this.deleteTime) {
    //     this.deleteTime = false;
    //     this.$emit('delete', {itrackset});
    //   } else {
    //     this.deleteTime = true;
    //     this.deleteTimeIndex = itrackset;
    //     setTimeout(() => {
    //       this.deleteTime = false;
    //     }, 1000);
    //   }
    // },
    selectTrack(itrackset, itrackMonoArray) {
      if (!this.autoResolve) {
        return this.$emit('openDialogTrackSearch', {itrackset, itrackMonoArray});
      }

      this.T_S._g_track.dialog = true;
      this.T_S._g_track.mode = this.mode;
      this.T_S._g_track.close = () => {
        this.T_S._g_track.dialog = false;
      };
      this.T_S._g_track.toggleTrack = ({ track, e = {} }) => {
        this.event.trackset[itrackset][itrackMonoArray].track = track;
        // this.event.trackset[itrackset].splice(itrackMonoArray, 1, track);
        console.log(this.event.trackset[itrackset])
        // Vue.set(this.event.trackset[itrackset], itrackMonoArray, track);
        Vue.set(this.event.resolvedTrackset[itrackset], itrackMonoArray, Vue.resolveTrack({ track }, false, false));
        this.T_S._g_track.dialog = false;
        this.$emit("changed");
      };

      // this.eventTracksetSelected = itrackset;
      // this.eventRaceSelected = itrackMonoArray;

    },
    moveRight(itrackset, itrackMonoArray) {
      if (!this.autoResolve) {
        return this.$emit('eventMoveTrackRight', {itrackset, itrackMonoArray});
      }
      this.$emit("changed");
    },
    vertical(direction = "up", itrackset) {
      if (!this.autoResolve) {
        return this.$emit(direction, {itrackset});
      }
      this.$emit("changed");
    },
    checkBoxClick(itrackset, e) {
      if (!this.autoResolve) {
        this.$emit('openKingFilter', {itrackset, e }); 
        this.changeRunAnimation();
      }
      if (this.event.check === itrackset) {
        this.event.check = null;
      } else {
        this.event.check = itrackset;
      }
      this.$emit("changed", "trackCheckbox");
    },
    addTrackset() {
      if (!this.autoResolve) return;
      this.event.resolvedTrackset.push([null,null,null,null,null]);
      this.event.trackset.push([{ track: null }, { track: null }, { track: null }, { track: null }, { track: null }]);
      this.$emit("changed");
    },
    deleteTrackset(itrackset) {
      // clearTimeout(this.deleteTm);
      // if (!this.deleteTime) {
      //   this.deleteTime = true;
      //   this.deleteTimeIndex = itrackset;
      //   this.deleteTm = setTimeout(() => {
      //     this.deleteTime = false;
      //   }, 1000);
      //   return;
      // }
      // this.deleteTime = false;

      if (!this.autoResolve) {
        return this.$emit('delete', {itrackset});
      };
      this.event.resolvedTrackset = this.event.resolvedTrackset.filter((x, ix) => ix !== itrackset);
      this.event.trackset = this.event.trackset.filter((x, ix) => ix !== itrackset);
      this.$emit("changed");
    },
    resolveOrder(obj) {
      let trackset = this.event.resolvedTrackset[obj.itrackset];
      let trackset2 = this.event.trackset[obj.itrackset];

      // this.event.trackset[itrackset][itrackMonoArray].track = track;
      // Vue.set(this.event.resolvedTrackset[itrackset], itrackMonoArray, Vue.resolveTrack({ track }, false, false));

      while (obj.current < 0) {
        obj.current += trackset.length;
      }
      while (obj.new < 0) {
        obj.new = 0;
      }
      if (obj.new > trackset.length) {
        obj.new = trackset.length;
      }
      trackset.splice(obj.new, 0, trackset.splice(obj.current, 1)[0]);
      trackset2.splice(obj.new, 0, trackset2.splice(obj.current, 1)[0]);
      this.$emit("changed");
    },
  },
}
</script>

<style>
.BaseEventTrackbox_Contents {
  display: contents;
}
.EventTrack {
  width: var(--cg-width);
  
  /* margin-right: 3px; */
  transform: translate( calc(var(--drag-left) * 1px / var(--drag-left-slo)), calc(var(--drag-top) * 1px / var(--drag-top-slo)) );
  position: relative;
  height: min-content;
  pointer-events: auto;
}
.EventTrack_Dragging {
  background-color: #242424;
  box-shadow: 0px 0px 0px 5px #505050;
  border-radius: 10px;
  transition-duration: 0.3s;
  transition-property: background-color, box-shadow, border-radius;
  z-index: 200;
  cursor: grabbing;
}
.EventTrack_Dragging .EventTrack_Header {
  pointer-events: none;
}
.EventTrack_DraggingParent .EventTrack:not(.EventTrack_Dragging) {
  transition-duration: 0.3s;
}
.EventTrack_HideButtons button {
  opacity: 0 !important;
}
.EventTrack_PushLeft {
  transform: translateX(calc(var(--cg-width) * -1));
}
.EventTrack_PushRight {
  transform: translateX(var(--cg-width));
}
.EventTrack .Type_00 {
  --type-back-opac: 0.1;
  background-color: rgba(255,255,255, 0.03);
}
.BaseEventTrackbox_BoxRelative {
  position: relative;
}
.BaseEventTrackbox_ClassCheck {
  position: absolute;
  left: -32px;
  top: 3px;
}
.BaseEventTrackbox_EditBox {
  position: absolute;
  left: -39px;
  top: 0px;
  display: flex;
}
.BaseEventTrackbox_EditBoxRight {
  position: absolute;
  right: -36px;
  top: 0px;
  display: flex;
}
.BaseEventTrackbox_LineInactive {
  opacity: 0.5;
}
.BaseEventTrackbox_LineActive {

}
.BaseEventTrackbox_UpDownBox {
  display: flex;
  flex-direction: column;
  height: 34px;
}
.BaseEventTrackbox_UpDownBox > button {
  height: 50%;
  min-height: unset;
}
.BaseEventTrackbox_CheckAnimation {
  position: absolute;
  pointer-events: none;
  width: 130%;
  height: 130%;
  overflow: hidden;
  border-radius: 8px;
  font-size: 36px;
  top: -6px;
  left: -4px;
  /* animation: KingCheckBox 7s linear 1s 4 normal both; */
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(
    135deg,
    transparent,
    transparent 26px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 50px,
    transparent 0,
    transparent 25px
  );
  animation: KingCheck 3.4s linear 1s 2 normal both;
  background-size: 300%;
}
@keyframes KingCheck {
  0% {
    /* transform: translateX(-42px); */
    background-position-x: -70px;
  }
  50% {
    /* transform: translateX(0px); */
    background-position-x: 50px;
  }
  100% {
    /* transform: translateX(0px); */
    background-position-x: 50px;
  }
}
@keyframes KingCheckBox {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  35% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

/* .BaseEventTrackbox_CheckAnimation::after {
  content: "";
  top: 0;
  left: 0;
  position: absolute;
  width: 300%;
  height: 100%;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 16px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 30px
  );
  animation: KingCheck 0.7s linear 0s infinite normal forwards;
} */

.BaseEventTrackbox_BestBox {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}
.BaseEventTrackbox_BestPhoto {
  display: flex;
  height: 38px;
  width: 57px;
  min-width: 57px;
  border-radius: 6px 0px 0px 6px;
  overflow: hidden;
  margin-right: 0px;
  background-color: #00000038;
  height: var(--cell-height);
  position: relative;
}
.BaseEventTrackbox_BestImg {
  height: 100%;
  transform: scale(1.3) translateX(4px) translateY(-1px);
}
.BaseEventTrackbox_BestTune {
  /* 323 or other */
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: var(--cor);
  color: #000;
  font-weight: 700;
  border-top-right-radius: 4px;
  padding-right: 2px;
  padding-left: 2px;
  font-size: 12px;
}
.BaseEventTrackbox_BestTune332 {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 4px;
  bottom: unset;
  top: 0;
}
.BaseEventTrackbox_BestTune233 {
  border-top-right-radius: 0px;
  border-bottom-left-radius: 4px;
  left: unset;
  right: 0;
}
.Cg_TrackBox + .Cg_DragButtonIcon {
  left: 0 !important;
}
.Cg_TrackBox + .Cg_SelectTrackButtonMoveRight {
  left: 0 !important;
}
.EventTrack:first-child .Cg_TrackBox + .Cg_DragButtonIcon {
  left: 29px !important;
}
.EventTrack:first-child .Cg_TrackBox + .Cg_SelectTrackButtonMoveRight {
  left: 29px !important;
}


.BaseEventTrackbox_Mini .Cg_Box {
  --cg-width: 115px;
}
.BaseEventTrackbox_Mini .Row_Tracks.Row_Cg .Row_Content {
  white-space: normal;
  font-size: 0.7em;
  line-height: 0.8;
}
.BaseEventTrackbox_Mini .Cg_SelectTrackButton {
  font-size: 14px;
}
.BaseEventTrackbox_MiniHeight {
  --cell-height: 25px;
}
.BaseEventTrackbox_MiniHeight .Row_Conditions {
  display: none;
}
.BaseEventTrackbox_MiniHeight .BaseIconSvg_Layout svg {
  width: 20px;
}
.BaseEventTrackbox_Point {
  color: var(--cor);
}
.BaseEventTrackbox_HasPoints .BaseCheckBox_Input {
  width: 33px;
  height: 28px;
  height: calc(var(--cell-height) - 2px);
  border: unset;
}
.BaseEventTrackbox_HasPoints .BaseCheckBox_Input:checked {
  background-color: rgba(var(--d-text-green), 0.3);
  /* border: 2px solid rgb(var(--d-text-green)); */
}
.BaseEventTrackbox_HasPoints .BaseCheckBox_Input::before {
  display: none;
}
.BaseEventTrackbox_CheckPoints {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--cor);
  pointer-events: none;
}
.BaseCheckBox_Layout:has(+ .BaseEventTrackbox_CheckPoints:not(.Cg_PointsGreen):not(.Cg_PointsRed)) {
  --d-text-green: 170, 170, 170;
}
.BaseCheckBox_Layout:has(+ .Cg_PointsRed) {
  --d-text-green: var(--d-text-red2);
}
.BaseCheckBox_Layout:has(+ .Cg_PointsGreen) {
  /* --d-text-green: var(--d-text-green); */
}
.BaseEventTrackbox_HasPoints .BaseEventTrackbox_ClassCheck {
  position: absolute;
  left: -36px;
  top: 1px;
}
.BaseEventTrackbox_HasPoints:has(.Row_TdIconPerk):has(.TdIconCond) .TdIconCondBox {
  display: none;
}




@media only screen and (max-width: 1200px) {
  .EventTrack:first-child {
    display: flex;
    align-items: center;
  }
  .BaseEventTrackbox_ClassCheck {
    position: relative;
    left: unset;
    top: unset;
  }
  .EventTrack:first-child .Cg_SelectTrackButtonEdit {
    left: 29px;
  }
  .EventTrack:first-child .Cg_DragButtonIcon,
  .EventTrack:first-child .Cg_SelectTrackButtonMoveRight {
    left: 65px;
  }
  .EventTrack:first-child .Cg_TrackBox {
    flex-grow: 1;
  }
}
</style>