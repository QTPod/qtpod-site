const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require('mongoose');

const podcastData = require("./podCastData");
const app = express();

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

// the uri for connecting to mongo
// format: mongodb://user:password@host/database
// var mongoUri = process.env.MONGO_URI || "mongodb://cs290_korsnest:gobeavers@classmongo.engr.oregonstate.edu/cs290_korsnest";
var mongoUri = "mongodb://localhost/test"; // for connecting to a locally running mongodb instance

// connecting to the mongo database via mongoose
mongoose.connect(mongoUri);

const Schema = mongoose.Schema;

const podSchema = new Schema({
    name: String,
    urlname: String,
    author: String,
    url: String,
    episodes: [String]
});

const Pod = mongoose.model("podcasts", podSchema);

app.get("/", function(req, res)
{
    res.redirect("/home");
});

app.get("/home", function(req, res)
{
    /*
    var data = Pod.findOne({urlname: "thisamericanlife"}).exec(function(err, data)
    {
        if(err) return next(err);
        data.episodes = ["episode 1", "episode 2", "episode 3", "episode 4", "episode 5", "episode 6", "episode 7", "episode 8", "episode 9", "episode 10"];
        data.save(function(err){});
    });
    */
    
    /*
    var newPod = new Pod({
        name: "This American Life",
        urlname: "thisamericanlife",
        author: "This American Life",
        url: "http://is5.mzstatic.com/image/thumb/Music71/v4/03/3c/f1/033cf19b-a70e-108f-2d77-82c5b8c8cde0/source/600x600bb.jpg",
        episodes: ["test1", "test2", "test3", "test4", "test5", "test6"]
    });
    
    newPod.save(function(err){});
    */
    
    Pod.find({}).exec(function(err, data)
    {
        if(err) return next(err);
        
        var tempData =
        {
            allPodcasts: data.slice(0, 5)
        };
        res.render("home", tempData);
    });
});

app.get("/podcasts/popular", function(req, res)
{
    Pod.find({}).exec(function(err, data)
    {
        if(err) return next(err);
        res.render("popular", {allPodcasts: data});	
    });
});

app.get("/podcast/:id", function(req, res)
{
    Pod.find({urlname: req.params.id}).exec(function(err, data)
    {
        if(err) return next(err);
        if(data)
        {
            var tempData =
            {
                allPodcasts: data,
                allEpisodes: data[0].episodes 
            };
            
            res.render("podcastpage", tempData);
        } 
    });
});

app.get("/search/:id", function(req, res)
{
    var search = req.params.id;
    search = search ? search.toLowerCase() : '';
    decodeURI(search);
    search = search.replace(/\s/g, '');

    Pod.find({}).exec(function(err, data)
    {
        if(err) return next(err);
        if(data)
        {
            var tempData = [];
            
            for(var i = 0; i < data.length; i++)
            {
                if(data[i].urlname.indexOf(search) != -1)
                    tempData.push(data[i]);
            }
            
            if(tempData.length == 0)
                res.render("podnotfound", {searchquery: req.params.id});
            else
                res.render("search", {allPodcasts: tempData, searchquery: req.params.id});
        }
    });
});

app.use(function(req, res) {
    res.status(404);
    res.render("404");
});

app.use(function(err, req, res, next) {
    res.status(500);
    res.type("text/plain");
    res.send("Something went wrong!" + err.stack);
});

app.listen(process.env.PORT || 3000);