var express = require('express');
var routes = express.Router();


var neo4j = require('neo4j-driver').v1;
//var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic("neo4j","neo4j"));
var driver = neo4j.driver('bolt://hobby-fgnnmjnckhclgbkeioopeial.dbs.graphenedb.com:24786',neo4j.auth.basic("heroku-user","b.xRXKM5qHdFN7.MZiHqh0HQmrORtWI"));
var session = driver.session();
var User = require('../model/user.model');
var debug = false;

routes.get('/users', function (req,res){
    debug?console.log('test'):false;
    res.contentType('application/json');
    session.run("MATCH (n:User) RETURN n")
        .then(function(result){
            res.status(200).json(result.records);
            // result.records.forEach(function (record)
            // { debug?console.log(record._fields[0]):false; });
        })
        .catch(function(error) {debug?console.log(error):false;});
});

routes.get('/users/:id', function (req,res){
    debug?console.log('test'):false;
    res.contentType('application/json');
    session.run("MATCH (n:User) WHERE n.id = '"+req.params.id +"' RETURN n LIMIT 1")
        .then(function(result){
            res.status(200).json(result.records);
        })
        .catch(function(error) {debug?console.log(error):false;});
});

routes.post('/users/search/:search', function (req,res){
    debug?console.log('search'):false;
    res.contentType('application/json');
  //  { Name: n.name , Born: n.born } as Person

    /*
    Match(n:User) Where ID(n) = 1 Create (b:Deck {name: 'test',made_by: n.made_by, description: 'test', hero_type: 'test', cards:['test','test'], userId: ID(n)})<-[rel:Made]-(n)
     */
    session.run('MATCH (n:User) WHERE toLower(n.name) CONTAINS toLower("'+req.params.search+'") RETURN { id:ID(n), name: n.name, made_by: n.name } as User')
        .then(function(result){
           var tmpArr = [];
            result.records.forEach(function (record){
                var tmpName;
                var tmpMadeBy;
                var tmpId;
                var tmp = new User(record);

                // ----
                var tmpUserObj = [];

                tmpId =tmp._node._fields[0].id.low;
                tmpName= tmp._node._fields[0].name;
                tmpMadeBy = tmp._node._fields[0].made_by;

                tmpUserObj.push(tmpId);
                tmpUserObj.push(tmpName);
                tmpUserObj.push(tmpMadeBy);

                tmpArr.push(tmpUserObj);


            });
             debug?console.log(tmpArr):false;
            res.status(200).json(tmpArr);
        })
        .catch(function(error) {debug?console.log(error):false;});
});


module.exports = routes;
