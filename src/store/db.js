const DB_NAME = "library";
const DB_VERSION = 2;
let DB;

export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB);
      }
      let request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        reject("Error");
      };

      request.onsuccess = (e) => {
        DB = e.target.result;
        resolve(DB);
      };

      request.onupgradeneeded = (e) => {
        let db = e.target.result;
        db.createObjectStore("files", { autoIncrement: true, keyPath: "uid" });
      };
    });
  },
  async deleteFile(uid) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["files"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };

      let store = trans.objectStore("files");
      store.delete(uid);
    });
  },
  async getFile(uid) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["files"], "readonly");
      trans.oncomplete = () => {
        resolve(file);
      };

      let store = trans.objectStore("files");
      let file;
      store.get(uid).onsuccess = (e) => {
        file = e.target.result.data;
      };
    });
  },
  async saveFile(file) {
    let db = await this.getDb();

    return new Promise((resolve) => {
      let trans = db.transaction(["files"], "readwrite");
      trans.oncomplete = () => {
        resolve();
      };
      let store = trans.objectStore("files");
      store.add(file);
    });
  },
};
