# Pigeon
A Node.js cron job application that texts a number with Twilio whenever state or federal incentives become available.

### How to run?

- Register for your API key from The National Renewable Energy Laboratory [here](https://developer.nrel.gov/signup/) & set environment variable:
    * NREL_API_KEY

- Customize the states/jurisdictions you're interested in (comma separated, no spaces): 
    * NREL_JURISDICTION=US,CA,TX

- Customize whether to search recent or past incentives:
    * NREL_FIND_RECENT=true

- Fill out the Twilio account SID, auth token, and your messaging service SID environment variables
    * TWILIO_TO_PHONE_NUMBER=
    * TWILIO_ACCOUNT_SID=
    * TWILIO_ACCOUNT_AUTH_TOKEN=
    * TWILIO_MESSAGING_SERVICE_SID=

- Customize how often the application attemps to notify you with the CRON environment variables.
    * CRON_SECOND=*
    * CRON_MINUTE=*
    * CRON_HOUR=12
    * CRON_DAY_OF_MONTH=*
    * CRON_MONTH=*
    * CRON_DAY_OF_WEEK=*

- Customize whether the texts use state codes or the actual state names:
    * TEXT_STATE_CODES=true

- Run the application
    ```sh
    $ npm start
    ```

