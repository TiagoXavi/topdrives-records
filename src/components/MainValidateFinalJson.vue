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
    //   let newMras = { "Acura_TSX_Sport_Wagon_2011": 51.92, "Alfa_Romeo_2000_Sportiva_1954": 55.99, "Alfa_Romeo_Coloni_S1_156_2001": 56, "Alfa_Romeo_Navajo_1976": 68.75, "Aston_Martin_Vanquish_S_2016": 78.57, "Aston_Martin_Vanquish_Zagato_2017": 78.57, "Aston_Martin_Virage_1989": 90.55, "Audi_S7_C8_2019": 83.33, "BMW_740d_2016": 76.47, "Cadillac_Escalade_2002": 42.9, "Chevrolet_Corvette_GSII_1963": 105.57, "Citroen_CAirplay_2005": 32, "Citroen_Xantia_4x4_Turbo_1999": 76.92, "Drako_Dragon_2023": 96.93, "Ford_Bronco_Raptor_2022": 42.11, "Ford_Galaxy_2015": 54.87, "Ford_Sierra_RS500_1987": 76.25, "Infiniti_QX30_2017": 57.94, "Lamborghini_350_GTS_1965": 69.47, "Lamborghini_350_GTV_1063": 73.26, "Lamborghini_Asterion_2014": 89.7, "Lamborghini_Athon_1980": 67.05, "Lamborghini_Aventador_Coupe_2011": 80, "Lamborghini_Aventador_LP_7004_Miura_Homage_2017": 78, "Lamborghini_Aventador_SVJ_Roadster_2019": 90.32, "Lamborghini_Aventador_SV_2015": 88.52, "Lamborghini_Cheetah_1977": 39.45, "Lamborghini_Concept_S_Prototype_2006": 90.91, "Lamborghini_Countach_LP_500_1971": 75.4, "Lamborghini_Diablo_GT2_1998": 85, "Lamborghini_Diablo_VT_Roadster_1997": 80, "Lamborghini_Estoque_2008": 79.55, "Lamborghini_Gallardo_(1st_gen)_2003": 86.96, "Lamborghini_Gallardo_LP550-2_(2nd_gen)_2010": 86.05, "Lamborghini_Gallardo_LP560-4_(2nd_gen)_2008": 83.33, "Lamborghini_Gallardo_LP570-4_Spyder_Performante_(2nd_gen)_2010": 86.45, "Lamborghini_Gallardo_LP_550-2_Valentino_Balboni_2009": 88.09, "Lamborghini_Gallardo_LP_5502_Tricolore_2012": 86.05, "Lamborghini_Gallardo_LP_570-4_Edizione_Tecnica_2012": 94.59, "Lamborghini_Gallardo_LP_5704_Squadra_Corse_2013": 90.9, "Lamborghini_Gallardo_SE_2005": 88.89, "Lamborghini_Gallardo_Spyder_(1st_gen)_2006": 82, "Lamborghini_Gallardo_Superleggera_(1st_gen)_2007": 85.71, "Lamborghini_Huracan_EVO_2019": 88.61, "Lamborghini_Huracan_EVO_RWD_2020": 99.07, "Lamborghini_Huracan_EVO_RWD_Spyder_2020": 102.72, "Lamborghini_Huracan_EVO_Spyder_2019": 92.31, "Lamborghini_Huracan_Performante_2018": 89.45, "Lamborghini_Huracan_RWD_2015": 94.02, "Lamborghini_Huracan_RWD_Spyder_2018": 96.95, "Lamborghini_Huracan_Tecnica_2022": 98.1, "Lamborghini_Lamborghini_Diablo_Roadster_Prototype_1995": 83.33, "Lamborghini_Lanzador_2023": 90.32, "Lamborghini_Miura_Concept_2006": 73.42, "Lamborghini_Murcielago_LP650-4_Roadster_2009": 74.42, "Lamborghini_Murcielago_LP670-4_SuperVeloce_2009": 74.07, "Lamborghini_Reventon_2007": 78.05, "Lamborghini_Reventon_Roadster_2010": 76.19, "Lamborghini_Terzo_Millennio_2017": 100, "Lamborghini_Urus_S_2022": 73.99, "Mazda_Atenza_2006": 58.33, "Mercedes-Benz_300_CE24_1988": 55.88, "Mercedes-Benz_A_180d_2012": 62.25, "Mercury_Marauder_2003": 63.29, "Nissan_Silvia_K's_(S14a)_1996": 56.4, "Peugeot_308_R_Concept_2013": 74.67, "Peugeot_Fractal_2015": 61.92, "Pontiac_Bonneville_SSEi_2000": 69.57, "Porsche_911_Speedster_4.0_(991.2)_2019": 88.37, "Ram_Dodge_Ramcharger_1974": 26.2, "Suzuki_SX4_S-Cross_2016": 47.88, "Volkswagen_Golf_1997": 59.84, "Volkswagen_Jetta_2004": 52.81, "Volkswagen_Passat_1983": 58.18, "Volkswagen_Scirocco_1982": 54.28, "Volkswagen_Touran_2003": 65.37, "Volvo_EX30_Twin_Motor_Performance_2023": 52.47 }
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
      let rids = ["Saturn_Sky_2007", "Mazda_Autozam_AZ-1_1992", "Nissan_Leaf_Nismo_(ZE1)_2017", "Ford_Fiesta_RS1800_1992", "Suzuki_Mighty_Boy_(SS40)_1987", "Ford_Capri_3.0_S_1978", "Buick_Verano_2012", "Holden_Monaro_GTS_350_HT_1969", "Honda_S-MX_4WD_1996", "Renault_Sport_Megane_2.0_dCi_175_2008", "Dodge_Coronet_Super_Bee_1968", "Mazda_Atenza_Mazdaspeed_2008", "Mercury_Marauder_2003", "Mitsubishi_Galant_AMG_1989", "Mitsubishi_L200_2006", "Subaru_Rex_Combi_4WD_Turbo_1984", "Cadillac_Escalade_1999", "Chevrolet_Impala_SS_427_1967", "Dodge_Challenger_TA_1970", "Ford_Mustang_Boss_302_1970", "Ford_Transit_SSV_2011", "Mazda_Lantis_Type_R_1993", "Mercury_Marauder_Convertible_Concept_2002", "Mitsubishi_Galant_2000_Turbo_ECI_1984", "Mitsubishi_Pajero_Field_Guard_1993", "Peugeot_106_Rallye_(S2)_1997", "Suzuki_Cara_1993", "Volkswagen_up_GTI_2018", "Chevrolet_Tahoe_1995", "Citroen_Tubil_2011", "Peugeot_Hoggar_2010", "Volvo_360_GLT_1983", "Buick_Skylark_1968", "Peugeot_BB1_2009", "Peugeot_iOn_2018", "Fiat_S76_1910", "Peugeot_208_2018", "Plymouth_Barracuda_Formula_S_1966", "Renault_Twizy_2016", "Subaru_R1_2005", "Subaru_R2_2003", "Volvo_343_RSport_1981", "Alfa_Romeo_Spider_Quadrifoglio_Verde_1986", "Buick_Century_Special_Coupe_1973", "Fiat_Qubo_2009", "Nissan_Datsun_240Z_1969", "Alfa_Romeo_Alfasud_TI_Quadrifoglio_Verde_1982", "Alfa_Romeo_Alfasud_Sprint_1976"];
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