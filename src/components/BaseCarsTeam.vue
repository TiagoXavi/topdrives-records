<template>
  <div
    class="BaseCarsTeam_Car"
    :style="
      `--width: ${width}px;` +
      `--aspect: ${aspect};` +
      `--fsize: ${fsize}px;` +
      `--mini-width: ${miniWidth}px;` +
      `--mini-aspect: ${miniAspect};` +
      `--mini-fsize: ${miniFsize}px;` +
      `--drag-left-slo: 1;` +
      `--drag-top-slo: 7;` +
      `--widthF: ${mini ? miniWidth : width}px;` +
      `--widthFraw: ${mini ? miniWidth : width};` +
      `--aspectF: ${mini ? miniAspect : aspect};` +
      `--fsizeF: ${mini ? miniFsize : fsize}px;`
    "
    style="--gap: 5px;">
    <div
      :class="`BaseCarsTeam_Layout${prefix}`"
      class="BaseCarsTeam_Box"> <!-- BaseCarsTeam_DraggingParent ,  -->
      <div
        v-for="(car, icar) in cars"
        v-if="showDragCards"
        style="--drag-left: 0;--drag-top: 0;"
        :id="`BaseCarsTeam_Car${prefix}${icar}`"
        :class="`BaseCarsTeam_Car${prefix}`"
        class="BaseCarsTeam_Car"> <!-- BaseCarsTeam_Dragging , BaseCarsTeam_PushLeft, BaseCarsTeam_PushRight  -->
        <div
          v-if="car && car.rid"
          class="BaseCarsTeam_CarInner BaseCard_AsGalleryBox"> 
          <BaseCard
            :car="Vue.all_carsObj[car.rid]"
            :fix-back="false"
            :options="true"
            :hideClose="!canDelete"
            :showResetTune="false"
            :asGallery="true"
            :draggable="canDrag"
            :customData="car.customData"
            :selectedTune="isTunz ? (car.tun || car.tunZ) : car.selectedTune"
            :downloadLoading="Vue.utils.cacheLoading && Vue.utils.ridsDownloading.includes(car.rid)"
            :cgOppo="isTunz || showTune ? true : false"
            @cog="$emit('cog', icar)"
            @dragdown="dragMouseDown($event, icar)"
            @delete="carPickerClearIndex(icar)"
          />
          <!-- <BaseCardGallery
            :car="Vue.all_carsObj[car.rid]"
            :options="true"
            :class="mini ? 'BaseCardGallery115' : 'BaseCardGallery150'"
            class="BaseCarsTeam_PickGalleryCard" />
          <button
            class="D_Button BaseCarsTeam_EnterCarDelete"
            @click="carPickerClearIndex(icar)">
            <i aria-hidden="true" class="ticon-close_3" />
          </button> -->
        </div>
        <div v-else class="BaseCarsTeam_EnterCarEmpty BaseCarsTeam_CarInner BaseCard_AsGalleryBox">
          <button
            v-if="canAdd"
            class="D_Button D_ButtonDark BaseCarsTeam_TeamsAddCarButton add"
            @click="carPickerForNewEvent(icar)">
            <i aria-hidden="true" class="ticon-plus_2" />
          </button>
          <div v-else class="BaseCarsTeam_EnterCarEmpty BaseCarsTeam_CarInner BaseCard_AsGalleryBox">
            <div class="BaseCarsTeam_AddNotAllowed BaseCarsTeam_TeamsAddCarButton" />
          </div>
          
          <div class="BaseCarsTeam_CarEnterCarPropRQ">{{ Math.round(Math.max(0, 
            (
              rqLimit - cars.reduce((ac, b) => ac + ((Vue.all_carsObj[b.rid] || {}).rq || 0), 0)
            ) / cars.filter(x => !x.rid).length
          )) }}</div>
        </div>
        

      </div>
    </div>

    <!-- <BaseFilterDialog
      v-if="g_carPickerDialogLoad"
      v-model="g_carPickerDialog"
      :raceFilter="g_carPickerFilter"
      :sortEnabled="true"
      :enableCounters="true"
      type="carPicker"
      @addCar="canEnterAfterPick($event)"
    /> -->
  </div>
</template>

<script>
import BaseCard from './BaseCard.vue';
import BaseCardGallery from './BaseCardGallery.vue';
import BaseFilterDialog from './BaseFilterDialog.vue';
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

var initX = 0;
var initY = 0;
var posX = 0;
var posY = 0;
var gap = 0;
var elmnt = null;
var elmntOther = null;
var elIndex = 0;
var dragNum = 0;
var lastDragNum = 0;
var width = 0;
var height = 0;
var skip = false;

export default {
  name: 'BaseCarsTeam',
  components: {
    BaseCard,
    BaseFilterDialog,
    BaseCardGallery
  },
  props: {
    cars: {
      type: Array,
      default() {
        return []
      }
    },
    filterToImport: {
      type: Object,
      default() {
        return {}
      }
    },
    mini: {
      type: Boolean,
      default: false
    },
    isTunz: {
      type: Boolean,
      default: false
    },
    canAdd: {
      type: Boolean,
      default: true
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    canDrag: {
      type: Boolean,
      default: true
    },
    showTune: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 226
    },
    aspect: {
      type: String,
      default: "415 / 256"
    },
    fsize: {
      type: Number,
      default: 12
    },
    miniWidth: {
      type: Number,
      default: 111
    },
    miniAspect: {
      type: String,
      default: "111 / 144"
    },
    prefix: {
      type: String,
      default: ""
    },
    miniFsize: {
      type: Number,
      default: 12
    },
    gap: {
      type: Number,
      default: 2
    },
    rqLimit: {
      type: Number,
      default: 500
    },
    pickFunc: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      Vue: Vue,
      T_S: tdrStore(),
      index: 0,
      showDragCards: true
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    carPickerClearIndex(icar) {
      if (this.$listeners && this.$listeners.delete) {
        this.$emit("delete", icar);
        return;
      }
      Vue.set(this.cars, icar, {});
      this.$emit("changed");
    },
    carPickerForNewEvent(index) {
      if (this.pickFunc) {
        this.pickFunc(index);
        return;
      }
      this.T_S.$patch((state) => {
        state._g_carPicker.dialogLoad = true;
        state._g_carPicker.filter = JSON.parse(JSON.stringify(this.filterToImport));
        state._g_carPicker.filter2 = false;
        state._g_carPicker.filter3 = false;
        state._g_carPicker.filterOnly = false;
        state._g_carPicker.requirementFilter = false;
        state._g_carPicker.useWhatFilter = 0;
        state._g_carPicker.sortEnabled = true;
        state._g_carPicker.keepMemory = true;
        state._g_carPicker.enableCounters = true;
        state._g_carPicker.type = "carPicker";
        state._g_carPicker.index = index;
        state._g_carPicker.addCar = this.canEnterAfterPick;
        state._g_carPicker.clearFilterUpdate = () => {};
        state._g_carPicker.useFilter = () => {};
        state._g_carPicker.dual = () => {};
        state._g_carPicker.config = {};
      })
      this.$nextTick().then(() => {
        this.T_S.$patch((state) => {
          state._g_carPicker.dialog = true;
        })
      })
    },
    canEnterAfterPick(car) {
      let newCar = JSON.parse(JSON.stringify(car));
      // console.log(newCar);

      Vue.set(this.cars, this.T_S._g_carPicker.index, newCar);
      // this.cars[this.g_carPickerIndex] = newCar;
      this.T_S._g_carPicker.dialog = false;
      // this.g_carPickerDialog = false;
      this.$emit("changed");
    },




    dragMouseDown(e, index) {
      elIndex = index;
      elmnt = document.querySelector(`#BaseCarsTeam_Car${this.prefix}${elIndex}`);
      gap = this.gap;
      width = elmnt.offsetWidth + gap;
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      initX = e.clientX;
      initY = e.clientY;
      document.onmouseup = this.closeDragElement;
      document.onmousemove = this.elementDrag;
      if (e.targetTouches) {
        initX = e.targetTouches[0].clientX;
        initY = e.targetTouches[0].clientY;
      }
    },
    elementDrag(e) {
      posX = e.clientX - initX;
      posY = e.clientY - initY;
      if (e.targetTouches) {
        posX = e.targetTouches[0].clientX - initX;
        posY = e.targetTouches[0].clientY - initY;
      }

      skip = !skip;
      if (skip) return;

      let total = document.querySelectorAll(`.BaseCarsTeam_Car${this.prefix}`).length;
      let pad = 20;

      elmnt.style.setProperty("--drag-left", Math.max(elIndex*-1*width-pad, Math.min(posX, (total - elIndex - 1)*width+pad ))  );
      elmnt.style.setProperty("--drag-top", posY );
      elmnt.classList.add("BaseCarsTeam_Dragging");
      elmnt.parentElement.classList.add("BaseCarsTeam_DraggingParent");

      dragNum = Math.round(Number(posX) / width);
      let times = Math.abs(dragNum);
      let otherIndex = elIndex + dragNum;

      if (elIndex + dragNum > total - 1) {
        dragNum = total - elIndex - 1
      }
      if (elIndex + dragNum < 0) {
        dragNum = elIndex * -1
      }

      if (dragNum !== lastDragNum) {
        lastDragNum = dragNum;

        document.querySelectorAll(`.BaseCarsTeam_Car${this.prefix}`).forEach((x, ix) => {
          if (ix === elIndex) return;
          x.style.setProperty("--drag-left", 0 );
        })
        if (otherIndex !== elIndex) {
          elmntOther = document.querySelector(`#BaseCarsTeam_Car${this.prefix}${otherIndex}`);
          elmntOther.style.setProperty("--drag-left", dragNum * width * -1 );
        }
      }
    },
    closeDragElement() {

      elmnt.classList.remove("BaseCarsTeam_Dragging");
      elmnt.parentElement.classList.remove("BaseCarsTeam_DraggingParent");
      lastDragNum = 0;

      document.querySelectorAll(`.BaseCarsTeam_Car${this.prefix}`).forEach(x => {
        x.classList.remove("BaseCarsTeam_PushLeft");
        x.classList.remove("BaseCarsTeam_PushRight");
      })

      if (dragNum !== 0) {
        let indexDiff = (elIndex + dragNum) - elIndex;
        // console.log(indexDiff)
        let pos = {
          dragLeft: Number(elmnt.style.getPropertyValue("--drag-left")),
          dragTop: Number(elmnt.style.getPropertyValue("--drag-top"))
        }
        pos.dragLeft = pos.dragLeft + (width * indexDiff * -1);
        this.dragCustomNewOrder({ current: elIndex, new: elIndex + dragNum, pos });
      }
      elmnt.style.setProperty("--drag-left", 0 );
      elmnt.style.setProperty("--drag-top", 0 );
      dragNum = 0;

      initX = 0;
      initY = 0;
      document.onmouseup = null;
      document.onmousemove = null;
      elmnt.touchend = null;
      elmnt.touchmove = null;
    },
    dragCustomNewOrder(obj) {
      obj.current;
      obj.new;
      let array = this.cars;

      obj.current = Math.min(obj.current, array.length);
      obj.new = Math.max(obj.new, 0);
      obj.new = Math.min(obj.new, array.length);

      // array.splice(obj.new, 0, array.splice(obj.current, 1)[0]);
      let one = array[obj.current];
      let two = array[obj.new];

      Vue.set(this.cars, obj.current, two);
      Vue.set(this.cars, obj.new, one);

      // [ array[obj.current], array[obj.new] ] = [ array[obj.new], array[obj.current] ];

      this.$emit("changed");

      this.showDragCards = false;
      this.$nextTick().then(() => {
        this.showDragCards = true;

        if (obj.pos) {
          this.$nextTick().then(() => {
            let elmnt = document.querySelector(`#BaseCarsTeam_Car${this.prefix}`+obj.new);
            let elmntOther = document.querySelector(`#BaseCarsTeam_Car${this.prefix}`+obj.current);
            if (elmnt) {
              elmnt.style.setProperty("--drag-left", obj.pos.dragLeft );
              elmnt.style.setProperty("--drag-top", obj.pos.dragTop );
              if (obj.posOther) {
                elmntOther.style.setProperty("--drag-left", obj.posOther.dragLeft );
                elmntOther.style.setProperty("--drag-top", obj.posOther.dragTop );
              }
              setTimeout(() => {
                  elmnt.style.setProperty("--drag-left", 0 );
                  elmnt.style.setProperty("--drag-top", 0 );
                  if (obj.posOther) {
                    elmntOther.style.setProperty("--drag-left", 0 );
                    elmntOther.style.setProperty("--drag-top", 0 );
                  }
                  elmnt = null;
                  elmntOther = null;
              }, 1);
              // this.$nextTick().then(() => {
              //   elmnt.style.setProperty("--drag-left", 0 );
              //   elmnt.style.setProperty("--drag-top", 0 );
              // })
            }
          })
        }
      })
    },
  },
}
</script>

<style>

.BaseCarsTeam_Box {
  display: flex;
  gap: var(--gap);
  justify-content: center;
}
.BaseCarsTeam_Car {
  transform: translate( calc(var(--drag-left) * 1px / var(--drag-left-slo)), calc(var(--drag-top) * 1px / var(--drag-top-slo)) );
  position: relative;
  will-change: transform;
}
.BaseCarsTeam_Dragging {
  background-color: #242424;
  box-shadow: 0px 0px 0px 5px #505050;
  border-radius: 10px;
  transition-duration: 0.3s;
  transition-property: background-color, box-shadow, border-radius;
  z-index: 200;
  cursor: grabbing;
}
.BaseCarsTeam_DraggingParent .BaseCarsTeam_Car:not(.BaseCarsTeam_Dragging) {
  transition-duration: 0.3s;
  pointer-events: none;
}
.BaseCarsTeam_Car:not(.BaseCarsTeam_Dragging) {
  transition-duration: 0.3s;
}
.BaseCarsTeam_PushLeft {
  transform: translateX(calc(var(--widthF) * -1));
}
.BaseCarsTeam_PushRight {
  transform: translateX(var(--widthF));
}



.BaseCarsTeam_EnterCarDelete {
  position: absolute;
  bottom: 0;
  opacity: 0;
  left: 50%;
  transform: translateX(-50%) !important;
  z-index: 20;
  --back-color: 195, 0, 0;
  --back-opac: 0.5;
  --back-opac-foc: 0.3;
  background-color: rgba(var(--back-color), 0.3);
}
.BaseCarsTeam_Car:hover .BaseCarsTeam_EnterCarDelete,
.BaseCarsTeam_Car:focus-within .BaseCarsTeam_EnterCarDelete {
  opacity: 1;
}
.BaseCarsTeam_EnterCarEmpty {
  position: relative;
  /* height: var(--card-g-height); */
}
.BaseCard_AsGalleryBox.BaseCarsTeam_CarInner {
  --card-g-width: var(--widthF);
  --card-g-height: 142px;
  --card-g-height: round(calc(var(--widthF) * ((415 / 256) - 1)), 1px);
  --card-g-heightraw: round(calc(var(--widthFraw) * ((415 / 256) - 1)), 1);
  --card-g-font: var(--fsizeF);
  /* --card-g-height: 200px; */
}
@supports not (width: round(4px, 1px)) {
  .BaseCard_AsGalleryBox.BaseCarsTeam_CarInner {
    --card-g-height: calc(var(--widthF) * (var(--aspectF) - 1));
    --card-g-heightraw: calc(var(--widthFraw) * (var(--aspectF) - 1));
  }
}
/* .Main_Compact .BaseCard_AsGalleryBox.BaseCarsTeam_CarInner {
  --card-g-width: var(--mini-width);
  --card-g-height: round(calc(var(--width) * (var(--aspect) - 1)), 1px);
  --card-g-font: var(--mini-fsize);
} */
/* .BaseCarsTeam_TeamsAddCarButton150 {
  width: 150px;
  height: 93px;
} */
.BaseCarsTeam_TeamsAddCarButton {
  width: var(--widthF);
  aspect-ratio: var(--aspectF);
  height: auto;
}
@supports not (aspect-ratio: 415 / 256) {
  .BaseCarsTeam_TeamsAddCarButton {
    height: 142px;
  }
  .Main_Compact .BaseCarsTeam_TeamsAddCarButton {
    height: 144px;
  }
}
.BaseCarsTeam_Box .Car_Header {
  background-size: contain;
}
/* .Main_Compact .BaseCarsTeam_TeamsAddCarButton {
  width: var(--mini-width);
  aspect-ratio: var(--mini-aspect);
} */
.Main_Compact .BaseCarsTeam_Box .Car_Header {
  height: auto;
  aspect-ratio: var(--aspectF);
  background-size: cover;
}
.BaseCarsTeam_CarEnterCarPropRQ {
  position: absolute;
  bottom: 4px;
  right: 5px;
  font-size: 16px;
  line-height: 1;
  pointer-events: none;
  color: #fff4;
}
.BaseCarsTeam_AddNotAllowed {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  background-image: repeating-linear-gradient(135deg, transparent, transparent 9px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 24px);
  border-radius: 7px;
}
.BaseCarsTeam_Marked0 #BaseCarsTeam_CareventRt0,
.BaseCarsTeam_Marked1 #BaseCarsTeam_CareventRt1,
.BaseCarsTeam_Marked2 #BaseCarsTeam_CareventRt2,
.BaseCarsTeam_Marked3 #BaseCarsTeam_CareventRt3,
.BaseCarsTeam_Marked4 #BaseCarsTeam_CareventRt4 {
  box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow));
}
</style>