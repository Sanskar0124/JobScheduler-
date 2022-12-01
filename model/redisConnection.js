const redis = require('redis');

const redisClient = redis.createClient()
// Redis Connection
redisClient.connect()
redisClient.on("connect", function (err) {
    console.log("Connected Redis");
})

module.exports = redisClient
