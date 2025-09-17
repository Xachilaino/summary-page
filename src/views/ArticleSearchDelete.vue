<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, Delete, Document } from '@element-plus/icons-vue'
import { queryArticles, deleteArticles } from '@/api/article'
import { formatDateTime } from '@/utils/dateFormatter'

const startDate = ref('')
const endDate = ref('')
const startTime = ref('00:00:00') // 預設 00:00:00
const endTime = ref('00:00:00') // 預設 00:00:00
const articles = ref([])
const expandedRows = ref(new Set())

// 組合成 LocalDateTime 格式
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
    articles.value = data.articles // ✅ 保留原始 postTime
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
    articles.value = []
  } else {
    ElMessage.error(data.message)
  }
}

const toggleExpand = (id) => {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}
</script>

<template>
  <div>
    <!-- 日期與時間選擇 -->
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
    <el-table :data="articles" style="margin-top: 20px" row-key="id">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="標題" />
      <el-table-column prop="sName" label="網站名稱" width="150" />
      <el-table-column prop="postTime" label="發文時間">
        <template #default="scope">
          {{ formatDateTime(scope.row.postTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="sentimentTag" label="情緒" width="80" />

      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="toggleExpand(scope.row.id)">
            <el-icon><Document /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 展開的 JSON (原始格式) -->
    <div
      v-for="row in articles"
      :key="row.id"
      v-show="expandedRows.has(row.id)"
      style="
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background: #f9f9f9;
      "
    >
      <pre>{{ JSON.stringify(row, null, 2) }}</pre>
    </div>
  </div>
</template>
