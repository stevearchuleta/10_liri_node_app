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
var dataline1;
var dataline2;
var dataline3;
var dataline4;
var dataline5;
var dataline6;
var dataline7;
var dataline8;
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
    dataline1 = searchItem + 'is playing at ' + JSON.parse(body)[0].venue.name + ", " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region + ", " + JSON.parse(body)[0].venue.country;

    dataline2 = moment(JSON.parse(body)[0].datetime).format('MM/DD/YYYY');
    console.log(dataline1);
    console.log(dataline2);
    logFile();
  }
});
};

function spotifyThis(songName){
  if (!searchItem) {
    searchItem = 'Le Onde by Ludovico Einaudi'
  }
  spotify.search({ type: 'track', query: songName, limit: 5 }, function (error, response){
    if (error) {
      return console.log('An error occured. ' + error);
    }
    dataline3 = '/nArtist: ' + JSON.stringify(response.tracks.items[0].artist);
    dataline4 = '/nSong: ' + JSON.stringify(response.tracks.items[0].name);
    dataline5 = '/nSpotify Sample: ' + JSON.stringify(response.tracks.album.itmes.artists[0].external_urls.spotify);
    dataline6 = '/nAlbum: ' + JSON.stringify(response.tracks.items[0])
    console.log(dataline1);
    console.log(dataline2);
    console.log(dataline3);
    console.log(dataline4);
    logFile();
  });
  ;}
  

function movieThis(movieName){

    if (!searchItem) {
      searchItem = 'A Man For All Seasons'
    }
    request('http://www.omdbapi.com/?apikey=5170ef64&t=' + searchItem, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      dataline1 = 'Title: ' + JSON.parse(body).Title;
      dataline2 = 'Release Year: ' + JSON.parse(body).Year;
      dataline3 = 'IMDb Rating: ' + JSON.parse(body).imdbRating;
      dataline4 = 'Rotten Tomatoes Rating: ' + JSON.parse(body).Rating;
      dataline5 = 'Country: ' + JSON.parse(body).Country;
      dataline6 = 'Language: ' + JSON.parse(body).Language;
      dataline7 = 'Plot ' + JSON.parse(body).Plot;
      dataline8 = 'Actors ' + JSON.parse(body).Actors;
      console.log(dataline1);
      console.log(dataline2);
      console.log(dataline3);
      console.log(dataline4);
      console.log(dataline5);
      console.log(dataline6);
      console.log(dataline7);
      console.log(dataline8);
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
  fs.appendFile('./log.txt', '\r\n' + commandLine + '\r\n' + dataline1 + '\r\n' + dataline2 + '\r\n' + dataline3 + '\r\n' + dataline4 + '\r\n' + dataline5 + '\r\n' +  dataline6 + '\r\n' + dataline7 + '\r\n' + dataline8, function (error){
    if (error){
      return (console.log(error));
    }
  })
};