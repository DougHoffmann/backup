<template>
  <Page :showPanel="showPanel" @close-panel="closePanel">
    <div slot="pageContent">
      <h2 class="is-size-2">Caminhões</h2>
      <b-button style="float: right" type="is-primary" @click="addTruckPanel">Adicionar Caminhão</b-button>

      <Table
        class="mt-50"
        :data="trucks"
        :columns="columns"
        @etest="selectTruck"
        :selectedObj="this.selectedTruck"
      />
    </div>

    <div slot="panelContent">
      <div class="mt-15 mb-15">
        <div class="col" style="margin-top: auto;">
          <h3 class="is-size-3">{{selectedTruck._id !== 0 ? "Caminhão" : "Lançar Frete" }}</h3>
        </div>
        <div class="col" style="margin-top: auto;">
          <router-link
            style="float: right;"
            v-if="selectedTruck._id !== 0"
            :to="'/truck/' + selectedTruck._id"
          >Ver detalhes >>></router-link>
        </div>
      </div>
      <FormBuilder
        form="addTruck"
        :url="'truck' + (selectedTruck._id !== 0 ? '/' + selectedTruck._id : '')"
        :data="selectedTruck"
        @update-data="fetchTrucks"
      />
    </div>
  </Page>
</template>

<script>
import Page from "../components/layout/Page.vue";
import FormBuilder from "../components/FormBuilder.vue";
import Table from "../components/tables/Table.vue";
export default {
  components: {
    Page,
    FormBuilder,
    Table
  },
  data() {
    return {
      trucks: [],
      columns: [
        { field: "plate", label: "Placa" },
        { field: "mileage", label: "Kilometragem" },
        { field: "driver->name", label: "Motorista", type: "object" },
        { field: "status", label: "Status", type: "status", centered: true }
      ],
      selectedTruck: { _id: 0 },
      showPanel: false
    };
  },
  methods: {
    resetSelected() {
      this.selectedTruck = {
        _id: 0,
        plate: "",
        mileage: 0,
        driver: null,
        status: false
      };
    },
    fetchTrucks() {
      this.$http.get("truck").then(res => (this.trucks = res.data));
      this.resetSelected();
      this.showPanel = false;
      this.$forceUpdate();
    },
    selectTruck(truck) {
      this.selectedTruck = truck;
      this.showPanel = true;
    },
    closePanel() {
      this.fetchTrucks();
      this.resetSelected();
    },
    addTruckPanel() {
      this.fetchTrucks();
      this.showPanel = true;
      this.formType = "add";
      this.resetSelected();
    }
  },
  created() {
    this.fetchTrucks();
  }
};
</script>

<style>
</style>