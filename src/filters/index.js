import {
    toTimeString,
    toTimeNumber,
    clearNumber,
} from './formatters.js';

export default {
    install(Vue) {
        /*formatters*/
        Vue.filter('toTimeString', toTimeString);
        Vue.filter('toTimeNumber', toTimeNumber);
        Vue.filter('clearNumber', clearNumber);
        /*formatters*/
    }
};
