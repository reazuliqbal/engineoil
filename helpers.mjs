import { createError } from 'h3';
import { ofetch } from 'ofetch';
import { LOG, RESTRICTED_OPS, UPSTREAM } from './config.mjs';

export const isValidQuery = (query) => {
  const keys = Object.keys(query);

  if (keys.length <= 0) {
    return true;
  }

  if (keys.includes('$and') && (!Array.isArray(query.$and) || query.$and.length <= 0)) {
    return false;
  }

  if (keys.includes('$or') && (!Array.isArray(query.$or) || query.$or.length <= 0)) {
    return false;
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

export const validatedBody = async (body) => {
  if (typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  if (Array.isArray(body)) {
    for (const request of body) {
      if (
        request.params
        && request.params.query
        && !isValidQuery(request.params.query)
      ) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid or unsupported query',
        });
      }
    }
  } else if (
    body.params
    && body.params.query
    && !isValidQuery(body.params.query)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid or unsupported query`,
    });
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
      body ? JSON.stringify(body) : '',
    );
  }
};
