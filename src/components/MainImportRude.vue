<template>
  <div class="MainImportRude_Layout">
    <div class="MainImportRude_Body">
      <div class="MainImportRude_Input">
        <input
          class="input"
          type="text"
          placeholder="paste here"
          @paste="intercept($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import cars_final from '../database/cars_final.json'
import cars_final_PL14 from '../database/cars_final_PL14.json'
import changedCars from '../database/changedCars.json'
import rude_all from '../database/rude_all.json'

export default {
  name: 'MainImportRude',
  components: {
    // BaseDetalheHeader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linhas: null,
      cars_final,
      changedCars,
      rude_all,
      pl_14: cars_final_PL14,
      result: null,
      ridNotIndefied: [],
      bannedRids: [],
      foundRids: [],
      dataToUpdate: [],
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let temp = {"197-217":{"users":["FFW_Rude"],"rid":"Nissan_Silvia_K's_(S14a)_1996","data":{"323":{"times":{"FastTrack(Rolling)_a00":"01.08.66"},"info":{"acel":"5.5","topSpeed":158,"hand":90}}}},"2-4333":{"users":["FFW_Rude"],"rid":"Alfa_Romeo_Stelvio_Quadrifoglio_2018","data":{"111":{"times":{"OceanCityStreet_a01":"01.05.68"},"info":{"acel":"3.4","topSpeed":180,"hand":85}}}},"22-4332":{"users":["FFW_Rude"],"rid":"Volkswagen_W12_Syncro_1997","data":{"111":{"times":{"OceanParking_a01":"00.34.33"},"info":{"acel":"3.6","topSpeed":183,"hand":89}}}},"2362-4334":{"users":["FFW_Rude"],"rid":"RUF_Turbo_R_2018","data":{"111":{"times":{"LongOceanDrag_a01":"00.12.93"},"info":{"acel":"3.4","topSpeed":214,"hand":88}}}},"24-27":{"users":["FFW_Rude"],"rid":"Suzuki_Swift_Sport_Cup_2008","data":{"323":{"times":{"MotocrossTrack_a11":"02.06.06"},"info":{"acel":"6.0","topSpeed":134,"hand":89}}}},"98-4311":{"users":["FFW_Rude"],"rid":"Chevrolet_Trailblazer_SS_2006","data":{"332":{"times":{"KartingCircuit_a00":"00.41.56","TwistyTrack_a01":"01.23.88","SlalomTest_a00":"00.31.83"},"info":{"acel":"4.5","topSpeed":154,"hand":76}}}}};
    

    this.checkJson(this.rude_all);
  },
  computed: {},
  methods: {
    intercept(e) {
      let text = e.clipboardData.getData('text');
      this.result = JSON.parse(text);
      console.log(this.result);

      this.checkJson(this.result);
      
      setTimeout(() => {
        e.srcElement.value = '';
      }, 10);
    },
    checkJson(rude) {
      let tunes = [];
      let vm = this;      
      var _merge = require('lodash/merge');

      Object.keys( rude ).forEach(function (key) {
        let fixedRudeRid = rude[key].rid;
        if (fixedRudeRid.indexOf("Opel_") === 0) fixedRudeRid = fixedRudeRid.replace("Opel_", "Vauxhall_Opel_");
        if (fixedRudeRid.indexOf("Abarth_") === 0) fixedRudeRid = fixedRudeRid.replace("Abarth_", "Fiat_Abarth_");
        if (fixedRudeRid.indexOf("Range_Rover_") === 0) fixedRudeRid = fixedRudeRid.replace("Range_Rover_", "Land_Rover_Range_Rover_");
        if (fixedRudeRid.indexOf("Alpine_") === 0) fixedRudeRid = fixedRudeRid.replace("Alpine_", "Renault_Alpine_");
        if (fixedRudeRid.indexOf("Apollo_") === 0) fixedRudeRid = fixedRudeRid.replace("Apollo_", "Gumpert_Apollo_");
        fixedRudeRid = fixedRudeRid.replace("/", "");
        fixedRudeRid = fixedRudeRid.replace(":", "");
        fixedRudeRid = fixedRudeRid.replace("!", "");



        if (fixedRudeRid === 'Renault_Sport_Clio_R.S._16_2016') fixedRudeRid = "Renault_Sport_Clio_R.S.16_2016";
        else if (fixedRudeRid === "Buick_LaCrosse_CXS_2005") fixedRudeRid = "Buick_LaCrosse_CXL_2005";
        else if (fixedRudeRid === "Fiat_Punto_HGT_Abarth_1999") fixedRudeRid = "Fiat_Punto_HGT_1999";
        else if (fixedRudeRid === "Bentley_Grand_Convertible_2014") fixedRudeRid = "Bentley_Mulsanne_Grand_Convertible_2014";
        else if (fixedRudeRid === "BMW_M3_Convertible_2001") fixedRudeRid = "BMW_M3_2001";
        else if (fixedRudeRid === "RUF_CTR_\"Yellowbird\"_1987") fixedRudeRid = "RUF_CTR_Yellowbird_1987";
        else if (fixedRudeRid === "Volvo_C30_Polestar_2013") fixedRudeRid = "Volvo_C30_Polestar_Performance_2010";
        else if (fixedRudeRid === "Chevrolet_Camaro_ZL1_Convertible_2015") fixedRudeRid = "Chevrolet_Camaro_ZL1_2015";
        else if (fixedRudeRid === "Citroën_C5_Tourer_2016") fixedRudeRid = "Citroen_C5_Tourer_3.0_L_2016";
        else if (fixedRudeRid === "Koenigsegg_CCXR_2017") fixedRudeRid = "Koenigsegg_CCXR_2007";
        else if (fixedRudeRid === "Citroën_BX_GTi_16V_1987") fixedRudeRid = "Citroen_BX_16v_1987";
        else if (fixedRudeRid === "Vauxhall_Opel_Kadett_Rallye_E_4S_1985") fixedRudeRid = "Vauxhall_Opel_Kadett_Rallye_E-4S_1985";

        fixedRudeRid = fixedRudeRid.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");

        let currentCar = vm.cars_final.find(x => x.rid.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "") === fixedRudeRid);
        if (!currentCar) {
          // second try
          let fixedRudeRidCut = fixedRudeRid.substr(0, fixedRudeRid.length-4);
          let matchList = vm.cars_final.filter(x => x.rid.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "").substr(0, x.rid.length-4) === fixedRudeRidCut);
          
          matchList = matchList.filter(x => {
            if (`${x.rid.substr(0, x.rid.length-4)}${x.year}`.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "") === fixedRudeRid) {
              return true
            }
          })
          if (matchList.length === 1) currentCar = matchList[0];
        }

        if (!currentCar) {
          // not found
          vm.ridNotIndefied.push(rude[key].rid);
          return;
        }

        if (vm.changedCars.includes(currentCar.rid)) {
          // banned 
          vm.bannedRids.push(rude[key].rid);
        } else {
          vm.foundRids.push(rude[key].rid);

          Object.keys( rude[key].data ).forEach(function (tune) {

            if (tune === '233' || tune === '323' || tune === '332' || (tune === '111' && currentCar.class === 'S')) {
              // allowed tune
              let alreadyInUpdateArr = vm.dataToUpdate.find(z => z.rid === currentCar.rid);
              if (alreadyInUpdateArr) {
                alreadyInUpdateArr.data = _merge(alreadyInUpdateArr.data, { [tune]: rude[key].data[tune] })
              } else {
                vm.dataToUpdate.push({
                  rid: currentCar.rid,
                  data: {
                    [tune]: rude[key].data[tune]
                  }
                })
              }
            }

          })

        }


        
      });

      console.log(vm.ridNotIndefied);
      debugger;
      console.log(vm.bannedRids);
      debugger;
      console.log(vm.dataToUpdate);
      debugger;

    }
  },
}
</script>

<style>
.MainImportRude_Layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.MainImportRude_Body {
  display: flex;
  flex-direction: column;
}
.MainImportRude_Button {
  background-color: rgba(var(--back-color), var(--back-opac));
  padding: 30px;
  color: white;
  font-size: 20px;
}
.MainImportRude_Input {
  padding: 50px 0;
}
#content-target {
  box-shadow: 0px 0px 0px 2px #424242;
  border-radius: 5px;
  min-height: 100px;
  min-width: 100px;
  margin-bottom: 100px;
}
</style>