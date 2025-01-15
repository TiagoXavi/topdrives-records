<template>
  <BaseButtonTouch
    style="padding-left: 15px; padding-right: 15px;"
    class="BaseEventName_Item"
    :class="`${tag}`"
    @click="$emit('click', $event)"
    @longTouch="$emit('longTouch', $event)">
    <div
      v-if="item.nameStyled"
      v-html="item.nameStyled"
      :class="contentClass"
      class="BaseEventName_Right"
      :style="`font-size: ${name.length > maxLength ? '0.8em' : ''}`" />
    <div
      v-else
      :class="contentClass"
      class="BaseEventName_Right"
      :style="`font-size: ${name.length > maxLength ? '0.8em' : ''}`">{{ name }}</div>
    <BaseIconSvg v-for="icon in item.icons" :type="icon" :useMargin="false" />
  </BaseButtonTouch>
</template>

<script>
import BaseButtonTouch from './BaseButtonTouch.vue';
import BaseIconSvg from './BaseIconSvg.vue';

export default {
  name: 'BaseEventName',
  components: {
    BaseButtonTouch,
    BaseIconSvg
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    customName: {
      type: String,
      default: ""
    },
    maxLength: {
      type: Number,
      default: 30
    },
    contentClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    name() {
      return this.customName ? this.customName : this.item.name;
    },
    tag() {
      if (!this.item.tag) return "";
      let result = "";
      result += "BaseEventTag_" + this.item.tag.trim().toLowerCase().replace(/  +/g, ' ').replace(/ +/g, '_').replace(/-+/g, '_').normalize('NFD').replace(/\p{Diacritic}/gu, "")
      if (this.item.startDateTime) {
        if (this.item.startDateTime.localeCompare(new Date().toISOString()) > 0) {
          result += " BaseEventTag_Preview"
        }
      }
      if (this.item.endDateTime) {
        if (this.item.endDateTime.localeCompare(new Date().toISOString()) < 0) {
          result += " BaseEventTag_Ended"
        }
      }
      return result;
    }
  },
  methods: {},
}
</script>

<style>
.BaseEventName_Item {
  padding: 7px 25px 7px 0px;
  display: flex;
  width: 100%;
  min-width: fit-content;
  background: transparent;
  outline: 0;
  border: none;
  text-decoration: none;
  user-select: none;
  transition-duration: 0.1s;
  cursor: pointer;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  color: var(--d-text);
  align-items: center;
}
.BaseEventName_Item:hover,
.BaseEventName_Item.focus-visible {
  color: #fff6;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.BaseEventName_Added {
  opacity: 0.5;
}
.BaseEventName_Marked .BaseEventName_Right span:first-child {
  color: rgb(var(--d-text-green));
}
.BaseEventName_Right {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
}
.BaseEventName_Events {
  margin-right: 5px;
  flex-grow: 1;
}
/* .BaseEventTag_daily_event {
  display: none;
} */
.BaseEventTag_uncategorised {

}
.BaseEventTag_collection_series {

}
.BaseEventTag_tri_series_final {

}
.BaseEventTag_Preview {
  color: #9ac712;
}
.BaseEventTag_Ended {
  color: #dd3636;
}
</style>