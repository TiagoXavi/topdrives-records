<template>
  <div class="MainTimeline_Root">
    <div
      v-if="screen === 'normal'"
      :class="{ MainTimeline_InitAnimation: animation }"
      class="MainTimeline_Layout">
      <!-- <template v-if="loading && timeline.length === 0"> -->
      <template v-if="loading">
        <div class="MainTimeline_Loading MainTimeline_Body MainTimeline_W800">
          <div class="MainTimeline_LoadingBackLine MainTimeline_BackLine">
            <div class="MainTimeline_BackLineHead"></div>
            <div class="MainTimeline_BackLineHead"></div>
            <div class="MainTimeline_BackLineBody"></div>
          </div>
          <div
            v-for="(n, ix) in 5"
            :class="{
              MainTimeline_ItemEven: ix % 2 === 0,
              MainTimeline_ItemOdd: ix % 2 === 1
            }"
            class="MainTimeline_LoadingItemRoot MainTimeline_ItemRoot">
            <div class="MainTimeline_LoadingItem MainTimeline_Item MainTimeline_ItemTop">
              <div class="MainTimeline_LoadingLeft MainTimeline_ItemTopLeft"></div>
              <div class="MainTimeline_LoadingCover MainTimeline_ItemCover"></div>
              <div :style="`width: ${Math.random() * 150 + 100}px`" class="MainTimeline_LoadingRight MainTimeline_ItemTopRight"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="MainTimeline_Header MainTimeline_W800">
          <button
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="openCreateEvent()">
            <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
            <span>{{ $t("m_new") }}</span>
          </button>
        </div>
        <div class="MainTimeline_Body MainTimeline_W800">
          <div class="MainTimeline_BackLine">
            <div class="MainTimeline_BackLineHead"></div>
            <div class="MainTimeline_BackLineHead"></div>
            <div class="MainTimeline_BackLineBody"></div>
          </div>
          <div
            v-for="(item, ix) in timeline"
            :class="`
              ${ix % 2 === 0 ? 'MainTimeline_ItemEven ' : '' }
              ${ix % 2 === 1 ? 'MainTimeline_ItemOdd ' : '' }
              MainTimeline_Class${ (item.p_rid || []).length === 1 ? resolvedRids[item.p_rid[0]].class : '' } 
            `"
            :style="`
              --class-color: ${(item.p_rid || []).length === 1 ? resolvedRids[item.p_rid[0]].color : ''} ;
              --class-color-rgb: ${(item.p_rid || []).length === 1 ? resolvedRids[item.p_rid[0]].colorRgb : ''} ;
            `"
            class="MainTimeline_ItemRoot">
            <div class="MainTimeline_ItemBacklight"></div>
            <button class="MainTimeline_Item D_Button" @click="expandItem(item, ix)">
              
              <div class="MainTimeline_ItemTop">
                <div class="MainTimeline_ItemTopLeft">
                  <div class="MainTimeline_ItemTopLeft_Day">{{ item.dayStart.slice(-2) }}</div>
                  <div class="MainTimeline_ItemTopLeft_Month">{{ new Date(`${item.dayStart}T00:00:00`).toLocaleString(undefined,{month:'short'}) }}</div>
                </div>
                <div class="MainTimeline_ItemCover">
                  <div
                    v-if="(item.p_rid || []).length === 1"
                    class="MainTimeline_Card_Header2Left">
                    <img :src="resolvedRids[item.p_rid[0]].photo" class="MainTimeline_Card_Header2Img" alt="">
                    <div class="MainTimeline_Card_Header2Right2">{{ resolvedRids[item.p_rid[0]].rq }}</div>
                  </div>
                  <!-- <div v-if="(item.p_rid || []).length === 1" class="Main_2" style="display: contents;">
                    <div class="Main_Body" style="display: contents;">
                    </div>
                  </div> -->
                  <div v-else class="MainTimeline_DefaultCover">
                    <i class="ticon-info-circle MainTimeline_ItemCoverIcon" aria-hidden="true"/>
                  </div>
                </div>
                <div class="MainTimeline_ItemTopRight">
                  <template v-if="(item.p_rid || []).length === 1">
                    <div class="MainTimeline_Line1Car">
                      <b class="MainTimeline_Line1RQ">RQ{{ resolvedRids[item.p_rid[0]].rq }}&nbsp;</b>
                      <span class="MainTimeline_Line1Brand">{{ resolvedRids[item.p_rid[0]].brand }}</span>
                    </div>
                    <div class="MainTimeline_Line2Car">{{ resolvedRids[item.p_rid[0]].onlyName }}</div>
                    <div class="MainTimeline_ItemTypeText">{{ item.type }}</div>
                  </template>
                  <template v-else>
                    <div class="MainTimeline_ItemTopTitle">{{ item.name }}</div>
                    <div v-if="item.type === 'Veteran Challenge'" class="MainTimeline_ItemVeteranCriteria">
                      <BaseFilterDescription
                        :filter="item.filter"
                        :asFilterLabel="true"
                        :hideIfEmpty="true"
                        :emitDescResolved="false"
                        class="MainTimeline_ItemVeteranFilterDescription"/>
                    </div>
                    <div v-if="item.type !== 'News' && item.type !== 'Veteran Challenge' && item.type !== 'Other'" class="MainTimeline_ItemTypeText">{{ item.type }}</div>
                    <div v-else-if="(item.p_rid || []).length === 0 && item.type === 'News'" class="MainTimeline_ItemTopSubTitle">{{ item.description }}</div>
                    <div v-if="(item.p_rid || []).length > 1" class="MainTimeline_ItemTopMiniCars">
                      <template v-for="(car, icar) in item.p_rid">
                        <div
                          v-if="icar <= 4"
                          :style="`--class-color: ${resolvedRids[car].color} ;`"
                          class="MainTimeline_MiniCard">
                          <img :src="resolvedRids[car].photo" class="MainTimeline_MiniCard_Header2Img" alt="">
                          <div class="MainTimeline_MiniCard_Header2Right2">{{ resolvedRids[car].rq }}</div>
                        </div>
                        <div v-if="icar === 5" class="MainTimeline_MiniCardPlus">+{{ item.p_rid.length - 5 }}</div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>

            </button>
          </div>
        </div>
      </template>
    </div>
    <div
      v-else-if="screen === 'new'"
      :class="{ MainTimeline_InitAnimation: animation }"
      class="MainTimeline_Create_Layout">
      <div class="MainTimeline_Create_Header MainTimeline_W800">
      </div>
      <div class="MainTimeline_Create_Body MainTimeline_W800">

        <button
          :disabled="newLoading"
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="typesDialog = true;">
          {{ $t("m_type") }}{{ ti.type ? `: ${ti.type}` : '' }}
        </button>

        <div v-if="ti.type" class="MainPacks_SpecificCar Space_TopPlus">

          <div class="MainPacks_CarsList" :class="{ MainPacks_CarsListEmpty: ti.p_rid.length === 0 }">

            <template v-for="rid in ti.p_rid">
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 MainPacks_CarButton"
                @click="ti.p_rid = ti.p_rid.filter(x => x !== rid)">
                <div class="MainPacks_CarCard" :style="`--color: ${resolvedRids[rid].color}`">
                  <div class="MainPacks_BankPhoto">
                    <img :src="resolvedRids[rid].photo" class="MainPacks_BankPhotoImg" alt="">
                  </div>
                  <div class="MainPacks_RQ">{{ resolvedRids[rid].rq }}</div>
                </div>
              </button>
            </template>
            <div v-if="((ti.type !== 'Tri-Series' && ti.type !== 'GT Series') || ti.p_rid.length < 1) && (ti.type !== 'Veteran Challenge' || ti.p_rid.length < 3)" class="MainPacks_AddCarBox">
              <button
                class="D_Button D_ButtonDark MainPacks_SearchCarButton"
                @click="searchFilterDialog = true;">
                <i class="ticon-plus_2 MainPacks_AddIcon" aria-hidden="true"/>
                <div v-if="ti.p_rid.length === 0" class="MainPacks_AddLabel" style="margin-left: 5px;">{{ $t("m_searchCar") }}</div>
              </button>
            </div>
          </div>
        </div>

        <BaseText
          v-model="ti.name"
          class="BaseText_Big"
          type="normal"
          :disabled="newLoading"
          :label="$t('c_name')"
          placeholder="" />


      </div>
      
      <div class="MainTimeline_Create_Footer MainTimeline_W800">
        <button
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="cancelCreateEvent()">
          <span>{{ $t("m_cancel") }}</span>
        </button>
        <button
          :class="{ D_Button_Loading: newLoading }"
          class="D_Button Main_SaveAllButton"
          @click="saveNew()">
          <span>{{ $t("m_save") }}</span>
        </button>
      </div>
    </div>

    <template v-if="newTools">

      <!-- types dialog -->
      <BaseDialog
        :active="typesDialog"
        :transparent="false"
        :isStatic="false"
        :forceScroll="true"
        max-width="350px"
        min-width="240px"
        @close="typesDialog = false;">
        <div class="MainCommunity_DialogFlagSearchLayout">
          <div class="MainCommunity_DialogTitle">
            <div class="Main_DialogTitle">{{ $tc('c_country', 1) }}</div>
          </div>
          <div class="Main_FilterChipsFlex">
            <template v-for="item in types">
              <BaseChip
                v-model="ti.type"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="item"
                @click="changeType()">
                <span>{{ item }}</span>
              </BaseChip>
            </template>
          </div>
        </div>
      </BaseDialog>

      <!-- Select car -->
      <BaseFilterDialog
        v-model="searchFilterDialog"
        :lastestList="lastestList"
        :highlightsUsers="highlightsUsers"
        :all_cars="all_cars"
        :sortEnabled="true"
        :enableCounters="true"
        :forceNonPrize="false"
        importFilterName="TIMELINE_FILTER_IMPORT"
        @addCar="addCarNew($event)"
      />

    </template>

  </div>
</template>

<script>
import all_cars from '../database/cars_final.json'
import BaseCard from './BaseCard.vue'
import BaseText from './BaseText.vue'
import BaseDialog from './BaseDialog.vue'
import BaseChip from './BaseChip.vue'
import BaseFilterDescription from './BaseFilterDescription.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'

export default {
  name: 'MainTimeline',
  components: {
    BaseCard,
    BaseText,
    BaseFilterDescription,
    BaseDialog,
    BaseChip,
    BaseFilterDialog
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      all_cars,
      loading: false,
      newLoading: false,
      timeline: [],
      resolvedRids: {},
      lastestList: [],
      highlightsUsers: {},
      screen: "normal",
      animation: false,
      newTools: false,
      searchFilterDialog: false,
      ti: {},
      newLinkNameModel: "",
      newLinkUrlModel: "",
      imageUploadDialog: false,
      imageUploadModel: null,
      imageUploadLoading: false,
      imageUploadStatus: "",
      types: [
        "Tri-Series",
        "Collection Series",
        "Veteran Challenge",
        "GT Series",
        "Extraordinary Event",
        "Extraordinary Challenge",
        "Game Update",
        "Game News",
        "Community News",
        "Other",
      ],
      typesDialog: false
    }
  },
  watch: {},
  beforeMount() {
    this.resetTi();
    this.searchTimeline();
    setTimeout(() => {
      
    }, 1000);
  },
  mounted() {},
  computed: {},
  methods: {
    resetTi() {
      this.ti = {
        name: "",
        type: "",
        sort: "",
        links: [],
        images: [],
        p_rid: [],
        events: [],
        dayStart: "",
        dayEnd: "",
        filter: {},
        description: "",
      }
    },
    getNewEvent() {
      return {
        name: "",
        filter: {},
        rids: [],
        trackset: [[], [], [], []],
        rqLimit: 500
      }
    },
    searchTimeline() {
      this.loading = true;
      let body = {};

      axios.post(Vue.preUrlCharlie + "/searchTimeline", body)
      .then(res => {
        this.loading = false;
        this.timeline = [
          ...this.timeline,
          ...this.resolveNewEntrys(res.data)
        ];
        
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })

    },
    resolveNewEntrys(items) {
      let result = [];
      items.map(item => {
        if (Array.isArray(item.p_rid)) {
          item.p_rid.map(rid => {
            if (!this.resolvedRids[rid]) {
              let newCar = this.all_cars.find(x => x.rid === rid);
              if (newCar) {
                newCar = JSON.parse(JSON.stringify(newCar));
                newCar.color = Vue.resolveClass(newCar.rq, newCar.class, "color");
                newCar.colorRgb = Vue.resolveClass(newCar.rq, newCar.class, "color", true);
                newCar.photo = this.cgResolvePhotoUrl(newCar);
                this.resolvedRids[rid] = newCar;
              }
            }

          })
        }
      })
      return items;
    },
    cgResolvePhotoUrl(car) {
      try {
        if (car.photoId) return require('@/incoming_pics/' + decodeURI(car.photoId) + '.jpg')
        else return require('@/imgs_final/' + decodeURI(car.rid) + '.jpg')
      } catch (error) {
        return ''
      }
    },
    expandItem(item, index) {

    },
    openCreateEvent() {
      this.newTools = true;
      this.animation = true;
      this.screen = '_';
      this.$nextTick().then(() => {
        this.screen = 'new';
      })
    },
    cancelCreateEvent() {
      this.screen = '_';
      this.$nextTick().then(() => {
        this.screen = 'normal';
      })
    },
    saveNew() {
      
    },
    changeType() {
      this.typesDialog = false;
      this.ti.p_rid = [];
      if (this.ti.type === "Veteran Challenge") {
        this.addCarNew({ rid: `Porsche_935_'Moby_Dick'_1978` })
      }
    },
    addCarNew(newCar) {
      let found = this.ti.p_rid.find(x => x === newCar.rid);
      if (found) return;

      this.ti.p_rid.push(newCar.rid);

      let preCar = this.all_cars.find(x => x.rid === newCar.rid);
      if (preCar) {
        preCar = JSON.parse(JSON.stringify(preCar));
        preCar.color = Vue.resolveClass(preCar.rq, preCar.class, "color");
        preCar.colorRgb = Vue.resolveClass(preCar.rq, preCar.class, "color", true);
        preCar.count = 1;
        preCar.photo = this.cgResolvePhotoUrl(preCar);
        this.resolvedRids[newCar.rid] = preCar;
      }

      if (this.ti.type === 'Veteran Challenge' && this.ti.p_rid.length >= 3) {
        this.searchFilterDialog = false;
        this.ti.name = 'Veteran Challenge: ';
      }
      if ((this.ti.type === 'Tri-Series' || this.ti.type === 'GT Series') && this.ti.p_rid.length >= 1) {
        this.searchFilterDialog = false;
        this.ti.name = preCar.name;
      }


    },
  },
}
</script>

<style>
.MainTimeline_Layout,
.MainTimeline_Create_Layout {
  margin: 40px auto 0px auto;
  padding-bottom: 250px;
}
.MainTimeline_Header {
  display: flex;
  justify-content: flex-end;
}
.MainTimeline_Body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.MainTimeline_InitAnimation {
  animation: Processamento_Loop 0.2s linear forwards;
  animation-timing-function: cubic-bezier(0, 0.46, 0.49, 0.99);
}
@keyframes Processamento_Loop {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
.MainTimeline_W800 {
  max-width: 800px;
  margin: 0px auto;
}
.MainTimeline_ItemRoot {
  /* width: calc(47% + 105px); */
  /* max-width: calc(47% + 105px); */
  width: 100%;
  max-width: min(calc(var(--wBody)* 0.5 + 140px), 480px);
  --date-width: 24px;
  --pic-width: 120px;
  position: relative;
  --backlight-opac: 0.12;
}
.MainTimeline_BackLine + .MainTimeline_ItemRoot {
  margin-top: 30px;
}
.MainTimeline_ItemEven {
  /* margin-left: 40%; */
  text-align: left;
  align-self: flex-end;
  display: flex;
  justify-content: flex-start;
}
.MainTimeline_ItemOdd {
  /* margin-right: 40%; */
  text-align: right;
  align-self: flex-start;
  display: flex;
  justify-content: flex-end;
}
.MainTimeline_Item {
  position: relative;
  transition-duration: 0.1s;
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
  text-align: inherit;
  /* width: 100%; */
  --back-opac: 0.05;
}
.MainTimeline_ItemTop {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.MainTimeline_ItemOdd .MainTimeline_ItemTop {
  flex-direction: row-reverse;
}
.MainTimeline_Item:hover,
.MainTimeline_Item.focus-visible,
.MainTimeline_Item:focus-within {
  background-color: rgba(255, 255, 255, 0.04);
}
.MainTimeline_ItemTopLeft {
  text-align: center;
  color: var(--class-color);
  width: var(--date-width);
}
.MainTimeline_ItemTopLeft_Day {
  font-size: 20px;
  line-height: 1;
}
.MainTimeline_ItemTopLeft_Month {
  font-size: 12px;
  text-transform: uppercase;
}
.MainTimeline_ItemCover {
  width: var(--pic-width);
  min-width: var(--pic-width);
  height: 70px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.MainTimeline_DefaultCover {
  width: 100%;
  height: 100%;
  background-color: #bdbdbd;
  display: flex;
  align-items: center;
  justify-content: center;
}
.MainTimeline_ItemCoverIcon {
  font-size: 38px;
  color: #4a4a4a;
}
.MainTimeline_ItemTopRight {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: calc(100% - var(--pic-width) - var(--date-width) - 10px - 10px);
}
.MainTimeline_ItemOdd .MainTimeline_ItemTopRight {
  text-align: right;
  align-items: flex-end;
}
.MainTimeline_ItemTopTitle {
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 19px;
}
.MainTimeline_ItemTopMiniCars {
  display: flex;
  gap: 3px;
  margin-top: 2px;
}
.MainTimeline_ItemTopSubTitle {
  color: var(--class-color);
  opacity: 0.6;
  font-size: 0.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
  /* text-align: left; */
}
.MainTimeline_ItemBacklight {
  bottom: -62px;
  left: -61px;
  background: radial-gradient(rgba(var(--class-color-rgb), var(--backlight-opac)) 0%, rgba(var(--class-color-rgb), 0) 60%);
  position: absolute;
  pointer-events: none;
  width: 320px;
  height: 210px;
}
.MainTimeline_ClassB,
.MainTimeline_ClassA {
  /* --backlight-opac: 0.18; */
}
.MainTimeline_BackLine {
  position: absolute;
  top: 0;
  left: calc(50% - 3px);
  opacity: 0.25;
  height: 100%;
  --stroke: 6px;
  --half: 3px;
  --color: black;
}
.MainTimeline_BackLineHead {
  position: absolute;
  top: calc(var(--half) * -1);
  width: 20px;
  height: var(--stroke);
  border-radius: 10px;
  background-color: var(--color);
  transform-origin: var(--half) var(--half);
  transform: rotate(35deg);
}
.MainTimeline_BackLineHead + .MainTimeline_BackLineHead {
  transform: rotate(145deg);
}
.MainTimeline_BackLineBody {
  height: 100%;
  width: var(--stroke);
  background-color: var(--color);
}
.MainTimeline_BackLine + .MainTimeline_Item {
  margin-top: 40px;
}
.MainTimeline_Card_Header2Left {
  display: flex;
  height: 100%;
  width: 100%;
  min-width: 100%;
}
.MainTimeline_Card_Header2Img {
  transform: scale(1.35) translateX(13px);
  height: 100%;
}
.MainTimeline_Card_Header2Right2 {
  color: black;
  background-color: var(--class-color);
  height: 22px;
  width: 19px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 21px;
  border-top-right-radius: 6px;
  padding-top: 1px;
  padding-right: 1px;
  font-size: 12px;
  text-align: center;
}
.MainTimeline_Line1RQ {
  color: var(--class-color);
}
.MainTimeline_Line1Brand {
  color: var(--class-color);
  opacity: 0.6;
}
.MainTimeline_Line2Car {
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}
.MainTimeline_ItemTypeText {
  color: var(--class-color);
  opacity: 0.6;
  font-size: 0.8em;
}
.MainTimeline_MiniCard {
  width: 47px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.MainTimeline_MiniCard_Header2Img {
  transform: scale(1.35) translateX(5px);
  height: 100%;
}
.MainTimeline_MiniCard_Header2Right2 {
  color: black;
  background-color: var(--class-color);
  height: 13px;
  width: 12px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 12px;
  border-top-right-radius: 4px;
  padding-top: 1px;
  padding-right: 1px;
  font-size: 9px;
  text-align: center;
}
.MainTimeline_MiniCardPlus {
  display: flex;
  align-items: center;
}
.MainTimeline_ItemVeteranCriteria {
  color: var(--class-color);
  opacity: 0.6;
  font-size: 0.8em;
}
.MainTimeline_ItemVeteranCriteria .Cg_ReqsTitle {
  display: none;
}
.MainTimeline_ItemVeteranCriteria .BaseFilterDescription_Layout {
  grid-template-columns: min-content min-content;
}

.MainTimeline_Loading {
  position: relative;
  margin-top: calc(40px + 32px);
  animation: pulseOpacity 1s infinite ease-in-out;
}
.MainTimeline_LoadingBackLine {
  --color: rgba(165, 165, 165, 1);
}
.MainTimeline_LoadingItem {

}
.MainTimeline_LoadingLeft {
  height: 30px;
  background-color: rgba(165, 165, 165, 1);
}
.MainTimeline_LoadingCover {
  background-color: rgba(165, 165, 165, 1);
}
.MainTimeline_LoadingRight {
  height: 60px;
  background-color: rgba(165, 165, 165, 1);
}

.MainTimeline_Create_Header {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.MainTimeline_Create_Footer {
  display: flex;
  justify-content: center;
  gap: 15px;
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
.MainPacks_SearchCarButton {
  height: 46px;
}
.MainTimeline_Create_Body {

}
</style>