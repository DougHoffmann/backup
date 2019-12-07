<template>
  <div class="login-container">
    <div class="login card" style="background-color:rgba(220,220,220, 0.5);">
      <div class="card-content">
        <div class="has-text-centered">
          <span class="is-size-3 is-centered">Login</span>
        </div>
        <form @submit.prevent="submitLogin" @input="form.errors.clear($event.target.name)">
          <b-field
            label="Usuário"
            :type="form.errors.get('user') ? 'is-danger' : ''"
            :message="form.errors.get('user')"
          >
            <b-input v-model="form.user" placeholder="Usuário"></b-input>
          </b-field>

          <b-field
            label="Senha"
            :type="form.errors.get('password') ? 'is-danger' : ''"
            :message="form.errors.get('password')"
          >
            <b-input type="password" v-model="form.password" placeholder="*********"></b-input>
          </b-field>

          <b-field>
            <b-checkbox v-model="form.rememberMe">Remember-me</b-checkbox>
          </b-field>

          <b-field>
            <div class="control has-text-centered">
              <b-button
                type="is-primary"
                tag="input"
                native-type="submit"
                value="Enter"
                :disabled="form.errors.any()"
              ></b-button>
            </div>
          </b-field>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "../../utils/Form";
import axios from "axios";

export default {
  data() {
    return {
      form: new Form({
        user: "",
        password: "",
        rememberMe: false
      })
    };
  },
  methods: {
    submitLogin() {
      if (this.validateForm()) {
        axios
          .post("http://172.16.10.110:3000/auth", {
            user: this.form.user,
            password: this.form.password
          })
          .then(response => {
            let status = response.data.status;
            switch (status) {
              case 0:
                this.form.errors.record({
                  password: "Houve um erro na conexão!"
                });
                break;
              case 1:
                this.form.errors.record({ user: "Usuário inexistente." });
                break;
              case 2:
                this.form.errors.record({ password: "Senha inválida." });
                break;
              case 3:
                this.$emit("submit-login");
                break;
              default:
                break;
            }
          });
      }
    },
    validateForm() {
      let errors = {};
      let result = true;
      if (this.validateField(this.form.user)) {
        errors.user = "Usuário inválido.";
        result = false;
      }

      if (this.validateField(this.form.password)) {
        errors.password = "Senha deve possuir ao menos 4 caracteres.";
        result = false;
      }

      this.form.errors.record(errors);
      return result;
    },
    validateField(field) {
      if (field && field.length > 3) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
    to right top,
    #568fff,
    #009bf8,
    #00a3e9,
    #00a8d5,
    #00aac0,
    #25b1be,
    #3cb8bb,
    #50beb8,
    #54cdc6,
    #58dcd4,
    #5bebe3,
    #5ffbf1
  );
}

.login {
  border-radius: 5px;
  width: 400px;
}
</style>
