import express from "express";
import * as fs from "fs";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

//import { returnAnswer, processGuess, generateWordle } from "./wordle_server.js";
//console.log(generateWordle);

const app = express();
//const server = https.createServer(cred, app);
//var files = fs.readdirSync(__dirname+"/assets/images");
//var hsh = fs.readdirSync(__dirname+"/assets/images/headshots");

app.use(express.static(path.join(__dirname, "public")));
app.get('/', (req,res)=>{
    console.log("dd");
    res.sendFile(__dirname+'/geo.html');
})

app.get('/genHtml', async (req,res)=>{
    res.sendFile(__dirname+"/genHtml.js");
})

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


app.get('/randomLine', async(req, res)=>{
    const m = req.query.m;
    var file;
    if(m=='def'){
    file='coordinates.txt';
    }
    if(m=='c100k'){
    file='over100k.txt';
    }
    if(m=='c1m'){
    file='over1m.txt';
    }
    if(m=='eur'){
    file='eurocoords.txt';
    }
    if(m=='sam'){
    file='samcoords.txt'
    }
    console.log(file, m)
    const n = fs.readFile(__dirname+"/coordinates/"+file, "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        var lines = data.split('\n');
        var line = lines[Math.floor(Math.random() * lines.length)];
        res.send(line)
    })
// not possible cuz we dont kno the size of the file on the lient side
//we could however generate a random number between 0.00 and 1.00 and then multiply the amount of rows by that  :3
//16/09/25 i tried this but this is such a mess to implements

    //possibly generate random number on cleint side to reduce overhead latency?
});

app.listen(80, ()=>{
    console.log("user connected");
})
