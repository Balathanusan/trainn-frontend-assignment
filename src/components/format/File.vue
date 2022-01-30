<template>
  <div class="file">
    <div class="preview" v-html="previewHtml"></div>
    <div class="info">
      <img :src="getType" />
      <div>
        <div class="name">
          {{ data.info.name }}
        </div>
        <div class="meta">
          <div class="elapsed">
            {{ $filters.elapsed(data.info.timestamp) }}
          </div>
          <div class="size">
            {{ $filters.fileSize(data.info.size) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import idb from "@/store/db.js";

export default {
  name: "File",
  props: {
    data: Object,
  },
  data() {
    return {
      isUpdatingPreview: false,
      previewHtml: null,
    };
  },
  methods: {
    async loadPreview() {
      let target = this.$refs.preview;
      let file = await idb.getFile(this.data.uid);
      var reader = new FileReader();
      reader.onload = function (event) {
        this.previewHtml = `<embed src="${event.target.result}
          " type="${file.type}">`;
        this.isUpdatingPreview = false;
      }.bind(this);

      reader.readAsDataURL(file);
    },
  },
  mounted() {
    if (!this.isUpdatingPreview) {
      this.loadPreview();
      this.isUpdatingPreview = true;
    }
  },
  renderTracked() {
    if (!this.isUpdatingPreview) {
      this.loadPreview();
      this.isUpdatingPreview = true;
    }
  },
  computed: {
    getType() {
      let fileName = this.data.info.name;
      let type =
        fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
        null;
      if (type) {
        return require("@/assets/fileIcons/" + type + ".png");
      } else {
        return require("@/assets/fileIcons/doc.png");
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
