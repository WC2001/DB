const { redisGetAsync } = require('./redisGetAsync');

const saveMessage = async (client, message) => {
    const { key } = message;
  
    const data = await redisGetAsync(key);
  
    // the first message in the chat room
    if (!data) {
      return client.set(key, "[]");
    }
  
    const json = JSON.parse(data);
    json.push(message);
  
    client.set(key, JSON.stringify(json));
  };

  module.exports = { saveMessage }