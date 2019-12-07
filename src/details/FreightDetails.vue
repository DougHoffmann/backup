<template>
  <Page :showPanel="showPanel" @close-panel="closePanel">
    <div slot="pageContent">
      <section>
        <b-button type="is-primary" @click="$router.push('/freight')" outlined>
          <i class="fas fa-arrow-left"></i> &nbsp;&nbsp; Voltar
        </b-button>
        <h2 class="is-size-2">Frete</h2>

        <div class="columns">
          <div class="column pl-15 pt-15">
            <div class="columns pl-15">
              <div>
                <p
                  class="is-size-4"
                  style="margin-top: auto;"
                >{{ "Origem: " + freight.depart.name + " " }}</p>
              </div>
              <div class="col pl-5">
                <CountryFlag :country="freight.depart.country === 'Brasil' ? 'br' : 'py'" />
              </div>
            </div>

            <div class="columns pl-15">
              <div class="col">
                <p
                  class="is-size-4"
                  style="margin-top: auto;"
                >{{ "Destino: " + freight.arrive.name + " " }}</p>
              </div>
              <div class="col pl-5">
                <CountryFlag :country="freight.depart.country === 'Brasil' ? 'br' : 'py'" />
              </div>
            </div>

            <div class="columns pl-15">
              <p class="is-size-4">Total Carregado: {{totalDepart | weight}}</p>
            </div>

            <div class="columns pl-15">
              <p class="is-size-4">Total Entregue: {{totalArrive | weight}}</p>
            </div>

            <div class="columns pl-15">
              <p class="is-size-4">Total Faltante: {{(totalDepart - totalArrive) | weight}}</p>
            </div>
          </div>

          <div class="column">
            <p class="is-size-4">Valor: {{ freight.price | currency }}</p>
            <p class="is-size-4">Data: {{moment(freight.openDate).format('DD/MM/YYYY')}}</p>
            <p class="is-size-4">Tipo: {{freight.type.name}}</p>
            <p class="is-size-4">Consumo médio: {{mCons | consumption}}</p>
            <p class="is-size-4">Distancia média: {{mDis | distance}}</p>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <p class="is-size-3">Cargas</p>
          </div>
          <div class="column">
            <b-button style="float: right" type="is-primary" @click="addCargo">Lançar Carga</b-button>
          </div>
        </div>

        <Table class="mt-50" :data="freight.cargos" :columns="columns" @etest="selectCargo" />
      </section>
    </div>

    <div slot="panelContent">
      <h3 class="is-size-3">{{ selectedCargo._id !== 0 ? "Carga" : "Lançar Carga" }}</h3>

      <AddFreight
        v-if="selectedCargo._id === 0"
        @submit.prevent="submitAddCargo"
        @post-cargo="postCargo"
      ></AddFreight>

      <EditFreight v-else :prop="{...selectedCargo}" @post-edit-cargo="postEditCargo" />
    </div>
  </Page>
</template>

<script>
import Page from "../components/layout/Page";
import CountryFlag from "vue-country-flag";
import Table from "../components/tables/Table.vue";
import AddFreight from "../components/forms/AddFreight.vue";
import EditFreight from "../components/forms/EditFreight.vue";

export default {
  components: { Page, CountryFlag, Table, AddFreight, EditFreight },
  data() {
    return {
      freight: {
        _id: 0,
        depart: {
          name: "",
          country: ""
        },
        arrive: {
          name: "",
          country: ""
        },
        cargos: [],
        type: {
          name: "",
          color: ""
        }
      },
      columns: [
        { field: "weightDepart", label: "Peso de Saida", type: "weight" },
        { field: "weightArrive", label: "Peso de Chegada", type: "weight" },
        { field: "fuel", label: "Comb. Gasto", type: "fuel" },
        { field: "distance", label: "Distancia", type: "distance" },
        { field: "expenses", label: "Viatico", type: "currency" },
        { field: "waste", label: "Faltante", type: "weight" },
        { field: "consumption", label: "Consumo", type: "consumption" },
        { field: "truck->plate", label: "Caminhão", type: "object" },
        { field: "driver->name", label: "motorista", type: "object" }
      ],
      selectedCargo: { _id: 0 },
      showPanel: false,
      totalDepart: 0,
      totalArrive: 0,
      mCons: 0,
      mDis: 0
    };
  },
  methods: {
    postCargo(cargo) {
      this.$http
        .post("freight/" + this.freight._id + "/cargo", cargo)
        .then(() => this.fetchFreight());
    },
    postEditCargo(cargo) {
      this.$http
        .post("freight/" + this.freight._id + "/cargo/" + cargo._id, cargo)
        .then(() => {
          this.fetchFreight();
        });
    },
    resetSelected() {
      this.selectedCargo = {
        _id: 0
      };
    },
    fetchFreight() {
      this.$http.get("freight/" + this.$route.params.id).then(response => {
        this.freight = response.data;
        if (this.freight.cargos.length > 0) {
          let sumDepart = 0;
          let sumArrive = 0;
          let sumCons = 0.0;
          let sumDis = 0;

          let count = 0;
          for (let i = 0; i < this.freight.cargos.length; i++) {
            let cargo = this.freight.cargos[i];
            sumDepart += cargo.weightDepart;
            sumArrive += cargo.weightArrive;
            if (cargo.consumption && cargo.distance) {
              sumCons += cargo.consumption;
              sumDis += cargo.distance;
              count++;
            }
          }
          this.totalDepart = sumDepart;
          this.totalArrive = sumArrive;
          this.mCons = sumCons / count;
          this.mDis = sumDis / count;
        }
      });
      this.showPanel = false;
    },
    selectCargo(cargo) {
      this.selectedCargo = cargo;
      this.showPanel = true;
    },
    closePanel() {
      this.fetchFreight();
      this.resetSelected();
    },
    addCargo() {
      this.fetchFreight();
      this.showPanel = true;
      this.resetSelected();
    }
  },
  created() {
    this.fetchFreight();
  }
};
</script>

<style lang="scss"></style>
