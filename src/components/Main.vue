<template>
  <div :class="{
      Main_Normal: !inverted,
      Main_2: inverted && mode === 'classic',
      Main_Compact: (compact && mode === 'classic') || ((mode === 'cg' || mode === 'events') && windowWidth < 1200),
      Main_ColorsFull: fullColors,
      Main_ColorsMedal: !fullColors
    }" class="Main_Layout" @click.stop="outsideClick()">
    <div
      v-if="mode === 'classic'"
      :class="{ Main_BodyEmpty: carDetailsList.length === 0 }"
      class="Main_Body"
      @click.stop="outsideClick()">
      <div class="Main_Backtop"></div>
      <div class="Main_Corner">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
        <div class="Main_CornerMid">
          <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="optionsDialogActive = true;">
            <i class="ticon-3menu Main_MenuIcon" aria-hidden="true"/>
          </button>
          <button v-if="carDetailsList.length > 0 && currentTracks.length > 0" class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="shareDialog = true; generateUrl(); generateCarsList()">
            <i class="ticon-camera1 Main_MenuIcon" aria-hidden="true"/>
          </button>
        </div>
        <div v-if="user && inverted" class="Main_PrintBy">
          <div class="Main_PrintByLabel">{{ $t("m_printBy") }}</div>
          <div :class="`Main_UserT${highlightsUsers[user.username]}`" class="Main_PrintByUser">{{ user.username }}</div>
        </div>
        <div class="Main_GamePrintInfo">
          <div class="Main_GameVersionText">{{ gameVersion }}</div>
          <div class="Main_GameVersionText">{{ new Date().toISOString().slice(0,10) }}</div>
        </div>
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
        <div v-if="showCarsFix" class="Main_CarList" @click.stop @mouseleave="hoverIndex = -1">
          <template v-for="(car, carIx) in carDetailsList">
            <Car
              :car="car"
              :index="carIx"
              :lastIndex="carDetailsList.length - 1"
              :countPerTrack="countTimesPerTrack"
              :trackList="currentTracks"
              :highlights="highlights[carIx]"
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
              @delete="deleteCar(carIx)"
              @moreTracks="moreTracksCar($event)"
              @newindex="newIndex($event)" />
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
          <div class="Cg_Corner">
            <div class="Main_Logo">
              <div class="Main_LogoPre">Top Drives</div>
              <Logo />
            </div>
            <div class="Main_CornerMid">
              <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="optionsDialogActive = true;">
                <i class="ticon-3menu Main_MenuIcon" aria-hidden="true"/>
              </button>
              <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="shareDialog = true; generateUrl()">
                <i class="ticon-camera1 Main_MenuIcon" aria-hidden="true"/>
              </button>
            </div>
            <div class="Main_GamePrintInfo">
              <div class="Main_GameVersionText">{{ gameVersion }}</div>
              <div class="Main_GameVersionText">{{ new Date().toISOString().slice(0,10) }}</div>
            </div>
            
          </div>
          <div class="Cg_RowCornerBox">
            <!-- top challenge -->
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
                    <span>{{ $tc("m_round", 1) }} {{ cgCurrentRound+1 }}</span>
                    <i class="ticon-keyboard_arrow_down" aria-hidden="true"/>
                  </button>
                </div>
                <div v-if="cgRound.creator && cgRound.lastAnalyze">
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
                    <button
                      v-if="user && (user.mod || isRoundEmptyForUser)"
                      :disabled="cgLoadingAny"
                      class="D_Button Main_AddTrackDirect"
                      @click="cgOpenRqEdit($event)">
                      <i class="ticon-pencil" aria-hidden="true"/>
                    </button>
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
                    <template v-else-if="cgIsApproving && !!user && user.mod">
                      <div class="Cg_IsApprovingBox">
                        <button
                          :class="{ D_Button_Loading: cgSaveLoading }"
                          class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
                          @click="cgReviewRound(false)">
                          <span>{{ $t("m_delete") }}</span>
                        </button>
                        <button
                          :class="{ D_Button_Loading: cgSaveLoading }"
                          style="right: unset; left: 0;"
                          class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen"
                          @click="cgReviewRound(true)">
                          <span>{{ $t("m_approve") }}</span>
                        </button>
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
            <div v-if="cgRound.date && user && (user.mod || isRoundEmptyForUser)" class="Cg_FilterButtons">
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
        <div v-if="isRoundEmptyForUser && !cgLoading && cgRound.date" class="Cg_RoundEmptyBox">
          <div v-if="cgSentForReview" style="margin-bottom: 10px;" class="Cg_RoundEmptyBody Cg_RoundEmptyThanks">{{ $t("p_userSentCgForAnalyse") }}</div>
          <div v-else style="margin-bottom: 10px;" class="Cg_RoundEmptyBody">{{ $t("p_emptyRoundForUser") }}</div>
        </div>
        <template v-if="!isRoundEmptyForUser && (!user || !user.mod) && cgRound.date && cgRound.races && cgRound.races[0] && cgRound.races[0].car === undefined ">
          <div class="Cg_RoundEmptyBox">
            <div class="Cg_RoundEmptyTitle">{{ $t("m_emptyRound") }}</div>
            <div class="Cg_RoundEmptyBody">{{ $t("m_emptyRound2") }}</div>
            <div class="Cg_RoundEmptyBody">{{ $t("m_emptyRoundLogin") }}</div>
            <BaseDiscordButton style="margin-top: 20px;" />
          </div>
        </template>
        <template v-else-if="isRoundEmptyForModders && cgRound.date && cgRound.races && cgRound.races[0] && cgRound.races[0].car === undefined ">
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
          <div class="Cg_RoundEmptyBox">
            <div class="Cg_RoundEmptyBody">{{ $t("m_lockRound", { mod: cgRound.reservedTo }) }}</div>
          </div>
        </template>
        
        
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
                  :hideClose="!user || !user.mod"
                  @cog="cgShowTuneDialog(race.car, race, true)"
                  @delete="race.car = undefined; race.rid = null; calcRaceResult(race);" />
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
                  :forceDisabled="!user || (!user.mod && !isRoundEmptyForUser)"
                  :placeholder="$t('m_timeToBeat')"
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
                  @click="cgOpenPointsEdit(race)">
                  <div v-if="!race.track || !race.car || (race.cars[race.carIndex] || {}).points === undefined" class="Cg_Points">{{ $t("m_select") }}</div>
                  <div v-else-if="(race.cars[race.carIndex] || {}).points === 0" class="Cg_Points">{{ $t("m_draw") }}</div>
                  <div v-else-if="(race.cars[race.carIndex] || {}).points === 50" class="Cg_Points">{{ $t("m_win") }}</div>
                  <div v-else-if="(race.cars[race.carIndex] || {}).points === -50" class="Cg_Points">{{ $t("m_lose") }}</div>
                  <div v-else class="Cg_Points">{{ (race.cars[race.carIndex] || {}).points }}</div>
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
                        v-if="bankCar.points !== 'no time' && bankCar.tune"
                        :disabled="cgLoadingAny"
                        :key="index"
                        :class="{
                          Cg_BankButtonLose: bankCar.points < 0 && race.track && race.car,
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
                          <span v-if="bankCar.points === 0" class="Cg_BankPoints">{{ $t("m_draw") }}</span>
                          <span v-else-if="bankCar.points === 50" class="Cg_BankPoints">{{ $t("m_win") }}</span>
                          <span v-else-if="bankCar.points === -50" class="Cg_BankPoints">{{ $t("m_lose") }}</span>
                          <span v-else class="Cg_BankPoints">{{ bankCar.points }}</span>
                        </div>
                      </button>
                    </template>
                  </div>
                </div>
              </template>
            </div>
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
            itemWidth="216px"
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
          <div class="Cg_Corner">
            <div class="Main_Logo">
              <div class="Main_LogoPre">Top Drives</div>
              <Logo />
            </div>
            <div class="Main_CornerMid">
              <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="optionsDialogActive = true;">
                <i class="ticon-3menu Main_MenuIcon" aria-hidden="true"/>
              </button>
              <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="shareDialog = true; generateUrl()">
                <i class="ticon-camera1 Main_MenuIcon" aria-hidden="true"/>
              </button>
            </div>
            <div class="Main_GamePrintInfo">
              <div class="Main_GameVersionText">{{ gameVersion }}</div>
              <div class="Main_GameVersionText">{{ new Date().toISOString().slice(0,10) }}</div>
            </div>
            
          </div>
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
                <div class="Cg_CenterBottom">
                  <div class="Cg_RqText">
                    <span class="Cg_RqRq">RQ</span>
                    <span>{{ event.rqLimit }}</span>
                    <button
                      v-if="user && user.mod"
                      :disabled="eventLoading"
                      class="D_Button Main_AddTrackDirect"
                      @click="eventOpenRqEdit($event)">
                      <i class="ticon-pencil" aria-hidden="true"/>
                    </button>
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
                    <template v-else-if="!!user && cgNeedSave">
                      <div class="Main_SaveAllBox">
                        <button
                          :class="{ D_Button_Loading: cgSaveLoading || cgAnalyseLoading || cgBankToSaveLoading || saveLoading }"
                          class="D_Button Main_SaveAllButton"
                          @click="eventSaveAll()">{{ $t("m_save") }}</button>
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

          <div class="Cg_Right">
          </div>
        </div>
      </div>
      <div class="Cg_Mid">
        <template v-if="event.date">
          <template v-if="showCarsFix">

            <div class="Cg_Box">
              <div v-for="(comp, igroup) in event.comp" class="Event_CompItem">
                <BaseCompItem
                  :isMod="!!user && user.mod"
                  :comp="comp"
                  @edit="eventEditComp(igroup)" />
              </div>
            </div>
            
            <!-- <div class="Event_SubTitle Main_DialogTitle">Trackset</div> -->
            <div v-for="(trackset, itrackset) in event.resolvedTrackset" class="Cg_Box">
              <div v-for="(trackMonoArray, itrackMonoArray) in trackset" class="Event_Track">
                <Row
                  v-if="trackMonoArray.length === 1"
                  :list="trackMonoArray"
                  :loggedin="!!user"
                  :user="user"
                  :options="user && user.mod"
                  :cg="true"
                  class="Cg_TrackBox"
                  type="tracks" />
                <button
                  :disabled="eventLoadingAny"
                  :class="{ Cg_SelectTrackButtonEdit: trackMonoArray.length === 1 }"
                  class="D_Button Car_AddButton Cg_SelectTrackButton"
                  @click="eventTracksetSelected = itrackset; eventRaceSelected = itrackMonoArray; openDialogTrackSearch(false);">
                  <i v-if="trackMonoArray.length === 1" class="ticon-pencil Cg_SelectTrackButtonIcon" aria-hidden="true"/>
                  <span v-else>{{ $t("m_selectTrack") }}</span>
                </button>
              </div>
            </div>

            <!-- <div class="Event_SubTitle Main_DialogTitle">Trackset</div> -->
            <div class="Cg_Box" style="margin-top: 15px;">
              <div v-for="(group, igroup) in event.perfectHand" class="Cg_YouBank">
                <div class="Cg_YouBankBox">
                  <template v-for="(car, icar) in group">
                    <button
                      :disabled="eventLoadingAny"
                      :key="icar"
                      class="D_Button D_ButtonDark D_ButtonDark2 Cg_BankButton Event_BankButton"
                      @click="eventInspectCar(car, igroup, icar);">
                      <div class="Cg_BankPhoto Event_BankPhoto">
                        <img :src="car.photo" class="Cg_BankPhotoImg" alt="">
                      </div>
                      <div :style="`color: ${ car.color }`" class="Event_BankClass">{{ (car.car || {}).class }}{{ (car.car || {}).rq }}</div>
                      <div class="Main_SearchItemRight Cg_BankCarName Event_BankCarName">{{ car.car.name }}</div>
                    </button>
                  </template>
                  <button
                    v-if="user && user.mod"
                    :disabled="eventLoadingAny"
                    class="D_Button Main_AddTrackDirect"
                    @click="eventAddCar(igroup);">
                    <i class="ticon-plus_2" aria-hidden="true"/>
                  </button>
                </div>
              </div>
            </div>

          </template>
        </template>
        <div v-else-if="eventLoading" class="Cg_MidLoading">
          <BaseContentLoader
            :contents="true"
            itemWidth="216px"
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
                <div class="Main_SearchItemRight">{{ item.name }}</div>
              </button>
            </template>
          </div>
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
        <BaseConfigCheckBox
          v-if="!kingFixed"
          v-model="kingShowDownvoted"
          style="margin-top: 17px;"
          class="Main_KingTrackBox"
          name="kingShowDownvoted"
          :label="$t('m_includeDownvote')" />
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
      ridsMutationName="KING_EMIT_RIDS"
      @filterUpdate="updateKingFilter($event)"
      @listRids="kingAnalyseFinish($event);"
    />

    <BaseFilterDialog
      v-model="cgRequirementsDialog"
      :filterOnly="true"
      :cgRound="cgRound"
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
      :cgRound="cgRound"
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
          <div class="Row_OrderBox">
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
              class="D_Button Row_DialogButtonTune Row_DialogButtonTuneRelative"
              @click="changeTuneCar(tuneDialogCar, item)">
              {{ item }}
              <div v-if="tunesCount[item]" class="D_ButtonNote">{{ tunesCount[item] }}</div>
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
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.mra }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_weight") }} ({{ $t("c_stock").toLowerCase() }})</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.weight }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_fuel") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.clearance.toLowerCase()}`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_seats") }}</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.seats }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_enginePos") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.clearance.toLowerCase()}`) }}</div>
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
                
              </div>
            </div>
            <div class="Row_DialogCardExternalBox">
              <a
                :href="`https://topdrives.club/vehicle/${tuneDialogCar.tdid}`"
                class="D_Button D_ButtonDark D_ButtonDark2 Row_DialogTdc"
                target="_blank"
                rel="noopener noreferrer">
                <span>TDC</span>
                <i class="ticon-internal Row_DialogExternal" aria-hidden="true"/>
              </a>
            </div>
          </div>
          <div v-if="tuneDialogCar.users" class="Row_DialogCardUsers Space_TopPlus">
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
        </div>

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
      max-width="470px"
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
              :disabled="mode === 'cg' || needSave || eventLoadingAny || eventNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('cg')">
              {{ $t("m_challenges") }}
            </button>
            <button
              v-if="user && user.mod" 
              :class="{ D_ButtonChangeModeDisabled: mode === 'events' }"
              :disabled="mode === 'events' || needSave || cgLoadingAny || cgNeedSave"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonChangeMode"
              @click="changeMode('events')">
              {{ $t("m_events") }}
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
            <button
              style="padding-left: 15px;"
              class="Main_SearchItem"
              @click="loadChallengeFull(item.date)">
              <div v-html="item.nameStyled" class="Main_SearchItemRight" />
            </button>
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
              @click="loadCg(cg.date, index)">
              <div class="Main_SearchItemRight">{{ $tc("m_round", 1) }} {{ index+1 }}</div>
              <div v-if="item.lastAnalyze" class="Main_RoundDone">
                <i class="ticon-star Main_RoundDoneIcon" aria-hidden="true"/>
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
            iid="Cg_EditRq"
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
          <div class="Main_AnnouncementTitle">Challenges is out!</div>
          <div class="Main_AnnouncementBody">You'll no longer get stuck in any round</div>
          <div class="Main_AnnouncementMaybe">Or maybe you still will</div>
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 Main_AnnouncementButton"
            @click="changeMode('cg'); announcementDialog = false;">
            <span>Challenges</span>
          </button>
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
        <BaseConfigCheckBox v-model="showOldTags" name="showOldTags" :label="$t('m_showOldTags')" />
        <BaseConfigCheckBox v-model="cgDontRepeatSolution" name="cgDontRepeatSolution" :label="`${$t('m_challenges')}: ${$t('m_cgDontRepeatSolution')}`" @change="cgReCalcRound()" />
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
import Logo from './Logo.vue'
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
    Logo,
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
    BaseAboutDialog
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
      isPrinting: false,
      announcementDialog: false,
      highlightsUsers: {},
      lastestList: [],
      searchInputT: '',
      searchFilterDialog: false,
      librarySearchDialog: false,
      libraryApprove: false,
      showDataFromPast: false,
      showOldTags: false,
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
      optionsDialogActive: false,
      printImageDialog: false,
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
      customTrackDialog: false,
      backToOptionsDialog: true,
      hoverIndex: -1,
      gameVersion: "Game v17",
      mode: "classic",
      cgLoading: false,
      cgCurrentRound: 0,
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
      cgIsFiltering: false,
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
      cgSentForReview: false,
      cgDontRepeatSolution: true,
      cgPointsEditDialog: false,
      cgPointsEditModel: null,
      cgPointsEditString: null,
      cgPointsEditRace: null,
      forceShowAnalyse: false,
      event: {},
      eventCurrentId: null,
      eventCurrentName: null,
      eventList: [],
      eventLoading: false,
      eventNeedSave: false,
      eventSelectorDialog: false,
      eventNewDialog: false,
      eventNewName: null,
      eventNewLoading: false,
      eventNewError: false,
      eventRqEditDialog: false,
      eventRqEditModel: null,
      eventRqEditString: null,
      eventRqNeedToSave: false,
      eventTracksetSelected: 0,
      eventRaceSelected: 0,
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
              tracks: ["gForcer_a00","slalomr_a00","tCircuitr_a00","mnGforce_a00","mnHairpin_a00","mnCityNarrow_a00","mnCity_a00","mnCityLong_a00","mtHairpin_a00","mtTwisty_a00","tokyoLoop_a00","tokyoOffRamp_a00"]
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
              tracks: ["waterDrag_a00","runwayDrag_a00","mile1r_a00","mile4r_a00","drag100b_a00","drag150b_a00","drag30130_a00","drag50150_a00","drag75125_a00","testBowlr_a00","tokyoOverpass_a00"]
            },
            {
              type: "01",
              active: false,
              tracks: ["drag100_a01","drag100b_a01","drag150_a01","mile1_a01","mile2_a01","mile4_a01","testBowlr_a01"]
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
      changed16: [
        "Rimac_Nevera_2021",
        "Lotus_Evija_2021",
        "Porsche_Mission_R_Concept_2021",
        "Rimac_Concept_One_2016",
        "Peugeot_908_HDi_FAP_2007",
        "Koenigsegg_Jesko_Absolut_2021",
        "Koenigsegg_Regera_2015",
        "Pagani_Huayra_BC_2016",
        "Alfa_Romeo_Stelvio_Quadrifoglio_2018",
        "Porsche_956_1982",
        "Porsche_Cayenne_Turbo_S_E-Hybrid_4.0_(9Y0)_2019",
        "Bentley_Hunaudières_1999",
        "Porsche_911_GT1_race_car_1997",
        "Porsche_Cayenne_Turbo_Coupe_4.0_(9Y3)_2019",
        "Audi_R8_GT_2011",
        "Porsche_Panamera_Turbo_S_2021",
        "Mercedes-Benz_AMG_GT_4-Door_Coupe_2018",
        "BMW_M5_Competition_(delimited)_2018",
        "W_Motors_Fenyr_SuperSport_2017",
        "Audi_R8_LMX_2014",
        "Porsche_917_1970",
        "Porsche_936_1976",
        "Porsche_Taycan_Turbo_S_Cross_Turismo_2021",
        "W_Motors_Lykan_HyperSport_2014",
        "Porsche_Macan_GTS_2021",
        "Porsche_Cayenne_Turbo_2017",
        "BMW_M5_2018",
        "RUF_CTR2_1995",
        "Bentley_Continental_GT_Pikes_Peak_2019",
        "Porsche_911_Targa_4S_3.0_(992)_2020",
        "Ariel_Atom_3.5_2013",
        "Porsche_Taycan_Turbo_S_2020",
        "Ultima_Evolution_Convertible_2015",
        "Porsche_959_Dakar_1986",
        "Porsche_911_Carrera_4_3.0_(992)_2019",
        "Porsche_Panamera_4S_2021",
        "Ariel_Atom_4_2018",
        "Aston_Martin_DBS_Superleggera_2019",
        "Porsche_911_GT1_road_car_1997",
        "Saleen_S7_2000",
        "Audi_R8_Spyder_V10_2013",
        "Lancia_Delta_HF_Integrale_Evoluzione_1992",
        "Ariel_Atom_3_2008",
        "Bentley_Continental_GT_Convertible_2020",
        "Bentley_Continental_GT_Convertible_Number_1_Edition_by_Mulliner_2020",
        "Ford_RS200_Group_B_Rally_Car_1985",
        "Audi_RS_6_Avant_(delimited)_2013",
        "Lancia_Delta_HF_Integrale_16v_1990",
        "AC_Mk_VI_GTS_2015",
        "Dodge_Viper_SRT-10_ACR_2008",
        "RUF_Dakara_2009",
        "Porsche_911_GT2_2007",
        "Cadillac_CT6_2016",
        "Audi_R8_RWD_2020",
        "Porsche_Taycan_GTS_Sport_Turismo_2022",
        "Porsche_Taycan_4S_Cross_Turismo_2021",
        "Bentley_Continental_Breitling_Jet_Team_Series_Limited_Edition_2016",
        "Spyker_C8_Preliator_Spyder_2017",
        "Bentley_Continental_GT_Speed_Coupe_2015",
        "Bentley_Continental_Supersports_Convertible_2011",
        "Audi_SQ2_2019",
        "Benz_AMG_S_63_Cabriolet_2018",
        "Porsche_Taycan_4S_2020",
        "Audi_R8_4.2_quattro_2008",
        "Volkswagen_CC_2008",
        "Porsche_911_Carrera_4_3.4_(991)_2012",
        "Mercedes-Benz_E400_4Matic_CoupВ_2018",
        "Mercedes-Benz_AMG_SLS_GT_2012",
        "Porsche_Cayenne_30_9Y0_2019",
        "Porsche_Cayenne_Coupe_3.0_(9Y3)_2019",
        "RAM_RAM_Rebel_TRX_Concept_2016",
        "Mercedes-Benz_AMG_SLS_2010",
        "Audi_RS5_(B8)_2013",
        "Volvo_XC60_T8_2018",
        "MercedesAMG_GT_Roadster_2018",
        "Mercedes-Benz_CLS_400_2015",
        "Spyker_C12_La_Turbie_2006",
        "Porsche_911_GT3_RS_2004",
        "Lotus_Evora_GT_2020",
        "BMW_M6_2016",
        "Lotus_Emira_2022",
        "MercedesAMG_G_63_2018",
        "INFINITI_Emerg-E_2012",
        "Peugeot_3008_DKR_2017",
        "BMW_M6_Gran_Coupe_2013",
        "Spyker_C8_Aileron_Spyder_2010",
        "Ford_Edge_Sport_2015",
        "BMW_545i_2004",
        "Porsche_718_Cayman_S_25_982_2017",
        "Audi_RS_5_Cabriolet_2012",
        "Fiat_Abarth_124_Spider_Rally_2016",
        "Volvo_XC40_T5_2019",
        "Audi_S8_2006",
        "BMW_535i_2010",
        "Porsche_Cayenne_S_45_955_2003",
        "Porsche_911_Carrera_2016",
        "Porsche_Cayenne_3.6_(958)_2010",
        "Audi_S5_Coupe_2008",
        "Alfa_Romeo_4C_2017",
        "BMW_M5_2004",
        "BMW_M5_2012",
        "Spyker_C8_Laviolette_2001",
        "Porsche_Cayman_S_34_981_2012",
        "Porsche_Boxster_Spyder_2009",
        "BMW_520d_xDrive_2017",
        "Lancia_Delta_Integrale_Evoluzione_II_1993",
        "Audi_A6_allroad_quattro_2018",
        "BMW_535d_Touring_2009",
        "BMW_330e_2016",
        "BMW_330d_2005",
        "BMW_640i_xDrive_2014",
        "Audi_S6_Plus_C4_1997",
        "Porsche_911_Carrera_RS_2.7_1973",
        "Aston_Martin_DB9_2004",
        "Mercedes-Benz_X350d_2018",
        "BMW_335i_2008",
        "Audi_Q2_20_TDI_quattro_2018",
        "Mercedes-Benz_SL55_AMG_2002",
        "Lancia_Delta_Integrale_16v_1989",
        "BMW_123d_2007",
        "Mercedes-Benz_62_Landaulet_Maybach_2010",
        "BMW_135i_Convertible_2008",
        "Lancia_Delta_Integrale_8v_1989",
        "Hummer_H3_Dakar_2006",
        "BMW_130i_2005",
        "BMW_650i_Convertible_2012",
        "BMW_328i_1995",
        "Mercedes-Benz_AMG_SL_73_1999",
        "Ford_Ranger_Raptor_2019",
        "De_Tomaso_Bigua_1996",
        "Audi_TT_225_quattro_8N_1998",
        "Audi_TT_Roadster_32_quattro_8N_2003",
        "Saturn_Vue_2008",
        "Mercedes-Benz_E_500_1994",
        "BMW_520d_Touring_2017",
        "Ford_Fiesta_ST_2016",
        "BMW_520d_Touring_2012",
        "Lancia_Delta_HF_4WD_1986",
        "BMW_320d_Touring_2010",
        "Mercedes-Benz_GLA_220d_2015",
        "Mercedes-Benz_560_SEC_1985",
        "AC_Aceca_V8_1999",
        "Mercedes-Benz_AMG_C_43_1999",
        "Lotus_Elise_1.6_2015",
        "Mazda_Jota_MX-5_GT_2013",
        "BMW_525iX_1991",
        "Saturn_Vue_2002",
        "Mercedes-Benz_190_E_Evo_II_1990",
        "Volvo_C70_T5_2.3_2003",
        "AC_Brooklands_Ace_1993",
        "Maserati_Bora_1971",
        "Ford_Capri_Perana_1971",
        "Audi_A3_Saloon_18_TFSI_8V_2013",
        "Audi_TT_Roadster_18_TFSI_8J_2007",
        "BMW_320Si_2005",
        "Audi_100_Avant_quattro_C3_1982",
        "Ford_Fiesta_RS_turbo_1991",
        "Fiat_Abarth_Grande_Punto_2010",
        "Mercedes-Benz_300_CE24_Cabriolet_1988",
        "Hummer_H1_Alpha_Wagon_2006",
        "Mercedes-Benz_500_SL_1980",
        "Lamborghini_Urraco_P250_1973",
        "Lamborghini_Urraco_P300_1973",
        "Saturn_Sky_2007",
        "Ford_Fiesta_RS1800_1992",
        "Mercedes-Benz_190_E_2.0_1985",
        "Vauxhall_Corsa_1.4Si_1993",
        "Bristol_603S_1976",
        "BMW_730i_1986",
        "Oldsmobile_Starfire_Firenza_1978",
        "Oldsmobile_Starfire_GT_1978",
        "De_Tomaso_Daihatsu_Charade_De_Tomaso_Turbo_1983",
        "Mercedes-Benz_230_TE_Estate_1988",
        "Bristol_Zagato_406S_1959",
        "BMW_524td_1983",
        "Vauxhall_PA_Velox_1959",
        "Peugeot_203_1948",
        "Citroen_Traction_Avant_1934",
        "DS_DS_Convertible_1958",
        "Bristol_406_1958"
      ],
      changed17: [
        "Saleen_S7_Twin_Turbo_2005",
        "Mercedes-Benz_AMG_SLS_GT_2012",
        "Mercedes-Benz_AMG_SLS_2010",
        "Audi_S7_Sportback_C7_2012",
        "De_Tomaso_Pantera_Group_4_1972",
        "Jaguar_F-Type_R_Convertible_2016",
        "Mercedes-Benz_AMG_S_65_Coupe_2016",
        "Mercedes-Benz_AMG_S_63_2011",
        "Mercedes-Benz_AMG_C_55_2007",
        "Mercedes-Benz_G_500_2012",
        "Ford_Galaxy_2015",
        "Ford_Scorpio_24-valve_1991",
        "BMW_220d_Gran_Coupe_2019",
        "BMW_220i_Gran_Coupe_2019",
        "Dodge_Dakota_Laramie_4.7L_2009",
        "Mercedes-Benz_CLK_230_K_1999",
        "Mercedes-Benz_E_220_2015",
        "Citroen_C5_Tourer_3.0_L_2016",
        "Mini_Electric_Shadow_Edition_2021",
        "Nissan_Wingroad_(Y11)_2001",
        "Mercedes-Benz_280_GE_1990",
        "Mercedes-Benz_190_E_2.3-16_1984",
        "Ford_Kuga_2016",
        "Honda_Civic_CRX_Si_1983",
        "De_Tomaso_Pampero_1966",
        "Audi_S4_Cabriolet_B7_2006", 
        "Acura_RSX_2002"
      ],

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
          return 'Are you sure you want to leave?';
        };
      } else {
        window.onbeforeunload = null;
      }
    }
  },
  beforeMount() {
    
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
    let cgDontRepeatSolution = window.localStorage.getItem("cgDontRepeatSolution");
    if (cgDontRepeatSolution) {
      cgDontRepeatSolution = JSON.parse(cgDontRepeatSolution);
      this.cgDontRepeatSolution = cgDontRepeatSolution;
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
        if (x[0] === "E") {
          this.eventCurrentId = decodeURI(x.substr(1))
        }
      })
      this.$router.replace({'query': null});

    } else {
      this.changedMode();
    }

    this.handleResize();
    window.addEventListener('resize', this.handleResize);



    
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
              text: this.$t('m_deleteSuccess')
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
          msg: `Delete '${NEW.name}' time of ${car.name}?`,
          actionLabel: `Delete`,
          action: action,
          loading: false,
          classe: `D_ButtonRed`
        }
      }

      if (mutation.type == "TIME_VOTE") {
        let selectedtune = mutation.payload.car.selectedTune;
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        if (this.mode === 'cg') {
          car = vm.cgCacheCars.find(x => x.rid === mutation.payload.car.rid);
        }
        let type = mutation.payload.type
        let TRACK = mutation.payload.item;
        let timesObj = car.data[selectedtune].times;
        let upArrName = `${TRACK.id}_a${TRACK.surface}${TRACK.cond}_upList`;
        let downArrName = `${TRACK.id}_a${TRACK.surface}${TRACK.cond}_downList`;

        if (!timesObj[upArrName]) Vue.set(timesObj, upArrName, []);
        if (!timesObj[downArrName]) Vue.set(timesObj, downArrName, []);
        let upArr = timesObj[upArrName];
        let downArr = timesObj[downArrName];
        let isUnVoteUp = false;
        let isUnVoteDown = false;

        // remove from both arr
        if (upArr.includes(vm.user.username)) {
          if (type === "up") isUnVoteUp = true;
          timesObj[upArrName] = upArr.filter(x => x !== vm.user.username);
        }
        if (downArr.includes(vm.user.username)) {
          if (type === "down") isUnVoteDown = true;
          timesObj[downArrName] = downArr.filter(x => x !== vm.user.username);
        }

        if (!isUnVoteUp && !isUnVoteDown) {

          if (type === "up") {
            upArr.push(vm.user.username);
            vm.requestVote(true, false, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
          } else {
            downArr.push(vm.user.username);
            vm.requestVote(false, false, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
          }
          
        } else if (isUnVoteUp) {
          vm.requestVote(true, true, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
        } else {
          vm.requestVote(false, true, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
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
      if (this.tuneDialogCar.class === "S" || this.tuneDialogCar.class === "A") result.push("111");
      if (this.mode === 'classic' && this.showDataFromPast && this.tuneDialogCar.data) {
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
      return this.cgRoundToSave.length > 0 || this.needSave || this.cgRoundFilterToSave || this.cgRqNeedToSave;
    },
    showAnalyse() {
      if (this.mode !== 'cg') return false;
      if (!this.user || !this.user.mod) return false;
      if (this.cgNeedSave) return false;
      if (!this.cgRound) return false;
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
      if (!this.cgRound) return false;
      if (this.cgRound.reservedTo) return false;
      if (!this.cgRound.lastAnalyze) {
        return true
      }
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
      return this.downloadLoading || this.cgLoading || this.cgSaveLoading || this.cgNewLoading || this.saveLoading || this.cgBankToSaveLoading || this.cgAnalyseLoading;
    },
    eventLoadingAny() {
      return this.downloadLoading || this.eventLoading || this.eventNewLoading || this.saveLoading;
    },
    pngLabel() {
      return this.pngLoading ? this.$t("m_pleaseWait3dot") : this.$t("m_downloadPng")
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
      let notFound = [];
      let forPush = [];
      let typeOrder = ["00", "01", "c1", "10", "11", "40", "41", "20", "b0", "30", "50", "e0", "c0", "60", "d0", "70", "71"]
      tracksIds.map(x => {
        let found = this.tracksRepo.find((circuit, icir) => {
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
        if (!found) {
          notFound.push(x)
        }
      })

      forPush.sort(function(a, b) {
        if (a.itype === b.itype) {
          return a.icir - b.icir
        } else {
          return a.itype - b.itype
        }
      })
      forPush.map(x => {
        this.toggleTrack(x.code);
      })

      if (notFound.length > 0) {
        console.warn("Not found:", notFound);
      }
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
          if (!bestOption || y.irace < bestOption.irace || (y.irace <= bestOption.irace && y.icity > bestOption.icity) || (y.irace <= bestOption.irace && y.imatch > bestOption.imatch) ) {
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
      this.tuneDialogActive = false;
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
      if (mode === 'events' && (!this.user || !this.user.mod) && !this.asMod) {
        mode = 'classic';
      }

      setTimeout(() => {
        this.mode = mode;
        if (save) {
          window.localStorage.setItem('mode', mode);
        }
        this.changedMode();
      }, 100);
    },
    changedMode() {
      if (this.mode === 'events' && !this.asMod) {
        this.mode = 'classic';
      }
      if (this.mode === "classic") {
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

        this.searchFilterDialog = false;
      }
      if (this.mode === "cg") {
        this.loadChallenges();
      }
      if (this.mode === "events") {
        this.loadEvents();
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
          "Artheof": 'mod',
          "bcp_": 'mod',
          "TiagoXavi": 'mod',
          "Bigremachine": 'mod',
          "duck": 'mod',
          "HansKasai": 'mod',
          "fiero": 'mod',
          "L1ZVRD": 'mod',
          "intrx": 'mod',
          "rei348": 'mod',
          "Enginn": 'mod',
          "vel_8": 'mod',
          "TheShyDragon": 'mod',
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
          "liamcavens": 'mod'
        };
        let pUsers = res.data.find(x => x.id === 'pUsers').value;
        Object.keys( pUsers ).forEach(key => {
          pUsers[key].map(user => {
            Vue.set(vm.highlightsUsers, user, Number(key.slice(-1)));
          })
          
        })

        res.data.find(x => x.id === 'pUsers').value;
        this.lastestList = res.data.find(x => x.id === 'lastestcars').value;
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
      this.downloadDataCars();
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
    downloadDataCars() {
      this.downloadLoading = true;
      let simplifiedCars = [];

      if (this.mode === 'classic') {
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
        this.checkAnnouncement();
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
    requestVote(isUp, isDelete, rid, tune, track) {
      this.voteLoading = true;
      let params = {
        isUp,
        isDelete,
        rid,
        tune,
        track
      }

      axios.post(Vue.preUrl + "/vote", params)
      .then(res => {
        this.successVote = true;
        setTimeout(() => {
          this.successVote = false;
        }, 1000);
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
        this.voteLoading = false;
      });

    },
    applyNewData(newData, isCgInitial = false) {
      let obj = "carDetailsList";

      if (this.mode === 'cg') {
        obj = "cgCacheCars";
      }

      this[obj].map(x => {
        newData.map(y => {
          if (x.rid === y.rid) {
            if (y.data) Vue.set(x, "data", y.data);
            if (y.users) Vue.set(x, "users", y.users);
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
      if (this.mode === 'cg') boxName = ".Cg_Layout";

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
            text: isDelete ? this.$t('m_deleteSuccess') : this.$t('m_approveSuccess')
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
    loadChallengeFull(date, round) {
      this.cgLoading = true;
      this.cgSeletorDialog = false;
      this.cgSentForReview = false;

      axios.post(Vue.preUrl + "/getCgById", {
        date: date
      })
      .then(res => {
        let cg = this.cgList.find(x => x.date === date)
        if (cg.date === res.data.date) {
          Vue.set(cg, "rounds", res.data.rounds);
          this.loadCg(date, round);
        }
        // this.lookForChangedCars(res.data);
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
        this.cgLoading = false;
      });
    },
    loadCg(id, round) {
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
      this.cgCurrentRound = round;
      this.cgRound = cg.rounds[this.cgCurrentRound];
      if (this.cgRound.filter && this.cgRound.filter.yearModel && this.cgRound.filter.yearModel[0] === 1930) {
        // past default date
        this.cgRound.filter.yearModel[0] = 1910;
      }
      this.cgRoundsNumber = cg.rounds.length;
      this.generateUrl();

      if (this.cgRound.toApprove && this.user && this.user.mod) {
        this.cgIsApproving = true;
        this.cgRound = this.cgRound.toApprove;
      } else {
        this.cgIsApproving = false;
      }

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
      this.downloadDataCars();

      this.cgResolveFilter();
      this.cgUpdateLocalStorage();
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
            if (!bestOption || y.irace < bestOption.irace || (y.irace <= bestOption.irace && y.icity > bestOption.icity) ) {
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
      
      this.cgRoundToSave.push({
        type: "oppoCar",
        rid: car.rid,
        tune: tune,
        raceIndex: this.cgRound.races.indexOf(race)
      })
      this.calcRaceResult(race);
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
        return;
      }

      let oppo = this.cgCacheCars.find(x => x.rid === race.car.rid)
      let tryoppotime;
      try {
        tryoppotime = oppo.data[race.car.selectedTune].times[race.track]
      } catch (error) {
        // nada
      }
      if (tryoppotime || tryoppotime === 0) race.time = tryoppotime;


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
      if (race.track.includes("testBowl")) {
        if (oppotime > youtime) points = -50;
        if (oppotime < youtime) points = 50;
      } else {
        if ((oppotime > youtime && youtime > 0) || (oppotime === 0 && youtime > 0)) points = 50;
        else if ((oppotime < youtime && oppotime !== 0) || (youtime === 0 && oppotime > 0) ) points = -50;
      }
      let origPoints = race.cars[race.carIndex].points;
      if (typeof origPoints === 'number' && origPoints !== points) {
        if (points === 50 && origPoints > 50) points = origPoints;
        if (points === -50 && origPoints < -50) points = origPoints;
      }

      if (!this.downloadLoading && origPoints !== points) {
        this.cgResolveBankToSave("add", irace, youRid, youTune, points);
      }
      Vue.set(race.cars[race.carIndex], "points", points);
      
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
        race.carIndex = index; this.calcRaceResult(race);
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
            text: this.$t('m_deleteSuccess')
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
        msg: `Delete '${race.resolvedTracks[0].name}' time of ${car.name}?`,
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
      this.loadCg(this.cgCurrentId, this.cgCurrentRound-1)
    },
    loadNextRound() {
      this.cgSentForReview = false;
      this.forceShowAnalyse = false;
      this.loadCg(this.cgCurrentId, this.cgCurrentRound+1)
    },
    cgOpenNewCg() {
      this.cgClearSaveNewCg();
      this.computeTemplateToSave();
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
      if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
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
      if (!points) return;
      if (race.cars[race.carIndex].pointsUser && race.cars[race.carIndex].pointsUser !== this.user.username) {
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

      this.cgPointsEditDialog = true;
      this.cgPointsEditModel = `${points}`;
      this.cgPointsEditString = `${points}`;
      this.cgPointsEditRace = race;
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
        if (Number(this.cgPointsEditString) > 0 && points <= 0) {
          return;
        }
        if (Number(this.cgPointsEditString) < 0 && points >= 0) {
          return;
        }
        if (points > 999 || points < -999) {
          return;
        }

        let raceIndex = this.cgRound.races.indexOf(race);
        let rid = race.cars[race.carIndex].rid;
        let tune = race.cars[race.carIndex].tune;
        let arrayToSave = [{ type: "add", raceIndex, rid, tune, points, round: this.cgCurrentRound, date: this.cg.date }];
        this.cgSaveBank(arrayToSave);

        Vue.set(race.cars[race.carIndex], "points", points);
        Vue.set(race.cars[race.carIndex], "pointsUser", this.user.username);
        
      }
    },
    cgAnalyseRound() {
      let rqMax = Math.floor(Math.pow( this.cgRound.rqLimit/5, 1.3 ));
      let rqMin = Math.floor(Math.pow( this.cgRound.rqLimit/5, 0.7 ));
      this.$store.commit("CG_EMIT_RIDS", { rqMax, rqMin });
    },
    cgAnalyseRoundFinish(listOfRids) {

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

      this.cgIsFiltering = false;
      this.cgAnalyseLoading = true;

      axios.post(Vue.preUrl + "/analyseRound", {
        date: this.cgCurrentId,
        round: this.cgCurrentRound,
        rids: listOfRids,
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
    styleCgList() {
      this.cgList.sort((a,b) => {
        return a.name.localeCompare(b.name);
      })
      this.cgList.map(x => {
        let styl = x.name;
        Vue.set(x, "index", 0);
        if (x.name.substr(0, 11) === 'Yellowbird ') {
          Vue.set(x, "index", 1);
          styl = `<span class="Cg_YB">Yellowbird </span>${x.name.substr(11)}`
        }
        if (x.name.substr(0, 14) === 'Skyline Nismo ') {
          Vue.set(x, "index", 2);
          styl = `<span class="Cg_SN">Skyline Nismo </span>${x.name.substr(14)}`
        }
        if (x.name.substr(0, 14) === 'Expo Campaign ') {
          Vue.set(x, "index", 3);
          styl = `<span class="Cg_EX">Expo Campaign </span>${x.name.substr(14)}`
        }
        if (x.name.substr(0, 17) === 'Proving Grounds: ') {
          Vue.set(x, "index", 4);
          styl = `<span class="Cg_PG">Proving Grounds: </span>${x.name.substr(17)}`
        }
        Vue.set(x, "nameStyled", styl);
      })

      let roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
      this.cgList.map(x => {
        let split = x.name.split(" ");
        if ( roman.includes(split[split.length-1]) ) {
          // contain roman
          x.romanValue = roman.indexOf(split[split.length-1])+1;
        }
      })
      
      this.cgList.sort((a,b) => {
        if (a.romanValue && b.romanValue && a.name.split(" ")[0] === b.name.split(" ")[0]) {
          return a.romanValue - b.romanValue;
        }
        return a.index - b.index;
      })
    },
    loadEvents(resolveInitial = true) {
      this.eventLoading = true;

      axios.get(Vue.preUrl + "/searchEvents")
      .then(res => {
        this.eventList = res.data.Items;
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
    loadEventFull(date) {
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

      this.event = event;
      this.eventCurrentId = event.date;
      this.eventCurrentName = event.name;

      this.event.perfectHand.map(group => {
        group.map(x => {
          let found = this.all_cars.find(y => y.rid === x.rid);
          if (found) {
            Vue.set(x, "car", JSON.parse(JSON.stringify(found)));
            Vue.set(x, "photo", this.cgResolvePhotoUrl(x.rid));
            Vue.set(x, "color", Vue.resolveClass(x.car.rq, x.car.class, "color"));
          }
        })
      })

      let resolvedTrackset = JSON.parse(JSON.stringify(this.event.trackset));

      resolvedTrackset = resolvedTrackset.map(trackset => {
        return trackset.map(track => {
          return [this.resolveTrack({ track }, false, false)];
        })
      })
      Vue.set(this.event, "resolvedTrackset", resolvedTrackset);

      this.eventUpdateLocalStorage();

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
    eventOpenRqEdit() {

    },
    eventCloseRqEdit() {
      this.eventRqEditDialog = false;
      if (this.eventRqEditModel !== this.eventRqEditString) {
        this.eventRound.rqLimit = Number(this.eventRqEditModel);
        this.eventRqNeedToSave = true;
      } else {
        this.eventRqNeedToSave = false;
      }
    },
    eventOpenNewEvent() {
      this.eventClearSaveNewEvent();
      this.computeTemplateToSave();
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
      return;
      this.eventNewLoading = true;

      axios.post(Vue.preUrl + "/newCg", {
        name: this.eventNewName
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
    eventInspectCar(car, igroup, icar) {

    },
    eventAddCar(igroup, icar) {

    },
    eventEditComp(igroup) {

    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      let vw = document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--vw', `${vw}px`);
      let vh = document.documentElement.clientHeight;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
    checkAnnouncement() {
      // if (window.localStorage.getItem("lastCg")) return;
      // if (window.localStorage.getItem("announce1")) return;
      // if (this.mode === 'cg') return;
      // let dt = window.localStorage.getItem("_dt");
      // if (dt) {
      //   dt = Number(dt) + (60*60*1000) > new Date().getTime()
      // }
      // if (dt) return;

      // window.localStorage.setItem('announce1', "t");
      // this.announcementDialog = true;
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
      data.rounds.map((round, iround) => {
        round.races.map((race, irace) => {
          if (this.changed17.includes(race.rid)) {
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
      this.$store.commit("KING_EMIT_RIDS", {});
    },
    kingAnalyseFinish(listOfRids) {
      this.kingLoading = true;
      this.$store.commit("START_LOGROCKET", {});
      if (this.kingFixed) this.downloadLoading = true;

      axios.post(Vue.preUrl + "/king", {
        rids: listOfRids,
        track: this.kingTrack.code,
        includeDownvotes: this.kingShowDownvoted
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
  overscroll-behavior-block: contain;
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
.D_Button.Main_SaveAllButton {
  --back-color: 49, 141, 8;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 0.7);
  color: white;
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_Button.Main_LoginToEdit {
  --back-color: 44, 37, 16;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 1);
  color: rgb(var(--d-text-yellow));
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_Button.Main_Share {
  background-color: rgba(0,0,0,0.2);
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
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
}
.Main_CustomTrackItem .Type_00 {
  --type-back-opac: 0.07;
  background-color: rgba(255,255,255, var(--type-back-opac));
}
.Type_01,
.Type_c1 {
  color: rgb(var(--color-wet));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-wet), var(--type-back-opac));
}
.Type_10,
.Type_11,
.Type_40,
.Type_41 {
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
.Type_d0 {
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
  /* position: absolute; */
  /* position: fixed; */
  /* top: var(--top-height); */
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  z-index: 1;
  /* width: var(--left-width); */
  white-space: nowrap;
  box-sizing: border-box;
  /* border-top-width: 0;
  border-left-width: 0; */
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  transition-property: set;
  /* box-shadow: inset 0px -2px 0px 0px #ffffff07, inset -2px 0px 0px 0px #ffffff07; */
  /* border-bottom-color: #5a5a5a; */
  justify-content: center;
  /* height: calc(var(--cell-height) * 1.3); */
  /* border-right-width: 0; */
  /* width: 120px; */
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
  margin-top: var(--top-height);
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
  display: block;
}
.Cg_SelectTrackButtonIcon {

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
  --cor: rgb(var(--d-text-red));
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
.Event_BankPhoto {
  margin-right: 7px;
}
.Event_BankClass {
  margin-right: 5px;
}
.Cg_Header {
  position: fixed;
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
  opacity: 0.3;
  font-size: 0.6em;
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
  margin-bottom: 30px;
  margin-top: 5px;
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
.Main_Compact .Car_Header:not(.Car_AddHeader):not(.Row_DialogCardCard) > *:not(.Car_HeaderName):not(.Car_HeaderBlockRQ):not(.Car_HeaderBlockClass):not(.Car_HeaderBlockTopSpeed):not(.Car_HeaderBlock060):not(.Car_HeaderBlockHandling):not(.Car_HeaderBlockDrive):not(.Car_CompactOverlay):not(.Car_HeaderBlockPrize) {
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
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankClass {
    display: none;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_BankTune {
    color: var(--cor);
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_Divider {
    --size: 30px;
  }
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsRed,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsGreen,
  .Main_Layout > *:not(.Main_BodyPrint) .Cg_PointsGrey {
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