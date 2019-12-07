<template>
  <section>
    <b-autocomplete
      v-model="value"
      :field="field"
      :placeholder="placeholder"
      :open-on-focus="true"
      :data="filteredDataObj"
      @select="option => selected = option"
      @input="handleSelect(value)"
    >
      <template slot-scope="props">
        <span>{{props.option[field] }}</span>
      </template>
    </b-autocomplete>
  </section>
</template>

<script>
export default {
  props: ["url", "field", "preSelect", "placeholder"],
  watch: {
    preSelect() {
      if (this.preSelect) {
        this.selected = this.preSelect;
        this.value = this.preSelect[this.field];
      } else {
        this.value = "";
        this.selected = null;
      }
      this.$forceUpdate();
    },
    selected(newValue) {
      this.$emit("selected-value", newValue);
    }
  },
  data() {
    return {
      keepFirst: false,
      openOnFocus: false,
      value: "",
      selected: null,
      data: []
    };
  },
  methods: {
    fetchData(url) {
      this.$http.get(url).then(response => (this.data = response.data));
    },
    handleSelect() {
      if (this.selected) {
        if (this.field in this.selected) {
          if (this.selected[this.field] !== this.value) {
            this.selected = null;
          }
        }
      }
    }
  },
  computed: {
    filteredDataObj() {
      return this.data.filter(option => {
        return (
          option[this.field]
            .toString()
            .toLowerCase()
            .indexOf(this.value.toLowerCase()) >= 0
        );
      });
    }
  },
  created() {
    this.fetchData(this.url);
  }
};
</script>
