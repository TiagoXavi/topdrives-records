<template>
  <div class="MainGallery_Layout">
    <div class="MainGallery_Box">
      <div
      v-for="(car, ix) in all_cars"
      class="MainGallery_Item">
      <template>

        <div v-if="Object.keys(diff_cars[ix]).length === 0" class="MainGallery_Empty"></div>
        <template v-else>

          <div
            v-if="diff_cars[ix].rq"
            class="MainGallery_Rq MainGallery_Color">
            {{ diff_cars[ix].rq }}
          </div>

          <div
            v-if="diff_cars[ix].topSpeed"
            class="MainGallery_topSpeed MainGallery_Color">
            {{ diff_cars[ix].topSpeed }}
          </div>

          <div
            v-if="diff_cars[ix].acel"
            class="MainGallery_acel MainGallery_Color">
            {{ diff_cars[ix].acel }}
          </div>

          <div
            v-if="diff_cars[ix].hand"
            class="MainGallery_hand MainGallery_Color">
            {{ diff_cars[ix].hand }}
          </div>

          <div
            v-if="diff_cars[ix].drive"
            class="MainGallery_drive MainGallery_Color">
            {{ diff_cars[ix].drive }}
          </div>

          <div
            v-if="diff_cars[ix].tyres"
            class="MainGallery_tyres MainGallery_Color">
            {{ diff_cars[ix].tyres }}
          </div>

          <div
            v-if="diff_cars[ix].class"
            :style="`--class-color: ${diff_cars[ix].color};`"
            class="MainGallery_Class">
            {{ diff_cars[ix].class }}
          </div>

          <div
            v-if="diff_cars[ix].year"
            class="MainGallery_Year MainGallery_Color">
            {{ diff_cars[ix].year }}
          </div>

          <div
            v-if="diff_cars[ix].clearance"
            class="MainGallery_Clearance MainGallery_Compare">
            <div class="MainGallery_CompareLabel">Clearance</div>
            <div class="MainGallery_Old">{{ diff_cars[ix].clearance }}</div>
            <i class="ticon-arrow_right_3 MainGallery_Between" aria-hidden="true"/>
            <div class="MainGallery_Old">{{ diff_cars[ix]._clearance }}</div>
          </div>

          <div
            v-if="diff_cars[ix].mra"
            :class="{ MainGallery_ColorUp: diff_cars[ix].mra < diff_cars[ix]._mra }"
            class="MainGallery_Mra MainGallery_Compare">
            <div class="MainGallery_CompareLabel">MRA</div>
            <div class="MainGallery_Old">{{ diff_cars[ix].mra || "?" }}</div>
            <i class="ticon-arrow_right_3 MainGallery_Between" aria-hidden="true"/>
            <div class="MainGallery_Old">{{ diff_cars[ix]._mra || "?" }}</div>
          </div>

          <div
            v-if="diff_cars[ix].weight"
            :class="{ MainGallery_ColorUp: diff_cars[ix].weight > diff_cars[ix]._weight }"
            class="MainGallery_Weight MainGallery_Compare">
            <div class="MainGallery_CompareLabel">Weight</div>
            <div class="MainGallery_Old">{{ diff_cars[ix].weight }}</div>
            <i class="ticon-arrow_right_3 MainGallery_Between" aria-hidden="true"/>
            <div class="MainGallery_Old">{{ diff_cars[ix]._weight }}</div>
          </div>

        </template>
        
        <BaseCardGallery
          :car="car"
          :options="false" />

      </template>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCardGallery from './BaseCardGallery.vue'
import data_cars from '../database/cars_final.json'
import pl14 from '../database/cars_final_PL14.json'

export default {
  name: 'MainGallery',
  components: {
    BaseCardGallery
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      all_cars: data_cars,
      pl14: pl14,
      diff_cars: []
    }
  },
  watch: {},
  beforeMount() {
    let difResult = [];

    this.all_cars.map((y, ix) => {
      // if (ix > 200) return;
      let dif = {};

      this.pl14.find(x => {
        if (x.rid === y.rid) {

          if (x.rq !== y.rq) {
            dif.rq = x.rq
            dif._rq = y.rq
          }
          if (x.class !== y.class) {
            dif.class = x.class
            dif._class = y.class
            dif.color = Vue.resolveClass(x.rq, x.class, "color")
          }
          if (x.year !== y.year) {
            dif.year = x.year
            dif._year = y.year
          }
          if (x.abs !== y.abs) {
            dif.abs = x.abs
            dif._abs = y.abs
          }
          if (x.tcs !== y.tcs) {
            dif.tcs = x.tcs
            dif._tcs = y.tcs
          }
          if (x.clearance !== y.clearance) {
            dif.clearance = x.clearance
            dif._clearance = y.clearance
          }
          if (x.topSpeed !== y.topSpeed) {
            dif.topSpeed = x.topSpeed
            dif._topSpeed = y.topSpeed
          }
          if (x.acel !== y.acel) {
            dif.acel = x.acel
            dif._acel = y.acel
          }
          if (x.hand !== y.hand) {
            dif.hand = x.hand
            dif._hand = y.hand
          }
          if (x.drive !== y.drive) {
            dif.drive = x.drive
            dif._drive = y.drive
          }
          if (x.tyres !== y.tyres) {
            dif.tyres = x.tyres
            dif._tyres = y.tyres
          }
          if (x.mra !== y.mra) {
            dif.mra = x.mra
            dif._mra = y.mra
          }
          if (x.weight !== y.weight) {
            dif.weight = x.weight
            dif._weight = y.weight
          }

          return true;

        }
      })

      difResult.push(dif);

    })

    this.diff_cars = difResult;
  },
  mounted() {},
  computed: {},
  methods: {
    carPicture(file) {
      try {
        return require('@/imgs_final/' + file + '.jpg');
      } catch (error) {
        console.log(file);
        return require('@/assets/blank.jpg');
      }
    },
    click(car) {
      console.log(JSON.parse(JSON.stringify(car)));
    },
    carPhoto(car) {
      let parsed;
      try {
        parsed = require('@/imgs_final/' + car.rid + '.jpg');
      } catch (error) {
        return ''
      }
      parsed = parsed.replaceAll("(","\\(").replaceAll(")","\\)");
      parsed = parsed.replaceAll("'","\\'");
      return parsed ? 'background-image: url('+parsed+');' : ''
    }
  },
}
</script>

<style>
.MainGallery_Box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 50px;
}
.MainGallery_Item {
  width: 415px;
  height: 256px;
  position: relative;
}
.MainGallery_Img {
}
.MainGallery_Class {
  background-color: var(--class-color);
  color: black;
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 50%;
  font-weight: bold;
  position: absolute;
  top: 108px;
  font-size: 20px;
  left: 18px;
}
.MainGallery_Color {
  background-color: #a30000;
  padding: 4px 7px;
  font-weight: bold;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 18px;
}
.MainGallery_down {
  color: #ff5050;
  font-size: 25px;
}
.MainGallery_Rq {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 149px;
  right: 362px;
  align-items: center;
}
.MainGallery_Empty + .BaseCardGallery_Layout .Car_Header {
  opacity: 0.3;
}
.MainGallery_topSpeed {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 34px;
  left: 355px;
  align-items: center;
}
.MainGallery_acel {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 73px;
  left: 355px;
  align-items: center;
}
.MainGallery_hand {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 113px;
  left: 355px;
  align-items: center;
}
.MainGallery_drive {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 152px;
  left: 355px;
  align-items: center;
}
.MainGallery_tyres {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 190px;
  right: 121px;
  align-items: center;
}
.MainGallery_Year {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 34px;
  right: 121px;
  align-items: center;
  z-index: 50;
  font-size: 10px;
}
.MainGallery_Clearance {
  top: -20px;
  right: 30px;
}
.MainGallery_Mra {
  top: 190px;
  left: 55px;
}
.MainGallery_Weight {
  top: -21px;
  left: 54px;
}
.MainGallery_Compare {
  display: inline-flex;
  gap: 6px;
  position: absolute;
  color: white;
  align-items: center;
  background-color: #a30000;
  padding: 2px 4px;
  /* position: relative; */
}
.MainGallery_CompareLabel {
  position: absolute;
  top: 7px;
  right: calc(100% + 2px);
  font-size: 11px;
  opacity: 0.4;
}


.MainGallery_ColorUp {
  background-color: #007000;
}
</style>