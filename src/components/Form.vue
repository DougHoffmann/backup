<template>
  <form @submit.prevent="submitForm" @input="errors.clear($event.target.id)">
    <b-field
      v-for="key in Object.keys(form)"
      :label="form[key].label"
      :key="form[key].label"
      :type="errors.get(key) ? 'is-danger' : ''"
      :message="errors.get(key)"
    >
      <b-input
        v-if="form[key].type === 'string' || form[key].type === 'currency'"
        v-model="form[key].value"
        :placeholder="form[key].placeholder"
        v-money="form[key].type === 'currency' ? moneyConfig : ''"
        :id="key"
      ></b-input>

      <b-switch v-if="form[key].type === 'switch'" v-model="form[key].value">{{ form[key].tag }}</b-switch>

      <CityField
        :label="form[key].label"
        v-if="form[key].type === 'city'"
        @select-city="value => (form[key].value = value)"
        :preSelect="form[key].value "
        :error="errors.get(key)"
        :key="form[key].label"
      />

      <b-datepicker
        v-if="form[key].type === 'date'"
        :date-formatter="date => moment(date).format('DD/MM/YYYY')"
        :month-names="moment.months()"
        :day-names="moment.weekdaysShort()"
        v-model="form[key].value"
        placeholder="Clique para selecionar..."
      ></b-datepicker>

      <Autocomplete
        v-if="form[key].type === 'autocomplete'"
        :url="form[key].url"
        :placeholder="form[key].placeholder"
        :field="form[key].field"
        @selected-value="value => (form[key].value = value)"
        :preSelect="form[key].value"
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
</template>

<script>
import Errors from "../utils/Errors";
import CityField from "./fields/CityField.vue";
import Autocomplete from "./fields/Autocomplete.vue";
import Vue from "vue";

export default {
  props: ["form", "show"],
  components: { CityField, Autocomplete },
  watch: {
    show() {
      this.errors = new Errors();
    }
  },
  data() {
    return {
      moneyConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "Gs. ",
        suffix: "",
        precision: 0,
        masked: false
      },
      errors: new Errors()
    };
  },
  methods: {
    submitForm() {
      this.validateForm();
    },
    extractData() {
      let keys = Object.keys(this.form);
      let result = {};
      keys.forEach(key => {
        let field = this.form[key];
        if (field.type === "currency") {
          result[key] = Vue.filter("number")(field.value);
        } else {
          result[key] = field.value;
        }
      });
      return result;
    },
    validateForm() {
      let keys = Object.keys(this.form);
      let required = keys.filter(key => this.form[key].required);
      let errors = {};
      required.forEach(key => {
        //City
        if (this.form[key].type === "city") {
          if (this.form[key].value && this.form[key].value.name.length < 3)
            errors[key] = "Este campo é obrigatório";
        }

        //autocomplete
        else if (this.form[key].type === "autocomplete") {
          if (this.form[key].value[this.form[key].field].length < 3)
            errors[key] = "Este campo é obrigatório";
        }

        // others... STRING
        else if (this.form[key].value.length < 3) {
          errors[key] = "Este campo é obrigatório!";
        }

        //record errors
        this.errors.record(errors);
      });
      if (!this.errors.any()) {
        this.$emit("submit-form", this.extractData());
        this.clearForm();
      }
    },
    clearForm() {
      let keys = Object.keys(this.form);
      keys.forEach(key => {
        let field = this.form[key];
        if (field.type === "currency") {
          field.value = "Gs. ";
        } else if (field.type === "string") {
          field.value = "";
        }
      });
    },
    fetchData(url) {
      return new Promise(resolve => {
        this.$http.get(url).then(response => {
          resolve(response.data);
        });
      });
    }
  }
};
</script>

<style></style>
