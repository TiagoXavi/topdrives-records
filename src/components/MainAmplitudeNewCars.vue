<template>
  <div class="MainAmplitudeNewCars_Layout">
    <BaseFilterDialog ref="validateFilter"/>
  </div>
</template>

<script>
import cars_final from '../database/cars_final.json' // internal
try {
  var hutch_v22_myCars = require('@/database/hutch_v22_myCars.json') // internal
  var hutch_v22_amplitude = require('@/database/hutch_v22_amplitude.json') // internal
  
} catch (error) {

}
import BaseFilterDialog from './BaseFilterDialog.vue'

export default {
  name: 'MainAmplitudeNewCars',
  components: {
    BaseFilterDialog
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cars_final,
      hutch_v22_myCars,
      hutch_v22_amplitude
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let brakeData = {}

    let newAmpObj = {};
    let newAmp = [];
    this.hutch_v22_amplitude.map(amp => {
      if (!newAmpObj[amp.Card_GUID]) {
        newAmpObj[amp.Card_GUID] = amp;
      }
    })
    Object.keys(newAmpObj).map(key => {
      newAmp.push(newAmpObj[key]);
    })
    // console.log(newAmp);
    // debugger;

    this.hutch_v22_amplitude.map(amp => {
      this.hutch_v22_myCars.find(car => {
        if (amp.CardType === car.name) {
          if ( car.class === this.numberToClass(amp.CardTier) ) {
            if (car.guid) return true;
            car.guid = amp.Card_GUID;
            return true;
          }
        }
      })
    })

    this.hutch_v22_myCars.map(car => {
      if (!car.guid) {
        console.log(car.name);
      }
    })



    debugger;



    console.log(this.cars_final);
    debugger;
    // navigator.clipboard.writeText(JSON.stringify(this.cars_final));
  },
  computed: {},
  methods: {
    numberToClass(num) {
      if (num == "7") return "S";
      if (num == "6") return "A";
      if (num == "5") return "B";
      if (num == "4") return "C";
      if (num == "3") return "D";
      if (num == "2") return "E";
      if (num == "1") return "F";
    }
  },
}
</script>

<style>
</style>