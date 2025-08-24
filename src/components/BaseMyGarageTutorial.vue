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
        <button
          class="D_Button D_ButtonDark D_ButtonDark2 BaseMyGarageTutorial_MainButton"
          @click="changeScreen('iosAlone');">
          <i class="brand-apple BaseMyGarageTutorial_MainButtonIcon" aria-hidden="true" style="margin-bottom: 7px;"/>
          <span class="BaseMyGarageTutorial_ButtonLabel">iOS</span>
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
          <img src="/assets/tutorial/http_android.png" alt="">
        </div>
        <div>5. Accept the VPN request. You should see 2 checks like in this:</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/http_android_2.png" alt="" style="max-width: 256px;">
        </div>
        <div>6. Open Top Drives, log to your account until you reach home screen of the game.</div>
        <div>7. On HTTP Toolkit, go to View and filter requests by /api/game/v3/sync/</div>
        <div>8. Click on the request. At the right window look for the Response Body. Copy all the content.</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/http_request.png" alt="" style="max-width: 100%;">
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
          <img src="/assets/tutorial/http_request.png" alt="" style="max-width: 100%;">
        </div>
        <div>6. Paste the content below. Done.</div>
      </div>
    </div>
    <div v-else-if="screen === 'iosAlone'" :class="{ MainTimeline_InitAnimation: animation }" class="BaseMyGarageTutorial_Screen1">
      <div class="BaseMyGarageTutorial_Title">
        <button class="D_Button BaseMyGarageTutorial_BackButton" @click="changeScreen('home');">
          <i class="ticon-arrow_left_2 BaseMyGarageTutorial_BackIcon" aria-hidden="true"/>
        </button>
        iOS
      </div>
      <div class="BaseMyGarageTutorial_Topics">
        <div>1. Download, install and open <a href="https://apps.apple.com/app/proxyman-network-debug-tool/" target="_blank" rel="noopener noreferrer">Proxyman</a> for iOS.</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_0.png" alt="" style="max-width: 100%;">
        </div>
        <div>2. Start Capturing</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_1.png" alt="" style="max-width: 100%;">
        </div>
        <div>3. Install VPN Extension, then Start VPN</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_2.png" alt="" style="max-width: 100%;">
        </div>
        <div>4. Init the steps to install the certificate</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_3.png" alt="" style="max-width: 100%;">
        </div>
        <div>5. Tap to open the URL on Safari, don't work on other browser</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_4.png" alt="" style="max-width: 100%;">
        </div>
        <div>6. Allow the download</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_5.png" alt="" style="max-width: 100%;">
        </div>
        <div>7. Close the confirmation, go back to Proxyman</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_6.png" alt="" style="max-width: 100%;">
        </div>
        <div>8. Open iOS Settings</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_7.png" alt="" style="max-width: 100%;">
        </div>
        <div>9. General > VPN & Device Management</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_8.png" alt="" style="max-width: 100%;">
        </div>
        <div>10. Select the downloaded profile</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_9.png" alt="" style="max-width: 100%;">
        </div>
        <div>11. Install it</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_10.png" alt="" style="max-width: 100%;">
        </div>
        <div>12. Now go to General > About</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_11.png" alt="" style="max-width: 100%;">
        </div>
        <div>13. Certificate Trust Settings</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_12.png" alt="" style="max-width: 100%;">
        </div>
        <div>14. Enable full trust</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_13.png" alt="" style="max-width: 100%;">
        </div>
        <div>15. Go back to Proxyman, if everything done correctly, it should be like this</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_14.png" alt="" style="max-width: 100%;">
        </div>
        <div>16. Go to More > SSL Proxying List > New Include Entry</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_15.png" alt="" style="max-width: 100%;">
        </div>
        <div>17. Type www.topdrives.io and confirm</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_16.png" alt="" style="max-width: 100%;">
        </div>
        <div>18. Should be like this</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_17.png" alt="" style="max-width: 100%;">
        </div>
        <div>19. Close Top Drives app if it is open. Open again, log to your account until you reach home screen of the game. Proxyman should be intercepting all the requests now.</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_18.png" alt="" style="max-width: 100%;">
        </div>
        <div>20. Go back to Proxyman. Go to Home, filter requests by "drives" to see only Top Drives requests</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_19.png" alt="" style="max-width: 100%;">
        </div>
        <div>21. Find the request with /api/game/v3/sync/ - should be the GET with the highest size. Select and go to Response tab</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_20.png" alt="" style="max-width: 100%;">
        </div>
        <div>22. View Body</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_21.png" alt="" style="max-width: 100%;">
        </div>
        <div>23. Copy</div>
        <div class="BaseMyGarageTutorial_TopicImage">
          <img src="/assets/tutorial/proxyman_22.png" alt="" style="max-width: 100%;">
        </div>
        <div>24. Paste below. Done.</div>
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