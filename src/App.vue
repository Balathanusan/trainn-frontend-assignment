<template>
  <div @click="contextMenuTarget ? rightClick('close') : null">
    <Header />
    <div class="actions">
      <div>
        <button
          class="back"
          @click="folderBack()"
          :class="{ active: activeFolderUid != '' }"
        >
          <span class="mdi mdi-arrow-left-circle-outline"></span> Back
        </button>
      </div>
      <div>
        <button class="create" @click="createModal = true" ref="createFolder">
          Create Folder
          <span class="mdi mdi-folder-plus"></span>
        </button>
        <button class="upload" @click="$refs.uploadFiles.click()">
          Upload Files <span class="mdi mdi-file-upload"></span>
          <input
            type="file"
            ref="uploadFiles"
            multiple
            @change="fileUpload($event)"
          />
        </button>
        <button class="upload" @click="$refs.uploadFolders.click()">
          Upload Folder <span class="mdi mdi-folder-upload"></span>
          <input
            type="file"
            webkitdirectory
            ref="uploadFolders"
            @change="fileDirectory($event)"
          />
        </button>
      </div>
    </div>
    <div id="library">
      <div class="menu">
        <div class="breadCrumbs">
          <div>
            <button
              class="home"
              @click="
                paths = [];
                activeFolderUid = '';
              "
            >
              <span class="mdi mdi-home"></span>
              Library
            </button>
          </div>
          <div
            v-for="(path, index) in paths"
            :key="path.key"
            :class="{ active: path.key == activeFolderUid }"
          >
            <span class="mdi mdi-chevron-right"></span>
            <button @click="openFolder(path.key, path.name, index)">
              <span class="mdi mdi-folder"></span>
              {{ path.name }}
            </button>
          </div>
        </div>
        <div class="options">
          <div>
            <button @click="sortDropdown = !sortDropdown">
              Sort
              <span class="mdi mdi-sort-ascending"></span>
            </button>
            <div class="dropDown" :class="{ active: sortDropdown }">
              <div
                class="item"
                @click="(sortType = 'Name'), (sortDropdown = false)"
                :class="{ active: sortType == 'Name' }"
              >
                Name<span class="mdi mdi-check"></span>
              </div>
              <div
                class="item"
                @click="(sortType = 'LargeSize'), (sortDropdown = false)"
                :class="{ active: sortType == 'LargeSize' }"
              >
                Large size<span class="mdi mdi-check"></span>
              </div>
              <div
                class="item"
                @click="(sortType = 'SmallSize'), (sortDropdown = false)"
                :class="{ active: sortType == 'SmallSize' }"
              >
                Small size<span class="mdi mdi-check"></span>
              </div>
              <div
                class="item"
                @click="(sortType = 'Latest'), (sortDropdown = false)"
                :class="{ active: sortType == 'Latest' }"
              >
                Latest<span class="mdi mdi-check"></span>
              </div>
              <div
                class="item"
                @click="(sortType = 'Oldest'), (sortDropdown = false)"
                :class="{ active: sortType == 'Oldest' }"
              >
                Oldest<span class="mdi mdi-check"></span>
              </div>
            </div>
          </div>
          <div>
            <button @click="viewMode = viewMode == 'grid' ? 'list' : 'grid'">
              View
              <span class="mdi mdi-grid-large" v-if="viewMode == 'grid'"></span>
              <span class="mdi mdi-view-list" v-if="viewMode == 'list'"></span>
            </button>
          </div>
        </div>
      </div>
      <!-- Structure -->
      <div
        class="structure"
        @dragover="dragOver($event)"
        @dragenter="dragEnter($event)"
        @dragleave="dragLeave($event)"
        @drop="dropped($event, 'background')"
        @contextmenu="rightClick"
        data-type="background"
        data-uid=""
        :class="{
          empty: !getItems.folders.length && !getItems.files.length,
          grid: viewMode == 'grid',
          list: viewMode == 'list',
          contextMenu:
            contextMenuTarget && contextMenuTarget.type == 'background',
        }"
      >
        <div class="folderWrapper">
          <Folder
            v-for="folder in getItems.folders"
            :key="folder.uid"
            :data="{ uid: folder.uid, info: folder }"
            @dblclick="openFolder(folder.uid, folder.name)"
            draggable="true"
            @dragstart="dragStart($event)"
            @dragover="dragOver($event)"
            @dragenter="dragEnter($event)"
            @dragleave="dragLeave($event)"
            @drop="dropped($event, 'folder')"
            data-type="folder"
            :data-uid="folder.uid"
            :data-name="folder.name"
            :class="{
              contextMenu:
                contextMenuTarget && contextMenuTarget.uid == folder.uid,
            }"
          />
        </div>
        <div class="fileWrapper">
          <File
            v-for="file in getItems.files"
            :data="{ uid: file.uid, info: file }"
            draggable="true"
            @dragstart="dragStart($event)"
            @dragover="dragOver($event)"
            @dragenter="dragEnter($event)"
            @dragleave="dragLeave($event)"
            data-type="file"
            :data-uid="file.uid"
            :data-name="file.name"
            :class="{
              contextMenu:
                contextMenuTarget && contextMenuTarget.uid == file.uid,
            }"
          />
        </div>
        <div
          class="empty"
          v-if="!getItems.folders.length && !getItems.files.length"
        >
          <img src="@/assets/empty.svg" />
          <div class="large">Drop Files or Folders here</div>
          <div class="small">or use 'Upload Files/Folder' button.</div>
        </div>
      </div>
    </div>
    <!-- Modals -->
    <div
      class="modalWrapper"
      :class="{ active: createModal || renameModal || deleteModal }"
    >
      <div class="transition">
        <CreateFolder
          v-if="createModal"
          @dismissModal="dismissModal()"
          @createNewFolder="createNewFolder"
        />
        <RenameFolder
          v-if="renameModal"
          @dismissModal="dismissModal()"
          @renameFolder="renameFolder"
          :data="contextMenuTarget"
        />
        <DeleteItem
          v-if="deleteModal"
          @dismissModal="dismissModal()"
          @deleteItem="deleteItem"
          :data="contextMenuTarget"
        />
      </div>

      <div class="bg" @click="dismissModal()"></div>
    </div>
    <!-- Context menu -->
    <div id="contextMenu" ref="contextMenu">
      <div
        class="item"
        v-if="contextMenuTarget.type == 'background'"
        @click="$refs.createFolder.click()"
      >
        Create folder
      </div>
      <div
        class="item"
        v-if="contextMenuTarget.type == 'folder'"
        @click="renameFolderAsk()"
      >
        Rename
      </div>
      <div
        class="item"
        v-if="contextMenuTarget.type != 'background'"
        @click="deleteItemAsk()"
      >
        Delete
      </div>
    </div>
    <!-- Toasts -->
    <div id="toasts"></div>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Folder from "@/components/format/Folder.vue";
import File from "@/components/format/File.vue";
import CreateFolder from "@/components/modals/CreateFolder.vue";
import RenameFolder from "@/components/modals/RenameFolder.vue";
import DeleteItem from "@/components/modals/DeleteItem.vue";

export default {
  name: "App",
  components: {
    Header,
    Folder,
    File,
    CreateFolder,
    RenameFolder,
    DeleteItem,
  },
  data() {
    return {
      paths: [], // Breadcrumbs
      activeFolderUid: "",
      viewMode: "grid", // grid or list
      sortType: "Name", // Large size, Small Size, Latest, Oldest
      sortDropdown: false,
      overTraget: "", // Current drop position while dragging // to identify exact drop position
      createModal: false,
      renameModal: false,
      deleteModal: false,
      contextMenuTarget: "",
    };
  },
  methods: {
    openFolder(key, name, index = null) {
      this.activeFolderUid = key;
      this.paths.push({
        key,
        name,
      });

      if (index != null) {
        this.paths.splice(index + 1);
      }
    },
    folderBack() {
      if (this.paths.length == 1) {
        this.activeFolderUid = "";
        this.paths.pop();
      } else {
        this.activeFolderUid = this.paths[this.paths.length - 2].key;
        this.paths.pop();
      }
    },
    dragStart(event) {
      let type = event.target.getAttribute("data-type");
      let uid = event.target.getAttribute("data-uid");

      event.dataTransfer.setData("dragType", type);
      event.dataTransfer.setData("dragUid", uid);
      // event.dataTransfer.setDragImage(
      //   event.target.querySelector(".name"),
      //   50,
      //   50
      // );
    },
    dragOver(event) {
      event.preventDefault();
    },
    dragEnter(event) {
      event.preventDefault();
      event.target.classList.add("targetting");
      let type = event.target.getAttribute("data-type");
      this.overTraget = type;
    },
    dragLeave(event) {
      event.preventDefault();
      event.target.classList.remove("targetting");
    },
    dropped(event, type) {
      event.preventDefault();
      if (type == this.overTraget) {
        this.overTraget = "";
        event.target.classList.remove("targetting");
        var dragType = event.dataTransfer.getData("dragType");
        var dragUid = event.dataTransfer.getData("dragUid");
        if (dragType) {
          // Folder/File moving
          this.$store.commit("moveItem", {
            uid: dragUid,
            to: event.target.getAttribute("data-uid"),
            parentUid: this.activeFolderUid,
            gParentUid:
              this.paths.length >= 2
                ? this.paths[this.paths.length - 2].key
                : "",
          });
        } else {
          // Folder/File upload
          if (event.dataTransfer.items) {
            var dataList = event.dataTransfer.items;
            for (var i = 0; i < dataList.length; i++) {
              if (dataList[i].kind === "file") {
                var entry = dataList[i].webkitGetAsEntry();
                if (entry.isFile) {
                  var file = dataList[i].getAsFile();
                  if (!entry.name.startsWith(".")) {
                    this.commitFile(file);
                  }
                } else {
                  let folderName = entry.name;
                  let dirReader = entry.createReader();
                  dirReader.readEntries(
                    (entries) => {
                      let filteredEntries = entries.filter((entry) => {
                        return !entry.name.startsWith(".");
                      });
                      this.commitFolder(folderName, filteredEntries);
                    },
                    function (error) {}
                  );
                }
              }
            }
          } else {
            // For other browsers: not tested
            for (var i = 0; i < event.dataTransfer.files.length; i++) {
              console.log(
                "file_B[" + i + "].name = " + event.dataTransfer.files[i].name
              );
            }
          }
        }
      }
    },
    fileUpload(event) {
      for (var i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        if (!file.name.startsWith(".")) {
          this.commitFile(event.target.files[i]);
        }
      }
    },
    fileDirectory(event) {
      let rawEntries = Object.values(event.target.files);
      let entries = rawEntries.filter((entry) => {
        return !entry.name.startsWith(".");
      });

      let folderName = "";
      let directories = {};

      if (entries[0]) {
        let pieces = entries[0].webkitRelativePath.split("/");
        if (pieces[0] == "") {
          pieces.shift();
        }
        folderName = pieces[0];
        for (let i = 0; i < entries.length; i++) {
          let pieces = entries[i].webkitRelativePath.split("/");
          if (pieces[0] == "") {
            pieces.shift();
          }
          if (!directories[pieces.length - 1]) {
            directories[pieces.length - 1] = {
              dirName: "",
              files: [],
            };
          }
          directories[pieces.length - 1].dirName = pieces[pieces.length - 2];
          directories[pieces.length - 1].files.push(entries[i]);
        }
        this.commitFolder(folderName, Object.values(directories), "inputFile");
      } else {
        alert("folder is empty");
      }
    },

    // Store communication
    commitFile(file) {
      this.$store.dispatch("uploadFile", {
        file: file,
        parentUid: this.activeFolderUid,
        gParentUid:
          this.paths.length >= 2 ? this.paths[this.paths.length - 2].key : "",
      });
    },
    commitFolder(folderName, entries, uploadMode = null) {
      this.$store.dispatch("createFolder", {
        folderName: folderName,
        entries: entries,
        parentUid: this.activeFolderUid,
        uploadMode: uploadMode,
        gParentUid:
          this.paths.length >= 2 ? this.paths[this.paths.length - 2].key : "",
      });
    },

    // Modal events
    createNewFolder(name) {
      this.commitFolder(name, [], null);
      this.dismissModal();
    },
    renameFolder(uid, name) {
      let data = JSON.parse(
        JSON.stringify({
          uid: uid,
          name: name,
        })
      );
      this.$store.dispatch("renameFolder", {
        name: data.name,
        uid: data.uid,
        parentUid: this.activeFolderUid,
        gParentUid:
          this.paths.length >= 2 ? this.paths[this.paths.length - 2].key : "",
      });
      this.dismissModal();
    },
    deleteItem(uid, name) {
      let data = JSON.parse(
        JSON.stringify({
          uid: uid,
          name: name,
        })
      );
      this.$store.dispatch("deleteItem", {
        name: data.name,
        uid: data.uid,
        parentUid: this.activeFolderUid,
        gParentUid:
          this.paths.length >= 2 ? this.paths[this.paths.length - 2].key : "",
      });
      this.dismissModal();
    },
    dismissModal() {
      this.createModal = false;
      this.renameModal = false;
      this.deleteModal = false;
      // this.contextMenuTarget = "";
    },

    // Context menu
    rightClick(event) {
      var menu = this.$refs.contextMenu;
      if (event != "close") {
        event.preventDefault();
        let type = event.target.getAttribute("data-type");
        let uid = event.target.getAttribute("data-uid");
        let name = event.target.getAttribute("data-name");

        if (type == "folder" || type == "file" || type == "background") {
          this.contextMenuTarget = {
            type: type,
            uid: uid,
            name: name,
          };
          menu.classList.add("active");
          menu.style.left = event.pageX + "px";
          menu.style.top = event.pageY + "px";
        }
      } else if (event == "close") {
        menu.classList.remove("active");
        // setTimeout(() => {
        //   if (!this.renameModal || !this.deleteModal) {
        //     this.contextMenuTarget = "";
        //   }
        // }, 2000);
      }
    },
    renameFolderAsk() {
      this.renameModal = true;
    },
    deleteItemAsk() {
      this.deleteModal = true;
    },
  },
  mounted() {},
  created() {
    // Checking local state before mounting
    this.$store.dispatch("fetchStoredFiles");
  },
  computed: {
    // Getting all items of active folder
    getItems() {
      return this.$store.getters.getItems(this.activeFolderUid, this.sortType);
    },
  },
};
</script>

<style lang="scss">
</style>
