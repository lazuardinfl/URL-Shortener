'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');
var validUrl = require('valid-url');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});

/* Database Connection */
let uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  original : {type: String, required: true},
  short: Number
})

let Url = mongoose.model('Url', urlSchema)

let bodyParser = require('body-parser')
let responseObject = {}

app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), async (request, response) => {
  let inputUrl = request.body['url']
  
  let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
  
  // invalid url
  if (!validUrl.isWebUri(inputUrl)){
    response.json({error: 'Invalid URL'});
    return;
  }
  else {
    const urlData = await Url.findOne({original: inputUrl});
    // new url
    if (!urlData) {
      const count = await Url.estimatedDocumentCount();
      const newUrl = new Url({
        original: inputUrl,
        short: count + 1
      });
      await newUrl.save();
      response.json({
        original_url: newUrl.original,
        short_url: newUrl.short,
        link: 'https://url-shortener.lazuardi.repl.co/api/shorturl/' + newUrl.short
      });
      return
    }
    // url exist
    response.json({
      original_url: urlData.original,
      short_url: urlData.short,
      link: 'https://url-shortener.lazuardi.repl.co/api/shorturl/' + urlData.short
    });
    return
  }
})

app.get('/api/shorturl/:input', (request, response) => {
  let input = request.params.input
  
  Url.findOne({short: input}, (error, result) => {
    if(!error && result != undefined){
      response.redirect(result.original)
    }else{
      response.json('URL not Found')
    }
  })
})
