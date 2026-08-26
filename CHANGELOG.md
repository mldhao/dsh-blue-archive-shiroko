# Changelog / 更新日志

All notable changes to this project are documented here. 重要更新记录如下。

## 0.6.0 — 2026-08-26

### 中文

- 短按白子改为查询 DeepSeek 官方 API 余额，并显示币种与可用金额。
- 新增仅限本机的主机端余额 RPC；`DEEPSEEK_API_KEY` 由 DSH 凭据服务读取，不进入浏览器或本地存储。
- 新增可配置的低余额阈值和低余额警告状态。
- 新增角色点击音与低余额警告音；警告音带 60 秒冷却。
- 长按头部继续触发抚摸，拖动超过 8px 不会误触查询或抚摸。
- 快捷设置改由独立齿轮按钮打开，并加入手动余额查询入口。
- 增加余额响应解析、缺少凭据和错误脱敏测试。

### English

- Tapping Shiroko now queries the official DeepSeek API balance and shows the currency and available amount.
- Added a loopback-only host RPC. `DEEPSEEK_API_KEY` is resolved by DSH's credential service and never enters the browser or local storage.
- Added a configurable low-balance threshold and warning state.
- Added a character click sound and low-balance warning with a 60-second cooldown.
- Holding the head still triggers petting; moving more than 8px avoids accidental lookup or petting.
- Quick controls now open from a dedicated gear button and include manual balance lookup.
- Added tests for response normalization, missing credentials, and error redaction.

## 0.5.1 — 2026-08-15

### 中文

- 完善中英文安装、使用、排错、开发与版权说明。
- 增加 GitHub 仓库与问题反馈元数据。
- 将预览截图和双语文档纳入发布安装包。
- 不改变 0.5.0 的桌宠交互与主题功能。

### English

- Added complete bilingual installation, usage, troubleshooting, development, and copyright documentation.
- Added GitHub repository and issue-tracker metadata.
- Included preview screenshots and bilingual documents in the release package.
- No behavioral changes from the companion and theme features introduced in 0.5.0.
## 0.5.0 — 2026-08-15

### 中文

- 将桌宠气泡改为 Codex 风格短句展示，支持流式同步、逐字显示、闪动光标和完成后轮播。
- 最多保留最近 8 个助手短句，真实回复生成期间优先展示当前输出。
- 新增白子头部抚摸交互：轻触或长按触发点头、粉色光圈和上浮爱心。
- 新增拖动阈值和交互冷却，避免移动桌宠时误触抚摸或快捷面板。
- 新增助手回复完成提示音，并允许在设置和快捷面板中关闭。
- 修复桌宠、快捷面板和设置窗口在不同屏幕尺寸下的错位与裁切问题。
- 完善自主互动、动作切换和设置持久化。

### English

- Added Codex-style compact companion bubbles with streaming sync, typewriter rendering, a blinking cursor, and post-completion rotation.
- Keeps up to 8 recent assistant lines and prioritizes the active response while generation is running.
- Added head-petting interactions with a nod, pink glow ring, and floating hearts.
- Added movement thresholds and cooldowns to prevent accidental petting or quick-panel activation while dragging.
- Added a synthesized assistant-completion chime with settings and quick-panel toggles.
- Fixed companion, quick-panel, and settings-dialog alignment and clipping across viewport sizes.
- Improved autonomous interactions, manual action switching, and persistent settings.

## 0.4.0 and earlier / 0.4.0 及更早版本

- Initial Blue Archive-inspired DSH theme, Shiroko companion, task-state animations, settings UI, static preview, and responsive layout.
- 初始蔚蓝档案风格 DSH 主题、白子桌宠、任务状态动画、设置界面、静态预览和响应式布局。

