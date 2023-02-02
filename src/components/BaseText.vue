<template>
  <div
    :class="{
      BaseText_Error: pis,
      BaseText_Correct: correct 
    }"
    class="BaseText_Layout">
    <div class="BaseText_Label">{{ label }}</div>
    <input
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="intype"
      :id="iid"
      class="BaseText_Input"
      @change="resolveChange($event.target.value)"
      @blur="$emit('blur')">
    <div v-if="disabled" class="BaseText_Lock">
      <i class="ticon-lock BaseText_LockIcon" aria-hidden="true"/>
    </div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseText',
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
      default: "Label"
    },
    placeholder: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: null
    },
    iid: {
      type: String,
      default: null
    },
    intype: {
      type: String,
      default: "text"
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      pis: false,
      correct: false
    }
  },
  watch: {

  },
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    resolveChange(e) {
      if (this.type === "normal") {
        this.$emit('change', e);
      } else if (this.type === "integer") {
        if (typeof e === "string") {
          var integer = new RegExp(/[0-9]+/g);
          var isInteger = integer.test(e);
          if (isInteger) {
            this.$emit('change', e);
            this.correct = true;
            setTimeout(() => {
              this.correct = false;
            }, 1500);
            return;
          }
        }
        this.$emit('change', '');
        this.pis = true;
        setTimeout(() => {
          this.pis = false;
        }, 1500);
        
      } else {
        if (typeof e === "string") {
          var acel = new RegExp(/[0-9]+\.[0-9]/g);
          var isAcel = acel.test(e);
          var topHand = new RegExp(/[0-9][0-9]+/g);
          var isTopHand = topHand.test(e);
    
          if ((this.type === "acel" && (isAcel || e === "0" || e === "N/A")) || (this.type === "topSpeed" && isTopHand) || (this.type === "hand" && isTopHand)) {
            if (this.type === "acel" && e === "0") {
              e = "N/A"
            }
            this.$emit('change', e);
            this.correct = true;
            setTimeout(() => {
              this.correct = false;
            }, 1500);
            return;
          }
        }
  
        this.$emit('change', '');
        this.pis = true;
        setTimeout(() => {
          this.pis = false;
        }, 1500);
      }
    }
  },
}
</script>

<style>
.BaseText_Layout {
  display: flex;
  flex-direction: column;
  position: relative;
}
.BaseText_Input {
  background-color: rgba(0,0,0,0.2);
  border: 0;
  box-sizing: border-box;
  /* border: 2px #ffffff0d solid; */
  outline: none;
  color: var(--d-text-b);
  padding: 6px;
  transition-duration: 0.1s;
  width: 100%;
  margin-top: 2px;
}
.BaseText_Label {
  font-size: 14px;
}
.BaseText_Input:focus {
  /* background-color: #459bd100; */
  background-color: #459bd126;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 30px ) !important;
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
}
.BaseText_Input:hover {
  box-shadow: 0px 0px 0px 2px #fff2;
}
.BaseText_Input:hover:focus {
  box-shadow: 0px 0px 0px 3px #459bd1;
}
.BaseText_Error .BaseText_Input {
  transition-duration: 0s;
  box-shadow: inset 0px -13px 16px -17px #b50000, 0px 0px 0px 2px #b50000 !important;
  color: #ff9898;
  background-color: #b5000022;
}
.BaseText_Correct .BaseText_Input {
  transition-duration: 0s;
  box-shadow: inset 0px -13px 16px -17px #5fb500, 0px 0px 0px 2px #5fb500 !important;
  color: #90df39;
  background-color: #5fb50022;
}
.BaseText_Input[disabled] {
  /* background-color: rgba(255,255,255,0.08);
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 4px, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0.2) 8px ) !important; */
}
.BaseText_Input[disabled]:hover {
  box-shadow: 0px 0px 0px 0px #fff2;
}
.BaseText_Input[disabled]::placeholder {
  color: transparent;
}
.BaseText_Lock {
  position: absolute;
  right: -5px;
  bottom: -5px;
  display: flex;
}
.BaseText_Big .BaseText_Input {
  font-size: 18px;
  padding: 10px 6px;
}
</style>