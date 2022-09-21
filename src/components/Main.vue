<template>
  <div :class="{
      Main_Normal: !inverted,
      Main_2: inverted,
      Main_Compact: compact,
      Main_ColorsFull: fullColors,
      Main_ColorsMedal: !fullColors
    }" class="Main_Layout" @click.stop="outsideClick()">
    <div :class="{ Main_BodyEmpty: carDetailsList.length === 0 }" class="Main_Body" @click.stop="outsideClick()">
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
          <button v-if="carDetailsList.length > 0 && currentTracks.length > 0" class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="shareDialog = true; generateUrl()">
            <i class="ticon-camera1 Main_MenuIcon" aria-hidden="true"/>
          </button>
        </div>
        <div v-if="user && inverted" class="Main_PrintBy">
          <div class="Main_PrintByLabel">print by</div>
          <div class="Main_PrintByUser">{{ user.username }}</div>
        </div>
        <div class="Main_GamePrintInfo">
          <div class="Main_GameVersionText">{{ gameVersion }}</div>
        </div>
        <div class="Main_RowCornerBox">
          
          <div v-if="carDetailsList.length > 0 && currentTracks.length > 0" class="Main_RowCorner">
            <template v-if="!user">
              <div class="Main_SaveAllBox">
                <button
                  class="D_Button Main_LoginToEdit"
                  @click="$router.push({ name: 'Login' })">Login</button>
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
                  @click="saveAll()">Save</button>
              </div>
            </template>
            <div v-if="user && !inverted" class="Main_PrintBy">
              <div class="Main_PrintByLabel">print by</div>
              <div class="Main_PrintByUser">{{ user.username }}</div>
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
            @newindex="newIndex($event, false, true)">
          </Row>
          <div v-if="smartCampaign.length > 0" class="Row_ShowMoreTracks">
            <button
              class="D_Button D_ButtonLink Row_ShowMoreButton"
              @click="campaignDialog = true;">Campaign guide</button>
          </div>
        </div>
        <div v-if="user && !inverted" class="Main_UserBottom">

          <div class="Main_UserCard">
            <BaseAvatar :user="user" size="46px" />
            <div class="Main_UserBlock">
              <div style="color: var(--d-text-b);" class="Main_UserName">{{ user.username }}</div>
              <button style="font-size: 16px;" class="D_Button D_ButtonLink Main_UserLogout" @click="logout()">Logout</button>
            </div>
          </div>

        </div>
      </div>
      <div v-if="carDetailsList.length > 0" class="Main_Mid">
        <div v-if="showCarsFix" class="Main_CarList" @click.stop @mouseleave="hoverIndex = -1">
          <template v-for="(car, carIx) in carDetailsList">
            <Car
              :car="car"
              :index="carIx"
              :lastIndex="carDetailsList.length - 1"
              :trackList="currentTracks"
              :highlights="highlights[carIx]"
              :hoverIndex="hoverIndex"
              :maxCarNumber="maxCarNumber"
              :loggedin="!!user"
              :user="user"
              :downloadLoading="downloadLoading"
              :key="carIx"
              :voteLoading="voteLoading"
              @delete="deleteCar(carIx)"
              @moreTracks="moreTracksCar($event)"
              @newindex="newIndex($event)" />
          </template>
          <Car
            v-if="carDetailsList.length < maxCarNumber"
            index="addCar"
            class="Car_LayoutAddCar"
            :car="null"
            :maxCarNumber="maxCarNumber"
            @add="openDialogSearch()" />
        </div>
        
        <div class="Main_PrintCreditsBottom" :style="`--number-cars: ${carDetailsList.length}; --number-tracks: ${currentTracks.length}`">
          <span style="color: rgb(var(--d-text-yellow)); margin-right: 3px;">Contributors: </span>{{ contributorsScreen }}
        </div>
      </div>
      <div v-else class="Main_MidEmpty">
        <div class="Main_MidEmptyInner">
          <div class="Main_MidEmptyItem Main_MidEmptyItemAdd">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButtonSearch"
              @click="openDialogGallery()">
              <i class="ticon-dash Main_EmptyAddIcon" aria-hidden="true"/>
              <div class="Main_EmptyAdd">Library</div>
            </button>
          </div>
          <div class="Main_MidEmptyItem Main_MidEmptyItemAdd">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButtonSearch"
              @click="openDialogSearch()">
              <i class="ticon-plus_2 Main_EmptyAddIcon" aria-hidden="true"/>
              <div class="Main_EmptyAdd">Search car</div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <BaseDialog
      :active="searchActive"
      :transparent="true"
      maxWidth="880px"
      @close="closeDialogSearch()">
      <div class="Main_SearchBody">
        <div class="Main_SearchHeader">
          <div v-if="!isFiltering" class="Main_SearchFieldBox">
            <input
              v-model="searchInput"
              id="SearchInput"
              placeholder="Search"
              class="Main_SearchInput data-hj-allow"
              type="text"
              @focus="searchFocus = true;"
              @blur="searchBlur()"
              @input="searchInputFunc($event)">
            <button
              v-if="searchInput && searchInput.length > 0 || alreadySearched"
              class="D_Button Main_SearchInputClose"
              @click="closeFilterText()">
              <i class="ticon-close_2" aria-hidden="true"/>
            </button>
          </div>
          <button
            v-if="!isFiltering"
            class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
            @click="isFiltering = !isFiltering;">Filters<span v-if="filterCount > 0" class="Main_FiltersButtonCount">{{ filterCount }}</span></button>
          <button
            v-else
            class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
            @click="applyFilter()">Done</button>
        </div>
        <div v-if="isFiltering" class="Main_SearchMid">
          <div class="Main_FilterItems">
            <div class="Main_FilterClearTop">
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
                @click="clearFilter()">Clear</button>
            </div>
            <div class="Main_FilterChips Main_FilterClassChips">
              <template v-for="(item, ix) in searchFilters.classes">
                <BaseChip
                  class="Main_ClassChip"
                  activeClass="Main_ClassChipActive"
                  :style="`--classC: ${searchFilters.classesColors[ix]}`"
                  v-model="searchFilters.classesModel"
                  :value="item" />
              </template>
            </div>
            <BaseDualSlider
              v-model="searchFilters.rqModel"
              :min="searchFilters.rqStart"
              :max="searchFilters.rqEnd"
              label="RQ"
              class="Main_FilterSlider" />
            <BaseDualSlider
              v-model="searchFilters.yearModel"
              :min="searchFilters.yearStart"
              :max="searchFilters.yearEnd"
              label="Year"
              class="Main_FilterSlider" />
            <div class="Main_FilterThree">
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.tyres">
                  <BaseChip
                    v-model="searchFilters.tyresModel"
                    class="BaseChip_MinWidth"
                    :value="item">{{ item | convertTires }}</BaseChip>
                </template>

              </div>
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.drives">
                  <BaseChip
                    v-model="searchFilters.drivesModel"
                    class="BaseChip_MinWidth"
                    :value="item" />
                </template>

              </div>
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.clearances">
                  <BaseChip
                    v-model="searchFilters.clearancesModel"
                    class="BaseChip_MinWidth"
                    :value="item">{{ item.toUpperCase() }}</BaseChip>
                </template>

              </div>
            </div>
            <div class="Main_FilterDual">
              <BaseDualSlider
                v-model="searchFilters.topSpeedModel"
                :min="searchFilters.topSpeedStart"
                :max="searchFilters.topSpeedEnd"
                label="Top Speed"
                class="Main_FilterSlider" />
              <BaseDualSlider
                v-model="searchFilters.acelModel"
                :min="searchFilters.acelStart"
                :max="searchFilters.acelEnd"
                :step="0.1"
                label="0-60mph"
                class="Main_FilterSlider" />
            </div>
            <div class="Main_FilterDual">
              <BaseDualSlider
                v-model="searchFilters.handModel"
                :min="searchFilters.handStart"
                :max="searchFilters.handEnd"
                label="Handling"
                class="Main_FilterSlider" />
              <BaseDualSlider
                v-model="searchFilters.mraModel"
                :min="searchFilters.mraStart"
                :max="searchFilters.mraEnd"
                label="MRA"
                class="Main_FilterSlider" />
            </div>
            <BaseDualSlider
              v-model="searchFilters.weightModel"
              :min="searchFilters.weightStart"
              :max="searchFilters.weightEnd"
              label="Weight"
              class="Main_FilterSlider" />
            <div class="Main_FilterChips2">
              <template v-for="(item, ix) in searchFilters.countrys">
                <BaseChip
                  v-model="searchFilters.countrysModel"
                  class="BaseChip_ChipFlag"
                  :value="item" >
                  <BaseFlag :flag="item" />
                </BaseChip>
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags">
                <BaseChip
                  v-model="searchFilters.tagsModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.brands">
                <BaseChip
                  v-model="searchFilters.brandsModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="D_Center" style="gap: 15px;">
              <button
                class="D_Button D_ButtonDark D_ButtonDarkTransparent D_ButtonBig"
                @click="clearFilter()">Clear</button>
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
                @click="applyFilter()">Done</button>
            </div>
          </div>
        </div>
        <div v-else-if="searchResult.length > 0" class="Main_SearchMid">
          <div v-if="showingLastest" class="Main_SearchLastestTitle">Last contributions</div>
          <template v-for="(item, index) in searchResult">
            <button
              v-if="index < searchMax || showAllFilter"
              :style="{ '--color': item.classColor }"
              :class="{ Main_SearchItemAdded: item.added }"
              class="Main_SearchItem"
              @click="item.added ? '' : addCar(index)">
              <div v-if="!showAllFilter" class="Main_SearchItemImg">
                <img :src="item.ridPhoto" class="MainGallery_Img" alt="">
              </div>
              <div v-else class="Main_ImgPlaceholder"></div>
              <div class="Main_SearchItemLeft">{{ item.class }}{{ item.rq }}</div>
              <div class="Main_SearchItemRight">
                <span v-html="item.locatedName" />&nbsp;<span class="Main_SearchItemYear">{{ item.year }}</span>&nbsp;<span v-if="item.lastestUser" class="Main_SearchResultUser">by {{ item.lastestUser }}</span><span v-else-if="item.mra" class="Main_SearchItemYear">{{ item.mra }}</span>
              </div>
            </button>
          </template>
          <div v-if="!showAllFilter">
            <template v-if="searchMax > 200">
              <div class="Main_FilterMaxReached">Showing only 200 cars</div>
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 Main_SearchMore"
                @click="changeFilter(true)">Show all (slow)</button>
            </template>
            <button
              v-else-if="searchResult.length > searchMax"
              class="D_Button D_ButtonDark D_ButtonDark2 Main_SearchMore"
              @click="searchMax = searchMax + 41">Show more</button>
          </div>
        </div>
        <div v-else-if="alreadySearched" class="Main_SearchEmpty">
          <i class="ticon-search_big Main_SearchEmptyAddIcon" aria-hidden="true"/>
          <div class="Main_SearchEmptyText">Nothing found</div>
        </div>
        <div v-else class="Main_SearchEmpty">
          <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="customTrackDialog"
      :transparent="false"
      :isStatic="true"
      :forceScroll="true"
      max-width="500px"
      min-width="240px"
      @close="closeDialogTrackSearch()">
      <div class="Main_TracksDialog">
        <div class="Main_AllTracksBox">
          <div class="Track_SearchBox">
            <input
              v-model="searchTracks"
              id="SearchTrackInput"
              placeholder="Search tracks"
              class="Track_SearchInput data-hj-allow"
              type="text" />
            <button
              v-if="searchTracks && searchTracks.length > 0"
              class="D_Button Main_TrackSearchInputClose"
              @click="searchTracks = ''">
              <i class="ticon-close_2" aria-hidden="true"/>
            </button>
          </div>
          <div
            v-for="(circuit, index) in filteredTracks"
            class="Main_CustomTrackItem" :key="index">
            <div class="Main_CustomTrackLeft">
              <div class="Main_CustomTrackName">{{ circuit.name }}</div>
            </div>
            <div class="Main_CustomTrackRight">
              <template>
                <BaseTrackType
                  :circuit="circuit"
                  @toggleTrack="toggleTrack($event)" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
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
                :disabled="tuneDialogCarIndex === 0"
                class="D_Button Row_DialogButtonTune"
                @click="newIndex({ current: tuneDialogCarIndex, new: tuneDialogCarIndex-1 }, true)">
                <i class="ticon-arrow_left_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
              </button>
              <button
                :disabled="tuneDialogCarIndex >= carDetailsList.length - 1"
                class="D_Button Row_DialogButtonTune"
                @click="newIndex({ current: tuneDialogCarIndex, new: tuneDialogCarIndex+1 }, true)">
                <i class="ticon-arrow_right_3 Row_ConfigIcon Row_OrderIcon" aria-hidden="true"/>
              </button>
              <button
                class="D_Button Row_DialogButtonTune Row_DialogButtonClose"
                @click="deleteCar(tuneDialogCarIndex)">
                <i class="ticon-trash Row_ConfigIconTrash" aria-hidden="true"/>
              </button>
            </div>
          </div>
          <div class="Row_DialogHeader">
            <button
              v-for="item in tuneDialogTunes"
              :class="{ Row_DialogButtonTuneActive: tuneDialogCar.selectedTune === item }"
              class="D_Button Row_DialogButtonTune"
              @click="changeTuneCar(tuneDialogCar, item)">{{ item }}</button>
          </div>
          <div class="Row_DialogBody Space_TopPlus">
            <div class="Row_DialogCard">
              <div class="Row_DialogCardLeft">
                <BaseCard
                  :car="tuneDialogCar"
                  :options="false" />
              </div>
              <div class="Row_DialogCardRight">
                <BaseText
                  :value="(((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).topSpeed"
                  :disabled="!tuneDialogCar.selectedTune ||
                             !user ||
                             ( (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {}).topSpeed ?
                             (((tuneDialogCar.data || {})[tuneDialogCar.selectedTune] || {}).info || {})[`topSpeed_user`] !== user.username ? user.mod ? false : true : false : false )"
                  type="topSpeed"
                  label="Top speed"
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
                  label="Handling"
                  class="Row_FieldStat"
                  placeholder="-"
                  @change="changeStatCar(tuneDialogCar, 'hand', $event)" />
              </div>
            </div>
          </div>
          <div class="Row_DialogCardDual Space_TopPlus">
            <div class="Row_DialogCardBottom">
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">ABS</div>
                <div :class="{ Row_DialogCardStatCorrect: tuneDialogCar.abs }" class="Row_DialogCardStatValue">{{ tuneDialogCar.abs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">TCS</div>
                <div :class="{ Row_DialogCardStatCorrect: tuneDialogCar.tcs }" class="Row_DialogCardStatValue">{{ tuneDialogCar.tcs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">Clearance</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.clearance }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">MRA (stock)</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.mra }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">Weight (stock)</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.weight }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">Tags</div>
                <div v-if="tuneDialogCar.tags && tuneDialogCar.tags.length > 0" class="Row_DialogCardStatValue Row_DialogCardStatTags">{{ tuneDialogCar.tags.join(", ") }}</div>
                <div v-else class="Row_DialogCardStatValue">-</div>
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
              <div class="Row_DialogCardStatLabel">Contributors</div>
              <div class="Row_DialogCardStatValue" style="font-size: 0.9em;">{{ tuneDialogCar.users.join(", ") }}</div>
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
            <div class="Main_DialogTitle">Image</div>
            <div class="Main_ShareDownloadBox">
              <button
                style="font-size: 16px;"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="sharePrint()">
                <i class="ticon-download D_ButtonIcon" aria-hidden="true"/>
                <span>Download PNG</span>
              </button>
            </div>
          </div>
          <div v-if="user && currentTracks.length > 0 && carDetailsList.length > 1" class="Main_">
            <div class="Main_DialogTitle">Library</div>
            <div class="Main_ShareDownloadBox">
              <button
                style="font-size: 16px;"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="openSaveToGalleryDialog()">
                <i class="ticon-dash D_ButtonIcon" aria-hidden="true"/>
                <span>Add to library</span>
              </button>
            </div>
          </div>
        </div>
        <div class="Main_DialogTitle">Shareable link</div>
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
            @click="copyUrl()">Copy</button>
        </div>
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
            label="Title"
            placeholder="" />
        </div>
        <div class="Main_SaveGalleryBox">
          <div class="Main_OptionsLabel">Type</div>
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
            <div class="Main_OptionsLabel">Classes</div>
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
            <div class="Main_OptionsLabel">Years</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.minyear }} ~ {{ saveToGalleryModel.maxyear }}</div>
          </div>
        </div>

        <div v-if="saveToGalleryModel.tyre.length < 4" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_tyre"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">Tyres</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.tyre.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.drive.length < 3" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_drive"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">Drives</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.drive.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.clearance.length < 3" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_clearance"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">Clearances</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.clearance.join(", ") }}</div>
          </div>
        </div>

        <div v-if="saveToGalleryModel.country.length < 4" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_country"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">Countries</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.country.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.tag.length > 0" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_tag"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">Tags</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.tag.join(", ") }}</div>
          </div>
        </div>
        <div v-if="saveToGalleryModel.brand.length < 4" class="Main_SaveGalleryBoxCheck">
          <div class="Main_SaveGalleryCheckLeft">
            <BaseCheckBox
              v-model="saveToGalleryModel.save_brand"/>
          </div>
          <div class="Main_SaveGalleryCheckRight">
            <div class="Main_OptionsLabel">Brands</div>
            <div class="Main_SaveGalleryCheckRightValue">{{ saveToGalleryModel.brand.join(", ") }}</div>
          </div>
        </div>

        
        <button
          :class="{ D_Button_Loading: saveToGalleryLoading, D_Button_Error: saveToGalleryError }"
          :disabled="saveToGalleryLoading || saveToGalleryError"
          class="D_Button Main_SaveAllButton"
          @click="saveToGallery()">Save to library</button>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="galleryDialog"
      :transparent="true"
      maxWidth="880px"
      @close="closeDialogGallery()">
      <div class="Main_GalleryDialog">

        <div class="Main_SearchHeader">
          <div v-if="!isFilteringT" class="Main_SearchFieldBox">
            <input
              v-model="searchInputT"
              id="GalleryInput"
              placeholder="Search"
              class="Main_SearchInput data-hj-allow"
              type="text"
              @input="searchInputFuncT($event)">
            <button
              v-if="searchInputT && searchInputT.length > 0 || alreadySearched"
              class="D_Button Main_SearchInputClose"
              @click="closeFilterText()">
              <i class="ticon-close_2" aria-hidden="true"/>
            </button>
          </div>
          <button
            v-if="!isFilteringT"
            class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
            @click="isFilteringT = !isFilteringT;">Filters<span v-if="filterCountT > 0" class="Main_FiltersButtonCount">{{ filterCountT }}</span></button>
          <button
            v-else
            class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
            @click="applyFilterT()">Done</button>
        </div>
        <div v-if="isFilteringT" class="Main_SearchMid Main_SearchMidT">
          <div class="Main_FilterItems">
            <div class="Main_FilterClearTop">
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
                @click="clearFilter(true)">Clear</button>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in saveToGalleryModel.types">
                <BaseChip
                  v-model="galleryFilters.typesModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChips Main_FilterClassChips">
              <template v-for="(item, ix) in searchFilters.classes">
                <BaseChip
                  class="Main_ClassChip"
                  activeClass="Main_ClassChipActive"
                  :style="`--classC: ${searchFilters.classesColors[ix]}`"
                  v-model="galleryFilters.classesModel"
                  :value="item" />
              </template>
            </div>
            <BaseDualSlider
              v-model="galleryFilters.rqModel"
              :min="searchFilters.rqStart"
              :max="searchFilters.rqEnd"
              label="RQ"
              class="Main_FilterSlider" />
            <BaseDualSlider
              v-model="galleryFilters.yearModel"
              :min="searchFilters.yearStart"
              :max="searchFilters.yearEnd"
              label="Year"
              class="Main_FilterSlider" />
            <div class="Main_FilterThree">
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.tyres">
                  <BaseChip
                    v-model="galleryFilters.tyresModel"
                    class="BaseChip_MinWidth"
                    :value="item">{{ item | convertTires }}</BaseChip>
                </template>

              </div>
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.drives">
                  <BaseChip
                    v-model="galleryFilters.drivesModel"
                    class="BaseChip_MinWidth"
                    :value="item" />
                </template>

              </div>
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.clearances">
                  <BaseChip
                    v-model="galleryFilters.clearancesModel"
                    class="BaseChip_MinWidth"
                    :value="item">{{ item.toUpperCase() }}</BaseChip>
                </template>

              </div>
            </div>
            <div class="Main_FilterChips2">
              <template v-for="(item, ix) in searchFilters.countrys">
                <BaseChip
                  v-model="galleryFilters.countrysModel"
                  class="BaseChip_ChipFlag"
                  :value="item" >
                  <BaseFlag :flag="item" />
                </BaseChip>
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags">
                <BaseChip
                  v-model="galleryFilters.tagsModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.brands">
                <BaseChip
                  v-model="galleryFilters.brandsModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="D_Center" style="gap: 15px;">
              <button
                class="D_Button D_ButtonDark D_ButtonDarkTransparent D_ButtonBig"
                @click="clearFilter(true)">Clear</button>
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
                @click="applyFilterT()">Done</button>
            </div>
          </div>
        </div>

        <div v-else-if="searchLoadingT" class="Main_SearchMid Main_SearchMidT">
          <BaseContentLoader
            :contents="true"
            itemWidth="220px"
            :itemHeight="210"
            style="padding: 10px 10px 10px 20px; width: 100%;"
            type="block"
            count="6" />
        </div>

        <div v-else-if="searchResult.length > 0" class="Main_SearchMid Main_SearchMidT">
          <BaseGalleryItem
            v-for="item in galleryList"
            :config="item"
            :showDelete="user && (item.user === user.username || user.mod)"
            @delete="deleteTemplate($event)"
            @push="decodeTemplateString($event, true); closeDialogGallery();" />
          <div v-if="galleryLastKey" class="D_Center" style="width: 100%">
            <button
              :class="`${ searchLoadingT2 ? 'D_Button_Loading ' : '' }`"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
              @click="changeFilterT(galleryLastKey)">Show more</button>
          </div>

          

        </div>


        
      </div>
    </BaseDialog>
    <BaseDialog
      :active="optionsDialogActive"
      :transparent="false"
      max-width="460px"
      @close="updateOptions()">
      <div class="Main_OptionsDialog">
        <div v-if="user" class="Main_OptionsItem" style="display: flex;justify-content: center;">
          <div class="Main_UserCard">
            <BaseAvatar :user="user" size="46px" />
            <div class="Main_UserBlock">
              <div style="color: var(--d-text-b);" class="Main_UserName">
                <span class="Main_UserNameLabel">{{ user.username }}</span>
                <span v-if="user.mod" class="Main_UserMod">mod</span>
              </div>
              <button style="font-size: 16px;" class="D_Button D_ButtonLink Main_UserLogout" @click="logout()">Logout</button>
            </div>
          </div>
        </div>
        <div v-else class="Main_OptionsItem Main_OptionsLogout">
          <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2" @click="$router.push({ name: 'Login' })">Login</button>
          <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2" @click="$router.push({ name: 'Register' })">Register</button>
        </div>
        <div v-if="!needSave" class="Main_OptionsItem">
          <div class="Main_OptionsLabel MainClearLabelBox">
            <span>Trackset</span>
            <div class="Main_ClearButtonsBox">
              <button
                class="D_Button Main_OptionsButton Main_OptionsButtonClear"
                @click="clearAllTracks()">Clear</button>
              <button
                class="D_Button Main_OptionsButton Main_OptionsButtonClear"
                @click="clearAllCars()">Clear cars</button>
            </div>
          </div>
          <div class="Main_OptionsTrackset">
            <div
              v-for="(item, index) in tracksButtons"
              class="Main_CustomTrackItem" :key="index">
              <div class="Main_CustomTrackLeft">
                <div class="Main_CustomTrackName">{{ item.name }}</div>
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
              @click="openDialogTrackSearch()">More...</button>
          </div>
        </div>
        <div v-else-if="!!user && needSave" class="Main_OptionsSaveData">
          <button
            :class="{ D_Button_Loading: saveLoading }"
            class="D_Button Main_SaveAllButton"
            @click="saveAll()">Save</button>
        </div>
        <div class="Main_OptionsDual">
          <div class="Main_OptionsItem">
            <div class="Main_OptionsLabel">Display</div>
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
            <div class="Main_OptionsLabel">Colors</div>
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
        <div class="Main_OptionsMemory">
          <div class="Main_MemoryLine">
            <span class="Main_MemoryLabel">{{ memory.find(x => typeof x === 'string') ? 'Load' : 'Memory' }}</span>
            <button
              v-for="(m, index) in memory"
              :disabled="m === null"
              class="D_Button Main_OptionsButton"
              @click="loadMemory(index, $event)">
              <span>{{ index+1 }}</span>
            </button>
          </div>
          <div class="Main_MemoryLine">
            <span class="Main_MemoryLabel">Save</span>
            <button
              v-for="(m, index) in memory"
              class="D_Button Main_OptionsButton Main_MemorySave"
              @click="saveMemory(index, $event)">
              <span style="pointer-events: none;">{{ index+1 }}</span>
            </button>
          </div>
        </div>
        <div class="Main_OptionsCredits">
          <div class="D_Center Main_OptionsFooterButtons">
            <a
              href="https://discord.gg/gWZ8v9Xf43"
              class="D_Button Main_OptionsButton"
              target="_blank"
              rel="noopener noreferrer">
              <svg class="Main_DiscordLogo" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0)">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="71" height="55" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span>Discord server</span>
            </a>
            <button
              class="D_Button Main_OptionsButton"
              @click="openDialogGallery()">
              <i class="ticon-dash D_ButtonIcon" style="font-size: 22px;" aria-hidden="true"/>
              <span>Library</span>
            </button>
          </div>
          <div class="D_Center Main_OptionsFooterButtons">
            <button
              class="D_Button Main_OptionsButton"
              @click="$router.push({ name: 'Gallery' })">
              <span>PL15 Changes</span>
            </button>
            
            <button
              class="D_Button Main_OptionsButton"
              @click="aboutDialog = true; optionsDialogActive = false;">
              <span>About</span>
              <svg class="Main_FavLogo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.7 59.8" style="enable-background:new 0 0 54.7 59.8" xml:space="preserve">
                <path fill="#FFC717" d="m54.7 55.9-.5 1.3c-1 .8-2.3 1.4-4.1 1.9s-3.4.7-5 .7c-3.9 0-7-.8-9.4-2.3-2.3-1.5-4.5-4-6.6-7.6-.1-.1-.2-.2-.3-.5s-.8-1.5-2.1-3.8-2.5-4.2-3.8-5.5c-1.3-1.4-2.5-2-3.7-2h-1.4v20.6H0V0h27.8c7.6 0 13.4 1.7 17.6 5.2 4.1 3.5 6.2 8.3 6.2 14.4 0 1.7-.3 3.7-1 5.8s-1.9 4.1-3.6 5.9c-1.7 1.8-3.8 3.3-6.2 4.4.8.8 1.7 2 2.7 3.6 1.2 2 2.2 3.3 2.8 3.8.7.5 1.4.8 2.2.8.5 0 1.2-.2 2.2-.6l1.1.6 2.9 12zM27.1 26.4c1.7 0 3.2-.5 4.4-1.5 1.2-1 1.8-2.4 1.8-4.2 0-1.9-.6-3.4-1.8-4.5-1.2-1.1-2.7-1.7-4.4-1.7h-9.2v11.9h9.2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="aboutDialog"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="aboutDialog = false;">
      <div style="position: relative;">
        <div class="Main_DialogTitle">About</div>

        <div class="Main_Disclaimer">
          <div>This project was made by TiagoXavi and is not related to the Hutch Games Ltd.</div>
          <div>Any problem or suggestion, please join the Discord server or send an email (mighty.boy@topdrivesrecords.com).</div>
          <div>TDR is free for everyone and doesn't make use of any ads. You can donate to help to keep it online and receiving new features!</div>
        </div>
        <div class="D_TextCenter Space_TopPlus"></div>


        <div class="D_Center Space_TopPlus">
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=T6FSRTEHJHBFE"
            class="D_Button Main_OptionsButton"
            target="_blank"
            rel="noopener noreferrer">
            <svg class="Main_DiscordLogo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.7 30.3">
              <path style="fill:#179BD7;" d="M23.1,7.7L23.1,7.7L23.1,7.7c0,0.2-0.1,0.4-0.1,0.6c-1.2,6.4-5.5,8.5-10.9,8.5H9.4
                c-0.7,0-1.2,0.5-1.3,1.1l0,0l0,0l-1.4,8.9l-0.4,2.5c-0.1,0.4,0.3,0.8,0.7,0.8h4.9c0.6,0,1.1-0.4,1.2-1l0-0.2l0.9-5.8l0.1-0.3
                c0.1-0.6,0.6-1,1.2-1h0.7c4.7,0,8.4-1.9,9.5-7.5c0.5-2.3,0.2-4.3-1-5.6C24.1,8.3,23.6,8,23.1,7.7z"/>
              <path style="fill:#222D65;" d="M21.8,7.2c-0.2-0.1-0.4-0.1-0.6-0.2C21,7,20.8,7,20.6,6.9c-0.7-0.1-1.6-0.2-2.4-0.2h-7.4
                c-0.2,0-0.4,0-0.5,0.1C10,7,9.7,7.4,9.7,7.8l-1.6,9.9l0,0.3c0.1-0.7,0.7-1.1,1.3-1.1h2.8c5.4,0,9.6-2.2,10.9-8.5
                c0-0.2,0.1-0.4,0.1-0.6c-0.3-0.2-0.7-0.3-1-0.4C22,7.3,21.9,7.2,21.8,7.2z"/>
              <path style="fill:#253B80;" d="M9.7,7.8C9.7,7.4,10,7,10.3,6.9c0.2-0.1,0.3-0.1,0.5-0.1h7.4c0.9,0,1.7,0.1,2.4,0.2
                C20.8,7,21,7,21.2,7.1c0.2,0,0.4,0.1,0.6,0.2c0.1,0,0.2,0.1,0.3,0.1c0.4,0.1,0.7,0.3,1,0.4c0.4-2.3,0-3.9-1.3-5.4
                c-1.4-1.6-3.9-2.3-7.2-2.3H5.3C4.6,0.1,4.1,0.5,4,1.2L0.1,26c-0.1,0.5,0.3,0.9,0.8,0.9h5.8l1.5-9.2L9.7,7.8z"/>
            </svg>
            <span>Donate</span>
          </a>
        </div>

        <div class="Main_AboutFlag">
          <div class="Main_AboutFlagBox">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 668.6 444.1" style="enable-background:new 0 0 668.6 444.1" xml:space="preserve">
              <!-- <path style="fill:#149e3e" d="M0 0h668.5c.1 148 .1 296 0 444.1H0V0z"/> -->
              <path style="fill:#ffde1d" d="M329.9 55c3.4.6 6.2 3.3 9.3 4.9 25.1 15.9 50.3 31.7 75.4 47.6 12.1 7.3 24 15 35.8 22.9 5.2 2.8 10.3 5.9 15.2 9.3 17.4 10.8 34.5 21.9 51.8 32.8 9.6 5.8 19 11.8 28.3 17.9 8.1 4.8 16.1 9.7 23.8 15.1 8.6 5.1 17.2 10.4 25.5 15.9.1.2.2.6.3.8-17.3 11.1-34.7 22.2-52.1 33-12.8 8.9-26.8 16.2-39.5 25.3-8.4 5.3-17.2 10.1-25.3 15.8-4.3 3.1-9.2 5.1-13.4 8.4-20.6 13-41.3 26-61.8 39.2-6.8 3.9-13.3 8-19.8 12.4-17.3 10.6-34.3 21.8-51.5 32.4-.9.7-1.8.7-2.6 0-7.4-4.1-14-9.3-21.5-13.4-4.8-3.8-10.2-6.4-15.2-9.8-36.4-22.6-72.4-45.9-108.8-68.5-6.3-3.6-12-8-18.3-11.5-9.5-6.3-19.1-12.4-28.9-18.3-8-5.3-16.1-10.4-24.4-15.3-10.7-7.5-22-13.9-33-21-3.9-3.2-8.9-4.9-12.4-8.6-.2-1.8 1.7-2.6 2.9-3.6 25.4-15.6 50.3-31.9 75.7-47.6 35.5-22.5 71.2-44.9 106.8-67.3 20.5-12.8 40.7-26.1 61.3-38.7 5.4-3.1 10.5-7.3 16.4-10.1z"/>
              <defs>
                <circle id="a" cx="330.1" cy="222.3" r="125.3"/>
              </defs>
              <use xlink:href="#a" style="overflow:visible;fill:#0b2675"/>
              <clipPath id="b">
                <use xlink:href="#a" style="overflow:visible"/>
              </clipPath>
              <g style="clip-path:url(#b)">
                <path style="fill:#fffffe" d="m224.4 150.5.8-.1c20.7-1.5 41.6-.8 62.3 1.4 47.5 4.9 94.9 19.3 134 47.3 12.8 9 24.2 19.7 34.9 31.1l1.5 1.5c-1.4 16.4-5.9 32.5-13 47.3l.2-1c-.8 0-2.4.1-3.2.2-1.7-3.6-4.5-6.5-7.1-9.5-13.4-15.7-29.6-28.9-47.2-39.7-45.7-27.9-99.4-39.8-152.3-43.5-9.1-.1-18.1-1-27.1-.8 3.7-12.1 9.4-23.5 16.2-34.2z"/>
              </g>
            </svg>
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
              <div class="Main_CampaignTrackName">{{ (tracksRepo.find(x => x.id === race.name.substr(0, race.name.length-4)) || {}).name }}</div>
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
            <span>Cancel</span>
          </button>
          <button
            :class="`${ confirmDelete.loading ? 'D_Button_Loading ' : '' }`+
                    `${ confirmDelete.classe }`"
            :disabled="confirmDelete.loading"
            class="D_Button Main_OptionsButton D_ButtonRed"
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
  </div>
</template>

<script>
import Car from './Car.vue'
import Row from './Row.vue'
import BaseText from './BaseText.vue';
import BaseCard from './BaseCard.vue';
import Loading from './Loading.vue'
import BaseDialog from './BaseDialog.vue'
import MainLogin from './MainLogin.vue'
import BaseGalleryItem from './BaseGalleryItem.vue'
import BaseTypeName from './BaseTypeName.vue'
import Logo from './Logo.vue'
import BaseAvatar from './BaseAvatar.vue'
import BaseDualSlider from './BaseDualSlider.vue'
import BaseChip from './BaseChip.vue'
import BaseCheckBox from './BaseCheckBox.vue'
import BaseContentLoader from './BaseContentLoader.vue'
import BaseFlag from './BaseFlag.vue'
import BaseTrackType from './BaseTrackType.vue'
import data_cars from '../database/cars_final.json'
import campaign from '../database/campaign.json'
import LogRocket from 'logrocket';
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
    BaseDualSlider,
    BaseChip,
    BaseCheckBox,
    BaseContentLoader,
    BaseFlag,
    BaseTrackType,
    MainLogin,
    BaseText,
    BaseCard,
    BaseGalleryItem,
    BaseTypeName
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
      searchInput: '',
      searchInputT: '',
      searchTracks: '',
      searchActive: false,
      isFiltering: false,
      isFilteringT: false,
      nextId: 0,
      searchFocus: false,
      debounceFilter: null,
      debounceFilterT: null,
      searchLoading: false,
      searchLoadingT: false,
      searchLoadingT2: false,
      searchMax: 20,
      showAllFilter: false,
      searchResult: [],
      showingLastest: false,
      maxCarNumber: 30,
      alreadySearched: false,
      shareDialog: false,
      tuneDialogActive: false,
      tuneDialogCar: null,
      tuneDialogCarIndex: null,
      optionsDialogActive: false,
      printImageDialog: false,
      aboutDialog: false,
      loginDialog: false,
      voteLoading: false,
      successVote: false,
      galleryDialog: false,
      galleryDialogNew: true,
      galleryList: [],
      galleryPage: 1,
      galleryLastKey: undefined,
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
      hoverIndex: -1,
      gameVersion: "Game v15.00",
      user: null,
      showCarsFix: true,
      needSave: false,
      saveLoading: false,
      downloadLoading: false,
      shareUrl: null,
      copyUrlSucess: false,
      filterCount: 0,
      filterCountT: 0,
      searchFilters: {
        yearStart: 1930,
        yearEnd: 2022,
        yearModel: [],
        rqStart: 10,
        rqEnd: 100,
        rqModel: [],
        topSpeedStart: 50,
        topSpeedEnd: 350,
        topSpeedModel: [],
        acelStart: 1.0,
        acelEnd: 40,
        acelModel: [],
        handStart: 30,
        handEnd: 110,
        handModel: [],
        mraStart: 0,
        mraEnd: 150,
        mraModel: [],
        weightStart: 300,
        weightEnd: 4000,
        weightModel: [],
        classes: ["F","E","D","C","B","A","S"],
        classesColors: ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFC717"],
        classesModel: [],
        tyres: ["Performance", "Standard", "All-surface", "Off-road", "Slick"],
        tyresModel: [],
        drives: ["FWD", "RWD", "4WD"],
        drivesModel: [],
        clearances: ["Low", "Mid", "High"],
        clearancesModel: [],
        countrys: ["JP", "DE", "US", "GB", "IT", "FR", "SE", "NL", "AT", "AU", "HR", "AE", "BR", "ZA", "CN"],
        countrysModel: [],
        tags: [
          "American Dream",
          "American Frontier",
          "Around the World",
          "Call of the Wild",
          "Christmas Collection",
          "Concept",
          "Drivers Choice",
          "Eco Friendly",
          "European Revolution",
          "Famous Tracks",
          "French Renaissance",
          "German Renaissance",
          "Great Exhibition",
          "Hot Hatch",
          "Hypercar",
          "In the Shadows",
          "Innovative",
          "Italian Renaissance",
          "Japan Pro Tour",
          "Motorsport",
          "Muscle Car",
          "Rest of the World",
          "Ride of the Valkyries",
          "Riders on the Storm",
          "Silver Screen",
          "Sleeper",
          "Street Racer",
          "Style Icon",
          "Sub-Zero",
          "Summer Games",
          "Supercar",
          "Team Favourite",
          "The Horror Show",
          "Two Tone",
          "Ultra Expensive",
          "Wild Ride",
          "World Expo",
          "Year of the Ox",
          "Year of the Rat",
          "Year of the Tiger"
        ],
        tagsModel: [],
        brands: [
          "AC",
          "Acura",
          "Alfa Romeo",
          "AMC",
          "Apollo", // logic "Gumpert"
          "Arash",
          "Ariel",
          "Aston Martin",
          "Audi",
          "Austin",
          "Bentley",
          "BMW",
          "Bristol",
          "Bugatti",
          "Buick",
          "Cadillac",
          "Caterham",
          "Chevrolet",
          "Chrysler",
          "Citroen",
          "De Tomaso",
          "DMC",
          "Dodge",
          "Donkervoort",
          "DS",
          "Eagle",
          "Fiat",
          "Ford",
          "Geo",
          "GMC",
          "Hennessey",
          "Honda",
          "Hummer",
          "Infiniti",
          "Jaguar",
          "Koenigsegg",
          "KTM",
          "Lamborghini",
          "Lancia",
          "Land Rover",
          "Lotus",
          "Maserati",
          "Mazda",
          "McLaren",
          "Mercedes-Benz",
          "MG",
          "Mini",
          "Mitsubishi",
          "Nissan",
          "Oldsmobile",
          "Pagani",
          "Peugeot",
          "Plymouth",
          "Pontiac",
          "Porsche",
          "RAM",
          "Renault",
          "Rezvani",
          "Rimac",
          "Rover",
          "RUF",
          "Saleen",
          "Saturn",
          "SCG", // logic "Scuderia Cameron Glickenhaus"
          "Smart",
          "Spyker",
          "Subaru",
          "Suzuki",
          "TVR",
          "Ultima",
          "Vauxhall",
          "Volkswagen",
          "Volvo",
          "W Motors",
          "Zenos"
        ],
        brandsModel: [],
      },
      galleryFilters: {
        yearModel: [],
        rqModel: [],
        topSpeedModel: [],
        acelModel: [],
        handModel: [],
        mraModel: [],
        weightModel: [],
        classesModel: [],
        tyresModel: [],
        drivesModel: [],
        clearancesModel: [],
        countrysModel: [],
        tagsModel: [],
        brandsModel: [],
        typesModel: [],
        aprooveModel: false
      },
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
              tracks: ["carPark_a00","gForce_a00","hairpin_a00","indoorKart_a00","kart_a00","slalom_a00","tCircuit_a00","tRoad_a00","fast_a00"]
            },
            {
              type: "00",
              active: false,
              customName: "Dry 2",
              tracks: ["gForcer_a00","slalomr_a00","tCircuitr_a00","fastr_a00","mnGforce_a00","mnHairpin_a00","mnCityNarrow_a00","mnCity_a00","mnCityLong_a00"]
            },
            {
              type: "01",
              active: false,
              tracks: ["carPark_a01","gForce_a01","hairpin_a01","kart_a01","slalom_a01","tCircuit_a01","tRoad_a01","fast_a01","mnHairpin_a01"]
            },
            {
              type: "10",
              active: false,
              tracks: ["gForce_a10","hairpin_a10","tRoad_a10","tCircuit_a10","slalom_a10","moto_a10","rallySmall_a40","rallyMed_a40","mnHairpin_a40"]
            },
            {
              type: "11",
              active: false,
              tracks: ["gForce_a11","tRoad_a11","slalom_a11","moto_a11"]
            },
            {
              type: "20",
              active: false,
              tracks: ["gForce_a20","hairpin_a20","tRoad_a20","slalom_a20"]
            },
            {
              type: "30",
              active: false,
              tracks: ["gForce_a30","slalom_a30"]
            },
            {
              type: "50",
              active: false,
              tracks: ["gForce_a50","hairpin_a50","tRoad_a50","slalom_a50"]
            },
            {
              type: "60",
              active: false,
              tracks: ["gForce_a60","hairpin_a60","tRoad_a60","tCircuit_a60","frozenLake_ad0","slalom_a60"]
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
              customName: "Dry 2",
              tracks: ["mile4r_a00","mile1r_a00","drag100b_a00","drag150b_a00","drag30130_a00","drag50150_a00","drag75125_a00","waterDrag_a00","testBowlr_a00"]
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
              tracks: ["drag100_a20","drag120_a20","mile4_a20","mile2_a20","mile1_a20","hClimb_a20"]
            },
            {
              type: "30",
              active: false,
              tracks: ["mile4_a30"]
            },
            {
              type: "50",
              active: false,
              tracks: ["mile4_a50","mile2_a50","mile1_a50","hClimb_a50"]
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
      tracksRepo: [
        {
          "name": "0-100-0mph",
          "id": "drag100b",
          "types": ["00","01","10"],
          "campaign": ["USA Nevada 9", "UK London 3", "COL Tatacoa 4"]
        },
        {
          "name": "0-100mph",
          "id": "drag100",
          "types": ["00","01","10","20"],
          "campaign": ["UK Midlands 5","UK Midlands 6","COL Tatacoa 8","FIN Tykkimaki 2"]
        },
        {
          "name": "0-120mph",
          "id": "drag120",
          "types": ["00","20"],
          "campaign": ["UAE Dubai 10","FIN Tykkimaki 10"]
        },
        {
          "name": "0-150-0mph",
          "id": "drag150b",
          "types": ["00"]
        },
        {
          "name": "0-150mph",
          "id": "drag150",
          "types": ["00","01","10"]
        },
        {
          "name": "0-170mph",
          "id": "drag170",
          "types": ["00"]
        },
        {
          "name": "0-60-0mph",
          "id": "drag60b",
          "types": ["20"]
        },
        {
          "name": "0-60mph",
          "id": "drag60",
          "types": ["01","10","20","50","60"]
        },
        {
          "name": "1 Mile",
          "id": "mile1",
          "types": ["00","01","10","20","50","60"]
        },
        {
          "name": "1 Mile (R)",
          "id": "mile1r",
          "types": ["00"]
        },
        {
          "name": "1/2 Mile",
          "id": "mile2",
          "types": ["00","01","11","20","50","60"]
        },
        {
          "name": "1/4 Mile",
          "id": "mile4",
          "types": ["00","01","11","20","30","50","60"]
        },
        {
          "name": "1/4 Mile (R)",
          "id": "mile4r",
          "types": ["00"]
        },
        {
          "name": "100-150mph",
          "id": "drag100150",
          "types": ["00"]
        },
        {
          "name": "30-130mph",
          "id": "drag30130",
          "types": ["00"]
        },
        {
          "name": "50-150mph",
          "id": "drag50150",
          "types": ["00"]
        },
        {
          "name": "75-125mph",
          "id": "drag75125",
          "types": ["00"]
        },
        {
          "name": "Airplane Hangars",
          "id": "airplaneHangars",
          "types": ["00","01"]
        },
        {
          "name": "Airplane Slalom",
          "id": "airplaneSlalom",
          "types": ["10"]
        },
        {
          "name": "Back Road",
          "id": "smallRoad",
          "types": ["41"]
        },
        {
          "name": "Canyon Butte",
          "id": "butte",
          "types": ["40","41","e0"]
        },
        {
          "name": "Canyon Lookout",
          "id": "canyonLookout",
          "types": ["10","11","50"]
        },
        {
          "name": "Canyon Tour",
          "id": "canyonTour",
          "types": ["00","01","11","50","60"]
        },
        {
          "name": "Car Park",
          "id": "carPark",
          "types": ["00","01"]
        },
        {
          "name": "City Streets Medium",
          "id": "csMed",
          "types": ["00","01","50","60"]
        },
        {
          "name": "City Streets Small",
          "id": "csSmall",
          "types": ["00","01","50","60"]
        },        
        {
          "name": "Dirt Road",
          "id": "canyonDtRoad",
          "types": ["40","41","e0"]
        },
        {
          "name": "Fast Circuit",
          "id": "fast",
          "types": ["00","01"]
        },
        {
          "name": "Fast Circuit (R)",
          "id": "fastr",
          "types": ["00"]
        },
        {
          "name": "Figure Of Eight",
          "id": "figureEight",
          "types": ["01","b0","c0","d0"]
        },
        {
          "name": "Forest River",
          "id": "forestRiver",
          "types": ["40","41","b0"]
        },
        {
          "name": "Forest Road",
          "id": "forest",
          "types": ["00","01","30","60"]
        },
        {
          "name": "Forest Slalom",
          "id": "forestSlalom",
          "types": ["10","11","70","71","20","30","60"]
        },
        {
          "name": "Frozen Lake",
          "id": "frozenLake",
          "types": ["d0"]
        },
        {
          "name": "Frozen River Slalom",
          "id": "frozenRivSla",
          "types": ["30"]
        },
        {
          "name": "G-Force",
          "id": "gForce",
          "types": ["00","01","10","11","20","30","50","60"]
        },
        {
          "name": "G-Force (R)",
          "id": "gForcer",
          "types": ["00"]
        },
        {
          "name": "Hairpin Road",
          "id": "hairpin",
          "types": ["00","01","10","20","50","60"]
        },
        {
          "name": "Hill Climb",
          "id": "hClimb",
          "types": ["00","01","10","11","20","50","60"]
        },
        {
          "name": "Hill Climb (R)",
          "id": "hClimbr",
          "types": ["10"]
        },
        {
          "name": "Indoor Karting",
          "id": "indoorKart",
          "types": ["00"]
        },
        {
          "name": "Karting Circuit",
          "id": "kart",
          "types": ["00","01"]
        },
        {
          "name": "L-Shape Drag",
          "id": "draglshape",
          "types": ["00","01"]
        },
        {
          "name": "Monaco G-Force",
          "id": "mnGforce",
          "types": ["00","01"]
        },
        {
          "name": "Monaco Hairpin",
          "id": "mnHairpin",
          "types": ["00","01","40","41"]
        },
        {
          "name": "Monaco Narrow Streets",
          "id": "mnCityNarrow",
          "types": ["00","01"]
        },
        {
          "name": "Monaco Streets",
          "id": "mnCity",
          "types": ["00","01"]
        },
        {
          "name": "Monaco Streets Long",
          "id": "mnCityLong",
          "types": ["00","01"]
        },
        {
          "name": "Motocross Track",
          "id": "moto",
          "types": ["10","11"]
        },
        {
          "name": "Mountain Hairpin",
          "id": "mtHairpin",
          "types": ["00","01","11","60"]
        },
        {
          "name": "Mountain Hill Climb",
          "id": "mtHill",
          "types": ["00","01","11","60"]
        },
        {
          "name": "Mountain Incline Road",
          "id": "mtIncline",
          "types": ["00","01","11","60"]
        },
        {
          "name": "Mountain Slalom",
          "id": "mtSlalom",
          "types": ["00","01","11","60"]
        },
        {
          "name": "Mountain Tour",
          "id": "mtTour",
          "types": ["00","01","11","60"]
        },
        {
          "name": "Mountain Twisty Road",
          "id": "mtTwisty",
          "types": ["00","01","11","60"]
        },
        {
          "name": "Northloop",
          "id": "northloop",
          "types": ["00","01"]
        },
        {
          "name": "Northloop 1",
          "id": "northloop1",
          "types": ["00","60"]
        },
        {
          "name": "Northloop 2",
          "id": "northloop2",
          "types": ["00","60"]
        },
        {
          "name": "Northloop 3",
          "id": "northloop3",
          "types": ["00","01"]
        },
        {
          "name": "Northloop 4",
          "id": "northloop4",
          "types": ["00","01","60"]
        },
        {
          "name": "Northloop 5",
          "id": "northloop5",
          "types": ["00","01","60"]
        },
        {
          "name": "Ocean Beach Slalom",
          "id": "oceanSlalom",
          "types": ["c0","c1"]
        },
        {
          "name": "Ocean City Streets",
          "id": "oceanCity",
          "types": ["00","01"]
        },
        {
          "name": "Ocean Highway",
          "id": "oceanHighway",
          "types": ["00","01"]
        },
        {
          "name": "Ocean Long Drag",
          "id": "oceanLongDrag",
          "types": ["00","01"]
        },
        {
          "name": "Ocean Parking Lot",
          "id": "oceanParking",
          "types": ["00","01"]
        },
        {
          "name": "Ocean Short Drag",
          "id": "oceanShortDrag",
          "types": ["00","01"]
        },
        {
          "name": "Rallycross Medium",
          "id": "rallyMed",
          "types": ["40","41"]
        },
        {
          "name": "Rallycross Small",
          "id": "rallySmall",
          "types": ["40","41"]
        },
        {
          "name": "Runway Drag",
          "id": "runwayDrag",
          "types": ["00","01"]
        },
        {
          "name": "Runway Drag & Slalom",
          "id": "runwayDragSlalom",
          "types": ["00","01"]
        },
        {
          "name": "Runway Loop",
          "id": "runwayLoop",
          "types": ["00","01"]
        },
        {
          "name": "Service Roads",
          "id": "serviceRoads",
          "types": ["00","01","10"]
        },
        {
          "name": "Slalom Test",
          "id": "slalom",
          "types": ["00","01","10","11","20","30","50","60"]
        },
        {
          "name": "Slalom Test (R)",
          "id": "slalomr",
          "types": ["00"]
        },
        {
          "name": "Speedbump 1/2km",
          "id": "speedbump12km",
          "types": ["00","60"]
        },
        {
          "name": "Speedbump 1km",
          "id": "speedbump1km",
          "types": ["00"]
        },
        {
          "name": "Test Bowl",
          "id": "testBowl",
          "types": ["00","01","10","60"]
        },
        {
          "name": "Test Bowl (R)",
          "id": "testBowlr",
          "types": ["00","01","20","60"]
        },
        {
          "name": "Tokyo Bridge",
          "id": "tokyoBridge",
          "types": ["00","01"]
        },
        {
          "name": "Tokyo Drag",
          "id": "tokyoDrag",
          "types": ["00","01"]
        },
        {
          "name": "Tokyo G-Force",
          "id": "tokyoGforce",
          "types": ["00","01"]
        },
        {
          "name": "Tokyo Loop",
          "id": "tokyoLoop",
          "types": ["00","01"]
        },
        {
          "name": "Tokyo Off Ramp",
          "id": "tokyoOffRamp",
          "types": ["00","01"]
        },
        {
          "name": "Tokyo Overpass",
          "id": "tokyoOverpass",
          "types": ["00","01"]
        },
        {
          "name": "Town Slalom",
          "id": "townSlalom",
          "types": ["00","01","60"]
        },
        {
          "name": "Town Sprint",
          "id": "townSprint",
          "types": ["01"]
        },
        {
          "name": "Town Tour",
          "id": "townTour",
          "types": ["00","01","60"]
        },
        {
          "name": "Twisty Circuit",
          "id": "tCircuit",
          "types": ["00","01","10","50","60"]
        },
        {
          "name": "Twisty Circuit (R)",
          "id": "tCircuitr",
          "types": ["00"]
        },
        {
          "name": "Twisty Road",
          "id": "tRoad",
          "types": ["00","01","10","11","20","30","50","60"]
        },
        {
          "name": "Waterfront Drag",
          "id": "waterDrag",
          "types": ["00","01"]
        }
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

    }
  },
  beforeMount() {
    this.clearFilter();
    this.clearFilter(true);
    this.clearSaveToGallery();
    this.checkMemoryFromStorage();



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

    if (this.$route.query && this.$route.query.aproove) {
      // http://192.168.15.110:8081?aproove=t
      this.galleryFilters.aprooveModel = true;
      setTimeout(() => {
        this.openDialogGallery();
      }, 100);

    }

    if (this.$route.query && this.$route.query.share && this.$route.query.share.includes("~")) {
      // from query string

      this.decodeTemplateString(this.$route.query.share, true);

    } else {
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
  
      if (cars) {
        this.prepareCars(JSON.parse(cars));
      }
    }


    
  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500); 
    this.debounceFilterT = Vue.debounce(this.changeFilterT, 500); 

    this.getUser();

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_TIME") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        let NEW = mutation.payload.item;

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].times) Vue.set(car.data[car.selectedTune], "times", {});
        /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
        /**/ if (!car.dataToSave[car.selectedTune]) Vue.set(car.dataToSave, car.selectedTune, {});
        /**/ if (!car.dataToSave[car.selectedTune].times) Vue.set(car.dataToSave[car.selectedTune], "times", {});

        Vue.set(car.data[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        Vue.set(car.data[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}_user`], vm.user.username);
        Vue.set(car.data[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}_downList`], []);
        Vue.set(car.data[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}_upList`], []);
        /**/ Vue.set(car.dataToSave[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        if (!car.users || !car.users.includes(vm.user.username)) {
          Vue.set(car, "users", car.users && car.users.length > 0 ? [...car.users, vm.user.username] : [vm.user.username]);
        }
        vm.needSaveChange(true);
      }

      if (mutation.type == "TIME_VOTE") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        let type = mutation.payload.type
        let TRACK = mutation.payload.item;
        let timesObj = car.data[car.selectedTune].times;
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
            vm.requestVote(true, false, car.rid, car.selectedTune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
          } else {
            downArr.push(vm.user.username);
            vm.requestVote(false, false, car.rid, car.selectedTune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
          }
          
        } else if (isUnVoteUp) {
          vm.requestVote(true, true, car.rid, car.selectedTune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
        } else {
          vm.requestVote(false, true, car.rid, car.selectedTune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
        }

      }

      if (mutation.type == "CHANGE_TUNE") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);

        vm.changeTuneCar(car, mutation.payload.tune)
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
        }
      }

      if (mutation.type == "HOVER_INDEX") {
        if (mutation.payload) {
          vm.hoverIndex = mutation.payload;
        }
      }

    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    highlights() {
      let vm = this;
      let result = [];
      let sortedByTracks = {};

      // result length = number of cars
      this.carDetailsList.map(x => {
        result.push({});
      });

      // insert every type of track in both result && sortedByTracks
      this.currentTracks.map((x, ix) => {
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
              sortedByTracks[trackId].push(x.data[x.selectedTune].times[trackId]);
            }
          });
        }
      });

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
    contributorsScreen() {
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

      contritrs = [...new Set(contritrs)]
      return contritrs.join(", ")
    },
    filteredTracks() {
      let filteredTracks = this.tracksRepo;
      let conds = ["dry", "wet", "dirt", "gravel", "ice", "sand", "snow", "grass"];
      let input = this.searchTracks.toLowerCase();
      let inputArray = input.split(" ");
      let typesInput = inputArray.filter(x => conds.includes(x));
      let tracksInput = inputArray.filter(x => !conds.includes(x));

      if (typesInput.length > 0) {
        let Surfaces = [];
        let Conds = [];

        if ( typesInput.includes("dry") ) {
          Surfaces.push("0");
          Conds.push("0");
        }
        if ( typesInput.includes("wet") ) {
          Conds.push("1");
        }
        if ( typesInput.includes("dirt") ) {
          Surfaces.push("1");
          Surfaces.push("4");
        }
        if ( typesInput.includes("gravel") ) {
          Surfaces.push("2");
          Surfaces.push("b");
        }
        if ( typesInput.includes("ice") ) {
          Surfaces.push("3");
        }
        if ( typesInput.includes("sand") ) {
          Surfaces.push("5");
          Surfaces.push("c");
        }
        if ( typesInput.includes("snow") ) {
          Surfaces.push("6");
          Surfaces.push("d");
        }
        if ( typesInput.includes("grass") ) {
          Surfaces.push("7");
        }

        filteredTracks = filteredTracks.filter(x => {
          return x.types.find(y => {
            if (Surfaces.length > 0 && Conds.length > 0) {
              return Surfaces.includes(y[0]) && Conds.includes(y[1]);
            } else if (Surfaces.length > 0) {
              return Surfaces.includes(y[0]);
            } else if (Conds.length > 0) {
              return Conds.includes(y[1]);
            }
          })
        });
      }
      if (tracksInput.length > 0) {
        filteredTracks = filteredTracks.filter(x => {
          return x.name.toLowerCase().includes(tracksInput.join(" "));
        });
      }
      return filteredTracks;
    },
    tuneDialogTunes() {
      let result = ["332", "323", "233"];
      if (this.tuneDialogCar.class === "S") result.push("111");
      return result;
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
    pushTrack(track) {
      let index = this.indexOfTrack(track);
      if (index === -1) {
        this.currentTracks.push(...this.validateTracks([track]))
      }
    },
    removeTrack(track) {
      let index = this.indexOfTrack(track);
      if (index > -1) {
        this.currentTracks.splice(index, 1);
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
    toggleTrack(track) {
      let index = this.currentTracks.findIndex(y => {
        if (track === `${y.id}_a${y.surface}${y.cond}`) {
          return true
        }
      });
      
      if (index === -1) {
        this.pushTrack(track);
      } else {
        this.removeTrack(track);
      }      
      this.verifyActiveButtons();
    },
    stringToggleTrackSet(str) {
      this.toggleTrackSet(this[str])
    },    
    validateTracks(tracks) {
      let tracksClear = [];

      tracks.map(x => {
        this.tracksRepo.find(circuit => {
          circuit.types.find(type => {
            if (x === `${circuit.id}_a${type}`) {
              tracksClear.push( { name: circuit.name, id: circuit.id, surface: type[0], cond: type[1], code: `${circuit.id}_a${type}` } );
              return true;
            }
          })
        })
      })
      return tracksClear;
    },
    moreTracksCar(tracksIds) {
      let notFound = [];
      tracksIds.map(x => {
        let found = this.tracksRepo.find(circuit => {
          return circuit.types.find(type => {
            if ( `${circuit.id}_a${type}` === x ) {
              this.toggleTrack(x);
              return true;
            }
          })
        })
        if (!found) {
          notFound.push(x)
        }
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
    openDialogSearch() {
      this.searchActive = true;
      this.isFiltering = false;
      this.searchInput = '';
      setTimeout(() => {
        try {
          document.querySelector("#SearchInput").focus();  
        } catch (error) {}
      }, 10);
    },
    closeDialogSearch() {
      this.searchActive = false;
    },
    openDialogGallery() {
      this.galleryDialog = true;
      this.isFilteringT = false;
      this.searchInputT = '';
      this.optionsDialogActive = false;
      if (this.galleryDialogNew) {
        this.galleryDialogNew = false;
        this.changeFilterT();
      }
      // setTimeout(() => {
      //   try {
      //     document.querySelector("#GalleryInput").focus();  
      //   } catch (error) {}
      // }, 10);
    },
    closeDialogGallery() {
      this.galleryDialog = false;
    },
    openDialogTrackSearch() {
      this.customTrackDialog = true;
      this.optionsDialogActive = false;
      setTimeout(() => {
        try {
          document.querySelector("#SearchTrackInput").focus();  
        } catch (error) {}
      }, 10);
    },
    closeDialogTrackSearch() {
      this.customTrackDialog = false;
      this.optionsDialogActive = true;
      this.searchTracks = '';
    },
    closeTune() {
      this.tuneDialogActive = false;
      // this.$store.commit("SHOW_TUNE", false);
      
    },
    searchBlur() {
      setTimeout(() => {
        this.searchFocus = false;
      }, 200);
    },
    searchInputFunc(e) {
      this.debounceFilter();
    },
    searchInputFuncT(e) {
      this.debounceFilterT();
    },
    changeFilter(showAll = false) {
      // console.log("changeFilter");
      // this.searchLoading = false;
      let result = [];
      // let searchStr = this.searchInput.toLowerCase().replace(/  +/g, ' ').split(" ");
      let searchStr = this.searchInput.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let strIndex = -1;
      let prePush;
      let tryFind;
      this.resolveFilterCount();
      if (searchStr === "" && this.filterCount === 0) {
        this.searchLoading = false;
        return [];
      }

      // search and/or filter
      this.all_cars.map((x, ix) => {
        if (result.length < 200 || showAll) {

          let shouldPush = false;
          if (searchStr && searchStr !== "") {
            strIndex = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(searchStr);
          } else {
            strIndex = -2;
          }

          if (this.filterCount > 0) {
            if (strIndex > -1 || strIndex === -2) {
              if (this.checkMatchFilter(x)) {
                shouldPush = true;
              }
            }
          } else {
            if (strIndex > -1) {
              shouldPush = true;
            }
          }

          if (shouldPush) {
            prePush = JSON.parse(JSON.stringify(x));
            if (strIndex > -1) {
              prePush.locatedName = x.name.substr(0, strIndex)+'<b>'+x.name.substr(strIndex, searchStr.length)+'</b>'+x.name.substr(strIndex + searchStr.length);
              prePush.locatedIndex = strIndex;
              if (x.name[strIndex - 1] === ' ') {
                prePush.locatedPlus = true;
              }
            } else {
              prePush.locatedName = x.name;
            }

            result.push(prePush);
          }


        }
      })

      // class and photo
      result.map(x => {
        Vue.set(x, "class", Vue.resolveClass(x.rq, x.class, "letter"));
        Vue.set(x, "classColor", Vue.resolveClass(x.rq, x.class, "color"));    
        try {
          Vue.set(x, "ridPhoto", '');
          setTimeout(() => {
            Vue.set(x, "ridPhoto", require('@/imgs_final/' + x.rid + '.jpg'));
          }, 1);
        } catch (error) {
          Vue.set(x, "ridPhoto", '');
        }    
      })

      // inteligent sort
      if (searchStr && searchStr !== "") {
        result.sort(function(a, b) {
          if (a.locatedPlus && !b.locatedPlus) return -1;
          if (b.locatedPlus && !a.locatedPlus) return 1;
          return a.locatedIndex - b.locatedIndex;
        });
      }

      this.searchMax = 20;

      this.searchResult = result;
      this.searchLoading = false;
      this.showingLastest = false;
      this.alreadySearched = true;
      this.showAllFilter = showAll;

    },
    showLastest(arrayLastest) {
      let result = [];
      let prePush;
      
      arrayLastest.map(y => {
        this.all_cars.map(x => {
          if (x.rid === y.rid) {
            prePush = JSON.parse(JSON.stringify(x));
            prePush.locatedName = x.name;
            prePush.lastestUser = y.user;
            result.push(prePush);
          }
        })
      })
      result.map(x => {
        Vue.set(x, "class", Vue.resolveClass(x.rq, x.class, "letter"));
        Vue.set(x, "classColor", Vue.resolveClass(x.rq, x.class, "color"));    
        try {
          Vue.set(x, "ridPhoto", '');
          setTimeout(() => {
            Vue.set(x, "ridPhoto", require('@/imgs_final/' + x.rid + '.jpg'));
          }, 1);
        } catch (error) {
          Vue.set(x, "ridPhoto", '');
        }    
      })

      this.showingLastest = true;
      this.searchMax = 100;
      this.lastestContributionsResolved = result;
      this.searchResult = result;
    },
    changeFilterT(lastKey = false) {
      let vm = this;
      if (!lastKey) this.searchLoadingT = true;
      else this.searchLoadingT2 = true;
      let searchStr = this.searchInputT.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let clearFilters = this.resolveFilterCount(true);

      let params = {
        input: searchStr
      };
      Object.keys( clearFilters ).forEach( key => {
        if (key === "rq" || key === "year") {
          params[`min${key}`] = clearFilters[key][0];
          params[`max${key}`] = clearFilters[key][1];
        } else if (key === "classes") {
          params["class"] = clearFilters[key];
        } else if (key === "aproove") {
          params["aproove"] = clearFilters[key];
        } else {
          params[key.slice(0, -1)] = clearFilters[key];
        }
      })

      if (lastKey) {
        params.LastEvaluatedKey = lastKey;
        this.galleryPage += 1; 
      } else {
        this.galleryPage = 1
      }

      
      axios.post(Vue.preUrl + "/searchTemplate", params)
      .then(res => {
        if (res.data.Items && Array.isArray(res.data.Items)) {
          res.data.Items = res.data.Items.map(x => {
            let colors = [];
            if (x.class) {
              x.class.map(c => {
                colors.push(Vue.resolveClass(0, c, "color"))
              })
            }
            return {
              ...x,
              ...vm.decodeTemplateString(x.template, false),
              classesColors: colors
            }
          })
        }
        if (lastKey) {
          this.galleryList = [
            ...this.galleryList,
            ...res.data.Items
          ]
        } else {
          this.galleryList = res.data.Items;
        }
        if (res.data.LastEvaluatedKey) this.galleryLastKey = res.data.LastEvaluatedKey;
        else this.galleryLastKey = undefined;
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
        this.searchLoadingT = false;
        this.searchLoadingT2 = false;
      });

    },
    addCar(index) {
      if (this.carDetailsList.length < this.maxCarNumber) {
        this.carDetailsList.push(JSON.parse(JSON.stringify(this.searchResult[index])));
        this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
        this.nextId++;
        // console.log(this.carDetailsList.map(x => x.softId));

        this.searchResult.find((x, ix) => {
          if (ix === index) {
            Vue.set(x, "added", true);
            setTimeout(() => {
              Vue.set(x, "added", false);
            }, 800);
            return true;
          }
        });

        if (this.carDetailsList.length >= this.maxCarNumber) {
          this.searchActive = false;
        }

        this.showCarsFix = false;
        this.$nextTick().then(() => {
          this.showCarsFix = true;
        })

        this.updateCarLocalStorage();
        this.downloadCar(this.carDetailsList[this.carDetailsList.length - 1].rid)
      }
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
    getUser() {
      // user
      axios.get(Vue.preUrl + "/getUser")
      .then(res => {
        if (res.data.username) {
          this.user = res.data;

          LogRocket.identify(res.data.username, {
            email: res.data.email
          });

          if (this.$hj) {
            this.$hj('vpv', res.data.username)
          }

          if (res.data.auth) {
            window.localStorage.setItem('auth', res.data.auth);
          }

        }
      })
      .catch(error => {
        console.log(error);
      });

      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.showLastest(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    },
    logout() {
      axios.delete(Vue.preUrl + "/logout")
      .then(res => {
        if (res.data === "OK") {
          this.user = null;
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: "Logout successful"
          });
        } else {
          throw new Error("Unable to log out");
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
          this.all_cars.map(x => {
            if (x.rid === y.rid) {
              result.push(JSON.parse(JSON.stringify(x)));
              if (y.selectedTune) result[result.length-1].selectedTune = y.selectedTune;
              result[result.length-1].softId = this.nextId;
              this.nextId++;
            }
          })
        })
        
      }
      Vue.set(this, "carDetailsList", result);
      this.downloadDataCars();
    },
    saveAll() {
      this.saveLoading = true;
      let simplifiedCars = [];
      this.carDetailsList.map(x => {
        if (x.dataToSave) {
          simplifiedCars.push({
            rid: x.rid,
            data: x.dataToSave
          });
        }
      });

      axios.post(Vue.preUrl + "/update", simplifiedCars)
      .then(res => {
        this.needSaveChange(false);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: "Successful save"
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
          text: "Successful save"
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
      let simplifiedCars = this.carDetailsList.map(x => {
        return {
          rid: x.rid
        }
      });

      if (simplifiedCars.length === 0) {
        this.downloadLoading = false;
        return;
      }

      let url = Vue.preUrl + "/cars";
      url = this.finalizeUrl(url); 

      axios.post(url, simplifiedCars)
      .then(res => {        
        this.applyNewData(res.data);
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
    applyNewData(newData) {
      this.carDetailsList.map(x => {
        newData.map(y => {
          if (x.rid === y.rid) {
            if (y.data) Vue.set(x, "data", y.data);
            if (y.users) Vue.set(x, "users", y.users);
          }
        })
      });
    },
    sharePrint() {
      window.scrollTo({ top: 0 });
      let vm = this;
      // this.printImageDialog = true;
      let pose = document.querySelector(".Main_Body");
      pose.classList.add("Main_BodyPrint");
      let c_container = document.querySelector('#App_PrintContainer');
      let currentCanvas = document.querySelector('#printCanvas');
      c_container.classList.add("App_PrintContainerShow");
      let mainLayout = document.querySelector(".Main_Layout");
      let reduceWidth = 0;
      if (!mainLayout.classList.contains("Main_2")) {
        // reduceWidth = Number(getComputedStyle(mainLayout).getPropertyValue('--cell-width').trim().replace("px",""));
      } else {
        // reduceWidth = 90;
      }
      let reduceHeight = 0;
      let carlistContainer = document.querySelector(".Main_CarList");
      let credits = document.querySelector(".Main_PrintCreditsBottom");
      let backTopContainer = document.querySelector(".Main_Backtop");
      if (!mainLayout.classList.contains("Main_2")) {
        reduceHeight = pose.clientHeight - carlistContainer.clientHeight - credits.clientHeight;
      } else {
        reduceHeight = pose.clientHeight - backTopContainer.clientHeight - carlistContainer.clientHeight - credits.clientHeight;
      }



      let _width = (pose.clientWidth - reduceWidth) * 2;
      let _height = (pose.clientHeight - reduceHeight) * 2;      
      
      let options = {
        // allowTaint: false,
        backgroundColor: "#333",
        canvas: currentCanvas,
        // foreignObjectRendering: false,
        // imageTimeout: 15000,
        // ignoreElements: (element) => false,
        // logging: true,
        // onclone: (doc) => {
        //   console.log(doc);
        //   doc.querySelectorAll("button").forEach(x => {
        //     x.remove()
        //   })
        // },
        // proxy: null,
        // removeContainer: true,
        scale: 2,
        // useCORS: false,
        width: _width,
        height: _height,
        // x: Element x-offset,
        // y: Element y-offset,
        // scrollX: Element scrollX,
        // scrollY: Element scrollY,
        windowWidth: _width,
        windowHeight: _height,
      }

      currentCanvas.setAttribute("width", `${_width}`);
      currentCanvas.setAttribute("height", `${_height}`);

      html2canvas(pose, options).then(function(canvas) {
        reimg.ReImg.fromCanvas(currentCanvas).downloadPng()
        c_container.classList.remove("App_PrintContainerShow")
        
        document.querySelector(".Main_Body").classList.remove("Main_BodyPrint");
      });
    },
    generateUrl(isForTemplate = false) {
      let result = `${window.location.origin}?share=`;
      if (isForTemplate) result = '';

      this.currentTracks.map(x => {
        result += `~K${x.id}_a${x.surface}${x.cond}`
      });
      this.carDetailsList.map(x => {
        result += `~C${x.rid}${x.selectedTune ? '~T'+x.selectedTune : '' }`
      });

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
    decodeTemplateString(template, pushToWork = false) {

      let carsFromQuery = [];
      let tracksFromQuery = [];

      template.split("~").map(x => {
        if (x[0] === "C") {
          carsFromQuery.push({ // car
            rid: decodeURI(x.substr(1))
          })
        } else if (x[0] === "T") {
          carsFromQuery[carsFromQuery.length-1].selectedTune = x.substr(1); // tune last car
        } else if (x[0] === "K") {
          tracksFromQuery.push(x.substr(1))
        }
      })

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

      } else {
        return {
          tracks: tracksFromQuery,
          cars: carsFromQuery
        }
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
    defaultFilters(type) {
      if (type === "yearModel") return [1930, 2022];
      if (type === "rqModel") return [10, 100];
      if (type === "topSpeedModel") return [50, 350];
      if (type === "acelModel") return [1.0, 40];
      if (type === "handModel") return [30, 110];
      if (type === "mraModel") return [0, 150];
      if (type === "weightModel") return [300, 4000];
      // if (type === "classesModel") return [];
      // if (type === "tyresModel") return [];
      // if (type === "drivesModel") return [];
      // if (type === "clearancesModel") return [];
      // if (type === "countrysModel") return [];
      // if (type === "brandsModel") return [];
    },
    clearFilter(isGallery = false) {
      let type = isGallery ? "galleryFilters" : "searchFilters";
      this[type].yearModel = this.defaultFilters("yearModel");
      this[type].rqModel = this.defaultFilters("rqModel");
      this[type].topSpeedModel = this.defaultFilters("topSpeedModel");
      this[type].acelModel = this.defaultFilters("acelModel");
      this[type].handModel = this.defaultFilters("handModel");
      this[type].mraModel = this.defaultFilters("mraModel");
      this[type].weightModel = this.defaultFilters("weightModel");
      this[type].classesModel = [];
      this[type].tyresModel = [];
      this[type].drivesModel = [];
      this[type].clearancesModel = [];
      this[type].countrysModel = [];
      this[type].tagsModel = [];
      this[type].brandsModel = [];
      this[type].typesModel = [];
      this[type].aprooveModel = false;
    },
    resolveFilterCount(isGallery = false) {
      let type = isGallery ? "galleryFilters" : "searchFilters";
      let defaults = {
        yearModel: this.defaultFilters("yearModel"),
        rqModel: this.defaultFilters("rqModel"),
        topSpeedModel: this.defaultFilters("topSpeedModel"),
        acelModel: this.defaultFilters("acelModel"),
        handModel: this.defaultFilters("handModel"),
        mraModel: this.defaultFilters("mraModel"),
        weightModel: this.defaultFilters("weightModel"),
        classesModel: [],
        tyresModel: [],
        drivesModel: [],
        clearancesModel: [],
        countrysModel: [],
        tagsModel: [],
        brandsModel: [],
        typesModel: [],
        aprooveModel: false
      }
      let count = 0;

      let vm = this;
      let clearFilter = {};
      Object.keys( this[type] ).forEach(function (key) {
        if (key.includes("Model")) {
          // if (key === 'aprooveModel') {
          //   debugger;
          // }
          if (defaults[key] !== undefined && JSON.stringify(vm[type][key]) !== JSON.stringify(defaults[key])) {
            count++;
            clearFilter[key.replace("Model","")] = vm[type][key];

          }
        }
      });

      if (isGallery) {
        this.filterCountT = count;
        return clearFilter;
      } else {
        this.filterCount = count;
      }
    },
    checkMatchFilter(car) {
      // between
      if ( !this.filterCheckBetween(car.year, this.searchFilters.yearModel) ) return false;
      if ( !this.filterCheckBetween(car.rq, this.searchFilters.rqModel) ) return false;
      if ( !this.filterCheckBetween(car.topSpeed, this.searchFilters.topSpeedModel) ) return false;
      if ( JSON.stringify(this.searchFilters.acelModel) !== JSON.stringify(this.defaultFilters("acelModel")) ) {
        if ( !this.filterCheckBetween(car.acel, this.searchFilters.acelModel) ) return false;
      }
      if ( !this.filterCheckBetween(car.hand, this.searchFilters.handModel) ) return false;
      if ( JSON.stringify(this.searchFilters.mraModel) !== JSON.stringify(this.defaultFilters("mraModel")) ) {
        if ( !this.filterCheckBetween(car.mra, this.searchFilters.mraModel) ) return false;
      }
      if ( !this.filterCheckBetween(car.weight, this.searchFilters.weightModel) ) return false;

      // includes
      if ( !this.filterCheckIncludes(car.class, this.searchFilters.classesModel) ) return false;
      if ( !this.filterCheckIncludes(car.tyres, this.searchFilters.tyresModel) ) return false;
      if ( !this.filterCheckIncludes(car.drive, this.searchFilters.drivesModel) ) return false;
      if ( !this.filterCheckIncludes(car.clearance, this.searchFilters.clearancesModel) ) return false;
      if ( !this.filterCheckIncludes(car.country, this.searchFilters.countrysModel) ) return false;
      if ( !this.filterCheckIncludesArray(car.tags, this.searchFilters.tagsModel) ) return false;
      if ( !this.filterCheckIncludes(car.brand, this.searchFilters.brandsModel) ) return false;


      return true;
    },
    filterCheckBetween(value, array) {
      return value >= array[0] && value <= array[1]
    },
    filterCheckIncludes(value, array) {
      if (array.length === 0) return true;
      return array.includes(value);
    },
    filterCheckIncludesArray(valuesArray, array) {
      if (array.length === 0) return true;
      return !!array.find(x => {
        return valuesArray.includes(x);
      });
    },
    applyFilter() {
      this.changeFilter();
      this.isFiltering = false;
      let container = document.querySelector(".Main_SearchMid");
      container.scrollTo({ top: 0 });
    },
    applyFilterT() {
      this.changeFilterT();
      this.isFilteringT = false;
      let container = document.querySelector(".Main_SearchMidT");
      container.scrollTo({ top: 0 });
    },
    closeFilterText() {
      this.searchInput = '';
      this.searchResult = this.lastestContributionsResolved;
      this.alreadySearched = false;
      this.showingLastest = true;
      this.showAllFilter = false;
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
    changeTuneCar(car, newTune) {
      if (newTune === car.selectedTune) {
        newTune = undefined
      }

      Vue.set(car, "selectedTune", newTune);
      this.showCarsFix = false;
      this.$nextTick().then(() => {
        this.showCarsFix = true;
      })
      this.updateCarLocalStorage();
    },
    changeStatCar(car, type, value) {

      if (!car.data) Vue.set(car, "data", {});
      if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
      if (!car.data[car.selectedTune].info) Vue.set(car.data[car.selectedTune], "info", {});
      /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
      /**/ if (!car.dataToSave[car.selectedTune]) Vue.set(car.dataToSave, car.selectedTune, {});
      /**/ if (!car.dataToSave[car.selectedTune].info) Vue.set(car.dataToSave[car.selectedTune], "info", {});

      Vue.set(car.data[car.selectedTune].info, type, value);
      Vue.set(car.data[car.selectedTune].info, `${type}_user`, this.user.username);
      /**/ Vue.set(car.dataToSave[car.selectedTune].info, type, value);
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
          "Tune",
          "Event",
          "Other",
        ],
        minrq: null,
        maxrq: null,
        save_rq: false,
        minyear: null,
        maxyear: null,
        save_year: false,
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
            if (t[key].length === 1) {
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
        t.type = "Tune";
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
        this.galleryDialogNew = true;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: "Successful save"
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
    deleteTemplate(config) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;

        axios.post(Vue.preUrl + "/deleteTemplate", config)
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.galleryList = vm.galleryList.filter(x => x.date !== config.date)
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: "Successful delete"
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
        msg: `Deleting template "${config.name}" by ${config.user}. Are you sure?`,
        actionLabel: "Delete",
        action: action,
        loading: false,
        classe: "Delete"
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
    }
  },
}
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@300;400;700&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@400;700&family=VT323&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto&family=Roboto+Condensed:wght@400;700&display=swap');

* {
  background-repeat: no-repeat;
  padding: 0;
  margin: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
body {
  font-family: 'Roboto', sans-serif;

  /* main */
  --top-height: 150px;
  --left-width: 200px;
  --cell-width: 230px;
  --cell-height: 35px;
  --dark-back: 40, 40, 40;
  --back-h: 360;
  --back-s: 0%;
  --back-l: 15%;
  --d-back: #333;
  --d-text: #aaa;
  --d-text-b: #ccc;
  --d-text-green: 95, 181, 0;
  --d-text-green-b: 193, 217, 185;
  --d-text-red: 215, 0, 0;
  --d-text-red-b: 251, 131, 131;
  --d-text-yellow: 255, 199, 23;

  /* tracks */
  --color-dry: 204, 204, 204;
  --color-wet: 90, 163, 255;
  --color-dirt: 239, 97, 75;
  --color-gravel: 197, 177, 120;
  --color-ice: 112, 215, 255;
  --color-mixed: 217, 171, 225;
  --color-sand: 233, 197, 69;
  --color-snow: 186, 212, 235;
  --color-grass: 93, 227, 93;

  /* car */
  --card-stat-back-l: 10%;
  --card-stat-back-a: 0.2;
  --card-right-width: 20%;
  --card-left-width: 10%;
  --card-top-height: 15%;
  --card-left-height: 28%;
  --card-stat-div: 0%;
  --card-font-size: 12px;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );


  font-size: 18px;
  background-color: var(--d-back);
  color: var(--d-text);
  overflow-x: scroll;
  overflow-y: scroll;
}
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
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 80px;
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
}
.D_Button {
  background-color: transparent;
  border: none;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  transition-duration: 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --height: 36px;
  min-height: var(--height);
  min-width: 36px;
  line-height: 1;
  border-radius: 6px;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  --back-opac-foc: 0.3;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  color: var(--d-text-b);
}
.D_ButtonDark {
  background-color: rgba(0,0,0,0.2);
  font-size: 1em;
  border-radius: 6px;
  padding: 0 7px;
  color: var(--d-text-b);
}
.D_ButtonDark2 {
  background-color: rgba(255,255,255,0.1);
  --back-opac: 0.2;
}
.D_ButtonDarkTransparent {
  background-color: rgba(255,255,255,0.0);
  --back-opac: 0.2;
}
.D_ButtonBig {
  padding: 12px 15px;
}
.D_Button.focus-visible:not(.D_ButtonNoActive) {
  outline: none;
  background-color: rgba(var(--back-color), var(--back-opac-foc));
}
.D_ButtonNoActive {
  outline: none;
}
.D_Button.D_ButtonNoActive.focus-visible {
  background-color: rgba(var(--back-color), 0.3);
}
.D_Button:hover:not(.D_ButtonActive):not([disabled]):not(.D_Button_Correct):not(.D_Button_Error) {
  color: #fffc;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.D_Button:active:not(.D_ButtonNoActive) {
  transition-duration: 0.0s;
  background-color: rgba(var(--back-color), calc(var(--back-opac) * 2));
  transform: translateY(3px);
}
.D_ButtonLabel {
  margin-right: 5px;
  font-size: 16px;
}
.D_ButtonActive {
  box-shadow: inset 0px -33px 15px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
  border-radius: 0;
}
.D_ButtonActive:hover {
  background-color: rgba(var(--d-text-green-b), 0.2);
}
.D_Button[disabled] {
  cursor: initial;
  opacity: 0.2;
  pointer-events: none;
}
.D_Button.D_Button_Loading {
  position: relative;
  color: rgba(255, 255, 255, 0.2);
  opacity: 0.6;
  overflow: hidden;
  pointer-events: none;
}
.D_Button_Loading::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 100%;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 7px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 14px
  );
  animation: Processamento_Loop 0.6s linear infinite;
  top: 85%;
}
@keyframes Processamento_Loop {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0px);
  }
}
button.D_Button.D_Button_Correct {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-green), 0.2);
  opacity: 0.6;
}
.D_Button_Correct::after {
  content: "Done!";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-green));
}
button.D_Button.D_Button_Error {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-red), 0.2);
  opacity: 0.6;
}
.D_Button_Error::after {
  content: "Error";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-red));
}
.D_ButtonLink {
  color: var(--d-text);
  padding: 0;
  height: auto;
  min-height: auto;
  width: auto;
  min-width: auto;
}
.D_ButtonIcon {
  margin-right: 5px;
}
.D_ButtonIconRight {
  margin-left: 5px;
}
.D_ButtonNote {
  position: absolute;
  top: -6px;
  right: -3px;
  font-size: 9px;
  background-color: #bd0000;
  color: white;
  border-radius: 3px;
  padding: 2px;
  padding-right: 2.5px;
}
.D_ButtonDarkPrimary {
  --btn-h: 46;
  --btn-s: 95%;
  --btn-l: 54%;
  background-color: hsl(var(--btn-h), var(--btn-s), var(--btn-l));
  color: black;
}
.D_ButtonDarkPrimary.focus-visible:not(.D_ButtonNoActive) {
  outline: none;
  background-color: hsl(var(--btn-h), var(--btn-s), 40%);
  color: black;
}
.D_ButtonDarkPrimary:hover:not(.D_ButtonActive):not([disabled]) {
  background-color: hsl(var(--btn-h), var(--btn-s), 40%);
  color: black;
}
.D_Button.D_ButtonRed {
  --back-color: 200,0,0;
  --back-opac: 1;
  --back-opac-foc: 1;
  background-color: rgba(150,0,0,1);
}


.D_Link {
  text-decoration: none;
  color: var(--d-text);
  padding: 5px 6px;
  border-radius: 5px;
  transition-duration: 0.1s;
}
.D_Link:hover,
.D_Link.focus-visible {
  outline: none;
  background-color: rgba(255,255,255,0.06);
}
.D_LinkPlus {
  background-color: rgba(255,255,255,0.03);
}
.add {
  color: #fff2;
  font-size: 30px;
  width: 100%;
  height: 100%;
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
.Main_SearchInputClose {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1em;
}
.Main_SearchInputClose.D_Button:active:not(.D_ButtonNoActive) {
  transform: translateY(-42%);
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
.Main_FiltersButton:hover:not(.D_ButtonActive):not([disabled]) {
  color: #fff;
  background-color: hsl(var(--back-h), var(--back-s), calc(var(--back-l) + 3%));
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
.Main_SearchInput, 
.Track_SearchInput {
  width: 100%;
  background-color: #222;
  border: none;
  padding: 25px;
  padding-right: 45px;
  box-sizing: border-box;
  color: #ccc;
  --back-h: 0;
  --back-s: 0%;
  --back-l: 35%;
  box-shadow: inset 0px 0px 0px 3px hsl(var(--back-h), var(--back-s), var(--back-l));
  transition-duration: 0.2s;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
}
.Main_SearchInput.focus-visible,
.Track_SearchInput.focus-visible {
  outline: none;
  --back-h: 203;
  --back-s: 60%;
  --back-l: 55%;
  background-color: #102e40;
  color: #fff;
}
.Main_SearchInput::placeholder,
.Track_SearchInput::placeholder {
  color: #fff3;
}
.Track_SearchBox {
  position: relative;
  flex-grow: 10;
  padding: 0 20px;
  margin-bottom: 10px;
}
.Track_SearchInput {
  height: 55px;
  padding-left: 15px;
}
.Main_TrackSearchInputClose {
  position: absolute;
  right: 26px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1em;
}
.Main_TrackSearchInputClose.D_Button:active:not(.D_ButtonNoActive) {
  transform: translateY(-42%);
}
.Main_SearchMid {
  height: 50vh;
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
.Main_SearchEmpty::-webkit-scrollbar,
.Main_SearchMid::-webkit-scrollbar,
.Main_DarkScroll::-webkit-scrollbar,
textarea::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 18px;
}
.Main_SearchEmpty::-webkit-scrollbar-track,
.Main_SearchMid::-webkit-scrollbar-track,
.Main_DarkScroll::-webkit-scrollbar-track,
textarea::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  background-color: #0002;
}
.Main_SearchEmpty::-webkit-scrollbar-thumb,
.Main_SearchMid::-webkit-scrollbar-thumb,
.Main_DarkScroll::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
  background-color: #555;
}
.Main_SearchEmpty::-webkit-scrollbar-corner,
.Main_SearchMid::-webkit-scrollbar-corner,
.Main_DarkScroll::-webkit-scrollbar-corner,
textarea::-webkit-scrollbar-corner,
body::-webkit-scrollbar-corner {
  background-color: #222;
}
.Main_SearchEmpty {
  height: 50vh;
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
  margin-left: 0.1em;
  margin-right: 2px;
  color: rgb(225 179 33);
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
  color: rgb(var(--d-text-yellow));
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
  gap: 10px;
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
.Type_30 {
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
  width: calc(var(--cell-width) * 2.1);
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






.Main_2 {
  --cell-width: 80px;
  --top-height: 70px;
  --left-width: 250px;
  font-size: 14px;
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
.Main_2 .Row_Layout {
  display: flex;
}
.Main_2 .Main_Body {
  flex-direction: column;
}
.Main_2 .Row_Cell {
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
}
.Main_2 .Row_ContentEmpty:not(:focus) ~ .Row_Placeholder {
  display: flex;
}
.Main_2 .Row_Placeholder {
  width: 100%;
  justify-content: center;
  align-items: center;
}
.Main_2 .Row_Tracks .Row_Content {
  text-align: center;
  white-space: normal;
}
.Main_2 .Row_Tracks .Row_Cell {
  border-right-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 0;
}
.Main_2 .Row_Layout {
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
.Main_2 .Row_Tracks .Row_ConfigCell {
  /* box-shadow: inset 0px -18px 16px -17px #5fb500, inset 0px -3px 0px 0px #5fb500; */
}
.Main_2 .Row_ConfigCell {
  width: calc(var(--cell-width) * 2.1);
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




.Main_Compact .Car_Layout {
  --card-left-width: 19%;
  --card-right-width: 31%;
  --card-top-height: 11.5%;
  --card-stat-height: 31.9px;
}
.Main_Compact .Car_Layout:not(.Car_LayoutAddCar) .Car_Header > *:not(.Car_HeaderName):not(.Car_HeaderBlockRQ):not(.Car_HeaderBlockClass):not(.Car_HeaderBlockTopSpeed):not(.Car_HeaderBlock060):not(.Car_HeaderBlockHandling):not(.Car_HeaderBlockDrive) {
  display: none;
}
.Main_Compact .Car_Layout {
  width: 120px;
}
.Main_Compact .Car_Layout .Car_HeaderName {
  font-size: 0.8em;
  width: calc(100% - 8px);
  margin-top: 0px;
}
.Main_Compact .Car_Layout .Car_HeaderNameBig {
  font-size: 0.7em;
}
.Main_Compact .Car_Layout .Car_HeaderNameBigBig {
  font-size: 0.6em;
}
.Main_Compact .Car_Layout .Car_HeaderBlockTopSpeed,
.Main_Compact .Car_Layout .Car_HeaderBlock060,
.Main_Compact .Car_Layout .Car_HeaderBlockHandling,
.Main_Compact .Car_Layout .Car_HeaderBlockDrive {
  box-shadow: 0px -2px 0px hsla(0, 100%, 100%, 0.09);
  backdrop-filter: blur(15px);
}
.Main_Compact .Car_Layout .Car_HeaderStatValue,
.Main_Compact .Car_Layout .Car_HeaderStatLabel {
  padding-right: 1px;
}
.Main_Compact {
  --cell-width: 120px;
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
.Main_BodyPrint button {
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
}
.Main_BodyPrint .Car_HeaderName {
  margin-top: -1px;
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
  display: none;
}
.Main_Compact .Car_Loading::after {
  left: 50%;
}
.Main_BodyPrint .Main_GamePrintInfo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin-top: 15px;
}
.Main_2 .Main_BodyPrint .Main_GamePrintInfo {
  margin-top: 0px;
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





@media only screen and (max-width: 767px) {
  body {
    /* --d-back: #504242; */
    --left-width: 120px;
  }
  .Main_BodyPrint {
    --left-width: 200px;
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
    grid-template-columns: 1fr;
    gap: 20px;
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
}
@media only screen and (min-width: 768px) {
  .Main_MidEmptyItemAdd .Main_MidEmptyButtonSearch {
    height: 150px;
    width: 200px;
  }
}
</style>