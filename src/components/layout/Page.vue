<template>
  <div style="height: 100%">
    <div class="table-container" :class="showPanel ? '' : 'full'">
      <div class="card">
        <div class="card-content">
          <slot name="pageContent"></slot>
        </div>
      </div>
    </div>

    <div class="side-panel" :class="showPanel ? 'active' : 'inactive'">
      <div class="right-panel">
        <b-button type="is-primary" @click="$emit('close-panel')" outlined>
          <i class="fas fa-arrow-left"></i> &nbsp;&nbsp; Voltar
        </b-button>
        <br />
        <slot name="panelContent"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["showPanel"],
  data() {
    return {};
  },
  methods: {
    closePanel() {
      this.showPanel = false;
    }
  }
};
</script>

<style lang="scss">
.color-is-primary {
  color: $primary;
}

.table-container {
  width: 76%;
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
    width: 24%;
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
