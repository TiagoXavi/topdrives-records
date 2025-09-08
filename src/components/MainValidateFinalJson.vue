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
    //   let newMras = { "Alfa_Romeo_156_GTA_2002": 61.22, "Alpine_A11050_2012": 94.29, "Alpine_A110S_2019": 72.41, "Alpine_A110_1800_Group_4_Works_1974": 66.67, "Alpine_A110_First_Edition_2017": 71.55, "Alpine_A110_GT4_2018": 94.74, "Alpine_A110_Legende_GT_2021": 70, "Alpine_A110_Rally__2021": 85.11, "Alpine_A110_SportsX__2020": 74.2, "Alpine_A210_1966": 75.58, "Alpine_A220_1968": 87.5, "Alpine_A310_1976": 68.42, "Alpine_A4810_2022": 100, "Alpine_A610_1991": 56.7, "Alpine_Celebration_Concept__2015": 63.64, "Alpine_GTA_V6_Turbo_Mille_Miles_1989": 65.69, "Alpine_M64_1964": 70.53, "Alpine_V6_GT_1984": 61.07, "Alpine_V6_GT_Turbo_1986": 60, "Alpine_Vision_Concept__2016": 63.64, "Alpine_Vision_Gran_Turismo__2015": 105.8, "Apollo_Arrow_2016": 103.7, "BMW_M8_GTE_2018": 103.45, "Citroen_CElyee_Touring_Car_2016": 100, "Fiat_Ritmo_130TC_Abarth_1985": 50.06, "Holden_Barina_SRi_XC_2004": 50.7, "Honda_Civic_Tourer_NGTC_2014": 75.46, "Honda_Civic_Type_R_FD2_2007": 68.89, "Hyundai_Elantra_N_TCR_2024": 82.69, "Infiniti_Prototype_9_2017": 45.3, "Koenigsegg_Agera_R_2014": 110, "Lamborghini_Aventador_SVJ_2018": 88, "Lamborghini_Miura_P_400_Jota_1970": 72, "Lamborghini_Sesto_Elemento_2010": 81, "Lamborghini_Veneno_Roadster_2013": 90, "Matra_530_1970": 45.1, "Matra_Djet_5_1962": 32.33, "Matra_Murena_1980": 43.23, "Mitsubishi_Carisma_GT_Evolution_V_Group_A_1998": 92.2, "Mitsubishi_Lancer_Evolution_II_Group_A_1994": 94.17, "Nissan_PENNZOIL_NISMO_GTR_1998": 94.29, "Peugeot_405T16Dakar_1988": 80, "Peugeot_405_T16_Pikes_Peak_1988": 84.46, "Porsche_718_Boxster_GTS_40_982_2020": 79.83, "Porsche_718_Cayman_GTS_40_982_2020": 79.83, "Porsche_911_Carrera_4_Cabriolet_3.0_(992)_2019": 72.9, "Renault_11_Turbo_1984": 58.7, "Renault_11_Turbo_Group_A_1985": 57.48, "Renault_15_TS_1971": 28.1, "Renault_18_Turbo_1980": 40.98, "Renault_25_V6_Turbo_Baccara_1992": 58.82, "Renault_5_Alpine_Turbo_1982": 32.37, "Renault_8_Gordini_R1135_Group_2_1967": 26.75, "Renault_Alaskan_Ice_Edition_2019": 42.54, "Renault_Altica__2006": 54.62, "Renault_Arkana_ETech_Hybrid_145_2021": 51.04, "Renault_Austral_ETech_Hybrid_2023": 58.39, "Renault_Be_Bop_2003": 74.04, "Renault_Captur_13_TCe_155_2024": 54.38, "Renault_Captur_16_ETech_Plugin_Hybrid_160_2023": 43.92, "Renault_Captur_Concept_2011": 46.68, "Renault_Captur_ETech_Hybrid_145_2024": 49.08, "Renault_Clio_14_16v_1998": 46.47, "Renault_Clio_16s_Group_A_1991": 62.5, "Renault_Clio_Baccara_18_Auto_1991": 44.02, "Renault_Clio_Blue_dCi_85_2020": 40.55, "Renault_Clio_Cup_2019": 66.67, "Renault_Clio_ETech_Hybrid_140_2021": 55.46, "Renault_Clio_ETech_Hybrid_145_2023": 50.93, "Renault_Clio_II_Cup__2007": 56.3, "Renault_Clio_R3_2007": 55.45, "Renault_Clio_RSi_18_1994": 41.97, "Renault_Clio_Sport_Tourer_15_dCi_2008": 42.06, "Renault_Clio_TCe_100_2020": 43.78, "Renault_Clio_TCe_130_2020": 49.19, "Renault_Clio_V6_Trophy_1999": 51.65, "Renault_Coupe_Corbusier__2015": 60.12, "Renault_Egeus_2005": 60.71, "Renault_Espace_12_ETech_Hybrid_2023": 60, "Renault_Espace_18_TCe_225_2018": 59.5, "Renault_Espace_20_Blue_dCi_200_2018": 61.27, "Renault_Espace_22_Quadra_RXE_1991": 36.12, "Renault_Espace_30_V6__1997": 54.56, "Renault_Espace_Spider_1998": 40.8, "Renault_Fluence_Concept_2004": 57.58, "Renault_Fluence_GT_Touring_Car_2015": 98.11, "Renault_Grand_Kangoo_15_dCi_2012": 29.51, "Renault_Grand_Kangoo_TCe_130_2024": 55.88, "Renault_Kangoo_Be_Bop_2008": 36.9, "Renault_Kangoo_Express_Maxi_15_dCi_2016": 30.16, "Renault_Kangoo_Sportway_16_2008": 34.28, "Renault_Kangoo_TCe_100_2020": 34.7, "Renault_Kangoo_Van_Blue_dCi_115_2021": 31.08, "Renault_Kiger_10_Turbo_2020": 34.41, "Renault_Koleos_2000": 46.35, "Renault_KWID_Concept__2014": 68.25, "Renault_Laguna_30_V6_2000": 78.18, "Renault_Laguna_30_V6_2001": 72.22, "Renault_Laguna_Concept_Car_1990": 58.16, "Renault_Laguna_Sport_Tourer_20_dCi_180_GT__2008": 59.29, "Renault_Latitude_35_V6_2010": 53.6, "Renault_Megane_230_F1_Team_R26__2006": 68.89, "Renault_Megane_275_CupS_2015": 68.75, "Renault_Megane_eVision__2020": 62.5, "Renault_Megane_GT_220_Sport_Tourer_2013": 63.72, "Renault_Megane_GT_TCe_205_2017": 61.47, "Renault_Megane_RS_TCR_2019": 85.19, "Renault_Megane_Sport_Tourer_16_ETech_Hybrid_2023": 49, "Renault_Megane_Sport_Tourer_DCi_115_2021": 43.06, "Renault_Megane_TCe_140_2021": 46.89, "Renault_Megane_TrophyR_2020": 69.86, "Renault_Megane_Ultime__2023": 72.97, "Renault_Morphoz__2020": 15.07, "Renault_Nepta_2006": 41.48, "Renault_Niagara_2023": 63.04, "Renault_Ondelios_2008": 55.31, "Renault_Oroch_TCe_13_2022": 51.72, "Renault_Rafale_ETech_4x4_Hybrid_2024": 56.59, "Renault_Rafale_ETech_Hybrid_2024": 57.05, "Renault_RSpace_2011": 64.81, "Renault_Safrane_Long_Cours_1994": 62.73, "Renault_Scenic_Conquest_19_dCi_2007": 35.07, "Renault_Scenic_ETech_2024": 51.09, "Renault_Scenic_Vision_2022": 66.61, "Renault_Scenic_XMOD_16_dCi_130_2013": 51.09, "Renault_Super_5_Baccara_1988": 39.04, "Renault_Symbioz_2024": 41.94, "Renault_Symbioz_Prototype__2017": 72.15, "Renault_Talisman_Blue_dCi_200_2020": 73.04, "Renault_Talisman_Concept_2001": 64.34, "Renault_Talisman_Energy_TCe_225_2020": 61.4, "Renault_Talisman_Estate_Energy_dCi_160_2017": 53.59, "Renault_Talisman_Estate_Energy_TCe_200_2015": 63.03, "Renault_Talisman_Estate_TCe_225_2018": 63.39, "Renault_Trafic_20_dCI_2019": 23.64, "Renault_Trafic_ETech_2024": 32.91, "Renault_Twingo_Gordini_2010": 49.76, "Renault_TwinRun_2013": 67.19, "Renault_Wind_Concept_2004": 62.04, "Renault_Zoe_eSport__2017": 100, "Rimac_Nevera_2021": 106, "Talbot_Tagora_SX_1980": 52.63, "Volkswagen_Golf_2017": 73.39 }
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