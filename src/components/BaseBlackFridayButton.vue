<template>
  <div class="BaseBlackFridayButton_Layout">
    <button class="D_Button BaseBlackFridayButton_Box" @click="dialog = true;">
      <div v-if="number === 0" class="BaseBlackFridayButton_BlackLogo">
        <div class="BaseBlackFridayButton_BlackText">BLACK</div>
        <div class="BaseBlackFridayButton_BlackText">FRIDAY</div>
      </div>
      <div v-else-if="number === 1" class="BaseBlackFridayButton_80Logo">
        <div class="BaseBlackFridayButton_80Text">80%</div>
        <div class="BaseBlackFridayButton_80Sub">OFF</div>
      </div>
      <div v-else-if="number === 2" class="BaseBlackFridayButton_BlackLogo">
        <div class="BaseBlackFridayButton_BlackText">JOIN</div>
        <div class="BaseBlackFridayButton_BlackText">NOW!</div>
      </div>
      <!-- <div v-else-if="number === 2" class="BaseBlackFridayButton_1Logo">
        <div class="BaseBlackFridayButton_1Text">$1<span>,00</span></div>
      </div> -->
    </button>
    <BaseDialog
      :active="dialog"
      :transparent="false"
      :disableScroll="false"
      :lazy="true"
      max-width="700px"
      min-width="240px"
      zindex="101"
      @close="dialog = false;">
      <div class="BaseBlackFridayButton_DialogBody">
        <div class="BaseBlackFridayButton_DialogLayout">
          <div class="BaseBlackFridayButton_BlackLogo BaseBlackFridayButton_BlackLogoInner">
            <div class="BaseBlackFridayButton_BlackText">BLACK</div>
            <div class="BaseBlackFridayButton_BlackText">FRIDAY</div>
          </div>
          <div class="BaseBlackFridayButton_2">Get 80% off your first month. All discount codes work with all tiers.</div>
          <div class="BaseBlackFridayButton_VideoBox">
            <video class="BaseBlackFridayButton_Video" height="380px;" loop="" controls autoplay="" muted="" @fullscreenchange="switchToHd()" webkit-playsinline playsinline>
              <source src="https://tdrvideos.s3.us-east-1.amazonaws.com/Black2025.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="BaseBlackFridayButton_3_box">
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-correct_1" style="font-size: 22px; color: var(--t5);" aria-hidden="true"/>
              <span>Support TDR project</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t5);" aria-hidden="true"/>
              <span style="color: var(--t5);">T5: </span>
              <span>Highlighted name</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t4);" aria-hidden="true"/>
              <span style="color: var(--t4);">T4: </span>
              <span>Compare best of</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t3);" aria-hidden="true"/>
              <span style="color: var(--t3);">T3: </span>
              <span>Events best cars</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t3);" aria-hidden="true"/>
              <span style="color: var(--t3);">T3: </span>
              <span>Events RQ savers</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t3);" aria-hidden="true"/>
              <span style="color: var(--t3);">T3: </span>
              <span>Upcoming events</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t2);" aria-hidden="true"/>
              <span style="color: var(--t2);">T2: </span>
              <span>Hand ranking</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t2);" aria-hidden="true"/>
              <span style="color: var(--t2);">T2: </span>
              <span>Custom tunes</span>
            </div>
            <div class="BaseBlackFridayButton_3_item">
              <i class="ticon-crown" style="font-size: 22px; color: var(--t2);" aria-hidden="true"/>
              <span style="color: var(--t2);">T2: </span>
              <span>Charts</span>
            </div>
          </div>
          <div class="BaseBlackFridayButton_4_layout">
            <div class="BaseBlackFridayButton_4_box">
              <div class="BaseBlackFridayButton_4_title">60% OFF</div>
              <div class="BaseBlackFridayButton_4_code">BLACK60</div>
              <div class="BaseBlackFridayButton_4_sub">First month</div>
            </div>
            <div class="BaseBlackFridayButton_4_box">
              <div class="BaseBlackFridayButton_4_title">70% OFF</div>
              <div class="BaseBlackFridayButton_4_code">BLACK70</div>
              <div class="BaseBlackFridayButton_4_sub">First month</div>
            </div>
            <div class="BaseBlackFridayButton_4_box">
              <div class="BaseBlackFridayButton_4_title">80% OFF</div>
              <div class="BaseBlackFridayButton_4_code">BLACK80</div>
              <div class="BaseBlackFridayButton_4_sub">First month</div>
            </div>
          </div>
          <!-- <BaseDonateButton href="https://www.patreon.com/topdrivesrecords/membership" /> -->
          <a
            href="https://www.patreon.com/topdrivesrecords/membership"
            class="D_Button D_ButtonDark BaseBlackFridayButton_JoinButton"
            target="_blank"
            rel="noopener noreferrer">
            <div class="BaseBlackFridayButton_JoinLeft">
              <i class="ticon-crown BaseBlackFridayButton_Crown" aria-hidden="true"/>
            </div>
            <div class="BaseBlackFridayButton_JoinRight">
              <div class="BaseBlackFridayButton_JoinTop">Join now!</div>
              <div class="BaseBlackFridayButton_JoinBottom">Patreon</div>
            </div>
          </a>
        </div>
      </div>
    </BaseDialog>
    <div v-if="dialog" class="BaseBlackFridayButton_Ballons">
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="left: -140px; top: 250px; --factor: 1.0; --factor2: 1.0; animation-delay: 0s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="right: -90px; top: 100px; --factor: 0.9; --factor2: -0.9; animation-delay: 0.05s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="left: -70px; bottom: -80px; --factor: 0.8; --factor2: 0.2; animation-delay: 0.1s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="right: -140px; bottom: -100px; --factor: 1.0; --factor2: -1.3; animation-delay: 0.15s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="left: -80px; top: 50px; --factor: 0.7; --factor2: 1.1; animation-delay: 0.05s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="right: -80px; bottom: 10px; --factor: 1.3; --factor2: -0.8; animation-delay: 0.1s" :useMargin="false" type="baloon" />
    </div>
  </div>
</template>

<script>
import BaseDialog from './BaseDialog.vue'
import BaseIconSvg from './BaseIconSvg.vue'
import BaseDonateButton from './BaseDonateButton.vue'

export default {
  name: 'BaseBlackFridayButton',
  components: {
    BaseDialog,
    BaseIconSvg,
    BaseDonateButton
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      number: 0,
      max: 2,
      hdVideo: false
    }
  },
  watch: {},
  beforeMount() {
    this.number = Math.floor(Math.random() * (this.max + 1));
  },
  mounted() {},
  computed: {},
  methods: {
    switchToHd() {
      return;
      if (!this.hdVideo) {
        document.querySelector('.BaseBlackFridayButton_Video > source').setAttribute("src", "https://tdrvideos.s3.us-east-1.amazonaws.com/BlackFridayHD.mp4");
        let video = document.querySelector('.BaseBlackFridayButton_Video');
        let time = video.currentTime;
        video.load();
        video.currentTime = time;
        this.hdVideo = true;
      }
    }
  },
}
</script>

<style>
.BaseBlackFridayButton_Box {
  padding: 5px;
  font-size: 15px;
  height: 42px;
}
.BaseBlackFridayButton_BlackLogo {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: skewX(-10deg) rotate(-5deg);
}
.BaseBlackFridayButton_BlackText {
  font-family: 'Roboto Condensed';
  font-weight: 600;
  line-height: 0.9;
}
.BaseBlackFridayButton_BlackText:first-child {
  background-color: rgb(var(--d-text-yellow));
  color: #000;
  padding: 2px 8px 2px 8px;
  margin: -3px;
}
.BaseBlackFridayButton_BlackText:last-child {
  background-color: #000;
  color: rgb(var(--d-text-yellow));
  padding: 3px 12px;
  margin: -1px;
  margin-top: 2px;
}
.BaseBlackFridayButton_80Logo {
  display: flex;
  font-family: 'Roboto Condensed';
  font-weight: 600;
  transform: skewX(-10deg) rotate(-5deg);
  align-items: center;
  line-height: 1;
}
.BaseBlackFridayButton_80Text {
  font-size: 1.8em;
  color: rgb(var(--d-text-yellow));
  background-color: #000;
  padding: 5px 9px 5px 3px;
}
.BaseBlackFridayButton_80Sub {
  font-size: 1em;
  background-color: rgb(var(--d-text-yellow));
  color: #000;
  padding: 1px 3px 0px 3px;
  margin-bottom: 10px;
  margin-left: -5px;
}
.BaseBlackFridayButton_1Logo {
  display: flex;
  font-family: 'Roboto Condensed';
  font-weight: 600;
  transform: skewX(-10deg) rotate(-5deg);
  align-items: center;
  line-height: 1;
}
.BaseBlackFridayButton_1Text {
  font-size: 1.8em;
  color: rgb(var(--d-text-yellow));
  background-color: #000;
  padding: 5px 7px 5px 4px;
}
.BaseBlackFridayButton_1Text > span {
  letter-spacing: 0px;
  vertical-align: top;
  font-size: 0.6em;
  line-height: 1.4;
}
.BaseBlackFridayButton_Ballons {
  position: fixed;
  z-index: 200;
  width: 50%;
  height: 50%;
  left: 25%;
  top: 25%;
  pointer-events: none;
}
.BaseBlackFridayButton_Baloon {
  position: absolute;
  width: 90px;
  animation: bf_baloon2 3s linear forwards;
  animation-timing-function: ease-out;
  pointer-events: none;
  transform: scale(0);
  transform-origin: bottom left;
}
.BaseBlackFridayButton_Baloon:nth-child(odd) {
  transform-origin: bottom right;
}
@keyframes bf_baloon2 {
  0% {
    transform: scale(0);
  }
  5% {
    transform: scale(1);
  }
  80% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1);
    /* transform: scale(0); */
  }
}
.BaseBlackFridayButton_Baloon > div {
  animation: bf_baloon 3s linear forwards;
  /* transform: translateY(calc(100px * var(--factor) * 2)); */
  /* transform: scale(0); */
  /* transform: scale(1); */
  animation-delay: inherit;
  transform-origin: center;
  width: 100%;
}
@keyframes bf_baloon {
  0% {
    transform: translateY(calc(100px * var(--factor) * 2));
  }
  100% {
    transform: translateY(calc(-500px * var(--factor) * 2));
  }
}
.BaseBlackFridayButton_Baloon > div > svg {
  animation: bf_baloon3 2s linear forwards;
  animation-timing-function: ease-out;
  animation-delay: inherit;
}
@keyframes bf_baloon3 {
  0% {
    transform: translateX(calc(20px * var(--factor2) * 2));
  }
  100% {
    transform: translateX(calc(-60px * var(--factor2) * 2));
  }
}
.BaseBlackFridayButton_DialogLayout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
}
.BaseBlackFridayButton_BlackLogoInner {
  font-size: 45px;
  padding: 10px;
}
.BaseBlackFridayButton_2 {
  text-align: center;
}
.BaseBlackFridayButton_3_box {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.BaseBlackFridayButton_3 {
  margin-bottom: 5px;
}
.BaseBlackFridayButton_3_item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.BaseBlackFridayButton_Correct {
  color: rgb(var(--d-text-green));
}
.BaseBlackFridayButton_VideoBox {
  display: flex;
}
.BaseBlackFridayButton_Video {
  max-width: 100%;
}
.BaseBlackFridayButton_4_layout {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}
.BaseBlackFridayButton_4_box {
  
}
.BaseBlackFridayButton_4_title {
  text-align: center;
}
.BaseBlackFridayButton_4_code {
  font-size: 30px;
  padding: 9px 20px;
  border-radius: 10px;
  border-width: 2px;
  border-style: dashed;
  border-color: #959595;
  color: rgb(var(--d-text-yellow));
  font-weight: bold;
}
.BaseBlackFridayButton_JoinButton {
  width: 100%;
  max-width: 240px;
  padding: 12px 10px;
  gap: 7px;
  margin: 10px 0 20px 0;
}
.BaseBlackFridayButton_Crown {
  font-size: 38px;
}
.BaseBlackFridayButton_JoinTop {
  font-size: 24px;
}
.BaseBlackFridayButton_JoinBottom {
  font-size: 16px;
}
.BaseBlackFridayButton_4_sub {
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
}
.Main_LeftPlusTop:has(.BaseBlackFridayButton_DialogLayout) {
  z-index: 101;
}




@media only screen and (max-width: 767px) {
  .BaseBlackFridayButton_Baloon > div > svg {
    animation: bf_baloon4 2s linear forwards;
    /* animation: unset; */
    /* transform: translateX(calc(200px * var(--factor2) * 2)); */
  }
}
@keyframes bf_baloon4 {
  0% {
    transform: translateX(calc(40px * var(--factor2) * 2));
  }
  100% {
    transform: translateX(calc(-60px * var(--factor2) * 2));
  }
}
</style>