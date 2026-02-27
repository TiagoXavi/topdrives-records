<template functional>
  <div class="BaseBestTune_">
    <div class="BaseBestTune_Item BaseBestTune_Text">{{ props.tune }}</div>
    <div class="BaseBestTune_Item BaseBestTune_Blocks">
      <div :class="{ 'BaseBestTune_T': props.tune === '332' }" class="BaseBestTune_D" />
      <div :class="{ 'BaseBestTune_T': props.tune === '323' }" class="BaseBestTune_D" />
      <div :class="{ 'BaseBestTune_T': props.tune === '233' }" class="BaseBestTune_D" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseBestTune',
  functional: true,
  props: {
    tune: ""
  },
}
</script>

<style>
.BaseBestTune_Item {
  width: 3ch;
  text-align: center;
}
.BaseBestTune_Blocks {
  display: flex;
  gap: 3px;
  pointer-events: none;
  margin-top: -1em;
}
.BaseBestTune_D {
  height: 1em;
  background-color: #555;
  flex-grow: 1;
}
.BaseBestTune_Text {
  position: relative;
  opacity: 0;
  height: 1em;
}
.BaseBestTune_HoverAction:hover .BaseBestTune_Text {
  opacity: 1;
}
.BaseBestTune_HoverAction:hover .BaseBestTune_Text + .BaseBestTune_Blocks {
  opacity: 0;
}
.BaseBestTune_T {
  background-color: rgb(var(--d-text-yellow));
}
</style>