<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, Delete } from '@element-plus/icons-vue'
import { queryArticles, deleteArticles } from '@/api/article'
import { formatDateTimeRange } from '@/utils/dateFormatter'

const startDate = ref('')
const endDate = ref('')
const startTime = ref('')
const endTime = ref('')
const articles = ref([])

// 把分開的 date + time 合併成 start/end
const buildRange = () => {
  if (!startDate.value || !endDate.value || !startTime.value || !endTime.value) {
    return { start: null, end: null }
  }
  return {
    start: `${startDate.value}T${startTime.value}`,
    end: `${endDate.value}T${endTime.value}`,
  }
}

const handleQuery = async () => {
  const { start, end } = buildRange()
  if (!start || !end) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  const { data } = await queryArticles({ startTime: start, endTime: end })
  if (data.success) {
    articles.value = data.articles
  } else {
    ElMessage.error(data.message)
    articles.value = []
  }
}

const handleDelete = async () => {
  const { start, end } = buildRange()
  if (!start || !end) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  const { data } = await deleteArticles({ startTime: start, endTime: end })
  if (data.success) {
    ElMessage.success(`刪除了 ${data.deletedCount} 篇文章`)
    articles.value = [] // 清空查詢結果
  } else {
    ElMessage.error(data.message)
  }
}
</script>

<template>
  <div>
    <!-- 日期選擇 -->
    <div style="margin-bottom: 10px">
      <el-date-picker
        v-model="startDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="開始日期"
        style="margin-right: 10px"
      />
      <el-time-picker
        v-model="startTime"
        value-format="HH:mm:ss"
        placeholder="開始時間"
        style="margin-right: 20px"
      />

      <el-date-picker
        v-model="endDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="結束日期"
        style="margin-right: 10px"
      />
      <el-time-picker
        v-model="endTime"
        value-format="HH:mm:ss"
        placeholder="結束時間"
        style="margin-right: 20px"
      />

      <!-- 查詢與刪除按鈕 -->
      <el-button type="primary" @click="handleQuery">
        <el-icon><Filter /></el-icon>
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>

    <!-- 查詢結果表格 -->
    <el-table :data="articles" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="標題" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="postTime" label="發文時間" />
      <el-table-column prop="sentimentTag" label="情緒" width="80" />
    </el-table>
  </div>
</template>
