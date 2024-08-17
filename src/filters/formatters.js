export function toTimeString(input, id) {
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
}
export function toTimeNumber(input, id = "") {
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
}
export function clearNumber(input) {
  return Number((input).toFixed(2));
}