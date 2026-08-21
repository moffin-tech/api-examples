const TOKEN_URL = 'https://auth.moffin.mx/public/auth/oauth2/token'
const apiBase = process.env.MOFFIN_API || 'https://sandbox.moffin.mx'
const resource = process.env.MOFFIN_RESOURCE || apiBase
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

function requireCredentials () {
  if (!clientId || !clientSecret) {
    throw new Error('Set CLIENT_ID and CLIENT_SECRET.')
  }
}

async function requestToken () {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      resource,
      client_id: clientId,
      client_secret: clientSecret
    })
  })
  const body = await response.text()
  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status} ${body}`)
  }
  return JSON.parse(body)
}

async function requestPostalCode (accessToken) {
  const response = await fetch(`${apiBase}/api/v1/postal-codes/44100`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  const body = await response.text()
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${body}`)
  }
  return JSON.parse(body)
}

async function main () {
  requireCredentials()
  const token = await requestToken()
  console.log('token_type:', token.token_type, 'expires_in:', token.expires_in)
  const postalCodes = await requestPostalCode(token.access_token)
  console.log(postalCodes)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
