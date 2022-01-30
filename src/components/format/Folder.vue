<template>
  <div class="folder">
    <div>
      <span
        class="mdi mdi-folder-open icon"
        v-if="subFolder || subFiles"
      ></span>
      <span class="mdi mdi-folder icon" v-if="!subFolder && !subFiles"></span>
    </div>
    <div class="name">
      {{ data.info.name }}
      <div class="info">
        <div v-if="subFolder">
          <span class="mdi mdi-folder-outline"></span>
          {{ subFolder }}
        </div>
        <div v-if="subFiles">
          <span class="mdi mdi-file-outline"></span>
          {{ subFiles }}
        </div>
        <div>
          {{ $filters.elapsed(data.info.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Folder",
  props: {
    data: Object,
  },
  data() {
    return {};
  },
  computed: {
    subFiles() {
      return this.data.info.files.length;
    },
    subFolder() {
      return this.data.info.folders.length;
    },
  },
};
</script>
