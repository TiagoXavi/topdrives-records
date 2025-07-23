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
              type="search"
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
                v-model="searchFilters.onlyRelevantChangesModel"
                class="BaseChip_MinWidth BaseChip_DontCrop"
                :value="true">Relevant changes</BaseChip>
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
                  v-if="
                    (!$store.state.oldTags.includes(item) || $store.state.showOldTags) &&
                    (!$store.state.upcomingTags.includes(item) || $store.state.showUpcomingTags)
                  "
                  :class="`BaseGameTag_${item.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`"
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
    <div v-if="lastestLoading" class="MainGallery_Box MainGallery_BoxLoading">
      Loading...
    </div>
    <div v-else class="MainGallery_Box">
      <div class="MainGallery_BoxTitle">
        <span v-if="this.searchFilters.onlyAnyChangeModel[0]">Any change</span>
        <span v-if="this.searchFilters.onlyRelevantChangesModel[0]">Relevant Changes</span>
        <span v-if="this.searchFilters.onlyNewRarityModel[0]">Rarity Changes</span>
        <span v-if="this.searchFilters.onlyNewPerformanceModel[0]">Performance Changes</span>
        <span v-if="this.searchFilters.onlyNewTyresModel[0]">Tyre Changes</span>
        <span v-if="this.searchFilters.onlyNewDriveModel[0]">Drivetrain Changes</span>
        <span v-if="this.searchFilters.onlyNewClearanceModel[0]">Clerance Changes</span>
      </div>
      <div
        v-for="(car, ix) in searchResult"
        class="MainGallery_Item">
        <div v-if="car.visible">
          
          <div v-if="diff_searchResult[ix].new === true" class="MainGallery_NewCar">New</div>
          <div v-else-if="Object.keys(diff_searchResult[ix]).length === 0" class="MainGallery_Empty"></div>
          <template v-else>

            <div
              v-if="diff_searchResult[ix].rq"
              :class="{ MainGallery_ColorValueUp: diff_searchResult[ix].rq > car.rq }"
              class="MainGallery_Rq MainGallery_Color MainGallery_ColorValue">
              <template v-if="car.rq > diff_searchResult[ix].rq">+</template>{{ car.rq - diff_searchResult[ix].rq }}
            </div>

            <div
              v-if="diff_searchResult[ix].topSpeed"
              :class="{ MainGallery_ColorValueUp: diff_searchResult[ix].topSpeed < car.topSpeed }"
              :style="`--char-count:` + (JSON.stringify(car.topSpeed)).length"
              class="MainGallery_topSpeed MainGallery_Color MainGallery_ColorValue">
              <template v-if="car.topSpeed > diff_searchResult[ix].topSpeed">+</template>{{ car.topSpeed - diff_searchResult[ix].topSpeed }}
            </div>

            <div
              v-if="diff_searchResult[ix].acel"
              style="--char-isAcel: 4px"
              :class="{ MainGallery_ColorValueUp: diff_searchResult[ix].acel > car.acel }"
              :style="`--char-count:` + (JSON.stringify(car.acel)).length"
              class="MainGallery_acel MainGallery_Color MainGallery_ColorValue">
              <template v-if="car.acel > diff_searchResult[ix].acel">+</template>{{ (car.acel - diff_searchResult[ix].acel).toFixed(1) }}
            </div>

            <div
              v-if="diff_searchResult[ix].hand"
              :class="{ MainGallery_ColorValueUp: diff_searchResult[ix].hand < car.hand }"
              :style="`--char-count:` + (JSON.stringify(car.hand)).length"
              class="MainGallery_hand MainGallery_Color MainGallery_ColorValue">
              <template v-if="car.hand > diff_searchResult[ix].hand">+</template>{{ car.hand - diff_searchResult[ix].hand }}
            </div>

            <div
              v-if="diff_searchResult[ix].drive"
              :class="{
                MainGallery_ColorUp: diff_searchResult[ix].drive === 'FWD' || (diff_searchResult[ix].drive === 'RWD' && diff_searchResult[ix]._drive === '4WD'),
                MainGallery_ColorDown: diff_searchResult[ix].drive === '4WD' || (diff_searchResult[ix].drive === 'RWD' && diff_searchResult[ix]._drive === 'FWD')
              }"
              class="MainGallery_drive MainGallery_Color">
              {{ diff_searchResult[ix].drive }}
            </div>

            <div
              v-if="diff_searchResult[ix].tyres"
              :class="{
                MainGallery_ColorUp: diff_searchResult[ix].tyres === 'Slick' || diff_searchResult[ix]._tyres === 'All-surface' || (diff_searchResult[ix].tyres === 'Performance' && diff_searchResult[ix]._tyres !== 'Slick'),
                MainGallery_ColorDown: diff_searchResult[ix].tyres === 'All-surface' || diff_searchResult[ix]._tyres === 'Slick' || (diff_searchResult[ix].tyres === 'Standard' && diff_searchResult[ix]._tyres !== 'All-surface')
              }"
              class="MainGallery_tyres MainGallery_Color">
              {{ diff_searchResult[ix].tyres }}
            </div>

            <div
              v-if="diff_searchResult[ix].brake"
              :class="{
                MainGallery_ColorUp: (diff_searchResult[ix].brake === 'C') || (diff_searchResult[ix].brake === 'B' && diff_searchResult[ix]._brake === 'A'),
                MainGallery_ColorDown: (diff_searchResult[ix].brake === 'A') || (diff_searchResult[ix].brake === 'B' && diff_searchResult[ix]._brake === 'C')
              }"
              class="MainGallery_Brake MainGallery_Compare">
              <div class="MainGallery_CompareLabel">Brake</div>
              <div class="MainGallery_Old">{{ diff_searchResult[ix].brake }}</div>
              <i class="ticon-arrow_right_3 MainGallery_Between" aria-hidden="true"/>
              <div class="MainGallery_Old">{{ diff_searchResult[ix]._brake }}</div>
            </div>

            <div
              v-if="diff_searchResult[ix].class"
              :style="`--class-color: ${diff_searchResult[ix].color};`"
              class="MainGallery_Class">
              <div class="MainGallery_ClassBack"></div>
              {{ diff_searchResult[ix].class }}
            </div>

            <div
              v-if="diff_searchResult[ix].year"
              class="MainGallery_Small MainGallery_Year MainGallery_Color">
              {{ diff_searchResult[ix].year }}
            </div>

            <div
              v-if="diff_searchResult[ix].abs !== diff_searchResult[ix]._abs"
              :class="{ MainGallery_BoolUp: car.abs }"
              class="MainGallery_Small MainGallery_Bool MainGallery_Abs MainGallery_Color">
              ABS
            </div>

            <div
              v-if="diff_searchResult[ix].tcs !== diff_searchResult[ix]._tcs"
              :class="{ MainGallery_BoolUp: car.tcs }"
              class="MainGallery_Small MainGallery_Bool MainGallery_Tcs MainGallery_Color">
              TCS
            </div>

            <div
              v-if="diff_searchResult[ix].prize !== diff_searchResult[ix]._prize"
              :class="{ MainGallery_BoolUp: car.prize }"
              class="MainGallery_Small MainGallery_Bool MainGallery_Prize MainGallery_Color">
              Prize
            </div>

            <div
              v-if="diff_searchResult[ix].clearance"
              :class="{
                MainGallery_ColorUp: (diff_searchResult[ix].clearance === 'Low' && diff_searchResult[ix]._clearance === 'Mid') || (diff_searchResult[ix].clearance === 'Mid' && diff_searchResult[ix]._clearance === 'High'),
                MainGallery_ColorDown: (diff_searchResult[ix].clearance === 'Mid' && diff_searchResult[ix]._clearance === 'Low') || (diff_searchResult[ix].clearance === 'High' && diff_searchResult[ix]._clearance === 'Mid')
              }"
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
import data_cars from '../database/cars_final_PL27-fixed.json'
import plOld from '../database/cars_final_PL26.json'
import BaseDualSlider from './BaseDualSlider.vue'
import BaseChip from './BaseChip.vue'
import BaseFlag from './BaseFlag.vue'

export default {
  name: 'MainGallery', // /gallery
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
      all_cars_obj: {},
      plOld: plOld,
      plOld_obj: {},
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
      lastestLoading: false,
      clearChangesArray: [],
      clearFilters: {},
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
        onlyAnyChangeModel: [],
        onlyNewRarityModel: [],
        onlyNewPerformanceModel: [],
        onlyRelevantChangesModel: [],
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
          "Iconic Variant",
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
  beforeCreate() {
    window.localStorage.setItem("changes_v27", "t");
  },
  beforeMount() {
    // // check new cars
    // let found = this.all_cars.find(x => x.rid === "Lamborghini_Athon_1980");
    // if (!found) {
    //   this.getLastest();
    // } else {
    //   this.init();
    // }
    this.transformAllCarsToObj();
    this.init();
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
    init() {
      this.all_cars.map(x => {
        Vue.set(x, "visible", false);
      })

      this.searchResult = this.all_cars;
      // this.resolveDiffs();

      [...Array(Math.ceil(this.chunkNumber)).keys()].map((x,ix) => {
        this.chunkLoaded[ix] = false;
      })

      this.clearFilter();

      this.applyFilter();
    },
    getLastest() {
      let vm = this;
      this.lastestLoading = true;


      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;

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

        let mraData = res.data.find(x => x.id === 'mra').value;
        this.all_cars.map(x => {
          if (!x.mra && mraData[x.rid]) {
            Vue.set(x, "mra", mraData[x.rid]);
          }
        })

        this.init();


      })
      .catch(error => {
        this.lastestLoading = false;
        console.log(error);
      });

    },
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
      let result = [];
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

      // var t0 = performance.now();
      // search and/or filter
      this.all_cars.map((x, ix) => {
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
      })
      // var t1 = performance.now();
      // console.log(`changeFilter ${t1 - t0} milliseconds.`);

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

      if (this.searchFilters.onlyNewPerformanceModel.includes(true) && import.meta.env.DEV) {
        console.log("%c clearChangesArray", "color: #bada55;", this.clearChangesArray )
      } else {
        console.log("list", result);
      }
      // debugger;

      this.searchResult = result;
      this.searchLoading = false;
      this.showingLastest = false;
      this.alreadySearched = true;
      this.showAllFilter = showAll;
      this.resolveDiffs();

      
      

    },
    resolveDiffs() {
      // var t0 = performance.now();

      let difResult = [];
      this.searchResult.map((y, ix) => {
        // if (ix > 200) return;
        let dif = {};

        let x = this.plOld_obj[y.rid];

        if (!x) {
          dif.new = true;
        } else {
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
          if (x.brake !== y.brake) {
            dif.brake = x.brake
            dif._brake = y.brake
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
        }

        difResult.push(dif);
      })
      this.diff_searchResult = difResult;
      Object.keys(this.chunkLoaded).map(key => {
        this.chunkLoaded[key] = false;
      })
      this.showAllChunk = false;
      this.loadChunk(0);

      // var t1 = performance.now();
      // console.log(`resolveDiffs ${t1 - t0} milliseconds.`);
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
      this.searchFilters.onlyAnyChangeModel = [];
      this.searchFilters.onlyNewRarityModel = [];
      this.searchFilters.onlyNewPerformanceModel = [];
      this.searchFilters.onlyRelevantChangesModel = [true];
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
        onlyRelevantChangesModel: [],
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

      this.clearFilters = {};

      let vm = this;
      Object.keys( this.searchFilters ).forEach(function (key) {
        if (key.includes("Model")) {
          if (defaults[key] && JSON.stringify(vm.searchFilters[key]) !== JSON.stringify(defaults[key])) {
            count++;
            vm.clearFilters[key] = vm.searchFilters[key];
          }
        }
      });

      this.filterCount = count;
    },
    checkMatchFilter(car) {
      // between
      if ( this.clearFilters.yearModel && !this.filterCheckBetween(car.year, this.searchFilters.yearModel) ) return false;
      if ( this.clearFilters.rqModel && !this.filterCheckBetween(car.rq, this.searchFilters.rqModel) ) return false;
      if ( this.clearFilters.topSpeedModel && !this.filterCheckBetween(car.topSpeed, this.searchFilters.topSpeedModel) ) return false;
      if ( this.clearFilters.acelModel && !this.filterCheckBetween(car.acel, this.searchFilters.acelModel) ) return false;
      if ( this.clearFilters.handModel && !this.filterCheckBetween(car.hand, this.searchFilters.handModel) ) return false;
      if ( this.clearFilters.mraModel && !this.filterCheckBetween(car.mra, this.searchFilters.mraModel) ) return false;
      if ( this.clearFilters.weightModel && !this.filterCheckBetween(car.weight, this.searchFilters.weightModel) ) return false;
      if ( this.clearFilters.seatsModel && !this.filterCheckBetween(car.seats, this.searchFilters.seatsModel) ) return false;

      // includes
      if ( this.clearFilters.classesModel && !this.filterCheckIncludes(car.class, this.searchFilters.classesModel) ) return false;
      if ( this.clearFilters.tyresModel && !this.filterCheckIncludes(car.tyres, this.searchFilters.tyresModel) ) return false;
      if ( this.clearFilters.drivesModel && !this.filterCheckIncludes(car.drive, this.searchFilters.drivesModel) ) return false;
      if ( this.clearFilters.clearancesModel && !this.filterCheckIncludes(car.clearance, this.searchFilters.clearancesModel) ) return false;
      if ( this.clearFilters.countrysModel && !this.filterCheckIncludes(car.country, this.searchFilters.countrysModel) ) return false;

      if ( this.clearFilters.fuelModel && !this.filterCheckIncludes(car.fuel, this.searchFilters.fuelModel) ) return false;
      if ( this.clearFilters.engineModel && !this.filterCheckIncludes(car.engine, this.searchFilters.engineModel) ) return false;

      if ( this.clearFilters.bodyTypesModel && !this.filterCheckIncludesArray(car.bodyTypes, this.searchFilters.bodyTypesModel) ) return false;
      if ( this.clearFilters.tagsModel && !this.filterCheckIncludesArray(car.tags, this.searchFilters.tagsModel) ) return false;
      if ( this.clearFilters.brandsModel && !this.filterCheckIncludes(car.brand, this.searchFilters.brandsModel) ) return false;

      if ( this.searchFilters.prizesModel.length > 0 ) {
        if ( car.prize && !this.searchFilters.prizesModel.includes("Prize Cars") ) return false;
        if ( !car.prize && !this.searchFilters.prizesModel.includes("Non-Prize Cars") ) return false;
      }

      let oldCar = this.plOld_obj[car.rid];

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
            oldCar.weight === car.weight &&
            oldCar.brake === car.brake
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
            oldCar.weight === car.weight &&
            oldCar.brake === car.brake
          ) {
          return false;
        }
        if (import.meta.env.DEV) {
          this.checkPerformanceChangeClear(oldCar, car);
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

      if ( this.searchFilters.onlyRelevantChangesModel.includes(true) ) {
        if ( !oldCar ) {
          return false; // show new cars too?
        }
        if (
            oldCar.class === car.class &&
            oldCar.tyres === car.tyres &&
            oldCar.drive === car.drive &&
            oldCar.clearance === car.clearance &&
            Math.abs(oldCar.rq - car.rq) < 3 &&
            oldCar.abs === car.abs &&
            oldCar.tcs === car.tcs &&
            oldCar.prize === car.prize &&
            oldCar.topSpeed === car.topSpeed &&
            oldCar.acel === car.acel &&
            oldCar.hand === car.hand &&
            (oldCar.mra === null || oldCar.mra === car.mra) &&
            oldCar.weight === car.weight &&
            oldCar.brake === car.brake
          ) {
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
      if (import.meta.env.DEV) {
        this.resetChangesOnlyArrays();
      }
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
      // console.log(total);

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
    },
    transformAllCarsToObj() {
      let key = "rid";
      this.all_cars.map(car => {
        this.all_cars_obj[car[key]] = car;
      });
      this.plOld.map(car => {
        this.plOld_obj[car[key]] = car;
      });
    },
    resetChangesOnlyArrays() {
      this.clearChangesArray = [];
    },
    checkClearanceOnly(oldCar, car) {
      if (checkKeys(oldCar, car, ["clearance"])) {
        this.changed_clearance_only.push(car.rid);
      }
    },
    checkKeys(oldCar, car, hasChangedKeys) {
      let notChangedKeys = ["tyres", "drive", "clearance", "abs", "tcs", "topSpeed", "acel", "hand", "mra", "weight", "brake"];
      notChangedKeys = notChangedKeys.filter(x => hasChangedKeys.includes(x));

      // check if all notChangedKeys are same
      let result = true;
      result = notChangedKeys.every(key => oldCar[key] === car[key]);
      if (!result) return false;

      // check if at least one hasChangedKeys is diff
      result = hasChangedKeys.some(key => oldCar[key] !== car[key]);
      return result;
    },
    checkPerformanceChangeClear(oldCar, car) {
      let changedAny = false;
      let carToPush = { rid: car.rid };
      let keys = ["tyres", "drive", "clearance", "abs", "tcs", "topSpeed", "acel", "hand", "mra", "weight", "brake"];

      keys.map(key => {
        if (oldCar[key] !== car[key]) {
          changedAny = true;
          carToPush[key] = true;
        }
      })

      if (changedAny) {
        this.clearChangesArray.push(carToPush);
      }
    },
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
  /* background-color: var(--class-color); */
  color: black;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* padding: 6px 12px; */
  width: 33px;
  height: 36.8px;
  /* border-radius: 50%; */
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: bold;
  position: absolute;
  top: 108px;
  font-size: 22.5px;
  left: 22px;
}
.MainGallery_ClassBack {
  background-color: var(--class-color);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: skewY(9deg);
  z-index: -1;
}
.MainGallery_Color {
  background-color: #232121;
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
  right: 360px;
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
  top: 29px;
  left: 355px;
  align-items: center;
}
.MainGallery_acel {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 70px;
  left: 355px;
  align-items: center;
}
.MainGallery_hand {
  display: inline-flex;
  gap: 6px;
  color: white;
  position: absolute;
  top: 111px;
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
  top: 29px;
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
.MainGallery_Brake {
  top: 190px;
  left: 294px;
}
.MainGallery_Brake .MainGallery_CompareLabel {
  right: unset;
  left: 0;
  top: calc(100% + 2px);
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
.MainGallery_Arrow {
  --char-isAcel: 0px;
}
.MainGallery_Arrow:before {
  content: "\e924";
  font-family: 'JurisT' !important;
  position: absolute;
  top: 5px;
  /* left: -45px; */
  left: calc(-24px - (10px * var(--char-count)) + var(--char-isAcel));
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  z-index: 200;
  color: #ff4c4c;
  font-weight: bold;
}
.MainGallery_ArrowUp:before {
  content: "\e921";
  color: #b2ff50;
}
.MainGallery_Bool:before {
  content: "\e927";
  font-family: 'JurisT' !important;
  position: absolute;
  top: 6px;
  left: -6px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  z-index: 200;
  color: #ff4c4c;
  font-weight: bold;
}
.MainGallery_BoolUp:before {
  content: "\e943";
  color: #b2ff50;
}
.MainGallery_ArrowUp:before {
  content: "\e921";
  color: #b2ff50;
}
.MainGallery_ColorValue {
  color: #ff4c4c;
}
.MainGallery_ColorValueUp {
  color: #b2ff50;
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
.MainGallery_BoxTitle {
  margin-top: -24px;
  margin-bottom: 28px;
  font-size: 1.4em;
  opacity: 0.4;
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  gap: 30px;
  justify-content: center;
}
.MainGallery_BoxLoading {

}
</style>