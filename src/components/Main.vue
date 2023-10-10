<template>
  <div
    :class="{
      Main_Normal: !inverted,
      Main_2: inverted && mode === 'classic',
      Main_Compact: (compact && mode === 'classic') || ((mode === 'cg' || mode === 'events') && windowWidth < 1200),
      Main_ColorsFull: fullColors,
      Main_ColorsMedal: !fullColors,
      Main_isMobile: isMobile,
      Main_ShowPoints: showPoints
    }"
    class="Main_Layout"
    @gestureend="gestureResolve($event)"
    @click.stop="outsideClick()">
    <div
      v-if="mode === 'classic'"
      :class="{ Main_BodyEmpty: carDetailsList.length === 0 }"
      class="Main_Body"
      @click.stop="outsideClick()">
      <div class="Main_Backtop"></div>
      <div class="Main_Corner">
        <BaseCorner
          style="display: contents;"
          :gameVersion="gameVersion"
          @menu="optionsDialogActive = true;"
          @camera="shareDialog = true; generateUrl(); generateCarsList();">
          <template slot="by">
            <div v-if="user && inverted" class="Main_PrintBy">
              <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
              <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
            </div>
          </template>
        </BaseCorner>
        <div class="Main_RowCornerBox">
          
          <div v-if="carDetailsList.length > 0 && currentTracks.length > 0" class="Main_RowCorner">
            <template v-if="!user">
              <div class="Main_SaveAllBox">
                <button
                  class="D_Button Main_LoginToEdit"
                  @click="$router.push({ name: 'Login' })">{{ $t("m_login") }}</button>
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
            <template v-else-if="isMobile || homePointsToggle">
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
            <button class="D_Button Main_AddTrackDirect" @click="openDialogTrackSearch(false)">
              <i class="ticon-plus_2" aria-hidden="true"/>
            </button>
            <button
              v-if="smartCampaign.length > 0"
              style="opacity: 1;"
              class="D_Button D_ButtonLink Row_ShowMoreButton"
              @click="campaignDialog = true;">{{ $t("m_campaign") }}</button>
          </div>
        </div>
        <div v-if="user && !inverted" class="Main_UserBottom">

          <BaseUserCard :user="user" :showMod="false"/>

        </div>
      </div>
      <div class="Main_Mid">
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
              :downloadLoading="downloadLoading"
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
          <Car
            v-if="carDetailsList.length < maxCarNumber"
            index="addCar"
            class="Car_LayoutAddCar"
            :class="{ Car_WithMidEmpty: carDetailsList.length === 0 }"
            :car="null"
            :maxCarNumber="maxCarNumber"
            @add="searchFilterDialog = true;" />
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
      <div v-if="carDetailsList.length === 0" class="Main_MidEmpty">
        <div class="Main_MidEmptyInner">
          <div class="Main_MidEmptyItem Main_MidEmptyItemAdd">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButtonSearch"
              @click="librarySearchDialog = true;">
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
      </div>
    </div>
    <div
      v-else-if="mode === 'cg'"
      class="Cg_Layout"
      @click.stop="outsideClick()">
      <div class="Cg_Header">
        <div class="Cg_HeaderLeft">
          <BaseCorner
            :gameVersion="gameVersion"
            @menu="optionsDialogActive = true;"
            @longCamera="showPoints = !showPoints;"
            @camera="shareDialog = true; generateUrl();"/>
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
                    class="D_Button Row_DialogButtonTune"
                    @click="cgSeletorDialog = true;">
                    <span class="Cg_SelectorEventSpan">{{ cg.name }}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                </div>
                <div class="Cg_SelectorRound">
                  <button
                    :disabled="cgLoadingAny || cgNeedSave"
                    class="D_Button Row_DialogButtonTune"
                    @click="cgRoundSelectorDialog = true;">
                    <span>{{ $tc("m_round", 1) }} {{ cgCurrentRound+1+cgCurrentRoundSum }}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                </div>
                <div v-if="cgRound && cgRound.creator && !cgIsApproving && !isRoundEmptyForUser && !cgNewSubmitByMod">
                  <span class="Main_SearchResultUserBy Cg_Creator">{{ $t("m_by") }}&nbsp;</span>
                  <span
                    :class="`Main_UserT${highlightsUsers[cgRound.creator]}`"
                    class="Main_SearchResultUser Cg_Creator">{{ cgRound.creator }}</span>
                </div>
                <div class="Cg_CenterBottom">
                  <div
                    :style="`color: ${ cgRound.rqFill > cgRound.rqLimit ? '#a90000' : '' }`"
                    class="Cg_RqText">
                    <span class="Cg_RqRq">RQ</span>
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
                  </div>
                  <!-- save button -->
                  <div class="Cg_SaveButtonBox">
                    <template v-if="!user">
                      <div class="Main_SaveAllBox">
                        <button
                          class="D_Button Main_LoginToEdit"
                          @click="$router.push({ name: 'Login' })">{{ $t("m_login") }}</button>
                      </div>
                    </template>
                    <template v-else-if="!!user && !user.mod && isRoundEmptyForUser && cgNeedSave && isRoundReadyForSaveUser">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
                          class="D_Button Main_SaveAllButton"
                          @click="cgSaveAll()">{{ $t("m_submitReview") }}</button>
                      </div>
                    </template>
                    <template v-else-if="!!user && cgNeedSave && !isRoundEmptyForUser">
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
          <div class="Cg_Right Main_DarkScroll">
            <template v-if="cgRound.filter">
              <div class="Cg_ReqsTitle">{{ $t("m_requirements") }}</div>
              <div class="Cg_Reqs">
                <BaseFilterDescription :filter="cgRound.filter" />
              </div>
            </template>
            <div v-if="cgRound.date && user && (user.mod || isRoundEmptyForUser) && !cgIsApproving" class="Cg_FilterButtons">
              <button
                :disabled="cgLoadingAny"
                class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
                @click="cgOpenRequirementDialog()">{{ cgRound.filter ? 'Change' : 'Requirements' }}</button>
            </div>
          </div>

          <div class="Cg_RqCount">
            <div
              :style="`width: ${ (cgRound.rqFill * 100) / cgRound.rqLimit }%; background-color: ${ cgRound.rqFill > cgRound.rqLimit ? '#a90000' : '' }`"
              class="Cg_RqFill" />
          </div>
        </div>
      </div>
      <div class="Cg_Mid">
        <!-- CHALLENGE MID -->
        <div v-if="isRoundEmptyForUser && cgRound.date" class="Cg_RoundEmptyBox">
          <div v-if="cgSentForReview" style="margin-bottom: 10px;" class="Cg_RoundEmptyBody Cg_RoundEmptyThanks">{{ $t("p_userSentCgForAnalyse") }}</div>
          <div v-else-if="!cgRound.reservedTo && !cgIsApproving" style="margin-bottom: 10px;" class="Cg_RoundEmptyBody">{{ $t("p_emptyRoundForUser") }}</div>
        </div>
        <div v-if="cgIsApproving && cgRound.date" class="Cg_RoundSubmitsControl">
          <div class="Cg_SelectorLeft">
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
                  :class="{ D_Button_Loading: cgSaveLoading }"
                  style="right: unset; left: 0;"
                  class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen"
                  @click="cgReviewRound(true)">
                  <span>{{ $t("m_approve") }}</span>
                </button>
              </div>
            </template>
          </div>
          <div class="Cg_SelectorRight">
            <button
              :disabled="cgApprovingIndex === cgApprovingLength - 1 || cgLoadingAny || cgNeedSave"
              class="D_Button Row_DialogButtonTune"
              @click="cgChangeSubmit(1)">
              <i class="ticon-arrow_right_3" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <template v-if="!isRoundEmptyForUser && (!user || !user.mod) && cgRound.date && cgRound.races && cgRound.races[0] && cgRound.races[0].car === undefined">
          <div class="Cg_RoundEmptyBox">
            <div class="Cg_RoundEmptyTitle">{{ $t("m_emptyRound") }}</div>
            <div class="Cg_RoundEmptyBody">{{ $t("p_emptyRound2") }}</div>
            <div class="Cg_RoundEmptyBody">{{ $t("p_emptyRoundLogin") }}</div>
            <BaseDiscordButton style="margin-top: 20px;" />
          </div>
        </template>
        <template v-else-if="isRoundEmptyForModders && cgRound.date && ((cgRound.races && cgRound.races[0] && cgRound.races[0].car === undefined) || cgNewSubmitByMod) && !cgRound.reservedTo">
          <div class="Cg_RoundEmptyBox">
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
        <template v-else-if="user && cgRound.reservedTo && cgRound.reservedTo !== user.username">
          <div v-if="!cgSentForReview" class="Cg_RoundEmptyBox">
            <div class="Cg_RoundEmptyBody">{{ $t("p_modDoingRound", { mod: cgRound.reservedTo }) }}</div>
          </div>
        </template>
        
        <!-- CG VOTE -->
        <div v-if="cgRound.date && cgIsApproving && user && user.username" class="Cg_BottomModTools">
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

        <template v-if="
          (cgRound.date && isRoundEmptyForModders && !cgIsApproving && !cgNewSubmitByModTemplate && !showAnalyse) ||
          cgNewSubmitByMod ||
          (!user && cgRound.races && cgRound.races[0] && cgRound.races[0].car === undefined) ||
          (cgRound.reservedTo && cgRound.reservedTo !== user.username)" />
        
        <template v-else-if="cgRound.date">
          <div
            style="margin-bottom: 10px;"
            class="Cg_RoundEmptyBox">
            <template v-if="user && cgRound.date && cgRound.reservedTo && (cgRound.reservedTo === user.username || user.username === 'TiagoXavi')">
              <button
                :class="{ D_Button_Loading: cgSaveLoading }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="cgReserveRound()">
                <span class="">{{ $t("m_unlockRound") }}</span>
              </button>
            </template>
          </div>
          <div v-if="showCarsFix" class="Cg_Box">
            <div
              v-for="(race, irace) in cgRound.races"
              class="Cg_Race"
              @click.stop>
              <div class="Cg_Opponent">
                <BaseCard
                  v-if="race.car"
                  :car="race.car"
                  :customData="cgCacheCars.find(x => x.rid === race.car.rid)"
                  :fix-back="true"
                  :downloadLoading="cgLoadingAny"
                  :needSave="needSave"
                  :cg="true"
                  :cgOppo="true"
                  :options="!cgIsApproving"
                  :hideClose="!user || !user.mod"
                  :showResetTune="(user && user.mod) || isRoundEmptyForUser"
                  @cog="cgShowTuneDialog(race.car, race, true)"
                  @longTouch="cgShowTuneDialog(race.car, race, true)"
                  @delete="race.car = undefined; race.rid = null; calcRaceResult(race);"
                  @refreshTune="cgChangeTuneOppo(race.car, undefined, race)" />
                <div v-else class="Cg_CarPlaceHolder">
                  <button
                    :disabled="cgLoadingAny || !user || (!user.mod && !isRoundEmptyForUser)"
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
                  :options="user && user.mod"
                  :cg="true"
                  class="Cg_TrackBox"
                  type="tracks" />
                <button
                  v-if="!!user && (user.mod || isRoundEmptyForUser)"
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
                  :customData="cgCacheCars.find(x => x.rid === race.car.rid)"
                  :forceDisabled="!user || (!user.mod && !isRoundEmptyForUser) || cgIsApproving"
                  :placeholder="$t('m_timeToBeat')"
                  :forceCustomAuthor="isRoundEmptyForUser"
                  type="times"
                  @deleteTime="cgDeleteTime(race, $event, true)"
                  @changeTime="cgChangeTimeOppo(race, $event)" />
              </div>
              <div v-else class="Cg_ThemTime">
                <div class="Row_Cell Row_DisabledCell" />
              </div>
              <template v-if="race.track && race.car && (cgRound.lastAnalyze || (!!user && user.mod)) && !cgIsApproving">
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
                    :customData="cgCacheCars.find(x => x.rid === (race.cars[race.carIndex] || {}).rid)"
                    :fix-back="true"
                    :downloadLoading="cgLoadingAny"
                    :cg="true"
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
                    :customData="cgCacheCars.find(x => x.rid === (race.cars[race.carIndex] || {}).rid)"
                    type="times"
                    @changeTime="cgChangeTimeYou(race, $event)"
                    @changeTune="cgChangeTuneYou(race, $event)"
                    @deleteTime="cgDeleteTime(race, $event)"
                    @showTuneDialog="cgShowTuneDialog(race.cars[race.carIndex].car, race)" />
                </div>
                <div v-else class="Cg_YouTime">
                  <div class="Row_Cell Row_DisabledCell" />
                </div>
                <div class="Cg_YouBank">
                  <div class="Cg_YouBankBox">
                    <button
                      :disabled="cgLoadingAny"
                      class="D_Button Main_AddTrackDirect Cg_YouBankManualAdd"
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
                        @click="cgBankCarClick(race, index, $event, irace, bankCar);">
                        <div class="Cg_BankPhoto">
                          <img :src="bankCar.photo" class="Cg_BankPhotoImg" alt="">
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
          <div v-if="cgShowResetSavedHand && cgRound.date && !isRoundEmptyForUser" class="Cg_BottomModTools">
            <button
              :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="cgResetSaveHand()">{{ $t("m_resetSavedHand") }}</button>
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
        <div v-else-if="cgLoading" class="Cg_MidLoading">
          <BaseContentLoader
            :contents="true"
            :itemWidth="windowWidth < 1200 ? '111px' : '216px'"
            :itemHeight="144"
            style="padding: 10px 10px 10px 20px; width: 100%;"
            type="block"
            count="5" />
        </div>
        <div v-else-if="cgList.length > 0" class="Cg_ListSelect">
          <div class="Cg_ListSelectBox">
            <div style="margin-left: 15px; margin-bottom: 15px;" class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_challenges") }}</div>
            <template v-for="item in cgList">
              <button
                style="padding-left: 15px;"
                class="Main_SearchItem"
                @click="loadChallengeFull(item.date)">
                <div v-html="item.nameStyled" class="Main_SearchItemRight" />
              </button>
            </template>
          </div>
        </div>
        <div v-else class="Cg_Offline">
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
            @menu="optionsDialogActive = true;"
            @longCamera="showPoints = !showPoints;"
            @camera="shareDialog = true; generateUrl();"/>
          <div class="Cg_RowCornerBox">
            <!-- top event -->
            <div v-if="event.date" class="Cg_SelectorLayout">
              <div class="Cg_SelectorCenter">
                <div class="Cg_SelectorEvent">
                  <button
                    :disabled="eventLoading || eventNeedSave"
                    class="D_Button Row_DialogButtonTune"
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
                </div>
                <div class="Cg_CenterBottom">
                  <div class="Cg_RqText">
                    <span class="Cg_RqRq">RQ</span>
                    <span>{{ event.rqLimit }}</span>
                    <BaseButtonTouch
                      v-if="user && user.mod"
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
                          @click="$router.push({ name: 'Login' })">{{ $t("m_login") }}</button>
                      </div>
                    </template>
                    <template v-else-if="eventNeedSave && user && user.mod">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: eventLoadingAny }"
                          class="D_Button Main_SaveAllButton"
                          @click="eventSaveAll()">{{ $t("m_save") }}</button>
                      </div>
                    </template>
                    <template v-else-if="isMobile && event.compilation && event.compilation.length > 0">
                      <BaseSwitch v-model="showPoints" :label="$t('m_points')" />
                    </template>
                    <template v-if="eventShowAnalyse">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: eventLoadingAny }"
                          class="D_Button Main_SaveAllButton"
                          @click="eventAnalyse()">{{ $t("m_analyze") }}</button>
                      </div>
                    </template>
                    <div v-if="user" class="Main_PrintBy">
                      <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
                      <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div class="Cg_Right Main_DarkScroll">
            <template v-if="event.filter">
              <div class="Cg_ReqsTitle">{{ $t("m_requirements") }}</div>
              <div class="Cg_Reqs">
                <BaseFilterDescription :filter="event.filter" />
              </div>
            </template>
            <div v-if="event.date && user && user.mod" class="Cg_FilterButtons">
              <button
                :disabled="eventLoadingAny"
                class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
                @click="eventRequirementsDialog = true">{{ event.filter ? 'Change' : 'Requirements' }}</button>
            </div>
          </div>

          <div class="Cg_RqCount">
            <div
              :style="`width: ${ (event.rqFill * 100) / event.rqLimit }%; background-color: ${ event.rqFill > event.rqLimit ? '#a90000' : '' }`"
              class="Cg_RqFill" />
          </div>

        </div>
      </div>
      <div class="Cg_Mid"> <!-- EVENT -->
        <template v-if="event.date">
          <template>

            <div class="Cg_Box">
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
              @newindex="eventTrackNewIndex($event)"
              @openDialogTrackSearch="eventTracksetSelected = $event.itrackset; eventRaceSelected = $event.itrackMonoArray; openDialogTrackSearch(false)"
              @eventMoveTrackRight="eventMoveTrackRight($event.itrackset, $event.itrackMonoArray);"
              @openKingFilter="eventOpenKingFilter($event.itrackset, $event.itrackMonoArray, $event.e);"
              @up="eventMove('up', $event.itrackset);"
              @down="eventMove('down', $event.itrackset);"
              @delete="eventDeleteTrackset($event.itrackset);"
            />
            <div v-if="!eventBlockAddTrackset && event.resolvedTrackset.length < 4 && user && user.mod" class="Event_NewTracksetBox">
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
                        Event_BankPick: eventPicksList.find(x => x.rid === car.rid && x.tune === car.tune) || Object.keys(eventPointsReference).find(key => eventPointsReference[key].rid === car.rid && eventPointsReference[key].tune === car.tune)
                      }"
                      :style="`--cor: ${ car.color }`"
                      :key="`${car.rid}${car.tune}`"
                      class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton Event_BankButton"
                      style="will-change: opacity, transform;"
                      @longTouch="eventTogglePick(car, $event)"
                      @shortTouch="eventOpenShowCarDialog(car, $event, igroup, icar)"
                      @contextmenu="isMobile ? $event.preventDefault() : eventTogglePick(car, $event)"
                      @click="isMobile ? $event.preventDefault() : eventOpenShowCarDialog(car, $event, igroup, icar);">
                      <div class="Cg_BankPhoto Event_BankPhoto">
                        <img :src="car.photo" class="Cg_BankPhotoImg" alt="">
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
              v-if="event.compilation && event.compilation.length && user && (!user.tier || user.tier > 3)"
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

            <div v-if="eventPicksList.length > 0" class="Cg_BottomModTools" style="margin-top: 30px;">
              <BaseCheckBox v-model="eventEnablePicks" :label="$t('m_enablePicks')"/>
            </div>

            <div v-if="user && user.username === 'TiagoXavi' && eventForceAnalyze" class="Cg_BottomModTools" style="margin-top: 30px;">
              <template v-for="(type, ix) in eventScoreList">
                <BaseChip
                  v-model="eventScoreType"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                  required="true"
                  :value="type"
                  @click="eventAnalyse(false)" />
              </template>
            </div>

            <div class="Cg_BottomModTools" style="margin-top: 30px;">
              <button
                :class="{ D_Button_Loading: eventLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="eventExportTracksToWorkspace()">{{ $t("m_useTrackList") }}</button>
              <button
                v-if="eventPicksList.length > 0"
                :class="{ D_Button_Loading: eventLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="eventClearPicks()">{{ $t("m_clearPicks") }}</button>
              <button
                v-if="user && user.mod && eventCurrentIsHidden"
                :class="{ D_Button_Loading: eventLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
                @click="eventSetVisible()">Set visible</button>
            </div>

          </template>
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
              <button
                style="padding-left: 15px;"
                class="Main_SearchItem"
                @click="loadEventFull(item.date)">
                <div v-html="item.nameStyled" class="Main_SearchItemRight" />
              </button>
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
            @menu="optionsDialogActive = true;"
            @longCamera="showPoints = !showPoints;"
            @camera="shareDialog = true; generateUrl();"/>
          <div class="Cg_RowCornerBox">
            <!-- top club -->
            <div class="Cg_SelectorLayout">
              <div class="Cg_SelectorCenter">
                <div class="Cg_SelectorEvent Clubs_DayBox">
                  <button
                    :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave || clubDayNeedSave || !user || !user.mod"
                    :class="{ D_ButtonDisabledVisible: !clubLoading && (!user || !user.mod) }"
                    class="D_Button Row_DialogButtonTune"
                    @click="clubDayConfigDialog = true;">
                    <span>{{ clubDaySelected || "-" }}</span>
                    <i v-if="user && user.mod" class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                  <button
                    v-if="clubDayNeedSave && user && user.mod"
                    :class="{ D_Button_Loading: clubLoadingAny }"
                    class="D_Button Main_SaveAllButton"
                    @click="clubDaySaveAll()">{{ $t("m_saveDay") }}</button>
                </div>
                <div v-if="user && user.mod" class="Cg_SelectorEvent">
                  <button
                    :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave"
                    class="D_Button Row_DialogButtonTune"
                    @click="clubTracksetDialog = true;">
                    <span>{{ $t("m_tracksets") }} {{`(${clubTracksGroupsActive.length})`}}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                  <button
                    :disabled="clubLoading || clubTrackNeedSave || clubReqNeedSave"
                    class="D_Button Row_DialogButtonTune"
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
                </div>
                <div class="Cg_CenterBottom" style="min-height: unset;">
                  <!-- <div class="Cg_RqText">
                    <span class="Cg_RqRq">RQ</span>
                    <span>{{ club.rqLimit }}</span>
                    <BaseButtonTouch
                      v-if="user && user.mod"
                      :disabled="clubLoading"
                      class="D_Button Main_AddTrackDirect"
                      @click="eventOpenRqEdit($event)"
                      @longTouch="eventOpenRqEdit({ shiftKey: true, ctrlKey: true })">
                      <i class="ticon-pencil" aria-hidden="true"/>
                    </BaseButtonTouch>
                  </div> -->
                  <!-- save button -->
                  <div class="Cg_SaveButtonBox">
                    <template v-if="!user">
                      <div class="Main_SaveAllBox">
                        <button
                          class="D_Button Main_LoginToEdit"
                          @click="$router.push({ name: 'Login' })">{{ $t("m_login") }}</button>
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
                    <div v-if="user" class="Main_PrintBy">
                      <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
                      <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div class="Cg_Right Main_DarkScroll">
            <template v-if="clubReqsGroupModel.filter">
              <div class="Cg_ReqsTitle">{{ $t("m_requirements") }}</div>
              <div class="Cg_Reqs">
                <BaseFilterDescription :filter="clubReqsGroupModel.filter" />
              </div>
            </template>
            <div v-if="clubReqsGroupModel.date && user && user.mod" class="Cg_FilterButtons">
              <button
                :disabled="clubLoadingAny"
                class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
                @click="clubShowRequirementsDialog($event)">{{ clubReqsGroupModel.filter ? 'Change' : 'Requirements' }}</button>
            </div>
          </div>

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
                        Event_BankPick: clubPicksList.find(x => x.rid === car.rid && x.tune === car.tune) || Object.keys(clubPointsReference).find(key => clubPointsReference[key].rid === car.rid && clubPointsReference[key].tune === car.tune)
                      }"
                      :style="`--cor: ${ car.color }`"
                      :key="`${car.rid}${car.tune}`"
                      class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton Event_BankButton"
                      style="will-change: opacity, transform;"
                      @longTouch="clubTogglePick(car, $event)"
                      @shortTouch="eventOpenShowCarDialog(car, $event, igroup, icar)"
                      @contextmenu="isMobile ? $event.preventDefault() : clubTogglePick(car, $event)"
                      @click="isMobile ? $event.preventDefault() : clubOpenShowCarDialog(car, $event, igroup, icar);">
                      <div class="Cg_BankPhoto Event_BankPhoto">
                        <img :src="car.photo" class="Cg_BankPhotoImg" alt="">
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
              v-if="clubCompilation && clubCompilation.length && user && (!user.tier || user.tier > 3)"
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

            <div v-if="clubPicksList.length > 0" class="Cg_BottomModTools" style="margin-top: 30px;">
              <BaseCheckBox v-model="clubEnablePicks" :label="$t('m_enablePicks')"/>
            </div>

            <div v-if="user && user.username === 'TiagoXavi' && clubForceAnalyze" class="Cg_BottomModTools" style="margin-top: 30px;">
              <template v-for="(type, ix) in eventScoreList">
                <BaseChip
                  v-model="eventScoreType"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                  required="true"
                  :value="type"
                  @click="clubAnalyse(false)" />
              </template>
            </div>

            <div class="Cg_BottomModTools" style="margin-top: 30px;">
              <button
                :class="{ D_Button_Loading: clubLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="clubExportTracksToWorkspace()">{{ $t("m_useTrackList") }}</button>
              <button
                v-if="clubPicksList.length > 0"
                :class="{ D_Button_Loading: clubLoadingAny }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="clubClearPicks()">{{ $t("m_clearPicks") }}</button>
            </div>

            <div v-if="user && user.username === 'TiagoXavi' && clubForceAnalyze" class="Cg_BottomModTools Main_AdminLayoutBox" style="margin-top: 30px;">
              <div class="Main_AdminFields Main_AdminLayout">
                <BaseText
                  v-model="clubTracksGroupModel.trackGroupuuid"
                  type="normal"
                  label="Trackset Group uuid"
                  class="Space_Bottom"
                  placeholder="" />
              </div>
              <div class="Main_AdminFields Main_AdminLayout">
                <BaseText
                  v-model="clubTracksGroupModel.tracksetuuids"
                  type="normal"
                  label="Trackset uuid"
                  class="Space_Bottom"
                  placeholder="" />
              </div>
              <div v-if="clubReqsGroupModel.name" class="Main_AdminFields Main_AdminLayout">
                <BaseText
                  v-model="clubReqsGroupModel.name"
                  type="normal"
                  label="Requirement Name"
                  class="Space_Bottom"
                  placeholder="" />
              </div>
              <div class="Main_AdminFields Main_AdminLayout">
                <BaseText
                  v-model="clubReqsGroupModel.criteriauuid"
                  type="normal"
                  label="Requirement uuid"
                  class="Space_Bottom"
                  placeholder="" />
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
          <div v-if="user && user.tier <= 4">
            <button class="D_Button Main_KingPinButton" @click="kingFixed = !kingFixed; kingFixed ? kingAnalyse() : ''">
              <i class="ticon-internal Main_KingPinIcon" aria-hidden="true"/>
            </button>
            <button v-if="kingFixed" class="D_Button Main_KingPinButton" @click="closeKingOfDialog(false)">
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
              :options="true"
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
        <div class="Main_KingFilter Main_DarkScroll">
          <template v-if="kingFilter">
            <div class="Cg_ReqsTitle">{{ $tc("m_filter", 1) }}</div>
            <div class="Cg_Reqs">
              <BaseFilterDescription :filter="kingFilter" />
            </div>
          </template>
          <div class="Cg_FilterButtons">
            <button
              :disabled="kingLoading"
              class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
              @click="kingFilterDialog = true;">{{ kingFilter ? $t("m_change") : $t("m_requirements") }}</button>
          </div>
        </div>
        <div v-if="!user || !user.tier || user.tier > 4" style="margin-top: 20px;" class="Main_SaveGalleryGuide">
          <span>{{ $t("p_patronsOnly", { tier: 4 }) }}<br>{{ $t("p_bestOfDescription") }} <a class='D_Link D_LinkUnder' href='https://www.topdrivesrecords.com?share=~KcsMed_a01~CHonda_Legend_3.7_SH-AWD_2004~T323~CBMW_420i_xDrive_Coupe_2020~T323~CChrysler_300_Glacier_Edition_2013~T323~CBMW_520d_xDrive_Touring_2020~T323~CJaguar_X-Type_2001~T323~CAcura_ZDX_2010~T323~CBMW_520d_xDrive_2017~T323~CSubaru_Levorg_(VN)_2021~T323~CSuzuki_Kizashi_4x4_2010~T323~CMazda_Cosmo_1990~T323~CBMW_i4_eDrive40_2021~T323~CAudi_A3_Saloon_20_TDI_quattro_8V_2018~T323~CBMW_530e_Saloon_2020~T323~CSubaru_Impreza_WRX_300_2005~T323~CSubaru_Impreza_WRX_300_2005~T233~CMazda_6_MPS_2005~T323~CBMW_760i_2002~T323~CBMW_330e_Touring_2020~T323~CSubaru_Legacy_B4_RSK_(BE)_2001~T323~CCadillac_STS_2005~T323~CFord_Escort_RS_Cosworth_1992~T323~CAudi_A1_quattro_2012~T233~CBMW_330d_Touring_2014~T323~CAudi_A1_quattro_2012~T323~CINFINITI_Q70_Hybrid_(Y51)_2016~T323~CAudi_S1_2014~T323~CSubaru_Impreza_WRX_(GDG)_2006~T323~CAudi_S1_2014~T233~CSubaru_Forester_STI_2004~T323'>{{ $t('m_here') }}</a></span>
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
        <button
          v-if="user && user.tier <= 4 && !kingFixed"
          :class="{ D_Button_Loading: kingLoading }"
          :disabled="kingLoading || !kingTrack"
          class="D_Button Main_SaveAllButton Main_KingAnalyzeButton"
          @click="kingAnalyse()">{{ $t("m_findBest") }}</button>
      </div>
    </BaseDialog>

    <BaseFilterDialog
      v-model="searchFilterDialog"
      :lastestList="lastestList"
      :highlightsUsers="highlightsUsers"
      :all_cars="all_cars"
      :sortEnabled="true"
      importFilterName="CLASSIC_FILTER_IMPORT"
      @addCar="addCar($event)"
    />

    <BaseFilterDialog
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

    <BaseFilterDialog
      v-model="kingFilterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      :config="{
        tunes: true
      }"
      ridsMutationName="KING_EMIT_RIDS"
      @filterUpdate="updateKingFilter($event)"
      @clearFilterUpdate="kingClearFilter = $event"
    />

    <BaseFilterDialog
      v-model="cgRequirementsDialog"
      :filterOnly="true"
      :raceFilter="cgRound.filter"
      :all_cars="all_cars"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false
      }"
      :initialFilterString="cgRoundFilterString"
      type="cg"
      @filterUpdate="cgUpdateRequirements($event)"
      @clearFilterUpdate="cgRoundFilterToSave = $event"
    />

    <BaseFilterDialog
      v-model="cgFilterDialog"
      :cgAddingOppoCar="cgAddingOppoCar"
      :cgAddingYouCar="cgAddingYouCar"
      :raceFilter="cgRound.filter"
      :all_cars="all_cars"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false
      }"
      type="cg"
      ridsMutationName="CG_EMIT_RIDS"
      @addCar="addCarCg($event)"
      @listRids="cgAnalyseRoundFinish($event);"
      @clearFilterUpdate="cgFilterForAnalyse = $event"
    />

    <BaseFilterDialog
      v-model="eventRequirementsDialog"
      :filterOnly="true"
      :raceFilter="event.filter"
      :all_cars="all_cars"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false
      }"
      :initialFilterString="eventFilterString"
      type="event"
      @filterUpdate="eventUpdateRequirements($event)"
      @clearFilterUpdate="eventFilterToSave = $event"
    />

    <BaseFilterDialog
      v-model="clubRequirementsDialog"
      :filterOnly="true"
      :raceFilter="clubReqsGroupModel.filter"
      :all_cars="all_cars"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false
      }"
      :initialFilterString="clubCurrentFilterString"
      type="event"
      @filterUpdate="eventUpdateRequirements($event)"
      @clearFilterUpdate="clubCurrentFilterToSave = $event"
    />

    <BaseFilterDialog
      v-model="eventKingDialog"
      :filterOnly="true"
      :raceFilter="eventFilterForKing"
      :all_cars="all_cars"
      :config="eventFilterConfig"
      :cgAddingYouCar="false"
      ridsMutationName="EVENTKING_EMIT_RIDS"
      type="event"
      @close="eventCloseKingFilter()"
      @filterUpdate="eventEventKFilter()"
      @clearFilterUpdate="eventFilterForKing = $event"
      @listRids="eventAnalyseKFilter();">
      <template v-if="user && user.tier <= 3" slot="header">
        <div class="Main_FilterHeaderLeft">
          <div v-if="eventPicksList.length > 0" class="Main_FilterHeaderLeftBox">
            <BaseConfigCheckBox v-model="eventShowOnlyPicks" name="eventShowOnlyPicks" :label="$t('m_eventShowOnlyPicks')" />
            <BaseConfigCheckBox v-model="eventForcePicks" name="eventForcePicks" :label="$t('m_eventForcePicks')" />
          </div>
          <div v-else/>
          <div class="Main_FilterHeaderLeftRight">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
              @click="eventFindRqSavers()">{{ $t("m_findRqSavers") }}</button>
          </div>
        </div>
      </template>
    </BaseFilterDialog>

    <BaseFilterDialog
      v-model="eventAddCarDialog"
      :raceFilter="event.filter"
      :all_cars="all_cars"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false
      }"
      type="event"
      ridsMutationName="EVENT_EMIT_RIDS"
      @addCar="addCarEvent($event)"
      @listRids="cgAnalyseRoundFinish($event);"
    />

    <BaseSearchTrackDialog
      :active="customTrackDialog"
      :mode="mode"
      @close="closeDialogTrackSearch()"
      @toggleTrack="toggleTrack($event.track, $event.e)"
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
            v-if="mode !== 'events'"
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
                :disabled="((needSave && !isRoundEmptyForUser) && (!tuneDialogisOppo || !user || !user.mod)) || (tuneDialogisOppo && (!user || (user && !user.mod && !isRoundEmptyForUser)))"
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
              :title="(((tuneDialogCar.data || {})[item] || {}).info || {}).tuneCreator"
              class="D_Button Row_DialogButtonTune Row_DialogButtonTuneRelative"
              @click="changeTuneCar(tuneDialogCar, item)">
              {{ item }}
              <div v-if="tunesCount[item]" class="D_ButtonNote">{{ tunesCount[item] }}</div>
            </button>
            <button
              v-if="user && user.tier <= 2 && showCustomTunes"
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
              <div v-if="tuneDialogCar.selectedTune !== 'Other' && tuneDialogCar.selectedTune !== '000'" class="Row_DialogCardRight">
                <BaseText
                  :value="(((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).topSpeed"
                  :disabled="!tuneDialogCar.selectedTune ||
                             !user ||
                             ( (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).topSpeed ?
                             (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {})[`topSpeed_user`] !== user.username ? user.mod ? false : true : false : false )"
                  type="topSpeed"
                  :label="$t('c_topSpeed')"
                  class="Space_Bottom Row_FieldStat"
                  placeholder="-"
                  @change="changeStatCar(tuneDialogCar, 'topSpeed', $event)" />
                <BaseText
                  :value="(((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).acel"
                  :disabled="!tuneDialogCar.selectedTune ||
                             !user ||
                             ( (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).acel ?
                             (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {})[`acel_user`] !== user.username ? user.mod ? false : true : false : false )"
                  type="acel"
                  label="0-60mph"
                  class="Space_Bottom Row_FieldStat"
                  placeholder="-"
                  @change="changeStatCar(tuneDialogCar, 'acel', $event)" />
                <BaseText
                  :value="(((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).hand"
                  :disabled="!tuneDialogCar.selectedTune ||
                             !user ||
                             ( (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).hand ?
                             (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {})[`hand_user`] !== user.username ? user.mod ? false : true : false : false )"
                  type="hand"
                  :label="$t('c_handling')"
                  class="Row_FieldStat"
                  placeholder="-"
                  @change="changeStatCar(tuneDialogCar, 'hand', $event)" />
              </div>
            </div>
          </div>
          <div v-if="tuneDialogCar.tags && tuneDialogCar.tags.length > 0" class="Row_DialogCardTags Space_TopPlus">
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
          <div v-if="user && currentTracks.length > 0 && carDetailsList.length > 1 && mode === 'classic'" class="Main_">
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
        <template v-if="mode === 'classic'">
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
        <div class="Main_SectionSelectorLayout">
          <div class="Main_SectionSelectorBox">
            <button
              :class="{ D_ButtonChangeModeDisabled: mode === 'classic' }"
              :disabled="mode === 'classic' || cgLoadingAny || cgNeedSave || eventLoadingAny || eventNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('classic')">
              {{ $t("m_home") }}
            </button>
            <button
              :class="{ D_ButtonChangeModeDisabled: mode === 'cg' }"
              :disabled="mode === 'cg' || needSave || eventLoadingAny || eventNeedSave || clubLoadingAny || clubTrackNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('cg')">
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
              v-if="false"
              :class="{ D_ButtonChangeModeDisabled: mode === 'clubs' }"
              :disabled="mode === 'clubs' || needSave || cgLoadingAny || cgNeedSave || eventLoadingAny || eventNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('clubs')">
              {{ $t("m_clubs") }}
            </button>
          </div>
        </div>
        <div v-if="!needSave && mode === 'classic'" class="Main_OptionsItem" style="margin-top: 5px;">
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
              <div class="Main_CustomTrackRight">
                <template>
                  <BaseTrackType
                    :circuit="item.list"
                    :isTrackSet="true"
                    @toggleTrackSet="toggleTrackSet($event)" />
                </template>
              </div>
            </div>
            <button
              class="D_Button Main_OptionsButton Main_OptionsTracksetMore"
              @click="openDialogTrackSearch()">{{ $t("m_more3dot") }}</button>
          </div>
        </div>
        <div v-else-if="!!user && needSave && mode === 'classic'" class="Main_OptionsSaveData">
          <button
            :class="{ D_Button_Loading: saveLoading }"
            class="D_Button Main_SaveAllButton"
            @click="saveAll()">{{ $t("m_save") }}</button>
        </div>
        <div v-if="mode === 'classic'" class="Main_OptionsDual">
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
        <div v-if="mode === 'classic'" class="Main_OptionsMemory">
          <div class="Main_MemoryLine">
            <span class="Main_MemoryLabel">{{ memory.find(x => typeof x === 'string') ? $t("m_load") : $t("m_memory") }}</span>
            <button
              v-for="(m, index) in memory"
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
              class="D_Button Main_OptionsButton Main_MemorySave"
              @click="saveMemory(index, $event)">
              <span style="pointer-events: none;">{{ index+1 }}</span>
            </button>
          </div>
        </div>
        <BaseMenuFooter
          :mode="mode"
          :user="user"
          @librarySearchDialog="librarySearchDialog = true;"
          @openKingOfDialog="openKingOfDialog()"
          @openAdvancedOptions="openAdvancedOptions()"
          @openAbout="openAbout()" />
      </div>
    </BaseDialog>
    <BaseAboutDialog
      :active="aboutDialog"
      @close="closeAbout()"/>
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
      :active="loginDialog"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      zindex="102"
      @close="loginDialog = false;">
      <div style="Main_DialogLoginWrap">
        <MainLogin :wrap="true" @success="loginDialog = false;" />
      </div>
    </BaseDialog>
    <BaseDialog
      :active="cgSeletorDialog"
      :transparent="true"
      :lazy="true"
      max-width="460px"
      min-width="240px"
      class="Cg_SelectorDialog"
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
            <BaseButtonTouch
              style="padding-left: 15px;"
              class="Main_SearchItem"
              @click="loadChallengeFull(item.date, undefined, $event)"
              @longTouch="loadChallengeFull(item.date, undefined, { shiftKey: true, ctrlKey: true })">
              <div v-html="item.nameStyled" class="Main_SearchItemRight" />
            </BaseButtonTouch>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="cgRoundSelectorDialog"
      :transparent="true"
      :lazy="true"
      max-width="460px"
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
              style="padding-left: 15px;"
              class="Main_SearchItem"
              @click="loadCgRound(cg.date, index)">
              <div class="Main_SearchItemRight">{{ $tc("m_round", 1) }} {{ index+1+cgCurrentRoundSum }}</div>
              <div v-if="item.lastAnalyze" class="Main_RoundDone">
                <i class="ticon-star Main_RoundDoneIcon" aria-hidden="true"/>
              </div>
              <div v-if="item.toApprove && item.toApprove.length > 0" class="Main_RoundDone">
                <i class="ticon-star Main_RoundDoneIcon" style="color: unset;" aria-hidden="true"/>
              </div>
              <span v-if="item.creator && item.lastAnalyze" class="Main_RoundDoneCreator">
                <span class="Main_SearchResultUserBy Cg_Creator">{{ $t("m_by") }}&nbsp;</span>
                <span
                  :class="`Main_UserT${highlightsUsers[item.creator]}`"
                  class="Main_SearchResultUser Cg_Creator">{{ item.creator }}</span>
              </span>
            </button>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="cgNewDialog"
      :transparent="false"
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
      max-width="460px"
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
          <template v-for="item in eventList">
            <BaseButtonTouch
              style="padding-left: 15px;"
              class="Main_SearchItem"
              @click="loadEventFull(item.date, $event)"
              @longTouch="loadEventFull(item.date, { shiftKey: true, ctrlKey: true })">
              <div v-html="item.nameStyled" class="Main_SearchItemRight" />
            </BaseButtonTouch>
          </template>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="eventNewDialog"
      :transparent="false"
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
            placeholder="" />
        </div>
        <div v-if="user && user.username === 'TiagoXavi'" class="Main_SaveGalleryBoxCheck">
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
      :active="eventRqEditDialog"
      :transparent="false"
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
      max-width="400px"
      @close="announcementDialog = false;">
      <div class="Main_AnnouncementLayout">
        <div class="Main_AnnouncementLogo">
          <BaseLogoSpining />
        </div>
        <div class="Main_AnnouncementBox">
          <div class="Main_AnnouncementTitle">Contest!</div>
          <div class="Main_AnnouncementBody">New cars are there. There is a 2nd edition of TDR Contest happening for them.<br><br>Check our discord for more information.</div>
          <div class="Main_AnnouncementMaybe">29th july - 13th august</div>

          <BaseDiscordButton style="margin-top: 20px;" />
        </div>
      </div>
    </BaseDialog>
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
        <BaseConfigCheckBox v-model="cgDontRepeatSolution" name="cgDontRepeatSolution" :label="`${$t('m_challenges')}: ${$t('m_cgDontRepeatSolution')}`" @change="cgReCalcRound()" />
        <BaseConfigCheckBox v-model="showPointsCgForce" name="showPointsCgForce" :label="`${$t('m_challenges')}: ${$t('m_showPointsCgForce')}`" @change="cgReCalcRound()" />
        <div v-if="isMobile" class="Main_SaveGalleryBox" style="margin-top: 15px;">
          <div class="Main_OptionsLabel">{{ $t("m_zoom") }}</div>
          <div class="Main_FilterChipsFlex" style="justify-content: flex-start;">
            <template v-for="(item, ix) in zoomLevels">
              <BaseChip
                v-model="zoomLevel"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Small"
                required="true"
                :value="item"
                @click="changeZoom($event)" />
            </template>
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="eventCompDialog"
      :transparent="false"
      :disableScroll="true"
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
              style="padding-left: 15px;"
              class="Main_SearchItem"
              @click="clubTracksetSelectorClick(item.date, $event)"
              @longTouch="clubTracksetSelectorClick(item.date, { shiftKey: true, ctrlKey: true })">
              <BaseCheckBox :value="clubTracksGroupsActive.find(x => x.date === item.date)" style="margin-right: 10px"/>
              <div class="Main_SearchItemRight">{{ item.name }}</div>
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
          <div v-if="user && user.mod && !clubDays[clubServerDateISO]" class="Cg_SelectorDialogRight">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              :class="{ D_Button_Loading: clubLoadingAny }"
              :disabled="clubLoadingAny"
              @click="clubNewDayConfig(clubServerDateISO)">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ clubServerDateISO }}</span>
            </button>
          </div>
        </div>
        <div class="Main_SearchMid Cg_SelectorDialogMid">
          <template v-for="(item, key) in clubArrayClubDays">
            <BaseButtonTouch
              style="padding-left: 15px;"
              class="Main_SearchItem"
              :class="{ Clubs_DaySelectorActive: item.date === clubDaySelected }"
              @click="clubsLoadDay(item.date, $event)"
              @longTouch="clubsLoadDay(item.date, { shiftKey: true, ctrlKey: true })">
              <!-- <div v-html="item.nameStyled" class="Main_SearchItemRight" /> -->
              <div class="Main_SearchItemRight">{{ item.date }}{{ item.date === clubServerDateISO ? ` (${$t('m_current')})` : '' }}</div>
            </BaseButtonTouch>
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
import BaseAboutDialog from './BaseAboutDialog.vue'
import MainLogin from './MainLogin.vue'
import BaseTypeName from './BaseTypeName.vue'
import BaseAvatar from './BaseAvatar.vue'
import BaseChip from './BaseChip.vue'
import BaseGameTag from './BaseGameTag.vue'
import BaseCheckBox from './BaseCheckBox.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'
import BaseDonateButton from './BaseDonateButton.vue'
import BaseDiscordButton from './BaseDiscordButton.vue'
import BaseMenuFooter from './BaseMenuFooter.vue'
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
import BaseReviewList from './BaseReviewList.vue'
import data_cars from '../database/cars_final.json'
import campaign from '../database/campaign.json'
import tracksRepo from '../database/tracks_repo.json'
import html2canvas from 'html2canvas';
import reimg from 'reimg';

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
    MainLogin,
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
    BaseMenuFooter,
    BaseUserCard,
    BaseAboutDialog,
    BaseEventTrackbox,
    BaseButtonTouch,
    BaseCorner,
    BaseSwitch,
    BaseReviewList
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
      searchInputT: '',
      searchFilterDialog: false,
      librarySearchDialog: false,
      libraryApprove: false,
      showDataFromPast: false,
      showCustomTunes: false,
      showOldTags: false,
      showReviews: false,
      isReviewing: false,
      reviewUrl: {},
      optionsAdvancedDialog: false,
      isFilteringT: false,
      nextId: 0,
      countTimesPerTrack: {},
      debounceFilterT: null,
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
      optionsDialogActive: false,
      printImageDialog: false,
      zoomLevel: "100%",
      zoomLevels: ["60%", "80%", "100%", "120%", "140%"],
      currentViewport: null,
      mraEditing: false,
      mraEditInput: null,
      mraLoading: false,
      aboutDialog: false,
      loginDialog: false,
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
      memory: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      mraData: {},
      customTrackDialog: false,
      backToOptionsDialog: true,
      hoverIndex: -1,
      gameVersion: "Game v20.2",
      mode: "classic",
      showPoints: false,
      showPointsCgForce: true,
      pointsResolved: [],
      carHoverIndex: -1,
      cgLoading: false,
      cgCurrentRound: 0,
      cgCurrentRoundSum: 0,
      cgRoundsNumber: 1,
      cgCurrentId: null,
      cgCurrentName: null,
      cgCacheCars: [],
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
      cgFilterDialog: false,
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
      homePointsToggle: false,
      cgDontRepeatSolution: true,
      cgPointsEditDialog: false,
      cgPointsEditModel: null,
      cgPointsEditString: null,
      cgPointsEditRace: null,
      cgPointsIsDraw: false,
      cgShowResetSavedHand: false,
      cgFilterForAnalyse: {},
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
      eventRqNeedToSave: false,
      eventRequirementsDialog: false,
      eventKingDialog: false,
      eventCheckFilterCodePre: null,
      eventCheckFilterCode: null,
      eventKingTracks: [],
      eventAddCarDialog: false,
      eventFilterToSave: null,
      eventFilterString: null,
      eventFilterForKing: {},
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
      eventEnablePicks: true,
      eventScoreType: "saverScore3",
      eventScoreList: ["saverScore1", "saverScore2", "saverScore3"],
      club: {},
      clubLoading: false,
      clubNewLoading: false,
      clubAnalyseLoading: false,
      clubFirstLoading: true,
      clubServerDate: null, 
      clubServerDateISO: null, 
      clubTracksGroupModel: {},
      clubReqsGroupModel: {},
      clubTracksGroups: [],
      clubTracksGroupsActive: [],
      clubReqGroups: [],
      clubReqGroupsActive: [],
      clubCompilation: [],
      clubCurrentTracksetString: null,
      clubCurrentCompString: null,
      clubCurrentTrackGroupuuid: null,
      clubCurrentTracksetuuids: null,
      clubCurrentName: null,
      clubRequirementsDialog: false,
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
      clubCurrentFilterToSave: null,
      clubCurrentFilterForKing: {},
      clubCurrentCriteriaUuidString: null,
      clubCurrentCriteriaNameString: null,
      clubCurrentKingDialog: false,
      clubCurrentKingFilterCodePre: null,
      clubCurrentKingFilterCode: null,
      kingDialog: false,
      kingFilterDialog: false,
      kingTrack: false,
      kingFilter: {},
      kingIsFiltering: false,
      kingFilterCount: 0,
      kingLoading: false,
      kingShowDownvoted: false,
      kingFixed: false,
      kingAddindTrack: false,
      kingForceVerticalView: true,
      kingClearFilter: {},
      trackTimes: null,
      user: null,
      asMod: false,
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
      all_cars: data_cars,
      toLoadTrackSet: null,
      currentTracks: [],
      currentTracksSetsNames: [],
      tracksButtons: [
        {
          name: "Twisty",
          list: [
            {
              type: "00",
              active: false,
              tracks: ["carPark_a00","gForce_a00","hairpin_a00","indoorKart_a00","kart_a00","slalom_a00","tCircuit_a00","tRoad_a00","fast_a00","fastr_a00","canyonTour_a00"]
            },
            {
              type: "00",
              active: false,
              customSufix: "2",
              tracks: ["gForcer_a00","slalomr_a00","tCircuitr_a00","mnGforce_a00","mnHairpin_a00","mnCityNarrow_a00","mnCity_a00","mnCityLong_a00","mtHairpin_a00","mtTwisty_a00","tokyoLoop_a00","tokyoOffRamp_a00","tokyoOverpass_a00"]
            },
            {
              type: "01",
              active: false,
              tracks: ["carPark_a01","gForce_a01","hairpin_a01","kart_a01","slalom_a01","tCircuit_a01","tCircuitr_a01","tRoad_a01","fast_a01","mnGforce_a01","mnHairpin_a01","mtHairpin_a01","mtTwisty_a01","canyonTour_a01"]
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
              tracks: ["mile4_a00","mile2_a00","mile1_a00","drag100_a00","drag120_a00","drag150_a00","drag170_a00","hClimb_a00","testBowl_a00","draglshape_a00"]
            },
            {
              type: "00",
              active: false,
              customSufix: "2",
              tracks: ["waterDrag_a00","runwayDrag_a00","mile1r_a00","mile4r_a00","drag100b_a00","drag150b_a00","drag30130_a00","drag50150_a00","drag75125_a00","testBowlr_a00"]
            },
            {
              type: "01",
              active: false,
              tracks: ["drag100_a01","drag100b_a01","drag150_a01","mile4_a01","mile2_a01","mile1_a01","testBowlr_a01"]
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
    phantomCar: function() {
      console.log( JSON.parse(JSON.stringify(this.phantomCar.data[this.phantomCar.selectedTune].times)) );
      this.clearAllTracks();
      this.clearAllCars();

      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;

        this.carDetailsList.push(JSON.parse(JSON.stringify(this.phantomCar)));
        this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
        this.nextId++;
        let tracks = [];
        Object.keys( this.phantomCar.data[this.phantomCar.selectedTune].times ).forEach(function (track) {
          tracks.push(track);
        })
        this.moreTracksCar(tracks)
        // 2x
        this.carDetailsList.push(JSON.parse(JSON.stringify(this.phantomCar)));
        this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
        this.nextId++;
        this.carDetailsList[this.carDetailsList.length - 1].data = {};


        axios.get(Vue.preUrl + "/car/" + this.phantomCar.rid)
        .then(res => {
          if (res.data.data) Vue.set(this.carDetailsList[this.carDetailsList.length - 1], "data", res.data.data);
          if (res.data.users) Vue.set(this.carDetailsList[this.carDetailsList.length - 1], "users", res.data.users);
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

      })

    },
    cgNeedSave: function() {
      if (this.cgNeedSave) {
        window.onbeforeunload = function(){
          debugger;
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
    },
    eventNeedSave: function() {
      if (this.eventNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
    },
    clubTrackNeedSave: function() {
      if (this.clubTrackNeedSave || this.clubDayNeedSave || this.clubReqNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
    },
    clubDayNeedSave: function() {
      if (this.clubTrackNeedSave || this.clubDayNeedSave || this.clubReqNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
    },
    clubReqNeedSave: function() {
      if (this.clubTrackNeedSave || this.clubDayNeedSave || this.clubReqNeedSave) {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
    },
  },
  beforeMount() {
    this.isMobile = Vue.options.filters.isMobile();
    this.clearSaveToGallery();
    this.checkMemoryFromStorage();
    this.cgGetLocalStorage();
    this.eventGetLocalStorage();
    let _md = window.localStorage.getItem("_md");
    if (_md) {
      this.asMod = true;
    }



    let mode = window.localStorage.getItem("mode");
    if (mode) {
      this.mode = mode;
    }

    if (this.$route.query && this.$route.query.approve) {
      this.mode = 'classic';
      this.libraryApprove = true;
      setTimeout(() => {
        this.librarySearchDialog = true;
      }, 100);
    }


    



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
    let showDataFromPast = window.localStorage.getItem("showDataFromPast");
    if (showDataFromPast) {
      showDataFromPast = JSON.parse(showDataFromPast);
      this.showDataFromPast = showDataFromPast;
    }
    let showCustomTunes = window.localStorage.getItem("showCustomTunes");
    if (showCustomTunes) {
      showCustomTunes = JSON.parse(showCustomTunes);
      this.showCustomTunes = showCustomTunes;
    }
    let showOldTags = window.localStorage.getItem("showOldTags");
    if (showOldTags) {
      showOldTags = JSON.parse(showOldTags);
      this.showOldTags = showOldTags;
      this.$store.commit("CHANGE_OLD_TAGS", showOldTags);
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
    let cgDontRepeatSolution = window.localStorage.getItem("cgDontRepeatSolution");
    if (cgDontRepeatSolution) {
      cgDontRepeatSolution = JSON.parse(cgDontRepeatSolution);
      this.cgDontRepeatSolution = cgDontRepeatSolution;
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
    let showPointsCgForce = window.localStorage.getItem("showPointsCgForce");
    if (showPointsCgForce) {
      showPointsCgForce = JSON.parse(showPointsCgForce);
      this.showPointsCgForce = showPointsCgForce;
    }
    let homePointsToggle = window.localStorage.getItem("homePointsToggle");
    if (homePointsToggle) {
      homePointsToggle = JSON.parse(homePointsToggle);
      this.homePointsToggle = homePointsToggle;
    }
    let zoomLevel = window.localStorage.getItem("zoomLevel");
    if (zoomLevel) {
      this.zoomLevel = zoomLevel;
      this.changeZoom(zoomLevel);
    }
    

    

    if (this.$route.query && this.$route.query.share && this.$route.query.share.includes("~")) {
      // from query string
      this.changeMode('classic');
      this.decodeTemplateString(this.$route.query.share, true);
    } else if (this.$route.query && this.$route.query.cg && this.$route.query.cg.includes("~")) {
      // from query string
      this.changeMode('cg');

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
    
    this.debounceFilterT = Vue.debounce(this.changeFilterT, 500);
    this.debounceCgSaveBank = Vue.debounce(this.cgSaveBank, 2000);

    this.getLastest();
    this.user = this.$store.state.user;
    this.asMod = this.$store.state.asMod;

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
            if (error.response.status === 401) {
              vm.loginDialog = true;
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
        if (vm.mode === 'classic') {
          car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        } else if (vm.mode === 'classic') {

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
          vm.hoverIndex = mutation.payload;
        }
      }

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
        vm.asMod = mutation.payload.asMod;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
        vm.asMod = false;
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
    optionsDialogComputed() {
      if (this.aboutDialog) return false;
      if (this.loginDialog) return false;
      if (this.customTrackDialog) return false;
      if (this.librarySearchDialog) return false;
      if (this.searchFilterDialog) return false;
      if (this.aboutDialog) return false;
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
              sortedByTracks[trackId].push(x.data[x.selectedTune].times[trackId]);
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
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times
          ) {
            tempValue = vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId];
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
              if (item.includes("_user") && vm.currentTracks.find(track => item.includes(track.code))) {
                contritrs.push(car.data[car.selectedTune][type][item])
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
      if (this.tuneDialogCar.data && this.showCustomTunes) {
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

      if (this.mode === 'classic' && this.tuneDialogCar.data && this.showDataFromPast) {
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
            result[tune] = Object.keys(this.tuneDialogCar.data[tune].times).filter(key => typeof key === 'string' && key.substr(key.length -4, 2) === "_a" && this.tuneDialogCar.data[tune].times[key] !== 0).length;
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
      if (this.mode !== 'cg') return false;
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
      if (this.mode !== 'cg') return false;
      if (!this.user) return false;
      if (this.user.mod) return false;
      if (!this.cgRound) return false;
      if (!this.cgRound.lastAnalyze) {
        return true
      }
    },
    isRoundEmptyForModders() {
      if (this.mode !== 'cg') return false;
      if (!this.user) return false;
      if (!this.user.mod) return false;
      if (!this.cg.date || !this.cg.rounds[this.cgCurrentRound]) return false;
      if (this.cg.rounds[this.cgCurrentRound].reservedTo) return false;
      if (this.cg.rounds[this.cgCurrentRound].creator) return false;
      if (!this.cg.rounds[this.cgCurrentRound].lastAnalyze) {
        return true
      }
      if (this.cgNewSubmitByMod) return true;
    },
    isRoundReadyForSaveUser() {
      if (!this.isRoundEmptyForUser) return false;
      let ready = true;
      this.cgRound.races.map(race => {
        if (!race.rid || race.time === undefined || race.time === null) ready = false;
        if (!race.track) ready = false;
        if (race.cars && race.cars.length > 4) ready = false;
      })
      return ready;
    },
    cgLoadingAny() {
      if (this.mode !== 'cg') return false;
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
    eventComp() {
      if (this.isEvents) return this.event.comp;
      else return this.clubTracksGroupModel.comp;
    },
    pngLabel() {
      return this.pngLoading ? this.$t("m_pleaseWait3dot") : this.$t("m_downloadPng")
    },
    eventNeedSave() {
      if (this.mode !== 'events') return false;
      if (!this.event.date) return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (this.eventFilterToSave && JSON.stringify(this.eventFilterToSave) !== this.eventFilterString) return true;
      if (this.eventTracksetString !== JSON.stringify(this.event.trackset)) return true;
      if (this.eventCompString !== JSON.stringify(this.event.comp)) return true;
      if (this.eventRqEditString !== JSON.stringify(this.event.rqLimit)) return true;
      return false;
    },
    clubTrackNeedSave() {
      if (this.mode !== 'clubs') return false;
      // if (!this.club.date) return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (this.clubFirstLoading) return false;
      // if (this.eventTracksetString !== JSON.stringify(this.event.trackset)) return true;
      if (this.clubCurrentTracksetString !== JSON.stringify(this.clubTracksGroupModel.trackset)) return true;
      if (this.clubCurrentCompString !== JSON.stringify(this.clubTracksGroupModel.comp)) return true;
      if (this.clubCurrentTrackGroupuuid !== JSON.stringify(this.clubTracksGroupModel.trackGroupuuid)) return true;
      if (this.clubCurrentTracksetuuids !== JSON.stringify(this.clubTracksGroupModel.tracksetuuids)) return true;
      if (this.clubCurrentName !== JSON.stringify(this.clubTracksGroupModel.name)) return true;
      // if (this.eventRqEditString !== JSON.stringify(this.event.rqLimit)) return true;
      return false;
    },
    clubReqNeedSave() {
      if (this.mode !== 'clubs') return false;
      // if (!this.club.date) return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      if (!this.clubReqsGroupModel.name) return false;
      if (this.clubFirstLoading) return false;
      if (this.clubCurrentFilterToSave && JSON.stringify(this.clubCurrentFilterToSave) !== this.clubCurrentFilterString) return true;
      if (this.clubCurrentCriteriaUuidString !== JSON.stringify(this.clubReqsGroupModel.criteriauuid)) return true;
      if (this.clubCurrentCriteriaNameString !== JSON.stringify(this.clubReqsGroupModel.name)) return true;
      return false;
    },
    clubDayNeedSave() {
      if (this.mode !== 'clubs') return false;
      // if (!this.club.date) return false;
      if (!this.user || (this.user && !this.user.mod)) return false;
      // console.log("1");
      if (this.clubFirstLoading) return false;
      // if (this.eventFilterToSave && JSON.stringify(this.eventFilterToSave) !== this.eventFilterString) return true;
      // if (this.eventTracksetString !== JSON.stringify(this.event.trackset)) return true;
      // console.log(this.clubDayCurrentTracksetStrig, JSON.stringify(this.clubDaySelectedObj.tracksetGroups));
      if (this.clubDayCurrentTracksetStrig !== JSON.stringify(this.clubDaySelectedObj.tracksetGroups)) return true;
      if (this.clubDayCurrentReqStrig !== JSON.stringify(this.clubDaySelectedObj.criterias)) return true;
      // if (this.eventRqEditString !== JSON.stringify(this.event.rqLimit)) return true;
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
    eventShowAnalyse() {
      if (this.mode !== 'events') return false;
      if (!this.user || !this.user.mod) return false;
      if (this.eventNeedSave) return false;
      if (!this.event || !this.event.date) return false;
      if (this.eventForceAnalyze) return true;
      // let show = true;
      // this.cgRound.races.map(race => {
      //   if (!race.rid || race.time === undefined || race.time === null) show = false;
      //   if (!race.track) show = false;
      //   if (race.cars && race.cars.length > 4) show = false
      // })
      // return show;
    },
    eventFilterConfig() {
      if (this.user && this.user.tier <= 3) {
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
      return this.showPoints || this.showPointsCgForce;
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
      if (this.mode === 'cg') {
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
          circuit.types.find(type => {
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
      let typeOrder = ["00", "01", "c1", "10", "11", "40", "41", "20", "b0", "30", "50", "e0", "c0", "60", "d0", "70", "71"]
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
          x.campaign = `${bestOption.city} ${bestOption.imatch+1}`
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

      // let campaignTracksOutOfDefault = [];
      // this.campaign.map((city, icity) => {
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
      // campaignTracksOutOfDefault = [new Set(campaignTracksOutOfDefault)];
      // console.log(campaignTracksOutOfDefault);
      // debugger;


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
      if (this.mode === 'cg') {
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
      if (this.backToOptionsDialog) this.optionsDialogActive = true;
      this.searchTracks = '';
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
    addCarCg(newCar) {
      let race = this.cgRound.races[this.cgRaceSelected];
      this.cgFilterDialog = false;

      let found = this.cgCacheCars.find(x => x.rid === newCar.rid);
      if (!found) {
        this.cgCacheCars.push({ rid: newCar.rid });
      }

      if (this.cgAddingOppoCar) {
        // adding oppo
        Vue.set(race, "rid", newCar.rid);
        Vue.set(race, "car", newCar);
      } else if (this.cgAddingYouCar) {
        let found = race.cars.findIndex(x => x.rid === (race.cars[race.carIndex] || {}).rid && x.tune === undefined);
        if (found > -1) {
          race.carIndex = found;
        } else {
          race.cars.push( { rid: newCar.rid } );
          race.carIndex = race.cars.length-1;
          Vue.set(race.cars[race.carIndex], "photo", this.cgResolvePhotoUrl(newCar.rid));
          Vue.set(race.cars[race.carIndex], "car", JSON.parse(JSON.stringify(newCar)));
          Vue.set(race.cars[race.carIndex], "color", Vue.resolveClass(race.cars[race.carIndex].car.rq, race.cars[race.carIndex].car.class, "color"));
        }
      }
      this.downloadCar(newCar.rid);
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
        this.changedMode();
      }, 100);
    },
    changedMode() {
      if (this.mode === "classic" && this.currentTracks.length === 0) {
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
      if (this.mode === "classic") {
        this.searchFilterDialog = false;
      }

      if (this.mode === "cg") {
        if (this.cgList.length === 0) {
          this.loadChallenges();
        }
      }
      if (this.mode === "events") {
        if (this.eventList.length === 0) {
          this.loadEvents();
        }
      }
      if (this.mode === "clubs") {
        if (this.clubTracksGroups.length === 0) {
          this.loadClubs();
        }
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
      }
      
      this.updateCarLocalStorage();
      this.updateOptions();

      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
      })
    },
    getLastest() {
      let vm = this;

      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        vm.highlightsUsers = {
          "bcp_": 'mod',
          "TiagoXavi": 'mod',
          "Bigredmachine": 'mod',
          "duck": 'mod',
          "HansKasai": 'mod',
          "fiero": 'mod',
          "L1ZVRD": 'mod',
          "intrx": 'mod',
          "rei348": 'mod',
          "Enginn": 'mod',
          "vel_8": 'mod',
          "Ansami_MH": 'mod',
          "RenMasamune": 'mod',
          "boliveira82": 'mod',
          "ELtotheLIS": 'mod',
          "CapSora": 'mod',
          "Mattsy": 'mod',
          "Skapis": 'mod',
          "Draugr": 'mod',
          "TopDrives": 'mod',
          "Asaneon": 'mod',
          "Dennis": 'mod',
          "Liam": 'mod',
          "MichaelB": 'mod',
          "Leafclaw": 'mod'
        };
        let pUsers = res.data.find(x => x.id === 'pUsers').value;
        Object.keys( pUsers ).forEach(key => {
          pUsers[key].map(user => {
            Vue.set(vm.highlightsUsers, user, Number(key.slice(-1)));
          })
        })
        vm.highlightsUsers["Ekukickz"] = "w1";
        vm.highlightsUsers["Jayzoku"] = "w2";
        vm.highlightsUsers["Kabash"] = "w3";

        this.lastestList = res.data.find(x => x.id === 'lastestcars').value;

        this.mraData = res.data.find(x => x.id === 'mra').value;
        this.all_cars.map(x => {
          Vue.set(x, "mra", this.mraData[x.rid] || x.mra);
        })
        this.carDetailsList.map(x => {
          Vue.set(x, "mra", this.mraData[x.rid] || x.mra);
        })


      })
      .catch(error => {
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
          this.all_cars.find(x => {
            if (x.rid === y.rid) {
              result.push(JSON.parse(JSON.stringify(x)));
              if (y.selectedTune) result[result.length-1].selectedTune = y.selectedTune;
              result[result.length-1].softId = this.nextId;
              this.nextId++;
              return true;
            }
          })
        })
        
      }
      Vue.set(this, "carDetailsList", result);
      this.downloadDataCars(true);
    },
    saveAll(saveBankAfter = false) {
      this.saveLoading = true;


      let obj = "carDetailsList";
      if (this.mode === 'cg') obj = "cgCacheCars";
      let simplifiedCars = [];
      this[obj].map(x => {
        if (x.dataToSave) {
          simplifiedCars.push({
            rid: x.rid,
            data: x.dataToSave
          });
        }
      });

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
        if (this.mode === 'classic') {
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
      .then(() => {
        this.saveLoading = false;
      });

    },
    downloadDataCars(forceClassic = false) {
      this.downloadLoading = true;
      let simplifiedCars = [];

      if (this.mode === 'classic' || forceClassic) {
        this.carDetailsList.map(x => {
          simplifiedCars.push({ rid: x.rid })
        });
      } else if (this.mode === 'cg') {
        this.cgCacheCars.map(x => {
          if (x.rid && !x.data) {
            simplifiedCars.push({ rid: x.rid })
          }
        });
      }

      if (simplifiedCars.length === 0) {
        this.downloadLoading = false;
        this.checkAnnouncement();
        if (this.mode === 'cg') {
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
        this.applyNewData(res.data, this.mode === 'cg');
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
    downloadCar(rid) {
      this.downloadLoading = true;

      let url = Vue.preUrl + "/car/" + rid;
      url = this.finalizeUrl(url);      

      axios.get(url)
      .then(res => {
        if (this.mode === 'classic') {
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
              this.applyNewData([res.data]);
            }
          } else {
            this.applyNewData([res.data]);
          }
        } else {
          this.applyNewData([res.data]);
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
    applyNewData(newData, isCgInitial = false) {
      let obj = "carDetailsList";

      if (this.mode === 'cg') {
        obj = "cgCacheCars";
      }
      if (this.mode === 'events') {
        obj = "eventCacheCars";
      }

      this[obj].map(x => {
        newData.map(y => {
          if (x.rid === y.rid) {
            if (y.data) Vue.set(x, "data", y.data);
            if (y.users) Vue.set(x, "users", y.users);
            if (y.reviews) Vue.set(x, "reviews", y.reviews);
          }
        })
      });

      if (this.mode === 'cg' && this.cgRound.date) {
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
      if (this.mode === 'cg' || this.mode === 'events') boxName = ".Cg_Layout";

      let pose = document.querySelector(boxName);
      pose.classList.add("Main_BodyPrint");

      if (this.mode === 'classic') {
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

      } else if (this.mode === 'cg') {
        _width = (pose.clientWidth) * 1.3;
        _height = (pose.clientHeight) * 1.3;
      } else if (this.mode === 'events') {
        let reduceHeight = 0;
        let box1 = document.querySelector(".Cg_Header");
        let box2 = document.querySelector(".Cg_Mid");
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
      html2canvas(pose, options).then(function(canvas) {
        reimg.ReImg.fromCanvas(currentCanvas).downloadPng()
        c_container.classList.remove("App_PrintContainerShow")

        document.querySelector(boxName).classList.remove("Main_BodyPrint");
        vm.windowWidth = vm.tempWindowWidth;
        vm.pngLoading = false;
      });
    },
    generateUrl(isForTemplate = false) {
      let result = `${window.location.origin}?`;
      if (isForTemplate) result = '';

      if (this.mode === 'classic') {
        result += `share=`;
        this.currentTracks.map(x => {
          result += `~K${x.id}_a${x.surface}${x.cond}`
        });
        this.carDetailsList.map(x => {
          result += `~C${x.rid}${x.selectedTune ? '~T'+x.selectedTune : '' }`
        });
      } else if (this.mode === 'cg') {
        result += `cg=`;
        result += `~G${this.cg.date}~R${this.cgCurrentRound+1}`
      } else if (this.mode === 'events') {
        result += `event=`;
        result += `~G${this.event.date}`
      }

      if (result.length > 2045) {
        // não dá
      }

      if (isForTemplate) {
        return result
      } else {
        this.shareUrl = result.replaceAll("+", "%2B");
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
    },
    outsideClick() {
      this.$store.commit("HIDE_DETAIL");
      if (this.mode !== "events") {
        this.showPoints = false;
      }
    },
    resolveChangeTime(car, NEW, number, tune) {
      let vm = this;

      if (!car.data) Vue.set(car, "data", {});
      if (!car.data[tune]) Vue.set(car.data, tune, {});
      if (!car.data[tune].times) Vue.set(car.data[tune], "times", {});
      /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
      /**/ if (!car.dataToSave[tune]) Vue.set(car.dataToSave, tune, {});
      /**/ if (!car.dataToSave[tune].times) Vue.set(car.dataToSave[tune], "times", {});

      Vue.set(car.data[tune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], number);
      Vue.set(car.data[tune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}_user`], vm.user.username);
      Vue.set(car.data[tune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}_downList`], []);
      Vue.set(car.data[tune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}_upList`], []);
      /**/ Vue.set(car.dataToSave[tune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], number);
      if (!car.users || !car.users.includes(vm.user.username)) {
        Vue.set(car, "users", car.users && car.users.length > 0 ? [...car.users, vm.user.username] : [vm.user.username]);
      }
      vm.needSaveChange(true);
    },
    changeTuneCar(car, newTune, fromRow = false) {

      if (newTune === car.selectedTune) {
        newTune = undefined
      }

      if (this.mode === 'cg' && this.tuneDialogActive) {
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

      if (this.mode === 'cg')  {
        car = this.cgCacheCars.find(x => x.rid === car.rid);
      }

      if (!car.data) Vue.set(car, "data", {});
      if (!car.data[selectedTune]) Vue.set(car.data, selectedTune, {});
      if (!car.data[selectedTune].info) Vue.set(car.data[selectedTune], "info", {});
      /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
      /**/ if (!car.dataToSave[selectedTune]) Vue.set(car.dataToSave, selectedTune, {});
      /**/ if (!car.dataToSave[selectedTune].info) Vue.set(car.dataToSave[selectedTune], "info", {});

      Vue.set(car.data[selectedTune].info, type, value);
      Vue.set(car.data[selectedTune].info, `${type}_user`, this.user.username);
      /**/ Vue.set(car.dataToSave[selectedTune].info, type, value);
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
          if (error.response.status === 401) {
            vm.loginDialog = true;
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
      this.memory = this.memory.map((m, index) => {
        let found = window.localStorage.getItem(`m${index}`);
        if (found) {
          return found;
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
        this.decodeTemplateString(this.memory[index], true);
        this.updateOptions();
      }
    },
    saveMemory(index, e) {
      let temp = this.generateUrl(true);
      Vue.set(this.memory, index, temp);
      window.localStorage.setItem(`m${index}`, temp);
      e.srcElement.classList.add("D_Button_Correct");
      setTimeout(() => {
        e.srcElement.classList.remove("D_Button_Correct");
      }, 1500);
    },
    clearDataToSave() {
      let obj = "carDetailsList";
      if (this.mode === 'cg') obj = "cgCacheCars";

      this[obj].map(x => {
        delete x.dataToSave;
      });
    },
    loadChallenges(resolveInitial = true) {
      this.cgLoading = true;

      axios.get(Vue.preUrl + "/searchCg")
      .then(res => {
        this.cgList = res.data.value;
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

      axios.post(Vue.preUrl + "/getCgById", {
        date: date
      })
      .then(res => {
        this.cgLoadedAssets = [];
        let cg = this.cgList.find(x => x.date === date)
        if (cg.date === res.data.date) {
          Vue.set(cg, "rounds", res.data.rounds);
          this.cgCurrentRoundSum = res.data.startNumer || 0;
          this.cgLoading = false;
          this.loadCgRound(date, round);
        }
        this.lookForChangedCars(res.data);
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
          this.cgRound.filter.yearModel[1] = 2024;
        }
        if (this.cgRound.filter.rqModel && this.cgRound.filter.rqModel[1] === 100) {
          this.cgRound.filter.rqModel[1] = 114;
        }
      }
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

      this.cgResolveFilter();
      this.cgUpdateLocalStorage();

      this.cgResolveRoundCars(false);
      this.checkRaceTimesNull();
      this.loadCgRoundAsset(id, round);
    },
    checkRaceTimesNull() {
      this.cgRound.races.map(race => {
        if (race.time !== null) return;
        if (!race.car || !race.car.selectedTune || !race.track) {
          race.time = null
          return;
        }

        let oppo = this.cgCacheCars.find(x => x.rid === race.car.rid)
        let tryoppotime;
        try {
          tryoppotime = oppo.data[race.car.selectedTune].times[race.track]
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
    loadCgRoundAsset(id, round) {
      let roundId = `${id}_${round}`;
      if (this.cgLoadedAssets.includes(roundId)) return;
      if (this.cgIsEmptyRound()) return;
      this.cgLoading = true;

      axios.get(Vue.preUrl + `/asset/${roundId}`)
      .then(res => {
        // load asset
        let votes = res.data.filter(x => x.sort.includes("votes_"));
        if (votes) {
          let realCgRound = this.cg.rounds[this.cgCurrentRound];
          if (Array.isArray(realCgRound.toApprove) && realCgRound.toApprove.length > 0) {
            votes.map(item => {
              let index = Number(item.sort.substr(6));
              if (realCgRound.toApprove[index]) {
                realCgRound.toApprove[index].downList = item.value.down;
                realCgRound.toApprove[index].upList = item.value.up;
              }
            })
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
    cgResolveRoundCars(download = true) {
      let listRids = [];
      let minCars = [];

      this.cgRound.races.map(race => {
        listRids.push(race.rid);
        let found = this.cgCacheCars.find(x => x.rid === race.rid);
        if (!found) {
          this.cgCacheCars.push({ rid: race.rid });
        }
        race.cars.map(car => {
          listRids.push(car.rid)
        })
      })
      listRids = [...new Set(listRids)];
      this.all_cars.map(x => {
        if (listRids.includes(x.rid)) {
          minCars.push(x)
        }
      })

      this.cgRound.races.map(race => {
        let foundOppo = minCars.find(x => x.rid === race.rid);
        if (foundOppo) foundOppo = JSON.parse(JSON.stringify(foundOppo));
        Vue.set(race, "car", foundOppo);
        if (race.tune) Vue.set(race.car, "selectedTune", race.tune);

        race.cars.map((car, icar) => {
          Vue.set(car, "photo", this.cgResolvePhotoUrl(car.rid));
          Vue.set(car, "car", JSON.parse(JSON.stringify(minCars.find(x => x.rid === car.rid))));
          Vue.set(car, "color", Vue.resolveClass(car.car.rq, car.car.class, "color"));
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
      } else if (Object.keys(realCgRound.toApprove).length > 0) {
        this.cgApprovingLength = 1;
        this.cgRound = realCgRound.toApprove;
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
            x.campaign = `${bestOption.city} ${bestOption.imatch+1}`
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
      this.tuneDialogCar.data = this.cgCacheCars.find(x => x.rid === race.cars[race.carIndex].rid).data;
      this.calcRaceResult(race);
    },
    cgShowTuneDialog(car, race, isOppo = false) {
      this.tuneDialogCar = car;
      this.tuneDialogCar.data = this.cgCacheCars.find(x => x.rid === car.rid).data;
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

      let oppo = this.cgCacheCars.find(x => x.rid === race.car.rid)
      let tryoppotime;
      try {
        tryoppotime = oppo.data[race.car.selectedTune].times[race.track]
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
      
      
      
      let you = this.cgCacheCars.find(x => x.rid === youRid)
      if (!you) {
        this.cgCacheCars.push({ rid: youRid });
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
      let youtime = ((you.data[youTune] || {}).times || {})[race.track]
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
      if (this.mode !== 'cg') return;
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
    cgResolvePhotoUrl(rid) {
      try {
        return require('@/imgs_final/' + decodeURI(rid) + '.jpg')
      } catch (error) {
        return ''
      }
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
      this.cgRound.races.map(race => {
        try {
          fill = fill + race.cars[race.carIndex].car.rq
        } catch (error) {
          // nada
        }
      })
      Vue.set(this.cgRound, "rqFill", fill);
    },
    cgChangeTimeOppo(race, event) {
      let car = race.car;
      let tune = car.selectedTune;
      let carData = this.cgCacheCars.find(x => x.rid === car.rid);
      let NEW = event.item;
      let number = event.number;
      let allowedTunes = ["332", "323", "233"];
      if (car.class === 'S' || car.class === 'A') {
        allowedTunes.push("111")
      }
      if (allowedTunes.includes(tune)) {
        // put on cgCacheCars
        this.resolveChangeTime(carData, NEW, number, tune);
      }
      Vue.set(race, "time", number);
      this.cgRoundToSave.push({
        type: "oppoTime",
        time: number,
        raceIndex: this.cgRound.races.indexOf(race)
      })
      this.calcRaceResult(race);
    },
    cgChangeTimeYou(race, event) {
      let car = race.cars[race.carIndex].car;
      let tune = car.selectedTune;
      let carData = this.cgCacheCars.find(x => x.rid === car.rid);
      let NEW = event.item;
      let number = event.number;

      this.resolveChangeTime(carData, NEW, number, tune);
      this.calcRaceResult(race);
    },
    cgDeleteTime(race, event, isOppo = false) {
      let vm = this;
      let car = race.cars[race.carIndex].car;
      if (isOppo) car = race.car;
      let tune = car.selectedTune;
      let carData = this.cgCacheCars.find(x => x.rid === car.rid);
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
          if (error.response.status === 401) {
            vm.loginDialog = true;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
          if (error.response.status === 401) {
            vm.loginDialog = true;
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
    cgSaveBank(customArray) {
      if (!window.location.origin.includes('topdrives')) {
        console.log("trySave", customArray);
        return;
      };
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
      let found = this.cgCacheCars.find(x => x.rid === race.cars[race.carIndex].rid);
      if (!found) {
        this.cgCacheCars.push({ rid: race.cars[race.carIndex].rid });
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
          found = this.cgCacheCars.find(x => x.rid === race.cars[race.carIndex].rid);
          if (!found) {
            this.cgCacheCars.push({ rid: race.cars[race.carIndex].rid });
          }
        })
        return
      }
      this.cgShowResetSavedHand = false;

      if (!this.cgDontRepeatSolution) return;
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
                  rq: this.all_cars.find(y => y.rid === car.rid).rq,
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

            let found = this.cgCacheCars.find(x => x.rid === race.cars[race.carIndex].rid);
            if (!found) {
              this.cgCacheCars.push({ rid: race.cars[race.carIndex].rid });
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
    cgOpenRequirementDialog() {
      this.cgRequirementsDialog = true;
    },
    cgUpdateRequirements(filter) {
      this.cgRound.filter = filter;
      this.cgRequirementsDialog = false;
    },
    cgOpenAddYouCar(irace) {
      this.cgRaceSelected = irace;
      this.cgAddingYouCar = true;
      this.cgAddingOppoCar = false;

      this.cgFilterDialog = true;
    },
    cgOpenAddOppoCar(irace) {
      this.cgRaceSelected = irace;
      this.cgAddingOppoCar = true;
      this.cgAddingYouCar = false;

      this.cgFilterDialog = true;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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

      let car = this.cgCacheCars.find(x => x.rid === race.cars[race.carIndex].rid);
      let trytime
      if (!car) return;
      try {
        trytime = car.data[race.cars[race.carIndex].tune].times[race.track]
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
      this.$store.commit("CG_EMIT_RIDS", { rqMax, rqMin });
    },
    cgAnalyseRoundFinish() {

      let clearRound = this.cgRound.races.map(x => {
        let time;
        let cgCar = this.cgCacheCars.find(y => y.rid === x.rid);

        if (
          x.car.selectedTune &&
          cgCar &&
          cgCar.data && 
          cgCar.data[x.tune] &&
          cgCar.data[x.tune].times &&
          cgCar.data[x.tune].times[x.track] !== undefined
        ) {
          time = cgCar.data[x.tune].times[x.track];
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
        cgRound: clearRound
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
        submit: this.cgApprovingIndex,
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
    cgIsEmptyRound() {
      if (!this.cgRound || !this.cgRound.races) return true;
      let isEmpty = true;
      this.cgRound.races.find(race => {
        if (race.track) {
          isEmpty = false;
          return true;
        }
      })
      return isEmpty;
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
      }

      if (this.user && this.user.mod) {
        this.cgNewSubmitByMod = true;
        if (copy) {
          this.cgNewSubmitByModTemplate = JSON.parse(JSON.stringify(this.cgRound));
        }
      }
    },
    styleCgList() {
      this.cgList.sort((a,b) => {
        return a.name.localeCompare(b.name);
      })
      this.cgList.map(x => {
        let styl = x.name;
        Vue.set(x, "index", 0);
        if (x.name.substr(0, 7) === 'JTTEC: ') {
          Vue.set(x, "index", 1);
          styl = `<span class="Cg_EX">JTTEC: </span>${x.name.substr(14)}`
        }
        if (x.name.substr(0, 11) === 'Yellowbird ') {
          Vue.set(x, "index", 2);
          styl = `<span class="Cg_YB">Yellowbird </span>${x.name.substr(11)}`
        }
        if (x.name.substr(0, 14) === 'Skyline Nismo ') {
          Vue.set(x, "index", 3);
          styl = `<span class="Cg_SN">Skyline Nismo </span>${x.name.substr(14)}`
        }
        if (x.name.substr(0, 17) === 'Proving Grounds: ') {
          Vue.set(x, "index", 4);
          styl = `<span class="Cg_PG">Proving Grounds: </span>${x.name.substr(17)}`
        }
        Vue.set(x, "nameStyled", styl);
      })

      let roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX", "XXXI", "XXXII", "XXXIII", "XXXIV", "XXXV", "XXXVI", "XXXVII", "XXXVIII", "XXXIX", "XL"];
      this.cgList.map(x => {
        let split = x.name.split(" ");
        let romanString = null;
        let indexOfRoman = split.findIndex( part => {
          if (roman.includes(part)) {
            romanString = part;
            return true;
          }
          if (roman.includes(part.slice(1 ,-1))) {
            romanString = part.slice(1 ,-1);
            return true;
          }
        } );
        if ( indexOfRoman > -1 ) {
          // contain roman
          x.romanValue = roman.indexOf(romanString)+1;
        }
      })

      let colors = ["#c29cff", "#a9d0ff", "#8dcf8f", "#bfbb3d", "#25b1b1"];
      let chooseColors = {};

      this.cgList.sort((a,b) => {
        let aIndex = a.name.indexOf(":");
        let bIndex = b.name.indexOf(":");
        let agroup = a.name.slice(0, aIndex);
        let bgroup = b.name.slice(0, bIndex);

        if (a.romanValue && b.romanValue && agroup === bgroup) {
          let num = this.generateRandom(colors.length-1, agroup);
          let color;
          let styl;
          if (chooseColors[agroup]) color = chooseColors[agroup];
          else {
            color = colors[num];
            chooseColors[agroup] = color;
            colors.splice(num, 1)
          }

          Vue.set(a, "nameStyled", `<span style="color: ${color}">${a.name.slice(0, aIndex+1)}</span>${a.name.slice(aIndex+1)}`);
          Vue.set(b, "nameStyled", `<span style="color: ${color}">${b.name.slice(0, bIndex+1)}</span>${b.name.slice(bIndex+1)}`);
          
          return a.romanValue - b.romanValue;
        }
        return a.index - b.index;
      })
    },
    generateRandom(maxInt, stringParam) {
      let sum = 0;
      for (let i = 0; i < stringParam.length; i++){
        sum += stringParam.charCodeAt(i);
      }
      let result = sum % maxInt;
      return result;
    },
    loadEvents(resolveInitial = true) {
      this.eventLoading = true;

      axios.get(Vue.preUrl + "/searchEvents")
      .then(res => {
        this.eventList = res.data.value;
        this.eventStyleList();
        if (resolveInitial && this.eventCurrentId && this.eventList.find(x => x.date === this.eventCurrentId)) {
          this.loadEventFull(this.eventCurrentId);
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
    loadEventScreen(id) {
      this.eventSelectorDialog = false;
      let event = this.eventList.find(x => x.date === id);
      if (!event) {
        return;
      }
      if (event.hidden) {
        if (!this.user || !this.user.tier || this.user.tier > 3) {
          return;
        }
        this.$store.commit("START_LOGROCKET", {});
      }

      this.event = event;
      this.eventCurrentId = event.date;
      this.eventCurrentName = event.name;
      this.eventCurrentIsHidden = (this.eventList.find(x => x.date === event.date) || {}).hidden;
      this.eventCheckFilterCodePre = null;
      this.eventCheckFilterCode = null;
      this.eventKingTracks = [];
      this.eventFilterForKing = {};
      this.eventLoadPicks();

      this.eventBlockAddTrackset = this.event.trackset.length > 1;
      if (this.event.trackset.length === 0) {
        this.event.trackset.push([null,null,null,null,null])
      }
      if (this.event.comp.length === 0) {
        Array.from(Array(5)).map((_, i) => {
          this.event.comp.push({tyres: [], clearance: [], drives: [], meta: []})
        });
      }
      this.eventFilterToSave = null;
      this.eventFilterString = JSON.stringify(this.event.filter);
      this.eventTracksetString = JSON.stringify(this.event.trackset);
      this.eventCompString = JSON.stringify(this.event.comp);
      this.eventRqEditString = JSON.stringify(this.event.rqLimit);


      this.eventResolveTrackset();
      this.eventUpdateLocalStorage();
      this.eventResolveCompilation();
    },
    eventResolveTrackset() {
      let resolvedTrackset = JSON.parse(JSON.stringify(this.event.trackset));

      resolvedTrackset = resolvedTrackset.map(trackset => {
        return trackset.map(track => {
          if (track === null) return null;
          return [this.resolveTrack({ track }, false, false)];
        })
      })
      Vue.set(this.event, "resolvedTrackset", resolvedTrackset);
    },
    eventAddTrackset() {
      this.event.trackset.push([null,null,null,null,null])
      this.eventResolveTrackset();
    },
    eventUpdateLocalStorage() {
      window.localStorage.setItem('lastEvent', JSON.stringify({ date: this.event.date }));
    },
    eventGetLocalStorage() {
      let lastEvent = window.localStorage.getItem("lastEvent");
      if (lastEvent) {
        lastEvent = JSON.parse(lastEvent);
        this.eventCurrentId = lastEvent.date;
      }
    },
    eventStyleList() {
      this.eventList.sort((a,b) => {
        return a.name.localeCompare(b.name);
      })
      this.eventList.map(x => {
        let styl = x.name;
        Vue.set(x, "index", 0);
        if (x.name.substr(0, 13) === 'Daily Event: ') {
          Vue.set(x, "index", 2);
          styl = `<span class="Event_Daily">Daily Event: </span>${x.name.substr(13)}`
        }
        if (x.hidden) {
          Vue.set(x, "index", 1);
          styl = `<span class="Event_Hidden">${x.name} (preview)</span>`
        }
        Vue.set(x, "nameStyled", styl);
      })

      this.eventList.sort((a,b) => {
        return a.index - b.index;
      })
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

          // if (Object.keys(this.trackTimes).length === 5) {
          //   let foundAll = true;
          //   this[key].trackset[itrackset].map(x => {
          //     if (!this.trackTimes[x]) foundAll = false;
          //   })
          //   if (!foundAll) return;
          // }

          let track = this[key].trackset[itrackset][itrack];
          if (itrackset === 0) {
            compilation = this.trackTimes[track];
            compilation.map(car => {
              car.presentCount = [track];
            })
          }
          else {
            if (this.trackTimes[track]) {
              this.trackTimes[track].map(car => {
                let found = compilation.find(x => x.rid === car.rid && x.tune === car.tune);
                if (found) {
                  found.saverScore1 = Math.floor((found.saverScore1 + car.saverScore1) / 1.9)
                  found.saverScore2 = Math.floor((found.saverScore2 + car.saverScore2) / 1.9)
                  found.saverScore3 = Math.floor((found.saverScore3 + car.saverScore3) / 1.9)
                  found.presentCount.push(track);
                } else {
                  // allow score if not present on all tracks (part1)
                  car.presentCount = [track];
                  compilation.push(car);
                }
  
              })
            }
          }
        })
        compilation.sort((a,b) => {
          return b[this.eventScoreType] - a[this.eventScoreType];
        })

        let uniqueTracks = [];
        this[key].trackset.map(trackset => uniqueTracks.push(trackset[itrack]));
        uniqueTracks = [...new Set(uniqueTracks)];
        let minCount = uniqueTracks.length;

        // compilation = compilation.filter(car => car.presentCount.length >= minCount - 1 && car.rq < 80);
        compilation = compilation.filter(car => car.rq < 80);
        let firstRid = [];
        compilation = compilation.filter(car => {
          // keep just the best tune
          if (firstRid.includes(car.rid)) return false;
          firstRid.push(car.rid);
          return true;
        });
        compilation = compilation.filter((x, ix) => ix < 30);
        compilation.map(car => {
          this.frontCompleteCar(car);
          if (car.presentCount.length === 1) {
            car.track = car.presentCount[0];
          }
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
            if (this.eventKingTracks[itrack].includes("testBowl")) {
              car.timeToPrint = car.time;
            } else {
              if (car.time < bestTime) {
                car.timeToPrint = `${(car.time - bestTime).toFixed(2)}`
              } else {
                car.timeToPrint = `+${(car.time - bestTime).toFixed(2)}`
              }
            }
          }
          this.frontCompleteCar(car);
        })
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
        this.eventBlockAddTrackset = false;
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
    saveNewEvent() {
      this.eventNewLoading = true;

      axios.post(Vue.preUrl + "/newEvent", {
        name: this.eventNewName,
        hidden: this.eventNewIsHidden
      })
      .then(res => {
        setTimeout(() => {
          this.eventCloseNewEvent();
          this.loadEvents(false);
          this.eventNewLoading = false;
        }, 1000);
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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
    },
    eventSaveAll() {
      this.saveLoading = true;
      let params = { date: this.event.date };
      if (this.eventFilterString !== JSON.stringify(this.event.filter)) params.filter = this.eventFilterToSave;
      if (this.eventTracksetString !== JSON.stringify(this.event.trackset)) params.trackset = this.event.trackset;
      if (this.eventCompString !== JSON.stringify(this.event.comp)) params.comp = this.event.comp;
      if (this.eventRqEditString !== JSON.stringify(this.event.rqLimit)) params.rqLimit = this.event.rqLimit;

      axios.post(Vue.preUrl + "/updateEvent", params)
      .then(res => {
        if (this.eventFilterToSave) this.eventFilterString = JSON.stringify(this.eventFilterToSave);
        this.eventTracksetString = JSON.stringify(this.event.trackset);
        this.eventCompString = JSON.stringify(this.event.comp);
        this.eventRqEditString = JSON.stringify(this.event.rqLimit);
        this.saveLoading = false;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
    },
    eventAddCar(igroup, icar) {

    },
    eventEditComp(igroup) {
      this.eventCompIndex = igroup;
      this.eventCompDialog = true;
    },
    eventEditCompClose() {
      this.eventCompDialog = false;
    },
    eventUpdateRequirements(filter) {
      let key = this.isEvents ? 'event' : 'clubReqsGroupModel';
      this[key].filter = filter;
      this.eventRequirementsDialog = false;
      this.clubRequirementsDialog = false;
    },
    eventOpenAddYouCar() {
      this.eventAddCarDialog = true;
    },
    addCarEvent(newCar) {
      let event = this.event;
      this.eventAddCarDialog = false;

      let found = this.eventCacheCars.find(x => x.rid === newCar.rid);
      if (!found) {
        this.eventCacheCars.push({ rid: newCar.rid });
      }

      let found2 = event.cars.findIndex(x => x.rid === (event.cars[event.carIndex] || {}).rid && x.tune === undefined);
      if (found2 > -1) {
        event.carIndex = found2;
      } else {
        event.cars.push( { rid: newCar.rid } );
        event.carIndex = event.cars.length-1;
        Vue.set(event.cars[event.carIndex], "photo", this.cgResolvePhotoUrl(newCar.rid));
        Vue.set(event.cars[event.carIndex], "car", JSON.parse(JSON.stringify(newCar)));
        Vue.set(event.cars[event.carIndex], "color", Vue.resolveClass(event.cars[event.carIndex].car.rq, event.cars[event.carIndex].car.class, "color"));
      }

      this.downloadCar(newCar.rid);
      this.eventSaveRoundHand();
    },
    eventSaveRoundHand() {
      let saveName = `hand_${this.event.date}`
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
      let saveName = `hand_${this.event.date}`
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
      if (this.isEvents) trackset = this.event.trackset[obj.itrackset];
      else trackset = this.clubTracksGroupModel.trackset[obj.itrackset];

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

      if (this.isEvents) this.eventResolveTrackset();
      else this.clubsResolveTrackGroup();
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

      if (this.isEvents) this.eventResolveTrackset();
      else this.clubsResolveTrackGroup();
    },
    eventDeleteTrackset(itrackset) {
      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';
      this[key].trackset = this[key].trackset.filter((x, ix) => ix !== itrackset);

      if (this.isEvents) this.eventResolveTrackset();
      else this.clubsResolveTrackGroup();
    },
    eventOpenKingFilter(itrackset, itrackMonoArray, e) {
      let key = this.isEvents ? 'event' : 'clubReqsGroupModel';

      if (this.eventAnalyseLoading) return true;
      if (!Object.keys(this.eventFilterForKing).length) {
        this.eventFilterForKing = JSON.parse(JSON.stringify(this[key].filter));
      }
      this.eventCheckFilterCodePre = `${itrackset}_${itrackMonoArray}`;
      this.eventCheckFilterCode = null;
      if (this.user && this.user.tier <= 3 && (!e || !e.ctrlKey)) {
        this.eventKingDialog = true;
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
      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';

      this.eventCheckFilterCode = this.eventCheckFilterCodePre;
      this.eventKingTracks = this[key].trackset[this.eventCheckFilterCode[0]];
      this.eventKingDialog = false;
      this.eventAnalyseLoading = true;

      let params = {
        filter: this.eventFilterForKing,
        tracks: this.eventKingTracks,
        includeDownvotes: this.kingShowDownvoted,
        forceFree,
        onlyPicks: this.eventShowOnlyPicks,
        forcePicks: this.eventForcePicks,
        picks: []
      }

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
        params.picks = list;
      }
      if (params.picks.length === 0) {
        params.forcePicks = false;
        params.onlyPicks = false;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
      .then(() => {
        this.eventAnalyseLoading = false;
      });
    },
    eventAnalyse(disableAfter = true) {
      // RQ savers, unreleased
      this.eventAnalyseLoading = true;

      axios.post(Vue.preUrl + "/analyseEvent", {
        date: this.event.date,
        rqLimit: this.event.rqLimit,
        trackset: this.event.trackset,
        filter: this.event.filter
      })
      .then(res => {
        Vue.set(this, 'trackTimes', res.data)
        // if (disableAfter) this.eventForceAnalyze = false;
        this.eventResolveCompilation();
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
      .then(() => {
        this.eventAnalyseLoading = false;
      });

    },
    eventFindRqSavers() {
      this.eventCheckFilterCode = this.eventCheckFilterCodePre;

      let trackset;
      let filter;
      if (this.isEvents) {
        trackset = [this.event.trackset[this.eventCheckFilterCode[0]]];
        filter = this.event.filter;
      } else {
        trackset = [this.clubTracksGroupModel.trackset[this.eventCheckFilterCode[0]]];
        filter = this.clubReqsGroupModel.filter;
      }

      
      this.eventKingDialog = false;
      this.eventAnalyseLoading = true;

      axios.post(Vue.preUrl + "/analyseEvent", {
        trackset: trackset,
        filter: filter
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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
      .then(() => {
        this.eventAnalyseLoading = false;
      });

    },
    eventExportTracksToWorkspace() {
      let result = "";
      let tracks = [];
      this.event.trackset.map(trackset => {
        trackset.map(track => {
          tracks.push(track);
        })
      })
      tracks = [...new Set(tracks)];
      tracks = this.orderTracksIds(tracks);
      tracks.map(track => {
        result += `~K${track}`
      })

      this.$store.commit("CLASSIC_FILTER_IMPORT", { filter: this.event.filter });

      this.changeMode('classic');
      setTimeout(() => {
        this.searchFilterDialog = true;
      }, 100);
      this.decodeTemplateString(result, true);
    },
    eventSetVisible() {
      this.eventAnalyseLoading = true;

      axios.post(Vue.preUrl + "/setEventVisible", {
        date: this.event.date,
        name: this.event.name
      })
      .then(res => {
        // nada
        this.loadEvents(true);
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
      .then(() => {
        this.eventAnalyseLoading = false;
      });
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
      if (this.showPoints) return;
      if (e.altKey) {
        
        e.preventDefault();
        // console.log("on");
        this.pointsInit(e);

        // this.showCarsFix = false;
        // this.$nextTick().then(() => {
        //   this.showCarsFix = true;
        // });
      }
    },
    handleKeyUp(e) {
      if (!e.altKey) {
        if (this.showPoints) {
          
          console.log("off");
          this.pointsEnd();

          // this.showCarsFix = false;
          // this.$nextTick().then(() => {
          //   this.showCarsFix = true;
          // })
        }
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
      if (this.mode === "classic") {
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
        if (this.isMobile || this.homePointsToggle) {
          this.carHoverIndex = 0;
        } else {
          return;
        }
      };
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
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times
          ) {
            tempValue = vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId];
            if (vm.carHoverIndex > -1 && vm.carHoverIndex !== ix) {
              let referenceTime = vm.carDetailsList[vm.carHoverIndex].data[vm.carDetailsList[vm.carHoverIndex].selectedTune].times[trackId];
              x[trackId] = Vue.options.filters.userPoints(referenceTime, tempValue, trackId);
            }
          }
        });
      })

      this.pointsResolved = result;
    },
    checkAnnouncement() {
      // if (window.localStorage.getItem("contest2")) return;
      // let dt = window.localStorage.getItem("_dt");
      // if (dt) {
      //   dt = Number(dt) + (60*60*1000) > new Date().getTime()
      // }
      // if (dt) return;

      // window.localStorage.setItem('contest2', "t");
      // setTimeout(() => {
      //   this.announcementDialog = true;
      // }, 100);
    },
    openAbout() {
      this.aboutDialog = true;
      this.optionsDialogActive = false;
    },
    closeAbout() {
      this.aboutDialog = false;
      this.optionsDialogActive = true;
    },
    openAdvancedOptions() {
      this.optionsAdvancedDialog = true;
      this.optionsDialogActive = false;
    },
    closeAdvancedOptions() {
      this.optionsAdvancedDialog = false;
      this.optionsDialogActive = true;
    },
    lookForChangedCars(data) {
      let changed20 = [
        "Porsche_919_Hybrid_Evo_2018",
        "Rimac_Nevera_2021",
        "Audi_R18_2016",
        "Peugeot_208_T16_Pikes_Peak_2013",
        "Volkswagen_I.D._R_Pikes_Peak_2018",
        "Audi_R18_TDI_Ultra_2011",
        "Peugeot_908_HDi_FAP_2007",
        "Audi_R10_TDI_2006",
        "Arash_AF10_Hybrid_2016",
        "Porsche_911_RSR-19_(991.2)_2019",
        "Porsche_911_GT3_RSR_997_2007",
        "Lotus_Emira_GT4_2021",
        "Mitsubishi_Lancer_Evo_VIII_FQ-400_2004",
        "Lamborghini_Gallardo_LP560-4_Spyder_(2nd_gen)_2009",
        "Porsche_911_GT1_Strassenversion_993_1996",
        "Lancia_Delta_HF_Integrale_16v_1990",
        "Subaru_Impreza_Group_A_1995",
        "Mitsubishi_Lancer_Evo_VIII_MR_FQ-340_2005",
        "Mitsubishi_Lancer_Evo_IV_1996",
        "Lotus_Evora_GT430_2018",
        "Volvo_V60_Polestar_2015",
        "Audi_S5_Sportback_(B8)_2013",
        "Mitsubishi_Lancer_Evo_VIII_260_2004",
        "Ford_Bronco_Raptor_2022",
        "Ford_Mustang_MachE_GT_2021",
        "Dodge_Powerbox_2001",
        "Mazda_Cosmo_1990",
        "BMW_530e_Saloon_2020",
        "Lancia_Delta_Integrale_16v_1989",
        "Ford_Ranger_Rally_Raid_2014",
        "Holden_Monaro_CV8R_VZ_2004",
        "Peugeot_Rally_504_1971",
        "Jaguar_XJ-S_Trans-Am_1978",
        "Suzuki_XL-7_1998",
        "Lancia_Thema_Turbo_16v_1989",
        "Lincoln_Navigator_2007",
        "Mazda_RX-7_Turbo_1985",
        "Ford_Taurus_SHO_1993",
        "Mazda_MX-5_BBR_Turbo_1990",
        "Mazda_MX-5_1989",
        "Ford_Capri_Perana_1971",
        "Lincoln_Mark_VIII_1997",
        "Ford_Taurus_SHO_1989",
        "Mazda_MX-5_1998",
        "Chrysler_LeBaron_GTS_Turbo_1985",
        "Mazda_Eunos_Roadster_RS-Limited_1994",
        "Dodge_Challenger_TA_1970",
        "Ford_Mustang_Boss_302_1970",
        "Mazda_RX-7_1978",
        "Mazda_RX-7_1985",
        "Ford_Thunderbird_Turbo_Coupe_1987",
        "Lincoln_Town_Car_Cartier_L_2002",
        "Ford_Mustang_289_1966",
        "Mercury_Milan_2010",
        "Buick_Century_Special_Coupe_1973",
        "Chrysler_Turbine_Car_1963"
      ];

      data.rounds.map((round, iround) => {
        round.races.map((race, irace) => {
          if (changed20.includes(race.rid)) {
            console.log(`${data.name}, Round ${iround+1}, Race ${irace+1}, ${race.rid}`)
          }
        })
      })
    },
    openKingOfDialog() {
      let vm = this;
      this.kingDialog = true;
      this.optionsDialogActive = false;
    },
    closeKingOfDialog(backToOptions = true) {
      this.kingDialog = false;
      this.kingFixed = false;
      if (backToOptions) this.optionsDialogActive = true;
    },
    updateKingFilter(filter) {
      this.kingFilter = filter;
      this.kingFilterDialog = false;
      if (this.kingFixed) this.kingAnalyse();
    },
    kingAnalyse() {
      if (!this.kingTrack.code) return;
      // this.$store.commit("KING_EMIT_RIDS", {});
      this.kingAnalyseFinish();
    },
    kingAnalyseFinish() {
      this.kingLoading = true;
      if (this.kingFixed) this.downloadLoading = true;

      axios.post(Vue.preUrl + "/king", {
        track: this.kingTrack.code,
        includeDownvotes: this.kingShowDownvoted,
        filter: this.kingClearFilter
      })
      .then(res => {
        this.clearAllTracks();
        this.clearAllCars();
        this.pushTrackSet([this.kingTrack.code]);

        let result = [];
        res.data.map(car => {
          this.all_cars.find(x => {
            if (x.rid === car.rid) {
              result.push(JSON.parse(JSON.stringify(x)));
              result[result.length-1].selectedTune = car.tune;
              result[result.length-1].softId = this.nextId;
              this.nextId++;
              return true;
            }
          })
        })
        Vue.set(this, "carDetailsList", result);
        this.applyNewData(res.data, this.mode === 'cg');
        this.updateOptions();
        this.updateCarLocalStorage();
        if (!this.kingFixed) this.kingDialog = false;
        if (this.kingForceVerticalView) {
          this.display("vertical");
          this.colorsChange("full");
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
    tierOf(username) {

    },
    isChamp(str) {
      return str.startsWith("SN") || str.startsWith("YB");
    },
    frontCompleteCar(car) {
      Vue.set(car, "photo", this.cgResolvePhotoUrl(car.rid));
      Vue.set(car, "car", JSON.parse(JSON.stringify(this.all_cars.find(x => x.rid === car.rid))));
      Vue.set(car, "color", Vue.resolveClass(car.car.rq, car.car.class, "color"));
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

        this.all_cars.find(x => {
          if (x.rid === rid) {
            Vue.set(x, "mra", newMRA);
            return true
          }
        })
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
    changeZoom(level = "100%") {
      let string;
      if (level === "60%") {
        string = "width=device-width,height=device-height, initial-scale=0.45, maximum-scale=0.45, minimum-scale=0.45"
      }
      if (level === "80%") {
        string = "width=device-width,height=device-height, initial-scale=0.55, maximum-scale=0.55, minimum-scale=0.55"
      }
      if (level === "100%") {
        string = "width=device-width,height=device-height, initial-scale=0.65, maximum-scale=0.65, minimum-scale=0.65"
      }
      if (level === "120%") {
        string = "width=device-width,height=device-height, initial-scale=0.75, maximum-scale=0.75, minimum-scale=0.75"
      }
      if (level === "140%") {
        string = "width=device-width,height=device-height, initial-scale=0.85, maximum-scale=0.85, minimum-scale=0.85"
      }

      const viewport = document.querySelector('meta[name="viewport"]');
      if ( viewport ) {
        viewport.content = string;
      }
      window.localStorage.setItem('zoomLevel', level);
      
    },
    gestureResolve(e) {
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
        let currentIndex = this.zoomLevels.indexOf(this.zoomLevel);
        let indexDest = 0;
        let maxIndex = this.zoomLevels.length - 1;
        if (zoomDirection < 0) {
          // "100% > 80%" decrease index
          indexDest = Math.max(0, currentIndex - 1)
        } else {
          // "100% > 120%" increase index
          indexDest = Math.min(maxIndex, currentIndex + 1)
        }
        this.zoomLevel = this.zoomLevels[indexDest];
        this.changeZoom(this.zoomLevels[indexDest]);
      }
      e.preventDefault();
    },
    loadClubs(resolveInitial = true) {
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
      this.clubDaySelected = date;
      if (this.clubDays[date]) {
        this.clubDaySelectedObj = this.clubDays[date];
        this.clubDaySelected = date;
      } else {
        let lastKey = Object.keys(this.clubDays);
        lastKey.sort((a,b) => {
          return a.localeCompare(b);
        })
        lastKey = lastKey[lastKey.length - 1];
        this.clubDaySelectedObj = this.clubDays[lastKey];
        this.clubDaySelected = lastKey;
      }

      // sort
      this.clubDaySelectedObj.tracksetGroups.sort((a, b) => {
        return a.localeCompare(b);
      })
      this.clubDaySelectedObj.criterias.sort((a, b) => {
        return a.localeCompare(b);
      })

      this.clubFillTrackGroupsActive();
      this.clubsDayResetStringsToSave();

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
      this.clubCurrentTrackGroupuuid = JSON.stringify(this.clubTracksGroupModel.trackGroupuuid);
      this.clubCurrentTracksetuuids = JSON.stringify(this.clubTracksGroupModel.tracksetuuids);
      this.clubCurrentName = JSON.stringify(this.clubTracksGroupModel.name);
    },
    clubsReqResetStringsToSave(isAfterSave = false) {
      if (isAfterSave) {
        this.clubCurrentFilterString = JSON.stringify(this.clubCurrentFilterToSave);
        this.clubReqsGroupModel.filter = JSON.parse(this.clubCurrentFilterString);
        this.clubCurrentFilterToSave = null;
      } else {
        this.clubCurrentFilterString = JSON.stringify(this.clubReqsGroupModel.filter);
      }
      this.clubCurrentCriteriaUuidString = JSON.stringify(this.clubReqsGroupModel.criteriauuid);
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
      if (this.clubTracksGroupModel.comp.length === 0) {
        Array.from(Array(5)).map((_, i) => {
          this.clubTracksGroupModel.comp.push({tyres: [], clearance: [], drives: [], meta: []})
        });
      }
      this.clubsResolveTrackGroup();
      this.clubsTrackResetStringsToSave();
      this.clubLoadPicks();
    },
    clubsResolveTrackGroup() {
      let resolvedTrackset = JSON.parse(JSON.stringify(this.clubTracksGroupModel.trackset));

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
    },
    clubsChangeReqsGroup(index) {
      if (index === null) {
        this.clubReqsGroupModel = {};
        this.clubsReqResetStringsToSave();
        return;
      }
      this.clubReqsGroupModel = this.clubReqGroupsActive[index];

      this.clubsResolveReqGroup();
      this.clubsReqResetStringsToSave();
      this.clubLoadPicks();
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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
    },
    clubTracksetSelectorClick(date, e) {
      console.log("clubTracksetSelectorClick");
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
          vm.clubLoading = false;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
          vm.clubLoading = false;
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

    clubSaveTrackset() {
      this.clubLoading = true;
      
      let params = { date: this.clubTracksGroupModel.date };
      // if (this.clubCurrentTracksetString !== JSON.stringify(this.clubTracksGroupModel.filter)) params.filter = this.eventFilterToSave;
      if (this.clubCurrentTracksetString !== JSON.stringify(this.clubTracksGroupModel.trackset)) params.trackset = this.clubTracksGroupModel.trackset;
      if (this.clubCurrentCompString !== JSON.stringify(this.clubTracksGroupModel.comp)) params.comp = this.clubTracksGroupModel.comp;
      if (this.clubCurrentTrackGroupuuid !== JSON.stringify(this.clubTracksGroupModel.trackGroupuuid)) params.trackGroupuuid = this.clubTracksGroupModel.trackGroupuuid;
      if (this.clubCurrentTracksetuuids !== JSON.stringify(this.clubTracksGroupModel.tracksetuuids)) params.tracksetuuids = this.clubTracksGroupModel.tracksetuuids;
      if (this.clubCurrentName !== JSON.stringify(this.clubTracksGroupModel.name)) params.name = this.clubTracksGroupModel.name;

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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
    },
    clubSaveReq() {
      this.clubLoading = true;
      
      let params = { date: this.clubReqsGroupModel.date };

      if (this.clubCurrentFilterString !== JSON.stringify(this.clubReqsGroupModel.filter)) params.filter = this.clubCurrentFilterToSave;
      if (this.clubCurrentCriteriaUuidString !== JSON.stringify(this.clubReqsGroupModel.filter)) params.criteriauuid = this.clubReqsGroupModel.criteriauuid;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
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
        if (error.response.status === 401) {
          this.loginDialog = true;
        }
      })
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
      
      this.$store.commit("CLASSIC_FILTER_IMPORT", { filter: this.clubReqsGroupModel.filter });

      this.changeMode('classic');
      setTimeout(() => {
        this.searchFilterDialog = true;
      }, 100);
      this.decodeTemplateString(result, true);
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
      this.clubRequirementsDialog = true;
    }
  }
}
</script>

<style>

.Main_Layout {
  min-height: 100%;
  max-width: 100%;
  display: flex;
  -webkit-user-select: none;
}
.Main_Body {
  position: relative;
  min-height: 100%;
  display: flex;
}
.Main_BodyEmpty {
  min-width: 100%;
}
.Main_Left {
  width: var(--left-width);
  position: sticky;
  left: 0;
  margin-top: var(--top-height);
  overflow: hidden;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  z-index: 10;
  min-height: calc(100% - var(--top-height));

  /* pra preencher mobile */
  box-shadow: 0px 50vh 0px 0px hsl(var(--back-h), var(--back-s), var(--back-l)), 0px 110vh 0px 0px hsl(var(--back-h), var(--back-s), var(--back-l));
  user-select: text;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.Main_Corner {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  height: var(--top-height);
  width: var(--left-width);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
}
.Main_CornerMid {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin: 0px 5px 5px 5px;
  align-items: center;
  gap: 5px;
}
.Main_Logo {
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
}
.Main_LogoPre {
  white-space: nowrap;
}
.Main_2 .Main_Corner {
  display: grid;
  grid-template-columns: 1fr max-content;
  /* grid-template-columns: 65px 1fr; */
}
.Main_2 .Main_CornerMid {
  flex-grow: unset;
  margin: 5px 5px 5px 0;
}
.Main_2 .Main_LogoPre {
  /* display: none; */
}
.Main_2 .Main_Logo {
  justify-content: center;
  /* height: calc(var(--top-height) - 20px); */
}
.Main_Backtop {
  position: fixed;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  height: var(--top-height);
  width: 100%;
  z-index: 0;
  top: 0;
  left: 0;
}
.Main_Mid {
  /* position: absolute; */
  top: 0;
  /* margin-left: var(--left-width); */
  height: 100%;
}
.Main_MidEmpty {
  padding-top: var(--top-height);
  flex-grow: 1;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
  gap: 20px;
  margin-bottom: 80px;
  margin-top: 80px;
}
.Main_MidEmptyInner {
  display: flex;
  align-items: stretch;
  --gap: 20px;
  gap: var(--gap);
}
.Main_MidEmptyItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap);
}
.D_Button.Main_MidEmptyButton {
  font-size: 18px;
  padding: 12px 15px;
}
.D_Button.Main_MidEmptyButtonSearch {
  flex-direction: column;
  height: 100%;
  max-height: unset;
  padding: 14px 15px;
  gap: 10px;
}
.Main_CarList {
  display: flex;
  user-select: text;
  pointer-events: none;
}
.Main_SearchHeader {
  width: 100%;
  display: flex;
  align-items: stretch;
}
.Main_SearchFieldBox {
  position: relative;
  flex-grow: 10;
}
.Main_FiltersButton {
  border-radius: 0;
  padding: 0 12px;
  font-size: 1em;
  color: var(--d-text-b);
  --back-opac: 1;
  --back-h: 203;
  --back-s: 60%;
  --back-l: 55%;
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) - 10%));
  border-top-right-radius: 10px;
  flex-grow: 1;
  min-height: 74px;
  position: relative;
  flex-direction: column;
}
.Main_FiltersButton:first-child {
  border-top-left-radius: 10px;
  font-size: 1.4em;
}
button.Main_FiltersButton:hover:not(.D_ButtonActive):not([disabled]) {
  color: #fff;
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) + 3%)) !important;
}
.Main_FiltersButton.D_ButtonNoActive.focus-visible {
  color: #fff;
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) + 7%));
}
.Main_FiltersButton:active {
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) - 20%)) !important;
}
.Main_FiltersButtonCount {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  background-color: #bd0000;
  color: white;
  border-radius: 23px;
  padding: 4px 6px;
}
.Main_SearchBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Main_SearchMid {
  height: 60vh;
  background-color: var(--d-back);
  width: 100%;
  padding: 25px 0;
  box-sizing: border-box;
  overflow-y: scroll;
  /* overflow-x: hidden; */
  overscroll-behavior-block: contain;
  overscroll-behavior-x: contain;
  position: relative;
}
.Main_SearchMidT {
  /* padding: 25px; */
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}
.Main_SearchEmpty {
  height: 60vh;
  background-color: var(--d-back);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
}
.Main_SearchEmptyAddIcon {
  font-size: 70px;
  opacity: 0.1;
}
.Main_SearchItem {
  padding: 7px 25px 7px 0px;
  display: flex;
  width: 100%;
  min-width: fit-content;
  background: transparent;
  outline: 0;
  border: none;
  text-decoration: none;
  user-select: none;
  transition-duration: 0.1s;
  cursor: pointer;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  color: var(--d-text);
  align-items: center;
}
.Main_SearchItem:hover,
.Main_SearchItem.focus-visible {
  color: #fff6;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.Main_SearchItemAdded {
  opacity: 0.5;
}
.Main_SearchLoading {
  position: fixed;
  width: 100%;
  height: 5px;
  top: 0;
  left: 0;
}
.Main_SearchItemImg {
  display: flex;
  height: 38px;
  margin: -7px 0;
  width: 53px;
  min-width: 53px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 10px;
  background-color: #00000038;
}
.MainGallery_Img {
  transform: scale(1.3);
  height: 100%;
}
.Main_SearchItemLeft {
  color: var(--color);
  margin-right: 10px;
  width: 2em;
  min-width: 2em;
}
.Main_SearchItemValue {
  background-color: rgba(255,255,255,0.05);
  box-shadow: 0px 7px 0px 0px rgba(255,255,255,0.05), 0px -7px 0px 0px rgba(255,255,255,0.05);
  margin-right: 10px;
  padding: 0 2px 0 3px;
  --w: 2em;
  width: var(--w);
  min-width: var(--w);
  text-align: center;
}
.Main_SearchItemColumn {
  margin-right: 10px;
  padding: 0 2px 0 3px;
  --w: 2em;
  width: var(--w);
  min-width: var(--w);
  text-align: center;
}
.Main_SearchItemColumn:last-child {
  margin-right: 0px;
}
.Main_SearchItemColumnActive {
  background-color: rgba(255,255,255,0.05);
  box-shadow: 0px 7px 0px 0px rgba(255,255,255,0.05), 0px -7px 0px 0px rgba(255,255,255,0.05);
}
.BaseFilterDialog_ColumnHeader.Main_SearchItemColumnActive {
  box-shadow: 0px 2px 0px 0px rgba(255,255,255,0.05);
}
.Main_SearchItemValue_topSpeed {
  --w: 2em;
}
.Main_SearchItemValue_acel {
  --w: 2em;
}
.Main_SearchItemValue_hand {
  --w: 2em;
}
.Main_SearchItemValue_mra {
  --w: 3.2em;
}
.Main_SearchItemValue_weight {
  --w: 3em;
}
.Main_SearchItemValue_year {
  --w: 3em;
}
.Main_SearchItemValue_Special {
  --w: 3em;
}
.Main_SearchItemMedal_0 {
  color: var(--w1);
}
.Main_SearchItemMedal_1 {
  color: var(--w2);
}
.Main_SearchItemMedal_2 {
  color: var(--w3);
}
.Main_SearchItemValue_Special .BaseFilterDialog_ColumnHeaderTxt {
  color: rgb(var(--d-text-yellow));
  opacity: 0.8;
}
.Main_SearchItemValue_Special.BaseFilterDialog_ColumnHeader {
  background-color: rgba(255,255,255,0.05);
  box-shadow: 0px 2px 0px 0px rgba(255,255,255,0.05);
}

.Main_SearchItemRight {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
}
.Main_SearchTrophy {
  font-size: 14px;
  margin-left: 2px;
}
.Main_SearchItemYear {
  font-size: 0.6em;
  box-shadow: 0px 0px 0px 2px #0003;
  background-color: #0003;
  padding: 1px 3px;
  margin-left: 0.2em;
  margin-right: 2px;
}
.Main_SearchItemRight b {
  color: #fffd;
  font-weight: normal;
  background-color: #fff1;
  box-shadow: 0px 0px 0px 1px #fff1;
}
.Main_SearchResultUser {
  font-size: 0.8em;
  margin-right: 2px;
  color: var(--t0);
}
.Main_SearchResultUserBy {
  font-size: 0.8em;
  margin-left: 0.1em;
  color: var(--t0);
  opacity: 0.5;
}
body .Main_UserTmod {
  color: var(--tmod);
}
body .Main_UserT1 {
  color: var(--t1);
}
body .Main_UserT2 {
  color: var(--t2);
}
body .Main_UserT3 {
  color: var(--t3);
}
body .Main_UserT4 {
  color: var(--t4);
}
body .Main_UserT5 {
  color: var(--t5);
}
body .Main_UserTw1 {
  color: var(--w1);
}
body .Main_UserTw2 {
  color: var(--w2);
}
body .Main_UserTw3 {
  color: var(--w3);
}
body .Main_UserTw1:before {
  content: "🥇";
}
body .Main_UserTw2:before {
  content: "🥈";
}
body .Main_UserTw3:before {
  content: "🥉";
}
body .Main_UserTw1:before,
body .Main_UserTw2:before,
body .Main_UserTw3:before {
  margin: 0 -2px;
  line-height: 0.6;
}
.Main_SearchLastestTitle {
  font-size: 1.7em;
  opacity: 0.3;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
  white-space: nowrap;
}
.Main_SearchMore {
  font-size: 18px;
  margin-top: 11px;
  margin-left: 62px;
  padding: 12px 15px;
}
.Main_FilterMaxReached {
  margin-top: 11px;
  margin-left: 62px;
  padding: 12px 0px;
  color: rgb(var(--d-text-yellow));
}
.Main_ImgPlaceholder {
  width: 52px;
  height: 36px;
  background-color: #222222;
  margin-right: 10px;
  margin-top: -6px;
  margin-bottom: -6px;
}
.Space_Bottom { 
  margin-bottom: 10px;
}
.Space_Top { 
  margin-top: 10px;
}
.Space_Both { 
  margin-bottom: 10px;
  margin-top: 10px;
}
.Space_BottomPlus { 
  margin-bottom: 20px;
}
.Space_TopPlus { 
  margin-top: 20px;
}
.Space_BothPlus { 
  margin-bottom: 20px;
  margin-top: 20px;
}
.Main_OptionsDialog {
  font-size: 18px;
}
.Main_OptionsButton {
  font-size: 16px;
  padding: 10px;
  background-color: rgba(var(--back-color), 0.04);
  box-sizing: border-box;
}
.Main_OptionsButton > i {
  font-size: 28px;
}
.Main_OptionsButtonClear {
  --back-color: 255, 0, 0;
  color: rgb(217 115 115);
  --back-opac: 0.5;
  background-color: rgba(var(--back-color), 0.1);
  --height: 16px;
  padding: 5px 7px;
  font-size: 1em;
  margin: -5px 0;
  margin-left: 5px;
}
.Main_OptionsButtons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.Main_OptionsTrackset {
  display: flex;
  flex-direction: column;
  margin: 10px -20px 0px -20px;
}
.Main_OptionsTracksetMore {
  align-self: center;
  margin-top: 10px;
  min-width: 150px;
}
.Main_OptionsLabel {
  opacity: 0.8;
  font-size: 14px;
}
.Main_OptionsItem + .Main_OptionsItem {
  margin-top: 20px;
}
.Main_OptionsUserBox {
  margin-top: 20px;
}
.Main_OptionsLogout {
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 10px;
}

.Main_UserLogout {
  margin-bottom: -2px;
  align-self: flex-start;
  padding: 2px;
  font-size: 14px;
}
.Main_MenuIcon {
  font-size: 22px;
}
.Main_SideBox {
  position: absolute;
  right: 0;
  bottom: 0;
}
.Main_Credits {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  padding: 3px;
}
.Main_PrintBy {
  display: none;
  text-align: center;
}
.Main_PrintByLabel {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  margin-bottom: 3px;
}
.Main_PrintByUser {
  color: var(--t0);
  max-width: var(--left-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 7px;
  box-sizing: border-box;
}
.Main_BodyPrint .Main_Corner .Main_PrintBy {
  display: flex;
  justify-content: center;
  align-items: center;
}
.Main_Normal .Main_BodyPrint .Main_Corner .Main_PrintBy {
  display: flex;
  flex-direction: column;
}
.Main_Corner .Main_PrintByLabel {
  margin-bottom: 0px;
}
.Main_GamePrintInfo {
  display: none;
}
.Main_PrintCreditsBottom {
  display: none;
  padding: 10px;
  box-sizing: border-box;
}
.Main_Corner .Main_PrintByUser {
  max-width: 20ch;
}
.Main_UserBottom {
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 6px;
}
.Main_UserBottom .Main_UserBlock {
  max-width: calc(100% - 35px);
}
.Main_UserName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}
.Main_UserCard {
  display: flex;
  align-items: center;
  gap: 8px;
}
.Main_UserBlock {
  display: flex;
  flex-direction: column;
}

.Main_UserNameLabel {
  
}
.Main_UserMod {
  font-size: 0.6em;
  background-color: black;
  margin-left: 5px;
  padding: 2px 4px;
  border-radius: 4px;
}
.D_Button.D_ButtonMenu {
  padding: 11px 11px;
}
.Main_SaveAllBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Main_DialogTitle {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
}
.Main_DialogTitle:not(:first-child) {
  margin-top: 25px;
}
.Main_ShareDownloadBox {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.Main_ShareLinkBox {
  display: flex;
  gap: 15px;
  align-items: center;
}
.Main_ShareLinkInput {
  background-color: rgba(0,0,0,0.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: none;
  margin-top: 2px;
  flex-grow: 1;
}
.Main_ShareLinkInputCorrect {

}
.Main_FilterSlider {
}
.Main_FilterItems {
  color: var(--d-text-b);
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 0 20px;
}
.Main_FilterSliderLabel {
  text-align: center;
  margin-top: 6px;
}
.Main_FilterDual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.Main_FilterThree {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 15px;
}
.Main_FilterChips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  gap: 15px;
}
.Main_FilterChips2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 61px));
  gap: 15px;
  justify-content: center;
}
.Main_FilterChipsFlex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
}
.Main_FilterChipsLabel {
  position: absolute;
  top: -16px;
  font-size: 12px;
  opacity: 0.5;
}
.Main_FilterClassChips {
  max-width: 430px;
  width: 100%;
  align-self: center;
}
.Main_FilterChipsInside {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.Main_ClassChip {
  font-size: 1.2em;
  transform: skewY(9deg);
  font-weight: bold;
  box-shadow: 0px 4px 0px -0.1px var(--classC);
}
.BaseChip.Main_ClassChip:hover,
.BaseChip.Main_ClassChip.focus-visible {
  box-shadow: 0px 0px 0px 4px var(--classC);
}
.Main_ClassChipActive {
  background-color: var(--classC);
  color: black;
}
.Main_SectionSelectorLayout {
  margin-bottom: 25px;
}
.Main_SectionSelectorBox {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.D_Button.D_ButtonChangeMode {
  padding: 14px 15px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.07);
  min-width: 120px;
}
.D_Button.D_ButtonChangeModeDisabled {
  opacity: 1;
  box-shadow: inset 0px -33px 15px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
  border-radius: 0;
}
.Main_OptionsCredits {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.Main_OptionsFooterButtons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.Main_FavLogo {
  width: 18px;
  margin: -5px 0px -5px 6px;
}
.Main_DiscordLogo {
  width: 25px;
  margin: -5px 6px -5px 0px;
}
.Main_Disclaimer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.D_Center {
  display: flex;
  justify-content: center;
}
.D_TextCenter {
  text-align: center;
}
.Main_AboutFlag {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 50px;
  height: 50px;
  overflow: hidden;
}
.Main_AboutFlagBox {
  background-color: rgb(20, 158, 62);
  display: flex;
  width: 100px;
  justify-content: center;
  transform: rotate(45deg);
  margin-top: 5px;
  margin-left: -15px;
}
.Main_AboutFlagBox svg {
  width: 30px;
}
.Main_CustomTrackItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 20px;
  transition: all 0.1s, box-shadow 0.1s;
}
.Main_CustomTrackItem:hover {
  box-shadow: inset 0px 90px 0px 0px rgba(255,255,255,0.03);
}
.Main_CustomTrackFalse,
.Main_CustomTrackCorrect {
  font-size: 35px;
}
.Main_CustomTrackCorrect {
  display: none;
  margin: -10px;
  color: rgb(var(--d-text-green));
}
.Main_CustomTrackActive .Main_CustomTrackCorrect {
  display: block;
}
.Main_CustomTrackCond {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
}
.Main_AllTracksBox {
  margin: 0 -20px;
}
.Main_OptionsSaveData {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}
.MainClearLabelBox {
  display: flex;
}
.Main_ClearButtonsBox {
  display: inline-flex;
  justify-content: space-between;
  flex-grow: 1;
}
.Main_CustomTrackRight {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.Main_CustomTrackName {
  padding-right: 5px;
  display: flex;
  align-items: center;
}
.Main_CustomTrackItem .Type_00 {
  --type-back-opac: 0.07;
  background-color: rgba(255,255,255, var(--type-back-opac));
}
.Type_01,
.Type_c1,
.Type_01 ~ .BaseCompItem_Drives {
  color: rgb(var(--color-wet));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-wet), var(--type-back-opac));
}
.Type_10,
.Type_11,
.Type_40,
.Type_41,
.Type_10 ~ .BaseCompItem_Drives {
  color: rgb(var(--color-dirt));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-dirt), var(--type-back-opac));
}
.Type_20,
.Type_b0 {
  color: rgb(var(--color-gravel));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-gravel), var(--type-back-opac));
}
.Type_30,
.Type_g0 {
  color: rgb(var(--color-ice));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-ice), var(--type-back-opac));
}
.Type_50,
.Type_e0,
.Type_c0 {
  color: rgb(var(--color-sand));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-sand), var(--type-back-opac));
}
.Type_60,
.Type_d0,
.Type_h0,
.Type_h1 {
  color: rgb(var(--color-snow));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-snow), var(--type-back-opac));
}
.Type_70,
.Type_f0,
.Type_71 {
  color: rgb(var(--color-grass));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-grass), var(--type-back-opac));
}
.Main_RowCornerBox {
  position: absolute;
  /* position: fixed; */
  top: var(--top-height);
  background-color: #2e2e2e;
  z-index: 1;
  width: var(--left-width);

  white-space: nowrap;
  box-sizing: border-box;
  border-top-width: 0;
  border-left-width: 0;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  transition-property: set;
  box-shadow: inset 0px -2px 0px 0px #ffffff07, inset -2px 0px 0px 0px #ffffff07;
  border-bottom-color: #5a5a5a;

  justify-content: center;
  height: calc(var(--cell-height) * 1.3);

  border-right-width: 0;
}
.Main_2 .Main_RowCornerBox {
  top: 0;
  left: var(--left-width);
  width: calc(var(--cell-width) * 1);
  height: var(--top-height);
}
.Main_2 .Main_BodyPrint .Main_RowCornerBox {
  display: none;
}
.Main_FilterClearTop {
  display: flex;
  justify-content: flex-end;
  margin-top: -15px;
  margin-bottom: -15px;
}
.Main_OptionsDual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}
.Main_OptionsDual > .Main_OptionsItem {
  margin-top: 0px;
}
.Main_cIconBox {
  position: relative;
  width: 28px;
  height: 28px;
}
.Main_cBall {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
.Main_cBall:nth-child(1) {
  background-color: #ffc300ad;
  left: 50%;
  top: 1px;
  transform: translateX(-50%);
}
.Main_cBall:nth-child(2) {
  background-color: #dbf5fb87;
  left: 0;
  bottom: 1px;
}
.Main_cBall:nth-child(3) {
  background-color: #a55412b3;
  right: 0;
  bottom: 1px;
}
.Main_cIconGradient {
  background: rgb(54,171,0);
  background: linear-gradient(90deg, rgba(54,171,0,1) 0%, rgba(54,171,0,1) 19%, rgba(64,132,0,1) 20%, rgba(64,132,0,1) 39%, rgba(74,94,0,1) 40%, rgba(74,94,0,1) 59%, rgba(83,58,0,1) 60%, rgba(83,58,0,1) 79%, rgba(91,29,0,1) 80%, rgba(91,29,0,1) 100%);
  border-radius: 34px;
}
.Main_CampaignMatch {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 15px;
}
.Main_CampaignName {
  color: rgb(var(--d-text-yellow));
  margin-bottom: 5px;
}
.Main_CampaignTrackName {
  flex-grow: 1;
  background-color: #0003;
  font-size: 0.9em;
  line-height: 1.1;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  min-height: 45px;
}
.Main_CampaignRace {
  display: flex;
  flex-direction: column;
}
.Main_CampaignRaceOff {
  opacity: 0.5;
}
.Main_CampaignRaceOff .Main_CampaignTrackName {
  background-color: transparent;
}
.Main_CampaignTrackCond {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 1px 5px;
  flex-wrap: wrap;
  padding-left: 5px;
  min-height: 8px;
}
.Main_CampaignItem + .Main_CampaignItem {
  margin-top: 25px;
}
.Main_OptionsDivider {
  width: 100%;
}
.Main_SaveGalleryBoxCheck {
  display: flex;
  align-items: center;
  gap: 10px;
}
.Main_SaveGalleryDialog {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.Main_SaveGalleryCheckRightValue {
  color: var(--d-text-b);
}
.Main_DialogMessage {
  padding-bottom: 20px;
}
.Main_DialogBottom {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.Main_OptionsMemory {
  margin-top: 30px;
}
.Main_MemoryLine {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}
.Main_MemoryLine + .Main_MemoryLine {
  margin-top: 4px;
}
.Main_MemoryLabel {
  opacity: 0.8;
  font-size: 14px;
  width: 2.2em;
  display: flex;
  justify-content: flex-end;
  margin-right: 3px;
}
.Main_MemorySave.D_Button_Correct::after {
  content: "\e943";
  font-family: 'JurisT' !important;

}
.Main_GameVersionText {
  width: 100%;
  text-align: center;
}
.Main_SaveGalleryGuide {
  font-size: 13px;
  background-color: #a9904129;
  box-shadow: inset 0px 0px 0px 2px #ffe39417;
  padding: 8px 10px;
  border-radius: 10px;
  margin: 0 30px;
  color: #cdc2a3;
  text-align: center;
}
.Main_AddTrackBox {
  gap: 15px;
}
.Main_AddTrackDirect {
  color: #fff3;
  --height: 28px;
}
[contenteditable] {
  -webkit-user-select: text;
  user-select: text;
}
.Main_AdvancedDialogBox {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.Main_KingDialogBox {
  --width: 240px;
}
.Main_KingFixed {
  --width: 180px;
}
.Main_KingFilter {
  height: 140px;
  width: var(--width);
  margin: 0 auto;
  margin-top: 17px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
  overflow-y: auto;
}
.Main_KingFixed .Main_KingFilter {
  height: 70px;
  margin-top: 5px;
}
.Main_KingTrackBox {
  width: var(--width);
  margin: 0 auto;
}
.Main_KingTrackBoxSelected {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.Main_KingAnalyzeButton {
  width: var(--width);
  margin: 0 auto;
  margin-top: 17px;
}
.Main_DialogTitleDual {
  display: flex;
  justify-content: space-between;
}
.Main_KingPinButton {
  padding: 0px 6px;
  --height: 34px;
  margin: -10px -10px 0 0;
  height: 34px;
}
.Main_KingPinButton:not(:last-child) {
  margin-right: 5px;
}
.Main_KingPinIcon {
  font-size: 18px;
  color: var(--d-text);
  transform: rotate(90deg);
}
.Main_KingFixed .Main_KingPinIcon {
  transform: rotate(-90deg);
}
.Main_KingFixed .Main_DialogTitle {
  margin-bottom: 5px;
}
.Main_KingTuneSelector {
  
}
.Main_EditMraButton {
  font-size: 16px;
  padding: 0 3px;
  --height: 28px;
  min-width: 41px;
  margin-top: -4px;
}
.Main_EditMraField > input {
  margin-top: -1px;
  padding: 5px 6px;
}





.Cg_Layout {
  width: 100%;

}
.Cg_Corner {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  height: var(--top-height);
  width: var(--left-width);
  /* position: fixed; */
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
}
.Cg_HeaderLeft {
  display: flex;
  position: relative;
}
.Cg_RowCornerBox {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  z-index: 1;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  transition-property: set;
  justify-content: center;
  flex-grow: 1;
  flex-direction: column;
}
.Cg_SelectorLayout {
  display: flex;
  width: 100%;
  max-width: 500px;
  align-items: center;
  /* margin-bottom: 15px; */
  flex-grow: 1;
}
.Cg_SelectorCenter {
  flex-grow: 1;
  text-align: center;
}
.Cg_SaveButtonBox {

}
.Cg_Box {
  display: grid;
  --cg-width: 230px;
  --cg-height: 150px;
  grid-template-columns: repeat(5, var(--cg-width));
  justify-content: center;
}
.Cg_RoundSubmitsControl {
  display: flex;
  align-items: center;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}
.Cg_RoundSubmitsControlCenter {
  flex-grow: 1;
}
.Cg_CarPlaceHolder {
  height: var(--cg-height);
}
.Cg_Mid .BaseCard_FixBack {
  --back-l: 0%;
  border-radius: 9px;
  background-color: hsla(var(--back-h), var(--back-s), var(--back-l), 0.1);
}
.Cg_Mid {
  padding: 20px 0;
  /* margin-top: var(--top-height); */
}
.Cg_ThemTime {
  height: var(--cell-height);
}
.Cg_Opponent {
  position: relative;
}
.Cg_OppoTuneBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0002;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 4px;
  z-index: 21;
  background-color: #000a;
}
.Cg_OppoTuneButton {
  background-color: rgba(90,90,90,1);
  --back-opac: 0.8;
  --back-color: 90, 90, 90;
  --back-opac-foc: 0.8;
  font-size: 16px;
  border-radius: 6px;
  padding: 0 7px;
  color: #e5e5e5;
}
.Cg_SelectTrackButton {
  color: #fff4;
  width: 100%;
  font-size: 18px;
  --height: var(--cell-height);
}
.Cg_Track {
  position: relative;
  padding-top: 3px;
}
.Cg_SelectTrackButtonEdit {
  position: absolute;
  top: 0;
  left: -1px;
  z-index: 1;
  width: auto;
  background-color: hsl(var(--back-h), var(--back-s), 15%);
  color: var(--d-text-b);
  animation: campaignTip 0.1s linear forwards;
  display: none;
  /* box-shadow: 0px 0px 21px -7px #000; */
  --back-opac: 1;
  --back-color: 20, 20, 20;
}
.Cg_Track:hover:not(.RowTrack_Dragging) .Cg_SelectTrackButtonEdit {
  display: flex;
}
.Cg_SelectTrackButtonMoveRight,
.Cg_DragButtonIcon {
  left: 35px;
}
.Cg_Divider {
  text-align: center;
  padding-bottom: 5px;
  margin-top: 15px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  --cor: #464646;
  --cor2: #464646;
  --size: 50px;
  --translate: 14px;
}
.Cg_PointsRed {
  --cor: rgb(var(--d-text-red2));
  --cor2: #000;
  --size: 70px;
}
.Cg_PointsGreen {
  --cor: rgb(var(--d-text-green));
  --cor2: #000;
  --size: 70px;
}
.Cg_PointsGrey {
  --cor: #727272;
  --cor2: #000;
  --size: 70px;
}
.Cg_Points {
  font-size: var(--size);
  font-weight: bold;
  transform: translateY(var(--translate));
  background: linear-gradient(var(--cor) 47%, var(--cor2) 80%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  white-space: nowrap;
}
.Cg_Race:first-child .Cg_TrackBox {
  box-shadow: inset 2px 0px 0px 0px #ffffff07;
}
.Cg_Race:first-child .Cg_Track {

}
.Cg_Race:first-child .Cg_ThemTime {
  box-shadow: inset 2px 0px 0px 0px #ffffff07;
}
.Cg_YouTime {
  box-shadow: inset 0px 2px 0px 0px #ffffff07;
}
.Cg_Race:first-child .Cg_YouTime {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.CgYouCar {
  margin-top: -3px;
}
.Cg_YouTime > .Row_DisabledCell {
  height: calc(var(--cell-height) * 2.3);
}
.Cg_BankPhoto {
  display: flex;
  height: 38px;
  width: 57px;
  min-width: 57px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 10px;
  background-color: #00000038;
}
.Cg_BankPhotoImg {
  height: 100%;
  transform: scale(1.4) translateX(1px);
}
.Cg_YouBankBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2px 0 25px 0;
}
.Cg_YouBankManualAdd {
  margin-bottom: 2px;
}
.D_Button.Cg_BankButton {
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
  background-color: rgba(0,0,0,0.0);
  --back-opac: 0.06;
}
.Cg_BankResult {
  min-width: 55px;
  text-align: right;
}
.Cg_BankPoints {
  color: var(--cor);
}
.Cg_BankClass {
  margin-right: 9px;
}
.Cg_BankTune {
  /* margin-right: 9px; */
}
.Cg_BankCarName {
  color: var(--d-text);
  font-size: 12px;
}
.Cg_RqCount {
  width: 100%;
  height: 5px;
  position: absolute;
  bottom: 0;
  z-index: 31;
}
.Cg_RqFill {
  background-color: #354958;
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  width: 0;
  transition-duration: 0.5s;
  max-width: 100%;
}
.Cg_RqText{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}
.Cg_RqRq {
  transform: scaleX(1.7) skewX(-14deg);
  margin-right: 12px;
  font-weight: bold;
  font-size: 0.7em;
}
.Cg_CenterBottom {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
  min-height: 34px;
  margin-top: 5px;
}
.Cg_BankButtonLose {
  opacity: 0.4;
}
.Cg_Right {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  height: var(--top-height);
  width: var(--left-width);
  padding: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  overflow-y: auto;
}
.Cg_ReqsTitle {
  opacity: 0.6;
  font-size: 13px;
  /* margin-top: -10px; */
}
.D_Button.Cg_TopButton {
  font-size: 14px;
  --height: 27px;
}
.Cg_SelectorDialogHeader {
  background-color: var(--d-back);
  display: flex;
  align-items: center;
  padding: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.Cg_SelectorDialogTitle {
  flex-grow: 1;
  margin-bottom: 0;
}
/* .Cg_SelectorDialog .BaseDialog_Box {
  border-radius: 10px;
} */
.Cg_SelectorDialogMid {
  border-bottom-left-radius: 10px;
  padding-top: 0;
}
.Cg_FilterButtons {
  margin-top: 10px;
}
.Cg_MidLoading {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.Cg_Offline {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.Cg_ListSelectBox {
  max-width: 450px;
  margin: 0 auto;
}
.Cg_YB {
  color: #e5bf37;
}
.Cg_SN {
  color: #ff6262;
}
.Cg_EX {
  color: #5899fb;
}
.Cg_PG {
  color: #9ac712;
}
.Cg_IsApprovingBox {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  gap: 15px;
}
.Main_RoundDone {
  display: flex;
  align-items: center;
}
.Main_RoundDoneIcon {
  font-size: 11px;
  color: rgb(var(--d-text-yellow));
  margin-left: 6px;
}
.Main_RoundDoneCreator {
  margin-left: 18px;
  box-shadow: 0px 0px 0px 6px rgba(0,0,0,0.15);
  background-color: rgba(0,0,0,0.15);
  display: flex;
  border-radius: 3px;
}
.Cg_Header {
  position: static;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 30;
}
.Cg_RoundEmptyBox {
  text-align: center;
}
.Cg_RoundEmptyTitle {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
}
.Cg_RoundEmptyBody {

}
.Cg_RoundEmptyThanks {
  color: rgb(var(--d-text-green));
}
.Cg_BottomModTools {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}
.Cg_RoundEmptyBox + .Cg_BottomModTools {
  margin-top: 15px;
}
.Cg_SelectorEventSpan {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.Cg_Creator {
  color: var(--d-text);
  opacity: 0.7;
}
.Main_AnnouncementLayout {

}
.Main_AnnouncementLogo {
  display: flex;
  justify-content: center;
  margin-top: -50px;
  margin-bottom: 15px;
}
.Main_AnnouncementBox {
  text-align: center;
}
.Main_AnnouncementMaybe {
  opacity: 0.6;
  font-size: 0.7em;
  margin-top: 2px;
}
.Main_AnnouncementTitle {
  margin: 20px 0;
  font-size: 2.4em;
  line-height: 1.1;
  color: #cdcdcd;
}
.Main_AnnouncementButton {
  margin: 20px 0 2px 0;
}
.Event_CompItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 13px;
  margin-top: 7px;
}
.Event_SubTitle {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
  text-align: center;
}
.Event_Track {
  margin-top: 8px;
  box-shadow: inset 0px 2px 0px 0px #ffffff07;
}
.Event_Track:first-child {
  box-shadow: inset 2px 2px 0px 0px #ffffff07;
}
.Event_BankButton {
  width: 100%;
  justify-content: flex-start;
}
.D_Button.Event_BankPick {
  /* --back-color: 255, 255, 255;
  --back-opac: 0.1; */
  /* background-color: rgba(var(--back-color), var(--back-opac)); */
  /* box-shadow: inset 0px -2px 0px 0px var(--cor); */
  /* box-shadow: inset 0px -36px 0px 0px rgba(var(--back-color), var(--back-opac)); */
}
.D_Button.Event_BankReference,
.D_Button.Event_BankSemiReference {
  --back-color: 255, 255, 255;
  --back-opac: 0.07;
  background-color: rgba(var(--back-color), var(--back-opac));
  /* box-shadow: inset 0px -36px 0px 0px rgba(var(--back-color), var(--back-opac)); */
}
.Event_PicksManage {
  background-color: #444;
  max-width: 800px;
  margin: 0px auto;
  padding: 20px;
  display: grid;
}
.Main_FilterHeaderLeft {
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin-right: 10px;
  gap: 15px;
  justify-content: space-between;
}
.Main_FilterHeaderLeftBox {
  display: flex;
  align-items: center;
  margin-right: 10px;
  gap: 15px;
}
.Event_HasPickList > .Event_BankButton:not(.Event_BankReference):not(.Event_BankPick) {
  opacity: 0.4;
}
.Event_HasPickList > .Event_BankSemiReference:not(.Event_BankPick) {
  opacity: 0.4;
}
.Event_BankPhoto {
  margin-right: 7px;
}
.Event_BankClass {
  margin-right: 5px;
}
.Event_NewTracksetBox {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.Event_BankTime {
  flex-grow: 1;
  margin-right: 10px;
}
.Event_Daily {
  color: #5899fb;
}
.Event_Hidden {
  color: #9ac712;
}
.Main_StyledItemMargin {
  margin-top: 10px;
}
.Clubs_SelectorBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
  gap: 5px;
}
.Clubs_RowCornerBox {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  z-index: 1;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  transition-duration: 0.3s;
  transition-property: set;
  justify-content: center;
  flex-grow: 1;
  flex-direction: column;
}
.Clubs_SelectorLayout {
  display: flex;
  padding: 0 10px;
  align-items: center;
  /* margin-bottom: 15px; */
  flex-grow: 1;
}
.Clubs_Mid {
  padding-bottom: 20px;
}
.Clubs_SemiBox {
  background-color: hsl(var(--back-h), var(--back-s), 23%);
  margin-bottom: 20px;
  padding: 20px 10px;
}
.Clubs_Box {
  --cg-width: 230px;
  display: flex;
  max-width: calc(var(--cg-width) * 5);
  margin: 0 auto;
  justify-content: center;
  gap: 30px;
}
.Clubs_DayBox {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 3px;
}
.Clubs_DaySelectorActive {
  color: var(--d-text-b);
  box-shadow: inset 4px 0px 0px 0px #ffffff1f;
}
.Main_AdminText {
  color: rgb(var(--d-text-yellow));
  margin-bottom: 7px;
}
.Main_AdminTextArea {
  background-color: rgba(0,0,0,.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: none;
  margin-top: 2px;
  width: 100%;
}
.Main_AdminLayoutBox {
  flex-direction: column;
  align-items: center;
}
.Main_AdminLayout {
  max-width: 500px;
  flex-grow: 1;
  width: 100%;
}





.Main_2 {
  --cell-width: 85px;
  --cell-height: 42px;
  --top-height: 70px;
  --left-width: 250px;
  font-size: 15px;
}
.Main_2 .Main_Mid {
  /* display: none; */
  height: auto;
}
.Main_2 .Main_Left {
  width: unset;
  position: sticky;
  top: 0;
  margin-top: 0;
  height: var(--top-height);
  box-shadow: none;
  min-height: unset;
  margin-left: var(--left-width);
  z-index: 5;
  display: block;
}
.Main_2 .Main_Credits {
  /* display: none; */
}
.Main_2 .Main_TrackList {
  display: flex;
  height: 100%;
}
.Main_2 .Row_Layout:not(.Row_ForceNormalSize) {
  display: flex;
}
.Main_2 .Main_Body {
  flex-direction: column;
}
.Main_2 .Row_Cell:not(.Row_ForceNormalSizeCell) {
  width: var(--cell-width);
  height: 100%;
}
.Main_2 .Row_Times .Row_Cell {
  height: var(--cell-height);
}
.Main_2 .Row_Content {
  /* line-height: calc(var(--cell-height) - 12px); */
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1em;
}
.Main_2 .Row_ContentEmpty:not(:focus) ~ .Row_Placeholder {
  display: flex;
}
.Main_2 .Row_Placeholder {
  width: 100%;
  justify-content: center;
  align-items: center;
}
.Main_2 .Row_Tracks:not(.Row_ForceNormalSize) .Row_Content {
  text-align: center;
  white-space: normal;
}
.Main_2 .Row_Tracks:not(.Row_ForceNormalSize) .Row_Cell {
  border-right-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 0;
}
.Main_2 .Row_Layout:not(.Row_ForceNormalSize) {
  display: flex;
  align-items: stretch;
}
.Main_2 .Row_ConfigLabel {
  display: none;
}
.Main_2 .Row_ConfigButton {
  --height: 30px;
  padding: 0px 4px;
}
.Main_2 .Row_ConfigIcon {
  font-size: 18px;
}
.Main_2 .Row_Tracks:not(.Row_ForceNormalSize) .Row_ConfigCell {
  /* box-shadow: inset 0px -18px 16px -17px #5fb500, inset 0px -3px 0px 0px #5fb500; */
}
.Main_2 .Row_ConfigCell.Row_Cell {
  width: calc(var(--cell-width) * 1);
}
.Main_2 .Row_Tune {
  padding-left: 16px;
}
.Main_2 .Row_TuneChooseBox {
  position: absolute;
  flex-direction: row;
  left: 0;
  background-color: #4c4c4c;
  padding: 3px;
  border-radius: 10px;
}
.Row_OrderBox {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}
.Main_2 .Row_OrderBox {
  display: flex;
}
.Main_2 .Row_ConfigIcon {
  transform: rotate(90deg);
}
.Main_2 .Row_TuneChooseBox .Row_ConfigButton:nth-child(5) {
  display: none;
}
.Main_2 .Main_AddTrackBox {
  flex-direction: column;
  gap: 0px;
} 
.Main_2 .Row_Content {
  padding: 12px 0;
}




.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) {
  --card-left-width: 19%;
  --card-right-width: 31%;
  --card-top-height: 11.5%;
  --card-stat-height: 31.9px;
}
.Main_Compact .Car_Header:not(.Car_AddHeader):not(.Row_DialogCardCard) > *:not(.Car_HeaderName):not(.Car_HeaderBlockRQ):not(.Car_HeaderBlockClass):not(.Car_HeaderBlockTopSpeed):not(.Car_HeaderBlock060):not(.Car_HeaderBlockHandling):not(.Car_HeaderBlockDrive):not(.Car_CompactOverlay):not(.Car_HeaderBlockPrize):not(.Car_HeaderBlockTires):not(.Car_TuneTip) {
  display: none;
}
.Main_Compact .Car_Header:not(.Car_AddHeader):not(.Row_DialogCardCard) .Car_HeaderBlockTiresLabel {
  display: none;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) {
  width: 120px;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderName {
  font-size: 0.8em;
  width: calc(100% - 8px);
  margin-top: 0px;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderNameBig {
  font-size: 0.7em;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderNameBigBig {
  font-size: 0.6em;
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockTopSpeed,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlock060,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockHandling,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockDrive {
  box-shadow: 0px -2px 0px hsla(0, 100%, 100%, 0.09);
  backdrop-filter: blur(15px);
}
@media (pointer:coarse) {
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockTopSpeed,
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlock060,
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockHandling,
  .Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderBlockDrive {
    backdrop-filter: unset;
    background-color: hsla(40, 6%, 30%, 0.8);
  }
}
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderStatValue,
.Main_Compact .BaseCard_Layout:not(.BaseCard_LayoutDialog) .Car_HeaderStatLabel {
  padding-right: 1px;
}
.Main_Compact {
  --cell-width: 120px;
}
.Main_Compact .Main_LogoPre {
  font-size: 14px;
}




.Main_BodyPrint .Main_Corner {
  justify-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: 50px max-content;
}
.Main_BodyPrint .Row_Tune {
  padding-left: 0px;
}
.Main_BodyPrint .Main_Credits {
  display: none;
}
.Main_BodyPrint .Row_DisabledCell {
  background-color: #00000024;
}
.Main_BodyPrint .Row_Cell {
  border: solid 2px #ffffff07;
  border-right-width: 0;
  border-bottom-width: 0;
}
.Main_Layout:not(.Main_2) .Main_BodyPrint .Row_Cell:nth-child(3n-1) {
  border-top-width: 2px;
  border-top-color: #ffffff1c;
}
.Main_2 .Main_BodyPrint .Row_ConfigCell {
  width: 70px; /* this value is hard coded in sharePrint() */
}
.Main_2:not(.Main_ColorsFull) .Main_BodyPrint .Car_Layout:nth-child(3n-1) .Row_Cell {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #ffffff1c;
}
.Main_2 .Main_BodyPrint .Main_LogoPre {
  display: none;
}
.Main_2 .Main_BodyPrint .Row_Tune233:before,
.Main_2 .Main_BodyPrint .Row_Tune332:before {
  content: "";
  position: absolute;
  height: 100%;
  opacity: 0.07;
  pointer-events: none;
  width: 20%;
  background: white;
  bottom: 0px;
}
.Main_2 .Main_BodyPrint .Row_Tune332:before {
  left: 0;
}
.Main_2 .Main_BodyPrint .Row_Tune233:before {
  right: 0;
}
.Main_BodyPrint .Main_UserBottom {
  display: none;
}
.Main_BodyPrint.Main_Body button {
  display: none;
}
.Main_BodyPrint .Main_CornerMid {
  display: none;
}
.Main_BodyPrint .Car_LayoutAddCar {
  display: none !important;
}
.Main_BodyPrint .Main_SaveAllBox {
  display: none;
}
.Main_BodyPrint .Main_PrintBy {
  display: block;
}
.Main_BodyPrint {
  --card-top-height: 12%;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );
}
.Main_BodyPrint .Car_HeaderName {
  /* margin-top: -1px; */
}
.Main_BodyPrint .Row_EmptyInvite {
  display: none;
}
.Main_Compact .Main_BodyPrint .Car_HeaderBlockTopSpeed,
.Main_Compact .Main_BodyPrint .Car_HeaderBlock060,
.Main_Compact .Main_BodyPrint .Car_HeaderBlockHandling,
.Main_Compact .Main_BodyPrint .Car_HeaderBlockDrive,
.Main_BodyPrint .Car_HeaderBlockTop {
  background-color: hsla(40, 6%, 30%, 0.8);
}
.Main_BodyPrint .Car_HeaderBlockTop {
  height: calc(var(--card-top-height) + 1px);
}
.Main_Compact .Main_BodyPrint .Car_HeaderBlockTopSpeed {
  box-shadow: unset;
}
.Main_Compact .Row_TuneChooseButton {
  /* display: none; */
}
.Main_Compact .Row_TuneChooseBox {
  position: absolute;
  flex-direction: column;
  top: 4px;
  background-color: #4c4c4c;
  padding: 10px;
  border-radius: 10px;
}
.Main_Compact .Car_Loading::after {
  left: 50%;
}
.Main_BodyPrint .Main_GamePrintInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-top: 15px;
}
.Main_2 .Main_BodyPrint .Main_GamePrintInfo {
  margin-top: 0px;
  flex-direction: row;
}
.Main_2 .Main_BodyPrint {
  --top-height: 93px;
}
.Main_BodyPrint .Main_Left {
  justify-content: flex-start;
}
.Main_BodyPrint .Main_PrintCreditsBottom {
  display: block;
  max-width: calc( var(--cell-width) * var(--number-cars) )
}
.Main_2 .Main_BodyPrint .Main_PrintCreditsBottom {
  display: block;
  max-width: calc( var(--cell-width) * var(--number-tracks) + var(--left-width))
}
.Main_BodyPrint .Row_ShowMoreTracks {
  display: none;
}
.Main_BodyPrint .Row_Campaign {
  display: none !important;
}
.Main_Compact .Main_BodyPrint .Row_TuneChooseBox,
.Main_2 .Main_BodyPrint .Row_TuneChooseBox {
  display: none;
}
.Main_BodyPrint .Cg_Points {
  background: none;
  color: var(--cor);
}
.Main_BodyPrint.Cg_Layout {
  width: 1200px;
  min-width: 1200px;
}
.Main_BodyPrint.Cg_Layout .Main_AddTrackDirect,
.Main_BodyPrint.Cg_Layout .Cg_SelectorRight,
.Main_BodyPrint.Cg_Layout .Cg_SelectorLeft,
.Main_BodyPrint.Cg_Layout .Cg_FilterButtons,
.Main_BodyPrint.Cg_Layout .Row_ConfigButton,
.Main_BodyPrint.Cg_Layout .ticon-keyboard_arrow_down {
  display: none;
}
.Main_BodyPrint.Cg_Layout .Row_TuneChooseButton {
  border-radius: unset;
  transition-duration: unset;
}
.Main_BodyPrint.Cg_Layout .Row_DialogButtonTuneActive {
  box-shadow: unset;
  background-color: rgba(var(--d-text-green), 0.4) !important;
  color: white;
}
.Main_BodyPrint.Cg_Layout .Cg_ThemTime .Row_Cell,
.Main_BodyPrint.Cg_Layout .Cg_YouTime .Row_Cell:not(.Row_ConfigCell) {
  border-bottom-width: 2px;
}
.Main_BodyPrint.Cg_Layout .Cg_Race:last-child .Row_Cell {
  border-right-width: 2px;	
}
.Main_BodyPrint .Cg_Header {
  position: static;
}
.Main_BodyPrint .Cg_Mid {
  margin-top: 0;
}
.Main_BodyPrint .Cg_BottomModTools {
  display: none;
}
.Main_BodyPrint .BaseEventTrackbox_ClassCheck {
  display: none;
}
.Main_BodyPrint .Event_CompilationIncomplete {
  display: none;
}
.Main_BodyPrint .BaseSwitch_Layout {
  display: none;
}





@media only screen and (max-width: 767px) {
  .Main_Normal .Main_Body:not(.Main_BodyPrint) {
    /* --d-back: #504242; */
    --left-width: 120px;
  }
  .Main_BodyPrint {
    /* --left-width: 200px; */
  }
  .Main_CornerMid .BaseAvatar_Layout {
    display: none;
  }
  .Main_UserBottom .BaseAvatar_Layout {
    --size: 21px !important;
  }
  .Main_UserName {
    font-size: 0.7em;
  }
  .Main_FilterClassChips {
    gap: 5px;
  }
  .Main_FilterDual {
    grid-template-columns: 1fr;
  }
  .Main_FilterThree {
    grid-template-columns: 1fr;
  }
  .Main_OptionsDual {
    /* grid-template-columns: 1fr;
    gap: 20px; */
  }
  .Main_FilterClearTop {
    justify-content: center;
    margin-top: -10px;
    margin-bottom: -5px;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .Main_CampaignMatch {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    grid-auto-flow: row;
  }
  .Main_AddTrackBox {
    gap: 5px;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) {
    --left-width: 85px;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Right {
    display: none;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .Car_Header2 {
    padding-right: 0;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Left {
    margin-right: 0px;
    width: 100%;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Img {
    transform: scale(1.2) translateX(7px) translateY(-6px);
    height: 140%;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .BaseCard_Header2Right2 {
    display: flex;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .Main_Logo {
    display: none;
  }
  .Main_2 .Main_Body:not(.Main_BodyPrint) .D_ButtonMenu {
    padding: 11px 8px;
  }
}
@media only screen and (min-width: 768px) {
  .Main_MidEmptyItemAdd .Main_MidEmptyButtonSearch {
    height: 150px;
    width: 200px;
  }
}
@media only screen and (max-width: 1200px) {
  /* .Cg_Box {
    justify-content: flex-start;
  } */
  .Main_Layout > *:not(.Main_BodyPrint) .Event_BankCarName {
    display: none;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_Box {
    --cg-width: 115px;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankResult,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankClass,
  .Main_Layout > *:not(.Main_BodyPrint) .Event_BankClass {
    display: none;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankTune {
    color: var(--cor);
  }
  .Main_Layout.Main_ShowPoints > *:not(.Main_BodyPrint) .Cg_BankTune {
    display: none;
  }
  .Main_Layout.Main_ShowPoints > *:not(.Main_BodyPrint) .Cg_BankResult {
    display: block;
    margin-right: 0;
    transform: translateX(-7px);
  }
  .Main_Layout.Main_ShowPoints > *:not(.Main_BodyPrint) .Cg_BankResult:not(.Cg_PointsRed):not(.Cg_PointsGreen):not(.Cg_PointsGrey) {
    font-size: 0.7em;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_Divider {
    --size: 30px;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsRed,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsGreen,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsGrey {
    --size: 40px;
  }
  .Event_CompilationBox .Event_BankTime {
    text-align: left;
    padding-left: 7px;
    --size: 40px;
  }
  .Event_BankClass {
    margin-left: 5px;
  }
}
@media only screen and (max-width: 600px) {
  .Cg_Box {
    justify-content: flex-start;
  }
}
</style>