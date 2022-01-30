<template>
  <div class="modal">
    <div class="modalHeader">
      <div class="title">Rename folder</div>
      <button class="close" @dismissModal="dismissModal()">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
    <div class="modalContent">
      <label>Enter the new name</label>
      <input
        type="text"
        placeholder="Folder name"
        v-model="name"
        ref="nameInput"
      />
    </div>
    <div class="modalFooter">
      <button class="sec" @dismissModal="dismissModal()">Cancel</button>
      <button class="main" @click="renameFolder()">
        Save
        <span class="mdi mdi-folder-plus-outline"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RenameFolder",
  props: {
    data: Object,
  },
  data() {
    return {
      name: "",
    };
  },
  mounted() {
    this.name = this.data.name;
    this.$refs.nameInput.focus();
  },
  methods: {
    renameFolder() {
      this.$emit("renameFolder", this.data.uid, this.name);
    },
  },
};
</script>