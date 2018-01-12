const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');
var express = require("express");
var bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("./views"))
app.set("view engine", "ejs");










var trans = {address:"",
            tem:"",
            semtem:"",
            summary:""};

app.get("/", function(req, res){
     res.render("index",{trans});
});

app.post("/", function(req, res){
    geocode.geocodeAddress(req.body.temp, (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    trans.address = results.address;
    weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
      if (errorMessage) {
       // console.log(errorMessage);
           res.redirect("/");
      } else {
        trans.tem=weatherResults.temperature;
          trans.ctem = Math.round((weatherResults.temperature - 32) * 5/9,2);
          trans.semtem= weatherResults.apparentTemperature;
          trans.csemtem =Math.round((weatherResults.apparentTemperature - 32)*5/9,2) ;
          trans.summary=weatherResults.summary;
           res.redirect("/");
      }
    });
  }
});

   
});




app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
