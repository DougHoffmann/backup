import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Driver from "../views/Driver.vue";
import Truck from "../views/Truck.vue";
import Freight from "../views/Freight.vue";
import Test from "../views/Test.vue";
import Warehouse from "../views/Warehouse.vue";

//details
import FreightDetails from "../details/FreightDetails.vue";
import TruckDetails from "../details/TruckDetails.vue";

// analytics
import TruckAnalytics from "../analytics/TruckAnalytics.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/driver",
    name: "driver",
    component: Driver
  },
  {
    path: "/freight",
    name: "freight",
    component: Freight
  },
  {
    path: "/freight/:id",
    name: "freigth",
    component: FreightDetails
  },
  {
    path: "/truck/:id",
    name: "truck",
    component: TruckDetails
  },
  {
    path: "/truck",
    name: "truck",
    component: Truck
  },
  {
    path: "/test",
    name: "test",
    component: Test
  },
  {
    path: "/warehouse",
    name: "warehouse",
    component: Warehouse
  },
  {
    path: "/analytics",
    name: "analytics",
    component: TruckAnalytics
  }
];

const router = new VueRouter({
  routes
});

export default router;
