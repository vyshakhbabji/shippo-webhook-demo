# Shippo Webhooks Basic Sample App

This application is built to help provide developers with a clear understanding of how to utilize Shippo 
Webhook Subscriptions.

In this app we are 
    1. Creating a ngrok tunnel and return webhook url
    2. Creating a Shippo Webhook Subscription to webhooks url
    3. Creating a transaction using Shippo's Create Transaction API call 
    4. Listening to Webhook events
    

## Prerequisites
* NPM installed locally
* Node.js installed locally
* ngrok or a web server which supports SSL/TLS v1.1 / v1.2

## Installation 
* Clone the repository `git clone [this repository]`
* Install the dependency 

```text
cd [this repository]
npm install
```
 

## Running the app 

Copy the sample.env to .env and fill in the values for the following variables:
```text
PORT=8080
TOKEN=[REPLACE WITH TOKEN]
BASE_URL=https://api.goshippo.com/
```
```
cp sample.env .env
node index.js
```

## Configuring Webhook URL on Shippo API setting
When you run the app you will see instructions on the terminal/console as below. Please follow the instructions 
as mentioned:

```javascript
Starting ngrok . Please wait ...
Webhook url is ready to use. Your webhook url is :  https://afb9-2600-1700-dd90-14f0-e4f1-11d2-5a73-6ade.ngrok.io/webhook

    To configure the webhook settings  on Shippo WebApp follow the instructions:
    1. Click on https://apps.goshippo.com/settings/api
    2. Go to Webhooks configuration setting
    3. Click on Add Webhook
    4. Event Type: All Events (you can choose events you want to listen to as well)
    5. Mode: Live / Test
    6. URL: Add the webhook url - https://XXXXXX.ngrok.io/webhook
    7. Hit Save

Now you should be able to recieve all the notification events to your locally setup webhook url
You can also inspect webhook events via ngrok WebInterface inspector on url : http://localhost:4040
```
## Testing 

As you have now subscribed to `All Events` ,  you should be able to see incoming notifications by just 
running a sample transaction.

```javascript

Eg: Here I am creating a transaction 

```curl
curl --location --request POST 'https://api.goshippo.com/transactions' \
--header 'Authorization: ShippoToken [SHIPPO TOKEN (live or test)]' \
--header 'Content-Type: application/json' \
--data-raw '{
  "rate": "XXXX",
  "async": false,
  "label_file_type": "PDF"
}'
```

You can replace the transaction object  with your own transaction object in `index.js` file.

```javascript
function createTransaction(){
    console.log('\n\n\nCreating transaction for Shippo API');
    const transactionObject = {
        "rate": "xxxxx",
        "async": false,
        "label_file_type": "PDF"
    };
    makeShippoPostRequest('/transactions', transactionObject);
}

````

If this endpoint return `HTTP 201 Created` response ,  you will see a notification on your console/terminal like this:

```text
Webhook event received =========================>
Transaction ID:  95a5936ebc0b4432ba04b2758d681b16
Tracking Status:  UNKNOWN
Tracking URL Provider:  https://tools.usps.com/go/TrackConfirmAction_input?origTrackNum=9201990182632251604002
ETA:  null
Webhook event  =========================>

```
***


# Issues and Improvements 

* If you want me to improve this demo or if you find any issues , please open issue on the issue section
* I am open to improving and keeping this demo up to date to best of my knowledge
* This code is for demo purposes only. DONOT use this in production apps
* Feel free to send PRs if you want to make any changes to this repo. 

***
# About ngrok

## _What is ngrok?_

The **_official_ description**
on the website https://ngrok.com/product is:

> "_**`ngrok`** exposes **`local`** servers behind NATs and firewalls
to the **`public`** internet over secure tunnels_."

In _**plain** (beginner friendly) **English**_:

> _**`ngrok`** is a small piece of software
that lets you **run** a **web application** <br />
on your **`local` computer**
and (securely) **share it** with the world
on a **`public` address** ("URL")_.

## How it works?

```npm install``` downloads the ngrok binary for your platform from the official ngrok hosting. To host binaries yourself set the `NGROK_CDN_URL` environment variable before installing ngrok. To force specific platform set `NGROK_ARCH`, eg `NGROK_ARCH=freebsdia32`.

The first time you create a tunnel the ngrok process is spawned and runs until you disconnect or when the parent process is killed. All further tunnels are connected or disconnected through the internal ngrok API which usually runs on http://127.0.0.1:4040.


## ngrok installation

#### Via homebrew formula

```bash
brew install --cask ngrok
```

#### Via npm
Install the package with npm:

```bash
npm install ngrok -g
```

For global installation on Linux, you might need to run `sudo npm install --unsafe-perm -g ngrok` due to the [nature](https://github.com/bubenshchykov/ngrok/issues/115#issuecomment-380927124) of npm postinstall script.

### Running ngrok locally 
```bash
ngrok http [port] 
eg. ngrok http 8080
```



## To know more about ngrok
[**How it works?**](https://ngrok.com/product)

[**Learn more**](https://github.com/dwyl/learn-ngrok)


## _Why use ngrok?_

You are working on a Web App/Site on your **`localhost`**,
but it's "not yet ready" to be "deployed"

> _**Note**: once you are **ready**
to make your App/MVP "**official**",
you should consider using **Heroku**
as it does not require you to have your `localhost` running_
(_and it has good logging, "monitoring", "free tier", etc._). <br />
See:
[github.com/dwyl/**learn-heroku**](https://github.com/dwyl/learn-heroku)


