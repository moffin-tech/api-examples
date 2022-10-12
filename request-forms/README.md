 # Request Forms API
This README contains a brief description of the content
of the [example](./index.js).

## What are Forms?
Forms are an abstracion used to represent basic personal information used to screen applicants. Applicants will usually provide basic identifying information such as their name, contact info and tax id in a web form and this will then be submitted, where it can then be used to make further inquiries to services such as "Buro de Crédito" and similar.

While we provide these Forms through our webapp, you can also make requests
to our API to create forms for users, validate their email/phone and submit them to 
our platform, allowing you to create your own webapp and integrate it with our services.

## Using the Forms API

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

You can find more information of which information you
can send to the API in our [docs](https://moffin.mx/docs).


### Form's API flow
Forms are created by using the `create` endpoint, you should call this function after the user fills or otherwise provides all the required information. Once a Form is created, you need to verify the applicant's contact information, you can simply call `send-sms` and `send-email` to send the verification code to their phone and email respectively. 

Once the user has received their code, you can use the `validate` endpoint to check that it is indeed valid and finally use the `submit` endpoint to complete the form and submit it. 

You can also use the `update` endpoint before submission to update a form's data.

Submission should always be the last step once the form has been created and verified.

### Create a form
Create a new form using the provided data, keep in mind this doesn't actually submit the form or verify its data. Keep track of the Form ID for the rest of the endpoint calls.

You'll need a Form Config ID, which establishes the format used for the form and some of its configuration. You'll find the Form Config ID for each form defined in your account, but for the following examples and testing in our sandbox environment, you can just use the id `1`.

Please contact support if you need help finding an appropiate Form Config ID for your forms.

```js
  const { data: form } = await client.post('/form/1', {
    accountType: 'PF',
    loanAmount: '10000',
    email: 'test-dev@moffin.mx',
    firstName: 'Prueba',
    phone: '+52 <your phone number>', // Use your own phone number if you wish to test the send-sms endpoint later
    rfc: 'PRPU800101111',
    curp: 'PETJ970221HJCRRN09',
    birthdate: '1997-01-01',
    address: 'Jaime Balmes',
    city: 'Cd de Mexico',
    state: 'CMX',
    zipCode: '11510',
    exteriorNumber: '8',
    neighborhood: 'Los morales',
    country: 'MX',
    nationality: 'MX'
  })
  console.log('Created Form ID', form.formId)
```

If the Form is created without issues, you'll get the form ID back, we will use that ID for the remaining requests.


### Update a Form
This endpoint uses PATCH to update an existing form (before submission), you can use it to provide edit functions in your app.

```js
 await client.patch(`/form/${form.formId}`, {
    firstLastName: 'Apellido'
 })
```

### Send SMS/Email
These two endpoints send the NIP associated with a form to the applicant's email or sms. You can use them to verify that the email and/or phone indeed belong to the applicants. At the moment you only need to verify either one.

```js
 // Send SMS 
 const { data: smsData } = await client.post(`/form/nip/send-sms/${form.formId}`, {
    organizationName: 'Moffin' // Name to display in the SMS message
 })
 console.log('SMS Response Body', smsData)
 
 // Send Email (similar to previous endpoint)
 const { data: emailData } = await client.post(`/form/nip/send-email/${form.formId}`, {
    organizationName: 'Moffin' // Name to display in the Email
 })
 console.log('Email Response Body', smsData)
```

Both Email and SMS return some data, than can be used to check if the SMS or Email was sent without issues, as well as the remaining attempts for that code. Keep in mind that our API only allows sending one message every 2 minutes, so this endpoint may fail if you use it multiple times for the same form.

```json5
// SMS Response Body 
{
  timeUntilNewAttempt: '2022-10-12T17:41:56.185Z',
  remainingAttempts: 2,
  sent: true
}
```

```json5
// Email Response Body 
{
  timeUntilNewAttempt: '2022-10-12T17:41:56.185Z',
  remainingAttempts: 2,
  sent: true
}
```

### Verify NIP
You can use this endpoint to verify the NIP sent by the previous endpoints, keep in mind this endpoint will return 204 if the verification is succesful, not 200.

```js
 await client.post(`/form/nip/validate/${form.formId}`, {
    nip: code // code is the NIP received by the user
 })
```

### Submit the Form
Once the form has been populated with the correct information, and the it has been verified, you can submit the form to our system using this endpoint. Make sure to request all the required fields when creating the form (provided in the Create Form example).

```js
 await client.post(`/form/submit/${form.formId}`, {
    validateNIPAuthentication: true // Ensure the NIP was validated
 })
```
