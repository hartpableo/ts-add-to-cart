import {getProducts} from "./api";

(() => {
  getProducts().then(console.log)

  console.log(1)
})()