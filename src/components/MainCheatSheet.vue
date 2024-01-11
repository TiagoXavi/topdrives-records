<template>
  <div class="MainCheatSheet_Layout">
    <div class="MainCheatSheet_Box">
      <div class="MainTranslate_Logo">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
      </div>
      <div class="MainCheatSheet_SearchLayout">
        <div class="Main_SearchFieldBox">
          <input
            v-model="searchInput"
            :placeholder="$t('m_searchCar')"
            class="D_SearchInput data-hj-allow"
            type="text"
            autocomplete="off"
            @input="searchInputFunc()">
        </div>
      </div>
      <div class="MainCheatSheet_ListNewCarsBox">
        <div class="MainCheatSheet_ListNewCars Main_DarkScroll">
          <div
            v-for="item in filteredIncomingCars"
            :style="{ '--color': item.classColor }"
            class="MainCheatSheet_ListCar Main_SearchItem"
            @click="carListClick(item, $event)">
            <div class="Main_SearchItemImg">
              <img :src="item.photoCalc" class="MainGallery_Img" alt="">
            </div>
            <div class="Main_SearchItemLeft">{{ item.class }}{{ item.rq }}</div>
            <div class="Main_SearchItemRight">
              <span v-if="item.locatedName" v-html="item.locatedName"></span>
              <span v-else>{{ item.name }}</span><i v-if="item.prize" class="ticon-trophy Main_SearchTrophy" aria-hidden="true"/><span class="MainCheatSheet_ListCarPercent" :class="{ MainCheatSheet_ListCarPercent100: item.percent === 100 }">{{ item.percent }}%</span>
            </div>
          </div>
          <div v-if="incomingCarsLoading && incomingCars.length === 0" class="MainCheatSheet_ListLoading">Loading</div>
          <div v-if="!incomingCarsLoading && incomingCars.length === 0" class="MainCheatSheet_ListLoading">No cars</div>
        </div>
      </div>
      <div class="MainCheatSheet_Header">Add a new car</div>
      <div class="MainCheatSheet_FormBox">
        <div
          v-for="(item, key) in newCar"
          class="MainCheatSheet_FormItem">
          <template v-if="key !== 'abs' && key !== 'tcs' && key !== 'prize' && key !== 'photoId' && key !== 'rid' && key !== 'name' && key !== 'photoCalc' && key !== 'class'">
            <div class="MainCheatSheet_FormTitle">{{ labels[key] || $tc(`c_${key}`, 1) }}</div>
            <div v-if="textTypes[key]" class="MainCheatSheet_FormField" :class="`MainCheatSheet_${textTypes[key]}`">
              <BaseText
                v-model="newCar[key]"
                :type="textTypes[key]"
                class="BaseText_Big"
                :placeholder="placeholders[key] || ''" />
            </div>
            <div v-if="key === 'onlyName'" class="MainCheatSheet_FormTitleAlert">Please, exactly how is in game</div>
            <div v-if="key === 'onlyName'" class="MainCheatSheet_FormTitleResult">Result: <span class="MainCheatSheet_FormTitleGreen">{{ newCar.brand }} {{ newCar.onlyName }}</span></div>
            <div
              v-if="typesList[key]"
              class="MainCheatSheet_FormChipsBox">
              <template v-for="item in typesList[key]">
                <BaseChip
                  v-model="newCar[key]"
                  :value="item"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
                  @click="changedChip(key, item)">
                  <span>{{ item }}</span>
                </BaseChip>
              </template>
            </div>
          </template>
          <template v-if="key === 'photoId'">
            <div class="MainCheatSheet_FormTitle">Photo</div>
            <button
              style="min-width: 200px;"
              class="D_Button D_ButtonDark MainCheatSheet_SelectPhoto"
              @click="photoDialogActive = true;">
              <template v-if="!newCar.photoId || !newCar.photoId.src">
                <i class="ticon-camera D_ButtonIcon" aria-hidden="true"/>
                <span>Select photo</span>
              </template>
              <template v-else>
                <div class="MainCheatSheet_PhotosChip">
                  <div class="MainCheatSheet_PhotoDiv">
                    <img :src="newCar.photoId.src" class="MainCheatSheet_PhotoImg" alt="">
                  </div>
                </div>
              </template>
            </button>
          </template>
          <template v-if="key === 'abs'">
            <div class="MainCheatSheet_FormTitle">Others</div>
            <div class="MainCheatSheet_FormChipsBox">
              <BaseChip
                v-model="newCar.abs"
                :value="true"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                @click="">
                <span>ABS</span>
              </BaseChip>
              <BaseChip
                v-model="newCar.tcs"
                :value="true"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                @click="">
                <span>TCS</span>
              </BaseChip>
              <BaseChip
                v-model="newCar.prize"
                :value="true"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                @click="">
                <span>Prize car</span>
              </BaseChip>
            </div>
          </template>
        </div>
        <div class="MainCheatSheet_Submit">
          <button
            :class="{ D_Button_Loading: loading, D_Button_Disabled: !valid }"
            :disabled="loading || !valid"
            style="min-width: 200px;"
            class="D_Button Main_SaveAllButton"
            @click="submit(true)">Preview</button>
        </div>
        <div class="MainCheatSheet_Submit" style=" margin-top: 20px;">
          <button
            :class="{ D_Button_Loading: loading }"
            :disabled="loading"
            style="min-width: 120px;"
            class="D_Button D_ButtonDark"
            @click="askReset()">Reset</button>
        </div>
      </div>
    </div>
    <BaseDialog
      :active="previewDialogActive"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="previewDialogActive = false">
      <div class="Main_TuneDialog">

        <div v-if="previewDialogActive" class="Row_DialogLayout">
          <div class="Row_DialogBody Space_TopPlus">
            <div class="Row_DialogCard">
              <div class="Row_DialogCardLeft">
                <BaseCard
                  :car="previewCar"
                  :isDialogBox="true"
                  :options="false" />
              </div>
            </div>
          </div>
          <div v-if="previewCar.tags && previewCar.tags.length > 0" class="Row_DialogCardTags Space_TopPlus">
            <BaseGameTag
              v-for="tag in previewCar.tags"
              :key="tag"
              :tag="tag" />
          </div>
          <div class="Row_DialogCardDual Space_TopPlus">
            <div class="Row_DialogCardBottom">
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">ABS</div>
                <div :class="{ Row_DialogCardStatCorrect: previewCar.abs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ previewCar.abs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">TCS</div>
                <div :class="{ Row_DialogCardStatCorrect: previewCar.tcs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ previewCar.tcs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $tc("c_clearance", 1) }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${previewCar.clearance.toLowerCase()}`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">MRA ({{ $t("c_stock").toLowerCase() }})</div>
                <div class="Row_DialogCardStatValue">
                  <span v-if="previewCar.mra" style="margin-right: 7px;">{{ previewCar.mra }}</span>
                </div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_weight") }} ({{ $t("c_stock").toLowerCase() }})</div>
                <div class="Row_DialogCardStatValue">{{ previewCar.weight }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_fuel") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${previewCar.fuel.toLowerCase()}`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_seats") }}</div>
                <div class="Row_DialogCardStatValue">{{ previewCar.seats }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_enginePos") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${previewCar.engine.toLowerCase()}Engine`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_bodyStyle") }}</div>
                <div class="Row_DialogCardStatValue">
                  <template v-for="(body, index) in previewCar.bodyTypes">
                    <template v-if="index !== 0">,&nbsp;</template>
                    <template>{{ $t(`c_${body.toLowerCase()}`) }}</template>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="MainCheatSheet_DialogSubmit" style="margin-top: 30px;">
            <div class="MainCheatSheet_Submit">
              <button
                :class="{ D_Button_Loading: loading, D_Button_Disabled: !valid }"
                :disabled="loading || !valid"
                style="min-width: 200px;"
                class="D_Button Main_SaveAllButton"
                @click="submit(false)">Submit</button>
            </div>
          </div>
        </div>

      </div>
    </BaseDialog>
    <BaseDialog
      :active="photoDialogActive"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="photoDialogActive = false">
      <div class="Main_TuneDialog">
        <div class="MainCheatSheet_PhotosBox">
          <template v-for="photo in photos">
            <BaseChip
              v-model="newCar.photoId"
              :value="photo"
              :class="{ MainCheatSheet_PhotoInUse: photo.inUse }"
              :disabled="photo.inUse"
              class="MainCheatSheet_PhotosChip">
              <div class="MainCheatSheet_PhotoDiv">
                <img :src="photo.src" class="MainCheatSheet_PhotoImg" alt="">
                <div v-if="photo.inUse" class="MainCheatSheet_PhotoInUseText">In use</div>
              </div>
            </BaseChip>
          </template>
        </div>
      </div>
    </BaseDialog>
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
            :class="`${ confirmDelete.loading ? 'D_Button_Loading ' : '' }`+
                    `${ confirmDelete.classe }`"
            :disabled="confirmDelete.loading"
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.action">
            <span>{{ confirmDelete.actionLabel }}</span>
          </button>
        </div>
      </div>
    </BaseDialog>
    <BaseFilterDialog ref="newCarsFilter"/>
  </div>
</template>

<script>
import BaseText from "./BaseText.vue";
import BaseChip from "./BaseChip.vue";
import BaseDialog from "./BaseDialog.vue";
import BaseGameTag from "./BaseGameTag.vue";
import BaseCard from "./BaseCard.vue";
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
    BaseGameTag
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
      tyres: [],
      surfaces: {}
    }
  },
  watch: {},
  beforeMount() {
    // this.getIncomingCars();
    // this.newCarBackup = JSON.parse(JSON.stringify(this.newCar));
  },
  mounted() {
    // this.searchFilters = this.$refs.newCarsFilter.$data.searchFilters;
    // this.refreshPhotos();
    // this.$store.commit("START_LOGROCKET", {});
    // this.debounceFilter = Vue.debounce(this.changeFilter, 500);
  },
  computed: {
    valid() {
      if (!this.newCar.rq) return false;
      if (!this.newCar.brand) return false;
      if (!this.newCar.onlyName) return false;
      if (!this.newCar.country) return false;
      if (!this.newCar.year) return false;
      // if (!this.newCar.clearance) return false;
      if (!this.newCar.topSpeed) return false;
      if (!this.newCar.acel) return false;
      if (!this.newCar.hand) return false;
      if (!this.newCar.drive) return false;
      if (!this.newCar.tyres) return false;
      // if (!this.newCar.weight) return false;
      // if (!this.newCar.color) return false;
      // if (!this.newCar.fuel) return false;
      // if (!this.newCar.seats) return false;
      // if (!this.newCar.engine) return false;
      if (!this.newCar.photoId.src) return false;
      if (this.newCar.tags.length === 0) return false;
      // if (this.newCar.bodyTypes.length === 0) return false;
      return true;
    },
    filteredIncomingCars() {
      if (this.searchInputLazy === "") return this.incomingCars;

      let strIndex = -1;
      let searchStr = this.searchInputLazy.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let result = [];
      let shouldPush = false;
      let prePush;

      this.incomingCars.map((x, ix) => {
        strIndex = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(searchStr);

        if (strIndex > -1) {
          prePush = JSON.parse(JSON.stringify(x));
          prePush.locatedName = x.name.substr(0, strIndex)+'<b>'+x.name.substr(strIndex, searchStr.length)+'</b>'+x.name.substr(strIndex + searchStr.length);
          prePush.locatedIndex = strIndex;
          if (x.name[strIndex - 1] === ' ') {
            prePush.locatedPlus = true;
          }

          result.push(prePush)
        }
      })

      result.sort(function(a, b) {
        if (a.locatedPlus && !b.locatedPlus) return -1;
        if (b.locatedPlus && !a.locatedPlus) return 1;
        return a.locatedIndex - b.locatedIndex;
      });

      return result;
    }
  },
  methods: {
    reset() {
      this.newCar = JSON.parse(JSON.stringify(this.newCarBackup));
    },
    askReset() {
      let vm = this;

      let action = function() {
        vm.reset();
        vm.confirmDelete.dialog = false;
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Confirm reset?`,
        actionLabel: `Reset`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    submit(isPreview = false) {
      let result = JSON.parse(JSON.stringify(this.newCar));



      if (result.abs === null) result.abs = false;
      if (result.tcs === null) result.tcs = false;
      if (result.prize === null) result.prize = false;
      if (result.acel === "N/A") result.acel = null;
      if (result.photoId.filename) result.photoId = result.photoId.filename;

      if (!result.clearance) result.clearance = "?";
      if (!result.weight) result.weight = "?";
      if (!result.fuel) result.fuel = "?";
      if (!result.seats) result.seats = "?";
      if (!result.engine) result.engine = "?";

      Object.keys(this.textTypes).map(key => {
        if (this.textTypes[key] !== "normal" && key !== "seats" && result[key] !== "?") {
          result[key] = Number(result[key]);
        }
      })

      if (result.mra === 0) result.mra = null;
      if (result.acel === 0) result.acel = null;
      if (result.color) result.tags.push(result.color);
      delete result.color;

      console.log(result);

      if (isPreview) {
        result.name = `${result.brand} ${result.onlyName}`
        this.previewCar = result;
        this.previewDialogActive = true;
        return
      }

      // lets submit
      this.loading = true;

      axios.post(Vue.preUrl + "/updateNewCar", result)
      .then(res => {
        this.previewDialogActive = false;
        this.getIncomingCars();
        this.reset();
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
        });
        
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.loading = false;
      });
    },
    getIncomingCars() {
      this.incomingCarsLoading = true;

      axios.get(Vue.preUrl + "/getNewCars")
      .then(res => {
        this.incomingCarsLoading = false;
        this.incomingCars = res.data.value;
        this.incomingCars.sort((a, b) => {
          if (a.rq === b.rq) {
            return a.rid.localeCompare(b.rid)
          } else {
            return a.rq  - b.rq 
          }
        })
        try {
          this.incomingCars.map(car => {
            car.percent = this.howMuchPercentDone(car);
            car.classColor = Vue.resolveClass(car.rq, car.class, "color");
            car.photoCalc = require('@/incoming_pics/' + car.photoId + '.jpg')
          })
        } catch (error) {
          
        }
        // console.log(res.data);
      })
      .catch(error => {
        this.incomingCarsLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    carListClick(car, e) {
      if (e && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        this.carAskDelete(car);
      } else {
        this.carAskLoad(car);
      }
      
    },
    carAskLoad(car) {
      let vm = this;

      let action = function() {
        vm.reset();
        vm.newCar = {
          ...vm.newCar,
          ...car
        }
        delete vm.newCar.percent;
        delete vm.newCar.classColor;
        delete vm.newCar.locatedName;
        delete vm.newCar.locatedIndex;
        delete vm.newCar.locatedPlus;
        vm.refreshPhotos();

        const illustrations = require.context(
          '@/incoming_pics',
          true,
          /^.*\.jpg$/
        )

        let photos;
        let photosKeys = illustrations.keys();
        photos = photosKeys.map(illustrations);
        photos = photos.map((x, index) => {
          return {
            src: x,
            filename: photosKeys[index].substr(2).slice(0, -4)
          }
        })
        vm.newCar.photoId = photos.find(x => x.filename === vm.newCar.photoId);
        vm.confirmDelete.dialog = false;

        let color;
        vm.newCar.tags.map(tag => {
          vm.typesList.color.map(colorOption => {
            if (tag === colorOption) {
              color = tag;
            }
          })
        })
        vm.newCar.tags = vm.newCar.tags.filter(tag => tag !== color);
        vm.newCar.color = color;

        
        
        // console.log(vm.newCar);
        // console.log(newCar);
        // vm.newCar = newCar;
        
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Load "${car.rid}"?`,
        actionLabel: `Load`,
        action: action,
        loading: false,
        classe: `D_ButtonGreen`
      }
    },
    carAskDelete(car) {
      let vm = this;

      let action = function() {
        vm.confirmDelete.loading = true;

        axios.post(Vue.preUrl + "/updateNewCar", {
          ...car,
          isDelete: true
        })
        .then(res => {
          vm.confirmDelete.dialog = false;
          vm.getIncomingCars();
        })
        .catch(error => {
          console.log(error);
          vm.$store.commit("DEFINE_SNACK", {
            active: true,
            error: true,
            text: error,
            type: "error"
          });
        })
        .then(() => {
          vm.confirmDelete.loading = false;
        });
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete "${car.rid}"?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    refreshPhotos() {
      const illustrations = require.context(
        '@/incoming_pics',
        true,
        /^.*\.jpg$/
      )
      let photos;
      let photosKeys = illustrations.keys();
      photos = photosKeys.map(illustrations);
      photos = photos.map((x, index) => {
        return {
          src: x,
          filename: photosKeys[index].substr(2).slice(0, -4)
        }
      })
      let brandName = (this.newCar.brand || "").normalize('NFD').replace(/\p{Diacritic}/gu, "").replaceAll(" ", "_").replace(/[^\w]/g,'');
      photos = photos.filter(x => {
        if (x.filename.normalize('NFD').replace(/\p{Diacritic}/gu, "").replaceAll(" ", "_").replace(/[^\w]/g,'').includes(brandName)) return true;
      })
      if (this.incomingCars.length > 0) {
        photos.map(x => {
          if (this.incomingCars.find(y => y.photoId === x.filename)) {
            x.inUse = true;
          } else {
            x.inUse = false;
          }
        })
      }
      // console.log(photos[0]);
      this.photos = photos;
    },
    changedChip(key, item) {
      if (key === "brand" && this.newCar.brand) {
        this.refreshPhotos();
      }
    },
    howMuchPercentDone(car) {
      let amount = 0;
      if (car.clearance && car.clearance !== "?") amount++;
      if (car.weight && car.weight !== "?") amount++;
      if (car.fuel && car.fuel !== "?") amount++;
      if (car.seats && car.seats !== "?") amount++;
      if (car.engine && car.engine !== "?") amount++;
      if (car.bodyTypes.length > 0) amount++;

      let hasColor = false;
      car.tags.map(tag => {
        this.typesList.color.map(colorOption => {
          if (tag === colorOption) {
            hasColor = true;
          }
        })
      })
      if (hasColor) amount++;


      let result = 50 + (amount * 7);
      if (result === 99) result = 100;
      return result;
    },
    searchInputFunc(e) {
      this.debounceFilter();
    },
    changeFilter() {
      this.searchInputLazy = this.searchInput;
    }
  },
}
</script>

<style>
.MainCheatSheet_Layout {
  padding: 20px;
}
.MainCheatSheet_Layout .BaseText_Input {
  margin-top: 0px;
}
.MainCheatSheet_Header {
  text-align: center;
  margin: 50px 0 50px 0;
  font-size: 30px;
}
.MainCheatSheet_Box {

}
.MainTranslate_Logo {
  width: 210px;
  margin: 0 auto;
}
.MainCheatSheet_FormBox {
  max-width: 600px;
  margin: 0 auto;
  font-size: 15px;
  margin-bottom: 40px;
}
.MainCheatSheet_FormItem {
  margin-bottom: 30px;
}
.MainCheatSheet_FormTitleAlert {
  color: rgb(var(--d-text-red));
  text-align: right;
}
.MainCheatSheet_FormTitleResult {
  text-align: right;
}
.MainCheatSheet_FormTitleGreen {
  color: rgb(var(--d-text-green));
}
.MainCheatSheet_FormChipsBox {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.MainCheatSheet_integer,
.MainCheatSheet_topSpeed,
.MainCheatSheet_acel,
.MainCheatSheet_hand,
.MainCheatSheet_mra,
.MainCheatSheet_integer {
  max-width: 200px;
}
.MainCheatSheet_Submit {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.MainCheatSheet_SelectPhoto {
  font-size: 18px;
}
.MainCheatSheet_PhotosBox {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.MainCheatSheet_PhotosChip {
  width: 170px;
  height: 117px;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}
.MainCheatSheet_PhotosChip .BaseChip_Text {
  display: contents;
}
.MainCheatSheet_PhotosChip.D_ButtonActive {
  box-shadow: 0px 0px 0px 3px rgb(var(--d-text-green));
}
.MainCheatSheet_PhotoDiv {
  display: flex;
}
.MainCheatSheet_PhotoImg {
  width: 100%;
  transform: scale(1.3) translate(15px, -7px);
}
.MainCheatSheet_SearchLayout {
  max-width: 600px;
  margin: 0 auto;
  margin-top: 30px;
}
.MainCheatSheet_ListNewCarsBox {
}
.MainCheatSheet_ListNewCars {
  max-width: 600px;
  height: 300px;
  margin: 0 auto;
  overflow-y: scroll;
  background-color: rgba(0,0,0,0.2);
  padding: 10px;
  box-sizing: border-box;
}
.MainCheatSheet_ListCar {
  width: auto;
}
.MainCheatSheet_ListLoading {
  text-align: center;
}
.MainCheatSheet_ListCarPercent {
  font-size: .6em;
  box-shadow: 0 0 0 2px #0003;
  background-color: #0003;
  padding: 1px 3px;
  margin-left: 7px;
  margin-right: 2px;
}
.MainCheatSheet_ListCarPercent100 {
  box-shadow: 0 0 0 2px #9dff0059;
  background-color: #9dff0059;
  color: white;
}
.MainCheatSheet_PhotoInUse {
  background-color: black;
  opacity: 1 !important;
}
.MainCheatSheet_PhotoInUse .MainCheatSheet_PhotoImg {
  opacity: 0.4;
}
.MainCheatSheet_PhotoInUseText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 39px;
  color: white;
}
.MainCheatSheet_FormTitle {
  margin-bottom: 5px;
  color: rgba(var(--d-text-yellow), 0.8);
}
</style>