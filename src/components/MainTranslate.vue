<template>
  <div class="MainTranslate_Layout">
    <div class="MainTranslate_Box">
      <div class="MainTranslate_Header">
        <div class="MainTranslate_HeaderTitle">Translation tool</div>
        <ol class="MainTranslate_Ol">
          <li class="MainTranslate_Rule">Follow the letter case the same way as you see on the left, some words are full lowercase or full UPPERCASE.</li>
          <li class="MainTranslate_Rule">Keep the track and surfaces names how its in the game. Top Drives probably doesn't has a good translation for your language. Maybe you want to improve, no probem, but don't improve track names. People will not find the track using your translation.</li>
          <li class="MainTranslate_Rule">Here on TDR some words has limited space (like small buttons), use your creativity to follow those characters limit when asked.</li>
          <li class="MainTranslate_Rule">Some fields has a separator like "Tag | Tags", this is pluralization, you need to keep separator like that.</li>
          <li class="MainTranslate_Rule">If some item work better in english, just leave it empty.</li>
          <li class="MainTranslate_Rule">Safe to reload this page, your browser will memorize your work.</li>
        </ol>
        <div class="MainTranslate_FooterMessage" style="margin-bottom: 5px;">Review a done language:</div>
        <div class="MainTranslate_FooterButtons" style="margin-bottom: 40px;">
          <button
            v-for="(item, ix) in langs"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="loadSystemLanguage(item)">
            <BaseFlag :flag="item.toUpperCase()" class="MainTranslate_FooterFlag" />
            <span>{{ item.toUpperCase() }}</span>
          </button>
        </div>
        <div class="MainTranslate_Bottom">
          <div class="MainTranslate_Left">Language name</div>
          <div class="MainTranslate_Right">
            <BaseText
              v-model="translateObj.language"
              class="BaseText_Big MainTranslate_HeaderLanguageNameInput"
              type="normal"
              label="" />
          </div>
        </div>
      </div>
      <div>
        
      </div>
      <div class="MainTranslate_Body">
        <div
          v-for="(item, key) in english"
          :class="{
            MainTranslate_Misc: key.startsWith('m_'),
            MainTranslate_Phrase: key.startsWith('p_'),
            MainTranslate_Template: key.startsWith('g_'),
            MainTranslate_Surface: key.startsWith('s_'),
            MainTranslate_Car: key.startsWith('c_'),
            MainTranslate_Track: key.startsWith('t_'),
          }"
          class="MainTranslate_Item">
          <div v-if="first.includes(key)" class="MainTranslate_Title">
            <template v-if="key.substr(0,2) === 'm_'">Misc</template>
            <template v-if="key.substr(0,2) === 'p_'">Phrases</template>
            <template v-if="key.substr(0,2) === 'g_'">Template Guidelines</template>
            <template v-if="key.substr(0,2) === 's_'">Track surfaces</template>
            <template v-if="key.substr(0,2) === 'c_'">Relative to cars</template>
            <template v-if="key.substr(0,2) === 't_'">Track names</template>
          </div>
          <div class="MainTranslate_Bottom">
            <div class="MainTranslate_Left">{{ item }}</div>
            <div class="MainTranslate_Right">
              <textarea
                v-if="key.substr(0,2) === 'p_' || key.substr(0,2) === 'g_'"
                v-model="translateObj[key]"
                rows="6"
                class="MainTranslate_Textarea data-hj-allow"
                @blur="blur()" />
              <BaseText
                v-else
                v-model="translateObj[key]"
                class="BaseText_Big"
                type="normal"
                label=""
                :placeholder="first.includes(key) ? 'type the translation here...' : ''"
                @blur="blur()" />
              <div v-if="item.includes(' | ')" class="MainTranslate_Tip">Singular | Plural</div>
              <div v-else-if="key.substr(0,2) === 't_'" class="MainTranslate_Tip">{{ campaignObj[key] }}</div>
              <div v-else-if="isOnlyLowerCase(item)" class="MainTranslate_Tip">lowercase</div>
              <div v-else class="MainTranslate_Tip">{{ tips[key] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="MainTranslate_Footer">
        <div class="MainTranslate_FooterButtons">
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
            @click="reset()">Clear all</button>
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen"
            @click="download()">Create translation file</button>
        </div>
        <div style="margin-top: 15px;" class="MainTranslate_FooterButtons">
          <label class="D_Button D_ButtonDark D_ButtonDark2">
            <input
              style="display: none;"
              type="file"
              accept="application/json"
              @change="load($event)">
              <span>Load a translation file</span>
          </label>
          <button
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="copy()">Copy to clipboard</button>
        </div>
        <div class="MainTranslate_FooterMessage">After creating translation file, send it to me on TDR Discord</div>
        <BaseDialog
          :active="confirmDelete.dialog"
          :transparent="false"
          :lazy="true"
          max-width="420px"
          min-width="240px"
          @close="confirmDelete.dialog = false;">
          <div style="Main_DialogConfirm">
            <div class="Main_DialogMessage">{{ confirmDelete.msg }}</div>
            <div class="Main_DialogBottom">
              <button
                class="D_Button Main_OptionsButton"
                @click="confirmDelete.dialog = false;">
                <span>{{ $t("m_cancel") }}</span>
              </button>
              <button
                :class="`${ confirmDelete.loading ? 'D_Button_Loading ' : '' }`+
                        `${ confirmDelete.classe }`"
                :disabled="confirmDelete.loading"
                class="D_Button Main_OptionsButton"
                @click="confirmDelete.action">
                <span>{{ confirmDelete.actionLabel }}</span>
              </button>
            </div>
          </div>
        </BaseDialog>
      </div>
    </div>
  </div>
</template>

<script>
import BaseText from "./BaseText.vue";
import Logo from "./Logo.vue";
import BaseDialog from "./BaseDialog.vue";
import BaseFlag from './BaseFlag.vue'
import campaign from '../database/campaign.json'
import english from '@/i18n/en.js';

export default {
  name: 'MainTranslate',
  components: {
    BaseText,
    Logo,
    BaseDialog,
    BaseFlag
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      english,
      campaign,
      translateObj: {
        language: null
      },
      first: [
        "m_campaign",
        "p_userSentCgForAnalyse",
        "g_joinDiscord",
        "s_dry",
        "c_topSpeed",
        "t_drag100b",
      ],
      campaignObj: {},
      tips: {
        m_vChanges: "you need to use the {version}",
        m_charLeast: "you need to use the {n}",
        p_modDoingRound: "you need to use the {mod}",
        p_patronsOnly: "you need to use the {tier}",

        s_dry: "max 5 characters",
        s_aspht: "max 5 characters",
        s_wet: "max 5 characters",
        s_dirt: "max 5 characters",
        s_gravel: "max 5 characters",
        s_ice: "max 5 characters",
        s_sand: "max 5 characters",
        s_snow: "max 5 characters",
        s_grass: "max 5 characters",
        m_win: "max 5 characters",
        m_lose: "max 5 characters",
        m_draw: "max 5 characters",
        m_notime: "max 8 characters",
        m_select: "max 8 characters",

        c_mid: "ground clearance of cars",
        c_low: "ground clearance of cars",
        c_high: "ground clearance of cars",

        c_performance: "Tyre",
        c_standard: "Tyre",
        'c_all-surface': "Tyre",
        'c_off-road': "Tyre",
        c_slick: "Tyre",

        c_frontEngine: "engine position",
        c_midEngine: "engine position",
        "c_mid-rearEngine": "engine position",
        c_mixedEngine: "engine position",
        c_rearEngine: "engine position",

        c_petrol: "fuel",
        c_diesel: "fuel",
        c_electric: "fuel",
        c_hybrid: "fuel",
        c_bioethanol: "fuel",
        c_hydrogen: "fuel",
        c_misc: "fuel",
      },
      confirmDelete: {
        dialog: false,
        msg: "Reset all your work?",
        actionLabel: "Reset",
        action: null,
        loading: false,
        classe: ""
      },
      langs: []
    }
  },
  watch: {},
  beforeMount() {
    let vm = this;

    let translateObj = window.localStorage.getItem("translateObj");
    if (translateObj) {
      translateObj = JSON.parse(translateObj);
      this.translateObj = translateObj;
    }

    vm.langs = [];
    Object.keys(this.$i18n._vm.messages).forEach(key => {
      vm.langs.push(key)
    })

    this.campaignLocation();
  },
  mounted() {},
  computed: {},
  methods: {
    blur() {
      window.localStorage.setItem('translateObj', JSON.stringify(this.translateObj));
      // this.$store.commit("START_LOGROCKET", {});
    },
    reset() {
      let vm = this;

      let action = function() {
        vm.translateObj = {
          language: null
        }
        vm.blur();
        vm.confirmDelete.dialog = false;
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Reset all your work?`,
        actionLabel: `Reset`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    download() {
      let lang = this.translateObj.language || "lang";
      lang = lang.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");

      let filename = `${lang}_TDR.json`;
      let data = JSON.parse(JSON.stringify(this.translateObj));
      Object.keys( this.english ).forEach(key => {
        if (!data[key]) data[key] = null;
      })

      const jsonStr = JSON.stringify(data, null, "  ");


      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));

      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
      this.exportLoading = false;
    },
    isOnlyLowerCase(str) {
      return !/[A-Z]/.test(str);
    },
    campaignLocation() {
      let currentTracksOptions = [];
      let currentTracks = [];

      // let used = [];
      // Object.keys( this.english ).forEach(key => {
      //   if (used.includes(this.english[key])) {
      //     console.log(this.english[key]);
      //     debugger;
      //   }
      //   used.push(this.english[key]);
      // })

      Object.keys( this.english ).forEach(key => {
        if (key.startsWith("t_")) currentTracks.push(key.substr(2));
      })


      currentTracks.map((tcode, ix) => {
        let options = [];
        this.campaign.map((city, icity) => {
          city.matches.map((match, imatch) => {
            match.races.map((race, irace) => {
              if (race.name.slice(0, -4) === tcode) {
                options.push({
                  city: city.name,
                  icity,
                  imatch,
                  irace,
                  code: `${icity}${imatch}`
                })
              }
            })
          })
        })
        currentTracksOptions.push(options);
      })

      // delivery best option
      currentTracks.map((x, ix) => {
        let bestOption;
        currentTracksOptions[ix].map(y => {
          if (
            !bestOption ||
            this.isChamp(bestOption.city) && !this.isChamp(y.city) ||
            y.irace < bestOption.irace && !this.isChamp(y.city) ||
            (y.irace <= bestOption.irace && y.icity > bestOption.icity) ||
            (y.irace <= bestOption.irace && y.imatch > bestOption.imatch)
          ) {
            bestOption = y;
          }
        })
        if (bestOption) {
          this.campaignObj[`t_${x}`] = `${bestOption.city} ${bestOption.imatch+1}, Race ${bestOption.irace+1}`
        } else {
          this.campaignObj[`t_${x}`] = ``;
        }
      })
    },
    isChamp(str) {
      return str.startsWith("SN") || str.startsWith("YB");
    },
    load(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = this.onload;
      reader.readAsText(file);
    },
    onload(e) {
      let str = e.target.result;
      let json = JSON.parse(str);
      this.translateObj = json;
    },
    copy() {
      let data = JSON.parse(JSON.stringify(this.translateObj));
      Object.keys( this.english ).forEach(key => {
        if (!data[key]) data[key] = null;
      })

      navigator.clipboard.writeText(JSON.stringify(data));
    },
    loadSystemLanguage(lang) {
      let newLang = this.$i18n._vm.messages[lang];
      this.translateObj = newLang;
    }
  },
}
</script>

<style>
.MainTranslate_Layout {
  padding: 20px;
}
.MainTranslate_Layout .BaseText_Input {
  margin-top: 0px;
}
.MainTranslate_Logo {
  width: 210px;
  margin: 0 auto;
}
.MainTranslate_HeaderTitle {
  text-align: center;
  margin: 40px 0;
  font-size: 27px;
}
.MainTranslate_Ol {
  max-width: 600px;
  margin: 0 auto;
  font-size: 15px;
}
.MainTranslate_Box {

}
.MainTranslate_Header {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.MainTranslate_Body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.MainTranslate_Title {
  padding: 20px;
  font-size: 35px;
  text-align: center;
  color: rgb(var(--d-text-yellow));
}
.MainTranslate_Item {
  padding-bottom: 30px;
}
.MainTranslate_Bottom {
  display: flex;
  align-items: center;
  gap: 15px;
}
.MainTranslate_Left {
  width: 290px;
  text-align: right;
  line-height: 1;
}
.MainTranslate_Right {
  width: 290px;
  position: relative;
}
.MainTranslate_Input {

}
.MainTranslate_Tip {
  font-size: 14px;
  color: #68b168;
  position: absolute;
  bottom: -20px;
  left: 0;
}
.MainTranslate_Textarea {
  background-color: rgba(0,0,0,0.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: none;
  margin-top: 2px;
  width: 100%;
}
.MainTranslate_Footer {
  text-align: center;
  margin-top: 20px;
}
.MainTranslate_Rule {
  margin-top: 10px;
}
.MainTranslate_FooterButtons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}
.MainTranslate_FooterMessage {
  margin: 30px 0;
}
.MainTranslate_FooterFlag {
  width: 20px;
  margin: -7px 5px -5px 0px;
}

@media only screen and (max-width: 767px) {
  .MainTranslate_Left {
    width: 50%;
  }
  .MainTranslate_Right {
    width: 50%;
  }
}
</style>