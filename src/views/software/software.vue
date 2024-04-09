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
        <el-table-column align="center" label="软件哈希">
          <template slot-scope="scope">
            <el-tooltip class="description-tooltip" effect="dark" :content="scope.row.software_hash" :popper-options="{ boundariesElement: 'window' }" placement="top-start" :open-delay="500">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-document-copy"
                @click="copyText(scope.row.software_hash)"
              >复制</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="软件描述">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="small"
              icon="el-icon-info"
              @click="openDialog(scope.row.software_name, scope.row.software_desc)"
            >详情
            </el-button>
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
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="`${dialogSoftwareName}的详细信息`"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleDialogClose"
      >
        <span>{{ dialogSoftwareDesc }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
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
      dialogSoftwareName: '',
      dialogSoftwareDesc: '',
      dialogVisible: false,
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
    copyText(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$message.success('已复制此软件哈希！')
        })
        .catch(() => {
          this.$message.error('复制失败，请手动复制文本。')
        })
    },
    openDialog(softwareName, softwareDesc) {
      this.dialogSoftwareName = softwareName
      this.dialogSoftwareDesc = softwareDesc
      this.dialogVisible = true
    },
    handleDialogClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
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

.description-tooltip {
  white-space: normal; /* 提示框内允许换行 */
}
</style>
