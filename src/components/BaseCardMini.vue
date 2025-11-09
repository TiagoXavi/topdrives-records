<template functional>
  <button
    class="D_Button D_ButtonDark D_ButtonDark2 BaseCardMini_CarButton"
    @click="">
    <div class="BaseCardMini_CarCard" :style="`--color: ${props.car.color}`">
      <div class="BaseCardMini_BankPhoto">
        <img :src="props.car.photo" class="BaseCardMini_BankPhotoImg" alt="">
      </div>
      <div class="BaseCardMini_Float">{{ props.car.rq }}</div>
      <div
        :class="`BaseCardMini_FloatTune${props.tuneText}`"
        class="BaseCardMini_Float BaseCardMini_FloatTune">{{ props.tuneText }}</div>
    </div>
  </button>
</template>

<script>
export default {
  name: 'BaseCardMini',
  functional: true,
  props: {
    car: {},
    tuneText: {},
  },
  methods: {},
}
</script>

<style>
.D_Button.BaseCardMini_CarButton {
  padding: 2px;
  font-family: 'Roboto Condensed', sans-serif;
}
.D_Button.BaseCardMini_CarButton:active:not(.D_ButtonNoActive) {
  transform: translateY(0px);
}
.BaseCardMini_CarCard {
  position: relative;
}
.BaseCardMini_BankPhoto {
  display: flex;
  height: 42px;
  width: 68px;
  border-radius: 3px 3px 3px 3px;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
}
.BaseCardMini_BankPhotoImg {
  transform: scale(1.35) translateX(-5%) translateY(-8%);
  transform-origin: left;
}
.BaseCardMini_Float {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  color: #000;
  background-color: var(--color);
  font-weight: bold;
  line-height: 1;
  padding: 2px 2px 0px 2px;
  font-size: 12px;
  border-radius: 0px 4px;
}
.BaseCardMini_FloatTune {
  /* bottom: 0; */
  left: unset;
  right: 0;
  border-radius: 4px 0px;
}
.BaseCardMini_FloatTune332 {
  left: 0;
  right: unset;
  bottom: unset;
  top: 0;
  border-radius: 4px 0px;
}
.BaseCardMini_FloatTune323 {
  left: unset;
  right: 0;
  bottom: unset;
  top: 0;
  border-radius: 0px 4px 0px 4px;
}
</style>