<template>
  <div class="MainExtractTD_">
  </div>
</template>

<script>
import data_cars from '../database/cars_final.json'

export default {
  name: 'MainConvertCsv',
  components: {
    // BaseDetalheHeader
  },
  props: {
    test: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      linhas: null,
      data_cars
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let result = [];

    // let temp = document.querySelector("").childNodes.forEach(x => {
    //   if (Number.isNaN( Number(x.childNodes[8].childNodes[1].innerText) )) {
    //     return;
    //   }
    //   result.push({
    //     "class": x.childNodes[0].childNodes[0].innerText.toUpperCase(),
    //     "rq": Number(x.childNodes[0].childNodes[1].innerText),
    //     "onlyName": x.childNodes[1].childNodes[2].firstChild.wholeText.trim(),
    //     "brand": x.childNodes[1].childNodes[1].innerText.substr(0,x.childNodes[1].childNodes[1].innerText.indexOf(" /")),
    //     "year": Number(x.childNodes[1].childNodes[2].childNodes[1].innerText),
    //     "tdid": x.attributes['data-item'].value,
    //     "abs": x.childNodes[1].childNodes[1].childNodes[2].classList[1] === 'active',
    //     "tcs": x.childNodes[1].childNodes[1].childNodes[3].classList[1] === 'active',
    //     "clearance": x.childNodes[1].childNodes[1].childNodes[4].innerText,
    //     "country": "XXX",
    //     "topSpeed": Number(x.childNodes[2].childNodes[1].wholeText.trim()),
    //     "acel": Number(x.childNodes[3].childNodes[1].wholeText.trim()),
    //     "hand": Number(x.childNodes[4].childNodes[1].wholeText.trim()),
    //     "drive": x.childNodes[6].childNodes[1].wholeText.trim().toUpperCase(),
    //     "tyres": x.childNodes[5].childNodes[1].wholeText.trim(),
    //     "mra": Number(x.childNodes[8].childNodes[1].innerText),
    //     "weight": Number(x.childNodes[7].childNodes[1].wholeText.trim()),
    //   })
    // })

    // this.data_cars.map(x => {
    //   result.find(y => {
    //     if (x.tdid === y.tdid) {
    //       if (x.mra === null) {
    //         x.mra = y.mra;
    //       } else if (x.mra !== y.mra) {
    //         console.log(x.rid, x.mra, y.mra);
    //       }
    //       return true;
    //     }
    //   })
    // })

    // document.querySelectorAll(".country").forEach(x => {
    //   let ct = {
    //     name: `${x.children[0].children[0].innerText} ${x.children[0].children[1].innerText}`,
    //     matches: []
    //   }
    //   x.querySelectorAll(".match-races").forEach((y, iy) => {
    //     let race = {
    //       number: iy + 1,
    //       races: []
    //     }
    //     y.querySelectorAll(".race").forEach((z, iz) => {
    //       let track = {
    //         number: iz + 1,
    //         name: z.children[0].innerHTML
    //       }

    //       let surface = z.children[1].innerHTML;
    //       if (surface === "asphalt") track.surface = "0";
    //       if (surface === "dirt") track.surface = "1";
    //       if (surface === "gravel") track.surface = "2";
    //       if (surface === "ice") track.surface = "3";
    //       if (surface === "mixed") track.surface = "4";
    //       if (surface === "sand") track.surface = "5";
    //       if (surface === "snow") track.surface = "6";
    //       if (surface === "grass") track.surface = "7";

    //       let weatherDiv = z.querySelector(".race-weather");
    //       if (weatherDiv.className.includes("sun")) track.weather = "0";
    //       if (weatherDiv.className.includes("rain")) track.weather = "1";

    //       let startDiv = z.querySelector(".race-start");
    //       track.rolling = startDiv.className.includes("_fast");
          
    //       race.races.push(track);
    //     })
    //     ct.matches.push(race)
    //   })
    //   result.push(ct);
    // })

    navigator.clipboard.writeText(JSON.stringify(this.data_cars));
    debugger;
  },
  computed: {},
  methods: {
    getFile(event) {
      const input = event.target
      if ('files' in input && input.files.length > 0) {
        this.placeFileContent(document.getElementById('content-target'), input.files[0]);
      }
    },
    placeFileContent(target, file) {
      this.readFileContent(file)
        .then(content => {
          target.value = content
        })
        .catch(error => console.log(error))
    },
    readFileContent(file) {
      let vm = this;
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = event => {
          let arr = event.target.result.split("\r\n");
          arr = arr.map(x => {
            return x.split("\t")
          })
          arr = arr.map(x => {
            return x.filter((y, iy) => {
              return iy < 16
            })
          })

          // console.log(arr);
          arr.shift();

          // arr = arr.map(x => {
          //   return {
          //     "name": `${x[0]} ${x[1]}`,
          //     "rq": Number(x[2]),
          //     "year": Number(x[10])
          //   }
          // })
          let temp;
          let specials = [
            "Mitsubishi Lancer EVO VIII FQ-400",
            "Audi RS 6 Avant (delimited)",
            "Chevrolet Camaro ZL1 1LE",
            "Renault Mégane Trophy",
            "Audi RS 7 Sportback",
            "Audi S8 Plus",
            "Caterham Superlight R500",
          ]
          let countrys = [];


          arr = arr.map(x => {
            temp = {
              "name": `${x[0]} ${x[1]}`,
              "photo": null,
              "rq": Number(x[2]),
              "tune": null,
              "year": Number(x[10]),
              "country": x[15],
              "topSpeed": Number(x[5]),
              "acel": Number(x[6].replaceAll(",",".")),
              "hand": Number(x[7]),
              "drive": x[11],
              "stars": 0,
              "tyres": x[9],

              "mra": Number(x[3].replaceAll(",",".").replaceAll(" ","")),
              "clearance": x[12],
              "body1": x[13],
              "body2": x[14],
              "weight": x[8],
            }
            if (specials.includes(temp.name)) {
              temp.class = "A";
            }
            temp.class = Vue.resolveClass(temp.rq, temp.class, "letter");
            temp.classColor = Vue.resolveClass(temp.rq, temp.class, "color");
            temp.country = Vue.resolveCountry(temp.country);
            // if (!countrys.includes(temp.country)) countrys.push(temp.country);

            return temp;
          })
          navigator.clipboard.writeText(JSON.stringify(arr));
          vm.linhas = arr.length;

          // console.log(countrys);
          console.log(arr);
        }
        reader.onerror = error => reject(error)
        reader.readAsText(file);
      })
    },
  },
}
</script>

<style>
.MainConvertCsv_Layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.MainConvertCsv_Body {
  display: flex;
  flex-direction: column;
}
.MainConvertCsv_Button {
  background-color: rgba(var(--back-color), var(--back-opac));
  padding: 30px;
  color: white;
  font-size: 20px;
}
.MainConvertCsv_Input {
  padding: 50px 0;
}
#content-target {
  box-shadow: 0px 0px 0px 2px #424242;
  border-radius: 5px;
  min-height: 100px;
  min-width: 100px;
  margin-bottom: 100px;
}
</style>