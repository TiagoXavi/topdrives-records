<template>
  <div class="MainCRCContest_Layout">MainCRCContest_Layout</div>
</template>

<script>
try {
  var votes = require('@/database/hutch_ContestFinalVotes.json');
  var real = require('@/database/hutch_ContestRealUpDown.json');
} catch (error) {}

export default {
  name: 'MainCRCContest',
  components: {
    // BaseDetalheHeader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let finalResult = {};
    Object.keys(real).map(key => {
      if (real[key] === "Up") {
        votes[key].up.map(user => {
          finalResult[user] = (finalResult[user] || 0) + 1;
          if (user === "nabrole") console.log(key, "correct: ", "up", ", nabrole:", "up", finalResult[user])
        })
        votes[key].down.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (user === "nabrole") console.log(key, "correct: ", "up", ", nabrole:", "down", finalResult[user])
        })
      }
      if (real[key] === "Down") {
        votes[key].up.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (user === "nabrole") console.log(key, "correct: ", "down", ", nabrole:", "up", finalResult[user])
        })
        votes[key].down.map(user => {
          finalResult[user] = (finalResult[user] || 0) + 1;
          if (user === "nabrole") console.log(key, "correct: ", "down", ", nabrole:", "down", finalResult[user])
        })
      }
      if (real[key] === "Unchanged") {
        votes[key].up.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (user === "nabrole") console.log(key, "correct: ", "unchanged", ", nabrole:", "up", finalResult[user])
        })
        votes[key].down.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (user === "nabrole") console.log(key, "correct: ", "unchanged", ", nabrole:", "down", finalResult[user])
        })
      }
    })
    let ordered = [];
    Object.keys(finalResult).map(key => {
      ordered.push({ user: key, c: finalResult[key] })
    })
    ordered.sort((a,b) => {
      return b.c - a.c;
    })
    finalResult = {}
    ordered.map(x => {
      finalResult[x.user] = x.c;
    })
    console.log(finalResult);
    debugger;
  },
  computed: {},
  methods: {},
}
</script>

<style>
</style>