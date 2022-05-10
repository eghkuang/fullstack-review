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
  // and get the repo information from the github API, then
  helpersGithub.getReposByUsername(username, (data) => {
    console.log("DATA", data);
    data.forEach((eachRepo) => {
      // save each repo information in the database
      db.save(eachRepo, (err, result) => {
        if(err) {
          result.sendStatus();
        } else {
          result.sendStatus().json(result);
        }
      })
    });
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
      throw(err);
    } else {
      // console.log('repos', repos.sort({'starred': -1}).limit(25));
      var result = repos.sort((a, b) => a.starred - b.starred).slice(0, 25);
      res.json(result).catch(err => {
        throw(err);
      })
    }
  })
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

