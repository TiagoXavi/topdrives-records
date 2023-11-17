<template>
  <div class="BaseLogoSpining_Layout BaseLogoSpining_Splash">
    <div class="BaseLogoSpining_Svg1">
      <div class="BaseLogoSpining_Svg2">
        <svg class="BaseLogoSpining_Svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.7 59.8" style="enable-background:new 0 0 54.7 59.8" xml:space="preserve" overflow="visible">
          <path fill="#FFC717" d="m54.7 55.9-.5 1.3c-1 .8-2.3 1.4-4.1 1.9s-3.4.7-5 .7c-3.9 0-7-.8-9.4-2.3-2.3-1.5-4.5-4-6.6-7.6-.1-.1-.2-.2-.3-.5s-.8-1.5-2.1-3.8-2.5-4.2-3.8-5.5c-1.3-1.4-2.5-2-3.7-2h-1.4v20.6H0V0h27.8c7.6 0 13.4 1.7 17.6 5.2 4.1 3.5 6.2 8.3 6.2 14.4 0 1.7-.3 3.7-1 5.8s-1.9 4.1-3.6 5.9c-1.7 1.8-3.8 3.3-6.2 4.4.8.8 1.7 2 2.7 3.6 1.2 2 2.2 3.3 2.8 3.8.7.5 1.4.8 2.2.8.5 0 1.2-.2 2.2-.6l1.1.6 2.9 12zM27.1 26.4c1.7 0 3.2-.5 4.4-1.5 1.2-1 1.8-2.4 1.8-4.2 0-1.9-.6-3.4-1.8-4.5-1.2-1.1-2.7-1.7-4.4-1.7h-9.2v11.9h9.2z"/>
        </svg>
      </div>
    </div>
    <div class="firework"></div>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseLogoSpining',
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
.BaseLogoSpining_Layout {
  width: 80px;
  display: inline-block;
  position: relative;
}
.BaseLogoSpining_Svg {
  animation: spin 2s linear 2;
  animation-timing-function: ease-in-out;
}
@keyframes spin {
  0% {
    transform: rotateY(0deg);
  }
  30% {
    transform: rotateY(0deg);
  }
  70% {
    transform: rotateY(360deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
.BaseLogoSpining_Svg1 {
  animation: spin1 1s linear 4;
  animation-timing-function: cubic-bezier(0, 0.46, 0.49, 0.99);
  animation-direction: alternate;
}
@keyframes spin1 {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-30px);
  }
  /* 100% {
    transform: translateY(0px);
  } */
}




.firework,
.firework::before,
.firework::after {
  content: "";
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5px;
  aspect-ratio: 1;
  background:
    /* random backgrounds */
    radial-gradient(circle, #ff0 2px, #0000 0) 50% 00%,
    radial-gradient(circle, #ff0 3px, #0000 0) 00% 50%,
    radial-gradient(circle, #ff0 5px, #0000 0) 50% 99%,
    radial-gradient(circle, #ff0 2px, #0000 0) 99% 50%,
    radial-gradient(circle, #ff0 3px, #0000 0) 80% 90%,
    radial-gradient(circle, #ff0 5px, #0000 0) 95% 90%,
    radial-gradient(circle, #ff0 5px, #0000 0) 10% 60%,
    radial-gradient(circle, #ff0 2px, #0000 0) 31% 80%,
    radial-gradient(circle, #ff0 3px, #0000 0) 80% 10%,
    radial-gradient(circle, #ff0 2px, #0000 0) 90% 23%,
    radial-gradient(circle, #ff0 3px, #0000 0) 45% 20%,
    radial-gradient(circle, #ff0 5px, #0000 0) 13% 24%
    ;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  animation: firework 2s linear 2;
  opacity: 0;
  animation-delay: 0.8s;
}
.firework::before {
  transform: translate(-50%, -50%) rotate(25deg) !important; 
}
.firework::after {
  transform: translate(-50%, -50%) rotate(-37deg) !important;
}
@keyframes firework {
  0% { 
    width: 1px;
    opacity: 0;
  }
  4% { 
    opacity: 0;
  }
  5% { 
    opacity: 1; 
  }
  50% { 
    width: 300px; 
    opacity: 0; 
  }
}


</style>