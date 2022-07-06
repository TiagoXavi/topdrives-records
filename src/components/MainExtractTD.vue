<template>
  <!-- <div class="MainConvertCsv_Layout">
    <div class="MainConvertCsv_Body">
      <div class="MainConvertCsv_Input">
        <input type="file" id="input-file" @change="getFile($event)">
      </div>
      <div id="content-target">{{ linhas ? `${linhas} copiadas` : '' }}</div>
    </div>
  </div> -->
  <div class="MainExtractTD_"></div>
</template>

<script>
// import BaseDetalheHeader from '@/components/shared/BaseDetalheHeader/BaseDetalheHeader.vue';

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
      linhas: null
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {
    let result = [];
    let temp = document.querySelector(".js-vehicles-container").childNodes.forEach(x => {
      result.push({
        "class": x.childNodes[0].childNodes[0].innerText.toUpperCase(),
        "photo": x.childNodes[1].childNodes[0].childNodes[0].attributes['sss'].value.substr(41),
        "rq": Number(x.childNodes[0].childNodes[1].innerText),
        "onlyName": x.childNodes[1].childNodes[2].firstChild.wholeText.trim(),
        "brand": x.childNodes[1].childNodes[1].innerText.substr(1,x.childNodes[1].childNodes[1].innerText.indexOf(" /")-1),
        "tune": null,
        "year": Number(x.childNodes[1].childNodes[2].childNodes[1].innerText),
        "tdid": x.attributes['data-item'].value,
        "abs": x.childNodes[1].childNodes[1].childNodes[2].classList[1] === 'active',
        "tcs": x.childNodes[1].childNodes[1].childNodes[3].classList[1] === 'active',
        "clearance": x.childNodes[1].childNodes[1].childNodes[4].innerText,
        "keeper": Number(x.childNodes[1].childNodes[1].childNodes[5].innerText.substr(8, x.childNodes[1].childNodes[1].childNodes[5].innerText.length-9)),
        "country": "FR",
        "topSpeed": Number(x.childNodes[2].childNodes[1].wholeText.trim()),
        "acel": Number(x.childNodes[3].childNodes[1].wholeText.trim()),
        "hand": Number(x.childNodes[4].childNodes[1].wholeText.trim()),
        "drive": x.childNodes[6].childNodes[1].wholeText.trim().toUpperCase(),
        "stars": 0,
        "tyres": x.childNodes[5].childNodes[1].wholeText.trim(),
        "mra": Number(x.childNodes[8].childNodes[1].innerText),
        "weight": Number(x.childNodes[7].childNodes[1].wholeText.trim()),
      })
    })
    navigator.clipboard.writeText(JSON.stringify(result));
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