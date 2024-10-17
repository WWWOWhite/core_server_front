<template>
	<div>
		<div class="app-container">
			<el-row>
				<!-- <el-button type="primary" @click="openDialog">增加节点</el-button> -->
				<el-button type="primary" @click="openImportConfigDialog">导入配置</el-button>
			</el-row>
			<!-- 弹出的对话框 -->
			<el-dialog title="新增节点" :visible.sync="dialogVisible" width="30%" @close="handleDialogClose">
				<el-form :model="form">
					<el-form-item label="IP地址">
						<el-input v-model="form.ipAddress" placeholder="请输入IP地址"></el-input>
					</el-form-item>
					<el-form-item label="端口号">
						<el-input v-model="form.ipPort" placeholder="请输入端口号"></el-input>
					</el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer">
					<el-button @click="handleDialogClose">取 消</el-button>
					<el-button type="primary" @click="handleSubmit">提 交</el-button>
				</span>
			</el-dialog>
			<!-- 导入配置的对话框 -->
			<el-dialog title="导入配置" :visible.sync="importConfigDialogVisible" width="40%"
				@close="handleImportConfigDialogClose">
				<el-form>
					<el-form-item label="配置内容（JSON格式）">
						<el-input type="textarea" v-model="jsonContent" placeholder="请输入JSON配置" :rows="10"></el-input>
					</el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer">
					<el-button @click="handleImportConfigDialogClose">取 消</el-button>
					<el-button type="primary" @click="handleImportConfigSubmit">确 定</el-button>
				</span>
			</el-dialog>
		</div>

		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
			<el-table-column align="center" prop="id" width="50" label="序号" />
			<!-- 			<el-table-column align="center" label="节点ID" width="130">
				<template slot-scope="scope">{{ scope.row.node_id }}</template>
			</el-table-column> -->
			<el-table-column label="节点IP地址" width="130" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.node_ip }}</span>
				</template>
			</el-table-column>
			<!-- 			<el-table-column align="center" label="节点描述">
				<template slot-scope="scope">{{ scope.row.node_desc }}</template>
			</el-table-column> -->
			<el-table-column align="center" label="可订阅节点">
				<!-- <template slot-scope="scope">{{ scope.row.node_sub }}</template> -->
				<template slot-scope="scope">
					<ul v-if="scope.row.node_sub" class="custom-list">
						<li v-for="(sub, index) in scope.row.node_sub.split(',').filter(s => s.trim() !== '')"
							:key="index">
							{{ sub }}
						</li>
					</ul>
					<span v-else>无数据</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="可发布节点">
				<!-- <template slot-scope="scope">{{ scope.row.node_pub }}</template> -->
				<template slot-scope="scope">
					<ul v-if="scope.row.node_pub" class="custom-list">
						<li v-for="(pub, index) in scope.row.node_pub.split(',').filter(p => p.trim() !== '')"
							:key="index">
							{{ pub }}
						</li>
					</ul>
					<span v-else>无数据</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="guid 白名单">
				<template slot-scope="scope">
					<ul v-if="scope.row.white_guid" class="custom-list">
						<li v-for="(guid, index) in scope.row.white_guid.split(',').filter(g => g.trim() !== '')"
							:key="index">
							{{ guid }}
						</li>
					</ul>
					<span v-else></span> <!-- 当 white_guid 为空时显示的内容 -->
				</template>
			</el-table-column>

			<el-table-column align="center" prop="created_time" label="创建时间">
				<template slot-scope="scope">
					<i class="el-icon-time" />
					<span>{{ formatDate(scope.row.create_time) }}</span>
				</template>
			</el-table-column>
<!-- 			<el-table-column align="center" prop="update_time" label="更新时间">
				<template slot-scope="scope">
					<i class="el-icon-time" />
					<span>{{ formatDate(scope.row.update_time) }}</span>
				</template>
			</el-table-column> -->
			<!-- 			<el-table-column align="center" fixed="right" label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
				</template>
			</el-table-column> -->
			<el-table-column align="center" fixed="right" label="下发状态">
				<template slot-scope="scope">
					<!-- 绿点，当 node_is_alive > 0 时显示 -->
					<span v-if="scope.row.node_is_alive > 0" class="status-dot status-alive"></span>

					<!-- 灰点，当 node_is_alive <= 0 时显示 -->
					<span v-else class="status-dot status-dead"></span>
				</template>
			</el-table-column>
			<el-table-column align="center" fixed="right" label="配置同步" width="100">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-upload" circle @click="handleEdit(scope.row)" />
				</template>
			</el-table-column>

			<el-table-column align="center" fixed="right" label="查看日志" width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="openLogDialog(scope.row)">查看日志</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="日志详情" :visible.sync="logDialogVisible" width="50%" @close="handleLogDialogClose">
			<el-table :data="logList" border fit>
				<el-table-column align="center" prop="log_id" label="日志ID" />
				<el-table-column align="center" prop="log_type" label="日志类型" />
				<el-table-column align="center" prop="log_desc" label="日志描述" />
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						{{ formatDate(scope.row.create_time) }}
					</template>
				</el-table-column>
			</el-table>

			<div class="dialog-footer">
				<el-pagination @current-change="handleLogPageChange" :current-page="currentLogPage"
					:page-size="pageSize" :total="totalLogCount" layout="total, prev, pager, next" />
			</div>
		</el-dialog>

		<el-drawer class="info-drawer" :title="`您正在编辑节点 ${editedNode.node_id} 的详细信息...`"
			:before-close="handleDrawerClose" :visible.sync="drawerVisible" direction="ltr" custom-class="info-drawer">
			<div class="info-drawer__content">
				<el-form :model="editedNode" label-position="left">
					<el-form-item label="节点ID" :label-width="formLabelWidth" required>
						<el-input v-model="editedNode.node_id" readonly disabled />
					</el-form-item>
					<el-form-item label="节点IP地址" :label-width="formLabelWidth" required>
						<el-input v-model="editedNode.node_ip" readonly disabled />
					</el-form-item>
					<el-form-item label="节点描述" :label-width="formLabelWidth">
						<el-input v-model="editedNode.node_desc" type="textarea" :autosize="{ minRows: 5, maxRows: 10}"
							:maxlength="nodeDescMaxLength" show-word-limit />
					</el-form-item>
				</el-form>
				<div class="info-drawer__footer">
					<el-button @click="handleDrawerClose">取 消</el-button>
					<el-button type="primary" :loading="drawerLoading" @click="handleDrawerSubmit">
						{{ drawerLoading ? '提交中 ...' : '提 交' }}
					</el-button>
				</div>
			</div>
		</el-drawer>

		<div class="pagination-container">
			<el-pagination :current-page="currentPage" :page-sizes="[5, 10, 15, 30, 50]" :page-size="pageSize"
				:layout="layout" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>
	</div>
	</div>
</template>

<script>
	import {
		nodeQuery,
		nodeUpdate,
		nodeAdd,
		nodeLoadConfig,
		logQuery,
	} from '@/api/node'

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
				layout: 'total, prev, pager, next, sizes, jumper',
				dialogVisible: false, // 控制对话框是否可见
				form: {
					ipAddress: '', // 绑定的IP地址
					ipPort: 0,
					decription: '描述信息',
				},
				importConfigDialogVisible: false, // 控制“导入配置”对话框的显示
				jsonContent: '', // 导入配置中的JSON内容
				currentLogPage: 1, // 当前日志页码
				logList: [], // 存储日志列表
				totalLogCount: 0, // 日志总数
				currentNodeIp:'',
			}
		},
		created() {
			this.getData()
		},
		methods: {
			handleEdit(row) {
				// eslint-disable-next-line no-unused-vars
				const {
					id,
					create_time,
					update_time,
					...restFields
				} = row
				this.editedNode = {
					...restFields
				}
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
						message: `<div style="white-space: pre-wrap">确认关闭表单吗？<br><span style="color: red;">注意：</span>此操作将放弃当前所有更改！</div>`,
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
							const {
								node_ip,
								...updateForm
							} = this.editedNode
							// const { node_id, node_ip, ...updateForm } = this.editedNode
							nodeUpdate(updateForm)
								.then(response => {
									if (response.status === 'success') {
										this.getData()
										this.$message.success('更新节点信息成功！')
									} else {
										this.$message.error('认证服务器处理出错，更新节点信息失败！')
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
					this.list = response.message.data
					this.total = response.message.num

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
			},

			openDialog() {
				this.dialogVisible = true; // 打开对话框
			},
			handleDialogClose() {
				this.dialogVisible = false; // 关闭对话框
				this.form.ipAddress = ''; // 清空IP地址
			},
			handleSubmit() {
				const params = {
					node_ip: this.form.ipAddress,
					node_port: this.form.ipPort,
					node_desc: this.form.decription,
				}
				nodeAdd(params).then((response) => {
					if (response.status === 'success') {
						this.getData()
						this.$message.success('添加节点信息成功！')
					} else {
						this.$message.error('服务器处理出错，增加节点信息失败！')
					}
					setTimeout(() => {
						this.dialogVisible = false;
					}, 200)
				}).catch((err) => {
					console.error(err)
				})
				// if (this.form.ipAddress) {
				//   // 提交数据的逻辑，比如调用API保存IP地址
				//   this.$message.success('提交成功，IP地址为：' + this.form.ipAddress);
				//   this.handleDialogClose(); // 提交成功后关闭对话框
				// } else {
				//   this.$message.error('请输入有效的IP地址');
				// }
			},
			// 打开导入配置对话框
			openImportConfigDialog() {
				this.importConfigDialogVisible = true;
			},
			// 关闭导入配置对话框
			handleImportConfigDialogClose() {
				this.importConfigDialogVisible = false;
				this.jsonContent = ''; // 清空JSON内容
			},
			// 提交导入配置表单
			handleImportConfigSubmit() {
				const params = {
					json_content: this.jsonContent
				}
				nodeLoadConfig(params).then((response) => {
					if (response.status === 'success') {
						this.getData()
						this.$message.success('导入配置成功！')
					} else {
						this.$message.error('服务器处理出错，导入配置失败！')
					}
					setTimeout(() => {
						this.dialogVisible = false;
					}, 200)
				}).catch((err) => {
					console.error(err)
				})
			},
			formatDate(dateString) {
				const date = new Date(dateString);
				// 将日期格式化为 "YYYY-MM-DD HH:MM:SS"
				return date.toLocaleString('zh-CN', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false, // 24小时制
				}).replace(/\//g, '-').replace(',', ' '); // 替换斜杠为横杠并移除逗号
			},

			openLogDialog(row) {
				this.logDialogVisible = true;
				this.fetchLogs(row.node_ip); // 传入节点的IP地址或其他标识符以获取日志
			},
			handleLogDialogClose() {
				this.logDialogVisible = false;
				this.logList = []; // 清空日志列表
				this.currentLogPage = 1; // 重置页码
				this.totalLogCount = 0; // 重置总数
			},
			fetchLogs(nodeIp) {
				// 根据传入的节点IP获取日志数据
				// 假设你有一个API可以获取日志
				// 例如：this.$http.get(`/api/logs?nodeIp=${nodeIp}&page=${this.currentLogPage}&size=${this.pageSize}`)
				// 这里是伪代码，实际使用时需要根据你的API来调整
				this.currentNodeIp = nodeIp
				const params = {
					page: this.currentLogPage,
					limit: this.pageSize,
					ip :nodeIp,
				}
				logQuery(params).then((response) => {
					this.logList = response.message.data
					this.totalLogCount = response.message.num
				}).catch((err) => {
					console.error(err)
				})
			},
			handleLogPageChange(page) {
				this.currentLogPage = page;
				// 重新加载日志数据
				this.fetchLogs(this.currentNodeIp); // 确保你保存了当前节点的IP
			},

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

	.custom-list {
		list-style-position: inside;
		/* 将点放在列表项内，靠近文本 */
		padding-left: 0;
		/* 移除默认的左内边距 */
		margin-left: 0;
		/* 移除默认的左外边距 */
	}

	.status-dot {
		display: inline-block;
		width: 10px;
		/* 点的直径 */
		height: 10px;
		border-radius: 50%;
		/* 圆形 */
	}

	.status-alive {
		background-color: #32CD32;
		/* 绿色表示在线 */
	}

	.status-dead {
		background-color: #D3D3D3;
		/* 灰色表示离线 */
	}

	.custom-list2 {
		list-style-type: none;
		/* 去掉默认的列表样式 */
		padding: 0;
		/* 去掉内边距 */
		margin: 0;
		/* 去掉外边距 */
	}

	.custom-list2 li {
		display: inline;
		/* 改为行内显示 */
		margin-right: 5px;
		/* 调整每个 GUID 的右边距 */
	}
</style>