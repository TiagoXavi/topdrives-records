<template>
  <div class="MainUpdateRqData_Layout">
    <div class="MainUpdateRqData_Body">
      <div class="MainUpdateRqData_Input">
        Merge
      </div>
    </div>
  </div>
</template>

<script>
import cars_final from '../database/cars_final.json'
import cars_new_rq from '../database/cars_new_rq.json'

export default {
  name: 'MainUpdateRqData',
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
      cars_final,
      cars_new_rq
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let temp;
    let temp2;
    let xName;
    let yModel;

    this.cars_final.sort((a, b) => b.rq - a.rq)

    navigator.clipboard.writeText(JSON.stringify(this.cars_final));
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
.MainUpdateRqData_Layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.MainUpdateRqData_Body {
  display: flex;
  flex-direction: column;
}
.MainUpdateRqData_Button {
  background-color: rgba(var(--back-color), var(--back-opac));
  padding: 30px;
  color: white;
  font-size: 20px;
}
.MainUpdateRqData_Input {
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