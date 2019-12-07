<template>
  <div style="height: 100%;">
    <div class="table-container" :class="showPanel ? '' : 'full'">
      <div class="card">
        <div class="card-content">
          <h2 class="is-size-2">Motoristas</h2>
          <b-button
            style="float: right"
            type="is-primary"
            @click="addDriverPanel"
          >Adicionar Motorista</b-button>
          <Table class="mt-50" :columns="columns" :data="drivers" @etest="selectDriver" />
        </div>
      </div>
    </div>

    <div class="side-panel" :class="showPanel ? 'active' : 'inactive'">
      <div class="right-panel">
        <b-button type="is-primary" @click="closePanel" outlined>
          <i class="fas fa-arrow-left"></i> &nbsp;&nbsp; Voltar
        </b-button>
        <br />
        <h3
          class="is-size-3 mt-10"
        >{{ selectedDriver._id === 0 ? 'Adicionar Motorista' : 'Motorista' }}</h3>

        <FormBuilder
          :show="showPanel"
          form="addDriver"
          :url="'driver' + (selectedDriver._id !== 0 ? '/' + selectedDriver._id : '') "
          :data="selectedDriver"
          @update-data="fetchDrivers"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Table from "../components/tables/Table.vue";
import FormBuilder from "../components/FormBuilder.vue";
export default {
  components: {
    Table,
    FormBuilder
  },
  data() {
    return {
      drivers: [],
      columns: [
        {
          field: "name",
          label: "Nome"
        },
        {
          field: "license",
          label: "Carteira"
        },
        {
          field: "salary",
          label: "Salário",
          numeric: true,
          type: "currency"
        },
        {
          field: "status",
          label: "Status",
          centered: true,
          type: "status"
        }
      ],
      showPanel: false,
      selectedDriver: { _id: 0 }
    };
  },
  methods: {
    resetSelected() {
      this.selectedDriver = {
        _id: 0,
        name: "",
        license: "",
        truck: "",
        salary: "Gs. ",
        status: true
      };
    },
    closePanel() {
      this.showPanel = false;
      this.fetchDrivers();
      this.resetSelected();
    },
    addDriverPanel() {
      this.resetSelected();
      this.showPanel = true;
    },
    fetchDrivers() {
      this.$http.get("driver").then(response => (this.drivers = response.data));
      this.showPanel = false;
      this.$forceUpdate();
    },
    selectDriver(e) {
      this.selectedDriver = e;
      this.showPanel = true;
    }
  },
  created() {
    this.fetchDrivers();
  }
};
</script>

<style lang="scss">
.color-is-primary {
  color: $primary;
}

.table-container {
  width: 80%;
  float: left;
  transition: all 0.5s;

  &.full {
    width: 100%;
  }
}

.side-panel {
  float: left;
  height: 100%;
  transition: all 0.5s;

  &.active {
    width: 20%;
    opacity: 1;
  }

  &.inactive {
    width: 0%;
    opacity: 0;
  }
}

.right-panel {
  background-color: $light;
  height: 100%;
  border-left: 1px solid $grey-lighter;
  padding: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  width: 0;
  transform: translateX(200px);
}
</style>
