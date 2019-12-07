<template>
  <div class="small">
    <line-chart :chart-data="datacollection"></line-chart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: null
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: this.getLabel(this.getData().length),
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: this.getData()
          },
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: this.getData()
          }
        ]
      };
    },
    getLabel(l) {
      let label = [];
      for (let i = 0; i < l; i++) {
        label.push(i + 1);
      }
      return label;
    },
    getData() {
      let data = [];
      for (let i = 0; i < 5; i++) data.push(this.getRandomInt());
      return data;
    },
    getRandomInt() {
      return Math.floor(Math.random() * 3) + 1;
    }
  }
};
</script>

<style>
.small {
  max-width: 600px;
}
</style>
