<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteArticles } from '@/api/article'
import { formatDateTimeRange } from '@/utils/dateFormatter'

const dateRange = ref([])
const timeRange = ref([])

const handleDelete = async () => {
  const { start, end } = formatDateTimeRange(dateRange.value, timeRange.value)

  if (!start || !end) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  const { data } = await deleteArticles({ startTime: start, endTime: end })

  if (data.success) {
    ElMessage.success(`刪除了 ${data.deletedCount} 篇文章`)
  } else {
    ElMessage.error(data.message)
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
    <el-button type="danger" @click="handleDelete">刪除文章</el-button>
  </div>
</template>
