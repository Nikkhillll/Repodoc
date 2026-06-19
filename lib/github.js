const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
}

// Get basic repo info
export async function getRepoMeta(owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
  if (res.status === 404) throw new Error('REPO_NOT_FOUND')
  if (!res.ok) throw new Error('GITHUB_ERROR')
  return res.json()
}

// Get list of files in the repo
export async function getFileTree(owner, repo, branch) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  )
  if (!res.ok) throw new Error('GITHUB_ERROR')
  const data = await res.json()

  const ignored = ['node_modules', '.git', 'dist', 'build', 'vendor',
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']

  return data.tree
    .filter(item => item.type === 'blob')
    .filter(item => !ignored.some(ig => item.path.includes(ig)))
    .map(item => item.path)
    .slice(0, 200)
}

// Get raw file content
export async function getRawFile(owner, repo, filePath) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    { headers: { ...headers, Accept: 'application/vnd.github.raw' } }
  )
  if (!res.ok) return null
  return res.text()
}

// Get README content
export async function getReadme(owner, repo) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    { headers: { ...headers, Accept: 'application/vnd.github.raw' } }
  )
  if (!res.ok) return null
  const text = await res.text()
  return text.slice(0, 5000)
}

// Get key config file
export async function getConfigFile(owner, repo, tree) {
  const configFiles = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'pom.xml']
  const found = configFiles.find(f => tree.includes(f))
  if (!found) return null
  const content = await getRawFile(owner, repo, found)
  return content ? { name: found, content: content.slice(0, 3000) } : null
}