"use strict";
self.importScripts("./js/fetchGQL.js");
self.importScripts("./js/idb.js");
const cacheName = "hello-pwa";
const filesToCache = [
  "./",
  "./index.html",
  "./favicon.ico",
  "./css/style.css",
  "./js/main.js",
  "./js/idb.js",
  "./images/pwa.png",
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        const allAnimals = await getAnimals();
        if (allAnimals) {
          const jsonResponse = new Response(JSON.stringify(allAnimals));
          cache.put("/data.json", jsonResponse);
          // console.log(cache);
          return cache.addAll(filesToCache);
        }
      } catch (e) {
        console.log("after install", e.message);
      }
    })()
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const data = await caches.match("/data.json");
        if (data) {
          const json = await data.json();
          if (json) {
            const swListener = new BroadcastChannel("sw-messages");
            swListener.postMessage({ msg: "old_data", animals: json });
          }
        }

        const response = await caches.match(e.request);
        return response || fetch(e.request);
      } catch (e) {
        console.log("load cache", e.message);
      }
    })()
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "send-message") {
    event.waitUntil(sendToServer());
  }
});

const sendToServer = async () => {
  try {
    const animals = await loadData("animals");
    animals.map((animal) => {
      addAnimal(animal);
    });
    clearData("animals");

    const swListener = new BroadcastChannel("sw-messages");
    swListener.postMessage({ msg: "reload_animals" });
  } catch (error) {
    console.log("sending to server error", error.message);
  }
};
