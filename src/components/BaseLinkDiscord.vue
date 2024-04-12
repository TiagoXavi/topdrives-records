<template>
  <BaseDialog
    :active="active"
    :transparent="false"
    max-width="460px"
    min-width="240px"
    @close="$emit('close')">
    <div style="position: relative;">
      <div class="Main_DialogTitle">{{ $t("m_linkDiscord") }}</div>
      <template v-if="screen === 'getCode'">
        <div class="BaseLinkDiscord_SubText">
          {{ subTextComputed.split("•").join("\n•") }}
        </div>

        <div class="BaseLinkDiscord_Mid Space_TopPlus">
          <BaseText
            v-model="userId"
            class="BaseText_Big"
            type="integer"
            :disabled="loading"
            :label="$t('m_discordUserId')"
            placeholder="0123456789012345678" />
        </div>

        <div class="D_Center Space_Top">
          <button
            :class="{ D_Button_Loading: loading }"
            :disabled="loading"
            class="D_Button Main_SaveAllButton"
            @click="getCode()">{{ $t("m_send") }}</button>
        </div>
      </template>
      <template v-if="screen === 'inputCode'">
        <div class="BaseLinkDiscord_SubText">
          {{ $t('p_linkDiscordCodeSent') }}
        </div>

        <div class="BaseLinkDiscord_Mid Space_TopPlus">
          <BaseText
            v-model="code"
            class="BaseText_Big"
            type="integer"
            :disabled="loading"
            :label="$t('m_sixDigitCode')"
            placeholder="000000" />
        </div>

        <div class="D_Center Space_Top">
          <button
            :class="{ D_Button_Loading: loading }"
            :disabled="loading"
            class="D_Button Main_SaveAllButton"
            @click="confirmCode()">{{ $t("m_send") }}</button>
        </div>
      </template>
      <template v-if="screen === 'finish'">
        <div class="BaseLinkDiscord_Finish">
          <i class="ticon-correct_1 BaseLinkDiscord_FinishIcon" aria-hidden="true"/>
          <div>{{ $t("m_discordLinkFinish") }}</div>
        </div>
      </template>


    </div>
  </BaseDialog>
</template>

<script>
import BaseDialog from './BaseDialog.vue'
import BaseText from './BaseText.vue'

export default {
  name: 'BaseLinkDiscord',
  components: {
    BaseDialog,
    BaseText
  },
  model: {
    prop: 'active',
    event: 'close'
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    subText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      screen: "getCode",
      userId: "",
      code: "",
      loading: false
    }
  },
  watch: {},
  beforeMount() {
    
  },
  mounted() {},
  computed: {
    subTextComputed() {
      if (this.subText) return `${this.subText} ${this.$t('p_linkDiscordExplanationP2')}`;
      return `${this.$t('p_linkDiscordExplanationP1')} ${this.$t('p_linkDiscordExplanationP2')}`;
    }
  },
  methods: {
    getCode() {
      if (!this.userId || isNaN(Number(this.userId))) return;

      this.userId = `${this.userId}`;

      this.loading = true;

      axios.post(Vue.preUrl + "/discordSendCode", {
        discordId: this.userId
      })
      .then(res => {
        this.loading = false;
        this.screen = "inputCode";
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    confirmCode() {
      if (!this.code || isNaN(Number(this.code))) return;

      this.userId = `${this.userId}`;

      this.loading = true;

      axios.post(Vue.preUrl + "/discordConfirmCode", {
        discordId: this.userId,
        code: Number(this.code),
      })
      .then(res => {
        this.loading = false;
        this.screen = "finish";
        this.$store.commit("AUTH", {});
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
  },
}
</script>

<style>
.BaseLinkDiscord_SubText {
  white-space: pre-line;
}
.BaseLinkDiscord_Finish {
  text-align: center;
  padding: 40px 20px;
  color: rgb(var(--d-text-green));
}
.BaseLinkDiscord_FinishIcon {
  font-size: 60px;
}
</style>