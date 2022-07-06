import {
    toTimeString,
    toTimeNumber,
    clearNumber,
} from './formatters.js';

export default {
    install(Vue) {
        /*formatters*/
        Vue.filter('toTimeString', toTimeString),
        Vue.filter('toTimeNumber', toTimeNumber),
        Vue.filter('clearNumber', clearNumber),

        Vue.debounce = function (func, wait, immediate) {
            var timeout;

            return function executedFunction() {
                var context = this;
                var args = arguments;

                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };

                var callNow = immediate && !timeout;

                clearTimeout(timeout);

                timeout = setTimeout(later, wait);

                if (callNow) func.apply(context, args);
            };
        },
        Vue.resolveClass = function (rq, classe, type) {
            let classes = ["F","E","D","C","B","A","S"];
            let classesColors = ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFC717"];
            let resultClass;

            if (classe) {
                resultClass = classes.indexOf(classe);
            } else {
                if (rq < 20) resultClass = 0;
                else if (rq < 30) resultClass = 1;
                else if (rq < 40) resultClass = 2;
                else if (rq < 50) resultClass = 3;
                else if (rq < 65) resultClass = 4;
                else if (rq < 80) resultClass = 5;
                else resultClass = 6;
            }
            if (type === "letter") return classes[resultClass];
            if (type === "color") return classesColors[resultClass];
        }
        Vue.resolveCountry = function (country) {
            let countrys = ['France', 'Sweden', 'Germany', 'Croatia', 'UK', 'Italy', 'Japan', 'USA', 'Netherlands', 'Austria', 'Australia'];
            let letter = ['FR', 'SE', 'DE', 'HR', 'UK', 'IT', 'JP', 'US', 'NL', 'AT', 'AU'];
            
            country = countrys.findIndex(x => x === country);
            return letter[country];
        }
    }
};
