import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

export const tagItemRouter = Router()

const CATEGORIES = ['top', 'bottom', 'outerwear', 'dress', 'footwear', 'accessory'] as const
const OCCASIONS = ['casual', 'work', 'formal', 'active', 'evening'] as const
const WEATHER = ['cold', 'mild', 'warm', 'hot', 'rainy'] as const

const TAGGING_TOOL: Anthropic.Tool = {
  name: 'extract_clothing_metadata',
  description:
    'Records structured closet metadata describing a single clothing, footwear, or accessory item shown in a photo.',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'A short, human-friendly name, e.g. "Ivory linen button-down".',
      },
      category: { type: 'string', enum: CATEGORIES as unknown as string[] },
      color: {
        type: 'string',
        description: 'The primary color, e.g. "ivory", "navy blue", "olive green".',
      },
      pattern: {
        type: 'string',
        description: 'e.g. "solid", "striped", "floral", "plaid", "graphic print".',
      },
      styleTags: {
        type: 'array',
        items: { type: 'string' },
        description: '2-4 lowercase style descriptors, e.g. ["minimal", "classic", "tailored"].',
      },
      occasions: {
        type: 'array',
        items: { type: 'string', enum: OCCASIONS as unknown as string[] },
        description: 'Occasions this piece suits (choose 1-3).',
      },
      warmth: {
        type: 'array',
        items: { type: 'string', enum: WEATHER as unknown as string[] },
        description: 'Weather conditions this piece works well in (choose 1-3).',
      },
    },
    required: ['name', 'category', 'color', 'pattern', 'styleTags', 'occasions', 'warmth'],
  },
}

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } {
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl)
  if (!match) throw new Error('Expected a base64 image data URL')
  return { mediaType: match[1], base64: match[2] }
}

let client: Anthropic | null = null
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured on the server')
  }
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

tagItemRouter.post('/tag-item', async (req, res) => {
  const { image } = req.body ?? {}
  if (typeof image !== 'string') {
    return res.status(400).json({ error: 'Missing "image" data URL in request body' })
  }

  try {
    const { mediaType, base64 } = parseDataUrl(image)
    const anthropic = getClient()

    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      tools: [TAGGING_TOOL],
      tool_choice: { type: 'tool', name: 'extract_clothing_metadata' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif',
                data: base64,
              },
            },
            {
              type: 'text',
              text: 'This photo has had its background removed and shows a single clothing, footwear, or accessory item from someone\'s closet. Extract its metadata.',
            },
          ],
        },
      ],
    })

    const toolUse = message.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    )
    if (!toolUse) {
      return res.status(502).json({ error: 'Vision model did not return structured metadata' })
    }

    res.json(toolUse.input)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('ANTHROPIC_API_KEY') ? 503 : 500
    res.status(status).json({ error: message })
  }
})
