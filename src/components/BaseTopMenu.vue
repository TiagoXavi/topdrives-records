<template>
  <div class="BaseTopMenu_Layout">
    <a class="BaseTopMenu_Left" :style="`--left-width: ${left_width}px`" @click="logoClick()">
      <Logo class="BaseTopMenu_Logo BaseTopMenu_LogoFull" />
      <Logo :compact="true" class="BaseTopMenu_Logo BaseTopMenu_LogoCompact" />
    </a>
    <div class="BaseTopMenu_Middle">
      <button
        v-for="item in menus"
        :key="item.name"
        :class="{
          BaseTopMenu_Active: $route.name === item.name || (item.name === 'Compare' && $route.name === 'Records' ),
          BaseTopMenu_New: item.new && showNew
        }"
        class="D_Button BaseTopMenu_Button"
        @click="$router.push({ name: item.name }); tabClick(item);">{{ item.label }}</button>
    </div>
    <div
      :style="`${ user && user.tier ? '--cor-hs: var(--t'+user.tier+'-hs); --cor-l: var(--t'+user.tier+'-l); --cor-l0: var(--t'+user.tier+'-l0);' : ''}`"
      class="BaseTopMenu_Right">
      <button
        class="BaseTopMenu_RightButton"
        @click="openMenuDialog()">
        <!-- <BaseUserCard v-if="user" :user="user"/> -->
        <div class="BaseTopMenu_RightBall">
          <i class="ticon-3menu BaseTopMenu_RightBallIcon BaseTopMenu_RightBallMenu" aria-hidden="true"/>
          <span v-if="letter" class="BaseTopMenu_RightBallLetter" aria-hidden="true">{{ letter }}</span>
          <i v-else class="ticon-user_3 BaseTopMenu_RightBallIcon" aria-hidden="true"/>
        </div>

      </button>
      
      <BaseTopMenuUserDialog
        :user="user"
        :active="menuDialog"
        :menus="menus"
        @openAdvancedOptions="openAdvancedOptions()"
        @openAbout="openAbout()"
        @close="closeMenuDialog()" />
      <BaseAboutDialog
        :user="user"
        :active="aboutDialog"
        @close="closeAbout()"/>
      <BaseDialog
        :active="optionsAdvancedDialog"
        :transparent="false"
        :disableScroll="true"
        max-width="400px"
        @close="closeAdvancedOptions()">
        <div class="Main_AdvancedDialogBox">
          <div class="Main_DialogTitle">{{ $t("m_options") }}</div>
          <BaseConfigCheckBox v-model="showDataFromPast" name="showDataFromPast" :label="$t('m_showDataFromPast')" />
          <BaseConfigCheckBox v-model="showCustomTunes" name="showCustomTunes" :label="$t('m_showCustomTunes')" />
          <BaseConfigCheckBox v-model="showOldTags" name="showOldTags" :label="$t('m_showOldTags')" />
          <BaseConfigCheckBox v-model="homePointsToggle" name="homePointsToggle" :label="`${$t('m_home')}: ${$t('m_homePointsToggle')}`"/>
          <BaseConfigCheckBox v-model="showPointsCgForce" name="showPointsCgForce" :label="`${$t('m_challenges')}: ${$t('m_showPointsCgForce')}`" @change="cgReCalcRound()" />
          <div v-if="isMobile" class="Main_SaveGalleryBox" style="margin-top: 15px;">
            <div class="Main_OptionsLabel">{{ $t("m_zoom") }}</div>
            <div class="Main_FilterChipsFlex" style="justify-content: flex-start;">
              <template v-for="(item, ix) in $store.state.zoomLevels">
                <BaseChip
                  v-model="zoomLevel"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                  required="true"
                  :value="item"
                  @click="$store.commit('CHANGE_ZOOM_LEVEL', $event)" />
              </template>
            </div>
          </div>
        </div>
      </BaseDialog>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue'
import BaseTopMenuUserDialog from './BaseTopMenuUserDialog.vue'
import BaseAboutDialog from './BaseAboutDialog.vue'
import BaseDialog from './BaseDialog.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'
import BaseUserCard from './BaseUserCard.vue'
import BaseChip from './BaseChip.vue'

export default {
  name: 'BaseTopMenu',
  components: {
    BaseTopMenuUserDialog,
    BaseAboutDialog,
    Logo,
    BaseDialog,
    BaseConfigCheckBox,
    BaseUserCard,
    BaseChip
  },
  props: {
    user: {
      required: true
    }
  },
  data() {
    return {
      unsubscribe: null,
      menus: [
        { label: "Compare", name: "Compare" },
        { label: "Challenges", name: "Challenges" },
        { label: "Events", name: "Events" },
        { label: "Clubs", name: "Clubs" },
        { label: "Charts", name: "MainCharts" },
        { label: "Packs", name: "Packs" },
        { label: "Community", name: "Community", new: true },
        { label: "Stuff", name: "Stuff" },
      ],
      showNew: true,
      menuDialog: false,
      aboutDialog: false,
      optionsAdvancedDialog: false,
      local_showDataFromPast: false,
      local_showCustomTunes: false,
      local_showOldTags: false,
      local_homePointsToggle: false,
      local_showPointsCgForce: true,
      local_zoomLevel: "100%",
      isMobile: false,
      left_width: 0,
      left_widthBig: 145,
      right_width: 0,
      all_width: 0,
      doc_width: 0,
      safe_margin: 40
    }
  },
  watch: {
    "$route.name": function () {
      this.menuDialog = false;
      this.aboutDialog = false;
      this.optionsAdvancedDialog = false;
    }
  },
  beforeMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.isMobile = Vue.options.filters.isMobile();

    this.localStorageRead("showDataFromPast");
    this.localStorageRead("showCustomTunes");
    this.localStorageRead("showOldTags");
    this.localStorageRead("homePointsToggle");
    this.localStorageRead("showPointsCgForce");
    this.localStorageRead("zoomLevel");

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.unsubscribe();
  },
  mounted() {
    let vm = this;
    this.checkNewMenu();

    // let top_layout = document.querySelector(".BaseTopMenu_Layout");
    // this.left_width = (document.querySelector(".BaseTopMenu_Left") || {}).offsetWidth;
    this.left_width = 55;
    this.right_width = 55;
    let menusTotal = 0;
    let menu_buttons = (document.querySelectorAll(".BaseTopMenu_Button") || []);
    menu_buttons.forEach((x, ix) => {
      menusTotal += x.offsetWidth;
      Vue.set(this.menus[ix], "width", x.offsetWidth);
    })
    this.all_width = this.left_width + this.right_width + menusTotal;
    this.doc_width = document.documentElement.offsetWidth;


    let currentTotal = this.left_width + this.right_width + this.safe_margin;
    this.menus.map((x, ix) => {
      currentTotal += x.width;
      Vue.set(x, "minWidth", currentTotal);
    })
    
    // console.log(this.menus.map(x => x.minWidth));

    let css = '';
    this.menus.map((x, ix) => {
      css += `
        @media only screen and (max-width: ${x.minWidth}px) {
          .BaseTopMenu_Button:nth-child(${ix+1}) {
            display: none;
          }
          .BaseTopMenuUserDialog_Button:nth-child(${ix+1}) {
            display: inline-flex;
          }
        }
      `
      if (ix === this.menus.length - 1) {
        css += `
          @media only screen and (min-width: ${x.minWidth}px) {
            .BaseTopMenuUserDialog_TopMenu {
              display: none;
            }
          }
        `
      }
    })
    css += `
      @media only screen and (max-width: ${this.all_width + this.safe_margin}px) {
        .BaseTopMenu_RightBallMenu + * {
          display: none;
        }
      }
      @media only screen and (min-width: ${this.all_width + this.safe_margin + 1}px) {
        .BaseTopMenu_RightBallMenu {
          display: none;
        }
      }
    `
    // css += `
      
    //   @media only screen and (max-width: ${this.left_widthBig + menusTotal + this.right_width + this.safe_margin}px) {
    //     .BaseTopMenu_LogoFull {
    //       display: none;
    //     }
    //   }
    //   @media only screen and (min-width: ${this.left_widthBig + menusTotal + this.right_width + this.safe_margin + 1}px) {
    //     .BaseTopMenu_LogoCompact {
    //       display: none;
    //     }
    //   }
    // `
    let head = document.head;
    let style = document.createElement('style');
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_ZOOM_LEVEL") {
        vm.local_zoomLevel = mutation.payload;
      }

    })
  },
  computed: {
    letter() {
      if (this.user && this.user.username) {
        return this.user.username[0].toLocaleUpperCase()
      }
      return ""
    },
    showDataFromPast: {
      get: function () {
        return this.local_showDataFromPast;
      },
      set: function (newValue) {
        this.local_showDataFromPast = newValue;
        this.$store.commit("CHANGE_DATA_FROM_PAST", newValue);
      }
    },
    showCustomTunes: {
      get: function () {
        return this.local_showCustomTunes;
      },
      set: function (newValue) {
        this.local_showCustomTunes = newValue;
        this.$store.commit("CHANGE_CUSTOM_TUNES", newValue);
      }
    },
    showOldTags: {
      get: function () {
        return this.local_showOldTags;
      },
      set: function (newValue) {
        this.local_showOldTags = newValue;
        this.$store.commit("CHANGE_OLD_TAGS", newValue);
      }
    },
    homePointsToggle: {
      get: function () {
        return this.local_homePointsToggle;
      },
      set: function (newValue) {
        this.local_homePointsToggle = newValue;
        this.$store.commit("CHANGE_HOME_POINTS_TOGGLE", newValue);
      }
    },
    showPointsCgForce: {
      get: function () {
        return this.local_showPointsCgForce;
      },
      set: function (newValue) {
        this.local_showPointsCgForce = newValue;
        this.$store.commit("CHANGE_POINTS_CG_FORCE", newValue);
      }
    },
    zoomLevel: {
      get: function () {
        return this.local_zoomLevel;
      },
      set: function (newValue) {
        this.local_zoomLevel = newValue;
        this.$store.commit("CHANGE_ZOOM_LEVEL", newValue);
      }
    },
  },
  methods: {
    handleResize() {
      let wBody = document.documentElement.offsetWidth;
      document.documentElement.style.setProperty('--wBody', `${wBody}px`);
      let hBody = document.documentElement.offsetHeight;
      document.documentElement.style.setProperty('--hBody', `${hBody}px`);
    },
    logoClick() {
      if (this.$route.name !== 'Records') {
        this.$router.push({ name: 'Records' })
      }
    },
    localStorageRead(key) {
      let newVal = window.localStorage.getItem(key);
      if (newVal) {
        if (key !== "zoomLevel") {
          newVal = JSON.parse(newVal);
        }
        this[key] = newVal;
      }
    },
    openMenuDialog() {
      this.menuDialog = true;
    },
    closeMenuDialog() {
      this.menuDialog = false;
    },
    openAbout() {
      this.aboutDialog = true;
      this.menuDialog = false;
    },
    closeAbout() {
      this.aboutDialog = false;
      this.menuDialog = true;
    },
    openAdvancedOptions() {
      this.optionsAdvancedDialog = true;
      this.menuDialog = false;
    },
    closeAdvancedOptions() {
      this.optionsAdvancedDialog = false;
      this.menuDialog = true;
    },
    checkNewMenu() {
      if (window.localStorage.getItem("newTab_Community")) {
        this.showNew = false;
      };
    },
    tabClick(item) {
      if (item.name === "Community") {
        this.showNew = false;
        window.localStorage.setItem('newTab_Community', "t");
      }
    }
  },
}
</script>

<style>
.BaseTopMenu_Layout {
  height: var(--top-menu);
  width: var(--wBody);
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  /* background: linear-gradient(90deg, rgba(54,171,0,1) 0%, rgba(91,29,0,1) 100%); */
  position: sticky;
  left: 0;
  /* top: 0; */
  z-index: 31;
  display: flex;
}
.BaseTopMenu_Left {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  width: var(--left-width);
  position: relative;
}
.BaseTopMenu_Logo {
  height: 21px;
  margin-left: 8px;
  position: absolute;
}
.BaseTopMenu_LogoCompact {
  transform: scale(1.5) translateX(3px);
}
.BaseTopMenu_Middle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}
.BaseTopMenu_Button.D_Button {
  font-size: 19px;
  --cl: 60%;
  /* --cl: 70%; */
  color: hsl(var(--back-h), var(--back-s), var(--cl));
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0 12px;
  height: 100%;
  border-radius: 0;
  transition-duration: 0.15s;
}
.BaseTopMenu_Active.D_Button {
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  cursor: initial;
  /* transition-duration: 0.15s; */
  /* color: rgb(255, 199, 23); */
}
.BaseTopMenu_Layout:hover .BaseTopMenu_Button.D_Button {
  /* --cl: 70%; */
}
.BaseTopMenu_Layout:hover .BaseTopMenu_Active.D_Button {
/* .BaseTopMenu_Layout .BaseTopMenu_Active.D_Button { */
  /* background-color: rgba(var(--d-text-yellow), 0.1); */
  /* color: rgb(var(--d-text-yellow)); */
  color: rgb(255, 199, 23);
}

.BaseTopMenu_Right {
  width: 55px;
  --cor-hs: var(--t0-hs);
  --cor-l: var(--t0-l);
  --cor-l0: var(--t0-l0);
}
.BaseTopMenu_RightButton {
  background-color: transparent;
  border: none;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  transition-duration: 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  color: var(--d-text-b);
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.BaseTopMenu_RightBall {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--top-menu) + 20px);
  height: calc(var(--top-menu) + 20px);
  left: 3px;
  /* background-color: hsla(var(--back-h), var(--back-s), 30%, 1); */
  background-color: hsla(var(--cor-hs), var(--cor-l0), 1);
  border-radius: 50%;
  color: hsl(var(--back-h), var(--back-s), 10%);
  transition-property: all, box-shadow;
  transition-duration: 0.15s, 0.25s;
}
.BaseTopMenu_Layout:hover .BaseTopMenu_RightBall {
  background-color: hsla(var(--cor-hs), var(--cor-l0), 1);
}
.BaseTopMenu_RightButton:hover .BaseTopMenu_RightBall,
.BaseTopMenu_RightButton.focus-visible .BaseTopMenu_RightBall {
  box-shadow: inset 60px 0px 0px 0px hsla(var(--cor-hs), var(--cor-l), 1);
}
.BaseTopMenu_RightBallIcon {
  font-size: 19px;
}
.BaseTopMenu_RightBallLetter {
  font-size: 23px;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 700;
}

.Main_isMobile {
  --top-menu: 60px;
}
.Main_isMobile .BaseTopMenu_RightBallIcon {
  margin-left: -22px;
}
.Main_isMobile .BaseTopMenu_RightBallLetter {
  margin-left: -22px;
}
.BaseTopMenu_New:not(.BaseTopMenu_Active) {
  position: relative;
}
.BaseTopMenu_New:not(.BaseTopMenu_Active):after {
  content: "new";
  color: rgb(var(--d-text-yellow));
  font-size: 14px;
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}



@media only screen and (min-width: 1700px) {
  .BaseTopMenu_Middle {
    justify-content: center;
  }
}
@media only screen and (max-width: 1200px) {
  /* body {
    --top-menu: 60px !important;
  } */
  .BaseTopMenu_LogoFull {
    display: none;
  }
  
}
@media only screen and (min-width: 1201px) {
  .BaseTopMenu_LogoCompact {
    display: none;
  }
}

</style>