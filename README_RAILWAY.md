# 🚀 推荐部署方案：前端Vercel + 后端Railway

由于Vite项目在Vercel上的Serverless Functions支持有限，推荐使用以下架构：

```
┌─────────────────┐         ┌─────────────────┐
│   前端 (Vercel)  │ ───────▶│  后端 (Railway) │
│   React + Vite  │         │  Express + PDF  │
└─────────────────┘         └─────────────────┘
```

## 📦 部署步骤

### 步骤1：部署前端到Vercel

```bash
# 前端只需要静态文件部署
vercel --prod
```

### 步骤2：部署后端到Railway

#### 方法A：通过Railway CLI（推荐）

```bash
# 1. 安装Railway CLI
npm i -g @railway/cli

# 2. 登录Railway
railway login

# 3. 初始化项目
cd pdf-backend-nodejs
railway init

# 4. 设置环境变量
railway variables set NVIDIA_API_KEY=your_new_api_key

# 5. 部署
railway up
```

#### 方法B：通过Railway Dashboard

1. 访问 [railway.app](https://railway.app/)
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库
4. Railway会自动检测Express项目
5. 在环境变量中设置 `NVIDIA_API_KEY`
6. 点击 "Deploy"

### 步骤3：更新前端API地址

Railway会提供一个URL，例如：`https://your-app.railway.app`

修改 `src/services/typoDetectorApi.ts`：

```typescript
const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'      // 本地开发
    : 'https://your-app.railway.app/api'; // Railway生产环境
```

## ✅ 优势

| 特性 | Vercel | Railway |
|------|--------|---------|
| Express支持 | ❌ 复杂 | ✅ 原生支持 |
| 文件上传 | ⚠️ 限制 | ✅ 无限制 |
| 执行时间 | ⚠️ 10-60秒 | ✅ 无限制 |
| PDF处理 | ⚠️ 可能超时 | ✅ 完美支持 |
| 免费额度 | ✅ 慷慨 | ✅ $5/月额度 |
| 部署难度 | ⚠️ 中等 | ✅ 极简 |

## 🔧 Railway配置说明

### 环境变量

在Railway项目中设置：
```
NVIDIA_API_KEY = 你的新密钥
PORT = 8080
```

### 自动部署

Railway会：
- 自动检测`package.json`中的启动脚本
- 自动安装依赖（`npm install`）
- 自动监听GitHub推送并重新部署

### 域名配置

Railway提供：
- 默认域名：`https://your-app.railway.app`
- 自定义域名：免费配置

## 📊 成本估算

**Railway免费额度**：
- $5/月免费额度
- 包含：512MB RAM, 512小时运行时间
- 足够个人项目和小型应用使用

**超出后**：
- 按使用量计费
- 通常$5-10/月即可运行小型应用

## 🆚 其他后端托管选项

| 平台 | 难度 | 推荐度 | 说明 |
|------|------|--------|------|
| **Railway** | ⭐ | ⭐⭐⭐⭐⭐ | 最简单，完美支持Express |
| **Render** | ⭐⭐ | ⭐⭐⭐⭐ | 免费层不错，但冷启动慢 |
| **Fly.io** | ⭐⭐ | ⭐⭐⭐⭐ | 全球部署，稍复杂 |
| **Heroku** | ⭐ | ⭐⭐⭐ | 经典选择，但免费版已取消 |
| **DigitalOcean** | ⭐⭐⭐ | ⭐⭐⭐ | 需要更多配置 |

## 🎯 总结

**最佳实践**：
1. ✅ 前端部署到Vercel（免费、快速、全球CDN）
2. ✅ 后端部署到Railway（简单、稳定、支持Express）
3. ✅ 通过CORS连接前后端
4. ✅ 各司其职，发挥最佳性能

这样你获得了：
- ⚡ Vercel的静态文件托管和CDN
- 🔧 Railway的完整后端支持
- 💰 免费额度足够个人使用
- 🚀 简单的部署流程
