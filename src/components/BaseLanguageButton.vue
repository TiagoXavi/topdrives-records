<template>
  <span>
    <button
      class="D_Button Main_OptionsButton"
      @click="dialog = true;">
      <BaseFlag :flag="$i18n.locale.toUpperCase()" class="BaseLanguageButton_Flag" />
      <span>{{ $i18n.locale.toUpperCase() }}</span>
    </button>
    <BaseLanguageDialog
      v-model="dialog"
    />
  </span>
</template>

<script>
import BaseLanguageDialog from './BaseLanguageDialog.vue'
import BaseFlag from './BaseFlag.vue'

export default {
  name: 'BaseLanguageButton',
  components: {
    BaseLanguageDialog,
    BaseFlag
  },
  props: {},
  data() {
    return {
      dialog: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
.BaseLanguageButton_Flag {
  width: 20px;
  margin: -7px 5px -5px 0px;
}
</style>