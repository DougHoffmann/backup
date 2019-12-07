import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";

import money from "v-money";
import axios from "axios";
import moment from "moment";

Vue.prototype.moment = moment;
moment.locale("pt");

const base = axios.create({
  baseURL: "http://172.16.10.110:3000/"
});

Vue.prototype.$http = base;

Vue.config.productionTip = false;

Vue.use(money, { precision: 4 });

Vue.use(Buefy, {
  defaultIconPack: "fas"
});

Vue.filter("currency", function(value) {
  let raw = value;
  var formatter = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG"
  });
  if (typeof value === String) raw = raw.replace(/[^0-9]/g, "");
  return formatter.format(raw);
});

Vue.filter("number", function(value) {
  if (typeof value !== "string") {
    return value.replace(/[^0-9]/g, "");
  }
  return value;
});

Vue.filter("distance", function(value) {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " km";
});

Vue.filter("fuel", function(value) {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " L";
});

Vue.filter("consumption", function(value) {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " Km/L";
});

Vue.filter("weight", function(value) {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " Kg.";
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
