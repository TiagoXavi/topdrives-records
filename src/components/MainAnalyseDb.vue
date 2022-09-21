<template>
  <div class="MainAnalyseDb_Layout">
    <button class="D_Button D_ButtonDark" @click="downVotesAsLinks()">start</button>
  </div>
</template>

<script>
// import db from '../database/db.json'

export default {
  name: 'MainAnalyseDb',
  components: {},
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      db: null
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    downVotesAsLinks() {
      let prefix = `https://www.topdrivesrecords.com/?share=`;
      let result = [];

      this.db.map(car => {
        Object.keys( car.data ).forEach(function (tune) {
          if (car.data[tune].times) {
            Object.keys( car.data[tune].times ).forEach(function (track) {
              if (track.substr(track.length -4, 2) === "_a") {
                // is a time
                if (car.data[tune].times[`${track}_downList`] && car.data[tune].times[`${track}_downList`].length > 0) {
                  result.push(`${prefix}~K${track}~C${car.rid}~T${tune}`)
                }
              }
            })
          }
        })
      })

      console.log(result);

    },
    mostFavCar() {
      let result = {};

      this.db.map(car => {
        Object.keys( car.data ).forEach(function (tune) {
          if (car.data[tune].times) {
            Object.keys( car.data[tune].times ).forEach(function (track) {
              if (track.substr(track.length -4, 2) === "_a") {
                // is a time
                result[car.rid] = 1 + result[car.rid]||0
              }
            })
          }
        })
      })
      let sortable = [];
      for (var vehicle in result) {
          sortable.push([vehicle, result[vehicle]]);
      }
      sortable.sort(function(a, b) {
          return b[1] - a[1];
      });
      
      debugger;
    },
    carWithMostUsers() {
      let result = {};

      this.db.map(car => {
        car.users.length
        result[car.rid] = car.users.length
      })
      let sortable = [];
      for (var vehicle in result) {
          sortable.push([vehicle, result[vehicle]]);
      }
      sortable.sort(function(a, b) {
          return b[1] - a[1];
      });

      debugger;
    }
  },
}
</script>

<style>
</style>