<template>
  <div :class="{ BaseRemainingTime_Clock: showClock, BaseRemainingTime_Negative: isNegative }" class="BaseRemainingTime_Layout">{{ result }}</div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseRemainingTime',
  components: {
    // BaseDetalheHeader
  },
  props: {
    endDateTime: {
      type: String
    },
    mini: {
      type: Boolean,
      default: false
    },
    hideNegative: {
      type: Boolean,
      default: false
    },
    showClock: {
      type: Boolean,
      default: false
    },
    HMS: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      result: "-",
      inverval: null,
      timeout: null,
      quickMs: null,
      isNegative: false,
      stopedReason: null
    }
  },
  watch: {
    endDateTime: function() {
      clearTimeout(this.timeout);
      clearInterval(this.inverval);
      this.inverval = null;
      this.timeout = null;
      this.quickMs = null;
      this.isNegative = false;
      
      let shouldContinue = this.calcResult();
      if (!shouldContinue) return;

      this.restart();
    }
  },
  beforeMount() {},
  mounted() {
    let shouldContinue = this.calcResult(); // first quick
    if (!shouldContinue) return;

    this.restart();
  },
  beforeDestroy() {
    clearInterval(this.inverval);
    clearTimeout(this.timeout);
  },
  computed: {},
  methods: {
    restart() {
      this.inverval = setInterval(() => {
        this.calcResult();
        // console.log("a")
      }, 1000);
    },
    calcResult() {
      
      if (!this.timeout) {
        let result = "";

        if (this.quickMs) {
          let ended = this.quickMs < 0;
          this.quickMs = Math.abs(this.quickMs);
          if (ended) {
            result += "-";
            this.quickMs += 1000;
          } else {
            this.quickMs -= 1000;
          }
          var diffHours = Math.floor(this.quickMs / 3600000); // hours
          var diffMins = Math.floor((this.quickMs % 3600000) / 60000); // minutes
          var diffSeconds = Math.floor((this.quickMs % 60000) / 1000); // seconds

          if (diffHours > 0) result += `${diffHours}h `;
          if (diffMins > 0) result += `${diffMins}m `;
          result += `${diffSeconds}s`;

          this.result = result;

          if (this.quickMs < 0) {
            if (this.hideNegative) this.result = "";
            this.firstTimeNegative();
            // clearInterval(this.inverval);
            // this.stopedReason = "quickMs";
            return true;
          }
          if (ended) {
            this.quickMs = this.quickMs * -1;
            this.isNegative = true;
          } else {
            this.isNegative = false;
          }

          this.stopedReason = null;
          return true;
        } else {
          var now = new Date();
          var Date2 = new Date(this.endDateTime);

          var { diffDays, diffMs, diffHrs, diffMins, result: res } = Vue.options.filters.timeDiffString(now, Date2, this.HMS);
  
          let nextUpdateInMs = 1000;
          if (diffDays) nextUpdateInMs = 60 * 60 * 1000; // 1 hr in Ms
          else if (diffHrs || diffMins >= 5) nextUpdateInMs = 60 * 1000; // 1 min in Ms
          else nextUpdateInMs = 1000; // 1 sec in Ms (less than 5 min)
          if (this.HMS) nextUpdateInMs = 1000;
  
          this.result = res;
          if (this.mini) this.result = this.result.split(" ")[0];
          if (now > Date2) {
            if (this.hideNegative) this.result = "";
            this.firstTimeNegative();
          } else {
            this.isNegative = false;
          }

          if (import.meta.env.DEV) console.log("BaseRemainingTime", nextUpdateInMs);

          if (!this.result) {
            this.quickMs = null;
            clearInterval(this.inverval);
            clearTimeout(this.timeout);
            this.stopedReason = `noResult ${ diffDays, diffHrs, diffMins, diffMs, res }`;
            return false;
          }
  
          if (nextUpdateInMs > 1000) {
            this.quickMs = null;
            this.timeout = setTimeout(() => {
              this.quickMs = null;
              this.timeout = null;
            }, nextUpdateInMs);
          } else {
            this.quickMs = diffMs;
            if (this.result.startsWith("-")) this.quickMs = this.quickMs * -1;
          }
          
          this.stopedReason = null;
          return true;
        }

      }

    },
    firstTimeNegative() {
      this.isNegative = true;
      if (this.$listeners.ended) {
        // console.log("Emitting ended event");
        this.$emit("ended");
      }
    }
  },
}
</script>

<style>
/* .BaseRemainingTime_ClockBox {
  display: inline;
  flex-direction: row-reverse;
}
.BaseRemainingTime_ClockIcon {
  display: none;
}
.BaseRemainingTime_Layout:not(:empty) + .BaseRemainingTime_ClockIcon {
  display: inline;
  font-size: 12px;
  line-height: 12px;
  margin-left: 3px;
  margin-top: -2px;
  color: var(--d-text-light);
} */
.BaseRemainingTime_Clock:not(:empty):before {
  content: "\e908";
  font-family: 'JurisT' !important;
  margin-right: 2px;
}
</style>