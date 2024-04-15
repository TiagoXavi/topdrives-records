write-host "-------------- rename"

$PhotoIdPath = "D:\Javier\Code\topdrives-records\src\incoming_pics - Copy\"

$PhotoIds = Get-ChildItem $PhotoIdPath


function ranameNow(){

    $changes =  @'
{
  "Buick_Apollo_350_1973_CARD": "Buick_Apollo_350_V8_1973",
  "Buick_Avenir_2015_CARD": "Buick_Avenir_2015",
  "Buick_Avista_2016_CARD": "Buick_Avista_2016",
  "Buick_Bengal_Concept_2001_CARD": "Buick_Bengal_2001",
  "Buick_Blackhawk_Concept_2000_CARD": "Buick_Blackhawk_2000",
  "Buick_Bolero_1990_CARD": "Buick_Bolero_1990",
  "Buick_Cascada_2016_CARD": "Buick_Cascada_2016",
  "Buick_Centieme_2003_CARD": "Buick_Centieme_2003",
  "Buick_Centurion_1956_CARD": "Buick_Centurion_1956",
  "Buick_Centurion_1971_CARD": "Buick_Centurion_1971",
  "Buick_Century_Gran_Sport_455_Stage_1_1973_CARD": "Buick_Century_Gran_Sport_455_Stage_1_1973",
  "Buick_Century_T-Type_1983_CARD": "Buick_Century_TType_1983",
  "Buick_Cielo_1999_CARD": "Buick_Cielo_1999",
  "Buick_Electra_2020_CARD": "Buick_Electra_2020",
  "Buick_Electra-_1985_CARD": "Buick_Electra_1985",
  "Buick_Electra_1961_CARD": "Buick_Electra_1961",
  "Buick_Electra_1971_CARD": "Buick_Electra_1971",
  "Buick_Enclave_2018_CARD": "Buick_Enclave_2018",
  "Buick_Enclave_2020_CARD": "Buick_Enclave_2020",
  "Buick_Encore_2020_CARD": "Buick_Encore_2020",
  "Buick_Encore_2013_CARD": "Buick_Encore_2013",
  "Buick_Encore_GX_2020_CARD": "Buick_Encore_GX_2020",
  "Buick_Enspire_2018_CARD": "Buick_Enspire_2018",
  "Buick_Envision_2016_CARD": "Buick_Envision_2016",
  "Buick_Envision_2021_CARD": "Buick_Envision_2021",
  "Buick_Envision_Concept_2011_CARD": "Buick_Envision_2011",
  "Buick_Estate_Wagon_1977_CARD": "Buick_Estate_Wagon_1977",
  "Buick_Excelle_GT_18T_2018_CARD": "Buick_Excelle_GT_18T_2018",
  "Buick_Excelle_XT_Turbo_2010_CARD": "Buick_Excelle_XT_Turbo_2010",
  "Buick_GL8_2000_CARD": "Buick_GL8_2000",
  "Buick_GL8_Century_2022_CARD": "Buick_GL8_Century_2022",
  "Buick_GL8_II_2014_CARD": "Buick_GL8_II_2014",
  "Buick_GL8_III_2020_CARD": "Buick_GL8_III_2020",
  "Buick_Grand_National_1986_CARD": "Buick_Grand_National_1986",
  "Buick_Regal_Grand_National_1987_CARD": "Buick_Regal_Grand_National_1987",
  "Buick_GS_400_1968_CARD": "Buick_GS_400_1968",
  "Buick_Invicta_2008_CARD": "Buick_Invicta_2008",
  "Buick_Invicta-_1959_CARD": "Buick_Invicta_1959",
  "Buick_LaCrosse_2017_CARD": "Buick_LaCrosse_2017",
  "Buick_Lacrosse_AWD_2014_CARD": "Buick_Lacrosse_36_AWD_2014",
  "Buick_LaCrosse_Concept_2000_CARD": "Buick_LaCrosse_Concept_2000",
  "Buick_LaCrosse_Super_2008_CARD": "Buick_LaCrosse_Super_2008",
  "Buick_LeSabre_1959_CARD": "Buick_LeSabre_1959",
  "Buick_LeSabre_1962_CARD": "Buick_LeSabre_1962",
  "Buick_LeSabre_1965_CARD": "Buick_LeSabre_1965",
  "Buick_Lucerne_2006_CARD": "Buick_Lucerne_2006",
  "Buick_Lucerne_Concept_1988_CARD": "Buick_Lucerne_Concept_1988",
  "Buick_Opel_Sports_Coupe_1978_CARD": "Buick_Opel_Sports_Coupe_1978",
  "Buick_Park_Avenue_2007_CARD": "Buick_Park_Avenue_2007",
  "Buick_Park_Avenue_Essence_1989_CARD": "Buick_Park_Avenue_Essence_1989",
  "Buick_Park_Avenue_Ultra_1999_CARD": "Buick_Park_Avenue_Ultra_1999",
  "Buick_Park_Avenue_Ultra_1992_CARD": "Buick_Park_Avenue_Ultra_1992",
  "Buick_Questor_Concept_1983_CARD": "Buick_Questor_1983",
  "Buick_Rainier_2005_CARD": "Buick_Rainier_2005",
  "Buick_Reatta_1988_CARD": "Buick_Reatta_1988b",
  "Buick_Regal_1996_CARD": "Buick_Regal_1996",
  "Buick_Regal_GS_2018_CARD": "Buick_Regal_GS_2018",
  "Buick_Regal_GS_1997_CARD": "Buick_Regal_GS_1997",
  "Buick_Regal_LS_2001_CARD": "Buick_Regal_LS_2001",
  "Buick_Regal_T-Type_1983_CARD": "Buick_Regal_TType_1983",
  "Buick_Regal_TourX_2018_CARD": "Buick_Regal_TourX_2018",
  "Buick_Riviera_1963_CARD": "Buick_Riviera_1963",
  "Buick_Riviera_1998_CARD": "Buick_Riviera_1998",
  "Buick_Riviera_1971_CARD": "Buick_Riviera_1971",
  "Buick_Riviera_Concept_2013_CARD": "Buick_Riviera_Concept_2013",
  "Buick_Riviera_Concept_2007_CARD": "Buick_Riviera_Concept_2007",
  "Buick_Riviera_Gran_Sport_1965_CARD": "Buick_Riviera_Gran_Sport_1965",
  "Buick_Riviera_GS_1968_CARD": "Buick_Riviera_GS_1968",
  "Buick_Riviera_T-Type_1983_CARD": "Buick_Riviera_TType_1983",
  "Buick_Roadmaster_Sedan_1991_CARD": "Buick_Roadmaster_Sedan_1991",
  "Buick_Roadmaster_Wagon_1994_CARD": "Buick_Roadmaster_Wagon_1994",
  "Buick_Royaum_2005_CARD": "Buick_Royaum_2005",
  "Buick_Sceptre_1992_CARD": "Buick_Sceptre_1992",
  "Buick_Signia_1998_CARD": "Buick_Signia_1998",
  "Buick_Silver_Arrow_1963_CARD": "Buick_Silver_Arrow_1963",
  "Buick_Skyhawk_1975_CARD": "Buick_Skyhawk_1975",
  "Buick_Skyhawk_Limited_Station_Wagon_1984_CARD": "Buick_Skyhawk_Limited_Station_Wagon_1984",
  "Buick_Skyhawk_T-Type_1983_CARD": "Buick_Skyhawk_TType_1983",
  "Buick_Skylark_1965_CARD": "Buick_Skylark_1965",
  "Buick_Skylark_1968_CARD": "Buick_Skylark_1968",
  "Buick_Skylark_GS_Coupe_1992_CARD": "Buick_Skylark_GS_Coupe_1992",
  "Buick_Somerset_T-Type_1986_CARD": "Buick_Somerset_TType_1986",
  "Buick_Terraza_2005_CARD": "Buick_Terraza_2005",
  "Buick_Velite_2004_CARD": "Buick_Velite_2004",
  "Buick_Velite-5_2017_CARD": "Buick_Velite_5_2017",
  "Buick_Velite_6_EV_2022_CARD": "Buick_Velite_6_EV_2022",
  "Buick_Velite_6_PHEV_2019_CARD": "Buick_Velite_6_PHEV_2019",
  "Buick_Velite_7_2020_CARD": "Buick_Velite_7_2020",
  "Buick_Verano_2013_CARD": "Buick_Verano_2013",
  "Buick_Verano-GS_2016_CARD": "Buick_VeranoGS_2016",
  "Buick_Verano_Pro_GS_2022_CARD": "Buick_Verano_Pro_GS_2022",
  "Buick_Wildcat_1953_CARD": "Buick_Wildcat_1953",
  "Buick_Wildcat_1985_CARD": "Buick_Wildcat_1985",
  "Buick_Wildcat_2022_CARD": "Buick_Wildcat_EV_2022",
  "Buick_Wildcat_II_1954_CARD": "Buick_Wildcat_II_1954",
  "Buick_Wildcat_III_1955_CARD": "Buick_Wildcat_III_1955",
  "Buick_XP-300_1951_CARD": "Buick_XP300_1951",
  "Buick_XP2000_1995_CARD": "Buick_XP2000_1995",
  "Buick_Y-Job_1939_CARD": "Buick_YJob_1939",
  "Cadillac_Aera_10_CARD": "Cadillac_Aera_2010",
  "Cadillac_Allante_93_CARD": "Cadillac_Allante_1993",
  "Cadillac_ATS-V_Sedan_17_CARD": "Cadillac_ATSV_Sedan_2017",
  "Cadillac_ATSVR_15_CARD": "Cadillac_ATSVR_2015",
  "Cadillac_Brougham_89_CARD": "Cadillac_Brougham_1989",
  "Cadillac_Catera_00_CARD": "Cadillac_Catera_2000",
  "Cadillac_Ciel_11_CARD": "Cadillac_Ciel_2011",
  "Cadillac_Coupe_De_Ville_49_CARD": "Cadillac_Coupe_DeVille_1949",
  "Cadillac_Coupe_De_Ville_92_CARD": "Cadillac_Coupe_DeVille_1992",
  "Cadillac_CT4_20_CARD": "Cadillac_CT4_2020",
  "Cadillac_CT4V_20_CARD": "Cadillac_CT4V_2020",
  "Cadillac_CT4V_Blackwing_21_CARD": "Cadillac_CT4V_Blackwing_2021",
  "Cadillac_CT5_21_CARD": "Cadillac_CT5_2021",
  "Cadillac_CT5V_21_CARD": "Cadillac_CT5V_2021",
  "Cadillac_CT5V_Blackwing_22_CARD": "Cadillac_CT5V_Blackwing_2022",
  "Cadillac_CT6V_19_CARD": "Cadillac_CT6V_2019",
  "Cadillac_CTS_05_CARD": "Cadillac_CTS_2005",
  "Cadillac_CTSV_Coupe_11_CARD": "Cadillac_CTSV_Coupe_2011",
  "Cadillac_CTSV_Coupe_Race_Car_11_CARD": "Cadillac_CTSV_Coupe_Race_Car_2011",
  "Cadillac_CTSV_Sedan_09_CARD": "Cadillac_CTSV_Sedan_2009",
  "Cadillac_CTSV_Sedan_Race_Car_05_CARD": "Cadillac_CTSV_Sedan_Race_Car_2005",
  "Cadillac_Cyclone_59_CARD": "Cadillac_Cyclone_1959",
  "Cadillac_DeVille_Concours_98_CARD": "Cadillac_DeVille_Concours_1998",
  "Cadillac_DeVille_Touring_Sedan_91_CARD": "Cadillac_DeVille_Touring_Sedan_1991",
  "Cadillac_ElCamino_54_CARD": "Cadillac_El_Camino_1954",
  "Cadillac_Eldorado_53_CARD": "Cadillac_Eldorado_1953",
  "Cadillac_Eldorado_Biarritz_59_CARD": "Cadillac_Eldorado_Biarritz_1959",
  "Cadillac_Eldorado_Brougham_59_CARD": "Cadillac_Eldorado_Brougham_1959",
  "Cadillac_Eldorodo_00_CARD": "Cadillac_EldoRODo_2000",
  "Cadillac_Escala_16_CARD": "Cadillac_Escala_2016",
  "Cadillac_Escalade_23_CARD": "Cadillac_Escalade_2023",
  "Cadillac_Escalade_ESV_21_CARD": "Cadillac_Escalade_ESV_2021",
  "Cadillac_Escalade_EXT_02_CARD": "Cadillac_Escalade_EXT_2002",
  "Cadillac_Escalade_IQ_24_CARD": "Cadillac_Escalade_IQ_2024",
  "Cadillac_Escalade_Sport_07_CARD": "Cadillac_Escalade_Sport_2007",
  "Cadillac_EscaladeV_22_CARD": "Cadillac_EscaladeV_2022",
  "Cadillac_Evoq_99_CARD": "Cadillac_Evoq_1999",
  "Cadillac_Fleetwood_Eldorado_70_CARD": "Cadillac_Fleetwood_Eldorado_1970",
  "Cadillac_Imaj_00_CARD": "Cadillac_Imaj_2000",
  "Cadillac_Innerspace_22_CARD": "Cadillac_Innerspace_2022",
  "Cadillac_Lyriq_23_CARD": "Cadillac_Lyriq_AWD_2023",
  "Cadillac_Seville_Touring_Sedan_Seville_STS_98_CARD": "Cadillac_Seville_STS_1998",
  "Cadillac_SRX_10_CARD": "Cadillac_SRX_2010",
  "Cadillac_Urban_Luxury_10_CARD": "Cadillac_Urban_Luxury_2010",
  "Cadillac_Voyage_88_CARD": "Cadillac_Voyage_1988",
  "Cadillac_XT4_2024_CARD": "Cadillac_XT4_2024",
  "Cadillac_XT5_2020_CARD": "Cadillac_XT5_2020",
  "Cadillac_XT6_20_CARD": "Cadillac_XT6_2020",
  "Cadillac_XTSPremium_FWD_13_CARD": "Cadillac_XTS_FWD_2013",
  "Cadillac_XTS_Platinum_10_CARD": "Cadillac_XTS_Platinum_Concept_2010",
  "Chevrolet_Astro_II_XP-880_1968_CARD": "Chevrolet_Astro_II_XP880_1968",
  "Chevrolet_Avalanche_2008_CARD": "Chevrolet_Avalanche_2008",
  "Chevrolet_Beast_Concept_2021_CARD": "Chevrolet_Beast_2021",
  "Chevrolet_Bel_Air_1958_CARD": "Chevrolet_Bel_Air_1958",
  "Chevrolet_Bel_Air_1961_CARD": "Chevrolet_Bel_Air_1961",
  "Chevrolet_Bel_Air_Concept_2002_CARD": "Chevrolet_Bel_Air__2002",
  "Chevrolet_Blazer_2021_CARD": "Chevrolet_Blazer_2021",
  "Chevrolet_Blazer_RS_2019_CARD": "Chevrolet_Blazer_RS_2019",
  "Chevrolet_Blazer_ZR2_1999_CARD": "Chevrolet_Blazer_ZR2_1999",
  "Chevrolet_Bolt_EUV_2022_CARD": "Chevrolet_Bolt_EUV_2022",
  "Chevrolet_Bolt_EV_2017_CARD": "Chevrolet_Bolt_EV_2017",
  "Chevrolet_Borrego_2001_CARD": "Chevrolet_Borrego_2001",
  "Chevrolet_Camaro_Concept_2006_CARD": "Chevrolet_Camaro__2006",
  "Chevrolet_Camaro_GT4R_2017_CARD": "Chevrolet_Camaro_GT4R_2017",
  "Chevrolet_Camaro_LS_2009_CARD": "Chevrolet_Camaro_LS_2009",
  "Chevrolet_Camaro_Sport_Coupe_1982_CARD": "Chevrolet_Camaro_Sport_Coupe_1982",
  "Chevrolet_Camaro_SSX_2010_CARD": "Chevrolet_Camaro_SSX_2010",
  "Chevrolet_Caprice_Classic_2006_CARD": "Chevrolet_Caprice_Classic_2006",
  "Chevrolet_Captiva_2019_CARD": "Chevrolet_Captiva_2019",
  "Chevrolet_Cavalier_Z24_2000_CARD": "Chevrolet_Cavalier_Z24_2000",
  "Chevrolet_CERV_I_1959_CARD": "Chevrolet_CERV_I_1959",
  "Chevrolet_CERV_II_1964_CARD": "Chevrolet_CERV_II_1964",
  "Chevrolet_CERV_III_1990_CARD": "Chevrolet_CERV_III_1990",
  "Chevrolet_Chevelle_1972_CARD": "Chevrolet_Chevelle_1972",
  "Chevrolet_Chevelle_Laguna_LT5_Concept_2018_CARD": "Chevrolet_Chevelle_Laguna_LT5_2018",
  "Chevrolet_Chevelle_Malibu_SS_1965_CARD": "Chevrolet_Chevelle_Malibu_SS_1965",
  "Chevrolet_Chevelle_Malibu_SS_Hardtop_Coupe_1964_CARD": "Chevrolet_Chevelle_Malibu_SS_Hardtop_Coupe_1964",
  "Chevrolet_Chevelle_Slammer_Concept_2016_CARD": "Chevrolet_Chevelle_Slammer_2016",
  "Chevrolet_Colorado_2014_CARD": "Chevrolet_Colorado_2014",
  "Chevrolet_Colorado_LS_Crew_Cab_2003_CARD": "Chevrolet_Colorado_LS_Crew_Cab_2003",
  "Chevrolet_Colorado_ZR2_Race_Truck_2022_CARD": "Chevrolet_Colorado_ZR2_Race_Truck_2022",
  "Chevrolet_Corvair_Corsa_Turbo_1965_CARD": "Chevrolet_Corvair_Corsa_Turbo_1965",
  "Chevrolet_Corvair_Monza_1967_CARD": "Chevrolet_Corvair_Monza_1967",
  "Chevrolet_Corvette_AstroVette_1969_CARD": "Chevrolet_Corvette_AstroVette_1969",
  "Chevrolet_Corvette_C6R_2007_CARD": "Chevrolet_Corvette_C6R_2007",
  "Chevrolet_Corvette_C7R_2014_CARD": "Chevrolet_Corvette_C7R_2014",
  "Chevrolet_Corvette_C8R_2020_CARD": "Chevrolet_Corvette_C8R_2020",
  "Chevrolet_Corvette_Corvair_1954_CARD": "Chevrolet_Corvette_Corvair_1954",
  "Chevrolet_Corvette_Daytona_Prototype_2012_CARD": "Chevrolet_Corvette_Daytona_Prototype_2012",
  "Chevrolet_Corvette_Grand_Sport-II_1963_CARD": "Chevrolet_Corvette_GSII_1963",
  "Chevrolet_Corvette_Impala_XP101_Concept_1956_CARD": "Chevrolet_Corvette_Impala_XP101_Concept_1956",
  "Chevrolet_Corvette_IMSA_GTO_C4_1988_CARD": "Chevrolet_Corvette_IMSA_GTO_C4_1988",
  "Chevrolet_Corvette_Indy_Concept_1986_CARD": "Chevrolet_Corvette_Indy__1986",
  "Chevrolet_Corvette_Stingray_C8_2020_CARD": "Chevrolet_Corvette_Stingray_C8_2020",
  "Chevrolet_Corvette_Stingray_Concept_2009_CARD": "Chevrolet_Corvette_Stingray_Concept_2009",
  "Chevrolet_Corvette_Stingray_Convertible_C7_2016_CARD": "Chevrolet_Corvette_Stingray_Convertible_C7_2016",
  "Chevrolet_Corvette_Stingray_Convertible_C8_2022_CARD": "Chevrolet_Corvette_Stingray_Convertible_C8_2022",
  "Chevrolet_Corvette_Stingray_Coupe_C7_2015_CARD": "Chevrolet_Corvette_Stingray_Coupe_C7_2015",
  "Chevrolet_Corvette_Stingray_III_Concept_1992_CARD": "Chevrolet_Corvette_Stingray_III__1992",
  "Chevrolet_Corvette_Stingray_Racer_1959_CARD": "Chevrolet_Corvette_Stingray_Racer_1959",
  "Chevrolet_Corvette_Stingray_Z51_C8_2020_CARD": "Chevrolet_Corvette_Stingray_Z51_C8_2020",
  "Chevrolet_Corvette_Z06_C8_2022_CARD": "Chevrolet_Corvette_Z06_C8_2022",
  "Chevrolet_Corvette_Z06_Z07_Performance_Package_C8_2022_CARD": "Chevrolet_Corvette_Z06_Z07_Performance_Package_C8_2022",
  "Chevrolet_Corvette_Z06X_C6_2010_CARD": "Chevrolet_Corvette_Z06X_C6_2010",
  "Chevrolet_Cruze_WTCC_2011_CARD": "Chevrolet_Cruze_Touring_Car_2011",
  "Chevrolet_El_Camino2_1973__CARD": "Chevrolet_El_Camino_1973",
  "Chevrolet_Equinox_2005_CARD": "Chevrolet_Equinox_2005",
  "Chevrolet_Equinox_2019_CARD": "Chevrolet_Equinox_2019",
  "Chevrolet_Firenza_CanAm_1973_CARD": "Chevrolet_Firenza_CanAm_1973",
  "Chevrolet_Impala_2016_CARD": "Chevrolet_Impala_2016",
  "Chevrolet_Impala_1977_CARD": "Chevrolet_Impala_1977",
  "Chevrolet_Impala_2006_CARD": "Chevrolet_Impala_2006",
  "Chevrolet_Impala_LS_2000_CARD": "Chevrolet_Impala_LS_2000",
  "Chevrolet_Impala_Sport_Coupe_1971_CARD": "Chevrolet_Impala_Sport_Coupe_1971",
  "Chevrolet_Impala_SS_2007_CARD": "Chevrolet_Impala_SS_2007",
  "Chevrolet_Impala_SS_2004_CARD": "Chevrolet_Impala_SS_2004",
  "Chevrolet_K1500_Blazer_1992_CARD": "Chevrolet_K1500_Blazer_1992",
  "Chevrolet_K5_Blazer-E_2020_CARD": "Chevrolet_K5_BlazerE_2020",
  "Chevrolet_Kingswood_1969_CARD": "Chevrolet_Kingswood_1969",
  "Chevrolet_Lacetti_WTCC_2006_CARD": "Chevrolet_Lacetti_Touring_Car_2006",
  "Chevrolet_Lacetti_WTCC_R_Concept_2005_CARD": "Chevrolet_Lacetti_WTCC_R_2005",
  "Chevrolet_Lumina_1998_CARD": "Chevrolet_Lumina_1998",
  "Chevrolet_Lumina_1995_CARD": "Chevrolet_Lumina_1995",
  "Chevrolet_Lumina_APV_1989_CARD": "Chevrolet_Lumina_APV_1989",
  "Chevrolet_Lumina_CSV_CR8_2008_CARD": "Chevrolet_Lumina_CSV_CR8_2008",
  "Chevrolet_Lumina_SS_Coupe_2002_CARD": "Chevrolet_Lumina_SS_Coupe_2002",
  "Chevrolet_Mako_Shark_II_Concept_1965_CARD": "Chevrolet_Mako_Shark_II__1965",
  "Chevrolet_Malibu_1998_CARD": "Chevrolet_Malibu_1998",
  "Chevrolet_Malibu_2008_CARD": "Chevrolet_Malibu_2008",
  "Chevrolet_Malibu_2014_CARD": "Chevrolet_Malibu_2014",
  "Chevrolet_Malibu_Maxx_2005_CARD": "Chevrolet_Malibu_Maxx_2005",
  "Chevrolet_Malibu_Maxx_SS_2006_CARD": "Chevrolet_Malibu_Maxx_SS_2006",
  "Chevrolet_Monte_Carlo_1977__CARD": "Chevrolet_Monte_Carlo_1977",
  "Chevrolet_Monte_Carlo_SS_2001_CARD": "Chevrolet_Monte_Carlo_SS_2001",
  "Chevrolet_Monte_Carlo_Z34_1995_CARD": "Chevrolet_Monte_Carlo_Z34_1995",
  "Chevrolet_Nomad_Concept_2004_CARD": "Chevrolet_Nomad__2004",
  "Chevrolet_Nova_SS_327_Coupe_1966_CARD": "Chevrolet_Nova_SS_327_Coupe_1966",
  "Chevrolet_Nova_SS_350_Coupe_1969_CARD": "Chevrolet_Nova_SS_350_Coupe_1969",
  "Chevrolet_Nova_Twin-Cam_1988_CARD": "Chevrolet_Nova_TwinCam_1988",
  "Chevrolet_Seeker_RS_2022_CARD": "Chevrolet_Seeker_RS_2022",
  "Chevrolet_Silverado_1999_CARD": "Chevrolet_Silverado_1999",
  "Chevrolet_Silverado_2021_CARD": "Chevrolet_Silverado_1500_Duramax__2021",
  "Chevrolet_Silverado_ZR2_2022_CARD": "Chevrolet_Silverado_1500_ZR2_2022",
  "Chevrolet_Silverado_2500_HD_2021_CARD": "Chevrolet_Silverado_2500_HD_2021",
  "Chevrolet_Silverado_3500_HD_2021_CARD": "Chevrolet_Silverado_3500_HD_2021",
  "Chevrolet_Silverado_Trailboss_LT_2019_CARD": "Chevrolet_Silverado_LT_Trailboss_2019",
  "Chevrolet_Sonic_RS_2013_CARD": "Chevrolet_Sonic_RS_2013",
  "Chevrolet_Sprint_Turbo_1989_CARD": "Chevrolet_Sprint_Turbo_1989",
  "Chevrolet_SS_2014_CARD": "Chevrolet_SS_2014",
  "Chevrolet_SS_2003_CARD": "Chevrolet_SS_2003",
  "Chevrolet_Tahoe_2021_CARD": "Chevrolet_Tahoe_2021",
  "Chevrolet_Tahoe_RST_2020_CARD": "Chevrolet_Tahoe_RST_2020",
  "Chevrolet_Tahoe_Z71_2020_CARD": "Chevrolet_Tahoe_Z71_2020",
  "Chevrolet_Traverse_2016_CARD": "Chevrolet_Traverse_2016",
  "Chevrolet_Trax_Concept_2007_CARD": "Chevrolet_Trax_2007",
  "Chevrolet_Volt_2016_CARD": "Chevrolet_Volt_2016",
  "Chevrolet_Volt_Concept_2007_CARD": "Chevrolet_Volt_Concept_2007",
  "Chevrolet_WTCC_Ultra_2006_CARD": "Chevrolet_WTCC_Ultra_2006",
  "Chevrolet_XP-897_GT_1973_CARD": "Chevrolet_XP897_GT_1973",
  "Chrysler_300C_2023_CARD": "Chrysler_300C_Final_Edition_2023",
  "Chrysler_Airflow_Concept_2022_CARD": "Chrysler_Airflow_2022",
  "Chrysler_Pacifica_Plug-in_Hybrid_2023_CARD": "Chrysler_Pacifica_Plugin_Hybrid_2023",
  "Chrysler_Portal_2017_CARD": "Chrysler_Portal_2017",
  "Chrysler_Thunderbolt_1941_CARD": "Chrysler_Thunderbolt_1941",
  "Chrysler_Thunderbolt_1993_CARD": "Chrysler_Thunderbolt_1993",
  "DMC_Alpha5_24_CARD": "DMC_Alpha5_Launch_Edition_2024",
  "Dodge_1500_GT_90_1973_CARD": "Dodge_1500_GT_90_1973",
  "Dodge_A100_Custom_Sportsman_1967_CARD": "Dodge_A100_Custom_Sportsman_Wagon_1967",
  "Dodge_A100_Pickup_1964_CARD": "Dodge_A100_Pickup_1964",
  "Dodge_Avenger_RT_AWD_2008_CARD": "Dodge_Avenger_RT_AWD_2008",
  "Dodge_Challenger_1320_2009_CARD": "Dodge_Challenger_1320_2009",
  "Dodge_Challenger_Drag_Race_Package_2008_CARD": "Dodge_Challenger_Drag_Race_Package_2008",
  "Dodge_Challenger_RT_2009_CARD": "Dodge_Challenger_RT_2009",
  "Dodge_Challenger_Shakedown_2016_CARD": "Dodge_Challenger_Shakedown_2016",
  "Dodge_Charger_Daytona_Scat_Pack_24_CARD": "Dodge_Charger_Daytona_Scat_Pack_2024",
  "Dodge_Charger_Daytona_SRT_Concept_2022_CARD": "Dodge_Charger_Daytona_SRT_2022",
  "Dodge_Charger_GT_AWD_2018_CARD": "Dodge_Charger_GT_AWD_2018",
  "Dodge_Dart_GLH_Concept_2015_CARD": "Dodge_Dart_GLH_Concept_2015",
  "Dodge_Dart_Global_RallyCross_2012_CARD": "Dodge_Dart_Global_RallyCross_2012",
  "Dodge_Durango_Pursuit_2021_CARD": "Dodge_Durango_Pursuit_2021",
  "Dodge_Durango_RT_Hemi_AWD_2011_CARD": "Dodge_Durango_RT_Hemi_AWD_2011",
  "Dodge_Caravan_RT_2015_CARD": "Dodge_Caravan_RT_2015",
  "Dodge_Hornet_GT_2022_CARD": "Dodge_Hornet_GT_2022",
  "Dodge_Intrepid_Concept_1989_CARD": "Dodge_Intrepid_1989",
  "Dodge_Kahuna_2003_CARD": "Dodge_Kahuna_2003",
  "Dodge_Lancer_Turbo_1985_CARD": "Dodge_Lancer_Turbo_1985",
  "Dodge_MAXXcab_Concept_2000_CARD": "Dodge_MAXXcab_2000",
  "Dodge_Neon_2017_CARD": "Dodge_Neon_2017",
  "Dodge_SRT_Viper_GT3-R_2014_CARD": "Dodge_SRT_Viper_GT3R_2014",
  "Dodge_T-Rex_6x6_1997_CARD": "Dodge_TRex_6x6_1997",
  "Drako_Dragon_23_CARD": "Drako_Dragon_2023",
  "Drako_GTE_20_CARD": "Drako_GTE_2020",
  "GMC_Canyon_SLT_2015_CARD": "GMC_Canyon_SLT_2015",
  "GMC_Envoy_2002_CARD": "GMC_Envoy_2002",
  "GMC_Handi-Van_1967_CARD": "GMC_HandiVan_1967",
  "GMC_HUMMER_EV_Pickup_3X_2023_CARD": "GMC_HUMMER_EV_Pickup_3X_2023",
  "GMC_HUMMER_EV_SUV_3X_2024_CARD": "GMC_HUMMER_EV_SUV_3X_2024",
  "GMC_Rally_STX_350_1986_CARD": "GMC_Rally_STX_350_1986",
  "GMC_S-15_Jimmy_1983_CARD": "GMC_S15_Jimmy_1983",
  "GMC_Safari_1985_CARD": "GMC_Safari_1985",
  "GMC_Savana_2017_CARD": "GMC_Savana_2017",
  "GMC_Sierra_1500_AT4_2019_CARD": "GMC_Sierra_1500_AT4_2019",
  "GMC_Sierra_Elevation_2020_CARD": "GMC_Sierra_1500_Elevation_2020",
  "GMC_Sierra_1500_SLT_2019_CARD": "GMC_Sierra_1500_SLT_2019",
  "GMC_Sierra_2500_HD_AT4_2020_CARD": "GMC_Sierra_2500_HD_AT4_2020",
  "GMC_Sierra_2500_HD_Denali_2020_CARD": "GMC_Sierra_2500_HD_Denali_2020",
  "GMC_Sierra_HD_SLT_2020_CARD": "GMC_Sierra_HD_SLT_2020",
  "GMC_Sierra_3500_2015_CARD": "GMC_Sierra_3500_2015",
  "GMC_Sierra_3500_HD_Denali_Ultimate_2020_CARD": "GMC_Sierra_3500_HD_Denali_Ultimate_2020",
  "GMC_Sierra_Classic_1999_CARD": "GMC_Sierra_Classic_1999",
  "GMC_Sierra_Denali_2500_HD_2015_CARD": "GMC_Sierra_Denali_2500_HD_2015",
  "GMC_Sierra_Hybrid_2006_CARD": "GMC_Sierra_Hybrid_2006",
  "GMC_Sprint_SP_1974_CARD": "GMC_Sprint_SP_1974",
  "GMC_Suburban_1973_CARD": "GMC_Suburban_1973",
  "GMC_Suburban_1962_CARD": "GMC_Suburban_1962",
  "GMC_Suburban_Carryall_1937_CARD": "GMC_Suburban_Carryall_1937",
  "GMC_Terrain_Denali_2018_CARD": "GMC_Terrain_Denali_2018",
  "GMC_Terrain_Denali_2016_CARD": "GMC_Terrain_Denali_2016",
  "GMC_Yukon_2015_CARD": "GMC_Yukon_2015",
  "GMC_Yukon_Denali_2000_CARD": "GMC_Yukon_Denali_2000",
  "GMC_Yukon_XL_2015_CARD": "GMC_Yukon_XL_2015",
  "GMC_Yukon_XL_Denali_2015_CARD": "GMC_Yukon_XL_Denali_2015",
  "GMC_Yukon_XL_Denali_2021_CARD": "GMC_Yukon_XL_Denali_2021",
  "Ram_1500_Backcountry_X_2022_CARD": "Ram_1500_Backcountry_X_2022",
  "Ram_1500_Rebel_OTG_2019_CARD": "Ram_1500_Rebel_OTG_2019",
  "Ram_1500_Revolution_2023_CARD": "Ram_1500_Revolution_2023",
  "Ram_1500_TRX_Gold_Shot_2022_CARD": "Ram_1500_TRX_Gold_Shot_2022",
  "Ram_1500_Warlock_2023_CARD": "Ram_1500_Warlock_2023",
  "Ram_2500_Rebel_2023_CARD": "Ram_2500_Rebel_2023",
  "Ram_3500_Limited_2023_CARD": "Ram_3500_Limited_2023",
  "Ram_ProMaster_1500_2022_CARD": "Ram_ProMaster_1500_2022",
  "Ram_ProMaster_City_Cargo_2022_CARD": "Ram_ProMaster_City_Cargo_2022",
  "Ram_Rampage_RT_2024_CARD": "Ram_Rampage_RT_2024"
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

   

