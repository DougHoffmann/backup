<template>
  <Page :showPanel="showPanel" @close-panel="closePanel">
    <div slot="pageContent">
      <h2 class="is-size-2">Fretes</h2>
      <b-button style="float: right" type="is-primary" @click="addFreightPanel">Lançar Frete</b-button>

      <Table class="mt-50" :data="freights" :columns="columns" @etest="selectFreight" />
    </div>

    <div slot="panelContent">
      <div class="mt-15 mb-15">
        <div class="col" style="margin-top: auto;">
          <h3 class="is-size-3">{{selectedFreight._id !== 0 ? "Frete" : "Lançar Frete" }}</h3>
        </div>
        <div class="col" style="margin-top: auto;">
          <router-link
            style="float: right;"
            v-if="selectedFreight._id !== 0"
            :to="'/freight/' + selectedFreight._id"
          >Ver detalhes >>></router-link>
        </div>
      </div>

      <FormBuilder
        :show="showPanel"
        form="addFreight"
        :url="'freight' + (selectedFreight._id !== 0 ? '/' + selectedFreight._id : '')"
        :data="selectedFreight"
        @update-data="fetchFreights"
      />
    </div>
  </Page>
</template>

<script>
import Page from "../components/layout/Page";
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
      freights: [],
      columns: [
        { field: "openDate", label: "Abertura", type: "date" },
        { field: "depart->name", label: "Partida", type: "object" },
        { field: "arrive->name", label: "Destino", type: "object" },
        { field: "type", label: "Tipo", type: "type" },
        { field: "price", label: "Preço", type: "currency" }
      ],
      selectedFreight: { _id: 0 },
      showPanel: false
    };
  },
  methods: {
    resetSelected() {
      this.selectedFreight = {
        _id: 0,
        price: 0,
        depart: { name: "" },
        arrive: { name: "" },
        type: null,
        openDate: new Date().toString()
      };
    },
    fetchFreights() {
      this.$http.get("freight").then(res => (this.freights = res.data));
      this.showPanel = false;
    },
    selectFreight(freight) {
      this.selectedFreight = freight;
      this.showPanel = true;
    },
    closePanel() {
      this.fetchFreights();
      this.resetSelected();
    },
    addFreightPanel() {
      this.fetchFreights();
      this.showPanel = true;
      this.resetSelected();
    }
  },
  created() {
    this.fetchFreights();
  }
};
</script>

<style>
</style>
