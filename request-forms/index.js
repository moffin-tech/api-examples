const Axios = require('axios')
const prompt = require('prompt-sync')()
require('dotenv').config()

const YOUR_PHONE = "" // Replace your phone here
const client = Axios.create({
    baseURL: 'https://sandbox.moffin.mx/api/v1',
    headers: {
        // You can create this token in https://sandbox.moffin.mx/configuracion/api
        'Authorization': 'Token ' + process.env.API_TOKEN
    }
})

async function start() {
    if (!YOUR_PHONE) {
        throw new Error("You must set YOUR_PHONE in index.js to run these examples")
    }
    // Form Configs
    const {data: formConfigs} = await client.get('/formconfigs')
    console.log('These are the Form Config associated with your account for each Form Template')
    console.table(formConfigs.results)

    // Create a new Form Config for this example
    const { data: formConfig } = await client.post('/formconfigs', {
      name: 'Form Name',
      slug: 'form-name', // separated by hyphens
      accountType: 'PF',
      serviceQueries: {
          bureauPF: true
      },
      configuration: {
          isActive: true,
          rfc: {
            homoclave: {
                enabled: true
            }
        }
      }
    })

    const formConfigId = formConfig.id

    const {data: form} = await client.post(`/form/${formConfigId}`, {
        accountType: 'PF',
        loanAmount: '10000',
        email: 'test-dev@moffin.mx',
        firstName: 'Prueba',
        phone: '+52' + YOUR_PHONE, // Phone number to use
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

    // Update the Form
    await client.patch(`/form/${form.formId}`, {
        firstLastName: 'Apellido'
    })

    // Send SMS
    const {data: smsData} = await client.post(`/form/nip/send-sms/${form.formId}`, {
        organizationName: 'Moffin' // Name to display in the SMS message
    })
    console.log('SMS Response Body', smsData)

    // Send Email (similar to previous endpoint)
    const {data: emailData} = await client.post(`/form/nip/send-email/${form.formId}`, {
        organizationName: 'Moffin' // Name to display in the Email
    })
    console.log('Email Response Body', emailData)

    // Validate NIP (sent by either send-sms or send-email)
    const code = prompt('Enter the received NIP: ')
    await client.post(`/form/nip/validate/${form.formId}`, {
        nip: code // The NIP received by the user
    })

    // Submit the form
    await client.post(`/form/submit/${form.formId}`, {
        validateNIPAuthentication: true // Ensure the NIP was validated
    })
}

console.log('Executing request.')
start()
    .then(() => console.log('Request executed succesfully.'))
    .catch(console.error)
