var express = require('express');
var Web3 = require('web3');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

console.log("Getting eth accounts...");
web3.eth.getAccounts(function(err, accounts){
  console.log(accounts);
});

// Setup contract instance
var contractArtifact = require('../../survey-contract/build/contracts/Survey.json');
var contractInstance = new web3.eth.Contract(contractArtifact.abi, '0x1fC7F28CA040B78ae9c2ef2aA6fD7Fc3382943F9');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/updateSurveyContract', function(req, res, next){
  console.log(req.body);

  contractInstance.methods.getSurveyCount(function(req,res){
    console.log("res");
    console.log(res);
  });
  res.sendStatus(200);

});

router.post('/addEntry', function(req, res, next){

  console.log("Add entry",req.body);

  var entry = req.body;

  MongoClient.connect(url, function(err, db) {

    var dbo = db.db("survey");

    dbo.collection("entries").insertOne(entry, function(err, res) {
      if (err) {
        res.sendStatus(500);
        throw err;
      }
      db.close();
    });

  });

  res.sendStatus(200);

});

router.post('/registerUser', function(req, res, next){

  console.log("Register User",req.body);

  var entry = req.body;

  MongoClient.connect(url, function(err, db) {

    var dbo = db.db("survey");

    dbo.collection("users").insertOne(entry, function(err, res) {
      if (err) {
        res.sendStatus(500);
        throw err;
      }
      db.close();
    });

  });

  res.sendStatus(200);

});

router.post('/login', function(req, res, next){

  var personNumber = req.body.personNumber;

  MongoClient.connect(url, function(err, db) {

    var dbo = db.db("survey");

    dbo.collection("users").find({'person_number': personNumber}, function(err, res) {
      if (err) {
        res.sendStatus(500);
        throw err;
      }
      console.log(res);
      db.close();
    });

  });

  res.sendStatus(200);

})

module.exports = router;
