<template>
  <div class="Loading_Layout">
    <div role="progressbar" aria-valuemin="0" aria-valuemax="100" class="v-progress-linear BaseLinearProgress_Layout Toolbar_LinearProgress" style="height: 7px;">
      <div class="v-progress-linear__background grey lighten-4" style="height: 7px; opacity: 0; width: 100%;"></div>
      <div class="v-progress-linear__bar">
        <div class="v-progress-linear__bar__indeterminate v-progress-linear__bar__indeterminate--active">
          <div class="v-progress-linear__bar__indeterminate long grey lighten-4"></div>
          <div class="v-progress-linear__bar__indeterminate short grey lighten-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Loading',
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
.Loading_Layout {
  --loading-color: rgb(69, 155, 209);
}

.v-progress-linear {
    overflow: hidden;
    position: relative;
    background-color: transparent;
    height: 7px;
    transition: background-color .5s;
    margin: 0;
    width: 100%;
    left: 0;
    top: 0;
}


.v-progress-linear__bar {
    width: 100%;
    height: inherit;
    position: relative;
    -webkit-transition: 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    transition: 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    z-index: 1;
}
.v-progress-linear__bar {
    width: 100%;
    position: relative;
    z-index: 1;
}
.v-progress-linear__bar, .v-progress-linear__bar__determinate {
    height: inherit;
    -webkit-transition: .2s cubic-bezier(.4,0,.6,1);
    transition: .2s cubic-bezier(.4,0,.6,1);
}


.v-progress-linear__background {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    -webkit-transition: .3s ease-in;
    transition: .3s ease-in;
}
.grey.lighten-4 {
    background-color: var(--loading-color) !important;
    border-color: var(--loading-color) !important;
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}



.v-progress-linear__bar__indeterminate .long,
.v-progress-linear__bar__indeterminate .short {
    height: inherit;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    will-change: left,right;
    width: auto;
    background-color: inherit;
}
.v-progress-linear__bar__indeterminate--active .long {
    animation: indeterminate;
    animation-duration: 1.0s;
    animation-iteration-count: infinite;
}
.v-progress-linear__bar__indeterminate--active .short {
    animation: indeterminate-short;
    animation-duration: 1.0s;
    animation-iteration-count: infinite;
}
.v-progress-linear__bar__indeterminate--active .long,
.v-progress-linear__bar__indeterminate--active .short {
    animation-duration: 2.0s;
}

@keyframes indeterminate {
  0% {
    left: -90%;
    right: 100%;
  }
  55% {
    left: -90%;
    right: 100%;
  }
  100% {
    left: 100%;
    right: -35%;
  }
}

@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  65% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}


</style>
