<template>
  <section>
    <b-table
      :data="data"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-simple="isPaginationSimple"
      :pagination-position="paginationPosition"
      :default-sort-direction="defaultSortDirection"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      :selected.sync="selected"
      :empty="data.length > 1 ? true : false"
    >
      <template slot-scope="props">
        <b-table-column
          v-for="column in columns"
          :field="column.field"
          :label="column.label"
          :key="column.type !== 'object' ? column.field : column.label "
          :numeric="column.numeric ? true : false"
          :centered="column.centered ? true : false"
          sortable
          v-html="cell(props.row, column)"
        ></b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>vazio.</p>
          </div>
        </section>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  props: ["data", "columns", "selectedObj"],
  data() {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: "bottom",
      defaultSortDirection: "asc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      currentPage: 1,
      perPage: 15,
      selected: null
    };
  },
  watch: {
    selected(newValue) {
      this.$emit("etest", newValue);
    }
  },
  methods: {
    cell(row, column) {
      if (column.type) {
        switch (column.type) {
          case "status":
            return this.statusCell(row, column);
          case "currency":
            return this.currencyCell(row, column);
          case "object":
            return this.objectCell(row, column);
          case "date":
            return this.dateCell(row, column);
          case "weight":
            return row[column.field] + " kg";
          case "distance":
            return row[column.field] + " km";
          case "consumption":
            return row[column.field] + " km/L";
          case "fuel":
            return row[column.field] + " L";
          case "type":
            return this.typeCell(row, column);
        }
      }
      return row[column.field];
    },
    statusCell(row, column) {
      if (row[column.field])
        return "<p style='color: hsl(141, 71%, 48%)'>Ativo</p>";
      return "<p style='color: hsl(348, 100%, 61%);'>Inativo</p>";
    },
    currencyCell(row, column) {
      return this.$options.filters.currency(row[column.field]);
    },
    objectCell(row, column) {
      let fields = column["field"].split("->");
      let obj = fields[0];
      let prop = fields[1];

      if (!row[obj]) {
        return "Não há.";
      }

      if (obj in row) {
        return row[obj][prop];
      }
    },
    dateCell(row, column) {
      return this.moment(row[column.field]).format("DD/MM/YYYY");
    },
    typeCell(row, column) {
      if (row[column.field]) {
        return `
          <p style="color: ${row[column.field].color}; ">${row[column.field].name}</p>
      `;
      } else {
        return "Não há";
      }
    }
  }
};
</script>
