# How to use OAuth client_credentials

Use this flow to call the Moffin REST API with OAuth. You need a `client_id` and a `client_secret`. With those you request a short-lived JWT and send it as `Authorization: Bearer`.

This page covers only `client_credentials`. Static API keys use `Authorization: Token` instead. See the other examples in this repo for that header.

**Production and Sandbox login credentials are shared. OAuth clients are not.** You need one OAuth client for Production and another for Sandbox. The issuer is the same (`https://auth.moffin.mx`). The `resource` value is what separates them.

## A) How to request a token

`resource` is required. There is no default. If you omit it, the issuer rejects the request.

| Environment | API | `resource` | Issuer (token) |
| --- | --- | --- | --- |
| Production | `https://app.moffin.mx` | `https://app.moffin.mx` | `https://auth.moffin.mx` |
| Sandbox | `https://sandbox.moffin.mx` | `https://sandbox.moffin.mx` | `https://auth.moffin.mx` |

Discovery (RFC 8414, not OIDC): <https://auth.moffin.mx/.well-known/oauth-authorization-server>

That document includes `token_endpoint` and `jwks_uri`. The JWKS is `/public/auth/jwks`. `/.well-known/openid-configuration` returns **404**.

Sandbox request (`Content-Type: application/x-www-form-urlencoded`):

```shell
curl --location 'https://auth.moffin.mx/public/auth/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'resource=https://sandbox.moffin.mx' \
--data-urlencode 'client_id={{CLIENT_ID}}' \
--data-urlencode 'client_secret={{CLIENT_SECRET}}'
```

Replace `{{CLIENT_ID}}` and `{{CLIENT_SECRET}}` with your credentials. In Production use `resource=https://app.moffin.mx` and the Production client. The token lasts **900 seconds**.

## B) How to use the token in the API

Once you have the `access_token`, send it on API requests. Use `Bearer`, not `Token`. `Token` is only for the static API key.

```shell
curl --location 'https://sandbox.moffin.mx/api/v1/postal-codes/44100' \
--header 'Authorization: Bearer {{ACCESS_TOKEN}}'
```

Replace `{{ACCESS_TOKEN}}` with the token from step A.

## C) How to verify the token

Use the same postal-code endpoint:

```shell
curl --location 'https://sandbox.moffin.mx/api/v1/postal-codes/44100' \
--header 'Authorization: Bearer {{ACCESS_TOKEN}}'
```

A `200` with postal-code data means the token is valid.

Valid token:

```json
[
    {
        "postalCode": "44100",
        "neighborhood": "Guadalajara Centro",
        "neighborhoodType": "Colonia",
        "municipality": "Guadalajara",
        "state": "Jalisco",
        "city": "Guadalajara",
        "administrationPostalCode": "44101",
        "stateCode": "14",
        "officePostalCode": "44101",
        "neighborhoodTypeCode": "09",
        "municipalityCode": "039",
        "neighborhoodId": "0003",
        "zone": "Urbano",
        "cityCode": "03"
    }
]
```

No token:

```json
{
    "statusCode": 401,
    "code": "FST_JWT_NO_AUTHORIZATION_IN_HEADER",
    "error": "Unauthorized",
    "message": "No Authorization was found in request.headers"
}
```

Sandbox token sent to Production (or the reverse). Read the `WWW-Authenticate` header, not only the JSON:

```
WWW-Authenticate: Bearer error="invalid_token", error_description="token audience does not match this environment"
```

```json
{
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Unauthorized"
}
```

## D) Warnings

**Do not retry a 401 for audience.** A `401` with `WWW-Authenticate: Bearer error="invalid_token", error_description="token audience does not match this environment"` means you used credentials from the wrong environment. Do not retry. A refresh produces the same `aud` and the client loops.

**Secret rotation is a hard cut.** There is one secret per client and no overlap window. The old secret stops working the moment the new one is issued. Plan the change.

Keep `client_secret` in a safe place and do not share it. For more help, see the [Moffin docs](https://moffin.mx/docs) or contact support.
