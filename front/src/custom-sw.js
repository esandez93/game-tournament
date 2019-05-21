// See https://developers.google.com/web/tools/workbox/guides/configure-workbox

// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
workbox.clientsClaim();

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// app-shell
workbox.routing.registerRoute("/", workbox.strategies.networkFirst());
workbox.routing.registerNavigationRoute("/index.html", {
  blacklist: [/^\/_/,/\/[^\/]+\.[^\/]+$/],
});