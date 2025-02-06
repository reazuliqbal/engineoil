import { createClient } from 'redis';
import { REDIS_URL } from '../config.mjs';

const connectionOption = REDIS_URL ? { url: REDIS_URL } : {};

const redisClient = createClient(connectionOption);

await redisClient.connect();

redisClient.on('error', error => console.error(error.message));

export default redisClient;
