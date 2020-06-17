const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
const app = express();
const markScheme = require("./schemas/mark");

const Mark = mongoose.model("Mark", markScheme);

// Connection URL
const url = 'mongodb://localhost:27017';

app.use(cors())
app.use(express.static(__dirname + "/public"));
require('./routes/students')(app);
require('./routes/marks')(app);

// const students = [
//   { name: "Bob", course: 1, speciality: 'POKS' },
//   { name: "Jack", course: 1, speciality: 'WEB' },
//   { name: "Pavel", course: 2, speciality: 'PM' },
//   { name: "Max", course: 1, speciality: 'POKS' },
//   { name: "Alice", course: 2, speciality: 'WEB' },
//   { name: "Tom", course: 3, speciality: 'PM' },
//   { name: "Liza", course: 3, speciality: 'WEB' }
// ];

mongoose.connect("mongodb://localhost:27017/students", { useNewUrlParser: true }, function(err, client){
    if(err) return console.log(err);

    app.listen(4000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

process.on("SIGINT", () => {
  // dbClient.close();
  process.exit();
});
