<template>
  <BaseCustomTag
    :tag="isMod ? 'button' : 'div'"
    :class="{ D_Button: isMod }"
    class="BaseCompItem_Layout"
    @click="isMod ? $emit('edit') : ''">
    <template v-if="!empty">
      <div v-if="comp.meta && comp.meta.length > 0" class="BaseCompItem_Meta">
        <template v-for="(item, index) in comp.meta">
          <template v-if="index !== 0">,&nbsp;</template>
          <template>{{ $t(`c_${item.toLowerCase()}`) }}</template>
        </template>
      </div>
      <div class="BaseCompItem_Bottom">
        <div v-if="comp.tyres && comp.tyres.length > 0" class="BaseCompItem_Normal BaseCompItem_Tyres">
          <span>
            <template v-for="(item, index) in comp.tyres">
              <template v-if="index !== 0">,&nbsp;</template>
              <template>{{ $t(`c_${item.toLowerCase()}2`) }}</template>
            </template>
          </span>
          <div class="BaseCompItem_Label">{{ $tc("c_tyre", 1) }}</div>
        </div>
        <div v-if="comp.drives && comp.drives.length > 0" class="BaseCompItem_Normal BaseCompItem_Tyres">
          <div class="BaseCompItem_Label">{{ $tc("c_drive", 1) }}</div>
          <span>{{ comp.drives.join(", ") }}</span>
        </div>
        <div v-if="comp.clearance && comp.clearance.length > 0" class="BaseCompItem_Normal BaseCompItem_Tyres">
          <span>
            <template v-for="(item, index) in comp.clearance">
              <template v-if="index !== 0">,&nbsp;</template>
              <template>{{ $t(`c_${item.toLowerCase()}`) }}</template>
            </template>
          </span>
          <div class="BaseCompItem_Label">{{ $tc("c_clearance", 1) }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <i v-if="isMod" class="ticon-pencil BaseCompItem_Icon" aria-hidden="true"/>
      <i v-else class="ticon-line BaseCompItem_Icon" aria-hidden="true"/>
    </template>
  </BaseCustomTag>
</template>

<script>
import BaseCustomTag from './BaseCustomTag.vue'

export default {
  name: 'BaseCompItem',
  components: {
    BaseCustomTag
  },
  props: {
    comp: {
      type: Object,
      default() {
        return {}
      }
    },
    isMod: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    empty() {
      let result = true;
      if (
        (this.comp.meta && this.comp.meta.length > 0) ||
        (this.comp.tyres && this.comp.tyres.length > 0) ||
        (this.comp.drives && this.comp.drives.length > 0) ||
        (this.comp.clearance && this.comp.clearance.length > 0)
      ) {
        result = false;
      }
      return result;
    }
  },
  methods: {},
}
</script>

<style>
.BaseCompItem_Layout {
  text-align: center;
}
.D_Button.BaseCompItem_Layout {
  text-align: center;
  flex-direction: column;
  font-size: inherit;
  color: inherit;
  line-height: 1.2;
  margin: -5px;
  padding: 5px;
}
.BaseCompItem_Layout:hover .BaseCompItem_Label,
.BaseCompItem_Layout.focus-visible .BaseCompItem_Label {
  opacity: 1;
}
.Main_BodyPrint .BaseCompItem_Label {
  transition-duration: 0s !important;
  opacity: 1;
}
.BaseCompItem_Meta {
  font-size: 20px;
  margin-bottom: 8px;
}
.BaseCompItem_Bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
}
.BaseCompItem_Normal {
  padding: 6px 8px 4px 8px;;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.14);
  position: relative;
  font-size: 14px;
}
.BaseCompItem_Label {
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgb(var(--d-text-yellow));
  transition-duration: 0.2s;
  opacity: 0;
}
</style>