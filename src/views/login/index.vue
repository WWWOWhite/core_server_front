<template>
  <div class="outer-container">
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">细粒度多层级身份认证软件</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入您的用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入对应的密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <div class="login-form__footer">
          <el-link type="primary" class="apply-link" @click="handleApply">点击此处申请用户资质</el-link>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >登 录</el-button>
        </div>
      </el-form>

      <div class="info" style="bottom: 40px;">版本号: 0.1.3</div>
      <div class="info">开发团队: SEU 319</div>
    </div>

    <el-drawer
      class="info-drawer"
      title="正在为您申请用户资质..."
      :before-close="handleDrawerClose"
      :visible.sync="drawerVisible"
      direction="rtl"
      custom-class="info-drawer"
    >
      <div class="info-drawer__content">
        <el-form :model="editedUser" label-position="left">
          <el-form-item label="用户名" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_name" placeholder="请输入您想使用的用户名..." />
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_password" placeholder="请输入您的密码..." show-password />
          </el-form-item>
          <el-form-item label="重复密码" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_password_repeat" placeholder="请再次输入您的密码..." show-password />
          </el-form-item>
          <el-form-item label="所属组织" :label-width="formLabelWidth" required>
            <el-input v-model="editedUser.user_role" placeholder="请再次输入您所在的公司或组织..." />
          </el-form-item>
          <el-form-item label="用户邮箱" :label-width="formLabelWidth">
            <el-input v-model="editedUser.user_email" placeholder="请输入您想使用的邮箱..." />
          </el-form-item>
          <el-form-item label="用户手机号" :label-width="formLabelWidth">
            <el-input v-model="editedUser.user_phone" placeholder="请输入您的手机号..." />
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
      </div></el-drawer>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { userApply } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('（Mock）请输入用户名: admin / editor'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('（Mock）任填一个大于6位的密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      formLabelWidth: '100px',
      drawerLoading: false,
      drawerVisible: false,
      drawerTitle: '',
      editedUser: {},
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          // console.log('提交有误！')
          return false
        }
      })
    },
    handleApply() {
      this.editedUser = {}
      this.drawerVisible = true
    },
    drawerReset() {
      this.drawerLoading = false
      this.drawerTitle = ''
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
            const { user_password_repeat, ...updateForm } = this.editedUser
            if (user_password_repeat !== this.editedUser.user_password) {
              return
            }
            userApply(this.editedUser.user_id, updateForm)
              .then(response => {
                if (response.data.status === 'success') {
                  this.getData()
                  this.$message.success('用户资质申请成功！')
                } else {
                  this.$message.error('用户资质申请失败！')
                }

                setTimeout(() => {
                  this.drawerReset()
                }, 200)
              })
              .catch(() => {
                this.$message.error('用户资质申请失败，请稍后再试！')
                this.drawerReset()
              })
          }, 1000)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.info {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: gainsboro;
}

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.outer-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.apply-link {
  font-size: 14px;
  color: $light_gray;
  margin-bottom: 10px;
  display: inline-block;
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

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
