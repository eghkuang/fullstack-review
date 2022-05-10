const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher',{ useNewUrlParser: true } ).then(()=>{
  console.log('Database Connected');
}).catch(()=>{
  console.log('Failed to connect the database');
});

let repoSchema = mongoose.Schema({
  // TODO: your schema here!
  name: String,
  owner: { type: String, unique: true },
  starred: String,
  url: { type: String, unique: true },
  forks: String
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (repo) => {
  // TODO: Your code here
  // This function should save a repo or repos to
  // the MongoDB
  let newRepo = new Repo({
    name: repo.name,
    owner: repo.owner.login,
    starred: repo.owner.starred_url,
    url: repo.html_url,
    forks: repo.forks_Count
  })
  .save()
  .then((repo) => {
    console.log('repo', repo)
  })
  .catch((err) => {
    throw(err);
  })
};


//save() is used to save the document to the database. Using this function, new documents can be added to the database

module.exports.save = save;