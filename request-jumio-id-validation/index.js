const Axios = require("axios");
require("dotenv").config();

const client = Axios.create({
  baseURL: "https://moffin.mx/api/v1",
  headers: {
    // You can create this token in https://moffin.mx/configuracion/api
    Authorization: "Token " + process.env.API_TOKEN,
  },
});

async function start() {
  const { data: createValidationLink } = await client.post(
    "query/id_validation/jumio",
    {
      successURL: "https://moffin.mx",
      failURL: "https://moffin.mx",
    }
  );
  const validationLink = createValidationLink.response.formURL;
  return validationLink;
}

console.log("Executing request.");
start()
  .then((response) =>
    console.log(`Request executed succesfully. Link: ${response}`)
  )
  .catch(console.error);
