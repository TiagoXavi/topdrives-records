<template>
  <div class="MainValidateFinalJson_Layout">
    <BaseFilterDialog ref="validateFilter"/>
  </div>
</template>

<script>
import cars_final from '../database/cars_final.json' // internal
// import old_cars_final from '../database/cars_final_PL21_4.json' // internal
import BaseFilterDialog from './BaseFilterDialog.vue'

export default {
  name: 'MainValidateFinalJson', // /validatejson
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
      updateClass: true,
      newClassCount: {
        S: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        Total: 0
      }
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    // insert database MRA to cars_final MRA
    // {
    //   let newMras = { "Lamborghini_Countach_LPI_8004_2021": 88, "Lancia_Delta_1600_HF_4WD_Group_A_1987": 100, "Land_Rover_Defender_110_D350_2024": 54.95, "Land_Rover_Defender_130_V8_P500_2024": 61.36, "Land_Rover_Defender_90_D250_2024": 47.2, "Land_Rover_Defender_90_Hard_Top_D200_2024": 58.23, "Land_Rover_Defender_90_V8_P525_2024": 61.25, "Land_Rover_Defender_OCTA_Edition_One_110_P635__2024": 76, "Mercury_Marauder_Convertible_Concept_2002": 64.88, "Peugeot_307_WRC_2004": 103 }
    //   this.cars_final.map(car => {
    //     if (newMras[car.rid]) {
    //       car.mra = newMras[car.rid];
    //     }
    //   })
    // }
    // console.log(this.cars_final);
    // debugger;

    let brakeData = {}
    // brakeData = {}

    
    this.cars_final.sort((a, b) => {
      if (a.rq === b.rq) {
        return a.name.localeCompare(b.name);
      } else {
        return b.rq - a.rq;
      }
    })

    if (true) {
      this.addTagsToThoseRids();
    }




    let _this = this.$refs.validateFilter.$data;
    let dontHaveBreak = [];

    this.cars_final.map(x => {
      let newRid = x.rid.trim().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
      if (x.rid !== newRid) {
        console.log(x.rid);
        // debugger
      }

      if (!_this.searchFilters.tyres.includes(x.tyres)) {
        console.log(x.tyres);
        debugger;
      }
      if (!_this.searchFilters.drives.includes(x.drive)) {
        console.log(x.drive);
        debugger;
      }
      if (!_this.searchFilters.clearances.includes(x.clearance)) {
        console.log(x.clearance);
        debugger;
      }
      if (!_this.searchFilters.countrys.includes(x.country)) {
        console.log(x.country);
        debugger;
      }
      if (!_this.searchFilters.fuel.includes(x.fuel)) {
        console.log(x.fuel);
        debugger;
      }
      if (!_this.searchFilters.engine.includes(x.engine)) {
        console.log(x.engine);
        debugger;
      }
      if (!_this.searchFilters.brands.includes(x.brand)) {
        console.log(x.brand);
        debugger;
      }
      x.bodyTypes.map(y => {
        if (!_this.searchFilters.bodyTypes.includes(y)) {
          console.log(y);
          debugger;
        }
      })
      x.tags.map(y => {
        if (!_this.searchFilters.tags.includes(y)) {
          console.log(y);
          debugger;
        }
      })
      if (this.updateClass) {
        let classByRq = Vue.resolveClass(x.rq, null, "letter");
        if (x.class !== classByRq) {
          x.class = classByRq;
          this.newClassCount[classByRq]++;
          this.newClassCount.Total++;
        }
      }


      if (!x.brake && brakeData && brakeData[x.rid]) {
        let brakeClass;
        let time = brakeData[x.rid][0];

        if (brakeData[x.rid].length > 1) {
          if (Math.abs(brakeData[x.rid][0] - brakeData[x.rid][1]) > 0.15) {
            if (brakeData[x.rid][0] !== 0 && brakeData[x.rid][1] !== 0) {
              console.log(x.rid, brakeData[x.rid]);
              debugger;
            }
          }
        }

        if (time === undefined || time === 0) brakeClass = null;
        else if (time < 4.2) brakeClass = "A";
        else if (time < 5.2) brakeClass = "B";
        else if (time < 5.9) brakeClass = "C";
        else {
          debugger;
        }

        x.brake = brakeClass;
      } else if (!x.brake) {

        // temp
        // let found = this.old_cars_final.find(car => car.rid === x.rid);
        // if (found) {
        //   x.brake = found.brake;  
        // } else

        {
          x.brake = null;
          if (x.topSpeed > 95) {
            dontHaveBreak.push(x);
          }
        }
      }
    })

    // dontHaveBreak.sort((a,b) => {
    //   return b.acel - a.acel;
    // })

    // console.log(dontHaveBreak);

    // let link = "https://www.topdrivesrecords.com?share=~Kdrag100_a00~Kdrag100b_a00";
    // let linkTemp = link;
    // let currentNum = 0;
    // dontHaveBreak.map((x, ix) => {
    //   if (Math.floor(ix / 25) <= currentNum) {
    //     linkTemp += `~C${x.rid}`;
    //   } else {
    //     console.log(linkTemp);
    //     currentNum = Math.floor(ix / 25);
    //     linkTemp = link;
    //     linkTemp += `~C${x.rid}`;
    //   }
    //   if (ix === dontHaveBreak.length - 1) {
    //     console.log(linkTemp);
    //   }
    // })

    // console.log(link);


    let keysOrder = [
      "class",
      "rq",
      "onlyName",
      "brand",
      "year",
      "abs",
      "tcs",
      "clearance",
      "country",
      "topSpeed",
      "acel",
      "hand",
      "drive",
      "tyres",
      "mra",
      "weight",
      "name",
      "rid",
      "prize",
      "bodyTypes",
      "fuel",
      "seats",
      "engine",
      "tags",
      "photoId",
      "photoOrig",
      "guid",
      "brake"
    ]
    let carsFinalOrdered = [];
    this.cars_final.map(car => {
      var carKeysOrdered = Object.keys(car)
      .sort((a,b) => {
        return keysOrder.indexOf(a) - keysOrder.indexOf(b);
      })
      .reduce(
        (obj, key) => { 
          obj[key] = car[key]; 
          return obj;
        }, 
        {}
      );
      carsFinalOrdered.push(carKeysOrdered);
    })

    if (this.updateClass) {
      console.log(JSON.parse(JSON.stringify(this.newClassCount)));
    }
    


    console.log(carsFinalOrdered);
    debugger;
    // navigator.clipboard.writeText(JSON.stringify(this.cars_final));
  },
  computed: {},
  methods: {
    addTagsToThoseRids() {
      let rids = ["Ford_Ranger_Rally_Raid_2014", "Mercedes-Benz_AMG_S_65_Coupe_2016", "BMW_M5_2012", "Renault_Alpine_A310_V6_Group_4B_1983", "Chevrolet_Colorado_ZR2_Race_Truck_2022", "Citroen_Vista_1000_pistes_1985", "Mercedes-Benz_AMG_S_65_2006", "Ram_1500_Backcountry_X_2022", "GMC_Sierra_1500_AT4_2019", "Jaguar_XKR_75_2010", "Lamborghini_Miura_P_400_Jota_1970", "Renault_Clio_Williams_Maxi_Kit_Car_1995", "AC_Cobra_378_GT_2012", "Alfa_Romeo_159_Alfetta_1951", "BMW_440i_2018", "Chevrolet_Silverado_1500_ZR2_2022", "Dodge_Hornet_GT_2022", "Mercedes-Benz_AMG_C_63_2015", "Mercedes-Benz_AMG_E_55_2003", "Spyker_C8_Laviolette_2001", "Spyker_C8_Spyder_SWB_2000", "Vauxhall_Maloo_R8_LSA_2016", "Chevrolet_SS_2003", "Donkervoort_D8_Audi_(AGU)_1999", "Fiat_Abarth_X19_Prototipo_1974", "Jaguar_XKR_2008", "Jaguar_XKR-S_Convertible_2011", "Maserati_250F_1955", "Mercedes-Benz_57S_Maybach_2012", "Mercedes-Benz_AMG_S_63_2011", "Morgan_Plus_8_50th_Anniversary_2018", "Morgan_Plus_Six_2019", "Pontiac_G8_GXP_2010", "Skoda_Felicia_Kit_Car_1995", "TVR_Tuscan_1999", "TVR_Tuscan_Convertible_2005", "Hummer_HX_Concept_2008", "Acura_RSX_Type_S_2003", "Aston_Martin_DB3S_1953", "Dodge_Ram_SRT10_2004", "Lamborghini_Countach_LP_500_1971", "Porsche_Taycan_2020", "Fiat_124_Abarth_Rally_1972", "Bentley_Arnage_FInal_Series_2009", "Bentley_Arnage_T_2007", "Citroen_Cactus_Aventure_2014", "Jaguar_XJR_1998", "Lancia_Fulvia_Coupe_16_HF_Group_4_1967", "Mitsubishi_Triton_Ralliart_AXCR_2022", "Chrysler_300M_Concept_1991", "Ford_Mustang_GT_Convertible_2005", "Mazda_3_MPS_2013", "AC_Cobra_140_Charter_2021", "Acura_TL_Type_S_2007", "Alfa_Romeo_P33_Roadster_1968", "Citroen_Vista_Trophee_1982", "Ford_FPV_Force_6_2006", "Holden_Commodore_SSZ_VZ_2005", "Honda_Ridgeline_2016", "Infiniti_G35_2007", "Mazda_2_Rally_2005", "Mazda_3_MPS_2007", "Renault_Sport_Clio_Cup_Car_2014", "TVR_S-Series_V8S_1986", "Audi_A3_Saloon_18_TFSI_8V_2013", "Audi_A3_Sportback_8V_2018", "Audi_A5_20_TFSI_B8_2015", "BMW_530i_1996", "BMW_X5_4.4i_2000", "Cadillac_CTS_2008", "Cadillac_CTS_Sport_Wagon_2014", "Chevrolet_Tahoe_Custom_2018", "Ford_Ranger_Raptor_2019", "Hyundai_Enduro_CUV_2015", "INFINITI_QX60_AWD_2018", "Mitsubishi_Eclipse_GT_Spyder_2007", "Nissan_Murano_CrossCabriolet_2011", "Dodge_Ram_1500_Classic_Warlock_2021", "Land_Rover_Range_Rover_Sport_2005", "Skoda_Yeti_20_TDI_4x4_2014", "Subaru_Legacy_GT-B_Touring_Wagon_(BG)_1997", "Chevrolet_Suburban_2016", "Ford_Edge_2016", "INFINITI_QX56_(JA60)_2008", "Mercedes-Benz_GL_350_2015", "Nissan_Pathfinder_2010", "Nissan_Pathfinder_2006", "Subaru_B9_Tribeca_2006", "Subaru_Legacy_B4_RS30_(BE)_2001", "Alfa_Romeo_159_32_V6_Q4_2005", "GMC_Yukon_XL_2014", "BMW_328i_1995", "De_Tomaso_Mangusta_1999", "Dodge_Hornet_2006", "Ford_Escape_2001", "Peugeot_Rifter_4x4_Concept_2018", "Plymouth_HEMI_'Cuda_1970", "Renault_Fluence_2013", "Renault_Talisman_2015", "Ford_Ranchero_1971", "Ford_Torino_Talladega_1969", "GMC_Denali_XT_2008", "Mercedes-Benz_300_SLR_1955", "Mini_Electric_Shadow_Edition_2021", "Mitsubishi_Triton_Absolute_2019", "Alfa_Romeo_156_24_JTD_2003", "Bentley_Continental_R_1991", "Bristol_Blenheim_Series_3_2000", "Cadillac_Escalade_2002", "Chrysler_Prowler_2001", "Ford_Falcon_XR8_2000", "Lamborghini_LMA002_1982", "Maserati_Bora_1971", "Mitsubishi_Outlander_20_Turbo_Diesel_2006", "Suzuki_X-90_1995", "BMW_iX3_Premier_Edition_2021", "Chrysler_LHX_1996", "Dodge_Dakota_Laramie_4.7L_2009", "Mitsubishi_L200_2016", "Peugeot_508_2018", "Subaru_Alcyone_SVX_1991", "Buick_Enclave_2020", "Ford_F-150_Tremor_FX2_2014", "Lincoln_MKC_2016", "Lincoln_Nautilus_2019", "Mazda_RX8_Hydrogen_RE_2004", "Mercedes-Benz_E_220_2015", "Cadillac_ELR_2016", "Chevrolet_Blazer_2021", "Volkswagen_Golf_GTD_2009", "Volvo_C40_Recharge_2023", "Volvo_XC40_Recharge_2023", "Mercury_Cyclone_Cobra_Jet_1969", "Volkswagen_Atlas_2018", "BMW_635CSi_1980", "De_Tomaso_Deauville_1971", "Dodge_Caravan_RT_2015", "Lamborghini_350_GTS_1965", "Peugeot_404_Rally_1967", "Buick_Skylark_1965", "Mazda_CX3_Racing_2015", "Chrysler_Cirrus_LXi_1997", "Citroen_Xantia_VSX_1993", "Citroen_Grand_C4_Picasso_2015", "Chevrolet_Orlando_LTZ_2010", "Mitsubishi_Colt_CZC_2006", "Chrysler_Town_and_Country_2001", "Dodge_Challenger_2.6L_1983", "Oldsmobile_Vista_Cruiser_1968", "Subaru_Vivio_Bistro_1995"];
      let tagName = "Reclassified";

      this.cars_final.map(car => {
        if (rids.includes(car.rid)) {
          if (!car.tags.includes(tagName)) {
            car.tags.push(tagName);
          }
        }
      })
    }
  },
}
</script>

<style>
</style>