import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);



function changeZoom(state, level) {
  let isVertical = window.innerHeight > window.innerWidth;
  let storeString = isVertical ? "zoomLevel" : "zoomLevelHorizontal";

  state[storeString] = level;

  let string;
  if (level === "60%") {
    string = "width=device-width,height=device-height, initial-scale=0.45, maximum-scale=0.45, minimum-scale=0.45"
  }
  if (level === "80%") {
    string = "width=device-width,height=device-height, initial-scale=0.55, maximum-scale=0.55, minimum-scale=0.55"
  }
  if (level === "100%") {
    string = "width=device-width,height=device-height, initial-scale=0.65, maximum-scale=0.65, minimum-scale=0.65"
  }
  if (level === "120%") {
    string = "width=device-width,height=device-height, initial-scale=0.75, maximum-scale=0.75, minimum-scale=0.75"
  }
  if (level === "140%") {
    string = "width=device-width,height=device-height, initial-scale=0.85, maximum-scale=0.85, minimum-scale=0.85"
  }

  const viewport = document.querySelector('meta[name="viewport"]');
  if ( viewport ) {
    viewport.content = string;
  }
  window.localStorage.setItem(storeString, level);
}

export default new Vuex.Store({
  state: {
    mainDialog: {
      id: null,
      active: false,
      persistent: false,
      fullPersistent: false,
      loading: false,
      red: false,
      title: "Titulo",
      description: "random text",
      actionLabel: "Label",
      secondaryLabel: "Cancelar",
      action: () => {},
      secondary: () => {}
    },
    tooltip: {
      active: false,
      absolute: false,
      activator: null,
      body: null,
      mensagem: null,
      left: false,
      right: false,
      bottom: false,
      top: false,
      positionX: null,
      positionY: null
    },
    confirmDialog: {
      active: false,
      title: "Are you sure?",
      actionLabel: "Confirm",
      cancelLabel: "Cancel",
      actionColor: "danger",
      maxWidth: "250px",
      minWidth: "240px",
      error: false,
      disabled: false,
      action: null,
      advanced: null,
      loading: false
    },
    snack: {
      text: "",
      active: false
    },
    filter: {},
    user: null,
    userLoading: false,
    loading: false,
    tabs: [],
    tabDynamicValue: 0,
    fullscreen: false,
    ano: null,
    tuneDialog: false,
    oldTags: [
      "5th Anniversary",
      "Around the World",
      "As Seen on YT",
      "Call of the Wild",
      "Chariots of the Gods",
      "Christmas Collection",
      "Christmas Collection 22",
      "Coast to Coast",
      "Cutting Edge",
      "Desperados",
      "Famous Tracks",
      "Filberto's Collection",
      "Gaz's Collection",
      "Gunter's Collection",
      "Harriet's Collection",
      "Heavy Metal",
      "Hugo's Collection",
      "Electric Excellence",
      "In the Shadows",
      "In the Shadows 24",
      "Interstellar",
      "Legrand's Collection",
      "Lina's Collection",
      "Lina's Collection 2",
      "Immortalised in Carbon",
      "Loves Me, Loves Me Not",
      "Marilyn's Collection",
      "New Beginnings",
      "Nightmare Fuel",
      "Niklas' Collection",
      "Old Guard",
      "Photo Finish",
      "Racing Royalty",
      "Rest of the World",
      "Ride of the Valkyries",
      "Riders on the Storm",
      "Roads Most Travelled",
      "Sara's Collection",
      "Silver Screen",
      "Sub-Zero",
      "Summer Games",
      "Summer Games 24",
      "Supercar",
      "The Great Outdoors",
      "The Horror Show",
      "The Unicorns",
      "Touma's Collection",
      "Trading Paint",
      "Two Tone",
      "Ximena's Collection",
      "Year of the Dragon",
      "Year of the Ox",
      "Year of the Rat",
      "Year of the Tiger",
      "Year of the Rabbit",
      "Year of the Snake"
    ],
    upcomingTags: [
      "Marilyn's Collection 2"
    ],
    showDataFromPast: false,
    showCustomTunes: false,
    showOldTags: false,
    showUpcomingTags: false,
    homePointsToggle: false,
    showPointsCgForce: true,
    showPrizeBoard: false,
    showPermanentCgs: true,
    showLongCgs: true,
    zoomLevel: "100%",
    zoomLevelHorizontal: "80%",
    zoomLevels: ["60%", "80%", "100%", "120%", "140%"]
  },
  mutations: {
    SET_GENERIC: (state, obj) => state[obj.key] = obj.value,
    SET_GENERIC2: (state, obj) => state[obj.key][obj.key2] = obj.value,
    SET_GENERIC3: (state, obj) => state[obj.key][obj.key2][obj.key3] = obj.value,
    STATUS_DIALOG: (state, status) => state.mainDialog.active = status,

    CHANGE_DATA_FROM_PAST: (state, status) => state.showDataFromPast = status,
    CHANGE_CUSTOM_TUNES: (state, status) => state.showCustomTunes = status,
    CHANGE_OLD_TAGS: (state, status) => state.showOldTags = status,
    CHANGE_UPCOMING_TAGS: (state, status) => state.showUpcomingTags = status,
    CHANGE_HOME_POINTS_TOGGLE: (state, status) => state.homePointsToggle = status,
    CHANGE_POINTS_CG_FORCE: (state, status) => state.showPointsCgForce = status,
    CHANGE_PRIZE_BOARD: (state, status) => state.showPrizeBoard = status,
    CHANGE_PERMANENT_CGS: (state, status) => state.showPermanentCgs = status,
    CHANGE_LONG_CGS: (state, status) => state.showLongCgs = status,
    CHANGE_ZOOM_LEVEL: (state, level = "100%") => {
      changeZoom(state, level);
    },
    CHANGE_ZOOM_LEVEL_HORIZONTAL: (state, level = "100%") => {
      changeZoom(state, level);
    },


    CHANGE_USER: (state, item) => {
      state.user = item.user
    },
    LOGOUT: (state, item) => {
      state.user = null
    },
    CHANGE_TIME: (state, obj) => null,
    DELETE_TIME: (state, obj) => null,
    DELETE_TRACK: (state, obj) => null,
    HIDE_DETAIL: (state, obj) => null,
    TIME_VOTE: (state, obj) => null,
    CHANGE_TUNE: (state, obj) => null,
    SHOW_TUNE: (state, obj) => null,
    CHANGE_STAT: (state, obj) => null,
    HOVER_INDEX: (state, obj) => null,
    AUTH: (state, obj) => null,
    START_LOGROCKET: (state, obj) => null,
    REFRESH_LIBRARY: (state, obj) => null,
    LIBRARY_NEW_DIALOG: (state, obj) => null,
    FILTER_EMIT_RIDS: (state, obj) => null,
    EVENT_EXPORT_FILTER: (state, obj) => null,
    MAIN_FILTER_REF: (state, obj) => null,
    MEMORY_REF_RETURN: (state, obj) => null,
    CLASSIC_FILTER_IMPORT: (state, obj) => null,
    FILTER_ATTR_RIDS: (state, obj) => null,
    FILTER_FINDCAR_RIDS: (state, obj) => null,
    FILTER_NEWPHOTOS_RIDS: (state, obj) => null,
    FILTER_PACKS_LIMITS: (state, obj) => null,
    PACKS_FILTER_IMPORT: (state, obj) => null,
    PACKS_INTERNALFILTER_IMPORT: (state, obj) => null,
    MYGARAGE_INTERNALFILTER_IMPORT: (state, obj) => null,
    OPEN_LOGIN: (state, obj) => null,
    OPEN_BRAKES: (state, obj) => null,
    CLEAR_PRIZEBOARD: (state, obj) => null,
    BEFOREUNLOAD_TOUCH: (state, obj) => null,
    CLEAR_EDITABLE: () => {
      document.querySelectorAll(".Row_Content").forEach(x => {
        x.setAttribute('contenteditable', false)
      })
    },
    DEFINE_SNACK: (state, snack) => {
      if (snack.error && snack.error.response && snack.error.response.status === 401) {
        return;
      }
      if (snack.error && snack.error.__CANCEL__) {
        return;
      }
      state.snack = snack
    },
    DEFINE_TOOLTIP: (state, config) => {
      let position = {
        left: config.left || false,
        right: config.right || false,
        top: config.top || false,
        bottom: config.bottom || false
      };

      if (config.active) {
        state.tooltip = {
          ...state.tooltip,
          ...position,
          ...config
        };
        return;
      }

      state.tooltip = {
        ...state.tooltip,
        ...config,
        activator: null,
        absolute: false
      };
    },
    DEFINE_DIALOG: (state, config) => {
      state.confirmDialog = {
        ...state.confirmDialog,
        ...config,
        advanced: config.advanced || null
      };
    },
  },
  actions: {

  },
  getters: {

  }
})