<template>
  <div class="TTT_Layout">
    <div class="TTT_Box MainTemplateGuidelines_Box">
      <div class="MainTemplateGuidelines_Title">Template Guidelines</div>
      <div class="MainTemplateGuidelines_Sub">Join the TDR Discord server to talk about improvement of your template or why your template has been declined.</div>
      <ol>
        <li class="MainTemplateGuidelines_Topic">Your template should have a context for cars that make sense. Like same tag, same country, same tires, same brand, same class... Or any context like Hutch does as requirements for events/challenges.</li>
        <li class="MainTemplateGuidelines_Topic">You should put all cars available for that context or at least try to add all. Don't put only cars that you have.</li>
        <li class="MainTemplateGuidelines_Topic">The template should compare cars with similar stats. Don't make sense comparing a RWD Perf with 4WD All-surface on dry asphalt tracks.</li>
        <li class="MainTemplateGuidelines_Topic">Only mix on road tracks with off road tracks if there is a reason for that.</li>
        <li class="MainTemplateGuidelines_Topic">Don't need to put all tracks available in the game. The app will have performance issues.</li>
        <li class="MainTemplateGuidelines_Topic">Try to sort tracks by type like grouping drag tracks and same surface tracks.</li>
        <li class="MainTemplateGuidelines_Topic">Try to sort cars by RQ (high first) or by performance on selected tracks.</li>
        <li class="MainTemplateGuidelines_Topic">The template don't need to have all times filled, but you could fill what you can before submit.</li>
        <li class="MainTemplateGuidelines_Topic">Use a descriptive title.</li>
        <li class="MainTemplateGuidelines_Topic">Take a look if already exists a template for the same purpose as yours.</li>
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