<template>
  <div class="BaseIconSvg_Layout" :class="{ BaseIconSvg_Margin: useMargin }">
    <svg v-if="type === 'roll'" title="Rolling track" class="BaseIconSvg_Roll" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 27 21" style="enable-background:new 0 0 27 21;" xml:space="preserve">
      <g>
        <path style="fill:none;stroke:#FFFFFF;stroke-width:1.7;stroke-linecap:round;stroke-miterlimit:10;" d="M18.7,7.8
          C17.6,4.4,14.4,2,10.6,2C5.8,2,2,5.8,2,10.6s3.8,8.6,8.6,8.6c0.8,0,1.6-0.1,2.4-0.3"/>
        <path style="fill:none;stroke:#FFFFFF;stroke-width:1.7;stroke-miterlimit:10;" d="M10.6,5.2c-3,0-5.4,2.4-5.4,5.4S7.6,16,10.6,16
          s5.4-2.4,5.4-5.4S13.6,5.2,10.6,5.2z"/>
          <line style="fill:none;stroke:#D8634A;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="25" y1="13" x2="18.4" y2="13"/>
          <line style="fill:none;stroke:#D8634A;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="22.1" y1="10" x2="19.1" y2="10"/>
          <line style="fill:none;stroke:#D8634A;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="22.1" y1="16" x2="16.9" y2="16"/>
          <line style="fill:none;stroke:#D8634A;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="19.9" y1="19" x2="15.4" y2="19"/>
        <path style="fill:#FFFFFF;" d="M10.8,7.3l0.5,2.2c0,0.1,0.1,0.2,0.2,0.2l2.2-0.2c0.2,0,0.3,0.3,0.1,0.4L12,10.9
          c-0.1,0.1-0.1,0.2-0.1,0.3l0.9,2c0.1,0.2-0.2,0.4-0.4,0.3l-1.7-1.5c-0.1-0.1-0.2-0.1-0.3,0l-1.7,1.5c-0.2,0.2-0.4,0-0.4-0.3l0.9-2
          c0-0.1,0-0.2-0.1-0.3L7.3,9.8C7.1,9.7,7.2,9.4,7.4,9.4l2.2,0.2c0.1,0,0.2-0.1,0.2-0.2l0.5-2.2C10.4,7,10.8,7,10.8,7.3z"/>
      </g>
    </svg>
    <svg v-else-if="type === 'rain'" class="BaseIconSvg_Rain" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <g>
        <path style="fill:none;stroke:#FFFFFF;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" d="M24.5,21.5
          c2.7-1.3,4.5-4,4.5-7.2c0-4.4-3.6-8-8-8c-3.2,0-6,1.9-7.3,4.7h-3.7c-3.1,0-5.7,2.5-5.7,5.7c0,2.6,1.7,4.7,4.1,5.4"/>
          <line style="fill:none;stroke:#67C3E7;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" x1="17.8" y1="18.2" x2="14.8" y2="29.7"/>
          <line style="fill:none;stroke:#67C3E7;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" x1="21.7" y1="18.2" x2="19.6" y2="26.3"/>
          <line style="fill:none;stroke:#67C3E7;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" x1="13.7" y1="18.2" x2="11.7" y2="26.1"/>
      </g>
    </svg>
    <svg v-else-if="type === 'sun'" class="BaseIconSvg_Sun" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <g>
        <circle style="fill:none;stroke:#F7DF8E;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" cx="16" cy="17" r="6"/>
        <g>
            <line class="BaseIconSvg_SunPath" x1="16" y1="7" x2="16" y2="3"/>
            <line class="BaseIconSvg_SunPath" x1="8.8" y1="10.1" x2="6.2" y2="7.5"/>
            <line class="BaseIconSvg_SunPath" x1="6" y1="17" x2="2" y2="17"/>
            <line class="BaseIconSvg_SunPath" x1="9.2" y1="24.3" x2="6.6" y2="26.9"/>
            <line class="BaseIconSvg_SunPath" x1="16" y1="27" x2="16" y2="30"/>
            <line class="BaseIconSvg_SunPath" x1="23" y1="24.2" x2="25.6" y2="26.8"/>
            <line class="BaseIconSvg_SunPath" x1="26" y1="17" x2="30" y2="17"/>
            <line class="BaseIconSvg_SunPath" x1="23.4" y1="10.1" x2="26" y2="7.5"/>
        </g>
      </g>
    </svg>
    <svg v-else-if="type === 'asphalt'" class="BaseIconSvg_Asphalt" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path style="fill:none;stroke:#FFFFFF;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;stroke-dasharray:4.4;" d="
        M9.6,24.4c0.5-7.6,6.5-13.7,14.1-14.3"/>
      <path style="fill:none;stroke:#7C7C7C;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="
        M24.9,4.6C13.4,4.6,4.1,14,4.1,25.5v3H15v-3c0-5.5,4.4-9.9,9.9-9.9h3.2V4.6H24.9z"/>
    </svg>
    <svg v-else-if="type === 'dirt'" class="BaseIconSvg_Dirt" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path style="fill:none;stroke:#c34f1c;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" d="M22.1,22.2L15.5,7.7
        c-0.6-1.3-2.5-1.3-3.1,0L4.9,24.4c-0.6,1.3,0.4,2.8,1.8,2.8h15h2h3.4c1.5,0,2.4-1.5,1.8-2.8L25,15.7c-0.6-1.3-2.5-1.3-3.1,0
        l-1.4,3.2"/>
    </svg>
    <svg v-else-if="type === 'grass'" class="BaseIconSvg_Grass" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path style="fill:none;stroke:#59B510;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" d="
        M8.6,28.5c0.1-5.7-1.9-7.4-5.1-13.3c3,1.8,5.3,3.2,6.7,4c-0.5-2.4-2.5-8.5-4.3-11.2c2.2,1.1,7,7,7.7,10.1c0.6-2.9,2.7-7.4,3.6-9.5
        c-0.4,3.5,0.9,6.6,1.3,7.8c0.9-1.3,4.8-8.9,4.8-11.7c0.6,2.7-1.3,14.3-2,17.3c1.3-3.1,5.7-6.4,8.4-6.7c-1.4,1.2-4,7.4-3.6,13.4"/>
    </svg>
    <svg v-else-if="type === 'gravel'" class="BaseIconSvg_Gravel" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path class="BaseIconSvg_GravelPath" d="M14.1,5.3c1.1-0.9,5.9-1.4,5,1.3c-1.2,3.4-0.8,7.1-4.8,4.8C12.6,11.1,13.2,6.8,14.1,5.3z"/>
      <path class="BaseIconSvg_GravelPath" d="M23,6.8c2-1.9,7.7,0.9,3.8,3.2C25.2,9,22.1,10.3,23,6.8z"/>
      <path class="BaseIconSvg_GravelPath" d="M5.9,6.1C8.8,4.7,14,8.4,7.5,10c-0.5,0-1-0.2-1.5-0.4C5.7,9.2,4.7,7.5,5.9,6.1z"/>
      <path class="BaseIconSvg_GravelPath" d="M15.2,15.7c1.9-1.1,6.5,3.7,2.5,5.1C12.3,21.8,10.1,20,15.2,15.7z"/>
      <path class="BaseIconSvg_GravelPath" d="M6.7,12.7c0.8-0.6,5,1.3,3.9,3.7c-2.1,2.1-9,4-6.7-2.9C4.8,13.2,5.8,13,6.7,12.7z"/>
      <path class="BaseIconSvg_GravelPath" d="M22.5,12.6c1.7-0.5,7.7,0.4,6.5,4c-1.3,0.3-3.2,1-5.4,1.4C22.5,17.1,20.1,14.7,22.5,12.6z"/>
      <path class="BaseIconSvg_GravelPath" d="M26.3,20.6c0.4-0.1,0.9-0.3,1.3-0.2C32.3,32.3,11.6,25.2,26.3,20.6z"/>
      <path class="BaseIconSvg_GravelPath" d="M5,21.9c0-0.3,0.1-0.5,0.3-0.7C15.2,21.8,4.5,31.6,5,21.9z"/>
      <path class="BaseIconSvg_GravelPath" d="M15.2,24.4c1.3-0.5,3.1,0.7,3.3,2.9C16.9,28.4,5.8,28.6,15.2,24.4z"/>
    </svg>
    <svg v-else-if="type === 'ice'" class="BaseIconSvg_Ice" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path class="BaseIconSvg_IcePath" d="M15.5,5.3l-8.3,4.8
        c-0.6,0.4-1,1.1-1,1.8l0,9.6c0,0.7,0.4,1.4,1,1.8l8.3,4.8c0.6,0.4,1.4,0.4,2.1,0l8.3-4.8c0.6-0.4,1-1.1,1-1.8l0-9.6
        c0-0.7-0.4-1.4-1-1.8l-8.3-4.8C16.9,4.9,16.1,4.9,15.5,5.3z"/>
      <g>
        <polyline class="BaseIconSvg_IcePath" points="6.3,11 16.5,16.8 
          26.7,11 	"/>
          <line class="BaseIconSvg_IcePath" x1="16.5" y1="16.8" x2="16.5" y2="28.4"/>
      </g>
    </svg>
    <svg v-else-if="type === 'sand'" class="BaseIconSvg_Sand" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <path style="fill:none;stroke:#F9AA0D;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" d="M20.4,21.1c0,0,0.6,0,3.1,0
        c4,0,5.4-1.5,5.4-5.4c0-1.7,0-5.3,0-5.3C29,9.1,27.9,8,26.6,8h0c-1.3,0-2.4,1.1-2.4,2.4c0,0,0,4.1,0,5.2c0,0.5-0.2,1-0.8,1h-3"/>
      <path style="fill:none;stroke:#F9AA0D;stroke-width:1.8;stroke-linecap:round;stroke-miterlimit:10;" d="M12.6,24.7c0,0-0.6,0-3.1,0
        c-4,0-5.4-1.5-5.4-5.4c0-1.7,0-3.5,0-3.5c0-1.3,1.1-2.4,2.4-2.4h0c1.3,0,2.4,1.1,2.4,2.4c0,0,0,2.3,0,3.4c0,0.5,0.2,1,0.8,1h3"/>
      <path style="fill:none;stroke:#F9AA0D;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" d="M18.8,29.3h-4.6
        c-0.7,0-1.2-0.5-1.2-1.2V8.8c0-1.9,1.6-3.5,3.5-3.5h0c1.9,0,3.5,1.6,3.5,3.5v19.3C20,28.8,19.5,29.3,18.8,29.3z"/>
    </svg>
    <svg v-else-if="type === 'snow'" class="BaseIconSvg_Snow" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve">
      <line class="BaseIconSvg_SnowPath" x1="16.5" y1="3.1" x2="16.5" y2="29.5"/>
      <line class="BaseIconSvg_SnowPath" x1="5" y1="22.9" x2="28" y2="9.7"/>
      <line class="BaseIconSvg_SnowPath" x1="28" y1="22.9" x2="5" y2="9.7"/>
      <polyline class="BaseIconSvg_SnowPath" points="24.3,8 24.3,11.8 27.6,13.7 "/>
      <polyline class="BaseIconSvg_SnowPath" points="27.6,18.9 24.3,20.8 24.3,24.6 "/>
      <polyline class="BaseIconSvg_SnowPath" points="19.8,27.2 16.5,25.3 13.2,27.2 "/>
      <polyline class="BaseIconSvg_SnowPath" points="8.7,24.6 8.7,20.8 5.4,18.9 "/>
      <polyline class="BaseIconSvg_SnowPath" points="5.4,13.7 8.7,11.8 8.7,8 "/>
      <polyline class="BaseIconSvg_SnowPath" points="13.2,5.3 16.5,7.3 19.8,5.3 "/>
    </svg>
    <svg v-else-if="type === 'gold'" class="BaseIconSvg_Gold" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
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
.BaseIconSvg_Margin > svg {
  margin-left: 3px;
}
.BaseIconSvg_Roll {
  width: 27px;
  opacity: 0.7;
}
.BaseIconSvg_Rain {
  width: 29px;
}
.BaseIconSvg_Sun {
  width: 29px;
}
.BaseIconSvg_Asphalt {
  width: 29px;
}
.BaseIconSvg_Dirt {
  width: 29px;
}
.BaseIconSvg_Grass {
  width: 29px;
}
.BaseIconSvg_Gravel {
  width: 29px;
}
.BaseIconSvg_Ice {
  width: 29px;
}
.BaseIconSvg_Sand {
  width: 29px;
}
.BaseIconSvg_Snow {
  width: 29px;
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