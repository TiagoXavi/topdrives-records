const filters = {
  toTimeString(input) {
    if (input == 0) return "DNF";
    if (input === null || input === undefined) return "-";
    if (isNaN(input)) return input;

    var sec_num = parseInt(input, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;
    var milesi = parseInt((input - parseInt(input)) * 100);

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
  },
  toTimeNumber(input) {
    let result = 0;
    let arr;
    try {
      if (!input.includes(":")) throw new Error("no ':'");
      arr = input.split(":");
      arr.reverse();
      if (arr.includes("")) throw new Error("includes empty string");
      arr = arr.map(x => Number(x));
      arr.map(x => {
        if (isNaN(x)) throw new Error("includes NaN");
      });
      if (typeof arr[0] === 'number' && arr[0] <= 99) {
        result = this.clearNumber(result + arr[0]*0.01);
      }
      if (typeof arr[1] === 'number' && arr[1] <= 59) {
        result = this.clearNumber(result + arr[1]);
      }
      if (typeof arr[2] === 'number' && arr[2] <= 59) {
        result = this.clearNumber(result + arr[2]*60);
      }    
      
    } catch (error) {
      console.log("toTimeNumber", error);
      console.log("arr", arr);
      return false;      
    }
    return result;
  },
  clearNumber(input) {
    return Number((input).toPrecision(12));
  }
}
export default filters;