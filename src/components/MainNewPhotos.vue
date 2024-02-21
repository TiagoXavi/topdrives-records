<template>
  <div class="MainNewPhotos_Layout">
    <!-- <div class="MainNewPhotos_Header">
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
    </div> -->
    <div :class="{ MainNewPhotos_BodyBig: showBigCards }" class="MainNewPhotos_Body">
      <div
        v-for="car in list"
        :style="`--color: ${car.color}`"
        class="MainNewPhotos_Car">
        <BaseCardGallery
          :car="car.car"
          :options="false"
          :oldpic="true"
          class="MainNewPhotos_GalleryCard" />
        <BaseCardGallery
          :car="car.car"
          :options="false"
          class="MainNewPhotos_GalleryCard" />
      </div>
      <div v-if="list.length === 0" class="MainNewPhotos_Empty">{{ $t("m_nothingFound") }}</div>
    </div>

    <BaseFilterDialog
      v-model="filterDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      ridsMutationName="FILTER_NEWPHOTOS_RIDS"
      @filterUpdate="updateChartFilter($event)"
      @listRids="finCarFinish($event);"
    />

  </div>
</template>

<script>
import BaseFilterDescription from './BaseFilterDescription.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'
import BaseCardGallery from './BaseCardGallery.vue'
import BaseConfigCheckBox from './BaseConfigCheckBox.vue'

import all_cars from '../database/cars_final.json'
import custom_tags from '../database/custom_tags.json'

export default {
  name: 'MainNewPhotos',
  components: {
    BaseFilterDescription,
    BaseFilterDialog,
    BaseCardGallery,
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
      all_cars,
      custom_tags,
      all_cars_obj: {},
      filterDialog: false,
      searchTracks: '',
      findcFilter: {},
      list: [],
      showBigCards: true,
    }
  },
  watch: {},
  beforeMount() {
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
      this.$store.commit("FILTER_NEWPHOTOS_RIDS", { total: 5000 });
    },
    finCarFinish(listOfRids) {
      listOfRids = listOfRids.map(x => x.rid);
      this.list = [];
      this.custom_tags["21.1 new photos"].map(rid => {

        let car = this.all_cars_obj[rid];
        this.list.push({
          rid: rid,
          car,
          color: Vue.resolveClass(car.rq, car.class, "color"),
          photo: this.cgResolvePhotoUrl(car)
        })

        // cap.matches.map((match, iMatch) => {
        //   let isRoad = match.length === 3;
        //   match.map((rid, iRid) => {
        //     if (!listOfRids.includes(rid)) return;
        //     let chance;
        //     if (!isRoad && iRid === 0) chance = "80%";
        //     if (!isRoad && iRid === 1) chance = "20%";
        //     if (isRoad && iRid === 0) chance = "70%";
        //     if (isRoad && iRid === 1) chance = "20%";
        //     if (isRoad && iRid === 2) chance = "10%";
            
            
        //   })
        // })
      })
      this.list.sort((a, b) => {
        return `${a.car.rq}_${a.car.rid}`.localeCompare(`${b.car.rq}_${b.car.rid}`);
        return b.car.rq - a.car.rq;
      })

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
.MainNewPhotos_Layout {
  display: flex;
}
.MainNewPhotos_Body {
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  /* max-width: 310px; */
}
.MainNewPhotos_BodyBig {
  /* max-width: 470px; */
}
.MainNewPhotos_Right {
  display: contents;
}
.MainNewPhotos_BodyBig .MainNewPhotos_Right {
  display: block;
}
.MainNewPhotos_Header {
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
.MainNewPhotos_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.MainNewPhotos_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.MainNewPhotos_CarCard {
  position: relative;
}
.MainNewPhotos_Car {
  display: flex;
  align-items: center;
  gap: 10px;
}
.MainNewPhotos_RQ {
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
.MainNewPhotos_Desc {
  flex-grow: 1;
}
.MainNewPhotos_Empty {
  text-align: center;
}
</style>