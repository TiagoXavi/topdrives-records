import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

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
    snack: {
      text: "",
      active: false
    },
    filter: {},
    user: null,
    asMod: false,
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
      "Christmas Collection",
      "Christmas Collection 22",
      "Famous Tracks",
      "Electric Excellence",
      "In the Shadows",
      "Interstellar",
      "Immortalised in Carbon",
      "Loves Me, Loves Me Not",
      "Old Guard",
      "Racing Royalty",
      "Rest of the World",
      "Ride of the Valkyries",
      "Riders on the Storm",
      "Silver Screen",
      "Sub-Zero",
      "Summer Games",
      "Supercar",
      "The Great Outdoors",
      "The Horror Show",
      "Two Tone",
      "Year of the Ox",
      "Year of the Rat",
      "Year of the Tiger",
      "Year of the Rabbit",
    ],
    showOldTags: false
  },
  mutations: {
    SET_GENERIC: (state, obj) => state[obj.key] = obj.value,
    SET_GENERIC2: (state, obj) => state[obj.key][obj.key2] = obj.value,
    SET_GENERIC3: (state, obj) => state[obj.key][obj.key2][obj.key3] = obj.value,
    DEFINE_DIALOG: (state, dialog) => state.mainDialog = dialog,
    STATUS_DIALOG: (state, status) => state.mainDialog.active = status,
    CHANGE_OLD_TAGS: (state, status) => state.showOldTags = status,
    CHANGE_USER: (state, item) => {
      state.user = item.user,
      state.asMod = item.asMod
    },
    LOGOUT: (state, item) => {
      state.user = null,
      state.asMod = false
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
    KING_EMIT_RIDS: (state, obj) => null,
    CG_EMIT_RIDS: (state, obj) => null,
    FILTER_EMIT_RIDS: (state, obj) => null,
    EVENTKING_EMIT_RIDS: (state, obj) => null,
    CLASSIC_FILTER_IMPORT: (state, obj) => null,
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
    }
  },
  actions: {

  },
  getters: {

  }
})