<template>
  <div class="MainValidateFinalJson_Layout">
    <BaseFilterDialog ref="validateFilter"/>
  </div>
</template>

<script>
import cars_final from '../database/cars_final.json' // internal
import BaseFilterDialog from './BaseFilterDialog.vue'

export default {
  name: 'MainValidateFinalJson',
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
      cars_final
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    // insert database MRA to cars_final MRA
    // {
    //   let newMras = { "AC_Cobra_378_GT_2012": 65, "AC_Cobra_378_Superblower_MkIV_2021": 86.49, "Alfa_Romeo_155_V6_TI_DTM_1993": 100, "Alfa_Romeo_177_1978": 90.32, "Alfa_Romeo_4C_2017": 64, "AMC_Concord_304_1978": 41.56, "Aston_Martin_V8_Vantage_Volante_2000": 80.33, "Audi_A5_DTM_2012": 108.11, "Audi_R18_TDI_Ultra_2011": 126.26, "Audi_S6_1995": 60.95, "BAC_Mono_2015": 81.25, "Bentley_Continental_GT_Convertible_2020": 77.27, "BMW_335d_2016": 62.16, "BMW_M340i_xDrive_Saloon_2019": 76.36, "BMW_M8_Competition_Coupe_2019": 86.11, "Caterham_Seven_420_2015": 58.46, "Chrysler_300C_SRT8_Touring_2006": 65.75, "Chrysler_300C_Touring_Hemi_2004": 72.62, "Chrysler_Cordoba_360_1975": 54.76, "Chrysler_Crossfire_SRT6_Roadster_2005": 68.42, "Chrysler_LeBaron_GTC_1988": 46, "Chrysler_LeBaron_GTC_Turbo_Convertible_1989": 49.05, "Dodge_Challenger_SRT_Demon_2017": 96, "Dodge_Challenger_SRT_Hellcat_2015": 90.21, "Dodge_Challenger_SRT_Hellcat_Redeye_Widebody_2019": 99.71, "Dodge_Challenger_SRT_Hellcat_Widebody_2018": 93.15, "Dodge_Challenger_SRT_Super_Stock_2020": 98.16, "Dodge_Charger_Scat_Pack_Widebody_2020": 79.63, "Dodge_Charger_SRT_Hellcat_Redeye_Widebody_2022": 102.94, "Dodge_Charger_Super_Bee_2012": 73.68, "Dodge_Ram_1500_Classic_Warlock_2021": 30.69, "Dodge_Ram_2500_Power_Wagon_2019": 54.14, "Dodge_Ram_SRT10_2004": 75.38, "Fiat_PanDAKAR_2006": 28.78, "Ford_Airstream_Concept_2007": 0, "Ford_Bronco_Heritage_Edition_2023": 46.5, "Ford_Bronco_Raptor_2022": 45.28, "Ford_Bronco_Sport_2021": 52.44, "Ford_Capri_Perana_1971": 82.11, "Ford_ETransit_2021": 34.45, "Ford_Evos_2020": 35.07, "Ford_Explorer_2020": 67.47, "Ford_Explorer_ST_2020": 64.2, "Ford_F150_2021": 45.86, "Ford_F150_Raptor_37_Performance_Package_2021": 54.3, "Ford_Fairlane_500_1964": 63.31, "Ford_Fairlane_Concept_2005": 63.2, "Ford_Falcon_Futura_Sprint_1963": 77.11, "Ford_GN34_1985": 74.67, "Ford_Maverick_2021": 44.08, "Ford_Mighty_F350_Tonka_Concept_2002": 22.51, "Ford_Model_U_2003": 49.44, "Ford_Mustang_Boss_351_1971": 71.6, "Ford_Mustang_I_Concept_1962": 57.11, "Ford_Mustang_MachE_2020": 64.83, "Ford_Mustang_Mach_1_1969": 68.37, "Ford_Mustang_Mach_1_2004": 67.09, "Ford_Mustang_Mach_1_2021": 76.92, "Ford_Mustang_Mach_1_Super_Cobra_Jet_1969": 66.28, "Ford_Mustang_Mach_2_Concept_1967": 68.42, "Ford_Ranger_2022": 52.02, "Ford_Ranger_Tremor_2021": 49.45, "Ford_Reflex_2006": 58.33, "Ford_Super_Duty_F250_2020": 35.3, "Ford_SVT_F150_Lightning_1993": 33.55, "Ford_SVT_F150_Lightning_1999": 65.69, "Ford_Taurus_SHO_1989": 65.18, "Ford_Thunderbird_1966": 38.04, "Ford_Torino_Cobra_1970": 73.14, "Ginetta_Akula_2019": 103.23, "Ginetta_G56_GT4_Supercup_2021": 99.5, "Holden_Calais_V_International_VE_2008": 62.24, "Holden_HSV_GTSR_W1_2017": 85.15, "Hudson_Italia_1953": 41.71, "Hummer_H3T_Alpha_2009": 27.94, "Hummer_H3_Dakar_2006": 0, "INFINITI_Q60S_2016": 55.68, "Lamborghini_350GT_1964": 69.15, "Lamborghini_400GT_1966": 66.6, "Lamborghini_Countach_25th_Anniversario_1988": 93.75, "Lamborghini_Islero_S_1969": 65.56, "Land_Rover_Discovery_3_2004": 46.35, "Land_Rover_Range_Rover_5.0_V8_2016": 69.89, "Lincoln_Aviator_2020": 64.45, "Lincoln_Blackwood_2001": 44.02, "Lincoln_Continental_1956": 52.79, "Lincoln_Continental_1996": 61.84, "Lincoln_Continental_2018": 71.43, "Lincoln_Continental_Concept_2002": 64.71, "Lincoln_Continental_Concept_2015": 70.42, "Lincoln_Corsair_AWD_2020": 54.96, "Lincoln_Corsair_Grand_Touring_Hybrid_2021": 60.34, "Lincoln_Mark_III_1969": 52.72, "Lincoln_Mark_II_1957": 51.27, "Lincoln_Mark_IV_1975": 53.9, "Lincoln_Mark_VIII_1997": 55.63, "Lincoln_Mark_VII_LSC_SE_1990": 44.22, "Lincoln_MKC_2016": 52.33, "Lincoln_MKS_Concept_2006": 68.42, "Lincoln_MKT_2015": 59.68, "Lincoln_MKX_2017": 63.83, "Lincoln_MKZ_Concept_2012": 68.57, "Lincoln_MKZ_Hybrid_2011": 63.25, "Lincoln_Nautilus_2019": 62.5, "Lincoln_Nautilus_AWD_2019": 59.78, "Lincoln_Nautilus_Black_Label_AWD_2020": 58.53, "Lincoln_Navicross_2003": 75.68, "Lincoln_Navigator_1999": 43.53, "Lincoln_Navigator_2004": 45.97, "Lincoln_Navigator_2007": 43.39, "Lincoln_Navigator_2018": 57.12, "Lincoln_Navigator_Concept_2016": 57.09, "Lincoln_Town_Car_1981": 30.64, "Lincoln_Town_Car_1998": 47.79, "Lincoln_Town_Car_Cartier_L_2002": 48.74, "Lincoln_Zephyr_Concept_2004": 56.74, "Lincoln_Zephyr_Reflection_Concept_2021": 55.27, "Lotus_Exige_Cup_430_2019": 80, "Mazda_Eunos_Roadster_RS-Limited_1994": 58.45, "Mercedes-Benz_AMG_C_63_2015": 80.39, "Mercedes-Benz_AMG_GT4_2018": 99.75, "Mercedes-Benz_AMG_G_55_2006": 60.92, "Mercury_Capri_ASC_McLaren_1984": 73.12, "Mercury_Capri_RS_1984": 46.25, "Mercury_Capri_XR2_1992": 54.82, "Mercury_Comet_Cyclone_1965": 46.64, "Mercury_Comet_Cyclone_GT_Pace_Car_1966": 60.4, "Mercury_Cougar_2001": 60.74, "Mercury_Cougar_Eliminator_1969": 60.08, "Mercury_Cougar_XR7_1993": 56.96, "Mercury_Cyclone_Cobra_Jet_1969": 61.54, "Mercury_Cyclone_GT_1970": 51.48, "Mercury_Grand_Marquis_1992": 46.71, "Mercury_Marauder_2003": 66.31, "Mercury_Marauder_Convertible_Concept_2002": 62.66, "Mercury_Marauder_S55_1963": 60, "Mercury_MC2_1997": 62.22, "Mercury_MC4_1997": 65.79, "Mercury_Messenger_2003": 63.22, "Mercury_Meta_One_2005": 37.87, "Mercury_Milan_2010": 49.46, "Mercury_Montego_2005": 57.69, "Mercury_Mountaineer_1997": 29.26, "Mini_Electric_Shadow_Edition_2021": 0, "Morgan_Plus_4_1962": 54.96, "Morgan_Plus_8_50th_Anniversary_2018": 82.69, "Nissan_Cima_VIP_(Y51)_2012": 71.79, "Nissan_Patrol_Nismo_2016": 63.83, "Nissan_Silvia_Varietta_(S15)_2000": 55.01, "Nissan_Violet_Rally_Car_(A10)_1979": 46.64, "Peugeot_405_T16_Pikes_Peak_1988": 84.46, "Peugeot_907_2004": 68.3, "Peugeot_e-208_2019": 0, "Plymouth_Barracuda_Formula_S_1966": 44.68, "Plymouth_XNR_1960": 40.77, "Pontiac_6000_STE_AWD_1988": 49.44, "Pontiac_GTO_Judge_Ram_Air_IV_1970": 77.12, "Porsche_718_Cayman_GT4_RS_2022": 83.12, "Porsche_718_Cayman_S_25_982_2017": 72.73, "Porsche_911_GT198_1998": 100, "Porsche_Cayenne_Turbo_S_4.8_(958)_2012": 78.18, "Porsche_Cayman_GT4_Clubsport_RGT_40_982_2018": 93.99, "Porsche_Taycan_Turbo_S_2020": 76.92, "RAM_RAM_Rebel_TRX_Concept_2016": 90, "Renault_R5_MAXI_TURBO_1987": 82, "Rezvani_Beast_Alpha_X_Blackbird_2018": 102.47, "RUF_BTR2_1993": 71.84, "Saturn_Sky_Red_Line_2007": 54.97, "Subaru_Leone_1979": 21, "Subaru_WRX_STI_2015": 72.46, "TVR_Typhon_2000": 97.22, "Volvo_V60_Polestar_2015": 0 }
    //   this.cars_final.map(car => {
    //     if (newMras[car.rid]) {
    //       car.mra = newMras[car.rid];
    //     }
    //   })
    // }




    
    this.cars_final.sort((a, b) => b.rq - a.rq)    
    let _this = this.$refs.validateFilter.$data;

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
        // if (y === "Pacific Coast Highway") {
        //   x.country = "US";
        // }
        if (!_this.searchFilters.tags.includes(y)) {
          console.log(y);
          debugger;
        }
      })
    })


    debugger;
    navigator.clipboard.writeText(JSON.stringify(this.cars_final));
  },
  computed: {},
  methods: {},
}
</script>

<style>
</style>