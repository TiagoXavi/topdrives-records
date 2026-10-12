<template>
  <div class="MainLook_Layout">
    <div class="MainLook_Events MainLook_W800">
      <button
        v-for="event in events"
        :key="event.id"
        :class="{ MainLook_EventActive: event.id === selectedId }"
        class="D_Button D_ButtonDark D_ButtonDark2 MainLook_Event"
        @click="selectEvent(event.id)">
        <BaseCardMini
          v-for="(card, icard) in event.cars"
          :key="icard"
          :car="Vue.all_carsObj[card.rid]"
          :tuneText="tuneText(card)" />
      </button>
      <button
        :class="{ MainLook_EventActive: selectedId === null }"
        class="D_Button D_ButtonDark D_ButtonDark2 MainLook_NewEvent"
        @click="newEvent()">
        <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
        <span>{{ $t("m_new") }}</span>
      </button>
    </div>

    <div class="MainLook_Header MainLook_W800">
      <div class="MainLook_HeaderTop">
        <input
          :placeholder="selectedEvent ? '/matchmake' : '/resolveeventmatch'"
          class="D_SearchInput data-hj-allow"
          type="text"
          autocomplete="off"
          @paste="intercept($event)">
        <div class="MainLook_HeaderPasteButtonBox">
          <button
            :class="{ D_Button_Loading: loading }"
            :disabled="loading"
            class="D_Button MainLook_HeaderPasteButton"
            @click="pasteFromClipboard()">
            <i class="ticon-paste" aria-hidden="true"/>
          </button>
        </div>
      </div>
      <div class="MainLook_HeaderBottom">
        <div v-if="!user || !user.tier || user.tier > 2" class="MainLook_Hint">{{ $t("p_patronsOnly", { tier: 2 }) }}</div>
      </div>
    </div>

    <div v-if="match" class="MainLook_Match">
      <div
        v-for="(oppo, iOppo) in match.opponents"
        :key="iOppo"
        :class="{
          MainLook_OppoWin: oppo.p > 0,
          MainLook_OppoLose: oppo.p < 0
        }"
        class="MainLook_Oppo">
        <div class="MainLook_Races Main_DarkScroll">
          <div
            v-for="(card, iRace) in oppo.cards"
            :key="iRace"
            :class="{
              MainLook_RaceWin: oppo.myPoints[iRace] > 0,
              MainLook_RaceLose: oppo.myPoints[iRace] < 0
            }"
            class="MainLook_Race">
            <div class="MainLook_Them">
              <BaseCardMini
                :car="Vue.all_carsObj[card.rid]"
                :tuneText="tuneText(card)" />
              <div class="MainLook_ThemRight">
                <div class="MainLook_Points">{{ oppo.myPoints[iRace] === null ? "?" : oppo.myPoints[iRace] }}</div>
                <div class="MainLook_ThemTime">{{ (oppo.myTimes[iRace] - oppo.times[iRace]).toFixed(3) }}</div>
              </div>
            </div>
            <BaseTrack :tracks="[match.trackset[iRace]]" class="MainLook_Track" />
            <div class="MainLook_MineCard BaseCard_AsGalleryBox">
              <BaseCard
                v-if="Vue.all_carsObj[oppo.mine[iRace].rid]"
                :car="Vue.all_carsObj[oppo.mine[iRace].rid]"
                :fix-back="false"
                :options="false"
                :hideClose="true"
                :showResetTune="false"
                :asGallery="true"
                :draggable="false"
                :showCompactOverlay="false"
                :selectedTune="cardTune(oppo.mine[iRace])"
                :tuneText="cardTune(oppo.mine[iRace]) ? null : oppo.mine[iRace].tunZ"
                :count="count"
              />
              <div v-else class="MainLook_MineCardUnknown">?</div>
            </div>
          </div>
        </div>
        <div class="MainLook_OppoHeader">
          <div class="MainLook_OppoHeaderTop">
            <div class="MainLook_OppoNumber">{{ iOppo+1 }}/{{ match.opponents.length }}</div>
            <div class="MainLook_OppoName">{{ oppo.name }}<span v-if="oppo.elo !== undefined"> ({{ oppo.elo }})</span></div>
          </div>
          <div class="MainLook_OppoHeaderBottom">
            <div class="MainLook_OppoTotal">{{ oppo.p }}</div>
            <div v-if="oppo.myPoints.includes(null)" class="MainLook_OppoUnknown">?</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="selectedEvent" class="D_Center2">
      <button
        :class="{ D_ButtonRed: deleteId === selectedId }"
        class="D_Button D_ButtonDark D_ButtonDark2 MainLook_DeleteButton"
        @click="deleteEventClick(selectedId)">
        <i class="ticon-trash D_ButtonIcon" aria-hidden="true"/>
        <span>{{ $t("m_deleteEvent") }}</span>
      </button>
    </div>


  </div>
</template>

<script>
import BaseCardMini from './BaseCardMini.vue'
import BaseCard from './BaseCard.vue'
import BaseTrack from './BaseTrack.vue'

export default {
  name: 'MainLook',
  components: {
    BaseCardMini,
    BaseCard,
    BaseTrack
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue: Vue,
      events: [], // [ { id, eventId, cars: [ { rid, tunZ } x5 ] } ]
      selectedId: null, // null = new event
      matches: {}, // last matchmake resolved of each event, by id. Not saved
      count: 0,
      loading: false,
      deleteId: null,
      user: null,
      unsubscribe: null
    }
  },
  watch: {},
  beforeMount() {
    let lookEvents = window.localStorage.getItem("lookEvents");
    if (lookEvents) {
      try {
        lookEvents = JSON.parse(lookEvents);
      } catch (error) {
        lookEvents = null;
      }
      if (Array.isArray(lookEvents)) {
        this.events = lookEvents.filter(event => {
          return event &&
            typeof event.id === "string" &&
            Array.isArray(event.cars) &&
            event.cars.length === 5 &&
            event.cars.every(card => card && /^[0-9]{3}$/.test(card.tunZ));
        });
      }
    }
    let lookSelected = window.localStorage.getItem("lookSelected");
    if (lookSelected && this.events.find(x => x.id === lookSelected)) {
      this.selectedId = lookSelected;
    }
  },
  mounted() {
    let vm = this;
    this.user = this.$store.state.user;

    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })

    window.addEventListener('paste', this.windowPaste);
    window.documentTitle("Look");
  },
  computed: {
    selectedEvent() {
      return this.events.find(x => x.id === this.selectedId) || null;
    },
    match() {
      if (!this.selectedEvent) return null;
      return this.matches[this.selectedId] || null;
    }
  },
  methods: {
    intercept(e) {
      let text = e.clipboardData.getData('text');
      e.preventDefault();
      this.resolvePaste(text);
    },
    windowPaste(e) {
      // paste with the focus out of the input. A field handles its own paste
      if (e.target && e.target.closest && e.target.closest('input, textarea, [contenteditable="true"]')) return;
      this.intercept(e);
    },
    pasteFromClipboard() {
      if (!navigator.clipboard || !navigator.clipboard.readText) return;
      navigator.clipboard.readText()
        .then(text => {
          this.resolvePaste(text);
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
    },
    resolvePaste(text) {
      if (this.loading) return;
      let json;
      try {
        json = JSON.parse(text);
        // a whole .har instead of only the response body
        if (json && json.log && Array.isArray(json.log.entries) && json.log.entries.length) {
          json = JSON.parse(json.log.entries[json.log.entries.length - 1].response.content.text);
        }
      } catch (error) {
        json = null;
      }
      if (!json || typeof json !== "object") {
        this.snackError("Unknown format");
        return;
      }

      if (Array.isArray(json.playerCards)) {
        this.resolveTeam(json);
      } else if (Array.isArray(json.opponents)) {
        this.resolveMatch(json);
      } else {
        this.snackError("Unknown format");
      }
    },
    resolveEventId(json) {
      if (json.eventPlayerData && typeof json.eventPlayerData.eventId === "string") {
        return json.eventPlayerData.eventId;
      }
      // "EVENTf4a5001f-99b4-48c1-83bf-322cbe98d9cd"
      if (json.prizeBoard && typeof json.prizeBoard.matchId === "string" && json.prizeBoard.matchId.startsWith("EVENT")) {
        return json.prizeBoard.matchId.slice(5);
      }
      return null;
    },
    resolveCards(hCars) {
      // 5 hutch cards to [ { rid, tunZ } ]. A car that TDR doesn't know yet stays with rid null
      if (!Array.isArray(hCars) || hCars.length !== 5) return null;
      let cards = hCars.map(hCar => {
        if (!hCar) return null;
        let tunZ = Vue.resolveTuneZ(hCar);
        if (!/^[0-9]{3}$/.test(tunZ)) return null;
        return {
          rid: Vue.ridByGuid[hCar.cardId] || null,
          tunZ: tunZ
        }
      })
      if (cards.includes(null)) return null;
      return cards;
    },
    resolveTeam(json) {
      // resolveEventMatch: the user's cars
      let cars = this.resolveCards(json.playerCards);
      if (!cars) {
        this.snackError("Unknown format");
        return;
      }
      // the order comes from the last race, sort to keep the team always looking the same
      cars.sort((a, b) => {
        let rqA = (Vue.all_carsObj[a.rid] || {}).rq || 0;
        let rqB = (Vue.all_carsObj[b.rid] || {}).rq || 0;
        if (rqA !== rqB) return rqB - rqA;
        return `${a.rid}${a.tunZ}`.localeCompare(`${b.rid}${b.tunZ}`);
      });

      // the json knows its event. Without it, goes to the selected one if it's also an event without id
      let eventId = this.resolveEventId(json);
      let event = null;
      if (eventId) {
        event = this.events.find(x => x.eventId === eventId) || null;
      } else if (this.selectedEvent && !this.selectedEvent.eventId) {
        event = this.selectedEvent;
      }

      if (event) {
        event.cars = cars;
      } else {
        event = {
          id: eventId || `local_${Date.now()}`,
          eventId: eventId,
          cars: cars
        }
        this.events.push(event);
      }

      // the opponents on screen were for the last team
      this.$delete(this.matches, event.id);
      this.selectedId = event.id;
      this.saveEvents();

      this.$store.commit("DEFINE_SNACK", {
        active: true,
        correct: true,
        text: this.$t("m_saveSuccess")
      });
    },
    resolveMatch(json) {
      // matchmake: the opponents
      let opponents = [];
      let isValid = typeof json.challengeSetId === "string" && json.opponents.length > 0;
      json.opponents.map(hOppo => {
        let cards = this.resolveCards((hOppo || {}).cards);
        if (!cards) {
          isValid = false;
          return;
        }
        opponents.push({
          name: hOppo.socialName || "-",
          elo: hOppo.eloScore,
          cards: cards
        });
      })
      if (!isValid) {
        this.snackError("Unknown format");
        return;
      }

      // the json knows its event. Without it (or with the selected saved without it), is the selected one
      let eventId = this.resolveEventId(json);
      let event = null;
      if (eventId) {
        event = this.events.find(x => x.eventId === eventId) || null;
      }
      if (!event && this.selectedEvent && (!eventId || !this.selectedEvent.eventId)) {
        event = this.selectedEvent;
      }
      if (!event) {
        this.snackError("/resolveeventmatch first");
        return;
      }

      if (eventId && !event.eventId) {
        event.eventId = eventId;
      }
      this.selectedId = event.id;
      this.saveEvents();

      this.loadMatch(event, json.challengeSetId, opponents);
    },
    loadMatch(event, challengeSetId, opponents) {
      let cars = JSON.parse(JSON.stringify(event.cars));
      this.loading = true;

      axios.post(Vue.preUrl + "/lookMatch", {
        challengeSetId: challengeSetId,
        cars: cars,
        opponents: opponents.map(oppo => {
          return { cards: oppo.cards }
        })
      })
      .then(res => {
        // BaseCard takes the stats of a tuned car from this cache
        (res.data.stats || []).map((stats, iCar) => {
          let tune = this.cardTune(cars[iCar]);
          if (!stats || !tune || tune === "000") return;
          Vue.statsCache[Vue.getTCod(cars[iCar].rid, tune)] = stats;
        })
        this.count++;

        this.$set(this.matches, event.id, {
          trackset: res.data.trackset,
          opponents: opponents.map((oppo, iOppo) => {
            return {
              ...oppo,
              ...res.data.opponents[iOppo],
              // comb[race] = index of the user's car
              mine: res.data.opponents[iOppo].comb.map(iCar => cars[iCar])
            }
          })
        });
      })
      .catch(error => {
        console.log(error);
        this.snackError(error);
      })
      .then(() => {
        this.loading = false;
      });
    },
    selectEvent(id) {
      this.selectedId = id;
      this.saveEvents();
    },
    newEvent() {
      this.selectedId = null;
      this.saveEvents();
    },
    deleteEventClick(id) {
      if (this.deleteId === id) {
        this.deleteId = null;
        // delete
        this.events = this.events.filter(x => x.id !== id);
        this.$delete(this.matches, id);
        this.selectedId = null;
        this.saveEvents();
      } else {
        this.deleteId = id;
        setTimeout(() => {
          this.deleteId = null;
        }, 1000);
      }
    },
    saveEvents() {
      window.localStorage.setItem("lookEvents", JSON.stringify(this.events));
      window.localStorage.setItem("lookSelected", this.selectedId || "");
    },
    tuneText(card) {
      return Vue.resolveTune(card.tunZ) || card.tunZ;
    },
    cardTune(card) {
      // selectedTune for BaseCard: 323 style when possible, else the 969 style.
      // A 969 style made only of 0-3 (like 133) would be read as 323 style, so that one goes as tuneText
      let tun = Vue.resolveTune(card.tunZ);
      if (tun) return tun;
      if (/^[0-3]+$/.test(card.tunZ)) return null;
      return card.tunZ;
    },
    timeText(time, track) {
      if (time === null || time === undefined) return "?";
      return Vue.toTimeStringTrCode(time, track);
    },
    snackError(text) {
      this.$store.commit("DEFINE_SNACK", {
        active: true,
        error: true,
        text: text,
        type: "error"
      });
    }
  },
  beforeDestroy() {
    this.unsubscribe();
    window.removeEventListener('paste', this.windowPaste);
    window.documentTitle();
  },
}
</script>

<style>
.MainLook_Layout {
  margin: 40px auto 0px auto;
  padding: 0 15px 170px 15px;
  max-width: var(--wBody);
  box-sizing: border-box;
}
.MainLook_W800 {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.MainLook_Events {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.D_Button.MainLook_Event {
  padding: 2px;
  gap: 2px;
  flex-wrap: wrap;
}
.D_Button.MainLook_NewEvent {
  min-height: 46px;
  padding: 0 15px;
}
.MainLook_EventActive {
  box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow));
}
.MainLook_Header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 40px;
}
.MainLook_HeaderTop {
  display: flex;
  gap: 6px;
  position: relative;
}
.MainLook_HeaderPasteButtonBox {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  width: 44px;
}
.MainLook_HeaderPasteButton {
  font-size: 22px;
  width: 100%;
}
.MainLook_HeaderBottom {
  display: flex;
  gap: 6px;
  justify-content: space-between;
  align-items: flex-start;
}
.MainLook_Hint {
  font-size: 13px;
  background-color: #a9904129;
  box-shadow: inset 0px 0px 0px 2px #ffe39417;
  padding: 8px 10px;
  border-radius: 10px;
  color: #cdc2a3;
  flex-grow: 1;
}
.MainLook_DeleteButton {
  flex-shrink: 0;
  padding: 0 10px;
}

.MainLook_Match {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.MainLook_Oppo {
  display: flex;
  gap: 10px;
  max-width: 100%;
}
.MainLook_Races {
  display: grid;
  grid-template-columns: repeat(5, 150px);
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior: contain;
}
.MainLook_Races::-webkit-scrollbar {
  height: 8px;
}
.MainLook_Race {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 150px;
}
.MainLook_Track {
  min-height: var(--cell-height);
}
.MainLook_Race .Row_Tracks .Row_Content {
  font-size: 0.8em;
}
.MainLook_Them {
  display: flex;
}
.MainLook_ThemRight {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 3px;
  line-height: 1;
}
.MainLook_Points {
  font-size: 20px;
}
.MainLook_ThemTime {
  font-size: 11px;
  opacity: 0.8;
}
.MainLook_RaceWin .MainLook_ThemRight {
  color: rgb(var(--d-text-green));
  background-image: radial-gradient(rgba(var(--d-text-green), 0.3), transparent 70%);
}
.MainLook_RaceLose .MainLook_ThemRight {
  color: rgb(var(--d-text-red2));
  background-image: radial-gradient(rgba(var(--d-text-red), 0.3), transparent 70%);
}
.MainLook_MineCard {
  width: var(--card-g-width);
  height: var(--card-g-height);
}
.MainLook_MineCardUnknown {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.2);
  border-radius: 7px;
  font-size: 30px;
  opacity: 0.5;
}
.MainLook_MineTime {
  font-size: 12px;
  text-align: center;
  opacity: 0.8;
  padding: 4px 0;
}
.MainLook_OppoHeader {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  width: 120px;
  text-align: right;
}
.MainLook_OppoNumber {
  font-size: 32px;
  color: var(--d-text-b);
}
.MainLook_OppoName {
  font-size: 14px;
  opacity: 0.5;
  word-break: break-word;
}
.MainLook_OppoTotal {
  font-size: 36px;
  line-height: 1;
}
.MainLook_OppoWin .MainLook_OppoTotal {
  color: rgb(var(--d-text-green));
}
.MainLook_OppoLose .MainLook_OppoTotal {
  color: rgb(var(--d-text-red2));
}
.MainLook_OppoUnknown {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 5px;
}

@media only screen and (max-width: 1200px) {
  .MainLook_Oppo {
    flex-direction: column-reverse;
  }
  .MainLook_OppoHeader {
    flex-direction: row;
    align-items: flex-end;
    width: auto;
  }
  .MainLook_OppoHeaderBottom {
    text-align: right;
  }
}
@media only screen and (max-width: 767px) {
  .MainLook_Layout {
    margin-top: 20px;
    padding: 0 10px 100px 10px;
  }
  .MainLook_HeaderBottom {
    flex-direction: column;
    align-items: stretch;
  }
  .MainLook_DeleteButton {
    align-self: flex-end;
  }
}
</style>
