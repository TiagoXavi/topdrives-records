<template>
  <svg v-if="flag === 'AT'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <g>
      <path fill="#fff" d="M640 480H0V0h640z"/>
      <path fill="#df0000" d="M640 480H0V319.997h640zM640 160.125H0V.122h640z"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'AU'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <g stroke-width="1pt">
      <path fill="#006" d="M0 0h640v480H0z"/>
      <path d="M0 0v27.95L307.037 250h38.647v-27.95L38.647 0H0zm345.684 0v27.95L38.647 249.999H0v-27.95L307.037 0h38.647z" fill="#fff"/>
      <path d="M144.035 0v249.999h57.614V0h-57.614zM0 83.333v83.333h345.684V83.333H0z" fill="#fff"/>
      <path d="M0 100v50h345.684v-50H0zM155.558 0v249.999h34.568V0h-34.568zM0 249.999l115.228-83.333h25.765L25.765 249.999H0zM0 0l115.228 83.333H89.463L0 18.634V0zm204.691 83.333L319.919 0h25.765L230.456 83.333h-25.765zm140.993 166.666-115.228-83.333h25.765l89.463 64.7v18.633z" fill="#c00"/>
      <g fill="#fff">
        <path d="m299.762 392.523-43.653 3.795 6.014 43.406-30.187-31.764-30.186 31.764 6.014-43.406-43.653-3.795 37.678-22.364-24.243-36.494 40.97 15.514 13.42-41.712 13.42 41.712 40.97-15.514-24.242 36.494zM486.528 432.528l-10.537-15.854 17.808 6.742 5.825-18.125 5.825 18.125 17.808-6.742-10.537 15.854 16.369 9.718-18.964 1.65 2.616 18.851-13.117-13.794-13.117 13.794 2.616-18.85-18.964-1.651zM486.528 150.432l-10.537-15.854 17.808 6.742 5.825-18.125 5.825 18.125 17.808-6.742-10.537 15.854 16.369 9.718-18.964 1.65 2.616 18.851-13.117-13.794-13.117 13.794 2.616-18.85-18.964-1.651zM380.742 265.033l-10.537-15.853 17.808 6.742 5.825-18.125 5.825 18.125 17.808-6.742-10.537 15.853 16.369 9.719-18.964 1.65 2.616 18.85-13.117-13.794-13.117 13.795 2.616-18.851-18.964-1.65zM580.586 236.824l-10.558-15.854 17.822 6.742 5.782-18.125 5.854 18.125 17.772-6.742-10.508 15.854 16.362 9.718-18.971 1.65 2.609 18.851-13.118-13.794-13.117 13.794 2.61-18.85-18.936-1.651zM541.938 319.936l-10.367 6.425 2.913-11.841-9.316-7.863 12.165-.896 4.605-11.291 4.606 11.29 12.165.897-9.316 7.863 2.912 11.841z"/>
      </g>
    </g>
  </svg>
  <svg v-else-if="flag === 'DE'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <g stroke-width="1pt">
      <path fill="#ffe600" d="M0 320.001h640v160H0z"/>
      <path d="M0 0h640v160H0z"/>
      <path fill="red" d="M0 160h640v160.001H0z"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'FR'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <g stroke-width="1pt">
      <path fill="#fff" d="M0 0h640v480H0z"/>
      <path fill="#00267f" d="M0 0h213.337v480H0z"/>
      <path fill="#f31830" d="M426.662 0H640v480H426.662z"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'GB'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <path style="fill:#006" d="M0 0h640v480H0z"/>
    <path style="fill:#fff" d="M0 346.3v107.4l320-160L212.7 240zM640 453.7V346.3L427.3 240 320 293.7zM640 26.3l-320 160L427.3 240 640 133.7zM0 26.3v107.4L212.7 240 320 186.3z"/>
    <path style="fill:#fff" d="M0 160v160h240v160h160V320h240V160H400V0H240v160z"/>
    <g>
      <path style="fill:#c00" d="M0 192v96h272v192h96V288h272v-96H368V0h-96v192z"/>
      <path style="fill:#c00" d="m480 160 160-80V44.2L408.5 160zM0 435.8 231.6 320H160L0 400zM640 400v-35.8L551.6 320H480zM0 80v35.8L88.5 160H160z"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'HR'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 480" style="enable-background:new 0 0 640 480" xml:space="preserve">
    <g>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff" d="M-148.9 135.7h936.3v170.1h-936.3z"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#003e9f" d="M-148 289.8h938.2V480H-148z"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#d61517" d="M-150.1 0h939.7v159.5h-939.7z"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff;stroke:#e5141d;stroke-width:1.327;stroke-linecap:round;stroke-miterlimit:4.9784" d="M242.6 155.2c24.5-8.7 51.7-13.4 78.3-13.5 26.6-.1 53.7 4.1 80.5 13.7l19.9-40.2-14-24.4s-25 10.3-25.2 10.3c-.2 0-17.6-19.2-17.6-19.2l-22.4 13.5-21-16.1-19.8 15.8-23.1-13.3-16.8 20L236.2 91l-13.5 24.2 19.9 40h0z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#00a7bd;stroke:#0084fd;stroke-width:.3317;stroke-miterlimit:4.9784" d="m370.5 144 11.4-40.4 24.5-9.9 12.9 21.6-18.5 37.8c-10.7-4.2-16.4-6-30.3-9.1zM306.1 139.6l-3.9-41.8 19.4-15.4L342 97.8l-3.6 41.9c-11.2-.6-19.2-.6-32.3-.1z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#00a7bd;stroke:#0084fd;stroke-width:.3317;stroke-miterlimit:4.9784;stroke-opacity:.9961" d="m243.6 153.2-18.1-38.3 12.1-21.2 25.1 10.9 10.6 39.5c-11.5 2.4-17.5 4.3-29.7 9.1z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#001070;stroke:#001071;stroke-width:.3317;stroke-miterlimit:4.9784;stroke-opacity:.9961" d="m338.7 139.6 3.6-41.9 22.2-12.8 17.2 18.6-11.4 40.4c-11.2-2.3-17.5-3.2-31.6-4.3z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#011171;fill-opacity:.9961;stroke:#011171;stroke-width:.3317;stroke-miterlimit:4.9784" d="M273.6 144 263 104.4l16.2-19.7 22.7 13 3.9 42c-11.6.8-19.1 2-32.2 4.3z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff;stroke:#e5141d;stroke-width:1.327;stroke-miterlimit:4.9784" d="M241.5 156.6h161.2v103.3c-4.1 40.2-42.8 70.3-78.1 70.1-38.2 1.7-80.3-29.6-83.4-70.4l.3-103z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#d61517;stroke:#e5141d;stroke-width:1.2717;stroke-miterlimit:4.9784" d="M244.8 160.2h154.4v99c-3.9 38.6-41 67.4-74.9 67.2-36.6 1.6-77-28.3-79.9-67.5l.4-98.7z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff" d="M337.7 160.7h29.8V193h-29.8zM276.3 160.7h29.8V193h-29.8zM245.2 194h30.2v31.5h-30.2zM307.2 194h29.5v31.5h-29.5zM368.3 194h30.4v31.5h-30.4zM337.7 226.5h29.8v32h-29.8zM276.3 226.5h29.8v32h-29.8zM307.2 259.5h29.5v32h-29.5z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
      <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff;stroke:#fff;stroke-width:.3317;stroke-miterlimit:4.9784" d="M368.5 259.8v31.4h18.1c8.3-12.1 11.1-23.8 11.9-31.5-.1.1-29.9.1-30 .1zM337.9 292.8v31.6c12.9-2.7 23.4-8.8 29.4-13.3v-18.3h-29.4zM276.5 292.7v17.8c10.1 7.4 21.7 11.7 29.4 13.4v-31.2h-29.4zM245.3 259.8c1 12.4 6.2 23.8 11.9 31.6h18v-31.5l-29.9-.1z" transform="translate(-78.769 -50.054) scale(1.2446)"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'IT'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <g stroke-width="1pt">
      <path fill="#fff" d="M0 0h640v479.997H0z"/>
      <path fill="#005700" d="M0 0h213.331v479.997H0z"/>
      <path fill="#fc0000" d="M426.663 0h213.331v479.997H426.663z"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'JP'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <defs>
      <clipPath id="a" clipPathUnits="userSpaceOnUse">
        <path fill-opacity=".67" d="M-88.001 32h640v480h-640z"/>
      </clipPath>
    </defs>
    <g clip-path="url(#a)" transform="translate(88.001 -32)" stroke-width="1pt">
      <path fill="#fff" d="M-128 32h720v480h-720z"/>
      <circle transform="translate(-168.44 8.618) scale(.76554)" cy="344.05" cx="523.08" fill="#d30000" r="194.93"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'NL'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <g stroke-width="1pt" transform="scale(1.25 .9375)">
      <rect rx="0" ry="0" height="509.76" width="512" fill="#fff"/>
      <rect rx="0" ry="0" height="169.92" width="512" y="342.08" fill="#21468b"/>
      <path fill="#ae1c28" d="M0 0h512v169.92H0z"/>
    </g>
  </svg>
  <svg v-else-if="flag === 'SE'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <path style="fill:#003f73" d="M0 0h640v480H0z"/>
    <path style="fill:#fc0" d="M271.6 192.2V0h-96v192.2H0v96h175.6V480h96V288.2H640v-96z"/>
  </svg>
  <svg v-else-if="flag === 'US'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640.2 480">
    <path style="fill:#fff" d="M.2 0h640v480.1H.2z"/>
    <path style="fill:#bd3d44" d="M0 0h640.2v36.9H0zM0 73.8h640.2v36.9H0zM0 147.7h640.2v36.9H0zM0 221.5h640.2v36.9H0zM0 295.4h640.2v36.9H0zM0 369.2h640.2v36.9H0zM0 443.1h640.2V480H0z"/>
    <path style="fill:#192f5d" d="M0 0h309v258.5H0z"/>
    <g>
      <circle style="fill:#fff" cx="36.9" cy="35.6" r="14.9"/>
      <circle style="fill:#fff" cx="95.1" cy="35.6" r="14.9"/>
      <circle style="fill:#fff" cx="153.4" cy="35.6" r="14.9"/>
      <circle style="fill:#fff" cx="211.6" cy="35.6" r="14.9"/>
      <circle style="fill:#fff" cx="269.9" cy="35.6" r="14.9"/>
      <g>
        <circle style="fill:#fff" cx="36.9" cy="97.6" r="14.9"/>
        <circle style="fill:#fff" cx="95.1" cy="97.6" r="14.9"/>
        <circle style="fill:#fff" cx="153.4" cy="97.6" r="14.9"/>
        <circle style="fill:#fff" cx="211.6" cy="97.6" r="14.9"/>
        <circle style="fill:#fff" cx="269.9" cy="97.6" r="14.9"/>
      </g>
      <g>
        <circle style="fill:#fff" cx="36.9" cy="159.7" r="14.9"/>
        <circle style="fill:#fff" cx="95.1" cy="159.7" r="14.9"/>
        <circle style="fill:#fff" cx="153.4" cy="159.7" r="14.9"/>
        <circle style="fill:#fff" cx="211.6" cy="159.7" r="14.9"/>
        <circle style="fill:#fff" cx="269.9" cy="159.7" r="14.9"/>
      </g>
      <g>
        <circle style="fill:#fff" cx="36.9" cy="221.8" r="14.9"/>
        <circle style="fill:#fff" cx="95.1" cy="221.8" r="14.9"/>
        <circle style="fill:#fff" cx="153.4" cy="221.8" r="14.9"/>
        <circle style="fill:#fff" cx="211.6" cy="221.8" r="14.9"/>
        <circle style="fill:#fff" cx="269.9" cy="221.8" r="14.9"/>
      </g>
    </g>
  </svg>
  <svg v-else-if="flag === 'BR'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#229e45" d="M0 0h640v480H0z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#f8e509" d="M261.7 455.7 569 256.3l-309.1-200-308.3 200.5 310.1 198.9z" transform="translate(64.633 -11.162) scale(.9811)"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#2b49a3" d="M395.6 256c0 71.7-58.2 129.8-130 129.8s-130-58.1-130-129.8 58.2-129.8 130-129.8 130 58.1 130 129.8z" transform="translate(64.633 -11.162) scale(.9811)"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff" d="M387 302.7c2-5.2 4.5-13 5.9-20.2-69-60.7-146-91.7-243.3-85.3-3.5 6.7-6.3 13.7-8.6 21.3 115.3-11 199.7 40 246 84.2z" transform="translate(64.633 -11.162) scale(.9811)"/>
  </svg>
  <svg v-else-if="flag === 'CN'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <path style="fill:#de2910" d="M0 0h640v480H0z"/>
    <path style="fill:#ffde00" d="M77.7 178.2 120 48l42.3 130.2L51.5 97.8h137zM263.9 50.1l-44.5 10.2 30-34.4-4 45.5-23.5-39.2zM309.2 107.2l-45-7.8 41-20.1-21.3 40.3-6.5-45.1zM302.8 186.9l-37.9-25.5 45.6-1.6-35.9 28.1 12.5-43.9zM246.3 239.1l-25-38.1 42.7 16.1-44.1 12.1 28.6-35.7z"/>
  </svg>
  <svg v-else-if="flag === 'AE'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:red" d="M0 0h190v480H0z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd" d="M190 318.8h450V480H190z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff" d="M190 161.9h450v159H190z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#009a00" d="M190 0h450v161.9H190z"/>
  </svg>
  <svg v-else-if="flag === 'ZA'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff" d="M0 .1h640v480H0z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#229e45" d="M36.6.1H0V480h36.6L319 288.9h321v-97.7H319z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fc0" d="M0 384.8 214.3 240 0 95.4z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd" d="m0 347.1 159.3-107L0 133.1z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#00c" d="m92.1 480.1 237.7-160H640v160H92.1z"/>
    <path style="fill-rule:evenodd;clip-rule:evenodd;fill:red" d="M76.8.1H640v160H329.7S80-1.5 76.8.1z"/>
  </svg>
  <svg v-else-if="flag === 'CH'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
    <rect id="rect171" fill-rule="evenodd" clip-rule="evenodd" fill="#FA000B" width="640" height="480"/>
    <polygon id="rect554" fill-rule="evenodd" clip-rule="evenodd" fill="#808080" points="328,177.2 328.8,177.2 328.8,177.2 "/>
    <rect id="rect557" x="170" y="195" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="300" height="90"/>
    <rect id="rect565" x="275" y="90" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="90" height="300"/>
  </svg>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseFlag',
  components: {
    // BaseDetalheHeader
  },
  props: {
    flag: {
      type: String,
      required: true
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
</style>