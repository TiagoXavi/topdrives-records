<template>
  <div
    :id="`Car_Layout${index}`"
    :style="{
      '--drag-left-slo': invertedView ? 7 : 1,
      '--drag-top-slo': invertedView ? 1 : 7
    }"
    v-if="car !== null"
    style="--drag-left: 0;--drag-top: 0;"
    class="Car_Layout"
    @mouseenter="$emit('enter')">
    <BaseCard
      :car="car"
      :fix-back="true"
      :downloadLoading="downloadLoading"
      :needSave="needSave"
      @longTouch="$emit('longTouch')"
      @dragdown="dragMouseDown($event)"
      @delete="$emit('delete')" />
    <div class="Car_Body">
      <Row
        :car="car"
        :list="trackList"
        :highlights="highlights"
        :points="points"
        :showPoints="showPoints"
        :isReferencePoints="isReferencePoints"
        :countPerTrack="countPerTrack"
        :hoverIndex="hoverIndex"
        :carIndex="index"
        :lastIndex="lastIndex"
        :maxCarNumber="maxCarNumber"
        :loggedin="loggedin"
        :user="user"
        :voteLoading="voteLoading"
        @move="moveCar($event)"
        @moreTracks="$emit('moreTracks', $event)"
        @delete="$emit('delete')"
        type="times" />
    </div>
  </div>
  <div
    v-else
    class="Car_Layout"
    @mouseenter="$store.commit('HOVER_INDEX', -1)">
    <div class="Car_Header Car_AddHeader">
      <button class="D_Button Car_AddButton add" @click="$emit('add')">
        <i class="ticon-plus_2 Car_AddIcon" aria-hidden="true"/>
      </button>
    </div>
  </div>
</template>

<script>
import Row from './Row.vue'
import BaseCard from './BaseCard.vue';

var pos1 = 0;
var pos2 = 0;
var mouseX = 0;
var mouseY = 0;
var elmnt = null;
var dragNum = 0;
var lastDragNum = 0;


export default {
  name: 'Car',
  components: {
    Row,
    BaseCard
  },
  props: {
    car: {
      type: Object,
      default() {
        return {}
      }
    },
    trackList: {
      type: Array,
      default() {
        return []
      }
    },
    highlights: {
      type: Object,
      default() {
        return {}
      }
    },
    countPerTrack: {
      type: Object,
      default() {
        return {}
      }
    },
    hoverIndex: {
      type: Number,
      default: -1
    },
    maxCarNumber: {
      required: true
    },
    user: {
      required: false
    },
    points: {
      required: false
    },
    index: {
      required: true
    },
    lastIndex: {
      type: Number,
      default: -1
    },
    loggedin: {
      type: Boolean,
      default: false
    },
    showPoints: {
      type: Boolean,
      default: false
    },
    isReferencePoints: {
      type: Boolean,
      default: false
    },
    downloadLoading: {
      type: Boolean,
      default: false
    },
    voteLoading: {
      type: Boolean,
      default: false
    },
    needSave: {
      type: Boolean,
      default: false
    },
    invertedView: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
  },
  computed: {},
  methods: {
    // dragElement(elmnt) {
    //   if (document.getElementById(elmnt.id + "header")) {
    //     // if present, the header is where you move the DIV from:
    //     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    //   } else {
    //     // otherwise, move the DIV from anywhere inside the DIV:
    //     elmnt.onmousedown = dragMouseDown;
    //   }
    // },
    dragMouseDown(e) {
      elmnt = document.querySelector('#Car_Layout'+this.index);
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
      elmnt.classList.add("Car_Dragging");
      elmnt.parentElement.classList.add("Car_DraggingParent");
      
      let width = Number(getComputedStyle(document.body).getPropertyValue("--cell-width").trim().slice(0,-2))
      if (this.compact) width = Number(getComputedStyle(document.querySelector(".Main_Compact")).getPropertyValue("--cell-width").trim().slice(0,-2))
      let height;
      if (this.invertedView) height = Number(getComputedStyle(document.querySelector(".Main_2")).getPropertyValue("--cell-height").trim().slice(0,-2))

      dragNum = Math.round(newLeft / width);
      if (this.invertedView) dragNum = Math.round(newTop / height);
      let times = Math.abs(dragNum);
      let cla = dragNum > 0 ? "Car_PushLeft" : "Car_PushRight";
      let div;

      if (dragNum !== lastDragNum) {
        lastDragNum = dragNum;

        document.querySelectorAll(".Car_Layout").forEach(x => {
          x.classList.remove("Car_PushLeft");
          x.classList.remove("Car_PushRight");
        })

        Array.from(Array(times)).map((_, i) => {
          if (dragNum > 0) div = document.querySelector("#Car_Layout" + (dragNum + this.index - i) )
          else div = document.querySelector("#Car_Layout" + (dragNum + this.index + i) )

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
      elmnt.classList.remove("Car_Dragging");
      elmnt.parentElement.classList.remove("Car_DraggingParent");
      lastDragNum = 0;

      document.querySelectorAll(".Car_Layout").forEach(x => {
        x.classList.remove("Car_PushLeft");
        x.classList.remove("Car_PushRight");
      })

      if (dragNum !== 0) {
        this.$emit("newindex", { current: this.index, new: this.index + dragNum });
      }
      dragNum = 0;

      document.onmouseup = null;
      document.onmousemove = null;
    },
    moveCar(obj) {
      this.$emit("newindex", { current: obj.carIndex, new: obj.direction === "left" ? obj.carIndex-1 : obj.carIndex+1 });
    }
  },
}
</script>

<style>
</style>