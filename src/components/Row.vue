<template>
  <div
    :class="{
      Row_Tracks: type === 'tracks',
      Row_Times: type === 'times'
    }"
    class="Row_Layout">
    <div
      v-for="(info, fx) in infosResolved"
      class="Row_Item Row_Cell Row_ConfigCell">
      <template v-if="info.type === 'Tune'">
        <div class="Row_Config">
          <template v-if="!car.selectedTune">
            <div class="Row_TuneChooseBox">
              <button
                v-for="item in tunes"
                class="D_Button Row_DialogButtonTune Row_TuneChooseButton"
                @click="changeTune(item)">{{ item }}</button>
            </div>
          </template>
          <template v-else> 
            <div class="Row_Tune">{{ car.selectedTune }}</div>
            <div class="Row_ConfigBox">
              <button class="D_Button Row_ConfigButton" @click="showTuneDialog()">
                <i class="ticon-gear Row_ConfigIcon" aria-hidden="true"/>
              </button>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="Row_Content">{{ ' ' }}</div>
      </template>
    </div>

    <div
      v-if="car.selectedTune || type === 'tracks'"
      v-for="(item, ix) in timesResolved"
      :class="`${errorIndex === ix ? 'Row_ItemError ' : '' }`+
              `${correctIndex === ix ? 'Row_ItemCorrect ' : '' }`+
              `${true ? 'Row_ColorByIndex ' : '' }`+
              `${hoverIndex == ix+1 ? 'Row_Hover ' : '' }`+
              `${item.surface === 0 && item.cond === 0 ? 'Row_Asphalt ' : '' }`+
              `${item.cond === 1 ? 'Row_Wet ' : '' }`+
              `${item.surface === 1 ? 'Row_Dirt ' : '' }`+
              `${item.surface === 2 ? 'Row_Gravel ' : '' }`+
              `${item.surface === 3 ? 'Row_Ice ' : '' }`+
              `${item.surface === 4 ? 'Row_Mixed ' : '' }`+
              `${item.surface === 5 ? 'Row_Sand ' : '' }`+
              `${item.surface === 6 ? 'Row_Snow ' : '' }`+
              `${item.text === null || item.text === undefined || item.text === '' ? 'Row_ContentEmpty ' : '' }`+
              `Row_ColorByIndex${highlights[`${item.id}_a${item.surface}${item.cond}`]}`"
      :style="{ '--color-index': highlights[`${item.id}_a${item.surface}${item.cond}`] }"
      class="Row_Item Row_Cell"
      @mouseenter="mouseEnter($event)">
      <div
        :contenteditable="type === 'tracks' ? false : true"
        @blur="blur($event, item, ix)"
        @click="click($event, item, ix)"
        @keydown="keydown($event, item, ix)"
        class="Row_Content">{{ item.text | toTimeString(item.id) }}</div>
      <div class="Row_Placeholder">-</div>
      <div v-if="type === 'tracks'" class="Row_Conditions">
        <div v-if="item.cond === 1" style="color: rgb(var(--color-wet))">WET</div>
        <div v-if="item.surface === 1" style="color: rgb(var(--color-dirt))">DIRT</div>
        <div v-if="item.surface === 2" style="color: rgb(var(--color-gravel))">GRAVEL</div>
        <div v-if="item.surface === 3" style="color: rgb(var(--color-ice))">ICE</div>
        <div v-if="item.surface === 4" style="color: rgb(var(--color-mixed))">MIXED</div>
        <div v-if="item.surface === 5" style="color: rgb(var(--color-sand))">SAND</div>
        <div v-if="item.surface === 6" style="color: rgb(var(--color-snow))">SNOW</div>
      </div>
    </div>
    <div v-else class="Row_Item Row_Cell Row_DisabledCell" @mouseenter="mouseEnter($event)"></div>

    <portal v-if="tuneDialog" to="tunedialog">
      <div class="Row_DialogLayout">
        <div class="Row_OrderBox Space_Bottom">
          <button
            :disabled="carIndex === 0"
            :class="{ Row_DialogButtonTuneActive: false }"
            class="D_Button Row_DialogButtonTune"
            @click="$emit('move', { carIndex, direction: 'left' })">
              <i class="ticon-arrow_up_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
          </button>
          <button
            :disabled="carIndex === maxCarNumber - 1"
            :class="{ Row_DialogButtonTuneActive: false }"
            class="D_Button Row_DialogButtonTune"
            @click="$emit('move', { carIndex, direction: 'right' })">
              <i class="ticon-arrow_down_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
          </button>
        </div>
        <div class="Row_DialogHeader">
          <button
            v-for="item in tunes"
            :class="{ Row_DialogButtonTuneActive: car.selectedTune === item }"
            class="D_Button Row_DialogButtonTune D_ButtonNoActive"
            @click="changeTune(item)">{{ item }}</button>
        </div>
        <div class="Row_DialogBody Space_TopPlus">
          <div class="Row_DialogCard">
            <div class="Row_DialogCardLeft">
              <BaseCard
                :car="car"
                :options="false" />
            </div>
            <div class="Row_DialogCardRight">
              <BaseText
                :value="(((car.data || {})[car.selectedTune] || {}).info || {}).topSpeed"
                :disabled="!car.selectedTune || !!(((car.data || {})[car.selectedTune] || {}).info || {}).topSpeed"
                type="topSpeed"
                label="Top speed"
                class="Space_Bottom"
                placeholder="-"
                @change="changeStat('topSpeed', $event)" />
              <BaseText
                :value="(((car.data || {})[car.selectedTune] || {}).info || {}).acel"
                :disabled="!car.selectedTune || !!(((car.data || {})[car.selectedTune] || {}).info || {}).acel"
                type="acel"
                label="0-60mph"
                class="Space_Bottom"
                placeholder="-"
                @change="changeStat('acel', $event)" />
                {{ card_acel }}
              <BaseText
                :value="(((car.data || {})[car.selectedTune] || {}).info || {}).hand"
                :disabled="!car.selectedTune || !!(((car.data || {})[car.selectedTune] || {}).info || {}).hand"
                type="hand"
                label="Handling"
                placeholder="-"
                @change="changeStat('hand', $event)" />
            </div>
          </div>
        </div>
        <div class="Row_DialogCardBottom Space_TopPlus">
          <div class="Row_DialogCardStat">
            <div class="Row_DialogCardStatLabel">ABS</div>
            <div :class="{ Row_DialogCardStatCorrect: car.abs }" class="Row_DialogCardStatValue">{{ car.abs ? 'Yes' : 'No' }}</div>
          </div>
          <div class="Row_DialogCardStat">
            <div class="Row_DialogCardStatLabel">TCS</div>
            <div :class="{ Row_DialogCardStatCorrect: car.tcs }" class="Row_DialogCardStatValue">{{ car.tcs ? 'Yes' : 'No' }}</div>
          </div>
          <div class="Row_DialogCardStat">
            <div class="Row_DialogCardStatLabel">Clearance</div>
            <div class="Row_DialogCardStatValue">{{ car.clearance }}</div>
          </div>
          <div class="Row_DialogCardStat">
            <div class="Row_DialogCardStatLabel">MRA (stock)</div>
            <div class="Row_DialogCardStatValue">{{ car.mra }}</div>
          </div>
          <div class="Row_DialogCardStat">
            <div class="Row_DialogCardStatLabel">Weight (stock)</div>
            <div class="Row_DialogCardStatValue">{{ car.weight }}</div>
          </div>
        </div>
      </div>
    </portal>
    
  </div>
</template>

<script>
import BaseSelect from '@/components/BaseSelect.vue';
import BaseText from '@/components/BaseText.vue';
import BaseCard from '@/components/BaseCard.vue';

export default {
  name: 'Row',
  components: {
    BaseSelect,
    BaseText,
    BaseCard
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    car: {
      type: Object,
      default() {
        return {}
      }
    },
    highlights: {
      type: Object,
      default() {
        return {}
      }
    },
    carIndex: {
      type: Number,
      default: -1
    },
    maxCarNumber: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      default: "tracks"
    },
    temp: {
      type: Number,
      default: 1
    },
    hoverIndex: {
      type: Number,
      default: -1
    },
  },
  data() {
    return {
      errorIndex: null,
      correctIndex: null,
      infos: ["Tune"],
      tuneDialog: false,
      card_speed: null,
      card_acel: null,
      card_hand: null,
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let vm = this;
    vm.$store.subscribe(mutation => {
      if (mutation.type == "SHOW_TUNE") {
        if (mutation.payload === false) {
          setTimeout(() => {
            vm.tuneDialog = false;
          }, 99);
        }
      }
    }); 
  },
  computed: {
    timesResolved() {
      let result = [];
      let text;
      let car;
      if (this.type === "tracks") {
        this.list.map(x => {
          result.push({ text: x.name, cond: x.cond, surface: x.surface })
        })
      } else if (this.type === "times") {
        this.list.map((x, ix) => {
          text = "";
          car = this.car;
          // if (car.times &&
          //     car.times[x.id]
          // ) {
          if (
              car.selectedTune &&
              car.data &&
              car.data[car.selectedTune] &&
              car.data[car.selectedTune].times
          ) {
            text = car.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}`];
          }
          if (text === undefined || text === null) text = "";
          result.push({ text: text, ...x, cond: x.cond, surface: x.surface })
        })
      }
      console.log(result);

      return result;
    },
    infosResolved() {
      let result = [];
      if (this.type === "tracks") {
        return this.infos;
      } else {
        this.infos.map(x => {
          if (x === "Tune") {
            result.push({ type: x })
          }
        })
        return result;
      }
    },
    tunes() {
      let result = ["332", "323", "233"];
      if (this.car.class === "S") result.push("111");
      return result;
    },
    
  },
  methods: {
    keydown(e, item, ix) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.blur(e, item, ix);        
      }
    },
    blur(e, item, ix) {
      // e.srcElement.removeAttribute('contenteditable');
      let number = Vue.options.filters.toTimeNumber(e.srcElement.innerText, item.id);

      let roundedOriginal = Math.round(item.text * 1e2) / 1e2;
      if (number === "" && (item.text === "" || item.text === undefined)) {
        // nada
      } else if (number !== false && number !== roundedOriginal) {
        // mudou
        this.$store.commit("CHANGE_TIME", {
          number,
          item,
          car: this.car
        });
        e.srcElement.innerText = Vue.options.filters.toTimeString(number, item.id);
        this.correctIndex = ix;
        setTimeout(() => {
          this.correctIndex = null;
        }, 1500);
      } else if (number === false) {
        // não mudou
        e.srcElement.innerText = Vue.options.filters.toTimeString(item.text, item.id);
        this.errorIndex = ix;
        setTimeout(() => {
          this.errorIndex = null;
        }, 1500);
      } else {
        e.srcElement.innerText = Vue.options.filters.toTimeString(item.text, item.id);
      }
    },
    click(e, item, ix) {
      if (this.type === 'tracks') return;
      // if (e.srcElement.contentEditable !== 'true') {
      //   this.$store.commit("CLEAR_EDITABLE");
      //   e.srcElement.setAttribute('contenteditable', true);
      // }
    },
    showTuneDialog() {
      this.tuneDialog = true;
      this.$store.commit("SHOW_TUNE", true);
    },
    changeTune(tune) {
      this.$store.commit("CHANGE_TUNE", {
        tune,
        car: this.car
      });
    },
    changeInput(e) {
      debugger;
    },
    changeStat(type, value) {
      this.$store.commit("CHANGE_STAT", {
        type,
        value,
        car: this.car
      });
    },
    mouseEnter(e) {
      var nodes = Array.prototype.slice.call( e.srcElement.parentElement.children );
      var liRef = e.srcElement;

      this.$store.commit("HOVER_INDEX", nodes.indexOf( liRef ));
    }
  },
}
</script>

<style>
.Row_Cell {
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
  box-shadow: inset 0px -2px 0px 0px #ffffff07, inset -2px 0px 0px 0px #ffffff07;
}
.Car_Dragging + .Car_Layout .Row_Cell,
.Car_PushLeft + .Car_Layout .Row_Cell,
.Car_PushRight .Row_Cell {
  border-left-width: 2px;
}
.Row_Tracks .Row_Cell {
  border-right-width: 0;
}
.Row_Times .Row_Cell {
  letter-spacing: 0.5px;
}
.Row_Hover:not(:hover) {
  box-shadow: inset 0px -80px 0px 0px rgb(255, 255, 255, 0.04);
}
.Row_Content {
  text-align: center;
  width: 100%;
  padding: 6px;
  transition-duration: 0.2s;
  transition-property: background;
  outline: none;
  height: 100%;
  box-sizing: border-box;
}
.Row_ConfigCell {
  border-bottom-color: #5a5a5a;
}
.Row_Tracks .Row_Wet {
  color: rgb(var(--color-wet));
  background-color: rgba(var(--color-wet), 0.1);
}
.Row_Tracks .Row_Dirt {
  color: rgb(var(--color-dirt));
  background-color: rgba(var(--color-dirt), 0.1);
}
.Row_Tracks .Row_Gravel {
  color: rgb(var(--color-gravel));
  background-color: rgba(var(--color-gravel), 0.1);
}
.Row_Tracks .Row_Ice {
  color: rgb(var(--color-ice));
  background-color: rgba(var(--color-ice), 0.1);
}
.Row_Tracks .Row_Mixed {
  color: rgb(var(--color-mixed));
  background-color: rgba(var(--color-mixed), 0.1);
}
.Row_Tracks .Row_Sand {
  color: rgb(var(--color-sand));
  background-color: rgba(var(--color-sand), 0.1);
}
.Row_Tracks .Row_Snow {
  color: rgb(var(--color-snow));
  background-color: rgba(var(--color-snow), 0.1);
}
.Row_Tracks .Row_Content {
  text-align: left;
  white-space: normal;
  line-height: 1;
  display: flex;
  align-items: center;
}
.Row_Times .Row_Content[contenteditable="true"]:not(:focus) {
  cursor: pointer;
}
.Row_Times .Row_Content[contenteditable="true"]:hover {
  box-shadow: inset -2px -2px 0px 0px #fff2, 0px -2px 0px 0px #fff2, -2px 0px 0px 0px #fff2;
}
.Row_Content:focus {
  /* background-color: #459bd100; */
  background-color: #459bd126;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 30px ) !important;
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
}
/* .Row_Content[contenteditable="true"] {
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
} */
.Row_Times .Row_Content[contenteditable="true"]:hover:focus {
  box-shadow: 0px 0px 0px 3px #459bd1;
}
.Row_Placeholder {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  text-align: center;
  padding: 6px;
  box-sizing: border-box;
  display: none;
}
.Row_ContentEmpty .Row_Content:not(:focus) ~ .Row_Placeholder {
  display: block;
}
.Row_ItemError {
  transition-duration: 0s;
  box-shadow: inset 0px -13px 16px -17px #b50000, inset 0px -2px 0px 0px #b50000;
  color: #ff9898;
  background-color: #b5000022;
}
.Row_ItemCorrect {
  transition-duration: 0s;
  box-shadow: inset 0px -13px 16px -17px #5fb500, inset 0px -2px 0px 0px #5fb500;
  color: #90df39;
  background-color: #5fb50022;
}
.Row_ConfigCell {
  justify-content: center;
  background-color: rgba(255,255,255, 0.05);
}
.Row_Tracks .Row_ConfigCell {
  /* box-shadow: inset -18px 0px 16px -17px #5fb500, inset -3px 0px 0px 0px #5fb500; */
}
.Row_ConfigIcon {
  font-size: 24px;
  color: var(--d-text);
}
.Row_ConfigLabel {
  color: var(--d-text);
}
.D_Button.Row_ConfigButton {
  padding: 0px 6px;
  --height: 34px;
}
.D_Button.Row_DialogButtonTune {
  color: var(--d-text);
  font-size: 1.2em;
  padding: 0 9px;
  border-radius: 0;
}
.Row_DialogHeader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.D_Button.Row_DialogButtonTuneActive {
  box-shadow: inset 0px -33px 15px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
}
.Row_DialogButtonTune s {
  text-decoration: none;
  opacity: 0.6;
}
.Row_Tune {
  font-size: 1.1em;
  flex-grow: 1;
  text-align: center;
  padding-left: 36px;
}
.Row_Config {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}
.Row_DialogCardCard {
  width: 300px !important;
  height: 184px !important;
}
.Row_DialogCardCard .Car_HeaderStatLabel {
  display: block;
}
.Row_DialogCard {
  display: flex;
  align-items: center;
  gap: 14px;
}
.Row_DialogCardBottom {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  justify-content: center;
}
.Row_DialogCardStatLabel {
  font-size: 0.8em;
  color: #777;
}
.Row_DialogCardStatValue {
  color: var(--d-text-b);
}
.Row_DialogCardStatCorrect {
  color: rgb(var(--d-text-green));
}
.D_Button.Row_TuneChooseButton {
  background-color: rgba(0,0,0,0.2);
  font-size: 1em;
  border-radius: 6px;
  padding: 0 7px;
  min-height: calc( var(--height) * 0.8 );
}
.Row_TuneChooseBox {
  display: flex;
  align-items: center;
  gap: 4px;
}
.Row_ColorByIndex:not(.Row_ContentEmpty) {
  /* background-color: rgba(38, 0, 118, calc(1 - var(--color-index) * 0.4)); */
}
.Row_ColorByIndex0:not(.Row_ContentEmpty) {
  background-color: #ffc30014;
  color: #efe9c0;
}
.Row_ColorByIndex1:not(.Row_ContentEmpty) {
  background-color: #d3f7ff14;
  color: #d3dee9;
}
.Row_ColorByIndex2:not(.Row_ContentEmpty) {
  background-color: #74340014;
  color: #dbc0aa;
}
.Row_Conditions {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;
  position: absolute;
  right: 2px;
  bottom: 0px;
}
.Main_2 .Car_Layout:hover .Row_Item:not(:hover),
.Main_2 .Car_Layout:hover .Car_Header2 {
  box-shadow: inset 0px -80px 0px 0px rgb(255, 255, 255, 0.04);
}

@media only screen and (max-width: 767px) {
  .Row_Tracks .Row_Content {
    white-space: normal;
    font-size: 0.7em;
  }
}
</style>