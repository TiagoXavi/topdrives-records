<template>
  <div class="BaseReviewList_Layout">
    <div v-if="!isEditing && car.reviews && car.reviews.length > 0" class="BaseReviewList_List">
      <div v-for="(rev, irev) in car.reviews" class="BaseReviewList_ReviewItem">
        <div class="BaseReviewList_ReviewTop">
          <div class="BaseReviewList_ReviewItemLeft">
            <span :class="`Main_UserT${highlightsUsers[rev.user]}`">{{ rev.user }}: </span>
            <span>{{ rev.text }}</span>
          </div>
          <div v-if="user && user.canReview && rev.user === user.username" class="BaseReviewList_ReviewItemRight">
            <button
              class="D_Button BaseReviewList_RightButton"
              @click="editClick(irev)">
              <i class="ticon-pencil" aria-hidden="true"/>
            </button>
            <button
              class="D_Button BaseReviewList_RightButton"
              :class="{ D_ButtonRed: deleteTime && deleteTimeIndex === irev, D_Button_Loading: loading }"
              :disabled="loading"
              @click="deleteClick(irev)">
              <i class="ticon-close_3" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div v-if="rev.link" class="BaseReviewList_LinkBox">
          <button class="D_Button BaseReviewList_ImageLayout" @click="$emit('loadTemplate', rev.link)">
            <div v-for="car in galleryCars[irev]" class="BaseReviewList_ImageBlock">
              <img :src="car" class="BaseReviewList_Image" alt="">
            </div>
          </button>
        </div>
        
      </div>
    </div>
    <div v-if="isEditing" class="BaseReviewList_Editor">
      <div class="BaseReviewList_InputBox">
        <textarea
          v-model="textModel"
          :placeholder="$tc('m_review', 1)"
          :readonly="loading ? 'readonly' : false"
          id="reviewTextField"
          rows="7"
          class="BaseReviewList_Input data-hj-allow" />
      </div>
      <div class="BaseReviewList_InputBox">
        <textarea
          v-model="linkModel"
          :placeholder="$tc('m_sharableLink', 1)"
          :readonly="loading ? 'readonly' : false"
          id="reviewLinkField"
          rows="4"
          class="BaseReviewList_Input data-hj-allow"/>
      </div>
      <div class="BaseReviewList_ButtonBox">
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading"
          class="D_Button D_ButtonDark BaseReviewList_Button"
          @click="cancel()">{{ $t('m_cancel') }}</button>
        <button
          :class="{ D_Button_Loading: loading }"
          :disabled="loading || !textModel"
          class="D_Button Main_SaveAllButton BaseReviewList_Button"
          @click="submit()">{{ $t('m_send') }}</button>
      </div>
      <div class="BaseReviewList_ButtonBox">
        <button
          :disabled="loading"
          class="D_Button BaseReviewList_Button"
          @click="$emit('getUrl')">Import link from current</button>
      </div>

    </div>
    <button
      v-if="!isEditing && (!car.reviews || car.reviews.length === 0 || !car.reviews.find(x => x.user === user.username))"
      :class="{ D_Button_Loading: loading }"
      :disabled="loading"
      class="D_Button BaseReviewList_Button D_ButtonDark"
      @click="newReview()">{{ $t('m_addReview') }}</button>
  </div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

export default {
  name: 'BaseReviewList',
  components: {
    // BaseDetalheHeader
  },
  props: {
    car: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    highlightsUsers: {
      type: Object,
      required: true
    },
    reviewUrl: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      isEditing: false,
      textModel: "",
      linkModel: "",
      deleteTime: false,
      deleteTimeIndex: 0
    }
  },
  watch: {
    reviewUrl() {
      this.linkModel = `${window.location.origin}?` + this.reviewUrl.url;
    }
  },
  beforeMount() {},
  mounted() {},
  computed: {
    galleryCars() {
      let result = [];
      if (this.car && this.car.reviews) {
        this.car.reviews.map(rev => {
          let cars = [];
          try {
            let decoded = Vue.decodeTdr(rev.link);
            decoded.cars.map((car, icar) => {
              if (icar > 6) return;
              cars.push(require('@/imgs_final/' + decodeURI(car.rid) + '.jpg'));
            });
            
          } catch (error) {
            
          }
          result.push(cars);
        })
      }
      return result;
    }
  },
  methods: {
    newReview() {
      this.textModel = "";
      this.linkModel = "";
      this.isEditing = true;
      this.$emit("isReviewing", true);
    },
    cancel() {
      this.isEditing = false;
      this.$emit("isReviewing", false);
    },
    submit(isDelete = false, deleteUser) {
      let vm = this;
      vm.loading = true;
      console.log(vm.textModel);
      console.log(vm.linkModel);

      let reviewObj = {
        reviewText: vm.textModel,
        reviewLink: vm.linkModel,
        isDelete: isDelete
      }
      if (isDelete) {
        reviewObj.deleteUser = deleteUser;
      }

      axios.post(Vue.preUrl + "/reviewCar", {
        rid: vm.car.rid,
        reviewObj: reviewObj,
        isDelete: reviewObj.isDelete
      })
      .then(res => {
        vm.textModel = "";
        vm.linkModel = "";
        vm.cancel();
        this.$emit("submited", reviewObj);

        vm.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: vm.$t('m_saveSuccess')
        });
      })
      .catch(error => {
        console.log(error);
        vm.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        vm.loading = false;
      });
    },
    deleteClick(index) {
      if (this.deleteTime) {
        this.deleteTime = false;
        this.confirmDelete(index);
      } else {
        this.deleteTime = true;
        this.deleteTimeIndex = index;
        setTimeout(() => {
          this.deleteTime = false;
        }, 1000);
      }
    },
    confirmDelete(index) {
      let rev = this.car.reviews[index];
      this.textModel = this.car.reviews[index].text;
      this.linkModel = this.car.reviews[index].link;
      this.submit(true);
    },
    editClick(index) {
      let rev = this.car.reviews[index];
      this.textModel = this.car.reviews[index].text;
      this.linkModel = this.car.reviews[index].link;
      this.isEditing = true;
      this.$emit("isReviewing", true);
    }
  },
}
</script>

<style>
.BaseReviewList_Button {
  width: 100%;
}
.BaseReviewList_List + .BaseReviewList_Button {
  margin-top: 20px;
}
.BaseReviewList_List + .BaseReviewList_Editor {
  margin-top: 20px;
}
.BaseReviewList_Editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.BaseReviewList_InputBox {
  display: flex;
  flex-direction: column;
}
.BaseReviewList_Input {
  background-color: rgba(0,0,0,0.2);
  border: 0;
  box-sizing: border-box;
  outline: none;
  color: var(--d-text);
  padding: 6px;
  resize: vertical;
  margin-top: 2px;
  flex-grow: 1;
}
.BaseReviewList_ButtonBox {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.BaseReviewList_ReviewItemLeft {
  font-size: 0.8em;
  flex-grow: 1;
}
.BaseReviewList_ReviewItem {
  /* display: flex;
  align-items: center; */
}
.BaseReviewList_ReviewItem + .BaseReviewList_ReviewItem {
  margin-top: 20px;
}
.BaseReviewList_ReviewTop {
  display: flex;
  /* align-items: center; */
  position: relative;
}
.BaseReviewList_ReviewItemRight {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: absolute;
  top: 0;
  --button-size: 20px;
  right: calc(var(--button-size) * -1);
}
.BaseReviewList_RightButton {
  color: #fff4;
  font-size: 12px;
  height: var(--button-size);
  min-height: var(--button-size);
  width: var(--button-size);
  min-width: var(--button-size);
}
.BaseReviewList_LinkBox {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
.BaseReviewList_ImageLayout {
  display: flex;
  height: 38px;
  border-radius: 10px;
  overflow: hidden;
}
.BaseReviewList_ImageBlock {
  display: flex;
  height: 100%;
  width: 55px;
  overflow: hidden;
}
.BaseReviewList_Image {
  height: 100%;
  transform: scale(1.3) translateX(1%);
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}
.BaseReviewList_ImageLayout:hover .BaseReviewList_Image,
.BaseReviewList_ImageLayout.focus-visible .BaseReviewList_Image {
  transform: scale(1.3) translateX(-7%);
}
.BaseReviewList_PlusCars {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
}
</style>