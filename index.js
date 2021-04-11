var axios = require("axios").default;
require('dotenv').config();

var options = {
  method: 'GET',
  url: 'https://developer.nrel.gov/api/transportation-incentives-laws/v1.json',
  params: {
    api_key: process.env.NREL_API_KEY,
    limit: '50',
    jurisdiction: process.env.NREL_JURISDICTION,
    incentive_type: 'GNT,TAX,LOANS,RBATE,EXEM',
    user_type: 'IND',
    poc: 'true',
    recent: 'true'
  }
};

axios.request(options).then(function (response) {
  console.log(response.data.result);
}).catch(function (error) {
  console.error(error);
});