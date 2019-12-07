<template>
  <section>
    <div class="columns">
      <div class="column">
        <LineChart :data="dataConsumption" :length="6" />
      </div>
      <div class="column">
        <LineChart :data="dataWaste" :length="6" />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <LineChart :data="dataDistance" :length="6" />
      </div>
      <div class="column">
        <BarChart :data="dataCash" :length="6" />
      </div>
    </div>
  </section>
</template>

<script>
import LineChart from "./charts/Line.vue";
import BarChart from "./charts/Bar.vue";

export default {
  components: {
    LineChart,
    BarChart
  },
  data() {
    return {
      data: [],
      dataConsumption: [],
      dataWaste: [],
      dataDistance: [],
      labels: [],
      dataAll: [],
      dataCash: []
    };
  },
  methods: {
    getData() {
      let pool = [];
      for (let i = 0; i < 15; i++) {
        let d = [];
        for (let j = 0; j < 6; j++) {
          d.push(this.rng(1, 5, 2, 1.2));
        }
        pool.push(d);
      }

      let avgs = pool.map(
        d => d.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / d.length
      );

      let avg = [];
      for (let i = 0; i < 6; i++) {
        avg.push(avgs[0]);
      }

      console.log("pool: ", pool);
      console.log("avgs, ", avgs);
      console.log("avg, ", avg);

      this.data = [
        {
          label: "Média caminhão",
          data: pool[0]
        },
        {
          label: "Média geral",
          data: avgs
        },
        {
          label: "Média geral caminhão",
          data: avg
        }
      ];

      this.labels = [1, 2, 3, 4, 5, 6];
    },
    sample(size) {
      let data = this.getData(size);

      let pool = [];
      for (let i = 0; i < 15; i++) {
        pool.push(this.getData(size));
      }

      let avgs = pool.map(
        d => d.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / d.length
      );

      let min = Math.min(...data);
      let max = Math.max(...data);
      let sum = data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
      let avg = sum / data.length;

      let avgDataSet = [];
      for (let i = 0; i < size; i++) {
        avgDataSet.push(avg);
      }

      return {
        main: data,
        min: min,
        max: max,
        avg: avg,
        avgs: avgs,
        avgDataSet: avgDataSet
      };
    },
    rng(min, max, bias, inf) {
      let rnd = Math.random() * (max - min) + min,
        mix = Math.random() * inf;

      return rnd * (1 - mix) + bias * mix;
    },
    calcDate() {
      let date = new Date(Date.now());
      let year = date.getFullYear();
      let month = date.getMonth();

      let dates = [];
      for (let i = 1; i < 7; i++) {
        if (month === 0) {
          month = 12;
          year--;
        }
        dates.push({
          month: month,
          year: year
        });
        month--;
      }
      return dates;
    },
    contains(array, date) {
      for (let i = 0; i < array.length; i++) {
        if (
          array[i]._id.month === date.month &&
          array[i]._id.year === date.year
        ) {
          return array[i];
        }
      }
      return {
        consumption: 0,
        distance: 0,
        weight: 0,
        waste: 0,
        income: 0,
        waste_expense: 0,
        fuel_expense: 0,
        expense: 0,
        count: 0
      };
    },
    cons(data) {
      let truck = [];
      let sum = 0;
      let count = 0;
      for (let i = 0; i < data.length; i++) {
        truck.push(data[i]["consumption"]);
        sum += data[i].consumption;
        if (data[i].consumption > 0) count++;
      }

      let avg = parseFloat((sum / count).toFixed(2));
      let avg_arr = [];
      for (let i = 0; i < 6; i++) {
        avg_arr.push(avg);
      }

      this.dataConsumption = [
        { label: "Média Km/L", data: truck },
        { label: "Média", data: avg_arr }
      ];
    },
    waste(data) {
      let wastes = [];
      let sum = 0;
      for (let i = 0; i < 6; i++) {
        wastes.push(data[i].waste);
        sum += data[i].waste;
      }

      let avg = parseFloat((sum / 6).toFixed(2));
      let avg_arr = [];
      for (let i = 0; i < 6; i++) {
        avg_arr.push(avg);
      }

      this.dataWaste = [
        { label: "Faltante", data: wastes },
        { label: "Média", data: avg_arr }
      ];
    },
    distance(data) {
      let distances = [];
      let sum = 0;
      for (let i = 0; i < 6; i++) {
        distances.push(data[i].distance);
        sum += data[i].distance;
      }

      let avg = parseFloat((sum / 6).toFixed(2));
      let avg_arr = [];
      for (let i = 0; i < 6; i++) {
        avg_arr.push(avg);
      }

      this.dataDistance = [
        { label: "Kilometragem Percorrida", data: distances },
        { label: "Média", data: avg_arr }
      ];
    },
    cash(data) {
      let income = [];
      let expenses = [];
      let fuel = [];
      for (let i = 0; i < 6; i++) {
        income.push(data[i].income);
        expenses.push(data[i].expense);
        fuel.push(data[i].fuel_expense);
      }

      console.log("data on cash: ", data);

      this.dataCash = [
        { label: "Entrada Total", data: income },
        { label: "Viáticos", data: expenses },
        { label: "Combustivel", data: fuel }
      ];
    },
    fetchAnalytic() {
      this.$http.get("analytics/truck/" + this.$route.params.id).then(r => {
        let dates = this.calcDate();
        let data = r.data;
        let chartData = [];

        for (let i = 0; i < dates.length; i++) {
          chartData.push(this.contains(data, dates[i]));
        }
        chartData.reverse();
        this.cons(chartData);
        this.distance(chartData);
        this.cash(chartData);

        this.$http.get("analytics/all").then(rall => {
          let aux = [];

          for (let i = 0; i < dates.length; i++) {
            aux.push(this.contains(rall.data, dates[i]));
          }
          aux.reverse();

          let avg_cons = [];
          let avg_waste = [];
          let avg_distance = [];
          for (let i = 0; i < 6; i++) {
            avg_cons.push(aux[i].consumption);
            avg_waste.push(aux[i].waste);
            avg_distance.push(aux[i].distance);
          }

          this.waste(chartData);
          this.dataConsumption.push({ label: "Média geral", data: avg_cons });
          this.dataWaste.push({ label: "Média geral", data: avg_waste });
          this.dataDistance.push({ label: "Média geral", data: avg_distance });
        });
      });
    }
  },
  mounted() {
    this.getData();
    this.fetchAnalytic();
  }
};
</script>
