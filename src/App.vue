<template>
  <div id="app">
    <transition name="fade">
      <Login v-if="!isLogged" @submit-login="isLogged = true" />
      <div v-else class="app-container">
        <Navbar @logout="logout" />
        <div v-if="isLogged" style="margin-left: 70px; height: 100%;">
          <router-view />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Login from "./components/layout/Login.vue";
import Navbar from "./components/layout/Navbar.vue";

export default {
  components: {
    Login,
    Navbar
  },
  data() {
    return {
      isLogged: false
    };
  },
  methods: {
    logout() {
      this.isLogged = false;
    }
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}
.app-container {
  width: 100%;
  height: 100%;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  float: left;
  overflow: hidden;
  margin: 0 !important;
  padding: 0 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
