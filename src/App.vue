<template>
  <PaperList></PaperList>
</template>

<script>
import PaperList from "./components/PaperList";
const Menu = require("electron").remote.Menu;
import { selectPdfFiles } from "./services/fileService";

export default {
  name: "App",
  components: { PaperList },
  mounted() {
    const templateArray = [
      {
        label: "File",
        submenu: [
          {
            label: "Import",
            click() {
              selectPdfFiles();
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(templateArray);
    Menu.setApplicationMenu(menu);
  },
};
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.content {
  .el-aside {
    color: #333;
    border-right: solid 1px #e6e6e6;
    background-color: rgb(238, 241, 246);
  }

  .el-menu {
    border-right: none;
  }
}
</style>
