<template>
  <div class="MainTimeline_Root">
    <div
      v-if="screen === 'normal'"
      :class="{ MainTimeline_InitAnimation: animation }"
      class="MainTimeline_Layout">
      <!-- <template v-if="loading && timeline.length === 0"> -->
      <div class="MainTimeline_Header MainTimeline_W800">
        <div class="MainTimeline_HeaderTop">
          <input
            v-model="searchParams.input"
            :placeholder="$t('m_search')"
            class="D_SearchInput data-hj-allow"
            type="search"
            autocomplete="off"
            @keyup.enter="searchByText()">
          <div class="MainTimeline_HeaderMagnifierButtonBox">
            <button
              class="D_Button MainTimeline_HeaderMagnifierButton"
              :disabled="loading || searchParamsEmptyString === JSON.stringify(searchParams)"
              @click="searchByText()">
              <i class="ticon-search_big" aria-hidden="true"/>
            </button>
          </div>
        </div>
        <div class="MainTimeline_HeaderBottomGroup">
          <div class="MainTimeline_HeaderBottom">
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              :class="{ D_Button_Loading: loading }"
              style="position: relative;"
              @click="openFilterDayDialog()">
              <i class="ticon-filter D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_date") }}</span>
              <div v-if="searchParams.dayStart" class="D_ButtonNote">{{ Number(!!searchParams.dayStart) + Number(!!searchParams.dayEnd) }}</div>
            </button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              :class="{ D_Button_Loading: loading }"
              style="position: relative;"
              @click="openTypeMainFilter()">
              <i class="ticon-filter D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_type") }}</span>
              <div v-if="searchParams.types && searchParams.types.length" class="D_ButtonNote">{{ searchParams.types.length }}</div>
            </button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              :class="{ D_Button_Loading: loading }"
              style="position: relative;"
              @click="openFilterBySpec()">
              <i class="ticon-filter D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_spec") }}</span>
              <div v-if="searchParams.filter && Object.keys(searchParams.filter).length" class="D_ButtonNote">{{ Object.keys(searchParams.filter).length }}</div>
            </button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              :class="{ D_Button_Loading: loading }"
              style="position: relative;"
              @click="prepareAddCarDialog(-2)">
              <i class="ticon-filter D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $tc("m_car", 1) }}</span>
              <div v-if="searchParams.rids && searchParams.rids.length" class="D_ButtonNote">{{ searchParams.rids.length }}</div>
            </button>
            <button
              class="D_Button D_ButtonDark D_ButtonDark2"
              :class="{ D_Button_Loading: loading }"
              style="position: relative;"
              @click="openFilterByRequirements()">
              <i class="ticon-filter D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_requirements") }}</span>
              <div v-if="searchParams.requirements && Object.keys(searchParams.requirements).length" class="D_ButtonNote">{{ Object.keys(searchParams.requirements).length }}</div>
            </button>
            <button
              v-if="searchParamsEmptyString !== JSON.stringify(searchParams)"
              :class="{ D_Button_Loading: loading }"
              class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRedLight"
              @click="clearAllTimelineFilters()">
              <i class="ticon-close_3 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_clear") }}</span>
            </button>
          </div>
          <div class="MainTimeline_HeaderTopMod">
            <button
              v-if="user && user.mod"
              :class="{ D_Button_Loading: loading }"
              class="D_Button D_ButtonDark D_ButtonDark2"
              @click="openCreateEvent($event)">
              <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
              <span>{{ $t("m_new") }}</span>
            </button>
          </div>
        </div>
      </div>
      <template v-if="loading && timeline.length === 0">
        <div class="MainTimeline_Loading MainTimeline_Body MainTimeline_W800">
          <div class="MainTimeline_LoadingBackLine MainTimeline_BackLine">
            <div class="MainTimeline_BackLineHead"></div>
            <div class="MainTimeline_BackLineHead"></div>
            <div class="MainTimeline_BackLineBody"></div>
          </div>
          <div
            v-for="(n, ix) in 10"
            :class="{
              MainTimeline_ItemEven: ix % 2 === 0,
              MainTimeline_ItemOdd: ix % 2 === 1
            }"
            class="MainTimeline_LoadingItemRoot MainTimeline_ItemRoot">
            <div class="MainTimeline_LoadingItem MainTimeline_Item MainTimeline_ItemTop">
              <div class="MainTimeline_LoadingLeft MainTimeline_ItemTopLeft"></div>
              <div class="MainTimeline_LoadingCover MainTimeline_ItemCover"></div>
              <div :style="`width: ${Math.random() * 150 + 100}px`" class="MainTimeline_LoadingRight MainTimeline_ItemTopRight"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="timeline.length === 0">
        <div class="MainTimeline_404 MainTimeline_W800">
          <i class="ticon-line Main_SearchEmptyAddIcon" aria-hidden="true"/>
        </div>
      </template>
      <template v-else>
        
        <div class="MainTimeline_Body MainTimeline_W800">
          <div class="MainTimeline_BackLine">
            <template v-if="searchPage === 0">
              <div class="MainTimeline_BackLineHead"></div>
              <div class="MainTimeline_BackLineHead"></div>
            </template>
            <div class="MainTimeline_BackLineBody"></div>
          </div>
          <div v-if="searchPage > 0" class="D_Center MainTimeline_NextPageLayout">
            <button
              :class="{ D_Button_Loading: loading }"
              class="D_Button D_ButtonDark D_ButtonDark2 MainTimeline_PageButton"
              @click="previousPage()">
              <span>{{ $t("m_previousPage") }}</span>
            </button>
          </div>
          <div
            v-for="(item, ix) in timeline"
            :class="`
              ${ix % 2 === 0 ? 'MainTimeline_ItemEven ' : '' }
              ${ix % 2 === 1 ? 'MainTimeline_ItemOdd ' : '' }
              MainTimeline_Type${ (item.type || '').replaceAll(' ', '') } 
              MainTimeline_Class${ (item.p_rid || []).length === 1 ? resolvedRids[item.p_rid[0]].class : '' } 
            `"
            :style="`
              --class-color: ${(item.p_rid || []).length === 1 ? resolvedRids[item.p_rid[0]].color : ''} ;
              --class-color-rgb: ${(item.p_rid || []).length === 1 ? resolvedRids[item.p_rid[0]].colorRgb : item.color || '' } ;
            `"
            class="MainTimeline_ItemRoot">
            <div class="MainTimeline_ItemBacklight"></div>
            <button class="MainTimeline_Item D_Button" @click="openDetailDialog(item, ix)">
              
              <div class="MainTimeline_ItemTop">
                <div class="MainTimeline_ItemTopLeft">
                  <div class="MainTimeline_ItemTopLeft_Day">{{ item.dayStart.slice(-2) }}</div>
                  <div class="MainTimeline_ItemTopLeft_Month">{{ new Date(`${item.dayStart}T00:00:00`).toLocaleString(undefined,{month:'short'}) }}</div>
                </div>
                <div class="MainTimeline_ItemCover">
                  <div
                    v-if="(item.p_rid || []).length === 1 && item.type !== 'Veteran Challenge'"
                    class="MainTimeline_Card_Header2Left">
                    <img :src="resolvedRids[item.p_rid[0]].photo" class="MainTimeline_Card_Header2Img" alt="">
                    <div class="MainTimeline_Card_Header2Right2">{{ resolvedRids[item.p_rid[0]].rq }}</div>
                  </div>
                  <img
                    v-else-if="item.type === 'Veteran Challenge'"
                    src="@/assets/tdr_veteran.png"
                    class="MainTimeline_Card_VeteranImg"
                    alt="">
                  <img
                    v-else-if="item.type === 'Offers'"
                    src="@/assets/tdr_offer.png"
                    class="MainTimeline_Card_VeteranImg"
                    alt="">
                  <img
                    v-else-if="item.links && item.links.find(x => x.cover)"
                    :src="item.links.find(x => x.cover).url"
                    class="MainTimeline_Card_VeteranImg"
                    alt=""
                    @load="afterLoadImg($event)">
                  <img
                    v-else-if="item.type === 'Game News' || item.type === 'Community News'"
                    src="@/assets/tdr_newspaper.png"
                    class="MainTimeline_Card_VeteranImg"
                    alt="">
                  <!-- <div v-if="(item.p_rid || []).length === 1" class="Main_2" style="display: contents;">
                    <div class="Main_Body" style="display: contents;">
                    </div>
                  </div> -->
                  <div v-else class="MainTimeline_DefaultCover">
                    <i class="ticon-info-circle MainTimeline_ItemCoverIcon" aria-hidden="true"/>
                  </div>
                </div>
                <div class="MainTimeline_ItemTopRight">
                  <template v-if="(item.p_rid || []).length === 1 && item.type !== 'Veteran Challenge'">
                    <div class="MainTimeline_Line1Car">
                      <b class="MainTimeline_Line1RQ">RQ{{ resolvedRids[item.p_rid[0]].rq }}&nbsp;</b>
                      <span class="MainTimeline_Line1Brand">{{ resolvedRids[item.p_rid[0]].brand }}</span>
                    </div>
                    <div class="MainTimeline_Line2Car">{{ resolvedRids[item.p_rid[0]].onlyName }}</div>
                    <div class="MainTimeline_ItemTypeText">{{ item.type }}</div>
                  </template>
                  <template v-else>
                    <div class="MainTimeline_ItemTopTitle">{{ item.name }}</div>
                    <div v-if="item.type === 'Veteran Challenge'" class="MainTimeline_ItemVeteranCriteria">
                      <BaseFilterDescription
                        :filter="item.filter"
                        :asFilterLabel="true"
                        :hideIfEmpty="true"
                        :emitDescResolved="false"
                        class="MainTimeline_ItemVeteranFilterDescription"/>
                    </div>
                    <div v-if="item.type !== 'News' && item.type !== 'Veteran Challenge' && item.type !== 'Other'" class="MainTimeline_ItemTypeText">{{ item.type }}</div>
                    <div v-else-if="(item.p_rid || []).length === 0 && item.type === 'News'" class="MainTimeline_ItemTopSubTitle">{{ item.description }}</div>
                    <div v-if="(item.p_rid || []).length > 1 || item.type === 'Veteran Challenge'" class="MainTimeline_ItemTopMiniCars">
                      <template v-for="(car, icar) in item.p_rid">
                        <div
                          v-if="icar <= 4"
                          :style="`--class-color: ${resolvedRids[car].color} ;`"
                          class="MainTimeline_MiniCard">
                          <img :src="resolvedRids[car].photo" class="MainTimeline_MiniCard_Header2Img" alt="">
                          <div class="MainTimeline_MiniCard_Header2Right2">{{ resolvedRids[car].rq }}</div>
                        </div>
                        <div v-if="icar === 5" class="MainTimeline_MiniCardPlus">+{{ item.p_rid.length - 5 }}</div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>

            </button>
            <div v-if="timeline[ix+1] && item.dayStart.slice(0,4) !== timeline[ix+1].dayStart.slice(0,4)" class="MainTimeline_YearBelow">
              <i class="ticon-arrow_up_3 MainTimeline_YearArrow" aria-hidden="true"/>
              <div class="MainTimeline_YearText">{{ item.dayStart.slice(0,4) }}</div>
            </div>
            <div v-else-if="timeline[ix-1] && item.dayStart.slice(0,4) !== timeline[ix-1].dayStart.slice(0,4)" class="MainTimeline_YearBelow MainTimeline_YearInvert">
              <i class="ticon-arrow_up_3 MainTimeline_YearArrow" aria-hidden="true"/>
              <div class="MainTimeline_YearText">{{ item.dayStart.slice(0,4) }}</div>
            </div>
          </div>
          <div v-if="showNextPage" class="D_Center MainTimeline_NextPageLayout">
            <button
              :class="{ D_Button_Loading: loading }"
              class="D_Button D_ButtonDark D_ButtonDark2 MainTimeline_PageButton"
              @click="nextPage()">
              <span>{{ $t("m_nextPage") }}</span>
            </button>
          </div>
          <div v-else class="D_Center MainTimeline_NextPageLayout">
            <div class="MainTimeline_EndBall"></div>
          </div>
        </div>
      </template>
    </div>
    <div
      v-else-if="screen === 'new'"
      :class="{ MainTimeline_InitAnimation: animation }"
      class="MainTimeline_Create_Layout">
      <div class="MainTimeline_Create_Header MainTimeline_W800">
      </div>
      <div class="MainTimeline_Create_Body MainTimeline_W800">

        <div class="Main_FilterChipsFlex">
          <template v-for="item in types">
            <BaseChip
              :inputValue="ti.type"
              class="BaseChip_MinWidth BaseChip_DontCrop"
              :class="{ D_ButtonRed: changeTypeValueConfirm === item }"
              :value="item"
              @click="changeType(item)">
              <span>{{ item }}</span>
            </BaseChip>
          </template>
        </div>

        <template v-if="ti.type">

          <div v-if="
              ti.type === 'Tri-Series' ||
              ti.type === 'Collection Series' ||
              ti.type === 'Veteran Challenge' ||
              ti.type === 'GT Series' ||
              ti.type === 'Extraordinary Event' ||
              ti.type === 'Extraordinary Challenge' ||
              ti.type === 'Other'
            "
            class="MainTimeline_SpecificCar Space_TopGiga">
            <div class="MainTimeline_CarsList" :class="{ MainTimeline_CarsListEmpty: ti.p_rid.length === 0 }">
              <template v-for="rid in ti.p_rid">
                <button
                  class="D_Button D_ButtonDark D_ButtonDark2 MainTimeline_CarButton"
                  :class="{ MainTimeline_CarButtonRed: lastRidClick === rid }"
                  @click="carListMainDeleteClick(rid, 'main')">
                  <div class="MainTimeline_CarCard" :style="`--color: ${resolvedRids[rid].color}`">
                    <div class="MainTimeline_BankPhoto">
                      <img :src="resolvedRids[rid].photo" class="MainTimeline_BankPhotoImg" alt="">
                    </div>
                    <div class="MainTimeline_RQ">{{ resolvedRids[rid].rq }}</div>
                  </div>
                </button>
              </template>
              <div v-if="((ti.type !== 'Tri-Series' && ti.type !== 'GT Series') || ti.p_rid.length < 1) && (ti.type !== 'Veteran Challenge' || ti.p_rid.length < 3)" class="MainTimeline_AddCarBox">
                <button
                  class="D_Button D_ButtonDark MainTimeline_SearchCarButton"
                  @click="prepareAddCarDialog(-1)">
                  <i class="ticon-plus_2 MainTimeline_AddIcon" aria-hidden="true"/>
                  <div v-if="ti.p_rid.length === 0" class="MainTimeline_AddLabel" style="margin-left: 5px;">{{ $t("m_rewardedCar") }}</div>
                </button>
              </div>
            </div>
          </div>

          <div class="D_Center Space_TopGiga">
            <BaseText
              v-model="ti.name"
              class="BaseText_Big MainTimeline_Create_BaseText"
              type="normal"
              :disabled="newLoading"
              :label="$t('c_name')"
              placeholder="" />
          </div>


          <div class="D_Center Space_TopGiga">
            <BaseDatePicker
              v-model="ti.dayStart"
              :max="ti.dayEnd"
              class="MainTimeline_Create_BaseText"
              :label="`${$t('m_date')}`" />
          </div>

          <div class="D_Center Space_TopGiga">
            <BaseDatePicker
              v-model="ti.dayEnd"
              :min="ti.dayStart"
              class="MainTimeline_Create_BaseText"
              :label="`${$t('m_dateEnd')} (${$t('m_optional')})`" />
          </div>

          
          <!-- filter, optional, veteran -->
          <div v-if="ti.type === 'Veteran Challenge' || ti.type === 'Extraordinary Challenge' || ti.type === 'GT Series' || ti.type === 'Other'" class="D_Center Space_TopGiga MainTimeline_Create_W600">
            <BaseFilterDescription
              :filter="ti.filter"
              :asFilterLabel="true"
              :hideIfEmpty="false"
              :emitDescResolved="true"
              :isKing="true"
              class="MainTimeline_FilterDescription"
              @changeClick="openMainFitlerDialog()" />
            <!-- <div class="MainTimeline_" style="width: 300px; margin: 0 auto;"></div> -->
          </div>


          <!-- event -->
          <div v-if="ti.type === 'Tri-Series' || ti.type === 'GT Series' || ti.type === 'Extraordinary Event' || ti.type === 'Other'" class="D_Center Space_TopGiga MainTimeline_Create_W600" style="max-width: unset; padding-top: 15px;">
            <div
              v-for="(event, iEvent) in ti.events"
              :class="`MainTimeline_C_${iEvent % 3}`"
              class="MainTimeline_Create_EventItem">

              <div class="MainTimeline_EventNameRQ">
                <BaseText
                  v-model="event.name"
                  class="BaseText_Big"
                  type="normal"
                  style="flex-grow: 1;"
                  :label="$t('c_name')"
                  placeholder="" />
                <BaseText
                  v-model="event.rqLimit"
                  class="BaseText_Big"
                  type="integer"
                  style="max-width: 80px;"
                  :label="$t('m_rqLimit')"
                  placeholder="" />
              </div>


              <div class="MainTimeline_EventFilterCarList" style="margin-top: 15px;">
                <BaseFilterDescription
                  :filter="event.filter"
                  :filter2="event.filter2"
                  :filter3="event.filter3"
                  :useWhatFilter="event.eventUseWhatFilter"
                  :isKing="true"
                  :user="user"
                  class="MainTimeline_FilterDescription"
                  @changeClick="openEventRequirementsDialog(iEvent, event.eventUseWhatFilter)"
                  @useFilter="event.eventUseWhatFilter = $event;"
                  @newNameFilter="eventRenameFilter($event, iEvent)" />
                <div class="MainTimeline_CarsList" :class="{ MainTimeline_CarsListEmpty: event.rids.length === 0 }" style="margin-top: 0;">
                  <template v-for="rid in event.rids">
                    <button
                      class="D_Button D_ButtonDark D_ButtonDark2 MainTimeline_CarButton"
                      :class="{ MainTimeline_CarButtonRed: lastRidClick === rid }"
                      @click="carListMainDeleteClick(rid, 'event', iEvent)">
                      <div class="MainTimeline_CarCard" :style="`--color: ${resolvedRids[rid].color}`">
                        <div class="MainTimeline_BankPhoto">
                          <img :src="resolvedRids[rid].photo" class="MainTimeline_BankPhotoImg" alt="">
                        </div>
                        <div class="MainTimeline_RQ">{{ resolvedRids[rid].rq }}</div>
                      </div>
                    </button>
                  </template>
                  <div class="MainTimeline_AddCarBox">
                    <button
                      class="D_Button D_ButtonDark MainTimeline_SearchCarButton"
                      @click="prepareAddCarDialog(iEvent)">
                      <i class="ticon-plus_2 MainTimeline_AddIcon" aria-hidden="true"/>
                      <div v-if="event.rids.length === 0" class="MainTimeline_AddLabel" style="margin-left: 5px;">{{ $t("m_rewardedCar") }}</div>
                    </button>
                  </div>
                </div>
              </div>

              <div class="MainTimeline_TracksetList" style="margin-top: 15px;">
                <BaseEventTrackbox
                  :event="event"
                  :eventLoadingAny="false"
                  :user="user"
                  :check="null"
                  :eventForceAnalyze="true"
                  :eventBestPerTrack="{}"
                  :showBestPerTrack="false"
                  :hideCheckBox="true"
                  :disableCampaignTip="true"
                  @newindex="evIx = iEvent; eventTrackNewIndex($event)"
                  @openDialogTrackSearch="evIx = iEvent; eventTracksetSelected = $event.itrackset; eventRaceSelected = $event.itrackMonoArray; openDialogTrackSearch(false)"
                  @eventMoveTrackRight="evIx = iEvent; eventMoveTrackRight($event.itrackset, $event.itrackMonoArray);"
                  @openKingFilter=""
                  @up="evIx = iEvent; eventMoveTrackset('up', $event.itrackset);"
                  @down="evIx = iEvent; eventMoveTrackset('down', $event.itrackset);"
                  @delete="evIx = iEvent; eventDeleteTrackset($event.itrackset);"
                />
                <div class="D_Center MainTimeline_TracksetFooter">
                  <button v-if="event.trackset && event.trackset.length < 4" class="D_Button D_Button D_ButtonDark D_ButtonDark2" @click="evIx = iEvent; eventAddTrackset()">
                    <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
                    <span>{{ $t("m_trackset") }}</span>
                  </button>
                  <button
                    :class="{ D_ButtonRed: deleteEventIndex === iEvent }"
                    class="D_Button D_ButtonDark D_ButtonDark2"
                    @click="deleteEventClick(iEvent)">{{ $t("m_deleteEvent") }}</button>
                  <button
                    v-if="iEvent !== 0"
                    :class="{ D_ButtonRed: deleteEventIndex === iEvent }"
                    class="D_Button D_ButtonDark D_ButtonDark2"
                    @click="moveEventUp(iEvent)">
                    <i class="ticon-arrow_up_3" aria-hidden="true"/>
                  </button>
                </div>
              </div>

            </div>
            <div class="D_Center" style="gap: 10px;">
              <button
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="pushNewEvent()">
                <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t("m_event") }}</span>
              </button>
              <button
                v-if="eventToCopy"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="pushNewEvent(true)">
                <i class="ticon-code D_ButtonIcon" aria-hidden="true"/>
                <span>{{ $t("m_paste") }} {{ $t("m_event") }}</span>
              </button>
            </div>
          </div>
          <!-- event -->

          

          
          <!-- links -->
          <div class="MainTimeline_LinksLayout D_Center Space_TopGiga MainTimeline_Create_W600" style="padding-top: 15px;">
            <div
              v-for="(item, iLink) in ti.links"
              :class="`MainTimeline_C_${ (item.localUrl || (item.url && item.url.includes('tdrimages.s3')) ) ? '' : iLink % 3}`"
              class="MainTimeline_LinkItem">
              <div
                v-if="item.localUrl || (item.url && item.url.includes('tdrimages.s3'))"
                :class="{ MainTimeline_LinkImageCover: item.cover }"
                class="MainTimeline_LinkImage"
                @click="setLinkAsCover(iLink)">
                <img :src="item.localUrl || item.url" class="MainTimeline_LinkImageImg" alt="">
              </div>
              <BaseText
                v-model="item.text"
                class="BaseText_Big"
                type="normal"
                style="flex-grow: 1;"
                :placeholder="`${$t('c_name')} (optional)`" />
              <button
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="initUploadImage(iLink)">
                <i class="ticon-camera1" aria-hidden="true"/>
              </button>
              <button
                :class="{ D_ButtonRed: deleteLinkIndex === iLink }"
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="deleteLinkClick(iLink)">{{ $t("m_delete") }}</button>
              <BaseText
                v-model="item.url"
                :disabled="!!item.localUrl"
                class="BaseText_Big"
                type="normal"
                style="flex-grow: 1; grid-column: 1 / span 2;"
                placeholder="https://..."
                @paste="interceptLinkPaste($event, iLink)" />
              <button
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="pasteLink(iLink)">{{ $t("m_paste") }}</button>
            </div>
            <div class="D_Center">
              <button
                class="D_Button D_ButtonDark D_ButtonDark2"
                @click="ti.links.push(getNewLink())">
                <i class="ticon-plus_2 D_ButtonIcon" aria-hidden="true"/>
                <span>Link/Image</span>
              </button>
            </div>
          </div>
          <!-- links -->



          <div class="D_Center Space_TopGiga MainTimeline_Create_W600">
            <div class="BaseText_Label">{{ $t('m_description') }} ({{ $t('m_optional') }})</div>
            <textarea
              v-model="ti.description"
              rows="4"
              class="Main_TextArea data-hj-allow"
              placeholder="" />
          </div>


          <div v-if="(ti.p_rid || []).length !== 1 && ti.type !== 'Veteran Challenge' && ti.type !== 'Offers'" class="MainTimeline_ColorPicker Space_TopGiga Main_FilterChipsFlex">
            <template v-for="color in colors">
              <BaseChip
                v-model="ti.color"
                :style="`--color: ${color}`"
                class="BaseChip_MinWidth BaseChip_DontCrop MainTimeline_ColorChip"
                :value="color">
                <div />
              </BaseChip>
            </template>
          </div>




        </template>



      </div>
      
      <div class="MainTimeline_Create_Footer MainTimeline_W800" style="margin-top: 40px;">
        <button
          :class="{ D_ButtonRed: cancelCreate }"
          class="D_Button D_ButtonDark D_ButtonDark2"
          @click="cancelCreateEvent()">
          <span>{{ $t("m_cancel") }}</span>
        </button>
        <button
          :class="{ D_Button_Loading: newLoading || loading }"
          :disabled="!readyToSave || newLoading || loading"
          class="D_Button Main_SaveAllButton"
          @click="saveTimelineItem()">
          <span>{{ $t("m_save") }}</span>
        </button>
      </div>

      <!-- TEMP -->
      <!-- <div class="MainTimeline_Create_Footer MainTimeline_W800" style="margin-top: 40px; white-space: pre;white-space: break-spaces;word-break: break-word;">
        {{ this.ti }}
      </div> -->

    </div>



    <!-- details dialog -->
    <BaseDialog
      :active="detailDialog"
      :transparent="false"
      :isStatic="false"
      :forceScroll="false"
      max-width="550px"
      min-width="240px"
      @close="detailDialog = false;">
      <div class="MainTimeline_ViewLayout">
        <div class="Main_DialogTitle">{{ detailObj.name }}</div>
        <div class="MainTimeline_DialogMid">
          <div class="MainTimeline_DialogInfo">
            <div class="MainTimeline_DialogInfoLabel">{{ $t('m_type') }}</div>
            <div class="MainTimeline_DialogInfoValue">{{ detailObj.type }}</div>
          </div>
          <div class="MainTimeline_DialogInfo">
            <div class="MainTimeline_DialogInfoLabel">{{ $t('m_date') }}</div>
            <div class="MainTimeline_DialogInfoValue">{{ new Date(detailObj.dayStart).toLocaleDateString() }}</div>
          </div>
          <div v-if="detailObj.dayEnd" class="MainTimeline_DialogInfo">
            <div class="MainTimeline_DialogInfoLabel">{{ $t('m_dateEnd') }}</div>
            <div class="MainTimeline_DialogInfoValue">{{ new Date(detailObj.dayEnd).toLocaleDateString() }}</div>
          </div>
          <div class="MainTimeline_DialogInfo">
            <div class="MainTimeline_DialogInfoLabel">{{ $t('m_by') }}</div>
            <div class="MainTimeline_DialogInfoValue" :class="`Main_UserT${highlightsUsers[detailObj.author]}`">{{ detailObj.author }}</div>
          </div>
        </div>
        <div class="MainTimeline_DialogViewDual">
          <div v-if="detailObj.p_rid && detailObj.p_rid.length === 1" class="MainTimeline_BaseCardBox">
            <div class="MainTimeline_BaseCardDiv">
              <BaseCard
                :car="resolvedRids[detailObj.p_rid[0]]"
                :isDialogBox="true"
                :options="false" />
            </div>
            <template v-if="!detailObj.filter || Object.keys(detailObj.filter).length === 0">
              <div v-for="car in [resolvedRids[detailObj.p_rid[0]]]" class="Row_DialogCardBottom MainTimeline_BaseCardSide">
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">ABS</div>
                  <div :class="{ Row_DialogCardStatCorrect: car.abs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ car.abs ? 'Yes' : 'No' }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">TCS</div>
                  <div :class="{ Row_DialogCardStatCorrect: car.tcs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ car.tcs ? 'Yes' : 'No' }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">{{ $tc("c_clearance", 1) }}</div>
                  <div class="Row_DialogCardStatValue">{{ $t(`c_${car.clearance.toLowerCase()}`) }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">MRA ({{ $t("c_stock").toLowerCase() }})</div>
                  <div class="Row_DialogCardStatValue">{{ car.mra || '-' }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">{{ $t("c_weight") }} ({{ $t("c_stock").toLowerCase() }})</div>
                  <div class="Row_DialogCardStatValue">{{ car.weight }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">{{ $t("c_fuel") }}</div>
                  <div class="Row_DialogCardStatValue">{{ $t(`c_${car.fuel.toLowerCase()}`) }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">{{ $t("c_seats") }}</div>
                  <div class="Row_DialogCardStatValue">{{ car.seats }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">{{ $t("c_enginePos") }}</div>
                  <div class="Row_DialogCardStatValue">{{ $t(`c_${car.engine.toLowerCase()}Engine`) }}</div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">{{ $t("c_bodyStyle") }}</div>
                  <div class="Row_DialogCardStatValue">
                    <template v-for="(body, index) in car.bodyTypes">
                      <template v-if="index !== 0">,&nbsp;</template>
                      <template>{{ $t(`c_${body.toLowerCase()}`) }}</template>
                    </template>
                  </div>
                </div>
                <div class="Row_DialogCardStat">
                  <div class="Row_DialogCardStatLabel">{{ $t("c_brake") }}</div>
                  <div class="Row_DialogCardStatValue">{{ tuneDialogCar.brake || "?" }}</div>
                </div>
              </div>
            </template>
          </div>
          <div v-else-if="detailObj.p_rid && detailObj.p_rid.length > 1" class="MainTimeline_DialogViewRewardedCars Main_DarkScroll">
            <div class="MainTimeline_DialogTitleDivider">{{ $t("m_rewardedCar") }}</div>
            <div class="MainTimeline_DialogPrizeCars">
              <button
                v-for="rid in detailObj.p_rid"
                class="D_Button D_ButtonDark D_ButtonDark2 MainTimeline_CarButton"
                @click="openDetailCarDialog(rid)">
                <div class="MainTimeline_CarCard" :style="`--color: ${resolvedRids[rid].color}`">
                  <div class="MainTimeline_BankPhoto">
                    <img :src="resolvedRids[rid].photo" class="MainTimeline_BankPhotoImg" alt="">
                  </div>
                  <div class="MainTimeline_RQ">{{ resolvedRids[rid].rq }}</div>
                </div>
              </button>
            </div>
          </div>
          <BaseFilterDescription
            v-if="detailObj.filter && Object.keys(detailObj.filter).length > 0"
            :filter="detailObj.filter"
            :asFilterLabel="true"
            :hideIfEmpty="false"
            :emitDescResolved="true"
            class="MainTimeline_DialogViewFilterDescription" />
        </div>

        <div v-if="detailObj.events && detailObj.events.length > 0" class="MainTimeline_EventsLayout">
          <div v-for="(event, iEvent) in detailObj.events" class="MainTimeline_EventsItem">
            <div class="MainTimeline_EventsItemTop">
              <div class="MainTimeline_EventsItemName">{{ event.name }}</div>
              <!-- <div class="MainTimeline_EventsItemRQ">{{ $t('m_rqLimit') }}: {{ event.rqLimit }}</div> -->
            </div>
            <div class="MainTimeline_EventsItemMid">
              <div class="MainTimeline_DialogViewRewardedCars Main_DarkScroll">
                <div class="MainTimeline_DialogTitleDivider2">{{ $t("m_rewardedCar") }}</div>
                <div class="MainTimeline_DialogPrizeCars">
                  <button
                    v-for="rid in event.rids"
                    class="D_Button D_ButtonDark D_ButtonDark2 MainTimeline_CarButton"
                    @click="openDetailCarDialog(rid)">
                    <div class="MainTimeline_CarCard" :style="`--color: ${resolvedRids[rid].color}`">
                      <div class="MainTimeline_BankPhoto">
                        <img :src="resolvedRids[rid].photo" class="MainTimeline_BankPhotoImg" alt="">
                      </div>
                      <div class="MainTimeline_RQ">{{ resolvedRids[rid].rq }}</div>
                    </div>
                  </button>
                </div>
              </div>
              <BaseFilterDescription
                v-if="event.filter && Object.keys(event.filter).length > 0"
                :filter="event.filter"
                :filter2="event.filter2"
                :filter3="event.filter3"
                :useWhatFilter="event.eventUseWhatFilter"
                :hideIfEmpty="false"
                :emitDescResolved="true"
                @useFilter="event.eventUseWhatFilter = $event;"
                class="MainTimeline_DialogViewFilterDescription" />
            </div>
            <div class="MainTimeline_EventsItemBottom">
              <div class="MainTimeline_TracksetList" style="margin-top: 15px;">
                <BaseEventTrackbox
                  :event="event"
                  :eventLoadingAny="false"
                  :user="{ mod: false }"
                  :check="null"
                  :eventForceAnalyze="false"
                  :eventBestPerTrack="{}"
                  :showBestPerTrack="false"
                  :hideCheckBox="true"
                  :disableCampaignTip="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="detailObj.links && detailObj.links.filter(x => x.url && x.url.includes('tdrimages.s3')).length > 0"
          :class="{ MainTimeline_DialogGalleryMany: detailObj.type !== 'Offers' && detailObj.links.filter(x => x.url && x.url.includes('tdrimages.s3')).length > 2 }"
          class="MainTimeline_DialogGalleryLayout">
          <div class="MainTimeline_DialogInfoLabel">{{ $t('m_images') }}</div>
          <div class="MainTimeline_DialogGalleryInner">
            <button
              v-for="link in detailObj.links.filter(x => x.url && x.url.includes('tdrimages.s3'))"
              class="MainTimeline_DialogGalleryItem D_Button"
              @click="openPicture(link)">
              <img :src="link.url" class="MainTimeline_GalleryPictureImg" alt="" @load="afterLoadImg($event, true)">
            </button>
          </div>
        </div>
        <div
          v-if="detailObj.links && detailObj.links.filter(x => x.url && !x.url.includes('tdrimages.s3')).length > 0"
          class="MainTimeline_DialogLinkLayout">
          <div class="MainTimeline_DialogInfoLabel">{{ $t('m_links') }}</div>
          <div class="MainTimeline_DialogLinkInner" :class="{ MainTimeline_DialogLinkAlone: detailObj.links.filter(x => x.url && !x.url.includes('tdrimages.s3')).length === 1 }">
            <div
              v-for="link in detailObj.links.filter(x => x.url && !x.url.includes('tdrimages.s3'))"
              class="MainTimeline_DialogLinkItem">
              <a
                class="D_Button Main_LoginToEdit MainTimeline_DialogLinkButton"
                target="_blank"
                rel="noopener noreferrer"
                :href="link.url">
                <span class="">{{ link.text || $t('m_link') }}</span>
                <i class="ticon-internal" style="font-size: 0.8em; margin-left: 5px;" aria-hidden="true"/>
              </a>
              <div class="MainTimeline_DialogLinkSub">{{ link.url }}</div>
            </div>
          </div>
        </div>

        <div v-if="detailObj.description" class="MainTimeline_DialogMid">
          <div class="MainTimeline_DialogInfo">
            <div class="MainTimeline_DialogInfoLabel">{{ $t('m_description') }}</div>
            <div class="MainTimeline_DialogInfoValue" style="font-size: 14px;">{{ detailObj.description }}</div>
          </div>
        </div>
        <div v-if="user && user.mod" class="D_Center Space_TopPlus" style="gap: 5px;">
          <button
            :class="{ D_Button_Loading: loading }"
            class="D_Button D_ButtonDark D_ButtonDark2 D_ButtonRed"
            @click="askDeleteItem(detailObj)">
            <span>{{ $t("m_delete") }}</span>
          </button>
          <button
            :class="{ D_Button_Loading: loading }"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="editItem(detailObj)">
            <span>{{ $t("m_edit") }}</span>
          </button>
        </div>
      </div>
    </BaseDialog>
    <!-- details dialog -->




    <!-- car view -->
    <BaseDialog
      :active="tuneDialogActive"
      :transparent="false"
      :lazy="true"
      max-width="420px"
      min-width="240px"
      @close="closeTune()">
      <div class="Main_TuneDialog">

        <div v-if="tuneDialogActive" class="Row_DialogLayout">
          <div class="Row_DialogBody Space_TopPlus">
            <div class="Row_DialogCard">
              <div class="Row_DialogCardLeft">
                <BaseCard
                  :car="tuneDialogCar"
                  :isDialogBox="true"
                  :options="false" />
              </div>
              <div class="Row_DialogCardRight">
                <BaseText :value="resolveStat(tuneDialogCar, 'topSpeed')" :label="$t('c_topSpeed')" class="Space_Bottom Row_FieldStat" :disabled="true" />
                <BaseText :value="resolveStat(tuneDialogCar, 'acel')" label="0-60mph" class="Space_Bottom Row_FieldStat" :disabled="true" />
                <BaseText :value="resolveStat(tuneDialogCar, 'hand')" :label="$t('c_handling')" class="Row_FieldStat" :disabled="true" />
              </div>
            </div>
          </div>
          <div v-if="tuneDialogCar.tags && tuneDialogCar.tags.length > 0" class="Row_DialogCardTags" style="margin-top: 12px;">
            <BaseGameTag
              v-for="tag in tuneDialogCar.tags"
              :key="tag"
              :tag="tag" />
          </div>
          <div class="Row_DialogCardDual Space_TopPlus">
            <div class="Row_DialogCardBottom">
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">ABS</div>
                <div :class="{ Row_DialogCardStatCorrect: tuneDialogCar.abs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ tuneDialogCar.abs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">TCS</div>
                <div :class="{ Row_DialogCardStatCorrect: tuneDialogCar.tcs }" class="Row_DialogCardStatValue Row_DialogCardStatRed">{{ tuneDialogCar.tcs ? 'Yes' : 'No' }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $tc("c_clearance", 1) }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.clearance.toLowerCase()}`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">MRA ({{ $t("c_stock").toLowerCase() }})</div>
                <div class="Row_DialogCardStatValue">
                  <span v-if="tuneDialogCar.mra" style="margin-right: 7px;">{{ tuneDialogCar.mra }}</span>
                </div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_weight") }} ({{ $t("c_stock").toLowerCase() }})</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.weight }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_fuel") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.fuel.toLowerCase()}`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_seats") }}</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.seats }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_enginePos") }}</div>
                <div class="Row_DialogCardStatValue">{{ $t(`c_${tuneDialogCar.engine.toLowerCase()}Engine`) }}</div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_bodyStyle") }}</div>
                <div class="Row_DialogCardStatValue">
                  <template v-for="(body, index) in tuneDialogCar.bodyTypes">
                    <template v-if="index !== 0">,&nbsp;</template>
                    <template>{{ $t(`c_${body.toLowerCase()}`) }}</template>
                  </template>
                </div>
              </div>
              <div class="Row_DialogCardStat">
                <div class="Row_DialogCardStatLabel">{{ $t("c_brake") }}</div>
                <div class="Row_DialogCardStatValue">{{ tuneDialogCar.brake || "?" }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </BaseDialog>
    <!-- car view -->



    <BaseDialog
      :active="imageDialog"
      :transparent="true"
      :isStatic="false"
      :forceScroll="false"
      :lazy="true"
      :displayContents="true"
      max-width="80vw"
      min-width="240px"
      @close="imageDialog = false;">
      <div class="MainTimeline_DialogImageLayout">
        <img
          v-if="imageDialogUrl"
          :src="imageDialogUrl"
          class="MainTimeline_DialogImageLayoutImg"
          alt="">
      </div>
    </BaseDialog>



    <BaseDialog
      :active="confirmDelete.dialog"
      :transparent="false"
      :lazy="true"
      zindex="101"
      max-width="420px"
      min-width="240px"
      @close="confirmDelete.dialog = false;">
      <div style="Main_DialogConfirm">
        <div class="Main_DialogMessage">{{ confirmDelete.msg }}</div>
        <div class="Main_DialogBottom">
          <button
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.dialog = false;">
            <span>{{ $t("m_cancel") }}</span>
          </button>
          <button
            :class="`${ newLoading ? 'D_Button_Loading ' : '' }`+
                    `${ confirmDelete.classe }`"
            :disabled="newLoading"
            class="D_Button Main_OptionsButton"
            @click="confirmDelete.action">
            <span>{{ confirmDelete.actionLabel }}</span>
          </button>
        </div>
      </div>
    </BaseDialog>


    <!-- timeline list filter by spec -->
    <BaseFilterDialog
      v-model="filterBySpecDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      @clearFilterUpdate="updateFilterBySpec($event)"
    />

    <!-- timeline list filter by requirements -->
    <BaseFilterDialog
      v-model="filterByRequirementsDialog"
      :filterOnly="true"
      :all_cars="all_cars"
      :config="{
        topSpeed: false,
        acel: false,
        hand: false,
        weight: false,
        brake: false,
        tcs: false,
        abs: false
      }"
      @clearFilterUpdate="updateFilterByRequirements($event)"
    />

    <!-- Select car -->
    <BaseFilterDialog
      v-model="searchCarDialog"
      :lastestList="lastestList"
      :highlightsUsers="highlightsUsers"
      :all_cars="all_cars"
      :sortEnabled="true"
      :enableCounters="false"
      :forceNonPrize="false"
      :markedList="searchParams.rids || []"
      importFilterName="TIMELINE_FILTER_IMPORT"
      @addCar="addCarNew($event)"
      @close="onCloseSearchCarDialog()"
    />

    <!-- types dialog -->
    <BaseDialog
      :active="typesDialog"
      :transparent="false"
      :isStatic="false"
      :forceScroll="true"
      :lazy="true"
      max-width="350px"
      min-width="240px"
      @close="closeTypeMainFilter()">
      <div class="">
        <div class="">
          <div class="Main_DialogTitle">{{ $t('m_type') }}</div>
        </div>
        <div class="Main_FilterChipsFlex">
          <template v-for="item in types">
            <BaseChip
              v-model="searchParams.types"
              class="BaseChip_MinWidth BaseChip_DontCrop"
              :value="item">
              <span>{{ item }}</span>
            </BaseChip>
          </template>
        </div>
      </div>
    </BaseDialog>

    <!-- types dialog -->
    <BaseDialog
      :active="filterDayDialog"
      :transparent="false"
      :isStatic="false"
      :forceScroll="true"
      :lazy="true"
      max-width="350px"
      min-width="240px"
      @close="closeFilterDayDialog()">
      <div class="">
        <div class="D_Center" style="justify-content: flex-end;">
          <button
            :disabled="!searchParams.dayStart && !searchParams.dayEnd"
            class="D_Button D_ButtonDark D_ButtonDark2"
            @click="clearDateOnly()">
            <span>{{ $t("m_clear") }}</span>
          </button>
        </div>

        <div class="D_Center">
          <BaseDatePicker
            v-model="searchParams.dayStart"
            :max="searchParams.dayEnd"
            class="MainTimeline_Create_BaseText"
            :label="`${$t('m_date')}`" />
        </div>

        <div class="D_Center Space_TopGiga">
          <BaseDatePicker
            v-model="searchParams.dayEnd"
            :min="searchParams.dayStart"
            class="MainTimeline_Create_BaseText"
            :label="`${$t('m_dateEnd')} (${$t('m_optional')})`" />
        </div>

        


      </div>
    </BaseDialog>





    <template v-if="newTools">

      <!-- filter for timeline item directly -->
      <BaseFilterDialog
        v-model="mainFilterDialog"
        :filterOnly="true"
        :all_cars="all_cars"
        :config="{
          topSpeed: false,
          acel: false,
          hand: false,
          weight: false,
          brake: false,
          tcs: false,
          abs: false
        }"
        @clearFilterUpdate="updateFilterMain($event)"
      />

      <!-- filter for events (multiple) -->
      <BaseFilterDialog
        v-model="eventRequirementsDialog"
        :filterOnly="true"
        :requirementFilter="true"
        :raceFilter="eventFilter.filter"
        :raceFilter2="eventFilter.filter2"
        :raceFilter3="eventFilter.filter3"
        :all_cars="all_cars"
        :config="{
          topSpeed: false,
          acel: false,
          hand: false,
          weight: false,
          brake: false,
          tcs: false,
          abs: false
        }"
        :initialFilterString="null"
        :initialFilterString2="null"
        :initialFilterString3="null"
        :useWhatFilter="eventGlobalUseWhatFilter"
        type="event"
        @filterUpdate="eventUpdateRequirements($event, eventGlobalUseWhatFilter)"
        @clearFilterUpdate="eventClearFilterUpdate($event, eventGlobalUseWhatFilter)"
        @dual="eventFilterAddDual()"
        @useFilter="eventGlobalUseWhatFilter = $event"
      />

      <BaseSearchTrackDialog
        :active="customTrackDialog"
        :mode="'other'"
        @close="closeDialogTrackSearch()"
        @toggleTrack="toggleTrack($event.track, $event.e)"
      />

    </template>

  </div>
</template>

<script>
import all_cars from '../database/cars_final.json'
import BaseCard from './BaseCard.vue'
import BaseText from './BaseText.vue'
import BaseDialog from './BaseDialog.vue'
import BaseChip from './BaseChip.vue'
import BaseFilterDescription from './BaseFilterDescription.vue'
import BaseFilterDialog from './BaseFilterDialog.vue'
import BaseDatePicker from './BaseDatePicker.vue'
import BaseEventTrackbox from './BaseEventTrackbox.vue'
import BaseSearchTrackDialog from './BaseSearchTrackDialog.vue'
import BaseGameTag from './BaseGameTag.vue'
import tracksRepo from '../database/tracks_repo.json'

export default {
  name: 'MainTimeline',
  components: {
    BaseCard,
    BaseText,
    BaseFilterDescription,
    BaseDialog,
    BaseChip,
    BaseFilterDialog,
    BaseDatePicker,
    BaseEventTrackbox,
    BaseSearchTrackDialog,
    BaseGameTag
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      all_cars,
      user: null,
      unsubscribe: null,
      loading: false,
      newLoading: false,
      timeline: [],
      resolvedRids: {},
      lastestList: [],
      highlightsUsers: {},
      lastestLoading: false,
      detailDialog: false,
      detailObj: {},
      screen: "normal",
      animation: false,
      newTools: false,
      searchCarDialog: false,
      ti: {},
      newLinkNameModel: "",
      newLinkUrlModel: "",
      imageUploadDialog: false,
      imageUploadModel: null,
      imageUploadLoading: false,
      imageUploadStatus: "",
      types: [
        "Tri-Series",
        "Collection Series",
        "Veteran Challenge",
        "GT Series",
        "Extraordinary Event",
        "Extraordinary Challenge",
        "Game Update",
        "Game News",
        "Community News",
        "Offers",
        "Other",
      ],
      typesDialog: false,
      mainFilter: {},
      mainFilterDescResolved: [],
      mainFilterDialog: false,
      addCarSelectorIndex: -1,
      eventRequirementsDialog: false,
      evIx: -1,
      eventGlobalUseWhatFilter: 0,
      eventTracksetSelected: 0,
      eventRaceSelected: 0,
      customTrackDialog: false,
      tracksRepo,
      deleteEventIndex: -1,
      cancelCreate: false,
      changeTypeValueConfirm: null,
      deleteLinkIndex: -1,
      linkSelectedIndex: -1,
      linkLoadingIndex: -1,
      tuneDialogCar: {},
      tuneDialogActive: false,
      lastRidClick: null,
      imageDialog: false,
      imageDialogUrl: "",
      colors: [
        "118, 242, 115",
        "28, 204, 255",
        "255, 246, 43",
        "255, 53, 56",
        "140, 92, 255",
        "255, 175, 23",
        "224, 60, 211",
        "0, 45, 255"
      ],
      confirmDelete: {
        dialog: false,
        msg: "Confirm delete?",
        actionLabel: "Delete",
        action: null,
        loading: false,
        classe: ""
      },
      searchParams: {},
      filterBySpecDialog: false,
      filterByRequirementsDialog: false,
      filterByCarFilter: {},
      eventToCopy: null,
      searchParamsEmptyString: "",
      filterDayDialog: false,
      filterTempString: "",
      showNextPage: false,
      searchPage: 0,
      pageSize: 200
    }
  },
  watch: {
    screen: function() {
      if (this.screen === "new") {
        window.onbeforeunload = function(){
          return 'Are you sure you want to leave?';
        };
        this.$store.commit('BEFOREUNLOAD_TOUCH');
      } else {
        window.onbeforeunload = null;
        this.$store.commit('BEFOREUNLOAD_TOUCH');
      }
    },
  },
  beforeMount() {
    this.resetFilter();
    this.searchParamsEmptyString = JSON.stringify(this.searchParams);
    this.searchTimeline();
    this.getLastest();
    // setTimeout(() => {}, 1000);
    this.user = this.$store.state.user;
  },
  mounted() {
    let vm = this;
    vm.unsubscribe = vm.$store.subscribe(mutation => {

      if (mutation.type == "CHANGE_USER") {
        vm.user = mutation.payload.user;
      }

      if (mutation.type == "LOGOUT") {
        vm.user = null;
      }

    })

    if (this.$route.params && this.$route.params.event) {
      this.eventToCopy = JSON.parse(JSON.stringify(this.$route.params.event));
    }
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    eventFilter() {
      if (this.evIx === -1) return {
        filter: {},
        filter2: {},
        filter3: {},
      }
      return {
        filter: this.ti.events[this.evIx].filter,
        filter2: this.ti.events[this.evIx].filter2,
        filter3: this.ti.events[this.evIx].filter3,
      }
    },
    readyToSave() {
      if (!this.ti.type) return false;
      if (!this.ti.name) return false;
      if (!this.ti.dayStart) return false;
      if (
          this.ti.type === "Tri-Series" ||
          this.ti.type === "Collection Series" ||
          this.ti.type === "Veteran Challenge" ||
          this.ti.type === "GT Series"
        ) {
          if (this.ti.p_rid.length === 0) return false;
      }
      if (this.ti.p_rid.length !== 1) {
        if (!this.ti.color) {
          if (this.ti.type !== "Veteran Challenge" &&
            this.ti.type !== "Game News" &&
            this.ti.type !== "Community News" &&
            this.ti.type !== "Offers"
          ) {
            return false;
          }
        };
      }
      return true;
    }
  },
  methods: {
    resetTi() {
      this.ti = {
        name: "",
        type: "",
        sort: "",
        links: [],
        p_rid: [],
        events: [],
        dayStart: "",
        dayEnd: "",
        filter: {},
        description: "",
        color: ""
      }
      this.addCarSelectorIndex = -1;
      this.evIx = -1;
      this.eventGlobalUseWhatFilter = 0;
      this.eventTracksetSelected = 0;
      this.eventRaceSelected = 0;
      this.deleteEventIndex = -1;
      this.deleteLinkIndex = -1;
      this.linkSelectedIndex = -1;
      this.linkLoadingIndex = -1;
    },
    resetFilter() {
      this.searchParams = {
        filter: {},
        requirements: {},
        input: "",
        dayStart: "",
        dayEnd: "",
        types: [],
        rids: []
      };
    },
    getNewEvent() {
      return {
        name: "",
        filter: {},
        eventUseWhatFilter: 0,
        rids: [],
        trackset: [],
        rqLimit: 500
      }
    },
    getNewLink() {
      return {
        text: "",
        url: ""
      }
    },
    previousPage() {
      this.searchPage--;
      this.searchTimeline(false, true);
    },
    nextPage() {
      this.searchPage++;
      this.searchTimeline(true, true);
    },
    searchTimeline(isNextPage, keepPage) {
      this.loading = true;
      if (!keepPage) this.searchPage = 0;

      axios.post(Vue.preUrlCharlie + "/searchTimeline", {
        ...this.searchParams,
        page: this.searchPage
      })
      .then(res => {
        this.loading = false;
        this.showNextPage = false;
        if (res.data.length > 0 || this.searchPage === 0) {
          if (isNextPage) {
            window.scrollTo({ top: ((document.querySelector(".MainTimeline_Body") || {}).offsetTop || 0) - 20, behavior: "smooth" });
          }
          if (res.data.length === this.pageSize) this.showNextPage = true;
          this.timeline = this.resolveNewEntrys(res.data);
        }
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
    updateBackendTimeline(sort, isDelete) {
      this.loading = true;

      axios.post(Vue.preUrlCharlie + "/updateBackendTimeline", {
        sort: sort,
        isDelete: isDelete
      })
      .then(res => {
        this.searchTimeline();
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
    resolveNewEntrys(items) {
      let result = [];
      items.map(item => {
        if (Array.isArray(item.p_rid)) {
          item.p_rid.map(rid => {
            this.resolveRid(rid);
          })
        }
      })
      return items;
    },
    resolveRid(rid) {
      if (!this.resolvedRids[rid]) {
        let newCar = this.all_cars.find(x => x.rid === rid);
        if (newCar) {
          newCar = JSON.parse(JSON.stringify(newCar));
          newCar.color = Vue.resolveClass(newCar.rq, newCar.class, "color");
          newCar.colorRgb = Vue.resolveClass(newCar.rq, newCar.class, "color", true);
          newCar.photo = this.cgResolvePhotoUrl(newCar);
          this.resolvedRids[rid] = newCar;
        }
      }
    },
    cgResolvePhotoUrl(car) {
      try {
        if (car.photoId) return require('@/incoming_pics/' + decodeURI(car.photoId) + '.jpg')
        else return require('@/imgs_final/' + decodeURI(car.rid) + '.jpg')
      } catch (error) {
        return ''
      }
    },
    openDetailDialog(item, index) {
      this.detailDialog = true;
      this.detailObj = item;

      // this.$store.commit("START_LOGROCKET", {});

      if (this.detailObj.events && this.detailObj.events.length > 0) {
        this.detailObj.events.map((event, iEvent) => {
          Vue.set(event, "eventUseWhatFilter", 0);
          if (event.rids && event.rids.length > 0) {
            event.rids.map(rid => {
              this.resolveRid(rid);
            })
          }
          if (event.trackset && event.trackset.length > 0) {
            this.eventResolveTracksetEventParam(event);
          }
        })
      }


      console.log(this.detailObj)
    },
    askDeleteItem(item) {
      let vm = this;

      let action = function() {
        vm.saveTimelineItem(item, true);
      }

      this.confirmDelete = {
        dialog: true,
        msg: `Delete item '${item.name}'?`,
        actionLabel: `Delete`,
        action: action,
        loading: false,
        classe: `D_ButtonRed`
      }
    },
    editItem(item) {
      this.detailDialog = false;
      this.resetTi();
      this.ti = {
        ...this.ti,
        ...JSON.parse(JSON.stringify(item))
      }
      window.scrollTo({ top: 0 });
      this.newTools = true;
      this.animation = true;
      this.screen = '_';
      this.$nextTick().then(() => {
        this.screen = 'new';
      })
    },
    openCreateEvent(e) {
      this.resetTi();
      this.newTools = true;
      this.animation = true;
      this.screen = '_';
      this.$nextTick().then(() => {
        this.screen = 'new';
      })
    },
    cancelCreateEvent() {
      if (this.cancelCreate) {
        this.cancelCreate = false;
        // confirm
        this.closeCreateEvent();
      } else {
        this.cancelCreate = true;
        setTimeout(() => {
          this.cancelCreate = false;
        }, 1000);
      }
    },
    closeCreateEvent() {
      this.screen = '_';
      this.resetTi();
      this.$nextTick().then(() => {
        this.screen = 'normal';
      })
    },
    changeType(item) {
      if (this.ti.type === item) return;

      if (this.changeTypeValueConfirm === item || !this.ti.type) {
        this.changeTypeValueConfirm = null;
        // confirm
        this.resetTi();
        this.ti.type = item;
        if (this.ti.type === "Veteran Challenge") {
          this.addCarNew({ rid: `Porsche_935_'Moby_Dick'_1978` })
          this.ti.name = 'Veteran Challenge: ';
        }
      } else {
        this.changeTypeValueConfirm = item;
        setTimeout(() => {
          this.changeTypeValueConfirm = null;
        }, 1000);
      }

      
    },
    addCarNew(newCar) {
      if (this.addCarSelectorIndex === -2) {
        // main filter
        if (!this.searchParams.rids) {
          Vue.set(this.searchParams, "rids", [newCar.rid]);
        }
        else {
          if (this.searchParams.rids.includes(newCar.rid)) {
            this.searchParams.rids = this.searchParams.rids.filter(x => x !== newCar.rid);
          } else {
            this.searchParams.rids.push(newCar.rid);
          }
        }
        console.log(this.searchParams.rids);
        return;
      }
      let ridArray = this.ti.p_rid;
      if (this.addCarSelectorIndex > -1) ridArray = this.ti.events[this.addCarSelectorIndex].rids;
      
      let found = ridArray.find(x => x === newCar.rid);
      if (found) return;

      ridArray.push(newCar.rid);

      let preCar = this.all_cars.find(x => x.rid === newCar.rid);
      if (preCar) {
        preCar = JSON.parse(JSON.stringify(preCar));
        preCar.color = Vue.resolveClass(preCar.rq, preCar.class, "color");
        preCar.colorRgb = Vue.resolveClass(preCar.rq, preCar.class, "color", true);
        preCar.count = 1;
        preCar.photo = this.cgResolvePhotoUrl(preCar);
        this.resolvedRids[newCar.rid] = preCar;
      }
      if (this.addCarSelectorIndex > -1) return;

      if (this.ti.type === 'Veteran Challenge' && ridArray.length >= 3) {
        this.searchCarDialog = false;
      }
      if ((this.ti.type === 'Tri-Series' || this.ti.type === 'GT Series') && ridArray.length >= 1) {
        this.searchCarDialog = false;
        this.ti.name = preCar.name;
      }


    },
    pushNewEvent(isPaste) {
      let one = this.getNewEvent();
      if (this.ti.type === "Tri-Series") {
        one.name = this.ti.name;
        if (this.ti.events.length === 0) one.name += " Finals";
        if (this.ti.events.length === 1) one.name += " Prelims";
        if (this.ti.events.length === 2) one.name += " Quals";
      }
      if (isPaste && this.eventToCopy) {
        one.name = this.eventToCopy.name;
        one.resolvedTrackset = this.eventToCopy.resolvedTrackset;
        one.trackset = this.eventToCopy.trackset;
        one.rqLimit = this.eventToCopy.rqLimit;
        one.filter = this.eventToCopy.filter;
        if (this.eventToCopy.filter2) one.filter2 = this.eventToCopy.filter2;
        if (this.eventToCopy.filter3) one.filter3 = this.eventToCopy.filter3;
      }
      this.ti.events.push(one);
    },
    openMainFitlerDialog() {
      this.mainFilterDialog = true;
    },
    updateFilterMain(filter) {
      this.ti.filter = filter;

      this.mainFilterDialog = false;
    },
    carListMainDeleteClick(rid, type, iEvent) {
      if (this.lastRidClick === rid) {
        this.lastRidClick = null;
        // confirm
        if (type === 'main') this.ti.p_rid = this.ti.p_rid.filter(x => x !== rid);
        if (type === 'event') this.ti.events[iEvent].rids = this.ti.events[iEvent].rids.filter(x => x !== rid);
      } else {
        this.lastRidClick = rid;
        setTimeout(() => {
          this.lastRidClick = null;
        }, 1000);
      }
      
    },
    prepareAddCarDialog(index) {
      this.addCarSelectorIndex = index;
      if (index === -2) this.filterTempString = JSON.stringify(this.searchParams);
      this.searchCarDialog = true;
    },
    onCloseSearchCarDialog() {
      if (this.addCarSelectorIndex === -2) {
        if (this.filterTempString !== JSON.stringify(this.searchParams)) {
          this.searchTimeline();
        }
      }
    },
    openEventRequirementsDialog(iEvent, whatFilter) {
      this.evIx = iEvent;
      this.eventRequirementsDialog = true;
      this.eventGlobalUseWhatFilter = whatFilter;
    },
    eventUpdateRequirements(filter, filterNumber = 0) {
      return;

      let filterAtr = 'filter';
      if (filterNumber) filterAtr = filterAtr + (filterNumber+1);
      this.ti.events[this.evIx][filterAtr] = filter;
      this.eventRequirementsDialog = false;
    },
    eventClearFilterUpdate(clearedFilter, filterNumber = 0) {
      let filterAtr = 'filter';
      if (filterNumber) filterAtr = filterAtr + (filterNumber+1);
      this.ti.events[this.evIx][filterAtr] = clearedFilter;
      this.eventRequirementsDialog = false;
      // let key = 'eventFilterToSave';
      // if (filterNumber) key = key + (filterNumber+1);
      // this.ti.events[this.evIx][key] = clearedFilter;
    },
    eventFilterAddDual() {
      if (!this.ti.events[this.evIx].filter2) {
        Vue.set(this.ti.events[this.evIx], "filter2", {});
        return
      }
      if (!this.ti.events[this.evIx].filter3) {
        Vue.set(this.ti.events[this.evIx], "filter3", {});
        return
      }
    },
    eventRenameFilter(event, iEvent) {
      let n = event.n;
      Vue.set(this.ti.events[iEvent][`filter${n+1 > 1 ? n+1 : ''}`], "name", event.newName);

      // let currentClearedFilter = this.eventRetrieveCurrentClearedFilter(n);
      // Vue.set(currentClearedFilter, "name", event.newName);
    },
    eventRetrieveCurrentClearedFilter(filterNumber) {
      // TODO: Só funciona se tiver filtro a ser salvo
      // let key = this.isEvents ? 'eventFilterToSave' : 'clubCurrentFilterToSave';
      // if (filterNumber) key = key + (filterNumber+1);
      let filterAtr = 'filter';
      if (filterNumber) filterAtr = filterAtr + (filterNumber+1);
      return this.ti.events[this.evIx][filterAtr];
    },
    eventAddTrackset() {
      this.ti.events[this.evIx].trackset.push([null,null,null,null,null]);
      this.eventResolveTrackset();
    },
    eventResolveTrackset() {
      let resolvedTrackset = JSON.parse(JSON.stringify(this.ti.events[this.evIx].trackset));

      resolvedTrackset = resolvedTrackset.map(trackset => {
        return trackset.map(track => {
          if (track === null) return null;
          return this.resolveTrack({ track }, false, false);
        })
      })
      Vue.set(this.ti.events[this.evIx], "resolvedTrackset", resolvedTrackset);
    },
    eventResolveTracksetEventParam(event, iEvent) {
      let resolvedTrackset = JSON.parse(JSON.stringify(event.trackset));

      resolvedTrackset = resolvedTrackset.map(trackset => {
        return trackset.map(track => {
          if (track === null) return null;
          return this.resolveTrack({ track }, false, false);
        })
      })
      Vue.set(event, "resolvedTrackset", resolvedTrackset);
    },
    resolveTrack(race, calcResult = true, isRace = true) {
      if (race.track) {
        return this.validateTracks([race.track]);
      }
    },
    validateTracks(tracks, group = false) {
      let tracksClear = [];

      tracks.map(x => {
        this.tracksRepo.find(circuit => {
          return circuit.types.find(type => {
            if (x === `${circuit.id}_a${type}`) {
              if (group && circuit.group) {
                groupName = circuit.group;
                groupType = type;
              } else {
                tracksClear.push( { name: circuit.name, id: circuit.id, surface: type[0], cond: type[1], code: `${circuit.id}_a${type}` } );
              }
              return true;
            }
          })
        })
      })
      return tracksClear;
    },
    eventTrackNewIndex(obj) {
      obj.current;
      obj.new;
      let trackset = this.ti.events[this.evIx].trackset[obj.itrackset];

      while (obj.current < 0)
      {
          obj.current += trackset.length;
      }
      while (obj.new < 0)
      {
          obj.new = 0;
      }
      if (obj.new > trackset.length)
      {
          obj.new = trackset.length;
      }
      trackset.splice(obj.new, 0, trackset.splice(obj.current, 1)[0]);

      this.eventResolveTrackset();
    },
    eventMoveTrackRight(itrackset, itrackMonoArray) {
      let trackRightToLeft = this.ti.events[this.evIx].trackset[itrackset][itrackMonoArray+1]

      Vue.set(this.ti.events[this.evIx].trackset[itrackset], [itrackMonoArray+1], this.ti.events[this.evIx].trackset[itrackset][itrackMonoArray]);
      Vue.set(this.ti.events[this.evIx].trackset[itrackset], [itrackMonoArray], trackRightToLeft);

      this.eventResolveTrackset();
    },
    eventMoveTrackset(direction = "up", itrackset) {
      let key = this.isEvents ? 'event' : 'clubTracksGroupModel';
      var toIndex = 0;
      if (direction === "up") {
        if (itrackset === 0) return;
        toIndex = itrackset - 1;
      }
      if (direction === "down") {
        if (itrackset === this.ti.events[this.evIx].trackset.length - 1) return;
        toIndex = itrackset + 1;
      }
      var element = this.ti.events[this.evIx].trackset[itrackset];
      this.ti.events[this.evIx].trackset.splice(itrackset, 1);
      this.ti.events[this.evIx].trackset.splice(toIndex, 0, element);

      this.eventResolveTrackset();
    },
    eventDeleteTrackset(itrackset) {
      this.ti.events[this.evIx].trackset = this.ti.events[this.evIx].trackset.filter((x, ix) => ix !== itrackset);

      this.eventResolveTrackset();
    },
    openDialogTrackSearch(backToOptions = true, type) {
      this.customTrackDialog = true;
      setTimeout(() => {
        try {
          document.querySelector("#SearchTrackInput").focus();  
        } catch (error) {}
      }, 10);
    },
    closeDialogTrackSearch() {
      this.customTrackDialog = false;
    },
    toggleTrack(track, e = {}) {
      Vue.set(this.ti.events[this.evIx].trackset[this.eventTracksetSelected], this.eventRaceSelected, track);
      this.eventResolveTrackset()
      this.closeDialogTrackSearch();
    },
    deleteEventClick(iEvent) {
      this.evIx = -1;
      if (this.deleteEventIndex === iEvent) {
        this.deleteEventIndex = -1;
        // delete
        this.ti.events = this.ti.events.filter((x, ix) => ix !== iEvent);
      } else {
        this.deleteEventIndex = iEvent;
        setTimeout(() => {
          this.deleteEventIndex = -1;
        }, 1000);
      }
    },
    moveEventUp(iEvent) {
      this.evIx = -1;
      let element = this.ti.events[iEvent];
      this.ti.events.splice(iEvent, 1);
      this.ti.events.splice(iEvent-1, 0, element);
    },
    deleteLinkClick(iLink) {
      if (this.deleteLinkIndex === iLink) {
        this.deleteLinkIndex = -1;
        // delete
        if (this.ti.links[iLink].url && this.ti.links[iLink].url.includes('tdrimages.s3')) {
          // delete from s3?
        }
        this.ti.links = this.ti.links.filter((x, ix) => ix !== iLink);
      } else {
        this.deleteLinkIndex = iLink;
        setTimeout(() => {
          this.deleteLinkIndex = -1;
        }, 1000);
      }
    },
    async pasteLink(iLink) {
      
      const text = await navigator.clipboard.readText();
      const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
      const regex = new RegExp(expression);

      if (text.match(regex)) {
        this.ti.links[iLink].url = text;
      }

    },
    interceptLinkPaste(clipboardEvent, iLink) {
      if (this.ti.links[iLink].url) return; // can't be filled
      if (!clipboardEvent.clipboardData.files.length) {
        return;
      }
      this.linkSelectedIndex = iLink;

      console.log("size before:", clipboardEvent.clipboardData.files[0].size);

      this.convertToJPG(clipboardEvent.clipboardData.files[0]);

      

      // this.finishUploadImage(null, clipboardEvent);
    },
    convertToJPG(imageFile) {
      let vm = this;
      var img = new Image;
      img.onload = (e, b, t) => {

        URL.revokeObjectURL(e.target.src);             // free up memory
        var c = document.createElement("canvas")  // create a temp. canvas
        var ctx = c.getContext("2d");

        let W = e.target.width;
        let H = e.target.height;
        console.log("Image size", e.target.width, e.target.height);

        if (W > 2000) {
          H = Math.round(H * (2000 / W));
          W = 2000;
          console.log("New size", W, H);
        }
        if (H > 2000) {
          W = Math.round(W * (2000 / H));
          H = 2000;
          console.log("New size", W, H);
        }

        c.width = W;                      // set size = image, draw
        c.height = H;
        ctx.fillStyle = '#292929';
        
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(e.target, 0, 0, W, H);

        // convert to File object, NOTE: we're using binary mime-type for the final Blob/File
        c.toBlob(function(blob) {
          var file = new File([blob], "(to upload)", {type: "image/jpeg"});

          vm.finishUploadImage(null, null, file);

        }, "image/jpeg", 0.85);  // mime=JPEG, quality=0.75

      };
      img.src = URL.createObjectURL(imageFile);
    },
    initUploadImage(iLink) {
      this.linkSelectedIndex = iLink;
      let input = document.createElement('input');
      input.setAttribute("type", "file")
      input.setAttribute("accept", "image/png, image/gif, image/jpeg")
      input.addEventListener('change', this.inputFileToConvert, false)

      input.click();
    },
    inputFileToConvert(event) {
      console.log("size before:", event.target.files[0].size);
      this.convertToJPG(event.target.files[0]);
    },
    finishUploadImage(event, clipboardEvent, directFile) {
      var file;
      if (event) file = event.target.files[0];
      if (clipboardEvent) file = clipboardEvent.clipboardData.files[0];
      if (directFile) file = directFile;
      if (!file) return

      console.log("size after:", file.size / 1000000, "MB");

      if (file.size > 1 * 1000 * 1000) { // 1mb
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: "File larger than 1 MB",
          type: "error"
        });
        return;
      }
      const type = file.type;
      const localUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        Vue.set(this.ti.links[this.linkSelectedIndex], "fileToUpload", e.target.result);
      };



      Vue.set(this.ti.links[this.linkSelectedIndex], "url", file.name);
      Vue.set(this.ti.links[this.linkSelectedIndex], "localUrl", localUrl);
      // Vue.set(this.ti.links[this.linkSelectedIndex], "fileType", type);

      // this.linkLoadingIndex = this.linkSelectedIndex;
    },
    setLinkAsCover(iLink) {
      this.ti.links.map((link, index) => {
        if (index === iLink) {
          if (this.ti.links[index].cover) {
            Vue.set(this.ti.links[index], "cover", false);
            delete this.ti.links[index].cover;
          } else {
            Vue.set(this.ti.links[index], "cover", true);
          }
        }
        else {
          Vue.set(this.ti.links[index], "cover", false);
          delete this.ti.links[index].cover;
        }
      })

    },
    saveTimelineItem(item, isDelete) {
      let params
      if (item) {
        params = item;
        if (isDelete) {
          params.isDelete = true;
        }
      } else {
        params = this.ti;
      }

      this.newLoading = true;

      axios.post(Vue.preUrl + "/updateTimeline", params)
      .then(res => {
        this.newLoading = false;
        this.confirmDelete.dialog = false;
        this.detailDialog = false;
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          correct: true,
          text: this.$t('m_saveSuccess')
        });

        window.scrollTo({ top: ((document.querySelector(".MainTimeline_Body") || {}).offsetTop || 0) - 20, behavior: "smooth" });

        if (!isDelete) {
          let dayStart = new Date(`${params.dayStart}T00:00:00`);
          let dayEnd = new Date(`${params.dayStart}T01:00:00`);
          dayStart.setDate(dayStart.getDate() - 4);
          dayEnd.setDate(dayEnd.getDate() + 4);
          this.searchParams.dayStart = dayStart.toISOString().slice(0,10);
          this.searchParams.dayEnd = dayEnd.toISOString().slice(0,10);
        }

        this.updateBackendTimeline(res.data, isDelete);
        this.closeCreateEvent();

      })
      .catch(error => {
        this.newLoading = false;
        console.log(error);
        this.$store.commit("DEFINE_SNACK", {
          active: true,
          error: true,
          text: error,
          type: "error"
        });
      })
    },
    openDetailCarDialog(rid) {
      this.tuneDialogCar = JSON.parse(JSON.stringify(this.resolvedRids[rid]));
      this.tuneDialogCar.selectedTune = '000';
      this.tuneDialogActive = true;
    },
    closeTune() {
      this.tuneDialogActive = false;
    },
    resolveStat(car, type, customData = null) {
      return Vue.resolveStat(car, type, customData);
    },
    getLastest() {
      this.lastestLoading = true;

      // lastest cars
      axios.get(Vue.preUrl + "/lastest")
      .then(res => {
        this.lastestLoading = false;

        this.highlightsUsers = Vue.resolveHighlightsUsers(res.data);

        let incomingCars = res.data.find(x => x.id === 'newCars').value;
        if (incomingCars && incomingCars.length > 0) {
          let rids = this.all_cars.map(x => x.rid);

          incomingCars.map(car => {
            if (!!(car.photoId && car.rq && car.onlyName && car.brand && car.country && car.year && car.clearance && car.topSpeed && car.hand && car.drive && car.tyres && car.weight && car.tags && car.bodyTypes && car.fuel && car.seats && car.engine)) {
              if (!rids.includes(car.rid)) {
                this.all_cars.push(car);
              }
            }
          })
          
          this.all_cars.sort((a,b) => {
            return b.rq - a.rq;
          })
        }

        let mraData = res.data.find(x => x.id === 'mra').value;
        this.all_cars.map(x => {
          Vue.set(x, "mra", mraData[x.rid] || x.mra);
        })


      })
      .catch(error => {
        this.lastestLoading = false;
        console.log(error);
      });

    },
    openPicture(link) {
      this.imageDialog = true;
      this.imageDialogUrl = link.url;
    },
    afterLoadImg(e, isSquare = false) {
      let factor = isSquare ? 1 : 1.71;
      if (e.target.naturalWidth / e.target.naturalHeight > factor) {
        e.target.classList.add("MainTimeline_Img_Landscape");
      } else {
        e.target.classList.remove("MainTimeline_Img_Landscape");
      }
    },
    clearAllTimelineFilters() {
      this.resetFilter();
      this.searchTimeline();
    },
    openFilterBySpec() {
      this.filterTempString = JSON.stringify(this.searchParams);
      this.filterBySpecDialog = true;
    },
    updateFilterBySpec(filter) {
      // this.filterByCarFilter = filter;
      this.filterBySpecDialog = false;
      this.searchParams.filter = filter;
      if (this.filterTempString !== JSON.stringify(this.searchParams)) {
        this.searchTimeline();
      }
    },
    openFilterByRequirements() {
      this.filterTempString = JSON.stringify(this.searchParams);
      this.filterByRequirementsDialog = true;
    },
    updateFilterByRequirements(requirements) {
      // this.filterByCarFilter = filter;
      this.filterByRequirementsDialog = false;
      this.searchParams.requirements = requirements;
      if (this.filterTempString !== JSON.stringify(this.searchParams)) {
        this.searchTimeline();
      }
    },
    openTypeMainFilter() {
      this.filterTempString = JSON.stringify(this.searchParams);
      this.typesDialog = true;
    },
    closeTypeMainFilter() {
      this.typesDialog = false;
      if (this.filterTempString !== JSON.stringify(this.searchParams)) {
        this.searchTimeline();
      }
    },
    searchByText() {
      this.searchTimeline();
    },
    openFilterDayDialog() {
      this.filterTempString = JSON.stringify(this.searchParams);
      this.filterDayDialog = true;
    },
    closeFilterDayDialog() {
      this.filterDayDialog = false;
      if (!this.searchParams.dayStart) this.searchParams.dayEnd = "";
      if (this.filterTempString !== JSON.stringify(this.searchParams)) {
        this.searchTimeline();
      }
    },
    clearDateOnly() {
      this.searchParams.dayStart = "";
      this.searchParams.dayEnd = "";
      this.closeFilterDayDialog();
    }
  },
}
</script>

<style>
.MainTimeline_Layout,
.MainTimeline_Create_Layout {
  margin: 40px auto 0px auto;
  padding-bottom: 170px;
}
.MainTimeline_Header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}
.MainTimeline_HeaderTop {
  display: flex;
  gap: 6px;
  position: relative;
}
.MainTimeline_HeaderMagnifierButtonBox {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  width: 44px;
}
.MainTimeline_HeaderMagnifierButton {
  font-size: 22px;
  width: 100%;
}
.MainTimeline_HeaderBottomGroup {
  display: flex;
  gap: 5px;
  justify-content: space-between;
  align-items: flex-start;
}
.MainTimeline_HeaderBottom {
  display: flex;
  justify-content: flex-start;
  gap: 6px;
  flex-wrap: wrap;
}
.MainTimeline_HeaderTopMod {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}
.MainTimeline_Body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.MainTimeline_InitAnimation {
  animation: screen_anim 0.2s linear forwards;
  animation-timing-function: cubic-bezier(0, 0.46, 0.49, 0.99);
}
@keyframes screen_anim {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
.MainTimeline_W800 {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.MainTimeline_ItemRoot {
  /* width: calc(47% + 105px); */
  /* max-width: calc(47% + 105px); */
  width: 100%;
  max-width: min(calc(var(--wBody)* 0.5 + 140px), 480px);
  --date-width: 24px;
  --pic-width: 120px;
  position: relative;
  --backlight-opac: 0.12;
}
.MainTimeline_BackLine + .MainTimeline_ItemRoot {
  margin-top: 56px;
}
.MainTimeline_ItemEven {
  /* margin-left: 40%; */
  text-align: left;
  align-self: flex-end;
  display: flex;
  justify-content: flex-start;
}
.MainTimeline_ItemOdd {
  /* margin-right: 40%; */
  text-align: right;
  align-self: flex-start;
  display: flex;
  justify-content: flex-end;
}
.MainTimeline_Item {
  position: relative;
  transition-duration: 0.1s;
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
  text-align: inherit;
  /* width: 100%; */
  --back-opac: 0.05;
}
.MainTimeline_ItemTop {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.MainTimeline_ItemOdd .MainTimeline_ItemTop {
  flex-direction: row-reverse;
}
.MainTimeline_Item:hover,
.MainTimeline_Item.focus-visible,
.MainTimeline_Item:focus-within {
  background-color: rgba(255, 255, 255, 0.04);
}
.MainTimeline_ItemTopLeft {
  text-align: center;
  color: var(--class-color);
  width: var(--date-width);
}
.MainTimeline_ItemTopLeft_Day {
  font-size: 20px;
  line-height: 1;
}
.MainTimeline_ItemTopLeft_Month {
  font-size: 12px;
  text-transform: uppercase;
}
.MainTimeline_ItemCover {
  width: var(--pic-width);
  min-width: var(--pic-width);
  height: 70px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.MainTimeline_DefaultCover {
  width: 100%;
  height: 100%;
  background-color: #bdbdbd;
  display: flex;
  align-items: center;
  justify-content: center;
}
.MainTimeline_ItemCoverIcon {
  font-size: 38px;
  color: #4a4a4a;
}
.MainTimeline_ItemTopRight {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: calc(100% - var(--pic-width) - var(--date-width) - 10px - 10px);
}
.MainTimeline_ItemOdd .MainTimeline_ItemTopRight {
  text-align: right;
  align-items: flex-end;
}
.MainTimeline_ItemTopTitle {
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 19px;
}
.MainTimeline_ItemTopMiniCars {
  display: flex;
  gap: 3px;
  margin-top: 2px;
}
.MainTimeline_ItemTopSubTitle {
  color: var(--class-color);
  opacity: 0.6;
  font-size: 0.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
  /* text-align: left; */
}
.MainTimeline_ItemBacklight {
  top: -62px;
  left: -45px;
  background: radial-gradient(rgba(var(--class-color-rgb), var(--backlight-opac)) 0%, rgba(var(--class-color-rgb), 0) 60%);
  position: absolute;
  pointer-events: none;
  width: 280px;
  height: 210px;
}
.MainTimeline_ItemOdd .MainTimeline_ItemBacklight {
  top: -62px;
  left: unset;
  right: -45px;
}
.MainTimeline_ClassB,
.MainTimeline_ClassA {
  --backlight-opac: 0.18;
}
.MainTimeline_BackLine {
  position: absolute;
  top: 0;
  left: calc(50% - 3px);
  opacity: 0.25;
  height: 100%;
  --stroke: 6px;
  --half: 3px;
  --color: #717171;
}
.MainTimeline_BackLineHead {
  position: absolute;
  top: calc(var(--half) * -1);
  width: 20px;
  height: var(--stroke);
  border-radius: 10px;
  background-color: var(--color);
  transform-origin: var(--half) var(--half);
  transform: rotate(35deg);
}
.MainTimeline_BackLineHead + .MainTimeline_BackLineHead {
  transform: rotate(145deg);
}
.MainTimeline_BackLineBody {
  height: 100%;
  width: var(--stroke);
  background-color: var(--color);
}
.MainTimeline_BackLine + .MainTimeline_Item {
  margin-top: 40px;
}
.MainTimeline_Card_Header2Left {
  display: flex;
  height: 100%;
  width: 100%;
  min-width: 100%;
}
.MainTimeline_Card_Header2Img {
  transform: scale(1.35) translateX(13px);
  height: 100%;
}
.MainTimeline_Card_Header2Right2 {
  color: black;
  background-color: var(--class-color);
  height: 22px;
  width: 19px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 21px;
  border-top-right-radius: 6px;
  padding-top: 1px;
  padding-right: 1px;
  font-size: 12px;
  text-align: center;
}
.MainTimeline_Line1RQ {
  color: var(--class-color);
}
.MainTimeline_Line1Brand {
  color: var(--class-color);
  opacity: 0.6;
}
.MainTimeline_Line2Car {
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}
.MainTimeline_ItemTypeText {
  color: var(--class-color);
  opacity: 0.6;
  font-size: 0.8em;
}
.MainTimeline_MiniCard {
  width: 47px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.MainTimeline_MiniCard_Header2Img {
  transform: scale(1.35) translateX(5px);
  height: 100%;
}
.MainTimeline_MiniCard_Header2Right2 {
  color: black;
  background-color: var(--class-color);
  height: 13px;
  width: 12px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 12px;
  border-top-right-radius: 4px;
  padding-top: 1px;
  padding-right: 1px;
  font-size: 9px;
  text-align: center;
}
.MainTimeline_MiniCardPlus {
  display: flex;
  align-items: center;
}
.MainTimeline_ItemVeteranCriteria {
  color: var(--class-color);
  opacity: 0.6;
  font-size: 0.8em;
}
.MainTimeline_ItemVeteranCriteria .Cg_ReqsTitle {
  display: none;
}
.MainTimeline_ItemVeteranCriteria .BaseFilterDescription_Layout {
  grid-template-columns: min-content min-content;
}
.MainTimeline_ItemVeteranCriteria .BaseFilterDescription_Value {
  white-space: nowrap;
}

.MainTimeline_Loading {
  position: relative;
  margin-top: calc(0px + 20px);
  animation: pulseOpacity 1s infinite ease-in-out;
}
.MainTimeline_LoadingBackLine {
  --color: rgba(165, 165, 165, 1);
}
.MainTimeline_LoadingItem {

}
.MainTimeline_LoadingLeft {
  height: 30px;
  background-color: rgba(165, 165, 165, 1);
}
.MainTimeline_LoadingCover {
  background-color: rgba(165, 165, 165, 1);
}
.MainTimeline_LoadingRight {
  height: 60px;
  background-color: rgba(165, 165, 165, 1);
}

.MainTimeline_Create_Header {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.MainTimeline_Create_Footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.MainTimeline_CarsList {
  max-width: 600px;
  min-height: 60px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  background-color: rgba(0 ,0 ,0 , 0.2);
  padding: 10px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px;
}
.MainTimeline_CarsListEmpty {
  justify-content: center;
  align-items: center;
}
.D_Button.MainTimeline_CarButton {
  padding: 2px;
}
.D_Button.MainTimeline_CarButton:active:not(.D_ButtonNoActive) {
  transform: translateY(0px);
}
.MainTimeline_CarButtonRed {
  filter: sepia(1);
}
.MainTimeline_CarCard {
  position: relative;
}
.MainTimeline_BankPhoto {
  display: flex;
  height: 42px;
  min-width: 53px;
  border-radius: 0 3px 3px 0;
  overflow: hidden;
  background-color: #00000038;
  margin-right: 0;
  width: 85px;
}
.MainTimeline_BankPhotoImg {
  transform: scale(1.2) translateX(7px) translateY(-6px);
  height: 140%;
}
.MainTimeline_RQ {
  display: flex;
  color: #000;
  background-color: var(--color);
  height: 20px;
  justify-content: center;
  width: 19px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 21px;
  border-top-right-radius: 4px;
  padding-right: 1px;
  font-size: 15px;
}
.MainTimeline_SearchCarButton {
  height: 46px;
}
.MainTimeline_Create_Body {

}
.MainTimeline_Create_BaseText {
  width: 100%;
  max-width: 350px;
}
.MainTimeline_Create_W600 {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}
.MainTimeline_FilterDescription {
  background-color: rgba(0, 0, 0, 0.2);
  height: 150px;
  width: 300px;
  padding: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
}
.MainTimeline_Create_EventItem {
  box-shadow: inset 3px 0px 0px 0px hsl( var(--h), var(--s), var(--l) );
  margin-bottom: 25px;
  padding: 0 20px;
}
.MainTimeline_C_0 {
  --h: 82;
  --s: 53%;
  --l: 56%;
}
.MainTimeline_C_1 {
  --h: 0;
  --s: 53%;
  --l: 56%;
}
.MainTimeline_C_2 {
  --h: 162;
  --s: 31%;
  --l: 58%;
}
.MainTimeline_EventNameRQ {
  display: flex;
  gap: 15px;
  justify-content: center;
}
.MainTimeline_EventFilterCarList {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 15px;
}
.MainTimeline_TracksetList .Cg_Box {
  --cg-width: 115px;
}
.MainTimeline_TracksetList .Row_Tracks.Row_Cg .Row_Content {
  white-space: normal;
  font-size: 0.7em;
  line-height: 0.8;
}
.MainTimeline_TracksetList .Cg_SelectTrackButton {
  font-size: 14px;
}
.MainTimeline_Create_EventItem .MainTimeline_FilterDescription {
  width: 100%;
  height: 110px;
}
.MainTimeline_TracksetFooter {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
.MainTimeline_LinkItem {
  display: grid;
  grid-template-columns: 5fr 44px min-content;
  gap: 15px;
  box-shadow: inset 3px 0px 0px 0px hsl( var(--h), var(--s), var(--l) );
  margin-bottom: 25px;
  padding: 0 20px;
  position: relative;
}
.MainTimeline_LinkItem .BaseText_Input {
  margin-top: 0
}
.MainTimeline_LinkImage {
  position: absolute;
  width: 200px;
  height: 100%;
  top: 0;
  left: -200px;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
}
.MainTimeline_LinkImageImg {
  height: 100%;
  border-radius: 5px;
}
.MainTimeline_LinkImageCover:after {
  content: "Cover";
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #000b;
}
.MainTimeline_DialogSub {
  /* font-size: 0.8em; */
  margin-bottom: 15px;
}
.MainTimeline_DialogTitleDivider {
  font-size: 13px;
  opacity: 0.6;
}
.MainTimeline_DialogMid {
  display: flex;
  gap: 5px 25px;
  flex-wrap: wrap;
  margin-top: var(--margin-top);
}
.MainTimeline_DialogInfoLabel {
  font-size: .8em;
  color: #777;
}
.MainTimeline_DialogInfoValue {
  color: var(--d-text-b);
  word-break: break-word;
  white-space: pre-wrap;
}
.MainTimeline_DialogViewDual {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 0px 15px;
}
.MainTimeline_DialogViewRewardedCars {
  /* background-color: rgba(0, 0, 0, 0.2); */
  /* padding: 3px; */
  max-height: 135px;
  overflow-y: auto;
  margin-top: 15px;
}
.MainTimeline_DialogViewFilterDescription {
  /* background-color: rgba(0, 0, 0, 0.2); */
  max-height: 135px;
  width: 100%;
  /* padding: 3px; */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
}
.MainTimeline_DialogPrizeCars {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px;
}
.MainTimeline_DialogViewFilterDescription:only-child {
  grid-column: span 2;
  height: auto;
}
.MainTimeline_DialogViewRewardedCars:only-child {
  grid-column: span 2;
  height: auto;
  background-color: transparent;
  padding: 0;
  padding-bottom: 3px;
}
.MainTimeline_DialogViewRewardedCars:only-child .MainTimeline_DialogTitleDivider {
  display: none;
}
.MainTimeline_BaseCardBox {
  display: flex;
  justify-content: center;
  margin-top: var(--margin-top);
  align-items: center;
  gap: 15px;
}
.MainTimeline_BaseCardBox:only-child {
  grid-column: span 2;
}
.MainTimeline_BaseCardDiv {
  position: relative;
}
/* .MainTimeline_BaseCardDiv .BaseCard_EffectBackGround {
  --opacity: 0.2;
} */
.MainTimeline_BaseCardSide {
  gap: 5px 15px;
  font-size: 16px;
}

.MainTimeline_Card_VeteranImg {
  width: 100%;
  /* height: 100%; */
  object-fit: cover;
}
.MainTimeline_Img_Landscape {
  width: unset;
  height: 100%;
}
/* .MainTimeline_Card_VeteranImg.MainTimeline_Img_Portrait {
  width: 100%;
} */

.MainTimeline_DialogGalleryLayout {
  margin-top: 15px;
  --img-width: 260px;
  --img-height: 160px;
}
.MainTimeline_DialogGalleryMany {
  --img-width: 126px;
  --img-height: 78px;
}
.MainTimeline_DialogGalleryInner {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.MainTimeline_DialogGalleryItem {
  width: var(--img-width);
  height: var(--img-height);
  overflow: hidden;
  /* flex-grow: 1; */
}
.MainTimeline_DialogGalleryItem:only-child {
  width: 100%;
  height: unset;
}
.MainTimeline_GalleryPictureImg {
  width: 100%;
  object-fit: cover;
  /* height: 100%; */
  /* border-radius: 10px; */
}
.MainTimeline_DialogGalleryItem:hover,
.MainTimeline_DialogGalleryItem.focus-visible {
  box-shadow: 0px 0px 0px 2px rgb(var(--d-text-yellow));
}
.MainTimeline_DialogLinkLayout {
  margin-top: 15px;
}
.MainTimeline_DialogLinkInner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.MainTimeline_DialogLinkAlone {
  grid-template-columns: 1fr;
}
.MainTimeline_DialogLinkItem {
  display: flex;
  flex-direction: column;
}
.MainTimeline_DialogLinkButton {
  min-width: 150px;
}
.MainTimeline_DialogLinkButton > span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
  word-break: break-word;
}
.MainTimeline_DialogLinkSub {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2; 
  -webkit-box-orient: vertical;
  word-break: break-word;
}
.MainTimeline_DialogImageLayout {
  display: flex;
  justify-content: center;
  align-items: center;
}
.MainTimeline_DialogImageLayoutImg {
  max-height: calc(90vh - 50px);
  max-width: 80vw;
}

.MainTimeline_ColorPicker {

}
.MainTimeline_ColorChip {
  background-color: rgba(var(--color), 0.9);
  border-radius: 20px;
  height: 26px;
  z-index: 2;
  --d-text-yellow: var(--color);
}
.MainTimeline_ColorChip.D_ButtonActive:not(p) {
  box-shadow: 0px 0px 0px 18px rgba(var(--color), 0.2);
  border-radius: 20px;
  z-index: 1;
}
.MainTimeline_ColorChip.D_ButtonActive:hover {
  background-color: rgb(var(--color));
}
.MainTimeline_ColorChip:active:not(.D_ButtonActive) {
  background-color: rgba(var(--color), 0.6);
}
.MainTimeline_TypeVeteranChallenge {
  --class-color-rgb: 238, 88, 112;
}
.MainTimeline_TypeGameNews,
.MainTimeline_TypeCommunityNews {
  --class-color-rgb: 54 ,171, 245;
}
.MainTimeline_TypeOffers {
  --class-color-rgb: 140, 0, 0;
}
.MainTimeline_EventsItemMid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 0px 15px;
}
.MainTimeline_EventsItemName {
  color: rgb(var(--d-text-yellow));
  font-size: 1.2em;
}
.MainTimeline_EventsItemTop {
  margin-bottom: calc(var(--margin-top) * -1);
  margin-top: calc(var(--margin-top) + 2px);
  padding: 3px 0px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--d-text-yellow));
  background-color: #a9904129;
  font-size: 12px;
}
.MainTimeline_EventsItemRQ {
  font-size: 0.7em;
}
.MainTimeline_EventsItemBottom {
  --cell-height: 28px;
}
.MainTimeline_EventsItemBottom .Cg_Track {
  padding-top: 0px;
}
.MainTimeline_EventsItemBottom .Row_Conditions {
  font-size: 6px;
}
.MainTimeline_EventsItemBottom .BaseIconSvg_Layout svg {
  width: 18px;
}
.MainTimeline_EventsItemBottom .MainTimeline_TracksetList .Cg_Box {
  --cg-width: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
.MainTimeline_EventsItem + .MainTimeline_EventsItem {
  margin-top: calc(var(--margin-top) + 10px);
}
.MainTimeline_EventsItem .MainTimeline_DialogViewRewardedCars,
.MainTimeline_EventsItem .MainTimeline_DialogViewFilterDescription {
  margin-top: var(--margin-top);
}
.MainTimeline_BaseCardDiv .Row_DialogCardCard {
  width: 261px !important;
  height: 161px !important;
  --card-font-size: 13px;
}
.MainTimeline_DialogTitleDivider2 {
  font-size: 13px;
  opacity: 0.6;
}
.MainTimeline_YearBelow {
  position: absolute;
  bottom: 27px;
  right: min(calc(var(--wBody)* 0.5 + 140px), 480px);
  margin-right: 10px;
}
/* .MainTimeline_YearInvert {
  bottom: unset;
  top: 8px;
} */
.MainTimeline_ItemOdd .MainTimeline_YearBelow {
  right: unset;
  left: min(calc(var(--wBody)* 0.5 + 140px), 480px);
  margin-right: unset;
  margin-left: 10px;
}
.MainTimeline_YearText {
  padding: 6px 16px;
  background-color: #374a21;
  border-radius: 6px;
  position: relative;
  color: rgb(var(--d-text-green));
}
.MainTimeline_YearArrow {
  position: absolute;
  font-size: 30px;
  left: 22px;
  top: -20px;
  color: #405c1f;
}
.MainTimeline_YearInvert .MainTimeline_YearArrow {
  transform: rotate(180deg);
  top: 24px;
}
/* .MainTimeline_Item:not(:last-child) {
  margin-bottom: 70px;
} */
.MainTimeline_ViewLayout {
  --margin-top: 25px;
}
.MainTimeline_NextPageLayout {
  z-index: 1;
}
.MainTimeline_PageButton {
  backdrop-filter: blur(5px);
}
.MainTimeline_HeaderBottom > .D_Button {
  padding: 0 10px;
}
.MainTimeline_EndBall {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  /* background-color: rgb(255, 255, 255, 0.07); */
  /* backdrop-filter: blur(25px); */
  margin-top: 50px;
  background-color: #424242;
}
.MainTimeline_404 {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}




@media only screen and (max-width: 530px) {
  .MainTimeline_BaseCardBox {
    flex-direction: column;
  }
}

</style>