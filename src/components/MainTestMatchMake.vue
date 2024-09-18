<template>
  <div class="MainTestMatchMake_Layout">MainTestMatchMake_Layout</div>
</template>

<script>
try {
  var hutch_matchmakeEntries = require('@/database/hutch_matchmakeEntries.json') // internal
} catch (error) {}

export default {
  name: 'MainTestMatchMake',
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
    return {
      hutch_matchmakeEntries
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    // console.log("Average:", this.testProb(2, 2, 2)); // 50%
   
    

    let result = {
      events: {},
      eventsClubs: {}
    }
    let stats = {
      events: {},
      eventsClubs: {}
    }
    let summary = {
      events: {},
      eventsClubs: {}
    }
    this.hutch_matchmakeEntries.map(entry => {
      let requestParsed = JSON.parse(entry.request.postData.text);
      let eventId = requestParsed.eventId;
      let key = entry.request.url.includes("clubevents") ? "eventsClubs" : "events";
      if (key === "eventsClubs") return; // no clubs
      if (!result[key][eventId]) {
        result[key][eventId] = [];
        stats[key][eventId] = {
          numPlay: 0,
          x2: 0,
          x3: 0,
          x4: 0,
          x5: 0,
          x6: 0,
          repeat: 0,
          nonRepeat: 0
        };
        summary[key][eventId] = {};
      }
      if (entry.response.status !== 200) return;

      let responseParsed = JSON.parse(entry.response.content.text);
      result[key][eventId].push(responseParsed.challengeSetId);
    })

    // remove few samples
    // Object.keys(result).map(key => {
    //   Object.keys(result[key]).map(eventId => {
    //     if (result[key][eventId].length < 15) {
    //       delete result[key][eventId];
    //     };
    //   })
    // })

    // remove 3 first
    Object.keys(result).map(key => {
      Object.keys(result[key]).map(eventId => {
        if (result[key][eventId].length < 5) return;
        if (
          // init of an event
          // the real first element isnt on database because of register endpoint, not matchmake
          result[key][eventId][0] !== result[key][eventId][1] &&
          result[key][eventId][0] !== result[key][eventId][2] &&
          result[key][eventId][1] !== result[key][eventId][2]
        ) {
          result[key][eventId].splice(0, 3);
        }
      })
    })

    console.log(result);

    // stats fill
    Object.keys(result).map(key => {
      Object.keys(result[key]).map(eventId => {

        let lastTrackset = null;
        let countX = 1;

        result[key][eventId].map(x => {
          stats[key][eventId].numPlay++;
          if (!lastTrackset) {
            lastTrackset = x;
            return;
          }

          if (lastTrackset === x) {
            countX++;
            stats[key][eventId][`x${countX}`]++;
            stats[key][eventId].repeat++;
          } else {
            stats[key][eventId].nonRepeat++;
            lastTrackset = x;
            countX = 1;
          }

        })
      })
    })

    // test probability
    Object.keys(stats).map(key => {
      Object.keys(stats[key]).map(eventId => {
        Object.keys(stats[key][eventId]).map(stat => {

          {
            if (stat !== "numPlay") {

              let xNumber = Number(stat[1]); // 2

              stats[key][eventId][`prb2_${stat}`] = this.testProb2(4, stats[key][eventId].numPlay, xNumber);
              return;

              Array.from(Array( stats[key][eventId].numPlay )).map((_, i) => {
                if (i === 0) return;
                probNormal = 1 / (6**i) * 100; // 0.25
                if (i+1 === xNumber) {
                  fixedProb = probNormal;
                  cumulative = probNormal;
                }
                
                if (i+1 > xNumber) {
                  cumulative = this.sumOds(cumulative, fixedProb);
                  if (xNumber === 4) {
                  }
                }
              });

              stats[key][eventId][`prb_${stat}`] = cumulative;
            }
          }
        })
      })
    })
    console.log(stats);

    if (false) { // test chance of 43 three times in a row
      let percent = 0;
      Array.from(Array( 10 )).map((_, i) => {
        let AtLeast43 = 0;
        Array.from(Array( 10000 )).map((_, i) => {
          let x3Total = 0;
          Object.keys(stats).map(key => {
            Object.keys(stats[key]).map(eventId => {
              x3Total += this.testProb2(4, stats[key][eventId].numPlay, 3).consecutiveCount;
            })
          })
          if (x3Total >= 43) {
            AtLeast43++;
          }
        });
        percent += AtLeast43;
      });
      console.log(percent / 10)
      debugger;
    }


    var counts = []
    Object.keys(result.events).map(key => {
      counts.push(result.events[key].length)
    })
    console.log(counts)
    debugger;




    let numX5 = 0;
    let numX6 = 0;
    let summaryGlobal = {
      numPlay: 0,
      x2: { exptd: 0, real: 0 },
      x3: { exptd: 0, real: 0 },
      x4: { exptd: 0, real: 0 },
      repeat: { exptd: 0, real: 0 },
      nonRepeat: { exptd: 0, real: 0 }
    };

    Object.keys(stats).map(key => {
      Object.keys(stats[key]).map(eventId => {
        summaryGlobal.numPlay += stats[key][eventId].numPlay
        summary[key][eventId][`repeat`] = {
          exptd: stats[key][eventId].prb2_x2.repeat,
          real: stats[key][eventId].repeat
        };
        summary[key][eventId][`nonRepeat`] = {
          exptd: stats[key][eventId].prb2_x2.nonRepeat,
          real: stats[key][eventId].nonRepeat
        };
        summary[key][eventId][`x2`] = {
          exptd: stats[key][eventId].prb2_x2.consecutiveCount,
          real: stats[key][eventId].x2
        };
        summary[key][eventId][`x3`] = {
          exptd: stats[key][eventId].prb2_x3.consecutiveCount,
          real: stats[key][eventId].x3
        };
        summary[key][eventId][`x4`] = {
          exptd: stats[key][eventId].prb2_x4.consecutiveCount,
          real: stats[key][eventId].x4
        };

        Object.keys(summary[key][eventId]).map(summaryStat => {
          Object.keys(summary[key][eventId][summaryStat]).map(eOrR => {
            summaryGlobal[summaryStat][eOrR] += summary[key][eventId][summaryStat][eOrR]
          })
        })

        if (stats[key][eventId].x5) numX5++;
        if (stats[key][eventId].x6) numX6++;
      })
    })

    summaryGlobal.repeat.diff = Number((100 - (summaryGlobal.repeat.exptd * 100 / summaryGlobal.repeat.real)).toFixed(1))
    summaryGlobal.nonRepeat.diff = Number((100 - (summaryGlobal.nonRepeat.exptd * 100 / summaryGlobal.nonRepeat.real)).toFixed(1))
    summaryGlobal.x2.diff = Number((100 - (summaryGlobal.x2.exptd * 100 / summaryGlobal.x2.real)).toFixed(1))
    summaryGlobal.x3.diff = Number((100 - (summaryGlobal.x3.exptd * 100 / summaryGlobal.x3.real)).toFixed(1))
    summaryGlobal.x4.diff = Number((100 - (summaryGlobal.x4.exptd * 100 / summaryGlobal.x4.real)).toFixed(1))

    summaryGlobal.numX5 = numX5;
    summaryGlobal.numX6 = numX6;

    console.log(summary);
    console.log(summaryGlobal);






    debugger;
  },
  computed: {},
  methods: {
    // testProb(faces = 6, times = 5, desiredSuccess = 2) {
    //   let arrPercent = [];
    //   Array.from(Array( 100 )).map((_, i) => {
    //     let consecSucess = [];
    //     Array.from(Array( 100 )).map((_, i) => {
    //       consecSucess.push(this.tryConsec( faces, times, desiredSuccess ));
    //     });
    //     arrPercent.push(consecSucess.filter(Boolean).length);
    //   });

    //   return arrPercent.reduce((a, b) => a + b) / arrPercent.length;
    // },
    // tryConsec(faces = 6, times = 5, consecSucess = 2) {
    //   let success = false;
    //   let rolls = [];
    //   Array.from(Array( times )).map((_, i) => {
    //     rolls.push(Math.floor(Math.random() * faces-1) + 1)
    //   });
    //   let current;
    //   let consecutive = 0;
    //   rolls.map((x, ix) => {
    //     if (current === x) {
    //       consecutive++;
    //       if (consecutive >= consecSucess) success = true;
    //     } else {
    //       current = x;
    //       consecutive = 1;
    //     }
    //   })
      
    //   return success;
    // },
    testProb2(faces = 6, times = 5, desiredSuccess = 2, atLeastNumber) {
      let consecCounts = [];
      Array.from(Array( 1 )).map((_, i) => {
        consecCounts.push(this.rollOne( faces, times, desiredSuccess, atLeastNumber ));
      });

      let consecSummed = consecCounts.reduce((a, b) => {
        return {
          consecutiveCount: a.consecutiveCount + b.consecutiveCount,
          repeat: a.repeat + b.repeat,
          nonRepeat: a.nonRepeat + b.nonRepeat
        }
      });
      consecSummed = {
        consecutiveCount: consecSummed.consecutiveCount / consecCounts.length,
        repeat: consecSummed.repeat / consecCounts.length,
        nonRepeat: consecSummed.nonRepeat / consecCounts.length
      }
      
      // if (desiredSuccess === 3) {
      //   let consecSum = 0;
      //   consecCounts.map(x => {
      //     consecSum += x.consecutiveCount;
      //   })
      //   consecSummed.consecSum = consecSum;
      // }
      // if (atLeastNumber) {
      //   let atLeastCount = 0;
      //   consecCounts.map(x => {
      //     if (x.boolLeast) atLeastCount++;
      //   })
      //   console.log(atLeastCount);
      //   debugger;
      // }

      return consecSummed;
    },
    rollOne(faces = 6, times = 5, consecSucess = 2, atLeastNumber) {
      let rolls = [];
      Array.from(Array( times )).map((_, i) => {
        rolls.push(Math.floor(Math.random() * faces-1) + 1)
      });
      let current;
      let consecutive = 1;
      let consecutiveCount = 0;
      let repeat = 0;
      let nonRepeat = 0;
      rolls.map((x, ix) => {
        if (ix === 0) {
          current = x;
          return;
        };
        if (current === x) {
          consecutive++;
          repeat++;
          if (consecutive === consecSucess) consecutiveCount++;
        } else {
          nonRepeat++;
          current = x;
          consecutive = 1;
        }
      })

      return { consecutiveCount, repeat, nonRepeat };

      // if (atLeastNumber) {
      //   let boolLeast = false;
      //   if (consecutiveCount > atLeastNumber) boolLeast = true;
      //   return { consecutiveCount, repeat, nonRepeat, boolLeast };
      // } else {
      //   return { consecutiveCount, repeat, nonRepeat };
      // }
      
    },
    sumOds(odd1, odd2, returnString = false) {
      let lower = (100/odd1) * (100/odd2)
      let upper = lower - ( (100/odd1 - 1) * (100/odd2 - 1) )
      let result = ((upper / lower) * 100);

      if (returnString) return `${result.toFixed(2)}%`
      return result;
    },
  },
}
</script>

<style>
</style>