const express = require('express')
const app = express()
const request = require('request');
const cheerio = require('cheerio')
const dbConfig = require('./config/firebase.config.js')
const serviceAccount = require('./config/serviceAccountKey.json');
const firebase = require('firebase-admin')

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: dbConfig.databaseURL
});

const puppyBreeds = [
    'american eskimo',
    'poodle',
    'bearded collie',
    'great pyrenees',
    'bernese mountain',
    'samoyed',
    'newfoundland',
    'sheepdog',
    'spitz',
    'havanese',
    'keeshond'
]



function checkBreed(breed) {
    for (var dog of puppyBreeds) {
        if (breed.includes(dog)) {
            return true
        }
    }
    return false
}

function writeDogData(dogId, description, breed) {
    firebase.database().ref('/dogs/' + dogId).set({
        'description': description,
        'breed': breed,
        'notification': 0
    })
}

firebase.database().ref('/dogs/').once("value", function(data) {
    console.log(data.val())
});

request('http://petharbor.com/results.asp?searchtype=ADOPT&friends=1&samaritans=1&nosuccess=0&rows=200&imght=120&imgres=thumb&tWidth=200&view=sysadm.v_austin&nobreedreq=1&bgcolor=ffffff&text=29abe2&link=024562&alink=017db3&vlink=017db3&fontface=arial&fontsize=10&col_hdr_bg=29abe2&col_hdr_fg=29abe2&col_fg=29abe2&SBG=ffffff&zip=78704&miles=10&shelterlist=%27ASTN%27&atype=&where=type_DOG%2Cage_y&PAGE=1', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    let $ = cheerio.load(html)
    $('.ResultsTable tr').each(function(i, el){
        let tableData = $(this).children()
        let id = tableData.eq(1).text()
        let desc = tableData.eq(2).text()
        let breed = tableData.eq(3).text()
        if (checkBreed(breed.toLowerCase())) {
           //writeDogData(id, desc, breed)
        }   
    })    
  }
});

app.get('/', (req, res) => {
    res.send('')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
