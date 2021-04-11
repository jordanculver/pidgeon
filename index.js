var axios = require("axios").default;
require('dotenv').config();
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_ACCOUNT_AUTH_TOKEN
);

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
    if (response.data.result.length === 0) return;
    const firstResult = response.data.result[0];
    client.messages
        .create({
            to: process.env.TWILIO_TO_PHONE_NUMBER,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            body: `Incentive found for ${firstResult.state}: ${firstResult.plaintext}`
        })
        .then(message => console.log(message.sid))
        .done();
}).catch(function (error) {
    console.error(error);
});