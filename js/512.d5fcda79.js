"use strict";(self["webpackChunktopdrives_records"]=self["webpackChunktopdrives_records"]||[]).push([[512],{421096:function(t,i,a){a.d(i,{A:function(){return c}});var e=function(){var t=this,i=t._self._c;return i("div",{staticClass:"BaseContentLoader_Layout",class:{BaseContentLoader_Contents:t.contents}},["chips"===t.type?i("div",{staticClass:"BaseContentLoader_Chips"},t._m(0),0):"bigBars"===t.type?i("div",{staticClass:"BaseContentLoader_BigBars"},t._l(parseInt(t.count),(function(a){return i("div",{key:a,staticClass:"BaseContentLoader_BigBars_LoadingBox"},[t._o(i("div",{staticClass:"BaseContentLoader_BigBars_LoadingItem",style:{width:`${Math.floor(50*Math.random())+50}%`,height:`${t.itemHeight}px`}}),0,a)])})),0):"agendaDash"===t.type?i("div",{staticClass:"BaseContentLoader_agendaDash"},t._l(parseInt(t.count),(function(t){return i("div",{key:t,staticClass:"BaseContentLoader_Agenda_CompromissoLoadingBox"},[i("div",{staticClass:"BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading1"}),i("div",{staticClass:"BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading2"}),i("div",{staticClass:"BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading3"}),i("div",{staticClass:"BaseContentLoader_Agenda_CompromissoLoadingItem BaseContentLoader_Agenda_CompromissoLoading4"})])})),0):"smallBars"===t.type?i("div",{staticClass:"BaseContentLoader_SmallBars"},t._l(parseInt(t.count),(function(t){return i("div",{key:t,staticClass:"BaseContentLoader_Agenda_LoadingBox"},[i("div",{staticClass:"BaseContentLoader_Agenda_LoadingItem BaseContentLoader_Agenda_Loading1"}),i("div",{staticClass:"BaseContentLoader_Agenda_LoadingItem BaseContentLoader_Agenda_Loading2"}),i("div",{staticClass:"BaseContentLoader_Agenda_LoadingItem BaseContentLoader_Agenda_Loading3"})])})),0):"block"===t.type?i("div",{staticClass:"BaseContentLoader_Recortes"},t._l(parseInt(t.count),(function(a){return i("div",{key:a,staticClass:"BaseContentLoader_Recortes_Item",style:{height:`${t.itemHeight}px`,width:`${t.itemWidth}`}})})),0):t._e()])},n=[function(){var t=this,i=t._self._c;return t._l(parseInt(t.count),(function(t){return i("div",{key:t,staticClass:"BaseContentLoader_Chips_Loading",style:{width:`${Math.floor(90*Math.random())+60}px`}})}))}],s={name:"BaseContentLoader",components:{},props:{type:{type:String,default:"bars"},contents:{type:Boolean,default:!1},count:{type:[Number,String],default:1},itemHeight:{type:Number,default:50},itemWidth:{type:String,default:"100%"}}},o=s,l=a(281656),r=(0,l.A)(o,e,n,!1,null,null,null),c=r.exports},765518:function(t,i,a){a.d(i,{A:function(){return u}});var e=function(){var t=this,i=t._self._c;return t.preActive?i("div",{staticClass:"BaseExpandDiv_Layout",class:{BaseExpandDiv_Active:t.active,BaseExpandDiv_RealActive:t.realActive,BaseExpandDiv_AnimIn:t.animIntro,BaseExpandDiv_AnimOut:t.animOut,BaseExpandDiv_Absolute:t.absolute},style:`--toHeight: ${t.toHeight}`,attrs:{id:t.id}},[t._t("default")],2):t._e()},n=[];let s=0;var o={name:"BaseExpandDiv",components:{},props:{active:{type:Boolean,default:!1}},data(){return s+=1,{id:`p-${s}`,realActive:!1,preActive:!1,animIntro:!1,animOut:!1,absolute:!1,toHeight:"unset",revertHeight:null,memoryHeight:"",introTimeout:null,finishTimeout:null}},watch:{active(t){this.set(t)}},beforeMount(){this.active&&this.set(!0)},mounted(){},computed:{},methods:{set(t){!0===t?(clearTimeout(this.introTimeout),clearTimeout(this.finishTimeout),this.preActive=!0,this.animIntro=!0,this.absolute=!0,this.$nextTick().then((()=>{this.realActive=!0,this.memoryHeight=`${document.querySelector(`#${this.id}`).offsetHeight}px`,this.revertHeight||(this.revertHeight=this.memoryHeight),console.log(this.memoryHeight),this.toHeight="0px"})),setTimeout((()=>{this.revertHeight?this.toHeight=this.revertHeight:this.toHeight=this.memoryHeight,this.absolute=!1}),5),this.introTimeout=setTimeout((()=>{this.animIntro=!1,this.revertHeight=null}),299)):(this.animOut=!0,this.revertHeight?this.toHeight=this.revertHeight:(this.toHeight=`${document.querySelector(`#${this.id}`).offsetHeight}px`,this.revertHeight=this.toHeight),setTimeout((()=>{this.toHeight="0px"}),5),this.finishTimeout=setTimeout((()=>{this.animOut=!1,this.preActive=!1,this.realActive=!1,setTimeout((()=>{this.revertHeight=null,this.toHeight="unset"}),5)}),299))}}},l=o,r=a(281656),c=(0,r.A)(l,e,n,!1,null,null,null),u=c.exports},64512:function(t,i,a){a.r(i),a.d(i,{default:function(){return f}});var e=function(){var t=this,i=t._self._c;return i("div",{staticClass:"MainCommunity_Layout",staticStyle:{"--nWidth":"720px"}},[i("div",{staticClass:"MainCommunity_Group"},[t.sentForReview?i("div",{staticClass:"MainCommunity_SentForReview"},[t._v(t._s(t.$t("p_userSentCommunityForAnalyse")))]):t._e(),t.loading?i("div",{staticClass:"MainCommunity_BoxLoading"},[i("BaseContentLoader",{staticStyle:{padding:"10px 10px 10px 20px",width:"100%"},attrs:{contents:!0,itemWidth:"100%",itemHeight:42,type:"block",count:"5"}})],1):i("div",{staticClass:"MainCommunity_Box"},[t._l(t.list,(function(a,e,n){return i("div",{staticClass:"MainCommunity_Item",class:{MainCommunity_ItemActive:t.expanded[e]}},[a.length>0?[i("button",{staticClass:"D_Button MainCommunity_GroupButton",on:{click:function(i){t.expanded[e]=!t.expanded[e]}}},[2===e.length?i("div",{staticClass:"MainCommunity_GroupFlagBox"},[i("BaseFlag",{staticClass:"MainCommunity_GroupFlag",attrs:{flag:e}})],1):t._e(),i("div",{staticClass:"MainCommunity_GroupLabel"},[t._v(t._s(t.flagNames[e])+" ("+t._s(a.length)+")")]),i("i",{class:t.expanded[e]?"ticon-arrow_up_2":"ticon-arrow_down_2",staticStyle:{"font-size":"0.7em"},attrs:{"aria-hidden":"true"}})]),i("BaseExpandDiv",{staticClass:"MainCommunity_ExpandBlock",attrs:{active:t.expanded[e]}},[i("div",{staticClass:"MainCommunity_SubPack"},t._l(a,(function(a){return i("button",{staticClass:"D_Button MainCommunity_SubItem",on:{click:function(i){return t.socialClick(a,i)}}},[i("i",{staticClass:"MainCommunity_SocialIcon",class:`brand-${a.platform}`,attrs:{"aria-hidden":"true"}}),i("div",{staticClass:"MainCommunity_SocialName"},[t._v(t._s(a.name))]),i("div",{staticClass:"MainCommunity_SocialCount"},[t._v(t._s(t._f("kShort")(a.userCount)))])])})),0)])]:t._e()],2)})),i("div",{staticClass:"MainCommunity_Footer"},[t.user?i("div",{staticClass:"MainCommunity_SubmitYours D_Center"},[i("button",{staticClass:"D_Button Main_LoginToEdit MainCommunity_SubmitYoursButton",on:{click:function(i){return t.newSubmit()}}},[i("i",{staticClass:"ticon-plus_2 D_ButtonIcon MainCommunity_SubmitYoursIcon",attrs:{"aria-hidden":"true"}}),i("span",{staticClass:"MainCommunity_SubmitYoursLabel"},[t._v(t._s(t.$t("m_submitYourCommunity")))])])]):[i("div",{staticClass:"D_Center"},[i("div",{staticClass:"MainCommunity_LoginToSubmit"},[t._v(t._s(t.$t("m_submitYourCommunity"))+"?")])]),i("div",{staticClass:"D_Center Space_Top"},[i("button",{staticClass:"D_Button Main_LoginToEdit",on:{click:function(i){return t.$store.commit("OPEN_LOGIN")}}},[t._v(t._s(t.$t("m_login")))])])]],2)],2)]),i("BaseDialog",{attrs:{active:t.dialogActive,transparent:!1,"max-width":"420px","min-width":"240px"},on:{close:function(i){t.dialogActive=!1,t.forceShowDelete=!1}}},[i("div",{staticClass:"Main_AdvancedDialogBox"},[i("div",{staticClass:"MainCommunity_DialogTitle"},[i("div",{staticClass:"Main_DialogTitle"},[t._v(t._s(t.dialogSocial.name))]),i("div",{staticClass:"MainCommunity_DialogTitleRight"},[i("i",{staticClass:"MainCommunity_DialogTitleIcon",class:`brand-${t.dialogSocial.platform}`,attrs:{"aria-hidden":"true"}}),t.dialogSocial.country&&t.dialogSocial.country.length>0?t._l(t.dialogSocial.country,(function(t){return i("BaseFlag",{staticClass:"MainCommunity_DialogFlag",class:{MainCommunity_DialogFlagGlobal:"global"===t||"inactive"===t},attrs:{flag:t}})})):t._e()],2)]),i("div",{staticClass:"MainCommunity_DialogMid"},[i("div",{staticClass:"MainCommunity_DialogInfo"},[i("div",{staticClass:"MainCommunity_DialogInfoLabel"},[t._v(t._s(t.$t("m_userCount")))]),i("div",{staticClass:"MainCommunity_DialogInfoValue"},[t._v(t._s(t._f("kShort")(t.dialogSocial.userCount)))])]),i("div",{staticClass:"MainCommunity_DialogInfo"},[i("div",{staticClass:"MainCommunity_DialogInfoLabel"},[t._v(t._s(t.$t("m_type")))]),i("div",{staticClass:"MainCommunity_DialogInfoValue"},[t._v(t._s(t.dialogSocial.type?t.$t(`m_${t.dialogSocial.type}`):""))])]),i("div",{staticClass:"MainCommunity_DialogInfo"},[i("div",{staticClass:"MainCommunity_DialogInfoLabel"},[t._v(t._s(t.$t("m_language")))]),i("div",{staticClass:"MainCommunity_DialogInfoValue"},[t._v(t._s(t.dialogSocial.language))])]),"private"===t.dialogSocial.type?i("div",{staticClass:"MainCommunity_DialogInfo"},[i("div",{staticClass:"MainCommunity_DialogInfoLabel"},[t._v(t._s(t.$t("m_inviter")))]),i("div",{staticClass:"MainCommunity_DialogInfoValue",staticStyle:{color:"rgb(var(--d-text-yellow))"}},[t._v(t._s(t.dialogSocial.author))])]):t._e(),t.dialogSocial.description?i("div",{staticClass:"MainCommunity_DialogInfo"},[i("div",{staticClass:"MainCommunity_DialogInfoLabel"},[t._v(t._s(t.$t("m_description")))]),i("div",{staticClass:"MainCommunity_DialogInfoValue"},[t._v(t._s(t.dialogSocial.description))])]):t._e()]),t.dialogSocial.link?i("div",{staticClass:"MainCommunity_DialogLink"},[i("a",{staticClass:"D_Button Main_LoginToEdit MainCommunity_DialogLinkButton",attrs:{target:"_blank",rel:"noopener noreferrer",href:t.dialogSocial.link}},[i("span",{},[t._v(t._s(t.$t("m_link")))]),i("i",{staticClass:"ticon-internal",staticStyle:{"font-size":"0.8em","margin-left":"5px"},attrs:{"aria-hidden":"true"}})]),i("div",{staticClass:"MainCommunity_DialogLinkSub"},[t._v(t._s(t.dialogSocial.link))])]):t._e(),t.dialogSocial.discordId&&t.dialogSocial.infoForInvite?i("div",{staticClass:"MainCommunity_DialogInvite"},[t.user?[i("div",{staticClass:"MainCommunity_DialogInviteTitle"},[t._v(t._s(t.$t("p_communityToBeInvited")))]),i("div",{staticClass:"MainCommunity_DialogInviteNeeded"},[t._v(t._s(t.dialogSocial.infoForInvite))]),i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.dialogTextField,expression:"dialogTextField"}],staticClass:"Main_TextArea data-hj-allow",attrs:{rows:"3",placeholder:""},domProps:{value:t.dialogTextField},on:{input:function(i){i.target.composing||(t.dialogTextField=i.target.value)}}}),t._v(" "),i("div",{staticClass:"D_Center Space_Top"},[i("button",{staticClass:"D_Button Main_SaveAllButton",class:{D_Button_Loading:t.askInviteLoading},attrs:{disabled:t.askInviteLoading||!t.dialogTextField},on:{click:function(i){return t.submitInvite()}}},[t._v(t._s(t.$t("m_send")))])])]:[i("div",{staticClass:"D_Center"},[i("div",{staticClass:"MainCommunity_LoginToSubmit"},[t._v(t._s(t.$t("m_wantToJoin")))])]),i("div",{staticClass:"D_Center Space_Top"},[i("button",{staticClass:"D_Button Main_LoginToEdit",on:{click:function(i){return t.$store.commit("OPEN_LOGIN")}}},[t._v(t._s(t.$t("m_login")))])])]],2):t._e(),t.user&&t.user.mod&&(!1===t.dialogSocial.approved||t.forceShowDelete)?i("div",{staticClass:"MainCommunity_DialogModTools D_Center Space_TopPlus",staticStyle:{gap:"5px"}},[!0===t.dialogSocial.approved?i("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed",class:{D_Button_Loading:t.loading},on:{click:function(i){return t.approveCommunity(t.dialogSocial,!0)}}},[i("span",[t._v(t._s(t.$t("m_delete")))])]):t._e(),!1===t.dialogSocial.approved?i("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2 D_ButtonGreen",class:{D_Button_Loading:t.loading},on:{click:function(i){return t.approveCommunity(t.dialogSocial)}}},[i("span",[t._v(t._s(t.$t("m_approve")))])]):t._e(),!0===t.dialogSocial.approved?i("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2",class:{D_Button_Loading:t.loading},on:{click:function(i){return t.edit(t.dialogSocial)}}},[i("span",[t._v(t._s(t.$t("m_edit")))])]):t._e()]):t._e()])]),i("BaseDialog",{attrs:{active:t.newDialogActive,transparent:!1,"max-width":"420px","min-width":"240px"},on:{close:function(i){t.newDialogActive=!1}}},[i("div",{staticClass:"MainCommunity_DialogSumitLayout"},[i("div",{staticClass:"MainCommunity_DialogTitle"},[i("div",{staticClass:"Main_DialogTitle"},[t._v(t._s(t.$t("m_submitYourCommunity")))])]),i("div",{staticClass:"MainCommunity_DialogSubmitInner",class:{MainCommunity_DialogSubmitInnerNoType:!t.newType,MainCommunity_DialogSubmitInnerWithType:t.newType}},[i("div",{staticClass:"MainCommunity_NewTypeToSelect MainCommunity_NewBoxCenter"},[t._l(t.types,(function(a,e){return[i("BaseChip",{staticClass:"BaseChip_MinWidth BaseChip_DontCrop MainCommunity_DialogSubmitChipType",attrs:{required:"true",value:a},on:{click:function(i){return t.newTypeSet()}},model:{value:t.newType,callback:function(i){t.newType=i},expression:"newType"}},[i("div",[t._v(t._s(t.$t(`m_${a}`)))]),i("div",{staticClass:"MainCommunity_DialogSubmitTypeSub"},[t._v(t._s(t.$t(`p_${a}Descript`)))])])]}))],2),t.newType?i("div",{staticClass:"MainCommunity_BrandSelect MainCommunity_NewBoxCenter Space_TopPlus"},[t.newPlatform?i("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2 MainCommunity_SubmitFlagGroupButton",attrs:{disabled:t.newLoading},on:{click:function(i){t.brandDialog=!0}}},[i("i",{staticClass:"MainCommunity_SubmitSocialIconButton",class:`brand-${t.newPlatform}`,attrs:{"aria-hidden":"true"}}),i("div",{staticClass:"MainCommunity_SocialName MainCommunity_Capitalize"},[t._v(t._s(t.brandLabel[t.newPlatform]?t.brandLabel[t.newPlatform]:t.newPlatform))])]):i("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2",attrs:{disabled:t.newLoading},on:{click:function(i){t.brandDialog=!0}}},[t._v(t._s(t.$t("m_selectPlatform")))]),0===t.newCountry.length?i("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2",attrs:{disabled:t.newLoading},on:{click:function(i){t.countryDialog=!0,t.searchFlag=""}}},[t._v(t._s(t.$t("m_selectCountry")))]):i("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2 MainCommunity_SubmitFlagGroupButton",attrs:{disabled:t.newLoading},on:{click:function(i){t.countryDialog=!0,t.searchFlag=""}}},t._l(t.newCountry,(function(a){return t.newCountry.length>0?i("BaseFlag",{staticClass:"MainCommunity_DialogFlag",attrs:{flag:a}}):t._e()})),1)]):t._e(),t.newType&&t.newPlatform&&t.newCountry.length>0?i("div",{staticClass:"MainCommunity_Text Space_Top"},[i("BaseText",{staticClass:"BaseText_Big",attrs:{type:"normal",disabled:t.newLoading,label:t.$t("c_name"),placeholder:""},model:{value:t.newName,callback:function(i){t.newName=i},expression:"newName"}})],1):t._e(),t.newType&&t.newPlatform&&t.newCountry.length>0?i("div",{staticClass:"MainCommunity_Text MainCommunity_TextDual Space_Top"},[i("BaseText",{staticClass:"BaseText_Big",attrs:{type:"normal",disabled:t.newLoading,label:t.$t("m_language"),placeholder:""},model:{value:t.newLanguage,callback:function(i){t.newLanguage=i},expression:"newLanguage"}}),i("BaseText",{staticClass:"BaseText_Big",attrs:{type:"integer",disabled:t.newLoading,label:t.$t("m_userCount"),placeholder:"0"},model:{value:t.newUserCount,callback:function(i){t.newUserCount=i},expression:"newUserCount"}})],1):t._e(),t.newType&&t.newPlatform&&t.newCountry.length>0?i("div",{staticClass:"MainCommunity_Text Space_Top"},[i("div",{staticClass:"BaseText_Label"},[t._v(t._s(t.$t("m_description")))]),i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.newDescription,expression:"newDescription"}],staticClass:"Main_TextArea data-hj-allow",attrs:{rows:"3",placeholder:t.$t("m_optional")},domProps:{value:t.newDescription},on:{input:function(i){i.target.composing||(t.newDescription=i.target.value)}}})]):t._e(),"public"===t.newType&&t.newPlatform&&t.newCountry.length>0?i("div",{staticClass:"MainCommunity_Text Space_Top"},[i("BaseText",{staticClass:"BaseText_Big",attrs:{type:"normal",disabled:t.newLoading,label:t.$t("m_link"),placeholder:"https://..."},model:{value:t.newLink,callback:function(i){t.newLink=i},expression:"newLink"}})],1):t._e(),"private"===t.newType&&t.newPlatform&&t.newCountry.length>0?[i("div",{staticClass:"MainCommunity_Text Space_Top"},[i("div",{staticClass:"BaseText_Label"},[t._v(t._s(t.$t("m_informationForInvite")))]),i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.newInfoForInvite,expression:"newInfoForInvite"}],staticClass:"Main_TextArea data-hj-allow",attrs:{rows:"5",placeholder:t.$t("p_informationForInvite")},domProps:{value:t.newInfoForInvite},on:{input:function(i){i.target.composing||(t.newInfoForInvite=i.target.value)}}})]),i("div",{staticClass:"MainCommunity_DialogInviteNeeded",staticStyle:{"margin-bottom":"0px"}},[t._v(t._s(t.$t("p_inviteYourDiscord")))])]:t._e(),t.newType&&t.newPlatform&&t.newCountry.length>0?i("div",{staticClass:"D_Center Space_TopPlus"},[i("button",{staticClass:"D_Button Main_SaveAllButton",class:{D_Button_Loading:t.newLoading},attrs:{disabled:t.newLoading||!t.isValidSubmit},on:{click:function(i){return t.submitNewCommunity()}}},[t._v(t._s(t.user&&t.user.mod?t.$t("m_send"):t.$t("m_submitReview")))])]):t._e()],2)])]),i("BaseDialog",{attrs:{active:t.brandDialog,transparent:!1,"max-width":"420px","min-width":"240px"},on:{close:function(i){t.brandDialog=!1}}},[i("div",{staticClass:"MainCommunity_DialogSumitLayout"},[i("div",{staticClass:"MainCommunity_DialogTitle"},[i("div",{staticClass:"Main_DialogTitle"},[t._v(t._s(t.$t("m_platform")))])]),i("div",{staticClass:"MainCommunity_DialogBrandList"},[t._l(t.brands,(function(a,e){return[i("BaseChip",{staticClass:"BaseChip_MinWidth BaseChip_DontCrop MainCommunity_BrandChip",attrs:{required:"true",value:a},on:{click:function(t){}},model:{value:t.newPlatform,callback:function(i){t.newPlatform=i},expression:"newPlatform"}},[i("div",{staticClass:"MainCommunity_DialogBrandBox"},[i("i",{staticClass:"MainCommunity_SocialIcon",class:`brand-${a}`,attrs:{"aria-hidden":"true"}}),i("span",{staticClass:"MainCommunity_SocialName MainCommunity_Capitalize"},[t._v(t._s(t.brandLabel[a]?t.brandLabel[a]:a))])])])]}))],2)])]),i("BaseDialog",{attrs:{active:t.countryDialog,transparent:!1,isStatic:!0,forceScroll:!0,"max-width":"350px","min-width":"240px"},on:{close:function(i){t.countryDialog=!1}}},[i("div",{staticClass:"MainCommunity_DialogFlagSearchLayout"},[i("div",{staticClass:"MainCommunity_DialogTitle"},[i("div",{staticClass:"Main_DialogTitle"},[t._v(t._s(t.$tc("c_country",1)))])]),i("div",{staticClass:"MainCommunity_DialogFlagSearch"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.searchFlag,expression:"searchFlag"}],staticClass:"D_SearchInput MainCommunity_DialogFlagSearchInput data-hj-allow",attrs:{id:"SearchFlagInput",placeholder:t.$t("m_search"),type:"search",autocomplete:"off"},domProps:{value:t.searchFlag},on:{input:function(i){i.target.composing||(t.searchFlag=i.target.value)}}}),t.searchFlag&&t.searchFlag.length>0?i("button",{staticClass:"D_Button MainCommunity_DialogFlagSearchInputClose",on:{click:function(i){t.searchFlag=""}}},[i("i",{staticClass:"ticon-close_2",attrs:{"aria-hidden":"true"}})]):t._e()]),i("div",{staticClass:"MainCommunity_DialogFlagList"},[t._l(t.filteredFlags,(function(a,e,n){return["official"!==e&&"toApprove"!==e?i("BaseChip",{staticClass:"BaseChip_MinWidth BaseChip_DontCrop MainCommunity_FlagChip",attrs:{disabled:!t.newCountry.includes(e)&&t.newCountry.length>=3,value:e},on:{click:function(i){return t.newCountryClick()}},model:{value:t.newCountry,callback:function(i){t.newCountry=i},expression:"newCountry"}},[i("div",{staticClass:"MainCommunity_DialogFlagBox"},[i("BaseFlag",{staticClass:"MainCommunity_DialogFlag",attrs:{flag:e}}),i("span",{staticClass:"MainCommunity_SocialName MainCommunity_Capitalize"},[t._v(t._s(a))])],1)]):t._e()]}))],2)])]),i("BaseLinkDiscord",{attrs:{active:t.dDiscordActive,subText:t.$t("p_linkDiscordExplanationCommu")},on:{close:function(i){t.dDiscordActive=!1},finish:function(i){t.dDiscordActive=!1}}})],1)},n=[],s=(a(728743),a(765518)),o=a(792329),l=a(447108),r=function(){var t=this,i=t._self._c;return i("BaseDialog",{attrs:{active:t.active,transparent:!1,"max-width":"460px","min-width":"240px"},on:{close:function(i){return t.$emit("close")}}},[i("div",{staticStyle:{position:"relative"}},[i("div",{staticClass:"Main_DialogTitle"},[t._v(t._s(t.$t("m_linkDiscord")))]),"getCode"===t.screen?[i("div",{staticClass:"BaseLinkDiscord_SubText"},[t._v(" "+t._s(t.subTextComputed.split("•").join("\n•"))+" ")]),i("div",{staticClass:"BaseLinkDiscord_Mid Space_TopPlus"},[i("BaseText",{staticClass:"BaseText_Big",attrs:{type:"integer",disabled:t.loading,label:t.$t("m_discordUserId"),placeholder:"0123456789012345678"},model:{value:t.userId,callback:function(i){t.userId=i},expression:"userId"}})],1),i("div",{staticClass:"D_Center Space_Top"},[i("button",{staticClass:"D_Button Main_SaveAllButton",class:{D_Button_Loading:t.loading},attrs:{disabled:t.loading},on:{click:function(i){return t.getCode()}}},[t._v(t._s(t.$t("m_send")))])])]:t._e(),"inputCode"===t.screen?[i("div",{staticClass:"BaseLinkDiscord_SubText"},[t._v(" "+t._s(t.$t("p_linkDiscordCodeSent"))+" ")]),i("div",{staticClass:"BaseLinkDiscord_Mid Space_TopPlus"},[i("BaseText",{staticClass:"BaseText_Big",attrs:{type:"integer",disabled:t.loading,label:t.$t("m_sixDigitCode"),placeholder:"000000"},model:{value:t.code,callback:function(i){t.code=i},expression:"code"}})],1),i("div",{staticClass:"D_Center Space_Top"},[i("button",{staticClass:"D_Button Main_SaveAllButton",class:{D_Button_Loading:t.loading},attrs:{disabled:t.loading},on:{click:function(i){return t.confirmCode()}}},[t._v(t._s(t.$t("m_send")))])])]:t._e(),"finish"===t.screen?[i("div",{staticClass:"BaseLinkDiscord_Finish"},[i("i",{staticClass:"ticon-correct_1 BaseLinkDiscord_FinishIcon",attrs:{"aria-hidden":"true"}}),i("div",[t._v(t._s(t.$t("m_discordLinkFinish")))])])]:t._e()],2)])},c=[],u=a(290481),d={name:"BaseLinkDiscord",components:{BaseDialog:l.A,BaseText:u.A},model:{prop:"active",event:"close"},props:{active:{type:Boolean,default:!1},subText:{type:String,default:""}},data(){return{screen:"getCode",userId:"",code:"",loading:!1}},watch:{},beforeMount(){},mounted(){},computed:{subTextComputed(){return this.subText?`${this.subText} ${this.$t("p_linkDiscordExplanationP2")}`:`${this.$t("p_linkDiscordExplanationP1")} ${this.$t("p_linkDiscordExplanationP2")}`}},methods:{getCode(){this.userId&&!isNaN(Number(this.userId))&&(this.userId=`${this.userId}`,this.loading=!0,axios.post(Vue.preUrl+"/discordSendCode",{discordId:this.userId}).then((t=>{this.loading=!1,this.screen="inputCode"})).catch((t=>{this.loading=!1,console.log(t),this.$store.commit("DEFINE_SNACK",{active:!0,error:!0,text:t,type:"error"})})))},confirmCode(){this.code&&!isNaN(Number(this.code))&&(this.userId=`${this.userId}`,this.loading=!0,axios.post(Vue.preUrl+"/discordConfirmCode",{discordId:this.userId,code:Number(this.code)}).then((t=>{this.loading=!1,this.screen="finish",this.$store.commit("AUTH",{})})).catch((t=>{this.loading=!1,console.log(t),this.$store.commit("DEFINE_SNACK",{active:!0,error:!0,text:t,type:"error"})})))}}},m=d,g=a(281656),_=(0,g.A)(m,r,c,!1,null,null,null),h=_.exports,p=a(5693),C=a(421096),v={name:"MainCommunity",components:{BaseExpandDiv:s.A,BaseFlag:o.A,BaseDialog:l.A,BaseLinkDiscord:h,BaseChip:p.A,BaseText:u.A,BaseContentLoader:C.A},props:{test:{type:Boolean,default:!1}},data(){return{user:null,unsubscribe:null,forceShowDelete:!1,loading:!1,list:{toApprove:[],official:[],global:[]},flagNames:{toApprove:"For review",official:"Official",global:"Global",inactive:"Inactive",ad:"Andorra",ae:"United Arab Emirates",af:"Afghanistan",ag:"Antigua and Barbuda",ai:"Anguilla",al:"Albania",am:"Armenia",ao:"Angola",aq:"Antarctica",ar:"Argentina",as:"American Samoa",at:"Austria",au:"Australia",aw:"Aruba",ax:"Åland Islands",az:"Azerbaijan",ba:"Bosnia and Herzegovina",bb:"Barbados",bd:"Bangladesh",be:"Belgium",bf:"Burkina Faso",bg:"Bulgaria",bh:"Bahrain",bi:"Burundi",bj:"Benin",bl:"Saint Barthélemy",bm:"Bermuda",bn:"Brunei Darussalam",bo:"Bolivia",br:"Brazil",bs:"Bahamas",bt:"Bhutan",bv:"Bouvet Island",bw:"Botswana",by:"Belarus",bz:"Belize",ca:"Canada",cc:"Cocos Islands",cd:"Congo (the Democratic Republic of the)",cf:"Central African Republic",cg:"Congo",ch:"Switzerland",ci:"Côte d'Ivoire",ck:"Cook Islands",cl:"Chile",cm:"Cameroon",cn:"China",co:"Colombia",cr:"Costa Rica",cu:"Cuba",cv:"Cabo Verde",cw:"Curaçao",cx:"Christmas Island",cy:"Cyprus",cz:"Czechia",de:"Germany",dj:"Djibouti",dk:"Denmark",dm:"Dominica",do:"Dominican Republic",dz:"Algeria",ec:"Ecuador",ee:"Estonia",eg:"Egypt",eh:"Western Sahara",er:"Eritrea",es:"Spain",et:"Ethiopia",fi:"Finland",fj:"Fiji",fk:"Falkland Islands",fm:"Micronesia",fo:"Faroe Islands",fr:"France",ga:"Gabon",gb:"United Kingdom",gd:"Grenada",ge:"Georgia",gf:"French Guiana",gg:"Guernsey",gh:"Ghana",gi:"Gibraltar",gl:"Greenland",gm:"Gambia",gn:"Guinea",gp:"Guadeloupe",gq:"Equatorial Guinea",gr:"Greece",gs:"South Georgia and the South Sandwich Islands",gt:"Guatemala",gu:"Guam",gw:"Guinea-Bissau",gy:"Guyana",hk:"Hong Kong",hm:"Heard Island and McDonald Islands",hn:"Honduras",hr:"Croatia",ht:"Haiti",hu:"Hungary",id:"Indonesia",ie:"Ireland",il:"Israel",im:"Isle of Man",in:"India",io:"British Indian Ocean Territory",iq:"Iraq",ir:"Iran",is:"Iceland",it:"Italy",je:"Jersey",jm:"Jamaica",jo:"Jordan",jp:"Japan",ke:"Kenya",kg:"Kyrgyzstan",kh:"Cambodia",ki:"Kiribati",km:"Comoros",kn:"Saint Kitts and Nevis",kp:"Korea (the Democratic People's Republic of)",kr:"Korea (the Republic of)",kw:"Kuwait",ky:"Cayman Islands",kz:"Kazakhstan",la:"Lao People's Democratic Republic",lb:"Lebanon",lc:"Saint Lucia",li:"Liechtenstein",lk:"Sri Lanka",lr:"Liberia",ls:"Lesotho",lt:"Lithuania",lu:"Luxembourg",lv:"Latvia",ly:"Libya",ma:"Morocco",mc:"Monaco",md:"Moldova",me:"Montenegro",mf:"Saint Martin",mg:"Madagascar",mh:"Marshall Islands",mk:"Republic of North Macedonia",ml:"Mali",mm:"Myanmar",mn:"Mongolia",mo:"Macao",mp:"Northern Mariana Islands",mq:"Martinique",mr:"Mauritania",ms:"Montserrat",mt:"Malta",mu:"Mauritius",mv:"Maldives",mw:"Malawi",mx:"Mexico",my:"Malaysia",mz:"Mozambique",na:"Namibia",nc:"New Caledonia",ne:"Niger",nf:"Norfolk Island",ng:"Nigeria",ni:"Nicaragua",nl:"Netherlands",no:"Norway",np:"Nepal",nr:"Nauru",nu:"Niue",nz:"New Zealand",om:"Oman",pa:"Panama",pe:"Peru",pf:"French Polynesia",pg:"Papua New Guinea",ph:"Philippines",pk:"Pakistan",pl:"Poland",pm:"Saint Pierre and Miquelon",pn:"Pitcairn",pr:"Puerto Rico",ps:"Palestine, State of",pt:"Portugal",pw:"Palau",py:"Paraguay",qa:"Qatar",re:"Réunion",ro:"Romania",rs:"Serbia",ru:"Russian Federation",rw:"Rwanda",sa:"Saudi Arabia",sb:"Solomon Islands",sc:"Seychelles",sd:"Sudan",se:"Sweden",sg:"Singapore",sh:"Saint Helena, Ascension and Tristan da Cunha",si:"Slovenia",sj:"Svalbard and Jan Mayen",sk:"Slovakia",sl:"Sierra Leone",sm:"San Marino",sn:"Senegal",so:"Somalia",sr:"Suriname",ss:"South Sudan",st:"Sao Tome and Principe",sv:"El Salvador",sx:"Sint Maarten (Dutch part)",sy:"Syrian Arab Republic",sz:"Eswatini",tc:"Turks and Caicos Islands",td:"Chad",tf:"French Southern Territories",tg:"Togo",th:"Thailand",tj:"Tajikistan",tk:"Tokelau",tl:"Timor-Leste",tm:"Turkmenistan",tn:"Tunisia",to:"Tonga",tr:"Turkey",tt:"Trinidad and Tobago",tv:"Tuvalu",tw:"Taiwan",tz:"Tanzania",ua:"Ukraine",ug:"Uganda",um:"United States Minor Outlying Islands",us:"United States of America",uy:"Uruguay",uz:"Uzbekistan",va:"Holy See",vc:"Saint Vincent and the Grenadines",ve:"Venezuela",vg:"Virgin Islands (British)",vi:"Virgin Islands (U.S.)",vn:"Viet Nam",vu:"Vanuatu",wf:"Wallis and Futuna",ws:"Samoa",ye:"Yemen",yt:"Mayotte",za:"South Africa",zm:"Zambia",zw:"Zimbabwe"},expanded:{},dialogActive:!1,dialogSocial:{},dialogTextField:"",askInviteLoading:!1,dDiscordActive:!1,newDialogActive:!1,newLoading:!1,newCid:"",newType:"",newName:"",newPlatform:null,newCountry:[],newLanguage:null,newUserCount:null,newDescription:"",newInfoForInvite:"",newLink:"",types:["private","public"],brandDialog:!1,countryDialog:!1,searchFlag:"",brands:["discord","facebook","icq","instagram","line","linkedin","mastodon","messenger","microsoftteams","pinterest","qq","quora","reddit","signal","sinaweibo","skype","slack","snapchat","telegram","tiktok","tumblr","twitch","x","viber","vk","wechat","whatsapp","youtube"],brandLabel:{googlehangouts:"Hangouts",icq:"ICQ",microsoftteams:"Teams",vk:"VK",qq:"QQ",whatsapp:"WhatsApp"},sentForReview:!1}},watch:{},beforeMount(){this.user=this.$store.state.user,Object.keys(this.list).map((t=>{Vue.set(this.expanded,t,!1)})),this.expanded.official=!0,this.expanded.global=!0,this.expanded.toApprove=!0,this.searchCommunities()},mounted(){let t=this;t.unsubscribe=t.$store.subscribe((i=>{"CHANGE_USER"==i.type&&(t.user=i.payload.user),"LOGOUT"==i.type&&(t.user=null)}))},computed:{filteredFlags(){if(!this.searchFlag)return this.flagNames;let t={},i=this.searchFlag.toLowerCase(),a=i.split(" ");return Object.keys(this.flagNames).map((e=>{let n=[];return i===e?t[e]=this.flagNames[e]:(a.map((t=>{this.flagNames[e].toLowerCase().includes(t)&&n.push(t)})),n.length===a.length?t[e]=this.flagNames[e]:void 0)})),t},isValidSubmit(){return!!this.newType&&(!("private"===this.newType&&!this.newInfoForInvite)&&(!("public"===this.newType&&!this.newLink)&&(!!this.newPlatform&&(0!==this.newCountry.length&&(!!this.newLanguage&&!(isNaN(this.newUserCount)||Number(this.newUserCount)<0))))))}},methods:{searchCommunities(){this.loading=!0,axios.get(Vue.preUrl+"/searchCommunities").then((t=>{this.resetList(),t.data.notApproved&&t.data.notApproved.map((t=>{this.list.toApprove.push(t)}));let i=["official"];t.data.approved.map((t=>{t.country&&0!==t.country.length?t.country.map((t=>{i.push(t)})):console.log("no country",t)})),i=[...new Set(i)],i.sort(((t,i)=>"inactive"===t?1:"inactive"===i?-1:(this.flagNames[t]||"").localeCompare(this.flagNames[i]||""))),i.map((t=>{this.list[t]=[],this.expanded[t]||Vue.set(this.expanded,t,!1)})),t.data.approved.map((t=>{t.country&&0!==t.country.length&&("official"!==t.type?t.country.map((i=>{this.list[i].push(t)})):this.list.official.push(t))})),this.loading=!1})).catch((t=>{this.loading=!1,console.log(t),this.$store.commit("DEFINE_SNACK",{active:!0,error:!0,text:t,type:"error"})}))},socialClick(t,i){i&&i.shiftKey&&(i.ctrlKey||i.metaKey)&&this.user&&this.user.mod&&(this.forceShowDelete=!0),this.dialogActive=!0,this.dialogSocial=t,this.dialogTextField=""},submitInvite(){this.askInviteLoading=!0;let t={cid:this.dialogSocial.cid,askText:this.dialogTextField};axios.post(Vue.preUrl+"/askInviteCommunity",t).then((t=>{this.askInviteLoading=!1,this.dialogActive=!1,this.dialogTextField="",this.$store.commit("DEFINE_SNACK",{active:!0,correct:!0,text:this.$t("m_requestSent")})})).catch((t=>{this.askInviteLoading=!1,console.log(t),this.$store.commit("DEFINE_SNACK",{active:!0,error:!0,text:t,type:"error"})}))},newSubmit(t){t&&(this.newCountry=[t]),this.newCid="",this.newDialogActive=!0},newCountryClick(){this.newCountry.length>3&&(this.newCountry=this.newCountry.filter(((t,i)=>i<=2)))},newTypeSet(){"private"!==this.newType||this.user&&this.user.discordName||(this.newType=null,this.newDialogActive=!1,this.dDiscordActive=!0)},submitNewCommunity(){let t={name:this.newName,platform:this.newPlatform,type:this.newType,language:this.newLanguage,country:this.newCountry,userCount:Number(this.newUserCount)};this.newDescription&&(t.description=this.newDescription),"private"===this.newType&&(t.infoForInvite=this.newInfoForInvite),"public"===this.newType&&(t.link=this.newLink),this.newCid&&(t.cid=this.newCid,t.isEdit=!0),this.newLoading=!0,axios.post(Vue.preUrl+"/updateCommunity",t).then((t=>{this.newLoading=!1,this.$store.commit("DEFINE_SNACK",{active:!0,correct:!0,text:this.user.mod?this.$t("m_saveSuccess"):this.$t("m_sentReview")}),this.newDialogActive=!1,this.user.mod?(this.loading=!0,setTimeout((()=>{this.searchCommunities()}),3e3)):(window.scrollTo({top:0}),this.sentForReview=!0),setTimeout((()=>{this.resetNew()}),100)})).catch((t=>{this.newLoading=!1,console.log(t),this.$store.commit("DEFINE_SNACK",{active:!0,error:!0,text:t,type:"error"})}))},resetNew(){this.newLoading=!1,this.newType="",this.newName="",this.newPlatform=null,this.newCountry=[],this.newLanguage=null,this.newUserCount=null,this.newDescription="",this.newInfoForInvite="",this.newLink=""},resetList(){this.list={toApprove:[],official:[],global:[]},this.expanded={toApprove:!0,official:!0,global:!0}},scrollToBottom(){window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})},approveCommunity(t,i=!1){let a={cid:t.cid};i?a.isDelete=!0:a.isApprove=!0,this.loading=!0,axios.post(Vue.preUrl+"/updateCommunity",a).then((t=>{this.$store.commit("DEFINE_SNACK",{active:!0,correct:!0,text:this.$t("m_saveSuccess")}),this.dialogActive=!1,setTimeout((()=>{this.searchCommunities()}),3e3)})).catch((t=>{this.loading=!1,console.log(t),this.$store.commit("DEFINE_SNACK",{active:!0,error:!0,text:t,type:"error"})}))},edit(t){this.newCid=t.cid,this.newName=t.name,this.newPlatform=t.platform,this.newType=t.type,this.newLanguage=t.language,this.newCountry=t.country,this.newUserCount=t.userCount,this.newDescription=t.description||"",this.newInfoForInvite=t.infoForInvite||"",this.newLink=t.link||"",this.dialogActive=!1,this.newDialogActive=!0}},beforeDestroy(){this.unsubscribe()}},y=v,w=(0,g.A)(y,e,n,!1,null,null,null),f=w.exports}}]);
//# sourceMappingURL=512.d5fcda79.js.map