 # Request prospector PF
This README contains a brief description of the content
of the [example](./index.js).

## What exactly is prospector?
Prospector is a service made by "Buro de Crédito", where
you can ask only the Score developed by them.

The advantage of this service, is that it is cheaper than
the full report. We recomend this service for those
companies who uses the *Buró Score* as a filter in their
pre-evaluation process.

## How can I use the Buró Score?

### Create your moffin account
First you will need an account in the Moffin Sandbox
environment. You can create one easily in this
[page](https://moffin.mx/sign_up).

### Generate an Access Token
Go to the configuration panel in moffin to create an
*Access Token*.

Go to "Configuración" > "API" > "Crear nuevo token":
* [Configure token in sandbox](https://sandbox.moffin.mx/configuracion/api)
* [Configure token in production](https://app.moffin.mx/configuracion/api)

Then you can configure the token as is show in this example.
```js
const client = Axios.create({
  baseURL: 'https://sandbox.moffin.mx/api/v1',
  headers: {
  'Authorization': 'Token ' + process.env.API_TOKEN
  }
})
```

### Create a profile
Create a profile for each one of the users you want to
consult to *Buró de Crédito*. We highly recommend you
to save the profile id.

You can find more information of which information you
can send to the API in our [docs](https://moffin.mx/docs).

**Important:** In order to make succefull tests in sandbox
you should use the user in this example. Other way, is
probable you will not get a response from *Buró de Crédito*.
```js
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

console.log('Profile id', profile.id)
```

### Request report
Once you have created the report, you can request the
*Prospector* report sending the profile ID and the
report flag you want to ask, in this case `prospectorPF`.

```js
const { data: serviceQueries } = await client.post(`/profiles/${profile.id}/query`, {
  prospectorPF: true
})
const [prospectorQuery] = serviceQueries.results
console.log('Prospector report:', prospectorQuery.response)
console.log('Score', prospectorQuery.response.json.value)
```

The service response should look something like this:
```json
[{
  "intlQuery": "INTL12fd85dcbf-7bc0-4ac1-a403-5107MX0000**ICCMX000000000SP01     0000000PN06PRUEBA0010PROSPECTOR0203UNO0408010119800510PRPU8001010802MX1602MXPA14JAIME BALMES 80111LOS MORALES0312CD DE MEXICO0404CDMX0505115101302MXES05002440002**",
  "intl": "INTL12fd85dcbf-7bc0-4ac1-a403-5MX0000**********10PN06PRUEBA0010PROSPECTOR0203UNO0408010119800510PRPU8001010802MX1602MXPA14JAIME BALMES 80111LOS MORALES0312CD DE MEXICO0404CDMX0505115101302MXSC08BC SCORE000300701040711020209ES0500252001020174669690102**\u0013",
  "json": {
    "reference": "fd85dcbf-7bc0-4ac1-a403-5",
    "name": {
      "firstLastname": "PRUEBA",
      "secondLastname": "PROSPECTOR",
      "firstname": "UNO",
      "birthdate": "01011980",
      "rfc": "PRPU800101",
      "nationality": "MX",
      "countryKey": "MX"
    },
    "address": {
      "address": "JAIME BALMES 8",
      "neighborhood": "LOS MORALES",
      "city": "CD DE MEXICO",
      "state": "CDMX",
      "zipCode": "11510",
      "addressCountry": "MX"
    },
    "score": {
      "name": "BC SCORE",
      "code": "007",
      "value": "0711",
      "cause1": "09"
    },
    "fileEnd": {
      "fileLength": "00252",
      "endMark": "**"
    },
    "header": {
      "segmentTag": "INTL",
      "version": "12",
      "reference": "fd85dcbf-7bc0-4ac1-a403-5",
      "countryCode": "MX",
      "reservedUse1": "0000",
      "userKey": "********************",
      "wasFound": "1",
      "reservedUse2": "0"
    }
  }
}]
```

The most relevant information is inside the variable
`prospectorQuery.response.json`:
```js
{
  name: 'BC SCORE',
  code: '007',
  value: '0711', // This is the score value
  cause1: '09'
}
```
