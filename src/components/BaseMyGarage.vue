<template>
  <div class="BaseMyGarage_Root">
    <div
      v-if="screen === 'normal'"
      :class="{ MainTimeline_InitAnimation: animation }"
      class="BaseMyGarage_Layout">
      <!-- <div class="BaseMyGarage_" style="white-space: pre;">{{ userGarage }}</div> -->

      <!-- <div class="BaseMyGarage_CarList">
        <div v-for="card in userGarage.playerDeck" class="BaseMyGarage_CardBox">
          <BaseCardGallery
            :car="resolvedRids[card.rid]"
            :options="false"
            :tuneText="card.tun"
            class="BaseMyGarage_GalleryCard" />
        </div>
      </div> -->

      <div v-if="loading || lastestLoading" class="BaseMyGarage_LoadingBox BaseMyGarage_HLBox">
        <!-- LOADING -->
        <div class="BaseMyGarage_LoadingUsername"></div>
        <div class="BaseMyGarage_LoadingTitle"></div>
        <div class="BaseMyGarage_RarityStatsBox">
          <div v-for="n in 11" class="BaseMyGarage_RarityStatsItem"></div>
        </div>
      </div>

      <template v-else>
        <!-- MAIN -->
        <div class="MainShowcase_SaveBar D_Center2">
          <button
            v-if="!userId"
            class="D_Button Main_LoginToEdit"
            @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
          <div v-else-if="(userGarage && userGarage.loaded) || !editEnabled" :class="`Main_UserT${highlightsUsers[userId]}`" class="MainShowcase_TitleBox">
            <BaseIconSvg type="laurel" />
            <div class="MainShowcase_Title">{{ userId }}</div>
            <div v-if="userGarage.eloScore" class="BaseMyGarage_UserBottom">
              <div class="BaseMyGarage_UserBottomItem"><i class="ticon-trophy" style="font-size: 0.9em;" aria-hidden="true"/>{{ userGarage.eloScore }}</div>
              <div> • </div>
              <div class="BaseMyGarage_UserBottomItem">{{ userGarage.region }}</div>
            </div>
            <BaseIconSvg type="laurel" />
          </div>
          <button
            v-else-if="editEnabled"
            class="D_Button Main_SaveAllButton"
            @click="changeScreen('upload')">
            <span>{{ $t("m_uploadMyGarage") }}</span>
          </button>
        </div>


        <!-- <div v-if="false" class="BaseMyGarage_H">
          <RecycleScroller
            :items="userGarage.playerDeck"
            :item-size="300"
            :item-secondary-size="186"
            :emitUpdate="true"
            :gridItems="2"
            direction="horizontal"
            listClass="BaseMyGarage_CardsWrapper"
            itemClass="BaseMyGarage_ScrollerItem"
            class="BaseMyGarage_CardsBox Main_DarkScroll"
            @scrollEnd="">
            <template v-slot="{ item, index, active }">
              <div class="BaseMyGarage_CardBox">
                <BaseCardGallery
                  :car="resolvedRids[item.rid]"
                  :options="false"
                  :tuneText="item.tun || item.tunZ"
                  class="BaseMyGarage_GalleryCard" />
              </div>
            </template>
          </RecycleScroller>
        </div> -->


        <div class="BaseMyGarage_HLBox">

          <DynamicScroller
            :items="userHighlightsFiltered"
            :min-item-size="600"
            :buffer="800"
            :emit-update="true"
            key-field="id"
            listClass="BaseMyGarage_HlWrapper"
            itemClass="BaseMyGarage_HLItem"
            class="Main_DarkScroll"
            page-mode
            @update="onUpdate">
            <template v-slot="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="[
                  pngLoading
                ]"
                :data-index="index">
                <template v-if="item.divider">
                  <div class="D_Center2">
                    <i class="ticon-line BaseMyGarage_HLItemDivider" aria-hidden="true"/>
                  </div>
                </template>

                <template v-else>
                  <div class="BaseMyGarage_FilterLayout">
                    <div class="BaseMyGarage_FilterBox">
                      <div v-if="item.title" :class="{ BaseMyGarage_FilterBoxSpecial: item.specialTitle}" class="BaseFilterDescription_Layout">
                        <div v-if="item.specialTitle" class="BaseMyGarage_DividerBackLight" style="--light: var(--d-text-yellow);"></div>
                        <div class="BaseFilterDescription_Item">
                          <div class="BaseFilterDescription_Value">{{ item.title }}</div>
                        </div>
                      </div>
                      <div
                        v-else-if="Object.keys(item.filter).length === 0"
                        class="BaseMyGarage_EmptyFilter">
                      </div>
                      <BaseFilterDescription
                        v-else
                        :filter="item.filter"
                        :asFilterLabel="true"
                        :hideIfEmpty="false"
                        :showTitle="false"
                        :emitDescResolved="false"
                        class="" />
                    </div>
                    <div v-if="!pngLoading" class="BaseMyGarage_SideButtons">
                      <button
                        v-if="item.id === 0 && userGarage.loaded && editEnabled"
                        class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu BaseMyGarage_Camera"
                        @click="calcLink(); openConfig();">
                        <i class="ticon-gear Main_MenuIcon" aria-hidden="true"/>
                      </button>
                      <button
                        v-if="userGarage.loaded"
                        class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu BaseMyGarage_Camera"
                        @click="sharePrint(item)">
                        <i class="ticon-camera1 Main_MenuIcon" aria-hidden="true"/>
                      </button>
                      <button
                        v-if="item.canDelete"
                        class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu BaseMyGarage_Camera"
                        @click="deleteHl(item)">
                        <i class="ticon-trash Main_MenuIcon" aria-hidden="true"/>
                      </button>
                    </div>
                  </div>

                  <div v-if="item.r" class="BaseMyGarage_RarityStatsBox">
                    <template v-for="(value, key, index) in item.r">
                      <div class="BaseMyGarage_RarityStatsItem">
                        <div class="BaseMyGarage_RarityStatsValue">
                          <div class="BaseMyGarage_RarityStatsValueT">{{ value }}</div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsName">{{ $tc(`m_${key}`,1) }}</div>
                      </div>
                    </template>
                  </div>

                  <div v-if="item.t" class="BaseMyGarage_RarityStatsBox BaseMyGarage_RarityStatsBoxCars">
                    <template v-for="(value, key, index) in item.t">
                      <button
                        class="BaseMyGarage_RarityStatsItem BaseMyGarage_RarityStatsButton"
                        @click="tileClick(item, key)">
                        <div class="BaseMyGarage_RarityStatsCard">
                          <BaseCardGallery
                            v-if="value.car.rid"
                            :car="resolvedRids[value.car.rid]"
                            :options="false"
                            :tuneText="value.car.tun || value.car.tunZ"
                            class="BaseMyGarage_GalleryCard" />
                          <div v-else class="BaseMyGarage_CarPlaceHolder Row_DialogCardCard2">
                            <i class="ticon-line" aria-hidden="true"/>
                          </div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsValue">
                          <div class="BaseMyGarage_RarityStatsValueT">{{ typeof value.v === 'string' ? value.v : value.v % 1 != 0 ? value.v >= 100 ? Math.round(value.v) : Math.round(value.v * 10)/10 : value.v }}{{ value.sf }}</div>
                          <div v-if="value.sub" class="BaseMyGarage_RarityStatsSub">{{ value.sub }}</div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsName">{{ $tc(`m_${key}`,1) }}</div>

                        <!-- <template v-if="value.car.cardId">
                          <span>{{ resolvedRids[value.car.cardId].name }} </span>
                          <span v-if="key.includes('Rate')">({{ Math.round(value.v) }}%)</span>
                          <span v-else>({{ value.v }})</span>
                        </template> -->

                      </button>
                    </template>
                  </div>

                  <div v-if="item.tl" class="BaseMyGarage_TimelineBox">
                    <div v-for="month in item.tl" class="BaseMyGarage_TimelineItem">
                      <div class="BaseMyGarage_MonthLeft">{{ new Date(2024, month.monthIndex, 1).toLocaleString('default', { month: 'short' }) }}</div>
                      <div v-if="!pngLoading && true" class="BaseMyGarage_MonthRight">
                        <div class="BaseMyGarage_MonthTop">
                          <BaseCardGallery
                            v-for="car in month.prizes"
                            :car="resolvedRids[car.rid]"
                            :options="false"
                            class="BaseMyGarage_GalleryCard" />
                        </div>
                        <div class="BaseMyGarage_MonthMid">
                          <BaseCardGallery
                            v-for="car in month.nonPrizes"
                            :car="resolvedRids[car.rid]"
                            :options="false"
                            class="BaseMyGarage_GalleryCard" />
                        </div>
                      </div>
                      <div v-else class="BaseMyGarage_MonthRight">
                        <div class="BaseMyGarage_MonthTop">
                          <div v-for="car in month.prizes" class="MainFindCar_CarCard" :style="`--color: ${resolvedRids[car.rid].color}`">
                            <div class="MainFindCar_BankPhoto">
                              <img :src="resolvedRids[car.rid].photo" class="MainFindCar_BankPhotoImg" loading="lazy" alt="">
                            </div>
                            <div class="MainFindCar_RQ">{{ resolvedRids[car.rid].rq }}</div>
                          </div>
                        </div>
                        <div class="BaseMyGarage_MonthMid">
                          <div v-for="car in month.nonPrizes" class="MainFindCar_CarCard" :style="`--color: ${resolvedRids[car.rid].color}`">
                            <div class="MainFindCar_BankPhoto">
                              <img :src="resolvedRids[car.rid].photo" class="MainFindCar_BankPhotoImg" loading="lazy" alt="">
                            </div>
                            <div class="MainFindCar_RQ">{{ resolvedRids[car.rid].rq }}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </template>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>


          <!-- <template v-for="(hl, ihl) in userHighlights">
            <div
              v-if="(!pngLoading || pngIndex === ihl) && (userGarage.loaded || ihl === 0)"
              class="BaseMyGarage_HLItem">

              

            </div>
          </template> -->
        </div>

        <div v-if="userGarage && userGarage.loaded" class="D_Center2 BaseMyGarage_AddGroupBox">
          <button class="D_Button BaseMyGarage_AddGroupButton" @click="newGroup('group')">
            <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
            <span class="">{{ $t('m_newGroup') }}</span>
          </button>
          <button class="D_Button BaseMyGarage_AddGroupButton" @click="newTimeline()">
            <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
            <span class="">{{ $t('m_newTimeline') }}</span>
          </button>
        </div>
      </template>


      
    </div>
    <div
      v-else-if="screen === 'upload'"
      :class="{ MainTimeline_InitAnimation: animation }"
      class="BaseMyGarage_UploadLayout">
      <div class="BaseMyGarage_UploadMid Space_TopPlus">
        <!-- How it works -->
        <BaseMyGarageTutorial class="BaseMyGarage_Tutorial"/>
        <div class="BaseMyGarage_TextBox">
          <div class="BaseText_Label">Response body of /api/game/v3/sync/</div>
          <textarea
            v-model="responseText"
            rows="8"
            class="Main_TextArea data-hj-allow"
            placeholder="Paste here..."
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            @paste="interceptPaste($event)"
          />
        </div>
        <div class="BaseMyGarage_Submit D_Center2 Space_TopPlus">
          <button
            :class="{ D_Button_Loading: loading }"
            :disabled="!responseText"
            class="D_Button Main_SaveAllButton"
            @click="validateText()">
            <span>{{ $t("m_uploadMyGarage") }}</span>
          </button>
        </div>
      </div>
      <div class="D_Center2 Space_TopPlus">
        <button
          :class="{ D_Button_Loading: loading }"
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="changeScreen('normal')">
          <span>{{ $t("m_cancel") }}</span>
        </button>
      </div>
    </div>

    <BaseFilterDialog
      v-model="myGarageFilterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      :config="{
        customTags: false
      }"
      importFilterName="MYGARAGE_INTERNALFILTER_IMPORT"
      ref="myGarageFilter"
      ridsMutationName="FILTER_PACKS_LIMITS"
      @clearFilterUpdate="newGroupFinish($event)"
    />


    <BaseDialog
      :active="confirmDelete.dialog"
      :transparent="false"
      :lazy="true"
      zindex="101"
      max-width="420px"
      min-width="240px"
      @close="confirmDelete.dialog = false;">
      <div style="Main_DialogConfirm">
        <div class="Main_DialogMessage" style="white-space: pre-wrap;">{{ confirmDelete.msg }}</div>
        <div class="Main_DialogBottom">
          <button
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.dialog = false;">
            <span>{{ $t("m_cancel") }}</span>
          </button>
          <button
            v-if="confirmDelete.action"
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

    <BaseDialog
      :active="configDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="configDialog = false;">
      <div class="BaseMyGarage_ConfigDialogBox">
        <div class="Main_DialogTitle" style="margin-bottom: 30px;">{{ $t('m_myGarage') }}</div>
        <div class="BaseMyGarage_ConfigDialogTop">
          <div v-for="item in privacyList" class="BaseMyGarage_PrivacyItem">
            <BaseSwitch
              :value="privacyModel === item"
              :label="$t(`m_${item}`)"
              :horizontal="true"
              :disabled="privacyLoading"
              :loading="privacyLoading"
              @click="privacySet(item)" />
            <div class="BaseMyGarage_DialogSubmitTypeSub">{{ $t(`p_${item}GarageDesc`) }}</div>
          </div>
        </div>
        <div class="BaseMyGarage_ConfigDialogFooter D_Center2 Space_TopGiga">
          <button
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="changeScreen('upload')">
            <span>{{ $t("m_updateGarage") }}</span>
          </button>
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
            @click="askDelete()">
            <span>{{ $t("m_delete") }}</span>
          </button>
        </div>
        <div class="BaseMyGarage_ShareLink Space_TopGiga">
          <div class="Main_DialogTitle">{{ $t("m_sharableLink") }}</div>
          <div class="Main_ShareLinkBox">
            <textarea
              :value="privacyModel === 'public' ? shareUrl : 'Private'"
              id="shareLinkGarage"
              rows="3"
              class="Main_ShareLinkInput data-hj-allow"
              readonly="readonly" />
            <button
              :class="{ D_Button_Correct: copyUrlSucess }"
              :disabled="copyUrlSucess"
              style="font-size: 16px;"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="copyUrl()">{{ $t("m_copy") }}</button>
          </div>
        </div>
      </div>
    </BaseDialog>

    <BaseDialog
      :active="yearDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="yearDialog = false;">
      <div class="BaseMyGarage_ConfigDialogBox">
        <div class="Main_DialogTitle" style="margin-bottom: 30px;">{{ $tc('c_year', 1) }}</div>
        <div class="D_Center2 Space_TopGiga" style="flex-wrap: wrap;">
          <button
            v-for="year in yearList"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="confirmYear(year)">
            <span>{{ year }}</span>
          </button>
        </div>
      </div>
    </BaseDialog>

    <BaseDialog
      :active="orderedDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="orderedDialog = false;">
      <div v-if="orderedKey" class="BaseMyGarage_OrderedLayout">
        <div class="BaseMyGarage_OrderedHeader">
          <div class="Main_DialogTitle">{{ $tc(`m_${orderedKey}`,1) }}</div>
        </div>
        <RecycleScroller
          :items="orderedList"
          :item-size="111"
          :buffer="800"
          key-field="id"
          listClass="BaseMyGarage_CardsWrapper"
          itemClass="BaseMyGarage_ScrollerItem"
          class="Main_DarkScroll"
          page-mode>
          <template v-slot="{ item, index, active }">
            <div class="BaseMyGarage_ListLayout">
              <div class="BaseMyGarage_VerticalCardBox">
                <BaseCardGallery
                  :car="resolvedRids[item.car.rid]"
                  :options="false"
                  :tuneText="item.car.tun || item.car.tunZ"
                  class="BaseMyGarage_GalleryCard" />
              </div>
              <div class="BaseMyGarage_OrderedRight">
                <div class="BaseMyGarage_OrderedCount">#{{ index+1 }}</div>
                <div class="BaseMyGarage_RarityStatsValue">
                  <div class="BaseMyGarage_RarityStatsValueT">{{ typeof item.v === 'string' ? item.v : item.v % 1 != 0 ? item.v >= 100 ? Math.round(item.v) : Math.round(item.v * 10)/10 : item.v }}{{ orderedSuffix }}</div>
                  <div v-if="item.sub" class="BaseMyGarage_RarityStatsSub">{{ item.sub }}</div>
                </div>
              </div>
            </div>
          </template>
        </RecycleScroller>
        <!-- <div v-for="item in orderedList" class="BaseMyGarage_OrderedItem">
          <div class="BaseMyGarage_RarityStatsCard">
            <BaseCardGallery
              :car="resolvedRids[item.car.rid]"
              :options="false"
              :tuneText="item.car.tun || item.car.tunZ"
              class="BaseMyGarage_GalleryCard" />
          </div>
          <div class="BaseMyGarage_OrderedRight"></div>
        </div> -->
      </div>
    </BaseDialog>

  </div>
</template>

<script>
try {
  var myGarage = require('@/database/hutch_myGarage.json')
} catch (error) {}

import all_cars from '../database/cars_final.json';
import BaseCardGallery from './BaseCardGallery.vue';
import BaseDialog from './BaseDialog.vue';
import BaseFilterDialog from './BaseFilterDialog.vue';
import BaseFilterDescription from './BaseFilterDescription.vue';
import BaseIconSvg from './BaseIconSvg.vue';
import BaseSwitch from './BaseSwitch.vue';
import BaseMyGarageTutorial from './BaseMyGarageTutorial.vue';

class hlCar {
  constructor(initialValue = 0, suffix = "") {
    this.car = {};
    this.v = initialValue;
    this.used = 0;
    this.sf = suffix;
  }
}
class rarityStats {
  constructor() {
    this.carCount = 0;
    this.fullyUpgraded = 0;
    this.prizes = 0;
    this.nonPrizes = 0;
    this.nonPrizesMissing = 0; //late
    this.count332 = 0;
    this.count323 = 0;
    this.count233 = 0;
  }
}
class groupStats {
  constructor() {
    this.mostUsed = new hlCar();
    this.mostWins = new hlCar();
    this.mostLoses = new hlCar();
    this.highWinRate = new hlCar(0, "%");
    this.highLoseRate = new hlCar(0, "%");
    this.oldest = new hlCar(0, " days");
    this.oldestNoUse = new hlCar(0, " days");
    this.lessUseDay = new hlCar(null);
    this.mostUseDay = new hlCar(0, "/day");
    this.mostWinDay = new hlCar(0, "/day");
    this.mostLoseDay = new hlCar(0, "/day");
  }
}
class timeline {
  constructor(monthIndex) {
    this.monthIndex = monthIndex;
    this.prizes = [];
    this.nonPrizes = [];
  }
}

export default {
  name: 'BaseMyGarage',
  components: {
    BaseCardGallery,
    BaseDialog,
    BaseFilterDialog,
    BaseFilterDescription,
    BaseIconSvg,
    BaseSwitch,
    BaseMyGarageTutorial
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      lastestLoading: false,
      screen: "normal",
      animation: false,
      user: null,
      responseText: "",
      all_cars,
      all_cars_obj: {},
      highlightsUsers: {},
      carsReady: false,
      userGarage: {},
      myGarageFilterDialog: false,
      resolvedRids: {},
      guidToRid: {},
      unsubscribe: null,
      saved: false,
      confirmDelete: {
        dialog: false,
        msg: "Confirm delete?",
        actionLabel: "Delete",
        action: null,
        loading: false,
        classe: ""
      },
      privacyModel: "public",
      privacyList: ["public", "private"],
      privacyLoading: false,
      configDialog: false,
      editGroupIndex: -1,
      saved: false,
      blankFilterStr: "",
      pngLoading: false,
      printingItem: null,
      orderedDialog: false,
      orderedList: [],
      orderedKey: "",
      orderedSuffix: "",
      updateParts: { viewStartIdx: 0, viewEndIdx: 0, visibleStartIdx: 0, visibleEndIdx: 0 },
      newGroupType: "group",
      yearList: [],
      yearModel: "",
      yearDialog: false,
      shareUrl: "",
      copyUrlSucess: false,
      userHighlights: [
        {
          id: 0,
          fixed: true,
          filter: { newerThan: "2024-01-01T00:00:00.000Z", olderThan: "2024-12-31T23:59:59.000Z" },
          t: new groupStats(),
          title: "My cars of 2024",
          specialTitle: true
        },
        {
          id: 1,
          fixed: true,
          filter: { classesModel: ["S"], newerThan: "2024-01-01T00:00:00.000Z", olderThan: "2024-12-31T23:59:59.000Z" },
          tl: Array.from({length: 12}, (_, i) => new timeline(i)),
          title: "2024 Leggy Timeline",
          specialTitle: true
        },
        {
          id: 2,
          divider: true,
          share: true
        },
        {
          id: 3,
          fixed: true,
          filter: {},
          t: new groupStats(),
          r: new rarityStats(),
          title: "Garage",
          specialTitle: true
        },
        {
          id: 4,
          filter: { classesModel: ["S"] },
          t: new groupStats()
        },
        {
          id: 5,
          filter: { classesModel: ["A"] },
          t: new groupStats()
        },
        {
          id: 6,
          filter: { classesModel: ["B"] },
          t: new groupStats()
        },
        {
          id: 7,
          filter: { classesModel: ["C"] },
          t: new groupStats()
        },
        {
          id: 8,
          filter: { classesModel: ["D"] },
          t: new groupStats()
        },
        {
          id: 9,
          filter: { classesModel: ["E"] },
          t: new groupStats()
        },
        {
          id: 10,
          filter: { classesModel: ["F"] },
          t: new groupStats()
        },
        {
          id: 11,
          filter: { classesModel: ["A", "B", "C", "D", "E", "F"], prizesModel: ["Prize Cars"] },
          t: new groupStats()
        },
        { id: 12, filter: { tyresModel: ["Standard"] }, t: new groupStats() },
        { id: 13, filter: { tyresModel: ["All-surface"] }, t: new groupStats() },
        { id: 14, filter: { tyresModel: ["Off-road"] }, t: new groupStats() },
        { id: 15, filter: { clearancesModel: ["Mid"] }, t: new groupStats() },
        { id: 16, filter: { countrysModel: ["US"] }, t: new groupStats() },
        { id: 17, filter: { countrysModel: ["DE"] }, t: new groupStats() },
        { id: 18, filter: { countrysModel: ["JP"] }, t: new groupStats() },
        { id: 19, filter: { countrysModel: ["GB"] }, t: new groupStats() },
        { id: 20, filter: { countrysModel: ["IT"] }, t: new groupStats() },
        { id: 21, filter: { countrysModel: ["FR"] }, t: new groupStats() },
        { id: 22, filter: { countrysModel: ["AU"] }, t: new groupStats() },
        { id: 23, filter: { countrysModel: ["SE"] }, t: new groupStats() },
        { id: 24, filter: { countrysModel: ["KR"] }, t: new groupStats() },
        { id: 25, filter: { countrysModel: ["CZ"] }, t: new groupStats() },
        { id: 26, filter: { tagsModel: ["European Grand Tour"] }, t: new groupStats() },
        { id: 27, filter: { tagsModel: ["American Overdrive"] }, t: new groupStats() },
        { id: 28, filter: { tagsModel: ["European New Wave"] }, t: new groupStats() },
        { id: 29, filter: { tagsModel: ["Asia-Pacific Grand Prix"] }, t: new groupStats() },
        { id: 30, filter: { tagsModel: ["Pacific Coast Highway"] }, t: new groupStats() },
        { id: 31, filter: { tagsModel: ["Learn the Savannah Way"] }, t: new groupStats() },
        { id: 32, filter: { tagsModel: ["Loch to Loch"] }, t: new groupStats() },
        { id: 33, filter: { tagsModel: ["Amalfi Coast Cruising"] }, t: new groupStats() },
        { id: 34, filter: { tagsModel: ["Enter the Black Forest"] }, t: new groupStats() },
        { id: 35, filter: { tagsModel: ["World Expo"] }, t: new groupStats() },
      ],
      tutorialModel: [],
      tutorial: {
        screen: [
          ["header"],
          ["button1", "button2"]
        ],
        header: {
          type: "text",
          text: "Choose a method"
        },
        button1: {
          type: "button",
          text: "PC + Android Emulator",
          icon: "brand-android",
          target: "pcAndroid"
        },
        button2: {
          type: "button",
          text: "PC + iOS",
          icon: "brand-apple",
          target: "pciOS"
        },
        childs: {
          pcAndroid: {
            screen: [
              ["header"],
              ["button1", "button2"]
            ],
            header: {
              type: "text",
              text: "Choose a method"
            },
            button1: {
              type: "button",
              text: "PC + Android Emulator",
              icon: "brand-android",
              target: "pcAndroid"
            },
            button2: {
              type: "button",
              text: "PC + iOS",
              icon: "brand-apple",
              target: "pciOS"
            }
          }
        }
      }
    }
  },
  watch: {},
  beforeCreate() {
    window.localStorage.setItem("myGarage_1", "t");
    console.log(`${Math.round(window.performance.memory.usedJSHeapSize/1000000)} MB`);
  },
  beforeMount() {
    this.user = this.$store.state.user;
    this.getLastest();
  },
  mounted() {
    let vm = this;
    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
        if (vm.$route.name === "BaseMyGarage") {
          vm.load();
        }
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })

    this.generateBlankFilter();

    if (false) { // TEMP
      var t0 = performance.now();
      this.processSyncObj(myGarage);
      var t1 = performance.now();
      console.log(`${Math.round(t1 - t0)} ms • ${Math.round(window.performance.memory.usedJSHeapSize/1000000)} MB`);
    }

    this.$store.commit("START_LOGROCKET", {});
    
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    userId() {
      return this.$route.name === "BaseMyGarage" ? (this.user || {}).username : this.$route.params.username;
    },
    readyToSave() {
      if (!this.editEnabled) return false;
      console.log(0)
      if (this.saved) return false;
      console.log(1)
      return false

      return true;
    },
    editEnabled() {
      return this.user && this.user.username && (this.$route.name === "BaseMyGarage" || this.$route.params.username === this.user.username);
    },
    pngLabel() {
      return this.pngLoading ? this.$t("m_pleaseWait3dot") : this.$t("m_downloadPng")
    },
    userHighlightsFiltered() {
      if (this.printingItem) return [this.printingItem];
      return this.userHighlights.filter((hl, ihl) => (this.userGarage.loaded || ihl === 0));
    }
  },
  methods: {
    getLastest() {
      let vm = this;
      this.lastestLoading = true;


      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;

        this.highlightsUsers = Vue.resolveHighlightsUsers(res.data);

        let incomingCars = res.data.find(x => x.id === 'newCars').value;
        if (incomingCars && incomingCars.length > 0) {
          let rids = this.all_cars.map(x => x.rid);

          incomingCars.map(car => {
            if (!!(car.photoId && car.rq && car.onlyName && car.brand && car.country && car.year && car.clearance && car.topSpeed && car.hand && car.drive && car.tyres && car.weight && car.tags && car.bodyTypes && car.fuel && car.seats && car.engine)) {
              if (!rids.includes(car.rid)) {
                this.all_cars.push(car);
              }
            }
          })

          this.all_cars.sort((a,b) => {
            return b.rq - a.rq;
          })
        }


        if (!this.loading && !this.userGarage.date) {
          this.load();
        }


      })
      .catch(error => {
        this.lastestLoading = false;
        console.log(error);
      });

    },
    reload() {
      setTimeout(() => {
        this.load();
      }, 10);
    },
    load() {
      if (!this.userId) return;
      this.loading = true;

      axios.post(Vue.preUrl + "/getGarage", {
        username: this.userId,
        year: 2024
      })
      .then(res => {
        this.loading = false;
        this.saved = false;
        if (res.status === 204) {
          // private garage
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: "Private garage",
            type: "error"
          });
        }
        if (res.data) {
          if (res.data.privacy) {
            this.privacyModel = res.data.privacy;
          }
          if (res.data.value) {
            this.userGarage = res.data.value;
            this.processPlayerDeckStep2();
          }
        }
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
    save() {
      this.loading = true;

      axios.post(Vue.preUrl + "/setGarage", this.userGarage)
      .then(res => {
        this.loading = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
        });
        this.saved = true;
        this.responseText = "";
        
        // finish
        this.processPlayerDeckStep2();
        this.changeScreen('normal');

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
    addToResolvedRids(rid) {
      if (!this.resolvedRids[rid]) {
        let preCar = this.all_cars_obj[rid];
        if (preCar) {
          preCar.color = Vue.resolveClass(preCar.rq, preCar.class, "color");
          preCar.colorRgb = Vue.resolveClass(preCar.rq, preCar.class, "color", true);
          preCar.photo = this.cgResolvePhotoUrl(preCar);
          this.resolvedRids[rid] = preCar;
        }
      }
    },
    cgResolvePhotoUrl(car) {
      try {
        if (car.photoId) return require('@/incoming_pics/' + decodeURI(car.photoId) + '.jpg')
        else return require('@/imgs_final/' + decodeURI(car.rid) + '.jpg')
      } catch (error) {
        return ''
      }
    },
    processSyncObj(obj) {
      let isError;
      { // validation
        if (typeof obj !== "object") isError = "Not object";
        if (!obj.serverTime) isError = "No basic property";
        if (!obj.user) isError = "No user property";
        if (!obj.wishlists || obj.wishlists.length !== 1) isError = "No wishlists";
        if (!obj.dailyGift) isError = "No dailyGift";
        if (!obj.playerDeck || obj.playerDeck.length < 1) isError = "No playerDeck";
        if (isError) {
          if (isError === "No playerDeck") {
            this.noPlayerDeck();
            return;
          }
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: `Not a valid input: ${isError}`,
            type: "error"
          });
          return;
        }
      }

      this.userGarage = {
        date: obj.serverTime,
        region: obj.user.region,
        registrationDate: obj.user.registrationDate,
        raceQuota: obj.user.raceQuota,
        eloScore: obj.user.eloScore,
        garageSlots: obj.user.garageSlots,
        garageSlotsUsed: obj.user.garageSlotsUsed,
        activeDaysCounter: obj.user.activeDaysCounter,
        platform: obj.user.platform,
        totalGiftsClaimed: obj.dailyGift.totalGiftsClaimed,
        wishlists: obj.wishlists[0]
      };

      if (!this.carsReady) this.transformAllCarsToObj();
      this.userGarage.playerDeck = this.processPlayerDeck(obj.playerDeck);

      // console.log(this.userGarage);
      return true;
    },
    processPlayerDeck(deck) {
      let result = [];

      deck.map((hCar, icar) => {
        this.addToResolvedRids(this.guidToRid[hCar.cardId]);
        let tunZ = this.resolveTuneZ(hCar);

        let item = {
          // tun: this.resolveTune(hCar, tunZ),
          // locked: hCar.locked,
          // fuseCompletesAt: hCar.fuseCompletesAt,
          // legT: hCar.legacyTier,
          rid: this.guidToRid[hCar.cardId],
          tunZ: tunZ,
          date: hCar.holdExpiresAt.slice(0,10),
          cW: hCar.cardWins,
          cL: hCar.cardLosses,
          cD: hCar.cardDraws
        }
        result.push(item);
      })

      return result;
    },
    processPlayerDeckStep2() {
      if (!this.carsReady) this.transformAllCarsToObj();

      this.userGarage.playerDeck.map((hCar, icar) => {

        hCar.id = icar;
        hCar.tun = this.resolveTune(hCar, hCar.tunZ);

        this.addToResolvedRids(hCar.rid);


        if (icar < 500 || true) {
          this.updateHighLights(hCar);
        }
      })

      this.userGarage.loaded = true;

      this.finishProcessPlayerDeck();
    },
    updateHighLights(hCar) {
      this.userHighlights.map(hlItem => {
        if (!hlItem.divider) this.updateHLItem(hlItem, hCar);
      })
    },
    updateHLItem(hlItem, hCar, isList = false) {
      // 39 diferentes filtros
      // 4000 carros
      // 160.000 vezes vai passar nessa funcao, 195 se 5 carros


      // this.updateDialogFilter(hlItem.filter);
      // console.log("passei");

      let matchSpecial = true;
      let forceMatch = false;
      let match = false;
      if (hlItem.filter && hlItem.filter.newerThan) { // newerThan
        if (new Date(hlItem.filter.newerThan) > new Date(hCar.date)) {
          matchSpecial = false;
        }
      }
      if (hlItem.filter && hlItem.filter.olderThan) { // olderThan
        if (new Date(hlItem.filter.olderThan) < new Date(hCar.date)) {
          matchSpecial = false;
        }
      }
      if (!matchSpecial) return;

      if (hlItem.filter.forcePrize && this.resolvedRids[hCar.rid].prize) {
        forceMatch = true;
      } else {
        match = this.matchFilter(this.resolvedRids[hCar.rid], hlItem.filter);
      }


      if (match || forceMatch) {
        if (hlItem.r) { // rarity things
          hlItem.r["carCount"]++;
          if (this.resolvedRids[hCar.rid].prize) {
            hlItem.r["prizes"]++;
          } else {
            hlItem.r["nonPrizes"]++;
          }
          if (hCar.tunZ === "996") hlItem.r["count332"]++;
          if (hCar.tunZ === "969") hlItem.r["count323"]++;
          if (hCar.tunZ === "699") hlItem.r["count233"]++;
          if (hCar.tunZ.split("").reduce((a,b) => Number(a)+Number(b), 0) >= 24) {
            hlItem.r["fullyUpgraded"]++;
          }
        }

        if (hlItem.t) {
          let usedTimes = hCar.cW+hCar.cL+hCar.cD;
          let ageInMinutes = (new Date() - new Date(hCar.date)) / 1000 / 60;
          let ageInDays = ageInMinutes / 60 / 24;
  
          Object.keys(hlItem.t).map(key => {
            if (key === "mostWins") {
              this.compareHlItemBest(hlItem.t, key, hCar, hCar.cW, true, usedTimes);
            };
            if (key === "mostLoses") {
              this.compareHlItemBest(hlItem.t, key, hCar, hCar.cL, true, usedTimes);
            };
            if (key === "mostUsed") {
              this.compareHlItemBest(hlItem.t, key, hCar, usedTimes, true, usedTimes);
            };
            if (key === "highWinRate" && hCar.cW > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, hCar.cW/usedTimes*100, true, usedTimes);
            };
            if (key === "highLoseRate" && hCar.cL > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, hCar.cL/usedTimes*100, true, usedTimes);
            };
  
            if (key === "oldest") {
              this.compareHlItemBest(hlItem.t, key, hCar, ageInMinutes, true, usedTimes);
            };
            if (key === "oldestNoUse" && usedTimes === 0) {
              this.compareHlItemBest(hlItem.t, key, hCar, ageInMinutes, true, usedTimes);
            };
            if (key === "lessUseDay" && usedTimes > 0) {
              this.compareHlItemBest(hlItem.t, key, hCar, usedTimes/ageInDays, false, usedTimes);
            };
            if (key === "mostUseDay" && ageInDays > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, usedTimes/ageInDays, true, usedTimes);
            };
            if (key === "mostWinDay" && ageInDays > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, hCar.cW/ageInDays, true, usedTimes);
            };
            if (key === "mostLoseDay" && ageInDays > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, hCar.cL/ageInDays, true, usedTimes);
            };
            
          })
        }

        if (hlItem.tl) {
          let monthIndex = Number(hCar.date.substr(5,2)) - 1;
          let prizeKey = this.resolvedRids[hCar.rid].prize ? "prizes" : "nonPrizes";
          hlItem.tl[monthIndex][prizeKey].push(hCar);
        }

      }
    },
    compareHlItemBest(statItem, hlKey, hCar, carValue, bigger = true, usedTimes) {
      if (Array.isArray(statItem[hlKey])) {
        // list
        statItem[hlKey].push({
          car: hCar,
          v: carValue,
          used: usedTimes
        })
        return;
      }
      let shouldReplace = false;
      if (bigger) {
        if (carValue > statItem[hlKey].v) {
          shouldReplace = true;
        }
      } else {
        if (carValue < statItem[hlKey].v) {
          shouldReplace = true;
        }
      }
      if (carValue === statItem[hlKey].v) { // draw
        if (usedTimes > statItem[hlKey].used) {
          shouldReplace = true;
        }
      }
      if (!bigger && statItem[hlKey].v === null) {
        shouldReplace = true;
      }
      if (shouldReplace) {
        statItem[hlKey].car = hCar;
        statItem[hlKey].v = carValue;
        statItem[hlKey].used = usedTimes;
      }
    },
    transformAllCarsToObj() {
      let key = "rid";
      all_cars.map(car => {
        this.all_cars_obj[car[key]] = car;
        this.guidToRid[car.guid] = car.rid;
      });
      this.carsReady = true;
    },
    resolveTuneZ(hCar) {
      // 969 style
      return `${((hCar.engineMajor-1)*3 + hCar.engineMinor)}`+
      `${((hCar.weightMajor-1)*3 + hCar.weightMinor)}`+
      `${((hCar.chassisMajor-1)*3 + hCar.chassisMinor)}`;
    },
    resolveTune(hCar, tunZ) {
      // 323 style
      let res = null;

      if (
        tunZ === "000" ||
        tunZ === "333" ||
        tunZ === "996" ||
        tunZ === "969" ||
        tunZ === "699"
      ) {
        res = `${tunZ[0] / 3}${tunZ[1] / 3}${tunZ[2] / 3}`
      }

      // let arr = tunZ.split("");
      // if (
      //   Number(arr[0]) % 3 === 0 &&
      //   Number(arr[1]) % 3 === 0 &&
      //   Number(arr[2]) % 3 === 0
      // ) {
      //   res = Number(tunZ / 3)
      // }
      
      // if (hCar.engineMinor % 3 === 0 && hCar.engineMinor % 3 === 0 && hCar.engineMinor % 3 === 0) {
      //   res = `${(hCar.engineMajor * hCar.engineMinor) / 3}`+
      //     `${(hCar.weightMajor * hCar.weightMinor) / 3}`+
      //     `${(hCar.chassisMajor * hCar.chassisMinor) / 3}`;
      // }

      return res;
    },
    finishProcessPlayerDeck() {
      this.userHighlights.map(hlItem => {
        this.finishProcessPlayerDeckItem(hlItem);
      })
    },
    finishProcessPlayerDeckItem(hlItem) {
      if (hlItem.t) {
        hlItem.t["oldest"].v = hlItem.t["oldest"].v / 60 / 24; // convert minutes to days
        hlItem.t["oldestNoUse"].v = hlItem.t["oldestNoUse"].v / 60 / 24; // convert minutes to days

        {
          let C = hlItem.t["highWinRate"].car;
          hlItem.t["highWinRate"].sub = `${C.cW} wins, ${C.cW + C.cL + C.cD} uses`;
        }
        {
          let C = hlItem.t["highLoseRate"].car;
          hlItem.t["highLoseRate"].sub = `${C.cL} loses, ${C.cW + C.cL + C.cD} uses`;
        }
        {
          let C = hlItem.t["lessUseDay"].car;
          hlItem.t["lessUseDay"].v = `${C.cW + C.cL + C.cD}/${Math.round((new Date() - new Date(C.date)) / 1000 / 60 / 60 / 24)} days`;
        }
      }
      if (hlItem.tl) {
        hlItem.tl.sort((a,b) => {
          return new Date(a.date) - new Date(b.date);
        })
      }
    },
    finishProcessPlayerDeckItemArray(hlItem) {
      let C;
      if (hlItem.t) {
        Object.keys(hlItem.t).map(key => {
          hlItem.t[key].map(item => {
            if (key === "oldest") item.v = item.v / 60 / 24;
            if (key === "oldestNoUse") item.v = item.v / 60 / 24;

            if (key === "highWinRate") {
              C = item.car;
              item.sub = `${C.cW} wins, ${C.cW + C.cL + C.cD} uses`;
            }
            if (key === "highLoseRate") {
              C = item.car;
              item.sub = `${C.cL} loses, ${C.cW + C.cL + C.cD} uses`;
            }
            if (key === "lessUseDay") {
              C = item.car;
              item.v = `${C.cW + C.cL + C.cD}/${Math.round((new Date() - new Date(C.date)) / 1000 / 60 / 60 / 24)} days`;
            }
          })
        })
      }
    },
    matchFilter(car, context) {

      // between
      if ( context.yearModel && !this.filterCheckBetween(car.year, context.yearModel) ) return false;
      if ( context.rqModel && !this.filterCheckBetween(car.rq, context.rqModel) ) return false;
      if ( context.topSpeedModel && !this.filterCheckBetween(car.topSpeed, context.topSpeedModel) ) return false;
      if ( context.acelModel && !this.filterCheckBetween(car.acel, context.acelModel) ) return false;
      if ( context.handModel && !this.filterCheckBetween(car.hand, context.handModel) ) return false;
      if ( context.mraModel && !this.filterCheckBetween(car.mra, context.mraModel) ) return false;
      if ( context.weightModel && !this.filterCheckBetween(car.weight, context.weightModel) ) return false;
      if ( context.seatsModel && !this.filterCheckBetween(car.seats, context.seatsModel) ) return false;
      if ( context.seatsModel && !this.filterCheckBetween(car.seats, context.seatsModel) ) return false;

      // includes
      if ( context.classesModel && !this.filterCheckIncludes(car.class, context.classesModel) ) return false;
      if ( context.tyresModel && !this.filterCheckIncludes(car.tyres, context.tyresModel) ) return false;
      if ( context.drivesModel && !this.filterCheckIncludes(car.drive, context.drivesModel) ) return false;
      if ( context.clearancesModel && !this.filterCheckIncludes(car.clearance, context.clearancesModel) ) return false;
      if ( context.countrysModel && !this.filterCheckIncludes(car.country, context.countrysModel) ) return false;
      if ( context.year2Model && !this.filterCheckIncludes(car.year, context.year2Model) ) return false;
      if ( context.seats2Model && !this.filterCheckIncludes(Number(car.seats), context.seats2Model) ) return false;

      if ( context.fuelModel && !this.filterCheckIncludes(car.fuel, context.fuelModel) ) return false;
      if ( context.engineModel && !this.filterCheckIncludes(car.engine, context.engineModel) ) return false;
      if ( context.brakeModel && !this.filterCheckIncludes(car.brake, context.brakeModel) ) return false;
      if ( context.tcsModel && !this.filterCheckIncludes(car.tcs, context.tcsModel) ) return false;
      if ( context.absModel && !this.filterCheckIncludes(car.abs, context.absModel) ) return false;

      if ( context.bodyTypesModel && !this.filterCheckIncludesArray(car.bodyTypes, context.bodyTypesModel) ) return false;
      if ( context.tagsModel && !this.filterCheckIncludesArray(car.tags, context.tagsModel, car.rid) ) return false;
      if ( context.tags2Model && !this.filterCheckIncludesArray(car.tags, (context.tags2Model || []), car.rid) ) return false;
      if ( context.tags3Model && !this.filterCheckIncludesArray(car.tags, (context.tags3Model || []), car.rid) ) return false;
      if ( context.brandsModel && !this.filterCheckIncludes(car.brand, context.brandsModel) ) return false;

      if ( context.prizesModel && context.prizesModel.length > 0 ) {
        if ( car.prize && !context.prizesModel.includes("Prize Cars") ) return false;
        if ( !car.prize && !context.prizesModel.includes("Non-Prize Cars") ) return false;
      }



      return true;
    },
    filterCheckBetween(value, array) {
      return this.$refs.myGarageFilter.filterCheckBetween(value, array);
    },
    filterCheckIncludes(value, array) {
      return this.$refs.myGarageFilter.filterCheckIncludes(value, array);
    },
    filterCheckIncludesArray(valuesArray, array, rid) {
      return this.$refs.myGarageFilter.filterCheckIncludesArray(valuesArray, array, rid);
    },
    defaultFilters(type) {
      return this.$refs.myGarageFilter.defaultFilters(type);
    },
    updateDialogFilter(filter) {
      // this.$store.commit("MYGARAGE_INTERNALFILTER_IMPORT", { filter: filter });
      // vm.clearFilter();
      // vm.searchFilters = {
      //   ...vm.searchFilters,
      //   ...mutation.payload.filter
      // };
      this.$refs.myGarageFilter.searchFilters = {
        ...JSON.parse(this.blankFilterStr),
        ...filter
      }
      // vm.searchStr = "";
      // if (mutation.payload.filter.year2Model || mutation.payload.filter.seats2Model) {
      //   this.initSecretYear(true);
      // }
      // setTimeout(() => {
      //   vm.applyFilter();
      // }, 101);
    },
    generateBlankFilter() {
      this.$refs.myGarageFilter.clearFilter();
      this.blankFilterStr = JSON.stringify(this.$refs.myGarageFilter.searchFilters);
    },
    // matchFilterAttr(car) {
    //   if (!this.$refs.attrFilter.checkMatchFilter(car)) return false;
    //   if (!car.prize) return true;
    // },
    deleteHl(hlItem) {
      this.userHighlights.splice(this.userHighlights.indexOf(hlItem), 1)
    },
    newTimeline() {
      if (this.yearList.length === 0) {
        let initial = 2016;
        let end = Number(new Date().toISOString().substr(0,4));
        if (end > 2050) end = 2050;
        do {
          this.yearList.push(initial);
          initial++;
        } while (initial <= end);
      }
      this.yearDialog = true;
    },
    confirmYear(year) {
      this.yearModel = year;
      this.yearDialog = false;
      this.newGroup('timeline');
    },
    newGroup(type) {
      this.newGroupType = type;
      this.$refs.myGarageFilter.clearFilter();
      this.myGarageFilterDialog = true;
      this.editGroupIndex = -1;
    },
    newGroupFinish(filter) {
      this.myGarageFilterDialog = false;
      if (this.newGroupType === "group") {
        this.userHighlights.push({
          id: this.userHighlights[this.userHighlights.length-1].id+1,
          filter: filter,
          t: new groupStats(),
          canDelete: true
        })
      }
      if (this.newGroupType === "timeline") {
        this.userHighlights.push({
          id: this.userHighlights[this.userHighlights.length-1].id+1,
          filter: { ...filter, newerThan: `${this.yearModel}-01-01T00:00:00.000Z`, olderThan: `${this.yearModel}-12-31T23:59:59.000Z` },
          title: `${this.yearModel} Timeline`,
          tl: Array.from({length: 12}, (_, i) => new timeline(i)),
          canDelete: true
        })
      }
      this.editGroupIndex = this.userHighlights.length - 1;

      this.resolveHLByIndex(this.editGroupIndex);
      this.editGroupIndex = -1;

    },
    resolveHLByIndex(index) {
      this.userGarage.playerDeck.map(hCar => {
        this.updateHLItem(this.userHighlights[index], hCar);
      })
      this.finishProcessPlayerDeckItem(this.userHighlights[index]);
    },
    sharePrint(hlItem) {
      this.tempWindowWidth = this.windowWidth;
      this.windowWidth = 1000;
      this.pngLoading = true;
      this.printingItem = hlItem;
      window.scrollTo({ top: 0 });
      let vm = this;
      let _width;
      let _height;
      let c_container = document.querySelector('#App_PrintContainer');
      let currentCanvas = document.querySelector('#printCanvas');

      let boxName = ".BaseMyGarage_Layout";
      let pose = document.querySelector(boxName);
      pose.classList.add("Main_BodyPrint");

      setTimeout(() => {

        _width = (pose.clientWidth) * 1.3;
        _height = (pose.clientHeight) * 1.3;


        let options = {
          backgroundColor: "#333",
          canvas: currentCanvas,
          scale: 1.3,
          width: _width,
          height: _height,
          windowWidth: _width,
          windowHeight: _height,
        }

        currentCanvas.setAttribute("width", `${_width}`);
        currentCanvas.setAttribute("height", `${_height}`);

        this.runSharePrint(pose, options, c_container, currentCanvas, boxName);
      }, 100);

    },
    runSharePrint(pose, options, c_container, currentCanvas, boxName) {
      let vm = this;

      import('html2canvas').then(html2canvas => {

        html2canvas.default(pose, options).then(function(canvas) {

          import('reimg').then(reimg => {
            reimg.ReImg.fromCanvas(currentCanvas).downloadPng(`TDR_${new Date().toISOString().slice(0,-5)}.png`)

            document.querySelector(boxName).classList.remove("Main_BodyPrint");
            vm.windowWidth = vm.tempWindowWidth;
            vm.pngLoading = false;
            vm.printingItem = null;

            // let index = vm.pngIndex;
            // vm.pngIndex = -1;
            // setTimeout(() => {
            //   let el = document.querySelector(`.BaseMyGarage_HLItem:nth-child(${index+1})`);
            //   window.scrollTo({ top: el.offsetTop - (window.innerHeight * 0.35) });
            // }, 10);

          }).catch(e => {console.log("load reimg failed", e)});

        });

      }).catch(e => {console.log("load html2canvas failed", e)})


    },
    changeScreen(screen) {
      this.animation = true;
      this.configDialog = false;
      this.screen = '_';
      this.$nextTick().then(() => {
        this.screen = screen;
      })
    },
    validateText(forceText) {
      let obj;
      let isParsed = false;
      try {
        obj = JSON.parse(forceText || this.responseText);
        isParsed = true;
      } catch (error) {
        console.log(error);
      }

      if (!isParsed) {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: "Parse error",
          type: "error"
        });
        return;
      }

      this.userGarage = {};

      let success = this.processSyncObj(obj);
      if (success) {
        this.save()
      }
    },
    interceptPaste(e) {
      if (e) {
        e.preventDefault();
        let text = e.clipboardData.getData('text');
        
        this.validateText(text)
      }
    },
    askDelete() {
      let vm = this;

      let action = function() {
        vm.deleteTimeline();
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete garage?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    deleteTimeline() {
      this.confirmDelete.loading = true;

      axios.post(Vue.preUrl + "/deleteGarage", {
        date: this.userGarage.date
      })
      .then(res => {
        this.confirmDelete.loading = false;
        this.confirmDelete.dialog = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
        });
      })
      .catch(error => {
        this.confirmDelete.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    noPlayerDeck() {
      this.confirmDelete = {
        dialog: true,
        msg: `No playerdeck. This happens because the game already knows your garage, so it doesn't download again.\n\nTo fix you need to open the game in another device, make any change in your garage like upgrading a car, add a car from holding pool. Then, go back to the first device, open the game again.\n\nIf done right the game will re-download the entire garage again, that is what you need.`,
        actionLabel: `Cancel`,
        action: null,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    openConfig() {
      this.configDialog = true;
    },
    privacySet(item) {
      if (this.privacyModel === item) return;

      this.privacyLoading = true;

      axios.post(Vue.preUrl + "/garagePrivacy", {
        type: item,
        date: this.userGarage.date
      })
      .then(res => {
        this.privacyModel = res.data;
        this.privacyLoading = false;
      })
      .catch(error => {
        this.privacyLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    tileClick(hlItem, key) {
      // key = "oldestNoUse"
      // hlItem.filter
      // itemOfArray = { car: hCar, v: carValue, user: usedTimes }
      this.orderedKey = key;
      this.orderedSuffix = hlItem.t[key].sf;
      this.orderedSub = hlItem.t[key].sf;
      let newHlItem = {
        filter: hlItem.filter,
        t: {
          [key]: []
        }
      }
      this.userGarage.playerDeck.map((hCar, icar) => {
        this.updateHLItem(newHlItem, hCar);
      });
      newHlItem.t[key].sort((a,b) => {
        if (key === "lessUseDay") {
          if (a.v === b.v) return a.used - b.used;
          else return a.v - b.v;
        } else {
          if (a.v === b.v) return b.used - a.used;
          else return b.v - a.v;
        }
      })
      newHlItem.t[key].splice(1000, this.userGarage.playerDeck.length);
      
      newHlItem.t[key].map(x => {
        x.id = x.car.id;
      })
      this.finishProcessPlayerDeckItemArray(newHlItem);
      this.orderedList = newHlItem.t[key];
      this.orderedDialog = true;
    },
    onUpdate(viewStartIndex, viewEndIndex, visibleStartIndex, visibleEndIndex) {
      this.updateParts.viewStartIdx = viewStartIndex
      this.updateParts.viewEndIdx = viewEndIndex
      this.updateParts.visibleStartIdx = visibleStartIndex
      this.updateParts.visibleEndIdx = visibleEndIndex
    },
    calcLink() {
      this.shareUrl = `${window.location.origin}/garage/${this.userId}`;
    },
    copyUrl() {
      var copyText = document.getElementById("shareLinkGarage");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      navigator.clipboard.writeText(copyText.value);
      this.copyUrlSucess = true;
      setTimeout(() => { this.copyUrlSucess = false}, 1500);
    }
  },
}
</script>

<style>
.BaseMyGarage_Layout {
  margin-top: 20px;
}
.BaseMyGarage_CardBox {
  width: 300px;
  height: 186px;
  position: relative;
}
.BaseMyGarage_CardBox .BaseCardGallery_Header {
  /* transform: scale(0.5);
  transform-origin: top left; */
  margin: 0;
}
.BaseMyGarage_CardBox .Car_Header {
  position: static;
}
.BaseMyGarage_CardBox .Car_TuneTip {
  font-size: 13px;
}
.BaseMyGarage_CardsBox {
  height: calc((186px * 2) + 20px);
}
.BaseMyGarage_ListLayout {
  display: flex;
  align-items: center;
  gap: 10px;
}
.BaseMyGarage_ListLayout .BaseMyGarage_RarityStatsValue {
  text-align: left;
}
.BaseMyGarage_GalleryCard {
  --factor: 3.5px;
}
.BaseMyGarage_H {
  width: var(--wBody);
  max-width: var(--wBody);
  overflow-x: auto;
}
/* .Car_TuneTip {
  background-color: hsla(var(--back-h), var(--back-s), var(--card-stat-back-l), 0.6);
  right: calc(var(--card-right-width) + 0px);
  bottom: 16px;
  font-size: 14px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 3px;
} */
.BaseMyGarage_HLBox {
  max-width: 800px;
  margin: 0 auto;
}
.BaseMyGarage_FilterLayout {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 7px;
}
.BaseMyGarage_FilterBox {
  flex-grow: 1;
  display: flex;
  align-items: normal;
  flex-direction: column;
  justify-content: end;
}
.BaseMyGarage_FilterBox:not(:last-child) {
  padding-left: 49px;
}
.D_Button.BaseMyGarage_Camera {
  padding: 11px 11px;
  background-color: rgba(255, 255, 255, 0.03);
  align-self: center;
}
.BaseMyGarage_RarityStatsBox {
  display: flex;
  flex-wrap: wrap;
  margin: 7px 0;
  justify-content: center;
  gap: 7px;
}
.BaseMyGarage_RarityStatsBox,
.BaseMyGarage_TimelineBox,
.BaseMyGarage_HLItemDivider {
  padding-bottom: 70px;
}
.BaseMyGarage_RarityStatsItem {
  min-width: 180px;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  /* width: 120px; */
  gap: 1px;
  justify-content: flex-start;
  padding: 2px 2px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
}
.BaseMyGarage_RarityStatsValue {
  /* padding: 8px 0px; */
  min-height: 53px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.BaseMyGarage_RarityStatsValueT {
  font-size: 31px;
  line-height: 0.8;
}
.BaseMyGarage_RarityStatsSub {
  font-size: 0.7em;
  opacity: 0.6;
}
.BaseMyGarage_RarityStatsName {
  font-size: 15px;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Layout {
  display: flex;
  justify-content: center;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Item {
  display: flex;
  gap: 0.23em;
  padding: 8px;
  background-color: #ffc5171c;
  border-radius: 10px;
  font-size: 20px;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Label {
  color: #a28117;
  font-size: inherit;
  padding-top: 0px;
}
.BaseMyGarage_FilterBox .BaseFilterDescription_Value {
  font-size: inherit;
}
.BaseMyGarage_RarityStatsItem .Row_DialogCardCard2,
.BaseMyGarage_ListLayout .Row_DialogCardCard2 {
  --width: 180px !important;
  --height: 111px !important;
  --card-font-size: 9px;
  border-radius: 5px;
  margin: 0;
}
.BaseMyGarage_CarPlaceHolder {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: #454545;
}
.BaseMyGarage_RarityStatsCard {
  padding: 8px 0px;
}
.BaseMyGarage_AddGroupBox {
  padding-top: 140px;
  padding-bottom: 160px;
}
.BaseMyGarage_AddGroupButton {
  --back-color: 65, 53, 22;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 1);
  color: rgb(var(--d-text-yellow));
  font-size: 22px;
  border-radius: 6px;
  padding: 18px 37px;
  min-height: calc(var(--height)* 0.8);
  gap: 3px;
}
.BaseMyGarage_TimelineItem {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  flex-direction: column;
}
.BaseMyGarage_MonthLeft {
  padding: 6px 16px;
  background-color: #374a21;
  border-radius: 6px;
  position: relative;
  color: rgb(var(--d-text-green));
}
.BaseMyGarage_MonthTop,
.BaseMyGarage_MonthMid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  justify-content: center;
  display: contents;
}
.BaseMyGarage_MonthTop {
  
}
.BaseMyGarage_MonthTop .Row_DialogCardCard2 {
  box-shadow: 0px 0px 0px 2px var(--class-color);
}
.BaseMyGarage_MonthTop .MainFindCar_BankPhoto {
  /* box-shadow: 0px 0px 0px 2px var(--color); */
  border: 2px solid var(--color);
  box-sizing: border-box;
}
.BaseMyGarage_MonthRight .MainFindCar_BankPhoto {
  border-radius: 3px;
  height: 45px;
  width: 94px;
}
.BaseMyGarage_MonthRight .MainFindCar_RQ {
  border-bottom-left-radius: 3px;
}
.BaseMyGarage_MonthRight {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}
/* .Main_BodyPrint .BaseMyGarage_MonthRight { */
/* .BaseMyGarage_MonthRight {
  column-fill: balance;
  column-width: 94px;
  width: 100%;
  column-gap: 5px;
  text-align: center;
} */

.BaseMyGarage_TimelineItem .Row_DialogCardCard2 {
  --width: 180px !important;
  --height: 111px !important;
  --card-font-size: 9px;
  border-radius: 5px;
  margin: 0;
}
.BaseMyGarage_Share {
  margin-top: -20px;
  margin-bottom: 20px;
}
.BaseMyGarage_HLItemDivider {
  font-size: 70px;
  margin-top: 20px;
  margin-bottom: 20px;
  opacity: 0.1;
}
.BaseMyGarage_FilterBoxSpecial {
  margin-bottom: -7px;
  height: 70px;
  --diff: 0px;
  overflow: hidden;
  --opacity: 0.18;
  position: relative;
}
.BaseMyGarage_FilterBoxSpecial .BaseFilterDescription_Item {
  background-color: transparent;
  text-transform: uppercase;
  font-size: 60px;
  line-height: 1;
  position: relative;
  padding: 0;
  /* font-weight: bold; */
  margin-top: var(--diff);
  font-family: 'Roboto Condensed';
}
.BaseMyGarage_DividerBackLight {
  background: radial-gradient(rgba(var(--light), var(--opacity)) 0%, rgba(var(--light), 0) 60%);
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 150%;
  bottom: -95%;
  right: 0;
  background-repeat: no-repeat;
}
.BaseMyGarage_UserBottom {
  display: flex;
  gap: 6px;
  text-transform: uppercase;
  justify-content: center;
  font-size: 12px;
  opacity: 0.4;
}
.BaseMyGarage_TextBox {
  max-width: 600px;
  margin: 0 auto;
}
.BaseMyGarage_SideButtons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.BaseMyGarage_DialogSubmitTypeSub {
  font-size: 0.7em;
  opacity: 0.7;
  white-space: pre-wrap;
}
.BaseMyGarage_DialogSubmitChipType {
  flex-grow: 1;
  min-height: 46px;
}
.BaseMyGarage_DialogSubmitChipType .BaseChip_Text {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
}
.BaseMyGarage_ConfigDialogTop .BaseSwitch_Label {
  font-size: 18px;
}
.BaseMyGarage_ConfigDialogTop {
  display: flex;
  justify-content: center;
}
.BaseMyGarage_PrivacyItem {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex-basis: 0;
}
.BaseMyGarage_RarityStatsButton {
  text-decoration: none;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  transition-duration: 0.1s;
  transition-delay: 0s;
  cursor: pointer;
  border: none;
  color: var(--d-text);
  font-size: 18px;
}
.BaseMyGarage_RarityStatsButton.focus-visible,
.BaseMyGarage_RarityStatsButton:hover {
  background-color: rgba(255, 255, 255, 0.06);
}


.Main_BodyPrint.BaseMyGarage_Layout {
  width: 1000px;
}
.Main_BodyPrint .BaseMyGarage_Share,
.Main_BodyPrint .BaseMyGarage_ManageFooter,
.Main_BodyPrint .BaseMyGarage_AddGroupBox {
  display: none;
}
.Main_BodyPrint .BaseMyGarage_HLBox {
  padding-bottom: 80px;
}

.BaseMyGarage_LoadingBox {
  padding-bottom: 70px;
}
.BaseMyGarage_LoadingUsername,
.BaseMyGarage_LoadingTitle,
.BaseMyGarage_LoadingBox .BaseMyGarage_RarityStatsItem {
  animation: pulse 1s infinite ease-in-out;
  border-radius: 5px;
}
.BaseMyGarage_LoadingUsername {
  width: 200px;
  margin: 50px auto;
  height: 100px;
}
.BaseMyGarage_LoadingTitle {
  height: 70px;
  width: 100%;
  max-width: 400px;
  margin: 50px auto 20px auto;
}
.BaseMyGarage_LoadingBox .BaseMyGarage_RarityStatsItem {
  height: 204px;
}
.BaseMyGarage_Tutorial {
  max-width: 600px;
  margin: 0 auto 40px;
}
.BaseMyGarage_OrderedCount {
  opacity: 0.2;
  line-height: 1;
}


/* @media only screen and (min-width: 860px) {
  .BaseMyGarage_RarityStatsBoxCars {
    display: grid;
    width: 100%;
    grid-template-areas:
        "a a a a b b b b c c c c"
        "d d d e e e f f f g g g"
        "h h h h i i i i j j j j";
  }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(1) { grid-area: a; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(2) { grid-area: b; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(3) { grid-area: c; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(4) { grid-area: d; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(5) { grid-area: e; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(6) { grid-area: f; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(7) { grid-area: g; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(8) { grid-area: h; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(9) { grid-area: i; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(10) { grid-area: j; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(11) { grid-area: k; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(12) { grid-area: l; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(13) { grid-area: m; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(14) { grid-area: n; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(15) { grid-area: o; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(16) { grid-area: p; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(17) { grid-area: q; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(18) { grid-area: r; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(19) { grid-area: s; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(20) { grid-area: t; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(21) { grid-area: u; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(22) { grid-area: v; }
  .BaseMyGarage_RarityStatsBoxCars > :nth-child(23) { grid-area: w; }
} */
</style>