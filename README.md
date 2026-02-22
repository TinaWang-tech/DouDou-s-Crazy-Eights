# 豆豆疯狂 8 点 (Crazy Eights Deluxe)

这是一个使用 React + Tailwind CSS + Motion 开发的精致纸牌游戏。

## 部署到 Vercel 指南

按照以下步骤将此项目同步到 GitHub 并部署到 Vercel：

### 1. 初始化 GitHub 仓库
在你的本地终端执行以下命令（确保你已经安装了 [Git](https://git-scm.com/)）：

```bash
# 初始化 git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Crazy Eights Game"

# 创建一个新的 GitHub 仓库并关联（替换为你自己的仓库地址）
# git remote add origin https://github.com/你的用户名/crazy-eights.git
# git branch -M main
# git push -u origin main
```

### 2. 在 Vercel 上部署
1. 登录 [Vercel 官网](https://vercel.com/)。
2. 点击 **"Add New"** -> **"Project"**。
3. 导入你刚刚创建的 GitHub 仓库。
4. Vercel 会自动识别这是一个 **Vite** 项目：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **"Deploy"**。

### 3. 环境变量（可选）
虽然目前游戏是纯前端运行，但如果未来你使用了 Gemini AI 功能，请在 Vercel 项目设置的 **Environment Variables** 中添加：
- `GEMINI_API_KEY`: 你的 Google AI 密钥。

## 技术栈
- **框架**: React 19
- **样式**: Tailwind CSS 4
- **动画**: Motion (Framer Motion)
- **图标**: Lucide React
- **特效**: Canvas Confetti
