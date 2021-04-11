const axios = require("axios").default;
require('dotenv').config();
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_ACCOUNT_AUTH_TOKEN
);
const cron = require('node-cron');
const cronConfig = [
    process.env.CRON_SECOND,
    process.env.CRON_MINUTE,
    process.env.CRON_HOUR,
    process.env.CRON_DAY_OF_MONTH,
    process.env.CRON_MONTH,
    process.env.CRON_DAY_OF_WEEK
].join(' ');

cron.schedule(cronConfig, () => {
    console.log('Searching for incentives');
    axios.request({
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
    }).then(function (response) {
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
});