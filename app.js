require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// setting the spotify-api goes here:

app.get('/',function(req,res,next){
    res.render('home')
})

app.get('/artist-search',function(req,res,next){
    spotifyApi
  .searchArtists(`${req.query.artist}`)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results',{
       artists : data.body.artists.items  
    } )
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/album/:id', function (req, res, next) {
  spotifyApi
  .getArtistAlbums(`${req.params.id}`)
  .then(
  function(data) {
    console.log('Artist albums', data.body.items);
    res.render('album',{albums: data.body.items})
  })
  .catch(err=> console.log('Oops, something wrong', err))
 
})

app.get('/Tracks/:id',(req,res,next)=>{ 
  spotifyApi
  .getAlbumTracks(`${req.params.id}`)
  .then(data => {
    console.log('tracks', data.body.items);
    res.render('Tracks',{tracks:data.body.items})
  })
})
 


  

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
