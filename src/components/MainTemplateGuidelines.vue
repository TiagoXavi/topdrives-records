<template>
  <div class="TTT_Layout">
    <div class="TTT_Box MainTemplateGuidelines_Box">
      <div class="MainTemplateGuidelines_Title">{{ $t("m_templateGuide") }}</div>
      <div class="MainTemplateGuidelines_Sub">{{ $t("g_joinDiscord") }}</div>
      <ol>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule0") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule1") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule2") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule3") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule4") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule5") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule6") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule7") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule8") }}</li>
        <li class="MainTemplateGuidelines_Topic">{{ $t("g_rule9") }}</li>
      </ol>
    </div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'MainTemplateGuidelines',
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
.MainTemplateGuidelines_Title {
  text-align: center;
  color: rgb(var(--d-text-yellow));
  margin-bottom: 30px;
  font-size: 24px;
}
.MainTemplateGuidelines_Sub {
  text-align: center;
  font-size: 16px;
  background-color: #a9904129;
  box-shadow: inset 0px 0px 0px 2px #ffe39417;
  padding: 8px 10px;
  border-radius: 10px;
  margin: 0 30px 30px 30px;
  color: #cdc2a3;
}
.MainTemplateGuidelines_Box {
  max-width: 600px;
  padding: 30px;
}
.MainTemplateGuidelines_Topic:not(:last-child) {
  margin-bottom: 20px;
}
</style>