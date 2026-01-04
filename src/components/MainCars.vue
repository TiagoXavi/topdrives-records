<template>
  <div
    :class="{
      Main_Compact: Vue.utils.windowWidth < 1200
    }"
    class="MainCars_Root">
    
    
    
    
    
    
    <div class="MainCars_Header">
      
    </div>





    <div class="MainCars_Body" :class="`MainCars_View${_Mcars.view}`">
      <RecycleScroller
        :items="_Mcars.cars"
        :item-size="carHeight"
        :buffer="Math.max(400, carHeight)"
        key-field="key"
        listClass="Cg_DashWrapper"
        itemClass="Cg_DashScrollerItem"
        class="Main_DarkScroll"
        page-mode>
        <template v-slot="{ item, index, active }">
          <div
            :class="{ MainCars_CarSelected: false }"
            class="MainCars_CarItem">
            {{ item.rid }}
          </div>
        </template>
      </RecycleScroller>
    </div>




    
  </div>
</template>

<script>
import MainCarsDetail from "./MainCarsDetail.vue";
import { mapState } from 'pinia';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'MainCars',
  components: {
    MainCarsDetail
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      T_S: tdrStore(),
    }
  },
  watch: {},
  created() {
    if (!this.T_S._Mcars) {
      this.T_S.$patch((state) => {
        state._Mcars = {
          cars: [],
          view: "list"
        }
      })
    }
  },
  beforeMount() {},
  mounted() {},
  computed: {
    ...mapState(tdrStore, ["_Mcars"]),
    carHeight() {

    }
  },
  methods: {},
}
</script>

<style>
</style>