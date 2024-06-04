<template>
  <BaseDialog
    :active="active"
    :isStatic="true"
    :grow="true"
    :transparent="true"
    :lazy="true"
    maxWidth="880px"
    @close="$emit('close')">
    <div class="Main_SearchBody BaseFilterDialog_Box">
      <div class="Main_SearchHeader">
        <div v-if="!isFiltering" class="Main_SearchFieldBox">
          <input
            v-model="searchInput"
            id="`SearchInputMemory`"
            :placeholder="$t('m_search')"
            class="D_SearchInput data-hj-allow"
            type="search"
            autocomplete="off"
            @input="searchInputFunc()">
          <button
            v-if="filterActive"
            class="D_Button D_SearchInputClose"
            @click="closeFilterText()">
            <i class="ticon-close_2" aria-hidden="true"/>
          </button>
        </div>
        <button
          v-if="!isFiltering"
          class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
          @click="openFilter()">
          <div>{{ $tc("m_filter", 2) }}</div>
          <div v-if="filterCount > 0 && memoryResult && memoryResult.length > 0" style="font-size: 0.5em;">({{ memoryResult.length }})</div>
          <span v-if="filterCount > 0" class="Main_FiltersButtonCount">{{ filterCount }}</span>
        </button>
        <button
          v-else
          class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
          @click="applyFilter()">{{ $t("m_done") }}</button>
      </div>
      <div v-if="isFiltering" class="Main_SearchMid BaseFilterDialog_Mid">
        <div class="Main_FilterItems">
          <div class="Main_FilterClearTop">
            <div class="BaseFilterDialog_ButtonsTop">
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
                @click="clearFilter()">{{ $t("m_clear") }}</button>
            </div>
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
            :label="$tc('c_year', 1)"
            class="Main_FilterSlider" />
          <div class="Main_FilterThree">
            <div class="Main_FilterChipsInside">
              <template v-for="(item, ix) in searchFilters.tyres">
                <BaseChip
                  v-model="searchFilters.tyresModel"
                  class="BaseChip_MinWidth"
                  :label="$t(`c_${item.toLowerCase()}2`)"
                  :value="item" />
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
                  :label="$t(`c_${item.toLowerCase()}`)"
                  :value="item" />
              </template>

            </div>
          </div>
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
          <template>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags_challenge">
                <BaseChip
                  v-model="searchFilters.tagsModel"
                  v-if="!$store.state.oldTags.includes(item)"
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                  :value="item" />
              </template>
            </div>
            <div v-if="$store.state.showOldTags" class="Main_FilterChipsFlex">
              <template>
                <template v-for="(item, ix) in searchFilters.tags_challenge">
                  <BaseChip
                    v-model="searchFilters.tagsModel"
                    v-if="$store.state.oldTags.includes(item)"
                    :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
                    class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                    :value="item" />
                </template>
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags_expansion">
                <BaseChip
                  v-model="searchFilters.tagsModel"
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags_permanent">
                <BaseChip
                  v-model="searchFilters.tagsModel"
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                  :value="item" />
              </template>
            </div>
            <div v-if="$store.state.showOldTags" class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags_permanentDied">
                <BaseChip
                  v-model="searchFilters.tagsModel"
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags_color">
                <BaseChip
                  v-model="searchFilters.tagsModel"
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                  :value="item" />
              </template>
            </div>
          </template>
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
              @click="clearFilter()">{{ $t("m_clear") }}</button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig"
              @click="applyFilter()">{{ $t("m_done") }}</button>
          </div>
        </div>
      </div>
      <div v-else-if="!isFiltering && memoryResult.length > 0" class="BaseMemoryDialog_SearchMid Main_DarkScroll">
        <div class="BaseMemoryDialog_MidBox">
          <template v-for="(item, index) in memoryResult">
            <div v-if="item" class="BaseMemoryDialog_">
              <BaseGalleryItem
                :config="item"
                :showDelete="true"
                :showApprove="false"
                :showRename="true"
                @rename="$emit('rename', { config: $event, index });"
                @delete="$emit('delete', { config: $event, index });"
                @push="$emit('templateClick', $event); $emit('close');" />
            </div>
          </template>
          <div class="BaseMemoryDialog_Options">
            <button
              v-if="memory.findIndex(x => x === null) > -1 && !filterActive"
              class="D_Button BaseGalleryItem_Layout BaseGalleryItem_Add"
              @click="$emit('addNext')">
              <i class="ticon-plus_2" style="font-size: 30px;" aria-hidden="true"/>
            </button>
            
          </div>
        </div>
        <div class="BaseMemoryDialog_MidFooter">
          <label class="D_Button D_ButtonDark D_ButtonDark2">
            <input
              style="display: none;"
              type="file"
              accept="application/json"
              @change="loadFile($event)">
              <span>{{ $t("m_loadFile") }}</span>
          </label>
          <button
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="download()">{{ $t("m_saveToFile") }}</button>
        </div>
      </div>
      <div v-else class="Main_SearchEmpty BaseFilterDialog_Mid BaseFilterDialog_Mid">
        <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from './BaseDialog.vue'
import BaseDualSlider from './BaseDualSlider.vue'
import BaseChip from './BaseChip.vue'
import BaseFlag from './BaseFlag.vue'
import BaseGalleryItem from './BaseGalleryItem.vue'

export default {
  name: 'BaseMemoryDialog',
  components: {
    BaseDialog,
    BaseGalleryItem,
    BaseDualSlider,
    BaseChip,
    BaseFlag
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
    memory: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      unsubscribe: null,
      searchFilters: {},
      isFiltering: false,
      searchInput: '',
      debounceFilter: null,
      searchResult: [],
      filterCount: 0,
      searchStr: "",
      oldSearchStr: "",
      filterActive: false
    }
  },
  watch: {
    active: function() {
      if (this.active) {
        this.openDialogSearch();
      }
    }
  },
  beforeMount() {
    let vm = this;
    vm.unsubscribe = vm.$store.subscribe(mutation => {
      if (mutation.type == "MEMORY_REF_RETURN") {
        vm.searchFilters = JSON.parse(JSON.stringify(mutation.payload.returnRef.searchFilters));
        vm.defaultFilters = mutation.payload.returnRef.defaultFilters;
        vm.filterCheckBetween = mutation.payload.returnRef.filterCheckBetween;
        vm.filterCheckIncludes = mutation.payload.returnRef.filterCheckIncludes;
        vm.filterCheckIncludesArray = mutation.payload.returnRef.filterCheckIncludesArray;

        vm.clearFilter();
      }
    })

    this.$store.commit("MAIN_FILTER_REF", {
      returnName: "MEMORY_REF_RETURN"
    });
    // this.clearFilter();
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  mounted() {
    // console.log(this.memory);
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilterViaText, 500);
  },
  computed: {
    memoryResult() {
      if (this.searchStr === "") this.oldSearchStr = this.searchStr;

      if (this.filterCount > 0 || (this.oldSearchStr !== this.searchStr)) {
        this.oldSearchStr = this.searchStr;
        let result = JSON.parse(JSON.stringify(this.memory));
        result = result.filter(item => {
          if (!item) return false;
          if (this.searchStr !== "") {
            let strIndex = item.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(this.searchStr);
            if (strIndex === -1) return false;
          }
          if ( !this.filterCheckBetween(item.minyear, this.searchFilters.yearModel) ) return false;
          if ( !this.filterCheckBetween(item.maxyear, this.searchFilters.yearModel) ) return false;
          if ( !this.filterCheckBetween(item.minrq, this.searchFilters.rqModel) ) return false;
          if ( !this.filterCheckBetween(item.maxrq, this.searchFilters.rqModel) ) return false;
          if ( !this.filterCheckIncludesArray(item.drive, this.searchFilters.drivesModel) ) return false;
          if ( !this.filterCheckIncludesArray(item.class, this.searchFilters.classesModel) ) return false;
          if ( !this.filterCheckIncludesArray(item.clearance, this.searchFilters.clearancesModel) ) return false;
          if ( !this.filterCheckIncludesArray(item.tag, this.searchFilters.tagsModel) ) return false;
          if ( !this.filterCheckIncludesArray(item.tyre, this.searchFilters.tyresModel) ) return false;
          if ( !this.filterCheckIncludesArray(item.country, this.searchFilters.countrysModel) ) return false;
          if ( !this.filterCheckIncludesArray(item.brand, this.searchFilters.brandsModel) ) return false;
          return true;
        })
        this.filterActive = true;
        return result
      } else {
        this.filterActive = false;
        return this.memory;
      }
    }
  },
  methods: {
    openDialogSearch() {
      if (this.firstTimeOpen) {
        this.changeFilterT();
      }
      this.firstTimeOpen = false;

      this.isFiltering = false;
      this.searchInput = '';
      setTimeout(() => {
        document.querySelectorAll(".Main_SearchMid").forEach(x => {x.scrollTo({ top: 0 })});
      }, 10);

    },
    searchInputFunc(e) {
      this.debounceFilter();
    },
    changeFilterViaText() {
      this.changeFilter(true);
    },
    changeFilter(viaText) {
      this.searchStr = this.searchInput.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      this.resolveFilterCount();
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
        brakeModel: [],
        tagsModel: [],
        tags2Model: [],
        tags3Model: [],
        brandsModel: [],
        typesModel: [],
        approveModel: false
      }
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
    openFilter() {
      this.isFiltering = !this.isFiltering;
      document.querySelectorAll(".Main_SearchMid").forEach(x => {x.scrollTo({ top: 0 })});
    },
    applyFilter() {
      this.changeFilter();
      this.isFiltering = false;
      document.querySelectorAll(".Main_SearchMid").forEach(x => {x.scrollTo({ top: 0 })});
    },
    closeFilterText() {
      this.searchInput = '';
      this.clearFilter();
      this.changeFilter();
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
      this.searchFilters.brakeModel = [];
      this.searchFilters.tagsModel = [];
      this.searchFilters.tags2Model = [];
      this.searchFilters.tags3Model = [];
      this.searchFilters.brandsModel = [];
      this.searchFilters.typesModel = [];
      this.searchFilters.approveModel = false;
    },
    download() {
      let filename = `TDR_Memory_${new Date().toISOString().slice(0,-5)}.json`;
      let jsonStr = JSON.stringify(this.memory);
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    loadFile(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = this.onload;
      reader.readAsText(file);
    },
    onload(e) {
      let str = e.target.result;
      let json = JSON.parse(str);
      this.$emit("import", json)
    },
  },
}
</script>

<style>
.BaseMemoryDialog_Options {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: 240px;
  max-height: 210px;
  justify-content: center;
}
.BaseMemoryDialog_SearchMid {
  height: 60vh;
  background-color: var(--d-back);
  width: 100%;
  
  box-sizing: border-box;
  overflow-y: scroll;
  /* overflow-x: hidden; */
  overscroll-behavior-block: contain;
  overscroll-behavior-x: contain;
  position: relative;
  /* padding: 25px; */
  display: flex;
  gap: 20px;
  align-items: center;
  height: 100%;
  flex-direction: column;
}
.BaseMemoryDialog_MidBox {
  width: 100%;
  padding: 25px 0;
  box-sizing: border-box;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  flex-grow: 1;
  align-content: flex-start;
}
.BaseMemoryDialog_MidFooter {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding-bottom: 20px;
}
</style>