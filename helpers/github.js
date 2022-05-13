const axios = require('axios');
// const config = require('../config.js');

const config = process.env.GIT_TOKEN || require('../config.js').TOKEN;

let getReposByUsername = ( {username}, callback ) => {
  // TODO - Use the axios module to request repos for a specific
  // user from the github API

  // The options object has been provided to help you out,
  // but you'll have to fill in the URL
  let options = {
    url: `https://api.github.com/users/${username}/repos` ,
    headers: {
      'User-Agent': 'request',
      // 'Authorization': `token ${config.TOKEN}`
      'Authorization': `token ${config}`
    }
  };

  //--------sol instead of axios--------
  // request(options, function(err, response, body) {
  //   body = JSON.parse(body)
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     callback(body);
  //   }
  // })
  //--------sol--------

  axios.get(options.url, options.headers)
    .then(res => callback(res.data))
    .catch(err => console.log(err));

}

module.exports.getReposByUsername = getReposByUsername;