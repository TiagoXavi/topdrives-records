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
      // if (this * 10000 - Math.round(this) * 10000 >= -5) {
      //   milesi = 0;
      //   seconds += 1;
      // }
      // 29.99971 > 00:30:00

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
        this.resolveEvents();
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
    resolveEvents() {

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
      // this.result.eventPlayerData.map(x => {
      //   x.bucketDataVersion = 61;
      // })

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
        currentRung: 15, // round 
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

      let mockup = {}

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
      mockup = {}

      
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
