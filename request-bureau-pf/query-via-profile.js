
const fs = require('fs')
require('dotenv').config()

const client = Axios.create({
  baseURL: 'https://sandbox.moffin.mx/api/v1',
  headers: {
    // You can create this token in https://sandbox.moffin.mx/configuracion/api
    'Authorization': 'Token ' + process.env.API_TOKEN
  }
})

async function start () {
  const { data: profile } = await client.post('/profiles', {
    accountType: 'PF',
    email: 'test-dev@moffin.mx',
    firstName: 'UNO',
    firstLastName: 'PRUEBA',
    secondLastName: 'PROSPECTOR',
    basicRFC: 'PRPU800101',
    address: 'Jaime Balmes',
    city: 'Cd de Mexico',
    state: 'CMX',
    zipCode: '11510',
    exteriorNumber: '8',
    neighborhood: 'Los morales',
    country: 'MX',
    nationality: 'MX'
  })
  const { data: serviceQueries } = await client.post(`/profiles/${profile.id}/query`, {
    bureauPF: true
  })
  const [bureauQuery] = serviceQueries.results
  console.log('Prospector report:', bureauQuery.response)
  fs.writeFileSync('bureau-pf.json', JSON.stringify(bureauQuery, null, 2))
}

console.log('Executing request.')
start()
  .then(() => console.log('Request executed succesfully.'))
  .catch(console.error)
