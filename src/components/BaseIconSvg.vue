<template>
  <div class="BaseIconSvg_Layout" :class="{ BaseIconSvg_Margin: useMargin }">
    <svg v-if="type === 'gold'" class="BaseIconSvg_Gold" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path style="fill:#FBAD14;" d="M30.6,14.8l-6-10.4c-0.5-0.8-1.3-1.3-2.2-1.3h-12c-0.9,0-1.8,0.5-2.2,1.3l-6,10.4
        c-0.5,0.8-0.5,1.8,0,2.6l6,10.4c0.5,0.8,1.3,1.3,2.2,1.3h12c0.9,0,1.8-0.5,2.2-1.3l6-10.4C31,16.5,31,15.6,30.6,14.8z M14.9,22.2
        h2.8l1.6-3.7l-3.4,0l1.1-2.3H23l-3.3,8.5c0,0-3.5,0-6.1,0S9.2,23.5,9.2,20c0-3.7,2.3-8.1,5.2-10.7s8-1.8,8-1.8l1.3,2.6
        c0,0-3.8-0.4-6.6,0.6s-4.8,5.7-4.9,8.7C12,22.5,14.9,22.2,14.9,22.2z"/>
    </svg>
    <svg v-else-if="type === 'cash'" class="BaseIconSvg_Cash" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path style="fill:#37EBAC;" d="M13.2,26.4c-3.1-0.3-4.7-2.2-4.9-5.5l3.9-1c0,2.1,0.9,3.1,2.9,3.1c0.9,0,1.6-0.2,2.1-0.7
        c0.5-0.4,0.8-1,0.9-1.6c0.1-0.7,0-1.2-0.4-1.5c-0.4-0.3-1.2-0.8-2.6-1.3c-1.2-0.5-2.2-0.9-2.9-1.4c-0.7-0.4-1.2-1.1-1.5-1.9
        c-0.3-0.8-0.4-1.7-0.2-2.8c0.2-1.4,0.9-2.7,1.9-3.8c1-1.1,2.5-1.8,4.3-2.1l0.3-1.9H5l-4,24.6h11.8L13.2,26.4z"/>
      <path style="fill:#37EBAC;" d="M19.5,4.2l-0.3,1.9c2.6,0.3,4.1,1.8,4.4,4.6L20.1,12c-0.3-1.9-1.2-2.8-2.5-2.8
        c-0.7,0-1.3,0.2-1.7,0.6c-0.5,0.4-0.8,0.9-0.9,1.5c-0.1,0.6,0,1.1,0.4,1.4c0.3,0.3,1.1,0.7,2.3,1.2c1.3,0.5,2.4,1,3.1,1.5
        c0.7,0.5,1.3,1.1,1.6,1.9c0.3,0.8,0.4,1.8,0.2,2.9c-0.3,1.7-1,3.1-2.2,4.2c-1.2,1.1-2.8,1.8-4.7,2l-0.4,2.4h12.6l4-24.6H19.5z"/>
    </svg>
    <svg v-else-if="type === 'renown'" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path style="fill:#9F8AF9;" d="M16.5,3C9,3,3,9,3,16.5S9,30,16.5,30S30,24,30,16.5S24,3,16.5,3z M25,21l-17,0v-8.8l5.1,4.7l3.4-4.7
        l3.6,4.6l4.8-4.8V21z"/>
    </svg>
    <svg v-else-if="type === 'discord'" class="BaseIconSvg_Discord" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 71 55" fill="none">
      <g clip-path="url(#clip0)">
        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="71" height="55" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <svg v-else-if="type === 'xp'" class="BaseIconSvg_Xp" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 27 21" style="enable-background:new 0 0 27 21;" xml:space="preserve">
      <path style="fill:#15DFFF;" d="M5.6,3.4h3.3l1.1,4.3l4.3-4.3c0,0,3.5,0,8.3,0s4.8,3.4,3.8,5.5c-1,2-2.9,3.8-6.4,3.8c0,0-2.4,0-2.4,0c-0.3,1-1.7,4.8-1.7,4.8l-1-4.8l1-2.3c0,0,2.2,0,4.5,0c1.6,0,2.8-0.9,3.5-2C24,7.3,23.9,6,22.1,6c-3.8,0-6.8,0-6.8,0l-4.7,4.7l1.7,6.9H9l-1-4.2l-4.1,4.2H0.3l7-7.1L5.6,3.4z"/>
    </svg>
    <svg v-else-if="type === 'laurel'" class="BaseIconSvg_Laurel" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 152.4 236.5" viewBox="0 0 152.4 236.5">
      <path d="M5.5 234.8c-13.4-19.6 12-43.1 36.5-60.3-.2 21.7-8.1 40.9-36.5 60.3z"/>
      <path d="M28.7 222.3c9.6 20.7 48.4 10.4 69.9-4.3-12.2-2.2-33.2-13.6-69.9 4.3z"/>
      <path d="M48.5 208.3c-10.4-15.3 9-37.9 25-53.9 2.5 21.4 4 32.7-25 53.9z"/>
      <path d="M67.1 199.4c9.5 17.5 41.5 4.2 57.8-13.4-16.5 0-30.8-1.5-57.8 13.4z"/>
      <path d="M82.4 184.4c-9.4-10.7-2.6-26.9 9.6-50 .1-.1.1-.2.1-.2.8 1.5 2.7 5.2 4.3 9.9.3 1.3 1.6 4.3 2.4 10.8-.1.8.4 2.2-.3 5.2-2.1 6.7-6.9 13.9-16.1 24.3z"/>
      <path d="M97 174.1c13.6 14.2 39-6.5 48.4-25.9-5.2 2.2-17.6 4.9-26.2 9.3-.4.2-.8.5-1.3.9-4.3 3-6.4 5.6-20.9 15.7z"/>
      <path d="M107.7 152.1c-11.8-9.6-8.5-21.4-5.3-44.9 4.2 4.7 16.2 15.8 11.4 29-1.5 5.2-1.5 6.4-6.1 15.9z"/>
      <path d="M116 147.9c13.9 8.9 30.3-15.1 33-35.2-13 7.6-22.9 18.4-33 35.2z"/>
      <path d="M123.8 122.6c-7.3-1.8-13-9.7-14.8-26-.2-1.2-.2-1.3-1-6.6-.1-.7-.1-1-.6-4 0-.4-.1-.6-.1-.6 1.8 1 10.2 5.5 14.7 11.8.3.4 1.1 1.6 1.8 4.1.4 4.5 1.7 4.2.3 19.6-.1.3-.1.7-.3 1.7z"/>
      <path d="M129.7 115.7c11.2 4.4 20.3-12.8 20.8-26.9 0-1 .2-2.7.1-6.2-8.6 7.7-15.8 18.3-20.9 33.1z"/>
      <path d="M130.2 96.1c-5.3.5-12.5-9.5-14-18-1-3.3-1.8-6.4-3.5-13.3 1.3.6 2.1.8 5.6 2.6 1.9 1.3 1.8.7 6.5 4.5.9.8 1.7 1.4 3.1 3.5.4.9 1.1 2.3 1.7 5.6.1.3.1.5.2.8.1.8.2 1 .4 3.4 0 .3 0 .6.1.9.1 2.6.3 5.2-.1 10z"/>
      <path d="M134.2 87.3c4.9 1.6 11.6-4 12.9-12.4.3-2.1 1-6.3.3-12.9-.2-1-.6-4.5-1.8-8.6-1.4 2.6-4.5 7.5-7.3 12.7l-.3.6c-1 1.8-1.5 4.6-1.9 8.9-.1.9-.3 2.6-.7 5.3 0 .1 0 .2-.1.4-.2 1.3-.5 3.2-1.1 6z"/>
      <path d="M130.8 71.2c-8.4.7-14-11.4-18.3-21.9 5.5 1.7 14 3.9 15.8 11.6.1.3.4 1 .8 2.6.4 1.5.6 1.7 1.3 5.8.2.4.3.4.4 1.9z"/>
      <path d="M132.8 64.2c7.7.4 11.5-14.1 8.4-23.4-1.1-4.3-.9-4.9-4.3-12.8-.8 4-6.9 13.8-5.1 22.4.3 2.6.9 8.7 1 13.8z"/>
      <path d="M127.1 48c-8.3 2.4-15-8.3-19.9-16.1 2.4.6 9.1.7 13.3 4.5.2.2.4.4.6.7 2.1 2.6 4.1 6 6 10.9z"/>
      <path d="M127.5 41c9.4-3.5 6.3-20.3-1.7-31.8-3.1 9.5-3 19.2 1.7 31.8z"/>
      <path d="M120.4 30.1c-.1-.1-.4 0-2.8-1-9.4-4.5-15.6-14.8-21.4-27.4 8.4 4.2 19.5 9.6 22.7 23.1.3 1 .8 2.5 1.5 5.3z"/>
    </svg>
    <div v-else-if="type === 'baloon'">
      <svg class="BaseIconSvg_Baloon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 87.3 229.1" viewBox="0 0 87.3 229.1">
        <linearGradient id="a" x1="44.934" x2="44.934" y1="122.484" y2="116.302" gradientUnits="userSpaceOnUse">
          <stop offset="0" style="stop-color:#d40613"/>
          <stop offset="1" style="stop-color:#d40651"/>
        </linearGradient>
        <path d="M50.6 121.9s-6.5-2.4-11.3 0c0 0 6.7 1.3 11.3 0z" style="fill:url(#a)"/>
        <path d="M44.8 114.5c-.1 0-1.3-.2-1.4-.2h-.1c2.4 20.6 5.1 45.2 3.1 60.7-3.2 25.7-2.4 53.1-2.4 53.1l.4-.3s-.4-18.2 1.2-34.6c1.6-16.4 3.7-27.9 1.7-51-.7-9.1-1.5-17.6-2.5-27.7z" style="fill:#7a707b"/>
        <linearGradient id="b" x1="44.934" x2="44.934" y1="121.934" y2="116.302" gradientUnits="userSpaceOnUse">
          <stop offset="0" style="stop-color:#d40613"/>
          <stop offset="1" style="stop-color:#d40651"/>
        </linearGradient>
        <path d="M39.3 121.9s6.8-.7 11.3 0c0 0-1-5.6-5.6-5.6s-5.7 5.6-5.7 5.6z" style="fill:url(#b)"/>
        <radialGradient id="c" cx="43.647" cy="59.052" r="50.535" fx="32.698" fy="37.262" gradientUnits="userSpaceOnUse">
          <stop offset=".018" style="stop-color:#ff5458"/>
          <stop offset=".183" style="stop-color:#fc4a4e"/>
          <stop offset=".465" style="stop-color:#f42f35"/>
          <stop offset=".68" style="stop-color:#ed161d"/>
          <stop offset=".914" style="stop-color:#bf0000"/>
        </radialGradient>
        <path d="M86.3 59.1c0 32.1-19.1 58.1-42.6 58.1S1 91.1 1 59.1 20.1 1 43.6 1s42.7 26 42.7 58.1z" style="fill:url(#c)"/>
        <linearGradient id="d" x1="135.743" x2="196.758" y1="59.145" y2="117.974" gradientTransform="matrix(.8571 0 0 .889 -104.3 -35.42)" gradientUnits="userSpaceOnUse">
          <stop offset="0" style="stop-color:#ffe3ff;stop-opacity:.4"/>
          <stop offset="1" style="stop-color:#fff;stop-opacity:0"/>
        </linearGradient>
        <path d="M55.3 87c24.6-3 29.4-37.9 26.1-51.1-6-20.6-21.9-34.5-39-34.5-23.5 0-40.6 29.4-40.6 51.4 0 10 1.2 15.7 7.9 22.5C15.4 81 30.7 90 55.3 87z" style="fill:url(#d)"/>
        <radialGradient id="e" cx="45.419" cy="104.724" r="25.026" gradientUnits="userSpaceOnUse">
          <stop offset=".018" style="stop-color:#e85738"/>
          <stop offset=".153" style="stop-color:#e44d33"/>
          <stop offset=".383" style="stop-color:#da3227"/>
          <stop offset=".679" style="stop-color:#ca0613"/>
          <stop offset=".68" style="stop-color:#ca0613"/>
          <stop offset="1" style="stop-color:#d40651"/>
        </radialGradient>
        <path d="M43.6 117.1c14.5 0 27.2-9.8 34.9-24.8-17.3 32.5-51 26.9-66.3 6 7.9 11.6 19 18.8 31.4 18.8z" style="opacity:.49;fill:url(#e)"/>
      </svg>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseIconSvg',
  components: {},
  props: {
    type: {
      type: String,
      default: "roll"
    },
    useMargin: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
.BaseIconSvg_Layout {
  display: flex;
}
.BaseIconSvg_Margin > svg:not(.BaseIconSvg_Laurel) {
  margin-left: 3px;
}
.BaseIconSvg_Discord {
  width: 100%;
}
.BaseIconSvg_Roll {
  width: 27px;
  opacity: 0.7;
}
.BaseIconSvg_Clearance {
  width: 27px;
  opacity: 0.7;
}
.BaseIconSvg_Rain {
  width: 27px;
}
.BaseIconSvg_Sun {
  width: 27px;
}
.BaseIconSvg_Asphalt {
  width: 27px;
}
.BaseIconSvg_Dirt {
  width: 27px;
}
.BaseIconSvg_Grass {
  width: 27px;
}
.BaseIconSvg_Gravel {
  width: 27px;
}
.BaseIconSvg_Ice {
  width: 27px;
}
.BaseIconSvg_Sand {
  width: 27px;
}
.BaseIconSvg_Snow {
  width: 27px;
}
.BaseIconSvg_GravelPath {
  fill:none;stroke:#E5C985;stroke-width:1.6;stroke-miterlimit:10;
}
.BaseIconSvg_IcePath {
  fill:none;stroke:#C0FFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;
}
.BaseIconSvg_SunPath {
  fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;
}
.BaseIconSvg_SnowPath {
  fill:none;stroke:#FFFFFF;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;
}
.BaseIconSvg_Gold {
  
}
.BaseIconSvg_Cash {
  
}
</style>