<template>
  <div class="BaseEventTrackbox_Contents">
    <div
      v-for="(trackset, itrackset) in event.resolvedTrackset"
      :class="{ BaseEventTrackbox_LineInactive: check && check[0] != itrackset }"
      class="Cg_Box BaseEventTrackbox_BoxRelative">
      <div
        v-for="(trackMonoArray, itrackMonoArray) in trackset"
        :id="`EventTrack_${itrackset}_${itrackMonoArray}`"
        :style="{
          '--drag-left-slo': 1,
          '--drag-top-slo': 7
        }"
        class="Cg_Track EventTrack">
        <div v-if="itrackMonoArray === 0 && user && !eventForceAnalyze && !hideCheckBox" class="BaseEventTrackbox_ClassCheck">
          <BaseCheckBox
            :value="check === `${itrackset}_${itrackMonoArray}`"
            @change="$emit('openKingFilter', {itrackset, itrackMonoArray}); changeRunAnimation()"
            @click="$emit('openKingFilter', {itrackset, itrackMonoArray, e: $event }); changeRunAnimation()"/>
          <div v-if="itrackset === 0 && runAnimation" class="BaseEventTrackbox_CheckAnimation ticon-">check_box_outline_blank</div>
        </div>
        <div v-if="itrackMonoArray === 0 && user && eventForceAnalyze" class="BaseEventTrackbox_EditBox">
          <button
            class="D_Button Cg_SelectTrackButton"
            :class="{ D_ButtonRed: deleteTime && deleteTimeIndex === itrackset }"
            @click="deleteClick(itrackset)">
            <i class="ticon-close_3 BaseEventTrackbox_EditButtonIcon" aria-hidden="true"/>
          </button>
          <div class="BaseEventTrackbox_UpDownBox">
            <button
              class="D_Button Cg_SelectTrackButton"
              @click="$emit('up', {itrackset});">
              <i class="ticon-keyboard_arrow_up BaseEventTrackbox_EditButtonIcon" aria-hidden="true"/>
            </button>
            <button
              class="D_Button Cg_SelectTrackButton"
              @click="$emit('down', {itrackset});">
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
          :showCampaignTip="(!showBestPerTrack || !eventBestPerTrack[(trackMonoArray[0].code) || '']) && !disableCampaignTip && !compact"
          :showingBestPerTrack="showBestPerTrack && Object.keys(eventBestPerTrack).length > 0"
          class="Cg_TrackBox"
          type="tracks" />
        <button
          v-if="user && user.mod && !readonly"
          :disabled="eventLoadingAny"
          :class="{ Cg_SelectTrackButtonEdit: trackMonoArray && trackMonoArray.length === 1 }"
          class="D_Button Cg_SelectTrackButton"
          @click="$emit('openDialogTrackSearch', {itrackset, itrackMonoArray});">
          <i v-if="trackMonoArray && trackMonoArray.length === 1" class="ticon-pencil Cg_SelectTrackButtonIcon" aria-hidden="true"/>
          <span v-else>{{ $t("m_selectTrack") }}</span>
        </button>
        <button
          v-if="isMobile && !readonly && trackMonoArray && trackMonoArray.length === 1 && itrackMonoArray < 4"
          :disabled="eventLoadingAny"
          class="D_Button Cg_SelectTrackButton Cg_SelectTrackButtonEdit Cg_SelectTrackButtonMoveRight"
          @click="$emit('eventMoveTrackRight', {itrackset, itrackMonoArray});">
          <i class="ticon-arrow_right_3 Cg_SelectTrackButtonIcon" aria-hidden="true"/>
        </button>
        <button
          v-if="!isMobile && !readonly && trackMonoArray && trackMonoArray.length === 1"
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
      </div>
    </div>
  </div>
</template>

<script>

var pos1 = 0;
var pos2 = 0;
var mouseX = 0;
var mouseY = 0;
var elmnt = null;
var dragNum = 0;
var lastDragNum = 0;
var runAnimationRoot = true;


import Row from './Row.vue'
import BaseCheckBox from './BaseCheckBox.vue'

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
    eventBestPerTrack: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isMobile: false,
      itrackset: null,
      itrackMonoArray: null,
      deleteTime: false,
      deleteTimeIndex: 0,
      runAnimation: true
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

      elmnt = document.querySelector(`#EventTrack_${itrackset}_${itrackMonoArray}`);
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.onmouseup = this.closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = this.elementDrag;
    },
    elementDrag(e) {
      // calculate the new cursor position:
      pos1 = mouseX - e.clientX;
      pos2 = mouseY - e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      // set the element's new position:
      getComputedStyle(elmnt).getPropertyValue("--drag-left")
      getComputedStyle(elmnt).getPropertyValue("--drag-top")
      let newLeft = getComputedStyle(elmnt).getPropertyValue("--drag-left") - pos1;
      let newTop = getComputedStyle(elmnt).getPropertyValue("--drag-top") - pos2;
      elmnt.style.setProperty("--drag-left", newLeft );
      elmnt.style.setProperty("--drag-top", newTop );
      elmnt.classList.add("EventTrack_Dragging");
      elmnt.parentElement.parentElement.classList.add("EventTrack_DraggingParent");
      elmnt.parentElement.parentElement.classList.add("EventTrack_HideButtons");

      let width = Number(getComputedStyle(elmnt).getPropertyValue("--cg-width").trim().slice(0,-2))

      dragNum = Math.round(newLeft / width);
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
          if (dragNum > 0) div = document.querySelector(`#EventTrack_${this.itrackset}_${ dragNum + this.itrackMonoArray - i }`)
          else div = document.querySelector(`#EventTrack_${this.itrackset}_${ dragNum + this.itrackMonoArray + i }`)

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
      elmnt.style.setProperty("--drag-left", 0 );
      elmnt.style.setProperty("--drag-top", 0 );
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
        this.$emit("newindex", { current: this.itrackMonoArray, new: this.itrackMonoArray + dragNum, itrackset: this.itrackset });
      }
      dragNum = 0;

      document.onmouseup = null;
      document.onmousemove = null;
    },
    deleteClick(itrackset) {
      if (this.deleteTime) {
        this.deleteTime = false;
        this.$emit('delete', {itrackset});
      } else {
        this.deleteTime = true;
        this.deleteTimeIndex = itrackset;
        setTimeout(() => {
          this.deleteTime = false;
        }, 1000);
      }
    }
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
  top: 7px;
}
.BaseEventTrackbox_EditBox {
  position: absolute;
  left: -76px;
  top: 3px;
  display: flex;
}
.BaseEventTrackbox_LineInactive {
  opacity: 0.5;
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