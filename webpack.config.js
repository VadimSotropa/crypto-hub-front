module.exports = {
    // other config options
    resolve: {
      fallback: {
        https: require.resolve('https-browserify')
      }
    }
  };