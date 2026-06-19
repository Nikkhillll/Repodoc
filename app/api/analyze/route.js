import { prisma } from '@/lib/prisma'
import { getRepoMeta, getFileTree, getReadme, getConfigFile } from '@/lib/github'
import { analyzeRepo } from '@/lib/ai'

// Parse owner and repo from a GitHub URL
function parseRepoUrl(url) {
  try {
    const { pathname } = new URL(url)
    const [, owner, repo] = pathname.split('/')
    if (!owner || !repo) return null
    return { owner, repo }
  } catch {
    return null
  }
}

// POST /api/analyze
export async function POST(request) {
  const body = await request.json()
  const { repoUrl } = body

  // Validate URL
  const parsed = parseRepoUrl(repoUrl)
  if (!parsed) {
    return Response.json(
      { error: "That doesn't look like a valid GitHub URL. Try https://github.com/owner/repo" },
      { status: 400 }
    )
  }

  const { owner, repo } = parsed

  try {
    // Fetch all GitHub data
    const meta = await getRepoMeta(owner, repo)
    const tree = await getFileTree(owner, repo, meta.default_branch)
    const readme = await getReadme(owner, repo)
    const configFile = await getConfigFile(owner, repo, tree)

    // Run AI analysis
    const result = await analyzeRepo({ meta, tree, readme, configFile })



    // Save to database
   const analysis = await prisma.analysis.create({
  data: {
    repoUrl: repoUrl || '',
    owner: owner || '',
    repoName: repo || '',
    summary: result.summary || '',
    techStack: JSON.stringify(result.techStack || []),
    architecture: result.architecture || '',
    gettingStarted: JSON.stringify(result.gettingStarted || []),
    readmeSuggestions: JSON.stringify(result.readmeSuggestions || []),
  },
})
    return Response.json(analysis)

  } catch (err) {
    if (err.message === 'REPO_NOT_FOUND') {
      return Response.json(
        { error: "That repo doesn't exist or is private. Check the URL and try again." },
        { status: 404 }
      )
    }
    if (err.message === 'RATE_LIMITED') {
      return Response.json(
        { error: 'GitHub rate limit hit. Please wait a moment and try again.' },
        { status: 429 }
      )
    }
    console.error(err)
    return Response.json(
      { error: 'Something unexpected happened. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/analyze
export async function GET() {
  const analyses = await prisma.analysis.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  return Response.json(analyses)
}