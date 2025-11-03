<template>
  <BaseDialog
    :active="active"
    :isStatic="true"
    :grow="true"
    :transparent="true"
    :lazy="true"
    maxWidth="880px"
    @close="$emit('close')">
    <div class="Main_SearchBody BaseFilterDialog_Box">
      <div class="BaseMatchMemoryDialog_SearchMid Main_DarkScroll">
        <div class="BaseMatchMemoryDialog_MidBox">
          <template v-for="(item, index) in match.pages">
            <div v-if="item" class="BaseMatchMemoryDialog_">
              {{ item }}
              <!-- <BaseMatchMemoryItem
                :config="item"
                :showDelete="true"
                :showApprove="false"
                :showRename="true"
                :showReplace="true"
                @rename="$emit('rename', { config: $event, index });"
                @delete="$emit('delete', { config: $event, index });"
                @replace="$emit('replace', { config: $event, index });"
                @push="$emit('templateClick', $event); $emit('close');"
              /> -->
            </div>
          </template>
          <div class="BaseMatchMemoryDialog_Options">
            <button
              v-if="match.pages.findIndex(x => x === null) > -1 && !filterActive"
              class="D_Button BaseMatchMemoryItem_Layout BaseMatchMemoryItem_Add"
              @click="$emit('addNext')">
              <i class="ticon-plus_2" style="font-size: 30px;" aria-hidden="true"/>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import BaseMatchMemoryItem from './BaseMatchMemoryItem.vue'
import BaseDialog from './BaseDialog.vue'

export default {
  name: 'BaseMatchMemoryDialog',
  components: {
    BaseMatchMemoryItem,
    BaseDialog
  },
  model: {
    prop: 'active',
    event: 'close'
  },
  props: {
    active: {
      type: [Boolean, String],
      default: false
    },
    match: {}
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  beforeDestroy() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style>
.BaseMatchMemoryDialog_Options {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: 240px;
  max-height: 210px;
  justify-content: center;
}
.BaseMatchMemoryDialog_SearchMid {
  height: 60vh;
  background-color: var(--d-back);
  width: 100%;
  
  box-sizing: border-box;
  overflow-y: scroll;
  /* overflow-x: hidden; */
  overscroll-behavior-block: contain;
  overscroll-behavior-x: contain;
  position: relative;
  /* padding: 25px; */
  display: flex;
  gap: 20px;
  align-items: center;
  height: 100%;
  flex-direction: column;
}
.BaseMatchMemoryDialog_MidBox {
  width: 100%;
  padding: 25px 0;
  box-sizing: border-box;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  flex-grow: 1;
  align-content: flex-start;
}

</style>