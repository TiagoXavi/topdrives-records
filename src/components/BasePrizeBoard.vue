<template>
  <div class="MainStuff_PrizeCardsBox">
    <template v-for="(card, iCard) in prizeboard">
      <div v-if="prizeSelectorCard === iCard" class="MainStuff_PrizeSelectorBack" @click="prizeSelectorCard = null;" />
      <div
        v-if="iCard !== 0"
        :class="{ MainStuff_PrizeCard_Active: prizeSelectorCard === iCard }"
        class="MainStuff_PrizeCard">
        <button
          class="D_Button MainStuff_PrizeCardButton"
          @click="prizeSelectorCard = iCard;">
          <div v-if="card === null" class="MainStuff_PrizeBlank">
            <svg class="MainStuff_PrizeBlankSvg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 200 120" style="enable-background:new 0 0 200 120;" xml:space="preserve" preserveAspectRatio="none">
              <rect style="fill:#555;" width="200" height="120"/>
              <g>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="0" y1="15" x2="200" y2="15"/>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="0" y1="45" x2="200" y2="45"/>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="0" y1="75" x2="200" y2="75"/>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="0" y1="105" x2="200" y2="105"/>
              </g>
              <g>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="190.5" y1="-1.5" x2="176.7" y2="121.5"/>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="148.7" y1="-1.5" x2="134.9" y2="121.5"/>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="106.9" y1="-1.5" x2="93.1" y2="121.5"/>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="65.1" y1="-1.5" x2="51.3" y2="121.5"/>
                <line style="fill:none;stroke:#444;stroke-width:5;stroke-miterlimit:10;" x1="23.3" y1="-1.5" x2="9.5" y2="121.5"/>
              </g>
              <line style="fill:none;stroke:#EF5A20;stroke-width:7;stroke-miterlimit:10;" x1="0" y1="0" x2="200" y2="0"/>
              <line style="fill:none;stroke:#EF5A20;stroke-width:7;stroke-miterlimit:10;" x1="0" y1="120" x2="200" y2="120"/>
            </svg>
          </div>
          <div v-if="card === 'gold'" class="MainStuff_PrizeGold MainStuff_PrizeMoney" style="--classC: 251, 173, 20"><BaseIconSvg type="gold" :useMargin="false" class="MainStuff_ClassesIcon" /></div>
          <div v-if="card === 'cash'" class="MainStuff_PrizeCash MainStuff_PrizeMoney" style="--classC: 55, 235, 172"><BaseIconSvg type="cash" :useMargin="false" class="MainStuff_ClassesIcon" /></div>
          <div v-if="card === 'xp'" class="MainStuff_PrizeCash MainStuff_PrizeMoney" style="--classC: 21, 223, 255"><BaseIconSvg type="xp" :useMargin="false" class="MainStuff_ClassesIcon" /></div>
          <div v-if="card === 'd'" class="MainStuff_PrizeD MainStuff_PrizeClass" style="--classC: 28, 204, 255"><div class="MainStuff_PrizeClassesIcon">D</div></div>
          <div v-if="card === 'e'" class="MainStuff_PrizeE MainStuff_PrizeClass" style="--classC: 118, 242, 115"><div class="MainStuff_PrizeClassesIcon">E</div></div>
          <div v-if="card === 'f'" class="MainStuff_PrizeF MainStuff_PrizeClass" style="--classC: 135, 135, 135"><div class="MainStuff_PrizeClassesIcon">F</div></div>
        </button>
        
        <div v-if="prizeSelectorCard === iCard" class="MainStuff_PrizeSelector">
          <button
            v-for="item in prizeTypes"
            class="D_Button MainStuff_EditPrizeButton"
            @click="editPrizeBoard(iCard, item)">
            <div v-if="item === 'gold'" class="MainStuff_PrizeGold MainStuff_PrizeMoney" style="--classC: 251, 173, 20; background-color: transparent;"><BaseIconSvg type="gold" :useMargin="false" class="MainStuff_ClassesIcon" /></div>
            <div v-if="item === 'cash'" class="MainStuff_PrizeCash MainStuff_PrizeMoney" style="--classC: 55, 235, 172; background-color: transparent;"><BaseIconSvg type="cash" :useMargin="false" class="MainStuff_ClassesIcon" /></div>
            <div v-if="item === 'xp'" class="MainStuff_PrizeCash MainStuff_PrizeMoney" style="--classC: 21, 223, 255; background-color: transparent;"><BaseIconSvg type="xp" :useMargin="false" class="MainStuff_ClassesIcon" /></div>
            <div v-if="item === 'd'" class="MainStuff_PrizeD" style="--classC: 28, 204, 255"><div class="MainStuff_PrizeClassesIcon">D</div></div>
            <div v-if="item === 'e'" class="MainStuff_PrizeE" style="--classC: 118, 242, 115"><div class="MainStuff_PrizeClassesIcon">E</div></div>
            <div v-if="item === 'f'" class="MainStuff_PrizeF" style="--classC: 135, 135, 135"><div class="MainStuff_PrizeClassesIcon">F</div></div>
            <div v-if="item === null" class="MainStuff_PrizeD" style="--classC: 28, 204, 255"><i class="ticon-close_3 MainStuff_PrizeClose" aria-hidden="true"/></div>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import BaseIconSvg from "./BaseIconSvg.vue";

export default {
  name: 'BasePrizeBoard',
  components: {
    BaseIconSvg
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      prizeboard: [],
      prizeSelectorCard: null,
      prizeTypes: [null,"gold","cash","xp","d","e","f"]
    }
  },
  watch: {
    id: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.prizeSelectorCard = null;
        this.loadPrizeBoardFromStorage();
      }
    }
  },
  beforeMount() {
    this.loadPrizeBoardFromStorage();
  },
  mounted() {},
  computed: {
    iid() {
      return `${this.id}_pb`
    }
  },
  methods: {
    createNew() {
      let b = [];
      Array.from(Array(16)).map((_, i) => {
        b.push(null);
      });
      this.prizeboard = b;
      this.updatePrizeBoardStorage();
    },
    editPrizeBoard(cardIndex, type) {
      this.prizeboard[cardIndex] = type;
      this.prizeSelectorCard = null;
      this.updatePrizeBoardStorage();
      this.$store.commit("START_LOGROCKET", {});
    },
    loadPrizeBoardFromStorage() {
      if (!this.id) return;

      let storagePrizeBoard = window.localStorage.getItem(this.iid);
      if (storagePrizeBoard) {
        storagePrizeBoard = JSON.parse(storagePrizeBoard);
        if (Array.isArray(storagePrizeBoard) && storagePrizeBoard.length > 0) {
          this.prizeboard = storagePrizeBoard;
        }
      } else {
        this.createNew();
      }
    },
    updatePrizeBoardStorage() {
      window.localStorage.setItem(this.iid, JSON.stringify(this.prizeboard));
    }
  },
}
</script>

<style>
.MainStuff_PrizeBoardsBox {
  margin: 0 auto;
  max-width: 500px;
  margin-bottom: 15px;
}
.MainStuff_PrizeCardsBox {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  max-width: 450px;
  margin: 20px auto 35px auto;
}
.MainStuff_PrizeCard {
  position: relative;
  height: 50px;
}
.MainStuff_PrizeCard_Active {
  z-index: 2;
}
.MainStuff_PrizeBlank {
  width: 100%;
  height: 100%;
}
.MainStuff_PrizeCardButton {
  height: 100%;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
}
.MainStuff_PrizeSelector {
  position: absolute;
  height: 200%;
  width: 200%;
  top: -50%;
  left: -50%;
  background-color: #222;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
}
.MainStuff_PrizeSelectorBack {
  position: absolute;
  height: 96vh;
  width: 96vw;
  top: 0;
  left: 0;
  background-color: transparent;
}
.MainStuff_EditPrizeButton {
  
}
.MainStuff_PrizeClassesIcon {
  text-align: center;
  font-size: 1.2em;
  transform: skewY(9deg);
  font-weight: 700;
  background-color: rgb(var(--classC));
  color: #000;
  display: inline-flex;
  padding: 3px 7px;
  border-radius: 2px;
  opacity: 0.9;
}
.MainStuff_PrizeBlankSvg {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}
.MainStuff_PrizeMoney,
.MainStuff_PrizeClass {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--classC), 0.1);
  border-radius: 6px;
}
.MainStuff_PrizeClass {
  /* width: 20%;
  height: 46%; */
  background-color: rgb(var(--classC), 0.1);
  border-radius: 6px;
}
.MainStuff_ClassesIcon {
  width: 30px;
}
.MainStuff_PrizeClose {
  font-size: 23px;
  color: #a00;
}
</style>