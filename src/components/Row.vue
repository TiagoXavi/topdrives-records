<template>
  <div
    :class="{
      Row_Tracks: type === 'tracks',
      Row_Times: type === 'times'
    }"
    class="Row_Layout">
    <div
      v-for="(info, fx) in infosResolved"
      class="Row_Item Row_Cell">
      <template v-if="info.type === 'Tune'">
        <div class="Row_Content">
          <BaseSelect v-model="selectedTune" :list="tunes" />
          {{ selectedTune }}
        </div>
      </template>
      <template v-else>
        <div class="Row_Content">{{ info }}</div>
      </template>
    </div>
    <div
      v-for="(item, ix) in timesResolved"
      :class="{
        Row_ItemError: errorIndex === ix,
        Row_ItemCorrect: correctIndex === ix
      }"
      class="Row_Item Row_Cell">
      <div
        :class="{ Row_ContentEmpty: item.text === null || item.text === undefined || item.text === '' }"
        :contenteditable="type === 'tracks' ? false : true"
        @blur="blur($event, item, ix)"
        @click="click($event, item, ix)"
        @keydown="keydown($event, item, ix)"
        class="Row_Content">{{ item.text | toTimeString(item.id) }}</div>
      <div class="Row_Placeholder">-</div>
    </div>
  </div>
</template>

<script>
import BaseSelect from '@/components/BaseSelect.vue';

export default {
  name: 'Row',
  components: {
    BaseSelect
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
    type: {
      type: String,
      default: "tracks"
    },
    temp: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      errorIndex: null,
      correctIndex: null,
      infos: ["Tune"],
      selectedTune: null,
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    timesResolved() {
      let result = [];
      let text;
      if (this.type === "tracks") {
        this.list.map(x => {
          result.push({ text: x.name })
        })
      } else if (this.type === "times") {
        this.list.map((x, ix) => {
          text = "";
          if (this.car.times &&
              this.car.times[x.id]
          ) {
            text = this.car.times[x.id][`a${x.surface}${x.cond}`];
          }
          if (text === undefined || text === null) text = "";
          result.push({ text: text, ...x })
        })
      }
      // console.log(result);

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
      let result = ["332", "233", "323"];
      if (this.car.class === "S") result.push("111");
      return result;
    }
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
    }
  },
}
</script>

<style>
.Row_Cell {
  white-space: nowrap;
  height: var(--cell-height);
  box-sizing: border-box;
  border: 2px #ffffff0d solid;
  border-top-width: 0;
  border-left-width: 0;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  position: relative;
}
.Car_Dragging + .Car_Layout .Row_Cell,
.Car_PushLeft + .Car_Layout .Row_Cell,
.Car_PushRight .Row_Cell {
  border-left-width: 2px;
}
.Row_Tracks .Row_Cell {
  border-right-width: 0;
}
.Row_Tracks {
  
}
.Row_Content {
  text-align: center;
  width: 100%;
  padding: 6px;
  transition-duration: 0.1s;
  outline: none;
  height: 100%;
  box-sizing: border-box;
}
.Row_Tracks .Row_Content {
  text-align: left;
}
.Row_Times .Row_Content[contenteditable="true"]:not(:focus) {
  cursor: pointer;
}
.Row_Times .Row_Content[contenteditable="true"]:hover {
  box-shadow: 0px 0px 0px 2px #fff2;
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
.Row_ContentEmpty:not(:focus) ~ .Row_Placeholder {
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
</style>