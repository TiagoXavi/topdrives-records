<template functional>
  <div class="BaseStars_Box">
    <i
      class="BaseStars_Star ticon-star"
      v-for="n in 5"
      :key="n"
      :class="{ 'BaseStars_StarActive': n <= Math.round(props.value) }"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseStars',
  functional: true,
  props: {
    value: 0,
  },
  methods: {},
}
</script>

<style>
.BaseStars_Box {
  display: flex;
  gap: 2px;
}
.BaseStars_Star {
  color: #555;
}
.BaseStars_StarActive {
  color: rgb(var(--d-text-yellow));
}
</style>