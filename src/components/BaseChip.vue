<template>
  <button
    :class="`${isSelected ? activeClass : ''}`"
    class="BaseChip"
    @click="toggle">
    <span class="BaseChip_Text"><slot>{{ value }}</slot></span>
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
    activeClass: {
      type: String,
      default: 'D_ButtonActive'
    }
  },
  data() {
    return {}
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
    toggle() {
      const isChecked = !this.isSelected;
      if (this.inputValue instanceof Array) {
        let newValue = [...this.inputValue];

        if (isChecked) {
          newValue.push(this.value);
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }

        if ((this.isRequired && newValue.length > 0) || !this.isRequired) {
          this.$emit('click', newValue);
        }
      } else if (this.value !== null) {
        this.$emit('click', isChecked || this.isRequired ? this.value : null);
      } else {
        this.$emit('click', isChecked ? true : false);
      }
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
}
.BaseChip:hover,
.BaseChip.focus-visible {
  box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow));
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
</style>