<template>
  <div style="display: contents;">
    <button
      v-for="(type, itype) in resolvedList"
      :class="`Type_${type} `+
              `${circuit[type] === true && mode === 'compare' ? 'BaseTrackType_Active ' : '' }`+
              `${isTrackSet && circuit[itype].active ? 'BaseTrackType_Active ' : '' }`"
      class="D_Button D_ButtonDark D_ButtonDark2 BaseTrackType_Button"
      @click="resolveToTrackObj(type, itype, $event)">
      <span class="TypeText_Dry" v-if="type == '00'">{{ $t('s_dry') }}{{ isTrackSet && circuit[itype].customSufix ? ` ${circuit[itype].customSufix}` : '' }}</span>
      <span class="TypeText_Dirt" v-else-if="type[0] == '1'">{{ $t('s_dirt') }}</span>
      <span class="TypeText_Gravel" v-else-if="type[0] == '2'">{{ $t('s_gravel') }}</span>
      <span class="TypeText_Ice" v-else-if="type[0] == '3'">{{ $t('s_ice') }}</span>
      <span class="TypeText_Sand" v-else-if="type[0] == '5'">{{ $t('s_sand') }}</span>
      <span class="TypeText_Snow" v-else-if="type[0] == '6'">{{ $t('s_snow') }}</span>
      <span class="TypeText_Grass" v-else-if="type[0] == '7'">{{ $t('s_grass') }}</span>
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
      </template>
      <span class="TypeText_Wet" v-if="type[1] == '1'"><br v-if="type !== '01'">{{ $t('s_wet') }}</span>
      </button>
  </div>
</template>

<script>
export default {
  name: 'BaseTrackType',
  components: {},
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
.D_Button.BaseTrackType_Button {
  font-size: 11px;
  line-height: 1.1;
  white-space: pre-line;
  padding: 2px 6px;
  min-width: 39px;
  display: block;
}
.Main_CustomTrackItem .D_Button.BaseTrackType_Active {
  box-shadow: inset 0px 0px 0px 2px currentColor;
  --type-back-opac: 0.0;
}
</style>