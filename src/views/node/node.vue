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
        <el-table-column align="center" label="节点ID" width="130">
          <template slot-scope="scope">{{ scope.row.node_id }}</template>
        </el-table-column>
        <el-table-column label="节点IP地址" width="130" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.node_ip }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="节点描述">
          <template slot-scope="scope">{{ scope.row.node_desc }}</template>
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
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />
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
import { nodeQuery } from '@/api/node'

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
      nodeQuery(params).then((response) => {
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
</style>
