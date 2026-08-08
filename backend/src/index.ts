import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { tagItemRouter } from './routes/tagItem.js'

const app = express()

// CORS_ORIGIN restricts the API to a known frontend origin in production
// (e.g. https://styleby-frontend.onrender.com). Left unset, all origins are
// allowed — fine for local dev, since this API holds no user auth/cookies.
app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN } : undefined))
app.use(express.json({ limit: '15mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, taggingEnabled: Boolean(process.env.GEMINI_API_KEY) })
})

app.use('/api', tagItemRouter)

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`StyleBy backend listening on http://localhost:${port}`)
  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      'GEMINI_API_KEY is not set — /api/tag-item will return an error until it is configured in backend/.env',
    )
  }
})
