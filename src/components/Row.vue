<template>
  <div
    :class="{
      Row_Tracks: type === 'tracks',
      Row_Times: type === 'times'
    }"
    class="Row_Layout">
    <div
      v-for="(item, ix) in timesResolved"
      :class="{
        Row_ItemError: errorIndex === ix,
        Row_ItemCorrect: correctIndex === ix
      }"
      class="Row_Item Row_Cell">
      <div
        contenteditable="false"
        @blur="blur($event, item, ix)"
        @click="click($event, item, ix)"
        @keydown="keydown($event, item, ix)"
        class="Row_Content">{{ item.text | toTimeString(item.id) }}</div>
      </div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'Row',
  components: {
    // BaseDetalheHeader
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
    }
  },
  data() {
    return {
      errorIndex: null,
      correctIndex: null
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
          text = "-";
          if (this.car.times &&
              this.car.times[x.id]
          ) {
            text = this.car.times[x.id][`a${x.surface}${x.cond}`];
          }
          result.push({ text: text, ...x })
        })
      }
      // console.log(result);

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
      e.srcElement.removeAttribute('contenteditable');
      let number = Vue.options.filters.toTimeNumber(e.srcElement.innerText, item.id);

      let roundedOriginal = Math.round(item.text * 1e2) / 1e2;
      if (number === "-" && (item.text === "-" || item.text === undefined)) {
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
      if (e.srcElement.contentEditable !== 'true') {
        this.$store.commit("CLEAR_EDITABLE");
        e.srcElement.setAttribute('contenteditable', true);
      }
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
  border-top: 0;
  border-left: 0;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
}
.Row_Tracks .Row_Cell {
  border-right: 0;
}
.Row_Tracks {
  
}
.Row_Content {
  text-align: center;
  width: 100%;
  padding: 6px;
  transition-duration: 0.1s;
  outline: none;
}
.Row_Tracks .Row_Content {
  text-align: left;
}
.Row_Times .Row_Content[contenteditable="false"] {
  cursor: pointer;
}
.Row_Times .Row_Content[contenteditable="false"]:hover {
  box-shadow: 0px 0px 0px 2px #fff2;
}
.Row_Content:focus {
  background-color: #459bd100;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 30px ) !important;
}
.Row_Content[contenteditable="true"] {
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
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