<template>
  <div class="MainCommunity_Layout" style="--nWidth: 720px;">
    <div class="MainCommunity_Group">
      <div v-if="sentForReview" class="MainCommunity_SentForReview">{{ $t("p_userSentCommunityForAnalyse") }}</div>
      <div v-if="!loading" class="MainCommunity_Box">
        <div
          v-for="(item, key, index) in list"
          :class="{ MainCommunity_ItemActive: expanded[key] }"
          class="MainCommunity_Item">
          <template v-if="item.length > 0">
            <button class="D_Button MainCommunity_GroupButton" @click="expanded[key] = !expanded[key]">
              <div v-if="key.length === 2" class="MainCommunity_GroupFlagBox">
                <BaseFlag :flag="key" class="MainCommunity_GroupFlag" />
              </div>
              <div class="MainCommunity_GroupLabel">{{ flagNames[key] }} ({{ item.length }})</div>
            <i :class="expanded[key] ? `ticon-arrow_up_2` : `ticon-arrow_down_2`" style="font-size: 0.7em;" aria-hidden="true"/>
            </button>
            <BaseExpandDiv :active="expanded[key]" class="MainCommunity_ExpandBlock">
              <div class="MainCommunity_SubPack">
                <button v-for="social in item" class="D_Button MainCommunity_SubItem" @click="socialClick(social, $event)">
                  <i class="MainCommunity_SocialIcon" :class="`brand-${social.platform}`" aria-hidden="true"/>
                  <div class="MainCommunity_SocialName">{{ social.name }}</div>
                  <div class="MainCommunity_SocialCount">{{ social.userCount | kShort }}</div>
                </button>
                <!-- <button
                  v-if="key !== 'official' && key !== 'global' && key !== 'toApprove'"
                  class="D_Button MainCommunity_SubItem MainCommunity_SubItemPlus"
                  @click="user ? newSubmit(key) : scrollToBottom()">
                  <i class="ticon-plus_2" aria-hidden="true"/>
                </button> -->
              </div>
            </BaseExpandDiv>
          </template>
        </div>
        <div class="MainCommunity_Footer">
          <div v-if="user" class="MainCommunity_SubmitYours D_Center">
            <button class="D_Button Main_LoginToEdit MainCommunity_SubmitYoursButton" @click="newSubmit()">
              <i class="ticon-plus_2 D_ButtonIcon MainCommunity_SubmitYoursIcon" aria-hidden="true"/>
              <span class="MainCommunity_SubmitYoursLabel">{{ $t('m_submitYourCommunity') }}</span>
            </button>
          </div>
          <template v-else>
            <div class="D_Center">
              <div class="MainCommunity_LoginToSubmit">{{ $t('m_submitYourCommunity') }}?</div>
            </div>
            <div class="D_Center Space_Top">
              <button
                class="D_Button Main_LoginToEdit"
                @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="MainCommunity_BoxLoading">
        <BaseContentLoader
          :contents="true"
          itemWidth="100%"
          :itemHeight="42"
          style="padding: 10px 10px 10px 20px; width: 100%;"
          type="block"
          count="5" />
      </div>
    </div>
    <BaseDialog
      :active="dialogActive"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="dialogActive = false; forceShowDelete = false;">
      <div class="Main_AdvancedDialogBox">
        <div class="MainCommunity_DialogTitle">
          <div class="Main_DialogTitle">{{ dialogSocial.name }}</div>
          <div class="MainCommunity_DialogTitleRight">
            <i class="MainCommunity_DialogTitleIcon" :class="`brand-${dialogSocial.platform}`" aria-hidden="true"/>
            <template v-if="dialogSocial.country && dialogSocial.country.length > 0">
              <BaseFlag v-for="country in dialogSocial.country" :flag="country" class="MainCommunity_DialogFlag" :class="{ MainCommunity_DialogFlagGlobal: country === 'global' }" />
            </template>
          </div>
        </div>
        <div class="MainCommunity_DialogMid">
          <div class="MainCommunity_DialogInfo">
            <div class="MainCommunity_DialogInfoLabel">{{ $t('m_userCount') }}</div>
            <div class="MainCommunity_DialogInfoValue">{{ dialogSocial.userCount | kShort }}</div>
          </div>
          <div class="MainCommunity_DialogInfo">
            <div class="MainCommunity_DialogInfoLabel">{{ $t('m_type') }}</div>
            <div class="MainCommunity_DialogInfoValue">{{ dialogSocial.type ? $t(`m_${dialogSocial.type}`) : '' }}</div>
          </div>
          <div class="MainCommunity_DialogInfo">
            <div class="MainCommunity_DialogInfoLabel">{{ $t('m_language') }}</div>
            <div class="MainCommunity_DialogInfoValue">{{ dialogSocial.language }}</div>
          </div>
          <div v-if="dialogSocial.type === 'private'" class="MainCommunity_DialogInfo">
            <div class="MainCommunity_DialogInfoLabel">{{ $t('m_inviter') }}</div>
            <div class="MainCommunity_DialogInfoValue" style="color: rgb(var(--d-text-yellow));">{{ dialogSocial.author }}</div>
          </div>
          <div v-if="dialogSocial.description" class="MainCommunity_DialogInfo">
            <div class="MainCommunity_DialogInfoLabel">{{ $t('m_description') }}</div>
            <div class="MainCommunity_DialogInfoValue">{{ dialogSocial.description }}</div>
          </div>
        </div>
        <div v-if="dialogSocial.link" class="MainCommunity_DialogLink">
          <a
            class="D_Button Main_LoginToEdit MainCommunity_DialogLinkButton"
            target="_blank"
            rel="noopener noreferrer"
            :href="dialogSocial.link">
            <span class="">{{ $t('m_link') }}</span>
            <i class="ticon-internal" style="font-size: 0.8em; margin-left: 5px;" aria-hidden="true"/>
          </a>
          <div class="MainCommunity_DialogLinkSub">{{ dialogSocial.link }}</div>
          <!-- <span style="color: rgb(var(--d-text-yellow));">Link: </span><a  class="D_Link D_LinkUnder" style="word-break: break-word;" target="_blank" rel="noopener noreferrer">{{ dialogSocial.link }}<i class="ticon-internal" style="font-size: 0.8em" aria-hidden="true"/></a> -->
        </div>
        <div v-if="dialogSocial.discordId && dialogSocial.infoForInvite" class="MainCommunity_DialogInvite">
          <template v-if="user">
            <div class="MainCommunity_DialogInviteTitle">{{ $t('p_communityToBeInvited') }}</div>
            <div class="MainCommunity_DialogInviteNeeded">{{ dialogSocial.infoForInvite }}</div>
            <textarea
              v-model="dialogTextField"
              rows="3"
              class="Main_TextArea data-hj-allow"
              placeholder="" />
            <div class="D_Center Space_Top">
              <button
                :class="{ D_Button_Loading: askInviteLoading }"
                :disabled="askInviteLoading || !dialogTextField"
                class="D_Button Main_SaveAllButton"
                @click="submitInvite()">{{ $t("m_send") }}</button>
            </div>
          </template>
          <template v-else>
            <div class="D_Center">
              <div class="MainCommunity_LoginToSubmit">{{ $t('m_wantToJoin') }}</div>
            </div>
            <div class="D_Center Space_Top">
              <button
                class="D_Button Main_LoginToEdit"
                @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
            </div>
          </template>
        </div>
        <div v-if="user && user.mod && (dialogSocial.approved === false || forceShowDelete)" class="MainCommunity_DialogModTools D_Center Space_TopPlus" style="gap: 5px;">
          <button
            :class="{ D_Button_Loading: loading }"
            class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
            @click="approveCommunity(dialogSocial, true)">
            <span>{{ $t("m_delete") }}</span>
          </button>
          <button
            v-if="dialogSocial.approved === false"
            :class="{ D_Button_Loading: loading }"
            class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen"
            @click="approveCommunity(dialogSocial)">
            <span>{{ $t("m_approve") }}</span>
          </button>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="newDialogActive"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="newDialogActive = false;">
      <div class="MainCommunity_DialogSumitLayout">
        <div class="MainCommunity_DialogTitle">
          <div class="Main_DialogTitle">{{ $t('m_submitYourCommunity') }}</div>
        </div>
        <div
          :class="{
            MainCommunity_DialogSubmitInnerNoType: !newType,
            MainCommunity_DialogSubmitInnerWithType: newType
          }"
          class="MainCommunity_DialogSubmitInner" >
          <div class="MainCommunity_NewTypeToSelect MainCommunity_NewBoxCenter">
            <template v-for="(item, ix) in types">
              <BaseChip
                v-model="newType"
                class="BaseChip_MinWidth BaseChip_DontCrop MainCommunity_DialogSubmitChipType"
                required="true"
                :value="item"
                @click="newTypeSet();">
                <div>{{ $t(`m_${item}`) }}</div>
                <div class="MainCommunity_DialogSubmitTypeSub">{{ $t(`p_${item}Descript`) }}</div>
              </BaseChip>
            </template>
          </div>
          <div v-if="newType" class="MainCommunity_BrandSelect MainCommunity_NewBoxCenter Space_TopPlus">

            <button
              v-if="!newPlatform"
              :disabled="newLoading"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="brandDialog = true;">{{ $t("m_selectPlatform") }}</button>
            
            <button
              v-else
              :disabled="newLoading"
              class="D_Button D_ButtonDark D_ButtonDark2 MainCommunity_SubmitFlagGroupButton"
              @click="brandDialog = true;">
              <i class="MainCommunity_SubmitSocialIconButton" :class="`brand-${newPlatform}`" aria-hidden="true"/>
              <div class="MainCommunity_SocialName MainCommunity_Capitalize">{{ brandLabel[newPlatform] ? brandLabel[newPlatform] : newPlatform }}</div>
            </button>

            <button
              v-if="newCountry.length === 0"
              :disabled="newLoading"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="countryDialog = true; searchFlag = ''">{{ $t("m_selectCountry") }}</button>
            
            <button
              v-else
              :disabled="newLoading"
              class="D_Button D_ButtonDark D_ButtonDark2 MainCommunity_SubmitFlagGroupButton"
              @click="countryDialog = true; searchFlag = ''">
              <BaseFlag v-if="newCountry.length > 0" v-for="flag in newCountry" :flag="flag" class="MainCommunity_DialogFlag" />
            </button>
            
          </div>
          <div v-if="newType && newPlatform && newCountry.length > 0" class="MainCommunity_Text Space_Top">
            <BaseText
              v-model="newName"
              class="BaseText_Big"
              type="normal"
              :disabled="newLoading"
              :label="$t('c_name')"
              placeholder="" />
          </div>
          <div v-if="newType && newPlatform && newCountry.length > 0" class="MainCommunity_Text MainCommunity_TextDual Space_Top">
            <BaseText
              v-model="newLanguage"
              class="BaseText_Big"
              type="normal"
              :disabled="newLoading"
              :label="$t('m_language')"
              placeholder="" />
            <BaseText
              v-model="newUserCount"
              class="BaseText_Big"
              type="integer"
              :disabled="newLoading"
              :label="$t('m_userCount')"
              placeholder="0" />
          </div>
          <div v-if="newType && newPlatform && newCountry.length > 0" class="MainCommunity_Text Space_Top">
            <div class="BaseText_Label">{{ $t('m_description') }}</div>
            <textarea
              v-model="newDescription"
              rows="3"
              class="Main_TextArea data-hj-allow"
              :placeholder="$t('m_optional')" />
          </div>
          <div v-if="newType === 'public' && newPlatform && newCountry.length > 0" class="MainCommunity_Text Space_Top">
            <BaseText
              v-model="newLink"
              class="BaseText_Big"
              type="normal"
              :disabled="newLoading"
              :label="$t('m_link')"
              placeholder="https://..." />
          </div>
          <template v-if="newType === 'private' && newPlatform && newCountry.length > 0">
            <div class="MainCommunity_Text Space_Top">
              <div class="BaseText_Label">{{ $t('m_informationForInvite') }}</div>
              <textarea
                v-model="newInfoForInvite"
                rows="5"
                class="Main_TextArea data-hj-allow"
                :placeholder="$t('p_informationForInvite')" />
            </div>
            <div class="MainCommunity_DialogInviteNeeded" style="margin-bottom: 0px;">{{ $t('p_inviteYourDiscord') }}</div>
          </template>
          <div v-if="newType && newPlatform && newCountry.length > 0" class="D_Center Space_TopPlus">
            <button
              :class="{ D_Button_Loading: newLoading }"
              :disabled="newLoading || !isValidSubmit"
              class="D_Button Main_SaveAllButton"
              @click="submitNewCommunity()">{{ user && user.mod ? $t("m_send") : $t("m_submitReview") }}</button>
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="brandDialog"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="brandDialog = false;">
      <div class="MainCommunity_DialogSumitLayout">
        <div class="MainCommunity_DialogTitle">
          <div class="Main_DialogTitle">{{ $t('m_platform') }}</div>
        </div>
        <div class="MainCommunity_DialogBrandList">
          <template v-for="(item, ix) in brands">
            <BaseChip
              v-model="newPlatform"
              class="BaseChip_MinWidth BaseChip_DontCrop MainCommunity_BrandChip"
              required="true"
              :value="item"
              @click="">
              <div class="MainCommunity_DialogBrandBox">
                <i class="MainCommunity_SocialIcon" :class="`brand-${item}`" aria-hidden="true"/>
                <span class="MainCommunity_SocialName MainCommunity_Capitalize">{{ brandLabel[item] ? brandLabel[item] : item }}</span>
              </div>
            </BaseChip>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="countryDialog"
      :transparent="false"
      :isStatic="true"
      :forceScroll="true"
      max-width="350px"
      min-width="240px"
      @close="countryDialog = false;">
      <div class="MainCommunity_DialogFlagSearchLayout">
        <div class="MainCommunity_DialogTitle">
          <div class="Main_DialogTitle">{{ $t('c_country', 1) }}</div>
        </div>
        <div class="MainCommunity_DialogFlagSearch">
          <input
            v-model="searchFlag"
            id="SearchFlagInput"
            :placeholder="$t('m_search')"
            class="D_SearchInput MainCommunity_DialogFlagSearchInput data-hj-allow"
            type="search"
            autocomplete="off" />
          <button
            v-if="searchFlag && searchFlag.length > 0"
            class="D_Button MainCommunity_DialogFlagSearchInputClose"
            @click="searchFlag = ''">
            <i class="ticon-close_2" aria-hidden="true"/>
          </button>
        </div>
        <div class="MainCommunity_DialogFlagList">
          <template v-for="(value, key, index) in filteredFlags">
            <BaseChip
              v-if="key !== 'official' && key !== 'toApprove'"
              v-model="newCountry"
              :disabled="!newCountry.includes(key) && newCountry.length >= 3"
              class="BaseChip_MinWidth BaseChip_DontCrop MainCommunity_FlagChip"
              :value="key"
              @click="newCountryClick()">
              <div class="MainCommunity_DialogFlagBox">
                <BaseFlag :flag="key" class="MainCommunity_DialogFlag" />
                <span class="MainCommunity_SocialName MainCommunity_Capitalize">{{ value }}</span>
              </div>
            </BaseChip>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseLinkDiscord
      :active="dDiscordActive"
      :subText="$t('p_linkDiscordExplanationCommu')"
      @close="dDiscordActive = false"
      @finish="dDiscordActive = false"/>
  </div>
</template>

<script>
import BaseExpandDiv from './BaseExpandDiv.vue'
import BaseFlag from './BaseFlag.vue'
import BaseDialog from './BaseDialog.vue'
import BaseLinkDiscord from './BaseLinkDiscord.vue'
import BaseChip from './BaseChip.vue'
import BaseText from './BaseText.vue'
import BaseContentLoader from './BaseContentLoader.vue'
import '@/assets/fonts/brands/style.css';

export default {
  name: 'MainCommunity',
  components: {
    BaseExpandDiv,
    BaseFlag,
    BaseDialog,
    BaseLinkDiscord,
    BaseChip,
    BaseText,
    BaseContentLoader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      user: null,
      unsubscribe: null,
      forceShowDelete: false,
      loading: false,
      // list: {
      //   official: [
      //     { name: "Top Drives", platform: "discord", type: "official", link: "https://discord.com/invite/UVAS3sHxW4", language: "English", country: ["global"], userCount: 33900 },
      //     { name: "Top Drives", platform: "facebook", type: "official", link: "https://www.facebook.com/topdrives", language: "English", country: ["global"], userCount: 192000 },
      //     { name: "Top Drives", platform: "youtube", type: "official", link: "https://www.youtube.com/topdrives", language: "English", country: ["global"], userCount: 29900 },
      //     { name: "topdrivesgame", platform: "instagram", type: "official", link: "https://www.instagram.com/topdrivesgame", language: "English", country: ["global"], userCount: 15000 },
      //     { name: "Top Drives", platform: "x", type: "official", link: "https://www.twitter.com/topdrivesgame", language: "English", country: ["global"], userCount: 7000 },
      //   ],
      //   global: [
      //     { name: "Top Drives Club", platform: "facebook", type: "public", link: "https://www.facebook.com/groups/2223474104583492/", language: "English", country: ["global"], approved: true, author: "TiagoXavi", userCount: 7000, description: "A TOP DRIVES group for TOP DRIVES players. A place to ask questions, talk about events and challenges and of course cars. A place that will be free of scammers and cheaters. A focus on helping each other place well in events and challenges, find the best set up for cars and celebrate each others successes." },
      //     { name: "r/TopDrives", platform: "reddit", type: "public", link: "https://www.reddit.com/r/TopDrives/", language: "English", country: ["global"], approved: true, author: "TiagoXavi", userCount: 11000, description: "A community for all things TopDrives (mobile game by Hutch)." },
      //     { name: "Top Drives Records", platform: "discord", type: "public", link: "https://discord.gg/gWZ8v9Xf43", language: "English", country: ["global"], approved: true, author: "TiagoXavi", userCount: 2400, description: "TDR official community. News, contests, suggestions, help, report errors..." },
      //     { name: "The Top Drives Hideout", platform: "discord", type: "public", link: "https://discord.com/invite/2TGxk2v", language: "English", country: ["global"], approved: true, author: "TiagoXavi", userCount: 2300, description: "" },
      //     { name: "TDCCS", platform: "discord", type: "public", link: "https://discord.gg/58nGMtAeJm", language: "English", country: ["global"], approved: true, author: "TiagoXavi", userCount: 1800, description: "" },
      //     { name: "Top Drives Lodge", platform: "discord", type: "public", link: "https://discord.gg/e6NRGKGp3e", language: "English", country: ["global"], approved: true, author: "TiagoXavi", userCount: 500, description: "" },
      //     { name: "BLOSSOMCHARGER", platform: "youtube", type: "public", link: "https://www.youtube.com/@BLOSSOMxCHARGER", language: "English", country: ["global"], approved: false, author: "TiagoXavi", userCount: 12000, description: "" },
      //   ],
      //   br: [
      //     { name: "Top Drives Brasil", platform: "whatsapp", type: "private", language: "Português", country: ["br", "pt"], author: "TiagoXavi", infoForInvite: "Nome e número de telefone com DDD", userCount: 100, description: "Grupo destinado a falar do jogo. Evitar outros assuntos. São bem vindos: brasileiros, portugueses ou qualquer um que fala português." },
      //   ],
      //   de: [
      //     { name: "Top Drives Deutchland", platform: "whatsapp", type: "private", language: "Português", country: ["de", "at"], author: "TiagoXavi", infoForInvite: "Nome e número telefone", userCount: 100, description: "Grupo destinado a falar do jogo, evitar outros assuntos" },
      //   ],
      //   us: [
      //     { name: "Top Drives USA", platform: "whatsapp", type: "private", language: "Português", country: ["us"], author: "TiagoXavi", infoForInvite: "Nome e número telefone", userCount: 100, description: "Grupo destinado a falar do jogo, evitar outros assuntos" },
      //     { name: "Top Drives USA 2", platform: "telegram", type: "private", language: "Português", country: ["us"], author: "TiagoXavi", infoForInvite: "Nome e número telefone", userCount: 100, description: "Grupo destinado a falar do jogo, evitar outros assuntos" },
      //     { name: "Top Drives USA 3", platform: "wechat", type: "private", language: "Português", country: ["us"], author: "TiagoXavi", infoForInvite: "Nome e número telefone", userCount: 100, description: "Grupo destinado a falar do jogo, evitar outros assuntos" },
      //   ],
      // },
      list: {
        toApprove: [],
        official: [],
        global: []
      },
      flagNames: {
        toApprove: "For review",
        official: "Official",
        global: "Global",
        ad: "Andorra",
        ae: "United Arab Emirates",
        af: "Afghanistan",
        ag: "Antigua and Barbuda",
        ai: "Anguilla",
        al: "Albania",
        am: "Armenia",
        ao: "Angola",
        aq: "Antarctica",
        ar: "Argentina",
        as: "American Samoa",
        at: "Austria",
        au: "Australia",
        aw: "Aruba",
        ax: "Åland Islands",
        az: "Azerbaijan",
        ba: "Bosnia and Herzegovina",
        bb: "Barbados",
        bd: "Bangladesh",
        be: "Belgium",
        bf: "Burkina Faso",
        bg: "Bulgaria",
        bh: "Bahrain",
        bi: "Burundi",
        bj: "Benin",
        bl: "Saint Barthélemy",
        bm: "Bermuda",
        bn: "Brunei Darussalam",
        bo: "Bolivia",
        br: "Brazil",
        bs: "Bahamas",
        bt: "Bhutan",
        bv: "Bouvet Island",
        bw: "Botswana",
        by: "Belarus",
        bz: "Belize",
        ca: "Canada",
        cc: "Cocos Islands",
        cd: "Congo (the Democratic Republic of the)",
        cf: "Central African Republic",
        cg: "Congo",
        ch: "Switzerland",
        ci: "Côte d'Ivoire",
        ck: "Cook Islands",
        cl: "Chile",
        cm: "Cameroon",
        cn: "China",
        co: "Colombia",
        cr: "Costa Rica",
        cu: "Cuba",
        cv: "Cabo Verde",
        cw: "Curaçao",
        cx: "Christmas Island",
        cy: "Cyprus",
        cz: "Czechia",
        de: "Germany",
        dj: "Djibouti",
        dk: "Denmark",
        dm: "Dominica",
        do: "Dominican Republic",
        dz: "Algeria",
        ec: "Ecuador",
        ee: "Estonia",
        eg: "Egypt",
        eh: "Western Sahara",
        er: "Eritrea",
        es: "Spain",
        et: "Ethiopia",
        fi: "Finland",
        fj: "Fiji",
        fk: "Falkland Islands",
        fm: "Micronesia",
        fo: "Faroe Islands",
        fr: "France",
        ga: "Gabon",
        gb: "United Kingdom",
        gd: "Grenada",
        ge: "Georgia",
        gf: "French Guiana",
        gg: "Guernsey",
        gh: "Ghana",
        gi: "Gibraltar",
        gl: "Greenland",
        gm: "Gambia",
        gn: "Guinea",
        gp: "Guadeloupe",
        gq: "Equatorial Guinea",
        gr: "Greece",
        gs: "South Georgia and the South Sandwich Islands",
        gt: "Guatemala",
        gu: "Guam",
        gw: "Guinea-Bissau",
        gy: "Guyana",
        hk: "Hong Kong",
        hm: "Heard Island and McDonald Islands",
        hn: "Honduras",
        hr: "Croatia",
        ht: "Haiti",
        hu: "Hungary",
        id: "Indonesia",
        ie: "Ireland",
        il: "Israel",
        im: "Isle of Man",
        in: "India",
        io: "British Indian Ocean Territory",
        iq: "Iraq",
        ir: "Iran",
        is: "Iceland",
        it: "Italy",
        je: "Jersey",
        jm: "Jamaica",
        jo: "Jordan",
        jp: "Japan",
        ke: "Kenya",
        kg: "Kyrgyzstan",
        kh: "Cambodia",
        ki: "Kiribati",
        km: "Comoros",
        kn: "Saint Kitts and Nevis",
        kp: "Korea (the Democratic People's Republic of)",
        kr: "Korea (the Republic of)",
        kw: "Kuwait",
        ky: "Cayman Islands",
        kz: "Kazakhstan",
        la: "Lao People's Democratic Republic",
        lb: "Lebanon",
        lc: "Saint Lucia",
        li: "Liechtenstein",
        lk: "Sri Lanka",
        lr: "Liberia",
        ls: "Lesotho",
        lt: "Lithuania",
        lu: "Luxembourg",
        lv: "Latvia",
        ly: "Libya",
        ma: "Morocco",
        mc: "Monaco",
        md: "Moldova",
        me: "Montenegro",
        mf: "Saint Martin",
        mg: "Madagascar",
        mh: "Marshall Islands",
        mk: "Republic of North Macedonia",
        ml: "Mali",
        mm: "Myanmar",
        mn: "Mongolia",
        mo: "Macao",
        mp: "Northern Mariana Islands",
        mq: "Martinique",
        mr: "Mauritania",
        ms: "Montserrat",
        mt: "Malta",
        mu: "Mauritius",
        mv: "Maldives",
        mw: "Malawi",
        mx: "Mexico",
        my: "Malaysia",
        mz: "Mozambique",
        na: "Namibia",
        nc: "New Caledonia",
        ne: "Niger",
        nf: "Norfolk Island",
        ng: "Nigeria",
        ni: "Nicaragua",
        nl: "Netherlands",
        no: "Norway",
        np: "Nepal",
        nr: "Nauru",
        nu: "Niue",
        nz: "New Zealand",
        om: "Oman",
        pa: "Panama",
        pe: "Peru",
        pf: "French Polynesia",
        pg: "Papua New Guinea",
        ph: "Philippines",
        pk: "Pakistan",
        pl: "Poland",
        pm: "Saint Pierre and Miquelon",
        pn: "Pitcairn",
        pr: "Puerto Rico",
        ps: "Palestine, State of",
        pt: "Portugal",
        pw: "Palau",
        py: "Paraguay",
        qa: "Qatar",
        re: "Réunion",
        ro: "Romania",
        rs: "Serbia",
        ru: "Russian Federation",
        rw: "Rwanda",
        sa: "Saudi Arabia",
        sb: "Solomon Islands",
        sc: "Seychelles",
        sd: "Sudan",
        se: "Sweden",
        sg: "Singapore",
        sh: "Saint Helena, Ascension and Tristan da Cunha",
        si: "Slovenia",
        sj: "Svalbard and Jan Mayen",
        sk: "Slovakia",
        sl: "Sierra Leone",
        sm: "San Marino",
        sn: "Senegal",
        so: "Somalia",
        sr: "Suriname",
        ss: "South Sudan",
        st: "Sao Tome and Principe",
        sv: "El Salvador",
        sx: "Sint Maarten (Dutch part)",
        sy: "Syrian Arab Republic",
        sz: "Eswatini",
        tc: "Turks and Caicos Islands",
        td: "Chad",
        tf: "French Southern Territories",
        tg: "Togo",
        th: "Thailand",
        tj: "Tajikistan",
        tk: "Tokelau",
        tl: "Timor-Leste",
        tm: "Turkmenistan",
        tn: "Tunisia",
        to: "Tonga",
        tr: "Turkey",
        tt: "Trinidad and Tobago",
        tv: "Tuvalu",
        tw: "Taiwan",
        tz: "Tanzania",
        ua: "Ukraine",
        ug: "Uganda",
        um: "United States Minor Outlying Islands",
        us: "United States of America",
        uy: "Uruguay",
        uz: "Uzbekistan",
        va: "Holy See",
        vc: "Saint Vincent and the Grenadines",
        ve: "Venezuela",
        vg: "Virgin Islands (British)",
        vi: "Virgin Islands (U.S.)",
        vn: "Viet Nam",
        vu: "Vanuatu",
        wf: "Wallis and Futuna",
        ws: "Samoa",
        ye: "Yemen",
        yt: "Mayotte",
        za: "South Africa",
        zm: "Zambia",
        zw: "Zimbabwe",
      },
      expanded: {},
      dialogActive: false,
      dialogSocial: {},
      dialogTextField: "",
      askInviteLoading: false,
      dDiscordActive: false,
      newDialogActive: false,
      newLoading: false,
      newType: "",
      newName: "",
      newPlatform: null,
      newCountry: [],
      newLanguage: null,
      newUserCount: null,
      newDescription: "",
      newInfoForInvite: "",
      newLink: "",
      types: ["private", "public"],
      brandDialog: false,
      countryDialog: false,
      searchFlag: "",
      brands: [
        "discord",
        "facebook",
        "icq",
        "instagram",
        "line",
        "linkedin",
        "mastodon",
        "messenger",
        "microsoftteams",
        "pinterest",
        "qq",
        "quora",
        "reddit",
        "signal",
        "sinaweibo",
        "skype",
        "slack",
        "snapchat",
        "telegram",
        "tiktok",
        "tumblr",
        "twitch",
        "x",
        "viber",
        "vk",
        "wechat",
        "whatsapp",
        "youtube"
      ],
      brandLabel: {
        googlehangouts: "Hangouts",
        icq: "ICQ",
        microsoftteams: "Teams",
        vk: "VK",
        qq: "QQ",
        whatsapp: "WhatsApp",
      },
      sentForReview: false
    }
  },
  watch: {},
  beforeMount() {
    this.user = this.$store.state.user;
    Object.keys(this.list).map(key => {
      Vue.set(this.expanded, key, false);
    })
    this.expanded.official = true;
    this.expanded.global = true;
    this.expanded.toApprove = true;

    this.searchCommunities();
  },
  mounted() {
    let vm = this;
    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })
  },
  computed: {
    filteredFlags() {
      if (!this.searchFlag) return this.flagNames;
      let filteredFlags = {};
      let input = this.searchFlag.toLowerCase();
      let inputArray = input.split(" ");

      Object.keys(this.flagNames).map(key => {
        let shouldPush = false;
        let shouldPushArr = [];

        if (input === key) return filteredFlags[key] = this.flagNames[key];

        inputArray.map(inp => {
          if (this.flagNames[key].toLowerCase().includes(inp)) shouldPushArr.push(inp);
        })
        if (shouldPushArr.length === inputArray.length) return filteredFlags[key] = this.flagNames[key];

      })

      return filteredFlags;
    },
    isValidSubmit() {
      if (!this.newType) return false;
      console.log(0);
      if (this.newType === 'private') {
        if (!this.newInfoForInvite) return false;
      }
      console.log(1);
      if (this.newType === 'public') {
        if (!this.newLink) return false;
      }
      console.log(2);
        
      if (!this.newPlatform) return false;
      console.log(3);
      if (this.newCountry.length === 0) return false;
      console.log(4);
      if (!this.newLanguage) return false;
      console.log(5);
      if (isNaN(this.newUserCount) || Number(this.newUserCount) < 0) return false;
      console.log(6);

      return true;
    }
  },
  methods: {
    searchCommunities() {
      this.loading = true;
      // return;

      axios.get(Vue.preUrl + "/searchCommunities")
      .then(res => {
        this.resetList();
        if (res.data.notApproved) {
          res.data.notApproved.map(x => {
            this.list.toApprove.push(x);
          })
        }

        // compute all countrys
        let listOfCountry = ["official"];
        res.data.approved.map(x => {
          if (!x.country || x.country.length === 0) {
            console.log("no country", x)
            return;
          }
          x.country.map(y => {
            listOfCountry.push(y);
          })
        })
        listOfCountry = [...new Set(listOfCountry)];
        listOfCountry.sort((a,b) => {
          return (this.flagNames[a] || "").localeCompare((this.flagNames[b] || ""));
        })
        listOfCountry.map(x => {
          this.list[x] = [];
          if (!this.expanded[x]) Vue.set(this.expanded, x, false);
        })

        // delivery countrys
        res.data.approved.map(x => {
          if (!x.country || x.country.length === 0) {
            return;
          }
          if (x.type === "official") {
            this.list.official.push(x);
            return;
          }

          x.country.map(y => {
            this.list[y].push(x);
          })

        })
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    socialClick(social, e) {
      if (e && e.shiftKey && (e.ctrlKey || e.metaKey) && this.user && this.user.mod) {
        this.forceShowDelete = true;
      }
      this.dialogActive = true;
      this.dialogSocial = social;
      this.dialogTextField = "";
    },
    submitInvite() {
      this.askInviteLoading = true;

      let params = {
        cid: this.dialogSocial.cid,
        askText: this.dialogTextField
      }

      axios.post(Vue.preUrl + "/askInviteCommunity", params)
      .then(res => {
        this.askInviteLoading = false;
        this.dialogActive = false;
        this.dialogTextField = "";

        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_requestSent')
        });
      })
      .catch(error => {
        this.askInviteLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })

    },
    newSubmit(flag) {
      if (flag) this.newCountry = [flag];
      this.newDialogActive = true;
    },
    newCountryClick() {
      if (this.newCountry.length > 3) {
        this.newCountry = this.newCountry.filter((x, ix) => ix <= 2);
        return;
      }
      // if (this.newCountry.length === 3) {
      //   this.countryDialog = false;
      // }
    },
    newTypeSet() {
      if (this.newType === "private" && (!this.user || !this.user.discordName)) {
        this.newType = null;
        this.newDialogActive = false;
        this.dDiscordActive = true;
      }
    },
    submitNewCommunity() {
      let params = {
        name: this.newName,
        platform: this.newPlatform,
        type: this.newType,
        language: this.newLanguage,
        country: this.newCountry,
        userCount: Number(this.newUserCount)
      }
      if (this.newDescription) params.description = this.newDescription;
      if (this.newType === "private") {
        params.infoForInvite = this.newInfoForInvite;
      }
      if (this.newType === "public") {
        params.link = this.newLink;
      }

      this.newLoading = true;

      axios.post(Vue.preUrl + "/updateCommunity", params)
      .then(res => {
        this.newLoading = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.user.mod ? this.$t('m_saveSuccess') : this.$t('m_sentReview')
        });
        this.newDialogActive = false;

        if (!this.user.mod) {
          window.scrollTo({ top: 0 });
          this.sentForReview = true;
        } else {
          this.loading = true;
          setTimeout(() => {
            this.searchCommunities();
          }, 3000);
        }

        setTimeout(() => {
          this.resetNew();
        }, 100);
      })
      .catch(error => {
        this.newLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    resetNew() {
      this.newLoading = false;
      this.newType = "";
      this.newName = "";
      this.newPlatform = null;
      this.newCountry = [];
      this.newLanguage = null;
      this.newUserCount = null;
      this.newDescription = "";
      this.newInfoForInvite = "";
      this.newLink = "";
    },
    resetList() {
      this.list = {
        toApprove: [],
        official: [],
        global: []
      }
      this.expanded = {
        toApprove: true,
        official: true,
        global: true
      }
    },
    scrollToBottom() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
    approveCommunity(community, isDelete = false) {
      let params = {
        cid: community.cid
      }
      if (isDelete) {
        params.isDelete = true;
      } else {
        params.isApprove = true;
      }

      this.loading = true;

      axios.post(Vue.preUrl + "/updateCommunity", params)
      .then(res => {
        // this.loading = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
        });
        this.dialogActive = false;
        setTimeout(() => {
          this.searchCommunities();
        }, 3000);
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    }
  },
  beforeDestroy() {
    this.unsubscribe();
  },
}
</script>

<style>
.MainCommunity_Group {
  margin: 40px auto;
}
.MainCommunity_Box {
  max-width: var(--nWidth);
  margin: 0px auto;
  display: grid;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.MainCommunity_BoxLoading {
  max-width: var(--nWidth);
  margin: 0px auto;
  display: grid;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.MainCommunity_Button.D_Button {
  font-size: 19px;
  --cl: 70%;
  color: hsl(var(--back-h), var(--back-s), var(--cl));
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0 12px;
  height: 100%;
  border-radius: 0;
  transition-duration: 0.15s;
}
.MainCommunity_Title {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 10px;
}
.MainCommunity_Item {
  display: block;
  width: 100%;
}
.D_Button.MainCommunity_GroupButton {
  width: 100%;
  font-size: 20px;
  justify-content: flex-start;
  padding: 0px 9px;
  overflow: hidden;
  height: 42px;
  margin-bottom: 3px;
  margin-top: 3px;
}
.D_Button.MainCommunity_GroupButton:not(:hover):not(.focus-visible) {
  --back-opac: 0.03;
  background-color: rgba(var(--back-color), var(--back-opac));
}
/* .MainCommunity_ItemActive .MainCommunity_GroupButton {
  color: #7b7b7b;
} */
.D_Button.MainCommunity_SubItem {
  flex-direction: column;
  width: 120px;
  /* height: 103px; */
  gap: 1px;
  justify-content: flex-start;
  padding: 2px 2px;
}
.D_Button.MainCommunity_SubItemPlus {
  justify-content: center;
  font-size: 20px;
}
.D_Button.MainCommunity_SubItemPlus i {
  opacity: 0.4;
}
.MainCommunity_SocialIcon {
  font-size: 40px;
  margin-bottom: 6px;
}
.MainCommunity_ExpandBlock {
  max-width: var(--nWidth);
}
.MainCommunity_SocialName {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.MainCommunity_SocialCount {
  opacity: 0.4;
}
.MainCommunity_SubPack {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  justify-content: center;
}
.MainCommunity_GroupFlagBox {
  margin-left: -9px;
  width: 56px;
  margin-right: 9px;
  display: flex;
  opacity: 0.4;
  overflow: hidden;
  transition-duration: 0.1s;
}
.MainCommunity_GroupButton.focus-visible .MainCommunity_GroupFlagBox, 
.MainCommunity_GroupButton:hover .MainCommunity_GroupFlagBox,
.MainCommunity_ItemActive .MainCommunity_GroupFlagBox {
  opacity: 1;
} 
.MainCommunity_GroupFlag {

}
.MainCommunity_GroupLabel {
  margin-right: 7px;
  flex-grow: 1;
  text-align: left;
}
.MainCommunity_DialogLink {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.MainCommunity_DialogLinkButton {
  min-width: 150px;
}
.MainCommunity_DialogLinkSub {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 8px;
}
.MainCommunity_DialogTitle {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.MainCommunity_DialogFlag {
  width: 37px;
}
.MainCommunity_DialogFlagGlobal {
  margin: 0 -7px;
}
.MainCommunity_DialogTitleIcon {
  font-size: 28px;
}
.MainCommunity_DialogTitleRight {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  margin-left: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.MainCommunity_DialogMid {
  display: flex;
  gap: 5px 25px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
.MainCommunity_DialogInfoLabel {
  font-size: .8em;
  color: #777;
}
.MainCommunity_DialogInfoValue {
  color: var(--d-text-b);
  word-break: break-word;
}
.MainCommunity_DialogInviteNeeded {
  font-size: 13px;
  background-color: #a9904129;
  box-shadow: inset 0 0 0 2px #ffe39417;
  padding: 8px 10px;
  border-radius: 10px;
  margin: 10px 40px;
  color: #cdc2a3;
  text-align: center;
}
.MainCommunity_DialogInviteTitle {
  font-size: .8em;
  color: #777;
  text-align: center;
}
.MainCommunity_Footer {
  margin-top: 30px;
  margin-bottom: 50px;
}
.MainCommunity_NewBoxCenter {
  display: flex;
  justify-content: space-evenly;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}
.MainCommunity_DialogBrandList {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}
.MainCommunity_Capitalize::first-letter {
  text-transform: capitalize;
}
.MainCommunity_DialogBrandBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.MainCommunity_DialogBrandIcon {
  font-size: 20px;
}
.MainCommunity_BrandChip.BaseChip {
  height: unset;
  background-color: #0000;
}
.MainCommunity_BrandSelectIcon {
  font-size: 40px;
}
.MainCommunity_DialogSumitLayout {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.MainCommunity_DialogSubmitInner {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
.MainCommunity_NewTypeToSelect {
  position: absolute;
  top: 0;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 100%;
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 1fr;
}
.MainCommunity_DialogSubmitInnerNoType .MainCommunity_NewTypeToSelect {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.MainCommunity_DialogSubmitChipType {
  flex-grow: 1;
  min-height: 46px;
}
.MainCommunity_DialogSubmitChipType .BaseChip_Text {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
}
.MainCommunity_DialogSubmitInnerNoType .MainCommunity_DialogSubmitChipType {
  min-height: 120px;
}
.MainCommunity_DialogSubmitInnerWithType .MainCommunity_DialogSubmitTypeSub {
  display: none;
}
.MainCommunity_DialogSubmitTypeSub {
  font-size: 0.7em;
  opacity: 0.7;
  white-space: pre-wrap;
}
.MainCommunity_NewTypeToSelect + * {
  margin-top: calc(46px + 15px);
}
.MainCommunity_DialogFlagList {
  display: flex;
  flex-direction: column;
  
}
.MainCommunity_FlagChip {
  justify-content: left;
  padding: 0;
  background-color: #0000;
}
.MainCommunity_DialogFlagBox {
  display: flex;
  align-items: center;
  gap: 10px;
}
.MainCommunity_DialogFlagSearchLayout {

}

.MainCommunity_DialogFlagSearch {
  position: relative;
  flex-grow: 10;
  padding: 0;
  margin-bottom: 10px;
}
.MainCommunity_DialogFlagSearchInput {
  height: 55px;
  padding-left: 15px;
}

.MainCommunity_DialogFlagSearchInputClose {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1em;
}
.MainCommunity_DialogFlagSearchInputClose.D_Button:active:not(.D_ButtonNoActive) {
  transform: translateY(-42%);
}
.MainCommunity_SubmitFlagGroupButton {
  display: flex;
  gap: 5px;
  padding: 3px 9px;
  min-height: 50px;
}
.MainCommunity_SubmitSocialIconButton {
  font-size: 30px;
}
.MainCommunity_Text {
  display: flex;
  flex-direction: column;
}
.MainCommunity_TextDual {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.MainCommunity_SentForReview {
  max-width: var(--nWidth);
  margin: 0px auto;
  margin-bottom: 20px;
  text-align: center;
  color: rgb(var(--d-text-green));
}
</style>