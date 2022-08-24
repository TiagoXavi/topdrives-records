<template>
  <div :class="{ Main_Normal: !inverted, Main_2: inverted, Main_Compact: compact }" class="Main_Layout">
    <div :class="{ Main_BodyEmpty: carDetailsList.length === 0 }" class="Main_Body" @click.stop>
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
                  @click="$router.push({ name: 'Login' })">Login to edit</button>
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
            type="tracks">
          </Row>
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
        <div v-if="!user" class="Main_MidEmptyTitle">Let's start with...</div>
        <div class="Main_MidEmptyInner">
          <div v-if="!user" class="Main_MidEmptyItem">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButton"
              @click="$router.push({ name: 'Login' })">Login</button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButton"
              @click="$router.push({ name: 'Register' })">Register</button>
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
              class="Main_SearchInput"
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
      max-width="500px"
      min-width="240px"
      @close="customTrackDialog = false; optionsDialogActive = true;">
      <div class="Main_TracksDialog">
        <div class="Main_AllTracksBox">
          <div
            v-for="circuit in tracksRepo"
            class="Main_CustomTrackItem">
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
        <portal-target
          slim
          name="tunedialog"/>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="shareDialog"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="shareDialog = false;">
      <div class="Main_ShareDialog">
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
        <div class="Main_DialogTitle">Share comparison</div>
        <div class="Main_ShareLinkBox">
          <textarea
            v-model="shareUrl"
            id="shareLinkField"
            rows="6"
            class="Main_ShareLinkInput"
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
      :active="optionsDialogActive"
      :transparent="false"
      max-width="400px"
      @close="updateOptions()">
      <div class="Main_OptionsDialog">
        <div v-if="user" class="Main_OptionsItem" style="display: flex;justify-content: center;">
          <div class="Main_UserCard">
            <BaseAvatar :user="user" size="46px" />
            <div class="Main_UserBlock">
              <div style="color: var(--d-text-b);" class="Main_UserName">{{ user.username }}</div>
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
          <div class="Main_OptionsButtons">
            <button
              v-for="item in tracksButtons"
              :class="{ D_ButtonActive: item.active }"
              class="D_Button Main_OptionsButton"
              @click="stringToggleTrackSet(item.set)">{{ item.name }}</button>
            <button
              class="D_Button Main_OptionsButton"
              @click="customTrackDialog = true; optionsDialogActive = false;">More...</button>
            
          </div>
        </div>
        <div v-else-if="!!user && needSave" class="Main_OptionsSaveData">
          <button
            :class="{ D_Button_Loading: saveLoading }"
            class="D_Button Main_SaveAllButton"
            @click="saveAll()">Save</button>
        </div>
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
              @click="$router.push({ name: 'Gallery' })">
              <span>PL15 Gallery</span>
            </button>
          </div>
          <div class="D_Center">
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
          <div>Any problem or suggestion, please join the Discord server or send an email.</div>
        </div>
        <div class="D_TextCenter Space_TopPlus">mighty.boy@topdrivesrecords.com</div>

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
  </div>
</template>

<script>
import Car from './Car.vue'
import Row from './Row.vue'
import Loading from './Loading.vue'
import BaseDialog from './BaseDialog.vue'
import Logo from './Logo.vue'
import BaseAvatar from './BaseAvatar.vue'
import BaseDualSlider from './BaseDualSlider.vue'
import BaseChip from './BaseChip.vue'
import BaseFlag from './BaseFlag.vue'
import BaseTrackType from './BaseTrackType.vue'
import data_cars from '../database/cars_final.json'
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
    BaseFlag,
    BaseTrackType
  },
  data() {
    return {
      unsubscribe: null,
      inverted: false,
      compact: false,
      searchInput: '',
      searchActive: false,
      isFiltering: false,
      nextId: 0,
      searchFocus: false,
      debounceFilter: null,
      searchLoading: false,
      searchMax: 20,
      showAllFilter: false,
      searchResult: [],
      showingLastest: false,
      maxCarNumber: 30,
      alreadySearched: false,
      shareDialog: false,
      tuneDialogActive: false,
      optionsDialogActive: false,
      printImageDialog: false,
      aboutDialog: false,
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
      lastestContributionsResolved: [],
      // carDetailsList: default_cars,
      carDetailsList: [],
      all_cars: data_cars,
      toLoadTrackSet: null,
      currentTracks: [],
      currentTracksSetsNames: [],
      tracksButtons: [
        { name: "Dry Twisty", set: "trackSet_DryTwisty", active: false },
        { name: "Dry City", set: "trackSet_DryCity", active: false },
        { name: "Dry Drag", set: "trackSet_DryDrag", active: false },
        { name: "Wet Twisty", set: "trackSet_WetTwisty", active: false },
        { name: "Wet City", set: "trackSet_WetCity", active: false },
        { name: "Dirt", set: "trackSet_Dirt", active: false },
        { name: "Wet Dirt", set: "trackSet_WetDirt", active: false },
        { name: "Gravel", set: "trackSet_Gravel", active: false },
        { name: "Sand", set: "trackSet_Sand", active: false },
        { name: "Snow", set: "trackSet_Snow", active: false },
        { name: "Ice", set: "trackSet_Ice", active: false },
      ],
      trackSet_DryTwisty: [
        { name: "Car Park", id: "carPark", surface: 0, cond: 0, campaign: 'JP Atsugi 1'},
        { name: "G-Force Test", id: "gForce", surface: 0, cond: 0, campaign: 'GER Stuttgart 4' },
        { name: "Hairpin Road", id: "hairpin", surface: 0, cond: 0, campaign: 'FR Chamonix 1' },
        { name: "Indoor Karting", id: "indoorKart", surface: 0, cond: 0, campaign: 'USA Nevada 1' },
        { name: "Karting Circuit", id: "kart", surface: 0, cond: 0, campaign: 'UK Midlands 4' },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 0, campaign: 'GER Stuttgart 7' },
        { name: "Twisty Circuit", id: "tCircuit", surface: 0, cond: 0, campaign: 'GER Stuttgart 6' },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 0, campaign: 'USA West Coast 7'},
        { name: "Fast Circuit", id: "fast", surface: 0, cond: 0, campaign: 'GER Stuttgart 3' },
      ],
      trackSet_DryCity: [
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 0, campaign: 'FR Chamonix 3' },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 0, campaign: 'JP Atsugi 4' },
      ],
      trackSet_DryDrag: [
        { name: "1/4 Mile", id: "mile4", surface: 0, cond: 0, campaign: 'UK Midlands 1'},
        { name: "1/2 Mile", id: "mile2", surface: 0, cond: 0, campaign: 'FR Chamonix 1' },
        { name: "1 Mile", id: "mile1", surface: 0, cond: 0, campaign: 'GER Stuttgart 1' },
        { name: "0-100mph", id: "drag100", surface: 0, cond: 0, campaign: 'UK Midlands 5' },
        { name: "0-150mph", id: "drag150", surface: 0, cond: 0, campaign: 'GER Stuttgart 2'},
        { name: "Hill Climb", id: "hClimb", surface: 0, cond: 0, campaign: 'GER Stuttgart 8'},
        { name: "Test Bowl", id: "testBowl", surface: 0, cond: 0, campaign: 'UK Midlands 8' },
      ],
      trackSet_WetTwisty: [
        { name: "Car Park", id: "carPark", surface: 0, cond: 1, campaign: 'JP Atsugi 5' },
        { name: "G-Force Test", id: "gForce", surface: 0, cond: 1, campaign: 'GER Bavaria 2' },
        { name: "Hairpin Road", id: "hairpin", surface: 0, cond: 1, campaign: 'JP Atsugi 8' },
        { name: "Karting Circuit", id: "kart", surface: 0, cond: 1, campaign: 'UK Midlands 9' },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 1, campaign: 'JP Tokyo 2' },
        { name: "Twisty Circuit", id: "tCircuit", surface: 0, cond: 1, campaign: 'FIN Tykkimaki 4' },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 1, campaign: 'JP Tokyo 1' },
        { name: "Fast Circuit", id: "fast", surface: 0, cond: 1, campaign: 'UK Midlands 9' },
      ],
      trackSet_WetCity: [
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 1, campaign: 'UK Midlands 6' },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 1, campaign: 'JP Tokyo 1' },
      ],
      trackSet_Dirt: [
        { name: "1 Mile", id: "mile1", surface: 1, cond: 0, campaign: 'COL Tatacoa 4' },//
        { name: "Hill Climb", id: "hClimb", surface: 1, cond: 0, campaign: 'GER Bavaria 3' },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 0, campaign: 'COL Tatacoa 8' },//
        { name: "Hairpin Road", id: "hairpin", surface: 1, cond: 0, campaign: 'COL Tatacoa 9' },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 0, campaign: 'USA New York 9' },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 1, cond: 0, campaign: 'USA Nevada 7' },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 0, campaign: 'USA Nevada 10' },//
        { name: "Motocross Track", id: "moto", surface: 1, cond: 0, campaign: 'USA Nevada 1' },//
      ],
      trackSet_WetDirt: [
        { name: "1/4 Mile", id: "mile4", surface: 1, cond: 1, campaign: 'USA New York 9' }, //
        { name: "1/2 Mile", id: "mile2", surface: 1, cond: 1, campaign: 'USA Nevada 4' }, //
        { name: "Hill Climb", id: "hClimb", surface: 1, cond: 1, campaign: 'FIN Tykkimaki 6' },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 1, campaign: 'USA Nevada 10' },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 1, campaign: 'USA Nevada 4' },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 1, campaign: 'USA Nevada 4' },//
        { name: "Motocross Track", id: "moto", surface: 1, cond: 1, campaign: 'USA Nevada 10' },//
      ],
      trackSet_Gravel: [
        { name: "1/4 Mile", id: "mile4", surface: 2, cond: 0, campaign: 'UK London 2' },//
        { name: "1/2 Mile", id: "mile2", surface: 2, cond: 0, campaign: 'FIN Tykkimaki 7' },//
        { name: "1 Mile", id: "mile1", surface: 2, cond: 0, campaign: 'USA New York 8' },//
        { name: "Hill Climb", id: "hClimb", surface: 2, cond: 0, campaign: 'FIN Tykkimaki 6' },//
        { name: "G-Force Test", id: "gForce", surface: 2, cond: 0, campaign: 'USA New York 8' },//
        { name: "Hairpin Road", id: "hairpin", surface: 2, cond: 0, campaign: 'FIN Tykkimaki 5' },//
        { name: "Twisty Road", id: "tRoad", surface: 2, cond: 0, campaign: 'FIN Tykkimaki 2' },//
        { name: "Slalom Test", id: "slalom", surface: 2, cond: 0, campaign: 'FIN Tykkimaki 7' },//
      ],
      trackSet_Sand: [
        { name: "1/4 Mile", id: "mile4", surface: 5, cond: 0, campaign: 'COL Tatacoa 7' },//
        { name: "1/2 Mile", id: "mile2", surface: 5, cond: 0, campaign: 'UAE Dubai 6' },//
        { name: "1 Mile", id: "mile1", surface: 5, cond: 0, campaign: 'UAE Dubai 1' },//
        { name: "Hill Climb", id: "hClimb", surface: 5, cond: 0, campaign: 'UAE Dubai 1' },//
        { name: "G-Force Test", id: "gForce", surface: 5, cond: 0, campaign: 'UAE Dubai 8' },//
        { name: "Hairpin Road", id: "hairpin", surface: 5, cond: 0, campaign: 'UAE Dubai 8' },//
        { name: "Twisty Road", id: "tRoad", surface: 5, cond: 0, campaign: 'UAE Dubai 2' },//
        { name: "Slalom Test", id: "slalom", surface: 5, cond: 0, campaign: 'UAE Dubai 6' },//
      ],
      trackSet_Snow: [
        { name: "1/4 Mile", id: "mile4", surface: 6, cond: 0, campaign: 'GER Stuttgart 6' },//
        { name: "1/2 Mile", id: "mile2", surface: 6, cond: 0, campaign: 'FIN Tykkimaki 8' },//
        { name: "1 Mile", id: "mile1", surface: 6, cond: 0, campaign: 'JP Tokyo 10 ' },//
        { name: "G-Force Test", id: "gForce", surface: 6, cond: 0, campaign: 'FIN Tykkimaki 8' },//
        { name: "Hairpin Road", id: "hairpin", surface: 6, cond: 0, campaign: 'FIN Tykkimaki 5' },//
        { name: "Twisty Road", id: "tRoad", surface: 6, cond: 0, campaign: 'FIN Tykkimaki 9' },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 6, cond: 0, campaign: 'GER Stuttgart 6' },//
        { name: "Slalom Test", id: "slalom", surface: 6, cond: 0, campaign: 'FIN Tykkimaki 8' },//
      ],
      trackSet_Ice: [
        { name: "1/4 Mile", id: "mile4", surface: 3, cond: 0, campaign: 'FIN Tykkimaki 9' },//
        { name: "G-Force Test", id: "gForce", surface: 3, cond: 0, campaign: 'FIN Tykkimaki 9' },//
        { name: "Slalom Test", id: "slalom", surface: 3, cond: 0, campaign: 'FIN Tykkimaki 6' },//
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
          "types": ["01"]
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
          "name": "Butte",
          "id": "butte",
          "types": ["40","41","e0"]
        },
        {
          "name": "Canyon Dirt Road",
          "id": "canyonDtRoad",
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
          "types": ["00","01","60"]
        },
        {
          "name": "City Streets Small",
          "id": "csSmall",
          "types": ["00","01","50","60"]
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
          "name": "Small Road",
          "id": "smallRoad",
          "types": ["41"]
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
  watch: {},
  beforeMount() {
    this.clearFilter();

    let display = window.localStorage.getItem("display");
    if (display) {
      this.display(display);
    }

    if (this.$route.query && this.$route.query.share && this.$route.query.share.includes("~")) {
      // from query string

      let carsFromQuery = [];
      let tracksFromQuery = [];

      this.$route.query.share.split("~").map(x => {
        if (x[0] === "C") {
          carsFromQuery.push({ // car
            rid: x.substr(1)
          })
        } else if (x[0] === "T") {
          carsFromQuery[carsFromQuery.length-1].selectedTune = x.substr(1); // tune last car
        } else if (x[0] === "K") {
          tracksFromQuery.push({ // track
            id: x.substr(0,x.indexOf("_a")).substr(1),
            surface: x.substr(x.indexOf("_a")+2,1),
            cond: x.substr(x.indexOf("_a")+3,1)
          })

        }
      })

      let tracksClear = this.validateTracks(tracksFromQuery);
      this.pushTrackSet(tracksClear);
      this.prepareCars(carsFromQuery);

      this.$router.replace({'query': null});

    } else {
      // from local storage

      let tracks = window.localStorage.getItem("tracks");
      if (tracks) {
        tracks = JSON.parse(tracks);
        let tracksClear = this.validateTracks(tracks);
        this.pushTrackSet(tracksClear);
      }
      if (this.currentTracks.length === 0) {
        this.pushTrackSet(this.trackSet_DryTwisty);
      }
  
      let cars = window.localStorage.getItem("cars");
      if (cars) {
        this.prepareCars(JSON.parse(cars));
      }
    }


    
  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500); 

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
        /**/ Vue.set(car.dataToSave[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        if (!car.users || !car.users.includes(vm.user.username)) {
          Vue.set(car, "users", car.users && car.users.length > 0 ? [...car.users, vm.user.username] : [vm.user.username]);
        }
        vm.needSaveChange(true);
      }

      if (mutation.type == "CHANGE_TUNE") {
        // console.log(vm.carDetailsList.map(x => x.softId));
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        Vue.set(car, "selectedTune", mutation.payload.tune);
        this.updateCarLocalStorage();
      }

      if (mutation.type == "CHANGE_STAT") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].info) Vue.set(car.data[car.selectedTune], "info", {});
        /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
        /**/ if (!car.dataToSave[car.selectedTune]) Vue.set(car.dataToSave, car.selectedTune, {});
        /**/ if (!car.dataToSave[car.selectedTune].info) Vue.set(car.dataToSave[car.selectedTune], "info", {});

        Vue.set(car.data[car.selectedTune].info, mutation.payload.type, mutation.payload.value);
        /**/ Vue.set(car.dataToSave[car.selectedTune].info, mutation.payload.type, mutation.payload.value);
        vm.needSaveChange(true);
      }

      if (mutation.type == "SHOW_TUNE") {
        if (mutation.payload) {
          vm.tuneDialogActive = true;
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
        sortedByTracks[trackId].sort(function(a, b) {
          if (trackId.includes('testBowl')) return b - a;
          if (a === 0) return 9999999;
          if (b === 0) return -9999999;
          return a - b;
        });
        sortedByTracks[trackId] = [...new Set(sortedByTracks[trackId])];
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
      let contritrs = [];
      this.carDetailsList.map(x => {
        if (x.users && x.users.length > 0) {
          contritrs.push(...x.users);
        }
      });

      contritrs = [...new Set(contritrs)]
      return contritrs.join(", ")
    },
    listAllTracks() {

    }
  },
  methods: {
    pushTrackSet(trackset) {
      let index;
      trackset.map(x => {
        index = this.indexOfTrack(x);
        if (index === -1) {
          this.currentTracks.push(x)
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
        this.currentTracks.push(track)
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
        if (`${track.id}_a${track.surface}${track.cond}` === `${y.id}_a${y.surface}${y.cond}`) {
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
            if (x.id === circuit.id && x.surface == type[0] && x.cond == type[1]) {
              tracksClear.push( { name: circuit.name, id: circuit.id, surface: type[0], cond: type[1] } );
              return true;
            }
          })
        })
      })
      return tracksClear;
    },
    moreTracksCar(tracksIds) {
      tracksIds.map(x => {
        this.tracksRepo.find(circuit => {
          circuit.types.find(type => {
            if ( `${circuit.id}_a${type}` === x ) {
              this.toggleTrack( { name: circuit.name, id: circuit.id, surface: type[0], cond: type[1] } );
              return true;
            }
          })
        })
      })
    },
    indexOfTrack(x) {
      return this.currentTracks.findIndex(y => {
        if (`${x.id}_a${x.surface}${x.cond}` === `${y.id}_a${y.surface}${y.cond}`) {
          return true
        }
      });
    },
    includeAllTracks(trackset) {
      let incluedesAll = true;
      let index;
      trackset.map(x => {
        index = this.currentTracks.findIndex(y => {
          if (`${x.id}_a${x.surface}${x.cond}` === `${y.id}_a${y.surface}${y.cond}`) {
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
      this.updateCarLocalStorage();
    },
    verifyActiveButtons() {
      this.tracksButtons.map(x => {
        if (this.includeAllTracks(this[x.set])) {
          x.active = true;
        } else {
          x.active = false;
        }
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
        this.showCarsFix = false;
        this.$nextTick().then(() => {
          this.showCarsFix = true;
        })
      }

      this.carDetailsList = this.carDetailsList.filter((x, ix) => ix !== index);
      this.updateCarLocalStorage();
      this.tuneDialogActive = false;
    },
    openDialogSearch() {
      this.searchActive = true;
      this.isFiltering = false;
      setTimeout(() => {
        try {
          document.querySelector("#SearchInput").focus();  
        } catch (error) {}
      }, 10);
      if (this.searchInput && this.searchInput.length > 0) {
        this.changeFilter();
      }
    },
    closeDialogSearch() {
      this.searchActive = false;
      // if (!this.searchFocus) {
        //   this.searchActive = false;
      // }
    },
    closeTune() {
      this.tuneDialogActive = false;
      this.$store.commit("SHOW_TUNE", false);
      
    },
    searchBlur() {
      setTimeout(() => {
        this.searchFocus = false;
      }, 200);
    },
    searchInputFunc(e) {
      // debugger;
      // console.log(e);
      // console.log(this.searchInput);
      // this.searchInput
      this.debounceFilter();
      // this.searchLoading = true;
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
    newIndex(obj) {
      obj.current;
      obj.new;
      this.closeTune();

      // If actual index of moved element is
      // less than 0 when 'moveEle += array size'
      while (obj.current < 0)
      {
          obj.current += this.carDetailsList.length;
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
      if (obj.new > this.carDetailsList.length)
      {
          obj.new = this.carDetailsList.length;
          // var un = obj.new - this.carDetailsList.length + 1;
          // while (un--)
          // {
          //     this.carDetailsList.push(undefined);

          // }
      }

      // Here element of 'obj.current' is removed and
      // pushed at 'obj.new' index
      this.carDetailsList.splice(obj.new, 0, this.carDetailsList.splice(obj.current, 1)[0]);
      
      this.updateCarLocalStorage();

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

      axios.post(Vue.preUrl + "/cars", simplifiedCars)
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

      axios.get(Vue.preUrl + "/car/" + rid)
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
    generateUrl() {
      let result = `${window.location.origin}?share=`;
      this.currentTracks.map(x => {
        result += `~K${x.id}_a${x.surface}${x.cond}`
      });
      this.carDetailsList.map(x => {
        result += `~C${x.rid}${x.selectedTune ? '~T'+x.selectedTune : '' }`
      });

      if (result.length > 2045) {
        // não dá
      }
      this.shareUrl = result;

    },
    copyUrl() {
      var copyText = document.getElementById("shareLinkField");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      navigator.clipboard.writeText(copyText.value);
      this.copyUrlSucess = true;
      setTimeout(() => { this.copyUrlSucess = false}, 1500);
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
    clearFilter() {
      this.searchFilters.yearModel = this.defaultFilters("yearModel");
      this.searchFilters.rqModel = this.defaultFilters("rqModel");
      this.searchFilters.topSpeedModel = this.defaultFilters("topSpeedModel");
      this.searchFilters.acelModel = this.defaultFilters("acelModel");
      this.searchFilters.handModel = this.defaultFilters("handModel");
      this.searchFilters.mraModel = this.defaultFilters("mraModel");
      this.searchFilters.weightModel = this.defaultFilters("weightModel");
      this.searchFilters.classesModel = [];
      this.searchFilters.tyresModel = [];
      this.searchFilters.drivesModel = [];
      this.searchFilters.clearancesModel = [];
      this.searchFilters.countrysModel = [];
      this.searchFilters.tagsModel = [];
      this.searchFilters.brandsModel = [];
    },
    resolveFilterCount() {
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
        brandsModel: []
      }
      let count = 0;

      let vm = this;
      Object.keys( this.searchFilters ).forEach(function (key) {
        if (key.includes("Model")) {
          if (defaults[key] && JSON.stringify(vm.searchFilters[key]) !== JSON.stringify(defaults[key])) {
            count++;
          }
        }
      });

      this.filterCount = count;
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
  background-color: rgba(var(--back-color), 0.3);
}
.D_ButtonNoActive {
  outline: none;
}
.D_Button.D_ButtonNoActive.focus-visible {
  background-color: rgba(var(--back-color), 0.3);
}
.D_Button:hover:not(.D_ButtonActive):not([disabled]) {
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
.D_Button.D_Button_Correct {
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
.D_Button.D_Button_Error {
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
.Main_SearchInput {
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
.Main_SearchInput.focus-visible {
  outline: none;
  --back-h: 203;
  --back-s: 60%;
  --back-l: 55%;
  background-color: #102e40;
  color: #fff;
}
.Main_SearchInput::placeholder {
  color: #fff3;
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
.Main_OptionsLabel {
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
  margin-top: 40px;
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
.Main_2 .Main_BodyPrint .Car_Layout:nth-child(3n-1) .Row_Cell {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #ffffff1c;
}
.Main_2 .Main_BodyPrint .Main_LogoPre {
  display: none;
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
}
@media only screen and (min-width: 768px) {
  .Main_MidEmptyItemAdd:first-child .Main_MidEmptyButtonSearch {
    padding: 44px 55px;
  }
}
</style>