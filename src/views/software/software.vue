<template>
  <div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="软件ID" width="130">
          <template slot-scope="scope">{{ scope.row.software_id }}</template>
        </el-table-column>
        <el-table-column align="center" label="软件版本号" width="95">
          <template slot-scope="scope">V{{ scope.row.software_version }}</template>
        </el-table-column>
        <el-table-column align="center" label="发布用户ID">
          <template slot-scope="scope">{{ scope.row.user_id }}</template>
        </el-table-column>
        <el-table-column label="软件名" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.software_name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="软件哈希值">
          <template slot-scope="scope">{{ scope.row.software_hash }}</template>
        </el-table-column>
        <el-table-column align="center" label="软件描述">
          <template slot-scope="scope">
            <el-tooltip class="description-tooltip" effect="dark" :content="scope.row.software_desc" :popper-options="{ boundariesElement: 'window' }" placement="top">
              <div class="description">{{ scope.row.software_desc.substring(0, 10) }}...</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="update_at" label="更新时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 30, 50]"
          :page-size="pageSize"
          :layout="layout"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { softwareQuery } from '@/api/software'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      layout: 'total, prev, pager, next, sizes, jumper'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    getData() {
      this.listLoading = true
      const params = {
        page: this.currentPage,
        limit: this.pageSize
      }
      softwareQuery(params).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch((err) => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1%;
}

.description {
width: 100px; /* 设置固定宽度 */
white-space: nowrap; /* 不换行 */
overflow: hidden; /* 超出部分隐藏 */
text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.description-tooltip {
  white-space: normal; /* 提示框内允许换行 */
}
</style>
