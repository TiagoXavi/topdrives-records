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
    let proof = {};
    Object.keys(real).map(key => {
      if (real[key] === "Up") {
        votes[key].up.map(user => {
          finalResult[user] = (finalResult[user] || 0) + 1;
          if (!proof[user]) proof[user] = [];
          proof[user].push(`${key}   correct:Up   ${user}:Up   ${finalResult[user]}`);
        })
        votes[key].down.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (!proof[user]) proof[user] = [];
          proof[user].push(`${key}   correct:Up   ${user}:Down   ${finalResult[user]}`);
        })
      }
      if (real[key] === "Down") {
        votes[key].up.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (!proof[user]) proof[user] = [];
          proof[user].push(`${key}   correct:Down   ${user}:Up   ${finalResult[user]}`);
        })
        votes[key].down.map(user => {
          finalResult[user] = (finalResult[user] || 0) + 1;
          if (!proof[user]) proof[user] = [];
          proof[user].push(`${key}   correct:Down   ${user}:Down   ${finalResult[user]}`);
        })
      }
      if (real[key] === "Unchanged") {
        votes[key].up.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (!proof[user]) proof[user] = [];
          proof[user].push(`${key}   correct:Unchanged   ${user}:Up   ${finalResult[user]}`);
        })
        votes[key].down.map(user => {
          finalResult[user] = (finalResult[user] || 0) - 1;
          if (!proof[user]) proof[user] = [];
          proof[user].push(`${key}   correct:Unchanged   ${user}:Down   ${finalResult[user]}`);
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

    ordered = [];
    Object.keys(proof).map(key => {
      ordered.push({ user: key, c: proof[key] })
    })
    ordered.sort((a,b) => {
      return a.user.localeCompare(b.user);
    })
    proof = {}
    ordered.map(x => {
      proof[x.user] = x.c;
    })

    console.log(finalResult);
    console.log(proof);
    debugger;
  },
  computed: {},
  methods: {},
}
</script>

<style>
</style>