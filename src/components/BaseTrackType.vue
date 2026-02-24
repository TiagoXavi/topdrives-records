<template>
  <div style="display: contents;">
    <div
      v-for="(type, itype) in resolvedList"
      :class="`Type_${type} `+
              `${isButton ? 'D_Button D_ButtonDark D_ButtonDark2 ' : '' }`+
              `${circuit[type] === true && mode === 'compare' ? 'BaseTrackType_Active ' : '' }`+
              `${isTrackSet && circuit[itype].active ? 'BaseTrackType_Active ' : '' }`"
      class="BaseTrackType_Button BaseTrackType_Item"
      :role="isButton ? 'button' : undefined"
      :dataid="dataid"
      :dataitype="itype"
      :datatype="type">
      <i :class="`tdicon-${type}`" class="BaseTrackType_Icon TdIconCondRel" aria-hidden="true">
        <span class="path00"/>
        <span class="path01"/>
        <span class="path1"/>
        <span class="path2"/>
        <span class="path3"/>
        <span class="path4"/>
        <div class="TdIconCondPercGroup">
          <span v-bind:scode="`${dataid}_a${type}` | trackToPerc(0, false, true)" class="TdIconCondPerc">{{ `${dataid}_a${type}` | trackToPerc(0, false) }}</span>
          <span v-bind:scode="`${dataid}_a${type}` | trackToPerc(1, false, true)" class="TdIconCondPerc">{{ `${dataid}_a${type}` | trackToPerc(1, false) }}</span>
          <span v-bind:scode="`${dataid}_a${type}` | trackToPerc(2, false, true)" class="TdIconCondPerc">{{ `${dataid}_a${type}` | trackToPerc(2, false) }}</span>
        </div>
      </i>
      <div v-if="isTrackSet" class="BaseTrackType_Label">
        <span class="TypeText_Dry" v-if="type == '00'">{{ $t('s_dry') }}{{ circuit[itype].customSufix ? ` ${circuit[itype].customSufix}` : '' }}</span>
        <span class="TypeText_Wet" v-if="type == '01'">{{ $t('s_wet') }}</span>
        <span class="TypeText_Dirt" v-if="type == '10'">{{ $t('s_dirt') }}</span>
        <span class="TypeText_Dirt" v-if="type == '11'">{{ $t('s_mud') }}</span>
        <span class="TypeText_Gravel" v-if="type == '20'">{{ $t('s_gravel') }}</span>
        <span class="TypeText_Ice" v-if="type == '30'">{{ $t('s_ice') }}</span>
        <span class="TypeText_Sand" v-if="type == '50'">{{ $t('s_sand') }}</span>
        <span class="TypeText_Snow" v-if="type == '60'">{{ $t('s_snow') }}</span>
        <span class="TypeText_Grass" v-if="type == '70'">{{ $t('s_grass') }}</span>
      </div>
      <!-- <span class="TypeText_Dry" v-if="type[0] == '0'"><BaseIconSvg :type="`n_asphalt${type[1] == '1'?'rain':''}`" :useMargin="false"/>{{ isTrackSet && circuit[itype].customSufix ? ` ${circuit[itype].customSufix}` : '' }}</span>
      <span class="TypeText_Dirt" v-else-if="type[0] == '1'"><BaseIconSvg :type="`n_dirt${type[1] == '1'?'rain':''}`" :useMargin="false"/></span>
      <span class="TypeText_Gravel" v-else-if="type[0] == '2'"><BaseIconSvg :type="`n_gravel`" :useMargin="false"/></span>
      <span class="TypeText_Ice" v-else-if="type[0] == '3'"><BaseIconSvg :type="`n_ice`" :useMargin="false"/></span>
      <span class="TypeText_Sand" v-else-if="type[0] == '5'"><BaseIconSvg :type="`n_sand`" :useMargin="false"/></span>
      <span class="TypeText_Snow" v-else-if="type[0] == '6'"><BaseIconSvg :type="`n_snow`" :useMargin="false"/></span>
      <span class="TypeText_Grass" v-else-if="type[0] == '7'"><BaseIconSvg :type="`n_grass${type[1] == '1'?'rain':''}`" :useMargin="false"/></span>
      <template v-else>
        <template v-if="type == 'e0'">
          <span class="TypeText_Sand">{{ `${$t('s_sand')}\n` }}</span>
          <span class="TypeText_Dirt">{{ $t('s_dirt') }}</span>
        </template>
        <template v-else-if="type == 'f0'">
          <span class="TypeText_Dry">{{ $t('s_aspht') }}</span>
          <span class="TypeText_Grass">{{ ` ${$t('s_grass')}` }}</span>
          <span class="TypeText_Dirt">{{ `\n${$t('s_dirt')}` }}</span>
        </template>
        <template v-else-if="type == 'g0'">
          <span class="TypeText_Ice">{{ $t('s_ice') }}</span>
          <span class="TypeText_Snow">{{ `\n${$t('s_snow')}` }}</span>
        </template>
        <template v-else-if="type == 'h0'">
          <span class="TypeText_Snow">{{ $t('s_snow') }}</span>
          <span class="TypeText_Dirt">{{ `\n${$t('s_dirt')}` }}</span>
        </template>
        <template v-else-if="type == 'h1'">
          <span class="TypeText_Snow">{{ $t('s_snow') }}</span>
          <span class="TypeText_Dirt">{{ ` ${$t('s_dirt')}` }}</span>
        </template>
        <template v-else>
          <span v-if="type !== '01'" class="TypeText_Dry">{{ $t('s_aspht') }}</span>
          <span class="TypeText_Dirt" v-if="type == '40'">{{ `\n${$t('s_dirt')}` }}</span>
          <span class="TypeText_Gravel" v-else-if="type == 'b0'">{{ `\n${$t('s_gravel')}` }}</span>
          <span class="TypeText_Sand" v-else-if="type == 'c0'">{{ `\n${$t('s_sand')}` }}</span>
          <span class="TypeText_Snow" v-else-if="type == 'd0'">{{ `\n${$t('s_snow')}` }}</span>
          <span class="TypeText_Dirt" v-else-if="type == '41'">{{ ` ${$t('s_dirt')}` }}</span>
          <span class="TypeText_Sand" v-else-if="type == 'c1'">{{ ` ${$t('s_sand')}` }}</span>
        </template>
      </template> -->
      <!-- <span class="TypeText_Wet" v-if="type[1] == '1'"><br v-if="type !== '01'"><BaseIconSvg :type="`n_rain${type !== '01' ? '2' : ''}`" :useMargin="false"/></span> -->
    </div>
  </div>
</template>

<script>
import BaseIconSvg from '@/components/BaseIconSvg.vue';
import BaseCustomTag from '@/components/BaseCustomTag.vue';

export default {
  name: 'BaseTrackType',
  components: {
    BaseIconSvg,
    BaseCustomTag
  },
  props: {
    circuit: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    isTrackSet: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "compare"
    },
    trackType: {
      type: String,
      default: ""
    },
    isButton: {
      type: Boolean,
      default: true
    },
    dataid: {},
    perc: {},
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    resolvedList() {
      if (this.isTrackSet) {
        return this.circuit.map(x => x.type)
      } else if (this.trackType) {
        return [this.trackType]
      } else {
        return this.circuit.types
      }
    }
  },
  methods: {
    resolveToTrackObj(type, itype, e) {
      if (this.isTrackSet) {
        this.$emit('toggleTrackSet', this.circuit[itype].tracks);
      } else {
        this.$emit('toggleTrack', { track: `${this.circuit.id}_a${type}`, e: e });
      }
    }
  },
}
</script>

<style>
.BaseTrackType_Item.BaseTrackType_Button {
  font-size: 11px;
  line-height: 1.1;
  white-space: pre-line;
  padding: 2px 5px;
  min-width: 30px;
  position: relative;
  border-radius: 6px;
  display: flex;
  align-items: center;
  --height: 37px;
  justify-content: center;
  min-height: var(--height);
}
.Main_CustomTrackItem .BaseTrackType_Item.BaseTrackType_Active {
  box-shadow: inset 0px 0px 0px 2px rgba(var(--ccond), 0.7);
  background-color: rgba(0, 0, 0, 0.2);
}
.Main_CustomTrackItem .BaseTrackType_Item.BaseTrackType_Active.Type_00 {
  --type-back-opac: 0.15;
}
.BaseTrackType_Small .BaseTrackType_Item.BaseTrackType_Button {
  min-width: 31px;
  --height: 31px;
  padding: 0;
  --type-back-opac: 0;
}
.BaseTrackType_Icon {
  pointer-events: none;
  font-size: 28px;
  line-height: 29px;
  /* width: 27px; */
  margin-right: -1px;
}
.BaseTrackType_Small .BaseTrackType_Icon {
  pointer-events: none;
  font-size: 26px;
  line-height: 26px;
  /* width: 25px; */
}
.BaseTrackType_Icon .TdIconCondPerc {
  margin-left: 1px;
  font-size: 11px;
  /* opacity: 0.8; */
}
.Main_OptionsTrackset .BaseTrackType_Item {
  flex-direction: column;
}
.BaseTrackType_Label {
  /* transition-duration: 0.12s;
  transition-timing-function: linear; */
  line-height: 1;
  /* margin-top: -1em; */
  /* position: absolute; */
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: -5px;
  pointer-events: none;
}
/* .Main_OptionsTrackset .Main_CustomTrackItem:hover .BaseTrackType_Label,
.Main_OptionsTrackset .Main_CustomTrackItem:focus-within .BaseTrackType_Label {
} */
.Main_OptionsTrackset .Main_CustomTrackItem .TdIconCondRel {
  /* transition-duration: 0.12s;
  transition-timing-function: linear; */
  bottom: 2px;
}
/* .Main_OptionsTrackset .Main_CustomTrackItem:hover .TdIconCondRel,
.Main_OptionsTrackset .Main_CustomTrackItem:focus-within .TdIconCondRel {
} */
.Main_CustomTrackItem .TdIconCondPercGroup {
  transition-duration: 0.12s;
  transition-timing-function: linear;
  opacity: 1;
}
.Main_CustomTrackItem:not(:hover) .BaseTrackType_Item:not(.BaseTrackType_Active) .TdIconCondPercGroup {
  opacity: 0;
  margin-top: -9px;
}
.BaseTrackType_Button.Type_A1 {
  background: linear-gradient(to right, rgba(var(--color-wet), 0.0), rgba(var(--color-wet), 0.2));
}
.BaseTrackType_Button.Type_B1 {
  background: linear-gradient(to right, rgba(var(--color-wet), 0.2), rgba(var(--color-wet), 0.0));
}
.BaseTrackType_Button.Type_C0 {
  background: linear-gradient(to right, rgba(var(--color-sand), 0.0), rgba(var(--color-sand), 0.2));
}
.BaseTrackType_Button.Type_D0 {
  background: linear-gradient(to right, rgba(var(--color-snow), 0.0), rgba(var(--color-snow), 0.2));
}
.BaseTrackType_Button.Type_E0 {
  background: linear-gradient(to right, rgba(var(--color-dirt), 0.0), rgba(var(--color-dirt), 0.2));
}
.BaseTrackType_Button.Type_A1,
.BaseTrackType_Button.Type_C0,
.BaseTrackType_Button.Type_D0,
.BaseTrackType_Button.Type_E0 {
  box-shadow: inset -24px 0px 0px 0px rgba(var(--ccond), 0.1);
}
.BaseTrackType_Button.Type_B1 {
  box-shadow: inset 24px 0px 0px 0px rgba(var(--ccond), 0.1);
}

.Type_A1 .path00:before,
.Type_B1 .path1:before,
.Type_C0 .path00:before,
.Type_D0 .path00:before,
.Type_E0 .path00:before {
  transition-duration: 0.12s;
}
.Main_CustomTrackItem:not(:hover) .Type_A1:not(.BaseTrackType_Active) .path00:before,
.Main_CustomTrackItem:not(:hover) .Type_B1:not(.BaseTrackType_Active) .path1:before,
.Main_CustomTrackItem:not(:hover) .Type_C0:not(.BaseTrackType_Active) .path00:before,
.Main_CustomTrackItem:not(:hover) .Type_D0:not(.BaseTrackType_Active) .path00:before,
.Main_CustomTrackItem:not(:hover) .Type_E0:not(.BaseTrackType_Active) .path00:before {
  color: rgba(var(--ccond), 0.8);
  opacity: 0.4;
}
</style>