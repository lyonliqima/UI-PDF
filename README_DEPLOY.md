# Vercel部署指南

## 🚀 快速开始

本项目已改造为Vercel Serverless架构，可以直接部署到Vercel平台。

### 📋 部署前准备

1. 确保已将代码推送到GitHub仓库
2. 注册[Vercel账号](https://vercel.com)

### 🔧 环境变量配置

在Vercel项目中设置环境变量：

进入 Vercel Dashboard → Settings → Environment Variables，添加：

```
NVIDIA_API_KEY = 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
```

### 📦 部署步骤

#### 方法1：通过Vercel Dashboard（推荐）

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 导入你的GitHub仓库
3. Vercel会自动检测配置并部署
4. 首次部署时添加环境变量

#### 方法2：通过Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署到生产环境
vercel --prod
```

### 🌐 API端点

部署后的API地址：
- **健康检查**: `https://your-project.vercel.app/api/pdf/health`
- **PDF分析**: `https://your-project.vercel.app/api/pdf/analyze`

### 💻 本地开发

前端开发服务器：
```bash
npm run dev
# 访问 http://localhost:5173
```

如果需要本地测试后端（可选）：
```bash
cd pdf-backend-nodejs
node src/server.js
# 运行在 http://localhost:8080
```

### ⚙️ 项目架构

```
PDF Previewer UI/
├── api/                      # Vercel Serverless Functions
│   ├── pdf/
│   │   ├── health.js        # GET /api/pdf/health
│   │   └── analyze.js       # POST /api/pdf/analyze
│   └── shared/
│       ├── pdfProcessor.js  # PDF处理逻辑
│       └── typoChecker.js   # AI错别字检测
├── src/                      # 前端React应用
│   └── services/
│       └── typoDetectorApi.ts  # API客户端（自动切换环境）
├── vercel.json              # Vercel配置
└── .vercelignore            # 忽略文件
```

### 🔍 前端API配置

前端已配置自动环境检测：

```typescript
// src/services/typoDetectorApi.ts
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api'  // 本地开发
  : '/api';                       // Vercel生产环境
```

### ⚠️ 注意事项

1. **文件大小限制**
   - Vercel请求体限制：4.5MB（Hobby计划）
   - 建议限制PDF文件大小 < 10MB

2. **执行时间限制**
   - Hobby计划：10秒
   - Pro计划：60秒
   - 超时会导致请求失败

3. **API密钥安全**
   - 不要将NVIDIA_API_KEY提交到Git
   - 在Vercel Dashboard中配置环境变量

### 🐛 故障排查

#### 问题1: "Failed to connect to backend"

**原因**: API路径配置错误或后端未部署
**解决**:
- 确认vercel.json配置正确
- 检查Vercel部署日志
- 确认环境变量已设置

#### 问题2: "Method not allowed"

**原因**: HTTP方法不匹配
**解决**: 确认API正确处理OPTIONS预检请求

#### 问题3: "No file uploaded"

**原因**: multipart/form-data解析失败
**解决**:
- 检查请求体大小是否超限
- 确认Content-Type正确

#### 问题4: AI调用失败

**原因**: NVIDIA API密钥无效或超时
**解决**:
- 验证NVIDIA_API_KEY环境变量
- 检查Vercel Function日志
- 系统会自动降级到字典匹配

### 📊 监控和日志

访问 Vercel Dashboard → Functions 查看：
- 函数调用统计
- 执行时间
- 错误日志
- 性能指标

### 🚀 性能优化建议

1. **减少冷启动时间**
   - 使用Vercel Edge Functions
   - 保持函数代码简洁

2. **优化API调用**
   - 添加响应缓存
   - 限制PDF文件大小
   - 使用流式处理

3. **成本控制**
   - 升级到Pro计划获得更长执行时间
   - 监控函数调用次数
   - 优化PDF处理逻辑

### 📚 相关文档

- [Vercel Serverless Functions文档](https://vercel.com/docs/functions/serverless-functions)
- [Vercel环境变量配置](https://vercel.com/docs/projects/environment-variables)
- [NVIDIA API文档](https://integrate.api.nvidia.com)

### 🆘 获取帮助

如遇到问题，请检查：
1. Vercel部署日志
2. 浏览器控制台错误
3. Network标签中的请求/响应
4. Vercel Dashboard中的Function日志
