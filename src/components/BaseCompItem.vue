<template>
  <BaseCustomTag
    :tag="isMod ? 'button' : 'div'"
    :class="{ D_Button: isMod }"
    class="BaseCompItem_Layout"
    @click="isMod ? $emit('edit') : ''">
    <div v-if="!empty" class="BaseCompItem_LayoutBox">
      <div v-if="comp.meta && comp.meta[0] === 'Dragster'" class="BaseCompItem_MetaDragster">
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Layer_1" x="0" y="0" style="enable-background:new 0 0 95 58" version="1.1" viewBox="0 0 95 58">
          <path d="M29.1 12.6h11c6.8.1 13.6 4.8 16.5 11.5.2.6.8.9 1.4.9 3.3 0 6.7-.1 11.2-.1h15c-2.4 3.1-4.9 6.3-7.3 9.5H64c-3.9 0-7.2 0-10.4.1-.3 0-.6.1-.9.3-.3.3-.9.7-1.5 1.2-.4.3-.7.6-.9.7-.5.4-.7 1.1-.5 1.7.2.6.8 1 1.4 1h13.1c-1.7 2.2-3.4 4.4-5 6.6-.6.8-1.2 1.6-1.9 2.5H37.8c-7.2 0-14.1-5.1-16.9-12.2-.2-.6-.8-.9-1.4-1h-8c2.2-2.9 4.4-5.8 7-9.1h6.3c.4 0 .7-.1 1-.4l1.4-1.2c.5-.4.6-1.1.4-1.7s-.8-1-1.4-1H9c2.5-3.1 4.8-6.1 7-9.2l13.1-.1zm0-1.5H15.6c-3.1 4.2-6.2 8.5-9.6 12.4 7.3 0 13.2-.1 20.4-.1L25 24.6h-7c-3.1 4-6.3 8-9.3 12.1 2.9 0 5.8-.1 8.7-.1h2.3C22.6 44 29.9 49.7 38 49.8h20.4c3.1-4 6.1-8.1 9.2-12.1H51.4c.5-.4 1.8-1.5 2.4-1.9 3.6-.1 7-.1 10.4-.1 4.5 0 8.9 0 13.6.1 3.2-4.2 6.4-8.4 9.6-12.5H69.3c-3.8 0-7.5 0-11.3.1-3-7-10.1-12.4-17.8-12.4-3.8.1-7.4.1-11.1.1z" style="fill:#ff8a5c"/>
          <path d="M17.6 15.7c5.4 0 7.3-.1 14.4-.1 4.8.1 10-.7 14.4 1.9 4.3 2.2 7.2 6.7 8 11.4H77" style="fill:none;stroke:#ff8a5c;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"/>
          <path d="M36 21.5c-4.6 1.3-7.9 6.5-6.4 11.2.9 3.9 4.6 6.8 8.5 7 5.2.6 10.2-3.6 10.4-8.8.5-6.4-6.5-11.5-12.5-9.4z" style="fill:none;stroke:#ff8a5c;stroke-width:1.5"/>
          <path d="M63.2 42h-8.7M24.6 28.8h-8.7m5.6 3.8h-8.6M60.3 46h-8.7M19 19.4h-8.7" style="fill:none;stroke:#ff8a5c;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"/>
          <path d="M38.4 29.8s-2-.6-2.7-1.9.8-3.4 1.6-4.1c-1.3.3-3.7 1.4-4.7 4.2 1.1 1.9 2.7 4.7 2.7 4.7l.6-2.1 2.7.9s.5 2-.2 3.3-3.4 1.1-4.3.7c1 .9 3.1 2.5 6 1.9 1.1-1.9 2.7-4.7 2.7-4.7l-2.2.6-.6-2.9s1.5-1.4 3-1.4 2.6 2.4 2.7 3.4c.4-1.3.6-4-1.3-6.1H39l1.5 1.6-2.1 1.9z" style="fill:#ff8a5c"/>
        </svg>
      </div>
      <div v-if="comp.meta && comp.meta[0] === 'Speedster'" class="BaseCompItem_MetaSpeedster">
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 95 58" viewBox="0 0 95 58">
          <path d="M47.6 7.3c.4.8.7 1.5 1.1 2.3.2.3.3.7.5 1-.5 1.1-1 2.2-1.6 3.3-.5-1.1-1-2.2-1.6-3.3.6-1 1.1-2.1 1.6-3.3m6.1 5.3c1 .3 2.1.6 3.1.8-.3.2-.6.4-.9.7-.2.1-.3.3-.4.5-.7 1.3-.9 2.7-1.1 4.1-.1 0-.2-.1-.2-.1-.9-.4-1.8-.9-2.7-1.3.8-1.7 1.5-3.2 2.2-4.7m-12 0c.7 1.7 1.4 3.2 2.1 4.6l-.2.1c-.9.4-1.8.9-2.7 1.3-.3-1.3-.5-2.5-.8-3.7-.1-.4-.3-.7-.6-1l-.9-.6c.2 0 .4-.1.6-.1.7-.1 1.6-.3 2.5-.6m-26.2 2c3.8 0 7.6 0 11 .1-.1 4.9 3.1 9.5 8.1 11.5.4 1.2.9 2.4 1.3 3.6-.6 1.3-1.3 2.7-1.9 4v.1c-.9-.2-1.8-.3-2.6-.5.8-1.5 1.7-2.8 2.5-4.1.2-.4.3-.9.2-1.3-.1-.4-.5-.8-.9-.9l-2-.8c-.2-.1-.3-.1-.5-.1-.4 0-.7.1-1 .4-1.6 1.5-3.4 2.9-5 4.3-1 .8-2 1.6-3 2.5-.5-.6-1-1.3-1.5-1.9l1.5-1.2c2.2-1.8 4.5-3.6 6.6-5.7.5-.5.6-1.2.3-1.8-.3-.5-.8-.8-1.3-.8H27c-1.9.4-3.8 1-5.6 1.6-2 .7-3.9 1.3-5.8 1.6-.5-.6-1-1.3-1.5-1.9 1-.3 2.1-.6 3.1-.9 2.6-.7 5.2-1.5 7.8-2.4.7-.2 1.1-.9 1-1.7-.1-.7-.7-1.2-1.5-1.3H9.7c-.6-.8-1.3-1.6-1.9-2.5 2.2.1 4.8.1 7.7.1m62.6 0h9.5c-.2.3-.5.6-.7.9-.4.5-.8 1.1-1.2 1.6h-15c-.7 0-1.3.5-1.4 1.3-.1.7.3 1.4 1 1.7 2.6.9 5.3 1.7 8 2.5.9.3 1.9.5 2.9.8-.5.7-1 1.3-1.6 2-2.1-.6-4.2-1.2-6.3-1.9L68.5 22c-.1 0-.3-.1-.4-.1-.5 0-1 .3-1.3.7-.4.6-.3 1.3.1 1.8 1.7 1.9 3.6 3.5 5.5 5 .9.7 1.8 1.4 2.6 2.1-.4.4-.7.8-1.1 1.2-2.1-.3-3.8-1.9-5.6-3.6-1-.9-2-1.9-3.1-2.7-.3-.2-.6-.3-.9-.3-.2 0-.4 0-.6.1-.5.2-1.4.6-1.9.8-.4.2-.7.5-.8.9-.1.4-.1.9.2 1.2l2.4 4.2c-.3 0-.6.1-.8.1l-1.8.3c-.6-1.3-1.3-2.6-2-4 .5-1.3 1-2.5 1.5-3.8 4.8-1.7 8-6.3 8-11.4 2.9.1 6 .1 9.6.1m-30.6 6.2c1 .5 1.9 1 2.9 1.4 1.7.9 3.5 1.8 5.3 2.7-.8 2-1.5 4.1-2.2 6.1-.6 1.7-1.1 3.4-1.8 5.1-.1.4-.1.8 0 1.2.7 1.5 1.3 3 1.8 4.5.4 1.1.9 2.3 1.4 3.4-.5.2-1 .5-1.5.7-.3-1.3-.6-2.4-.9-3.6-.2-.7-.8-1.1-1.4-1.1H51c-.7.1-1.3.6-1.4 1.3-.2 1.9-.3 4 .2 6.1-.7.9-1.4 1.8-2 2.7-.5-.8-1.1-1.5-1.6-2.3l-.4-.6c.5-2.1.7-4 .5-5.8-.1-.7-.6-1.2-1.3-1.3h-.1c-.6 0-1.2.4-1.4 1-.4 1.1-.7 2.3-1.1 3.5-.6-.3-1.2-.5-1.7-.8.9-2 1.7-4 2.4-6 .2-.6.5-1.2.7-1.8.1-.3.1-.7 0-1.1-.6-1.7-1.2-3.5-1.8-5.2-.7-2.1-1.4-4.2-2.3-6.3 1.2-.7 2.5-1.3 3.7-1.9 1.2-.3 2.6-1.1 4.1-1.9m0-17c-1 2.3-2 4.6-3.2 6.8 1.2 2.2 2.2 4.5 3.2 6.7 1.2-2.2 2.3-4.5 3.3-6.8-1-2.2-2.1-4.5-3.3-6.7zm5.3 7c-1.1 2.4-2.2 4.8-3.4 7.1 2.1 1 4.1 2 6.2 3 .4-1.9.4-3.9 1.3-5.6 1.1-.9 2.4-1.7 3.6-2.5-2.6-.6-5.1-1.3-7.7-2zm-10.2.1c-2.6.6-5.2 1.3-7.9 1.9 1.3.8 2.5 1.7 3.8 2.5.4 1.9.8 3.7 1.2 5.6 2-1 4-2 6.1-2.9-1.2-2.3-2.2-4.7-3.2-7.1zm-27.1 2.2c-3.7 0-7.4 0-11.1.1 1.4 1.8 2.8 3.6 4.3 5.4h2.7c3.4 0 6.7-.1 10.1-.1h2.9c-4.2 1.5-8.6 2.6-12.9 3.9 1.1 1.4 2.2 2.9 3.5 4.3 4.2-.6 8.1-2.5 12.3-3.4-2.8 2.8-6.1 5.2-9.1 7.7 1.1 1.4 2.2 2.9 3.4 4.3 3-2.6 6.2-5.1 9.2-7.8l2 .8c-1.2 2-2.4 4-3.5 6 1.9.4 3.9.7 5.8 1.1.9-1.9 1.9-3.7 2.8-5.6L36.1 25c-4.9-1.7-8.6-6.5-7.7-11.9H15.5zm62.6 0H66.9c.8 5.2-2.5 10.2-7.5 11.7-.7 1.7-1.4 3.4-2 5.1.9 1.9 1.8 3.7 2.8 5.6 1.9-.3 3.8-.6 5.8-.9-1-2.1-2.2-4.2-3.4-6.1.5-.2 1.4-.6 1.8-.8 3.3 2.3 5.8 6.5 10.2 6.6.8-1 1.7-1.9 2.5-2.9-2.9-2.8-6.4-4.9-9.1-8 4 1.2 8 2.5 12.1 3.6 1.1-1.5 2.3-3 3.5-4.5-4.3-1.3-8.6-2.4-12.8-3.9h2.9c3.2 0 6.5.1 9.7.1h2.9c1.4-1.8 2.8-3.6 4.2-5.5-4-.1-8.2-.1-12.4-.1zm-30.6 6c-3.3 1.8-6.7 3.4-9.9 5.2 1.7 4.2 3 8.5 4.5 12.7-1.2 3-2.3 6.1-3.8 9.1 1.6.7 3.1 1.4 4.7 2.1.5-1.7 1-3.4 1.6-5 .3 2-.1 4-.6 5.9 1.2 1.7 2.5 3.4 3.7 5.2 1.1-1.7 2.3-3.4 3.6-5-.6-2.1-.5-4.2-.3-6.3.5 1.8.9 3.5 1.3 5.3l4.5-2.1c-1.4-3.1-2.4-6.3-3.8-9.3 1.6-4.1 2.7-8.4 4.5-12.4-3.2-2.1-6.7-3.6-10-5.4z" style="fill:#fcf09f"/>
        </svg>
      </div>
      <div v-if="comp.meta && comp.meta[0] === 'Twister'" class="BaseCompItem_MetaTwister">
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Layer_1" x="0" y="0" style="enable-background:new 0 0 95 58" version="1.1" viewBox="0 0 95 58">
          <path d="M76.1 37.3h-4.7l1.2-4H77c.3-1.4.7-2.9 1.1-4.3h-4.8l1.2-4h4.6c.3-1.3.6-2.5.9-3.8-6.1-.1-12.3.1-18.4-.1-3.1-2.7-6.2-5.7-10.4-6.8-1.8-3.1-3.6-6.2-5.2-9.4-1.7 3.2-3.4 6.3-5.3 9.4-3.9 1.3-7.3 3.7-9.9 6.8-6.3.1-12.6 0-18.9.1.3 1.3.6 2.5.9 3.8h4.4l1.2 4h-4.6c.4 1.4.7 2.9 1.1 4.3h4.3l1.2 4H16c.3 1.4.7 2.7 1 4.1h8.8c-1.2 2-2.4 3.9-3.6 5.9 3.3 0 6.6 0 10-.1 7.3 7.7 20.6 7.7 27.9 0 3.3 0 6.7 0 10 .1-1.2-1.9-2.4-3.9-3.6-5.9 2.9 0 5.8.1 8.7.1.2-1.5.5-2.8.9-4.2zM55 42.8c-3-1.8-6-3.5-8.9-5.3-3 1.8-5.8 3.8-9 5.1-2.3.1-4.6-.1-7-.2 1.3-2.1 2.3-4.5 3.9-6.4 2.6-1.9 5.6-3.3 8.3-5 0-3.3-.1-6.6.1-9.9.9-2.3 2.4-4.4 3.6-6.5 1.2 2.2 2.9 4.2 3.7 6.6.2 3.3 0 6.5 0 9.8 3 1.9 6.2 3.3 8.9 5.5 1.3 1.9 2.3 4 3.4 6-2.3 0-4.6.1-7 .3z" style="fill:none;stroke:#80dafd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10"/>
          <path d="M39.9 18.2C34 21.4 29.8 28.1 30.5 35m6.2 3.9 9.4-5.6m9.5 5.6-9.5-5.6m0 .1v-11m16.1 12.5c.7-6.9-3.5-13.5-9.4-16.8M36.2 46.8c5.9 4 13.9 4 19.7-.1" style="fill:none;stroke:#80dafd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10"/>
        </svg>
      </div>
      <div v-if="comp.meta && comp.meta[0] === 'Template'" class="BaseCompItem_MetaSpeedster">
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 95 58" viewBox="0 0 95 58">
          <path d="M47.6 7.3c.4.8.7 1.5 1.1 2.3.2.3.3.7.5 1-.5 1.1-1 2.2-1.6 3.3-.5-1.1-1-2.2-1.6-3.3.6-1 1.1-2.1 1.6-3.3m6.1 5.3c1 .3 2.1.6 3.1.8-.3.2-.6.4-.9.7-.2.1-.3.3-.4.5-.7 1.3-.9 2.7-1.1 4.1-.1 0-.2-.1-.2-.1-.9-.4-1.8-.9-2.7-1.3.8-1.7 1.5-3.2 2.2-4.7m-12 0c.7 1.7 1.4 3.2 2.1 4.6l-.2.1c-.9.4-1.8.9-2.7 1.3-.3-1.3-.5-2.5-.8-3.7-.1-.4-.3-.7-.6-1l-.9-.6c.2 0 .4-.1.6-.1.7-.1 1.6-.3 2.5-.6m-26.2 2c3.8 0 7.6 0 11 .1-.1 4.9 3.1 9.5 8.1 11.5.4 1.2.9 2.4 1.3 3.6-.6 1.3-1.3 2.7-1.9 4v.1c-.9-.2-1.8-.3-2.6-.5.8-1.5 1.7-2.8 2.5-4.1.2-.4.3-.9.2-1.3-.1-.4-.5-.8-.9-.9l-2-.8c-.2-.1-.3-.1-.5-.1-.4 0-.7.1-1 .4-1.6 1.5-3.4 2.9-5 4.3-1 .8-2 1.6-3 2.5-.5-.6-1-1.3-1.5-1.9l1.5-1.2c2.2-1.8 4.5-3.6 6.6-5.7.5-.5.6-1.2.3-1.8-.3-.5-.8-.8-1.3-.8H27c-1.9.4-3.8 1-5.6 1.6-2 .7-3.9 1.3-5.8 1.6-.5-.6-1-1.3-1.5-1.9 1-.3 2.1-.6 3.1-.9 2.6-.7 5.2-1.5 7.8-2.4.7-.2 1.1-.9 1-1.7-.1-.7-.7-1.2-1.5-1.3H9.7c-.6-.8-1.3-1.6-1.9-2.5 2.2.1 4.8.1 7.7.1m62.6 0h9.5c-.2.3-.5.6-.7.9-.4.5-.8 1.1-1.2 1.6h-15c-.7 0-1.3.5-1.4 1.3-.1.7.3 1.4 1 1.7 2.6.9 5.3 1.7 8 2.5.9.3 1.9.5 2.9.8-.5.7-1 1.3-1.6 2-2.1-.6-4.2-1.2-6.3-1.9L68.5 22c-.1 0-.3-.1-.4-.1-.5 0-1 .3-1.3.7-.4.6-.3 1.3.1 1.8 1.7 1.9 3.6 3.5 5.5 5 .9.7 1.8 1.4 2.6 2.1-.4.4-.7.8-1.1 1.2-2.1-.3-3.8-1.9-5.6-3.6-1-.9-2-1.9-3.1-2.7-.3-.2-.6-.3-.9-.3-.2 0-.4 0-.6.1-.5.2-1.4.6-1.9.8-.4.2-.7.5-.8.9-.1.4-.1.9.2 1.2l2.4 4.2c-.3 0-.6.1-.8.1l-1.8.3c-.6-1.3-1.3-2.6-2-4 .5-1.3 1-2.5 1.5-3.8 4.8-1.7 8-6.3 8-11.4 2.9.1 6 .1 9.6.1m-30.6 6.2c1 .5 1.9 1 2.9 1.4 1.7.9 3.5 1.8 5.3 2.7-.8 2-1.5 4.1-2.2 6.1-.6 1.7-1.1 3.4-1.8 5.1-.1.4-.1.8 0 1.2.7 1.5 1.3 3 1.8 4.5.4 1.1.9 2.3 1.4 3.4-.5.2-1 .5-1.5.7-.3-1.3-.6-2.4-.9-3.6-.2-.7-.8-1.1-1.4-1.1H51c-.7.1-1.3.6-1.4 1.3-.2 1.9-.3 4 .2 6.1-.7.9-1.4 1.8-2 2.7-.5-.8-1.1-1.5-1.6-2.3l-.4-.6c.5-2.1.7-4 .5-5.8-.1-.7-.6-1.2-1.3-1.3h-.1c-.6 0-1.2.4-1.4 1-.4 1.1-.7 2.3-1.1 3.5-.6-.3-1.2-.5-1.7-.8.9-2 1.7-4 2.4-6 .2-.6.5-1.2.7-1.8.1-.3.1-.7 0-1.1-.6-1.7-1.2-3.5-1.8-5.2-.7-2.1-1.4-4.2-2.3-6.3 1.2-.7 2.5-1.3 3.7-1.9 1.2-.3 2.6-1.1 4.1-1.9m0-17c-1 2.3-2 4.6-3.2 6.8 1.2 2.2 2.2 4.5 3.2 6.7 1.2-2.2 2.3-4.5 3.3-6.8-1-2.2-2.1-4.5-3.3-6.7zm5.3 7c-1.1 2.4-2.2 4.8-3.4 7.1 2.1 1 4.1 2 6.2 3 .4-1.9.4-3.9 1.3-5.6 1.1-.9 2.4-1.7 3.6-2.5-2.6-.6-5.1-1.3-7.7-2zm-10.2.1c-2.6.6-5.2 1.3-7.9 1.9 1.3.8 2.5 1.7 3.8 2.5.4 1.9.8 3.7 1.2 5.6 2-1 4-2 6.1-2.9-1.2-2.3-2.2-4.7-3.2-7.1zm-27.1 2.2c-3.7 0-7.4 0-11.1.1 1.4 1.8 2.8 3.6 4.3 5.4h2.7c3.4 0 6.7-.1 10.1-.1h2.9c-4.2 1.5-8.6 2.6-12.9 3.9 1.1 1.4 2.2 2.9 3.5 4.3 4.2-.6 8.1-2.5 12.3-3.4-2.8 2.8-6.1 5.2-9.1 7.7 1.1 1.4 2.2 2.9 3.4 4.3 3-2.6 6.2-5.1 9.2-7.8l2 .8c-1.2 2-2.4 4-3.5 6 1.9.4 3.9.7 5.8 1.1.9-1.9 1.9-3.7 2.8-5.6L36.1 25c-4.9-1.7-8.6-6.5-7.7-11.9H15.5zm62.6 0H66.9c.8 5.2-2.5 10.2-7.5 11.7-.7 1.7-1.4 3.4-2 5.1.9 1.9 1.8 3.7 2.8 5.6 1.9-.3 3.8-.6 5.8-.9-1-2.1-2.2-4.2-3.4-6.1.5-.2 1.4-.6 1.8-.8 3.3 2.3 5.8 6.5 10.2 6.6.8-1 1.7-1.9 2.5-2.9-2.9-2.8-6.4-4.9-9.1-8 4 1.2 8 2.5 12.1 3.6 1.1-1.5 2.3-3 3.5-4.5-4.3-1.3-8.6-2.4-12.8-3.9h2.9c3.2 0 6.5.1 9.7.1h2.9c1.4-1.8 2.8-3.6 4.2-5.5-4-.1-8.2-.1-12.4-.1zm-30.6 6c-3.3 1.8-6.7 3.4-9.9 5.2 1.7 4.2 3 8.5 4.5 12.7-1.2 3-2.3 6.1-3.8 9.1 1.6.7 3.1 1.4 4.7 2.1.5-1.7 1-3.4 1.6-5 .3 2-.1 4-.6 5.9 1.2 1.7 2.5 3.4 3.7 5.2 1.1-1.7 2.3-3.4 3.6-5-.6-2.1-.5-4.2-.3-6.3.5 1.8.9 3.5 1.3 5.3l4.5-2.1c-1.4-3.1-2.4-6.3-3.8-9.3 1.6-4.1 2.7-8.4 4.5-12.4-3.2-2.1-6.7-3.6-10-5.4z" style="fill:#16db98"/>
        </svg>
      </div>

      <div v-if="comp.meta && comp.meta.length > 0" class="BaseCompItem_Meta">
        <div class="BaseCompItem_MetaText" :class="`BaseCompItem_Meta_${comp.meta[0]}`">
          <svg width="115" height="24" >
            <text v-for="n in 2" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
              <template v-for="(item, index) in comp.meta">
                <template v-if="index !== 0">,&nbsp;</template>
                <template>{{ $t(`c_${item.toLowerCase()}`) }}</template>
              </template>
            </text>
          </svg>
        </div>
      </div>
      <div class="BaseCompItem_Bottom">
        <div
          v-if="comp.tyres && comp.tyres.length > 0"
          :class="{
            Type_10: comp.tyres.length === 1 ? comp.tyres.includes('Off-road') || comp.tyres.includes('All-surface') : comp.tyres.includes('Off-road') && comp.tyres.includes('All-surface'),
            Type_01: comp.tyres.length === 1 ? comp.tyres.includes('Standard') : comp.tyres.includes('Standard') && comp.drives.includes('4WD'),
          }"
          class="BaseCompItem_Normal BaseCompItem_Tyres">
          <span>
            <template v-for="(item, index) in comp.tyres">
              <template v-if="index !== 0">,&nbsp;</template>
              <template>{{ $t(`c_${item.toLowerCase()}2`) }}</template>
            </template>
          </span>
          <div class="BaseCompItem_Label">{{ $tc("c_tyre", 1) }}</div>
        </div>
        <div
          v-if="comp.drives && comp.drives.length > 0"
          :class="{
            Type_01: comp.drives.length === 1 && comp.tyres.length > 0 ? comp.drives.includes('4WD') : false,
          }"
          class="BaseCompItem_Normal BaseCompItem_Drives">
          <div class="BaseCompItem_Label">{{ $tc("c_drive", 1) }}</div>
          <span>{{ comp.drives.join(", ") }}</span>
        </div>
        <div
          v-if="comp.clearance && comp.clearance.length > 0"
          :class="{
            Type_60: (comp.clearance.includes('Mid') || comp.clearance.includes('High')) && !(comp.tyres.includes('Off-road') || comp.tyres.includes('All-surface')),
            Type_10: comp.clearance.includes('High') && (comp.tyres.includes('Off-road') || comp.tyres.includes('All-surface')),
          }"
          class="BaseCompItem_Normal BaseCompItem_Clearances">
          <span>
            <template v-for="(item, index) in comp.clearance">
              <template v-if="index !== 0">,&nbsp;</template>
              <template>{{ $t(`c_${item.toLowerCase()}`) }}</template>
            </template>
          </span>
          <div class="BaseCompItem_Label">{{ $tc("c_clearance", 1) }}</div>
        </div>
      </div>
    </div>
    <template v-else>
      <i v-if="isMod" class="ticon-pencil BaseCompItem_Icon" aria-hidden="true"/>
      <i v-else class="ticon-line BaseCompItem_Icon" aria-hidden="true"/>
    </template>
  </BaseCustomTag>
</template>

<script>
import BaseCustomTag from './BaseCustomTag.vue'

export default {
  name: 'BaseCompItem',
  components: {
    BaseCustomTag
  },
  props: {
    comp: {
      type: Object,
      default() {
        return {}
      }
    },
    isMod: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  computed: {
    empty() {
      let result = true;
      if (
        (this.comp.meta && this.comp.meta.length > 0) ||
        (this.comp.tyres && this.comp.tyres.length > 0) ||
        (this.comp.drives && this.comp.drives.length > 0) ||
        (this.comp.clearance && this.comp.clearance.length > 0)
      ) {
        result = false;
      }
      return result;
    }
  },
  methods: {},
}
</script>

<style>
.BaseCompItem_Layout {
  text-align: center;
}
.BaseCompItem_LayoutBox {
  position: relative;
}
.D_Button.BaseCompItem_Layout {
  text-align: center;
  flex-direction: column;
  font-size: inherit;
  color: inherit;
  line-height: 1.2;
  margin: -10px;
  padding: 10px;
  position: relative;
}
.BaseCompItem_Layout:hover .BaseCompItem_Label,
.BaseCompItem_Layout.focus-visible .BaseCompItem_Label {
  opacity: 1;
}
.Main_BodyPrint .BaseCompItem_Label {
  transition-duration: 0s !important;
  opacity: 1;
}
.BaseCompItem_Meta {
  font-size: 20px;
  margin-bottom: 8px;
  color: transparent;
  position: relative;
}
/* .BaseCompItem_MetaText:first-child {
  -webkit-text-stroke-width: 7px;
  -webkit-text-stroke-color: var(--d-back);
} */
.BaseCompItem_MetaText text:first-child {
  stroke: var(--d-back);
  stroke-width: 7px;
}
.BaseCompItem_Meta_Dragster text:last-child {
  fill: #ff8a5c;
}
.BaseCompItem_Meta_Speedster text:last-child {
  fill: #fcf09f;
}
.BaseCompItem_Meta_Twister text:last-child {
  fill: #80dafd;
}
.BaseCompItem_Meta_Template text:last-child {
  fill: #16db98
}
.BaseCompItem_Bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2px;
}
.BaseCompItem_Normal {
  padding: 6px 8px 4px 8px;
  border-radius: 5px;
  background-color: #2b2b2bba;
  position: relative;
  font-size: 14px;
}
.BaseCompItem_Normal.Type_01 {
  /* color: #a6c5e5 !important; */
  background-color: rgba(var(--color-wet),var(--type-back-opac));
}
.BaseCompItem_Normal.Type_10,
.Type_10 ~ .BaseCompItem_Drives {
  /* color: #e9a69c !important; */
  background-color: rgba(var(--color-dirt), var(--type-back-opac));
}
.BaseCompItem_Clearances.Type_60 {
  /* color: #b7b9bb !important; */
  background-color: rgba(var(--color-snow), var(--type-back-opac));
}
/* .BaseCompItem_Off {
  color: rgb(var(--color-dirt));
  --type-back-opac: 0.1;
  background-color: rgba(var(--color-dirt), var(--type-back-opac));
} */
.BaseCompItem_Label {
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgb(var(--d-text-yellow));
  transition-duration: 0.2s;
  opacity: 0;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.BaseCompItem_MetaDragster {
  position: absolute;
  width: 120px;
  transform: translateX(-50%);
  left: 50%;
  top: -26px;
  opacity: 0.3;
}
.BaseCompItem_MetaTwister {
  position: absolute;
  width: 120px;
  transform: translateX(-50%);
  left: 50%;
  top: -28px;
  opacity: 0.3;
}
.BaseCompItem_MetaSpeedster {
  position: absolute;
  width: 120px;
  transform: translateX(-50%);
  left: 50%;
  top: -25px;
  opacity: 0.3;
}

@media only screen and (max-width: 1200px) {
  .BaseCompItem_Bottom {
    min-height: 56px;
  }
}
</style>