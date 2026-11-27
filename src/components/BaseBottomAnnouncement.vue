<template>
  <div class="BaseBottomAnnouncement_Layout">
    <div v-if="visible" class="BaseBottomAnnouncement_Bar">
      <button
        class="BaseBottomAnnouncement_Ticker"
        @click="openDialog()">
        <div
          :style="`--ticker-duration: ${duration}s;`"
          class="BaseBottomAnnouncement_Track">
          <div
            v-for="n in copies * 2"
            ref="item"
            :aria-hidden="n > 1"
            class="BaseBottomAnnouncement_Item">
            <template v-for="part in announcement.ticker">
              <BaseIconSvg v-if="part.icon" :type="part.icon" :useMargin="false" class="BaseBottomAnnouncement_Icon" />
              <i v-else-if="part.ticon" :class="`ticon-${part.ticon}`" :style="{ color: part.color }" class="BaseBottomAnnouncement_Ticon" aria-hidden="true"/>
              <span v-else :class="`BaseBottomAnnouncement_${part.tag}`">{{ part.text }}</span>
            </template>
          </div>
        </div>
      </button>
      <button
        class="D_Button BaseBottomAnnouncement_Close"
        aria-label="Close"
        @click="dismiss()">
        <i class="ticon-close_3" aria-hidden="true"/>
      </button>
    </div>
    <!-- <BaseDialog
      :active="dialog"
      :transparent="false"
      :disableScroll="true"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="dialog = false;">
      <div class="Main_AnnouncementBox">
        <div class="Main_AnnouncementTitle">{{ announcement.title }}</div>
        <div class="Main_AnnouncementSubTitle">{{ announcement.subtitle }}</div>
        <div class="BaseBottomAnnouncement_Description">{{ announcement.description }}</div>
        <div class="BaseBottomAnnouncement_List">
          <div v-for="item in announcement.items" class="BaseBottomAnnouncement_ListItem">
            <div class="BaseBottomAnnouncement_ListLabel">{{ item.label }}</div>
            <div class="BaseBottomAnnouncement_ListRows">
              <div v-for="row in item.rows" class="BaseBottomAnnouncement_ListRow">
                <template v-for="part in row">
                  <BaseIconSvg v-if="part.icon" :type="part.icon" :useMargin="false" class="BaseBottomAnnouncement_Icon" />
                  <i v-else-if="part.ticon" :class="`ticon-${part.ticon}`" :style="{ color: part.color }" class="BaseBottomAnnouncement_Ticon" aria-hidden="true"/>
                  <span v-else :class="{ BaseBottomAnnouncement_Tag: part.tag }">{{ part.text }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="BaseBottomAnnouncement_Footer">{{ announcement.footer }}</div>
        <div class="BaseBottomAnnouncement_Buttons">
          <a
            :href="announcement.link"
            class="D_Button Main_OptionsButton"
            target="_blank"
            rel="noopener noreferrer"
            @click="dismiss()">
            <BaseIconSvg type="discord" :useMargin="false" style="width: 25px; margin: -5px 6px -5px 0;" />
            <span>{{ announcement.linkLabel }}</span>
          </a>
          <button
            class="D_Button Main_OptionsButton"
            @click="dismiss()">
            <span>Not interested</span>
          </button>
        </div>
      </div>
    </BaseDialog> -->
    <BaseDialog
      :active="dialog"
      :transparent="false"
      :disableScroll="false"
      :lazy="true"
      max-width="700px"
      min-width="240px"
      zindex="101"
      @close="dialog = false;">
      <div class="BaseBlackFridayButton_DialogBody">
        <div class="BaseBlackFridayButton_DialogLayout">
          <div class="BaseBlackFridayButton_BlackLogo BaseBlackFridayButton_BlackLogoInner">
            <div class="BaseBlackFridayButton_BlackText">BLACK</div>
            <div class="BaseBlackFridayButton_BlackText">FRIDAY</div>
          </div>
          <div class="BaseBlackFridayButton_2">Get 80% off your first month. All discount codes work with all tiers.</div>
          <div class="BaseBlackFridayButton_VideoBox">
            <video class="BaseBlackFridayButton_Video" height="380px;" loop="" controls autoplay="" muted="" @fullscreenchange="switchToHd()" webkit-playsinline playsinline>
              <source src="https://tdrvideos.s3.us-east-1.amazonaws.com/Black2025.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="BaseBlackFridayButton_3_box">
            <div v-for="perk in perks" class="BaseBlackFridayButton_3_item">
              <i :class="`ticon-${perk.icon || 'crown'}`" :style="{ color: perk.color }" style="font-size: 22px;" aria-hidden="true"/>
              <span v-if="perk.tier" :style="{ color: perk.color }">{{ perk.tier }}: </span>
              <span>{{ perk.text }}</span>
            </div>
          </div>
          <div class="BaseBlackFridayButton_4_layout">
            <div class="BaseBlackFridayButton_4_box">
              <div class="BaseBlackFridayButton_4_title">70% OFF</div>
              <div class="BaseBlackFridayButton_4_code">TDR70</div>
              <div class="BaseBlackFridayButton_4_sub">First month</div>
            </div>
            <div class="BaseBlackFridayButton_4_box">
              <div class="BaseBlackFridayButton_4_title">80% OFF</div>
              <div class="BaseBlackFridayButton_4_code">TDR80</div>
              <div class="BaseBlackFridayButton_4_sub">First month</div>
            </div>
            <div class="BaseBlackFridayButton_4_box BaseBlackFridayButton_4_locked">
              <div class="BaseBlackFridayButton_4_title"><i class="ticon-lock" aria-hidden="true"/></div>
              <div class="BaseBlackFridayButton_4_code"><i class="ticon-lock" aria-hidden="true"/></div>
              <div class="BaseBlackFridayButton_4_sub">First month</div>
            </div>
          </div>
          <!-- <BaseDonateButton href="https://www.patreon.com/topdrivesrecords/membership" /> -->
          <a
            href="https://www.patreon.com/topdrivesrecords/membership"
            class="D_Button D_ButtonDark BaseBlackFridayButton_JoinButton"
            target="_blank"
            rel="noopener noreferrer">
            <div class="BaseBlackFridayButton_JoinLeft">
              <i class="ticon-crown BaseBlackFridayButton_Crown" aria-hidden="true"/>
            </div>
            <div class="BaseBlackFridayButton_JoinRight">
              <div class="BaseBlackFridayButton_JoinTop">Join now!</div>
              <div class="BaseBlackFridayButton_JoinBottom">Patreon</div>
            </div>
          </a>
          <button
            class="D_Button Main_OptionsButton"
            @click="dismiss()">
            <span>Not interested</span>
          </button>
        </div>
      </div>
    </BaseDialog>
    <div v-if="dialog" class="BaseBlackFridayButton_Ballons">
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="left: -140px; top: 250px; --factor: 1.0; --factor2: 1.0; animation-delay: 0s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="right: -90px; top: 100px; --factor: 0.9; --factor2: -0.9; animation-delay: 0.05s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="left: -70px; bottom: -80px; --factor: 0.8; --factor2: 0.2; animation-delay: 0.1s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="right: -140px; bottom: -100px; --factor: 1.0; --factor2: -1.3; animation-delay: 0.15s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="left: -80px; top: 50px; --factor: 0.7; --factor2: 1.1; animation-delay: 0.05s" :useMargin="false" type="baloon" />
      <BaseIconSvg class="BaseBlackFridayButton_Baloon" style="right: -80px; bottom: 10px; --factor: 1.3; --factor2: -0.8; animation-delay: 0.1s" :useMargin="false" type="baloon" />
    </div>
  </div>
</template>

<script>
import BaseDialog from './BaseDialog.vue'
import BaseIconSvg from './BaseIconSvg.vue'

const storageKey = "bottomAnnouncement";
const tickerSpeed = 40; // px per second

export default {
  name: 'BaseBottomAnnouncement',
  components: {
    BaseDialog,
    BaseIconSvg
  },
  props: {},
  data() {
    return {
      // New announcement: change the id, so it shows again for users who closed the previous one.
      // Parts: { text }, { text, tag: true }, { icon } (BaseIconSvg type) or { ticon, color } (ticon-* font icon)
      // Items: { label, rows: [parts, parts...] }, label spans all rows
      announcement: {
        id: "2026_11_BlackFriday2",
        ticker: [
          { text: "Black Friday:", tag: "TickYellow" },
          { text: "80% OFF" },
          // { icon: "gold" },
          // { text: "1000 gold in-game" }
        ],
        title: "Triple contest 🎉",
        subtitle: "R Score prediction",
        description: "3 upcoming cars from Arte Della Corsa",
        footer: "⏰ Duration: 24h",
        items: [
          {
            label: "🎁 Prize 1:",
            rows: [
              [{ icon: "gold" }, { text: "1000 gold in game" }],
              [{ ticon: "crown", color: "var(--t2)" }, { text: "2 weeks of TDR tier 2" }]
            ]
          },
          {
            label: "🎁 Prize 2:",
            rows: [
              [{ icon: "gold" }, { text: "1000 gold in game" }],
              [{ ticon: "crown", color: "var(--t2)" }, { text: "2 weeks of TDR tier 2" }]
            ]
          },
          {
            label: "🎁 Prize 3:",
            rows: [
              [{ icon: "gold" }, { text: "1000 gold in game" }],
              [{ ticon: "crown", color: "var(--t2)" }, { text: "2 weeks of TDR tier 2" }]
            ]
          }
        ],
        link: "https://discord.com/channels/1008569974094311544/1536810087501402112",
        linkLabel: "Participate"
      },
      // Perks: { text, color, tier?, icon? } — icon is a ticon-* name, defaults to "crown"
      perks: [
        { icon: "correct_1", color: "var(--t5)", text: "Support TDR project" },
        { tier: "T5", color: "var(--t5)", text: "Highlighted name" },
        { tier: "T4", color: "var(--t4)", text: "Compare: find the best cars" },

        { tier: "T3", color: "var(--t3)", text: "Compare: find RQ Savers" },
        { tier: "T3", color: "var(--t3)", text: "Compare: meta finder" },
        { tier: "T3", color: "var(--t3)", text: "Events/Clubs: find the best cars" },
        { tier: "T3", color: "var(--t3)", text: "Events/Clubs: find RQ savers" },
        { tier: "T3", color: "var(--t3)", text: "Events: see upcoming events" },

        { tier: "T2", color: "var(--t2)", text: "Compare: tune finder" },
        { tier: "T2", color: "var(--t2)", text: "Compare: create custom tunes" },
        { tier: "T2", color: "var(--t2)", text: "Compare: charts" },
        { tier: "T2", color: "var(--t2)", text: "Events/Clubs: hand ranking" }
      ],
      visible: false,
      dialog: false,
      copies: 10,
      duration: 60
    }
  },
  watch: {},
  beforeMount() {
    this.visible = window.localStorage.getItem(storageKey) !== this.announcement.id;
  },
  mounted() {
    if (this.visible) this.resolveTicker();
    this.unsubscribe = this.$store.subscribe(mutation => {
      if (mutation.type === "OPEN_BLACK_FRIDAY") this.openDialog();
    });
  },
  beforeDestroy() {
    if (this.unsubscribe) this.unsubscribe();
  },
  computed: {},
  methods: {
    resolveTicker() {
      // Track = 2 identical halves, rolling -50% loops seamlessly. Each half must be wider than the screen.
      let itemWidth = this.$refs.item?.[0]?.offsetWidth;
      if (!itemWidth) return;
      let screenWidth = Math.max(window.screen.width, window.innerWidth);
      this.copies = Math.ceil(screenWidth / itemWidth) + 1;
      this.duration = (this.copies * itemWidth) / tickerSpeed;
    },
    openDialog() {
      this.dialog = true;
    },
    dismiss() {
      this.visible = false;
      this.dialog = false;
      window.localStorage.setItem(storageKey, this.announcement.id);
    }
  },
}
</script>

<style>
.BaseBottomAnnouncement_Bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  height: 30px;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: hsl(var(--back-h), var(--back-s), 10%);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 14px;
  color: var(--d-text);
}
.BaseBottomAnnouncement_Ticker {
  flex-grow: 1;
  align-self: stretch;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 40px, #000 calc(100% - 40px), transparent);
  mask-image: linear-gradient(90deg, transparent, #000 40px, #000 calc(100% - 40px), transparent);
}
.BaseBottomAnnouncement_Ticker:hover {
  color: var(--d-text-b);
}
.BaseBottomAnnouncement_Track {
  display: flex;
  width: max-content;
  animation: BaseBottomAnnouncement_Roll var(--ticker-duration) linear infinite;
}
.BaseBottomAnnouncement_Ticker:hover .BaseBottomAnnouncement_Track {
  animation-play-state: paused;
}
@keyframes BaseBottomAnnouncement_Roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.BaseBottomAnnouncement_Item {
  display: flex;
  align-items: center;
  padding-right: 90px;
  white-space: nowrap;
}
.BaseBottomAnnouncement_Tag {
  display: inline-block;
  font-family: 'Roboto Condensed';
  /* font-weight: 600; */
  text-transform: uppercase;
  line-height: unset;
  padding: 2px 7px;
  /* margin-right: 0.5em;
  background-color: rgb(var(--d-text-yellow));
  color: #000; */
  transform: skewX(-10deg);
}
.BaseBottomAnnouncement_TickYellow {
  color: rgb(var(--d-text-yellow));
  margin-right: 0.2em;
}
.BaseBottomAnnouncement_Icon {
  display: inline-flex;
  vertical-align: bottom;
  width: 1.3em;
  margin: 0 0.3em;
}
.BaseBottomAnnouncement_Ticon {
  /* same box as BaseBottomAnnouncement_Icon */
  display: inline-block;
  font-size: 1.2em;
  width: 1.08em;
  margin: 0 0.25em;
  text-align: center;
}
.BaseBottomAnnouncement_Close {
  --height: 30px;
  border-radius: 0;
  font-size: 14px;
  color: var(--d-text);
}
.BaseBottomAnnouncement_Description {
  opacity: 0.8;
}
.BaseBottomAnnouncement_Footer {
  opacity: 0.8;
  margin-bottom: 25px;
}
.BaseBottomAnnouncement_List {
  display: inline-grid;
  grid-template-columns: auto auto;
  align-items: center;
  column-gap: 10px;
  row-gap: 12px;
  text-align: left;
  margin: 20px 0 25px 0;
}
.BaseBottomAnnouncement_ListItem {
  display: contents;
}
.BaseBottomAnnouncement_ListLabel {
  white-space: nowrap;
}
.BaseBottomAnnouncement_ListRows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 10px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
}
.BaseBottomAnnouncement_ListRow {
  display: flex;
  align-items: center;
}
.BaseBottomAnnouncement_ListRow > :first-child {
  margin-left: 0;
}
.BaseBottomAnnouncement_Buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .BaseBottomAnnouncement_Track {
    animation: none;
  }
}










.BaseBlackFridayButton_Box {
  padding: 5px;
  font-size: 15px;
  height: 42px;
}
.BaseBlackFridayButton_BlackLogo {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: skewX(-10deg) rotate(-5deg);
}
.BaseBlackFridayButton_BlackText {
  font-family: 'Roboto Condensed';
  font-weight: 600;
  line-height: 0.9;
}
.BaseBlackFridayButton_BlackText:first-child {
  background-color: rgb(var(--d-text-yellow));
  color: #000;
  padding: 2px 8px 2px 8px;
  margin: -3px;
}
.BaseBlackFridayButton_BlackText:last-child {
  background-color: #000;
  color: rgb(var(--d-text-yellow));
  padding: 3px 12px;
  margin: -1px;
  margin-top: 2px;
}
.BaseBlackFridayButton_80Logo {
  display: flex;
  font-family: 'Roboto Condensed';
  font-weight: 600;
  transform: skewX(-10deg) rotate(-5deg);
  align-items: center;
  line-height: 1;
}
.BaseBlackFridayButton_80Text {
  font-size: 1.8em;
  color: rgb(var(--d-text-yellow));
  background-color: #000;
  padding: 5px 9px 5px 3px;
}
.BaseBlackFridayButton_80Sub {
  font-size: 1em;
  background-color: rgb(var(--d-text-yellow));
  color: #000;
  padding: 1px 3px 0px 3px;
  margin-bottom: 10px;
  margin-left: -5px;
}
.BaseBlackFridayButton_1Logo {
  display: flex;
  font-family: 'Roboto Condensed';
  font-weight: 600;
  transform: skewX(-10deg) rotate(-5deg);
  align-items: center;
  line-height: 1;
}
.BaseBlackFridayButton_1Text {
  font-size: 1.8em;
  color: rgb(var(--d-text-yellow));
  background-color: #000;
  padding: 5px 7px 5px 4px;
}
.BaseBlackFridayButton_1Text > span {
  letter-spacing: 0px;
  vertical-align: top;
  font-size: 0.6em;
  line-height: 1.4;
}
.BaseBlackFridayButton_Ballons {
  position: fixed;
  z-index: 200;
  width: 50%;
  height: 50%;
  left: 25%;
  top: 25%;
  pointer-events: none;
}
.BaseBlackFridayButton_Baloon {
  position: absolute;
  width: 90px;
  animation: bf_baloon2 3s linear forwards;
  animation-timing-function: ease-out;
  pointer-events: none;
  transform: scale(0);
  transform-origin: bottom left;
}
.BaseBlackFridayButton_Baloon:nth-child(odd) {
  transform-origin: bottom right;
}
@keyframes bf_baloon2 {
  0% {
    transform: scale(0);
  }
  5% {
    transform: scale(1);
  }
  80% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1);
    /* transform: scale(0); */
  }
}
.BaseBlackFridayButton_Baloon > div {
  animation: bf_baloon 3s linear forwards;
  /* transform: translateY(calc(100px * var(--factor) * 2)); */
  /* transform: scale(0); */
  /* transform: scale(1); */
  animation-delay: inherit;
  transform-origin: center;
  width: 100%;
}
@keyframes bf_baloon {
  0% {
    transform: translateY(calc(100px * var(--factor) * 2));
  }
  100% {
    transform: translateY(calc(-500px * var(--factor) * 2));
  }
}
.BaseBlackFridayButton_Baloon > div > svg {
  animation: bf_baloon3 2s linear forwards;
  animation-timing-function: ease-out;
  animation-delay: inherit;
}
@keyframes bf_baloon3 {
  0% {
    transform: translateX(calc(20px * var(--factor2) * 2));
  }
  100% {
    transform: translateX(calc(-60px * var(--factor2) * 2));
  }
}
.BaseBlackFridayButton_DialogLayout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
}
.BaseBlackFridayButton_BlackLogoInner {
  font-size: 45px;
  padding: 10px;
}
.BaseBlackFridayButton_2 {
  text-align: center;
}
.BaseBlackFridayButton_3_box {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.BaseBlackFridayButton_3 {
  margin-bottom: 5px;
}
.BaseBlackFridayButton_3_item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.BaseBlackFridayButton_Correct {
  color: rgb(var(--d-text-green));
}
.BaseBlackFridayButton_VideoBox {
  display: flex;
}
.BaseBlackFridayButton_Video {
  max-width: 100%;
}
.BaseBlackFridayButton_4_layout {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}
.BaseBlackFridayButton_4_box {
  
}
.BaseBlackFridayButton_4_title {
  text-align: center;
}
.BaseBlackFridayButton_4_code {
  font-size: 30px;
  padding: 9px 20px;
  border-radius: 10px;
  border-width: 2px;
  border-style: dashed;
  border-color: #959595;
  color: rgb(var(--d-text-yellow));
  font-weight: bold;
  min-width: 3.5em;
  text-align: center;
}
.BaseBlackFridayButton_JoinButton {
  width: 100%;
  max-width: 240px;
  padding: 12px 10px;
  gap: 7px;
  margin: 10px 0 20px 0;
}
.BaseBlackFridayButton_Crown {
  font-size: 38px;
}
.BaseBlackFridayButton_JoinTop {
  font-size: 24px;
}
.BaseBlackFridayButton_JoinBottom {
  font-size: 16px;
}
.BaseBlackFridayButton_4_sub {
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
}
.Main_LeftPlusTop:has(.BaseBlackFridayButton_DialogLayout) {
  z-index: 101;
}
.BaseBlackFridayButton_4_locked {
  
}
.BaseBlackFridayButton_4_locked .BaseBlackFridayButton_4_title {

}
.BaseBlackFridayButton_4_locked .BaseBlackFridayButton_4_code {
  display: flex;
  width: 3em;
  text-align: center;
  justify-content: center;
  line-height: 1.4;
}
.BaseBlackFridayButton_4_locked .BaseBlackFridayButton_4_code i {
  line-height: 1.2;
}



@media only screen and (max-width: 767px) {
  .BaseBlackFridayButton_Baloon > div > svg {
    animation: bf_baloon4 2s linear forwards;
    /* animation: unset; */
    /* transform: translateX(calc(200px * var(--factor2) * 2)); */
  }
}
@keyframes bf_baloon4 {
  0% {
    transform: translateX(calc(40px * var(--factor2) * 2));
  }
  100% {
    transform: translateX(calc(-60px * var(--factor2) * 2));
  }
}
</style>
