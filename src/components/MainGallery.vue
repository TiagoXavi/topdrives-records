<template>
  <div class="MainGallery_Layout">
    <div class="MainGallery_FilterLayout">
      <div class="MainGallery_SearchHeader">
        <div class="Main_SearchHeader">
          <div v-if="!isFiltering" class="Main_SearchFieldBox">
            <input
              v-model="searchInput"
              id="SearchInput"
              :placeholder="$t('m_search')"
              class="D_SearchInput"
              type="text"
              @focus="searchFocus = true;"
              @blur="searchBlur()"
              @input="searchInputFunc($event)">
            <button
              v-if="searchInput && searchInput.length > 0 || alreadySearched"
              class="D_Button D_SearchInputClose"
              @click="closeFilterText()">
              <i class="ticon-close_2" aria-hidden="true"/>
            </button>
          </div>
          <button
            v-if="!isFiltering"
            class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
            @click="isFiltering = !isFiltering;">Filters<span v-if="filterCount > 0" class="Main_FiltersButtonCount">{{ filterCount }}</span></button>
          <button
            v-else
            class="D_Button D_ButtonDark D_ButtonNoActive Main_FiltersButton"
            @click="applyFilter()">Done</button>
        </div>
        <div v-if="isFiltering" class="Main_SearchMid">
          <div class="Main_FilterItems">
            <div class="Main_FilterChips Main_FilterClassChips">
              <template v-for="(item, ix) in searchFilters.classes">
                <BaseChip
                  class="Main_ClassChip"
                  activeClass="Main_ClassChipActive"
                  :style="`--classC: ${searchFilters.classesColors[ix]}`"
                  v-model="searchFilters.classesModel"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsInside" style="margin: 10px auto 0 auto;">
              <BaseChip
                v-model="searchFilters.onlyAnyChangeModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">Any changed</BaseChip>
              <BaseChip
                v-model="searchFilters.onlyNewPerformanceModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">Perfomance changed</BaseChip>
              <BaseChip
                v-model="searchFilters.onlyNewRarityModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">Rarity changed</BaseChip>
              <BaseChip
                v-model="searchFilters.onlyNewTyresModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">Tyres changed</BaseChip>
              <BaseChip
                v-model="searchFilters.onlyNewDriveModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">Drive changed</BaseChip>
              <BaseChip
                v-model="searchFilters.onlyNewClearanceModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">Clearance changed</BaseChip>
              <BaseChip
                v-model="searchFilters.onlyNewCarsModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">New cars</BaseChip>
            </div>
            <BaseDualSlider
              v-model="searchFilters.rqModel"
              :min="searchFilters.rqStart"
              :max="searchFilters.rqEnd"
              label="RQ"
              class="Main_FilterSlider" />
            <BaseDualSlider
              v-model="searchFilters.yearModel"
              :min="searchFilters.yearStart"
              :max="searchFilters.yearEnd"
              label="Year"
              class="Main_FilterSlider" />
            <div class="Main_FilterThree">
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.tyres">
                  <BaseChip
                    v-model="searchFilters.tyresModel"
                    class="BaseChip_MinWidth"
                    :value="item">{{ item | convertTires }}</BaseChip>
                </template>

              </div>
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.drives">
                  <BaseChip
                    v-model="searchFilters.drivesModel"
                    class="BaseChip_MinWidth"
                    :value="item" />
                </template>

              </div>
              <div class="Main_FilterChipsInside">
                <template v-for="(item, ix) in searchFilters.clearances">
                  <BaseChip
                    v-model="searchFilters.clearancesModel"
                    class="BaseChip_MinWidth"
                    :value="item">{{ item.toUpperCase() }}</BaseChip>
                </template>

              </div>
            </div>
            <div class="Main_FilterDual">
              <BaseDualSlider
                v-model="searchFilters.topSpeedModel"
                :min="searchFilters.topSpeedStart"
                :max="searchFilters.topSpeedEnd"
                label="Top Speed"
                class="Main_FilterSlider" />
              <BaseDualSlider
                v-model="searchFilters.acelModel"
                :min="searchFilters.acelStart"
                :max="searchFilters.acelEnd"
                :step="0.1"
                label="0-60mph"
                class="Main_FilterSlider" />
            </div>
            <div class="Main_FilterDual">
              <BaseDualSlider
                v-model="searchFilters.handModel"
                :min="searchFilters.handStart"
                :max="searchFilters.handEnd"
                label="Handling"
                class="Main_FilterSlider" />
              <BaseDualSlider
                v-model="searchFilters.mraModel"
                :min="searchFilters.mraStart"
                :max="searchFilters.mraEnd"
                label="MRA"
                class="Main_FilterSlider" />
            </div>
            <div class="Main_FilterDual">
              <BaseDualSlider
                v-model="searchFilters.weightModel"
                :min="searchFilters.weightStart"
                :max="searchFilters.weightEnd"
                label="Weight"
                class="Main_FilterSlider" />
              <BaseDualSlider
                v-model="searchFilters.seatsModel"
                :min="searchFilters.seatsStart"
                :max="searchFilters.seatsEnd"
                label="Seats"
                class="Main_FilterSlider" />
            </div>
            <div class="Main_FilterChips2">
              <template v-for="(item, ix) in searchFilters.countrys">
                <BaseChip
                  v-model="searchFilters.countrysModel"
                  class="BaseChip_ChipFlag"
                  :value="item" >
                  <BaseFlag :flag="item" />
                </BaseChip>
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.prizes">
                <BaseChip
                  v-model="searchFilters.prizesModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.bodyTypes">
                <BaseChip
                  v-model="searchFilters.bodyTypesModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.fuel">
                <BaseChip
                  v-model="searchFilters.fuelModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex" style="position: relative; margin-top: 5px;">
              <div class="Main_FilterChipsLabel">Engine position</div>
              <template v-for="(item, ix) in searchFilters.engine">
                <BaseChip
                  v-model="searchFilters.engineModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.tags">
                <BaseChip
                  v-model="searchFilters.tagsModel"
                  v-if="!$store.state.oldTags.includes(item) || $store.state.showOldTags"
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '')}`"
                  class="BaseChip_MinWidth BaseChip_DontCrop BaseGameTag_Filter"
                  :value="item" />
              </template>
            </div>
            <div class="Main_FilterChipsFlex">
              <template v-for="(item, ix) in searchFilters.brands">
                <BaseChip
                  v-model="searchFilters.brandsModel"
                  class="BaseChip_MinWidth BaseChip_DontCrop"
                  :value="item" />
              </template>
            </div>
            <div class="D_Center" style="gap: 15px;">
              <button
                class="D_Button D_ButtonDark D_ButtonDarkTransparent D_ButtonBig"
                @click="clearFilter()">Clear</button>
              <button
                class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig D_ButtonDarkPrimary"
                @click="applyFilter()">Done</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="MainGallery_Box">
      <div
        v-for="(car, ix) in searchResult"
        class="MainGallery_Item">
        <div v-if="car.visible">
          
          <div v-if="diff_searchResult[ix].new === true" class="MainGallery_NewCar">New</div>
          <div v-else-if="Object.keys(diff_searchResult[ix]).length === 0" class="MainGallery_Empty"></div>
          <template v-else>

            <div
              v-if="diff_searchResult[ix].rq"
              class="MainGallery_Rq MainGallery_Color">
              {{ diff_searchResult[ix].rq }}
            </div>

            <div
              v-if="diff_searchResult[ix].topSpeed"
              class="MainGallery_topSpeed MainGallery_Color">
              {{ diff_searchResult[ix].topSpeed }}
            </div>

            <div
              v-if="diff_searchResult[ix].acel"
              class="MainGallery_acel MainGallery_Color">
              {{ diff_searchResult[ix].acel }}
            </div>

            <div
              v-if="diff_searchResult[ix].hand"
              class="MainGallery_hand MainGallery_Color">
              {{ diff_searchResult[ix].hand }}
            </div>

            <div
              v-if="diff_searchResult[ix].drive"
              class="MainGallery_drive MainGallery_Color">
              {{ diff_searchResult[ix].drive }}
            </div>

            <div
              v-if="diff_searchResult[ix].tyres"
              class="MainGallery_tyres MainGallery_Color">
              {{ diff_searchResult[ix].tyres }}
            </div>

            <div
              v-if="diff_searchResult[ix].class"
              :style="`--class-color: ${diff_searchResult[ix].color};`"
              class="MainGallery_Class">
              {{ diff_searchResult[ix].class }}
            </div>

            <div
              v-if="diff_searchResult[ix].year"
              class="MainGallery_Small MainGallery_Year MainGallery_Color">
              {{ diff_searchResult[ix].year }}
            </div>

            <div
              v-if="diff_searchResult[ix].abs !== diff_searchResult[ix]._abs"
              :class="{ MainGallery_ColorUp: diff_searchResult[ix]._abs }"
              class="MainGallery_Small MainGallery_Abs MainGallery_Color">
              ABS
            </div>

            <div
              v-if="diff_searchResult[ix].tcs !== diff_searchResult[ix]._tcs"
              :class="{ MainGallery_ColorUp: diff_searchResult[ix]._tcs }"
              class="MainGallery_Small MainGallery_Tcs MainGallery_Color">
              TCS
            </div>

            <div
              v-if="diff_searchResult[ix].prize !== diff_searchResult[ix]._prize"
              :class="{ MainGallery_ColorUp: diff_searchResult[ix]._prize }"
              class="MainGallery_Small MainGallery_Prize MainGallery_Color">
              Prize
            </div>

            <div
              v-if="diff_searchResult[ix].clearance"
              class="MainGallery_Clearance MainGallery_Compare">
              <div class="MainGallery_CompareLabel">Clearance</div>
              <div class="MainGallery_Old">{{ diff_searchResult[ix].clearance }}</div>
              <i class="ticon-arrow_right_3 MainGallery_Between" aria-hidden="true"/>
              <div class="MainGallery_Old">{{ diff_searchResult[ix]._clearance }}</div>
            </div>

            <div
              v-if="diff_searchResult[ix].mra"
              :class="{
                MainGallery_ColorUp: diff_searchResult[ix].mra < diff_searchResult[ix]._mra,
                MainGallery_ColorDown: diff_searchResult[ix].mra > diff_searchResult[ix]._mra && diff_searchResult[ix]._mra !== null
              }"
              class="MainGallery_Mra MainGallery_Compare">
              <div class="MainGallery_CompareLabel">MRA</div>
              <div class="MainGallery_Old">{{ diff_searchResult[ix].mra || "?" }}</div>
              <i class="ticon-arrow_right_3 MainGallery_Between" aria-hidden="true"/>
              <div class="MainGallery_Old">{{ diff_searchResult[ix]._mra || "?" }}</div>
            </div>

            <div
              v-if="diff_searchResult[ix].weight"
              :class="{
                MainGallery_ColorUp: diff_searchResult[ix].weight > diff_searchResult[ix]._weight,
                MainGallery_ColorDown: diff_searchResult[ix].weight < diff_searchResult[ix]._weight && diff_searchResult[ix]._weight !== null
              }"
              class="MainGallery_Weight MainGallery_Compare">
              <div class="MainGallery_CompareLabel">Weight</div>
              <div class="MainGallery_Old">{{ diff_searchResult[ix].weight }}</div>
              <i class="ticon-arrow_right_3 MainGallery_Between" aria-hidden="true"/>
              <div class="MainGallery_Old">{{ diff_searchResult[ix]._weight }}</div>
            </div>

          </template>
          
          <BaseCardGallery
            :car="car"
            :options="false" />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCardGallery from './BaseCardGallery.vue'
import data_cars from '../database/cars_final_PL20-fixed.json'
import plOld from '../database/cars_final_PL19_3.json'
import BaseDualSlider from './BaseDualSlider.vue'
import BaseChip from './BaseChip.vue'
import BaseFlag from './BaseFlag.vue'

export default {
  name: 'MainGallery',
  components: {
    BaseCardGallery,
    BaseDualSlider,
    BaseChip,
    BaseFlag
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      all_cars: data_cars,
      plOld: plOld,
      diff_cars: [],
      searchInput: '',
      searchActive: false,
      isFiltering: false,
      searchFocus: false,
      debounceFilter: null,
      searchLoading: false,
      searchMax: 20,
      showAllFilter: false,
      searchResult: [],
      diff_searchResult: [],
      showingLastest: false,
      maxCarNumber: 24,
      alreadySearched: false,
      filterCount: 0,
      chunkNumber: 30,
      chunkLoaded: {},
      showAllChunk: false,
      searchFilters: {
        yearStart: 1910,
        yearEnd: 2024,
        yearModel: [],
        rqStart: 10,
        rqEnd: 114,
        rqModel: [],
        topSpeedStart: 50,
        topSpeedEnd: 330,
        topSpeedModel: [],
        acelStart: 1.5,
        acelEnd: 40,
        acelModel: [],
        handStart: 30,
        handEnd: 110,
        handModel: [],
        mraStart: 0,
        mraEnd: 160,
        mraModel: [],
        weightStart: 300,
        weightEnd: 7000,
        weightModel: [],
        seatsStart: 1,
        seatsEnd: 9,
        seatsModel: [],
        classes: ["F","E","D","C","B","A","S"],
        classesColors: ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFC717"],
        classesModel: [],
        onlyAnyChangeModel: [],
        onlyNewRarityModel: [],
        onlyNewPerformanceModel: [],
        onlyNewTyresModel: [],
        onlyNewDriveModel: [],
        onlyNewClearanceModel: [],
        onlyNewCarsModel: [],
        tyres: ["Performance", "Standard", "All-surface", "Off-road", "Slick"],
        tyresModel: [],
        drives: ["FWD", "RWD", "4WD"],
        drivesModel: [],
        clearances: ["Low", "Mid", "High"],
        clearancesModel: [],
        countrys: ["DE", "JP", "US", "GB", "IT", "FR", "AU", "KR", "SE", "NL", "MY", "AT", "CN", "HR", "NZ", "AE", "BR", "CH", "ZA"],
        countrysModel: [],
        prizes: ["Prize Cars", "Non-Prize Cars"],
        prizesModel: [],
        bodyTypes: ["Convertible", "Coupe", "Estate", "Hatchback", "MPV", "Pickup", "Roadster", "Saloon", "SUV", "Van"],
        bodyTypesModel: [],
        fuel: ["Bioethanol", "Diesel", "Electric", "Hybrid", "Hydrogen", "Misc", "Petrol"],
        fuelModel: [],
        engine: ["Front", "Mid", "Mid-rear", "Mixed", "Rear"],
        engineModel: [],
        tags: [
          "5th Anniversary",
          "Amalfi Coast Cruising",
          "American Dream",
          "American Frontier",
          "Around the World",
          "As Seen on YT",
          "Asia-Pacific Grand Prix",
          "Call of the Wild",
          "Christmas Collection",
          "Christmas Collection 22",
          "Concept",
          "Cutting Edge",
          "Drivers Choice",
          "Eco Friendly",
          "Electric Excellence",
          "Enter the Black Forest",
          "European Revolution",
          "Famous Tracks",
          "French Renaissance",
          "German Renaissance",
          "Great Exhibition",
          "Hot Hatch",
          "Hypercar",
          "Immortalised in Carbon",
          "In the Shadows",
          "Innovative",
          "Interstellar",
          "Italian Renaissance",
          "Japan Pro Tour",
          "Learn the Savannah Way",
          "Loch to Loch",
          "Loves Me, Loves Me Not",
          "Motorsport",
          "Muscle Car",
          "Nightmare Fuel",
          "Old Guard",
          "Originals",
          "Pacific Coast Highway",
          "Photo Finish",
          "Racing Royalty",
          "Rest of the World",
          "Ride of the Valkyries",
          "Riders on the Storm",
          "Road",
          "Roads Most Travelled",
          "Silver Screen",
          "Sleeper",
          "Street Racer",
          "Style Icon",
          "Sub-Zero",
          "Summer Games",
          "Supercar",
          "Team Favourite",
          "The Great Outdoors",
          "The Horror Show",
          "The Unicorns",
          "Two Tone",
          "Ultra Expensive",
          "Wild Ride",
          "World Expo",
          "Year of the Ox",
          "Year of the Rabbit",
          "Year of the Rat",
          "Year of the Tiger",
          "Beige",
          "Black",
          "Blue",
          "Brown",
          "Gold",
          "Green",
          "Orange",
          "Pink",
          "Purple",
          "Red",
          "Silver or Grey",
          "Turquoise",
          "White",
          "Yellow"
        ],
        tagsModel: [],
        brands: [
          "AC",
          "Acura",
          "Alfa Romeo",
          "AMC",
          "Apollo", // logic "Gumpert"
          "Arash",
          "Ariel",
          "Aston Martin",
          "Audi",
          "Austin",
          "BAC",
          "Bentley",
          "BMW",
          "Brabham",
          "Bristol",
          "Bufori",
          "Bugatti",
          "Buick",
          "Cadillac",
          "Caterham",
          "Chevrolet",
          "Chrysler",
          "Citroen",
          "De Tomaso",
          "DMC",
          "Dodge",
          "Donkervoort",
          "DS",
          "Eagle",
          "Fiat",
          "Ford",
          "Geo",
          "Ginetta",
          "Giocattolo",
          "GMC",
          "Hennessey",
          "Holden",
          "Honda",
          "Hudson",
          "Hummer",
          "Hyundai",
          "Infiniti",
          "Jaguar",
          "Koenigsegg",
          "KTM",
          "Lamborghini",
          "Lancia",
          "Land Rover",
          "Lincoln",
          "Lotus",
          "Maserati",
          "Mazda",
          "McLaren",
          "Mercedes-Benz",
          "Mercury",
          "MG",
          "Mini",
          "Mitsubishi",
          "Morgan",
          "Nissan",
          "Oldsmobile",
          "Pagani",
          "Peugeot",
          "Plymouth",
          "Pontiac",
          "Porsche",
          "RAM",
          "Renault",
          "Rezvani",
          "Rimac",
          "Rover",
          "RUF",
          "Saleen",
          "Saturn",
          "SCG", // logic "Scuderia Cameron Glickenhaus"
          "Smart",
          "Spyker",
          "Subaru",
          "Suzuki",
          "TVR",
          "Ultima",
          "Vauxhall",
          "Volkswagen",
          "Volvo",
          "W Motors",
          "Zenos"
        ],
        brandsModel: [],
      },
    }
  },
  watch: {},
  beforeMount() {
    this.clearFilter();
    this.all_cars.map(x => {
      Vue.set(x, "visible", false);
    })

    this.searchResult = this.all_cars;
    this.resolveDiffs();

    [...Array(Math.ceil(this.chunkNumber)).keys()].map((x,ix) => {
      this.chunkLoaded[ix] = false;
    })

    
    this.applyFilter();

  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 1500); 
    window.addEventListener("scroll", vm.handleScroll);

    this.handleScroll(); // load inicial
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {},
  methods: {
    carPicture(file) {
      try {
        return require('@/imgs_final/' + file + '.jpg');
      } catch (error) {
        console.log(file);
        return require('@/assets/blank.jpg');
      }
    },
    click(car) {
      console.log(JSON.parse(JSON.stringify(car)));
    },
    carPhoto(car) {
      let parsed;
      try {
        parsed = require('@/imgs_final/' + car.rid + '.jpg');
      } catch (error) {
        return ''
      }
      parsed = parsed.replaceAll("(","\\(").replaceAll(")","\\)");
      parsed = parsed.replaceAll("'","\\'");
      return parsed ? 'background-image: url('+parsed+');' : ''
    },
    searchInputFunc(e) {
      // debugger;
      // console.log(e);
      // console.log(this.searchInput);
      // this.searchInput
      this.debounceFilter();
      // this.searchLoading = true;
    },
    changeFilter(showAll = false) {
      // console.log("changeFilter");
      // this.searchLoading = false;
      let result = [];
      // let searchStr = this.searchInput.toLowerCase().replace(/  +/g, ' ').split(" ");
      let searchStr = this.searchInput.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      let strIndex = -1;
      let prePush;
      let tryFind;
      this.resolveFilterCount();
      if (searchStr === "" && this.filterCount === 0) {
        this.searchLoading = false;
        this.searchResult = this.all_cars;
        this.resolveDiffs();
        return [];
      }

      // search and/or filter
      this.all_cars.map((x, ix) => {
        // if (result.length < 333 || showAll) {
        if (true || showAll) {

          let shouldPush = false;
          if (searchStr && searchStr !== "") {
            strIndex = x.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").indexOf(searchStr);
          } else {
            strIndex = -2;
          }

          if (this.filterCount > 0) {
            if (strIndex > -1 || strIndex === -2) {
              if (this.checkMatchFilter(x)) {
                shouldPush = true;
              }
            }
          } else {
            if (strIndex > -1) {
              shouldPush = true;
            }
          }

          if (shouldPush) {
            prePush = JSON.parse(JSON.stringify(x));
            if (strIndex > -1) {
              prePush.locatedName = x.name.substr(0, strIndex)+'<b>'+x.name.substr(strIndex, searchStr.length)+'</b>'+x.name.substr(strIndex + searchStr.length);
              prePush.locatedIndex = strIndex;
              if (x.name[strIndex - 1] === ' ') {
                prePush.locatedPlus = true;
              }
            } else {
              prePush.locatedName = x.name;
            }

            result.push(prePush);
          }


        }
      })

      // class and photo
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

      // inteligent sort
      // if (searchStr && searchStr !== "") {
      //   result.sort(function(a, b) {
      //     if (a.locatedPlus && !b.locatedPlus) return -1;
      //     if (b.locatedPlus && !a.locatedPlus) return 1;
      //     return a.locatedIndex - b.locatedIndex;
      //   });
      // }

      this.searchMax = 20;

      // debugger;

      this.searchResult = result;
      this.searchLoading = false;
      this.showingLastest = false;
      this.alreadySearched = true;
      this.showAllFilter = showAll;
      this.resolveDiffs();

    },
    resolveDiffs() {
      let difResult = [];
      this.searchResult.map((y, ix) => {
        // if (ix > 200) return;
        let dif = {};

        let plOldcar = this.plOld.find(x => {
          if (x.rid === y.rid) {

            if (x.rq !== y.rq) {
              dif.rq = x.rq
              dif._rq = y.rq
            }
            if (x.class !== y.class) {
              dif.class = x.class
              dif._class = y.class
              dif.color = Vue.resolveClass(x.rq, x.class, "color")
            }
            if (x.year !== y.year) {
              dif.year = x.year
              dif._year = y.year
            }
            if (x.abs !== y.abs) {
              dif.abs = x.abs
              dif._abs = y.abs
            }
            if (x.tcs !== y.tcs) {
              dif.tcs = x.tcs
              dif._tcs = y.tcs
            }
            if (x.prize !== y.prize) {
              dif.prize = x.prize
              dif._prize = y.prize
            }
            if (x.clearance !== y.clearance) {
              dif.clearance = x.clearance
              dif._clearance = y.clearance
            }
            if (x.topSpeed !== y.topSpeed) {
              dif.topSpeed = x.topSpeed
              dif._topSpeed = y.topSpeed
            }
            if (x.acel !== y.acel) {
              dif.acel = x.acel
              dif._acel = y.acel
            }
            if (x.hand !== y.hand) {
              dif.hand = x.hand
              dif._hand = y.hand
            }
            if (x.drive !== y.drive) {
              dif.drive = x.drive
              dif._drive = y.drive
            }
            if (x.tyres !== y.tyres) {
              dif.tyres = x.tyres
              dif._tyres = y.tyres
            }
            if (x.mra !== y.mra) {
              dif.mra = x.mra
              dif._mra = y.mra
            }
            if (x.weight !== y.weight) {
              dif.weight = x.weight
              dif._weight = y.weight
            }

            return true;

          }
        })
        if (!plOldcar) {
          dif.new = true;
        }

        difResult.push(dif);

      })
      this.diff_searchResult = difResult;
      Object.keys(this.chunkLoaded).map(key => {
        this.chunkLoaded[key] = false;
      })
      this.showAllChunk = false;
      this.loadChunk(0);
    },
    searchBlur() {
      setTimeout(() => {
        this.searchFocus = false;
      }, 200);
    },
    defaultFilters(type) {
      if (type === "yearModel") return [1910, 2024];
      if (type === "rqModel") return [10, 114];
      if (type === "topSpeedModel") return [50, 330];
      if (type === "acelModel") return [1.5, 40];
      if (type === "handModel") return [30, 110];
      if (type === "mraModel") return [0, 160];
      if (type === "weightModel") return [300, 7000];
      if (type === "seatsModel") return [1, 9];
    },
    clearFilter() {
      this.searchFilters.yearModel = this.defaultFilters("yearModel");
      this.searchFilters.rqModel = this.defaultFilters("rqModel");
      this.searchFilters.topSpeedModel = this.defaultFilters("topSpeedModel");
      this.searchFilters.acelModel = this.defaultFilters("acelModel");
      this.searchFilters.handModel = this.defaultFilters("handModel");
      this.searchFilters.mraModel = this.defaultFilters("mraModel");
      this.searchFilters.weightModel = this.defaultFilters("weightModel");
      this.searchFilters.seatsModel = this.defaultFilters("seatsModel");
      this.searchFilters.classesModel = [];
      this.searchFilters.onlyAnyChangeModel = [];
      this.searchFilters.onlyNewRarityModel = [];
      this.searchFilters.onlyNewPerformanceModel = [true];
      this.searchFilters.onlyNewTyresModel = [];
      this.searchFilters.onlyNewDriveModel = [];
      this.searchFilters.onlyNewClearanceModel = [];
      this.searchFilters.onlyNewCarsModel = [];
      this.searchFilters.tyresModel = [];
      this.searchFilters.drivesModel = [];
      this.searchFilters.clearancesModel = [];
      this.searchFilters.countrysModel = [];
      this.searchFilters.prizesModel = [];
      this.searchFilters.bodyTypesModel = [];
      this.searchFilters.fuelModel = [];
      this.searchFilters.engineModel = [];
      this.searchFilters.tagsModel = [];
      this.searchFilters.brandsModel = [];
    },
    resolveFilterCount() {
      let defaults = {
        yearModel: this.defaultFilters("yearModel"),
        rqModel: this.defaultFilters("rqModel"),
        topSpeedModel: this.defaultFilters("topSpeedModel"),
        acelModel: this.defaultFilters("acelModel"),
        handModel: this.defaultFilters("handModel"),
        mraModel: this.defaultFilters("mraModel"),
        weightModel: this.defaultFilters("weightModel"),
        seatsModel: this.defaultFilters("seatsModel"),
        classesModel: [],
        onlyAnyChangeModel: [],
        onlyNewRarityModel: [],
        onlyNewPerformanceModel: [],
        onlyNewTyresModel: [],
        onlyNewDriveModel: [],
        onlyNewClearanceModel: [],
        onlyNewCarsModel: [],
        tyresModel: [],
        drivesModel: [],
        clearancesModel: [],
        countrysModel: [],
        prizesModel: [],
        bodyTypesModel: [],
        fuelModel: [],
        engineModel: [],
        tagsModel: [],
        brandsModel: []
      }
      let count = 0;

      let vm = this;
      Object.keys( this.searchFilters ).forEach(function (key) {
        if (key.includes("Model")) {
          if (defaults[key] && JSON.stringify(vm.searchFilters[key]) !== JSON.stringify(defaults[key])) {
            count++;
          }
        }
      });

      this.filterCount = count;
    },
    checkMatchFilter(car) {
      // between
      if ( !this.filterCheckBetween(car.year, this.searchFilters.yearModel) ) return false;
      if ( !this.filterCheckBetween(car.rq, this.searchFilters.rqModel) ) return false;
      if ( !this.filterCheckBetween(car.topSpeed, this.searchFilters.topSpeedModel) ) return false;
      if ( JSON.stringify(this.searchFilters.acelModel) !== JSON.stringify(this.defaultFilters("acelModel")) ) {
        if ( !this.filterCheckBetween(car.acel, this.searchFilters.acelModel) ) return false;
      }
      if ( !this.filterCheckBetween(car.hand, this.searchFilters.handModel) ) return false;
      if ( JSON.stringify(this.searchFilters.mraModel) !== JSON.stringify(this.defaultFilters("mraModel")) ) {
        if ( !this.filterCheckBetween(car.mra, this.searchFilters.mraModel) ) return false;
      }
      if ( !this.filterCheckBetween(car.weight, this.searchFilters.weightModel) ) return false;
      if ( !this.filterCheckBetween(car.seats, this.searchFilters.seatsModel) ) return false;

      // includes
      if ( !this.filterCheckIncludes(car.class, this.searchFilters.classesModel) ) return false;
      if ( !this.filterCheckIncludes(car.tyres, this.searchFilters.tyresModel) ) return false;
      if ( !this.filterCheckIncludes(car.drive, this.searchFilters.drivesModel) ) return false;
      if ( !this.filterCheckIncludes(car.clearance, this.searchFilters.clearancesModel) ) return false;
      if ( !this.filterCheckIncludes(car.country, this.searchFilters.countrysModel) ) return false;

      if ( !this.filterCheckIncludes(car.fuel, this.searchFilters.fuelModel) ) return false;
      if ( !this.filterCheckIncludes(car.engine, this.searchFilters.engineModel) ) return false;

      if ( !this.filterCheckIncludesArray(car.bodyTypes, this.searchFilters.bodyTypesModel) ) return false;
      if ( !this.filterCheckIncludesArray(car.tags, this.searchFilters.tagsModel) ) return false;
      if ( !this.filterCheckIncludes(car.brand, this.searchFilters.brandsModel) ) return false;

      if ( this.searchFilters.prizesModel.length > 0 ) {
        if ( car.prize && !this.searchFilters.prizesModel.includes("Prize Cars") ) return false;
        if ( !car.prize && !this.searchFilters.prizesModel.includes("Non-Prize Cars") ) return false;
      }

      let oldCar = this.plOld.find(old => old.rid === car.rid);

      if ( this.searchFilters.onlyAnyChangeModel.includes(true) ) {
        if ( !oldCar ) {
          return false;
        }
        if (
            oldCar.class === car.class &&
            oldCar.tyres === car.tyres &&
            oldCar.drive === car.drive &&
            oldCar.clearance === car.clearance &&
            oldCar.rq === car.rq &&
            oldCar.year === car.year &&
            oldCar.abs === car.abs &&
            oldCar.tcs === car.tcs &&
            oldCar.prize === car.prize &&
            oldCar.topSpeed === car.topSpeed &&
            oldCar.acel === car.acel &&
            oldCar.hand === car.hand &&
            (oldCar.mra === null || oldCar.mra === car.mra) &&
            oldCar.weight === car.weight
          ) {
          return false;
        }
      }

      if ( this.searchFilters.onlyNewPerformanceModel.includes(true) ) {
        if ( !oldCar ) {
          return false;
        }
        if (
            oldCar.tyres === car.tyres &&
            oldCar.drive === car.drive &&
            oldCar.clearance === car.clearance &&
            oldCar.abs === car.abs &&
            oldCar.tcs === car.tcs &&
            oldCar.topSpeed === car.topSpeed &&
            oldCar.acel === car.acel &&
            oldCar.hand === car.hand &&
            (oldCar.mra === null || oldCar.mra === car.mra) &&
            oldCar.weight === car.weight
          ) {
          return false;
        }
      }

      if ( this.searchFilters.onlyNewRarityModel.includes(true) ) {
        if ( !oldCar || oldCar.class === car.class ) {
          return false;
        }
      }

      if ( this.searchFilters.onlyNewTyresModel.includes(true) ) {
        if ( !oldCar || oldCar.tyres === car.tyres ) {
          return false;
        }
      }

      if ( this.searchFilters.onlyNewDriveModel.includes(true) ) {
        if ( !oldCar || oldCar.drive === car.drive ) {
          return false;
        }
      }

      if ( this.searchFilters.onlyNewClearanceModel.includes(true) ) {
        if ( !oldCar || oldCar.clearance === car.clearance ) {
          return false;
        }
      }

      if ( this.searchFilters.onlyNewCarsModel.includes(true) ) {
        if ( !!oldCar ) {
          return false;
        }
      }

      return true;
    },
    filterCheckBetween(value, array) {
      return value >= array[0] && value <= array[1]
    },
    filterCheckIncludes(value, array) {
      if (array.length === 0) return true;
      return array.includes(value);
    },
    filterCheckIncludesArray(valuesArray, array) {
      if (array.length === 0) return true;
      return !!array.find(x => {
        return valuesArray.includes(x);
      });
    },
    applyFilter() {
      this.changeFilter();
      this.isFiltering = false;
      // let container = document.querySelector(".Main_SearchMid");
      // container.scrollTo({ top: 0 });
    },
    closeFilterText() {
      this.searchInput = '';
      this.searchResult = this.all_cars;
      this.resolveDiffs();
      this.alreadySearched = false;
      this.showingLastest = true;
      this.showAllFilter = false;
    },
    visibilityChanged(isVisible, car) {
      if (isVisible) {
        car.visible = true;
      }
      console.log(car.name);
    },
    handleScroll() {
      let total = document.querySelector(".MainGallery_Layout").offsetHeight;
      let current = window.scrollY;
      if (!total) {
        debugger;
        return
      };
      // console.log(current, total);
      // console.log("percent", Math.round(current / total * 100), "chunk", Math.round((current / total * 100) / this.chunkNumber) );
      this.loadChunk(Math.round( (current / total * 100) / (100 / this.chunkNumber) ));
    },
    loadChunk(chunkId) {
      if (this.chunkLoaded[chunkId] === true || this.showAllChunk) {
        // console.log("chunkLoaded", chunkId);
        return;
      }
      let total = this.searchResult.length;
      // debugger;
      console.log(total);

      if (total < 200) {
        this.showAllChunk = true;
        this.searchResult.map(x => {
          x.visible = true;
        })
        return;
      }

      this.searchResult.map((x,index) => {
        let matchedChunk = Math.floor(index / (total /this.chunkNumber ));
        if ( matchedChunk === chunkId || matchedChunk === chunkId-1 || matchedChunk === chunkId+1 ) {
          x.visible = true;
          // console.log(index);
        }
      })
      // console.log("loading", chunkId);
      // this.chunkLoaded[chunkId-1] = true;
      this.chunkLoaded[chunkId] = true;
      // this.chunkLoaded[chunkId+1] = true;
      // console.log(this.chunkLoaded);
      
    },
    temp(str) {
      console.log(str);
      console.log(str.replaceAll("(","").replaceAll(")","").replaceAll(".","").replaceAll("-",""));
      navigator.clipboard.writeText(str);
    }
  },
}
</script>

<style>
.MainGallery_Box {
  /* display: flex; */
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 auto;
  margin-top: 50px;
  justify-content: center;
  max-width: 1260px;
  text-align: center;
}
.MainGallery_Item {
  display: inline-block;
  width: 415px;
  height: 256px;
  position: relative;
}
.MainGallery_Img {
}
.MainGallery_Class {
  background-color: var(--class-color);
  color: black;
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 50%;
  font-weight: bold;
  position: absolute;
  top: 108px;
  font-size: 20px;
  left: 18px;
}
.MainGallery_Color {
  background-color: #a30000;
  padding: 4px 7px;
  font-weight: bold;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 18px;
}
.MainGallery_down {
  color: #ff5050;
  font-size: 25px;
}
.MainGallery_Rq {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 149px;
  right: 362px;
  align-items: center;
}
.MainGallery_Empty + .BaseCardGallery_Layout .Car_Header {
  opacity: 0.3;
}
.MainGallery_topSpeed {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 34px;
  left: 355px;
  align-items: center;
}
.MainGallery_acel {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 73px;
  left: 355px;
  align-items: center;
}
.MainGallery_hand {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 113px;
  left: 355px;
  align-items: center;
}
.MainGallery_drive {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 152px;
  left: 355px;
  align-items: center;
}
.MainGallery_tyres {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 190px;
  right: 121px;
  align-items: center;
}
.MainGallery_Small {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  align-items: center;
  z-index: 50;
  font-size: 10px;
}
.MainGallery_Year {  
  top: 34px;
  right: 121px;  
}
.MainGallery_Abs {  
  top: 34px;
  right: 360px;  
}
.MainGallery_Tcs {  
  top: 57px;
  right: 360px;
}
.MainGallery_Prize {  
  top: 80px;
  right: 360px;
}
.MainGallery_Clearance {
  top: -20px;
  right: 30px;
}
.MainGallery_Mra {
  top: 190px;
  left: 55px;
}
.MainGallery_Weight {
  top: -21px;
  left: 54px;
}
.MainGallery_Compare {
  display: inline-flex;
  gap: 6px;
  position: absolute;
  color: white;
  align-items: center;
  background-color: #555;
  padding: 2px 4px;
  /* position: relative; */
}
.MainGallery_CompareLabel {
  position: absolute;
  top: 7px;
  right: calc(100% + 2px);
  font-size: 11px;
  opacity: 0.4;
}


.MainGallery_ColorUp {
  background-color: #007000;
}
.MainGallery_ColorDown {
  background-color: #a30000;
}
.MainGallery_Layout .Main_SearchMid {
  height: unset;
  overflow-y: auto;
  margin-bottom: 150px;
  position: absolute;
  z-index: 100;
  box-shadow: 0px 10px 0px 0px #00000087;
}
.MainGallery_Layout .Main_FilterItems > *:last-child {
  margin-top: 50px;
}
.MainGallery_Layout .Main_FiltersButton {
  border-top-right-radius: 0px;
}

.MainGallery_NewCar {
  color: white;
  position: absolute;
  top: 190px;
  left: 163px;
  align-items: center;
  background-color: #007000;
  padding: 4px 27px;
  font-weight: bold;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 18px;
}
</style>