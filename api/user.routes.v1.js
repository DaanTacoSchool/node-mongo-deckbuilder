var express = require('express');
var routes = express.Router();


var neo4j = require('neo4j-driver').v1;
//var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic("neo4j","neo4j"));
var driver = neo4j.driver('bolt://hobby-fgnnmjnckhclgbkeioopeial.dbs.graphenedb.com:24786',neo4j.auth.basic("heroku-user","b.xRXKM5qHdFN7.MZiHqh0HQmrORtWI"));
var session = driver.session();
var User = require('../model/user.model');

routes.get('/users', function (req,res){
    console.log('test');
    res.contentType('application/json');
    session.run("MATCH (n:User) RETURN n")
        .then(function(result){
            res.status(200).json(result.records);
            // result.records.forEach(function (record)
            // { console.log(record._fields[0]); });
        })
        .catch(function(error) {console.log(error);});
});

routes.get('/users/:id', function (req,res){
    console.log('test');
    res.contentType('application/json');
    session.run("MATCH (n:User) WHERE n.id = '"+req.params.id +"' RETURN n LIMIT 1")
        .then(function(result){
            res.status(200).json(result.records);
            // result.records.forEach(function (record)
            // { console.log(record._fields[0]); });
        })
        .catch(function(error) {console.log(error);});
});

routes.get('/users/search/:search', function (req,res){
    console.log('search');
    res.contentType('application/json');
    session.run("MATCH (n:User) WHERE n.id = "+req.params.search +" OR n.name = '"+req.params.search+"' RETURN n")
        .then(function(result){
            res.status(200).json(result.records);
            // result.records.forEach(function (record)
            // { console.log(record._fields[0]); });
        })
        .catch(function(error) {console.log(error);});
});


module.exports = routes;
