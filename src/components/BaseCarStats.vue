<template>
  <div class="BaseCarStats_Root">
    <div class="BaseCarStats_Line">
      <div class="BaseCarStats_Tile">
        <div class="BaseCarStats_TileValue" :class="{ BaseCarStats_TileCyan: car.clearance === 'Mid', BaseCarStats_TileOrange: car.clearance === 'High' }">{{ $t(`c_${car.clearance.toLowerCase()}`) }}</div>
        <div class="BaseCarStats_TileLabel">{{ $tc("c_clearance", 1) }}</div>
      </div>
      <div class="BaseCarStats_Tile" :class="{ BaseCarStats_Fire: fire.includes('mra') }" style="position: relative;">
        <div class="BaseCarStats_TileValue">
          <template v-if="!mraEditing">
            <span>{{ car.mra || '-' }}</span>
            <button
              v-if="T_S._user && T_S._user.mod"
              :disabled="mraLoading"
              :class="{ D_Button_Loading: mraLoading }"
              class="D_Button D_ButtonDark BaseCarStats_EditMraButton"
              @click="mraEditing = true;">
              <i class="ticon-pencil" aria-hidden="true"/>
            </button>
          </template>
          <template v-else>
            <BaseText
              v-model="mraEditInput"
              :acel="car.acel"
              type="mra"
              class="Row_FieldStat BaseCarStats_EditMraField"
              placeholder="type..."
              @change="sendMra()" />
          </template>
        </div>
        <div class="BaseCarStats_TileLabel">MRA</div>
      </div>
      <button class="BaseCarStats_Tile BaseCarStats_TileButton D_Button" :class="{ BaseCarStats_Fire: fire.includes('ola') }" @click="detail('ola')">
        <div class="BaseCarStats_TileValue" :class="{ Row_DialogCardStatRed: car.ola <= 5 }">{{ car.ola }}</div>
        <div class="BaseCarStats_TileLabel">OLA</div>
      </button>
      <div class="BaseCarStats_Tile">
        <div :class="{ Row_DialogCardStatCorrect: car.weight <= 600, Row_DialogCardStatRed: car.weight >= 2500 }"  class="BaseCarStats_TileValue">{{ car.weight }}</div>
        <div class="BaseCarStats_TileLabel">{{ $tc("c_weight", 1) }}</div>
      </div>
      
    </div>
    <div class="BaseCarStats_Line">
      <div class="BaseCarStats_Tile BaseCarStats_TileGreen" :class="{ BaseCarStats_TileRed: !car.abs }">
        <div class="BaseCarStats_TileValue">
          <i v-if="car.abs" class="ticon-correct_1 BaseCarStats_GreenIcon" aria-hidden="true"/>
          <i v-else class="ticon-close_3 BaseCarStats_RedIcon" aria-hidden="true"/>
        </div>
        <div class="BaseCarStats_TileLabel">ABS</div>
      </div>
      <div class="BaseCarStats_Tile BaseCarStats_TileGreen" :class="{ BaseCarStats_TileRed: !car.tcs }">
        <div class="BaseCarStats_TileValue">
          <i v-if="car.tcs" class="ticon-correct_1 BaseCarStats_GreenIcon" aria-hidden="true"/>
          <i v-else class="ticon-close_3 BaseCarStats_RedIcon" aria-hidden="true"/>
        </div>
        <div class="BaseCarStats_TileLabel">TCS</div>
      </div>
      <button class="BaseCarStats_Tile BaseCarStats_TileButton D_Button" @click="detail('brake')">
        <div :class="{ Row_DialogCardStatCorrect: car.brake === 'A', Row_DialogCardStatRed: car.brake === 'C' }" class="BaseCarStats_TileValue">{{ car.brake }}</div>
        <div class="BaseCarStats_TileLabel">{{ $t("c_brake") }}</div>
      </button>
      <button class="BaseCarStats_Tile BaseCarStats_TileButton D_Button" :class="{ BaseCarStats_Fire: fire.includes('hill') }" @click="detail('hill')">
        <div :class="{ Row_DialogCardStatCorrect: car.hill > 0 }" class="BaseCarStats_TileValue">{{ car.hill }}</div>
        <div class="BaseCarStats_TileLabel">HCB</div>
      </button>

    </div>

    <div class="BaseCarStats_Line">
      <div class="BaseCarStats_Tile">
        <div class="BaseCarStats_TileValue">{{ $t(`c_${car.fuel.toLowerCase()}`) }}</div>
        <div class="BaseCarStats_TileLabel">{{ $tc("c_fuel", 1) }}</div>
      </div>
      <div class="BaseCarStats_Tile">
        <div class="BaseCarStats_TileValue">{{ car.seats }}</div>
        <div class="BaseCarStats_TileLabel">{{ $t("c_seats") }}</div>
      </div>
      <div class="BaseCarStats_Tile">
        <div class="BaseCarStats_TileValue">
          <template v-for="(body, index) in car.bodyTypes">
            <template v-if="index !== 0">,&nbsp;</template>
            <template>{{ $t(`c_${body.toLowerCase()}`) }}</template>
          </template>
        </div>
        <div class="BaseCarStats_TileLabel">{{ $t("c_bodyStyle") }}</div>
      </div>
      <div class="BaseCarStats_Tile">
        <div class="BaseCarStats_TileValue">{{ $t(`c_${car.engine.toLowerCase()}Engine`) }}</div>
        <div class="BaseCarStats_TileLabel">{{ $t("c_enginePos") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseText from './BaseText.vue';
import { tdrStore } from '@/tdrStore.js';

export default {
  name: 'BaseCarStats',
  components: {
    BaseText
  },
  props: {
    car: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      T_S: tdrStore(),
      mraEditing: false,
      mraEditInput: null,
      mraLoading: false,
      fire: []
    }
  },
  watch: {
    car() {
      this.init();
    }
  },
  beforeMount() {},
  mounted() {
    this.init();
  },
  computed: {},
  methods: {
    init() {
      this.fire = [];
      if (this.car.mra) {
        let score = (this.car.mra - 60) / this.car.rq;
        if (score >= 0.44) this.fire.push("mra");
      }
      if (this.car.ola >= 17) {
        this.fire.push("ola");
      }
      if (this.car.hill > 50) {
        this.fire.push("hill");
      }
    },
    detail(type) {
      if (type === "brake") this.$store.commit('OPEN_BRAKES');
      if (type === "ola") this.$store.commit('OPEN_OLA');
      if (type === "hill") this.$store.commit('OPEN_HILL');
    },
    sendMra() {
      console.log(this.mraEditInput);
      if (!this.mraEditInput) return;
      let rid = this.car.rid;
      let newMRA = Number(this.mraEditInput);

      this.mraLoading = true;

      axios.post(Vue.preUrl + "/setMra", {
        rid: rid,
        mra: this.mraEditInput
      })
      .then(res => {
        this.mraEditing = false;
        this.car.mra = newMRA;

        // Vue.all_carsObj[rid].photo
        Vue.set(Vue.all_carsObj[rid], "mra", newMRA);
        // this.all_cars.find(x => {
        //   if (x.rid === rid) {
        //     return true
        //   }
        // })
        this.$emit("mraChanged", newMRA);

      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.mraLoading = false;
      });
    },
  },
}
</script>

<style>
.BaseCarStats_Root {
  display: flex;
  flex-direction: column;
  width: 100%;
  --gap: 7px;
  gap: var(--gap);
}
.BaseCarStats_Line {
  justify-content: center;
  gap: var(--gap);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
}
.BaseCarStats_Tile {
  display: flex;
  flex-direction: column;
  gap: 1px;
  justify-content: flex-start;
  padding: 5px 9px 2px 9px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  color: var(--d-text-b);
}
.BaseCarStats_TileValue {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.BaseCarStats_TileLabel {
  font-size: 0.8em;
  opacity: 0.4;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.BaseCarStats_Fire {
  position: relative;
  overflow: hidden;
  color: rgb(var(--d-text-yellow));
}
.BaseCarStats_Fire:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(/assets/fire.png);
  background-size: 80%;
  background-position: 50% 60%;
  background-repeat: no-repeat;
  opacity: 0.1;
  pointer-events: none;
}
.BaseCarStats_GreenIcon {
  color: rgb(var(--d-text-green));
}
.BaseCarStats_RedIcon {
  color: rgb(var(--d-text-red));
}
.BaseCarStats_TileGreen {
  background-color: rgba(135, 255, 0, 0.06);
}
.BaseCarStats_TileRed {
  background-color: rgba(255, 67, 67, 0.07);
}
.BaseCarStats_TileCyan {
  /* background-color: rgba(0, 255, 255, 0.06); */
  color: rgb(79, 211, 195);
}
.BaseCarStats_TileOrange {
  /* background-color: rgba(255, 151, 43, 0.08); */
  color: rgb(var(--color-dirt));
}
.BaseCarStats_EditMraButton {
  opacity: 0;
  font-size: 12px;
  padding: 0 5px;
  --height: 28px;
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  min-width: unset;
  background-color: rgba(0, 0, 0, 0.0);
  color: grey;
}
.BaseCarStats_Tile:hover .BaseCarStats_EditMraButton,
.BaseCarStats_Tile:focus-within .BaseCarStats_EditMraButton {
  opacity: 1;
}
.BaseCarStats_EditMraField > input {
  margin-top: -1px;
  padding: 5px 6px;
}
.BaseCarStats_TileButton {
  font-size: inherit;
  line-height: inherit;
}
</style>