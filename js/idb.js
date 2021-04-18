// indexedDB stuff
let indexedDB;
if (self.indexedDB) {
  indexedDB = self.indexedDB;
} else {
  indexedDB = window.indexedDB;
}

// Open database
const request = indexedDB.open("greetings", 1);

let db;

request.onerror = (event) => {
  console.log("error in opening", event);
};

request.onsuccess = (event) => {
  console.log("open success", event);
  db = request.result;
  db.onerror = (event) => {
    console.log("database error", event.target.errorCode);
  };
};

request.onupgradeneeded = (event) => {
  console.log("on upgrade needed");
  const db = request.result;
  const animals = db.createObjectStore("animals", { autoIncrement: true });
  const inBox = db.createObjectStore("inbox", { autoIncrement: true });
};

const saveData = (name, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(name, "readwrite");
    const store = transaction.objectStore(name);
    store.put(data);
    transaction.oncomplete = (event) => {
      console.log("put ready");
      resolve(true);
    };
    transaction.onerror = (event) => {
      console.log("put error");
      reject("put error");
    };
  });
};

const loadData = (name) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(name, "readwrite");
    const store = transaction.objectStore(name);
    const query = store.getAll();
    transaction.oncomplete = (event) => {
      console.log("load ready", query.result);
      resolve(query.result);
    };
    transaction.onerror = (event) => {
      console.log("load error");
      reject("load error");
    };
  });
};

const clearData = (name) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(name, "readwrite");
    const store = transaction.objectStore(name);
    store.clear();
    transaction.oncomplete = (event) => {
      console.log("clear ready");
      resolve(true);
    };
    transaction.onerror = (event) => {
      console.log("clear error");
      reject("clear error");
    };
  });
};
