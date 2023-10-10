const Axiox = require('axios')
require('dotenv').config()

const client = Axiox.create({
  baseURL: 'https://sandbox.moffin.mx/api/v1',
    headers: {
        // You can create this token in https://sandbox.moffin.mx/configuracion/api
        'Authorization': 'Token ' + process.env.API_TOKEN
    }
})

async function start() {
  const { data: CABlacklistPFResponse } = await client.post(
    "query/ca-blacklist",
    {
      firstName: 'Carlos',
      firstLastName: 'Moffin',
      accountType: 'PF'
    }
  )
  console.log('Comply Advantage PF response:', CABlacklistPFResponse.response)

  const { data: CABlacklistPMResponse } = await client.post(
    "query/ca-blacklist",
    {
      tradeName: 'Bad Organization',
      accountType: 'PM'
    }
  )
  console.log('Comply Advantage PM response:', CABlacklistPMResponse.response)
}

console.log('Executing request.')

start()
  .then(() => console.log('Request executed succesfully.'))
  .catch(console.error)
