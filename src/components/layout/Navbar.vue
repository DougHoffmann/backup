<template>
  <div class="nav">
    <div class="top">
      <div class="item logo">
        <i class="fas fa-rocket fa-lg"></i>
      </div>
    </div>
    <div class="center">
      <router-link
        v-for="(route, index) in routes"
        :key="index"
        class="item"
        :to="'/' + route.path"
      >
        <i :class="'fas fa-' + route.icon + ' fa-lg'"></i>
      </router-link>
    </div>
    <div class="bottom">
      <div class="item logo" @click="$emit('logout')">
        <i class="fas fa-sign-out-alt fa-lg"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideNav",
  data() {
    return {
      routes: [
        { path: "driver", icon: "user" },
        { path: "truck", icon: "truck" },
        { path: "freight", icon: "truck-loading" },
        { path: "warehouse", icon: "warehouse" },
        { path: "test", icon: "cogs" }
      ]
    };
  }
};
</script>

<style lang="scss">
.nav {
  width: 70px;
  height: 100%;
  display: flex;
  position: fixed;
  background-color: $light;
  flex-direction: column;
}

%section {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.top {
  @extend %section;
}

.center {
  @extend %section;
  justify-content: center;
}

.bottom {
  @extend %section;
  justify-content: flex-end;
}

.item {
  height: 50px;
  width: 100%;
  text-align: center;
  line-height: 50px;
  color: $primary;
  &:hover {
    cursor: pointer;
    color: $primary-hover;
    background-color: $grey-lighter;
  }
}

.router-link-active {
  border-right: 2px solid $primary;
  color: $primary-hover;
  background: $grey-lighter;
  box-sizing: border-box;
}
</style>
