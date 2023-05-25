import 'dotenv/config.js';
import process from 'node:process';

export const PORT = process.env.PORT || 5050;
export const UPSTREAM = process.env.UPSTREAM || 'http://localhost:5000';
export const CACHE_KEY = 'he-rpc';
export const REDIS_URL = process.env.REDIS_URL;
export const RESTRICTED_OPS = ['$where'];
