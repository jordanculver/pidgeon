const axios = require("axios").default;
require('dotenv').config();
const fs = require('fs');
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_S_ID,
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

const STATE_CODES = JSON.parse(fs.readFileSync('states.json', { encoding: 'utf-8' }));

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
            recent: 'false'
        }
    }).then(function (response) {
        if (response.data.result.length === 0) return console.log('No incentives found');
        console.log('Incentive(s) found!');
        const states = response.data.result
            .map(result => result.state)
            .reduce((uniqueStates, stateCode) => {
                if (uniqueStates.indexOf(stateCode) === -1) {
                    uniqueStates.push(stateCode);
                }
                return uniqueStates;
            }, [])
            .map(stateCode => process.env.TEXT_STATE_CODES === 'true' ? stateCode : STATE_CODES[stateCode]);
        const incentives = `incentive${states.length > 1 ? 's' : ''}`;
        const lastState = states[states.length - 1];
        const prettyStates = states
            .join(', ')
            .replace(`, ${lastState}`, `, and ${lastState}`);
        client.messages
            .create({
                to: process.env.TWILIO_TO_PHONE_NUMBER,
                messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
                body: `${states.length} ${incentives} found for ${prettyStates}`
            })
            .then(message => console.log(message.sid))
            .done();
    }).catch(function (error) {
        console.error(error);
    });
});