<template functional>
  <button
    class="D_Button D_ButtonDark D_ButtonDark2 BaseCardMiniButton_B"
    @click="listeners.click()">
    <BaseCardMini
      :car="props.car"
      :tuneText="props.tuneText"
    />
  </button>
</template>

<script>

export default {
  name: 'BaseCardMiniButton',
  functional: true,
  props: {
    car: {},
    tuneText: {},
  },
  methods: {},
}
</script>

<style>
.BaseCardMiniButton_B {
  padding: 2px;
}
</style>