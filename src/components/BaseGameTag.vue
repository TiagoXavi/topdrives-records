<template>
  <div
    v-if="
      (!$store.state.oldTags.includes(tag) || $store.state.showOldTags) &&
      (!$store.state.upcomingTags.includes(tag) || $store.state.showUpcomingTags)
    "
    class="BaseGameTag_Layout"
    :class="`BaseGameTag_${tag.replaceAll(' ', '_').replaceAll(',', '').replaceAll('/', '')}`">{{ tag }}</div>
</template>

<script>

export default {
  name: 'BaseGameTag',
  components: {},
  props: {
    tag: {
      type: String,
      default: ""
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
.BaseGameTag_Layout {
  color: #e1e1e1;
  font-size: 13px;
  padding: 3px 7px;
  border-radius: 12px;
  box-shadow: 0px 0px 0px 2px hsl(var(--tag-h), var(--tag-s), var(--tag-l));
  background-color: hsl(var(--tag-h), var(--tag-s), 15%);
}
.BaseGameTag_Filter {
  box-shadow: inset 0px -2px 0px 0px hsl(var(--tag-h), var(--tag-s), 40%);
}
.BaseGameTag_Filter2 {
  box-shadow: inset 0px -2px 0px 0px hsl(var(--tag-h), var(--tag-s), 40%), -2px 0px 0px 0px hsl(var(--tag-h), var(--tag-s), 40%);
  margin-left: 2px;
}
.BaseGameTag_5th_Anniversary {
  --tag-h: 152;
  --tag-s: 69%;
  --tag-l: 61%;
}
.BaseGameTag_Amalfi_Coast_Cruising {
  --tag-h: 346;
  --tag-s: 79%;
  --tag-l: 64%;
}
.BaseGameTag_American_Dream {
  --tag-h: 241;
  --tag-s: 70%;
  --tag-l: 59%;
}
.BaseGameTag_American_Frontier {
  --tag-h: 18;
  --tag-s: 79%;
  --tag-l: 38%;
}
.BaseGameTag_American_Overdrive {
  --tag-h: 241;
  --tag-s: 70%;
  --tag-l: 59%;
}
.BaseGameTag_Around_the_World {
  --tag-h: 224;
  --tag-s: 80%;
  --tag-l: 69%;
}
.BaseGameTag_As_Seen_on_YT {
  --tag-h: 210;
  --tag-s: 100%;
  --tag-l: 63%;
}
.BaseGameTag_Asia-Pacific_Grand_Prix {
  --tag-h: 97;
  --tag-s: 40%;
  --tag-l: 45%;
}
.BaseGameTag_Call_of_the_Wild {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 94%;
}
.BaseGameTag_Chariots_of_the_Gods {
  --tag-h: 40;
  --tag-s: 31%;
  --tag-l: 84%;
}
.BaseGameTag_Christmas_Collection {
  --tag-h: 57;
  --tag-s: 75%;
  --tag-l: 84%;
}
.BaseGameTag_Christmas_Collection_22 {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 100%;
}
.BaseGameTag_Coast_to_Coast {
  --tag-h: -20;
  --tag-s: 50%;
  --tag-l: 50%;
}
.BaseGameTag_Concept {
  --tag-h: 168;
  --tag-s: 66%;
  --tag-l: 89%;
}
.BaseGameTag_Cutting_Edge {
  --tag-h: 177;
  --tag-s: 66%;
  --tag-l: 63%;
}
.BaseGameTag_Desperados {
  --tag-h: 53;
  --tag-s: 78%;
  --tag-l: 53%;
}
.BaseGameTag_Drivers_Choice {
  --tag-h: 4;
  --tag-s: 70%;
  --tag-l: 50%;
}
.BaseGameTag_Eco_Friendly {
  --tag-h: 120;
  --tag-s: 70%;
  --tag-l: 49%;
}
.BaseGameTag_Electric_Excellence {
  --tag-h: -160;
  --tag-s: 80%;
  --tag-l: 59%;
}
.BaseGameTag_Enter_the_Black_Forest {
  --tag-h: 133;
  --tag-s: 69%;
  --tag-l: 30%;
}
.BaseGameTag_European_Grand_Tour {
  --tag-h: 21;
  --tag-s: 51%;
  --tag-l: 48%;
}
.BaseGameTag_European_Revolution {
  --tag-h: 141;
  --tag-s: 34%;
  --tag-l: 28%;
}
.BaseGameTag_European_New_Wave {
  --tag-h: 290;
  --tag-s: 74%;
  --tag-l: 72%;
}
.BaseGameTag_Famous_Tracks {
  --tag-h: 273;
  --tag-s: 67%;
  --tag-l: 31%;
}
.BaseGameTag_Gaz\'s_Collection {
  --tag-h: 40;
  --tag-s: 78%;
  --tag-l: 53%;
}
.BaseGameTag_Gunter\'s_Collection {
  --tag-h: 333;
  --tag-s: 54%;
  --tag-l: 30%;
}
.BaseGameTag_French_Renaissance {
  --tag-h: 235;
  --tag-s: 65%;
  --tag-l: 61%;
}
.BaseGameTag_German_Renaissance {
  --tag-h: 40;
  --tag-s: 78%;
  --tag-l: 53%;
}
.BaseGameTag_Great_Exhibition {
  --tag-h: -139;
  --tag-s: 76%;
  --tag-l: 37%;
}
.BaseGameTag_Heavy_Metal {
  --tag-h: 40;
  --tag-s: 78%;
  --tag-l: 53%;
}
.BaseGameTag_Hot_Hatch {
  --tag-h: 290;
  --tag-s: 74%;
  --tag-l: 72%;
}
.BaseGameTag_Hypercar {
  --tag-h: 258;
  --tag-s: 64%;
  --tag-l: 55%;
}
.BaseGameTag_Immortalised_in_Carbon {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 100%;
}
.BaseGameTag_In_the_Shadows {
  --tag-h: 187;
  --tag-s: 55%;
  --tag-l: 38%;
}
.BaseGameTag_In_the_Shadows_24 {
  --tag-h: 187;
  --tag-s: 55%;
  --tag-l: 38%;
}
.BaseGameTag_Iconic_Variant {
  --tag-h: 288;
  --tag-s: 80%;
  --tag-l: 80%;
}
.BaseGameTag_Innovative {
  --tag-h: 38;
  --tag-s: 70%;
  --tag-l: 47%;
}
.BaseGameTag_Interstellar {
  --tag-h: 210;
  --tag-s: 50%;
  --tag-l: 75%;
}
.BaseGameTag_Italian_Renaissance {
  --tag-h: 133;
  --tag-s: 69%;
  --tag-l: 30%;
}
.BaseGameTag_Japan_Pro_Tour {
  --tag-h: 340;
  --tag-s: 65%;
  --tag-l: 41%;
}
.BaseGameTag_Learn_the_Savannah_Way {
  --tag-h: 50;
  --tag-s: 40%;
  --tag-l: 40%;
}
.BaseGameTag_Lina\'s_Collection,
.BaseGameTag_Lina\'s_Collection_2 {
  --tag-h: 237;
  --tag-s: 65%;
  --tag-l: 51%;
}
.BaseGameTag_Loch_to_Loch {
  --tag-h: 190;
  --tag-s: 40%;
  --tag-l: 30%;
}
.BaseGameTag_Loves_Me_Loves_Me_Not {
  --tag-h: 0;
  --tag-s: 70%;
  --tag-l: 45%;
}
.BaseGameTag_Marilyn\'s_Collection {
  --tag-h: 40;
  --tag-s: 78%;
  --tag-l: 53%;
}
.BaseGameTag_Motorsport {
  --tag-h: 216;
  --tag-s: 70%;
  --tag-l: 77%;
}
.BaseGameTag_Muscle_Car {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 82%;
}
.BaseGameTag_New_Beginnings {
  --tag-h: 177;
  --tag-s: 66%;
  --tag-l: 63%;
}
.BaseGameTag_Nightmare_Fuel {
  --tag-h: 177;
  --tag-s: 66%;
  --tag-l: 63%;
}
.BaseGameTag_Niklas\'_Collection, 
.BaseGameTag_Niklas\'_Collection_2 {
  --tag-h: 241;
  --tag-s: 70%;
  --tag-l: 59%;
}
.BaseGameTag_Old_Guard {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 100%;
}
.BaseGameTag_Originals {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 100%;
}
.BaseGameTag_Pacific_Coast_Highway {
  --tag-h: 201;
  --tag-s: 30%;
  --tag-l: 60%;
}
.BaseGameTag_Photo_Finish {
  --tag-h: 333;
  --tag-s: 50%;
  --tag-l: 50%;
}
.BaseGameTag_Rest_of_the_World {
  --tag-h: 141;
  --tag-s: 34%;
  --tag-l: 28%;
}
.BaseGameTag_Racing_Royalty {
  --tag-h: 45;
  --tag-s: 44%;
  --tag-l: 41%;
}
.BaseGameTag_Reclassified {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 80%;
}
.BaseGameTag_Ride_of_the_Valkyries {
  --tag-h: 58;
  --tag-s: 44%;
  --tag-l: 76%;
}
.BaseGameTag_Riders_on_the_Storm {
  --tag-h: 187;
  --tag-s: 55%;
  --tag-l: 35%;
}
.BaseGameTag_Road {
  --tag-h: 0;
  --tag-s: 70%;
  --tag-l: 74%;
}
.BaseGameTag_Roads_Most_Travelled {
  --tag-h: 239;
  --tag-s: 55%;
  --tag-l: 35%;
}
.BaseGameTag_Silver_Screen {
  --tag-h: 222;
  --tag-s: 8%;
  --tag-l: 70%;
}
.BaseGameTag_Sleeper {
  --tag-h: 312;
  --tag-s: 70%;
  --tag-l: 58%;
}
.BaseGameTag_Street_Racer {
  --tag-h: 0;
  --tag-s: 70%;
  --tag-l: 74%;
}
.BaseGameTag_Style_Icon {
  --tag-h: 99;
  --tag-s: 49%;
  --tag-l: 83%;
}
.BaseGameTag_Sub-Zero {
  --tag-h: 177;
  --tag-s: 70%;
  --tag-l: 59%;
}
.BaseGameTag_Summer_Games {
  --tag-h: 10;
  --tag-s: 66%;
  --tag-l: 39%;
}
.BaseGameTag_Summer_Games_24 {
  --tag-h: 54;
  --tag-s: 100%;
  --tag-l: 41%;
}
.BaseGameTag_Supercar {
  --tag-h: 170;
  --tag-s: 50%;
  --tag-l: 80%;
}
.BaseGameTag_Team_Favourite {
  --tag-h: 47;
  --tag-s: 70%;
  --tag-l: 50%;
}
.BaseGameTag_The_Great_Outdoors {
  --tag-h: 0;
  --tag-s: 80%;
  --tag-l: 40%;
}
.BaseGameTag_The_Horror_Show {
  --tag-h: 74;
  --tag-s: 23%;
  --tag-l: 52%;
}
.BaseGameTag_The_Unicorns {
  --tag-h: 18;
  --tag-s: 53%;
  --tag-l: 52%;
}
.BaseGameTag_Touma\'s_Collection {
  --tag-h: 7;
  --tag-s: 78%;
  --tag-l: 53%;
}
.BaseGameTag_Trading_Paint {
  --tag-h: -13;
  --tag-s: 65%;
  --tag-l: 52%;
}
.BaseGameTag_Track {
  --tag-h: 0;
  --tag-s: 70%;
  --tag-l: 74%;
}
.BaseGameTag_Two_Tone {
  --tag-h: 321;
  --tag-s: 55%;
  --tag-l: 42%;
}
.BaseGameTag_Ultra_Expensive {
  --tag-h: 275;
  --tag-s: 70%;
  --tag-l: 59%;
}
.BaseGameTag_Wild_Ride {
  --tag-h: 21;
  --tag-s: 70%;
  --tag-l: 50%;
}
.BaseGameTag_World_Expo {
  --tag-h: 257;
  --tag-s: 50%;
  --tag-l: 70%;
}
.BaseGameTag_World_Expo.BaseGameTag_Filter {
  z-index: 1;
}
.BaseGameTag_Year_of_the_Dragon {
  --tag-h: 0;
  --tag-s: 60%;
  --tag-l: 50%;
}
.BaseGameTag_Year_of_the_Ox {
  --tag-h: 5;
  --tag-s: 75%;
  --tag-l: 43%;
}
.BaseGameTag_Year_of_the_Rabbit {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 100%;
}
.BaseGameTag_Year_of_the_Rat {
  --tag-h: 49;
  --tag-s: 69%;
  --tag-l: 63%;
}
.BaseGameTag_Year_of_the_Snake {
  --tag-h: 47;
  --tag-s: 100%;
  --tag-l: 50%;
}
.BaseGameTag_Year_of_the_Tiger {
  --tag-h: 5;
  --tag-s: 69%;
  --tag-l: 44%;
}
.BaseGameTag_Beige {
  --tag-h: 40;
  --tag-s: 20%;
  --tag-l: 70%;
}
.BaseGameTag_Black {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 50%;
}
.BaseGameTag_Blue {
  --tag-h: 200;
  --tag-s: 20%;
  --tag-l: 60%;
}
.BaseGameTag_Brown {
  --tag-h: 30;
  --tag-s: 16%;
  --tag-l: 55%;
}
.BaseGameTag_Gold {
  --tag-h: 40;
  --tag-s: 30%;
  --tag-l: 60%;
}
.BaseGameTag_Green {
  --tag-h: 140;
  --tag-s: 30%;
  --tag-l: 60%;
}
.BaseGameTag_Orange {
  --tag-h: 29;
  --tag-s: 70%;
  --tag-l: 50%;
}
.BaseGameTag_Pink {
  --tag-h: -20;
  --tag-s: 30%;
  --tag-l: 60%;
}
.BaseGameTag_Purple {
  --tag-h: -90;
  --tag-s: 30%;
  --tag-l: 60%;
}
.BaseGameTag_Red {
  --tag-h: 0;
  --tag-s: 50%;
  --tag-l: 50%;
}
.BaseGameTag_SilverGrey {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 60%;
}
.BaseGameTag_Turquoise {
  --tag-h: 170;
  --tag-s: 50%;
  --tag-l: 80%;
}
.BaseGameTag_White {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 80%;
}
.BaseGameTag_Yellow {
  --tag-h: 50;
  --tag-s: 70%;
  --tag-l: 60%;
}
.BaseGameTag_Ximena\'s_Collection {
  --tag-h: 126;
  --tag-s: 55%;
  --tag-l: 68%;
}
.BaseGameTag_Hugo\'s_Collection {
  --tag-h: 222;
  --tag-s: 70%;
  --tag-l: 70%;
}
.BaseGameTag_Sara\'s_Collection {
  --tag-h: 56;
  --tag-s: 70%;
  --tag-l: 50%;
}
.BaseGameTag_Asia-Pacific_Revival {
  --tag-h: 221;
  --tag-s: 70%;
  --tag-l: 37%;
}
.BaseGameTag_None {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 100%;
}
.BaseGameTag_Oddities {
  --tag-h: 0;
  --tag-s: 0%;
  --tag-l: 100%;
}
.BaseGameTag_Filberto\'s_Collection {
  --tag-h: 0;
  --tag-s: 70%;
  --tag-l: 76%;
}
.BaseGameTag_Harriet\'s_Collection {
  --tag-h: 156;
  --tag-s: 70%;
  --tag-l: 85%;
}
.BaseGameTag_Legrand\'s_Collection {
  --tag-h: 12;
  --tag-s: 70%;
  --tag-l: 59%;
}
.BaseGameTag_French_Riviera {
  --tag-h: 312;
  --tag-s: 70%;
  --tag-l: 26%;
}
</style>