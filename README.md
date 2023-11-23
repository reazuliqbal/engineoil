# Engine Oil

Hive-Engine RPC caching layer code in Node JS. It sits on top of your Hive-Engine JSON RPC server, can filter and cache specific requests.

# How To Install

- You need to have a Redis instance running (https://redis.io/docs/getting-started/installation/)
- Clone this repository and CD into the folder on the same server of your witness node
- Install dependencies - `npm ci`
- Start the server `node app.mjs` or using PM2 - `pm2 start app.mjs --name engineoil`

By default it runs on port 5050 and fetches data from http://localhost:5000. You should change these using the .env file or setting environment variables in other means.

```
TZ=UTC
PORT=5050
UPSTREAM=http://localhost:5000
REDIS_URL=
```

Leave the `REDIS_URL` empty to use your local instance on localhost:6379

# How to Setup

- When EngineOil is running go to https://tribaldex.com/witnesses login from your witness account
- Click `Manage Witness` and change your RPC Port number to the EngineOil port and update.
- Do not ever use the `witness_action.js` to update your witness settings.

**This software is in active development, please use at your own risk. I should not be held responsible for anything.**
