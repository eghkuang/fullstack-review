const express = require('express');
let app = express();
let helpersGithub = require('../helpers/github.js')
var db = require('../database');

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  let username = req.body;
  const options = {upsert: true};
  // and get the repo information from the github API, then
  helpersGithub.getReposByUsername(username, (data) => {
    const promises = data.map((eachRepo) => {
      // save each repo information in the database
      const repo = {
        name: eachRepo.name,
        owner: eachRepo.owner.login,
        starred: eachRepo.stargazers_count,
        url: eachRepo.html_url,
        forks: eachRepo.forks_count
      }
      console.log('each repo:', repo);
      return db.Repo.findOneAndUpdate({url: repo.url}, repo, options).exec();
    });
    Promise.all(promises)
      .then(results => {
        res.status(200).json(results);
      })
      .catch(err => {
        console.log(err);
        res.status(404).send(err);
      })
  })
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos

  // console.log('req??', req.body)
  // let result = db.Repo.find().sort({'starred':-1}).limit(25);

  //pull Repo data thats saved in database
  db.Repo.find((err, repos) => {
    if (err) {
      console.log(err);
    } else {
      // console.log('repos', repos.sort({'starred': -1}).limit(25));
      var result = repos.sort((a, b) => a.starred - b.starred).slice(0, 25);
      res.json(result).catch(err => {
        console.log(err);
      })
    }
  })
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

