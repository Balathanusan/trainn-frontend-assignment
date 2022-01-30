import { createStore } from "vuex";
import idb from "@/store/db.js";
import toaster from "@/utils/toaster.js";
function updateLocalstorage(state) {
  localStorage.setItem("files", JSON.stringify({ ...state.structure }));
}
export default createStore({
  // Initial state
  state() {
    return {
      structure: {
        root: {},
        childrens: {},
      },
    };
  },

  // Getters
  getters: {
    getItems: (state) => (folder, sort) => {
      let node = folder
        ? state.structure.childrens[folder]
        : state.structure.root;

      // Splitting folders and files
      let payload = {
        folders: [],
        files: [],
      };
      for (let key in node) {
        if (key.includes("_folder")) {
          node[key].uid = key;
          payload.folders.push(node[key]);
        }
        if (key.includes("_file")) {
          node[key].uid = key;
          payload.files.push(node[key]);
        }
      }

      // Sorting 'Name'
      if (sort == "Name") {
        payload.folders.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        payload.files.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        return payload;
      }

      // Sorting 'LargeSize'
      if (sort == "LargeSize") {
        payload.folders.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        payload.files.sort((a, b) => {
          return a.size < b.size ? 1 : -1;
        });
        return payload;
      }

      // Sorting 'SmallSize'
      if (sort == "SmallSize") {
        payload.folders.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        payload.files.sort((a, b) => {
          return a.size > b.size ? 1 : -1;
        });
        return payload;
      }

      // Sorting 'Latest'
      if (sort == "Latest") {
        payload.folders.sort((a, b) => {
          return a.timestamp < b.timestamp ? 1 : -1;
        });
        payload.files.sort((a, b) => {
          return a.timestamp < b.timestamp ? 1 : -1;
        });
        return payload;
      }

      // Sorting 'Oldest'
      if (sort == "Oldest") {
        payload.folders.sort((a, b) => {
          return a.timestamp > b.timestamp ? 1 : -1;
        });
        payload.files.sort((a, b) => {
          return a.timestamp > b.timestamp ? 1 : -1;
        });
        return payload;
      }
    },
  },

  // Mutations
  mutations: {
    // Initializing state
    setStructure(state, files) {
      state.structure = { ...files };
    },

    // Add File index
    addFileIndex(state, payload) {
      const { parentUid, gParentUid, timestamp, fileName, fileSize, uid } =
        payload;
      let node;
      if (!parentUid) {
        node = state.structure.root;
      } else {
        if (!state.structure.childrens[parentUid]) {
          state.structure.childrens[parentUid] = {};
        }
        node = state.structure.childrens[parentUid];
      }

      node[uid] = {
        name: fileName,
        size: fileSize,
        timestamp: timestamp,
        uid: uid,
      };

      if (parentUid) {
        if (state.structure.root[parentUid]) {
          state.structure.root[parentUid].files.push(uid);
        } else {
          state.structure.childrens[gParentUid][parentUid].files.push(uid);
        }
      }
      toaster("green", `File uploaded '${fileName}'.`);
      updateLocalstorage(state);
    },

    // Add folder Index
    addFolderIndex(state, payload) {
      const { uid, time, folderName, parentUid, gParentUid } = payload;
      let node;
      if (!parentUid) {
        node = state.structure.root;
      } else {
        if (!state.structure.childrens[parentUid]) {
          state.structure.childrens[parentUid] = {};
        }
        node = state.structure.childrens[parentUid];
      }
      node[uid] = {
        name: folderName,
        timestamp: time,
        folders: [],
        files: [],
      };
      if (gParentUid) {
        if (!state.structure.childrens[gParentUid]) {
          state.structure.childrens[gParentUid] = {};
        }
        if (!state.structure.childrens[gParentUid][parentUid]) {
          state.structure.childrens[gParentUid][parentUid] = {};
        }
        state.structure.childrens[gParentUid][parentUid].folders.push(uid);
      } else {
        if (parentUid) {
          state.structure.root[parentUid].folders.push(uid);
        }
      }
      toaster("green", `Folder created '${folderName}'.`);
      updateLocalstorage(state);
    },

    // Moving
    moveItem(state, payload) {
      const { uid, to, parentUid, gParentUid } = payload;
      const itemType = uid.includes("_folder") ? "folders" : "files";

      const addIndex = () => {
        if (parentUid) {
          state.structure.childrens[parentUid][to][itemType].push(uid);
        } else {
          state.structure.root[to][itemType].push(uid);
        }
      };
      const removeIndex = () => {
        if (parentUid) {
          if (state.structure.root[parentUid]) {
            state.structure.root[parentUid][itemType].filter((item) => {
              return item != uid;
            });
          } else if (gParentUid) {
            state.structure.childrens[gParentUid][parentUid][itemType].filter(
              (item) => {
                return item != uid;
              }
            );
          }
        }
      };

      if (to) {
        if (parentUid) {
          let thisItemCopy = JSON.parse(
            JSON.stringify(state.structure.childrens[parentUid][uid])
          );
          delete state.structure.childrens[parentUid][uid];
          if (!state.structure.childrens[to]) {
            state.structure.childrens[to] = {};
          }
          state.structure.childrens[to][uid] = thisItemCopy;
          addIndex();
          removeIndex();
          toaster("green", `Moved '${thisItemCopy.name}' to ${to}.`);
          updateLocalstorage(state);
        } else {
          let thisItemCopy = JSON.parse(
            JSON.stringify(state.structure.root[uid])
          );
          delete state.structure.root[uid];
          if (!state.structure.childrens[to]) {
            state.structure.childrens[to] = {};
          }
          state.structure.childrens[to][uid] = thisItemCopy;
          addIndex();
          removeIndex();
          toaster("green", `Moved '${thisItemCopy.name}' to ${to}.`);
          updateLocalstorage(state);
        }
      }
    },
  },

  // Actions
  actions: {
    // General
    fetchStoredFiles({ commit, state }) {
      const localFiles = JSON.parse(localStorage.getItem("files"));
      if (!localFiles) {
        localStorage.setItem("files", JSON.stringify({ ...state.structure }));
      } else {
        commit("setStructure", localFiles);
      }
    },

    // Create folder
    createFolder({ dispatch, commit }, payload) {
      const time = Date.now();
      const uid =
        time +
        Math.floor(Math.random() * 100) +
        Math.floor(Math.random() * 1000);
      const thisUid = `_folder_${uid}`;

      const { folderName, entries, parentUid, uploadMode, gParentUid } =
        payload;

      commit("addFolderIndex", {
        uid: thisUid,
        time: time,
        folderName: folderName,
        parentUid: parentUid,
        gParentUid: gParentUid ? gParentUid : null,
      });
      if (uploadMode == "inputFile") {
        // If uploaded using inputFile
        for (let level in entries) {
          if (level == 0) {
            let subFiles = entries[level].files;
            for (let i = 0; i < subFiles.length; i++) {
              dispatch("uploadFile", {
                file: entries[level].files[i],
                parentUid: thisUid,
                gParentUid: parentUid,
              });
            }
          }
        }
        let subFolders = entries;
        subFolders.shift();
        if (subFolders.length > 0) {
          dispatch("createFolder", {
            folderName: subFolders[0].dirName,
            entries: subFolders,
            parentUid: thisUid,
            uploadMode: "inputFile",
            gParentUid: parentUid,
          });
        }
      } else {
        // If uploaded using drag adn drop
        for (let i in entries) {
          const entry = entries[i];
          if (entry.isFile) {
            entry.file((file) => {
              dispatch("uploadFile", {
                file: file,
                parentUid: thisUid,
                gParentUid: parentUid,
              });
            });
          } else {
            let folderName = entry.name;
            let dirReader = entry.createReader();
            dirReader.readEntries(
              function (entries) {
                let filteredEntries = entries.filter((entry) => {
                  return !entry.name.startsWith(".");
                });
                dispatch("createFolder", {
                  folderName: folderName,
                  entries: filteredEntries,
                  parentUid: thisUid,
                  uploadMode: null,
                  gParentUid: parentUid,
                });
              },
              function (error) {}
            );
          }
        }
      }
    },

    // Upload File
    // 1. File data will be uploaded toindexedDB
    // 2. File index will be added to state
    async uploadFile({ commit }, payload) {
      const time = Date.now();
      const uid =
        time +
        Math.floor(Math.random() * 100) +
        Math.floor(Math.random() * 1000);
      const thisUid = `_file_${uid}`;

      const { file, parentUid, gParentUid } = payload;

      await idb.saveFile({
        data: file,
        uid: thisUid,
      });

      commit("addFileIndex", {
        parentUid: parentUid,
        gParentUid: gParentUid,
        timestamp: time,
        fileName: file.name,
        fileSize: file.size,
        uid: thisUid,
      });
    },

    // Rename folder
    renameFolder({ state }, payload) {
      const { name, uid, parentUid, gParentUid } = payload;
      let curName;
      if (!parentUid) {
        curName = state.structure.root[uid].name;
        state.structure.root[uid].name = name;
      } else {
        curName = state.structure.childrens[parentUid][uid].name;
        state.structure.childrens[parentUid][uid].name = name;
      }
      toaster("green", `Renamed '${curName}' to ${name}.`);
      updateLocalstorage(state);
    },

    // Delete item
    deleteItem({ state }, payload) {
      const { name, uid, parentUid, gParentUid } = payload;
      const itemType = uid.includes("_folder") ? "folders" : "files";
      if (!parentUid) {
        delete state.structure.root[uid];
      } else {
        delete state.structure.childrens[parentUid][uid];
        if (state.structure.root[parentUid]) {
          state.structure.root[parentUid][itemType] = state.structure.root[
            parentUid
          ][itemType].filter((item) => {
            return item != uid;
          });
        } else if (gParentUid) {
          state.structure.childrens[gParentUid][parentUid][itemType] =
            state.structure.childrens[gParentUid][parentUid][itemType].filter(
              (item) => {
                return item != uid;
              }
            );
        }
      }
      toaster("red", `'${name}' Deleted.`);
      updateLocalstorage(state);
    },
  },
});
