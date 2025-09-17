<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { updateArticle } from "@/api/article";

const id = ref("");
const field = ref("");
const value = ref("");

// 可更新欄位
const fields = [
  "title",
  "content",
  "s_name",
  "s_area_name",
  "page_url",
  "author",
  "main_id",
  "positive_percentage",
  "negative_percentage",
  "comment_count",
  "view_count",
  "used_count",
  "content_type",
  "sentiment_tag",
  "_hit_num",
  "article_type"
];

const handleUpdate = async () => {
  if (!id.value || !field.value) {
    ElMessage.warning("請輸入文章 ID 並選擇欄位");
    return;
  }

  const { data } = await updateArticle({
    id: id.value,
    fields: { [field.value]: value.value }
  });

  if (data.success) {
    ElMessage.success(data.message);
  } else {
    ElMessage.error(data.message);
  }
};
</script>

<template>
  <div>
    <el-input v-model="id" placeholder="輸入文章ID" style="width:200px;margin-bottom:10px" />

    <el-select v-model="field" placeholder="選擇更新欄位" style="width:200px;margin-bottom:10px">
      <el-option v-for="f in fields" :key="f" :label="f" :value="f" />
    </el-select>

    <div v-if="field === 'sentiment_tag'">
      <el-radio-group v-model="value">
        <el-radio label="p">正面</el-radio>
        <el-radio label="n">負面</el-radio>
        <el-radio label="m">中立</el-radio>
      </el-radio-group>
    </div>
    <el-input v-else v-model="value" placeholder="輸入新值" style="width:300px;margin-bottom:10px" />

    <el-button type="success" @click="handleUpdate">更新文章</el-button>
  </div>
</template>
