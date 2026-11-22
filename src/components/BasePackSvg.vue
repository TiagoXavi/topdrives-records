<template>
  <div class="BasePackSvg_Layout">
    <svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 314.7 190.7" style="enable-background:new 0 0 314.7 190.7;" xml:space="preserve">
      <defs>
        <linearGradient :id="`${gid}_gBackground`" x2="0.35" y2="1">
          <stop offset="0" :style="`stop-color:${packColorsResolved.gBackground1}`"/>
          <stop offset="1" :style="`stop-color:${packColorsResolved.gBackground2}`"/>
        </linearGradient>
        <linearGradient :id="`${gid}_gBottom`" x2="0.35" y2="1">
          <stop offset="0" :style="`stop-color:${packColorsResolved.gBottom1}`"/>
          <stop offset="0.9" :style="`stop-color:${packColorsResolved.gBottom2}`"/>
        </linearGradient>
        <linearGradient :id="`${gid}_gDual`" x2="0.35" y2="1">
          <stop offset="0" :style="`stop-color:${packColorsResolved.gDual1}`"/>
          <stop offset="0.9" :style="`stop-color:${packColorsResolved.gDual2}`"/>
        </linearGradient>
      </defs>
      <rect x="4" y="1.7" :style="`clip-path:url(#SVGID_1_);fill:${packColorsResolved.background};fill: url(#${gid}_gBackground);`" width="305.7" height="187.3"/>
      <polygon v-if="packColorsResolved.dual" :style="`clip-path:url(#SVGID_1_);fill:${packColorsResolved.dual};fill: url(#${gid}_gDual)`" points="180.3,0 316.2,0 316.2,190.7 120.1,190.7"/>
      <path :style="`clip-path:url(#SVGID_1_);fill:${packColorsResolved.bottom};fill: url(#${gid}_gBottom)`" d="M313.8,148.1v41.7H0.8v-41.7H313.8z"/>
      <path style="display:none;opacity:0.3;clip-path:url(#SVGID_1_);" d="M10,191.9V189c0,0,15.4,4.7,26.5-6c5.3-5.2,8.8-9,24.5-6.2
        c23.6,4.3,182.4,4.1,193.7-0.1c8.8-3.3,16.1,0,23.2,7c9,8.9,26.7,5.4,26.7,5.4l-3.8,1.9L10,191.9z"/>
      <path style="display:none;opacity:0.18;clip-path:url(#SVGID_1_);fill:#FFFFFF;" d="M10,3.7c13.8-0.5,18.7-4.3,27.5,5.5
        c6.9,7.6,17.9,4.6,24,4c6.1-0.6,64.2-0.5,87.5-0.5c21,0,84.5-0.9,114,2c13.3,1.3,11.1-15.6,41.5-11c23.2,3.5-3.2-0.4-3.2-0.4
        L13.8,3.5C13.8,3.5-3.8,4.2,10,3.7z"/>
      <!-- Reflections: bottom shading (kept under the text so labels stay crisp) -->
      <g style="opacity:0.1;clip-path:url(#SVGID_1_);">
        <rect x="10.8" y="3.3" width="1.5" height="184.4"/>
        <rect x="15.3" y="3.3" width="1.5" height="184.4"/>
        <rect x="19.8" y="3.3" width="1.5" height="184.4"/>
        <rect x="24.3" y="3.3" width="1.5" height="184.4"/>
      </g>
      <g style="opacity:5.000000e-02;clip-path:url(#SVGID_1_);">
        <rect x="13" y="3.3" style="fill:#FFFFFF;" width="1.5" height="184.4"/>
        <rect x="17.5" y="3.3" style="fill:#FFFFFF;" width="1.5" height="184.4"/>
        <rect x="22" y="3.3" style="fill:#FFFFFF;" width="1.5" height="184.4"/>
      </g>
      <g style="opacity:0.1;clip-path:url(#SVGID_1_);">
        <rect x="288.8" y="3.3" width="1.5" height="184.4"/>
        <rect x="293.3" y="3.3" width="1.5" height="184.4"/>
        <rect x="297.8" y="3.3" width="1.5" height="184.4"/>
        <rect x="302.3" y="3.3" width="1.5" height="184.4"/>
      </g>
      <g style="opacity:5.000000e-02;clip-path:url(#SVGID_1_);">
        <rect x="291" y="3.3" style="fill:#FFFFFF;" width="1.5" height="184.4"/>
        <rect x="295.5" y="3.3" style="fill:#FFFFFF;" width="1.5" height="184.4"/>
        <rect x="300" y="3.3" style="fill:#FFFFFF;" width="1.5" height="184.4"/>
      </g>
      <g style="display:none;opacity:0.1;clip-path:url(#SVGID_1_);">
        <rect x="288.9" y="3.3" style="display:inline;" width="2.2" height="184.4"/>
        <rect x="295.6" y="3.3" style="display:inline;" width="2.2" height="184.4"/>
        <rect x="302.2" y="3.3" style="display:inline;" width="2.2" height="184.4"/>
      </g>
      <g style="display:none;opacity:5.000000e-02;clip-path:url(#SVGID_1_);">
        <rect x="292.2" y="3.3" style="display:inline;fill:#FFFFFF;" width="2.2" height="184.4"/>
        <rect x="298.8" y="3.3" style="display:inline;fill:#FFFFFF;" width="2.2" height="184.4"/>
      </g>
      <!-- Reflections: crimp ridge highlights -->
      <g style="clip-path:url(#SVGID_1_);">
        <rect x="13" y="3.3" fill="url(#tdCrimpTop)" width="1.2" height="184.4"/>
        <rect x="17.5" y="3.3" fill="url(#tdCrimpTop)" opacity="0.75" width="1.2" height="184.4"/>
        <rect x="22" y="3.3" fill="url(#tdCrimpTop)" opacity="0.5" width="1.2" height="184.4"/>
        <rect x="14.3" y="85" fill="url(#tdCrimpBottom)" opacity="0.5" width="0.9" height="102.7"/>
        <rect x="18.8" y="85" fill="url(#tdCrimpBottom)" opacity="0.75" width="0.9" height="102.7"/>
        <rect x="23.3" y="85" fill="url(#tdCrimpBottom)" width="0.9" height="102.7"/>
        <rect x="300.5" y="3.3" fill="url(#tdCrimpTop)" opacity="0.5" width="1.2" height="184.4"/>
        <rect x="296" y="3.3" fill="url(#tdCrimpTop)" opacity="0.4" width="1.2" height="184.4"/>
        <rect x="291.5" y="3.3" fill="url(#tdCrimpTop)" opacity="0.3" width="1.2" height="184.4"/>
        <rect x="299.5" y="85" fill="url(#tdCrimpBottom)" opacity="0.6" width="0.9" height="102.7"/>
        <rect x="295" y="85" fill="url(#tdCrimpBottom)" opacity="0.8" width="0.9" height="102.7"/>
        <rect x="290.5" y="85" fill="url(#tdCrimpBottom)" width="0.9" height="102.7"/>
        <rect x="22" y="105" fill="url(#tdCrimpSeamLeft)" width="6.5" height="90"/>
        <rect x="282" y="105" fill="url(#tdCrimpSeamRight)" width="8" height="90"/>
      </g>
      <path style="display:none;opacity:0.18;clip-path:url(#SVGID_1_);fill:#FFFFFF;" d="M42.2,160c0.5-32.7,0.2-70.2,0-83.9
        c-0.2-16.2-0.3-42.7-0.8-46.2c-0.5-3.7,5.9-6.8,11.1-6.8c-3.5,1.4-7.8,1.9-7.7,8.3c0.3,8.9-0.2,70.5-1.2,100.4
        C43.4,141.8,42.1,163.6,42.2,160z"/>
      <path style="display:none;opacity:0.18;clip-path:url(#SVGID_1_);fill:#FFFFFF;" d="M270,158.8c-0.5-32.7-0.2-70.2,0-83.9
        c0.2-16.2,0.3-42.7,0.8-46.2c0.5-3.7-5.9-6.8-11.1-6.8c3.5,1.4,7.8,1.9,7.7,8.3c-0.3,8.9,0.2,70.5,1.2,100.4
        C268.8,140.5,270,162.3,270,158.8z"/>
      <text v-if="count > 0" style="fill:#fff;font-size:16.3518px" transform="translate(247.667 169.028)">x{{count}}</text>
      <text v-if="packColorsResolved.name" style="fill:#fff;font-size:11px" transform="translate(44.334 166.945)">{{ packColorsResolved.name }}</text>
      <g style="clip-path:url(#SVGID_1_);">
        <rect x="228" y="162.4" style="fill:none;stroke:#FFFFFF;stroke-miterlimit:10;" width="14.7" height="9.6"/>
        <polyline style="fill:none;stroke:#FFFFFF;stroke-miterlimit:10;" points="228,165.2 220.7,165.2 220.7,155.6 235.3,155.6 
          235.3,160.4 		"/>
      </g>
      <!-- Reflections: gloss layer on top of everything (art included) -->
      <g style="clip-path:url(#SVGID_1_);">
        <!-- top and bottom edge shadows -->
        <path fill="url(#tdEdgeTop)" d="M24,0h266.7l-11,13.6c-64,2-180.7,2-244.7,0L24,0z"/>
        <polygon fill="url(#tdEdgeBottom)" points="34.7,177.5 279.2,177.5 290.7,190.7 24,190.7"/>
        <!-- broad soft lights -->
        <rect x="28.5" y="0" :style="`opacity: ${packColorsResolved.lightOpacity || 0.28}`" fill="url(#tdGlossUpperRight)" width="257.7" height="190.7"/>
        <rect x="28.5" y="0" :style="`opacity: ${packColorsResolved.lightOpacity || 0.28}`" fill="url(#tdGlowLeft)" width="60" height="190.7"/>
        <rect x="226.2" y="0" :style="`opacity: ${packColorsResolved.lightOpacity || 0.28}`" fill="url(#tdGlowRight)" width="60" height="190.7"/>
        <!-- crisp rim lines -->
        <path style="fill:none;stroke:url(#tdSeamLeft);stroke-width:1.3;opacity: 0.5;" :style="{ opacity: (packColorsResolved.lightOpacity || 0.28)*2 }" d="M28.5,22v150"/>
        <path style="fill:none;stroke:url(#tdSeamRight);stroke-width:1.3;opacity: 0.5;" :style="{ opacity: (packColorsResolved.lightOpacity || 0.28)*2 }" d="M286.2,22v150"/>
        <path style="fill:none;stroke:url(#tdRimBottom);stroke-width:1.3;opacity: 0.5;" :style="{ opacity: (packColorsResolved.lightOpacity || 0.28)*2 }" d="M28.5,172c0,4,1.6,5.5,6.5,5.5h244.7c4.9,0,6.5-1.5,6.5-5.5"/>
        <path style="fill:none;stroke:url(#tdRimTop);stroke-width:1.4;opacity: 0.5;" :style="{ opacity: (packColorsResolved.lightOpacity || 0.28)*2 }" d="M28.5,22c0-5.5,1.6-8.4,6.5-8.4c64,2,180.7,2,244.7,0
          c4.9,0,6.5,2.9,6.5,8.4"/>
      </g>
    </svg>
  </div>
</template>

<script>

// Per-instance prefix for the color gradients: SVG ids are document-global, so a
// shared id would make every pack on the page paint with the first pack's colors.
let instanceCounter = 0;

// Mutes a "#rrggbb" (or "#rrggbbaa") color in HSL: saturation and lightness drop by the given
// percentage points, clamped at 0 (Sass desaturate/darken style), so grays only get darker.
// Values that aren't hex colors are returned untouched.
function muteHex(hex, saturationDrop = 0.25, lightnessDrop = 0.1) {
  const m = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(hex || "");
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0, s = 0, l = (max + min) / 2;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  s = Math.max(0, s - saturationDrop);
  l = Math.max(0, l - lightnessDrop);
  const a = s * Math.min(l, 1 - l);
  const channel = k => {
    const t = (k + h / 30) % 12;
    const v = l - a * Math.max(-1, Math.min(t - 3, 9 - t, 1));
    return Math.round(v * 255).toString(16).padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}${m[2] || ""}`;
}

export default {
  name: 'BasePackSvg',
  components: {},
  props: {
    packColors: {
      type: Object,
      default() {
        return {
          background: "#212121",
          gBackground1: "#1e1e1e",
          gBackground2: "#353535",
          bottom: "#890a0a",
          gBottom1: "#bd1616",
          gBottom2: "#510033",
          dual: "#bd1616",
          gDual1: "#bd1616",
          gDual2: "#510033",
          name: "CARBON FIBER"
        }
      }
    },
    count: {
      type: Number,
      default: 5
    },
    uuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      gid: `BasePackSvg${++instanceCounter}`
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    packUuid() {
      if (!this.uuid) return null;
      if (!Vue.packs[this.uuid]) debugger;
      return Vue.packs[this.uuid] || null;
    },
    packColorsResolved() {
      if (!this.packUuid) return this.packColors;
      const ui = this.packUuid.uiElements;
      const background = muteHex(`#${ui.backgroundColorTint}`);
      const bottom = muteHex(`#${ui.frontStripColor}`);
      const dual = muteHex(`#${ui.backgroundColorTint2}`);
      return {
        background,
        gBackground1: background,
        gBackground2: background,
        bottom,
        gBottom1: bottom,
        gBottom2: bottom,
        dual,
        gDual1: dual,
        gDual2: dual,
        name: this.packUuid.name,
        lightOpacity: 0.5
      }
    }
  },
  methods: {},
}
</script>

<style>
.BasePackSvg_Blur {
  filter: blur(2px);
}
.BasePackSvg_Blur1 {
  filter: blur(1px);
}
.BasePackSvg_Opac1 {
  opacity: 0.18;
}
.BasePackSvg_Opac2 {
  opacity: 0.5;
}
.BasePackSvg_C_CERAMIC .BasePackSvg_Opac1,
.BasePackSvg_C_ALUMINIUM .BasePackSvg_Opac1,
.BasePackSvg_C_STEEL .BasePackSvg_Opac1 {
  opacity: 0.5;
}
.BasePackSvg_C_CERAMIC .BasePackSvg_Opac2,
.BasePackSvg_C_ALUMINIUM .BasePackSvg_Opac2,
.BasePackSvg_C_STEEL .BasePackSvg_Opac2 {
  opacity: 0.8;
}
.BasePackSvg_C_CARBON_FIBER {

}
.BasePackSvg_C_CERAMIC {

}
.BasePackSvg_C_ALUMINIUM {

}
.BasePackSvg_C_STEEL {

}
.BasePackSvg_C_PLASTIC {

}
.BasePackSvg_C_CERAMIC .BaseFilterDescription_Label,
.BasePackSvg_C_ALUMINIUM .BaseFilterDescription_Label,
.BasePackSvg_C_STEEL .BaseFilterDescription_Label {
  color: #fff;
}
/* .BasePackSvg_C_CERAMIC .BaseFilterDescription_Value,
.BasePackSvg_C_ALUMINIUM .BaseFilterDescription_Value,
.BasePackSvg_C_STEEL .BaseFilterDescription_Value {
  color: var(--cor);
} */
.MainPacks_CustomizePackBox .BaseFilterDescription_Value {
  color: var(--cor);
}
.BasePackSvg_C_PLASTIC .BaseFilterDescription_Value {
  color: #aaa;
}
</style>