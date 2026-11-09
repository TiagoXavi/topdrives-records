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
              <span v-else :class="{ BaseBottomAnnouncement_Tag: part.tag }">{{ part.text }}</span>
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
    <BaseDialog
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
    </BaseDialog>
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
        id: "2026_11_RScorePrediction",
        ticker: [
          { text: "Contest:", tag: true },
          { text: "Win" },
          { icon: "gold" },
          { text: "1000 gold in-game" }
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
</style>
