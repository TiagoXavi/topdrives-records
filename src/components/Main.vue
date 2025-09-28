<template>
  <div
    :class="{
      Main_Normal: !inverted,
      Main_2: inverted && mode === 'compare',
      Main_Compact: (compact && mode === 'compare') || ((mode === 'challenges' || mode === 'events' || mode === 'clubs') && windowWidth < 1200),
      Main_ColorsFull: fullColors,
      Main_ColorsMedal: !fullColors,
      Main_ShowPoints: showPoints
    }"
    class="Main_Layout"
    @gestureend="gestureResolve($event)"
    @click.stop="outsideClick()">
    <div
      v-if="mode === 'compare'"
      :class="{ Main_BodyEmpty: carDetailsList.length === 0 }"
      class="Main_Body"
      @click.stop="outsideClick()">
      <div class="Main_LeftPlusTop">
        
        <div class="Main_Corner">
          <BaseCorner
            style="display: contents;"
            :gameVersion="gameVersion"
            @menu="openMainDialog();"
            @camera="shareDialog = true; generateUrl(); generateCarsList();">
            <template slot="by">
              <div v-if="user && inverted" class="Main_PrintBy">
                <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
                <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
              </div>
            </template>
            <template slot="more">
              <button
                style="font-size: 18px;     padding: 9px 9px;"
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu Main_BestOfOutside"
                @click="openKingOfDialog()">
                <i class="ticon-crown D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/>
                <span>{{ $t("m_bestOf") }}</span>
              </button>
            </template>
          </BaseCorner>
          <div class="Main_RowCornerBox">
            
            <div v-if="carDetailsList.length > 0 && currentTracks.length > 0" class="Main_RowCorner">
              <template v-if="!user">
                <div class="Main_SaveAllBox">
                  <button
                    class="D_Button Main_LoginToEdit"
                    @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
                </div>
              </template>
              <template v-else-if="!!user && isImport">
                <div class="Main_SaveAllBox">
                  <button
                    :class="{ D_Button_Loading: saveLoading }"
                    class="D_Button Main_SaveAllButton"
                    @click="saveImport()">Import</button>
                </div>
              </template>
              <template v-else-if="!!user && needSave">
                <div class="Main_SaveAllBox">
                  <button
                    :class="{ D_Button_Loading: saveLoading }"
                    class="D_Button Main_SaveAllButton"
                    @click="saveAll()">{{ $t("m_save") }}</button>
                </div>
              </template>
              <template v-else-if="isMobile || $store.state.homePointsToggle">
                <div class="Main_SaveAllBox" @click.stop>
                  <BaseSwitch v-model="showPoints" :label="$t('m_points')" :horizontal="true" @click="pointsToggle()" />
                </div>
              </template>

              <div v-if="user && !inverted" class="Main_PrintBy">
                <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
                <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
              </div>
            </div>

          </div>
        </div>
        <div class="Main_Left">
          <div class="Main_TrackList">
            <Row
              :list="currentTracks"
              :hoverIndex="hoverIndex"
              :loggedin="!!user"
              :user="user"
              :needSave="needSave"
              :saveLoading="saveLoading"
              :voteLoading="voteLoading"
              :invertedView="inverted"
              type="tracks"
              @newindex="newIndex($event, false, true)" />
            <div class="Row_ShowMoreTracks Main_AddTrackBox">
              <button class="D_Button Main_AddTrackDirect Main_AddTrackDirectLarger" @click="openDialogTrackSearch(false)">
                <i class="ticon-plus_2" aria-hidden="true"/>
              </button>
              <button
                v-if="smartCampaign.length > 0"
                style="opacity: 1;"
                class="D_Button D_ButtonLink Row_ShowMoreButton"
                @click="campaignDialog = true;">{{ $t("m_campaign") }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="Main_Mid">
        <div class="Main_BacktopBox">
          <div class="Main_Backtop"></div>
        </div>
        <div v-if="showCarsFix" class="Main_CarList" @click.stop @mouseleave="hoverIndex = -1;">
          <template v-for="(car, carIx) in carDetailsList">
            <Car
              :car="car"
              :index="carIx"
              :lastIndex="carDetailsList.length - 1"
              :countPerTrack="countTimesPerTrack"
              :trackList="currentTracks"
              :highlights="highlights[carIx]"
              :points="pointsResolved[carIx]"
              :showPoints="showPoints && carHoverIndex !== carIx"
              :isReferencePoints="showPoints && carHoverIndex === carIx"
              :hoverIndex="hoverIndex"
              :maxCarNumber="maxCarNumber"
              :loggedin="!!user"
              :user="user"
              :downloadLoading="downloadLoading || lastestLoading"
              :key="carIx"
              :voteLoading="voteLoading"
              :needSave="needSave"
              :invertedView="inverted"
              :compact="compact"
              @longTouch="carLongTouch(carIx)"
              @delete="deleteCar(carIx)"
              @moreTracks="moreTracksCar($event)"
              @newindex="newIndex($event)"
              @enter="hoverCarJs(carIx)" />
          </template>
          <template v-if="carDetailsList.length < maxCarNumber">
            <div
              :class="{ Car_WithMidEmpty: carDetailsList.length === 0 }"
              class="Car_Layout Car_LayoutAddCar"
              @mouseenter="$store.commit('HOVER_INDEX', -1)">
              <div class="Car_Header Car_AddHeader">
                <button class="D_Button Car_AddButton add" @click="searchFilterDialog = true;">
                  <i class="ticon-plus_2 Car_AddIcon" aria-hidden="true"/>
                  <div class="Car_LayoutAddCarLabel">{{ $t("m_searchCar") }}</div>
                </button>
              </div>
            </div>
          </template>
          <template v-if="carDetailsList.length === 0">
            <div
              class="Car_Layout Car_LayoutAddCar Car_WithMidEmpty"
              @mouseenter="$store.commit('HOVER_INDEX', -1)">
              <div class="Car_Header Car_AddHeader">
                <button class="D_Button Car_AddButton add" @click="openLibraryDialog()">
                  <i class="ticon-dash Car_AddIcon" aria-hidden="true"/>
                  <div class="Car_LayoutAddCarLabel">{{ $t("m_library") }}</div>
                </button>
              </div>
            </div>
          </template>
        </div>
        
        <div class="Main_PrintCreditsBottom" :style="`--number-cars: ${carDetailsList.length}; --number-tracks: ${currentTracks.length}`">
          <span style="color: #7c7c7c; margin-right: 3px;">{{ $t("m_contributors") }}: </span>
          <template
            v-for="(username, i) in contributorsList">
            <template v-if="i > 0">, </template>
            <span :class="`Main_UserT${highlightsUsers[username]}`">{{ username }}</span>
          </template>
        </div>
      </div>
      <!-- <div v-if="carDetailsList.length === 0" class="Main_MidEmpty">
        <div class="Main_MidEmptyInner">
          <div class="Main_MidEmptyItem Main_MidEmptyItemAdd">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButtonSearch"
              @click="openLibraryDialog()">
              <i class="ticon-dash Main_EmptyAddIcon" aria-hidden="true"/>
              <div class="Main_EmptyAdd">{{ $t("m_library") }}</div>
            </button>
          </div>
          <div class="Main_MidEmptyItem Main_MidEmptyItemAdd">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButtonSearch"
              @click="searchFilterDialog = true;">
              <i class="ticon-plus_2 Main_EmptyAddIcon" aria-hidden="true"/>
              <div class="Main_EmptyAdd">{{ $t("m_searchCar") }}</div>
            </button>
          </div>
        </div>
      </div> -->
    </div>
    <div
      v-else-if="mode === 'challenges'"
      class="Cg_Layout"
      @click.stop="outsideClick()">
      <div class="Cg_Header">
        <div class="Cg_HeaderLeft">
          <BaseCorner
            :gameVersion="gameVersion"
            @menu="openMainDialog();"
            @longCamera="showPoints = !showPoints;"
            @camera="shareDialog = true; generateUrl();">
            <template slot="more">
              <BaseText
                v-if="user && user.username === 'TiagoXavi'" 
                v-model="pasteInputModel"
                type="normal"
                placeholder="paste here"
                class="BaseText_InternalMicro"
                @paste="resolvePaste($event)" />
            </template>
          </BaseCorner>
          <div class="Cg_RowCornerBox">
            <!-- top CHALLENGE -->
            <div v-if="cg.rounds" class="Cg_SelectorLayout">
              <div class="Cg_SelectorLeft">
                <button
                  :disabled="cgCurrentRound === 0 || cgLoadingAny || cgNeedSave"
                  class="D_Button Row_DialogButtonTune"
                  @click="loadPrevRound()">
                  <i class="ticon-arrow_left_3" aria-hidden="true"/>
                </button>
              </div>
              <div class="Cg_SelectorCenter">
                <div class="Cg_SelectorEvent">
                  <button
                    :disabled="cgLoadingAny || cgNeedSave"
                    class="D_Button Main_ArrowDownSelect"
                    @click="cgSeletorDialog = true;">
                    <span class="Cg_SelectorEventSpan">{{ cg.name }}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                </div>
                <div class="Cg_SelectorRound">
                  <button
                    :disabled="cgLoadingAny || cgNeedSave"
                    class="D_Button Main_ArrowDownSelect"
                    @click="cgRoundSelectorDialog = true;">
                    <span>{{ $tc("m_round", 1) }} {{ cgCurrentRound+1+cgCurrentRoundSum }}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                </div>
                <div v-if="cgRound && !cgIsApproving && !isRoundEmptyForUser && !cgNewSubmitByMod">
                  <template v-if="cgRound.creator">
                    <span class="Main_SearchResultUserBy Cg_Creator">{{ $t("m_by") }}&nbsp;</span>
                    <span
                      :class="`Main_UserT${highlightsUsers[cgRound.creator]}`"
                      class="Main_SearchResultUser Cg_Creator">{{ cgRound.creator }}</span>
                  </template>
                  <span class="Cg_ViewsCount Main_ViewsBox">
                    <span class="Main_ViewsCount">{{ (statistics[`cg_${cgCurrentId}_${cgCurrentRound}`] || {}).c || 0 }} views</span>
                  </span>
                </div>
                <div class="Cg_CenterBottom">
                  <div
                    :style="`color: ${ cgRound.rqFill > cgRound.rqLimit ? '#a90000' : '' }`"
                    class="Cg_RqText">
                    <span class="Cg_RqRq"><i class="tdicon-rq" aria-hidden="true"/></span>
                    <span>{{ cgRound.rqFill }}</span>
                    <span>/</span>
                    <span :style="`color: ${ cgRound.rqLimit === 500 ? '#a90000' : '' }`">{{ cgRound.rqLimit }}</span>
                    <BaseButtonTouch
                      v-if="user && (user.mod || isRoundEmptyForUser) && (!cgIsApproving || user.mod) && !cgIsApproving"
                      :disabled="cgLoadingAny"
                      class="D_Button Main_AddTrackDirect"
                      @click="cgOpenRqEdit($event)"
                      @longTouch="cgOpenRqEdit({ shiftKey: true, ctrlKey: true })">
                      <i class="ticon-pencil" aria-hidden="true"/>
                    </BaseButtonTouch>
                    <div
                      v-if="cgRound.showPoints && cgRound.lastAnalyze"
                      :class="{ Cg_PointsSum_Red: cgRound.sumPoints < 250, Cg_PointsSum_Green: cgRound.sumPoints >= 250 }"
                      class="Cg_PointsSum">
                      <span class="Cg_Pts">pts</span>
                      <span class="Cg_PointsSumText">{{ cgRound.sumPoints }}</span>
                    </div>
                  </div>
                  <!-- save button -->
                  <div class="Cg_SaveButtonBox">
                    <template v-if="!user">
                      <div class="Main_SaveAllBox">
                        <button
                          class="D_Button Main_LoginToEdit"
                          @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
                      </div>
                    </template>
                    <template v-else-if="user && !user.mod && isRoundEmptyForUser && cgNeedSave && isRoundReadyForSaveUser">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
                          class="D_Button Main_SaveAllButton"
                          @click="cgSaveAll()">{{ $t("m_submitReview") }}</button>
                      </div>
                    </template>
                    <template v-else-if="user && cgNeedSave && !isRoundEmptyForUser">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
                          class="D_Button Main_SaveAllButton"
                          @click="cgSaveAll()">{{ $t("m_save") }}</button>
                      </div>
                    </template>
                    <template v-if="showAnalyse && !cgIsApproving">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
                          class="D_Button Main_SaveAllButton"
                          @click="cgAnalyseRound()">{{ $t("m_analyze") }}</button>
                      </div>
                    </template>
                    <div v-if="user" class="Main_PrintBy">
                      <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
                      <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="Cg_SelectorRight">
                <button
                  :disabled="cgCurrentRound === cgRoundsNumber - 1 || cgLoadingAny || cgNeedSave"
                  class="D_Button Row_DialogButtonTune"
                  @click="loadNextRound()">
                  <i class="ticon-arrow_right_3" aria-hidden="true"/>
                </button>
              </div>
            </div>
            

          </div>

          <BaseFilterDescription
            :filter="cgRound.filter"
            :loading="cgLoadingAny"
            :user="user"
            :ready="cgRound.date && user && (user.mod || isRoundEmptyForUser) && !cgIsApproving"
            class="Cg_Right"
            @changeClick="cgOpenRequirementDialog()" />

          <div class="Cg_RqCount">
            <div
              :style="`width: ${ (cgRound.rqFill * 100) / cgRound.rqLimit }%; background-color: ${ cgRound.rqFill > cgRound.rqLimit ? '#a90000' : '' }`"
              class="Cg_RqFill" />
          </div>
        </div>
      </div>

      <!-- NOT THIS TIME -->
      <div v-if="cgRound.date && cgRound.notThisTime" class="Cg_Mid">
        <div class="Cg_NotThisTime_Icon">
          <svg class="Cg_NotThisTime_IconSvg" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 512 360" viewBox="0 0 512 360">
            <path d="M31.4 8.2C37.4 5.5 44 4 50.6 4.1h407.7c7.6-.2 15.4.8 22.2 4.2-70.9 71-141.7 142.1-212.5 213.2-4.7 5.1-12.7 5.9-18.9 3.6-3.2-1.1-5.4-3.8-7.7-6.1-70-70.3-140-140.5-210-210.8zM5.7 44.2c.9-5.3 2.3-10.6 4.7-15.5C60.7 79.1 111 129.6 161.2 180.1 111 230.5 60.7 280.9 10.4 331.3c-2.3-4.8-3.8-10-4.7-15.3V44.2zM350.8 180.1C401 129.6 451.3 79.2 501.6 28.7c2.3 4.8 3.7 10 4.7 15.3v270.6c-.5 5.8-2.2 11.5-4.7 16.7-50.3-50.4-100.5-100.8-150.8-151.2z"/>
            <path d="M31.4 351.9c50.2-50.3 100.4-100.7 150.5-151 14.3 14.2 28.4 28.6 42.7 42.7 14.5 14 38.4 16 55.4 5.6 5.3-3.1 9.4-7.6 13.7-11.9 12.1-12.1 24.2-24.3 36.3-36.4 50.2 50.4 100.4 100.7 150.6 151.1-6.1 2.6-12.6 4.2-19.3 4.1H50.6c-6.6 0-13.2-1.5-19.2-4.2z"/>
          </svg>
        </div>
        <div class="Cg_NotThisTime_P">{{ $t("p_cgNotThisTime1") }}</div>
        <div class="Cg_NotThisTime_P">{{ $t("p_cgNotThisTime2") }}</div>
        <div class="Cg_NotThisTime_P">{{ $t("p_cgNotThisTime3") }} <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonDarkYellow Cg_NotThisTime_Button" @click="$router.push({ name: 'Community' });">Community</button></div>
        <div class="Cg_NotThisTime_P">{{ $t("p_cgNotThisTime4") }}</div>
        <div class="Cg_NotThisTime_P">{{ $t("p_cgNotThisTime5") }}</div>
        <div v-if="cgRound.date && user && user.username" class="Cg_BottomModTools">
          <!-- Down -->
          <button
            :class="{
              Row_VotedAgainst: cgRound.upList && cgRound.upList.includes(user.username),
              D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading
            }"
            :title="(cgRound.downList || []).join(', ')"
            class="D_Button Row_VoteButton Row_VoteButtonDown"
            @click="cgVote('down')">
            <i
              :class="`ticon-thumbs_down${ cgRound.downList && cgRound.downList.includes(user.username) ? '_fill' : '' }`"
              class="Row_VoteIcon"
              aria-hidden="true"/>
            <span class="Row_DownCount">{{ (cgRound.downList || []).length }}</span>
          </button>
          <!-- Up -->
          <button
            :class="{
              Row_VotedAgainst: cgRound.downList && cgRound.downList.includes(user.username),
              D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading
            }"
            :title="(cgRound.upList || []).join(', ')"
            class="D_Button Row_VoteButton Row_VoteButtonUp"
            @click="cgVote('up')">
            <i
              :class="`ticon-thumbs_up${ cgRound.upList && cgRound.upList.includes(user.username) ? '_fill' : '' }`"
              class="Row_VoteIcon"
              aria-hidden="true"/>
            <span class="Row_UpCount">{{ (cgRound.upList || []).length }}</span>
          </button>
        </div>
      </div>

      <div v-else-if="(cgLoading && (!cgRound || !cgRound.date)) || (downloadLoading && !user && cgLoading)" class="Cg_Mid">
        <div class="Cg_MidLoading">
          <BaseContentLoader
            :contents="true"
            :itemWidth="windowWidth < 1200 ? '111px' : '216px'"
            :itemHeight="144"
            style="padding: 10px 10px 10px 20px; width: 100%;"
            type="block"
            count="5" />
        </div>
      </div>

      <div v-else-if="cgRound.date" class="Cg_Mid">
        <!-- <div>{{ "isRoundEmptyForUser" }} {{ isRoundEmptyForUser }}</div>
        <div>{{ "cgRound.date" }} {{ cgRound.date }}</div>
        <div>{{ "cgRound.reservedTo" }} {{ cgRound.reservedTo }}</div>
        <div>{{ "cgIsApproving" }} {{ cgIsApproving }}</div> -->

        <!-- CG MID -->

        <template v-if="cgIsApproving" >
          <!-- CG SUBMITS NAVIGATION -->
          <div class="Cg_RoundSubmitsControl">
            <div v-if="cgApprovingLength > 1" class="Cg_SelectorLeft">
              <button
                :disabled="cgApprovingIndex === 0 || cgLoadingAny || cgNeedSave"
                class="D_Button Row_DialogButtonTune"
                @click="cgChangeSubmit(-1)">
                <i class="ticon-arrow_left_3" aria-hidden="true"/>
              </button>
            </div>
            <div class="Cg_RoundSubmitsControlCenter">
              <div v-if="!cgRound.downList || (!user || !user.username || !cgRound.downList.includes(user.username))" style="margin-bottom: 10px;" class="Cg_RoundEmptyBody">{{ $t("p_emptyRoundVoteForUser") }}</div>
              <div v-else class="Cg_BottomModTools" style="margin-top: -10px; margin-bottom: 6px;">
                <button
                  v-for="(n, ix) in 2"
                  :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
                  class="D_Button D_ButtonDark D_ButtonDark2"
                  @click="cgUserNewSubmit(ix === 1)">
                  <i class="ticon-refresh_3 D_ButtonIcon" aria-hidden="true"/>
                  <span>{{ ix === 0 ? $t("m_new") : $t("m_newByCopy") }}</span>
                </button>
              </div>
              <div v-if="cgRound && cgRound.creator" style="margin-bottom: 10px;">
                <span class="Main_SearchResultUserBy Cg_Creator">{{ $t("m_by") }}&nbsp;</span>
                <span
                  :class="`Main_UserT${highlightsUsers[cgRound.creator]}`"
                  class="Main_SearchResultUser Cg_Creator">{{ cgRound.creator }}</span>
              </div>
              <template v-if="user && user.mod">
                <div class="Cg_IsApprovingBox">
                  <button
                    v-if="(cgRound.downList || []).includes(user.username)"
                    :class="{ D_Button_Loading: cgSaveLoading }"
                    style="right: unset; left: 0;"
                    class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
                    @click="cgReviewRound(false)">
                    <span>{{ $t("m_delete") }}</span>
                  </button>
                  <button
                    v-else
                    :class="{ D_Button_Loading: cgSaveLoading }"
                    style="right: unset; left: 0;"
                    class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen"
                    @click="cgReviewRound(true)">
                    <span>{{ $t("m_approve") }}</span>
                  </button>
                </div>
              </template>
            </div>
            <div v-if="cgApprovingLength > 1" class="Cg_SelectorRight">
              <button
                :disabled="cgApprovingIndex === cgApprovingLength - 1 || cgLoadingAny || cgNeedSave"
                class="D_Button Row_DialogButtonTune"
                @click="cgChangeSubmit(1)">
                <i class="ticon-arrow_right_3" aria-hidden="true"/>
              </button>
            </div>
          </div>
          <!-- CG VOTE -->
          <div v-if="user && user.username" class="Cg_BottomModTools">
            <!-- Down -->
            <button
              :class="{
                Row_VotedAgainst: cgRound.upList && cgRound.upList.includes(user.username),
                D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading
              }"
              :title="(cgRound.downList || []).join(', ')"
              class="D_Button Row_VoteButton Row_VoteButtonDown"
              @click="cgVote('down')">
              <i
                :class="`ticon-thumbs_down${ cgRound.downList && cgRound.downList.includes(user.username) ? '_fill' : '' }`"
                class="Row_VoteIcon"
                aria-hidden="true"/>
              <span class="Row_DownCount">{{ (cgRound.downList || []).length }}</span>
            </button>
            <!-- Up -->
            <button
              :class="{
                Row_VotedAgainst: cgRound.downList && cgRound.downList.includes(user.username),
                D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading
              }"
              :title="(cgRound.upList || []).join(', ')"
              class="D_Button Row_VoteButton Row_VoteButtonUp"
              @click="cgVote('up')">
              <i
                :class="`ticon-thumbs_up${ cgRound.upList && cgRound.upList.includes(user.username) ? '_fill' : '' }`"
                class="Row_VoteIcon"
                aria-hidden="true"/>
              <span class="Row_UpCount">{{ (cgRound.upList || []).length }}</span>
            </button>
          </div>
        </template>

        <template v-else-if="!isRoundComplete || (user && !user.mod && isRoundComplete && isRoundReadyForSaveUser)">

          <!-- CG mod is doing already -->
          <template v-if="cgRound.reservedTo && cgRound.reservedTo !== (user || {}).username">
            <div v-if="!cgSentForReview" class="Cg_RoundEmptyBox">
              <div class="Cg_RoundEmptyBody">{{ $t("p_modDoingRound", { mod: cgRound.reservedTo }) }}</div>
            </div>
          </template>

          <template v-else>
            <!-- CG not logged int -->
            <div v-if="!isRoundEmptyForUser && !user && !isRoundComplete && !cgLoading" class="Cg_RoundEmptyBox">
              <div class="Cg_RoundEmptyTitle">{{ $t("m_emptyRound") }}</div>
              <div class="Cg_RoundEmptyBody">{{ $t("p_emptyRound2") }}</div>
              <div class="Cg_RoundEmptyBody">{{ $t("p_emptyRoundLogin") }}</div>
              <BaseDiscordButton style="margin-top: 20px;" />
            </div>

            <!-- CG user logged in -->
            <div v-if="isRoundEmptyForUser && cgRound.date && !cgIsApproving && !cgRound.reservedTo" class="Cg_RoundEmptyBox">
              <div v-if="cgSentForReview" style="margin-bottom: 10px;" class="Cg_RoundEmptyBody Cg_RoundEmptyThanks">{{ $t("p_userSentCgForAnalyse") }}</div>
              <div v-else style="margin-bottom: 10px;" class="Cg_RoundEmptyBody">{{ $t("p_emptyRoundForUser") }}</div>
            </div>

            <!-- CG user mod -->
            <template v-if="isRoundEmptyForModders && !isRoundComplete && !cgRound.reservedTo">
              <div class="Cg_RoundEmptyBox Cg_RoundEmptyBoxMods">
                <div class="Cg_RoundEmptyTitle">{{ $t("m_emptyRound") }}</div>
                <div class="Cg_RoundEmptyBody">{{ $t("p_lockRoundPhrase") }}</div>
                <button
                  :class="{ D_Button_Loading: cgSaveLoading }"
                  style="margin-top: 20px;"
                  class="D_Button D_ButtonDark D_ButtonDark2"
                  @click="cgReserveRound()">
                  <span class="">{{ $t("m_lockRound") }}</span>
                </button>
              </div>
            </template>
          </template>

        </template>
        
        <!-- CG unlock button -->
        <div
          style="margin-bottom: 10px;"
          class="Cg_RoundEmptyBox">
          <template v-if="cgRound.reservedTo && (isRoundModAllowedEdit || (user && user.username === 'TiagoXavi'))">
            <button
              :class="{ D_Button_Loading: cgSaveLoading }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="cgReserveRound()">
              <span class="">{{ $t("m_unlockRound") }}</span>
            </button>
          </template>
        </div>
        
        <!-- <template v-if="
          (isRoundEmptyForModders && !cgIsApproving && !cgNewSubmitByModTemplate && cgBlockDownloadAssets) ||
          cgNewSubmitByMod ||
          (!user && ((cgRound.races && cgRound.races[0] && cgRound.races[0].track === null) || (!isRoundComplete && !cgLoading))) ||
          (cgRound.reservedTo && cgRound.reservedTo !== user.username)" /> -->

        
        <!-- CG CORE -->
        <template v-if="!cgNewSubmitByMod && (isRoundComplete || user) && (!cgRound.reservedTo || (user && cgRound.reservedTo === user.username))">
          <div v-if="showCarsFix" class="Cg_Box" style="margin-bottom: 25px;">
            <div
              v-for="(race, irace) in cgRound.races"
              class="Cg_Race"
              @click.stop>
              <div class="Cg_Opponent">
                <BaseCard
                  v-if="race.car"
                  :car="race.car"
                  :customData="Vue.all_cacheObj[race.car.rid]"
                  :fix-back="true"
                  :downloadLoading="cgLoadingAny"
                  :needSave="needSave"
                  :draggable="false"
                  :cgOppo="true"
                  :options="!cgIsApproving"
                  :hideClose="!user || !user.mod || !isRoundModAllowedEdit"
                  :showResetTune="(user && user.mod && isRoundModAllowedEdit) || isRoundEmptyForUser"
                  @cog="cgShowTuneDialog(race.car, race, true)"
                  @longTouch="cgShowTuneDialog(race.car, race, true)"
                  @delete="race.car = undefined; race.rid = null; calcRaceResult(race);"
                  @refreshTune="cgChangeTuneOppo(race.car, undefined, race)" />
                <div v-else class="Cg_CarPlaceHolder">
                  <button
                    :disabled="cgLoadingAny || !user || (!user.mod && !isRoundEmptyForUser) || (isRoundEmptyForModders && !isRoundComplete && !cgRound.reservedTo)"
                    class="D_Button Car_AddButton add"
                    @click="cgOpenAddOppoCar(irace);">
                    <i class="ticon-plus_2 Car_AddIcon" aria-hidden="true"/>
                  </button>
                </div>
                <!-- <div class="Main_" v-if="race.car">{{race.car.selectedTune}}</div> -->
                
                <div v-if="race.car && !race.car.selectedTune" class="Cg_OppoTuneBox">
                  <button
                    class="D_Button Cg_OppoTuneButton"
                    @click="cgChangeTuneOppo(race.car, '332', race)">332</button>
                  <button
                    class="D_Button Cg_OppoTuneButton"
                    @click="cgChangeTuneOppo(race.car, '323', race)">323</button>
                  <button
                    class="D_Button Cg_OppoTuneButton"
                    @click="cgChangeTuneOppo(race.car, '233', race)">233</button>
                  <button
                    v-if="race.car && (race.car.class === 'S' || race.car.class === 'A')"
                    class="D_Button Cg_OppoTuneButton"
                    @click="cgChangeTuneOppo(race.car, '111', race)">111</button>
                  <button
                    class="D_Button Cg_OppoTuneButton"
                    @click="cgChangeTuneOppo(race.car, '000', race)">000</button>
                  <button
                    class="D_Button Cg_OppoTuneButton"
                    @click="cgChangeTuneOppo(race.car, 'Other', race)">{{ $t("m_other") }}</button>
                </div>
              </div>
              <div class="Cg_Track">
                <Row
                  v-if="race.track"
                  :list="race.resolvedTracks"
                  :loggedin="!!user"
                  :user="user"
                  :cg="true"
                  class="Cg_TrackBox"
                  type="tracks" />
                <button
                  v-if="!!user && (isRoundModAllowedEdit || isRoundEmptyForUser) && !cgIsApproving"
                  :disabled="cgLoadingAny || !user || (!user.mod && !isRoundEmptyForUser)"
                  :class="{ Cg_SelectTrackButtonEdit: race.track }"
                  class="D_Button Car_AddButton Cg_SelectTrackButton"
                  @click="cgRaceSelected = irace; openDialogTrackSearch(false);">
                  <i v-if="race.track" class="ticon-pencil Cg_SelectTrackButtonIcon" aria-hidden="true"/>
                  <span v-else>{{ $t("m_selectTrack") }}</span>
                </button>
              </div>
              <div v-if="race.car && race.car.selectedTune && race.track" class="Cg_ThemTime">
                <Row
                  :car="race.car"
                  :list="race.resolvedTracks"
                  :loggedin="!!user"
                  :user="user"
                  :voteLoading="voteLoading"
                  :cg="true"
                  :cgOppo="true"
                  :cgTime="race.time"
                  :customData="Vue.all_cacheObj[race.car.rid]"
                  :forceDisabled="!user || (!user.mod && !isRoundEmptyForUser) || cgIsApproving || (user.mod && !isRoundModAllowedEdit)"
                  :placeholder="$t('m_timeToBeat')"
                  :forceCustomAuthor="isRoundEmptyForUser"
                  type="times"
                  @deleteTime="cgDeleteTime(race, $event, true)"
                  @changeTime="cgChangeTimeOppo(race, $event, irace)" />
              </div>
              <div v-else class="Cg_ThemTime">
                <div class="Row_Cell Row_DisabledCell" />
              </div>
              <template v-if="race.track && race.car && (cgRound.lastAnalyze || (!!user && user.mod) || cgRound.isPreview) && (!cgIsApproving || cgRound.isPreview)">
                <template v-if="!cgRound.isPreview">
                  <div
                    :class="{
                      Cg_PointsRed: (race.cars[race.carIndex] || {}).points < 0 && race.track && race.car,
                      Cg_PointsGreen: (race.cars[race.carIndex] || {}).points > 0 && race.track && race.car,
                      Cg_PointsGrey: (race.cars[race.carIndex] || {}).points === 0 && race.track && race.car,
                    }"
                    class="Cg_Divider"
                    @click="cgOpenPointsEdit(race)"
                    @mousedown="showPoints = true;"
                    @mouseup="showPoints = false;"
                    @mouseleave="showPoints = false;">
                    <div class="Cg_DividerBackLight"></div>
                    <div v-if="!race.track || !race.car || (race.cars[race.carIndex] || {}).points === undefined" class="Cg_Points">{{ $t("m_select") }}</div>
                    <template v-else-if="showPointsCg">
                      <div class="Cg_Points">{{ (race.cars[race.carIndex] || {}).points }}</div>
                    </template>
                    <template v-else>
                      <div v-if="(race.cars[race.carIndex] || {}).points === 0" class="Cg_Points">{{ $t("m_draw") }}</div>
                      <div v-else-if="(race.cars[race.carIndex] || {}).points > 0" class="Cg_Points">{{ $t("m_win") }}</div>
                      <div v-else-if="(race.cars[race.carIndex] || {}).points < 0" class="Cg_Points">{{ $t("m_lose") }}</div>
                      <div v-else class="Cg_Points">{{ (race.cars[race.carIndex] || {}).points }}</div>
                    </template>
                  </div>
                  <div class="CgYouCar">
                    <BaseCard
                      v-if="(race.cars[race.carIndex] || {}).car"
                      :car="(race.cars[race.carIndex] || {}).car"
                      :customData="Vue.all_cacheObj[(race.cars[race.carIndex] || {}).rid]"
                      :fix-back="true"
                      :downloadLoading="cgLoadingAny"
                      :draggable="false"
                      @delete="race.carIndex = undefined; calcRaceResult(race);" />
                    <div v-else class="Cg_CarPlaceHolder">
                      <button
                        :disabled="cgLoadingAny"
                        class="D_Button Car_AddButton add"
                        @click="cgOpenAddYouCar(irace)">
                        <i class="ticon-plus_2 Car_AddIcon" aria-hidden="true"/>
                      </button>
                    </div>
                  </div>
                  <div
                    v-if="(race.cars[race.carIndex] || {}).car && race.track"
                    class="Cg_YouTime">
                    <Row
                      :car="(race.cars[race.carIndex] || {}).car"
                      :list="race.resolvedTracks"
                      :loggedin="!!user"
                      :user="user"
                      :voteLoading="voteLoading"
                      :cg="true"
                      :cgYou="true"
                      :oppoTime="race.time"
                      :forceHideCompactSelect="windowWidth < 1200"
                      :customData="Vue.all_cacheObj[(race.cars[race.carIndex] || {}).rid]"
                      type="times"
                      @changeTime="cgChangeTimeYou(race, $event)"
                      @changeTune="cgChangeTuneYou(race, $event)"
                      @deleteTime="cgDeleteTime(race, $event)"
                      @showTuneDialog="cgShowTuneDialog(race.cars[race.carIndex].car, race)" />
                  </div>
                  <div v-else class="Cg_YouTime">
                    <div class="Row_Cell Row_DisabledCell" />
                  </div>
                </template>
                <div class="Cg_YouBank">
                  <div :class="{ Cg_YouBankBoxPreview: cgRound.isPreview }" class="Cg_YouBankBox">
                    <button
                      v-if="!cgRound.isPreview"
                      :disabled="cgLoadingAny"
                      class="D_Button Main_AddTrackDirect Cg_YouBankManualAdd Main_AddTrackDirectLarger"
                      @click="race.carIndex = undefined; calcRaceResult(race); cgOpenAddYouCar(irace)">
                      <i class="ticon-plus_2" aria-hidden="true"/>
                    </button>
                    <template v-for="(bankCar, index) in race.cars">
                      <button
                        v-if="bankCar.points !== $t('m_notime') && bankCar.tune"
                        :disabled="cgLoadingAny"
                        :key="index"
                        :class="{
                          Cg_BankButtonLose: bankCar.points <= 0 && race.track && race.car,
                          Cg_PointsRed: bankCar.points < 0 && race.track && race.car,
                          Cg_PointsGreen: bankCar.points > 0 && race.track && race.car,
                          Cg_PointsGrey: bankCar.points === 0 && race.track && race.car,
                        }"
                        class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton"
                        @click="!cgRound.isPreview && cgBankCarClick(race, index, $event, irace, bankCar);">
                        <div class="Cg_BankPhoto">
                          <img :src="bankCar.photo" loading="lazy" class="Cg_BankPhotoImg" alt="">
                        </div>
                        <div :style="`color: ${ bankCar.color }`" class="Cg_BankClass">{{ (bankCar.car || {}).class }}{{ (bankCar.car || {}).rq }}</div>
                        <div class="Cg_BankTune">{{ bankCar.tune }}</div>
                        <div
                          class="Cg_BankResult">
                          <template v-if="showPointsCg">
                            <span class="Cg_BankPoints">{{ bankCar.points }}</span>
                          </template>
                          <template v-else>
                            <span v-if="bankCar.points === 0" class="Cg_BankPoints">
                              <i class="ticon-minus_2 Cg_BankPointsIcon" aria-hidden="true"/>
                            </span>
                            <span v-else-if="bankCar.points > 0" class="Cg_BankPoints">
                              <i class="ticon-correct_1 Cg_BankPointsIcon" aria-hidden="true"/>
                            </span>
                            <span v-else-if="bankCar.points < 0" class="Cg_BankPoints">
                              <i class="ticon-close_3 Cg_BankPointsIcon" aria-hidden="true"/>
                            </span>
                          </template>
                        </div>
                      </button>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div v-if="isRoundReadyForPreview" class="Cg_BottomModTools">
            <button
              v-if="whatTier && whatTier <= 3"
              :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
              class="D_Button D_ButtonDark D_ButtonTier3"
              @click="cgPreviewSolutions()"><i class="ticon-crown D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_previewSolutions") }}</button>
            <div v-else class="Main_SaveGalleryGuide" style="margin-bottom: 15px;">{{ $t("p_patronsPreviewCg") }}</div>
          </div>

          <!-- <div class="Main_">showAnalyse {{showAnalyse}}</div>
          <div class="Main_">isRoundReadyForPreview {{isRoundReadyForPreview}}</div>
          <div class="Main_">cgRound.isPreview {{cgRound.isPreview}}</div>
          <div class="Main_">isRoundComplete {{isRoundComplete}}</div>
          <div class="Main_">isRoundEmptyForUser {{isRoundEmptyForUser}}</div>
          <div class="Main_">isRoundEmptyForModders {{isRoundEmptyForModders}}</div>
          <div class="Main_">cgNewSubmitByMod {{cgNewSubmitByMod}}</div>
          <div class="Main_">cgRound.reservedTo {{cgRound.reservedTo}}</div>
          <div class="Main_">cgNeedSave {{cgNeedSave}}</div>
          <div class="Main_">isRoundReadyForSaveUser {{isRoundReadyForSaveUser}}</div> -->
          
          <div v-if="cgRound.date && !isRoundEmptyForUser && !isRoundEmptyForModders && !cgNewSubmitByMod && !cgRound.reservedTo" class="Cg_BottomModTools">
            <button
              v-if="cgShowResetSavedHand"
              :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="cgResetSaveHand()">{{ $t("m_resetSavedHand") }}</button>
            <button
              v-if="isRoundComplete"
              :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventExportTracksToWorkspace('cg')">{{ $t("m_useTrackList") }}</button>
            <button
              :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="cgExportSolutionsToPacks()">{{ $t("m_solutionsInPacks") }}</button>
          </div>
          <div v-if="forceShowAnalyse" class="Cg_BottomModTools">
            <button
              :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
              @click="cgResetSolutions()">{{ $t("m_resetSolutions") }}</button>
            <button
              :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
              @click="cgResetRound()">{{ $t("m_resetRound") }}</button>
          </div>

        </template>
        



      </div>

      <div v-else-if="cgList.length > 0" class="Cg_Mid">
        <!-- CG LIST ROOT -->
        <div class="Cg_ListSelect">
          <div class="Cg_ListSelectBox">
            <div style="margin-left: 15px; margin-bottom: 15px;" class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_challenges") }}</div>
            <template v-for="item in cgList">
              <BaseEventName
                v-if="(cgPermanentToggle && item.index > 90) || (cgLongToggle && item.index > 40 && item.index < 90) || item.index < 30"
                :item="item"
                :maxLength="42"
                style="min-height: 38px;"
                @click="loadChallengeFull(item.date, undefined, $event)"
                @longTouch="loadChallengeFull(item.date, undefined, { shiftKey: true, ctrlKey: true })" />
            </template>
            <div class="Main_CgListDividerLayout">
              <!-- <BaseSwitch v-model="cgLongToggle" :label="$t('m_longTerm')" :horizontal="true" /> -->
              <BaseSwitch v-model="cgPermanentToggle" name="cgPermanentToggle" :label="$t('m_permanents')" :horizontal="true" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="Cg_Mid">
        <!-- CG no CgRound.date && no list -->
        <div class="Cg_Offline">
          <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
        </div>
      </div>

    </div>
    <div
      v-else-if="mode === 'events'"
      class="Cg_Layout"
      @click.stop="outsideClick()">
      <div class="Cg_Header">
        <div class="Cg_HeaderLeft">
          <BaseCorner
            :gameVersion="gameVersion"
            @menu="openMainDialog();"
            @longCamera="showPoints = !showPoints;"
            @camera="shareDialog = true; generateUrl();">
          </BaseCorner>
          <div class="Cg_RowCornerBox">
            <!-- top event -->
            <div v-if="eventCurrentId" class="Cg_SelectorLayout">
              <div class="Cg_SelectorCenter">
                <div class="Cg_SelectorEvent">
                  <button
                    :disabled="eventLoading || eventNeedSave"
                    class="D_Button Main_ArrowDownSelect"
                    @click="eventSelectorDialog = true;">
                    <span>{{ event.name }}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                </div>
                <div v-if="event && event.user">
                  <span class="Main_SearchResultUserBy Cg_Creator">{{ $t("m_by") }}&nbsp;</span>
                  <span
                    :class="`Main_UserT${highlightsUsers[event.user]}`"
                    class="Main_SearchResultUser Cg_Creator">{{ event.user }}</span>
                  <span class="Cg_ViewsCount Main_ViewsBox">
                    <span class="Main_ViewsCount">{{ (statistics[`events_${eventCurrentId}`] || {}).c || 0 }} views</span>
                  </span>
                </div>
                <div class="Cg_CenterBottom">
                  <div class="Cg_RqText">
                    <span class="Cg_RqRq"><i class="tdicon-rq" aria-hidden="true"/></span>
                    <span>{{ event.rqLimit }}</span>
                    <BaseButtonTouch
                      v-if="user && user.mod && event.canViewEvent"
                      :disabled="eventLoading"
                      class="D_Button Main_AddTrackDirect"
                      @click="eventOpenRqEdit($event)"
                      @longTouch="eventOpenRqEdit({ shiftKey: true, ctrlKey: true })">
                      <i class="ticon-pencil" aria-hidden="true"/>
                    </BaseButtonTouch>
                  </div>
                  <!-- save button -->
                  <div class="Cg_SaveButtonBox">
                    <template v-if="!user">
                      <div class="Main_SaveAllBox">
                        <button
                          class="D_Button Main_LoginToEdit"
                          @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
                      </div>
                    </template>
                    <template v-else-if="eventNeedSave && user && user.mod && event.canViewEvent">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: eventLoadingAny }"
                          class="D_Button Main_SaveAllButton"
                          @click="eventSaveAll()">{{ $t("m_save") }}</button>
                      </div>
                    </template>
                    <template v-else-if="eventCurrentId === '_preview_'">
                      <button
                        :class="{ D_Button_Loading: eventLoadingAny }"
                        style="--back-color: 200,0,0;"
                        class="D_Button Main_SaveAllButton"
                        @click="saveNewEvent(event)">{{ $t("m_createNewEvent") }}</button>
                    </template>
                    <template v-else-if="event.compilation && event.compilation.length > 0">
                      <BaseSwitch v-model="showPoints" :label="$t('m_points')" />
                    </template>
                    <div v-if="user" class="Main_PrintBy">
                      <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
                      <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
                    </div>
                  </div>

                </div>
                <div style="display: flex; justify-content: center;">
                  <button
                    v-if="user && user.mod && !eventNeedSave && event.tracksetBkp && JSON.stringify(event.tracksetBkp) !== JSON.stringify(event.trackset) && event.canViewEvent"
                    :class="{ D_Button_Loading: eventLoadingAny }"
                    class="D_Button D_ButtonDark D_ButtonDark2"
                    style="white-space: pre; font-size: 0.8em; min-height: 27px;"
                    @click="eventConfirmSaveTrackset()">Save trackset as default</button>
                </div>
              </div>
            </div>
          </div>

          <BaseFilterDescription
            :filter="event.filter"
            :filter2="event.filter2"
            :filter3="event.filter3"
            :loading="eventLoadingAny"
            :user="event.canViewEvent ? user : {}"
            :ready="eventCurrentId"
            :useWhatFilter="eventUseWhatFilter"
            class="Cg_Right"
            @changeClick="openEventRequirementsDialog()"
            @useFilter="eventUseWhatFilter = $event; eventRefreshKingFilter();"
            @newNameFilter="eventRenameFilter($event)" />

          <div class="Cg_RqCount">
            <div
              :style="`width: ${ (event.rqFill * 100) / event.rqLimit }%; background-color: ${ event.rqFill > event.rqLimit ? '#a90000' : '' }`"
              class="Cg_RqFill" />
          </div>

        </div>
      </div>
      <div class="Cg_Mid"> <!-- EVENT -->
        <template v-if="eventCurrentId">
          <!-- <div>{{ event.filter }}</div>
          <div>{{ event.filter2 }}</div>
          <div>{{ eventFilterToSave }}</div>
          <div>{{ eventFilterToSave2 }}</div> -->

          <template v-if="event.noAccess">
            <div v-for="m in 4" class="Cg_Box">
              <div v-for="n in 5" class="Event_CompItem Event_CompItemPlaceholder">
                <div v-if="m === 1" class="Event_CompPlaceholderQuestion">?</div>
              </div>
            </div>
          </template>

          <div v-else class="Cg_Box">
            <div v-for="(comp, igroup) in event.comp" class="Event_CompItem">
              <BaseCompItem
                :isMod="user && user.mod"
                :comp="comp"
                @edit="eventEditComp(igroup)" />
            </div>
          </div>
          
          <!-- <div class="Event_SubTitle Main_DialogTitle">Trackset</div> -->
          <BaseEventTrackbox
            :event="event"
            :eventLoadingAny="eventLoadingAny"
            :user="user"
            :check="eventCheckFilterCode"
            :eventForceAnalyze="eventForceAnalyze"
            :eventBestPerTrack="eventBestPerTrack"
            :showBestPerTrack="showPoints"
            :compact="(compact && mode === 'compare') || ((mode === 'challenges' || mode === 'events') && windowWidth < 1200)"
            @newindex="eventTrackNewIndex($event)"
            @openDialogTrackSearch="eventTracksetSelected = $event.itrackset; eventRaceSelected = $event.itrackMonoArray; openDialogTrackSearch(false)"
            @eventMoveTrackRight="eventMoveTrackRight($event.itrackset, $event.itrackMonoArray);"
            @openKingFilter="eventOpenKingFilter($event.itrackset, $event.itrackMonoArray, $event.e);"
            @up="eventMove('up', $event.itrackset);"
            @down="eventMove('down', $event.itrackset);"
            @delete="eventDeleteTrackset($event.itrackset);"
          />
          <div v-if="event.canViewEvent && !eventBlockAddTrackset && (event.resolvedTrackset || []).length < 6 && user && user.mod" class="Event_NewTracksetBox">
            <button class="D_Button D_Button D_ButtonDark D_ButtonDark2" @click="eventAddTrackset()">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_trackset") }}</span>
            </button>
          </div>

          <!-- <div class="Event_SubTitle Main_DialogTitle">Trackset</div> -->
          <div class="Cg_Box" style="margin-top: 15px;">
            <div v-for="(group, igroup) in event.compilation" class="Cg_YouBank Event_CompilationBox">
              <div class="Cg_YouBankBox" :class="{ Event_HasPickList: eventPicksList.length > 0 && eventEnablePicks }">
                <template v-for="(car, icar) in group">
                  <BaseButtonTouch
                    :disabled="eventLoadingAny"
                    :class="{
                      Event_BankReference: eventPointsReference[igroup].icar === icar,
                      Event_BankSemiReference: eventPointsReference[igroup].icar === undefined && icar === 0,
                      Event_BankPick: eventPicksList.find(x => x.rid === car.rid && x.tune === car.tune) || Object.keys(eventPointsReference).find(key => eventPointsReference[key].rid === car.rid && eventPointsReference[key].tune === car.tune),
                      Event_PredictTime: car.isTimePredicted
                    }"
                    :style="`--cor: ${ car.color }`"
                    :key="`${car.rid}${car.tune}${icar}`"
                    class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton Event_BankButton"
                    style="will-change: opacity, transform;"
                    @longTouch="eventTogglePick(car, $event)"
                    @shortTouch="eventOpenShowCarDialog(car, $event, igroup, icar)"
                    @contextmenu="isMobile ? $event.preventDefault() : eventTogglePick(car, $event)"
                    @click="isMobile ? $event.preventDefault() : eventOpenShowCarDialog(car, $event, igroup, icar);">
                    <div class="Cg_BankPhoto Event_BankPhoto">
                      <img :src="car.photo" loading="lazy" class="Cg_BankPhotoImg" alt="">
                    </div>
                    <div :style="`color: ${ car.color }`" class="Event_BankClass">{{ (car.car || {}).class }}{{ (car.car || {}).rq }}</div>
                    <!-- <div class="Main_SearchItemRight Cg_BankCarName Event_BankCarName">{{ car.car.name }}</div> -->
                    <div class="Cg_BankTune">{{ car.tune }}</div>
                    <!-- <div class="Cg_BankResult">
                      <span class="Cg_BankPoints">{{ car.saverScore1 }}-{{ car.saverScore2 }}</span>
                    </div> -->
                    <template v-if="car[eventScoreType] === undefined">
                      <div v-if="!showPoints || (icar === 0 && eventPointsReference[igroup].icar === undefined) || eventPointsReference[igroup].icar === icar" class="Cg_BankResult Event_BankTime Event_BankTimeToPrint">
                        <span class="">{{ car.timeToPrint }}</span>
                      </div>
                      <div
                        v-else-if="car.points !== undefined && car.points !== null"
                        :class="{ 
                          Cg_PointsRed: car.points.v < 0,
                          Cg_PointsGreen: car.points.v > 0,
                          Cg_PointsGrey: car.points.v === 0
                        }"
                        class="Cg_BankResult Event_BankTime">
                        <span class="Cg_BankPoints">{{ car.points.v }}</span>
                      </div>
                    </template>
                    <div v-else class="Cg_BankResult Event_BankTime Cg_PointsGreen">
                      <span class="Cg_BankPoints">{{ car.track && car.track.includes('testBowl') ? car.time : car[eventScoreType] }}</span>
                    </div>
                    
                  </BaseButtonTouch>
                </template>
                <!-- <button
                  v-if="user && user.mod"
                  :disabled="eventLoadingAny"
                  class="D_Button Main_AddTrackDirect"
                  @click="eventAddCar(igroup);">
                  <i class="ticon-plus_2" aria-hidden="true"/>
                </button> -->
              </div>
            </div>
          </div>

          <div
            v-if="event.compilation && event.compilation.length && (!whatTier || whatTier > 3)"
            style="margin: 20px auto; max-width: 500px;"
            class="Event_CompilationIncomplete Main_SaveGalleryGuide">
            <span>{{ $t("p_patronsOnly", { tier: 3 }) }}<br>{{ $t("p_eventsKingDescription") }} <a class='D_Link D_LinkUnder' target='_blank' href='https://youtu.be/voeIpyglb0w'>Youtube</a></span>
          </div>

          <div
            v-if="event.hidden"
            style="margin: 20px auto; max-width: 500px;"
            class="Event_CompilationIncomplete Main_SaveGalleryGuide">
            <span>{{ $t("p_eventHiddenForPatreons") }}</span>
          </div>

          <div
            v-if="!user && !event.hidden"
            style="margin: 20px auto; max-width: 500px;"
            class="Event_CompilationIncomplete Main_SaveGalleryGuide">
            <span>{{ $t("p_eventsKingLogin") }}</span>
          </div>

          <!-- <div v-if="eventPicksList.length > 0" class="Event_PicksManage">
            <div v-for="pick in eventPicksList" class="Main_EventPick Cg_BankButton Event_BankButton">
              <div class="Cg_BankPhoto Event_BankPhoto">
                <img :src="pick.photo" class="Cg_BankPhotoImg" alt="">
              </div>
              <div :style="`color: ${ pick.color }`" class="Event_BankClass">{{ (pick.car || {}).class }}{{ (pick.car || {}).rq }}</div>
              <div class="Cg_BankTune" :style="`--cor: ${ pick.color }`">{{ pick.tune }}</div>
              <button class="D_Button D_ButtonDark D_ButtonDark2 Event_PickRemoveButton" @click="eventRemovePick(pick)">
                <i class="ticon-close_3 Cg_BankPointsIcon" aria-hidden="true"/>
              </button>
            </div>
          </div> -->

          <!-- <div v-if="eventPicksList.length > 0" class="Cg_BottomModTools" style="margin-top: 30px;">
            <BaseCheckBox v-model="eventEnablePicks" :label="$t('m_enablePicks')"/>
          </div> -->

          <!-- <div v-if="user && user.username === 'TiagoXavi' && eventForceAnalyze" class="Cg_BottomModTools" style="margin-top: 30px;">
            <template v-for="(type, ix) in eventScoreList">
              <BaseChip
                v-model="eventScoreType"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                required="true"
                :value="type"
                @click="eventAnalyse(false)" />
            </template>
          </div> -->

          <BasePrizeBoard v-if="$store.state.showPrizeBoard && event.canViewEvent" :id="eventCurrentId" @hasLocal="eventHasPrizeBoard = $event;" />

          <div v-if="!eventNeedSave && event.canViewEvent && eventCurrentId !== '_preview_'" class="Cg_BottomModTools" style="margin-top: 30px;">
            <button
              :class="{ D_Button_Loading: eventLoadingAny }"
              :disabled="!event.filteringQueryStrings"
              class="D_Button D_ButtonDark D_ButtonTier2"
              @click="openHandRankingDialog()"><i class="ticon-crown D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_handRanking") }}</button>
            <button
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventExportTracksToWorkspace()">{{ $t("m_useTrackList") }}</button>
            <button
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventExportCriteriaToPacks()">{{ $t("m_eventPack") }}</button>
            <button
              v-if="event.tracksetBkp && JSON.stringify(event.tracksetBkp) !== JSON.stringify(event.trackset)"
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventResetTracksetLocal()">{{ $t("m_resetTrackset") }}</button>
            <button
              v-if="user && user.mod && !eventBlockAddTrackset"
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventExportEventToTimeline()">{{ $t("m_exportToTimeline") }}</button>
            <button
              v-if="user && user.mod && !eventBlockAddTrackset && Vue.preUrl && !Vue.preUrl.includes('topdrives') && user.username === 'TiagoXavi'"
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="refreshLocalTimesByFilter()">Refresh local times</button>
            <button
              v-if="eventPicksList.length > 0"
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventClearPicks()">{{ $t("m_clearPicks") }}</button>
            <button
              v-if="eventHasPrizeBoard"
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventClearBoard()">{{ $t("m_clearBoard") }}</button>
            <button
              v-if="user && user.mod && eventCurrentIsHidden"
              :class="{ D_Button_Loading: eventLoadingAny }"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
              @click="eventSetVisible()">Set visible</button>
            <BaseSwitch v-if="eventPicksList.length > 0" v-model="eventEnablePicks" :label="$t('m_enablePicks')" :horizontal="true" />
            <!-- <BaseCheckBox v-if="eventPicksList.length > 0" v-model="eventEnablePicks" :label="$t('m_enablePicks')"/> -->
          </div>

          <div v-if="user && user.mod && event.canViewEvent && !eventBlockAddTrackset" class="Cg_BottomModTools" style="margin-top: 30px;">
            <template v-for="(icon, ix) in clubsIconsList">
              <BaseChip
                v-model="event.icons"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                :value="icon">
                <i
                  :class="`tdicon-${icon}`"
                  class="TdIconCond"
                  aria-hidden="true">
                  <span class="path1"/>
                  <span class="path2"/>
                  <span class="path3"/>
                  <span class="path4"/>
                </i>
              </BaseChip>
            </template>
          </div>

          <div v-if="user && user.mod && eventCurrentId === '_preview_'" class="Cg_BottomModTools D_Center2" style="margin-top: 30px;">
            <BaseText
              v-model="event.name"
              :instantModel="true"
              class="BaseText_Big"
              type="normal"
              :label="$t('m_eventName')" />
          </div>

        </template>
        <div v-else-if="eventLoading" class="Cg_MidLoading">
          <BaseContentLoader
            :contents="true"
            :itemWidth="windowWidth < 1200 ? '111px' : '216px'"
            :itemHeight="144"
            style="padding: 10px 10px 10px 20px; width: 100%;"
            type="block"
            count="5" />
        </div>
        <div v-else-if="eventList.length > 0" class="Cg_ListSelect">
          <div class="Cg_ListSelectBox">
            <div style="margin-left: 15px; margin-bottom: 15px;" class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_events") }}</div>
            <template v-for="item in eventList">
              <BaseEventName
                :item="item"
                contentClass="BaseEventName_Events"
                @click="loadEventFull(item.date, $event)"
                @longTouch="loadEventFull(item.date, { shiftKey: true, ctrlKey: true })" />
            </template>
          </div>
        </div>
        <div v-else class="Cg_Offline">
          <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
        </div>
      </div>
    </div>
    
    <div
      v-else-if="mode === 'clubs'"
      class="Cg_Layout"
      @click.stop="outsideClick()">
      <div class="Cg_Header">
        <div class="Cg_HeaderLeft">
          <BaseCorner
            :gameVersion="gameVersion"
            @menu="openMainDialog();"
            @longCamera="showPoints = !showPoints;"
            @camera="shareDialog = true; generateUrl();">
          </BaseCorner>
          <div class="Cg_RowCornerBox">
            <!-- top club -->
            <div class="Cg_SelectorLayout">
              <div class="Cg_SelectorCenter">
                <div class="Clubs_DayBox">
                  <button
                    :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave || clubDayNeedSave"
                    class="D_Button Main_ArrowDownSelect"
                    @click="clubDayConfigDialog = true;">
                    <span>{{ clubDaySelected || "-" }}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                  <button
                    v-if="clubDayNeedSave && user && user.mod"
                    :class="{ D_Button_Loading: clubLoadingAny }"
                    class="D_Button Main_SaveAllButton"
                    @click="clubDaySaveAll()">{{ $t("m_saveDay") }}</button>
                </div>
                <div v-if="!clubLoading && clubDaySelected !== clubServerDateISO" class="Clubs_DayNotCurrent">({{ $t('m_notCurrent') }})</div>
                <div v-if="user && user.mod" class="Clubs_TrackReqSelectBox">
                  <button
                    :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave"
                    class="D_Button Main_ArrowDownSelect"
                    @click="clubTracksetDialog = true;">
                    <span>{{ $t("m_tracksets") }} {{`(${clubTracksGroupsActive.length})`}}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                  <button
                    :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave"
                    class="D_Button Main_ArrowDownSelect"
                    @click="clubReqsDialog = true;">
                    <span>{{ $t("m_reqs") }} {{`(${clubReqGroupsActive.length})`}}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                </div>
                <div v-if="clubDaySelectedObj && clubDaySelectedObj.user">
                  <span class="Main_SearchResultUserBy Cg_Creator">{{ $t("m_by") }}&nbsp;</span>
                  <span
                    :class="`Main_UserT${highlightsUsers[clubDaySelectedObj.user]}`"
                    class="Main_SearchResultUser Cg_Creator">{{ clubDaySelectedObj.user }}</span>
                  <span class="Cg_ViewsCount Main_ViewsBox">
                    <span class="Main_ViewsCount">{{ (statistics[`clubs_${clubDaySelected}`] || {}).c || 0 }} views</span>
                  </span>
                </div>
                <div class="Cg_CenterBottom" style="min-height: unset;">
                  <!-- save button -->
                  <div class="Cg_SaveButtonBox">
                    <template v-if="!user">
                      <div class="Main_SaveAllBox">
                        <button
                          class="D_Button Main_LoginToEdit"
                          @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
                      </div>
                    </template>
                    <template v-else-if="clubTrackNeedSave && user && user.mod">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: clubLoadingAny }"
                          class="D_Button Main_SaveAllButton"
                          @click="clubSaveTrackset()">{{ $t("m_saveTrackset") }}</button>
                      </div>
                    </template>
                    <template v-else-if="clubReqNeedSave && user && user.mod">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: clubLoadingAny }"
                          class="D_Button Main_SaveAllButton"
                          @click="clubSaveReq()">{{ $t("m_saveReqs") }}</button>
                      </div>
                    </template>
                    <template v-else-if="isMobile && clubCompilation && clubCompilation.length > 0">
                      <BaseSwitch v-model="showPoints" :label="$t('m_points')" />
                    </template>
                    <template v-if="clubShowAnalyse">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: clubLoadingAny }"
                          class="D_Button Main_SaveAllButton"
                          @click="clubAnalyse()">{{ $t("m_analyze") }}</button>
                      </div>
                    </template>
                    <div v-if="user" class="Main_PrintBy" style="margin-top: 5px;">
                      <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
                      <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <BaseFilterDescription
            :filter="clubReqsGroupModel.filter"
            :filter2="clubReqsGroupModel.filter2"
            :filter3="clubReqsGroupModel.filter3"
            :loading="clubLoadingAny"
            :user="user"
            :ready="clubReqsGroupModel.date"
            :useWhatFilter="clubUseWhatFilter"
            class="Cg_Right"
            @changeClick="clubShowRequirementsDialog($event)"
            @useFilter="clubUseWhatFilter = $event; eventRefreshKingFilter();"
            @newNameFilter="clubRenameFilter($event)" />

          <!-- <div class="Cg_RqCount">
            <div
              :style="`width: ${ (club.rqFill * 100) / club.rqLimit }%; background-color: ${ club.rqFill > club.rqLimit ? '#a90000' : '' }`"
              class="Cg_RqFill" />
          </div> -->

        </div>
      </div>
      <div class="Clubs_Mid"> <!-- CLUBS -->
        <div class="Clubs_SemiBox">
          <div class="Clubs_Box">
            <div class="Clubs_SelectorBox">
              <template v-for="(trackset, ix) in clubTracksGroupsActive">
                <BaseChip
                  v-model="clubTracksGroupModel"
                  :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                  required="true"
                  :value="trackset"
                  :label="trackset.name"
                  @click="clubsChangeTrackGroup(ix)" />
              </template>
            </div>
            <div class="Clubs_SelectorBox">
              <template v-for="(req, ix) in clubReqGroupsActive">
                <BaseChip
                  v-model="clubReqsGroupModel"
                  :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                  required="true"
                  :value="req"
                  :label="req.name"
                  @click="clubsChangeReqsGroup(ix)" />
              </template>
            </div>
          </div>
        </div>
        <template v-if="clubTracksGroupModel.comp">
          <template>

            <div class="Cg_Box">
              <div v-for="(comp, igroup) in clubTracksGroupModel.comp" class="Event_CompItem">
                <BaseCompItem
                  :isMod="user && user.mod"
                  :comp="comp"
                  @edit="eventEditComp(igroup)" />
              </div>
            </div>
            
            <!-- <div class="Event_SubTitle Main_DialogTitle">Trackset</div> -->
            <BaseEventTrackbox
              :event="clubTracksGroupModel"
              :eventLoadingAny="clubLoadingAny"
              :user="user"
              :check="eventCheckFilterCode"
              :eventForceAnalyze="clubForceAnalyze"
              :readonly="clubIsShowingOriginal"
              :useWhatFilter="clubUseWhatFilter"
              :eventBestPerTrack="clubBestPerTrack"
              :showBestPerTrack="showPoints"
              :compact="(compact && mode === 'compare') || ((mode === 'challenges' || mode === 'events') && windowWidth < 1200)"
              @newindex="eventTrackNewIndex($event)"
              @openDialogTrackSearch="eventTracksetSelected = $event.itrackset; eventRaceSelected = $event.itrackMonoArray; openDialogTrackSearch(false)"
              @eventMoveTrackRight="eventMoveTrackRight($event.itrackset, $event.itrackMonoArray);"
              @openKingFilter="eventOpenKingFilter($event.itrackset, $event.itrackMonoArray, $event.e);"
              @up="eventMove('up', $event.itrackset);"
              @down="eventMove('down', $event.itrackset);"
              @delete="eventDeleteTrackset($event.itrackset);"
            />
            <div v-if="!clubBlockAddTrackset && clubTracksGroupModel.resolvedTrackset.length < 4 && user && user.mod" class="Event_NewTracksetBox">
              <button class="D_Button D_Button D_ButtonDark D_ButtonDark2" @click="clubAddTrackset()">
                <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t("m_trackset") }}</span>
              </button>
            </div>

            <!-- <div class="Event_SubTitle Main_DialogTitle">Trackset</div> -->
            <div class="Cg_Box" style="margin-top: 15px;">
              <div v-for="(group, igroup) in clubCompilation" class="Cg_YouBank Event_CompilationBox">
                <div class="Cg_YouBankBox" :class="{ Event_HasPickList: clubPicksList.length > 0 && clubEnablePicks }">
                  <template v-for="(car, icar) in group">
                    <BaseButtonTouch
                      :disabled="clubLoadingAny"
                      :class="{
                        Event_BankReference: clubPointsReference[igroup].icar === icar,
                        Event_BankSemiReference: clubPointsReference[igroup].icar === undefined && icar === 0,
                        Event_BankPick: clubPicksList.find(x => x.rid === car.rid && x.tune === car.tune) || Object.keys(clubPointsReference).find(key => clubPointsReference[key].rid === car.rid && clubPointsReference[key].tune === car.tune),
                        Event_PredictTime: car.isTimePredicted
                      }"
                      :style="`--cor: ${ car.color }`"
                      :key="`${car.rid}${car.tune}`"
                      class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton Event_BankButton"
                      style="will-change: opacity, transform;"
                      @longTouch="clubTogglePick(car, $event)"
                      @shortTouch="eventOpenShowCarDialog(car, $event, igroup, icar)"
                      @contextmenu="isMobile ? $event.preventDefault() : clubTogglePick(car, $event)"
                      @click="isMobile ? $event.preventDefault() : eventOpenShowCarDialog(car, $event, igroup, icar);">
                      <div class="Cg_BankPhoto Event_BankPhoto">
                        <img :src="car.photo" loading="lazy" class="Cg_BankPhotoImg" alt="">
                      </div>
                      <div :style="`color: ${ car.color }`" class="Event_BankClass">{{ (car.car || {}).class }}{{ (car.car || {}).rq }}</div>
                      <!-- <div class="Main_SearchItemRight Cg_BankCarName Event_BankCarName">{{ car.car.name }}</div> -->
                      <div class="Cg_BankTune">{{ car.tune }}</div>
                      <!-- <div class="Cg_BankResult">
                        <span class="Cg_BankPoints">{{ car.saverScore1 }}-{{ car.saverScore2 }}</span>
                      </div> -->
                      <template v-if="car[clubScoreType] === undefined">
                        <div v-if="!showPoints || (icar === 0 && clubPointsReference[igroup].icar === undefined) || clubPointsReference[igroup].icar === icar" class="Cg_BankResult Event_BankTime Event_BankTimeToPrint">
                          <span class="">{{ car.timeToPrint }}</span>
                        </div>
                        <div
                          v-else-if="car.points !== undefined && car.points !== null"
                          :class="{ 
                            Cg_PointsRed: car.points.v < 0,
                            Cg_PointsGreen: car.points.v > 0,
                            Cg_PointsGrey: car.points.v === 0
                          }"
                          class="Cg_BankResult Event_BankTime">
                          <span class="Cg_BankPoints">{{ car.points.v }}</span>
                        </div>
                      </template>
                      <div v-else class="Cg_BankResult Event_BankTime Cg_PointsGreen">
                        <span class="Cg_BankPoints">{{ car.track && car.track.includes('testBowl') ? car.time : car[clubScoreType] }}</span>
                      </div>
                      
                    </BaseButtonTouch>
                  </template>
                  <!-- <button
                    v-if="user && user.mod"
                    :disabled="clubLoadingAny"
                    class="D_Button Main_AddTrackDirect"
                    @click="clubAddCar(igroup);">
                    <i class="ticon-plus_2" aria-hidden="true"/>
                  </button> -->
                </div>
              </div>
            </div>

            <div
              v-if="clubCompilation && clubCompilation.length && (!whatTier || whatTier > 3)"
              style="margin: 20px auto; max-width: 500px;"
              class="Event_CompilationIncomplete Main_SaveGalleryGuide">
              <span>{{ $t("p_patronsOnly", { tier: 3 }) }}<br>{{ $t("p_eventsKingDescription") }} <a class='D_Link D_LinkUnder' target='_blank' href='https://youtu.be/voeIpyglb0w'>Youtube</a></span>
            </div>

            <div
              v-if="!user"
              style="margin: 20px auto; max-width: 500px;"
              class="Event_CompilationIncomplete Main_SaveGalleryGuide">
              <span>{{ $t("p_eventsKingLogin") }}</span>
            </div>

            <!-- <div v-if="eventPicksList.length > 0" class="Event_PicksManage">
              <div v-for="pick in eventPicksList" class="Main_EventPick Cg_BankButton Event_BankButton">
                <div class="Cg_BankPhoto Event_BankPhoto">
                  <img :src="pick.photo" class="Cg_BankPhotoImg" alt="">
                </div>
                <div :style="`color: ${ pick.color }`" class="Event_BankClass">{{ (pick.car || {}).class }}{{ (pick.car || {}).rq }}</div>
                <div class="Cg_BankTune" :style="`--cor: ${ pick.color }`">{{ pick.tune }}</div>
                <button class="D_Button D_ButtonDark D_ButtonDark2 Event_PickRemoveButton" @click="eventRemovePick(pick)">
                  <i class="ticon-close_3 Cg_BankPointsIcon" aria-hidden="true"/>
                </button>
              </div>
            </div> -->

            <div v-if="!clubDayNeedSave && !clubReqNeedSave && !clubTrackNeedSave" class="Cg_BottomModTools" style="margin-top: 30px;">
              <button
                :class="{ D_Button_Loading: clubLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonTier2"
                @click="openHandRankingDialog()"><i class="ticon-crown D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_handRanking") }}</button>
              <button
                :class="{ D_Button_Loading: clubLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="clubExportTracksToWorkspace()">{{ $t("m_useTrackList") }}</button>
              <button
                v-if="clubPicksList.length > 0"
                :class="{ D_Button_Loading: clubLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="clubClearPicks()">{{ $t("m_clearPicks") }}</button>
                <BaseSwitch v-if="clubPicksList.length > 0" v-model="clubEnablePicks" :label="$t('m_enablePicks')" :horizontal="true" />
            </div>

            <div v-if="user && user.mod" class="Cg_BottomModTools" style="margin-top: 30px;">
              <BaseSwitch v-model="clubForceAnalyze" :label="$t('m_admin')" :horizontal="true" />
            </div>

            <div v-if="clubForceAnalyze && clubHasOriginalOrder && user && user.mod" class="Cg_BottomModTools" style="margin-top: 30px;">
              <BaseSwitch :value="clubIsShowingOriginal" :label="$t('m_showOriginalOrder')" :horizontal="true" @click="clubViewToggle()" />
            </div>

            <div v-if="clubForceAnalyze && user && user.mod" class="Cg_BottomModTools" style="margin-top: 30px;">
              <template v-for="(icon, ix) in clubsIconsList">
                <BaseChip
                  v-model="clubTracksGroupModel.icons"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                  :value="icon">
                  <i
                    :class="`tdicon-${icon}`"
                    class="TdIconCond"
                    aria-hidden="true">
                    <span class="path1"/>
                    <span class="path2"/>
                    <span class="path3"/>
                    <span class="path4"/>
                  </i>
                </BaseChip>
              </template>
            </div>



            <div v-if="clubForceAnalyze && user && user.username === 'TiagoXavi'" class="Cg_BottomModTools Main_AdminLayoutBox" style="margin-top: 30px;">
              <button
                v-if="clubShowSaveOriginalOrder && !clubBlockOriginalButton"
                :class="{ D_Button_Loading: clubLoadingAny }"
                class="D_Button Main_SaveAllButton"
                @click="clubSaveOriginalOrder()">{{ $t("m_saveOriginalOrder") }}</button>
              
              <div class="Main_AdminFields Main_AdminLayout Main_AdminTracksetUuidLayout">
                <div class="Main_AdminFields Main_AdminLayout">
                  <div class="BaseText_Label">Clubs json</div>
                  <textarea
                    v-model="clubJson"
                    rows="3"
                    class="Main_TextArea data-hj-allow"
                    placeholder="Clubs json" />
                  <div style="text-align: center;">
                    <button
                      :class="{ D_Button_Loading: clubLoadingAny }"
                      class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen"
                      @click="clubSubmitCompleteJson()">{{ $t("m_send") }}</button>
                  </div>
                </div>
              </div>
              
            </div>

          </template>
        </template>
        <div v-else-if="clubLoading" class="Cg_MidLoading">
          <BaseContentLoader
            :contents="true"
            :itemWidth="windowWidth < 1200 ? '111px' : '216px'"
            :itemHeight="144"
            style="padding: 10px 10px 10px 20px; width: 100%;"
            type="block"
            count="5" />
        </div>
        <div v-else class="Cg_Offline">
          <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
        </div>
      </div>
    </div>
    
    <BaseDialog
      :active="kingDialog"
      :transparent="false"
      :disableScroll="true"
      :fixed="kingFixed"
      :max-width="kingFixed ? `200px` : `360px`"
      min-width="150px"
      @close="closeKingOfDialog()">
      <div :class="{ Main_KingFixed: kingFixed }" class="Main_AdvancedDialogBox Main_KingDialogBox">
        <div class="Main_DialogTitleDual">
          <div class="Main_DialogTitle">{{ $t("m_bestOf") }}</div>
          <div v-if="whatTier && whatTier <= 4">
            <button class="D_Button Main_KingPinButton" @click="kingFixed = !kingFixed; kingFixed ? kingAnalyse() : ''">
              <i class="ticon-internal Main_KingPinIcon" aria-hidden="true"/>
            </button>
            <button v-if="kingFixed" class="D_Button Main_KingPinButton" @click="closeKingOfDialog(true)">
              <i class="ticon-close_3 Main_KingPinIcon" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div :class="{ Main_KingTrackBoxSelected: kingTrack }" class="Main_KingTrackBox">
          <div class="Cg_Track">
            <Row
              v-if="kingTrack"
              :list="[kingTrack]"
              :loggedin="!!user"
              :user="user"
              :cg="true"
              :normalSize="true"
              class="Cg_TrackBox"
              type="tracks" />
            <button
              :class="{ Cg_SelectTrackButtonEdit: kingTrack }"
              class="D_Button Car_AddButton Cg_SelectTrackButton"
              @click="openDialogTrackSearch(false, 'king');">
              <i v-if="kingTrack" class="ticon-pencil Cg_SelectTrackButtonIcon" aria-hidden="true"/>
              <span v-else>{{ $t("m_selectTrack") }}</span>
            </button>
          </div>
        </div>

        <BaseFilterDescription
          :filter="kingFilter"
          :loading="kingLoading"
          :user="user"
          :ready="true"
          :isKing="true"
          :asFilterLabel="true"
          class="Main_KingFilter"
          @changeClick="openKingFilterDialog()" />

        <div v-if="!whatTier || whatTier > 4" style="margin-top: 20px;" class="Main_SaveGalleryGuide">
          <span>{{ $t("p_patronsOnly", { tier: 4 }) }}<br>{{ $t("p_bestOfDescription") }} <a class='D_Link D_LinkUnder D_LinkButton' @click="testBestOf()">{{ $t('m_here') }}</a></span>
        </div>
        <!-- <div
          v-if="!kingFixed"
          class="Main_KingTrackBox Main_FilterChipsInside"
          style="margin-top: 4px;">
          <template v-for="(item, ix) in ['332', '323', '233', '111']">
            <BaseChip
              v-model="kingTunes"
              class="BaseChip_MinWidth BaseChip_TuneStyle"
              :value="item" />
          </template>
        </div> -->
        <BaseConfigCheckBox
          v-if="!kingFixed"
          v-model="kingShowDownvoted"
          style="margin-top: 3px;"
          class="Main_KingTrackBox"
          name="kingShowDownvoted"
          :label="$t('m_includeDownvote')" />
        <BaseConfigCheckBox
          v-if="!inverted"
          v-model="kingForceVerticalView"
          class="Main_KingTrackBox"
          name="kingForceVerticalView"
          :label="$t('m_kingForceVertical')" />
        <BaseSwitch
          v-model="eventMyGarage"
          :label="`${$t('m_myGarage')}`"
          :horizontal="true"
          style="margin: 8px auto 0 auto;"
          name="eventMyGarage"
        />
        <button
          v-if="whatTier && whatTier <= 4 && !kingFixed"
          :class="{ D_Button_Loading: kingLoading }"
          :disabled="kingLoading || !kingTrack"
          class="D_Button D_ButtonDark D_ButtonTier4 Main_KingAnalyzeButton"
          @click="kingAnalyse()"><i class="ticon-crown D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_findBest") }}</button>
      </div>
    </BaseDialog>

    

    <BaseDialog
      :active="eventBestTeamsDialog"
      :transparent="false"
      :lazy="true"
      max-width="820px"
      min-width="240px"
      @close="eventBestTeamsDialog = false;">
      <div v-if="eventBestTeamsDialog" class="Main_TeamsLayout">
        <div class="Main_TeamsHeader">
          <div class="Main_DialogTitle" style="margin-bottom: 0px;">{{ eventBestTeamsTarget.name }}</div>
          <div class="Main_TeamsEngineLabel">Engine v1.9</div>
        </div>
        <div class="Main_TeamsNeck D_Center2">
          <!-- controls -->
          <div class="Main_TeamsControlsLayout">
            <BaseSwitch v-model="eventBestTeamsConfig.myGarage" name="hand_MyGarage" :label="`${$t('m_myGarage')}`" :horizontal="true" />
            <BaseSwitch v-model="eventBestTeamsConfig.forceCarsBool" name="hand_ForceCars" :label="$t('m_forceCars')" :horizontal="true" />
            <BaseSwitch v-model="eventBestTeamsConfig.blackListBool" name="hand_black" :label="$t('m_blackList')" :horizontal="true" />
            <BaseSwitch
              :value="eventBestTeamsConfig.repeatCars || eventBestTeamsConfig.myGarage"
              :label="$t('m_duplicates')"
              :horizontal="true"
              :disabled="eventBestTeamsConfig.myGarage"
              name="hand_repeat"
              @change="eventBestTeamsConfig.repeatCars = $event"
            />
            <BaseSwitch v-model="eventBestTeamsConfig.uniqueHands" name="hand_farming" :label="$t('m_farmingHands')" :horizontal="true" />
            <BaseSwitch v-model="eventBestTeamsConfig.prizeCars" name="hand_prizes" :label="$t('m_prizeCars')" :horizontal="true" />
            <BaseSwitch
              :value="eventBestTeamsConfig.prizeCars && eventBestTeamsConfig.neverAwardedCars"
              :label="$t('m_neverAwardedCars')"
              :horizontal="true"
              :disabled="!eventBestTeamsConfig.prizeCars || true"
              name="hand_neverAwarded"
              @change="eventBestTeamsConfig.neverAwardedCars = $event"
            />
            <BaseSwitch
              :value="eventBestTeamsConfig.predictedTimes || eventBestTeamsConfig.myGarage"
              :label="$t('m_predictedTimes')"
              :horizontal="true"
              :disabled="eventBestTeamsConfig.myGarage"
              name="hand_predicted"
              @change="eventBestTeamsConfig.predictedTimes = $event"
            />
          </div>

          <BaseExpandDiv :active="eventBestTeamsConfig.blackListBool" class="Main_TeamsForceCarsExpand">

            <BaseCarList
              :list="eventBestTeamsConfig.blackList"
              :filterToImport="eventBestTeamsTarget.filter"
              class="Main_TeamsCarsList"
              size="small"
            />

          </BaseExpandDiv>

          <!-- tracks replica? -->
          <div v-if="eventBestTeamsTarget.resolvedTrackset" class="Main_TeamsTrackset" :class="{ Main_TeamsTracksetWithBottom: eventBestTeamsConfig.forceCarsBool }">
            <BaseEventTrackbox
              :event="{ resolvedTrackset: eventBestTeamsTarget.resolvedTrackset }"
              :eventLoadingAny="false"
              :user="{ mod: false }"
              :check="null"
              :eventForceAnalyze="false"
              :eventBestPerTrack="{}"
              :showBestPerTrack="false"
              :hideCheckBox="true"
              :disableCampaignTip="true"
              :mini="true"
              :miniHeight="true"
              :size="windowWidth < 1200 ? 119 : 154"
              :readonly="true"
            />
          </div>

          <BaseExpandDiv :active="eventBestTeamsConfig.forceCarsBool" class="Main_TeamsForceCarsExpand">
            
            <!-- Force cars -->
            <div class="Main_TeamsCanEnterEventMid">
              <BaseCarsTeam
                :cars="eventBestTeamsConfig.forceCars"
                :filterToImport="eventBestTeamsTarget.filter"
                :mini="windowWidth < 1200"
              />
            </div>
          </BaseExpandDiv>

          <div v-if="eventBestTeamsTarget.clubReqsGroupModel" class="Main_TeamsRQSliderBox">
            <BaseMonoSlider
              v-model="eventBestTeamsTarget.rqLimit"
              :min="60"
              :max="500"
              :step="5"
              label="RQ Limit"
              class="Main_TeamsRQSlider"
            />
          </div>
          
          <div class="Main_TeamsFooter D_Center2">
            <div v-if="!whatTier || whatTier > 2" class="Main_SaveGalleryGuide">
              <span>{{ $t("p_patronsOnly", { tier: 2 }) }}<br>{{ $t("p_bestHandDescription") }} <a class='D_Link D_LinkUnder' target='_blank' href='https://youtu.be/PU6QnGUSGJA'>Youtube</a></span>
            </div>
            <button
              :class="{ D_Button_Loading: eventBestTeamsLoading }"
              :disabled="!whatTier || whatTier > 2 || !eventBestTeamsTarget.filteringQueryStrings || eventBestTeamSameAsBefore"
              class="D_Button D_ButtonDark D_ButtonTier2"
              @click="getHandRanking($event)">
              <i class="ticon-crown D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/>
              <span>{{ $t("m_loadRanking") }}</span>
              <i class="ticon-arrow_down_3" style="margin-left: 5px;" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div v-if="eventBestTeamsBigArray.length" class="Main_Teams_Body Space_TopPlus">
          <RecycleScroller
            :items="eventBestTeamsBigArray"
            :item-size="windowWidth < 1200 ? 170 : 122"
            :buffer="800"
            key-field="3"
            listClass="Main_Teams_CardsWrapper"
            itemClass="Main_Teams_ScrollerItem"
            class="Main_DarkScroll"
            page-mode>
            <template v-slot="{ item, index, active }">
              <div class="Main_Teams_Index">
                <div class="Main_Teams_IndexValue">#{{ index+1 }}</div>
                <div class="Main_Teams_IndexRQ">RQ{{ item[1] }}</div>
                <div class="Main_Teams_IndexPts">{{ Number(item[2]).toFixed(0) }} / {{ Number(item[7]).toFixed(0) }}</div>
              </div>
              <div class="Main_Teams_ListLayout">
                <div v-for="(rid, index) in item[6]" class="Main_Teams_VerticalCardBox BaseCard_AsGalleryBox">
                  <!-- <BaseCardGallery
                    :car="Vue.all_carsObj[rid]"
                    :key="`${rid}_${index}`"
                    :options="false"
                    :showPrize="true"
                    :tuneText="item[5][index]"
                    class="Main_Teams_GalleryCard BaseCardGallery150"
                  /> -->
                  <BaseCard
                    :car="Vue.all_carsObj[rid]"
                    :fix-back="false"
                    :tuneText="item[5][index]"
                    :options="false"
                    :hideClose="true"
                    :showResetTune="false"
                    :showCompactOverlay="false"
                    :asGallery="true"
                  />
                </div>
              </div>
            </template>
          </RecycleScroller>
        </div>
        <div v-else-if="eventBestTeamsLastCache" class="Main_Teams_NoResponse">
          <div class="Cg_Offline">
            <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
          </div>
        </div>
      </div>
    </BaseDialog>

    <BaseFilterDialog
      v-model="searchFilterDialog"
      :lastestList="lastestList"
      :highlightsUsers="highlightsUsers"
      :sortEnabled="true"
      :enableCounters="true"
      ref="mainFilterDialog"
      importFilterName="CLASSIC_FILTER_IMPORT"
      refName="MAIN_FILTER_REF"
      @addCar="addCar($event)"
    />

    <BaseFilterDialog
      v-if="librarySearchDialogLoad"
      v-model="librarySearchDialog"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false
      }"
      :libraryApprove="libraryApprove"
      type="library"
      @addCar="addCar($event)"
      @mutateTemplate="mutateTemplate($event.config, $event.isDelete)"
      @templateClick="decodeTemplateString($event, true)"
    />

    <BaseMemoryDialog
      v-if="memorySearchDialogLoad"
      v-model="memorySearchDialog"
      :memory="memory"
      @addNext="memoryAddNext()"
      @rename="renameMemoryDialogOpen($event.index)"
      @delete="askDeleteMemory($event.index)"
      @replace="askReplaceMemory($event.index)"
      @templateClick="decodeTemplateString($event, true)"
      @import="importMemory($event)"
    />

    <BaseFilterDialog
      v-if="kingFilterDialogLoad"
      v-model="kingFilterDialog"
      :filterOnly="true"
      :config="{
        tunes: true
      }"
      @filterUpdate="updateKingFilter($event)"
      @clearFilterUpdate="kingClearFilter = $event"
    />

    <BaseFilterDialog
      v-if="cgRequirementsDialogLoad"
      v-model="cgRequirementsDialog"
      :filterOnly="true"
      :raceFilter="cgRound.filter"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: true,
        abs: true
      }"
      :initialFilterString="cgRoundFilterString"
      type="cg"
      @filterUpdate="cgUpdateRequirements($event)"
      @clearFilterUpdate="cgRoundFilterToSave = $event"
    />

    <BaseFilterDialog
      v-if="cgFilterDialogLoad"
      v-model="cgFilterDialog"
      :cgAddingOppoCar="cgAddingOppoCar"
      :cgAddingYouCar="cgAddingYouCar"
      :raceFilter="cgRound.filter"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      type="cg"
      @addCar="addCarCg($event)"
      @listRids="cgAnalyseRoundFinish($event);"
      @clearFilterUpdate="cgFilterForAnalyse = $event"
    />

    <BaseFilterDialog
      v-if="eventRequirementsDialogLoad"
      v-model="eventRequirementsDialog"
      :filterOnly="true"
      :requirementFilter="true"
      :raceFilter="event.filter"
      :raceFilter2="event.filter2"
      :raceFilter3="event.filter3"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      :initialFilterString="eventFilterString"
      :initialFilterString2="eventFilterString2"
      :initialFilterString3="eventFilterString3"
      :useWhatFilter="eventUseWhatFilter"
      ridsMutationName="EVENT_EXPORT_FILTER"
      type="event"
      @filterUpdate="eventUpdateRequirements($event, eventUseWhatFilter)"
      @clearFilterUpdate="eventClearFilterUpdate($event, eventUseWhatFilter)"
      @dual="eventFilterAddDual()"
      @useFilter="eventUseWhatFilter = $event"
    />

    <BaseFilterDialog
      v-if="clubRequirementsDialogLoad"
      v-model="clubRequirementsDialog"
      :filterOnly="true"
      :requirementFilter="true"
      :raceFilter="clubReqsGroupModel.filter"
      :raceFilter2="clubReqsGroupModel.filter2"
      :raceFilter3="clubReqsGroupModel.filter3"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      :initialFilterString="clubCurrentFilterString"
      :initialFilterString2="clubCurrentFilterString2"
      :initialFilterString3="clubCurrentFilterString3"
      :useWhatFilter="clubUseWhatFilter"
      ridsMutationName="CLUBS_EXPORT_FILTER"
      type="event"
      @filterUpdate="eventUpdateRequirements($event, clubUseWhatFilter)"
      @clearFilterUpdate="eventClearFilterUpdate($event, clubUseWhatFilter)"
      @dual="eventFilterAddDual()"
      @useFilter="clubUseWhatFilter = $event"
    />

    <BaseFilterDialog
      v-if="eventKingDialogLoad"
      v-model="eventKingDialog"
      :filterOnly="true"
      :raceFilter="eventFilterForKing"
      :config="eventFilterConfig"
      :cgAddingYouCar="false"
      type="event"
      @close="eventCloseKingFilter()"
      @filterUpdate="eventEventKFilter()"
      @clearFilterUpdate="eventFilterForKing = $event"
      @listRids="eventAnalyseKFilter();">
      <template v-if="whatTier && whatTier <= 3" slot="header">
        <div class="Main_FilterHeaderLeft">
          <div class="Main_FilterHeaderLeftBox">
            <BaseSwitch v-model="eventMyGarage" name="eventMyGarage" :label="`${$t('m_myGarage')}`" :horizontal="true" />
            <template v-if="eventPicksList.length > 0">
              <BaseConfigCheckBox v-model="eventShowOnlyPicks" name="eventShowOnlyPicks" :label="$t('m_eventShowOnlyPicks')" />
              <BaseConfigCheckBox v-model="eventForcePicks" name="eventForcePicks" :label="$t('m_eventForcePicks')" />
            </template>
          </div>
          <div class="Main_FilterHeaderLeftRight">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
              @click="eventFindRqSavers()">{{ $t("m_findRqSavers") }}</button>
          </div>
        </div>
      </template>
    </BaseFilterDialog>

    <!-- <BaseFilterDialog
      v-if="eventAddCarDialogLoad"
      v-model="eventAddCarDialog"
      :raceFilter="event.filter"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      type="event"
      @addCar="addCarEvent($event)"
      @listRids="cgAnalyseRoundFinish($event);"
    /> -->

    <BaseSearchTrackDialog
      :active="customTrackDialog"
      :mode="mode"
      @close="closeDialogTrackSearch()"
      @toggleTrack="toggleTrack($event.track, $event.e)"
      @pushCpSuggest="pushCpSuggest($event)"
    />

    <BaseDialog
      :active="tuneDialogActive"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="closeTune()">
      <div class="Main_TuneDialog">

        <div v-if="tuneDialogActive" class="Row_DialogLayout">
          <div
            v-if="mode !== 'events' && mode !== 'clubs'"
            class="Row_OrderBox">
            <div class="Row_OrderBoxLayout">
              <button
                v-if="tuneDialogCarIndex > -1"
                :disabled="tuneDialogCarIndex === 0"
                class="D_Button Row_DialogButtonTune"
                @click="newIndex({ current: tuneDialogCarIndex, new: tuneDialogCarIndex-1 }, true)">
                <i class="ticon-arrow_left_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
              </button>
              <button
                v-if="tuneDialogCarIndex > -1"
                :disabled="tuneDialogCarIndex >= carDetailsList.length - 1"
                class="D_Button Row_DialogButtonTune"
                @click="newIndex({ current: tuneDialogCarIndex, new: tuneDialogCarIndex+1 }, true)">
                <i class="ticon-arrow_right_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
              </button>
              <button
                :disabled="((needSave && !isRoundEmptyForUser) && (!tuneDialogisOppo || !user || !user.mod)) || (tuneDialogisOppo && (!user || (user && !user.mod && !isRoundEmptyForUser) || (user.mod && !isRoundModAllowedEdit)))"
                class="D_Button Row_DialogButtonTune Row_DialogButtonClose"
                @click="deleteCar(tuneDialogCarIndex)">
                <i class="ticon-trash Row_ConfigIconTrash" aria-hidden="true"/>
              </button>
            </div>
          </div>
          <div v-if="!this.tuneDialogisOppo" class="Row_DialogHeader">
            <button
              v-for="item in tuneDialogTunes"
              :class="{ Row_DialogButtonTuneActive: tuneDialogCar.selectedTune === item }"
              :title="((((tuneDialogCar.data || {})[item] || {}).info || {}).tuneCreator || {}).t"
              class="D_Button Row_DialogButtonTune Row_DialogButtonTuneRelative"
              @click="changeTuneCar(tuneDialogCar, item)">
              {{ item }}
              <div v-if="tunesCount[item]" class="D_ButtonNote">{{ tunesCount[item] }}</div>
            </button>
            <button
              v-if="whatTier && whatTier <= 2 && $store.state.showCustomTunes"
              class="D_Button Row_DialogButtonTune"
              @click="chooseCustomTune(tuneDialogCar)">
              <i class="ticon-plus_1" style="font-size: 18px;" aria-hidden="true"/>
            </button>
          </div>
          <div class="Row_DialogBody Space_TopPlus">
            <div class="Row_DialogCard">
              <div class="Row_DialogCardLeft">
                <BaseCard
                  :car="tuneDialogCar"
                  :isDialogBox="true"
                  :options="false" />
              </div>
              <div v-if="(tuneDialogCar.selectedTune && !tuneDialogCar.selectedTune.includes('Other')) && tuneDialogCar.selectedTune !== '000'" class="Row_DialogCardRight">
                <BaseText
                  :value="((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).topSpeed || {}).t"
                  :disabled="!tuneDialogCar.selectedTune ||
                             !user ||
                             ( ((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).topSpeed || {}).t ?
                             ((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).topSpeed || {}).u !== user.username ? user.mod ? false : true : false : false )"
                  type="topSpeed"
                  :label="$t('c_topSpeed')"
                  class="Space_Bottom Row_FieldStat"
                  placeholder="-"
                  @change="changeStatCar(tuneDialogCar, 'topSpeed', $event)" />
                <BaseText
                  :value="((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).acel || {}).t"
                  :disabled="!tuneDialogCar.selectedTune ||
                             !user ||
                             ( ((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).acel || {}).t ?
                             ((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).acel || {}).u !== user.username ? user.mod ? false : true : false : false )"
                  type="acel"
                  label="0-60mph"
                  class="Space_Bottom Row_FieldStat"
                  placeholder="-"
                  @change="changeStatCar(tuneDialogCar, 'acel', $event)" />
                <BaseText
                  :value="((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).hand || {}).t"
                  :disabled="!tuneDialogCar.selectedTune ||
                             !user ||
                             ( ((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).hand || {}).t ?
                             ((((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).hand || {}).u !== user.username ? user.mod ? false : true : false : false )"
                  type="hand"
                  :label="$t('c_handling')"
                  class="Row_FieldStat"
                  placeholder="-"
                  @change="changeStatCar(tuneDialogCar, 'hand', $event)" />
              </div>
              <div v-else class="Row_DialogCardRight">
                <BaseText :value="resolveStat(tuneDialogCar, 'topSpeed')" :label="$t('c_topSpeed')" class="Space_Bottom Row_FieldStat" :disabled="true" />
                <BaseText :value="resolveStat(tuneDialogCar, 'acel')" label="0-60mph" class="Space_Bottom Row_FieldStat" :disabled="true" />
                <BaseText :value="resolveStat(tuneDialogCar, 'hand')" :label="$t('c_handling')" class="Row_FieldStat" :disabled="true" />
              </div>
            </div>
            <div v-if="mode === 'compare' && statistics[`car_${tuneDialogCar.rid}`]" class="Main_ViewsBox">
              <div class="Main_ViewsCountDialog">{{ statistics[`car_${tuneDialogCar.rid}`].c }} views</div>
            </div>
          </div>
          <div v-if="tuneDialogCar.tags && tuneDialogCar.tags.length > 0" class="Row_DialogCardTags" style="margin-top: 12px;">
            <BaseGameTag
              v-for="tag in tuneDialogCar.tags"
              :key="tag"
              :tag="tag" />
          </div>
          <div class="Row_DialogCardDual Space_TopPlus">
            <div class="Row_DialogCardBottom">
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">ABS</div>
                <div :class="{ Row_DialogCardStatCorrect: tuneDialogCar.abs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ tuneDialogCar.abs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">TCS</div>
                <div :class="{ Row_DialogCardStatCorrect: tuneDialogCar.tcs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ tuneDialogCar.tcs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $tc("c_clearance", 1) }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.clearance.toLowerCase()}`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">MRA ({{ $t("c_stock").toLowerCase() }})</div>
                <div class="Row_DialogCardStatValue">
                  <template v-if="!mraEditing">
                    <span v-if="tuneDialogCar.mra" style="margin-right: 7px;">{{ tuneDialogCar.mra }}</span>
                    <button
                      v-if="user && user.mod"
                      :disabled="mraLoading"
                      :class="{ D_Button_Loading: mraLoading }"
                      class="D_Button D_ButtonDark Main_EditMraButton"
                      @click="mraEditing = true;">
                      <i class="ticon-pencil" aria-hidden="true"/>
                    </button>
                  </template>
                  <template v-else>
                    <BaseText
                      v-model="mraEditInput"
                      :acel="tuneDialogCar.acel"
                      type="mra"
                      class="Row_FieldStat Main_EditMraField"
                      placeholder="type..."
                      @change="sendMra()" />
                  </template>
                </div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_weight") }} ({{ $t("c_stock").toLowerCase() }})</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.weight }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_fuel") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.fuel.toLowerCase()}`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_seats") }}</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.seats }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_enginePos") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.engine.toLowerCase()}Engine`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_bodyStyle") }}</div>
                <div class="Row_DialogCardStatValue">
                  <template v-for="(body, index) in tuneDialogCar.bodyTypes">
                    <template v-if="index !== 0">,&nbsp;</template>
                    <template>{{ $t(`c_${body.toLowerCase()}`) }}</template>
                  </template>
                </div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_brake") }}</div>
                <div
                  :class="{ Row_DialogCardStatRed: tuneDialogCar.brake === 'C', Row_DialogCardStatCorrect: tuneDialogCar.brake === 'A' }"
                  class="Row_DialogCardStatValue">{{ tuneDialogCar.brake || "?" }}<BaseBrakeDialog /></div>
              </div>
            </div>
          </div>
          <div v-if="(tuneDialogCar.reviews && tuneDialogCar.reviews.length > 0) || (user && user.canReview)" class="Row_DialogCardUsers Space_TopPlus">
            <div class="Row_DialogCardStat">
              <div v-if="!isReviewing" class="Row_DialogCardStatLabel">{{ $tc("m_review", 2) }}</div>
              <BaseReviewList
                :car="tuneDialogCar"
                :user="user || {}"
                :highlightsUsers="highlightsUsers"
                :reviewUrl="reviewUrl"
                @isReviewing="isReviewing = $event"
                @submited="resolveCarReview($event)"
                @getUrl="reviewUrl = { url: generateUrl(true) }"
                @loadTemplate="reviewLoadTemplate($event)"/>
            </div>
          </div>
          <div v-if="tuneDialogCar.users && !isReviewing && (!tuneDialogCar.reviews || tuneDialogCar.reviews.length === 0 || showReviews)" class="Row_DialogReviewsBox Space_TopPlus">
            <div class="Row_DialogCardStat">
              <div class="Row_DialogCardStatLabel">{{ $t("m_contributors") }}</div>
              <div class="Row_DialogCardStatValue" style="font-size: 0.9em;">
                <template
                  v-for="(username, i) in tuneDialogCar.users">
                  <template v-if="i > 0">, </template>
                  <span :class="`Main_UserT${highlightsUsers[username]}`">{{ username }}</span>
                </template>
              </div>
            </div>
          </div>
          <div v-else-if="tuneDialogCar.users && !isReviewing && !showReviews" style="margin-top: 20px; margin-bottom: -10px; opacity: 0.6;">
            <button
              class="D_Button D_ButtonDarkTransparent"
              style="width: 100%;"
              @click="showReviews = true">{{ $t('m_showContributors') }} ({{ tuneDialogCar.users.length }})</button>
          </div>
        </div>

      </div>
    </BaseDialog>
    <BaseDialog
      :active="customTuneDialogActive"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="closeCustomTuneDialog()">
      <div class="Main_TuneDialog">
        <BaseText
          v-model="customTuneDialogTune"
          class="BaseText_Big"
          iid="Main_CustomTuneInput"
          type="tune"
          :label="$t('c_tune')"
          placeholder="e.g. 798 or 112" />
      </div>
    </BaseDialog>
    <BaseDialog
      :active="shareDialog"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="shareDialog = false;">
      <div class="Main_ShareDialog">
        <div class="Main_OptionsDual" style="margin-top: 0;">
          <div class="Main_">
            <div class="Main_DialogTitle">{{ $t("m_image") }}</div>
            <div class="Main_ShareDownloadBox">
              <button
                :disabled="pngLoading"
                style="font-size: 16px;"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="sharePrint()">
                <i class="ticon-download D_ButtonIcon" aria-hidden="true"/>
                <span>{{ pngLabel }}</span>
              </button>
            </div>
          </div>
          <div v-if="user && currentTracks.length > 0 && carDetailsList.length > 1 && mode === 'compare'" class="Main_">
            <div class="Main_DialogTitle">{{ $t("m_library") }}</div>
            <div class="Main_ShareDownloadBox">
              <button
                style="font-size: 16px;"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="openSaveToGalleryDialog()">
                <i class="ticon-dash D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t("m_addLibrary") }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="Main_DialogTitle">{{ $t("m_sharableLink") }}</div>
        <div class="Main_ShareLinkBox">
          <textarea
            v-model="shareUrl"
            id="shareLinkField"
            rows="6"
            class="Main_ShareLinkInput data-hj-allow"
            readonly="readonly" />
          <button
            :class="{ D_Button_Correct: copyUrlSucess }"
            :disabled="copyUrlSucess"
            style="font-size: 16px;"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="copyUrl()">{{ $t("m_copy") }}</button>
        </div>
        <template v-if="mode === 'compare'">
          <div class="Main_DialogTitle">{{ $t("m_listCars") }}</div>
          <div class="Main_ShareLinkBox">
            <textarea
              v-model="shareListCars"
              id="shareListField"
              rows="6"
              class="Main_ShareLinkInput data-hj-allow"
              readonly="readonly" />
            <button
              :class="{ D_Button_Correct: copyListSucess }"
              :disabled="copyListSucess"
              style="font-size: 16px;"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="copyList()">{{ $t("m_copy") }}</button>
          </div>
        </template>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="saveToGalleryDialog"
      :transparent="false"
      max-width="340px"
      min-width="240px"
      @close="closeSaveToGalleryDialog()">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="saveToGalleryModel.name"
            class="BaseText_Big"
            iid="Main_SaveGalleryName"
            type="normal"
            :label="$t('m_title')"
            placeholder="" />
        </div>
        <div class="Main_SaveGalleryBox">
          <div class="Main_OptionsLabel">{{ $t("m_type") }}</div>
          <div class="Main_FilterChipsFlex" style="justify-content: flex-start;">
            <template v-for="(item, ix) in saveToGalleryModel.types">
              <BaseChip
                v-model="saveToGalleryModel.type"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                required="true"
                :value="item" />
            </template>
          </div>
        </div>

        <div v-if="saveToGalleryModel.class.length < 4" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_class"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_class", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.class.join(", ") }}</div>
          </div>
        </div>

        <div class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_rq"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">RQ</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.minrq }} ~ {{ saveToGalleryModel.maxrq }}</div>
          </div>
        </div>
        <div class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_year"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_year", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.minyear }} ~ {{ saveToGalleryModel.maxyear }}</div>
          </div>
        </div>

        <div v-if="saveToGalleryModel.tyre.length < 4" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_tyre"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_tyre", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.tyre.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.drive.length < 3" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_drive"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_drive", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.drive.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.clearance.length < 3" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_clearance"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_clearance", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.clearance.join(", ") }}</div>
          </div>
        </div>

        <div v-if="saveToGalleryModel.country.length < 4" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_country"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_country", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.country.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.tag.length > 0" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_tag"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_tag", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.tag.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.brand.length < 4" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_brand"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $tc("c_brand", 2) }}</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.brand.join(", ") }}</div>
          </div>
        </div>

        <div class="Main_SaveGalleryGuide">
          <span v-if="user && !user.mod">{{ $t("p_templateWarning") }} </span>
          <span>{{ $t("m_checkOut") }} </span>
          <a
            href="/templateguide"
            class="D_Link D_LinkUnder"
            target="_blank">{{ $t("m_templateGuide") }}</a>
        </div>

        <button
          :class="{ D_Button_Loading: saveToGalleryLoading, D_Button_Error: saveToGalleryError }"
          :disabled="saveToGalleryLoading || saveToGalleryError"
          class="D_Button Main_SaveAllButton"
          @click="saveToGallery()">{{ user && user.mod ? $t("m_saveToLibrary") : $t("m_submitReview") }}</button>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="optionsDialogComputed"
      :transparent="false"
      max-width="500px"
      @close="updateOptions()">
      <div class="Main_OptionsDialog">
        <!-- <div class="Main_SectionSelectorLayout">
          <div class="Main_SectionSelectorBox">
            <button
              :class="{ D_ButtonChangeModeDisabled: mode === 'compare' }"
              :disabled="mode === 'compare' || cgLoadingAny || cgNeedSave || eventLoadingAny || eventNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('compare')">
              {{ $t("m_home") }}
            </button>
            <button
              :class="{ D_ButtonChangeModeDisabled: mode === 'challenges' }"
              :disabled="mode === 'challenges' || needSave || eventLoadingAny || eventNeedSave || clubLoadingAny || clubTrackNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('challenges')">
              {{ $t("m_challenges") }}
            </button>
            <button
              :class="{ D_ButtonChangeModeDisabled: mode === 'events' }"
              :disabled="mode === 'events' || needSave || cgLoadingAny || cgNeedSave || clubLoadingAny || clubTrackNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('events')">
              {{ $t("m_events") }}
            </button>
            <button
              :class="{ D_ButtonChangeModeDisabled: mode === 'clubs' }"
              :disabled="mode === 'clubs' || needSave || cgLoadingAny || cgNeedSave || eventLoadingAny || eventNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('clubs')">
              {{ $t("m_clubs") }}
            </button>
          </div>
        </div> -->
        <div v-if="!needSave && mode === 'compare'" class="Main_OptionsItem" style="margin-top: 5px;">
          <div class="Main_OptionsLabel MainClearLabelBox">
            <span>{{ $t("m_trackset") }}</span>
            <div class="Main_ClearButtonsBox">
              <button
                class="D_Button Main_OptionsButton Main_OptionsButtonClear"
                @click="clearAllTracks()">{{ $t("m_clear") }}</button>
              <button
                class="D_Button Main_OptionsButton Main_OptionsButtonClear"
                @click="clearAllCars()">{{ $t("m_clearCars") }}</button>
            </div>
          </div>
          <div class="Main_OptionsTrackset">
            <div
              v-for="(item, index) in tracksButtons"
              class="Main_CustomTrackItem" :key="index">
              <div class="Main_CustomTrackLeft">
                <div class="Main_CustomTrackName">{{ $t(`m_${item.name.toLowerCase()}`) }}</div>
              </div>
              <div class="Main_CustomTrackRight" @click="clickTracksetHandle($event, item)">
                <template>
                  <BaseTrackType
                    :circuit="item.list"
                    :isTrackSet="true" />
                </template>
              </div>
            </div>
            <button
              class="D_Button Main_OptionsButton Main_OptionsTracksetMore"
              @click="openDialogTrackSearch()">{{ $t("m_more3dot") }}</button>
          </div>
        </div>
        <div v-else-if="!!user && needSave && mode === 'compare'" class="Main_OptionsSaveData">
          <button
            :class="{ D_Button_Loading: saveLoading }"
            class="D_Button Main_SaveAllButton"
            @click="saveAll()">{{ $t("m_save") }}</button>
        </div>
        <div v-if="mode === 'compare'" class="Main_OptionsDual">
          <div class="Main_OptionsItem">
            <div class="Main_OptionsLabel">{{ $t("m_display") }}</div>
            <div class="Main_OptionsButtons">
              <button :class="{ D_ButtonActive: !inverted && !compact }" class="D_Button Main_OptionsButton" @click="display('horizontal')">
                <i class="ticon-list Main_OptionsIcon" aria-hidden="true"/>
              </button>
              <button :class="{ D_ButtonActive: !inverted && compact }" class="D_Button Main_OptionsButton" @click="display('horizontal2')">
                <i class="ticon-list Main_OptionsIcon" style="transform: scaleX(0.5);" aria-hidden="true"/>
              </button>
              <button :class="{ D_ButtonActive: inverted }" class="D_Button Main_OptionsButton" @click="display('vertical')">
                <i class="ticon-list Main_OptionsIcon" style="transform: rotate(90deg)" aria-hidden="true"/>
              </button>
            </div>
          </div>
          <div class="Main_OptionsItem">
            <div class="Main_OptionsLabel">{{ $t("m_colors") }}</div>
            <div class="Main_OptionsButtons">
              <button :class="{ D_ButtonActive: !fullColors }" class="D_Button Main_OptionsButton" @click="colorsChange('medals')">
                <div class="Main_cIconBox">
                  <div class="Main_cBall"></div>
                  <div class="Main_cBall"></div>
                  <div class="Main_cBall"></div>
                </div>
              </button>
              <button :class="{ D_ButtonActive: fullColors }" class="D_Button Main_OptionsButton" @click="colorsChange('full')">
                <div class="Main_cIconBox Main_cIconGradient" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="mode === 'compare'" class="Main_OptionsMemory">
          <div class="Main_MemoryLeft">
            <div class="Main_MemoryLine">
              <span class="Main_MemoryLabel">{{ memory.find(x => x !== null ) ? $t("m_load") : $t("m_memory") }}</span>
              <button
                v-for="(m, index) in memory"
                v-if="index < 9"
                :disabled="m === null"
                class="D_Button Main_OptionsButton"
                @click="loadMemory(index, $event)">
                <span>{{ index+1 }}</span>
              </button>
            </div>
            <div class="Main_MemoryLine">
              <span class="Main_MemoryLabel">{{ $t("m_save") }}</span>
              <button
                v-for="(m, index) in memory"
                v-if="index < 9"
                class="D_Button Main_OptionsButton Main_MemorySave"
                @click="saveMemory(index, $event)">
                <span style="pointer-events: none;">{{ index+1 }}</span>
              </button>
            </div>
          </div>
          <div class="Main_MemoryRight" style="margin-right: -15px;">
            <button
              class="D_Button Main_MemorySave"
              @click="openMemoryDialog()">
              <i class="ticon-internal" style="font-size: 22px;" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div class="Main_OptionsMain">
          <div class="D_Center Main_OptionsFooterButtons">
            <button
              v-if="mode === 'compare'"
              class="D_Button Main_OptionsButton"
              @click="openLibraryDialog()">
              <i class="ticon-dash D_ButtonIcon" style="font-size: 22px;" aria-hidden="true"/>
              <span>{{ $t("m_library") }}</span>
            </button>
            <button
              v-if="mode === 'compare'"
              class="D_Button Main_OptionsButton"
              @click="openKingOfDialog()">
              <i class="ticon-star D_ButtonIcon" style="font-size: 22px;" aria-hidden="true"/>
              <span>{{ $t("m_bestOf") }}</span>
            </button>
          </div>
        </div>
      </div>
    </BaseDialog>
    
    <BaseDialog
      :active="campaignDialog"
      :transparent="false"
      :lazy="true"
      max-width="600px"
      min-width="240px"
      @close="campaignDialog = false;">
      <div style="Main_CampaignBox">
        <div v-for="city in smartCampaign" class="Main_CampaignItem">
          <div class="Main_CampaignName">{{ `${city.name} ${city.imatch+1}` }}</div>
          <div class="Main_CampaignMatch">
            <div
              v-for="race in campaign[city.icity].matches[city.imatch].races"
              :class="{ Main_CampaignRaceOff: !city.includes.includes(race.name) }"
              class="Main_CampaignRace">
              <div class="Main_CampaignTrackName">{{ $t('t_'+(tracksRepo.find(x => x.id === race.name.substr(0, race.name.length-4)) || {}).id) }}</div>
              <div class="Main_CampaignTrackCond">
                <BaseTypeName :type="race.name.substr(race.name.length-2)" :showDry="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="confirmDelete.dialog"
      :transparent="false"
      :lazy="true"
      zindex="101"
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
    <BaseDialog
      :active="cgSeletorDialog"
      :transparent="true"
      :lazy="true"
      max-width="460px"
      min-width="240px"
      class="Cg_SelectorDialog Cg_SelectorDialogListScroll1"
      @close="cgSeletorDialog = false;">
      <div style="Cg_SelectorDialogBox">
        <div class="Cg_SelectorDialogHeader">
          <div class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_challenges") }}</div>
          <div v-if="user && user.mod" class="Cg_SelectorDialogRight">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="cgOpenNewCg()">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_new") }}</span>
            </button>
          </div>
        </div>
        <div class="Main_SearchMid Cg_SelectorDialogMid">
          <template v-for="item in cgList">
            <BaseEventName
              v-if="(cgPermanentToggle && item.index > 90) || (cgLongToggle && item.index > 40 && item.index < 90) || item.index < 30"
              :item="item"
              :maxLength="42"
              style="min-height: 38px;"
              @click="loadChallengeFull(item.date, undefined, $event)"
              @longTouch="loadChallengeFull(item.date, undefined, { shiftKey: true, ctrlKey: true })" />
          </template>
          <div class="Main_CgListDividerLayout">
            <!-- <BaseSwitch v-model="cgLongToggle" name="cgLongToggle" :label="$t('m_longTerm')" :horizontal="true" @click="afterTogglePermanents('.Cg_SelectorDialogListScroll1 .Cg_SelectorDialogMid')" /> -->
            <BaseSwitch v-model="cgPermanentToggle" name="cgPermanentToggle" :label="$t('m_permanents')" :horizontal="true" @click="afterTogglePermanents('.Cg_SelectorDialogListScroll1 .Cg_SelectorDialogMid')" />
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="cgRoundSelectorDialog"
      :transparent="true"
      :lazy="true"
      max-width="520px"
      min-width="240px"
      class="Cg_SelectorDialog"
      @close="cgRoundSelectorDialog = false;">
      <div style="Cg_SelectorDialogBox">
        <div class="Cg_SelectorDialogHeader">
          <div class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $tc("m_round", 2) }}</div>
        </div>
        <div class="Main_SearchMid Cg_SelectorDialogMid">
          <template v-for="(item, index) in cg.rounds">
            <button
              style="padding-left: 15px; padding-right: 15px;"
              class="Main_SearchItem"
              @click="loadCgRound(cg.date, index)">
              <div class="Main_SearchItemRight">{{ $tc("m_round", 1) }} {{ index+1+cgCurrentRoundSum }}</div>
              <div v-if="item.lastAnalyze" class="Main_RoundDone">
                <i class="ticon-star Main_RoundDoneIcon" aria-hidden="true"/>
              </div>
              <div v-else-if="item.toApprove && item.toApprove.length > 0" class="Main_RoundDone">
                <i class="ticon-star Main_RoundDoneIcon" style="color: unset;" aria-hidden="true"/>
              </div>
              <div v-else-if="item.preDoneMod" class="Main_RoundDone">
                <i class="ticon-star Main_RoundDoneIcon" style="color: red;" aria-hidden="true"/>
              </div>
              <span v-if="item.creator && item.lastAnalyze" class="Main_RoundDoneCreator">
                <span class="Main_SearchResultUserBy Cg_Creator">{{ $t("m_by") }}&nbsp;</span>
                <span
                  :class="`Main_UserT${highlightsUsers[item.creator]}`"
                  class="Main_SearchResultUser Cg_Creator">{{ item.creator }}</span>
              </span>
              <div v-if="item.icons" class="Main_RoundIcons">
                <i
                  v-for="icon in item.icons"
                  :class="`tdicon-${icon}`"
                  class="TdIconCond"
                  aria-hidden="true">
                  <span class="path1"/>
                  <span class="path2"/>
                  <span class="path3"/>
                  <span class="path4"/>
                </i>
              </div>
            </button>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="cgNewDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="cgNewDialog = false;">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="cgNewModel.name"
            class="BaseText_Big"
            iid="Cg_NewCgName"
            type="normal"
            :label="$t('m_challengeName')"
            placeholder="" />
        </div>
        <BaseText
          v-model="cgNewModel.numberRounds"
          type="integer"
          :label="$t('m_numberRounds')"
          style="max-width: 160px;"
          placeholder="" />
        

        <button
          :class="{ D_Button_Loading: cgNewLoading, D_Button_Error: cgNewError }"
          :disabled="cgNewLoading || cgNewError || cgNewModel.numberRounds < 1 || !cgNewModel.name"
          style="margin-top: 20px;"
          class="D_Button Main_SaveAllButton"
          @click="saveNewChallenge()">{{ $t("m_createNewCg") }}</button>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="cgRqEditDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="cgCloseRqEdit()">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="cgRqEditModel"
            class="BaseText_Big"
            iid="Cg_EditRq"
            type="integer"
            :label="$t('m_rqLimit')"
            placeholder="" />
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="cgPointsEditDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="cgClosePointsEdit()">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="cgPointsEditModel"
            class="BaseText_Big"
            iid="Cg_EditPoints"
            type="integer"
            :label="$t('m_points')"
            placeholder="" />
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="eventSelectorDialog"
      :transparent="true"
      :lazy="true"
      max-width="500px"
      min-width="240px"
      class="Cg_SelectorDialog"
      @close="eventSelectorDialog = false;">
      <div style="Cg_SelectorDialogBox">
        <div class="Cg_SelectorDialogHeader">
          <div class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_events") }}</div>
          <div v-if="user && user.mod" class="Cg_SelectorDialogRight">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="eventOpenNewEvent()">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_new") }}</span>
            </button>
          </div>
        </div>
        <div class="Main_SearchMid Cg_SelectorDialogMid">
          <template v-if="eventParsedList && eventParsedList.length > 0">
            <template v-for="item in eventParsedList">
              <BaseEventName
                :item="item"
                contentClass="BaseEventName_Events"
                @click="eventPreviewParsed(item)" />
            </template>
            <div class="Main_EventListDividir">
              <i class="ticon-line" aria-hidden="true"/>
            </div>
          </template>
          <template v-for="item in eventList">
            <BaseEventName
              :item="item"
              contentClass="BaseEventName_Events"
              @click="loadEventFull(item.date, $event)"
              @longTouch="loadEventFull(item.date, { shiftKey: true, ctrlKey: true })" />
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="eventNewDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="eventNewDialog = false;">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="eventNewName"
            class="BaseText_Big"
            iid="Cg_NewEventName"
            type="normal"
            :label="$t('m_eventName')"
            placeholder=""
            @paste="eventNamePaste($event)" />
        </div>
        <div v-if="user && user.mod && whatTier && whatTier <= 3" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox v-model="eventNewIsHidden"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">{{ $t("m_hidden") }}</div>
          </div>
        </div>
              
        <button
          :class="{ D_Button_Loading: eventNewLoading, D_Button_Error: eventNewError }"
          :disabled="eventNewLoading || eventNewError || !eventNewName"
          style="margin-top: 20px;"
          class="D_Button Main_SaveAllButton"
          @click="saveNewEvent()">{{ $t("m_createNewEvent") }}</button>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="memoryRenameDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="renameMemoryDialogClose()">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="memoryRenameNewName"
            class="BaseText_Big"
            iid="Memory_Name"
            type="normal"
            :label="$t('c_name')"
            placeholder=""
            @enter="renameMemoryDialogClose()" />
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="eventRqEditDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="eventCloseRqEdit()">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="eventRqEditModel"
            class="BaseText_Big"
            iid="Event_EditRq"
            type="integer"
            :label="$t('m_rqLimit')"
            placeholder="" />
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="announcementDialog"
      :transparent="false"
      :disableScroll="true"
      :lazy="true"
      max-width="400px"
      @close="announcementDialog = false;">
      <div class="Main_AnnouncementLayout">
        <div class="Main_AnnouncementLogo">
          <BaseLogoSpining />
        </div>
        <div class="Main_AnnouncementBox">
          <div class="Main_AnnouncementTitle">Contest #9</div>
          <div class="Main_AnnouncementSubTitle">German Powerhaus</div>
          <div class="Main_AnnouncementItem">Prizes:</div>
          <div style="display: flex;justify-content: center;text-align: left;margin: 13px 0px 23px 0px;margin-right: -2px;">
            <div>
              <div class="Main_AnnouncementItem">• Up to <BaseIconSvg type="gold" :useMargin="false" style="width: 1.3em;display: inline-flex;vertical-align: bottom;" /> 2500 in-game</div>
              <div class="Main_AnnouncementItem">• 1 month of TDR premium</div>
              <div class="Main_AnnouncementItem">• 🥇 Medal aside of your name</div>
            </div>
          </div>
          <div class="Main_AnnouncementMaybe">8th September ~ 21th September</div>

          <BaseDiscordButton link="https://discord.com/channels/1008569974094311544/1104184336158302259" style="margin-top: 20px;" />
        </div>
      </div>
    </BaseDialog>
    
    <BaseDialog
      :active="eventCompDialog"
      :transparent="false"
      :disableScroll="true"
      :lazy="true"
      max-width="440px"
      @close="eventEditCompClose()">
      <div v-if="eventComp && eventCompIndex !== null" class="Main_AdvancedDialogBox" style="gap: 15px;">
        <div class="Main_DialogTitle">{{ $t("m_race") }} {{ eventCompIndex+1 }}</div>
        <div class="Main_DialogChipBox">
          <div class="Main_OptionsLabel">{{ $t("m_meta") }}</div>
          <div class="Main_FilterChipsFlex" style="justify-content: flex-start;">
            <template v-for="(item, ix) in eventCompTypes.metas">
              <BaseChip
                v-model="eventComp[eventCompIndex].meta"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
        </div>
        <div class="Main_DialogChipBox">
          <div class="Main_OptionsLabel">{{ $tc("c_tyre", 2) }}</div>
          <div class="Main_FilterChipsFlex" style="justify-content: flex-start;">
            <template v-for="(item, ix) in eventCompTypes.tyres">
              <BaseChip
                v-model="eventComp[eventCompIndex].tyres"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
        </div>
        <div class="Main_DialogChipBox">
          <div class="Main_OptionsLabel">{{ $tc("c_drive", 2) }}</div>
          <div class="Main_FilterChipsFlex" style="justify-content: flex-start;">
            <template v-for="(item, ix) in eventCompTypes.drives">
              <BaseChip
                v-model="eventComp[eventCompIndex].drives"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                :value="item" />
            </template>
          </div>
        </div>
        <div class="Main_DialogChipBox">
          <div class="Main_OptionsLabel">{{ $tc("c_clearance", 2) }}</div>
          <div class="Main_FilterChipsFlex" style="justify-content: flex-start;">
            <template v-for="(item, ix) in eventCompTypes.clearances">
              <BaseChip
                v-model="eventComp[eventCompIndex].clearance"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="clubTracksetDialog"
      :transparent="true"
      :lazy="true"
      max-width="460px"
      min-width="240px"
      @close="clubTracksetDialog = false;">
      <div style="Cg_SelectorDialogBox">
        <div class="Cg_SelectorDialogHeader">
          <div class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_tracksets") }} • {{ clubDaySelected }}</div>
          <div v-if="user && user.mod" class="Cg_SelectorDialogRight">
            <button
              :disabled="clubTrackNeedSave || clubDayNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="clubOpenNewTrackset()">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_new") }}</span>
            </button>
          </div>
        </div>
        <div class="Main_SearchMid Cg_SelectorDialogMid">
          <template v-for="item in clubTracksGroups">
            <BaseButtonTouch
              style="padding-left: 15px; padding-right: 15px;"
              class="Main_SearchItem"
              @click="clubTracksetSelectorClick(item.date, $event)"
              @longTouch="clubTracksetSelectorClick(item.date, { shiftKey: true, ctrlKey: true })">
              <BaseCheckBox :value="clubTracksGroupsActive.find(x => x.date === item.date)" style="margin-right: 10px"/>
              <div class="Main_SearchItemRight Main_SearchItemList">
                <span>{{ item.name }}</span>
                <template v-if="item.icons && item.icons.length > 0">
                  <span v-for="icon in item.icons">
                    <i
                      :class="`tdicon-${icon}`"
                      class="TdIconCond"
                      aria-hidden="true">
                      <span class="path1"/>
                      <span class="path2"/>
                      <span class="path3"/>
                      <span class="path4"/>
                    </i>
                  </span>
                </template>
                
              </div>
            </BaseButtonTouch>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="clubReqsDialog"
      :transparent="true"
      :lazy="true"
      max-width="460px"
      min-width="240px"
      @close="clubReqsDialog = false;">
      <div style="Cg_SelectorDialogBox">
        <div class="Cg_SelectorDialogHeader">
          <div class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_reqs") }} • {{ clubDaySelected }}</div>
          <div v-if="user && user.mod" class="Cg_SelectorDialogRight">
            <button
              :disabled="clubTrackNeedSave || clubDayNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="clubOpenNewReqs()">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_new") }}</span>
            </button>
          </div>
        </div>
        <div class="Main_SearchMid Cg_SelectorDialogMid">
          <template v-for="item in clubReqGroups">
            <BaseButtonTouch
              style="padding-left: 15px;"
              class="Main_SearchItem"
              @click="clubReqsSelectorClick(item.date, $event)"
              @longTouch="clubReqsSelectorClick(item.date, { shiftKey: true, ctrlKey: true })">
              <BaseCheckBox :value="clubReqGroupsActive.find(x => x.date === item.date)" style="margin-right: 10px"/>
              <div class="Main_SearchItemRight">{{ item.name }}</div>
            </BaseButtonTouch>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="clubNewTracksetDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="clubNewTracksetDialog = false;">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="clubNewTracksetName"
            class="BaseText_Big"
            iid="Club_NewTracksetName"
            type="normal"
            :label="$t('m_tracksetName')"
            placeholder="" />
        </div>              
        <button
          :class="{ D_Button_Loading: clubNewTracksetLoading, D_Button_Error: clubNewTracksetError }"
          :disabled="clubNewTracksetLoading || clubNewTracksetError || !clubNewTracksetName"
          style="margin-top: 20px;"
          class="D_Button Main_SaveAllButton"
          @click="clubSaveNewTrackset()">{{ $t("m_createNewTrackset") }}</button>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="clubNewReqsDialog"
      :transparent="false"
      :lazy="true"
      max-width="340px"
      min-width="240px"
      @close="clubNewReqsDialog = false;">
      <div class="Main_SaveGalleryDialog">
        <div class="Main_SaveGalleryBox">
          <BaseText
            v-model="clubNewReqsName"
            class="BaseText_Big"
            iid="Club_NewReqsName"
            type="normal"
            :label="$t('m_reqsName')"
            placeholder="" />
        </div>              
        <button
          :class="{ D_Button_Loading: clubNewReqsLoading, D_Button_Error: clubNewReqsError }"
          :disabled="clubNewReqsLoading || clubNewReqsError || !clubNewReqsName"
          style="margin-top: 20px;"
          class="D_Button Main_SaveAllButton"
          @click="clubSaveNewReqs()">{{ $t("m_createNewReqs") }}</button>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="clubDayConfigDialog"
      :transparent="true"
      :lazy="true"
      max-width="460px"
      min-width="240px"
      @close="clubDayConfigDialog = false;">
      <div style="Cg_SelectorDialogBox">
        <div class="Cg_SelectorDialogHeader">
          <div class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_daySelector") }}</div>
          <div v-if="user && user.mod && (!clubDays[clubServerDateISO] || user.username === 'TiagoXavi')" class="Cg_SelectorDialogRight">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              :class="{ D_Button_Loading: clubLoadingAny }"
              :disabled="clubLoadingAny"
              @click="clubNewDayConfig(clubServerNextDateAvailableISO)">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ clubServerNextDateAvailableISO }}</span>
            </button>
          </div>
        </div>
        <div class="Main_SearchMid Cg_SelectorDialogMid">
          <template v-for="(item, key) in clubArrayClubDays">
            <BaseEventName
              :item="item"
              :class="{ Clubs_DaySelectorActive: item.date === clubDaySelected }"
              :customName="`${item.date}${item.date === clubServerDateISO ? ` (${$t('m_current')})` : ''}`"
              @click="clubsLoadDay(item.date, $event)"
              @longTouch="clubsLoadDay(item.date, { shiftKey: true, ctrlKey: true })" />
          </template>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import Car from './Car.vue'
import Row from './Row.vue'
import BaseText from './BaseText.vue';
import BaseCard from './BaseCard.vue';
import Loading from './Loading.vue'
import BaseDialog from './BaseDialog.vue'
import BaseSearchTrackDialog from './BaseSearchTrackDialog.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'
import BaseMemoryDialog from './BaseMemoryDialog.vue'
import BaseTypeName from './BaseTypeName.vue'
import BaseAvatar from './BaseAvatar.vue'
import BaseChip from './BaseChip.vue'
import BaseGameTag from './BaseGameTag.vue'
import BaseCheckBox from './BaseCheckBox.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'
import BaseDonateButton from './BaseDonateButton.vue'
import BaseDiscordButton from './BaseDiscordButton.vue'
import BaseUserCard from './BaseUserCard.vue'
import BaseContentLoader from './BaseContentLoader.vue'
import BaseLogoSpining from './BaseLogoSpining.vue'
import BaseCompItem from './BaseCompItem.vue'
import BaseTrackType from './BaseTrackType.vue'
import BaseFilterDescription from './BaseFilterDescription.vue'
import BaseEventTrackbox from './BaseEventTrackbox.vue'
import BaseButtonTouch from './BaseButtonTouch.vue'
import BaseCorner from './BaseCorner.vue'
import BaseSwitch from './BaseSwitch.vue'
import BaseIconSvg from './BaseIconSvg.vue'
import BaseReviewList from './BaseReviewList.vue'
import BasePrizeBoard from './BasePrizeBoard.vue'
import BaseEventName from './BaseEventName.vue'
import BaseBrakeDialog from './BaseBrakeDialog.vue'
import BaseCardGallery from './BaseCardGallery.vue'
// import data_cars from '../database/cars_final.json'
import campaign from '../database/campaign.json'
import tracksRepo from '../database/tracks_repo.json'
import BaseCarsTeam from './BaseCarsTeam.vue'
import BaseExpandDiv from './BaseExpandDiv.vue'
import BaseMonoSlider from './BaseMonoSlider.vue'
import BaseCarList from './BaseCarList.vue'

export default {
  name: 'Main',
  components: {
    Car,
    Row,
    BaseDialog,
    Loading,
    BaseAvatar,
    BaseChip,
    BaseGameTag,
    BaseCheckBox,
    BaseContentLoader,
    BaseTrackType,
    BaseText,
    BaseCard,
    BaseTypeName,
    BaseFilterDescription,
    BaseDonateButton,
    BaseDiscordButton,
    BaseLogoSpining,
    BaseCompItem,
    BaseConfigCheckBox,
    BaseSearchTrackDialog,
    BaseFilterDialog,
    BaseUserCard,
    BaseEventTrackbox,
    BaseButtonTouch,
    BaseCorner,
    BaseSwitch,
    BaseReviewList,
    BaseIconSvg,
    BaseMemoryDialog,
    BasePrizeBoard,
    BaseEventName,
    BaseBrakeDialog,
    BaseCardGallery,
    BaseCarsTeam,
    BaseExpandDiv,
    BaseMonoSlider,
    BaseCarList
  },
  props: {
    phantomCar: {
      type: Object,
      default() {
        return {}
      }
    },
    isImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      unsubscribe: null,
      inverted: false,
      compact: false,
      fullColors: false,
      windowWidth: 0,
      tempWindowWidth: 0,
      isMobile: false,
      isPrinting: false,
      announcementDialog: false,
      highlightsUsers: {},
      lastestList: [],
      statistics: {},
      statisticsLoading: false,
      searchInputT: '',
      searchFilterDialog: false,
      librarySearchDialog: false,
      librarySearchDialogLoad: false,
      libraryApprove: false,
      memorySearchDialog: false,
      memorySearchDialogLoad: false,
      userloaded: false,
      Vue: Vue,

      showReviews: false,
      isReviewing: false,
      reviewUrl: {},
      isFilteringT: false,
      nextId: 0,
      countTimesPerTrack: {},
      debounceCgSaveBank: null,
      // searchLoading: false,
      searchLoadingT: false,
      searchLoadingT2: false,
      maxCarNumber: 30,
      shareDialog: false,
      pngLoading: false,
      tuneDialogActive: false,
      tuneDialogCar: null,
      tuneDialogCarIndex: null,
      tuneDialogRace: null,
      tuneDialogisOppo: false,
      customTuneDialogActive: false,
      customTuneDialogCar: null,
      customTuneDialogTune: null,
      memoryFirstTimeLoaded: false,
      optionsDialogActive: false,
      printImageDialog: false,
      lastestLoading: false,
      
      currentViewport: null,
      mraEditing: false,
      mraEditInput: null,
      mraLoading: false,
      voteLoading: false,
      successVote: false,
      saveToGalleryDialog: false,
      saveToGalleryModel: {},
      saveToGalleryLoading: false,
      saveToGalleryError: false,
      confirmDelete: {
        dialog: false,
        msg: "Confirm delete?",
        actionLabel: "Delete",
        action: null,
        loading: false,
        classe: ""
      },
      memory: [],
      customTrackDialog: false,
      backToOptionsDialog: true,
      hoverIndex: -1,
      gameVersion: "Game v28.0",
      showPoints: false,
      pointsResolved: [],
      carHoverIndex: -1,
      cgLoading: false,
      cgCurrentRound: 0,
      cgCurrentRoundSum: 0,
      cgRoundsNumber: 1,
      cgCurrentId: null,
      cgCurrentName: null,
      cgList: [],
      cgRaceSelected: 0,
      cgAddingYouCar: false,
      cgAddingOppoCar: false,
      cgRound: {},
      cgRoundToSave: [],
      cgBankToSave: [],
      cgRoundFilterString: null,
      cgRoundFilterToSave: null,
      cgBankToSaveLoading: false,
      cgDialog: false,
      cgDialogNew: true,
      cg: {},
      cgLastKey: undefined,
      cgSaveLoading: false,
      cgRequirementsDialog: false,
      cgRequirementsDialogLoad: false,
      cgFilterDialog: false,
      cgFilterDialogLoad: false,
      cgFilterForAddCar: {},
      cgSeletorDialog: false,
      cgRoundSelectorDialog: false,
      cgNewDialog: false,
      cgNewModel: {
        name: null,
        numberRounds: 10
      },
      cgNewLoading: false,
      cgNewError: false,
      cgRqEditDialog: false,
      cgRqEditModel: null,
      cgRqEditString: null,
      cgRqNeedToSave: false,
      cgAnalyseLoading: false,
      cgIsApproving: false,
      cgApprovingIndex: 0,
      cgApprovingLength: 0,
      cgNewSubmitByMod: false,
      cgNewSubmitByModTemplate: null,
      cgLoadedAssets: [],
      cgSentForReview: false,
      cgPointsEditDialog: false,
      cgPointsEditModel: null,
      cgPointsEditString: null,
      cgPointsEditRace: null,
      cgPointsIsDraw: false,
      cgShowResetSavedHand: false,
      cgFilterForAnalyse: {},
      cgCompleteJson: "",
      cgRoundResultJson: "",
      cgRoundResultJsonErrorTxt: "",
      cgPermanentToggle: true,
      cgLongToggle: true,
      cgJsonDownloadRids: [],
      forceShowAnalyse: false,
      event: {},
      eventCurrentId: null,
      eventCurrentName: null,
      eventCurrentIsHidden: false,
      eventCacheCars: [],
      eventList: [],
      eventLoading: false,
      eventAnalyseLoading: false,
      eventSelectorDialog: false,
      eventNewDialog: false,
      eventNewName: null,
      eventNewIsHidden: false,
      eventNewLoading: false,
      eventNewError: false,
      eventRqEditDialog: false,
      eventRqEditModel: null,
      eventRqEditString: null,
      eventIcons: null,
      eventRequirementsDialog: false,
      eventRequirementsDialogLoad: false,
      eventKingDialog: false,
      eventKingDialogLoad: false,
      eventCheckFilterCodePre: null,
      eventCheckFilterCode: null,
      eventKingTracks: [],
      // eventAddCarDialog: false,
      // eventAddCarDialogLoad: false,
      eventFilterToSave: null,
      eventFilterToSave2: null,
      eventFilterToSave3: null,
      eventFilterString: null,
      eventFilterString2: null,
      eventFilterString3: null,
      eventFilterForKing: {},
      eventFilterForKingLast: "",
      eventTracksetString: null,
      eventCompString: null,
      eventCompDialog: false,
      eventCompIndex: null,
      eventCompTypes: {
        metas: ["Dragster", "Speedster", "Twister"],
        tyres: ["Performance", "Standard", "All-surface", "Off-road", "Slick"],
        drives: ["2WD", "4WD"],
        clearances: ["Low", "Mid", "High"],
      },
      eventShowResetSavedHand: false,
      eventForceAnalyze: false,
      eventBlockAddTrackset: false,
      eventTracksetSelected: 0,
      eventRaceSelected: 0,
      eventResponse: [],
      eventPointsReference: [{}, {}, {}, {}, {}],
      eventPicksList: [],
      eventShowOnlyPicks: false,
      eventForcePicks: false,
      eventMyGarage: false,
      eventEnablePicks: true,
      eventScoreType: "saverScore3",
      eventScoreList: ["saverScore1", "saverScore2", "saverScore3"],
      eventUseWhatFilter: 0,
      eventBestPerTrack: {},
      eventHasPrizeBoard: false,
      eventParsedList: [],
      eventBestTeamsLoading: false,
      eventBestTeamsDialog: false,
      eventBestTeamsBigArray: [],
      eventBestTeamsLastCache: null,
      eventBestTeamsConfig: {
        myGarage: false,
        forceCarsBool: false,
        blackListBool: false,
        repeatCars: true,
        uniqueHands: false,
        prizeCars: true,
        neverAwardedCars: true,
        predictedTimes: true,
        forceCars: [{}, {}, {}, {}, {}],
        blackList: [],
      },
      eventBestTeamsTarget: {},
      club: {},
      clubLoading: false,
      clubNewLoading: false,
      clubAnalyseLoading: false,
      clubFirstLoading: true,
      clubServerDate: null, 
      clubServerDateISO: null, 
      clubServerNextDateAvailableISO: null, 
      clubTracksGroupModel: {},
      clubReqsGroupModel: {},
      clubTracksGroups: [],
      clubTracksGroupsActive: [],
      clubReqGroups: [],
      clubReqGroupsActive: [],
      clubCompilation: [],
      clubCurrentTracksetString: null,
      clubCurrentCompString: null,
      clubCurrentTracksetIcons: null,
      clubCurrentName: null,
      clubRequirementsDialog: false,
      clubRequirementsDialogLoad: false,
      clubsIconsList: [
        'asphalt',
        'roll',
        'clearance',
        'rain',
        'dirt',
        'grass',
        'gravel',
        'ice',
        'sand',
        'snow'
      ],
      clubDays: {},
      clubDayConfigDialog: false,
      clubDaySelected: null,
      clubDaySelectedObj: {},
      clubDayCurrentTracksetStrig: null,
      clubDayCurrentReqStrig: null,
      clubCheckFilterCodePre: null,
      clubCheckFilterCode: null,
      clubForceAnalyze: false,
      clubTracksetSelected: 0,
      clubBlockAddTrackset: false,
      clubPicksList: [],
      clubShowOnlyPicks: false,
      clubShowAnalyse: false,
      clubForcePicks: false,
      clubEnablePicks: true,
      clubPointsReference: [{}, {}, {}, {}, {}],
      clubScoreType: "saverScore3",
      clubTracksetDialog: false,
      clubReqsDialog: false,
      clubNewTracksetDialog: false,
      clubNewTracksetName: "",
      clubNewTracksetLoading: false,
      clubNewTracksetError: false,
      clubNewReqsDialog: false,
      clubNewReqsName: "",
      clubNewReqsLoading: false,
      clubNewReqsError: false,
      clubCurrentFilterString: null,
      clubCurrentFilterString2: null,
      clubCurrentFilterString3: null,
      clubCurrentFilterToSave: null,
      clubCurrentFilterToSave2: null,
      clubCurrentFilterToSave3: null,
      clubCurrentFilterForKing: {},
      clubCurrentCriteriaNameString: null,
      clubCurrentKingDialog: false,
      clubCurrentKingFilterCodePre: null,
      clubCurrentKingFilterCode: null,
      clubIsShowingOriginal: false,
      clubBlockOriginalButton: false,
      clubUseWhatFilter: 0,
      clubBestPerTrack: {},
      clubJson: "",
      kingDialog: false,
      kingFilterDialog: false,
      kingFilterDialogLoad: false,
      kingTrack: false,
      kingFilter: {},
      kingIsFiltering: false,
      kingFilterCount: 0,
      kingLoading: false,
      kingShowDownvoted: false,
      kingMyGarage: false,
      kingFixed: false,
      kingAddindTrack: false,
      kingForceVerticalView: true,
      kingClearFilter: {},
      memoryRenameDialog: false,
      memoryRenameNewName: null,
      memoryRenameNewNameIndex: 0,
      trackTimes: null,
      user: null,
      showCarsFix: true,
      needSave: false,
      saveLoading: false,
      downloadLoading: false,
      shareUrl: null,
      shareListCars: null,
      copyUrlSucess: false,
      copyListSucess: false,
      filterCountT: 0,
      filterCountCg: 0,
      lastestContributionsResolved: [],
      // carDetailsList: default_cars,
      campaign,
      smartCampaign: [],
      campaignDialog: false,
      carDetailsList: [],
      // all_cars: data_cars,
      toLoadTrackSet: null,
      currentTracks: [],
      currentTracksSetsNames: [],
      ignore50points: false,
      pasteInputModel: null,
      tracksButtons: [
        {
          name: "Twisty",
          list: [
            {
              type: "00",
              active: false,
              tracks: ["carPark_a00","gForce_a00","gForcer_a00","hairpin_a00","indoorKart_a00","kart_a00","slalom_a00","slalomr_a00","tCircuit_a00","tCircuitr_a00","tRoad_a00","fast_a00","fastr_a00","canyonTour_a00","laguna_a00"]
            },
            {
              type: "00",
              active: false,
              customSufix: "2",
              tracks: ["forest_a00","townSlalom_a00","townSprint_a00","mnGforce_a00","mnHairpin_a00","mnCityNarrow_a00","mnCity_a00","mnCityLong_a00","tokyoLoop_a00","tokyoOffRamp_a00","tokyoOverpass_a00","nwGforce_a00","nwCircuit_a00","nwSlalom_a00","nwCathedral_a00","nwLoop_a00","nwTour_a00","northloop1_a00","northloop2_a00","northloop4_a00"]
            },
            {
              type: "01",
              active: false,
              tracks: ["carPark_a01","gForce_a01","hairpin_a01","kart_a01","slalom_a01","tCircuit_a01","tCircuitr_a01","tRoad_a01","fast_a01","laguna_a01","townSprint_a01","forest_a01","mnGforce_a01","mnHairpin_a01","canyonTour_a01","nwCathedral_a01"]
            },
            {
              type: "10",
              active: false,
              tracks: ["gForce_a10","hairpin_a10","tRoad_a10","tCircuit_a10","slalom_a10","moto_a10","rallySmall_a40","rallyMed_a40","mnHairpin_a40","airplaneSlalom_a10"]
            },
            {
              type: "11",
              active: false,
              tracks: ["gForce_a11","tRoad_a11","slalom_a11","rallySmall_a41","moto_a11","mnHairpin_a41","mtHairpin_a11"]
            },
            {
              type: "20",
              active: false,
              tracks: ["gForce_a20","hairpin_a20","tRoad_a20","slalom_a20","figureEight_ab0"]
            },
            {
              type: "30",
              active: false,
              tracks: ["gForce_a30","slalom_a30"]
            },
            {
              type: "50",
              active: false,
              tracks: ["gForce_a50","hairpin_a50","tRoad_a50","slalom_a50","oceanSlalom_ac0"]
            },
            {
              type: "60",
              active: false,
              tracks: ["gForce_a60","hairpin_a60","tRoad_a60","tCircuit_a60","frozenLake_ad0","slalom_a60","forest_a60"]
            },
          ],
        },
        {
          name: "Drag",
          list: [
            {
              type: "00",
              active: false,
              tracks: ["mile4_a00","mile2_a00","mile1_a00","drag100_a00","drag120_a00","drag150_a00","drag170_a00","hClimb_a00","testBowl_a00"]
            },
            {
              type: "00",
              active: false,
              customSufix: "2",
              tracks: ["waterDrag_a00","nwDrag_a00","mile4r_a00","mile1r_a00","drag100b_a00","drag150b_a00","drag30130_a00","drag50150_a00","drag75125_a00","testBowlr_a00"]
            },
            {
              type: "01",
              active: false,
              tracks: ["drag100_a01","drag100b_a01","drag150_a01","mile4_a01","mile2_a01","mile1_a01","nwDrag_a01","testBowlr_a01"]
            },
            {
              type: "10",
              active: false,
              tracks: ["drag100_a10","drag100b_a10","drag150_a10","mile1_a10","hClimb_a10","testBowl_a10"]
            },
            {
              type: "11",
              active: false,
              tracks: ["mile4_a11","mile2_a11","hClimb_a11"]
            },
            {
              type: "20",
              active: false,
              tracks: ["drag100_a20","drag120_a20","mile4_a20","mile2_a20","mile1_a20","hClimb_a20","testBowlr_a20"]
            },
            {
              type: "30",
              active: false,
              tracks: ["mile4_a30"]
            },
            {
              type: "50",
              active: false,
              tracks: ["drag60_a50","mile4_a50","mile2_a50","mile1_a50","hClimb_a50"]
            },
            {
              type: "60",
              active: false,
              tracks: ["mile4_a60","mile2_a60","mile1_a60","testBowlr_a60"]
            },
          ]
        },
        {
          name: "City",
          list: [
            {
              type: "00",
              active: false,
              tracks: ["csSmall_a00","csMed_a00"]
            },
            {
              type: "01",
              active: false,
              tracks: ["csSmall_a01","csMed_a01"]
            },
            {
              type: "50",
              active: false,
              tracks: ["csSmall_a50"]
            },
            {
              type: "60",
              active: false,
              tracks: ["csSmall_a60","csMed_a60"]
            },
          ]
        }
      ],
      tracksRepo,
      

      carList: [],
      //          0         1         2         3           4           5       6       7             b                c              d              e
      surfaces: ["Asphalt", "Dirt", "Gravel", "Ice", "Asphalt/Dirt", "Sand", "Snow", "Grass", "Asphalt/Gravel", "Asphalt/Sand", "Asphalt/Snow", "Sand/Dirt"],
      conds: ["Dry", "Wet"],
      //      0       1      2      3
      tunes: ["332", "233", "323", "111"]
    }
  },
  watch: {
    // phantomCar: function() {
    //   console.log( JSON.parse(JSON.stringify(this.phantomCar.data[this.phantomCar.selectedTune].times)) );
    //   this.clearAllTracks();
    //   this.clearAllCars();

    //   this.showCarsFix = false;
    //   this.$nextTick().then(() => {
    //     this.showCarsFix = true;

    //     this.carDetailsList.push(JSON.parse(JSON.stringify(this.phantomCar)));
    //     this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
    //     this.nextId++;
    //     let tracks = [];
    //     Object.keys( this.phantomCar.data[this.phantomCar.selectedTune].times ).forEach(function (track) {
    //       tracks.push(track);
    //     })
    //     this.moreTracksCar(tracks)
    //     // 2x
    //     this.carDetailsList.push(JSON.parse(JSON.stringify(this.phantomCar)));
    //     this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
    //     this.nextId++;
    //     this.carDetailsList[this.carDetailsList.length - 1].data = {};


    //     axios.get(Vue.preUrl + "/car/" + this.phantomCar.rid)
    //     .then(res => {
    //       if (res.data.data) Vue.set(this.carDetailsList[this.carDetailsList.length - 1], "data", res.data.data);
    //       if (res.data.users) Vue.set(this.carDetailsList[this.carDetailsList.length - 1], "users", res.data.users);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //       this.$store.commit("DEFINE_SNACK", {
    //         active: true,
    //         error: true,
    //         text: error,
    //         type: "error"
    //       });
    //     })

    //   })

    // },
    "$route.name": function() {
      let r = this.$route.name;
      if (r === "Records" || r === "Compare" || r === "Challenges" || r === "Events" || r === "Clubs") {
        this.optionsDialogActive = false;
        this.kingDialog = false;
        this.kingFixed = false;
        this.showPoints = false;

        setTimeout(() => {
          window.localStorage.setItem('mode', this.mode);
          this.changedMode();
        }, 100);
      }
    },
    cgNeedSave: function() {
      if (this.cgNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
      this.$store.commit('BEFOREUNLOAD_TOUCH');
    },
    eventNeedSave: function() {
      if (this.eventNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
      this.$store.commit('BEFOREUNLOAD_TOUCH');
    },
    clubTrackNeedSave: function() {
      if (this.clubTrackNeedSave || this.clubDayNeedSave || this.clubReqNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
      this.$store.commit('BEFOREUNLOAD_TOUCH');
    },
    clubDayNeedSave: function() {
      if (this.clubTrackNeedSave || this.clubDayNeedSave || this.clubReqNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
      this.$store.commit('BEFOREUNLOAD_TOUCH');
    },
    clubReqNeedSave: function() {
      if (this.clubTrackNeedSave || this.clubDayNeedSave || this.clubReqNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
      this.$store.commit('BEFOREUNLOAD_TOUCH');
    },
  },
  beforeMount() {
    this.isMobile = Vue.options.filters.isMobile();
    this.clearSaveToGallery();
    this.cgGetLocalStorage();
    this.eventGetLocalStorage();
    let _md = window.localStorage.getItem("_md");



    let mode = window.localStorage.getItem("mode");
    if (mode && mode !== 'cg') {
      if (this.$route.name === 'Records') {
        this.mode = mode;
      }
    }

    if (this.$route.query && this.$route.query.approve) {
      this.mode = 'compare';
      this.libraryApprove = true;
      setTimeout(() => {
        this.openLibraryDialog();
      }, 100);
    }

    // let cgLocalShowPermanentCgs = window.localStorage.getItem("cgLocalShowPermanentCgs");
    // if (cgLocalShowPermanentCgs) {
    //   cgLocalShowPermanentCgs = JSON.parse(cgLocalShowPermanentCgs);
    //   this.cgPermanentToggle = cgLocalShowPermanentCgs;
    // }

    // let cgLocalShowLongCgs = window.localStorage.getItem("cgLocalShowLongCgs");
    // if (cgLocalShowLongCgs) {
    //   cgLocalShowLongCgs = JSON.parse(cgLocalShowLongCgs);
    //   this.cgLongToggle = cgLocalShowLongCgs;
    // }


    



    let cars = window.localStorage.getItem("cars");
    if (!cars) {
      window.localStorage.setItem('_dt', JSON.stringify(new Date().getTime()));
    }

    let display = window.localStorage.getItem("display");
    if (display) {
      this.display(display);
    }
    let colors = window.localStorage.getItem("colors");
    if (colors) {
      this.colorsChange(colors);
    }
    
    let kingShowDownvoted = window.localStorage.getItem("kingShowDownvoted");
    if (kingShowDownvoted) {
      kingShowDownvoted = JSON.parse(kingShowDownvoted);
      this.kingShowDownvoted = kingShowDownvoted;
    }
    let kingForceVerticalView = window.localStorage.getItem("kingForceVerticalView");
    if (kingForceVerticalView) {
      kingForceVerticalView = JSON.parse(kingForceVerticalView);
      this.kingForceVerticalView = kingForceVerticalView;
    }
    let eventShowOnlyPicks = window.localStorage.getItem("eventShowOnlyPicks");
    if (eventShowOnlyPicks) {
      eventShowOnlyPicks = JSON.parse(eventShowOnlyPicks);
      this.eventShowOnlyPicks = eventShowOnlyPicks;
    }
    let eventForcePicks = window.localStorage.getItem("eventForcePicks");
    if (eventForcePicks) {
      eventForcePicks = JSON.parse(eventForcePicks);
      this.eventForcePicks = eventForcePicks;
    }
    

    if (this.$route.query && this.$route.query.share && this.$route.query.share.includes("~")) {
      // from query string
      this.changeMode('compare');
      this.decodeTemplateString(this.$route.query.share, true);
    } else if (this.$route.query && this.$route.query.cg && this.$route.query.cg.includes("~")) {
      // from query string
      this.changeMode('challenges');

      this.$route.query.cg.split("~").map(x => {
        if (x[0] === "G") {
          this.cgCurrentId = decodeURI(x.substr(1))
        } else if (x[0] === "R") {
          this.cgCurrentRound = Number(decodeURI(x.substr(1))) - 1
        }
      })
      this.$router.replace({'query': null});

    } else if (this.$route.query && this.$route.query.event && this.$route.query.event.includes("~")) {
      // from query string
      this.changeMode('events');

      this.$route.query.event.split("~").map(x => {
        if (x[0] === "G") {
          this.eventCurrentId = decodeURI(x.substr(1))
        }
      })
      this.$router.replace({'query': null});

    } else if (this.$route.query && this.$route.query.clubs !== undefined) {
      // from query string
      this.changeMode('clubs');
      
      this.$router.replace({'query': null});

    } else {
      this.changedMode();
    }

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);



    
  },
  mounted() {
    let vm = this;
    
    this.debounceCgSaveBank = Vue.debounce(this.cgSaveBank, 2000);

    this.getLastest();
    this.getStatistics();
    this.user = this.$store.state.user;

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_TIME") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        let NEW = mutation.payload.item;
        let number = mutation.payload.number;

        this.resolveChangeTime(car, NEW, number, car.selectedTune);
      }

      if (mutation.type == "DELETE_TIME") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        let NEW = mutation.payload.item;
        let tune = car.selectedTune;
        let track = `${NEW.id}_a${NEW.surface}${NEW.cond}`;
        let trackname = vm.$t(`t_${NEW.id}`);

        let action = function() {
          vm.confirmDelete.loading = true;
          vm.saveLoading = true;

          axios.post(Vue.preUrl + "/deleteTime", {
            rid: car.rid,
            tune: tune,
            track: track,
          })
          .then(res => {
            vm.confirmDelete.dialog = false;
            Vue.set(car.data[tune].times, track, undefined);

            vm.showCarsFix = false;
            vm.$nextTick().then(() => {
              vm.showCarsFix = true;
            })

            vm.$store.commit("DEFINE_SNACK", {
              active: true,
              correct: true,
              text: vm.$t('m_deleteSuccess')
            });
          })
          .catch(error => {
            console.log(error);
            vm.$store.commit("DEFINE_SNACK", {
              active: true,
              error: true,
              text: error,
              type: "error"
            });
            if ((error.response || {}).status === 401) {
              vm.$store.commit('OPEN_LOGIN');
            }
          })
          .then(() => {
            vm.confirmDelete.loading = false;
            vm.saveLoading = false;
          });
        }

        this.confirmDelete = {
          dialog: true,
          msg: `Delete '${trackname}' time of ${car.name}?`,
          actionLabel: `Delete`,
          action: action,
          loading: false,
          classe: `D_ButtonRed`
        }
      }

      if (mutation.type == "DELETE_TRACK") {
        vm.currentTracks.splice(mutation.payload.track, 1);
        vm.verifyActiveButtons();
        vm.updateOptions();
      }

      if (mutation.type == "CHANGE_TUNE") {
        let car;
        if (vm.mode === 'compare') {
          car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        } else if (vm.mode === 'compare') {

        }

        vm.changeTuneCar(car, mutation.payload.tune, true)
      }

      if (mutation.type == "CHANGE_STAT") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);

        vm.changeStatCar(car, mutation.payload.type, mutation.payload.value)
      }

      if (mutation.type == "SHOW_TUNE") {
        let indexCar = vm.carDetailsList.findIndex(x => x.softId === mutation.payload.car.softId);
        let car = vm.carDetailsList[indexCar];

        if (car) {
          vm.tuneDialogCar = car;
          vm.tuneDialogCarIndex = indexCar;
          vm.tuneDialogActive = mutation.payload.active;
          vm.tuneDialogisOppo = false;
        }
      }

      if (mutation.type == "HOVER_INDEX") {
        if (mutation.payload) {
          if (!document.querySelector("[class*='_DraggingParent']")) {
            vm.hoverIndex = mutation.payload;
          }
        }
      }

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
        vm.userloaded = true;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }


    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.unsubscribe();
  },
  computed: {
    mode: {
      get: function () {
        if (this.$route.name === "Records" || this.$route.name === "Compare") return "compare";
        if (this.$route.name === "Challenges") return "challenges";
        if (this.$route.name === "Events") return "events";
        if (this.$route.name === "Clubs") return "clubs";
      },
      set: function (newValue) {
        if (this.$route.path.includes(newValue)) return;
        
        if (newValue === "compare") this.$router.push({ name: "Compare" });
        if (newValue === "challenges") this.$router.push({ name: "Challenges" });
        if (newValue === "events") this.$router.push({ name: "Events" });
        if (newValue === "clubs") this.$router.push({ name: "Clubs" });
      },
    },
    optionsDialogComputed() {
      if (this.customTrackDialog) return false;
      if (this.librarySearchDialog) return false;
      if (this.memorySearchDialog) return false;
      if (this.searchFilterDialog) return false;
      if (this.kingDialog) return false;
      if (this.kingFixed) return false;
      return this.optionsDialogActive;
    },
    highlights() {
      let vm = this;
      let result = [];
      let sortedByTracks = {};
      vm.countTimesPerTrack = {};


      // result length = number of cars
      this.carDetailsList.map(x => {
        result.push({});
      });

      // insert every type of track in both result && sortedByTracks
      this.currentTracks.map((x, ix) => {
        vm.countTimesPerTrack[`${x.id}_a${x.surface}${x.cond}`] = 0;
        sortedByTracks[`${x.id}_a${x.surface}${x.cond}`] = [];
        result.map(y => {
          y[`${x.id}_a${x.surface}${x.cond}`] = null;
        })
      });
      
      // insere os times de cada carro em suas respectivas trackId
      this.carDetailsList.map(x => {
        if ( x.selectedTune && x.data && x.data[x.selectedTune] && x.data[x.selectedTune].times ) {
          Object.keys( x.data[x.selectedTune].times ).forEach(function (trackId) {
            if (sortedByTracks[trackId]) {
              vm.countTimesPerTrack[trackId] = vm.countTimesPerTrack[trackId] + 1;
              sortedByTracks[trackId].push((x.data[x.selectedTune].times[trackId] || {}).t);
            }
          });
        }
      });
      // console.log(vm.countTimesPerTrack);

      // dá sort nos times e remove duplicates
      Object.keys( sortedByTracks ).forEach(function (trackId) {
        if (sortedByTracks[trackId].length === 1) {
          sortedByTracks[trackId] = [];
        } else {
          sortedByTracks[trackId].sort(function(a, b) {
            if (trackId.includes('testBowl')) return b - a;
            if (a === 0) return 9999999;
            if (b === 0) return -9999999;
            return a - b;
          });
          sortedByTracks[trackId] = [...new Set(sortedByTracks[trackId])];
        }
      });

      // preenche result com seus respectivos ranking
      let tempValue;
      result.map((x, ix) => {
        Object.keys( x ).forEach(function (trackId) {
          if (
            vm.carDetailsList[ix].data &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune] &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId]
          ) {
            tempValue = vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId].t;
            x[trackId] = sortedByTracks[trackId].indexOf(tempValue);
          }
        });
      })

      // console.log(result);
      // console.log(sortedByTracks);
      // debugger;

      return result;
    },
    contributorsList() {
      let vm = this;
      let contritrs = [];
      this.carDetailsList.map(car => {
        // if (x.users && x.users.length > 0) {
        //   contritrs.push(...x.users);
        // }
        if (car.data && car.selectedTune && car.data[car.selectedTune]) {
          Object.keys( car.data[car.selectedTune] ).forEach(function ( type ) {
            Object.keys( car.data[car.selectedTune][type] ).forEach(function ( item ) {
              if (vm.currentTracks.find(track => item.includes(track.code))) {
                if ((car.data[car.selectedTune][type][item] || {}).u) {
                  contritrs.push((car.data[car.selectedTune][type][item] || {}).u)
                }
              }
            });
          });
        }
      });

      var map = contritrs.reduce(function(p, c) {
        p[c] = (p[c] || 0) + 1;
        return p;
      }, {});

      contritrs = Object.keys(map).sort(function(a, b) {
        return map[b] - map[a];
      });

      return contritrs
    },
    tuneDialogTunes() {
      let result = ["332", "323", "233"];
      if (this.tuneDialogCar.data && this.$store.state.showCustomTunes) {
        Object.keys( this.tuneDialogCar.data ).forEach(tune => {
          if (tune[0] !== "v" && !result.includes(tune)) {
            result.push(tune);
          }
        })
      };
      if (this.tuneDialogCar.forceTune && !result.includes(this.tuneDialogCar.forceTune)) {
        result.push(this.tuneDialogCar.forceTune);
      }

      if ((this.tuneDialogCar.class === "S" || this.tuneDialogCar.class === "A") && !result.includes("111")) result.push("111");

      if (this.mode === 'compare' && this.tuneDialogCar.data && this.$store.state.showDataFromPast) {
        Object.keys( this.tuneDialogCar.data ).forEach(tune => {
          if (tune[0] === "v") {
            result.push(tune);
          }
        })
      };
      return result;
    },
    tunesCount() {
      if (!this.tuneDialogCar.data) return {};
      let result = {};
      this.tuneDialogTunes.map(tune => {
        if (this.tuneDialogCar.data[tune]) {
          if (this.tuneDialogCar.data[tune].times) {
            result[tune] = Object.keys(this.tuneDialogCar.data[tune].times).filter(key => this.tuneDialogCar.data[tune].times[key] && this.tuneDialogCar.data[tune].times[key].t !== 0).length;
          }
        }
      })
      return result;
    },
    cgNeedSave() {
      if (!this.user) return false;
      if (this.cgNewSubmitByMod) return false;
      return this.cgRoundToSave.length > 0 || this.needSave || this.cgRoundFilterToSave || this.cgRqNeedToSave;
    },
    showAnalyse() {
      if (this.mode !== 'challenges') return false;
      if (!this.user || !this.user.mod) return false;
      if (this.cgNeedSave) return false;
      if (!this.cgRound) return false;
      if (this.cgNewSubmitByMod) return false;
      if (this.cgNewSubmitByModTemplate) return false;
      let show = true;
      if (this.forceShowAnalyse) return true;
      this.cgRound.races.map(race => {
        if (!race.rid || race.time === undefined || race.time === null) show = false;
        if (!race.track) show = false;
        if (race.cars && race.cars.length > 4) show = false
      })
      return show;
    },
    isRoundEmptyForUser() {
      if (this.mode !== 'challenges') return false;
      if (!this.user) return false;
      if (this.user.mod) return false;
      if (!this.cgRound) return false;
      if (!this.cgRound.lastAnalyze) {
        return true
      }
    },
    isRoundEmptyForModders() {
      if (this.mode !== 'challenges') return false;
      if (!this.user) return false;
      if (!this.user.mod) return false;
      if (!this.cg.date || !this.cg.rounds[this.cgCurrentRound]) return false;
      if (this.cg.rounds[this.cgCurrentRound].reservedTo) return false;
      if (this.cg.rounds[this.cgCurrentRound].creator) return false;
      if (!this.cg.rounds[this.cgCurrentRound].lastAnalyze) return true;
      if (this.cgNewSubmitByMod) return true;
    },
    isRoundReadyForSaveUser() {
      if (!this.isRoundEmptyForUser) return false;
      let ready = true;
      this.cgRound.races.map(race => {
        if (!race.rid || race.time === undefined || race.time === null) ready = false;
        if (!race.track) ready = false;
        if (race.cars && race.cars.length > 4 && !this.cgRound.isPreview) ready = false;
      })
      // console.log( this.cgRound.races.map(race => race.time) )
      return ready;
    },
    isRoundComplete() {
      if (this.mode !== 'challenges') return false;
      if (!this.cgRound) return false;
      if (!this.cgRound.date) return false;
      if (!Array.isArray(this.cgRound.races)) return false;
      let isComplete = true;
      this.cgRound.races.find(race => {
        if (!race.rid || !race.track || !race.tune || (!race.time && race.time !== 0) ) {
          isComplete = false;
          return true;
        }
      })
      return isComplete;
    },
    isRoundReadyForPreview() {
      if (this.mode !== 'challenges') return false;
      if (!this.user) return false;
      if (!this.cgRound.date) return false;
      if (this.cgRound.lastAnalyze) return false;
      if (this.cgRound.isPreview) return false;
      if (this.cgNewSubmitByMod) return false;
      if (this.showAnalyse && !this.cgIsApproving) return false;
      let isReady = true;
      this.cgRound.races.find(race => {
        if (!race.rid || !race.track || !race.tune) {
          isReady = false;
          return true;
        }
      })
      return isReady;
    },
    isRoundModAllowedEdit() {
      if (this.mode !== 'challenges') return false;
      if (!this.user) return false;
      if (!this.user.mod) return false;
      if (!this.cgRound.date) return false;
      if (this.cgRound.reservedTo === this.user.username) return true;
      if (this.cgRound.lastAnalyze) return true;
    },
    cgBlockDownloadAssets() {
      if (this.mode !== 'challenges') return false;
      if (!this.cgRound || !this.cgRound.races) return true;
      let isEmpty = true;
      this.cgRound.races.find(race => {
        if (race.rid) {
          isEmpty = false;
          return true;
        }
      })
      return isEmpty;
    },
    cgLoadingAny() {
      if (this.mode !== 'challenges') return false;
      return this.downloadLoading || this.cgLoading || this.cgSaveLoading || this.cgNewLoading || this.saveLoading || this.cgBankToSaveLoading || this.cgAnalyseLoading;
    },
    eventLoadingAny() {
      if (this.mode !== 'events') return false;
      return this.downloadLoading || this.eventLoading || this.eventNewLoading || this.saveLoading || this.eventAnalyseLoading;
    },
    clubLoadingAny() {
      if (this.mode !== 'clubs') return false;
      return this.downloadLoading || this.clubLoading || this.clubNewLoading || this.saveLoading || this.eventAnalyseLoading;
    },
    isEvents() {
      return this.mode === 'events';
    },
    isClubs() {
      return this.mode === 'clubs';
    },
    eventComp() {
      if (this.isEvents) return this.event.comp;
      else return this.clubTracksGroupModel.comp;
    },
    pngLabel() {
      return this.pngLoading ? this.$t("m_pleaseWait3dot") : this.$t("m_downloadPng")
    },
    eventNeedSave() {
      if (this.mode !== 'events') return false;
      if (!this.eventCurrentId) return false;
      if (this.eventCurrentId === "_preview_") return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (this.event.noAccess) return false;
      if (this.eventFilterToSave && JSON.stringify(this.eventFilterToSave) !== this.eventFilterString) return true;
      if (this.eventFilterToSave2 && JSON.stringify(this.eventFilterToSave2) !== this.eventFilterString2) return true;
      if (this.eventFilterToSave3 && JSON.stringify(this.eventFilterToSave3) !== this.eventFilterString3) return true;
      if (this.eventCompString !== JSON.stringify(this.event.comp)) return true;
      if (this.eventRqEditString !== JSON.stringify(this.event.rqLimit)) return true;
      if (this.eventIcons !== JSON.stringify(this.event.icons)) return true;
      // if (this.eventTracksetString !== JSON.stringify(this.event.trackset)) return true;
      if (this.eventNeedSaveTrackset) return true;
      return false;
    },
    eventNeedSaveTrackset() {
      if (this.eventTracksetString === JSON.stringify(this.event.trackset)) return false;
      let localTracks = JSON.parse(this.eventTracksetString);
      let areEqual = false;
      if (localTracks.length !== this.event.trackset.length) return true;
      areEqual = localTracks.every((trackset, itrackset) => {
        return trackset.every(a => this.event.trackset[itrackset].some(b => a === b));
      })
      return !areEqual;
    },
    clubTrackNeedSave() {
      if (this.mode !== 'clubs') return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (this.clubFirstLoading) return false;
      if (this.clubCurrentTracksetString !== JSON.stringify(this.clubTracksGroupModel.trackset)) return true;
      if (this.clubCurrentCompString !== JSON.stringify(this.clubTracksGroupModel.comp)) return true;
      if (this.clubCurrentTracksetIcons !== JSON.stringify(this.clubTracksGroupModel.icons)) return true;
      if (this.clubCurrentName !== JSON.stringify(this.clubTracksGroupModel.name)) return true;
      return false;
    },
    clubReqNeedSave() {
      if (this.mode !== 'clubs') return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (!this.clubReqsGroupModel.name) return false;
      if (this.clubFirstLoading) return false;
      if (this.clubCurrentFilterToSave && JSON.stringify(this.clubCurrentFilterToSave) !== this.clubCurrentFilterString) return true;
      if (this.clubCurrentFilterToSave2 && JSON.stringify(this.clubCurrentFilterToSave2) !== this.clubCurrentFilterString2) return true;
      if (this.clubCurrentFilterToSave3 && JSON.stringify(this.clubCurrentFilterToSave3) !== this.clubCurrentFilterString3) return true;
      if (this.clubCurrentCriteriaNameString !== JSON.stringify(this.clubReqsGroupModel.name)) return true;
      return false;
    },
    clubDayNeedSave() {
      if (this.mode !== 'clubs') return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (this.clubFirstLoading) return false;
      if (this.clubDayCurrentTracksetStrig !== JSON.stringify(this.clubDaySelectedObj.tracksetGroups)) return true;
      if (this.clubDayCurrentReqStrig !== JSON.stringify(this.clubDaySelectedObj.criterias)) return true;
      return false;
    },
    clubArrayClubDays() {
      let result = [];
      Object.keys(this.clubDays).map(key => {
        result.push(this.clubDays[key]);
      })
      result.sort(function(a, b) {
        return a.date.localeCompare(b.date);
      })
      return result;
    },
    clubShowSaveOriginalOrder() {
      if (this.mode !== 'clubs') return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (this.clubFirstLoading) return false;
      let arr = JSON.parse(this.clubCurrentTracksetString);
      let isValid = Array.isArray(arr) && Array.isArray(arr[0]) && arr[0].length > 0;
      if (!isValid) return false;
      if (this.clubCurrentTracksetString !== JSON.stringify(this.clubTracksGroupModel.trackset)) return true;
      return false;
    },
    clubHasOriginalOrder() {
      if (this.mode !== 'clubs') return false;
      if (this.clubFirstLoading) return false;
      if (!this.clubTracksGroupModel.tracksetOriginal) return false;
      let arr = this.clubTracksGroupModel.tracksetOriginal;
      let isValid = Array.isArray(arr) && Array.isArray(arr[0]) && arr[0].length > 0;
      if (isValid) return true;
    },
    eventFilterConfig() {
      if (this.whatTier && this.whatTier <= 3) {
        return {
          topSpeed: false,
          acel: false,
          hand: false,
          weight: false,
          tunes: true
        };
      }

      return {
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        rq: false,
        year: false,
        tyres: false,
        drives: false,
        clearances: false,
        countrys: false,
        seats: false,
        prizes: false,
        bodyTypes: false,
        fuel: false,
        engine: false,
        tags: false,
        brands: false
      }
    },
    showPointsCg() {
      return this.showPoints || this.$store.state.showPointsCgForce;
    },
    whatTier() {
      let result = 0;
      if (!this.user) return 0;
      if (this.user.tier) result = this.user.tier;
      if (this.mode === "clubs" && this.user.mod && (result > 3 || result === 0)) {
        result = 3;
        // this.$store.commit("START_LOGROCKET", {});
      }
      return result;
    },
    // cgPermanentToggle: {
    //   get: function () {
    //     return this.cgLocalShowPermanentCgs;
    //   },
    //   set: function (newValue) {
    //     this.cgLocalShowPermanentCgs = newValue;
    //     window.localStorage.setItem('cgLocalShowPermanentCgs', newValue);
    //     this.$store.commit("CHANGE_PERMANENT_CGS", newValue);
    //   }
    // },
    // cgLongToggle: {
    //   get: function () {
    //     return this.cgLocalShowLongCgs;
    //   },
    //   set: function (newValue) {
    //     this.cgLocalShowLongCgs = newValue;
    //     window.localStorage.setItem('cgLocalShowLongCgs', newValue);
    //     this.$store.commit("CHANGE_LONG_CGS", newValue);
    //   }
    // },
    eventBestTeamSameAsBefore() {
      if (!this.eventBestTeamsLastCache) return false;
      if (JSON.stringify( {...this.eventBestTeamsTarget, ...this.eventBestTeamsConfig} ) === this.eventBestTeamsLastCache) return true;
      return false;
    }
  },
  methods: {
    pushTrackSet(trackset) {
      let index;
      trackset.map(x => {
        index = this.indexOfTrack(x);
        if (index === -1) {
          this.currentTracks.push(...this.validateTracks([x]))
        }
      })
      this.verifyActiveButtons();
    },
    removeTrackSet(trackset) {
      let index;
      trackset.map(x => {
        index = this.indexOfTrack(x);
        if (index > -1) {
          this.currentTracks.splice(index, 1);
        }
      })
      this.verifyActiveButtons();
    },
    pushTrack(track, group = false) {
      let index = this.indexOfTrack(track);
      if (index === -1 && !group) {
        this.currentTracks.push(...this.validateTracks([track]))
      } else if (group) {
        this.validateTracks([track], group)
      }
    },
    removeTrack(track, group = false) {
      let index = this.indexOfTrack(track);
      if (index > -1 && !group) {
        this.currentTracks.splice(index, 1);
      } else if (group) {
        this.validateTracks([track], group)
      }
    },
    clickTracksetHandle(e, item) {
      if (
        e.target &&
        typeof e.target.className === "string" &&
        e.target.className.startsWith("BaseTrackType_Button")
      ) {
        let itype = e.target.attributes.getNamedItem("dataitype").value;
        this.toggleTrackSet(item.list[itype].tracks);
      }
    },
    toggleTrackSet(trackset) {
      let incluedesAll = this.includeAllTracks(trackset);
      
      if (incluedesAll && this.currentTracks.length >= trackset.length) {
        this.removeTrackSet(trackset);
      } else {
        this.removeTrackSet(trackset);
        this.pushTrackSet(trackset);
      }
    },
    toggleTrack(track, e = {}) {
      if (this.mode === 'challenges') {
        Vue.set(this.cgRound.races[this.cgRaceSelected], "track", track);
        this.resolveTrack(this.cgRound.races[this.cgRaceSelected]);
        this.closeDialogTrackSearch();
        this.cgRoundToSave.push({
          type: "track",
          track: track,
          raceIndex: this.cgRaceSelected
        })
        return;
      }
      if (this.mode === 'events') {
        Vue.set(this.event.trackset[this.eventTracksetSelected], this.eventRaceSelected, track);
        this.eventResolveTrackset()
        this.closeDialogTrackSearch();
        return;
      }
      if (this.mode === 'clubs') {
        Vue.set(this.clubTracksGroupModel.trackset[this.eventTracksetSelected], this.eventRaceSelected, track);
        this.clubsResolveTrackGroup()
        this.closeDialogTrackSearch();
        return;
      }
      if (this.kingAddindTrack) {
        this.kingAddindTrack = false;
        this.kingTrack = track;
        this.kingTrack = this.resolveTrack({ track }, false, false)
        this.closeDialogTrackSearch();
        if (this.kingFixed) this.kingAnalyse();
        return;
      }

      let index = this.currentTracks.findIndex(y => {
        if (track === `${y.id}_a${y.surface}${y.cond}`) {
          return true
        }
      });
      
      if (index === -1) {
        this.pushTrack(track, (e.ctrlKey || e.metaKey));
      } else {
        this.removeTrack(track, (e.ctrlKey || e.metaKey));
      }      
      this.verifyActiveButtons();
    },
    stringToggleTrackSet(str) {
      this.toggleTrackSet(this[str])
    },    
    validateTracks(tracks, group = false) {
      let tracksClear = [];
      let groupName;
      let groupType;
      let tracksetGroup = [];

      tracks.map(x => {
        this.tracksRepo.find(circuit => {
          if (x.slice(0,-4) !== circuit.id) return false;
          return circuit.types.find(type => {
            if (x === `${circuit.id}_a${type}`) {
              if (group && circuit.group) {
                groupName = circuit.group;
                groupType = type;
              } else {
                tracksClear.push( { name: circuit.name, id: circuit.id, surface: type[0], cond: type[1], code: `${circuit.id}_a${type}` } );
              }
              return true;
            }
          })
        })
      })
      if (!group) {
        return tracksClear;
      } else {
        // repeat
        this.tracksRepo.map(circuit => {
          if (groupName === circuit.group && circuit.types.includes(groupType)) {
            tracksetGroup.push(`${circuit.id}_a${groupType}`)
          }
        })
        this.toggleTrackSet(tracksetGroup);
      }
    },
    moreTracksCar(tracksIds) {
      tracksIds = this.orderTracksIds(tracksIds);
      
      tracksIds.map(x => {
        this.toggleTrack(x);
      })
    },
    orderTracksIds(tracksIds) {
      let typeOrder = ["00", "01", "c1", "10", "11", "40", "41", "20", "b0", "30", "g0", "50", "e0", "c0", "60", "d0", "h0", "h1", "70", "71"]
      let forPush = [];

      tracksIds.map(x => {
        this.tracksRepo.find((circuit, icir) => {
          return circuit.types.find((type, itype) => {
            if ( `${circuit.id}_a${type}` === x ) {
              forPush.push({
                icir,
                itype: typeOrder.indexOf(type),
                code: x
              });
              return true;
            }
          })
        })
      })

      forPush.sort(function(a, b) {
        if (a.itype === b.itype) {
          return a.icir - b.icir
        } else {
          return a.itype - b.itype
        }
      })

      return forPush.map(x => x.code);
    },
    indexOfTrack(x) {
      return this.currentTracks.findIndex(y => {
        if (x === `${y.id}_a${y.surface}${y.cond}`) {
          return true
        }
      });
    },
    includeAllTracks(trackset) {
      let incluedesAll = true;
      let index;
      if (!trackset) return false;
      trackset.map(x => {
        index = this.currentTracks.findIndex(y => {
          if (x === `${y.id}_a${y.surface}${y.cond}`) {
            return true
          }
        });
        if (index === -1) incluedesAll = false;
      })
      return incluedesAll;
    },
    clearAllTracks() {
      this.currentTracks = [];
      this.verifyActiveButtons();
    },
    clearAllCars() {
      this.carDetailsList = [];
      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
      })
      this.updateCarLocalStorage();
    },
    pushCpSuggest(obj) {
      if (obj.e && (obj.e.ctrlKey || obj.e.metaKey)) {
        this.clearAllTracks();
      }
      this.toggleTrackSet(obj.list.map(x => x.code));
    },
    verifyActiveButtons() {
      this.tracksButtons.map(group => {
        group.list.map(x => {
          if (this.includeAllTracks(x.tracks)) {
            x.active = true;
          } else {
            x.active = false;
          }
        })

      })

      this.tracksRepo.map(circuit => {
        circuit.types.find(type => {

          let index = this.currentTracks.findIndex(y => {
            if (`${circuit.id}_a${type}` === `${y.id}_a${y.surface}${y.cond}`) {
              return true;
            }
          });


          if (index === -1) {
            Vue.set(circuit, type, false);
          } else {
            Vue.set(circuit, type, true);
          }

        })
      })

      let currentCodes = this.currentTracks.map(x => `${x.id}_a${x.surface}${x.cond}`);

      // list all options
      let currentTracksOptions = [];
      this.currentTracks.map((x, ix) => {
        let options = [];
        let tcode = `${x.id}_a${x.surface}${x.cond}`
        this.campaign.map((city, icity) => {
          city.matches.map((match, imatch) => {
            match.races.map((race, irace) => {
              if (race.name === tcode) {
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
      this.currentTracks.map((x, ix) => {
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
          x.campaign = `${bestOption.city} ${bestOption.imatch+1}`;
          if (!this.isChamp(bestOption.city)) {
            x.campaignNum = bestOption.irace+1;
          }
        } else {
          x.campaign = `Not in campaign`;
        }
      })

      // smart guide
      let matchesScore = [];
      this.campaign.map((city, icity) => {
        if (city.name.startsWith("SN") || city.name.startsWith("YB")) return;
        city.matches.map((match, imatch) => {
          let includes = [];
          let indexSum = 0;
          match.races.map((race, irace) => {
            if (currentCodes.includes(race.name)) {
              includes.push(race.name)
              indexSum += irace
            }
          })
          matchesScore.push({
            name: city.name,
            icity,
            imatch,
            indexSum,
            includes
          })
        })
      })


      // // 
      // // 
      // // test campaign obj
      // let campaignTracksOutOfDefault = [];
      // this.campaign.map((city, icity) => {
      //   if (city.name.startsWith("YB") || city.name.startsWith("SN") || city.name === "Challenge Leagues" || city.name === "Daily Challenge") {
      //     return;
      //   }
      //   city.matches.map((match, imatch) => {
      //     match.races.map((race, irace) => {

      //       let found = this.tracksButtons.find(group => {
      //         return group.list.find(list => {
      //           return list.tracks.find(track => {
      //             return track === race.name
      //           })
      //         })
      //       })
      //       if (!found) campaignTracksOutOfDefault.push(race.name);

      //     })
      //   })
      // })
      // campaignTracksOutOfDefault = [...new Set(campaignTracksOutOfDefault)];
      // console.log("campaignTracksOutOfDefault", campaignTracksOutOfDefault);

      // let defaultTracksOutOfCampaign = [];
      // this.tracksButtons.map(group => {
      //   group.list.map(list => {
      //     list.tracks.map(track => {
      //       let found = false;

      //       this.campaign.map((city, icity) => {
      //         if (city.name.startsWith("YB") || city.name.startsWith("SN") || city.name === "Challenge Leagues" || city.name === "Daily Challenge") {
      //           return;
      //         }
      //         city.matches.map((match, imatch) => {
      //           match.races.map((race, irace) => {
      //             if (race.name === track) {
      //               found = true;
      //             }
      //           })
      //         })
      //       })

      //       if (!found) defaultTracksOutOfCampaign.push(track);

      //     })
      //   })
      // })
      // defaultTracksOutOfCampaign = [...new Set(defaultTracksOutOfCampaign)];
      // console.log("defaultTracksOutOfCampaign", defaultTracksOutOfCampaign);

      // debugger;
      // // 
      // // 
      // // 


      matchesScore.sort(function(a, b) {
        if (b.includes.length !== a.includes.length) {
          return b.includes.length - a.includes.length;
        } else {
          return a.indexSum - b.indexSum;
        }
      });

      let currentCodes2 = JSON.parse(JSON.stringify(currentCodes));
      let clearMatches = [];
      matchesScore.map((x, ix) => {
        if (currentCodes2.length > 0);
        let found = x.includes.find(y => {
          if (currentCodes2.includes(y)) {
            return true;
          }
        })
        if (found) {
          clearMatches.push(x);
          x.includes.map (y => {
            currentCodes2 = currentCodes2.filter(z => z !== y);
          })
        }
      })

      // console.log(clearMatches);
      this.smartCampaign = clearMatches;

      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
      })

    },
    updateOptions() {
      this.optionsDialogActive = false;
      window.localStorage.setItem('tracks', JSON.stringify(this.currentTracks));
    },
    toggleSize() {
      this.inverted = !this.inverted;
      return
      if (this.carDetailsList.length > 2) {
        this.carDetailsList = this.carDetailsList.filter((x, ix) => ix < 2)
      } else {
        Array.from(Array(10)).map((_, i) => {
          this.carDetailsList.push(this.carDetailsList[1]);
        });
      }
    },
    deleteCar(index) {
      if (this.mode === 'challenges') {
        // only via dialog
        if (this.tuneDialogisOppo) {
          this.tuneDialogRace.car = undefined;
          this.tuneDialogRace.rid = undefined;
          this.calcRaceResult(this.tuneDialogRace);
        } else {
          this.tuneDialogRace.carIndex = undefined;
        }
        this.tuneDialogActive = false;
        this.showCarsFix = false;
        this.$nextTick().then(() => {
          this.showCarsFix = true;
        })
        return;
      }
      this.isReviewing = false;
      let carToDel = this.carDetailsList.find((x, ix) => ix === index);
      if (carToDel.dataToSave) {
        // propt before?
      }

      this.carDetailsList = this.carDetailsList.filter((x, ix) => ix !== index);

      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
      })
      this.updateCarLocalStorage();
      this.tuneDialogActive = false;
    },
    openDialogTrackSearch(backToOptions = true, type) {
      this.customTrackDialog = true;
      this.optionsDialogActive = false;
      this.backToOptionsDialog = backToOptions;
      if (type === 'king') this.kingAddindTrack = true;
      setTimeout(() => {
        try {
          document.querySelector("#SearchTrackInput").focus();  
        } catch (error) {}
      }, 10);
    },
    closeDialogTrackSearch() {
      this.kingAddindTrack = false;
      this.customTrackDialog = false;
      if (this.backToOptionsDialog) this.openMainDialog();
      this.updateOptions();
    },
    closeTune() {
      if (this.isReviewing) return;
      this.tuneDialogActive = false;
      this.mraEditing = false;
      this.mraEditInput = null;
      // this.$store.commit("SHOW_TUNE", false);
      
    },
    addCar(newCar) {
      if (this.carDetailsList.length < this.maxCarNumber) {
        this.carDetailsList.push(newCar);
        this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
        this.nextId++;
        // console.log(this.carDetailsList.map(x => x.softId));

        if (this.carDetailsList.length >= this.maxCarNumber) {
          this.searchFilterDialog = false;
        }

        this.showCarsFix = false;
        this.$nextTick().then(() => {
          this.showCarsFix = true;
        })

        this.updateCarLocalStorage();
        this.downloadCar(this.carDetailsList[this.carDetailsList.length - 1].rid);
      }
    },
    addCarCg(newCar, isFromJson = false) {
      let race = this.cgRound.races[this.cgRaceSelected];
      this.cgFilterDialog = false;

      let found = Vue.all_cacheObj[newCar.rid];
      if (!found) {
        if (isFromJson) console.log(`!found`);
        Vue.all_cacheObj[newCar.rid] = { rid: newCar.rid };
      }

      if (this.cgAddingOppoCar) {
        // adding oppo
        Vue.set(race, "rid", newCar.rid);
        Vue.set(race, "car", newCar);
        if (isFromJson) console.log(`this.cgAddingOppoCar`);
      } else if (this.cgAddingYouCar) {
        let found = race.cars.findIndex(x => x.rid === (race.cars[race.carIndex] || {}).rid && x.tune === undefined);
        if (found > -1) {
          race.carIndex = found;
          if (isFromJson) console.log(`race.carIndex ${race.carIndex} ${(race.cars[race.carIndex] || {}).rid}`);
        } else {
          if (isFromJson) console.log(`found`);
          race.cars.push( { rid: newCar.rid } );
          race.carIndex = race.cars.length-1;
          Vue.set(race.cars[race.carIndex], "photo", Vue.carPhoto(newCar));
          Vue.set(race.cars[race.carIndex], "car", JSON.parse(JSON.stringify(newCar)));
          Vue.set(race.cars[race.carIndex], "color", Vue.resolveClass(race.cars[race.carIndex].car.rq, race.cars[race.carIndex].car.class, "color"));
          if (isFromJson) console.log(race.cars[race.carIndex]);
        }
      }
      if (!isFromJson || !found) {
        this.downloadCar(newCar.rid, true);
      }
      this.cgSaveRoundHand();
    },
    // toggleTrack(set) {
    //   let index = this.activeTrackSet.indexOf(set);

    //   if (index > -1) {
    //     this.activeTrackSet.splice(index, 1);
    //   } else {
    //     this.activeTrackSet.push(set);
    //   }
    // },
    display(type, save = true) {
      if (type === "vertical") {
        this.inverted = true;
        this.compact = false;
      }
      if (type === "horizontal") {
        this.inverted = false;
        this.compact = false;
      }
      if (type === "horizontal2") {
        this.inverted = false;
        this.compact = true;
      }
      if (save) {
        window.localStorage.setItem('display', type);
      }
    },
    colorsChange(type, save = true) {
      if (type === "medals") {
        this.fullColors = false;
      }
      if (type === "full") {
        this.fullColors = true;
      }
      if (save) {
        window.localStorage.setItem('colors', type);
      }
    },
    changeMode(mode, save = true) {
      this.optionsDialogActive = false;
      this.kingDialog = false;
      this.kingFixed = false;
      this.showPoints = false;

      setTimeout(() => {
        this.mode = mode;
        if (save) {
          window.localStorage.setItem('mode', mode);
        }
        // this.changedMode();
      }, 100);
    },
    changedMode() {
      if (this.mode === "compare" && this.currentTracks.length === 0) {
        // from local storage
        let tracks = window.localStorage.getItem("tracks");
        if (tracks) {
          tracks = JSON.parse(tracks);
          if (typeof tracks === 'object') {
            tracks = tracks.map(x => `${x.id}_a${x.surface}${x.cond}`)
          }
          this.pushTrackSet(tracks);
        }
        if (this.currentTracks.length === 0) {
          this.pushTrackSet(this.tracksButtons[0].list[0].tracks);
        }

        let cars = window.localStorage.getItem("cars");
        if (cars) {
          this.prepareCars(JSON.parse(cars));
        }

      }
      if (this.mode === "compare") {
        this.searchFilterDialog = false;
      }

      if (this.mode === "challenges") {
        if (this.cgList.length === 0) {
          this.loadChallenges();
        }
      }
      if (this.mode === "events") {
        if (this.eventList.length === 0) {
          this.loadEvents();
        }
        this.resetBestTeamsConfig();
      }
      if (this.mode === "clubs") {
        if (this.clubTracksGroups.length === 0) {
          this.loadClubs();
        }
        this.resetBestTeamsConfig();
      }
    },
    newIndex(obj, isDialog = false, isTrack = false) {
      obj.current;
      obj.new;
      // this.closeTune();
      let arrName = "carDetailsList";
      if (isTrack) arrName = "currentTracks";
      
      // If actual index of moved element is
      // less than 0 when 'moveEle += array size'
      while (obj.current < 0)
      {
          obj.current += this[arrName].length;
      }

      // Where the element to be moved f that
      // index is less than 0 when
      // 'obj.new += array size'
      while (obj.new < 0)
      {
          obj.new = 0;
      }

      // If 'obj.new' is greater than the
      // size of the array then with need to
      // push 'undefined' in the array.
      if (obj.new > this[arrName].length)
      {
          obj.new = this[arrName].length;
          // var un = obj.new - this[arrName].length + 1;
          // while (un--)
          // {
          //     this[arrName].push(undefined);

          // }
      }

      // Here element of 'obj.current' is removed and
      // pushed at 'obj.new' index
      this[arrName].splice(obj.new, 0, this[arrName].splice(obj.current, 1)[0]);
      if (isDialog) {
        this.tuneDialogCarIndex = obj.new;

        let width = Number(getComputedStyle(document.body).getPropertyValue("--cell-width").trim().slice(0,-2));
        if (this.compact) width = Number(getComputedStyle(document.querySelector(".Main_Compact")).getPropertyValue("--cell-width").trim().slice(0,-2));
        let height = 0;
        if (this.inverted) height = Number(getComputedStyle(document.querySelector(".Main_2")).getPropertyValue("--cell-height").trim().slice(0,-2));
        let dragN = obj.new < obj.current ? -1 : 1;
        let indexDiff = (obj.current + dragN) - obj.current;

        obj.pos = { dragLeft: 0, dragTop: 0 };
        obj.posOther = { dragLeft: 0, dragTop: 0 };
        if (this.inverted) {
          obj.pos.dragTop = (height * indexDiff * -1)
          obj.posOther.dragTop = (height * indexDiff * 1)
        } else {
          obj.pos.dragLeft = (width * indexDiff * -1)
          obj.posOther.dragLeft = (width * indexDiff * 1)
        }
      }
      
      this.updateCarLocalStorage();
      this.updateOptions();

      

      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;

        if (obj.pos) {
          this.$nextTick().then(() => {
            let elmnt = document.querySelector('#Car_Layout'+obj.new);
            let elmntOther = document.querySelector('#Car_Layout'+obj.current);
            if (elmnt) {
              elmnt.style.setProperty("--drag-left", obj.pos.dragLeft );
              elmnt.style.setProperty("--drag-top", obj.pos.dragTop );
              if (obj.posOther) {
                elmntOther.style.setProperty("--drag-left", obj.posOther.dragLeft );
                elmntOther.style.setProperty("--drag-top", obj.posOther.dragTop );
              }
              setTimeout(() => {
                  elmnt.style.setProperty("--drag-left", 0 );
                  elmnt.style.setProperty("--drag-top", 0 );
                  if (obj.posOther) {
                    elmntOther.style.setProperty("--drag-left", 0 );
                    elmntOther.style.setProperty("--drag-top", 0 );
                  }
              }, 1);
              // this.$nextTick().then(() => {
              //   elmnt.style.setProperty("--drag-left", 0 );
              //   elmnt.style.setProperty("--drag-top", 0 );
              // })
            }
          })
        }
      })
    },
    getStatistics() {
      this.statisticsLoading = true;

      axios.get(Vue.preUrl + "/statistics")
      .then(res => {
        this.statistics = {
          ...this.statistics,
          ...res.data
        };

        axios.get(Vue.preUrlCharlie + "/statisticsC")
        .then(res => {
          this.statisticsLoading = false;
          this.statistics = {
            ...this.statistics,
            ...res.data
          };
        })
        .catch(error => {
          this.statisticsLoading = false;
          console.log(error);
        });


      })
      .catch(error => {
        this.statisticsLoading = false;
        console.log(error);
      });
    },
    getLastest() {
      this.lastestLoading = true;

      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;
        
        this.highlightsUsers = Vue.resolveHighlightsUsers(res.data);

        this.lastestList = res.data.find(x => x.id === 'lastestcars').value;

        // let incomingCars = res.data.find(x => x.id === 'newCars').value;
        // if (incomingCars && incomingCars.length > 0) {
        //   let rids = Vue.all_carsArr.map(x => x.rid);

        //   incomingCars.map(car => {
        //     if (!!(car.photoId && car.rq && car.onlyName && car.brand && car.country && car.year && car.clearance && car.topSpeed && car.hand && car.drive && car.tyres && car.weight && car.tags && car.bodyTypes && car.fuel && car.seats && car.engine)) {
        //       if (!rids.includes(car.rid)) {
        //         this.all_cars.push(car);
        //       }
        //     }
        //   })

        //   // this.all_cars = this.all_cars.filter((value, index, self) =>
        //   //   index === self.findIndex((t) => (
        //   //     t.rid === value.rid
        //   //   ))
        //   // )
        //   this.all_cars.sort((a,b) => {
        //     return b.rq - a.rq;
        //   })

        //   this.recheckCarDetailsList();
        // }

        let mraData = res.data.find(x => x.id === 'mra').value;
        Vue.all_carsArr.map(x => {
          Vue.set(x, "mra", mraData[x.rid] || x.mra);
        })
        this.carDetailsList.map(x => {
          Vue.set(x, "mra", mraData[x.rid] || x.mra);
        })



      })
      .catch(error => {
        this.lastestLoading = false;
        console.log(error);
      });

    },
    updateCarLocalStorage() {
      let toSave = this.carDetailsList.map(x => { 
        return {
          rid: x.rid,
          selectedTune: x.selectedTune
        }
      })

      window.localStorage.setItem('cars', JSON.stringify(toSave));
    },
    prepareCars(cars) {
      let result = [];
      if (cars && cars.length > 0) {
        
        cars.map(y => {
          // let found = Vue.all_carsArr.find(x => {
          //   if (x.rid === y.rid) {
          //     result.push(JSON.parse(JSON.stringify(x)));
          //     if (y.selectedTune) result[result.length-1].selectedTune = y.selectedTune;
          //     result[result.length-1].softId = this.nextId;
          //     this.nextId++;
          //     return true;
          //   }
          // })
          let found = Vue.all_carsObj[y.rid];
          if (found) {
            result.push(JSON.parse(JSON.stringify(found)));
            if (y.selectedTune) result[result.length-1].selectedTune = y.selectedTune;
            result[result.length-1].softId = this.nextId;
            this.nextId++;
          } else {
            result.push({
              rid: y.rid,
              selectedTune: y.selectedTune,
              class: "?",
              rq: null,
              onlyName: "",
              brand: "",
              year: null,
              abs: true,
              tcs: true,
              clearance: null,
              country: null,
              topSpeed: null,
              acel: null,
              hand: null,
              drive: null,
              tyres: null,
              mra: null,
              weight: 1000,
              name: "",
              tags: [],
              prize: false,
              bodyTypes: [],
              fuel: "Petrol",
              seats: "1",
              engine: "Mid",
              brake: null
            });
            result[result.length-1].softId = this.nextId;
            this.nextId++;
          }
        })
        
      }
      Vue.set(this, "carDetailsList", result);
      this.downloadDataCars(true);
    },
    recheckCarDetailsList() {
      this.carDetailsList.map((car, index) => {
        if (car.clearance === null) {
          let found = Vue.all_carsObj[car.rid];
          Vue.set(this.carDetailsList, index, {
            ...car,
            ...(JSON.parse(JSON.stringify(found)))
          })
        }
      })
      if (this.carDetailsList.length > 0) {
        this.showCarsFix = false;
        this.$nextTick().then(() => {
          this.showCarsFix = true;
        })
      }
    },
    saveAll(saveBankAfter = false) {
      this.saveLoading = true;


      let simplifiedCars = [];
      if (this.mode === 'challenges') {
        Object.keys(Vue.all_cacheObj).map(rid => {
          if (Vue.all_cacheObj[rid].dataToSave) {
            simplifiedCars.push({
              rid: rid,
              data: Vue.all_cacheObj[rid].dataToSave
            });
          }
        })
      } else {
        this.carDetailsList.map(x => {
          if (x.dataToSave) {
            simplifiedCars.push({
              rid: x.rid,
              data: x.dataToSave
            });
          }
        });

      };

      if (simplifiedCars.length === 0) {
        if (saveBankAfter) {
          this.cgSaveBank();
        }
        this.saveLoading = false;
        return;
      };

      axios.post(Vue.preUrl + "/update", simplifiedCars)
      .then(res => {
        this.needSaveChange(false);
        this.clearDataToSave();
        if (this.mode === 'compare') {
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: this.$t('m_saveSuccess')
          });
        }
        if (saveBankAfter) {
          this.cgSaveBank();
        }
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.saveLoading = false;
      });

    },
    saveImport() {
      this.saveLoading = true;
      let simplifiedCars = [];
      
      simplifiedCars.push({
        rid: this.carDetailsList[0].rid,
        data: this.carDetailsList[0].data
      });

      simplifiedCars = JSON.parse(JSON.stringify(simplifiedCars));
      Object.keys( simplifiedCars[0].data[Object.keys( simplifiedCars[0].data )[0]].times ).forEach(function (track) {
        
        if (track.substr(track.length -4, 2) !== "_a" ) {
          delete simplifiedCars[0].data[Object.keys( simplifiedCars[0].data )[0]].times[track];
        }

      })


      axios.post(Vue.preUrl + "/import", simplifiedCars)
      .then(res => {
        this.needSaveChange(false);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
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
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.saveLoading = false;
      });

    },
    downloadDataCars(forceClassic = false) {
      this.downloadLoading = true;
      let simplifiedCars = [];
      let origMode = this.mode;

      if (this.mode === 'compare' || forceClassic) {
        this.carDetailsList.map(x => {
          simplifiedCars.push({ rid: x.rid })
        });
      } else if (this.mode === 'challenges') {
        Object.keys(Vue.all_cacheObj).map(rid => {
          if (Vue.all_cacheObj[rid].rid && !Vue.all_cacheObj[rid].data) {
            simplifiedCars.push({ rid: rid })
          }
        })
      }

      if (simplifiedCars.length === 0) {
        this.downloadLoading = false;
        this.checkAnnouncement();
        if (this.mode === 'challenges') {
          setTimeout(() => {
            this.cgResolveRqFill();
          }, 100);
        }
        return;
      }

      let url = Vue.preUrl + "/cars";
      url = this.finalizeUrl(url); 

      axios.post(url, simplifiedCars)
      .then(res => {        
        this.applyNewData(res.data, this.mode === 'challenges', origMode);
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
        this.downloadLoading = false;
        this.checkAnnouncement();
      });
    },
    downloadCar(rid, isJson = false) {
      this.downloadLoading = true;
      let origMode = this.mode;

      let url = Vue.preUrl + "/car/" + rid;
      url = this.finalizeUrl(url);
      if (isJson) {
        this.cgJsonDownloadRids.push(rid);
      }

      axios.get(url)
      .then(res => {
        if (isJson) {
          this.cgJsonDownloadRids = this.cgJsonDownloadRids.filter(x => x !== rid);
        }
        if (this.mode === 'compare') {
          if (
              res.data === "" ||
              !res.data.data ||
              (!res.data.data["233"] && !res.data.data["323"] && !res.data.data["332"] && !res.data.data["111"]) ||
              (
                (!res.data.data["233"] || !res.data.data["233"].times) &&
                (!res.data.data["323"] || !res.data.data["323"].times) &&
                (!res.data.data["332"] || !res.data.data["332"].times) &&
                (!res.data.data["111"] || !res.data.data["111"].times)
              )
          ) {
            let car = this.carDetailsList.find(x => {
              return x.rid === rid
            });
            Vue.set(car, "isEmpty", true);
            if (res && res.data) {
              this.applyNewData([res.data], false, origMode);
            }
          } else {
            this.applyNewData([res.data], false, origMode);
          }
        } else {
          this.applyNewData([res.data], false, origMode);
        }
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
        this.downloadLoading = false;
      });
    },
    applyNewData(newData, isCgInitial = false, origMode) {
      if (origMode === 'challenges') {
        newData.map(y => {
          if (y.data) Vue.set(Vue.all_cacheObj[y.rid], "data", y.data);
          if (y.users) Vue.set(Vue.all_cacheObj[y.rid], "users", y.users);
          if (y.reviews) Vue.set(Vue.all_cacheObj[y.rid], "reviews", y.reviews);
        })
      } else {
        this.carDetailsList.map(x => {
          newData.map(y => {
            if (x.rid === y.rid) {
              if (y.data && !x.data) Vue.set(x, "data", y.data);
              if (y.data && x.data) Vue.set(x, "data", window._merge(x.data, y.data));
              if (y.users) Vue.set(x, "users", y.users);
              if (y.reviews) Vue.set(x, "reviews", y.reviews);
            }
          })
        });
      }


      if (this.mode === 'challenges' && this.cgRound.date) {
        this.downloadLoading = false;
        this.cgRound.races.map(race => {
          this.calcRaceResult(race, isCgInitial);
        })
      }
    },
    sharePrint() {
      this.tempWindowWidth = this.windowWidth;
      this.windowWidth = 1300;
      this.pngLoading = true;
      window.scrollTo({ top: 0 });
      let vm = this;
      let _width;
      let _height;
      let c_container = document.querySelector('#App_PrintContainer');
      let currentCanvas = document.querySelector('#printCanvas');

      let boxName = ".Main_Body";
      if (this.mode === 'challenges' || this.mode === 'events' || this.mode === 'clubs') boxName = ".Cg_Layout";

      document.querySelector(".App_Layout").classList.add("App_isPrinting");
      let pose = document.querySelector(boxName);
      pose.classList.add("Main_BodyPrint");

      if (this.mode === 'compare') {
        c_container.classList.add("App_PrintContainerShow");
        let mainLayout = document.querySelector(".Main_Layout");
        let reduceWidth = 0;
        let reduceHeight = 0;
        let carlistContainer = document.querySelector(".Main_CarList");
        let credits = document.querySelector(".Main_PrintCreditsBottom");
        let backTopContainer = document.querySelector(".Main_Backtop");
        if (!mainLayout.classList.contains("Main_2")) {
          reduceHeight = pose.clientHeight - carlistContainer.clientHeight - credits.clientHeight;
        } else {
          reduceHeight = pose.clientHeight - backTopContainer.clientHeight - carlistContainer.clientHeight - credits.clientHeight;
        }
        _width = (pose.clientWidth - reduceWidth) * 1.3;
        _height = (pose.clientHeight - reduceHeight) * 1.3;

      } else if (this.mode === 'challenges') {
        _width = (pose.clientWidth) * 1.3;
        _height = (pose.clientHeight) * 1.3;
      } else if (this.mode === 'events' || this.mode === 'clubs') {
        let reduceHeight = 0;
        let box1 = document.querySelector(".Cg_Header");
        let box2;
        if (this.mode === 'events') box2 = document.querySelector(".Cg_Mid");
        if (this.mode === 'clubs') box2 = document.querySelector(".Clubs_Mid");
        reduceHeight = pose.clientHeight - box1.clientHeight - box2.clientHeight;
        _width = (pose.clientWidth) * 1.3;
        _height = (pose.clientHeight - reduceHeight) * 1.3;
      }
      
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

      setTimeout(() => {
        this.runSharePrint(pose, options, c_container, currentCanvas, boxName);
      }, 10);
      
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
      window.ReImg.fromCanvas(currentCanvas).downloadPng(`TDR_${new Date().toISOString().slice(0,-5)}.png`)

      c_container.classList.remove("App_PrintContainerShow");
      document.querySelector(".App_Layout").classList.remove("App_isPrinting");
      document.querySelector(boxName).classList.remove("Main_BodyPrint");
      this.windowWidth = this.tempWindowWidth;
      this.pngLoading = false;
    },
    generateUrl(isForTemplate = false) {
      let result = `${window.location.origin}?`;
      if (isForTemplate) result = '';

      if (this.mode === 'compare') {
        result += `share=`;
        this.currentTracks.map(x => {
          result += `~K${x.id}_a${x.surface}${x.cond}`
        });
        this.carDetailsList.map(x => {
          result += `~C${x.rid}${x.selectedTune ? '~T'+x.selectedTune : '' }`
        });
      } else if (this.mode === 'challenges') {
        result += `cg=`;
        result += `~G${this.cg.date}~R${this.cgCurrentRound+1}`
      } else if (this.mode === 'events') {
        result += `event=`;
        result += `~G${this.eventCurrentId}`
      } else if (this.mode === 'clubs') {
        result += `clubs`;
      }

      if (result.length > 2045) {
        // não dá
      }

      if (isForTemplate) {
        return result
      } else {
        this.shareUrl = result.replaceAll("+", "%2B").replaceAll("&", "%26");
      }

    },
    copyUrl() {
      var copyText = document.getElementById("shareLinkField");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      navigator.clipboard.writeText(copyText.value);
      this.copyUrlSucess = true;
      setTimeout(() => { this.copyUrlSucess = false}, 1500);
    },
    generateCarsList() {
      let result = "";
      let list = [];
      this.carDetailsList.map(x => {
        list.push(`RQ${x.rq} ${x.name}`)
      });
      list = [...new Set(list)];

      this.shareListCars = list.join("\n");
    },
    copyList() {
      var copyText = document.getElementById("shareListField");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      navigator.clipboard.writeText(copyText.value);
      this.copyListSucess = true;
      setTimeout(() => { this.copyListSucess = false}, 1500);
    },
    decodeTemplateString(template, pushToWork = false) {

      let decoded = Vue.decodeTdr(template)

      let carsFromQuery = decoded.cars;
      let tracksFromQuery = decoded.tracks;

      if (this.$route.query && this.$route.query.share) {
        this.$router.replace({'query': null});
      }

      if (pushToWork) {
        if (tracksFromQuery.length > 0) {
          this.clearAllTracks()
          this.pushTrackSet(tracksFromQuery);
        }
        this.prepareCars(carsFromQuery);
        this.updateOptions();
        this.updateCarLocalStorage();

      }

      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
      });

    },
    finalizeUrl(url) {
      let auth = window.localStorage.getItem("auth");
      let dt = window.localStorage.getItem("_dt");
      
      if (dt) {
        dt = Number(dt) + (60*60*1000) > new Date().getTime()
      }
      if (auth || dt) {
        return url + `?auth=${auth || new Date().getTime()}`
      } else {
        return url;
      }
    },
    needSaveChange(val) {
      this.needSave = val;

      if (val) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
      this.$store.commit('BEFOREUNLOAD_TOUCH');
    },
    outsideClick() {
      this.$store.commit("HIDE_DETAIL");
      if (this.mode !== "events") {
        this.showPoints = false;
      }
    },
    resolveChangeTime(car, NEW, number, tune) {
      let vm = this;
      let track = `${NEW.id}_a${NEW.surface}${NEW.cond}`;

      if (!car.data) Vue.set(car, "data", {});
      if (!car.data[tune]) Vue.set(car.data, tune, {});
      if (!car.data[tune].times) Vue.set(car.data[tune], "times", {});
      if (!car.data[tune].times[track]) Vue.set(car.data[tune].times, track, {});
      /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
      /**/ if (!car.dataToSave[tune]) Vue.set(car.dataToSave, tune, {});
      /**/ if (!car.dataToSave[tune].times) Vue.set(car.dataToSave[tune], "times", {});
      /**/ if (!car.dataToSave[tune].times[track]) Vue.set(car.dataToSave[tune].times, track, {});

      Vue.set(car.data[tune].times[track], "t", number);
      Vue.set(car.data[tune].times[track], "u", vm.user.username);
      Vue.set(car.data[tune].times[track], "down", []);
      Vue.set(car.data[tune].times[track], "up", []);
      /**/ Vue.set(car.dataToSave[tune].times[track], "t", number);

      if (!car.users || !car.users.includes(vm.user.username)) {
        Vue.set(car, "users", car.users && car.users.length > 0 ? [...car.users, vm.user.username] : [vm.user.username]);
      }
      vm.needSaveChange(true);
    },
    changeTuneCar(car, newTune, fromRow = false) {

      if (newTune === car.selectedTune) {
        newTune = undefined
      }

      if (this.mode === 'challenges' && this.tuneDialogActive) {
        this.cgChangeTuneYou(this.tuneDialogRace, newTune);
      } else {
        Vue.set(car, "selectedTune", newTune);
        if (!fromRow) {
          this.showCarsFix = false;
          this.$nextTick().then(() => {
            this.showCarsFix = true;
          })
        }
        this.updateCarLocalStorage();
        this.showPoints = false;
      }

    },
    changeStatCar(car, type, value) {
      let selectedTune = car.selectedTune;

      if (this.mode === 'challenges')  {
        car = Vue.all_cacheObj[car.rid];
      }

      if (!car.data) Vue.set(car, "data", {});
      if (!car.data[selectedTune]) Vue.set(car.data, selectedTune, {});
      if (!car.data[selectedTune].info) Vue.set(car.data[selectedTune], "info", {});
      if (!car.data[selectedTune].info[type]) Vue.set(car.data[selectedTune].info, type, {});
      /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
      /**/ if (!car.dataToSave[selectedTune]) Vue.set(car.dataToSave, selectedTune, {});
      /**/ if (!car.dataToSave[selectedTune].info) Vue.set(car.dataToSave[selectedTune], "info", {});
      /**/ if (!car.dataToSave[selectedTune].info[type]) Vue.set(car.dataToSave[selectedTune].info, type, {});

      Vue.set(car.data[selectedTune].info[type], "t", value);
      Vue.set(car.data[selectedTune].info[type], "u", this.user.username);
      /**/ Vue.set(car.dataToSave[selectedTune].info[type], "t", value);
      this.needSaveChange(true);

    },
    openSaveToGalleryDialog() {
      this.clearSaveToGallery();
      this.computeTemplateToSave();
      this.saveToGalleryDialog = true;
      this.shareDialog = false;
      setTimeout(() => {
        try {
          document.querySelector("#Main_SaveGalleryName").focus();  
        } catch (error) {}
      }, 10);
    },
    closeSaveToGalleryDialog() {
      this.saveToGalleryDialog = false;
    },
    clearSaveToGallery() {
      Vue.set(this, "saveToGalleryModel", {
        name: null,
        type: "Other",
        types: [
          "Best of",
          // "Trackset",
          "Event",
          "Other",
        ],
        minrq: null,
        maxrq: null,
        save_rq: true,
        minyear: null,
        maxyear: null,
        save_year: true,
        drive: [],
        save_drive: false,
        brand: [],
        save_brand: false,
        country: [],
        save_country: false,
        class: [],
        save_class: true,
        clearance: [],
        save_clearance: false,
        tyre: [],
        save_tyre: false,
        tag: [],
        save_tag: false
      });
    },
    computeTemplateToSave() {
      let t = this.saveToGalleryModel;
      let taaag = {};
      let rids = [];
      this.carDetailsList.map((car, icar) => {
        rids.push(car.rid);
        if (!t.minrq || car.rq < t.minrq) t.minrq = car.rq;
        if (!t.maxrq || car.rq > t.maxrq) t.maxrq = car.rq;
        if (!t.minyear || car.year < t.minyear) t.minyear = car.year;
        if (!t.maxyear || car.year > t.maxyear) t.maxyear = car.year;
        t.drive.push(car.drive);
        t.brand.push(car.brand);
        t.country.push(car.country);
        t.class.push(car.class);
        t.clearance.push(car.clearance);
        t.tyre.push(car.tyres);
        car.tags.map(y => {
          if (!taaag[y]) taaag[y] = 0;
          taaag[y] += 1;
        })
      })

      


      Object.keys(taaag).forEach(key => {
        if (taaag[key] === this.carDetailsList.length) {
          t.tag.push(key);
        }
      })
      Object.keys(t).forEach(key => {
        if (Array.isArray(t[key])) {
          if (key !== "types") {
            t[key] = [...new Set(t[key])]
            if (t[key].length > 0 && t[key].length < 3) {
              t[`save_${key}`] = true
            }
          }
        }
      })

      if (t.class.length === 1 &&
          t.drive.length < 3 &&
          t.clearance.length < 3 &&
          t.tyre.length < 3)
      {
        t.type = "Best of";
      }
      rids = [...new Set(rids)]
      if (rids.length === 1) {
        t.type = "Other";
        t.name = this.carDetailsList[0].name
      }
    },
    saveToGallery() {
      let t = this.saveToGalleryModel;
      if (!t.name || t.name.length < 3) {
        this.putSaveToGalleryError("Type a title");
        return;
      }


      let vm = this;
      let body = {
        name: t.name,
        type: t.type,
        template: vm.generateUrl(true)
      };
      Object.keys( t ).forEach( key => {
        if (key.includes("save_")) {
          if (t[key] === true) {
            if (key !== "save_rq" && key !== "save_year") {
              body[key.substr(5)] = t[key.substr(5)]
            } else {
              body[`min${key.substr(5)}`] = t[`min${key.substr(5)}`];
              body[`max${key.substr(5)}`] = t[`max${key.substr(5)}`];
              // rq or year
            }
          }
        }
      })

      this.saveToGalleryLoading = true;
      // console.log(body);

      axios.post(Vue.preUrl + "/saveTemplate", body)
      .then(res => {
        this.closeSaveToGalleryDialog();
        vm.$store.commit("LIBRARY_NEW_DIALOG", {});
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
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
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.saveToGalleryLoading = false;
      });

    },
    putSaveToGalleryError(msg) {
      this.$store.commit("DEFINE_SNACK", {
        error: true,
        text: msg
      });
      this.saveToGalleryError = true;
      setTimeout(() => { this.saveToGalleryError = false}, 1500);
    },
    mutateTemplate(config, isDelete) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;

        axios.post(Vue.preUrl + `/${isDelete ? "delete" : "approve" }Template`, config)
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.$store.commit("REFRESH_LIBRARY", {});
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: isDelete ? vm.$t('m_deleteSuccess') : vm.$t('m_approveSuccess')
          });
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
          if ((error.response || {}).status === 401) {
            vm.$store.commit('OPEN_LOGIN');
          }
        })
        .then(() => {
          vm.confirmDelete.loading = false;
        });

      }

      this.confirmDelete = {
        dialog: true,
        msg: `${isDelete ? "Deleting" : "Approving" } template "${config.name}" by ${config.user}. Are you sure?`,
        actionLabel: `${isDelete ? "Delete" : "Approve" }`,
        action: action,
        loading: false,
        classe: `${isDelete ? "D_ButtonRed" : "D_ButtonGreen" }`
      }
    },
    checkMemoryFromStorage() {
      Array.from(Array(50)).map((_, i) => {
        this.memory.push(null);
      });
      this.memory = this.memory.map((m, index) => {
        let found = window.localStorage.getItem(`m${index}`);
        if (found) {
          if (found.startsWith("share")) {
            // old version
            return {
              template: found,
              name: `Memory #${index+1}`,
              ...Vue.decodeTdr(found)
            };
          } else if (found.startsWith("{")) {
            let obj = JSON.parse(found);
            return {
              ...obj
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      })

    },
    loadMemory(index, e) {
      if (e.shiftKey) {
        // delete
        localStorage.removeItem(`m${index}`);
        Vue.set(this.memory, index, null);
      } else {
        this.decodeTemplateString(this.memory[index].template, true);
        this.updateOptions();
      }
    },
    saveMemory(index, e, keepName) {
      this.clearSaveToGallery();
      this.computeTemplateToSave();

      let name = `Memory #${index+1}`;
      if (this.memory[index] && this.memory[index].name && keepName) name = this.memory[index].name;

      let temp = {
        template: this.generateUrl(true),
        name: name,
        brand: this.saveToGalleryModel.brand,
        class: this.saveToGalleryModel.class,
        clearance: this.saveToGalleryModel.clearance,
        country: this.saveToGalleryModel.country,
        drive: this.saveToGalleryModel.drive,
        maxrq: this.saveToGalleryModel.maxrq,
        maxyear: this.saveToGalleryModel.maxyear,
        minrq: this.saveToGalleryModel.minrq,
        minyear: this.saveToGalleryModel.minyear,
        tag: this.saveToGalleryModel.tag,
        tyre: this.saveToGalleryModel.tyre
      }
      

      let colors = [];
      if (temp.class) {
        temp.class.map(c => {
          colors.push(Vue.resolveClass(0, c, "color"))
        })
      }

      temp = {
        ...temp,
        ...Vue.decodeTdr(temp.template),
        classesColors: colors
      }
      
      Vue.set(this.memory, index, temp);
      window.localStorage.setItem(`m${index}`, JSON.stringify(temp));

      if (e) {
        e.srcElement.classList.add("D_Button_Correct");
        setTimeout(() => {
          e.srcElement.classList.remove("D_Button_Correct");
        }, 1500);
      }
    },
    memoryAddNext() {
      let nextIndex = 0;
      nextIndex = this.memory.findIndex((m, index) => {
        if (m === null) return true;
      })
      this.saveMemory(nextIndex);
    },
    importMemory(json) {
      if (Array.isArray(json) && json.length === 50) {
        this.memory = json;
        json.map((item, index) => {
          if (item !== null) {
            window.localStorage.setItem(`m${index}`, JSON.stringify(item));
          }
        })
      }
    },
    renameMemoryDialogOpen(index) {
      this.memoryRenameDialog = true;
      this.memoryRenameNewNameIndex = index;
      this.memoryRenameNewName = `${(this.memory[index] || {}).name || ''}`;
      setTimeout(() => {
        try {
          document.querySelector("#Memory_Name").focus();  
          document.querySelector("#Memory_Name").select();
        } catch (error) {}
      }, 10);
    },
    renameMemoryDialogClose() {
      this.memoryRenameDialog = false;
      Vue.set(this.memory[this.memoryRenameNewNameIndex], "name", this.memoryRenameNewName);

      let found = window.localStorage.getItem(`m${this.memoryRenameNewNameIndex}`);
      if (found) {
        let obj = JSON.parse(found);
        obj.name = this.memoryRenameNewName;
        window.localStorage.setItem(`m${this.memoryRenameNewNameIndex}`, JSON.stringify(obj));
      }
    },
    askDeleteMemory(index) {
      let vm = this;

      let action = function() {
        vm.loadMemory(index, { shiftKey: true });
        vm.confirmDelete.dialog = false;
      }

      console.log(index);
      console.log(this.memory[index]);
      let name = `Memory #${index+1}`
      if (this.memory[index].name) name = this.memory[index].name;

      this.confirmDelete = {
        dialog: true,
        msg: `Delete memory '${name}'?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    askReplaceMemory(index) {
      let vm = this;

      let action = function() {
        vm.saveMemory(index, null, true);
        vm.confirmDelete.dialog = false;
      }

      console.log(index);
      console.log(this.memory[index]);
      let name = `Memory #${index+1}`
      if (this.memory[index].name) name = this.memory[index].name;

      this.confirmDelete = {
        dialog: true,
        msg: `Replace memory '${name}'?`,
        actionLabel: `Replace`,
        action: action,
        loading: false,
        classe: `D_ButtonGreen`
      }
    },
    clearDataToSave() {
      if (this.mode === 'challenges') {
        Object.keys(Vue.all_cacheObj).map(rid => {
          delete Vue.all_cacheObj[rid].dataToSave;
        })
      } else {
        this.carDetailsList.map(x => {
          delete x.dataToSave;
        });
      };
    },
    loadChallenges(resolveInitial = true) {
      this.cgLoading = true;

      axios.get(Vue.preUrlCharlie + "/searchCg")
      .then(res => {
        this.cgList = res.data.value;

        if ((this.user && this.user.mod) || import.meta.env.DEV) {
          this.cgList.push({
            "date": "proving_grounds_test",
            "name": "Proving Grounds: test"
          })
        }
        // if (this.user && this.user.mod && this.user.username === 'TiagoXavi') {
        //   this.cgList.push({
        //     "date": "a1",
        //     "name": "Proving Grounds: a1"
        //   })
        //   this.cgList.push({
        //     "date": "a2",
        //     "name": "Proving Grounds: a2"
        //   })
        //   this.cgList.push({
        //     "date": "a3",
        //     "name": "Proving Grounds: a3"
        //   })
        //   this.cgList.push({
        //     "date": "a4",
        //     "name": "Proving Grounds: a4"
        //   })
        // }

        this.styleCgList();
        if (resolveInitial && this.cgCurrentId && this.cgList.find(x => x.date === this.cgCurrentId)) {
          this.loadChallengeFull(this.cgCurrentId, this.cgCurrentRound);
        } else {
          this.cgLoading = false;
        }
      })
      .catch(error => {
        this.cgLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    loadChallengeFull(date, round, e) {
      if (e && e.shiftKey && this.user && this.user.canDelete && this.user.mod) {
        this.cgAskDelete(date);
        return;
      }
      this.cgLoading = true;
      this.cgSeletorDialog = false;
      this.cgSentForReview = false;

      axios.post(Vue.preUrlCharlie + "/getCgById", {
        date: date
      })
      .then(res => {
        this.cgLoadedAssets = [];
        let cg = this.cgList.find(x => x.date === date)
        if (cg.date === res.data.date) {
          Vue.set(cg, "rounds", res.data.rounds);
          if (res.data.notThisTime) Vue.set(cg, "notThisTime", true);
          this.cgCurrentRoundSum = res.data.startNumer || 0;
          this.cgLoading = false;
          this.loadCgRound(date, round);
        }
        this.lookForChangedCars(res.data);
        this.cgResolveIcons();
        this.checkPreDoneRounds(res.data);
      })
      .catch(error => {
        console.log(error);
        this.cgLoading = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    loadCgRound(id, round) {
      if (round === undefined) {
        let lastRound = window.localStorage.getItem(`cg_${id}`);
        if (lastRound) {
          round = Number(lastRound);
        }
      }
      if (isNaN(round)) round = 0;

      this.cgSeletorDialog = false;
      this.cgRoundSelectorDialog = false;
      let cg = this.cgList.find(x => x.date === id);
      if (!cg) {
        return;
      }
      window.localStorage.setItem(`cg_${id}`, round);
      this.cg = cg;

      this.cgCurrentId = cg.date;
      this.cgCurrentName = cg.name;
      if (!cg.rounds[round]) round = 0;
      this.cgCurrentRound = round;
      this.cgRound = cg.rounds[this.cgCurrentRound];
      if (this.cgRound.filter) {
        // fix different saved default 
        if (this.cgRound.filter.yearModel && this.cgRound.filter.yearModel[0] === 1930) {
          this.cgRound.filter.yearModel[0] = 1910;
        }
        if (this.cgRound.filter.yearModel && this.cgRound.filter.yearModel[1] === 2022) {
          this.cgRound.filter.yearModel[1] = 2025;
        }
        // if (this.cgRound.filter.yearModel && this.cgRound.filter.yearModel[1] === 2024) {
        //   this.cgRound.filter.yearModel[1] = 2025;
        // }
        if (this.cgRound.filter.rqModel && (this.cgRound.filter.rqModel[1] === 114 || this.cgRound.filter.rqModel[1] === 100)) {
          this.cgRound.filter.rqModel[1] = 119;
        }
        if (this.cgRound.filter.topSpeedModel && this.cgRound.filter.topSpeedModel[0] === 50) {
          this.cgRound.filter.topSpeedModel[0] = 25;
        }
      }
      if (this.cg.notThisTime) this.cgRound.notThisTime = true;

      this.cgRoundsNumber = cg.rounds.length;
      this.generateUrl();

      if (Array.isArray(this.cgRound.toApprove) && this.cgRound.toApprove.length > 0 && !this.cgRound.reservedTo && !this.cgRound.creator && !this.cgRound.lastAnalyze) {
        this.cgViewSubmit();
      } else {
        this.cgIsApproving = false;
      }
      if (this.cgNewSubmitByModTemplate) {
        this.cgRound = JSON.parse(JSON.stringify(this.cgNewSubmitByModTemplate));
      }
      this.cgNewSubmitByMod = false;
      this.cgApprovingIndex = 0;

      this.cgResolveFilter();
      this.cgUpdateLocalStorage();

      this.cgResolveRoundCars(false);
      this.checkRaceTimesNull();
      if (this.cgIsApproving || this.cg.notThisTime) {
        this.loadCgRoundAsset(id, round);
      } else {
        this.pingAssetStatistic(id, round);
        this.cgResolveRoundCars();
      }
    },
    checkRaceTimesNull() {
      this.cgRound.races.map(race => {
        if (race.time !== null) return;
        if (!race.car || !race.car.selectedTune || !race.track) {
          race.time = null
          return;
        }

        let oppo = Vue.all_cacheObj[race.car.rid];
        let tryoppotime;
        try {
          tryoppotime = oppo.data[race.car.selectedTune].times[race.track].t
        } catch (error) {
          // nada
        }
        if (tryoppotime || tryoppotime === 0) {
          if (race.time && race.time !== tryoppotime && this.cgRoundToSave.length > 0) {
            // commit the change to database
            this.cgRoundToSave.push({
              type: "oppoTime",
              time: tryoppotime,
              raceIndex: this.cgRound.races.indexOf(race)
            })
          }
          race.time = tryoppotime;
        }
      })
    },
    checkPreDoneRounds(data) {
      if (!this.user || !this.user.mod) return;
      data.rounds.map((round, iround) => {
        if (round.lastAnalyze) return;
        if (round.creator) return;
        let isPreDone = true; 
        round.races.find((race, irace) => {
          if (!race.rid || !race.track || !race.tune || (!race.time && race.time !== 0) ) {
            isPreDone = false;
            return true;
          }
        })
        if (isPreDone) {
          Vue.set(round, 'preDoneMod', true);
        }
      })
    },
    loadCgRoundAsset(id, round) {
      let roundId = `${id}_${round}`;
      if (this.cgLoadedAssets.includes(roundId)) return;
      if (this.cgBlockDownloadAssets && !this.cg.notThisTime) return;
      this.cgLoading = true;

      axios.get(Vue.preUrlCharlie + `/asset/${roundId}`)
      .then(res => {
        // load asset
        let votes = res.data.filter(x => x.sort.includes("votes_"));
        if (votes) {
          let realCgRound = this.cg.rounds[this.cgCurrentRound];
          if (Array.isArray(realCgRound.toApprove) && realCgRound.toApprove.length > 0) {
            votes.map(item => {
              let index = item.sort.substr(6);
              if (!index.includes("_")) return;
              index = index.split("_")[0];
              let username = item.sort.substr(6 + index.length + 1);
              if (realCgRound.toApprove[index] && realCgRound.toApprove[index].creator === username) {
                realCgRound.toApprove[index].downList = item.value.down;
                realCgRound.toApprove[index].upList = item.value.up;
              }
            })
          }
          if (this.cg.notThisTime && votes.length >= 1) {
            Vue.set(this.cgRound, 'downList', votes[0].value.down);
            Vue.set(this.cgRound, 'upList', votes[0].value.up);
          }
        }
        let assetCars = res.data.find(x => x.sort === 'cars');
        if (assetCars && Array.isArray(assetCars.value)) {
          assetCars.value.map((arrOfCars, ix) => {
            this.cgRound.races[ix].cars = arrOfCars;
          })
        }

        this.cgLoading = false;
        this.cgResolveRoundCars();
        this.cgLoadedAssets.push(roundId);
      })
      .catch(error => {
        this.cgLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.cgLoading = false;
      });

    },
    pingAssetStatistic(id, round) {
      let roundId = `${id}_${round}`;
      if (this.cgLoadedAssets.includes(roundId)) return;
      if (this.cgBlockDownloadAssets) return;

      axios.post(Vue.preUrlCharlie + `/pingStatistics`, {
        type: "cg",
        suffix: roundId
      })
      .then(res => {
        this.cgLoadedAssets.push(roundId);
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
      });

    },
    cgResolveRoundCars(download = true, retry = 0) {
      if (this.lastestList.length === 0) {
        if (retry > 20) return;
        console.log("retry", retry);
        setTimeout(() => {
          this.cgResolveRoundCars(download, retry+1)
        }, 500);
        return;
      }
      // let listRids = [];
      // let minCars = [];
      // let ridToPhotoId = {};

      this.cgRound.races.map(race => {
        let found = Vue.all_cacheObj[race.rid];
        if (!found) {
          Vue.all_cacheObj[race.rid] = { rid: race.rid };
        }
      })

      // this.cgRound.races.map(race => {
      //   listRids.push(race.rid);
      //   let found = Vue.all_cacheObj[race.rid];
      //   if (!found) {
      //     Vue.all_cacheObj[race.rid] = { rid: race.rid };
      //   }
      //   race.cars.map(car => {
      //     listRids.push(car.rid)
      //   })
      // })
      // listRids = [...new Set(listRids)];
      // Vue.all_carsArr.map(x => {
      //   if (listRids.includes(x.rid)) {
      //     minCars.push(x)
      //   }
      //   if (x.photoId) {
      //     ridToPhotoId[x.rid] = x.photoId
      //   }
      // })

      this.cgRound.races.map(race => {
        let foundOppo = Vue.all_carsObj[race.rid];
        if (foundOppo) foundOppo = JSON.parse(JSON.stringify(foundOppo));
        Vue.set(race, "car", foundOppo);
        if (race.tune) Vue.set(race.car, "selectedTune", race.tune);

        race.cars.map((car, icar) => {
          Vue.set(car, "photo", Vue.all_carsObj[car.rid].photo);
          Vue.set(car, "car", JSON.parse(JSON.stringify(Vue.all_carsObj[car.rid])));
          Vue.set(car, "color", Vue.all_carsObj[car.rid].color);
          Vue.set(car.car, "selectedTune", car.tune);
        })

        // tracks
        this.resolveTrack(race, false);
        this.cgSortBankCars(race);

      })
      this.cgRemoveDuplicateSolution();
      if (download) {
        this.downloadDataCars();
      }
    },
    cgViewSubmit() {
      let realCgRound = this.cg.rounds[this.cgCurrentRound];
      if (!realCgRound.toApprove) return;
      this.cgIsApproving = true;

      if (Array.isArray(realCgRound.toApprove) && realCgRound.toApprove.length > 0) {
        if (!realCgRound.toApprove[this.cgApprovingIndex]) {
          // index not found
          this.cgApprovingIndex = 0;
        }
        this.cgApprovingLength = realCgRound.toApprove.length;
        this.cgRound = realCgRound.toApprove[this.cgApprovingIndex];
      }
    },
    cgChangeSubmit(factor) {
      this.cgApprovingIndex += factor;
      this.cgViewSubmit();
      Vue.set(this.cgRound, "rqFill", 0);
      this.cgResolveFilter();
      this.cgUpdateLocalStorage();
      this.cgResolveRoundCars(false);
    },
    resolveTrack(race, calcResult = true, isRace = true) {
      if (race.track) {
        let resolveds;
        if (isRace) {
          Vue.set(race, "resolvedTracks", this.validateTracks([race.track]));
          resolveds = race.resolvedTracks;
        } else {
          resolveds = this.validateTracks([race.track]);
        }

        // list all options
        let currentTracksOptions = [];
        let options = [];
        this.campaign.map((city, icity) => {
          city.matches.map((match, imatch) => {
            match.races.map((rac, irace) => {
              if (rac.name === race.track) {
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

        // delivery best option
        resolveds.map((x, ix) => {
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
            x.campaign = `${bestOption.city} ${bestOption.imatch+1}`;
            if (!this.isChamp(bestOption.city)) {
              x.campaignNum = bestOption.irace+1;
            }
          } else {
            x.campaign = `Not in campaign`;
          }
        })

        if (calcResult) {
          this.calcRaceResult(race);
        }
        if (!isRace) {
          return resolveds[0];
        }
      }
    },
    cgChangeTuneOppo(car, tune, race) {
      Vue.set(car, "selectedTune", tune);

      if (tune === undefined) {
        race.time = null;
      } else {
        this.cgRoundToSave.push({
          type: "oppoCar",
          rid: car.rid,
          tune: tune,
          raceIndex: this.cgRound.races.indexOf(race)
        })
        this.calcRaceResult(race);
      }
    },
    cgChangeTuneYou(race, newTune) {
      // Vue.set(car, "selectedTune", tune);

      //chaged tune of you car
      let found = race.cars.findIndex(x => x.rid === race.cars[race.carIndex].rid && x.tune === newTune);
      if (found > -1) {
        race.carIndex = found;
      } else {
        race.cars.push( JSON.parse(JSON.stringify( race.cars[race.carIndex] )) );
        race.carIndex = race.cars.length-1;
        race.cars[race.carIndex].tune = newTune;
        race.cars[race.carIndex].points = undefined;
        race.cars[race.carIndex].car.selectedTune = newTune;
      }

      this.tuneDialogCar = race.cars[race.carIndex].car; 
      this.tuneDialogCar.data = Vue.all_cacheObj[race.cars[race.carIndex].rid].data;
      this.calcRaceResult(race);
    },
    cgShowTuneDialog(car, race, isOppo = false) {
      this.tuneDialogCar = car;
      this.tuneDialogCar.data = Vue.all_cacheObj[car.rid].data;
      this.tuneDialogCarIndex = -1;
      this.tuneDialogisOppo = isOppo;
      this.tuneDialogActive = true;
      this.tuneDialogRace = race;
    },
    calcRaceResult(race, isCgInitial) {
      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
      })
      setTimeout(() => {
        this.cgResolveRqFill();
      }, 100);
      let irace = this.cgRound.races.indexOf(race);

      
      if (!race.car || !race.car.selectedTune || !race.track) {
        race.time = null
        return;
      }

      let oppo = Vue.all_cacheObj[race.car.rid];
      let tryoppotime;
      try {
        tryoppotime = oppo.data[race.car.selectedTune].times[race.track].t
      } catch (error) {
        // nada
      }
      if (tryoppotime || tryoppotime === 0) {
        if (race.time && race.time !== tryoppotime && this.cgRoundToSave.length > 0) {
          // commit the change to database
          this.cgRoundToSave.push({
            type: "oppoTime",
            time: tryoppotime,
            raceIndex: this.cgRound.races.indexOf(race)
          })
        }
        race.time = tryoppotime;
      }


      if (typeof race.carIndex !== 'number') {
        return;
      }

      let youRid = race.cars[race.carIndex].rid;
      let youTune = race.cars[race.carIndex].car.selectedTune;
      let points = 0;

      if (!(race.cars[race.carIndex] || {}).car || !((race.cars[race.carIndex] || {}).car || {}).selectedTune) {
        // Vue.set(race.cars[race.carIndex], "points", undefined);
        // debugger;
        // this.cgResolveBankToSave("remove", irace, youRid, youTune, points);
        return;
      }
      
      
      
      let you = Vue.all_cacheObj[youRid];
      if (!you) {
        Vue.all_cacheObj[youRid] = { rid: youRid };
        this.downloadCar(youRid);
        return;
      }
      if (!oppo || race.time === null || race.time === undefined || !you || !you.data) {
        Vue.set(race.cars[race.carIndex], "points", undefined);
        // debugger;
        // this.cgResolveBankToSave("remove", irace, youRid, youTune, points);
        return;
      }


      let oppotime = race.time;
      let youtime = (((you.data[youTune] || {}).times || {})[race.track] || {}).t
      if (oppotime === undefined || youtime === undefined) {
        if (youtime === undefined && youTune) {
          Vue.set(race.cars[race.carIndex], "points", this.$t("m_notime"));
          if (!!this.user && this.user.mod && isCgInitial) {
            this.cgResolveBankToSave("remove", irace, youRid, youTune, points);
          }
        }
        return;
      }
      
      // if (race.track.includes("testBowl")) {
      //   if (oppotime > youtime) points = -50;
      //   if (oppotime < youtime) points = 50;
      // } else {
      //   if ((oppotime > youtime && youtime > 0) || (oppotime === 0 && youtime > 0)) points = 50;
      //   else if ((oppotime < youtime && oppotime !== 0) || (youtime === 0 && oppotime > 0) ) points = -50;
      // }
      // // until now is boolean point
      // if (this.showPoints) {
      // }
      // Vue.set(race.cars[race.carIndex], "points", points);

      let origPoints = race.cars[race.carIndex].points;
      let isManualPoints = race.cars[race.carIndex].manual;
      // if (typeof origPoints === 'number' && origPoints !== points) {
      //   if (points === 50 && origPoints > 50) points = origPoints;
      //   if (points === -50 && origPoints < -50) points = origPoints;
      //   if (points === 0 && origPoints !== 0) points = origPoints;
      // }
      if (!isManualPoints) {
        points = Vue.options.filters.userPoints(youtime, oppotime, race.track).v;
        Vue.set(race.cars[race.carIndex], "points", points);
        if ( !this.downloadLoading && origPoints !== points && !isManualPoints ) {
          this.cgResolveBankToSave("add", irace, youRid, youTune, points);
        }
      }
      
    },
    cgReCalcRound() {
      if (this.mode !== 'challenges') return;
      this.cgRound.races.map(race => {
        race.carIndex = undefined;
        this.cgSortBankCars(race);
      })
      this.cgRemoveDuplicateSolution();
      this.downloadDataCars();
    },
    cgResolveBankToSave(type, raceIndex, rid, tune, points) {
      if (!this.user) return;

      // check if need to push before
      let obj = { type, raceIndex, rid, tune, points, round: this.cgCurrentRound, date: this.cg.date };
      // console.log(JSON.stringify(obj));

      let found = this.cgBankToSave.findIndex(x => {
        if (JSON.stringify(x) === JSON.stringify(obj)) {
          return true;
        }
      })
      if (found === -1) {
        this.cgBankToSave.push(obj);

        this.debounceCgSaveBank();
        // console.log(JSON.stringify(obj));
        // axios.post(Vue.preUrl + "/updateCgBankCars", obj)
        // .then(res => {
        //   console.log('saved', obj);
        // })
        // .catch(error => {
        //   console.log(error);
        // })
      }

      
    },
    cgReturnAWinTuneYou(car) {
      if (car['111'] > 0) return '111';
      if (car['323'] > 0) return '323';
      if (car['233'] > 0) return '233';
      if (car['332'] > 0) return '332';
    },
    cgBankCarClick(race, index, e, irace, bankCar) {
      if (e.shiftKey) {
        race.cars.splice(index, 1);
        if (race.carIndex === index) race.carIndex = undefined;
        if (!!this.user && this.user.mod) {
          this.cgResolveBankToSave("remove", irace, bankCar.rid, bankCar.tune, 0);
        }
      } else {
        race.carIndex = index;
        this.calcRaceResult(race);
        this.cgSaveRoundHand();
      }
    },
    cgResolveRqFill() {
      let fill = 0;
      let pointsTotal = 0;
      let showPoints = false;
      this.cgRound.races.map(race => {
        try {
          fill = fill + race.cars[race.carIndex].car.rq;
          if (Number(race.cars[race.carIndex].points)) {
            pointsTotal = pointsTotal + race.cars[race.carIndex].points;
            if (race.cars[race.carIndex].points < 50) {
              showPoints = true;
            }
          } else {
            showPoints = true;
          }
        } catch (error) {
          // nada
        }
      })
      Vue.set(this.cgRound, "rqFill", fill);
      Vue.set(this.cgRound, "sumPoints", pointsTotal);
      Vue.set(this.cgRound, "showPoints", showPoints);
    },
    cgChangeTimeOppo(race, event, irace) {
      let car = race.car;
      let tune = car.selectedTune;
      let carData = Vue.all_cacheObj[car.rid];
      let NEW = event.item;
      let number = event.number;
      let allowedTunes = ["332", "323", "233"];
      if (car.class === 'S' || car.class === 'A') {
        allowedTunes.push("111")
      }
      if (allowedTunes.includes(tune)) {
        // put on Vue.all_cacheObj
        this.resolveChangeTime(carData, NEW, number, tune);
      }

      Vue.set(race, "time", number);
      this.cgRoundToSave.push({
        type: "oppoTime",
        time: number,
        raceIndex: this.cgRound.races.indexOf(race)
      })
      
      this.cgRound.races.map((mapRace, imapRace) => {
        if (imapRace === irace) return;
        if (!mapRace.rid || mapRace.rid !== race.rid) return;
        if (!mapRace.track || mapRace.track !== race.track) return;
        if (!mapRace.tune || mapRace.tune !== race.tune) return;
        // two races identical
        Vue.set(mapRace, "time", number);
        this.cgRoundToSave.push({
          type: "oppoTime",
          time: number,
          raceIndex: imapRace
        })
      })

      
      this.calcRaceResult(race);
    },
    cgChangeTimeYou(race, event) {
      let car = race.cars[race.carIndex].car;
      let tune = car.selectedTune;
      let carData = Vue.all_cacheObj[car.rid];
      let NEW = event.item;
      let number = event.number;

      this.resolveChangeTime(carData, NEW, number, tune);
      this.calcRaceResult(race);
    },
    cgDeleteTime(race, event, isOppo = false) {
      let vm = this;
      let car;
      if (isOppo) car = race.car;
      else car = race.cars[race.carIndex].car;
      let tune = car.selectedTune;
      let carData = Vue.all_cacheObj[car.rid];
      let track = race.track;
      let trackname = vm.$t(`t_${race.track.slice(0, -4)}`);


      let action = function() {
        vm.confirmDelete.loading = true;
        vm.saveLoading = true;

        axios.post(Vue.preUrl + "/deleteTime", {
          rid: car.rid,
          tune: tune,
          track: track,
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          if (isOppo) Vue.set(race, 'time', null);
          Vue.set(carData.data[tune].times, track, undefined);

          vm.showCarsFix = false;
          vm.$nextTick().then(() => {
            vm.showCarsFix = true;
          })

          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: vm.$t('m_deleteSuccess')
          });
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
          if ((error.response || {}).status === 401) {
            vm.$store.commit('OPEN_LOGIN');
          }
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          vm.saveLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete '${trackname}' time of ${car.name}?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }


      
      // let NEW = event.item;
      // let number = event.number;

      // this.resolveChangeTime(carData, NEW, number, tune);
      // this.calcRaceResult(race);
    },
    cgSaveAll() {
      this.cgSaveLoading = true;

      // cars times

      if (this.cgRoundToSave.length === 0 && this.cgRoundFilterToSave === null && !this.cgRqNeedToSave) {
        //nothing to save here
        this.cgSaveLoading = false;
        this.saveAll(true);
        return;
      }
      // save round changes
      axios.post(Vue.preUrl + "/updateCg", {
        date: this.cg.date,
        round: this.cgCurrentRound,
        changes: this.cgRoundToSave,
        filter: this.cgRoundFilterToSave,
        rqLimit: this.cgRound.rqLimit
      })
      .then(res => {
        this.cgClearRoundToSave();
        this.saveAll(true);
        this.cgNewSubmitByModTemplate = null;
        if (!this.user.mod) {
          this.loadChallengeFull(this.cgCurrentId, this.cgCurrentRound);
          this.cgSentForReview = true;
        }
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.user.mod ? this.$t('m_saveSuccess') : this.$t('m_sentReview')
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
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.cgSaveLoading = false;
      });


    },
    cgClearRoundToSave() {
      this.cgRoundToSave = [];
      this.cgRoundFilterToSave = null;
      this.cgRoundFilterString = JSON.stringify(this.cgRound.filter);
      this.cgRqEditString = this.cgRound.rqLimit;
      this.cgRqNeedToSave = false;
    },
    cgReserveRound() {
      this.cgSaveLoading = true;

      axios.post(Vue.preUrl + "/reserveRound", {
        date: this.cg.date,
        round: this.cgCurrentRound
      })
      .then(res => {
        this.loadChallengeFull(this.cgCurrentId, this.cgCurrentRound);
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.cgSaveLoading = false;
      });

    },
    cgReviewRound(approve) {
      this.cgSaveLoading = true;

      axios.post(Vue.preUrl + "/reviewRound", {
        date: this.cg.date,
        round: this.cgCurrentRound,
        submit: this.cgApprovingIndex,
        approve: approve
      })
      .then(res => {
        if (approve) this.forceShowAnalyse = true;
        this.loadChallengeFull(this.cgCurrentId, this.cgCurrentRound);
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.cgSaveLoading = false;
      });
      
    },
    cgResetSolutions() {
      this.cgRound.races.map((race, irace) => {
        race.cars.map(bankCar => {
          this.cgResolveBankToSave("remove", irace, bankCar.rid, bankCar.tune, 0);
        })
        race.cars = [];
        race.carIndex = undefined
      })
      this.cgResolveRqFill();
    },
    cgResetRound() {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.cgSaveLoading = true;

        axios.post(Vue.preUrl + "/resetRound", {
          date: vm.cg.date,
          round: vm.cgCurrentRound
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.forceShowAnalyse = false;
          vm.loadChallengeFull(vm.cgCurrentId, vm.cgCurrentRound);
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
          if ((error.response || {}).status === 401) {
            vm.$store.commit('OPEN_LOGIN');
          }
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          vm.cgSaveLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Reset this round?`,
        actionLabel: `Reset`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
      
    },
    cgPreviewSolutions() {
      let tracks = [];
      let oppos = [];
      let times = [];
      let filterCollection = [];

      this.cgRound.races.map(x => {
        let time;
        let cgCar = Vue.all_cacheObj[x.rid];

        if (
          x.car.selectedTune &&
          cgCar &&
          cgCar.data && 
          cgCar.data[x.tune] &&
          cgCar.data[x.tune].times &&
          cgCar.data[x.tune].times[x.track] &&
          cgCar.data[x.tune].times[x.track].t !== undefined
        ) {
          time = cgCar.data[x.tune].times[x.track].t;
        } else {
          time = x.time;
        }

        tracks.push(x.track);
        times.push(time);
        filterCollection.push(this.cgRound.filter);
        
        let tun = x.tune;
        if (tun.includes("Other")) tun = "222";
        let tunZ = `${tun.split().map(x=>Number(x)*3).join()}`;

        oppos.push({
          rid: x.rid,
          tunZ: tunZ,
          tun: tun,
          track: x.track,
          cat: "?????", //Performance_2WD_Low_5_400
          tKey: "?????", //drag
          predictedTime: null //11.69
        })

      })

      this.cgAnalyseLoading = true;


      axios.post(Vue.preUrl + "/analyseCustom", {
        filterCollection: filterCollection,
        tracks: tracks,
        oppos: oppos,
        times: times,
        isTdr: true
      })
      .then(res => {

        // console.log(res.data.resultPerFilter[0]);
        // console.log(this.cgRound.races);


        // Resolve cars
        // let listRids = [];
        // let minCars = {};

        // this.cgRound.races.map((race, irace) => {
        //   Object.keys(res.data.resultPerFilter[0][irace]).map(rid => {
        //     listRids.push(rid);
        //   })
        // })
        // listRids = [...new Set(listRids)];

        // this.all_cars.map(car => {
        //   if (listRids.includes(car.rid)) {
        //     minCars[car.rid] = car;
        //   }
        // })



        this.cgRound.races.map((race, irace) => {
          if (!race.cars) race.cars = [];

          Object.keys(res.data.resultPerFilter[0][irace]).map(rid => {
            Object.keys(res.data.resultPerFilter[0][irace][rid]).map(tune => {
              if (tune === "rq") return;

              if (
                tune !== "111" &&
                res.data.resultPerFilter[0][irace][rid]["111"] &&
                res.data.resultPerFilter[0][irace][rid]["111"].points > 0
              ) {
                return;
              }

              race.cars.push({
                points: res.data.resultPerFilter[0][irace][rid][tune].points,
                rid: rid,
                tune: tune,
                photo: Vue.all_carsObj[rid].photo,
                car: Vue.all_carsObj[rid],
                color: Vue.all_carsObj[rid].color
              })
            })
          })
        })
        this.cgResolveRoundCars(false);
        this.cgRound.isPreview = true;
        
        
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
        this.cgAnalyseLoading = false;
      });

    },
    cgSaveBank(customArray) {
      if (!window.location.origin.includes('topdrives')) {
        console.log("trySave", customArray);
        return;
      };
      if (this.cgRound.isPreview) return;
      if (this.cgBankToSave.length === 0 && !customArray) return;
      this.cgBankToSaveLoading = true;

      axios.post(Vue.preUrl + "/updateCgBankCars", customArray || this.cgBankToSave)
      .then(res => {
        this.cgClearBankToSave();
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.cgBankToSaveLoading = false;
      });


    },
    cgClearBankToSave() {
      this.cgBankToSave = [];
    },
    cgSortBankCars(race) {
      if (race.cars.length === 0) return;

      race.cars.sort((a, b) => {
        if (a.car.rq === b.car.rq) {
          return a.car.rid.localeCompare(b.car.rid)
        } else {
          return a.car.rq  - b.car.rq 
        }
      })

      Vue.set(race, "carIndex", race.cars.findIndex(car => car.points > 0));
      if (race.carIndex === -1) {
        Vue.set(race, "carIndex", 0);
      }
      let found = Vue.all_cacheObj[race.cars[race.carIndex].rid];
      if (!found) {
        Vue.all_cacheObj[race.cars[race.carIndex].rid] = { rid: race.cars[race.carIndex].rid };
      }
    },
    cgRemoveDuplicateSolution() {
      let saveName = `hand_${this.cg.date}_R${this.cgCurrentRound}`;
      let saveHand = window.localStorage.getItem(saveName);
      if (saveHand) {
        this.cgShowResetSavedHand = true;
        saveHand = JSON.parse(saveHand);
        saveHand.map((ridTune, ridIx) => {
          let index = this.cgRound.races[ridIx].cars.findIndex(car => {
            return `${car.rid}_${car.tune}` === ridTune;
          })
          if (index === -1) index = undefined;
          if (index === undefined) return;

          let race = this.cgRound.races[ridIx];
          Vue.set(race, "carIndex", index);
          
          let found;
          found = Vue.all_cacheObj[race.cars[race.carIndex].rid];
          if (!found) {
            Vue.all_cacheObj[race.cars[race.carIndex].rid] = { rid: race.cars[race.carIndex].rid };
          }
        })
        return
      }
      this.cgShowResetSavedHand = false;

      let loopCount = 0;

      while (true) {
        loopCount += 1;
        let alreadyUsedRidsAsSolution = [];
        let duplicates = [];
  
        this.cgRound.races.map((race, ix) => {
          if (race.carIndex >= 0) {
            if (alreadyUsedRidsAsSolution.includes(race.cars[race.carIndex].rid)) {
              duplicates.push(race.cars[race.carIndex].rid);
            }
            alreadyUsedRidsAsSolution.push(race.cars[race.carIndex].rid)
          }
        })

        if (duplicates.length === 0 || loopCount > 20) break;

        let options = [];
        let lowestRq = null;
        this.cgRound.races.map((race, ix) => {
          if (race.carIndex >= 0 && duplicates.includes(race.cars[race.carIndex].rid)) {
            race.cars.find((car, altCarIndex) => {
              if (car.points > 0 && !alreadyUsedRidsAsSolution.includes(car.rid)) {
                race.alt = {
                  rid: car.rid,
                  rq: Vue.all_carsObj[car.rid].rq,
                  raceIndex: ix,
                  altCarIndex
                }
                if (!lowestRq || lowestRq > race.alt.rq) lowestRq = race.alt.rq;
                options.push(race.alt);
                return true;
              }
            })
          }
        })

        options.find(option => {
          if (option.rq === lowestRq) {
            let race = this.cgRound.races[option.raceIndex]
            Vue.set(race, "carIndex", option.altCarIndex);

            let found = Vue.all_cacheObj[race.cars[race.carIndex].rid];
            if (!found) {
              Vue.all_cacheObj[race.cars[race.carIndex].rid] = { rid: race.cars[race.carIndex].rid };
            }

            return true;
          }
        })
      }

    },
    cgResolveFilter() {
      if (!this.cgRound.filter) return;
      let f = this.cgRound.filter;

      this.cgRoundFilterToSave = null;
      this.cgRoundFilterString = JSON.stringify(f);
      this.cgRqEditString = this.cgRound.rqLimit;
      this.cgRqNeedToSave = false;
    },
    cgResolveIcons() {
      let iconsSort = [
        "asphalt",
        "clearance",
        "rain",
        "clearanceW",
        "dirt",
        "gravel",
        "ice",
        "sand",
        "snow",
        "grass"
      ]
      let bump = [
        'csSmall',
        'dockCity',
        'csMed',
        'oceanCity',
        'speedbump12km',
        'speedbump1km',
        'miStreets2',
        'itBump',
        'dsTnFreeway',
        'dsTnLove',
        'dsTnMile2bump'
      ]
      
      this.cg.rounds.map((round, iround) => {
        // Round 1
        let icons = [];
        round.races.map((race, irace) => {
          // Race 1,2,3,4,5
          let track = race.track || "";
          if (!track) {
            if (round.toApprove && round.toApprove.length > 0) {
              track = round.toApprove[0].races[irace].track || "";
            }
          }
          let surf = track.slice(-2);
          if (surf) {
            let key;
            if ( surf[0] === "0" && bump.includes((track).slice(0, -4)) ) {
              if (surf[1] === "0") key = "clearance";
              else key = "clearanceW";
            }
            else if (surf === "01" || track === "lumberTwisty_a41") key = "rain";
            else if (surf === "00" || track === "lumberTwisty_a40") key = "asphalt";
            else if (surf[0] === "1" || surf[0] === "4") key = "dirt";
            else if (surf[0] === "2" || surf[0] === "b") key = "gravel";
            else if (surf[0] === "3" || surf[0] === "g") key = "ice";
            else if (surf[0] === "5" || surf[0] === "e" || surf[0] === "c") key = "sand";
            else if (surf[0] === "6" || surf[0] === "d" || surf[0] === "h") key = "snow";
            else if (surf[0] === "7" || surf[0] === "f") key = "grass";
            icons.push(key);
          }
        });
        icons.sort((a,b) => {
          return iconsSort.indexOf(a) - iconsSort.indexOf(b);
        })

        Vue.set(round, 'icons', icons);
      })
    },
    cgOpenRequirementDialog() {
      this.cgRequirementsDialogLoad = true;
      this.$nextTick().then(() => {
        this.cgRequirementsDialog = true;
      })
    },
    cgUpdateRequirements(filter) {
      this.cgRound.filter = filter;
      this.cgRequirementsDialog = false;
    },
    cgOpenAddYouCar(irace) {
      this.cgRaceSelected = irace;
      this.cgAddingYouCar = true;
      this.cgAddingOppoCar = false;

      this.cgFilterDialogLoad = true;
      this.$nextTick().then(() => {
        this.cgFilterDialog = true;
      })
    },
    cgOpenAddOppoCar(irace) {
      this.cgRaceSelected = irace;
      this.cgAddingOppoCar = true;
      this.cgAddingYouCar = false;

      this.cgFilterDialogLoad = true;
      this.$nextTick().then(() => {
        this.cgFilterDialog = true;
      })
    },
    loadPrevRound() {
      this.cgSentForReview = false;
      this.forceShowAnalyse = false;
      this.loadCgRound(this.cgCurrentId, this.cgCurrentRound-1)
    },
    loadNextRound() {
      this.cgSentForReview = false;
      this.forceShowAnalyse = false;
      this.loadCgRound(this.cgCurrentId, this.cgCurrentRound+1)
    },
    cgOpenNewCg() {
      this.cgClearSaveNewCg();
      this.cgSeletorDialog = false;
      this.cgNewDialog = true;
      setTimeout(() => {
        try {
          document.querySelector("#Cg_NewCgName").focus();  
        } catch (error) {}
      }, 10);
    },
    cgClearSaveNewCg() {
      this.cgNewModel.name = null;
      this.cgNewModel.numberRounds = 10;
    },
    cgCloseNewCg() {
      this.cgSeletorDialog = true;
      this.cgNewDialog = false;
    },
    saveNewChallenge() {
      this.cgNewLoading = true;

      axios.post(Vue.preUrl + "/newCg", {
        name: this.cgNewModel.name,
        rounds: Number(this.cgNewModel.numberRounds)
      })
      .then(res => {
        setTimeout(() => {
          this.cgCloseNewCg();
          this.loadChallenges(false);
          this.cgNewLoading = false;
        }, 1000);
      })
      .catch(error => {
        this.cgNewError = true;
        this.cgNewLoading = false;
        setTimeout(() => { this.cgNewError = false}, 1500);

        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    cgOpenRqEdit(e) {
      if (e.shiftKey && (e.ctrlKey || e.metaKey) && this.user && this.user.mod) {
        this.forceShowAnalyse = !this.forceShowAnalyse;
        return;
      }
      this.cgRqEditDialog = true;
      this.cgRqEditModel = `${this.cgRound.rqLimit}`;
      setTimeout(() => {
        try {
          document.querySelector("#Cg_EditRq").focus();  
          document.querySelector("#Cg_EditRq").select();
        } catch (error) {}
      }, 10);
    },
    cgCloseRqEdit() {
      this.cgRqEditDialog = false;
      if (this.cgRqEditModel != this.cgRqEditString) {
        this.cgRound.rqLimit = Number(this.cgRqEditModel);
        this.cgRqNeedToSave = true;
      } else {
        this.cgRqNeedToSave = false;
      }
    },
    cgUpdateLocalStorage() {
      window.localStorage.setItem('lastCg', JSON.stringify({ date: this.cg.date, round: this.cgCurrentRound }));
    },
    cgGetLocalStorage() {
      let lastCg = window.localStorage.getItem("lastCg");
      if (lastCg) {
        lastCg = JSON.parse(lastCg);
        this.cgCurrentId = lastCg.date;
        this.cgCurrentRound = lastCg.round;
      }
    },
    cgOpenPointsEdit(race) {
      if (!this.user) return;
      if (typeof race.carIndex !== 'number') return;
      let points = (race.cars[race.carIndex] || {}).points;
      if (!points && points !== 0) return;
      if (race.cars[race.carIndex].pointsUser && race.cars[race.carIndex].pointsUser !== this.user.username && points !== 0) {
        if (!this.user.mod) return;
      };

      let car = Vue.all_cacheObj[race.cars[race.carIndex].rid];
      let trytime
      if (!car) return;
      try {
        trytime = car.data[race.cars[race.carIndex].tune].times[race.track].t
      } catch (error) {
        // nada
      }
      if (!trytime && trytime !== 0) return;
      if (points === 0 && (!race.track.includes("testBowl") && trytime !== 0)) return;

      if (trytime !== race.time) return;

      this.cgPointsEditDialog = true;
      this.cgPointsEditModel = `${points}`;
      this.cgPointsEditString = `${points}`;
      this.cgPointsEditRace = race;
      this.cgPointsIsDraw = trytime === race.time;
      setTimeout(() => {
        try {
          document.querySelector("#Cg_EditPoints").focus();
          document.querySelector("#Cg_EditPoints").select();
        } catch (error) {}
      }, 10);
    },
    cgClosePointsEdit() {
      this.cgPointsEditDialog = false;
      let race = this.cgPointsEditRace;
      let points = Number(this.cgPointsEditModel);
      
      if (this.cgPointsEditModel != this.cgPointsEditString) {
        if (Number(this.cgPointsEditString) > 0 && points <= 0 && !this.cgPointsIsDraw) {
          return;
        }
        if (Number(this.cgPointsEditString) < 0 && points >= 0 && !this.cgPointsIsDraw) {
          return;
        }
        if (points > 999 || points < -999) {
          return;
        }

        let raceIndex = this.cgRound.races.indexOf(race);
        let rid = race.cars[race.carIndex].rid;
        let tune = race.cars[race.carIndex].tune;
        let arrayToSave = [{ type: "add", raceIndex, rid, tune, points, round: this.cgCurrentRound, date: this.cg.date, manual: true }];
        this.cgSaveBank(arrayToSave);

        Vue.set(race.cars[race.carIndex], "points", points);
        Vue.set(race.cars[race.carIndex], "pointsUser", this.user.username);
        
      }
    },
    cgAnalyseRound() {
      this.cgAnalyseRoundFinish();
      return;
      let rqMax = Math.floor(Math.pow( this.cgRound.rqLimit/5, 1.3 ));
      let rqMin = Math.floor(Math.pow( this.cgRound.rqLimit/5, 0.7 ));
      // this.$store.commit("CG_EMIT_RIDS", { rqMax, rqMin });
    },
    cgAnalyseRoundFinish() {

      let clearRound = this.cgRound.races.map(x => {
        let time;
        let cgCar = Vue.all_cacheObj[x.rid];

        if (
          x.car.selectedTune &&
          cgCar &&
          cgCar.data && 
          cgCar.data[x.tune] &&
          cgCar.data[x.tune].times &&
          cgCar.data[x.tune].times[x.track] &&
          cgCar.data[x.tune].times[x.track].t !== undefined
        ) {
          time = cgCar.data[x.tune].times[x.track].t;
        } else {
          time = x.time;
        }
        return { track: x.track, time: time }
      })

      this.cgAnalyseLoading = true;

      axios.post(Vue.preUrl + "/analyseRound", {
        date: this.cgCurrentId,
        round: this.cgCurrentRound,
        filter: this.cgRound.filter,
        cgRound: clearRound,
        preDone: this.cgRound.preDoneMod
      })
      .then(res => {
        this.loadChallengeFull(this.cgCurrentId);
        this.forceShowAnalyse = false;
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.cgAnalyseLoading = false;
      });
    },
    cgAskDelete(date) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.cgNewLoading = true;

        axios.post(Vue.preUrl + "/deleteCg", {
          date: date
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.loadChallenges(false);
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          vm.cgNewLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete "${date}"?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }

    },
    cgSaveRoundHand() {
      let saveName = `hand_${this.cg.date}_R${this.cgCurrentRound}`
      let handRids = [];
      this.cgRound.races.map(race => {
        if (isNaN(race.carIndex)) {
          handRids.push(undefined);
        } else {
          handRids.push(`${race.cars[race.carIndex].rid}_${race.cars[race.carIndex].tune}`);
        }
      })
      window.localStorage.setItem(saveName, JSON.stringify(handRids));
    },
    cgResetSaveHand() {
      let saveName = `hand_${this.cg.date}_R${this.cgCurrentRound}`
      localStorage.removeItem(saveName);
      this.loadCgRound(this.cgCurrentId, this.cgCurrentRound);
      this.cgShowResetSavedHand = false;
    },
    cgVote(type) {
      let isUnVoteUp = false;
      let isUnVoteDown = false;
      if (!this.cgRound.upList) {
        Vue.set(this.cgRound, 'upList', [])
      }
      if (!this.cgRound.downList) {
        Vue.set(this.cgRound, 'downList', [])
      }
      let upList = this.cgRound.upList;
      let downList = this.cgRound.downList;
      let user = this.user.username;

      // remove from both arr
      if (upList.includes(user)) {
        this.cgRound.upList = upList.filter(x => x !== user);
        if (type === "up") isUnVoteUp = true;
      }
      if (downList.includes(user)) {
        this.cgRound.downList = downList.filter(x => x !== user);
        if (type === "down") isUnVoteDown = true;
      }

      if (!isUnVoteUp && !isUnVoteDown) {
        if (type === "up") {
          upList.push(user);
          this.cgRequestVote(true, false);
        } else {
          downList.push(user);
          this.cgRequestVote(false, false);
        }
      } else {
        if (isUnVoteUp) {
          this.cgRequestVote(true, true);
        } else {
          this.cgRequestVote(false, true);
        }
      }

    },
    cgRequestVote(isUp, isDelete) {
      this.cgSaveLoading = true;

      axios.post(Vue.preUrl + "/cgVote", {
        date: this.cg.date,
        round: this.cgCurrentRound,
        submit: `${this.cgApprovingIndex}_${this.cgRound.creator}`,
        isUp,
        isDelete
      })
      .then(res => {
        // nada?
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
        this.cgSaveLoading = false;
      });

    },
    cgUserNewSubmit(copy = false) {
      this.cgIsApproving = false;
      if (copy) {
        this.cgClearRoundToSave();
        delete this.cgRound.creator;
        this.cgRound.races.map((race, raceIndex) => {

          this.cgRoundToSave.push({
            type: "oppoCar",
            rid: race.rid,
            tune: race.tune,
            raceIndex: raceIndex
          })
          this.cgRoundToSave.push({
            type: "oppoTime",
            time: race.time,
            raceIndex: raceIndex
          })
          this.cgRoundToSave.push({
            type: "track",
            track: race.track,
            raceIndex: raceIndex
          })

        })
      } else {
        this.cgRound = this.cg.rounds[this.cgCurrentRound];
        this.cgResolveRoundCars();
        this.checkRaceTimesNull();
      }

      if (this.user && this.user.mod) {
        this.cgNewSubmitByMod = true;
        if (copy) {
          this.cgNewSubmitByModTemplate = JSON.parse(JSON.stringify(this.cgRound));
        }
      }
    },
    cgSubmitCompleteJson() {
      let json = JSON.parse(this.cgCompleteJson);
      let oppos = json.ladder.opponents;
      // let list = oppos.map(x => x.cardId);
      // list = [...new Set(list)];
      let newCg = JSON.parse(JSON.stringify(this.cg));
      // let AllCarsFiltered = [];
      let zoneSize = json.ladder.zoneSize;

      // this.all_cars.map(x => {
      //   if (list.includes(x.guid)) {
      //     AllCarsFiltered.push(JSON.parse(JSON.stringify(x)));
      //   }
      // })

      let count = 0;
      let errorCount = 0;
      let shouldStop = false;
      let errorMsgArray = [];
      let roundErrorCount = 0;
      function computeError(msg) {
        errorCount++;
        roundErrorCount++;
        if (roundErrorCount > 1) shouldStop = true;
        errorMsgArray.push(msg);
      }
      if (this.cgCurrentRoundSum) {
        count = this.cgCurrentRoundSum * 5;
      }

      newCg.rounds.map((round, iround) => {
        let _iRound = iround
        if (this.cgCurrentRoundSum) {
          _iRound = this.cgCurrentRoundSum+_iRound;
        }

        if (!json.ladder.challengeSetIds[Math.floor(_iRound / zoneSize)]) return;

        round.uuidTrackSet = json.ladder.challengeSetIds[Math.floor(_iRound / zoneSize)];
        round.hCriteria = json.ladder.zoneFlexibleCriteria[Math.floor(_iRound / zoneSize)];
        round.rqLimit = json.ladder.zoneEligibility[Math.floor(_iRound / zoneSize)].targetRQ;
        roundErrorCount = 0;

        round.races.map((race, irace) => {
          let op = oppos[count];
          
          let tune = `${(op.engineMajor * op.engineMinor) / 3}${(op.weightMajor * op.weightMinor) / 3}${(op.chassisMajor * op.chassisMinor) / 3}`
          let car = Vue.all_carsObj[Vue.ridByGuid[op.cardId]];
          if (car) {
            let allowedTunes = ["332", "323", "233", "000"];
            if (car.class === 'S' || car.class === 'A') {
              allowedTunes.push("111")
            }
            if (!allowedTunes.includes(tune)) {
              if (tune.length > 3) {
                tune = `Other`;
              } else {
                tune = `Other${tune}`;
              }
            }
            if (round.lastAnalyze) {
              if (race.rid && race.rid !== car.rid) computeError(`RID round${_iRound+1} race${irace+1} old:      ${race.rid}     n:     ${car.rid}`);
            }

            
            race.rid = car.rid;
            race.tune = tune;
            // race.time = null;
            race.track = null;
            // race.cars = [];
          }
          count++;
        })
      })

      if (errorCount > 3 || shouldStop) {
        console.log(errorMsgArray);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: "Too much errors: " + errorCount,
          type: "error"
        });
        return;
      }

      this.cg = newCg;
      this.cgList.find(x => {
        if (x.date === newCg.date) {
          x = newCg;
          return true;
        }
      })

      this.cgSaveLoading = true;

      axios.post(Vue.preUrl + "/setCgPredict", newCg)
      .then(res => {
        this.loadChallengeFull(this.cgCurrentId, this.cgCurrentRound);
        this.cgCompleteJson = "";
        this.forceShowAnalyse = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.user.mod ? this.$t('m_saveSuccess') : this.$t('m_sentReview')
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
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.cgSaveLoading = false;
      });



      console.log(newCg);
      
    },
    cgSubmitRoundResultJson() {
      this.cgJsonDownloadRids = [];
      this.cgRoundResultJsonErrorTxt = "";
      if (!this.cgRoundResultJson) return;


      Number.prototype.toHHMMSS = function () {
        var numm = Number(this.toFixed(3).slice(0,-1))
        var sec_num = parseInt(numm, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - hours * 3600) / 60);
        var seconds = sec_num - hours * 3600 - minutes * 60;
        var milesi = Math.round((numm - parseInt(numm)) * 100);
        // if (this * 10000 - Math.round(this) * 10000 >= -5) {
        //   milesi = 0;
        //   seconds += 1;
        // }

        if (hours < 10) {
          hours = '0' + hours;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        if (milesi < 10) {
          milesi = '0' + milesi;
        }
        return minutes + ':' + seconds + ':' + milesi;
      };
      Number.prototype.toTestBowl = function () {
        return parseInt(this * 2.2369)
      };

      let result = JSON.parse(this.cgRoundResultJson);
      result.resultData.roundData.map((race, irace) => {
        console.log(`result.resultData.roundData.map, ${irace+1}`);
        this.resolveCar(race, irace);
      })

      this.afterResolveCarJson(result);
    },
    resolveCar(race, irace) {
      Array.from(Array(2)).map((_, i) => {
        let allowedTunes = ["332", "323", "233", "000"];
        let key = i === 0 ? "opponentData" : "playerData";

        let ss = race[key].id;
        let cardId = ss.slice(0,36);
        let car = Vue.all_carsObj[Vue.ridByGuid[cardId]];
        if (!car) return;
        car = JSON.parse(JSON.stringify(car));
        console.log(`${key}, irace: ${irace+1}, ${car.rid}`);

        if (car.class === 'S' || car.class === 'A') {
          allowedTunes.push("111")
        }
        let tune = `${(ss[36] * ss[38]) / 3}${(ss[40] * ss[42]) / 3}${(ss[44] * ss[46]) / 3}`
        if (!tune || tune.length > 3) {
          console.log(`tune ${tune}`);
          tune = `Other`;
        }
        car.selectedTune = tune;
        console.log(`car.selectedTune ${car.selectedTune}`);
        // car.photo = Vue.carPhoto(car);
        // car.color = Vue.resolveClass(car.rq, car.class, "color");
        race[key].car = car;
        let isTestBowl = race[key].distance >= 2546 && race[key].distance <= 2548.7;
        let isDnf = race[key].result !== 'Finished';
        
        if (isDnf) {
          race[key].timeText = "DNF";
        } else {
          if (isTestBowl) race[key].timeText = race[key].speed.toTestBowl();
          else {
            race[key].timeText = race[key].time.toHHMMSS();
            if (/\.\d\d95$/.test(`${race[key].time}`)) {
              this.cgRoundResultJsonErrorTxt += `${key} race${irace+1} !95\n`
            }
          }
        }
        
        if (key === "opponentData") {
          console.log(`key === "opponentData"`);
          if (this.cgRound.races[irace].rid !== race[key].car.rid) {
            console.log(`this.cgRound.races[irace].rid !== race[key].car.rid`);
            this.cgAddingOppoCar = true;
            this.cgAddingYouCar = false;
            this.cgRaceSelected = irace;
            this.addCarCg(race[key].car, true);
          } else {
            console.log(`rid oppo correct`);
          }
        }
        if (key === "playerData") {
          console.log(`key === "playerData"`);
          this.cgAddingOppoCar = false;
          this.cgAddingYouCar = true;
          this.cgRaceSelected = irace;
          this.addCarCg(race[key].car, true);
        }


        

      });
    },
    afterResolveCarJson(result, count = 0) {
      if (count > 10) return;
      
      let isDownloaded = this.cgJsonDownloadRids.length === 0;

      if (!isDownloaded) {
        console.log("this.cgJsonDownloadRids", this.cgJsonDownloadRids);
        setTimeout(() => {
          this.afterResolveCarJson(result, count+1)
        }, 1000);
        return;
      }

      // all downloaded
      result.resultData.roundData.map((race, irace) => {
        Array.from(Array(2)).map((_, i) => {
          let key = i === 0 ? "opponentData" : "playerData";
          let cgRace = this.cgRound.races[irace];

          // if (cgRace.track.includes("testBowl")) {
          //   this.cgRoundResultJsonErrorTxt += `testBowl race${irace+1}\n`
          // }

          let resultTimeNum = Vue.options.filters.toTimeNumber(`${race[key].timeText}`, cgRace.track);

          if (key === "opponentData") {
            if (cgRace.rid !== race[key].car.rid) {
              debugger;
              return;
            }
            if (cgRace.time === null || cgRace.time === undefined) {
              // change time
              cgRace.time = resultTimeNum;
              this.cgChangeTimeOppo(cgRace, { number: resultTimeNum, item: { id: cgRace.track.slice(0, -4), surface: cgRace.track.slice(-2, -1), cond: cgRace.track.slice(-1) } })

            } else if (cgRace.time !== resultTimeNum) {
              // doesnt change
              console.log(`${key} race${irace+1}`, "cgRace.time:", cgRace.time, "resultTimeNum:", resultTimeNum);
              this.cgRoundResultJsonErrorTxt += `${key} race${irace+1} diff\n`
            }
          } else {
            let carCache = Vue.all_cacheObj[race[key].car.rid];

            let allowedTunes = ["332", "323", "233"];
            let carFinal = race[key].car;
            let tune = race[key].car.selectedTune;
            if (carFinal.class === 'S' || carFinal.class === 'A') allowedTunes.push("111")
            if (!allowedTunes.includes(tune)) return;

            if (
              !carCache.data[tune] ||
              !carCache.data[tune].times ||
              !carCache.data[tune].times[cgRace.track]
            ) {
              // change time
              setTimeout(() => {
                this.cgChangeTimeYou(cgRace, { number: resultTimeNum, item: { id: cgRace.track.slice(0, -4), surface: cgRace.track.slice(-2, -1), cond: cgRace.track.slice(-1) } });
                
              }, 10);

            } else if (carCache.data[tune].times[cgRace.track].t !== resultTimeNum) {
              console.log(`${key} race${irace+1}`, "car time:", carCache.data[tune].times[cgRace.track].t, "resultTimeNum:", resultTimeNum);
              this.cgRoundResultJsonErrorTxt += `${key} race${irace+1} diff\n`;
            }
            
          }
    

        });
      })

      this.cgRound.races.map(race => {
        this.calcRaceResult(race, false);
      })

      if (this.cgRoundResultJsonErrorTxt) {
        this.cgRoundResultJsonErrorTxt = this.cgRoundResultJsonErrorTxt.slice(0,-1);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: this.cgRoundResultJsonErrorTxt,
          type: "error",
          time: 10000
        });
      }

      this.cgRoundResultJson = "";
      this.forceShowAnalyse = false;


    },
    styleCgList() {
      let chooseColors = {};
      let colors = ["#c29cff", "#a9d0ff", "#8dcf8f", "#bfbb3d", "#57d7d7", "#ff8b8b"];
      this.cgList.sort((a,b) => {
        return a.name.localeCompare(b.name);
      })
      this.cgList.map(x => {
        let styl = x.name;
        Vue.set(x, "index", 10);
        if (x.name.substr(0, 5) === 'GTT: ') {
          Vue.set(x, "index", 50);
          styl = `<span class="Cg_EX">GTT: </span>${x.name.substr(5)}`
        }
        if (x.name.substr(0, 11) === 'Yellowbird ') {
          Vue.set(x, "index", 103);
          styl = `<span class="Cg_YB">Yellowbird </span>${x.name.substr(11)}`
        }
        if (x.name.substr(0, 14) === 'Skyline Nismo ') {
          Vue.set(x, "index", 104);
          styl = `<span class="Cg_SN">Skyline Nismo </span>${x.name.substr(14)}`
        }
        if (x.name.substr(0, 17) === 'Proving Grounds: ') {
          Vue.set(x, "index", 105);
          styl = `<span class="Cg_PG">Proving Grounds: </span>${x.name.substr(17)}`
        }
        Vue.set(x, "nameStyled", styl);
        if (x.color){
          let ico = colors.indexOf(x.color);
          if (ico > -1) {
            colors.splice(ico, 1);
          }
        }
      })

      let roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX", "XXXI", "XXXII", "XXXIII", "XXXIV", "XXXV", "XXXVI", "XXXVII", "XXXVIII", "XXXIX", "XL"];

      this.cgList.map(x => {
        let split = x.name.split(" ");
        let romanString = null;
        let numberOrdinal = null;

        x.indexOfRoman = split.findIndex(part => {
          part = part.replace(":", "");
          if (roman.includes(part.slice(1 ,-1)) && part[0] === "(") {
            romanString = part.slice(1 ,-1);
            return true;
          }
          if (Number(part.slice(1 ,-1)) > -1 && part[0] === "(") {
            numberOrdinal = Number(part.slice(1 ,-1));
            return true;
          }
        });

        if ( x.indexOfRoman > -1 ) {
          // contain roman
          x.romanValue = roman.indexOf(romanString)+1;
          if (numberOrdinal || numberOrdinal === 0) x.romanValue = numberOrdinal;

          let arr = x.name.split(" ");
          let i = arr.findIndex(x => x.includes(":"));
          x.prefix = arr.filter((x, ix) => ix <= i).join(" ");
          x.prefix = x.prefix.replaceAll(":", "");

          Vue.set(x, "index", 20);
          if (x.prefix.includes("Niklas")) Vue.set(x, "index", 21);
        }
        
        let xIndex = x.name.indexOf(":");
        if (typeof x.romanValue === 'number') {
          let num = this.generateRandom(colors.length-1, x.prefix || "");
          let color;
          if (x.color) chooseColors[x.prefix] = x.color;
          if (chooseColors[x.prefix]) color = chooseColors[x.prefix];
          else {
            color = colors[num];
            chooseColors[x.prefix] = color;
            colors.splice(num, 1)
          }
          Vue.set(x, "nameStyled", `<span style="color: ${color}">${x.name.slice(0, xIndex+1)}</span>${x.name.slice(xIndex+1)}`);
        }
      })

      this.cgList.sort((a,b) => {

        if (a.prefix && b.prefix && a.prefix === b.prefix) {
          return a.romanValue - b.romanValue;
        }
        if (a.index === b.index) {
          if (a.prefix && b.prefix) {
            return a.prefix.localeCompare(b.prefix);
          }
          return a.name.localeCompare(b.name);
        }
        return a.index - b.index;
      })
      
    },
    cgExportSolutionsToPacks() {
      let rids = [];
      let cars = [];
      this.cgRound.races.map(race => {
        race.cars.map(car => {
          if (car.points > 0) {
            cars.push(car);
          }
        })
      })
      cars = cars.filter(car => {
        if (rids.includes(car.rid)) return false;
        rids.push(car.rid);
        return true;
      })

      this.$router.push({ name: "Packs", params: { cars } })
    },
    generateRandom(maxInt, stringParam) {
      let sum = 0;
      for (let i = 0; i < stringParam.length; i++){
        sum += stringParam.charCodeAt(i);
      }
      let result = sum % (maxInt+1);
      return result;
    },
    loadEvents(resolveInitial = true, after) {
      this.eventLoading = true;

      axios.get(Vue.preUrlCharlie + "/searchEvents")
      .then(res => {
        this.eventList = res.data.value;

        if (this.$store.state.showUpcomingTags && this.user && this.user.username === 'TiagoXavi') {
          this.eventParsedList.push({ "rqLimit": 444, "trackset": [ [ "drag30130_a00", "mtSlalom_a00", "gForcer_a00", "mnGforce_a00", "mnCity_a01" ], [ "tCircuit_a00", "gForce_a00", "fast_a01", "mtSlalom_a01", "hairpin_a01" ], [ "mtHairpin_a00", "mtSlalom_a00", "mtTwisty_a01", "tRoad_a01", "kart_a01" ], [ "forest_a00", "kart_a00", "mtSlalom_a00", "mtHairpin_a01", "carPark_a01" ] ], "filter2": { "name": "1x", "prizesModel": [ "Prize Cars", "Non-Prize Cars" ] }, "user": "TiagoXavi", "comp": [ { "tyres": [ "Performance", "Slick" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Speedster" ] }, { "tyres": [ "Performance", "Slick" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Standard" ], "clearance": [], "drives": [ "4WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Standard" ], "clearance": [], "drives": [ "4WD" ], "meta": [ "Twister" ] } ], "name": "Fantastic Ford", "startDateTime": "2025-07-25T20:00:00.000Z", "flexibleCriteriaRequired": [ 4 ], "icons": [ "asphalt", "rain" ], "date": "fantastic_ford", "image": "EventFord", "realDate": "2025-07-22T20:27:12.983Z", "filter": { "brandsModel": [ "Ford" ], "name": "4x" }, "bucketSize": 100, "filteringQueryStrings": [ "[\"((\\\"manufacturerguid\\\"=\\\"3b3d7baa-939d-44f3-b77b-75fc081d0c8b\\\"))\"]" ], "tag": "Standard", "eid": "t", "endDateTime": "2025-07-27T20:00:00.000Z", "hidden": false, "ticketRegenerationTime": 1800000 })
          this.eventParsedList.push({ "rqLimit": 400, "trackset": [ [ "drag50150_a00", "tokyoDrag_a01", "fast_a01", "tokyoLoop_a01", "slalom_a01" ], [ "fast_a00", "kart_a01", "csSmall_a00", "tokyoGforce_a01", "csMed_a01" ], [ "drag150b_a00", "tokyoDrag_a01", "tokyoOverpass_a00", "tokyoBridge_a01", "tokyoLoop_a01" ], [ "tokyoDrag_a01", "mile4_a01", "tokyoOverpass_a00", "tCircuitr_a00", "tokyoBridge_a01" ] ], "user": "TiagoXavi", "comp": [ { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Dragster" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Dragster" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Speedster" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "4WD" ], "meta": [ "Speedster" ] }, { "tyres": [ "Standard" ], "clearance": [], "drives": [ "4WD" ], "meta": [ "Twister" ] } ], "name": "IRGP Endurance Cup", "startDateTime": "2025-07-24T20:00:00.000Z", "flexibleCriteriaRequired": [ 5, 5, 5 ], "icons": [ "rain", "asphalt" ], "date": "irgp_endurance_cup", "image": "EventOverloaded", "realDate": "2025-07-24T18:03:25.843Z", "filter": { "tagsModel": [ "German Renaissance", "Italian Renaissance" ], "tyresModel": [ "Performance", "Standard" ], "prizesModel": [ "Non-Prize Cars" ] }, "bucketSize": 128, "filteringQueryStrings": [ "[\"((\\\"tags\\\"=\\\"200000\\\"|\\\"tags\\\"=\\\"400000\\\"))\"]", "[\"((\\\"tyretype\\\"=\\\"HiPerformance\\\"|\\\"tyretype\\\"=\\\"Tourism\\\"))\"]", "[\"((\\\"isprizecar\\\"=\\\"0\\\"))\"]" ], "tag": "Special LiveOps", "eid": "t", "endDateTime": "2025-07-27T20:00:00.000Z", "hidden": false, "ticketRegenerationTime": 900000 })
          this.eventParsedList.push({ "eid": "t", "date": "lucky_number_seven", "bucketSize": 100, "comp": [ { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Dragster" ], "tyres": [ "Performance", "Slick" ] }, { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Dragster" ], "tyres": [ "Performance", "Slick" ] }, { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Speedster" ], "tyres": [ "Performance", "Slick" ] }, { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Twister" ], "tyres": [ "Performance", "Slick" ] }, { "clearance": [ "Low" ], "drives": [ "4WD" ], "meta": [ "Speedster" ], "tyres": [ "Performance" ] } ], "endDateTime": "2025-07-19T20:00:00.000Z", "filter": { "year2Model": [ 2017, 2007, 1997, 1987, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979 ] }, "filteringQueryStrings": [ "[\"((\\\"year\\\"=\\\"2017\\\"))\"]", "[\"((\\\"year\\\"=\\\"2007\\\"))\"]", "[\"((\\\"year\\\"=\\\"1997\\\"))\"]", "[\"((\\\"year\\\"=\\\"1987\\\"))\"]", "[\"((\\\"year\\\"=\\\"1970-1979\\\"))\"]" ], "flexibleCriteriaRequired": [ 1, 1, 1, 1, 1 ], "hidden": true, "icons": [ "asphalt", "rain" ], "image": "Event70s", "name": "Lucky Number Seven", "realDate": "2025-07-14T20:16:31.182Z", "rqLimit": 365, "startDateTime": "2025-07-17T20:00:00.000Z", "tag": "Standard", "ticketRegenerationTime": 1800000, "trackset": [ [ "mile2_a00", "mile4_a00", "mnCity_a00", "mnCityNarrow_a00", "mnHairpin_a01" ], [ "testBowl_a00", "mile2_a00", "mile4_a00", "tRoad_a00", "drag100b_a01" ], [ "testBowl_a00", "drag100_a00", "kart_a00", "slalom_a00", "drag100b_a01" ], [ "mile1_a00", "oceanLongDrag_a00", "mile4_a00", "fast_a00", "fast_a01" ] ], "user": "TiagoXavi" })
          this.eventParsedList.push({ "eid": "t", "date": "lancer_evolution_ii_group_a_quals", "bucketSize": 300, "comp": [ { "clearance": [ ], "drives": [ "2WD" ], "meta": [ "Twister" ], "tyres": [ "Standard", "Off-road" ] }, { "clearance": [ ], "drives": [ "4WD" ], "meta": [ "Speedster" ], "tyres": [ "Standard", "All-surface" ] }, { "clearance": [ ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "Standard" ] }, { "clearance": [ ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "Off-road" ] }, { "clearance": [ ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "Off-road" ] } ], "endDateTime": "2025-06-29T20:00:00.000Z", "filter": { "tagsModel": [ "Asia-Pacific Grand Prix" ], "tyresModel": [ "Standard", "All-surface", "Off-road" ] }, "filteringQueryStrings": [ "[\"((\\\"tags\\\"=\\\"1000000000000\\\"))\"]", "[\"((\\\"tyretype\\\"=\\\"Tourism\\\"|\\\"tyretype\\\"=\\\"All-Surface\\\"|\\\"tyretype\\\"=\\\"Offroad\\\"))\"]" ], "flexibleCriteriaRequired": [ 5, 5 ], "hidden": false, "icons": [ "rain", "dirt", "asphalt" ], "image": "EventTriSeries", "name": "Lancer Evolution II Group A Quals", "realDate": "2025-06-26T17:28:29.560Z", "rqLimit": 350, "startDateTime": "2025-06-26T20:00:00.000Z", "tag": "Tri-Series", "ticketRegenerationTime": 1800000, "trackset": [ [ "mtSlalom_a00", "mtHairpin_a01", "mtTwisty_a01", "rallySmall_a40", "forestRiver_a41" ], [ "gForce_a00", "canyonTour_a01", "tRoad_a01", "butte_a40", "slalom_a50" ], [ "hairpin_a00", "hairpin_a01", "tRoad_a01", "hairpin_a60", "tRoad_a60" ], [ "mtTwisty_a00", "dealsGapBack_a41", "dealsGap_a01", "forestRiver_a41", "mtHairpin_a10" ] ], "user": "TiagoXavi" })
          this.eventParsedList.push({ "eid": "t", "date": "eliminator_heat_1", "bucketSize": 1000, "comp": [ { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Speedster" ], "tyres": [ "Performance", "Slick" ] }, { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Speedster" ], "tyres": [ "Performance", "Slick" ] }, { "clearance": [ "Mid" ], "drives": [ "2WD" ], "meta": [ "Twister" ], "tyres": [ "Standard" ] }, { "clearance": [ "Mid" ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "Standard" ] }, { "clearance": [ "High" ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "All-surface", "Off-road" ] } ], "endDateTime": "2025-08-14T20:00:00.000Z", "filter": { "classesModel": [ "F", "E" ], "prizesModel": [ "Non-Prize Cars" ] }, "filteringQueryStrings": [ "[\"((\\\"isprizecar\\\"=\\\"0\\\"))\"]", "[\"((\\\"tier\\\"=\\\"1\\\"|\\\"tier\\\"=\\\"2\\\"))\"]" ], "flexibleCriteriaRequired": [ 5, 5 ], "hidden": false, "icons": [ "asphalt", "rain", "clearanceW" ], "image": "ChallengeCategoryRacingRoyalty", "name": "Eliminator Heat 1", "realDate": "2025-08-12T16:49:45.067Z", "rqLimit": 150, "startDateTime": "2025-08-12T20:00:00.000Z", "tag": "Special LiveOps", "ticketRegenerationTime": 1800000, "trackset": [ [ "mile4_a00", "fast_a00", "csMed_a01", "carPark_a01", "slalom_a20" ], [ "oceanHighway_a00", "mnCityNarrow_a00", "oceanCity_a00", "mnHairpin_a01", "oceanSlalom_ac1" ], [ "tRoad_a00", "carPark_a00", "csSmall_a01", "csMed_a01", "tRoad_a11" ], [ "mile4_a00", "mile2_a00", "fast_a01", "gForce_a01", "moto_a11" ] ], "user": "TiagoXavi" })
          this.eventParsedList.push({ "eid": "t", "date": "eliminator_heat_2", "bucketSize": 800, "comp": [ { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Dragster" ], "tyres": [ "Performance" ] }, { "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Twister" ], "tyres": [ "Performance", "Slick" ] }, { "clearance": [ ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "Standard" ] }, { "clearance": [ ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "Standard" ] }, { "clearance": [ ], "drives": [ "4WD" ], "meta": [ "Twister" ], "tyres": [ "Off-road" ] } ], "endDateTime": "2025-08-16T20:00:00.000Z", "filter": { "prizesModel": [ "Non-Prize Cars" ], "tagsModel": [ "Amalfi Coast Cruising", "Enter the Black Forest", "Learn the Savannah Way", "Loch to Loch", "Pacific Coast Highway", "World Expo" ] }, "filteringQueryStrings": [ "[\"((\\\"isprizecar\\\"=\\\"0\\\"))\"]", "[\"((\\\"tags\\\"=\\\"800000000000\\\"|\\\"tags\\\"=\\\"400000000000\\\"|\\\"tags\\\"=\\\"200000000000\\\"|\\\"tags\\\"=\\\"100000000000\\\"|\\\"tags\\\"=\\\"40000000000\\\"|\\\"tags\\\"=\\\"80000000000\\\"|))\"]" ], "flexibleCriteriaRequired": [ 5, 5 ], "hidden": false, "icons": [ "asphalt", "rain", "snow" ], "image": "ChallengeCategoryRacingRoyalty", "name": "Eliminator Heat 2", "realDate": "2025-08-14T20:35:11.876Z", "rqLimit": 230, "startDateTime": "2025-08-14T20:00:00.000Z", "tag": "Special LiveOps", "ticketRegenerationTime": 1800000, "trackset": [ [ "mile1_a00", "tRoad_a00", "hairpin_a01", "tRoad_a01", "hairpin_a60" ], [ "mile1_a00", "tRoad_a00", "hairpin_a01", "tRoad_a01", "tRoad_a60" ], [ "mile1_a00", "tRoad_a00", "hairpin_a01", "tRoad_a01", "tRoad_a60" ], [ "mtHill_a01", "mtHairpin_a00", "lumberForest_a40", "lumberRiver_a11", "lumberForest_ah1" ] ], "user": "ELtotheLIS" })
          this.eventParsedList.push({ "rqLimit": 350, "trackset": [ [ "mile1r_a00", "tokyoDrag_a00", "mile4r_a00", "tokyoOffRamp_a01", "tokyoGforce_a01" ], [ "mile1_a00", "mnCity_a00", "mnGforce_a00", "mile4_a01", "slalom_a01" ], [ "mile2_a00", "mile4_a00", "fastr_a00", "tCircuit_a01", "tRoad_a01" ], [ "miCauseDrag_a00", "miCause_a00", "tRoad_a00", "miStreets1_a01", "miGforce_a01" ] ], "user": "TiagoXavi", "comp": [ { "tyres": [ "Performance", "Slick" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Dragster" ] }, { "tyres": [ "Performance", "Slick" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Speedster" ] }, { "tyres": [ "Performance", "Slick" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Speedster" ] }, { "tyres": [ "Performance" ], "clearance": [], "drives": [ "4WD" ], "meta": [ "Speedster" ] }, { "tyres": [ "Standard" ], "clearance": [], "drives": [], "meta": [ "Twister" ] } ], "name": "Wrath Of The Coupe", "startDateTime": "2025-08-19T20:00:00.000Z", "flexibleCriteriaRequired": [ 5, 5 ], "icons": [ "asphalt", "rain" ], "date": "wrath_of_the_coupe", "image": "EventTwoTone", "realDate": "2025-08-16T23:47:57.615Z", "filter": { "countrysModel": [ "FR", "IT" ], "bodyTypesModel": [ "Coupe" ] }, "bucketSize": 100, "filteringQueryStrings": [ "[\"((\\\"country\\\"=\\\"France\\\"|\\\"country\\\"=\\\"Italy\\\"))\"]", "[\"((\\\"bodystyle\\\"=\\\"Coupe\\\"))\"]" ], "tag": "Collection Series", "eid": "t", "endDateTime": "2025-08-21T20:00:00.000Z", "hidden": false, "ticketRegenerationTime": 1800000 })
          this.eventParsedList.push({ "rqLimit": 500, "trackset": [ [ "tCircuit_a00", "hairpin_a00", "mnGforce_a00", "gForce_a00", "slalom_a00" ], [ "tCircuit_a00", "carPark_a00", "mnGforce_a00", "gForce_a00", "slalom_a00" ], [ "nwCathedral_a00", "tCircuit_a00", "nwSlalom_a00", "gForce_a00", "nwGforce_a00" ], [ "fast_a00", "nwLoop_a00", "nwSlalom_a00", "nwCircuit_a00", "nwGforce_a00" ] ], "filter2": { "name": "2x", "drivesModel": [ "4WD" ], "countrysModel": [ "JP" ], "tyresModel": [ "Performance" ], "prizesModel": [ "Non-Prize Cars" ] }, "user": "TiagoXavi", "filter3": { "name": "2x", "drivesModel": [ "4WD" ], "countrysModel": [ "FR" ], "tyresModel": [ "Performance" ], "prizesModel": [ "Non-Prize Cars" ] }, "comp": [ { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "4WD" ], "meta": [ "Speedster" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "4WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "4WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "4WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Performance" ], "clearance": [ "Low" ], "drives": [ "4WD" ], "meta": [ "Twister" ] } ], "name": "Eliminator Finals", "startDateTime": "2025-08-20T20:00:00.000Z", "flexibleCriteriaRequired": [ 5, 5, 2, 2, 5, 5 ], "icons": [ "asphalt" ], "date": "eliminator_finals", "image": "ChallengeCategoryRacingRoyalty", "realDate": "2025-08-20T20:06:33.182Z", "filter": { "countrysModel": [ "JP", "FR" ], "weightEnd": 7000, "clearancesModel": [], "fuel": [ "Bioethanol", "Diesel", "Electric", "Hybrid", "Hydrogen", "Misc", "Petrol" ], "tyresModel": [ "Performance" ], "customTagsModel": [], "yearModel": [ 1910, 2025 ], "tags_challenge": [ "5th Anniversary", "Around the World", "As Seen on YT", "Call of the Wild", "Chariots of the Gods", "Christmas Collection", "Christmas Collection 22", "Coast to Coast", "Cutting Edge", "Desperados", "Electric Excellence", "Famous Tracks", "Filberto's Collection", "Gaz's Collection", "Gunter's Collection", "Harriet's Collection", "Heavy Metal", "Hugo's Collection", "Immortalised in Carbon", "In the Shadows", "In the Shadows 24", "Interstellar", "Legrand's Collection", "Lina's Collection", "Lina's Collection 2", "Loves Me, Loves Me Not", "Marilyn's Collection", "New Beginnings", "Nightmare Fuel", "Niklas' Collection", "Niklas' Collection 2", "Old Guard", "Photo Finish", "Racing Royalty", "Reclassified", "Ride of the Valkyries", "Riders on the Storm", "Roads Most Travelled", "Sara's Collection", "Silver Screen", "Summer Games", "Summer Games 24", "Summer Games 25", "The Great Outdoors", "The Horror Show", "The Unicorns", "Touma's Collection", "Trading Paint", "Two Tone", "Ximena's Collection", "Year of the Dragon", "Year of the Ox", "Year of the Rabbit", "Year of the Rat", "Year of the Snake", "Year of the Tiger" ], "tags2Model": [], "typesModel": [], "tcsModel": [], "yearStart": 1910, "topSpeedModel": [ 25, 330 ], "handEnd": 110, "mraEnd": 160, "fuelModel": [], "prizesModel": [ "Non-Prize Cars" ], "tags": [ "5th Anniversary", "Around the World", "As Seen on YT", "Call of the Wild", "Chariots of the Gods", "Christmas Collection", "Christmas Collection 22", "Coast to Coast", "Cutting Edge", "Desperados", "Electric Excellence", "Famous Tracks", "Filberto's Collection", "Gaz's Collection", "Gunter's Collection", "Harriet's Collection", "Heavy Metal", "Hugo's Collection", "Immortalised in Carbon", "In the Shadows", "In the Shadows 24", "Interstellar", "Legrand's Collection", "Lina's Collection", "Lina's Collection 2", "Loves Me, Loves Me Not", "Marilyn's Collection", "New Beginnings", "Nightmare Fuel", "Niklas' Collection", "Niklas' Collection 2", "Old Guard", "Photo Finish", "Racing Royalty", "Reclassified", "Ride of the Valkyries", "Riders on the Storm", "Roads Most Travelled", "Sara's Collection", "Silver Screen", "Summer Games", "Summer Games 24", "Summer Games 25", "The Great Outdoors", "The Horror Show", "The Unicorns", "Touma's Collection", "Trading Paint", "Two Tone", "Ximena's Collection", "Year of the Dragon", "Year of the Ox", "Year of the Rabbit", "Year of the Rat", "Year of the Snake", "Year of the Tiger", "French Riviera", "Asia-Pacific Revival", "European Grand Tour", "American Overdrive", "European New Wave", "Asia-Pacific Grand Prix", "Pacific Coast Highway", "Learn the Savannah Way", "Loch to Loch", "Amalfi Coast Cruising", "Enter the Black Forest", "World Expo", "Japan Pro Tour", "American Frontier", "European Revolution", "Great Exhibition", "Italian Renaissance", "German Renaissance", "French Renaissance", "American Dream", "Originals", "Concept", "Drivers Choice", "Eco Friendly", "Hot Hatch", "Hypercar", "Iconic Variant", "Innovative", "Motorsport", "Muscle Car", "None", "Oddities", "Road", "Sleeper", "Street Racer", "Style Icon", "Team Favourite", "Track", "Ultra Expensive", "Wild Ride", "Rest of the World", "Sub-Zero", "Supercar", "Beige", "Black", "Blue", "Brown", "Gold", "Green", "Orange", "Pink", "Purple", "Red", "Silver/Grey", "Turquoise", "White", "Yellow" ], "brandsModel": [], "brake": [ "A", "B", "C" ], "tagsModel": [], "topSpeedEnd": 330, "drives": [ "FWD", "RWD", "4WD" ], "tags_expansion": [ "French Riviera", "Asia-Pacific Revival", "European Grand Tour", "American Overdrive", "European New Wave", "Asia-Pacific Grand Prix", "Pacific Coast Highway", "Learn the Savannah Way", "Loch to Loch", "Amalfi Coast Cruising", "Enter the Black Forest", "World Expo", "Japan Pro Tour", "American Frontier", "European Revolution", "Great Exhibition", "Italian Renaissance", "German Renaissance", "French Renaissance", "American Dream", "Originals" ], "prizes": [ "Prize Cars", "Non-Prize Cars" ], "name": "★", "clearances": [ "Low", "Mid", "High" ], "tags3Model": [], "tunesModel": [], "acelEnd": 40, "rqStart": 10, "tags_color": [ "Beige", "Black", "Blue", "Brown", "Gold", "Green", "Orange", "Pink", "Purple", "Red", "Silver/Grey", "Turquoise", "White", "Yellow" ], "tags_permanentDied": [ "Rest of the World", "Sub-Zero", "Supercar" ], "year2Model": [], "classes": [ "F", "E", "D", "C", "B", "A", "S" ], "classesModel": [], "handStart": 30, "countrys": [ "US", "DE", "JP", "GB", "IT", "FR", "AU", "SE", "KR", "CZ", "CN", "NL", "BR", "MY", "AT", "DK", "HR", "ZA", "NZ", "AE", "AR", "IN", "MX", "CH" ], "weightModel": [ 300, 7000 ], "brakeModel": [], "classesColors": [ "#878787", "#76F273", "#1CCCFF", "#FFF62B", "#FF3538", "#8C5CFF", "#FFAF17" ], "mraStart": 0, "seatsStart": 1, "engine": [ "Front", "Mid", "Mid-rear", "Mixed", "Rear" ], "handModel": [ 30, 110 ], "approveModel": false, "topSpeedStart": 25, "bodyTypesModel": [], "tyres": [ "Performance", "Standard", "All-surface", "Off-road", "Slick" ], "rqModel": [ 10, 119 ], "bodyTypes": [ "Convertible", "Coupe", "Estate", "Hatchback", "MPV", "Pickup", "Roadster", "Saloon", "SUV", "Van" ], "tunes": [ "332", "323", "233", "111", "Custom", "Best" ], "engineModel": [], "brands": [ "AC", "Acura", "Alfa Romeo", "Alpine", "AMC", "Apollo", "Arash", "Ariel", "Aston Martin", "Audi", "Austin", "BAC", "Bentley", "Bizzarrini", "BMW", "Brabham", "Bristol", "Bufori", "Bugatti", "Buick", "Cadillac", "Caterham", "Chevrolet", "Chrysler", "Citroen", "De Tomaso", "DMC", "Dodge", "Donkervoort", "Drako", "DS", "Eagle", "Fiat", "Ford", "Geo", "Ginetta", "Giocattolo", "GMC", "Hennessey", "Holden", "Honda", "Hudson", "Hummer", "Hyundai", "Infiniti", "Jaguar", "Koenigsegg", "KTM", "Lamborghini", "Lancia", "Land Rover", "Lincoln", "Lotus", "Maserati", "Matra", "Mazda", "McLaren", "McMurtry", "Mercedes-Benz", "Mercury", "MG", "Mini", "Mitsubishi", "Mitsuoka", "Morgan", "Nissan", "Oldsmobile", "Pagani", "Peugeot", "Pininfarina", "Plymouth", "Pontiac", "Porsche", "Radical", "RAM", "Renault", "Rezvani", "Rimac", "Rover", "RUF", "Saleen", "Saturn", "SCG", "Skoda", "Smart", "Spyker", "Subaru", "Suzuki", "Talbot", "TVR", "Ultima", "Vauxhall", "Volkswagen", "Volvo", "W Motors", "Zenos", "Zenvo" ], "rqEnd": 119, "yearEnd": 2025, "drivesModel": [ "4WD" ], "seatsModel": [ 1, 9 ], "mraModel": [ 0, 160 ], "acelStart": 1.5, "acelModel": [ 1.5, 40 ], "absModel": [], "seatsEnd": 9, "seats2Model": [], "tags_permanent": [ "Concept", "Drivers Choice", "Eco Friendly", "Hot Hatch", "Hypercar", "Iconic Variant", "Innovative", "Motorsport", "Muscle Car", "None", "Oddities", "Road", "Sleeper", "Street Racer", "Style Icon", "Team Favourite", "Track", "Ultra Expensive", "Wild Ride" ], "weightStart": 300 }, "bucketSize": 100, "filteringQueryStrings": [ "[\"((\\\"isprizecar\\\"=\\\"0\\\"))\"]", "[\"((\\\"country\\\"=\\\"France\\\"|\\\"country\\\"=\\\"Japan\\\"))\"]", "[\"((\\\"country\\\"=\\\"France\\\"))\"]", "[\"((\\\"country\\\"=\\\"Japan\\\"))\"]", "[\"((\\\"tyretype\\\"=\\\"HiPerformance\\\"))\"]", "[\"((\\\"drivetype\\\"=\\\"FourWD\\\"))\"]" ], "tag": "Special LiveOps", "eid": "t", "endDateTime": "2025-08-22T20:00:00.000Z", "hidden": false, "ticketRegenerationTime": 1800000 })
          this.eventParsedList.push({ "rqLimit": 500, "trackset": [ [ "drag100_a00", "kart_a00", "csSmall_a00", "csMed_a01", "rallySmall_a40" ], [ "mile2_a00", "fast_a00", "mnCityLong_a00", "tCircuit_a01", "moto_a11" ], [ "hairpin_a00", "tRoad_a00", "mnCityLong_a00", "slalom_a01", "moto_a11" ], [ "drag100_a00", "indoorKart_a00", "csMed_a00", "csSmall_a01", "rallySmall_a40" ] ], "filter2": { "name": "2x", "countrysModel": [ "GB" ], "tagsModel": [ "European New Wave", "World Expo" ], "prizesModel": [ "Non-Prize Cars" ] }, "user": "TiagoXavi", "filter3": { "name": "2x", "countrysModel": [ "CZ" ], "tagsModel": [ "European New Wave", "World Expo" ], "prizesModel": [ "Non-Prize Cars" ] }, "comp": [ { "tyres": [ "Performance", "Slick" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Dragster" ] }, { "tyres": [ "Performance", "Slick" ], "clearance": [ "Low" ], "drives": [ "2WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Off-road" ], "clearance": [ "Mid" ], "drives": [], "meta": [ "Twister" ] }, { "tyres": [ "Standard" ], "clearance": [ "Mid" ], "drives": [ "4WD" ], "meta": [ "Twister" ] }, { "tyres": [ "Off-road" ], "clearance": [ "High" ], "drives": [ "4WD" ], "meta": [ "Twister" ] } ], "name": "GT Pro Circuit", "startDateTime": "2025-09-09T20:00:00.000Z", "flexibleCriteriaRequired": [ 5, 5, 5, 2, 2 ], "icons": [ "asphalt", "dirt" ], "date": "gt_pro_circuit", "image": "EventGTSeries", "realDate": "2025-09-09T17:08:41.697Z", "filter": { "countrysModel": [ "GB", "CZ" ], "weightEnd": 7000, "clearancesModel": [], "fuel": [ "Bioethanol", "Diesel", "Electric", "Hybrid", "Hydrogen", "Misc", "Petrol" ], "tyresModel": [], "customTagsModel": [], "yearModel": [ 1910, 2025 ], "tags_challenge": [ "5th Anniversary", "Around the World", "As Seen on YT", "Call of the Wild", "Chariots of the Gods", "Christmas Collection", "Christmas Collection 22", "Coast to Coast", "Cutting Edge", "Desperados", "Electric Excellence", "Famous Tracks", "Filberto's Collection", "Gaz's Collection", "Gaz's Collection 2", "Gunter's Collection", "Harriet's Collection", "Heavy Metal", "Hugo's Collection", "Immortalised in Carbon", "In the Shadows", "In the Shadows 24", "Interstellar", "Legrand's Collection", "Lina's Collection", "Lina's Collection 2", "Loves Me, Loves Me Not", "Marilyn's Collection", "Marilyn's Collection 2", "New Beginnings", "Nightmare Fuel", "Niklas' Collection", "Niklas' Collection 2", "Old Guard", "Photo Finish", "Racing Royalty", "Reclassified", "Ride of the Valkyries", "Riders on the Storm", "Roads Most Travelled", "Sara's Collection", "Silver Screen", "Summer Games", "Summer Games 24", "Summer Games 25", "The Great Outdoors", "The Horror Show", "The Unicorns", "Touma's Collection", "Trading Paint", "Two Tone", "Ximena's Collection", "Year of the Dragon", "Year of the Ox", "Year of the Rabbit", "Year of the Rat", "Year of the Snake", "Year of the Tiger" ], "tags2Model": [], "typesModel": [], "tcsModel": [], "yearStart": 1910, "topSpeedModel": [ 25, 330 ], "handEnd": 110, "mraEnd": 160, "fuelModel": [], "prizesModel": [ "Non-Prize Cars" ], "tags": [ "5th Anniversary", "Around the World", "As Seen on YT", "Call of the Wild", "Chariots of the Gods", "Christmas Collection", "Christmas Collection 22", "Coast to Coast", "Cutting Edge", "Desperados", "Electric Excellence", "Famous Tracks", "Filberto's Collection", "Gaz's Collection", "Gaz's Collection 2", "Gunter's Collection", "Harriet's Collection", "Heavy Metal", "Hugo's Collection", "Immortalised in Carbon", "In the Shadows", "In the Shadows 24", "Interstellar", "Legrand's Collection", "Lina's Collection", "Lina's Collection 2", "Loves Me, Loves Me Not", "Marilyn's Collection", "Marilyn's Collection 2", "New Beginnings", "Nightmare Fuel", "Niklas' Collection", "Niklas' Collection 2", "Old Guard", "Photo Finish", "Racing Royalty", "Reclassified", "Ride of the Valkyries", "Riders on the Storm", "Roads Most Travelled", "Sara's Collection", "Silver Screen", "Summer Games", "Summer Games 24", "Summer Games 25", "The Great Outdoors", "The Horror Show", "The Unicorns", "Touma's Collection", "Trading Paint", "Two Tone", "Ximena's Collection", "Year of the Dragon", "Year of the Ox", "Year of the Rabbit", "Year of the Rat", "Year of the Snake", "Year of the Tiger", "German Powerhaus", "French Riviera", "Asia-Pacific Revival", "European Grand Tour", "American Overdrive", "European New Wave", "Asia-Pacific Grand Prix", "Pacific Coast Highway", "Learn the Savannah Way", "Loch to Loch", "Amalfi Coast Cruising", "Enter the Black Forest", "World Expo", "Japan Pro Tour", "American Frontier", "European Revolution", "Great Exhibition", "Italian Renaissance", "German Renaissance", "French Renaissance", "American Dream", "Originals", "Concept", "Drivers Choice", "Eco Friendly", "Hot Hatch", "Hypercar", "Iconic Variant", "Innovative", "Motorsport", "Muscle Car", "None", "Oddities", "Road", "Sleeper", "Street Racer", "Style Icon", "Team Favourite", "Track", "Ultra Expensive", "Wild Ride", "Rest of the World", "Sub-Zero", "Supercar", "Beige", "Black", "Blue", "Brown", "Gold", "Green", "Orange", "Pink", "Purple", "Red", "Silver/Grey", "Turquoise", "White", "Yellow" ], "brandsModel": [], "brake": [ "A", "B", "C" ], "tagsModel": [ "European New Wave", "World Expo" ], "topSpeedEnd": 330, "drives": [ "FWD", "RWD", "4WD" ], "tags_expansion": [ "German Powerhaus", "French Riviera", "Asia-Pacific Revival", "European Grand Tour", "American Overdrive", "European New Wave", "Asia-Pacific Grand Prix", "Pacific Coast Highway", "Learn the Savannah Way", "Loch to Loch", "Amalfi Coast Cruising", "Enter the Black Forest", "World Expo", "Japan Pro Tour", "American Frontier", "European Revolution", "Great Exhibition", "Italian Renaissance", "German Renaissance", "French Renaissance", "American Dream", "Originals" ], "prizes": [ "Prize Cars", "Non-Prize Cars" ], "name": "★", "clearances": [ "Low", "Mid", "High" ], "tags3Model": [], "tunesModel": [], "acelEnd": 40, "rqStart": 10, "tags_color": [ "Beige", "Black", "Blue", "Brown", "Gold", "Green", "Orange", "Pink", "Purple", "Red", "Silver/Grey", "Turquoise", "White", "Yellow" ], "tags_permanentDied": [ "Rest of the World", "Sub-Zero", "Supercar" ], "year2Model": [], "classes": [ "F", "E", "D", "C", "B", "A", "S" ], "classesModel": [], "handStart": 30, "countrys": [ "US", "DE", "JP", "GB", "IT", "FR", "AU", "SE", "KR", "CZ", "CN", "NL", "BR", "MY", "AT", "DK", "HR", "ZA", "NZ", "AE", "AR", "IN", "MX", "CH" ], "weightModel": [ 300, 7000 ], "brakeModel": [], "classesColors": [ "#878787", "#76F273", "#1CCCFF", "#FFF62B", "#FF3538", "#8C5CFF", "#FFAF17" ], "mraStart": 0, "seatsStart": 1, "engine": [ "Front", "Mid", "Mid-rear", "Mixed", "Rear" ], "handModel": [ 30, 110 ], "approveModel": false, "topSpeedStart": 25, "bodyTypesModel": [], "tyres": [ "Performance", "Standard", "All-surface", "Off-road", "Slick" ], "rqModel": [ 10, 119 ], "bodyTypes": [ "Convertible", "Coupe", "Estate", "Hatchback", "MPV", "Pickup", "Roadster", "Saloon", "SUV", "Van" ], "tunes": [ "332", "323", "233", "111", "Custom", "Best" ], "engineModel": [], "brands": [ "AC", "Acura", "Alfa Romeo", "Alpine", "AMC", "Apollo", "Arash", "Ariel", "Aston Martin", "Audi", "Austin", "BAC", "Bentley", "Bizzarrini", "BMW", "Brabham", "Bristol", "Bufori", "Bugatti", "Buick", "Cadillac", "Caterham", "Chevrolet", "Chrysler", "Citroen", "De Tomaso", "DMC", "Dodge", "Donkervoort", "Drako", "DS", "Eagle", "Fiat", "Ford", "Geo", "Ginetta", "Giocattolo", "GMC", "Hennessey", "Holden", "Honda", "Hudson", "Hummer", "Hyundai", "Infiniti", "Jaguar", "Koenigsegg", "KTM", "Lamborghini", "Lancia", "Land Rover", "Lincoln", "Lotus", "Maserati", "Matra", "Mazda", "McLaren", "McMurtry", "Mercedes-Benz", "Mercury", "MG", "Mini", "Mitsubishi", "Mitsuoka", "Morgan", "Nissan", "Oldsmobile", "Pagani", "Peugeot", "Pininfarina", "Plymouth", "Pontiac", "Porsche", "Radical", "RAM", "Renault", "Rezvani", "Rimac", "Rover", "RUF", "Saleen", "Saturn", "SCG", "Skoda", "Smart", "Spyker", "Subaru", "Suzuki", "Talbot", "TVR", "Ultima", "Vauxhall", "Volkswagen", "Volvo", "W Motors", "Zenos", "Zenvo" ], "rqEnd": 119, "yearEnd": 2025, "drivesModel": [], "seatsModel": [ 1, 9 ], "mraModel": [ 0, 160 ], "acelStart": 1.5, "acelModel": [ 1.5, 40 ], "absModel": [], "seatsEnd": 9, "seats2Model": [], "tags_permanent": [ "Concept", "Drivers Choice", "Eco Friendly", "Hot Hatch", "Hypercar", "Iconic Variant", "Innovative", "Motorsport", "Muscle Car", "None", "Oddities", "Road", "Sleeper", "Street Racer", "Style Icon", "Team Favourite", "Track", "Ultra Expensive", "Wild Ride" ], "weightStart": 300 }, "bucketSize": 800, "filteringQueryStrings": [ "[\"((\\\"isprizecar\\\"=\\\"0\\\"))\"]", "[\"((\\\"tags\\\"=\\\"4000000000000\\\"|\\\"tags\\\"=\\\"80000000000\\\"))\"]", "[\"((\\\"country\\\"=\\\"CzechRepublic\\\"|\\\"country\\\"=\\\"GreatBritain\\\"))\"]", "[\"((\\\"country\\\"=\\\"CzechRepublic\\\"))\"]", "[\"((\\\"country\\\"=\\\"GreatBritain\\\"))\"]" ], "tag": "GT-Series", "eid": "t", "endDateTime": "2025-09-12T20:00:00.000Z", "hidden": false, "ticketRegenerationTime": 1800000 })
        }


        // filter
        let isTier = this.whatTier && this.whatTier <= 3;
        this.eventList = this.eventList.filter(x => {

          if (x.name.includes("Daily Event")) {
            if (x.currentEurope || x.currentAmerica || x.currentAsia) {
              x.name += " (";
              if (x.currentEurope) x.name += "EU, ";
              if (x.currentAmerica) x.name += "US, ";
              if (x.currentAsia) x.name += "AP, ";
              // console.log(x.name);
              x.name = x.name.slice(0,-2);
              x.name += ")";
              return true;
            }
            if ((this.user && this.user.mod) || isTier) {
              return true;
            }
            return false;
          }
          // if (x.hidden) {
          //   if (this.whatTier && this.whatTier <= 3) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // }
          return true;
        })


        this.eventStyleList();
        if (after) {
          after(res);
        } else if (resolveInitial && this.eventFromStorage && this.eventList.find(x => x.date === this.eventFromStorage)) {
          this.loadEventFull(this.eventFromStorage);
        } else {
          this.eventLoading = false;
        }
      })
      .catch(error => {
        this.eventLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    loadEventFull(date, e) {
      if (e && e.shiftKey && this.user && this.user.canDelete && this.user.mod) {
        this.eventAskDelete(date);
        return;
      }
      // if (e && !this.whatTier || this.whatTier > 3) {
      //   this.eventList.map(x => {
      //     if (x.date === date) {
      //       Vue.set(x, "noAccess", true);
      //       setTimeout(() => {
      //         Vue.set(x, "noAccess", false);
      //       }, 800);
      //     }
      //   })
      //   return;
      // }
      this.eventLoading = true;
      this.eventSelectorDialog = false;

      axios.post(Vue.preUrl + "/getEventById", {
        date: date
      })
      .then(res => {
        let event = this.eventList.find(x => x.date === date)
        if (event.date === res.data.date) {
          Object.keys( res.data ).forEach(key => {
            Vue.set(event, key, res.data[key]);
          })
          this.loadEventScreen(date);
        }
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
        this.eventLoading = false;
      });
    },
    loadEventScreen(id, eventParsedToPreview) {
      this.eventSelectorDialog = false;
      let event;
      this.eventCurrentId = "";
      if (eventParsedToPreview) {
        event = eventParsedToPreview;
      } else {
        event = this.eventList.find(x => x.date === id);
        if (!event) {
          return;
        }
      }

      this.event = event;
      this.eventCurrentId = eventParsedToPreview && !event.date ? "_preview_" : event.date;
      this.eventCurrentName = event.name;
      this.eventCurrentIsHidden = eventParsedToPreview ? eventParsedToPreview.hidden : (this.eventList.find(x => x.date === event.date) || {}).hidden;
      this.eventCheckFilterCodePre = null;
      this.eventCheckFilterCode = null;
      this.eventUseWhatFilter = 0;
      this.eventKingTracks = [];
      this.eventFilterForKing = {};
      this.eventLoadPicks();
      this.eventBlockAddTrackset = this.event.trackset.length > 1;
      if (!this.event.icons) {
        Vue.set(this.event, "icons", []);
      }
      if (this.event.trackset.length === 0) {
        this.event.trackset.push([null,null,null,null,null])
      }
      if (this.event.comp.length === 0) {
        Array.from(Array(5)).map((_, i) => {
          this.event.comp.push({tyres: [], clearance: [], drives: [], meta: []})
        });
      }
      this.eventForceAnalyze = false;

      this.eventFilterToSave = null;

      Vue.set(event, "canViewEvent", true);
      if (event.hidden) {
        if (!this.whatTier || this.whatTier > 3) {
          Vue.set(event, "noAccess", true);
          Vue.set(event, "canViewEvent", false);

          // reset comp
          let tempComp = [];
          Array.from(Array(5)).map((_, i) => {
            tempComp.push({tyres: [], clearance: [], drives: [], meta: []})
          });
          this.event.comp = tempComp;
          return;
        }
      }
      Vue.set(event, "noAccess", false);
      
      this.eventFilterString = JSON.stringify(this.event.filter);
      this.eventFilterString2 = JSON.stringify(this.event.filter2);
      this.eventFilterString3 = JSON.stringify(this.event.filter3);
      this.eventTracksetString = JSON.stringify(this.event.trackset);
      this.eventCompString = JSON.stringify(this.event.comp);
      this.eventRqEditString = JSON.stringify(this.event.rqLimit);
      this.eventIcons = JSON.stringify(this.event.icons);
      this.eventLoadTracksetLocal();
      this.resetBestTeamsConfig();


      this.eventResolveTrackset();
      if (!eventParsedToPreview) {
        this.eventUpdateLocalStorage();
      }
    },
    eventResolveTrackset(isEdit) {
      let resolvedTrackset = JSON.parse(JSON.stringify(this.event.trackset));

      resolvedTrackset = resolvedTrackset.map(trackset => {
        return trackset.map(track => {
          if (track === null) return null;
          return [this.resolveTrack({ track }, false, false)];
        })
      })
      Vue.set(this.event, "resolvedTrackset", resolvedTrackset);
      if (isEdit) {
        this.eventSaveTracksetLocal();
      }
    },
    eventSaveTracksetLocal() {
      window.localStorage.setItem(`tracksOrder_${this.eventCurrentName}_${this.event.realDate}`, JSON.stringify(this.event.trackset));
    },
    eventLoadTracksetLocal() {
      let localTracks = window.localStorage.getItem(`tracksOrder_${this.eventCurrentName}_${this.event.realDate}`);
      if (!localTracks) return;
      let areEqual = false;
      try {
        localTracks = JSON.parse(localTracks);
        // validate trackset
        areEqual = this.eventCheckTracksetBeforeLocal(localTracks);
      } catch (error) {
        console.log(error);
      }
      if (areEqual) {
        Vue.set(this.event, "tracksetBkp", this.event.trackset);
        this.event.trackset = localTracks;
      }
    },
    eventCheckTracksetBeforeLocal(localTracks) {
      let areEqual = false;
      localTracks.map((trackset, itrackset) => {
        areEqual = trackset.every(a => this.event.trackset[itrackset].some(b => a === b));
      })
      return areEqual;
    },
    eventResetTracksetLocal() {
      localStorage.removeItem(`tracksOrder_${this.eventCurrentName}_${this.event.realDate}`);
      this.event.trackset = this.event.tracksetBkp;
      delete this.event.tracksetBkp;
      this.eventResolveTrackset();
    },
    eventAddTrackset() {
      this.event.trackset.push([null,null,null,null,null])
      this.eventResolveTrackset();
    },
    eventUpdateLocalStorage() {
      window.localStorage.setItem('lastEvent', JSON.stringify({ date: this.eventCurrentId }));
      this.eventFromStorage = this.eventCurrentId;
    },
    eventGetLocalStorage() {
      let lastEvent = window.localStorage.getItem("lastEvent");
      if (lastEvent) {
        lastEvent = JSON.parse(lastEvent);
        this.eventFromStorage = lastEvent.date;
      }
    },
    eventStyleList() {
      let now = new Date().toISOString();

      this.eventList.sort((a,b) => {
        return a.name.localeCompare(b.name, "en", {numeric: true});
      })
      this.eventList.map(x => {
        let styl = x.name;
        Vue.set(x, "index", 0);
        if (x.name.substr(0, 13) === 'Daily Event: ') {
          if (x.name.includes("(")) Vue.set(x, "index", 2);
          else Vue.set(x, "index", 3);
          styl = `<span class="Event_Daily">Daily Event: </span>${x.name.substr(13)}`
        }
        if (x.hidden) {
          Vue.set(x, "index", 1);
          styl = `<span class="Event_Hidden">${x.name}</span>`
        }
        // if (x.endDateTime) {
        //   if (x.endDateTime.localeCompare(now) < 0) {
        //     Vue.set(x, "index", -1);
        //     styl = `<span class="Event_Ended">${x.name}</span>`
        //   }
        // }
        Vue.set(x, "nameStyled", styl);
      })
      this.eventList.sort((a,b) => {
        if (a.index === b.index && a.endDateTime && b.endDateTime) {

          // 1-Finished (red)
          // 2-Normal events
          // 3-Preview events
          // 4-Current Daily 
          // 5-Other Dailys

          if (!a.endDateTime) return -1;
          if (!b.endDateTime) return 1;

          let aEnded = a.endDateTime.localeCompare(now) < 0;
          let bEnded = b.endDateTime.localeCompare(now) < 0;
          if (aEnded && !bEnded) return -1;
          if (bEnded && !aEnded) return 1;

          // let aNotStarted = a.startDateTime.localeCompare(now) > 0;
          // let bNotStarted = b.startDateTime.localeCompare(now) > 0;
          // if (aNotStarted && !bNotStarted) return 1;
          // if (bNotStarted && !aNotStarted) return -1;
          if (b.endDateTime !== a.endDateTime) {
            return a.endDateTime.localeCompare(b.endDateTime);
          }
          return a.name.localeCompare(b.name, "en", {numeric: true});
        }
        return a.index - b.index;
      })
      // console.log(this.eventList);
    },
    eventResolveCompilation(tracksetUsed) {
      if (!this.trackTimes) return;

      
      if (this.isEvents) {
        Vue.set(this.event, "compilation", []);
      } else {
        Vue.set(this, "clubCompilation", []);
      }

      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';

      Array.from(Array(5)).map((_, itrack) => {

        let compilation = [];
        Array.from(Array(this[key].trackset.length)).map((_, itrackset) => {
          if (tracksetUsed && JSON.stringify(tracksetUsed[0]) !== JSON.stringify(this[key].trackset[itrackset])) {
            return;
          }

          let track = this[key].trackset[itrackset][itrack];
          compilation = this.trackTimes[track];
          compilation.map(car => {
            car.track = track;
          })
          if (!compilation) return;
        });


        // compilation.sort((a,b) => {
        //   return b[this.eventScoreType] - a[this.eventScoreType];
        // })

        let uniqueTracks = [];
        this[key].trackset.map(trackset => uniqueTracks.push(trackset[itrack]));
        uniqueTracks = [...new Set(uniqueTracks)];
        let minCount = uniqueTracks.length;

        // compilation = compilation.filter(car => car.rq < 80);
        
        // let firstRid = [];
        // compilation = compilation.filter(car => {
        //   // keep just the best tune
        //   if (firstRid.includes(car.rid)) return false;
        //   firstRid.push(car.rid);
        //   return true;
        // });
        // compilation = compilation.filter((x, ix) => ix < 30);

        compilation.map(car => {
          this.frontCompleteCar(car);
          // if (car.presentCount.length === 1) {
          //   car.track = car.presentCount[0];
          // } else {
          //   debugger;
          // }
        })

        if (this.isEvents) {
          Vue.set(this.event.compilation, itrack, compilation);
        } else {
          Vue.set(this.clubCompilation, itrack, compilation);
        }
        

        // console.log(compilation);
        
      });
      

    },
    eventListKings() {
      let key = this.isEvents ? 'eventPointsReference' : 'clubPointsReference';

      let bestPerTrack = {};
      let data = JSON.parse(JSON.stringify(this.eventResponse));
      data.map((dataTrack, itrack) => {
        let bestTime;
        let bestTimePure;
        if (this[key][itrack].rid !== undefined) {
          let ixOfBest = dataTrack.findIndex(x => x.rid === this[key][itrack].rid && x.tune === this[key][itrack].tune);
          if (ixOfBest > -1) {
            this[key][itrack].icar = ixOfBest;
            bestTime = dataTrack[ixOfBest].time;
            bestTimePure = dataTrack[ixOfBest].time;
          }
        }
        dataTrack.map((car, icar) => {
          if (bestTime === undefined || (icar === this[key][itrack].icar)) {
            bestTime = car.time;
            bestTimePure = car.time;
            car.timeToPrint = Vue.options.filters.toTimeString(car.time, this.eventKingTracks[itrack]);
          } else {
            car.points = Vue.options.filters.userPoints(bestTimePure, car.time, this.eventKingTracks[itrack]);
            if (car.time === 0) {
              car.timeToPrint = "DNF";
            } else if ((this.eventKingTracks[itrack] || "").includes("testBowl")) {
              car.timeToPrint = car.time;
            } else {
              if (car.time < bestTime) {
                car.timeToPrint = `${(car.time - bestTime).toFixed(2)}`
              } else {
                car.timeToPrint = `${car.isTimePredicted?"~":"+"}${(car.time - bestTime).toFixed(2)}`
              }
            }
          }
          this.frontCompleteCar(car);
          if (icar === 0) {
            if (this.isEvents && this.eventShowOnlyPicks && this.eventPicksList.length > 0) {
              Vue.set(this.eventBestPerTrack, [this.eventKingTracks[itrack]], car);
            } else if (this.eventShowOnlyPicks && this.clubPicksList.length > 0) {
              Vue.set(this.clubBestPerTrack, [this.eventKingTracks[itrack]], car);
            }
          }
        })
      })

      // fix null tracks order
      this.eventKingTracks.map((x, ix) => {
        if (x === null) {
          data.splice( ix, 0, [] )
        }
      })

      if (this.isEvents) {
        Vue.set(this.event, "compilation", data);
      } else {
        Vue.set(this, "clubCompilation", data);
      }
      return;
    },
    eventAskDelete(date) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.eventLoading = true;

        axios.post(Vue.preUrl + "/deleteEvent", {
          date: date
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.loadEvents(false);
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          vm.eventLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete "${date}"?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }

    },
    eventOpenRqEdit(e) {
      if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
        this.eventForceAnalyze = !this.eventForceAnalyze;
        this.eventBlockAddTrackset = !this.eventBlockAddTrackset;
        return;
      }
      this.eventRqEditDialog = true;
      this.eventRqEditModel = `${this.event.rqLimit}`;
      setTimeout(() => {
        try {
          document.querySelector("#Event_EditRq").focus();  
          document.querySelector("#Event_EditRq").select();
        } catch (error) {}
      }, 10);
    },
    eventCloseRqEdit() {
      this.eventRqEditDialog = false;
      this.event.rqLimit = Number(this.eventRqEditModel);
    },
    eventOpenNewEvent() {
      this.eventClearSaveNewEvent();
      this.eventSeletorDialog = false;
      this.eventNewDialog = true;
      setTimeout(() => {
        try {
          document.querySelector("#Cg_NewEventName").focus();  
        } catch (error) {}
      }, 10);
    },
    eventClearSaveNewEvent() {
      this.eventNewName = null;
    },
    eventCloseNewEvent() {
      this.eventSeletorDialog = true;
      this.eventNewDialog = false;
    },
    saveNewEvent(parsedToSave) {
      this.eventNewLoading = true;

      let params = {
        name: this.eventNewName,
        hidden: this.eventNewIsHidden
      }

      if (parsedToSave) {
        params = parsedToSave;
        if (this.eventFilterToSave) params.filter = this.eventFilterToSave;
        if (this.eventFilterToSave2) params.filter2 = this.eventFilterToSave2;
        if (this.eventFilterToSave3) params.filter3 = this.eventFilterToSave3;
      };

      axios.post(Vue.preUrl + "/newEvent", params)
      .then(res => {
        this.eventCloseNewEvent();
        this.eventNewLoading = false;
        if (parsedToSave) {
          this.eventParsedList = this.eventParsedList.filter(x => x.name !== params.name);
        }
        this.loadEvents(false, res => {
          let id = params.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "").replaceAll(" ", "_").replace(/[^a-zA-Z0-9\-\_ ]/g, "");
          this.loadEventFull(id);
        });
        // setTimeout(() => {

        // }, 1000);
      })
      .catch(error => {
        this.eventNewError = true;
        this.eventNewLoading = false;
        setTimeout(() => { this.eventNewError = false}, 1500);

        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    eventSaveAll(forceSaveTrackset, after) {
      this.saveLoading = true;
      let params = { date: this.eventCurrentId };
      if (this.eventFilterString !== JSON.stringify(this.event.filter)) params.filter = this.eventFilterToSave;
      if (this.eventFilterString2 !== JSON.stringify(this.event.filter2)) params.filter2 = this.eventFilterToSave2;
      if (this.eventFilterString3 !== JSON.stringify(this.event.filter3)) params.filter3 = this.eventFilterToSave3;
      if (forceSaveTrackset || this.eventNeedSaveTrackset) params.trackset = this.event.trackset;
      if (this.eventCompString !== JSON.stringify(this.event.comp)) params.comp = this.event.comp;
      if (this.eventRqEditString !== JSON.stringify(this.event.rqLimit)) params.rqLimit = this.event.rqLimit;
      if (this.eventIcons !== JSON.stringify(this.event.icons)) params.icons = this.event.icons;

      axios.post(Vue.preUrl + "/updateEvent", params)
      .then(res => {
        this.eventForceAnalyze = false;
        this.eventResetStringsToSave(true);
        this.saveLoading = false;
        if (params.trackset) {
          Vue.set(this.event, "tracksetBkp", JSON.parse(JSON.stringify(this.event.trackset)));
        }
        if (after) after(res);
      })
      .catch(error => {
        this.saveLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    eventConfirmSaveTrackset() {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.eventSaveAll(true, res => {
          vm.confirmDelete.loading = false;
          vm.confirmDelete.dialog = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Save this trackset order for everyone?`,
        actionLabel: `Save`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }

    },
    eventEditComp(igroup) {
      if (this.user.username === 'TiagoXavi' && !this.eventCompTypes.metas.includes("Template")) {
        this.eventCompTypes.metas.push("Template");
      }
      this.eventCompIndex = igroup;
      this.eventCompDialog = true;
    },
    eventEditCompClose() {
      this.eventCompDialog = false;
    },
    eventUpdateRequirements(filter, filterNumber = 0) {
      let key = this.isEvents ? 'event' : 'clubReqsGroupModel';

      let filterAtr = 'filter';
      if (filterNumber) filterAtr = filterAtr + (filterNumber+1);
      this[key][filterAtr] = filter;
      this.eventRequirementsDialog = false;
      this.clubRequirementsDialog = false;
    },
    eventClearFilterUpdate(clearedFilter, filterNumber = 0) {
      let key = this.isEvents ? 'eventFilterToSave' : 'clubCurrentFilterToSave';
      if (filterNumber) key = key + (filterNumber+1);
      this[key] = clearedFilter;
    },
    eventFilterAddDual() {
      let key = this.isEvents ? 'event' : 'clubReqsGroupModel';
      if (!this[key].filter2) {
        Vue.set(this[key], "filter2", {});
        return
      }
      if (!this[key].filter3) {
        Vue.set(this[key], "filter3", {});
        return
      }
    },
    // eventOpenAddYouCar() {
    //   this.eventAddCarDialogLoad = true;
    //   this.$nextTick().then(() => {
    //     this.eventAddCarDialog = true;
    //   })
    // },
    // addCarEvent(newCar) {
    //   let event = this.event;
    //   this.eventAddCarDialog = false;

    //   let found = this.eventCacheCars.find(x => x.rid === newCar.rid);
    //   if (!found) {
    //     this.eventCacheCars.push({ rid: newCar.rid });
    //   }

    //   let found2 = event.cars.findIndex(x => x.rid === (event.cars[event.carIndex] || {}).rid && x.tune === undefined);
    //   if (found2 > -1) {
    //     event.carIndex = found2;
    //   } else {
    //     event.cars.push( { rid: newCar.rid } );
    //     event.carIndex = event.cars.length-1;
    //     Vue.set(event.cars[event.carIndex], "photo", Vue.carPhoto(newCar));
    //     Vue.set(event.cars[event.carIndex], "car", JSON.parse(JSON.stringify(newCar)));
    //     Vue.set(event.cars[event.carIndex], "color", Vue.resolveClass(event.cars[event.carIndex].car.rq, event.cars[event.carIndex].car.class, "color"));
    //   }

    //   this.downloadCar(newCar.rid);
    //   this.eventSaveRoundHand();
    // },
    eventSaveRoundHand() {
      let saveName = `hand_${this.eventCurrentId}`
      let handRids = [];
      // this.cgRound.races.map(race => {
      //   if (isNaN(race.carIndex)) {
      //     handRids.push(undefined);
      //   } else {
      //     handRids.push(`${race.cars[race.carIndex].rid}_${race.cars[race.carIndex].tune}`);
      //   }
      // })
      window.localStorage.setItem(saveName, JSON.stringify(handRids));
    },
    eventResetSaveHand() {
      let saveName = `hand_${this.eventCurrentId}`
      localStorage.removeItem(saveName);
      // this.loadCgRound(this.cgCurrentId, this.cgCurrentRound);
      this.eventShowResetSavedHand = false;
    },
    eventMoveTrackRight(itrackset, itrackMonoArray) {
      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';
      let trackRightToLeft = this[key].trackset[itrackset][itrackMonoArray+1]

      Vue.set(this[key].trackset[itrackset], [itrackMonoArray+1], this[key].trackset[itrackset][itrackMonoArray]);
      Vue.set(this[key].trackset[itrackset], [itrackMonoArray], trackRightToLeft);
      
      if (this.isEvents) this.eventResolveTrackset();
      else this.clubsResolveTrackGroup();
    },
    eventTrackNewIndex(obj) {
      obj.current;
      obj.new;
      let trackset;
      if (this.isEvents) {
        trackset = this.event.trackset[obj.itrackset];
        if (!this.event.tracksetBkp) {
          Vue.set(this.event, "tracksetBkp", JSON.parse(JSON.stringify(this.event.trackset)));
        }
      } else {
        trackset = this.clubTracksGroupModel.trackset[obj.itrackset];
      }

      while (obj.current < 0)
      {
          obj.current += trackset.length;
      }
      while (obj.new < 0)
      {
          obj.new = 0;
      }
      if (obj.new > trackset.length)
      {
          obj.new = trackset.length;
      }
      trackset.splice(obj.new, 0, trackset.splice(obj.current, 1)[0]);

      if (this.isEvents) this.eventResolveTrackset(true);
      else this.clubsResolveTrackGroup(); // TODO: local edit clubs trackset
    },
    eventMove(direction = "up", itrackset) {
      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';
      var toIndex = 0;
      if (direction === "up") {
        if (itrackset === 0) return;
        toIndex = itrackset - 1;
      }
      if (direction === "down") {
        if (itrackset === this[key].trackset.length - 1) return;
        toIndex = itrackset + 1;
      }
      var element = this[key].trackset[itrackset];
      this[key].trackset.splice(itrackset, 1);
      this[key].trackset.splice(toIndex, 0, element);

      if (this.clubHasOriginalOrder && key === 'clubTracksGroupModel') {
        // sort original too
        element = this[key].tracksetOriginal[itrackset];
        this[key].tracksetOriginal.splice(itrackset, 1);
        this[key].tracksetOriginal.splice(toIndex, 0, element);
        this.clubBlockOriginalButton = true;
        if (!this.clubTrackNeedSave) {
          this.clubBlockOriginalButton = false;
        }
      }
      if (!this.clubHasOriginalOrder && key === 'clubTracksGroupModel') {
        this.clubBlockOriginalButton = true;
      }

      if (this.isEvents) this.eventResolveTrackset();
      else this.clubsResolveTrackGroup();
    },
    eventDeleteTrackset(itrackset) {
      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';
      this[key].trackset = this[key].trackset.filter((x, ix) => ix !== itrackset);

      if (this.isEvents) this.eventResolveTrackset();
      else this.clubsResolveTrackGroup();
    },
    eventRefreshKingFilter() {
      this.eventFilterForKing = {};
      if (this.eventCheckFilterCode) {

        this.$nextTick().then(() => {
          if (this.mode === "events") {
            this.$store.commit("EVENT_EXPORT_FILTER");
          }
          if (this.mode === "clubs") {
            this.$store.commit("CLUBS_EXPORT_FILTER");
          }
          
          this.$nextTick().then(() => {
            this.eventOpenKingFilter(Number(this.eventCheckFilterCode[0]), Number(this.eventCheckFilterCode[2]), {}, true);
          })
        })
        
      }
    },
    eventOpenKingFilter(itrackset, itrackMonoArray, e, direct = false) {
      let key = this.isEvents ? 'event' : 'clubReqsGroupModel';
      let filterAtr = 'filter';
      if (key === "event") {
        if (this.eventUseWhatFilter) filterAtr = filterAtr + (this.eventUseWhatFilter+1);
      }
      if (key === "clubReqsGroupModel") {
        if (this.clubUseWhatFilter) filterAtr = filterAtr + (this.clubUseWhatFilter+1);
      }
      let refreshFilter = this.eventFilterForKingLast !== this[key].date;
      this.eventFilterForKingLast = this[key].date;

      if (this.eventAnalyseLoading) return true;
      // if (key === "clubReqsGroupModel") {
      if (!Object.keys(this.eventFilterForKing).length || direct || refreshFilter) {
        this.eventFilterForKing = JSON.parse(JSON.stringify(this[key][filterAtr]));
      }
      this.eventCheckFilterCodePre = `${itrackset}_${itrackMonoArray}`;
      this.eventCheckFilterCode = null;

      if (this.whatTier && this.whatTier <= 3 && (!e || !e.ctrlKey) && !direct) {
        this.eventKingDialogLoad = true;
        this.$nextTick().then(() => {
          this.eventKingDialog = true;
        })
      } else {
        this.eventEventKFilter(e.ctrlKey);
      }
    },
    eventCloseKingFilter() {
      this.eventCheckFilterCode = null;
    },
    eventEventKFilter(forceFree) {
      this.eventAnalyseKFilter(forceFree);
    },
    eventAnalyseKFilter(forceFree) {
      if (this.eventMyGarage && !this.user.hasGarage) {
        this.noGarageUploaded();
        return;
      }
      
      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';

      this.eventCheckFilterCode = this.eventCheckFilterCodePre;
      this.eventKingTracks = this[key].trackset[this.eventCheckFilterCode[0]];
      this.eventKingDialog = false;
      this.eventAnalyseLoading = true;

      if (this.eventMyGarage) {
        this.$store.commit("START_LOGROCKET", {});
      }

      let params = {
        filter: this.eventFilterForKing,
        tracks: this.eventKingTracks,
        includeDownvotes: this.kingShowDownvoted,
        forceFree,
        onlyPicks: this.eventShowOnlyPicks,
        forcePicks: this.eventForcePicks,
        myGarage: this.eventMyGarage,
        picks: []
      }

      params.picks = this.eventReducePicks();

      if (params.picks.length === 0) {
        params.forcePicks = false;
        params.onlyPicks = false;
      }

      if (this.mode === "clubs" && this.whatTier && this.whatTier <= 3) {
        params.isClubs = true;
        // this.$store.commit("START_LOGROCKET", {});
      }

      axios.post(Vue.preUrl + "/eventKings", params)
      .then(res => {
        this.eventResponse = res.data;
        this.eventPointsReference.map(x => {
          x.icar = undefined;
        })
        this.eventListKings();
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.eventAnalyseLoading = false;
      });
    },
    eventRenameFilter(event) {
      let n = event.n;
      Vue.set(this.event[`filter${n+1 > 1 ? n+1 : ''}`], "name", event.newName);
      
      let currentClearedFilter = this.eventRetrieveCurrentClearedFilter(n);

      Vue.set(currentClearedFilter, "name", event.newName);
    },
    eventRetrieveCurrentClearedFilter(filterNumber) {
      // TODO: Só funciona se tiver filtro a ser salvo
      let key = this.isEvents ? 'eventFilterToSave' : 'clubCurrentFilterToSave';
      if (filterNumber) key = key + (filterNumber+1);

      if (this[key] === null || this[key] === undefined) {
        // unchanged filter
        let keyF = this.isEvents ? 'event' : 'clubReqsGroupModel';
        let filterName = "filter";
        if (filterNumber) filterName = filterName + (filterNumber+1);
        Vue.set(this, key, JSON.parse(JSON.stringify(this[keyF][filterName])));
      }

      return this[key];
    },
    // eventAnalyse(disableAfter = true) {
    //   // RQ savers, unreleased
    //   this.eventAnalyseLoading = true;

    //   axios.post(Vue.preUrl + "/analyseEvent", {
    //     date: this.event.date,
    //     rqLimit: this.event.rqLimit,
    //     trackset: this.event.trackset,
    //     filter: this.event.filter
    //   })
    //   .then(res => {
    //     Vue.set(this, 'trackTimes', res.data)
    //     // if (disableAfter) this.eventForceAnalyze = false;
    //     this.eventResolveCompilation();
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.$store.commit("DEFINE_SNACK", {
    //       active: true,
    //       error: true,
    //       text: error,
    //       type: "error"
    //     });
    //     if ((error.response || {}).status === 401) {
    //       this.$store.commit('OPEN_LOGIN');
    //     }
    //   })
    //   .then(() => {
    //     this.eventAnalyseLoading = false;
    //   });

    // },
    eventFindRqSavers() {
      this.eventCheckFilterCode = this.eventCheckFilterCodePre;

      let trackset;
      let filter;
      let filterAtr = 'filter';
      if (this.isEvents) {
        trackset = [this.event.trackset[this.eventCheckFilterCode[0]]];
        if (this.eventUseWhatFilter) filterAtr = filterAtr + (this.eventUseWhatFilter+1);
        filter = this.event[filterAtr];
      } else {
        trackset = [this.clubTracksGroupModel.trackset[this.eventCheckFilterCode[0]]];
        if (this.clubUseWhatFilter) filterAtr = filterAtr + (this.clubUseWhatFilter+1);
        filter = this.clubReqsGroupModel[filterAtr];
      }

      
      this.eventKingDialog = false;
      this.eventAnalyseLoading = true;

      if (this.mode === "clubs") {
        // this.$store.commit("START_LOGROCKET", {});
      }

      axios.post(Vue.preUrl + "/analyseEvent", {
        trackset: trackset,
        filter: filter,
        isClubs: this.mode === "clubs"
      })
      .then(res => {
        Vue.set(this, 'trackTimes', res.data)
        // if (disableAfter) this.eventForceAnalyze = false;
        this.eventResolveCompilation(trackset);
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
      .then(() => {
        this.eventAnalyseLoading = false;
      });

    },
    eventExportTracksToWorkspace(type = 'events') {
      let result = "";
      let tracks = [];
      if (type === 'events') {
        this.event.trackset.map(trackset => {
          trackset.map(track => {
            tracks.push(track);
          })
        })
      }
      if (type === 'cg') {
        this.cgRound.races.map(race => {
          tracks.push(race.track);
        });
      }
      tracks = [...new Set(tracks)];
      if (type === 'events') tracks = this.orderTracksIds(tracks);
      tracks.map(track => {
        result += `~K${track}`
      })

      if (type === 'events') {
        let picks = this.eventReducePicks();
        picks.map(car => {
          result += `~C${car.rid}~T${car.tune}`
        })
        this.$store.commit("CLASSIC_FILTER_IMPORT", { filter: this.event.filter });
      }
      if (type === 'cg') {
        this.cgRound.races.map(race => {
          if ((race.tune && !race.tune.includes('Other')) && race.tune !== "000") {
            result += `~C${race.rid}~T${race.tune}`;
          } else {
            result += `~C${race.rid}`;
          }
          if (typeof race.carIndex === 'number') {
            result += `~C${(race.cars[race.carIndex] || {}).rid}~T${(race.cars[race.carIndex] || {}).tune}`
          }
        });
        this.$store.commit("CLASSIC_FILTER_IMPORT", { filter: this.cgRound.filter });
      }

      this.changeMode('compare', true, false);
      setTimeout(() => {
        this.decodeTemplateString(result, true);
      }, 150);

      if (type === 'events') {
        setTimeout(() => {
          this.searchFilterDialog = true;
        }, 250);
      }
    },
    eventExportCriteriaToPacks() {
      // this.$store.commit("START_LOGROCKET", {});
      let filter;
      let filterAtr = 'filter';
      if (this.eventUseWhatFilter) filterAtr = filterAtr + (this.eventUseWhatFilter+1);
      filter = this.event[filterAtr];

      this.$router.push({ name: "Packs", params: { filter } })
    },
    eventExportEventToTimeline() {
      this.$router.push({ name: "Timeline", params: { event: this.event } })
    },
    eventSetVisible() {
      let vm = this;

      let action = function() {
        vm.eventAnalyseLoading = true;
        vm.confirmDelete.loading = true;

        axios.post(Vue.preUrl + "/setEventVisible", {
          date: vm.eventCurrentId,
          name: vm.event.name,
          hidden: false
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.loadEvents(true);
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          vm.eventAnalyseLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Set '${vm.eventCurrentId}' visible?`,
        actionLabel: `Set visible`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }

    },
    eventOpenShowCarDialog(car, e, igroup, icar) {
      if (e.altKey) {
        this.eventToggleReference(car, igroup);
        return;
      }
      if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
        if (!this.user || !this.user.mod) return;
        this.askDeleteTimeGeneral(car.rid, car.tune, this.eventKingTracks[igroup]);
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        let url = `https://www.topdrivesrecords.com?share=~K${this.eventKingTracks[igroup]}~C${car.rid}~T${car.tune}`
        window.open(url, '_blank');
        return;
      }
      this.tuneDialogCar = JSON.parse(JSON.stringify(car.car));
      this.tuneDialogCar.selectedTune = '000';
      this.tuneDialogCarIndex = -1;
      this.tuneDialogisOppo = true;
      this.tuneDialogActive = true;
    },
    eventClearPicks() {
      this.eventPicksList = [];
      window.localStorage.setItem(`picks_${this.eventCurrentName}`, '[]');
      this.eventPointsReference = [{}, {}, {}, {}, {}];
      window.localStorage.setItem(`reference_${this.eventCurrentName}`, '[{}, {}, {}, {}, {}]');
    },
    eventClearBoard() {
      this.$store.commit("CLEAR_PRIZEBOARD", {});
    },
    eventLoadPicks() {
      this.eventPicksList = [];
      this.eventPointsReference = [{}, {}, {}, {}, {}];

      let _picks = window.localStorage.getItem(`picks_${this.eventCurrentName}`);
      if (_picks) {
        this.eventPicksList = JSON.parse(_picks);
      }
      let _reference = window.localStorage.getItem(`reference_${this.eventCurrentName}`);
      if (_reference) {
        this.eventPointsReference = JSON.parse(_reference);
      }
    },
    eventToggleReference(car, igroup) {
      let found = this.eventPointsReference[igroup] && this.eventPointsReference[igroup].rid === car.rid && this.eventPointsReference[igroup].tune === car.tune;
      if (found) {
        this.eventPointsReference[igroup] = {};
      } else {
        this.eventPointsReference[igroup] = { rid: car.rid, tune: car.tune };
      }

      window.localStorage.setItem(`reference_${this.eventCurrentName}`, JSON.stringify(this.eventPointsReference));
      this.eventListKings();
    },
    eventTogglePick(car, e) {
      let found = this.eventPicksList.find(x => x.rid === car.rid && x.tune === car.tune);
      if (found) {
        this.eventPicksList = this.eventPicksList.filter(x => x.rid !== car.rid || x.tune !== car.tune);
      } else {
        this.eventPicksList.push(JSON.parse(JSON.stringify(car)));
      }
      if (e) {
        e.preventDefault();
      }
      window.localStorage.setItem(`picks_${this.eventCurrentName}`, JSON.stringify(this.eventPicksList));
      this.eventEnablePicks = true;
    },
    eventRemovePick(car) {
      this.eventPicksList = this.eventPicksList.filter(x => x !== car);
      window.localStorage.setItem(`picks_${this.eventCurrentName}`, JSON.stringify(this.eventPicksList));
    },
    eventReducePicks() {
      let paramPicks = [];

      // events
      if (this.mode === "events") {
        if (this.eventPicksList.length > 0) {
          let list = [];
          this.eventPicksList.map(car => {
            list.push({ rid: car.rid, tune: car.tune });
          })
          this.eventPointsReference.map((car, ix) => {
            if (car.rid) {
              list.push({ rid: car.rid, tune: car.tune });
            }
          })
          paramPicks = list;
        }
      }
      // clubs
      if (this.mode === "clubs") {
        if (this.clubPicksList.length > 0) {
          let list = [];
          this.clubPicksList.map(car => {
            list.push({ rid: car.rid, tune: car.tune });
          })
          this.clubPointsReference.map((car, ix) => {
            if (car.rid) {
              list.push({ rid: car.rid, tune: car.tune });
            }
          })
          paramPicks = list;
        }
      }
      let clearPicksList = [];
      paramPicks.map(x => {
        let found = clearPicksList.find(y => x.rid === y.rid && x.tune === y.tune)
        if (!found) {
          clearPicksList.push(x);
        }
      })

      return clearPicksList;
    },
    eventResetStringsToSave(isAfterSave = false) {
      if (isAfterSave) {
        if (this.eventFilterToSave) this.eventFilterString = JSON.stringify(this.eventFilterToSave);
        if (this.eventFilterToSave2) this.eventFilterString2 = JSON.stringify(this.eventFilterToSave2);
        if (this.eventFilterToSave3) this.eventFilterString3 = JSON.stringify(this.eventFilterToSave3);
        if (this.eventFilterString) this.event.filter = JSON.parse(this.eventFilterString);
        if (this.eventFilterString2) this.event.filter2 = JSON.parse(this.eventFilterString2);
        if (this.eventFilterString3) this.event.filter3 = JSON.parse(this.eventFilterString3);
        this.eventFilterToSave = null;
        this.eventFilterToSave2 = null;
        this.eventFilterToSave3 = null;
      } else {
        this.eventFilterString = JSON.stringify(this.event.filter);
        this.eventFilterString2 = JSON.stringify(this.event.filter2);
        this.eventFilterString3 = JSON.stringify(this.event.filter3);
      }
      this.eventTracksetString = JSON.stringify(this.event.trackset);
      this.eventCompString = JSON.stringify(this.event.comp);
      this.eventRqEditString = JSON.stringify(this.event.rqLimit);
      this.eventIcons = JSON.stringify(this.event.icons);
    },
    eventNamePaste(e) {
      if (e && this.user.username === 'TiagoXavi') {
        let text = e.clipboardData.getData('text');

        let obj;
        let isParsed = false;
        try {
          obj = JSON.parse(text);
          isParsed = true;
        } catch (error) {
          console.log(error);
        }

        if (
          isParsed &&
          typeof obj === "object" &&
          obj.events &&
          Array.isArray(obj.events)
        ) {
          e.preventDefault();

          this.eventNewLoading = true;

          axios.post(Vue.preUrl + "/eventsParseList", obj)
          .then(res => {
            this.eventNewDialog = false;
            this.eventNewLoading = false;
            this.eventParsedList = res.data;
            let now = new Date().toISOString();

            // resolve events by dateTime
            this.eventParsedList.sort((a,b) => {
              let aEnded = a.endDateTime.localeCompare(now) < 0;
              let bEnded = b.endDateTime.localeCompare(now) < 0;
              if (aEnded && !bEnded) return -1;
              if (bEnded && !aEnded) return 1;

              let aNotStarted = a.startDateTime.localeCompare(now) > 0;
              let bNotStarted = b.startDateTime.localeCompare(now) > 0;
              if (aNotStarted && !bNotStarted) return 1;
              if (bNotStarted && !aNotStarted) return -1;
              
              
              if (b.endDateTime !== a.endDateTime) {
                return a.endDateTime.localeCompare(b.endDateTime);
              }
              return a.name.localeCompare(b.name);
            })

            console.log(this.eventParsedList.map(x => {

              let found = obj.events.find(e => {
                return e.name === x.name.toUpperCase() &&
                  e.startDateTime === x.startDateTime &&
                  e.filteringQueryStrings.toString() === x.filteringQueryStrings.toString()
              })
              found = found || {}

              return [
                x.name,
                found.challengeSetIds
              ]
            }))


          })
          .catch(error => {
            this.eventNewError = true;
            this.eventNewLoading = false;
            setTimeout(() => { this.eventNewError = false}, 1500);

            console.log(error);
            this.$store.commit("DEFINE_SNACK", {
              active: true,
              error: true,
              text: error,
              type: "error"
            });
          })

        }
      }
    },
    eventPreviewParsed(event) {
      console.log(event, event.filteringQueryStrings);
      this.loadEventScreen("", event);
    },
    askDeleteTimeGeneral(rid, tune, track) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;

        axios.post(Vue.preUrl + "/deleteTime", {
          rid: rid,
          tune: tune,
          track: track,
        })
        .then(res => {
          vm.confirmDelete.dialog = false;

          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: vm.$t('m_deleteSuccess')
          });
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete '${track}' time of ${rid}?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    
    


    handleResize() {
      this.windowWidth = window.innerWidth;
      let vw = document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--vw', `${vw}px`);
      let vh = document.documentElement.clientHeight;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
    handleKeyDown(e) {
      if (e.altKey) {
        if (this.showPoints) return;
        e.preventDefault();
        // console.log("on");
        this.pointsInit(e);

        // this.showCarsFix = false;
        // this.$nextTick().then(() => {
        //   this.showCarsFix = true;
        // });
      }
      if (e.code === "ShiftRight" && this.clubHasOriginalOrder && this.mode === "clubs") {
        if (this.clubIsShowingOriginal) return;
        e.preventDefault();
        this.clubsResolveTrackGroup(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyP") {
        Vue.toggleIgnore50points();
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          time: 800,
          text: "Ignore 50 points"
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyK") {
        this.$store.commit("CHANGE_UPCOMING_TAGS", !this.$store.state.showUpcomingTags);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: this.$store.state.showUpcomingTags,
          error: !this.$store.state.showUpcomingTags,
          time: 800,
          text: "Show upcoming tags"
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyL") {
        let found = document.querySelector(".Main_BodyPrint");
        if (found) {
          found.classList.remove("Main_BodyPrint");
        } else {
          document.querySelector(".Main_Body").classList.add("Main_BodyPrint");
        }
      }
    },
    handleKeyUp(e) {
      if (!e.altKey) {
        if (this.showPoints) {
          
          // console.log("off");
          this.pointsEnd();

          // this.showCarsFix = false;
          // this.$nextTick().then(() => {
          //   this.showCarsFix = true;
          // })
        }
      }
      if (e.code === "ShiftRight" && this.mode === "clubs") {
        if (this.clubIsShowingOriginal) {
          e.preventDefault();
          this.clubsResolveTrackGroup(false);
        };
      }
    },
    carLongTouch(carIx) {
      if (this.carHoverIndex === carIx) {
        this.pointsToggle();
      } else {
        this.carHoverIndex = carIx;
        this.pointsInit();
      }
    },
    pointsInit(e) {
      this.showPoints = true;
      console.log(e);
      if (this.mode === "compare") {
        if (this.needSave) {
          this.showCarsFix = false;
          this.$nextTick().then(() => {
            this.showCarsFix = true;
          })
        }
        this.resolvePointsClassic();
      }
      // this.$store.commit("START_LOGROCKET", {});
    },
    pointsEnd() {
      this.showPoints = false;
    },
    pointsToggle() {
      if (this.showPoints) {
        this.pointsEnd();
      } else {
        this.pointsInit();
      }
    },
    hoverCarJs(index) {
      this.carHoverIndex = index;
      if (this.showPoints) {
        this.resolvePointsClassic();
      }
    },
    resolvePointsClassic() {
      console.log(this.carHoverIndex);
      if (this.carHoverIndex === -1) {
        if (this.isMobile || this.$store.state.homePointsToggle) {
          this.carHoverIndex = 0;
        } else {
          return;
        }
      };
      if (!this.carDetailsList[this.carHoverIndex] || !this.carDetailsList[this.carHoverIndex].selectedTune) {
        return;
      }
      let vm = this;
      let result = [];
      
      this.carDetailsList.map(x => {
        result.push({});
      });

      this.currentTracks.map((x, ix) => {
        result.map(y => {
          y[`${x.id}_a${x.surface}${x.cond}`] = null;
        })
      });

      let tempValue;
      result.map((x, ix) => {
        Object.keys( x ).forEach(function (trackId) {
          if (
            vm.carDetailsList[ix].data &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune] &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId]
          ) {
            tempValue = (vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId] || {}).t;
            if (vm.carHoverIndex > -1 && vm.carHoverIndex !== ix) {
              let referenceTime = (vm.carDetailsList[vm.carHoverIndex].data[vm.carDetailsList[vm.carHoverIndex].selectedTune].times[trackId] || {}).t;
              x[trackId] = Vue.options.filters.userPoints(referenceTime, tempValue, trackId);
            }
          }
        });
      })

      this.pointsResolved = result;
    },
    checkAnnouncement() {
      return;
      if (window.localStorage.getItem("contest9")) return;
      let dt = window.localStorage.getItem("_dt");
      if (dt) {
        dt = Number(dt) + (60*60*1000) > new Date().getTime()
      }
      if (dt) return;

      window.localStorage.setItem('contest9', "t");
      setTimeout(() => {
        this.announcementDialog = true;
      }, 100);
    },
    
    lookForChangedCars(data) {
      if (!this.user || !this.user.mod) return;

      import('@/database/custom_tags.json').then(custom_tags => {
        let changedRids = custom_tags.default["27.0 changed cars"];
        data.rounds.map((round, iround) => {
          round.races.map((race, irace) => {
            if (changedRids.includes(race.rid)) {
              console.log(`${data.name}, Round ${iround+1}, Race ${irace+1}, ${race.rid}`)
            }
          })
        })

      }).catch(e => {console.log("load custom_tags failed", e)});
    },
    openMemoryDialog() {
      // this.$store.commit("START_LOGROCKET", {});
      this.memorySearchDialogLoad = true;
      this.$nextTick().then(() => {
        this.memorySearchDialog = true;
      })
    },
    openLibraryDialog() {
      this.librarySearchDialogLoad = true;
      setTimeout(() => {
        this.librarySearchDialog = true;
      }, 10);
    },
    openKingFilterDialog() {
      this.kingFilterDialogLoad = true;
      this.$nextTick().then(() => {
        this.kingFilterDialog = true;
      })
    },
    openEventRequirementsDialog() {
      this.eventRequirementsDialogLoad = true;
      this.$nextTick().then(() => {
        this.eventRequirementsDialog = true;
      })
    },
    openMainDialog() {
      if (!this.memoryFirstTimeLoaded) {
        this.checkMemoryFromStorage();
        this.memoryFirstTimeLoaded = true;
      }
      this.optionsDialogActive = true;
    },
    openKingOfDialog() {
      this.kingDialog = true;
    },
    closeKingOfDialog(closeOptionsDialogToo = false) {
      this.kingDialog = false;
      this.kingFixed = false;
      if (closeOptionsDialogToo) this.optionsDialogActive = false;
    },
    updateKingFilter(filter) {
      this.kingFilter = filter;
      this.kingFilterDialog = false;
      if (this.kingFixed) this.kingAnalyse();
    },
    kingAnalyse() {
      if (!this.kingTrack.code) return;
      this.kingAnalyseFinish();
    },
    kingAnalyseFinish() {
      if (this.eventMyGarage && !this.user.hasGarage) {
        this.noGarageUploaded();
        return;
      }

      this.kingLoading = true;
      if (this.kingFixed) this.downloadLoading = true;
      let origMode = this.mode;

      if (this.eventMyGarage) {
        this.$store.commit("START_LOGROCKET", {});
      }

      axios.post(Vue.preUrl + "/king", {
        track: this.kingTrack.code,
        includeDownvotes: this.kingShowDownvoted,
        filter: this.kingClearFilter,
        myGarage: this.eventMyGarage
      })
      .then(res => {
        this.clearAllTracks();
        this.clearAllCars();
        this.pushTrackSet([this.kingTrack.code]);

        let result = [];
        res.data.map(car => {
          result.push(JSON.parse(JSON.stringify(Vue.all_carsObj[car.rid])));
          result[result.length-1].selectedTune = car.tune;
          result[result.length-1].softId = this.nextId;
          this.nextId++;
        })
        Vue.set(this, "carDetailsList", result);
        this.applyNewData(res.data, this.mode === 'challenges', origMode);
        if (this.eventMyGarage) {
          this.carDetailsList.map((car, icar) => {
            if (!res.data[icar].isTimePredicted) return;
            let tune = car.selectedTune;
            let track = this.kingTrack.code;

            if (!car.data) Vue.set(car, "data", {});
            if (!car.data[tune]) Vue.set(car.data, tune, {});
            if (!car.data[tune].times) Vue.set(car.data[tune], "times", {});
            if (!car.data[tune].times[track]) Vue.set(car.data[tune].times, track, {});
            Vue.set(car.data[tune].times[track], "t", res.data[icar].time);
            Vue.set(car.data[tune].times[track], "isTimePredicted", true);
          })
        }
        this.updateOptions();
        // this.updateCarLocalStorage();
        if (!this.kingFixed) this.kingDialog = false;
        if (this.kingForceVerticalView) {
          this.display("vertical", false);
          this.colorsChange("full", false);
        }

        if (result.length === 0) {
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: "No times found",
            type: "error"
          });
        }
        
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
        this.kingLoading = false;
        this.downloadLoading = false;
      });
    },
    isChamp(str) {
      return str.startsWith("SN") || str.startsWith("YB");
    },
    frontCompleteCar(car) {
      Vue.set(car, "photo", Vue.all_carsObj[car.rid].photo);
      Vue.set(car, "car", JSON.parse(JSON.stringify( Vue.all_carsObj[car.rid] )));
      Vue.set(car, "color", Vue.all_carsObj[car.rid].color);
    },
    chooseCustomTune(car) {
      this.customTuneDialogCar = car;
      this.customTuneDialogActive = true;
      this.customTuneDialogTune = null;
      setTimeout(() => {
        try {
          document.querySelector("#Main_CustomTuneInput").focus();
        } catch (error) {}
      }, 10);
    },
    closeCustomTuneDialog() {
      this.customTuneDialogActive = false;
      if (this.customTuneDialogTune) {
        // this.$store.commit("START_LOGROCKET", {});
        Vue.set(this.customTuneDialogCar, "forceTune", this.customTuneDialogTune);
        this.customTuneDialogCar.selectedTune = this.customTuneDialogTune;
        this.updateCarLocalStorage();
      }
    },
    sendMra() {
      console.log(this.mraEditInput);
      if (!this.mraEditInput) return;
      let rid = this.tuneDialogCar.rid;
      let newMRA = Number(this.mraEditInput);

      this.mraLoading = true;

      axios.post(Vue.preUrl + "/setMra", {
        rid: rid,
        mra: this.mraEditInput
      })
      .then(res => {
        this.mraEditing = false;
        this.tuneDialogCar.mra = newMRA;

        // Vue.all_carsObj[rid].photo
        Vue.set(Vue.all_carsObj[rid], "mra", newMRA);
        // this.all_cars.find(x => {
        //   if (x.rid === rid) {
        //     return true
        //   }
        // })
        this.carDetailsList.find(x => {
          if (x.rid === rid) {
            Vue.set(x, "mra", newMRA);
            return true
          }
        })

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
        this.mraLoading = false;
      });
    },
    resolveCarReview(reviewObj) {
      let reviewList = [];
      if (this.tuneDialogCar.reviews && this.tuneDialogCar.reviews.length > 0) {
        reviewList = this.tuneDialogCar.reviews;
      }
      let foundIndex = reviewList.findIndex(x => x.user === this.user.username);

      if (reviewObj.isDelete) {
        // delete
        reviewList.splice(foundIndex, 1);
      } else if (foundIndex > -1) {
        // edit
        if (reviewObj.reviewText) reviewList[foundIndex].text = reviewObj.reviewText;
        if (reviewObj.reviewLink) reviewList[foundIndex].link = reviewObj.reviewLink;
        reviewList[foundIndex].lastEdit = (new Date()).toISOString();
      } else {
        // new
        let newReview = {
          text: reviewObj.reviewText,
          link: reviewObj.reviewLink,
          user: this.user.username,
          date: (new Date()).toISOString()
        }
        reviewList.push(newReview);
      }

      this.carDetailsList.find(x => {
        if (x.rid === this.tuneDialogCar.rid) {
          Vue.set(x, "reviews", reviewList);
          return true
        }
      })
    },
    reviewLoadTemplate(template) {
      this.closeTune();
      this.decodeTemplateString(template, true);
    },
    gestureResolve(e) {
      return;
      // this.$store.commit("DEFINE_SNACK", {
      //   active: true,
      //   error: true,
      //   text: e.scale,
      //   type: "error"
      // });
      let zoomDirection = 0;
      if (e.scale < 1.0) {
        zoomDirection = -1;
      } else if (e.scale > 1.0) {
        // "100% > 120%"
        zoomDirection = 1;
      }
      if (zoomDirection !== 0) {
        let currentIndex = this.$store.state.zoomLevels.indexOf(this.$store.state.zoomLevel);
        let indexDest = 0;
        let maxIndex = this.$store.state.zoomLevels.length - 1;
        if (zoomDirection < 0) {
          // "100% > 80%" decrease index
          indexDest = Math.max(0, currentIndex - 1)
        } else {
          // "100% > 120%" increase index
          indexDest = Math.min(maxIndex, currentIndex + 1)
        }
        this.$store.commit("CHANGE_ZOOM_LEVEL", this.$store.state.zoomLevels[indexDest]);
      }
      e.preventDefault();
    },
    loadClubs(resolveInitial = true) {
      window.localStorage.setItem('club_already', true);
      this.clubLoading = true;

      axios.get(Vue.preUrl + "/searchClubs")
      .then(res => {
        this.clubFirstLoading = false;
        if (res.data.res) {
          this.clubTracksGroups = res.data.res.find(x => x.id === 'clubsTracksets').value;
          this.clubReqGroups = res.data.res.find(x => x.id === 'clubsReqs').value;
          this.clubDays = res.data.res.find(x => x.id === 'clubsDaysObj').value;
          this.clubServerDate = res.data.date;
          this.clubServerDateISO = res.data.date.substring(0,10);
          if (resolveInitial) {
            this.clubsResolveInitial();
          }
        }
      })
      .catch(error => {
        this.clubLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(res => {
        this.clubLoading = false;
      })
    },
    clubsResolveInitial() {
      // this.clubsChangeTrackGroup(0);
      // this.clubsChangeReqsGroup(0);
      this.clubsLoadDay(this.clubDaySelected);
      this.clubsTrackResetStringsToSave();  
    },
    clubsLoadDay(date, e) {
      if (e && e.shiftKey && this.user && this.user.canDelete && this.user.mod) {
        this.clubAskDeleteDay(date);
        return;
      }

      if (!date) date = this.clubServerDateISO;
      this.clubDaySelected = date;

      let lastKey = Object.keys(this.clubDays);
      lastKey.sort((a,b) => {
        return a.localeCompare(b);
      })
      
      if (!this.user || !this.user.mod) {
        let yesterdayToFuture = new Date(this.clubServerDateISO);
        yesterdayToFuture.setDate(yesterdayToFuture.getDate() - 1);
        yesterdayToFuture = yesterdayToFuture.getTime();
        let length = lastKey.length;
        lastKey.map((key, index) => {
          let tempDate = new Date(key);
          if (tempDate.getTime() < yesterdayToFuture && index < length-1) {
            delete this.clubDays[key];
          } else {
            // console.log(key);
          }
        })
      }

      lastKey = lastKey[lastKey.length - 1];

      if (this.clubDays[date]) {
        this.clubDaySelectedObj = this.clubDays[date];
        this.clubDaySelected = date;
      } else {
        this.clubDaySelectedObj = this.clubDays[lastKey];
        this.clubDaySelected = lastKey;
      }
      let dateObj = new Date(lastKey)
      dateObj.setDate(dateObj.getDate() + 1);
      this.clubServerNextDateAvailableISO = dateObj.toISOString().substring(0,10);

      // sort
      this.clubDaySelectedObj.tracksetGroups.sort((a, b) => {
        return a.localeCompare(b);
      })
      this.clubDaySelectedObj.criterias.sort((a, b) => {
        return a.localeCompare(b);
      })


      this.clubFillTrackGroupsActive();
      this.clubsDayResetStringsToSave();
      this.resetBestTeamsConfig();

      // trackset
      if (this.clubTracksGroupsActive.length > 0) {
        this.clubsChangeTrackGroup(0);
      } else {
        this.clubsChangeTrackGroup(null);
      }
      // reqs
      if (this.clubReqGroupsActive.length > 0) {
        this.clubsChangeReqsGroup(0);
      } else {
        this.clubsChangeReqsGroup(null);
      }
      
      this.clubDayConfigDialog = false;
    },
    clubsTrackResetStringsToSave() {
      this.clubCurrentTracksetString = JSON.stringify(this.clubTracksGroupModel.trackset);
      this.clubCurrentCompString = JSON.stringify(this.clubTracksGroupModel.comp);
      this.clubCurrentTracksetIcons = JSON.stringify(this.clubTracksGroupModel.icons);
      this.clubCurrentName = JSON.stringify(this.clubTracksGroupModel.name);
      this.clubBlockOriginalButton = false;
    },
    clubsReqResetStringsToSave(isAfterSave = false) {
      if (isAfterSave) {
        if (this.clubCurrentFilterToSave) this.clubCurrentFilterString = JSON.stringify(this.clubCurrentFilterToSave);
        if (this.clubCurrentFilterToSave2) this.clubCurrentFilterString2 = JSON.stringify(this.clubCurrentFilterToSave2);
        if (this.clubCurrentFilterToSave3) this.clubCurrentFilterString3 = JSON.stringify(this.clubCurrentFilterToSave3);
        if (this.clubCurrentFilterString1) this.clubReqsGroupModel.filter = JSON.parse(this.clubCurrentFilterString);
        if (this.clubCurrentFilterString2) this.clubReqsGroupModel.filter2 = JSON.parse(this.clubCurrentFilterString2);
        if (this.clubCurrentFilterString3) this.clubReqsGroupModel.filter3 = JSON.parse(this.clubCurrentFilterString3);
        this.clubCurrentFilterToSave = null;
        this.clubCurrentFilterToSave2 = null;
        this.clubCurrentFilterToSave3 = null;
      } else {
        this.clubCurrentFilterString = JSON.stringify(this.clubReqsGroupModel.filter);
        this.clubCurrentFilterString2 = JSON.stringify(this.clubReqsGroupModel.filter2);
        this.clubCurrentFilterString3 = JSON.stringify(this.clubReqsGroupModel.filter3);
      }
      this.clubCurrentCriteriaNameString = JSON.stringify(this.clubReqsGroupModel.name);
    },
    clubsDayResetStringsToSave() {
      this.clubDayCurrentTracksetStrig = JSON.stringify(this.clubDaySelectedObj.tracksetGroups);
      this.clubDayCurrentReqStrig = JSON.stringify(this.clubDaySelectedObj.criterias);
    },
    clubsChangeTrackGroup(index) {
      if (index === null) {
        this.clubTracksGroupModel = {};
        this.clubsTrackResetStringsToSave();
        return;
      }
      this.clubTracksGroupModel = this.clubTracksGroupsActive[index];
      if (this.clubTracksGroupModel.trackset.length === 0) {
        this.clubTracksGroupModel.trackset.push([null,null,null,null,null])
      }
      if (!this.clubTracksGroupModel.icons) {
        Vue.set(this.clubTracksGroupModel, "icons", []);
      }
      if (this.clubTracksGroupModel.comp.length === 0) {
        Array.from(Array(5)).map((_, i) => {
          this.clubTracksGroupModel.comp.push({tyres: [], clearance: [], drives: [], meta: []})
        });
      }
      this.clubsResolveTrackGroup();
      this.clubsTrackResetStringsToSave();
      this.clubLoadPicks();
      this.resetBestTeamsConfig()
    },
    clubsResolveTrackGroup(original = null) {
      if (original === null && this.clubIsShowingOriginal && this.clubHasOriginalOrder) {
        original = true;
      }
      let key = "trackset";
      this.clubIsShowingOriginal = false;
      if (original) {
        key = "tracksetOriginal";
        this.clubIsShowingOriginal = true;
      }

      let resolvedTrackset = JSON.parse(JSON.stringify(this.clubTracksGroupModel[key]));

      resolvedTrackset = resolvedTrackset.map(trackset => {
        return trackset.map(track => {
          if (track === null) return null;
          return [this.resolveTrack({ track }, false, false)];
        })
      })
      Vue.set(this.clubTracksGroupModel, "resolvedTrackset", resolvedTrackset);
    },
    clubsResolveReqGroup() {
      // resolve filter
      this.eventCheckFilterCodePre = null;
      this.eventCheckFilterCode = null;
      this.eventFilterForKing = {};
      this.eventLoadPicks();
      this.clubCurrentFilterString = JSON.stringify(this.clubReqsGroupModel.filter);
      this.clubCurrentFilterString2 = JSON.stringify(this.clubReqsGroupModel.filter2);
      this.clubCurrentFilterString3 = JSON.stringify(this.clubReqsGroupModel.filter3);
    },
    clubsChangeReqsGroup(index) {
      if (index === null) {
        this.clubReqsGroupModel = {};
        this.clubsReqResetStringsToSave();
        return;
      }
      this.clubReqsGroupModel = this.clubReqGroupsActive[index];
      this.clubUseWhatFilter = 0;

      this.clubsResolveReqGroup();
      this.clubsReqResetStringsToSave();
      this.clubLoadPicks();
      this.resetBestTeamsConfig()
    },    
    clubAddTrackset() {
      this.clubTracksGroupModel.trackset.push([null,null,null,null,null]);
      this.clubsResolveTrackGroup();
    },

    // TRACKSET
    clubOpenNewTrackset() {
      this.clubClearSaveNewTrackset();
      this.clubTracksetDialog = false;
      this.clubNewTracksetDialog = true;
      setTimeout(() => {
        try {
          document.querySelector("#Club_NewTracksetName").focus();  
        } catch (error) {}
      }, 10);
    },
    clubClearSaveNewTrackset() {
      this.clubNewTracksetName = null;
    },
    clubCloseNewTrackset() {
      this.clubTracksetDialog = true;
      this.clubNewTracksetDialog = false;
    },
    clubSaveNewTrackset() {
      this.clubNewTracksetLoading = true;

      axios.post(Vue.preUrl + "/updateClubsTracksets", {
        name: this.clubNewTracksetName
      })
      .then(res => {
        setTimeout(() => {
          this.clubCloseNewTrackset();
          this.loadClubs(false);
          this.clubNewTracksetLoading = false;
        }, 1000);
      })
      .catch(error => {
        this.clubNewTracksetError = true;
        this.clubNewTracksetLoading = false;
        setTimeout(() => { this.clubNewTracksetError = false}, 1500);

        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    clubTracksetSelectorClick(date, e) {
      // console.log("clubTracksetSelectorClick");
      if (e && e.shiftKey && this.user && this.user.canDelete && this.user.mod) {
        this.clubAskDeleteTrackset(date);
        return;
      }
      let found = this.clubTracksGroupsActive.find(x => x.date === date);
      if (found) {
        if (found.date === this.clubTracksGroupModel.date) {
          // desativou selecionado
          this.clubTracksGroupModel = {};
          this.clubsTrackResetStringsToSave();
        }
        this.clubTracksGroupsActive = this.clubTracksGroupsActive.filter(x => x.date !== found.date);
      } else {
        // this.clubTracksGroupsActive.push(JSON.parse(JSON.stringify(this.clubTracksGroups.find(x => x.date === date))))
        this.clubTracksGroupsActive.push(this.clubTracksGroups.find(x => x.date === date));
      }
      this.clubTracksGroupsActive.sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
      this.clubDaySelectedObj.tracksetGroups = this.clubTracksGroupsActive.map(x => x.date);

    },
    clubAskDeleteTrackset(date) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.clubLoading = true;

        axios.post(Vue.preUrl + "/updateClubsTracksets", {
          date: date,
          isDelete: true
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.loadClubs(false);
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          // vm.clubLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete "${date}"?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },

    // REQUIREMENTS
    clubOpenNewReqs() {
      this.clubClearSaveNewReqs();
      this.clubReqsDialog = false;
      this.clubNewReqsDialog = true;
      setTimeout(() => {
        try {
          document.querySelector("#Club_NewReqsName").focus();  
        } catch (error) {}
      }, 10);
    },
    clubClearSaveNewReqs() {
      this.clubNewReqsName = null;
    },
    clubCloseNewReqs() {
      this.clubReqsDialog = true;
      this.clubNewReqsDialog = false;
    },
    clubSaveNewReqs() {
      this.clubNewReqsLoading = true;

      axios.post(Vue.preUrl + "/updateClubsReqs", {
        name: this.clubNewReqsName
      })
      .then(res => {
        setTimeout(() => {
          this.clubCloseNewReqs();
          this.loadClubs(false);
          this.clubNewReqsLoading = false;
        }, 1000);
      })
      .catch(error => {
        this.clubNewReqsError = true;
        this.clubNewReqsLoading = false;
        setTimeout(() => { this.clubNewReqsError = false}, 1500);

        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    clubReqsSelectorClick(date, e) {
      console.log("clubReqsSelectorClick");
      if (e && e.shiftKey && this.user && this.user.canDelete && this.user.mod) {
        this.clubAskDeleteReqs(date);
        return;
      }
      let found = this.clubReqGroupsActive.find(x => x.date === date);
      if (found) {
        if (found.date === this.clubReqsGroupModel.date) {
          // desativou selecionado
          this.clubReqsGroupModel = {};
          this.clubsTrackResetStringsToSave();
        }
        this.clubReqGroupsActive = this.clubReqGroupsActive.filter(x => x.date !== found.date);
      } else {
        // this.clubReqGroupsActive.push(JSON.parse(JSON.stringify(this.clubReqGroups.find(x => x.date === date))))
        this.clubReqGroupsActive.push(this.clubReqGroups.find(x => x.date === date));
      }
      this.clubReqGroupsActive.sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
      this.clubDaySelectedObj.criterias = this.clubReqGroupsActive.map(x => x.date);

    },
    clubAskDeleteReqs(date) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.clubLoading = true;

        axios.post(Vue.preUrl + "/updateClubsReqs", {
          date: date,
          isDelete: true
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.loadClubs(false);
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          // vm.clubLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete "${date}"?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },

    clubSaveTrackset(saveTrackOriginal = false) {
      this.clubLoading = true;
      
      let params = { date: this.clubTracksGroupModel.date };
      // if (this.clubCurrentTracksetString !== JSON.stringify(this.clubTracksGroupModel.filter)) params.filter = this.eventFilterToSave;
      if (this.clubCurrentTracksetString !== JSON.stringify(this.clubTracksGroupModel.trackset)) params.trackset = this.clubTracksGroupModel.trackset;
      if (this.clubCurrentCompString !== JSON.stringify(this.clubTracksGroupModel.comp)) params.comp = this.clubTracksGroupModel.comp;
      if (this.clubCurrentTracksetIcons !== JSON.stringify(this.clubTracksGroupModel.icons)) params.icons = this.clubTracksGroupModel.icons;
      if (this.clubCurrentName !== JSON.stringify(this.clubTracksGroupModel.name)) params.name = this.clubTracksGroupModel.name;
      if (saveTrackOriginal || this.clubBlockOriginalButton) params.tracksetOriginal = this.clubTracksGroupModel.tracksetOriginal;

      axios.post(Vue.preUrl + "/updateClubsTracksets", params)
      .then(res => {
        this.clubsTrackResetStringsToSave();
        this.clubLoading = false;
      })
      .catch(error => {
        this.clubLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    clubSaveReq() {
      this.clubLoading = true;
      
      let params = { date: this.clubReqsGroupModel.date };

      if (this.clubCurrentFilterString !== JSON.stringify(this.clubReqsGroupModel.filter)) params.filter = this.clubCurrentFilterToSave;
      if (this.clubCurrentFilterString2 !== JSON.stringify(this.clubReqsGroupModel.filter2)) params.filter2 = this.clubCurrentFilterToSave2;
      if (this.clubCurrentFilterString3 !== JSON.stringify(this.clubReqsGroupModel.filter3)) params.filter3 = this.clubCurrentFilterToSave3;
      if (this.clubCurrentCriteriaNameString !== JSON.stringify(this.clubReqsGroupModel.name)) params.name = this.clubReqsGroupModel.name;

      axios.post(Vue.preUrl + "/updateClubsReqs", params)
      .then(res => {
        this.clubsReqResetStringsToSave(true);
        this.clubLoading = false;
      })
      .catch(error => {
        this.clubLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    clubDaySaveAll() {
      this.clubLoading = true;
      
      let params = { date: this.clubDaySelected };
      if (this.clubDayCurrentTracksetStrig !== JSON.stringify(this.clubDaySelectedObj.tracksetGroups)) params.tracksetGroups = this.clubDaySelectedObj.tracksetGroups;
      if (this.clubDayCurrentReqStrig !== JSON.stringify(this.clubDaySelectedObj.criterias)) params.criterias = this.clubDaySelectedObj.criterias;

      axios.post(Vue.preUrl + "/updateClubsDayConfigs", params)
      .then(res => {
        this.clubsDayResetStringsToSave();
        this.clubLoading = false;
      })
      .catch(error => {
        this.clubLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    clubNewDayConfig(date) {
      this.clubLoading = true;

      axios.post(Vue.preUrl + "/updateClubsDayConfigs", {
        date: date
      })
      .then(res => {
        setTimeout(() => {
          this.loadClubs(false);
          this.clubLoading = false;
        }, 1000);
      })
      .catch(error => {
        this.clubLoading = false;

        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if ((error.response || {}).status === 401) {
          this.$store.commit('OPEN_LOGIN');
        }
      })
    },
    clubAskDeleteDay(date) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;
        vm.clubLoading = true;

        axios.post(Vue.preUrl + "/updateClubsDayConfigs", {
          date: date,
          isDelete: true
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.loadClubs(false);
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
          // vm.clubLoading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete "${date}"?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    clubFillTrackGroupsActive() {
      this.clubTracksGroupsActive = [];
      this.clubReqGroupsActive = [];
      this.clubDaySelectedObj.tracksetGroups.map(date => {
        let trackset = this.clubTracksGroups.find(x => x.date === date);
        if (trackset) this.clubTracksGroupsActive.push(trackset);
      })
      this.clubDaySelectedObj.criterias.map(date => {
        let req = this.clubReqGroups.find(x => x.date === date);
        if (req) this.clubReqGroupsActive.push(req);
      })
    },
    clubExportTracksToWorkspace() {
      let result = "";
      let tracks = [];
      this.clubTracksGroupModel.trackset.map(trackset => {
        trackset.map(track => {
          tracks.push(track);
        })
      })
      tracks = [...new Set(tracks)];
      tracks = this.orderTracksIds(tracks);
      tracks.map(track => {
        result += `~K${track}`
      })

      let picks = this.eventReducePicks();
      picks.map(car => {
        result += `~C${car.rid}~T${car.tune}`
      })
      
      this.$store.commit("CLASSIC_FILTER_IMPORT", { filter: this.clubReqsGroupModel.filter });

      this.changeMode('compare', true, false);
      setTimeout(() => {
        this.decodeTemplateString(result, true);
      }, 150);
      setTimeout(() => {
        this.searchFilterDialog = true;
      }, 250);
    },
    clubClearPicks() {
      this.clubPicksList = [];
      window.localStorage.setItem(`picks_${this.clubTracksGroupModel.date}_${this.clubReqsGroupModel.date}`, '[]');
      this.clubPointsReference = [{}, {}, {}, {}, {}];
      window.localStorage.setItem(`reference_${this.clubTracksGroupModel.date}_${this.clubReqsGroupModel.date}`, '[{}, {}, {}, {}, {}]');
    },
    clubLoadPicks() {
      this.clubPicksList = [];
      this.clubPointsReference = [{}, {}, {}, {}, {}];
      this.clubCompilation = [];
      this.eventCheckFilterCodePre = null;
      this.eventCheckFilterCode = null;


      let _picks = window.localStorage.getItem(`picks_${this.clubTracksGroupModel.date}_${this.clubReqsGroupModel.date}`);
      if (_picks) {
        this.clubPicksList = JSON.parse(_picks);
      }
      let _reference = window.localStorage.getItem(`reference_${this.clubTracksGroupModel.date}_${this.clubReqsGroupModel.date}`);
      if (_reference) {
        this.clubPointsReference = JSON.parse(_reference);
      }
    },
    clubToggleReference(car, igroup) {
      let found = this.clubPointsReference[igroup] && this.clubPointsReference[igroup].rid === car.rid && this.clubPointsReference[igroup].tune === car.tune;
      if (found) {
        this.clubPointsReference[igroup] = {};
      } else {
        this.clubPointsReference[igroup] = { rid: car.rid, tune: car.tune };
      }

      window.localStorage.setItem(`reference_${this.clubTracksGroupModel.date}_${this.clubReqsGroupModel.date}`, JSON.stringify(this.clubPointsReference));
      this.eventListKings();
    },
    clubTogglePick(car, e) {
      let found = this.clubPicksList.find(x => x.rid === car.rid && x.tune === car.tune);
      if (found) {
        this.clubPicksList = this.clubPicksList.filter(x => x.rid !== car.rid || x.tune !== car.tune);
      } else {
        this.clubPicksList.push(JSON.parse(JSON.stringify(car)));
      }
      if (e) {
        e.preventDefault();
      }
      window.localStorage.setItem(`picks_${this.clubTracksGroupModel.date}_${this.clubReqsGroupModel.date}`, JSON.stringify(this.clubPicksList));
      this.eventEnablePicks = true;
    },
    clubRemovePick(car) {
      this.clubPicksList = this.clubPicksList.filter(x => x !== car);
      window.localStorage.setItem(`picks_${this.clubTracksGroupModel.date}_${this.clubReqsGroupModel.date}`, JSON.stringify(this.clubPicksList));
    },
    clubShowRequirementsDialog(e) {
      if (e.shiftKey && (e.ctrlKey || e.metaKey) && this.user && this.user.mod) {
        this.clubForceAnalyze = !this.clubForceAnalyze;
        return;
      }
      this.clubRequirementsDialogLoad = true;
      this.$nextTick().then(() => {
        this.clubRequirementsDialog = true;
      })
    },
    clubRenameFilter(event) {
      let n = event.n;
      Vue.set(this.clubReqsGroupModel[`filter${n+1 > 1 ? n+1 : ''}`], "name", event.newName);
      
      let currentClearedFilter = this.eventRetrieveCurrentClearedFilter(n);
      Vue.set(currentClearedFilter, "name", event.newName);
    },
    clubSaveOriginalOrder() {
      this.clubTracksGroupModel.tracksetOriginal = JSON.parse(JSON.stringify(this.clubTracksGroupModel.trackset));
      // this.clubTracksGroupModel.trackset = JSON.parse(this.clubCurrentTracksetString);
      Vue.set(this.clubTracksGroupModel, "trackset", JSON.parse(this.clubCurrentTracksetString));
      this.clubsResolveTrackGroup();

      this.clubSaveTrackset(true);
    },
    clubViewToggle() {
      if (this.clubIsShowingOriginal) {
        this.clubsResolveTrackGroup(false);
      } else {
        this.clubsResolveTrackGroup(true);
      }
    },
    clubSubmitCompleteJson() {
      let obj;
      let isParsed = false;
      try {
        obj = JSON.parse(this.clubJson);
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

      this.clubLoading = true;

      axios.post(Vue.preUrl + "/clubObjFinalize", obj)
      .then(res => {
        this.clubJson = "";
        this.loadClubs();
      })
      .catch(error => {
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.clubLoading = false;
      });
      
    },
    afterTogglePermanents(selector) {
      let el = document.querySelector(selector);
      if (!el) return;

      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          entry.target.scrollTo(0, 10000);
        }
        if (el) {
          resizeObserver.unobserve(el);
        } else {
          resizeObserver.disconnect();
        }
      });

      resizeObserver.observe(el);

    },
    resolveStat(car, type, customData = null) {
      return Vue.resolveStat(car, type, customData);
    },
    resolvePaste(e) {
      if (e) {
        e.preventDefault();
        let text = e.clipboardData.getData('text');
        let success = false;

        try {
          JSON.parse(text);
          success = true;
        } catch (error) {}

        if (!success) return;

        if (text.includes('resultData') && text.includes('roundData')) { // race result
          if (text.includes('ladderPlayerData')) { // challenge
            if (this.mode === 'challenges' && this.cgRound && this.cgRound.date && this.cgRound.races[0].track !== null && !this.cgIsApproving) {
              this.cgRoundResultJson = text;
              this.cgSubmitRoundResultJson();
              return;
            }
          }
          if (text.includes('campaignProgress')) { // campaign race

          }
          if (text.includes('leaderboardEntries')) { // event race

          }
        }

        if (text.includes('zoneEligibility') && text.includes('zoneSize')) { // complete cg rounds
          if (this.mode === 'challenges' && this.cgRound && this.cgRound.date && !this.cgIsApproving) {
            this.cgCompleteJson = text;
            this.cgSubmitCompleteJson();
            return;
          }
        }

      }
    },
    openHandRankingDialog() {
      let filter;
      let filterAtr = 'filter';

      if (this.isEvents) {
        if (this.eventUseWhatFilter) filterAtr = filterAtr + (this.eventUseWhatFilter+1);
        filter = this.event[filterAtr];
        this.eventBestTeamsTarget = {
          trackset: this.event.trackset,
          rqLimit: this.event.rqLimit,
          filter: filter, // local use
          filteringQueryStrings: this.event.filteringQueryStrings,
          flexibleCriteriaRequired: this.event.flexibleCriteriaRequired,
          name: this.event.name,
          resolvedTrackset: this.event.resolvedTrackset
        }
      }

      if (this.isClubs) {
        if (this.clubUseWhatFilter) filterAtr = filterAtr + (this.clubUseWhatFilter+1);
        filter = this.clubReqsGroupModel[filterAtr];
        this.eventBestTeamsTarget = {
          trackset: this.clubTracksGroupModel.trackset,
          rqLimit: 250,
          filter: filter, // local use
          filteringQueryStrings: [],
          flexibleCriteriaRequired: [],
          clubReqsGroupModel: this.clubReqsGroupModel,
          name: `${this.clubTracksGroupModel.name}/${this.clubReqsGroupModel.name}`,
          resolvedTrackset: this.clubTracksGroupModel.resolvedTrackset
        }
      }
      this.eventBestTeamsDialog = true;
    },
    getHandRanking(e) {
      if (this.eventBestTeamsConfig.myGarage && !this.user.hasGarage) {
        this.noGarageUploaded();
        return;
      }

      this.eventBestTeamsLoading = true;

      let config = {
        trackset: this.eventBestTeamsTarget.trackset,
        rqLimit: this.eventBestTeamsTarget.rqLimit,
        filteringQueryStrings: this.eventBestTeamsTarget.filteringQueryStrings,
        flexibleCriteriaRequired: this.eventBestTeamsTarget.flexibleCriteriaRequired,
        sendStats: this.$store.state.showUpcomingTags,
        myGarage: this.eventBestTeamsConfig.myGarage,
        repeatCars: this.eventBestTeamsConfig.repeatCars || this.eventBestTeamsConfig.myGarage,
        uniqueHands: this.eventBestTeamsConfig.uniqueHands,
        prizeCars: this.eventBestTeamsConfig.prizeCars,
        neverAwardedCars: this.eventBestTeamsConfig.neverAwardedCars,
        predictedTimes: this.eventBestTeamsConfig.predictedTimes || this.eventBestTeamsConfig.myGarage,
        shiftKey: e && e.shiftKey
      }
      
      if (this.eventBestTeamsConfig.forceCarsBool && this.eventBestTeamsConfig.forceCars.some(car => car.rid)) {
        config.forceCars = this.eventBestTeamsConfig.forceCars.map(car => car.rid);
      }
      if (this.eventBestTeamsConfig.blackListBool && this.eventBestTeamsConfig.blackList.length > 0) {
        config.blackList = this.eventBestTeamsConfig.blackList;
      }
      if (this.eventBestTeamsTarget.clubReqsGroupModel) {
        config.clubReqsGroupModel = this.eventBestTeamsTarget.clubReqsGroupModel;
        config.rqLimit = this.eventBestTeamsTarget.rqLimit;
      }

      this.$store.commit("START_LOGROCKET", {});

      axios.post(Vue.preUrl + "/handRaking", config)
      .then(res => {
        console.log("getHandRanking", res.data.stats);
        this.eventBestTeamsBigArray = res.data.arr;
        this.eventBestTeamsDialog = true;
        this.eventBestTeamsLastCache = JSON.stringify({ ...this.eventBestTeamsTarget, ...this.eventBestTeamsConfig });
      })
      .catch(error => {
        this.eventBestTeamsLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.eventBestTeamsLoading = false;
      });
    },
    resetBestTeamsConfig() {
      this.eventBestTeamsConfig.forceCarsBool = false;
      this.eventBestTeamsConfig.forceCars = [{}, {}, {}, {}, {}];
      this.eventBestTeamsConfig.blackListBool = false;
      this.eventBestTeamsConfig.blackList = [];
      this.eventBestTeamsBigArray = [];
      this.eventBestTeamsLastCache = null;
      console.log("resetBestTeamsConfig");
    },
    testBestOf() {
      

      this.kingLoading = true;

      axios.get(Vue.preUrl + "/kingTest")
      .then(res => {
        this.clearAllTracks();
        this.clearAllCars();
        this.pushTrackSet(["tCircuit_a00"]);

        let result = [];
        res.data.map(car => {
          result.push(JSON.parse(JSON.stringify(Vue.all_carsObj[car.rid])));
          result[result.length-1].selectedTune = car.tune;
          result[result.length-1].softId = this.nextId;
          this.nextId++;
        })
        Vue.set(this, "carDetailsList", result);
        this.applyNewData(res.data, this.mode === 'challenges', this.mode);
        this.updateOptions();
        // this.updateCarLocalStorage();
        this.kingDialog = false;
        if (this.kingForceVerticalView) {
          this.display("vertical", false);
          this.colorsChange("full", false);
        }

        if (result.length === 0) {
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: "No times found",
            type: "error"
          });
        }

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
        this.kingLoading = false;
        this.downloadLoading = false;
      });


    },
    noGarageUploaded() {
      let vm = this;

      let action = function() {
        vm.$router.push({ name: "BaseMyGarage" });
        vm.$store.commit("DEFINE_DIALOG", {
          active: false
        });
      }

      vm.$store.commit("DEFINE_DIALOG", {
        active: true,
        title: vm.$t('p_youNeedGarage'),
        actionLabel: vm.$t('m_uploadMyGarage'),
        cancelLabel: vm.$t('m_cancel'),
        actionColor: "green",
        maxWidth: "250px",
        minWidth: "240px",
        error: false,
        disabled: false,
        action: action,
        loading: false,
        maxWidth: "420px"
      });
    },
    refreshLocalTimesByFilter() {
      let key = this.isEvents ? 'event' : 'clubReqsGroupModel';
      let filterAtr = 'filter';
      if (key === "event") {
        if (this.eventUseWhatFilter) filterAtr = filterAtr + (this.eventUseWhatFilter+1);
      }
      if (key === "clubReqsGroupModel") {
        if (this.clubUseWhatFilter) filterAtr = filterAtr + (this.clubUseWhatFilter+1);
      }
      let refreshFilter = this.eventFilterForKingLast !== this[key].date;
      this.eventFilterForKingLast = this[key].date;

      if (!Object.keys(this.eventFilterForKing).length || refreshFilter) {
        this.eventFilterForKing = JSON.parse(JSON.stringify(this[key][filterAtr]));
      }

      let params = {
        filter: this.eventFilterForKing
      }

      this.eventAnalyseLoading = true;

      axios.post(Vue.preUrl + "/refreshLocalTimesByFilter", params)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.eventAnalyseLoading = false;
      });
    }
    
  }
}
</script>

<style>

</style>