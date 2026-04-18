# POST /api/submit 400 Bad Request 调试指南

## 当前状态
- 用户完成问卷进入结果页后，`POST /api/submit` 仍返回 400 Bad Request
- 同时 `POST /api/feedback` 返回 200 OK（说明请求发送机制本身没问题）

## 已添加的日志

### 前端日志（浏览器 Console）
1. **构建 Payload 时的日志**：
   ```
   📋 Result object: { code, mbtiCode, archetypeId, scoresKeys }
   ✅ Payload validation: { submissionIdValid, archetypeCodeValid, ... }
   📤 Sending submit payload: { 完整 payload 对象 }
   📨 sendBeacon queued: true/false
   📡 /api/submit response: 状态码
   ```

2. **错误日志**：
   ```
   ❌ buildSubmitPayload: result.value is null
   ❌ reportResultInBackground error: 具体错误
   ❌ /api/submit error: 网络错误详情
   ```

### 后端日志（Wrangler 控制台 / 服务器输出）
1. **Payload 接收**：
   ```
   📊 Submit payload received: { 接收到的完整对象, JSON 格式 }
   ```

2. **校验失败**：
   ```
   ❌ Missing required fields: { 具体缺失字段 }
   ❌ Invalid submissionId format: xxx
   ❌ Invalid code format: { archetypeCode, characterCode }
   ❌ Invalid durationMs: xxx
   ❌ Invalid dimensionScores: { ei, sn, tf, jp 的具体值 }
   ❌ Invalid answers: 详情
   ```

## 排查步骤

### 第一步：确保代码已编译
```bash
# 检查 Wrangler 日志
# 应该看到类似：
# [wrangler:info] GET xxxx 200 OK
# [local] 如果修改了代码，应该看到 "Local server updated and ready"

# 如果没有更新日志，可能需要重启：
# Ctrl+C 结束当前进程
# npm run dev  # 重新启动
```

### 第二步：清除浏览器缓存
```javascript
// 在浏览器 Console 中运行（确保已清除所有跟踪 JavaScript）
// 或者在 F12 → Network 标签中，勾选 "Disable cache"
// 然后 Ctrl+Shift+R 强制刷新页面
```

### 第三步：完整测试流程
1. 打开 Firefox/Chrome 开发者工具（F12）
2. 进入 Console 标签
3. 正常完成问卷答题
4. 进入结果页面
5. 立即查看 Console，应该看到以下日志（顺序）：
   ```
   📋 Result object: ...
   ✅ Payload validation: ...
   📤 Sending submit payload: ...
   ```

### 第四步：查看 Wrangler 日志
在终端中，查看 Wrangler 输出，应该看到：
```
📊 Submit payload received: {
  "submissionId": "...",
  "archetypeCode": "...",
  "characterCode": "...",
  ...
}
```

如果没有看到这个日志，说明请求可能被浏览器或网络阻断了。

### 第五步：定位具体失败字段
- 如果看到 `❌ Invalid dimensionScores`，检查 ei/sn/tf/jp 是否都是 0-100 的数字
- 如果看到 `❌ Invalid durationMs`，检查值是否在 1000-3600000 范围内
- 如果看到 `❌ Invalid code format`，检查 archetypeCode 和 characterCode 是否只包含字母、数字和下划线

## 可能的问题点

### 1. Payload 结构不完整
最可能的原因是 `dimensionScores` 中某个值仍然是 `null` 或不是数字。

**检查方法**：在浏览器 Console 中查看 `✅ Payload validation` 的结果，所有值应该是 `true`。

### 2. result.value 为 null
如果用户通过 debug URL（如 `?character=xxx`）进入但 quiz 数据未加载，可能导致问题。

**检查方法**：看是否有 `❌ buildSubmitPayload: result.value is null` 的错误。

### 3. durationMs 计算异常
如果 startedAt 或 createdAt 时间戳异常（例如系统时钟不对），计算出的值可能超出范围。

**检查方法**：在 `buildSubmitPayload` 中添加日志看 `calculated` 的具体值。

### 4. 浏览器缓存导致旧代码运行
最常见的问题是修改了代码但浏览器加载了被缓存的旧版本。

**解决方法**：
- 浏览器开发者工具设置中勾选 "Disable cache"
- 或用 Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac) 强制刷新
- 或在开发者工具 → Application → Cache Storage 中清除所有缓存

## 下一步行动

1. **重启开发服务器**：确保所有最新代码已编译
2. **清除浏览器缓存**：确保前端代码是最新的
3. **完整测试**：按上述流程重新测试
4. **收集日志**：将浏览器 Console 和 Wrangler 的完整日志内容发给我

有了这些日志，我可以精确定位问题。
