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
/*
var data = Pod.findOne({urlname: "thedaily"}).exec(function(err, data) 
{
    if(err) return next(err); 
    data.episodes = ["Tuesday, Sep 5, 2017", "Bonus: Senator Jeff Flake Interview", "Thursday, Aug 31, 2017", "Wednesday, Aug 30, 2017", "Tuesday, Aug 29, 2017", "Monday, Aug 28, 2017", "Friday, Aug. 25, 2017", "Thursday, Aug. 24, 2017", "Wednesday, Aug. 23, 2017", "Tuesday, Aug. 22, 2017", "Monday, Aug. 21, 2017", "Special Edition: The Fall of Steve Bannon", "Friday, Aug. 18, 2017", "Thursday, Aug. 17, 2017", "Wednesday, Aug. 16, 2017", "Tuesday, Aug. 15, 2017", "Monday, Aug. 14, 2017"]; 
    data.save(function(err){}); 
}); 
*/

    res.render("home");
});

app.get("/about", function(req, res)
{
    Pod.find({}).exec(function(err, data)
    {
        if(err) return next(err);
        
        var tempData =
        {
            allPodcasts: data.slice(0, 6)
        };
        res.render("about", tempData);
    });
});

app.get("/browse", function(req, res)
{
    res.redirect("/browse/popular");
});

app.get("/browse/popular", function(req, res)
{
    Pod.find({}).exec(function(err, data)
    {
        if(err) return next(err);
        res.render("browse", {allPodcasts: data, sort: "Popular"});
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
