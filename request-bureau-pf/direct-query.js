const Axios = require('axios')
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
  const { data: bureauQuery } = await client.post('/query/bureau_pf', {
    accountType: 'PF',
    email: 'test-dev@moffin.mx',
    firstName: 'UNO',
    firstLastName: 'PRUEBA',
    secondLastName: 'PROSPECTOR',
    rfc: 'PRPU800101',
    address: 'Jaime Balmes',
    city: 'Cd de Mexico',
    birthdate: '1950-01-12',
    state: 'CMX',
    zipCode: '11510',
    exteriorNumber: '8',
    municipality: 'CUAJIMALPA DE MORELOS',
    neighborhood: 'Los morales',
    country: 'MX',
    nationality: 'MX'
  })
  console.log('Prospector report:', bureauQuery.response)
  fs.writeFileSync('bureau-pf.json', JSON.stringify(bureauQuery, null, 2))
}

console.log('Executing request.')
start()
  .then(() => console.log('Request executed succesfully.'))
  .catch(console.error)
