<template>
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-button type="primary" @click="addFile">Import</el-button>
    </el-header>

    <el-main>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="path" label="Path"> </el-table-column>
        <el-table-column prop="name" label="Name"> </el-table-column>
        <el-table-column
          prop="author"
          label="Author"
          width="120"
        ></el-table-column>
        <el-table-column prop="date" label="Date" width="140"></el-table-column>
        <el-table-column prop="content" label="Description"></el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { selectPdfFiles } from "../services/fileService";
import { dbService } from "../services/dbService";
import { getPdfContent } from "../services/pdfService";
import { getPaperName } from "../services/paperService";

export default {
  name: "PaperList",
  methods: {
    async addFile() {
      try {
        this.loading = true;
        const file = await selectPdfFiles();

        const pdfs = await Promise.all(
          file.filePaths.map(async (filePath) => {
            const content = await getPdfContent(filePath);
            return {
              path: filePath,
              name: getPaperName(content),
            };
          })
        );

        await dbService.savePdf(pdfs);
        await this.getPdfData();
        this.loading = false;
        this.$message({
          message: "Congratulations, Import Success",
          type: "success",
        });
      } catch (e) {
        this.$message({
          message: e.message,
          type: "error",
        });
        this.loading = false;
      }
    },
    async getPdfData() {
      this.tableData = await dbService.getAllPdf();
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  created() {
    this.getPdfData();
  },
};
</script>

<style lang="scss" scoped></style>
