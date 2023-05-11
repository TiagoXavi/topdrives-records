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
        <div v-if="itrackMonoArray === 0 && user" class="BaseEventTrackbox_ClassCheck">
          <BaseCheckBox
            :value="check === `${itrackset}_${itrackMonoArray}`"
            @change="$emit('openKingFilter', {itrackset, itrackMonoArray});"
            @click="$emit('openKingFilter', {itrackset, itrackMonoArray, e: $event })"/>
        </div>
        <Row
          v-if="trackMonoArray && trackMonoArray.length === 1"
          :list="trackMonoArray"
          :loggedin="!!user"
          :user="user"
          :options="user && user.mod"
          :cg="true"
          class="Cg_TrackBox"
          type="tracks" />
        <button
          v-if="user && user.mod"
          :disabled="eventLoadingAny"
          :class="{ Cg_SelectTrackButtonEdit: trackMonoArray && trackMonoArray.length === 1 }"
          class="D_Button EventTrack_AddButton Cg_SelectTrackButton"
          @click="$emit('openDialogTrackSearch', {itrackset, itrackMonoArray});">
          <i v-if="trackMonoArray && trackMonoArray.length === 1" class="ticon-pencil Cg_SelectTrackButtonIcon" aria-hidden="true"/>
          <span v-else>{{ $t("m_selectTrack") }}</span>
        </button>
        <button
          v-if="isMobile && user && user.mod && trackMonoArray && trackMonoArray.length === 1 && itrackMonoArray < 4"
          :disabled="eventLoadingAny"
          class="D_Button EventTrack_AddButton Cg_SelectTrackButton Cg_SelectTrackButtonEdit Cg_SelectTrackButtonMoveRight"
          @click="$emit('eventMoveTrackRight', {itrackset, itrackMonoArray});">
          <i class="ticon-arrow_right_3 Cg_SelectTrackButtonIcon" aria-hidden="true"/>
        </button>
        <button
          v-if="!isMobile && user && user.mod && trackMonoArray && trackMonoArray.length === 1"
          :disabled="eventLoadingAny"
          class="D_Button EventTrack_AddButton Cg_SelectTrackButton Cg_SelectTrackButtonEdit Cg_DragButtonIcon"
          @mousedown="dragMouseDown($event, itrackset, itrackMonoArray);">
          <i class="ticon-expand Cg_SelectTrackButtonIcon" style="transform: rotate(45deg);" aria-hidden="true"/>
        </button>
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
  },
  data() {
    return {
      isMobile: false,
      itrackset: null,
      itrackMonoArray: null
    }
  },
  watch: {},
  beforeMount() {
    this.isMobile = Vue.options.filters.isMobile();
  },
  mounted() {},
  computed: {},
  methods: {
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

      let width = Number(getComputedStyle(document.body).getPropertyValue("--cell-width").trim().slice(0,-2))
      let isCompact = document.querySelector(".Main_Compact");
      if (isCompact) width = Number(getComputedStyle(isCompact).getPropertyValue("--cell-width").trim().slice(0,-2))

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
  transform: translateX(calc(var(--cell-width) * -1));
}
.EventTrack_PushRight {
  transform: translateX(var(--cell-width));
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
.BaseEventTrackbox_LineInactive {
  opacity: 0.5;
}

@media only screen and (max-width: 1200px) {
  .EventTrack:first-child {
    display: flex;
    align-items: center;
  }
  .BaseEventTrackbox_ClassCheck {
    position: static;
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