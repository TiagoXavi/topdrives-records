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
    //   let newMras = { "AC_Frua_Convertible_1969": 72.09, "Alfa_Romeo_156_Crosswagon_Q4_2004": 49.32, "Alfa_Romeo_159_Police_Car_2008": 56.76, "Alfa_Romeo_164_20_12V_V6_Turbo_1992": 62.96, "Alfa_Romeo_164_Proteo_1991": 58.16, "Alfa_Romeo_33_Stradale_2023": 81.16, "Alfa_Romeo_75_Turbo_Evoluzione_IMSA_1988": 83.33, "Alfa_Romeo_8C_Competizione_Concept_2003": 74.14, "Alfa_Romeo_8c_Spider_Concept_2005": 83.33, "Alfa_Romeo_Bella_1999": 65, "Alfa_Romeo_Brera_24_JTDM_2006": 56.05, "Alfa_Romeo_Giulia_22_JTDM_2017": 55.83, "Alfa_Romeo_Giulietta_Sprint_Veloce_1959": 31.27, "Alfa_Romeo_Kamal_2003": 76.69, "Alfa_Romeo_Spider_24_JTDM_2007": 53.9, "Alfa_Romeo_Spider_32_2003": 47.81, "Alfa_Romeo_Sportut_1997": 56.99, "Alfa_Romeo_Sprint_Quadrifoglio_Verde_1983": 45.63, "Alfa_Romeo_Stelvio_20_Turbo_Petrol_280_Q4_2023": 56.84, "Alfa_Romeo_Stelvio_22_Turbo_Diesel_210_Q4_2023": 47.77, "Alfa_Romeo_Tipo_C_Bimotore_1935": 131, "Alfa_Romeo_Tonale_Hybrid_VG_160_2023": 47.21, "Alfa_Romeo_Tonale_Plugin_Hybrid_Q4_2023": 57.84, "AMC_Spirit_GT_1979": 30.81, "Aston_Martin_V8_Volante_1986": 60.91, "Audi_100_Avant_28_C4_1994": 55.24, "Audi_100_GL_5E_Saloon_C2_1977": 44.17, "Audi_100_S4_Plus_C4_1993": 64.44, "Audi_100_Saloon_LS_C1_1970": 29.99, "Audi_80_28_quattro_B4_1993": 56.95, "Audi_A1_Citycarver_GB_2021": 34.53, "Audi_A3_18_T_quattro_8L_2002": 52.28, "Audi_A3_40_Sportback_TFSI_e_2023": 72.28, "Audi_A3_8V_2016": 62.14, "Audi_A3_all_street_35_TFSI_2024": 56.74, "Audi_A3_Cabriolet_8P_2012": 60, "Audi_A3_Saloon_8V_2016": 60.75, "Audi_A3_Saloon_8Y_2023": 58.42, "Audi_A3_Sportback_8P_2010": 58.56, "Audi_A3_Sportback_8Y_2023": 57.12, "Audi_A3_Sportback_etron_8V_2018": 66.67, "Audi_A4_18T_quattro_B5_2000": 55.05, "Audi_A4_20_TFSI_B7_2008": 60.1, "Audi_A4_Avant_18T_B5_1998": 51.75, "Audi_A4_Avant_20_TFSI_B8_2012": 60.58, "Audi_A4_Avant_28_quattro_B5_2000": 71.72, "Audi_A4_Avant_quattro_30_B6_2004": 58.26, "Audi_A4_Avant_quattro_32_FSI_B7_2005": 66.32, "Audi_A4_Avant_quattro_32_FSI_B8_2010": 70.93, "Audi_A4_B6_2004": 64.71, "Audi_A4_quattro_30_B6_2004": 61.11, "Audi_A4_quattro_32_FSI_B8_2010": 70.24, "Audi_A5_20_TFSI_B8_2015": 70.65, "Audi_A5_Cabriolet_20_TFSI_B8_2015": 66.04, "Audi_A5_Cabriolet_quattro_32_FSI_B8_2010": 70.97, "Audi_A6_18T_C5_2002": 52.63, "Audi_A6_20_TFSI_C7_2016": 64.65, "Audi_A6_26_quattro_C4_1997": 54.3, "Audi_A6_28_C4_1996": 56.62, "Audi_A6_allroad_4KC8_2021": 63.64, "Audi_A6_allroad_quattro_30_TFSI_C7_2012": 63.64, "Audi_A6_allroad_quattro_42_C6_2010": 74.07, "Audi_A6_Avant_20_TFSI_C7_2016": 66.67, "Audi_A6_Avant_25_TDI_C4_1996": 56.31, "Audi_A6_Avant_28_quattro_C4_1997": 55.24, "Audi_A6_Avant_quattro_27T_C5_2002": 60, "Audi_A6_quattro_27T_C5_2002": 63.11, "Audi_A7_quattro_28_FSI_C7_2014": 64.23, "Audi_A7_Sportback_55_TFSI_e_2024": 68.35, "Audi_A8_Coupe_1997": 64.84, "Audi_A8_L_60_TFSI_e_quattro_2024": 75.81, "Audi_A8_L_W12_quattro_Security_D3_2006": 70.8, "Audi_A8_quattro_42_D2_2002": 68.75, "Audi_etron_GT_quattro_2023": 79.59, "Audi_Q3_45_Sportback_TFSI_e_2022": 54.2, "Audi_Q3_45_TFSI_e_2022": 53.99, "Audi_Q3_8U_2012": 52.85, "Audi_Q3_Sportback_F3_2020": 49.78, "Audi_Q4_45_etron_2024": 58.72, "Audi_Q4_55_Sportback_etron_quattro_2024": 56.04, "Audi_Q5_Sportback_45_TFSI_2024": 58.7, "Audi_Q7_V12_TDI_2010": 67.53, "Audi_Q8_55_Sportback_etron_2024": 62.35, "Audi_Q8_55_TFSI_2024": 58.89, "Audi_R8_GT_Spyder_2011": 90, "Audi_R8_RWD_Spyder_2021": 92.07, "Audi_RS7_Sportback_performance_2024": 71.11, "Audi_RS_3_Nardo_Edition_8V_2020": 70.37, "Audi_RS_3_Saloon_8Y_2023": 70.59, "Audi_RS_3_Sportback_8P_2011": 80.23, "Audi_RS_3_Sportback_performance_edition_8Y_2023": 73.02, "Audi_RS_4_Avant_B8_2014": 86.54, "Audi_RS_4_Avant_Competition_Plus_B9_2023": 72.55, "Audi_RS_5_B9_2020": 77.08, "Audi_RS_5_Coupe_Competition_B9_2023": 73.47, "Audi_RS_5_Sportback_Competition_F5_2023": 72, "Audi_RS_6_Avant_C8_2020": 73.91, "Audi_RS_6_Avant_GT_2024": 77.75, "Audi_RS_etron_GT_2023": 84.21, "Audi_S3_Saloon_8Y_2023": 67.16, "Audi_S4_Avant_B7_2008": 71.43, "Audi_S4_Avant_B8_2014": 64.86, "Audi_S5_Sportback_F5_2018": 72.58, "Audi_S6_Avant_C4_1996": 61.68, "Audi_S6_Avant_C7_2016": 73.33, "Audi_S6_Avant_Plus_C4_1996": 63.53, "Audi_S6_C7_2016": 75, "Audi_S8_D4_2016": 81.25, "Audi_S8_D5_2022": 70.59, "Audi_SQ6_etron_2024": 55.56, "Audi_SQ7_TFSI_2023": 75, "Audi_SQ8_etron_2024": 67.19, "Audi_SQ8_TDI_2019": 69.7, "Audi_TT_20_TFSI_FV_2016": 71.95, "Audi_TT_quattro_20_TDI_8J_2010": 63.39, "Audi_TT_quattro_20_TFSI_FV_2016": 61.63, "Audi_TT_quattro_20_TSFI_8J_2010": 54.08, "Audi_TT_quattro_32_8J_2008": 58.95, "Audi_TT_quattro_Roadster_20_TSFI_8J_2012": 56, "Audi_TT_quattro_Roadster_32_8J_2008": 57.77, "Audi_TT_quattro_Roadster_8N_2004": 57.02, "Audi_TT_quattro_Sport_8N_2005": 60.87, "Audi_TT_RS_Roadster_FV_2016": 68.52, "Audi_TT_S_Roadster_8J_2012": 67.09, "BMW_760Li_xDrive_Shining_Shadow_Special_Edition_2021": 82, "Bugatti_Centodieci_2022": 104.55, "Cadillac_Eldorado_1979": 52.73, "Cadillac_Voyage_1988": 79.26, "Chevrolet_Bel_Air_1957": 49.44, "Chevrolet_Corvette_Z06_C8_2022": 79.88, "Chevrolet_Lacetti_Touring_Car_2006": 63.24, "Citroen_CX_2400_GTi_Rally_1977": 44.78, "Citroen_DS3_WRC_2011": 90.29, "Citroen_SM_Rallye_du_Maroc_1971": 61.36, "Dodge_Aspen_RT_1978": 45.62, "Dodge_Charger_Daytona_Scat_Pack_2024": 86.84, "Dodge_Durango_Pursuit_2021": 63.81, "Fiat_1600_Coupe_1969": 71.25, "Fiat_500C_Hybrid_2020": 35.52, "Fiat_500e_Scorpionissima_2023": 12.89, "Fiat_500e_Scorpionissima_Convertible_2023": 12.7, "Fiat_500L_Custom_2014": 48.83, "Fiat_500X_Dolcevita_2021": 37.8, "Fiat_500X_Hybrid_2023": 37.8, "Fiat_500X_Sport_2019": 50.95, "Fiat_500_Abarth_Scorpion_2014": 57.26, "Fiat_500_Hybrid_2020": 35.52, "Fiat_600_Hybrid_2024": 39.23, "Fiat_695_Biposto_Record_2015": 61.03, "Fiat_695_Tributo_131_Rally_2022": 62.14, "Fiat_Abarth_750_record_car_1956": 60.94, "Fiat_Doblo_Cargo_16_Multijet_II_2018": 52.52, "Fiat_Multipla_19_JTD_2006": 34.22, "Fiat_Panda_Sport_2020": 46.91, "Fiat_Punto_Evo_Scorpione_2011": 69.9, "Fiat_Scudo_20_Multijet_III_2022": 46.51, "Fiat_Strada_2007": 48.95, "Fiat_Strada_2009": 45.35, "Fiat_Strada_2020": 46.57, "Fiat_Tipo_Cross_Hybrid_2023": 37.86, "Fiat_Tipo_Saloon_2017": 45.63, "Fiat_Tipo_Station_Wagon_2018": 45, "Ford_Transit_SSV_2011": 32.45, "GMC_HUMMER_EV_SUV_3X_2024": 68.63, "Hudson_Hornet_1954": 34.1, "Hyundai_Veloster_Rally_Car_2011": 98.11, "KTM_XBow_GTXR_2023": 86.84, "Lancia_Aurelia_B24_Spider_1954": 36.3, "Lancia_D50_1954": 103.95, "Lancia_Dialogos_1998": 60.22, "Lancia_Fulvia_Safari_Edition_1975": 36.81, "Lancia_Thesis_24_JTD_20V_2003": 60.39, "Lancia_Ypsilon_2024": 17.79, "Mazda_767B_1989": 103.57, "Mazda_MX5_10th_Anniversary_NB_1999": 42.51, "Mazda_MX5_Le_Mans_24_NA_1991": 50.07, "McLaren_12C_Spider_2013": 100, "McLaren_540C_2015": 92.39, "McLaren_570GT_2016": 96.21, "McLaren_765LT_2022": 111.11, "McLaren_Elva_2020": 114.89, "McLaren_Speedtail_2020": 130.04, "Mercedes-Benz_560_SEC_1985": 67.71, "Mitsubishi_Pajero_Evolution_MPR13_2007": 62.77, "Peugeot_1007_RC_Concept_2004": 51.32, "Peugeot_106_GTi_1997": 55.48, "Peugeot_2008_Concept_2012": 46.94, "Peugeot_2008_GT_PureTech_155_2021": 50.38, "Peugeot_205_CTi_16_1986": 48.4, "Peugeot_205_Roland_Garros_1989": 37.48, "Peugeot_205_STDT_1994": 35.12, "Peugeot_205_T16_Paris_Dakar_1986": 94, "Peugeot_205_XS_1988": 37.48, "Peugeot_206_Escapade_2006": 41.97, "Peugeot_206_Grand_Tourisme_1999": 56.27, "Peugeot_206_SW_Concept_2001": 59.66, "Peugeot_207_GTi_2007": 50.78, "Peugeot_207_RCup_2006": 72.88, "Peugeot_207_Spider_Concept_2006": 73.02, "Peugeot_207_Sport_XS_2006": 57.14, "Peugeot_207_SW_Outdoor_2009": 50.74, "Peugeot_207_SW_RC_2007": 68.81, "Peugeot_208_GTi_by_Peugeot_Sport_2015": 64.58, "Peugeot_208_GT_Premium_2021": 48.29, "Peugeot_208_HYbrid_FE_Concept_2013": 74.51, "Peugeot_208_Rally_4_2020": 66.28, "Peugeot_3008_16_HDi_2010": 43.57, "Peugeot_3008_16_Hybrid4_300_2022": 58.59, "Peugeot_3008_16_Hybrid_225_2021": 55.56, "Peugeot_3008_GT_PureTech_180_2021": 50.33, "Peugeot_305_GTX_1985": 34.05, "Peugeot_305_Rallye_V6_Prototype_1981": 88.06, "Peugeot_306_Cabriolet_1999": 54.07, "Peugeot_306_Estate_20_HDi_2000": 36.59, "Peugeot_306_HDi_Concept_1999": 36.77, "Peugeot_306_S16_1995": 57.24, "Peugeot_306_XSi_1996": 55.37, "Peugeot_307_Cameleo_2001": 44.4, "Peugeot_307_GT_Feline_2004": 61.72, "Peugeot_307_WRC_2004": 96.21, "Peugeot_308_16_Hybrid_225_2022": 63.96, "Peugeot_308_GT_2008": 74.9, "Peugeot_308_Racing_Cup_2015": 76.05, "Peugeot_308_RCZ_Concept_2007": 56.9, "Peugeot_308_R_Concept_2013": 74.37, "Peugeot_308_SW_12_PureTech_130_2022": 50.05, "Peugeot_308_SW_16_Hybrid_225_2023": 61.54, "Peugeot_309_GTi_16_1991": 59.84, "Peugeot_4002_Concept_2003": 95.12, "Peugeot_4007_24_16V_2008": 46.08, "Peugeot_4008_18_HDi_150_2014": 57.98, "Peugeot_404_Diesel_Record_Car_1965": 28.94, "Peugeot_406_Coupe_Silhouette_2001": 80.39, "Peugeot_406_Toscana_1996": 50, "Peugeot_406_V6_Saloon_2003": 70.91, "Peugeot_407_20_HDi_2005": 48.03, "Peugeot_407_Elixir_2003": 62.24, "Peugeot_407_Macarena_2006": 49.42, "Peugeot_407_Prologue_2005": 56.63, "Peugeot_407_SW_30_V6_2006": 56.83, "Peugeot_408_12_PureTech_130_2022": 50.29, "Peugeot_408_12_THP_2014": 42.97, "Peugeot_408_16_Hybrid_225_2022": 61.16, "Peugeot_5008_16_Puretech_180_2022": 52.53, "Peugeot_5008_20_HDi_2010": 51.11, "Peugeot_504_Cabriolet_Phase_I_1972": 32.72, "Peugeot_504_Cabriole_tPhase_II_V6_1976": 46.16, "Peugeot_505_GTD_Turbo_1987": 48.66, "Peugeot_505_GTi_1985": 49.27, "Peugeot_505_TurboInjection_PTS_Kit_1985": 57.86, "Peugeot_505_Turbo_Injection_1989": 55.94, "Peugeot_505_V6_1988": 70.68, "Peugeot_508L_2019": 51.52, "Peugeot_508_16_THP_2013": 57.24, "Peugeot_508_Fastback_16_225_Hybrid_2023": 72.12, "Peugeot_508_Fastback_PureTech_130_2023": 47.72, "Peugeot_508_Peugeot_Sport_Engineered_2021": 62.42, "Peugeot_508_RXH_2012": 59.57, "Peugeot_508_Sport_Engineered_Concept_2019": 64, "Peugeot_508_SW_16_225_Hybrid_2023": 73.08, "Peugeot_508_SW_20_HDi_2012": 48.95, "Peugeot_508_SW_Peugeot_Sport_Engineered_2021": 62.03, "Peugeot_5_by_Peugeot_Concept_2010": 58.87, "Peugeot_604_GTi_1984": 50.05, "Peugeot_604_Presidential_Limousine_1982": 30.82, "Peugeot_604_Ti_1982": 43.34, "Peugeot_607_Paladine_Concept_2000": 71.17, "Peugeot_905_Spider_1991": 107.69, "Peugeot_Asphalte_1996": 67.57, "Peugeot_e2008_GT_2021": 0, "Peugeot_e308_2023": 48.27, "Peugeot_Exalt_2014": 62.96, "Peugeot_HX1_2011": 64.29, "Peugeot_Inception_2023": 91.8, "Peugeot_Instinct_2017": 64.56, "Peugeot_L500R_2017": 88.89, "Peugeot_Landtrek_2021": 44.78, "Peugeot_Proxima_1986": 109.54, "Peugeot_Quartz_2015": 68.85, "Peugeot_RCZ_16_THP_204_2011": 70.59, "Peugeot_RCZ_Hybrid4_Concept_2009": 75.98, "Peugeot_RC_HYmotion4_2008": 65, "Peugeot_Rifter_4x4_Concept_2018": 46.07, "Peugeot_SxC_2011": 59.79, "Peugeot_Urban_Crossover_2012": 56.32, "Peugeot_VERA_Plus_1982": 30.58, "Plymouth_Reliant_1981": 23.04, "Radical_SR10_XXR_2023": 72.73, "Renault_Clio_18_16v_1991": 55.15, "Renault_Clio_RS_197_2007": 53.37, "Renault_Clio_Williams_16V_1994": 59.68, "Renault_Clio_Williams_Maxi_Kit_Car_1995": 76.4, "Renault_DeZir_2010": 46.17, "Renault_Megane_RS_Trophy_2018": 76.06, "Rimac_E-Runner_Concept_One_2016": 110.53, "Skoda_1100_OHC_1957": 58.21, "Zenvo_Aurora_Tur_2023": 125 }
    //   this.cars_final.map(car => {
    //     if (newMras[car.rid]) {
    //       car.mra = newMras[car.rid];
    //     }
    //   })
    // }
    // console.log(this.cars_final);
    // debugger;

    let brakeData = {}
    // brakeData = { Nissan_Pao_1989: [ 0, ], Mitsubishi_Pajero_Mini_2001: [ 0, ], Land_Rover_Defender_110_2016: [ 0, ], Chevrolet_Bolt_EUV_2022: [ 4.930000000000003, ], Suzuki_Jimny_1000_1982: [ 0, ], Chevrolet_Corvette_Stingray_Z51_C8_2020: [ 4.02, ], Volkswagen_Beetle_1970: [ 0, ], Skoda_Popular_1101_1940: [ 0, ], Chevrolet_Trax_2007: [ 4.839999999999996, ], Citroen_Ami_2021: [ 0, 0, 0, ], Fiat_Panda_1980: [ 0, ], Renault_5_1984: [ 0, ], Citroen_Ami_Super_1973: [ 0, ], Buick_Park_Avenue_Essence_1989: [ 4.91, ], Chevrolet_Fleetline_1948: [ 0, ], Ram_ProMaster_1500_2022: [ 3.940000000000005, ], Buick_Reatta_1988b: [ 4.93, ], Dodge_TRex_6x6_1997: [ 4.950000000000001, ], GMC_Envoy_2002: [ 4.890000000000001, ], Chevrolet_Camaro_SSX_2010: [ 4, 4.029999999999999, ], Dodge_Intrepid_1989: [ 4.960000000000001, ], Subaru_Rex_1972: [ 0, ], Buick_Electra_1961: [ 5.699999999999999, ], Skoda_Favorit_13_E_GLX_1993: [ 4.859999999999999, ], Buick_Enclave_2018: [ 4.920000000000002, ], Skoda_110_R_Coupe_1970: [ 0, ], Buick_Centurion_1956: [ 5.73, ], Chrysler_Portal_2017: [ 0, ], Honda_Beat_1991: [ 0, 0, ], Chevrolet_Astro_II_XP880_1968: [ 4.050000000000001, 4.08, ], Dodge_Avenger_RT_AWD_2008: [ 4.93, ], Mitsubishi_Pajero_Junior_1995: [ 0, ], Fiat_850_Spider_1965: [ 0, ], GMC_Sierra_Hybrid_2006: [ 4.849999999999998, ], Hyundai_Veloster_Rally_Edition_2016: [ 4.07, ], Buick_Wildcat_III_1955: [ 5.650000000000002, ], Cadillac_Evoq_1999: [ 4.050000000000001, ], Citroen_Dyane_1967: [ 0, ], Buick_Lacrosse_36_AWD_2014: [ 4.949999999999999, ], Nissan_Figaro_1991: [ 0, ], "Chrysler_LeBaron_Town_&_Country_Station_Wagon_1978": [ 5.75, ], Buick_Riviera_GS_1968: [ 5.719999999999999, ], Chevrolet_Monte_Carlo_Z34_1995: [ 4.93, ], Nissan_Patrol_2000: [ 0, ], Buick_Encore_2020: [ 4.869999999999997, ], Subaru_Rex_1986: [ 0, ], Buick_GL8_II_2014: [ 4.919999999999998, ], Ram_Rampage_RT_2024: [ 4.93, ], Buick_Encore_2013: [ 4.879999999999999, ], Cadillac_Escalade_ESV_2021: [ 4.9399999999999995, ], Cadillac_El_Camino_1954: [ 5.730000000000004, ], Buick_Grand_National_1986: [ 4.899999999999999, ], GMC_Sierra_1500_SLT_2019: [ 4.900000000000002, ], Citroen_Mehari_4x4_1980: [ 0, ], Cadillac_CTS_2005: [ 4.9499999999999975, ], Subaru_360_1961: [ 0, 0, ], Buick_Regal_TType_1983: [ 5.710000000000001, ], Chevrolet_Corvette_Z06_C8_2022: [ 4.02, ], Chrysler_Thunderbolt_1993: [ 4.080000000000002, ], Volvo_C303_Paris_Dakar_1983: [ 0, ], Buick_GL8_2000: [ 4.919999999999998, ], "Suzuki_Mighty_Boy_(SS40)_1987": [ 0, 0, 0, ], Renault_4_1961: [ 0, ], Fiat_Seicento_Sporting_Abarth_2001: [ 0, ], Cadillac_DeVille_Touring_Sedan_1991: [ 4.919999999999998, ], Cadillac_CT4_2020: [ 4.02, ], Buick_Cascada_2016: [ 4.949999999999999, ], Buick_Enspire_2018: [ 4.010000000000002, ], Subaru_Sumo_1986: [ 0, ], Subaru_Pleo_Nesta_1999: [ 0, ], Cadillac_Brougham_1989: [ 5.75, ], Chevrolet_Corvette_Z06X_C6_2010: [ 4.02, 4.050000000000001, ], Cadillac_Eldorado_1953: [ 5.710000000000001, ], "Suzuki_Alto_Turbo_RS_4WD_(HA36)_2015": [ 0, 0, ], Fiat_128_1969: [ 0, ], Buick_LaCrosse_Concept_2000: [ 4.949999999999999, ], Buick_LaCrosse_2017: [ 4.85, 4.949999999999999, ], Chevrolet_Bel_Air_1958: [ 5.669999999999998, ], Suzuki_Jimny_1998: [ 0, 0, ], Citroen_Traction_Avant_1934: [ 0, ], Skoda_Citigoe_iV_2020: [ 0, ], GMC_Sierra_1500_Elevation_2020: [ 4.899999999999999, ], Dodge_Lancer_Turbo_1985: [ 4.900000000000002, ], Nissan_Patrol_1986: [ 0, 0, 0, ], Volkswagen_Polo_1976: [ 5.6399999999999935, ], GMC_Yukon_Denali_2000: [ 4.870000000000001, ], GMC_Suburban_1973: [ 5.690000000000005, ], Suzuki_Vitara_1995: [ 0, ], Chevrolet_Mako_Shark_II__1965: [ 5.779999999999999, 5.77, ], Buick_Wildcat_II_1954: [ 5.77, ], Chevrolet_Silverado_2500_HD_2021: [ 4.869999999999997, ], Suzuki_Fronte_360_1967: [ 0, ], "Nissan_Datsun_Sunny_(B10)_1966": [ 0, ], Cadillac_CT5_2021: [ 4.02, 4.1, ], Volkswagen_Transporter_1996: [ 0, ], Cadillac_Eldorado_Brougham_1959: [ 5.75, ], Renault_Twizy_F1_2013: [ 0, 0, 0, ], Chevrolet_Beast_2021: [ 3.869999999999999, ], Buick_Regal_TourX_2018: [ 4.85, ], Renault_Zoe_2016: [ 0, ], Holden_Drover_1985: [ 0, 0, 0, ], Chrysler_300C_Final_Edition_2023: [ 4.02, 4.05, 4.090000000000001, ], Smart_Fortwo_EV_2008: [ 0, 0, 0, ], Renault_6_1968: [ 0, ], Buick_Skylark_1968: [ 5.650000000000002, ], Cadillac_Fleetwood_Eldorado_1970: [ 5.73, ], Land_Rover_Defender_90_2011: [ 0, 0, ], Cadillac_Innerspace_2022: [ 4.059999999999999, 4.1, ], Mazda_Demio_EV_2012: [ 0, ], Chevrolet_Corvette_Stingray_C8_2020: [ 4.02, 4.050000000000001, ], Smart_Crossblade_2002: [ 0, ], Suzuki_Hustler_Hybrid_X_Turbo_2019: [ 0, ], Buick_Park_Avenue_2007: [ 4.949999999999999, ], Chevrolet_Caprice_Classic_2006: [ 4.949999999999999, ], Buick_Riviera_Concept_2007: [ 4.100000000000001, ], Chevrolet_K5_BlazerE_2020: [ 0, ], Chevrolet_Lumina_CSV_CR8_2008: [ 4.049999999999999, ], GMC_Sierra_HD_SLT_2020: [ 4.900000000000002, ], Buick_Avenir_2015: [ 4.010000000000002, ], Volkswagen_Passat_1975: [ 0, ], Chevrolet_Corvette_AstroVette_1969: [ 5.779999999999998, 5.789999999999999, ], Alfa_Romeo_159_Alfetta_1951: [ 5.65, 5.74, 5.72, ], "Suzuki_Cervo_(CG72)_1988": [ 0, ], Nissan_Pulsar_1986: [ 0, ], Buick_Skyhawk_Limited_Station_Wagon_1984: [ 5.699999999999996, ], Citroen_Oli_2022: [ 0, ], Buick_Silver_Arrow_1963: [ 5.73, ], Chevrolet_Impala_SS_2004: [ 4.949999999999999, ], Chevrolet_Lumina_APV_1989: [ 4.919999999999998, ], Honda_City_Cabriolet_1981: [ 0, ], Honda_Vamos_4WD_Turbo_2016: [ 0, ], Bufori_MKI_Offroad_Race_Car_1993: [ 4.720000000000001, ], Suzuki_Cara_1993: [ 0, 0, 0, ], Buick_Avista_2016: [ 4.029999999999999, ], Mercury_Comet_1961: [ 0, ], Buick_Verano_Pro_GS_2022: [ 4.92, ], Ford_Bronco_V8_1969: [ 0, 0, 0, ], Cadillac_CTSV_Coupe_Race_Car_2011: [ 3.9899999999999993, 3.999999999999999, ], Buick_Lucerne_Concept_1988: [ 4.93, ], Cadillac_EldoRODo_2000: [ 4.949999999999999, 4.950000000000001, ], Suzuki_Alto_Works_2016: [ 0, 0, ], Chevrolet_Corvair_Monza_1967: [ 5.669999999999998, ], Skoda_Element_2017: [ 0, ], Austin_Healey_Sprite_1958: [ 0, ], Chevrolet_Lacetti_WTCC_R_2005: [ 4.899999999999999, ], Cadillac_Imaj_2000: [ 4.049999999999999, 4.08, ], Buick_Centieme_2003: [ 4.85, ], Buick_Electra_1985: [ 5.739999999999998, ], Subaru_Vivio_Bistro_1995: [ 0, ], Cadillac_Escala_2016: [ 4.020000000000001, ], Buick_Riviera_1963: [ 5.720000000000002, ], Buick_XP300_1951: [ 5.749999999999998, ], Buick_Invicta_1959: [ 5.700000000000003, ], Cadillac_Coupe_DeVille_1949: [ 5.669999999999998, ], Cadillac_Escalade_IQ_2024: [ 4.98, 4.98, ], Cadillac_EscaladeV_2022: [ 4.08, ], Buick_Royaum_2005: [ 4.949999999999999, ], Mitsubishi_Triton_Ralliart_AXCR_2022: [ 4.02, ], Buick_Velite_7_2020: [ 0, ], Chevrolet_Blazer_ZR2_1999: [ 4.859999999999999, ], Peugeot_204_Coupe_1965: [ 0, ], Dodge_Neon_2017: [ 4.91, ], Volkswagen_Type_2_1970: [ 0, 0, ], Fiat_Campagnola_1951: [ 0, 0, ], Buick_Regal_GS_1997: [ 4.940000000000001, ], Chevrolet_Malibu_2008: [ 4.9399999999999995, ], Hummer_H3_Dakar_2006: [ 0, ], Cadillac_CT6V_2019: [ 4.039999999999999, ], Buick_Roadmaster_Sedan_1991: [ 4.949999999999999, ], Citroen_EElysee_2016: [ 0, ], Buick_Excelle_XT_Turbo_2010: [ 4.919999999999998, ], Lancia_Aprilia_Sport_Zagato_1938: [ 0, 0, ], Ford_Cortina_1974: [ 0, ], Chevrolet_Blazer_RS_2019: [ 4.8199999999999985, ], Buick_Roadmaster_Wagon_1994: [ 4.949999999999999, ], "Citroen_C-Zero_2016": [ 0, ], Buick_Sceptre_1992: [ 4.940000000000001, ], GMC_Sprint_SP_1974: [ 5.699999999999999, 5.699999999999999, ], Chevrolet_Corvette_Stingray_Convertible_C8_2022: [ 4.01, 4.050000000000001, ], Chrysler_Airflow_2022: [ 4.91, ], Chevrolet_Cavalier_Z24_2000: [ 4.899999999999999, ], Mazda_MX30_2022: [ 0, ], GMC_Rally_STX_350_1986: [ 0, ], Buick_VeranoGS_2016: [ 4.920000000000002, ], Buick_YJob_1939: [ 0, ], Buick_Regal_Grand_National_1987: [ 4.909999999999998, ], Skoda_1000_MB_1964: [ 0, ], Cadillac_CTSV_Sedan_Race_Car_2005: [ 4.000000000000001, ], AMC_Pacer_1975: [ 0, ], Volkswagen_Beetle_Cabriolet_1970: [ 0, ], Buick_Skylark_1965: [ 5.689999999999998, ], GMC_Sierra_2500_HD_Denali_2020: [ 4.919999999999998, ], GMC_Suburban_1962: [ 0, ], GMC_Canyon_SLT_2015: [ 4.849999999999998, ], Morgan_EV3_2016: [ 0, ], Chevrolet_Camaro_Sport_Coupe_1982: [ 4.899999999999999, ], Citroen_2CV_6_1979: [ 0, ], Buick_Riviera_1971: [ 5.73, ], Fiat_Campagnola_1974: [ 0, 0, ], Chevrolet_Lumina_SS_Coupe_2002: [ 4.08, 4.08, ], Cadillac_Eldorado_Biarritz_1959: [ 5.75, ], Chevrolet_CERV_II_1964: [ 3.99, 4, ], Renault_Clio_1990: [ 4.849999999999994, ], "Nissan_Datsun_Sunny_(B210)_1973": [ 5.560000000000002, ], Chevrolet_Malibu_Maxx_2005: [ 4.93, ], "Mazda_Autozam_AZ-1_1992": [ 0, 0, 0, ], Suzuki_Wagon_R_1993: [ 0, ], Chevrolet_Impala_Sport_Coupe_1971: [ 5.75, 5.73, ], Buick_Enclave_2020: [ 4.92, ], Buick_LaCrosse_Super_2008: [ 4.949999999999999, ], Ram_1500_Revolution_2023: [ 4.950000000000001, ], Volvo_P220_Amazon_Estate_1965: [ 0, ], Buick_Park_Avenue_Ultra_1992: [ 4.93, ], Citroen_Ami_Buggy_2022: [ 0, 0, 0, ], Buick_Riviera_Concept_2013: [ 4.099999999999998, ], Ram_2500_Rebel_2023: [ 4.91, ], Land_Rover_Discovery_1_1989: [ 0, ], Volkswagen_Karmann_Ghia_1974: [ 0, ], Porsche_356_1955: [ 0, ], MG_Midget_1961: [ 5.650000000000006, ], Chevrolet_CERV_I_1959: [ 3.959999999999999, 3.9899999999999993, 4.02, ], Chevrolet_El_Camino_1973: [ 5.68, ], Ram_ProMaster_City_Cargo_2022: [ 4.91, ], Chevrolet_Silverado_1999: [ 4.84, ], Subaru_Brat_1978: [ 0, 0, 0, ], Cadillac_CT4V_2020: [ 4.050000000000001, ], Buick_Questor_1983: [ 4.949999999999999, ], Chevrolet_SS_2003: [ 4.05, 4.1, ], Chevrolet_Impala_SS_2007: [ 4.929999999999998, ], Skoda_Octavia_1959: [ 0, ], Cadillac_Coupe_DeVille_1992: [ 4.920000000000002, ], Buick_Electra_1971: [ 5.729999999999997, 5.73, ], Dodge_1500_GT_90_1973: [ 5.619999999999997, ], GMC_Sierra_3500_2015: [ 4.880000000000003, ], GMC_Savana_2017: [ 4.82, ], Cadillac_DeVille_Concours_1998: [ 4.93, 4.93, ], Chevrolet_Monte_Carlo_1977: [ 5.73, 5.720000000000002, ], Cadillac_CTSV_Coupe_2011: [ 4.02, ], Buick_LeSabre_1962: [ 5.699999999999999, ], Buick_Skylark_GS_Coupe_1992: [ 4.940000000000001, ], Suzuki_SC100_1977: [ 0, ], Nissan_Micra_1991: [ 0, ], Dodge_Colt_Vista_AWD_1989: [ 0, 5.68, ], Dodge_Challenger_RT_2009: [ 4.049999999999999, ], Chrysler_Pacifica_Plugin_Hybrid_2023: [ 4.949999999999999, ], Ford_Super_Duty_F450_2020: [ 0, 0, ], Porsche_356_1948: [ 0, 0, ], Chevrolet_Silverado_3500_HD_2021: [ 4.899999999999995, ], Subaru_R1_2005: [ 0, ], Dodge_MAXXcab_2000: [ 4.900000000000002, ], Buick_Wildcat_1953: [ 5.700000000000003, ], Ford_Corcel_GT_13_1969: [ 0, ], Fiat_127_1971: [ 0, ], Buick_LeSabre_1959: [ 5.720000000000002, ], Suzuki_Kei_Works_2002: [ 0, 0, ], Volkswagen_Country_Buggy_1968: [ 0, ], Chevrolet_Corvette_Stingray_Concept_2009: [ 4, ], Volkswagen_Golf_1974: [ 0, ], Cadillac_Aera_2010: [ 3.9000000000000004, ], Buick_Verano_2013: [ 4.9399999999999995, ], Chevrolet_Chevelle_1972: [ 5.739999999999998, 5.73, ], Renault_Twingo_2007b: [ 0, 4.850000000000001, ], Citroen_EMehari_2018: [ 0, ], Citroen_Citela_1992: [ 0, ], GMC_Sierra_2500_HD_AT4_2020: [ 4.879999999999999, ], Chevrolet_XP897_GT_1973: [ 4.940000000000001, ], Cadillac_CT5V_2021: [ 4.02, ], Chevrolet_Blazer_2021: [ 4.899999999999999, ], Mitsubishi_Delica_D5_Rally_2007: [ 4.02, ], Chevrolet_Chevelle_Slammer_2016: [ 3.9800000000000004, 4.02, ], Citroen_2CV_Sahara_4x4_1958: [ 0, ], "Nissan_Sunny_(B12)_1985": [ 5.660000000000004, ], GMC_Yukon_2015: [ 4.92, ], Dodge_Charger_GT_AWD_2018: [ 4.1, ], Buick_Signia_1998: [ 4.899999999999999, ], GMC_Yukon_XL_Denali_2015: [ 4.940000000000001, 4.93, ], Alfa_Romeo_Matta_1952: [ 0, 0, ], "Nissan_Navara_(D22)_1997": [ 0, ], Chevrolet_Corvette_IMSA_GTO_C4_1988: [ 3.9899999999999993, 4.010000000000001, 4.05, ], Chevrolet_Nova_TwinCam_1988: [ 4.880000000000003, ], Buick_Lucerne_2006: [ 4.950000000000001, ], Chevrolet_Bel_Air_1961: [ 5.690000000000001, ], Buick_Wildcat_EV_2022: [ 4.050000000000001, ], GMC_Suburban_Carryall_1937: [ 0, ], Buick_Envision_2011: [ 4.93, ], Buick_Envision_2016: [ 4.919999999999998, ], Suzuki_Jimny_Sierra_2019: [ 0, ], Cadillac_Catera_2000: [ 4.949999999999999, ], Chevrolet_Corvette_Stingray_Coupe_C7_2015: [ 4.02, ], Buick_Velite_5_2017: [ 4.93, ], Chevrolet_Equinox_2019: [ 4.92, ], Chevrolet_Camaro__2006: [ 4.029999999999999, 4.09, ], Subaru_Rex_Combi_4WD_Turbo_1984: [ 0, 0, 0, ], "Mitsubishi_i-MiEV_2007": [ 0, ], Chevrolet_K1500_Blazer_1992: [ 5.690000000000001, ], GMC_Sierra_Denali_2500_HD_2015: [ 4.900000000000002, ], Buick_Centurion_1971: [ 5.73, ], GMC_Safari_1985: [ 5.680000000000003, ], Ford_Transit_Connect_XPress_2007: [ 4.029999999999999, ], Ford_Fiesta_1976: [ 0, ], Suzuki_Vitara_1998: [ 0, ], Chevrolet_Matiz_2005: [ 0, 0, 0, ], Fiat_Oltre_2005: [ 0, 0, 0, ], Nissan_Patrol_1987: [ 0, ], Buick_Rainier_2005: [ 4.899999999999999, ], Smart_Fortwo_2004: [ 0, 0, ], Ram_1500_Warlock_2023: [ 4.93, ], Chrysler_Thunderbolt_1941: [ 5.670000000000002, ], Austin_Maxi_1969: [ 0, ], Ford_Police_Interceptor_Concept_2002: [ 4.93, ], Buick_Regal_LS_2001: [ 4.93, ], Cadillac_Allante_1993: [ 4.949999999999999, ], Ford_Ranger_2006: [ 0, ], "Suzuki_Swift_(SF)_1988": [ 0, ], Lancia_Y10_1985: [ 0, ], Chevrolet_CERV_III_1990: [ 4.04, 4.0600000000000005, ], GMC_S15_Jimmy_1983: [ 0, ], GMC_HandiVan_1967: [ 0, ], Dodge_A100_Pickup_1964: [ 0, ], GMC_Terrain_Denali_2018: [ 4.93, ], Chevrolet_Corvette_Stingray_III__1992: [ 4.050000000000001, 4.08, ], Dodge_Challenger_1320_2009: [ 4.000000000000001, 4.05, ], Suzuki_Jimny_2007: [ 0, ], Renault_5_1972: [ 0, ], Mitsubishi_L200_1993: [ 0, ], "Chevrolet_Blazer_S-10_1983": [ 0, ], Chevrolet_Impala_2016: [ 4.9300000000000015, ], Chevrolet_Impala_2006: [ 4.93, ], Citroen_CBuggy_2006: [ 0, ], Buick_Riviera_1998: [ 4.9399999999999995, ], Buick_GS_400_1968: [ 5.690000000000001, 5.68, ], Buick_Invicta_2008: [ 4.949999999999999, ], Hyundai_Pony_1200_Pickup_1976: [ 0, ], Cadillac_Lyriq_AWD_2023: [ 4.040000000000001, ], Chevrolet_Chevelle_Malibu_SS_1965: [ 5.6800000000000015, 5.68, ], Chevrolet_Corvette_Corvair_1954: [ 5.649999999999999, ], BMW_Isetta_250_1955: [ 0, 0, ], Land_Rover_Series_1_1948: [ 0, 0, 0, ], Buick_Velite_6_EV_2022: [ 4.9300000000000015, ], Buick_Regal_1996: [ 4.93, ], Chevrolet_Colorado_LS_Crew_Cab_2003: [ 4.879999999999999, ], Buick_Regal_GS_2018: [ 4.849999999999998, ], "Nissan_S-Cargo_1989": [ 0, ], Fiat_131_Mirafiori_1974: [ 0, ], Chevrolet_Malibu_Maxx_SS_2006: [ 4.93, ], "Nissan_Patrol_(type_60)_1959": [ 0, 0, ], Buick_Century_Gran_Sport_455_Stage_1_1973: [ 5.710000000000001, ], Cadillac_Urban_Luxury_2010: [ 4.870000000000001, ], Chevrolet_Malibu_1998: [ 4.91, ], Suzuki_Jimny_Sierra_1995: [ 0, 0, ], Chevrolet_Camaro_LS_2009: [ 4.070000000000002, ], Cadillac_XTS_FWD_2013: [ 4.949999999999999, ], Chevrolet_Malibu_2014: [ 4.949999999999999, ], Cadillac_Escalade_Sport_2007: [ 4.92, 4.920000000000002, ], Cadillac_Ciel_2011: [ 4.08, ], Buick_LeSabre_1965: [ 5.66, ], Chevrolet_Volt_2016: [ 4.920000000000002, ], Dodge_Dart_GLH_Concept_2015: [ 4.09, ], Chevrolet_Impala_1977: [ 5.710000000000001, ], Volkswagen_Polo_1984: [ 5.6299999999999955, ], Chevrolet_Tahoe_2021: [ 4.949999999999999, ], Chrysler_Valiant_Wayfarer_1966: [ 5.649999999999999, ], Chevrolet_Nova_SS_350_Coupe_1969: [ 5.699999999999999, ], Buick_Cielo_1999: [ 0, ], Buick_Riviera_TType_1983: [ 5.75, ], Chevrolet_Avalanche_2008: [ 4.879999999999999, ], Fiat_Abarth_500_Abarth_1964: [ 0, ], Renault_Twizy_2016: [ 0, 0, 0, ], Chevrolet_SS_2014: [ 4.01, 4.050000000000001, ], Dodge_Kahuna_2003: [ 4.849999999999998, ], Vauxhall_PA_Velox_1959: [ 0, ], Lotus_Seven_1957: [ 0, 0, ], GMC_Sierra_1500_AT4_2019: [ 4.9, ], Chevrolet_Corvette_C8R_2020: [ 3.990000000000001, ], Buick_Terraza_2005: [ 4.920000000000002, ], Austin_Allegro_1979: [ 0, ], Buick_Somerset_TType_1986: [ 5.75, ], Buick_Blackhawk_2000: [ 4.07, 4.0600000000000005, ], Chevrolet_Chevelle_Malibu_SS_Hardtop_Coupe_1964: [ 5.629999999999999, ], Chevrolet_Tahoe_Z71_2020: [ 4.890000000000001, ], Honda_EV_Plus_1997: [ 0, ], Dodge_Ram_Van_Street_Van_1978: [ 5.68, ], Fiat_126p_1972: [ 0, ], "Nissan_Leaf_Nismo_(ZE1)_2017": [ 0, ], Buick_XP2000_1995: [ 4.910000000000002, ], Cadillac_XTS_Platinum_Concept_2010: [ 4.850000000000001, ], Chevrolet_Firenza_CanAm_1973: [ 4.799999999999999, 4.849999999999998, ], Chevrolet_Colorado_2014: [ 4.829999999999998, ], Chevrolet_Bolt_EV_2017: [ 4.93, ], Mazda_Carol_1962: [ 0, ], "Suzuki_Carry_(DA)_1989": [ 0, 0, ], Subaru_R2_2003: [ 0, ], Cadillac_XT6_2020: [ 4.9300000000000015, ], Buick_Bengal_2001: [ 4.949999999999999, ], Chevrolet_Corvair_Corsa_Turbo_1965: [ 5.629999999999999, ], Cadillac_SRX_2010: [ 4.9300000000000015, ], "Nissan_Patrol_(4W60)_1951": [ 0, ], Buick_Velite_2004: [ 4.050000000000001, ], Dodge_Hornet_GT_2022: [ 4.0600000000000005, ], Chevrolet_Silverado_1500_Duramax__2021: [ 4.879999999999999, ], Buick_GL8_III_2020: [ 4.919999999999998, ], Cadillac_CT4V_Blackwing_2021: [ 4.010000000000002, 4.049999999999999, ], Buick_Bolero_1990: [ 4.93, ], Cadillac_CTSV_Sedan_2009: [ 4.020000000000001, ], Chevrolet_Corvette_Stingray_Racer_1959: [ 4.02, 4, ], GMC_Sierra_3500_HD_Denali_Ultimate_2020: [ 4.890000000000001, ], Cadillac_Cyclone_1959: [ 5.710000000000001, ], Hummer_H1_HardTop_1996: [ 0, ], Chevrolet_Equinox_2005: [ 4.919999999999998, ], Chevrolet_Bel_Air__2002: [ 4.91, ], Ram_1500_Backcountry_X_2022: [ 4.899999999999999, ], Ram_3500_Limited_2023: [ 4.859999999999999, ], Chevrolet_Sonic_RS_2013: [ 4.900000000000002, ], Mazda_AZ_Offroad_1998: [ 0, ], Cadillac_XT4_2024: [ 4.940000000000001, ], Buick_Opel_Sports_Coupe_1978: [ 0, ], Peugeot_iOn_2018: [ 0, ], Buick_Velite_6_PHEV_2019: [ 4.92, ], Subaru_Rex_1981: [ 0, ], Chevrolet_Impala_LS_2000: [ 4.93, ], Dodge_A100_Custom_Sportsman_Wagon_1967: [ 5.5, ], Chevrolet_Nova_SS_327_Coupe_1966: [ 5.68, ], Chevrolet_Lumina_1995: [ 4.93, ], Drako_GTE_2020: [ 4.050000000000001, ], Chevrolet_Borrego_2001: [ 3.969999999999999, ], Renault_12_1969: [ 0, ], GMC_Terrain_Denali_2016: [ 4.93, ], Buick_Apollo_350_V8_1973: [ 5.699999999999999, ], Citroen_Cactus_M_2015: [ 0, ], Ram_1500_Rebel_OTG_2019: [ 4.940000000000001, ], Buick_Skyhawk_1975: [ 5.75, ], Chevrolet_Cruze_Touring_Car_2011: [ 3.9499999999999993, 3.9800000000000004, ], Citroen_AX_Electrique_1995: [ 0, ], Buick_Excelle_GT_18T_2018: [ 4.91, ], Suzuki_Jimny_2019: [ 0, ], Cadillac_Escalade_EXT_2002: [ 4.899999999999999, ], Fiat_Panda_4x4_1983: [ 0, ], Buick_Electra_2020: [ 4.029999999999999, 4.050000000000001, 4.1, ], Dodge_Durango_RT_Hemi_AWD_2011: [ 4.949999999999999, ], Chevrolet_Kingswood_1969: [ 5.719999999999999, ], Buick_Century_TType_1983: [ 5.729999999999997, ], Chevrolet_Nomad__2004: [ 4.949999999999999, ], Chevrolet_Corvette_Stingray_Convertible_C7_2016: [ 4.020000000000001, 4.05, ], Cadillac_Escalade_2023: [ 4.940000000000001, 4.93, ], Nissan_Micra_2004: [ 4.799999999999997, ], Chevrolet_Sprint_Turbo_1989: [ 4.780000000000001, ], Mazda_Laputa_S_Turbo_2001: [ 0, 0, ], Buick_Riviera_Gran_Sport_1965: [ 5.699999999999999, ], Cadillac_Seville_STS_1998: [ 4.949999999999999, ], Citroen_eBerlingo_Electric_2022: [ 0, ], Volvo_145_1971: [ 0, ], Buick_Estate_Wagon_1977: [ 5.699999999999999, ], GMC_Sierra_Classic_1999: [ 4.829999999999998, ], Chevrolet_Corvette_Impala_XP101_Concept_1956: [ 5.66, 5.66, ], GMC_Yukon_XL_2015: [ 4.940000000000001, 4.920000000000002, ], Peugeot_404_1962: [ 0, 0, 0, ], Dodge_Challenger_Drag_Race_Package_2008: [ 4, 4.049999999999999, ], Chevrolet_Seeker_RS_2022: [ 4.900000000000002, ], Buick_Envision_2021: [ 4.93, ], Volkswagen_Type_2_1979: [ 0, 0, 0, ], Austin_1100_1963: [ 0, ], Buick_GL8_Century_2022: [ 4.919999999999998, ], Cadillac_ATSV_Sedan_2017: [ 4.010000000000002, ], Mazda_MX30_REV_2023: [ 0, ], Chevrolet_Silverado_1500_ZR2_2022: [ 4.879999999999999, ], Buick_Skyhawk_TType_1983: [ 5.699999999999996, ], AMC_M422_Mighty_Mite_1959: [ 0, ], Skoda_422_1929: [ 0, ], Chevrolet_Corvette_Indy__1986: [ 4.01, ], Nissan_Prince_Skyline_Sports_Coupe_1963: [ 0, ], Mitsubishi_Pajero_Field_Guard_1993: [ 0, 0, 0, ], Chevrolet_Chevette_1976: [ 0, ], Fiat_500_1957: [ 0, 0, 0, ], Chevrolet_Lumina_1998: [ 4.93, ], Dodge_Caravan_RT_2015: [ 4.949999999999999, ], Peugeot_203_1948: [ 0, 0, 0, ], Volkswagen_Type_2_1966: [ 0, 0, 0, ], Chevrolet_Corvette_C7R_2014: [ 3.9700000000000006, ], Buick_Encore_GX_2020: [ 4.899999999999999, ], Chevrolet_Monte_Carlo_SS_2001: [ 4.93, ], Volvo_Amazon_1958: [ 0, ], Chevrolet_Captiva_2019: [ 4.91, ], Hummer_H1_1992: [ 0, ], Buick_Park_Avenue_Ultra_1999: [ 4.950000000000003, ], Chevrolet_Volt_Concept_2007: [ 4.950000000000001, ], Volvo_C30_DRIVe_Electric_2011: [ 0, ], Citroen_M35_1969: [ 0, ], Lincoln_Mark_VI_1982: [ 0, ], }

    
    this.cars_final.sort((a, b) => {
      if (a.rq === b.rq) {
        return a.name.localeCompare(b.name);
      } else {
        return b.rq - a.rq;
      }
    })




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
      "tdid",
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
    


    console.log(carsFinalOrdered);
    debugger;
    // navigator.clipboard.writeText(JSON.stringify(this.cars_final));
  },
  computed: {},
  methods: {},
}
</script>

<style>
</style>