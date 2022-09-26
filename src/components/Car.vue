<template>
  <div
    :id="`Car_Layout${index}`"
    v-if="car !== null"
    style="--drag-left: 0;--drag-top: 0;"
    class="Car_Layout">
    <BaseCard
      :car="car"
      :fix-back="true"
      :downloadLoading="downloadLoading"
      @dragdown="dragMouseDown($event)"
      @delete="$emit('delete')" />
    <div class="Car_Body">
      <Row
        :car="car"
        :list="trackList"
        :highlights="highlights"
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
    <div class="Car_DragIndicator"></div>
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
import BaseCard from '@/components/BaseCard.vue';

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
    downloadLoading: {
      type: Boolean,
      default: false
    },
    voteLoading: {
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
      elmnt.style.setProperty("--drag-left", newLeft );
      elmnt.style.setProperty("--drag-top", getComputedStyle(elmnt).getPropertyValue("--drag-top") - pos2 );
      elmnt.classList.add("Car_Dragging");
      elmnt.parentElement.classList.add("Car_DraggingParent");
      
      let width = Number(getComputedStyle(document.body).getPropertyValue("--cell-width").trim().slice(0,-2))
      // console.log(Math.floor(newLeft / width));
      // console.log(newLeft, width, Math.round(newLeft / width));
      dragNum = Math.round(newLeft / width);
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
.Car_Layout {
  width: var(--cell-width);
  
  /* margin-right: 3px; */
  transform: translate( calc(var(--drag-left) * 1px), calc(var(--drag-top) * 1px / 7) );
  position: relative;
}
.Car_Dragging {
  background-color: #242424;
  box-shadow: 0px 0px 0px 5px #505050;
  border-radius: 10px;
  transition-duration: 0.3s;
  transition-property: background-color, box-shadow, border-radius;
  z-index: 200;
  cursor: grabbing;
}
.Car_Dragging .Car_Header {
  pointer-events: none;
}
.Car_DraggingParent > :not(.Car_Dragging) {
  transition-duration: 0.3s;
}
.Car_DragIndicator {
  position: absolute;
  top: 0;
  height: 100%;
  width: 6px;
  background-color: dodgerblue;
  right: -2px;
  z-index: 21;
  display: none;
}
/* .Car_Dragging ~ .Car_Layout .Car_DragIndicator {
  display: block;
} */
.Car_PushLeft {
  transform: translateX(calc(var(--cell-width) * -1));
}
.Car_PushRight {
  transform: translateX(var(--cell-width));
}
.Car_Header {
  height: calc(var(--top-height) - 6px);
  margin: 3px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 3px;
  z-index: 20;
  font-family: 'Roboto Condensed', sans-serif;
  /* background-color: #956363; */
  color: #eee;
  background-color: #919191;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.06) 0, rgba(0, 0, 0, 0.06) 30px );
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
  /* box-shadow: inset 0px -24px 28px -20px #000f; */
  font-size: var(--card-font-size);
}
.Car_Header > * {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.Car_HeaderBlockTop {
  top: 0;
  left: 0;
  width: 100%;
  height: var(--card-top-height);
}
.Car_HeaderBlockBrand {
  top: 0;
  left: 0;
  width: var(--card-left-width);
  height: var(--card-top-height);
}
.Car_HeaderBlockYear {
  top: 0;
  right: 10%;
  width: calc(var(--card-right-width) - 10%);
  height: var(--card-top-height);
  font-size: 0.8em;
  text-align: center;
}
.Car_HeaderBlockCountry {
  top: 0;
  right: 0;
  width: 10%;
  height: var(--card-top-height);
  font-size: 1.09em;
  font-weight: bold;
  text-align: center;
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), 0.4);
}
.Car_HeaderBlockRQ {
  width: var(--card-left-width);
  height: var(--card-left-height);
  bottom: 0;
  left: 0;
  text-align: center;
  box-sizing: border-box;
  padding-top: 3%;
}
.Car_HeaderBlockClass {
  width: var(--card-left-width);
  height: 20%;
  left: 0;
  bottom: calc(var(--card-left-height) - 3%);
  text-align: center;
  font-weight: bold;
}
.Car_HeaderBlockTopSpeed {
  top: calc(var(--card-top-height) + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlock060 {
  top: calc(var(--card-top-height) + (var(--card-stat-height) + var(--card-stat-div)) * 1 + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlockHandling {
  top: calc(var(--card-top-height) + (var(--card-stat-height) + var(--card-stat-div)) * 2 + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderBlockDrive {
  top: calc(var(--card-top-height) + (var(--card-stat-height) + var(--card-stat-div)) * 3 + var(--card-stat-div));
  right: 0;
  width: var(--card-right-width);
  height: var(--card-stat-height);
}
.Car_HeaderName {
  top: 0;
  /* left: var(--card-left-width); */
  left: 4px;
  /* width: calc( 100% - var(--card-left-width) - var(--card-right-width)); */
  width: calc( 100% - var(--card-right-width) - 3px);
  height: var(--card-top-height);
  font-size: 1.1em;
  line-height: 1;
}
.Car_HeaderNameBig {
  font-size: 0.92em;
}
.Car_HeaderNameBigBig {
  font-size: 0.7em;
}
.Car_HeaderBlockTires {
  flex-direction: row;
  gap: 3px;
  bottom: 2%;
  font-size: 0.7em;
  right: calc(var(--card-right-width) + 1%);
  font-weight: 300;
  width: 50%;
  justify-content: flex-end;
  display: block;
  text-align: right;
}
.Car_HeaderBlockTires > :first-child {
  text-transform: uppercase;
}
.Car_HeaderBlockStars {
  flex-direction: row;
  gap: 6px;
  font-size: 0.6em;
  bottom: 5%;
  left: calc(var(--card-left-width) + 3.5%);
  color: var(--class-color);
  filter: drop-shadow(0px 1px 1px #000c);
}
.Row_DialogCardCard .Car_HeaderBlockStars {
  font-size: 0.8em;
}
.Car_HeaderStatValue {
  text-align: right;
  font-size: 1.3em;
  font-weight: bold;
  line-height: 1.1;
  padding-right: 4px;
  color: #fff;
  opacity: 0.95;
  letter-spacing: 0.3px;
}
.Car_HeaderStatLabel {
  text-align: right;
  font-size: 0.55em;
  line-height: 1;
  padding-right: 4px;
  font-weight: 300;
  color: #fff;
  opacity: 0.6;
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.Car_HeaderRQValue {
  font-size: 1.3em;
  line-height: 1.1;
  font-weight: bold;
}
.Car_HeaderRQLabel {
  line-height: 1;
  font-size: 0.6em;
  color: var(--class-color);
  line-height: 1.2;
  transform: scaleX(1.7) skewX(-14deg);
}
.Car_HeaderClassBack {
  background-color: var(--class-color);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: skewY(9deg);
}
.Car_HeaderClassValue {
  position: relative;
  color: black;
  font-size: 1.5em;
}
/* .Car_HeaderBlockTopSpeed,
.Car_HeaderBlock060,
.Car_HeaderBlockHandling,
.Car_HeaderBlockDrive {
  box-shadow: 0px -2px 0px hsla(0, 100%, 100%, 0.09);
} */

/* .Car_HeaderBlockTopSpeed,
.Car_HeaderBlock060,
.Car_HeaderBlockHandling,
.Car_HeaderBlockDrive, */
.Car_HeaderBlockTop,
.Car_HeaderBlockBrand,
.Car_HeaderBlockYear {
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), var(--card-stat-back-a));
  backdrop-filter: blur(15px);
}
.Car_HeaderBlockRQ {
  background-color: hsla(30, 10%, 15%, 0.7);
  backdrop-filter: blur(15px);
}
.Car_NumberStars :nth-child(3) {
  opacity: 0.2;
}
.Car_NumberStarsundefined .Car_Star {
  opacity: 0.2;
}
.Car_NumberStars111 .Car_Star:not(:nth-child(1)) {
  opacity: 0.2;
}
.Car_AddHeader {
  background-image: none;
  background-color: transparent;
  box-shadow: none;
}
.Car_HeaderTools {
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 50%;
  height: 35%;
  bottom: -35%;
  transition-duration: 0.2s;
  opacity: 0;
  z-index: 1;
}
.Car_HeaderToolsHoverContainer {
  width: 80%;
  height: 40%;
  bottom: 0;
}
.Car_HeaderToolsHoverContainer:hover ~ .Car_HeaderTools,
.Car_HeaderTools:hover {
  bottom: 0;
  opacity: 1;
}
.Car_HeaderTools:focus-within {
  transition-duration: 0.0s;
  bottom: 0;
  opacity: 1;
}
.Car_HeaderToolsBack {
  /* background-image: linear-gradient(0deg, var(--class-color), transparent); */
  box-shadow: inset 0px 0px 0px -20px var(--class-color);
  position: absolute;
  width: 100%;
  height: 40%;
  pointer-events: none;
  bottom: 0;
  transition-duration: 0.4s;
}
.Car_HeaderToolsHoverContainer:hover ~ .Car_HeaderToolsBack,
.Car_HeaderTools:hover ~ .Car_HeaderToolsBack,
.Car_Header:focus-within .Car_HeaderToolsBack {
  box-shadow: inset 0px -37px 28px -10px var(--class-color);
}
.Car_DragIcon {
  transform: rotate(45deg);
}
.Car_DragDot {
  background-color: white;
  width: 100%;
  height: 100%;
}
.D_Button.Car_HeaderButton {
  position: relative;
  --back-color: 0, 0, 0;
  --back-opac: 0.3;
  padding: 8px;
}
.D_Button.Car_HeaderDrag {
  cursor: grab;
}
.Car_HeaderIcon {
  font-size: 25px;
  color: white;
}
.Car_Loading {
  overflow: hidden;
}
.Car_Loading::after {
  content: "";
  position: absolute;
  width: 150%;
  height: 4px;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 7px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 14px
  );
  animation: Car_Loop 0.6s linear infinite;
  bottom: 0;
  left: 0;
}
@keyframes Car_Loop {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(-80px);
  }
}
.Car_Body {
  color: #bbb;
}




.Main_2 .Main_Body .Main_CarList {
  flex-direction: column;
}
.Main_2 .Main_Body .Car_Layout {
  width: unset;
  display: flex;
}
.Main_2 .Main_Body .Car_Header:not(.Car_AddHeader) {
  /* width: var(--left-width);
  font-size: 7px;
  margin: 3px 0px; */
  display: none;
}
.Car_Header2 {
  display: none;
}
.Main_2 .Main_Body .Car_Header2 {
  width: var(--left-width);
  box-shadow: inset 0px -2px 0px 0px #ffffff0d;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  line-height: 1.1;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  padding: 0 6px;
  position: sticky;
  left: 0;
  z-index: 20;
  background-size: contain;
  background-position: left;
  /* padding-left: calc(var(--cell-height) * 1.7); */
  padding-left: 0;
  height: var(--cell-height);
}
.Main_2 .Main_Body .Car_Body {
  display: flex;
  align-items: stretch;
}
.Main_2 .Main_Body .Car_AddHeader {
  display: flex;
  align-items: stretch;
  width: var(--left-width);
}
.Car_Header2 b {
  color: var(--class-color);
  font-weight: normal;
}

@media (pointer:coarse) {
  .Car_HeaderToolsHoverContainer {
    display: none;
  }
}
</style>