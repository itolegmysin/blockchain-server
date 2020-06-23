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
      studentMarks = marks.filter(({ studentId }) => studentId === id);
      res.send(studentMarks);
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

  // app.put("/api/marks", jsonParser, function (req, res) {
  //   if (!req.body) return res.sendStatus(400);
  //   const _id = req.body.id;
  //   const { course, name, speciality } = req.body;
    // const mark = new Mark(addBlock([], { _id, mark: 7, subject: 'Some subject', studentId: '5ee0f41c09bbe02e05eb8c7e' }));
    // console.log(mark);
    // Mark.findOneAndUpdate({ _id }, mark, function (err, mark) {
    //   if (err) return console.log(err);
    //   res.send(mark);
    // });
    // res.send(mark);
  // });
  // });

  return app;
}
