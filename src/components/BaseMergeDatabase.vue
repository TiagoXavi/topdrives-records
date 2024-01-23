<template>
  <div class="hutch_MergeDatabase_Layout">

  </div>
</template>

<script>
import cars_final from '../database/cars_final.json'
try {
  var hutch = require('../database/hutch_official.json');
} catch (error) {
  
}

export default {
  name: 'BaseMergeDatabase',
  components: {
    // BaseDetalheHeader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hutch,
      cars_final
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    this.hutch.map(hut => {

      let rq;
      let year;
      let hand;
      let topSpeed;
      let tyres;
      let weight;
      let seats;
      let engine;
      let clearance;
      let drive;
      let fuel;
      let tcs;
      let abs;
      let prize;

      if (hut.Tyres === "Offroad") hut.Tyres = "Off-road";
      if (hut.Tyres === "HiPerformance") hut.Tyres = "Performance";
      if (hut.Tyres === "All-Surface") hut.Tyres = "All-surface";
      if (hut.Tyres === "Slicks") hut.Tyres = "Slick";
      if (hut.Tyres === "Tourism") hut.Tyres = "Standard";
      if (hut["Engine Position"] === "MidRear") hut["Engine Position"] = "Mid-rear";
      if (typeof hut.Mass === "string") hut.Mass = Number(hut.Mass.replaceAll(",", ""));

      let temp = [];

      this.cars_final.filter(my => {
        
        rq = hut["Hand Rating"] === my.rq;
        year = hut["Year"] === my.year;
        hand = hut["Grip"] === my.hand;
        topSpeed = hut["Top Speed"] === my.topSpeed;
        weight = hut["Mass"] === my.weight;
        tyres = hut["Tyres"] === my.tyres;
        seats = hut["Seats"] === Number(my.seats);


        engine = hut["Engine Position"].toLowerCase() === my.engine.toLowerCase();
        clearance = (hut["Ground Clearance"].toLowerCase() === my.clearance.toLowerCase() || (hut["Ground Clearance"].toLowerCase() === "medium") && my.clearance === "Mid");
        drive = (hut["Drive Type"].toLowerCase() === my.drive.toLowerCase() || (hut["Drive Type"].toLowerCase() === "fourwd") && my.drive === "4WD");
        fuel = (hut["Fuel"].toLowerCase() === my.fuel.toLowerCase() || (hut["Fuel"].toLowerCase() === "miscellaneous") && my.fuel.toLowerCase() === "misc");
        tcs = ((hut["Traction Control"] === "FALSE" && my.tcs === false) || (hut["Traction Control"] === "TRUE" && my.tcs === true));
        abs = ((hut["ABS"] === "FALSE" && my.abs === false) || (hut["ABS"] === "TRUE" && my.abs === true));
        prize = ((hut["Card Type"] === "Normal" && !my.prize) || (hut["Card Type"] === "Prize" && my.prize === true));

        if (rq && year && hand && topSpeed && seats && clearance && drive && fuel && tcs && abs && prize && weight && engine && tyres) {
          temp.push(JSON.parse(JSON.stringify(my)));
          temp[temp.length - 1].allStats = true;
          return;
        }
        let hutName = `${hut["Model"]}_${hut["Year"]}`.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
        let myName = `${my.onlyName}_${my.year}`.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
        if (hutName == myName) {
          temp.push(JSON.parse(JSON.stringify(my)));
          return;
        }

        if (`${hut["Manufacturer Name"]} ${hut["Model"]}` === "Citroën DS Numéro 9" && my.rid === "DS_DS_Numero_9_2012") return true;
        // if (`${hut["Manufacturer Name"]} ${hut["Model"]}` === "Volvo P1800" && my.rid === "Volvo_P1800_1961") return true;
        // if (`${hut["Manufacturer Name"]} ${hut["Model"]}` === "AMC Rebel Machine" && my.rid === "AMC_Rebel_Machine_1970") return true;
        // if (`${hut["Manufacturer Name"]} ${hut["Model"]}` === "Ford Mustang Cobra Jet 1400" && my.rid === "Ford_Mustang_Cobra_Jet_1400_2020") return true;
        // if (`${hut["Manufacturer Name"]} ${hut["Model"]}` === "Hyundai Pony Coupe" && my.rid === "Hyundai_Pony_Coupe_1974") return true;
        // if (`${hut["Manufacturer Name"]} ${hut["Model"]}` === "Hyundai Accent WRC" && my.rid === "Hyundai_Pony_Coupe_1974") return true;

        if (`${hut["Manufacturer Name"]} ${hut["Model"]}` === "Oldsmobile Achieva SCX" && my.rid === "Oldsmobile_Achieva_SCX_1993") {
          debugger;
        }
      })
      if (temp.length === 0) {
        console.log( `${hut["Manufacturer Name"]} ${hut["Model"]}`  )
        console.log( "-" )

        console.log( hut["Hand Rating"], "rq" )
        console.log( hut["Year"], "year" )
        console.log( hut["Grip"], "hand" )
        console.log( hut["Top Speed"], "topSpeed" )
        console.log( hut["Seats"], "seats" )
        console.log( hut["Ground Clearance"], "clearance" )
        console.log( hut["Drive Type"], "drive" )
        console.log( hut["Fuel"].toLowerCase(), "fuel" )
        console.log( hut["Traction Control"], "tcs" )
        console.log( hut["ABS"], "abs" )
        console.log( hut["Card Type"], "prize" )

        console.log( hut["Tyres"], "prize" )
        console.log( hut["Mass"], "weight" )
        console.log( hut["Engine Position"], "engine" )
        // console.log(hut);
        debugger;
        console.log("not found", hut["Card GUID"]);

      }
      if (temp.length > 1) {
        let found = temp.find(x => x.allStats);
        if (found) {
          temp = temp.filter(x => x.allStats);
        }
      }
      if (temp.length > 1) {
        temp = temp.filter(my => {
          let hutName = `${hut["Model"]}`.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
          let myName = my.onlyName.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
          if (hutName == myName) {
            return true
          }
        })
      }
      if (temp.length > 1) {
        console.log(">1", hut["Card GUID"], temp.map(x => x.rid));
      }
      if (temp.length === 1) {
        this.cars_final.find(x => {
          if (x.rid === temp[0].rid) {
            x.guid = hut["Card GUID"];
            return true;
          }
        })
      }
    });

    console.log(this.cars_final);
    debugger;
  },
  computed: {},
  methods: {},
}
</script>

<style>
</style>