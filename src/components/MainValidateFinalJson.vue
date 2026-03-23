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
    //   let newMras = { "Aston_Martin_DB12_2023": 94.59, "Aston_Martin_DB12_Volante_2024": 94.74, "Aston_Martin_DBR22_2022": 97.14, "Aston_Martin_DBS_770_Ultimate_Volante_2023": 102.94, "Aston_Martin_DBX_2021": 78.18, "Aston_Martin_Lagonda_SUV_Concept_2009": 83.33, "Aston_Martin_V12_Speedster_2021": 94.44, "Aston_Martin_V12_Vantage_2023": 97.14, "Aston_Martin_V8_Vantage_Le_Mans_1999": 78.43, "Aston_Martin_Valhalla_Concept_2019": 100, "Aston_Martin_Valkyrie_Spider_2022": 112.51, "Aston_Martin_Valour_2023": 104.48, "Aston_Martin_Vanquish_2025": 103.23, "Aston_Martin_Vanquish_Vision_Concept_2019": 105.66, "Aston_Martin_Vantage_2024": 97.14, "Aston_Martin_Vantage_AMR_2019": 78, "Aston_Martin_Vantage_GT3_2019": 98.41, "Aston_Martin_Vantage_GT4_2019": 87.18, "Aston_Martin_Vantage_GT4_2024": 89.47, "Aston_Martin_Vantage_Roadster_2025": 100, "Aston_Martin_Victor_2020": 93.75, "Bentley_8_Litre_Saloon_1930": 57.12, "Bentley_Arnage_Drophead_Coupe_2005": 67.06, "Bentley_Arnage_R_2002": 59.6, "Bentley_Bentayga_EWB_2022": 69.23, "Bentley_Bentayga_Hybrid_2020": 67.53, "Bentley_Bentayga_Pikes_Peak_Limited_Edition_2018": 80.81, "Bentley_Bentayga_S_2021": 77.19, "Bentley_Bentayga_V8_Design_Series_2019": 77.19, "Bentley_Blower_1929": 52.53, "Bentley_Blue_Train_Speed_Six_1930": 49.52, "Bentley_Continental_1984": 43.09, "Bentley_Continental_1989": 43.46, "Bentley_Continental_Flying_Spur_Speed_2008": 76.27, "Bentley_Continental_Flying_Star_2010": 70.34, "Bentley_Continental_GT3_Concept_2012": 96.77, "Bentley_Continental_GTC_2006": 76.19, "Bentley_Continental_GTC_2009": 77.42, "Bentley_Continental_GTC_2012": 73.21, "Bentley_Continental_GTC_2014": 74.58, "Bentley_Continental_GTC_Mulliner_V8_2020": 78.43, "Bentley_Continental_GTC_Mulliner_W12_2020": 82.22, "Bentley_Continental_GTC_Speed_2009": 83.33, "Bentley_Continental_GTC_Speed_2022": 77.42, "Bentley_Continental_GTC_Speed_Edition_12_2023": 78.26, "Bentley_Continental_GTC_S_2021": 75, "Bentley_Continental_GTC_V8_2012": 70.15, "Bentley_Continental_GTC_V8_2014": 75.81, "Bentley_Continental_GTC_V8_2019": 78.43, "Bentley_Continental_GTZ_2008": 87.76, "Bentley_Continental_GT_Diamond_Series_2007": 78.33, "Bentley_Continental_GT_Le_Mans_Collection_2023": 85.37, "Bentley_Continental_GT_Mulliner_V8_2020": 79.59, "Bentley_Continental_GT_Mulliner_W12_2020": 87.8, "Bentley_Continental_GT_Speed_2008": 82.69, "Bentley_Continental_GT_Speed_2021": 84.34, "Bentley_Continental_GT_Speed_Black_Edition_2016": 78, "Bentley_Continental_GT_Speed_Convertible_2015": 80.39, "Bentley_Continental_GT_Speed_Convertible_Black_Edition_2016": 78.43, "Bentley_Continental_GT_Speed_Edition_12_2023": 85.37, "Bentley_Continental_GT_S_2023": 76.77, "Bentley_Continental_GT_V8_2014": 75.41, "Bentley_Continental_GT_V8_Convertible_Galene_Edition_2017": 75.81, "Bentley_Continental_Sedanca_Coupe_1999": 63.37, "Bentley_Eight_1984": 40.2, "Bentley_EXP_10_Speed_6_Concept_2015": 79.59, "Bentley_EXP_12_Speed_6e_Concept_2017": 72.41, "Bentley_EXP_9_F_2012": 79.25, "Bentley_Flying_Spur_Design_Series_2017": 69.73, "Bentley_Flying_Spur_Hybrid_2023": 73.21, "Bentley_Flying_Spur_Mulliner_2021": 76.92, "Bentley_Flying_Spur_Speed_2023": 79.57, "Bentley_Flying_Spur_Speed_Edition_12_2023": 80.43, "Bentley_Flying_Spur_S_2022": 76.92, "Bentley_Hybrid_Concept_2014": 74.6, "Bentley_Project_90_1985": 55.37, "Bentley_R_Type_1952": 41.76, "Bentley_R_Type_Continental_1952": 56.31, "Bentley_S1_1955": 56.8, "Bentley_S2_1959": 52.65, "Bentley_S3_1962": 54, "Bentley_S3_Continental_1962": 53.44, "Bentley_Speed_Six_Racing_Car_1929": 66.02, "Bentley_State_Limousine_2002": 63.23, "Bentley_S_Continental_1955": 55.13, "Bentley_T1_1965": 44.44, "BMW_30_CSL_Group_2__1973": 85.19, "BMW_XM_Label_Red_G09_2023": 78.26, "Chevrolet_Copo_Camaro_2018": 113.5, "Ford_GT350R_2017": 0, "Ford_MachE_1400_Prototype_2020": 106.38, "Ford_Ranger_Rally_Raid_2014": 61.76, "GMC_Acadia_Denali_2018": 53.31, "Jaguar_EType_Lightweight_Continuation_2014": 57.75, "Jaguar_EType_V12_Series_III_Roadster_1971": 72.34, "Jaguar_XF_S_SportBrake_2017": 64.89, "Jaguar_XJRS_1990": 69.15, "Jaguar_XJS_V12_Convertible_1988": 63.71, "Jaguar_XJS_V12_Coupe_1975": 69.39, "Jaguar_XK180_Concept_1998": 70.31, "Land_Rover_50_V8_Supercharged_2012": 74.68, "Land_Rover_Defender_110_P300e_2024": 50.41, "Land_Rover_Defender_110_P400e_2020": 52.53, "Land_Rover_Defender_110_P400_MHEV_2020": 69.32, "Land_Rover_Defender_130_D350_2024": 67.37, "Land_Rover_Defender_90_D300_2020": 45.39, "Land_Rover_Defender_90_P425_2024": 62.35, "Land_Rover_Discovery_D300_MHEV_2022": 47.17, "Land_Rover_Discovery_P360_MHEV_2022": 59.05, "Land_Rover_Discovery_Sport_D200_MHEV_2021": 48.27, "Land_Rover_Discovery_Sport_P300e_2023": 56.47, "Land_Rover_Evoque_P300e_2023": 57.55, "Land_Rover_Evoque_P300_2020": 62.5, "Land_Rover_Velar_D200_MHEV_2022": 45.89, "Land_Rover_Velar_D300_MHEV_2022": 54.95, "Land_Rover_Velar_P380_2018": 62.35, "Mitsuoka_Orochi_Concept_2001": 55.77, "Nissan_Z_GT500_Test_Car_230_2021": 89.66, "Peugeot_308_GT_2008": 68.52, "Vauxhall_Agila_13_CDTi_2008": 30.64, "Vauxhall_Astra_12_Turbo_130_2022": 55.83, "Vauxhall_Astra_15_Turbo_D_2022": 52.36, "Vauxhall_Astra_Coupe_888_2001": 72.16, "Vauxhall_Astra_GTE_1983": 54.21, "Vauxhall_Cavalier_Calibre_1988": 48.08, "Vauxhall_Cavalier_Touring_Car_1995": 90.38, "Vauxhall_Cavalier_Turbo_1992": 63.46, "Vauxhall_Corsa_18_SRi_2005": 50.63, "Vauxhall_Equus_1978": 28.11, "Vauxhall_Meriva_VXR_2006": 56.43, "Vauxhall_Monaro_VXR_2006": 70.27, "Vauxhall_Monaro_VXR_500_2006": 78.69, "Vauxhall_Monaro__2005": 70.67, "Vauxhall_Nova_Sport_1985": 46.25, "Vauxhall_Omega_30_24V_saloon_2000": 64.89, "Vauxhall_Vectra_SuperTouring__1995": 62.04, "Vauxhall_VXR220_2004": 60, "Vauxhall_VXR8_Tourer_2013": 83.05, "Vauxhall_VX_Lightning_2003": 63.64, "Vauxhall_Zafira_VXR_2005": 71.29, "Volkswagen_Beetle_LSR_2016": 114.29, "Volkswagen_Golf_R360S__2016": 71.43, "Volkswagen_GTI_Roadster_Vision_Gran_Turismo__2014": 80.95 }
    //   this.cars_final.map(car => {
    //     if (newMras[car.rid]) {
    //       car.mra = newMras[car.rid];
    //     }
    //     delete car.color;
    //     delete car.colorRgb;
    //     delete car.photo;
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