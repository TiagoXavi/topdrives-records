<template>
  <div class="BaseTypeName_Layout">
    <span class="TypeText_Dirt" v-if="type[0] == '1'">{{ $t('s_dirt') }}</span>
    <span class="TypeText_Gravel" v-else-if="type[0] == '2'">{{ $t('s_gravel') }}</span>
    <span class="TypeText_Ice" v-else-if="type[0] == '3'">{{ $t('s_ice') }}</span>
    <span class="TypeText_Sand" v-else-if="type[0] == '5'">{{ $t('s_sand') }}</span>
    <span class="TypeText_Snow" v-else-if="type[0] == '6'">{{ $t('s_snow') }}</span>
    <span class="TypeText_Grass" v-else-if="type[0] == '7'">{{ $t('s_grass') }}</span>
    <template v-else>
      <template v-if="type == 'e0'">
        <span class="TypeText_Sand">{{ $t('s_sand') }}</span>
        <span class="TypeText_Dirt">{{ $t('s_dirt') }}</span>
      </template>
      <template v-else-if="type == 'f0'">
        <span class="TypeText_Dry">{{ $t('s_aspht') }}</span>
        <span class="TypeText_Grass">{{ $t('s_grass') }}</span>
        <span class="TypeText_Dirt">{{ $t('s_dirt') }}</span>
      </template>
      <template v-else-if="type == 'g0'">
        <span class="TypeText_Ice">{{ $t('s_ice') }}</span>
        <span class="TypeText_Snow">{{ $t('s_snow') }}</span>
      </template>
      <template v-else>
        <span v-if="type !== '01' && (showDry || type !== '00')" class="TypeText_Dry">{{ $t('s_aspht') }}</span>
        <span class="TypeText_Dirt" v-if="type == '40'">{{ $t('s_dirt') }}</span>
        <span class="TypeText_Gravel" v-else-if="type == 'b0'">{{ $t('s_gravel') }}</span>
        <span class="TypeText_Sand" v-else-if="type == 'c0'">{{ $t('s_sand') }}</span>
        <span class="TypeText_Snow" v-else-if="type == 'd0'">{{ $t('s_snow') }}</span>
        <span class="TypeText_Dirt" v-else-if="type == '41'">{{ $t('s_dirt') }}</span>
        <span class="TypeText_Sand" v-else-if="type == 'c1'">{{ $t('s_sand') }}</span>
      </template>
    </template>
    <span class="TypeText_Wet" v-if="type[1] == '1'">{{ $t('s_wet') }}</span>
  </div>
</template>

<script>

export default {
  name: 'BaseTypeName',
  components: {},
  props: {
    type: {
      type: String,
      default: "00"
    },
    showDry: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
.BaseTypeName_Layout {
  display: contents;
}
</style>