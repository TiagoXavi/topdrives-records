<template>
  <div class="MainCarsEdit_Layout">
    <div class="MainCarsEdit_FilterLayout">
      <div class="MainCarsEdit_SearchHeader">
        <div class="Main_SearchHeader">
          <div v-if="!isFiltering" class="Main_SearchFieldBox">
            <input
              v-model="searchInput"
              id="SearchInput"
              :placeholder="$t('m_search')"
              class="Main_SearchInput"
              type="search"
              @focus="searchFocus = true;"
              @blur="searchBlur()"
              @input="searchInputFunc($event)">
            <button
              v-if="searchInput && searchInput.length > 0 || alreadySearched"
              class="D_Button Main_SearchInputClose"
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
            <div class="Main_FilterChipsFlex" style="margin: 0 10px;">
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
                  v-if="
                    (!$store.state.oldTags.includes(item) || $store.state.showOldTags) &&
                    (!$store.state.upcomingTags.includes(item) || $store.state.showUpcomingTags)
                  "
                  class="BaseChip_MinWidth BaseChip_DontCrop"
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
    <div style="display: flex; gap: 15px;">
      <button
        class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig D_ButtonDarkPrimary"
        @click="processAll()">Copy selected</button>
      <button
        class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonBig D_ButtonDarkPrimary"
        @click="collection = [];">Clear selection</button>
      <span>{{ collection.length }} selected</span>
      <span>Filtered cars: {{ filterCount }}</span>
    </div>
    <div class="MainCarsEdit_Box">
      <div
        v-for="(car, ix) in searchResult"
        v-if="car.visible"
        class="MainCarsEdit_Item">
          
          <BaseCarEditCard
            :car="car"
            :marked="collection.includes(car.rid)"
            :options="false"
            @action="actionClick(car)" />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCarEditCard from './BaseCarEditCard.vue'
import BaseCardGallery from './BaseCardGallery.vue'
import data_cars from '../database/cars_final.json' // internal
import pl14 from '../database/cars_final_PL14.json'
import BaseDualSlider from './BaseDualSlider.vue'
import BaseChip from './BaseChip.vue'
import BaseFlag from './BaseFlag.vue'

export default {
  name: 'MainCarsEdit',
  components: {
    BaseCarEditCard,
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
      pl14: pl14,
      diff_cars: [],
      collection: [],
      filterCount: 0,
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
        yearEnd: 2025,
        yearModel: [],
        rqStart: 10,
        rqEnd: 119,
        rqModel: [],
        topSpeedStart: 25,
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
        classesColors: ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFAF17"],
        classesModel: [],
        onlyNewRarityModel: [],
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
        countrys: ["US", "DE", "JP", "GB", "IT", "FR", "AU", "SE", "KR", "CZ", "CN", "NL", "BR", "MY", "AT", "DK", "HR", "ZA", "NZ", "AE", "AR", "IN", "MX", "CH"],
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
          "American Overdrive",
          "Around the World",
          "As Seen on YT",
          "Asia-Pacific Grand Prix",
          "Asia-Pacific Revival",
          "Call of the Wild",
          "Chariots of the Gods",
          "Christmas Collection",
          "Christmas Collection 22",
          "Coast to Coast",
          "Concept",
          "Cutting Edge",
          "Desperados",
          "Drivers Choice",
          "Eco Friendly",
          "Electric Excellence",
          "Enter the Black Forest",
          "European Grand Tour",
          "European Revolution",
          "European New Wave",
          "Famous Tracks",
          "Gaz's Collection",
          "Gunter's Collection",
          "Heavy Metal",
          "French Renaissance",
          "French Riviera",
          "German Renaissance",
          "Great Exhibition",
          "Hot Hatch",
          "Hypercar",
          "Immortalised in Carbon",
          "In the Shadows",
          "In the Shadows 24",
          "Innovative",
          "Interstellar",
          "Italian Renaissance",
          "Japan Pro Tour",
          "Learn the Savannah Way",
          "Lina's Collection",
          "Lina's Collection 2",
          "Loch to Loch",
          "Loves Me, Loves Me Not",
          "Marilyn's Collection",
          "Motorsport",
          "Muscle Car",
          "New Beginnings",
          "Nightmare Fuel",
          "Niklas' Collection",
          "Niklas' Collection 2",
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
          "Summer Games 24",
          "Supercar",
          "Team Favourite",
          "The Great Outdoors",
          "The Horror Show",
          "The Unicorns",
          "Touma's Collection",
          "Track",
          "Trading Paint",
          "Two Tone",
          "Ultra Expensive",
          "Wild Ride",
          "World Expo",
          "Year of the Dragon",
          "Year of the Ox",
          "Year of the Rabbit",
          "Year of the Rat",
          "Year of the Snake",
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
          "Silver/Grey",
          "Turquoise",
          "White",
          "Yellow"
        ],
        tagsModel: [],
        brands: [
          "AC",
          "Acura",
          "Alfa Romeo",
          "Alpine",
          "AMC",
          "Apollo", // logic "Gumpert"
          "Arash",
          "Ariel",
          "Aston Martin",
          "Audi",
          "Austin",
          "BAC",
          "Bentley",
          "Bizzarrini",
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
          "Drako",
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
          "Matra",
          "Mazda",
          "McLaren",
          "McMurtry",
          "Mercedes-Benz",
          "Mercury",
          "MG",
          "Mini",
          "Mitsubishi",
          "Mitsuoka",
          "Morgan",
          "Nissan",
          "Oldsmobile",
          "Pagani",
          "Peugeot",
          "Pininfarina",
          "Plymouth",
          "Pontiac",
          "Porsche",
          "Radical",
          "RAM",
          "Renault",
          "Rezvani",
          "Rimac",
          "Rover",
          "RUF",
          "Saleen",
          "Saturn",
          "SCG", // logic "Scuderia Cameron Glickenhaus"
          "Skoda",
          "Smart",
          "Spyker",
          "Subaru",
          "Suzuki",
          "Talbot",
          "TVR",
          "Ultima",
          "Vauxhall",
          "Volkswagen",
          "Volvo",
          "W Motors",
          "Zenos",
          "Zenvo"
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

    // let aniv = [ "1525", "2732", "1519", "2697", "2707", "1545", "3090", "2682", "1683", "1705", "1692", "1824", "3385", "3425", "873", "583", "3312", "3121", "3122", "2681", "396", "757", "401", "1755", "3260", "3164", "3519", "2678", "2959", "594", "3000", "2687", "406", "3264", "1901", "1090", "2864", "2909", "3143", "59", "1618", "417", "3135", "3004", "416", "3367", "2988", "2963", "3471", "715", "1820", "168", "3265", "75", "2827", "3308", "2915", "304", "2850", "1904", "3439", "2903", "1068", "251", "323", "2977", "3398", "971", "1175", "1581", "3253", "1255", "1109", "260", "1186", "662", "184", "327", "481", "1221", "1430", "1046", "1045", "185", "446", "784", "3257", "747", "3348", "1048", "3243", "2784", "3177", "3338", "753", "692", "197", "1603" ];


    //Workshop
    // this.all_cars.map(car => {
    //   if (aniv.includes(car.tdid)) {
    //     car.tags.push("5th Anniversary")
    //   }
    // })

    // debugger;
    // navigator.clipboard.writeText(JSON.stringify(this.all_cars));

  },
  mounted() {
    let vm = this;
    this.debounceFilter = Vue.debounce(this.changeFilter, 500); 
    window.addEventListener("scroll", vm.handleScroll);

    this.handleScroll(); // load inicial
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {},
  methods: {
    click(car) {
      console.log(JSON.parse(JSON.stringify(car)));
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
        if (result.length < 400 || showAll || true) {

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
            Vue.set(x, "ridPhoto", Vue.carPhoto(x));
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

        let pl14car = this.pl14.find(x => {
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
        if (!pl14car) {
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
      if (type === "yearModel") return [1910, 2025];
      if (type === "rqModel") return [10, 119];
      if (type === "topSpeedModel") return [25, 330];
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
      this.searchFilters.onlyNewRarityModel = [];
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
        onlyNewRarityModel: [],
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

      let oldCar = this.pl14.find(old => old.rid === car.rid);

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
      let total = document.querySelector(".MainCarsEdit_Layout").offsetHeight;
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
      this.filterCount = total;
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
          // console.log(index);
        }
      })

      // console.log("loading", chunkId);
      // this.chunkLoaded[chunkId-1] = true;
      this.chunkLoaded[chunkId] = true;
      // this.chunkLoaded[chunkId+1] = true;
      
    },
    temp(str) {
      console.log(str);
      console.log(str.replaceAll("(","").replaceAll(")","").replaceAll(".","").replaceAll("-",""));
      navigator.clipboard.writeText(str);
    },
    action() {
      this.all_cars.map(x => {
        if (c.rid === x.rid) {
          // action

        }
      })

    },
    processAll() {
      this.all_cars.map(x => {
        delete x.visible
      });
      // let fff = [ "Porsche_Cayenne_Turbo_GT_2021", "Lamborghini_Aventador_S_2018", "Lamborghini_Urus_2018", "BMW_X5_M_2009", "Mercedes-Benz_AMG_GLE_63_S_2015", "Porsche_911_GTS_992_2021", "Audi_R8_RWD_2020", "Porsche_911_GT3_RS_4.0_2011", "Ford_Focus_RS_2016", "BMW_M3_Competition_Saloon_2020", "BMW_M5_30_Jahre_Edition_2014", "BMW_M240i_2017", "BMW_M4_2014", "BMW_M6_2016", "Porsche_911_Carrera_4_2000", "Audi_RS6_Avant_C5_2004", "BMW_M2_(delimited)_2016", "Volkswagen_Touareg_2018", "Bentley_Flying_Spur_2018", "BMW_420i_xDrive_Coupe_2020", "BMW_1-series_M_coupe_2011", "BMW_330e_2016", "BMW_X1_2017", "Land_Rover_Range_Rover_Velar_2018", "BMW_X5_2008", "Honda_Civic_Type_R_2016", "Mercedes-Benz_SL55_AMG_2002", "Volvo_V90_T8_AWD_2018", "Audi_A3_Sportback_8V_2018", "Jaguar_F-Type_Coupe_2016", "BMW_X5_4.4i_2000", "Ford_Fiesta_ST_2018", "Volkswagen_Tiguan_2017", "Honda_CR-V_1.6_i-DTEC_2016", "Nissan_Qashqai_2008", "Ford_Ranger_Wildtrak_2017", "Volkswagen_Tiguan_2011", "BMW_M3_1986", "Volkswagen_Passat_2018", "Mini_Cooper_2016", "Honda_HR-V_1.8_4WD_2016", "Renault_Alpine_A110_1971", "Ford_Kuga_2016", "Suzuki_Jimny_Sierra_2019", "Volkswagen_Golf_2017", "Mazda_3_2018", "Ford_Focus_2006", "Ford_Puma_1.7_1997", "Mazda_MX-5_1998", "Vauxhall_Astra_2016", "Mercedes-Benz_300_CE24_Cabriolet_1988", "Nissan_Qashqai_2016", "Honda_Civic_2016", "Ford_Focus_2015", "Land_Rover_Defender_90_2011", "Porsche_911_1965", "Nissan_Juke_2010", "Peugeot_3008_2018", "Nissan_Micra_2016", "Honda_Jazz_2016", "Volkswagen_Polo_2009", "Ford_Fiesta_1997", "Hummer_H1_1992", "Volkswagen_up_2013", "Ford_Fiesta_1993", "Suzuki_Alto_Works_2016", "Ford_Fiesta_1983", "Nissan_Micra_2011", "Peugeot_208_2018", "Nissan_Micra_2004", "Renault_Clio_2016", "Vauxhall_Corsa_1.4_2016", "Fiat_126p_1972", "Nissan_Micra_1991", "Suzuki_Cappuccino_(EA11R)_1991", "Ford_Fiesta_1976" ];
      // this.all_cars.map(x => {
      //   if (fff.includes(x.rid)) {
      //     // action
      //     x.tags.push("As Seen on YT")
      //   }
      // })

      this.collection.map(c => {
        this.all_cars.map(x => {
          if (c === x.rid) {
            // action
            x.tags.push("XXXXXXX")
  
          }
        })
      })


      // MRA Update
      // let newMra = { "Acura_NSX_1991": 64.2, "Acura_RSX_2002": 62.96, "Acura_TLX_2014": 75, "Alfa_Romeo_147_GTA_Cup_2003": 55.61, "Alfa_Romeo_155_GTA_Superturismo_1992": 102.56, "Alfa_Romeo_159_32_V6_Q4_2005": 65.69, "Alfa_Romeo_164_Q4_1994": 55.12, "Alfa_Romeo_Giulia_TZ2_1965": 73.97, "Alfa_Romeo_Iguana_1969": 83.82, "Ariel_Atom_3.5_2013": 69.14, "Aston_Martin_V12_Vanquish_2001": 75.73, "Audi_A3_Saloon_20_TDI_quattro_8V_2018": 47.62, "Audi_allroad_quattro_42_C5_2000": 68.32, "Audi_etron_2018": 63.53, "Audi_Q3_2018": 52.7, "Audi_R10_TDI_2006": 100, "Audi_RS_7_Sportback_2015": 80, "Audi_S6_C6_2006": 72.3, "BMW_640i_xDrive_2014": 61.73, "BMW_M5_2012": 102.44, "BMW_X4_2018": 61.22, "BMW_X6_2012": 56.28, "Cadillac_XLR-V_2006": 70.49, "Chevrolet_Camaro_ZL1_2015": 82.69, "Chevrolet_Corvette_2009": 70.78, "Chevrolet_Corvette_ZR1_1993": 79.66, "Chrysler_300C_Hemi_2005": 65.43, "Chrysler_by_Chrysler_360_CH_1971": 46.25, "Chrysler_by_Chrysler_CJ_1973": 53.54, "Chrysler_Centura_KB_1975": 43.86, "Chrysler_Drifter_Van_CL_1977": 44.9, "Chrysler_Valiant_Charger_770_CL_1976": 45.93, "Chrysler_Valiant_Charger_770_E55_VJ_1973": 71.88, "Chrysler_Valiant_Charger_770_SE_VH_1971": 71.88, "Chrysler_Valiant_Charger_RT_Six_Pack_VH_1971": 75.58, "Chrysler_Valiant_Charger_XL_VK_1975": 41.59, "Fiat_Abarth_X19_Prototipo_1974": 67.52, "Ford_Fairlane_500_1967": 47.74, "Ford_Falcon_Bathurst_Cobra_1978": 68.1, "Ford_Falcon_GT_1997": 53.69, "Ford_Falcon_GT_Hardtop_XB_1973": 67.37, "Ford_Falcon_XR6_Sprint_2016": 71.19, "Ford_Falcon_XR6_Turbo_2002": 68.67, "Ford_Falcon_XR6_Turbo_2012": 63.51, "Ford_Falcon_XR8_2000": 47.73, "Ford_Falcon_XR8_Sprint_2016": 67.69, "Ford_Falcon_XT_500_1968": 45.5, "Ford_FPV_F6_2008": 70.31, "Ford_FPV_F6_Rspec_Typhoon_2007": 72.97, "Ford_FPV_F6_Tornado_2005": 75.68, "Ford_FPV_F6_Typhoon_2005": 72.97, "Ford_FPV_Force_6_2006": 87.3, "Ford_FPV_Force_8_2006": 79.41, "Ford_FPV_GS_2009": 77.27, "Ford_FPV_GS_Ute_2009": 79.37, "Ford_FPV_GTP_2010": 81.03, "Ford_FPV_GT_2007": 78.26, "Ford_FPV_GT_Cobra_RSpec_2007": 80, "Ford_FPV_Pursuit_2003": 73.2, "Ford_FTE_TS50_2002": 72.73, "Ford_Laser_SR2_2002": 44.92, "Ford_Mustang_GT_2016": 80, "Ford_Telstar_TX5_Turbo_1986": 45.07, "Ford_Territory_Turbo_2006": 58.12, "GMC_Yukon_XL_2014": 52.75, "Holden_Acadia_LTZV_AWD_2018": 59.87, "Holden_Adventra_LX8_VZ_2004": 67.33, "Holden_Astra_RSV_BK_2019": 61.24, "Holden_Astra_SRi_Turbo_AH_2006": 71.96, "Holden_Astra_SRi_Turbo_TS_2003": 67.96, "Holden_Astra_TwinTop_AH_2007": 52.21, "Holden_Astra_VXR_PJ_2015": 56.73, "Holden_Barina_RS_TM_2014": 47.27, "Holden_Barina_SRi_XC_2004": 52.63, "Holden_Calibra_Turbo_4x4_1991": 55.95, "Holden_Caprice_WK_2003": 74.7, "Holden_Caprice_WN_2014": 72.85, "Holden_Commodore_CalaisV_Tourer_VB_2018": 78.57, "Holden_Commodore_Evoke_VF_2013": 61.02, "Holden_Commodore_SSV_Redline_2015": 79.07, "Holden_Commodore_SSZ_VZ_2005": 76.82, "Holden_Commodore_VXR_ZB_2018": 69.58, "Holden_Cruze_SRIV_2011": 40.64, "Holden_Efijy_2005": 103.93, "Holden_Epica_CDXi_2007": 42.42, "Holden_Equinox_LTZV_AWD_EQ_2017": 65.84, "Holden_HDT_Aero_VL_1987": 75.53, "Holden_HDT_Commodore_SS_Group_A_VK_1985": 54.26, "Holden_HDT_Director_VL_1987": 70.45, "Holden_HSV_Avalanche_VZ_2005": 70, "Holden_HSV_Avalanche_XUV_VZ_2005": 69.7, "Holden_HSV_Clubsport_R8_Dealer_Team_Spec_VZ_2005": 83.08, "Holden_HSV_Clubsport_R8_Tourer_VF_2015": 88.61, "Holden_HSV_Clubsport_R8_VF_2015": 89.22, "Holden_HSV_Clubsport_VS_1995": 65.35, "Holden_HSV_Coupe_4_V2_2004": 65.16, "Holden_HSV_GenF_Grange_WN_2016": 89.09, "Holden_HSV_GTO_V2_2003": 69.62, "Holden_HSV_GTS_V2_2003": 81.82, "Holden_HSV_GTS_VE_2009": 84.21, "Holden_HSV_GTS_VF_2015": 83, "Holden_HSV_Maloo_GTS_VF_2015": 85.42, "Holden_HSV_Maloo_R8_VE_2007": 75, "Holden_HSV_Maloo_VS_1995": 65.69, "Holden_HSV_Maloo_VZ_2004": 72.98, "Holden_HSV_Manta_VS_1995": 65, "Holden_HSV_Senator_Signature_VF_2015": 90.38, "Holden_HSV_VXR_Turbo_AH_2008": 76.54, "Holden_HSV_W427_VE_2009": 90, "Holden_Limited_Edition_Coupe_HX_1976": 48.2, "Holden_Malibu_CDX_2013": 43.78, "Holden_Monaro_CV6_V2_2001": 72.48, "Holden_Monaro_CV8R_VZ_2004": 76.92, "Holden_Monaro_CV8_V2_2001": 72.33, "Holden_Monaro_CV8_VZ_2005": 73.74, "Holden_Monaro_GTS_350_HQ_1971": 54.8, "Holden_Monaro_GTS_350_HT_1969": 36.14, "Holden_Monaro_GTS_Sedan_HX_1976": 52.9, "Holden_One_Tonner_VY_2003": 72.82, "Holden_Panel_Van_Sandman_HZ_1977": 44.65, "Holden_Piazza_Turbo_1986": 53.69, "Holden_Suburban_1998": 26.4, "Holden_Torana_GTRX_1970": 58.45, "Holden_Torana_GTR_XU1_LC_1970": 53.17, "Holden_Torana_GTR_XU1_LJ_1972": 60.96, "Holden_Torana_SLR_5000_A9X_LX_1977": 49.37, "Holden_Torana_SS_A9X_Hatchback_LX_1977": 49.02, "Holden_Trailblazer_LTZ_2016": 40.72, "Holden_Ute_SSV_Redline_VF_2017": 75.56, "Holden_Ute_SS_VE_2007": 69.14, "Holden_Ute_SS_VF_2013": 68.35, "Holden_Ute_SV6_VE_2007": 67.57, "INFINITI_EX35_AWD_2008": 66.3, "Jaguar_XE_S_2016": 65.6, "Jaguar_XKR_175_2010": 95.83, "KTM_X-Bow_GTX_2020": 100, "Lancia_ECV_1986": 72.33, "Lancia_Stratos_HF_Group_4_1974": 63.31, "Land_Rover_Range_Rover_Sport_2005": 50.75, "Land_Rover_Range_Rover_Sport_2018": 45.04, "Lotus_Evora_280_2009": 71.01, "Lotus_Exige_RGT_2016": 78.57, "Maserati_GranCabrio_MC_2016": 72.31, "Mercedes-Benz_AMG_CLK_63_Black_Series_2007": 79.25, "Mercedes-Benz_C11_1990": 106.1, "Mercedes-Benz_CLK_GTR_1998": 108.82, "Mini_Countryman_Cooper_S_ALL4_Boardwalk_2020": 43.33, "Mini_Countryman_John_Cooper_Works_2020": 60.76, "Morgan_3Wheeler_P101_2020": 39.92, "Morgan_Aero_8_race_car_2002": 96.97, "Nissan_Pulsar_Nismo_Concept_2015": 60, "Pagani_Imola_2020": 96.42, "Pagani_Zonda_Roadster_2003": 105.88, "Peugeot_308_GTi_2018": 75, "Porsche_911_RS_1992": 93.07, "Porsche_968_Turbo_S_1993": 88.89, "Porsche_Cayman_S_34_981_2012": 75, "Saleen_S7_Twin_Turbo_2005": 103.33, "Spyker_C8_Laviolette_2001": 95.74, "TVR_Cerbera_Speed_Eight_1996": 78.43, "Vauxhall_Calibra_Turbo_1992": 58.39 };
      // this.all_cars.map(x => {
      //   if (newMra[x.rid]) {
      //     x.mra = newMra[x.rid];
      //   }
      // });


      console.log(this.all_cars);
      debugger;

      // let ids = [];
      // ids.map(c => {
      //   this.all_cars.map(x => {
      //     if (c === x.tdid) {
      //       // action
      //       x.tags.push("Year of the Rabbit")

      //     }
      //   })
      // })
      // this.all_cars.map(x => {
      //   delete x.visible
      // });
      // debugger;
      // navigator.clipboard.writeText(JSON.stringify(this.all_cars));
    },
    actionClick(car) {
      if (this.collection.includes(car.rid)) {
        this.collection = this.collection.filter(x => x !== car.rid);
      } else {
        this.collection.push(car.rid);
      }

      // this.all_cars.map(x => {
      //   if (car.rid === x.rid) {
      //     if (x.prize) {
      //       Vue.set(x, "prize", false)
      //     } else {
      //       Vue.set(x, "prize", true)
      //     }
      //   }
      // })
    }
  },
}
</script>

<style>
.MainCarsEdit_Box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 auto;
  margin-top: 50px;
  justify-content: center;
  max-width: 1500px;
}
.MainCarsEdit_Item {
  width: 415px;
  height: 256px;
  position: relative;
}
.MainCarsEdit_Img {
}
.MainCarsEdit_Class {
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
.MainCarsEdit_Color {
  background-color: #a30000;
  padding: 4px 7px;
  font-weight: bold;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 18px;
}
.MainCarsEdit_down {
  color: #ff5050;
  font-size: 25px;
}
.MainCarsEdit_Rq {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 149px;
  right: 362px;
  align-items: center;
}
.MainCarsEdit_Empty + .BaseCarEditCard_Layout .Car_Header {
  opacity: 0.3;
}
.MainCarsEdit_topSpeed {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 34px;
  left: 355px;
  align-items: center;
}
.MainCarsEdit_acel {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 73px;
  left: 355px;
  align-items: center;
}
.MainCarsEdit_hand {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 113px;
  left: 355px;
  align-items: center;
}
.MainCarsEdit_drive {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 152px;
  left: 355px;
  align-items: center;
}
.MainCarsEdit_tyres {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 190px;
  right: 121px;
  align-items: center;
}
.MainCarsEdit_Small {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  align-items: center;
  z-index: 50;
  font-size: 10px;
}
.MainCarsEdit_Year {  
  top: 34px;
  right: 121px;  
}
.MainCarsEdit_Abs {  
  top: 34px;
  right: 360px;  
}
.MainCarsEdit_Tcs {  
  top: 57px;
  right: 360px;
}
.MainCarsEdit_Clearance {
  top: -20px;
  right: 30px;
}
.MainCarsEdit_Mra {
  top: 190px;
  left: 55px;
}
.MainCarsEdit_Weight {
  top: -21px;
  left: 54px;
}
.MainCarsEdit_Compare {
  display: inline-flex;
  gap: 6px;
  position: absolute;
  color: white;
  align-items: center;
  background-color: #a30000;
  padding: 2px 4px;
  /* position: relative; */
}
.MainCarsEdit_CompareLabel {
  position: absolute;
  top: 7px;
  right: calc(100% + 2px);
  font-size: 11px;
  opacity: 0.4;
}


.MainCarsEdit_ColorUp {
  background-color: #007000;
}
.MainCarsEdit_Layout .Main_SearchMid {
  height: unset;
  overflow-y: auto;
  margin-bottom: 150px;
  position: absolute;
  z-index: 100;
  box-shadow: 0px 10px 0px 0px #00000087;
}
.MainCarsEdit_Layout .Main_FilterItems > *:last-child {
  margin-top: 50px;
}
.MainCarsEdit_Layout .Main_FiltersButton {
  border-top-right-radius: 0px;
}

.MainCarsEdit_NewCar {
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