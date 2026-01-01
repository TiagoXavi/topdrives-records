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
            :car="Vue.all_carsObj[card.rid]"
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
        <div v-if="enableGiveAway && userGarage && userGarage.loaded && editEnabled" class="BaseMyGarage_EditBox BaseMyGarage_HLBox">
          <div class="BaseMyGarage_ShareGiveaway">
            <template v-if="Vue.utils.giveawayUsers.includes(user.username)">
              <div class="BaseMyGarage_ShareText">✅ You've entered the giveaway!</div>
            </template>
            <template v-else>
              <div class="BaseMyGarage_ShareText">🎉 Giveaway 🎉</div>
              <div class="BaseMyGarage_ShareText"><BaseIconSvg type="gold" :useMargin="false" style="width: 1.3em;display: inline-flex;vertical-align: bottom;" /> 2000 in-game</div>
              <div class="BaseMyGarage_ShareTextSub">Share your garage to get a chance. Ends in {{ daysLeft }} days</div>
              <button
                :disabled="autoShareRunning || loading || loadingPastYear"
                class="D_Button D_ButtonDark D_ButtonDark2 BaseMyGarage_TryAutoShare"
                @click="autoShareConfirmDialog = true">
                <span>Learn more</span>
              </button>
            </template>
          </div>
        </div>
        <div v-if="userGarage && userGarage.loaded && editEnabled" class="BaseMyGarage_EditBox BaseMyGarage_HLBox">
          <div class="BaseMyGarage_EditBoxButtons">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu BaseMyGarage_Camera"
              @click="calcLink(); openConfig();">
              <i class="ticon-gear Main_MenuIcon" aria-hidden="true"/>
            </button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu BaseMyGarage_Camera"
              @click="toggleTopEdit();">
              <i class="Main_MenuIcon" :class="`ticon-${ topEdit ? 'minus_2' : 'plus_2' }`" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div class="MainShowcase_SaveBar D_Center2">
          <button
            v-if="!userId"
            class="D_Button Main_LoginToEdit"
            @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
          <div v-else-if="(userGarage && userGarage.loaded) || !editEnabled" :class="`Main_UserT${highlightsUsers[userId]}`" class="MainShowcase_TitleBox">
            <BaseIconSvg type="laurel" />
            <div class="MainShowcase_Title">{{ loadedName }}</div>
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


        <div v-if="userGarage && userGarage.loaded && topEdit" class="D_Center2 BaseMyGarage_AddGroupBoxTop">
          <button class="D_Button BaseMyGarage_AddGroupButton" @click="yearSelector('group', true)">
            <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
            <span class="">{{ $t('m_newGroup') }}</span>
          </button>
          <button class="D_Button BaseMyGarage_AddGroupButton" @click="yearSelector('timeline', true)">
            <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
            <span class="">{{ $t('m_newTimeline') }}</span>
          </button>
        </div>


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

                  <div v-if="item.specialId === 'recap'" class="BaseMyGarage_PastGarageStats">
                    <div v-if="userGaragePast.loaded" class="BaseMyGarage_PastTop BaseMyGarage_RarityStatsBox">
                      <div class="BaseMyGarage_PastTopItem BaseMyGarage_RarityStatsItem">
                        <div class="BaseMyGarage_RarityStatsValue">
                          <div class="BaseMyGarage_RarityStatsValueT BaseMyGarage_RarityStatsValueWithIcon">
                            <i aria-hidden="true" class="ticon-trophy BaseMyGarage_StatValueIcon" style="font-size: 21px;" />
                            <span>{{ (otherDiffStats.eloScore || '').toLocaleString() }}</span>
                          </div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsName">{{ $t('m_trophiesEarned') }}</div>
                      </div>
                      <div class="BaseMyGarage_PastTopItem BaseMyGarage_RarityStatsItem">
                        <div class="BaseMyGarage_RarityStatsValue">
                          <div class="BaseMyGarage_RarityStatsValueT BaseMyGarage_RarityStatsValueWithIcon">
                            <i aria-hidden="true" class="ticon-arrow_up_3 BaseMyGarage_StatValueIcon" />
                            <span>{{ otherDiffStats.garageSlots }}</span>
                          </div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsName">{{ $t('m_slotsacquired') }}</div>
                      </div>
                      <div class="BaseMyGarage_PastTopItem BaseMyGarage_RarityStatsItem">
                        <div class="BaseMyGarage_RarityStatsValue">
                          <div class="BaseMyGarage_RarityStatsValueT BaseMyGarage_RarityStatsValueWithIcon">
                            <i aria-hidden="true" class="ticon-arrow_up_3 BaseMyGarage_StatValueIcon" />
                            <span>{{ otherDiffStats.newCars }}</span>
                          </div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsName">{{ $t('m_newCars') }}</div>
                      </div>
                    </div>
                    <div v-else-if="loadingPastYear" class="BaseMyGarage_PastTop BaseMyGarage_RarityStatsBox">
                      <div v-for="n in 3" class="BaseMyGarage_PastTopItem BaseMyGarage_RarityStatsItem BaseMyGarage_RarityLoading"></div>
                    </div>

                    <div class="BaseMyGarage_PastTop BaseMyGarage_RarityStatsBox">
                      <div
                        v-for="(value, key, index) in otherDiffStats.tags"
                        class="BaseMyGarage_PastTopItem BaseMyGarage_RarityStatsItem"
                        style="justify-content: center;">
                        <div v-if="value.S.length" class="BaseMyGarage_STagsList">
                          <BaseCardMiniButton
                            v-for="car in value.S"
                            :car="Vue.all_carsObj[car.rid]"
                            @click="T_S.miniCarClick(Vue.all_carsObj[car.rid])"
                          />
                        </div>
                        <BaseGameTag :tag="key" class="BaseMyGarage_RarityTag" />
                        <div class="BaseMyGarage_RarityStatsValue" style="min-height: 43px;">
                          <div class="BaseMyGarage_RarityStatsValueT BaseMyGarage_RarityStatsValueWithIcon">
                            <span>{{ value.v }}</span>
                          </div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsName">{{ $t('m_uniques') }}</div>
                      </div>
                    </div>

                    <div v-if="otherDiffStats.S_prizes.cars && otherDiffStats.S_prizes.cars.length" class="BaseMyGarage_PastGreatestDayGroup">
                      <div class="BaseMyGarage_PastSub">{{ $t('m_sPrizes') }} ({{ otherDiffStats.S_prizes.cars.length }})</div>
                      <div class="BaseMyGarage_PastGreatestDayList">
                        <BaseCardMiniButton
                          v-for="car in otherDiffStats.S_prizes.cars"
                          :car="Vue.all_carsObj[car.rid]"
                          @click="T_S.miniCarClick(Vue.all_carsObj[car.rid])"
                        />
                      </div>
                    </div>

                    <div class="BaseMyGarage_PastRarityGroup">
                      <div class="BaseMyGarage_PastSub">{{ $t('m_newCars') }}</div>
                      <div class="BaseMyGarage_PastRarityBox">
                        <button
                          v-for="(value, key, index) in otherDiffStats.new"
                          :style="`--classC: var(--c${key});`"
                          class="D_Button BaseMyGarage_PastRarityItem"
                          @click="pastRarityClick(item, key, 'new')">
                          <div class="BaseMyGarage_PastRarityName">{{ key }}</div>
                          <div class="BaseMyGarage_PastRarityValue">{{ value.v }}</div>
                        </button>
                      </div>
                    </div>
                    <div class="BaseMyGarage_PastRarityGroup" style="margin-bottom: 30px;">
                      <div class="BaseMyGarage_PastSub">{{ userGaragePast.loaded ? $t('m_carsMaxed') : $t('m_newCarsMaxed') }}</div>
                      <div class="BaseMyGarage_PastRarityBox">
                        <button
                          v-for="(value, key, index) in otherDiffStats.maxed"
                          :style="`--classC: var(--c${key});`"
                          class="D_Button BaseMyGarage_PastRarityItem"
                          @click="pastRarityClick(item, key, 'maxed')">
                          <div class="BaseMyGarage_PastRarityName">{{ key }}</div>
                          <div class="BaseMyGarage_PastRarityValue">{{ value.v }}</div>
                        </button>
                      </div>
                    </div>
                    <div v-if="otherDiffStats.greatestDayFinal" class="BaseMyGarage_PastGreatestDayGroup">
                      <div class="BaseMyGarage_PastSub">{{ $t('m_greatestDay') }}: {{ otherDiffStats.greatestDayFinal.date }}</div>
                      <div class="BaseMyGarage_PastGreatestDayList">
                        <BaseCardMiniButton
                          v-for="car in otherDiffStats.greatestDayFinal.cars"
                          :car="Vue.all_carsObj[car.rid]"
                          @click="T_S.miniCarClick(Vue.all_carsObj[car.rid])"
                        />
                      </div>
                    </div>
                    <div v-if="item.t" class="BaseMyGarage_PastSub">{{ $t('m_highlights') }}</div>
                  </div>

                  <div v-if="item.t" class="BaseMyGarage_RarityStatsBox BaseMyGarage_RarityStatsBoxCars">
                    <template v-for="(value, key, index) in item.t">
                      <button
                        class="BaseMyGarage_RarityStatsItem BaseMyGarage_RarityStatsButton"
                        @click="tileClick(item, key)">
                        <div class="BaseMyGarage_RarityStatsCard">
                          <BaseCardGallery
                            v-if="value.car.rid"
                            :car="Vue.all_carsObj[value.car.rid]"
                            :options="false"
                            :tuneText="value.car.tun || value.car.tunZ"
                            class="BaseMyGarage_GalleryCard" />
                          <div v-else class="BaseMyGarage_CarPlaceHolder Row_DialogCardCard2">
                            <i class="ticon-line" aria-hidden="true"/>
                          </div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsValue">
                          <div class="BaseMyGarage_RarityStatsValueT">{{ value.pf }}{{ typeof value.v === 'string' ? value.v : value.v % 1 != 0 ? value.v >= 100 ? Math.round(value.v) : Math.round(value.v * 10)/10 : value.v }}{{ value.sf }}</div>
                          <div v-if="value.sub" class="BaseMyGarage_RarityStatsSub">{{ value.sub }}</div>
                        </div>
                        <div class="BaseMyGarage_RarityStatsName">{{ $tc(`m_${key}`,1) }}</div>

                        <!-- <template v-if="value.car.cardId">
                          <span>{{ Vue.all_carsObj[value.car.cardId].name }} </span>
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
                        <div class="BaseMyGarage_MonthMid">
                          <div v-if="month.cars.length > 70" class="BaseMyGarage_MonthTooMany">
                            <div class="BaseMyGarage_MonthTooManyText">{{ $t('m_tooManyCars') }} ({{ month.cars.length }})</div>
                          </div>
                          <template v-else>
                            <BaseCardGallery
                              v-for="car in month.cars"
                              :ad="`${(car.date || '').slice(0, 13)}`"
                              :car="Vue.all_carsObj[car.rid]"
                              :options="false"
                              :class="{ BaseMyGarage_MonthTop: Vue.all_carsObj[car.rid].prize }"
                              class="BaseMyGarage_GalleryCard"
                            />
                          </template>
                        </div>
                      </div>
                      <div v-else class="BaseMyGarage_MonthRight">
                        <div class="BaseMyGarage_MonthMid">
                          <div v-if="month.cars.length > 70" class="BaseMyGarage_MonthTooMany">
                            <div class="BaseMyGarage_MonthTooManyText">{{ $t('m_tooManyCars') }} ({{ month.cars.length }})</div>
                          </div>
                          <template v-else>
                            <div
                              v-for="car in month.cars"
                              class="MainFindCar_CarCard"
                              :class="{ BaseMyGarage_MonthTop: Vue.all_carsObj[car.rid].prize }"
                              :style="`--color: ${Vue.all_carsObj[car.rid].color}`">
                              <div class="MainFindCar_BankPhoto">
                                <img :src="Vue.all_carsObj[car.rid].photo" class="MainFindCar_BankPhotoImg" loading="lazy" alt="">
                              </div>
                              <div class="MainFindCar_RQ">{{ Vue.all_carsObj[car.rid].rq }}</div>
                            </div>
                          </template>
                        </div>
                      </div>

                    </div>
                  </div>
                </template>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>

        </div>

        <div v-if="userGarage && userGarage.loaded" class="D_Center2 BaseMyGarage_AddGroupBox">
          <button class="D_Button BaseMyGarage_AddGroupButton" @click="yearSelector('group')">
            <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
            <span class="">{{ $t('m_newGroup') }}</span>
          </button>
          <button class="D_Button BaseMyGarage_AddGroupButton" @click="yearSelector('timeline')">
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
      :config="{
        customTags: false,
        tunes: true
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
        <div class="BaseMyGarage_ConfigDialogFooter D_Center2" style="margin-top: 40px;">
          <button
            class="D_Button Main_SaveAllButton"
            @click="changeScreen('upload')">
            <i class="ticon-refresh_3 D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/>
            <span>{{ $t("m_updateGarage") }}</span>
          </button>
        </div>
        <div class="BaseMyGarage_ConfigDialogFooter D_Center2 Space_TopGiga">
          <button
            v-if="user && user.garageYears && user.garageYears.includes(`${garageYear-1}`)"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="loadPreviousYear();">
            <span>{{ garageYear-1 }} Recap</span>
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
        <div class="Main_DialogTitle" style="margin-bottom: 30px;">{{ $t('m_addedYear') }}</div>
        <div class="D_Center2 Space_TopGiga" style="flex-wrap: wrap;">
          <button
            v-for="year in yearList"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="confirmYear(year)">
            <span>{{ year }}</span>
          </button>
          <button
            v-if="newGroupType === 'group'"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="confirmYear('all')">
            <span>All</span>
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
                  :car="Vue.all_carsObj[item.car.rid]"
                  :options="false"
                  :tuneText="item.car.tun || item.car.tunZ"
                  class="BaseMyGarage_GalleryCard" />
              </div>
              <div class="BaseMyGarage_OrderedRight">
                <div class="BaseMyGarage_OrderedCount">#{{ index+1 }}</div>
                <div class="BaseMyGarage_RarityStatsValue">
                  <div class="BaseMyGarage_RarityStatsValueT">{{ orderedPrefix }}{{ typeof item.v === 'string' ? item.v : item.v % 1 != 0 ? item.v >= 100 ? Math.round(item.v) : Math.round(item.v * 10)/10 : item.v }}{{ orderedSuffix }}</div>
                  <div v-if="item.sub" class="BaseMyGarage_RarityStatsSub">{{ item.sub }}</div>
                </div>
              </div>
            </div>
          </template>
        </RecycleScroller>
      </div>
    </BaseDialog>

    <BaseDialog
      :active="rarityListDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="rarityListDialog = false;">
      <div class="BaseMyGarage_OrderedLayout">
        <div class="BaseMyGarage_OrderedHeader">
          <div class="Main_DialogTitle">{{ rarityDialogTitle }}</div>
        </div>
        <RecycleScroller
          :items="rarityListArr"
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
                  :car="Vue.all_carsObj[item.rid]"
                  :options="false"
                  :tuneText="item.tun || item.tunZ"
                  class="BaseMyGarage_GalleryCard" />
              </div>
              <div class="BaseMyGarage_OrderedRight">
                <div class="BaseMyGarage_OrderedCount">#{{ index+1 }}</div>
                <div class="BaseMyGarage_RarityStatsValue">
                  <div class="BaseMyGarage_RarityStatsValueT" style="font-size: 25px;">{{ item.date.slice(0, 10) }}</div>
                  <div class="BaseMyGarage_RarityStatsSub" style="opacity: 0.3; margin-top: 3px;">{{ rarityDialogSub }}</div>
                </div>
              </div>
            </div>
          </template>
        </RecycleScroller>
      </div>
    </BaseDialog>

    <BaseDialog
      v-if="enableGiveAway"
      :active="autoShareConfirmDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="autoShareConfirmDialog = false;">
      <div class="BaseMyGarage_ShareDialogBox">
        <div class="BaseMyGarage_ShareText" style="font-size: 1.5em;">🎉 Giveaway 🎉</div>
        <div class="BaseMyGarage_ShareGroup">
          <div class="BaseMyGarage_ShareText"><BaseIconSvg type="gold" :useMargin="false" style="width: 1.3em;display: inline-flex;vertical-align: bottom;" /> 2000 in-game</div>
          <div class="BaseMyGarage_ShareText">1 month of <span style="color: var(--t2)">TDR Premium</span></div>
        </div>
        <div class="BaseMyGarage_ShareGroup">
          <div class="BaseMyGarage_ShareDialogText">Share your garage to get a chance</div>
          <div class="BaseMyGarage_ShareDialogText">Ends in {{ daysLeft }} days</div>
        </div>
        <div class="BaseMyGarage_ShareTextSub">The button below will take a print of your 2025 Recap and share it on TDR Discord automatically, but feel free to share by yourself.</div>
        <button
          :disabled="autoShareRunning || loading || loadingPastYear"
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="initAutoShare();">
          <span>Auto share</span>
        </button>
      </div>
    </BaseDialog>

    <BaseDialog
      v-if="enableGiveAway"
      :active="viewMyShareDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="viewMyShareDialog = false;">
      <div class="BaseMyGarage_ShareDialogBox">
        <i class="ticon-correct_1 BaseMyGarage_ShareDialogIcon" aria-hidden="true"/>
        <div class="BaseMyGarage_ShareDialogText">You've entered the giveaway!</div>
        <div class="BaseMyGarage_ShareDialogText">Take a look at your share:</div>
        <BaseDiscordButton link="https://discord.com/channels/1008569974094311544/1449094050820132945" style="margin-top: 20px;" />
      </div>
    </BaseDialog>

  </div>
</template>

<script>
import BaseCardGallery from './BaseCardGallery.vue';
import BaseDialog from './BaseDialog.vue';
import BaseFilterDialog from './BaseFilterDialog.vue';
import BaseFilterDescription from './BaseFilterDescription.vue';
import BaseIconSvg from './BaseIconSvg.vue';
import BaseSwitch from './BaseSwitch.vue';
import BaseMyGarageTutorial from './BaseMyGarageTutorial.vue';
import BaseCardMini from './BaseCardMini.vue';
import BaseCardMiniButton from './BaseCardMiniButton.vue';
import BaseGameTag from './BaseGameTag.vue';
import BaseDiscordButton from './BaseDiscordButton.vue';
import rn_to_rid from '../database/rn_to_rid.json';
import { tdrStore } from '@/tdrStore.js';

class hlCar {
  constructor(initialValue = 0, suffix = "", prefix = "") {
    this.car = {};
    this.v = initialValue;
    this.used = 0;
    this.sf = suffix;
    this.pf = prefix;
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
  constructor(isPast) {
    this.mostUsed = new hlCar();
    this.mostWins = new hlCar();
    this.mostLoses = new hlCar();
    this.highWinRate = new hlCar(0, "%");
    this.highLoseRate = new hlCar(0, "%");
    if (!isPast) this.oldest = new hlCar(0, " days");
    if (!isPast) this.oldestNoUse = new hlCar(0, " days");
    if (!isPast) this.lessUseDay = new hlCar(null);
    this.mostUseDay = new hlCar(0, "/day");
    this.mostWinDay = new hlCar(0, "/day");
    this.mostLoseDay = new hlCar(0, "/day");
    if (!isPast) this.higherRQ = new hlCar(0, "", "RQ");
  }
}
class timeline {
  constructor(monthIndex) {
    this.monthIndex = monthIndex;
    this.cars = [];
  }
}
class pastRarityItem {
  constructor(extra1 = false) {
    this.v = 0;
    this.cars = [];
    if (extra1) this.ridList = [];
    if (extra1) this.S = [];
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
    BaseMyGarageTutorial,
    BaseCardMiniButton,
    BaseCardMini,
    BaseGameTag,
    BaseDiscordButton
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      T_S: tdrStore(),
      loading: false,
      loadingPastYear: false,
      lastestLoading: false,
      screen: "normal",
      topEdit: false,
      isTopAdd: false,
      animation: false,
      user: null,
      responseText: "",
      highlightsUsers: {},
      garageYear: 2026,
      userGarage: {},
      userGarageByDate: {},
      userGaragePast: {},
      otherDiffStats: {},
      userGaragePastYear: 2025,
      enableGiveAway: false,
      pointsPerRarity: {
        S: 20,
        A: 5,
        B: 1,
      },
      rarityListDialog: false,
      rarityListArr: [],
      rarityDialogTitle: "",
      rarityDialogSub: "",
      loadedName: null,
      myGarageFilterDialog: false,
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
      autoShareRunning: false,
      uploadLoading: false,
      autoShareConfirmDialog: false,
      viewMyShareDialog: false,
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
      orderedPrefix: "",
      updateParts: { viewStartIdx: 0, viewEndIdx: 0, visibleStartIdx: 0, visibleEndIdx: 0 },
      newGroupType: "group",
      yearList: [],
      yearModel: "",
      yearDialog: false,
      shareUrl: "",
      today: new Date(),
      copyUrlSucess: false,
      nextId: 1000,
      userHighlights: [
        {
          id: 100,
          fixed: true,
          filter: {},
          title: "2025 Recap",
          specialTitle: true,
          requirePast: true,
          specialId: "recap"
        },
        {
          id: 0,
          fixed: true,
          filter: { newerThan: "2025-01-01T00:00:00.000Z", olderThan: "2025-12-31T23:59:59.000Z" },
          t: new groupStats(),
          title: "New in 2025",
          specialTitle: true,
          specialId: "myCarsYear"
        },
        {
          id: 1,
          fixed: true,
          filter: { classesModel: ["S"], newerThan: "2025-01-01T00:00:00.000Z", olderThan: "2025-12-31T23:59:59.000Z" },
          tl: Array.from({length: 12}, (_, i) => new timeline(i)),
          title: "2025 Leggy Timeline",
          specialTitle: true,
          specialId: "myCarsYearTimeline"
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
        { id: 39, filter: { tagsModel: ["Autobahn Icons"] }, t: new groupStats() }, // change id
        { id: 38, filter: { tagsModel: ["German Powerhaus"] }, t: new groupStats() },
        { id: 37, filter: { tagsModel: ["French Riviera"] }, t: new groupStats() },
        { id: 36, filter: { tagsModel: ["Asia-Pacific Revival"] }, t: new groupStats() },
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
    window.localStorage.setItem("recap2025", "t");
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

    this.$refs.myGarageFilter.$data.searchFilters.tunes.splice(4, 0, "000");

    // this.$store.commit("START_LOGROCKET", {});
    
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
      if (!this.userGarage.loaded) { // only first highlight
        return [this.userHighlights[1]];
      }
      // if (!this.userGaragePast.loaded && !this.loadingPastYear) { // return ones that not require requirePast
      //   return this.userHighlights.filter(hl => !hl.requirePast);
      // }
      return this.userHighlights;
    },
    daysLeft() {
      let endDate = new Date(2025, 11, 31);
      let timeDiff = endDate.getTime() - this.today.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },
  },
  methods: {
    getLastest(isAutoShare) {
      let vm = this;
      this.lastestLoading = true;


      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;

        this.highlightsUsers = Vue.resolveHighlightsUsers(res.data);

        if (this.enableGiveAway && isAutoShare && Vue.utils.giveawayUsers.includes(this.user.username)) {
          this.viewMyShareDialog = true;
        }

        let incomingCars = res.data.find(x => x.id === 'newCars').value;
        if (incomingCars && incomingCars.length > 0) {
          let rids = Vue.all_carsArr.map(x => x.rid);

          incomingCars.map(car => {
            if (!!(car.photoId && car.rq && car.onlyName && car.brand && car.country && car.year && car.clearance && car.topSpeed && car.hand && car.drive && car.tyres && car.weight && car.tags && car.bodyTypes && car.fuel && car.seats && car.engine)) {
              if (!rids.includes(car.rid)) {
                Vue.all_carsArr.push(car);
              }
            }
          })

          Vue.all_carsArr.sort((a,b) => {
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
    load(forceYear) {
      if (!this.userId) return;
      this.loading = true;
      let params = {
        username: this.userId
      };
      if (forceYear) {
        params.year = forceYear;
      }

      axios.post(Vue.preUrl + "/getGarage", params)
      .then(res => {
        this.loading = false;
        this.saved = false;
        if (res.status === 200 && !res.data) {
          // not found
        }
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
            if (res.data.year) {
              this.updateYearPage(res.data.year);
            }
            this.processPlayerDeckStep2();
          }
          if (res.data.u) {
            this.loadedName = res.data.u;
          }
          
          if (this.user && this.user.garageYears && this.user.garageYears.length > 1) {
            let pastYear = Number(res.data.year) - 1;
            if (this.user.garageYears.includes(`${pastYear}`)) {
              this.loadPastYear(Number(pastYear));
            }
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
    loadPastYear(year) {
      if (!this.userId) return;
      this.loadingPastYear = true;

      axios.post(Vue.preUrl + "/getGarage", {
        username: this.userId,
        year: year
      })
      .then(res => {
        this.loadingPastYear = false;
        if (res.data && res.data.value) {

          this.userGaragePastYear = year;
          this.userGaragePast = res.data.value;
          this.userHighlights.find(hl => hl.specialId === "recap").t = new groupStats(true);
          
          this.initPastGarageCompare();
          
          // this.processPlayerDeckStep2();
        }
      })
      .catch(error => {
        this.loadingPastYear = false;
        console.log(error);
      })
    },
    save() {
      this.loading = true;

      if (this.privacyModel === "private") {
        this.userGarage.private = true;
      }

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
        window.localStorage.removeItem("cacheGarage");
        window.localStorage.removeItem("garageUpgrades");
        
        // finish
        this.transformUserGarageToObj();
        this.updateYearPage(this.userGarage.date ? new Date(this.userGarage.date).getFullYear() : this.garageYear);
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
    processSyncObj(obj) {
      let isError = this.errorSwitch(obj);
      
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
        totalGiftsClaimed: obj.dailyGift.totalGiftsClaimed
      };

      this.userGarage.playerDeck = this.processPlayerDeck(obj.playerDeck);

      // console.log(this.userGarage);
      return true;
    },
    errorSwitch(obj) {
      if (typeof obj !== "object") return "Not object";
      if (!obj.serverTime) return "No basic property";
      if (!obj.user) return "No user property";
      if (!obj.dailyGift) return "No dailyGift";
      if (!obj.playerDeck || obj.playerDeck.length < 1) return "No playerDeck";
      return false;
    },
    processPlayerDeck(deck) {
      let result = [];
      let listOfCri = [];

      deck.map((hCar, icar) => {
        if (hCar.state === 0) return; // holding pool
        let tunZ = this.resolveTuneZ(hCar);
        let dateF = hCar.dateStateChanged;
        if (dateF && dateF.length === 24) dateF = dateF.slice(2, 13);
        let rn = rn_to_rid.indexOf(Vue.ridByGuid[hCar.cardId]);
        let cri;
        for (let X = 8; X < 16; X++) {
          cri = hCar.cardRecordId.slice(0,X);
          let indexOfFound = listOfCri.indexOf(cri);
          if (indexOfFound !== -1) {
            console.log(hCar.cardRecordId);
            let hCarOther = deck[indexOfFound];
            let newOtherCri = hCarOther.cardRecordId.slice(0,X+1);
            listOfCri[indexOfFound] = newOtherCri;
            // result.find(x => x.c === cri).c = newOtherCri;
            result.find(x => x[0] === cri)[0] = newOtherCri;
            continue;
          } else {
            break; // unique cri
          }
        }

        // let item = {
        //   c: cri,
        //   rn: rn,
        //   d: dateF
        // }
        // if (tunZ !== "000") item.t = tunZ;
        // if (hCar.cardWins) item.cW = hCar.cardWins;
        // if (hCar.cardLosses) item.cL = hCar.cardLosses;
        // if (hCar.cardDraws) item.cD = hCar.cardDraws;

        // ARRAY
        let item2 = [
          cri,
          rn,
          dateF,
          tunZ !== "000" ? tunZ : 0,
          hCar.cardWins,
          hCar.cardLosses,
          hCar.cardDraws
        ]


        listOfCri.push(cri);
        result.push(item2);
      })

      return result;
    },
    processPlayerDeckStep2() {
      this.resetState();

      this.userGarage.playerDeck.map((hCar, icar) => {
        hCar.id = icar;
        hCar.tun = this.resolveTune(hCar, hCar.tunZ);
        hCar.date = this.fixDate(hCar.date);

        this.updateHighLights(hCar);
        this.computeCarToRecap(hCar);
      })

      this.userGarage.loaded = true;

      this.finishProcessPlayerDeck();
      this.finishRecap();
    },
    transformUserGarageToObj() {
      this.userGarage.playerDeck.map((item, ix) => {
        this.userGarage.playerDeck[ix] = {
          cardRecordId: item[0],
          rid: rn_to_rid[item[1]],
          date: `20${item[2]}:00Z`,
          tunZ: item[3] === 0 ? "000" : item[3],
          cW: item[4],
          cL: item[5],
          cD: item[6]
        }
      })
    },
    updateHighLights(hCar) {
      this.userHighlights.map(hlItem => {
        if (hlItem.divider) return;
        // if (hlItem.requirePast && !this.userGaragePast.loaded) return;
        if (hlItem.requirePast) return;
        this.updateHLItem(hlItem, hCar);
      })
    },
    updateHLItem(hlItem, hCar, isList = false) {
      if (!hCar.rid) return
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

      if (hlItem.filter.forcePrize && Vue.all_carsObj[hCar.rid].prize) {
        forceMatch = true;
      } else {
        match = this.matchFilter(Vue.all_carsObj[hCar.rid], hlItem.filter, hCar);
      }


      if (match || forceMatch) {
        if (!hlItem.touched) hlItem.touched = true;

        if (hlItem.r) { // rarity things
          hlItem.r["carCount"]++;
          if (Vue.all_carsObj[hCar.rid].prize) {
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
          let WINS = hCar.cW || 0;
          let LOSES = hCar.cL || 0;
          let DRAWS = hCar.cD || 0;
          let usedTimes = hCar.cW+hCar.cL+hCar.cD;
          let ageInMinutes = (this.today - new Date(hCar.date)) / 1000 / 60;
          let ageInDays = ageInMinutes / 60 / 24;
          
          if (hlItem.requirePast && hCar.cWdiff !== undefined) {
            WINS = hCar.cWdiff;
            LOSES = hCar.cLdiff;
            DRAWS = hCar.cDdiff;
            usedTimes = hCar.cWdiff + hCar.cLdiff + hCar.cDdiff;
            // count ageInMinutes starting for the year of this.userGaragePastYear or the hCar.date if newer
            let pastYearDate = new Date(`${this.garageYear}-01-01T00:00:00.000Z`);
            let effectiveDate = new Date(hCar.date) > pastYearDate ? new Date(hCar.date) : pastYearDate;
            ageInMinutes = (this.today - effectiveDate) / 1000 / 60;
            ageInDays = ageInMinutes / 60 / 24;
          }
  
          Object.keys(hlItem.t).map(key => {
            if (key === "mostWins") {
              this.compareHlItemBest(hlItem.t, key, hCar, WINS, true, usedTimes);
            };
            if (key === "mostLoses") {
              this.compareHlItemBest(hlItem.t, key, hCar, LOSES, true, usedTimes);
            };
            if (key === "mostUsed") {
              this.compareHlItemBest(hlItem.t, key, hCar, usedTimes, true, usedTimes);
            };
            if (key === "highWinRate" && WINS > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, WINS/usedTimes*100, true, usedTimes);
            };
            if (key === "highLoseRate" && LOSES > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, LOSES/usedTimes*100, true, usedTimes);
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
              this.compareHlItemBest(hlItem.t, key, hCar, WINS/ageInDays, true, usedTimes);
            };
            if (key === "mostLoseDay" && ageInDays > 20) {
              this.compareHlItemBest(hlItem.t, key, hCar, LOSES/ageInDays, true, usedTimes);
            };
            if (key === "higherRQ") {
              this.compareHlItemBest(hlItem.t, key, hCar, Vue.all_carsObj[hCar.rid].rq, true, usedTimes);
            };
            
          })
        }

        if (hlItem.tl) {
          let monthIndex = Number(hCar.date.substr(5,2)) - 1;
          hlItem.tl[monthIndex].cars.push(hCar);
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
        tunZ[0] % 3 === 0 &&
        tunZ[1] % 3 === 0 &&
        tunZ[2] % 3 === 0
      ) {
        res = `${tunZ[0] / 3}${tunZ[1] / 3}${tunZ[2] / 3}`
      }

      return res;
    },
    finishProcessPlayerDeck() {
      this.userHighlights.map(hlItem => {
        this.finishProcessPlayerDeckItem(hlItem);
      })
    },
    finishProcessPlayerDeckItem(hlItem) {
      if (!hlItem.touched) return;
      if (hlItem.t) {
        if (hlItem.t["oldest"]) hlItem.t["oldest"].v = hlItem.t["oldest"].v / 60 / 24; // convert minutes to days
        if (hlItem.t["oldestNoUse"]) hlItem.t["oldestNoUse"].v = hlItem.t["oldestNoUse"].v / 60 / 24; // convert minutes to days

        {
          let C = hlItem.t["highWinRate"].car;
          hlItem.t["highWinRate"].sub = `${C.cW} wins, ${C.cW + C.cL + C.cD} uses`;
          if (hlItem.requirePast && C.cWdiff !== undefined) hlItem.t["highWinRate"].sub = `${C.cWdiff} wins, ${C.cWdiff + C.cLdiff + C.cDdiff} uses`;
        }
        {
          let C = hlItem.t["highLoseRate"].car;
          hlItem.t["highLoseRate"].sub = `${C.cL} loses, ${C.cW + C.cL + C.cD} uses`;
          if (hlItem.requirePast && C.cWdiff !== undefined) hlItem.t["highLoseRate"].sub = `${C.cLdiff} loses, ${C.cWdiff + C.cLdiff + C.cDdiff} uses`;
        }
        if (hlItem.t["lessUseDay"]) {
          let C = hlItem.t["lessUseDay"].car;
          hlItem.t["lessUseDay"].v = `${C.cW + C.cL + C.cD}/${Math.round((this.today - new Date(C.date)) / 1000 / 60 / 60 / 24)} days`;
        }
      }
      if (hlItem.tl) {
        hlItem.tl.map(month => {
          month.cars.sort((a,b) => {
            return new Date(a.date) - new Date(b.date);
          })
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
              if (hlItem.requirePast && C.cWdiff !== undefined) item.sub = `${C.cWdiff} wins, ${C.cWdiff + C.cLdiff + C.cDdiff} uses`;
            }
            if (key === "highLoseRate") {
              C = item.car;
              item.sub = `${C.cL} loses, ${C.cW + C.cL + C.cD} uses`;
              if (hlItem.requirePast && C.cWdiff !== undefined) item.sub = `${C.cLdiff} loses, ${C.cWdiff + C.cLdiff + C.cDdiff} uses`;
            }
            if (key === "lessUseDay") {
              C = item.car;
              item.v = `${C.cW + C.cL + C.cD}/${Math.round((this.today - new Date(C.date)) / 1000 / 60 / 60 / 24)} days`;
            }
          })
        })
      }
    },
    matchFilter(car, context, hCar) {

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

      if ( context.tunesModel && context.tunesModel.length > 0 ) {
        if ( !context.tunesModel.includes(hCar.tun) ) return false;
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
    yearSelector(type, isTop = false) {
      this.isTopAdd = isTop;
      this.newGroupType = type;
      if (this.yearList.length === 0) {
        let initial = 2016;
        let end = Number(this.today.toISOString().substr(0,4));
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
      this.newGroup(this.newGroupType);
    },
    newGroup(type) {
      this.newGroupType = type;
      this.$refs.myGarageFilter.clearFilter();
      this.myGarageFilterDialog = true;
      this.editGroupIndex = -1;
    },
    newGroupFinish(filter) {
      this.myGarageFilterDialog = false;
      let key = "push";
      if (this.isTopAdd) key = "unshift";

      if (this.newGroupType === "group") {
        if (this.yearModel !== "all") {
          filter = { ...filter, newerThan: `${this.yearModel}-01-01T00:00:00.000Z`, olderThan: `${this.yearModel}-12-31T23:59:59.000Z` };
        }
        this.userHighlights[key]({
          id: this.nextId++,
          filter: filter,
          t: new groupStats(),
          title: this.yearModel !== "all" ? `New in ${this.yearModel}` : undefined,
          specialTitle: this.yearModel !== "all",
          canDelete: true
        })
      }
      if (this.newGroupType === "timeline") {
        this.userHighlights[key]({
          id: this.nextId++,
          filter: { ...filter, newerThan: `${this.yearModel}-01-01T00:00:00.000Z`, olderThan: `${this.yearModel}-12-31T23:59:59.000Z` },
          title: `${this.yearModel} Timeline`,
          tl: Array.from({length: 12}, (_, i) => new timeline(i)),
          canDelete: true
        })
      }
      this.editGroupIndex = this.userHighlights.length - 1;
      if (this.isTopAdd) this.editGroupIndex = 0;

      this.resolveHLByIndex(this.editGroupIndex);
      this.editGroupIndex = -1;
      this.topEdit = false;
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

          if (window.ReImg) {
            vm.afterRunSharePrint(c_container, currentCanvas, boxName);
          } else {
            window.importReimg();
            window.importReimgPromise.then(res => {
              vm.afterRunSharePrint(c_container, currentCanvas, boxName);
            })
          }

        });

      }).catch(e => {console.log("load html2canvas failed", e)})


    },
    afterRunSharePrint(c_container, currentCanvas, boxName) {
      if (this.autoShareRunning) {
        var base64 = window.ReImg.fromCanvas(currentCanvas).toBase64();
        this.autoShareCallback(base64);
      } else {
        window.ReImg.fromCanvas(currentCanvas).downloadPng(`TDR_${this.today.toISOString().slice(0,-5)}.png`)
      }

      document.querySelector(boxName).classList.remove("Main_BodyPrint");
      this.windowWidth = this.tempWindowWidth;
      this.pngLoading = false;
      this.printingItem = null;
      this.autoShareRunning = false;
    },
    autoShareCallback(base64) {
      if (!this.enableGiveAway) return;

      this.uploadLoading = true;
      const base64WithoutPrefix = base64.includes(';base64,') ? base64.substring(base64.indexOf(';base64,') + 8) : base64;
      const binaryString = window.atob(base64WithoutPrefix);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "image/png" });
      let file = new File([blob], `TDR_${this.today.toISOString().slice(0,-5)}.png`, { type: "image/png" });
      
      let formData = new FormData();
      formData.set('image', file);
      formData.set('username', this.user.username);

      axios.post(Vue.preUrl + '/uploadGarageGiveaway', formData, {
        headers: {
         'content-type': 'multipart/form-data' // do not forget this
        }
      })
      .then(res => {
        this.alreadyUploaded = true;
        this.getLastest(true);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t("m_uploadSuccess")
        });
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.uploadLoading = false;
      });

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
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: "Not valid input",
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
      this.orderedPrefix = hlItem.t[key].pf;
      this.orderedSub = hlItem.t[key].sf;
      let newHlItem = {
        filter: hlItem.filter,
        t: {
          [key]: []
        }
      }
      if (hlItem.requirePast) newHlItem.requirePast = true;

      this.userGarage.playerDeck.map((hCar, icar) => {
        this.updateHLItem(newHlItem, hCar);
      });
      newHlItem.t[key].sort((a,b) => {
        if (key === "lessUseDay") {
          if (b.v !== a.v) return a.v - b.v;
          if (b.used !== a.used) return a.used - b.used;
          return this.carOrder(a,b);
        } else {
          if (b.v !== a.v) return b.v - a.v;
          if (key === "higherRQ") return this.carOrder(a,b);
          if (b.used !== a.used) return b.used - a.used;
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
    carOrder(a,b) {
      if (Vue.all_carsObj[a.car.rid].rq === Vue.all_carsObj[b.car.rid].rq) {
        return Vue.all_carsObj[a.car.rid].name.localeCompare(Vue.all_carsObj[b.car.rid].name);
      } else {
        return Vue.all_carsObj[b.car.rid].rq - Vue.all_carsObj[a.car.rid].rq;
      }
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
    },
    resetState() {
      this.userHighlights.map(hlItem => {
        // TODO: clear garage general tile
        if (hlItem.divider) return;
        hlItem.touched = false;
        if (hlItem.r) {
          hlItem.r = new rarityStats();
        }
        if (hlItem.t) {
          hlItem.t = new groupStats(hlItem.requirePast);
        }
        if (hlItem.tl) {
          hlItem.tl = Array.from({length: 12}, (_, i) => new timeline(i));
        }
      })
      this.resetOtherDiffStats();
      this.userGarageByDate = {};
      this.userGaragePast = {};
    },
    fixDate(date) {
      if (!date) return date;
      if (date.length === 13) return `${date}:00Z`
      return date;
    },
    toggleTopEdit() {
      this.topEdit = !this.topEdit;
    },
    updateYearPage(year) {
      this.garageYear = Number(year);
      this.userHighlights.map(hlItem => {
        if (hlItem.specialId) {
          if (hlItem.filter.newerThan) {
            hlItem.filter = {
              ...hlItem.filter,
              newerThan: `${year}-01-01T00:00:00.000Z`,
              olderThan: `${year}-12-31T23:59:59.000Z`
            };
          }
          if (hlItem.specialId === "myCarsYear") {
            hlItem.title = `New in ${year}`;
          }
          if (hlItem.specialId === "myCarsYearTimeline") {
            hlItem.title = `${year} Leggy Timeline`;
          }
          if (hlItem.specialId === "recap") {
            hlItem.title = `${year} Recap`;
          }

        }
      });
    },
    initPastGarageCompare() {
      if (!this.userGaragePast) return;
      if (!this.userGaragePast.playerDeck) return;

      if (Object.keys(this.userGarageByDate).length === 0) {
        this.transformNewGarageToDateObj();
      };

      this.otherDiffStats.eloScore = this.userGarage.eloScore - this.userGaragePast.eloScore;
      this.otherDiffStats.garageSlots = this.userGarage.garageSlots - this.userGaragePast.garageSlots;
      this.otherDiffStats.garageSlotsUsed = this.userGarage.garageSlotsUsed - this.userGaragePast.garageSlotsUsed;

      // let maxedTunZ = ["996", "969", "699"];
      let duplicateUnconflict = {};
      this.userGaragePast.playerDeck.map((pastC, ipastC) => {
        let found;
        let foundIndex;
        let D = pastC.date.slice(0, 10);
        let Dprev = new Date(new Date(D).getTime() - 24*60*60*1000).toISOString().slice(0,10);
        // look on the exact date and one day before

        [D, Dprev].map(D => {
          if (this.userGarageByDate[D]) {
            this.userGarageByDate[D].cars.map((c, ic) => {
              if (
                c.rid === pastC.rid &&
                c.cD >= pastC.cD &&
                c.cL >= pastC.cL &&
                c.cW >= pastC.cW
              ) {
                if (found) {
                  if (!duplicateUnconflict[`${c.rid}__${D}__${foundIndex}`]) {
                    // first duplicate, store previous
                    duplicateUnconflict[`${c.rid}__${D}__${foundIndex}`] = ipastC;
                  }
                }
                if (duplicateUnconflict[`${c.rid}__${D}__${ic}`]) {
                  // already in use
                  return;
                }
                found = c;
                foundIndex = ic;
              }
            });
          }
        });

        if (found) { // 2025 car that has been found in past garage
          found.inPast = true;
          found.cDdiff = found.cD - pastC.cD;
          found.cLdiff = found.cL - pastC.cL;
          found.cWdiff = found.cW - pastC.cW;
          if (found.tunZ !== pastC.tunZ) {
            found.oldTunZ = pastC.tunZ;
            found.oldTun = pastC.tun;
            if (found.tunZ.split("").reduce((a,b) => Number(a)+Number(b), 0) >= 24) {
              // create a list of cars
              // car: hCar,
              // v: carValue,
              // used: usedTimes
              this.otherDiffStats.maxed[ Vue.all_carsObj[found.rid].class ].v++;
              this.otherDiffStats.maxed[ Vue.all_carsObj[found.rid].class ].cars.push(found);
            }
          }
        }

        if (!found) {
          // past car not found in 2025 garage // sold or fused?
          this.otherDiffStats.missingCars++;
          if (false && pastC.tunZ.split("").reduce((a,b) => Number(a)+Number(b), 0) >= 24) { // missing full car
            // doesnt make sense, changed rarity cars break this logic
            this.otherDiffStats.missingFullCars.push(pastC);
          }
        }
      })

      this.userGaragePast.loaded = true;

      this.userHighlights.map(hlItem => {
        if (hlItem.requirePast) {
          this.userGarage.playerDeck.map((hCar, icar) => {
            this.updateHLItem(hlItem, hCar);
          });
          this.finishProcessPlayerDeckItem(hlItem);
        }
      });


      // { // old
      //   cD: 2,
      //   cL: 127,
      //   cW: 282,
      //   date: "2024-04-29",
      //   rid: "Hyundai_Veloster_Rally_Edition_2016",
      //   tun: "323",
      //   tunZ: "969"
      // }

      console.log("Missing cars", this.otherDiffStats.missingCars);
    },
    resetOtherDiffStats() {
      this.otherDiffStats = {
        eloScore: 0,
        garageSlots: 0,
        garageSlotsUsed: 0,
        newCars: 0,
        missingCars: 0,
        greatestDay: {},
        greatestDayFinal: null,
        S_prizes: new pastRarityItem(),
        tags: {
          "German Powerhaus": new pastRarityItem(true),
          "French Riviera": new pastRarityItem(true),
          "Asia-Pacific Revival": new pastRarityItem(true)
        },
        maxed: {
          S: new pastRarityItem(),
          A: new pastRarityItem(),
          B: new pastRarityItem(),
          C: new pastRarityItem(),
          D: new pastRarityItem(),
          E: new pastRarityItem(),
          F: new pastRarityItem()
        },
        new: {
          S: new pastRarityItem(),
          A: new pastRarityItem(),
          B: new pastRarityItem(),
          C: new pastRarityItem(),
          D: new pastRarityItem(),
          E: new pastRarityItem(),
          F: new pastRarityItem()
        },
        missingFullCars: []
      }
    },
    transformNewGarageToDateObj() {
      this.userGarageByDate = {};
      this.userGarage.playerDeck.map(hCar => {
        let D = hCar.date.slice(0, 10);
        if (!this.userGarageByDate[D]) {
          this.userGarageByDate[D] = {
            date: D,
            cars: []
          }
        }
        this.userGarageByDate[D].cars.push(hCar);
      })
    },
    computeCarToRecap(hCar) {
      if (!hCar.date.startsWith(this.garageYear)) return;
      let C = Vue.all_carsObj[hCar.rid];
      let CLA = C.class;

      this.otherDiffStats.newCars++;
      this.otherDiffStats.new[ CLA ].v++;
      this.otherDiffStats.new[ CLA ].cars.push(hCar);
      if (hCar.tunZ.split("").reduce((a,b) => Number(a)+Number(b), 0) >= 24) {
        this.otherDiffStats.maxed[ CLA ].v++;
        this.otherDiffStats.maxed[ CLA ].cars.push(hCar);
      }
      // if (CLA === "S" || CLA === "A" || CLA === "B") {
      if (CLA === "S" || CLA === "A") {
        let day = hCar.date.slice(0,10);
        if (!this.otherDiffStats.greatestDay[day]) this.otherDiffStats.greatestDay[day] = new pastRarityItem();
        this.otherDiffStats.greatestDay[day].v += this.pointsPerRarity[CLA];
        this.otherDiffStats.greatestDay[day].cars.push(hCar);
      }

      if (C.prize && CLA === "S") {
        this.otherDiffStats.S_prizes.v++;
        this.otherDiffStats.S_prizes.cars.push(hCar);
      }

      C.tags.map(tag => {
        if (this.otherDiffStats.tags[tag]) {
          // if (!this.otherDiffStats.tags[tag].ridList) this.otherDiffStats.tags[tag].ridList = [];
          if (!this.otherDiffStats.tags[tag].ridList.includes(hCar.rid)) {
            // uniques only
            this.otherDiffStats.tags[tag].ridList.push(hCar.rid);
            this.otherDiffStats.tags[tag].v++;
            this.otherDiffStats.tags[tag].cars.push(hCar); // random copy
          }
          if (!C.prize && CLA === "S") {
            // if (!this.otherDiffStats.tags[tag].S) this.otherDiffStats.tags[tag].S = [];
            this.otherDiffStats.tags[tag].S.push(hCar);
          }
        }
      })
    },
    finishRecap() {
      let greatest = 0;
      let greatestDay = null;
      Object.keys(this.otherDiffStats.greatestDay).map(day => {
        if (this.otherDiffStats.greatestDay[day].v > greatest) {
          greatest = this.otherDiffStats.greatestDay[day].v;
          greatestDay = day;
        }
      });
      if (greatestDay) {
        this.otherDiffStats.greatestDayFinal = this.otherDiffStats.greatestDay[greatestDay];
        this.otherDiffStats.greatestDayFinal.date = greatestDay;
        this.otherDiffStats.greatestDayFinal.cars.sort((a,b) => {
          return Vue.all_carsObj[b.rid].rq - Vue.all_carsObj[a.rid].rq;
        });
      };

      this.otherDiffStats.S_prizes.cars.sort((a,b) => {
        return new Date(a.date) - new Date(b.date);
      });

      Object.keys(this.otherDiffStats.tags).map(tag => {
        if (!this.otherDiffStats.tags[tag].S) return;
        this.otherDiffStats.tags[tag].S.sort((a,b) => {
          return Vue.all_carsObj[b.rid].rq - Vue.all_carsObj[a.rid].rq;
        });
      })
    },
    pastRarityClick(hlItem, CLA, type) {
      this.otherDiffStats[type][CLA].cars.sort((a,b) => {
        return new Date(a.date) - new Date(b.date);
      })

      this.rarityListArr = this.otherDiffStats[type][CLA].cars;
      this.rarityListDialog = true;
      this.rarityDialogTitle = `${type === "new" ? "New" : "Maxed"} ${CLA} cars (${this.otherDiffStats[type][CLA].v})`;
      this.rarityDialogSub = "Date acquired";
    },
    initAutoShare() {
      let item = this.userHighlights.find(hl => hl.specialId === "recap");
      if (item) {
        this.autoShareConfirmDialog = false;
        this.autoShareRunning = true;
        this.sharePrint(item);
      }
    },
    loadPreviousYear() {
      this.resetState();
      this.load(this.garageYear - 1);
      this.changeScreen('normal');
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
.BaseMyGarage_AddGroupBoxTop {
  padding-top: 30px;
  padding-bottom: 90px;
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
.BaseMyGarage_MonthTop.MainFindCar_CarCard {
  display: block;
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
.Main_BodyPrint .BaseMyGarage_AddGroupBoxTop,
.Main_BodyPrint .BaseMyGarage_EditBox,
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
.BaseMyGarage_LoadingBox .BaseMyGarage_RarityStatsItem,
.BaseMyGarage_RarityLoading {
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
.BaseMyGarage_RarityLoading {
  min-height: 72px;
}
.BaseMyGarage_Tutorial {
  max-width: 600px;
  margin: 0 auto 40px;
}
.BaseMyGarage_OrderedCount {
  opacity: 0.2;
  line-height: 1;
}
.BaseMyGarage_EditBox {
  position: relative;
}
.BaseMyGarage_EditBoxButtons {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 5px
}
.BaseMyGarage_PastSub {
  color: rgb(var(--d-text-yellow));
  text-align: center;
  margin-top: 30px;
  margin-bottom: 15px;
}
.BaseMyGarage_PastRarityBox {
  display: flex;
  justify-content: center;
  gap: 18px;
}
.BaseMyGarage_PastRarityValue {
  font-size: 16px;
}
.BaseMyGarage_PastRarityItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}
.BaseMyGarage_PastRarityName {
  font-size: 28px;
  transform: skewY(9deg);
  font-weight: bold;
  background-color: var(--classC);
  color: black;
  padding: 5px 10px;
  opacity: 0.9;
  border-radius: 2px;
  /* box-shadow: 0px 0px 0px -0.1px var(--classC); */
}
.BaseMyGarage_RarityStatsValueWithIcon {
  display: flex;
  align-items: center;
}
.BaseMyGarage_StatValueIcon {
  color: rgb(var(--d-text-green));
  margin-right: 3px;
  font-size: 17px;
  margin-bottom: 4px;
}
.BaseMyGarage_GarageSlot {

}
.BaseMyGarage_PastTop {
  padding-bottom: 0px;
}
.BaseMyGarage_PastGreatestDayList {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 30px;
}
.BaseMyGarage_PastGarageStats:last-child {
  padding-bottom: 60px;
}
.BaseMyGarage_RarityTagColor {
  color: hsl(var(--tag-h), var(--tag-s), var(--tag-l));
}
.BaseMyGarage_RarityTag {
  margin-bottom: 4px;
}
.BaseMyGarage_RarityTag:first-child {
  margin-top: 4px;
}
.BaseMyGarage_STagsList {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-grow: 1;
  align-items: center;
  align-content: center;
}
.BaseMyGarage_ShareGiveaway {
  position: absolute;
  left: 0px;
  top: 0px;
  width: clamp(50px, 30vw, 190px);
  display: flex;
  flex-direction: column;
  gap: 3px;
  background-color: #a9904129;
  color: #cdc2a3;
  box-shadow: inset 0px 0px 0px 2px #ffe39417;
  border-radius: 10px;
  padding: 6px 10px;
}
.BaseMyGarage_ShareTextSub {
  font-size: 0.8em;
  opacity: 0.7;
}
.BaseMyGarage_TryAutoShare {
  align-self: flex-start;
  font-size: 14px;
  --height: 28px;
  margin-top: 4px;
}
.BaseMyGarage_ShareDialogBox {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}
.BaseMyGarage_ShareDialogIcon {
  font-size: 40px;
  color: rgb(var(--d-text-green));
}
.BaseMyGarage_ShareGroup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}
</style>