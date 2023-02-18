<template>
  <div class="MainFindCar_Layout">
    <div class="MainFindCar_Header">
      <div class="Main_ChartFilter Main_DarkScroll">
        <template v-if="findcFilter">
          <div class="Cg_ReqsTitle">{{ $tc("m_filter", 1) }}</div>
          <div class="Cg_Reqs">
            <BaseFilterDescription :filter="findcFilter" />
          </div>
        </template>
        <div class="Cg_FilterButtons">
          <button
            class="D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton"
            @click="openChartOfDialog()">{{ findcFilter ? $t("m_change") : $t("m_requirements") }}</button>
        </div>
      </div>
      <BaseConfigCheckBox
        v-model="showBigCards"
        style="margin-top: 3px;"
        class="Main_ChartTrackBox"
        name="showBigCards"
        :label="$t('m_showBigCards')" />
    </div>
    <div :class="{ MainFindCar_BodyBig: showBigCards }" class="MainFindCar_Body">
      <div
        v-for="car in list"
        :style="`--color: ${car.color}`"
        class="MainFindCar_Car">
        <BaseCardGallery
          v-if="showBigCards"
          :car="car.car"
          :options="false"
          class="MainFindCar_GalleryCard" />
        <div v-else class="MainFindCar_CarCard">
          <div class="MainFindCar_BankPhoto">
            <img :src="car.photo" class="MainFindCar_BankPhotoImg" alt="">
          </div>
          <div class="MainFindCar_RQ">{{ car.car.rq }}</div>
        </div>
        <div class="MainFindCar_Right">
          <div class="MainFindCar_Desc">{{ car.location }}</div>
          <div :class="`MainFindCar_Chance_${car.chance}`" class="MainFindCar_Chance">{{ car.chance }}</div>
        </div>
      </div>
      <div v-if="list.length === 0" class="MainFindCar_Empty">{{ $t("m_nothingFound") }}</div>
    </div>

    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      @filterUpdate="updateChartFilter($event)"
      @listRids="finCarFinish($event);"
    />

  </div>
</template>

<script>
import BaseFilterDescription from './BaseFilterDescription.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'
import BaseCardGallery from './BaseCardGallery.vue'
import BaseCard from './BaseCard.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'

import chsp_prizes from '../database/chsp_prizes.json'
import all_cars from '../database/cars_final.json'

export default {
  name: 'MainFindCar',
  components: {
    BaseFilterDescription,
    BaseFilterDialog,
    BaseCardGallery,
    BaseCard,
    BaseConfigCheckBox
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chsp_prizes,
      all_cars,
      all_cars_obj: {},
      filterDialog: false,
      searchTracks: '',
      findcFilter: {},
      list: [],
      showBigCards: false,
    }
  },
  watch: {},
  beforeMount() {
    let showBigCards = window.localStorage.getItem("showBigCards");
    if (showBigCards) {
      showBigCards = JSON.parse(showBigCards);
      this.showBigCards = showBigCards;
    }
    this.all_cars.map(x => {
      this.all_cars_obj[x.rid] = x;
    })
  },
  mounted() {
    this.finCar();
  },
  beforeDestroy() {
  },
  computed: {},
  methods: {
    openChartOfDialog() {
      this.filterDialog = true;
    },
    closeChartOfDialog() {
      this.filterDialog = false;
    },
    updateChartFilter(filter) {
      this.findcFilter = filter;
      this.filterDialog = false;
      this.finCar();
    },
    finCar() {
      this.$store.commit("FILTER_EMIT_RIDS", { total: 5000 });
    },
    finCarFinish(listOfRids) {
      listOfRids = listOfRids.map(x => x.rid);
      this.list = [];
      this.chsp_prizes.map(cap => {
        cap.matches.map((match, iMatch) => {
          let isRoad = match.length === 3;
          match.map((rid, iRid) => {
            if (!listOfRids.includes(rid)) return;
            let chance;
            if (!isRoad && iRid === 0) chance = "80%";
            if (!isRoad && iRid === 1) chance = "20%";
            if (isRoad && iRid === 0) chance = "70%";
            if (isRoad && iRid === 1) chance = "20%";
            if (isRoad && iRid === 2) chance = "10%";
            let car = this.all_cars_obj[rid];
            this.list.push({
              rid: rid,
              location: `${cap.name} ${iMatch}`,
              chance,
              car,
              color: Vue.resolveClass(car.rq, car.class, "color"),
              photo: this.cgResolvePhotoUrl(rid)
            })
          })
        })
      })
      this.list.sort((a, b) => {
        return `${a.car.rq}_${a.car.rid}`.localeCompare(`${b.car.rq}_${b.car.rid}`);
        return b.car.rq - a.car.rq;
      })

    },
    cgResolvePhotoUrl(rid) {
      try {
        return require('@/imgs_final/' + decodeURI(rid) + '.jpg')
      } catch (error) {
        return ''
      }
    },
  },
}
</script>

<style>
.MainFindCar_Body {
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  max-width: 310px;
}
.MainFindCar_BodyBig {
  max-width: 470px;
}
.MainFindCar_Right {
  display: contents;
}
.MainFindCar_BodyBig .MainFindCar_Right {
  display: block;
}
.MainFindCar_Header {
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 20px;
}
.Main_ChartFilter {
  height: 120px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 17px;
  background-color: rgba(0,0,0,.1);
  padding: 10px;
  overflow-y: auto;
}
.Main_ChartAnalyzeButton {
  margin: 0 auto;
  margin-top: 17px;
}
.MainFindCar_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.MainFindCar_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.MainFindCar_CarCard {
  position: relative;
}
.MainFindCar_Car {
  display: flex;
  align-items: center;
  gap: 10px;
}
.MainFindCar_RQ {
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
.MainFindCar_Desc {
  flex-grow: 1;
}
.MainFindCar_Empty {
  text-align: center;
}
</style>