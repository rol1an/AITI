<h1 align="center">AITI</h1>

<p align="center">
  <strong>AI Type Indicator — 一个以 AI 大模型为参照系的人格类型测试站点</strong>
</p>

<p align="center">
  <a href="https://aititest.com/">🌐 aititest.com — AITI 官网</a>
</p>

<p align="center">
  回答情境式问题 · 获得专属 AI 模型代码 · 解锁你的 AI 人格画像
</p>

<p align="center">
  <a href="#️-架构与原理">📖 阅读文档</a> ·
  <a href="#-贡献">🤝 参与贡献</a>
</p>

<p align="center">
  <a href="https://aititest.com/"><img src="https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare" alt="Cloudflare Pages" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-blue.svg?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/Version-v0.0.2-blueviolet.svg?style=flat-square" alt="v0.0.2" />
  <img src="https://img.shields.io/badge/Questions-28道-green.svg?style=flat-square" alt="28道题" />
  <img src="https://img.shields.io/badge/AI_Models-14个-orange.svg?style=flat-square" alt="14个 AI 模型" />
</p>

<p align="center">
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-home.webp"
    alt="首页截图"
    width="45%"
  />
  &nbsp;
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-quiz.webp"
    alt="答题截图"
    width="45%"
  />
</p>

<p align="center">
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-result.webp"
    alt="结果截图"
    width="45%"
  />
  &nbsp;
  <img
    src="https://raw.githubusercontent.com/rol1an/AITI/main/docs/preview-characters.webp"
    alt="全部画像截图"
    width="45%"
  />
</p>

> ⚠️ 本工具仅作娱乐用途，不作为心理诊断、医学评估或现实人格结论。

---

## ✨ 核心特性

- **标准 MBTI 四维判定**：基于 E/I、S/N、T/F、J/P 四个经典 MBTI 维度构建底层判定框架，每个维度各 7 道题，共 28 道题。
- **14 个 AI 模型画像**：Claude · GPT · Gemini · Grok · DeepSeek · Kimi · 豆包 · GLM · Qwen · 文心 · Llama · MiniMax · Mimo · 混元。
- **天作之合 & 欢喜冤家**：每个 AI 人格结果页新增专属速配版块，展示与其他模型的绝配关系和互怼日常。
- **可视化交互**：16personalities 风格的交互式倾向滑块，直观展现你的思维倾向。
- **一键分享**：精美的结果人格模型卡，支持一键导出 PNG 海报分享给同好。
- **轻量全栈**：测试结果在本地浏览器完成计算；结果页会匿名上报最终命中模型与画像到后端（Cloudflare D1），用于全站统计；不要求注册，不收集邮箱等直接身份信息。

## 🛠️ 技术栈

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" />
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  &nbsp;
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  &nbsp;
  <img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Pages" />
  &nbsp;
  <img src="https://img.shields.io/badge/Cloudflare_D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare D1" />
</div>

## ⚙️ 架构与原理

<details>
<summary><b>点击展开查看工作原理</b></summary>

核心计算流程如下：

```
答题 (28道情境题) → 算分 (MBTI 四维投票) → 模型匹配 (16型→14画像) → 命中模型 (输出唯一代码) → 结果展示
```

1. **答题** — 28 道情境式二选一题，按 E/I、S/N、T/F、J/P 各 7 题分组
2. **算分** — 每题计一票，统计四个维度各自的主导字母及百分比
3. **模型匹配** — 将 MBTI 四字型映射到 14 个 AI 模型画像之一（ISFP→INFP、ESFP→ENFP 兜底）
4. **结果展示** — 模型代码、维度倾向、画像解析、亮点/弱项/雷区、天作之合 & 欢喜冤家，支持导出人格模型卡

</details>

<details>
<summary><b>点击展开查看项目目录结构</b></summary>

```text
src/
├── components/           # 可复用 UI 组件
│   ├── AppIcon.vue
│   ├── ProgressBar.vue
│   ├── QuestionCard.vue
│   ├── ResultSummary.vue
│   └── SharePoster.vue
├── composables/          # Vue 组合式函数
│   ├── useQuiz.ts       # 测试状态与逻辑
│   └── useShare.ts      # 分享与导出功能
├── data/                # 静态数据
│   ├── aitiQuestions.json        # 25 道情境式题目（含模型权重）
│   ├── aitiArchetypes.json       # 14 个 AI 模型原型定义
│   ├── aitiCharacters.json       # 14 个 AI 模型画像
│   └── aitiCharacterProbabilities.json
├── i18n/                # 国际化文案
│   ├── messages.ts      # 基础多语言文案
│   └── aitiMessages.ts  # AITI 覆盖层文案
├── pages/               # 页面组件
│   ├── HomePage.vue
│   ├── IntroPage.vue
│   ├── QuizPage.vue
│   ├── ResultPage.vue
│   ├── CharactersPage.vue
│   ├── StatsPage.vue
│   └── AboutPage.vue
├── types/
│   └── quiz.ts          # TypeScript 类型定义
└── utils/
    ├── quizEngine.ts    # 评分、模型匹配、命中逻辑
    └── statsReporter.ts # 结果匿名上报

functions/api/            # Cloudflare Pages Functions（后端 API）
migrations/               # Cloudflare D1 数据库迁移（8 个版本）
cron-worker/              # 定时统计快照 Worker
```

</details>

<details>
<summary><b>点击展开查看内容数据一览</b></summary>

| 文件 | 说明 |
|:-----|:-----|
| `src/data/aitiQuestions.json` | 28 道情境式题目 — MBTI 四维映射（E/I·S/N·T/F·J/P 各 7 题） |
| `src/data/aitiArchetypes.json` | 14 个 AI 模型原型 — 名称、描述、亮点、弱项、雷区 |
| `src/data/aitiCharacters.json` | 14 个 AI 模型画像 — 代码、MBTI 映射、向量、天作之合、欢喜冤家 |
| `src/data/aitiCharacterProbabilities.json` | 模型命中概率分布 |

</details>

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动前端开发服务器
npm run dev

# 构建
npm run build

# 启动全栈本地开发（含 Cloudflare D1 + Pages Functions）
npm run dev:pages
```

推荐的本地联调流程：

```bash
# 终端 1（仓库根目录）：监听构建产物到 dist/
npm run build:watch

# 终端 2（仓库根目录）：启动 Pages + Functions + D1
npm run dev:pages
```

然后访问：`http://127.0.0.1:8788`

## 🤝 贡献

欢迎 **Star** · 欢迎 **Fork** · 欢迎 **Issue** · 欢迎 **PR**！

当前项目仍处于早期阶段，欢迎参与：

- 提名新 AI 模型 → 提 Issue，附上模型名称与推荐理由
- 添加或改进题目 → 编辑 `src/data/aitiQuestions.json`
- 修复 Bug / 改进 UI → 直接提 PR
- 讨论与反馈 → [讨论区](https://github.com/rol1an/AITI/discussions)

### 欢迎二次创作

欢迎基于本项目进行 Fork、改版、二次创作与衍生开发。如果你基于本项目发布自己的版本，建议：

- 在 README、页脚或关于页中标注出处，并附上本项目链接：<https://github.com/rol1an/AITI>
- 写明"基于 AITI 项目二次创作 / 修改"
- 保留可追溯的 Git 提交历史与贡献记录

### 分支管理

| 分支 | 用途 |
| :--- | :--- |
| `main` | 稳定版本，仅接受来自 `dev` 的合并 |
| `dev` | 开发分支，日常开发在此进行 |

## 📦 持续集成与部署

- **GitHub Actions**：在 `main` push / PR 时校验构建是否通过
- **Cloudflare Pages**：连接 GitHub 后自动构建与部署，同时托管 Pages Functions 后端 API
- **Cron Worker**：每 15 分钟自动刷新统计快照到 D1

发版方式示例：

```bash
git tag v0.1.0
git push origin v0.1.0
```

## 📄 开源协议与免责声明

### 代码授权

本项目源代码基于 [Apache License 2.0](LICENSE) 开源。您可以学习、修改和分发本项目的代码，但在再分发或衍生发布时，需要一并提供许可证文本、保留适用的版权与归属声明，并对已修改文件作出显著标识。

### 归属与修改说明

- 本项目基于 **tianxingleo / Li Tianxing** 的原始创作 [ACGTI](https://github.com/tianxingleo/ACGTI) 进行二次开发，将测试主题从二次元角色原型替换为 AI 大模型画像。
- 欢迎以 Fork 形式继续开发、改版或进行二次创作；基于本项目公开发布衍生版本时，请引用原项目并注明来源。
- 再分发或衍生版本不应删除原始版权与归属信息。

### 品牌与官方关系声明

- 本项目与 Anthropic（Claude）、OpenAI（GPT）、Google（Gemini）、xAI（Grok）等任何 AI 公司均无官方关联。
- 各 AI 模型名称、品牌标识的版权归其原版权方所有，本项目为非商业娱乐性质的衍生创作。

### 隐私与数据安全

- 本工具的核心计算过程在**本地浏览器**中完成。
- 结果页会**匿名上报最终命中模型与维度倾向**到后端（Cloudflare D1），用于全站统计。
- 我们**不会**收集邮箱、手机号、昵称等直接身份信息。

### 测试结果声明

- 本测试为娱乐性质的人格类比工具，测试结果**不具备任何专业的心理学或医学参考价值**，请仅当作娱乐看待。

## 📋 更新日志

### v0.0.2
- **题目维度重映射**：将 28 道题从 5 个自定义维度重映射到标准 MBTI 四维（E/I · S/N · T/F · J/P），每维各 7 题，底层判定逻辑更清晰
- **Gemini 人格文案更新**：将 Gemini 的核心人格描述从「永远在赶 due 的全能学霸」升级为「拿了满分还在自责没做附加题的讨好型焦虑学霸」，更精准刻画其 AI 特质
- **新增天作之合 & 欢喜冤家版块**：所有 14 个 AI 模型结果页新增速配版块，展示与其他模型的绝配理由和互怼日常

### v0.0.1
- 初始版本上线，14 个 AI 模型画像，25 道情境式题目

## 致谢

- **上游项目** — 本项目基于 [tianxingleo/ACGTI](https://github.com/tianxingleo/ACGTI) 二次创作，感谢原作者的开源贡献
- **界面风格** — 参考自 [16personalities](https://www.16personalities.com/) 的扁平化设计与专业测评体验
- **视觉素材** — 模型插画由 **GPT image 2** 生成

<div align="center">

---

**觉得有趣？来测测你是哪款 AI 吧！**

[![立即测试](https://img.shields.io/badge/✨_立即测试_✨-aititest.com-6366f1?style=for-the-badge)](https://aititest.com/)

⭐ 如果喜欢这个项目，欢迎给仓库点个 Star！

---

**[⬆ 回到顶部](#aiti)**

</div>
