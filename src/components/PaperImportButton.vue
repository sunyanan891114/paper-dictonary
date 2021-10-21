<template>
  <el-button
    class="import-button"
    type="primary"
    @click="addFile"
    v-bind:loading="loading"
  >
    Import
  </el-button>
</template>
<script>
import { selectPdfFiles } from "../services/fileService";
import { getPdfContent } from "../services/pdfService";
import { getPaperName } from "../services/paperService";
import { dbService } from "../services/dbService";

export default {
  name: "PaperImportButton",
  methods: {
    async addFile() {
      try {
        this.loading = true;
        const file = await selectPdfFiles();
        if (file.filePaths.length === 0) {
          this.loading = false;
          return;
        }

        const pdfs = await Promise.all(
          file.filePaths.map(async (filePath) => {
            const content = await getPdfContent(filePath);
            console.log(content);
            return {
              path: filePath,
              title: getPaperName(content),
              tags: [],
              read: false,
              like: false,
            };
          })
        );

        await dbService.savePaper(pdfs);
        this.loading = false;
        this.$message({
          message: "Congratulations, Import Success",
          type: "success",
        });
        this.$emit("imported");
      } catch (e) {
        this.$message({
          message: e.message,
          type: "error",
        });
        this.loading = false;
      }
    },
  },
  data() {
    return {
      loading: false,
    };
  },
};
</script>
