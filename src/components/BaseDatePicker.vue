<template>
  <div class="BaseDatePicker_Layout">
    <div v-if="label" class="BaseDatePicker_Label">{{ label }}</div>
    <span class="BaseDatePicker_Box">
      <span v-if="value" class="BaseDatePicker_SideCalendar">
        <div class="BaseDatePicker_Day">{{ value.slice(-2) }}</div>
        <div class="BaseDatePicker_Month">{{ new Date(`${value}T00:00:00`).toLocaleString(undefined,{month:'short'}) }}</div>
      </span>
      <span v-else class="BaseDatePicker_SideButton">
        <i class="ticon-calendar" aria-hidden="true"/>
      </span>
      <input
        :value="value"
        :disabled="disabled"
        :min="min"
        :max="max"
        required
        type="date"
        class="BaseDatePicker_Input"
        @input="$emit('change', $event.target.value);"
        @click="$emit('click', $event)">
    </span>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseDatePicker',
  components: {
    // BaseDetalheHeader
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true
    },
    label: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: String,
      default: ""
    },
    max: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      showFix: true
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    // reformat(a, b, c) {
    //   let el = a.target;
    //   let formated = new Date(el.value).toLocaleDateString("pt-BR", { year: 'numeric', month: 'short', day: '2-digit' });
    //   el.setAttribute("data-date", formated);
    //   console.log(el);
    // }
    // runFix() {
    //   this.showFix = false;
    //   this.$nextTick().then(() => {
    //     this.showFix = true;
    //   });
    // }
  },
}
</script>

<style>

:root {
  --form-control-color: white;
  --form-control-disabled: #959495;
}
.BaseDatePicker_Layout {
  --icon-box: 40px;
}
.BaseDatePicker_Label {
  font-size: 14px;
}

.BaseDatePicker_Box {
  display: block;
  position: relative;
}

.BaseDatePicker_Input {
  cursor: pointer;
  border: none;
  color-scheme: dark;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 18px;
  padding: 10px 6px;
  color: var(--d-text-b);
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  outline: none;
}

.BaseDatePicker_Input::-webkit-datetime-edit {
  
}


.BaseDatePicker_SideButton {
  position: absolute;
  right: 0;
  top: 0;
  width: var(--icon-box);
  height: 100%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
}
.BaseDatePicker_SideCalendar {
  position: absolute;
  right: 0;
  top: 0;
  width: var(--icon-box);
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.BaseDatePicker_Day {
  font-size: 20px;
  line-height: 1;
}
.BaseDatePicker_Month {
  font-size: 12px;
  text-transform: uppercase;
}


.BaseDatePicker_Input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0;
  top: 0;
  width: var(--icon-box);
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
  opacity: 0;
}



.BaseDatePicker_Input.focus-visible {
  
}

.BaseDatePicker_Input:disabled {
  --form-control-color: var(--form-control-disabled);
  color: var(--form-control-disabled);
  cursor: default;
}


</style>