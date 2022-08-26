import {
    toTimeString,
    toTimeNumber,
    clearNumber,
} from './formatters.js';

export default {
    install(Vue) {
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
        },
        Vue.resolveCountry = function (country) {
            let countrys = ['France', 'Sweden', 'Germany', 'Croatia', 'UK', 'Italy', 'Japan', 'USA', 'Netherlands', 'Austria', 'Australia'];
            let letter = ['FR', 'SE', 'DE', 'HR', 'UK', 'IT', 'JP', 'US', 'NL', 'AT', 'AU'];
            
            country = countrys.findIndex(x => x === country);
            return letter[country];
        },
        Vue.resolveStat = function (car, type) {
            if (car.selectedTune === null || car.selectedTune === undefined) {
                if (type === "acel" && typeof car[type] === 'number') return car[type].toFixed(1);
                return car[type] || "-";
            }
            if (typeof car.selectedTune !== 'string') return "err";
            
            try {
                if (!car.data[car.selectedTune].info[type]) return "-";
                return car.data[car.selectedTune].info[type];
            } catch (error) {
                return "-";
            }
        },
        Vue.boldTunes = function (tune) {
            if (typeof tune !== 'string' && tune.length !== 3) return tune;

            return tune.replaceAll('2', '<s>2</s>')
        },
        Vue.convertTires = function (tyre) {
            if (tyre === "Performance") return "PER";
            else if (tyre === "Standard") return "STD";
            else if (tyre === "All-surface") return "ALL";
            else if (tyre === "Off-road") return "OFF";
            else if (tyre === "Slick") return "SLK";
        },
        Vue.mra = function (time, acel, multiplier = 100) {
            acel = Number(acel);
            // if (time && acel) {
            //     debugger;
            // }
            if ( time && typeof time === 'number' && time > 0 && !isNaN(acel) ) {
                return (multiplier * (acel / (time - acel))).toFixed(2)
            } else {
                return ''
            }
        },
        Vue.brake = function (timeWithBrake, time) {
            
            if ( time && typeof time === 'number' && timeWithBrake && timeWithBrake > time ) {
                return (timeWithBrake - time).toFixed(2)
            } else {
                return ''
            }
        },


        Vue.filter('toTimeString', toTimeString);
        Vue.filter('toTimeNumber', toTimeNumber);
        Vue.filter('clearNumber', clearNumber);
        Vue.filter('resolveClass', Vue.resolveClass);
        Vue.filter('resolveStat', Vue.resolveStat);
        Vue.filter('boldTunes', Vue.boldTunes);
        Vue.filter('convertTires', Vue.convertTires);
        Vue.filter('mra', Vue.mra);
        Vue.filter('brake', Vue.brake);
    }
};
