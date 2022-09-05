<template>
  <div class="BaseTypeName_Layout">
    <span class="TypeText_Dirt" v-if="type[0] == '1'">Dirt</span>
    <span class="TypeText_Gravel" v-else-if="type[0] == '2'">Gravel</span>
    <span class="TypeText_Ice" v-else-if="type[0] == '3'">Ice</span>
    <span class="TypeText_Sand" v-else-if="type[0] == '5'">Sand</span>
    <span class="TypeText_Snow" v-else-if="type[0] == '6'">Snow</span>
    <span class="TypeText_Grass" v-else-if="type[0] == '7'">Grass</span>
    <template v-else>
      <template v-if="type == 'e0'">
        <span class="TypeText_Sand">Sand</span>
        <span class="TypeText_Dirt">Dirt</span>
      </template>
      <template v-else>
        <span v-if="type !== '01'" class="TypeText_Dry">Aspht</span>
        <span class="TypeText_Dirt" v-if="type == '40'">Dirt</span>
        <span class="TypeText_Gravel" v-else-if="type == 'b0'">Gravel</span>
        <span class="TypeText_Sand" v-else-if="type == 'c0'">Sand</span>
        <span class="TypeText_Snow" v-else-if="type == 'd0'">Snow</span>
        <span class="TypeText_Dirt" v-else-if="type == '41'">Dirt</span>
        <span class="TypeText_Sand" v-else-if="type == 'c1'">Sand</span>
      </template>
    </template>
    <span class="TypeText_Wet" v-if="type[1] == '1'">Wet</span>
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
    }
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