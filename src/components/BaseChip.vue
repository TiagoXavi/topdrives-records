<template>
  <button
    :class="`${isSelected ? activeClass : ''} ${disabled ? '' : '' }`"
    :disabled="disabled"
    class="BaseChip"
    @click="toggle($event)"
    @touchstart="touchstart($event)"
    @touchend="touchend($event)"
    @touchmove="touchmove($event)">
    <span class="BaseChip_Text"><slot>{{ label ? label : (dicio && dicio[value] ? dicio[value] : value) }}</slot></span>
    <span v-if="!isNaN(counter) && counter !== 0" class="BaseChip_Sub">{{ counter }}</span>
  </button>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseChip',
  components: {
    // BaseDetalheHeader
  },
  model: {
    prop: 'inputValue',
    event: 'click'
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object],
      default() {
        return null;
      }
    },
    inputValue: {
      type: [String, Number, Boolean, Object, Array],
      default: false
    },
    dicio: {
      type: Object,
      default() {
        return null
      }
    },
    activeClass: {
      type: String,
      default: 'D_ButtonActive'
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    counter: {
      type: Number,
      default: undefined
    },
    allowCtrl: {
      type: Boolean,
      default: false
    },
    oneOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null,
      touchduration: 800,
      timerStart: 0,
      timerEnd: 0,
      element: null,
      tm: null
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    isSelected() {
      if (this.inputValue instanceof Array) {
        return this.inputValue.includes(this.value);
      }
      if (this.value !== null) {
        return this.inputValue === this.value;
      } else {
        return this.inputValue === true;
      }
    },
    isRequired() {
      return this.$attrs.required === '' || this.$attrs.required === 'true';
    }
  },
  methods: {
    toggle(e) {
      if (!this.allowCtrl || !e || (!e.ctrlKey && !e.shiftKey && !e.metaKey)) {
        e = null;
      }
      const isChecked = !this.isSelected;
      if (this.inputValue instanceof Array) {
        let newValue = [...this.inputValue];

        if (isChecked) {
          if (this.oneOnly) {
            newValue = [this.value];
          } else {
            newValue.push(this.value);
          }
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }

        if ((this.isRequired && newValue.length > 0) || !this.isRequired) {
          if (e) this.$emit('click', { newValue, e });
          else this.$emit('click', newValue);
        }
      } else if (this.value !== null) {
        if (e) this.$emit('click', { newValue: isChecked || this.isRequired ? this.value : null, e });
        else this.$emit('click', isChecked || this.isRequired ? this.value : null);
      } else {
        if (e) this.$emit('click', { newValue: isChecked ? true : false, e });
        else this.$emit('click', isChecked ? true : false);
      }
    },
    touchstart(e) {
      this.timerStart = performance.now();
      this.tm = setTimeout(() => {
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        this.$emit('longTouch');
      }, 600);
    },
    touchend(e) {
      clearTimeout(this.tm);


      this.timerEnd = performance.now();
      if (this.timerEnd - this.timerStart < 400 && e.cancelable) {
        this.$emit('shortTouch', e);
      }
    },
    touchmove(e) {
      clearTimeout(this.tm);
    }
  },
}
</script>

<style>
.BaseChip {
  display: inline-flex;
  border-radius: 1px;
  padding: 7px;
  cursor: pointer;
  width: 100%;
  position: relative;
  height: 46px;
  align-items: center;
  background-color: #0004;
  border: none;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  transition-duration: 0.1s;
  text-align: center;
  justify-content: center;
  font-size: 1em;
  outline: none;
  color: var(--d-text-b);
  --back-opac: 0.1;
  --back-opac-foc: 0.3;
}
.BaseChip:not(.D_ButtonActive):hover,
.BaseChip:not(.D_ButtonActive).focus-visible {
  box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow));
}
.BaseChip.D_ButtonActive:hover,
.BaseChip.D_ButtonActive.focus-visible {
  /* box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow)); */
  box-shadow: inset 0px -43px 25px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green)), 0px 0px 0px 2px rgb(var(--d-text-yellow));
}
/* .BaseChip_Active {
  color: var(--active-color);
  box-shadow: inset 0px 0px 0px 2px var(--active-color);
  background-color: transparent;
}
.BaseChip_Active:hover {
  box-shadow: inset 0px 0px 0px 3px var(--active-color);
}
.BaseChip_Active.focus-visible {
  box-shadow: inset 0px 0px 0px 3px var(--active-color);
} */
.BaseChip:active {
  /* transition-duration: 0.0s; */
  /* background-color: rgba(var(--back-color), calc(var(--back-opac) * 2)); */
  transform: translateY(2px);
}
.BaseChip_MinWidth {
  width: auto;
  padding: 7px 13px;
}

.BaseChip_AddButton {
  margin: 0px;
  font-size: 17px;
}
.BaseChip_Text {
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  /* display: flex; */
  /* align-items: center; */
}
.BaseChip_DontCrop .BaseChip_Text {
  max-width: unset;
}
.BaseChip_Text i + span {
  line-height: 19px;
}
.BaseChip_ChipFlag {
  height: 49px;
}
.BaseChip_ChipFlag .BaseChip_Text {
  width: 100%;
  height: 100%;
}
.BaseChip_ChipFlag svg {

}
.BaseChip_Small {
  padding: 5px 10px;
  height: 36px;
  font-size: 0.8em;
}
.BaseChip_TuneStyle {
  background-color: rgba(0,0,0,0.13);
  border-radius: 6px;
  padding: 0 7px;
  height: 32px;
  line-height: 1;
  padding-top: 1px;
}
.BaseChip_SortStyle {
  padding: 5px 10px;
  height: 32px;
  font-size: 13px;
}
.BaseChip[disabled] {
  cursor: initial;
  pointer-events: none;
}
.BaseChip[disabled]:not(.D_ButtonActive) {
  opacity: 0.2;
}
.BaseChip_IconToggle {
  transition-duration: 0.2s;
}
.BaseChip_IconToggle .BaseChip_IconToggleText {
  transition-duration: 0.2s;
}
.BaseChip_Absolute {
  position: absolute;
  transition-duration: 0.2s;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  
}
.BaseChip_IconToggle .BaseChip_Absolute {
  
}
.BaseChip_IconToggle:hover .BaseChip_Absolute,
.BaseChip_IconToggle.focus-visible .BaseChip_Absolute {
  opacity: 1;
}
.BaseChip_IconToggle:hover .BaseChip_IconToggleText,
.BaseChip_IconToggle.focus-visible .BaseChip_IconToggleText {
  opacity: 0;
}
.BaseChip_SmallWide {
  padding: 3px 10px;
  height: auto;
  line-height: 1;
  font-size: 0.8em;
  flex-grow: 1;
}
.BaseChip_SmallWide.D_ButtonActive {
  background-color: rgba(var(--d-text-green), 0.2);
}
.BaseChip_Sub {
  position: absolute;
  text-align: center;
  bottom: 3px;
  font-size: 0.5em;
  font-weight: normal;
  opacity: 0.7;
}
.Main_ClassChip .BaseChip_Sub {
  bottom: -19px;
  font-size: 0.5em;
  font-weight: normal;
  color: var(--d-text-b);
}
.BaseChip_ChipFlag .BaseChip_Sub {
  bottom: -11px;
  font-size: 0.5em;
  font-weight: normal;
  color: var(--d-text-b);
}
.BaseChip_Icon .BaseChip_Text {
  display: flex;
  padding-bottom: 2px;
}
.BaseChip_Icon2 .BaseChip_Text {
  display: flex;
}
</style>