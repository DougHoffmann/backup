<template>
  <b-autocomplete
    v-model="name"
    ref="autocomplete"
    field="name"
    :data="filteredDataArray"
    :open-on-focus="true"
    placeholder="ex. São Paulo"
    @select="option => selected = option"
  >
    <template slot-scope="props">
      <span>{{props.option.name }}</span>

      <span class="country-text">{{' - ' + props.option.country}}</span>
    </template>

    <template slot="footer">
      <a @click="showAddFruit">
        <span>Adicionar...</span>
      </a>
    </template>
    <template slot="empty">Sem resultados para {{name}}</template>
  </b-autocomplete>
</template>

<script>
export default {
  props: ["preSelect", "label", "error"],
  data() {
    return {
      data: [],
      name: "",
      selected: null
    };
  },
  watch: {
    preSelect() {
      if (this.preSelect) {
        this.selected = this.preSelect;
        this.name = this.preSelect.name;
      } else {
        this.name = "";
        this.selected = null;
      }
      this.$forceUpdate();
    },
    selected(value) {
      this.$emit("select-city", value);
    }
  },
  computed: {
    filteredDataArray() {
      let result = [];

      for (let i = 0; i < this.data.length && result.length < 10; i++) {
        if (
          this.data[i].name
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        ) {
          result.push(this.data[i]);
        }
      }

      return result;
    }
  },
  methods: {
    fetchLocations() {
      this.$http.get("location").then(response => {
        let dataObj = response.data;
        dataObj.forEach(city => {
          this.data.push(city);
        });
      });
    },
    checkCountry(country) {
      switch (country) {
        case "br":
          return "Brasil";
        case "py":
          return "Paraguay";
        case "arg":
          return "Argentina";
        case "chl":
          return "Chile";
        default:
          return "Paraguay";
      }
    },
    showAddFruit() {
      this.$buefy.dialog.prompt({
        message: `Adicionar`,
        inputAttrs: {
          placeholder: "ex. São Paulo",
          maxlength: 30,
          value: this.name
        },
        confirmText: "Adicionar",
        onConfirm: value => {
          let country = "",
            city = "";
          if (value.indexOf("//") > -1) {
            let result = value.split("//");
            city = result[0];
            country = result[1];
            country = this.checkCountry(country);
          } else {
            city = value;
            country = "Paraguay";
          }

          let newCity = {
            name: city,
            country: country
          };

          this.$http.post("location", newCity).then(() => {
            this.$refs.autocomplete.setSelected(newCity);
            this.$emit("select-city", newCity);
            this.data.push(newCity);
          });
        }
      });
    }
  },
  created() {
    this.fetchLocations();
  }
};
</script>
]
<style lang="scss">
.country-text {
  color: $grey-light;
}
</style>