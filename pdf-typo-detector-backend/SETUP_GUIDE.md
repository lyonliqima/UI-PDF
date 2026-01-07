# PDF Typo Detector - Complete Setup Guide

完整的 PDF 拼写错误检测系统，包含前端和后端。

## 系统架构

```
PDF Previewer UI/                  # 前端 (React + Vite)
├── src/
│   ├── app/
│   │   └── App.tsx                # 主应用组件
│   ├── components/
│   │   └── TypoHighlightOverlay.tsx  # 黄色高亮框组件
│   └── services/
│       └── typoDetectorApi.ts     # API 调用服务
│
pdf-typo-detector-backend/         # 后端 (Java + Spring Boot)
├── src/main/java/com/typodetector/
│   ├── PdfTypoDetectorApplication.java  # 主应用
│   ├── controller/
│   │   └── PdfAnalysisController.java   # REST API 控制器
│   ├── service/
│   │   ├── PdfProcessingService.java    # PDF 处理服务
│   │   └── SpellCheckService.java      # 拼写检查服务
│   └── model/
│       ├── TypoDetection.java          # 错误检测模型
│       └── PdfAnalysisResponse.java    # API 响应模型
└── pom.xml                        # Maven 配置
```

## 快速开始

### 前置要求

- **前端**:
  - Node.js 18+
  - npm 或 pnpm

- **后端**:
  - Java 17+
  - Maven 3.6+

### 1. 启动后端

#### macOS/Linux:
```bash
cd pdf-typo-detector-backend
./start.sh
```

#### Windows:
```bash
cd pdf-typo-detector-backend
start.bat
```

#### 手动启动:
```bash
cd pdf-typo-detector-backend
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 2. 启动前端

```bash
# 安装依赖（如果还没安装）
npm install

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:5173` 启动

### 3. 使用应用

1. 打开浏览器访问 `http://localhost:5173`
2. 点击右上角的上传按钮
3. 选择一个 PDF 文件
4. 等待后端分析完成
5. 检测到的拼写错误将以黄色框显示
6. 右侧边栏会显示所有检测到的错误和建议

## 功能特性

### 后端功能
- ✅ PDF 文本提取与位置定位
- ✅ 使用 LanguageTool 进行拼写检查
- ✅ 支持多种错误类型检测（拼写、语法等）
- ✅ 返回错误位置坐标（用于前端高亮）
- ✅ RESTful API 设计
- ✅ CORS 配置支持跨域请求

### 前端功能
- ✅ PDF 预览与翻页
- ✅ 缩略图侧边栏
- ✅ 黄色高亮框标记错误
- ✅ 右侧边栏显示错误列表
- ✅ 实时分析进度显示
- ✅ 错误建议与修正提示

## API 文档

### POST /api/pdf/analyze

分析 PDF 文件并检测拼写错误。

**请求:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Parameter: `file` (PDF 文件)

**响应示例:**
```json
{
  "status": "success",
  "totalPages": 5,
  "typos": [
    {
      "pageNumber": 1,
      "text": "mispeled",
      "suggestion": "misspelled",
      "errorType": "Spelling mistake",
      "boundingBox": {
        "x": 100.5,
        "y": 200.3,
        "width": 50.2,
        "height": 12.0
      }
    }
  ],
  "message": "Analysis complete. Found 1 potential typos."
}
```

### GET /api/pdf/health

健康检查端点。

**响应:** `PDF Typo Detector API is running`

## 配置选项

### 后端配置

编辑 `pdf-typo-detector-backend/src/main/resources/application.properties`:

```properties
# 修改端口
server.port=8080

# 文件大小限制
spring.servlet.multipart.max-file-size=50MB

# CORS 允许的源
spring.web.cors.allowed-origins=http://localhost:5173
```

### 前端配置

编辑 `src/services/typoDetectorApi.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 故障排除

### 问题 1: 后端无法启动
**解决方案:**
- 检查 Java 版本: `java -version` (需要 17+)
- 检查 Maven 安装: `mvn -version`
- 清理并重新构建: `mvn clean install`

### 问题 2: 前端无法连接后端
**解决方案:**
- 确认后端正在运行: `curl http://localhost:8080/api/pdf/health`
- 检查 CORS 配置
- 查看浏览器控制台的错误信息

### 问题 3: PDF 分析失败
**解决方案:**
- 检查后端日志查看错误信息
- 确认 PDF 文件没有损坏
- 尝试使用较小的 PDF 文件测试

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- react-pdf
- motion (Framer Motion)

### 后端
- Java 17
- Spring Boot 3.2.0
- Apache PDFBox 3.0.1
- LanguageTool 6.3
- Maven

## 开发说明

### 后端开发
```bash
cd pdf-typo-detector-backend
# 运行测试
mvn test

# 构建项目
mvn clean package

# 跳过测试运行
mvn spring-boot:run -DskipTests
```

### 前端开发
```bash
# 开发模式（已运行）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 许可证

MIT License

## 联系方式

如有问题，请创建 issue 或联系开发团队。
