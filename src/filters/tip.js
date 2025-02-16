export default {
  bind: function(el, binding, vnode) {
      el.classList.add("Tip_Element");

      if (binding.value.disabled) return;

      el.addEventListener('mouseenter', event => {
          let positionX,
          positionY = null;

          if (binding.value && binding.value.absolute) {
          const { x, y, height, width } = event.srcElement.getBoundingClientRect();
          if (binding.value.top) {
              positionX = x + width / 2;
              positionY = y;
          } else if (binding.value.left) {
              positionX = x;
              positionY = y + height / 2;
          } else if (binding.value.right) {
              positionX = x + width;
              positionY = y + height / 2;
          } else {
              positionX = x + width / 2;
              positionY = y + height;
          }
          }

          vnode.context.$store.commit("DEFINE_TOOLTIP", {
              active: true,
              openDelay: 400,
              ...binding.value,
              primary: binding.value.primary,
              positionX,
              positionY
          });
      });
      el.addEventListener('mouseleave', event => {
          if (event.relatedTarget && event.relatedTarget.parentNode === event.srcElement.parentNode && event.relatedTarget.classList.contains("Tip_Element")) {
              vnode.context.$store.commit("DEFINE_TOOLTIP", {
                  active: true,
                  binding,
                  vnode
              });
          } else {
              vnode.context.$store.commit("DEFINE_TOOLTIP", {
                  active: false,
                  binding,
                  vnode
              });
          }
      });
  }
};
