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
      <paper-import-button @imported="getPdfData"></paper-import-button>
    </el-header>

    <el-main>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column width="40">
          <template slot-scope="scope">
            <span v-if="!scope.row.read" class="new-icon">new</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title">
          <template slot-scope="scope">
            <p
              class="paper-title"
              @click="handleCurrentChange(scope.row)"
              @contextmenu="handleMenu(scope.row)"
            >
              {{ scope.row.title }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="Path"> </el-table-column>
        <el-table-column label="Tags" align="left">
          <template slot-scope="scope">
            <paper-tags
              :tags="scope.row.tags || []"
              @tag-change="handleTagChange($event, scope.row)"
            >
            </paper-tags>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="Author"></el-table-column>
        <el-table-column prop="date" label="Date"></el-table-column>
        <el-table-column label="Action" align="center" width="120px">
          <template slot-scope="scope">
            <div class="action">
              <paper-like-icon :paper="scope.row"></paper-like-icon>
<!--              <p-->
<!--                class="read"-->
<!--                v-bind:class="{ active: scope.row.read }"-->
<!--                @click.stop="handleRead(scope.row)"-->
<!--              >-->
<!--                MarkRead-->
<!--              </p>-->
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
import { dbService } from "../services/dbService";
import { debounce } from "lodash";
import PaperImportButton from "./PaperImportButton";
import PaperLikeIcon from "./PaperLikeIcon";
import { ipcRenderer } from "electron";
import PaperTags from "./PaperTags";

export default {
  name: "PaperList",
  components: { PaperImportButton, PaperLikeIcon, PaperTags },

  methods: {
    async getPdfData() {
      this.tableData = await dbService.getAllPaper();
    },

    async searchPaper() {
      debounce(() => {
        dbService.filterPaper(this.search).then((data) => {
          this.tableData = data;
        });
      }, 500)();
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

    handleCurrentChange(val) {
      ipcRenderer.send("pdf-view", val);
    },

    handleMenu(val) {
      ipcRenderer.send("context-menu", val);
    },

    handleTagChange(tags, paper) {
      paper.tags = tags;
      dbService.updatePaper(paper);
    },
  },
  mounted() {
    ipcRenderer.on("pdf-state-change", (event, pdf) => {
      dbService.updatePaper(pdf);
      this.getPdfData();
    });
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

.new-icon {
  font-style: italic;
  font-size: 10px;
  color: #f56c6c;
}

.paper-title {
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

.action {
  display: flex;
  align-items: center;
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
