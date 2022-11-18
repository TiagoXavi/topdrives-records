<template>
  <div class="BaseDisqus_Layout">
    <Disqus
      v-if="show"
      :pageConfig="pageConfig" />
  </div>
</template>

<script>

export default {
  name: 'BaseDisqus',
  components: {},
  props: {
    identifier: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      pageConfig: {
        url: "",
        identifier: "",
        title: ""
      },
      show: true
    }
  },
  watch: {
    identifier: function() {
      console.log("PAGE:", this.identifier)
      this.updateData();
    },
    url: function() {
      console.log("URL:", this.url)
      this.updateData();
    }
  },
  beforeMount() {
    if (window.location.origin.includes("192")) {
      this.show = false;
    } else {
      this.updateData();
    }
  },
  mounted() {},
  computed: {},
  methods: {
    updateData() {
      if (window.location.origin.includes("192")) {
        this.show = false;
        return;
      }
      this.pageConfig.url = this.url;
      this.pageConfig.identifier = this.identifier;
      this.pageConfig.title = this.identifier;

      this.show = false;
      this.$nextTick().then(() => {
        this.show = true;
      })
    }
  },
}
</script>

<style>
.BaseDisqus_Layout {
  margin: 60px auto 0 auto;
  max-width: 800px;
  padding: 0 20px;
}
</style>