<template>
  <div>
    <Form :form="formData" @submit-form="showModal" :show="show" />

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
          <button ref="confirmBtn" class="button is-fullwidth is-success" @click="submit">Confirmar</button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import FormDirector from "../utils/FormDirector";
import Form from "./Form.vue";
import Vue from "vue";

export default {
  props: ["form", "url", "data", "show"],
  components: {
    Form
  },
  data() {
    return {
      formData: {},
      isComponentModalActive: false,
      newData: null
    };
  },
  watch: {
    data() {
      this.setValues();
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
  methods: {
    showModal(data) {
      this.newData = data;
      this.isComponentModalActive = true;
    },
    submit() {
      this.isComponentModalActive = false;
      this.$http.post(this.url, this.newData).then(response => {
        this.$emit("update-data", response);
      });
    },
    setValues() {
      let keys = Object.keys(this.data);
      keys = keys.filter(key => key !== "_id");
      keys = keys.filter(key => key !== "__v");
      keys.forEach(key => {
        if (key in this.formData && "type" in this.formData[key]) {
          if (this.formData[key].type === "date") {
            this.formData[key].value = new Date(this.data[key]);
          } else {
            this.formData[key].value = this.data[key];
          }
        }
      });
    }
  },
  created() {
    this.formData = new FormDirector(this.form);
    if (this.data) {
      this.setValues();
    }
  }
};
</script>

<style></style>
