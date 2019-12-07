<template>
  <section>
    <form @submit.prevent="submitForm">
      <b-field
        class="mt-10"
        label="Distância"
        :type="errors.get('distance') ? 'is-danger' : ''"
        :message="errors.get('distance')"
      >
        <b-input
          v-model="cargo.distance"
          @input="errors.clear('distance')"
          v-money="distanceConfig"
        />
      </b-field>

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
import Errors from "../../utils/Errors";
import Vue from "vue";

export default {
  props: ["prop"],
  watch: {
    prop() {
      this.cargo = this.prop;
    },
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
        truck: null,
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
    submitForm() {
      this.isComponentModalActive = true;

      let c = { ...this.cargo };
      c.fuel =
        typeof c.fuel === "string"
          ? parseFloat(c.fuel.replace(/[^0-9]/g, "")) / 1000
          : c.fuel / 1000;

      if (c.fuel < 1) {
        c.fuel = c.fuel * 1000;
      }

      c.distance =
        typeof c.distance === "string" ? this.numfy(c.distance) : c.distance;

      c.weightArrive =
        typeof c.weightArrive === "string"
          ? this.numfy(c.weightArrive)
          : c.weightArrive;

      c.weightDepart =
        typeof c.weightDepart === "string"
          ? this.numfy(c.weightDepart)
          : c.weightDepart;

      c.consumption =
        typeof c.consumption === "string"
          ? parseFloat(c.consumption.replace(/[^0-9]/g, ""))
          : c.consumption;

      c.expenses =
        typeof c.expenses === "string" ? this.numfy(c.expenses) : c.expenses;

      this.newCargo = { ...c };
    },
    postCargo() {
      this.isComponentModalActive = false;
      this.$emit("post-edit-cargo", this.newCargo);
    },
    calcCons() {
      let fuel =
        typeof this.cargo.fuel === "string"
          ? parseFloat(this.cargo.fuel.replace(/[^0-9]/g, "")) / 1000
          : this.cargo.fuel;
      let distance = this.cargo.distance;

      if (distance > 0) {
        if (fuel > 1) {
          this.cargo.consumption = distance / fuel;
        } else {
          this.cargo.consumption = 0;
        }
      } else {
        this.errors.add({
          field: "distance",
          msg: "Por favor preencha este campo"
        });
        this.consumption = 0;
      }
    },
    numfy(n) {
      if (typeof n === "string") return parseFloat(n.replace(/[^0-9]/g, ""));
      return n;
    }
  },
  created() {
    this.cargo = this.prop;
    this.$forceUpdate();

    this.cargo.fuel = this.cargo.fuel * 1000;
  }
};
</script>

<style>
</style>