<template functional>
  <div v-if="props.car && props.car.rid" class="BaseCardMini_CarButton" :class="`BaseCardMini_Car${props.car.class}`">
    <div class="BaseCardMini_CarCard">
      <div class="BaseCardMini_BankPhoto">
        <img :src="props.car.photo" :key="props.car.rid" class="BaseCardMini_BankPhotoImg" alt="" loading="lazy">
      </div>
      <div class="BaseCardMini_Floats">
        <div class="BaseCardMini_Float">{{ props.car.rq }}</div>
        <!-- <div :class="`BaseCardMini_FloatTune${props.tuneText}`" class="BaseCardMini_FloatsRight">
          <div class="BaseCardMini_Float BaseCardMini_FloatTune">{{ props.tuneText }}</div>
        </div> -->
        <div :class="`BaseCardMini_FloatTune${props.tuneText}`" class="BaseCardMini_FloatsRight">
          <div class="BaseCardMini_FloatTuneLine" />
          <div class="BaseCardMini_FloatTuneLine" />
          <div class="BaseCardMini_FloatTuneLine" />
          <div class="BaseCardMini_Float BaseCardMini_FloatTune">{{ props.tuneText }}</div>
        </div>
      </div>
      
    </div>
  </div>
  <div v-else class="BaseCardMini_CarButton BaseCardMini_BankPhoto BaseCardMini_Empty"></div>
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
.BaseCardMini_CarS { --color: var(--cS) }
.BaseCardMini_CarA { --color: var(--cA) }
.BaseCardMini_CarC { --color: var(--cC) }
.BaseCardMini_CarD { --color: var(--cD) }
.BaseCardMini_CarB { --color: var(--cB) }
.BaseCardMini_CarE { --color: var(--cE) }
.BaseCardMini_CarF { --color: var(--cF) }
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
  font-weight: bold;
  line-height: 1.2;
  padding: 2px 2px 1px 2px;
  font-size: 14px;
  border-radius: 0px 3px;
  color: var(--color);
  background-color: #2f2f2f;
}
.BaseCardMini_Floats {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
}
.BaseCardMini_FloatsRight {
  display: flex;
  flex-grow: 1;
  /* font-size: 12px; */
  /* justify-content: flex-end; */
  align-items: end;
  background-color: #2f2f2f;
  align-self: end;
  padding: 3px;
  gap: 3px;
}
/* .BaseCardMini_FloatTune323 {
  justify-content: center;
}
.BaseCardMini_FloatTune332 {
  justify-content: flex-start;
} */
.BaseCardMini_FloatTune {
  display: none;
}
.BaseCardMini_FloatTuneLine {
  background-color: #5f5f5f;
  height: 3px;
  flex-grow: 1;
}
.BaseCardMini_FloatTune332 .BaseCardMini_FloatTuneLine:nth-child(1) {
  background-color: var(--color);
}
.BaseCardMini_FloatTune323 .BaseCardMini_FloatTuneLine:nth-child(2) {
  background-color: var(--color);
}
.BaseCardMini_FloatTune233 .BaseCardMini_FloatTuneLine:nth-child(3) {
  background-color: var(--color);
}
.BaseCardMini_CarF .BaseCardMini_FloatTuneLine {
  --color: #ddd;
}
.BaseCardMini_FloatsRight:not(.BaseCardMini_FloatTune332):not(.BaseCardMini_FloatTune323):not(.BaseCardMini_FloatTune233) .BaseCardMini_FloatTuneLine {
  display: none;
}
.BaseCardMini_FloatsRight:not(.BaseCardMini_FloatTune332):not(.BaseCardMini_FloatTune323):not(.BaseCardMini_FloatTune233) {
  padding: 0;
  background-color: transparent;
  justify-content: flex-end;
}
.BaseCardMini_FloatsRight:not(.BaseCardMini_FloatTune332):not(.BaseCardMini_FloatTune323):not(.BaseCardMini_FloatTune233) .BaseCardMini_FloatTune {
  display: flex;
  border-radius: 3px 0px;
}
.BaseCardMini_Empty {
  background-color: #ffffff0a;
}
</style>