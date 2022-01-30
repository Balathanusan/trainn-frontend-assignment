<template>
  <div class="modal">
    <div class="modalHeader">
      <div class="title red">Delete</div>
      <button class="close" @click="$emit('dismissModal')">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
    <div class="modalContent">
      <label>Are you sure? This action can't be undone.</label>
      <div class="fileName">
        Deleting : <span> {{ data.name }}</span>
      </div>
    </div>
    <div class="modalFooter">
      <button class="sec" @click="$emit('dismissModal')">Cancel</button>
      <button class="main red" @click="deleteItem()">
        Delete
        <span class="mdi mdi-trash-can-outline"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeleteItem",
  props: {
    data: Object,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    deleteItem() {
      this.$emit("deleteItem", this.data.uid, this.data.name);
    },
  },
};
</script>