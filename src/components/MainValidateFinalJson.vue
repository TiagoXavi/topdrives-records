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
    //   let newMras = { "AC_AcecaBristol_1957": 44.97, "Alfa_Romeo_147_Q2_2007": 48.93, "Audi_R8_LMX_2014": 0, "Audi_RS_6_Avant_(delimited)_2013": 84, "Audi_S1_EKS_RX_quattro_8X_2018": 53.5, "Audi_S5_B85_2013": 69.12, "BMW_760Li_xDrive_Shining_Shadow_Special_Edition_2021": 81.14, "BMW_X6_M50i_Black_Vermilion_2021": 69.49, "Brabham_BT62_R_2020": 109.89, "Brabham_BT63_GT2_2021": 110, "Bufori_BMS_R1_2009": 78, "Bufori_CS_Prototype_2015": 62.16, "Bufori_CS_Prototype_Pace_Car_2023": 60.53, "Bufori_Geneva_2010": 62.65, "Bufori_Geneva_64_2013": 69.86, "Bufori_MKIII_La_Joya_2003": 54.24, "Bufori_MKII_Series_1_1992": 36.39, "Bufori_MKII_Series_2_1994": 39.39, "Bufori_V6i_1992": 39.47, "Bufori_V6i_Cannonball_Race_Car_1994": 46.97, "Caterham_CSR_2005": 48.82, "Chevrolet_Camaro_berlinetta_1985": 58.82, "Chevrolet_Corvette_Grand_Sport_2017": 77.55, "Chrysler_300_Hurst_1970": 67.94, "Chrysler_300_SRT-8_2005": 74.24, "Chrysler_Turbine_Car_1963": 63.01, "Citroen_C5_HPi_2001": 50.88, "Citroen_Xsara_Picasso_1997": 54.22, "De_Tomaso_P72_2020": 94.74, "De_Tomaso_Pantera_GT5-S_1989": 71.43, "Dodge_Aries_1986": 36.86, "Dodge_Charger_SRT_Hellcat_2015": 92, "Dodge_Durango_SRT_Hellcat_2021": 74, "Dodge_Ram_1500_TRX_2021": 67.52, "Donkervoort_D8_GTO_2014": 69.23, "Fiat_8V_Supersonic_1953": 64.01, "Fiat_Dino_Spider_1966": 73.06, "Fiat_S76_1910": 57.12, "Ford_Escort_RS1600_1968": 38.85, "Ford_Falcon_FPV_GTF_351_2014": 88.06, "Ford_FG_Falcon_V8_Supercar_2008": 121.43, "Ford_Indigo_1996": 95.12, "Ford_SVT_F150_Lightning_1999": 65.32, "Ginetta_G58_2018": 100, "Giocattolo_Group_B_1986": 140.54, "Holden_Astra_GTC_Sport_PJ_2015": 55.81, "Holden_Calais_SS_VSeries_VE_2008": 66.67, "Holden_Commodore_LT_ZB_2018": 57.14, "Holden_Commodore_RS_ZB_2018": 57.83, "Holden_Commodore_SS_Group_A_VL_1986": 62.75, "Holden_Commodore_SV6_VF_2013": 63.37, "Holden_HSV_Senator_215i_VS_1995": 45.52, "Holden_HSV_Senator_SV08_VE_2009": 66.67, "Holden_Monaro_LS_HJ_1974": 59.28, "Holden_Piazza_Turbo_1986": 53.5, "Hyundai_Accent_WRC_2002": 93.3, "Hyundai_Aslan_33_2014": 65.52, "Hyundai_Clix_2001": 71.6, "Hyundai_Dynasty_35_1996": 60, "Hyundai_Elantra_16_GDI_Hybrid_2021": 45.6, "Hyundai_Elantra_20_MPI_2021": 60, "Hyundai_Elantra_N_2022": 68.83, "Hyundai_Elantra_Sport_2018": 62.26, "Hyundai_Enduro_CUV_2015": 66.67, "Hyundai_Genesis_38_Sedan_2009": 59.84, "Hyundai_Genesis_50_2015": 68.49, "Hyundai_Genesis_Coupe_20T_2009": 63.64, "Hyundai_Genesis_Coupe_38_2010": 62.5, "Hyundai_Genesis_Coupe_38_2015": 64.2, "Hyundai_Genesis_PM580T_2013": 107, "Hyundai_Getz_16_Sport_2002": 34.37, "Hyundai_Grandeur_2021": 44.49, "Hyundai_Grandeur_30_2016": 68.81, "Hyundai_Grandeur_33_2011": 63.19, "Hyundai_Grandeur_38_2005": 64.69, "Hyundai_HCD9_Talus_2006": 60, "Hyundai_i10_10_TGDI_N_Line_2020": 50.17, "Hyundai_i20_N_2021": 59.6, "Hyundai_i20_R5_2019": 106.33, "Hyundai_i20_WRC_2014": 101, "Hyundai_i20_WRC_2020": 107.44, "Hyundai_i30_15_TGDI_2020": 58.99, "Hyundai_i30_Fastback_15_TGDI_2020": 62.6, "Hyundai_i30_Fastback_N_2019": 73.49, "Hyundai_i30_Fastback_N_Performance_2021": 68.92, "Hyundai_i30_N_2018": 74.39, "Hyundai_i30_N_Fastback_Time_Attack_2019": 67.57, "Hyundai_i30_N_Performance_2021": 69.86, "Hyundai_i30_N_Project_C_2020": 68.67, "Hyundai_i30_Tourer_10_TGDI_2020": 51.72, "Hyundai_i800_25_CRDi_2019": 43.87, "Hyundai_Ioniq_5_58_kWh_2021": 39.06, "Hyundai_Ioniq_5_77_kWh_2021": 70, "Hyundai_Ioniq_5_77_kWh_4WD_2021": 60.38, "Hyundai_Ioniq_5_N_2023": 76.01, "Hyundai_Ioniq_6_77_kWh_2022": 75, "Hyundai_Ioniq_6_77_kWh_4WD_2022": 57.11, "Hyundai_Ioniq_Electric_2019": 43.86, "Hyundai_Ioniq_Hybrid_2018": 46.44, "Hyundai_Kona_10_TGDI_2021": 36.83, "Hyundai_Kona_16_Turbo_2019": 55.6, "Hyundai_Kona_16_Turbo_2021": 55.3, "Hyundai_Kona_Electric_2019": 54.26, "Hyundai_Kona_N_2021": 80.3, "Hyundai_Le_Fil_Rouge_2018": 73.24, "Hyundai_Moab_Extreme_OffRoader_Santa_Fe_Sport_2017": 52.34, "Hyundai_Nexo_2019": 39.05, "Hyundai_N_Vision_74_2022": 97.06, "Hyundai_Palisade_22_CRDi_2020": 49.23, "Hyundai_PassoCorto_2014": 75.93, "Hyundai_Pony_Concept_2021": 44.56, "Hyundai_Pony_Coupe_1974": 43.79, "Hyundai_Prophecy_2020": 46.51, "Hyundai_RN22e_2022": 100, "Hyundai_RN30_2016": 68.96, "Hyundai_Santa_Cruz_2015": 60.87, "Hyundai_Santa_Cruz_25_Turbo_TGDI_2021": 58.88, "Hyundai_Santa_Fe_16_TGDI_Hybrid_2021": 66.91, "Hyundai_Santa_Fe_16_TGDI_PHEV_2021": 64.62, "Hyundai_Santa_Fe_25_TGDI_2021": 68.13, "Hyundai_Santa_Fe_AWD_V6_2003": 38.38, "Hyundai_Santa_Fe_Sport_20T_2016": 64.08, "Hyundai_Scoupe_15i_Turbo_1993": 45.45, "Hyundai_Sonata_20T_2013": 72.62, "Hyundai_Sonata_PHEV_2016": 58.33, "Hyundai_Sonata_V6_1990": 37.11, "Hyundai_Sonata_V6_2005": 59.93, "Hyundai_Stargazer_15_MPI_2022": 53.04, "Hyundai_Staria_22_CRDi_2021": 58.36, "Hyundai_Terracan_2003": 43.97, "Hyundai_Tiburon_GT_V6_2005": 51.08, "Hyundai_Tucson_16_TGDI_2017": 48.92, "Hyundai_Tucson_16_TGDI_Hybrid_2021": 58.91, "Hyundai_Tucson_16_TGDI_PHEV_2021": 63.57, "Hyundai_Tucson_20_CRDi_2017": 40.82, "Hyundai_Tucson_24_GDI_AWD_2020": 94.02, "Hyundai_Tucson_27_V6_2004": 45.54, "Hyundai_Tucson_N_Line_16T_MHEV_2021": 63.19, "Hyundai_Veloster_16_GDi_2012": 43.97, "Hyundai_Veloster_C3_Roll_Top_2012": 62.27, "Hyundai_Veloster_N_2019": 66.41, "Hyundai_Veloster_N_ETCR_2020": 79.49, "Hyundai_Veloster_N_TCR_2019": 93.88, "Hyundai_Veloster_Turbo_2013": 60.33, "Hyundai_Vision_G_Coupe_2015": 70.62, "INFINITI_Emerg-E_2012": 83.33, "Koenigsegg_Jesko_Attack_2021": 122, "Koenigsegg_Regera_2015": 126.76, "Lancia_Aurelia_1956": 47.66, "Lancia_Flaminia_Sport_Zagato_1958": 50.05, "Land_Rover_Range_Rover_Sport_SVR_2018": 71.67, "Maserati_Ghibli_Diesel_2018": 63.73, "Mazda_254i_1982": 95.12, "Mazda_2_15_Sport_2009": 43.14, "Mazda_2_Rally_2005": 74.31, "Mazda_323_GTR_1992": 59.26, "Mazda_323_GT_Turbo_4WD_1985": 55.4, "Mazda_323_MPS_2000": 57.22, "Mazda_3_22d_2009": 51.97, "Mazda_3_25_Turbo_AWD_2023": 59, "Mazda_3_eSkyactivX_hatchback_2021": 64.29, "Mazda_3_eSkyactivX_Saloon_2020": 56.2, "Mazda_3_MPS_2007": 64.44, "Mazda_3_MPS_2013": 65.17, "Mazda_3_Sport_2010": 60, "Mazda_3_TCR_2020": 83.33, "Mazda_626_20_2000": 53.82, "Mazda_626_MPS_2000": 57.47, "Mazda_6_20_2008": 62.66, "Mazda_6_23_2002": 58.82, "Mazda_6_37_V6_2010": 57.8, "Mazda_6_Estate_22d_2008": 56.41, "Mazda_6_Estate_25_2014": 57.32, "Mazda_6_Grand_Touring_25_Turbo_2021": 67.02, "Mazda_6_MPS_Concept_2002": 61.18, "Mazda_6_SkyActivD_race_car_2013": 97.37, "Mazda_717C_1983": 97.5, "Mazda_757_1986": 100, "Mazda_929_30_V6_1996": 52.85, "Mazda_Atenza_2006": 58.33, "Mazda_Atenza_Mazdaspeed_2008": 52.47, "Mazda_Atenza_Sport_Wagon_2003": 59.33, "Mazda_Axela_MS_2008": 59.73, "Mazda_Axela_Sport_23_2008": 50.98, "Mazda_Cosmo_21_2002": 59.05, "Mazda_Cosmo_Rotary_Turbo_Saloon_1984": 47.83, "Mazda_Cosmo_Turbo_HB_1986": 47.83, "Mazda_CX-5_2018": 68.23, "Mazda_CX30_25_Turbo_AWD_2021": 65.59, "Mazda_CX3_Racing_2015": 57.45, "Mazda_CX4_25_AWD_2019": 50.97, "Mazda_CX50_25_Turbo_AWD_2022": 56.65, "Mazda_CX5_22_AWD_2012": 49.17, "Mazda_CX5_25_AWD_2014": 42.95, "Mazda_CX5_Urban_2012": 50.38, "Mazda_CX60_25_PHEV_AWD_2023": 58.33, "Mazda_CX60_33_D_MHEV_AWD_2022": 61.01, "Mazda_CX7_Adrenaline_2006": 64.66, "Mazda_CX8_25_Turbo_AWD_2022": 68.25, "Mazda_CX90_33_Turbo_S_AWD_2024": 69.47, "Mazda_Demio_15_2003": 41.37, "Mazda_Demio_ASpec_2003": 43.99, "Mazda_Demio_Mazdaspeed_2008": 45.77, "Mazda_Demio_Racing_2015": 46.05, "Mazda_Demio_Sport_2002": 43.99, "Mazda_Demio_Turbo2_2011": 50.61, "Mazda_Familia_2001": 52.41, "Mazda_Familia_GTX_1992": 54.85, "Mazda_Familia_Sport20_Special_4WD_2003": 58.33, "Mazda_Familia_Sport_4_1989": 62.57, "Mazda_Familia_Turbo_Cabriolet_1986": 27.72, "Mazda_Ibuki_2003": 56.19, "Mazda_Kabura_2006": 71.32, "Mazda_Kai_2017": 66.09, "Mazda_Koeru_2015": 70.71, "Mazda_Lantis_Super_Touring_1994": 94.44, "Mazda_Lantis_Type_R_1993": 58.65, "Mazda_Luce_V6_3000_Royal_Classic_1988": 53.18, "Mazda_Miata_M_Coupe_1996": 52.38, "Mazda_Miata_M_Speedster_1995": 61.82, "Mazda_Minagi_2011": 50.93, "Mazda_MonoPosto_2000": 57.41, "Mazda_MPV_Mazdaspeed_Package_2006": 58.45, "Mazda_MX3_V6_1992": 42.93, "Mazda_MX5_15_2022": 53.45, "Mazda_MX5_20_2022": 57.94, "Mazda_MX5_Cup_2015": 66.4, "Mazda_MX5_GT_Race_Car_2011": 57.91, "Mazda_MX5_Miata_2004": 57.76, "Mazda_MX5_MPS_2001": 63.21, "Mazda_MX5_RF_15_2022": 56.85, "Mazda_MX5_RF_20_2022": 63.46, "Mazda_MX5_Speedster_Evolution_2016": 57.28, "Mazda_MX6_25_V6_1992": 60.36, "Mazda_MX6_A_Spec_1992": 64.29, "Mazda_MXCrossport_2005": 64.04, "Mazda_Protege_2003": 55.2, "Mazda_Roadster_2001": 59.68, "Mazda_Roadster_NRA_2001": 48.95, "Mazda_Roadster_NRA_2006": 59.13, "Mazda_RX01_1995": 58.76, "Mazda_RX3_GSII_1973": 37.31, "Mazda_RX500_1970": 57.57, "Mazda_RX7_Evo_Group_B_1984": 84.54, "Mazda_RX7_R_Bathurst_R_FD_2001": 49, "Mazda_RX7_Turbo_II_FC_1990": 55.66, "Mazda_RX8_Hydrogen_RE_2004": 52.24, "Mazda_RX8_NRA_2004": 59.87, "Mazda_RXVision_2015": 97.77, "Mazda_SASSOU_2005": 26.67, "Mazda_Secret_Hideout_2001": 52.65, "Mazda_Shinari_2010": 57.14, "Mazda_Taiki_2007": 58.95, "Mazda_Xedos_6_Touring_Car_1993": 86.44, "Mercedes-Benz_AMG_GT_2016": 95.12, "Mercedes-Benz_AMG_SLK_Black_Series_2007": 80.36, "Mitsubishi_3000GT_VR4_1993": 65.52, "Mitsubishi_3000GT_VR4_1999": 55.81, "Mitsubishi_Colt_18_GTi_1994": 51.48, "Mitsubishi_Colt_Galant_GTO_MR_1970": 61.38, "Mitsubishi_Colt_GTi16V_1988": 47.33, "Mitsubishi_Colt_SR_4X_Ralliart_2002": 58.67, "Mitsubishi_Debonair_V3000_Royal_AMG_1986": 79.29, "Mitsubishi_Diamante_30RSE_4WD_1993": 53.96, "Mitsubishi_Eclipse_Coupe_GTS_2003": 64.13, "Mitsubishi_Eclipse_Cross_2019": 50.35, "Mitsubishi_Eclipse_GSR4_1991": 56.03, "Mitsubishi_Eclipse_GS_Turbo_1989": 55.56, "Mitsubishi_Eclipse_GT_2006": 72.62, "Mitsubishi_Eclipse_GT_Spyder_2007": 79.76, "Mitsubishi_Eclipse_Ralliart_2006": 69.49, "Mitsubishi_Eclipse_Spyder_GST_1996": 53.72, "Mitsubishi_Eclipse_Spyder_GTS_2003": 60.23, "Mitsubishi_eEvolution_2017": 51.82, "Mitsubishi_Endeavor_Ralliart_2004": 45.98, "Mitsubishi_eYi_2019": 43.88, "Mitsubishi_FTO_GP_Version_R_1997": 64.39, "Mitsubishi_Galant_2000_Turbo_ECI_1984": 52.42, "Mitsubishi_Galant_38_V6_2004": 57.61, "Mitsubishi_Galant_AMG_1989": 56.2, "Mitsubishi_Galant_GTi16V_1989": 51.27, "Mitsubishi_Galant_Ralliart_2007": 51.35, "Mitsubishi_Galant_VR4_1989": 53.56, "Mitsubishi_Galant_VR4_1993": 69.89, "Mitsubishi_Galant_VR4_Type_S_2000": 60.25, "Mitsubishi_GTO_1992": 65.48, "Mitsubishi_GTPHEV_2016": 49.8, "Mitsubishi_HSRII_1989": 72.7, "Mitsubishi_HSRIV_1993": 61.01, "Mitsubishi_HSRVI_1997": 50.76, "Mitsubishi_iMiEV_Evolution_2012": 47.5, "Mitsubishi_L200_2006": 83.85, "Mitsubishi_L200_2020": 44.73, "Mitsubishi_Lancer_1600_GSR_Rally_Car_1973": 66.02, "Mitsubishi_Lancer_2000_Turbo_1982": 53.52, "Mitsubishi_Lancer_Evolution_IV_RS_1996": 65.75, "Mitsubishi_Lancer_Evolution_IX_GSR_2005": 63.01, "Mitsubishi_Lancer_Evolution_IX_Wagon_MR_2005": 64.47, "Mitsubishi_Lancer_Evolution_VIII_RS_2005": 64.86, "Mitsubishi_Lancer_Evolution_VII_FQ300_2001": 67.61, "Mitsubishi_Lancer_Evolution_VII_GTA_2002": 61.46, "Mitsubishi_Lancer_Evolution_VII_WRC_2001": 94.43, "Mitsubishi_Lancer_Evolution_VI_RS_1999": 65.85, "Mitsubishi_Lancer_Evolution_X_Final_Edition_2015": 58.67, "Mitsubishi_Lancer_Evolution_X_FQ400_2011": 61.22, "Mitsubishi_Lancer_Evolution_X_GSR_FQ300_2015": 59.2, "Mitsubishi_Lancer_Evo_VIII_260_2004": 52.69, "Mitsubishi_Lancer_GSR_Evolution_II_1994": 68.35, "Mitsubishi_Lancer_GSR_Evolution_V_1997": 61.84, "Mitsubishi_Lancer_Ralliart_Wagon_2003": 50.38, "Mitsubishi_Lancer_RS2_Evolution_VI_1999": 63.51, "Mitsubishi_Lancer_Sportback_Ralliart_2010": 56.3, "Mitsubishi_Lancer_WRC04_2004": 95.12, "Mitsubishi_Legnum_VR4_1996": 64.04, "Mitsubishi_Magna_Ralliart_TJ_2002": 70.64, "Mitsubishi_Magna_VRX_TL_2003": 62.73, "Mitsubishi_Mirage_1400_GT_Turbo_1983": 47.81, "Mitsubishi_Mirage_Asti_RS_1995": 59.65, "Mitsubishi_Mirage_Kammtop_1985": 56, "Mitsubishi_Outlander_20_Turbo_Diesel_2006": 44.78, "Mitsubishi_Outlander_PHEV_2021": 22.2, "Mitsubishi_Outlander_PHEV_Baja_2015": 63.64, "Mitsubishi_Pajero_2002": 39.95, "Mitsubishi_Pajero_2007": 43.52, "Mitsubishi_Pajero_3500_V6_1998": 39.86, "Mitsubishi_Pajero_Evolution_1997": 68.22, "Mitsubishi_Pajero_Evolution_22_2001": 61.86, "Mitsubishi_Pajero_Evolution_T2_1997": 73, "Mitsubishi_Pajero_Pinin_2003": 36.74, "Mitsubishi_Pajero_Sport_1999": 34.72, "Mitsubishi_Pajero_Sport_2015": 39.6, "Mitsubishi_Proudia_370_4WD_2012": 63.74, "Mitsubishi_Raider_Baja_2006": 70.48, "Mitsubishi_SST_1998": 75.59, "Mitsubishi_Starion_GSRIII_1984": 51.72, "Mitsubishi_Starion_GSRI_1982": 42.02, "Mitsubishi_Starion_GSRV_1985": 55.37, "Mitsubishi_Starion_Turbo_1982": 57.81, "Mitsubishi_Street_Raider_2005": 42.25, "Mitsubishi_Tarmac_Spyder_2003": 79.32, "Mitsubishi_TMR_380_2008": 59.5, "Mitsubishi_Tredia_1600_Turbo_1982": 44.27, "Mitsubishi_Triton_Absolute_2019": 47.09, "Mitsubishi_Triton_SuperUte_2019": 62.35, "Nissan_370Z_Nismo_2009": 73.24, "Nissan_Skyline_GT-R_(R34)_1999": 74.19, "Oldsmobile_Aurora_1995": 56.36, "Pagani_Huayra_R_2021": 108, "Pagani_Zonda_S_7.3_2002": 105.88, "Peugeot_605_1989": 60.26, "Pontiac_Tempest_Le_Mans_GTO_1966": 54.26, "Porsche_911_GT3_RSR_997_2007": 105, "Porsche_911_RSR-19_(991.2)_2019": 98, "Porsche_Cayenne_Coupe_3.0_(9Y3)_2019": 69.51, "Porsche_RS_Spyder_Evo_2008": 103.8, "Renault_Espace_1997": 56.67, "Rimac_Concept_One_2016": 0, "Rimac_Nevera_2021": 110, "Vauxhall_Astra_1.6i_2004": 63.68, "Vauxhall_Opel_Adam_R2_2016": 49.11, "Volkswagen_Golf_GTI_1991": 62.34, "Volvo_1800ES_1972": 49.5, "Volvo_V60_Polestar_2015": 59.19, "Volvo_V60_T8_Polestar_2020": 67.69 }
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
      if (x.country === "XXX") {
        if (x.brand === "Brabham") x.country = "AU";
        if (x.brand === "Bufori") x.country = "MY";
        if (x.brand === "Ford") x.country = "AU";
        if (x.brand === "Giocattolo") x.country = "AU";
        if (x.brand === "Holden") x.country = "AU";
        if (x.brand === "Hyundai") x.country = "KR";
        if (x.brand === "Mazda") x.country = "JP";
        if (x.brand === "Mitsubishi") x.country = "JP";
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