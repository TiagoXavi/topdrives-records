<template>
  <div class="BaseIconSvg_Layout">
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
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="16" y1="7" x2="16" y2="3"/>
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="8.8" y1="10.1" x2="6.2" y2="7.5"/>
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="6" y1="17" x2="2" y2="17"/>
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="9.2" y1="24.3" x2="6.6" y2="26.9"/>
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="16" y1="27" x2="16" y2="30"/>
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="23" y1="24.2" x2="25.6" y2="26.8"/>
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="26" y1="17" x2="30" y2="17"/>
            <line style="fill:none;stroke:#F7DF8E;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" x1="23.4" y1="10.1" x2="26" y2="7.5"/>
        </g>
      </g>
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
.BaseIconSvg_Roll {
  width: 27px;
  margin-left: 3px;
  opacity: 0.7;
}
.BaseIconSvg_Rain {
  width: 29px;
  margin-left: 3px;
}
.BaseIconSvg_Sun {
  width: 29px;
  margin-left: 3px;
}
</style>