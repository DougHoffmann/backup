<template>
  <Page :showPanel="showPanel" @close-panel="closePanel">
    <div slot="pageContent">
      <!-- page content -->
      <section>
        <b-button type="is-primary" @click="$router.push('/truck')" outlined>
          <i class="fas fa-arrow-left"></i> &nbsp;&nbsp; Voltar
        </b-button>
        <h2 class="is-size-2">Caminhão</h2>

        <div class="columns" v-if="truck._id !== 0">
          <div class="column">
            <p class="is-size-4">Placa: {{ truck.plate }}</p>
            <p class="is-size-4">
              Kilometragem: {{ truck.mileage | distance }}
            </p>
          </div>

          <div class="column">
            <p class="is-size-4">Motorista: {{ truck.driver.name }}</p>
            <p class="is-size-4">
              Estado: {{ truck.status ? "Ativo" : "Inativo" }}
            </p>
          </div>
        </div>

        <b-button type="is-success" @click="analytics" outlined
          >Fazer análise</b-button
        >

        <b-tabs class="mt-25">
          <b-tab-item label="Pneus">
            <b-button style="float: right;" type="is-primary" @click="addTire"
              >Adicionar Pneu</b-button
            >

            <Table
              :data="truck._id !== 0 ? truck.tires : []"
              :columns="columns"
              @etest="selectTire"
            />
          </b-tab-item>
          <b-tab-item label="Gastos">
            <b-button
              style="float: right;"
              type="is-primary"
              @click="modalAdd = true"
              >Lançar Gasto</b-button
            >
            <Table
              :data="truck._id !== 0 ? truck.expenses : []"
              :columns="columnsExpenses"
              @etest="selectExpense"
            />
          </b-tab-item>
        </b-tabs>
      </section>
      <!-- Modal Analysis -->
      <b-modal :active.sync="modalAnalytics" :width="1500" scroll="keep">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <TruckAnalytics />
            </div>
          </div>
        </div>
      </b-modal>

      <!-- Modal EXPENSE DETAIL -->
      <b-modal :active.sync="modalExpense" :width="640" scroll="keep">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="is-size-4">Detalhes</p>
              <table class="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(piece, key) in selectedExpense.pieces" :key="key">
                    <td>{{ piece.name }}</td>
                    <td>{{ piece.qnt }}x</td>
                    <td>{{ piece.price | currency }}</td>
                    <td>{{ (piece.price * piece.qnt) | currency }}</td>
                  </tr>
                </tbody>
              </table>

              <p class="is-size-5" style="text-align: right;">
                Total: {{ selectedExpense.total | currency }}
              </p>
              <br />
              <small>{{
                this.moment(selectedExpense.date).format("llll")
              }}</small>
            </div>
          </div>
        </div>
      </b-modal>

      <!-- MODAL ADD EXPENSE -->
      <b-modal :active.sync="modalAdd" :width="900" scroll="keep">
        <div class="modal-card" width="900">
          <header class="modal-card-head">
            <p class="modal-card-title">Lançar Gasto</p>
          </header>
          <section class="modal-card-body">
            <AddExpense @submit-expense="submitExpense" />
          </section>
        </div>
      </b-modal>
    </div>
    <div slot="panelContent">
      <h3 class="is-size-3">
        {{ selected._id !== 0 ? "Pneu" : "Adicionar Pneu" }}
      </h3>

      <FormBuilder
        v-if="selected._id === 0"
        :show="showPanel"
        form="addTire"
        :url="'truck/' + this.$route.params.id + '/tire'"
        @update-data="fetchTruck"
      />

      <div v-else>
        <form @submit.prevent="submitEdit">
          <b-field
            class="mt-10"
            label="Código"
            :type="errors.get('cod') ? 'is-danger' : ''"
            :message="errors.get('cod')"
          >
            <b-input v-model="selectedCod" @input="errors.clear('cod')" />
          </b-field>

          <b-field
            label="Caminhão"
            :type="errors.get('brand') ? 'is-danger' : ''"
            :message="errors.get('brand')"
          >
            <Autocomplete
              url="brand"
              field="name"
              placeholder="ex. Bridgestone"
              @selected-value="selectBrand"
              :preSelect="selectedBrand"
            />
          </b-field>

          <b-field>
            <div class="control has-text-centered">
              <b-button
                type="is-primary"
                tag="input"
                native-type="submit"
                value="Salvar"
                :disabled="errors.any()"
                expanded
              ></b-button>
            </div>
          </b-field>
        </form>
        <b-button
          class="mt-10"
          type="is-danger"
          @click="modalRemove = true"
          expanded
          >Remover Pneu</b-button
        >
      </div>

      <b-modal
        :active.sync="modal"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
        width="350"
      >
        <div class="modal-card" style="width: 350px;">
          <header class="modal-card-head">
            <p class="modal-card-title">Confirmação</p>
          </header>
          <section class="modal-card-body">
            Você deseja confirmar as Alterações?
          </section>
          <footer class="modal-card-foot">
            <button
              class="button is-fullwidth is-danger"
              @click="modal = false"
            >
              Cancelar
            </button>
            <button
              ref="confirmBtn"
              class="button is-fullwidth is-success"
              @click="submitTire"
            >
              Confirmar
            </button>
          </footer>
        </div>
      </b-modal>

      <b-modal
        :active.sync="modalRemove"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
        width="350"
      >
        <div class="modal-card" style="width: 350px;">
          <header class="modal-card-head">
            <p class="modal-card-title">Confirmação</p>
          </header>
          <section class="modal-card-body">Você deseja REMOVER o pneu?</section>
          <footer class="modal-card-foot">
            <button
              class="button is-fullwidth is-primary"
              @click="modalRemove = false"
            >
              Cancelar
            </button>
            <button
              ref="confirmBtn"
              class="button is-fullwidth is-danger"
              @click="removeTire"
            >
              REMOVER
            </button>
          </footer>
        </div>
      </b-modal>
    </div>
  </Page>
</template>

<script>
import Page from "../components/layout/Page.vue";
import Table from "../components/tables/Table.vue";
import Errors from "../utils/Errors";
import Autocomplete from "../components/fields/Autocomplete.vue";
import FormBuilder from "../components/FormBuilder.vue";
import AddExpense from "../components/forms/AddExpense.vue";
import TruckAnalytics from "../analytics/TruckAnalytics.vue";

export default {
  components: {
    Page,
    Table,
    FormBuilder,
    Autocomplete,
    AddExpense,
    TruckAnalytics
  },
  data() {
    return {
      showPanel: false,
      truck: {
        _id: 0
      },
      selected: {
        _id: 0,
        cod: "",
        brand: {
          name: ""
        }
      },
      selectedExpense: {
        _id: 0
      },
      modalExpense: false,
      modal: false,
      modalRemove: false,
      modalAdd: false,
      modalAnalytics: false,
      columns: [
        { field: "cod", label: "Código", type: "string" },
        { field: "brand", label: "Marca", type: "string" },
        { field: "mileage", label: "Kilometragem", type: "distance" }
      ],
      columnsExpenses: [
        { field: "date", label: "Data", type: "date" },
        { field: "total", label: "Total", type: "currency" }
      ],
      errors: new Errors(),
      selectedBrand: {
        name: ""
      },
      selectedCod: ""
    };
  },
  methods: {
    analytics() {
      this.modalAnalytics = true;
    },
    closePanel() {
      this.showPanel = false;
      this.resetSelected();
    },
    fetchTruck() {
      this.$http.get("truck/" + this.$route.params.id).then(r => {
        this.truck = r.data;
        console.log("truck: ", r.data);
        let tires = [];
        if (this.truck.tires.length > 0 && this.truck.mileage !== 0) {
          for (let i = 0; i < this.truck.tires.length; i++) {
            let tire = { ...this.truck.tires[i] };
            tire.mileage = this.truck.mileage - tire.mileage;
            tires.push(tire);
          }
          this.truck.tires = tires;
          this.resetSelected();
          this.showPanel = false;
        }
      });
      this.$forceUpdate();
    },
    resetSelected() {
      this.selected = {
        _id: 0,
        cod: "",
        brand: {
          name: ""
        }
      };
      this.selectedCod = "";
      this.selectedBrand = {
        name: ""
      };
      this.errors = new Errors();
    },
    addTire() {
      this.resetSelected();
      this.showPanel = true;
    },
    selectTire(tire) {
      this.showPanel = true;
      this.selected = tire;

      this.selectedCod = tire.cod;

      this.$http.post("brand/name", { name: this.selected.brand }).then(r => {
        this.selectedBrand = r.data;
      });
    },
    selectBrand(brand) {
      if (brand) {
        this.errors.clear("brand");
      }
      this.selectedBrand = brand;
    },

    submitEdit() {
      if (!this.selectedBrand) {
        this.errors.add({
          field: "brand",
          msg: "Por favor selecione a marca"
        });
      }

      if (!this.selectedCod.length > 0) {
        this.errors.add({
          field: "cod",
          msg: "Por favor insira o código"
        });
      }

      if (!this.errors.any()) {
        this.modal = true;
      }

      this.$forceUpdate();
    },
    submitTire() {
      this.$http
        .post("truck/" + this.$route.params.id + "/tire/" + this.selected._id, {
          cod: this.selectedCod,
          brand: this.selectedBrand.name
        })
        .then(() => {
          this.fetchTruck();
        });
    },
    removeTire() {
      this.$http
        .delete("truck/" + this.$route.params.id + "/tire/" + this.selected._id)
        .then(() => {
          this.fetchTruck();
          this.modalRemove = false;
        });
    },
    selectExpense(expense) {
      this.selectedExpense = expense;
      this.modalExpense = true;
    },
    submitExpense(expense) {
      if (expense.pieces.length > 0) {
        this.$http
          .post("truck/" + this.$route.params.id + "/expenses", expense)
          .then(() => {
            this.fetchTruck();
            this.modalAdd = false;
          });
      }
    }
  },
  created() {
    this.fetchTruck();
  }
};
</script>

<style></style>
