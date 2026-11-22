<template>
  <div class="BasePackDetail_Layout">
    <div class="Main_DialogInventoryHeader">
      <BasePackBmp :pack="pack" :size="128" :clicable="false" />
    </div>
    <div class="Main_DialogInventoryBody">
      <div class="Main_DialogInventoryName Space_Top">{{ name }}</div>

      <div v-if="slots.length > 0" class="BasePackDetail_Odds Space_BothGiga">
        <div v-for="(slot, islot) in slots" :key="islot" class="BasePackDetail_LineLayout">
          <div class="BasePackDetail_LineHeader">
            <div class="BasePackDetail_LineIndex">Card {{ islot + 1 }}:</div>
            <BaseFilterDescription
              v-if="detail.resolvedFilters && detail.resolvedFilters[islot]"
              :filter="detail.resolvedFilters[islot]"
              :asFilterLabel="true"
              :showTitle="false"
              :hideIfEmpty="true"
              :emitDescResolved="false"
              class="BasePackDetail_PackDescription"
            />
          </div>
          <div class="BasePackDetail_Line">
            <div
              v-for="odd in slot"
              :key="odd.cls"
              class="BasePackDetail_Card"
              :style="`--cor: ${classColors[odd.cls]}`">
              <div>{{ odd.cls }}</div>
              <div>{{ odd.label }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="detail && detail.description" class="Main_DialogInventoryDescription Space_Top">{{ detail.description }}</div>

      <div v-if="costs.length > 0" class="BasePackDetail_Prices Space_Top">
        <div class="BasePackDetail_PricesLabel">{{ $t('m_cost') }}:</div>
        <div v-for="cost in costs" :key="cost.type" class="BasePackDetail_Price">
          <BaseIconSvg :type="cost.type" :useMargin="false" class="BasePackDetail_PriceIcon" />{{ cost.value.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasePackBmp from './BasePackBmp.vue';
import BaseIconSvg from './BaseIconSvg.vue';
import BaseFilterDescription from './BaseFilterDescription.vue';

// cardGroupTierPercents[i] is the chance of a card being tier i+1 *or better* (cumulative),
// tier 1 = common (F) ... tier 7 = legendary (S).
const TIER_CLASSES = ["F", "E", "D", "C", "B", "A", "S"];

// Names for the legacy packs that come as a type instead of a uuid.
const TYPE_NAMES = {
  carbon: "Carbon Fiber",
  ceramic: "Ceramic",
  aluminium: "Aluminium",
  steel: "Steel",
  plastic: "Plastic"
};

function formatChance(chance) {
  const rounded = parseFloat(chance.toFixed(2));
  return rounded > 0 ? rounded : parseFloat(chance.toPrecision(2));
}

export default {
  name: 'BasePackDetail',
  components: {
    BasePackBmp,
    BaseIconSvg,
    BaseFilterDescription
  },
  props: {
    // Same shape BasePackBmp emits on OPEN_PACK_DETAIL: { uuid, qty } or { type, qty }
    pack: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      classColors: TIER_CLASSES.reduce((all, cls) => {
        all[cls] = Vue.resolveClass(10, cls, "color");
        return all;
      }, {})
    }
  },
  computed: {
    detail() {
      if (!this.pack.uuid) return null;
      return Vue.packs[this.pack.uuid] || null;
    },
    name() {
      if (this.detail) return this.detail.name;
      if (this.pack.type) return TYPE_NAMES[this.pack.type] || this.pack.type;
      return "Unknown pack";
    },
    // One entry per card slot, best class first: [{ cls: "S", label: 2.5 }, ...]
    slots() {
      if (!this.detail || !this.detail.cardPackSlots) return [];
      return this.detail.cardPackSlots.map(slot => {
        const atLeast = slot.cardGroupTierPercents || [];
        const odds = [];
        for (let i = Math.min(atLeast.length, TIER_CLASSES.length) - 1; i >= 0; i--) {
          const chance = (atLeast[i] - (atLeast[i + 1] || 0)) * 100;
          if (chance > 1e-9) odds.push({ cls: TIER_CLASSES[i], label: formatChance(chance) });
        }
        return odds;
      });
    },
    costs() {
      if (!this.detail) return [];
      return [
        { type: "cash", value: this.detail.softCurrency1Cost },
        { type: "gold", value: this.detail.hardCurrency1Cost }
      ].filter(cost => cost.value > 0);
    }
  }
}
</script>

<style>
.BasePackDetail_Odds {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}
.BasePackDetail_Line {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 3px 0;
}
.BasePackDetail_PackDescription {
  margin-bottom: 5px;
}
.BasePackDetail_LineIndex {
  min-width: 1.2em;
  font-size: 12px;
  color: var(--d-text-b);
}
.BasePackDetail_Card {
  display: flex;
  min-width: 4.5em;
  gap: 4px;
}
.BasePackDetail_Card > div:first-child {
  width: 1.3em;
  text-align: center;
  font-weight: bold;
  background-color: var(--cor);
  transform: skewY(9deg);
  color: black;
  opacity: 0.8;
}
.BasePackDetail_Prices {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.BasePackDetail_PricesLabel {
  margin-right: -10px;
}
.BasePackDetail_Price {
  display: flex;
  align-items: center;
}
.BasePackDetail_PriceIcon {
  width: 21px;
  height: 22px;
  margin-right: 3px;
}
</style>
