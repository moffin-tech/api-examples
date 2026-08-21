const axios = require('axios')

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
  const { data } = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: 'client_credentials',
      resource,
      client_id: clientId,
      client_secret: clientSecret
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  )
  return data
}

async function requestPostalCode (accessToken) {
  const { data } = await axios.get(`${apiBase}/api/v1/postal-codes/44100`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return data
}

async function main () {
  requireCredentials()
  const token = await requestToken()
  console.log('token_type:', token.token_type, 'expires_in:', token.expires_in)
  const postalCodes = await requestPostalCode(token.access_token)
  console.log(postalCodes)
}

main().catch((error) => {
  if (error.response) {
    console.error('Request failed:', error.response.status, error.response.data)
  } else {
    console.error(error.message)
  }
  process.exit(1)
})
