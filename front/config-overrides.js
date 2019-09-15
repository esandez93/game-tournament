const { rewireWorkboxInject, defaultInjectConfig } = require('react-app-rewire-workbox');
const path = require('path');

module.exports = function override(config, env) {
  // Enable absolute path imports using @
  config.resolve = {
    ...config.resolve,
    alias: { '@': path.resolve(__dirname, 'src') },
  };

  if (env === 'production') {
    console.log('Production build - Adding Workbox for PWAs');
    // Extend the default injection config with required swSrc
    const workboxConfig = {
      ...defaultInjectConfig,
      swSrc: path.join(__dirname, 'src', 'custom-sw.js'),
      importWorkboxFrom: 'local'
    };
    config = rewireWorkboxInject(workboxConfig)(config, env);
  }

  return config;
};
