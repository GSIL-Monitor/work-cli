/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

importScripts(
  "//s3.pstatp.com/motor/sf/car_hero/precache-manifest.dacaeeb42d9a2903fc88763065dbfc65.js"
);

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/https:\/\/s3.pstatp.com\/toutiao\/monitor\/sdk\/slardar.js/, workbox.strategies.staleWhileRevalidate({ cacheName: "slardar-sdk", plugins: [] }), 'GET');
workbox.routing.registerRoute(/https:\/\/s3.pstatp.com\/inapp\/lib\/raven.js/, workbox.strategies.staleWhileRevalidate({ cacheName: "raven-sdk", plugins: [] }), 'GET');
workbox.routing.registerRoute(/https:\/\/s3.pstatp.com\/pgc\/tech\/collect\/collect-.*/, workbox.strategies.cacheFirst({ cacheName: "tea-sdk", plugins: [] }), 'GET');
