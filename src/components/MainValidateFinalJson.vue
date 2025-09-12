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
    //   let newMras = { "Mini_Cooper_SD_Coupe_2011": 49.34, "BMW_X4_xDrive30d_G02_2019": 51.02, "Mini_Cooper_S_5_door_2016": 65.35, "BMW_i7_eDrive50_G70_2023": 84.13, "Mini_Paceman_Cooper_SD_2014": 44.56, "Mini_One_D_2002": 42.03, "BMW_XM_G09_2024": 85.42, "BMW_M5_Race_Car_E34_1994": 90.38, "BMW_740d_xDrive_G70_2023": 55.56, "BMW_i5_eDrive40_Touring_G61__2024": 72.5, "BMW_520d_xDrive_G60_2024": 59.48, "BMW_840Ci_1997": 65.63, "Mini_Cooper_SD_Roadster_2011": 48.49, "Mini_John_Cooper_Works_2009": 70.45, "BMW_M5_Touring_E61_2007": 83.64, "BMW_740d_1999": 65.57, "BMW_iX1_xDrive30_U11_2023": 67.09, "Mini_Cooper_Convertible_2009": 46.09, "BMW_330xd_Touring_2003": 51.25, "Mini_One_2012": 37.12, "Mini_Cooper_2006": 51.87, "Mini_Aceman_SE_2024": 64.76, "BMW_30_CSL_E9_1972": 62.04, "BMW_X4_xDrive30i_G02_2019": 54.05, "Mini_John_Cooper_Works_Roadster_2012": 76.54, "BMW_X1_M35i_xDrive_U11_2023": 65.85, "Mini_John_Cooper_Works_Challenge_Edition_2016": 69.04, "BMW_M4_GT3_G82_2022": 100, "Mini_Countryman_C_2024": 44.07, "BMW_M4_CSL_G82_2023": 92.11, "Mini_Paceman_Cooper_S_2015": 59.32, "BMW_X2_M35i_xDrive_U10_2024": 60.71, "BMW_2000_CS_1967": 39.04, "BMW_i3_eDrive35L_G28_2022": 71.86, "BMW_X4_M40i_G02_2019": 61.84, "BMW_Z4_M40i_Handschalter_Pack_G29_2024": 63.77, "BMW_X3_xDrive30e_G01_2020": 52.25, "BMW_iX2_xDrive30_U10_2024": 67.09, "BMW_X6_xDrive30d_G06_2021": 51.88, "BMW_M440i_xDrive_Gran_Coupe_G26_2021": 77.59, "Mini_Cooper_S_Works_210_2017": 69.15, "BMW_523d_xDrive_G60_2024": 59.48, "BMW_iX_xDrive60_i20_2025": 82.09, "Mini_Clubman_Cooper_D_2009": 42.65, "Mini_Clubman_Cooper_S_ALL4_2016": 55.46, "BMW_X4_M40d_G02_2022": 65.28, "Mini_Cooper_S_2024": 61.17, "BMW_X1_xDrive23d_U11_2023": 56.45, "BMW_520d_xDrive_Touring_G61__2024": 59.66, "BMW_430i_Gran_Coupe_G26_2021": 62.77, "BMW_320i_ETCC_E46_2002": 72.22, "Mini_Clubman_John_Cooper_Works_2016": 76.92, "BMW_X3_M_Competition_F97_2022": 74.23, "BMW_528i_1997": 59.66, "Mini_Clubman_John_Cooper_Works_2013": 69.15, "BMW_X1_xDrive23i_U11_2023": 58.77, "BMW_525tds_Touring_1997": 56.35, "BMW_M4_Competition_M_xDrive_Coupe_G82_2024": 79.33, "BMW_530e_Touring_G61_2024": 62.89, "BMW_745i_E65_2002": 67.05, "BMW_530e_xDrive_Touring_G61_2024": 59.8, "Mini_Clubman_Cooper_S_2009": 61.95, "BMW_320d_Super_Touring_E36_1998": 71.64, "Mini_Cooper_S_Convertible_2004": 67.29, "Mini_Countryman_One_2010": 35.11, "BMW_M3_Competition_Touring_M_xDrive_G81_2023": 75.56, "BMW_530i_G60__2024": 62.77, "Mini_Cooper_S_Challenge_210_2015": 85.71, "BMW_i7_M70_xDrive_G70_2023": 83.33, "BMW_750e_xDrive_G70_2023": 70.77, "Mini_Clubman_Cooper_2016": 51.55, "BMW_X3_xDrive30d_G01_2024": 60.67, "BMW_Z4_GT3_E89_2013": 96.97, "BMW_M3_GT_E92_2011": 100, "BMW_X5_M_Competition_F95_2024": 76.29, "BMW_230i_Coupe_G42_2022": 63.64, "BMW_530e_G60_2024": 60, "BMW_M4_Coupe_G82_2021": 88.3, "Mini_Countryman_One_2017": 37.53, "Mini_Countryman_Cooper_D_2016": 68.42, "BMW_M2_Coupe_G87_2023": 82.8, "BMW_X3_xDrive30i_G01_2018": 52.26, "Mini_Cooper_S_2006": 64.76, "Mini_Cooper_S_Convertible_2011": 61.61, "BMW_3200_CS_1962": 45.45, "BMW_X6_M_Competition_F96_2024": 77.41, "Mini_Cooper_S_2002": 65.09, "BMW_550e_xDrive_G60_2024": 69.49, "BMW_i5_eDrive40_G60_2024": 72.15, "Mini_Clubman_Cooper_2009": 55.36, "BMW_M3_GT_E36_1994": 67.11, "BMW_i7_xDrive60_G70_2023": 84.91, "BMW_X6_M60i_xDrive_G06_2023": 68.91, "Mini_Clubvan_Cooper_D_2013": 42.7, "BMW_X7_M60i_xDrive_G07_2024": 65.22, "BMW_340i_2017": 84.75, "BMW_M2_CS_Racing_F87_2020": 78, "BMW_1800_TISA_1965": 52.76, "Mini_Cooper_5_door_2016": 53.06, "BMW_M4_DTM_F82_2014": 93.55, "BMW_X5_xDrive30d_G05_2022": 52.73, "Mini_Countryman_SE_ALL4_2024": 63.64, "BMW_X4_M_Competition_F98_2022": 76.6, "BMW_725Ld_G12_2017": 58.93, "BMW_i5_M60_xDrive_G60_2024": 81.26, "Mini_One_2002": 34.66, "Mini_Cooper_C_2024": 52.14, "BMW_X5_xDrive50e_G05_2023": 65.71, "Mini_Cooper_SE_2024": 65.31, "BMW_325xi_1997": 52.6, "Mini_John_Cooper_Works_Countryman_ALL4_2024": 60.71, "BMW_M240i_xDrive_Coupe_G42_2022": 61.19, "Mini_Cooper_S_Works_210_Cabriolet_2017": 65.35, "BMW_X2_sDrive18d_U10_2023": 44.03, "BMW_850Ci_1995": 65.93, "BMW_530i_xDrive_G60_2024": 65.91, "BMW_X4_xDrive20d_G02_2019": 44.38, "BMW_iX_xDrive45_i20_2025": 70, "BMW_335d_xDrive_Touring_2016": 53.61, "BMW_M5_Touring_E34_1994": 68.29, "BMW_725d_G11_2017": 59.2, "Mini_Countryman_Cooper_SD_ALL4_2012": 43.89, "BMW_i4_M60_xDrive_2025": 77.78, "BMW_iX1_eDrive20_U11_2023": 63.57, "BMW_30_CS_E9_1971": 53.76, "BMW_M4_Competition_M_xDrive_Convertible_G83_2023": 76.75, "BMW_X3_M40d_G01_2020": 67.14, "Mini_1499_GT_2018": 41.7, "BMW_X7_xDrive40i_G07_2019": 62.37, "BMW_520d_2002": 55.86, "BMW_iX_M70_xDrive_i20_2025": 85.71, "BMW_X7_xDrive40d_G07_2020": 53.76, "Mini_Countryman_Cooper_S_ALL4_2014": 53.87, "BMW_420i_Gran_Coupe_G26_2021": 56.9, "BMW_320i_Group_5_E21_1975": 66.13 }
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