<template>
  <!-- <div class="BaseSelectNew_Layout"> -->
    <button
      :disabled="disabled"
      class="BaseSelectNewButton D_Button D_ButtonDark"
      @click="openSelect()">
      <div class="BaseSelectNew_Left">
        <div v-if="label" class="BaseSelectNew_Label">{{ label }}</div>
        <div class="BaseSelectNew_Value"><slot>{{ value }}</slot></div>
      </div>
      <div class="BaseSelectNew_Right">
        <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
      </div>
    </button>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'BaseSelectNew',
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
    list: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      required: false
    },
  },
  beforeMount() {
    if (this.name) {
      let value = window.localStorage.getItem(this.name);
      if (value) {
        value = JSON.parse(value);
        this.$emit('change', value);
      }
    }
  },
  methods: {
    openSelect() {
      let vm = this;

      let action = function(item) {
        vm.$emit('change', item);
        if (vm.name) {
          setTimeout(() => {
            window.localStorage.setItem(vm.name, vm.value);
          }, 10);
        }
        
        vm.$store.commit("DEFINE_DIALOG", {
          active: false
        });
      }

      vm.$store.commit("DEFINE_DIALOG", {
        active: true,
        minWidth: "240px",
        title: "",
        error: false,
        transparent: true,
        disabled: false,
        action: action,
        loading: false,
        maxWidth: "420px",
        hideFooter: true,
        advanced: {
          label: vm.label ? vm.label : vm.$t('m_select'),
          type: "list",
          list: vm.list,
          model: vm.value,
          placeholder: "",
          typeText: "normal",
          class: "BaseText_Big",
        }
      });
    }
  },
}
</script>

<style>
.BaseSelectNewButton {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  gap: 4px;
  min-width: 80px;
}
.BaseSelectNew_Left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.BaseSelectNew_Label {
  font-size: 0.7em;
  opacity: 0.8;
}
.BaseSelectNew_Right {
  margin-right: -5px;
}
</style>