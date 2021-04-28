require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req,res,next) => {
    console.log('welcome to homepage')
    res.render('home')
})
app.get('/artist-search', (req,res,next) => {
  spotifyApi
  .searchArtists(`${req.query.artist}`)
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artists:data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/albums/:id', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
  .getArtistAlbums(`${req.params.id}`)
  .then(data=> {
    console.log('The albums', data.body.items);
    res.render('album',{albums:data.body.items})
  })
  .catch(err=> console.log('Oops, something wrong', err))
});
app.get('/:id',(req,res,next)=>{ 
  spotifyApi
  .getAlbumTracks(`${req.params.id}`)
  .then(data => {
    console.log('Tracks', data.body);
    console.log('artists tracks', data.body);
    res.render('tracks',{tracks:data.body})
  })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
