import { Router } from 'express'
import { GoogleGenAI, Type } from '@google/genai'

export const tagItemRouter = Router()

const CATEGORIES = ['top', 'bottom', 'outerwear', 'dress', 'footwear', 'accessory']
const OCCASIONS = ['casual', 'work', 'formal', 'active', 'evening']
const WEATHER = ['cold', 'mild', 'warm', 'hot', 'rainy']

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'A short, human-friendly name, e.g. "Ivory linen button-down".',
    },
    category: { type: Type.STRING, enum: CATEGORIES },
    color: {
      type: Type.STRING,
      description: 'The primary color, e.g. "ivory", "navy blue", "olive green".',
    },
    pattern: {
      type: Type.STRING,
      description: 'e.g. "solid", "striped", "floral", "plaid", "graphic print".',
    },
    styleTags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-4 lowercase style descriptors, e.g. ["minimal", "classic", "tailored"].',
    },
    occasions: {
      type: Type.ARRAY,
      items: { type: Type.STRING, enum: OCCASIONS },
      description: 'Occasions this piece suits (choose 1-3).',
    },
    warmth: {
      type: Type.ARRAY,
      items: { type: Type.STRING, enum: WEATHER },
      description: 'Weather conditions this piece works well in (choose 1-3).',
    },
  },
  required: ['name', 'category', 'color', 'pattern', 'styleTags', 'occasions', 'warmth'],
}

function parseDataUrl(dataUrl: string): { mimeType: string; base64: string } {
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl)
  if (!match) throw new Error('Expected a base64 image data URL')
  return { mimeType: match[1], base64: match[2] }
}

let client: GoogleGenAI | null = null
function getClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server')
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  return client
}

tagItemRouter.post('/tag-item', async (req, res) => {
  const { image } = req.body ?? {}
  if (typeof image !== 'string') {
    return res.status(400).json({ error: 'Missing "image" data URL in request body' })
  }

  try {
    const { mimeType, base64 } = parseDataUrl(image)
    const ai = getClient()

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: base64 } },
            {
              text: 'This photo has had its background removed and shows a single clothing, footwear, or accessory item from someone\'s closet. Extract its metadata.',
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    })

    const text = response.text
    if (!text) {
      return res.status(502).json({ error: 'Vision model did not return structured metadata' })
    }

    res.json(JSON.parse(text))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('GEMINI_API_KEY') ? 503 : 500
    res.status(status).json({ error: message })
  }
})
