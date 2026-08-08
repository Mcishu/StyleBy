import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { tagItemRouter } from './routes/tagItem.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '15mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, taggingEnabled: Boolean(process.env.ANTHROPIC_API_KEY) })
})

app.use('/api', tagItemRouter)

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`StyleBy backend listening on http://localhost:${port}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      'ANTHROPIC_API_KEY is not set — /api/tag-item will return an error until it is configured in backend/.env',
    )
  }
})
