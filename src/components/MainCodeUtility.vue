<template>
  <div class="MainCodeUtility_Layout">
    <div class="inputs_layout">
      <BaseText
        v-model="textModel"
        type="normal"
        placeholder="paste here"
        class="Space_Bottom"
        @paste="intercept($event)" />
    </div>
    <div v-if="result && result.prizeBoard">
      <div class="round_layout">
        <div class="round_boxes">
          <div
            v-for="(r, index) in result.resultData.roundScores"
            class="round_boxesItem"
          >
            <div
              :class="`round_boxesPoint${
                r > 0 ? 'Blue' : r < 0 ? 'Red' : 'Grey'
              }`"
              class="round_boxesPoint"
            >
              {{ r }}
            </div>
            <template v-if="result.resultData.roundData[index].playerData.distance < 2546 || result.resultData.roundData[index].playerData.distance > 2548.7">
              <div class="round_boxesYou">
                <span>You: </span>
                <span>{{ result.resultData.roundData[index].playerData.time.toHHMMSS() }}</span>
              </div>
              <div class="round_boxesThey">
                <span>They: </span>
                <span>{{ result.resultData.roundData[index].opponentData.time.toHHMMSS() }}</span>
              </div>
            </template>
            <template v-else>
              <div class="round_boxesYou">
                <span>You: </span>
                <span>{{ result.resultData.roundData[index].playerData.speed.toTestBowl() }}</span>
              </div>
              <div class="round_boxesThey">
                <span>They: </span>
                <span>{{ result.resultData.roundData[index].opponentData.speed.toTestBowl() }}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="round_scores">
          <div class="resul_Stars">
            <span
              v-if="
                result.resultData.playerScore -
                  result.resultData.opponentScore >=
                result.prizeBoard.starPoints[2]
              "
              class="starYou"
              >★★★</span
            >
            <span
              v-else-if="
                result.resultData.playerScore -
                  result.resultData.opponentScore >=
                result.prizeBoard.starPoints[1]
              "
              class="starYou"
              >★★☆</span
            >
            <span
              v-else-if="
                result.resultData.playerScore -
                  result.resultData.opponentScore >
                result.prizeBoard.starPoints[0]
              "
              class="starYou"
              >★☆☆</span
            >
            <span v-else class="starYou" style="color: #5c5c5c">☆☆☆</span>
          </div>
          <span class="round_scoresYou">{{
            result.resultData.playerScore
          }}</span>
          <span class="round_scoresX">x</span>
          <span class="round_scoresThey">{{
            result.resultData.opponentScore
          }}</span>
        </div>
      </div>
    </div>
    <div class="for_copy">
      <div class="editable-not-editable"></div>
    </div>
    <div class="buttons_Layout">
      <button v-for="item in buttons" @click="createLadderDetail(item.id)">{{ item.name }}</button>
    </div>
    <!-- <div class="buttons_Layout">
      <button @click="copyNonce()">c1837fe5-d320-45a7-8d45-67cd87f0f11c</button>
    </div> -->
    <div class="MainCodeUtility_ClubsResult">
      <div v-for="(value, key) in clubsParsedResult" class="MainCodeUtility_ClubsDayBox">
        <div class="MainCodeUtility_Day">{{ key }}</div>
        <div class="MainCodeUtility_ClubList">
          <div class="MainCodeUtility_ClubListTitle">Tracksets</div>
          <div class="MainCodeUtility_ClubListBox">
            <div v-for="(value, key) in value.tracksets" class="MainCodeUtility_ClubListBoxItem">
              <div>{{ value }} <span class="MainCodeUtility_ClubListSub">{{ key }}</span></div>
            </div>
          </div>
        </div>
        <div class="MainCodeUtility_ClubList">
          <div class="MainCodeUtility_ClubListTitle">Criterias</div>
          <div class="MainCodeUtility_ClubListBox">
            <div v-for="(value, key) in value.criterias" class="MainCodeUtility_ClubListBoxItem">
              <div>{{ value }} <span class="MainCodeUtility_ClubListSub">{{ key }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="possiblesResult.length > 0" class="MainCodeUtility_ClubsResult">
      <div v-for="possible in possiblesResult" class="MainCodeUtility_">
        <div class="MainCodeUtility_Day">{{ possible.uuid }}</div>
        <div class="MainCodeUtility_ClubListBox">
          <div v-for="name in possible.names" class="MainCodeUtility_ClubListBoxItem">
            <div>{{ name }}</div>
          </div>
        </div>
      </div>
    </div>
    <button
      style="margin-top: 100px;"
      class="D_Button D_ButtonDark"
      @click="$router.push({ name: 'MainSwagger' })">Go to swagger</button>
    <button
      style="margin-top: 20px; margin-bottom: 50px;"
      class="D_Button D_ButtonDark"
      @click="$router.push({ name: 'Records' })">Go to home</button>
    <!-- <div class="input_EventNameLayout">
      <input
        class="input_EventName"
        type="text"
        value="INFINITE SALOONS"
        placeholder="event name"
      />
    </div> -->
  </div>
</template>

<script>
import BaseText from './BaseText.vue';
import cars_final from '../database/cars_final.json'

export default {
  name: 'MainCodeUtility',
  components: {
    BaseText
  },
  props: {
    test: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      textModel: "",
      carsUuids: [],
      result: {},
      tempEventSync: {},
      challenges: {},
      buttons: [],
      clubTDRDays: {},
      localCriteriaIds: {},
      localTracksetsIds: {},
      localUUIDtoName: {},
      clubHutchHistory: [],
      clubHutchHistoryFormated: {},
      letResolvedCriterias: {},
      letResolvedTracksets: {},
      clubsParsedResult: {},
      possiblesResult: [],
      cars_final
    };
  },
  watch: {},
  beforeMount() {
    this.result = {};
    // this.result = this.tempEventSync;

    // let textarea;
    setTimeout(() => {
      // textarea = document.querySelector('textarea.input_cars');
      // if (textarea) {
      //   textarea.value =
      //     '"5ea7da07-6ba3-4a68-8d32-9d7b088c4bfc"\n5fad4c39-743b-4c3c-af9c-16a6675ccaee';
      // }

      for (const elm of document.getElementsByClassName('editable-not-editable')) {
        elm.setAttribute('contenteditable', true);
        elm.spellcheck = false;
        elm.oncut = () => false;
        elm.onpaste = () => false;
        elm.onkeydown = (event) => {
          if (event.metaKey || event.ctrlKey) {
            return;
          }
          event.preventDefault();
        };
      }
    }, 100);

    Number.prototype.toHHMMSS = function () {
      var numm = Number(this.toFixed(3).slice(0,-1))
      var sec_num = parseInt(numm, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;
      var milesi = Math.round((numm - parseInt(numm)) * 100);
      if (this * 10000 - parseInt(this) * 10000 >= 9995) {
        milesi = 0;
        seconds += 1;
      }

      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (milesi < 10) {
        milesi = '0' + milesi;
      }
      return minutes + ':' + seconds + ':' + milesi;
    };
    Number.prototype.toTestBowl = function () {
      return parseInt(this * 2.237)
    };

    this.loadClubs();
  },
  mounted() {},
  computed: {},
  methods: {
    intercept(e) {
      let text = e.clipboardData.getData('text');

      if (text.length === 36) this.result = text;
      else this.result = JSON.parse(text);

      // console.log(this.result);
      if (this.result.tieredPrizes) {
        this.resolveCarsDisplay();
      }
      if (this.result.ladders) {
        this.resolveLadders();
      }
      if (this.result.ladder) {
        this.resolveLadderInner();
      }
      if (this.result.Message) {
        this.resolveClubs();
      }
      if (this.result.playerDeck) {
        this.resolvePlayerDeck();
      }
      if (typeof this.result === 'string' && this.result.length === 36) {
        this.lookUuid();
      }
      setTimeout(() => {
        e.srcElement.value = '';
      }, 10);
    },
    interceptUuid(e) {
      var v4 = new RegExp(
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g
      );
      let text = e.clipboardData.getData('text');
      this.carsUuids = text.match(v4);
      setTimeout(() => {
        e.srcElement.value = '';
      }, 10);
    },
    resolveCarsDisplay() {

      //"prizeType": 3, CAR
      // let eventMockup = {"prizesAwarded":false,"eventBonusPointFlexibleCriteriaId":"00000000-0000-0000-0000-000000000000","eventBonusPointRequirement":"00000000-0000-0000-0000-000000000000","eventBonusPointMultiplier":100,"eligibilityCardGroupIds":[],"eligibilityCardGroupCardsRequired":[],"flexibleCriteriaIds":["ef849861-d1f5-4e9b-a769-77da3ccb5f8f"],"maxHQ":415,"noDuplicates":false,"prizeCardEntryRequirement":null,"requirePrizeCard":false,"id":"ce32e3f5-2680-4a43-a9b3-06e2748ce0dc","name":"LOOK CARS","version":1,"quote":"0-500","mpMatchType":1,"tieredPrizeId":"6f64fcf6-34c3-457b-8cd1-b31ee76a921c","bucketSize":500,"ticketRegenerationTime":1800000,"image":"EventSuzuki","minRQ":0,"maxRQ":500,"minEloScore":0,"maxEloScore":9999999,"eventCardPackId":"4884441a-74a3-4b27-b1c8-53f604e5ffd4","startDateTime":"2022-06-16T21:00:00.000Z","endDateTime":"2023-06-19T21:00:00.000Z","filteringQueryStrings":["[\"((\\\"manufacturerguid\\\"=\\\"2e561187-fb92-4ef7-91b2-33ff5c99b1b7\\\"|\\\"manufacturerguid\\\"=\\\"fe020624-d3aa-4370-839c-7fd2586298cf\\\"|\\\"manufacturerguid\\\"=\\\"9dd15c7e-d896-4f0b-af3b-71fede233138\\\")&(\\\"drivetype\\\"=\\\"RWD\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]"],"flexibleCriteriaRequired":[5],"flexibleCriteriaAnalyticsNames":["(Tri Series) Suzuki Escudo Pikes Peak Finals - 5x (Lancia, Pagani, Maserati) & RWD & NP"],"analyticsName":"CARS LOOK"};
      // let tieredMockup = {"id":"6f64fcf6-34c3-457b-8cd1-b31ee76a921c","modificationTime":"2022-05-25T17:44:20.455Z","name":"CLO16z Tri Series Suzuki Escudo Pikes Peak Finals 150-500 (25\/05\/22)","tiers":[],"defaultEloPrize":0,"defaultPrizes":[{"prizeType":3,"prizeValue":"2711ec91-9544-4788-a3dd-985376a6e4a1","numCardRecordIdsRequired":1,"cardRecordIds":null},{"prizeType":4,"prizeValue":"32ed2af2-b7ed-4fa9-a169-55dd1c569e8a","numCardRecordIdsRequired":5,"cardRecordIds":null},{"prizeType":2,"prizeValue":"25","numCardRecordIdsRequired":0,"cardRecordIds":null},{"prizeType":1,"prizeValue":"15000","numCardRecordIdsRequired":0,"cardRecordIds":null},{"prizeType":9,"prizeValue":"40","numCardRecordIdsRequired":0,"cardRecordIds":null}],"usePrizeTierElo":true};
      // let tiersMockUp = {
      //     "numPeopleInTier": 3,
      //     "prizes": [
      //         {
      //             "prizeType": 3,
      //             "prizeValue": "f6f28534-3a4e-417e-a32e-aca6c2f280f1",
      //             "numCardRecordIdsRequired": 1,
      //             "cardRecordIds": null
      //         },
      //         {
      //             "prizeType": 2,
      //             "prizeValue": "9999",
      //             "numCardRecordIdsRequired": 0,
      //             "cardRecordIds": null
      //         },
      //         {
      //             "prizeType": 1,
      //             "prizeValue": "9999",
      //             "numCardRecordIdsRequired": 0,
      //             "cardRecordIds": null
      //         },
      //         {
      //             "prizeType": 9,
      //             "prizeValue": "999",
      //             "numCardRecordIdsRequired": 0,
      //             "cardRecordIds": null
      //         }
      //     ],
      //     "eloPrize": 500
      // };
      // let tiersfinal = [];
      // let tempTt = {};
      // this.carsUuids.map(x => {
      //   tempTt = JSON.parse(JSON.stringify(tiersMockUp));
      //   tempTt.prizes[0].prizeValue = x;
      //   tiersfinal.push(tempTt);
      // });

      // let realTieredPrize = this.result.tieredPrizes.find(x => x.id === tieredMockup.id);
      // if (realTieredPrize) {
      //   realTieredPrize.tiers = tiersfinal;
      // } else {
      //   tieredMockup.tiers = tiersfinal;
      //   this.result.tieredPrizes.push(tieredMockup);
      // }
      
      let today = new Date();
      let newStart = new Date();
      newStart.setDate(newStart.getDate() - 2);
      let tempDate;
      this.result.events.map(x => {
        tempDate = new Date(x.startDateTime);
        if (tempDate > today) {
          x.startDateTime = newStart.toISOString();
        }
        // if (x.analyticsName && (x.analyticsName.includes("QUALS") || x.analyticsName.includes("PRELIMS"))) {
        //   x.minRQ = 150;
        //   x.maxRQ = 500;
        // }
      })

      // let realEvent = this.result.events.find(x => x.id === eventMockup.id);
      // if (realEvent) {
      //   realEvent = eventMockup;
      // } else {
      //   this.result.events.push(eventMockup);
      // }

      // console.log(this.result.tieredPrizes.find(x => x.id === tieredMockup.id));
      // console.log(this.result.events.find(x => x.id === eventMockup.id));






      let temp = document.querySelector(".for_copy");
      temp.style.display = 'block';
      temp.setAttribute('contenteditable', true);
      // temp.innerText = JSON.stringify(this.result);
      try {
        navigator.clipboard.writeText(JSON.stringify(this.result));
      } catch (error) {
        console.log("Can't copy")
      }

    },
    resolveLadders() {
      
      let today = new Date();
      let newStart = new Date();
      newStart.setDate(newStart.getDate() - 2);
      let tempDate;
      this.result.ladders.map(x => {
        x.requirePrizeCard = false;
        x.rqMin = 150;
        x.rqMax = 500;
        x.hideOnCompletion = false;
        tempDate = new Date(x.startDateTime);
        if (tempDate > today) {
          x.startDateTime = newStart.toISOString();
        }
      })

      let temp = document.querySelector(".for_copy");
      temp.style.display = 'block';
      temp.setAttribute('contenteditable', true);
      temp.innerText = today.toISOString();
      try {
        navigator.clipboard.writeText(JSON.stringify(this.result));
      } catch (error) {
        console.log("Can't copy")
      }
      this.challenges = this.result;

      // this.buttons = [];
      // this.challenges.ladders.map(x => {
      //   this.buttons.push({ name: x.name, id: x.id })
      // })

    },
    resolveLadderInner() {
      
      let today = new Date();
      let newStart = new Date();
      newStart.setDate(newStart.getDate() - 2);
      let tempDate;
      this.result.ladder.startDateTime = newStart.toISOString();
      this.result.ladder.inventoryItemAmount = 0;

      let newPlayerData = {
        userId: "b940b9fa-490c-42cb-9ca8-edee1ff9dbe3", // Cali
        ladderId: this.result.ladder.id,
        numTickets: 5,
        lastTicketRegen: "2023-08-13T23:46:33.370Z",
        currentRung: this.result.ladder.rungEligibility.length - 1, // round 
        starsWon: 0,
        entryCostPaid: true,
        rungEntryCostPaid: false,
        rungs: []
      };

      this.result.ladder.rungEligibility.map(x => {
        x.inventoryItemRequirement = null;
        x.inventoryItemAmount = 0;
        x.inventoryItemConsumed = false;
        newPlayerData.rungs.push({
          numWins: 1,
          entryCostPaid: false,
          starsWon: 3
        })
      })

      newPlayerData.rungs.pop();
      this.result.ladderPlayerData = newPlayerData;


      let temp = document.querySelector(".for_copy");
      temp.style.display = 'block';
      temp.setAttribute('contenteditable', true);
      temp.innerText = today.toISOString();
      try {
        navigator.clipboard.writeText(JSON.stringify(this.result));
      } catch (error) {
        console.log("Can't copy")
      }
      this.challenges = this.result;

      // this.buttons = [];
      // this.challenges.ladders.map(x => {
      //   this.buttons.push({ name: x.name, id: x.id })
      // })

    },
    createLadderDetail(eventId) {
      let today = new Date();
      let temp = document.querySelector(".for_copy");
      temp.style.display = 'block';
      temp.setAttribute('contenteditable', true);
      if (!this.challenges) {
        temp.innerText = "No challenge"
      };

      let mockup = {"serverId":"cccggame-6546d7bfbc-wqbj8_3000","requestId":"5ff8b8e3-88bd-491c-861e-ef8e8b233e2a","serverTime":"2022-07-01T02:45:31.610Z","ladderPlayerData":{"userId":"2bdd2a01-f1cd-4f81-aa04-323546c5e2aa","ladderId":"c5e4f3c5-c548-499e-ba9e-a9ee0f508235","numTickets":0,"lastTicketRegen":"2022-06-30T21:05:58.605Z","currentRung":5,"starsWon":0,"entryCostPaid":true,"rungEntryCostPaid":false,"rungs":[{"numWins":1,"entryCostPaid":false,"starsWon":3},{"numWins":1,"entryCostPaid":false,"starsWon":3},{"numWins":1,"entryCostPaid":false,"starsWon":3},{"numWins":1,"entryCostPaid":false,"starsWon":3},{"numWins":1,"entryCostPaid":false,"starsWon":3}]},"ladder":{"id":"c5e4f3c5-c548-499e-ba9e-a9ee0f508235","name":"Collection Bounties","description":"-","bossStartQuote":"-","bossEndQuote":"-","packId":"152fb12f-a1e8-422e-b631-6db195fcc5e0","ticketRefreshTime":0,"rqMin":175,"rqMax":500,"bonusPointRequirement":null,"bonusPointMultiplier":null,"characterImage":"ChallengeFamousTracks_06","challengeSetIds":["95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73"],"opponents":[{"cardRecordId":"f8c96640-2be6-41f4-9d9a-858bea473af5","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e9279901-0703-47ad-812f-cb8309e56ec8","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e17d946e-ffcb-46b1-bcad-0680b12ffd4f","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"41145c6d-14e5-4dc5-8980-bd21acc305a2","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"29130ad4-032d-4634-a4f2-2c0970a08f93","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"17e67a49-e7c5-498c-b95b-3e0c8fa24bd9","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"80400286-ed80-4a30-a436-25da5ad60e4c","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"dfffdf4d-732b-4b76-ba59-327690c0619c","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"87bc06f6-d97c-4d8e-a42c-236f14884295","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"94dde6f6-49f7-4ffa-89eb-c717c8bcb814","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e07ea2f9-754b-40f6-ae90-4bd646fe50a8","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"615535d1-dbea-4711-b248-151881efc871","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ecece41d-daee-4f22-a407-4e334e860a58","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"76c9cfd6-587c-4993-96b2-07f838d069de","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ff4a21cf-2300-4e0a-ab6e-b460c2c10fbc","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"b2751ef4-7572-4e7a-8f54-502c3b626f06","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"4cd4da25-1781-47d5-81c3-a96a5633cbec","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"a1e7c05b-7413-4c78-b575-96f8f777cdae","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"4eea3f55-66b7-4493-907e-d4b518cb80b6","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"56ce5e98-a952-4927-9798-71387ca218fc","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ac09f97e-d91a-45ee-bdd7-16f6c4ff7ac1","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e6a15e99-1be0-4fd8-9dd4-0bdead8324d6","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"6c27befa-6ff0-4fa5-a663-dfd6805afdbb","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"6ba777f3-9511-4b69-8ec5-a90074bb4868","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c89229e2-9045-4038-8590-03a3c11effc1","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c6b0f36b-78c8-4c94-9390-e6da9df95081","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"66bbc918-fe9d-43fb-a160-60d33f120a7e","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"d42ee070-d2a6-4474-aced-06d4567d250f","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e768c99d-6fa2-4d6e-b7ab-5acf5b20a34d","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e8a55c43-a691-4a2f-a7e1-c670aa9e5b50","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"f91e6130-1bf9-455d-9a50-c88e89c03bb7","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"30322078-19ef-4339-b9eb-01e88aa02b1a","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"5d6ae3e7-1416-4ce2-8c1a-86e723303498","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"f22b2e24-d618-4ea6-91c3-81847dfb4c13","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ced2e646-bfaf-48ea-afcf-ddea9c31b080","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"da91076c-7643-4410-b614-97ddc2a53b05","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"68b6a461-ade3-4638-8e2d-51662e36edc5","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"34d135c2-155a-4703-adf2-b2a3640089a2","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c9738067-171b-4e52-aac4-ccdf19d57fd2","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"21ee88db-bc56-4850-abae-0ce9e25aa819","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ddba2859-0e51-49f7-abd8-a32fa29f3730","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"85276b5b-0eab-44f6-adef-ceb942ac737c","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"34af2152-7e5e-466a-b2da-495a944f719c","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"52a19e3a-8c3e-41a7-a77e-452fa93213d6","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7dde4d56-02f9-4f12-b8d2-0285664fb96c","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3b18399f-b28b-481c-82d1-282af2d1bf4e","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"89d17ea1-5639-46d0-a517-e36557b1fbcd","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e2ffb1c5-35ee-4ce8-af1a-63ace28d1d41","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c05b89ee-88ea-402c-909f-44589f08d9fd","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"63ffad15-38db-40e6-81a2-869e305293bc","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0}],"zoneSize":1,"zoneEligibility":[{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":500}],"prizes":[{"prizeType":1,"prizeValue":5000,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":10000,"prizeMaxClaims":1},{"prizeType":11,"prizeValue":"73f35abf-b611-41b6-a68b-337c37999c37","prizeMaxClaims":1},{"prizeType":2,"prizeValue":100,"prizeMaxClaims":1},{"prizeType":6,"prizeValue":2,"prizeMaxClaims":1},{"prizeType":11,"prizeValue":"73f35abf-b611-41b6-a68b-337c37999c37","prizeMaxClaims":1},{"prizeType":1,"prizeValue":30000,"prizeMaxClaims":1},{"prizeType":11,"prizeValue":"152fb12f-a1e8-422e-b631-6db195fcc5e0","prizeMaxClaims":1},{"prizeType":6,"prizeValue":3,"prizeMaxClaims":1},{"prizeType":3,"prizeValue":"31389b65-b1ed-41ee-9994-895c9b0e8c3b","prizeMaxClaims":1}],"startDateTime":"2022-06-22T12:00:00.000Z","endDateTime":"2022-07-06T10:00:00.000Z","priority":99999,"version":1,"category":"d7b7dc0b-b94e-4837-884b-22ebb5da44f7","prizeCardEntryRequirement":null,"requirePrizeCard":false,"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false,"rungEligibility":[{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false}],"maxTickets":1,"ticketAttemptsBased":true,"zoneFlexibleCriteria":[{"flexibleCriteriaId":"b119a524-f2d8-40b0-80a7-6297901d96fe","filteringQueryString":"[\"((\\\"model\\\"=\\\"b6b3f0fe-3d95-4628-951b-5b46656a6fd6\\\"))\",\"((\\\"model\\\"=\\\"1b5350c8-a942-4a06-94ae-c6708f01b945\\\"))\",\"((\\\"model\\\"=\\\"b28d8012-8b6b-4280-ae20-dc9d200dd4a2\\\"))\",\"((\\\"model\\\"=\\\"b3b12230-4034-4da5-91df-dfa6196e8bfd\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 1 - Every Common","flexibleCriteriaRequired":[1,1,1,1,5]},{"flexibleCriteriaId":"17394004-abf9-44e2-9966-314991da524a","filteringQueryString":"[\"((\\\"model\\\"=\\\"b6b3f0fe-3d95-4628-951b-5b46656a6fd6\\\"))\",\"((\\\"model\\\"=\\\"1b5350c8-a942-4a06-94ae-c6708f01b945\\\"))\",\"((\\\"model\\\"=\\\"b28d8012-8b6b-4280-ae20-dc9d200dd4a2\\\"))\",\"((\\\"model\\\"=\\\"b3b12230-4034-4da5-91df-dfa6196e8bfd\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\",\"((\\\"fuse\\\"=\\\"5\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 2 - Every Common Fused","flexibleCriteriaRequired":[1,1,1,1,5,5]},{"flexibleCriteriaId":"a08086a6-5512-477e-96c4-32e759b4107c","filteringQueryString":"[\"((\\\"model\\\"=\\\"70ae25a0-b855-437e-8285-ab53eaceb0b8\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 3 - Volvo C303","flexibleCriteriaRequired":[1,5]},{"flexibleCriteriaId":"51e62315-49ab-4ac7-87ce-7c9fb1c3e589","filteringQueryString":"[\"((\\\"model\\\"=\\\"70ae25a0-b855-437e-8285-ab53eaceb0b8\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\",\"((\\\"fuse\\\"=\\\"5\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 4 - Volvo C303 Fused","flexibleCriteriaRequired":[1,5,5]},{"flexibleCriteriaId":"b2d73384-b96d-48af-8ebd-8146ab9726ad","filteringQueryString":"[\"((\\\"groundclearancetype\\\"=\\\"Low\\\")&(\\\"tags\\\"=\\\"4000000000\\\")&(\\\"tier\\\"=\\\"4\\\"|\\\"tier\\\"=\\\"5\\\"|\\\"tier\\\"=\\\"6\\\"|\\\"tier\\\"=\\\"7\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 5 - Super Rare+, low","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"87bc290d-71ee-4b78-bb23-0de2598e78ce","filteringQueryString":"[\"((\\\"country\\\"=\\\"Germany\\\")&(\\\"tags\\\"=\\\"4000000000\\\")&(\\\"tier\\\"=\\\"4\\\"|\\\"tier\\\"=\\\"5\\\"|\\\"tier\\\"=\\\"6\\\"|\\\"tier\\\"=\\\"7\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 6 - Super Rare+, German","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"1c317b8c-4d1a-4ee3-8e76-e5b5823c7c73","filteringQueryString":"[\"((\\\"tags\\\"=\\\"4000000000\\\")&(\\\"tier\\\"=\\\"4\\\"))\",\"((\\\"fuse\\\"=\\\"5\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 7 - 1 Super Rare, fused","flexibleCriteriaRequired":[1,5]},{"flexibleCriteriaId":"fa84fcf2-d37e-4fd7-9654-069fdd2846f8","filteringQueryString":"[\"((\\\"model\\\"=\\\"f85335b5-3b3b-462e-b3e3-c401d82a0ba5\\\"))\",\"((\\\"model\\\"=\\\"c8ccd862-0b24-4e32-b7a8-db7fc57c8d1c\\\"))\",\"((\\\"model\\\"=\\\"58ab7475-56c5-42ae-8e08-6e4e1b902f83\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\",\"((\\\"fuse\\\"=\\\"5\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 8 - Every SR Fused","flexibleCriteriaRequired":[1,1,1,5,5]},{"flexibleCriteriaId":"baa1c2c4-04dc-4f42-afcb-774746dd6012","filteringQueryString":"[\"((\\\"tier\\\"=\\\"6\\\")&(\\\"tags\\\"=\\\"4000000000\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty  9 - 1 Epic","flexibleCriteriaRequired":[1,5]},{"flexibleCriteriaId":"ffd75a59-0025-4663-9c0a-7f33f29192ec","filteringQueryString":"[\"((\\\"tier\\\"=\\\"6\\\")&(\\\"tags\\\"=\\\"4000000000\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\",\"((\\\"fuse\\\"=\\\"1\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"Famous Tracks, Bounty 10 - 1 Fused Epic","flexibleCriteriaRequired":[1,5,5]}],"cardPackType":1,"bonusPointFlexibleCriteriaId":null,"rungPrizes":[[{"prizeType":1,"prizeValue":5000,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":10000,"prizeMaxClaims":1}],[{"prizeType":11,"prizeValue":"73f35abf-b611-41b6-a68b-337c37999c37","prizeMaxClaims":1}],[{"prizeType":2,"prizeValue":100,"prizeMaxClaims":1}],[{"prizeType":6,"prizeValue":2,"prizeMaxClaims":1}],[{"prizeType":11,"prizeValue":"73f35abf-b611-41b6-a68b-337c37999c37","prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":30000,"prizeMaxClaims":1}],[{"prizeType":11,"prizeValue":"152fb12f-a1e8-422e-b631-6db195fcc5e0","prizeMaxClaims":1}],[{"prizeType":6,"prizeValue":3,"prizeMaxClaims":1}],[{"prizeType":3,"prizeValue":"31389b65-b1ed-41ee-9994-895c9b0e8c3b","prizeMaxClaims":1}]],"hideOnCompletion":false},"flexibleCardPacks":[{"id":"152fb12f-a1e8-422e-b631-6db195fcc5e0","name":"FAMOUS TRACKS CARBON FIBER","cardPackType":1,"flexibleCriteriaId":"a6527d40-5948-4adc-b7a9-97947e1327d2","available":1,"multiplier":1,"softCurrency1Cost":0,"hardCurrency1Cost":1599,"keepCards":false,"imageName":"FamousTracksUltraRare","description":"5 CARDS; AT LEAST 1 ULTRA RARE OR BETTER & 1 SUPER RARE OR BETTER FAMOUS TRACKS","cardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,1,0.2025,0.025]},{"cardGroupTierPercents":[1,1,1,1,0.1075,0.0325,0.005]},{"cardGroupTierPercents":[1,1,1,0.1,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.05,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.025,0,0,0]}],"currency":[{"name":"softCurrency1","value":0},{"name":"hardCurrency1","value":0},{"name":"garageSlots","value":0},{"name":"xp","value":0}],"isVisibleInStore":false,"rarityId":5,"filteringQueryString":"[\"((\\\"tags\\\"=\\\"4000000000\\\"))\",\"((\\\"tags\\\"=\\\"4000000000\\\"))\"]","inventoryItems":[],"cardsCount":5,"uiElements":{"backgroundColorTint":"","frontStripColor":"","backgroundColorTint2":"","backgroundTex":"","collection":"","packMask":"","logo":"","frontStrip":"","backgroundTex2":"","text":"","car":""},"inventoryItemCost":null,"inventoryItemCostRequired":0,"displayCardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,1,0.2025,0.025]},{"cardGroupTierPercents":[1,1,1,1,0.1075,0.0325,0.005]},{"cardGroupTierPercents":[1,1,1,0.1,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.05,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.025,0,0,0]}],"analyticsName":"FAMOUS TRACKS CARBON FIBER"},{"id":"73f35abf-b611-41b6-a68b-337c37999c37","name":"FAMOUS TRACKS PREMIUM","cardPackType":1,"flexibleCriteriaId":"90e928d1-7245-4612-9e4c-cf49b0d7a929","available":1,"multiplier":1,"softCurrency1Cost":0,"hardCurrency1Cost":599,"keepCards":false,"imageName":"FamousTracksSuperRare","description":"5 CARDS; AT LEAST 1 SUPER RARE OR BETTER FAMOUS TRACKS","cardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,0.1345,0.0245,0.0045]},{"cardGroupTierPercents":[1,1,1,0.24475,0.00475,0.0015,0.0005]},{"cardGroupTierPercents":[1,1,0.1775,0.0175,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]}],"currency":[{"name":"softCurrency1","value":0},{"name":"hardCurrency1","value":0},{"name":"garageSlots","value":0},{"name":"xp","value":0}],"isVisibleInStore":false,"rarityId":4,"filteringQueryString":"[\"((\\\"tags\\\"=\\\"4000000000\\\"))\"]","inventoryItems":[],"cardsCount":5,"uiElements":{"backgroundColorTint":"","frontStripColor":"","backgroundColorTint2":"","backgroundTex":"","collection":"","packMask":"","logo":"","frontStrip":"","backgroundTex2":"","text":"","car":""},"inventoryItemCost":null,"inventoryItemCostRequired":0,"displayCardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,0.1345,0.0245,0.0045]},{"cardGroupTierPercents":[1,1,1,0.24475,0.00475,0.0015,0.0005]},{"cardGroupTierPercents":[1,1,0.1775,0.0175,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]}],"analyticsName":"FAMOUS TRACKS PREMIUM"}]}

      mockup.ladder = this.challenges.ladders.find(x => x.id === eventId);
      mockup.ladder.description = "-";
      mockup.ladder.bossStartQuote = "-";
      mockup.ladder.bossEndQuote = "-";
      mockup.ladder.packId = "152fb12f-a1e8-422e-b631-6db195fcc5e0";
      mockup.ladder.bonusPointRequirement = null;
      mockup.ladder.bonusPointMultiplier = null;
      mockup.ladder.version = 1;
      mockup.ladder.cardPackType = 1;
      mockup.ladder.bonusPointFlexibleCriteriaId = null;
      mockup.ladder.challengeSetIds = ["95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73"];
      mockup.ladder.opponents = [{"cardRecordId":"f8c96640-2be6-41f4-9d9a-858bea473af5","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e9279901-0703-47ad-812f-cb8309e56ec8","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e17d946e-ffcb-46b1-bcad-0680b12ffd4f","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"41145c6d-14e5-4dc5-8980-bd21acc305a2","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"29130ad4-032d-4634-a4f2-2c0970a08f93","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"17e67a49-e7c5-498c-b95b-3e0c8fa24bd9","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"80400286-ed80-4a30-a436-25da5ad60e4c","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"dfffdf4d-732b-4b76-ba59-327690c0619c","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"87bc06f6-d97c-4d8e-a42c-236f14884295","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"94dde6f6-49f7-4ffa-89eb-c717c8bcb814","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e07ea2f9-754b-40f6-ae90-4bd646fe50a8","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"615535d1-dbea-4711-b248-151881efc871","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ecece41d-daee-4f22-a407-4e334e860a58","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"76c9cfd6-587c-4993-96b2-07f838d069de","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ff4a21cf-2300-4e0a-ab6e-b460c2c10fbc","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"b2751ef4-7572-4e7a-8f54-502c3b626f06","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"4cd4da25-1781-47d5-81c3-a96a5633cbec","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"a1e7c05b-7413-4c78-b575-96f8f777cdae","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"4eea3f55-66b7-4493-907e-d4b518cb80b6","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"56ce5e98-a952-4927-9798-71387ca218fc","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ac09f97e-d91a-45ee-bdd7-16f6c4ff7ac1","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e6a15e99-1be0-4fd8-9dd4-0bdead8324d6","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"6c27befa-6ff0-4fa5-a663-dfd6805afdbb","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"6ba777f3-9511-4b69-8ec5-a90074bb4868","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c89229e2-9045-4038-8590-03a3c11effc1","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c6b0f36b-78c8-4c94-9390-e6da9df95081","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"66bbc918-fe9d-43fb-a160-60d33f120a7e","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"d42ee070-d2a6-4474-aced-06d4567d250f","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e768c99d-6fa2-4d6e-b7ab-5acf5b20a34d","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e8a55c43-a691-4a2f-a7e1-c670aa9e5b50","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"f91e6130-1bf9-455d-9a50-c88e89c03bb7","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"30322078-19ef-4339-b9eb-01e88aa02b1a","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"5d6ae3e7-1416-4ce2-8c1a-86e723303498","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"f22b2e24-d618-4ea6-91c3-81847dfb4c13","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ced2e646-bfaf-48ea-afcf-ddea9c31b080","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"da91076c-7643-4410-b614-97ddc2a53b05","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"68b6a461-ade3-4638-8e2d-51662e36edc5","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"34d135c2-155a-4703-adf2-b2a3640089a2","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c9738067-171b-4e52-aac4-ccdf19d57fd2","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"21ee88db-bc56-4850-abae-0ce9e25aa819","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ddba2859-0e51-49f7-abd8-a32fa29f3730","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"85276b5b-0eab-44f6-adef-ceb942ac737c","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"34af2152-7e5e-466a-b2da-495a944f719c","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"52a19e3a-8c3e-41a7-a77e-452fa93213d6","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7dde4d56-02f9-4f12-b8d2-0285664fb96c","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3b18399f-b28b-481c-82d1-282af2d1bf4e","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"89d17ea1-5639-46d0-a517-e36557b1fbcd","cardId":"03864f85-ecbe-49cd-a088-296cd704255f","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e2ffb1c5-35ee-4ce8-af1a-63ace28d1d41","cardId":"b6b3f0fe-3d95-4628-951b-5b46656a6fd6","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c05b89ee-88ea-402c-909f-44589f08d9fd","cardId":"749f0cb1-c777-4396-b131-4565ce3500e6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"63ffad15-38db-40e6-81a2-869e305293bc","cardId":"70ae25a0-b855-437e-8285-ab53eaceb0b8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0}]

      mockup.ladderPlayerData = null;
      mockup = {"serverId":"cccggame-6546d7bfbc-wqbj8_3000","requestId":"5ff8b8e3-88bd-491c-861e-ef8e8b233e2a","serverTime":"2022-07-01T02:45:31.610Z","ladderPlayerData":null,"ladder":{"id":"c46cb97a-24c5-4e05-af43-c457545eb3d8","name":"Retro Racing","description":"-","bossStartQuote":"-","bossEndQuote":"-","packId":"745fcfe6-88fc-4ecd-9cce-324f59eb1dfa","ticketRefreshTime":0,"rqMin":175,"rqMax":500,"bonusPointRequirement":null,"bonusPointMultiplier":null,"characterImage":"EventTuneUp","challengeSetIds":["488bf676-01ed-4fb4-9b60-991f6c1c4bef","c0873b6a-833e-4a99-a4b3-679474a55a9e","0ee115cf-12e4-4323-93a9-9cb3c3d357fe","60c0b356-63b2-494b-b882-7a7736d776bc","7b4588a6-25c4-462d-ba43-08229269264d","550232fe-e7fb-4048-92d6-13bcb5bde10a","e9df0160-e6fe-4aa0-ac02-2ceb1719c550","550232fe-e7fb-4048-92d6-13bcb5bde10a","e9df0160-e6fe-4aa0-ac02-2ceb1719c550","e3ba66e3-3156-4f9b-b8d9-3582c041cd40","e60bba4c-1eec-481e-b800-8d19bcc486f1","652a85d1-1bfb-4af2-9a53-839aa0ad9d5b","3b84290b-5d61-4a21-bfca-f2aa25f0ac2c","4a51b142-37ce-494b-a506-1e2a642d8c19","ae1a1fb0-89e7-44a1-9702-79aec4f2ba7a","524fe467-37e2-4aca-998c-c8993fe01b51","2a368348-d0df-463b-8402-9d1a34ba1387","a9e5b5dc-18e5-4984-9216-2d5c3ffa1189","a9e5b5dc-18e5-4984-9216-2d5c3ffa1189","03087b6a-02ce-4696-b751-80dd0a0eb9ce"],"opponents":[{"cardRecordId":"809023e2-d8e6-4a18-a523-95df132586ec","cardId":"f3bbfd07-e7d9-4d0d-a903-0fefd2cc1a60","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"192f6770-8dd1-4fd7-9eb4-408da5778b72","cardId":"edbaa692-b93b-4a6d-800f-c388f1576fcc","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3438b1bb-88f1-414b-82c8-fb577b28f716","cardId":"8b365df0-2811-4e2a-ba81-eac73ea6ffc3","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"89065cab-3274-4417-9024-24e497ea9548","cardId":"f3bbfd07-e7d9-4d0d-a903-0fefd2cc1a60","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"9a36fa68-72c9-4cd5-9ea1-fe6269522073","cardId":"edbaa692-b93b-4a6d-800f-c388f1576fcc","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"cefc8091-faf4-4488-91e3-00e07101b9e6","cardId":"edbaa692-b93b-4a6d-800f-c388f1576fcc","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"a267a2b2-7a72-4b3d-82fc-1c989b6bd1f2","cardId":"8b365df0-2811-4e2a-ba81-eac73ea6ffc3","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"23947d37-b874-4daa-92b2-801e7a320802","cardId":"bc48ec48-f65b-42f4-b7a1-eb8f8b4853b1","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"784a9388-dda5-4e62-8dd5-94931c964519","cardId":"b6b53a24-4827-4ace-a7f0-fd54b562c195","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"973648b7-f7a7-4652-a809-55042c0f32d9","cardId":"f3bbfd07-e7d9-4d0d-a903-0fefd2cc1a60","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e56ee0b1-c129-47c4-9b74-ea0eaef74424","cardId":"b6b53a24-4827-4ace-a7f0-fd54b562c195","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"397cea25-4b6e-4d96-9b07-e83aa4893cb4","cardId":"edbaa692-b93b-4a6d-800f-c388f1576fcc","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e719b143-c6f3-45c8-aab9-231370db2b54","cardId":"074edcb6-adab-4534-8217-71eff862bbaa","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"2dd9488e-6b1f-4f25-830b-b0cfcf6957ef","cardId":"f3bbfd07-e7d9-4d0d-a903-0fefd2cc1a60","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"1c35b886-c48d-45ef-a5d0-e0b16ba5834c","cardId":"1a9d4bec-d19d-4f22-8fc4-53b337dcc3aa","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e5119d96-5558-4de5-8118-0bbc67267ac6","cardId":"b6b53a24-4827-4ace-a7f0-fd54b562c195","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"0447dfde-0a97-44f4-ab97-9a26a7012e8c","cardId":"6ba20a6a-0b3c-4d58-8dd8-ad41b69d5de5","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"303bec28-e6d6-4bf1-b92d-861120718c2d","cardId":"8b365df0-2811-4e2a-ba81-eac73ea6ffc3","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3e60a285-93e2-4a38-be0c-cb828ec57734","cardId":"edbaa692-b93b-4a6d-800f-c388f1576fcc","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c86cc476-2b7b-4535-aee2-fa21be9a2ff2","cardId":"6ba20a6a-0b3c-4d58-8dd8-ad41b69d5de5","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"dde1bb11-48b7-43cb-b22c-7d874960a465","cardId":"8b365df0-2811-4e2a-ba81-eac73ea6ffc3","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"e90fd7bb-02d4-4250-823c-d8083015aafb","cardId":"83e5e563-e5dd-42c8-9557-02e4a5f3be30","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"dfb8ae57-76cf-4405-bc89-67c74203d66b","cardId":"edbaa692-b93b-4a6d-800f-c388f1576fcc","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7eac7679-c321-4d55-9547-70e8a4b67dca","cardId":"b6b53a24-4827-4ace-a7f0-fd54b562c195","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"bf0d0136-8b5f-459a-810f-8538487afbbf","cardId":"6ba20a6a-0b3c-4d58-8dd8-ad41b69d5de5","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7924e498-4b36-4f82-8a75-54fdac9da5e2","cardId":"d1243f6c-a2e5-496a-863c-39b5947bd7e4","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"847585df-b585-491d-9604-e03a6999af7f","cardId":"8b365df0-2811-4e2a-ba81-eac73ea6ffc3","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"d546016f-4f82-4c59-bf99-82f1fcf9ab86","cardId":"d1243f6c-a2e5-496a-863c-39b5947bd7e4","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"bcda7721-94df-4db1-a6c6-ff3e6140db05","cardId":"d9b05775-a3ee-4314-bda0-c1642d934333","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"22f274e5-b0e9-4633-8340-1072eeb2a80c","cardId":"96ef5a4d-386c-463a-afe0-561e546267b6","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"8cd75d23-33d5-4f75-b165-8e9262d1e9c6","cardId":"68c6dce9-cf8f-419d-9d6e-d9351f4542cc","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ebc12309-c39e-4ecc-8db0-607a228185bf","cardId":"83e5e563-e5dd-42c8-9557-02e4a5f3be30","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"21cfacbd-6124-4558-bb87-f279b80442c9","cardId":"6acb1049-e35e-4cce-9b24-91e3eacc9a16","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"38bda723-9785-4402-9ccd-5906fe392242","cardId":"96ef5a4d-386c-463a-afe0-561e546267b6","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"01cc0975-eb29-45b6-8bc8-8b591154bb3f","cardId":"d1243f6c-a2e5-496a-863c-39b5947bd7e4","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7428ee95-526e-41b0-b066-714ad75f1f92","cardId":"d9b05775-a3ee-4314-bda0-c1642d934333","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"4c11662e-b527-4593-81e4-890f25258b6e","cardId":"4d440907-0323-43fa-96af-f1d5b7fdc7bd","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"9b22ea6c-0403-4741-82c2-e814b9dfbc85","cardId":"d9b05775-a3ee-4314-bda0-c1642d934333","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"440717a1-cb59-4d99-b5d8-6edca0887f16","cardId":"d9b05775-a3ee-4314-bda0-c1642d934333","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"97bc8505-1b71-4d53-9975-1d1332b7dbfc","cardId":"be436a11-0da7-4378-872e-c2d452c91907","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"16a4d3c5-6637-458c-b001-7075e1ca7b94","cardId":"e0719e67-995f-42b8-9561-6db29b4c7396","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"960d9638-d30a-4433-8646-d255a282928f","cardId":"ebc38b86-b5a3-44c8-b916-800b5adbcc16","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"56fc7d3d-bcdb-473e-84c7-aa962212d2a6","cardId":"1fd18a09-4376-4101-8463-7aa80601bf90","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7d07ef4f-b35e-460e-bb6c-8f2f00318a14","cardId":"96ef5a4d-386c-463a-afe0-561e546267b6","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"04378557-1847-4114-8ce6-271d33c4b34a","cardId":"6ba20a6a-0b3c-4d58-8dd8-ad41b69d5de5","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"817fe7ff-5690-47b7-95ca-838bf4616c2a","cardId":"1fd18a09-4376-4101-8463-7aa80601bf90","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"b236a1d5-55df-4934-bb26-bbab66726042","cardId":"6ba20a6a-0b3c-4d58-8dd8-ad41b69d5de5","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"4bf79101-1a8a-4d5a-835a-81f55396364a","cardId":"d9b05775-a3ee-4314-bda0-c1642d934333","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"a022f415-5099-47df-89e7-91429e213636","cardId":"c48317d6-fd8d-447b-987e-2aa670fc50a7","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3614c6a6-98b6-43df-b51a-4add0e94d40c","cardId":"83e5e563-e5dd-42c8-9557-02e4a5f3be30","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"b6548f2d-7b9b-4804-b1ac-73e0c320869d","cardId":"8d9c60cb-82d1-4f06-b870-2fca29133940","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"db966c32-c0c8-4a76-826b-6e3da046add4","cardId":"68c6dce9-cf8f-419d-9d6e-d9351f4542cc","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"84e03c31-1981-440a-a5e4-1cd1a0653517","cardId":"c31f2158-d21a-4663-9f10-e46d5b3b5b56","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"fe839694-56b6-49f8-a764-99847d5782ea","cardId":"83e5e563-e5dd-42c8-9557-02e4a5f3be30","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"8b088d99-c33b-4dc7-8d1a-2d92de6bce29","cardId":"b2de299c-c888-48ae-9abd-a206eb122515","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7833e290-db58-4c09-a1ea-8bb88f824013","cardId":"83e5e563-e5dd-42c8-9557-02e4a5f3be30","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"58644d51-0a17-4250-83b3-9e80463a998c","cardId":"be436a11-0da7-4378-872e-c2d452c91907","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"796c0249-9cfc-47f5-afb3-53f7508ef200","cardId":"6acb1049-e35e-4cce-9b24-91e3eacc9a16","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"a784203d-cf68-4974-b576-e7d4fba7e7a8","cardId":"7dbf288a-1c8e-41ab-a696-881deba56d17","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"c89797d5-2cb7-45a2-9106-72cf1ba4cfac","cardId":"eaea15c2-3a84-4fa5-a346-3b4e5c0ca7aa","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"31929a99-69a3-4561-afb7-4353ea6e0a50","cardId":"be436a11-0da7-4378-872e-c2d452c91907","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"204161b0-5171-4329-bc04-0195b854cdbf","cardId":"8d9c60cb-82d1-4f06-b870-2fca29133940","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"235750be-8a89-4a63-883c-660d66fb948d","cardId":"f85335b5-3b3b-462e-b3e3-c401d82a0ba5","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"2297d7ac-206a-45c5-8a82-7662c19780cb","cardId":"ebc38b86-b5a3-44c8-b916-800b5adbcc16","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"70778a81-ed32-407e-a29a-594da4edf541","cardId":"769a22ca-5479-45ff-b8d7-555ebc9018bd","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"963bd034-03ff-4cf3-88e7-2a2004691948","cardId":"8d9c60cb-82d1-4f06-b870-2fca29133940","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"107bf3d1-3260-4f1c-bc36-c4eb962234fc","cardId":"1894f40d-8914-49dc-819b-59e4b33eb4eb","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3b7b6e3d-8763-43d2-934f-85c42e3ed6d0","cardId":"4d440907-0323-43fa-96af-f1d5b7fdc7bd","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"ed013f75-cbc5-48ad-a0c2-707e8f430727","cardId":"b5a49bf3-9674-47df-a142-934d5dd327a8","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"4157c1d5-26d9-404a-a197-9e0b995b9508","cardId":"b5a49bf3-9674-47df-a142-934d5dd327a8","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"fc430887-e291-465f-b456-fdca516d8759","cardId":"83e5e563-e5dd-42c8-9557-02e4a5f3be30","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"55ac7967-7b5d-44f1-b218-2e78769f5cf4","cardId":"a515d1df-ba23-44ad-85ff-b3dbde1bf06d","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"b9ee4e76-e3ca-4139-82bd-46dace6aab1b","cardId":"83e5e563-e5dd-42c8-9557-02e4a5f3be30","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"d55e3512-b7aa-479e-ad33-289100bf70a1","cardId":"7dbf288a-1c8e-41ab-a696-881deba56d17","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"93bef581-4405-47da-ab76-42f63e67d612","cardId":"769a22ca-5479-45ff-b8d7-555ebc9018bd","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"acd7fd9e-b784-4229-9f68-fed7a41010a4","cardId":"7dbf288a-1c8e-41ab-a696-881deba56d17","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"89b9c2a6-59ea-4f38-82e3-36aac150d5f9","cardId":"1fd18a09-4376-4101-8463-7aa80601bf90","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3eaf1abb-c2ec-4965-ab5f-d998e2c09ed1","cardId":"9482938d-9e56-498b-94ca-88ddc0a920d8","engineMajor":1,"engineMinor":0,"weightMajor":1,"weightMinor":0,"chassisMajor":1,"chassisMinor":0,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"30b415b3-77af-4aea-8677-d7a70ea7c972","cardId":"b05a3d39-3593-4d90-9b07-0dc963c27f05","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"87b06693-3524-4370-ac3e-41804417b15e","cardId":"32ae0e23-b9cc-4bd4-b09b-73e5e92f76ae","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"a6567b99-c077-4e2d-9011-eea44929ac70","cardId":"7dbf288a-1c8e-41ab-a696-881deba56d17","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"43248d1c-f336-4ff8-b73f-2a5254eedb42","cardId":"eb94a878-f4f8-404c-bf2d-2b0220873bb2","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"8ea52052-c8aa-491b-8891-72bd90a43ea1","cardId":"b05a3d39-3593-4d90-9b07-0dc963c27f05","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"390d16b2-4a73-4508-a13b-8c6e757351e1","cardId":"1894f40d-8914-49dc-819b-59e4b33eb4eb","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7a7867a4-e0d5-4927-a694-7bd935437245","cardId":"a515d1df-ba23-44ad-85ff-b3dbde1bf06d","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"819af9d4-8d91-4dec-898e-536a696d27e3","cardId":"7dbf288a-1c8e-41ab-a696-881deba56d17","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"5a91f9db-1df7-46a4-9a2f-2faa740aa64c","cardId":"a515d1df-ba23-44ad-85ff-b3dbde1bf06d","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"9ee5299c-53b5-40ee-8072-3847b0622503","cardId":"eb94a878-f4f8-404c-bf2d-2b0220873bb2","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"3f5a872c-f749-4f69-b68f-e69587484d90","cardId":"b2de299c-c888-48ae-9abd-a206eb122515","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"7c3aa71b-f7ea-4099-ab7e-230da4fd7aff","cardId":"c48317d6-fd8d-447b-987e-2aa670fc50a7","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"66d36198-d52c-4df1-840b-fa287216040c","cardId":"6acb1049-e35e-4cce-9b24-91e3eacc9a16","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"da1e9ce1-d89e-481f-8088-8f0635963004","cardId":"eb94a878-f4f8-404c-bf2d-2b0220873bb2","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"6bcf4cf4-d2e5-4b56-8a34-3f8a2e25687f","cardId":"eb94a878-f4f8-404c-bf2d-2b0220873bb2","engineMajor":2,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"fd888dac-913a-407b-b894-9cfd41b92978","cardId":"32ae0e23-b9cc-4bd4-b09b-73e5e92f76ae","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"0026b09c-7936-4d3e-9c46-2d348b66e773","cardId":"eb94a878-f4f8-404c-bf2d-2b0220873bb2","engineMajor":2,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"79941489-f462-463f-99c7-70ce4658c3f6","cardId":"7080cec5-2e0f-4af0-acb5-5e5ac5fbb0ef","engineMajor":1,"engineMinor":3,"weightMajor":1,"weightMinor":3,"chassisMajor":1,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"6cf9c9c7-d0ad-498c-b590-4bd9c710d92b","cardId":"9482938d-9e56-498b-94ca-88ddc0a920d8","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"56423204-50c4-4d76-a8ed-ada58f162fc7","cardId":"b2de299c-c888-48ae-9abd-a206eb122515","engineMajor":3,"engineMinor":3,"weightMajor":2,"weightMinor":3,"chassisMajor":3,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"a6ca9af4-63bd-4f88-960a-407d4b12616b","cardId":"9e042065-ec26-4203-a135-6e8ad65ab973","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0},{"cardRecordId":"17aec01b-81f4-4bc0-a332-0fa867fe2e53","cardId":"9e042065-ec26-4203-a135-6e8ad65ab973","engineMajor":3,"engineMinor":3,"weightMajor":3,"weightMinor":3,"chassisMajor":2,"chassisMinor":3,"gearingMajor":1,"gearingMinor":0}],"zoneSize":1,"zoneEligibility":[{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":190},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":190},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":190},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":175},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":175},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":175},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":175},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":175},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":190},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":190},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":190},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":200},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":215},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":200},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":200},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":250},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":260},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":260},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":270},{"eligibilityCardGroupId":"9ed04466-15e1-4b93-b8d1-ac64568d9624","eligibilityCardsRequired":0,"targetRQ":300}],"prizes":[{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1},{"prizeType":11,"prizeValue":"745fcfe6-88fc-4ecd-9cce-324f59eb1dfa","prizeMaxClaims":1},{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1},{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1},{"prizeType":11,"prizeValue":"24fee707-2ac3-4f6c-ac60-11c6f383f77c","prizeMaxClaims":1}],"startDateTime":"2022-07-01T10:00:00.000Z","endDateTime":"2022-07-05T10:00:00.000Z","priority":8000,"version":1,"category":"5af08ffe-a551-4167-bde6-976ce7520564","prizeCardEntryRequirement":null,"requirePrizeCard":false,"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false,"rungEligibility":[{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false},{"inventoryItemRequirement":null,"inventoryItemAmount":0,"inventoryItemConsumed":false}],"maxTickets":10,"ticketAttemptsBased":true,"zoneFlexibleCriteria":[{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]},{"flexibleCriteriaId":"69584ddb-f58d-4346-b949-ea229acba512","filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\")&(\\\"isprizecar\\\"=\\\"0\\\"))\"]","flexibleCriteriaZoneAnalyticsName":"1988-1991, Coupe\/Convertible, Non-Prize","flexibleCriteriaRequired":[5]}],"cardPackType":1,"bonusPointFlexibleCriteriaId":null,"rungPrizes":[[{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":500,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":750,"prizeMaxClaims":1}],[{"prizeType":11,"prizeValue":"745fcfe6-88fc-4ecd-9cce-324f59eb1dfa","prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1}],[{"prizeType":1,"prizeValue":1000,"prizeMaxClaims":1}],[{"prizeType":11,"prizeValue":"24fee707-2ac3-4f6c-ac60-11c6f383f77c","prizeMaxClaims":1}]],"hideOnCompletion":false},"flexibleCardPacks":[{"id":"24fee707-2ac3-4f6c-ac60-11c6f383f77c","name":"CTR3 CLUBSPORT FINALS CARBON FIBER","cardPackType":1,"flexibleCriteriaId":"904b2e02-8c79-44c0-8d97-30c6d8ed9e26","available":1,"multiplier":1,"softCurrency1Cost":0,"hardCurrency1Cost":1599,"keepCards":false,"imageName":"Offer90sUltraRare","description":"5 CARDS; AT LEAST 1 ULTRA RARE OR BETTER & 1 SUPER RARE OR BETTER 1988-1991 & COUPE OR CONVERTIBLE","cardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,1,0.2025,0.025]},{"cardGroupTierPercents":[1,1,1,1,0.1075,0.0325,0.005]},{"cardGroupTierPercents":[1,1,1,0.1,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.05,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.025,0,0,0]}],"currency":[{"name":"softCurrency1","value":0},{"name":"hardCurrency1","value":0},{"name":"garageSlots","value":0},{"name":"xp","value":0}],"isVisibleInStore":false,"rarityId":5,"filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\"))\",\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\"))\"]","inventoryItems":[],"cardsCount":5,"uiElements":{"backgroundColorTint":"fffffff","frontStripColor":"E62626","backgroundColorTint2":"3f3f3fff","backgroundTex":"PackDecade90s004","collection":"","packMask":"PackAlphaMask","logo":"","frontStrip":"PackTierStripe","backgroundTex2":"PackBGSlanted","text":"","car":"PackCar002"},"inventoryItemCost":null,"inventoryItemCostRequired":0,"displayCardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,1,0.2025,0.025]},{"cardGroupTierPercents":[1,1,1,1,0.1075,0.0325,0.005]},{"cardGroupTierPercents":[1,1,1,0.1,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.05,0,0,0]},{"cardGroupTierPercents":[1,1,1,0.025,0,0,0]}],"analyticsName":"CTR3 CLUBSPORT FINALS CARBON FIBER"},{"id":"745fcfe6-88fc-4ecd-9cce-324f59eb1dfa","name":"CTR3 CLUBSPORT FINALS PREMIUM","cardPackType":1,"flexibleCriteriaId":"3a516ce6-11e6-42a8-9e5e-874b3e1b5ab1","available":1,"multiplier":1,"softCurrency1Cost":0,"hardCurrency1Cost":599,"keepCards":false,"imageName":"Premium90sSpecial","description":"5 CARDS; AT LEAST 1 SUPER RARE OR BETTER 1988-1991 & COUPE OR CONVERTIBLE","cardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,0.1345,0.0245,0.0045]},{"cardGroupTierPercents":[1,1,1,0.24475,0.00475,0.0015,0.0005]},{"cardGroupTierPercents":[1,1,0.1775,0.0175,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]}],"currency":[{"name":"softCurrency1","value":0},{"name":"hardCurrency1","value":0},{"name":"garageSlots","value":0},{"name":"xp","value":0}],"isVisibleInStore":false,"rarityId":4,"filteringQueryString":"[\"((\\\"year\\\"=\\\"1988-1991\\\")&(\\\"bodystyle\\\"=\\\"Coupe\\\"|\\\"bodystyle\\\"=\\\"Convertible\\\"))\"]","inventoryItems":[],"cardsCount":5,"uiElements":{"backgroundColorTint":"fffffff","frontStripColor":"F0D22C","backgroundColorTint2":"3f3f3fff","backgroundTex":"PackDecade90s004","collection":"","packMask":"PackAlphaMask","logo":"","frontStrip":"PackTierStripe","backgroundTex2":"PackBGSlanted","text":"","car":"PackCar002"},"inventoryItemCost":null,"inventoryItemCostRequired":0,"displayCardPackSlots":[{"cardGroupTierPercents":[1,1,1,1,0.1345,0.0245,0.0045]},{"cardGroupTierPercents":[1,1,1,0.24475,0.00475,0.0015,0.0005]},{"cardGroupTierPercents":[1,1,0.1775,0.0175,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]},{"cardGroupTierPercents":[1,1,0.05,0,0,0,0]}],"analyticsName":"CTR3 CLUBSPORT FINALS PREMIUM"}]}

      
      temp.innerText = today.toISOString();
      try {
        navigator.clipboard.writeText(JSON.stringify(mockup));
      } catch (error) {
        console.log("Can't copy")
      }

    },
    copyNonce() {
      try {
        navigator.clipboard.writeText("c1837fe5-d320-45a7-8d45-67cd87f0f11c");
      } catch (error) {
        console.log("Can't copy")
      }
    },
    resolveClubs() {
      try {
        this.result.Message.season.customData = JSON.parse(this.result.Message.season.customData);
        if (this.result.Message.nextSeason) {
          this.result.Message.nextSeason.customData = JSON.parse(this.result.Message.nextSeason.customData);
        }
      } catch (error) {
        console.log(error);
      }

      this.resolveClubSeason(this.result.Message.season);
      if (this.result.Message.nextSeason) this.resolveClubSeason(this.result.Message.nextSeason);

      // console.log(this.result.Message.season);
      // console.log(this.clubTDRDays);
      // console.log(this.clubsParsedResult);
      
    },
    resolveClubSeason(season) {
      let dateObj = new Date(season.startDateTime)
      let date1 = dateObj.toISOString().substring(0,10);
      dateObj.setDate(dateObj.getDate() + 1);
      let date2 = dateObj.toISOString().substring(0,10);

      this.clubsParsedResult[date1] = {}
      this.clubsParsedResult[date2] = {}

      season.customData.criteriaSets.map((sets, iset) => {
        let objResult = iset === 0 ? this.clubsParsedResult[date1] : this.clubsParsedResult[date2];
        objResult.criterias = {};
        sets.map(uuid => {
          objResult.criterias[uuid] = this.localUUIDtoName[uuid] || "-";
          if (!this.localUUIDtoName[uuid]) {
            this.lookUuid(uuid);
          }
        })
      })
      season.customData.trackSets.map((sets, iset) => {
        let objResult = iset === 0 ? this.clubsParsedResult[date1] : this.clubsParsedResult[date2];
        objResult.tracksets = {};
        sets.map(uuid => {
          objResult.tracksets[uuid] = this.localUUIDtoName[uuid] || "-";
          if (!this.localUUIDtoName[uuid]) {
            this.lookUuid(uuid);
          }
        })
      })
    },
    loadClubs() {
      axios.get(Vue.preUrl + "/searchClubs")
      .then(res => {
        if (res.data.res) {
          this.clubTDRDays = res.data.res.find(x => x.id === 'clubsDaysObj').value;
          Object.keys(this.clubTDRDays).map(key => {
            // if (this.clubTDRDays[key].criterias.length != 3 || this.clubTDRDays[key].tracksetGroups.length != 3) {
            //   console.log(this.clubTDRDays[key]);
            //   delete this.clubTDRDays[key];
            // }
          })
          this.loadClubsPredict();
        }
      })
      .catch(error => {
      })
      .then(res => {
      })
    },
    loadClubsPredict() {
      axios.get(Vue.preUrl + "/clubsPredict")
      .then(res => {
        this.clubHutchHistory = res.data.value;
        this.afterLoadClubs();
      })
      .catch(error => {
      })
      .then(res => {
      })
    },
    afterLoadClubs() {
      this.clubHutchHistory.map(x => {
        let dateObj = new Date(x.startDateTime)
        let date1 = dateObj.toISOString().substring(0,10);
        dateObj.setDate(dateObj.getDate() + 1);
        let date2 = dateObj.toISOString().substring(0,10);

        this.clubHutchHistoryFormated[date1] = {
          criterias: x.customData.criteriaSets[0],
          tracksetGroups: x.customData.trackSets[0]
        } 
        this.clubHutchHistoryFormated[date2] = {
          criterias: x.customData.criteriaSets[1],
          tracksetGroups: x.customData.trackSets[1]
        }

      })


      // console.log(this.clubTDRDays);
      // 2023-08-03: {
      //   "date": "2023-10-01",
      //   "criterias": [
      //     "5x_german_cars",
      //     "open_match"
      //   ],
      //   "tracksetGroups": [
      //     "grand_canyon_1",
      //     "speed_of_light_4",
      //     "the_road_less_taken_3"
      //   ],
      //   "realDate": "2023-10-23T19:25:55.465Z"
      // }

      // console.log(this.clubHutchHistoryFormated);
      // 2023-08-03: {
      //   "criterias": [
      //     "be321bd4-2649-468b-8811-a169e8b280c3",
      //     "97efe604-9471-40a9-ae73-236bd9587706",
      //     "7ddf1f0e-d48c-4e03-a398-e8a6f8bf0318"
      //   ],
      //   "tracksetGroups": [
      //     "68d04e0f-0138-44f5-8da7-ebf37070ac32",
      //     "e2c1279b-7047-4112-9e15-5d088bfca702",
      //     "2c19d3c6-e32f-4507-bc09-383641eaba8c"
      //   ]
      // }

      Object.keys(this.clubTDRDays).map(date => {
        if (!this.clubHutchHistoryFormated[date]) return;

        if (this.clubTDRDays[date].criterias.length === 3) {
          this.checkMatchesClubs(this.clubTDRDays[date].criterias, "localCriteriaIds", date);
        }
        if (this.clubTDRDays[date].tracksetGroups.length === 3) {
          this.checkMatchesClubs(this.clubTDRDays[date].tracksetGroups, "localTracksetsIds", date);
        }
      })

      // console.log(this.localCriteriaIds);
      // console.log(this.localTracksetsIds);

      this.fillUUIDCollection(this.localCriteriaIds);
      this.fillUUIDCollection(this.localTracksetsIds);

      console.log("___");

      this.clearLocalUUIDPossibles(this.localCriteriaIds);
      this.clearLocalUUIDPossibles(this.localCriteriaIds);
      this.clearLocalUUIDPossibles(this.localCriteriaIds);
      this.clearLocalUUIDPossibles(this.localTracksetsIds);
      this.clearLocalUUIDPossibles(this.localTracksetsIds);
      this.clearLocalUUIDPossibles(this.localTracksetsIds);

      // console.log(this.localCriteriaIds);
      // console.log(this.localTracksetsIds);

      console.log("___ LIST OF KNOWN:");

      let knownList = [];
      Object.keys(this.localUUIDtoName).map(key => {
        knownList.push(this.localUUIDtoName[key]);
      })
      console.log(knownList);


      console.log("___");

      this.checkIfMatchesWithoutConclusion(this.localCriteriaIds);
      this.checkIfMatchesWithoutConclusion(this.localTracksetsIds);

      console.log("___ LIST OF UNKNOWN:");

      this.checkIfUnknown(this.localCriteriaIds);
      this.checkIfUnknown(this.localTracksetsIds);
    },
    checkMatchesClubs(criteriaOrTrackset, key, date) {
      let localDatabase = this[key];
      let collectionKey = "criterias";
      if (key === "localTracksetsIds") collectionKey = "tracksetGroups"
      criteriaOrTrackset.map(C_or_T => {
        //create if empty
        if (!localDatabase[C_or_T]) localDatabase[C_or_T] = {};

        if (localDatabase[C_or_T].possibles) {
          // check for matches
          let found = false;
          localDatabase[C_or_T].possibles.map(uuid => {
            this.clubHutchHistoryFormated[date][collectionKey].map(uuidHutch => {
              if (uuid === uuidHutch) {
                // deu match
                found = true;
                if (!localDatabase[C_or_T].matches) localDatabase[C_or_T].matches = [];
                localDatabase[C_or_T].matches.push(uuid);
              }
            })
          })
          // nenhum match
          if (!found) localDatabase[C_or_T].possibles = [
            ...localDatabase[C_or_T].possibles,
            ...this.clubHutchHistoryFormated[date][collectionKey]
          ]
        } else {
          // its new C_or_T
          localDatabase[C_or_T].possibles = this.clubHutchHistoryFormated[date][collectionKey]
        }

      })
    },
    fillUUIDCollection(obj) {
      Object.keys(obj).map(key => {
        if (obj[key].matches) {
          let counts = {};
          let bigger;
          let biggerCount = 0;
          obj[key].matches.map(uuid => {
            if (!counts[uuid]) counts[uuid] = 0;
            counts[uuid] += 1;
            if (!bigger) {
              bigger = uuid;
              biggerCount = counts[uuid];
            } else {
              if (counts[uuid] > biggerCount) {
                bigger = uuid;
                biggerCount = counts[uuid];
              }
            }
          })

          let hasTie = false;
          {
            let temp = [];
            Object.keys(counts).map(key => {
              temp.push(counts[key])
            })
            temp.sort();
            temp.reverse();
            if (temp.length > 1 && temp[0] === temp[1]) {
              hasTie = true;
            }

          }

          if (!hasTie) {
            this.localUUIDtoName[bigger] = key;
            // console.log(bigger, "=", key)
          }
        }
      })
    },
    clearLocalUUIDPossibles(obj) {
      Object.keys(obj).map(key => {
        obj[key].possibles = obj[key].possibles.filter(uuid => {
          if (this.localUUIDtoName[uuid] && this.localUUIDtoName[uuid] != key) return false;
          return true;
        })
        if (obj[key].matches) {
          obj[key].matches = obj[key].matches.filter(uuid => {
            if (this.localUUIDtoName[uuid] && this.localUUIDtoName[uuid] != key) return false;
            return true;
          })

        }

        if (obj[key].possibles.length === 1) {
          if (!this.localUUIDtoName[obj[key].possibles[0]]) {
            // got a new
            this.localUUIDtoName[obj[key].possibles[0]] = key;
            // console.log(obj[key].possibles[0], "=", key)
          } else {
            if (this.localUUIDtoName[obj[key].possibles[0]] !== key) {
              debugger;
            }
          }
        } else {
          if (obj[key].matches && [...new Set(obj[key].matches)].length === 1) {
            if (!this.localUUIDtoName[obj[key].matches[0]]) {
              // got a new
              this.localUUIDtoName[obj[key].matches[0]] = key;
              // console.log(obj[key].matches[0], "=", key)
            } else {
              if (this.localUUIDtoName[obj[key].matches[0]] !== key) {
                debugger;
              }
            }
          }
        }
      })
    },
    checkIfMatchesWithoutConclusion(obj) {
      Object.keys(obj).map(key => {
        if (obj[key].matches) {
          obj[key].matches = [...new Set(obj[key].matches)];
          if (obj[key].matches.length > 1) {
            console.log(key, "with", obj[key].matches.length, "possibles")
          }
        }
      })
    },
    checkIfUnknown(obj) {
      let unknownList = [];
      Object.keys(obj).map(key => {
        if (obj[key].possibles.length > 1) {
          unknownList.push(key);
          // console.log(key, `(${obj[key].possibles.length})`)
        }
      })
      console.log(unknownList);
    },
    lookUuid(uuid) {
      if (!uuid) {
        uuid = this.result;
      }
      let result = [];
      this.lookPossiblesByUuid(this.localCriteriaIds, uuid, result);
      this.lookPossiblesByUuid(this.localTracksetsIds, uuid, result);
      this.possiblesResult.push({
        names: result,
        uuid: uuid
      })
    },
    lookPossiblesByUuid(obj, uuid, result) {
      Object.keys(obj).map(key => {
        if (obj[key].possibles.includes(uuid)) result.push(key);
      })
    },
    resolvePlayerDeck() {
      let prizes = this.cars_final.filter(x => x.prize);
      this.result.playerDeck.map(x => {
        if (prizes.length > 0) {
          let nextInsert = prizes.shift();
          x.cardId = nextInsert.guid;
          x.engineMajor = 2;
          x.engineMinor = 3;
          x.weightMajor = 3;
          x.weightMinor = 3;
          x.chassisMajor = 3;
          x.chassisMinor = 3;
        }
      })
      this.user.eloScore = 5000;
      this.user.softCurrency1 = 100000;
      this.user.hardCurrency1 = 100000;

      navigator.clipboard.writeText(JSON.stringify(this.result, null, 4));
    }
  },
};
</script>

<style scoped>
.MainCodeUtility_Layout {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.inputs_layout {
  display: flex;
  flex-direction: column;
}
.input {
}
.prizes_item {
  text-align: left;
  display: flex;
  align-items: center;
  padding: 5px 0;
  justify-content: center;
}
.prizes_item0 {
  background-color: #550000;
}
.prizes_claimed {
  background-color: #005500;
}
.prizes_index {
  font-size: 30px;
  display: inline-block;
  transform: scaleX(2);
  width: 50px;
}
.prizes_layout {
  width: auto;
  column-count: 3;
  margin: 20px 0;
}
.round_boxes {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
.round_boxesItem {
  box-shadow: 0px 0px 0px 1px #ffffff44;
  width: 150px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  flex-direction: column;
}
.round_boxesPoint {
  font-size: 30px;
  margin: 10px 0;
}
.round_boxesPointBlue {
  color: #409eff;
}
.round_boxesPointRed {
  color: #f95959;
}
.round_boxesPointGrey {
  color: #999999;
}
.round_boxesYou > :first-child,
.round_boxesThey > :first-child {
  color: #777777;
}
.round_boxesYou {
}
.round_boxesThey {
}
.round_boxesPointBlue ~ .round_boxesYou,
.round_boxesPointRed ~ .round_boxesThey {
  color: #b7dba8;
}
.round_scores {
  font-size: 30px;
  /* margin: 40px 0; */
  text-align: center;
}
.round_scoresX {
  margin: 0 20px;
}
.stars {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stars > * {
  display: flex;
  justify-content: space-between;
  width: 121px;
}
.star {
  color: #ffd40055;
  font-size: 30px;
  margin-right: 13px;
}
.starYou {
  color: #ffd400;
  font-size: 70px;
  line-height: 1;
}
.resul_Stars {
  /* margin-bottom: 20px; */
}
.star_score {
}
.input_carsLayout {
  display: flex;
  flex-direction: column;
}
.input_cars {
  margin-top: 30px;
}
.uuid_layout {
  font-family: monospace;
}
.for_copy {
  box-shadow: 0px 0px 0px 2px #333;
  margin: 20px 0;
  max-height: 84px;
  overflow: hidden;
  display: none;
  width: 400px;
}
.input_EventNameLayout {
  margin-top: 20px;
}
.buttons_Layout {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 20px;
}

.MainCodeUtility_Day {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  margin-bottom: 15px;
}
.MainCodeUtility_ClubsDayBox {
  margin-bottom: 50px;
}
.MainCodeUtility_ClubListSub {
  font-size: 0.7em;
  opacity: 0.4;
}
.MainCodeUtility_ClubListBox {
  background-color: #00000038;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}
.MainCodeUtility_ClubListTitle {
  opacity: 0.4;
}
</style>
