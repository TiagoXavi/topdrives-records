<template>
  <div class="BaseDonateButton_Root">
    <a
      href="https://www.patreon.com/topdrivesrecords"
      class="D_Button Main_OptionsButton"
      target="_blank"
      rel="noopener noreferrer">
      <svg style="width: 21px;" class="Main_DiscordLogo" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 601.8 577.8" xml:space="preserve">
        <g fill-rule="evenodd" clip-rule="evenodd" fill="#FF424D">
          <path d="M385.5 1c-119.1 0-216 97-216 216.2 0 118.8 96.9 215.5 216 215.5 118.7 0 215.3-96.7 215.3-215.5C600.8 98 504.2 1 385.5 1zM1 576.8h105.4V1H1v575.8z"/>
        </g>
      </svg>
      <span>Patreon</span>
    </a>
    <a
      v-if="showBoosty || forceBoosty || $i18n.locale === 'ru'"
      href="https://boosty.to/topdrivesrecords"
      class="D_Button Main_OptionsButton"
      target="_blank"
      rel="noopener noreferrer">
      <svg style="width: 21px;" class="Main_BoostyLogo" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 171.1 201" xml:space="preserve">
        <g fill-rule="evenodd" clip-rule="evenodd" fill="#F06C2A">
          <path d="M12,118.9L44.6,6h50.1L84.6,41c-0.1,0.2-0.2,0.4-0.3,0.6L57.7,134h24.8
            c-10.4,25.9-18.5,46.2-24.3,60.9c-45.8-0.5-58.6-33.3-47.4-72.1 M58.4,195l60.4-86.9H93.2l22.3-55.7c38.2,4,56.2,34.1,45.6,70.5
            C149.8,162,104,195,59.4,195C59,195,58.7,195,58.4,195z"
          />
        </g>
      </svg>
      <span>Boosty</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'BaseDonateButton',
  components: {},
  props: {
    forceBoosty: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPatreon: true,
      showBoosty: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    const isRussianLanguage = navigator.languages.includes('ru') || navigator.language === 'ru';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const russianTimeZones = ['Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Kirov', 'Europe/Volgograd', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Kamchatka'];

    if (isRussianLanguage || russianTimeZones.includes(userTimeZone)) {
      this.showBoosty = true;
    }
  },
  computed: {},
  methods: {},
}
</script>

<style>
.BaseDonateButton_Root {
  display: contents;
}
</style>