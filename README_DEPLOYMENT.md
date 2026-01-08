# 🚀 部署指南 - 两种方案

## ⚠️ 重要提示

**Vercel部署404问题**：Vite项目在Vercel上的Serverless Functions支持有限。

**推荐方案**：前端Vercel + 后端Railway（最稳定）

---

## 🎯 方案对比

| 方案 | 难度 | 稳定性 | 推荐度 |
|------|------|--------|--------|
| **方案A：Vercel前端 + Railway后端** | ⭐ 简单 | ⭐⭐⭐⭐⭐ | ✅ **强烈推荐** |
| **方案B：纯Vercel（实验性）** | ⭐⭐⭐ 复杂 | ⭐⭐ 不确定 | ⚠️ 可能有问题 |

---

## 📦 方案A：Vercel前端 + Railway后端（推荐）

### 步骤1：部署前端到Vercel

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

前端会自动部署，获得一个 `https://your-project.vercel.app` 域名。

### 步骤2：部署后端到Railway

#### 方法A：Railway Dashboard（最简单）

1. 访问 [railway.app](https://railway.app/)
2. 点击 **"New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 授权并选择你的仓库
5. Railway会自动检测到 `pdf-backend-nodejs` 目录
6. 设置环境变量：
   ```
   NVIDIA_API_KEY = 你的新密钥
   ```
7. 点击 **"Deploy"**

#### 方法B：Railway CLI

```bash
# 安装Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 初始化项目
cd pdf-backend-nodejs
railway init

# 设置环境变量
railway variables set NVIDIA_API_KEY=your_new_api_key

# 部署
railway up
```

### 步骤3：更新前端API地址

部署后，Railway会提供后端URL，例如：`https://your-backend.railway.app`

修改 `src/services/typoDetectorApi.ts`：

```typescript
const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'           // 本地开发
    : 'https://your-backend.railway.app/api'; // Railway生产环境
```

重新部署前端：

```bash
vercel --prod
```

### ✅ 完成！

现在你的应用架构是：
```
用户浏览器
    ↓
Vercel前端 (React + Vite)
    ↓ API调用
Railway后端 (Express + PDF + AI)
```

---

## 🧪 方案B：纯Vercel（实验性，不推荐）

如果你坚持只在Vercel上部署：

### 1. 删除vercel.json（让Vercel自动识别）

```bash
mv vercel.json vercel.json.backup
git add . && git commit -m "Remove vercel.json to let Vercel auto-detect"
```

### 2. 确保API函数在 `/api` 目录

当前结构：
```
/api/pdf/health.js
/api/pdf/analyze.js
```

### 3. 在Vercel设置环境变量

```
NVIDIA_API_KEY = 你的新密钥
```

### 4. 部署到Vercel

```bash
vercel --prod
```

### ⚠️ 可能的问题

- ❌ 文件上传可能超时（Vercel限制10-60秒）
- ❌ 大PDF文件可能超过4.5MB限制
- ❌ Serverless Functions冷启动延迟
- ❌ ES模块支持可能有问题

---

## 🔧 环境变量设置

### NVIDIA API密钥

1. 访问 [NVIDIA Build Portal](https://build.nvidia.com/)
2. 生成新密钥（旧密钥已暴露，必须撤销）
3. 在部署平台设置环境变量

**重要**：
- ❌ 不要在代码中硬编码
- ❌ 不要提交到Git
- ✅ 只在部署平台配置

---

## 📊 成本对比

### Vercel（前端）

| 计划 | 价格 | 限制 |
|------|------|------|
| Hobby | **免费** | 100GB带宽/月 |
| Pro | $20/月 | 1TB带宽/月 |

### Railway（后端）

| 计划 | 价格 | 限制 |
|------|------|------|
| 免费额度 | **免费** | $5/月额度 |
| 按量付费 | $5-10/月 | 通常足够使用 |

---

## 🆘 故障排查

### 问题1：Vercel 404 NOT_FOUND

**原因**：Vite项目的Serverless Functions支持有限

**解决**：使用方案A（Railway部署后端）

### 问题2：CORS错误

**解决**：确保后端配置了正确的CORS头

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### 问题3：AI调用失败

**解决**：
- 检查 `NVIDIA_API_KEY` 是否设置
- 查看Railway/Vercel日志
- 系统会自动降级到字典匹配

### 问题4：文件上传超时

**解决**：
- 使用Railway（无执行时间限制）
- 或限制PDF文件大小

---

## ✅ 部署检查清单

### Vercel前端
- [ ] 代码已推送到GitHub
- [ ] 在Vercel导入项目
- [ ] 部署成功，可以访问前端
- [ ] API_BASE_URL已更新为后端地址

### Railway后端
- [ ] 在Railway导入项目
- [ ] 环境变量 `NVIDIA_API_KEY` 已设置
- [ ] 部署成功，获得后端URL
- [ ] 测试 `/api/pdf/health` 端点

### 安全
- [ ] 撤销旧的NVIDIA API密钥
- [ ] 生成新的API密钥
- [ ] 新密钥仅在部署平台配置
- [ ] 代码中没有硬编码密钥

---

## 🎯 推荐方案总结

**最佳选择**：Vercel前端 + Railway后端

**原因**：
- ✅ 简单：两个平台都提供一键部署
- ✅ 稳定：各司其职，发挥最佳性能
- ✅ 免费：个人使用完全免费
- ✅ 可扩展：流量增长后可轻松升级

**开始部署**：
1. 先部署Railway后端（10分钟）
2. 再部署Vercel前端（5分钟）
3. 更新前端API地址（1分钟）
4. 完成！🎉
