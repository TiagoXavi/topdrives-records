<template>
  <div class="MainShowcase_Root">
    <div class="MainShowcase_Header">
      <div class="MainShowcase_List">
        <button
          v-for="item in showcaseList"
          :disabled="item.username === userId || loading || readyToSave || listLoading"
          :class="`MainShowcase_Stars_${item.score}`"
          class="D_Button D_ButtonDark MainShowcase_UserButton"
          @click="$router.replace({ name: 'MainShowcaseUser', params: { username: item.username } }); reload();">
          <span :class="`Main_UserT${highlightsUsers[item.username]}`">{{ item.username }}</span>
        </button>
      </div>
    </div>
    <div class="MainShowcase_PlayControls D_Center">
      <button
        v-if="hasVideo"
        class="D_Button MainShowcase_PlayButton"
        @click="showVideo = !showVideo;">
        <i :class="`ticon-${ showVideo ? 'pause' : 'play' }`" class="D_ButtonIcon23" aria-hidden="true"/>
      </button>
    </div>
    <div class="MainShowcase_SaveBar D_Center2">
      <button
        v-if="!userId"
        class="D_Button Main_LoginToEdit"
        @click="$store.commit('OPEN_LOGIN');">{{ $t("m_login") }}</button>
      <button
        v-else-if="readyToSave"
        :class="{ D_Button_Loading: loading }"
        :disabled="loading"
        class="D_Button Main_SaveAllButton"
        @click="save()">
        <span>{{ $t("m_save") }}</span>
      </button>
      <div v-else :class="`Main_UserT${highlightsUsers[userId]}`" class="MainShowcase_TitleBox">
        <BaseIconSvg type="laurel" />
        <div class="MainShowcase_Title">{{ userId }}</div>
        <BaseIconSvg type="laurel" />
      </div>
    </div>
    <div class="MainShowcase_Mid">
      <div class="MainShowcase_Cars">
        <template v-for="(car, icar) in cars">
          <div
            v-if="icar < 3 || showMore || editEnabled"
            :class="{ MainShowcase_CarItemNoVideo: !(car.video || car.videoUrl) }"
            class="MainShowcase_CarItem">
            <div class="MainShowcase_CardTop">
              <div v-if="car.rid" class="MainShowcase_BaseCardDiv">
                <BaseCard
                  :car="resolvedRids[car.rid]"
                  :videoSrc="showVideo ? (car.video || car.videoUrl) : null"
                  :class="{ Car_WithVideoHeight: car.fHeight, Car_WithVideoNoBox: !car.showBox }"
                  :isDialogBox="true"
                  :options="false" />
              </div>
              <div v-else class="MainShowcase_CarPlaceHolder">
                <button
                  :disabled="loading || !user || (userId && user.username !== userId)"
                  class="D_Button Car_AddButton add MainShowcase_SearchCarButton"
                  @click="prepareAddCarDialog(icar);">
                  <div class="MainShowcase_SearchCarButtonBox">
                    <i class="ticon-plus_2 Car_AddIcon" aria-hidden="true"/>
                    <div class="MainShowcase_SearchCarLabel">{{ $t("m_searchCar") }}</div>
                  </div>
                  <i class="ticon-car MainShowcase_CarPlaceholder" aria-hidden="true"/>
                </button>
              </div>
            </div>
            <div v-if="car && car.rid && editEnabled" class="MainShowcase_CardBottom">
              <button
                v-if="!(car.video || car.videoUrl)"
                class="D_Button D_ButtonDark D_ButtonDark2 MainShowcase_OptionButton D_ButtonGreen"
                style="margin-bottom: 5px;"
                @click="addVideo(icar)">
                <i class="ticon-video D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t('m_addVideo') }}</span>
              </button>
              <div class="Main_FilterChipsFlex">
                <button
                  v-if="icar !== 0 && (car.video || car.videoUrl) && showVideo"
                  class="BaseChip BaseChip_MinWidth BaseChip_DontCrop BaseChip_Icon2"
                  @click="moveLeft(icar)">
                  <i class="ticon-arrow_left_3 D_ButtonIcon24" aria-hidden="true"/>
                </button>
                <BaseChip
                  v-if="(car.video || car.videoUrl) && showVideo"
                  :inputValue="car.fHeight"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Icon2"
                  :value="true"
                  :oneOnly="true"
                  @click="car.fHeight = !car.fHeight;">
                  <i class="ticon-up_down_1 D_ButtonIcon24" aria-hidden="true"/>
                </BaseChip>
                <BaseChip
                  v-if="(car.video || car.videoUrl) && showVideo"
                  :inputValue="car.showBox"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseChip_Icon2"
                  :value="true"
                  :oneOnly="true"
                  @click="car.showBox = !car.showBox;">
                  <i class="ticon-dash D_ButtonIcon24" aria-hidden="true"/>
                </BaseChip>
              </div>
              <button
                v-if="(car.video || car.videoUrl)"
                class="D_Button MainShowcase_OptionButton"
                @click="removeVideo(icar)">
                <i class="ticon-close_3 D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t('m_removeVideo') }}</span>
              </button>
              <button
                v-if="!(car.video || car.videoUrl)"
                class="D_Button MainShowcase_OptionButton"
                @click="downloadImage(car.rid)">
                <i class="ticon-download D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t('m_downloadImage') }}</span>
              </button>
              <button
                v-if="!(car.video || car.videoUrl)"
                class="D_Button MainShowcase_OptionButton"
                @click="removeCar(icar)">
                <i class="ticon-close_3 D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t('m_removeCar') }}</span>
              </button>
            </div>
          </div>
        </template>
      </div>
      <div v-if="!editEnabled && !showMore && cars.length > 3" class="MainShowcase_ D_Center2">
        <button
          class="D_Button Main_OptionsButton"
          style="margin-top: 25px;"
          @click="showMore = true">
          <span>{{ $t('m_showMore') }} ({{ cars.length - 3 }})</span>
        </button>
      </div>
    </div>
    <div v-if="editEnabled" class="MainShowcase_Help">
      <div class="MainShowcase_ D_Center2">
        <button
          v-if="isFull"
          class="D_Button Main_OptionsButton"
          @click="addMoreCar()">
          <i class="ticon-plus_2 D_ButtonIcon" style="font-size: 16px;" aria-hidden="true"/>
          <span>{{ $tc('m_car', 1) }}</span>
        </button>
      </div>
      <div class="MainShowcase_HelpInner D_Center2">
        <span>{{ $t('m_needHelp') }}</span>
        <a
          class="D_Button Main_OptionsButton"
          target="_blank"
          rel="noopener noreferrer"
          href="https://discord.com/channels/1008569974094311544/1008976247210135603/1299543503482785792">
          <BaseIconSvg type="discord" :useMargin="false" style="width: 25px; margin: -5px 6px -5px 0;" />
          <span>{{ $t('m_instructions') }}</span>
        </a>
      </div>
    </div>

    <!-- Select car -->
    <BaseFilterDialog
      v-model="searchCarDialog"
      :lastestList="lastestList"
      :highlightsUsers="highlightsUsers"
      :all_cars="all_cars"
      :sortEnabled="true"
      :enableCounters="false"
      :forceNonPrize="false"
      @addCar="addCarNew($event)"
      @close="onCloseSearchCarDialog()"
    />

    <BaseDialog
      :active="confirmDelete.dialog"
      :transparent="false"
      :lazy="true"
      zindex="101"
      max-width="420px"
      min-width="240px"
      @close="confirmDelete.dialog = false;">
      <div style="Main_DialogConfirm">
        <div class="Main_DialogMessage">{{ confirmDelete.msg }}</div>
        <div class="Main_DialogBottom">
          <button
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.dialog = false;">
            <span>{{ $t("m_cancel") }}</span>
          </button>
          <button
            :class="`${ loading ? 'D_Button_Loading ' : '' }`+
                    `${ confirmDelete.classe }`"
            :disabled="loading"
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.action">
            <span>{{ confirmDelete.actionLabel }}</span>
          </button>
        </div>
      </div>
    </BaseDialog>


  </div>
</template>

<script>
import all_cars from '../database/cars_final.json'
import BaseCard from './BaseCard.vue'
import BaseText from './BaseText.vue'
import BaseDialog from './BaseDialog.vue'
import BaseChip from './BaseChip.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'
import BaseIconSvg from './BaseIconSvg.vue'

export default {
  name: 'MainShowcase',
  components: {
    BaseCard,
    BaseText,
    BaseDialog,
    BaseChip,
    BaseFilterDialog,
    BaseIconSvg
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
      listLoading: false,
      user: null,
      searchCarDialog: false,
      all_cars,
      lastestList: [],
      highlightsUsers: {},
      showcaseList: [],
      resolvedRids: {},
      carAddIndex: -1,
      showVideo: true,
      cars: [],
      unsubscribe: null,
      uploadInput: null,
      downloadAnchor: null,
      confirmDelete: {
        dialog: false,
        msg: "Confirm delete?",
        actionLabel: "Delete",
        action: null,
        loading: false,
        classe: ""
      },
      tempString: null,
      showMore: false,
      saved: false
    }
  },
  watch: {},
  beforeMount() {
    this.resetCars();
    this.user = this.$store.state.user;

    // check new cars
    this.getLastest();
  },
  mounted() {
    this.loadList();
    
    let vm = this;
    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
        if (vm.$route.name === "MainShowcase") {
          vm.load();
        }
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    userId() {
      return this.$route.name === "MainShowcase" ? (this.user || {}).username : this.$route.params.username;
    },
    editEnabled() {
      return this.user && this.user.username && (this.$route.name === "MainShowcase" || this.$route.params.username === this.user.username || this.user.username === "TiagoXavi");
    },
    hasVideo() {
      return !!this.cars.find(x => (x.video || x.videoUrl));
    },
    readyToSave() {
      if (!this.editEnabled) return false;
      console.log(0)
      if (this.saved) return false;
      console.log(1)
      if (this.cars.some(x => x.video && x.rid )) return true;
      console.log(2)
      if (!this.tempString) return false;
      console.log(3)
      if (this.tempString === this.generateTempString(this.cars)) return false;

      return true;
    },
    isFull() {
      return this.cars.every(x => x.videoUrl);
    }
  },
  methods: {
    getLastest() {
      let vm = this;
      this.lastestLoading = true;


      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;

        this.highlightsUsers = Vue.resolveHighlightsUsers(res.data);

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

        
        this.load();


      })
      .catch(error => {
        this.lastestLoading = false;
        console.log(error);
      });

    },
    resetCars() {
      this.cars = [
        { rid: null, video: null, videoUrl: null, fileToUpload: null, fHeight: false, showBox: true },
        { rid: null, video: null, videoUrl: null, fileToUpload: null, fHeight: false, showBox: true },
        { rid: null, video: null, videoUrl: null, fileToUpload: null, fHeight: false, showBox: true }
      ];
      this.tempString = this.generateTempString(this.cars);
    },
    addMoreCar() {
      this.cars.push({ rid: null, video: null, videoUrl: null, fileToUpload: null, fHeight: false, showBox: true });
      // this.tempString = this.generateTempString(this.cars);
    },
    reload() {
      setTimeout(() => {
        this.load();
      }, 10);
    },
    load() {
      if (!this.userId) return;
      this.resetCars();
      this.loading = true;

      axios.get(Vue.preUrlCharlie + `/showcase/${this.userId}`)
      .then(res => {
        this.loading = false;
        this.saved = false;
        if (res.data && res.data.cars) {
          this.cars = res.data.cars;
          this.cars.map(car => {
            if (car.rid) {
              this.addToResolvedRids(car.rid);
            }
            if (car.videoUrl) {
              car.videoUrl = car.videoUrl.replace("http://", "https://");
            }
          })
        } else {
          // 404
        }
        this.tempString = this.generateTempString(this.cars);
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
    save() {
      this.loading = true;

      let params = {
        cars: this.cars,
        username: this.userId
      }
      let linksArr = [];
      this.cars.map(car => {
        if (car.fileToUpload) {
          linksArr.push({
            rid: car.rid,
            fileToUpload: car.fileToUpload
          })
        }
      })
      params.links = linksArr;

      axios.post(Vue.preUrl + "/updateShowcase", params)
      .then(res => {
        this.loading = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
        });
        this.saved = true;

        this.tempString = this.generateTempString(this.cars);

        this.updateBackendShowcase();

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
    loadList() {
      this.listLoading = true;

      axios.get(Vue.preUrlCharlie + `/showcaseList`)
      .then(res => {
        this.listLoading = false;
        this.showcaseList = res.data;
      })
      .catch(error => {
        this.listLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    updateBackendShowcase() {
      this.loading = true;

      axios.get(Vue.preUrlCharlie + "/updateBackendShowcase")
      .then(res => {
        // nada
        this.loading = false;
        this.loadList();
        this.load();
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
    prepareAddCarDialog(index) {
      // this.$store.commit("START_LOGROCKET", {});
      this.carAddIndex = index;
      this.searchCarDialog = true;
    },
    addCarNew(newCar) {
      // main filter
      this.cars[this.carAddIndex].rid = newCar.rid;
      this.addToResolvedRids(newCar.rid);
      this.searchCarDialog = false;
      
      return;
    },
    addToResolvedRids(rid) {
      if (!this.resolvedRids[rid]) {
        let preCar = this.all_cars.find(x => x.rid === rid);
        if (preCar) {
          preCar = JSON.parse(JSON.stringify(preCar));
          preCar.color = Vue.resolveClass(preCar.rq, preCar.class, "color");
          preCar.colorRgb = Vue.resolveClass(preCar.rq, preCar.class, "color", true);
          preCar.photo = Vue.carPhoto(preCar);
          this.resolvedRids[rid] = preCar;
        }
      }
    },
    onCloseSearchCarDialog() {

    },
    addVideo(icar) {
      this.carAddIndex = icar;
      this.uploadInput = document.createElement('input');
      this.uploadInput.setAttribute("type", "file")
      this.uploadInput.setAttribute("accept", "video/*")
      this.uploadInput.addEventListener('change', this.renderVideo, false)
      this.uploadInput.click();
    },
    renderVideo(event) {
      var file = event.target.files[0];
      Vue.set(this.cars[this.carAddIndex], "video", URL.createObjectURL(file));

      if (file.size > 3 * 1000 * 1000) { // 3mb
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: "File larger than 3 MB",
          type: "error"
        });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        Vue.set(this.cars[this.carAddIndex], "fileToUpload", e.target.result);
      };
    },
    removeVideo(icar) {
      this.cars[icar].video = null;
      this.cars[icar].videoUrl = null;
      this.cars[icar].fileToUpload = null;
    },
    async downloadImage(rid) {
      this.downloadAnchor = document.createElement("a");
      // document.documentElement.append(link);

      await fetch(this.resolvedRids[rid].photo)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {

          let objectURL = URL.createObjectURL(blob);

          // Set the download name and href
          this.downloadAnchor.setAttribute("download", `${rid}.jpg`);
          this.downloadAnchor.href = objectURL;

          // Auto click the link
          this.downloadAnchor.click();
      })
    },
    removeCar(icar) {
      this.cars[icar].rid = null;
      this.cars[icar].video = null;
      if (icar > 2) {
        this.cars.splice(icar, 1);
      }
    },
    generateTempString(cars) {
      let newObj = cars.map(x => {
        return {
          videoUrl: x.videoUrl,
          fileToUpload: x.fileToUpload,
          fHeight: x.fHeight,
          showBox: x.showBox
        }
      });
      newObj = newObj.filter((x, ix) => ix < 3 || (x.rid && x.fileToUpload));
      return JSON.stringify(newObj);
    },
    moveLeft(icar) {
      if (icar === 0) return;
      const item = this.cars[icar];
      this.cars.splice(icar, 1);
      this.cars.splice(icar-1, 0, item);
    }
  },
}
</script>

<style>
.MainShowcase_Root {
  min-height: calc(var(--hBody) - var(--top-menu) - 20px);
  padding-top: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.MainShowcase_BaseCardDiv .Row_DialogCardCard,
.MainShowcase_CarPlaceHolder {
  width: 261px !important;
  height: 161px !important;
  --card-font-size: 13px;
  margin: 0;
}
.MainShowcase_BaseCardDiv .BaseCard_EffectBackGround {
  display: none;
}
.MainShowcase_Cars {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0 15px;
}
.MainShowcase_CardBottom {
  display: flex;
  align-items: center;
  margin-top: 25px;
  flex-direction: column;
  gap: 5px;
}
.MainShowcase_CardBottom {
  display: flex;
  align-items: center;
  margin-top: 25px;
  flex-direction: column;
  gap: 5px;
  opacity: 0;
  transition-duration: 0.1s;
}
.MainShowcase_CarItem:focus-within .MainShowcase_CardBottom,
.MainShowcase_CarItem:hover .MainShowcase_CardBottom,
.MainShowcase_CarItemNoVideo .MainShowcase_CardBottom,
.Main_isMobile .MainShowcase_CardBottom {
  opacity: 1;
}
.MainShowcase_OptionButton {
  padding: 0 7px;
}
.MainShowcase_PlayControls {
  position: relative;
  min-height: 20px;
}
.MainShowcase_PlayButton {
  position: absolute;
  top: -9px;
  right: 15px;
}
.MainShowcase_SearchCarButtonBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.MainShowcase_SearchCarButton[disabled] {
  opacity: 1;
}
.MainShowcase_SearchCarButton[disabled] .MainShowcase_SearchCarButtonBox {
  display: none;
}
.MainShowcase_SearchCarLabel {
  font-size: 21px;
}
.MainShowcase_CarPlaceholder {
  display: none;
}
.MainShowcase_SearchCarButton[disabled] .MainShowcase_CarPlaceholder {
  display: block;
}
.MainShowcase_List {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 3px;
  flex-wrap: wrap;
  padding: 0 20px;
  min-height: calc(36px + 36px + 5px);
}
.MainShowcase_UserButton {
  position: relative;
  font-size: 15px;
}
[class*='MainShowcase_Stars_']:before {
  font-family: 'JurisT' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  position: absolute;
  top: -0.9ex;
  font-size: 7px;
  color: #505050;
  letter-spacing: 1px;
  text-align: center;
  width: 100%;
}
.MainShowcase_Stars_5:before {
  content: "\e92b\e92b\e92b\e92b\e92b";
}
.MainShowcase_Stars_4:before {
  content: "\e92b\e92b\e92b\e92b";
}
.MainShowcase_Stars_3:before {
  content: "\e92b\e92b\e92b";
}
.MainShowcase_Stars_2:before {
  content: "\e92b\e92b";
}
.MainShowcase_Stars_1:before {
  content: "\e92b";
}
.MainShowcase_Help {
  margin-top: 20px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-direction: column;
  gap: 5px;
}

/* @media only screen and (max-width: 767px) {
  .MainShowcase_Cars {
    flex-direction: column;
    align-items: center;
  }
  .MainShowcase_CarItem {
    display: flex;
    gap: 5px;
    align-items: center;
  }
} */

</style>