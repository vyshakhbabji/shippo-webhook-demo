//create a webhook url with ngrok
require('dotenv').config();
const ngrok = require('ngrok');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const BASE_URL = process.env.BASE_URL;
let webhookUrl = '';

/*
 * Init ngrok and get the webhook url
 */

async function init(options) {
    console.log('Starting ngrok . Please wait ...');
    const url = await ngrok.connect(process.env.PORT);
    webhookUrl = url + '/webhook';
    console.log('Webhook url is ready to use. Your webhook url is : ', webhookUrl);
    console.log('\n\n\nTo configure the webhook settings  on Shippo WebApp follow the instructions: \n' +
        ' 1. Click on https://apps.goshippo.com/settings/api\n' +
        ' 2. Go to Webhooks configuration setting \n' +
        ' 3. Click on Add Webhook\n' +
        ' 4. Event Type: All Events (you can choose events you want to listen to as well) \n' +
        ' 5. Mode: Live / Test \n' +
        ' 6. URL: Add the webhook url - '+ webhookUrl +'\n' +
        ' 7. Hit Save\n' +
        '\n' +
        ' Now you should be able to recieve all the notification events to your locally setup webhook url\n' +
        ' You can also inspect webhook events via ngrok WebInterface inspector on url : http://localhost:4040\n' +
        ' ');
    console.log('\n\n\nStarting express server....');
}

/*
Start the express server
 */

function startNodeServer() {
    const app = express();
    const port = process.env.PORT;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.post('/webhook', (req, res) => {

        console.log('\n\nWebhook event received =========================>');
        let responseBody = req.body;
        // console.log('Webhook Raw Event ',responseBody);
        switch (responseBody.event) {
            case 'transaction_created':
                console.log('Transaction ID: ', responseBody.data.object_id);
                console.log('Tracking Status: ', responseBody.data.tracking_status)
                console.log('Tracking URL Provider: ', responseBody.data.tracking_url_provider)
                console.log('ETA: ', responseBody.data.eta);
                break;
            case 'transaction_updated':
                //write your code here
                break;
            case 'track_updated':
                //write your code here
                break;
            case 'batch_purchased':
                //write your code here
                break;
            case 'batch_created':
                //write your code here
                break;

            default:
                console.log('Default Respomse body', responseBody);

        }
        // console.log(req.body);
        console.log('Webhook event  =========================>\n\n');
        res.send('OK');
    });

    app.listen(port, () => {
        console.log(`App is listening at http://localhost:${port}`);
    });
}

/**
 * Quick function to make POST request to Shippo API
 */
function makeShippoPostRequest(endpoint, data) {
    const url = BASE_URL + endpoint;
    const options = {
        url: url,
        headers: {
            'Authorization': process.env.TOKEN,
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request.post(options, function (error, response, body) {

        if (!error) {
            console.log('Successful Response Body for API Call :'+options.url +' is :', body);
        } else {
            console.log('Error Response Code is : ',response.statusCode);
            console.log('Error: ', error);
        }
    });
}

/*
Here you are creating a Webhook
https://goshippo.com/docs/reference#tracks-create
POST /webhooks HTTP/1.1
Host: api.goshippo.com
Authorization: ShippoToken SHIPPOTOKEN
Content-Type: application/json
{
  "url": "http://www.example.com",
  "event": "track_updated"
}
 */
function createWebhook() {
    console.log('\n\n\nCreating webhook for Shippo API');
    const webhookBody = {
        "url": webhookUrl,
        "event": "transaction_created",//,transaction_updated,track_updated,batch_created,batch_updated",
        'is_test': false
    };
    makeShippoPostRequest('/webhooks', webhookBody);
}

/*
Here you are creating a Shipping label
https://goshippo.com/docs/reference#transactions-create

POST /transactions HTTP/1.1
Host: api.goshippo.com
Authorization: ShippoToken SHIPPOTOKEN
Content-Type: application/json
{
  "rate": "d9629f248ea24bc786ed921fff0c55ff",
  "async": false,
  "label_file_type": "PDF"
}
 */
function createTransaction(){
    console.log('\n\n\nCreating transaction for Shippo API');
    const transactionObject = {
        "rate": "d9629f248ea24bc786ed921fff0c55ff",
        "async": false,
        "label_file_type": "PDF"
    };
    makeShippoPostRequest('/transactions', transactionObject);
}

async function start() {
    await init();
    startNodeServer();
    console.log('Your webhookURL is: ', webhookUrl);

    //create webhook via SHIPPO API
    createWebhook();

    //create transaction via SHIPPO API
    createTransaction();

}

start().then(r => {
    console.log('Started Server.... ');
});