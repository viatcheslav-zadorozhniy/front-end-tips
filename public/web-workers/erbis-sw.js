define(["./workbox-60893cd5"], (function (e) {
  "use strict";
  self.skipWaiting(), e.clientsClaim(), e.precacheAndRoute([{
    revision: null,
    url: "/"
  }, {
    revision: null,
    url: "/careers/"
  }, {
    revision: null,
    url: "/case-studies/"
  }, {
    revision: null,
    url: "/company/"
  }, {
    revision: null,
    url: "/contact/"
  }, {
    revision: null,
    url: "/culture/"
  }, {
    revision: null,
    url: "/de/"
  }, {
    revision: null,
    url: "/de/case-studies/"
  }, {
    revision: null,
    url: "/how-we-work/"
  }, {
    revision: null,
    url: "/industries/"
  }, {
    revision: null,
    url: "/projects/cloud-structure-for-saas/"
  }, {
    revision: null,
    url: "/projects/supply-chain-management-system/"
  }, {
    revision: null,
    url: "/projects/w-print/"
  }, {
    revision: null,
    url: "/services/"
  }, {
    revision: null,
    url: "/services/software-engineering/"
  }, {
    url: "careers.bundle-ccfbb809296ab17529ac.js",
    revision: null
  }, {
    url: "carousel.bundle-d671b3127650b5101f3f.js",
    revision: null
  }, {
    url: "contact.bundle-fd9ec2554b565db00708.js",
    revision: null
  }, {
    url: "download.bundle-b8917693a6c6fb521e10.js",
    revision: null
  }, {
    url: "intro-animation.js",
    revision: "b748aa6e9a99a54b708df25b9332f510"
  }, {
    url: "main.bundle-d1037b6f937523c69d57.js",
    revision: null
  }, {
    url: "particle-spread-animation.bundle-eb0c76fcd2515b0a2460.js",
    revision: null
  }, {
    url: "runtime.bundle-b7c3c40312999f3bbf96.js",
    revision: null
  }], {}), e.registerRoute((({
    url: e
  }) => e.origin.includes("erbis.com") && e.pathname.endsWith("/")), new e.StaleWhileRevalidate({
    cacheName: "html-cache",
    plugins: []
  }), "GET"), e.registerRoute((({
    request: e
  }) => "font" === e.destination), new e.CacheFirst({
    cacheName: "fonts-cache",
    plugins: []
  }), "GET"), e.registerRoute((({
    request: e,
    url: n
  }) => n.origin.includes("erbis.com") && "script" === e.destination && !n.pathname.includes(".css.")), new e.CacheFirst({
    cacheName: "scripts-cache",
    plugins: []
  }), "GET"), e.registerRoute((({
    request: e
  }) => "image" === e.destination), new e.CacheFirst({
    cacheName: "images-cache",
    plugins: [new e.ExpirationPlugin({
      maxEntries: 20,
      purgeOnQuotaError: !0
    })]
  }), "GET")
}));