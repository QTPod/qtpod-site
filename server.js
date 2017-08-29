const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

// var mongoUri = process.env.MONGO_URI || "mongodb://user:password@host/database";
var mongoUri = "mongodb://localhost/test";

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
    decodeURI(search);
    search = search.toLowerCase().replace(/\s/g, '');

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
            
            if(tempData.length != 0)
                res.render("search", {allPodcasts: tempData, searchquery: req.params.id});
            else
                res.render("search", {searchquery: req.params.id});
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
