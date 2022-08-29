<template>
  <div class="MainImportRude_Root">
    <div class="MainImportRude_Layout">
      <div class="MainImportRude_Body">
        <div class="MainImportRude_Input">
          <!-- <input
            class="input"
            type="text"
            placeholder="paste here"
            @paste="intercept($event)"
          /> -->
          {{ currentIndex }}
          <button class="D_Button D_ButtonDark" @click="nextCar()">Next</button>
        </div>
      </div>
    </div>
    <div class="MainImportRude_AppWrap">
      <Main :phantomCar="phantomCar" :isImport="true" @nonewdata="nextCar()" />
    </div>
  </div>
</template>

<script>
import cars_final from '../database/cars_final.json'
import cars_final_PL14 from '../database/cars_final_PL14.json'
import changedCars from '../database/changedCars.json'
import rude_all from '../database/rude_all.json'

import Main from './Main.vue'

export default {
  name: 'MainImportRude',
  components: {
    Main
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linhas: null,
      cars_final,
      changedCars,
      rude_all,
      pl_14: cars_final_PL14,
      result: null,
      ridNotIndefied: [],
      bannedRids: [],
      foundRids: [],
      dataToUpdate: [],
      currentIndex: -1,
      phantomCar: null
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    
    

    this.checkJson(this.rude_all);
  },
  computed: {},
  methods: {
    intercept(e) {
      let text = e.clipboardData.getData('text');
      this.result = JSON.parse(text);
      console.log(this.result);

      this.checkJson(this.result);
      
      setTimeout(() => {
        e.srcElement.value = '';
      }, 10);
    },
    checkJson(rude) {
      let tunes = [];
      let vm = this;      
      var _merge = require('lodash/merge');

      Object.keys( rude ).forEach(function (key) {
        let fixedRudeRid = rude[key].rid;
        if (fixedRudeRid.indexOf("Opel_") === 0) fixedRudeRid = fixedRudeRid.replace("Opel_", "Vauxhall_Opel_");
        if (fixedRudeRid.indexOf("Abarth_") === 0) fixedRudeRid = fixedRudeRid.replace("Abarth_", "Fiat_Abarth_");
        if (fixedRudeRid.indexOf("Range_Rover_") === 0) fixedRudeRid = fixedRudeRid.replace("Range_Rover_", "Land_Rover_Range_Rover_");
        if (fixedRudeRid.indexOf("Alpine_") === 0) fixedRudeRid = fixedRudeRid.replace("Alpine_", "Renault_Alpine_");
        if (fixedRudeRid.indexOf("Apollo_") === 0) fixedRudeRid = fixedRudeRid.replace("Apollo_", "Gumpert_Apollo_");
        fixedRudeRid = fixedRudeRid.replace("/", "");
        fixedRudeRid = fixedRudeRid.replace(":", "");
        fixedRudeRid = fixedRudeRid.replace("!", "");



        if (fixedRudeRid === 'Renault_Sport_Clio_R.S._16_2016') fixedRudeRid = "Renault_Sport_Clio_R.S.16_2016";
        else if (fixedRudeRid === "Buick_LaCrosse_CXS_2005") fixedRudeRid = "Buick_LaCrosse_CXL_2005";
        else if (fixedRudeRid === "Fiat_Punto_HGT_Abarth_1999") fixedRudeRid = "Fiat_Punto_HGT_1999";
        else if (fixedRudeRid === "Bentley_Grand_Convertible_2014") fixedRudeRid = "Bentley_Mulsanne_Grand_Convertible_2014";
        else if (fixedRudeRid === "BMW_M3_Convertible_2001") fixedRudeRid = "BMW_M3_2001";
        else if (fixedRudeRid === "RUF_CTR_\"Yellowbird\"_1987") fixedRudeRid = "RUF_CTR_Yellowbird_1987";
        else if (fixedRudeRid === "Volvo_C30_Polestar_2013") fixedRudeRid = "Volvo_C30_Polestar_Performance_2010";
        else if (fixedRudeRid === "Chevrolet_Camaro_ZL1_Convertible_2015") fixedRudeRid = "Chevrolet_Camaro_ZL1_2015";
        else if (fixedRudeRid === "Citroën_C5_Tourer_2016") fixedRudeRid = "Citroen_C5_Tourer_3.0_L_2016";
        else if (fixedRudeRid === "Koenigsegg_CCXR_2017") fixedRudeRid = "Koenigsegg_CCXR_2007";
        else if (fixedRudeRid === "Citroën_BX_GTi_16V_1987") fixedRudeRid = "Citroen_BX_16v_1987";
        else if (fixedRudeRid === "Vauxhall_Opel_Kadett_Rallye_E_4S_1985") fixedRudeRid = "Vauxhall_Opel_Kadett_Rallye_E-4S_1985";

        fixedRudeRid = fixedRudeRid.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");

        let currentCar = vm.cars_final.find(x => x.rid.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "") === fixedRudeRid);
        if (!currentCar) {
          // second try
          let fixedRudeRidCut = fixedRudeRid.substr(0, fixedRudeRid.length-4);
          let matchList = vm.cars_final.filter(x => x.rid.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "").substr(0, x.rid.length-4) === fixedRudeRidCut);
          
          matchList = matchList.filter(x => {
            if (`${x.rid.substr(0, x.rid.length-4)}${x.year}`.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "") === fixedRudeRid) {
              return true
            }
          })
          if (matchList.length === 1) currentCar = matchList[0];
        }

        if (!currentCar) {
          // not found
          vm.ridNotIndefied.push(rude[key].rid);
          return;
        }

        if (vm.changedCars.includes(currentCar.rid)) {
          // banned 
          vm.bannedRids.push(rude[key].rid);
        } else {
          vm.foundRids.push(rude[key].rid);

          Object.keys( rude[key].data ).forEach(function (tune) {

            if (tune === '233' || tune === '323' || tune === '332' || (tune === '111' && currentCar.class === 'S')) {
              // allowed tune
              vm.dataToUpdate.push({
                ...currentCar,
                data: {
                  [tune]: rude[key].data[tune]
                }
              })
            }

          })

        }


        
      });

      // console.log(vm.ridNotIndefied);
      // debugger;
      // console.log(vm.bannedRids);
      // debugger;
      console.log(vm.dataToUpdate);
      // debugger;

    },
    nextCar() {
      this.currentIndex++;
      this.phantomCar = this.dataToUpdate[this.currentIndex];
      let tune = Object.keys(this.phantomCar.data)[0];
      this.phantomCar.selectedTune = tune;

      let vm = this;

      Object.keys( this.phantomCar.data[tune].times ).forEach(function (rudeKey) {
        let newKeyName = rudeKey;

        if (newKeyName.indexOf("Dragster1Mile(Rolling)") === 0) newKeyName = newKeyName.replace("Dragster1Mile(Rolling)", "mile1r")
        if (newKeyName.indexOf("HillClimb(Rolling)") === 0) newKeyName = newKeyName.replace("HillClimb(Rolling)", "hClimbr")
        if (newKeyName.indexOf("TokyoLoop(Rolling)") === 0) newKeyName = newKeyName.replace("TokyoLoop(Rolling)", "tokyoLoop")
        if (newKeyName.indexOf("SlalomTest(Rolling)") === 0) newKeyName = newKeyName.replace("SlalomTest(Rolling)", "slalomr")
        if (newKeyName.indexOf("FastTrack(Rolling)") === 0) newKeyName = newKeyName.replace("FastTrack(Rolling)", "fastr")
        if (newKeyName.indexOf("TwistyTracks(Rolling)") === 0) newKeyName = newKeyName.replace("TwistyTracks(Rolling)", "tCircuitr")
        if (newKeyName.indexOf("TestBowl(Rolling)") === 0) newKeyName = newKeyName.replace("TestBowl(Rolling)", "testBowlr")
        if (newKeyName.indexOf("G-Force(Rolling)") === 0) newKeyName = newKeyName.replace("G-Force(Rolling)", "gForcer")
        if (newKeyName.indexOf("TokyoRamp(Rolling)") === 0) newKeyName = newKeyName.replace("TokyoRamp(Rolling)", "tokyoOffRamp")
        if (newKeyName.indexOf("Dragster1\/4Mile(Rolling)") === 0) newKeyName = newKeyName.replace("Dragster1\/4Mile(Rolling)", "mile4r")
        if (newKeyName.indexOf("Tokyo'sOverpass(Rolling)") === 0) newKeyName = newKeyName.replace("Tokyo'sOverpass(Rolling)", "tokyoOverpass")
        if (newKeyName.indexOf("G-Force") === 0) newKeyName = newKeyName.replace("G-Force", "gForce")
        if (newKeyName.indexOf("TwistyTrack") === 0) newKeyName = newKeyName.replace("TwistyTrack", "tCircuit")
        if (newKeyName.indexOf("Dragster1\/4Mile") === 0) newKeyName = newKeyName.replace("Dragster1\/4Mile", "mile4")
        if (newKeyName.indexOf("CarPark") === 0) newKeyName = newKeyName.replace("CarPark", "carPark")
        if (newKeyName.indexOf("TestBowl") === 0) newKeyName = newKeyName.replace("TestBowl", "testBowl")
        if (newKeyName.indexOf("SlalomTest") === 0) newKeyName = newKeyName.replace("SlalomTest", "slalom")
        if (newKeyName.indexOf("CityStreetsMedium") === 0) newKeyName = newKeyName.replace("CityStreetsMedium", "csMed")
        if (newKeyName.indexOf("HairpinRoad") === 0) newKeyName = newKeyName.replace("HairpinRoad", "hairpin")
        if (newKeyName.indexOf("0-150MPH") === 0) newKeyName = newKeyName.replace("0-150MPH", "drag150")
        if (newKeyName.indexOf("HillClimb") === 0) newKeyName = newKeyName.replace("HillClimb", "hClimb")
        if (newKeyName.indexOf("TwistyRoad") === 0) newKeyName = newKeyName.replace("TwistyRoad", "tRoad")
        if (newKeyName.indexOf("FastTrack") === 0) newKeyName = newKeyName.replace("FastTrack", "fast")
        if (newKeyName.indexOf("0-100MPH") === 0) newKeyName = newKeyName.replace("0-100MPH", "drag100")
        if (newKeyName.indexOf("LongOceanDrag") === 0) newKeyName = newKeyName.replace("LongOceanDrag", "oceanLongDrag")
        if (newKeyName.indexOf("Dragster1Mile") === 0) newKeyName = newKeyName.replace("Dragster1Mile", "mile1")
        if (newKeyName.indexOf("FrozenLake") === 0) newKeyName = newKeyName.replace("FrozenLake", "frozenLake")
        if (newKeyName.indexOf("75-125MPH") === 0) newKeyName = newKeyName.replace("75-125MPH", "drag75125")
        if (newKeyName.indexOf("Dragster1\/2Mile") === 0) newKeyName = newKeyName.replace("Dragster1\/2Mile", "mile2")
        if (newKeyName.indexOf("RallycrossMediumCircuit") === 0) newKeyName = newKeyName.replace("RallycrossMediumCircuit", "rallyMed")
        if (newKeyName.indexOf("OceanHighway") === 0) newKeyName = newKeyName.replace("OceanHighway", "oceanHighway")
        if (newKeyName.indexOf("MotocrossTrack") === 0) newKeyName = newKeyName.replace("MotocrossTrack", "moto")
        if (newKeyName.indexOf("LongMonacoStreet") === 0) newKeyName = newKeyName.replace("LongMonacoStreet", "mnCityLong")
        if (newKeyName.indexOf("RallycrossSmallCircuit") === 0) newKeyName = newKeyName.replace("RallycrossSmallCircuit", "rallySmall")
        if (newKeyName.indexOf("0-100-0MPH") === 0) newKeyName = newKeyName.replace("0-100-0MPH", "drag100b")
        if (newKeyName.indexOf("MonacoNarrowStreet") === 0) newKeyName = newKeyName.replace("MonacoNarrowStreet", "mnCityNarrow")
        if (newKeyName.indexOf("Mountain'sRide(Excurtion)") === 0) newKeyName = newKeyName.replace("Mountain'sRide(Excurtion)", "mtTour")
        if (newKeyName.indexOf("CityStreetsSmall") === 0) newKeyName = newKeyName.replace("CityStreetsSmall", "csSmall")
        if (newKeyName.indexOf("MountainSlalom") === 0) newKeyName = newKeyName.replace("MountainSlalom", "mtSlalom")
        if (newKeyName.indexOf("30-130MPH") === 0) newKeyName = newKeyName.replace("30-130MPH", "drag30130")
        if (newKeyName.indexOf("0-150-0MPH") === 0) newKeyName = newKeyName.replace("0-150-0MPH", "drag150b")
        if (newKeyName.indexOf("0-120MPH") === 0) newKeyName = newKeyName.replace("0-120MPH", "drag120")
        if (newKeyName.indexOf("50-150MPH") === 0) newKeyName = newKeyName.replace("50-150MPH", "drag50150")
        if (newKeyName.indexOf("MonacoHairpin") === 0) newKeyName = newKeyName.replace("MonacoHairpin", "mnHairpin")
        if (newKeyName.indexOf("KartingCircuit") === 0) newKeyName = newKeyName.replace("KartingCircuit", "kart")
        if (newKeyName.indexOf("IndoorKarting") === 0) newKeyName = newKeyName.replace("IndoorKarting", "indoorKart")
        if (newKeyName.indexOf("WaterfrontDrag") === 0) newKeyName = newKeyName.replace("WaterfrontDrag", "waterDrag")
        if (newKeyName.indexOf("MonacoStreet") === 0) newKeyName = newKeyName.replace("MonacoStreet", "mnCity")
        if (newKeyName.indexOf("TokyoBridge") === 0) newKeyName = newKeyName.replace("TokyoBridge", "tokyoBridge")
        if (newKeyName.indexOf("0-60MPH") === 0) newKeyName = newKeyName.replace("0-60MPH", "drag60")
        if (newKeyName.indexOf("TwistyMountainRoad") === 0) newKeyName = newKeyName.replace("TwistyMountainRoad", "mtTwisty")
        if (newKeyName.indexOf("ForestRoad") === 0) newKeyName = newKeyName.replace("ForestRoad", "forest")
        if (newKeyName.indexOf("Monaco'sG-Force") === 0) newKeyName = newKeyName.replace("Monaco'sG-Force", "mnGforce")
        if (newKeyName.indexOf("AirfieldDragAndSlalom") === 0) newKeyName = newKeyName.replace("AirfieldDragAndSlalom", "runwayDragSlalom")
        if (newKeyName.indexOf("OceanCityStreet") === 0) newKeyName = newKeyName.replace("OceanCityStreet", "oceanCity")
        if (newKeyName.indexOf("Ocean'sBeachSlalom") === 0) newKeyName = newKeyName.replace("Ocean'sBeachSlalom", "oceanSlalom")
        if (newKeyName.indexOf("TokyoDrag") === 0) newKeyName = newKeyName.replace("TokyoDrag", "tokyoDrag")
        if (newKeyName.indexOf("AirportLoop") === 0) newKeyName = newKeyName.replace("AirportLoop", "runwayLoop")
        if (newKeyName.indexOf("CanyonDirtRoad") === 0) newKeyName = newKeyName.replace("CanyonDirtRoad", "canyonDtRoad")
        if (newKeyName.indexOf("MountainHill") === 0) newKeyName = newKeyName.replace("MountainHill", "mtHill")
        if (newKeyName.indexOf("MountainHairpin") === 0) newKeyName = newKeyName.replace("MountainHairpin", "mtHairpin")
        if (newKeyName.indexOf("ForestSlalom") === 0) newKeyName = newKeyName.replace("ForestSlalom", "forestSlalom")
        if (newKeyName.indexOf("Tokyo'sG-Force") === 0) newKeyName = newKeyName.replace("Tokyo'sG-Force", "tokyoGforce")
        if (newKeyName.indexOf("ForestRiver") === 0) newKeyName = newKeyName.replace("ForestRiver", "forestRiver")
        if (newKeyName.indexOf("Canyon'sMound") === 0) newKeyName = newKeyName.replace("Canyon'sMound", "butte")
        if (newKeyName.indexOf("MountainInclinedRoad") === 0) newKeyName = newKeyName.replace("MountainInclinedRoad", "mtIncline")
        if (newKeyName.indexOf("CanyonTour") === 0) newKeyName = newKeyName.replace("CanyonTour", "canyonTour")
        if (newKeyName.indexOf("OceanParking") === 0) newKeyName = newKeyName.replace("OceanParking", "oceanParking")
        if (newKeyName.indexOf("EightTrack") === 0) newKeyName = newKeyName.replace("EightTrack", "figureEight")
        if (newKeyName.indexOf("AirfieldSlalom") === 0) newKeyName = newKeyName.replace("AirfieldSlalom", "airplaneSlalom")
        if (newKeyName.indexOf("AirfieldWarehouseSlalom") === 0) newKeyName = newKeyName.replace("AirfieldWarehouseSlalom", "airplaneHangars")
        if (newKeyName.indexOf("NorthLoopRelay5") === 0) newKeyName = newKeyName.replace("NorthLoopRelay5", "northloop5")
        if (newKeyName.indexOf("NorthLoopRelay1") === 0) newKeyName = newKeyName.replace("NorthLoopRelay1", "northloop1")
        if (newKeyName.indexOf("NorthLoopRelay2") === 0) newKeyName = newKeyName.replace("NorthLoopRelay2", "northloop2")
        if (newKeyName.indexOf("NorthLoopRelay4") === 0) newKeyName = newKeyName.replace("NorthLoopRelay4", "northloop4")
        if (newKeyName.indexOf("NorthLoopRelay3") === 0) newKeyName = newKeyName.replace("NorthLoopRelay3", "northloop3")
        if (newKeyName.indexOf("NorthLoop") === 0) newKeyName = newKeyName.replace("NorthLoop", "northloop")
        if (newKeyName.indexOf("ShortOceanDrag") === 0) newKeyName = newKeyName.replace("ShortOceanDrag", "oceanShortDrag")
        if (newKeyName.indexOf("AirFieldLDrag") === 0) newKeyName = newKeyName.replace("AirFieldLDrag", "draglshape")
        if (newKeyName.indexOf("Canyon'sPanorama") === 0) newKeyName = newKeyName.replace("Canyon'sPanorama", "canyonLookout")
        if (newKeyName.indexOf("AirFieldDrag") === 0) newKeyName = newKeyName.replace("AirFieldDrag", "runwayDrag")
        if (newKeyName.indexOf("TownSlalom") === 0) newKeyName = newKeyName.replace("TownSlalom", "townSlalom")
        if (newKeyName.indexOf("1\/2KMBumper") === 0) newKeyName = newKeyName.replace("1\/2KMBumper", "speedbump12km")
        if (newKeyName.indexOf("0-170MPH") === 0) newKeyName = newKeyName.replace("0-170MPH", "drag170")
        if (newKeyName.indexOf("TownTour") === 0) newKeyName = newKeyName.replace("TownTour", "townTour")
        if (newKeyName.indexOf("FrozenRiverSlalom") === 0) newKeyName = newKeyName.replace("FrozenRiverSlalom", "frozenRivSla")
        if (newKeyName.indexOf("AirfieldServiceTrack") === 0) newKeyName = newKeyName.replace("AirfieldServiceTrack", "serviceRoads")
        if (newKeyName.indexOf("TownSprint") === 0) newKeyName = newKeyName.replace("TownSprint", "townSprint")
        if (newKeyName.indexOf("1kmBumper") === 0) newKeyName = newKeyName.replace("1kmBumper", "speedbump1km")
        if (newKeyName.indexOf("0-60-0MPH") === 0) newKeyName = newKeyName.replace("0-60-0MPH", "drag60b")
        if (newKeyName.indexOf("100-150MPH") === 0) newKeyName = newKeyName.replace("100-150MPH", "drag100150")
        if (newKeyName.indexOf("SmallRoad") === 0) newKeyName = newKeyName.replace("SmallRoad", "smallRoad")

        if (newKeyName.includes(" ======> NO_MAPPING for Misc (Asphalt\/Dirt) - Rain")) newKeyName = newKeyName.replace(" ======> NO_MAPPING for Misc (Asphalt\/Dirt) - Rain", "41")
        if (newKeyName.includes(" ======> NO_MAPPING for Misc (Asphalt\/Sand) - Rain")) newKeyName = newKeyName.replace(" ======> NO_MAPPING for Misc (Asphalt\/Sand) - Rain", "c1")
        if (newKeyName.includes(" ======> NO_MAPPING for Misc (Snow\/Asphalt)")) newKeyName = newKeyName.replace(" ======> NO_MAPPING for Misc (Snow\/Asphalt)", "d0")
        if (newKeyName.includes(" ======> NO_MAPPING for Misc (Asphalt\/Dirt)")) newKeyName = newKeyName.replace(" ======> NO_MAPPING for Misc (Asphalt\/Dirt)", "40")
        if (newKeyName.includes(" ======> NO_MAPPING for Misc (Sand\/Dirt)")) newKeyName = newKeyName.replace(" ======> NO_MAPPING for Misc (Sand\/Dirt)", "e0")
        if (newKeyName.includes(" ======> NO_MAPPING for Misc (Asphalt\/Gravel)")) newKeyName = newKeyName.replace(" ======> NO_MAPPING for Misc (Asphalt\/Gravel)", "b0")
        if (newKeyName.includes(" ======> NO_MAPPING for Misc (Asphalt\/Sand)")) newKeyName = newKeyName.replace(" ======> NO_MAPPING for Misc (Asphalt\/Sand)", "c0")

        vm.phantomCar.data[tune].times[newKeyName] = vm.phantomCar.data[tune].times[rudeKey].replaceAll(".", ":");
        vm.phantomCar.data[tune].times[newKeyName] = Vue.options.filters.toTimeNumber(vm.phantomCar.data[tune].times[newKeyName], newKeyName);
        delete vm.phantomCar.data[tune].times[rudeKey];

      });
    }
  },
}
</script>

<style>
.MainImportRude_Layout {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  background-color: #000000;
  padding: 20px;
}
.MainImportRude_Body {
  display: flex;
  flex-direction: column;
}
.MainImportRude_Button {
  background-color: rgba(var(--back-color), var(--back-opac));
  padding: 30px;
  color: white;
  font-size: 20px;
}
.MainImportRude_Input {
  padding: 40px 0;
}
#content-target {
  box-shadow: 0px 0px 0px 2px #424242;
  border-radius: 5px;
  min-height: 100px;
  min-width: 100px;
  margin-bottom: 100px;
}
</style>