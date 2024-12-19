<template>
  <div class="BaseMyGarageTutorial_Layout">
    <div v-if="screen === 'home'" :class="{ MainTimeline_InitAnimation: animation }" class="BaseMyGarageTutorial_Screen1">
      <div class="BaseMyGarageTutorial_Title">Need help?</div>
      <div class="BaseMyGarageTutorial_Dual D_Center2">
        <button
          class="D_Button D_ButtonDark D_ButtonDark2 BaseMyGarageTutorial_MainButton"
          @click="changeScreen('android');">
          <i class="brand-android BaseMyGarageTutorial_MainButtonIcon" aria-hidden="true"/>
          <span class="BaseMyGarageTutorial_ButtonLabel">PC + Android emulator</span>
        </button>
        <button
          class="D_Button D_ButtonDark D_ButtonDark2 BaseMyGarageTutorial_MainButton"
          @click="changeScreen('ios');">
          <i class="brand-apple BaseMyGarageTutorial_MainButtonIcon" aria-hidden="true" style="margin-bottom: 7px;"/>
          <span class="BaseMyGarageTutorial_ButtonLabel">PC + iOS</span>
        </button>
      </div>
    </div>
    <div v-else-if="screen === 'android'" :class="{ MainTimeline_InitAnimation: animation }" class="BaseMyGarageTutorial_Screen1">
      <div class="BaseMyGarageTutorial_Title">
        <button class="D_Button BaseMyGarageTutorial_BackButton" @click="changeScreen('home');">
          <i class="ticon-arrow_left_2 BaseMyGarageTutorial_BackIcon" aria-hidden="true"/>
        </button>
        PC + Android emulator
      </div>
      <div class="BaseMyGarageTutorial_Topics">
        <div>1. Download and install <a href="https://httptoolkit.com/" target="_blank" rel="noopener noreferrer">HTTP Toolkit</a>.</div>
        <div>2. Download and install <a href="https://bignox.com/" target="_blank" rel="noopener noreferrer">Nox Android Emulator</a>. Pay attention while installing. Reject every ad software. Can be any other android emulator since it opens default ADB port.</div>
        <div>3. Open Nox, download Top Drives (don't open it yet), log-in on Facebook if your Top Drives account needs it.</div>
        <div>4. Open HTTP Toolkit. Go to Intercept, the option below should be available. Click on it to intercept Nox.</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="@/assets/tutorial/http_android.png" alt="">
        </div>
        <div>5. Accept the VPN request. You should see 2 checks like in this:</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="@/assets/tutorial/http_android_2.png" alt="" style="max-width: 256px;">
        </div>
        <div>6. Open Top Drives, log to your account until you reach home screen of the game.</div>
        <div>7. On HTTP Toolkit, go to View and filter requests by /api/game/v3/sync/</div>
        <div>8. Click on the request. At the right window look for the Response Body. Copy all the content.</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="@/assets/tutorial/http_request.png" alt="" style="max-width: 100%;">
        </div>
        <div>9. Paste the content below. Done.</div>
      </div>
    </div>
    <div v-else-if="screen === 'ios'" :class="{ MainTimeline_InitAnimation: animation }" class="BaseMyGarageTutorial_Screen1">
      <div class="BaseMyGarageTutorial_Title">
        <button class="D_Button BaseMyGarageTutorial_BackButton" @click="changeScreen('home');">
          <i class="ticon-arrow_left_2 BaseMyGarageTutorial_BackIcon" aria-hidden="true"/>
        </button>
        PC + iOS
      </div>
      <div class="BaseMyGarageTutorial_Topics">
        <div>1. Download and install <a href="https://httptoolkit.com/" target="_blank" rel="noopener noreferrer">HTTP Toolkit</a>.</div>
        <div>2. Follow those instructions <a href="https://httptoolkit.com/docs/guides/ios/" target="_blank" rel="noopener noreferrer">Intercepting iOS HTTP</a></div>
        <div>3. Open Top Drives, log to your account until you reach home screen of the game.</div>
        <div>4. On HTTP Toolkit, go to View and filter requests by /api/game/v3/sync/</div>
        <div>5. Click on the request. At the right window look for the Response Body. Copy all the content.</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="@/assets/tutorial/http_request.png" alt="" style="max-width: 100%;">
        </div>
        <div>6. Paste the content below. Done.</div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/fonts/brands/style.css';

export default {
  name: 'BaseMyGarageTutorial',
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
    return {
      screen: "home",
      animation: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    changeScreen(screen) {
      this.animation = true;
      this.screen = '_';
      this.$nextTick().then(() => {
        this.screen = screen;
      })
    },
  },
}
</script>

<style>
.BaseMyGarageTutorial_Layout {
  padding: 0 10px;
}
.BaseMyGarageTutorial_MainButton {
  flex-direction: column;
  width: 120px;
  height: 100px;
}
.BaseMyGarageTutorial_MainButtonIcon {
  font-size: 30px;
}
.BaseMyGarageTutorial_Topics {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.BaseMyGarageTutorial_Title {
  text-align: center;
  font-size: 30px;
  margin: 30px 20px;
  position: relative;
}
.BaseMyGarageTutorial_BackButton {
  position: absolute;
  top: 0;
  left: -30px;
}
</style>