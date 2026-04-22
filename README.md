<h1 align="center">AITI</h1>

<p align="center">
  <strong>AI Type Indicator — 看看你最像哪个 AI 模型？</strong>
</p>

<p align="center">
  回答 39 道情境式问题 · 获得专属 AI 人格代码 · 解锁你的 AI 原型
</p>

<p align="center">
  <a href="https://aiti.tianxingleo.top/"><img src="https://img.shields.io/badge/🚀_立即开始测试-点击进入-6366f1?style=for-the-badge" alt="立即测试" /></a>
</p>

<p align="center">
  <a href="https://aiti.tianxingleo.top/"><img src="https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare" alt="Cloudflare Pages" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-blue.svg?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/Questions-39道-green.svg?style=flat-square" alt="39道题" />
  <img src="https://img.shields.io/badge/AI_Models-20+-orange.svg?style=flat-square" alt="20+ AI 模型" />
</p>

---

## 🎯 立即体验

<p align="center">
  <a href="https://aiti.tianxingleo.top/">
    <img src="https://img.shields.io/badge/%E2%9C%A8%20开始测试%20%E2%9C%A8-https%3A%2F%2Faiti.tianxingleo.top-6366f1?style=for-the-badge&logoColor=white" alt="开始测试" />
  </a>
</p>

> 点击上方按钮，无需注册，30 分钟内即可获得你的专属 AI 人格报告。

---

## 📸 界面预览

<p align="center">
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-home.webp"
    alt="首页"
    width="45%"
  />
  &nbsp;
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-quiz.webp"
    alt="答题页"
    width="45%"
  />
</p>

<p align="center">
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-result.webp"
    alt="结果页"
    width="45%"
  />
  &nbsp;
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-characters.webp"
    alt="全部画像"
    width="45%"
  />
</p>

> ⚠️ 本工具仅作娱乐用途，不作为心理诊断、医学评估或现实人格结论。

---

## ✨ 核心特性

| 特性 | 说明 |
|:---|:---|
| 🧠 **四维人格判定** | 基于表达力、温度感、判断力、秩序感四大维度构建底层框架 |
| 🤖 **8 种 AI 原型** | 精准映射不同 AI 模型的思维与交互风格 |
| 📦 **20+ AI 角色库** | 涵盖 Claude、GPT、Gemini、DeepSeek、Kimi、LLaMA、Qwen、Mistral 等主流模型 |
| 📊 **可视化交互** | 16personalities 风格的倾向滑块，直观展示你的思维坐标 |
| 🖼️ **一键分享** | 精美结果海报，一键导出 PNG 分享给朋友 |
| 🔒 **隐私友好** | 核心计算在本地浏览器完成，不收集邮箱等直接身份信息 |

---

## 🤖 你会是哪款 AI？

AITI 会将你的作答映射到以下 AI 模型中的一位：

<div align="center">

`Claude` · `GPT-4` · `Gemini` · `DeepSeek` · `Kimi` · `LLaMA` · `Qwen` · `Mistral` · 以及更多……

</div>

每位 AI 都有独特的六维人格向量（表达力 · 温度感 · 判断力 · 秩序感 · 能动性 · 气场），看看你的思维方式最贴近哪一款！

---

## ⚙️ 工作原理

<details>
<summary><b>点击展开查看测试流程</b></summary>

```
回答 39 道题  →  计算四维倾向  →  匹配 AI 原型  →  命中 AI 角色  →  生成结果报告
```

1. **答题** — 39 道七级量表情境题（-3 到 +3），每题关联维度权重与原型权重
2. **算分** — 按维度累加带符号权重，计算每个维度的倾向百分比（50%–100%）
3. **原型匹配** — 将四维结果映射到 8 种 AI 原型之一
4. **角色命中** — 在角色库中命中 1 位主 AI 模型，输出专属代码
5. **结果展示** — AI 代码、维度滑块、角色解析、原型描述，支持导出海报

</details>

<details>
<summary><b>点击展开查看项目目录结构</b></summary>

```text
src/
├── components/           # 可复用 UI 组件
│   ├── ProgressBar.vue
│   ├── QuestionCard.vue
│   ├── ResultSummary.vue
│   └── SharePoster.vue
├── composables/          # Vue 组合式函数
│   ├── useQuiz.ts       # 测试状态与逻辑
│   └── useShare.ts      # 分享与导出功能
├── data/                # 静态数据
│   ├── aitiQuestions.json    # 39 道情境式题目（含 AI 模型权重）
│   ├── aitiArchetypes.json   # 8 个 AI 原型定义
│   ├── aitiCharacters.json   # 20+ AI 模型角色库
│   ├── characterVisuals.json
│   └── characterProbabilities.json
├── i18n/                # 多语言文案（简中/繁中/英/日）
├── pages/               # 页面组件
│   ├── HomePage.vue
│   ├── QuizPage.vue
│   ├── ResultPage.vue
│   ├── CharactersPage.vue
│   ├── StatsPage.vue
│   └── AboutPage.vue
├── utils/
│   ├── quizEngine.ts    # 评分、原型匹配、角色命中逻辑
│   └── statsReporter.ts # 匿名结果上报

functions/api/            # Cloudflare Pages Functions（后端 API）
├── submit.ts
├── feedback.ts
├── config.ts
└── stats/

migrations/               # Cloudflare D1 数据库迁移（8 个版本）
```

</details>

---

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动前端开发服务器
npm run dev

# 构建
npm run build

# 启动全栈本地开发（含 Cloudflare D1 + Pages Functions）
# 终端 1：监听构建产物
npm run build:watch

# 终端 2：启动 Pages + Functions + D1
npm run dev:pages
# 访问 http://127.0.0.1:8788
```

<details>
<summary><b>Turnstile 与环境变量配置</b></summary>

```bash
# .env.local（前端，已在 .gitignore 中）
VITE_TURNSTILE_SITE_KEY=你的 site key

# .dev.vars（Pages Functions 本地，已在 .gitignore 中）
TURNSTILE_SECRET=你的 secret
```

本地地址未配置 Turnstile 时会自动回退到 Cloudflare 官方测试 key，可直接跑通完整链路。

</details>

---

## 🤝 贡献

欢迎 **Star** · 欢迎 **Fork** · 欢迎 **Issue** · 欢迎 **PR**！

- 补充新 AI 模型 → 编辑 `src/data/aitiCharacters.json`
- 添加新题目 → 编辑 `src/data/aitiQuestions.json`
- 修复 Bug / 改进 UI → 直接提 PR

| 分支 | 用途 |
|:---|:---|
| `main` | 稳定版本，仅接受来自 `dev` 的合并 |
| `dev` | 开发分支，日常开发在此进行 |

---

## 📦 CI/CD

- **GitHub Actions** — 在 `main` push / PR 时自动校验构建
- **Cloudflare Pages** — 连接 GitHub 后自动构建与部署
- **Cloudflare D1** — SQLite 边缘数据库，存储匿名统计数据

```bash
# 发版示例
git tag v1.0.0
git push origin v1.0.0
```

---

## 📄 开源协议

本项目源代码基于 [Apache License 2.0](LICENSE) 开源。

本项目基于 **tianxingleo / Li Tianxing** 的 [ACGTI](https://github.com/tianxingleo/ACGTI) 项目二次创作，在此致谢。

> 角色立绘等视觉素材的版权归其原版权方所有，本项目为非商业娱乐性质的衍生创作。

---

## 致谢

- **界面风格** — 参考自 [16personalities](https://www.16personalities.com/) 的扁平化设计
- **项目启发** — 基于 [tianxingleo/ACGTI](https://github.com/tianxingleo/ACGTI) 衍生开发
- **视觉素材** — 角色立绘由 AI 生成

---

<div align="center">

**觉得有趣？先去测测你是哪款 AI 吧！**

[![立即测试](https://img.shields.io/badge/✨_立即测试_✨-aiti.tianxingleo.top-6366f1?style=for-the-badge)](https://aiti.tianxingleo.top/)

⭐ 如果喜欢这个项目，欢迎给仓库点个 Star！

---

**[⬆ 回到顶部](#aiti)**

</div>
