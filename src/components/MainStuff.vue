<template>
  <div class="MainStuff_Layout">
    <div class="MainStuff_Group">
      <div class="MainStuff_Title">Tools</div>
      <div class="MainStuff_Box">
        <button
          v-for="item in tools"
          class="D_Button MainStuff_Button"
          @click="$router.push({ name: item.name })">
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
    <div class="MainStuff_Group">
      <div class="MainStuff_Title">TDR Tools</div>
      <div class="MainStuff_Box">
        <button
          v-for="item in tdrTools"
          class="D_Button MainStuff_Button"
          @click="$router.push({ name: item.name })">
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'MainStuff',
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
      user: null,
      tools: [],
      tdrTools: [],
    }
  },
  watch: {},
  beforeMount() {
    this.user = this.$store.state.user;

    this.tools = [
      { name: "Gallery", label: this.$t("m_vChanges", { version: '22.0' }) },
      { name: "MainNewPhotos", label: this.$t("m_vNewPhotos", { version: '22.0' }) },
      { name: "MainCheatSheet", label: this.$t("m_cheatSheet") },
      { name: "MainFindCar", label: this.$t("m_carFinder") },
      { name: "MainTestPoints", label: this.$t("m_testPoints") },
      { name: "MainDownTimes", label: this.$t("m_downTimes") }
    ];
    this.tdrTools = [
      { name: "MainTranslate", label: this.$t("m_translationTool") },
    ]
    if (this.user && this.user.mod) {
      this.tdrTools.push( { name: "MainAddNewCars", label: this.$t("m_newCar") } )
    }

    
  },
  mounted() {
    let vm = this;
    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })
  },
  computed: {},
  methods: {},
  beforeDestroy() {
    this.unsubscribe();
  },
}
</script>

<style>
.MainStuff_Group {
  margin: 40px auto;
}
.MainStuff_Box {
  max-width: 800px;
  margin: 0px auto;
  display: grid;
}
.MainStuff_Button.D_Button {
  font-size: 19px;
  --cl: 70%;
  color: hsl(var(--back-h), var(--back-s), var(--cl));
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0 12px;
  height: 100%;
  border-radius: 0;
  transition-duration: 0.15s;
}
.MainStuff_Title {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 10px;
}
.MainStuff_Box {
  max-width: 800px;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>