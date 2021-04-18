"use strict";

window.addEventListener("load", async () => {
  const ul = document.querySelector("ul");
  const rfrsh = document.querySelector("#refresh");
  const form = document.querySelector("form");
  const animalName = form.elements.animal_name;
  const speciesId = form.elements.species_id;

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
      const registration = await navigator.serviceWorker.ready;
      if ("sync" in registration) {
        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const animal = {
            animalName: animalName.value,
            species: speciesId.value,
          };

          try {
            saveData("animals", animal);
            await registration.sync.register("send-message");
          } catch (error) {
            console.log("save error", error.message);
          }
        });
      }
    } catch (error) {
      console.log("serviceworker error");
    }

    const channel = new BroadcastChannel("sw-messages");
    channel.addEventListener("message", (event) => {
      if (event.data.msg === "reload_animals") {
        init();
      } else if (event.data.msg === "old_data") {
        ul.innerHTML = "";
        event.data.animals.forEach((item) => {
          ul.innerHTML += `<ul>Animal name:${item.animalName}, Species: ${item.species.speciesName}, Category: ${item.species.category.categoryName}</ul>`;
        });
      }
    });
  }

  const init = async () => {
    const data = [];
    try {
      const allAnimals = await getAnimals();
      for (const animal of allAnimals) {
        data.push(animal);
      }
    } catch (e) {
      console.log(e.message);
    }

    ul.innerHTML = "";
    data.forEach((item) => {
      ul.innerHTML += `<ul>Animal name:${item.animalName}, Species: ${item.species.speciesName}, Category: ${item.species.category.categoryName}</ul>`;
    });
  };

  init();

  rfrsh.addEventListener("click", init);
});
