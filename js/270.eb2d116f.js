(self["webpackChunktopdrives_records"]=self["webpackChunktopdrives_records"]||[]).push([[270],{362952:function(e,a,_){"use strict";_.d(a,{A:function(){return n}});var t=function(){var e=this,a=e._self._c;return a("div",{ref:"container",staticClass:"BaseCardGallery_Layout"},[e.fixBack?a("div",{staticClass:"BaseCardGallery_FixBack"}):e._e(),a("div",{staticClass:"Car_Header BaseCardGallery_Header",class:{Row_DialogCardCard2:!e.options,Car_Loading:e.downloadLoading},style:`--class-color: ${e.carClassColor};`},[a("img",{staticClass:"Car_ImgTag",attrs:{src:e.carPhoto,loading:"lazy",alt:""}}),a("div",{staticClass:"Car_HeaderBlockYear",staticStyle:{"backdrop-filter":"none"}},[e._v(e._s(e.car.year||"-"))]),a("div",{staticClass:"Car_HeaderBlockCountry"},[e._v(e._s(e.car.country||"-"))]),a("div",{staticClass:"Car_HeaderBlockTires"},[a("span",[e._v(e._s(e.$t(`c_${e.car.tyres.toLowerCase()}`)||"-"))]),a("span",[e._v(" "+e._s(e.$tc("c_tyre",2)))])]),e.tuneText?a("div",{staticClass:"Car_TuneTipGallery"},[e._v(e._s(e.tuneText))]):e._e(),a("div",{staticClass:"Car_HeaderBlockRQ"},[a("div",{staticClass:"Car_HeaderRQValue",class:{Car_HeaderRQValue3:e.car&&e.car.rq>99}},[e._v(e._s(e.car.rq))]),a("div",{staticClass:"Car_HeaderRQLabel"},[e._v("RQ")])]),a("div",{staticClass:"Car_HeaderBlockClass"},[a("div",{staticClass:"Car_HeaderClassBack"}),a("div",{staticClass:"Car_HeaderClassValue"},[e._v(e._s(e._f("resolveClass")(this.car.rq,this.car.class,"letter")))])]),a("div",{staticClass:"Car_HeaderBlockTopSpeed"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e._f("resolveStat")(e.car,"topSpeed",e.customData)))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v(e._s(e.$t("c_topSpeed").toUpperCase()))])]),a("div",{staticClass:"Car_HeaderBlock060"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e._f("resolveStat")(e.car,"acel",e.customData)))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v("0-60MPH")])]),a("div",{staticClass:"Car_HeaderBlockHandling"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e._f("resolveStat")(e.car,"hand",e.customData)))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v(e._s(e.$t("c_handling").toUpperCase()))])]),a("div",{staticClass:"Car_HeaderBlockDrive"},[a("div",{staticClass:"Car_HeaderStatValue"},[e._v(e._s(e.car.drive||"-"))]),a("div",{staticClass:"Car_HeaderStatLabel"},[e._v(e._s(e.$tc("c_drive",1).toUpperCase()))])]),a("div",{staticClass:"Car_HeaderName",class:{Car_HeaderNameBig:e.car.name.length>30,Car_HeaderNameBigBig:e.car.name.length>36}},[e._v(e._s(e.car.name))])])])},r=[],s=(_(468312),{name:"BaseCardGallery",components:{},props:{car:{type:Object,default(){return{}}},options:{type:Boolean,default:!0},fixBack:{type:Boolean,default:!1},temp:{type:Number,default:1},downloadLoading:{type:Boolean,default:!1},customData:{type:Object,default(){return null}},oldpic:{type:Boolean,default:!1},tuneText:{requred:!1}},data(){return{}},watch:{},beforeMount(){},mounted(){},computed:{carClassColor(){return Vue.resolveClass(this.car.rq,this.car.class,"color")},carPhoto(){let e;try{e=this.oldpic?_(245244)("./"+this.car.rid+".jpg"):this.car.photoId?_(462416)("./"+this.car.photoId+".jpg"):_(5533)("./"+this.car.rid+".jpg")}catch(a){return""}return e}},methods:{}}),i=s,l=_(281656),o=(0,l.A)(i,t,r,!1,null,null,null),n=o.exports},128853:function(e,a,_){"use strict";_.d(a,{A:function(){return u}});var t=function(){var e=this,a=e._self._c;return a("div",{staticClass:"Main_DarkScroll BaseFilterDescription_Root"},[void 0!==e.currentFilter&&(!e.hideIfEmpty||e.descResolved.length>0)?[e.hasFilter2||e.hasFilter3?a("div",{staticClass:"BaseFilterDescription_MultiBox"},[e._l(3,(function(_){return[1===_||2===_&&e.hasFilter2||3===_&&e.hasFilter3?a("BaseChip",{staticClass:"BaseChip_MinWidth BaseChip_DontCrop BaseChip_SmallWide",attrs:{inputValue:e.useWhatFilter,disabled:e.loading,required:"true",allowCtrl:!0,value:_-1,label:`${1===_?e.filter.name||_:2===_?e.filter2.name||_:3===_?e.filter3.name||_:""}`},on:{click:function(a){return e.chipClick(a,_-1)}}}):e._e()]}))],2):e.showTitle?a("div",{staticClass:"Cg_ReqsTitle"},[e._v(e._s(e.asFilterLabel?e.$tc("m_filter",1):e.$t("m_requirements")))]):e._e(),a("div",{staticClass:"Cg_Reqs"},[a("div",{staticClass:"BaseFilterDescription_Layout"},[e._l(e.descResolved,(function(_){return a("div",{staticClass:"BaseFilterDescription_Item"},[a("div",{staticClass:"BaseFilterDescription_Label"},[e._v(e._s(_.label))]),a("div",{staticClass:"BaseFilterDescription_Value"},[e._v(e._s(_.value))])])})),0===e.descResolved.length?a("div",{staticClass:"BaseFilterDescription_Empty"},[e._v(e._s(e.$t("m_empty")))]):e._e()],2),!e.loading&&e.ready&&e.user&&e.user.mod||e.isKing?a("div",{staticClass:"BaseFilterDescription_Bottom Cg_FilterButtons"},[a("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton",on:{click:function(a){return e.$emit("changeClick",a)}}},[e._v(e._s(e.currentFilter?"Change":"Requirements"))])]):e._e()])]:e._e(),e._t("footer"),a("portal",{attrs:{to:"app_dialogs"}},[e.hasFilter2||e.hasFilter3?a("BaseDialog",{attrs:{active:e.renameDialog,transparent:!1,"max-width":"420px","min-width":"240px"},on:{close:function(a){return e.closeRenameDialog()}}},[a("div",{staticClass:"Main_TuneDialog"},[a("BaseText",{staticClass:"BaseText_Big",attrs:{iid:"Filter_Rename",type:"normal",label:`${e.$t("c_name")} - Filter ${e.renameFilterNumber+1}`,placeholder:"e.g. 2x or 3x"},on:{enter:function(a){return e.closeRenameDialog()}},model:{value:e.renameModel,callback:function(a){e.renameModel=a},expression:"renameModel"}})],1)]):e._e()],1)],2)},r=[],s=(_(728743),_(5693)),i=_(447108),l=_(290481),o={name:"BaseFilterDescription",components:{BaseChip:s.A,BaseDialog:i.A,BaseText:l.A},props:{filter:{type:Object,default(){return{}}},filter2:{type:Object,default(){return{}}},filter3:{type:Object,default(){return{}}},useWhatFilter:{type:Number,default:0},loading:{type:Boolean,default:!1},asFilterLabel:{type:Boolean,default:!1},hideIfEmpty:{type:Boolean,default:!1},emitDescResolved:{type:Boolean,default:!1},showTitle:{type:Boolean,default:!0},isKing:{type:Boolean,default:!1},user:{required:!1},ready:{required:!1}},data(){return{renameDialog:!1,renameModel:null,renameFilterNumber:0}},watch:{},beforeMount(){},mounted(){},computed:{hasFilter2(){return this.filter2&&Object.keys(this.filter2).length>0},hasFilter3(){return this.filter3&&Object.keys(this.filter3).length>0},currentFilter(){return 1===this.useWhatFilter&&this.hasFilter2?this.filter2:2===this.useWhatFilter&&this.hasFilter3?this.filter3:this.filter},descResolved(){let e=this.currentFilter;if(0===Object.keys(e).length)return[];let a=[];return e.yearModel&&"[1910,2024]"!==JSON.stringify(e.yearModel)&&a.push({label:this.$tc("c_year",2),value:e.yearModel.join("-")}),e.rqModel&&"[10,119]"!==JSON.stringify(e.rqModel)&&a.push({label:"RQ",value:e.rqModel.join("-")}),e.seatsModel&&"[1,9]"!==JSON.stringify(e.seatsModel)&&a.push({label:this.$t("c_seats"),value:e.seatsModel.join("-")}),e.topSpeedModel&&"[25,330]"!==JSON.stringify(e.topSpeedModel)&&a.push({label:this.$t("c_topSpeed"),value:e.topSpeedModel.join("-")}),e.acelModel&&"[1.5,40]"!==JSON.stringify(e.acelModel)&&a.push({label:"0-60",value:e.acelModel.join("-")}),e.handModel&&"[30,110]"!==JSON.stringify(e.handModel)&&a.push({label:this.$t("c_handling"),value:e.handModel.join("-")}),e.mraModel&&"[0,160]"!==JSON.stringify(e.mraModel)&&a.push({label:"MRA",value:e.mraModel.join("-")}),e.weightModel&&"[300,7000]"!==JSON.stringify(e.weightModel)&&a.push({label:this.$t("c_weight"),value:e.weightModel.join("-")}),e.tunesModel&&e.tunesModel.length>0&&a.push({label:this.$t("c_tune"),value:e.tunesModel.join(", ")}),e.classesModel&&e.classesModel.length>0&&a.push({label:this.$tc("c_class",1),value:e.classesModel.join(", ")}),e.tyresModel&&e.tyresModel.length>0&&a.push({label:this.$tc("c_tyre",1),value:e.tyresModel.map((e=>this.$t(`c_${e.toLowerCase()}`))).join(", ")}),e.drivesModel&&e.drivesModel.length>0&&a.push({label:this.$tc("c_drive",1),value:e.drivesModel.join(", ")}),e.clearancesModel&&e.clearancesModel.length>0&&a.push({label:this.$tc("c_clearance",1),value:e.clearancesModel.map((e=>this.$t(`c_${e.toLowerCase()}`))).join(", ")}),e.countrysModel&&e.countrysModel.length>0&&a.push({label:this.$tc("c_country",1),value:e.countrysModel.join(", ")}),e.prizesModel&&e.prizesModel.length>0&&a.push({label:this.$t("c_prizeCar"),value:e.prizesModel.map((e=>this.$t(`c_${e.toLowerCase()}`))).join(", ")}),e.bodyTypesModel&&e.bodyTypesModel.length>0&&a.push({label:this.$t("c_bodyStyle"),value:e.bodyTypesModel.map((e=>this.$t(`c_${e.toLowerCase()}`))).join(", ")}),e.fuelModel&&e.fuelModel.length>0&&a.push({label:this.$t("c_fuel"),value:e.fuelModel.map((e=>this.$t(`c_${e.toLowerCase()}`))).join(", ")}),e.engineModel&&e.engineModel.length>0&&a.push({label:this.$t("c_enginePos"),value:e.engineModel.map((e=>this.$t(`c_${e.toLowerCase()}Engine`))).join(", ")}),e.brakeModel&&e.brakeModel.length>0&&a.push({label:this.$t("c_brakeClass"),value:e.brakeModel.join(", ")}),e.tcsModel&&e.tcsModel.length>0&&a.push({label:this.$t("c_tcs"),value:e.tcsModel.join(", ")}),e.absModel&&e.absModel.length>0&&a.push({label:this.$t("c_abs"),value:e.absModel.join(", ")}),e.tagsModel&&e.tagsModel.length>0&&a.push({label:this.$tc("c_tag",1),value:e.tagsModel.join(", ")}),e.tags2Model&&e.tags2Model.length>0&&a.push({label:this.$tc("c_tag",1),value:e.tags2Model.join(", ")}),e.tags3Model&&e.tags3Model.length>0&&a.push({label:this.$tc("c_tag",1),value:e.tags3Model.join(", ")}),e.brandsModel&&e.brandsModel.length>0&&a.push({label:this.$tc("c_brand",1),value:e.brandsModel.join(", ")}),e.year2Model&&e.year2Model.length>0&&a.push({label:this.$tc("c_year",2),value:e.year2Model.join(", ")}),e.seats2Model&&e.seats2Model.length>0&&a.push({label:this.$t("c_seats"),value:e.seats2Model.join(", ")}),this.emitDescResolved&&this.$emit("descResolved",a),a}},methods:{chipClick(e,a){if(e&&"object"===typeof e&&e.e&&(e.e.ctrlKey||e.e.metaKey)&&this.user&&this.user.mod)return this.renameDialog=!0,this.renameModel=null,this.renameFilterNumber=a,this[`filter${a+1>1?a+1:""}`].name&&(this.renameModel=this[`filter${a+1>1?a+1:""}`].name),void setTimeout((()=>{try{document.querySelector("#Filter_Rename").focus()}catch(e){}}),10);this.$emit("useFilter",a)},closeRenameDialog(){this.renameDialog=!1,this.renameModel&&this.renameModel.length<10&&this.$emit("newNameFilter",{n:this.renameFilterNumber,newName:this.renameModel})}}},n=o,d=_(281656),c=(0,d.A)(n,t,r,!1,null,null,null),u=c.exports},187270:function(e,a,_){"use strict";_.r(a),_.d(a,{default:function(){return g}});var t=function(){var e=this,a=e._self._c;return a("div",{staticClass:"MainFindCar_Layout"},[a("div",{staticClass:"MainFindCar_Header"},[a("div",{staticClass:"Main_ChartFilter Main_DarkScroll"},[e.findcFilter?[a("div",{staticClass:"Cg_ReqsTitle"},[e._v(e._s(e.$tc("m_filter",1)))]),a("div",{staticClass:"Cg_Reqs"},[a("BaseFilterDescription",{attrs:{filter:e.findcFilter}})],1)]:e._e(),a("div",{staticClass:"Cg_FilterButtons"},[a("button",{staticClass:"D_Button D_ButtonDark D_ButtonDark2 Cg_TopButton",on:{click:function(a){return e.openChartOfDialog()}}},[e._v(e._s(e.findcFilter?e.$t("m_change"):e.$t("m_requirements")))])])],2),a("BaseConfigCheckBox",{staticClass:"Main_ChartTrackBox",staticStyle:{"margin-top":"3px"},attrs:{name:"showBigCards",label:e.$t("m_showBigCards")},model:{value:e.showBigCards,callback:function(a){e.showBigCards=a},expression:"showBigCards"}})],1),a("div",{staticClass:"MainFindCar_Body",class:{MainFindCar_BodyBig:e.showBigCards}},[e._l(e.list,(function(_){return a("div",{staticClass:"MainFindCar_Car",style:`--color: ${_.color}`},[e.showBigCards?a("BaseCardGallery",{staticClass:"MainFindCar_GalleryCard",attrs:{car:_.car,options:!1}}):a("div",{staticClass:"MainFindCar_CarCard"},[a("div",{staticClass:"MainFindCar_BankPhoto"},[a("img",{staticClass:"MainFindCar_BankPhotoImg",attrs:{src:_.photo,loading:"lazy",alt:""}})]),a("div",{staticClass:"MainFindCar_RQ"},[e._v(e._s(_.car.rq))])]),a("div",{staticClass:"MainFindCar_Right"},[a("div",{staticClass:"MainFindCar_Desc"},[e._v(e._s(_.location))]),a("div",{staticClass:"MainFindCar_Chance",class:`MainFindCar_Chance_${_.chance}`},[e._v(e._s(_.chance))])])],1)})),0===e.list.length?a("div",{staticClass:"MainFindCar_Empty"},[e._v(e._s(e.$t("m_nothingFound")))]):e._e()],2),a("BaseFilterDialog",{attrs:{filterOnly:!0,all_cars:e.all_cars,ridsMutationName:"FILTER_FINDCAR_RIDS"},on:{filterUpdate:function(a){return e.updateChartFilter(a)},listRids:function(a){return e.finCarFinish(a)}},model:{value:e.filterDialog,callback:function(a){e.filterDialog=a},expression:"filterDialog"}})],1)},r=[],s=(_(728743),_(468312)),i=_(128853),l=_(604132),o=_(362952),n=_(621116),d=JSON.parse('[{"name":"YB USA","matches":[["Volkswagen_Beetle_Cabriolet_2012","Volkswagen_Beetle_2011"],["Mercedes-Benz_SLK_200_2016","Mercedes-Benz_E_220_2015"],["BMW_728i_1977","BMW_320d_Touring_2010"],["Mini_Cooper_SD_2011","Mini_Cooper_S_2016"],["Volkswagen_Jetta_GTI_1988","Volkswagen_Tiguan_2011"],["BMW_X1_2010","BMW_520i_2011"],["BMW_2002_turbo_1973","Audi_quattro_1980"],["Mercedes-Benz_190_E_2.3-16_1984","Mercedes-Benz_AMG_C_43_1999"],["Porsche_928_1977","Porsche_968_1992"],["BMW_i3_2013","BMW_520d_Touring_2017"]]},{"name":"YB Germany","matches":[["Vauxhall_Vectra_2.5_V6_1995","Vauxhall_Vectra_VXR_2006"],["Ford_Ranger_2012","Ford_Ranger_Wildtrak_2012"],["Jaguar_XJS_1988","Jaguar_XK8_1997"],["Ford_Mondeo_ST200_1998","Ford_Mondeo_ST220_2000"],["Vauxhall_Mokka_4x4_2016","Vauxhall_Antara_2.2CDTi_2016"],["Jaguar_XJ12_1972","Jaguar_XKSS_1957"],["Land_Rover_Discovery_3_2004","Land_Rover_Discovery_Sport_2016"],["Caterham_21_1995","Lotus_Elise_1996"],["MG_Montego_Turbo_1985","MG_Maestro_Turbo_1983"],["Ford_Focus_ST170_2002","Ford_Focus_RS_2002"]]},{"name":"YB UK","matches":[["Citroen_C6_3.0_L_V6_HDi_2005","Renault_Sport_Spider_1996"],["Peugeot_205_GTi_1.9_1986","Renault_Safrane_Biturbo_1992"],["Renault_5_GT_Turbo_1985","Renault_5_Turbo_1980"],["Citroen_C2_VTS_2003","Renault_Sport_Clio_172_Cup_1999"],["Renault_Megane_1995","Renault_Sport_Megane_2002"],["Citroen_C4_2.0_16v_VTS_2004","DS_DS_3_Racing_2011"],["Renault_Sport_Twingo_133_Cup_2012","Renault_Sport_Clio_182_Trophy_2005"],["DS_3_DSport_HDi_2016","DS_DS_7_Crossback_2018"],["Renault_Kadjar_2016","Citroen_C-Crosser_2.2_L_HDi_2007"],["Renault_Espace_2016","Citroen_C2-R2_Max_2008"]]},{"name":"YB France","matches":[["Subaru_Legacy_1993","Subaru_Legacy_1998"],["Mitsubishi_Lancer_GS4_2007","Mitsubishi_Colt_Ralliart_Version-R_2009"],["Mazda_RX-7_Turbo_1983","Mazda_RX-7_Turbo_1985"],["Suzuki_Vitara_2005","Suzuki_Vitara_S_2016"],["Honda_Civic_2016","Honda_Civic_Type_R_1999"],["Mazda_MX-5_2005","Mazda_RX-8_Spirit_R_2012"],["Nissan_Qashqai_2016","Nissan_Qashqai_2008"],["Honda_CR-V_1997","Honda_CR-V_2.2_i-DTEC_2007"],["Mazda_MX-5_1998","Mazda_RX-8_PZ_2006"],["Honda_Prelude_VTEC_1991","Honda_S2000_Type_S_2008"]]},{"name":"YB Japan","matches":[["Alfa_Romeo_145_Cloverleaf_1994","Alfa_Romeo_147_GTA_2002"],["Fiat_Panda_4x4_2019","Lancia_Delta_HF_4WD_1986"],["Maserati_Ghibli_SS_Spyder_1969","Fiat_Abarth_124_Spider_2017"],["Maserati_Khamsin_1974","Maserati_Racing_1991"],["Alfa_Romeo_166_1998","Alfa_Romeo_164_Super_1993"],["Fiat_Dino_Coupe_1966","Maserati_Royale_1986"],["Fiat_Panda_Cross_4x4_Mark_3_2014","Fiat_Fullback_Cross_2017"],["Lamborghini_Urraco_P250_1973","Alfa_Romeo_Carabo_1968"],["Maserati_Ghibli_SS_Spyder_1969","Maserati_Quattroporte_Diesel_2018"],["Fiat_Abarth_695_Tributo_Maserati_2012","Alfa_Romeo_Giulia_TZ_1963"]]},{"name":"YB Italy","matches":[["Chrysler_300_Touring_2005","Chrysler_200C_EV_2009"],["Pontiac_Vibe_GT_2003","Pontiac_Grand_Prix_GTP_1997"],["Dodge_Dart_2017","Dodge_Daytona_IROC_RT_1992"],["Plymouth_Duster_340_1972","AMC_Javelin_AMX_1971"],["Chevrolet_Corvette_LT-1_1970","Chevrolet_El_Camino_SS_454_1969"],["Buick_LeSabre_2000","Buick_Regal_Turbo_2011"],["Ram_Dodge_1st_Gen_1981","Ram_Dodge_Ramcharger_1981"],["Cadillac_Escalade_2002","Cadillac_SRX_2006"],["Chevrolet_Monte_Carlo_SS_454_1970","Chevrolet_Monte_Carlo_SS_2006"],["Ram_Dodge_Li\'l_Red_Express_Truck_1978","Dodge_Durango_GT_2018"]]},{"name":"YB Road to YB","matches":[["Plymouth_HEMI_\'Cuda_1970","Ford_Mustang_GT_Convertible_2005","Ford_Mustang_GT_2005"],["DS_DS_6_2015","Peugeot_508_2018","DS_Wild_Rubis_2013"],["Nissan_Terrano_R3M-R_(R50)_1999","Nissan_Qashqai_2008","Nissan_Pathfinder_2010"],["BMW_Z4_sDrive18i_2013","BMW_Z4_sDrive28i_2016","BMW_Z8_2000"],["Jaguar_E-Type_1961","Jaguar_XKSS_1957","TVR_Griffith_4.3_1992"],["Alfa_Romeo_145_Cloverleaf_1994","Alfa_Romeo_147_GTA_2002","Alfa_Romeo_MiTo_GTA_2009"],["Vauxhall_Carlton_GSi3000_24v_1989","Volvo_850_R_1997","Jaguar_XJR_2003"],["BMW_2002_turbo_1973","BMW_325iX_1988","BMW_520d_xDrive_2017"],["Mazda_RX-7_Turbo_1983","Mazda_RX-7_1992","Mazda_RX-7_Type_RS_1998"],["Ram_Dodge_1st_Gen_1981","Lamborghini_LM002_1986","Nissan_Datsun_240Z_Rally_Car_1973"]]},{"name":"SN Orig 2010s","matches":[["Suzuki_Swift_(SF)_1988","Suzuki_Ertiga_(NC)_2019"],["Renault_Espace_1984","Renault_21_Savanna_1986"],["Nissan_EXA_(N12)_1982","Nissan_Pixo_2009"],["Vauxhall_Chevette_HSR_1980","Vauxhall_Vectra_VXR_2006"],["Mercedes-Benz_C_200_K_2002","Chevrolet_Captiva_LTX_2008"],["Volvo_C70_T5_2.3_2003","Suzuki_SX4_2006"],["Citroen_C2_VTS_2003","Renault_Sport_Clio_172_Cup_1999"],["Nissan_Primera_2004","Alfa_Romeo_Brera_S_2008"],["Cadillac_Sedan_De_Ville_2000","Subaru_Legacy_2009"],["Fiat_Panda_100hp_2006","Cadillac_XLR_roadster_2004"]]},{"name":"SN Orig 2000s","matches":[["Citroen_BX_17_D_Turbo_Break_1982","Peugeot_405_Mi16_1987"],["Renault_Twingo_1993","Alfa_Romeo_155_1992"],["Honda_Prelude_1978","Honda_Civic_CRX_Si_1983"],["Ford_Escort_RS2000_1996","Suzuki_XL-7_1998"],["Alfa_Romeo_Giulietta_2017","Alfa_Romeo_GTV_1998"],["Honda_Prelude_2.0Si_4WS_1987","BMW_M5_1985"],["Acura_Legend_3.2_V6_1990","Subaru_Forester_1997"],["Renault_25_V6_Turbo_1983","Mercedes-Benz_AMG_C_43_1999"],["Porsche_944_1982","Porsche_968_1992"],["Rover_220_GSi_1989","Subaru_Legacy_1998"]]},{"name":"SN Orig 80-90s","matches":[["Lancia_Aprilia_Sport_Zagato_1938","Volkswagen_T-Roc_2017"],["Suzuki_Hustler_Hybrid_X_Turbo_2019","Citroen_C3-XR_2014"],["Peugeot_208_2018","Nissan_Juke_2010"],["Lancia_Delta_2012","Volkswagen_Polo_GTI_2018"],["Volkswagen_Golf_2017","Fiat_Fullback_Cross_2017"],["Vauxhall_Opel_Insignia_Country_Tourer_2013","Volkswagen_Atlas_2018"],["Jaguar_XJ12_1972","Jaguar_E-PACE_2018"],["Mini_Cooper_SD_2011","Mini_JCW_Convertible_2016"],["De_Tomaso_Longchamp_1973","De_Tomaso_Pantera_L_1973"],["Nissan_Juke_Nismo_2016","Nissan_Juke_Nismo_RS_4WD_M-Xtronic_2015"]]},{"name":"SN JPT 10-20s","matches":[["Peugeot_1007_2005","Peugeot_205_GTi_1.6_1984"],["Volkswagen_Transporter_2004","Chrysler_Sebring_1995"],["Subaru_R1_2005","Mitsubishi_i-MiEV_2007"],["Volkswagen_Polo_GTI_2006","Acura_TSX_2004"],["Chrysler_PT_Cruiser_GT_Convertible_2005","Chrysler_Crossfire_Roadster_2004"],["Citroen_C5_V6_2003","Citroen_C-Crosser_2.2_L_HDi_2007"],["Suzuki_Jimny_2007","INFINITI_I35_(A33)_2002"],["Chrysler_Prowler_2001","Peugeot_206_RC_2003"],["Nissan_300ZX_(Z32)_1990","Nissan_Leopard_XR_(Y33)_1997"],["Volkswagen_Passat_2006","Dodge_Super_8_HEMI_2001"]]},{"name":"SN JPT 2000s","matches":[["Nissan_President_Sovereign_(H252)_1980","Fiat_Tipo_2.0_Sedicivalvole_1988"],["Suzuki_Swift_1.3_GS_(SA)_1985","INFINITI_M30_Convertible_(F31)_1991"],["Ford_Taurus_SHO_1993","Ford_Explorer_1991"],["Maserati_Biturbo_S_1983","Jaguar_XJR_1995"],["Ford_021C_1999","Ford_F-150_Lightning_2001"],["Peugeot_206_GTi_1999","Volkswagen_Corrado_VR6_1992"],["Dodge_Shadow_ES_1987","Nissan_Xterra_(WD22)_1999"],["Nissan_Datsun_720_Bushmaster_1985","Maserati_430_1987"],["Ford_Bronco_II_1986","Ford_Bronco_1996"],["Subaru_Legacy_Outback_(BG)_1995","Nissan_Leopard_XR_(Y33)_1997"]]},{"name":"SN JPT 80-90s","matches":[["Ford_Transit_2.2_TDCi_2013","Alfa_Romeo_Mito_2017"],["Dodge_Aries_1986","Dodge_Journey_2018"],["Nissan_Micra_2004","Mazda_2_2018"],["Vauxhall_Cascada_2016","Mini_JCW_Convertible_2016"],["Citroen_C4_Picasso_THP_165_2016","Citroen_C-Crosser_2.2_L_HDi_2007"],["Mazda_6_2016","Volvo_C70_T5_2013"],["Ford_Kuga_2016","Nissan_NP300_Navara_2017"],["Land_Rover_Defender_90_2011","Buick_Regal_GS_2012"],["Mitsubishi_ASX_2010","Mitsubishi_Outlander_PHEV_2016"],["Mercedes-Benz_A_200_2012","Mitsubishi_Montero_Black_Edition_2011"]]},{"name":"SN Road to SN","matches":[["AMC_AMX_390_1968","Chevrolet_Camaro_IROC_Z28_1990","Chevrolet_Camaro_SS_Convertible_2012"],["Mazda_BT-50_2018","Subaru_Outback_2008","Subaru_Baja_Turbo_2003"],["Land_Rover_Range_Rover_Mk_1_1970","Subaru_Alcyone_SVX_1991","BMW_X5_2008"],["Maserati_Merak_SS_1976","Honda_Integra_Type_R_1995","BMW_335i_2008"],["Ford_Maya_1984","Chrysler_Aviat_1994","Vauxhall_Opel_GTC_Concept_2007"],["Vauxhall_Astra_GTE_1988","Ford_Fiesta_ST_2016","Mini_John_Cooper_Works_2016"],["Ford_Probe_GT_1989","Volvo_C30_T5_R-Design_2008","Vauxhall_Calibra_Turbo_1992"],["Acura_Integra_GS-R_1994","Nissan_350Z_Roadster_2004","Nissan_Skyline_GT-R_(R32)_1989"],["Alfa_Romeo_Alfasud_1982","BMW_M3_1986","Subaru_Impreza_WRX_1993"],["Nissan_Silvia_RS-X_(S12)_1983","Nissan_Cedric_(Y34)_2000","Subaru_Legacy_2.0GT_(BP)_2005"]]}]'),c=_(589241),u={name:"MainFindCar",components:{BaseFilterDescription:i.A,BaseFilterDialog:l.A,BaseCardGallery:o.A,BaseConfigCheckBox:n.A,Car:s.A},props:{test:{type:Boolean,default:!1}},data(){return{chsp_prizes:d,all_cars:c,all_cars_obj:{},filterDialog:!1,searchTracks:"",findcFilter:{},list:[],showBigCards:!1}},watch:{},beforeMount(){let e=window.localStorage.getItem("showBigCards");e&&(e=JSON.parse(e),this.showBigCards=e),this.all_cars.map((e=>{this.all_cars_obj[e.rid]=e}))},mounted(){this.finCar()},beforeDestroy(){},computed:{},methods:{openChartOfDialog(){this.filterDialog=!0},closeChartOfDialog(){this.filterDialog=!1},updateChartFilter(e){this.findcFilter=e,this.filterDialog=!1,this.finCar()},finCar(){this.$store.commit("FILTER_FINDCAR_RIDS",{total:5e3})},finCarFinish(e){e=e.map((e=>e.rid)),this.list=[],this.chsp_prizes.map((a=>{a.matches.map(((_,t)=>{let r=3===_.length;_.map(((_,s)=>{if(!e.includes(_))return;let i;r||0!==s||(i="80%"),r||1!==s||(i="20%"),r&&0===s&&(i="70%"),r&&1===s&&(i="20%"),r&&2===s&&(i="10%");let l=this.all_cars_obj[_];this.list.push({rid:_,location:`${a.name} ${t+1}`,chance:i,car:l,color:Vue.resolveClass(l.rq,l.class,"color"),photo:this.cgResolvePhotoUrl(l)})}))}))})),this.list.sort(((e,a)=>`${e.car.rq}_${e.car.rid}`.localeCompare(`${a.car.rq}_${a.car.rid}`)))},cgResolvePhotoUrl(e){try{return e.photoId?_(462416)("./"+decodeURI(e.photoId)+".jpg"):_(5533)("./"+decodeURI(e.rid)+".jpg")}catch(a){return""}}}},C=u,h=_(281656),p=(0,h.A)(C,t,r,!1,null,null,null),g=p.exports},245244:function(e,a,_){var t={"./Audi_Sport_quattro_S1_1985.jpg":650889,"./Citroen_Ami_Super_1973.jpg":836582,"./Citroen_C1_VTi_68_2015.jpg":536242,"./Renault_Fluence_2013.jpg":700088,"./Renault_Sport_Twingo_GT_2016.jpg":361048};function r(e){var a=s(e);return _(a)}function s(e){if(!_.o(t,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return t[e]}r.keys=function(){return Object.keys(t)},r.resolve=s,e.exports=r,r.id=245244},650889:function(e,a,_){"use strict";e.exports=_.p+"img/Audi_Sport_quattro_S1_1985.c607bb39.jpg"},836582:function(e,a,_){"use strict";e.exports=_.p+"img/Citroen_Ami_Super_1973.9d892b2b.jpg"},536242:function(e,a,_){"use strict";e.exports=_.p+"img/Citroen_C1_VTi_68_2015.d1db2204.jpg"},700088:function(e,a,_){"use strict";e.exports=_.p+"img/Renault_Fluence_2013.c0ee8c6e.jpg"},361048:function(e,a,_){"use strict";e.exports=_.p+"img/Renault_Sport_Twingo_GT_2016.e34fdcfa.jpg"}}]);
//# sourceMappingURL=270.eb2d116f.js.map