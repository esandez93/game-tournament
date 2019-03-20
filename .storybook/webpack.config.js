module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        enforce: 'pre',
      },
    ],
  },
};