<template>
  <div class="MainValidateFinalJson_Layout">MainValidateFinalJson_Layout</div>
</template>

<script>
import cars_final from '../database/cars_final.json' // internal

export default {
  name: 'MainValidateFinalJson',
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
      cars_final
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    this.cars_final.sort((a, b) => b.rq - a.rq)

    this.cars_final.map(x => {
      let newRid = x.rid.trim().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
      if (x.rid !== newRid) {
        console.log(x.rid);
        // debugger
      }

    })

    debugger;

    navigator.clipboard.writeText(JSON.stringify(this.cars_final));
  },
  computed: {},
  methods: {},
}
</script>

<style>
</style>