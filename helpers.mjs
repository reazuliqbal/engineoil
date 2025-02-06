import { createError, readBody, sendError } from 'h3';
import { ofetch } from 'ofetch';
import { LOG, RESTRICTED_OPS, UPSTREAM } from './config.mjs';

export const isValidQuery = (query) => {
  const keys = Object.keys(query);

  if (keys.length <= 0) {
    return true;
  }

  return keys.some(k => !RESTRICTED_OPS.includes(k));
};

export const makeRequest = async (method, endpoint = 'contracts', data) => {
  return ofetch(endpoint, {
    method,
    body: data,
    baseURL: UPSTREAM,
  }).catch(error => console.error(new Date().toISOString(), error));
};

export const isValidBody = async (event) => {
  const body = await readBody(event);

  if (typeof body !== 'object') {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Bad Request' }),
    );
  }

  if (Array.isArray(body)) {
    for (const request of body) {
      if (
        request.params
        && request.params.query
        && !isValidQuery(request.params.query)
      ) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: `You shouldn't use ${RESTRICTED_OPS.join(
              ', ',
            )} in queries.`,
          }),
        );
      }
    }
  } else if (
    body.params
    && body.params.query
    && !isValidQuery(body.params.query)
  ) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: `You shouldn't use ${RESTRICTED_OPS.join(
          ', ',
        )} in queries.`,
      }),
    );
  }

  return body;
};

export const logRequest = (event, body) => {
  if (LOG) {
    const { req } = event.node;

    console.log(
      new Date().toISOString(),
      req.headers['cf-connecting-ip']
      || req.headers['x-forwarded-for']
      || req.socket.remoteAddress,
      event.method,
      event.path,
      JSON.stringify(body),
    );
  }
};
