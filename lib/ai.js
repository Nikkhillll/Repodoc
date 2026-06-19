const MODEL = process.env.MODEL_NAME || 'openai/gpt-4o-mini'

const SYSTEM_PROMPT = `You are an expert software engineer explaining unfamiliar codebases to other developers.
You will be given a repository's file tree, README content, and key configuration files.

Respond with valid JSON only — no markdown fences, no preamble — in exactly this shape:
{
  "summary": string,
  "techStack": string[],
  "architecture": string,
  "gettingStarted": string[],
  "readmeSuggestions": string[]
}

Base every claim strictly on the provided content. If something can't be determined
from the given files, say so explicitly rather than guessing.`

export async function analyzeRepo({ meta, tree, readme, configFile }) {
  const userMessage = `
REPO METADATA:
Name: ${meta.full_name}
Description: ${meta.description || 'No description'}
Language: ${meta.language || 'Unknown'}
Stars: ${meta.stargazers_count}

FILE TREE:
${tree.join('\n')}

README:
${readme || 'No README found'}

CONFIG FILE (${configFile?.name || 'none found'}):
${configFile?.content || 'N/A'}
  `.trim()

  const response = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (response.status === 429) throw new Error('RATE_LIMITED')
 if (!response.ok) {
  const errText = await response.text()
  console.error('AI API Error:', response.status, errText)
  throw new Error('AI_ERROR')
}

  const data = await response.json()
 
const raw = data?.choices?.[0]?.message?.content
if (typeof raw === 'object') return raw

  // Strip markdown fences if present
 if (!raw) throw new Error('AI_EMPTY_RESPONSE')
const cleaned = raw
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/\s*```$/i, '')
  .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error('AI_PARSE_ERROR')
  }
}