<template>
  <div class="MainCheatSheet_Root">
    <div class="MainCheatSheet_Box">
      <div class="MainTranslate_Logo" style="margin-top: 40px;">
      </div>
      <div class="MainCheatSheet_Layout">
        <div class="MainCheatSheet_TyresLayout">
          <div class="MainCheatSheet_TyresGrid" :class="{ MainCheatSheet_TyresRelative: tyres.relativeToBest }">
            <!-- Line1 -->
            <div class="MainCheatSheet_TyresTopLeftBox">
              <div class="MainCheatSheet_Title" style="margin-bottom: 0px;">Tyres grip</div>
              <div class="MainCheatSheet_TyresTopLeft">
                <template v-for="(item, ix) in tyres.drives">
                  <BaseChip
                    v-model="tyres.drivesModel"
                    class="BaseChip_MinWidth BaseChip_Small"
                    required="true"
                    :value="item"
                    @click="tyreDriveChanged()" />
                </template>
              </div>
            </div>
            <div v-for="(tyre, xtyre) in tyres.tyres" class="MainCheatSheet_TyresTopItem">
              <BaseTyreSvg :tyre="tyre" class="MainCheatSheet_TyreSvg" :style="`z-index: ${xtyre*-1+6}`"/>
              <div class="MainCheatSheet_TyresTopName">
                <div class="MainCheatSheet_TyresLabel MainCheatSheet_TyresLabelShort">{{ $t(`c_${tyre.toLowerCase()}2`) }}</div>
                <div class="MainCheatSheet_TyresLabel MainCheatSheet_TyresLabelComplete">{{ $t(`c_${tyre.toLowerCase()}`) }}</div>
              </div>
            </div>
            <!-- Lines 1~8 -->
            <template v-for="(line, xline) in tyres[tyres.relativeToBest ? 'valuesRelative' : 'values']">
              <div class="MainCheatSheet_TyresLeftSurface MainCheatSheet_Cell MainCheatSheet_CellBold MainCheatSheet_CellSurface">
                <BaseTypeName :type="line.type" class="MainCheatSheet_TyresSurfaceName" />
              </div>
              <div
                v-for="(friction, xfriction) in line[tyres.drivesModel]"
                :class="{ MainCheatSheet_CellTop: xline === 0 }"
                :style="`--opac: ${friction}%; --color-index: ${friction-10};`"
                class="MainCheatSheet_TyresFrictionItem MainCheatSheet_Cell">
                <span>{{ friction }}%</span>
                <span
                  v-if="line.diffs && line.diffs[xfriction] !== 0"
                  :class="{
                    MainCheatSheet_TyresDiffsNegative: line.diffs[xfriction] < 0,
                    MainCheatSheet_TyresDiffsAnimate: tyreAnimation,
                  }"
                  class="MainCheatSheet_TyresDiffs">{{ line.diffs[xfriction] > 0 ? '+' : '' }}{{ line.diffs[xfriction] }}</span>
              </div>
            </template>
          </div>
          <div class="MainCheatSheet_TipBox">
            <BaseSwitch
              v-model="tyres.relativeToBest"
              :horizontal="true"
              :label="$t('m_relativeBest')"
              @change="tyreDriveChanged()" />
          </div>
        </div>
        <div class="MainCheatSheet_ClassesInfo MainCheatSheet_SpaceTop">
          <div class="MainCheatSheet_Title">Car costs</div>
          <div class="MainCheatSheet_ClassesGrid">
            <template v-for="(item, key, index) in carCosts">
              <template v-if="key === 'classes' || key === 'classesEnd'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_EmptySpace MainCheatSheet_ClassesHeader" :class="{ MainCheatSheet_EmptySpaceEnd: key === 'classesEnd' }"></div>
                <div v-for="(h, ih) in carCosts.classes" class="MainCheatSheet_ClassesCell MainCheatSheet_ClassesHeader" :style="`--classC: ${classesColorsRgb[ih]}`">
                  <div class="MainCheatSheet_ClassesClass">{{ h }}</div>
                </div>
              </template>
              <template v-if="key.includes('upgrade')">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_RowLabel MainCheatSheet_UpgradeLabel" :class="{ MainCheatSheet_CellHighlight: (Math.ceil((index-3)/3) % 3)+1 === 2 }">{{ (Math.ceil((index-3)/3) % 3)+1 }}.{{ ((index-1) % 3)+0 }}<i class="ticon-arrow_right_3 MainCheatSheet_UpgradeArrow" aria-hidden="true"/>{{ (Math.ceil((index-3)/3) % 3)+1 }}.{{ ((index-1) % 3)+1 }}</div>
                <div v-for="h in carCosts[key]" class="MainCheatSheet_ClassesCell" :class="{ MainCheatSheet_CellHighlight: (Math.ceil((index-3)/3) % 3)+1 === 2 }">
                  <div class="MainCheatSheet_CellInner"><BaseIconSvg type="cash" :useMargin="false" class="MainCheatSheet_ClassesIcon" />{{ h }}</div>
                </div>
              </template>
              <template v-if="key === 'fuse1' || key === 'fuse2'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_RowLabel" :class="{ MainCheatSheet_CellHighlight: key.includes('1') }">Stage {{ key.replace(/[^\d]/g, '') }}</div>
                <div v-for="h in carCosts[key]" class="MainCheatSheet_ClassesCell" :class="{ MainCheatSheet_CellHighlight: key.includes('1') }">
                  <div class="MainCheatSheet_CellInner"><BaseIconSvg type="cash" :useMargin="false" class="MainCheatSheet_ClassesIcon" />{{ h }}</div>
                </div>
              </template>
              <template v-if="key === 'fuse1Time' || key === 'fuse2Time'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_RowLabel" :class="{ MainCheatSheet_CellHighlight: key.includes('1') }">Time</div>
                <div v-for="h in carCosts[key]" class="MainCheatSheet_ClassesCell" :class="{ MainCheatSheet_CellHighlight: key.includes('1') }">
                  <div class="MainCheatSheet_CellInner">{{ h }}</div>
                </div>
              </template>
              <template v-if="key === 'fuse1SkipGold' || key === 'fuse2SkipGold'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_RowLabel" :class="{ MainCheatSheet_CellHighlight: key.includes('1') }">Skip</div>
                <div v-for="h in carCosts[key]" class="MainCheatSheet_ClassesCell" :class="{ MainCheatSheet_CellHighlight: key.includes('1') }">
                  <div class="MainCheatSheet_CellInner"><BaseIconSvg type="gold" :useMargin="false" class="MainCheatSheet_ClassesIcon" />{{ h }}</div>
                </div>
              </template>
              <template v-if="key.includes('serviceTime')">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_RowLabel">Time {{ key === 'serviceTime10' ? '10x' : '' }}</div>
                <div v-for="h in carCosts[key]" class="MainCheatSheet_ClassesCell">
                  <div class="MainCheatSheet_CellInner">{{ h }}</div>
                </div>
              </template>
              <template v-if="key === 'serviceSkipGold'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_RowLabel">Skip</div>
                <div v-for="h in carCosts[key]" class="MainCheatSheet_ClassesCell">
                  <div class="MainCheatSheet_CellInner"><BaseIconSvg type="gold" :useMargin="false" class="MainCheatSheet_ClassesIcon" />{{ h }}</div>
                </div>
              </template>
              <template v-if="key === 'Upgrades' || key === 'Fuse Time' || key === 'Fuse Skip' || key === 'Stock' || key === 'Maxed'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_RowLabel">{{ key }}</div>
                <div v-for="h in carCosts[key]" class="MainCheatSheet_ClassesCell" :class="{ MainCheatSheet_Classes_LongNumber: typeof h === 'number' && key !== 'Fuse Skip' }">
                  <div class="MainCheatSheet_CellInner"><BaseIconSvg v-if="typeof h === 'number'" :type="key === 'Fuse Skip' ? 'gold' : 'cash'" :useMargin="false" class="MainCheatSheet_ClassesIcon" />{{ h }}</div>
                </div>
              </template>
              <template v-if="key.includes('divider')">
                <div class="MainCheatSheet_RowDivider">{{ item }}</div>
              </template>
            </template>
          </div>
          <div class="MainCheatSheet_TipBox">
            <div class="MainCheatSheet_Tip">Legendary (S) cars can be fused using 3x epics (A) or 1x duplicate S</div>
          </div>
        </div>
        <div class="MainCheatSheet_ClassesInfo MainCheatSheet_SpaceTop">
          <div class="MainCheatSheet_Title">Club rewards per event</div>
          <div class="MainCheatSheet_ClubRewardsGrid">
            <template v-for="(item, key, index) in clubEvent">
              <template v-if="key === 'headers'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_EmptySpace MainCheatSheet_ClubRewardsHeader"></div>
                <div v-for="(h, ih) in clubEvent[key]" class="MainCheatSheet_ClassesCell MainCheatSheet_ClubRewardsHeader">{{ h }}</div>
              </template>
              <template v-else-if="!key.includes('divider') && !key.includes('total')">
                <div
                  v-for="(h, ih) in clubEvent[key]"
                  class="MainCheatSheet_ClassesCell"
                  :class="{
                    MainCheatSheet_ClubsCellImg: typeof h === 'string' && (h.includes('BadgeParticipaation') || h.includes('BadgeRank')),
                    MainCheatSheet_ClassesLabelCell: ih === 0,
                    MainCheatSheet_CellHighlight: false
                  }">
                  <div class="MainCheatSheet_CellInner">
                    <BaseIconSvg v-if="ih === 2" type="cash" :useMargin="false" class="MainCheatSheet_ClassesIcon" />
                    <img v-if="typeof h === 'string' && h.includes('Badge')" :src="imgsObj[h]" class="MainCheatSheet_ClubBadge" alt="" />
                    <span v-else-if="typeof h === 'number'">{{ h * (clubMultiplier ? 2 : 1) }}</span>
                    <span v-else>{{ h }}</span>
                  </div>
                </div>
                <div class="MainCheatSheet_ClassesCell">
                  <BaseCheckBox :value="clubEventCheckObj[key.replace(/[\d]/g, '')] === key" @change="clubEventCheckObj[key.replace(/[\d]/g, '')] = key"/>
                </div>
              </template>
              <template v-else-if="key.includes('total')">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_EmptySpace MainCheatSheet_ClubRewardsHeader MainCheatSheet_EmptySpaceEnd"></div>
                <div class="MainCheatSheet_ClassesCell MainCheatSheet_EmptySpaceEnd"></div>
                <div class="MainCheatSheet_ClassesCell MainCheatSheet_EmptySpaceSemiEnd">
                  <div class="MainCheatSheet_CellInner">
                    <BaseIconSvg type="cash" :useMargin="false" class="MainCheatSheet_ClassesIcon" />
                    <span>{{ Object.keys(clubEventCheckObj).map(k => clubEvent[clubEventCheckObj[k]][2]).reduce((a,b) => a+b) * (clubMultiplier ? 2 : 1) }}</span>
                  </div>
                </div>
                <div class="MainCheatSheet_ClassesCell">
                  <div class="MainCheatSheet_CellInner">
                    <span>{{ Object.keys(clubEventCheckObj).map(k => clubEvent[clubEventCheckObj[k]][3]).reduce((a,b) => a+b) * (clubMultiplier ? 2 : 1) }}</span>
                  </div>
                </div>
                <div class="MainCheatSheet_ClassesCell" style="grid-column: 5 / -1;">
                  <BaseSwitch
                    v-model="clubMultiplier"
                    :horizontal="true"
                    :label="$t('m_2xmultiplier')" />
                </div>
              </template>
              <template v-else-if="key.includes('divider')">
                <div class="MainCheatSheet_RowDivider">{{ item }}</div>
              </template>
            </template>
          </div>
          <div class="MainCheatSheet_TipBox">
            
          </div>
        </div>
        <div class="MainCheatSheet_ClassesInfo MainCheatSheet_SpaceTop">
          <div class="MainCheatSheet_Title">Club rewards per season (48h)</div>
          <div class="MainCheatSheet_ClubRewardsSeasonGrid">
            <template v-for="(item, key, index) in clubSeason">
              <template v-if="key === 'headers'">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_EmptySpace MainCheatSheet_ClubRewardsHeader"></div>
                <div v-for="(h, ih) in clubSeason[key]" class="MainCheatSheet_ClassesCell MainCheatSheet_ClubRewardsHeader">{{ h }}</div>
              </template>
              <template v-else-if="!key.includes('divider') && !key.includes('total')">
                <div
                  v-for="(h, ih) in clubSeason[key]"
                  class="MainCheatSheet_ClassesCell"
                  :class="{
                    MainCheatSheet_ClubsCellImg: typeof h === 'string' && (h.includes('BadgeParticipaation') || h.includes('BadgeRank')),
                    MainCheatSheet_ClassesLabelCell: ih === 0,
                    MainCheatSheet_CellHighlight: false
                  }">
                  <div class="MainCheatSheet_CellInner">
                    <BaseIconSvg v-if="ih === 2" type="cash" :useMargin="false" class="MainCheatSheet_ClassesIcon" />
                    <BaseIconSvg v-if="ih === 3" type="gold" :useMargin="false" class="MainCheatSheet_ClassesIcon" />
                    <img v-if="typeof h === 'string' && h.includes('Badge')" :src="imgsObj[h]" class="MainCheatSheet_ClubBadge" alt="" />
                    <span v-else-if="typeof h === 'number'">{{ h }}</span>
                    <span v-else>{{ h }}</span>
                  </div>
                </div>
                <div class="MainCheatSheet_ClassesCell">
                  <BaseCheckBox :value="clubSeasonCheckObj[key.replace(/[\d]/g, '')] === key" @change="clubSeasonCheckObj[key.replace(/[\d]/g, '')] = key"/>
                </div>
              </template>
              <template v-else-if="key.includes('total')">
                <div class="MainCheatSheet_ClassesLabelCell MainCheatSheet_EmptySpace MainCheatSheet_ClubRewardsHeader MainCheatSheet_EmptySpaceEnd"></div>
                <div class="MainCheatSheet_ClassesCell MainCheatSheet_EmptySpaceEnd"></div>
                <div class="MainCheatSheet_ClassesCell MainCheatSheet_EmptySpaceSemiEnd">
                  <div class="MainCheatSheet_CellInner">
                    <BaseIconSvg type="cash" :useMargin="false" class="MainCheatSheet_ClassesIcon" />
                    <span>{{ Object.keys(clubSeasonCheckObj).map(k => clubSeason[clubSeasonCheckObj[k]][2]).reduce((a,b) => a+b) }}</span>
                  </div>
                </div>
                <div class="MainCheatSheet_ClassesCell">
                  <div class="MainCheatSheet_CellInner">
                    <BaseIconSvg type="gold" :useMargin="false" class="MainCheatSheet_ClassesIcon" />
                    <span>{{ Object.keys(clubSeasonCheckObj).map(k => clubSeason[clubSeasonCheckObj[k]][3]).reduce((a,b) => a+b) }}</span>
                  </div>
                </div>
                <div class="MainCheatSheet_ClassesCell"></div>
              </template>
              <template v-else-if="key.includes('divider')">
                <div class="MainCheatSheet_RowDivider">{{ item }}</div>
              </template>
            </template>
          </div>
        </div>
        <div class="MainCheatSheet_MRA_CalcLayout MainCheatSheet_SpaceTop">
          <div class="MainCheatSheet_Title">MRA Calculator</div>
          <div class="MainCheatSheet_MRA_Calculator">
            <BaseText
              v-model="mra1"
              class="BaseText_Big"
              type="acelSoft"
              label="0-60 value"
              style="width: 130px;"
              placeholder=""
              @change="calcMra();" />
            <div class="MainCheatSheet_MRA_RowBox">
              <div class="BaseText_Label">0-100 time</div>
              <Row
                :car="fakeCar1"
                :list="[chartTrack]"
                :loggedin="!!user"
                :user="user"
                :voteLoading="voteLoading"
                :cg="true"
                :cgOppo="true"
                :cgTime="fakeTime1"
                :forceDisabled="!user || !user.mod || !chartTrack"
                :forceCustomAuthor="true"
                :customData="fakeCustomData1"
                class="MainCheatSheet_MRA_Row"
                style="width: 130px;"
                placeholder=""
                type="times"
                @changeTime="mra2 = $event.number; calcMra();" />
            </div>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              style="margin-top: 19px;"
              @click="calcMra()">
              <i class="ticon-arrow_down_3" aria-hidden="true"/>
            </button>
          </div>
          <div class="MainCheatSheet_MRA_Result">
            <div v-if="mraResult" class="MainCheatSheet_MRA_ResultValue">{{ mraResult }} MRA</div>
          </div>
        </div>
        <div class="MainCheatSheet_DictLayout MainCheatSheet_SpaceTop">
          <div class="MainCheatSheet_Title">Dictionary</div>
          <div class="MainCheatSheet_Dict">
            <button
              v-for="item in dictionary"
              :class="{
                MainCheatSheet_DictItemSelected: dictionarySelected && dictionarySelected.term === item.term,
                D_ButtonDisabledVisible: !item.short
              }"
              class="MainCheatSheet_DictItem D_Button"
              @click="dictClick(item)">
              <div class="MainCheatSheet_D_Title">{{ item.term }}</div>
              <div class="MainCheatSheet_DictSub">{{ item.name }} <i v-if="item.short" :class="dictionarySelected && dictionarySelected.term === item.term ? `ticon-arrow_up_2` : `ticon-arrow_down_2`" style="font-size: 0.7em;" aria-hidden="true"/></div>
            </button>
          </div>
        </div>
        <div v-if="dictionarySelected" class="MainCheatSheet_DictExpanded MainCheatSheet_SpaceTop">
          <div class="MainCheatSheet_D_Title">{{ dictionarySelected.term }}</div>
          <div class="MainCheatSheet_DictDescriptionSub">{{ dictionarySelected.name }}</div>
          <div class="MainCheatSheet_DictDescriptionShort">{{ dictionarySelected.short }}</div>
          <div class="MainCheatSheet_DictDescriptionDesc">{{ dictionarySelected.desc }}</div>
        </div>
        <div class="MainCheatSheet_PenaltyLayout MainCheatSheet_SpaceTop">
          <div class="MainCheatSheet_Title">Special tracks</div>
          <div class="MainCheatSheet_Penalty">
            <div
              v-for="item in tracksPenalty"
              class="MainCheatSheet_PenaltyItem">
              <div class="MainCheatSheet_PenaltyTitle">{{ item.name }}</div>
              <div class="MainCheatSheet_PenaltyList">
                <div v-for="code in item.tracks" class="MainCheatSheet_PenaltyTrack">{{ $t(`t_${code}`) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BaseFilterDialog ref="cheatSheetFilter"/>
  </div>
</template>

<script>
import BaseText from "./BaseText.vue";
import BaseChip from "./BaseChip.vue";
import BaseDialog from "./BaseDialog.vue";
import BaseGameTag from "./BaseGameTag.vue";
import BaseCard from "./BaseCard.vue";
import BaseTyreSvg from "./BaseTyreSvg.vue";
import BaseTypeName from "./BaseTypeName.vue";
import BaseIconSvg from "./BaseIconSvg.vue";
import BaseSwitch from "./BaseSwitch.vue";
import BaseCheckBox from "./BaseCheckBox.vue";
import Row from "./Row.vue";
import Logo from "./Logo.vue";
import BaseFilterDialog from "./BaseFilterDialog.vue";

export default {
  name: 'MainCheatSheet',
  components: {
    BaseText,
    Logo,
    BaseFilterDialog,
    BaseChip,
    BaseDialog,
    BaseCard,
    BaseGameTag,
    BaseTyreSvg,
    BaseTypeName,
    Row,
    BaseIconSvg,
    BaseSwitch,
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
      loading: false,
      tyres: {
        tyres: ["off-road", "all-surface", "standard", "performance", "slick"],
        drivesModel: "4WD",
        relativeToBest: false,
        oldDrivesModel: "4WD",
        oldValueKey: "values",
        drives: ["FWD", "RWD", "4WD"],
        values: [ //             of  al  st  pf  sl            of  al  st  pf  sl            of  al  st  pf  sl
          { type: "00", "4WD": [100,100,100,100,100], "RWD": [100,100,100,100,100], "FWD": [100,100,100,100,100] }, // aspht
          { type: "01", "4WD": [ 80, 95, 98, 90, 65], "RWD": [ 78, 90, 94, 87, 61], "FWD": [ 76, 88, 92, 85, 59] }, // wet
          { type: "10", "4WD": [ 80, 75, 70, 65, 60], "RWD": [ 73, 70, 65, 60, 55], "FWD": [ 71, 68, 63, 58, 53] }, // dirt
          { type: "11", "4WD": [ 70, 65, 60, 50, 35], "RWD": [ 64, 60, 55, 45, 35], "FWD": [ 63, 58, 54, 43, 33] }, // dirtWet
          { type: "20", "4WD": [ 70, 70, 65, 60, 50], "RWD": [ 65, 65, 60, 55, 50], "FWD": [ 64, 64, 59, 54, 49] }, // gravel
          { type: "50", "4WD": [ 70, 65, 60, 55, 45], "RWD": [ 68, 60, 55, 50, 42], "FWD": [ 66, 58, 53, 48, 40] }, // sand
          { type: "70", "4WD": [ 65, 60, 55, 50, 40], "RWD": [ 60, 55, 50, 45, 37], "FWD": [ 58, 53, 48, 43, 35] }, // grass
          { type: "71", "4WD": [ 60, 55, 50, 40, 25], "RWD": [ 55, 50, 43, 35, 25], "FWD": [ 53, 48, 42, 34, 24] }, // grassWet
          { type: "60", "4WD": [ 60, 55, 50, 40, 25], "RWD": [ 55, 50, 43, 35, 25], "FWD": [ 53, 48, 42, 34, 24] }, // snow
          { type: "30", "4WD": [ 35, 30, 25, 20, 15], "RWD": [ 28, 25, 22, 19, 15], "FWD": [ 27, 24, 21, 18, 14] }, // ice
        ],
        valuesRelative: [
          { "type": "00", "4WD": [100,100,100,100,100], "RWD": [100,100,100,100,100], "FWD": [100,100,100,100,100] },
          { "type": "01", "4WD": [82,97,100,92,66], "RWD": [83,96,100,93,65], "FWD": [83,96,100,92,64] },
          { "type": "10", "4WD": [100,94,88,81,75], "RWD": [100,96,89,82,75], "FWD": [100,96,89,82,75] },
          { "type": "11", "4WD": [100,93,86,71,50], "RWD": [100,94,86,70,55], "FWD": [100,92,86,68,52] },
          { "type": "20", "4WD": [100,100,93,86,71], "RWD": [100,100,92,85,77], "FWD": [100,100,92,84,77] },
          { "type": "50", "4WD": [100,93,86,79,64], "RWD": [100,88,81,74,62], "FWD": [100,88,80,73,61] },
          { "type": "70", "4WD": [100,92,85,77,62], "RWD": [100,92,83,75,62], "FWD": [100,91,83,74,60] },
          { "type": "71", "4WD": [100,92,83,67,42], "RWD": [100,91,78,64,45], "FWD": [100,91,79,64,45] },
          { "type": "60", "4WD": [100,92,83,67,42], "RWD": [100,91,78,64,45], "FWD": [100,91,79,64,45] },
          { "type": "30", "4WD": [100,86,71,57,43], "RWD": [100,89,79,68,54], "FWD": [100,89,78,67,52] }
        ]
      },
      surfaces: {},
      zoomLevel: "100%",
      zoomLevels: ["60%", "80%", "100%", "120%", "140%"],
      tyreAnimation: false,
      mra1: "",
      mra2: "",
      chartTrack: {"id":"drag100","surface":"0","cond":"0","code":"drag100_a00","campaign":"IT Milan 10"},
      fakeCar1: {
        rid: "fake1",
        selectedTune: "Other"
      },
      mraResult: null,
      user: null,
      voteLoading: false,
      fakeTime1: undefined,
      fakeCustomData1: {},
      dictionarySelected: null,
      dictionary: [
        {
          term: "MRA",
          name: "Mid-Range Acceleration",
          short: "Factor of 60-100mph",
          desc: "How good a car is at 60-100mph compared to its 0-60mph time. The higher the better. A car with 100 MRA means that its 60-100 time is the same as its 0-60. Also, 50 MRA means that 60-100 time is the double of its 0-60 time."
        },
        {
          term: "HRA",
          name: "High-Range Acceleration",
          short: "Factor of 100-150mph",
          desc: "The same as MRA, but 100-150mph time"
        },
        {
          term: "OLA",
          name: "Off the Line Acceleration",
          short: "Factor of 0-30mph",
          desc: "How good a car is at 0-30mph. Very useful on low speed tracks with a lot of turns: Slalom Test, Indoor Karting, Karting Circuit..."
        },
        {
          term: "ETB",
          name: "Engine Traction Bonus",
          short: "Boost from engine upgrades",
          desc: "Engine upgrades gives the car traction bonus, less wheel-spin. More notieced on off-road and wet tracks. Almost no effect on dry asphalt tracks. Thats why 323 usually is the best tune for off-road cars."
        },
        {
          term: "323",
          name: "Tune of a car",
          short: "3 engine, 2 weight, 3 chassis",
          desc: "Means the number stage upgrades for each category: engine 3.3, weight 2.3, chassis 3.3. Also known as 969. Fully upgraded engine and chassis. A stock car is 000, upgrades without any fuse is 111. 333 isn't possible"
        },
        {
          term: "GC",
          name: "Ground Clearance",
        },
        {
          term: "CS",
          name: "City Streets",
          short: "It refers to tracks that have low GC penalty",
          desc: "Other possible acronyms: CSS (City Streets Small), CSM (City Streets Medium), OCS (Ocean City Streets)"
        },
        {
          term: "T1",
          name: "Tier 1"
        },
        {
          term: "Leggy",
          name: "Legendary car"
        },
        {
          term: "UR",
          name: "Ultra Rare car"
        },
        {
          term: "SR",
          name: "Super Rare car"
        },
        {
          term: "UC",
          name: "Uncommon car"
        },
        {
          term: "YB",
          name: "Yellowbird Championship"
        },
        {
          term: "SN",
          name: "Skyline Nismo Championship"
        },
        {
          term: "TDR",
          name: "Top Drives Records",
          short: "www.topdrivesrecords.com"
        },
        {
          term: "TDC",
          name: "Top Drives Club",
          short: "www.topdrives.club"
        },
        {
          term: "TDO",
          name: "Top Drives official discord"
        },
        {
          term: "Hutch",
          name: "Developer of the game"
        },
        {
          term: "TB",
          name: "Test Bowl"
        },
        {
          term: "WE",
          name: "World Expo tag"
        },
        {
          term: "ENW",
          name: "European New Wave tag"
        },
        {
          term: "APGP",
          name: "Asia-Pacific Grand Prix tag"
        },
        {
          term: "JPT",
          name: "Japan Pro Tour tag"
        },
        {
          term: "OG",
          name: "Original cars"
        },
        {
          term: "DNF",
          name: "Did Not Finish"
        },
        {
          term: "AOD",
          name: "American Overdrive"
        },
        {
          term: "EGT",
          name: "European Grand Tour"
        },
      ],
      tracksPenalty: [
        {
          name: "Low GC Penalty",
          tracks: [ "csSmall", "csMed", "dockCity", "oceanCity", "speedbump12km", "speedbump1km", "desertHill" ]
        },
        {
          name: "Low/Mid GC Penalty",
          tracks: [ "moto", "desertRallyDirt" ]
        },
        {
          name: "Hill Climb Bonus",
          tracks: [ "hClimb", "mtHill", "tRoad" ]
        },
      ],
      classesColors: ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFAF17"],
      classesColorsRgb: [
        "135, 135, 135",
        "118, 242, 115",
        "28, 204, 255",
        "255, 246, 43",
        "255, 53, 56",
        "140, 92, 255",
        "255, 199, 23"
      ],
      carCosts: {
        classes: ["F","E","D","C","B","A","S"],
        upgrade1: [200,400,700,1100,1600,2200,2900],
        upgrade2: [250,475,800,1225,1750,2375,3100],
        upgrade3: [300,550,900,1350,1900,2550,3300],
        upgrade4: [300,550,900,1350,1900,2550,3300],
        upgrade5: [375,650,1025,1500,2075,2750,3525],
        upgrade6: [450,750,1150,1650,2250,2950,3750],
        upgrade7: [450,750,1150,1650,2250,2975,3750],
        upgrade8: [550,875,1300,1825,2450,3200,4050],
        upgrade9: [750,1125,1600,2175,2850,3650,4550],
        divider1: "Fuse",
        fuse1: [400,700,1100,1600,2200,2900,3700],
        fuse1Time: ["5m","15m","30m","1h","2h","4h","8h"],
        fuse1SkipGold: [10,25,45,85,160,300,550],
        fuse2: [600,950,1400,1950,2600,3350,4200],
        fuse2Time: ["15m","30m","1h","2h","4h","8h","16h"],
        fuse2SkipGold: [25,45,85,160,300,550,1000],
        divider2: "Service",
        serviceTime: ["1m","2m30s","4m","5m45s","7m30s","9m30s","12m30s"],
        serviceTime10: ["10m","25m","40m","57m30s","1h15m","1h35m","2h5m"],
        serviceSkipGold: [5,10,15,20,24,28,30],
        divider3: "Total to Max",
        "Upgrades": [11525,19625,30625,44525,61325,81175,103825],
        "Fuse Time": ["45m","1h45m","3h30m","7h","14h","28h","56h"],
        "Fuse Skip": [80,165,305,575,1080,2000,3650],
        divider4: "Sell Price",
        "Stock": [125,250,1000,2500,12500,65000,275000],
        "Maxed": [8769,14969,23969,35894,58494,125882,352944],
        classesEnd: ["F","E","D","C","B","A","S"],
      },
      clubMultiplier: false,

      clubEvent: {
        headers: ["Icon", "Cash", "Club XP", "Requirement", "Simulate"],
        win1: ["Team Lose", "", 100, 1, "Lose event"],
        win2: ["Team Win", "", 600, 5, "Win event"],
        divider1: "Participation",
        participation1: ["Bronze", "BadgeParticipaation01", 100, 1, "1 race"],
        participation2: ["Silver", "BadgeParticipaation02", 500, 3, "5 races"],
        participation3: ["Gold", "BadgeParticipaation03", 1000, 4, "15 races"],
        participation4: ["Platinum", "BadgeParticipaation04", 2000, 5, "30 races"],
        divider2: "Performance",
        perf1: ["Bronze", "BadgePerformance01", 100, 1, "Top 100%"],
        perf2: ["Silver", "BadgePerformance02", 500, 3, "Top 50%"],
        perf3: ["Gold", "BadgePerformance03", 1000, 4, "Top 25%"],
        perf4: ["Platinum", "BadgePerformance04", 2000, 5, "Top 10%"],
        perf5: ["MVP", "BadgePerformance05", 3000, 6, "Top 1%"],
        divider3: "Team Rank Bonus",
        ranking1: ["Recruit", "BadgeRank01", 100, 0, "0 XP"],
        ranking2: ["Rookie", "BadgeRank02", 200, 1, "100 XP"],
        ranking3: ["Challenger", "BadgeRank03", 300, 2, "500 XP"],
        ranking4: ["Veteran", "BadgeRank04", 400, 3, "2000 XP"],
        ranking5: ["Master", "BadgeRank05", 500, 4, "5000 XP"],
        ranking6: ["Elite", "BadgeRank06", 600, 5, "10000 XP"],
        ranking7: ["Legendary", "BadgeRank07", 700, 6, "25000 XP"],
        divider4: "Total",
        total: ""
      },
      imgsObj: {},
      clubEventCheckObj: {
        win: "win2",
        participation: "participation4",
        perf: "perf5",
        ranking: "ranking7"
      },
      clubSeason: {
        headers: ["Icon", "Cash", "Gold", "Simulate"],
        win1: ["Team 3rd", "🥉", 700, 60],
        win2: ["Team 2nd", "🥈", 1400, 85],
        win3: ["Team 1st", "🥇", 2100, 110],
        divider1: "Participation",
        participation1: ["1 event", "", 280, 3],
        participation2: ["3 events", "", 600, 6],
        participation3: ["5 events", "", 1400, 15],
        participation4: ["10 events", "", 2100, 30],
        divider2: "Best Performance in any event",
        perf1: ["Bronze", "BadgePerformance01", 280, 3],
        perf2: ["Silver", "BadgePerformance02", 600, 6],
        perf3: ["Gold", "BadgePerformance03", 850, 9],
        perf4: ["Platinum", "BadgePerformance04", 1400, 15],
        perf5: ["MVP", "BadgePerformance05", 2100, 30],
        divider3: "Team Rank Bonus",
        ranking1: ["Recruit", "BadgeRank01", 150, 2],
        ranking2: ["Rookie", "BadgeRank02", 300, 6],
        ranking3: ["Challenger", "BadgeRank03", 400, 8],
        ranking4: ["Veteran", "BadgeRank04", 550, 10],
        ranking5: ["Master", "BadgeRank05", 700, 12],
        ranking6: ["Elite", "BadgeRank06", 850, 15],
        ranking7: ["Legendary", "BadgeRank07", 1000, 18],
        divider4: "Total",
        total: ""
      },
      clubSeasonCheckObj: {
        win: "win3",
        participation: "participation4",
        perf: "perf5",
        ranking: "ranking7"
      },
    }
  },
  watch: {},
  beforeMount() {
    document.title = `Cheatsheet - TDR`

    let zoomLevel = window.localStorage.getItem("zoomLevel");
    if (zoomLevel) {
      this.zoomLevel = zoomLevel;
      this.changeZoom(zoomLevel);
    }
    this.dictionary.sort((a, b) => {
      return a.term.localeCompare(b.term);
    })

    Object.keys(this.clubEvent).map(key => {
      if (!Array.isArray(this.clubEvent[key])) return;

      // Vue.set(this.clubEventCheckObj, key.replace(/[\d]/g, ''), false);
      // this.clubEventCheckObj.win = "win1";
      // this.clubEventCheckObj.participation = "participation1";
      // this.clubEventCheckObj.perf = "perf1";
      // this.clubEventCheckObj.ranking = "ranking1";

      this.clubEvent[key].map(x => {
        if (typeof x === 'string' && x.includes("Badge")) {
          this.imgsObj[x] = require('@/assets/clubs/' + x + '.png')
        }
      })
    })

    // let valuesRelative = [];
    // this.tyres.values.map(line => {
    //   let nLine = JSON.parse(JSON.stringify(line));
    //   Object.keys(nLine).map(key => {
    //     if (key === "type") return;
    //     let best = Math.max(...nLine[key]);
    //     nLine[key] = nLine[key].map(friction => {
    //       return Math.round((friction / best) * 100)
    //     })
    //   })
    //   valuesRelative.push(nLine);
    // })
    // console.log(valuesRelative);
  },
  mounted() {
    this.user = { "username": "fake", "mod": true };
  },
  beforeDestroy() {
    document.title = `Top Drives Records`
  },
  computed: {},
  methods: {
    changeZoom(level = "100%") {
      let string;
      if (level === "60%") {
        string = "width=device-width,height=device-height, initial-scale=0.45, maximum-scale=0.45, minimum-scale=0.45"
      }
      if (level === "80%") {
        string = "width=device-width,height=device-height, initial-scale=0.55, maximum-scale=0.55, minimum-scale=0.55"
      }
      if (level === "100%") {
        string = "width=device-width,height=device-height, initial-scale=0.65, maximum-scale=0.65, minimum-scale=0.65"
      }
      if (level === "120%") {
        string = "width=device-width,height=device-height, initial-scale=0.75, maximum-scale=0.75, minimum-scale=0.75"
      }
      if (level === "140%") {
        string = "width=device-width,height=device-height, initial-scale=0.85, maximum-scale=0.85, minimum-scale=0.85"
      }

      const viewport = document.querySelector('meta[name="viewport"]');
      if ( viewport ) {
        viewport.content = string;
      }
      window.localStorage.setItem('zoomLevel', level);
      
    },
    tyreDriveChanged() {
      // debugger;
      let currentKey = this.tyres.relativeToBest ? 'valuesRelative' : 'values';
      if (this.tyres.drivesModel === this.tyres.oldDrivesModel && currentKey === this.tyres.oldValueKey) return;
      let shouldAnimate = currentKey === this.tyres.oldValueKey;

      this.tyres[currentKey].map((line, xline) => {
        let diffs = [];
        line[this.tyres.drivesModel].map((frict, xfrict) => {
          diffs.push(frict - this.tyres[this.tyres.oldValueKey][xline][this.tyres.oldDrivesModel][xfrict])
        })
        Vue.set(line, "diffs", diffs);
      })

      this.tyres.oldDrivesModel = this.tyres.drivesModel;
      this.tyres.oldValueKey = currentKey;

      if (shouldAnimate) {
        this.tyreAnimation = false;
        if (this.tyreAnimationClear) clearTimeout(this.tyreAnimationClear);
        this.tyreAnimationClear = setTimeout(() => {
          this.tyreAnimation = true;
        }, 10);
      } else {
        this.tyreAnimation = false;
      }
    },
    calcMra() {
      if (!this.mra1 || !this.mra2) {
        this.mraResult = null;
        return;
      };
      this.mraResult = Vue.mra(this.mra2, Number(this.mra1));
    },
    dictClick(item) {
      if (!item.short) return;
      if (this.dictionarySelected && this.dictionarySelected.term === item.term) {
        this.dictionarySelected = null;
        return;
      } else {
        this.dictionarySelected = item;
      }

      setTimeout(() => {
        let div = document.querySelector(`.MainCheatSheet_DictExpanded`);
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        window.scrollTo({ top: div.offsetTop + (div.offsetHeight / 2) - (vh / 2), behavior: 'smooth' });
      }, 50);
    }
  },
}
</script>

<style>
.MainCheatSheet_Root {
}
.MainCheatSheet_Layout {
  margin-top: 40px;
  padding-bottom: 60px;
}
.MainCheatSheet_Box {
  max-width: 1150px;
  margin: 0 auto;
}
.MainCheatSheet_TyresGrid {
  /* padding: 20px; */
  display: grid;
  grid-template-columns: 0.8fr 1fr 1fr 1fr 1fr 1fr;
}
.MainCheatSheet_Cell {
  text-align: center;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: var(--cell-height);
  box-sizing: border-box;
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 0px -2px 0px 0px #ffffff00, -2px 0px 0px 0px #ffffff00;
  padding: 3px;
}
.MainCheatSheet_CellTop {
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 0px -2px 0px 0px #ffffff00, -2px 0px 0px 0px #ffffff00, inset 0px 2px 0px 0px #ffffff07;
}
.MainCheatSheet_CellBold {
  background-color: rgb(0, 0, 0, 0.13);
}
.MainCheatSheet_CellSurface {
  padding: 0px 8px 0px 4px;
  box-shadow: inset -2px -2px 0px 0px #ffffff10, inset 0px -2px 0px 0px #ffffff00, -2px 0px 0px 0px #ffffff00;
}
.MainCheatSheet_TyresTopName {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 7;
  background-image: radial-gradient(#000000ba 0%, transparent 69%);
  background-position: 50% 6px;
  background-size: 80% 53px;
}
.MainCheatSheet_TyresFrictionItem {
  justify-content: center;
  position: relative;
  /* background-color: rgba(150, 255, 0, calc(var(--opac) * 0.3 + -15%)); */
  /* color: rgba(150, 255, 0, calc(var(--opac) * 0.3 + -15%)); */
  /* --color-index */
  --last-index: 100;
  /* color: var(--d-text-b); */
  --h: calc( (((var(--color-index) * (100/var(--last-index))) / 75) + 90) * 100 );
  --s: calc( (((var(--color-index) * (100/var(--last-index))) / -470) + 1) * 100% );
  color: hsl(var(--h), var(--s), 86%, 0.8);
  background-color: hsl(var(--h), var(--s), 35%, 0.25);
}
.MainCheatSheet_TyresRelative .MainCheatSheet_TyresFrictionItem {
  --h: calc( (((var(--color-index) * (100/var(--last-index))) / 224) + 80) * 400 );
}
.MainCheatSheet_TyresTopItem {
  height: 150px;
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  /* overflow: hidden; */
  justify-content: flex-end;
}
.MainCheatSheet_TyreSvg {
  position: absolute;
  height: 150px;
  width: 150%;
  /* right: 1px; */
  right: 31px;
  top: 0;
  overflow: hidden;
}
.MainCheatSheet_TyresLabel {
  z-index: 6;
  color: rgb(var(--d-text-yellow));
}
.MainCheatSheet_TyresTopLeftBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  z-index: 7;
}
.MainCheatSheet_TyresTopLeft {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  z-index: 7;
  flex-wrap: wrap;
}
.MainCheatSheet_TyresDiffs {
  position: absolute;
  transform: translateX(calc(0% + 1em));
  color: #71d771;
  opacity: 0;
  left: 50%;
  width: 2em;
  text-align: right;
}
.MainCheatSheet_TyresDiffsNegative {
  color: #ff6666;
}
.MainCheatSheet_TyresDiffsAnimate {
  animation: fadeOut 2s linear forwards;
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.MainCheatSheet_MRA_Calculator {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.MainCheatSheet_Title {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 15px;
}
.MainCheatSheet_SpaceTop {
  margin-top: 40px;
}
.MainCheatSheet_MRA_Row .Row_Cell {
  background-color: rgba(0,0,0,0.2);
  --cell-height: 41px;
  margin-top: 2px;
  box-shadow: unset;
}
.MainCheatSheet_MRA_Row {
  color: var(--d-text-b);
}
.MainCheatSheet_MRA_Row .Row_Content {
  padding: 9px;
}
.MainCheatSheet_MRA_Calculator .BaseText_Input {
  /* color: var(--d-text); */
  text-align: center;
}
.MainCheatSheet_MRA_RowBox {

}
.MainCheatSheet_MRA_Result {
  display: flex;
  justify-content: center;
}
.MainCheatSheet_MRA_ResultValue {
  /* background-color: rgba(0,0,0,0.2); */
  margin-top: 5px;
  padding: 5px;
}
.MainCheatSheet_Dict {
  gap: 15px;
  columns: 200px auto;
}
.MainCheatSheet_DictItem {
  display: flex;
  /* flex-direction: column; */
  padding: 6px;
  justify-content: flex-start;
  gap: 4px;
  text-align: left;
  --height: 28px;
  color: var(--d-text);
}
.MainCheatSheet_D_Title {
  color: rgb(var(--d-text-green));
  font-size: 1.2em;
}
.MainCheatSheet_DictExpanded {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;
}
.MainCheatSheet_Penalty {
  gap: 20px 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.MainCheatSheet_PenaltyTitle {
  color: rgb(var(--d-text-green));
}
.MainCheatSheet_PenaltyTrack {
  font-size: 0.8em;
}
.MainCheatSheet_ClassesGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.MainCheatSheet_ClassesIcon {
  width: 21px;
  height: 22px;
  margin-right: 3px;
}
.MainCheatSheet_CellInner {
  display: flex;
}
.MainCheatSheet_ClassesClass {
  text-align: center;
}
.MainCheatSheet_UpgradeArrow {
  font-size: 0.8em;
  margin: 0 3px;
  opacity: 0.5;
}
.MainCheatSheet_UpgradeLabel {
  
}
.MainCheatSheet_ClassesCell,
.MainCheatSheet_ClassesLabelCell {
  box-shadow: inset -2px -2px 0px 0px #ffffff07;
  padding: 3px 0px;
  text-align: center;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: var(--cell-height);
  justify-content: center;
}
.MainCheatSheet_ClassesLabelCell:not(.MainCheatSheet_EmptySpace ) {
  /* padding: 3px 8px 3px 4px; */
  background-color: #ffffff09;
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 2px 0px 0px 0px #ffffff07;
}
.MainCheatSheet_EmptySpaceEnd {
  box-shadow: unset;
}
.MainCheatSheet_EmptySpaceSemiEnd {
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 2px 0px 0px 0px #ffffff07;
}
.MainCheatSheet_ClassesClass {
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
.MainCheatSheet_ClassesHeader {
  background-color: rgba(var(--classC), 0.1);
  padding: 8px 3px;
}
.MainCheatSheet_CellHighlight {
  /* background-color: rgba(255,255,255, 0.04); */
  background-color: rgba(0,0,0, 0.16);
}
.MainCheatSheet_RowDivider {
  
  /* box-shadow: inset 0px 0px 0px 2px #ffe39417; */
  padding: 3px 0px;
  text-align: center;
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
  grid-column: 1 / -1;
  height: auto;
  color: rgb(var(--d-text-yellow));
  background-color: #a9904129;
  font-size: 0.9em;
}
.MainCheatSheet_TipBox {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.MainCheatSheet_Tip {
  font-size: 14px;
  background-color: #a9904129;
  box-shadow: inset 0 0 0 2px #ffe39417;
  padding: 8px 10px;
  border-radius: 10px;
  color: #cdc2a3;
  text-align: center;
}
.MainCheatSheet_ClubRewardsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 75px;
}
.MainCheatSheet_ClubRewardsHeader:not(.MainCheatSheet_EmptySpace) {
  background-color: #ffffff09;
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 0px 2px 0px 0px #ffffff07;
}
.MainCheatSheet_ClubBadge {
  /* height: calc(var(--cell-height) + 4px); */
}
.MainCheatSheet_ClubsCellImg {
  overflow: hidden;
}
.MainCheatSheet_ClubRewardsSeasonGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 75px;
}





@media only screen and (max-width: 1200px) {
  .MainCheatSheet_TyresGrid {
    grid-template-columns: 1.3fr 1fr 1fr 1fr 1fr 1fr;
  }
  .MainCheatSheet_Box {
    max-width: 575px;
  }
  .MainCheatSheet_TyreSvg {
    height: 110px;
    top: 40px;
    right: 16px;
  }
  .MainCheatSheet_TyresTopName {
    background-image: radial-gradient(#000000ba 0%, transparent 69%);
    background-size: 100% 53px;
  }
  .MainCheatSheet_TyresLabelComplete {
    display: none;
  }
  .MainCheatSheet_ClassesGrid,
  .MainCheatSheet_ClubRewardsGrid {
    font-size: 16px;
  }
  .MainCheatSheet_ClassesIcon {
    width: 18px;
    margin-right: 1px;
  }
  .MainCheatSheet_Classes_LongNumber .MainCheatSheet_ClassesIcon {
    /* display: none; */
  }
}
@media only screen and (min-width: 1201px) {
  .MainCheatSheet_TyresLabelShort {
    display: none;
  }
}
</style>