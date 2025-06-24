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
    //   let newMras = { "Alfa_Romeo_GTA_1300_Junior_1968": 46.02, "Audi_RS3_Saloon_(8V)_2015": 69.09, "Audi_RS_Q8_2022": 73.7, "Buick_Skylark_1968": 46.3, "Buick_Verano_2012": 52.77, "Chevrolet_Chevelle_Laguna_LT5_2018": 56.34, "Chevrolet_Corvette_C6R_2007": 100, "Chevrolet_Corvette_Daytona_Prototype_2012": 100, "Chevrolet_WTCC_Ultra_2006": 63.41, "Dodge_Charger_Daytona_SRT_2022": 100, "Honda_Accord_Aerodeck_20__1985": 39.69, "Honda_City_Turbo_II_1983": 31.86, "Honda_Civic_18_iVTEC_2015": 69.68, "Honda_Civic_eHEV_2022": 57.12, "Honda_Civic_Type_R_FK8_2018": 63.83, "Honda_Civic_Type_R_FL5_2022": 69.77, "Honda_Clarity_Electric_2019": 43.96, "Honda_CRV_20_iMMD_Hybrid_AWD_2019": 57.89, "Honda_CRV_eHEV_20_2023": 55.01, "Honda_CRX_del_Sol_Si_1993": 60.94, "Honda_CRZ_Concept_2007": 49.53, "Honda_HRV_16_VTEC_4WD__1998": 47.74, "Honda_HRV_Hybrid_2021": 41.43, "Honda_Integra_Type_R_BTCT_2005": 75.41, "Honda_Jazz_Crosstar_eHEV_2020": 27.37, "Honda_Jazz_eHEV_2022": 37.33, "Honda_NSX_32_2005": 75, "Hyundai_Bayon_10T_2021": 46.96, "Hyundai_Grandeur_16TGDi_HEV_2024": 57.76, "Hyundai_Grandeur_35_GDi_2024": 58.82, "Hyundai_Ioniq_5_63kWh_2024": 80.76, "Hyundai_Ioniq_5_84kWh_2024": 75.79, "Hyundai_Ioniq_5_84kWh_AWD_2024": 59.76, "Hyundai_Ioniq_5_N_eN1_Cup_car_2024": 64.29, "Hyundai_Ioniq_5_N_TA_Spec_2024": 66.67, "Hyundai_Ioniq_5_XRT_2025": 49.15, "Hyundai_Ioniq_9_Long_Range_RWD_2024": 47.64, "Hyundai_Ioniq_Concept_Seven__2021": 81.71, "Hyundai_Kona_10T_2024": 61.65, "Hyundai_Kona_16T_2024": 56.46, "Hyundai_Kona_16_Hybrid_2024": 57.29, "Hyundai_Kona_Electric_48kWh_2024": 56.19, "Hyundai_Kona_Electric_65kWh_2024": 61.16, "Hyundai_Santa_Fe_16T_Hybrid_4WD__2024": 75.81, "Hyundai_Santa_Fe_16T_Plugin_Hybrid_4WD_2024": 74.79, "Hyundai_Santa_Fe_XRT_25T_Turbo_AWD_2024": 64.42, "Hyundai_Sonata_20_Hybrid_2023": 61.72, "Hyundai_Sonata_N_Line_25_TGDI_2020": 73.33, "Hyundai_Staria_Load_2022": 29.3, "Hyundai_Tucson_16T_4WD_2024": 53.2, "Hyundai_Venue_10_TGDi_2020": 41.83, "Hyundai_Venue_16_DPi_2019": 42.76, "Infiniti_G20t_P11_1999": 65.64, "Infiniti_QX55_2022": 65.09, "KTM_XBow_GT2_2020": 100, "Lamborghini_Autentica_2023": 90.91, "Lamborghini_Hurancan_STO_2020": 92.6, "Lamborghini_LMA002_1982": 55.04, "Land_Rover_Range_Rover_Evoque_Autobiography_Dynamic_2015": 62.04, "Lincoln_MKZ_Black_Label_2017": 66.67, "Mitsuoka_BUBU_356_Speedster__1989": 37.74, "Mitsuoka_Buddy_2020": 45.94, "Mitsuoka_Dore_1991": 46.91, "Mitsuoka_GalueIII_2008": 65.56, "Mitsuoka_GalueII_2000": 59.35, "Mitsuoka_GalueI_1996": 45.32, "Mitsuoka_Galue_2015": 55.97, "Mitsuoka_Galue_204_2008": 59.55, "Mitsuoka_Galue_Convertible_2007": 52.48, "Mitsuoka_Himiko_2008": 53.53, "Mitsuoka_Himiko_2018": 54, "Mitsuoka_LeSeyde_1990": 36.4, "Mitsuoka_New_LeSeyde_2001": 52.43, "Mitsuoka_Nouera_2004": 68.65, "Mitsuoka_Orochi_2007": 59.93, "Mitsuoka_Orochi_Final_Edition_2012": 59.93, "Mitsuoka_Orochi_Gold_Premium_2010": 59.92, "Mitsuoka_Orochi_Kabuto_2009": 60.11, "Mitsuoka_Orochi_Nude_Top_2005": 62.5, "Mitsuoka_Orochi_Zero_2008": 61.66, "Mitsuoka_Ryoga_1998": 48.01, "Mitsuoka_Ryugi_2015": 57.78, "Mitsuoka_Viewt_2008": 39.63, "Mitsuoka_Viewt_story_2023": 47.21, "Mitsuoka_Zero1_16_1994": 39.52, "Mitsuoka_Zero1_Classic_Type_F_1996": 38.35, "Nissan_180SX_S13_1989": 54.4, "Nissan_180SX_Type_X_S13_1995": 54.4, "Nissan_200SX_S14_1996": 65.38, "Nissan_200SX_SER_B14_1996": 62.28, "Nissan_300ZX_Z31_1983": 55.34, "Nissan_Altima_VCTurbo_L34_2019": 70.45, "Nissan_Aprio_2007": 44.09, "Nissan_Ariya_63kWh_FE0_2022": 47.72, "Nissan_Ariya_e4ORCE_87kWh_FE0_2022": 80.88, "Nissan_Ariya_Nismo_FE0_2024": 72.07, "Nissan_Armada_Y62_2017": 61.39, "Nissan_Bluebird_Super_Silhouette_910_1983": 93.94, "Nissan_Bluebird_Turbo_Maxima_Legrand_U11_1986": 48.94, "Nissan_Cedric_Gran_Turismo_SV_Y31_1987": 47.23, "Nissan_Cedric_Gran_Turismo_SV_Y32_1993": 50.05, "Nissan_Cedric_Gran_Turismo_Ultima_Y33_1997": 63.46, "Nissan_Datsun_Sunny_Excellent_Coupe_B110_1973": 68.56, "Nissan_Fairlady_Z_Stune_GT_Z33_2004": 60.49, "Nissan_Frontier_D41_2021": 57.1, "Nissan_GTP_ZXTurbo_1985": 113.21, "Nissan_GTR_R35_2012": 69.1, "Nissan_Interstar_dCi_180_2022": 50.87, "Nissan_JukeR_20_F15_2015": 63.64, "Nissan_Juke_Hybrid_F16_2022": 54.55, "Nissan_Kicks_P15_2018": 45.58, "Nissan_Laurel_C33_1988": 23.28, "Nissan_Laurel_Club_S_Turbo_C34_1994": 56.09, "Nissan_Laurel_Club_S_Turbo_C35_1999": 54.93, "Nissan_March_K12_2005": 46.48, "Nissan_March_Nismo_S_K13_2014": 47.72, "Nissan_MID_4_1985": 53.17, "Nissan_Murano_AWD_Z52_2015": 66.61, "Nissan_Murano_Hybrid_Z52_2016": 51.3, "Nissan_Navara_D40_2010": 49.78, "Nissan_Note_ePower_Nismo_E12_2018": 38.13, "Nissan_Pathfinder_Rock_Creek_R53_2022": 57.85, "Nissan_Primastar_dCi_170_2022": 60.34, "Nissan_Prince_R380_AI_1966": 78.79, "Nissan_Pulsar_Milano_X1_Twincam_N13_1986": 44.49, "Nissan_Pulsar_VZR_N1_Version2_N15_1998": 64.21, "Nissan_R382_1969": 107.41, "Nissan_R383_1970": 109.37, "Nissan_R87E_1987": 107.69, "Nissan_Rogue_T33_2023": 57.66, "Nissan_Saurus_Jr_1991": 50.51, "Nissan_Sentra_Nismo_B17_2018": 66.97, "Nissan_Sentra_SER_B13_1992": 55.64, "Nissan_Sentra_SER_Spec_V_B15_2002": 54.64, "Nissan_Sentra_SER_Spec_V_B16_2011": 59.93, "Nissan_Sentra_SR_B17_2013": 52.23, "Nissan_Sentra_SR_B18_2020": 55.62, "Nissan_Serena_Nismo_C27_2017": 50.05, "Nissan_Silvia_Convertible_S13_1988": 52.78, "Nissan_Silvia_Grand_Prix_S12_1984": 51.47, "Nissan_Silvia_Ks_S13_1988": 54.43, "Nissan_Silvia_Ks_S14_1993": 56.4, "Nissan_Silvia_Qs_S13_1988": 51.14, "Nissan_Silvia_SpecS_S15_1999": 52.33, "Nissan_Skyline_2000GTR_KPGC10_1970": 50.67, "Nissan_Skyline_2000GTR_KPGC110_1973": 55.56, "Nissan_Skyline_2000GTR_PGC10_1969": 51.85, "Nissan_Skyline_2door_Sports_Coupe25GT_Turbo_1998": 56.24, "Nissan_Skyline_2door_Sport_Coupe_GTS25_Type_S_R32_1991": 53.35, "Nissan_Skyline_4door_Hardtop_GTS_Twincam_24V_Turbo_R31_1987": 58.64, "Nissan_Skyline_4door_Sports_Sedan25GTX_Turbo_1998": 56.52, "Nissan_Skyline_Coupe_GTS25t_Type_M_R33_1993": 61.32, "Nissan_Skyline_GTR_Vspec_N1_R34_2001": 63.16, "Nissan_Skyline_GTS25t_Type_M_specII_R33_1996": 61.32, "Nissan_Skyline_GTS25_Type_XG_R32_1993": 53.47, "Nissan_Skyline_GTSR_R31_1987": 59.09, "Nissan_Skyline_GTSt_Type_M_R32_1993": 56.48, "Nissan_Stagea_250t_RS_Four_V_M35_2002": 59.52, "Nissan_Stagea_250_RX_Four_M35_2005": 69.9, "Nissan_Stagea_25t_RS_Four_V_WC34_1998": 60.31, "Nissan_Titan_A61_2020": 57.09, "Nissan_Titan_PRO4X_A60_2008": 39.34, "Nissan_Titan_XD_A61_2016": 49.79, "Nissan_Titan_XD_PRO4X_A61_2016": 39.43, "Nissan_Townstar_TCe_130_2021": 41.28, "Nissan_Versa_SR_2023": 40.81, "Nissan_Xterra_SE_SC_WD22_2002": 41.9, "Nissan_XTrail_Crawler_Concept_2024": 52.43, "Nissan_XTrail_ePower_T33_2022": 54.76, "Nissan_XTrail_T33_2021": 46.01, "Nissan_Z_Nismo_RZ34_2023": 76.36, "Nissan_Z_RZ34_2022": 78.69, "Peugeot_3008_DKR_2017": 80.33, "Pontiac_Trans_Am_20th_Anniversary_1989": 54.89, "Porsche_911_Patina_Paint_to_Sample_2022": 80.32, "Porsche_968_Turbo_RS_1992": 88.46, "Radical_SR10_2020": 70.59, "Renault_Alpine_A442_1978": 100, "Skoda_Fabia_RS_2000__2011": 108.28, "Subaru_WRX_STI_Type_RA_(VAF)_2018": 56.26, "Suzuki_Baleno_2022": 64.46, "Suzuki_Ciaz_2014": 90.17, "Suzuki_ConceptS_2002": 71.13, "Suzuki_Concept_Kizashi_2007": 58.79, "Suzuki_Concept_Kizashi_2_2007": 33.36, "Suzuki_Equator_2009": 44.18, "Suzuki_eVX_Concept_2023": 47.33, "Suzuki_eWX_EV_Concept_2023": 26.43, "Suzuki_Fronx_2023": 64.02, "Suzuki_Grand_Vitara_2010": 54.97, "Suzuki_Grand_Vitara_Mild_Hybrid_2023": 56.6, "Suzuki_Ignis_15_4Grip_2001": 31.38, "Suzuki_Kizashi_Apex_Turbo_Concept__2011": 63.81, "Suzuki_Landy_2023": 76.92, "Suzuki_SCross_Hybrid_2021": 86.99, "Suzuki_SCross__2021": 75.83, "Suzuki_Solio_Bandit_Hybrid_2023": 71.92, "Suzuki_Solio_Hybrid_2023": 73.21, "Suzuki_Swift_12_DUALJET_SHVS_ALLGRIP_2017": 46.91, "Suzuki_Swift_15_SZ4_2010": 54.38, "Suzuki_Swift_2024": 69.59, "Suzuki_Swift_4x4_RS_2006": 56.8, "Suzuki_Swift_GTi_SA_1986": 37.17, "Suzuki_Swift_RS_2004": 48.05, "Suzuki_Swift_Sport_SZR_AZG_2013": 44.86, "Suzuki_SX4_SportBack_2011": 44.38, "Suzuki_SX4_Sport_Sedan_2008": 49.53, "Suzuki_SX4_WRC_2008": 95.24, "Suzuki_Verona_2004": 47.81, "Ultima_Evolution_Coupe_2015": 100, "Vauxhall_Vectra_VXR_2006": 68.13, "Volkswagen_Golf_GTI_TCR_2018": 81.82 }
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