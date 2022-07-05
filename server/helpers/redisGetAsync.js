const util = require('util')
const promisify = util.promisify;


const redisGetAsync = (client) => promisify(client.get).bind(client)

module.exports = { redisGetAsync }