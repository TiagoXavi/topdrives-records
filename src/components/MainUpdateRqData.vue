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
import cars_final from '../database/cars_final.json' // internal TEMP
import cars_new_rq from '../database/cars_new_rq_24_2.json'

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
    let oldStr = "24.1";
    let newStr = "24.2";
    let modelStr = "Name";
    let brandMondelTogether = true;
    let yearInParentesis = true;





    // old
    {
      // this.cars_final.map(x => {
      //   let xName = x.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
  
      //   temp = this.cars_new_rq.filter(y => {
      //     let yModel = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
      //     // if (yModel.includes(xName) && yModel.substr(yModel.length-5, 4) == x.year) {
      //     if (yModel.includes(xName) && yModel.substr(yModel.length-5, 4) == x.year && y['Old RQ'] === x.rq) {
      //       return true
      //     }
      //   });
  
      //   if (temp && temp.length === 1) {
      //     // OK
  
      //     if (x.rq === temp[0]["Old RQ"]) {
      //       // OK
      //       x.rq = temp[0]["New RQ"];
      //       x.class = Vue.resolveClass(x.rq, null, "letter")
      //     } else {
      //       console.log("Old RQ diferente", x);
      //       debugger;
      //     }
  
      //   } else if (temp && temp.length > 1) {
      //     // achou 2
      //     console.log("achou 2", x);
      //     debugger;
      //   } else if (temp.length === 0) {
      //     // achou nada
      //     console.log("achou nada", x);
      //     debugger;
      //   }
      // })
    }







    // 22.0
    // {
    //   "Make": "Ginetta",
    //   "Model": "G56 GT4 Supercup",
    //   "Year": 2021,
    //   "19.0 RQ": 105,
    //   "19.1 RQ": 91,
    //   "RQ Change": -14
    // },
    {
      // let notFound = [];
  
      // this.cars_new_rq.map(y => {
      //   // let yModel = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
      //   // if (y.Model === '2016 Vauxhall/Opel Adam R2') {
      //   //   debugger;
      //   // }
      //   if (typeof y.Model === "number") y.Model = `${y.Model}`;
      //   if (y.Make === "Citroën") y.Make = "Citroen";
      //   if (y.Make === "Škoda") y.Make = "Skoda";
      //   if (y.Make === "Vauxhall/Opel") y.Make = "Vauxhall";
      //   if (y.Make === "Scuderia Cameron Glickenhaus") y.Make = "SCG";
      //   if (y.Make === "Automobili Pininfarina") y.Make = "Pininfarina";

      //   let yModelName = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "").replace(/[™‘’']/g, '');
      //   // let yModelYear = yModel.substr(0, 4);
      //   // yModelName = yModelName.replace("vauxhall/opel ", "");
      //   // yModelName = yModelName.replace("fiat ", "");
      //   // yModelName = yModelName.replace("abarth ", "");
  
      //   temp = this.cars_final.filter(x => {
      //     let xModelName = x.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "").replace(/[™‘’']/g, '');
      //     // xName = xName.replace("vauxhall opel ", "");
      //     // xName = xName.replace("vauxhall ", "");
      //     // xName = xName.replace("fiat ", "");
      //     // xName = xName.replace("abarth ", "");

      //     // if (xModelName.includes(yModelName)) {
      //     //   debugger;
      //     // }
          
      //     // if (xModelName.includes(yModelName) && y.Make.toUpperCase() === x.brand.toUpperCase() && y.Year == x.year && (y[oldStr] === x.rq || y[newStr] === x.rq)) {
      //     //   return true
      //     // }
      //     if (xModelName.includes(yModelName) && y.Make.toUpperCase() === x.brand.toUpperCase() && y.Year == x.year) {
      //       return true
      //     }
      //   });
  
      //   if (temp && temp.length > 1) {
      //     let achouExato = -1;
      //     temp.map((x, index) => {
      //       let xModelName = x.onlyName.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      //       if (xModelName === yModelName) {
      //         achouExato = index;
      //       }
      //     })
      //     if (achouExato > -1) {
      //       temp = temp.filter((x, index) => index === achouExato);
      //     }
      //   }
  
      //   if (temp && temp.length === 1) {
      //     // OK
  
      //     if (temp[0].rq === y[oldStr] || temp[0].rq === y[newStr]) {
      //       // OK
      //       temp[0].rq = y[newStr];
      //       temp[0].class = Vue.resolveClass(temp[0].rq, null, "letter")
      //     } else {
      //       // console.log(`${oldStr} diferente`, temp[0]);
      //       // debugger;
      //       {
      //         // Hutch dont now old RQ
      //         // OK
      //         // console.log(`${oldStr} diferente`, temp[0].rid);
      //         temp[0].rq = y[newStr];
      //         temp[0].class = Vue.resolveClass(temp[0].rq, null, "letter")
      //       }
      //     }
  
      //   } else if (temp && temp.length > 1) {
      //     // achou 2
      //     console.log("achou 2", y.Model, `${y[oldStr]} > ${y[newStr]}`, temp);
      //     // debugger;
      //   } else if (temp.length === 0) {
      //     // achou nada
      //     console.log("achou nada", y.Model, `${y[oldStr]} > ${y[newStr]}`);
      //     // debugger;
      //     // notFound.push(y.Model);
      //   }
      // })
    }






    // v20.0
    // {
    //   "Make": "Abarth",
    //   "Model": "1000 Monoposto record car",
    //   "19.3 RQ": 22,
    //   "20.0 RQ": 21,
    //   "RQ Change": -1
    // },
    {
      // let notFound = [];

      // this.cars_new_rq.map(y => {
      //   // let yModel = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
      //   // if (y.Model === '2016 Vauxhall/Opel Adam R2') {
      //   //   debugger;
      //   // }
      //   y.Model = `${y.Model}`; // force string
        
      //   if (y.Make === "Vauxhall/Opel") y.Make = "Vauxhall";
      //   let yModelName = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      //   // let yModelYear = yModel.substr(0, 4);
      //   // yModelName = yModelName.replace("vauxhall/opel ", "");
      //   // yModelName = yModelName.replace("fiat ", "");
      //   // yModelName = yModelName.replace("abarth ", "");

      //   temp = this.cars_final.filter(x => {
      //     let xModelName = x.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      //     // xName = xName.replace("vauxhall opel ", "");
      //     // xName = xName.replace("vauxhall ", "");
      //     // xName = xName.replace("fiat ", "");
      //     // xName = xName.replace("abarth ", "");
          
      //     if (xModelName.includes(yModelName) && y.Make.toUpperCase === x.brand.toUpperCase && (y[oldStr] === x.rq || y[newStr] === x.rq)) {
      //       return true
      //     }
      //   });

      //   if (temp && temp.length > 1) {
      //     let achouExato = -1;
      //     temp.map((x, index) => {
      //       let xModelName = x.onlyName.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
      //       if (xModelName === yModelName) {
      //         achouExato = index;
      //       }
      //     })
      //     if (achouExato > -1) {
      //       temp = temp.filter((x, index) => index === achouExato);
      //     }
      //   }

      //   if (temp && temp.length === 1) {
      //     // OK

      //     if (temp[0].rq === y[oldStr] || temp[0].rq === y[newStr]) {
      //       // OK
      //       temp[0].rq = y[newStr];
      //       temp[0].class = Vue.resolveClass(temp[0].rq, null, "letter")
      //     } else {
      //       console.log(`${oldStr} diferente`, temp[0]);
      //       debugger;
      //     }

      //   } else if (temp && temp.length > 1) {
      //     // achou 2
      //     console.log("achou 2", y.Model, `${y[oldStr]} > ${y[newStr]}`, temp);
      //     // debugger;
      //   } else if (temp.length === 0) {
      //     // achou nada
      //     console.log("achou nada", y.Model, `${y[oldStr]} > ${y[newStr]}`);
      //     // debugger;
      //     // notFound.push(y.Model);
      //   }
      // })
    }


    // 23.0
    // {
    //   "Year": 1997,
    //   "Car": "AC Ace V8",
    //   "20.3 RQ": 45,
    //   "21.0 RQ": 44,
    //   "RQ Change": -1
    // },
    // {
    //   "Model": "McMurtry Spéirling Prototype - Goodwood Edition 22",
    //   "Year": 2022,
    //   "22.3": 116,
    //   "23.0": 119,
    //   "Diff": 3
    // },
    // {
    //   "Model": "Chrysler Town and Country (1990)",
    //   "23.2": 13,
    //   "24.0": 14,
    //   "Difference": 1
    // },
    // {
    //   let notFound = [];
  
    //   this.cars_new_rq.map(y => {
    //     // let yModel = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
    //     // if (y.Model === '2016 Vauxhall/Opel Adam R2') {
    //     //   debugger;
    //     // }
    //     // if (y.Make === "Vauxhall/Opel") y.Make = "Vauxhall";
    //     let yModelName = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
    //     // let yModelYear = yModel.substr(0, 4);
    //     yModelName = yModelName.replace("vauxhall/opel ", "");
    //     yModelName = yModelName.replace("fiat ", "");
    //     yModelName = yModelName.replace("abarth ", "");
    //     yModelName = yModelName.replace("apollo apollo ", "");
    //     yModelName = yModelName.replace("apollo ", "");
    //     yModelName = yModelName.replace("™", "");
    //     yModelName = yModelName.replace("mclaren slr mclaren ", "slr mclaren ");
    //     yModelName = yModelName.replace("mclaren slr mclaren", "slr mclaren");
    //     yModelName = yModelName.replace("‘", "'");
    //     yModelName = yModelName.replace("’", "'");
    //     yModelName = yModelName.replace("scuderia cameron glickenhaus ", "scg ");
    //     yModelName = yModelName.replace("datsun ", "");
    //     yModelName = yModelName.replace("amg ", "");
    //     yModelName = yModelName.replace("citroën ", "citroen ");
    //     yModelName = yModelName.replace("škoda ", "skoda ");
    //     yModelName = yModelName.replace("automobili pininfarina ", "pininfarina ");
  
    //     temp = this.cars_final.filter(x => {
    //       let xModelName = x.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
    //       xModelName = xModelName.replace("vauxhall opel ", "");
    //       xModelName = xModelName.replace("vauxhall ", "");
    //       xModelName = xModelName.replace("fiat ", "");
    //       xModelName = xModelName.replace("abarth ", "");
    //       xModelName = xModelName.replace("austin healey ", "austin ");
    //       xModelName = xModelName.replace("amg ", "");
    //       xModelName = xModelName.replace("datsun ", "");
    //       xModelName = xModelName.replace("gumpert ", "");
          
    //       if (xModelName.includes(yModelName) && y.Year == x.year && (y[oldStr] === x.rq || y[newStr] === x.rq)) {
    //         return true
    //       }
    //       if (yModelName === "peugeot 405 t16 dakar" && x.rid === "Peugeot_208_WRX_2018") {
    //         debugger;
    //       }
    //     });
  
    //     if (temp && temp.length > 1) {
    //       let achouExato = -1;
    //       temp.map((x, index) => {
    //         let xModelName = x.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
    //         if (xModelName === yModelName) {
    //           achouExato = index;
    //         }
    //       })
    //       if (achouExato > -1) {
    //         temp = temp.filter((x, index) => index === achouExato);
    //       }
    //     }
  
    //     if (temp && temp.length === 1) {
    //       // OK
  
    //       if (temp[0].rq === y[oldStr] || temp[0].rq === y[newStr]) {
    //         // OK
    //         temp[0].rq = y[newStr];
    //         // temp[0].class = Vue.resolveClass(temp[0].rq, null, "letter")
    //       } else {
    //         console.log(`${oldStr} diferente`, temp[0]);
    //         debugger;
    //       }
  
    //     } else if (temp && temp.length > 1) {
    //       // achou 2
    //       console.log("achou 2", yModelName, `${y[oldStr]} > ${y[newStr]}`, temp);
    //       // debugger;
    //     } else if (temp.length === 0) {
    //       // achou nada
    //       console.log("achou nada", yModelName, `${y[oldStr]} > ${y[newStr]}`);
    //       // debugger;
    //       // notFound.push(y.Model);
    //     }
    //   })
    // }





    // 24.0
    // {
    //   "Model": "Chrysler Town and Country (1990)",
    //   "23.2": 13,
    //   "24.0": 14,
    //   "Difference": 1
    // },
    {
      let notFound = [];

      this.cars_new_rq.map(y => {
        // let yModel = y.Model.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "")
        // if (y.Model === '2016 Vauxhall/Opel Adam R2') {
        //   debugger;
        // }
        // if (y.Make === "Vauxhall/Opel") y.Make = "Vauxhall";
        let yModelName = y[modelStr].trim().slice(0,-7).toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
        let yModelYear = y[modelStr].trim().slice(-5,-1);
        yModelName = yModelName.replace("vauxhall/opel ", "");
        // yModelName = yModelName.replace("fiat ", "");
        // yModelName = yModelName.replace("abarth ", "");
        // yModelName = yModelName.replace("apollo apollo ", "");
        // yModelName = yModelName.replace("apollo ", "");
        yModelName = yModelName.replace("™", "");
        yModelName = yModelName.replace("mclaren slr mclaren ", "slr mclaren ");
        yModelName = yModelName.replace("mclaren slr mclaren", "slr mclaren");
        yModelName = yModelName.replace("‘", "'");
        yModelName = yModelName.replace("’", "'");
        yModelName = yModelName.replace("scuderia cameron glickenhaus ", "scg ");
        // yModelName = yModelName.replace("datsun ", "");
        // yModelName = yModelName.replace("amg ", "");
        yModelName = yModelName.replace("citroën ", "citroen ");
        yModelName = yModelName.replace("škoda ", "skoda ");
        yModelName = yModelName.replace("automobili pininfarina ", "pininfarina ");

        temp = this.cars_final.filter(x => {
          let xModelName = `${x.brand} ${x.onlyName}`.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
          // xModelName = xModelName.replace("vauxhall opel ", "");
          // xModelName = xModelName.replace("vauxhall ", "");
          // xModelName = xModelName.replace("fiat ", "");
          // xModelName = xModelName.replace("abarth ", "");
          // xModelName = xModelName.replace("austin healey ", "austin ");
          // xModelName = xModelName.replace("amg ", "");
          // xModelName = xModelName.replace("datsun ", "");
          // xModelName = xModelName.replace("gumpert ", "");

          if (xModelName.includes(yModelName) && yModelYear == x.year && (y[oldStr] === x.rq || y[newStr] === x.rq)) {
            return true
          }
          if (yModelName === "renault twingo gt" && x.rid === "Renault_Sport_Twingo_GT_2016") {
            console.log(xModelName, xModelName, yModelYear, x.year)
            debugger;
          }
        });

        if (temp && temp.length > 1) {
          let achouExato = -1;
          temp.map((x, index) => {
            let xModelName = x.name.trim().toLowerCase().replace(/  +/g, ' ').normalize('NFD').replace(/\p{Diacritic}/gu, "");
            if (xModelName === yModelName) {
              achouExato = index;
            }
          })
          if (achouExato > -1) {
            temp = temp.filter((x, index) => index === achouExato);
          }
        }

        if (temp && temp.length === 1) {
          // OK

          if (temp[0].rq === y[oldStr] || temp[0].rq === y[newStr]) {
            // OK
            temp[0].rq = y[newStr];
            temp[0].class = Vue.resolveClass(temp[0].rq, null, "letter")
          } else {
            console.log(`${oldStr} diferente`, temp[0]);
            debugger;
          }

        } else if (temp && temp.length > 1) {
          // achou 2
          console.log("achou 2", yModelName, `${y[oldStr]} > ${y[newStr]}`, temp);
          // debugger;
        } else if (temp.length === 0) {
          // achou nada
          console.log("achou nada", yModelName, `${y[oldStr]} > ${y[newStr]}`);
          // debugger;
          // notFound.push(y.Model);
        }
      })
    }




    this.cars_final.sort((a, b) => {
      if (a.rq === b.rq) {
        return a.name.localeCompare(b.name);
      } else {
        return b.rq - a.rq;
      }
    })
    console.log(this.cars_final);
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