module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/utils/variables.scss";`
      }
    }
  }
};
