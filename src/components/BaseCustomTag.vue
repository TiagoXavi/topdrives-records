<script>
export default {
  name: 'BaseCustomTag',
  render(h) {
    return h(this.$attrs.tag,
    { on: this.$listeners, attrs: this.$attrs },
    this.$slots.default);
  },
}
</script>