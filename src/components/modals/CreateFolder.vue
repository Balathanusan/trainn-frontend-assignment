<template>
  <div class="modal">
    <div class="modalHeader">
      <div class="title">Create folder</div>
      <button class="close" @click="$emit('dismissModal')">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
    <div class="modalContent">
      <label>Enter the folder name</label>
      <input
        type="text"
        placeholder="Folder name"
        v-model="name"
        ref="nameInput"
      />
    </div>
    <div class="modalFooter">
      <button class="sec" @click="$emit('dismissModal')">Cancel</button>
      <button class="main" @click="createFolder()">
        Save
        <span class="mdi mdi-folder-plus-outline"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateFolder",
  props: {},
  data() {
    return {
      name: "",
    };
  },
  methods: {
    createFolder() {
      this.$emit("createNewFolder", this.name);
    },
  },
  mounted() {
    this.$refs.nameInput.focus();
  },
};
</script>

<style scoped lang="scss">
</style>
