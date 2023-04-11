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
          @click="openFilter()">{{ $tc("m_filter", 2) }}<span v-if="filterCount > 0" class="Main_FiltersButtonCount">{{ filterCount }}</span></button>
        <button
          v-else
          class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
          @click="applyFilter()">{{ $t("m_done") }}</button>
      </div>
      <div v-if="isFiltering || filterOnly" class="Main_SearchMid">
        <div class="Main_FilterItems">
          <div v-if="!cgAddingYouCar" class="Main_FilterClearTop">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
              @click="clearFilter('searchFilters')">{{ $t("m_clear") }}</button>
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
          <div v-if="config.prizes !== false && (!cgAddingYouCar || !raceFilter || !raceFilter.prizesModel || raceFilter.prizesModel.length === 0)" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.prizes">
              <BaseChip
                v-model="searchFilters.prizesModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.bodyTypes !== false && (!cgAddingYouCar || !raceFilter || !raceFilter.bodyTypesModel || raceFilter.bodyTypesModel.length === 0)" class="Main_FilterChipsFlex" style="margin: 0 10px;">
            <template v-for="(item, ix) in searchFilters.bodyTypes">
              <BaseChip
                v-model="searchFilters.bodyTypesModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.fuel !== false && (!cgAddingYouCar || !raceFilter || !raceFilter.fuelModel || raceFilter.fuelModel.length === 0)" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.fuel">
              <BaseChip
                v-model="searchFilters.fuelModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.engine !== false && (!cgAddingYouCar || !raceFilter || !raceFilter.engineModel || raceFilter.engineModel.length === 0)" class="Main_FilterChipsFlex" style="position: relative; margin-top: 5px;">
            <div class="Main_FilterChipsLabel">{{ $t("c_enginePos") }}</div>
            <template v-for="(item, ix) in searchFilters.engine">
              <BaseChip
                v-model="searchFilters.engineModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :label="$t(`c_${item.toLowerCase()}Engine`)"
                :value="item" />
            </template>
          </div>
          <div v-if="config.tags !== false && (!cgAddingYouCar || !raceFilter || !raceFilter.tagsModel || raceFilter.tagsModel.length === 0)" class="Main_FilterChipsFlex">
            <template v-for="(item, ix) in searchFilters.tags">
              <BaseChip
                v-model="searchFilters.tagsModel"
                v-if="!$store.state.oldTags.includes(item) || $store.state.showOldTags"
                :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '')}`"
                class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                :value="item" />
            </template>
          </div>
          <div v-if="config.brands !== false && (!cgAddingYouCar || !raceFilter || !raceFilter.brandsModel || raceFilter.brandsModel.length === 0)" class="Main_FilterChipsFlex">
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
              @click="clearFilter('searchFilters')">{{ $t("m_clear") }}</button>
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
        <div v-else class="BaseFilterDialog_SortBox">
          <!-- RQ, Top Speed, 0-60, Handling, MRA, Weight -->
        </div>
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
              <span v-html="item.locatedName" /><template v-if="item.prize"><i class="ticon-trophy Main_SearchTrophy" aria-hidden="true"/></template>&nbsp;<span class="Main_SearchItemYear">{{ item.year }}</span>&nbsp;<span v-if="item.lastestUser" :class="`Main_UserT${highlightsUsers[item.lastestUser]}`" class="Main_SearchResultUser">by {{ item.lastestUser }}</span><span v-else-if="item.mra" class="Main_SearchItemYear">{{ item.mra }}</span>
            </div>
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
    BaseGalleryItem
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
    type: {
      type: String,
      default: "classic"
    },
    initialFilterString: {
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
      clearFilterObj: {},
      internalConfig: {},
      searchFilters: {
        yearStart: 1910,
        yearEnd: 2022,
        yearModel: [],
        rqStart: 10,
        rqEnd: 114,
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
        classes: ["F","E","D","C","B","A","S"],
        classesColors: ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFC717"],
        classesModel: [],
        tyres: ["Performance", "Standard", "All-surface", "Off-road", "Slick"],
        tyresModel: [],
        drives: ["FWD", "RWD", "4WD"],
        drivesModel: [],
        clearances: ["Low", "Mid", "High"],
        clearancesModel: [],
        countrys: ["DE", "GB", "US", "JP", "IT", "FR", "SE", "NL", "AT", "HR", "AU", "AE", "BR", "CN", "ZA", "CH"],
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
          "Call of the Wild",
          "Christmas Collection",
          "Christmas Collection 22",
          "Concept",
          "Drivers Choice",
          "Eco Friendly",
          "Enter the Black Forest",
          "European Revolution",
          "Famous Tracks",
          "French Renaissance",
          "German Renaissance",
          "Great Exhibition",
          "Hot Hatch",
          "Hypercar",
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
          "Old Guard",
          "Originals",
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
          "The Great Outdoors",
          "The Horror Show",
          "Two Tone",
          "Ultra Expensive",
          "Wild Ride",
          "World Expo",
          "Year of the Ox",
          "Year of the Rabbit",
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
          "BAC",
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
          "Ginetta",
          "GMC",
          "Hennessey",
          "Holden",
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
          "Morgan",
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
    this.clearFilter('searchFilters');
    id++;
    this.id = id;
  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500);
    this.user = this.$store.state.user;

    if (this.libraryApprove) {
      debugger;
      this.searchFilters["approveModel"] = true;
    }

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
        vm.asMod = mutation.payload.asMod;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
        vm.asMod = false;
      }

      if (mutation.type == "REFRESH_LIBRARY") {
        vm.changeFilterT();
      }

      if (mutation.type == "LIBRARY_NEW_DIALOG") {
        vm.firstTimeOpen = true;
      }

      if (mutation.type == vm.ridsMutationName) {
        if (vm.type === 'cg') {
          vm.cgResetFilterForAdd();
        }
        let rqMax = mutation.payload.rqMax || 100;
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
        if (this.initialFilterString) clearFilterInitial = this.resolveFilterCount(JSON.parse(this.initialFilterString));
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
      // let searchStr = this.searchInput.toLowerCase().replace(/  +/g, ' ').split(" ");
      let searchStr = this.searchInput.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let strIndex = -1;
      let prePush;
      let tryFind;
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
        if (result.length < 200 || true) {

          let shouldPush = false;
          if (searchStr && searchStr !== "") {
            strIndex = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(searchStr);
          } else {
            strIndex = -2;
          }

          if (this.filterCount > 0 || (this.cgAddingOppoCar)) {
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

      this.searchResultLength = result.length;

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
    defaultFilters(type) {
      if (type === "yearModel") return [1910, 2022];
      if (type === "rqModel") return [10, 114];
      if (type === "topSpeedModel") return [50, 330];
      if (type === "acelModel") return [1.5, 40];
      if (type === "handModel") return [30, 110];
      if (type === "mraModel") return [0, 160];
      if (type === "weightModel") return [300, 7000];
      if (type === "seatsModel") return [1, 9];
    },
    clearFilter() {
      this.searchFilters.yearModel = this.defaultFilters("yearModel");
      this.searchFilters.rqModel = this.defaultFilters("rqModel");
      this.searchFilters.topSpeedModel = this.defaultFilters("topSpeedModel");
      this.searchFilters.acelModel = this.defaultFilters("acelModel");
      this.searchFilters.handModel = this.defaultFilters("handModel");
      this.searchFilters.mraModel = this.defaultFilters("mraModel");
      this.searchFilters.weightModel = this.defaultFilters("weightModel");
      this.searchFilters.seatsModel = this.defaultFilters("seatsModel");
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
      if (this.cgIsFiltering) context = this.raceFilter;
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
      if ( !this.filterCheckBetween(car.weight, context.weightModel) ) return false;
      if ( !this.filterCheckBetween(car.seats, context.seatsModel) ) return false;

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
      if ( !this.filterCheckIncludesArray(car.tags, context.tagsModel) ) return false;
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
    filterCheckIncludesArray(valuesArray, array) {
      if (array === undefined) return true;
      if (array.length === 0) return true;
      return !!array.find(x => {
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
    addCar(index) {
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
        ...this.raceFilter
      };
      if (this.searchFilters.year2Model) {
        this.initSecretYear(true);
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
    }
  },
}
</script>

<style>
.BaseFilterDialog_SortBox {

}
</style>