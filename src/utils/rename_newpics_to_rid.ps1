write-host "-------------- rename"

$PhotoIdPath = "D:\Javier\Code\topdrives-records\src\incoming_pics - Copy\"

$PhotoIds = Get-ChildItem $PhotoIdPath


function ranameNow(){

    $changes =  @'
{
  "Ariel_Atom_4R_23_CARD": "Ariel_Atom_4R_2023",
  "Bizzarrini_5300_GT_Corsa_Revival_21_CARD": "Bizzarrini_5300_GT_Corsa_Revival_2021",
  "Bizzarrini_5300_GT_Strada_64_CARD": "Bizzarrini_5300_GT_Strada_1964",
  "Bizzarrini_Manta_68_CARD": "Bizzarrini_Manta_1968",
  "Bizzarrini_P538_Barchetta_66_CARD": "Bizzarrini_P538_Barchetta_1966",
  "Bugatti_Centodieci_19_CARD": "Bugatti_Centodieci_2022",
  "Bugatti_Divo_18_CARD": "Bugatti_Divo_2020",
  "Bugatti_La_Voiture_Noire_19_CARD": "Bugatti_La_Voiture_Noire_2021",
  "Caterham-_Seven_310R_16_CARD": "Caterham_Seven_310R_2016",
  "Caterham_Seven_420_Cup_22_CARD": "Caterham_Seven_420_Cup_2022",
  "Caterham_Seven_evo_Edition_23_CARD": "Caterham_Seven_evo_Edition_2023",
  "Caterham_Super_Seven_2000_23_CARD": "Caterham_Super_Seven_2000_2022",
  "Caterham_Super_Seven_600_22_CARD": "Caterham_Super_Seven_600_2022",
  "Citroen_19_19_Concept_19_CARD": "Citroen_19_19_2019",
  "Citroen_2CV_Sahara_4x4_58_CARD": "Citroen_2CV_Sahara_4x4_1958",
  "Citroen_Activa_1_Concept_88_CARD": "Citroen_Activa_1_1988",
  "Citroen_Activa_2_Concept_90_CARD": "Citroen_Activa_2_1990",
  "Citroen_Ami_21_CARD": "Citroen_Ami_2021",
  "Citroen_Ami_Buggy_22_CARD": "Citroen_Ami_Buggy_2022",
  "Citroen_AX_Electrique_95_CARD": "Citroen_AX_Electrique_1995",
  "Citroen_AX_Sport_90_CARD": "Citroen_AX_Sport_1990",
  "Citroen_Berlingo_04_CARD": "Citroen_Berlingo_2004",
  "Citroen_Berlingo_20_CARD": "Citroen_Berlingo_2020",
  "Citroen_BX_Break_DeChasse_Dyana_86_CARD": "Citroen_BX_Break_De_Chasse_Dyana_1986",
  "Citroen_BX_GT_85_CARD": "Citroen_BX_GT_1985",
  "Citroen_BX_GTi_4x4_93_CARD": "Citroen_BX_GTi_4x4_1993",
  "Citroen_BX_Sport_85_CARD": "Citroen_BX_Sport_1985",
  "Citroen_CAirdream_02_CARD": "Citroen_CAirdream_2002",
  "Citroen_CAirplay_04_CARD": "Citroen_CAirplay_2005",
  "Citroen_CBuggy_06_CARD": "Citroen_CBuggy_2006",
  "Citroen_CCactus_07_CARD": "Citroen_CCactus_2007",
  "Citroen_CElysee_WTCC_16_CARD": "Citroen_CElyee_Touring_Car_2016",
  "Citroen_C-Elysee_18_CARD": "Citroen_CElysee_2018",
  "Citroen_C-Elysee_15_CARD": "Citroen_CElysee_2015",
  "Citroen_CElysee_WTCC_13_CARD": "Citroen_CElysee_Touring_Car_2013",
  "Citroen_CMetisseP_06_CARD": "Citroen_CMetisse_2006",
  "Citroen_C_Quatre_VTS_14_CARD": "Citroen_CQuatre_VTS_2014",
  "Citroen_C2_Citroen_Sport_03_CARD": "Citroen_C2_Citroen_Sport_2003",
  "Citroen_C2_Cross_12_CARD": "Citroen_C2_Cross_2012",
  "Citroen_C3_02_CARD": "Citroen_C3_2002",
  "Citroen_C3_Max_15_CARD": "Citroen_C3_Max_2015",
  "Citroen_C3_Pluriel_10_CARD": "Citroen_C3_Pluriel_2010",
  "Citroen_C3_WRC_17_CARD": "Citroen_C3_WRC_2017",
  "Citroen_C3_XTR_05_CARD": "Citroen_C3_XTR_2005",
  "Citroen_C3-XR_19_CARD": "Citroen_C3XR_2019",
  "Citroen_C3L_20_CARD": "Citroen_C3L_2020",
  "Citroen_C4_Aircross_4x4_17_CARD": "Citroen_C4_Aircross_4x4_2017",
  "Citroen_C4_PureTech_130_21_CARD": "Citroen_C4_PureTech_130_2021",
  "Citroen_C4_WRC_07_CARD": "Citroen_C4_WRC_2007",
  "Citroen_C4_WRC_HYmotion4_08_CARD": "Citroen_C4_WRC_HYmotion4_2008",
  "Citroen_C5_Aircross_Plugin_Hybrid_22_CARD": "Citroen_C5_Aircross_Plugin_Hybrid_2022",
  "Citroen_C5_Aircross_PureTech_130_22_CARD": "Citroen_C5_Aircross_PureTech_130_2022",
  "Citroen_C5_Airscape_07_CARD": "Citroen_C5_Airscape_2007",
  "Citroen_C5_II_Tourer_22_HDi_Biturbo_05_CARD": "Citroen_C5_Tourer_22_HDi_2005",
  "Citroen_C5_X_Plugin_Hybrid_22_CARD": "Citroen_C5_X_Plugin_Hybrid_2022",
  "Citroen_C5_X_PureTech_180_22_CARD": "Citroen_C5_X_PureTech_180_2022",
  "Citroen_C8_07_CARD": "Citroen_C8_2007",
  "Citroen_Cactus_Airflow_2L_14_CARD": "Citroen_Cactus_Airflow_2L_2014",
  "Citroen_Cactus_Adventure_17_CARD": "Citroen_Cactus_Aventure_2014",
  "Citroen_Cactus_M_15_CARD": "Citroen_Cactus_M_2015",
  "Citroen_Citela_Concept_92_CARD": "Citroen_Citela_1992",
  "Citroen_CX_74_CARD": "Citroen_CX_1974",
  "Citroen_CX_2400_GTi_Rally_77_CARD": "Citroen_CX_2400_GTi_Rally_1977",
  "Citroen_DS23_Pallas_Injection_74_CARD": "Citroen_DS23_Pallas_Injection_1974",
  "Citroen_DS3_Cabrio_Racing_14_CARD": "Citroen_DS3_Cabrio_Racing_2014",
  "Citroen_DS3_R3T_10_CARD": "Citroen_DS3_R3T_2010",
  "Citroen_DS3_WRC_11_CARD": "Citroen_DS3_WRC_2011",
  "Citroen_DS4_16_THP200_15_CARD": "Citroen_DS4_16_THP_200_2015",
  "Citroen_DS4_20_HDi_11_CARD": "Citroen_DS4_20_HDi_2011",
  "Citroen_DS4_Racing_12_CARD": "Citroen_DS4_Racing_2012",
  "Citroen_DS5_16_THP200_14_CARD": "Citroen_DS5_16_THP_200_2014",
  "Citroen_DS5_20_HDi_12_CARD": "Citroen_DS5_20_HDi_2012",
  "Citroen_DS5_LS_15_CARD": "Citroen_DS5_LS_2015",
  "Citroen_DS5_LSR_14_CARD": "Citroen_DS5_LS_R_2014",
  "Citroen_Dyane_67_CARD": "Citroen_Dyane_1967",
  "Citroen_eBerlingo_Electric_22_CARD": "Citroen_eBerlingo_Electric_2022",
  "Citroen_e-C4_21_CARD": "Citroen_eC4_2021",
  "Citroen_e-C4_X_21_CARD": "Citroen_eC4_X_2021",
  "Citroen_EElysee_16_CARD": "Citroen_EElysee_2016",
  "Citroen_E-Mehari_18_CARD": "Citroen_EMehari_2018",
  "Citroen_GS_70_CARD": "Citroen_GS_Birotor_1973",
  "Citroen_Hypnos_Concept_08_CARD": "Citroen_Hypnos_2008",
  "Citroen_Karin_80_CARD": "Citroen_Karin_1980",
  "Citroen_Oli_22_CARD": "Citroen_Oli_2022",
  "Citroen_Saxo_Super_1600_97_CARD": "Citroen_Saxo_Super_1600_1997",
  "Citroen_Saxo_VTR_97_CARD": "Citroen_Saxo_VTR_1997",
  "Citroen_SM_75_CARD": "Citroen_SM_1975",
  "Citroen_SM_Michelin_Breadvan_72_CARD": "Citroen_SM_Michelin_Breadvan_1972",
  "Citroen_SM_Rallye_du_Maroc_71_CARD": "Citroen_SM_Rallye_du_Maroc_1971",
  "Citroen_SpaceTourer_4x4_EConcept_17_CARD": "Citroen_SpaceTourer_3x3_E_2017",
  "Citroen_SpaceTourer_Hyphen_16_CARD": "Citroen_SpaceTourer_Hyphen_2016",
  "Citroen_Tubik_Concept-_11_CARD": "Citroen_Tubil_2011",
  "Citroen_Visa_1000_Pistes_85_CARD": "Citroen_Vista_1000_pistes_1985",
  "Citroen_Visa_Chrono_82_CARD": "Citroen_Visa_Chrono_1982",
  "Citroen_Visa_Lotus_82_CARD": "Citroen_Visa_Lotus_1982",
  "Citroen_Visa_Trophee_82_CARD": "Citroen_Vista_Trophee_1982",
  "Citroen_Xantia_4x4_Turbo_99_CARD": "Citroen_Xantia_4x4_Turbo_1999",
  "Citroen_XM_20i_Turbo_99_CARD": "Citroen_XM_29i_Turbo_1999",
  "Citroen_Xsara_18i_16V_99_CARD": "Citroen_Xsara_18i_16V_1999",
  "Citroen_Xsara_Kit_Car_99_CARD": "Citroen_Xsara_Kit_Car_1999",
  "Citroen_Xsara_WRC_04_CARD": "Citroen_Xsara_WRC_2003",
  "Citroen_ZX_Rallye_Raid_90_CARD": "Citroen_ZX_Rallye_Raid_1990",
  "Ford_Capri_28_Injection_81_CARD": "Ford_Capri_28_Injection_1981",
  "Ford_Escort_RS2000_4WD_93_CARD": "Ford_Escort_RS2000_4WD_1994",
  "Ford_Escort_Twin_Cam_68_CARD": "Ford_Escort_Twin_Cam_1968",
  "Ford_Escort_XR3i_87_CARD": "Ford_Escort_XR3i_1987",
  "Ford_Escort_XR3i_92_CARD": "Ford_Escort_XR3i_1992",
  "Ford_Fiesta_22_CARD": "Ford_Fiesta_10_2022",
  "Ford_Fiesta_ST_22_CARD": "Ford_Fiesta_ST_2022",
  "Ford_Fiesta_XR2i_89_CARD": "Ford_Fiesta_XR2i_1989",
  "Ford_Fiesta_Zetec_S_08_CARD": "Ford_Fiesta_Zetec_S_2007",
  "Ford_Focus_22_CARD": "Ford_Focus_10_MHEV_2022",
  "Ford_Focus_ST_22_CARD": "Ford_Focus_ST_2022",
  "Ford_Kuga_19_CARD": "Ford_Kuga_15_2019",
  "Ford_Kuga_25T_08_CARD": "Ford_Kuga_25T_2008",
  "Ford_Kuga_Hybrid_19_CARD": "Ford_Kuga_Hybrid_2019",
  "Ford_Mondeo_22_TDCi_11_CARD": "Ford_Mondeo_22_TDCi_2011",
  "Ford_Mondeo_25T_07_CARD": "Ford_Mondeo_25_T_2007",
  "Ford_Puma_20_CARD": "Ford_Puma_10_MHEV_202",
  "Ford_Puma_ST_21_CARD": "Ford_Puma_ST_2021",
  "Ford_Ranger_Raptor_V6_22_CARD": "Ford_Ranger_Raptor_V6_2022",
  "Ford_Supervan_1_71_CARD": "Ford_Supervan_1_1971",
  "Ford_Supervan_2_84_CARD": "Ford_Supervan_2_1984",
  "Ford_Supervan_3_94_CARD": "Ford_Supervan_3_1994",
  "Ford_Supervan_4_22_CARD": "Ford_Supervan_4_2022",
  "Ford_Transit_Connect_XPress_07_CARD": "Ford_Transit_Connect_XPress_2007",
  "Koenigsegg_Gemera_HV8_23_CARD": "Koenigsegg_Gemera_HV8_2023",
  "McMurtry_Speirling_Prototype_Goodwood_Edition_22_CARD": "McMurtry_Speirling_Prototype__Goodwood_Edition_22_2022",
  "Automobili_Pininfarina_Battista_22_CARD": "Pininfarina_Battista_2022",
  "Automobili_Pininfarina_Battista_Anniversario_21_CARD": "Pininfarina_Battista_Anniversario_2022",
  "Radical_1100_Clubsport_96_CARD": "Radical_1100_Clubsport_1996",
  "Radical_RXC_Turbo_600R_17_CARD": "Radical_RXC_600R_2017",
  "Radical_RXC_Spyder_15_CARD": "Radical_RXC_Spyder_2015",
  "Radical_RXC_V8_13_CARD": "Radical_RXC_V8_2013",
  "Radical_SR1_XXR_23_CARD": "Radical_SR1_XXR_2023",
  "Radical_SR10_20_CARD": "Radical_SR10_2020",
  "Radical_SR10_XXR_23_CARD": "Radical_SR10_XXR_2023",
  "Radical_SR3_RS_09_CARD": "Radical_SR3_RS_2009",
  "Radical_SR3_SL_12_CARD": "Radical_SR3_SL_2012",
  "Radical_SR3_XXR_22_CARD": "Radical_SR3_XXR_2023",
  "Radical_SR8_05_CARD": "Radical_SR8_2005",
  "Radical_SR8_RSX_14_CARD": "Radical_SR8_RSX_2014",
  "Radical_SR8_RX_11_CARD": "Radical_SR8_RX_2011",
  "Skoda_1000MB_64_CARD": "Skoda_1000_MB_1964",
  "Skoda_110R_70_CARD": "Skoda_110_R_Coupe_1970",
  "Skoda_1100_OHC_57_CARD": "Skoda_1100_OHC_1957",
  "Skoda_130LR_85_CARD": "Skoda_130_LR_1985",
  "Skoda_130RS_75_CARD": "Skoda_130_RS_1975",
  "Skoda_200RS_74_CARD": "Skoda_200_RS_1974",
  "Skoda_422_29_CARD": "Skoda_422_1929",
  "Skoda_966_Supersport_53_CARD": "Skoda_966_Supersport_1953",
  "Skoda_Afriq_22_CARD": "Skoda_Afriq_2022",
  "Skoda_Atero_15_CARD": "Skoda_Atero_2016",
  "Skoda_Citigo_1_13_CARD": "Skoda_Citigo_10_MPI_SE_L_2013",
  "Skoda_Citigo_e_iV_21_CARD": "Skoda_Citigoe_iV_2020",
  "Skoda_Citijet_14_CARD": "Skoda_Citijet_2014",
  "Skoda_Element_17_CARD": "Skoda_Element_2017",
  "Skoda_Enyaq_Coupe_iV_80_22_CARD": "Skoda_Enyaq_Coupe_iV_80_2022",
  "Skoda_Enyaq_Coupe_iV_80x_22_CARD": "Skoda_Enyaq_Coupe_iV_80x_2022",
  "Skoda_Enyaq_Coupe_vRS_iV_22_CARD": "Skoda_Enyaq_Coupe_vRS_iV_2022",
  "Skoda_Enyaq_iV_80_21_CARD": "Skoda_Enyaq_iV_80_2021",
  "Skoda_Enyaq_iV_80x_21_CARD": "Skoda_Enyaq_iV_80x_2021",
  "Skoda_Fabia_10_TSI_21_CARD": "Skoda_Fabia_10_TSI_2021",
  "Skoda_Fabia_Estate_15_CARD": "Skoda_Fabia_Estate_14_TDI_2015",
  "Skoda_Fabia_Estate_01_CARD": "Skoda_Fabia_Estate_19_TDI_PD_2001",
  "Skoda_Fabia_Hatchback_18_CARD": "Skoda_Fabia_Hatchback_10_TSI_2018",
  "Skoda_Fabia_Hatchback_10_CARD": "Skoda_Fabia_Hatchback_12_TSI_2010",
  "Skoda_Fabia_00_CARD": "Skoda_Fabia_Hatchback_20_2000",
  "Skoda_Fabia_Monte_Carlo_15_CARD": "Skoda_Fabia_Monte_Carlo_14_TDI_2015",
  "Skoda_Fabia_R5_19_CARD": "Skoda_Fabia_R5_2019",
  "Skoda_Fabia_Rally2_EVO_Edition_120_21_CARD": "Skoda_Fabia_Rally2_EVO_Edition_120_2021",
  "Skoda_Fabia-Scout_12_CARD": "Skoda_Fabia_Scout_12_TSI_2012",
  "Skoda_Fabia_vRS_03_CARD": "Skoda_Fabia_vRS_2003",
  "Skoda_Fabia_vRS_Estate_13_CARD": "Skoda_Fabia_vRS_Estate_2013",
  "Skoda_Fabia_vRS_Hatchback_11_CARD": "Skoda_Fabia_vRS_Hatchback_2011",
  "Skoda_Favorit_93_CARD": "Skoda_Favorit_13_E_GLX_1993",
  "Skoda_Felicia_Estate_96_CARD": "Skoda_Felicia_Estate_GLXi_16_1996",
  "Skoda_Felicia_Fun_97_CARD": "Skoda_Felicia_Fun_1997",
  "Skoda_Felicia_Kit_Car_95_CARD": "Skoda_Felicia_Kit_Car_1995",
  "Skoda_Funstar_15_CARD": "Skoda_Funstar_2015",
  "Skoda_Kamiq_15TSI_19_CARD": "Skoda_Kamiq_15_TSI_2019",
  "Skoda_Karoq_20TDI_4x4_21_CARD": "Skoda_Karoq_20_TDI_4x4_2021",
  "Skoda_Karoq_20TSI_4x4_20_CARD": "Skoda_Karoq_20_TSI_4x4_2020",
  "Skoda_Kodiaq_20TDI_4x4_19_CARD": "Skoda_Kodiaq_20_TDI_4x4_2019",
  "Skoda_Kodiaq_20TSI_4x4_20_CARD": "Skoda_Kodiaq_20_TSI_4x4_2020",
  "Skoda_Kodiaq_vRS_20BiTDI_20_CARD": "Skoda_Kodiaq_vRS_20_BiTDI_2020",
  "Skoda_Kodiaq_vRS_20TSI_21_CARD": "Skoda_Kodiaq_vRS_20_TSI_2021",
  "Skoda_Mountiaq_19_CARD": "Skoda_Mountiaq_2019",
  "Skoda_Octavia_59_CARD": "Skoda_Octavia_1959",
  "Skoda_Octavia_Estate_15TSI_19_CARD": "Skoda_Octavia_Estate_15_TSI_2019",
  "Skoda_Octavia_Estate_18T_98_CARD": "Skoda_Octavia_Estate_18_T_1998",
  "Skoda_Octavia_Estate_20TDI_20_CARD": "Skoda_Octavia_Estate_20_TDI_2020",
  "Skoda_Octavia_Estate_20_TDI_CR_4x4_09_CARD": "Skoda_Octavia_Estate_20_TDI_CR_4x4_2009",
  "Skoda_Octavia_Hatchback_15TSI_21_CARD": "Skoda_Octavia_Hatchback_15_TSI_2021",
  "Skoda_Octavia_Hatchback_18T_FSI_09_CARD": "Skoda_Octavia_Hatchback_18T_FSI_2009",
  "Skoda_Octavia_Hatchback_19_TDI_PD_03_CARD": "Skoda_Octavia_Hatchback_19_TDI_PD_2003",
  "Skoda_Octavia_Hatchback_20TDI_19_CARD": "Skoda_Octavia_Hatchback_20_TDI_2014",
  "Skoda_Octavia_iV_Hatchback_14TSI_PHEV_21_CARD": "Skoda_Octavia_iV_Hatchback_14_TSI_PHEV_2021",
  "Skoda_Octavia_iV_vRS_Estate_20_CARD": "Skoda_Octavia_iV_vRS_Estate_2020",
  "Skoda_Octavia_iV_vRS_Hatchback_20_CARD": "Skoda_Octavia_iV_vRS_Hatchback_2020",
  "Skoda_Octavia_Scout_18TSI_11_CARD": "Skoda_Octavia_Scout_18_TSI_2011",
  "Skoda_Octavia_Scout_20TSI_21_CARD": "Skoda_Octavia_Scout_20_TSI_2021",
  "Skoda_Octavia_Scout_20_TDI_14_CARD": "Skoda_Octavia_Scout_29_TDI_2014",
  "Skoda_Octavia_vRS_01_CARD": "Skoda_Octavia_vRS_2001",
  "Skoda_Octavia_vRS_245_Estate_17_CARD": "Skoda_Octavia_vRS_245_Estate_2017",
  "Skoda_Octavia_vRS_Bonneville_11_CARD": "Skoda_Octavia_vRS_Bonneville_Special_2011",
  "Skoda_Octavia_vRS_Estate_20TDI_4x4_20_CARD": "Skoda_Octavia_vRS_Estate_20_TDI_4x4_2020",
  "Skoda_Octavia_vRS_Estate_20TDI_CR_09_CARD": "Skoda_Octavia_vRS_Estate_20_TDI_CR_2009",
  "Skoda_Octavia_vRS_Estate_20TDI_CR_4x4_17_CARD": "Skoda_Octavia_vRS_Estate_20_TDI_CR_4x4_2017",
  "Skoda_Octavia_vRS_Hatchback_20TSI_13_CARD": "Skoda_Octavia_vRS_Hatchback_20_TSI_2013",
  "Skoda_Octavia_vRS_Hatchback_20TSI_20_CARD": "Skoda_Octavia_vRS_Hatchback_20_TSI_2020",
  "Skoda_Octavia_vRS_Hatchback_20T_FSI_09_CARD": "Skoda_Octavia_vRS_Hatchback_20T_FSI_2009",
  "Skoda_Octavia_WRC_99_CARD": "Skoda_Octavia_WRC_1999",
  "Skoda_Popular_1101_CARD": "Skoda_Popular_1101_1940",
  "Skoda_Rapid_Saloon_12TSI_15_CARD": "Skoda_Rapid_Saloon_12_TSI_2015",
  "Skoda_Rapid_Spaceback_14TSI_15_CARD": "Skoda_Rapid_Spaceback_14_TSI_2015",
  "Skoda_Scala_15_TSI_19_CARD": "Skoda_Scala_15_TSI_2019",
  "Skoda_Scala_16_TDI_19_CARD": "Skoda_Scala_16_TDI_2019",
  "Skoda_Slavia_20_CARD": "Skoda_Slavia_2020",
  "Skoda_Sunroq_18_CARD": "Skoda_Sunroq_2018",
  "Skoda_Superb_Estate_20TDI_18_CARD": "Skoda_Superb_Estate_20_TDI_2018",
  "Skoda_Superb_Estate_20T_FSI_13_CARD": "Skoda_Superb_Estate_20_TFSI_2011",
  "Skoda_Superb_Hatchback_20TSI_4x4_18_CARD": "Skoda_Superb_Hatchback_20_TSI_4x4_2016",
  "Skoda_Superb_Hatchback_36_V6_13_CARD": "Skoda_Superb_Hatchback_36_V6_2013",
  "Skoda_Superb_iV_14TSI_PHEV_20_CARD": "Skoda_Superb_iV_14_TSI_PHEV_2020",
  "Skoda_Superb_Saloon_28_V6_02_CARD": "Skoda_Superb_Saloon_28_V6_2002",
  "Skoda_Superb_Scout_20TSI_21_CARD": "Skoda_Superb_Scout_20_TSI_2021",
  "Skoda_Yeti_18TSI_4x4_13_CARD": "Skoda_Yeti_18_TSI_4x4_2013",
  "Skoda_Yeti_20_TDI_4x4_14_CARD": "Skoda_Yeti_20_TDI_4x4_2014",
  "Talbot_Tagora_CARD": "Talbot_Tagora_SX_1980",
  "Volvo_142_1967_CARD": "Volvo_142_1967",
  "Volvo_144_1971_CARD": "Volvo_144_1971",
  "Volvo_145_Express_1967_CARD": "Volvo_145_Express_1967",
  "Volvo_242_GT_1980_CARD": "Volvo_242_GT_1980",
  "Volvo_244_GLT_1980_CARD": "Volvo_244_GLT_1980",
  "Volvo_262_C_Solaire_1981_CARD": "Volvo_262C_Solaire_1981",
  "Volvo_264_GL_1975_CARD": "Volvo_264_GL_1975",
  "Volvo_264_TE_1977_CARD": "Volvo_264_TE_1977",
  "Volvo_340_17_1985_CARD": "Volvo_340_17_1985",
  "Volvo_343_R-Sport_1981_CARD": "Volvo_343_RSport_1981",
  "Volvo_345_20_1981_CARD": "Volvo_345_20_1981",
  "Volvo_360_GLT_Saloon_1985_CARD": "Volvo_360_GLT_Saloon_1985",
  "Volvo_440_Si_1983_CARD": "Volvo_440_Si_1989",
  "Volvo_440_Turbo_1988_CARD": "Volvo_440_Turbo_1988",
  "Volvo_460_GLT_1993_CARD": "Volvo_460_GLT_1993",
  "Volvo_460_Turbo_1990_CARD": "Volvo_460_Turbo_1990",
  "Volvo_480_Cabrio_1990_CARD": "Volvo_480_Cabrio_1990",
  "Volvo_480_ES_1994_CARD": "Volvo_480_ES_1994",
  "Volvo_480_GT_1994_CARD": "Volvo_480_GT_1994",
  "Volvo_740_24_Estate_1985_CARD": "Volvo_740_24_Estate_1985",
  "Volvo_740_GL_Saloon_1985_CARD": "Volvo_740_GL_Saloon_1985",
  "Volvo_760_24D_Estate_1985_CARD": "Volvo_760_2_D_Estate_1985",
  "Volvo_760_28_V6_Saloon_1983_CARD": "Volvo_760_28_V6_Saloon_1983",
  "Volvo_780_Turbo_Coupe_1991_CARD": "Volvo_780_Turbo_Coupe_1991",
  "Volvo_850_T5-R_saloon_1995_CARD": "Volvo_850_T5R_saloon_1995",
  "Volvo_940_Estate_1994_CARD": "Volvo_940_Estate_1994",
  "Volvo_940_Saloon_1995_CARD": "Volvo_940_Saloon_1995",
  "Volvo_960_25_Estate_1995_CARD": "Volvo_960_25_Estate_1995",
  "Volvo_C30_DRIVe_Electric_2011_CARD": "Volvo_C30_DRIVe_Electric_2011",
  "Volvo_C40_Recharge_2023_CARD": "Volvo_C40_Recharge_2023",
  "Volvo_C40_Recharge_Twin_2023_CARD": "Volvo_C40_Recharge_Twin_2023",
  "Volvo_C70_D5_2006_CARD": "Volvo_C70_D5_2006",
  "Volvo_EX30_Single_Motor_23_CARD": "Volvo_EX30_Single_Motor_2023",
  "Volvo_EX30_Twin_Motor_Performance_23_CARD": "Volvo_EX30_Twin_Motor_Performance_2023",
  "Volvo_EX90_2024_CARD": "Volvo_EX90_Twin_Motor_2024",
  "Volvo_P1800E_1970_CARD": "Volvo_P1800E_1970",
  "Volvo_P1800S_1966_CARD": "Volvo_P1800S_1966",
  "Volvo_P220_Amazon_Estate_1965_CARD": "Volvo_P220_Amazon_Estate_1965",
  "Volvo_S40_T4_1998_CARD": "Volvo_S40_T4_1998",
  "Volvo_S40_T5_AWD_2005_CARD": "Volvo_S40_T5_AWD_2005",
  "Volvo_S60_Cross_Country_T5_AWD_2016_CARD": "Volvo_S60_Cross_Country_T5_AWD_2016",
  "Volvo_S60_T5_2000_CARD": "Volvo_S60_T5_2000",
  "Volvo_S60_T6_2013_CARD": "Volvo_S60_T6_2013",
  "Volvo_S60_T6_2019_CARD": "Volvo_S60_T6_AWD_2019",
  "Volvo_S70_R_1998_CARD": "Volvo_S70_R_1998",
  "Volvo_S70_T5_1998_CARD": "Volvo_S70_T5_1998",
  "Volvo_S80_32_AWD_2008_CARD": "Volvo_S80_32_AWD_2008",
  "Volvo_S80_D5_1998_CARD": "Volvo_S80_D5_2001",
  "Volvo_S80_T6_2002_CARD": "Volvo_S80_T6_2002",
  "Volvo_S90_T6_AWD_2017_CARD": "Volvo_S90_T6_AWD_2017",
  "Volvo_V40_20T_1996_CARD": "Volvo_V40_20T_1996",
  "Volvo_V40_T4_1998_CARD": "Volvo_V40_T4_1998",
  "Volvo_V40_T5_Cross_Country_2016_CARD": "Volvo_V40_T5_Cross_Country_2016",
  "Volvo_V50_D5_2004_CARD": "Volvo_V50_D5_2004",
  "Volvo_V50_SV_2004_CARD": "Volvo_V50_SV_2004",
  "Volvo_V50_T5_AWD_2005_CARD": "Volvo_V50_T5_AWD_2005",
  "Volvo_V60_Cross_Country_T5_AWD_2019_CARD": "Volvo_V60_Cross_Country_T5_AWD_2019",
  "Volvo_V60_Plug-in_Hybrid_2011_CARD": "Volvo_V60_Plugin_Hybrid_2011",
  "Volvo_V60_T5_2014_CARD": "Volvo_143_2014",
  "Volvo_V60_T6_AWD_2015_CARD": "Volvo_V60_T6_AWD_2015",
  "Volvo_V70_24T_AWD_1996_CARD": "Volvo_V70_24T_AWD_1996",
  "Volvo_V70_25T_2009_CARD": "Volvo_V70_25T_2009",
  "Volvo_V70_D5_2007_CARD": "Volvo_V70_D5_2007",
  "Volvo_V70_Plug-in_Hybrid_2009_CARD": "Volvo_V70_Plugin_Hybrid_2009",
  "Volvo_V70_R_1998_CARD": "Volvo_V70_R_AWD_1998",
  "Volvo_V70_T5_1997_CARD": "Volvo_V70_T5_1997",
  "Volvo_V70_T5_2001_CARD": "Volvo_V70_T5_2001",
  "Volvo_V70_T5_2012_CARD": "Volvo_V70_T5_2012",
  "Volvo_V70_XC_24T_AWD_2001_CARD": "Volvo_V70_XC_24T_AWD_2001",
  "Volvo_V70_XC_25T_AWD_1998_CARD": "Volvo_V70_XC_25T_AWD_1998",
  "Volvo_V90_Cross_Country_D5_AWD_2017_CARD": "Volvo_V90_Cross_Country_D5_AWD_2017",
  "Volvo_V90_Cross_Country_Ocean_Race_T6_AWD_2017_CARD": "Volvo_V90_Cross_Country_Ocean_Race_T6_AWD_2017",
  "Volvo_V90_T8_AWD_2019_CARD": "Volvo_V90_T8_AWD_2019",
  "Volvo_XC40_P8_AWD_Recharge_CARD": "Volvo_XC40_P8_AWD_Recharge_2022",
  "Volvo_XC40_Recharge_2023_CARD": "Volvo_XC40_Recharge_2023",
  "Volvo_XC60_T6_AWD_2014_CARD": "Volvo_XC60_T6_AWD_2014",
  "Volvo_XC60_T6_Recharge_2022_CARD": "Volvo_XC60_T6_Recharge_2022",
  "Volvo_XC70_AT_2005_CARD": "Volvo_XC70_AT_2005",
  "Volvo_XC70_D5_AWD_2010_CARD": "Volvo_XC70_D5_AWD_2010",
  "Volvo_XC70_D5_AWD_2006_CARD": "Volvo_XC70_D5_AWD_2006",
  "Volvo_XC70_T6_AWD_2008_CARD": "Volvo_XC70_T6_2008",
  "Volvo_XC90_PUV_2005_CARD": "Volvo_XC90_PUV_2005",
  "Volvo_XC90_T6_AWD_2004_CARD": "Volvo_XC90_T6_AWD_2004",
  "Zenvo_Aurora_Agil_23_CARD": "Zenvo_Aurora_Agil_2023",
  "Zenvo_Aurora_Tur_23_CARD": "Zenvo_Aurora_Tur_2023",
  "Zenvo_ST1_10_CARD": "Zenvo_ST1_2010",
  "Zenvo_TS1_GT_16_CARD": "Zenvo_TS1_GT_2016",
  "Zenvo_TSR_18_CARD": "Zenvo_TSR_2018",
  "Zenvo_TSR-GT_22_CARD": "Zenvo_TSRGT_2022",
  "Zenvo_TSR-S_18_CARD": "Zenvo_TSRS_2018"
}
'@
    
    $changesObject = $changes | ConvertFrom-Json


    $photoCounter = 0
    foreach($photo in $PhotoIds){

        # $first, $rest= $newname


        # $word = $photo.PSChildName
        # $SplittedWord = $word -split '_'
        # $first, $rest= $SplittedWord
        $rawName = $photo.BaseName
        $finalName = $changesObject."$rawName" + ".jpg"



        
        Write-Progress -Activity $finalName
        if ($finalName -ne ".jpg") {
            $photo | Rename-Item -NewName ($finalName)

        }
        
        
        continue
        








         
        # if (!$photo.PSIsContainer -and $photoCounter -eq 0)
        if (!$photo.PSIsContainer)
        {
            & $magickExePath convert $PhotoIdPath$photo -resize 27.3% -crop 74x45+13+9 $TempBig
            # $StartTime = $(get-date)

            if ($photo.PSChildName -Contains "_") {
                $importance = $photo.PSChildName.Split("_")
            } else {
                $importance = @($photo.PSChildName)
            }

            $importance = $photo.PSChildName.Split("_")

            $orderedSmalls = $script:Smalls | Sort-Object  @{ e= {

                $simplySmall = $_.PSChildName.ToLower().Normalize("FormD") -replace '\p{M}', ''
                
                # Write-Progress -Activity "Sorting $simplySmall"

                if ($simplySmall.IndexOf($importance[0].ToLower()) -gt -1 ) {
                    1
                } elseif ($importance[1] -and $simplySmall.IndexOf($importance[1].ToLower()) -gt -1 ) {
                    2
                } elseif ($importance[2] -and $simplySmall.IndexOf($importance[2].ToLower()) -gt -1 ) {
                    5
                } else {
                    6
                }
            
            }}


            $counter = 0
            $indexOfCar = 0
            foreach($small in $orderedSmalls) {
                if (!$small.PSIsContainer)
                {
                    Write-Progress -Activity "Searching $photo $counter"
                    $similarValue = [string] (& $magickExePath compare -metric mae $TempBig $SmallsTempPath$small null: 2>&1)
                    $similarValue = $similarValue.Substring($similarValue.IndexOf("(") + 1)
                    $similarValue = $similarValue.replace(')','')
                    $similarValue = [decimal]$similarValue

                    if ($similarValue -lt 0.1){
                        # write-host $similarValue
                        $indexOfCar = $counter
                        break
                    }
                    if ($counter -gt 150) {
                        break
                    }
                    $indexOfCar = -1
                    $counter += 1
                }
            }

            # Try again
            # Try again
            # Try again

            if ($indexOfCar -eq -1) {
                Write-Progress -Activity "Ordering New"

                $orderedSmalls = $script:Smalls | Sort-Object  @{ e= {
                    if ($_.PSChildName.Length -eq 7) {
                        $file = $_
                        $jsonItem = $json | where {
                            $_.photo -eq $file.PSChildName
                        }
                        if ($jsonItem) {
                            $jsonName = $jsonItem.name -replace '\+', ''
                            $jsonName = $jsonName.ToLower().Normalize("FormD") -replace '\p{M}', ''
                            if ($jsonName.IndexOf($importance[0].ToLower()) -gt -1 ) {
                                1
                            } elseif ($importance[1] -and $jsonName.IndexOf($importance[1].ToLower()) -gt -1 ) {
                                2
                            } elseif ($importance[2] -and $jsonName.IndexOf($importance[2].ToLower()) -gt -1 ) {
                                3
                            } else {
                                6
                            }                        
                        }
                    } else {
                        6
                    }
                }}

                $counter = 0
                $indexOfCar = 0
                foreach($small in $orderedSmalls) {
                    if (!$small.PSIsContainer)
                    {
                        Write-Progress -Activity "Searching AGAIN $photo $counter"
                        $similarValue = [string] (& $magickExePath compare -metric mae $TempBig $SmallsTempPath$small null: 2>&1)
                        $similarValue = $similarValue.Substring($similarValue.IndexOf("(") + 1)
                        $similarValue = $similarValue.replace(')','')
                        $similarValue = [decimal]$similarValue

                        if ($similarValue -lt 0.1){
                            # write-host $similarValue
                            $indexOfCar = $counter
                            break
                        }
                        if ($counter -gt 100) {
                            break
                        }
                        $indexOfCar = -1
                        $counter += 1
                    }
                }

            }

            # $elapsedTime = $(get-date) - $StartTime
            # $totalTime = "{0:HH:mm:ss}" -f ([datetime]$elapsedTime.Ticks)
            # write-host "Time:"$totalTime

            
            # $scoresCounter = 0
            # $minValue = 1
            # $minIndex = 0
            # foreach($string in $script:arrScores) {      
            #     $string = $string.Substring($string.IndexOf("(") + 1)
            #     $string = $string.replace(')','')
            #     $string = [decimal]$string
            #     $script:arrScores[$scoresCounter] = [decimal]$string
            #     if ($string -lt $minValue) {
            #         $minValue = $string
            #         $minIndex = $scoresCounter
            #     }
            #     $scoresCounter += 1
            # }
            if ($indexOfCar -eq -1) {
                write-host $photo "NOT FOUND"
                $photo | Rename-Item -NewName ("0000_"+$photo.PSChildName)
                continue
            }

            write-host $photo ">>>" $orderedSmalls[$indexOfCar]

            $newname = $json | where { $_.photo -eq $orderedSmalls[$indexOfCar].PSChildName }
            
            if ($newname) {
                $photo | Rename-Item -NewName ($newname.rid+".jpg")
            } else {
                write-host "NOT FOUND" $orderedSmalls[$indexOfCar]
            }
            
            $photoCounter += 1
        } else {
            # 
        }
        
    }
}
ranameNow

   

