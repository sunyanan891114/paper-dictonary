<template>
  <i
    v-bind:class="{
      'el-icon-star-off': !paper.like,
      'el-icon-star-on': paper.like,
    }"
    class="like-icon"
    @click.stop="handleLike(paper)"
  ></i>
</template>
<script>
import { dbService } from "../services/dbService";

export default {
  name: "PaperLikeIcon",
  props: {
    paper: {},
  },
  methods: {
    async handleLike() {
      console.log(this.paper);
      this.paper.like = !this.paper.like;
      try {
        await dbService.updatePaper(this.paper);
        this.$message({
          message: `${this.paper.like ? "Cancel Like" : "Like"} Success`,
          type: "success",
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.like-icon {
  cursor: pointer;
  font-size: 20px;
  &.el-icon-star-on {
    color: #e6a23c;
  }
  &.el-icon-star-off {
    color: #b3c0d1;
  }
  &:hover {
    color: rgba(#e6a23c, 0.8);
  }
}
</style>
