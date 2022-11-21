<template>
  <div class="BaseFilterDescription_Layout">
    <div v-for="item in descResolved" class="BaseFilterDescription_Item">
      <div class="BaseFilterDescription_Label">{{ item.label }}</div>
      <div class="BaseFilterDescription_Value">{{ item.value }}</div>
    </div>
    <div v-if="descResolved.length === 0" class="BaseFilterDescription_Empty">Empty</div>
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

      if (f.yearModel && JSON.stringify(f.yearModel) !== '[1930,2022]') result.push({ label: "Years", value: f.yearModel.join("-") });
      if (f.rqModel && JSON.stringify(f.rqModel) !== '[10,100]') result.push({ label: "RQ", value: f.rqModel.join("-") });
      if (f.seatsModel && JSON.stringify(f.seatsModel) !== '[1,9]') result.push({ label: "Seats", value: f.seatsModel.join("-") });

      if (f.classesModel && f.classesModel.length > 0) result.push({ label: "Class", value: f.classesModel.join(", ") });
      if (f.tyresModel && f.tyresModel.length > 0) result.push({ label: "Tyre", value: f.tyresModel.join(", ") });
      if (f.drivesModel && f.drivesModel.length > 0) result.push({ label: "Drive", value: f.drivesModel.join(", ") });
      if (f.clearancesModel && f.clearancesModel.length > 0) result.push({ label: "Clearance", value: f.clearancesModel.join(", ") });
      if (f.countrysModel && f.countrysModel.length > 0) result.push({ label: "Country", value: f.countrysModel.join(", ") });
      if (f.prizesModel && f.prizesModel.length > 0) result.push({ label: "Prize Car", value: f.prizesModel.join(", ") });
      if (f.bodyTypesModel && f.bodyTypesModel.length > 0) result.push({ label: "Body", value: f.bodyTypesModel.join(", ") });
      if (f.fuelModel && f.fuelModel.length > 0) result.push({ label: "Fuel", value: f.fuelModel.join(", ") });
      if (f.engineModel && f.engineModel.length > 0) result.push({ label: "Engine Pos", value: f.engineModel.join(", ") });
      if (f.tagsModel && f.tagsModel.length > 0) result.push({ label: "Tags", value: f.tagsModel.join(", ") });
      if (f.brandsModel && f.brandsModel.length > 0) result.push({ label: "Brands", value: f.brandsModel.join(", ") });

      return result;
    }
  },
  methods: {
    defaultFilters(type) {
      if (type === "yearModel") return [1930, 2022];
      if (type === "rqModel") return [10, 100];
      if (type === "topSpeedModel") return [50, 350];
      if (type === "acelModel") return [1.0, 40];
      if (type === "handModel") return [30, 110];
      if (type === "mraModel") return [0, 150];
      if (type === "weightModel") return [300, 4000];
      if (type === "seatsModel") return [1, 9];
    },
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
</style>