<template>
  <Page :showPanel="showPanel" @close-panel="closePanel">
    <div slot="pageContent">
      <h2 class="is-size-2">Depósito</h2>
      <b-button style="float: right" type="is-primary" @click="addPiecePanel">Adicionar Peça</b-button>
      <br />
      <b-tabs class="mt-25">
        <b-tab-item label="Peças">
          <Table
            :data="pieces"
            :columns="columns"
            @etest="selectPiece"
            :selectedObj="this.selectedPiece"
          />
        </b-tab-item>
        <b-tab-item label="Pneus">
          <Table :data="tires" :columns="columnsTires" />
        </b-tab-item>
      </b-tabs>
    </div>
    <div slot="panelContent">
      <h3 class="is-size-3">{{selectedPiece._id !== 0 ? "Peça" : "Adicionar Peça" }}</h3>

      <FormBuilder
        form="addPiece"
        :url="'piece' + (selectedPiece._id !== 0 ? '/' + selectedPiece._id : '')"
        :data="selectedPiece"
        @update-data="fetchPieces"
      />
    </div>
  </Page>
</template>

<script>
import Page from "../components/layout/Page.vue";
import Table from "../components/tables/Table.vue";
import FormBuilder from "../components/FormBuilder.vue";

export default {
  components: {
    Page,
    Table,
    FormBuilder
  },
  data() {
    return {
      showPanel: false,
      pieces: [],
      tires: [],
      columnsTires: [
        { field: "cod", label: "Cod" },
        { field: "brand", label: "Marca" },
        { field: "mileage", label: "kilometrage", type: "distance" },
        { field: "truck", label: "Caminhão" },
        { field: "removeDate", label: "Data de Rem.", type: "date" }
      ],
      columns: [
        { field: "name", label: "Nome" },
        { field: "price", label: "Preço", type: "currency" },
        { field: "stock", label: "Estoque" }
      ],
      selectedPiece: {
        _id: 0
      }
    };
  },
  methods: {
    fetchPieces() {
      this.$http.get("piece").then(r => (this.pieces = r.data));
      this.showPanel = false;
      this.resetSelected();
    },
    resetSelected() {
      this.selectedPiece = {
        _id: 0,
        name: "",
        description: "",
        price: 0,
        stock: 0
      };
    },
    closePanel() {
      this.fetchPieces();
    },
    addPiecePanel() {
      this.fetchPieces();
      this.showPanel = true;
    },
    selectPiece(piece) {
      this.selectedPiece = piece;
      this.showPanel = true;
    },
    fetchTires() {
      this.$http.get("tire").then(r => (this.tires = r.data));
    }
  },
  created() {
    this.fetchPieces();
    this.fetchTires();
  }
};
</script>

<style>
</style>