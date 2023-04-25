<template>
  <div
    :class="{
      Row_Tracks: type === 'tracks',
      Row_Times: type === 'times',
      Row_Cg: cg,
      Row_ForceNormalSize: normalSize,
    }"
    class="Row_Layout">
    <template v-if="!cg || (cg && cgYou)">
      <div
        v-for="(info, fx) in infosResolved"
        class="Row_Item Row_Cell Row_ConfigCell"
        :class="`Row_Tune${car.selectedTune} `+`${cg ? 'Row_DisableSticky ' : ''}`+`${normalSize ? 'Row_ForceNormalSizeCell ' : ''}`"
        @mouseleave="mouseLeaveTune($event)">
        <template v-if="info.type === 'Tune'">
          <div class="Row_Config">
            <template v-if="(!car.selectedTune || mouseInsideTuneBox || cgYou) && !forceHideCompactSelect">
              <div class="Row_TuneChooseBox">
                <button
                  v-for="item in tunes"
                  :class="{ Row_DialogButtonTuneActive: car.selectedTune === item }"
                  class="D_Button Row_DialogButtonTune Row_TuneChooseButton"
                  @click="changeTune(item)">
                  {{ item }}
                  <div v-if="tunesCount[item] && !cg" class="D_ButtonNote">{{ tunesCount[item] }}</div>
                </button>
                <button class="D_Button Row_ConfigButton" @click="showTuneDialog()">
                  <i class="ticon-gear Row_ConfigIcon" aria-hidden="true"/>
                </button>
              </div>
            </template>
            <template v-else> 
              <div class="Row_Tune">{{ car.selectedTune }}</div>
              <div class="Row_ConfigBox">
                <button class="D_Button Row_ConfigButton" @click="showTuneDialog()">
                  <i class="ticon-gear Row_ConfigIcon" aria-hidden="true"/>
                </button>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <slot name="corner"></slot>
        </template>
      </div>
    </template>
    <div
      v-if="car.selectedTune || type === 'tracks' || (cg && car.rid && car.selectedTune)"
      v-for="(item, ix) in timesResolved"
      :id="`${type === 'tracks' ? 'Row_Track'+ix : ''}`"
      :data="`${item.id}_a${item.surface}${item.cond}`"
      :class="`${errorIndex === ix ? 'Row_ItemError ' : '' }`+
              `${correctIndex === ix ? 'Row_ItemCorrect ' : '' }`+
              `${type === 'times' ? 'Row_ColorByIndex ' : '' }`+
              `${item.text == 0 ? 'Row_DNF ' : '' }`+
              `${hoverIndex == ix+1 ? 'Row_Hover ' : '' }`+
              `${detailIndex === ix ? 'Row_DetailsActive ' : '' }`+
              `${lastIndex > 0 ? 'Row_ColorHighFirst ' : '' }`+
              `Type_${type === 'tracks' ? item.trackType : ''} `+
              `${normalSize ? 'Row_ForceNormalSizeCell ' : ''}`+
              `${item.text === null || item.text === undefined || item.text === '' ? 'Row_ContentEmpty ' : '' }`+
              `${type === 'tracks' && item.text.length > 19 ? 'Row_TrackNameBig ' : '' }`+
              `Row_ColorByIndex${highlights[`${item.id}_a${item.surface}${item.cond}`]}`"
      :style="{
        '--color-index': highlights[`${item.id}_a${item.surface}${item.cond}`],
        '--last-index': countPerTrack[`${item.id}_a${item.surface}${item.cond}`] - 1,
        '--drag-left-slo': invertedView ? 1 : 7,
        '--drag-top-slo': invertedView ? 7 : 1,
      }"
      style="--drag-left: 0;--drag-top: 0;"
      class="Row_Item Row_Cell"
      @mouseenter="mouseEnter($event)"
      @mousedown="dragMouseDown($event, ix)"
      @touchstart="touchstart($event, ix)">
      <div
        :contenteditable="type === 'tracks' || !loggedin || (item.text !== '' && item.author !== user.username) || (cgOppo && !user) || (forceDisabled) ? false : true"
        @blur="blur($event, item, ix)"
        @click="click($event, item, ix)"
        @keydown="keydown($event, item, ix)"
        
        class="Row_Content">{{ item.text | toTimeString(item.id) }}</div>
      <template v-if="car.selectedTune || cg">
        <div class="Row_Placeholder">{{ placeholder }}</div>
        <div class="Row_PlaceholderTune">{{ item.name }}</div>
      </template>
      <div v-if="type === 'tracks'" class="Row_Campaign">{{ item.campaign }}</div>
      <div v-if="`${item.id}_a${item.surface}${item.cond}` === 'drag100_a00' && type === 'times'" class="Row_xRA">{{ item.text | mra((((car.data || {})[car.selectedTune] || {}).info || {}).acel) }}</div>
      <div v-if="`${item.id}_a${item.surface}${item.cond}` === 'drag150_a00' && type === 'times'" class="Row_xRA">{{ item.text | mra((((car.data || {})[car.selectedTune] || {}).times || {})['drag100_a00']) }}</div>
      <div v-if="`${item.id}_a${item.surface}${item.cond}` === 'drag170_a00' && type === 'times'" class="Row_xRA">{{ item.text | mra((((car.data || {})[car.selectedTune] || {}).times || {})['drag150_a00'], 25) }}</div>
      <div v-if="`${item.id}_a${item.surface}${item.cond}` === 'drag100b_a00' && type === 'times'" class="Row_xRA">{{ item.text | brake((((car.data || {})[car.selectedTune] || {}).times || {})['drag100_a00']) }}</div>
      <div v-if="`${item.id}_a${item.surface}${item.cond}` === 'drag100b_a01' && type === 'times'" class="Row_xRA">{{ item.text | brake((((car.data || {})[car.selectedTune] || {}).times || {})['drag100_a01']) }}</div>
      <div v-if="`${item.id}_a${item.surface}${item.cond}` === 'drag100b_a10' && type === 'times'" class="Row_xRA">{{ item.text | brake((((car.data || {})[car.selectedTune] || {}).times || {})['drag100_a10']) }}</div>
      <div v-if="`${item.id}_a${item.surface}${item.cond}` === 'drag150b_a00' && type === 'times'" class="Row_xRA">{{ item.text | brake((((car.data || {})[car.selectedTune] || {}).times || {})['drag150_a00']) }}</div>
      <div v-if="item.text && type === 'times' && car.clearance === 'Low' && (
        item.id === 'csSmall' ||
        item.id === 'csMed' ||
        item.id === 'oceanCity' ||
        item.id === 'speedbump12km' ||
        item.id === 'speedbump1km'
        )"
        class="Row_xRA">low</div>
      <div v-if="type === 'tracks' && item.trackType !== '00'" class="Row_Conditions">
        <BaseTypeName :type="item.trackType" />
      </div>
      <div v-if="detailIndex === ix && loggedin" class="Row_DetailsOverlay">
        <div class="Row_LikesBox">
          <button
            v-if="!cgOppo"
            :class="{
              Row_VotedAgainst: item.upList && item.upList.includes(user.username),
              D_Button_Loading: voteLoading
            }"
            :title="(item.downList || []).join(', ')"
            class="D_Button Row_VoteButton Row_VoteButtonDown"
            @click="timevote($event, item, ix, 'down')">
            <i
              :class="`ticon-thumbs_down${ item.downList && item.downList.includes(user.username) ? '_fill' : '' }`"
              class="Row_VoteIcon"
              aria-hidden="true"/>
            <span v-if="item.downList && item.downList.length > 0" class="Row_DownCount">{{ item.downList.length }}</span>
          </button>
          <template v-if="votedDownIndex === ix && (!voteLoading || uploadLoading)">
            <label
              v-if="!alreadyUploaded"
              :class="{
                D_Button_Loading: uploadLoading
              }"
              class="D_Button D_ButtonDark D_ButtonDark2 Row_UploadButton">
              <input
                class="Row_UploadInput"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                @change="uploadPrint($event, item, ix)">
                <span class="Row_UploadLabel">{{ $t("m_uploadPrint") }}</span>
            </label>
            <span v-else class="Row_UploadLabel">{{ $t("m_done") }}!</span>
          </template>
          <template v-else>
            <button
              v-if="!cgOppo"
              :class="{
                Row_VotedAgainst: item.downList && item.downList.includes(user.username),
                D_Button_Loading: voteLoading
              }"
              :title="(item.upList || []).join(', ')"
              class="D_Button Row_VoteButton Row_VoteButtonUp"
              @click="timevote($event, item, ix, 'up')">
              <i
                :class="`ticon-thumbs_up${ item.upList && item.upList.includes(user.username) ? '_fill' : '' }`"
                class="Row_VoteIcon"
                aria-hidden="true"/>
              <span v-if="item.upList && item.upList.length > 0" class="Row_UpCount">{{ item.upList.length }}</span>
            </button>
            <button
              v-if="user && user.mod"
              class="D_Button Row_ModEditButton"
              @click="modEdit($event, item, ix)">
              <i
                class="ticon-pencil Row_ModEditIcon"
                aria-hidden="true"/>
            </button>
            <button
              v-if="user && user.canDelete && car.selectedTune !== 'Other' && car.selectedTune !== '000'"
              class="D_Button Row_ModEditButton"
              @click="modDelete($event, item, ix)">
              <i
                class="ticon-trash Row_ModTrashIcon"
                aria-hidden="true"/>
            </button>
          </template>
        </div>
        <div v-if="item.author" class="Row_DetailAuthor">{{ $t("m_by") }} {{ item.author }}</div>
      </div>
      <div v-if="item.downList && item.downList.length > ( item.upList && item.upList.length > 0 ? item.upList.length : 0 )" class="Row_CheckDoubtful">
        <i class="ticon-warning Row_CheckDoubtfulIcon" aria-hidden="true"/>
      </div>
      <div v-if="type === 'tracks'" class="RowTrack_DragIndicator"></div>
    </div>
    <div v-else class="Row_Item Row_Cell Row_DisabledCell" @mouseenter="mouseEnter($event)" @click.stop="outsideClick()"></div>

    <div v-if="car.isEmpty && type === 'times' && !car.selectedTune" class="Row_EmptyInvite">
      <div>{{ $t("m_noRecords") }}</div>
    </div>

    <div v-if="nonUsedTracks.length > 0 && !cg" class="Row_ShowMoreTracks">
      <button
        class="D_Button D_ButtonLink Row_ShowMoreButton"
        @click="$emit('moreTracks', nonUsedTracks)">{{ $t("m_showOtherTracks") }}</button>
    </div>
    
  </div>
</template>

<script>
import BaseSelect from '@/components/BaseSelect.vue';
import BaseTypeName from '@/components/BaseTypeName.vue';

var pos1 = 0;
var pos2 = 0;
var mouseX = 0;
var mouseY = 0;
var elmnt = null;
var dragNum = 0;
var lastDragNum = 0;

export default {
  name: 'Row',
  components: {
    BaseSelect,
    BaseTypeName
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    car: {
      type: Object,
      default() {
        return {}
      }
    },
    highlights: {
      type: Object,
      default() {
        return {}
      }
    },
    countPerTrack: {
      type: Object,
      default() {
        return {}
      }
    },
    carIndex: {
      type: Number,
      default: -1
    },
    lastIndex: {
      type: Number,
      default: -1
    },
    maxCarNumber: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      default: "tracks"
    },
    placeholder: {
      type: String,
      default: "-"
    },
    hoverIndex: {
      type: Number,
      default: -1
    },
    loggedin: {
      type: Boolean,
      default: false
    },
    needSave: {
      type: Boolean,
      default: false
    },
    saveLoading: {
      type: Boolean,
      default: false
    },
    user: {
      required: false
    },
    invertedView: {
      type: Boolean,
      default: false
    },
    cg: {
      type: Boolean,
      default: false
    },
    cgYou: {
      type: Boolean,
      default: false
    },
    cgOppo: {
      type: Boolean,
      default: false
    },
    forceHideCompactSelect: {
      type: Boolean,
      default: false
    },
    forceDisabled: {
      type: Boolean,
      default: false
    },
    normalSize: {
      type: Boolean,
      default: false
    },
    forceCustomAuthor: {
      type: Boolean,
      default: false
    },
    cgTime: {
      type: Number,
      default: null
    },
    customData: {
      type: Object,
      default() {
        return null
      }
    },
  },
  data() {
    return {
      errorIndex: null,
      correctIndex: null,
      infos: ["Tune"],
      card_speed: null,
      card_acel: null,
      card_hand: null,
      mouseInsideTuneBox: false,
      nonUsedTracks: [],
      indexesToClear: [],
      detailIndex: null,
      unsubscribeMutation: null,
      uploadLoading: false,
      alreadyUploaded: false,
      votedDownIndex: null,
      detailsItem: null,
      dragIndex: null,
      dragging: false,
      timer: null,
      touchduration: 800,
      timerStart: 0,
      timerEnd: 0,
      touchTrack: null,
      touchCount: 0,
      voteLoading: false,
      successVote: false
    }
  },
  watch: {
    detailIndex: function() {
      if (this.detailIndex !== null && this.detailIndex > -1) {
        document.addEventListener("paste", this.interceptPaste);
      } else {
        document.removeEventListener("paste", this.interceptPaste)
      }
    }
  },
  beforeMount() {},
  mounted() {
    let vm = this;
    this.unsubscribeMutation = vm.$store.subscribe(mutation => {

      if (mutation.type == "HIDE_DETAIL") {
        vm.detailIndex = null;
      }

      

    }); 
  },
  beforeDestroy() {
    this.unsubscribeMutation();
  },
  computed: {
    timesResolved() {
      let result = [];
      let text;
      let author;
      let downList;
      let upList;
      let car;
      let timesObjPresent = false;
      let presentTracks = [];
      this.nonUsedTracks = [];

      if (this.type === "tracks") {
        this.list.map(x => {
          result.push({ text: this.$t('t_'+x.id), cond: x.cond, surface: x.surface, id: x.id, trackType: `${x.surface}${x.cond}`, campaign: x.campaign })
        })
      } else if (this.type === "times") {
        car = this.car;
        if (
            car.selectedTune &&
            car.data &&
            car.data[car.selectedTune] &&
            car.data[car.selectedTune].times
        ) {
          timesObjPresent = true;
        }

        this.list.map((x, ix) => {
          text = "";
          // if (car.times &&
          //     car.times[x.id]
          // ) {
          if (timesObjPresent) {
            text = car.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}`];
            downList = car.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}_downList`];
            upList = car.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}_upList`];
            author = car.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}_user`];
          }
          if (text === undefined || text === null) text = "";
          result.push({ text: text, ...x, cond: x.cond, surface: x.surface, id: x.id, trackType: `${x.surface}${x.cond}`, showDetail: false, downList, upList, author })
        })
      }
      // console.log(result);
      if (timesObjPresent) {
        result.map(x => {
          presentTracks.push(`${x.id}_a${x.surface}${x.cond}`);
        })

        let vm = this;

        Object.keys( this.car.data[this.car.selectedTune].times ).forEach(function (key) {
          if (!presentTracks.includes(key) && typeof key === 'string' && key.substr(key.length -4, 2) === "_a" && vm.car.data[vm.car.selectedTune].times[key] !== 0) {
            vm.nonUsedTracks.push(key)
          }

        });
        
      } else if (
        this.type === "times" &&
        this.car.selectedTune &&
        this.customData &&
        this.customData.data &&
        this.customData.data[this.car.selectedTune] &&
        this.customData.data[this.car.selectedTune].times
      ) {
        // custom data with allowedTune
        this.list.map((x, ix) => {
          text = this.customData.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}`];
          if (text === undefined || text === null) text = "";
          downList = this.customData.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}_downList`];
          upList = this.customData.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}_upList`];
          author = this.customData.data[car.selectedTune].times[`${x.id}_a${x.surface}${x.cond}_user`];

          if (text === '' && this.cgTime) {
            text = this.cgTime;
            // console.log(this.car.rid, `${x.id}_a${x.surface}${x.cond}`);
            // debugger;
          }

          result[0].text = text;
          result[0].downList = downList;
          result[0].upList = upList;
          result[0].author = author;
        })


      } else if (text === '' && typeof this.cgTime === 'number') {
        // custom tune with cgTime
        result[0].text = this.cgTime;
        if (this.forceCustomAuthor) result[0].author = this.user.username;
      }

      return result;
    },
    infosResolved() {
      let result = [];
      if (this.type === "tracks") {
        return this.infos;
      } else {
        this.infos.map(x => {
          if (x === "Tune") {
            result.push({ type: x })
          }
        })
        return result;
      }
    },
    tunes() {
      let result = ["332", "323", "233"];
      if (this.car.class === "S" || this.car.class === "A") result.push("111");
      return result;
    },
    tunesCount() {
      let data = this.car.data;
      if (this.customData && this.customData.data) data = this.customData.data;
      if (!data) return {};
      let result = {};
      this.tunes.map(tune => {
        if (data[tune]) {
          if (data[tune].times) {
            result[tune] = Object.keys(data[tune].times).filter(key => typeof key === 'string' && key.substr(key.length -4, 2) === "_a" && data[tune].times[key] !== 0).length;
          }
        }
      })
      return result;
    }
    
  },
  methods: {
    keydown(e, item, ix) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.srcElement.blur();
        this.blur(e, item, ix);        
      }
    },
    blur(e, item, ix) {
      // e.srcElement.removeAttribute('contenteditable');
      let number = Vue.options.filters.toTimeNumber(e.srcElement.innerText, item.id);

      let roundedOriginal = Math.round(item.text * 1e2) / 1e2;
      if (item.text === "") roundedOriginal = "";
      if (number === "" && (item.text === "" || item.text === undefined)) {
        // nada
      } else if (e.srcElement.innerText === "" && item.text !== "" && item.text !== undefined) {
        // remover tempo
        this.timeEmit(undefined, item, this.car);
        e.srcElement.innerText = Vue.options.filters.toTimeString(undefined, item.id);
        this.errorIndex = ix;
        setTimeout(() => {
          this.errorIndex = null;
        }, 1500);
      } else if (number !== false && number !== roundedOriginal) {
        // mudou
        this.timeEmit(number, item, this.car);
        e.srcElement.innerText = Vue.options.filters.toTimeString(number, item.id);
        this.correctIndex = ix;
        setTimeout(() => {
          this.correctIndex = null;
        }, 1500);
      } else if (number === false) {
        // não mudou
        e.srcElement.innerText = Vue.options.filters.toTimeString(item.text, item.id);
        this.errorIndex = ix;
        setTimeout(() => {
          this.errorIndex = null;
        }, 1500);
      } else {
        e.srcElement.innerText = Vue.options.filters.toTimeString(item.text, item.id);
      }
    },
    timeEmit(number, item, car) {
      if (this.cg) {
        this.$emit('changeTime', {
          number,
          item,
          car
        });
      } else {
        this.$store.commit("CHANGE_TIME", {
          number,
          item,
          car
        });
      }
    },
    contextMenu(e, item, ix) {
      this.timeEmit(undefined, item, this.car);
      e.srcElement.innerText = Vue.options.filters.toTimeString(undefined, item.id);
      this.errorIndex = ix;
      setTimeout(() => {
        this.errorIndex = null;
      }, 1500);
      e.preventDefault();
      return false;
    },
    click(e, item, ix) {
      let currentIndex = this.detailIndex;

      

      this.$store.commit("HIDE_DETAIL", {
        item,
        car: this.car
      });

      this.$nextTick().then(() => {
        if (this.type === "times" && this.loggedin && item.text !== '' ) {
          if ((e.ctrlKey || e.metaKey) || (item.author !== this.user.username) ) {

            if (currentIndex !== ix) {
              this.detailIndex = ix;
              this.detailsItem = item;
              
            }

          }
        }
      })

      if (this.type === "tracks" && e.shiftKey && !this.dragging) {
        this.$store.commit("DELETE_TRACK", {
          track: ix
        });
      }
      
      

    },
    timevote(e, item, ix, type) {

      if (type === "down") {
        if (item.downList && item.downList.includes(this.user.username)) {
          // removing vote
          this.votedDownIndex = null;
        } else {
          this.votedDownIndex = ix;
        }
      } else {
        this.votedDownIndex = null;
      }
      
      this.processVote( item, this.car, type);

      

    },
    async interceptPaste(e) {
      if (this.votedDownIndex !== this.detailIndex) {
        return;
      }
      e.preventDefault();
      if (!e.clipboardData.files.length) {
        return;
      }
      const file = e.clipboardData.files[0];
      // Read the file's contents, assuming it's a text file.
      // There is no way to write back to it.
      this.uploadPrint(e, this.detailsItem, null, file);
      
    },
    uploadPrint(e, item, ix, file = null) {
      this.uploadLoading = true;
      if (!file && (!e.target.files || e.target.files.length === 0)) {
        // no file
        return;
      }
      if (!file) {
        file = e.target.files[0];
      }
      
      let url = `${window.location.origin}?share=`;
      url += `~K${item.id}_a${item.trackType}`;
      url += `~C${this.car.rid}~T${this.car.selectedTune}`;
      
      let formData = new FormData();
      formData.set('image', file);
      formData.set('config', JSON.stringify({
        author: this.user.username,
        car: `${this.car.name} (${this.car.selectedTune})`,
        track: `${this.$i18n._vm.messages.en['t_'+item.id]}/${this.$t('t_'+item.id)} - ${Vue.options.filters.resolveCond(item.trackType)}`,
        currentTime: Vue.options.filters.toTimeString(item.text, item.id),
        timeAuthor: item.author,
        url: url
      }));
      
      axios.post(Vue.preUrl + '/uploadproof', formData, {
        headers: {
         'content-type': 'multipart/form-data' // do not forget this 
        }})
      .then(res => {
        this.alreadyUploaded = true;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t("m_uploadSuccess")
        });
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.uploadLoading = false;
      });

    },
    modEdit(e, item, ix, type) {

      this.detailIndex = null;

      let father = e.srcElement.closest(".Row_Item");
      let content;
      if (father) {
        content = father.querySelector(".Row_Content")
      }
      if (content) {
        content.setAttribute("contenteditable", true);
        content.focus();
      }      

    },
    modDelete(e, item) {
      if (this.cg) {
        this.$emit("deleteTime", {
          item,
          car: this.car
        });
      } else {
        this.$store.commit("DELETE_TIME", {
          item,
          car: this.car
        });
      }
      this.outsideClick();
    },
    outsideClick() {
      this.$store.commit("HIDE_DETAIL");
    },
    showTuneDialog() {
      if (this.cg) {
        this.$emit('showTuneDialog');
      } else {
        this.$store.commit("SHOW_TUNE", {
          active: true,
          car: this.car
        });
      }
      this.outsideClick();
    },
    changeTune(tune, insideBox = true) {
      this.outsideClick();
      if (insideBox) this.mouseInsideTuneBox = true;
      if (tune === this.car.selectedTune) {
        tune = undefined
      }

      if (this.cg) {
        this.$emit('changeTune', tune);
      } else {
        this.$store.commit("CHANGE_TUNE", {
          tune,
          car: this.car
        });
      }
    },
    changeInput(e) {
      debugger;
    },
    changeStat(type, value) {
      this.$store.commit("CHANGE_STAT", {
        type,
        value,
        car: this.car
      });
    },
    mouseEnter(e) {
      var nodes = Array.prototype.slice.call( e.srcElement.parentElement.children );
      var liRef = e.srcElement;
      this.mouseInsideTuneBox = false;

      this.$store.commit("HOVER_INDEX", nodes.indexOf( liRef ));
    },
    mouseLeaveTune(e) {
      this.mouseInsideTuneBox = false;
    },
    dragMouseDown(e, index) {
      if (this.type !== 'tracks' || this.cg) return;
      this.dragIndex = index;

      elmnt = document.querySelector('#Row_Track'+this.dragIndex);
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.onmouseup = this.closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = this.elementDrag;
      
    },
    elementDrag(e) {
      this.dragging = true;
      // calculate the new cursor position:
      pos1 = mouseX - e.clientX;
      pos2 = mouseY - e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      // set the element's new position:
      getComputedStyle(elmnt).getPropertyValue("--drag-left")
      getComputedStyle(elmnt).getPropertyValue("--drag-top")
      let newLeft = getComputedStyle(elmnt).getPropertyValue("--drag-left") - pos1;
      let newTop = getComputedStyle(elmnt).getPropertyValue("--drag-top") - pos2;
      elmnt.style.setProperty("--drag-left", newLeft );
      elmnt.style.setProperty("--drag-top", newTop );
      elmnt.classList.add("RowTrack_Dragging");
      elmnt.parentElement.classList.add("RowTrack_DraggingParent");

      let height = Number(getComputedStyle(document.body).getPropertyValue("--cell-height").trim().slice(0,-2))
      let width;
      if (this.invertedView) width = Number(getComputedStyle(document.querySelector(".Main_2")).getPropertyValue("--cell-width").trim().slice(0,-2))

      dragNum = Math.round(newTop / height);
      if (this.invertedView) dragNum = Math.round(newLeft / width);
      let times = Math.abs(dragNum);
      let cla = dragNum > 0 ? "RowTrack_PushLeft" : "RowTrack_PushRight";
      let div;

      if (dragNum !== lastDragNum) {
        lastDragNum = dragNum;

        document.querySelectorAll(".Row_Tracks .Row_Item").forEach(x => {
          x.classList.remove("RowTrack_PushLeft");
          x.classList.remove("RowTrack_PushRight");
        })

        Array.from(Array(times)).map((_, i) => {
          if (dragNum > 0) div = document.querySelector("#Row_Track" + (dragNum + this.dragIndex - i) )
          else div = document.querySelector("#Row_Track" + (dragNum + this.dragIndex + i) )

          if (div) {
            div.classList.add(cla);
          }
        });
      }
      // elmnt.style[0] = (elmnt.offsetLeft - pos1);
      // elmnt.style[1] = (elmnt.offsetTop - pos2);
    },
    closeDragElement() {
      // stop moving when mouse button is released:
      elmnt.style.setProperty("--drag-left", 0 );
      elmnt.style.setProperty("--drag-top", 0 );
      elmnt.classList.remove("RowTrack_Dragging");
      elmnt.parentElement.classList.remove("RowTrack_DraggingParent");
      lastDragNum = 0;

      document.querySelectorAll(".Row_Tracks .Row_Item").forEach(x => {
        x.classList.remove("RowTrack_PushLeft");
        x.classList.remove("RowTrack_PushRight");
      })

      if (dragNum !== 0) {
        this.$emit("newindex", { current: this.dragIndex, new: this.dragIndex + dragNum });
      }
      dragNum = 0;

      document.onmouseup = null;
      document.onmousemove = null;

      setTimeout(() => {
        this.dragging = false;
      }, 10);
    },
    touchstart(e, ix) {
      if (this.touchCount === 0) {
        this.timerStart = performance.now();
        this.touchCount = this.touchCount+1
        return;
      }
      if (performance.now() - this.timerStart < 400) {
        this.touchCount = this.touchCount+1
      } else {
        this.timerStart = performance.now();
        this.touchCount = 1;
      }
      if (this.touchCount > 2) {
        this.$store.commit("DELETE_TRACK", {
          track: ix
        });
        this.touchCount = 0;
      }
    },
    touchend() {
      this.timerEnd = performance.now();
      if (this.timerEnd - this.timerStart > 800) {
        if (this.type === "tracks") {
          this.$store.commit("DELETE_TRACK", {
            track: this.touchTrack
          });
        }
      }
    },
    processVote(TRACK, car, type) {
      let selectedtune = car.selectedTune;
      // let car = vm.carDetailsList.find(x => x.softId === mutation.payload.car.softId);
      // if (this.mode === 'cg') {
      //   car = vm.cgCacheCars.find(x => x.rid === mutation.payload.car.rid);
      // }
      let timesObj;
      if (this.customData) {
        timesObj = this.customData.data[selectedtune].times;
      } else {
        timesObj = car.data[selectedtune].times;
      }
      let upArrName = `${TRACK.id}_a${TRACK.surface}${TRACK.cond}_upList`;
      let downArrName = `${TRACK.id}_a${TRACK.surface}${TRACK.cond}_downList`;

      if (!timesObj[upArrName]) Vue.set(timesObj, upArrName, []);
      if (!timesObj[downArrName]) Vue.set(timesObj, downArrName, []);
      let upArr = timesObj[upArrName];
      let downArr = timesObj[downArrName];
      let isUnVoteUp = false;
      let isUnVoteDown = false;

      // remove from both arr
      if (upArr.includes(this.user.username)) {
        if (type === "up") isUnVoteUp = true;
        timesObj[upArrName] = upArr.filter(x => x !== this.user.username);
      }
      if (downArr.includes(this.user.username)) {
        if (type === "down") isUnVoteDown = true;
        timesObj[downArrName] = downArr.filter(x => x !== this.user.username);
      }

      if (!isUnVoteUp && !isUnVoteDown) {

        if (type === "up") {
          upArr.push(this.user.username);
          this.requestVote(true, false, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
        } else {
          downArr.push(this.user.username);
          this.requestVote(false, false, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
        }

      } else if (isUnVoteUp) {
        this.requestVote(true, true, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
      } else {
        this.requestVote(false, true, car.rid, selectedtune, `${TRACK.id}_a${TRACK.surface}${TRACK.cond}`);
      }

    },
    
    requestVote(isUp, isDelete, rid, tune, track) {
      this.voteLoading = true;
      let params = {
        isUp,
        isDelete,
        rid,
        tune,
        track
      }

      axios.post(Vue.preUrl + "/vote", params)
      .then(res => {
        this.successVote = true;
        setTimeout(() => {
          this.successVote = false;
        }, 1000);
      })
      .catch(error => {
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
      .then(() => {
        this.voteLoading = false;
      });

    },

  },
}
</script>

<style>
.Row_Cell {
  white-space: nowrap;
  height: var(--cell-height);
  box-sizing: border-box;
  /* border: 2px #ffffff0d solid; */
  border-top-width: 0;
  border-left-width: 0;
  display: flex;
  align-items: center;
  transition-duration: 0.3s;
  position: relative;
  transition-property: set;
  /* box-shadow: inset 0px -2px 0px 0px #ffffff07, inset -2px 0px 0px 0px #ffffff07, inset 0px 0px 0px 0px #ffffff07; */
  box-shadow: inset -2px -2px 0px 0px #ffffff07, inset 0px -2px 0px 0px #ffffff00, -2px 0px 0px 0px #ffffff00;
}
.Car_Dragging + .Car_Layout .Row_Cell,
.Car_PushLeft + .Car_Layout .Row_Cell,
.Car_PushRight .Row_Cell {
  border-left-width: 2px;
}
.Row_Times .Row_Cell {
  letter-spacing: 0.5px;
}
.Row_Hover:not(:hover) {
  box-shadow: inset 0px -80px 0px 0px rgb(255, 255, 255, 0.08);
}
.Main_2 .Row_Hover {
  /* z-index: 20; */
}
.Main_2 .Row_Tracks .Row_Hover {
  z-index: 1;
}
.Row_Content {
  text-align: center;
  width: 100%;
  padding: 6px;
  transition-duration: 0.2s;
  transition-property: background;
  outline: none;
  height: 100%;
  box-sizing: border-box;
}
.Row_ConfigCell {
  border-bottom-color: #5a5a5a;
}
.Row_Tracks .Row_Campaign {
  display: none;
  position: absolute;
  right: 0;
  background-color: hsl(var(--back-h), var(--back-s), 20%);
  box-shadow: -20px 0px 21px -7px #000;
  border-radius: 5px;
  padding: 0px 5px 0px 10px;
  height: var(--cell-height);
  z-index: 1000;
  pointer-events: none;
  color: var(--d-text-b);
  animation: campaignTip 0.1s linear forwards;
  font-size: 0.8em;
}
.Main_2 .Row_Tracks:not(.Row_ForceNormalSize) .Row_Campaign {
  display: none;
  right: unset;
  left: 0;
  box-shadow: 0px 0px 21px -7px #000;
  border-radius: 5px;
  padding: 0px 5px 0px 5px;
  animation: campaignTip 0.1s linear forwards;
  font-size: 1em;
}
.Row_Tracks .Row_Item:hover:not(.RowTrack_Dragging) .Row_Campaign {
  display: flex;
  align-items: center;
}
@keyframes campaignTip {
  0% {
    opacity: 0;
    transform: translateX(3px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
.Row_Tracks .Track_Wet,
.Main_AllTracksBox .Track_Wet {
  color: rgb(var(--color-wet));
  background-color: rgba(var(--color-wet), 0.1);
}
.Row_Tracks .Track_Dirt,
.Main_AllTracksBox .Track_Dirt {
  color: rgb(var(--color-dirt));
  background-color: rgba(var(--color-dirt), 0.1);
}
.Row_Tracks .Track_Gravel,
.Main_AllTracksBox .Track_Gravel {
  color: rgb(var(--color-gravel));
  background-color: rgba(var(--color-gravel), 0.1);
}
.Row_Tracks .Track_Ice,
.Main_AllTracksBox .Track_Ice {
  color: rgb(var(--color-ice));
  background-color: rgba(var(--color-ice), 0.1);
}
.Row_Tracks .Track_Mixed,
.Main_AllTracksBox .Track_Mixed {
  color: rgb(var(--color-mixed));
  background-color: rgba(var(--color-mixed), 0.1);
}
.Row_Tracks .Track_Sand,
.Main_AllTracksBox .Track_Sand {
  color: rgb(var(--color-sand));
  background-color: rgba(var(--color-sand), 0.1);
}
.Row_Tracks .Track_Snow,
.Main_AllTracksBox .Track_Snow {
  color: rgb(var(--color-snow));
  background-color: rgba(var(--color-snow), 0.1);
}
.Row_Tracks .Row_Content {
  text-align: left;
  white-space: normal;
  line-height: 1;
  display: flex;
  align-items: center;
  /* cursor: grab; */
}
.Row_Times .Row_Content:not(:focus) {
  cursor: default;
}
.Row_Times .Row_Content[contenteditable="true"]:not(:focus) {
  cursor: pointer;
}
.Row_Times .Row_Content[contenteditable="true"]:hover {
  box-shadow: inset -2px -2px 0px 0px #fff2, 0px -2px 0px 0px #fff2, -2px 0px 0px 0px #fff2;
}
.Row_Content:focus {
  /* background-color: #459bd100; */
  background-color: #459bd126;
  background-image: repeating-linear-gradient( 135deg, transparent, transparent 14px, rgba(0, 0, 0, 0.09) 0, rgba(0, 0, 0, 0.09) 30px ) !important;
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
}
.Row_ConfigCell + * .Row_Content:focus {
  /* background-color: #459bd100; */
  box-shadow: 0px 0px 0px 2px #459bd1, inset 0px 2px 0px 0px #459bd1;
}
#Car_Layout0 .Row_ConfigCell + * .Row_Content:focus {
  /* background-color: #459bd100; */
  box-shadow: 0px 0px 0px 2px #459bd1, inset 2px 2px 0px 0px #459bd1;
}
#Car_Layout0 .Row_Content:focus {
  /* background-color: #459bd100; */
  box-shadow: 0px 0px 0px 2px #459bd1, inset 2px 0px 0px 0px #459bd1;
}
/* .Row_Content[contenteditable="true"] {
  box-shadow: 0px 0px 0px 2px #459bd1;
  background-color: #459bd126;
  color: #8cc9ef;
} */
.Row_Times .Row_Content[contenteditable="true"]:hover:focus {
  box-shadow: 0px 0px 0px 3px #459bd1;
}
.Row_Times .Row_ConfigCell + * .Row_Content[contenteditable="true"]:hover:focus {
  /* background-color: #459bd100; */
  box-shadow: 0px 0px 0px 3px #459bd1, inset 0px 3px 0px 0px #459bd1;
}
#Car_Layout0 .Row_Times .Row_ConfigCell + * .Row_Content[contenteditable="true"]:hover:focus {
  /* background-color: #459bd100; */
  box-shadow: 0px 0px 0px 3px #459bd1, inset 3px 3px 0px 0px #459bd1;
}
#Car_Layout0 .Row_Content[contenteditable="true"]:hover:focus {
  /* background-color: #459bd100; */
  box-shadow: 0px 0px 0px 3px #459bd1, inset 3px 0px 0px 0px #459bd1;
}
.Row_Placeholder,
.Row_PlaceholderTune {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  text-align: center;
  padding: 6px;
  box-sizing: border-box;
  display: none;
  color: var(--d-text);
  align-items: center;
  justify-content: center;
  white-space: pre-line;
  font-size: 15px;
  line-height: 1;
}
.Row_ContentEmpty .Row_Content:not(:focus) ~ .Row_Placeholder {
  display: flex;
}
.Row_Content:focus:empty ~ .Row_PlaceholderTune {
  display: flex;
  color: #aee0ff47;
}
.Row_ItemError {
  transition-duration: 0.1s;
  box-shadow: inset 0px -13px 16px -17px #b50000, inset 0px -5px 0px 0px #b50000;
  color: #ff9898;
  background-color: #b5000022;
}
.Row_ItemCorrect {
  transition-duration: 0.1s;
  box-shadow: inset 0px -13px 16px -17px #5fb500, inset 0px -5px 0px 0px #5fb500;
  color: #90df39;
  background-color: #5fb50022;
}
.Row_ConfigCell {
  justify-content: center;
  background-color: rgba(255,255,255, 0.05);
  height: calc(var(--cell-height) * 1.3);
}
.Main_Normal .Row_Times .Row_ConfigCell {
  position: sticky;
  top: var(--top-height);
  background-color: #404040;
  z-index: 1;
}
.Main_Normal .Row_Times .Row_DisableSticky {
  position: relative;
  top: 0;
  left: 0;
}
.Main_2 .Car_LayoutAddCar > * {
  position: sticky;
  left: 2px;
}
.Main_2 .Row_Times:not(.Row_ForceNormalSize) .Row_ConfigCell {
  position: sticky;
  left: var(--left-width);
  background-color: #404040;
  z-index: 20;
}
.Row_ConfigIcon {
  font-size: 24px;
  color: var(--d-text);
}
.Row_ConfigIconTrash {
  font-size: 22px;
  color: var(--d-text);
}
.Row_ConfigLabel {
  color: var(--d-text);
}
.D_Button.Row_ConfigButton {
  padding: 0px 6px;
  --height: 34px;
}
.D_Button.Row_DialogButtonTune {
  color: var(--d-text-b);
  font-size: 1.2em;
  padding: 0 9px;
  border-radius: 0;
}
.D_Button.Row_DialogButtonTuneRelative {
  position: relative;
  background-color: rgba(0,0,0, 0.15);
}
.D_Button.Row_DialogButtonClose {
  background-color: #d5000033;
  --back-color: 200, 0, 0;
  --back-opac: 0.4;
}
.Row_DialogHeader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.D_Button.Row_DialogButtonTuneActive {
  box-shadow: inset 0px -33px 15px -20px rgba(var(--d-text-green), 0.4), inset 0px -2px 0px 0px rgb(var(--d-text-green));
  color: rgb(var(--d-text-green-b));
}
.Row_DialogButtonTune s {
  text-decoration: none;
  opacity: 0.6;
}
.Row_Tune {
  font-size: 1.1em;
  flex-grow: 1;
  text-align: center;
  padding-left: 36px;
}
.Row_Config {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}
.Row_DialogCardCard {
  width: 300px !important;
  height: 184px !important;
  --card-font-size: 15px;
}
.Row_DialogCardCard .Car_HeaderStatLabel {
  display: block;
}
.Row_DialogCard {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.Row_DialogCardBottom {
  display: flex;
  gap: 5px 25px;
  flex-wrap: wrap;
}
.Row_DialogCardStatLabel {
  font-size: 0.8em;
  color: #777;
}
.Row_DialogCardStatValue {
  color: var(--d-text-b);
}
.Row_DialogCardStatRed {
  color: rgb(var(--d-text-red));
}
.Row_DialogCardStatCorrect {
  color: rgb(var(--d-text-green));
}
.Row_DialogExternal {
  font-size: 16px;
  margin-left: 4px;
  opacity: 0.6;
}
.Row_DialogTdc.D_Button {
  align-self: center;
}
.Row_DialogCardStatTags {
  font-size: 0.8em;
  max-width: 220px;
}
.Row_DialogCardDual {
  display: flex;
}
.Row_DialogCardTags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.Row_DialogCardExternalBox {
  display: flex;
  align-items: center;
}
.Row_FieldStat {
  max-width: 75px;
}
.D_Button.Row_TuneChooseButton {
  background-color: rgba(0,0,0,0.2);
  font-size: 1em;
  border-radius: 6px;
  padding: 0 7px;
  min-height: calc( var(--height) * 0.8 );
  position: relative;
}
.Row_TuneChooseBox {
  display: flex;
  align-items: center;
  gap: 4px;
}

.Main_ColorsMedal .Row_ColorByIndex0:not(.Row_ContentEmpty):not(.Row_ItemCorrect):not(.Row_ItemError):not(.Row_DNF) {
  background-color: #ffc3003b;
  color: #f9efad;
}
.Main_ColorsMedal .Row_ColorByIndex1:not(.Row_ContentEmpty):not(.Row_ItemCorrect):not(.Row_ItemError):not(.Row_DNF) {
  background-color: #d3f7ff14;
  color: #d3dee9;
}
.Main_ColorsMedal .Row_ColorByIndex2:not(.Row_ContentEmpty):not(.Row_ItemCorrect):not(.Row_ItemError):not(.Row_DNF) {
  background-color: #74340033;
  color: #ebc5a6;
}

.Main_ColorsFull .Row_ColorByIndex:not(.Row_ContentEmpty):not(.Row_ItemCorrect):not(.Row_ItemError):not(.Row_DNF):not(.Row_ColorByIndex-1) {  
  background-color: hsl(calc( (((var(--color-index) * (100/var(--last-index))) / -100) + 1) * 100 ), 100%, 30%, calc( (((var(--color-index) * (100/var(--last-index))) / -120) + 1) * 0.5 ));
  color: hsl(calc( (((var(--color-index) * (100/var(--last-index))) / -100) + 1) * 100 ), calc( (((var(--color-index) * (100/var(--last-index))) / -100) + 1) * 100% ), 80%, calc( (((var(--color-index) * (100/var(--last-index))) / -400) + 1) * 1 ));
}
.Main_ColorsFull .Row_ColorHighFirst.Row_ColorByIndex0:not(.Row_ContentEmpty):not(.Row_ItemCorrect):not(.Row_ItemError):not(.Row_DNF):not(.Row_ColorByIndex-1):not(.Row_DetailsActive) {
  --d-first: #599939;
  box-shadow: inset -2px -2px 0px 0px var(--d-first), inset 2px 2px 0px 0px var(--d-first), 0px 0px 0px 0px var(--d-first) !important;
}

.Row_Conditions {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 1px 5px;
  position: absolute;
  right: 2px;
  bottom: 0px;
  flex-wrap: wrap;
  padding-left: 2px;
}
.Row_OrderBoxLayout {
  padding: 5px;
  margin-top: -5px;
  box-shadow: 0px 0px 0px 2px #ffffff21;
  margin-bottom: 5px;
  border-radius: 5px;
  display: flex;
  gap: 10px;
}
.Row_Times {
  position: relative;
}
.Row_EmptyInvite {
  position: absolute;
  top: calc(var(--cell-height) * 1.3 + 4%);
  display: flex;
  width: 90%;
  left: 5%;
  background-color: #00000054;
  padding: 14px;
  box-sizing: border-box;
  border-radius: 7px;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.Main_2 .Row_EmptyInvite {
  top: 3px;
  left: calc(var(--cell-width) * 2.1 + 10px);
  width: max-content;
  padding: 5px 15px;
  justify-content: center;
}
.Row_ShowMoreTracks {
  display: flex;
  justify-content: center;
  margin-top: 4px;
  white-space: nowrap;
}
.D_Button.Row_ShowMoreButton {
  padding: 8px !important;
  color: #777;
  opacity: 0.4;
  transition-duration: 0.1s;
}
.Car_Layout:hover .Row_ShowMoreButton,
.Car_Layout:focus-within .Row_ShowMoreButton,
.Row_ShowMoreButton.focus-visible {
  opacity: 1;
}
.Row_xRA {
  font-size: 8px;
  font-family: 'Press Start 2P', cursive;
  line-height: 1;
  position: absolute;
  right: 2px;
  bottom: 0px;
  width: 96%;
  text-align: right;
}
.Row_DetailsActive {
  box-shadow: inset -2px -2px 0px 0px rgb(var(--d-text-yellow)), inset 2px 2px 0px 0px rgb(var(--d-text-yellow)), 0px 0px 0px 0px rgb(var(--d-text-yellow)) !important;
  transition-property: box-shadow;
  transition-duration: 0.2s;
}
.Row_DetailsOverlay {
  position: absolute;
  background-color: hsl(var(--back-h), var(--back-s), 15%);
  height: calc(var(--cell-height) * 1.3);
  bottom: calc(var(--cell-height) * -1.3);
  z-index: 21;
  width: 75%;
  left: 12.5%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.Main_2 .Row_DetailsOverlay {
  bottom: 0px;
  height: 100%;
  width: 170%;
  left: -170%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background-color: hsl(var(--back-h), var(--back-s), 5%);
}
.Main_Compact .Row_DetailsOverlay {
  width: 100%;
  left: 0;
}
.Row_LikesBox {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.Row_DetailAuthor {
  text-align: center;
  font-size: 9px;
  position: absolute;
  width: 100%;
  bottom: 0;
  color: var(--d-text);
  opacity: 0.5;
}
.Main_2 .Row_DetailAuthor {
  background-color: hsl(var(--back-h), var(--back-s), 5%);
  opacity: 1;
  bottom: revert;
  top: -12px;
  width: auto;
  padding: 1px 4px;
  right: 0;
  color: #8f8f8f;
  border-top-left-radius: 5px;
}
.Main_2 #Car_Layout0 .Row_DetailAuthor {
  top: -2px;
}
.Row_VoteButton .ticon-thumbs_down {
  color: #e54c4c;
}
.Row_VoteButton .ticon-thumbs_down_fill {
  color: #e54c4c;
}
.Row_VoteButton .ticon-thumbs_up {
  color: #78df65
}
.Row_VoteButton .ticon-thumbs_up_fill {
  color: #78df65
}
.Row_VoteIcon {
  font-size: 23px;
}
.Row_VotedAgainst i {
  opacity: 0.4;
}
.Row_UpCount,
.Row_DownCount {
  margin-left: 4px;
}
.Row_CheckDoubtful {
  position: absolute;
  pointer-events: none;
  user-select: none;
  top: 7px;
  left: 2px;
  z-index: -1;
  opacity: 0.7;
}
.Row_CheckDoubtfulIcon {
  font-size: 18px;
  color: #e54c4c;
}
.Main_2 .Row_CheckDoubtful,
.Main_Compact .Row_CheckDoubtful {
  top: unset;
  left: 2px;
  bottom: -3px;
  opacity: 1;
}
.Main_2 .Row_CheckDoubtfulIcon,
.Main_Compact .Row_CheckDoubtfulIcon {
  font-size: 11px;
}
.Row_ModEditIcon {
  font-size: 17px;
}
.Row_ModTrashIcon {
  font-size: 17px;
  color: #e54c4c;
}
.D_Button.Row_UploadButton {
  --height: 23px;
}
.Row_UploadRealLabel {

}
.Row_UploadLabel {
  font-size: 11px;
}
.Row_UploadInput[type="file"] {
  display: none;
}
.Row_Tracks:not(.Row_Cg) .Row_Cell {
  border-right-width: 0;
  user-select: none;
  cursor: grab;
  transform: translate( calc(var(--drag-left) * 1px / var(--drag-left-slo)), calc(var(--drag-top) * 1px / var(--drag-top-slo)) );
}
.Row_Tracks {
  position: relative;
}
.RowTrack_Dragging {
  background-color: #242424;
  box-shadow: 0px 0px 0px 5px #505050;
  border-radius: 10px;
  transition-duration: 0.3s;
  transition-property: background-color, box-shadow, border-radius;
  z-index: 200;
  cursor: grabbing;
}
.RowTrack_Dragging .RowTrack_Header {
  pointer-events: none;
}
.RowTrack_DraggingParent > :not(.RowTrack_Dragging) {
  transition-duration: 0.3s;
  transition-property: transform;
}
.RowTrack_DragIndicator {
  position: absolute;
  left: 0;
  height: 6px;
  width: 100%;
  background-color: dodgerblue;
  bottom: -2px;
  z-index: 21;
  display: none;
}
.Row_Cg.Row_Tracks .Row_Content {
  /* justify-content: center; */
}
/* .RowTrack_Dragging ~ .RowTrack_Layout .RowTrack_DragIndicator {
  display: block;
} */
.Row_Tracks:not(.Row_Cg) .RowTrack_PushLeft {
  transform: translateY(calc(var(--cell-height) * -1));
}
.Row_Tracks:not(.Row_Cg) .RowTrack_PushRight {
  transform: translateY(var(--cell-height));
}
.Main_2 .Row_Tracks:not(.Row_Cg) .RowTrack_PushLeft {
  transform: translateX(calc(var(--cell-width) * -1));
}
.Main_2 .Row_Tracks:not(.Row_Cg) .RowTrack_PushRight {
  transform: translateX(var(--cell-width));
}
.Row_TrackNameBig {
  font-size: 15px;
}
.Main_2 .Row_TrackNameBig {
  font-size: 13px;
}





.Main_2 .Car_Layout:hover .Row_Item:not(:hover),
.Main_2 .Car_Layout:hover .Car_Header2 {
  box-shadow: inset 0px -80px 0px 0px rgb(255, 255, 255, 0.04);
}

@media only screen and (max-width: 767px) {
  .Row_Tracks .Row_Content {
    white-space: normal;
    font-size: 0.7em;
  }
  .Row_DialogCardCard {
    width: 261px !important;
    height: 161px !important;
    --card-font-size: 12px;
  }
}
@media only screen and (max-width: 1200px) {
  .Row_Tracks.Row_Cg .Row_Content {
    white-space: normal;
    font-size: 0.7em;
  }
  
}
@media (pointer:coarse) {
  .Row_ShowMoreButton {
    opacity: 1 !important;
  }
}

</style>