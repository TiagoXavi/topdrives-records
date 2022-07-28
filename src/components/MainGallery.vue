<template>
  <div class="MainGallery_Layout">
    <div class="MainGallery_Box">
      <div
      v-for="car in all_cars"
      class="MainGallery_Item"
      :style="`${carPhoto(car)}`"
      @click="click(car)">
      <!-- <img :src="carPicture(car.rid)" class="MainGallery_Img" alt=""> -->
      </div>
    </div>
  </div>
</template>

<script>
import data_cars from '../database/cars_final.json'

export default {
  name: 'MainGallery',
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
    return {
      all_cars: data_cars,
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    carPicture(file) {
      try {
        return require('@/imgs_final/' + file + '.jpg');
      } catch (error) {
        console.log(file);
        return require('@/assets/blank.jpg');
      }
    },
    click(car) {
      console.log(JSON.parse(JSON.stringify(car)));
    },
    carPhoto(car) {
      let parsed;
      try {
        parsed = require('@/imgs_final/' + car.rid + '.jpg');
      } catch (error) {
        return ''
      }
      parsed = parsed.replaceAll("(","\\(").replaceAll(")","\\)");
      parsed = parsed.replaceAll("'","\\'");
      // if (parsed.includes("94_Porsche_935_")) {
      //   console.log(parsed);
      //   debugger;
      // }
      return parsed ? 'background-image: url('+parsed+');' : ''
    }
  },
}
</script>

<style>
.MainGallery_Box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.MainGallery_Item {
  width: 415px;
  height: 256px;
}
.MainGallery_Img {
}
</style>