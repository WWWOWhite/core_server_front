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
        <el-table-column align="center" label="用户ID" width="130">
          <template slot-scope="scope">{{ scope.row.user_id }}</template>
        </el-table-column>
        <el-table-column label="用户名" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户角色" width="130" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_role }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户邮箱">
          <template slot-scope="scope">{{ scope.row.user_email }}</template>
        </el-table-column>
        <el-table-column align="center" label="用户手机号">
          <template slot-scope="scope">{{ scope.row.user_phone }}</template>
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
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>

      <el-drawer
        ref="drawer"
        :title="`您正在编辑用户 ${editedUser.user_name} 的详细信息...`"
        :before-close="handleDrawerClose"
        :visible.sync="drawerVisible"
        direction="ltr"
        custom-class="info-drawer"
      >
        <div class="info-drawer__content">
          <el-form :model="editedUser">
            <el-form-item label="用户ID" :label-width="formLabelWidth">
              <el-input v-model="editedUser.user_id" autocomplete="off" disabled />
            </el-form-item>
          </el-form>
          <div class="info-drawer__footer">
            <el-button @click="cancelForm">取 消</el-button>
            <el-button
              type="primary"
              :loading="drawerLoading"
              @click="$refs.drawer.closeDrawer()"
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
import { userUpdate, userDelete, userQuery } from '@/api/user'

export default {
  data() {
    return {
      formLabelWidth: '80px',
      drawerVisible: false,
      editedUser: {},
      list: null,
      drawerLoading: false,
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
      this.editedUser = { ...row }
      this.drawerVisible = true
    },
    handleUpdate() {
      userUpdate(this.editedUser.user_id, this.editedUser)
        .then(response => {
          if (response.data.status === 'success') {
            this.drawerVisible = false
            this.getData()
            this.$message.success('更新用户成功！')
          } else {
            this.$message.error('更新用户失败！')
          }
        })
        .catch(() => {
          this.$message.error('更新用户失败，请稍后再试！')
        })
    },
    handleDrawerClose(done) {
      if (this.drawerLoading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.drawerLoading = true
          this.drawerTimer = setTimeout(() => {
            done()
            setTimeout(() => {
              this.drawerLoading = false
            }, 200)
          }, 1000)
        })
        .catch(_ => {})
    },
    cancelForm() {
      this.drawerLoading = false
      this.drawerVisible = false
      clearTimeout(this.drawerTimer)
    },
    handleDelete(row) {
      userDelete(row.user_id)
        .then(response => {
          if (response.data.status === 'success') {
            this.getData()
            this.$message.success('删除用户成功！')
          } else {
            this.$message.error('删除用户失败！')
          }
        })
        .catch(() => {
          this.$message.error('删除用户失败，请稍后再试！')
        })
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
      userQuery(params).then((response) => {
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
