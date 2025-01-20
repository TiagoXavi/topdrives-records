<template>
  <button class="D_Button BaseBrakeDialog_Button" @click="$store.commit('OPEN_BRAKES');">
    <i class="ticon-question-circle BaseBrakeDialog_Icon" aria-hidden="true"/>
  </button>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseBrakeDialog',
  components: {
    // BaseDetalheHeader
  },
  props: {
    test: {
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
  computed: {},
  methods: {},
}
</script>

<style>
.BaseBrakeDialog_Button {
  min-width: unset;
  min-height: unset;
  font-size: 0.9em;
  transform: translateY(-1px);
  margin-left: 5px;
  color: #777;
}
.BaseBrakeDialog_Icon {

}
</style>