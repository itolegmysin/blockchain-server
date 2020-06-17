const mongoose = require("mongoose");
const express = require("express");
const jsonParser = express.json();
const markScheme = require("../schemas/mark");
const Mark = mongoose.model("Marks", markScheme);

const { generateGenesisBlock, addBlock } = require('../blockchain-helpers');


module.exports = (app) => {
  app.get("/api/marks", function (req, res) {
    Mark.find({}, function (err, marks) {
      if (err) return console.log(err);
      res.send(marks);
    });
  });

  app.get("/api/marks/:studentId", function (req, res) {
    const id = req.params.studentId;
    Mark.find({}, function (err, marks) {
      if (err) return console.log(err);
      studentMarks = marks.filter(({ _id }) => _id === id);
      res.send(studentMarks);
    });
  });

  app.get("/api/marks/:id", function (req, res) {

    const id = req.params.id;
    Mark.findOne({ _id: id }, function (err, mark) {

      if (err) return console.log(err);
      res.send(mark);
    });
  });

  app.post("/api/marks", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const { mark, subject, studentId } = req.body;
    console.log(req.body);

    Mark.find({}, function (err, marks) {
      newMark = !marks.length
        ? new Mark(generateGenesisBlock({ mark, subject, studentId }))
        : new Mark(addBlock(marks, { mark, subject, studentId }));
      newMark.save(function (err) {
        if (err) return console.log(err);
        res.send(newMark);
      });
    })

  });

  app.delete("/api/marks/:id", function (req, res) {

    const id = req.params.id;
    Mark.findByIdAndDelete(id, function (err, mark) {

      if (err) return console.log(err);
      res.send(mark);
    });
  });

  app.put("/api/marks", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const { course, name, speciality } = req.body;
    const mark = new Mark({ name, course, speciality });

    Mark.findOneAndUpdate({ _id: id }, mark, { new: true }, function (err, user) {
      if (err) return console.log(err);
      res.send(user);
    });
  });

  return app;
}
