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
    user: {
      iniciais: "a"
    },
    userLoading: false,
    loading: false,
    tabs: [],
    tabDynamicValue: 0,
    fullscreen: false,
    ano: null,
    toChangeObj: {}
  },
  mutations: {
    SET_GENERIC: (state, obj) => state[obj.key] = obj.value,
    SET_GENERIC2: (state, obj) => state[obj.key][obj.key2] = obj.value,
    SET_GENERIC3: (state, obj) => state[obj.key][obj.key2][obj.key3] = obj.value,
    DEFINE_DIALOG: (state, dialog) => state.mainDialog = dialog,
    STATUS_DIALOG: (state, status) => state.mainDialog.active = status,
    CHANGE_TIME: (state, obj) => state.toChangeObj = obj,
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