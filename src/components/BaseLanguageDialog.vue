<template>
  <BaseDialog
    :active="active"
    :transparent="false"
    :lazy="true"
    max-width="460px"
    min-width="240px"
    @close="$emit('close')">
    <div style="position: relative;">
      <div class="Main_DialogTitle">{{ $t("m_language") }}</div>

      <div class="BaseLanguageDialog_FlagsBox">
        <template v-for="(item, ix) in langs">
          <BaseChip
            v-model="$i18n.locale"
            class="BaseChip_ChipFlag BaseChip_ChipFlag"
            :value="item"
            required
            @click="changedLanguage(item)" >
            <BaseFlag style="width: 46px;" :flag="item.toUpperCase()" />
          </BaseChip>
        </template>
      </div>

    </div>
  </BaseDialog>
</template>

<script>
import BaseFlag from './BaseFlag.vue'
import BaseChip from './BaseChip.vue'
import BaseDialog from './BaseDialog.vue';

export default {
  name: 'BaseLanguageDialog',
  components: {
    BaseDialog,
    BaseFlag,
    BaseChip
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      langs: []
    }
  },
  watch: {},
  beforeMount() {
    let vm = this;
    vm.langs = [];

    Object.keys(this.$i18n._vm.messages).forEach(key => {
      vm.langs.push(key)
    })
  },
  mounted() {},
  computed: {},
  methods: {
    changedLanguage(newLanguage) {
      window.localStorage.setItem('language', newLanguage);
    }
  },
}
</script>

<style>
.BaseLanguageDialog_FlagsBox {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 61px));
  gap: 15px;
  justify-content: center;
}
</style>