import tracks_factor from '../database/tracks_factor.json';
import all_cars from '../database/cars_final.json';
import tracksRepo from '../database/tracks_repo.json';
import tracksPerc from '../database/tracks_perc.json';
import Vue from 'vue';

var classes = ["F","E","D","C","B","A","S"];
var classesColors = ["#878787","#76F273","#1CCCFF","#FFF62B","#FF3538","#8C5CFF","#FFAF17"];
var classesColorsRgb = ["135, 135, 135", "118, 242, 115", "28, 204, 255", "255, 246, 43", "255, 53, 56", "140, 92, 255", "255, 175, 23"];

var countrys = ['France', 'Sweden', 'Germany', 'Croatia', 'UK', 'Italy', 'Japan', 'USA', 'Netherlands', 'Austria', 'Australia'];
var letter = ['FR', 'SE', 'DE', 'HR', 'UK', 'IT', 'JP', 'US', 'NL', 'AT', 'AU'];
var ignore50points = false;

function resolveClass(rq, classe, type, rgb = false) {
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
}
function carPhoto(car) {
    // try {
        if (typeof car === "object") {
            // if (car.photoId) {
            //     return '/incoming_pics/' + car.photoId + '.jpg';
            // }
            return '/imgs_final/' + decodeURI(car.rid) + '.jpg';
            // return '/imgs_final/' + decodeURI(car.rid$ || car.rid) + '.jpg';
        }
        if (typeof car === "string") {
            return '/imgs_final/' + decodeURI(car) + '.jpg';
        }
        return ": ";
    // } catch (error) {
    //     return ": "                
    // }
}

var resolvedRids = {};
var guidToRid = {};
const cacheCars = Vue.observable({});
const utils = Vue.observable({
    cacheLoading: false,
    downloadCount: 0,
    altKey: false,
    windowWidth: 0,
    ridsDownloading: [],
    giveawayUsers: []
});
const garageByRid = {};
const garageByHid = {};
const garageListUpgraded = Vue.observable([]);
const garageObj = Vue.observable({
  loading: false,
  loaded: false
});
function addToGarageUpgraded(car) {
  let garageCar = garageByHid[car.cardRecordId];
  if (garageCar.backupTun) return; // already added
  Vue.set(garageCar, 'backupTun', garageCar.tun);
  garageCar.tun = car.tune;
  garageCar.rid = car.rid; // needed
  garageListUpgraded.push(garageCar);
  // console.log(garageListUpgraded);
  updateGarageUpgradesLocalStorage();
}
function removeFromGarageUpgraded(index) {
  let car = garageListUpgraded[index];
  car.tun = car.backupTun;
  delete car.backupTun;
  garageListUpgraded.splice(index, 1);
  updateGarageUpgradesLocalStorage();
}
function updateGarageUpgradesLocalStorage() {
  window.localStorage.setItem('garageUpgrades', JSON.stringify(garageListUpgraded));
}



let limit = all_cars.length; // 5700 items
for (let Z = 0; Z < limit; Z++) {
    resolvedRids[all_cars[Z].rid] = all_cars[Z];
    resolvedRids[all_cars[Z].rid].color = resolveClass(all_cars[Z].rq, all_cars[Z].class, "color");
    resolvedRids[all_cars[Z].rid].colorRgb = resolveClass(all_cars[Z].rq, all_cars[Z].class, "color", true);
    resolvedRids[all_cars[Z].rid].photo = carPhoto(all_cars[Z]);
    guidToRid[all_cars[Z].guid] = all_cars[Z].rid;
}


function resolveTracksetGroup(tracksetGroup) {
  let resolvedTrackset = JSON.parse(JSON.stringify(tracksetGroup));

  resolvedTrackset = resolvedTrackset.map(trackset => {
    return trackset.map(track => {
      if (track === null) return null;
      return resolveTrack({ track }, false, false);
    })
  })
  return resolvedTrackset;
}

function resolveTrack(race, calcResult = true, isRace = true) {
  if (race.track) {
    return validateTracks([race.track]);
  }
}

function validateTracks(tracks, group = false) {
  let tracksClear = [];

  tracks.map(x => {
    tracksRepo.find(circuit => {
      if (x.slice(0,-4) !== circuit.id) return false;
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
}

function prettyPrintArray(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }
  let output = JSON.stringify(json, function(k,v) {
    if (k !== "" && v instanceof Array) {
        // debugger;
        return JSON.stringify(v);
    }
    return v;
  }, 2).replace(/\\/g, '')
    .replace(/\"\[/g, '[')
    .replace(/\]\"/g,']')
    .replace(/\"\{/g, '{')
    .replace(/\}\"/g,'}');

  return output;
}






function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        // console.log("ping");
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
}


function watchDebounced(array, callback, delay) {
  const debouncedCallback = debounce(callback, delay);

  const proxyHandler = {
    set(target, property, value, receiver) {
      const result = Reflect.set(target, property, value, receiver); // Execute the default behavior first
      debouncedCallback(target);
      return result;
    },
  };

  return new Proxy(array, proxyHandler);
}

let lastRidsString;

function downloadCars() {
  if (!ridsToDownload.length) return;
  let rids = [...new Set(ridsToDownload)];
  ridsToDownload.splice(0, ridsToDownload.length);
  if (JSON.stringify(rids) === lastRidsString) return; // avoid ddos
  lastRidsString = JSON.stringify(rids);
  utils.cacheLoading = true;
  utils.ridsDownloading = rids;

  window.axios.post(Vue.preUrl + "/cars", rids.map(x => { return { rid: x } }))
  .then(res => {
    rids.map(rid => {
      if (!cacheCars[rid]) cacheCars[rid] = {};
      cacheCars[rid].isDownloaded = true;
    })
    res.data.map(car => {
      if (car.data) {
        if (!cacheCars[car.rid].data) cacheCars[car.rid].data = {};
        Object.keys(car.data).map(tune => {
          cacheCars[car.rid].data[tune] = car.data[tune];
        })
      }
      if (car.users) cacheCars[car.rid].users = car.users;
      if (car.reviews) cacheCars[car.rid].reviews = car.reviews;
    });
    utils.downloadCount++;
  })
  .catch(error => {
    console.log(error);
  })
  .then(() => {
    utils.cacheLoading = false;
    utils.ridsDownloading = [];
  });
}


const ridsToDownload = watchDebounced([], (obj) => {
  // console.log('Array has stopped changing. Final state:', obj);
  downloadCars();
}, 100);




function predictTimes(cars, tracks) {
  // cars = array of car objects with rid and selectedTune
  let rids = cars.map(x => x.rid);
  rids = [...new Set(rids)];
  rids = rids.map(rid => { return { rid } });
  
  let body = {
    rids: [...new Set(rids)],
    predictObj: {
      tracks: tracks,
      cars: cars
    },
  }
  utils.cacheLoading = true;

  window.axios.post(Vue.preUrl + "/cars", body)
  .then(res => {
    rids.map(rid => {
      if (!cacheCars[rid]) cacheCars[rid] = {};
      cacheCars[rid].isDownloaded = true;
    })
    res.data.map(car => {
      if (car.data) {
        if (!cacheCars[car.rid].data) cacheCars[car.rid].data = {};
        Object.keys(car.data).map(tune => {
          cacheCars[car.rid].data[tune] = car.data[tune];
        })
      }
      if (car.users) cacheCars[car.rid].users = car.users;
      if (car.reviews) cacheCars[car.rid].reviews = car.reviews;
    });
    utils.downloadCount++;
  })
  .catch(error => {
    console.log(error);
  })
  .then(() => {
    utils.cacheLoading = false;
  });
}




function loadGarage(username) {
  if (garageObj.loaded) return;
  garageObj.loading = true;
  window.axios.post(Vue.preUrl + "/getGarage", {
    username: username
  })
  .then(res => {
    if (res.data.value.playerDeck) {
      resolveGarageRes(res.data);
    }
    window.localStorage.setItem('cacheGarage', JSON.stringify(res.data));
  })
  .catch(error => {
    console.log(error);
  })
  .then(() => {
    garageObj.loading = false;
    garageObj.loaded = true;
  });
}


// data.value.playerDeck // [] 
// [{
//   "cardRecordId": "000c23cc",
//   "rid": "Cadillac_XLR_roadster_2004",
//   "date": "2018-06-24T05:00Z",
//   "tunZ": "996",
//   "cW": 523,
//   "cL": 230,
//   "cD": 4,
//   "tun": "332"
// }]
function resolveGarageRes(data) {
  let car;
  for (let Z = 0; Z < data.value.playerDeck.length; Z++) {
    car = data.value.playerDeck[Z];
    if (!garageByRid[car.rid]) garageByRid[car.rid] = [];
    garageByRid[car.rid].push({
      cardRecordId: car.cardRecordId,
      tunZ: car.tunZ,
      tun: car.tun
    });
    garageByHid[car.cardRecordId] = garageByRid[car.rid][garageByRid[car.rid].length - 1];
  }

  // read garageUpgrades from localStorage
  let storedGarageUpgrades = window.localStorage.getItem('garageUpgrades');
  if (storedGarageUpgrades) {
    try {
      let parsed = JSON.parse(storedGarageUpgrades);
      parsed.forEach(car => {
        let garageCar = garageByHid[car.cardRecordId];
        if (garageCar) {
          garageCar.backupTun = garageCar.tun;
          garageCar.tun = car.tun;
          garageCar.rid = car.rid;
          garageListUpgraded.push(garageCar);
        }
      });
    } catch (error) {
      console.log("Error parsing garageUpgrades from localStorage:", error);
    }
  }
}

function tryLoadGarageFromStorage() {
  if (garageObj.loaded) return;
  if (window.user === null || window.user === undefined) return;

  let storedGarage = window.localStorage.getItem('cacheGarage');
  if (storedGarage) {
    try {
      let parsed = JSON.parse(storedGarage);
      if (parsed.u !== window.user.username) return; // different user
      if (parsed.value.playerDeck) {
        resolveGarageRes(parsed);
        garageObj.loaded = true;
      }
    } catch (error) {
      console.log("Error parsing cacheGarage from localStorage:", error);
    }
  }
}





export default {
    install(Vue) {

        Vue.ridByGuid = guidToRid;
        Vue.all_carsArr = all_cars;
        Vue.all_cacheObj = cacheCars;
        Vue.all_carsObj = resolvedRids;
        Vue.resolveTracksetGroup = resolveTracksetGroup;
        Vue.resolveTrack = resolveTrack;
        Vue.utils = utils;
        Vue.prettyPrintArray = prettyPrintArray;
        Vue.tracks_perc = tracksPerc;
        Vue.debounce = debounce;
        Vue.resolveClass = resolveClass;
        Vue.predictTimes = predictTimes;
        Vue.garageByRid = garageByRid;
        Vue.garageByHid = garageByHid;
        Vue.garageListUpgraded = garageListUpgraded;
        Vue.garageObj = garageObj;
        Vue.addToGarageUpgraded = addToGarageUpgraded;
        Vue.removeFromGarageUpgraded = removeFromGarageUpgraded;
        Vue.loadGarage = loadGarage;
        Vue.tryLoadGarageFromStorage = tryLoadGarageFromStorage;

        Vue.carByRid = function (rid) {
          return resolvedRids[rid];
        };
        Vue.cacheByRid = function (rid) {
          return cacheCars[rid];
        };

        Vue.resolveCountry = function (country) {
          country = countrys.findIndex(x => x === country);
          return letter[country];
        };

        Vue.toTimeString = function(input, id) {
          if (input === null || input === undefined || input === "") return "";
          let num = Number(input);
          if (input == 0) return "DNF";
          if (isNaN(input)) {
            if (input.includes('(R)')) {
              return input.slice(0, -4);
            }
            return input;
          }
          if ((id || "").includes("testBowl")) {
            if (!isNaN(num)) {
              return `${Math.floor(num)}`;
            }
          }

          var sec_num = parseInt(input, 10); // don't forget the second param
          var hours = Math.floor(sec_num / 3600);
          var minutes = Math.floor((sec_num - hours * 3600) / 60);
          var seconds = sec_num - hours * 3600 - minutes * 60;
          var milesi = parseInt(Vue.options.filters.clearNumber((input - parseInt(input)) * 100));

          if (hours < 10) {
            hours = '0' + hours;
          }
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          if (seconds < 10) {
            seconds = '0' + seconds;
          }
          if (milesi < 10) {
            milesi = '0' + milesi;
          }
          return minutes + ':' + seconds + ':' + milesi;
        };
        Vue.toTimeStringTrCode = function(input, trCode) {
            if (!trCode) return "";
            return Vue.toTimeString(input, trCode.slice(0,-4));
        };

        Vue.toTimeNumber = function(input, id = "") {
          if (input === "DNF" || input === "dnf" || input === "0" || input === "99:99:99") return 0;
          if (input === "") return "";

          if (input.includes(".") && (input.match(/\./g) || []).length === 2) {
            input = input.replaceAll(".", ":")
          }
          if (input.includes(".")) {
            input = input.replaceAll(".", ":")
          }
          if (input.includes(",")) {
            input = input.replaceAll(",", ":")
          }

          let result = 0;
          let arr;
          try {
            if (input.includes("-")) throw new Error("hifen not allowed");
            let num = Number(input);
            if (id.includes("testBowl")) {
              if (!isNaN(num)) {
                // return direto
                return Math.floor(num);
              } else {
                throw new Error("testbowl invalid number");
              }
            }
            if (!input.includes(":")) {
              if (input.length === 4 && !isNaN(num)) {
                input = `${input[0]}${input[1]}:${input[2]}${input[3]}`
              } else if (input.length === 6 && !isNaN(num)) {
                input = `${input[0]}${input[1]}:${input[2]}${input[3]}:${input[4]}${input[5]}`
              } else if (input.length === 5 && !isNaN(num)) {
                input = `0${input[0]}:${input[1]}${input[2]}:${input[3]}${input[4]}`
              } else if (input.length === 3 && !isNaN(num)) {
                input = `0${input[0]}:${input[1]}${input[2]}`
              } else {
                throw new Error("no ':'");
              }
            }
            arr = input.split(":");
            arr.reverse();
            if (arr.includes("")) throw new Error("includes empty string");
            if (arr[0].length === 1) {
              arr[0] = `${arr[0]}0`;
            }
            arr = arr.map(x => Number(x));
            arr.map(x => {
              if (isNaN(x)) throw new Error("includes NaN");
            });
            if (typeof arr[0] === 'number' && arr[0] <= 99) {
              result = Vue.options.filters.clearNumber(result + arr[0]*0.01);
            } else if (arr[0] !== undefined) {
              throw new Error("0: not number or bigger than 99")
            }
            if (typeof arr[1] === 'number' && arr[1] <= 59) {
              result = Vue.options.filters.clearNumber(result + arr[1]);
            } else if (arr[1] !== undefined) {
              throw new Error("1: not number or bigger than 59")
            }
            if (typeof arr[2] === 'number' && arr[2] <= 59) {
              result = Vue.options.filters.clearNumber(result + arr[2]*60);
            } else if (arr[2] !== undefined) {
              throw new Error("2: not number or bigger than 59") 
            }

          } catch (error) {
            console.log("toTimeNumber", error);
            console.log("arr", arr);
            return false;      
          }
          return result;
        };
        Vue.clearNumber = function(input) {
          return Number((input).toFixed(2));
        };
        
        Vue.resolveStat = function (car, type, customData = null, selectedTune) {
            if (selectedTune && car === Vue.all_carsObj[car.rid] && selectedTune !== "000") {
              if (selectedTune.startsWith("Other")) {
                return "?";
              }
              return cacheCars[car.rid]?.data?.[selectedTune]?.info?.[type]?.t || "-";
            }
            if (car.selectedTune === null || car.selectedTune === undefined || car.selectedTune === "000") {
                if (type === "acel" && typeof car[type] === 'number') return car[type].toFixed(1);
                return car[type] || "-";
            }
            if (car.selectedTune && car.selectedTune.includes("Other")) {
                return "?";
            }
            if (typeof car.selectedTune !== 'string') return "err";

            if (customData) {
                return customData?.data?.[car.selectedTune]?.info?.[type]?.t || "-";
                // try {
                //     if (!customData.data[car.selectedTune].info[type].t) return "-";
                //     return customData.data[car.selectedTune].info[type].t;
                // } catch (error) {
                //     return "-";
                // }
            } else {
                return car?.data?.[car.selectedTune]?.info?.[type]?.t || "-";
                // try {
                //     if (!car.data[car.selectedTune].info[type].t) return "-";
                //     return car.data[car.selectedTune].info[type].t;
                // } catch (error) {
                //     return "-";
                // }
            }
            
        };
        Vue.boldTunes = function (tune) {
            if (typeof tune !== 'string' && tune.length !== 3) return tune;

            return tune.replaceAll('2', '<s>2</s>')
        };
        Vue.convertTires = function (tyre) {
            if (tyre === "Performance") return "PER";
            else if (tyre === "Standard") return "STD";
            else if (tyre === "All-surface") return "ALL";
            else if (tyre === "Off-road") return "OFF";
            else if (tyre === "Slick") return "SLK";
        };
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
        };
        Vue.brake = function (timeWithBrake, time) {
            
            if ( time && typeof time === 'number' && timeWithBrake && timeWithBrake > time ) {
                return (timeWithBrake - time).toFixed(2)
            } else {
                return ''
            }
        };
        Vue.cellSub = function (item, car, tun) {
            if (!item.text || typeof item.text !== 'number') return;
            if (!item.trackCode) return;

            if (item.trackCode === "drag100_a00") return Vue.mra(item.text, car?.data?.[tun]?.info?.acel?.t);
            if (item.trackCode === "drag150_a00") return Vue.mra(item.text, car?.data?.[tun]?.times?.drag100_a00?.t);
            if (item.trackCode === "drag170_a00") return Vue.mra(item.text, car?.data?.[tun]?.times?.drag150_a00?.t, 25);

            if (item.trackCode === "drag100b_a00") return Vue.brake(item.text, car?.data?.[tun]?.times?.drag100_a00?.t);
            if (item.trackCode === "drag100b_a01") return Vue.brake(item.text, car?.data?.[tun]?.times?.drag100_a01?.t);
            if (item.trackCode === "drag100b_a10") return Vue.brake(item.text, car?.data?.[tun]?.times?.drag100_a10?.t);
            if (item.trackCode === "drag150b_a00") return Vue.brake(item.text, car?.data?.[tun]?.times?.drag150_a00?.t);

            if (
                car.clearance === 'Low' &&
                (
                    item.id === 'csSmall' ||
                    item.id === 'dockCity' ||
                    item.id === 'csMed' ||
                    item.id === 'oceanCity' ||
                    item.id === 'speedbump12km' ||
                    item.id === 'speedbump1km' ||
                    item.id === 'desertHill' ||
                    item.id === 'miStreets2'||
                    item.id === 'itBump' ||
                    item.id === 'dsTnFreeway' ||
                    item.id === 'dsTnLove' ||
                    item.id === 'dsTnMile2bump'
                )
            ) {
                return window.i18n.t(`c_${car.clearance.toLowerCase()}`).toLowerCase();
            }

            if (
                (
                    car.clearance === 'Low' ||
                    car.clearance === 'Mid'
                ) &&
                (
                    item.id === 'moto' ||
                    item.id === 'desertRallyDirt'
                )
            ) {
                return window.i18n.t(`c_${car.clearance.toLowerCase()}`).toLowerCase();
            }

        };
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
        };
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
        };
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
            if (version === "26") arr = await import('../database/cars_final_PL26.json');

            arr = arr.default;
            
            car = arr.find(x => x.rid === rid);

            if (car) {
                return car;
            } else {
                return {}
            }
        };
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
        };
        Vue.isMobile = function () {
            return 'ontouchstart' in window || navigator.msMaxTouchPoints;
        };
        Vue.carPhoto = carPhoto;
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
            if (trackCode === "miBeachDrag_a51") factor = 1000;
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
            
        };
        Vue.timer = function (timeSeconds) {
            if (typeof timeSeconds !== "number") return "";

            let result = "";
            var hrs = Math.floor(timeSeconds / 3600); // hours
            let mins = Math.floor((timeSeconds % 3600) / 60); // minutes
            // var timeDays = Math.floor(timeMs / 86400000); // days

            // console.log(timeMs, timeDays, timeHrs, mins, timeSeconds);

            // if (timeDays) result += `${timeDays}d `;
            // if (timeHrs) result += `${timeHrs}h `;
            // if (mins && !timeDays) result += `${mins}m `;
            // if (timeSeconds && !timeDays && !timeHrs) result += `${timeSeconds}s `;

            if (hrs > 0) result += `${hrs}h `;
            if (mins > 0) result += `${mins}m `;
            if (hrs === 0 && mins < 5) {
                let secs = timeSeconds % 60;
                result += `${secs}s `;
            }

            return result;
        };
        Vue.timeDiffString = function (date, laterDate) {
            let result = "";

            var diffMs = (laterDate - date); // milliseconds between now & Date2
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
            var diffSeconds = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000); // seconds

            if (diffDays) result += `${diffDays}d `;
            if (diffHrs) result += `${diffHrs}h `;
            if (diffMins && !diffDays) result += `${diffMins}m `;
            if (diffSeconds && diffMins < 5 && !diffDays && !diffHrs) result += `${diffSeconds}s `;

            return {
                diffDays,
                diffMs,
                diffHrs,
                diffMins,
                result
            };
        };
        Vue.trackToPerc = function (trackCode, index=0, skipAsphalt=true, isCode=false) {
            if (!tracksPerc[trackCode]) return '';
            let curr = 0;
            for (let X = 0; X < tracksPerc[trackCode].length; X++) {
                if (
                    skipAsphalt &&
                    (
                        tracksPerc[trackCode][X][0] === "00" ||
                        (tracksPerc[trackCode][X][0] === "01" && trackCode !== "figureEight_a01") ||
                        tracksPerc[trackCode][X][1] === 1
                    )
                ) {
                    continue;
                }
                if (index === curr) {
                    if (!isCode) return `${tracksPerc[trackCode][X][1]}%`;
                    if (isCode) return `${tracksPerc[trackCode][X][0]}`;
                    break;
                }
                curr++;
                continue;
            }
            return '';
        };
        Vue.toggleIgnore50points = function () {
            ignore50points = !ignore50points;
        };
        Vue.resolveHighlightsUsers = function (resData) {
            let highlightsUsers = {
              "bcp_": 'mod',
              "TiagoXavi": 'mod',
              "Bigredmachine": 'mod',
              "duck": 'mod',
              "HansKasai": 'mod',
              "fiero": 'mod',
              "L1ZVRD": 'mod',
            //   "intrx": 'mod',
              "rei348": 'mod',
              "Enginn": 'mod',
              "vel_8": 'mod',
              "Ansami_MH": 'mod',
              "RenMasamune": 'mod',
              "boliveira82": 'mod',
              "ELtotheLIS": 'mod',
              "CapSora": 'mod',
            //   "Mattsy": 'mod',
              "Skapis": 'mod',
              "Draugr": 'mod',
              "TopDrives": 'mod',
              "Asaneon": 'mod',
              "Dennis": 'mod',
              "MichaelB": 'mod',
              "Leafclaw": 'mod',
              "biava": 'mod',
              "artkatt": 'mod',
              "Chachisco": 'mod'
            };
            let pUsers = resData.find(x => x.id === 'pUsers').value;
            Object.keys( pUsers ).forEach(key => {
              if (key.includes("tier")) {
                pUsers[key].map(user => {
                  Vue.set(highlightsUsers, user, Number(key.slice(-1)));
                  highlightsUsers[user] = Number(key.slice(-1));
                });
              }
              if (key === "giveaway") {
                pUsers[key].map(user => {
                  Vue.utils.giveawayUsers.push(user);
                });
              }
            })
            highlightsUsers["AnalyzeThat"] = "w1";
            highlightsUsers["Sleeperzz"] = "w2";
            highlightsUsers["AF11"] = "w3";

            return highlightsUsers;
        };
        Vue.timeCell = function (rid, tune, track, key="times") {
            if (!rid) return "!rid";
            if (
              !cacheCars[rid] ||
              (
                !cacheCars[rid].isDownloaded &&
                (
                  !cacheCars[rid].data ||
                  !cacheCars[rid].data[tune] ||
                  !cacheCars[rid].data[tune][key] ||
                  !cacheCars[rid].data[tune][key][track]
                )
              )
            ) {
              ridsToDownload.push(rid);
              return "!data";
            }
            if (!tune) return "!tune";
            if (!track) return "!track";
            

            if (
              !cacheCars[rid].data ||
              !cacheCars[rid].data[tune] ||
              !cacheCars[rid].data[tune][key] ||
              !cacheCars[rid].data[tune][key][track]
            ) return "!time";

            return cacheCars[rid].data[tune][key][track];
        };
        Vue.importDumbTimesFromCg = function (cg) {
          if (!cg && !cg.rounds) return;
          let tunes = ["332", "323", "233"];
          cg.rounds.map(round => {
            round.races.map(race => {
              if (!(race.time ?? false)) return;
              if (Vue.isRidDownloaded(race.rid)) return;
              // if (race.time ?? false) {
              // }
              let isDumb = true;
              let isAS = resolvedRids[race.rid]?.rq > 79;
              if (tunes.includes(race.tune)) isDumb = false;
              if (isAS && race.tune === "111") isDumb = false;
              if (!isDumb) return;

  
              if (!cacheCars[race.rid]) cacheCars[race.rid] = { rid: race.rid };
              if (!cacheCars[race.rid].data) cacheCars[race.rid].data = {};
              if (!cacheCars[race.rid].data[race.tune]) cacheCars[race.rid].data[race.tune] = {};
              if (!cacheCars[race.rid].data[race.tune].times) cacheCars[race.rid].data[race.tune].times = {};
              cacheCars[race.rid].data[race.tune].times[race.track] = {
                t: race.time,
                isDumb: true
              }
            })
          })
          // console.log("importDumbTimesFromCg", cacheCars);

        };
        Vue.isRidDownloaded = function (rid) {
          if (!cacheCars[rid]) return false;
          if (cacheCars[rid].isDownloaded) return true;
          return false;
        };
        Vue.cyrb53 = function (str, seed = 0) {
          let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
          for(let i = 0, ch; i < str.length; i++) {
              ch = str.charCodeAt(i);
              h1 = Math.imul(h1 ^ ch, 2654435761);
              h2 = Math.imul(h2 ^ ch, 1597334677);
          }
          h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
          h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
          h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
          h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

          return 4294967296 * (2097151 & h2) + (h1 >>> 0);
        };


        Vue.filter('toTimeString', Vue.toTimeString);
        Vue.filter('toTimeStringTrCode', Vue.toTimeStringTrCode);
        Vue.filter('toTimeNumber', Vue.toTimeNumber);
        Vue.filter('clearNumber', Vue.clearNumber);
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
        Vue.filter('timer', Vue.timer);
        Vue.filter('timeDiffString', Vue.timeDiffString);
        Vue.filter('trackToPerc', Vue.trackToPerc);
        Vue.filter('timeCell', Vue.timeCell);
        Vue.filter('cellSub', Vue.cellSub);
    }
};





function handleResize() {
    utils.windowWidth = window.innerWidth;
    let vw = document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    let vh = document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
function handleKeyDown(e) {
    if (e.altKey) {
        utils.altKey = true;
        e.preventDefault();
    }
}
function handleKeyUp(e) {
    if (!e.altKey) {
        utils.altKey = false;
    }
}

handleResize();
window.addEventListener('resize', handleResize);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);