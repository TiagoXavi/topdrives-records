<template>
  <div class="BaseFilterDescription_Layout">
    <div v-for="item in descResolved" class="BaseFilterDescription_Item">
      <div class="BaseFilterDescription_Label">{{ item.label }}</div>
      <div class="BaseFilterDescription_Value">{{ item.value }}</div>
    </div>
    <div v-if="descResolved.length === 0" class="BaseFilterDescription_Empty">{{ $t("m_empty") }}</div>
  </div>
</template>

<script>

export default {
  name: 'BaseFilterDescription',
  components: {},
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    descResolved() {
      let f = this.filter;
      if (Object.keys( this.filter ).length === 0) return [];
      let result = [];

      if (f.yearModel && JSON.stringify(f.yearModel) !== '[1910,2024]') result.push({ label: this.$tc("c_year", 2), value: f.yearModel.join("-") });
      if (f.rqModel && JSON.stringify(f.rqModel) !== '[10,114]') result.push({ label: "RQ", value: f.rqModel.join("-") });
      if (f.seatsModel && JSON.stringify(f.seatsModel) !== '[1,9]') result.push({ label: this.$t("c_seats"), value: f.seatsModel.join("-") });

      if (f.topSpeedModel && JSON.stringify(f.topSpeedModel) !== '[50,330]') result.push({ label: this.$t("c_topSpeed"), value: f.topSpeedModel.join("-") });
      if (f.acelModel && JSON.stringify(f.acelModel) !== '[1.5,40]') result.push({ label: "0-60", value: f.acelModel.join("-") });
      if (f.handModel && JSON.stringify(f.handModel) !== '[30,110]') result.push({ label: this.$t("c_handling"), value: f.handModel.join("-") });
      if (f.mraModel && JSON.stringify(f.mraModel) !== '[0,160]') result.push({ label: "MRA", value: f.mraModel.join("-") });
      if (f.weightModel && JSON.stringify(f.weightModel) !== '[300,7000]') result.push({ label: this.$t("c_weight"), value: f.weightModel.join("-") });

      if (f.classesModel && f.classesModel.length > 0) result.push({ label: this.$tc("c_class", 1), value: f.classesModel.join(", ") });
      if (f.tyresModel && f.tyresModel.length > 0) result.push({ label: this.$tc("c_tyre", 1), value: f.tyresModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.drivesModel && f.drivesModel.length > 0) result.push({ label: this.$tc("c_drive", 1), value: f.drivesModel.join(", ") });
      if (f.clearancesModel && f.clearancesModel.length > 0) result.push({ label: this.$tc("c_clearance", 1), value: f.clearancesModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.countrysModel && f.countrysModel.length > 0) result.push({ label: this.$tc("c_country", 1), value: f.countrysModel.join(", ") });
      if (f.prizesModel && f.prizesModel.length > 0) result.push({ label: this.$t("c_prizeCar"), value: f.prizesModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.bodyTypesModel && f.bodyTypesModel.length > 0) result.push({ label: this.$t("c_bodyStyle"), value: f.bodyTypesModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.fuelModel && f.fuelModel.length > 0) result.push({ label: this.$t("c_fuel"), value: f.fuelModel.map(x => this.$t(`c_${x.toLowerCase()}`)).join(", ") });
      if (f.engineModel && f.engineModel.length > 0) result.push({ label: this.$t("c_enginePos"), value: f.engineModel.map(x => this.$t(`c_${x.toLowerCase()}Engine`)).join(", ") });
      if (f.tagsModel && f.tagsModel.length > 0) result.push({ label: this.$tc("c_tag", 1), value: f.tagsModel.join(", ") });
      if (f.brandsModel && f.brandsModel.length > 0) result.push({ label: this.$tc("c_brand", 1), value: f.brandsModel.join(", ") });
      if (f.year2Model && f.year2Model.length > 0) result.push({ label: this.$tc("c_year", 2), value: f.year2Model.join(", ") });

      return result;
    }
  },
  methods: {},
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
</style>