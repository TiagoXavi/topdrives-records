<template>
  <div class="MainPacks_Layout">

    <div class="MainPacks_ChipBox">
      <div class="Main_FilterChipsFlex">
        <template v-for="(item, ix) in packTypes">
          <BaseChip
            v-model="packModel"
            :value="item" 
            :label="item.name"
            :disabled="running"
            :style="`--cor: ${item.color}`"
            required="true"
            class="BaseChip_MinWidth BaseChip_DontCrop MainPacks_ChipPack" />
        </template>
        <button class="BaseChip BaseChip_MinWidth BaseChip_DontCrop MainPacks_ChipMore" @click="otherPacksDialog = true;">
          <i class="ticon-plus_2 MainPacks_ChipMoreIcon" aria-hidden="true"/>
        </button>
      </div>
    </div>
    <div v-if="packModel && packModel.name" class="MainPacks_PacksOdsBox">
      <div class="MainPacks_CustomizePackLayout">
        <div class="MainPacks_CustomizePackBox" :class="`BasePackSvg_C_${packModel.packColor.name.replaceAll(' ', '_')}`" :style="`--cor: ${packModel.packColor.gStrip1}`">
          <button
            class="D_Button MainPacks_CustomizeButton"
            :disabled="running"
            @click="openPacksFitlerDialog()">
            <BasePackSvg :packColors="packModel.packColor" class="MainPacks_PackButton" />
            <div v-if="packFilterDescResolved.length === 0" class="MainPacks_CustomizeIcon">
              <i class="ticon-pencil" aria-hidden="true"/>
            </div>
            <BaseFilterDescription
              :filter="packFilter"
              :asFilterLabel="true"
              :hideIfEmpty="true"
              :emitDescResolved="true"
              class="MainPacks_PackDescription"
              @descResolved="packFilterDescResolved = $event;" />
          </button>
        </div>
        
      </div>

      <div v-if="ratesCompact" class="" @click="ratesCompact = !ratesCompact">
        <div class="MainPacks_CardLine" style="justify-content: center;">
          <div v-if="ratesPerCls.S" class="MainPacks_Card" :style="`--cor: ${classes.S}`"><div>S</div><div>{{ ratesPerCls.S.toFixed(2) }}%</div></div>
          <div v-if="ratesPerCls.A" class="MainPacks_Card" :style="`--cor: ${classes.A}`"><div>A</div><div>{{ ratesPerCls.A.toFixed(2) }}%</div></div>
          <div v-if="ratesPerCls.B" class="MainPacks_Card" :style="`--cor: ${classes.B}`"><div>B</div><div>{{ ratesPerCls.B.toFixed(2) }}%</div></div>
          <div v-if="ratesPerCls.C" class="MainPacks_Card" :style="`--cor: ${classes.C}`"><div>C</div><div>{{ ratesPerCls.C.toFixed(2) }}%</div></div>
          <div v-if="ratesPerCls.D" class="MainPacks_Card" :style="`--cor: ${classes.D}`"><div>D</div><div>{{ ratesPerCls.D.toFixed(2) }}%</div></div>
          <div v-if="ratesPerCls.E" class="MainPacks_Card" :style="`--cor: ${classes.E}`"><div>E</div><div>{{ ratesPerCls.E.toFixed(2) }}%</div></div>
          <div v-if="ratesPerCls.F" class="MainPacks_Card" :style="`--cor: ${classes.F}`"><div>F</div><div>{{ ratesPerCls.F.toFixed(2) }}%</div></div>
        </div>
      </div>
      <div v-if="!ratesCompact" class="" @click="ratesCompact = !ratesCompact">
        <div v-for="(card, icard) in currentPackCards" class="MainPacks_CardLine">
          <div class="MainPacks_">{{ icard+1 }}: </div>
          <div v-if="card.S" class="MainPacks_Card" :style="`--cor: ${classes.S}`"><div>S</div><div>{{ card.S }}%</div></div>
          <div v-if="card.A" class="MainPacks_Card" :style="`--cor: ${classes.A}`"><div>A</div><div>{{ card.A }}%</div></div>
          <div v-if="card.B" class="MainPacks_Card" :style="`--cor: ${classes.B}`"><div>B</div><div>{{ card.B }}%</div></div>
          <div v-if="card.C" class="MainPacks_Card" :style="`--cor: ${classes.C}`"><div>C</div><div>{{ card.C }}%</div></div>
          <div v-if="card.D" class="MainPacks_Card" :style="`--cor: ${classes.D}`"><div>D</div><div>{{ card.D }}%</div></div>
          <div v-if="card.E" class="MainPacks_Card" :style="`--cor: ${classes.E}`"><div>E</div><div>{{ card.E }}%</div></div>
          <div v-if="card.F" class="MainPacks_Card" :style="`--cor: ${classes.F}`"><div>F</div><div>{{ card.F }}%</div></div>
        </div>
      </div>
    </div>

    <div v-if="packModel && packModel.name" class="MainPacks_GoalLayout Space_TopPlus">
      <div class="MainPacks_ChipBox">
        <div class="Main_FilterChipsFlex">
          <template v-for="(item, ix) in goalList">
            <BaseChip
              v-model="goalModel"
              :class="`MainPacks_`"
              :value="item" 
              :label="item.label"
              :disabled="running"
              required="true"
              class="BaseChip_MinWidth BaseChip_DontCrop" />
          </template>
        </div>
      </div>
    </div>

    <div v-if="goalModel && goalModel.name === 'noGoal'" class="MainPacks_NumOpenLayout Space_TopPlus MainPacks_Center">
      <BaseText
        v-model="numberOfOpensNoGoal"
        type="integer"
        :label="$t('m_count')"
        class="MainPacks_NumOpenInput"
        placeholder="" />
      <div class="MainPacks_NumOpenPriceBox">
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="cash" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel.priceCash * numberOfOpensNoGoal).toLocaleString() }}</div>
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="gold" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel.priceGold * numberOfOpensNoGoal).toLocaleString() }}</div>
      </div>
    </div>

    <div v-if="goalModel && goalModel.name === 'specificCar'" class="MainPacks_SpecificCar Space_TopPlus">
      
      <div class="MainPacks_CarsList" :class="{ MainPacks_CarsListEmpty: carDetailsList.length === 0 }">
        
        <template v-for="car in carDetailsList">
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 MainPacks_CarButton"
            @click="removeCar(car)">
            <div class="MainPacks_CarCard" :style="`--color: ${car.color}`">
              <div class="MainPacks_BankPhoto">
                <img :src="car.photo" class="MainPacks_BankPhotoImg" alt="">
              </div>
              <div class="MainPacks_RQ">{{ car.rq }}</div>
            </div>
          </button>
        </template>
        <div class="MainPacks_AddCarBox">
          <button
            class="D_Button D_ButtonDark MainPacks_SearchCarButton"
            @click="searchFilterDialog = true;">
            <i class="ticon-plus_2 MainPacks_AddIcon" aria-hidden="true"/>
            <div v-if="carDetailsList.length === 0" class="MainPacks_AddLabel" style="margin-left: 5px;">{{ $t("m_searchCar") }}</div>
          </button>
        </div>
      </div>
    </div>

    <div v-if="goalModel && goalModel.name === 'specificCar' && carDetailsList.length > 1" class="MainPacks_SwitchBox MainPacks_Center Space_TopPlus" style="flex-direction: column;">
      <BaseSwitch v-model="simulateUntilGetOne" :label="$t('m_simulateUntilGetOne')" :horizontal="true" :disabled="running" />
      <BaseSwitch v-model="simulateUntilGetAll" :label="$t('m_simulateUntilGetAll')" :horizontal="true" :disabled="running" />
    </div>

    <div v-if="goalModel && goalModel.name === 'specificAttr'" class="MainPacks_FilterBox">
      <div class="MainPacks_ChartFilter Main_DarkScroll">
        <template v-if="chartFilter">
          <div class="Cg_Reqs">
            <BaseFilterDescription :filter="chartFilter" :asFilterLabel="true" />
          </div>
        </template>
        <div class="Cg_FilterButtons">
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
            @click="openChartOfDialog()">{{ chartFilter ? $t("m_change") : $t("m_requirements") }}</button>
        </div>
      </div>
    </div>

    <div v-if="goalModel && goalModel.name === 'specificAttr'" class="MainPacks_SwitchBox MainPacks_Center Space_TopPlus" style="flex-direction: column;">
      <BaseText
        v-model="numberOfMatchesNeededAttr"
        type="integer"
        :label="$t('m_quantityOfCars')"
        class="MainPacks_NumOpenInput"
        placeholder="" />
    </div>
    

    <div v-if="ready" class="MainPacks_FinishButtonBox MainPacks_Center" style="margin-top: 30px;">
      <button
        :disabled="!running"
        class="D_Button Main_SaveAllButton D_ButtonRed"
        @click="stop = true;">{{ $t("m_stop") }}</button>
      <button
        :disabled="running"
        class="D_Button Main_SaveAllButton"
        @click="run()">{{ $t("m_simulate") }}</button>
      <!-- <button class="D_Button MainPacks_ConfigButton" @click="optionsDialog = true;">
        <i class="ticon-gear MainPacks_ConfigIcon" aria-hidden="true"/>
      </button> -->
    </div>

    <div v-if="showResult" class="MainPacks_Result MainPacks_Center" style="margin-top: 50px;">
      <div class="MainPacks_ResultCounts">
        <div :class="{ MainPacks_CardLineStoped: !running }" class="MainPacks_CardLine MainPacks_ResultLine" style="justify-content: center;">
          <button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.S}; min-width: 3.5em;`" :disabled="simulateRunStats.S === 0" @click="seeCars('S')"><div>S</div><div>{{ simulateRunStats.S }}</div></button>
          <button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.A}; min-width: 3.5em;`" :disabled="simulateRunStats.A > 300 || simulateRunStats.A === 0" @click="seeCars('A')"><div>A</div><div>{{ simulateRunStats.A }}</div></button>
          <button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.B}; min-width: 3.5em;`" :disabled="simulateRunStats.B > 300 || simulateRunStats.B === 0" @click="seeCars('B')"><div>B</div><div>{{ simulateRunStats.B }}</div></button>
          <button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.C}; min-width: 3.5em;`" :disabled="simulateRunStats.C > 300 || simulateRunStats.C === 0" @click="seeCars('C')"><div>C</div><div>{{ simulateRunStats.C }}</div></button>
          <button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.D}; min-width: 3.5em;`" :disabled="simulateRunStats.D > 300 || simulateRunStats.D === 0" @click="seeCars('D')"><div>D</div><div>{{ simulateRunStats.D }}</div></button>
          <button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.E}; min-width: 3.5em;`" :disabled="simulateRunStats.E > 300 || simulateRunStats.E === 0" @click="seeCars('E')"><div>E</div><div>{{ simulateRunStats.E }}</div></button>
          <button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.F}; min-width: 3.5em;`" :disabled="simulateRunStats.F > 300 || simulateRunStats.F === 0" @click="seeCars('F')"><div>F</div><div>{{ simulateRunStats.F }}</div></button>
        </div>
      </div>
      <div class="MainPacks_ResultInfos">
        <div class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_count') }}</div>
          <div class="MainPacks_InfoValue">{{ simulateRunStats.count }}</div>
        </div>
        <div v-if="goalModel && goalModel.name !== 'noGoal'" class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_probabilityPerOpen') }}</div>
          <div class="MainPacks_InfoValue">{{ simulateRunStats.probabilityPerOpen.toFixed(2) }}%</div>
        </div>
        <div v-if="goalModel && goalModel.name !== 'noGoal'" class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_cumulativeProbability') }}</div>
          <div class="MainPacks_InfoValue">{{ simulateRunStats.cumulativeProbability.toFixed(2) }}%</div>
        </div>
        <div class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_status') }}</div>
          <div class="MainPacks_InfoValue MainPacks_InfoStatus" :class="`MainPacks_S_${statusCalc.replaceAll(' ', '_')}`">{{ statusCalc }}</div>
        </div>
      </div>
      <div class="MainPacks_NumOpenPriceBox">
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="cash" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel.priceCash * simulateRunStats.count).toLocaleString() }}</div>
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="gold" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel.priceGold * simulateRunStats.count).toLocaleString() }}</div>
      </div>
    </div>

    <div v-if="showResult && showingDroppedCars" class="MainPacks_SpecificCar Space_TopPlus">
      <div class="MainPacks_CarsList">

        <template v-for="car in listDroppedCars">
          <button
            :key="car.rid"
            class="D_Button D_ButtonDark D_ButtonDark2 MainPacks_CarButton"
            @click="eventOpenShowCarDialog(car)">
            <div class="MainPacks_CarCard" :style="`--color: ${car.color}`">
              <div class="MainPacks_BankPhoto">
                <img :src="car.photo" class="MainPacks_BankPhotoImg" alt="">
              </div>
              <div class="MainPacks_RQ">{{ car.rq }}</div>
              <div v-if="car.count > 1" class="MainPacks_Count">{{ car.count }}x</div>
            </div>
          </button>
        </template>
      </div>
    </div>

    <div v-else-if="showResult" class="MainPacks_SpecificCar Space_TopPlus">
      <div class="MainPacks_CarsList" :class="{ MainPacks_CarsListEmpty: simulateRunStats.matched.length === 0 }">

        <template v-for="car in simulateRunStats.matched">
          <button
            :key="car.rid"
            class="D_Button D_ButtonDark D_ButtonDark2 MainPacks_CarButton"
            @click="eventOpenShowCarDialog(car)">
            <div class="MainPacks_CarCard" :style="`--color: ${car.color}`">
              <div class="MainPacks_BankPhoto">
                <img :src="car.photo" class="MainPacks_BankPhotoImg" alt="">
              </div>
              <div class="MainPacks_RQ">{{ car.rq }}</div>
              <div v-if="car.count > 1" class="MainPacks_Count">{{ car.count }}x</div>
            </div>
          </button>
        </template>

      </div>
    </div>

    <!-- define theme of packs -->
    <!-- also to retrieve avaliable cars -->
    <BaseFilterDialog
      v-model="packFilterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      :config="{
        classes: false,
        rq: false,
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        prizes: false,
        customTags: false
      }"
      ref="packFilter"
      ridsMutationName="FILTER_PACKS_LIMITS"
      @filterUpdate="updateFilterPacks($event)"
      @listRids="filterFinishPacks($event);"
    />

    <!-- Select car -->
    <BaseFilterDialog
      v-model="searchFilterDialog"
      :lastestList="lastestList"
      :highlightsUsers="highlightsUsers"
      :all_cars="all_cars"
      :sortEnabled="true"
      :enableCounters="true"
      :forceNonPrize="true"
      importFilterName="PACKS_FILTER_IMPORT"
      @addCar="addCar($event)"
    />

    
    <!-- set attr cars I want -->
    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      ref="attrFilter"
      ridsMutationName="FILTER_ATTR_RIDS"
      @filterUpdate="updateFilter($event)"
      @listRids="filterFinish($event);"
    />
    

    <BaseDialog
      :active="optionsDialog"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="closeOptionsDialog()">
      <div class="Main_AdvancedDialogBox">
        <div class="Main_DialogTitle">{{ $t("m_options") }}</div>
        <BaseText
          v-model="limit"
          class="BaseText_Big"
          type="tune"
          style="max-width: 150px;"
          :label="$t('m_openLimit')"
          placeholder="" />
      </div>
    </BaseDialog>

    <BaseCarDetailDialog
      :active="tuneDialogActive"
      :car="tuneDialogCar"
      @close="tuneDialogActive = false;" />
      

    <BaseDialog
      :active="otherPacksDialog"
      :transparent="true"
      :lazy="true"
      max-width="400px"
      min-width="240px"
      class="Cg_SelectorDialog"
      @close="otherPacksDialog = false">
      <div style="Cg_SelectorDialogBox">
        <div class="Main_SearchMid Cg_SelectorDialogMid" style="padding-top: 7px;">
          <template v-for="(item, ix) in otherPackTypes">
            <button
              style="padding-left: 15px;"
              class="Main_SearchItem MainPacks_OtherPackItem"
              :style="`--cor: ${item.color}`"
              @click="packModel = item; otherPacksDialog = false;">
              <div class="Main_SearchItemRight">{{ item.name }}</div>
            </button>
          </template>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import BaseFilterDescription from './BaseFilterDescription.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'
import BaseChip from './BaseChip.vue'
import BaseSwitch from './BaseSwitch.vue'
import BaseIconSvg from './BaseIconSvg.vue'
import BaseText from './BaseText.vue'
import BaseDialog from './BaseDialog.vue'
import BaseCarDetailDialog from './BaseCarDetailDialog.vue'
import BasePackSvg from './BasePackSvg.vue'
import all_cars from '../database/cars_final.json'

export default {
  name: 'MainPacks',
  components: {
    BaseFilterDescription,
    BaseFilterDialog,
    BaseChip,
    BaseSwitch,
    BaseIconSvg,
    BaseText,
    BaseDialog,
    BaseCarDetailDialog,
    BasePackSvg
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      packModel: null,
      packTypes: [
        {
          name: "Carbon Fiber",
          color: Vue.resolveClass(10, "B", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#bd1616",
            gStrip2: "#510033",
            name: "CARBON FIBER"
          },
          cards: [
            { S: 2.50, A: 17.75, B: 79.75 },
            { S: 0.50, A: 2.75, B: 7.50, C: 89.25 },
            { C: 10.00, D: 90.00 },
            { C: 5.00, D: 95.00 },
            { C: 5.00, D: 95.00 },
          ],
          priceCash: 0,
          priceGold: 1499
        },
        {
          name: "Ceramic",
          color: Vue.resolveClass(10, "C", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#b5c0c3",
            gBackground2: "#606869",
            gStrip1: "#ffe93a",
            gStrip2: "#c19900",
            name: "CERAMIC"
          },
          cards: [
            { S: 0.65, A: 2.50, B: 14.00, C: 82.85 },
            { S: 0.10, A: 0.25, B: 0.50, C: 34.15, D: 65.00 },
            { C: 2.50, D: 18.50, E: 79.00 },
            { D: 5.00, E: 95.00 },
            { D: 5.00, E: 95.00 },
          ],
          cardsCustom: [
            { S: 0.45, A: 2.00, B: 11.00, C: 86.55 },
            { S: 0.06, A: 0.09, B: 0.33, C: 24.00, D: 75.52 },
            { C: 1.75, D: 16.00, E: 82.25 },
            { D: 5.00, E: 95.00 },
            { D: 5.00, E: 95.00 },
          ],
          priceCash: 32500,
          priceGold: 399
        },
        {
          name: "Aluminium",
          color: Vue.resolveClass(10, "D", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#8b8b8b",
            gBackground2: "#e1e1e1",
            gStrip1: "#009eb9",
            gStrip2: "#049dc1",
            name: "ALUMINIUM"
          },
          cards: [
            { B: 1.50, C: 18.50, D: 80.00 },
            { C: 3.50, D: 20.00, E: 76.50 },
            { D: 2.00, E: 98.00 },
            { D: 2.00, E: 98.00 },
            { D: 2.00, E: 98.00 },
          ],
          cardsCustom: [
            { B: 1.25, C: 17.50, D: 81.25 },
            { C: 3.00, D: 17.50, E: 79.50 },
            { D: 1.50, E: 98.50 },
            { D: 1.50, E: 98.50 },
            { D: 1.50, E: 98.50 },
          ],
          priceCash: 15000,
          priceGold: 239
        },
        {
          name: "Steel",
          color: Vue.resolveClass(10, "E", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#ffffff",
            gBackground2: "#a3a3a3",
            gStrip1: "#0d8700",
            gStrip2: "#499324",
            name: "STEEL"
          },
          cards: [
            { C: 1.00, D: 37.50, E: 61.50 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
          ],
          cardsCustom: [
            { E: 100.00 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
          ],
          priceCash: 7500,
          priceGold: 129
        },
        {
          name: "Plastic",
          color: Vue.resolveClass(10, "F", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#414447",
            gBackground2: "#6b6b6b",
            gStrip1: "#3b3b3b",
            gStrip2: "#4d4d4d",
            name: "PLASTIC"
          },
          cards: [
            { D: 1.50, E: 68.50, F: 30.00 },
            { E: 15.00, F: 85.00 },
            { E: 15.00, F: 85.00 },
            { E: 15.00, F: 85.00 },
            { E: 15.00, F: 85.00 },
          ],
          cardsCustom: [
            { F: 100.00 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
            { D: 1.25, E: 32.00, F: 66.75 },
          ],
          priceCash: 3250,
          priceGold: 59
        },
        
      ],
      otherPackTypes: [
        {
          name: "Finals Titanium",
          color: Vue.resolveClass(10, "A", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#7244dd",
            gStrip2: "#4c38b3",
            name: "FINALS TITANIUM"
          },
          cards: [
            { S: 20.00, A: 80.00 },
            { A: 10.00, B: 90.00 },
            { A: 10.00, C: 90.00 },
            { A: 5.00, C: 95.00 },
            { A: 5.00, C: 95.00 },
          ],
          priceCash: 0,
          priceGold: 4679
        },
        {
          name: "Finals Platinum",
          color: Vue.resolveClass(10, "B", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#bd1616",
            gStrip2: "#510033",
            name: "FINALS PLATINUM"
          },
          cards: [
            { S: 5.00, A: 35.00, B: 60.00 },
            { B: 100.00 },
            { B: 10.00, C: 90.00 },
            { B: 10.00, C: 90.00 },
            { B: 5.00, D: 95.00 },
          ],
          priceCash: 0,
          priceGold: 2499
        },
        {
          name: "Finals Super Carbon",
          color: Vue.resolveClass(10, "B", "color", true),
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#bd1616",
            gStrip2: "#510033",
            name: "FINALS SUPER CARBON"
          },
          cards: [
            { S: 3.00, A: 20.00, B: 77.00 },
            { B: 10.00, C: 90.00 },
            { B: 5.00, D: 95.00 },
            { B: 5.00, D: 95.00 },
            { B: 5.00, D: 95.00 },
          ],
          priceCash: 0,
          priceGold: 1599
        },
      ],
      classes: {
        S: Vue.resolveClass(10, "S", "color"),
        A: Vue.resolveClass(10, "A", "color"),
        B: Vue.resolveClass(10, "B", "color"),
        C: Vue.resolveClass(10, "C", "color"),
        D: Vue.resolveClass(10, "D", "color"),
        E: Vue.resolveClass(10, "E", "color"),
        F: Vue.resolveClass(10, "F", "color"),
      },
      goalModel: null,
      goalList: [
        { name: "noGoal", label: "No goal" },
        { name: "specificCar", label: "Specific car" },
        { name: "specificAttr", label: "Specific attribute" }
      ],
      ratesCompact: true,
      filterDialog: false,
      chartFilter: {},
      packFilterDialog: false,
      packFilter: {},
      packFilterDescResolved: [],
      searchFilterDialog: false,
      lastestList: [],
      highlightsUsers: {},
      carDetailsList: [],
      simulateUntilGetAll: false,
      showResult: false,
      running: false,
      stop: false,
      numberOfOpensNoGoal: 10,
      numberOfMatchesNeededAttr: 1,
      limit: 200000,
      finalLimit: 0,
      showingDroppedCars: false,
      listDroppedCars: [],
      simulateRunStats: {
        success: false,
        count: 0,
        S: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        availableCars: {
          S: [],
          A: [],
          B: [],
          C: [],
          D: [],
          E: [],
          F: []
        },
        availableCarsAndAttr: {
          S: [],
          A: [],
          B: [],
          C: [],
          D: [],
          E: [],
          F: []
        },
        freeCars: {
          S: [],
          A: [],
          B: [],
          C: [],
          D: [],
          E: [],
          F: []
        },
        droppedRids: {
          S: [],
          A: [],
          B: [],
          C: [],
          D: [],
          E: [],
          F: []
        },
        matched: [],
        goalRidsOriginal: [],
        goalRids: [],
        impossibleCars: [],
        costCash: 0,
        costGold: 0,
        probabilityPerOpen: 0,
        cumulativeProbability: 0,
        luckScore: 0,
        notGarantedClasses: [],
        mainClasses: []
      },
      all_cars,
      optionsDialog: false,
      tuneDialogCar: {},
      tuneDialogActive: false,
      otherPacksDialog: false,
    }
  },
  watch: {},
  beforeMount() {
    if (window.envType === 'development') {
      console.log("develop validation of pack odds");
      this.packTypes.map(x => {
        x.cards.map(y => {
          let total = 0;
          Object.keys(y).map(key => {
            total += y[key];
          })
          if (total !== 100) {
            debugger;
          }
        })
        if (x.cardsCustom) {
          x.cardsCustom.map(y => {
            let total = 0;
            Object.keys(y).map(key => {
              total += y[key];
            })
            if (total !== 100) {
              debugger;
            }
          })
        }
      })
      this.otherPackTypes.map(x => {
        x.cards.map(y => {
          let total = 0;
          Object.keys(y).map(key => {
            total += y[key];
          })
          if (total !== 100) {
            debugger;
          }
        })
      })
    }
    
  },
  mounted() {
  
  },
  beforeDestroy() {
    // window.onblur = null;
  },
  computed: {
    simulateUntilGetOne: {
      get: function () {
        return !this.simulateUntilGetAll;
      },
      set: function (newValue) {
        this.simulateUntilGetAll = !newValue;
      },
    },
    ready() {
      if (!this.packModel) return false;
      if (!this.goalModel) return false;
      if (this.goalModel.name === 'specificCar') {
        if (this.carDetailsList.length === 0) return false;
      }
      return true;
    },
    ratesPerCls() {
      let all = {};
      if (!this.packModel) return {};

      this.currentPackCards.map(card => {
        Object.keys(card).map(key => {
          if (!all[key]) {
            all[key] = card[key];
          } else {
            all[key] = this.sumOds(all[key], card[key]);
          }
        })
      })

      return all;
    },
    statusCalc() {
      if (this.running) return this.$t('m_simulating');
      if (this.simulateRunStats.count === 0) return this.$t('m_impossible');

      if (this.goalModel && this.goalModel.name === "noGoal") {

        let highestClass = 'F';
        let garantedClass = 'F';
        let finalChance = 0;
        Object.keys(this.classes).reverse().map(key => {
          if (this.simulateRunStats[key] > 0) highestClass = key;
        })
        Object.keys(this.currentPackCards[0]).map(key => {
          garantedClass = key;
        });
        
        [...Array(this.simulateRunStats.count)].map(count => {
          this.currentPackCards.map(card => {
            Object.keys(card).map(key => {
              if (highestClass !== key) return;
              let divider = this.simulateRunStats[key];
              if (key === garantedClass) {
                divider = this.simulateRunStats[key] - this.simulateRunStats.count;
                if (divider <= 0 ) divider = 1;
              }
              
              let thisChance = card[key] * (1 / divider)
              if (finalChance === 0) {
                finalChance = thisChance;
              } else {
                finalChance = this.sumOds(finalChance, thisChance);
              }
            })
          })
        })
        // console.log("finalChance", finalChance);
        if (finalChance < 10) return this.$t('m_superLucky');
        if (finalChance < 30) return this.$t('m_veryLucky');
        if (finalChance < 50) return this.$t('m_goodLuck');
        if (finalChance < 70) return this.$t('m_littleLucky');
        if (finalChance < 80) return this.$t('m_badLuck');
        if (finalChance <= 94) return this.$t('m_worstLuck');
        if (finalChance > 94) return this.$t('m_zeroLuck');

        // return this.$t('m_done');
      }
      if (!this.simulateRunStats.success) return this.$t('m_zeroLuck');
      if (this.simulateRunStats.cumulativeProbability === 0 && this.simulateRunStats.count === 1) return this.$t('m_impossible');
      if (this.simulateRunStats.probabilityPerOpen > 50) {
        let num = (100 - this.simulateRunStats.probabilityPerOpen) / (100 - this.simulateRunStats.cumulativeProbability);
        console.log(this.simulateRunStats.probabilityPerOpen.toFixed(2), this.simulateRunStats.cumulativeProbability.toFixed(2), num);
        if (num < 2) return this.$t('m_littleLucky');
        if (num <= 4) return this.$t('m_badLuck');
        if (num > 4) return this.$t('m_worstLuck');
      }
      if (this.simulateRunStats.cumulativeProbability < 10) return this.$t('m_superLucky');
      if (this.simulateRunStats.cumulativeProbability < 30) return this.$t('m_veryLucky');
      if (this.simulateRunStats.cumulativeProbability < 50) return this.$t('m_goodLuck');
      if (this.simulateRunStats.cumulativeProbability < 70) return this.$t('m_littleLucky');
      if (this.simulateRunStats.cumulativeProbability < 80) return this.$t('m_badLuck');
      if (this.simulateRunStats.cumulativeProbability <= 94) return this.$t('m_worstLuck');
      if (this.simulateRunStats.cumulativeProbability > 94) return this.$t('m_zeroLuck');
    },
    currentPackCards() {
      if (!this.packModel || !this.packModel.name) return [];
      
      if (this.packFilterDescResolved.length > 0 && this.packModel.cardsCustom) return this.packModel.cardsCustom;
      return this.packModel.cards;
    }
  },
  methods: {
    openChartOfDialog() {
      this.filterDialog = true;
    },
    openPacksFitlerDialog() {
      this.packFilterDialog = true;
    },
    updateFilter(filter) {
      this.chartFilter = filter;
      this.filterDialog = false;
    },
    updateFilterPacks(filter) {
      this.packFilter = filter;

      let filterCopy = JSON.parse(JSON.stringify(filter));
      filterCopy.prizesModel = ["Non-Prize Cars"];
      this.$store.commit("PACKS_FILTER_IMPORT", { filter: filterCopy });

      this.packFilterDialog = false;
    },
    filterFinishPacks(listOfRids) {

    },
    addCar(newCar) {
      let found = this.carDetailsList.find(x => x.rid === newCar.rid);
      if (found) return;
      newCar.color = Vue.resolveClass(newCar.rq, newCar.class, "color");
      newCar.photo = this.cgResolvePhotoUrl(newCar);
      this.carDetailsList.push(newCar);
    },
    removeCar(car) {
      this.carDetailsList = this.carDetailsList.filter(x => x.rid !== car.rid);
    },
    insertCarPhoto(car) {
      let newCar = JSON.parse(JSON.stringify(car));
      newCar.color = Vue.resolveClass(newCar.rq, newCar.class, "color");
      newCar.count = 1;
      newCar.photo = this.cgResolvePhotoUrl(newCar);
      return newCar;
    },
    cgResolvePhotoUrl(car) {
      try {
        if (car.photoId) return require('@/incoming_pics/' + decodeURI(car.photoId) + '.jpg')
        else return require('@/imgs_final/' + decodeURI(car.rid) + '.jpg')
      } catch (error) {
        return ''
      }
    },
    run() {
      this.$store.commit("START_LOGROCKET", {});
      this.resetRun();
      this.prepareAvailableCars();
      if (this.packFilterDescResolved.length > 0) this.prepareFreeCars();
      this.removeImpossibles();
      if (!this.checkIfPackIsViable()) {
        return;
      }
      this.showResult = true;
      this.running = true;
      
      if (this.goalModel.name === 'noGoal') {
        this.finalLimit = this.numberOfOpensNoGoal;
        this.resolveNotGarantedClasses();
        this.startOpening();
      }

      if (this.goalModel.name === 'specificCar') {
        this.finalLimit = this.limit;
        this.simulateRunStats.goalRids = this.carDetailsList.map(car => car.rid);
        this.simulateRunStats.goalRidsOriginal = JSON.parse(JSON.stringify(this.simulateRunStats.goalRids));
        if (this.carDetailsList.length === 1) {
          this.simulateUntilGetOne = true;
        }
        console.log(this.simulateRunStats.goalRids);
        this.resolveProbabilityPerOpen(this.carDetailsList);
        this.startOpening();
      }

      if (this.goalModel.name === 'specificAttr') {
        this.finalLimit = this.limit;
        if (this.numberOfMatchesNeededAttr < 1) this.numberOfMatchesNeededAttr = 1;
        if (!this.prepareCarsIwantInAvailableCars()) {
          this.running = false;
          return;
        }

        Object.keys(this.simulateRunStats.availableCarsAndAttr).map(key => {
          this.simulateRunStats.availableCarsAndAttr[key].map(car => {
            this.simulateRunStats.goalRids.push(car.rid);
          })
        });
        this.simulateRunStats.goalRidsOriginal = JSON.parse(JSON.stringify(this.simulateRunStats.goalRids));

        this.resolveProbabilityPerOpenAttr();
        this.startOpening();
      }
    },
    removeImpossibles() {
      let impossiblesCount = 0;
      let classes = [];
      this.currentPackCards.map(x => {
        Object.keys(x).map(key => {
          classes.push(key);
        })
      })
      classes = [...new Set(classes)];

      this.carDetailsList = this.carDetailsList.filter(car => {
        if (car.prize) {
          impossiblesCount++;
          return false;
        }
        if (!classes.includes(car.class)) {
          impossiblesCount++;
          return false;
        }
        if (!this.checkIfCarIsPossible(car)) {
          impossiblesCount++;
          return false;
        }

        return true;
      })
      if (impossiblesCount > 0) {
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_impossibleRemoved', { count: impossiblesCount })
        });
      }
    },
    checkIfCarIsPossible(car) {
      let arrName = this.packFilterDescResolved.length === 0 ? "availableCars" : "freeCars";
      let found = this.simulateRunStats[arrName][car.class].find(c => c.rid === car.rid);
      return !!found;
    },
    startOpening() {
      if (this.simulateRunStats.success === false && this.simulateRunStats.count < this.finalLimit && !this.stop) {
        let last = this.openOne();
        this.updatedDropped(last);

        if (this.goalModel.name === 'specificCar' || this.goalModel.name === 'specificAttr') {
          last.map(l => {
            this.simulateRunStats.goalRidsOriginal.map(g => {
              if (l.rid === g) {
                // one match
                this.simulateRunStats.goalRids = this.simulateRunStats.goalRids.filter(x => x !== l.rid);

                let found = this.simulateRunStats.matched.find(car => car.rid === l.rid);
                if (found) {
                  found.count++;
                } else {
                  let arrName = this.packFilterDescResolved.length === 0 ? "availableCars" : "freeCars";
                  this.simulateRunStats.matched.push(this.insertCarPhoto(this.simulateRunStats[arrName][l.class].find(car => car.rid == l.rid)));
                }

                if (this.goalModel.name === 'specificCar' && this.simulateUntilGetOne) {
                  this.simulateRunStats.success = true;
                }
              }
            })
          })
          if (this.goalModel.name === 'specificCar' && this.simulateRunStats.goalRids.length === 0) {
            this.simulateRunStats.success = true;
          }
          if (this.goalModel.name === 'specificAttr') {
            if (this.simulateRunStats.matched.reduce((accumulator, car) => accumulator + car.count, 0) >= this.numberOfMatchesNeededAttr) {
              this.simulateRunStats.success = true;
            }
          }
        }
        setTimeout(() => {
          this.startOpening();
        }, 1);
      } else {
        this.running = false;
        this.stop = false;
        if (this.goalModel.name === 'noGoal') {
          this.noGoalShowNotGaranted();
        }
      }
    },
    openOne() {
      let resultCls = [];
      let resultRids = [];
      this.currentPackCards.map((card, icard) => {
        let rng = Math.random() * 100;
        let classDroped = null;
        let arr = Object.keys(card);
        arr.find(key => {
          if (card[key] >= rng) {
            // console.log(key, rng);
            classDroped = key;
            return true;
          }
        })
        if (!classDroped) {
          classDroped = arr[arr.length - 1];
          // console.log(classDroped, rng);
        }
        this.simulateRunStats[classDroped] += 1;

        resultCls.push(classDroped);
        resultRids.push(this.pickRandomRidByClass(classDroped, this.isFromFree(icard)));
      })
      this.simulateRunStats.count++;
      this.resolveCumulativeProbability();

      // console.log(resultCls);
      // console.log(resultRids);

      let result = resultRids.map((x, ix) => {
        return { class: resultCls[ix], rid: x }
      })

      return result;
    },
    pickRandomRidByClass(cls, fromFree = false) {
      let arrName = fromFree ? "freeCars" : "availableCars";
      let total = this.simulateRunStats[arrName][cls].length;
      let rng = Math.round(Math.random() * (total - 1))
      return this.simulateRunStats[arrName][cls][rng].rid;
    },
    prepareAvailableCars() {
      Object.keys(this.simulateRunStats.availableCars).map(key => {
        this.simulateRunStats.availableCars[key] = this.all_cars.filter(car => car.class === key && this.matchFilter(car));
      })
    },
    prepareFreeCars() {
      Object.keys(this.simulateRunStats.freeCars).map(key => {
        this.simulateRunStats.freeCars[key] = this.all_cars.filter(car => car.class === key && !car.prize);
      })
    },
    prepareCarsIwantInAvailableCars() {
      let sum = 0;
      let isViable = true;
      let classes = [];
      this.currentPackCards.map(x => {
        Object.keys(x).map(key => {
          classes.push(key);
        })
      })
      classes = [...new Set(classes)];

      Object.keys(this.simulateRunStats.availableCarsAndAttr).map(key => {
        if (!classes.includes(key)) return;

        this.simulateRunStats.availableCarsAndAttr[key] = this.all_cars.filter(car => {
          return car.class === key && this.matchFilter(car) && this.matchFilterAttr(car)
        });
        sum += this.simulateRunStats.availableCarsAndAttr[key].length;
      })

      if (sum === 0) isViable = false;
      if (isViable) return true;

      this.$store.commit("DEFINE_SNACK", {
        active: true,
        error: true,
        text: this.$t('m_impossibleCondition')
      });

      return false;


    },
    matchFilter(car) {
      if (!this.$refs.packFilter.checkMatchFilter(car)) return false;
      if (!car.prize) return true;
    },
    matchFilterAttr(car) {
      if (!this.$refs.attrFilter.checkMatchFilter(car)) return false;
      return true;
    },
    resetRun() {
      this.simulateRunStats.success = false;
      this.simulateRunStats.count = 0;
      this.simulateRunStats.S = 0;
      this.simulateRunStats.A = 0;
      this.simulateRunStats.B = 0;
      this.simulateRunStats.C = 0;
      this.simulateRunStats.D = 0;
      this.simulateRunStats.E = 0;
      this.simulateRunStats.F = 0;
      this.simulateRunStats.availableCars.S = [];
      this.simulateRunStats.availableCars.A = [];
      this.simulateRunStats.availableCars.B = [];
      this.simulateRunStats.availableCars.C = [];
      this.simulateRunStats.availableCars.D = [];
      this.simulateRunStats.availableCars.E = [];
      this.simulateRunStats.availableCars.F = [];
      this.simulateRunStats.availableCarsAndAttr.S = [];
      this.simulateRunStats.availableCarsAndAttr.A = [];
      this.simulateRunStats.availableCarsAndAttr.B = [];
      this.simulateRunStats.availableCarsAndAttr.C = [];
      this.simulateRunStats.availableCarsAndAttr.D = [];
      this.simulateRunStats.availableCarsAndAttr.E = [];
      this.simulateRunStats.availableCarsAndAttr.F = [];
      this.simulateRunStats.freeCars.S = [];
      this.simulateRunStats.freeCars.A = [];
      this.simulateRunStats.freeCars.B = [];
      this.simulateRunStats.freeCars.C = [];
      this.simulateRunStats.freeCars.D = [];
      this.simulateRunStats.freeCars.E = [];
      this.simulateRunStats.freeCars.F = [];
      this.simulateRunStats.droppedRids.S = [];
      this.simulateRunStats.droppedRids.A = [];
      this.simulateRunStats.droppedRids.B = [];
      this.simulateRunStats.droppedRids.C = [];
      this.simulateRunStats.droppedRids.D = [];
      this.simulateRunStats.droppedRids.E = [];
      this.simulateRunStats.droppedRids.F = [];
      this.simulateRunStats.matched = [];
      this.simulateRunStats.goalRidsOriginal = [];
      this.simulateRunStats.goalRids = [];
      this.simulateRunStats.impossibleCars = [];
      this.simulateRunStats.costCash = 0;
      this.simulateRunStats.costGold = 0;
      this.simulateRunStats.probabilityPerOpen = 0;
      this.simulateRunStats.cumulativeProbability = 0;
      this.simulateRunStats.luckScore = 0;
      this.simulateRunStats.notGarantedClasses = [];
      this.simulateRunStats.mainClasses = [];
      this.showingDroppedCars = false;
    },
    resolveProbabilityPerOpen(carList) {
      let countPerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let chancePerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let result = 0;
      carList.map(car => {
        if (car.rq >= 80) countPerClass.S++;
        else if (car.rq >= 65) countPerClass.A++;
        else if (car.rq >= 50) countPerClass.B++;
        else if (car.rq >= 40) countPerClass.C++;
        else if (car.rq >= 30) countPerClass.D++;
        else if (car.rq >= 20) countPerClass.E++;
        else if (car.rq >= 10) countPerClass.F++;
      })

      if (this.simulateUntilGetOne) {
        Object.keys(chancePerClass).map(key => {
          if (countPerClass[key] !== 0) {
            this.currentPackCards.map((card, icard) => {
              Object.keys(card).map(keyPack => {
                if (key !== keyPack) return;
                let thisChance = 0;

                if (this.isFromFree(icard)) {
                  thisChance = card[key] / (this.simulateRunStats.freeCars[key].length / countPerClass[key])
                } else {
                  thisChance = card[key] / (this.simulateRunStats.availableCars[key].length / countPerClass[key])
                }

                if (chancePerClass[key] === 0) {
                  chancePerClass[key] = thisChance;
                } else {
                  chancePerClass[key] = this.sumOds(chancePerClass[key], thisChance);
                }
              })
            })
          }
        })
        Object.keys(chancePerClass).map(key => {
          if (chancePerClass[key] !== 0) {
            if (result === 0) result = chancePerClass[key];
            else {
              result = this.sumOds(result, chancePerClass[key]);
            }
          }
        })
      }

      if (this.simulateUntilGetAll) {
        let highestClass = 'F';
        let chanceOfThisClass = 0;
        
        Object.keys(countPerClass).reverse().map(key => {
          if (countPerClass[key] > 0) highestClass = key;
        })
        this.currentPackCards.map((card, icard) => {
          Object.keys(card).map(key => {
            if (highestClass !== key) return;
            let thisChance = 0;

            if (this.isFromFree(icard)) {
              thisChance = card[key] * (1 / (this.simulateRunStats.freeCars[key].length * countPerClass[key]))
            } else {
              thisChance = card[key] * (1 / (this.simulateRunStats.availableCars[key].length * countPerClass[key]))
            }

            if (chanceOfThisClass === 0) {
              chanceOfThisClass = thisChance;
            } else {
              chanceOfThisClass = this.sumOds(chanceOfThisClass, thisChance);
            }
          })
        })
        result = chanceOfThisClass;
      }
      
      this.simulateRunStats.probabilityPerOpen = result;
    },
    resolveProbabilityPerOpenAttr() {
      let countPerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let chancePerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let result = 0;
      let needed = this.numberOfMatchesNeededAttr;
      // let arrName = this.packFilterDescResolved.length === 0 ? "availableCars" : "freeCars";

      Object.keys(this.simulateRunStats.availableCarsAndAttr).map(key => {
        countPerClass[key] = this.simulateRunStats.availableCarsAndAttr[key].length;
      })


      Object.keys(chancePerClass).map(key => {
        if (countPerClass[key] !== 0) {
          this.currentPackCards.map((card, icard) => {
            Object.keys(card).map(keyPack => {
              if (key !== keyPack) return;
              let thisChance = 0;

              if (this.isFromFree(icard)) {
                thisChance = card[key] / (this.simulateRunStats.freeCars[key].length / (countPerClass[key] * needed))
              } else {
                thisChance = card[key] / ((this.simulateRunStats.availableCars[key].length / (countPerClass[key])) * needed)
              }

              if (chancePerClass[key] === 0) {
                chancePerClass[key] = thisChance;
              } else {
                chancePerClass[key] = this.sumOds(chancePerClass[key], thisChance);
              }
            })
          })
        }
      })
      Object.keys(chancePerClass).map(key => {
        if (chancePerClass[key] !== 0) {
          if (result === 0) result = chancePerClass[key];
          else {
            result = this.sumOds(result, chancePerClass[key]);
          }
        }
      })

      this.simulateRunStats.probabilityPerOpen = result;
    },

    resolveCumulativeProbability() {
      if (this.simulateRunStats.cumulativeProbability === 0) return this.simulateRunStats.cumulativeProbability = this.simulateRunStats.probabilityPerOpen;
      return this.simulateRunStats.cumulativeProbability = this.sumOds(this.simulateRunStats.cumulativeProbability, this.simulateRunStats.probabilityPerOpen);
    },
    sumOds(odd1, odd2, returnString = false) {
      let lower = (100/odd1) * (100/odd2)
      let upper = lower - ( (100/odd1 - 1) * (100/odd2 - 1) )
      let result = ((upper / lower) * 100);

      if (returnString) return `${result.toFixed(2)}%`
      return result;


      // function odd(times, od = 17.15) {
      //   var odCalc = 100/od;
      //   var odLess = odCalc - 1;
      //   var lower = odCalc**times;
      //   var upper = lower - odLess**times;
      //   var result = ((upper / lower) * 100);
      //   if (result > 10) return `${Math.round(result)}%`
      //   if (result > 1) return `${result.toFixed(1)}%`
      //   return `${result.toFixed(2)}%`
      // }
    },
    closeOptionsDialog() {
      this.optionsDialog = false;
    },
    updatedDropped(last) {
      last.map(car => {
        if (this.simulateRunStats.droppedRids[car.class].length > 300 && car.class !== "S") return;
        this.simulateRunStats.droppedRids[car.class].push(car);
      })

    },
    seeCars(cls) {
      this.listDroppedCars = [];
      let ridsOnly = this.simulateRunStats.droppedRids[cls].map(c => c.rid);
      let carsUsedOnly = [];
      this.all_cars.map(car => {
        if (ridsOnly.includes(car.rid)) {
          carsUsedOnly.push(car);
        }
      })
      this.simulateRunStats.droppedRids[cls].map(c => {
        let found = this.listDroppedCars.find(car => car.rid === c.rid);
        if (found) {
          found.count++;
        } else {
          this.listDroppedCars.push(this.insertCarPhoto(carsUsedOnly.find(car => car.rid == c.rid)))
        }
      })
      if (this.listDroppedCars.length > 0) {
        this.listDroppedCars.sort((a,b) => {
          return a.rq - b.rq;
        });
        this.showingDroppedCars = true;
      }
    },
    resolveNotGarantedClasses() {
      let garantedClass = 'F';
      Object.keys(this.currentPackCards[0]).map(key => {
        garantedClass = key;
        this.simulateRunStats.mainClasses.push(key);
      });
      Object.keys(this.currentPackCards[0]).map(key => {
        if (key !== garantedClass) {
          this.simulateRunStats.notGarantedClasses.push(key);
        }
      });
    },
    noGoalShowNotGaranted() {
      this.listDroppedCars = [];
      let ridsOnly = [];

      this.simulateRunStats.mainClasses.map(cls => {
        if (this.simulateRunStats[cls] > 50) return;
        this.simulateRunStats.droppedRids[cls].map(c => {
          ridsOnly.push(c.rid);
        });
      })

      let carsUsedOnly = [];
      this.all_cars.map(car => {
        if (ridsOnly.includes(car.rid)) {
          carsUsedOnly.push(car);
        }
      })

      this.simulateRunStats.mainClasses.map(cls => {
        if (this.simulateRunStats[cls] > 50) return;
        this.simulateRunStats.droppedRids[cls].map(c => {
          let found = this.listDroppedCars.find(car => car.rid === c.rid);
          if (found) {
            found.count++;
          } else {
            this.listDroppedCars.push(this.insertCarPhoto(carsUsedOnly.find(car => car.rid == c.rid)))
          }
        })
      })

      if (this.listDroppedCars.length > 0) {
        this.listDroppedCars.sort((a,b) => {
          return a.rq - b.rq;
        });
        this.showingDroppedCars = true;
      }
    },
    eventOpenShowCarDialog(car) {
      this.tuneDialogCar = JSON.parse(JSON.stringify(car));
      this.tuneDialogCar.selectedTune = '000';
      // this.tuneDialogCarIndex = -1;
      // this.tuneDialogisOppo = true;
      this.tuneDialogActive = true;
    },
    isFromFree(icard) {
      if (this.packFilterDescResolved.length === 0) return false;
      if (icard === 0) return false;
      if (icard === 1 && this.packModel.name === "Carbon Fiber") return false;
      if ((icard === 1 || icard === 2) && this.packModel.name === "Finals Titanium") return false;
      if ((icard === 1 || icard === 2) && this.packModel.name === "Finals Platinum") return false;
      if (icard === 1 && this.packModel.name === "Finals Super Carbon") return false;
      return true;
    },
    checkIfPackIsViable() {
      let isViable = true;
      let arrName = this.packFilterDescResolved.length === 0 ? "availableCars" : "freeCars";

      this.currentPackCards.map((card, icard) => {
        Object.keys(card).map(cls => {

          if (this.isFromFree(icard)) {
            if (this.simulateRunStats.freeCars[cls].length === 0) {
              isViable = false;
            }
          } else {
            if (this.simulateRunStats.availableCars[cls].length === 0) {
              isViable = false;
            }
          }

        })
      })

      if (isViable) return true;

      this.$store.commit("DEFINE_SNACK", {
        active: true,
        error: true,
        text: this.$t('m_impossiblePack')
      });

      return false;

    }
  }
}
</script>

<style>
.MainPacks_Layout {
  margin: 40px auto 0px auto;
  padding-bottom: 250px;
}
.MainPacks_Box {
  max-width: 800px;
  margin: 0px auto;
  display: grid;
}
.MainPacks_Button.D_Button {
  font-size: 19px;
  --cl: 70%;
  color: hsl(var(--back-h), var(--back-s), var(--cl));
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0 12px;
  height: 100%;
  border-radius: 0;
  transition-duration: 0.15s;
}
.MainPacks_Title {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 10px;
}
.MainPacks_Box {
  max-width: 800px;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.MainPacks_FilterBox {
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 20px;
}
.MainPacks_ChartFilter {
  height: 120px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  /* margin-top: 17px; */
  background-color: rgba(0,0,0,.1);
  padding: 10px;
  overflow-y: auto;
}
.MainPacks_PacksOdsBox {
  max-width: 600px;
  /* min-height: 160px; */
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 7px;
  /* background-color: rgba(0,0,0,.1); */
  padding: 10px;
  display: flex;
  flex-direction: column;
  /* gap: 10px; */
}
.MainPacks_CardLine {
  /* box-shadow: 0px 2px 0px 0px rgba(255,255,255,0.03); */
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 3px 10px;
}
.MainPacks_CardLine:not(.MainPacks_ResultLine):hover {
  background-color: rgba(255,255,255,0.05);
}
.MainPacks_Card {
  display: flex;
  min-width: 4.5em;
  gap: 4px;
}
.D_Button.MainPacks_Card {
  padding: 0;
}
.D_Button.MainPacks_Card[disabled] {
  background: unset;
  opacity: 1 !important;
}
.MainPacks_Card > div:first-child {
  width: 1.3em;
  text-align: center;
  font-weight: bold;
  background-color: var(--cor);
  transform: skewY(9deg);
  color: black;
  opacity: 0.8;
}
.MainPacks_CarCard {
  position: relative;
}
.MainPacks_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.MainPacks_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.MainPacks_RQ {
  display: flex;
  color: #000;
  background-color: var(--color);
  height: 20px;
  justify-content: center;
  width: 19px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 21px;
  border-top-right-radius: 4px;
  padding-right: 1px;
  font-size: 15px;
}
.MainPacks_Count {
  display: flex;
  color: var(--color);
  background-color: black;
  height: 20px;
  justify-content: center;
  /* width: 19px; */
  font-weight: 700;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 21px;
  border-bottom-right-radius: 4px;
  padding-right: 1px;
  font-size: 15px;
}
.MainPacks_CarsList {
  max-width: 600px;
  min-height: 120px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 17px;
  background-color: rgba(0,0,0,.1);
  padding: 10px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px;
}
.MainPacks_CarsListEmpty {
  justify-content: center;
  align-items: center;
}
.D_Button.MainPacks_CarButton {
  padding: 2px;
}
.MainPacks_SearchCarButton {
  height: 46px;
}
.MainPacks_Center {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.MainPacks_ClassesIcon {
  width: 21px;
  height: 22px;
  margin-right: 3px;
}
.MainPacks_NumOpenLayout {
  flex-direction: row;
}
.MainPacks_NumOpenInput {
  max-width: 100px;
}
.MainPacks_NumOpenInput .BaseText_Input {
  font-size: 20px;
}
.MainPacks_NumOpenPriceBox {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.MainPacks_NumOpenLayout .MainPacks_NumOpenPriceBox {
  margin-top: 17px;
}
.MainPacks_NumOpenPrice {
  display: flex;
}
.MainPacks_Result {
  display: flex;
  flex-direction: column;
}
.MainPacks_ResultInfos {
  display: flex;
  gap: 5px 25px;
  flex-wrap: wrap;
}
.MainPacks_InfoLabel {
  font-size: 0.8em;
  color: #777;
}
.D_Button.MainPacks_ConfigButton {
  padding: 0px 6px;
  margin: -6px;
  --height: 34px;
}
.MainPacks_ConfigIcon {
  font-size: 24px;
  color: var(--d-text);
}
.MainPacks_InfoStatus {
  border-radius: 3px;
  padding: 3px;
  margin: -3px;
}
.MainPacks_S_Super_Lucky {
  color: rgb(var(--d-text-yellow));
  background-color: #ffc90f1c;
}
.MainPacks_S_Very_Lucky {
  color: #5dff5d;
  background-color: #7aff7a2e;
}
.MainPacks_S_Good_Luck {
  color: #3de3af;
  background-color: #7bffe517;
}
.MainPacks_S_Little_Lucky {
  color: #6ecfff;
  background-color: #5ba6ff29;
}
.MainPacks_S_Bad_Luck {
  color: #ff9f65;
  background-color: #af5f0029;
}
.MainPacks_S_Worst_Luck {
  color: #ff5a5a;
  background-color: #991c1c38;
}
.MainPacks_S_Zero_Luck {
  color: #bd2c2c;
  background-color: #00000038;
}
.MainPacks_S_Impossible {
  color: #b1b1b1;
  background-color: #7f7f7f38;
}
.MainPacks_S_Done {
  color: #49cf49;
}
.MainPacks_S_Simulating {

}
.MainPacks_CustomizePackLayout .BaseFilterDescription_Root {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 67%;
  margin: 0 auto 15px auto;
  text-align: left;
  max-height: 63%;
  overflow-y: auto;
  transform: translateY(-8%);
}
.MainPacks_CustomizePackLayout .Cg_ReqsTitle {
  display: none;
}
.MainPacks_CustomizeButton {
  font-size: 16px;
  position: relative;
  max-width: 360px;
  width: 100%;
}
.MainPacks_CustomizePackBox {
  display: flex;
  flex-direction: column;
  align-items: center;
      margin-bottom: 10px;
}
.MainPacks_CustomizePackLayout .Cg_Reqs {
  margin-bottom: 8px;
}
.MainPacks_ChipPack {
  background-color: black;
  box-shadow: inset 0px 0px 0px 32px rgba(var(--cor), 0.2), inset 0px -6px 0px 0px rgba(var(--cor), 0.4);
}
.MainPacks_ChipPack.BaseChip:hover,
.MainPacks_ChipPack.BaseChip.focus-visible {
  box-shadow: inset 0px 0px 0px 32px rgba(var(--cor), 0.4), inset 0px -6px 0px 0px rgba(var(--cor), 0.7);
}
.MainPacks_ChipPack.D_ButtonActive:not(p) {
  box-shadow: inset 0px 0px 0px 32px rgba(var(--cor), 0.2), inset 0px -40px 31px -25px rgba(var(--cor), 1);
  color: white;
}
.BaseChip.MainPacks_ChipMore {
  background-color: transparent;
  padding: 7px 9px;
}
.MainPacks_OtherPackItem {
  box-shadow: inset 4px 0px 0px 0px rgba(var(--cor), 0.8);
}
.MainPacks_PackButton {
  width: 100%;
}
.MainPacks_PackDescription {
  position: absolute;
}
.MainPacks_CustomizeIcon {
  position: absolute;
  opacity: 0.2;
  font-size: 30px;
  margin-top: -20px;
}
.D_Button.MainPacks_CustomizeButton[disabled] {
  opacity: 1 !important;
}

</style>