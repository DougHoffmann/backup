<template>
  <section>
    <form @submit.prevent="submitCargo">
      <b-field
        label="Caminhão"
        :type="errors.get('truck') ? 'is-danger' : ''"
        :message="errors.get('truck')"
      >
        <Autocomplete
          url="avaliable"
          field="plate"
          placeholder="CPX-111"
          @selected-value="selectTruck"
        />
      </b-field>

      <span
        class="tag is-warning"
        v-if="'mileage' in cargo.truck"
      >Kilometragem atual: {{cargo.truck.mileage | distance}}</span>

      <b-field
        class="mt-10"
        label="Nova kilometragem"
        :type="errors.get('newMileage') ? 'is-danger' : ''"
        :message="errors.get('newMileage')"
      >
        <b-input v-model="cargo.newMileage" @input="calcDist" v-money="distanceConfig" />
      </b-field>

      <span
        class="tag is-warning"
        v-if="cargo.distance !== 0"
      >Distancia: {{cargo.distance | distance}}</span>

      <b-field
        class="mt-10"
        label="Combustivel"
        :type="errors.get('fuel') ? 'is-danger' : ''"
        :message="errors.get('fuel')"
      >
        <b-input v-model="cargo.fuel" @input="calcCons" v-money="fuelConfig" />
      </b-field>

      <span
        class="tag"
        :class="cargo.consumption > 5 ? 'is-danger' : 'is-warning'"
        v-if="cargo.consumption !== 0 && cargo.consumption > 0.5 && cargo.consumption < 100"
      >Consumo: {{cargo.consumption.toFixed(2) | consumption}}</span>

      <b-field
        class="mt-10"
        label="Carregado"
        :type="errors.get('weightDepart') ? 'is-danger' : ''"
        :message="errors.get('weightDepart')"
      >
        <b-input
          v-model="cargo.weightDepart"
          v-money="weightConfig"
          @input="errors.clear('weightDepart')"
        />
      </b-field>

      <b-field
        class="mt-10"
        label="Entregue"
        :type="errors.get('weightArrive') ? 'is-danger' : ''"
        :message="errors.get('weightArrive')"
      >
        <b-input v-model="cargo.weightArrive" @input="calcWaste" v-money="weightConfig" />
      </b-field>

      <span class="tag is-warning" v-if="cargo.waste !== 0">Faltante: {{cargo.waste | weight}}</span>

      <b-field
        class="mt-10"
        label="Viático"
        :type="errors.get('expenses') ? 'is-danger' : ''"
        :message="errors.get('expenses')"
      >
        <b-input v-model="cargo.expenses" v-money="moneyConfig" />
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

    <b-modal
      :active.sync="isComponentModalActive"
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
        <section class="modal-card-body">Você deseja confirmar as Alterações?</section>
        <footer class="modal-card-foot">
          <button
            class="button is-fullwidth is-danger"
            @click="isComponentModalActive = false;"
          >Cancelar</button>
          <button
            ref="confirmBtn"
            class="button is-fullwidth is-success"
            @click="postCargo"
          >Confirmar</button>
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import Autocomplete from "../fields/Autocomplete.vue";
import Errors from "../../utils/Errors";
import Vue from "vue";

export default {
  components: { Autocomplete },
  watch: {
    isComponentModalActive(newValue) {
      let self = this;
      if (newValue) {
        Vue.nextTick().then(function() {
          self.$refs.confirmBtn.focus();
        });
      }
    }
  },
  data() {
    return {
      cargo: {
        truck: {},
        newMileage: 0,
        distance: 0,
        fuel: 0,
        consumption: 0,
        weightDepart: 0,
        weightArrive: 0,
        waste: 0,
        expenses: 0
      },
      distanceConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false
      },
      moneyConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "Gs. ",
        suffix: "",
        precision: 0,
        masked: false
      },
      fuelConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 3,
        masked: false
      },
      weightConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: " Kg. ",
        precision: 0,
        masked: false
      },
      errors: new Errors(),
      newCargo: {},
      isComponentModalActive: false
    };
  },
  methods: {
    postCargo() {
      this.$emit("post-cargo", this.newCargo);
      this.isComponentModalActive = false;
    },
    submitCargo() {
      let c = { ...this.cargo };
      c.expenses = this.numfy(c.expenses);
      c.fuel = this.numfy(c.fuel);
      c.weightDepart = this.numfy(c.weightDepart);
      c.weightArrive = this.numfy(c.weightArrive);
      c.newMileage = this.numfy(c.newMileage);

      if (c.truck === null) {
        this.errors.add({
          field: "truck",
          msg: "Por favor preencha este campo"
        });
      }

      if (
        c.fuel === 0 &&
        !("truck" in c && "mileage" in c.truck && c.truck.mileage === 0)
      ) {
        this.errors.add({
          field: "fuel",
          msg: "Por favor preencha este campo"
        });
      }

      if (c.weightDepart === 0) {
        this.errors.add({
          field: "weightDepart",
          msg: "Por favor preencha este campo"
        });
      }

      if (c.weightArrive === 0) {
        this.errors.add({
          field: "weightArrive",
          msg: "Por favor preencha este campo"
        });
      }

      if (
        c.newMileage === 0 &&
        !("truck" in c && "mileage" in c.truck && c.truck.mileage === 0)
      ) {
        this.errors.add({
          field: "newMileage",
          msg: "Por favor preencha este campo"
        });
      }

      if (c.waste > 50000) {
        this.errors.add({
          field: "weightArrive",
          msg: "Faltante calculado muito alto, por favor verifique"
        });
      }

      if (!this.errors.any()) {
        this.isComponentModalActive = true;

        if ("truck" in c && "mileage" in c.truck && c.truck.mileage === 0) {
          c.consumption = 0;
          c.fuel = 0;
        } else {
          c.consumption = c.consumption.toFixed(2);
          c.fuel = c.fuel / 1000;
        }

        this.newCargo = { ...c };
      } else {
        this.newCargo = {};
      }
      this.$forceUpdate();
    },
    selectTruck(truck) {
      this.cargo["truck"] = truck;
      this.errors.clear("truck");
    },
    calcDist() {
      if (
        "truck" in this.cargo &&
        "mileage" in this.cargo.truck &&
        this.cargo.truck.mileage === 0
      ) {
        return;
      }
      if ("mileage" in this.cargo.truck) {
        this.errors.clear("newMileage");

        let nnm = parseInt(this.cargo.newMileage.replace(/[^0-9]/g, ""));
        if (nnm > this.cargo.truck.mileage) {
          this.cargo.distance = nnm - this.cargo.truck.mileage;

          if (this.cargo.distance > 10000) {
            this.errors.add({
              field: "newMileage",
              msg: "Distancia calculada muito alta"
            });
          }
        } else {
          this.errors.add({
            field: "newMileage",
            msg: "A kilometragem inserida não é menor do que a atual"
          });
          this.cargo.distance = 0;
          this.consumption = 0;
        }
      } else if (this.cargo.newMileage !== "0") {
        this.errors.add({
          field: "newMileage",
          msg: "Por favor selecione o caminhão."
        });
        this.cargo.distance = 0;
        this.consumption = 0;
      }
    },
    calcCons() {
      if (
        "truck" in this.cargo &&
        "mileage" in this.cargo.truck &&
        this.cargo.truck.mileage === 0
      ) {
        return;
      }
      let nnm = parseInt(this.cargo.newMileage.replace(/[^0-9]/g, ""));
      if (nnm > 0) {
        let fuel = parseFloat(this.cargo.fuel.replace(/[^0-9]/g, "")) / 1000;
        let distance = this.cargo.distance;
        this.errors.clear("fuel");

        if (fuel > 0) {
          if (fuel > 1) {
            this.cargo.consumption = distance / fuel;
          } else {
            this.cargo.consumption = 0;
          }
        } else {
          this.consumption = 0;
        }
      } else if (this.cargo.fuel !== "0,000") {
        this.errors.add({
          field: "fuel",
          msg: "Por favor preencha a kilometragem"
        });
        this.consumption = 0;
      }
    },
    calcWaste() {
      let depart = parseInt(this.cargo.weightDepart.replace(/[^0-9]/g, ""));
      let arrive = parseInt(this.cargo.weightArrive.replace(/[^0-9]/g, ""));
      this.errors.clear("weightArrive");

      if (depart > 0 && arrive > 0) {
        this.cargo.waste = depart - arrive;
      } else {
        this.cargo.waste = 0;
      }
    },
    numfy(value) {
      return parseInt(value.replace(/[^0-9]/g, ""));
    }
  }
};
</script>

<style>
</style>