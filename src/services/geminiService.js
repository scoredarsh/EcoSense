import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

/**
 * Sleep helper for backoff delays
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Compresses a base64 image using an HTML5 Canvas to reduce token usage and bandwidth.
 */
function compressImage(base64Str, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.8)) // 80% quality JPEG
    }
    img.onerror = () => resolve(base64Str) // Fallback to original if error
    img.src = base64Str
  })
}

/**
 * Analyze an uploaded waste image using Gemini Vision with retry logic.
 * Retries up to 3 times with exponential backoff on rate-limit (429) errors.
 * @param {string} base64Image - The image as a data URL (data:image/...;base64,...)
 * @returns {Promise<Object>} Analysis result with severity, type, description, isGarbage
 */
export async function analyzeWasteImage(base64Image) {
  const MAX_RETRIES = 3
  const BASE_DELAY_MS = 5000 // 5 seconds initial backoff

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

      // Compress the image before sending to save tokens and bandwidth
      const compressedBase64 = await compressImage(base64Image)

      // Strip the data URL prefix to get raw base64
      const base64Data = compressedBase64.split(',')[1]
      const mimeType = compressedBase64.match(/data:(.*?);/)?.[1] || 'image/jpeg'

      const prompt = `You are an environmental waste analysis AI for a civic reporting platform called EcoSense. Analyze this image and determine:

1. Is this image showing garbage, waste, littering, pollution, or any environmental hazard? (true/false)
2. What type of waste is visible? Choose from: General, Industrial, Hazardous, Recyclable, Water Body, Forest Area
3. Rate the severity on a scale of 1-10 where:
   - 1-3: Low severity (minor littering, small amounts of waste)
   - 4-6: Medium severity (moderate dumping, noticeable pollution)  
   - 7-8: High severity (large illegal dumps, significant pollution)
   - 9-10: Critical severity (hazardous materials, major environmental threat)
4. Provide a brief 1-2 sentence description of what you see.
5. Provide a short recommendation for cleanup.

IMPORTANT: You MUST respond ONLY with valid JSON in exactly this format, no markdown, no code fences:
{"isGarbage": true, "wasteType": "General", "severityScore": 7, "description": "...", "recommendation": "...", "confidence": 0.95}

If the image does NOT show garbage or waste, respond with:
{"isGarbage": false, "wasteType": "None", "severityScore": 0, "description": "This image does not appear to contain waste or pollution.", "recommendation": "No action needed.", "confidence": 0.9}`

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
      ])

      const response = await result.response
      const text = response.text().trim()

      // Parse the JSON response, handling potential markdown code fences
      let jsonStr = text
      if (text.startsWith('```')) {
        jsonStr = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
      }

      const analysis = JSON.parse(jsonStr)

      return {
        success: true,
        ...analysis,
      }
    } catch (error) {
      const isRateLimit =
        error?.message?.includes('429') ||
        error?.message?.includes('quota') ||
        error?.message?.includes('rate') ||
        error?.message?.includes('RESOURCE_EXHAUSTED')

      if (isRateLimit && attempt < MAX_RETRIES) {
        // Exponential backoff: 5s, 10s, 20s
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)
        console.warn(
          `[Gemini] Rate limited (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay / 1000}s…`
        )
        await sleep(delay)
        continue // retry
      }

      // Final failure — return a user-friendly error
      console.error('Gemini analysis error:', error)

      const friendlyMessage = isRateLimit
        ? 'Gemini API rate limit reached (free tier: 15 req/min). Please wait a minute and try again.'
        : 'Failed to analyze image. Please try again.'

      return {
        success: false,
        isGarbage: false,
        wasteType: 'Unknown',
        severityScore: 0,
        description: friendlyMessage,
        recommendation: '',
        confidence: 0,
        error: friendlyMessage,
      }
    }
  }
}
