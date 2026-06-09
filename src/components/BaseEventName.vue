<template>
  <BaseButtonTouch
    class="BaseEventName_Item"
    :class="`${tag}`"
    @click="$emit('click', $event)"
    @longTouch="$emit('longTouch', $event)">
    <div class="BaseEventName_Left">
      <div v-if="important" class="BaseEventName_Fire"></div>
      <span
        v-if="item.nameStyled"
        v-html="item.nameStyled"
        :class="contentClass"
        class="BaseEventName_Right"
        :style="`font-size: ${name.length > maxLength ? '0.8em' : ''}`"
      />
      <span
        v-else
        :class="contentClass"
        class="BaseEventName_Right"
        :style="`font-size: ${name.length > maxLength ? '0.8em' : ''}`">{{ name }}</span>
      <slot />
      <BaseRemainingTime
        v-if="!onlyName && (!item?.endDateTime || item?.startDateTime)"
        :endDateTime="started ? item?.endDateTime : item?.startDateTime"
        :hideNegative="false"
        :mini="true"
        :showClock="false"
        @ended="!started ? endedFunc() : null"
        class="BaseEventName_Timer"
      />

    </div>
    <template v-if="!onlyName">
      <i
        v-for="icon in item.icons"
        :class="`tdicon-${icon}`"
        class="TdIconCond"
        aria-hidden="true">
        <span class="path1"/>
        <span class="path2"/>
        <span class="path3"/>
        <span class="path4"/>
      </i>
    </template>
    <!-- <BaseIconSvg v-for="icon in item.icons" :type="`n_${icon}`" :useMargin="false" /> -->
  </BaseButtonTouch>
</template>

<script>
import BaseButtonTouch from './BaseButtonTouch.vue';
import BaseIconSvg from './BaseIconSvg.vue';
import BaseRemainingTime from './BaseRemainingTime.vue';

export default {
  name: 'BaseEventName',
  components: {
    BaseButtonTouch,
    BaseIconSvg,
    BaseRemainingTime
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
    },
    onlyName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      started: false,
      ended: false,
      important: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    name() {
      return this.customName ? this.customName : this.item.name;
    },
    tag() {
      this.important = false;
      if (!this.item.tag) return "";
      if (Vue.importantTags.includes(this.item.tag)) this.important = true;

      let now = new Date().toISOString();
      // if (this.item.date && this.item.date !== "__preview__") return "";
      
      let result = "";
      result += "BaseEventTag_" + this.item.tag.trim().toLowerCase().replace(/  +/g, ' ').replace(/ +/g, '_').replace(/-+/g, '_').normalize('NFD').replace(/\p{Diacritic}/gu, "")

      if (this.item.startDateTime && (!this.item.tag || this.item.tag !== "Daily Event")) {
        if (this.item.startDateTime.localeCompare(now) > 0) {
          result += " BaseEventTag_Preview"
        } else {
          this.started = true;
        }
      }

      if (this.item.endDateTime) {
        let diff = new Date() - new Date(this.item.endDateTime);
        
        if (diff > 14 * 60 * 60 * 1000) { // 14 hours
          result += " BaseEventTag_Ended";
          this.ended = true;
        } else if (diff > 0) {
          result += " BaseEventTag_EndedEu"; // still active in US, AP
          this.ended = true;
        }
      }
      return result;
    }
  },
  methods: {
    endedFunc() {
      this.$emit('needRefresh', this.item);
      // console.log("Event ended", this.item.name);
    }
  },
}
</script>

<style>
.BaseEventName_Item {
  padding: 7px 25px 7px 0px;
  padding-left: 15px;
  padding-right: 15px;
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
  /* color: #fff6; */
  background-color: rgba(var(--back-color), var(--back-opac));
}
.BaseEventName_Added {
  opacity: 0.5;
}
.BaseEventName_Left {
  flex-grow: 1;
  text-align: left;
}
.BaseEventName_Marked .BaseEventName_Right span:first-child {
  color: rgb(var(--d-text-green));
}
.BaseEventName_Right {
  text-align: left;
}
.BaseEventName_Events {
  margin-right: 5px;
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
.BaseEventTag_Preview:not(.BaseEventTag_daily_event) {
  color: #9ac712;
}
.BaseEventTag_EndedEu:not(.BaseEventTag_daily_event) {
  color: #66c9c1;
}
.BaseEventTag_Ended:not(.BaseEventTag_daily_event) {
  color: #e54444;
}
.BaseEventName_Timer {
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  background-color: #0003;
  box-shadow: 0px 0px 0px 2px #0003;
  padding: 2px 3px;
  border-radius: 6px;
  vertical-align: middle;
}
.BaseEventName_Timer:empty {
  display: none;
}
.BaseEventName_HeaderTitle {
  font-size: 1.2em;
  padding-left: 4px;
  padding-right: 0;
  margin-left: -4px;
  color: var(--d-text-b);
  min-width: unset;
}
.BaseEventName_HeaderTitle .BaseEventName_Events {
  margin-right: 0;
}
.BaseEventName_HeaderTitle .BaseEventName_Left {
  overflow: hidden;
  text-overflow: ellipsis;
}
.BaseEventName_Item:has(.BaseEventName_Fire) {
  position: relative;
  overflow: hidden;
}
.BaseEventName_Fire {
  position: absolute;
  top: 0;
  left: -20px;
  width: 100px;
  height: 100%;
  background-image: url(/assets/fire.png);
  background-size: 80%;
  background-position: 50% 60%;
  background-repeat: no-repeat;
  opacity: 0.1;
  pointer-events: none;
}
.Cg_Header .BaseEventName_Fire {
  display: none;
}
</style>