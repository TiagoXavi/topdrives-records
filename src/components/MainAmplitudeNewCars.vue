<template>
  <div class="MainAmplitudeNewCars_Layout">
    <BaseFilterDialog ref="validateFilter"/>
  </div>
</template>

<script>
import cars_final from '../database/cars_final.json' // internal
try {
  var hutch_v23_myCars = require('@/database/hutch_v23_myCars.json') // internal
  var hutch_v23_amplitude = require('@/database/hutch_v23_amplitude.json') // internal
  
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
      hutch_v23_myCars,
      hutch_v23_amplitude
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let brakeData = {}

    let newAmpObj = {};
    let newAmp = [];
    this.hutch_v23_amplitude.map(amp => {
      if (!newAmpObj[amp.Card_GUID]) {
        newAmpObj[amp.Card_GUID] = amp;
      }
    })
    Object.keys(newAmpObj).map(key => {
      newAmp.push(newAmpObj[key]);
    })
    // console.log(newAmp);
    // debugger;

    this.hutch_v23_amplitude.map(amp => {
      this.hutch_v23_myCars.find(car => {

        let ampString = amp.CardType.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
        ampString = ampString.replace("fiat ", "");
        ampString = ampString.replace("abarth ", "");
        ampString = ampString.replace("renault sport ", "renault ");

        let carNameString = car.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
        carNameString = carNameString.replace("fiat ", "");
        carNameString = carNameString.replace("abarth ", "");
        carNameString = carNameString.replace("renault sport ", "renault ");

        if (ampString === carNameString) {
          if ( car.class === this.numberToClass(amp.CardTier) ) {
            if (car.guid) return true;
            car.guid = amp.Card_GUID;
            return true;
          }
        }
      })
    })

    this.hutch_v23_myCars.map(car => {
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