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

var initX = 0;
var initY = 0;
var posX = 0;
var posY = 0;
var elmnt = null;
var dragNum = 0;
var lastDragNum = 0;
var width = 0;
var height = 0;
var skip = false;


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
      elmnt.classList.add("Car_Dragging");
      elmnt.parentElement.classList.add("Car_DraggingParent");
      
      width = Number(getComputedStyle(document.body).getPropertyValue("--cell-width").trim().slice(0,-2))
      if (this.compact) width = Number(getComputedStyle(document.querySelector(".Main_Compact")).getPropertyValue("--cell-width").trim().slice(0,-2))
      if (this.invertedView) height = Number(getComputedStyle(document.querySelector(".Main_2")).getPropertyValue("--cell-height").trim().slice(0,-2))

      dragNum = Math.round(posX / width);
      if (this.invertedView) dragNum = Math.round(posY / height);
      let times = Math.abs(dragNum);
      let cla = dragNum > 0 ? "Car_PushLeft" : "Car_PushRight";
      let div;
      let total = document.querySelectorAll(".Car_Layout").length - 1;
      if (this.index + dragNum > total - 1) {
        console.log("incor", dragNum, "correct", total - this.index - 1);
        dragNum = total - this.index - 1
      }
      if (this.index + dragNum < 0) {
        dragNum = this.index * -1
      }

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
      // elmnt.style[0] = (elmnt.offsetLeft - posX);
      // elmnt.style[1] = (elmnt.offsetTop - posY);
    },
    closeDragElement() {
      // stop moving when mouse button is released:
      
      
      elmnt.classList.remove("Car_Dragging");
      elmnt.parentElement.classList.remove("Car_DraggingParent");
      lastDragNum = 0;

      document.querySelectorAll(".Car_Layout").forEach(x => {
        x.classList.remove("Car_PushLeft");
        x.classList.remove("Car_PushRight");
      })

      if (dragNum !== 0) {
        let indexDiff = (this.index + dragNum) - this.index;
        console.log(indexDiff)
        let pos = {
          dragLeft: Number(elmnt.style.getPropertyValue("--drag-left")),
          dragTop: Number(elmnt.style.getPropertyValue("--drag-top"))
        }
        if (this.invertedView) {
          pos.dragTop = pos.dragTop + (height * indexDiff * -1)
        } else {
          pos.dragLeft = pos.dragLeft + (width * indexDiff * -1)
        }
        this.$emit("newindex", { current: this.index, new: this.index + dragNum, pos });
      }
      elmnt.style.setProperty("--drag-left", 0 );
      elmnt.style.setProperty("--drag-top", 0 );
      dragNum = 0;

      initX = 0;
      initY = 0;
      document.onmouseup = null;
      document.onmousemove = null;
    },
    moveCar(obj) {
      let dragN = obj.direction === "left" ? -1 : 1;
      let newIndex = obj.carIndex + dragN;
      let indexDiff = (this.index + dragN) - this.index;
      let pos = { dragLeft: 0, dragTop: 0 };

      if (this.invertedView) {
        pos.dragTop = pos.dragTop + (height * indexDiff * -1)
      } else {
        pos.dragLeft = pos.dragLeft + (width * indexDiff * -1)
      }
      console.log(pos)
      
      this.$emit("newindex", { current: obj.carIndex, new: newIndex, pos });
    }
  },
}
</script>

<style>
</style>