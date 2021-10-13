<template>
  <el-container>
    <el-header class="paper-list-header">
      <el-input
        class="search-input"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="search"
        @input="searchPaper"
      >
      </el-input>
      <el-button class="import-button" type="primary" @click="addFile">
        Import
      </el-button>
    </el-header>

    <el-main>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="title" label="Title"> </el-table-column>
        <el-table-column prop="path" label="Path"> </el-table-column>
        <el-table-column prop="author" label="Author"></el-table-column>
        <el-table-column prop="date" label="Date"></el-table-column>
        <el-table-column label="Action" align="center" width="120px">
          <template slot-scope="scope">
            <div class="action">
              <i
                v-bind:class="{
                  'el-icon-star-off': !scope.row.like,
                  'el-icon-star-on': scope.row.like,
                }"
                class="like-icon"
                @click="handleLike(scope.row)"
              ></i>
              <p
                class="read"
                v-bind:class="{ active: scope.row.read }"
                @click="handleRead(scope.row)"
              >
                MarkRead
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog title="Tips" :visible.sync="dialogVisible" width="30%">
      <span>{{
        activePaper.read
          ? `Do you want to read ${activePaper.title} again ?`
          : `Have you read ${activePaper.title} ?`
      }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Later</el-button>
        <el-button type="primary" @click="handleConfirmRead">OK</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { selectPdfFiles } from "../services/fileService";
import { dbService } from "../services/dbService";
import { getPdfContent } from "../services/pdfService";
import { getPaperName } from "../services/paperService";
import { debounce } from "lodash";

export default {
  name: "PaperList",
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
            return {
              path: filePath,
              title: getPaperName(content),
            };
          })
        );

        await dbService.savePaper(pdfs);
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
      this.tableData = await dbService.getAllPaper();
      console.log(this.tableData);
    },

    async searchPaper() {
      debounce(() => {
        dbService.filterPaper(this.search).then((data) => {
          this.tableData = data;
        });
        console.log(this.search);
      }, 500)();
    },

    async handleLike(paper) {
      console.log(paper);
      paper.like = !paper.like;
      try {
        await dbService.updatePaper(paper);
        this.$message({
          message: `${paper.like ? "Cancel Like" : "Like"} Success`,
          type: "success",
        });
      } catch (e) {
        console.log(e);
      }
    },

    handleRead(paper) {
      this.activePaper = paper;
      this.dialogVisible = true;
    },

    async handleConfirmRead() {
      this.activePaper.read = !this.activePaper.read;
      this.loading = true;
      await dbService.updatePaper(this.activePaper);
      this.loading = false;
      this.dialogVisible = false;
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
      search: "",
      activePaper: {},
      dialogVisible: false,
    };
  },
  created() {
    this.getPdfData();
  },
};
</script>

<style lang="scss" scoped>
.paper-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .search-input {
    width: 200px;
  }

  .import-button {
    height: 40px;
  }
}

.action {
  display: flex;
  align-items: center;
}

.like-icon {
  cursor: pointer;
  font-size: 20px;

  &.el-icon-star-on {
    color: #409eff;
  }

  &:hover {
    color: #e6a23c;
  }
}

.read {
  color: #409eff;
  cursor: pointer;
  margin-left: 10px;

  &.active {
    color: #b3c0d1;
  }
  &:hover {
    color: #e6a23c;
  }
}
</style>
