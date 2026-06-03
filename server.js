import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Tailwind 需要 style-src 'unsafe-inline' 用于开发环境样式注入
// 生产构建后所有样式提取到 CSS 文件，届时可移除
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
    },
  },
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET'],
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

app.use(express.static(path.join(__dirname, 'packages', 'frontend', 'dist'), {
  maxAge: '1d',
  etag: true,
}))

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'packages', 'frontend', 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`OmniAlgoViz running on http://localhost:${PORT}`)
})
