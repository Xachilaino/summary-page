<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { queryArticles } from '@/api/article'
import { formatDateTimeRange } from '@/utils/dateFormatter'

const dateRange = ref([])
const timeRange = ref([])
const articles = ref([])

const handleQuery = async () => {
  const { start, end } = formatDateTimeRange(dateRange.value, timeRange.value)

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
</script>

<template>
  <div>
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      value-format="YYYY-MM-DD"
      range-separator="至"
      start-placeholder="開始日期"
      end-placeholder="結束日期"
    />
    <el-time-picker
      is-range
      v-model="timeRange"
      value-format="HH:mm:ss"
      range-separator="至"
      start-placeholder="開始時間"
      end-placeholder="結束時間"
    />
    <el-button type="primary" @click="handleQuery">查詢文章</el-button>

    <el-table :data="articles" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="標題" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="postTime" label="發文時間" />
      <el-table-column prop="sentimentTag" label="情緒" width="80" />
    </el-table>
  </div>
</template>
