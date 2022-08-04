<template>
  <div :class="{ Main_2: inverted, Main_Compact: compact }" class="Main_Layout">
    <div :class="{ Main_BodyEmpty: carDetailsList.length === 0 }" class="Main_Body" @click.stop>
      <div class="Main_Backtop"></div>
      <div class="Main_Corner">
        <div class="Main_Logo">
          <div class="Main_LogoPre">Top Drives</div>
          <Logo />
        </div>
        <div class="Main_CornerMid">
          <button class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="optionsDialogActive = true;">
            <i class="ticon-3menu Main_MenuIcon" aria-hidden="true"/>
          </button>
          <button v-if="carDetailsList.length > 0 && currentTracks.length > 0" class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonMenu" @click="shareDialog = true; generateUrl()">
            <i class="ticon-camera1 Main_MenuIcon" aria-hidden="true"/>
          </button>
        </div>
        <div v-if="user && inverted" class="Main_PrintBy">
          <div class="Main_PrintByLabel">print by</div>
          <div class="Main_PrintByUser">{{ user.username }}</div>
        </div>
      </div>
      <div class="Main_Left">
        <div class="Main_TrackList">
          <Row 
            v-for="n in temp"
            :temp="temp"
            :list="currentTracks"
            :hoverIndex="hoverIndex"
            :loggedin="!!user"
            :user="user"
            :needSave="needSave"
            :saveLoading="saveLoading"
            type="tracks">
            <template slot="corner">
              <div v-if="carDetailsList.length > 0 && currentTracks.length > 0" class="Main_RowCorner">
                <template v-if="!user">
                  <div class="Main_SaveAllBox">
                    <button
                      class="D_Button Main_LoginToEdit"
                      @click="$router.push({ name: 'Login' })">Login to edit</button>
                  </div>
                </template>
                <template v-else-if="!!user && needSave">
                  <div class="Main_SaveAllBox">
                    <button
                      :class="{ D_Button_Loading: saveLoading }"
                      class="D_Button Main_SaveAllButton"
                      @click="saveAll()">Save</button>
                  </div>
                </template>
                <!-- <template v-else-if="carDetailsList.length > 0 && currentTracks.length > 0">
                  <div class="Main_SaveAllBox">
                    <button
                      class="D_Button Main_Share"
                      @click="sharePrint()">Share</button>
                  </div>
                </template> -->
                <div v-if="user && !inverted" class="Main_PrintBy">
                  <div class="Main_PrintByLabel">print by</div>
                  <div class="Main_PrintByUser">{{ user.username }}</div>
                </div>
              </div>
            </template>
          </Row>
        </div>
        <div v-if="user && !inverted" class="Main_UserBottom">

          <div class="Main_UserCard">
            <BaseAvatar :user="user" size="46px" />
            <div class="Main_UserBlock">
              <div style="color: var(--d-text-b);" class="Main_UserName">{{ user.username }}</div>
              <button style="font-size: 16px;" class="D_Button D_ButtonLink Main_UserLogout" @click="logout()">Logout</button>
            </div>
          </div>

        </div>
      </div>
      <div v-if="carDetailsList.length > 0" class="Main_Mid">
        <div class="Main_CarList" @click.stop @mouseleave="hoverIndex = -1">
          <template v-for="(car, carIx) in carDetailsList">
            <Car
              :temp="temp"
              :car="car"
              :index="carIx"
              :lastIndex="carDetailsList.length - 1"
              :trackList="currentTracks"
              :highlights="highlights[carIx]"
              :hoverIndex="hoverIndex"
              :maxCarNumber="maxCarNumber"
              :loggedin="!!user"
              :user="user"
              :downloadLoading="downloadLoading"
              @delete="deleteCar(carIx)"
              @newindex="newIndex($event)" />
          </template>
          <Car
            v-if="carDetailsList.length < maxCarNumber"
            index="addCar"
            class="Car_LayoutAddCar"
            :car="null"
            :maxCarNumber="maxCarNumber"
            @add="openDialogSearch()" />
        </div>
      </div>
      <div v-else class="Main_MidEmpty">
        <div v-if="!user" class="Main_MidEmptyTitle">Let's start with...</div>
        <div class="Main_MidEmptyInner">
          <div v-if="!user" class="Main_MidEmptyItem">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButton"
              @click="$router.push({ name: 'Login' })">Login</button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButton"
              @click="$router.push({ name: 'Register' })">Register</button>
          </div>
          <div class="Main_MidEmptyItem Main_MidEmptyItemAdd">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2 Main_MidEmptyButtonSearch"
              @click="openDialogSearch()">
              <i class="ticon-plus_2 Main_EmptyAddIcon" aria-hidden="true"/>
              <div class="Main_EmptyAdd">Search car</div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <BaseDialog
      :active="searchActive"
      :transparent="true"
      maxWidth="880px"
      @close="closeDialogSearch()">
      <div class="Main_SearchBody">
        <div class="Main_SearchHeader">
          <input
            v-model="searchInput"
            id="SearchInput"
            placeholder="Search"
            class="Main_SearchInput"
            type="text"
            @focus="searchFocus = true;"
            @blur="searchBlur()"
            @input="searchInputFunc($event)">
        </div>
        <div v-if="searchResult.length > 0" class="Main_SearchMid">
          <div v-if="showingLastest" class="Main_SearchLastestTitle">Last contributions</div>
          <template v-for="(item, index) in searchResult">
            <button
              v-if="index < searchMax"
              :style="{ '--color': item.classColor }"
              :class="{ Main_SearchItemAdded: item.added }"
              class="Main_SearchItem"
              @click="item.added ? '' : addCar(index)">
              <div class="Main_SearchItemImg">
                <img :src="item.ridPhoto" class="MainGallery_Img" alt="">
              </div>
              <div class="Main_SearchItemLeft">{{ item.class }}{{ item.rq }}</div>
              <div class="Main_SearchItemRight">
                <span v-html="item.locatedName" />&nbsp;<span class="Main_SearchItemYear">{{ item.year }}</span>&nbsp;<span v-if="item.lastestUser" class="Main_SearchResultUser">by {{ item.lastestUser }}</span><span v-else-if="item.mra" class="Main_SearchItemYear">{{ item.mra }}</span>
              </div>
            </button>
          </template>
          <button
            v-if="searchMax === 20 && searchResult.length > 20"
            class="D_Button D_ButtonDark D_ButtonDark2 Main_SearchMore"
            @click="searchMax = 100">Show more</button>
        </div>
        <div v-else-if="alreadySearched" class="Main_SearchEmpty">
          <i class="ticon-search_big Main_SearchEmptyAddIcon" aria-hidden="true"/>
          <div class="Main_SearchEmptyText">Nothing found</div>
        </div>
        <div v-else class="Main_SearchEmpty">
          <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="tuneDialogActive"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="closeTune()">
      <div class="Main_TuneDialog">
        <portal-target
          slim
          name="tunedialog"/>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="shareDialog"
      :transparent="false"
      max-width="420px"
      min-width="240px"
      @close="shareDialog = false;">
      <div class="Main_ShareDialog">
        <div class="Main_DialogTitle">Image</div>
        <div class="Main_ShareDownloadBox">
          <button
            style="font-size: 16px;"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="sharePrint()">
            <i class="ticon-download D_ButtonIcon" aria-hidden="true"/>
            <span>Download PNG</span>
          </button>
        </div>
        <div class="Main_DialogTitle">Share link</div>
        <div class="Main_ShareLinkBox">
          <textarea
            v-model="shareUrl"
            id="shareLinkField"
            rows="6"
            class="Main_ShareLinkInput"
            readonly="readonly" />
          <button
            :class="{ D_Button_Correct: copyUrlSucess }"
            :disabled="copyUrlSucess"
            style="font-size: 16px;"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="copyUrl()">Copy</button>
        </div>
      </div>
    </BaseDialog>
    <BaseDialog
      :active="optionsDialogActive"
      :transparent="false"
      max-width="400px"
      @close="updateOptions()">
      <div class="Main_OptionsDialog">
        <div v-if="user" class="Main_OptionsItem" style="display: flex;justify-content: center;">
          <div class="Main_UserCard">
            <BaseAvatar :user="user" size="46px" />
            <div class="Main_UserBlock">
              <div style="color: var(--d-text-b);" class="Main_UserName">{{ user.username }}</div>
              <button style="font-size: 16px;" class="D_Button D_ButtonLink Main_UserLogout" @click="logout()">Logout</button>
            </div>
          </div>
        </div>
        <div v-else class="Main_OptionsItem Main_OptionsLogout">
          <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2" @click="$router.push({ name: 'Login' })">Login</button>
          <button style="font-size: 16px;" class="D_Button D_ButtonDark D_ButtonDark2" @click="$router.push({ name: 'Register' })">Register</button>
        </div>
        <div class="Main_OptionsItem">
          <div class="Main_OptionsLabel">Trackset</div>
          <div class="Main_OptionsButtons">
            <button
              v-for="item in tracksButtons"
              :class="{ D_ButtonActive: item.active }"
              class="D_Button Main_OptionsButton"
              @click="stringToggleTrackSet(item.set)">{{ item.name }}</button>
          </div>
        </div>
        <div class="Main_OptionsItem">
          <div class="Main_OptionsLabel">Display</div>
          <div class="Main_OptionsButtons">
            <button :class="{ D_ButtonActive: !inverted && !compact }" class="D_Button Main_OptionsButton" @click="display('horizontal')">
              <i class="ticon-list Main_OptionsIcon" aria-hidden="true"/>
            </button>
            <button :class="{ D_ButtonActive: !inverted && compact }" class="D_Button Main_OptionsButton" @click="display('horizontal2')">
              <i class="ticon-list Main_OptionsIcon" style="transform: scaleX(0.5);" aria-hidden="true"/>
            </button>
            <button :class="{ D_ButtonActive: inverted }" class="D_Button Main_OptionsButton" @click="display('vertical')">
              <i class="ticon-list Main_OptionsIcon" style="transform: rotate(90deg)" aria-hidden="true"/>
            </button>
          </div>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import Car from './Car.vue'
import Row from './Row.vue'
import Loading from './Loading.vue'
import BaseDialog from './BaseDialog.vue'
import Logo from './Logo.vue'
import BaseAvatar from './BaseAvatar.vue'
import data_cars from '../database/cars_final.json'
import LogRocket from 'logrocket';
import html2canvas from 'html2canvas';
import reimg from 'reimg';

export default {
  name: 'Main',
  components: {
    Car,
    Row,
    BaseDialog,
    Loading,
    Logo,
    BaseAvatar
  },
  data() {
    return {
      unsubscribe: null,
      inverted: false,
      compact: false,
      temp: 1,
      searchInput: '',
      searchActive: false,
      nextId: 0,
      searchFocus: false,
      debounceFilter: null,
      searchLoading: false,
      searchMax: 20,
      searchResult: [],
      showingLastest: false,
      maxCarNumber: 12,
      alreadySearched: false,
      shareDialog: false,
      tuneDialogActive: false,
      optionsDialogActive: false,
      printImageDialog: false,
      hoverIndex: -1,
      user: null,
      needSave: false,
      saveLoading: false,
      downloadLoading: false,
      shareUrl: null,
      copyUrlSucess: false,
      // carDetailsList: default_cars,
      carDetailsList: [],
      all_cars: data_cars,
      toLoadTrackSet: null,
      currentTracks: [],
      currentTracksSetsNames: [],
      tracksButtons: [
        { name: "Dry Twisty", set: "trackSet_DryTwisty", active: false },
        { name: "Dry City", set: "trackSet_DryCity", active: false },
        { name: "Dry Drag", set: "trackSet_DryDrag", active: false },
        { name: "Wet Twisty", set: "trackSet_WetTwisty", active: false },
        { name: "Wet City", set: "trackSet_WetCity", active: false },
        { name: "Dirt", set: "trackSet_Dirt", active: false },
        { name: "Wet Dirt", set: "trackSet_WetDirt", active: false },
        { name: "Gravel", set: "trackSet_Gravel", active: false },
        { name: "Sand", set: "trackSet_Sand", active: false },
        { name: "Snow", set: "trackSet_Snow", active: false },
        { name: "Ice", set: "trackSet_Ice", active: false },
      ],
      trackSet_DryTwisty: [
        { name: "Car Park", id: "carPark", surface: 0, cond: 0 },
        { name: "G-Force Test", id: "gForce", surface: 0, cond: 0 },
        { name: "Hairpin Road", id: "hairpin", surface: 0, cond: 0 },
        { name: "Indoor Karting", id: "indoorKart", surface: 0, cond: 0 },
        { name: "Karting Circuit", id: "kart", surface: 0, cond: 0 },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 0 },
        { name: "Twisty Circuit", id: "tCircuit", surface: 0, cond: 0 },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 0 },
        { name: "Fast Circuit", id: "fast", surface: 0, cond: 0 },
      ],
      trackSet_DryCity: [
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 0 },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 0 },
      ],
      trackSet_DryDrag: [
        { name: "1/4 Mile", id: "mile4", surface: 0, cond: 0 },
        { name: "1/2 Mile", id: "mile2", surface: 0, cond: 0 },
        { name: "1 Mile", id: "mile1", surface: 0, cond: 0 },
        { name: "0-100mph", id: "drag100", surface: 0, cond: 0 },
        { name: "0-150mph", id: "drag150", surface: 0, cond: 0 },
        { name: "Hill Climb", id: "hClimb", surface: 0, cond: 0 },
        { name: "Test Bowl", id: "testBowl", surface: 0, cond: 0 },
      ],
      trackSet_WetTwisty: [
        { name: "Car Park", id: "carPark", surface: 0, cond: 1 },
        { name: "G-Force Test", id: "gForce", surface: 0, cond: 1 },
        { name: "Hairpin Road", id: "hairpin", surface: 0, cond: 1 },
        { name: "Karting Circuit", id: "kart", surface: 0, cond: 1 },
        { name: "Slalom Test", id: "slalom", surface: 0, cond: 1 },
        { name: "Twisty Circuit", id: "tCircuit", surface: 0, cond: 1 },
        { name: "Twisty Road", id: "tRoad", surface: 0, cond: 1 },
        { name: "Fast Circuit", id: "fast", surface: 0, cond: 1 },
      ],
      trackSet_WetCity: [
        { name: "City Streets Small", id: "csSmall", surface: 0, cond: 1 },
        { name: "City Streets Medium", id: "csMed", surface: 0, cond: 1 },
      ],
      trackSet_Dirt: [
        { name: "1 Mile", id: "mile1", surface: 1, cond: 0 },//
        { name: "Hill Climb", id: "hClimb", surface: 1, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 1, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 0 },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 1, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 0 },//
        { name: "Motocross Track", id: "moto", surface: 1, cond: 0 },//
      ],
      trackSet_WetDirt: [
        { name: "1/4 Mile", id: "mile4", surface: 1, cond: 1 }, //
        { name: "1/2 Mile", id: "mile2", surface: 1, cond: 1 }, //
        { name: "Hill Climb", id: "hClimb", surface: 1, cond: 1 },//
        { name: "G-Force Test", id: "gForce", surface: 1, cond: 1 },//
        { name: "Twisty Road", id: "tRoad", surface: 1, cond: 1 },//
        { name: "Slalom Test", id: "slalom", surface: 1, cond: 1 },//
        { name: "Motocross Track", id: "moto", surface: 1, cond: 1 },//
      ],
      trackSet_Gravel: [
        { name: "1/4 Mile", id: "mile4", surface: 2, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 2, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 2, cond: 0 },//
        { name: "Hill Climb", id: "hClimb", surface: 2, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 2, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 2, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 2, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 2, cond: 0 },//
      ],
      trackSet_Sand: [
        { name: "1/4 Mile", id: "mile4", surface: 5, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 5, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 5, cond: 0 },//
        { name: "Hill Climb", id: "hClimb", surface: 5, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 5, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 5, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 5, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 5, cond: 0 },//
      ],
      trackSet_Snow: [
        { name: "1/4 Mile", id: "mile4", surface: 6, cond: 0 },//
        { name: "1/2 Mile", id: "mile2", surface: 6, cond: 0 },//
        { name: "1 Mile", id: "mile1", surface: 6, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 6, cond: 0 },//
        { name: "Hairpin Road", id: "hairpin", surface: 6, cond: 0 },//
        { name: "Twisty Road", id: "tRoad", surface: 6, cond: 0 },//
        { name: "Twisty Circuit", id: "tCircuit", surface: 6, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 6, cond: 0 },//
      ],
      trackSet_Ice: [
        { name: "1/4 Mile", id: "mile4", surface: 3, cond: 0 },//
        { name: "G-Force Test", id: "gForce", surface: 3, cond: 0 },//
        { name: "Slalom Test", id: "slalom", surface: 3, cond: 0 },//
      ],

      carList: [],
      //          0         1         2         3       4       5       6
      surfaces: ["Asphalt", "Dirt", "Gravel", "Ice", "Mixed", "Sand", "Snow"],
      conds: ["Dry", "Wet"],
      //      0       1      2      3
      tunes: ["332", "233", "323", "111"]
    }
  },
  watch: {},
  beforeMount() {
    // let dupCouts = {};
    // this.all_cars.map((x, ix) => {
    //   dupCouts[`${x.name} ${x.year}`] = ++dupCouts[`${x.name} ${x.year}`] || 0;
    // })
    // console.log(this.all_cars.filter(x => dupCouts[`${x.name} ${x.year}`]));
    // debugger;
    // nome ideal: `${x.rq} ${x.name} ${x.year}`.replaceAll(" ","")

    // this.all_cars.map(x => {
    //   x.rid = `${x.rq} ${x.name} ${x.year}`.replaceAll(" ","_")
    // })
    // console.log(this.all_cars);
    // debugger;

    let display = window.localStorage.getItem("display");
    if (display) {
      this.display(display);
    }

    let allTracks = [];
    this.tracksButtons.map(x => {
      if (this[x.set]) {
        this[x.set].map(y => {
          if (!allTracks.includes(y)) {
            allTracks.push(y);
          }
        })
      }
    })
    

    if (this.$route.query && this.$route.query.share && this.$route.query.share.includes("~")) {
      // from query string

      let carsFromQuery = [];
      let tracksFromQuery = [];

      this.$route.query.share.split("~").map(x => {
        if (x[0] === "C") {
          carsFromQuery.push({ // car
            rid: x.substr(1)
          })
        } else if (x[0] === "T") {
          carsFromQuery[carsFromQuery.length-1].selectedTune = x.substr(1); // tune last car
        } else if (x[0] === "K") {
          tracksFromQuery.push({ // track
            id: x.substr(0,x.indexOf("_a")).substr(1),
            surface: x.substr(x.indexOf("_a")+2,1),
            cond: x.substr(x.indexOf("_a")+3,1)
          })

        }
      })

      let tracksClear = [];
      tracksFromQuery.map(x => {
        allTracks.find(y => {
          if (x.id === y.id && x.surface == y.surface && x.cond == y.cond) {
            tracksClear.push(y);
            return true;
          }
        })
      })
      this.pushTrackSet(tracksClear);
      this.prepareCars(carsFromQuery);

    } else {
      // from local storage

      let tracks = window.localStorage.getItem("tracks");
      let tracksClear = [];
      if (tracks) {
        tracks = JSON.parse(tracks);
        // console.log(tracks.map(x => x.id));
        tracks.map(x => {
          allTracks.find(y => {
            if (JSON.stringify(x) === JSON.stringify(y)) {
              tracksClear.push(x);
              return true;
            }
          })
        })
        // console.log(tracksClear);
        this.pushTrackSet(tracksClear);
      }
      if (this.currentTracks.length === 0) {
        this.pushTrackSet(this.trackSet_DryTwisty);
      }
  
      let cars = window.localStorage.getItem("cars");
      if (cars) {
        this.prepareCars(JSON.parse(cars));
      }
    }


    
  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500); 

    this.getUser();

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_TIME") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        let NEW = mutation.payload.item;

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].times) Vue.set(car.data[car.selectedTune], "times", {});
        /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
        /**/ if (!car.dataToSave[car.selectedTune]) Vue.set(car.dataToSave, car.selectedTune, {});
        /**/ if (!car.dataToSave[car.selectedTune].times) Vue.set(car.dataToSave[car.selectedTune], "times", {});

        Vue.set(car.data[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        /**/ Vue.set(car.dataToSave[car.selectedTune].times, [`${NEW.id}_a${NEW.surface}${NEW.cond}`], mutation.payload.number);
        if (!car.users || !car.users.includes(vm.user.username)) {
          Vue.set(car, "users", car.users && car.users.length > 0 ? [...car.users, vm.user.username] : [vm.user.username]);
        }
        vm.needSave = true;
      }

      if (mutation.type == "CHANGE_TUNE") {
        // console.log(vm.carDetailsList.map(x => x.softId));
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
        Vue.set(car, "selectedTune", mutation.payload.tune);
        this.updateCarLocalStorage();
      }

      if (mutation.type == "CHANGE_STAT") {
        let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);

        if (!car.data) Vue.set(car, "data", {});
        if (!car.data[car.selectedTune]) Vue.set(car.data, car.selectedTune, {});
        if (!car.data[car.selectedTune].info) Vue.set(car.data[car.selectedTune], "info", {});
        /**/ if (!car.dataToSave) Vue.set(car, "dataToSave", {});
        /**/ if (!car.dataToSave[car.selectedTune]) Vue.set(car.dataToSave, car.selectedTune, {});
        /**/ if (!car.dataToSave[car.selectedTune].info) Vue.set(car.dataToSave[car.selectedTune], "info", {});

        Vue.set(car.data[car.selectedTune].info, mutation.payload.type, mutation.payload.value);
        /**/ Vue.set(car.dataToSave[car.selectedTune].info, mutation.payload.type, mutation.payload.value);
        vm.needSave = true;
      }

      if (mutation.type == "SHOW_TUNE") {
        if (mutation.payload) {
          vm.tuneDialogActive = true;
        }
      }

      if (mutation.type == "HOVER_INDEX") {
        if (mutation.payload) {
          vm.hoverIndex = mutation.payload;
        }
      }

    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    highlights() {
      let vm = this;
      let result = [];
      let sortedByTracks = {};

      // result length = number of cars
      this.carDetailsList.map(x => {
        result.push({});
      });

      // insert every type of track in both result && sortedByTracks
      this.currentTracks.map((x, ix) => {
        sortedByTracks[`${x.id}_a${x.surface}${x.cond}`] = [];
        result.map(y => {
          y[`${x.id}_a${x.surface}${x.cond}`] = null;
        })
      });
      
      // insere os times de cada carro em suas respectivas trackId
      this.carDetailsList.map(x => {
        if ( x.selectedTune && x.data && x.data[x.selectedTune] && x.data[x.selectedTune].times ) {
          Object.keys( x.data[x.selectedTune].times ).forEach(function (trackId) {
            if (sortedByTracks[trackId]) {
              sortedByTracks[trackId].push(x.data[x.selectedTune].times[trackId]);
            }
          });
        }
      });

      // dá sort nos times e remove duplicates
      Object.keys( sortedByTracks ).forEach(function (trackId) {
        sortedByTracks[trackId].sort(function(a, b) {
          if (trackId.includes('testBowl')) return b - a;
          if (a === 0) return 9999999;
          if (b === 0) return -9999999;
          return a - b;
        });
        sortedByTracks[trackId] = [...new Set(sortedByTracks[trackId])];
      });

      // preenche result com seus respectivos ranking
      let tempValue;
      result.map((x, ix) => {
        Object.keys( x ).forEach(function (trackId) {
          if (
            vm.carDetailsList[ix].data &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune] &&
            vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times
            ) {
            tempValue = vm.carDetailsList[ix].data[vm.carDetailsList[ix].selectedTune].times[trackId];
            x[trackId] = sortedByTracks[trackId].indexOf(tempValue);
          }
        });
      })

      // console.log(result);
      // console.log(sortedByTracks);
      // debugger;

      return result;
    },
  },
  methods: {
    // calcCurrentTracks() {
    //   let result = [];

    //   if (this.toLoadTrackSet !== null) {
    //     result = JSON.parse(JSON.stringify(this.toLoadTrackSet));
    //     this.toLoadTrackSet = null;
    //     this.currentTrackSet = result;
    //   }

    //   this.activeTrackSet.map(x => {
    //     if (this[x]) {
    //       this[x].map(y => {
    //         result.push(y)
    //       })
    //     }
    //   })

    //   window.localStorage.setItem('trackset', JSON.stringify(result));
    //   this.currentTrackSet = result;
    // },

    pushTrackSet(trackset) {
      let index;
      trackset.map(x => {
        index = this.indexOfTrack(x);
        if (index === -1) {
          this.currentTracks.push(x)
        }
      })
      this.verifyActiveButtons();
    },
    removeTrackSet(trackset) {
      let index;
      trackset.map(x => {
        index = this.indexOfTrack(x);
        if (index > -1) {
          this.currentTracks.splice(index, 1);
        }
      })
      this.verifyActiveButtons();
    },
    toggleTrackSet(trackset) {
      let incluedesAll = this.includeAllTracks(trackset);
      
      if (incluedesAll && this.currentTracks.length >= trackset.length) {
        this.removeTrackSet(trackset);
      } else {
        this.removeTrackSet(trackset);
        this.pushTrackSet(trackset);
      }
    },
    stringToggleTrackSet(str) {
      this.toggleTrackSet(this[str])
    },
    indexOfTrack(x) {
      return this.currentTracks.findIndex(y => {
        if (`${x.id}_a${x.surface}${x.cond}` === `${y.id}_a${y.surface}${y.cond}`) {
          return true
        }
      });
    },
    includeAllTracks(trackset) {
      let incluedesAll = true;
      let index;
      trackset.map(x => {
        index = this.currentTracks.findIndex(y => {
          if (`${x.id}_a${x.surface}${x.cond}` === `${y.id}_a${y.surface}${y.cond}`) {
            return true
          }
        });
        if (index === -1) incluedesAll = false;
      })
      return incluedesAll;
    },
    verifyActiveButtons() {
      this.tracksButtons.map(x => {
        if (this.includeAllTracks(this[x.set])) {
          x.active = true;
        } else {
          x.active = false;
        }
      })
    },
    updateOptions() {
      this.optionsDialogActive = false;
      window.localStorage.setItem('tracks', JSON.stringify(this.currentTracks));
    },
    toggleSize() {
      this.inverted = !this.inverted;
      return
      if (this.carDetailsList.length > 2) {
        this.carDetailsList = this.carDetailsList.filter((x, ix) => ix < 2)
      } else {
        Array.from(Array(10)).map((_, i) => {
          this.carDetailsList.push(this.carDetailsList[1]);
        });
      }
      // if (this.temp === 1) {
      //   this.temp = 4;
      // } else {
      //   this.temp = 1;
      // }
    },
    deleteCar(index) {
      this.carDetailsList = this.carDetailsList.filter((x, ix) => ix !== index);
      this.updateCarLocalStorage();
      this.tuneDialogActive = false;
    },
    openDialogSearch() {
      this.searchActive = true;
      setTimeout(() => {
        document.querySelector("#SearchInput").focus();
      }, 10);
      if (this.searchInput && this.searchInput.length > 0) {
        this.changeFilter();
      }
    },
    closeDialogSearch() {
      this.searchActive = false;
      // if (!this.searchFocus) {
        //   this.searchActive = false;
      // }
    },
    closeTune() {
      this.tuneDialogActive = false;
      this.$store.commit("SHOW_TUNE", false);
      
    },
    searchBlur() {
      setTimeout(() => {
        this.searchFocus = false;
      }, 200);
    },
    searchInputFunc(e) {
      // debugger;
      // console.log(e);
      // console.log(this.searchInput);
      // this.searchInput
      this.debounceFilter();
      // this.searchLoading = true;
    },
    changeFilter() {
      // console.log("changeFilter");
      // this.searchLoading = false;
      let result = [];
      // let searchStr = this.searchInput.toLowerCase().replace(/  +/g, ' ').split(" ");
      let searchStr = this.searchInput.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let strIndex = null;
      let prePush;
      let tryFind;
      if (searchStr === "") {
        this.searchLoading = false;
        return [];
      }

      this.all_cars.map((x, ix) => {
        if (result.length < 100) {
          strIndex = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(searchStr);
          if (strIndex > -1) {
            prePush = JSON.parse(JSON.stringify(x));
            prePush.locatedName = x.name.substr(0, strIndex)+'<b>'+x.name.substr(strIndex, searchStr.length)+'</b>'+x.name.substr(strIndex + searchStr.length);
            prePush.locatedIndex = strIndex;
            if (x.name[strIndex - 1] === ' ') {
              prePush.locatedPlus = true;
            }

            result.push(prePush);
          }
        }
      })
      result.map(x => {
        Vue.set(x, "class", Vue.resolveClass(x.rq, x.class, "letter"));
        Vue.set(x, "classColor", Vue.resolveClass(x.rq, x.class, "color"));    
        try {
          Vue.set(x, "ridPhoto", '');
          setTimeout(() => {
            Vue.set(x, "ridPhoto", require('@/imgs_final/' + x.rid + '.jpg'));
          }, 1);
        } catch (error) {
          Vue.set(x, "ridPhoto", '');
        }    
      })
      result.sort(function(a, b) {
        if (a.locatedPlus && !b.locatedPlus) return -1;
        if (b.locatedPlus && !a.locatedPlus) return 1;
        return a.locatedIndex - b.locatedIndex;
      });

      this.searchMax = 20;

      this.searchResult = result;
      this.searchLoading = false;
      this.showingLastest = false;
      this.alreadySearched = true;

    },
    showLastest(arrayLastest) {
      let result = [];
      let prePush;
      
      arrayLastest.map(y => {
        this.all_cars.map(x => {
          if (x.rid === y.rid) {
            prePush = JSON.parse(JSON.stringify(x));
            prePush.locatedName = x.name;
            prePush.lastestUser = y.user;
            result.push(prePush);
          }
        })
      })
      result.map(x => {
        Vue.set(x, "class", Vue.resolveClass(x.rq, x.class, "letter"));
        Vue.set(x, "classColor", Vue.resolveClass(x.rq, x.class, "color"));    
        try {
          Vue.set(x, "ridPhoto", '');
          setTimeout(() => {
            Vue.set(x, "ridPhoto", require('@/imgs_final/' + x.rid + '.jpg'));
          }, 1);
        } catch (error) {
          Vue.set(x, "ridPhoto", '');
        }    
      })

      this.showingLastest = true;
      this.searchMax = 100;
      this.searchResult = result;
    },
    addCar(index) {
      if (this.carDetailsList.length < this.maxCarNumber) {
        this.carDetailsList.push(JSON.parse(JSON.stringify(this.searchResult[index])));
        this.carDetailsList[this.carDetailsList.length - 1].softId = this.nextId;
        this.nextId++;
        // console.log(this.carDetailsList.map(x => x.softId));

        this.searchResult.find((x, ix) => {
          if (ix === index) {
            Vue.set(x, "added", true);
            setTimeout(() => {
              Vue.set(x, "added", false);
            }, 800);
            return true;
          }
        });

        if (this.carDetailsList.length >= this.maxCarNumber) {
          this.searchActive = false;
        }

        this.updateCarLocalStorage();
        this.downloadCar(this.carDetailsList[this.carDetailsList.length - 1].rid)
      }
    },
    // toggleTrack(set) {
    //   let index = this.activeTrackSet.indexOf(set);

    //   if (index > -1) {
    //     this.activeTrackSet.splice(index, 1);
    //   } else {
    //     this.activeTrackSet.push(set);
    //   }
    // },
    display(type, save = true) {
      if (type === "vertical") {
        this.inverted = true;
        this.compact = false;
      }
      if (type === "horizontal") {
        this.inverted = false;
        this.compact = false;
      }
      if (type === "horizontal2") {
        this.inverted = false;
        this.compact = true;
      }
      if (save) {
        window.localStorage.setItem('display', type);
      }
    },
    newIndex(obj) {
      obj.current;
      obj.new;
      this.closeTune();

      // If actual index of moved element is
      // less than 0 when 'moveEle += array size'
      while (obj.current < 0)
      {
          obj.current += this.carDetailsList.length;
      }

      // Where the element to be moved f that
      // index is less than 0 when
      // 'obj.new += array size'
      while (obj.new < 0)
      {
          obj.new = 0;
      }

      // If 'obj.new' is greater than the
      // size of the array then with need to
      // push 'undefined' in the array.
      if (obj.new > this.carDetailsList.length)
      {
          obj.new = this.carDetailsList.length;
          // var un = obj.new - this.carDetailsList.length + 1;
          // while (un--)
          // {
          //     this.carDetailsList.push(undefined);

          // }
      }

      // Here element of 'obj.current' is removed and
      // pushed at 'obj.new' index
      this.carDetailsList.splice(obj.new, 0, this.carDetailsList.splice(obj.current, 1)[0]);
      
      this.updateCarLocalStorage();
    },
    getUser() {
      // user
      axios.get(Vue.preUrl + "/getUser")
      .then(res => {
        if (res.data.username) {
          this.user = res.data;

          LogRocket.identify(res.data.username, {
            email: res.data.email
          });

        }
      })
      .catch(error => {
        console.log(error);
      });

      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.showLastest(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    },
    logout() {
      axios.delete(Vue.preUrl + "/logout")
      .then(res => {
        if (res.data === "OK") {
          this.user = null;
          this.$store.commit("DEFINE_SNACK", {
            active: true,
            correct: true,
            text: "Logout successful"
          });
        } else {
          throw new Error("Unable to log out");
        }
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      });
    },
    updateCarLocalStorage() {
      let toSave = this.carDetailsList.map(x => { 
        return {
          rid: x.rid,
          selectedTune: x.selectedTune
        }
      })

      window.localStorage.setItem('cars', JSON.stringify(toSave));
    },
    prepareCars(cars) {
      let result = [];
      if (cars && cars.length > 0) {
        
        cars.map(y => {
          this.all_cars.map(x => {
            if (x.rid === y.rid) {
              result.push(JSON.parse(JSON.stringify(x)));
              if (y.selectedTune) result[result.length-1].selectedTune = y.selectedTune;
              result[result.length-1].softId = this.nextId;
              this.nextId++;
            }
          })
        })
        
      }
      Vue.set(this, "carDetailsList", result);
      this.downloadDataCars();
    },
    saveAll() {
      this.saveLoading = true;
      let simplifiedCars = [];
      this.carDetailsList.map(x => {
        if (x.dataToSave) {
          simplifiedCars.push({
            rid: x.rid,
            data: x.dataToSave
          });
        }
      });

      axios.post(Vue.preUrl + "/update", simplifiedCars)
      .then(res => {
        this.needSave = false;        
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: "Successful save"
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
        this.saveLoading = false;
      });

    },
    downloadDataCars() {
      this.downloadLoading = true;
      let simplifiedCars = this.carDetailsList.map(x => {
        return {
          rid: x.rid
        }
      });

      if (simplifiedCars.length === 0) {
        this.downloadLoading = false;
        return;
      }

      axios.post(Vue.preUrl + "/cars", simplifiedCars)
      .then(res => {        
        this.applyNewData(res.data);
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
        this.downloadLoading = false;
      });
    },
    downloadCar(rid) {
      this.downloadLoading = true;

      axios.get(Vue.preUrl + "/car/" + rid)
      .then(res => {        
        this.applyNewData([res.data]);
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
        this.downloadLoading = false;
      });
    },
    applyNewData(newData) {
      this.carDetailsList.map(x => {
        newData.map(y => {
          if (x.rid === y.rid) {
            if (y.data) Vue.set(x, "data", y.data);
            if (y.users) Vue.set(x, "users", y.users);
          }
        })
      });
    },
    sharePrint() {
      window.scrollTo({ top: 0 });
      let vm = this;
      // this.printImageDialog = true;
      let pose = document.querySelector(".Main_Body");
      pose.classList.add("Main_BodyPrint");
      let c_container = document.querySelector('#App_PrintContainer');
      let currentCanvas = document.querySelector('#printCanvas');
      c_container.classList.add("App_PrintContainerShow");
      let mainLayout = document.querySelector(".Main_Layout");
      let reduceWidth = 0;
      if (!mainLayout.classList.contains("Main_2")) {
        // reduceWidth = Number(getComputedStyle(mainLayout).getPropertyValue('--cell-width').trim().replace("px",""));
      } else {
        // reduceWidth = 90;
      }
      let reduceHeight = 0;
      let carlistContainer = document.querySelector(".Main_CarList");
      let backTopContainer = document.querySelector(".Main_Backtop");
      if (!mainLayout.classList.contains("Main_2")) {
        reduceHeight = pose.clientHeight - carlistContainer.clientHeight;
      } else {
        reduceHeight = pose.clientHeight - backTopContainer.clientHeight - carlistContainer.clientHeight;
      }



      let _width = (pose.clientWidth - reduceWidth) * 2;
      let _height = (pose.clientHeight - reduceHeight) * 2;      
      
      let options = {
        // allowTaint: false,
        backgroundColor: "#333",
        canvas: currentCanvas,
        // foreignObjectRendering: false,
        // imageTimeout: 15000,
        // ignoreElements: (element) => false,
        // logging: true,
        // onclone: (doc) => {
        //   console.log(doc);
        //   doc.querySelectorAll("button").forEach(x => {
        //     x.remove()
        //   })
        // },
        // proxy: null,
        // removeContainer: true,
        scale: 2,
        // useCORS: false,
        width: _width,
        height: _height,
        // x: Element x-offset,
        // y: Element y-offset,
        // scrollX: Element scrollX,
        // scrollY: Element scrollY,
        windowWidth: _width,
        windowHeight: _height,
      }

      currentCanvas.setAttribute("width", `${_width}`);
      currentCanvas.setAttribute("height", `${_height}`);

      html2canvas(pose, options).then(function(canvas) {
        reimg.ReImg.fromCanvas(currentCanvas).downloadPng()
        c_container.classList.remove("App_PrintContainerShow")
        
        document.querySelector(".Main_Body").classList.remove("Main_BodyPrint");
      });
    },
    generateUrl() {
      let result = `${window.location.origin}?share=`;
      this.currentTracks.map(x => {
        result += `~K${x.id}_a${x.surface}${x.cond}`
      });
      this.carDetailsList.map(x => {
        result += `~C${x.rid}${x.selectedTune ? '~T'+x.selectedTune : '' }`
      });

      if (result.length > 2045) {
        // não dá
      }
      this.shareUrl = result;

    },
    copyUrl() {
      var copyText = document.getElementById("shareLinkField");
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
      navigator.clipboard.writeText(copyText.value);
      this.copyUrlSucess = true;
      setTimeout(() => { this.copyUrlSucess = false}, 1500);
    }
  },
}
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@300;400;700&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed:wght@400;700&family=VT323&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto&family=Roboto+Condensed:wght@400;700&display=swap');

* {
  background-repeat: no-repeat;
  padding: 0;
  margin: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
body {
  font-family: 'Roboto', sans-serif;

  /* main */
  --top-height: 150px;
  --left-width: 200px;
  --cell-width: 230px;
  --cell-height: 35px;
  --dark-back: 40, 40, 40;
  --back-h: 360;
  --back-s: 0%;
  --back-l: 15%;
  --d-back: #333;
  --d-text: #aaa;
  --d-text-b: #ccc;
  --d-text-green: 95, 181, 0;
  --d-text-green-b: 193, 217, 185;
  --d-text-red: 215, 0, 0;
  --d-text-red-b: 251, 131, 131;
  --d-text-yellow: 255, 199, 23;

  /* tracks */
  --color-wet: 90, 163, 255;
  --color-dirt: 239, 97, 75;
  --color-gravel: 197, 177, 120;
  --color-ice: 112, 215, 255;
  --color-mixed: 217, 171, 225;
  --color-sand: 233, 197, 69;
  --color-snow: 186, 212, 235;

  /* car */
  --card-stat-back-l: 10%;
  --card-stat-back-a: 0.2;
  --card-right-width: 20%;
  --card-left-width: 10%;
  --card-top-height: 15%;
  --card-left-height: 28%;
  --card-stat-div: 0%;
  --card-font-size: 12px;
  --card-stat-height: calc( (100% - var(--card-top-height) - (var(--card-stat-div)*4)) / 4 );


  font-size: 18px;
  background-color: var(--d-back);
  color: var(--d-text);
  overflow-x: scroll;
  overflow-y: scroll;
}
.Main_Layout {
  min-height: 100%;
  max-width: 100%;
  display: flex;
  -webkit-user-select: none;
}
.Main_Body {
  position: relative;
  min-height: 100%;
  display: flex;
}
.Main_BodyEmpty {
  min-width: 100%;
}
.Main_Left {
  width: var(--left-width);
  position: sticky;
  left: 0;
  margin-top: var(--top-height);
  overflow: hidden;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  z-index: 10;
  min-height: calc(100% - var(--top-height));

  /* pra preencher mobile */
  box-shadow: 0px 50vh 0px 0px hsl(var(--back-h), var(--back-s), var(--back-l));
  user-select: text;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.Main_Corner {
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  height: var(--top-height);
  width: var(--left-width);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
}
.Main_CornerMid {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin: 0px 5px 5px 5px;
  align-items: center;
  gap: 5px;
}
.Main_Logo {
  margin: 10px 10px;
  display: flex;
  flex-direction: column;
}
.Main_2 .Main_Corner {
  display: grid;
  grid-template-columns: 1fr max-content;
  /* grid-template-columns: 65px 1fr; */
}
.Main_2 .Main_CornerMid {
  flex-grow: unset;
  margin: 5px 5px 5px 0;
}
.Main_2 .Main_LogoPre {
  /* display: none; */
}
.Main_2 .Main_Logo {
  justify-content: center;
  /* height: calc(var(--top-height) - 20px); */
}
.Main_Backtop {
  position: fixed;
  background-color: hsl(var(--back-h), var(--back-s), var(--back-l));
  height: var(--top-height);
  width: 100%;
  z-index: 0;
  top: 0;
  left: 0;
}
.Main_Mid {
  /* position: absolute; */
  top: 0;
  /* margin-left: var(--left-width); */
  height: 100%;
}
.Main_MidEmpty {
  padding-top: var(--top-height);
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 80px;
}
.Main_MidEmptyInner {
  display: flex;
  align-items: stretch;
  --gap: 20px;
  gap: var(--gap);
}
.Main_MidEmptyItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap);
}
.D_Button.Main_MidEmptyButton {
  font-size: 18px;
  padding: 12px 15px;
}
.D_Button.Main_MidEmptyButtonSearch {
  flex-direction: column;
  height: 100%;
  max-height: unset;
  padding: 14px 15px;
  gap: 10px;
}
.Main_CarList {
  display: flex;
  user-select: text;
}
.D_Button {
  background-color: transparent;
  border: none;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  transition-duration: 0.1s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --height: 36px;
  min-height: var(--height);
  min-width: 36px;
  line-height: 1;
  border-radius: 6px;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  color: var(--d-text-b);
}
.D_ButtonDark {
  background-color: rgba(0,0,0,0.2);
  font-size: 1em;
  border-radius: 6px;
  padding: 0 7px;
  color: var(--d-text-b);
}
.D_ButtonDark2 {
  background-color: rgba(255,255,255,0.1);
  --back-opac: 0.2;
}
.D_Button.focus-visible:not(.D_ButtonNoActive) {
  outline: none;
  background-color: rgba(var(--back-color), 0.3);
}
.D_ButtonNoActive {
  outline: none;
}
.D_Button.D_ButtonNoActive.focus-visible {
  background-color: rgba(var(--back-color), 0.3);
}
.D_Button:hover:not(.D_ButtonActive):not([disabled]) {
  color: #fffc;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.D_Button:active:not(.D_ButtonNoActive) {
  transition-duration: 0.0s;
  background-color: rgba(var(--back-color), calc(var(--back-opac) * 2));
  transform: translateY(3px);
}
.D_ButtonLabel {
  margin-right: 5px;
  font-size: 16px;
}
.D_ButtonActive {
  box-shadow: inset 0px -33px 15px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
  border-radius: 0;
}
.D_ButtonActive:hover {
  background-color: rgba(var(--d-text-green-b), 0.2);
}
.D_Button[disabled] {
  cursor: initial;
  opacity: 0.2;
  pointer-events: none;
}
.D_Button.D_Button_Loading {
  position: relative;
  color: rgba(255, 255, 255, 0.2);
  opacity: 0.6;
  overflow: hidden;
}
.D_Button_Loading::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 100%;
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 7px,
    rgba(255, 199, 23, 1) 0,
    rgba(255, 199, 23, 1) 14px
  );
  animation: Processamento_Loop 0.6s linear infinite;
  top: 85%;
}
@keyframes Processamento_Loop {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0px);
  }
}
.D_Button.D_Button_Correct {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-green), 0.2);
  opacity: 0.6;
}
.D_Button_Correct::after {
  content: "Done!";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-green));
}
.D_Button.D_Button_Error {
  position: relative;
  color: transparent;
  background-color: rgba(var(--d-text-red), 0.2);
  opacity: 0.6;
}
.D_Button_Error::after {
  content: "Error";
  position: absolute;
  width: 100%;
  display: flex;
  text-align: center;
  align-content: center;
  justify-content: center;
  color: rgb(var(--d-text-red));
}
.D_ButtonLink {
  color: var(--d-text);
  padding: 0;
  height: auto;
  min-height: auto;
  width: auto;
  min-width: auto;
}
.D_ButtonIcon {
  margin-right: 5px;
}
.D_ButtonNote {
  position: absolute;
  top: -6px;
  right: -3px;
  font-size: 9px;
  background-color: #bd0000;
  color: white;
  border-radius: 3px;
  padding: 2px;
  padding-right: 2.5px;
}

.D_Link {
  text-decoration: none;
  color: var(--d-text);
  padding: 5px 6px;
  border-radius: 5px;
  transition-duration: 0.1s;
}
.D_Link:hover,
.D_Link.focus-visible {
  outline: none;
  background-color: rgba(255,255,255,0.06);
}
.D_LinkPlus {
  background-color: rgba(255,255,255,0.03);
}
.add {
  color: #fff2;
  font-size: 30px;
  width: 100%;
  height: 100%;
}
.Main_SearchHeader {
  width: 100%;
}
.Main_SearchBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Main_SearchInput {
  width: 100%;
  background-color: #222;
  border: none;
  padding: 25px;
  box-sizing: border-box;
  color: #ccc;
  --input-color: 90, 90, 90;
  box-shadow: inset 0px 0px 0px 3px rgba(var(--input-color), 1);
  transition-duration: 0.2s;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
}
.Main_SearchInput:focus {
  outline: none;
  --input-color: 69, 155, 209;
  background-color: #102e40;
  color: #fff;
}
.Main_SearchInput::placeholder {
  color: #fff3;
}
.Main_SearchMid {
  height: 50vh;
  background-color: var(--d-back);
  width: 100%;
  padding: 25px 0;
  box-sizing: border-box;
  overflow-y: scroll;
  overscroll-behavior-block: contain;
  position: relative;
}
.Main_SearchEmpty::-webkit-scrollbar,
.Main_SearchMid::-webkit-scrollbar,
textarea::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 18px;
}
.Main_SearchEmpty::-webkit-scrollbar-track,
.Main_SearchMid::-webkit-scrollbar-track,
textarea::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  background-color: #0002;
}
.Main_SearchEmpty::-webkit-scrollbar-thumb,
.Main_SearchMid::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
  background-color: #555;
}
.Main_SearchEmpty::-webkit-scrollbar-corner,
.Main_SearchMid::-webkit-scrollbar-corner,
textarea::-webkit-scrollbar-corner,
body::-webkit-scrollbar-corner {
  background-color: #222;
}
.Main_SearchEmpty {
  height: 50vh;
  background-color: var(--d-back);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
}
.Main_SearchEmptyAddIcon {
  font-size: 70px;
  opacity: 0.1;
}
.Main_SearchItem {
  padding: 7px 25px 7px 0px;
  display: flex;
  width: 100%;
  background: transparent;
  outline: 0;
  border: none;
  text-decoration: none;
  user-select: none;
  transition-duration: 0.1s;
  cursor: pointer;
  --back-color: 255, 255, 255;
  --back-opac: 0.1;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  color: var(--d-text);
  align-items: center;
}
.Main_SearchItem:hover {
  color: #fff6;
  background-color: rgba(var(--back-color), var(--back-opac));
}
.Main_SearchItemAdded {
  opacity: 0.5;
}
.Main_SearchLoading {
  position: fixed;
  width: 100%;
  height: 5px;
  top: 0;
  left: 0;
}
.Main_SearchItemImg {
  display: flex;
  height: 38px;
  margin: -7px 0;
  width: 53px;
  min-width: 53px;
  border-radius: 0px 3px 3px 0px;
  overflow: hidden;
  margin-right: 10px;
  background-color: #00000038;
}
.MainGallery_Img {
  transform: scale(1.3);
}
.Main_SearchItemLeft {
  color: var(--color);
  margin-right: 10px;
  width: 2em;
  min-width: 2em;
}
.Main_SearchItemRight {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
}
.Main_SearchItemYear {
  font-size: 0.6em;
  box-shadow: 0px 0px 0px 2px #0003;
  background-color: #0003;
  padding: 1px 3px;
  margin-left: 0.2em;
  margin-right: 2px;
}
.Main_SearchItemRight b {
  color: #fffd;
  font-weight: normal;
  background-color: #fff1;
  box-shadow: 0px 0px 0px 1px #fff1;
}
.Main_SearchResultUser {
  font-size: 0.8em;
  margin-left: 0.1em;
  margin-right: 2px;
  color: rgb(225 179 33);
}
.Main_SearchLastestTitle {
  font-size: 1.7em;
  opacity: 0.3;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
  white-space: nowrap;
}
.Main_SearchMore {
  font-size: 18px;
  margin-top: 11px;
  margin-left: 62px;
  padding: 12px 15px;
}
.Space_Bottom { 
  margin-bottom: 10px;
}
.Space_Top { 
  margin-top: 10px;
}
.Space_Both { 
  margin-bottom: 10px;
  margin-top: 10px;
}
.Space_BottomPlus { 
  margin-bottom: 20px;
}
.Space_TopPlus { 
  margin-top: 20px;
}
.Space_BothPlus { 
  margin-bottom: 20px;
  margin-top: 20px;
}
.Main_OptionsDialog {
  font-size: 18px;
}
.Main_OptionsButton {
  font-size: 16px;
  padding: 10px;
  background-color: rgba(var(--back-color), 0.04);
}
.Main_OptionsButton > i {
  font-size: 28px;
}
.Main_OptionsButtons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.Main_OptionsLabel {
  font-size: 14px;
}
.Main_OptionsItem + .Main_OptionsItem {
  margin-top: 20px;
}
.Main_OptionsLogout {
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 10px;
}

.Main_UserLogout {
  margin-bottom: -2px;
  align-self: flex-start;
  padding: 2px;
  font-size: 14px;
}
.Main_MenuIcon {
  font-size: 22px;
}
.Main_SideBox {
  position: absolute;
  right: 0;
  bottom: 0;
}
.Main_Credits {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  padding: 3px;
}
.Main_PrintBy {
  display: none;
  text-align: center;
}
.Main_PrintByLabel {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  margin-bottom: 3px;
}
.Main_PrintByUser {
  color: rgb(var(--d-text-yellow));
  max-width: var(--left-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 7px;
  box-sizing: border-box;
}
.Main_BodyPrint .Main_Corner .Main_PrintBy {
  display: flex;
  justify-content: center;
  align-items: center;
}
.Main_Corner .Main_PrintByLabel {
  margin-bottom: 0px;
}
.Main_Corner .Main_PrintByUser {
  max-width: 20ch;
}
.Main_UserBottom {
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 6px;
}
.Main_UserBottom .Main_UserBlock {
  max-width: calc(100% - 35px);
}
.Main_UserName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.Main_UserCard {
  display: flex;
  align-items: center;
  gap: 8px;
}
.Main_UserBlock {
  display: flex;
  flex-direction: column;
}
.D_Button.D_ButtonMenu {
  padding: 11px 11px;
}
.Main_SaveAllBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.D_Button.Main_SaveAllButton {
  --back-color: 49, 141, 8;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 0.7);
  color: white;
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_Button.Main_LoginToEdit {
  --back-color: 44, 37, 16;
  --back-opac: 1;
  background-color: rgba(var(--back-color), 1);
  color: rgb(var(--d-text-yellow));
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.D_Button.Main_Share {
  background-color: rgba(0,0,0,0.2);
  font-size: 18px;
  border-radius: 6px;
  padding: 8px 17px;
  min-height: calc( var(--height) * 0.8 );
}
.Main_DialogTitle {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
}
.Main_DialogTitle:not(:first-child) {
  margin-top: 25px;
}
.Main_ShareDownloadBox {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.Main_ShareLinkBox {
  display: flex;
  gap: 15px;
  align-items: center;
}
.Main_ShareLinkInput {
  background-color: rgba(0,0,0,0.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: none;
  margin-top: 2px;
  flex-grow: 1;
}
.Main_ShareLinkInputCorrect {

}






.Main_2 {
  --cell-width: 80px;
  --top-height: 70px;
  --left-width: 250px;
  font-size: 14px;
}
.Main_2 .Main_Mid {
  /* display: none; */
  height: auto;
}
.Main_2 .Main_Left {
  width: unset;
  position: static;
  margin-top: 0;
  height: var(--top-height);
  box-shadow: none;
  min-height: unset;
  margin-left: var(--left-width);
  /* margin-top: calc(var(--top-height) - var(--cell-height) - 1px); */
  z-index: unset;
  display: block;
}
.Main_2 .Main_Credits {
  /* display: none; */
}
.Main_2 .Main_TrackList {
  display: flex;
  height: 100%;
}
.Main_2 .Row_Layout {
  display: flex;
}
.Main_2 .Main_Body {
  flex-direction: column;
}
.Main_2 .Row_Cell {
  width: var(--cell-width);
  height: 100%;
}
.Main_2 .Row_Times .Row_Cell {
  height: var(--cell-height);
}
.Main_2 .Row_Content {
  /* line-height: calc(var(--cell-height) - 12px); */
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.Main_2 .Row_ContentEmpty:not(:focus) ~ .Row_Placeholder {
  display: flex;
}
.Main_2 .Row_Placeholder {
  width: 100%;
  justify-content: center;
  align-items: center;
}
.Main_2 .Row_Tracks .Row_Content {
  text-align: center;
  white-space: normal;
}
.Main_2 .Row_Tracks .Row_Cell {
  border-right-width: 2px;
  border-top-width: 2px;
  border-bottom-width: 0;
}
.Main_2 .Row_Layout {
  display: flex;
  align-items: stretch;
}
.Main_2 .Row_ConfigLabel {
  display: none;
}
.Main_2 .Row_ConfigButton {
  --height: 30px;
  padding: 0px 4px;
}
.Main_2 .Row_ConfigIcon {
  font-size: 18px;
}
.Main_2 .Row_Tracks .Row_ConfigCell {
  /* box-shadow: inset 0px -18px 16px -17px #5fb500, inset 0px -3px 0px 0px #5fb500; */
}
.Main_2 .Row_ConfigCell {
  width: calc(var(--cell-width) * 2);
}
.Row_OrderBox {
  display: none;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}
.Main_2 .Row_OrderBox {
  display: flex;
}
.Main_2 .Row_TuneChooseBox .Row_ConfigButton:nth-child(5) {
  display: none;
}




.Main_Compact .Car_Layout {
  --card-left-width: 19%;
  --card-right-width: 31%;
  --card-top-height: 11.5%;
  --card-stat-height: 31.9px;
}
.Main_Compact .Car_Layout:not(.Car_LayoutAddCar) .Car_Header > *:not(.Car_HeaderName):not(.Car_HeaderBlockRQ):not(.Car_HeaderBlockClass):not(.Car_HeaderBlockTopSpeed):not(.Car_HeaderBlock060):not(.Car_HeaderBlockHandling):not(.Car_HeaderBlockDrive) {
  display: none;
}
.Main_Compact .Car_Layout {
  width: 120px;
}
.Main_Compact .Car_Layout .Car_HeaderName {
  font-size: 0.8em;
  width: calc(100% - 8px);
  margin-top: 0px;
}
.Main_Compact .Car_Layout .Car_HeaderNameBig {
  font-size: 0.7em;
}
.Main_Compact .Car_Layout .Car_HeaderNameBigBig {
  font-size: 0.6em;
}
.Main_Compact .Car_Layout .Car_HeaderBlockTopSpeed,
.Main_Compact .Car_Layout .Car_HeaderBlock060,
.Main_Compact .Car_Layout .Car_HeaderBlockHandling,
.Main_Compact .Car_Layout .Car_HeaderBlockDrive {
  box-shadow: 0px -2px 0px hsla(0, 100%, 100%, 0.09);
  backdrop-filter: blur(15px);
}
.Main_Compact .Car_Layout .Car_HeaderStatValue,
.Main_Compact .Car_Layout .Car_HeaderStatLabel {
  padding-right: 1px;
}
.Main_Compact .Row_OrderBox {
  display: flex;
}
.Main_Compact .Row_ConfigIcon {
  transform: rotate(-90deg);
}




.Main_BodyPrint .Main_Corner {
  justify-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: 50px max-content;
}
.Main_BodyPrint .Row_Tune {
  padding-left: 0px;
}
.Main_BodyPrint .Main_Credits {
  display: none;
}
.Main_BodyPrint .Row_DisabledCell {
  background-color: #00000024;
}
.Main_BodyPrint .Row_Cell {
  border: solid 2px #ffffff07;
  border-right-width: 0;
  border-bottom-width: 0;
}
.Main_Layout:not(.Main_2) .Main_BodyPrint .Row_Cell:nth-child(3n-1) {
  border-top-width: 2px;
  border-top-color: #ffffff1c;
}
.Main_2 .Main_BodyPrint .Row_ConfigCell {
  width: 70px; /* this value is hard coded in sharePrint() */
}
.Main_2 .Main_BodyPrint .Car_Layout:nth-child(3n-1) .Row_Cell {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #ffffff1c;
}
.Main_2 .Main_BodyPrint .Main_LogoPre {
  display: none;
}
.Main_BodyPrint .Main_UserBottom {
  display: none;
}
.Main_BodyPrint button {
  display: none;
}
.Main_BodyPrint .Main_CornerMid {
  display: none;
}
.Main_BodyPrint .Car_LayoutAddCar {
  display: none !important;
}
.Main_BodyPrint .Main_SaveAllBox {
  display: none;
}
.Main_BodyPrint .Main_PrintBy {
  display: block;
}
.Main_BodyPrint {
  --card-top-height: 12%;
}
.Main_BodyPrint .Car_HeaderName {
  margin-top: -1px;
}
.Main_Compact .Main_BodyPrint .Car_HeaderBlockTopSpeed,
.Main_Compact .Main_BodyPrint .Car_HeaderBlock060,
.Main_Compact .Main_BodyPrint .Car_HeaderBlockHandling,
.Main_Compact .Main_BodyPrint .Car_HeaderBlockDrive {
  background-color: hsla(40, 6%, 30%, 0.8);
}
.Main_Compact .Main_BodyPrint .Car_HeaderBlockTopSpeed {
  box-shadow: unset;
}
.Main_Compact .Row_TuneChooseButton {
  display: none;
}
.Main_Compact .Car_Loading::after {
  left: 50%;
}





@media only screen and (max-width: 767px) {
  body {
    /* --d-back: #504242; */
    --left-width: 120px;
  }
  .Main_BodyPrint {
    --left-width: 200px;
  }
  .Main_CornerMid .BaseAvatar_Layout {
    display: none;
  }
  .Main_UserBottom .BaseAvatar_Layout {
    --size: 21px !important;
  }
  .Main_UserName {
    font-size: 0.7em;
  }
}
@media only screen and (min-width: 768px) {
  .Main_MidEmptyItemAdd:first-child .Main_MidEmptyButtonSearch {
    padding: 44px 55px;
  }
}
</style>