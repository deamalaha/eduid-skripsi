const uri = "mongodb+srv://deamalaha:ipan1203@eduid-skripsi.y8juuu1.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require('mongoose')

const express = require('express')
const app = express()

mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});