(self["webpackChunktopdrives_records"]=self["webpackChunktopdrives_records"]||[]).push([[668],{362952:function(e,a,t){"use strict";t.d(a,{A:function(){return d}});var s=function(){var e=this,a=e._self._c;return a("div",{ref:"container",staticClass:"BaseCardGallery_Layout"},[e.fixBack?a("div",{staticClass:"BaseCardGallery_FixBack"}):e._e(),a("div",{staticClass:"Car_Header BaseCardGallery_Header",class:{Row_DialogCardCard2:!e.options,Car_Loading:e.downloadLoading},style:`--class-color: ${e.carClassColor};`},[a("img",{staticClass:"Car_ImgTag",attrs:{src:e.carPhoto,loading:"lazy",alt:""}}),a("div",{staticClass:"Car_HeaderBlockYear",staticStyle:{"backdrop-filter":"none"}},[e._v(e._s(e.car.year||"-"))]),a("div",{staticClass:"Car_HeaderBlockCountry"},[e._v(e._s(e.car.country||"-"))]),a("div",{staticClass:"Car_HeaderBlockTires"},[a("span",[e._v(e._s(e.$t(`c_${e.car.tyres.toLowerCase()}`)||"-"))]),a("span",[e._v(" "+e._s(e.$tc("c_tyre",2)))])]),e.tuneText?a("div",{staticClass:"Car_TuneTipGallery"},[e._v(e._s(e.tuneText))]):e._e(),a("div",{staticClass:"Car_HeaderBlockRQ"},[a("div",{staticClass:"Car_HeaderRQValue",class:{Car_HeaderRQValue3:e.car&&e.car.rq>99}},[e._v(e._s(e.car.rq))]),a("div",{staticClass:"Car_HeaderRQLabel"},[e._v("RQ")])]),a("div",{staticClass:"Car_HeaderBlockClass"},[a("div",{staticClass:"Car_HeaderClassBack"}),a("div",{staticClass:"Car_HeaderClassValue"},[e._v(e._s(e._f("resolveClass")(this.car.rq,this.car.class,"letter")))])]),a("div",{staticClass:"Car_HeaderBlockTopSpeed"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e._f("resolveStat")(e.car,"topSpeed",e.customData)))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v(e._s(e.$t("c_topSpeed").toUpperCase()))])]),a("div",{staticClass:"Car_HeaderBlock060"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e._f("resolveStat")(e.car,"acel",e.customData)))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v("0-60MPH")])]),a("div",{staticClass:"Car_HeaderBlockHandling"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e._f("resolveStat")(e.car,"hand",e.customData)))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v(e._s(e.$t("c_handling").toUpperCase()))])]),a("div",{staticClass:"Car_HeaderBlockDrive"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e.car.drive||"-"))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v(e._s(e.$tc("c_drive",1).toUpperCase()))])]),a("div",{staticClass:"Car_HeaderName",class:{Car_HeaderNameBig:e.car.name.length>30,Car_HeaderNameBigBig:e.car.name.length>36}},[e._v(e._s(e.car.name))])])])},r=[],i=(t(468312),{name:"BaseCardGallery",components:{},props:{car:{type:Object,default(){return{}}},options:{type:Boolean,default:!0},fixBack:{type:Boolean,default:!1},temp:{type:Number,default:1},downloadLoading:{type:Boolean,default:!1},customData:{type:Object,default(){return null}},oldpic:{type:Boolean,default:!1},tuneText:{requred:!1}},data(){return{}},watch:{},beforeMount(){},mounted(){},computed:{carClassColor(){return Vue.resolveClass(this.car.rq,this.car.class,"color")},carPhoto(){let e;try{e=this.oldpic?t(245244)("./"+this.car.rid+".jpg"):this.car.photoId?t(462416)("./"+this.car.photoId+".jpg"):t(5533)("./"+this.car.rid+".jpg")}catch(a){return""}return e}},methods:{}}),o=i,n=t(281656),c=(0,n.A)(o,s,r,!1,null,null,null),d=c.exports},996668:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return h}});var s=function(){var e=this,a=e._self._c;return a("div",{staticClass:"MainCodeUtility_Layout"},[a("div",{staticClass:"inputs_layout"},[a("BaseText",{staticClass:"Space_Bottom",attrs:{type:"normal",placeholder:"paste here"},on:{paste:function(a){return e.intercept(a)}},model:{value:e.textModel,callback:function(a){e.textModel=a},expression:"textModel"}})],1),e.result&&e.result.resultData?a("div",[a("div",{staticClass:"round_layout"},[a("div",{staticClass:"round_boxes"},e._l(e.result.resultData.roundScores,(function(t,s){return a("div",{staticClass:"round_boxesItem"},[a("div",{staticClass:"MainCodeUtility_CardBox"},[a("BaseCardGallery",{staticClass:"MainCodeUtility_GalleryCard",attrs:{car:e.result.resultData.roundData[s].opponentData.car,options:!1,tuneText:e.result.resultData.roundData[s].opponentData.car.selectedTune}})],1),e.result.resultData.roundData[s].playerData.distance<2546||e.result.resultData.roundData[s].playerData.distance>2548.7?[a("div",{staticClass:"round_boxesThey",class:{round_suspect:/\.\d\d95$/.test(`${e.result.resultData.roundData[s].opponentData.time}`)}},["Finished"===e.result.resultData.roundData[s].opponentData.result?a("span",[e._v(e._s(e.result.resultData.roundData[s].opponentData.time.toHHMMSS()))]):a("span",{staticClass:"round_boxesPointRed"},[e._v("DNF")])])]:[a("div",{staticClass:"round_boxesThey"},[a("span",[e._v(e._s(e.result.resultData.roundData[s].opponentData.speed.toTestBowl()))])])],a("div",{staticStyle:{width:"100%","min-height":"1px","background-color":"#ffffff44","margin-top":"10px"}}),a("div",{staticClass:"round_boxesPoint",class:"round_boxesPoint"+(t>0?"Green":t<0?"Red":"Grey")},[e._v(e._s(t))]),a("div",{staticClass:"MainCodeUtility_CardBox"},[a("BaseCardGallery",{staticClass:"MainCodeUtility_GalleryCard",attrs:{car:e.result.resultData.roundData[s].playerData.car,options:!1,tuneText:e.result.resultData.roundData[s].playerData.car.selectedTune}})],1),e.result.resultData.roundData[s].playerData.distance<2546||e.result.resultData.roundData[s].playerData.distance>2548.7?[a("div",{staticClass:"round_boxesYou",class:{round_suspect:/\.\d\d95$/.test(`${e.result.resultData.roundData[s].playerData.time}`)}},["Finished"===e.result.resultData.roundData[s].playerData.result?a("span",[e._v(e._s(e.result.resultData.roundData[s].playerData.time.toHHMMSS()))]):a("span",{staticClass:"round_boxesPointRed"},[e._v("DNF")])])]:[a("div",{staticClass:"round_boxesYou"},[a("span",[e._v(e._s(e.result.resultData.roundData[s].playerData.speed.toTestBowl()))])])]],2)})),0),a("div",{staticClass:"round_scores"},[a("div",{staticClass:"resul_Stars"},[e.result.prizeBoard&&e.result.resultData.playerScore-e.result.resultData.opponentScore>=e.result.prizeBoard.starPoints[2]?a("span",{staticClass:"starYou"},[e._v("★★★")]):e.result.prizeBoard&&e.result.resultData.playerScore-e.result.resultData.opponentScore>=e.result.prizeBoard.starPoints[1]?a("span",{staticClass:"starYou"},[e._v("★★☆")]):e.result.prizeBoard&&e.result.resultData.playerScore-e.result.resultData.opponentScore>e.result.prizeBoard.starPoints[0]?a("span",{staticClass:"starYou"},[e._v("★☆☆")]):a("span",{staticClass:"starYou",staticStyle:{color:"#5c5c5c"}},[e._v("☆☆☆")])]),a("span",{staticClass:"round_scoresYou"},[e._v(e._s(e.result.resultData.playerScore))]),a("span",{staticClass:"round_scoresX"},[e._v("x")]),a("span",{staticClass:"round_scoresThey"},[e._v(e._s(e.result.resultData.opponentScore))])])])]):e._e(),e._m(0),a("div",{staticClass:"buttons_Layout"},e._l(e.buttons,(function(t){return a("button",{on:{click:function(a){return e.createLadderDetail(t.id)}}},[e._v(e._s(t.name))])})),0),a("div",{staticClass:"MainCodeUtility_ClubsResult"},e._l(e.clubsParsedResult,(function(t,s){return a("div",{staticClass:"MainCodeUtility_ClubsDayBox"},[a("div",{staticClass:"MainCodeUtility_Day"},[e._v(e._s(s))]),a("div",{staticClass:"MainCodeUtility_ClubList"},[a("div",{staticClass:"MainCodeUtility_ClubListTitle"},[e._v("Tracksets")]),a("div",{staticClass:"MainCodeUtility_ClubListBox"},e._l(t.tracksets,(function(t,s){return a("div",{staticClass:"MainCodeUtility_ClubListBoxItem"},[a("div",[e._v(e._s(t)+" "),a("span",{staticClass:"MainCodeUtility_ClubListSub"},[e._v(e._s(s))])])])})),0)]),a("div",{staticClass:"MainCodeUtility_ClubList"},[a("div",{staticClass:"MainCodeUtility_ClubListTitle"},[e._v("Criterias")]),a("div",{staticClass:"MainCodeUtility_ClubListBox"},e._l(t.criterias,(function(t,s){return a("div",{staticClass:"MainCodeUtility_ClubListBoxItem"},[a("div",[e._v(e._s(t)+" "),a("span",{staticClass:"MainCodeUtility_ClubListSub"},[e._v(e._s(s))])])])})),0)])])})),0),e.possiblesResult.length>0?a("div",{staticClass:"MainCodeUtility_ClubsResult"},e._l(e.possiblesResult,(function(t){return a("div",{staticClass:"MainCodeUtility_"},[a("div",{staticClass:"MainCodeUtility_Day"},[e._v(e._s(t.uuid))]),a("div",{staticClass:"MainCodeUtility_ClubListBox"},e._l(t.names,(function(t){return a("div",{staticClass:"MainCodeUtility_ClubListBoxItem"},[a("div",[e._v(e._s(t))])])})),0)])})),0):e._e(),a("div",{staticClass:"MainCollageMaker_Layout"},[a("div",{staticClass:"MainCollageMaker_Grid"},e._l(e.images,(function(t,s){return a("div",{staticClass:"MainCollageMaker_Div",on:{click:function(a){return e.askDelete(s)}}},[a("img",{staticClass:"MainCollageMaker_Img",attrs:{src:t,loading:"lazy",alt:""}})])})),0)])])},r=[function(){var e=this,a=e._self._c;return a("div",{staticClass:"for_copy"},[a("div",{staticClass:"editable-not-editable"})])}],i=(t(728743),t(290481)),o=t(362952),n=t(589241),c={name:"MainCodeUtility",components:{BaseText:i.A,BaseCardGallery:o.A},props:{test:{type:Boolean,default:!1}},data(){return{textModel:"",carsUuids:[],result:{},tempEventSync:{},challenges:{},buttons:[],clubTDRDays:{},localCriteriaIds:{},localTracksetsIds:{},localUUIDtoName:{},clubHutchHistory:[],clubHutchHistoryFormated:{},letResolvedCriterias:{},letResolvedTracksets:{},clubsParsedResult:{},possiblesResult:[],cars_final:n,roundNumber:null,images:[],currentIndex:-1}},watch:{},beforeMount(){this.result={},setTimeout((()=>{for(const e of document.getElementsByClassName("editable-not-editable"))e.setAttribute("contenteditable",!0),e.spellcheck=!1,e.oncut=()=>!1,e.onpaste=()=>!1,e.onkeydown=e=>{e.metaKey||e.ctrlKey||e.preventDefault()}}),100),Number.prototype.toHHMMSS=function(){var e=Number(this.toFixed(3).slice(0,-1)),a=parseInt(e,10),t=Math.floor(a/3600),s=Math.floor((a-3600*t)/60),r=a-3600*t-60*s,i=Math.round(100*(e-parseInt(e)));return t<10&&(t="0"+t),s<10&&(s="0"+s),r<10&&(r="0"+r),i<10&&(i="0"+i),s+":"+r+":"+i},Number.prototype.toTestBowl=function(){return parseInt(2.2369*this)},this.loadClubs()},mounted(){window.addEventListener("paste",this.handlePaste),window.addEventListener("keyup",this.handleKeyUp)},beforeDestroy(){window.removeEventListener("paste",this.handlePaste),window.removeEventListener("keyup",this.handleKeyUp)},computed:{},methods:{handleKeyUp(e){0!==this.images.length&&(e.shiftKey||e.ctrlKey||e.metaKey||"KeyP"!==e.code&&"KeyC"!==e.code||this.sharePrint(e.code))},handlePaste(e){e.preventDefault();for(const a of e.clipboardData.files)if(a.type.startsWith("image/")){const e=URL.createObjectURL(a);this.images.push(e)}},intercept(e){let a=e.clipboardData.getData("text");36===a.length?this.result=a:this.result=JSON.parse(a),this.result.resultData&&this.resolveRaces(),this.result.tieredPrizes&&this.resolveEvents(),this.result.ladders&&this.resolveLadders(),this.result.ladder&&this.resolveLadderInner(),this.result.Message&&this.resolveClubs(),this.result.playerDeck&&this.resolvePlayerDeck(),"string"===typeof this.result&&36===this.result.length&&this.lookUuid(),setTimeout((()=>{e.srcElement.value=""}),10)},interceptUuid(e){var a=new RegExp(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g);let t=e.clipboardData.getData("text");this.carsUuids=t.match(a),setTimeout((()=>{e.srcElement.value=""}),10)},resolveRaces(){this.result.resultData.roundData.map(((e,a)=>{this.resolveCar(e)}))},resolveCar(e){Array.from(Array(2)).map(((a,t)=>{let s=["332","323","233","000"],r=0===t?"opponentData":"playerData",i=e[r].id,o=i.slice(0,36),n=this.cars_final.find((e=>e.guid===o));if(!n)return;n=JSON.parse(JSON.stringify(n)),"S"!==n.class&&"A"!==n.class||s.push("111");let c=`${i[36]*i[38]/3}${i[40]*i[42]/3}${i[44]*i[46]/3}`;c.length>3&&(c="Other"),n.selectedTune=c,n.photo=this.cgResolvePhotoUrl(n),n.color=Vue.resolveClass(n.rq,n.class,"color"),e[r].car=n}))},cgResolvePhotoUrl(e){try{return e.photoId?t(462416)("./"+decodeURI(e.photoId)+".jpg"):t(5533)("./"+decodeURI(e.rid)+".jpg")}catch(a){return""}},resolveEvents(){let e,a=new Date,t=new Date;t.setDate(t.getDate()-2),this.result.events.map((s=>{e=new Date(s.startDateTime),e>a&&(s.startDateTime=t.toISOString());let r=new Date(s.endDateTime);r>a&&(s.endDateTime=s.endDateTime.replace("21:00:00.000Z","21:05:00.000Z"))})),this.result.eventPlayerData.map((e=>{e.bucketDataVersion=64}));let s=document.querySelector(".for_copy");s.style.display="block",s.setAttribute("contenteditable",!0);try{navigator.clipboard.writeText(JSON.stringify(this.result))}catch(r){console.log("Can't copy")}},resolveLadders(){let e,a=new Date,t=new Date;t.setDate(t.getDate()-2),this.result.ladders.map((s=>{s.requirePrizeCard=!1,s.rqMin=150,s.rqMax=500,s.hideOnCompletion=!1,e=new Date(s.startDateTime),e>a&&(s.startDateTime=t.toISOString())}));let s=document.querySelector(".for_copy");s.style.display="block",s.setAttribute("contenteditable",!0),s.innerText=a.toISOString();try{navigator.clipboard.writeText(JSON.stringify(this.result))}catch(r){console.log("Can't copy")}this.challenges=this.result},resolveLadderInner(){let e=new Date,a=new Date;a.setDate(a.getDate()-2),this.result.ladder.startDateTime=a.toISOString(),this.result.ladder.inventoryItemAmount=0;let t={userId:"b940b9fa-490c-42cb-9ca8-edee1ff9dbe3",ladderId:this.result.ladder.id,numTickets:5,lastTicketRegen:"2023-08-13T23:46:33.370Z",currentRung:Number(this.roundNumber)||this.result.ladder.rungEligibility.length-1,starsWon:0,entryCostPaid:!0,rungEntryCostPaid:!1,rungs:[]};this.result.ladder.rungEligibility.map((e=>{e.inventoryItemRequirement=null,e.inventoryItemAmount=0,e.inventoryItemConsumed=!1,t.rungs.push({numWins:0,entryCostPaid:!1,starsWon:3})})),t.rungs.pop(),this.result.ladderPlayerData=t;let s=document.querySelector(".for_copy");s.style.display="block",s.setAttribute("contenteditable",!0),s.innerText=e.toISOString();try{navigator.clipboard.writeText(JSON.stringify(this.result))}catch(r){console.log("Can't copy")}this.challenges=this.result},createLadderDetail(e){let a=new Date,t=document.querySelector(".for_copy");t.style.display="block",t.setAttribute("contenteditable",!0),this.challenges||(t.innerText="No challenge");let s={};s.ladder=this.challenges.ladders.find((a=>a.id===e)),s.ladder.description="-",s.ladder.bossStartQuote="-",s.ladder.bossEndQuote="-",s.ladder.packId="152fb12f-a1e8-422e-b631-6db195fcc5e0",s.ladder.bonusPointRequirement=null,s.ladder.bonusPointMultiplier=null,s.ladder.version=1,s.ladder.cardPackType=1,s.ladder.bonusPointFlexibleCriteriaId=null,s.ladder.challengeSetIds=["95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73","95b020ba-4250-4c9d-86a3-a1348bc57a73"],s.ladder.opponents=[{cardRecordId:"f8c96640-2be6-41f4-9d9a-858bea473af5",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"e9279901-0703-47ad-812f-cb8309e56ec8",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"e17d946e-ffcb-46b1-bcad-0680b12ffd4f",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"41145c6d-14e5-4dc5-8980-bd21acc305a2",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"29130ad4-032d-4634-a4f2-2c0970a08f93",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"17e67a49-e7c5-498c-b95b-3e0c8fa24bd9",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"80400286-ed80-4a30-a436-25da5ad60e4c",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"dfffdf4d-732b-4b76-ba59-327690c0619c",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"87bc06f6-d97c-4d8e-a42c-236f14884295",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"94dde6f6-49f7-4ffa-89eb-c717c8bcb814",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"e07ea2f9-754b-40f6-ae90-4bd646fe50a8",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"615535d1-dbea-4711-b248-151881efc871",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"ecece41d-daee-4f22-a407-4e334e860a58",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"76c9cfd6-587c-4993-96b2-07f838d069de",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"ff4a21cf-2300-4e0a-ab6e-b460c2c10fbc",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"b2751ef4-7572-4e7a-8f54-502c3b626f06",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"4cd4da25-1781-47d5-81c3-a96a5633cbec",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"a1e7c05b-7413-4c78-b575-96f8f777cdae",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"4eea3f55-66b7-4493-907e-d4b518cb80b6",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"56ce5e98-a952-4927-9798-71387ca218fc",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"ac09f97e-d91a-45ee-bdd7-16f6c4ff7ac1",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"e6a15e99-1be0-4fd8-9dd4-0bdead8324d6",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"6c27befa-6ff0-4fa5-a663-dfd6805afdbb",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"6ba777f3-9511-4b69-8ec5-a90074bb4868",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"c89229e2-9045-4038-8590-03a3c11effc1",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"c6b0f36b-78c8-4c94-9390-e6da9df95081",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"66bbc918-fe9d-43fb-a160-60d33f120a7e",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"d42ee070-d2a6-4474-aced-06d4567d250f",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"e768c99d-6fa2-4d6e-b7ab-5acf5b20a34d",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"e8a55c43-a691-4a2f-a7e1-c670aa9e5b50",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"f91e6130-1bf9-455d-9a50-c88e89c03bb7",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"30322078-19ef-4339-b9eb-01e88aa02b1a",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"5d6ae3e7-1416-4ce2-8c1a-86e723303498",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"f22b2e24-d618-4ea6-91c3-81847dfb4c13",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"ced2e646-bfaf-48ea-afcf-ddea9c31b080",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"da91076c-7643-4410-b614-97ddc2a53b05",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"68b6a461-ade3-4638-8e2d-51662e36edc5",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"34d135c2-155a-4703-adf2-b2a3640089a2",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"c9738067-171b-4e52-aac4-ccdf19d57fd2",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"21ee88db-bc56-4850-abae-0ce9e25aa819",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"ddba2859-0e51-49f7-abd8-a32fa29f3730",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"85276b5b-0eab-44f6-adef-ceb942ac737c",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"34af2152-7e5e-466a-b2da-495a944f719c",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"52a19e3a-8c3e-41a7-a77e-452fa93213d6",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"7dde4d56-02f9-4f12-b8d2-0285664fb96c",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"3b18399f-b28b-481c-82d1-282af2d1bf4e",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:2,weightMinor:3,chassisMajor:2,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"89d17ea1-5639-46d0-a517-e36557b1fbcd",cardId:"03864f85-ecbe-49cd-a088-296cd704255f",engineMajor:1,engineMinor:0,weightMajor:1,weightMinor:0,chassisMajor:1,chassisMinor:0,gearingMajor:1,gearingMinor:0},{cardRecordId:"e2ffb1c5-35ee-4ce8-af1a-63ace28d1d41",cardId:"b6b3f0fe-3d95-4628-951b-5b46656a6fd6",engineMajor:1,engineMinor:3,weightMajor:1,weightMinor:3,chassisMajor:1,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"c05b89ee-88ea-402c-909f-44589f08d9fd",cardId:"749f0cb1-c777-4396-b131-4565ce3500e6",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0},{cardRecordId:"63ffad15-38db-40e6-81a2-869e305293bc",cardId:"70ae25a0-b855-437e-8285-ab53eaceb0b8",engineMajor:2,engineMinor:3,weightMajor:3,weightMinor:3,chassisMajor:3,chassisMinor:3,gearingMajor:1,gearingMinor:0}],s.ladderPlayerData=null,s={},t.innerText=a.toISOString();try{navigator.clipboard.writeText(JSON.stringify(s))}catch(r){console.log("Can't copy")}},copyNonce(){try{navigator.clipboard.writeText("c1837fe5-d320-45a7-8d45-67cd87f0f11c")}catch(e){console.log("Can't copy")}},resolveClubs(){try{this.result.Message.season.customData=JSON.parse(this.result.Message.season.customData),this.result.Message.nextSeason&&(this.result.Message.nextSeason.customData=JSON.parse(this.result.Message.nextSeason.customData))}catch(e){console.log(e)}this.resolveClubSeason(this.result.Message.season),this.result.Message.nextSeason&&this.resolveClubSeason(this.result.Message.nextSeason)},resolveClubSeason(e){let a=new Date(e.startDateTime),t=a.toISOString().substring(0,10);a.setDate(a.getDate()+1);let s=a.toISOString().substring(0,10);this.clubsParsedResult[t]={},this.clubsParsedResult[s]={},e.customData.criteriaSets.map(((e,a)=>{let r=0===a?this.clubsParsedResult[t]:this.clubsParsedResult[s];r.criterias={},e.map((e=>{r.criterias[e]=this.localUUIDtoName[e]||"-",this.localUUIDtoName[e]||this.lookUuid(e)}))})),e.customData.trackSets.map(((e,a)=>{let r=0===a?this.clubsParsedResult[t]:this.clubsParsedResult[s];r.tracksets={},e.map((e=>{r.tracksets[e]=this.localUUIDtoName[e]||"-",this.localUUIDtoName[e]||this.lookUuid(e)}))}))},loadClubs(){axios.get(Vue.preUrl+"/searchClubs").then((e=>{e.data.res&&(this.clubTDRDays=e.data.res.find((e=>"clubsDaysObj"===e.id)).value,Object.keys(this.clubTDRDays).map((e=>{})),this.loadClubsPredict())})).catch((e=>{})).then((e=>{}))},loadClubsPredict(){axios.get(Vue.preUrl+"/clubsPredict").then((e=>{this.clubHutchHistory=e.data.value,this.afterLoadClubs()})).catch((e=>{})).then((e=>{}))},afterLoadClubs(){this.clubHutchHistory.map((e=>{let a=new Date(e.startDateTime),t=a.toISOString().substring(0,10);a.setDate(a.getDate()+1);let s=a.toISOString().substring(0,10);this.clubHutchHistoryFormated[t]={criterias:e.customData.criteriaSets[0],tracksetGroups:e.customData.trackSets[0]},this.clubHutchHistoryFormated[s]={criterias:e.customData.criteriaSets[1],tracksetGroups:e.customData.trackSets[1]}})),Object.keys(this.clubTDRDays).map((e=>{this.clubHutchHistoryFormated[e]&&(3===this.clubTDRDays[e].criterias.length&&this.checkMatchesClubs(this.clubTDRDays[e].criterias,"localCriteriaIds",e),3===this.clubTDRDays[e].tracksetGroups.length&&this.checkMatchesClubs(this.clubTDRDays[e].tracksetGroups,"localTracksetsIds",e))})),this.fillUUIDCollection(this.localCriteriaIds),this.fillUUIDCollection(this.localTracksetsIds),console.log("___"),this.clearLocalUUIDPossibles(this.localCriteriaIds),this.clearLocalUUIDPossibles(this.localCriteriaIds),this.clearLocalUUIDPossibles(this.localCriteriaIds),this.clearLocalUUIDPossibles(this.localTracksetsIds),this.clearLocalUUIDPossibles(this.localTracksetsIds),this.clearLocalUUIDPossibles(this.localTracksetsIds),console.log("___ LIST OF KNOWN:");let e=[];Object.keys(this.localUUIDtoName).map((a=>{e.push(this.localUUIDtoName[a])})),console.log(e),console.log("___"),this.checkIfMatchesWithoutConclusion(this.localCriteriaIds),this.checkIfMatchesWithoutConclusion(this.localTracksetsIds),console.log("___ LIST OF UNKNOWN:"),this.checkIfUnknown(this.localCriteriaIds),this.checkIfUnknown(this.localTracksetsIds)},checkMatchesClubs(e,a,t){let s=this[a],r="criterias";"localTracksetsIds"===a&&(r="tracksetGroups"),e.map((e=>{if(s[e]||(s[e]={}),s[e].possibles){let a=!1;s[e].possibles.map((i=>{this.clubHutchHistoryFormated[t][r].map((t=>{i===t&&(a=!0,s[e].matches||(s[e].matches=[]),s[e].matches.push(i))}))})),a||(s[e].possibles=[...s[e].possibles,...this.clubHutchHistoryFormated[t][r]])}else s[e].possibles=this.clubHutchHistoryFormated[t][r]}))},fillUUIDCollection(e){Object.keys(e).map((a=>{if(e[a].matches){let t,s={},r=0;e[a].matches.map((e=>{s[e]||(s[e]=0),s[e]+=1,t?s[e]>r&&(t=e,r=s[e]):(t=e,r=s[e])}));let i=!1;{let e=[];Object.keys(s).map((a=>{e.push(s[a])})),e.sort(),e.reverse(),e.length>1&&e[0]===e[1]&&(i=!0)}i||(this.localUUIDtoName[t]=a)}}))},clearLocalUUIDPossibles(e){Object.keys(e).map((a=>{e[a].possibles=e[a].possibles.filter((e=>!this.localUUIDtoName[e]||this.localUUIDtoName[e]==a)),e[a].matches&&(e[a].matches=e[a].matches.filter((e=>!this.localUUIDtoName[e]||this.localUUIDtoName[e]==a))),1===e[a].possibles.length?this.localUUIDtoName[e[a].possibles[0]]?this.localUUIDtoName[e[a].possibles[0]]:this.localUUIDtoName[e[a].possibles[0]]=a:e[a].matches&&1===[...new Set(e[a].matches)].length&&(this.localUUIDtoName[e[a].matches[0]]?this.localUUIDtoName[e[a].matches[0]]:this.localUUIDtoName[e[a].matches[0]]=a)}))},checkIfMatchesWithoutConclusion(e){Object.keys(e).map((a=>{e[a].matches&&(e[a].matches=[...new Set(e[a].matches)],e[a].matches.length>1&&console.log(a,"with",e[a].matches.length,"possibles"))}))},checkIfUnknown(e){let a=[];Object.keys(e).map((t=>{e[t].possibles.length>1&&a.push(t)})),console.log(a)},lookUuid(e){e||(e=this.result);let a=[];this.lookPossiblesByUuid(this.localCriteriaIds,e,a),this.lookPossiblesByUuid(this.localTracksetsIds,e,a),this.possiblesResult.push({names:a,uuid:e})},lookPossiblesByUuid(e,a,t){Object.keys(e).map((s=>{e[s].possibles.includes(a)&&t.push(s)}))},resolvePlayerDeck(){let e=["1f299953-b8ed-4cc0-90d6-5a0595c8695a"];this.result.playerDeck.map((a=>{if(e.length>0){let t=e.shift();a.cardId=t,a.engineMajor=2,a.engineMinor=3,a.weightMajor=3,a.weightMinor=3,a.chassisMajor=3,a.chassisMinor=3}})),this.result.user.eloScore=5e3,this.result.user.softCurrency1=1e5,this.result.user.hardCurrency1=1e5,navigator.clipboard.writeText(JSON.stringify(this.result,null,4))},sharePrint(e){this.tempWindowWidth=this.windowWidth,this.windowWidth=1300,this.pngLoading=!0,window.scrollTo({top:0});let a,t,s=document.querySelector("#App_PrintContainer"),r=document.querySelector("#printCanvas"),i=".MainCollageMaker_Grid",o=document.querySelector(i);o.classList.add("Main_BodyPrint"),a=2*o.clientWidth,t=2*o.clientHeight;let n={backgroundColor:"#333",canvas:r,scale:2,width:a,height:t,windowWidth:a,windowHeight:t};r.setAttribute("width",`${a}`),r.setAttribute("height",`${t}`),setTimeout((()=>{this.runSharePrint(o,n,s,r,i,e)}),10)},runSharePrint(e,a,s,r,i,o){let n=this;t.e(533).then(t.t.bind(t,614533,23)).then((s=>{s.default(e,a).then((function(e){t.e(614).then(t.t.bind(t,182614,23)).then((e=>{let a=e.ReImg.fromCanvas(r);if("KeyP"===o)e.ReImg.fromCanvas(r).downloadPng(`TDR_${(new Date).toISOString().slice(0,-5)}.png`),document.querySelector(i).classList.remove("Main_BodyPrint"),n.windowWidth=n.tempWindowWidth,n.pngLoading=!1;else{var t=new Image;t.src=a.toBase64(),t.onload=function(){var e=document.createElement("canvas"),a=e.getContext("2d");e.width=t.naturalWidth,e.height=t.naturalHeight,a.drawImage(t,0,0),e.toBlob((function(e){try{navigator.clipboard.write([new ClipboardItem({"image/png":e})]),n.$store.commit("DEFINE_SNACK",{active:!0,correct:!0,text:"Copied",time:1e3})}catch(a){console.error(a)}}),"image/png",1)}}})).catch((e=>{console.log("load reimg failed",e)}))}))})).catch((e=>{console.log("load html2canvas failed",e)}))},askDelete(e){this.currentIndex===e?(this.currentIndex=-1,this.images=this.images.filter(((a,t)=>t!==e))):(this.currentIndex=e,setTimeout((()=>{this.currentIndex=-1}),1e3))}}},d=c,l=t(281656),g=(0,l.A)(d,s,r,!1,null,"6f856511",null),h=g.exports},245244:function(e,a,t){var s={"./Audi_Sport_quattro_S1_1985.jpg":650889,"./Citroen_Ami_Super_1973.jpg":836582,"./Citroen_C1_VTi_68_2015.jpg":536242,"./Renault_Fluence_2013.jpg":700088,"./Renault_Sport_Twingo_GT_2016.jpg":361048};function r(e){var a=i(e);return t(a)}function i(e){if(!t.o(s,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return s[e]}r.keys=function(){return Object.keys(s)},r.resolve=i,e.exports=r,r.id=245244},650889:function(e,a,t){"use strict";e.exports=t.p+"img/Audi_Sport_quattro_S1_1985.c607bb39.jpg"},836582:function(e,a,t){"use strict";e.exports=t.p+"img/Citroen_Ami_Super_1973.9d892b2b.jpg"},536242:function(e,a,t){"use strict";e.exports=t.p+"img/Citroen_C1_VTi_68_2015.d1db2204.jpg"},700088:function(e,a,t){"use strict";e.exports=t.p+"img/Renault_Fluence_2013.c0ee8c6e.jpg"},361048:function(e,a,t){"use strict";e.exports=t.p+"img/Renault_Sport_Twingo_GT_2016.e34fdcfa.jpg"}}]);
//# sourceMappingURL=668.9a0e3dfc.js.map