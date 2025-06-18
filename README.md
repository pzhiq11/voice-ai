Author: panzhiqiang<潘智强>
# Voice AI - 语音交互式AI助手

一个现代化的React应用程序，提供语音AI交互功能，支持OpenAI和Google Gemini双引擎。

![Voice AI Demo](http://zhiji-pzhiq.top/uploads/1750239546451-0w36uy.png)

## 功能特点

- **语音交互**：使用Web Speech API实现语音识别和语音合成
- **双引擎支持**：集成了OpenAI和Google Gemini API
- **响应式设计**：适配各种屏幕尺寸的现代UI设计
- **本地存储**：对话历史和用户设置保存在本地
- **上下文感知**：AI回复会考虑整个对话历史
- **自定义设置**：可调节语音合成参数和AI配置

## 技术栈

- **前端框架**：React 19
- **类型系统**：TypeScript
- **样式工具**：Tailwind CSS
- **状态管理**：Zustand
- **路由**：React Router
- **图标**：React Icons
- **动画**：CSS动画和Framer Motion

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/voice-ai.git
cd voice-ai
```

2. 安装依赖
```bash
npm install
# 或
yarn
```

3. 创建环境变量文件
创建一个`.env`文件在项目根目录，添加以下内容：
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_DEFAULT_AI_PROVIDER=gemini
```

4. 启动开发服务器
```bash
npm start
# 或
yarn start
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用指南

1. **开始对话**：点击"开始对话"按钮，进入聊天界面。
2. **语音输入**：点击麦克风按钮，开始语音输入。说完后，内容会自动转换为文字。
3. **文字输入**：您也可以直接在输入框中键入文字，按Enter键发送。
4. **语音回复**：AI的回复会自动朗读（如果启用了语音功能）。您可以点击回复旁的播放按钮重新聆听。
5. **配置设置**：在设置页面中，您可以配置AI提供商、API密钥和语音选项。

## 注意事项

- Voice AI需要浏览器支持语音识别和语音合成API。推荐使用Chrome、Edge或Safari最新版本。
- 使用语音功能时，请确保您的设备有可用的麦克风，并已授予浏览器使用麦克风的权限。
- 为了使用AI功能，您需要提供有效的API密钥。API密钥仅存储在本地，不会发送到任何第三方服务器。
- 所有的对话数据都存储在浏览器本地，清除浏览器数据可能会导致历史对话丢失。

## 贡献指南

欢迎贡献代码、报告问题或提出建议！请fork本仓库并提交pull request。

## 许可证

MIT
