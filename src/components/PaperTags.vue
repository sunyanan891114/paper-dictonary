<template>
  <div>
    <el-tag
      :key="tag"
      v-for="tag in tags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput"
      >+ New Tag</el-button
    >
  </div>
</template>
<script>
export default {
  name: "PaperTags",
  props: {
    tags: [],
  },
  data() {
    return {
      inputVisible: false,
      inputValue: "",
    };
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$emit("tag-change", this.tags);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tags.push(inputValue);
        this.$emit("tag-change", this.tags);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}

.button-new-tag:not(:first-child),
.input-new-tag:not(:first-child) {
  margin-left: 10px;
}
</style>
