import { defineStore } from 'pinia'

// this.T_S.counter = 1; >>> to update 1 property
// this.T_S.$patch({...}); >>> to update 2+ property at same time
export const tdrStore = defineStore('main', {

  state: () => ({
    counter: 0,
    name: 'Tiago',
    mainParams: null,
    _g_carPicker: {
      dialog: false,
      dialogLoad: false,
      keepMemory: false,
      filterOnly: false,
      requirementFilter: false,
      filter: {},
      filter2: {},
      filter3: {},
      useWhatFilter: 0,
      filterString: null,
      sortEnabled: false,
      enableCounters: false,
      type: null,
      index: null,
      addCar: () => {},
      clearFilterUpdate: () => {},
      useFilter: () => {},
      dual: () => {},
      config: {},
    },
    _g_track: {
      dialog: false,
      mode: "",
      onlyCampaign: false,
      customCodes: [],
      close: () => {},
      toggleTrack: () => {},
      pushCpSuggest: () => {},
      campaignTrackCodes: () => {}
    },
    _g_car: {
      dialog: false,
      car: {},
      tuneDialogCarIndex: 0,
      carDetailsList: [],
      showMove: false,
      showTunes: false,
      close: () => {},
      changed: () => {},
      newIndex: () => {}
    },

    _match: null, //MainMatchSimulator
    _Mcars: null, //MainCars
    _Mtracks: null, //MainTracks
    _user: null,
  }),

  getters: {
    doubleCounter: (state) => state.counter * 2,
    doubleCounterPlusOne() {
      return this.doubleCounter + 1
    },
  },

  actions: {
    reset() {
      this.counter = 0
    },
    miniCarClick(car, carObj) {
      car = JSON.parse(JSON.stringify(car));
      if (car.selectedTune === undefined && carObj && (carObj.tun || carObj.tunZ)) {
        car.selectedTune = carObj.tun || carObj.tunZ;
      }
      this._g_car.car = car;
      this._g_car.dialog = true;
      this._g_car.close = () => {
        this._g_car.dialog = false;
      };

      
    }
  },

})