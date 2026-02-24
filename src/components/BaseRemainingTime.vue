<template>
  <div :class="{ BaseRemainingTime_Clock: showClock }" class="BaseRemainingTime_Layout">{{ result }}</div>
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
    }
  },
  data() {
    return {
      result: "-",
      inverval: null,
      timeout: null,
      quickMs: null
    }
  },
  watch: {
    endDateTime: function() {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.quickMs = null;
      this.calcResult(); // first quick
    }
  },
  beforeMount() {},
  mounted() {
    let shouldContinue = this.calcResult(); // first quick
    if (!shouldContinue) return;

    this.inverval = setInterval(() => {
      this.calcResult();
      // console.log("a")
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.inverval);
    clearTimeout(this.timeout);
  },
  computed: {},
  methods: {
    calcResult() {
      
      if (!this.timeout) {
        let result = "";

        if (this.quickMs) {
          this.quickMs -= 1000;
          var diffMins = Math.floor(this.quickMs / 60 / 1000); // minutes
          var diffSeconds = Math.floor((this.quickMs % 60000) / 1000); // seconds

          if (diffMins > 0) result += `${diffMins}m `;
          result += `${diffSeconds}s`;

          this.result = result;

          if (this.quickMs < 0) {
            clearInterval(this.inverval);
            return false;
          }
        } else {
          var now = new Date();
          var Date2 = new Date(this.endDateTime);

          var { diffDays, diffMs, diffHrs, diffMins, result: res } = Vue.options.filters.timeDiffString(now, Date2);
  
          let nextUpdateInMs = 1000;
          if (diffDays) nextUpdateInMs = 60 * 60 * 1000; // 1 hr in Ms
          else if (diffHrs || diffMins >= 5) nextUpdateInMs = 60 * 1000; // 1 min in Ms
          else nextUpdateInMs = 1000; // 1 sec in Ms (less than 5 min)
  
          this.result = res;
          if (this.mini) this.result = this.result.split(" ")[0];
          if (this.hideNegative && now > Date2) {
            this.result = "";
            this.firstTimeNegative();
          }

          if (import.meta.env.DEV) console.log("BaseRemainingTime", nextUpdateInMs);

          if (!this.result) {
            this.quickMs = null;
            clearInterval(this.inverval);
            clearTimeout(this.timeout);
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
          }
          return true;
        }

      }

    },
    firstTimeNegative() {
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