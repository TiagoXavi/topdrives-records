<template>
  <div :style="`--tv-height: ${height}`" class="TrackViewer_Layout">
    <canvas ref="canvas" class="TrackViewer_Canvas"/>

    <div v-if="showHud && data" class="TrackViewer_Hud">
      <div class="TrackViewer_HudTitle">{{ data.name }}</div>
      <div class="TrackViewer_HudSub">
        {{ data.len }} m
        <span v-if="data.size">&middot; {{ data.size[0] }} &times; {{ data.size[2] }} m</span>
      </div>
    </div>

    <div v-if="showLegend" class="TrackViewer_Legend">
      <div v-if="bumps.length" class="TrackViewer_LegendItem">
        <span>{{ $tc("m_speedBump", 1) }}</span>
        <i class="TrackViewer_LegendDot TrackViewer_LegendDotBump" aria-hidden="true"/>
      </div>
      <div class="TrackViewer_LegendItem">
        <span>{{ $t("m_start") }}</span>
        <i class="TrackViewer_LegendDot TrackViewer_LegendDotStart" aria-hidden="true"/>
      </div>
      <div v-if="data && !data.closed" class="TrackViewer_LegendItem">
        <span>{{ $t("m_finish") }}</span>
        <i class="TrackViewer_LegendDot TrackViewer_LegendDotFinish" aria-hidden="true"/>
      </div>
    </div>

    <div v-if="showBumps && bumps.length" class="TrackViewer_Bumps">
      <div class="TrackViewer_BumpsTitle">
        <i aria-hidden="true" class="tdicon-clearance TrackViewer_BumpIcon" >
          <span class="path1"/>
          <span class="path2"/>
          <span class="path3"/>
        </i>
        <span>{{ bumps.length }} - </span>
        <span class="MainTracks_InfoBump">{{ severityText(bumps[0].s) }}</span>
      </div>
    </div>

    <div v-if="error" class="TrackViewer_Error">{{ error }}</div>
  </div>
</template>

<script>
/*
 * 3D track viewer for the "track3d" JSON produced by spline_to_3d.py.
 *
 *   <TrackViewer :track="trackJson" height="340px" />
 *   <TrackViewer trackCode="damExtended_a41" />
 *   <TrackViewer src="/splines/MountainDamExtended.track.json" />
 *
 * `track` is the compact JSON. Pass it directly, give `trackCode` and the spline is
 * looked up and fetched, or give `src` for an explicit url. The canvas only animates
 * while it is on screen and the tab is visible, so several of these on a page stay cheap.
 *
 * The renderer below used to be a separate track-renderer.js; it is inlined so the
 * component ships as one file with no dependency to keep in step. Canvas 2D only (no
 * three.js, no WebGL): a track is a few hundred points, so a hand-rolled projection is
 * both smaller to ship and cheaper to run than a scene graph. It is plain ES5 by design
 * and deliberately left that way -- it is a self-contained bit of maths, not app code.
 */


import splineDict from '../database/tracks_detail.json';

// const splineDict = {
//   "drag100_a00": "InfiniteKDrag",
//   "drag100_a10": "InfiniteKDrag",
//   "drag100_a20": "InfiniteKDrag",
//   "drag100_a01": "InfiniteKDrag",
//   "drag100b_a00": "InfiniteKDrag",
//   "drag100b_a10": "InfiniteKDrag",
//   "drag100b_a01": "InfiniteKDrag",
//   "drag120_a00": "InfiniteKDrag",
//   "drag120_a20": "InfiniteKDrag",
//   "drag150_a00": "InfiniteKDrag",
//   "drag150_a10": "InfiniteKDrag",
//   "drag150_a01": "InfiniteKDrag",
//   "drag150b_a00": "InfiniteKDrag",
//   "drag170_a00": "InfiniteKDrag",
//   "drag200_a00": "InfiniteKDrag",
//   "drag60_a20": "InfiniteKDrag",
//   "drag60_a50": "InfiniteKDrag",
//   "drag60_a01": "InfiniteKDrag",
//   "drag60b_a20": "InfiniteKDrag",
//   "mile1_a00": "OneMDrag",
//   "mile1_a10": "OneMDrag",
//   "mile1_a20": "OneMDrag",
//   "mile1r_a00": "OneMDrag",
//   "mile1_a50": "OneMDrag",
//   "mile1_a60": "OneMDrag",
//   "mile1_a01": "OneMDrag",
//   "mile2_a00": "HalfMDrag",
//   "mile2_a20": "HalfMDrag",
//   "mile2_a11": "HalfMDrag",
//   "mile2_a50": "HalfMDrag",
//   "mile2_a60": "HalfMDrag",
//   "mile2_a01": "HalfMDrag",
//   "mile4_a00": "QuarterMDrag",
//   "mile4_a20": "QuarterMDrag",
//   "mile4_a30": "QuarterMDrag",
//   "mile4_a11": "QuarterMDrag",
//   "mile4r_a00": "QuarterMDrag",
//   "mile4_a50": "QuarterMDrag",
//   "mile4_a60": "QuarterMDrag",
//   "mile4_a01": "QuarterMDrag",
//   "drag100150_a00": "InfiniteKDrag",
//   "drag30130_a00": "InfiniteKDrag",
//   "drag50150_a00": "InfiniteKDrag",
//   "drag75125_a00": "InfiniteKDrag",
//   "testBowl_a10": "TestCentreHighSpeedBowl",
//   "testBowlr_a20": "TestCentreHighSpeedBowl",
//   "testBowlr_a00": "TestCentreHighSpeedBowl",
//   "testBowlr_a60": "TestCentreHighSpeedBowl",
//   "testBowl_a00": "TestCentreHighSpeedBowl",
//   "testBowlr_a01": "TestCentreHighSpeedBowl",
//   "carPark_a00": "SpiralCarRamp",
//   "carPark_a01": "SpiralCarRamp",
//   "csMed_a00": "CityStreetsMed",
//   "csMed_a60": "CityStreetsMed",
//   "csMed_a01": "CityStreetsMed",
//   "csSmall_a00": "CityStreetsSmall",
//   "csSmall_a50": "CityStreetsSmall",
//   "csSmall_a60": "CityStreetsSmall",
//   "csSmall_a01": "CityStreetsSmall",
//   "fastr_a00": "FastCircuit",
//   "fast_a00": "FastCircuit",
//   "fast_a01": "FastCircuit",
//   "frozenLake_ad0": "FrozenLake",
//   "gForce_a00": "TestCentreGForce",
//   "gForce_a10": "TestCentreGForce",
//   "gForce_a20": "TestCentreGForce",
//   "gForce_a30": "TestCentreGForce",
//   "gForce_a11": "TestCentreGForce",
//   "gForcer_a00": "TestCentreGForce",
//   "gForce_a50": "TestCentreGForce",
//   "gForce_a60": "TestCentreGForce",
//   "gForce_a01": "TestCentreGForce",
//   "hairpin_a00": "SanFranHairpins",
//   "hairpin_a10": "SanFranHairpins",
//   "hairpin_a20": "SanFranHairpins",
//   "hairpin_a50": "SanFranHairpins",
//   "hairpin_a60": "SanFranHairpins",
//   "hairpin_a01": "SanFranHairpins",
//   "hClimb_a00": "HillClimb",
//   "hClimb_a10": "HillClimb",
//   "hClimbr_a10": "HillClimb",
//   "hClimb_a20": "HillClimb",
//   "hClimb_a11": "HillClimb",
//   "hClimb_a50": "SandDuneClimb",
//   "hClimb_a60": "HillClimb",
//   "indoorKart_a00": "IndoorKarting",
//   "kart_a00": "GoKart",
//   "kart_a01": "GoKart",
//   "moto_a10": "MotoCross",
//   "moto_a11": "MotoCross",
//   "rallyMed_a40": "RallycrossMed",
//   "rallySmall_a40": "RallycrossSmall",
//   "tRoad_a10": "RallyCircuit",
//   "tRoad_a20": "RallyCircuit",
//   "tRoad_a30": "RallyCircuit",
//   "tRoad_a11": "RallyCircuit",
//   "tRoad_a50": "RallyCircuit",
//   "tRoad_a60": "RallyCircuit",
//   "tRoad_a00": "RallyCircuit",
//   "tRoad_a01": "RallyCircuit",
//   "slalom_a00": "TestCentreSlalom",
//   "slalom_a10": "TestCentreSlalom",
//   "slalom_a20": "TestCentreSlalom",
//   "slalom_a30": "TestCentreSlalom",
//   "slalom_a11": "TestCentreSlalom",
//   "slalomr_a00": "TestCentreSlalom",
//   "slalom_a50": "TestCentreSlalom",
//   "slalom_a60": "TestCentreSlalom",
//   "slalom_a01": "TestCentreSlalom",
//   "tCircuit_a10": "TwistyCircuit",
//   "tCircuitr_a00": "TwistyCircuit",
//   "tCircuit_a60": "TwistyCircuit",
//   "tCircuit_a00": "TwistyCircuit",
//   "tCircuit_a01": "TwistyCircuit",
//   "rallyMed_a41": "RallycrossMed",
//   "rallySmall_a41": "RallycrossSmall",
//   "waterDrag_a00": "HarbourWaterfront",
//   "mnCity_a00": "HarbourBackAlley1",
//   "mnCityNarrow_a00": "HarbourBackAlley2",
//   "mnHairpin_a00": "HarbourDownhill1",
//   "mnHairpin_a40": "HarbourDownhill2",
//   "mnCityLong_a00": "HarbourCasino",
//   "canyonTour_a00": "CanyonLapAsphalt",
//   "dtRoad_a40": "CanyonLapDirt",
//   "lookout_a10": "CanyonLookout",
//   "butte_a40": "CanyonButte",
//   "mnGforce_a00": "HarbourGForce",
//   "waterDrag_a01": "HarbourWaterfront",
//   "mnCity_a01": "HarbourBackAlley1",
//   "mnCityNarrow_a01": "HarbourBackAlley2",
//   "mnHairpin_a01": "HarbourDownhill1",
//   "mnHairpin_a41": "HarbourDownhill2",
//   "mnCityLong_a01": "HarbourCasino",
//   "mnGforce_a01": "HarbourGForce",
//   "tokyoBridge_a01": "TokyoBridge",
//   "tokyoGforce_a01": "TokyoCrossing",
//   "tokyoDrag_a01": "TokyoDrag",
//   "tokyoOverpass_a01": "TokyoElevated",
//   "tokyoLoop_a01": "TokyoLoop",
//   "tokyoOffRamp_a01": "TokyoOffRamp",
//   "tokyoBridge_a00": "TokyoBridge",
//   "tokyoGforce_a00": "TokyoCrossing",
//   "tokyoDrag_a00": "TokyoDrag",
//   "tokyoOverpass_a00": "TokyoElevated",
//   "tokyoLoop_a00": "TokyoLoop",
//   "tokyoOffRamp_a00": "TokyoOffRamp",
//   "canyonTour_a01": "CanyonLapAsphalt",
//   "canyonDtRoad_a41": "CanyonLapDirt",
//   "canyonLookout_a11": "CanyonLookout",
//   "canyonButte_a41": "CanyonButte",
//   "canyonTour_a50": "CanyonLapAsphalt",
//   "canyonDtRoad_ae0": "CanyonLapDirt",
//   "canyonLookout_a50": "CanyonLookout",
//   "canyonButte_ae0": "CanyonButte",
//   "forest_a00": "BavarianForestAsphalt",
//   "forestSlalom_a10": "BavarianForestSlalom",
//   "forest_a60": "BavarianForestAsphalt",
//   "forest_a30": "BavarianForestAsphalt",
//   "forest_a01": "BavarianForestAsphalt",
//   "forestSlalom_a11": "BavarianForestSlalom",
//   "forestSlalom_a70": "BavarianForestSlalom",
//   "forestSlalom_a71": "BavarianForestSlalom",
//   "forestSlalom_a20": "BavarianForestSlalom",
//   "forestSlalom_a30": "BavarianForestSlalom",
//   "forest_a11": "BavarianForestAsphalt",
//   "forestRiver_a40": "BavarianForestDirt",
//   "oceanHighway_a00": "BeachCityCarpark",
//   "oceanParking_a00": "BeachCityCarparkSmall",
//   "oceanCity_a00": "BeachCityCarwash",
//   "oceanLongDrag_a00": "BeachCityDragRace",
//   "oceanShortDrag_a00": "BeachCityPierDrag",
//   "oceanSlalom_ac0": "BeachCityWideSlalom",
//   "oceanHighway_a01": "BeachCityCarpark",
//   "oceanParking_a01": "BeachCityCarparkSmall",
//   "oceanCity_a01": "BeachCityCarwash",
//   "oceanLongDrag_a01": "BeachCityDragRace",
//   "oceanShortDrag_a01": "BeachCityPierDrag",
//   "oceanSlalom_ac1": "BeachCityWideSlalom",
//   "forestRiver_a41": "BavarianForestDirt",
//   "forestRiver_ab0": "BavarianForestDirt",
//   "mtTour_a00": "MountainTour",
//   "mtTwisty_a00": "MountainTwisty",
//   "mtSlalom_a00": "MountainBoulderSlalom",
//   "mtHairpin_a00": "MountainHairpin",
//   "mtHill_a00": "MountainClimb",
//   "mtIncline_a00": "MountainHillClimb",
//   "mtTour_a01": "MountainTour",
//   "mtTwisty_a01": "MountainTwisty",
//   "mtSlalom_a01": "MountainBoulderSlalom",
//   "mtHairpin_a01": "MountainHairpin",
//   "mtHill_a01": "MountainClimb",
//   "mtIncline_a01": "MountainHillClimb",
//   "mtTour_a60": "MountainTour",
//   "mtTwisty_a60": "MountainTwisty",
//   "mtSlalom_a60": "MountainBoulderSlalom",
//   "mtHairpin_a60": "MountainHairpin",
//   "mtHill_a60": "MountainClimb",
//   "mtIncline_a60": "MountainHillClimb",
//   "mtTwisty_a10": "MountainTwisty",
//   "mtSlalom_a10": "MountainBoulderSlalom",
//   "mtHairpin_a10": "MountainHairpin",
//   "mtTour_a11": "MountainTour",
//   "mtTwisty_a11": "MountainTwisty",
//   "mtSlalom_a11": "MountainBoulderSlalom",
//   "mtHairpin_a11": "MountainHairpin",
//   "mtHill_a11": "MountainClimb",
//   "mtIncline_a11": "MountainHillClimb",
//   "northloop_a00": "NurburgringNorth",
//   "northloop1_a00": "NurburgringRelay1",
//   "northloop2_a00": "NurburgringRelay2",
//   "northloop3_a00": "NurburgringRelay3",
//   "northloop4_a00": "NurburgringRelay4",
//   "northloop5_a00": "NurburgringRelay5",
//   "northloop_a01": "NurburgringNorth",
//   "northloop1": "NurburgringRelay1",
//   "northloop2": "NurburgringRelay2",
//   "northloop3_a01": "NurburgringRelay3",
//   "northloop4_a01": "NurburgringRelay4",
//   "northloop5_a01": "NurburgringRelay5",
//   "northloop_a60": "NurburgringNorth",
//   "northloop1_a60": "NurburgringRelay1",
//   "northloop2_a60": "NurburgringRelay2",
//   "northloop3_a60": "NurburgringRelay3",
//   "northloop4_a60": "NurburgringRelay4",
//   "northloop5_a60": "NurburgringRelay5",
//   "townTour_a00": "CotswoldsTourAll",
//   "townTour_a01": "CotswoldsTourAll",
//   "townTour_a60": "CotswoldsTourAll",
//   "townSlalom_a00": "CotswoldsSlalomAll",
//   "townSlalom_a01": "CotswoldsSlalomAll",
//   "townSlalom_a60": "CotswoldsSlalomAll",
//   "fieldSlalom_a70": "CotswoldsSlalomAutumn",
//   "frozenRivSla_a30": "CotswoldsSlalomWinter",
//   "townSprint_a00": "CotswoldsTourSummer",
//   "townSprint_a01": "CotswoldsTourSummer",
//   "cross_af0": "CotswoldsTourAutumn",
//   "riverSprint_ag0": "CotswoldsTourWinter",
//   "fieldSlalom_af0": "CotswoldsSlalomSpring",
//   "figureEight_a01": "FacilityFoEB",
//   "figureEight_ac0": "FacilityFoEB",
//   "figureEight_ad0": "FacilityFoEB",
//   "figureEight_ab0": "FacilityFoEB",
//   "speedbump14km_a00": "FacilityQuarterK",
//   "speedbump14km_a01": "FacilityQuarterK",
//   "speedbump12km_a00": "FacilityHalfK",
//   "speedbump12km_a01": "FacilityHalfK",
//   "speedbump12km_a20": "FacilityHalfK",
//   "speedbump12km_a60": "FacilityHalfK",
//   "speedbump1km_a00": "FacilityOneK",
//   "speedbump1km_a01": "FacilityOneK",
//   "speedbump1km_a20": "FacilityOneK",
//   "speedbump1km_a60": "FacilityOneK",
//   "drag60_a00": "InfiniteKDrag",
//   "drag62_a00": "InfiniteKDrag",
//   "runwayDrag_a00": "AirFieldStraightDrag",
//   "runwayDrag_a01": "AirFieldStraightDrag",
//   "draglshape_a00": "AirFieldDragCorner",
//   "draglshape_a01": "AirFieldDragCorner",
//   "runwayDragSlalom_a00": "AirFieldDragSlalom",
//   "runwayDragSlalom_a01": "AirFieldDragSlalom",
//   "airplaneSlalom_a10": "AirFieldSlalom",
//   "airplaneSlalom_a11": "AirFieldSlalom",
//   "airplaneHangars_a00": "AirFieldHangers",
//   "airplaneHangars_a01": "AirFieldHangers",
//   "serviceRoads_a00": "AirFieldServiceRoads",
//   "serviceRoads_a01": "AirFieldServiceRoads",
//   "runwayLoop_a00": "AirFieldLoop",
//   "runwayLoop_a01": "AirFieldLoop",
//   "smallRoad": "AirFieldTarmacDirt",
//   "smallRoad_a41": "AirFieldTarmacDirt",
//   "mixedDrag_a40": "AirFieldDragDirtTarmac",
//   "mixedDrag_a41": "AirFieldDragDirtTarmac",
//   "drag75125_a01": "InfiniteKDrag",
//   "testBowl_a01": "TestCentreHighSpeedBowl",
//   "fastr_a01": "FastCircuit",
//   "tCircuitr_a01": "TwistyCircuit",
//   "drag124_a00": "InfiniteKDrag",
//   "lumberTwisty_a40": "PacificNorthWestCircuit",
//   "lumberForest_a40": "PacificNorthWestForest",
//   "lumberRiver_a10": "PacificNorthWestRiver",
//   "lumberTwisty_a41": "PacificNorthWestCircuit",
//   "lumberForest_a41": "PacificNorthWestForest",
//   "lumberRiver_a11": "PacificNorthWestRiver",
//   "lumberTwisty_ah1": "PacificNorthWestCircuit",
//   "lumberForest_ah1": "PacificNorthWestForest",
//   "laguna_a00": "LagunaSeca_Variant",
//   "laguna_a01": "LagunaSeca_Variant",
//   "desertRallyDirt_a40": "DesertRally_Challenge4",
//   "desertHill_a40": "DesertRally_Challenge3",
//   "desertSmall_a40": "DesertRally_Challenge2",
//   "desertBig_a40": "DesertRally_Challenge1",
//   "desertRallyDirt_a41": "DesertRally_Challenge4",
//   "desertHill_a41": "DesertRally_Challenge3",
//   "desertSmall_a41": "DesertRally_Challenge2",
//   "desertBig_a41": "DesertRally_Challenge1",
//   "dockCirc_a00": "DockyardCircuit",
//   "dockAltCirc_ac0": "DockyardCircuitAlt",
//   "dockKart_a00": "DockyardKarting",
//   "dockUdrag_a00": "DockyardUDrag",
//   "dockGforceDrag_a00": "DockyardGforce",
//   "dockCirc_a01": "DockyardCircuit",
//   "dockAltCirc_ac1": "DockyardCircuitAlt",
//   "dockKart_a01": "DockyardKarting",
//   "dockUdrag_a01": "DockyardUDrag",
//   "dockGforceDrag_a01": "DockyardGforce",
//   "dockCity_a00": "DockyardCircuitBump",
//   "dockCity_a01": "DockyardCircuitBump",
//   "dealsGap_a00": "TailOfTheDragonFull",
//   "dealsGapBack_a40": "TailOfTheDragonBackroadLoop",
//   "dealsGap1_a00": "TailOfTheDragon1",
//   "dealsGap2_a00": "TailOfTheDragon2",
//   "dealsGap3_a00": "TailOfTheDragon3",
//   "dealsGap4_a00": "TailOfTheDragon4",
//   "dealsGap5_a00": "TailOfTheDragon5",
//   "dealsGap_a01": "TailOfTheDragonFull",
//   "dealsGapBack_a41": "TailOfTheDragonBackroadLoop",
//   "dealsGap1_a01": "TailOfTheDragon1",
//   "dealsGap2_a01": "TailOfTheDragon2",
//   "dealsGap3_a01": "TailOfTheDragon3",
//   "dealsGap4_a01": "TailOfTheDragon4",
//   "dealsGap5_a01": "TailOfTheDragon5",
//   "nwCircuit_a00": "ManhattanCircuit",
//   "nwCircuit_a01": "ManhattanCircuit",
//   "nwCircuit_a60": "ManhattanCircuit",
//   "nwTour_a00": "ManhattanCentralParkTour",
//   "nwTour_a01": "ManhattanCentralParkTour",
//   "nwTour_a60": "ManhattanCentralParkTour",
//   "nwCathedral_a00": "ManhattanCathedral",
//   "nwCathedral_a01": "ManhattanCathedral",
//   "nwCathedral_a60": "ManhattanCathedral",
//   "nwSlalom_a00": "ManhattanTrainSlalom",
//   "nwSlalom_a01": "ManhattanTrainSlalom",
//   "nwSlalom_a60": "ManhattanTrainSlalom",
//   "nwLoop_a00": "ManhattanTimesSquareLoop",
//   "nwLoop_a01": "ManhattanTimesSquareLoop",
//   "nwLoop_a60": "ManhattanTimesSquareLoop",
//   "nwDrag_a00": "ManhattanTimesSquareDrag",
//   "nwDrag_a01": "ManhattanTimesSquareDrag",
//   "nwDrag_a60": "ManhattanTimesSquareDrag",
//   "nwGforce_a00": "ManhattanGForce",
//   "nwGforce_a01": "ManhattanGForce",
//   "nwGforce_a60": "ManhattanGForce",
//   "miBeachDrag_a50": "MiamiBeach",
//   "miBridge_a00": "MiamiBridge",
//   "miCause_a00": "MiamiCauseway",
//   "miCircuit_a00": "MiamiCircuit",
//   "miUdrag_ac0": "MiamiDragUTurn",
//   "miFigure_a50": "MiamiFigureEight",
//   "miGforce_a00": "MiamiGForce",
//   "miSlalom_a00": "MiamiSlalom",
//   "miStreets1_a00": "MiamiStreetsLong",
//   "miStreets2_a00": "MiamiStreetsShort",
//   "miCauseDrag_a00": "MiamiCausewayDrag",
//   "miBeachDrag": "MiamiBeach",
//   "miBridge_a01": "MiamiBridge",
//   "miCause_a01": "MiamiCauseway",
//   "miCircuit_a01": "MiamiCircuit",
//   "miUdrag_ac1": "MiamiDragUTurn",
//   "miFigure": "MiamiFigureEight",
//   "miGforce_a01": "MiamiGForce",
//   "miSlalom_a01": "MiamiSlalom",
//   "miStreets1_a01": "MiamiStreetsLong",
//   "miStreets2_a01": "MiamiStreetsShort",
//   "miCauseDrag_a01": "MiamiCausewayDrag",
//   "mileOne50_aj0": "OneMDrag50-50",
//   "mileOne60_aj0": "OneMDrag60-40",
//   "tCircuit50_aj0": "TwistyCircuit50-50",
//   "tCircuit60_aj0": "TwistyCircuit60-40",
//   "tCircuit70_aj0": "TwistyCircuit70-30",
//   "fast60_aj0": "FastCircuit60-40",
//   "fastZ50_aA1": "FastCircuitDryToWet50-50",
//   "fastZ50_aB1": "FastCircuitWetToDry50-50",
//   "fastZ50_aC0": "FastCircuitDryToSand50-50",
//   "fastZ50_aE0": "FastCircuitDryToDirt50-50",
//   "tRoadZ50": "RallyCircuitDryToWet50-50",
//   "tRoadZ50_aB1": "RallyCircuitWetToDry50-50",
//   "tRoadZ50_aC0": "RallyCircuitDryToSand50-50",
//   "tRoadZ50_aE0": "RallyCircuitDryToDirt50-50",
//   "mile1Z50_aA1": "OneMDragDryToWet50-50",
//   "mile1Z50_aB1": "OneMDragWetToDry50-50",
//   "mile1Z50_aC0": "OneMDragDryToSand50-50",
//   "mile1Z50_aE0": "OneMDragDryToDirt50-50",
//   "mile2Z50_aA1": "HalfMDragDryToWet50-50",
//   "mile2Z50_aB1": "HalfMDragWetToDry50-50",
//   "mile2Z50_aC0": "HalfMDragDryToSand50-50",
//   "mile2Z50_aE0": "HalfMDragDryToDirt50-50",
//   "csMedZ50_aA1": "CityStreetsMedDryToWet50-50",
//   "csMedZ50_aE0": "CityStreetsMedDryToDirt50-50",
//   "csMedZ50_aC0": "CityStreetsMedDryToSand50-50",
//   "csMedZ50_aB1": "CityStreetsMedWetToDry50-50",
//   "csSmallZ50_aA1": "CityStreetsSmallDryToWet50-50",
//   "csSmallZ50_aE0": "CityStreetsSmallDryToDirt50-50",
//   "csSmallZ50_aC0": "CityStreetsSmallDryToSand50-50",
//   "csSmallZ50_aB1": "CityStreetsSmallWetToDry50-50",
//   "tCircuitZ50_aA1": "TwistyCircuitDryToWet50-50",
//   "tCircuitZ50_aE0": "TwistyCircuitDryToDirt50-50",
//   "tCircuitZ50_aC0": "TwistyCircuitDryToSand50-50",
//   "tCircuitZ50_aB1": "TwistyCircuitWetToDry50-50",
//   "kartZ50_aA1": "GoKartDryToWet50-50",
//   "kartZ50_aE0": "GoKartDryToDirt50-50",
//   "kartZ50_aC0": "GoKartDryToSand50-50",
//   "kartZ50_aB1": "GoKartWetToDry50-50",
//   "mtTourZ50_aA1": "MountainTourDryToWet50-50",
//   "mtTourZ50_aB1": "MountainTourWetToDry50-50",
//   "mtTourZ50_aC0": "MountainTourDryToSand50-50",
//   "mtTourZ50_aE0": "MountainTourDryToDirt50-50",
//   "mtTwistyZ50_aA1": "MountainTwistyDryToWet50-50",
//   "mtTwistyZ50_aB1": "MountainTwistyWetToDry50-50",
//   "mtTwistyZ50_aC0": "MountainTwistyDryToSand50-50",
//   "mtTwistyZ50_aE0": "MountainTwistyDryToDirt50-50",
//   "mtSlalomZ50_aA1": "MountainBoulderSlalomDryToWet50-50",
//   "mtSlalomZ50_aB1": "MountainBoulderSlalomWetToDry50-50",
//   "mtSlalomZ50_aC0": "MountainBoulderSlalomDryToSand50-50",
//   "mtSlalomZ50_aE0": "MountainBoulderSlalomDryToDirt50-50",
//   "mtHairpinZ50_aA1": "MountainHairpinDryToWet50-50",
//   "mtHairpinZ50_aB1": "MountainHairpinWetToDry50-50",
//   "mtHairpinZ50_aC0": "MountainHairpinDryToSand50-50",
//   "mtHairpinZ50_aE0": "MountainHairpinDryToDirt50-50",
//   "mtInclineZ50_aA1": "MountainHillClimbDryToWet50-50",
//   "mtInclineZ50_aB1": "MountainHillClimbWetToDry50-50",
//   "mtInclineZ50_aC0": "MountainHillClimbDryToSand50-50",
//   "mtInclineZ50_aE0": "MountainHillClimbDryToDirt50-50",
//   "mtHillZ50_aA1": "MountainClimbDryToWet50-50",
//   "mtHillZ50_aB1": "MountainClimbWetToDry50-50",
//   "mtHillZ50_aC0": "MountainClimbDryToSand50-50",
//   "mtHillZ50_aE0": "MountainClimbDryToDirt50-50",
//   "oceanHighwayZ50_aA1": "BeachCityCarparkDryToWet50-50",
//   "oceanHighwayZ50_aB1": "BeachCityCarparkWetToDry50-50",
//   "oceanHighwayZ50_aC0": "BeachCityCarparkDryToSand50-50",
//   "oceanHighwayZ50_aE0": "BeachCityCarparkDryToDirt50-50",
//   "oceanCityZ50_aA1": "BeachCityCarwashDryToWet50-50",
//   "oceanCityZ50_aB1": "BeachCityCarwashWetToDry50-50",
//   "oceanCityZ50_aC0": "BeachCityCarwashDryToSand50-50",
//   "oceanCityZ50_aE0": "BeachCityCarwashDryToDirt50-50",
//   "oceanParkingZ50_aA1": "BeachCityCarparkSmallDryToWet50-50",
//   "oceanParkingZ50_aB1": "BeachCityCarparkSmallWetToDry50-50",
//   "oceanParkingZ50_aC0": "BeachCityCarparkSmallDryToSand50-50",
//   "oceanParkingZ50_aE0": "BeachCityCarparkSmallDryToDirt50-50",
//   "tokyoBridgeZ50_aA1": "TokyoBridgeDryToWet50-50",
//   "tokyoBridgeZ50_aB1": "TokyoBridgeWetToDry50-50",
//   "tokyoGforceZ50_aA1": "TokyoCrossingDryToWet50-50",
//   "tokyoGforceZ50_aB1": "TokyoCrossingWetToDry50-50",
//   "tokyoOverpassZ50_aA1": "TokyoElevatedDryToWet50-50",
//   "tokyoOverpassZ50_aB1": "TokyoElevatedWetToDry50-50",
//   "tokyoLoopZ50_aA1": "TokyoLoopDryToWet50-50",
//   "tokyoLoopZ50_aB1": "TokyoLoopWetToDry50-50",
//   "tokyoOffRampZ50_aA1": "TokyoOffRampDryToWet50-50",
//   "tokyoOffRampZ50_aB1": "TokyoOffRampWetToDry50-50",
//   "fastZ50_aD0": "FastCircuitDryToSnow50-50",
//   "tRoadZ50_aD0": "RallyCircuitDryToSnow50-50",
//   "mile1Z50_aD0": "OneMDragDryToSnow50-50",
//   "mile2Z50_aD0": "HalfMDragDryToSnow50-50",
//   "csMedZ50_aD0": "CityStreetsMedDryToSnow50-50",
//   "csSmallZ50_aD0": "CityStreetsSmallDryToSnow50-50",
//   "tCircuitZ50_aD0": "TwistyCircuitDryToSnow50-50",
//   "kartZ50_aD0": "GoKartDryToSnow50-50",
//   "mtTourZ50": "MountainTourDryToSnow50-50",
//   "mtTwistyZ50_aD0": "MountainTwistyDryToSnow50-50",
//   "mtSlalomZ50_aD0": "MountainBoulderSlalomDryToSnow50-50",
//   "mtHairpinZ50_aD0": "MountainHairpinDryToSnow50-50",
//   "mtInclineZ50_aD0": "MountainHillClimbDryToSnow50-50",
//   "mtHillZ50": "MountainClimbDryToSnow50-50",
//   "tokyoBridgeZ50_aD0": "TokyoBridgeDryToSnow50-50",
//   "tokyoGforceZ50_aD0": "TokyoCrossingDryToSnow50-50",
//   "tokyoOverpassZ50_aD0": "TokyoElevatedDryToSnow50-50",
//   "tokyoLoopZ50_aD0": "TokyoLoopDryToSnow50-50",
//   "tokyoOffRampZ50_aD0": "TokyoOffRampDryToSnow50-50",
//   "jpDrag_a00": "JapanParkDrag",
//   "jpGforce_a00": "JapanParkGForce",
//   "jpCircuit_a00": "JapanParkCircuit",
//   "rosRoute1_a00": "TracksAndLaps1",
//   "rosRoute2_a00": "TracksAndLaps2",
//   "rosRoute3_a00": "TracksAndLaps3",
//   "rosRoute4_a40": "TracksAndLaps4",
//   "rosRoute5_a10": "TracksAndLaps5",
//   "rosRoute6_a40": "TracksAndLaps6",
//   "rosRoute7_a40": "TracksAndLaps7",
//   "rosDrag_a00": "TracksAndLapsDrag",
//   "rosSlalom_a00": "TracksAndLapsSlalom",
//   "valTour_a40": "OffroadAdmireTheView",
//   "valRun_a40": "OffroadCrossValley",
//   "valCross_am0": "OffroadEasyRide",
//   "valSlalom_ak0": "OffroadFordTheRiver",
//   "valHairpin_ak0": "OffroadHairpinHillClimb",
//   "valSwitchback_am0": "OffroadHairpinSwitchback",
//   "valOff_ak0": "OffroadOffPiste",
//   "valDown_am0": "OffroadRoadToDirt",
//   "maliAll_ai0": "CliffCoastAllTheWayDown",
//   "maliCave_ai0": "CliffCoastCaveDriving",
//   "maliObserv_a00": "CliffCoastCliffRoadToObservatory",
//   "maliTour_a50": "CliffCoastGrandBeachTour",
//   "maliHairpin_ae0": "CliffCoastHairpinMadness",
//   "maliLong_ai0": "CliffCoastLongBeach",
//   "maliUp_ai0": "CliffCoastSTrackToBeachUphill",
//   "maliTcircuit_ai0": "CliffCoastTwistyCircuit",
//   "maliFast_a50": "CliffCoastFastCircuit",
//   "mojAround_a00": "DesertTownAroundTown",
//   "mojOver_a00": "DesertTownBridgeToInfinity",
//   "mojCross_a40": "DesertTownCrossTownTraffic",
//   "mojFreeway_a00": "DesertTownFreewayTownAndOut",
//   "mojExtended_a40": "DesertTownLoveULongTown",
//   "mojSmall_a40": "DesertTownSmallTown",
//   "mojSmallDesert_a40": "DesertTownSmallTownDesert",
//   "mojCenter_a00": "DesertTownThroughTownTraffic",
//   "mojCircuit_a00": "DesertTownCircuit",
//   "mojMile2_a00": "DesertTownHalfMileDrag",
//   "mojMile2Bump_a00": "DesertTownHalfMileDragSpeedBump",
//   "mojMile4_a00": "DesertTownQuarterMileDrag",
//   "mojSlalom_a00": "DesertTownSlalom",
//   "palFinish_ac0": "BeachTownBeachFinish",
//   "palUDrag_a50": "BeachTownBeachUTurn",
//   "palCliff_a40": "BeachTownCliffEdge",
//   "palCross_a00": "BeachTownCrossTown",
//   "palExtended_ai0": "BeachTownMainRoadTour",
//   "palside_ae0": "BeachTownNewTown",
//   "palside2_ae0": "BeachTownRiverToBeach",
//   "palExtended2_ai0": "BeachTownTownTourLong",
//   "palCircuit_a40": "BeachTownCircuit",
//   "damValley_a40": "MountainDamValleyRun",
//   "damRun_a40": "MountainDamDamToLand",
//   "damTwisty_a40": "MountainDamTurnToDust",
//   "damView_a40": "MountainDamDamViewPlatform",
//   "damTwisty2_a40": "MountainDamTinyMountainTown",
//   "damRally_a40": "MountainDamRaceAcrossDam",
//   "damExtended_a40": "MountainDamExtended",
//   "rosRoute1_a01": "TracksAndLaps1",
//   "rosRoute2_a01": "TracksAndLaps2",
//   "rosRoute3_a01": "TracksAndLaps3",
//   "rosRoute4_a41": "TracksAndLaps4",
//   "rosRoute5_a11": "TracksAndLaps5",
//   "rosRoute6_a41": "TracksAndLaps6",
//   "rosRoute7_a41": "TracksAndLaps7",
//   "rosDrag_a01": "TracksAndLapsDrag",
//   "rosSlalom_a01": "TracksAndLapsSlalom",
//   "valTour_a41": "OffroadAdmireTheView",
//   "valRun_a41": "OffroadCrossValley",
//   "valCross_am1": "OffroadEasyRide",
//   "valSlalom_ak1": "OffroadFordTheRiver",
//   "valHairpin_ak1": "OffroadHairpinHillClimb",
//   "valSwitchback_am1": "OffroadHairpinSwitchback",
//   "valOff_ak1": "OffroadOffPiste",
//   "valDown_am1": "OffroadRoadToDirt",
//   "maliAll_ai1": "CliffCoastAllTheWayDown",
//   "maliCave_ai1": "CliffCoastCaveDriving",
//   "maliObserv_a01": "CliffCoastCliffRoadToObservatory",
//   "maliTour_a50": "CliffCoastGrandBeachTour",
//   "maliHairpin_ae1": "CliffCoastHairpinMadness",
//   "maliLong_ai1": "CliffCoastLongBeach",
//   "maliUp_ai1": "CliffCoastSTrackToBeachUphill",
//   "maliTcircuit_ai1": "CliffCoastTwistyCircuit",
//   "maliFast_a50": "CliffCoastFastCircuit",
//   "mojAround_a01": "DesertTownAroundTown",
//   "mojOver_a01": "DesertTownBridgeToInfinity",
//   "mojCross_a41": "DesertTownCrossTownTraffic",
//   "mojFreeway_a01": "DesertTownFreewayTownAndOut",
//   "mojExtended_a41": "DesertTownLoveULongTown",
//   "mojSmall_a41": "DesertTownSmallTown",
//   "mojSmallDesert_a41": "DesertTownSmallTownDesert",
//   "mojCenter_a01": "DesertTownThroughTownTraffic",
//   "mojCircuit_a01": "DesertTownCircuit",
//   "mojMile2_a01": "DesertTownHalfMileDrag",
//   "mojMile2Bump_a01": "DesertTownHalfMileDragSpeedBump",
//   "mojMile4_a01": "DesertTownQuarterMileDrag",
//   "mojSlalom_a01": "DesertTownSlalom",
//   "palFinish_ac1": "BeachTownBeachFinish",
//   "palUDrag_a50": "BeachTownBeachUTurn",
//   "palCliff_a41": "BeachTownCliffEdge",
//   "palCross_a01": "BeachTownCrossTown",
//   "palExtended_ai1": "BeachTownMainRoadTour",
//   "palside_ae1": "BeachTownNewTown",
//   "palside2_ae1": "BeachTownRiverToBeach",
//   "palExtended2_ai1": "BeachTownTownTourLong",
//   "palCircuit_a41": "BeachTownCircuit",
//   "damValley_a41": "MountainDamValleyRun",
//   "damRun_a41": "MountainDamDamToLand",
//   "damTwisty_a41": "MountainDamTurnToDust",
//   "damView_a41": "MountainDamDamViewPlatform",
//   "damTwisty2_a41": "MountainDamTinyMountainTown",
//   "damRally_a41": "MountainDamRaceAcrossDam",
//   "damExtended_a41": "MountainDamExtended"
// }

/*
 * Splines stored as the mirror image of the road the game actually races. Listed by
 * spline rather than by track code because the reflection is a property of the stored
 * geometry, so one entry covers every code that shares the file -- a track raced dry and
 * wet is one road.
 */
const notMirroredSplines = [
  // "DockyardUDrag" need confirm
]

/* ------------------------------------------------------------------ renderer -- */

var DEFAULTS = {
  autoRotate: true,
  rotateSpeed: -0.25,      // rad / second
  pitch: 0.62,            // camera elevation above the ground plane, radians
  minPitch: 0.06,
  maxPitch: 1.45,
  // How many elevations the fit is solved against. Raising the camera makes a track's
  // footprint project taller, so a fit solved at one pitch would rescale the track as the
  // user drags elevation. Sampling the whole range and keeping the tightest fit holds the
  // scale still instead. 1 goes back to solving at the current pitch only, which uses the
  // canvas more fully at the cost of that rescaling.
  fitPitchSamples: 9,
  /*
   * Width alone sets the scale, so the track always grows when the viewer gets wider. The
   * height constraint used to be taken as well, and on a wide short canvas it was the one
   * that always won -- so widening the viewer changed the zoom by nothing at all. Raise
   * this above 0 to bring height back as a backstop: the track may then stand that many
   * canvas-heights tall before height starts clamping the scale too. 1 is the old
   * behaviour, where the whole track was always kept inside the frame.
   */
  fitHeightSlack: 0,
  zoom: 1.0,
  minZoom: 0.5,
  maxZoom: 6,
  interactive: true,      // drag to orbit, wheel or pinch to zoom
  resumeDelay: 2500,      // ms of idle before auto-rotation kicks back in
  grid: true,
  shadow: true,           // flat copy of the track on the ground plane
  labels: true,
  // drawn onto the canvas, so they cannot go through $t() here -- the component
  // passes the translated strings in and refreshes them when the locale changes
  labelStart: 'START',
  labelFinish: 'FINISH',
  labelStartFinish: 'START / FINISH',
  mirror: false,          // reflect left/right, keeping start and finish where they are
  // Only paint a bump red once it actually costs a car something. Plenty of tracks have
  // gentle humps that trip the geometric detector but sit under every ground-clearance
  // threshold (IndoorKarting's 8 cm rise, say) -- red there is a false alarm.
  // 1 = penalises Low/VeryLow, 2 = + Medium, 3 = + High. 0 paints every detected bump.
  minSeverity: 1,
  background: null,       // null => transparent, host CSS paints behind
  trackColor: '#ffffff',
  bumpColor: '#ff3b30',
  startColor: '#38e08a',
  finishColor: '#4da3ff',
  gridColor: '#ffffff',
  // Optional palette indexed by the track's `surf` section: surfaceColors[2] paints every
  // stretch with surf === 2. Missing or short entries fall back to trackColor, so null
  // (the default) means a plain white road. Red bump stretches always win over this.
  surfaceColors: null,
  // Depth haze is done by mixing towards this colour at full opacity rather than by
  // fading alpha: translucent strokes would double up where one depth band hands over
  // to the next and speckle the road with bright dots. Opaque also means a near stretch
  // correctly paints over a far one where a circuit crosses itself. Set this to whatever
  // the page paints behind the canvas.
  hazeColor: '#0d0d13',
  haze: 0.62,             // how far the most distant road mixes towards hazeColor
  // The road is stroked at a real width in metres, not at a fixed pixel width, so the
  // line thickness is itself a scale cue: a 700 m street circuit reads as a wide ribbon,
  // a 28 km mountain road as a hairline. Clamped so neither extreme degenerates.
  roadWidth: 6,           // metres
  minWidthPx: 1.1,        // CSS px
  maxWidthPx: 11,         // CSS px
  maxDpr: 2,
  // Depth buckets. These now only step the stroke WIDTH and set the far-to-near draw
  // order -- the haze colour is a continuous gradient, so no colour banding is visible.
  depthBands: 10,
  /*
   * Direction chevrons sliding along the road. A circuit starts and finishes in the same
   * place, so the START / FINISH marker alone says nothing about which way it is raced --
   * these do.
   *
   * The speed is a real ground speed, so it doubles as a sense of scale: the same 40 m/s
   * crosses a 250 m sprint in six seconds and takes twelve minutes over the 28 km Tail of
   * the Dragon. The count stays relative, so the chevrons are spread over whatever length
   * the track happens to be.
   */
  arrows: true,
  arrowCount: 4,         // chevrons on the road at once, whatever its length
  arrowSpeed: 40,         // metres per second along the road
  arrowSize: 1.9,         // chevron arm length as a multiple of the road width
  arrowSpread: 0.62,      // chevron half-angle, radians -- how open the ">" is
  arrowWidthPx: 4,      // chevron stroke width, CSS px
  // Chevrons are darkened away from the road they sit on, the way real markings are, so
  // they stay legible whether the road is white asphalt or bright sand. 0 = same colour
  // as the road (invisible), 1 = fully the haze colour.
  arrowContrast: 0.0,
  arrowColor: null        // set to paint every chevron the same colour instead
};

var TAU = Math.PI * 2;
var HAZE_STOPS = 10;      // colour stops in the depth-haze gradient
var GRID_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];

function assign(target) {
  for (var i = 1; i < arguments.length; i++) {
    var src = arguments[i];
    if (!src) continue;
    for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) target[k] = src[k];
  }
  return target;
}

/* ---------------------------------------------------------------- model -- */

/**
 * Expand the compact JSON into display-space coordinates: metres, vertically
 * exaggerated by `yEx`, and centred on the origin so rotation happens about the
 * middle of the track.
 */
function buildModel(data, mirror, minSeverity) {
  var unit = data.unit || 1;
  var yEx = data.yEx || 1;
  var src = data.pts || [];
  var n = (src.length / 3) | 0;
  var p = new Float64Array(n * 3);
  // Negating x reflects the track left/right. Point order is untouched, so start and
  // finish stay where they are -- only the handedness of the corners flips.
  var sgn = mirror ? -1 : 1;
  var i, x, y, z;
  var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;

  for (i = 0; i < n; i++) {
    x = src[i * 3] * unit * sgn;
    y = src[i * 3 + 1] * unit * yEx;
    z = src[i * 3 + 2] * unit;
    p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = z;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
  var radius = 1;
  for (i = 0; i < n; i++) {
    p[i * 3] -= cx; p[i * 3 + 1] -= cy; p[i * 3 + 2] -= cz;
    var r = Math.sqrt(p[i * 3] * p[i * 3] + p[i * 3 + 2] * p[i * 3 + 2]);
    if (r > radius) radius = r;
  }

  // expand the surface run-length pairs [startIndex, value, ...] to one value per
  // segment; a segment takes the section of the point it leaves from
  var segSurf = new Uint8Array(Math.max(n - 1, 1));
  var runs = data.surf;
  if (runs && runs.length >= 2) {
    for (var r = 0; r < runs.length; r += 2) {
      var from = runs[r] | 0;
      var to = r + 2 < runs.length ? runs[r + 2] | 0 : n;   // exclusive
      for (var k = Math.max(0, from); k < Math.min(to, segSurf.length); k++) segSurf[k] = runs[r + 1] | 0;
    }
  }
  var surfSeen = [];
  for (i = 0; i < segSurf.length; i++) {
    if (surfSeen.indexOf(segSurf[i]) < 0) surfSeen.push(segSurf[i]);
  }
  surfSeen.sort(function (a, b) { return a - b; });

  // mark which polyline segments are inside a speed bump -- the bump is shown purely
  // by recolouring the road, so this is all the renderer needs
  var bumps = (data.bumps || []).filter(function (b) { return b.a < n && b.b < n && b.p < n; });
  var floor = minSeverity == null ? 1 : minSeverity;
  var segBump = new Uint8Array(Math.max(n - 1, 1));
  for (i = 0; i < bumps.length; i++) {
    if ((bumps[i].s || 0) < floor) continue;
    var s0 = Math.max(0, Math.min(bumps[i].a, n - 2));
    var s1 = Math.max(s0 + 1, Math.min(bumps[i].b, n - 1));
    for (var j = s0; j < s1; j++) segBump[j] = 1;
  }

  // Which colour pass paints each segment: its surface section, or the red bump pass
  // (always last, so a bump wins over whatever surface it sits on). This is a property of
  // the track, not of the camera, so it is resolved once here and the renderer can chunk
  // the line by colour without re-deriving it every frame.
  var surfPass = {};
  for (i = 0; i < surfSeen.length; i++) surfPass[surfSeen[i]] = i;
  var segStyle = new Uint8Array(Math.max(n - 1, 1));
  for (i = 0; i < segStyle.length; i++) {
    segStyle[i] = segBump[i] !== 0 ? surfSeen.length : surfPass[segSurf[i]];
  }

  // cumulative arc length, so chevrons can be spaced evenly along the road rather than
  // evenly along the point list (spline points bunch up in corners)
  var cum = new Float64Array(n);
  for (i = 1; i < n; i++) {
    var ax = p[i * 3] - p[(i - 1) * 3];
    var ay = p[i * 3 + 1] - p[(i - 1) * 3 + 1];
    var az = p[i * 3 + 2] - p[(i - 1) * 3 + 2];
    cum[i] = cum[i - 1] + Math.sqrt(ax * ax + ay * ay + az * az);
  }

  return {
    raw: data,
    pts: p,
    n: n,
    cum: cum,
    length: cum[n - 1] || 0,
    radius: radius,
    height: maxY - minY,
    groundY: -(maxY - minY) / 2,
    closed: !!data.closed,
    bumps: bumps,
    segBump: segBump,
    segSurf: segSurf,
    surfSeen: surfSeen,
    segStyle: segStyle,
    // scratch buffers reused every frame -- no per-frame allocation
    sx: new Float64Array(n),
    sy: new Float64Array(n),
    sd: new Float64Array(n),
    // one entry per segment (the width band it falls in) and per chunk (a maximal run of
    // segments sharing a colour and a band). There can never be more chunks than segments.
    segBand: new Uint8Array(Math.max(n - 1, 1)),
    chStart: new Int32Array(Math.max(n - 1, 1)),
    chEnd: new Int32Array(Math.max(n - 1, 1)),
    chBand: new Uint8Array(Math.max(n - 1, 1)),
    chDepth: new Float64Array(Math.max(n - 1, 1))
  };
}

var COLOR_CACHE = {};

/** accepts '#rgb', '#rrggbb', 'r,g,b' and 'rgb(r,g,b)' */
function parseRgb(v) {
  var key = String(v);
  var hit = COLOR_CACHE[key];
  if (hit) return hit;
  var out = [255, 255, 255];
  var t = key.trim();
  if (t.charAt(0) === '#') {
    var h = t.slice(1);
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    if (h.length >= 6) {
      out = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
  } else {
    var a = t.replace(/^rgba?\(/, '').replace(/\)$/, '').split(',');
    if (a.length >= 3) out = [+a[0] || 0, +a[1] || 0, +a[2] || 0];
  }
  COLOR_CACHE[key] = out;
  return out;
}

function rgba(c, a) {
  return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
}

function mixRgb(a, b, t) {
  return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
    Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
    Math.round(a[2] + (b[2] - a[2]) * t) + ')';
}

function niceStep(target) {
  for (var i = 0; i < GRID_STEPS.length; i++) if (GRID_STEPS[i] >= target) return GRID_STEPS[i];
  return GRID_STEPS[GRID_STEPS.length - 1];
}

/* -------------------------------------------------------------- renderer -- */

function create(canvas, data, options) {
  var opt = assign({}, DEFAULTS, options);
  var ctx = canvas.getContext('2d', { alpha: opt.background === null });
  var model = data ? buildModel(data, opt.mirror, opt.minSeverity) : null;

  var yaw = 0.7, pitch = opt.pitch, zoom = opt.zoom;
  var width = 0, height = 0, dpr = 1;
  var raf = 0, last = 0, visible = true, running = false, idleUntil = 0;
  var dragging = false, dragX = 0, dragY = 0;
  // every pointer currently down, in the order it arrived: one orbits, two pinch
  var pointers = [];
  var pinchDist = 0, pinchZoom = 1;

  // camera scratch, recomputed once per frame
  var cosYaw = 1, sinYaw = 0, cosPitch = 1, sinPitch = 0, camDist = 1, fit = 1, ox = 0, oy = 0;
  var baseFit = 1, fitW = -1, fitH = -1;

  var reduceMotion = typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -- sizing ------------------------------------------------------------ */

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var cssW = Math.max(1, Math.round(rect.width || canvas.clientWidth || 300));
    var cssH = Math.max(1, Math.round(rect.height || canvas.clientHeight || 200));
    dpr = Math.min(opt.maxDpr, (typeof devicePixelRatio === 'number' ? devicePixelRatio : 1) || 1);
    var w = Math.round(cssW * dpr), h = Math.round(cssH * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    width = w; height = h;
    draw(0);
  }

  /* -- projection -------------------------------------------------------- */

  /**
   * Scale is driven by the canvas width, and is fixed for the whole spin and the whole
   * elevation range -- otherwise a long thin track would visibly "breathe" as it turns or
   * as the camera is raised. It is solved once by projecting the track at a ring of yaw
   * angles, repeated across a sweep of pitches, and keeping the tightest fit that works at
   * every one of them, which packs an elongated track far better than a bounding-sphere
   * guess. So orbiting and changing elevation never rescale the track, and making the
   * viewer wider always makes it bigger.
   *
   * Only runs on a resize or a new track, so the nested sweep is not on the frame path.
   */
  function computeFit() {
    var R = model.radius;
    camDist = R * 3.2;
    var halfW = width * 0.5 * 0.94, halfH = height * 0.5 * 0.90;
    var p = model.pts, n = model.n, gy = model.groundY;
    var samples = 36, best = Infinity;
    var pitches = Math.max(1, opt.fitPitchSamples | 0);

    for (var q = 0; q < pitches; q++) {
      var ph = pitches === 1
        ? pitch
        : opt.minPitch + (opt.maxPitch - opt.minPitch) * (q / (pitches - 1));
      var cp = Math.cos(ph), sp = Math.sin(ph);

      for (var a = 0; a < samples; a++) {
        var ang = a / samples * TAU, ca = Math.cos(ang), sa = Math.sin(ang);
        var mx = 1e-6, my = 1e-6;
        for (var i = 0; i < n; i++) {
          var x = p[i * 3], z = p[i * 3 + 2];
          var rx = x * ca - z * sa, rz = x * sa + z * ca;
          // the point itself, and its ground-plane shadow / marker stem foot
          for (var g = 0; g < 2; g++) {
            var y = g ? gy : p[i * 3 + 1];
            var persp = camDist / (camDist - (y * sp + rz * cp));
            var ax = Math.abs(rx * persp), ay = Math.abs((y * cp - rz * sp) * persp);
            if (ax > mx) mx = ax;
            if (ay > my) my = ay;
          }
        }
        var s = halfW / mx;
        if (opt.fitHeightSlack > 0) s = Math.min(s, halfH * opt.fitHeightSlack / my);
        if (s < best) best = s;
      }
    }
    baseFit = best;
    fitW = width; fitH = height;
  }

  function updateCamera() {
    cosYaw = Math.cos(yaw); sinYaw = Math.sin(yaw);
    cosPitch = Math.cos(pitch); sinPitch = Math.sin(pitch);
    if (width !== fitW || height !== fitH) computeFit();
    fit = baseFit * zoom;
    ox = width / 2;
    oy = height / 2 - 70 + (pitch * 10 * fit * sinPitch) + Math.max(0, (600 - width) * 0.1);   // tilt the horizon as the camera rotates
  }

  // Camera sits at elevation `pitch` on the +Z side, looking at the origin.
  function depthOf(x, y, z) {
    var rz = x * sinYaw + z * cosYaw;
    return -(y * sinPitch + rz * cosPitch);   // larger = farther from camera
  }

  function project(x, y, z, out) {
    var rx = x * cosYaw - z * sinYaw;
    var rz = x * sinYaw + z * cosYaw;
    var up = y * cosPitch - rz * sinPitch;
    var depth = -(y * sinPitch + rz * cosPitch);
    var persp = camDist / (camDist + depth);
    out[0] = ox + rx * fit * persp;
    out[1] = oy - up * fit * persp;
    out[2] = depth;
    out[3] = persp;
    return out;
  }

  var tmpA = [0, 0, 0, 0], tmpB = [0, 0, 0, 0];

  function projectAll() {
    var p = model.pts, n = model.n;
    var sx = model.sx, sy = model.sy, sd = model.sd;
    for (var i = 0; i < n; i++) {
      var x = p[i * 3], y = p[i * 3 + 1], z = p[i * 3 + 2];
      var rx = x * cosYaw - z * sinYaw;
      var rz = x * sinYaw + z * cosYaw;
      var up = y * cosPitch - rz * sinPitch;
      var depth = -(y * sinPitch + rz * cosPitch);
      var persp = camDist / (camDist + depth);
      sx[i] = ox + rx * fit * persp;
      sy[i] = oy - up * fit * persp;
      sd[i] = depth;
    }
  }

  /* -- pieces ------------------------------------------------------------ */

  /*
   * Depth haze.
   *
   * Stroking each depth band in its own flat shade banded the road into visible steps
   * that crawled along it as the track turned. Canvas can't vary a stroke's colour along
   * a path, but it can stroke with a gradient -- and depth turns out to be 92-99 %
   * predictable from screen height alone (measured across tracks and pitches), because
   * the camera looks down at the ground plane, so further away is higher up the screen.
   *
   * So: bin the projected points by screen y, average the real depth in each bin, and
   * hand those averages to a vertical linear gradient as colour stops. The gradient
   * interpolates between them, which makes the haze continuous by construction and
   * follows the actual data rather than assuming the relationship is a straight line.
   * The depth bands survive only to step the stroke width and to keep the far-to-near
   * draw order.
   */
  // measured by drawTrack each frame, read by drawArrows
  var depthMin = 0, depthRange = 1;
  var arrowPhase = 0;

  // rebuilt by drawTrack each frame, reused so the frame path allocates nothing
  var frameStyles = [];   // one hazed gradient per colour pass
  var chOrder = [];       // chunk indices, sorted far to near

  /**
   * Painter's order for the road: farthest chunk first. Ties -- two stretches genuinely
   * at the same depth, which is what a self-crossing circuit is -- go to the later point
   * on the spline, so the answer is the same every frame instead of depending on which
   * one happened to be visited first.
   */
  function byDepthThenIndex(a, b) {
    var d = model.chDepth[b] - model.chDepth[a];
    return d !== 0 ? d : model.chStart[a] - model.chStart[b];
  }

  var fadeStops = new Float64Array(HAZE_STOPS);
  var binSum = new Float64Array(HAZE_STOPS);
  var binCount = new Float64Array(HAZE_STOPS);
  var knownStop = new Int32Array(HAZE_STOPS);

  function computeHazeStops(n, sy, sd, dMin, range, syMin, syMax) {
    var span = syMax - syMin;
    var i, k;
    for (k = 0; k < HAZE_STOPS; k++) { binSum[k] = 0; binCount[k] = 0; }
    if (span > 1e-6) {
      for (i = 0; i < n; i++) {
        k = Math.floor((sy[i] - syMin) / span * HAZE_STOPS);
        if (k < 0) k = 0; else if (k >= HAZE_STOPS) k = HAZE_STOPS - 1;
        binSum[k] += sd[i];
        binCount[k]++;
      }
    }
    var m = 0;
    for (k = 0; k < HAZE_STOPS; k++) {
      if (binCount[k] > 0) {
        fadeStops[k] = (binSum[k] / binCount[k] - dMin) / range;
        knownStop[m++] = k;
      }
    }
    if (m === 0) {
      for (k = 0; k < HAZE_STOPS; k++) fadeStops[k] = 0.5;
      return;
    }
    // a screen band with no points in it (a track with a gap in its profile) is filled
    // by interpolating between the nearest bands that do have some
    for (k = 0; k < knownStop[0]; k++) fadeStops[k] = fadeStops[knownStop[0]];
    for (var q = 0; q < m - 1; q++) {
      var a = knownStop[q], b = knownStop[q + 1];
      for (k = a + 1; k < b; k++) {
        fadeStops[k] = fadeStops[a] + (fadeStops[b] - fadeStops[a]) * ((k - a) / (b - a));
      }
    }
    for (k = knownStop[m - 1] + 1; k < HAZE_STOPS; k++) fadeStops[k] = fadeStops[knownStop[m - 1]];
  }

  /** a vertical gradient taking `rgb` from its near shade to its hazed far shade */
  function hazeStyle(rgb, hazeRgb, syMin, syMax) {
    if (!(syMax - syMin > 1e-6)) return mixRgb(rgb, hazeRgb, fadeStops[HAZE_STOPS >> 1] * opt.haze);
    var g = ctx.createLinearGradient(0, syMin, 0, syMax);
    for (var k = 0; k < HAZE_STOPS; k++) {
      var f = fadeStops[k];
      f = f < 0 ? 0 : (f > 1 ? 1 : f);
      g.addColorStop((k + 0.5) / HAZE_STOPS, mixRgb(rgb, hazeRgb, f * opt.haze));
    }
    return g;
  }

  /** road width in device px at a given depth, from the real width in metres */
  function strokePx(depth) {
    var w = opt.roadWidth * fit * (camDist / (camDist + depth));
    return Math.max(opt.minWidthPx * dpr, Math.min(opt.maxWidthPx * dpr, w));
  }

  function drawGrid() {
    var R = model.radius * 1.06;
    var step = niceStep(R / 3.2);
    var span = Math.ceil(R / step) * step;
    var gy = model.groundY;
    ctx.lineWidth = Math.max(1, dpr * 0.75);
    ctx.strokeStyle = rgba(parseRgb(opt.gridColor), 0.055);
    ctx.beginPath();
    for (var v = -span; v <= span + 1e-6; v += step) {
      project(v, gy, -span, tmpA); project(v, gy, span, tmpB);
      ctx.moveTo(tmpA[0], tmpA[1]); ctx.lineTo(tmpB[0], tmpB[1]);
      project(-span, gy, v, tmpA); project(span, gy, v, tmpB);
      ctx.moveTo(tmpA[0], tmpA[1]); ctx.lineTo(tmpB[0], tmpB[1]);
    }
    ctx.stroke();
  }

  function drawShadow() {
    var p = model.pts, n = model.n, gy = model.groundY;
    ctx.lineWidth = Math.max(1, strokePx(0) * 0.55);
    ctx.strokeStyle = rgba(parseRgb(opt.trackColor), 0.085);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      project(p[i * 3], gy, p[i * 3 + 2], tmpA);
      if (i === 0) ctx.moveTo(tmpA[0], tmpA[1]); else ctx.lineTo(tmpA[0], tmpA[1]);
    }
    ctx.stroke();
  }

  /**
   * The road, split into chunks drawn far-to-near. Cheap fake occlusion: distant
   * stretches are hazier and (through perspective) thinner, which is what makes the
   * rotation read as 3D rather than as a flat squiggle. The haze is a continuous
   * gradient (see computeHazeStops); the depth bands only step the width.
   *
   * A chunk is a maximal run of consecutive segments that share a colour -- a surface
   * section (white by default, or whatever `surfaceColors` maps it to) or the red of a
   * speed bump, so a bump is nothing but a recoloured piece of the same line -- and share
   * a width band. Chunks are then stroked in order of their own mean depth.
   *
   * This replaced a band-major loop that stroked every segment of one colour, then every
   * segment of the next, inside each band. Two colours meeting at a vertex both claimed
   * it, and who won was decided by the pass order and by which band each end had landed
   * in -- neither of which tracks depth -- so the winner flipped from frame to frame as
   * the camera turned and the colours visibly fought over the join. Sorting by real depth
   * means the order only changes when the right answer changes, and butt caps mean the
   * shared vertex is not contested in the first place: a round cap reaches half a road
   * width past the last point, straight into the neighbouring colour, which is what made
   * the flicker so wide. The cost is that a butt cap would also notch the width step
   * where one band hands over to the next, so chunks overlap their same-coloured
   * neighbours by one segment -- invisible, both strokes being the same colour.
   *
   * Joins are mitered: a street circuit's corners are genuinely sharp, and a round join
   * on a ribbon this wide would visibly file them down.
   */
  function drawTrack() {
    var n = model.n;
    if (n < 2) return;
    var sx = model.sx, sy = model.sy, sd = model.sd, segStyle = model.segStyle;
    var bands = Math.min(255, Math.max(1, opt.depthBands | 0));
    var dMin = Infinity, dMax = -Infinity, syMin = Infinity, syMax = -Infinity, i;
    for (i = 0; i < n; i++) {
      if (sd[i] < dMin) dMin = sd[i];
      if (sd[i] > dMax) dMax = sd[i];
      if (sy[i] < syMin) syMin = sy[i];
      if (sy[i] > syMax) syMax = sy[i];
    }
    var range = (dMax - dMin) || 1;
    depthMin = dMin; depthRange = range;   // drawArrows runs next and hazes to match
    computeHazeStops(n, sy, sd, dMin, range, syMin, syMax);

    // one hazed gradient per surface section actually present, plus the red bump pass,
    // resolved once per frame and shared by every chunk that uses it
    var haze = parseRgb(opt.hazeColor);
    var surfSeen = model.surfSeen, palette = opt.surfaceColors;
    var styles = frameStyles;
    styles.length = 0;
    for (i = 0; i < surfSeen.length; i++) {
      var pick = palette && palette[surfSeen[i]];
      styles.push(hazeStyle(parseRgb(pick || opt.trackColor), haze, syMin, syMax));
    }
    styles.push(hazeStyle(parseRgb(opt.bumpColor), haze, syMin, syMax));

    // bin every segment by depth: the band sets its stroke width
    var m = n - 1, segBand = model.segBand;
    for (i = 0; i < m; i++) {
      var band = (((sd[i] + sd[i + 1]) * 0.5 - dMin) / range * bands) | 0;
      segBand[i] = band < 0 ? 0 : (band > bands - 1 ? bands - 1 : band);
    }

    // cut the line wherever the colour or the width band changes
    var chStart = model.chStart, chEnd = model.chEnd;
    var chBand = model.chBand, chDepth = model.chDepth;
    var nc = 0, s = 0, sum = 0;
    for (i = 0; i < m; i++) {
      sum += sd[i] + sd[i + 1];
      if (i === m - 1 || segStyle[i + 1] !== segStyle[s] || segBand[i + 1] !== segBand[s]) {
        chStart[nc] = s;
        chEnd[nc] = i + 1;                        // exclusive, in segments
        chBand[nc] = segBand[s];
        chDepth[nc] = sum / ((i - s + 1) * 2);
        nc++;
        s = i + 1; sum = 0;
      }
    }

    chOrder.length = nc;
    for (i = 0; i < nc; i++) chOrder[i] = i;
    chOrder.sort(byDepthThenIndex);

    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2.5;
    ctx.lineCap = 'butt';   // see the note above: a round cap here is what fought

    for (var c = 0; c < nc; c++) {
      var k = chOrder[c];
      var a = chStart[k], e = chEnd[k], style = segStyle[chStart[k]];
      // reach one segment into a same-coloured neighbour so the butt cap does not leave a
      // notch at the width step; stop dead at a colour change so neither side contests it
      if (a > 0 && segStyle[a - 1] === style) a--;
      if (e < m && segStyle[e] === style) e++;
      ctx.beginPath();
      ctx.moveTo(sx[a], sy[a]);
      for (i = a + 1; i <= e; i++) ctx.lineTo(sx[i], sy[i]);
      ctx.strokeStyle = styles[style];
      ctx.lineWidth = strokePx(dMin + range * ((chBand[k] + 0.5) / bands));
      ctx.stroke();
    }
  }

  function drawMarker(index, color, label) {
    var p = model.pts;
    var x = p[index * 3], y = p[index * 3 + 1], z = p[index * 3 + 2];
    project(x, y, z, tmpA);
    project(x, model.groundY, z, tmpB);

    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(1, dpr * 0.9);
    ctx.beginPath();
    ctx.moveTo(tmpB[0], tmpB[1]);
    ctx.lineTo(tmpA[0], tmpA[1]);
    ctx.stroke();
    ctx.globalAlpha = 1;

    var r = Math.max(3.4 * dpr, strokePx(tmpA[2]) * 1.05);
    ctx.beginPath();
    ctx.arc(tmpA[0], tmpA[1], r, 0, TAU);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(tmpA[0], tmpA[1], r + 2.2 * dpr, 0, TAU);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = Math.max(1, dpr);
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (opt.labels && label) {
      ctx.font = (9.5 * dpr).toFixed(0) + "px 'Roboto', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.fillText(label, tmpA[0], tmpA[1] - r - 4 * dpr);
      ctx.globalAlpha = 1;
    }
  }

  /*
   * Direction chevrons.
   *
   * Spaced by arc length and slid forward together at a real ground speed, so they read as
   * one flow along the road rather than as marks that happen to sit near it, and so how
   * fast they cross the screen says how long the road actually is. Each one is placed by walking
   * the cumulative-length table to the segment it falls in, then interpolating that
   * segment in screen space -- the projection is already done, so this costs a binary
   * search and a couple of lerps per chevron.
   *
   * Colour comes from whatever the road is under that chevron (the surface palette, or
   * red inside a speed bump) darkened towards the haze, then hazed again for depth. Both
   * mixes head for the same colour, so they collapse into the single mix below.
   */
  function drawArrows(dt) {
    var n = model.n;
    var total = model.length;
    var count = Math.max(1, opt.arrowCount | 0);
    if (n < 2 || !(total > 0)) return;

    // unlike the spin, these keep flowing while the view is dragged -- they carry
    // information, not decoration. prefers-reduced-motion parks them, and the chevron
    // still points the right way standing still.
    if (!reduceMotion) {
      arrowPhase = (arrowPhase + opt.arrowSpeed * dt / total) % 1;
      if (arrowPhase < 0) arrowPhase += 1;
    }

    var cum = model.cum, sx = model.sx, sy = model.sy, sd = model.sd;
    var haze = parseRgb(opt.hazeColor);
    var override = opt.arrowColor ? parseRgb(opt.arrowColor) : null;
    var bump = parseRgb(opt.bumpColor);
    var palette = opt.surfaceColors;
    var contrast = override ? 0 : Math.max(0, Math.min(1, opt.arrowContrast));

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, opt.arrowWidthPx * dpr);

    for (var a = 0; a < count; a++) {
      var s = ((arrowPhase + a / count) % 1) * total;

      // segment containing arc length s
      var lo = 0, hi = n - 1;
      while (lo < hi - 1) {
        var mid = (lo + hi) >> 1;
        if (cum[mid] <= s) lo = mid; else hi = mid;
      }
      var span = cum[lo + 1] - cum[lo];
      if (!(span > 0)) continue;                 // duplicated points, nothing to aim along
      var t = (s - cum[lo]) / span;

      var px = sx[lo] + (sx[lo + 1] - sx[lo]) * t;
      var py = sy[lo] + (sy[lo + 1] - sy[lo]) * t;
      var pd = sd[lo] + (sd[lo + 1] - sd[lo]) * t;

      var dx = sx[lo + 1] - sx[lo], dy = sy[lo + 1] - sy[lo];
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1e-6) continue;                  // segment is edge-on, no direction to show
      dx /= len; dy /= len;

      var size = strokePx(pd) * opt.arrowSize;
      // both arms point back from the tip, rotated +/- spread off the reversed heading
      var cs = Math.cos(opt.arrowSpread), sn = Math.sin(opt.arrowSpread);
      var bx = -dx, by = -dy;
      var ax1 = (bx * cs - by * sn) * size, ay1 = (bx * sn + by * cs) * size;
      var ax2 = (bx * cs + by * sn) * size, ay2 = (-bx * sn + by * cs) * size;

      var fade = (pd - depthMin) / depthRange;
      fade = fade < 0 ? 0 : (fade > 1 ? 1 : fade) * opt.haze;
      var base = override || (model.segBump[lo] !== 0
        ? bump
        : parseRgb((palette && palette[model.segSurf[lo]]) || opt.trackColor));

      ctx.strokeStyle = mixRgb(base, haze, contrast + fade - contrast * fade);
      ctx.beginPath();
      ctx.moveTo(px + ax1, py + ay1);
      ctx.lineTo(px, py);
      ctx.lineTo(px + ax2, py + ay2);
      ctx.stroke();
    }
  }

  function drawMarkers() {
    if (model.n < 1) return;
    if (model.closed) {
      drawMarker(0, opt.startColor, opt.labelStartFinish);
      return;
    }
    // draw the far marker first so the near one overlaps it
    var startFar = depthOf(model.pts[0], model.pts[1], model.pts[2]) >
      depthOf(model.pts[(model.n - 1) * 3], model.pts[(model.n - 1) * 3 + 1], model.pts[(model.n - 1) * 3 + 2]);
    var order = startFar ? [[0, opt.startColor, opt.labelStart], [model.n - 1, opt.finishColor, opt.labelFinish]]
      : [[model.n - 1, opt.finishColor, opt.labelFinish], [0, opt.startColor, opt.labelStart]];
    for (var i = 0; i < order.length; i++) drawMarker(order[i][0], order[i][1], order[i][2]);
  }

  /* -- frame ------------------------------------------------------------- */

  function draw(dt) {
    if (!width || !height) return;
    if (opt.background) { ctx.fillStyle = opt.background; ctx.fillRect(0, 0, width, height); }
    else ctx.clearRect(0, 0, width, height);
    if (!model || model.n < 2) return;

    if (opt.autoRotate && !reduceMotion && !dragging && Date.now() >= idleUntil) {
      yaw = (yaw + opt.rotateSpeed * dt) % TAU;
    }
    updateCamera();
    projectAll();

    if (opt.grid) drawGrid();
    if (opt.shadow) drawShadow();
    drawTrack();
    if (opt.arrows) drawArrows(dt);
    drawMarkers();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    draw(dt);
  }

  function start() {
    if (running || !visible) return;
    running = true; last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* -- interaction ------------------------------------------------------- */

  function clampZoom(value) {
    return Math.max(opt.minZoom, Math.min(opt.maxZoom, value));
  }

  function pointerIndex(id) {
    for (var i = 0; i < pointers.length; i++) if (pointers[i].id === id) return i;
    return -1;
  }

  /** distance between the first two fingers -- what the pinch scales by */
  function pinchSpan() {
    if (pointers.length < 2) return 0;
    var dx = pointers[0].x - pointers[1].x, dy = pointers[0].y - pointers[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // anchor on the span and zoom the pinch starts from, so zoom tracks the fingers
  // proportionally instead of drifting as they move
  function anchorPinch() {
    pinchDist = pinchSpan();
    pinchZoom = zoom;
  }

  function onDown(ev) {
    if (pointerIndex(ev.pointerId) === -1) {
      pointers.push({ id: ev.pointerId, x: ev.clientX, y: ev.clientY });
    }
    if (canvas.setPointerCapture && ev.pointerId != null) canvas.setPointerCapture(ev.pointerId);

    if (pointers.length === 1) {
      dragging = true;
      dragX = ev.clientX; dragY = ev.clientY;
    } else {
      // a second finger takes over: pinch to zoom rather than orbit
      dragging = false;
      anchorPinch();
    }
  }

  function onMove(ev) {
    var i = pointerIndex(ev.pointerId);
    if (i !== -1) { pointers[i].x = ev.clientX; pointers[i].y = ev.clientY; }

    if (pointers.length >= 2) {
      var span = pinchSpan();
      if (pinchDist > 0 && span > 0) {
        zoom = clampZoom(pinchZoom * (span / pinchDist));
        idleUntil = Date.now() + opt.resumeDelay;
        if (!running) draw(0);
      }
      return;
    }

    if (!dragging) return;
    yaw = (yaw - (ev.clientX - dragX) * 0.008) % TAU;
    pitch = Math.max(opt.minPitch, Math.min(opt.maxPitch, pitch + (ev.clientY - dragY) * 0.006));
    dragX = ev.clientX; dragY = ev.clientY;
    idleUntil = Date.now() + opt.resumeDelay;
    if (!running) draw(0);
  }

  function onUp(ev) {
    var i = ev && ev.pointerId != null ? pointerIndex(ev.pointerId) : -1;
    if (i !== -1) pointers.splice(i, 1);
    else pointers.length = 0;

    if (pointers.length >= 2) {
      anchorPinch();                       // still pinching with the fingers that remain
    } else if (pointers.length === 1) {
      // down to one finger: re-anchor the orbit on it so the view does not jump
      dragX = pointers[0].x; dragY = pointers[0].y;
      dragging = true;
    } else {
      dragging = false;
    }
    idleUntil = Date.now() + opt.resumeDelay;
  }

  function onWheel(ev) {
    ev.preventDefault();
    zoom = clampZoom(zoom * (ev.deltaY < 0 ? 1.12 : 1 / 1.12));
    if (!running) draw(0);
  }

  var io = null, mo = null;

  function bind() {
    if (opt.interactive) {
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);
      canvas.addEventListener('wheel', onWheel, { passive: false });
      canvas.style.touchAction = 'none';
      canvas.style.cursor = 'grab';
    }
    if (typeof ResizeObserver === 'function') {
      mo = new ResizeObserver(resize);
      mo.observe(canvas);
    } else {
      addEventListener('resize', resize);
    }
    // don't burn frames on an off-screen or backgrounded canvas
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0 });
      io.observe(canvas);
    }
    document.addEventListener('visibilitychange', onVisibility);
  }

  function onVisibility() {
    if (document.hidden) stop(); else start();
  }

  function destroy() {
    stop();
    if (io) io.disconnect();
    if (mo) mo.disconnect(); else removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
    if (opt.interactive) {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('wheel', onWheel);
    }
    pointers.length = 0;
    model = null;
  }

  bind();
  resize();
  start();

  return {
    setData: function (next) {
      model = next ? buildModel(next, opt.mirror, opt.minSeverity) : null;
      fitW = -1;              // force a refit for the new shape
      draw(0);
    },
    setOptions: function (next) {
      var wasMirror = opt.mirror, wasSeverity = opt.minSeverity;
      assign(opt, next);
      if (next && typeof next.pitch === 'number') pitch = next.pitch;
      if (next && typeof next.zoom === 'number') zoom = next.zoom;
      // these two are baked into the model, so they need a rebuild rather than a redraw
      if (model && (opt.mirror !== wasMirror || opt.minSeverity !== wasSeverity)) {
        model = buildModel(model.raw, opt.mirror, opt.minSeverity);
        fitW = -1;
      }
      draw(0);
    },
    resetView: function () { yaw = 0.7; pitch = opt.pitch; zoom = opt.zoom; draw(0); },
    resize: resize,
    start: start,
    stop: stop,
    destroy: destroy,
    get model() { return model; }
  };
}

/* ----------------------------------------------------------------- component -- */

export default {
  name: 'TrackViewer',
  components: {},
  props: {
    /** parsed track3d object */
    track: {
      type: Object,
      default: null
    },
    /** url to fetch a track3d object from (ignored when `track` is given) */
    src: {
      type: String,
      default: ''
    },
    /** app track code, e.g. "damExtended_a41" -- resolved through splineDict above */
    trackCode: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '320px'
    },
    autoRotate: {
      type: Boolean,
      default: true
    },
    interactive: {
      type: Boolean,
      default: true
    },
    /**
     * lowest bump severity worth showing: 1 = penalises Low/VeryLow, 2 = + Medium,
     * 3 = + High. Bumps below it cost no car anything (a gentle 8 cm rise, say) and are
     * neither painted red nor listed. 0 shows every detected bump.
     */
    minSeverity: {
      type: Number,
      default: 1
    },
    /**
     * Optional palette indexed by the track's `surf` section, e.g.
     * ['#ffffff', '#ffb454', '#4fd1c5'] paints surf 0 white, surf 1 amber, surf 2 teal.
     * Missing or short entries fall back to white. Red bump stretches always win.
     */
    surfaceColors: {
      type: Array,
      default: null
    },
    showHud: {
      type: Boolean,
      default: false
    },
    showLegend: {
      type: Boolean,
      default: false
    },
    showBumps: {
      type: Boolean,
      default: true
    },
    maxBumpRows: {
      type: Number,
      default: 5
    },
    /** anything from DEFAULTS above: pitch, rotateSpeed, grid, colors, ... */
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      data: this.track,
      error: ''
    }
  },
  watch: {
    track(next) {
      this.data = next;
      this.push();
    },
    src() {
      this.fetchTrack();
    },
    trackCode() {
      this.fetchTrack();
    },
    autoRotate(v) {
      this.view && this.view.setOptions({ autoRotate: v });
    },
    mirrored(v) {
      this.view && this.view.setOptions({ mirror: v });
    },
    minSeverity(v) {
      this.view && this.view.setOptions({ minSeverity: v });
    },
    surfaceColors: {
      deep: true,
      handler(v) {
        this.view && this.view.setOptions({ surfaceColors: v });
      }
    },
    options: {
      deep: true,
      handler(v) {
        this.view && this.view.setOptions(v);
      }
    },
    // canvas text is painted, not rendered, so $t() cannot re-run on its own
    '$i18n.locale'() {
      this.view && this.view.setOptions(this.markerLabels);
    }
  },
  beforeMount() {},
  mounted() {
    // kept off `data` on purpose: the renderer owns the scene graph and must not be
    // walked by Vue's observer
    this.view = create(this.$refs.canvas, this.data, Object.assign({
      autoRotate: this.autoRotate,
      interactive: this.interactive,
      mirror: this.mirrored,
      minSeverity: this.minSeverity,
      surfaceColors: this.surfaceColors,
      background: null
    }, this.markerLabels, this.options));
    if (!this.data && this.trackUrl) this.fetchTrack();
  },
  beforeDestroy() {
    if (this.view) this.view.destroy();
    this.view = null;
  },
  computed: {
    bumps() {
      let all = (this.data && this.data.bumps) || [];
      return all.filter(bump => (bump.s || 0) >= this.minSeverity);
    },
    visibleBumps() {
      return this.bumps.slice(0, this.maxBumpRows);
    },
    /*
     * Reflected left/right on the way in when the spline behind this track is one of the
     * mirrored ones. Start and finish stay where they are -- only the handedness of the
     * corners flips.
     */
    mirrored() {
      return !notMirroredSplines.includes(splineDict[this.trackCode][0]);
    },
    // an explicit src wins; otherwise the track code picks the shared spline
    trackUrl() {
      if (this.src) return this.src;

      let spline = splineDict[this.trackCode];
      if (!spline || !spline[0]) {
        this.$emit('startingMph', 0);
        return ''
      };
      // console.log(`/splines/${spline[0]}.track.json`);
      // "/splines/InfiniteKDrag.track.json"
      // "/splines/InfiniteKDragTrackSpline.track.json"
      this.$emit('startingMph', spline[3] || 0);
      return `/splines/${spline[0]}.track.json`;
    },
    markerLabels() {
      return {
        labelStart: this.$t('m_start'),
        labelFinish: this.$t('m_finish'),
        labelStartFinish: `${this.$t('m_start')} / ${this.$t('m_finish')}`
      }
    }
  },
  methods: {
    severityText(severity) {
      if (!severity) return ``;
      if (severity === 1) return `${this.$t('c_low')}`;
      if (severity === 2 || severity === 3) return `${this.$t('c_low')}, ${this.$t('c_mid')}`;
      // if (severity === 3) return `${this.$t('c_low')}, ${this.$t('c_mid')}, ${this.$t('c_high')}`;
      return '';
    },
    push() {
      this.error = '';
      if (this.view) this.view.setData(this.data);
    },
    fetchTrack() {
      let url = this.trackUrl;
      this.error = '';
      if (!url) {
        this.data = null;
        this.push();
        return;
      }
      fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (this.trackUrl !== url) return;   // a newer request won
        this.data = json;
        this.$emit('trackLength', json.len || 0);
        this.push();
        this.$emit('loaded', json);
      })
      .catch(error => {
        this.error = this.$t('p_trackLoadFailed', { error: error.message });
        this.$emit('error', error);
      });
    },
    /** re-centre the camera */
    resetView() {
      this.view && this.view.resetView();
    }
  },
}
</script>

<style>
.TrackViewer_Layout {
  /* mirrors DEFAULTS.trackColor / bumpColor / startColor / finishColor above */
  --tv-track: #ffffff;
  --tv-bump: #ff3b30;
  --tv-start: #38e08a;
  --tv-finish: #4da3ff;

  position: relative;
  width: calc(100% + 30px);
  margin-left: -15px;
  height: var(--tv-height);
  overflow: hidden;
  border-radius: 10px;
  /* background-color: hsl(var(--back-h), var(--back-s), 9%);
  background-image: radial-gradient(120% 90% at 50% 15%,
    hsl(var(--back-h), var(--back-s), 14%) 0%,
    hsl(var(--back-h), var(--back-s), 9%) 60%,
    hsl(var(--back-h), var(--back-s), 6%) 100%); */
  color: var(--d-text-b);
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  line-height: 1.5;
}
.TrackViewer_Canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.TrackViewer_Hud {
  position: absolute;
  left: 14px;
  top: 11px;
}
.TrackViewer_HudTitle {
  font-size: 1.15em;
  font-weight: bold;
}
.TrackViewer_HudSub {
  font-size: 0.9em;
  color: var(--d-text);
  opacity: 0.7;
  margin-top: 2px;
}
.TrackViewer_Legend {
  position: absolute;
  right: 14px;
  top: 11px;
  font-size: 0.9em;
  color: var(--d-text);
  opacity: 0.7;
  pointer-events: none;
}
.TrackViewer_LegendItem {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}
.TrackViewer_LegendDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.TrackViewer_LegendDotTrack {
  background-color: var(--tv-track);
}
.TrackViewer_LegendDotBump {
  background-color: var(--tv-bump);
}
.TrackViewer_LegendDotStart {
  background-color: var(--tv-start);
}
.TrackViewer_LegendDotFinish {
  background-color: var(--tv-finish);
}
.TrackViewer_Bumps {
  position: absolute;
  left: 1%;
  bottom: 1%;
  max-width: 62%;
  font-size: 1.2em;
  pointer-events: none;
}
.TrackViewer_BumpsTitle {
  display: flex;
  align-items: center;
  gap: 0.25em;
}
.TrackViewer_BumpIcon {
  font-size: 1.5em;
}
.TrackViewer_BumpsItem {
  color: var(--d-text);
  opacity: 0.7;
}
.TrackViewer_Error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 0.9em;
  color: rgb(var(--d-text-red-b));
}
</style>
