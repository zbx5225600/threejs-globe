# 部署指南

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:5173

## 生产构建

1. 构建项目：
```bash
npm run build
```

2. 预览构建结果：
```bash
npm run preview
```

## 部署到静态托管

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# 上传 dist 文件夹到 Netlify
```

### GitHub Pages
```bash
npm run build
# 将 dist 文件夹内容推送到 gh-pages 分支
```

## 环境变量

如需连接真实的碳排放数据 API，请设置：
```
VITE_API_URL=https://your-api-url.com/api
VITE_API_KEY=your_api_key
```