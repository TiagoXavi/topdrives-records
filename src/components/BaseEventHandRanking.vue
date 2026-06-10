<template>
  <div class="BaseEventHandRanking_Layout">
    <div class="Main_TeamsNeck D_Center2">
      <!-- controls -->
      <div class="Main_TeamsControlsLayout BaseSwitch_NoWrapParent">
        <BaseSwitch v-model="eventBestTeamsConfig.myGarage" name="eventMyGarage" :label="`${$t('m_myGarage')}`" :horizontal="false" />
        <BaseSwitch v-model="eventBestTeamsConfig.forceCarsBool" name="hand_ForceCars" :label="$t('m_forceCars')" :horizontal="false" />
        <BaseSwitch v-model="eventBestTeamsConfig.forceOppoBool" name="hand_ForceOppo" :label="$t('m_forceOppo')" :horizontal="false" />
        <BaseSwitch v-model="eventBestTeamsConfig.blackListBool" name="hand_black" :label="$t('m_blackList')" :horizontal="false" />
        <BaseSwitch
          :value="eventBestTeamsConfig.repeatCars || eventBestTeamsConfig.myGarage"
          :label="$t('m_duplicates')"
          :horizontal="false"
          :disabled="eventBestTeamsConfig.myGarage"
          name="hand_repeat"
          @change="eventBestTeamsConfig.repeatCars = $event"
        />
        <BaseSwitch v-model="eventBestTeamsConfig.uniqueHands" name="hand_farming" :label="$t('m_farmingHands')" :horizontal="false" />
        <BaseSwitch v-model="eventBestTeamsConfig.prizeCars" name="hand_prizes" :label="$t('m_prizeCars')" :horizontal="false" />
        <!-- <BaseSwitch
          :value="eventBestTeamsConfig.prizeCars && eventBestTeamsConfig.neverAwardedCars"
          :label="$t('m_neverAwardedCars')"
          :horizontal="false"
          :disabled="!eventBestTeamsConfig.prizeCars || true"
          name="hand_neverAwarded"
          @change="eventBestTeamsConfig.neverAwardedCars = $event"
        /> -->
        <BaseSwitch
          :value="eventBestTeamsConfig.garageUpgrade && eventBestTeamsConfig.myGarage"
          :label="$t('m_upgradeCars')"
          :horizontal="false"
          :disabled="!eventBestTeamsConfig.myGarage"
          name="hand_garageUpgrade"
          @change="eventBestTeamsConfig.garageUpgrade = $event"
        />
        <BaseSwitch
          :value="eventBestTeamsConfig.balanced && !eventBestTeamsConfig.forceOppoBool"
          :label="$t('m_balanced')"
          :horizontal="false"
          :disabled="eventBestTeamsConfig.forceOppoBool"
          name="hand_balanced"
          @change="eventBestTeamsConfig.balanced = $event"
        />
        <BaseSwitch
          :value="eventBestTeamsConfig.predictedTimes || eventBestTeamsConfig.myGarage"
          :label="$t('m_predictedTimes')"
          :horizontal="false"
          :disabled="eventBestTeamsConfig.myGarage"
          name="hand_predicted"
          @change="eventBestTeamsConfig.predictedTimes = $event"
        />
      </div>

      <BaseExpandDiv :active="eventBestTeamsConfig.blackListBool" class="Main_TeamsForceCarsExpand">

        <BaseCarList
          :list="eventBestTeamsConfig.blackList"
          :filterToImport="eventBestTeamsTarget.filter"
          class="Main_TeamsCarsList"
          size="small"
        />

      </BaseExpandDiv>

      <BaseExpandDiv :active="eventBestTeamsConfig.forceCarsBool" class="Main_TeamsForceCarsExpand">
        <!-- Force cars -->
        <div class="Main_TeamsCanEnterEventMid">
          <BaseCarsTeam
            :cars="eventBestTeamsConfig.forceCars"
            :filterToImport="eventBestTeamsTarget.filter"
            :width="228"
            :aspect="'415 / 256'"
            :fsize="12"
            :miniWidth="113"
            :miniAspect="'111 / 144'"
            :miniFsize="12"
            :mini="windowWidth < 1200"
            :gap="2"
            :rqLimit="eventBestTeamsTarget.rqLimit"
            prefix="Your"
          />
        </div>
      </BaseExpandDiv>

      <BaseExpandDiv :active="eventBestTeamsConfig.forceOppoBool" class="Main_TeamsForceCarsExpand">
        <!-- Force opponents -->
        <div class="Main_TeamsCanEnterEventMid">
          <BaseCarsTeam
            :cars="eventBestTeamsConfig.forceOppoCars"
            :filterToImport="eventBestTeamsTarget.filter"
            :width="228"
            :aspect="'415 / 256'"
            :fsize="12"
            :miniWidth="113"
            :miniAspect="'111 / 144'"
            :miniFsize="12"
            :mini="windowWidth < 1200"
            :gap="2"
            :rqLimit="eventBestTeamsTarget.rqLimit"
            prefix="Oppo"
          />
        </div>
      </BaseExpandDiv>

      <BaseExpandDiv :active="eventBestTeamsConfig.garageUpgrade" class="Main_TeamsForceCarsExpand">
        <div class="Main_TeamsRQSliderBox">
          <BaseDualSlider
            v-model="eventBestTeamsConfig.garageUpgradeRange"
            :min="10"
            :max="120"
            :label="`RQ ${$t('m_upgradeCars')}`"
            class="Main_TeamsRQSlider"
          />
        </div>
      </BaseExpandDiv>

      <div v-if="eventBestTeamsTarget.clubReqsGroupModel" class="Main_TeamsRQSliderBox">
        <BaseMonoSlider
          v-model="eventBestTeamsTarget.rqLimit"
          :min="60"
          :max="500"
          :step="5"
          :label="$t('m_rqLimit')"
          class="Main_TeamsRQSlider"
        />
      </div>

      <div class="Main_TeamsFooter D_Center2">
        <div v-if="!whatTier || whatTier > 2" class="Main_SaveGalleryGuide">
          <span>{{ $t("p_patronsOnly", { tier: 2 }) }}<br>{{ $t("p_bestHandDescription") }} <a class='D_Link D_LinkUnder' target='_blank' href='https://youtu.be/PU6QnGUSGJA'>Youtube</a></span>
        </div>
        <button
          :class="{ D_Button_Loading: eventBestTeamsLoading }"
          :disabled="!whatTier || whatTier > 2 || eventBestTeamSameAsBefore"
          class="D_Button D_ButtonDark D_ButtonTier2"
          @click="getHandRanking($event)">
          <template v-if="eventBestLastLoadingMsg">
            <span>{{ eventBestLastLoadingMsg }}</span>
          </template>
          <template v-else>
            <i class="ticon-crown D_ButtonIcon D_ButtonIcon24" aria-hidden="true"/>
            <span>{{ $t("m_loadRanking") }}</span>
            <i class="ticon-arrow_down_3" style="margin-left: 5px;" aria-hidden="true"/>
          </template>
        </button>
      </div>
    </div>
    <div v-if="eventBestTeamsBigArray.length" class="Main_Teams_Body">
      <RecycleScroller
        :items="eventBestTeamsBigArray"
        :item-size="175"
        :buffer="800"
        key-field="3"
        key="Main2"
        listClass="Main_Teams_CardsWrapper"
        itemClass="Main_Teams_ScrollerItem"
        class="Main_DarkScroll"
        page-mode>
        <template v-slot="{ item, index, active }">
          <div class="Main_Teams_Index">
            <div class="Main_Teams_IndexValue">#{{ index+1 }}</div>
            <div class="Main_Teams_IndexRQ">RQ{{ item[1] }}</div>
            <div v-if="item[11]" class="Main_Teams_IndexPts">
              <i v-if="item[11][0]" class="ticon-correct_1" style="color: rgb(var(--d-text-green));" aria-hidden="true"/>
              <i v-else class="ticon-close_3" style="color: rgb(var(--d-text-red2));" aria-hidden="true"/>
              {{ Math.round(item[11][1]) }} / {{ Math.round(item[11][2]) }} / {{ Math.round(item[11][3]) }} / {{ Math.round(item[11][4]) }}
            </div>
            <div v-else class="Main_Teams_IndexPts">{{ Number(item[2]).toFixed(0) }} / {{ Number(item[7]).toFixed(0) }}</div>
            <div class="Main_Teams_ExportBox">
              <button
                class="Main_Teams_ExportMatch D_Button D_ButtonDark"
                @click="handRankingExportClick(index)">
                <span>{{ $t("m_exportToMatch") }}</span>
                <i class="ticon-internal" style="margin-left: 4px;" aria-hidden="true"/>
              </button>
            </div>
          </div>
          <div class="Main_Teams_ListLayout">
            <BaseCarsTeam
              :cars="item[6].map((c, ic) => ({ rid: c, selectedTune: item[5][ic] }))"
              :filterToImport="{}"
              :width="228"
              :aspect="'415 / 256'"
              :fsize="12"
              :miniWidth="113"
              :miniAspect="'111 / 144'"
              :miniFsize="12"
              :mini="windowWidth < 1200"
              :canAdd="false"
              :canDelete="false"
              :canDrag="false"
              :gap="2"
              :showTune="true"
              :loading="Vue.utils.cacheLoading"
              style="--gap: 2px;"
              prefix="Main_Teams_ListItem"
            />
            <!-- <div v-for="(rid, index) in item[6]" class="Main_Teams_VerticalCardBox BaseCard_AsGalleryBox Main_Teams_GalleryBox">
              <BaseCard
                :car="Vue.all_carsObj[rid]"
                :fix-back="false"
                :tuneText="item[5][index]"
                :options="false"
                :hideClose="true"
                :showResetTune="false"
                :showCompactOverlay="false"
                :asGallery="true"
              />
            </div> -->
          </div>
        </template>
      </RecycleScroller>
    </div>
    <div v-else-if="eventBestTeamsLastCache" class="Main_Teams_NoResponse">
      <div class="Cg_Offline">
        <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
      </div>
    </div>
    <div class="Main_TeamsEngineLabel">Engine v1.16</div>
  </div>
</template>

<script>
import BaseMonoSlider from './BaseMonoSlider.vue';
import BaseDualSlider from './BaseDualSlider.vue';
import BaseExpandDiv from './BaseExpandDiv.vue';
import BaseCarsTeam from './BaseCarsTeam.vue';
import BaseCarList from './BaseCarList.vue';
import BaseSwitch from './BaseSwitch.vue';

export default {
  name: 'BaseEventHandRanking',
  components: {
    BaseMonoSlider,
    BaseExpandDiv,
    BaseCarsTeam,
    BaseCarList,
    BaseSwitch,
    BaseDualSlider
  },
  props: {
    eventBestTeamsConfig: {},
    eventBestTeamsTarget: {},
    eventBestTeamSameAsBefore: {},
    windowWidth: {},
    whatTier: {},
    eventBestTeamsBigArray: {},
    eventBestLastLoadingMsg: {},
    eventBestTeamsLoading: {},
    eventBestTeamsLastCache: {},
    getHandRanking: {},
    handRankingExportClick: {},
  },
  data() {
    return {
      Vue: Vue,
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
</style>