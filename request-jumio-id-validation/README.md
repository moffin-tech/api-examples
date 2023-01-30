# Request Jumio ID Validation

This README contains a brief description of the content
of the [example](./index.js).

## What are Jumio ID Validation?

Jumio is an online identity validation platform that uses artificial intelligence and machine learning technologies to verify users' identity through their government-issued ID and selfie.
Jumio's ID validation helps reduce fraud and improve user experience by providing a fast and secure process for verifying identity online.

## Using the Jumio ID Validation

### Create your moffin account

First you will need an account in the Moffin.
You can create one easily in this
[page](https://moffin.mx/sign_up).

### Generate an Access Token

Go to the configuration panel in moffin to create an
_Access Token_.

Go to "Configuración" > "API" > "Crear nuevo token":

- [Configure token in production](https://app.moffin.mx/configuracion/api)

Then you can configure the token as is show in this example.

```js
const client = Axios.create({
  baseURL: "https://moffin.mx/api/v1",
  headers: {
    Authorization: "Token " + process.env.API_TOKEN,
  },
});
```

You can find more information of which information you
can send to the API in our [docs](https://moffin.mx/docs).

### Jumio API Credentials

The ID validation flow is created through the jumio endpoint using either Moffin's credentials or your own Jumio credentials.

By default, Moffin's credentials are used to access the Jumio service. However, you can also configure your own Jumio credentials to integrate with Moffin.

If you do not have a Jumio license and do not want to use Moffin's credentials, [you can contact our sales service](https://wa.me/message/GRMVHZTTGPCGF1) or send an email to <sales@moffin.mx> and request an OEM JUMIO license to integrate with Moffin.

We offer the option to access the license through monthly payments.

### Configuring Credentials: Only If Not Using Moffin's

Configure your Jumio OAuth2 Clients credentials, which can be found in the [customer-portal](https://customer-portal.netverify.com/), under "Settings" > "API Credentials" > "OAuth2 Clients", in order to integrate with Moffin using the `/credential/jumio` endpoint. Provide the CLIENT_ID and CLIENT_SECRET when making the request.

```js
const { data: configureCredential } = await client.post("/credential/jumio", {
  user: "JUMIO_CLIENT_ID",
  password: "JUMIO_CLIENT_SECRET",
});
```

```js
{
    "id": 9999999,
    "organizationId": 115151515151,
    "type": "jumio",
    "user": "999aaaaa999bbbbb9cc9d9e9fff9",
    "metadata": null,
    "createdAt": "2023-01-16T20:33:11.272Z",
    "updatedAt": "2023-01-30T18:15:21.778Z"
}
```

You can check our documentation for more information about this endpoint at <>

Please contact support if you need help finding an appropiate Jumio Config Credential for your integration.

### Create ID Validation Link

This endpoint uses a POST request to `query/id_validation/jumio` to initiate an ID validation flow, which returns information from the query service and provides a URL for the customer to complete the validation process.
The request body includes two parameters, `successURL` and `failURL`, which specify the URLs to redirect the customer to in the case of a successful or failed validation, respectively.

```js
const { data: createValidationLink } = await client.post(
  "query/id_validation/jumio",
  {
    successURL: "https://YOUR_URL_PAGE_VALIDATION_SUCCESS",
    failURL: "https://YOUR_URL_PAGE_VALIDATION_FAIL",
  }
);
```

```js
{
    "id": 99999,
    "authentication": "MOFFIN",
    "service": "jumio_id_validation",
    "status": "PENDING",
    "state": {
       // State of Service Query
    },
    "metadata": {
        "clientType": "PF",
        "reportType": "PF",
        "query": {
            "failURL": "https://YOUR_URL_PAGE_VALIDATION_FAIL",
            "successURL": "https://YOUR_URL_PAGE_VALIDATION_SUCCESS"
        }
    },
    "query": {
        "successURL": "https://YOUR_URL_PAGE_VALIDATION_SUCCESS",
        "failURL": "https://YOUR_URL_PAGE_VALIDATION_FAIL"
    },
    "response": {
        "id": "999999-c999999-999999-999999-9999999",
        "formURL": "https://moffin.web.amer-1.jumio.ai/web/v4/app?authorizationToken=TOKEN_RESPONSE_JUMIO&locale=es"
    },
    "requesterId": 9999,
    "organizationId": 999999,
    "profileId": null,
    "formId": null,
    "externalId": null,
    "createdAt": "2023-01-30T18:24:02.287Z",
    "updatedAt": "2023-01-30T18:24:02.549Z",
    "deletedAt": null,
    "cachedFrom": null
}
```

```js
const validationLink = createValidationLink.response.formURL; // https://moffin.web.amer-1.jumio.ai/web/v4/app?authorizationToken=TOKEN_RESPONSE_JUMIO&locale=es
```

With this generated link, you can share it with your customers to complete the ID validation flow.
