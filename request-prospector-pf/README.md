 # Request prospector PF
 
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
``` js
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
``` js
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

``` js
const { data: serviceQueries } = await client.post(`/profiles/${profile.id}/query`, {
  prospectorPF: true
})
const [prospectorQuery] = serviceQueries.results
console.log('Prospector report:', prospectorQuery.response)
console.log('Score', prospectorQuery.response.json.value)
```
