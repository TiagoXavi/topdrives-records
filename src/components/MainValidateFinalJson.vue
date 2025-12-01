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
    //   let newMras = { "Alpine_A480_2022": 106.6, "Aston_Martin_Vulcan_2016": 103.7, "Audi_A4_quattro_32_FSI_B7_2005": 64.89, "Audi_A5_quattro_32_FSI_B8_2010": 63.74, "Audi_A5_Sportback_quattro_32_FSI_B8_2011": 67.74, "Audi_A6_Avant_quattro_42_C6_2010": 74.36, "Audi_A6_Saloon_50_TFSI_e_2024": 66.29, "Audi_A8_42_V8_quattro_D3_2006": 76.32, "Audi_A8_55_TFSI_D5_2023": 68.83, "Audi_A8_L_42_TDI_quattro_D3_2006": 61.7, "Audi_A8_L_50_TDI_D5_2023": 58.33, "Audi_A8_quattro_42_FSI_D4_2012": 75, "Audi_A8_quattro_60_D3_2005": 69.01, "Audi_Q5_50_TFSI_e__2024": 63.04, "Audi_Q6_etron_quattro_2024": 55.56, "Audi_Q8_50_etron_quattro_2024": 64.77, "Audi_RS_4_Avant_Competition_B9_2023": 72.55, "Audi_RS_5_Sportback_B9_2020": 75.51, "Audi_RS_6_Avant_performance_C8_2023": 68.09, "Audi_RS_7_C8_2020": 77.27, "Audi_S4_B9_2022": 61.97, "Audi_S5_Cabriolet_F5_2018": 71.01, "Audi_S5_Coupe_TDI_B95_2021": 63.77, "Audi_S5_F5_2018": 70.31, "Audi_S6_Avant_TDI_C8_2022": 66.22, "Audi_SQ8_TFSI_2023": 76.47, "Citroen_BX_4TC_Group_B_1986": 83.9, "Gumpert_Apollo_Enraged_2012": 92, "Hyundai_Genesis_PM580T_2013": 106.8, "Hyundai_i20_Coupe_Rally_Car_2017": 94.5, "Lamborghini_Aventador_S_Roadster_2018": 87.9, "Lamborghini_Centenario_2016": 88.5, "Lamborghini_Huracan_Performante_Spyder_2018": 92.3, "Lamborghini_Sian_FKP_37_2019": 84.8, "Lamborghini_Temerario_2024": 87.2, "Lancia_Delta_HF_Integrale_16v_1990": 88.6, "Lotus_Elise_111R_2004": 60.49, "Mazda_RT24P_2017": 103.8, "McLaren_720S_2018": 103.1, "MG_Metro_6R4_Clubman_1985": 80.6, "Nissan_Bluebird_SSS-R_(U12)_1988": 53.9, "Nissan_Sunny_GTIR_N14_Rally_1992": 99.74, "Nissan_Violet_Rally_Car_(A10)_1979": 46.64, "Peugeot_908_HDi_FAP_2007": 104, "Peugeot_908_HYbrid4_2011": 108, "Peugeot_908_HY_2008": 109.1, "Porsche_911_Turbo_S_38_9912_2016": 79.6, "Subaru_Impreza_Group_A_1995": 104.1, "TVR_Cerbera_Speed_12_2003": 113.7, "Ultima_Evolution_Coupe_2015": 103.3, "Vauxhall_Astra_GSi_1991": 58.55, "Vauxhall_Astra_Hybrid_2022": 50, "Vauxhall_Astra_V8_Coupe_Touring_Car_2001": 94.29, "Vauxhall_Calibra_20i_16V_1989": 53.29, "Vauxhall_Calibra_25i_V6_1993": 65.77, "Vauxhall_Corsa_Hybrid_Concept_2007": 25.25, "Vauxhall_Mokka_Moscow_Edition__2014": 54.01, "Vauxhall_Omega_25_DTI_Caravan_2002": 45.08, "Vauxhall_Omega_V8Com_Concept_1999": 87.34, "Vauxhall_Senator_30i_24V_1990": 66.91, "Vauxhall_Signum_2_Concept_2001": 74.23, "Vauxhall_Vectra_GT_1992": 51.49, "Volkswagen_Amarok_20_BiTDI_2012": 52.85, "Volkswagen_Amarok_30_TDI_2022": 51.6, "Volkswagen_Arteon_14_TSI_eHybrid_2021": 70.48, "Volkswagen_Arteon_15_TSI_2017": 71.43, "Volkswagen_Arteon_20_BiTDI_4MOTION_2017": 59.62, "Volkswagen_Arteon_R_2020": 60.26, "Volkswagen_Arteon_R_Shooting_Brake_2020": 59.49, "Volkswagen_Arteon_Shooting_Brake_14_TSI_eHybrid_2021": 69.81, "Volkswagen_Arteon_Shooting_Brake_15_TSI_2021": 70.83, "Volkswagen_Arteon_Shooting_Brake_20_TDI_4MOTION_2020": 59.42, "Volkswagen_Arteon_Shooting_Brake_20_TSI_2020": 62.71, "Volkswagen_Atlas_20_TSI_Peak_Edition_2024": 62.81, "Volkswagen_Atlas_36_VR6_FSI_2018": 62.93, "Volkswagen_Atlas_Basecamp_2019": 62.93, "Volkswagen_Atlas_Cross_Sport_20_TSI_2021": 59.2, "Volkswagen_Beetle_25_2012": 54.39, "Volkswagen_Beetle_Dune_20_TDI_2016": 47.85, "Volkswagen_Beetle_Dune_Cabriolet_12_TSI_2016": 63.89, "Volkswagen_Caddy_California_2022": 69.75, "Volkswagen_Caddy_Cargo_20_TDI_2021": 70.83, "Volkswagen_Caddy_Topos_Sail_2008": 53.6, "Volkswagen_California_20_BiTDI_2013": 50.26, "Volkswagen_California_20_TDI_4MOTION_2020": 70.59, "Volkswagen_California_20_TSI_2024": 65.07, "Volkswagen_Concept_One_1994": 83.92, "Volkswagen_Concept_R_2003": 60.24, "Volkswagen_Corrado_Cabriolet_Prototype__1993": 70.71, "Volkswagen_Crafter_20_TDI_4MOTION_2017": 45.02, "Volkswagen_CrossGolf_14_TSI_2006": 66.91, "Volkswagen_Cross_Polo_12_TSI_2010": 76, "Volkswagen_Eos_36_VR6_2009": 58.04, "Volkswagen_Golf_10_eTSI_2020": 43.28, "Volkswagen_Golf_15_eTSI_2020": 63.28, "Volkswagen_Golf_18T_1997": 51.35, "Volkswagen_Golf_18_1992": 67.65, "Volkswagen_Golf_19_TDI_1992": 52.41, "Volkswagen_Golf_19_TDI_1997": 48.24, "Volkswagen_Golf_19_TDI_2003": 48.45, "Volkswagen_Golf_20_TDI_2008": 56.05, "Volkswagen_Golf_20_TDI_2020": 64.12, "Volkswagen_Golf_Alltrack_18_TSI__2019": 48.81, "Volkswagen_Golf_Alltrack_20_TDI_2022": 50.83, "Volkswagen_Golf_Cabriolet_14_TSI_2011": 46.08, "Volkswagen_Golf_Cabriolet_20_1994": 36.78, "Volkswagen_Golf_Cabriolet_GLI_1982": 37.39, "Volkswagen_Golf_eR1_Concept__2020": 112, "Volkswagen_Golf_Estate_10_eTSI_2021": 55.56, "Volkswagen_Golf_Estate_14_TSI_2015": 56.68, "Volkswagen_Golf_Estate_15_eTSI_2021": 50.63, "Volkswagen_Golf_Estate_20_TDI_2009": 54.44, "Volkswagen_Golf_Estate_20_TDI_2021": 59.44, "Volkswagen_Golf_GTD_2013": 57.26, "Volkswagen_Golf_GTD_2020": 68.69, "Volkswagen_Golf_GTE_2015": 71.57, "Volkswagen_Golf_GTE_2021": 57.66, "Volkswagen_Golf_GTI_16v_1987": 42.25, "Volkswagen_Golf_GTI_2020": 88.5, "Volkswagen_Golf_GTI_25th_Anniversary_Edition_2001": 52.52, "Volkswagen_Golf_GTI_Clubsport_2020": 86.96, "Volkswagen_Golf_GTI_Clubsport_S_2016": 74.32, "Volkswagen_Golf_GTI_Performance_Edition_1_2017": 75.64, "Volkswagen_Golf_GTI_Rallye_G60_Group_A_1990": 83.93, "Volkswagen_Golf_R32_2003": 63.64, "Volkswagen_Golf_R_2021": 81.08, "Volkswagen_Golf_R_Cabriolet_2013": 70.11, "Volkswagen_Golf_R_Estate_2015": 66.37, "Volkswagen_Golf_R_Estate_2021": 79.93, "Volkswagen_Golf_Twin_Drive_2009": 55.33, "Volkswagen_Golf_V6_4MOTION_2000": 58.26, "Volkswagen_Golf_Variant_RaVe_270_2007": 73.42, "Volkswagen_Golf_VR5_1998": 52.07, "Volkswagen_GT_up_Concept__2011": 48.27, "Volkswagen_ID4_GTX_2021": 48.44, "Volkswagen_ID4_Pro_4MOTION_77kWh_2024": 49.68, "Volkswagen_ID5_GTX_2023": 50.6, "Volkswagen_ID7_GTX_2023": 46.45, "Volkswagen_ID7_Pro_77kWh_2023": 56.99, "Volkswagen_ID_2all_Concept_2023": 53.44, "Volkswagen_ID_Aero_2022": 56.88, "Volkswagen_ID_Crozz_2017": 55.18, "Volkswagen_ID_LIFE_2021": 52.05, "Volkswagen_ID_Vizzion_2018": 56.18, "Volkswagen_Jetta_GLI_2004": 61.48, "Volkswagen_Jetta_GLI_2007": 72.55, "Volkswagen_Jetta_GLI_2016": 60.19, "Volkswagen_Jetta_GLI_2022": 75.29, "Volkswagen_Lupo_14_16v_FSI_2000": 48.95, "Volkswagen_Lupo_14_TDI_1999": 48.02, "Volkswagen_Multivan_14_TSI_eHybrid_2022": 38.53, "Volkswagen_New_Beetle_18T_1999": 46.45, "Volkswagen_New_Beetle_25_2006": 43.94, "Volkswagen_New_Beetle_RSi_Cabrio__2003": 55.96, "Volkswagen_New_Beetle_Turbo_S__2002": 58.1, "Volkswagen_NMC_2014": 76.54, "Volkswagen_Passat_15_TSI_2024": 55.48, "Volkswagen_Passat_15_TSI_eHybrid_2024": 51.01, "Volkswagen_Passat_19_TDI_1997": 54.73, "Volkswagen_Passat_20_TSI_4MOTION_2024": 56.82, "Volkswagen_Passat_22L_1985": 40.65, "Volkswagen_Passat_25_TDI_V6_2001": 53.85, "Volkswagen_Passat_32_FSI_4MOTION_2005": 62.86, "Volkswagen_Passat_Alltrack_20_TDI_2015": 55.47, "Volkswagen_Passat_Alltrack_20_TSI_2010": 55.64, "Volkswagen_Passat_Alltrack_20_TSI_2015": 62.5, "Volkswagen_Passat_Estate_20_TSI_4MOTION_2019": 68.75, "Volkswagen_Passat_GTE_2020": 73.96, "Volkswagen_Passat_GT__2018": 75.61, "Volkswagen_Passat_R36_2008": 60.36, "Volkswagen_Passat_R_GT_Concept_2005": 73.58, "Volkswagen_Passat_Saloon_20_BiTDI_4MOTION__2016": 54.55, "Volkswagen_Passat_VR5_1997": 54.9, "Volkswagen_Passat_VR6_1994": 54.02, "Volkswagen_Passat_W8_2002": 54.17, "Volkswagen_Passat_W8_Estate_2002": 56.84, "Volkswagen_Phaeton_60_W12_2004": 61.7, "Volkswagen_Phaeton_V10_TDI_2003": 58.56, "Volkswagen_Phideon_30_V6_2016": 59.41, "Volkswagen_Phideon_GTE__2017": 57.94, "Volkswagen_Polo_10_TSI_2017": 45, "Volkswagen_Polo_14_TSI_BlueGT_2009": 51.44, "Volkswagen_Polo_16v_2000": 42.1, "Volkswagen_Polo_19_TDI_1994": 36.73, "Volkswagen_Polo_Cabrio_2007": 50, "Volkswagen_Polo_GTI_2014": 68.82, "Volkswagen_Polo_GTI_2021": 69.66, "Volkswagen_Polo_GTI_R5_2018": 50.12, "Volkswagen_Polo_R_WRC_2013": 84.09, "Volkswagen_Scirocco_14_TSI_2008": 63.33, "Volkswagen_Scirocco_20_TDI_2008": 71.77, "Volkswagen_Scirocco_BiMotor_1983": 59.89, "Volkswagen_Scirocco_Storm_1984": 45.4, "Volkswagen_Sharan_28_VR6_1995": 48.89, "Volkswagen_Taigo_10_TSI_2022": 47.29, "Volkswagen_Taigo_15_TSI_2021": 60.47, "Volkswagen_Talagon_530_V6_2021": 39.53, "Volkswagen_Taos_15T_TSI_4MOTION_2024": 46.76, "Volkswagen_TCross_10_TSI_2018": 42.21, "Volkswagen_TCross_15_TSI_2020": 57.45, "Volkswagen_Tiguan_15_eTSI_2024": 49.14, "Volkswagen_Tiguan_15_TSI_2018": 55.06, "Volkswagen_Tiguan_15_TSI_eHybrid_2024": 47.62, "Volkswagen_Tiguan_20_TDI_2024": 54.6, "Volkswagen_Tiguan_20_TDI_4MOTION_2016": 52.16, "Volkswagen_Tiguan_20_TSI_4MOTION_2018": 55.9, "Volkswagen_Tiguan_20_TSI_4MOTION_2024": 60.22, "Volkswagen_Tiguan_Allspace_20_BiTDI_4MOTION_2017": 57.66, "Volkswagen_Tiguan_Allspace_20_TSI_4MOTION_2021": 59.6, "Volkswagen_Tiguan_GTE_Active_2016": 57.01, "Volkswagen_Touareg_30_TDi___2003": 42.76, "Volkswagen_Touareg_36_FSI_2006": 61.03, "Volkswagen_Touareg_40_V8_TDI_2018": 66.2, "Volkswagen_Touareg_42_V8_FSI_2002": 60.63, "Volkswagen_Touareg_42_V8_TDI_2010": 56.24, "Volkswagen_Touareg_50_V10_TDI_2002": 61.16, "Volkswagen_Touareg_R_eHybrid_2020": 69.01, "Volkswagen_Touareg_R_GT_Concept__2005": 82.02, "Volkswagen_Touareg_TDI_Pikes_Peak_2007": 66.09, "Volkswagen_Transporter_20_TSI_2017": 41.59, "Volkswagen_Transporter_Edition_25_Multivan_2011": 43.18, "Volkswagen_Transporter_Sportline_20_BiTDI_2021": 41.42, "Volkswagen_TRoc_20_TDI_4MOTION_2017": 40.55, "Volkswagen_TRoc_20_TSI_2017": 52.71, "Volkswagen_TRoc_Cabriolet_15_TSI_2020": 55.9, "Volkswagen_TRoc_R_2023": 66.2 }
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