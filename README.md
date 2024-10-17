<!-- cmd -->
npm install
npm run dev

<!-- 联调时在.env.development修改后端IP地址，例如： -->
VUE_APP_BASE_API = 'http://localhost:8000'

<!-- 发布时在.env.production修改部署时的IP地址，例如： -->
npm run build:prod

VUE_APP_BASE_API = 'http://localhost:8000'