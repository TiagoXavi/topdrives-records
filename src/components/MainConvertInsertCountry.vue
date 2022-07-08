<template>
  <div class="MainConvertCsv_Layout">
    <div class="MainConvertCsv_Body">
      <div class="MainConvertCsv_Input">
        Merge
      </div>
    </div>
  </div>
</template>

<script>
import cars_td from '../database/cars_td.json'
import cars_full from '../database/cars_full.json'

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
      cars_td,
      cars_full
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let temp;
    let temp2 = null;

    this.cars_td.map(x => {
      if (!x.name) {
        x.name = `${x.brand} ${x.onlyName}`
      }
      
      if (!x.country) {

        temp2 = null;
  
        temp = this.cars_full.filter(y => {
          let Y = y.name.toLowerCase()
            .replaceAll("é","e")
            .replaceAll("gumpert","apollo")
            .replaceAll("renault sport","renault")
            .replaceAll("mercedes-benz amg","mercedes-benz")
            .replaceAll("groupe","group")
            .replaceAll("ë","e")
            .replaceAll("land rover range rover","land rover")
            .replaceAll("mclaren mercedes-benz","mclaren")
            .replaceAll("-"," ")
            .replaceAll("vauxhall/opel","ggg")
            .replaceAll("vauxhall opel","ggg")
            .replaceAll("opel","ggg")
            .replaceAll("vauxhall","ggg")
            .replaceAll("fiat abarth","fff")
            .replaceAll("fiat","fff")
            .replaceAll("abarth","fff")
            .replaceAll("supersport","super sport")
            .replaceAll("ram ram","ram")
            .trim();
          let X = x.name.toLowerCase()
            .replaceAll("é","e")
            .replaceAll("gumpert","apollo")
            .replaceAll("renault sport","renault")
            .replaceAll("mercedes-benz amg","mercedes-benz")
            .replaceAll("groupe","group")
            .replaceAll("ë","e")
            .replaceAll("land rover range rover","land rover")
            .replaceAll("mclaren mercedes-benz","mclaren")
            .replaceAll("-"," ")
            .replaceAll("vauxhall/opel","ggg")
            .replaceAll("vauxhall opel","ggg")
            .replaceAll("opel","ggg")
            .replaceAll("vauxhall","ggg")
            .replaceAll("fiat abarth","fff")
            .replaceAll("fiat","fff")
            .replaceAll("abarth","fff")
            .replaceAll("supersport","super sport")
            .replaceAll("ram ram","ram")
            .trim();
          
          if (x.name === 'Mercedes-Benz AMG SLS GT3' && y.name === 'Mercedes-Benz SLS GT3') {
            return true;
          }
          if (x.name === 'Porsche Cayenne GTS' && y.name === 'Porsche Cayenne GTS') {
            return true;
          }
          if (x.name === 'MG Metro 6R4 Clubman' && y.name === "MG Metro 6R4") {
            return true;
          }
          if (x.name === 'Lamborghini Miura SV/J' && y.name === "Lamborghini Miura SV/J") {
            return true;
          }
          if (x.name === "Scuderia Cameron Glickenhaus SCG003S" && y.name === "Scuderia Cameron SCG003S") {
            return true;
          }
          if (x.name === "McLaren P1" && y.name === "McLaren P1 ") {
            return true;
          }
          if (x.name === 'Lamborghini Gallardo LP 570-4 Edizione Tecnica' && y.name === "Lamborghini Gallardo LP570-4 Edizione Tecnica") {
            return true;
          }
          if (x.name === 'Volvo XC40 T5' && y.name === "Volvo XC40 T5 AWD") {
            return true;
          }
          if (x.name === "Chevrolet Camaro ZL1" && y.name === "Chevrolet Camaro ZL1") {
            return true;
          }
          if (x.name === "Ford Mustang GT Power Pack" && y.name === "Ford Mustang GT Power & Perf. Pack") {
            return true;
          }
          
          return Y === X && y.year === x.year;
        });
  
        if (temp.length === 1) {
          temp = temp[0]
        } else {
          temp2 = temp.find(y => y.year === x.year);
          if (!temp2) {
            console.log(x.year);
            console.log(x.name);
            debugger
          } else {
            temp = temp2;
          }
        }
  
        if (!temp || !temp.name) {
          // de para
          console.log(x.year);
          console.log(x.name);
          debugger;
        }
        x.country = temp.country;
        x.tyres = temp.tyres;

        // fim country
      };
    })

    navigator.clipboard.writeText(JSON.stringify(this.cars_td));
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