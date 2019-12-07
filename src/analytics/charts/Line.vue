<template>
  <div id="app">
    <div id="content">
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  name: "app",
  props: ["length", "data"],
  watch: {
    data() {
      this.mountChart();
    }
  },
  data() {
    return {
      colors: [
        "rgba(0,116,217, 0.6)",
        "rgba(255,133,27, 0.8)",
        "rgba(177,13,201, 0.8)"
      ]
    };
  },
  methods: {
    getLabels(length) {
      let months = [];
      for (let i = length; i > 0; i--) {
        if (i !== 0) {
          months.push(
            this.moment()
              .subtract(i, "month")
              .format("MMMM")
          );
        } else {
          months.push(this.moment().format("MMMM"));
        }
      }
      return months;
    },
    formatData(data, pos) {
      if (pos === 0)
        return {
          label: data.label,
          data: data.data,
          borderColor: this.colors[pos],
          backgroundColor: this.colors[pos],
          borderWidth: 1
        };
      return {
        label: data.label,
        data: data.data,
        borderColor: this.colors[pos],
        borderWidth: 1,
        fill: false
      };
    },
    mountDataSets(data) {
      if (length in data) {
        if (data.length > 1) {
          let dataset = [];
          for (let i = 0; i < data.length; i++) {
            let d = data[i];
            dataset.push(this.formatData(d, i));
          }
          return dataset;
        }
        return this.formatData(data[0], 0);
      }
      return { label: "erro", data: [] };
    },
    /**
     * [{label: "titulo", data=[1.1, 2.2]}]
     */
    mountChart() {
      var chart = this.$refs.chart;
      var ctx = chart.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: this.getLabels(this.length),
          datasets: this.mountDataSets(this.data)
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  padding: 25,
                  suggestedMin: 1.5,
                  suggestedMax: 3.5
                }
              }
            ]
          }
        }
      });
    }
  },
  mounted() {
    this.mountChart();
  }
};
</script>

<style lang="scss">
#app {
  color: #2c3e50;
}
</style>
