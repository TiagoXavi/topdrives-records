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
    checks: {
      type: Boolean,
      default: false
    },
    dialogConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    name: {
      type: String,
      required: false
    },
    itemLabel: {
      type: Function,
      default(item) {
        return item;
      }
    }
  },
  beforeMount() {
    if (this.name) {
      let value = window.localStorage.getItem(this.name);
      if (value) {
        if (!isNaN(value)) value = Number(value);
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
        minWidth: vm.dialogConfig.minWidth || "240px",
        title: "",
        error: false,
        transparent: true,
        disabled: false,
        action: action,
        loading: false,
        maxWidth: vm.dialogConfig.maxWidth || "420px",
        hideFooter: true,
        advanced: {
          label: vm.label ? vm.label : vm.$t('m_select'),
          type: "list",
          list: vm.list,
          itemLabel: vm.itemLabel,
          checks: vm.checks,
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
  background-clip: padding-box;
}
.BaseSelectNew_Left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex-grow: 1;
  max-width: 100%;
}
.BaseSelectNew_Label {
  font-size: 0.7em;
  opacity: 0.8;
}
.BaseSelectNew_Right {
  margin-right: -5px;
}
.BaseSelectNew_Value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-top: -1px;
  padding-bottom: 1px;
}
</style>