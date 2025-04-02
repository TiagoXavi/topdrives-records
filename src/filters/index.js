import {
    toTimeString,
    toTimeNumber,
    clearNumber,
} from './formatters.js';
import tracks_factor from '../database/tracks_factor.json'

var classes = ["F","E","D","C","B","A","S"];
var classesColors = ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFAF17"];
var classesColorsRgb = ["135, 135, 135", "118, 242, 115", "28, 204, 255", "255, 246, 43", "255, 53, 56", "140, 92, 255", "255, 175, 23"];

var countrys = ['France', 'Sweden', 'Germany', 'Croatia', 'UK', 'Italy', 'Japan', 'USA', 'Netherlands', 'Austria', 'Australia'];
var letter = ['FR', 'SE', 'DE', 'HR', 'UK', 'IT', 'JP', 'US', 'NL', 'AT', 'AU'];

var ignore50points = false;

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
        Vue.resolveClass = function (rq, classe, type, rgb = false) {
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
            if (type === "color" && !rgb) return classesColors[resultClass];
            if (type === "color" && rgb) return classesColorsRgb[resultClass];
        },
        Vue.resolveCountry = function (country) {
            country = countrys.findIndex(x => x === country);
            return letter[country];
        },
        Vue.resolveStat = function (car, type, customData = null) {
            if (car.selectedTune === null || car.selectedTune === undefined || car.selectedTune === "000") {
                if (type === "acel" && typeof car[type] === 'number') return car[type].toFixed(1);
                return car[type] || "-";
            }
            if (car.selectedTune && car.selectedTune.includes("Other")) {
                return "?";
            }
            if (typeof car.selectedTune !== 'string') return "err";

            if (customData) {
                try {
                    if (!customData.data[car.selectedTune].info[type].t) return "-";
                    return customData.data[car.selectedTune].info[type].t;
                } catch (error) {
                    return "-";
                }
            } else {
                try {
                    if (!car.data[car.selectedTune].info[type].t) return "-";
                    return car.data[car.selectedTune].info[type].t;
                } catch (error) {
                    return "-";
                }
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
        Vue.mra = function (time, acel, multiplier = 100, cases = 2) {
            acel = Number(acel);
            // if (time && acel) {
            //     debugger;
            // }
            if ( time && typeof time === 'number' && time > 0 && !isNaN(acel) ) {
                return (multiplier * (acel / (time - acel))).toFixed(cases)
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
        Vue.kShort = function (number) {
            
            if ( number && typeof number === 'number' ) {
                if (number >= 10000) {
                    return `${Math.floor(number / 1000)}k`
                }
                if (number >= 1000) {
                    return `${(Math.floor(number / 100))/10}k`
                }
                if (number > 100) {
                    return `${(Math.floor(number / 100))/1}00+`
                }
                if (number <= 100) {
                    return `<100`
                }
                return `${number}k`
            } else {
                return ''
            }
        },
        Vue.resolveCond = function (type) {
            let result = '';
            if (typeof type === 'string' && type.length === 2) {
                if (type[0] == '1') result = "Dirt";
                else if (type[0] == '2') result = "Gravel";
                else if (type[0] == '3') result = "Ice";
                else if (type[0] == '5') result = "Sand";
                else if (type[0] == '6') result = "Snow";
                else if (type[0] == '7') result = "Grass";
                else {
                    if (type == 'e0') result = "Sand/Dirt";
                    else if (type == 'f0') result = "Asphalt/Grass/Dirt";
                    else if (type == 'g0') result = "Ice/Snow";
                    else if (type == 'h0' || type == 'h1') result = "Snow/Dirt";
                    else {
                        if (type !== '01') result = "Asphalt";
                        if (type == '40') result += " Dirt";
                        else if (type == 'b0') result += " Gravel";
                        else if (type == 'c0') result += " Sand";
                        else if (type == 'd0') result += " Snow";
                        else if (type == '41') result += " Dirt";
                        else if (type == 'c1') result += " Sand";
                    }
                }
                if (type[1] == '1') result += " Wet";
                return result;
            }
        },
        Vue.getOldCar = async function (rid, version) {
            let car;
            
            let arr;
            
            if (version === "15") arr = await import('../database/cars_final_PL15.json');
            if (version === "16") arr = await import('../database/cars_final_PL16.json');
            if (version === "17") arr = await import('../database/cars_final_PL17.json');
            if (version === "18") arr = await import('../database/cars_final_PL18.json');
            if (version === "19") arr = await import('../database/cars_final_PL19_3.json');
            if (version === "20") arr = await import('../database/cars_final_PL20.json');
            if (version === "2a") arr = await import('../database/cars_final_PL21_2.json');
            if (version === "21") arr = await import('../database/cars_final_PL21_4.json');
            if (version === "22") arr = await import('../database/cars_final_PL22.json');
            if (version === "23") arr = await import('../database/cars_final_PL23.json');
            if (version === "24") arr = await import('../database/cars_final_PL24.json');
            if (version === "2b") arr = await import('../database/cars_final_PL24_1.json');
            if (version === "2c") arr = await import('../database/cars_final_PL24_2.json');

            arr = arr.default;
            
            car = arr.find(x => x.rid === rid);

            if (car) {
                return car;
            } else {
                return {}
            }
        },
        Vue.decodeTdr = function (template) {
            let carsFromQuery = [];
            let tracksFromQuery = [];

            template.split("~").map(x => {
              if (x[0] === "C") {
                carsFromQuery.push({ // car
                  rid: decodeURI(x.substr(1))
                })
              } else if (x[0] === "T") {
                carsFromQuery[carsFromQuery.length-1].selectedTune = x.substr(1); // tune last car
              } else if (x[0] === "K") {
                tracksFromQuery.push(x.substr(1))
              }
            })

            return {
                tracks: tracksFromQuery,
                cars: carsFromQuery
            }
        },
        Vue.isMobile = function () {
            return 'ontouchstart' in window || navigator.msMaxTouchPoints;
        },
        Vue.carPhoto = function (car) {
            try {
                if (typeof car === "object") {
                    if (car.photoId) {
                        return require('@/incoming_pics/' + car.photoId + '.jpg');
                    }
                    return require('@/imgs_final/' + decodeURI(car.rid) + '.jpg');
                    // return require('@/imgs_final/' + decodeURI(car.rid$ || car.rid) + '.jpg');
                }
                if (typeof car === "string") {
                    return require('@/imgs_final/' + decodeURI(car) + '.jpg');
                }
            } catch (error) {
                return ": "                
            }
        },
        Vue.userPoints = function (userTime, oppoTime, trackCode) {
            if (isNaN(userTime) || isNaN(oppoTime)) return;
            if (!trackCode) return;
            let track = trackCode;
            if (trackCode.includes("_a")) track = trackCode.slice(0,-4);
            if (!tracks_factor[track] || isNaN(tracks_factor[track])) return;

            let result;
            let wt = Math.min(userTime, oppoTime);
            let lt = Math.max(userTime, oppoTime);
            let isLose = userTime > oppoTime;
            let factor = tracks_factor[track];


            // especials
            if (trackCode === "testBowl_a01") factor = 400;
            if (trackCode === "dealsGap_a01") factor = 1100;
            if (trackCode.startsWith("hClimb_a0")) factor = 600;
            if (trackCode.startsWith("mnHairpin_a4")) factor = 1200;
            if (trackCode.startsWith("mile1_a") && !trackCode.startsWith("mile1_a0")) factor = 640;
            if (trackCode.startsWith("mile1r_a") && !trackCode.startsWith("mile1r_a0")) factor = 640;
            if (trackCode.startsWith("mile2_a") && !trackCode.startsWith("mile2_a0")) factor = 640;
            if (trackCode.startsWith("mile4_a") && !trackCode.startsWith("mile4_a0")) factor = 640;
            if (trackCode.startsWith("mile4r_a") && !trackCode.startsWith("mile4r_a0")) factor = 640;
            if (trackCode.startsWith("nwDrag_a") && !trackCode.startsWith("nwDrag_a0")) factor = 640;
            if (trackCode.startsWith("speedbump12km_a") && !trackCode.startsWith("speedbump12km_a0")) factor = 640;
            if (trackCode.startsWith("speedbump1km_a") && !trackCode.startsWith("speedbump1km_a0")) factor = 640;
            if (trackCode.startsWith("gForce_a") && !trackCode.startsWith("gForce_a0")) factor = 1000;
            if (trackCode.startsWith("slalom_a") && !trackCode.startsWith("slalom_a0")) factor = 1000;
            if (trackCode.startsWith("townSlalom_a") && !trackCode.startsWith("townSlalom_a0")) factor = 1000;
            if (trackCode.startsWith("nwSlalom_a") && !trackCode.startsWith("nwSlalom_a0")) factor = 1000;
            if (trackCode.startsWith("mtSlalom_a") && !trackCode.startsWith("mtSlalom_a0")) factor = 1000;
            if (trackCode.startsWith("nwGforce_a") && !trackCode.startsWith("nwGforce_a0")) factor = 1000;
            if (trackCode.startsWith("lumberTwisty_a") && !trackCode.startsWith("lumberTwisty_a4")) factor = 1000;



            if (trackCode.includes("testBowl")) {
                let wt = Math.max(userTime, oppoTime);
                let lt = Math.min(userTime, oppoTime);
                let isLose = userTime < oppoTime;

                if (wt === lt) return { v: 0, i: true };


                // var diffPercent = lt/wt*100;
                // result = -384.0318 + (490971 - -384.0318)/(1 + Math.pow(diffPercent/0.08919558, 1.017337)); // v2
                // result = Math.round(result);
                // if (trackCode.includes("testBowlr")) result = result - 5;
                // if (trackCode === "testBowl_a10") result = result - 3;
                // if (trackCode === "testBowlr_a20") result = result + 5;

                var diffPercent = lt/wt*100;
                result = -363.1035 + (423861800 - -363.1035)/(1 + Math.pow(diffPercent/0.00004795929, 0.9598014))
                result = Math.round(result);
                if (trackCode.includes("testBowlr")) result = result - 5;
                if (trackCode === "testBowl_a10") result = result - 3;
                if (trackCode === "testBowlr_a20") result = result + 5;



                if (result < 50 && !ignore50points) result = 50;
                if (isLose) result = result * -1;
                return { v: result, i: true };
            }

            if (wt == lt) return { v: 0, i: false };
            if (wt == 0 || lt == 0) {
                result = 250;
                if (!isLose) result = result * -1;
                return { v: result, i: false };
            }

            result = (factor * -1) * (wt / lt) + factor;
            // console.log("real points:", isLose ? result*-1 : result, `resultSub`, Math.floor(Number(result.toFixed(1))), track );
            let decimal = Number((result % 1).toFixed(2));
            let isImprecise = false;
            if (decimal < 0.13 || decimal > 0.87) {
                isImprecise = true;
            }
            result = Math.floor(Number((result - 0.09).toFixed(1)));
            
            if (result < 50 && !ignore50points) {
                result = 50;
                isImprecise = false;
            }
            if (isLose) result = result * -1;

            return { v: result, i: isImprecise };
            
        },
        Vue.toggleIgnore50points = function () {
            ignore50points = !ignore50points;
        },
        Vue.resolveHighlightsUsers = function (resData) {
            let highlightsUsers = {
              "bcp_": 'mod',
              "TiagoXavi": 'mod',
              "Bigredmachine": 'mod',
              "duck": 'mod',
              "HansKasai": 'mod',
              "fiero": 'mod',
              "L1ZVRD": 'mod',
              "intrx": 'mod',
              "rei348": 'mod',
              "Enginn": 'mod',
              "vel_8": 'mod',
              "Ansami_MH": 'mod',
              "RenMasamune": 'mod',
              "boliveira82": 'mod',
              "ELtotheLIS": 'mod',
              "CapSora": 'mod',
              "Mattsy": 'mod',
              "Skapis": 'mod',
              "Draugr": 'mod',
              "TopDrives": 'mod',
              "Asaneon": 'mod',
              "Dennis": 'mod',
              "MichaelB": 'mod',
              "Leafclaw": 'mod',
              "biava": 'mod',
              "artkatt": 'mod'
            };
            let pUsers = resData.find(x => x.id === 'pUsers').value;
            Object.keys( pUsers ).forEach(key => {
              pUsers[key].map(user => {
                Vue.set(highlightsUsers, user, Number(key.slice(-1)));
                highlightsUsers[user] = Number(key.slice(-1));
              })
            })
            highlightsUsers["Lewdmilla"] = "w1";
            highlightsUsers["RexKwonDo"] = "w2";
            highlightsUsers["Bramdal"] = "w3";

            return highlightsUsers;
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
        Vue.filter('kShort', Vue.kShort);
        Vue.filter('resolveCond', Vue.resolveCond);
        Vue.filter('getOldCar', Vue.getOldCar);
        Vue.filter('isMobile', Vue.isMobile);
        Vue.filter('carPhoto', Vue.carPhoto);
        Vue.filter('userPoints', Vue.userPoints);
    }
};
