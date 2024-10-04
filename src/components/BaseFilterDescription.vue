<template>
  <div class="Main_DarkScroll BaseFilterDescription_Root">
    <template v-if="(currentFilter !== undefined) && (!hideIfEmpty || descResolved.length > 0)">
      <div v-if="hasFilter2 || hasFilter3" class="BaseFilterDescription_MultiBox">
        <template v-for="n in 3">
          <BaseChip
            v-if="n === 1 || (n === 2 && hasFilter2) || (n === 3 && hasFilter3)"
            :inputValue="useWhatFilter"
            :disabled="loading"
            class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_SmallWide"
            required="true"
            :allowCtrl="true"
            :value="n-1"
            :label="`${n === 1 ? (filter.name || n) : n === 2 ? (filter2.name || n) : n === 3 ? (filter3.name || n) : '' }`"
            @click="chipClick($event, n-1)" />
        </template>
      </div>
      <div v-else class="Cg_ReqsTitle">{{ asFilterLabel ? $tc("m_filter", 1) : $t("m_requirements") }}</div>
      <div class="Cg_Reqs">
        <div class="BaseFilterDescription_Layout">
          <div v-for="item in descResolved" class="BaseFilterDescription_Item">
            <div class="BaseFilterDescription_Label">{{ item.label }}</div>
            <div class="BaseFilterDescription_Value">{{ item.value }}</div>
          </div>
          <div v-if="descResolved.length === 0" class="BaseFilterDescription_Empty">{{ $t("m_empty") }}</div>
        </div>
        <div v-if="(!loading && ready && user && user.mod) || isKing" class="BaseFilterDescription_Bottom Cg_FilterButtons">
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
            @click="$emit('changeClick', $event)">{{ currentFilter ? 'Change' : 'Requirements' }}</button>
        </div>
      </div>
    </template>
    <slot name="footer" />
    <portal to="app_dialogs">
      <BaseDialog
        v-if="hasFilter2 || hasFilter3"
        :active="renameDialog"
        :transparent="false"
        max-width="420px"
        min-width="240px"
        @close="closeRenameDialog()">
        <div class="Main_TuneDialog">
          <BaseText
            v-model="renameModel"
            class="BaseText_Big"
            iid="Filter_Rename"
            type="normal"
            :label="`${$t('c_name')} - Filter ${renameFilterNumber+1}`"
            placeholder="e.g. 2x or 3x"
            @enter="closeRenameDialog()" />
        </div>
      </BaseDialog>
    </portal>
  </div>
</template>

<script>
import BaseChip from './BaseChip.vue'
import BaseDialog from './BaseDialog.vue'
import BaseText from './BaseText.vue'

export default {
  name: 'BaseFilterDescription',
  components: {
    BaseChip,
    BaseDialog,
    BaseText
  },
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    },
    filter2: {
      type: Object,
      default() {
        return {}
      }
    },
    filter3: {
      type: Object,
      default() {
        return {}
      }
    },
    useWhatFilter: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    asFilterLabel: {
      type: Boolean,
      default: false
    },
    hideIfEmpty: {
      type: Boolean,
      default: false
    },
    emitDescResolved: {
      type: Boolean,
      default: false
    },
    isKing: {
      type: Boolean,
      default: false
    },
    user: {
      required: false
    },
    ready: {
      required: false
    },
  },
  data() {
    return {
      renameDialog: false,
      renameModel: null,
      renameFilterNumber: 0
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    hasFilter2() {
      return this.filter2 && Object.keys(this.filter2).length > 0;
    },
    hasFilter3() {
      return this.filter3 && Object.keys(this.filter3).length > 0;
    },
    currentFilter() {
      if (this.useWhatFilter === 1 && this.hasFilter2) {
        return this.filter2;
      }
      if (this.useWhatFilter === 2 && this.hasFilter3) {
        return this.filter3;
      }
      return this.filter;
    },
    descResolved() {
      let f = this.currentFilter;
      if (Object.keys( f ).length === 0) return [];
      let result = [];

      if (f.yearModel && JSON.stringify(f.yearModel) !== '[1910,2024]') result.push({ label: this.$tc("c_year", 2), value: f.yearModel.join("-") });
      if (f.rqModel && JSON.stringify(f.rqModel) !== '[10,119]') result.push({ label: "RQ", value: f.rqModel.join("-") });
      if (f.seatsModel && JSON.stringify(f.seatsModel) !== '[1,9]') result.push({ label: this.$t("c_seats"), value: f.seatsModel.join("-") });

      if (f.topSpeedModel && JSON.stringify(f.topSpeedModel) !== '[25,330]') result.push({ label: this.$t("c_topSpeed"), value: f.topSpeedModel.join("-") });
      if (f.acelModel && JSON.stringify(f.acelModel) !== '[1.5,40]') result.push({ label: "0-60", value: f.acelModel.join("-") });
      if (f.handModel && JSON.stringify(f.handModel) !== '[30,110]') result.push({ label: this.$t("c_handling"), value: f.handModel.join("-") });
      if (f.mraModel && JSON.stringify(f.mraModel) !== '[0,160]') result.push({ label: "MRA", value: f.mraModel.join("-") });
      if (f.weightModel && JSON.stringify(f.weightModel) !== '[300,7000]') result.push({ label: this.$t("c_weight"), value: f.weightModel.join("-") });

      if (f.tunesModel && f.tunesModel.length > 0) result.push({ label: this.$t("c_tune"), value: f.tunesModel.join(", ") });
      if (f.classesModel && f.classesModel.length > 0) result.push({ label: this.$tc("c_class", 1), value: f.classesModel.join(", ") });
      if (f.tyresModel && f.tyresModel.length > 0) result.push({ label: this.$tc("c_tyre", 1), value: f.tyresModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.drivesModel && f.drivesModel.length > 0) result.push({ label: this.$tc("c_drive", 1), value: f.drivesModel.join(", ") });
      if (f.clearancesModel && f.clearancesModel.length > 0) result.push({ label: this.$tc("c_clearance", 1), value: f.clearancesModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.countrysModel && f.countrysModel.length > 0) result.push({ label: this.$tc("c_country", 1), value: f.countrysModel.join(", ") });
      if (f.prizesModel && f.prizesModel.length > 0) result.push({ label: this.$t("c_prizeCar"), value: f.prizesModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.bodyTypesModel && f.bodyTypesModel.length > 0) result.push({ label: this.$t("c_bodyStyle"), value: f.bodyTypesModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.fuelModel && f.fuelModel.length > 0) result.push({ label: this.$t("c_fuel"), value: f.fuelModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.engineModel && f.engineModel.length > 0) result.push({ label: this.$t("c_enginePos"), value: f.engineModel.map(x => this.$t(`c_${x.toLowerCase()}Engine`)).join(", ") });
      if (f.brakeModel && f.brakeModel.length > 0) result.push({ label: this.$t("c_brakeClass"), value: f.brakeModel.join(", ") });
      if (f.tagsModel && f.tagsModel.length > 0) result.push({ label: this.$tc("c_tag", 1), value: f.tagsModel.join(", ") });
      if (f.tags2Model && f.tags2Model.length > 0) result.push({ label: this.$tc("c_tag", 1), value: f.tags2Model.join(", ") });
      if (f.tags3Model && f.tags3Model.length > 0) result.push({ label: this.$tc("c_tag", 1), value: f.tags3Model.join(", ") });
      if (f.brandsModel && f.brandsModel.length > 0) result.push({ label: this.$tc("c_brand", 1), value: f.brandsModel.join(", ") });
      if (f.year2Model && f.year2Model.length > 0) result.push({ label: this.$tc("c_year", 2), value: f.year2Model.join(", ") });

      if (this.emitDescResolved) {
        this.$emit('descResolved', result);
      }
      return result;
    }
  },
  methods: {
    chipClick(e, n) {
      if (e && typeof e === 'object' && e.e && (e.e.ctrlKey || e.e.metaKey) && this.user && this.user.mod) {
        this.renameDialog = true;
        this.renameModel = null;
        this.renameFilterNumber = n;
        if (this[`filter${n+1 > 1 ? n+1 : ''}`].name) {
          // console.log(this[`filter${n+1 > 1 ? n+1 : ''}`]);
          this.renameModel = this[`filter${n+1 > 1 ? n+1 : ''}`].name;
        }
        setTimeout(() => {
          try {
            document.querySelector("#Filter_Rename").focus();  
          } catch (error) {}
        }, 10);
        return;
      }
      this.$emit('useFilter', n);
    },
    closeRenameDialog() {
      this.renameDialog = false;
      if (this.renameModel && this.renameModel.length < 10) {
        this.$emit('newNameFilter', { n: this.renameFilterNumber, newName: this.renameModel });
      }
    }
  },
}
</script>

<style>
.BaseFilterDescription_Layout {
  display: grid;
  grid-template-columns: minmax(50px, max-content) 1fr;
  gap: 2px 5px;
}
.BaseFilterDescription_Item {
  display: contents;
}
.BaseFilterDescription_Label {
  font-size: 12px;
  padding-top: 1px;
  white-space: nowrap;
}
.BaseFilterDescription_Value {
  font-size: 13px;
  color: rgb(var(--d-text-yellow));
}
.BaseFilterDescription_Empty {
  color: #a90000;
  font-size: 13px;
}
.BaseFilterDescription_MultiBox {
  display: flex;
  margin-bottom: 3px;
}
</style>