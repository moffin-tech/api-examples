 # Request bureau PF
This README contains a brief description of the content
of the [example](./index.js).

## What exactly is prospector?
Prospector is a service made by "Buro de Crédito", where
you can get the information about the credits of people.

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

### How to make a query?

You can make a query to this service in two ways:

- Creating a profile and then making a query via the profile
- Making a query directly to the service and letting our system
  to create or update the profile automatically.

#### Create a profile and making a query
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

##### Request report
Once you have created the report, you can request the
*Prospector* report sending the profile ID and the
report flag you want to ask, in this case `prospectorPF`.

```js
const { data: serviceQueries } = await client.post(`/profiles/${profile.id}/query`, {
  bureauPF: true
})
const [bureauQuery] = serviceQueries.results
console.log('Bureau PF report:', bureauQuery.response)
```

#### Make a query directly

You can make a query to the service and let our system handle
the process of creating or updating a profile.

An existing profile is updated only with the new data if at least one of
following matches is found (in order of priority):

- Search a profile by the full RFC (homoclave) if available.
- Search by the CURP if available.
- Search by the `externalId` if available.

```js
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
```

### Service response

The response should look something like this:

```json
{
  "return": {
    "Personas": {
      "Persona": [
        {
          "Encabezado": {
            "NumeroReferenciaOperador": "36a98c3583c14258878e863a3",
            "ClavePais": "MX",
            "IdentificadorBuro": "0000",
            "ClaveOtorgante": "**********",
            "ClaveRetornoConsumidorPrincipal": "1",
            "ClaveRetornoConsumidorSecundario": "0",
            "NumeroControlConsulta": "2018224031"
          },
          "Nombre": {
            "ApellidoPaterno": "PRUEBA",
            "ApellidoMaterno": "PROSPECTOR",
            "PrimerNombre": "UNO",
            "FechaNacimiento": "01011980",
            "RFC": "PRPU800101R67",
            "Nacionalidad": "MX"
          },
          "Domicilios": {
            "Domicilio": [
              {
                "Direccion1": "JAIME BALMES 8",
                "ColoniaPoblacion": "LOS MORALES",
                "Ciudad": "CD DE MEXICO",
                "Estado": "CDMX",
                "CP": "11510",
                "CodPais": "MX",
                "FechaReporteDireccion": "21112018"
              }
            ]
          },
          "Empleos": null,
          "Cuentas": {
            "Cuenta": [
              {
                "FechaActualizacion": "04042006",
                "NombreOtorgante": "BANCO",
                "IndicadorTipoResponsabilidad": "I",
                "TipoCuenta": "R",
                "TipoContrato": "CC",
                "ClaveUnidadMonetaria": "N$",
                "FrecuenciaPagos": "Z",
                "MontoPagar": "0",
                "FechaAperturaCuenta": "21022020",
                "FechaUltimoPago": "30032006",
                "FechaUltimaCompra": "28032006",
                "FechaReporte": "11072023",
                "ModoReportar": "A",
                "UltimaFechaSaldoCero": "30032006",
                "CreditoMaximo": "633",
                "SaldoActual": "0+",
                "LimiteCredito": "4500",
                "SaldoVencido": "0",
                "FormaPagoActual": "01",
                "HistoricoPagos": "110",
                "FechaMasRecienteHistoricoPagos": "28022006",
                "FechaMasAntiguaHistoricoPagos": "28122005"
              },
              {
                "FechaActualizacion": "22042006",
                "NombreOtorgante": "BANCO",
                "IndicadorTipoResponsabilidad": "I",
                "TipoCuenta": "R",
                "TipoContrato": "CC",
                "ClaveUnidadMonetaria": "N$",
                "FrecuenciaPagos": "Z",
                "MontoPagar": "260",
                "FechaAperturaCuenta": "21022020",
                "FechaUltimoPago": "23032006",
                "FechaUltimaCompra": "03112005",
                "FechaReporte": "11072023",
                "ModoReportar": "A",
                "CreditoMaximo": "5689",
                "SaldoActual": "4779+",
                "LimiteCredito": "13000",
                "SaldoVencido": "0",
                "FormaPagoActual": "01",
                "HistoricoPagos": "1111111",
                "FechaMasRecienteHistoricoPagos": "25022006",
                "FechaMasAntiguaHistoricoPagos": "25082005",
                "TotalPagosReportados": "008"
              },
              {
                "FechaActualizacion": "17042006",
                "NombreOtorgante": "TIENDA COMERCIAL",
                "IndicadorTipoResponsabilidad": "I",
                "TipoCuenta": "R",
                "TipoContrato": "CL",
                "ClaveUnidadMonetaria": "N$",
                "FrecuenciaPagos": "Z",
                "FechaAperturaCuenta": "21022020",
                "FechaReporte": "11072023",
                "ModoReportar": "A",
                "UltimaFechaSaldoCero": "12042006",
                "LimiteCredito": "12000",
                "FormaPagoActual": "01",
                "HistoricoPagos": "11111000",
                "FechaMasRecienteHistoricoPagos": "12032006",
                "FechaMasAntiguaHistoricoPagos": "12082005",
                "ClaveObservacion": "IA"
              },
              {
                "FechaActualizacion": "21042006",
                "NombreOtorgante": "BANCO",
                "IndicadorTipoResponsabilidad": "I",
                "TipoCuenta": "R",
                "TipoContrato": "CC",
                "ClaveUnidadMonetaria": "N$",
                "FrecuenciaPagos": "Z",
                "MontoPagar": "0",
                "FechaAperturaCuenta": "21022020",
                "FechaUltimoPago": "23032006",
                "FechaUltimaCompra": "06032006",
                "FechaReporte": "11072023",
                "ModoReportar": "A",
                "UltimaFechaSaldoCero": "17032005",
                "CreditoMaximo": "7818",
                "SaldoActual": "4951+",
                "LimiteCredito": "13000",
                "SaldoVencido": "0",
                "FormaPagoActual": "01",
                "HistoricoPagos": "1111111111111",
                "FechaMasRecienteHistoricoPagos": "28022006",
                "FechaMasAntiguaHistoricoPagos": "28022005",
                "TotalPagosReportados": "013"
              },
              {
                "FechaActualizacion": "12042006",
                "NombreOtorgante": "BANCO",
                "IndicadorTipoResponsabilidad": "I",
                "TipoCuenta": "R",
                "TipoContrato": "CC",
                "ClaveUnidadMonetaria": "N$",
                "FrecuenciaPagos": "Z",
                "MontoPagar": "100",
                "FechaAperturaCuenta": "21022020",
                "FechaUltimoPago": "29032006",
                "FechaReporte": "11072023",
                "ModoReportar": "A",
                "UltimaFechaSaldoCero": "30092005",
                "CreditoMaximo": "2690",
                "SaldoActual": "250+",
                "LimiteCredito": "4800",
                "FormaPagoActual": "01",
                "HistoricoPagos": "111111111111111111111110",
                "FechaMasRecienteHistoricoPagos": "28022006",
                "FechaMasAntiguaHistoricoPagos": "28022004",
                "TotalPagosReportados": "025"
              },
              {
                "FechaActualizacion": "10042006",
                "NombreOtorgante": "TIENDA COMERCIAL",
                "IndicadorTipoResponsabilidad": "I",
                "TipoCuenta": "R",
                "TipoContrato": "CL",
                "ClaveUnidadMonetaria": "N$",
                "FrecuenciaPagos": "Z",
                "MontoPagar": "25",
                "FechaAperturaCuenta": "21022020",
                "FechaUltimoPago": "12032006",
                "FechaUltimaCompra": "04122005",
                "FechaReporte": "11072023",
                "ModoReportar": "A",
                "UltimaFechaSaldoCero": "06052004",
                "CreditoMaximo": "6164",
                "SaldoActual": "773+",
                "LimiteCredito": "3500",
                "FormaPagoActual": "01",
                "HistoricoPagos": "1111111111111X1111111111",
                "FechaMasRecienteHistoricoPagos": "28022006",
                "FechaMasAntiguaHistoricoPagos": "28102003"
              },
              {
                "FechaActualizacion": "22042006",
                "NombreOtorgante": "BANCO",
                "IndicadorTipoResponsabilidad": "I",
                "TipoCuenta": "R",
                "TipoContrato": "CC",
                "ClaveUnidadMonetaria": "N$",
                "FrecuenciaPagos": "Z",
                "MontoPagar": "0",
                "FechaAperturaCuenta": "21022020",
                "FechaUltimoPago": "16012006",
                "FechaUltimaCompra": "22062005",
                "FechaReporte": "11072023",
                "ModoReportar": "A",
                "UltimaFechaSaldoCero": "16012006",
                "CreditoMaximo": "2162",
                "SaldoActual": "0+",
                "LimiteCredito": "2000",
                "SaldoVencido": "0",
                "FormaPagoActual": "01",
                "HistoricoPagos": "111111111111111111111111",
                "FechaMasRecienteHistoricoPagos": "27022006",
                "FechaMasAntiguaHistoricoPagos": "27112002",
                "TotalPagosReportados": "039",
                "TotalPagosCalificadosMOP2": "01"
              }
            ]
          },
          "ConsultasEfectuadas": {
            "ConsultaEfectuada": [
              {
                "FechaConsulta": "19122023",
                "ClaveOtorgante": "**********",
                "NombreOtorgante": "IPC",
                "TipoContrato": "CC",
                "ImporteContrato": "0",
                "IndicadorTipoResponsabilidad": "I"
              },
              {
                "FechaConsulta": "22052023",
                "NombreOtorgante": "BANCO",
                "TipoContrato": "CC",
                "ImporteContrato": "0",
                "IndicadorTipoResponsabilidad": "I"
              },
              {
                "FechaConsulta": "22052023",
                "NombreOtorgante": "BANCO",
                "TipoContrato": "CC",
                "ImporteContrato": "0",
                "IndicadorTipoResponsabilidad": "I"
              },
              {
                "FechaConsulta": "22052023",
                "NombreOtorgante": "BANCO",
                "TipoContrato": "CC",
                "ImporteContrato": "0",
                "IndicadorTipoResponsabilidad": "I"
              }
            ]
          },
          "ResumenReporte": {
            "ResumenReporte": [
              {
                "FechaIngresoBD": "21112018",
                "NumeroMOP7": "00",
                "NumeroMOP6": "00",
                "NumeroMOP5": "00",
                "NumeroMOP4": "00",
                "NumeroMOP3": "00",
                "NumeroMOP2": "00",
                "NumeroMOP1": "07",
                "NumeroMOP0": "00",
                "NumeroMOPUR": "00",
                "NumeroCuentas": "0007",
                "CuentasPagosFijosHipotecas": "0000",
                "CuentasRevolventesAbiertas": "0007",
                "CuentasCerradas": "0000",
                "CuentasNegativasActuales": "0000",
                "CuentasClavesHistoriaNegativa": "0000",
                "CuentasDisputa": "00",
                "NumeroSolicitudesUltimos6Meses": "00",
                "NuevaDireccionReportadaUltimos60Dias": "N",
                "MensajesAlerta": "NNNNN",
                "ExistenciaDeclaracionesConsumidor": "N",
                "TipoMoneda": "MX",
                "TotalCreditosMaximosRevolventes": "25156",
                "TotalLimitesCreditoRevolventes": "52800",
                "TotalSaldosActualesRevolventes": "10753+",
                "TotalSaldosVencidosRevolventes": "0",
                "TotalPagosRevolventes": "385",
                "PctLimiteCreditoUtilizadoRevolventes": "20",
                "TotalCreditosMaximosPagosFijos": "0",
                "TotalSaldosActualesPagosFijos": "0+",
                "TotalSaldosVencidosPagosFijos": "0",
                "TotalPagosPagosFijos": "0",
                "NumeroMOP96": "00",
                "NumeroMOP97": "00",
                "NumeroMOP99": "00",
                "FechaAperturaCuentaMasAntigua": "21022020",
                "FechaAperturaCuentaMasReciente": "21022020",
                "TotalSolicitudesReporte": "03",
                "FechaSolicitudReporteMasReciente": "22052023",
                "NumeroTotalCuentasDespachoCobranza": "00",
                "FechaAperturaCuentaMasRecienteDespachoCobranza": "00000000",
                "NumeroTotalSolicitudesDespachosCobranza": "00",
                "FechaSolicitudMasRecienteDespachoCobranza": "00000000"
              }
            ]
          },
          "HawkAlertConsulta": {
            "HawkAlertC": [
              {
                "FechaReporte": "19122023",
                "CodigoClave": "001",
                "TipoInstitucion": "BURO DE CREDITO",
                "Mensaje": "VER MENSAJES DE COINCIDENCIA POR REP. DE CREDITO"
              }
            ]
          },
          "HawkAlertBD": {
            "HawkAlertBD": [
              {
                "FechaReporte": "03062021",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "03062021",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "05012015",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "13032014",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "07062021",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "02022021",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "03062021",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "01012016",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "03062021",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "01012017",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "11122017",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "02012017",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "04012018",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "05012017",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "09062021",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "15032017",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "09062021",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "04062021",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "15092016",
                "CodigoClave": "981",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "04062021",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "30112017",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "08032022",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              },
              {
                "FechaReporte": "29062022",
                "CodigoClave": "980",
                "TipoInstitucion": "PREVENCIONES PM",
                "Mensaje": "DOMICILIO 1 - COINCIDENCIA DOMICILIO"
              }
            ]
          },
          "DeclaracionesCliente": null,
          "ScoreBuroCredito": {
            "ScoreBC": [
              {
                "nombreScore": "BC SCORE",
                "CodigoScore": "007",
                "ValorScore": "0721",
                "CodigoRazon": [
                  "54"
                ]
              }
            ]
          }
        }
      ]
    }
  }
}
```

The most relevant information in the response can be found in the
following fields: `Cuentas`, `ResumenReporte`, `HawkAlertConsulta`,
`HawkAlertBD` and `ScoreBuroCredito`.

If you want to know how to interpret the data, you can refer to these [guides](https://guides.moffin.mx/bur-de-crdito)
