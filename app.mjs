import { createServer } from 'node:http';
import {
  appendCorsPreflightHeaders,
  createApp,
  createRouter,
  eventHandler,
  readBody,
  sendNoContent,
  toNodeListener,
} from 'h3';
import { CACHE_KEY, PORT } from './config.mjs';
import { isValidBody, logRequest, makeRequest } from './helpers.mjs';
import redisClient from './libs/redis.mjs';

const app = createApp();

app.use(
  eventHandler(event =>
    appendCorsPreflightHeaders(event, {
      origin: '*',
      methods: '*',
      preflight: { statusCode: 204 },
    }),
  ),
);

app.use(
  eventHandler((event) => {
    if (event.method === 'OPTIONS') {
      return sendNoContent(event);
    }
  }),
);

const router = createRouter();

router.get(
  '/',
  eventHandler((event, body) => {
    logRequest(event, body);

    return makeRequest('GET', '/');
  }),
);

router.post(
  '/',
  eventHandler(async (event) => {
    const body = await isValidBody(event);

    logRequest(event, body);

    return makeRequest('POST', '/', body);
  }),
);

router.post(
  '/blockchain',
  eventHandler(async (event) => {
    const body = await readBody(event);

    logRequest(event, body);

    if (
      body.method === 'getBlockInfo'
      && body.params.blockNumber
      && !Number.isNaN(body.params.blockNumber)
    ) {
      const block = await redisClient.get(
        `${CACHE_KEY}-${body.params.blockNumber}`,
      );

      if (block) {
        return {
          jsonrpc: body.jsonrpc,
          id: body.id,
          fromCache: true,
          result: JSON.parse(block),
        };
      }

      const newData = await makeRequest('POST', 'blockchain', body);

      if (newData && newData.result) {
        await redisClient.set(
          `${CACHE_KEY}-${body.params.blockNumber}`,
          JSON.stringify(newData.result),
          {
            EX: 60,
            NX: true,
          },
        );
      }

      return newData;
    }

    return makeRequest('POST', 'blockchain', body);
  }),
);

router.post(
  '/contracts',
  eventHandler(async (event) => {
    const body = await isValidBody(event);

    logRequest(event, body);

    return makeRequest('POST', 'contracts', body);
  }),
);

app.use(router);

const server = createServer(toNodeListener(app));

server.listen({ port: PORT }, () => {
  console.log(`HE cache server is running on ${PORT}`);
});
