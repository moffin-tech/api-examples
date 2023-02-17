# Request Jumio ID Validation

This README contains a brief description of the content
of the [example](./index.js).

## What is Jumio ID Validation?

Jumio is an online identity validation platform that uses artificial intelligence and machine learning technologies to verify users' identity through their government-issued ID and selfie.
Jumio's ID validation helps reduce fraud and improve user experience by providing a fast and secure process for verifying identity online.

## Using the Jumio ID Validation

### Create your moffin account

First, you will need a Moffin account.
You can create one easily in this
[page](https://moffin.mx/sign_up).

### Generate an Access Token

Go to the configuration panel in Moffin to create an
_Access Token_.

Go to "Configuración" > "API" > "Crear nuevo token":

- [Configure token in production](https://app.moffin.mx/configuracion/api)

Then you can configure the token as is shown in this example.

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

The ID validation flow is created through the Jumio endpoint using either Moffin's credentials or your Jumio credentials.

By default, Moffin's credentials are used to access the Jumio service. However, you can also configure your Jumio credentials to integrate with Moffin.

If you do not have a Jumio license and do not want to use Moffin's credentials, [you can contact our sales service](https://wa.me/message/GRMVHZTTGPCGF1) or send an email to <sales@moffin.mx> and request an OEM JUMIO license to integrate with Moffin.

We offer the option to access the license through monthly payments.

### Configuring Credentials: Only If Not Using Moffin's

Configure your Jumio OAuth2 Clients credentials, which can be found in the [customer-portal](https://customer-portal.netverify.com/), under "Settings" > "API Credentials" > "OAuth2 Clients", to integrate with Moffin using the `/credential/jumio` endpoint. Provide the CLIENT_ID and CLIENT_SECRET when making the request.
To configure your Jumio credentials visit our app at the following link https://app.moffin.mx/configuracion
On this page you will find this section where you can enter your Jumio credentials

![image](https://user-images.githubusercontent.com/73318091/218807954-ee69459f-3a21-4667-8bcd-3091cf47544d.png)


You can check our documentation for more information about this endpoint at <>

Please contact support if you need help finding an appropriate Jumio Config Credential for your integration.

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

![Screenshot from 2023-01-30 15-38-03](https://user-images.githubusercontent.com/73318091/215574089-d8af5258-cb96-4028-90f8-6ccfdbeadc83.png)
