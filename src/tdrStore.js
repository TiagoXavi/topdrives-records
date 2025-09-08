import { defineStore } from 'pinia'

// this.T_S.counter = 1; >>> to update 1 property
// this.T_S.$patch({...}); >>> to update 2+ property at same time
export const tdrStore = defineStore('main', {

  state: () => ({
    counter: 0,
    name: 'Tiago',
    windowWidth: window.innerWidth,
    _match: null, //MainMatchSimulator
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
    }
  },

})