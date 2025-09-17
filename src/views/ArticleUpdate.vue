<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { updateArticle } from '@/api/article'

const id = ref('')
const selectedField = ref('')
const fieldValue = ref('')
const fields = [
  { label: '標題', value: 'title' },
  { label: '內文', value: 'content' },
  { label: '網站名稱', value: 's_name' },
  { label: '頻道名稱', value: 's_area_name' },
  { label: '原始網站', value: 'page_url' },
  { label: '作者', value: 'author' },
  { label: '主文ID', value: 'main_id' },
  { label: '正面情緒分數', value: 'positive_percentage' },
  { label: '負面情緒分數', value: 'negative_percentage' },
  { label: '總回文數', value: 'comment_count' },
  { label: '觀看數', value: 'view_count' },
  { label: '分享數', value: 'used_count' },
  { label: '文章類型', value: 'content_type' },
  { label: '情緒標籤', value: 'sentiment_tag' },
  { label: '關鍵字命中次數', value: '_hit_num' },
  { label: '文章來源', value: 'article_type' },
]

const handleFieldChange = () => {
  fieldValue.value = '' // 切換欄位時清空輸入值
}

const handleUpdate = async () => {
  if (!id.value || !selectedField.value) {
    ElMessage.warning('請輸入 ID 並選擇欄位')
    return
  }

  const { data } = await updateArticle({
    id: id.value,
    fields: { [selectedField.value]: fieldValue.value },
  })

  if (data.success) {
    ElMessage.success(data.message)
  } else {
    ElMessage.error(data.message)
  }
}
</script>

<template>
  <div>
    <el-input v-model="id" placeholder="文章 ID" style="width: 300px; margin-bottom: 10px" />

    <el-select
      v-model="selectedField"
      placeholder="選擇要更新的欄位"
      style="width: 300px; margin-bottom: 10px"
      @change="handleFieldChange"
    >
      <el-option v-for="f in fields" :key="f.value" :label="f.label" :value="f.value" />
    </el-select>

    <el-input
      v-if="selectedField && selectedField !== 'sentiment_tag'"
      v-model="fieldValue"
      placeholder="輸入新值"
      style="width: 300px; margin-bottom: 10px"
    />

    <el-radio-group v-if="selectedField === 'sentiment_tag'" v-model="fieldValue">
      <el-radio label="p">p</el-radio>
      <el-radio label="n">n</el-radio>
      <el-radio label="m">m</el-radio>
    </el-radio-group>

    <el-button type="primary" @click="handleUpdate">更新文章</el-button>
  </div>
</template>
