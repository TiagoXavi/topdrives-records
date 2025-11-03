<template>
  <div class="BaseGalleryItem_Body">
    <button class="D_Button BaseGalleryItem_Layout" @click="$emit('push', config.template)">
      <div class="BaseGalleryItem_Thumb">
        <div class="BaseGalleryItem_ImageLayout">
          <div v-for="car in cars" class="BaseGalleryItem_ImageBlock">
            <img :src="car" loading="lazy" class="BaseGalleryItem_Image" alt="">
          </div>
          <div v-if="moreThanNineCars" class="BaseGalleryItem_PlusCars">+{{ config.cars.length - 7 }}</div>
        </div>
        <div v-if="config.user" class="BaseGalleryItem_Author"><span v-if="config.type">{{ $t(`m_${config.type.toLowerCase()}`) }}</span> | {{ $t(`m_by`) }} <span class="BaseGalleryItem_AuthorValue">{{ config.user }}</span></div>
      </div>
      <div class="BaseGalleryItem_Mid">
        <div class="BaseGalleryItem_MidLeft">
          <div class="BaseGalleryItem_Name">
            <span>{{ config.name }}</span>
          </div>
          
          <div class="BaseGalleryItem_TagsDuo">
            <div class="BaseGalleryItem_Tags">
              <div v-if="config.tyre" class="BaseGalleryItem_TagBox">
                <div class="BaseGalleryItem_TagLabel">{{ $tc("c_tyre", 1) }}</div>
                <div v-for="tyre in config.tyre" class="BaseGalleryItem_TagValue">{{ $t(`c_${tyre.toLowerCase()}2`) }}</div>
              </div>
              <div v-if="config.drive" class="BaseGalleryItem_TagBox">
                <div class="BaseGalleryItem_TagLabel">{{ $tc("c_drive", 1) }}</div>
                <div v-for="drive in config.drive" class="BaseGalleryItem_TagValue">{{ drive.toUpperCase() }}</div>
              </div>
              <div v-if="config.clearance" class="BaseGalleryItem_TagBox">
                <div class="BaseGalleryItem_TagLabel">{{ $tc("c_clearance", 1) }}</div>
                <div v-for="clearance in config.clearance" class="BaseGalleryItem_TagValue">{{ $t(`c_${clearance.toLowerCase()}`) }}</div>
              </div>
            </div>
            <div class="BaseGalleryItem_Tags2">
              <div v-if="config.country" class="BaseGalleryItem_TagBox">
                <div class="BaseGalleryItem_TagLabel">{{ $tc("c_country", 1) }}</div>
                <div v-for="country in config.country.filter((x,ix) => ix < 3)" class="BaseGalleryItem_TagValue">{{ country }}</div>
              </div>
              <div v-if="config.brand" class="BaseGalleryItem_TagBox">
                <div class="BaseGalleryItem_TagLabel">{{ $tc("c_brand", 1) }}</div>
                <div v-for="brand in config.brand.filter((x,ix) => ix < 3)" class="BaseGalleryItem_TagValue">{{ brand }}</div>
              </div>
              <div v-if="config.tag" class="BaseGalleryItem_TagBox">
                <div class="BaseGalleryItem_TagLabel">{{ $tc("c_tag", 1) }}</div>
                <div v-for="tag in config.tag.filter((x,ix) => ix < 3)" class="BaseGalleryItem_TagValue">{{ tag }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="BaseGalleryItem_MidRight">
          <div class="BaseGalleryItem_Classes">
            <div
              v-for="(cla, icla) in config.class"
              :style="`--classC: ${config.classesColors[icla]}`"
              class="BaseGalleryItem_Class">{{ cla }}</div>
          </div>
        </div>
        
        
      </div>
    </button>
    
    <button
      v-if="showDelete"
      class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed Row_UploadButton BaseGalleryItem_Delete"
      @click.stop="$emit('delete', config)">
      <span class="BaseGalleryItem_MiniButtonLabel">{{ $t("m_delete") }}</span>
    </button>
    <button
      v-if="showRename"
      class="D_Button D_ButtonDark D_ButtonDark2 Row_UploadButton BaseGalleryItem_Delete BaseGalleryItem_Rename"
      @click.stop="$emit('rename', config)">
      <i class="ticon-pencil" style="font-size: 15px;" aria-hidden="true"/>
    </button>
    <button
      v-if="showApprove"
      style="right: unset; left: 0;"
      class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen Row_UploadButton BaseGalleryItem_Delete"
      @click.stop="$emit('approve', config)">
      <span class="BaseGalleryItem_MiniButtonLabel">{{ $t("m_approve") }}</span>
    </button>
    <button
      v-if="showReplace"
      style="right: unset; left: 0;"
      class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen Row_UploadButton BaseGalleryItem_Delete"
      @click.stop="$emit('replace', config)">
      <span class="BaseGalleryItem_MiniButtonLabel">{{ $t("m_replace") }}</span>
    </button>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseGalleryItem',
  components: {
    // BaseDetalheHeader
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    showApprove: {
      type: Boolean,
      default: false
    },
    showRename: {
      type: Boolean,
      default: false
    },
    showReplace: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moreThanNineCars: false
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    cars() {
      this.moreThanNineCars = false;
      if (!this.config.cars) return [];
      let result = [];
      this.config.cars.map((x, ix) => {
        if (ix < 7) {
          result.push(Vue.carPhoto(x));
        } else {
          this.moreThanNineCars = true;
        }
      })
      return result;
    },
    classColor() {
      
    }
  },
  methods: {},
}
</script>

<style>
.BaseGalleryItem_Body {
  position: relative;
}
.D_Button.BaseGalleryItem_Layout {
  text-align: left;
  display: block;
  line-height: unset;
  font-size: unset;
  padding: 10px;
  color: unset;
  min-height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.BaseGalleryItem_Thumb {
  position: relative;
  width: 220px;
  height: 105px;
  background-color: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
}
.BaseGalleryItem_Author {
  position: absolute;
  bottom: 0px;
  left: 0px;
  font-size: 11px;
  background-color: #000b;
  padding: 2px 5px;
  border-top-right-radius: 7px;
}
.BaseGalleryItem_AuthorValue {
  /* margin-left: 0.1em;
  margin-right: 2px; */
  color: rgb(225 179 33);
}
.BaseGalleryItem_ImageLayout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(53px, 1fr));
  height: 100%;
}
.BaseGalleryItem_ImageBlock {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.BaseGalleryItem_Image {
  height: 100%;
  transform: scale(1.3) translateX(-16%);
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}
.BaseGalleryItem_Layout:hover .BaseGalleryItem_Image,
.BaseGalleryItem_Layout.focus-visible .BaseGalleryItem_Image {
  transform: scale(1.3) translateX(-7%);
}
.BaseGalleryItem_PlusCars {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
}
.BaseGalleryItem_Mid {
  width: 220px;
  display: flex;
  gap: 5px;
}
.BaseGalleryItem_MidLeft {
  flex-grow: 1;
  padding-top: 3px;
  width: calc(100% - 30px);
}
.BaseGalleryItem_Name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: var(--d-text-b);
  padding: 2px 0px 3px 0px;
}
.BaseGalleryItem_TagsDuo {
  position: relative;
}
.BaseGalleryItem_Tags,
.BaseGalleryItem_Tags2 {
  font-size: 13px;
  display: flex;
  gap: 10px;
  min-height: 30px;
  transition-duration: 0.1s;
}
.BaseGalleryItem_Tags2 {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
}
.BaseGalleryItem_Layout:hover .BaseGalleryItem_Tags,
.BaseGalleryItem_Layout.focus-visible .BaseGalleryItem_Tags {
  opacity: 0;
}
.BaseGalleryItem_Layout:hover .BaseGalleryItem_Tags2,
.BaseGalleryItem_Layout.focus-visible .BaseGalleryItem_Tags2 {
  opacity: 1;
}

.BaseGalleryItem_Class {
  transform: skewY(9deg);
  font-weight: bold;
  background-color: var(--classC);
  color: black;
  padding: 0px 4px;
  opacity: 0.9;
}
.BaseGalleryItem_TagBox {
  display: flex;
  flex-direction: column;
}
.BaseGalleryItem_TagBox:first-child:last-child {
  /* flex-direction: row;
  gap: 3px; */
}
.BaseGalleryItem_TagLabel {
  opacity: 0.5;
}

.D_Button.Row_UploadButton.BaseGalleryItem_Delete {
  position: absolute;
  top: 0;
  right: 0;
}
.BaseGalleryItem_Delete {
  opacity: 0;
}
.BaseGalleryItem_Delete.focus-visible,
.BaseGalleryItem_Delete:hover,
.BaseGalleryItem_Layout:hover ~ .BaseGalleryItem_Delete,
.BaseGalleryItem_Layout.focus-visible ~ .BaseGalleryItem_Delete {
  opacity: 1;
}

.D_Button.BaseGalleryItem_Add {
  width: 240px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: rgba(255, 255, 255, 0.05); */
}
.BaseGalleryItem_Rename {
  right: unset !important;
  left: -21px !important;
  top: 117px !important;
  background-color: rgb(37, 37, 37);
  min-width: unset;
  padding: 7px 7px;
}
.BaseGalleryItem_Rename:hover,
.BaseGalleryItem_Rename.focus-visible {
  background-color: rgb(80, 80, 80) !important;
}
.BaseGalleryItem_MiniButtonLabel {
  font-size: 15px;
}

</style>