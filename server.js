import express from "express";

import * as fs from "fs";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

import { returnAnswer, processGuess, generateWordle } from "./wordle_server.js";
console.log(generateWordle);

const app = express();
//const server = https.createServer(cred, app);
var files = fs.readdirSync(__dirname+"/assets/images");
var hsh = fs.readdirSync(__dirname+"/assets/images/headshots");

app.use(express.static(path.join(__dirname, "public")));
app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/newGeo.html');
})

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
    const n = fs.readFile(file, "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        var lines = data.split('\n');
        var line = lines[Math.floor(Math.random() * lines.length)]
        res.send(line)
    })
    //possibly generate random number on cleint side to reduce overhead latency?
});

app.listen(80, ()=>{
    console.log("user connected");
})
