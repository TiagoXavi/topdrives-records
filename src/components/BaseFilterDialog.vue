<template>
  <BaseDialog
    :active="active"
    :transparent="true"
    maxWidth="880px"
    @close="$emit('close')">
    <div class="Main_SearchBody">
      <div class="Main_SearchHeader">
        <div v-if="!isFiltering && !filterOnly" class="Main_SearchFieldBox">
          <input
            v-model="searchInput"
            :id="`SearchInput${id}`"
            :placeholder="$t('m_searchCar')"
            class="D_SearchInput data-hj-allow"
            type="text"
            autocomplete="off"
            @input="searchInputFunc()">
          <button
            v-if="searchInput && searchInput.length > 0 || alreadySearched"
            class="D_Button D_SearchInputClose"
            @click="closeFilterText()">
            <i class="ticon-close_2" aria-hidden="true"/>
          </button>
        </div>
        <button
          v-if="!isFiltering && !filterOnly"
          class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
          @click="openFilter()">
          <div>{{ $tc("m_filter", 2) }}</div>
          <div v-if="searchResult && searchResult.length > 0 && !showingLastest" style="font-size: 0.5em;">({{ searchResult.length }})</div>
          <span v-if="filterCount > 0" class="Main_FiltersButtonCount">{{ filterCount }}</span>
        </button>
        <button
          v-else
          class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
          @click="applyFilter()">{{ $t("m_done") }}</button>
      </div>
      <div v-if="isFiltering || filterOnly" class="Main_SearchMid">
        <div class="Main_FilterItems">
          <div v-if="!cgAddingYouCar || (user && user.mod)" class="Main_FilterClearTop">
            <slot name="header"></slot>
            <div class="BaseFilterDialog_ButtonsTop">
              <button
                v-if="requirementFilter && (!raceFilter2 || !raceFilter3)"
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
                @click="addDualFilter()">{{ $t("m_multi") }}</button>
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
                @click="clearFilter()">{{ $t("m_clear") }}</button>
            </div>
          </div>
          <div v-if="(hasFilter2 || hasFilter3) && filterOnly" class="Main_FilterChipsFlex">
            <div class="Main_FilterChipsLabel">{{ $t("m_filterPage") }}</div>
            <template v-for="n in 3">
              <BaseChip
                v-if="n === 1 || (n === 2 && hasFilter2) || (n === 3 && hasFilter3)"
                :inputValue="useWhatFilter"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                required="true"
                :value="n-1"
                :label="`${n}`"
                @click="changeUseFilter(n-1)" />
            </template>
          </div>
          <div v-if="type === 'library'" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in libraryTypes">
              <BaseChip
                v-model="searchFilters.typesModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`m_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.tunes === true && internalConfig.tunes !== false" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.tunes">
              <BaseChip
                class="BaseChip_MinWidth BaseChip_DontCrop"
                v-model="searchFilters.tunesModel"
                :value="item" />
            </template>
          </div>
          <div v-if="config.classes !== false && internalConfig.classes !== false" class="Main_FilterChips Main_FilterClassChips">
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
            v-if="config.rq !== false && internalConfig.rq !== false"
            v-model="searchFilters.rqModel"
            :min="searchFilters.rqStart"
            :max="searchFilters.rqEnd"
            label="RQ"
            class="Main_FilterSlider" />
          <BaseDualSlider
            v-if="config.year !== false && internalConfig.year !== false"
            v-model="searchFilters.yearModel"
            :min="searchFilters.yearStart"
            :max="searchFilters.yearEnd"
            :label="$tc('c_year', 1)"
            class="Main_FilterSlider"
            @ctrlClick="initSecretYear()" />
          <div v-if="secretYear" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in secretYearList">
              <BaseChip
                v-model="searchFilters.year2Model"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="item" />
            </template>
          </div>
          <div class="Main_FilterThree">
            <div v-if="config.tyres !== false && internalConfig.tyres !== false" class="Main_FilterChipsInside">
              <template v-for="(item, ix) in searchFilters.tyres">
                <BaseChip
                  v-model="searchFilters.tyresModel"
                  class="BaseChip_MinWidth"
                  :label="$t(`c_${item.toLowerCase()}2`)"
                  :value="item" />
              </template>

            </div>
            <div v-if="config.drives !== false && internalConfig.drives !== false" class="Main_FilterChipsInside">
              <template v-for="(item, ix) in searchFilters.drives">
                <BaseChip
                  v-model="searchFilters.drivesModel"
                  class="BaseChip_MinWidth"
                  :value="item" />
              </template>

            </div>
            <div v-if="config.clearances !== false && internalConfig.clearances !== false" class="Main_FilterChipsInside">
              <template v-for="(item, ix) in searchFilters.clearances">
                <BaseChip
                  v-model="searchFilters.clearancesModel"
                  class="BaseChip_MinWidth"
                  :label="$t(`c_${item.toLowerCase()}`)"
                  :value="item" />
              </template>

            </div>
          </div>
          <div v-if="config.topSpeed !== false && internalConfig.topSpeed !== false" class="Main_FilterDual">
            <BaseDualSlider
              v-model="searchFilters.topSpeedModel"
              :min="searchFilters.topSpeedStart"
              :max="searchFilters.topSpeedEnd"
              :label="$t('c_topSpeed')"
              class="Main_FilterSlider" />
            <BaseDualSlider
              v-model="searchFilters.acelModel"
              :min="searchFilters.acelStart"
              :max="searchFilters.acelEnd"
              :step="0.1"
              label="0-60mph"
              class="Main_FilterSlider" />
          </div>
          <div v-if="config.hand !== false && internalConfig.hand !== false" class="Main_FilterDual">
            <BaseDualSlider
              v-model="searchFilters.handModel"
              :min="searchFilters.handStart"
              :max="searchFilters.handEnd"
              :label="$t('c_handling')"
              class="Main_FilterSlider" />
            <BaseDualSlider
              v-model="searchFilters.mraModel"
              :min="searchFilters.mraStart"
              :max="searchFilters.mraEnd"
              label="MRA"
              class="Main_FilterSlider" />
          </div>
          <div v-if="config.weight !== false && internalConfig.weight !== false" class="Main_FilterDual">
            <BaseDualSlider
              v-model="searchFilters.weightModel"
              :min="searchFilters.weightStart"
              :max="searchFilters.weightEnd"
              :label="$t('c_weight')"
              class="Main_FilterSlider" />
            <BaseDualSlider
              v-model="searchFilters.seatsModel"
              :min="searchFilters.seatsStart"
              :max="searchFilters.seatsEnd"
              :label="$t('c_seats')"
              class="Main_FilterSlider" />
          </div>
          <BaseDualSlider
            v-if="(config.weight === false || internalConfig.weight === false) && config.seats !== false && internalConfig.seats !== false"
            v-model="searchFilters.seatsModel"
            :min="searchFilters.seatsStart"
            :max="searchFilters.seatsEnd"
            :label="$t('c_seats')"
            class="Main_FilterSlider" />
          <div v-if="config.countrys !== false && internalConfig.countrys !== false" class="Main_FilterChips2">
            <template v-for="(item, ix) in searchFilters.countrys">
              <BaseChip
                v-model="searchFilters.countrysModel"
                class="BaseChip_ChipFlag"
                :value="item" >
                <BaseFlag :flag="item" />
              </BaseChip>
            </template>
          </div>
          <div v-if="config.prizes !== false && (!cgAddingYouCar || !raceFilterResolved || !raceFilterResolved.prizesModel || raceFilterResolved.prizesModel.length === 0)" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.prizes">
              <BaseChip
                v-model="searchFilters.prizesModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.bodyTypes !== false && (!cgAddingYouCar || !raceFilterResolved || !raceFilterResolved.bodyTypesModel || raceFilterResolved.bodyTypesModel.length === 0)" class="Main_FilterChipsFlex" style="margin: 0 10px;">
            <template v-for="(item, ix) in searchFilters.bodyTypes">
              <BaseChip
                v-model="searchFilters.bodyTypesModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.fuel !== false && (!cgAddingYouCar || !raceFilterResolved || !raceFilterResolved.fuelModel || raceFilterResolved.fuelModel.length === 0)" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.fuel">
              <BaseChip
                v-model="searchFilters.fuelModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.engine !== false && (!cgAddingYouCar || !raceFilterResolved || !raceFilterResolved.engineModel || raceFilterResolved.engineModel.length === 0)" class="Main_FilterChipsFlex" style="position: relative; margin-top: 5px;">
            <div class="Main_FilterChipsLabel">{{ $t("c_enginePos") }}</div>
            <template v-for="(item, ix) in searchFilters.engine">
              <BaseChip
                v-model="searchFilters.engineModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}Engine`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.tags !== false && (!cgAddingYouCar || !raceFilterResolved || !raceFilterResolved.tagsModel || raceFilterResolved.tagsModel.length === 0)" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.tags">
              <BaseChip
                v-model="tagsModel"
                v-if="!$store.state.oldTags.includes(item) || $store.state.showOldTags"
                :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '')}`"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                :value="item" />
            </template>
            <button class="BaseChip BaseChip_MinWidth BaseFilterDialog_TransparentChip" @click="enableMulti()">{{ $t("m_multi") }}</button>
          </div>
          <div v-if="multi" class="Main_FilterChipsFlex">
            <template v-for="numb in multiPages">
              <BaseChip
                v-model="multiPage"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                :value="numb">
                <span>{{ numb }}</span>
                <div v-if="searchFilters[getTagsModelKey(numb)].length > 0" class="D_ButtonNote">{{ searchFilters[getTagsModelKey(numb)].length }}</div>
              </BaseChip>
            </template>
          </div>
          <div v-if="config.brands !== false && (!cgAddingYouCar || !raceFilterResolved || !raceFilterResolved.brandsModel || raceFilterResolved.brandsModel.length === 0)" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.brands">
              <BaseChip
                v-model="searchFilters.brandsModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="item" />
            </template>
          </div>
          <div v-if="type === 'classic'" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in customTagsList">
              <BaseChip
                v-model="searchFilters.customTagsModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="item" />
            </template>
          </div>
          <div class="D_Center" style="gap: 15px;">
            <button
              v-if="!cgAddingYouCar"
              class="D_Button D_ButtonDark D_ButtonDarkTransparent D_ButtonBig"
              @click="clearFilter()">{{ $t("m_clear") }}</button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
              @click="applyFilter()">{{ $t("m_done") }}</button>
          </div>
        </div>
      </div>
      <div v-else-if="loading" class="Main_SearchMid Main_SearchMidT">
        <BaseContentLoader
          :contents="true"
          itemWidth="220px"
          :itemHeight="210"
          style="padding: 10px 10px 10px 20px; width: 100%;"
          type="block"
          count="6" />
      </div>
      <!-- library -->
      <div v-else-if="galleryList.length > 0 && type === 'library'" class="Main_SearchMid Main_SearchMidT">
        <BaseGalleryItem
          v-for="item in galleryList"
          :config="item"
          :showDelete="user && (item.user === user.username || user.mod)"
          :showApprove="item.approve && user && user.mod"
          @delete="$emit('mutateTemplate', { config: $event, isDelete: true });"
          @approve="$emit('mutateTemplate', { config: $event, isDelete: false });"
          @push="$emit('templateClick', $event); $emit('close');" />
        <div v-if="galleryLastKey" class="D_Center" style="width: 100%">
          <button
            :class="`${ loadingShowMore ? 'D_Button_Loading ' : '' }`"
            class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
            @click="changeFilterT(galleryLastKey)">{{ $t("m_showMore") }}</button>
        </div>
      </div>
      <!-- classic -->
      <div v-else-if="searchResult.length > 0" class="Main_SearchMid">
        <div v-if="showingLastest" class="Main_SearchLastestTitle">{{ $t("m_lastContribution") }}</div>
        <div v-else-if="sortEnabled" class="BaseFilterDialog_ToolBox">
          <div class="BaseFilterDialog_SortBox">
            <!-- <div class="BaseFilterDialog_ToolTitle">{{ $t("m_sort") }}</div> -->
            <div class="BaseFilterDialog_ToolList">
              <template v-for="item in sortList">
                <BaseChip
                  :inputValue="sortModel"
                  :value="item"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_SortStyle"
                  @click="sortClick(item)">
                  <span>{{ $tc(`c_${item}`, 1) }}</span>
                  <i
                    v-if="sortModel === item"
                    :class="`ticon-sort${sortInverted ? '_inverted' : ''} BaseFilterDialog_SortIcon`"
                    aria-hidden="true"/>
                </BaseChip>
              </template>
              <button
                class="D_Button BaseFilterDialog_MoreButton" @click="showMoreSort = !showMoreSort">
                <i :class="{ BaseFilterDialog_MoreActive: showMoreSort }" class="ticon-keyboard_arrow_down BaseFilterDialog_MoreIcon" aria-hidden="true"/>
              </button>
            </div>
            <div class="BaseFilterDialog_SortBoxRight">
              <BaseConfigCheckBox v-model="statsView" name="statsView" :label="$t('m_statsView')" />
            </div>
          </div>
          <BaseExpandDiv :active="showMoreSort">
            <div class="BaseFilterDialog_SortBox BaseFilterDialog_SortMoreBox">
              <div class="BaseFilterDialog_ToolList">
                <template v-for="item in sortListMore">
                  <template v-if="typeof item === 'string'">
                    <BaseChip
                      :inputValue="sortModel"
                      :value="item"
                      class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_SortStyle"
                      @click="sortClick(item)">
                      <span>{{ $tc(`c_${item}`, 1) }}</span>
                      <i
                        v-if="sortModel === item"
                        :class="`ticon-sort${sortInverted ? '_inverted' : ''} BaseFilterDialog_SortIcon`"
                        aria-hidden="true"/>
                    </BaseChip>
                  </template>
                  <template v-else>
                    <BaseChip
                      :inputValue="sortModel"
                      :value="item.join('_')"
                      class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_SortStyle"
                      @click="sortClick(item)">
                      <span>
                        <template v-for="(word, ix) in item">
                          <template v-if="ix > 0">*</template>
                          <template>{{ $tc(`c_${word}`, 1) }}</template>
                        </template>
                      </span>
                      <i
                        v-if="sortModel === item.join('_')"
                        :class="`ticon-sort${sortInverted ? '_inverted' : ''} BaseFilterDialog_SortIcon`"
                        aria-hidden="true"/>
                    </BaseChip>
                  </template>
                </template>
              </div>
            </div>
          </BaseExpandDiv>
        </div>
        <div v-if="showStats && !showingLastest" class="BaseFilterDialog_ColumnHeaders">
          <div class="Main_SearchItemImg" style="background-color: transparent; height: 1px;"></div>
          <div class="Main_SearchItemLeft"></div>
          <div v-if="sortModelSpecial" class="Main_SearchItemColumn BaseFilterDialog_ColumnHeader Main_SearchItemValue_Special">
            <span class="BaseFilterDialog_ColumnHeaderTxt">Score</span>
          </div>
          <div
            v-for="column in columns"
            :class="`Main_SearchItemValue_${column.type} ${sortModel === column.type ? 'Main_SearchItemColumnActive' : ''}`"
            class="Main_SearchItemColumn BaseFilterDialog_ColumnHeader"
            @click="sortClick(column.type)">
            <span class="BaseFilterDialog_ColumnHeaderTxt">{{ column.nick }}</span>
          </div>
        </div>
        <template v-for="(item, index) in searchResult">
          <button
            v-if="index < searchMax || showAllFilter"
            :style="{ '--color': item.classColor }"
            :class="{ Main_SearchItemAdded: item.added }"
            class="Main_SearchItem"
            @click="item.added ? '' : addCar(index, $event)">
            <div v-if="!showAllFilter" class="Main_SearchItemImg">
              <img :src="item.ridPhoto" class="MainGallery_Img" alt="">
            </div>
            <div v-else class="Main_ImgPlaceholder"></div>
            <div class="Main_SearchItemLeft">{{ item.class }}{{ item.rq }}</div>
            <div v-if="!showingLastest && sortModel && sortModel !== 'rq' && sortModel !== 'name' && (!showStats || sortModelSpecial)" :class="`Main_SearchItemValue_${sortModel} ${sortModelSpecial ? 'Main_SearchItemValue_Special' : ''}`" class="Main_SearchItemValue">
              <template v-if="sortModel === 'acel' && typeof item[sortModel] === 'number'">{{ item[sortModel].toFixed(1) }}</template>
              <template v-else-if="sortModel === 'mra' && typeof item[sortModel] === 'number'">{{ item[sortModel].toFixed(2) }}</template>
              <template v-else>{{ item[sortModel] }}</template>
            </div>
            <div v-if="!showStats || showingLastest" class="Main_SearchItemRight">
              <span v-html="item.locatedName" /><i v-if="item.prize" class="ticon-trophy Main_SearchTrophy" aria-hidden="true"/>&nbsp;<span v-if="sortModel !== 'year' || showingLastest" class="Main_SearchItemYear">{{ item.year }}</span>&nbsp;<span v-if="item.lastestUser" class="Main_SearchResultUser"><span style="color: rgba(255,255,255,0.5)">by</span>&nbsp;<span :class="`Main_UserT${highlightsUsers[item.lastestUser]}`">{{ item.lastestUser }}</span></span><span v-else-if="item.mra && sortModel !== 'mra'" class="Main_SearchItemYear">{{ item.mra }}</span>
            </div>
            <template v-else>
              <div
                v-for="column in columns"
                :class="`Main_SearchItemValue_${column.type} ${sortModel === column.type ? 'Main_SearchItemColumnActive' : ''}  Main_SearchItemMedal_${item[column.type+'_']}`"
                class="Main_SearchItemColumn">{{ typeof item[column.type] === 'number' ? item[column.type].toFixed(column.fixed) : (item[column.type] || "~") }}</div>
            </template>
          </button>
        </template>
        <div v-if="!showAllFilter">
          <button
            v-if="searchResult.length > searchMax"
            class="D_Button D_ButtonDark D_ButtonDark2 Main_SearchMore"
            @click="searchMax = searchMax + 41">{{ $t("m_showMore") }}</button>
        </div>
      </div>
      <div v-else-if="alreadySearched" class="Main_SearchEmpty">
        <i class="ticon-search_big Main_SearchEmptyAddIcon" aria-hidden="true"/>
        <div class="Main_SearchEmptyText">{{ $t("m_nothingFound") }}</div>
      </div>
      <div v-else class="Main_SearchEmpty">
        <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from './BaseDialog.vue'
import BaseChip from './BaseChip.vue'
import BaseDualSlider from './BaseDualSlider.vue'
import BaseFlag from './BaseFlag.vue'
import BaseContentLoader from './BaseContentLoader.vue'
import BaseGalleryItem from './BaseGalleryItem.vue'
import BaseExpandDiv from './BaseExpandDiv.vue'
import BaseCheckBox from './BaseCheckBox.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'
import custom_tags from '../database/custom_tags.json'

var id = 0;

export default {
  name: 'BaseFilterDialog',
  components: {
    BaseDialog,
    BaseChip,
    BaseDualSlider,
    BaseFlag,
    BaseContentLoader,
    BaseGalleryItem,
    BaseExpandDiv,
    BaseCheckBox,
    BaseConfigCheckBox
  },
  model: {
    prop: 'active',
    event: 'close'
  },
  props: {
    active: {
      type: [Boolean, String],
      default: false
    },
    lastestList: {
      type: Array,
      default() {
        return []
      }
    },
    highlightsUsers: {
      type: Object,
      default() {
        return {}
      }
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    all_cars: {
      type: Array,
      default() {
        return []
      }
    },
    raceFilter: {
      type: Object,
      default() {
        return {}
      }
    },
    raceFilter2: {
      type: [Object, Boolean],
      default: false
    },
    raceFilter3: {
      type: [Object, Boolean],
      default: false
    },
    useWhatFilter: {
      type: Number,
      default: 0
    },
    cgAddingOppoCar: {
      type: Boolean,
      default: false
    },
    cgAddingYouCar: {
      type: Boolean,
      default: false
    },
    filterOnly: {
      type: Boolean,
      default: false
    },
    libraryApprove: {
      type: Boolean,
      default: false
    },
    sortEnabled: {
      type: Boolean,
      default: true
    },
    requirementFilter: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "classic"
    },
    initialFilterString: {
      type: String,
      default: null
    },
    initialFilterString2: {
      type: String,
      default: null
    },
    initialFilterString3: {
      type: String,
      default: null
    },
    ridsMutationName: {
      type: String,
      default: "FILTER_EMIT_RIDS"
    },
    importFilterName: {
      type: String,
      default: "FILTER_IMPORT"
    },

  },
  data() {
    return {
      id: 0,
      loading: false,
      loadingShowMore: false,
      firstTimeOpen: true,
      searchInput: '',
      isFiltering: false,
      debounceFilter: null,
      searchMax: 20,
      showAllFilter: false,
      searchResult: [],
      searchResultLength: null,
      // searchFocus: false,
      secretYear: false,
      secretYearList: [],
      user: null,
      unsubscribe: null,
      galleryList: [],
      galleryLastKey: undefined,
      showingLastest: false,
      alreadySearched: false,
      cgIsFiltering: false,
      filterCount: 0,
      sortModel: null,
      sortModelSpecial: null,
      sortInverted: false,
      showMoreSort: false,
      factor: false,
      statsView: false,
      showFilterInstance: false,
      instance: 1,
      filterInstances: [1, 2],
      multi: false,
      multiPage: 1,
      multiPages: [1, 2, 3],
      sortList: [
        "topSpeed",
        "acel",
        "hand",
        "mra",
        "weight"
      ],
      sortListMore: [
        "rq",
        "year",
        "name",
        ["mra", "acel"],
        ["mra", "acel", "topSpeed"],
        ["mra", "topSpeed"],
        ["hand", "acel"],
        ["hand", "weight"],
        ["hand", "weight", "acel"],
        ["hand", "mra", "acel"],
        ["hand", "ola"],
      ],
      columns: [
        { type: "topSpeed", fixed: 0, nick: "Speed" },
        { type: "acel", fixed: 1, nick: "0-60" },
        { type: "hand", fixed: 0, nick: "Hand" },
        { type: "mra", fixed: 2, nick: "MRA" },
        { type: "weight", fixed: 0, nick: "Weight" },
        { type: "year", fixed: 0, nick: "Year" },
      ],
      clearFilterObj: {},
      internalConfig: {},
      searchFilters: {
        yearStart: 1910,
        yearEnd: 2024,
        yearModel: [],
        rqStart: 10,
        rqEnd: 119,
        rqModel: [],
        topSpeedStart: 50,
        topSpeedEnd: 330,
        topSpeedModel: [],
        acelStart: 1.5,
        acelEnd: 40,
        acelModel: [],
        handStart: 30,
        handEnd: 110,
        handModel: [],
        mraStart: 0,
        mraEnd: 160,
        mraModel: [],
        weightStart: 300,
        weightEnd: 7000,
        weightModel: [],
        seatsStart: 1,
        seatsEnd: 9,
        seatsModel: [],
        tunes: ["332", "323", "233", "111", "Custom"],
        tunesModel: [],
        classes: ["F","E","D","C","B","A","S"],
        classesColors: ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFC717"],
        classesModel: [],
        tyres: ["Performance", "Standard", "All-surface", "Off-road", "Slick"],
        tyresModel: [],
        drives: ["FWD", "RWD", "4WD"],
        drivesModel: [],
        clearances: ["Low", "Mid", "High"],
        clearancesModel: [],
        countrys: ["DE", "JP", "US", "GB", "IT", "FR", "AU", "KR", "SE", "CZ", "NL", "MY", "AT", "DK", "CN", "HR", "NZ", "AE", "BR", "CH", "ZA"],
        countrysModel: [],
        prizes: ["Prize Cars", "Non-Prize Cars"],
        prizesModel: [],
        customTagsModel: [],
        bodyTypes: ["Convertible", "Coupe", "Estate", "Hatchback", "MPV", "Pickup", "Roadster", "Saloon", "SUV", "Van"],
        bodyTypesModel: [],
        fuel: ["Bioethanol", "Diesel", "Electric", "Hybrid", "Hydrogen", "Misc", "Petrol"],
        fuelModel: [],
        engine: ["Front", "Mid", "Mid-rear", "Mixed", "Rear"],
        engineModel: [],
        typesModel: [],
        approveModel: false,
        tags: [
          "5th Anniversary",
          "Amalfi Coast Cruising",
          "American Dream",
          "American Frontier",
          "Around the World",
          "As Seen on YT",
          "Asia-Pacific Grand Prix",
          "Call of the Wild",
          "Chariots of the Gods",
          "Christmas Collection",
          "Christmas Collection 22",
          "Concept",
          "Cutting Edge",
          "Drivers Choice",
          "Eco Friendly",
          "Electric Excellence",
          "Enter the Black Forest",
          "European Revolution",
          "European New Wave",
          "Famous Tracks",
          "French Renaissance",
          "German Renaissance",
          "Great Exhibition",
          "Hot Hatch",
          "Hypercar",
          "Immortalised in Carbon",
          "In the Shadows",
          "Innovative",
          "Interstellar",
          "Italian Renaissance",
          "Japan Pro Tour",
          "Learn the Savannah Way",
          "Loch to Loch",
          "Loves Me, Loves Me Not",
          "Motorsport",
          "Muscle Car",
          "Nightmare Fuel",
          "Old Guard",
          "Originals",
          "Pacific Coast Highway",
          "Photo Finish",
          "Racing Royalty",
          "Rest of the World",
          "Ride of the Valkyries",
          "Riders on the Storm",
          "Road",
          "Roads Most Travelled",
          "Silver Screen",
          "Sleeper",
          "Street Racer",
          "Style Icon",
          "Sub-Zero",
          "Summer Games",
          "Supercar",
          "Team Favourite",
          "The Great Outdoors",
          "The Horror Show",
          "The Unicorns",
          "Two Tone",
          "Ultra Expensive",
          "Wild Ride",
          "World Expo",
          "Year of the Ox",
          "Year of the Rabbit",
          "Year of the Rat",
          "Year of the Tiger",
          "Beige",
          "Black",
          "Blue",
          "Brown",
          "Gold",
          "Green",
          "Orange",
          "Pink",
          "Purple",
          "Red",
          "Silver or Grey",
          "Turquoise",
          "White",
          "Yellow"
        ],
        tagsModel: [],
        tags2Model: [],
        tags3Model: [],
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
          "BAC",
          "Bizzarrini",
          "Bentley",
          "BMW",
          "Brabham",
          "Bristol",
          "Bufori",
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
          "Ginetta",
          "Giocattolo",
          "GMC",
          "Hennessey",
          "Holden",
          "Honda",
          "Hudson",
          "Hummer",
          "Hyundai",
          "Infiniti",
          "Jaguar",
          "Koenigsegg",
          "KTM",
          "Lamborghini",
          "Lancia",
          "Land Rover",
          "Lincoln",
          "Lotus",
          "Maserati",
          "Mazda",
          "McLaren",
          "McMurtry",
          "Mercedes-Benz",
          "Mercury",
          "MG",
          "Mini",
          "Mitsubishi",
          "Morgan",
          "Nissan",
          "Oldsmobile",
          "Pagani",
          "Peugeot",
          "Pininfarina",
          "Plymouth",
          "Pontiac",
          "Porsche",
          "Radical",
          "RAM",
          "Renault",
          "Rezvani",
          "Rimac",
          "Rover",
          "RUF",
          "Saleen",
          "Saturn",
          "SCG", // logic "Scuderia Cameron Glickenhaus"
          "Skoda",
          "Smart",
          "Spyker",
          "Subaru",
          "Suzuki",
          "Talbot",
          "TVR",
          "Ultima",
          "Vauxhall",
          "Volkswagen",
          "Volvo",
          "W Motors",
          "Zenos",
          "Zenvo"
        ],
        brandsModel: [],
      },
      libraryTypes: [
        "Best of",
        "Event",
        "Other"
      ],
      custom_tags
    }
  },
  watch: {
    lastestList: function() {
      this.calcLastest();
    },
    active: function() {
      if (this.active) {
        this.openDialogSearch();
      }
    }
  },
  beforeMount() {
    this.clearFilter();
    id++;
    this.id = id;

    let statsView = window.localStorage.getItem("statsView");
    if (statsView) {
      statsView = JSON.parse(statsView);
      this.statsView = statsView;
    }
  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500);
    this.user = this.$store.state.user;

    if (this.libraryApprove) {
      this.searchFilters["approveModel"] = true;
    }

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

      if (mutation.type == "REFRESH_LIBRARY") {
        vm.changeFilterT();
      }

      if (mutation.type == "LIBRARY_NEW_DIALOG") {
        vm.firstTimeOpen = true;
      }

      if (mutation.type == vm.ridsMutationName) {
        if (vm.type === 'event') {
          this.cgResetFilterForAdd();
          this.applyFilter();
          return;
        }
        if (vm.type === 'cg') {
          vm.cgResetFilterForAdd();
        }
        let rqMax = mutation.payload.rqMax || 130;
        let rqMin = mutation.payload.rqMin || 10;
        let total = mutation.payload.total || 5000;
        let listOfRids = [];
        vm.all_cars.map((x, ix) => {
          if (x.rq > rqMax || x.rq < rqMin) return;
          if (vm.checkMatchFilter(x) && listOfRids.length < total) {
            listOfRids.push({ rid: x.rid, rq: x.rq });
          }
        })
        vm.$emit("listRids", listOfRids);
      }

      if (mutation.type == vm.importFilterName) {
        vm.clearFilter();
        vm.searchFilters = {
          ...vm.searchFilters,
          ...mutation.payload.filter
        };
        vm.searchStr = "";
        if (mutation.payload.filter.year2Model) {
          this.initSecretYear(true);
        }
        setTimeout(() => {
          vm.applyFilter();
        }, 101);
      }

    })
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    customTagsList() {
      return Object.keys(this.custom_tags);
    },
    showStats() {
      return this.statsView && this.sortEnabled;
    },
    tagsModel: {
      get: function() {
        if (this.multiPage === 1) {
          return this.searchFilters.tagsModel;
        }
        if (this.multiPage === 2) {
          return this.searchFilters.tags2Model;
        }
        if (this.multiPage === 3) {
          return this.searchFilters.tags3Model;
        }
      },
      set: function(newValue) {
        if (this.multiPage === 1) {
          this.searchFilters.tagsModel = newValue;
        }
        if (this.multiPage === 2) {
          this.searchFilters.tags2Model = newValue;
        }
        if (this.multiPage === 3) {
          this.searchFilters.tags3Model = newValue;
        }
      }
    },
    raceFilterResolved: {
      get: function() {
        if (this.useWhatFilter === 0) {
          return this.raceFilter;
        }
        if (this.useWhatFilter === 1) {
          return this.raceFilter2;
        }
        if (this.useWhatFilter === 2) {
          return this.raceFilter3;
        }
      },
      set: function(newValue) {

      }
    },
    hasFilter2() {
      return this.filterOnly && this.raceFilter2;
    },
    hasFilter3() {
      return this.filterOnly && this.raceFilter3;
    },
    initialFilterStringResolved() {
      if (this.useWhatFilter === 0) {
        return this.initialFilterString;
      }
      if (this.useWhatFilter === 1) {
        return this.initialFilterString2;
      }
      if (this.useWhatFilter === 2) {
        return this.initialFilterString3;
      }
    }
  },
  methods: {
    openDialogSearch() {
      if (this.type === 'cg' || this.type === 'event') {
        this.cgResetFilterForAdd();
      }
      if (this.firstTimeOpen && this.type === 'library') {
        this.changeFilterT();
      }
      this.firstTimeOpen = false;

      this.isFiltering = false;
      this.searchInput = '';
      if (!this.filterOnly) {
        setTimeout(() => {
          try {
            document.querySelector(`#SearchInput${this.id}`).focus();  
          } catch (error) {}
        }, 10);
      }
      setTimeout(() => {
        document.querySelectorAll(".Main_SearchMid").forEach(x => {x.scrollTo({ top: 0 })});
      }, 10);

    },
    closeDialogSearch() {
      this.cgIsFiltering = false;
      this.kingIsFiltering = false;
      this.cgAddingYouCar = false;
      this.cgAddingOppoCar = false;
    },
    searchInputFunc(e) {
      this.debounceFilter();
    },
    openFilter() {
      this.isFiltering = !this.isFiltering;
      document.querySelectorAll(".Main_SearchMid").forEach(x => {x.scrollTo({ top: 0 })});
    },
    applyFilter() {
      if (this.filterOnly) {
        this.changeFilter();

        let clearFilterInitial;
        if (this.initialFilterStringResolved) clearFilterInitial = this.resolveFilterCount(JSON.parse(this.initialFilterStringResolved));
        if (JSON.stringify(clearFilterInitial, Object.keys(clearFilterInitial || []).sort()) !== JSON.stringify(this.clearFilterObj, Object.keys(this.clearFilterObj || []).sort())) {
          this.$emit("clearFilterUpdate", this.insertKeyModel(this.clearFilterObj));
        } else {
          this.$emit("clearFilterUpdate", null);  
        }

        this.$emit("filterUpdate", this.searchFilters);
      } else if (this.type === 'classic' || this.type === 'library' || this.cgAddingYouCar || this.cgAddingOppoCar) {
        this.changeFilter();
        this.isFiltering = false;
        document.querySelectorAll(".Main_SearchMid").forEach(x => {x.scrollTo({ top: 0 })});
      } else {
        // configuring requirements
        this.searchActive = false;
        this.cgAddingYouCar = false;
        this.cgAddingOppoCar = false;

        if (JSON.stringify(this.raceFilter) !== this.cgRoundFilterString) {
          this.$emit('cgRoundFilterToSave', JSON.parse(JSON.stringify(this.raceFilter)));
        } else {
          this.$emit('cgRoundFilterToSave', null);
        }

        setTimeout(() => {
          this.isFiltering = false;
          this.cgIsFiltering = false;
        }, 99);
      }
    },
    changeFilter() {
      if (this.type === 'library') {
        this.changeFilterT();
        return;
      }
      let vm = this;

      // console.log("changeFilter");
      // this.searchLoading = false;
      let result = [];
      let bestTopSpeed = [];
      let bestAccel = [];
      let bestHand = [];
      let bestMra = [];
      let bestWeight = [];
      // let searchStr = this.searchInput.toLowerCase().replace(/  +/g, ' ').split(" ");
      let searchStr = this.searchInput.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let strIndex = -1;
      let prePush;
      let tryFind;
      let foundExact = false;
      let sortString = this.sortModel ? this.sortModel.toString() : '';
      this.clearFilterObj = this.resolveFilterCount();
      if (this.type === 'cg' && this.cgAddingYouCar) {
        vm.internalConfig = {};
        Object.keys(this.clearFilterObj).forEach(key => {
          vm.internalConfig[key] = false;
        })
      }
      if (searchStr === "" && this.filterCount === 0 && !this.cgAddingYouCar && !this.cgAddingOppoCar) {
        this.searchLoading = false;
        this.closeFilterText();
        return [];
      }

      // search and/or filter
      this.all_cars.map((x, ix) => {

        if (foundExact) return;
        // if (sortString.includes("mra") && !x.mra) return;
        // if (sortString.includes("acel") && !x.acel) return;
        if (x.rid === this.searchInput) {
          result = [];
          foundExact = true;
        }

        let shouldPush = foundExact;
        if (searchStr && searchStr !== "") {
          strIndex = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(searchStr);
        } else {
          strIndex = -2;
        }

        if (this.filterCount > 0 || this.cgAddingOppoCar || this.cgAddingYouCar) {
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

        if (searchStr === "nomra") {
          if (x.mra === null && x.topSpeed > 100) {
            if (this.checkMatchFilter(x)) {
              shouldPush = true;
            }
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

          bestTopSpeed.push(prePush.topSpeed);
          bestHand.push(prePush.hand);
          bestWeight.push(prePush.weight);
          if (prePush.acel) bestAccel.push(prePush.acel);
          if (prePush.mra) bestMra.push(prePush.mra);

          result.push(prePush);
        }


      })

      this.searchResultLength = result.length;

      bestTopSpeed.sort((a, b) => b - a);
      bestHand.sort((a, b) => b - a);
      bestWeight.sort((a, b) => a - b);
      bestAccel.sort((a, b) => a - b);
      bestMra.sort((a, b) => b - a);

      bestTopSpeed = [...new Set(bestTopSpeed)];
      bestHand = [...new Set(bestHand)];
      bestWeight = [...new Set(bestWeight)];
      bestAccel = [...new Set(bestAccel)];
      bestMra = [...new Set(bestMra)];

      bestTopSpeed = bestTopSpeed.splice(0, 3);
      bestHand = bestHand.splice(0, 3);
      bestWeight = bestWeight.splice(0, 3);
      bestAccel = bestAccel.splice(0, 3);
      bestMra = bestMra.splice(0, 3);

      // class and photo
      result.map(x => {
        x.topSpeed_ = bestTopSpeed.indexOf(x.topSpeed);
        x.hand_ = bestHand.indexOf(x.hand);
        x.weight_ = bestWeight.indexOf(x.weight);
        x.acel_ = bestAccel.indexOf(x.acel);
        x.mra_ = bestMra.indexOf(x.mra);

        Vue.set(x, "class", Vue.resolveClass(x.rq, x.class, "letter"));
        Vue.set(x, "classColor", Vue.resolveClass(x.rq, x.class, "color"));    
        try {
          Vue.set(x, "ridPhoto", '');
          setTimeout(() => {
            if (x.photoId) Vue.set(x, "ridPhoto", require('@/incoming_pics/' + x.photoId + '.jpg'));
            else Vue.set(x, "ridPhoto", require('@/imgs_final/' + x.rid + '.jpg'));
          }, 1);
        } catch (error) {
          Vue.set(x, "ridPhoto", '');
        }    
      })

      let kSort = this.sortModel;
      let reversed = this.sortInverted;
      // inteligent sort (default)
      if (searchStr && searchStr !== "" && kSort === null) {
        result.sort(function(a, b) {
          if (a.locatedPlus && !b.locatedPlus) return -1;
          if (b.locatedPlus && !a.locatedPlus) return 1;
          return a.locatedIndex - b.locatedIndex;
        });
      }
      // sort alphabetical
      if (!searchStr && kSort === null) {
        result.sort(function(a, b) {
          if (a.rq === b.rq) {
            return a.name.localeCompare(b.name);
          }
        });
      }
      // sort
      if (kSort) {
        let plus = 1;
        let minus = -1;
        if (kSort === "acel") {
          reversed = !reversed;
          plus = -1;
          minus = 1;
        }
        if (this.sortModelSpecial) {
          result.map(car => {
            let newValue = 0;
            this.sortModelSpecial.map((item, xItem) => {
              let reducedValue = car[item] || 0;

              if (kSort === 'mra_acel'){
                if (item === "mra") reducedValue = Math.pow(reducedValue, 0.6) / 2;
                if (item === "acel") reducedValue = reducedValue / 25;
              }
              if (kSort === 'mra_acel_topSpeed'){
                if (item === "acel") reducedValue = reducedValue / 1;
                if (item === "topSpeed") reducedValue = reducedValue / 50;
              }
              if (kSort === 'mra_topSpeed'){
                if (item === "topSpeed") reducedValue = Math.pow(reducedValue, 2) / 20000;
              }
              if (kSort === 'hand_acel') {
                if (item === "hand") reducedValue = Math.pow(reducedValue, 3) / 100;
                if (item === "acel") reducedValue = reducedValue * 10;
              }
              if (kSort === 'hand_weight') {
                if (item === "hand") reducedValue = Math.pow(reducedValue, 3) / 100;
                if (item === "weight") reducedValue = Math.pow(reducedValue - 200, 0.4) * 3;
              }
              if (kSort === 'hand_weight_acel') {
                if (item === "hand") reducedValue = Math.pow(reducedValue, 3) / 10;
                if (item === "acel") reducedValue = reducedValue * 5;
                if (item === "weight") reducedValue = Math.pow(reducedValue - 200, 0.4);
              }
              if (kSort === 'hand_mra_acel') {
                if (item === "hand") reducedValue = Math.pow(reducedValue, 3) / 90000;
                if (item === "mra") reducedValue = Math.pow(reducedValue, 2) / 9000;
                if (item === "acel") reducedValue = reducedValue / 90;
              }
              if (kSort === 'hand_ola') {
                if (item === "hand") reducedValue = Math.pow(reducedValue, 3) / 5000;
                if (item === "ola") {
                  if (car.topSpeed < 101) reducedValue = 0;
                  else if (!car.mra) reducedValue = 0;
                  else reducedValue = (Math.pow(car.topSpeed - 100, 0.4) * 10) / (car.mra || 10000);
                }
              }

              if (xItem === 0) {
                newValue = reducedValue;
              } else {
                if (item === "acel" || item === "weight") {
                  newValue = newValue / (reducedValue || 10000);
                } else {
                  newValue = newValue * reducedValue;
                }
              }
            })
            if (isNaN(newValue)) {
              newValue = 0;
            }
            if (kSort === 'mra_acel') {
              newValue = newValue * 4;
            }
            if (kSort === 'mra_acel_topSpeed') {
              newValue = newValue * 2;
            }
            // if (kSort === 'mra_topSpeed') {
            //   newValue = newValue / 2;
            // }
            if (kSort === 'hand_weight_acel') {
              newValue = newValue * 0.6;
            }
            car[kSort] = Math.round(newValue);
          })
        }

        result.sort(function(a, b) {
          if (kSort === "name") {
            if (reversed) {
              return b.name.localeCompare(a.name);
            } else {
              return a.name.localeCompare(b.name);
            }
          } else {
            if (reversed) {
              if (a[kSort] && !b[kSort]) return plus;
              if (b[kSort] && !a[kSort]) return minus;
              return a[kSort] - b[kSort];
            } else {
              if (b[kSort] && !a[kSort]) return plus;
              if (a[kSort] && !b[kSort]) return minus;
              return b[kSort] - a[kSort];
            }
          }
        });
        result.map(car => {
          if (car[kSort] === 0) car[kSort] = "~";
        })
      }

      this.searchMax = 20;

      this.searchResult = result;
      this.searchLoading = false;
      this.showingLastest = false;
      this.alreadySearched = true;
      this.showAllFilter = false;

    },
    changeFilterT(lastKey = false) {
      let vm = this;
      if (!lastKey) this.loading = true;
      else this.loadingShowMore = true;
      let searchStr = this.searchInput.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let clearFilters = this.resolveFilterCount();
      

      let params = {
        input: searchStr
      };
      Object.keys( clearFilters ).forEach( key => {
        if (key === "rq" || key === "year") {
          params[`min${key}`] = clearFilters[key][0];
          params[`max${key}`] = clearFilters[key][1];
        } else if (key === "classes") {
          params["class"] = clearFilters[key];
        } else if (key === "approve") {
          params["approve"] = clearFilters[key];
        } else {
          params[key.slice(0, -1)] = clearFilters[key];
        }
      })

      if (lastKey) {
        params.LastEvaluatedKey = lastKey;
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
              ...Vue.decodeTdr(x.template),
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
        this.loading = false;
        this.loadingShowMore = false;
      });

    },
    calcLastest() {
      let result = [];
      let prePush;

      this.lastestList.map(y => {
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
            if (x.photoId) Vue.set(x, "ridPhoto", require('@/incoming_pics/' + x.photoId + '.jpg'));
            else Vue.set(x, "ridPhoto", require('@/imgs_final/' + x.rid + '.jpg'));
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
    defaultFilters(type) {
      if (type === "yearModel") return [1910, 2024];
      if (type === "rqModel") return [10, 119];
      if (type === "topSpeedModel") return [50, 330];
      if (type === "acelModel") return [1.5, 40];
      if (type === "handModel") return [30, 110];
      if (type === "mraModel") return [0, 160];
      if (type === "weightModel") return [300, 7000];
      if (type === "seatsModel") return [1, 9];
    },
    addDualFilter() {
      this.$emit("dual");
    },
    clearFilter(e) {
      this.searchFilters.yearModel = this.defaultFilters("yearModel");
      this.searchFilters.rqModel = this.defaultFilters("rqModel");
      this.searchFilters.topSpeedModel = this.defaultFilters("topSpeedModel");
      this.searchFilters.acelModel = this.defaultFilters("acelModel");
      this.searchFilters.handModel = this.defaultFilters("handModel");
      this.searchFilters.mraModel = this.defaultFilters("mraModel");
      this.searchFilters.weightModel = this.defaultFilters("weightModel");
      this.searchFilters.seatsModel = this.defaultFilters("seatsModel");
      this.searchFilters.tunesModel = [];
      this.searchFilters.classesModel = [];
      this.searchFilters.tyresModel = [];
      this.searchFilters.drivesModel = [];
      this.searchFilters.clearancesModel = [];
      this.searchFilters.countrysModel = [];
      this.searchFilters.prizesModel = [];
      this.searchFilters.customTagsModel = [];
      this.searchFilters.bodyTypesModel = [];
      this.searchFilters.fuelModel = [];
      this.searchFilters.engineModel = [];
      this.searchFilters.tagsModel = [];
      this.searchFilters.tags2Model = [];
      this.searchFilters.tags3Model = [];
      this.searchFilters.brandsModel = [];
      this.searchFilters.typesModel = [];
      this.searchFilters.approveModel = false;
      if (this.searchFilters.year2Model) this.searchFilters.year2Model = [];
    },
    resolveFilterCount(customFilter) {
      let defaults = {
        yearModel: this.defaultFilters("yearModel"),
        rqModel: this.defaultFilters("rqModel"),
        topSpeedModel: this.defaultFilters("topSpeedModel"),
        acelModel: this.defaultFilters("acelModel"),
        handModel: this.defaultFilters("handModel"),
        mraModel: this.defaultFilters("mraModel"),
        weightModel: this.defaultFilters("weightModel"),
        seatsModel: this.defaultFilters("seatsModel"),
        tunesModel: [],
        classesModel: [],
        tyresModel: [],
        drivesModel: [],
        clearancesModel: [],
        countrysModel: [],
        prizesModel: [],
        customTagsModel: [],
        bodyTypesModel: [],
        fuelModel: [],
        engineModel: [],
        tagsModel: [],
        tags2Model: [],
        tags3Model: [],
        brandsModel: [],
        typesModel: [],
        approveModel: false
      }
      if (this.secretYear) defaults.year2Model = [];
      let count = 0;

      let clearFilter = {};

      let filter = this.searchFilters;
      if (customFilter) {
        filter = customFilter;
      }

      Object.keys( filter ).forEach(function (key) {
        if (key.includes("Model")) {
          if (defaults[key] !== undefined && JSON.stringify(filter[key]) !== JSON.stringify(defaults[key])) {
            count++;
            clearFilter[key.replace("Model","")] = filter[key];
          }
        }
      });

      if (!customFilter) this.filterCount = count;
      return clearFilter;
    },
    // hasDiff(filter) {
    //   let vm = this;
    //   let result = false;
    //   Object.keys(vm.clearFilterObj).find(key => {
    //     if (JSON.stringify(vm.clearFilterObj[key]) !== JSON.stringify(filter[`${key}Model`])) {
    //       result = true;
    //       return true;
    //     }
    //   })
    //   return result;
    // },
    insertKeyModel(obj) {
      let result = {};
      Object.keys(obj).find(key => {
        result[`${key}Model`] = obj[key];
      })
      return result;
    },
    checkMatchFilter(car) {
      let context = this.searchFilters;
      if (this.kingIsFiltering) context = this.kingFilter;
      if (this.cgIsFiltering) context = this.raceFilterResolved;
      if (this.cgIsFiltering && (this.cgAddingYouCar || this.cgAddingOppoCar)) context = this.cgFilterForAddCar;


      // between
      if ( !this.filterCheckBetween(car.year, context.yearModel) ) return false;
      if ( !this.filterCheckBetween(car.rq, context.rqModel) ) return false;
      if ( !this.filterCheckBetween(car.topSpeed, context.topSpeedModel) ) return false;
      if ( JSON.stringify(context.acelModel) !== JSON.stringify(this.defaultFilters("acelModel")) ) {
        if ( !this.filterCheckBetween(car.acel, context.acelModel) ) return false;
      }
      if ( !this.filterCheckBetween(car.hand, context.handModel) ) return false;
      if ( JSON.stringify(context.mraModel) !== JSON.stringify(this.defaultFilters("mraModel")) ) {
        if ( !this.filterCheckBetween(car.mra, context.mraModel) ) return false;
      }
      if (JSON.stringify(this.defaultFilters("weightModel")) !== JSON.stringify(context.weightModel)) {
        if ( !this.filterCheckBetween(car.weight, context.weightModel) ) return false;
      }
      if (JSON.stringify(this.defaultFilters("seatsModel")) !== JSON.stringify(context.seatsModel)) {
        if ( !this.filterCheckBetween(car.seats, context.seatsModel) ) return false;
      }

      // includes
      if ( !this.filterCheckIncludes(car.class, context.classesModel) ) return false;
      if ( !this.filterCheckIncludes(car.tyres, context.tyresModel) ) return false;
      if ( !this.filterCheckIncludes(car.drive, context.drivesModel) ) return false;
      if ( !this.filterCheckIncludes(car.clearance, context.clearancesModel) ) return false;
      if ( !this.filterCheckIncludes(car.country, context.countrysModel) ) return false;
      if ( this.secretYear && !this.filterCheckIncludes(car.year, context.year2Model) ) return false;

      if ( !this.filterCheckIncludes(car.fuel, context.fuelModel) ) return false;
      if ( !this.filterCheckIncludes(car.engine, context.engineModel) ) return false;

      if ( !this.filterCheckIncludesArray(car.bodyTypes, context.bodyTypesModel) ) return false;
      if ( !this.filterCheckIncludesArray(car.tags, context.tagsModel, car.rid) ) return false;
      if ( !this.filterCheckIncludesArray(car.tags, (context.tags2Model || []), car.rid) ) return false;
      if ( !this.filterCheckIncludesArray(car.tags, (context.tags3Model || []), car.rid) ) return false;
      if ( !this.filterCheckIncludes(car.brand, context.brandsModel) ) return false;

      if ( context.prizesModel.length > 0 ) {
        if ( car.prize && !context.prizesModel.includes("Prize Cars") ) return false;
        if ( !car.prize && !context.prizesModel.includes("Non-Prize Cars") ) return false;
      }

      if ( context.customTagsModel.length > 0 ) {
        let found = context.customTagsModel.find(tag => {
          if (this.custom_tags[tag].includes(car.rid)) return true;
        })
        if (!found) return false;
      }

      return true;
    },
    filterCheckBetween(value, array) {
      if (value === null) return false;
      if (array === undefined) return true;
      return value >= array[0] && value <= array[1]
    },
    filterCheckIncludes(value, array) {
      if (array === undefined) return true;
      if (array.length === 0) return true;
      return array.includes(value);
    },
    filterCheckIncludesArray(valuesArray, array, rid) {
      if (array === undefined) return true;
      if (array.length === 0) return true;
      return !!array.find(x => {
        if (x === "Road") {
          if (rid === "Brabham_BT62_Ultimate_Track_2018") return true;
          return !valuesArray.includes("Motorsport") && !valuesArray.includes("Concept");
        }
        return valuesArray.includes(x);
      });
    },
    // searchBlur() {
    //   setTimeout(() => {
    //     this.searchFocus = false;
    //   }, 200);
    // },
    closeFilterText() {
      this.searchInput = '';
      if (this.type === 'cg' && (this.cgAddingYouCar || this.cgAddingOppoCar)) {
        this.changeFilter();
      } else {
        this.searchResult = this.lastestContributionsResolved;
        this.showingLastest = true;
        this.showAllFilter = false;
      }
      this.alreadySearched = false;
    },
    addCar(index, e) {
      if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
        navigator.clipboard.writeText(this.searchResult[index].rid);
        return;
      }

      this.$emit("addCar", JSON.parse(JSON.stringify(this.searchResult[index])));

      Vue.set(this.searchResult[index], "added", true);
      setTimeout(() => {
        Vue.set(this.searchResult[index], "added", false);
      }, 800);

    },
    cgResetFilterForAdd() {
      this.searchFilters = JSON.parse(JSON.stringify(this.searchFilters));
      this.clearFilter();
      this.searchFilters = {
        ...this.searchFilters,
        ...this.raceFilterResolved
      };
      if (this.searchFilters.year2Model) {
        this.initSecretYear(true);
      }
      if (this.searchFilters.tags2Model.length > 0 || this.searchFilters.tags3Model.length > 0) {
        this.multi = true;
      } else {
        this.multi = false;
      }
      this.changeFilter();
    },
    initSecretYear(forceTrue) {
      // this.$store.commit("START_LOGROCKET", {});
      this.secretYearList = [];
      if (!this.searchFilters.year2Model) Vue.set(this.searchFilters, "year2Model", []);
      this.secretYear = !this.secretYear || forceTrue;
      // let initial = this.searchFilters.yearStart;
      let initial = 1935;
      let end = this.searchFilters.yearEnd;
      do {
        this.secretYearList.push(initial);
        initial++;
      } while (initial <= end);
    },
    toggleRoadTrip() {
      let t = ["Amalfi Coast Cruising","Enter the Black Forest","Learn the Savannah Way","Loch to Loch","Pacific Coast Highway","World Expo"];
      let included = [];
      this.tagsModel.map(x => {
        if (t.includes(x)) included.push(x);
      })
      let includesAll = included.length === 6;
      if (includesAll) this.tagsModel = this.tagsModel.filter(x => !t.includes(x));
      else t.map(x => {
        if (!included.includes(x)) this.tagsModel.push(x);
      })

    },
    sortClick(item) {
      let calcItem = item;
      if (typeof item === 'object') {
        calcItem = item.join("_");
      }

      if (this.sortModel !== calcItem) {
        this.sortModel = calcItem;
        this.sortInverted = false;
        if (typeof item === 'object') {
          this.sortModelSpecial = item;
        } else {
          this.sortModelSpecial = null;
        }
      } else if (!this.sortInverted) {
        this.sortInverted = true;
      } else {
        this.sortModel = null;
        this.sortInverted = false;
        this.sortModelSpecial = null;
      }
      this.changeFilter();
    },
    enableMulti() {
      this.multi = true;
    },
    getTagsModelKey(page) {
      console.log(page);
      if (page === 1) return "tagsModel"; 
      if (page === 2) return "tags2Model"; 
      if (page === 3) return "tags3Model"; 
    },
    changeUseFilter(useFilter) {
      this.$emit('useFilter', useFilter);
      setTimeout(() => {
        this.cgResetFilterForAdd();
      }, 50);
    }
  },
}
</script>

<style>
.BaseFilterDialog_TransparentChip {
  background-color: #0004;
  height: 32px;
  padding: 7px 10px;
  transform: translateY(6px);
  font-size: 0.9em;
}
.BaseFilterDialog_ToolBox {
  margin-top: -15px;
  margin-bottom: 15px;
  padding: 0 10px;
}
.BaseFilterDialog_SortBox {
  display: flex;
  justify-content: space-between;
  gap: 3px;
}
.BaseFilterDialog_ToolTitle {
  font-size: 12px;
  opacity: 0.6;
}
.BaseFilterDialog_ToolList {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}
.BaseFilterDialog_SortIcon {
  vertical-align: middle;
  padding-left: 4px;
  font-size: 19px;
  opacity: 0.5;
  line-height: 0.4;
}
.BaseFilterDialog_SortMoreBox {
  padding-top: 3px;
}
.BaseFilterDialog_MoreBoxRight {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.BaseFilterDialog_MoreActive {
  transform: rotate(180deg);
}
.BaseFilterDialog_MoreButton {
  --height: 32px;
  font-size: 24px;
  line-height: 1;
  min-width: 32px;
}
.BaseFilterDialog_MoreIcon {
  transition-duration: 0.3s;
}
.BaseFilterDialog_ColumnHeaders {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  font-size: 20px;
  margin-top: -11px;
  /* line-height: 1; */
  position: sticky;
  top: -28px;
  background-color: var(--d-back);
  z-index: 1;
  width: fit-content;
}
.BaseFilterDialog_ColumnHeader {
  user-select: none;
  cursor: pointer;
}
.BaseFilterDialog_ColumnHeaderTxt {
  opacity: 0.6;
  font-size: 0.7em;
}
.BaseFilterDialog_ButtonsTop {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}


@media only screen and (max-width: 500px) {
  .BaseFilterDialog_MoreBoxRight {
    flex-direction: column;
    gap: 3px;
  }
}
</style>