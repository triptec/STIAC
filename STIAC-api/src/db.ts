const redis = require("redis");
const redisClient = redis.createClient();
redisClient.on("error", function (error) {
    console.error(error);
});
const { promisify } = require("util");

const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const saddAsync = promisify(redisClient.sadd).bind(redisClient);
const smembersAsync = promisify(redisClient.smembers).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

export {redisClient, hsetAsync, hgetallAsync, saddAsync, smembersAsync, getAsync, setAsync};