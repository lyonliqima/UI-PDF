# PDF Typo Detector - Node.js Backend

这是一个使用 Node.js 创建的 PDF 拼写错误检测后端，不需要安装 Java 和 Maven。

## 快速开始

### 1. 启动后端（已经在运行）

后端已经在 `http://localhost:8080` 运行

如果需要重启：

```bash
cd pdf-backend-nodejs
npm start
```

### 2. 前端（已经在运行）

前端已经在 `http://localhost:5173` 运行

## 功能特性

✅ 自动检测常见拼写错误（200+ 常见错误）
✅ 支持多页 PDF
✅ 返回错误位置和建议修正
✅ 前端显示黄色高亮框标记错误
✅ 右侧边栏显示详细错误列表

## 测试建议

为了测试拼写检测功能，建议创建一个包含以下常见拼写错误的 PDF：

**常见拼写错误示例：**
- teh → the
- adn → and
- recieve → receive
- seperate → separate
- definately → definitely
- occured → occurred
- untill → until
- wich → which
- becuse → because
- thier → their
- alot → a lot
- loose → lose
- wierd → weird
- youve → you've
- im → I'm
- dont → don't

**测试步骤：**
1. 创建一个包含上述拼写错误的文档
2. 保存为 PDF
3. 在应用中上传该 PDF
4. 查看右侧边栏是否显示错误
5. 查看 PDF 上是否有黄色高亮框

## 调试技巧

### 查看控制台日志

打开浏览器的开发者工具（F12），查看控制台：

**正常情况应该看到：**
```
📄 Uploading PDF: your-file.pdf
📊 File size: XX KB
🔍 Sending request to backend...
✅ Backend response: {status: 'success', typos: [...]}
🎯 Found X typos
```

**如果看到错误：**
```
❌ Error analyzing PDF: Failed to fetch
```
→ 检查后端是否在运行（访问 http://localhost:8080/api/pdf/health）

### 检查后端状态

访问健康检查端点：
```bash
curl http://localhost:8080/api/pdf/health
```

应该返回：`PDF Typo Detector API is running`

### 常见问题

**问题 1: "Failed to connect to backend"**
- 确认后端正在运行
- 检查端口 8080 是否被占用
- 查看浏览器控制台的网络请求

**问题 2: "No typos found"**
- PDF 可能确实没有拼写错误
- 尝试使用包含明显错误的测试 PDF
- 检查控制台日志确认分析是否成功

**问题 3: 黄色框没有显示**
- 确认找到了 typos（查看右侧边栏）
- 可能是 PDF 渲染问题，检查控制台错误
- 位置坐标可能不准确（这是简化版本）

## 技术栈

- Node.js
- Express
- pdf-parse (PDF 处理)
- 自定义拼写检查字典

## 与 Java 版本的对比

**Node.js 版本（当前）：**
- ✅ 快速启动
- ✅ 不需要 Java/Maven
- ✅ 适合快速测试
- ⚠️ 简化的位置定位（bbox 是估算的）

**Java 版本：**
- ✅ 更精确的文本定位
- ✅ 使用 LanguageTool（更强大的拼写检查）
- ⚠️ 需要安装 Java 和 Maven

## 后续改进

如果需要更精确的功能，可以考虑：
1. 安装 Java 和 Maven，使用原始的 Java 版本
2. 或者改进 Node.js 版本使用更高级的 PDF 解析库
