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
        <el-table-column align="center" prop="id" width="50" label="序号" />
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
        <el-table-column align="center" prop="created_time" label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="update_time" label="更新时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          </template>
        </el-table-column>
      </el-table>

      <el-drawer
        class="info-drawer"
        :title="`您正在编辑节点 ${editedNode.node_id} 的详细信息...`"
        :before-close="handleDrawerClose"
        :visible.sync="drawerVisible"
        direction="ltr"
        custom-class="info-drawer"
      >
        <div class="info-drawer__content">
          <el-form :model="editedNode" label-position="left">
            <el-form-item label="节点ID" :label-width="formLabelWidth" required>
              <el-input v-model="editedNode.node_id" readonly disabled />
            </el-form-item>
            <el-form-item label="节点IP地址" :label-width="formLabelWidth" required>
              <el-input v-model="editedNode.node_ip" readonly disabled />
            </el-form-item>
            <el-form-item label="节点描述" :label-width="formLabelWidth">
              <el-input v-model="editedNode.node_desc" type="textarea" :autosize="{ minRows: 5, maxRows: 10}" :maxlength="nodeDescMaxLength" show-word-limit />
            </el-form-item>
          </el-form>
          <div class="info-drawer__footer">
            <el-button @click="handleDrawerClose">取 消</el-button>
            <el-button
              type="primary"
              :loading="drawerLoading"
              @click="handleDrawerSubmit"
            >
              {{ drawerLoading ? '提交中 ...' : '提 交' }}
            </el-button>
          </div>
        </div>
      </el-drawer>

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
import { nodeQuery, nodeUpdate } from '@/api/node'

export default {
  data() {
    return {
      formLabelWidth: '100px',
      nodeDescMaxLength: 300,
      drawerLoading: false,
      drawerVisible: false,
      editedNode: {},
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
    handleEdit(row) {
      // eslint-disable-next-line no-unused-vars
      const { id, create_time, update_time, ...restFields } = row
      this.editedNode = { ...restFields }
      this.drawerVisible = true
    },
    drawerReset() {
      this.drawerLoading = false
      clearTimeout(this.drawerTimer)
      this.drawerVisible = false
    },
    handleDrawerClose(done) {
      this.$confirm('', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message:
        `<div style="white-space: pre-wrap">确认关闭表单吗？<br><span style="color: red;">注意：</span>此操作将放弃当前所有更改！</div>`,
        dangerouslyUseHTMLString: true
      })
        .then(_ => {
          this.drawerReset()
          done()
        })
        .catch(_ => {})
    },
    handleDrawerSubmit() {
      if (this.drawerLoading) {
        return
      }
      this.$confirm('确定要提交表单吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.drawerLoading = true
          this.drawerTimer = setTimeout(() => {
            // eslint-disable-next-line no-unused-vars
            const { node_ip, ...updateForm } = this.editedNode
            // const { node_id, node_ip, ...updateForm } = this.editedNode
            nodeUpdate(updateForm)
              .then(response => {
                if (response.data.status === 'success') {
                  this.getData()
                  this.$message.success('更新节点信息成功！')
                } else {
                  this.$message.error('更新节点信息失败！')
                }

                setTimeout(() => {
                  this.drawerReset()
                }, 200)
              })
              .catch(() => {
                this.$message.error('更新节点信息失败，请稍后再试！')
                this.drawerReset()
              })
          }, 1000)
        })
        .catch(() => {})
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
      nodeQuery(params).then((response) => {
        this.list = response.data.items
        this.total = response.data.total

        const startId = (this.currentPage - 1) * this.pageSize + 1
        this.list = this.list.map((item, index) => {
          return {
            id: startId + index,
            ...item
          }
        })

        this.listLoading = false
      }).catch((err) => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1%;
}

.info-drawer__content {
  padding: 20px;
  height: 90%;
  overflow-y: auto;
}

.info-drawer__footer {
  padding: 20px;
  display: flex;
  justify-content: space-between, flex-end;
}

.info-drawer__footer .el-button:first-child {
  margin-left: auto;
  margin-right: 2%;
}
</style>
