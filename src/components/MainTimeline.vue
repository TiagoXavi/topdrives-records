<template>
  <div class="MainTimeline_Layout">
    <div class="MainTimeline_Header MainTimeline_W800"></div>
    <div class="MainTimeline_Body MainTimeline_W800">
      <div class="MainTimeline_BackLine">
        <div class="MainTimeline_BackLineHead"></div>
        <div class="MainTimeline_BackLineHead"></div>
        <div class="MainTimeline_BackLineBody"></div>
      </div>
      <div
        v-for="(item, ix) in timeline"
        :class="{
          MainTimeline_ItemEven: ix % 2 === 0,
          MainTimeline_ItemOdd: ix % 2 === 1
        }"
        :style="`--class-color: ${(item.p_rid || []).length === 1 ? resolvedRids[item.p_rid[0]].color : ''} ;`"
        class="MainTimeline_Item">
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
              <div v-else-if="(item.p_rid || []).length === 0 && item.type !== 'News'" class="MainTimeline_ItemTypeText">{{ item.type }}</div>
              <div v-else-if="(item.p_rid || []).length === 0 && item.type === 'News'" class="MainTimeline_ItemTopSubTitle">{{ item.description }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import all_cars from '../database/cars_final.json'
import BaseCard from './BaseCard.vue'
import BaseFilterDescription from './BaseFilterDescription.vue'

export default {
  name: 'MainTimeline',
  components: {
    BaseCard,
    BaseFilterDescription
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
      timeline: [],
      resolvedRids: {}
    }
  },
  watch: {},
  beforeMount() {
    this.searchTimeline();
    setTimeout(() => {
      
    }, 1000);
  },
  mounted() {},
  computed: {},
  methods: {
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
                newCar.count = 1;
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
  },
}
</script>

<style>
.MainTimeline_Layout {
  margin: 40px auto 0px auto;
  padding-bottom: 250px;
}
.MainTimeline_Header {

}
.MainTimeline_Body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.MainTimeline_W800 {
  max-width: 800px;
  margin: 0px auto;
}
.MainTimeline_Item {
  position: relative;
  transition-duration: 0.1s;
  padding: 10px;
  border-radius: 10px;
}
.MainTimeline_ItemEven {
  margin-left: 40%;
}
.MainTimeline_ItemOdd {
  margin-right: 40%;
}
.MainTimeline_ItemTop {
  display: flex;
  align-items: center;
  gap: 10px;
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
  width: 120px;
  min-width: 120px;
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
}
.MainTimeline_ItemOdd .MainTimeline_ItemTopRight {
  text-align: right;
  align-items: flex-end;
}
.MainTimeline_ItemTopTitle {
  white-space: nowrap;
  max-width: 15em;
  text-overflow: ellipsis;
  overflow: hidden;
}
.MainTimeline_ItemTopMiniCars {
  display: flex;
  gap: 3px;
  margin-top: 5px;
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
  text-align: left;
}
.MainTimeline_BackLine {
  position: absolute;
  top: 0;
  left: calc(50% - 3px);
  opacity: 0.27;
  height: 100%;
  --stroke: 6px;
  --half: 3px;
}
.MainTimeline_BackLineHead {
  position: absolute;
  top: calc(var(--half) * -1);
  width: 20px;
  height: var(--stroke);
  border-radius: 10px;
  background-color: black;
  transform-origin: var(--half) var(--half);
  transform: rotate(35deg);
}
.MainTimeline_BackLineHead + .MainTimeline_BackLineHead {
  transform: rotate(145deg);
}
.MainTimeline_BackLineBody {
  height: 100%;
  width: var(--stroke);
  background-color: black;
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
  max-width: 15em;
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
</style>