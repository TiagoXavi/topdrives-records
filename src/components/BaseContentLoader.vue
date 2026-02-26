<template>
  <div :class="{ BaseContentLoader_Contents: contents }" class="BaseContentLoader_Layout">
    <div v-if="type === 'chips'" class="BaseContentLoader_Chips">
      <div
        v-for="n in parseInt(count)"
        v-once
        :key="n"
        :style="{ 'width': `${Math.floor(Math.random() * 90) + 60}px` }"
        class="BaseContentLoader_Chips_Loading"/>
    </div>
    <div v-else-if="type === 'bigBars'" class="BaseContentLoader_BigBars">
      <div
        v-for="n in parseInt(count)"
        :key="n"
        class="BaseContentLoader_BigBars_LoadingBox">
        <div
          v-once
          :style="{
            'width': `${Math.floor(Math.random() * 50) + 50}%`,
            'height': `${itemHeight}px` }"
          class="BaseContentLoader_BigBars_LoadingItem"/>
      </div>
    </div>
    <div v-else-if="type === 'agendaDash'" class="BaseContentLoader_agendaDash">
      <div
        v-for="n in parseInt(count)"
        :key="n"
        class="BaseContentLoader_Agenda_CompromissoLoadingBox">
        <div class="BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading1"/>
        <div class="BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading2"/>
        <div class="BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading3"/>
        <div class="BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading4"/>
      </div>
    </div>
    <div v-else-if="type === 'smallBars'" class="BaseContentLoader_SmallBars">
      <div
        v-for="n in parseInt(count)"
        :key="n"
        class="BaseContentLoader_Agenda_LoadingBox">
        <div class="BaseContentLoader_Agenda_LoadingItem BaseContentLoader_Agenda_Loading1"/>
        <div class="BaseContentLoader_Agenda_LoadingItem BaseContentLoader_Agenda_Loading2"/>
        <div class="BaseContentLoader_Agenda_LoadingItem BaseContentLoader_Agenda_Loading3"/>
      </div>
    </div>
    <div v-else-if="type === 'block'" class="BaseContentLoader_Recortes">
      <div
        v-for="n in parseInt(count)"
        :key="n"
        :style="{ 'height': `${itemHeight}px`, 'width': `${itemWidth}` }"
        class="BaseContentLoader_Recortes_Item"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseContentLoader',
  components: {},
  props: {
    type: {
      type: String,
      default: 'bars'
    },
    contents: {
      type: Boolean,
      default: false
    },
    count: {
      type: [Number, String],
      default: 1
    },
    itemHeight: {
      type: Number,
      default: 50
    },
    itemWidth: {
      type: String,
      default: "100%"
    },
  }
};
</script>

<style>
.BaseContentLoader_Chips {
  display: flex;
  flex-wrap: wrap;
}
.BaseContentLoader_Chips_Loading {
  width: 90px;
  height: 37px;
  border-radius: 50px;
  animation: pulse 1s infinite ease-in-out;
  margin: 1px 1px;
  display: inline-flex;
}
.BaseContentLoader_BigBars_LoadingBox {
  display: flex;
  width: 100%;
}
.BaseContentLoader_BigBars_LoadingBox:not(:last-child) {
  margin-bottom: 10px;
}
.BaseContentLoader_BigBars_LoadingItem {
  animation: pulse 1s infinite ease-in-out;
  border-radius: 5px;
  width: 100%;
}
.BaseContentLoader_Agenda_CompromissoLoadingBox {
  display: grid;
  align-items: center;
  grid-template-columns: 70px 1fr 1fr 1fr 1fr;
  grid-template-rows: repeat(3, 30px);
  grid-template-areas: 'item1 item2 item2 item2 item2' 'item1 item3 item3 no no' 'item1 item4 item4 item4 na';
  grid-gap: 12px;
  margin-bottom: 10px;
}
.BaseContentLoader_Agenda_CompromissoLoadingItem {
  animation: pulse 1s infinite ease-in-out;
  border-radius: 5px;
  height: 100%;
  width: 100%;
}
.BaseContentLoader_Agenda_CompromissoLoading1 {
  grid-area: item1;
}
.BaseContentLoader_Agenda_CompromissoLoading2 {
  grid-area: item2;
  margin-top: 10px;
}
.BaseContentLoader_Agenda_CompromissoLoading3 {
  grid-area: item3;
}
.BaseContentLoader_Agenda_CompromissoLoading4 {
  grid-area: item4;
  margin-bottom: 10px;
}
.BaseContentLoader_Agenda_LoadingBox {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: repeat(3, 14px);
  grid-template-areas: 'item1 item1 item1 na na' 'item2 item2 no no no' 'item3 item3 item3 item3 ni';
  grid-gap: 4px;
  margin-bottom: 10px;
}
.BaseContentLoader_Agenda_LoadingBox:not(:last-child) {
  margin-bottom: 15px;
}
.BaseContentLoader_Agenda_LoadingItem {
  animation: pulse 1s infinite ease-in-out;
  border-radius: 5px;
  height: 100%;
  width: 100%;
}
.BaseContentLoader_Agenda_Loading1 {
  grid-area: item1;
}
.BaseContentLoader_Agenda_Loading2 {
  grid-area: item2;
}
.BaseContentLoader_Agenda_Loading3 {
  grid-area: item3;
}
.BaseContentLoader_Recortes_Item {
  animation: pulse 1s infinite ease-in-out;
  border-radius: 5px;
  width: 100%;
}
.BaseContentLoader_Recortes_Item:not(:last-child) {
  margin-bottom: 10px;
}
.BaseContentLoader_Contents {
  display: contents;
}
.BaseContentLoader_Contents > * {
  display: contents;
}
</style>