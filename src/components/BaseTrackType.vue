<template>
  <div style="display: contents;">
    <button
      v-for="(type, itype) in resolvedList"
      :class="`Type_${type} `+
              `${circuit[type] === true ? 'BaseTrackType_Active ' : '' }`+
              `${isTrackSet && circuit[itype].active ? 'BaseTrackType_Active ' : '' }`"
      class="D_Button D_ButtonDark D_ButtonDark2 BaseTrackType_Button"
      @click="resolveToTrackObj(type, itype)">
      <span class="TypeText_Dry" v-if="type == '00'">{{ isTrackSet && circuit[itype].customName ? circuit[itype].customName : 'Dry' }}</span>
      <span class="TypeText_Dirt" v-else-if="type[0] == '1'">Dirt</span>
      <span class="TypeText_Gravel" v-else-if="type[0] == '2'">Gravel</span>
      <span class="TypeText_Ice" v-else-if="type[0] == '3'">Ice</span>
      <span class="TypeText_Sand" v-else-if="type[0] == '5'">Sand</span>
      <span class="TypeText_Snow" v-else-if="type[0] == '6'">Snow</span>
      <span class="TypeText_Grass" v-else-if="type[0] == '7'">Grass</span>
      <template v-else>
        <template v-if="type == 'e0'">
          <span class="TypeText_Sand">{{ 'Sand\n' }}</span>
          <span class="TypeText_Dirt">Dirt</span>
        </template>
        <template v-else>
          <span v-if="type !== '01'" class="TypeText_Dry">Aspht</span>
          <span class="TypeText_Dirt" v-if="type == '40'">{{ '\nDirt' }}</span>
          <span class="TypeText_Gravel" v-else-if="type == 'b0'">{{ '\nGravel' }}</span>
          <span class="TypeText_Sand" v-else-if="type == 'c0'">{{ '\nSand' }}</span>
          <span class="TypeText_Snow" v-else-if="type == 'd0'">{{ '\nSnow' }}</span>
          <span class="TypeText_Dirt" v-else-if="type == '41'">{{ ' Dirt' }}</span>
          <span class="TypeText_Sand" v-else-if="type == 'c1'">{{ ' Sand' }}</span>
        </template>
      </template>
      <span class="TypeText_Wet" v-if="type[1] == '1'"><br v-if="type !== '01'">Wet</span>
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
    }
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
    resolveToTrackObj(type, itype) {
      if (this.isTrackSet) {
        this.$emit('toggleTrackSet', this.circuit[itype].tracks);
      } else {
        this.$emit('toggleTrack', `${this.circuit.id}_a${type}`);
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
.TypeText_Dry {
  color: rgb(var(--color-dry))
}
.TypeText_Wet {
  color: rgb(var(--color-wet))
}
.TypeText_Dirt {
  color: rgb(var(--color-dirt))
}
.TypeText_Gravel {
  color: rgb(var(--color-gravel))
}
.TypeText_Ice {
  color: rgb(var(--color-ice))
}
.TypeText_Sand {
  color: rgb(var(--color-sand))
}
.TypeText_Snow {
  color: rgb(var(--color-snow))
}
.TypeText_Grass {
  color: rgb(var(--color-grass))
}
</style>