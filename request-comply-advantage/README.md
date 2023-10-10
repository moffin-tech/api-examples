# Request Comply Advantage Blacklist
This README contains a brief description of [the example content](./index.js)

## What exactly is Comply Advantage?
Comply Advantage is a tech company that creates a solution detecting and reducing fraud losses. The Comply Advantage focus is to identify and reduce the risks associated with illegal financial activities.

Comply Advantage uses advanced technologies like automatic learning and natural language process to analyze big financial data and detect abnormal or suspicious patterns. Their platform combines data from different sources, such as sanctions lists, regulatory reports, news, and social media, to give its clients a comprehensive view of potential risks.

## How can I use Comply Advantage?

### Create your moffin account
First you will need an account in the Moffin Sandbox
environment. You can create one easily in this
[page](https://moffin.mx/sign_up).

### Generate an Access Token
Go to the configuration panel in moffin to create an *access Token*.

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

You can find more information of which information you can send to the API in our [docs](https://moffin.mx/docs).

### Comply Advantage Globals

You can configure the level of matching a profile _Fuzziness_ the accepted value can be 0 to 1.0 it could be until 2 decimals.
A value with 0 would be an exact match, and 1 enables a wide range of variations between search terms and terms in the Comply Advantage database. By default, it is set as 1.

If you already have a configured profile on Comply Advantage, you can added to your consults. This value is optional and is not set by default.

You can add your token created in your account of Comply Advantage, and easily added it in the settings page. But if you don't have a Comply Advantage account, don't worry. You can still use our account.

To configure this values you can go to "Configuración" > "Integraciones" > "Comply Advantage":
* [Configure globals in sandbox](https://sandbox.moffin.mx/configuracion)
* [Configure globals in production](https://app.moffin.mx/configuracion)


### Create a new Comply Advantage Blacklist report

We can create a new consult to Comply Advantage uses a POST request to `query/ca-blacklist`, we allow two account types, `PF`(*Persona fisica*) or `PM`(*Persona moral*).

Request example to PF request

```js
const { data: CABlacklistResponse } = await client.post('query/ca-blacklist', {
  firstName: 'Carlos',
  firstLastName: 'Moffin',
  accountType: 'PF'
})

console.log('Comply Advantage response:', CABlacklistResponse)
```

```output
{
	"id": 73,
	"authentication": "CUSTOM",
	"service": "ca_blacklist",
	"status": "SUCCESS",
	"state": {
		"rawResponse": {
			"client_ref": null,
			"id": 1312796095,
			"ref": "1685537000-icu19ZSU",
			"searcher_id": 26000,
			"assignee_id": 26000,
			"filters": {
				"country_codes": [],
				"exact_match": false,
				"fuzziness": 0.5,
				"remove_deceased": 0,
				"types": [
					"warning",
					"sanction"
				]
			},
			"match_status": "potential_match",
			"risk_level": "unknown",
			"search_term": "Carlos  Moffin ",
			"submitted_term": "Carlos  Moffin ",
			"total_hits": 1,
			"total_matches": 1,
			"total_blacklist_hits": 0,
			"created_at": "2023-05-31T20:20:13.911Z",
			"updated_at": "2023-05-31T20:20:13.911Z",
			"tags": [],
			"labels": [],
			"limit": 500,
			"offset": 0,
			"searcher": {
				"id": 26000,
				"email": "moffin@moffin.mx",
				"name": "Moffin",
				"phone": "0",
				"created_at": "2023-01-01 01:43:43",
				"user_is_active": true
			},
			"assignee": {
				"id": 26000,
				"email": "moffin@moffin.mx",
				"name": "Moffin",
				"phone": "0",
				"created_at": "2023-01-01 01:43:43",
				"user_is_active": true
			},
			"hits": [
				{
					"doc": {
						"aka": [],
						"created_utc": "2020-01-19T10:55:53Z",
						"associates": [
							{
								"name": "Jose Moffin",
								"association": "Uncle"
							}
						],
						"entity_type": "person",
						"fields": [
							{
								"locale": "en",
								"name": "Justification",
								"source": "swiss-seco-list",
								"value": "Unemployed man who dinned and dashed"
							},
							{
								"name": "Other Information",
								"source": "swiss-seco-list",
								"value": "Unemployed"
							},
							{
								"name": "Date of Birth",
								"source": "swiss-seco-list",
								"tag": "date_of_birth",
								"value": "2000"
							}
						],
						"first_name": "Carlos",
						"id": "MOFCAR01010102C",
						"last_name": "Moffin",
						"last_updated_utc": "2019-06-16T01:11:14Z",
						"middle_names": "",
						"media": [
							{
								"date": "2018-09-17T00:00:00Z",
								"snippet": "Carlos Moffin is wanted for crimes against everything. New investigations link Carlos Moffin with every crime group in the world, as well as being responsible for everything bad.",
								"title": "Carlos Moffin is wanted for crimes against everything",
								"url": "https://www.moffin.mx"
							}
						],
						"source_notes": {
							"swiss-seco-list": {
								"aml_types": [
									"sanction"
								],
								"listing_ended_utc": "2020-03-03T00:00:00Z",
								"listing_started_utc": "2018-02-27T00:00:00Z",
								"name": "Switzerland SECO List",
								"url": "https://moffin.mx"
							}
						},
						"name": "Carlos Moffin",
						"sources": [
							"swiss-seco-list"
						],
						"types": [
							"sanction"
						]
					},
					"match_types": [
						"name_exact",
						"year_of_birth"
					],
					"match_types_details": [],
					"score": 3.511
				}
			],
			"blacklist_hits": []
		}
	},
	"metadata": {
		"clientType": "PF",
		"reportType": "PF",
		"query": {
			"searchTerm": "Carlos  Moffin ",
			"accountType": "PF"
		}
	},
	"query": {
		"searchTerm": "Carlos  Moffin ",
		"accountType": "PF"
	},
	"response": {
		"searchTerm": "Carlos  Moffin ",
		"searchId": "1312796095",
		"matchStatus": "potential_match",
		"riskLevel": "unknown",
		"resultsFound": [
			{
				"title": "Carlos Moffin",
				"matched": [
					"sanction"
				],
				"score": 3.511,
				"sources": [
					"swiss-seco-list"
				],
				"type": "person"
			}
		],
		"totalHits": 1,
		"totalMatches": 1,
		"createdAt": "2023-05-31T20:20:13.911Z",
		"updatedAt": "2023-05-31T20:20:13.911Z"
	},
	"requesterId": 1001,
	"organizationId": 1,
	"profileId": 67,
	"formId": null,
	"externalId": null,
	"createdAt": "2023-05-31T20:20:13.911Z",
	"updatedAt": "2023-05-31T20:20:13.915Z",
	"deletedAt": null,
	"cachedFrom": null
}
```

Request example to PM request

```js
const { data: CABlacklistResponse } = await client.post('query/ca-blacklist', {
  tradeName: 'Bad Organization',
  accountType: 'PM'
})

console.log('Comply Advantage response:', CABlacklistResponse)
```

```output
{
	"id": 73,
	"authentication": "CUSTOM",
	"service": "ca_blacklist",
	"status": "SUCCESS",
	"state": {
		"rawResponse": {
			"client_ref": null,
			"id": 1312796095,
			"ref": "1685537000-icu19ZSU",
			"searcher_id": 26000,
			"assignee_id": 26000,
			"filters": {
				"country_codes": [],
				"exact_match": false,
				"fuzziness": 0.5,
				"remove_deceased": 0,
				"types": [
					"warning",
					"sanction"
				]
			},
			"match_status": "potential_match",
			"risk_level": "unknown",
			"search_term": "Carlos  Moffin ",
			"submitted_term": "Carlos  Moffin ",
			"total_hits": 1,
			"total_matches": 1,
			"total_blacklist_hits": 0,
			"created_at": "2023-05-31T20:20:13.911Z",
			"updated_at": "2023-05-31T20:20:13.911Z",
			"tags": [],
			"labels": [],
			"limit": 500,
			"offset": 0,
			"searcher": {
				"id": 26000,
				"email": "moffin@moffin.mx",
				"name": "Moffin",
				"phone": "0",
				"created_at": "2023-01-01 01:43:43",
				"user_is_active": true
			},
			"assignee": {
				"id": 26000,
				"email": "moffin@moffin.mx",
				"name": "Moffin",
				"phone": "0",
				"created_at": "2023-01-01 01:43:43",
				"user_is_active": true
			},
			"hits": [
				{
					"doc": {
						"aka": [],
						"created_utc": "2020-01-19T10:55:53Z",
						"associates": [
							{
								"name": "Jose Moffin",
								"association": "Uncle"
							}
						],
						"entity_type": "person",
						"fields": [
							{
								"locale": "en",
								"name": "Justification",
								"source": "swiss-seco-list",
								"value": "Unemployed man who dinned and dashed"
							},
							{
								"name": "Other Information",
								"source": "swiss-seco-list",
								"value": "Unemployed"
							},
							{
								"name": "Date of Birth",
								"source": "swiss-seco-list",
								"tag": "date_of_birth",
								"value": "2000"
							}
						],
						"first_name": "Carlos",
						"id": "MOFCAR01010102C",
						"last_name": "Moffin",
						"last_updated_utc": "2019-06-16T01:11:14Z",
						"middle_names": "",
						"media": [
							{
								"date": "2018-09-17T00:00:00Z",
								"snippet": "Carlos Moffin is wanted for crimes against everything. New investigations link Carlos Moffin with every crime group in the world, as well as being responsible for everything bad.",
								"title": "Carlos Moffin is wanted for crimes against everything",
								"url": "https://www.moffin.mx"
							}
						],
						"source_notes": {
							"swiss-seco-list": {
								"aml_types": [
									"sanction"
								],
								"listing_ended_utc": "2020-03-03T00:00:00Z",
								"listing_started_utc": "2018-02-27T00:00:00Z",
								"name": "Switzerland SECO List",
								"url": "https://moffin.mx"
							}
						},
						"name": "Carlos Moffin",
						"sources": [
							"swiss-seco-list"
						],
						"types": [
							"sanction"
						]
					},
					"match_types": [
						"name_exact",
						"year_of_birth"
					],
					"match_types_details": [],
					"score": 3.511
				}
			],
			"blacklist_hits": []
		}
	},
	"metadata": {
		"clientType": "PF",
		"reportType": "PF",
		"query": {
			"searchTerm": "Carlos  Moffin ",
			"accountType": "PF"
		}
	},
	"query": {
		"searchTerm": "Carlos  Moffin ",
		"accountType": "PF"
	},
	"response": {
		"searchTerm": "Carlos  Moffin ",
		"searchId": "1312796095",
		"matchStatus": "potential_match",
		"riskLevel": "unknown",
		"resultsFound": [
			{
				"title": "Carlos Moffin",
				"matched": [
					"sanction"
				],
				"score": 3.511,
				"sources": [
					"swiss-seco-list"
				],
				"type": "person"
			}
		],
		"totalHits": 1,
		"totalMatches": 1,
		"createdAt": "2023-05-31T20:20:13.911Z",
		"updatedAt": "2023-05-31T20:20:13.911Z"
	},
	"requesterId": 1001,
	"organizationId": 1,
	"profileId": 67,
	"formId": null,
	"externalId": null,
	"createdAt": "2023-05-31T20:20:13.911Z",
	"updatedAt": "2023-05-31T20:20:13.915Z",
	"deletedAt": null,
	"cachedFrom": null
}
```


You can see more information about this request in [our guides](https://guides.moffin.mx/comply-advantage).
If you want to know what other parameters you can send checkout [our documentation](https://moffin.mx/docs#tag/Query-data-sources/paths/~1api~1v1~1query~1imss-job-history/post)
