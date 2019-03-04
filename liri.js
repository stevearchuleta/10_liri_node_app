//Liri.js 

// STEP I. variables (and required packages)

// 1. REQUIRE .env FILE: this dotenv package sets environmental variables into process.env from a .env file. These values are used within this computer; anyone cloning my node must create their own .env file and not use my keys.
require("dotenv").config();

// 2. REQUIRE .keys FILE
var keys = require('./keys.js');

// 3. REQUIRE REQUEST
var request = require('request');

// 4. REQUIRE FILE SYSTEM
var fs = require('fs');

// 5. REQUIRE AXIOS
// var axios = require('./axios');

// 6. REQUIRE MOMENT
var moment = require('moment');

// 7. REQUIRE / INITIALIZE SPOTIFY
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// 8.  OMDB AND BANDS-IN-TOWN API's
var omdb = (keys.omdb);
// var bandsInTown = (key.bandsintown);

// 9. ACCEPT USER COMMAND LINE ARGUMENTS AND INPUTS
var command = process.argv[2];
// var userQuery = process.argv.slice(3).join('');

var searchItem = '';
var dataLine1;
var dataLine2;
var dataLine3;
var dataLine4;
var dataLine5;
var dataLine6;
var dataLine7;
var dataLine8;
var commandLine = '';

//the logic within this for loop concatenates the process.argv inputs (the user input: movie title, song name, etc...) and assigns them to a variable called 'commandLine'.  The empty space within quotations separates each word.
for(var i = 0; i < process.argv.length; i++) {
  commandLine += (process.argv[i] + " ");
};

for (i = 3; i < process.argv.length; i++) {
  searchItem += (process.argv[i] + " ");
}

searchItem = searchItem.trim();


// STEP II. switch case logic (in lieu of if/else conditionals)
// Here, we pass in the userInput and userQuery as arguments.

  switch (command) {
    case 'concert-this':
    concertThis();
    break;
    case 'spotify-this-song':
    spotifyThis();
    break;
    case 'movie-this':
    movieThis();
    break;
    case 'do-what-it-says':
    doWhatItSays();
    break;
    default:
    // console.log("I do not understand!")
    break;
  }


function concertThis(){  
  if (!searchItem){
    searchItem = 'Jimmy Buffet'
  }

  // var message = `SEARCHING FOR ${userQuery}'s NEXT PERFORMANCE.`
  
  request("https://rest.bandsintown.com/artists/" + searchItem + "/events?app_id=ee388fbe45944a2e54ad668916eaac75", function (error, response, body){
  // if (error){
  //   return console.log('An error occured.');
  // }
  // var userBand = (JSON.parse(body)[0]);
  if (JSON.parse(body)[0] === undefined) {
    console.log ('No upcoming shows found.')
  }
  else {
    dataLine1 = searchItem + 'is playing at ' + JSON.parse(body)[0].venue.name + ", " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region + ", " + JSON.parse(body)[0].venue.country;

    dataLine2 = moment(JSON.parse(body)[0].datetime).format('MM/DD/YYYY');
    console.log(dataLine1);
    console.log(dataLine2);
    logFile();
  }
});
};

function spotifyThis(){
  if (!searchItem) {
    searchItem = 'Le Onde by Ludovico Einaudi'
  }
  spotify.search({ type: 'track', query: searchItem}, function (error, response){
    if (error) {
      return console.log('An error occured. ' + error);
    }
    dataLine1 = '/nArtist: ' + JSON.stringify(response.tracks.items[0].artist[0].name);
    dataLine2 = '/nSong: ' + JSON.stringify(response.tracks.items[0].name);
    dataLine3 = '/nSpotify Sample: ' + JSON.stringify(response.tracks.album.items.artists[0].external_urls.spotify);
    dataLine4 = '/nAlbum: ' + JSON.stringify(response.tracks.items[0])
    console.log(dataLine1);
    console.log(dataLine2);
    console.log(dataLine3);
    console.log(dataLine4);
    logFile();
  });
  ;}
  

function movieThis(movieName){

    if (!searchItem) {
      searchItem = 'A Man For All Seasons';
    }
    request('http://www.omdbapi.com/?apikey=5170ef64&t=' + searchItem, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      dataLine1 = 'Title: ' + JSON.parse(body).Title;
      dataLine2 = 'Release Year: ' + JSON.parse(body).Year;
      dataLine3 = 'IMDb Rating: ' + JSON.parse(body).imdbRating;
      dataLine4 = 'Rotten Tomatoes Rating: ' + JSON.parse(body).Rating;
      dataLine5 = 'Country: ' + JSON.parse(body).Country;
      dataLine6 = 'Language: ' + JSON.parse(body).Language;
      dataLine7 = 'Plot ' + JSON.parse(body).Plot;
      dataLine8 = 'Actors ' + JSON.parse(body).Actors;
      console.log(dataLine1);
      console.log(dataLine2);
      console.log(dataLine3);
      console.log(dataLine4);
      console.log(dataLine5);
      console.log(dataLine6);
      console.log(dataLine7);
      console.log(dataLine8);
      logFile();
    }
  });
}

function doWhatItSays(){
  fs.readFile('random.txt', 'utf8', function(error, data){
    if (error){
      return console.log(error);
    }
    var dataArr = data.split(',');
    command = dataArr[0];
    searchItem = dataArr[1];
    spotifyThis();
  })
}

function logFile(){
  fs.appendFile('./log.txt', '\r\n' + commandLine + '\r\n' + dataLine1 + '\r\n' + dataLine2 + '\r\n' + dataLine3 + '\r\n' + dataline4 + '\r\n' + dataline5 + '\r\n' +  dataline6 + '\r\n' + dataLine7 + '\r\n' + dataLine8, function (error){
    if (error){
      return (console.log(error));
    }
  })
};