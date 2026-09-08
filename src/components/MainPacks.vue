<template>
  <div class="MainPacks_Layout">

    <div class="MainPacks_ChipBox">
      <div class="Main_FilterChipsFlex">
        <template v-for="(item, ix) in packTypes">
          <BaseChip
            v-model="packModel"
            :value="item" 
            :label="item.name"
            :disabled="running || editing"
            :style="`--cor: ${item.color}`"
            required="true"
            class="BaseChip_MinWidth BaseChip_DontCrop MainPacks_ChipPack" />
        </template>
        <button
          :disabled="editing"
          class="BaseChip BaseChip_MinWidth BaseChip_DontCrop MainPacks_ChipMore"
          @click="otherPacksDialog = true;">
          <i class="ticon-plus_2 MainPacks_ChipMoreIcon" aria-hidden="true"/>
        </button>
      </div>
    </div>

    <BaseExpandDiv :active="editing">
      <div class="MainPacks_Editor">
        <div class="MainPacks_EditorHead">
          <BaseText
            v-model="packEditor.name"
            :label="$t('c_name')"
            :instantModel="true"
            type="normal"
            class="BaseText_Big MainPacks_EditorName"
            placeholder="" />
        </div>

        <div class="MainPacks_EditorColors">
          <div class="MainPacks_EditorColorsBox">
            <button
              v-for="pal in packPalettes"
              :key="pal.key"
              :class="{ MainPacks_EditorColorActive: packEditor.paletteKey === pal.key }"
              :style="`--b1: ${pal.packColor.gBackground1}; --b2: ${pal.packColor.gBackground2}; --g1: ${pal.packColor.gStrip1}; --g2: ${pal.packColor.gStrip2}`"
              class="D_Button MainPacks_EditorColor"
              @click="packEditor.paletteKey = pal.key" />
          </div>
        </div>

        <div class="MainPacks_EditorGrid">
          <div class="MainPacks_EditorRow">
            <div class="MainPacks_EditorNum" />
            <div
              v-for="cls in classOrder"
              :key="cls"
              :style="`--cor: ${classes[cls]}`"
              class="MainPacks_EditorCls">{{ cls }}</div>
            <div class="MainPacks_EditorSum">%</div>
            <div class="MainPacks_EditorCheck">{{ $tc('m_filter', 1) }}</div>
            <div class="MainPacks_EditorDel" />
          </div>
          <div v-for="(card, icard) in packEditor.cards" :key="`card${icard}`" class="MainPacks_EditorRow">
            <div class="MainPacks_EditorNum">{{ icard + 1 }}</div>
            <input
              v-for="(cls, iclass) in classOrder"
              :key="cls"
              :value="card[cls]"
              inputmode="decimal"
              autocomplete="off"
              class="MainPacks_RateInput"
              @focus="$event.target.select()"
              @input="rateInput(icard, cls, $event)"
              @change="rateCommit(icard, cls)">
            <div
              :class="cardTotal(card) === 100 ? 'MainPacks_EditorSumOk' : 'MainPacks_EditorSumBad'"
              class="MainPacks_EditorSum">{{ cardTotal(card) }}</div>
            <BaseCheckBox
              class="MainPacks_EditorCheckBox D_Center"
              :value="packEditor.cardsCriteria[icard]"
              @change="toggleEditorCheck(icard)"
            />
            <button
              :disabled="packEditor.cards.length < 2"
              class="D_Button MainPacks_EditorDel"
              @click="removeEditorCard(icard)">
              <i class="ticon-minus_2" aria-hidden="true"/>
            </button>
          </div>
        </div>

        <button
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="addEditorCard()">
          <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
          <span>{{ $t("m_card") }}</span>
        </button>

        <div class="MainPacks_EditorButtons">
          <div class="MainPacks_EditorButtonsRight">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="closeEditor()">{{ $t("m_cancel") }}</button>
            <button
              class="D_Button D_ButtonDark D_ButtonDarkSave"
              @click="saveEditorPack()">{{ $t("m_save") }}</button>
          </div>
        </div>

        <button
          v-if="packEditor.id"
          class="D_Button D_ButtonDark D_ButtonRedLight"
          @click="deleteEditorPack()">{{ $t("m_delete") }}</button>

      </div>
    </BaseExpandDiv>

    <div v-if="packModel && packModel.name && !editing" class="MainPacks_PacksOdsBox">
      <div class="MainPacks_CustomizePackLayout">
        <div class="MainPacks_CustomizePackBox" :class="packSvgClass" :style="`--cor: ${packModel.packColor.gStrip1}`">
          <button
            class="D_Button MainPacks_CustomizeButton"
            :disabled="running"
            @click="openPacksFitlerDialog()">
            <BasePackSvg :packColors="packModel.packColor" :count="(packModel.cards || []).length" class="MainPacks_PackButton" />
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
        <div v-if="packModel.custom" class="MainPacks_CustomBar">
          <button
            :disabled="running"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="openEditor(packModel)">
            <i class="ticon-pencil D_ButtonIcon" aria-hidden="true"/>
            <span>{{ $t("m_edit") }}</span>
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

    <div v-if="packModel && packModel.name && !editing" class="MainPacks_GoalLayout Space_TopPlus">
      <div class="MainPacks_ChipBox">
        <div class="Main_FilterChipsFlex">
          <template v-for="(item, ix) in goalList">
            <BaseChip
              v-model="goalModel"
              :class="`MainPacks_`"
              :value="item" 
              :label="$t(`m_${item}`)"
              :disabled="running"
              required="true"
              class="BaseChip_MinWidth BaseChip_DontCrop" />
          </template>
        </div>
      </div>
    </div>

    <div v-if="!editing && goalModel && goalModel === 'noGoal'" class="MainPacks_NumOpenLayout Space_TopPlus MainPacks_Center">
      <BaseText
        v-model="numberOfOpensNoGoal"
        type="integer"
        :label="$t('m_count')"
        class="MainPacks_NumOpenInput"
        placeholder="" />
      <div class="MainPacks_NumOpenPriceBox">
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="cash" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel[packFilterDescResolved.length > 0 && packModel.priceCashCustom ? 'priceCashCustom' : 'priceCash' ] * numberOfOpensNoGoal).toLocaleString() }}</div>
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="gold" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel[packFilterDescResolved.length > 0 && packModel.priceGoldCustom ? 'priceGoldCustom' : 'priceGold' ] * numberOfOpensNoGoal).toLocaleString() }}</div>
      </div>
    </div>


    <template v-if="!editing && goalModel && goalModel === 'specificCar'">

      <BaseCarList
        :list="carDetailsList"
        :forceNonPrize="true"
        :filterToImport="carsFilter"
        style="margin-top: 17px;"
      />

    </template>

    <div v-if="!editing && goalModel && goalModel === 'specificCar' && carDetailsList.length > 1" class="MainPacks_SwitchBox MainPacks_Center Space_TopPlus" style="flex-direction: column;">
      <BaseSwitch v-model="simulateUntilGetOne" :label="$t('m_simulateUntilGetOne')" :horizontal="true" :disabled="running" />
      <BaseSwitch v-model="simulateUntilGetAll" :label="$t('m_simulateUntilGetAll')" :horizontal="true" :disabled="running" />
    </div>

    <div v-if="!editing && goalModel === 'notOwned'" class="MainPacks_GarageBox MainPacks_Center">
      <button
        v-if="!garageReady"
        :class="{ D_Button_Loading: Vue.garageObj.loading }"
        class="D_Button D_ButtonDark D_ButtonTier4"
        @click="loadMyGarage()"><i class="ticon-car D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/> {{ $t("m_myGarage") }}</button>
      <div v-else class="MainPacks_GarageLoaded">
        <i class="ticon-correct_2 D_ButtonIcon" aria-hidden="true"/>
        <span>{{ $t("m_myGarage") }}</span>
      </div>
    </div>

    <div v-if="!editing && isAttrGoal" class="MainPacks_FilterBox">
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

    <div v-if="!editing && isAttrGoal" class="MainPacks_SwitchBox MainPacks_Center Space_TopPlus" style="flex-direction: column;">
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
    </div>

    <div v-if="showResult && !editing" class="MainPacks_Result MainPacks_Center" style="margin-top: 50px;">
      <div class="MainPacks_ResultCounts">
        <div :class="{ MainPacks_CardLineStoped: !running }" class="MainPacks_CardLine MainPacks_ResultLine" style="justify-content: center;">
          <div><button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.S}; min-width: 3.5em;`" :disabled="viewingClass === 'S' || simulateRunStats.S === 0" @click="seeCars('S')"><div>S</div><div>{{ simulateRunStats.S }}</div></button><button v-if="viewingClass === 'S'" class="D_Button D_ButtonDark MainPacks_CloseClass" @click="closeClass()"><i class="ticon-close" aria-hidden="true"/></button></div>
          <div><button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.A}; min-width: 3.5em;`" :disabled="viewingClass === 'A' || simulateRunStats.A > 300 || simulateRunStats.A === 0" @click="seeCars('A')"><div>A</div><div>{{ simulateRunStats.A }}</div></button><button v-if="viewingClass === 'A'" class="D_Button D_ButtonDark MainPacks_CloseClass" @click="closeClass()"><i class="ticon-close" aria-hidden="true"/></button></div>
          <div><button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.B}; min-width: 3.5em;`" :disabled="viewingClass === 'B' || simulateRunStats.B > 300 || simulateRunStats.B === 0" @click="seeCars('B')"><div>B</div><div>{{ simulateRunStats.B }}</div></button><button v-if="viewingClass === 'B'" class="D_Button D_ButtonDark MainPacks_CloseClass" @click="closeClass()"><i class="ticon-close" aria-hidden="true"/></button></div>
          <div><button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.C}; min-width: 3.5em;`" :disabled="viewingClass === 'C' || simulateRunStats.C > 300 || simulateRunStats.C === 0" @click="seeCars('C')"><div>C</div><div>{{ simulateRunStats.C }}</div></button><button v-if="viewingClass === 'C'" class="D_Button D_ButtonDark MainPacks_CloseClass" @click="closeClass()"><i class="ticon-close" aria-hidden="true"/></button></div>
          <div><button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.D}; min-width: 3.5em;`" :disabled="viewingClass === 'D' || simulateRunStats.D > 300 || simulateRunStats.D === 0" @click="seeCars('D')"><div>D</div><div>{{ simulateRunStats.D }}</div></button><button v-if="viewingClass === 'D'" class="D_Button D_ButtonDark MainPacks_CloseClass" @click="closeClass()"><i class="ticon-close" aria-hidden="true"/></button></div>
          <div><button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.E}; min-width: 3.5em;`" :disabled="viewingClass === 'E' || simulateRunStats.E > 300 || simulateRunStats.E === 0" @click="seeCars('E')"><div>E</div><div>{{ simulateRunStats.E }}</div></button><button v-if="viewingClass === 'E'" class="D_Button D_ButtonDark MainPacks_CloseClass" @click="closeClass()"><i class="ticon-close" aria-hidden="true"/></button></div>
          <div><button class="D_Button D_ButtonDark MainPacks_Card" :style="`--cor: ${classes.F}; min-width: 3.5em;`" :disabled="viewingClass === 'F' || simulateRunStats.F > 300 || simulateRunStats.F === 0" @click="seeCars('F')"><div>F</div><div>{{ simulateRunStats.F }}</div></button><button v-if="viewingClass === 'F'" class="D_Button D_ButtonDark MainPacks_CloseClass" @click="closeClass()"><i class="ticon-close" aria-hidden="true"/></button></div>
        </div>
      </div>
      <div class="MainPacks_ResultInfos">
        <div class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_count') }}</div>
          <div class="MainPacks_InfoValue">{{ simulateRunStats.count }}</div>
        </div>
        <div v-if="goalModel && goalModel !== 'noGoal'" class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_probabilityPerOpen') }}</div>
          <div class="MainPacks_InfoValue">{{ simulateRunStats.probabilityPerOpen.toFixed(2) }}%</div>
        </div>
        <div v-if="goalModel && goalModel !== 'noGoal'" class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_cumulativeProbability') }}</div>
          <div class="MainPacks_InfoValue">{{ simulateRunStats.cumulativeProbability.toFixed(2) }}%</div>
        </div>
        <div class="MainPacks_Info">
          <div class="MainPacks_InfoLabel">{{ $t('m_status') }}</div>
          <div class="MainPacks_InfoValue MainPacks_InfoStatus" :class="`MainPacks_S_${statusCalc.replaceAll(' ', '_')}`">{{ statusCalc }}</div>
        </div>
      </div>
      <div class="MainPacks_NumOpenPriceBox">
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="cash" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel[packFilterDescResolved.length > 0 && packModel.priceCashCustom ? 'priceCashCustom' : 'priceCash' ] * simulateRunStats.count).toLocaleString() }}</div>
        <div class="MainPacks_NumOpenPrice"><BaseIconSvg type="gold" :useMargin="false" class="MainPacks_ClassesIcon" />{{ (packModel[packFilterDescResolved.length > 0 && packModel.priceGoldCustom ? 'priceGoldCustom' : 'priceGold' ] * simulateRunStats.count).toLocaleString() }}</div>
      </div>
    </div>

    <div v-if="showResult && !editing" class="MainPacks_SpecificCar Space_TopPlus">
      <div class="MainPacks_CarsList" :class="{ MainPacks_CarsListEmpty: (showDefaultResultList && defaultResultList.length === 0) || ((!showingDroppedCars && !showDefaultResultList) && simulateRunStats.matched.length === 0) }">

        <template v-for="car in (showDefaultResultList ? defaultResultList : (showingDroppedCars ? listDroppedCars : simulateRunStats.matched) )">
          <button
            :key="car.rid"
            class="D_Button D_ButtonDark D_ButtonDark2 MainPacks_CarButton"
            @click="openCarFullDetail(car)">
            <div class="MainPacks_CarCard" :style="`--color: ${car.color}`">
              <div class="MainPacks_BankPhoto">
                <img :src="car.photo" class="MainPacks_BankPhotoImg" loading="lazy" alt="">
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
      :config="{
        classes: false,
        rq: false,
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        ola: false,
        hill: false,
        prizes: false,
        customTags: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      importFilterName="PACKS_INTERNALFILTER_IMPORT"
      ref="packFilter"
      ridsMutationName="FILTER_PACKS_LIMITS"
      @filterUpdate="updateFilterPacks($event)"
      @listRids="filterFinishPacks($event);"
    />


    
    <!-- set attr cars I want -->
    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      ref="attrFilter"
      ridsMutationName="FILTER_ATTR_RIDS"
      @filterUpdate="updateFilter($event)"
      @listRids="filterFinish($event);"
    />
      

    <BaseDialog
      :active="otherPacksDialog"
      :transparent="true"
      :lazy="true"
      max-width="400px"
      min-width="240px"
      class="Cg_SelectorDialog"
      @close="otherPacksDialog = false">
      <div style="Cg_SelectorDialogBox">
        <div class="Cg_SelectorDialogHeader">
          <div class="Cg_SelectorDialogTitle Main_DialogTitle">{{ $t("m_packs") }}</div>
          <div class="Cg_SelectorDialogRight">
            <button
              :disabled="running"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="newCustomPack()">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_new") }}</span>
            </button>
          </div>
        </div>
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
          <template v-if="customPackTypes.length > 0">
            <div class="MainPacks_OtherPackDivider">{{ $t("m_customPacks") }}</div>
            <template v-for="(item, ix) in customPackTypes">
              <button
                style="padding-left: 15px;"
                class="Main_SearchItem MainPacks_OtherPackItem"
                :style="`--cor: ${item.color}`"
                @click="packModel = item; otherPacksDialog = false;">
                <div class="Main_SearchItemRight">{{ item.name }}</div>
              </button>
            </template>
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
import BasePackSvg from './BasePackSvg.vue'
import BaseCarList from './BaseCarList.vue'
import BaseExpandDiv from './BaseExpandDiv.vue'
import BaseCheckBox from './BaseCheckBox.vue'
import all_cars from '../database/cars_final.json';
import { tdrStore } from '@/tdrStore.js';

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
    BasePackSvg,
    BaseCarList,
    BaseExpandDiv,
    BaseCheckBox
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      T_S: tdrStore(),
      lastestLoading: false,
      packModel: null,
      packTypes: [
        {
          name: "Carbon Fiber",
          color: Vue.resolveClass(10, "B", "color", true),
          cardsCriteria: [1, 1, 0, 0, 0],
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
          cardsCustomNoLeg: [
            { A: 22.75, B: 77.25 },
            { A: 3.75, B: 7.00, C: 89.25 },
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
          cardsCriteria: [1, 0, 0, 0, 0],
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
          cardsCustomNoLeg: [
            { A: 2.90, B: 10.55, C: 86.55 },
            { S: 0.06, A: 0.09, B: 0.33, C: 24.00, D: 75.52 },
            { C: 1.75, D: 16.00, E: 82.25 },
            { D: 5.00, E: 95.00 },
            { D: 5.00, E: 95.00 },
          ],
          priceCash: 32500,
          priceGold: 399,
          priceCashCustom: 42500,
          priceGoldCustom: 599,
        },
        {
          name: "Aluminium",
          color: Vue.resolveClass(10, "D", "color", true),
          cardsCriteria: [1, 0, 0, 0, 0],
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
          cardsCriteria: [1, 0, 0, 0, 0],
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
          cardsCriteria: [1, 0, 0, 0, 0],
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
          name: "Black Diamond",
          color: Vue.resolveClass(10, "S", "color", true),
          cardsCriteria: [1, 1, 1, 0, 0],
          packColor: {
            background: "#212121",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#6f4f1d",
            gStrip2: "#a99655",
            name: "BLACK DIAMOND"
          },
          cards: [
            { S: 100.00 },
            { S: 50.00, A: 50.00 },
            { S: 10.00, A: 90.00 },
            { S: 5.00, B: 95.00 },
            { S: 5.00, B: 95.00 },
          ],
          priceCash: 0,
          priceGold: 0
        },
        {
          name: "Diamond",
          color: Vue.resolveClass(10, "S", "color", true),
          cardsCriteria: [1, 1, 1, 0, 0],
          packColor: {
            background: "#212121",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#6f4f1d",
            gStrip2: "#a99655",
            name: "DIAMOND"
          },
          cards: [
            { S: 100.00 },
            { S: 10.00, A: 90.00 },
            { S: 5.00, B: 95.00 },
            { S: 5.00, B: 95.00 },
            { S: 5.00, B: 95.00 },
          ],
          priceCash: 0,
          priceGold: 0
        },
        {
          name: "Sapphire",
          color: Vue.resolveClass(10, "A", "color", true),
          cardsCriteria: [1, 1, 1, 0, 0],
          packColor: {
            background: "#212121",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#7244dd",
            gStrip2: "#4c38b3",
            name: "SAPPHIRE"
          },
          cards: [
            { S: 35.00, A: 65.00 },
            { A: 100.00 },
            { A: 10.00, B: 90.00 },
            { A: 10.00, B: 90.00 },
            { A: 5.00, C: 95.00 },
          ],
          priceCash: 0,
          priceGold: 0
        },
        {
          name: "Titanium",
          color: Vue.resolveClass(10, "A", "color", true),
          cardsCriteria: [1, 1, 1, 0, 0],
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#7244dd",
            gStrip2: "#4c38b3",
            name: "TITANIUM"
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
          name: "Platinum",
          color: Vue.resolveClass(10, "B", "color", true),
          cardsCriteria: [1, 1, 1, 0, 0],
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#bd1616",
            gStrip2: "#510033",
            name: "PLATINUM"
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
          name: "Super Carbon",
          color: Vue.resolveClass(10, "B", "color", true),
          cardsCriteria: [1, 1, 0, 0, 0],
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#bd1616",
            gStrip2: "#510033",
            name: "SUPER CARBON"
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
        {
          name: "Premium Lite",
          color: Vue.resolveClass(10, "C", "color", true),
          cardsCriteria: [1, 0, 0, 0, 0],
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#b5c0c3",
            gBackground2: "#606869",
            gStrip1: "#ffe93a",
            gStrip2: "#c19900",
            name: "PREMIUM LITE"
          },
          cards: [
            { S: 0.50, A: 2.00, B: 7.50, C: 90.00 },
            { D: 100.00 },
            { D: 20.00, E: 80.00 },
            { D: 10.00, E: 90.00 },
            { D: 10.00, E: 90.00 },
          ],
          priceCash: 0,
          priceGold: 0
        },
        {
          name: "Racing Pack (Daily Objectives)",
          color: Vue.resolveClass(10, "D", "color", true),
          cardsCriteria: [1],
          packColor: {
            background: "#212121",
            bottomStrip: "#890a0a",
            gBackground1: "#1e1e1e",
            gBackground2: "#353535",
            gStrip1: "#009eb9",
            gStrip2: "#049dc1",
            name: "RACING PACK"
          },
          cards: [
            { S: 0.50, A: 1.50, B: 8.00, C: 30.00, D: 60.00 },
          ],
          priceCash: 0,
          priceGold: 0
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
      classOrder: ["S", "A", "B", "C", "D", "E", "F"],
      customPackTypes: [],
      packEditor: {
        active: false,
        id: null,
        name: "",
        paletteKey: null,
        cards: [],
        cardsCriteria: [],
      },
      goalModel: null,
      goalList: [
        "noGoal",
        "specificCar",
        "specificAttr",
        "notOwned"
      ],
      ratesCompact: true,
      filterDialog: false,
      chartFilter: {},
      packFilterDialog: false,
      packFilter: {},
      packFilterDescResolved: [],
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
      showDefaultResultList: true,
      defaultResultList: [],
      viewingClass: null,
      isNoLeggyPack: false,
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
        availableCarsAndAttrFree: {
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
      tuneDialogCar: {},
      otherPacksDialog: false,
      carsFilter: {},
      packFilterContext: null,
      attrFilterContext: null
    }
  },
  watch: {
    'T_S._user'() {
      Vue.tryLoadGarageFromStorage();
    }
  },
  beforeMount() {

    if (import.meta.env.DEV) {
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

    // check new cars
    let found = this.all_cars.find(x => x.rid === "Lamborghini_Athon_1980");
    if (!found) {
      this.getLastest();
    }

    
  },
  mounted() {
    this.loadCustomPacks();

    Vue.tryLoadGarageFromStorage();

    if (this.$route.params && this.$route.params.filter) {
      let filterCopy = JSON.parse(JSON.stringify(this.$route.params.filter));
      // filterCopy.prizesModel = ["Non-Prize Cars"];
      this.$store.commit("PACKS_INTERNALFILTER_IMPORT", { filter: filterCopy });
      this.updateFilterPacks(this.$route.params.filter)
      // this.packFilter = this.$route.params.filter;
      this.packModel = this.packTypes.find(x => x.name === "Carbon Fiber");
    }
    if (this.$route.params && this.$route.params.cars) {
      this.packModel = this.packTypes.find(x => x.name === "Carbon Fiber");
      this.goalModel = "specificCar";
      this.$route.params.cars.map(car => {
        this.carDetailsList.push(car.rid);
      })
      this.carDetailsList.sort((a,b) => {
        return  Vue.all_carsObj[a].rq - Vue.all_carsObj[b].rq;
      })
    }

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
    editing() {
      return this.packEditor.active;
    },
    garageReady() {
      return !!(this.T_S._user && this.T_S._user.hasGarage && Vue.garageObj.loaded);
    },
    // both goals share the requirement filter box and the quantity input
    isAttrGoal() {
      return this.goalModel === 'specificAttr' || this.goalModel === 'notOwned';
    },
    // every distinct color combination already used by a default pack, so a custom
    // pack can only ever be painted with a color the game itself uses
    packPalettes() {
      let list = [];
      let seen = {};
      [...this.packTypes, ...this.otherPackTypes].map(pack => {
        let c = pack.packColor;
        let key = `${c.gBackground1}_${c.gBackground2}_${c.gStrip1}_${c.gStrip2}`;
        if (seen[key]) return;
        seen[key] = true;
        list.push({
          key,
          label: pack.name,
          color: pack.color,
          svgClass: `BasePackSvg_C_${c.name.replaceAll(' ', '_')}`,
          packColor: {
            background: c.background,
            bottomStrip: c.bottomStrip,
            gBackground1: c.gBackground1,
            gBackground2: c.gBackground2,
            gStrip1: c.gStrip1,
            gStrip2: c.gStrip2
          }
        });
      })
      return list;
    },
    packSvgClass() {
      if (!this.packModel || !this.packModel.packColor) return '';
      if (this.packModel.svgClass) return this.packModel.svgClass;
      return `BasePackSvg_C_${this.packModel.packColor.name.replaceAll(' ', '_')}`;
    },
    ready() {
      if (this.packEditor.active) return false;
      if (!this.packModel) return false;
      if (!this.goalModel) return false;
      if (this.goalModel === 'specificCar') {
        if (this.carDetailsList.length === 0) return false;
      }
      if (this.goalModel === 'notOwned') {
        if (!this.garageReady) return false;
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

      if (this.goalModel && this.goalModel === "noGoal") {

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
      if (this.packModel.custom) return this.packModel.cards;

      if (this.packModel.name === "Carbon Fiber" || this.packModel.name === "Ceramic") {
        if (this.isNoLeggyPack) {
          return this.packModel.cardsCustomNoLeg;
        }
      }
      if (this.packFilterDescResolved.length > 0 && this.packModel.cardsCustom) return this.packModel.cardsCustom;
      return this.packModel.cards;
    }
  },
  methods: {
    loadMyGarage() {
      if (!this.T_S._user || !this.T_S._user.hasGarage) {
        this.noGarageUploaded();
        return;
      }
      if (Vue.garageObj.loaded) return;
      Vue.loadGarage({ username: this.T_S._user.username });
    },
    noGarageUploaded() {
      let vm = this;

      let action = function() {
        vm.$router.push({ name: "BaseMyGarage" });
        vm.$store.commit("DEFINE_DIALOG", {
          active: false
        });
      }

      vm.$store.commit("DEFINE_DIALOG", {
        active: true,
        title: vm.$t('p_youNeedGarage'),
        actionLabel: vm.$t('m_uploadMyGarage'),
        cancelLabel: vm.$t('m_cancel'),
        actionColor: "green",
        minWidth: "240px",
        error: false,
        disabled: false,
        action: action,
        loading: false,
        maxWidth: "420px"
      });
    },
    isNewCar(car) {
      return !Vue.garageByRid[car.rid] || Vue.garageByRid[car.rid].length === 0;
    },
    loadCustomPacks() {
      let stored = window.localStorage.getItem("packsCustom");
      if (!stored) return;
      try {
        let parsed = JSON.parse(stored);
        if (parsed instanceof Array) {
          this.customPackTypes = parsed.filter(x => x && x.packColor && x.cards && x.cards.length > 0);
        }
      } catch (error) {
        console.log("Error parsing packsCustom from localStorage:", error);
      }
    },
    persistCustomPacks() {
      window.localStorage.setItem("packsCustom", JSON.stringify(this.customPackTypes));
    },
    newCustomPack() {
      this.otherPacksDialog = false;
      this.openEditor(null);
    },
    openEditor(pack) {
      if (this.running) return;
      this.showResult = false;
      this.packEditor.id = pack ? pack.id : null;
      this.packEditor.name = pack ? pack.name : "";
      let palette = pack ? this.packPalettes.find(x => x.key === pack.paletteKey) : null;
      this.packEditor.paletteKey = palette ? palette.key : this.packPalettes[0].key;
      this.packEditor.cards = pack ? pack.cards.map(card => this.cardToRaw(card)) : [this.emptyRawCard()];
      this.packEditor.cardsCriteria = pack ? (pack.cardsCriteria || [1]) : [1];
      this.packEditor.active = true;
    },
    closeEditor() {
      this.packEditor.active = false;
    },
    emptyRawCard() {
      let raw = {};
      this.classOrder.map(cls => {
        raw[cls] = "";
      })
      return raw;
    },
    cardToRaw(card) {
      let raw = this.emptyRawCard();
      Object.keys(card).map(cls => {
        if (raw[cls] === undefined) return;
        raw[cls] = this.formatRate(card[cls]);
      })
      return raw;
    },
    parseRate(value) {
      if (value === null || value === undefined) return null;
      let clean = String(value).trim().replace(",", ".");
      if (clean === "" || clean === ".") return null;
      let num = Number(clean);
      if (isNaN(num)) return null;
      if (num < 0) num = 0;
      if (num > 100) num = 100;
      return Math.round(num * 100) / 100;
    },
    formatRate(num) {
      if (num === null || num === undefined) return "";
      return String(Math.round(num * 100) / 100);
    },
    cardTotal(card) {
      let total = 0;
      this.classOrder.map(cls => {
        let num = this.parseRate(card[cls]);
        if (num !== null) total += num;
      })
      return Math.round(total * 100) / 100;
    },
    // only sanitizes while typing, so nothing jumps around under the user
    rateInput(icard, cls, event) {
      let clean = String(event.target.value).replace(",", ".").replace(/[^0-9.]/g, "");
      let parts = clean.split(".");
      if (parts.length > 2) {
        clean = `${parts.shift()}.${parts.join("")}`;
      }
      if (clean.includes(".")) {
        let dot = clean.split(".");
        clean = `${dot[0].slice(0, 3)}.${dot[1].slice(0, 2)}`;
      } else {
        clean = clean.slice(0, 3);
      }
      if (clean !== event.target.value) {
        event.target.value = clean;
      }
      this.packEditor.cards[icard][cls] = clean;
    },
    // runs on blur/enter only, so nothing moves while the user is still typing
    rateCommit(icard, cls) {
      this.balanceCard(this.packEditor.cards[icard], cls);
    },
    // only one field ever moves: the last filled class placed after the edited one.
    // if nothing after it is filled, nothing adapts.
    balanceCard(card, lockedKey) {
      card[lockedKey] = this.formatRate(this.parseRate(card[lockedKey]));

      let lockedIx = this.classOrder.indexOf(lockedKey);
      let targetKey = null;
      this.classOrder.map((cls, ix) => {
        if (ix <= lockedIx) return;
        if (this.parseRate(card[cls]) === null) return;
        targetKey = cls;
      })
      if (!targetKey) return;

      let rest = 0;
      this.classOrder.map(cls => {
        if (cls === targetKey) return;
        let num = this.parseRate(card[cls]);
        if (num !== null) rest += num;
      })

      let value = Math.round((100 - rest) * 100) / 100;
      if (value < 0) value = 0;
      card[targetKey] = this.formatRate(value);
    },
    addEditorCard() {
      this.packEditor.cards.push(this.emptyRawCard());
      this.packEditor.cardsCriteria.push(0);
    },
    removeEditorCard(icard) {
      if (this.packEditor.cards.length < 2) return;
      this.packEditor.cards.splice(icard, 1);
      this.packEditor.cardsCriteria.splice(icard, 1);
    },
    saveEditorPack() {
      let name = this.packEditor.name ? String(this.packEditor.name).trim() : "";
      if (!name) {
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: this.$t('m_packNeedName')
        });
        return;
      }

      let invalid = this.packEditor.cards.find(card => this.cardTotal(card) !== 100);
      if (invalid) {
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: this.$t('m_packMustBe100')
        });
        return;
      }

      let palette = this.packPalettes.find(x => x.key === this.packEditor.paletteKey) || this.packPalettes[0];
      let cards = this.packEditor.cards.map(card => {
        let out = {};
        this.classOrder.map(cls => {
          let num = this.parseRate(card[cls]);
          if (num !== null && num > 0) out[cls] = num;
        })
        return out;
      })

      let pack = {
        custom: true,
        id: this.packEditor.id || `c${Date.now()}${Math.round(Math.random() * 1000)}`,
        name,
        paletteKey: palette.key,
        color: palette.color,
        svgClass: palette.svgClass,
        packColor: { ...palette.packColor, name: name.toUpperCase() },
        cards,
        cardsCriteria: this.packEditor.cardsCriteria.slice(),
        priceCash: 0,
        priceGold: 0
      };

      let ix = this.customPackTypes.findIndex(x => x.id === pack.id);
      if (ix === -1) this.customPackTypes.push(pack);
      else this.$set(this.customPackTypes, ix, pack);

      this.persistCustomPacks();
      this.packEditor.active = false;
      this.packModel = pack;
    },
    deleteEditorPack() {
      let vm = this;
      let id = this.packEditor.id;
      if (!id) return;

      this.$store.commit("DEFINE_DIALOG", {
        active: true,
        title: this.$t('m_deletePack'),
        actionLabel: this.$t('m_delete'),
        cancelLabel: this.$t('m_cancel'),
        actionColor: "red",
        maxWidth: "420px",
        minWidth: "240px",
        error: false,
        disabled: false,
        loading: false,
        action() {
          vm.customPackTypes = vm.customPackTypes.filter(x => x.id !== id);
          vm.persistCustomPacks();
          if (vm.packModel && vm.packModel.id === id) {
            vm.packModel = null;
            vm.goalModel = null;
            vm.showResult = false;
          }
          vm.packEditor.active = false;
          vm.$store.commit("DEFINE_DIALOG", { active: false });
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: vm.$t('m_deleteSuccess')
          });
        }
      });
    },
    toggleEditorCheck(icard) {
      let val = this.packEditor.cardsCriteria[icard] === 1 ? 0 : 1;
      Vue.set(this.packEditor.cardsCriteria, icard, val);
    },
    getLastest() {
      let vm = this;
      this.lastestLoading = true;
      

      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;

        let incomingCars = res.data.find(x => x.id === 'newCars').value;
        if (incomingCars && incomingCars.length > 0) {
          let rids = this.all_cars.map(x => x.rid);

          incomingCars.map(car => {
            if (!!(car.photoId && car.rq && car.onlyName && car.brand && car.country && car.year && car.clearance && car.topSpeed && car.hand && car.drive && car.tyres && car.weight && car.tags && car.bodyTypes && car.fuel && car.seats && car.engine)) {
              if (!rids.includes(car.rid)) {
                this.all_cars.push(car);
              }
            }
          })
          
          this.all_cars.sort((a,b) => {
            return b.rq - a.rq;
          })
        }

        let mraData = res.data.find(x => x.id === 'mra').value;
        this.all_cars.map(x => {
          Vue.set(x, "mra", mraData[x.rid] || x.mra);
        })


      })
      .catch(error => {
        this.lastestLoading = false;
        console.log(error);
      });

    },
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
      this.carsFilter = JSON.parse(JSON.stringify(filter));
      this.carsFilter.prizesModel = ["Non-Prize Cars"];

      this.packFilterDialog = false;
    },
    filterFinishPacks(listOfRids) {

    },
    insertCarPhoto(car) {
      let newCar = JSON.parse(JSON.stringify(car));
      newCar.color = Vue.resolveClass(newCar.rq, newCar.class, "color");
      newCar.count = 1;
      newCar.photo = Vue.carPhoto(newCar);
      return newCar;
    },
    run() {
      // this.$store.commit("START_LOGROCKET", {});
      this.resetRun();
      this.cacheFilterContexts();
      this.prepareAvailableCars();
      if (this.packFilterDescResolved.length > 0) this.prepareFreeCars();
      this.removeImpossibles();
      let viable = this.checkIfPackIsViable();
      if (!viable) {
        return;
      }
      if (viable === "noS") {
        // start again with isNoLeggyPack === true;
        this.resetRun();
        this.isNoLeggyPack = true;
        this.prepareAvailableCars();
        if (this.packFilterDescResolved.length > 0) this.prepareFreeCars();
        this.removeImpossibles();
        if (!this.checkIfPackIsViable()) {
          return;
        }
      }
      this.showResult = true;
      this.running = true;
      
      if (this.goalModel === 'noGoal') {
        this.finalLimit = this.numberOfOpensNoGoal;
        this.resolveNotGarantedClasses();
        this.startOpening();
      }

      if (this.goalModel === 'specificCar') {
        this.finalLimit = this.limit;
        this.simulateRunStats.goalRids = this.carDetailsList.slice();
        this.simulateRunStats.goalRidsOriginal = JSON.parse(JSON.stringify(this.simulateRunStats.goalRids));
        if (this.carDetailsList.length === 1) {
          this.simulateUntilGetOne = true;
        }
        console.log(this.simulateRunStats.goalRids);
        this.resolveProbabilityPerOpen(this.carDetailsList);
        this.startOpening();
      }

      if (this.isAttrGoal) {
        this.finalLimit = this.limit;
        if (this.numberOfMatchesNeededAttr < 1) this.numberOfMatchesNeededAttr = 1;
        if (!this.prepareCarsIwantInAvailableCars()) {
          this.running = false;
          return;
        }

        
        // console.log(this.simulateRunStats.availableCarsAndAttrFree.filter(x => x.name.includes("Drako")));
        console.log(this.simulateRunStats.availableCarsAndAttr.S.length);

        Object.keys(this.simulateRunStats.availableCarsAndAttrFree).map(key => {
          this.simulateRunStats.availableCarsAndAttrFree[key].map(car => {
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

      this.carDetailsList = this.carDetailsList.filter(rid => {
        let car = Vue.all_carsObj[rid]
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

        if (this.goalModel === 'specificCar' || this.isAttrGoal) {
          last.map(l => {
            this.simulateRunStats.goalRidsOriginal.map(g => {
              if (l.rid === g) {
                // one match
                this.simulateRunStats.goalRids = this.simulateRunStats.goalRids.filter(x => x !== l.rid);

                let found = this.defaultResultList.find(car => car.rid === l.rid);
                if (found) {
                  found.count++;
                } else {
                  let arrName = this.packFilterDescResolved.length === 0 ? "availableCars" : "freeCars";
                  this.defaultResultList.push(this.insertCarPhoto(this.simulateRunStats[arrName][l.class].find(car => car.rid == l.rid)));
                }

                if (this.goalModel === 'specificCar' && this.simulateUntilGetOne) {
                  this.simulateRunStats.success = true;
                }
              }
            })
          })
          if (this.goalModel === 'specificCar' && this.simulateRunStats.goalRids.length === 0) {
            this.simulateRunStats.success = true;
          }
          if (this.goalModel === 'specificAttr') {
            if (this.defaultResultList.reduce((accumulator, car) => accumulator + car.count, 0) >= this.numberOfMatchesNeededAttr) {
              this.simulateRunStats.success = true;
            }
          }
          // a repeat of a car already dropped is not a new car, so only distinct rids count
          if (this.goalModel === 'notOwned') {
            if (this.defaultResultList.length >= this.numberOfMatchesNeededAttr) {
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
        if (this.goalModel === 'noGoal') {
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
        let cumulativeClassValue = 0;
        arr.find(key => {
          cumulativeClassValue += card[key];
          if (cumulativeClassValue >= rng) {
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
    // BaseFilterDialog rebuilds its filter context on every checkMatchFilter() call, and
    // when a filter is untouched that rebuild runs resolveFilterCount() -- ~40 JSON.stringify
    // comparisons -- per car. The context cannot change mid-run, so resolve it once here and
    // hand it to every check as argFilter.
    cacheFilterContexts() {
      this.packFilterContext = this.$refs.packFilter.resolveFilterContext();
      this.attrFilterContext = this.$refs.attrFilter.resolveFilterContext();
    },
    prepareAvailableCars() {
      // filled as plain arrays first: pushing straight into the observed ones would fire
      // a reactivity notification per car. one assignment per class at the end instead.
      let buckets = {};
      Object.keys(this.simulateRunStats.availableCars).map(key => {
        buckets[key] = [];
      })
      // one pass bucketed by class, instead of one full scan per class
      this.all_cars.map(car => {
        if (!buckets[car.class]) return;
        if (!this.matchFilter(car)) return;
        buckets[car.class].push(car);
      })
      Object.keys(buckets).map(key => {
        this.simulateRunStats.availableCars[key] = buckets[key];
      })
    },
    prepareFreeCars() {
      let buckets = {};
      Object.keys(this.simulateRunStats.freeCars).map(key => {
        buckets[key] = [];
      })
      this.all_cars.map(car => {
        if (!buckets[car.class]) return;
        if (car.prize) return;
        buckets[car.class].push(car);
      })
      Object.keys(buckets).map(key => {
        this.simulateRunStats.freeCars[key] = buckets[key];
      })
    },
    prepareCarsIwantInAvailableCars() {
      let sum = 0;
      let isViable = true;
      let classes = {};
      this.currentPackCards.map(x => {
        Object.keys(x).map(key => {
          classes[key] = true;
        })
      })

      let withAttr = {};
      let withAttrFree = {};
      Object.keys(this.simulateRunStats.availableCarsAndAttr).map(key => {
        if (!classes[key]) return;
        withAttr[key] = [];
        withAttrFree[key] = [];
      })

      // one pass: matchGoalCar decides both buckets, matchFilter only narrows the first one
      this.all_cars.map(car => {
        if (withAttr[car.class] === undefined) return;
        if (!this.matchGoalCar(car)) return;
        withAttrFree[car.class].push(car);
        if (this.matchFilter(car)) withAttr[car.class].push(car);
      })

      Object.keys(withAttr).map(key => {
        this.simulateRunStats.availableCarsAndAttr[key] = withAttr[key];
        this.simulateRunStats.availableCarsAndAttrFree[key] = withAttrFree[key];
        sum += withAttr[key].length;
        sum += withAttrFree[key].length;
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
      if (this.packFilterDescResolved.length && !this.$refs.packFilter.checkMatchFilter(car, undefined, this.packFilterContext)) return false;
      if (!car.prize) return true;
    },
    // the requirement filter, plus the garage check when the goal is "not owned"
    matchGoalCar(car) {
      if (!this.matchFilterAttr(car)) return false;
      if (this.goalModel === 'notOwned' && !this.isNewCar(car)) return false;
      return true;
    },
    matchFilterAttr(car) {
      if (!this.$refs.attrFilter.checkMatchFilter(car, undefined, this.attrFilterContext)) return false;
      if (!car.prize) return true;
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
      this.simulateRunStats.availableCarsAndAttrFree.S = [];
      this.simulateRunStats.availableCarsAndAttrFree.A = [];
      this.simulateRunStats.availableCarsAndAttrFree.B = [];
      this.simulateRunStats.availableCarsAndAttrFree.C = [];
      this.simulateRunStats.availableCarsAndAttrFree.D = [];
      this.simulateRunStats.availableCarsAndAttrFree.E = [];
      this.simulateRunStats.availableCarsAndAttrFree.F = [];
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
      this.simulateRunStats.probabilityNewCar = 0;
      this.simulateRunStats.luckScore = 0;
      this.simulateRunStats.notGarantedClasses = [];
      this.simulateRunStats.mainClasses = [];
      this.showingDroppedCars = false;
      this.defaultResultList = [];
      this.showDefaultResultList = true;
      this.viewingClass = null;
      this.isNoLeggyPack = false;
    },
    resolveProbabilityPerOpen(carList) {
      let countPerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let countPerClassFree = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let chancePerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let chanceResultPerLine = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
      let result = 0;
      let result2 = 0;
      carList.map(rid => {
        let car = Vue.all_carsObj[rid];
        if (car.rq >= 80 && this.matchFilter(car)) countPerClass.S++;
        else if (car.rq >= 65 && this.matchFilter(car)) countPerClass.A++;
        else if (car.rq >= 50 && this.matchFilter(car)) countPerClass.B++;
        else if (car.rq >= 40 && this.matchFilter(car)) countPerClass.C++;
        else if (car.rq >= 30 && this.matchFilter(car)) countPerClass.D++;
        else if (car.rq >= 20 && this.matchFilter(car)) countPerClass.E++;
        else if (car.rq >= 10 && this.matchFilter(car)) countPerClass.F++;

        if (car.rq >= 80) countPerClassFree.S++;
        else if (car.rq >= 65) countPerClassFree.A++;
        else if (car.rq >= 50) countPerClassFree.B++;
        else if (car.rq >= 40) countPerClassFree.C++;
        else if (car.rq >= 30) countPerClassFree.D++;
        else if (car.rq >= 20) countPerClassFree.E++;
        else if (car.rq >= 10) countPerClassFree.F++;
      })
      

      if (this.simulateUntilGetOne) {
        
        this.currentPackCards.map((card, icard) => {
          let thisChanceResult = 0;

          Object.keys(card).map(key => {
            
            let thisChance = 0;

            if (this.isFromFree(icard)) {
              if (countPerClassFree[key] === 0) return;
              thisChance = card[key] / (this.simulateRunStats.freeCars[key].length / countPerClassFree[key])
            } else {
              if (countPerClass[key] === 0) return;
              thisChance = card[key] / (this.simulateRunStats.availableCars[key].length / countPerClass[key])
            }

            thisChanceResult += thisChance;

            if (chancePerClass[key] === 0) {
              chancePerClass[key] = thisChance;
            } else {
              chancePerClass[key] = this.sumOds(chancePerClass[key], thisChance);
            }
          })

          chanceResultPerLine[icard] = thisChanceResult;

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
        
        Object.keys(countPerClassFree).reverse().map(key => {
          if (countPerClassFree[key] > 0) highestClass = key;
        })
        this.currentPackCards.map((card, icard) => {
          let thisChanceResult = 0;

          Object.keys(card).map(key => {
            if (highestClass !== key) return;
            let thisChance = 0;

            if (this.isFromFree(icard)) {
              if (countPerClassFree[key] === 0) return;
              thisChance = card[key] * (1 / (this.simulateRunStats.freeCars[key].length * countPerClassFree[key]))
            } else {
              if (countPerClass[key] === 0) return;
              thisChance = card[key] * (1 / (this.simulateRunStats.availableCars[key].length * countPerClass[key]))
            }

            thisChanceResult += thisChance;

            if (chanceOfThisClass === 0) {
              chanceOfThisClass = thisChance;
            } else {
              chanceOfThisClass = this.sumOds(chanceOfThisClass, thisChance);
            }
          })

          chanceResultPerLine[icard] = thisChanceResult;
          
        })
        result = chanceOfThisClass;
      }

      Object.keys(chanceResultPerLine).map(key => {
        if (chanceResultPerLine[key] !== 0) {
          if (result2 === 0) result2 = chanceResultPerLine[key];
          else {
            result2 = this.sumOds(result2, chanceResultPerLine[key]);
          }
        }
      })
      
      this.simulateRunStats.probabilityPerOpen = result2;
    },
    resolveProbabilityPerOpenAttr() {
      let countPerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let countPerClassFree = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let chancePerClass = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let chanceResultPerLine = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
      let result = 0;
      let result2 = 0;
      let needed = this.numberOfMatchesNeededAttr;
      // let arrName = this.packFilterDescResolved.length === 0 ? "availableCars" : "freeCars";

      Object.keys(this.simulateRunStats.availableCarsAndAttr).map(key => {
        countPerClass[key] = this.simulateRunStats.availableCarsAndAttr[key].length;
      })
      Object.keys(this.simulateRunStats.availableCarsAndAttrFree).map(key => {
        countPerClassFree[key] = this.simulateRunStats.availableCarsAndAttrFree[key].length;
      })


      this.currentPackCards.map((card, icard) => {
        let thisChanceResult = 0;

        Object.keys(card).map(key => {
          let thisChance = 0;

          if (this.isFromFree(icard)) {
            if (countPerClassFree[key] === 0) return;
            thisChance = card[key] / (this.simulateRunStats.freeCars[key].length / (countPerClassFree[key] / needed))
          } else {
            if (countPerClass[key] === 0) return;
            thisChance = card[key] / (this.simulateRunStats.availableCars[key].length / (countPerClass[key] / needed))
          }

          // console.log(this.isFromFree(icard), icard, thisChance);
          
          thisChanceResult += thisChance;

          if (chancePerClass[key] === 0) {
            chancePerClass[key] = thisChance;
          } else {
            chancePerClass[key] = this.sumOds(chancePerClass[key], thisChance);
          }
        })

        chanceResultPerLine[icard] = thisChanceResult;

      })

      // console.log(chanceResultPerLine);




      Object.keys(chancePerClass).map(key => {
        if (chancePerClass[key] !== 0) {
          if (result === 0) result = chancePerClass[key];
          else {
            result = this.sumOds(result, chancePerClass[key]);
          }
        }
      })
      Object.keys(chanceResultPerLine).map(key => {
        if (chanceResultPerLine[key] !== 0) {
          if (result2 === 0) result2 = chanceResultPerLine[key];
          else {
            result2 = this.sumOds(result2, chanceResultPerLine[key]);
          }
        }
      })

      // console.log("result2", result2);

      this.simulateRunStats.probabilityPerOpen = result2;
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
        this.viewingClass = cls;
        this.listDroppedCars.sort((a,b) => {
          return b.rq - a.rq;
        });
        this.showingDroppedCars = true;
        this.showDefaultResultList = false;
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
      this.defaultResultList = [];
      let ridsOnly = [];
      let importantClasses = ["S", "A", "B"];

      this.simulateRunStats.mainClasses.map(cls => {
        if (!importantClasses.includes(cls)) {
          importantClasses.push(cls);
        }
      })

      importantClasses.map(cls => {
        if (this.simulateRunStats[cls] > 300 && cls !== this.simulateRunStats.mainClasses[0]) return;
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

      importantClasses.map(cls => {
        if (this.simulateRunStats[cls] > 300) return;
        this.simulateRunStats.droppedRids[cls].map(c => {
          let found = this.defaultResultList.find(car => car.rid === c.rid);
          if (found) {
            found.count++;
          } else {
            this.defaultResultList.push(this.insertCarPhoto(carsUsedOnly.find(car => car.rid == c.rid)))
          }
        })
      })

      if (this.defaultResultList.length > 0) {
        this.defaultResultList.sort((a,b) => {
          return b.rq - a.rq;
        });
        this.showDefaultResultList = true;
      }
    },
    openCarFullDetail(car) {
      this.T_S._g_cFull.car = Vue.all_carsObj[car.rid];
      this.T_S._g_cFull.dialog = true;
      this.T_S._g_cFull.close = () => {
        this.T_S._g_cFull.dialog = false;
      };
    },
    isFromFree(icard) {
      if (this.packFilterDescResolved.length === 0) return false;
      if (this.packModel.cardsCriteria && this.packModel.cardsCriteria[icard] !== undefined) {
        return !this.packModel.cardsCriteria[icard];
      }
      if (icard === 0) return false;
      // if (icard === 1 && this.packModel.name === "Carbon Fiber") return false;
      // if ((icard === 1 || icard === 2) && this.packModel.name === "Finals Titanium") return false;
      // if ((icard === 1 || icard === 2) && this.packModel.name === "Finals Platinum") return false;
      // if (icard === 1 && this.packModel.name === "Finals Super Carbon") return false;
      return true;
    },
    checkIfPackIsViable() {
      let isViable = true;
      let arrName = this.packFilterDescResolved.length === 0 ? "availableCars" : "freeCars";
      let missingClass;

      this.currentPackCards.map((card, icard) => {
        Object.keys(card).map(cls => {

          if (this.isFromFree(icard)) {
            if (this.simulateRunStats.freeCars[cls].length === 0) {
              isViable = false;
              missingClass = cls;
            }
          } else {
            if (this.simulateRunStats.availableCars[cls].length === 0) {
              isViable = false;
              missingClass = cls;
            }
          }

        })
      })

      if (isViable) return true;

      if (missingClass === "S") {
        return "noS";
      }

      this.$store.commit("DEFINE_SNACK", {
        active: true,
        error: true,
        text: `${this.$t('m_impossiblePack')} (No ${missingClass})`
      });
      
      return false;

    },
    closeClass() {
      this.viewingClass = null;
      this.showDefaultResultList = true;
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
.MainPacks_GarageBox {
  padding-top: 20px;
}
.MainPacks_GarageLoaded {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9em;
  color: rgb(var(--d-text-green));
  background-color: rgba(var(--d-text-green), 0.12);
  border-radius: 6px;
  padding: 5px 10px;
}
.MainPacks_OtherPackDivider {
  font-size: 0.7em;
  opacity: 0.5;
  padding: 12px 15px 4px 15px;
}
.MainPacks_CustomBar {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}
.MainPacks_Editor {
  max-width: 600px;
  width: 100%;
  box-sizing: border-box;
  margin: 10px auto 0 auto;
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}
.MainPacks_EditorHead {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px 15px;
  width: 100%;
  max-width: 350px;
}
.MainPacks_EditorName {
  flex-grow: 1;
  min-width: 130px;
}
.MainPacks_EditorColors {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.MainPacks_EditorColorsBox {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 40px;
}
.D_Button.MainPacks_EditorColor {
  --height: 26px;
  width: 26px;
  min-width: 26px;
  height: 26px;
  padding: 0;
  border-radius: 4px;
  background-image: linear-gradient(160deg, var(--b1) 0%, var(--b2) 45%, var(--g1) 47%, var(--g2) 100%);
}
.D_Button.MainPacks_EditorColorActive {
  /* box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow)); */
  height: 40px;
}
.MainPacks_EditorGrid {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.MainPacks_EditorGrid::-webkit-scrollbar {
  height: 6px;
}
.MainPacks_EditorGrid::-webkit-scrollbar-track {
  background-color: #0002;
}
.MainPacks_EditorGrid::-webkit-scrollbar-thumb {
  background-color: #555;
}
.MainPacks_EditorRow {
  display: grid;
  grid-template-columns: 1.4em repeat(7, minmax(32px, 1fr)) 2.1em 2.1em 1.6em;
  gap: 3px;
  align-items: center;
  min-width: 385px;
}
.MainPacks_EditorNum {
  font-size: 0.75em;
  opacity: 0.5;
  text-align: center;
}
.MainPacks_EditorCls {
  text-align: center;
  font-weight: bold;
  background-color: var(--cor);
  transform: skewY(9deg);
  color: black;
  opacity: 0.8;
  width: 1.3em;
  justify-self: center;
  margin: 6px 0;
}
.MainPacks_RateInput {
  background-color: rgba(0,0,0,0.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text-b);
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  text-align: center;
  padding: 8px 2px;
  width: 100%;
  transition-duration: 0.1s;
}
.MainPacks_RateInput:hover {
  box-shadow: 0px 0px 0px 2px #fff2;
}
.MainPacks_RateInput:focus {
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
}
.MainPacks_EditorSum {
  text-align: center;
  font-size: 0.72em;
  border-radius: 3px;
  padding: 3px 0;
}
.MainPacks_EditorSumOk {
  color: rgb(var(--d-text-green));
  background-color: rgba(var(--d-text-green), 0.12);
}
.MainPacks_EditorSumBad {
  color: rgb(var(--d-text-red2));
  background-color: rgba(var(--d-text-red), 0.12);
}
.MainPacks_EditorCheck {
  text-align: center;
  font-size: 0.72em;
}
.D_Button.MainPacks_EditorDel {
  --height: 24px;
  width: 24px;
  min-width: 24px;
  height: 24px;
  padding: 0;
  font-size: 14px;
  width: 100%;
  color: #fff4;
}
.MainPacks_EditorButtons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.MainPacks_EditorButtonsRight {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  gap: 8px;
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
.BasePackSvg_C_STEEL .MainPacks_CustomizeIcon,
.BasePackSvg_C_CERAMIC .MainPacks_CustomizeIcon,
.BasePackSvg_C_ALUMINIUM .MainPacks_CustomizeIcon {
  color: black;
}
.MainPacks_ResultLine > div {
  position: relative;
}
.D_Button.MainPacks_CloseClass {
  position: absolute;
  top: -23px;
  left: 50%;
  transform: translateX(-50%) !important;
  background-color: rgb(41 41 41);
  border-radius: 50%;
  padding: 0px;
  width: 30px;
  min-width: 30px;
  height: 30px;
  min-height: 30px;
}

</style>