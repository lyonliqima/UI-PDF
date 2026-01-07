# PDF Typo Detector with NVIDIA AI Integration

## 🚀 新功能：AI 驱动的拼写检查

现在系统使用 **NVIDIA AI** (Llama 3.1 405B) 进行智能拼写检查！

### 工作流程

1. **文本提取**: 使用 pdf-parse 提取 PDF 文本
2. **AI 拼写检查**: 使用 NVIDIA Llama 3.1 405B 模型进行智能拼写检查
3. **智能回退**: 如果 AI 不可用，自动回退到字典匹配

### NVIDIA API 信息

- **API Key**: `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`
- **模型**: `meta/llama-3.1-405b-instruct`
- **端点**: `https://integrate.api.nvidia.com/v1/chat/completions`

### 优势

✅ **更智能**: AI 可以理解上下文，而不仅仅是字典匹配
✅ **更准确**: 可以检测复杂语法错误和上下文相关的拼写问题
✅ **双语支持**: 支持英文拼写和语法检查
✅ **详细建议**: 提供更详细的错误类型和修正建议

### 如何使用

1. 打开浏览器: http://localhost:5173
2. 上传您的 PDF
3. 系统自动：
   - 提取文本
   - 调用 NVIDIA AI 进行拼写检查
   - 显示检测结果

### 查看日志

后端日志会显示：
```
🤖 Using NVIDIA AI for spell checking...
✅ AI found X potential errors
```

### 测试建议

为了测试 AI 功能，上传包含以下内容的 PDF：
- 常见拼写错误
- 语法错误
- 上下文相关的用词错误

示例：
- "Their going to the park" (应该是 "They're")
- "I could of done it" (应该是 "could have")
- "The affect was huge" (应该是 "effect")

## 🔧 技术细节

### AI Prompt

系统发送给 AI 的 prompt：
```
You are a spelling and grammar checker. Analyze the text and identify
spelling mistakes. Return ONLY a JSON array of objects with properties:
"text" (the misspelled word), "suggestion" (correct spelling), and
"errorType" (type of error).
```

### 响应格式

AI 返回 JSON 数组：
```json
[
  {
    "text": "mispeled",
    "suggestion": "misspelled",
    "errorType": "Spelling mistake"
  }
]
```

## 📝 注意事项

- AI 处理需要几秒钟时间
- 文本会被截断到前 3000 字符（API 限制）
- 如果 AI API 失败，系统会自动使用字典匹配

## 🔄 后续改进

- 支持更多语言（中文拼写检查）
- 添加 OCR 功能处理扫描版 PDF
- 支持整篇文档分析（不只是前 3000 字符）
- 添加错误严重程度评分
